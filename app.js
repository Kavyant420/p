/* ================================================================
   LIQUID CORE — app brain
   Qwen3 0.6B via transformers.js (WebGPU→WASM), rule-agent fallback,
   wake word ("hey <prefix>"), power-key / accessibility hook,
   IndexedDB workspace, notifications, PWA offline.

   ROBUSTNESS CONTRACT: zero console errors is a product requirement.
   Every runtime fault is captured, reported once to the user through
   the glass toast layer, and swallowed — never dumped raw.
   ================================================================ */
(() => {
'use strict';

/* ---------------- global fault containment ---------------- */
let _faultCount = 0;
function reportFault(where, err){
  try {
    _faultCount++;
    if (_faultCount > 12) return;                 // silence storms
    const msg = String((err && (err.message || err.reason)) || err || where).slice(0, 90);
    if (window.LCUI && LCUI.toast) LCUI.toast('core recovered · ' + where + ' — ' + msg, 'err');
  } catch (e) { /* nothing left to try */ }
}
addEventListener('error', (e) => {
  e.preventDefault();
  reportFault('runtime', e.error || e.message);
}, true);
addEventListener('unhandledrejection', (e) => {
  e.preventDefault();
  reportFault('async', e.reason);
});
// legacy hooks some WebViews still prefer
window.onerror = function(message, src, line, col, err){ reportFault('runtime', err || message); return true; };
window.addEventListener('unhandledrejection', () => {}, false);

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const LS = {
  get(k, d){ try{ const v = localStorage.getItem('lc:'+k); return v==null?d:JSON.parse(v);}catch(e){return d;} },
  set(k, v){ try{ localStorage.setItem('lc:'+k, JSON.stringify(v)); }catch(e){} }
};
const pulse3D = () => dispatchEvent(new Event('lc-pulse'));

/* ---------------- IndexedDB ---------------- */
const DB = (() => {
  let dbp = null;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const rq = indexedDB.open('liquid-core', 1);
    rq.onupgradeneeded = () => {
      const db = rq.result;
      ['notes','tasks','alarms'].forEach(s => {
        if (!db.objectStoreNames.contains(s))
          db.createObjectStore(s, { keyPath:'id', autoIncrement:true });
      });
    };
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  }));
  const run = async (store, mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction(store, mode);
      const req = fn(t.objectStore(store));
      t.oncomplete = () => res(req ? req.result : undefined);
      t.onerror = () => rej(t.error);
    });
  };
  return {
    add:(s,v)=>run(s,'readwrite',t=>t.add(v)),
    all:(s)=>run(s,'readonly',t=>t.getAll()),
    del:(s,id)=>run(s,'readwrite',t=>t.delete(id)),
    up:(s,v)=>run(s,'readwrite',t=>t.put(v))
  };
})();

