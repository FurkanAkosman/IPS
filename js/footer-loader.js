/* IPS Footer Loader — partials/footer.html'ü enjekte eder ve yolları düzeltir */
(async function injectIPSFooter() {
  try {
    if (window.__IPS_FOOTER_INJECTED__) return;
    window.__IPS_FOOTER_INJECTED__ = true;

    // Taban yol: GitHub Pages => /IPS/, lokal => /
    const base = location.pathname.includes('/IPS/') ? '/IPS/' : '/';

    // Tutucu
    const holder = document.createElement('div');
    holder.id = 'ips-footer-holder';
    document.body.appendChild(holder);

    // Partial'ı getir
    const res = await fetch(base + 'partials/footer.html?v=2', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Footer fetch failed: ' + res.status);

    // Enjekte et
    holder.outerHTML = await res.text();

    // Yılı yaz
    const y = document.getElementById('footer-year');
    if (y) y.textContent = new Date().getFullYear();

    // Görseller için doğru kök
    document.querySelectorAll('footer img[data-src]').forEach(img => {
      const rel = img.getAttribute('data-src'); // örn: assets/icon/...
      img.src = base + rel;
      img.removeAttribute('data-src');
    });
  } catch (e) {
    console.error('[IPS] footer-loader error:', e);
  }
})();
