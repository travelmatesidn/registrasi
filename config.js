/* =========================================================
   KONFIGURASI FORM REGISTRASI — Travelmates Indonesia
   Edit file ini saja untuk ganti trip, harga, rekening, dll.
   ========================================================= */
window.TM_CONFIG = {
  // URL Web App dari Google Apps Script (lihat PANDUAN_SETUP.md langkah 3)
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzZHU1rejBPHSG3JLQ47AKo4itP6kXQbtQGPT8YhxgiVLn5Cn-w-u2xXyphAeVZL7ud/exec',

  // Nomor WhatsApp admin (format 62..., tanpa + dan tanpa spasi)
  WA_ADMIN: '6282125445322',

  BANK: { nomor: '0909 010000 35562', bank: 'BRI', atasNama: 'PT TRAVELMATES INDONESIA GRUP' },

  DP_PERSEN: 50,

  // Setelah pendaftaran sukses, otomatis pindah ke WhatsApp admin setelah sekian detik
  WA_REDIRECT_DETIK: 3,

  /* Daftar trip
     - meetingPoints & harga: urutannya sama (harga[0] = meetingPoints[0], dst.)
     - badge: label kecil di kartu trip (isi null kalau tidak perlu) */
  AKTIVITAS: [
    {
      key: 'canyoning-sentul', label: 'Canyoning Sentul', emoji: '🧗', badge: '🔥 Paling diminati',
      meetingPoints: ['Basecamp', 'UKI', 'Hotel Ambarossa Bekasi', 'Stasiun Bogor'],
      harga: [295000, 420000, 420000, 395000],
    },
    {
      key: 'gunung-papandayan', label: 'Gunung Papandayan', emoji: '⛰️', badge: null,
      meetingPoints: ['Basecamp', 'UKI', 'Hotel Ambarossa Bekasi', 'Stasiun Bogor'],
      harga: [200000, 365000, 365000, 365000],
    },
    {
      key: 'rafting-cisadane', label: 'Rafting Cisadane', emoji: '🚣', badge: '🔥 Paling diminati',
      meetingPoints: ['Basecamp', 'Stasiun Bogor'],
      harga: [250000, 280000],
    },
    {
      key: 'trekking-cisadon', label: 'Trekking Cisadon', emoji: '🥾', badge: null,
      meetingPoints: ['Stasiun Bogor'],
      harga: [125000],
    },
    {
      key: 'curug-cibeureum', label: 'Trekking Curug Cibeureum', emoji: '💦', badge: null,
      meetingPoints: ['Basecamp', 'Stasiun Bogor'],
      harga: [155000, 270000],
    },
  ],

  // Batas
  MAX_PESERTA: 20,
  MAX_FILE_MB: 8,
};
