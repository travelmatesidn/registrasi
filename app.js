/* UI form registrasi — Travelmates Indonesia */
(function () {
  'use strict';
  var C = window.TM_CONFIG, L = window.TMLogic;
  var $ = function (id) { return document.getElementById(id); };

  var state = {
    aktivitas: '', subIdx: -1, mpIdx: -1, jumlahPeserta: 1,
    pesertaTambahan: [], addons: {}, setuju: false,
  };
  var buktiFile = null;
  var sending = false;

  /* ---------- helpers ---------- */
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k]; else n.setAttribute(k, attrs[k]);
    });
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function setErr(field, msg) {
    var box = document.querySelector('[data-f="' + field + '"]');
    if (!box) return;
    box.classList.toggle('invalid', !!msg);
    var e = box.querySelector('.err');
    if (e) e.textContent = msg || '';
  }
  function clearErrs() {
    document.querySelectorAll('[data-f]').forEach(function (b) { b.classList.remove('invalid'); });
  }
  function fmtSize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB'; }

  /* ---------- aktivitas ---------- */
  function renderActs() {
    var box = $('acts'); box.textContent = '';
    C.AKTIVITAS.forEach(function (a) {
      var b = el('button', { type: 'button', class: 'act', 'aria-pressed': String(state.aktivitas === a.key) });
      b.appendChild(el('div', { class: 'e' }, a.emoji));
      b.appendChild(el('div', { class: 't' }, a.label));
      if (a.badge) b.appendChild(el('div', { class: 'b' }, a.badge));
      b.addEventListener('click', function () {
        state.aktivitas = a.key; state.subIdx = -1; state.mpIdx = -1;
        setErr('aktivitas', ''); renderActs(); renderSubs(); update();
      });
      box.appendChild(b);
    });
  }

  function renderSubs() {
    var a = L.findAktivitas(C, state.aktivitas);
    $('subWrap').hidden = !a;
    if (!a) return;
    var subs = $('subs'); subs.textContent = '';
    a.sub.forEach(function (s, i) {
      var min = Math.min.apply(null, s.harga);
      var b = el('button', { type: 'button', class: 'opt', 'aria-pressed': String(state.subIdx === i) });
      b.appendChild(el('span', null, s.nama));
      b.appendChild(el('span', { class: 'p' }, 'mulai ' + L.rupiah(min)));
      b.addEventListener('click', function () { state.subIdx = i; setErr('subIdx', ''); renderSubs(); update(); });
      subs.appendChild(b);
    });
    var mps = $('mps'); mps.textContent = '';
    a.meetingPoints.forEach(function (mp, i) {
      var price = state.subIdx >= 0 ? L.rupiah(a.sub[state.subIdx].harga[i]) + '/org' : '';
      var b = el('button', { type: 'button', class: 'opt', 'aria-pressed': String(state.mpIdx === i) });
      b.appendChild(el('span', null, '📍 ' + mp));
      b.appendChild(el('span', { class: 'p' }, price));
      b.addEventListener('click', function () { state.mpIdx = i; setErr('mpIdx', ''); renderSubs(); update(); });
      mps.appendChild(b);
    });
  }

  /* ---------- peserta ---------- */
  function syncPeserta() {
    var need = state.jumlahPeserta - 1;
    while (state.pesertaTambahan.length < need) state.pesertaTambahan.push({ nama: '', gender: '', usia: '', noWA: '' });
    state.pesertaTambahan.length = need;
    renderPeserta();
  }

  function renderPeserta() {
    var box = $('pesertaList'); box.textContent = '';
    state.pesertaTambahan.forEach(function (p, i) {
      var w = el('div', { class: 'peserta' });
      w.appendChild(el('h3', null, '👤 Peserta ' + (i + 2)));
      w.appendChild(inputField('p' + i + '_nama', 'Nama Lengkap', true, 'text', p.nama, function (v) { p.nama = v; }));
      var g = el('div', { class: 'grid2' });
      var sf = el('div', { class: 'field', 'data-f': 'p' + i + '_gender' });
      sf.appendChild(labelEl('Jenis Kelamin', true));
      var sel = el('select');
      ['', 'Laki-laki', 'Perempuan'].forEach(function (o) { var op = el('option', { value: o }, o || 'Pilih'); if (o === p.gender) op.selected = true; sel.appendChild(op); });
      sel.addEventListener('change', function () { p.gender = sel.value; setErr('p' + i + '_gender', ''); });
      sf.appendChild(sel); sf.appendChild(el('div', { class: 'err' }));
      g.appendChild(sf);
      g.appendChild(inputField('p' + i + '_usia', 'Usia', true, 'number', p.usia, function (v) { p.usia = v; }));
      w.appendChild(g);
      w.appendChild(inputField('p' + i + '_noWA', 'No WhatsApp (opsional)', false, 'tel', p.noWA, function (v) { p.noWA = v; }));
      box.appendChild(w);
    });
    $('pCount').textContent = state.jumlahPeserta;
    $('pMinus').disabled = state.jumlahPeserta <= 1;
    $('pPlus').disabled = state.jumlahPeserta >= C.MAX_PESERTA;
  }

  function labelEl(text, req) {
    var l = el('label', { class: 'l' }, text + ' ');
    if (req) l.appendChild(el('i', null, '*'));
    return l;
  }
  function inputField(key, label, req, type, val, onInput) {
    var f = el('div', { class: 'field', 'data-f': key });
    f.appendChild(labelEl(label, req));
    var inp = el('input', { type: type });
    if (type === 'tel') inp.setAttribute('inputmode', 'tel');
    if (type === 'number') inp.setAttribute('inputmode', 'numeric');
    inp.value = val || '';
    inp.addEventListener('input', function () { onInput(inp.value); setErr(key, ''); });
    f.appendChild(inp); f.appendChild(el('div', { class: 'err' }));
    return f;
  }

  /* ---------- add-ons ---------- */
  function renderAddons() {
    var box = $('addons'); box.textContent = '';
    C.ADDONS.forEach(function (a) {
      state.addons[a.key] = state.addons[a.key] || 0;
      var row = el('div', { class: 'addon' });
      var info = el('div'); info.appendChild(el('b', null, a.label)); info.appendChild(el('small', null, L.rupiah(a.harga) + ' / ' + a.satuan));
      var st = el('div', { class: 'stepper' });
      var minus = el('button', { type: 'button', 'aria-label': 'Kurangi ' + a.label }, '−');
      var out = el('output', null, String(state.addons[a.key]));
      var plus = el('button', { type: 'button', 'aria-label': 'Tambah ' + a.label }, '+');
      function refresh() { out.textContent = state.addons[a.key]; minus.disabled = state.addons[a.key] <= 0; update(); }
      minus.addEventListener('click', function () { state.addons[a.key] = Math.max(0, state.addons[a.key] - 1); refresh(); });
      plus.addEventListener('click', function () { state.addons[a.key] = Math.min(20, state.addons[a.key] + 1); refresh(); });
      minus.disabled = true;
      st.appendChild(minus); st.appendChild(out); st.appendChild(plus);
      row.appendChild(info); row.appendChild(st);
      box.appendChild(row);
    });
  }

  /* ---------- ringkasan ---------- */
  function update() {
    var t = L.computeTotals(state, C);
    var has = t.hargaPerOrang > 0;
    $('sHarga').textContent = has ? L.rupiah(t.hargaPerOrang) : '—';
    $('sJumlah').textContent = t.jumlah + ' orang';
    $('sAkt').textContent = has ? L.rupiah(t.totalAktivitas) : '—';
    $('sAdd').textContent = L.rupiah(t.totalAddons);
    $('sTotal').textContent = t.total ? L.rupiah(t.total) : '—';
    $('sDp').textContent = t.total ? L.rupiah(t.dp) : '—';
    return t;
  }

  /* ---------- upload ---------- */
  function setFile(f) {
    if (!f) return;
    var okType = /^image\//.test(f.type) || f.type === 'application/pdf';
    if (!okType) { setErr('bukti', 'Format harus JPG, PNG, atau PDF'); return; }
    if (f.size > C.MAX_FILE_MB * 1048576) { setErr('bukti', 'Ukuran file maksimal ' + C.MAX_FILE_MB + ' MB'); return; }
    buktiFile = f; setErr('bukti', '');
    var th = $('thumb'); th.textContent = '';
    if (/^image\//.test(f.type)) { var img = el('img', { alt: 'Preview bukti' }); img.src = URL.createObjectURL(f); th.appendChild(img); }
    else th.appendChild(el('div', { class: 'pdf' }, 'PDF'));
    $('fName').textContent = f.name; $('fSize').textContent = fmtSize(f.size);
    $('preview').classList.add('show'); $('drop').style.display = 'none';
  }
  function removeFile() {
    buktiFile = null; $('bukti').value = '';
    $('preview').classList.remove('show'); $('drop').style.display = '';
  }

  /** Kompres foto (maks 1600px, JPEG) supaya upload cepat. PDF / HEIC dikirim apa adanya. */
  function prepareFile(f) {
    return new Promise(function (resolve) {
      var canCompress = /^image\/(jpeg|png|webp)$/.test(f.type) && f.size > 400 * 1024;
      if (!canCompress) return resolve(f);
      var img = new Image(), url = URL.createObjectURL(f);
      img.onload = function () {
        var max = 1600, w = img.naturalWidth, h = img.naturalHeight, r = Math.min(1, max / Math.max(w, h));
        var cv = document.createElement('canvas'); cv.width = Math.round(w * r); cv.height = Math.round(h * r);
        var ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        cv.toBlob(function (blob) {
          if (blob && blob.size < f.size) resolve(new File([blob], f.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }));
          else resolve(f);
        }, 'image/jpeg', 0.85);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(f); };
      img.src = url;
    });
  }
  function toBase64(f) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result).split(',')[1]); };
      r.onerror = function () { reject(new Error('Gagal membaca file')); };
      r.readAsDataURL(f);
    });
  }

  /* ---------- submit ---------- */
  function readInputs() {
    ['namaLengkap', 'noWA', 'jenisKelamin', 'usia', 'namaDarurat', 'noWADarurat', 'tanggalTrip', 'catatanKesehatan', 'namaPengirim', 'website']
      .forEach(function (k) { state[k] = $(k).value; });
    state.setuju = $('setuju').checked;
  }

  function showAlert(html) { var a = $('alert'); a.innerHTML = html; a.classList.add('show'); }
  function hideAlert() { $('alert').classList.remove('show'); }
  function loading(on, title, text) {
    $('overlay').classList.toggle('show', on);
    if (title) $('loadTitle').textContent = title;
    if (text) $('loadText').textContent = text;
  }
  function waUrl(msg) { return 'https://wa.me/' + C.WA_ADMIN + '?text=' + encodeURIComponent(msg); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function onSubmit(ev) {
    ev.preventDefault();
    if (sending) return;
    hideAlert(); clearErrs(); readInputs();
    var errs = L.validate(state, C, !!buktiFile);
    var keys = Object.keys(errs);
    if (keys.length) {
      keys.forEach(function (k) { setErr(k, errs[k]); });
      var first = document.querySelector('.invalid');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    var totals = update();
    var fallbackMsg = L.buildWaMessage(L.buildPayload(state, totals, null), null);

    if (!C.APPS_SCRIPT_URL) {
      showAlert('⚠️ Form belum tersambung ke server (APPS_SCRIPT_URL kosong). <a href="' + waUrl(fallbackMsg) + '" target="_blank" rel="noopener">Kirim pendaftaran via WhatsApp</a> dan lampirkan bukti transfer di chat.');
      return;
    }

    sending = true; $('submitBtn').disabled = true;
    loading(true, 'Menyiapkan bukti transfer…', 'Jangan tutup halaman ini.');

    prepareFile(buktiFile).then(function (f) {
      return toBase64(f).then(function (b64) { return { name: f.name, mimeType: f.type || 'application/octet-stream', base64: b64 }; });
    }).then(function (bukti) {
      loading(true, 'Mengirim pendaftaran…', 'Mengunggah data & bukti transfer.');
      var payload = L.buildPayload(state, totals, bukti);
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 90000);
      // text/plain = "simple request" → tidak kena CORS preflight di Apps Script
      return fetch(C.APPS_SCRIPT_URL, {
        method: 'POST', body: JSON.stringify(payload), redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, signal: ctrl ? ctrl.signal : undefined,
      }).then(function (r) { clearTimeout(timer); return r.json(); }).then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.error) || 'Server tidak merespons dengan benar.');
        var msg = L.buildWaMessage(payload, res.id);
        $('regId').textContent = res.id;
        $('waBtn').href = waUrl(msg);
        $('form').style.display = 'none';
        $('success').classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }).catch(function (err) {
      var reason = err && err.name === 'AbortError' ? 'Koneksi terlalu lama.' : (err && err.message) || 'Terjadi kesalahan.';
      showAlert('❌ Gagal mengirim: ' + escapeHtml(reason) + '<br>Coba kirim ulang. Kalau tetap gagal, <a href="' + waUrl(fallbackMsg) + '" target="_blank" rel="noopener">kirim via WhatsApp</a> dan lampirkan bukti transfer di chat.');
    }).then(function () {
      sending = false; $('submitBtn').disabled = false; loading(false);
    });
  }

  /* ---------- init ---------- */
  function init() {
    renderActs(); renderSubs(); renderAddons(); syncPeserta(); update();

    $('pMinus').addEventListener('click', function () { if (state.jumlahPeserta > 1) { state.jumlahPeserta--; syncPeserta(); update(); } });
    $('pPlus').addEventListener('click', function () { if (state.jumlahPeserta < C.MAX_PESERTA) { state.jumlahPeserta++; syncPeserta(); update(); } });

    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    $('tanggalTrip').min = today.toISOString().slice(0, 10);

    $('bankName').textContent = C.BANK.bank;
    $('bankNo').textContent = C.BANK.nomor;
    $('bankAn').textContent = 'a.n ' + C.BANK.atasNama;
    $('sDpLabel').textContent = 'DP Minimal (' + C.DP_PERSEN + '%)';
    $('copyBtn').addEventListener('click', function () {
      var done = function () { $('copyBtn').textContent = 'Tersalin ✓'; setTimeout(function () { $('copyBtn').textContent = 'Salin'; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(C.BANK.nomor).then(done, done); else done();
    });
    var rules = ['⚠️ Minimal DP ' + C.DP_PERSEN + '% dari total harga', '📅 Reschedule maks H-2, info ke admin', '❌ DP hangus jika cancel', '✅ Pastikan nama rekening sesuai sebelum transfer'];
    rules.forEach(function (r) { $('rules').appendChild(el('li', null, r)); });

    $('bukti').addEventListener('change', function () { setFile(this.files && this.files[0]); });
    $('fRemove').addEventListener('click', removeFile);

    ['namaLengkap', 'noWA', 'jenisKelamin', 'usia', 'namaDarurat', 'noWADarurat', 'tanggalTrip', 'namaPengirim'].forEach(function (k) {
      $(k).addEventListener('input', function () { setErr(k, ''); });
      $(k).addEventListener('change', function () { setErr(k, ''); });
    });
    $('setuju').addEventListener('change', function () { setErr('setuju', ''); });
    $('form').addEventListener('submit', onSubmit);
  }

  init();
})();
