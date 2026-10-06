/* ==========================================================================
   XYtoZA — renderer musik
   Membaca window.XYTOZA_MUSIC (assets/js/songs.js) lalu mengisi elemen:
   [data-meter] [data-latest] [data-slots] [data-tracklist] [data-count-out]
   ========================================================================== */
(() => {
  const D = window.XYTOZA_MUSIC;
  if (!D) return;

  const ROOT = document.body.dataset.root || '';
  const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const PLATFORM_ORDER = ['spotify', 'apple', 'ytmusic', 'youtube'];
  const PLATFORM_NAMES = { spotify: 'Spotify', apple: 'Apple Music', ytmusic: 'YT Music', youtube: 'YouTube' };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="${ROOT}assets/icons.svg#${id}"></use></svg>`;
  const parseDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmtLong = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
  const fmtShort = (iso) => iso.split('-').reverse().join('.');
  const img = (src, alt = '', extra = '') => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"${extra}>`;

  // ---- Bangun 30 slot ----
  const slots = Array.from({ length: D.total }, (_, i) => {
    const num = i + 1;
    const album = D.albums[Math.floor(i / 10)];
    const song = D.songs.find((s) => s.num === num);
    if (!song) return { num, album, state: 'empty' };
    return { ...song, album, state: song.released ? 'out' : 'next', platforms: song.platforms || D.platforms };
  });
  const released = slots.filter((s) => s.state === 'out');
  const latest = [...released].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
  const next = slots
    .filter((s) => s.state === 'next')
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'))[0];

  const platformLinks = (p, cls = 'pbtn') => PLATFORM_ORDER
    .filter((k) => p && p[k])
    .map((k) => `<a class="${cls}" href="${esc(p[k])}" target="_blank" rel="noopener">${icon(k)}<span>${PLATFORM_NAMES[k]}</span></a>`)
    .join('');

  // ---- Meter 30 lagu ----
  document.querySelectorAll('[data-meter]').forEach((el) => {
    const groups = D.albums.map((al, ai) => {
      const cells = slots.slice(ai * 10, ai * 10 + 10).map((s) => {
        const title = s.title ? esc(s.title) : 'Belum diumumkan';
        return `<span class="meter__cell is-${s.state}" style="--i:${s.num - 1}" title="${pad(s.num)} · ${title}"></span>`;
      }).join('');
      const name = al.title === 'Coming Soon' ? 'Segera' : esc(al.title);
      return `<div><div class="meter__row">${cells}</div><span class="label">Vol.${al.vol}<span class="meter__name"> · ${name}</span></span></div>`;
    }).join('');
    el.classList.add('meter');
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `${released.length} dari ${D.total} lagu Sound Of Drive sudah dirilis`);
    el.innerHTML = `
      <div class="meter__head">
        <span class="label">Sound Of Drive — misi ${D.total} lagu</span>
        <span class="meter__count"><b>${pad(released.length)}</b>/${D.total} rilis</span>
      </div>
      <div class="meter__groups">${groups}</div>`;
  });

  document.querySelectorAll('[data-count-out]').forEach((el) => { el.textContent = pad(released.length); });

  // ---- Rilis terbaru + berikutnya (beranda) ----
  const latestEl = document.querySelector('[data-latest]');
  if (latestEl && latest) {
    const s = latest;
    const embed = s.spotify
      ? `<iframe class="release__embed" src="https://open.spotify.com/embed/${esc(s.spotify)}?utm_source=generator" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Putar ${esc(s.title)} di Spotify"></iframe>`
      : '';
    let nextHTML = '';
    if (next) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const days = next.date ? Math.round((parseDate(next.date) - today) / 864e5) : null;
      let when;
      if (days === null) when = '<p class="next__count">Tanggal segera diumumkan</p>';
      else if (days > 1) when = `<p class="next__count"><b>${days}</b> hari lagi</p>`;
      else if (days === 1) when = '<p class="next__count"><b>Besok</b></p>';
      else if (days === 0) when = '<p class="next__count"><b>Hari ini</b></p>';
      else when = '<p class="next__count"><b>Segera</b></p>';
      nextHTML = `
        <aside class="next">
          <p class="label next__kicker">Berikutnya · Track ${pad(next.num)}</p>
          <div class="next__art">${next.art ? img(next.art, `Artwork ${next.title}`) : ''}</div>
          <h3 class="display next__title">${esc(next.title)}</h3>
          <p class="label">${next.date ? `Rilis ${fmtLong(next.date)}` : 'Coming soon'}</p>
          ${when}
        </aside>`;
    }
    latestEl.innerHTML = `
      <article class="release__card">
        <div class="release__art">${s.art ? img(s.art, `Artwork ${s.title}`) : ''}<span class="badge">Out now</span></div>
        <div class="release__body">
          <p class="label">Track ${pad(s.num)} · Vol.${s.album.vol} ${esc(s.album.title)}${s.date ? ` · ${fmtShort(s.date)}` : ''}</p>
          <h3 class="display h-lg release__title">${esc(s.title)}</h3>
          ${s.note ? `<p class="release__note">${esc(s.note)}</p>` : ''}
          <div class="release__dsp">${platformLinks(s.platforms)}</div>
          ${embed}
          ${s.article ? `<a class="link-arrow" href="${ROOT}${esc(s.article)}">Cerita di balik lagu ${icon('arrow')}</a>` : ''}
        </div>
      </article>
      ${nextHTML}`;
  }

  // ---- Grid 30 slot (beranda) ----
  const slotsEl = document.querySelector('[data-slots]');
  if (slotsEl) {
    const tile = (s) => {
      const n = pad(s.num);
      if (s.state === 'empty') {
        return `<li class="slot is-empty"><span class="slot__num">${n}</span><span class="sr-only">Lagu ${n}: belum diumumkan</span></li>`;
      }
      const status = s.state === 'out' ? 'sudah rilis' : 'segera rilis';
      return `<li class="slot is-${s.state}"><a href="${ROOT}song.html#track-${n}" aria-label="${n} ${esc(s.title)}, ${status}">
        <span class="slot__num">${n}</span>${s.art ? img(s.art) : ''}<span class="slot__title" aria-hidden="true">${esc(s.title)}</span></a></li>`;
    };
    slotsEl.innerHTML = D.albums.map((al, ai) => {
      const list = slots.slice(ai * 10, ai * 10 + 10);
      const out = list.filter((s) => s.state === 'out').length;
      return `
        <div class="slots__album">
          <div class="slots__meta">
            <span class="label">Vol.${al.vol}</span>
            <h3 class="display">${esc(al.title)}</h3>
            <span class="label">${out}/10 rilis</span>
          </div>
          <ol class="slots__row">${list.map(tile).join('')}</ol>
        </div>`;
    }).join('') + `
      <div class="slots__legend label" aria-hidden="true">
        <span><i class="lg-out"></i>Sudah rilis</span>
        <span><i class="lg-next"></i>Segera</span>
        <span><i class="lg-empty"></i>Belum diumumkan</span>
      </div>`;
  }

  // ---- Tracklist lengkap (halaman Musik) ----
  const listEl = document.querySelector('[data-tracklist]');
  if (listEl) {
    const row = (s) => {
      const n = pad(s.num);
      if (s.state === 'empty') {
        return `<li class="track is-empty" id="track-${n}"><div class="track__row">
          <span class="track__num">${n}</span><span class="track__art" aria-hidden="true"></span>
          <div class="track__info"><p class="track__title">Belum diumumkan</p></div></div></li>`;
      }
      const meta = s.state === 'out'
        ? `<span class="is-on">● Rilis</span>${s.date ? ` · ${fmtLong(s.date)}` : ''}`
        : `<span>○ Segera</span>${s.date ? ` · ${fmtLong(s.date)}` : ''}`;
      let actions = '<span class="chip chip--ghost">Segera</span>';
      let panels = '';
      if (s.state === 'out') {
        actions = (s.lyrics ? `<button class="chip" type="button" aria-expanded="false" aria-controls="lyr-${n}">Lirik ${icon('chev', 'icon icon--chev')}</button>` : '')
          + `<button class="chip chip--solid" type="button" aria-expanded="false" aria-controls="dsp-${n}">${icon('play')} Dengar</button>`;
        panels = `
          <div class="track__panel" id="dsp-${n}" hidden>
            <p class="label">Dengarkan “${esc(s.title)}” di</p>
            <div class="track__dsp">${platformLinks(s.platforms)}</div>
            ${s.article ? `<a class="link-arrow" href="${ROOT}${esc(s.article)}">Cerita di balik lagu ${icon('arrow')}</a>` : ''}
          </div>
          ${s.lyrics ? `<div class="track__panel" id="lyr-${n}" hidden><p class="label">Lirik — ${esc(s.title)}</p><div class="lyrics">${esc(s.lyrics)}</div></div>` : ''}`;
      }
      return `<li class="track is-${s.state}" id="track-${n}">
        <div class="track__row">
          <span class="track__num">${n}</span>
          <span class="track__art">${s.art ? img(s.art, `Artwork ${s.title}`) : icon('note')}</span>
          <div class="track__info"><h3 class="track__title">${esc(s.title)}</h3><p class="track__meta">${meta}</p></div>
          <div class="track__actions">${actions}</div>
        </div>${panels}</li>`;
    };

    listEl.innerHTML = D.albums.map((al, ai) => {
      const list = slots.slice(ai * 10, ai * 10 + 10);
      const out = list.filter((s) => s.state === 'out').length;
      return `
        <section class="album" id="${al.id}" aria-labelledby="${al.id}-title">
          <header class="album__head">
            <span class="album__vol" aria-hidden="true">${al.vol}</span>
            <div>
              <p class="label">Vol.${al.vol} · Sound Of Drive · Lagu ${pad(ai * 10 + 1)}–${pad(ai * 10 + 10)}</p>
              <h2 class="display h-md" id="${al.id}-title">${esc(al.title)}</h2>
              <p class="album__desc">${esc(al.desc)}</p>
            </div>
            <p class="album__progress"><b>${out}<small>/10</small></b> rilis</p>
          </header>
          <ol class="tracks">${list.map(row).join('')}</ol>
        </section>`;
    }).join('');

    // buka/tutup panel lirik & platform
    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[aria-controls]');
      if (!btn) return;
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.closest('.track').querySelectorAll('button[aria-controls]').forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
        const p = document.getElementById(b.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      });
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    });

    // lompat ke #track-xx setelah render (juga saat hash berubah di halaman ini)
    const openFromHash = () => {
      const target = location.hash && document.getElementById(location.hash.slice(1));
      if (!target || !target.classList.contains('track')) return;
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: 'center' });
        target.classList.remove('is-flash');
        void target.offsetWidth;
        target.classList.add('is-flash');
        const play = target.querySelector('.chip--solid');
        if (play && play.getAttribute('aria-expanded') !== 'true') play.click();
      });
    };
    openFromHash();
    addEventListener('hashchange', openFromHash);

    // tab album aktif mengikuti scroll
    const tabs = document.querySelectorAll('.album-tabs a');
    if (tabs.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          tabs.forEach((t) => t.classList.toggle('is-active', t.getAttribute('href') === `#${en.target.id}`));
        });
      }, { rootMargin: '-35% 0px -60% 0px' });
      listEl.querySelectorAll('.album').forEach((a) => io.observe(a));
    }
  }
})();
