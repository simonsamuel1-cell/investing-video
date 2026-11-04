/**
 * ⚠ Simon 13 Okt: "untuk icon iconnya pastikan kamu mencari diinternet terlebih dahulu, lalu tracing" + gaya sama dengan video yang sudah
 *   disetujui → ikon KONSEP = Flaticon juicy_fish Solid (dicari di flaticon.com, PNG 512 dari CDN, divektorkan scripts/trace-flaticon.py ke
 *   04_Asset/ikon-flaticon, IoU 0,95–0,99). Glyph UI kecil (centang, gembok, jam lencana, tangan stop) tetap stok.
 * PETA IKON — SATU SUMBER untuk episode ini (pola Video 02 `instruments-episode/src/ikon.ts`).
 * Ikon instrumen = Flaticon juicy_fish Solid yang SAMA dengan Video 02 (berkas vektor di `Video 02/04_Asset/ikon-flaticon`),
 * supaya instrumen yang sama berikon sama di seluruh seri. Ikon lain = stok MingCute / Material Symbols (npm @iconify-json di _fondasi/icons).
 * Aturan: SATU konsep = SATU ikon, dan TIDAK ada dua konsep berikon sama (diperiksa saat modul dimuat).
 */
export const IKON = {
  // instrumen (awan "ke mana?" Scene 01) — sama dengan Video 02
  saham: 'flaticon:6064699',
  reksaDana: 'flaticon:2221473',
  emas: 'flaticon:6404503',
  obligasi: 'flaticon:13974823',
  // kalender — dibuat ulang dari acuan Simon di Video 02 (12 Okt: "buat icon kalendernya jadi seperti ini agar lebih jelas secara konteksnya")
  kalender: 'lokal:kalender',
  // notifikasi uang masuk (Scene 01): gaji · bonus · THR
  gaji: 'flaticon:2516252',
  bonus: 'flaticon:3345002',
  thr: 'flaticon:12247649',
  // berhenti dulu (jari = aset foto Simon, public/hp/jari.png)
  berhenti: 'material-symbols:back-hand',
  // Scene 02 — "dipakai lima tahun lagi": jam pasir (sama dengan 'jangka waktu' Video 02 Scene 12)
  jangkaWaktu: 'flaticon:3344524',
  // Scene 03 — "tiga dompet" & "waktu penggunaan"
  dompet: 'flaticon:10725761',
  waktu: 'mingcute:time-fill',
  // Scene 04 — kebutuhan uang aktif (urutan ucapan VO) + "harus tersedia"
  makan: 'lokal:makan', // Simon 13 Okt: garpu · piring · pisau (acuan 04_Asset/ikon-lokal/makan_acuan_simon.png, scripts/vektor-makan.py)
  kos: 'flaticon:10725680',
  cicilan: 'flaticon:13974729',
  transportasi: 'flaticon:5810589',
  mendadak: 'flaticon:5951067',
  tersedia: 'mingcute:check-fill',
  // Scene 05 — tempat uang aktif (ikon instrumen = Video 02) + sifatnya
  rdPasarUang: 'flaticon:2386378',
  mudahDicairkan: 'flaticon:12748137',
  stabil: 'flaticon:13378939',
  trofi: 'flaticon:9752055',
  // Scene 06 — dana darurat (pelampung) · tiga kejadian darurat (VISUAL naskah) · investasi lain · "menjual"
  danaDarurat: 'flaticon:5697657',
  kehilanganKerja: 'flaticon:3764780',
  perbaikanMotor: 'flaticon:5691013',
  biayaMedis: 'flaticon:14595829',
  investasiLain: 'flaticon:6232854',
  jual: 'flaticon:9426798',
  // Scene 07 — tujuan uang stabil di garis waktu (VISUAL naskah: Biaya Sekolah · Ganti Kendaraan · DP Rumah)
  biayaSekolah: 'flaticon:11823756',
  gantiKendaraan: 'flaticon:5810722',
  dpRumah: 'flaticon:11823560',
  // Scene 07 roadmap (Simon 13 Okt "ada titik awal dan titik akhirnya"): pin mulai (Sekarang) · bendera finis (3 Tahun)
  titikAwal: 'flaticon:9482064',
  titikAkhir: 'flaticon:5144397',
  // Scene 08 — tanggal pembayaran TETAP (gembok)
  targetUtama: 'flaticon:9571345', // "TARGET utamanya": slot target sebelum diisi "Return setinggi mungkin"
  kunci: 'mingcute:lock-fill',
  tagihan: 'flaticon:9431187', // "pengeluaran lain yang sudah terjadwal"
  // Scene 09 — tempat uang stabil (ikon instrumen = Video 02, Flaticon juicy_fish) · "match the time"
  deposito: 'flaticon:18236629',
  rdPendapatanTetap: 'flaticon:2386549',
  // Scene 10–13 — instrumen jangka panjang (ikon Video 02) · Scene 11 pasar jatuh · Scene 13 siklus perusahaan
  rdSaham: 'flaticon:1990962',
  rdIndeks: 'flaticon:3345152',
  pasarJatuh: 'flaticon:5951167',
  pendapatan: 'flaticon:7376858',
  laba: 'flaticon:6402075',
  investasiKembali: 'flaticon:2013596',
  bertumbuh: 'flaticon:6675531',
  profilRisiko: 'flaticon:5950856',
  // Scene 15–18 — orang berbeda (A/B/C) · "Untuk apa?"
  orangA: 'flaticon:7819906',
  orangB: 'flaticon:6061854',
  orangC: 'flaticon:5834676',
  pertanyaan: 'flaticon:4683097',
} as const;
export type KunciIkon = keyof typeof IKON;

// penjaga: dua konsep berbeda tidak boleh berikon sama
const dobel = Object.entries(IKON).filter(([, v], i, a) => a.findIndex(([, w]) => w === v) !== i);
if (dobel.length) throw new Error(`ikon kembar: ${dobel.map(([k, v]) => `${k}=${v}`).join(', ')}`);