/* ---------------- Engine: Qwen3 0.6B ---------------- */
const MODEL_ID = 'onnx-community/Qwen3-0.6B-ONNX';
const Engine = {
  mod:null, pipe:null, status:'idle', busy:false, els:{},
  init(){
    this.els = {
      state:$('#engineState'), sub:$('#engineSub'), bar:$('#bootBar'),
      log:$('#bootLog'), dl:$('#btnDownload'), boot:$('#btnBoot'),
      engDot:$('#engDot'), engLabel:$('#engLabel')
    };
    this.els.boot.addEventListener('click', () => this.load());
    this.els.dl.addEventListener('click', () => this.load());
  },
  say(t){ this.els.log.textContent = '// ' + t; },
  setBar(p){ this.els.bar.style.width = Math.max(0, Math.min(100, p)) + '%'; },
  progress(){
    this.els.dl.disabled = true; this.els.boot.disabled = true;
    const files = {};
    return (p) => {
      if (!p) return;
      if (p.status === 'progress' && p.file){
        files[p.file] = p.progress || 0;
        const v = Object.values(files);
        this.setBar(v.reduce((a,b)=>a+b,0)/v.length*100);
        this.say('pulling ' + String(p.file).split('/').pop() + ' · ' + Math.round((p.progress||0)*100) + '%');
      } else if (p.status === 'ready' && p.file){
        this.say(String(p.file).split('/').pop() + ' resident in cache ✓');
      }
    };
  },
  async load(){
    if (this.status === 'loading' || this.status === 'ready') return;
    this.status = 'loading';
    this.els.state.textContent = 'Fetching Qwen3 0.6B…';
    this.els.engLabel.textContent = 'ENGINE LOADING';
    this.els.engDot.classList.remove('idle');
    this.say('loading transformers.js runtime');
    try {
      if (!this.mod) this.mod = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2');
      const tfn = this.mod;
      tfn.env.allowLocalModels = false;
      tfn.env.useBrowserCache = true;
      const hasGPU = !!(navigator.gpu && await navigator.gpu.requestAdapter());
      const dtype = hasGPU ? 'q4' : 'q8';
      this.els.sub.textContent = 'qwen3-0.6b-onnx · ' + (hasGPU?'webgpu':'wasm') + ' · ' + dtype;
      this.say('negotiating device: ' + (hasGPU?'webgpu':'wasm cpu'));
      this.pipe = await tfn.pipeline('text-generation', MODEL_ID, {
        dtype, device: hasGPU ? 'webgpu' : 'wasm',
        progress_callback: this.progress()
      });
      this.status = 'ready';
      window.__LC_ENGINE_MOD__ = tfn;         // expose for js/learn.js fine-tuner
      window.__LC_ENGINE_PIPE__ = this.pipe;  // tokenizer + model handle
      if (window.Learn) Learn.attachEngine(this.pipe);
      this.els.state.textContent = 'Engine ready — fully local';
      this.els.boot.querySelector('.btn-txt').textContent = 'ENGINE ONLINE';
      this.els.engLabel.textContent = 'ENGINE LIVE';
      this.setBar(100);
      this.say('qwen3 0.6b resident · cached for offline forever');
      pulse3D();
      sysMsg('Qwen3 0.6B is running on your silicon. Go airplane-mode whenever you like.');
      updateCacheStats();
    } catch (err) {
      this.status = 'failed';
      this.els.state.textContent = 'Weights unavailable';
      this.els.engLabel.textContent = 'RULE AGENT';
      this.els.engDot.classList.add('err');
      this.els.dl.disabled = false; this.els.boot.disabled = false;
      this.say('weights could not load (' + String((err&&err.message)||err).slice(0,60) + ') — rule agent still acts locally');
    }
  },
  async generate(text, history){
    if (this.status !== 'ready' || !this.pipe || this.busy) return null;
    this.busy = true;
    try {
      const mem = await memoryDigest();
      // learned personalization: recall what fine-tuning/associative memory knows
      let learned = '';
      try {
        if (window.Learn){
          const hits = Learn.recall(text);
          if (hits.length) learned = '. Past exchanges you liked on similar asks: ' +
            hits.map(h => '"' + h.out.slice(0,80) + '"').join(' | ');
        }
      } catch(e){}
      const sys = 'You are Liquid Core, a private on-device assistant that executes tasks like alarms, timers and notes. ' +
        'Answer under 90 words, plain text, no markdown. Today: ' + new Date().toString() +
        (mem ? '. User local memory: ' + mem : '') + learned +
        (window.Voice ? '. The user named you "' + Voice.prefix + '". Respond to that name.' : '');
      const messages = [{ role:'system', content: sys }]
        .concat(history.slice(-6))
        .concat([{ role:'user', content: text }]);
      const t0 = performance.now();
      const out = await this.pipe(messages, {
        max_new_tokens: 200, temperature: 0.7, top_p: 0.8,
        chat_template_kwargs: { enable_thinking: false }
      });
      const dt = (performance.now() - t0) / 1000;
      let reply = (out && out[0] && out[0].generated_text) || '';
      // strip echoed template artifacts some builds return
      reply = reply.replace(/<\|[^|]*\|>/g, '')
                   .replace(/^[\s\S]*?(?:assistant\s*\n)?(?=<)/, '')
                   .trim();
      const lastAssistant = reply.lastIndexOf('assistant');
      if (lastAssistant > -1 && reply.length - lastAssistant < 40) reply = reply.slice(reply.indexOf('\n', lastAssistant) + 1).trim();
      const approxTok = Math.max(1, Math.round(reply.length / 4));
      const tps = $('#statTokens');
      if (tps) tps.textContent = (approxTok / Math.max(dt, .05)).toFixed(1);
      return reply || '…silence.';
    } catch (e) {
      return null;
    } finally {
      this.busy = false;
    }
  }
};

