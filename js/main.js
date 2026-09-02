/* Sloan Business Club — small progressive-enhancement script.
   1. Mobile navigation toggle
   2. Dropdown open/close on click (touch and keyboard); hover handled in CSS
   3. Marks the current page in the nav via aria-current  */
/* Scroll reveal: elements float up as they enter the viewport. Siblings stagger. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');

  var HERO = '.hero .container > *';
  var GROUPS = [
    '.section-head', '.grid > *', '.people > *', '.logo-wall__item', '.stats > *', '.steps > *',
    '.post-list > *', '.gallery > figure', '.contact-cards > *', '.chips', '.name-grid', '.accordion', '.tl > *', '.apply-box', '.sponsor-note',
    '.people-group__title', '.cta > *', '.feature > *', '.article > *', '.newsletter-pages > *',
    '.section > .container > .btn-row', '.section > .container > p', '.section > .container > h2',
    '.section > .container--narrow > *'
  ];
  var els = [];
  document.querySelectorAll(HERO).forEach(function (el, i) {
    el.classList.add('reveal', 'reveal--hero'); el.style.setProperty('--reveal-delay', (i * 110) + 'ms'); els.push(el);
  });
  document.querySelectorAll(GROUPS.join(',')).forEach(function (el) {
    if (el.classList.contains('reveal') || el.closest('.reveal')) return;
    el.classList.add('reveal');
    // stagger by position among reveal siblings, capped so long grids don't crawl
    var idx = 0, s = el.previousElementSibling;
    while (s) { if (s.classList.contains('reveal')) idx++; s = s.previousElementSibling; }
    el.style.setProperty('--reveal-delay', Math.min(idx, 7) * 70 + 'ms');
    els.push(el);
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el) { io.observe(el); });
  // Anything already in view on load reveals immediately (after first paint).
  requestAnimationFrame(function () {
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
    });
  });
})();

(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var toggle = header.querySelector('.nav-toggle');
  var nav = header.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });
  }

  function setOpen(item, open) {
    item.setAttribute('data-open', String(open));
    var b = item.querySelector(':scope > button');
    if (b) b.setAttribute('aria-expanded', String(open));
  }
  function closeAll() {
    header.querySelectorAll('.nav li.has-menu').forEach(function (o) { setOpen(o, false); });
  }
  header.querySelectorAll('.nav li.has-menu').forEach(function (item) {
    var btn = item.querySelector(':scope > button');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = item.getAttribute('data-open') === 'true';
      closeAll();
      setOpen(item, !open);
    });
  });
  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAll();
    if (toggle && nav && nav.classList.contains('is-open')) toggle.click();
  });

  // Current-page highlighting: compare the last path segment of each link with the page.
  var here = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '/index.html');
  var hereFile = here.split('/').pop();
  var inEdge = /\/edge\//.test(location.pathname);
  header.querySelectorAll('.nav a[href]').forEach(function (a) {
    var file = a.getAttribute('href').split('/').pop().split('#')[0] || 'index.html';
    var match = file === hereFile || (inEdge && /edge\.html$/.test(a.getAttribute('href')));
    if (match) {
      a.setAttribute('aria-current', 'page');
      var parent = a.closest('li.has-menu');
      if (parent) parent.classList.add('is-active');
    }
  });
})();
