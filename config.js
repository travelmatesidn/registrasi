/* =========================================================
   KONFIGURASI FORM REGISTRASI — Travelmates Indonesia
   Edit file ini saja untuk ganti trip, jadwal, harga, rekening, dll.
   ========================================================= */
window.TM_CONFIG = {
  // URL Web App dari Google Apps Script (lihat PANDUAN_SETUP.md langkah 3)
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzZHU1rejBPHSG3JLQ47AKo4itP6kXQbtQGPT8YhxgiVLn5Cn-w-u2xXyphAeVZL7ud/exec',

  // Nomor WhatsApp admin (format 62..., tanpa + dan tanpa spasi)
  WA_ADMIN: '6282125445322',

  BANK: { nomor: '0909 010000 35562', bank: 'BRI', atasNama: 'PT TRAVELMATES INDONESIA GRUP' },

  DP_PERSEN: 50,

  /* Daftar trip — Open Trip Desember 2026
     - meetingPoints & harga: urutannya sama (harga[0] = meetingPoints[0], dst.)
     - jadwal: tanggal trip (YYYY-MM-DD). Tanggal yang sudah lewat otomatis disembunyikan. */
  AKTIVITAS: [
    {
      key: 'canyoning-sentul', label: 'Canyoning Sentul', emoji: '🧗', badge: '🔥 Paling diminati',
      meetingPoints: ['Basecamp', 'UKI', 'Hotel Ambarossa Bekasi', 'Stasiun Bogor'],
      harga: [295000, 420000, 420000, 395000],
      jadwal: ['2026-12-02', '2026-12-05', '2026-12-06', '2026-12-09', '2026-12-12', '2026-12-13', '2026-12-16',
               '2026-12-19', '2026-12-20', '2026-12-23', '2026-12-26', '2026-12-27', '2026-12-30'],
    },
    {
      key: 'gunung-papandayan', label: 'Gunung Papandayan', emoji: '⛰️', badge: null,
      meetingPoints: ['Basecamp', 'UKI', 'Hotel Ambarossa Bekasi', 'Stasiun Bogor'],
      harga: [200000, 365000, 365000, 365000],
      jadwal: ['2026-12-05', '2026-12-06', '2026-12-19', '2026-12-20', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-27'],
    },
    {
      key: 'rafting-cisadane', label: 'Rafting Cisadane', emoji: '🚣', badge: null,
      meetingPoints: ['Basecamp', 'Stasiun Bogor'],
      harga: [250000, 280000],
      jadwal: ['2026-12-05', '2026-12-06', '2026-12-10', '2026-12-12', '2026-12-13', '2026-12-17', '2026-12-19',
               '2026-12-20', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-27'],
      catatan: 'Ada Open Trip Spesial Liburan selama libur sekolah — tanggal lain tanya admin.',
    },
    {
      key: 'trekking-cisadon', label: 'Trekking Cisadon', emoji: '🥾', badge: null,
      meetingPoints: ['Stasiun Bogor'],
      harga: [125000],
      jadwal: ['2026-12-12', '2026-12-13', '2026-12-19', '2026-12-20', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-27'],
    },
    {
      key: 'curug-cibeureum', label: 'Trekking Curug Cibeureum', emoji: '💦', badge: null,
      meetingPoints: ['Basecamp', 'Stasiun Bogor'],
      harga: [155000, 270000],
      jadwal: ['2026-12-12', '2026-12-13', '2026-12-19', '2026-12-20', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-27'],
    },
  ],

  // Batas
  MAX_PESERTA: 20,
  MAX_FILE_MB: 8,
};
