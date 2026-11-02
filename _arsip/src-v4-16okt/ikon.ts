/**
 * PETA IKON — SATU SUMBER untuk seluruh episode.
 * Putaran 3 (Simon 6 Okt: "icon itu sangat tidak menggambarkan masing-masing instrumen … cari internet, jika tidak bisa
 * download recreate 100% sama"): ikon instrumen & konsep keuangan = **Flaticon, juicy_fish gaya Solid** (satu gaya).
 * PNG asli 512 px dari CDN Flaticon → divektorkan potrace (IoU 0,981–0,998 terhadap aslinya) → 04_Asset/ikon-flaticon/.
 * ⚠ Lisensi Flaticon gratis = wajib atribusi "juicy_fish – Flaticon" KECUALI akun Premium — keputusan Simon.
 * SEMENTARA MingCute (Flaticon memblokir pencarian saat itu): tenor, sederhana, stabil, mudahDipahami, trofi, kunciSewa.
 *
 * Aturan: SATU konsep = SATU ikon, dan TIDAK ada dua konsep berikon sama (diperiksa saat modul dimuat).
 */
export const IKON = {
  // instrumen (chart Scene 01 + peta bab + kartu Scene 02)
  emas: 'flaticon:6404503',
  saham: 'flaticon:6064699',
  rdSaham: 'flaticon:1990962',
  rdIndeks: 'flaticon:3345152', // layar dgn garis indeks pasar (Simon 6 Okt: #2386307 kisi+koin \"belum jelas maksudnya\")
  obligasi: 'flaticon:13974823',
  rdPendapatanTetap: 'flaticon:2386549',
  rdPasarUang: 'flaticon:2386378',
  deposito: 'flaticon:18236629',
  properti: 'flaticon:6064683',
  tabungan: 'flaticon:18236992',
  reksaDana: 'flaticon:2221473',
  // lima pertanyaan (Scene 01)
  returnInvestasi: 'flaticon:7822176', // tanaman tumbuh dari pot ber-$ (Simon 7 Okt: kartu Return harus berikon seperti 4 kartu lain)
  sumberReturn: 'flaticon:6757162',
  naikTurunHarga: 'flaticon:2386278',
  mudahDicairkan: 'flaticon:12748137',
  modalAwal: 'flaticon:4333328',
  instrumenInvestasi: 'flaticon:13974580', // lingkaran terbagi aneka aset — pusat adegan radial pembuka Scene 01 (Simon 7 Okt)
  // Scene 02
  bunga: 'flaticon:10725661',
  gembok: 'flaticon:13974813',
  tenor: 'lokal:kalender', // Simon 12 Okt "buat icon kalendernya jadi seperti ini agar lebih jelas secara konteksnya" — dibuat ulang dari acuannya (04_Asset/ikon-lokal); dulu mingcute:calendar-fill
  bungaLebihTinggi: 'flaticon:6400115',
  likuiditas: 'flaticon:5834653',
  uangKeluar: 'flaticon:5950015',
  kapanSaja: 'mingcute:time-fill', // lencana jam di celengan: uang tabungan bisa dipakai "kapan saja" (Simon 8 Okt: visual pendukung)
  sederhana: 'mingcute:check-circle-fill',
  stabil: 'mingcute:anchor-fill',
  mudahDipahami: 'mingcute:bulb-2-fill',
  // Scene 03
  bisnisLaba: 'flaticon:2183102', // gedung + koin: "bisnis yang menghasilkan laba" (emas TIDAK punya ini)
  // Scene 04 (brief: Geopolitical Risk ↑ · Uncertainty ↑ · USD ↓ · Gold Demand ↑ → Gold Price ↑)
  geopolitik: 'flaticon:6981097', // bola dunia + tank
  ketidakpastian: 'flaticon:2386509', // layar pasar + tanda peringatan
  dolarMelemah: 'flaticon:3763812', // batang turun + $ panah bawah
  investor: 'flaticon:2386453', // orang + kantong uang
  bankSentral: 'flaticon:2183096', // gedung bank berpilar + $
  lindungiAset: 'flaticon:1992007', // kantong uang + perisai ("investor lebih berhati-hati")
  permintaanEmas: 'flaticon:2386324', // tangan + koin → batangan emas ("permintaan terhadap emas")
  // Scene 05 (Properti) — brief: Rental Income · Potential Price Appreciation · Higher Capital · Lower Liquidity · Transaction Costs
  kenaikanNilai: 'flaticon:11823716', // rumah + grafik naik
  hargaRumah: 'flaticon:10725736', // rumah + label harga ("harga yang lebih rendah")
  tradeOff: 'flaticon:5950856', // timbangan ! / ✓
  biayaTransaksi: 'flaticon:6232480', // jabat tangan + % (agen, administrasi, transaksi)
  // adegan tambahan Scene 05 (Simon 7 Okt: adegan tambahan, bukan teks)
  agenProperti: 'flaticon:10725655', // rumah + agen
  administrasi: 'flaticon:12504078', // kontrak + stempel
  cepat: 'flaticon:4492051', // jam + garis kecepatan ("harus cepat dijual")
  // Scene 06 (Obligasi) — brief: Investor → lends money to Government / Company → Coupon → Maturity → Principal repayment
  pemerintah: 'flaticon:4902193', // gedung berkubah
  perusahaan: 'flaticon:4680513', // gedung kantor
  pokokKembali: 'flaticon:7377214', // kantong uang + panah balik
  kondisiPasar: 'flaticon:10327506', // kaca pembesar di atas candlestick
  keranjang: 'flaticon:9427124', // keranjang berjeruji (Simon 7 Okt: "keranjang investasi" divisualkan sebagai keranjang; acuan keranjang kawat = susunan saja)
  kupon: 'flaticon:6404983', // tiket % berlubang — kupon obligasi (Simon 7 Okt: "icon kupon"), beda dari 'bunga' (batang %)
  sukuBunga: 'flaticon:18043622', // koin % + panah naik/turun (7 Okt audit: dulu ikon 'bunga' = sama dgn Kupon berkala di layar yang sama)
  // Scene 07 (Reksa Dana) — isi keranjang memakai ikon instrumen yang sudah ada; Return = returnInvestasi, Volatilitas = naikTurunHarga (lensa S01)
  risiko: 'flaticon:5950448', // koin $ + tanda peringatan
  kacaPembesar: 'flaticon:12133381', // kaca pembesar (7 Okt audit: ganti kaca pembesar yang digambar tangan — ikon wajib stok)
  // Scene 08 (Saham) — brief: Stock → Ownership in a company → Products / Services → Revenue → Profit (Laba = bisnisLaba, gema Scene 03)
  produkLayanan: 'flaticon:4680803', // roda gigi + kotak
  pendapatan: 'flaticon:18043594', // tumpukan koin
  // Scene 09 (Aset produktif) — brief: Strong business (Brand · Scale · Market position) → Profit → Reinvestment → Expansion → More revenue → More profit → Growth
  skalaUsaha: 'flaticon:4902918', // dua gedung tinggi
  pasarBaru: 'flaticon:14235273', // bola dunia + panah
  brand: 'flaticon:4067615', // dokumen merek "A" + pena
  posisiPasar: 'flaticon:5549841', // medali nomor 1
  pendanaan: 'flaticon:2221428', // kantong uang dari banyak pemodal
  investasiKembali: 'flaticon:2386291', // koin + panah melingkar
  ekspansi: 'flaticon:7172738', // koper + panah keluar
  labaLebihBesar: 'flaticon:6402075', // koin $ + tiga panah naik (7 Okt audit: dulu = ikon Laba, kembar di satu siklus)
  pertumbuhan: 'flaticon:12748505', // tumpukan koin + panah naik (juga "pertumbuhan jangka panjang" Scene 13)
  // Scene 10 (Volatilitas ≠ Risiko) — brief: Business deterioration · Permanent loss · Forced selling
  rugiPermanen: 'flaticon:12504086', // $ dicoret
  bisnisMemburuk: 'flaticon:2386570', // meteran turun + peringatan
  terpaksaJual: 'flaticon:3133967', // dompet dicoret
  // Scene 12 — "kapan uang itu akan digunakan" (time horizon)
  jangkaWaktu: 'flaticon:3344524', // jam pasir
  // Scene 13 (Penutup) — brief: Your money → Daily needs · Emergency fund · Mid-term goals · Long-term growth → Next lesson
  uangKita: 'flaticon:3344888', // tumpukan uang kertas
  sehariHari: 'flaticon:7780914', // daftar belanja + belanjaan
  danaDarurat: 'flaticon:5951067', // tanda seru alarm
  tujuanMenengah: 'flaticon:1992085', // target + daftar
  // penanda
  trofi: 'mingcute:trophy-fill',
  kunciSewa: 'flaticon:11823758', // kunci ⇄ uang = pendapatan sewa (7 Okt: ganti MingCute sementara; dipakai S01 pil sewa & S05)
} as const;
export type KunciIkon = keyof typeof IKON;

// penjaga: dua konsep berbeda tidak boleh berikon sama
const dobel = Object.entries(IKON).filter(([, v], i, a) => a.findIndex(([, w]) => w === v) !== i);
if (dobel.length) throw new Error(`ikon kembar: ${dobel.map(([k, v]) => `${k}=${v}`).join(', ')}`);
