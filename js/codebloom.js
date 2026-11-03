/* ================================================================
   CODE BLOOM — scroll-driven 3D background event (coding-themed).
   As the user scrolls, a wireframe "syntax flower" grows from a git
   stem: commit nodes light up along the vine, then glassy 3D petals
   unfurl around a pulsing { } core. Syntax tokens drift in parallax.
   Pure CSS-transform engine (GPU composited) + optional Rust/WASM
   math kernel when rust/ build is present (window.LCPerf).
   ================================================================ */
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var host = document.getElementById('codebloom');
  if (!host) {
    host = document.createElement('div');
    host.id = 'codebloom';
    host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);
  }

  /* ---- build scene DOM once ---- */
  host.innerHTML =
    '<div class="cb-field"></div>' +
    '<div class="cb-stem" id="cbStem"></div>' +
    '<div class="cb-flower" id="cbFlower"><div class="cb-core" id="cbCore">{ }</div></div>';

  var NODES = [
    { p: .12, label: 'init' }, { p: .28, label: 'add' }, { p: .44, label: 'commit' },
    { p: .60, label: 'push' }, { p: .74, label: 'merge' }, { p: .88, label: 'ship' }
  ];
  var nodeEls = NODES.map(function (n) {
    var d = document.createElement('i');
    d.className = 'cb-node' + (n.label === 'commit' || n.label === 'merge' ? ' git' : '');
    d.title = n.label;
    host.appendChild(d);
    return d;
  });

  var PETALS = 8;
  var petals = [];
  var flower = document.getElementById('cbFlower');
  for (var i = 0; i < PETALS; i++) {
    var pe = document.createElement('div');
    pe.className = 'cb-petal' + (i % 2 ? ' back' : '');
    pe.style.setProperty('--a', (i * 360 / PETALS) + 'deg');
    pe.innerHTML = '<div class="cb-petal-face"></div>';
    flower.appendChild(pe);
    petals.push(pe);
  }

  /* ---- syntax particle field ---- */
  var dust = document.getElementById('syntax-dust');
  if (!dust) {
    dust = document.createElement('div');
    dust.id = 'syntax-dust';
    dust.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dust);
  }
  var TOKENS = ['{', '}', '=>', 'fn', '()', '[]', '::', '</>', '&&', '||', '++', '**', '!=', '?.', 'lambda', 'pub', 'let'];
  var parts = [];
  var PCOUNT = (navigator.hardwareConcurrency || 4) >= 6 ? 22 : 12;
  for (var k = 0; k < PCOUNT; k++) {
    var t = document.createElement('span');
    var txt = TOKENS[k % TOKENS.length];
    t.className = 'sd-token' + (/[{}()\[\]]/.test(txt) ? ' brace' : (txt.length > 2 ? ' kw' : ' op'));
    t.textContent = txt;
    t.style.setProperty('--fs', (10 + Math.random() * 16) + 'px');
    dust.appendChild(t);
    parts.push({ el: t, x: Math.random(), y: Math.random(), z: .3 + Math.random() * .7, r: Math.random() * 360, vx: (Math.random() - .5) * .0004 });
  }

  /* ---- scroll engine: one rAF, passive listener, no layout thrash ---- */
  var stem = document.getElementById('cbStem');
  var core = document.getElementById('cbCore');
  var ticking = false, lastP = -1, lastT = performance.now();
  var heat = 0; // velocity heat fed to canvas/CSS fx

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function frame(now) {
    ticking = false;
    var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    var p = clamp(scrollY / max, 0, 1);
    var dt = Math.max(16, now - lastT); lastT = now;

    /* velocity -> heat, smoothed */
    var v = Math.abs(p - (lastP < 0 ? p : lastP)) / dt * 900;
    heat = heat * .88 + clamp(v, 0, 1) * .12;
    document.documentElement.style.setProperty('--scrollp', p.toFixed(4));
    document.documentElement.style.setProperty('--heat', heat.toFixed(3));
    if (heat > .35) document.body.classList.add('fast-scroll');
    else document.body.classList.remove('fast-scroll');

    /* stem growth */
    stem.style.height = (clamp(p * 1.15, 0, 1) * 62) + '%';

    /* commit nodes pop as the stem passes them */
    for (var i = 0; i < NODES.length; i++) {
      var on = p >= NODES[i].p;
      if (nodeEls[i].classList.contains('on') !== on) nodeEls[i].classList.toggle('on', on);
      nodeEls[i].style.left = (50 + Math.sin(NODES[i].p * 9) * 7) + '%';
      nodeEls[i].style.top = (100 - NODES[i].p * 100) + '%';
    }

    /* bloom: petals unfurl between 55%..95% scroll */
    var b = clamp((p - .55) / .4, 0, 1);
    var ease = 1 - Math.pow(1 - b, 3);
    for (var j = 0; j < petals.length; j++) {
      petals[j].style.setProperty('--closed', (72 - ease * 78) + 'deg');
      petals[j].style.setProperty('--s', (.4 + ease * .75).toFixed(3));
      petals[j].style.setProperty('--op', (b > .02 ? 1 : 0));
    }
    core.style.setProperty('--op', b > .05 ? 1 : 0);
    core.style.transform = 'scale(' + (.6 + ease * .8 + Math.sin(now / 400) * .04 * ease) + ')';
    flower.style.transform = 'rotateZ(' + (ease * 40 + p * 20) + 'deg)';

    /* particles drift + parallax with scroll delta */
    var dy = (p - (lastP < 0 ? p : lastP));
    for (var m = 0; m < parts.length; m++) {
      var pt = parts[m];
      pt.y -= dy * pt.z * 1.4 + pt.vx;
      pt.x += pt.vx;
      if (pt.y < -.05) pt.y = 1.05; if (pt.y > 1.05) pt.y = -.05;
      if (pt.x < -.05) pt.x = 1.05; if (pt.x > 1.05) pt.x = -.05;
      pt.r += pt.z * .3;
      pt.el.style.setProperty('--x', (pt.x * innerWidth) + 'px');
      pt.el.style.setProperty('--y', (pt.y * innerHeight) + 'px');
      pt.el.style.setProperty('--r', pt.r.toFixed(1) + 'deg');
      pt.el.style.setProperty('--o', (.25 + heat * .6 * pt.z).toFixed(2));
    }

    /* milestone ripple at each commit crossing */
    if (lastP >= 0) {
      for (var q = 0; q < NODES.length; q++) {
        if (lastP < NODES[q].p && p >= NODES[q].p) burst(nodeEls[q]);
      }
    }
    lastP = p;
  }

  function burst(el) {
    var r = el.getBoundingClientRect();
    var d = document.createElement('div');
    d.className = 'dr';
    d.style.setProperty('--rx', (r.left + r.width / 2) + 'px');
    d.style.setProperty('--ry', (r.top + r.height / 2) + 'px');
    var hostR = document.querySelector('.ripple-host');
    if (!hostR) { hostR = document.createElement('div'); hostR.className = 'ripple-host'; hostR.setAttribute('aria-hidden', 'true'); document.body.appendChild(hostR); }
    hostR.appendChild(d);
    setTimeout(function () { d.remove(); }, 1500);
    /* build sparks */
    for (var s = 0; s < 7; s++) {
      var sp = document.createElement('i');
      sp.className = 'spark';
      sp.style.left = r.left + 4 + 'px'; sp.style.top = r.top + 4 + 'px';
      sp.style.setProperty('--dx', ((Math.random() - .5) * 90) + 'px');
      sp.style.setProperty('--dy', (-20 - Math.random() * 70) + 'px');
      sp.style.setProperty('--life', (.5 + Math.random() * .5) + 's');
      document.body.appendChild(sp);
      setTimeout(function (n) { return function () { n.remove(); }; }(sp), 1100);
    }
    if (window.LCPerf && LCPerf.ping) LCPerf.ping();
  }

  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });

  /* section reveals + scroll-beam share this loop */
  var beam = document.querySelector('.sb-fill');
  addEventListener('scroll', function () {
    if (beam) beam.parentElement.style.setProperty('--sp', (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4));
  }, { passive: true });

  document.querySelectorAll('[data-rv]').forEach(function (el) {
    new IntersectionObserver(function (es, io) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('rv-on'); io.unobserve(en.target); } });
    }, { threshold: .15 }).observe(el);
  });

  schedule();
})();