/* ---------------- Voice: TTS + STT + Wake word ---------------- */
const Voice = {
  prefix: LS.get('prefix', 'nova'),
  rec: null, armed: false, wantAutoArm: LS.get('autoArm', false),
  lastWake: 0, lastHeard: '',
  speak(text){
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02; u.pitch = 0.85; u.volume = 1;
      speechSynthesis.speak(u);
    } catch(e){}
  },
  supported(){ return !!(window.SpeechRecognition || window.webkitSpeechRecognition); },
  arm(){
    if (!this.supported()){ micState('EAR UNSUPPORTED IN THIS BROWSER — USE PUSH-TO-TALK'); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.rec = new SR();
    this.rec.continuous = true;
    this.rec.interimResults = true;
    this.rec.lang = 'en-US';
    let finalBuf = '';
    this.rec.onresult = (ev) => {
      let interim = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++){
        const r = ev.results[i];
        const t = r[0].transcript.trim();
        if (r.isFinal) finalBuf += ' ' + t; else interim += t;
      }
      const vt = $('#voTranscript');
      if (vt && voiceOpen) vt.textContent = (interim || finalBuf).trim();
      const wakeRe = new RegExp('\\b(?:hey|ok|yo)[ ,]?\\s*' + escapeRe(this.prefix) + '\\b', 'i');
      const all = (finalBuf + ' ' + interim).toLowerCase();
      this.lastHeard = all;
      if (wakeRe.test(all)){
        finalBuf = '';
        this.lastWake = Date.now();
        raiseAssistant(interim.replace(new RegExp(wakeReSource(this.prefix),'ig'),'').trim());
      } else if (voiceOpen && interim){
        // while overlay open, treat everything as the command
      }
      if (finalBuf.trim() && voiceOpen){
        const cmd = finalBuf.trim(); finalBuf = '';
        handleUserCommand(cmd, { voice: true });
      }
    };
    this.rec.onend = () => { if (this.armed) { try { this.rec.start(); } catch(e){} } };
    this.rec.onerror = (e) => {
      if (e.error === 'not-allowed'){ micState('MIC PERMISSION DENIED'); this.disarm(); }
    };
    try { this.rec.start(); this.armed = true; LS.set('autoArm', true);
      micState('EAR ARMED — SAY "HEY ' + this.prefix.toUpperCase() + '"');
    } catch(e){ micState('EAR BUSY — CLOSE OTHER LISTENERS'); }
  },
  disarm(){
    this.armed = false; LS.set('autoArm', false);
    try { this.rec && this.rec.stop(); } catch(e){}
    micState('EAR DISARMED');
  },
  toggle(){ this.armed ? this.disarm() : this.arm(); }
};
function wakeReSource(p){ return '(?:hey|ok|yo)[ ,]?\\s*' + escapeRe(p); }
function escapeRe(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function micState(t){ const el = $('#micState'); if (el){ el.textContent = t; el.classList.toggle('armed', t.startsWith('EAR ARMED')); } }

/* ---------------- Agent core ---------------- */
const history = [];
const NUM = {
  one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
  eleven:11,twelve:12,half:30,fifteen:15,twenty:20,thirty:30,forty:40,fifty:50,sixty:60
};
function parseNumber(str){
  str = (str||'').trim().toLowerCase();
  if (/^\d+(\.\d+)?$/.test(str)) return parseFloat(str);
  if (NUM[str] != null) return NUM[str];
  const m = str.match(/^([a-z]+)[- ]([a-z]+)$/);
  if (m && NUM[m[1]] && NUM[m[2]]) return NUM[m[1]] * NUM[m[2]]; // twenty minutes handled elsewhere
  return NaN;
}
function parseTimeFromText(txt){
  // explicit "7:30", "7am", "seven thirty", "noon", "midnight"
  txt = txt.toLowerCase();
  if (/\bnoon\b/.test(txt)) return { h:12, m:0 };
  if (/\bmidnight\b/.test(txt)) return { h:0, m:0 };
  let m = txt.match(/(\d{1,2})[:.](\d{2})\s*(am|pm)?/);
  if (m){
    let h = +m[1], min = +m[2], ap = m[3];
    if (ap === 'pm' && h < 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    if (!ap && h <= 7 && min > 0) h += 12; // heuristic: bare small times are morning-ish → keep as next occurrence anyway
    if (!ap) {} 
    return { h: h % 24, m: min };
  }
  m = txt.match(/(\d{1,2})\s*(am|pm)/);
  if (m){ let h = +m[1]; if (m[2]==='pm' && h<12) h+=12; if (m[2]==='am'&&h===12)h=0; return { h:h%24, m:0 }; }
  // spelled-out: "seven thirty", "six fifteen"
  const w = txt.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(oh |zero )?(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|twenty[- ]one|twenty[- ]two|twenty[- ]three|twenty[- ]four|twenty[- ]five|twenty[- ]six|twenty[- ]seven|twenty[- ]eight|twenty[- ]nine|half|thirty|forty|fifty)\b/);
  if (w){
    const h = NUM[w[1]];
    const mm = w[3] === 'half' ? 30 : NUM[w[3]] != null ? NUM[w[3]] : NaN;
    if (!isNaN(h)) return { h, m: isNaN(mm)?0:mm };
  }
  return null;
}
function nextOccurrence(h, m){
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  if (d <= now) d.setDate(d.getDate() + 1);
  return d;
}
async function memoryDigest(){
  try {
    const [notes, tasks] = await Promise.all([DB.all('notes'), DB.all('tasks')]);
    const bits = [];
    (notes.slice(-3)).forEach(n => bits.push('note: ' + n.text.slice(0,60)));
    tasks.filter(t=>!t.done).slice(-3).forEach(t => bits.push('open task: ' + t.text.slice(0,50)));
    return bits.join('; ').slice(0, 400);
  } catch(e){ return ''; }
}

/* Rule agent — always available, even with weights missing */
async function ruleAgent(raw){
  const t = raw.toLowerCase().trim();
  // ALARM
  let m = t.match(/(?:set |put |make )?an? ?alarm (?:for |at )?(.+)/) || t.match(/^alarm (.+)/) || (/(wake me at|remind me at)/.test(t) ? [null, t.split(/(?:wake me at|remind me at)\s*/)[1]] : null);
  if (m){
    const pt = parseTimeFromText(m[1]);
    if (pt){
      const when = nextOccurrence(pt.h, pt.m);
      await DB.add('alarms', { time: when.toISOString(), label: m[1].slice(0,40), fired:false });
      scheduleAlarm(when, m[1] || 'Alarm');
      renderAlarms();
      return 'Alarm locked for ' + when.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) + '. I will not be gentle.';
    }
    return 'Give me a time — “alarm at 7:15”, “alarm tomorrow 6am”.';
  }
  // TIMER
  m = t.match(/(?:set |start )?(?:a )?timer for (\S+\s?\S*)\s*(second|sec|minute|min|hour|hr)s?/) ||
     t.match(/wake me in (\S+\s?\S*)\s*(second|sec|minute|min|hour|hr)s?/) ||
     t.match(/timer (\d+)\s*(s|min|m|h|hours?)/);
  if (m){
    let n = parseNumber(m[1]);
    let unit = (m[2]||'').toString();
    if (isNaN(n)){ // "five minutes" split weirdly
      const alt = t.match(/in (\w+) (\w+)/); 
      if (alt){ n = parseNumber(alt[1]); unit = alt[2]; }
    }
    if (!isNaN(n)){
      let ms;
      if (/^s/.test(unit)) ms = n*1000;
      else if (/^(m|h)/.test(unit) && /hour|hr|^h$/.test(unit)) ms = n*3600e3;
      else ms = n*60e3;
      startTimer(ms, 'Timer · ' + n + ' ' + unit + 's');
      return 'Timer running: ' + n + ' ' + unit + 's. Clock starts now.';
    }
  }
  m = t.match(/(?:countdown|timer)\s+(\d+)/);
  if (m){ startTimer(parseNumber(m[1])*60e3, 'Timer'); return 'Timer started.'; }
  // NOTE
  m = raw.match(/^(?:note|remember|jot)(?:\s*[:\-]\s*|\s+(?:that|down)\s+)(.*)/i);
  if (m && m[1].trim()){
    await DB.add('notes', { text: m[1].trim(), at: Date.now() });
    renderNotes();
    return 'Pinned to local memory: “' + m[1].trim().slice(0,60) + '”.';
  }
  if (/^(take a note|new note)/i.test(t)) return 'Say it after “note:” — e.g. “note buy graphite rods”.';
  // TASK
  m = raw.match(/^(?:add task|task|todo)(?:\s*[:\-]\s*|\s+(?:to )?)(.*)/i);
  if (m && m[1].trim()){
    await DB.add('tasks', { text: m[1].trim(), done:false, at: Date.now() });
    renderTasks();
    return 'Task queued: ' + m[1].trim() + '.';
  }
  if (/^(list|show)( my)? (tasks|todos)/.test(t)){
    const ts = await DB.all('tasks');
    const open = ts.filter(x=>!x.done);
    return open.length ? 'Open tasks: ' + open.map(x=>x.text).join(' · ') : 'Nothing pending. Clean slate.';
  }
  if (/^(list|show)( my)? notes/.test(t)){
    const ns = await DB.all('notes');
    return ns.length ? 'Recent notes: ' + ns.slice(-4).map(x=>x.text.slice(0,40)).join(' · ') : 'No notes yet.';
  }
  // TIME / DATE
  if (/^(what s the time|what time is it|time\??|current time)/.test(t.replace(/[^a-z ?]/g,' ').trim()))
    return 'Local time: ' + new Date().toLocaleTimeString();
  if (/what.*(day|date)|today s date/.test(t))
    return new Date().toLocaleDateString(undefined,{weekday:'long', year:'numeric', month:'long', day:'numeric'});
  // STOP / CLEAR
  if (/stop timer|cancel timer/.test(t)){ stopTimer(); return 'Timer killed.'; }
  if (/clear alarms?/.test(t)){ /* handled by UI */ }
  // OPEN SURFACES
  if (/open (workspace|notes)/.test(t)){ openSheet('#sheetWorkspace'); return 'Workspace raised.'; }
  if (/open alarm|show alarm/.test(t)){ openSheet('#sheetAlarms'); return 'Alarm panel up.'; }
  return null; // fall through to model
}

