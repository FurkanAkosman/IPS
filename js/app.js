// assets/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  /** ===============================
   *  Aktif menü linki
   *  - GitHub Pages gibi alt dizinlerde çalışır
   * =============================== */
  const normalizePath = (p) => {
    if (!p) return '/';
    p = p.split('#')[0].split('?')[0];
    if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length) + '/';
    if (!p.endsWith('/')) p += '/';
    return p;
  };
  const current = normalizePath(location.pathname);

  document.querySelectorAll('header a[href]').forEach((a) => {
    try {
      const url = new URL(a.getAttribute('href'), location.origin);
      if (url.origin !== location.origin) return;        // dış bağlantı
      const targetPath = normalizePath(url.pathname);
      if (targetPath === current) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('is-active');
        // stil sınıfı yoksa asgari vurguyu uygula
        a.style.color ||= '#4D0011';
        a.style.fontWeight ||= '700';
      }
    } catch { /* yoksay */ }
  });

  /** ===============================
   *  Mobil menü aç/kapa (opsiyonel)
   *  - .nav__toggle + #navMenu
   * =============================== */
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  const body   = document.body;

  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded','false');
    body.classList.remove('overflow-hidden');
  };
  const toggleMenu = () => {
    if (!toggle || !menu) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    body.classList.toggle('overflow-hidden', !open);
  };

  toggle?.addEventListener('click', toggleMenu);
  menu?.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeMenu(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) closeMenu(); });

  /** ===============================
   *  Join Us → harici forma yönlendir
   * =============================== */
  const JOIN_FORM_URL = 'https://forms.gle/example'; // gerçek linkini koy
  document.querySelectorAll('a[href="#join"], .btn[href="#join"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      location.href = JOIN_FORM_URL;
    });
  });

  /** ===============================
   *  Sabit header offset’li smooth-scroll
   *  - id="siteHeader" varsa yüksekliği kadar offset uygular
   * =============================== */
  const siteHeader = document.getElementById('siteHeader');
  const headerH = () => (siteHeader ? siteHeader.offsetHeight : 0);

  const smoothScrollTo = (el) => {
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerH();
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      if (link.target === '_blank') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
      history.pushState(null, '', hash);
    }, { passive: false });
  });
});
