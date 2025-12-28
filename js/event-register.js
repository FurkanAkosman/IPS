/* =========================================================
   IPS — Event Registration Script
   Google Sheets + Apps Script entegrasyonu
   ========================================================= */

(() => {
  'use strict';

  /* === CONFIG === */
  const ENDPOINT =
    'https://script.google.com/macros/s/AKfycbw8HkZkC7_wJFmZBwuLT2uya4FzvjFOsmWi6uFHbMz8VWP6txbx1ShGhWvGnUzTUaSEVA/exec';

  const FORM_ID = 'eventRegisterForm';
  const SUBMIT_BTN_ID = 'eventSubmitBtn';
  const MESSAGE_ID = 'eventFormMessage';

  /* === HELPERS === */
  const qs = (id) => document.getElementById(id);

  const showMessage = (type, text) => {
    const box = qs(MESSAGE_ID);
    if (!box) return;

    box.className =
      'mt-4 rounded-lg px-4 py-3 text-sm font-semibold';

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

      disableButton(true);

      // HTML5 validation
      if (!form.checkValidity()) {
        form.reportValidity();
        form.dataset.submitted = 'false';
        disableButton(false);
        return;
      }

      // Form verisi
      const formData = new FormData(form);

      // KVKK kontrolü (checkbox name="kvkk")
      if (!formData.get('kvkk')) {
        showMessage('error', 'You must approve the KVKK consent.');
        form.dataset.submitted = 'false';
        disableButton(false);
        return;
      }

      // Metadata (log + analiz için)
      formData.append('page_url', window.location.href);
      formData.append('user_agent', navigator.userAgent);
      formData.append('submitted_at', new Date().toISOString());

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Network response was not OK');
        }

        const result = await res.json();

        if (result.status === 'success') {
          showMessage(
            'success',
            'Your registration has been received successfully.'
          );
          form.reset();

          // GA4 event (analytics.js varsa)
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'event_registration_success', {
              event_category: 'event',
              event_label: formData.get('event_name') || 'unknown',
            });
          }
        } else {
          throw new Error(result.message || 'Unknown server error');
        }
      } catch (err) {
        console.error('[IPS] Event register error:', err);
        showMessage(
          'error',
          'An error occurred. Please try again later.'
        );

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'event_registration_error', {
            event_category: 'event',
            event_label: 'submit_failed',
          });
        }

        form.dataset.submitted = 'false';
        disableButton(false);
      }
    });
  });
})();