/* -------- unified handler: rules first, then Qwen3 -------- */
async function handleUserCommand(text, opts){
  opts = opts || {};
  if (!opts.noEcho) addUserMsg(text);
  history.push({ role:'user', content:text });
  trimHistory();
  const typing = aiMsg('…');
  pulse3D();
  let reply = await ruleAgent(text);
  if (reply == null && Engine.status === 'ready'){
    typing.querySelector('p').textContent = 'thinking…';
    reply = await Engine.generate(text, history);
  }
  if (reply == null){
    reply = casualFallback(text);
  }
  history.push({ role:'assistant', content: reply });
  trimHistory();
  typing.remove();
  aiMsg(reply, opts.voice);
  if (opts.voice) Voice.speak(reply);
  if (opts.voice) setTimeout(closeVoice, 6000);
  // feed the on-device learner — every exchange becomes training data locally
  try { if (window.Learn) Learn.record(text, reply, { voice: !!opts.voice, engine: Engine.status }); } catch(e){}
  // keep the SW alarm scheduler in sync after any action
  try { window.LCBackground && LCBackground.mirrorAlarmsToSW(); } catch(e){}
}
function casualFallback(t){
  const low = t.toLowerCase();
  const name = Voice.prefix;
  if (/who are you|what are you/.test(low))
    return 'I am ' + name + ' — Liquid Core. A Qwen3 0.6B instance living inside your browser cache. No cloud, no memory of you beyond this device.';
  if (/hello|hi\b|hey|sup|good (morning|evening|afternoon)/.test(low))
    return 'Online. Everything stays on this device — what do you need?';
  if (/can you (do|help)|what can you do|commands|features/.test(low))
    return 'Try: “alarm at 7”, “timer 20 minutes”, “note buy graphite”, “add task ship build”, “list notes”, “what time is it”. Everything executes locally.';
  if (/thank/.test(low)) return 'Anytime. Private by construction.';
  if (/why|how.*(offline|private|work)/.test(low))
    return 'The weights download once, get pinned by the service worker, then inference runs on WebGPU or WASM right here. After install I work in airplane mode.';
  return 'Not wired as a hard command, and the neural engine is offline — so acting as the rule agent: I handle alarms, timers, notes, tasks and time. Boot the engine above for free-form answers.';
}
function trimHistory(){ while (history.length > 14) history.shift(); }

