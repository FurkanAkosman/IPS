(function () {
  function initFloatingIcons() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Section bazlı ikon setleri (Material Symbols isimleri)
    const ICONS = {
      hero:   ["science","hub","insights","biotech","neurology","psychology"],
      about:  ["lightbulb","groups","school","rocket_launch","handshake"],
      stats:  ["analytics","groups","psychology","emoji_objects"],
      focus:  ["biotech","neurology","model_training","memory","data_usage"],
      why:    ["school","science","emoji_objects","workspaces"],
      join:   ["groups","diversity_3","badge","support_agent"],
      funding:["account_balance","business_center","language","volunteer_activism"],
      fun:    ["sentiment_satisfied","sports_esports","celebration","movie"]
    };

    const sections = document.querySelectorAll("section");
    sections.forEach((sec) => {
      const layer = sec.querySelector(".fx-bg");
      if (!layer) return;

      // İkon rengi: hero/fun gibi koyu overlay varsa beyaz daha iyi
      const prefersWhite = sec.id === "hero" || sec.id === "fun";
      const iconColor = prefersWhite ? "rgba(255,255,255,0.9)" : "var(--burgundy)";
      const iconOpacity = prefersWhite ? 0.10 : 0.08;

      const key = layer.getAttribute("data-fx") || sec.id || "default";
      const list = ICONS[key] || ["science","lightbulb","hub"];

      const count = window.matchMedia("(min-width: 768px)").matches ? 18 : 10;

      for (let i = 0; i < count; i++) {
        const span = document.createElement("span");
        span.className = "material-symbols-outlined fx-icon";
        span.textContent = list[Math.floor(Math.random() * list.length)];

        const size = 18 + Math.random() * 26; // 18–44px
        const left = Math.random() * 100;     // %
        const top = 20 + Math.random() * 70;  // %
        const dur = 10 + Math.random() * 18;  // 10–28s
        const delay = -Math.random() * dur;
        const rot = (Math.random() * 40) - 20;

        span.style.fontSize = size + "px";
        span.style.left = left + "%";
        span.style.top = top + "%";
        span.style.animationDuration = dur + "s";
        span.style.animationDelay = delay + "s";
        span.style.transform = `translate3d(0,0,0) rotate(${rot}deg)`;
        span.style.color = iconColor;
        span.style.opacity = String(iconOpacity);

        layer.appendChild(span);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initFloatingIcons);
})();
