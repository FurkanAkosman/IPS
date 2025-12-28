// js/head-loader.js
document.addEventListener("DOMContentLoaded", () => {
  const head = document.head;

  /* ===============================
     FAVICON (varsa tekrar ekleme)
     =============================== */
  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = "assets/img/kulup-logo.jpg";
    head.appendChild(favicon);
  }

  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = "assets/img/kulup-logo.jpg";
    head.appendChild(appleIcon);
  }

  /* ===============================
     TITLE (sadece yoksa ekle)
     =============================== */
  if (!document.querySelector("title")) {
    const title = document.createElement("title");
    title.textContent = "Interdisciplinary Project Society (IPS)";
    head.appendChild(title);
  }
});
