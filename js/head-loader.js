// js/head-loader.js
document.addEventListener("DOMContentLoaded", () => {
  const head = document.querySelector("head");

  // favicon
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = "assets/img/kulup-logo.jpg";
  head.appendChild(favicon);

  // title
  const title = document.createElement("title");
  title.textContent = "IPS";
  head.appendChild(title);
});
