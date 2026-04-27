(function () {
  const CATERING_TABLE = 'catering_leads';
  const CONTACT_TABLE = 'contact_leads';
  const NEWSLETTER_TABLE = 'newsletter_signups';

  function getClient() {
    return window.mrpSupabase || null;
  }

  function setStatus(target, message, tone) {
    if (!target) return;
    target.textContent = message || '';
    target.classList.remove('success', 'error');
    if (tone) target.classList.add(tone);
  }

  function withButtonState(button, submitting) {
    if (!button) return;
    if (!button.dataset.originalLabel) button.dataset.originalLabel = button.innerHTML;
    button.disabled = submitting;
    button.innerHTML = submitting ? 'Sending…' : button.dataset.originalLabel;
  }

  async function tryInsert(table, payloads) {
    const client = getClient();
    if (!client) throw new Error('Supabase client is not ready.');

    let lastError = null;
    for (const payload of payloads) {
      const { error } = await client.from(table).insert([payload]);
      if (!error) return true;
      lastError = error;
    }
    throw lastError || new Error(`Insert failed for ${table}.`);
  }

  function buildCateringPayloads(formData) {
    const fullName = formData.get('full_name') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const company = formData.get('company') || '';
    const guestCount = formData.get('guest_count') ? Number(formData.get('guest_count')) : null;
    const eventDate = formData.get('event_date') || null;
    const message = formData.get('message') || '';
    const source = 'website';
    const pageUrl = window.location.href;

    return [
      { full_name: fullName, email, phone, company, guest_count: guestCount, event_date: eventDate, message, source, page_url: pageUrl },
      { name: fullName, email, phone, company, guest_count: guestCount, event_date: eventDate, notes: message, source, page_url: pageUrl },
      { full_name: fullName, email, phone, company, message, source, page_url: pageUrl },
      { name: fullName, email, phone, company, notes: message, source, page_url: pageUrl },
      { email, full_name: fullName, message },
      { email, name: fullName, notes: message }
    ];
  }

  function wireCateringForm() {
    const form = document.querySelector('[data-catering-lead-form]');
    if (!form) return;

    const submit = form.querySelector('[data-lead-submit]');
    const status = form.querySelector('[data-lead-status]');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      setStatus(status, '');
      withButtonState(submit, true);

      try {
        const formData = new FormData(form);
        await tryInsert(CATERING_TABLE, buildCateringPayloads(formData));
        form.reset();
        setStatus(status, 'Thank you — your catering request has been received. Our team will contact you shortly.', 'success');
      } catch (error) {
        console.error('[MRP Leads] Catering insert failed:', error);
        setStatus(status, 'Sorry, we could not save your request right now. Please try again or call the store directly.', 'error');
      } finally {
        withButtonState(submit, false);
      }
    });
  }

  function wireContactForm() {
    const form = document.querySelector('[data-contact-lead-form]');
    if (!form) return;

    const submit = form.querySelector('[data-lead-submit]');
    const status = form.querySelector('[data-lead-status]');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      setStatus(status, '');
      withButtonState(submit, true);

      try {
        const formData = new FormData(form);
        const name = formData.get('full_name') || formData.get('name') || '';
        const email = formData.get('email') || '';
        const message = formData.get('message') || '';
        await tryInsert(CONTACT_TABLE, [
          { full_name: name, email, message, source: 'website', page_url: window.location.href },
          { name, email, message, source: 'website', page_url: window.location.href },
          { email, message }
        ]);
        form.reset();
        setStatus(status, 'Thanks. Your message was saved for follow-up.', 'success');
      } catch (error) {
        console.error('[MRP Leads] Contact insert failed:', error);
        setStatus(status, 'We could not send your message right now. Please try again shortly.', 'error');
      } finally {
        withButtonState(submit, false);
      }
    });
  }

  function wireNewsletterForm() {
    const form = document.querySelector('[data-newsletter-form]');
    if (!form) return;

    const submit = form.querySelector('[data-lead-submit]');
    const status = form.querySelector('[data-lead-status]');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      setStatus(status, '');
      withButtonState(submit, true);

      try {
        const formData = new FormData(form);
        const email = formData.get('email') || '';
        await tryInsert(NEWSLETTER_TABLE, [
          { email, source: 'website', page_url: window.location.href },
          { email }
        ]);
        form.reset();
        setStatus(status, 'You’re in. Your signup was saved successfully.', 'success');
      } catch (error) {
        console.error('[MRP Leads] Newsletter insert failed:', error);
        setStatus(status, 'We could not save your signup right now. Please try again shortly.', 'error');
      } finally {
        withButtonState(submit, false);
      }
    });
  }

  function boot() {
    wireCateringForm();
    wireContactForm();
    wireNewsletterForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
