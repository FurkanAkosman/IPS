/* analytics.js
 * Google Analytics 4 (GA4) – IPS
 * Measurement ID: G-RRXXHFHW74
 * Notlar:
 * - Scripti tek kez yükler (çift yükleme engeli)
 * - IP anonimleştirme açık
 * - Sayfa görüntülemeyi otomatik gönderir
 */

(function () {
  const MEASUREMENT_ID = "G-RRXXHFHW74";

  // dataLayer + gtag (varsa ezme)
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  // Çift yüklemeyi engelle
  const existing = document.querySelector(`script[data-ga4="${MEASUREMENT_ID}"]`);
  if (!existing) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    s.setAttribute("data-ga4", MEASUREMENT_ID);
    document.head.appendChild(s);
  }

  // init + config (bir kez)
  if (!window.__IPS_GA4_INIT__) {
    window.__IPS_GA4_INIT__ = true;

    // DOM hazır olunca çalıştır
    const init = () => {
      window.gtag("js", new Date());
      window.gtag("config", MEASUREMENT_ID, {
        anonymize_ip: true,
        send_page_view: true
      });
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      init();
    } else {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    }
  }
})();
