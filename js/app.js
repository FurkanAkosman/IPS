/** ===============================
 *  Gelişmiş iyileştirmeler
 *  - Erişilebilirlik, performans, scroll-spy
 * =============================== */

// 1) Skip-to-content linkini destekle (sayfada varsa)
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

// 2) prefers-reduced-motion: smooth-scroll devre dışı
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const smoothScroll = (top) => {
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
};

// 3) Header yüksekliği -> CSS değişkeni
const headerEl = document.getElementById('siteHeader');
const setHeaderVar = () => {
  const h = headerEl ? headerEl.offsetHeight : 0;
  document.documentElement.style.setProperty('--header-h', `${h}px`);
};
setHeaderVar();
window.addEventListener('resize', setHeaderVar);

// 4) Smooth-scroll yardımcılarını header var sayısıyla çalıştır
const scrollWithOffset = (el) => {
  const rect = el.getBoundingClientRect();
  const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
  const y = rect.top + window.pageYOffset - offset;
  smoothScroll(y);
};

// 5) Dış linkleri otomatik güvenli hale getir ve yeni sekmede aç
document.querySelectorAll('a[href]').forEach((a) => {
  try {
    const url = new URL(a.getAttribute('href'), document.baseURI);
    if (url.origin !== location.origin) {
      a.setAttribute('target', '_blank');
      const rel = (a.getAttribute('rel') || '').split(/\s+/);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' ').trim());
    }
  } catch { /* yoksay */ }
});

// 6) Mobil menü açıkken odak tuzağı
(() => {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  const focusableSel = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const trap = (e) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    const items = menu.querySelectorAll(focusableSel);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) {
      lastFocused = document.activeElement;
      setTimeout(() => {
        const first = menu.querySelector(focusableSel);
        first && first.focus();
      }, 0);
      document.addEventListener('keydown', trap);
    } else {
      document.removeEventListener('keydown', trap);
      lastFocused && lastFocused.focus();
    }
  });
})();

// 7) Scroll-spy: görünür section için menüyü güncelle
(() => {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!sections.length) return;
  const navLinks = Array.from(document.querySelectorAll('header a[href^="#"], header a[href*="#"]'));

  const byId = (id) => navLinks.filter(a => {
    const href = a.getAttribute('href') || '';
    try { return new URL(href, document.baseURI).hash === `#${id}`; } catch { return href.endsWith(`#${id}`); }
  });

  let activeId = null;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting) {
        activeId = ent.target.id;
      }
    });
    if (!activeId) return;
    // aktif sınıfları ayarla
    document.querySelectorAll('header a.is-active').forEach(a => a.classList.remove('is-active'));
    byId(activeId).forEach(a => a.classList.add('is-active'));
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });

  sections.forEach(s => io.observe(s));
})();

// 8) Sayfa içi anchor tıklamalarını header offset ile hizala
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = decodeURIComponent(a.getAttribute('href'));
  if (!id || id === '#') return;
  const target = document.querySelector(id);
  if (!target) return;
  if (a.target === '_blank') return;
  e.preventDefault();
  scrollWithOffset(target);
  history.pushState(null, '', id);
});
