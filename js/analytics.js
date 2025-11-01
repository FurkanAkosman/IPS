// Google Analytics 4 izleme (Interdisciplinary Project Society)
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

// GA4 scriptini dinamik olarak yükle
(function(){
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-RRXXHFHW74';
  document.head.appendChild(s);
})();

// Sayfa tamamen yüklendiğinde çalıştır
window.addEventListener('load', () => {
  gtag('js', new Date());
  gtag('config', 'G-RRXXHFHW74', {
    anonymize_ip: true,     // IP anonimleştirme (GDPR uyumlu)
    send_page_view: true    // Sayfa görüntülenmelerini otomatik gönder
  });
});
