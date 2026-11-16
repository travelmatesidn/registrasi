/* Logika murni (tanpa DOM) — bisa dites di Node: test/logic.test.js */
(function (root) {
  'use strict';

  var PHONE_RE = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

  function rupiah(n) {
    return 'Rp' + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function cleanPhone(s) {
    return String(s || '').replace(/[\s-]/g, '');
  }

  function isValidPhone(s) {
    return PHONE_RE.test(cleanPhone(s));
  }

  function findAktivitas(cfg, key) {
    for (var i = 0; i < cfg.AKTIVITAS.length; i++) if (cfg.AKTIVITAS[i].key === key) return cfg.AKTIVITAS[i];
    return null;
  }

  /** state: { aktivitas, subIdx, mpIdx, jumlahPeserta, addons:{key:qty} } */
  function computeTotals(state, cfg) {
    var akt = findAktivitas(cfg, state.aktivitas);
    var sub = akt && state.subIdx >= 0 ? akt.sub[state.subIdx] : null;
    var hargaPerOrang = sub && state.mpIdx >= 0 ? sub.harga[state.mpIdx] : 0;
    var jumlah = Math.max(1, Number(state.jumlahPeserta) || 1);
    var totalAktivitas = hargaPerOrang * jumlah;
    var totalAddons = 0;
    (cfg.ADDONS || []).forEach(function (a) {
      totalAddons += a.harga * (Number((state.addons || {})[a.key]) || 0);
    });
    var total = totalAktivitas + totalAddons;
    var dp = Math.ceil(total * (cfg.DP_PERSEN || 50) / 100);
    return {
      aktivitasLabel: akt ? akt.label : '',
      subNama: sub ? sub.nama : '',
      meetingPoint: akt && state.mpIdx >= 0 ? akt.meetingPoints[state.mpIdx] : '',
      hargaPerOrang: hargaPerOrang,
      jumlah: jumlah,
      totalAktivitas: totalAktivitas,
      totalAddons: totalAddons,
      total: total,
      dp: dp,
    };
  }

  /** Return object { field: pesan } — kosong berarti valid. */
  function validate(s, cfg, hasFile) {
    var e = {};
    if (!String(s.namaLengkap || '').trim()) e.namaLengkap = 'Nama lengkap wajib diisi';
    if (!String(s.noWA || '').trim()) e.noWA = 'Nomor WhatsApp wajib diisi';
    else if (!isValidPhone(s.noWA)) e.noWA = 'Format nomor WA tidak valid (contoh: 08123456789)';
    if (!s.jenisKelamin) e.jenisKelamin = 'Jenis kelamin wajib dipilih';
    var usia = Number(s.usia);
    if (!String(s.usia || '').trim()) e.usia = 'Usia wajib diisi';
    else if (!(usia >= 5 && usia <= 80)) e.usia = 'Usia tidak valid';
    if (!String(s.namaDarurat || '').trim()) e.namaDarurat = 'Nama kontak darurat wajib diisi';
    if (!String(s.noWADarurat || '').trim()) e.noWADarurat = 'Nomor WA darurat wajib diisi';
    else if (!isValidPhone(s.noWADarurat)) e.noWADarurat = 'Format nomor WA tidak valid';
    if (!s.aktivitas) e.aktivitas = 'Pilih aktivitas terlebih dahulu';
    else {
      if (!(s.subIdx >= 0)) e.subIdx = 'Pilih lokasi / sub-aktivitas';
      if (!(s.mpIdx >= 0)) e.mpIdx = 'Pilih meeting point';
    }
    if (!s.tanggalTrip) e.tanggalTrip = 'Tanggal trip wajib diisi';
    (s.pesertaTambahan || []).forEach(function (p, i) {
      if (!String(p.nama || '').trim()) e['p' + i + '_nama'] = 'Nama wajib diisi';
      if (!p.gender) e['p' + i + '_gender'] = 'Pilih jenis kelamin';
      if (!String(p.usia || '').trim()) e['p' + i + '_usia'] = 'Usia wajib diisi';
      if (String(p.noWA || '').trim() && !isValidPhone(p.noWA)) e['p' + i + '_noWA'] = 'Format nomor WA tidak valid';
    });
    if (!String(s.namaPengirim || '').trim()) e.namaPengirim = 'Nama pengirim transfer wajib diisi';
    if (!hasFile) e.bukti = 'Upload bukti transfer wajib ada';
    if (!s.setuju) e.setuju = 'Anda harus menyetujui syarat & ketentuan';
    return e;
  }

  function buildPayload(s, t, bukti) {
    return {
      namaLengkap: String(s.namaLengkap).trim(),
      noWA: cleanPhone(s.noWA),
      jenisKelamin: s.jenisKelamin,
      usia: String(s.usia).trim(),
      namaDarurat: String(s.namaDarurat).trim(),
      noWADarurat: cleanPhone(s.noWADarurat),
      aktivitas: t.aktivitasLabel,
      subAktivitas: t.subNama,
      meetingPoint: t.meetingPoint,
      tanggalTrip: s.tanggalTrip,
      jumlahPeserta: t.jumlah,
      pesertaTambahan: (s.pesertaTambahan || []).map(function (p) {
        return { nama: String(p.nama).trim(), gender: p.gender, usia: String(p.usia).trim(), noWA: cleanPhone(p.noWA) };
      }),
      catatanKesehatan: String(s.catatanKesehatan || '').trim(),
      trekkingPoleQty: Number((s.addons || {}).trekkingPole) || 0,
      droneQty: Number((s.addons || {}).drone) || 0,
      hargaPerOrang: t.hargaPerOrang,
      totalHarga: t.total,
      dpMinimal: t.dp,
      namaPengirim: String(s.namaPengirim).trim(),
      setuju: !!s.setuju,
      website: s.website || '', // honeypot
      bukti: bukti, // { name, mimeType, base64 }
    };
  }

  function formatTanggal(iso) {
    if (!iso) return '';
    var bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var p = iso.split('-');
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return hari[d.getDay()] + ', ' + d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
  }

  function buildWaMessage(p, id) {
    var m = '*PENDAFTARAN TRIP ADVENTURE*\n*Travelmates Indonesia*\n\n';
    if (id) m += 'ID Registrasi: *' + id + '*\n\n';
    m += 'Nama: ' + p.namaLengkap + '\n';
    m += 'No WhatsApp: ' + p.noWA + '\n';
    m += 'Kontak Darurat: ' + p.namaDarurat + ' (' + p.noWADarurat + ')\n\n';
    m += 'Aktivitas: ' + p.aktivitas + '\n';
    m += 'Lokasi: ' + p.subAktivitas + '\n';
    m += 'Meeting Point: ' + p.meetingPoint + '\n';
    m += 'Tanggal: ' + formatTanggal(p.tanggalTrip) + '\n';
    m += 'Jumlah Peserta: ' + p.jumlahPeserta + ' orang\n\n';
    m += '*Detail Peserta:*\n';
    m += '1. ' + p.namaLengkap + ' | ' + p.jenisKelamin + ' | ' + p.usia + ' th\n';
    p.pesertaTambahan.forEach(function (x, i) {
      m += (i + 2) + '. ' + x.nama + ' | ' + x.gender + ' | ' + x.usia + ' th' + (x.noWA ? ' | ' + x.noWA : '') + '\n';
    });
    if (p.trekkingPoleQty || p.droneQty) {
      m += '\n*Add-ons:*\n';
      if (p.trekkingPoleQty) m += '- Trekking Pole: ' + p.trekkingPoleQty + ' pcs\n';
      if (p.droneQty) m += '- Drone: ' + p.droneQty + ' unit\n';
    }
    if (p.catatanKesehatan) m += '\nCatatan kesehatan: ' + p.catatanKesehatan + '\n';
    m += '\n*Total Harga: ' + rupiah(p.totalHarga) + '*\n';
    m += '*DP Minimal: ' + rupiah(p.dpMinimal) + '*\n';
    m += 'Nama Pengirim Transfer: ' + p.namaPengirim + '\n';
    m += id ? '\nBukti transfer sudah terupload ✅' : '\n(Bukti transfer saya kirim di chat ini)';
    return m;
  }

  var api = {
    rupiah: rupiah, cleanPhone: cleanPhone, isValidPhone: isValidPhone, findAktivitas: findAktivitas,
    computeTotals: computeTotals, validate: validate, buildPayload: buildPayload,
    buildWaMessage: buildWaMessage, formatTanggal: formatTanggal,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TMLogic = api;
})(this);