/* ---------------- Chat UI ---------------- */
const chatScroll = () => $('#chatScroll');
function addUserMsg(t){
  const d = document.createElement('div');
  d.className = 'msg msg-you';
  d.textContent = t;
  chatScroll().appendChild(d); scrollBottom();
}
function aiMsg(t, isVoice){
  const d = document.createElement('div');
  d.className = 'msg msg-ai';
  const tag = document.createElement('span');
  tag.className = 'tag mono';
  tag.textContent = isVoice ? 'CORE · VOICE' : 'CORE';
  const p = document.createElement('p');
  p.textContent = t;
  d.append(tag, p);
  chatScroll().appendChild(d); scrollBottom();
  return d;
}
function sysMsg(t){
  const d = document.createElement('div');
  d.className = 'msg sys';
  d.textContent = t;
  chatScroll().appendChild(d); scrollBottom();
}
function scrollBottom(){ const c = chatScroll(); c.scrollTop = c.scrollHeight; }

/* ---------------- Alarms / Timers / Notify ---------------- */
let timerInt = null, timerEnd = 0;
function notify(title, body, vib){
  try {
    const ctrl = navigator.serviceWorker && navigator.serviceWorker.controller;
    if (Notification.permission === 'granted'){
      (ctrl ? ctrl.postMessage({type:'local-notification', title, body, vibrate:vib})
            : new Notification(title, { body, icon:'./icons/icon-192.png', vibrate: vib }));
    } else if (ctrl){
      ctrl.postMessage({type:'local-notification', title, body, vibrate:vib});
    }
  } catch(e){}
  if (navigator.vibrate) navigator.vibrate(vib || [220,90,220,90,320]);
}
function ensureNotifyPerm(){
  try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch(e){}
}
function startTimer(ms, label){
  stopTimer();
  timerEnd = Date.now() + ms;
  LS.set('timerEnd', timerEnd); LS.set('timerLabel', label);
  tickTimer();
  timerInt = setInterval(tickTimer, 250);
}
function tickTimer(){
  const rem = timerEnd - Date.now();
  const el = $('#timerRead');
  if (rem <= 0){
    stopTimer();
    if (el) el.textContent = '00:00';
    notify('⏱ ' + (LS.get('timerLabel','Timer')), 'Time’s up.', [400,150,400,150,600]);
    aiMsg('Timer finished. That was your countdown.');
    LS.set('timerEnd', null);
    return;
  }
  const s = Math.ceil(rem/1000);
  const txt = [Math.floor(s/3600), Math.floor(s%3600/60), s%60].filter((_,i)=> i>0 || s>=3600)
            .map(x=>String(x).padStart(2,'0')).join(':');
  if (el) el.textContent = txt;
}
function stopTimer(){ if (timerInt){ clearInterval(timerInt); timerInt = null; } }
async function scheduleAlarm(date, label){
  const ms = date - Date.now();
  if (ms <= 0) return;
  setTimeout(() => {
    notify('⏰ Alarm · ' + (label||''), date.toLocaleTimeString(), [500,200,500,200,900]);
    aiMsg('ALARM — ' + (label || date.toLocaleTimeString()) + '. Rise.');
    Voice.speak('Alarm. ' + (label || ''));
    pulse3D();
  }, ms);
}
async function restoreAlarms(){
  const alarms = await DB.all('alarms');
  const now = Date.now();
  for (const a of alarms){
    const t = new Date(a.time).getTime();
    if (t > now) scheduleAlarm(new Date(t), a.label);
  }
  const te = LS.get('timerEnd', null);
  if (te && te > now){ timerEnd = te; timerInt = setInterval(tickTimer, 250); tickTimer(); }
}
async function renderAlarms(){
  const ul = $('#alarmList'); if (!ul) return;
  const alarms = (await DB.all('alarms')).sort((a,b)=> new Date(a.time)-b.time);
  ul.innerHTML = '';
  alarms.forEach(a => {
    const li = document.createElement('li');
    const d = new Date(a.time);
    li.innerHTML = '<span>' + d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) + ' · ' + esc(a.label||'') + '</span>';
    const btn = document.createElement('button'); btn.textContent = '✕';
    btn.onclick = async () => { await DB.del('alarms', a.id); renderAlarms(); };
    li.appendChild(btn); ul.appendChild(li);
  });
  const ph = $('#phActions');
  if (ph && alarms[0]) ph.firstElementChild.textContent = 'Alarm — ' + new Date(alarms[0].time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ---------------- Workspace rendering ---------------- */
async function renderNotes(){
  const ul = $('#pinList'); if (!ul) return;
  const notes = (await DB.all('notes')).sort((a,b)=>b.at-a.at);
  ul.innerHTML = '';
  notes.slice(0,20).forEach(n => {
    const li = document.createElement('li');
    const sp = document.createElement('span'); sp.textContent = n.text;
    const b = document.createElement('button'); b.textContent = '✕';
    b.onclick = async () => { await DB.del('notes', n.id); renderNotes(); };
    li.append(sp, b); ul.appendChild(li);
  });
  const c = $('#noteCount'); if (c) c.textContent = notes.length + ' saved';
}
async function renderTasks(){
  const ul = $('#taskList'); if (!ul) return;
  const tasks = (await DB.all('tasks')).sort((a,b)=>b.at-a.at);
  ul.innerHTML = '';
  tasks.forEach(tk => {
    const li = document.createElement('li');
    li.className = tk.done ? 'done' : '';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!tk.done;
    cb.onchange = async () => { tk.done = cb.checked; await DB.up('tasks', tk); renderTasks(); };
    const sp = document.createElement('span'); sp.textContent = tk.text; sp.style.flex = '1';
    const b = document.createElement('button'); b.textContent = '✕';
    b.onclick = async () => { await DB.del('tasks', tk.id); renderTasks(); };
    li.append(cb, sp, b); ul.appendChild(li);
  });
}

/* ---------------- Sheets / dock ---------------- */
function openSheet(sel){
  const s = $(sel); if (!s) return;
  s.hidden = false; requestAnimationFrame(()=>s.classList.add('open'));
}
function closeSheets(){ $$('.sheet').forEach(s => { s.classList.remove('open'); setTimeout(()=>s.hidden=true, 350); }); }
$$('[data-close-sheet]').forEach(b => b.addEventListener('click', closeSheets));
$$('.sheet').forEach(s => s.addEventListener('click', e => { if (e.target === s) closeSheets(); }));

/* ---------------- Voice overlay ---------------- */
let voiceOpen = false;
function openVoice(autoListen){
  const v = $('#voiceOverlay');
  v.hidden = false; requestAnimationFrame(()=>v.classList.add('open'));
  voiceOpen = true;
  $('#voTranscript').textContent = autoListen ? 'listening…' : 'speak your command';
  $('#voReply').textContent = '';
  if (autoListen && Voice.supported()){
    v.classList.add('live');
    startPushListen();
  }
}
function closeVoice(){
  const v = $('#voiceOverlay');
  v.classList.remove('open','live'); voiceOpen = false;
  setTimeout(()=>v.hidden=true, 380);
  stopPushListen();
}
let pushRec = null;
function startPushListen(){
  stopPushListen();
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  pushRec = new SR();
  pushRec.interimResults = true; pushRec.lang = 'en-US';
  pushRec.onresult = (e) => {
    let txt = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i] && e.results[i][0]) txt += e.results[i][0].transcript;
    }
    $('#voTranscript').textContent = txt;
    const lastResult = e.results && e.results[e.results.length - 1];
    if (lastResult && lastResult.isFinal){
      $('#voOrb').parentElement.classList.remove('live');
      handleUserCommand(txt.trim(), { voice:true });
      $('#voReply').textContent = '';
    }
  };
  pushRec.onend = () => { if (voiceOpen && pushRec) { try{ pushRec.start(); }catch(err){} } };
  try { pushRec.start(); } catch(e){}
}
function stopPushListen(){ try{ pushRec && pushRec.stop(); }catch(e){} pushRec = null; }
$('#voClose') && $('#voClose').addEventListener('click', closeVoice);

