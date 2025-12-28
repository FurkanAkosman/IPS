/* IPS Header Loader: inject header + GA + behavior (GitHub Pages /IPS/ uyumlu)
 * Güncellemeler:
 * - /IPS/ altında derin klasörlerde doğru prefix hesaplama
 * - fetch + script src + href/src rewrite daha stabil
 * - CLS spacer yüksekliğini gerçek header yüksekliğine göre güncelleme
 * - active link eşleştirmesi /IPS/ kökü dikkate alır
 * - yeni sayfalar (event-register.html, kvkk.html vb.) için ekstra iş gerekmez; linkler partials/header.html içinde olmalı
 */

(async function loadHeader() {
  // ----- CLS için yer tutucu (header yüksekliği kadar) -----
  const spacer = document.createElement("div");
  spacer.id = "ips-header-spacer";
  spacer.style.cssText = "height:64px;";
  document.body.insertAdjacentElement("afterbegin", spacer);

  // ----- /IPS/ kökü ve derinlik hesapla -----
  const pathname = location.pathname; // ör: /IPS/event-register.html veya /IPS/blog/x.html
  const hasIPS = pathname.includes("/IPS/");
  const siteBase = hasIPS ? pathname.split("/IPS/")[0] + "/IPS/" : "/"; // her zaman .../IPS/
  const afterBase = hasIPS ? pathname.split("/IPS/")[1] : pathname.replace(/^\//, ""); // event-register.html, blog/x.html

  const segs = afterBase.split("/").filter(Boolean);
  const last = segs[segs.length - 1] || "";
  const isFile = /\.[a-z0-9]+$/i.test(last);
  const dirSegs = isFile ? segs.slice(0, -1) : segs;
  const relPrefix = "../".repeat(dirSegs.length); // '', '../', '../../'...

  // ----- Yardımcılar -----
  const ABS = /^(?:[a-z]+:|\/\/|#|mailto:|tel:)/i;

  const normalizePath = (path) => {
    if (!path) return "/";
    path = path.split("#")[0].split("?")[0];

    // /IPS/ ve /IPS/index.html eşdeğer olsun
    if (path.endsWith("/index.html")) path = path.slice(0, -"/index.html".length) + "/";

    // trailing slash standardize (dosyalar hariç)
    const isFilePath = /\.[a-z0-9]+$/i.test(path.split("/").pop() || "");
    if (!isFilePath && !path.endsWith("/")) path += "/";

    return path;
  };

  const currentNorm = normalizePath(pathname);

  function rewriteRelUrls(rootEl) {
    if (!rootEl) return;

    // href rewrite
    rootEl.querySelectorAll("[href]").forEach((el) => {
      const v = el.getAttribute("href");
      if (!v || ABS.test(v)) return;

      // "/something" -> siteBase + "something"
      if (v.startsWith("/")) {
        el.setAttribute("href", siteBase + v.replace(/^\/+/, ""));
        return;
      }

      // "something" -> relPrefix + something
      el.setAttribute("href", (relPrefix + v.replace(/^\.\//, "")).replace(/\/\.\//g, "/"));
    });

    // src rewrite
    rootEl.querySelectorAll("[src]").forEach((el) => {
      const v = el.getAttribute("src");
      if (!v || ABS.test(v)) return;

      if (v.startsWith("/")) {
        el.setAttribute("src", siteBase + v.replace(/^\/+/, ""));
        return;
      }

      el.setAttribute("src", (relPrefix + v.replace(/^\.\//, "")).replace(/\/\.\//g, "/"));
    });
  }

  try {
    // ----- Header'ı çek -----
    // partials/header.html repo kökünde olduğu için: relPrefix + partials/header.html
    const res = await fetch(relPrefix + "partials/header.html", { cache: "no-cache" });
    if (!res.ok) throw new Error("Header fetch failed: " + res.status + " " + res.statusText);
    const html = await res.text();

    const holder = document.createElement("div");
    holder.innerHTML = html;

    // Beklenen: <header id="siteHeader"> ... </header>
    const hdr = holder.querySelector("header#siteHeader") || holder.querySelector("header") || holder.firstElementChild;
    if (!hdr || hdr.tagName.toLowerCase() !== "header") throw new Error("Header markup missing <header> (prefer #siteHeader)");

    // 1) İçerideki göreli yolları düzelt (tüm sayfalarda çalışır)
    rewriteRelUrls(hdr);

    // 2) Mevcut header varsa onunla değiştir; yoksa başa ekle
    const old = document.querySelector("header");
    if (old && old.parentNode) old.replaceWith(hdr);
    else document.body.insertAdjacentElement("afterbegin", hdr);

    // 3) CLS spacer yüksekliğini gerçek header yüksekliğine göre ayarla
    // (sticky header olduğu için body yukarı zıplamasın)
    requestAnimationFrame(() => {
      const h = hdr.getBoundingClientRect().height || 64;
      spacer.style.height = `${Math.round(h)}px`;
    });

    // 4) GA tekil yükleme (analytics.js)
    // analytics.js repo kökünde: /IPS/js/analytics.js => relPrefix + js/analytics.js
    if (!document.querySelector('script[data-ga="ips"]')) {
      const s = document.createElement("script");
      s.src = relPrefix + "js/analytics.js";
      s.defer = true;
      s.setAttribute("data-ga", "ips");
      document.head.appendChild(s);
    }

    // 5) Dış link güvenliği (target=_blank)
    hdr.querySelectorAll('a[target="_blank"]').forEach((a) => {
      const rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
      if (!rel.includes("noopener")) rel.push("noopener");
      if (!rel.includes("noreferrer")) rel.push("noreferrer");
      a.setAttribute("rel", rel.join(" "));
    });

    // 6) Aktif menü işaretleme (/IPS/ kökü uyumlu)
    hdr.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || ABS.test(href)) return;

      try {
        // href'i sayfaya göre çözüp normalize et
        const u = new URL(href, location.origin + pathname);
        const aNorm = normalizePath(u.pathname);

        if (aNorm === currentNorm) {
          a.setAttribute("aria-current", "page");
          a.classList.add("is-active");
          // Tailwind sınıflarına dokunmadan basit vurgu:
          a.style.color = a.style.color || "#4D0011";
          a.style.fontWeight = a.style.fontWeight || "700";
        }
      } catch {
        /* yoksay */
      }
    });

    // 7) Mobil menü davranışı (partials/header.html içinde id’ler olmalı)
    const menuBtn = hdr.querySelector("#menuToggle") || hdr.querySelector("#navToggle");
    const mobileMenu = hdr.querySelector("#mobileMenu") || hdr.querySelector("#navMenu");
    const body = document.body;

    function closeMenu() {
      if (!mobileMenu) return;
      mobileMenu.classList.add("hidden");
      body.classList.remove("overflow-hidden");
      menuBtn?.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
      if (!mobileMenu) return;
      const open = !mobileMenu.classList.contains("hidden");
      if (open) closeMenu();
      else {
        mobileMenu.classList.remove("hidden");
        body.classList.add("overflow-hidden");
        menuBtn?.setAttribute("aria-expanded", "true");
      }
    }

    menuBtn?.addEventListener("click", toggleMenu);
    mobileMenu?.addEventListener("click", (e) => {
      if (e.target && e.target.tagName === "A") closeMenu();
    });

    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") closeMenu();
      },
      { passive: true }
    );

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth >= 768) closeMenu();
      },
      { passive: true }
    );

    // scroll ile kapanma bazı sayfalarda agresif olabilir; istersen kapat:
    // window.addEventListener('scroll', closeMenu, { passive:true });

    // 8) İsteğe bağlı “hero görünürken header gizle” davranışı
    const hero = document.getElementById("hero");
    const mq = window.matchMedia("(min-width: 768px)");
    let io = null;

    function forceVisible() {
      hdr.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
      hdr.classList.remove("opacity-0", "-translate-y-4", "pointer-events-none");
    }

    function setupHeaderObserver() {
      if (io) {
        io.disconnect();
        io = null;
      }
      if (!hero) {
        forceVisible();
        return;
      }

      if (mq.matches) {
        io = new IntersectionObserver(
          (entries) => {
            const ent = entries[0];
            if (ent.isIntersecting) {
              hdr.classList.add("opacity-0", "-translate-y-4", "pointer-events-none");
              hdr.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
            } else {
              forceVisible();
            }
          },
          { threshold: 0.01 }
        );
        io.observe(hero);
      } else {
        forceVisible();
      }
    }

    setupHeaderObserver();
    mq.addEventListener("change", setupHeaderObserver);
  } catch (err) {
    console.error("[IPS] header-loader error:", err);
    // Header gelmezse spacer kalsın diye kaldırmıyorum; ama istersen:
    // spacer.remove();
  }
})();
