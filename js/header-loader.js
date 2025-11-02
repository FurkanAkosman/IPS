/* IPS Header Loader: inject header + GA + behavior (cross-path safe) */
(async function loadHeader() {
  // ----- CLS için yer tutucu -----
  const spacer = document.createElement('div');
  spacer.id = 'ips-header-spacer';
  spacer.style.cssText = 'height:64px;';
  document.body.insertAdjacentElement('afterbegin', spacer);

  // ----- Kök ve prefix hesapla (/IPS/ desteği) -----
  const p = location.pathname;
  const ipsIdx = p.indexOf('/IPS/');
  const siteBase = ipsIdx !== -1 ? p.slice(0, ipsIdx + 5) : '/';
  const rest = ipsIdx !== -1 ? p.slice(ipsIdx + 5) : p.slice(1);
  const segs = rest.split('/').filter(Boolean);
  const last = segs[segs.length - 1] || '';
  const isFile = /\.[a-z0-9]+$/i.test(last);
  const dirSegs = isFile ? segs.slice(0, -1) : segs;
  const prefix = siteBase + '../'.repeat(dirSegs.length); // '', '../', '../../', ...

  // ----- Yardımcılar -----
  const ABS = /^(?:[a-z]+:|\/\/|#|mailto:|tel:)/i;
  const normalizePath = (path) => {
    if (!path) return '/';
    path = path.split('#')[0].split('?')[0];
    if (path.endsWith('/index.html')) path = path.slice(0, -('/index.html'.length)) + '/';
    if (!path.endsWith('/')) path += '/';
    return path;
  };
  const currentNorm = normalizePath(location.pathname);

  function rewriteRelUrls(rootEl) {
    if (!rootEl) return;
    // href
    rootEl.querySelectorAll('[href]').forEach((el) => {
      const v = el.getAttribute('href');
      if (!v) return;
      if (ABS.test(v)) return;             // http, //, #, mailto, tel
      if (v.startsWith('/')) {             // kök-başlangıçlıysa /IPS/ köküne taşı
        el.setAttribute('href', siteBase + v.replace(/^\/+/, ''));
        return;
      }
      el.setAttribute('href', (prefix + v.replace(/^\.\//, '')).replace(/\/\.\//g, '/'));
    });
    // src
    rootEl.querySelectorAll('[src]').forEach((el) => {
      const v = el.getAttribute('src');
      if (!v) return;
      if (ABS.test(v)) return;
      if (v.startsWith('/')) {
        el.setAttribute('src', siteBase + v.replace(/^\/+/, ''));
        return;
      }
      el.setAttribute('src', (prefix + v.replace(/^\.\//, '')).replace(/\/\.\//g, '/'));
    });
  }

  // ----- Header'ı çek ve yerleştir -----
  try {
    const res = await fetch(prefix + 'partials/header.html', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Header fetch failed: ' + res.status + ' ' + res.statusText);
    const html = await res.text();

    const holder = document.createElement('div');
    holder.innerHTML = html;
    const hdr = holder.querySelector('header#siteHeader') || holder.firstElementChild;
    if (!hdr) throw new Error('Header markup missing #siteHeader');

    // 1) İçerideki göreli yolları düzelt
    rewriteRelUrls(hdr);

    // 2) Mevcut <header> varsa değiştir; yoksa başa ekle
    const old = document.querySelector('header');
    if (old && old.parentNode) old.replaceWith(hdr);
    else document.body.insertAdjacentElement('afterbegin', hdr);

    // 3) GA tekil yükleme
    if (!document.querySelector('script[data-ga="ips"]')) {
      const s = document.createElement('script');
      s.src = prefix + 'js/analytics.js';
      s.defer = true;
      s.setAttribute('data-ga','ips');
      document.head.appendChild(s);
    }

    // 4) Dış link güvenliği
    hdr.querySelectorAll('a[target="_blank"]').forEach((a) => {
      const rel = (a.getAttribute('rel') || '').split(/\s+/);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' ').trim());
    });

    // 5) Aktif menü işaretleme (alt dizin uyumlu)
    hdr.querySelectorAll('a[href]').forEach((a) => {
      try {
        const u = new URL(a.getAttribute('href'), location.origin + siteBase);
        if (normalizePath(u.pathname) === currentNorm) {
          a.setAttribute('aria-current', 'page');
          a.classList.add('is-active');
          a.style.color ||= '#4D0011';
          a.style.fontWeight ||= '700';
        }
      } catch { /* yoksay */ }
    });

    // 6) Mobil menü
    const menuBtn   = hdr.querySelector('#menuToggle') || hdr.querySelector('#navToggle');
    const mobileMenu= hdr.querySelector('#mobileMenu') || hdr.querySelector('#navMenu');
    const body      = document.body;

    function closeMenu() {
      if (!mobileMenu) return;
      mobileMenu.classList.add('hidden');
      body.classList.remove('overflow-hidden');
      menuBtn?.setAttribute('aria-expanded','false');
    }
    function toggleMenu() {
      if (!mobileMenu) return;
      const open = !mobileMenu.classList.contains('hidden');
      open ? closeMenu() : (mobileMenu.classList.remove('hidden'),
                            body.classList.add('overflow-hidden'),
                            menuBtn?.setAttribute('aria-expanded','true'));
    }
    menuBtn?.addEventListener('click', toggleMenu);
    mobileMenu?.addEventListener('click', (e)=>{ if (e.target.tagName === 'A') closeMenu(); });
    window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeMenu(); }, { passive:true });
    window.addEventListener('resize', ()=>{ if (window.innerWidth >= 768) closeMenu(); }, { passive:true });
    window.addEventListener('scroll', closeMenu, { passive:true });

    // 7) Görünürlük davranışı (isteğe bağlı kahraman bölümü)
    const hero = document.getElementById('hero');
    const mq = window.matchMedia('(min-width: 768px)');
    let io = null;

    function forceVisible() {
      hdr.classList.add('opacity-100','translate-y-0','pointer-events-auto');
      hdr.classList.remove('opacity-0','-translate-y-4','pointer-events-none');
    }
    function setupHeaderObserver() {
      if (io) { io.disconnect(); io = null; }
      if (!hero) { forceVisible(); return; }
      if (mq.matches) {
        io = new IntersectionObserver((entries) => {
          const e = entries[0];
          if (e.isIntersecting) {
            hdr.classList.add('opacity-0','-translate-y-4','pointer-events-none');
            hdr.classList.remove('opacity-100','translate-y-0','pointer-events-auto');
          } else {
            forceVisible();
          }
        }, { threshold: 0.01 });
        io.observe(hero);
      } else {
        forceVisible();
      }
    }
    setupHeaderObserver();
    mq.addEventListener('change', setupHeaderObserver);

  } catch (err) {
    console.error('[IPS] header-loader error:', err);
    spacer.remove();
  }
})();
