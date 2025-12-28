/** ===============================
 *  Enhancements (A11y + perf + scroll-spy)
 *  NOTE: This is JavaScript. Save as app.js (not app.css)
 * =============================== */

(() => {
  // 0) Helpers
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const smoothScrollTo = (top) => {
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const getHeaderOffset = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim();
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  };

  const scrollWithOffset = (el) => {
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.pageYOffset - getHeaderOffset();
    smoothScrollTo(y);
  };

  // 1) Skip-to-content (if exists)
  const skip = document.querySelector('a[href="#main"]');
  if (skip) {
    skip.addEventListener('click', (e) => {
      const main = document.getElementById('main');
      if (!main) return;
      e.preventDefault();
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
      main.scrollIntoView({ block: 'start' });
      main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
    });
  }

  // 2) Header height -> CSS var
  const headerEl = document.getElementById('siteHeader');
  const setHeaderVar = () => {
    const h = headerEl ? headerEl.offsetHeight : 0;
    document.documentElement.style.setProperty('--header-h', `${h}px`);
  };
  setHeaderVar();
  window.addEventListener('resize', () => {
    window.clearTimeout(window.__hdrT);
    window.__hdrT = window.setTimeout(setHeaderVar, 120);
  });

  // 3) External links: add target+rel safely
  document.querySelectorAll('a[href]').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href) return;

    // ignore anchors and special schemes
    if (href.startsWith('#')) return;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

    try {
      const url = new URL(href, document.baseURI);
      if (url.origin !== location.origin) {
        a.setAttribute('target', '_blank');
        const relSet = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
        relSet.add('noopener');
        relSet.add('noreferrer');
        a.setAttribute('rel', Array.from(relSet).join(' '));
      }
    } catch {
      // ignore invalid URLs
    }
  });

  // 4) Focus trap for mobile menu (FIXED open/close logic)
  (() => {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    const focusableSel = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let lastFocused = null;

    const trap = (e) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (e.key !== 'Tab') return;

      const items = Array.from(menu.querySelectorAll(focusableSel))
        .filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');

      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // If your toggle script updates aria-expanded, listen after click via rAF
    toggle.addEventListener('click', () => {
      window.requestAnimationFrame(() => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          lastFocused = document.activeElement;
          document.addEventListener('keydown', trap);

          const first = menu.querySelector(focusableSel);
          first && first.focus();
        } else {
          document.removeEventListener('keydown', trap);
          lastFocused && lastFocused.focus();
        }
      });
    });
  })();

  // 5) Scroll-spy (robust link matching)
  (() => {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!sections.length) return;

    const navLinks = Array.from(
      document.querySelectorAll('header a[href^="#"], header a[href*="#"]')
    );

    const linksForId = (id) => navLinks.filter((a) => {
      const href = (a.getAttribute('href') || '').trim();
      if (!href) return false;
      try {
        return new URL(href, document.baseURI).hash === `#${id}`;
      } catch {
        return href.endsWith(`#${id}`) || href === `#${id}`;
      }
    });

    let activeId = null;

    const io = new IntersectionObserver((entries) => {
      // pick the most visible intersecting section
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length) activeId = visible[0].target.id;
      if (!activeId) return;

      document.querySelectorAll('header a.is-active')
        .forEach(a => a.classList.remove('is-active'));

      linksForId(activeId).forEach(a => a.classList.add('is-active'));
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0.15, 0.3, 0.5, 0.75]
    });

    sections.forEach(s => io.observe(s));
  })();

  // 6) In-page anchors: apply header offset
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    // ignore if explicitly new tab
    if (a.getAttribute('target') === '_blank') return;

    const href = (a.getAttribute('href') || '').trim();
    if (!href || href === '#') return;

    // decode hash safely
    let hash = href;
    try { hash = decodeURIComponent(href); } catch {}

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    scrollWithOffset(target);
    history.pushState(null, '', hash);
  });
})();
