/* =========================================================
   IPS — Event Registration Script
   Google Sheets + Apps Script entegrasyonu
   ========================================================= */

(() => {
  'use strict';

  /* === CONFIG === */
  const ENDPOINT =
    'https://script.google.com/macros/s/AKfycbxJWdy76oJ1TYrwRwf59kMBk6vGu01vcoqrIeGxMEoAB8FCvUH9i48jpgrF06UW21ReBg/exec';

  const FORM_ID = 'eventRegisterForm';
  const SUBMIT_BTN_ID = 'eventSubmitBtn';
  const MESSAGE_ID = 'eventFormMessage';

  /* === HELPERS === */
  const qs = (id) => document.getElementById(id);

  const showMessage = (type, text) => {
    const box = qs(MESSAGE_ID);
    if (!box) return;

    box.className = 'mt-4 rounded-lg px-4 py-3 text-sm font-semibold';

    if (type === 'success') {
      box.classList.add('bg-green-50', 'text-green-700', 'border', 'border-green-200');
    } else {
      box.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
    }

    box.textContent = text;
    box.classList.remove('hidden');
  };

  const disableButton = (state) => {
    const btn = qs(SUBMIT_BTN_ID);
    if (!btn) return;

    btn.disabled = state;
    btn.classList.toggle('opacity-60', state);
    btn.classList.toggle('cursor-not-allowed', state);
  };

  /* === MAIN === */
  document.addEventListener('DOMContentLoaded', () => {
    const form = qs(FORM_ID);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Çift submit koruması
      if (form.dataset.submitted === 'true') return;
      form.dataset.submitted = 'true';

      // HTML5 validation
      if (!form.checkValidity()) {
        form.reportValidity();
        form.dataset.submitted = 'false';
        return;
      }

      // Form verisi
      const formData = new FormData(form);

      // KVKK kontrolü (checkbox name="kvkk")
      if (!formData.get('kvkk')) {
        showMessage('error', 'KVKK onayını işaretlemelisiniz.');
        form.dataset.submitted = 'false';
        return;
      }

      disableButton(true);

      // Metadata (log + analiz için)
      formData.append('page_url', window.location.href);
      formData.append('page_path', window.location.pathname); // Sheet kolonlarınızla daha uyumlu
      formData.append('user_agent', navigator.userAgent);
      formData.append('submitted_at', new Date().toISOString());

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          body: formData, // Apps Script tarafı e.parameter ile okuyorsa uyumlu
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // Bazı Apps Script cevapları JSON parse edilemeyebilir; güvenli parse
        const text = await res.text();
        let result = {};
        try {
          result = JSON.parse(text);
        } catch {
          result = { ok: true, raw: text }; // en azından başarılı kabul etmek için
        }

        // Eski endpoint "status: success" dönüyordu; yeni Code.gs "ok: true" dönüyor olabilir.
        const isSuccess = result.status === 'success' || result.ok === true;

        if (isSuccess) {
          showMessage('success', 'Kayıt başarıyla alındı.');
          form.reset();
        } else {
          throw new Error(result.message || result.error || 'Server error');
        }
      } catch (err) {
        console.error('[IPS] Event register error:', err);
        showMessage('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
        form.dataset.submitted = 'false';
      } finally {
        disableButton(false);
      }
    });
  });
})();
