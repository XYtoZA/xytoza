/* ==========================================================================
   XYtoZA — interaksi umum semua halaman
   Setiap blok berjalan hanya bila elemennya ada di halaman.
   ========================================================================== */
(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Toast (pengganti alert) ----------
  let toastEl;
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 3200);
  };
  window.XYtoZA = { toast };

  $$('[data-soon]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    toast(el.dataset.soon || 'Belum tersedia — coming soon.');
  }));

  // ---------- Menu mobile ----------
  const toggle = $('[data-menu-toggle]');
  const menu = $('#menu');
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  // ---------- Tahun di footer ----------
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---------- Progress baca ----------
  const bar = $('[data-progress]');
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }

  // ---------- Reveal saat scroll ----------
  const revealTargets = $$('.reveal, .meter');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  // ---------- Daftar isi aktif (artikel) ----------
  const tocLinks = $$('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    tocLinks.forEach((a) => {
      const t = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (t) map.set(t, a);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        tocLinks.forEach((a) => a.classList.remove('is-active'));
        map.get(en.target)?.classList.add('is-active');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((_, t) => io.observe(t));
  }

  // ---------- Dialog profil personel (beranda) ----------
  const profileDialog = $('#profileDialog');
  const profileData = $('#profile-data');
  if (profileDialog && profileData && typeof profileDialog.showModal === 'function') {
    const profiles = JSON.parse(profileData.textContent);
    const SOCIAL = { instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook' };
    $$('[data-profile]').forEach((btn) => btn.addEventListener('click', () => {
      const p = profiles[btn.dataset.profile];
      if (!p) return;
      const fields = { stage: p.stageName, role: p.position, name: p.name, position: p.position, birth: p.birth };
      Object.entries(fields).forEach(([key, val]) => {
        $$(`[data-p="${key}"]`, profileDialog).forEach((el) => { el.textContent = val; });
      });
      const socials = $('[data-p="socials"]', profileDialog);
      socials.innerHTML = '';
      Object.keys(SOCIAL).forEach((key) => {
        if (!p[key]) return;
        const a = document.createElement('a');
        a.className = 'pbtn';
        a.href = p[key];
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = `<svg class="icon" aria-hidden="true"><use href="${document.body.dataset.root || ''}assets/icons.svg#${key}"></use></svg><span>${SOCIAL[key]}</span>`;
        socials.appendChild(a);
      });
      if (!socials.children.length) socials.innerHTML = '<p class="label">Media sosial belum tersedia</p>';
      profileDialog.showModal();
    }));
  }

  // tutup dialog: tombol [data-close] atau klik backdrop
  $$('dialog.modal').forEach((dlg) => {
    $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  });

  // ---------- Filter artikel ----------
  const filterBtns = $$('[data-filter]');
  if (filterBtns.length) {
    const items = $$('[data-cat]');
    filterBtns.forEach((btn) => btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      items.forEach((it) => { it.hidden = cat !== 'all' && it.dataset.cat !== cat; });
    }));
  }

  // ---------- Form kontak (Google Sheet via Apps Script) ----------
  const contactForm = $('#contactForm');
  if (contactForm) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzCeaAegcKA6VOYb3MCiGLVraxGs0p6IBOlLpY3VevoOG48ONmVnpoLBX4LLcae9wM/exec';
    const okDialog = $('#successDialog');
    const btn = $('.form__submit', contactForm);
    const label = btn.innerHTML;
    const dateInput = contactForm.elements.date;
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = contactForm.elements;
      const data = {
        name: f.name.value.trim(),
        org: f.org.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        date: f.date.value,
        type: f.type.value,
        message: f.message.value.trim()
      };
      if (!data.name || !data.email || !data.phone) { toast('Mohon isi Nama, Email, dan No. WhatsApp.'); return; }
      if (data.email.toLowerCase().endsWith('@titan.email')) { toast('Alamat email dari titan.email tidak dapat digunakan.'); return; }

      btn.disabled = true;
      btn.textContent = 'Mengirim…';
      try {
        await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) });
        contactForm.reset();
        if (okDialog && typeof okDialog.showModal === 'function') okDialog.showModal();
        else toast('Pesan terkirim. Terima kasih!');
      } catch (err) {
        console.error(err);
        toast('Gagal mengirim. Coba lagi sebentar lagi.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = label;
      }
    });
  }

  // ---------- Order buku (Midtrans) ----------
  const orderForm = $('#orderForm');
  if (orderForm) {
    const unitPrice = 150000;
    const rupiah = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
    const qty = $('#quantity');
    const update = () => {
      const amount = unitPrice * Number(qty.value);
      $('#quantityLabel').textContent = qty.value;
      $('#subtotal').textContent = rupiah(amount);
      $('#total').textContent = rupiah(amount);
    };
    qty.addEventListener('change', update);
    update();
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!orderForm.reportValidity()) return;
      const status = $('#status');
      const pay = $('#payButton');
      status.hidden = false;
      status.textContent = 'Anda sedang diarahkan ke pembayaran Midtrans di tab baru.';
      pay.textContent = 'Dialihkan ke Midtrans';
      pay.disabled = true;
      window.open('https://app.sandbox.midtrans.com/payment-links/c961ec88-6f51-49f4-bae8-78baf666e3b7-h9qYal28', '_blank', 'noopener');
    });
  }
})();
