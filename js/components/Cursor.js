// js/components/Cursor.js — Cursor v2 "Aurora Glass" (vanilla JS, no dependencies)
// Desktop (pointer:fine): instant dot + lerped 44px ring with a rotating
// conic-gradient border, hover grow + label, magnetic pull, spotlight vars,
// and a throttled sparkle trail (max ~24 live particles).
// Touch (pointer:coarse): tap ripple + drag glow dot — the tablet/phone
// feedback v1 lacked. prefers-reduced-motion disables everything.
(function () {
  'use strict';

  // Owner decision (v3.1): the custom cursor is the site's signature effect
  // and must run even when the OS reports prefers-reduced-motion (that flag
  // is on by default in many Windows/Android setups and silently killed the
  // cursor for the site owner). Reduced motion only drops the sparkle trail.
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var finePointer = window.matchMedia('(pointer: fine)');

  /* ================= Touch feedback (coarse pointers) ================= */
  if (!finePointer.matches) {
    var glow = document.createElement('div');
    glow.className = 'touch-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    function spawnRipple(x, y) {
      var ripple = document.createElement('div');
      ripple.className = 'touch-ripple';
      ripple.setAttribute('aria-hidden', 'true');
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      document.body.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    }
    function moveGlow(x, y) {
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
    }

    document.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      if (!t) return;
      spawnRipple(t.clientX, t.clientY);
      moveGlow(t.clientX, t.clientY);
      glow.classList.add('on');
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      var t = e.touches[0];
      if (!t) return;
      moveGlow(t.clientX, t.clientY);
      glow.classList.add('on');
    }, { passive: true });
    function glowOff() { glow.classList.remove('on'); }
    document.addEventListener('touchend', glowOff, { passive: true });
    document.addEventListener('touchcancel', glowOff, { passive: true });
    return;
  }

  /* ================= Desktop custom cursor ================= */
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  var ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');

  var label = document.createElement('span');
  label.className = 'cursor-ring-label';
  ring.appendChild(label);

  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.documentElement.classList.add('has-custom-cursor');

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX;
  var ringY = mouseY;
  var scale = 1;
  var targetScale = 1;

  /* Sparkle trail: throttled spawns, capped live-particle count */
  var sparkleColors = ['#7C7CF4', '#E879F9', '#F472B6', '#22D3EE'];
  var sparkles = [];
  var lastSparkle = 0;
  function spawnSparkle(x, y, now) {
    if (reducedMotion) return;
    if (now - lastSparkle < 40) return;
    lastSparkle = now;
    if (sparkles.length >= 24) {
      var oldest = sparkles.shift();
      if (oldest) oldest.remove();
    }
    var s = document.createElement('span');
    s.className = 'cursor-sparkle';
    s.setAttribute('aria-hidden', 'true');
    var size = 3 + Math.random() * 4;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = (x + (Math.random() * 18 - 9)) + 'px';
    s.style.top = (y + (Math.random() * 18 - 9)) + 'px';
    s.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    s.style.boxShadow = '0 0 8px ' + s.style.background;
    document.body.appendChild(s);
    sparkles.push(s);
    setTimeout(function () {
      s.remove();
      var i = sparkles.indexOf(s);
      if (i !== -1) sparkles.splice(i, 1);
    }, 620);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
    spawnSparkle(mouseX, mouseY, performance.now());
    handleSpotlight(e);
    handleMagnetic(e);
  }, { passive: true });

  document.addEventListener('mousedown', function () { targetScale = currentBaseScale() * 0.85; });
  document.addEventListener('mouseup', function () { targetScale = currentBaseScale(); });

  var hoverKind = 'default'; // default | interactive | text
  function currentBaseScale() {
    if (hoverKind === 'interactive') return 1.7;
    if (hoverKind === 'text') return 1;
    return 1;
  }

  document.addEventListener('mouseover', function (e) {
    var textEl = e.target.closest('input, textarea, select, [contenteditable="true"]');
    var hitEl = e.target.closest('a, button, [data-cursor], [role="button"]');
    ring.classList.toggle('is-text', !!textEl && !hitEl);
    ring.classList.toggle('is-hover', !!hitEl);
    hoverKind = textEl && !hitEl ? 'text' : (hitEl ? 'interactive' : 'default');
    targetScale = currentBaseScale();
    var labelled = e.target.closest('[data-cursor-label]');
    label.textContent = labelled ? labelled.getAttribute('data-cursor-label') : '';
  });

  // Spotlight cards: expose cursor position as --mx/--my (works for dynamic DOM)
  function handleSpotlight(e) {
    var card = e.target.closest ? e.target.closest('.spotlight') : null;
    if (!card) return;
    var rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  }

  // Magnetic elements: translate toward cursor by at most 6px, reset on leave
  var magneticEl = null;
  function handleMagnetic(e) {
    var el = e.target.closest ? e.target.closest('.magnetic') : null;
    if (magneticEl && magneticEl !== el) {
      magneticEl.style.transform = '';
      magneticEl = null;
    }
    if (!el) return;
    magneticEl = el;
    var rect = el.getBoundingClientRect();
    var dx = e.clientX - (rect.left + rect.width / 2);
    var dy = e.clientY - (rect.top + rect.height / 2);
    var max = 6;
    var tx = Math.max(-max, Math.min(max, dx * 0.18));
    var ty = Math.max(-max, Math.min(max, dy * 0.18));
    el.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
  }
  document.addEventListener('mouseleave', function () {
    if (magneticEl) { magneticEl.style.transform = ''; magneticEl = null; }
  });

  (function animate() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    scale += (targetScale - scale) * 0.2;
    ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%) scale(' + scale + ')';
    requestAnimationFrame(animate);
  })();
})();