/* Raise assistant from wake word / power hold / URL hook */
function raiseAssistant(preText){
  pulse3D();
  if (navigator.vibrate) navigator.vibrate([90,40,90]);
  openVoice(false);
  const greet = 'Hey — I’m ' + Voice.prefix + '. What do you need?';
  $('#voTranscript').textContent = preText ? 'heard: “' + preText + '”' : 'wake word detected';
  $('#voReply').textContent = greet;
  Voice.speak(greet);
  if (Voice.supported()) { voiceOpen = true; $('#voiceOverlay').classList.add('live'); startPushListen(); }
  setTimeout(()=>{ if (voiceOpen && !preText) $('#voTranscript').textContent = 'listening…'; }, 1400);
}

/* ---------------- Cache stats / persistence ---------------- */
async function updateCacheStats(){
  try {
    if (navigator.storage && navigator.storage.estimate){
      const est = await navigator.storage.estimate();
      const mb = (est.usage || 0) / 1048576;
      $('#cacheUsed').textContent = mb > 1024 ? (mb/1024).toFixed(2)+' GB' : Math.round(mb)+' MB';
      const persist = navigator.storage.persisted ? await navigator.storage.persisted() : false;
      $('#storagePerm').textContent = persist ? 'GRANTED' : 'VOLATILE';
    }
  } catch(e){}
}
$('#btnPersist') && $('#btnPersist').addEventListener('click', async () => {
  try { const ok = await navigator.storage.persist(); $('#storagePerm').textContent = ok ? 'GRANTED' : 'DENIED'; } catch(e){}
});
$('#btnPurge') && $('#btnPurge').addEventListener('click', async () => {
  if (!confirm('Purge model cache + workspace data?')) return;
  try {
    const keys = await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k)));
    LS.set('purged', true); location.reload();
  } catch(e){}
});

