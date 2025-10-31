// Google Analytics 4 izleme
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

// gtag.js dosyasını dinamik olarak yükle
(function(){
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-RRXXHFHW74';
  document.head.appendChild(s);
})();

// GA yapılandırması
gtag('js', new Date());
gtag('config', 'G-RRXXHFHW74', { anonymize_ip: true });
