/* =========================================================
   KONFIGURASI FORM REGISTRASI — Travelmates Indonesia
   Edit file ini saja untuk ganti harga, trip, rekening, dll.
   ========================================================= */
window.TM_CONFIG = {
  // URL Web App dari Google Apps Script (lihat PANDUAN_SETUP.md langkah 3)
  APPS_SCRIPT_URL: '',

  // Nomor WhatsApp admin (format 62..., tanpa + dan tanpa spasi)
  WA_ADMIN: '6282125445322',

  BANK: { nomor: '8720600511', bank: 'BCA', atasNama: 'Haidar Akmaludin' },

  DP_PERSEN: 50,

  ADDONS: [
    { key: 'trekkingPole', label: '🥾 Trekking Pole', harga: 15000, satuan: 'pcs' },
    { key: 'drone', label: '🚁 Drone', harga: 120000, satuan: 'unit' },
  ],

  // Daftar aktivitas. "harga" urutannya sama dengan "meetingPoints".
  AKTIVITAS: [
    {
      key: 'trekking', label: 'Trekking', emoji: '🌿', badge: null,
      meetingPoints: ['Basecamp', 'Stasiun Bogor'],
      sub: [
        { nama: 'Curug Cisadane', harga: [150000, 275000] },
        { nama: 'Curug Cibeureum', harga: [150000, 275000] },
      ],
    },
    {
      key: 'canyoning', label: 'Canyoning', emoji: '🧗', badge: '🔥 Paling diminati',
      meetingPoints: ['Lokasi', 'Stasiun Bogor'],
      sub: [
        { nama: 'Curug Bungsu, TNGHS (27m)', harga: [290000, 390000] },
        { nama: 'Curug Cileuksa, Sukajaya (48m)', harga: [290000, 390000] },
        { nama: 'Curug Cibingbin Sentul (24m)', harga: [295000, 395000] },
      ],
    },
    {
      key: 'ropeJumping', label: 'Rope Jumping', emoji: '🌉', badge: '🔥 Paling diminati',
      meetingPoints: ['Lokasi', 'Stasiun Bogor'],
      sub: [
        { nama: 'Jembatan Cidokom, Bogor (25m)', harga: [290000, 390000] },
        { nama: 'Curug Ngumpet, TNGHS (21m)', harga: [290000, 390000] },
      ],
    },
    {
      key: 'rafting', label: 'Rafting', emoji: '🌊', badge: null,
      meetingPoints: ['Lokasi', 'Stasiun Bogor'],
      sub: [
        { nama: 'Cisadane (12km)', harga: [250000, 280000] },
      ],
    },
  ],

  // Batas
  MAX_PESERTA: 20,
  MAX_FILE_MB: 8,
};
