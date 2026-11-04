/* ================================================================
   GRIDFIELD — scroll-driven techy background engine (flower-free).

   Replaces the old "code bloom" syntax-flower animation with a
   pure-tech signal field:
     • a parallax field of drifting hex/nodes + code tokens
     • commit-node milestones that light up along a data bus
     • velocity heat fed to CSS vars (--scrollp / --heat)
     • ripple + spark bursts when a milestone is crossed
   GPU-composited transforms only; one rAF; zero dependencies.
   Honors prefers-reduced-motion and low-power/weak-gpu classes.
   ================================================================ */
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var host = document.getElementById('gridfield');
  if (!host) {
    host = document.createElement('div');
    host.id = 'gridfield';
    host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);
  }

  /* ---- scene DOM: data bus + milestone nodes (no flower) ---- */
  host.innerHTML =
    '<div class="gf-field"></div>' +
    '<div class="gf-bus" id="gfBus"></div>' +
    '<svg class="gf-circuit" viewBox="0 0 1200 800" preserveAspectRatio="none">' +
      '<path class="tg-trace" d="M-20 120 H340 L400 180 H760 L820 120 H1220"/>' +
      '<path class="tg-trace" d="M-20 640 H260 L330 580 H700 L770 640 H1220"/>' +
      '<path class="tg-trace" d="M140 -20 V220 L200 280 V560 L140 620 V820"/>' +
      '<path class="tg-trace" d="M980 -20 V180 L920 240 V520 L980 580 V820"/>' +
      '<circle class="tg-node" cx="340" cy="120" r="3"/><circle class="tg-node" cx="760" cy="180" r="3"/>' +
      '<circle class="tg-node" cx="400" cy="180" r="3"/><circle class="tg-node" cx="820" cy="120" r="3"/>' +
      '<circle class="tg-node" cx="330" cy="580" r="3"/><circle class="tg-node" cx="700" cy="580" r="3"/>' +
      '<circle class="tg-node" cx="200" cy="280" r="3"/><circle class="tg-node" cx="920" cy="240" r="3"/>' +
    '</svg>';

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

  /* ---- token particle field ---- */
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
  var bus = document.getElementById('gfBus');
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

    /* data bus fills as you travel */
    bus.style.height = (clamp(p * 1.15, 0, 1) * 62) + '%';

    /* milestone nodes pop as the bus passes them */
    for (var i = 0; i < NODES.length; i++) {
      var on = p >= NODES[i].p;
      if (nodeEls[i].classList.contains('on') !== on) nodeEls[i].classList.toggle('on', on);
      nodeEls[i].style.left = (50 + Math.sin(NODES[i].p * 9) * 7) + '%';
      nodeEls[i].style.top = (100 - NODES[i].p * 100) + '%';
    }

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

    /* milestone ripple at each crossing */
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