/* ---------------- Install prompt ---------------- */
let deferredPrompt = null;
addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); deferredPrompt = e;
  $('#btnInstall').style.display = '';
});
$('#btnInstall') && $('#btnInstall').addEventListener('click', async () => {
  if (deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
  else { openSheet('#sheetAlarms'); sysMsg('Already installed, or your browser hides the prompt — use the menu → “Install app”.'); }
});

/* ---------------- Liquid glass pointer FX ---------------- */
const lens = $('#fxLens');
let lx = innerWidth/2, ly = innerHeight/2, tx = lx, ty = ly;
addEventListener('pointermove', (e) => {
  tx = e.clientX; ty = e.clientY;
  document.body.classList.add('pointer-live');
  const g = e.target.closest && e.target.closest('.glass,.glass-strong');
  if (g){
    const r = g.getBoundingClientRect();
    g.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    g.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  }
}, { passive:true });
(function lensLoop(){
  lx += (tx-lx)*0.08; ly += (ty-ly)*0.08;
  if (lens) lens.style.transform = 'translate('+lx+'px,'+ly+'px)';
  requestAnimationFrame(lensLoop);
})();
// animate SVG turbulence slowly
(function noiseLoop(){
  const n = $('#liquidNoise'); let f = 0.006;
  setInterval(()=>{ if(!n) return; f = 0.004 + Math.abs(Math.sin(Date.now()/9000))*0.006;
    n.setAttribute('baseFrequency', f.toFixed(4)+' '+(f*1.8).toFixed(4)); }, 120);
})();

/* tilt cards */
$$('.tilt').forEach(el => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY-r.top)/r.height-.5)*-8;
    const ry = ((e.clientX-r.left)/r.width-.5)*10;
    el.style.transform = 'perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateZ(6px)';
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
});

/* reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} }), { threshold:.12 });
$$('.section .cap, .arch, .cta-card, .steps li, .sec-head, .console-wrap, .phone-stage, .cache-row').forEach(el => { el.classList.add('reveal'); io.observe(el); });

/* nav active state + drawer */
const secs = ['core','capabilities','android','offline','join'];
addEventListener('scroll', () => {
  const y = scrollY + innerHeight*0.4;
  let cur = 'core';
  secs.forEach(id => { const el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
  $$('.rn').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+cur));
}, { passive:true });
$('#hamburger') && $('#hamburger').addEventListener('click', () => $('#mobDrawer').classList.toggle('open'));
$$('#mobDrawer a').forEach(a => a.addEventListener('click', ()=>$('#mobDrawer').classList.remove('open')));

/* online/offline chip */
function netStatus(){
  const on = navigator.onLine;
  $('#netDot').classList.toggle('err', !on);
  $('#netLabel').textContent = on ? 'ONLINE' : 'OFFLINE — LOCAL ONLY';
}
addEventListener('online', () => { netStatus(); sysMsg('Network back. Nothing needed it.'); });
addEventListener('offline', () => { netStatus(); sysMsg('Airplane mode engaged. The core does not care.'); });

/* demo chips */
$$('[data-demo]').forEach(b => b.addEventListener('click', () => {
  const k = b.dataset.demo;
  const phrase = k==='alarm' ? 'set an alarm for 7am' : k==='timer' ? 'timer for 5 minutes' : k==='note' ? 'note: buy graphite rods' : '';
  document.getElementById('core').scrollIntoView({behavior:'smooth'});
  if (phrase) setTimeout(()=>handleUserCommand(phrase), 700);
  else { document.body.animate([{filter:'brightness(1.6)'},{filter:'brightness(1)'}], {duration:260}); }
}));
$$('[data-open-console],[data-dock="talk"]').forEach(b => b.addEventListener('click', () => {
  document.getElementById('core').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>$('#chatBox').focus(), 800);
}));
$('#btnVoiceHero') && $('#btnVoiceHero').addEventListener('click', () => openVoice(Voice.supported()));
$$('[data-goto-android]').forEach(b=>b.addEventListener('click',()=>document.getElementById('android').scrollIntoView({behavior:'smooth'})));
$$('[data-open-wakeconfig]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('android').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#wakePrefix').focus(),800);}));

/* dock */
$$('.dk').forEach(b => b.addEventListener('click', () => {
  $$('.dk').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  const k = b.dataset.dock;
  if (k==='voice'||k==='talk') openVoice(Voice.supported());
  if (k==='workspace') openSheet('#sheetWorkspace');
  if (k==='alarms') openSheet('#sheetAlarms');
  if (k==='tasks') openSheet('#sheetWorkspace');
}));

/* wake config */
function refreshPrefixEchos(){
  const p = Voice.prefix;
  ['#prefixEcho','#armEcho'].forEach(sel => { const el=$(sel); if(el) el.textContent = sel==='#prefixEcho' ? p.toUpperCase() : p; });
  const ab = $('#btnArmMic'); if (ab) ab.innerHTML = 'ARM EAR ▸ “hey <span id="armEcho">' + p + '</span>”';
}
$('#btnSaveWake') && $('#btnSaveWake').addEventListener('click', () => {
  const v = ($('#wakePrefix').value || '').trim().toLowerCase().replace(/[^a-z0-9 _-]/g,'').slice(0,14);
  if (!v){ micState('PREFIX EMPTY — KEEP IT SIMPLE'); return; }
  Voice.prefix = v; LS.set('prefix', v);
  refreshPrefixEchos();
  sysMsg('Wake word bound: “hey ' + v + '”. Arm the ear when ready.');
});
$('#btnArmMic') && $('#btnArmMic').addEventListener('click', () => Voice.toggle());

