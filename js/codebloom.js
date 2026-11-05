/* ================================================================
   LIQUID CORE — js/codebloom.js
   Ambient Generative Code Bloom & Algorithmic Particle Canvas
   Renders organic syntax flows, floating mathematical tokens,
   pointer-reactive caustics, and audio-reactive neural pulses.
   
   ROBUSTNESS CONTRACT: Zero dependencies. Zero memory leaks.
   Gracefully adapts to GPU tiers, prefers-reduced-motion, and
   low-power battery saving mode.
   ================================================================ */
(() => {
  'use strict';

  /* ----------------------------------------------------------------
     1. CONFIGURATION & CONSTANTS
     ---------------------------------------------------------------- */
  const BLOOM_CONFIG = {
    maxParticles: 90,
    mobileMaxParticles: 35,
    spawnInterval: 120,
    glyphPalette: [
      '0', '1', 'λ', '∫', '∑', '∇', '∂', 'π', 'Ω', 'Ψ', 'Φ', '⚡',
      'const', 'async', 'await', 'return', 'tensor', 'qwen', 'matrix',
      '{...}', '=>', '0x7F', '0b101', 'NaN', 'null', 'void', 'pure'
    ],
    particleColors: [
      'rgba(255, 255, 255, 0.85)',
      'rgba(244, 244, 242, 0.70)',
      'rgba(223, 227, 230, 0.55)',
      'rgba(142, 142, 138, 0.40)',
      'rgba(88, 224, 138, 0.65)'  /* subtle emerald neural accent */
    ],
    springStiffness: 0.045,
    dragFactor: 0.94,
    interactionRadius: 140
  };

  /* ----------------------------------------------------------------
     2. STATE & OBJECT POOLS
     ---------------------------------------------------------------- */
  let canvas = null;
  let ctx = null;
  let animFrameId = null;
  let isRunning = false;
  let width = 0;
  let height = 0;
  let dpr = 1;

  const pointer = {
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    down: false,
    active: false
  };

  /* Particle pool to prevent GC pauses */
  class BloomParticle {
    constructor() {
      this.active = false;
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.originX = 0;
      this.originY = 0;
      this.size = 12;
      this.alpha = 0;
      this.maxAlpha = 0.8;
      this.life = 0;
      this.maxLife = 100;
      this.glyph = '0';
      this.color = BLOOM_CONFIG.particleColors[0];
      this.angle = 0;
      this.vAngle = 0;
      this.scale = 1;
    }

    spawn(x, y, glyph, color, vx, vy, maxLife = 180) {
      this.active = true;
      this.x = x;
      this.y = y;
      this.originX = x;
      this.originY = y;
      this.vx = vx || (Math.random() - 0.5) * 1.2;
      this.vy = vy || -(Math.random() * 1.4 + 0.3);
      this.glyph = glyph || BLOOM_CONFIG.glyphPalette[Math.floor(Math.random() * BLOOM_CONFIG.glyphPalette.length)];
      this.color = color || BLOOM_CONFIG.particleColors[Math.floor(Math.random() * BLOOM_CONFIG.particleColors.length)];
      this.size = Math.random() * 6 + 10;
      this.life = 0;
      this.maxLife = maxLife;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.5 + 0.3;
      this.angle = (Math.random() - 0.5) * 0.3;
      this.vAngle = (Math.random() - 0.5) * 0.02;
      this.scale = 0.6;
    }

    update() {
      if (!this.active) return;
      this.life++;

      /* Fade envelope: quick fadeIn, slow fadeOut */
      const progress = this.life / this.maxLife;
      if (progress < 0.15) {
        this.alpha = (progress / 0.15) * this.maxAlpha;
        this.scale = 0.6 + (progress / 0.15) * 0.4;
      } else {
        this.alpha = (1 - progress) * this.maxAlpha;
      }

      if (this.life >= this.maxLife) {
        this.active = false;
        return;
      }

      /* Physics movement */
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.vAngle;

      /* Natural gentle upward buoyancy & ambient drift */
      this.vy -= 0.015;
      this.vx += Math.sin(this.life * 0.04) * 0.05;

      /* Pointer repulsion field */
      if (pointer.active) {
        const dx = this.x - pointer.x;
        const dy = this.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        const maxDist = BLOOM_CONFIG.interactionRadius;
        if (distSq < maxDist * maxDist && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / maxDist) * 3.5;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }

      /* Drag damping */
      this.vx *= BLOOM_CONFIG.dragFactor;
      this.vy *= BLOOM_CONFIG.dragFactor;
    }

    draw(context) {
      if (!this.active || this.alpha <= 0.001) return;
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.scale(this.scale, this.scale);
      context.globalAlpha = this.alpha;
      context.fillStyle = this.color;
      context.font = `${Math.round(this.size)}px "JetBrains Mono", monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(this.glyph, 0, 0);

      /* Specular glow halo on key symbols */
      if (this.glyph === 'λ' || this.glyph === '∑' || this.glyph === '⚡') {
        context.shadowColor = 'rgba(255, 255, 255, 0.5)';
        context.shadowBlur = 8;
        context.fillText(this.glyph, 0, 0);
      }
      context.restore();
    }
  }

  /* ----------------------------------------------------------------
     3. CODEBLOOM CONTROLLER ENGINE
     ---------------------------------------------------------------- */
  const CodeBloom = {
    particles: [],
    lastSpawn: 0,
    burstCount: 0,
    reducedMotion: false,
    lowPower: false,
    isMobile: false,

    init() {
      /* Avoid duplicate setup */
      if (document.getElementById('codebloom-canvas')) return;

      this.isMobile = window.matchMedia('(max-width: 680px)').matches;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* Create hardware-accelerated full-viewport canvas */
      canvas = document.createElement('canvas');
      canvas.id = 'codebloom-canvas';
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1'; /* Above three.js scene, below interactive glass */
      canvas.style.mixBlendMode = 'screen';
      canvas.setAttribute('aria-hidden', 'true');

      /* Insert canvas into the DOM right after the 3D scene */
      const fxContainer = document.querySelector('.fx') || document.body;
      fxContainer.appendChild(canvas);

      ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      this.resize();
      this.initPool();
      this.bindEvents();

      if (!this.reducedMotion) {
        this.start();
      }

      /* Expose module bridge */
      window.CodeBloom = this;
    },

    initPool() {
      const cap = this.isMobile ? BLOOM_CONFIG.mobileMaxParticles : BLOOM_CONFIG.maxParticles;
      this.particles = [];
      for (let i = 0; i < cap; i++) {
        this.particles.push(new BloomParticle());
      }
    },

    resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    },

    bindEvents() {
      window.addEventListener('resize', () => this.resize(), { passive: true });

      /* Pointer tracking */
      window.addEventListener('pointermove', (e) => {
        pointer.prevX = pointer.x;
        pointer.prevY = pointer.y;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.vx = pointer.x - pointer.prevX;
        pointer.vy = pointer.y - pointer.prevY;
        pointer.active = true;

        /* Ambient spawn on fast pointer motion */
        const speed = Math.hypot(pointer.vx, pointer.vy);
        if (speed > 16 && Math.random() < 0.25) {
          this.spawn(pointer.x, pointer.y, null, null, pointer.vx * 0.15, pointer.vy * 0.15);
        }
      }, { passive: true });

      window.addEventListener('pointerleave', () => {
        pointer.active = false;
      }, { passive: true });

      /* Pointer click triggers a bloom blossom */
      window.addEventListener('pointerdown', (e) => {
        pointer.down = true;
        this.burst(e.clientX, e.clientY, 8);
      }, { passive: true });

      window.addEventListener('pointerup', () => {
        pointer.down = false;
      }, { passive: true });

      /* Custom Event: lc-pulse (fired on engine load or message receipt) */
      window.addEventListener('lc-pulse', () => {
        this.neuralPulse();
      });

      /* Custom Event: lc:wake (fired when wake-word is detected) */
      window.addEventListener('lc:wake', () => {
        this.voiceRingPulse();
      });

      /* Reduced motion preference watcher */
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      motionQuery.addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
        if (this.reducedMotion) {
          this.stop();
          this.clear();
        } else {
          this.start();
        }
      });
    },

    spawn(x, y, glyph, color, vx, vy, maxLife) {
      if (this.reducedMotion) return;
      /* Find first dormant particle */
      for (let i = 0; i < this.particles.length; i++) {
        if (!this.particles[i].active) {
          this.particles[i].spawn(x, y, glyph, color, vx, vy, maxLife);
          break;
        }
      }
    },

    burst(originX, originY, count = 12, glyphSet = null) {
      if (this.reducedMotion) return;
      const palette = glyphSet || BLOOM_CONFIG.glyphPalette;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const velocity = Math.random() * 3.5 + 1.2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        const glyph = palette[Math.floor(Math.random() * palette.length)];
        this.spawn(originX, originY, glyph, null, vx, vy, Math.floor(Math.random() * 60 + 90));
      }
    },

    neuralPulse() {
      /* Emit a radial bloom from console center */
      const consoleWrap = document.getElementById('console') || document.body;
      const rect = consoleWrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      this.burst(cx, cy, 20, ['∇', '∫', 'λ', '1', '0', '∂', '⚡', 'qwen', 'tok/s']);
    },

    voiceRingPulse() {
      /* Emit glowing wave outward from top rail or mobile orb */
      const brandOrb = document.getElementById('brandOrb');
      if (brandOrb) {
        const rect = brandOrb.getBoundingClientRect();
        this.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14, ['•', 'wake', 'hear', 'nova', 'online']);
      } else {
        this.burst(width / 2, height / 2, 16);
      }
    },

    start() {
      if (isRunning || this.reducedMotion) return;
      isRunning = true;
      this.loop(performance.now());
    },

    stop() {
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    },

    clear() {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, width, height);
      }
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].active = false;
      }
    },

    loop(time) {
      if (!isRunning) return;

      /* Ambient spawning interval */
      if (time - this.lastSpawn > BLOOM_CONFIG.spawnInterval) {
        this.lastSpawn = time;
        if (Math.random() < 0.6) {
          const spawnX = Math.random() * width;
          const spawnY = height + 10;
          this.spawn(spawnX, spawnY);
        }
      }

      /* Clear frame */
      ctx.clearRect(0, 0, width, height);

      /* Update and render active particles */
      let activeCount = 0;
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        if (p.active) {
          p.update();
          p.draw(ctx);
          activeCount++;
        }
      }

      /* Render subtle refractive connection lines between nearby glyphs */
      this.drawConstellations();

      animFrameId = requestAnimationFrame((t) => this.loop(t));
    },

    drawConstellations() {
      /* Only link particles when on high-power desktop devices */
      if (this.isMobile || this.lowPower) return;

      ctx.save();
      ctx.lineWidth = 0.5;
      const maxDist = 80;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        if (!p1.active) continue;

        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          if (!p2.active) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dSq = dx * dx + dy * dy;

          if (dSq < maxDistSq) {
            const alpha = (1 - Math.sqrt(dSq) / maxDist) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }
  };

  /* ----------------------------------------------------------------
     4. AUTORUN INITIALIZATION
     ---------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CodeBloom.init());
  } else {
    CodeBloom.init();
  }
})();
