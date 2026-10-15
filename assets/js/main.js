(function () {
  'use strict';

  var root = document.documentElement;

  // Theme toggle: follows the system setting until the visitor picks one.
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      if (!current) {
        current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // In-page links scroll to their target without writing "#section" into the
  // address bar, so reloading the page does not jump back to that section.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ block: 'start' });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    if (target.classList.contains('pub')) {
      target.classList.add('is-target');
      setTimeout(function () { target.classList.remove('is-target'); }, 2000);
    }
  });

  // Each group of institution logos stays on one row. A row that does not fit
  // scrolls slowly as a ticker, or becomes swipeable for reduced-motion users.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var viewports = Array.prototype.slice.call(document.querySelectorAll('.affils-viewport'));

  function layoutRows() {
    viewports.forEach(function (vp) {
      var list = vp.querySelector('.affils');
      Array.prototype.forEach.call(list.querySelectorAll('[data-clone]'), function (n) { list.removeChild(n); });
      vp.classList.remove('ticker', 'scroll');
      if (list.scrollWidth <= list.clientWidth + 1) return;
      if (reduceMotion.matches) { vp.classList.add('scroll'); return; }
      Array.prototype.slice.call(list.children).forEach(function (li) {
        var copy = li.cloneNode(true);
        copy.setAttribute('data-clone', '');
        copy.setAttribute('aria-hidden', 'true');
        Array.prototype.forEach.call(copy.querySelectorAll('a'), function (link) { link.tabIndex = -1; });
        list.appendChild(copy);
      });
      vp.classList.add('ticker');
      list.style.setProperty('--ticker-duration', Math.round(list.scrollWidth / 2 / 35) + 's');
    });
  }

  // Phones fire "resize" whenever the address bar slides in or out while
  // scrolling; only a change in width should rebuild the rows, otherwise the
  // ticker restarts from the beginning and jumps.
  var rowWidth = window.innerWidth;
  var rowTimer;
  window.addEventListener('resize', function () {
    if (window.innerWidth === rowWidth) return;
    rowWidth = window.innerWidth;
    clearTimeout(rowTimer);
    rowTimer = setTimeout(layoutRows, 150);
  });
  layoutRows();

  // Highlight the section currently in view.
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (!sections.length) return;

  function update() {
    var probe = window.scrollY + window.innerHeight * 0.3;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.offsetTop <= probe) current = s;
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
