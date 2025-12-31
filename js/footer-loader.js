/* IPS Footer Loader: inject footer + rewrite relative URLs (cross-path safe) */
(async function loadFooter() {
  try {
    if (window.__IPS_FOOTER_INJECTED__) return;
    window.__IPS_FOOTER_INJECTED__ = true;

    // ----- Kök ve prefix hesapla (/IPS/ desteği) -----
    const p = location.pathname;
    const ipsIdx = p.indexOf("/IPS/");
    const siteBase = ipsIdx !== -1 ? p.slice(0, ipsIdx + 5) : "/"; // "/IPS/" veya "/"
    const rest = ipsIdx !== -1 ? p.slice(ipsIdx + 5) : p.slice(1);
    const segs = rest.split("/").filter(Boolean);
    const last = segs[segs.length - 1] || "";
    const isFile = /\.[a-z0-9]+$/i.test(last);
    const dirSegs = isFile ? segs.slice(0, -1) : segs;
    const relPrefix = "../".repeat(dirSegs.length); // '', '../', '../../', ...
    const prefix = relPrefix; // Use relative prefix for fetch and rewrites

    // ----- Yardımcılar -----
    const ABS = /^(?:[a-z]+:|\/\/|#|mailto:|tel:)/i;

    function rewriteRelUrls(rootEl) {
      if (!rootEl) return;

      // href rewrite
      rootEl.querySelectorAll("[href]").forEach((el) => {
        const v = el.getAttribute("href");
        if (!v) return;
        if (ABS.test(v)) return;

        // "/..." -> siteBase içine taşı ("/IPS/" altında tutarlı olsun)
        if (v.startsWith("/")) {
          el.setAttribute("href", siteBase + v.replace(/^\/+/, ""));
          return;
        }

        el.setAttribute(
          "href",
          (prefix + v.replace(/^\.\//, "")).replace(/\/\.\//g, "/")
        );
      });

      // src rewrite
      rootEl.querySelectorAll("[src]").forEach((el) => {
        const v = el.getAttribute("src");
        if (!v) return;
        if (ABS.test(v)) return;

        if (v.startsWith("/")) {
          el.setAttribute("src", siteBase + v.replace(/^\/+/, ""));
          return;
        }

        el.setAttribute(
          "src",
          (prefix + v.replace(/^\.\//, "")).replace(/\/\.\//g, "/")
        );
      });

      // data-src (lazy) -> src rewrite
      rootEl.querySelectorAll("img[data-src]").forEach((img) => {
        const v = img.getAttribute("data-src");
        if (!v) return;
        if (ABS.test(v)) {
          img.setAttribute("src", v);
          img.removeAttribute("data-src");
          return;
        }
        if (v.startsWith("/")) {
          img.setAttribute("src", siteBase + v.replace(/^\/+/, ""));
          img.removeAttribute("data-src");
          return;
        }
        img.setAttribute(
          "src",
          (prefix + v.replace(/^\.\//, "")).replace(/\/\.\//g, "/")
        );
        img.removeAttribute("data-src");
      });
    }

    // ----- Footer'ı çek ve yerleştir -----
    const res = await fetch(prefix + "partials/footer.html", { cache: "no-cache" });
    if (!res.ok) throw new Error("Footer fetch failed: " + res.status + " " + res.statusText);
    const html = await res.text();

    const holder = document.createElement("div");
    holder.innerHTML = html;

    const ftr = holder.querySelector("footer") || holder.firstElementChild;
    if (!ftr || ftr.tagName.toLowerCase() !== "footer") {
      throw new Error("Footer markup missing <footer> root");
    }

    // 1) İçerideki göreli yolları düzelt
    rewriteRelUrls(ftr);

    // 2) Mevcut <footer> varsa değiştir; yoksa sona ekle
    const old = document.querySelector("footer");
    if (old && old.parentNode) old.replaceWith(ftr);
    else document.body.insertAdjacentElement("beforeend", ftr);

    // 3) Dış link güvenliği
    ftr.querySelectorAll('a[target="_blank"]').forEach((a) => {
      const rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
      if (!rel.includes("noopener")) rel.push("noopener");
      if (!rel.includes("noreferrer")) rel.push("noreferrer");
      a.setAttribute("rel", rel.join(" "));
    });

    // 4) Yıl (footer-year varsa)
    const y = document.getElementById("footer-year");
    if (y) y.textContent = "2026";
  } catch (e) {
    console.error("[IPS] footer-loader error:", e);
  }
})();
