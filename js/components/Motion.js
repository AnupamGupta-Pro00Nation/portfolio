// js/components/Motion.js — Scroll reveal, progress bar, 3D tilt, counters,
// smooth anchors and active-nav highlighting (vanilla JS + IntersectionObserver).
// Counters only animate numbers already present on the page via [data-count].
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress bar ---------- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  function scrollMetrics() {
    var container = document.querySelector('.main-content-panel');
    if (container && container.scrollHeight > container.clientHeight + 4) {
      return { top: container.scrollTop, max: container.scrollHeight - container.clientHeight };
    }
    var doc = document.documentElement;
    return { top: window.scrollY || doc.scrollTop, max: doc.scrollHeight - window.innerHeight };
  }
  function updateProgress() {
    var m = scrollMetrics();
    var pct = m.max > 0 ? Math.min(100, Math.max(0, (m.top / m.max) * 100)) : 0;
    bar.style.width = pct + '%';
    updateScrollSpy();
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  document.addEventListener('scroll', updateProgress, { passive: true, capture: true });

  /* ---------- Active nav highlight ---------- */
  function updateScrollSpy() {
    var links = document.querySelectorAll('.nav-link-item.scroll-link, .mobile-nav-item.scroll-link, .scroll-link[href^="#"]');
    if (!links.length) return;
    var current = null;
    links.forEach(function (lnk) {
      var id = lnk.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var el = document.querySelector(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.45 && r.bottom > 80) current = id;
    });
    links.forEach(function (lnk) {
      lnk.classList.toggle('nav-active', lnk.getAttribute('href') === current);
    });
  }

  /* ---------- Smooth anchors ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2 || id.indexOf('#/') === 0) return; // leave hash-router links alone
    var target = document.querySelector(id);
    if (!target) return;
    // The portfolio app already smooth-scrolls its own .scroll-link clicks.
    if (a.classList.contains('scroll-link')) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- Scroll reveal + counters ---------- */
  var revealSelector = 'section, .bracket-card, .cert-card, .award-card, .timeline-item, .landing-deck, .hero-section';
  var counterSelector = '[data-count]';

  function animateCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (reducedMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }
    var start = null;
    var duration = 1100;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealObserver = null;
  if ('IntersectionObserver' in window && !reducedMotion) {
    revealObserver = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (en) { return en.isIntersecting; });
      batch.forEach(function (en, i) {
        en.target.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
        en.target.classList.add('revealed');
        revealObserver.unobserve(en.target);
      });
    }, { threshold: 0.15 });
  }
  var counterObserver = null;
  if ('IntersectionObserver' in window) {
    counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCounter(en.target);
          counterObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
  }

  function tagReveals(root) {
    (root || document).querySelectorAll(revealSelector).forEach(function (el) {
      if (el.dataset.revealTagged) return;
      el.dataset.revealTagged = '1';
      if (!revealObserver) {
        el.classList.add('revealed');
        return;
      }
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }
  function tagCounters(root) {
    (root || document).querySelectorAll(counterSelector).forEach(function (el) {
      if (el.dataset.counterTagged) return;
      el.dataset.counterTagged = '1';
      if (counterObserver) counterObserver.observe(el);
      else animateCounter(el);
    });
  }

  /* ---------- 3D tilt on project / tilt cards ---------- */
  var tiltEl = null;
  document.addEventListener('mousemove', function (e) {
    if (reducedMotion) return;
    var card = e.target.closest ? e.target.closest('.tilt-card') : null;
    if (tiltEl && tiltEl !== card) {
      tiltEl.style.transform = '';
      tiltEl = null;
    }
    if (!card) return;
    tiltEl = card;
    var rect = card.getBoundingClientRect();
    var px = (e.clientX - rect.left) / rect.width - 0.5;
    var py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'perspective(900px) rotateY(' + (px * 6) + 'deg) rotateX(' + (-py * 6) + 'deg)';
  }, { passive: true });
  document.addEventListener('mouseout', function (e) {
    if (tiltEl && !tiltEl.contains(e.relatedTarget)) {
      tiltEl.style.transform = '';
      tiltEl = null;
    }
  });

  /* ---------- Init + watch for SPA-rendered content ---------- */
  function init() {
    tagReveals(document);
    tagCounters(document);
    updateProgress();
    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType !== 1) return;
            if (node.matches && node.matches(revealSelector)) tagReveals(node.parentNode || document);
            tagReveals(node);
            tagCounters(node);
            if (node.matches && node.matches(counterSelector)) tagCounters(node.parentNode || document);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
