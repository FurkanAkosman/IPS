/* assets/js/submit-idea.js
   Submit -> Google Apps Script endpoint (Google Sheets’e yazar)
   Endpoint: daha önce verdiğin Apps Script Web App URL’si
*/
(() => {
  "use strict";

  // Daha önce paylaştığın endpoint
  const ENDPOINT =
    "https://script.google.com/macros/s/AKfycbw8HkZkC7_wJFmZBwuLT2uya4FzvjFOsmWi6uFHbMz8VWP6txbx1ShGhWvGnUzTUaSEVA/exec";

  const form = document.getElementById("submitIdeaForm");
  const msg = document.getElementById("formMessage");
  const submitBtn = document.getElementById("submitBtn");

  const membersCountEl = document.getElementById("membersCount");
  const membersCountInput = document.getElementById("membersCountInput");
  const minusBtn = document.getElementById("membersMinus");
  const plusBtn = document.getElementById("membersPlus");
  const addMemberBtn = document.getElementById("addMemberBtn");
  const teamContainer = document.getElementById("teamContainer");

  const saveDraftBtn = document.getElementById("saveDraftBtn");
  const previewBtn = document.getElementById("previewBtn");

  const showMessage = (type, text) => {
    msg.classList.remove("hidden");
    msg.textContent = text;

    msg.className = "rounded-lg px-4 py-3 text-sm font-semibold mt-6";
    if (type === "success") msg.classList.add("bg-emerald-50", "text-emerald-900", "border", "border-emerald-200");
    if (type === "error") msg.classList.add("bg-red-50", "text-red-900", "border", "border-red-200");
    if (type === "info") msg.classList.add("bg-white", "text-[#4d0011]", "border", "border-[rgba(77,0,17,.12)]");
  };

  const getCheckedValues = (name) =>
    Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((i) => i.value);

  // --- Members counter ---
  const setMembersCount = (n) => {
    const safe = Math.max(1, Math.min(20, Number(n) || 1));
    membersCountEl.textContent = String(safe);
    membersCountInput.value = String(safe);
  };

  minusBtn?.addEventListener("click", () => setMembersCount(Number(membersCountInput.value) - 1));
  plusBtn?.addEventListener("click", () => setMembersCount(Number(membersCountInput.value) + 1));

  // --- Add team member blocks (optional) ---
  const teamIndexFromDOM = () =>
    teamContainer.querySelectorAll(".team-card").length;

  addMemberBtn?.addEventListener("click", () => {
    const idx = teamIndexFromDOM() + 1;
    const wrap = document.createElement("div");
    wrap.className = "team-card";
    wrap.innerHTML = `
      <h4 class="team-title">Team Member ${idx}</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input class="field-sm" name="team${idx}Name" placeholder="Full Name" type="text"/>
        <input class="field-sm" name="team${idx}Email" placeholder="Email Address" type="email"/>
        <input class="field-sm" name="team${idx}Role" placeholder="Role" type="text"/>
      </div>
    `;
    teamContainer.appendChild(wrap);
  });

  // --- Local draft save (browser only) ---
  const DRAFT_KEY = "ips_submitidea_draft_v1";

  const collectDraft = () => {
    const fd = new FormData(form);
    // categories as list
    fd.delete("categories");
    getCheckedValues("categories").forEach((v) => fd.append("categories", v));
    // Serialize
    const obj = {};
    for (const [k, v] of fd.entries()) {
      if (obj[k] === undefined) obj[k] = v;
      else if (Array.isArray(obj[k])) obj[k].push(v);
      else obj[k] = [obj[k], v];
    }
    return obj;
  };

  saveDraftBtn?.addEventListener("click", () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraft()));
      showMessage("success", "Draft saved locally on this device.");
    } catch {
      showMessage("error", "Draft could not be saved (storage blocked).");
    }
  });

  const restoreDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      Object.entries(data).forEach(([k, v]) => {
        if (k === "categories") return;
        const el = form.querySelector(`[name="${CSS.escape(k)}"]`);
        if (!el) return;
        if (el.type === "checkbox" || el.type === "radio") return;
        el.value = String(v ?? "");
      });

      if (Array.isArray(data.categories)) {
        data.categories.forEach((val) => {
          const cb = form.querySelector(`input[name="categories"][value="${CSS.escape(val)}"]`);
          if (cb) cb.checked = true;
        });
      }

      if (data.membersCount) setMembersCount(data.membersCount);
      showMessage("info", "Draft restored from this device.");
    } catch {
      // ignore
    }
  };

  restoreDraft();

  // --- Preview (simple modal via new window) ---
  previewBtn?.addEventListener("click", () => {
    const d = collectDraft();
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><meta charset="utf-8"/><title>Preview</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h2>${escapeHtml(d.projectTitle || "")}</h2>
        <p><b>Categories:</b> ${(Array.isArray(d.categories) ? d.categories : [d.categories]).filter(Boolean).join(", ")}</p>
        <pre style="white-space: pre-wrap; background:#f6f6f6; padding:12px; border-radius:8px;">${escapeHtml(d.projectDesc || "")}</pre>
        <p><b>Contact:</b> ${escapeHtml(d.fullName || "")} — ${escapeHtml(d.email || "")}</p>
      </body></html>
    `);
    w.document.close();
  });

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  // --- Submit to Apps Script ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.classList.add("hidden");

    // Basic required checks
    const title = form.projectTitle?.value?.trim();
    const desc = form.projectDesc?.value?.trim();
    const cats = getCheckedValues("categories");
    const fullName = form.fullName?.value?.trim();
    const email = form.email?.value?.trim();
    const consent = document.getElementById("consent")?.checked;

    if (!title || !desc || desc.length < 20) {
      showMessage("error", "Please fill Project Title and a meaningful Description.");
      return;
    }
    if (!cats.length) {
      showMessage("error", "Please select at least one Category.");
      return;
    }
    if (!fullName || !email) {
      showMessage("error", "Please fill Full Name and Email.");
      return;
    }
    if (!consent) {
      showMessage("error", "You must accept the confidentiality/terms checkbox.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-70", "cursor-not-allowed");
    showMessage("info", "Submitting...");

    try {
      const fd = new FormData(form);

      // categories as comma string (sheet-friendly)
      fd.delete("categories");
      fd.append("categories", cats.join(", "));

      // add metadata for sheet
      fd.append("source", "submit-idea.html");
      fd.append("submittedAt", new Date().toISOString());

      // Team members: normalize into JSON too (so sheet has one clean column)
      const team = [];
      const teamCards = teamContainer.querySelectorAll(".team-card");
      teamCards.forEach((_, i) => {
        const idx = i + 1;
        const name = (form[`team${idx}Name`]?.value || "").trim();
        const em = (form[`team${idx}Email`]?.value || "").trim();
        const role = (form[`team${idx}Role`]?.value || "").trim();
        if (name || em || role) team.push({ name, email: em, role });
      });
      fd.append("teamJson", JSON.stringify(team));

      // POST (Apps Script tipik olarak form-urlencoded veya multipart kabul eder)
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: fd,
      });

      // Bazı Apps Script’ler text/json döner
      const text = await res.text();
      const ok = res.ok && /success|ok|saved/i.test(text);

      if (!res.ok) {
        showMessage("error", "Submit failed. Endpoint response error.");
        return;
      }

      // Eğer endpoint açıkça "success" döndürmüyorsa bile res.ok ise başarı kabul et
      showMessage("success", ok ? "Submitted successfully. Your proposal has been recorded." : "Submitted. If you do not see it in the sheet, verify the Apps Script response.");
      form.reset();
      setMembersCount(3);
      localStorage.removeItem(DRAFT_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      showMessage("error", "Submit failed. Check CORS / Apps Script deployment permissions.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
    }
  });
})();
