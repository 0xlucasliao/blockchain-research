/**
 * Scroll reveal, optional view transitions on internal links, reduced motion, theme.
 */
(function () {
  var d = document.documentElement;
  var themeKey = 'br-theme';

  function applyThemeFromStorage() {
    if (localStorage.getItem(themeKey) === 'dark') {
      d.setAttribute('data-br-theme', 'dark');
    } else {
      d.removeAttribute('data-br-theme');
    }
    syncThemeToggleLabels();
  }

  function syncThemeToggleLabels() {
    var dark = d.getAttribute('data-br-theme') === 'dark';
    document.querySelectorAll('[data-br-theme-toggle]').forEach(function (btn) {
      btn.textContent = dark ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  applyThemeFromStorage();

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-br-theme-toggle]');
    if (!btn) return;
    if (d.getAttribute('data-br-theme') === 'dark') {
      d.removeAttribute('data-br-theme');
      localStorage.setItem(themeKey, 'light');
    } else {
      d.setAttribute('data-br-theme', 'dark');
      localStorage.setItem(themeKey, 'dark');
    }
    syncThemeToggleLabels();
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce) {
    document.body.classList.add('br-animate-page-in');
  }

  /** Full path suffix so /use_cases/index.html ≠ /index.html */
  function normalizedPathname(pathname) {
    var p = pathname || '/';
    if (p.endsWith('/')) p += 'index.html';
    return p;
  }

  function markCurrentNav() {
    var cur = normalizedPathname(window.location.pathname);
    document.querySelectorAll('.br-masthead a[href]').forEach(function (a) {
      try {
        var hp = new URL(a.getAttribute('href'), window.location.href).pathname;
        hp = normalizedPathname(hp);
        if (hp === cur) {
          a.setAttribute('aria-current', 'page');
        }
      } catch (_) {}
    });
  }

  markCurrentNav();

  function syncMastheadHeight() {
    var bar = document.querySelector('.br-masthead');
    if (!bar) return;
    var px = Math.ceil(bar.getBoundingClientRect().height);
    d.style.setProperty('--br-masthead-height', px + 'px');
  }

  syncMastheadHeight();
  if ('ResizeObserver' in window) {
    var barEl = document.querySelector('.br-masthead');
    if (barEl) {
      var ro = new ResizeObserver(syncMastheadHeight);
      ro.observe(barEl);
    }
  } else {
    window.addEventListener('resize', syncMastheadHeight);
  }

  if (!reduce && 'IntersectionObserver' in window) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var io = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('br-is-visible');
              obs.unobserve(en.target);
            }
          });
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.03 }
      );
      io.observe(el);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('br-is-visible');
    });
  }

  if (!reduce && document.startViewTransition) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;

      var url;
      try {
        url = new URL(a.getAttribute('href'), window.location.href);
      } catch (_) {
        return;
      }

      if (url.origin !== window.location.origin) return;

      var cur = new URL(window.location.href);
      if (url.pathname === cur.pathname && url.hash) return;
      if (url.href.split('#')[0] === cur.href.split('#')[0]) return;

      var raw = url.pathname;
      if (raw.endsWith('/')) raw += 'index.html';
      var seg = raw.split('/').filter(Boolean).pop() || '';
      if (!seg.endsWith('.html')) return;

      e.preventDefault();
      document.startViewTransition(function () {
        window.location.href = url.href;
      });
    });
  }
})();