/* phone mock: long-press power */
(function(){
  const pw = $('#phPower'), asst = $('#phAssistant'), bubble = $('#phBubble');
  if (!pw) return;
  let hold = null;
  const down = () => { pw.classList.add('pressed'); hold = setTimeout(()=>{
      asst.classList.add('up');
      bubble.textContent = 'hey ' + Voice.prefix + ' — summoned by power-hold. What do you need?';
      if (navigator.vibrate) navigator.vibrate([70,40,70]);
      pulse3D();
    }, 1200); };
  const up = () => { pw.classList.remove('pressed'); clearTimeout(hold);
    setTimeout(()=>asst.classList.remove('up'), 3200); };
  pw.addEventListener('pointerdown', down);
  pw.addEventListener('pointerup', up); pw.addEventListener('pointercancel', up);
  setInterval(()=>{ const c=$('#phClock'); if(c){ const d=new Date(); c.textContent = String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); } }, 10000);
})();

/* keyboard shortcut: hold Alt (power proxy on PC) raises assistant */
(function(){
  let acc = 0, timer = null;
  addEventListener('keydown', (e) => {
    if (e.key === 'Alt' && !e.repeat){
      acc = Date.now();
      timer = setTimeout(()=>{ if (Date.now()-acc >= 1100) raiseAssistant('power-hold'); }, 1200);
    }
  });
  addEventListener('keyup', (e) => { if (e.key==='Alt'){ clearTimeout(timer); } });
})();

/* chat form */
$('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const box = $('#chatBox'); const v = box.value.trim(); if (!v) return;
  box.value = '';
  handleUserCommand(v);
});

/* alarms sheet wiring */
$('#alarmForm') && $('#alarmForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const tv = $('#alarmTime').value; if (!tv) return;
  const [h,m] = tv.split(':').map(Number);
  const when = nextOccurrence(h,m);
  await DB.add('alarms', { time: when.toISOString(), label: $('#alarmLabel').value || 'Alarm', fired:false });
  scheduleAlarm(when, $('#alarmLabel').value);
  renderAlarms(); aiMsg('Alarm locked for ' + when.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) + '.');
  $('#alarmLabel').value = '';
});
$('#btnTimerStop') && $('#btnTimerStop').addEventListener('click', () => { stopTimer(); LS.set('timerEnd', null); $('#timerRead').textContent='--:--'; });
$('#btnNoteSave') && $('#btnNoteSave').addEventListener('click', async () => {
  const pad = $('#notePad'); const v = pad.value.trim(); if (!v) return;
  await DB.add('notes', { text:v, at:Date.now() }); pad.value=''; renderNotes(); sysMsg('Note pinned locally.');
});
$('#taskForm') && $('#taskForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const box=$('#taskBox'); const v=box.value.trim(); if(!v) return;
  await DB.add('tasks', { text:v, done:false, at:Date.now() }); box.value=''; renderTasks();
});

/* service worker */
if ('serviceWorker' in navigator){
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(async () => {
      await navigator.serviceWorker.ready;
      if (LS.get('purged')) { LS.set('purged', false); }
    }).catch(()=>{});
  });
}

/* boot sequence */
/* public bridge — ui.js / learn.js / background.js / APK shell all bind here */
window.LC = { Engine, Voice, handleUserCommand, raiseAssistant, sysMsg, pulse3D };

Engine.init();
refreshPrefixEchos();
$('#wakePrefix') && ($('#wakePrefix').placeholder = Voice.prefix);
netStatus();
ensureNotifyPerm();
renderNotes(); renderTasks(); renderAlarms(); restoreAlarms();
updateCacheStats();
setInterval(updateCacheStats, 30000);
if (Voice.wantAutoArm && Voice.supported()) setTimeout(() => { try { Voice.arm(); } catch(e){} }, 2500);

/* external hooks: ?cmd=wake  (accessibility shortcut / launcher / Tasker) */
(function(){
  const q = new URLSearchParams(location.search);
  if (q.get('cmd') === 'wake' || location.hash === '#voice'){
    setTimeout(()=>raiseAssistant(q.get('say') || ''), 900);
  }
  if (q.get('cmd') === 'alarms'){ setTimeout(()=>openSheet('#sheetAlarms'), 800); }
  if (q.get('cmd') === 'workspace'){ setTimeout(()=>openSheet('#sheetWorkspace'), 800); }
  if (q.get('say')) {
    setTimeout(()=>handleUserCommand(q.get('say')), 1200);
  }
})();

/* ui.js long-press-power ring and the background WakeEar both route here */
addEventListener('lc:power-summon', () => raiseAssistant(''));
addEventListener('lc:wake', (e) => {
  const said = (e && e.detail && e.detail.text) || '';
  raiseAssistant(said);
  if (said) setTimeout(() => handleUserCommand(said, { voice: true }), 600);
});

/* cold-boot sweep: anything that came due while the process was dead */
try { window.LCBackground && LCBackground.checkDueAlarmsNow(); } catch(e){}
/* keep SW alarm timers in sync on every alarm mutation (renderAlarms is a
   function declaration → reassignment is legal and wraps all call sites) */
const _origRenderAlarms = renderAlarms;
renderAlarms = async function(){
  await _origRenderAlarms();
  try { window.LCBackground && LCBackground.mirrorAlarmsToSW(); } catch(e){}
};

/* autorestore wake prefix into input */
$('#wakePrefix') && ($('#wakePrefix').value = Voice.prefix === 'nova' ? '' : Voice.prefix);

})();
