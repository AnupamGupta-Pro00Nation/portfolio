// js/components/CommandPalette.js — Ctrl/Cmd+K command palette (clean modal).
// Items are built only from links and sections already present on the page:
// nav links, in-page section anchors, and external anchors (GitHub, LinkedIn,
// resume PDF) found in the DOM. No new destinations are invented.
(function () {
  'use strict';

  var overlay = null;
  var input = null;
  var list = null;
  var items = [];
  var activeIndex = 0;

  function collectItems() {
    var seen = {};
    var out = [];
    function add(label, hint, action) {
      var key = label + '|' + hint;
      if (!label || seen[key]) return;
      seen[key] = 1;
      out.push({ label: label, hint: hint, action: action });
    }

    // Section jumps from nav / scroll links already on the page
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href.length < 2 || href.indexOf('#/') === 0) return;
      var target = document.querySelector(href);
      if (!target) return;
      var label = (a.textContent || '').trim();
      add(label, 'Go to section', function () {
        if (a.classList.contains('scroll-link')) { a.click(); return; }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Route / page links already on the page (sandbox, gateway, portfolio)
    document.querySelectorAll('a[href^="#/"], a[href$=".html"]').forEach(function (a) {
      var label = (a.textContent || '').trim().replace(/\s+/g, ' ');
      add(label, 'Open page', function () { a.click(); });
    });

    // External destinations already linked on the page (GitHub, LinkedIn, resume…)
    document.querySelectorAll('a[href^="https://"], a[href$=".pdf"]').forEach(function (a) {
      var href = a.getAttribute('href');
      var label = (a.textContent || '').trim().replace(/\s+/g, ' ');
      if (!label) {
        if (href.indexOf('github.com') !== -1) label = 'GitHub';
        else if (href.indexOf('linkedin.com') !== -1) label = 'LinkedIn';
        else if (href.slice(-4) === '.pdf') label = 'Resume (PDF)';
        else return;
      }
      var hint = href.slice(-4) === '.pdf' ? 'Download resume' : 'Open link';
      add(label, hint, function () { window.open(href, '_blank', 'noopener'); });
    });

    return out;
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'cmdk-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Command palette');
    overlay.innerHTML =
      '<div class="cmdk-panel">' +
        '<input type="text" class="cmdk-input" placeholder="Jump to a section, project link, or resume…" aria-label="Search commands">' +
        '<ul class="cmdk-list" role="listbox"></ul>' +
        '<div class="cmdk-footer">↑↓ navigate · Enter select · Esc close</div>' +
      '</div>';
    document.body.appendChild(overlay);
    input = overlay.querySelector('.cmdk-input');
    list = overlay.querySelector('.cmdk-list');

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var item = filtered[activeIndex];
        if (item) { close(); item.action(); }
      } else if (e.key === 'Escape') { close(); }
    });
  }

  var filtered = [];
  function render(query) {
    var q = (query || '').trim().toLowerCase();
    filtered = items.filter(function (it) {
      return !q || it.label.toLowerCase().indexOf(q) !== -1 || it.hint.toLowerCase().indexOf(q) !== -1;
    });
    activeIndex = 0;
    list.innerHTML = '';
    filtered.forEach(function (it, i) {
      var li = document.createElement('li');
      li.className = 'cmdk-item' + (i === activeIndex ? ' active' : '');
      li.setAttribute('role', 'option');
      li.innerHTML = '<span class="cmdk-item-label"></span><span class="cmdk-item-hint"></span>';
      li.querySelector('.cmdk-item-label').textContent = it.label;
      li.querySelector('.cmdk-item-hint').textContent = it.hint;
      li.addEventListener('click', function () { close(); it.action(); });
      li.addEventListener('mouseenter', function () { setActive(i); });
      list.appendChild(li);
    });
    if (!filtered.length) {
      list.innerHTML = '<li class="cmdk-empty">No matches</li>';
    }
  }
  function setActive(i) {
    activeIndex = i;
    list.querySelectorAll('.cmdk-item').forEach(function (el, j) {
      el.classList.toggle('active', j === i);
    });
  }
  function move(delta) {
    if (!filtered.length) return;
    setActive((activeIndex + delta + filtered.length) % filtered.length);
  }

  function open() {
    if (!overlay) build();
    items = collectItems();
    overlay.classList.add('open');
    input.value = '';
    render('');
    setTimeout(function () { input.focus(); }, 30);
  }
  function close() {
    if (overlay) overlay.classList.remove('open');
  }
  function isOpen() { return overlay && overlay.classList.contains('open'); }

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (isOpen()) close(); else open();
    } else if (e.key === 'Escape' && isOpen()) {
      close();
    }
  });
})();
