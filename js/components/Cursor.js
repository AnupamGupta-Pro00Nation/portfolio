// js/components/Cursor.js — Custom editorial cursor (vanilla JS, no dependencies)
// Dot follows instantly, ring follows with lerp. Disabled on touch/coarse
// pointers and when prefers-reduced-motion is set; native cursor then stays.
(function () {
  'use strict';

  var finePointer = window.matchMedia('(pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

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

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
    handleSpotlight(e);
    handleMagnetic(e);
  }, { passive: true });

  document.addEventListener('mousedown', function () { targetScale = currentBaseScale() * 0.85; });
  document.addEventListener('mouseup', function () { targetScale = currentBaseScale(); });

  var hoverKind = 'default'; // default | interactive | text
  function currentBaseScale() {
    if (hoverKind === 'interactive') return 1.8;
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
