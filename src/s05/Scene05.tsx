import React from 'react';
import { Img, staticFile } from 'remotion';
import { ARAH, B, CEK, F, R, bayanganKecil, lerp, rgba } from '../theme';
import { cin, MODE_TANPA_FOTO, MODE_TANPA_ORANG, naikY, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, Kutipan, geser } from '../parts/umum';
import { Kaca, KarakterLingkar, Penghubung, type PoseKarakter } from '../parts/kaca';
import { POSE, TepiSubtitle } from '../parts/nyata';
import { Avatar, PanahArah } from '../parts/v06';
import type { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 05 — Di Balik Setiap Pembelian, Ada Penjual (BATAS.s5 – BATAS.s6). Ide: 04_Asset/Ide-Visual-Scene-05.md.
 * Investor (kemeja biru) bertanya sebelum membeli → kartu pertanyaan "Kenapa ada orang yang mau menjual saham ini kepada saya di harga sekarang?"
 * muncul per baris di kata VO → SATU transaksi: pembeli (BELI) ↔ kartu "Saham yang sama · Rp1.000" ↔ penjual (JUAL), kesimpulan berlawanan
 * (▲ "Harga ini menarik." · ▼ "Saatnya keluar.") → "Mungkin salah" / "Mungkin benar" → fokus ke penjual: "Kenapa dia menjual?" (TEKS LAYAR) + meja
 * penjual (laporan keuangan, model valuasi, catatan kepemilikan, daftar risiko) → cincin analisis pembeli baru terisi SETENGAH.
 * Ekor keluar: semua keluar di 60f pertama Scene 06.
 *
 * 27 Okt — IDE BARU (dokumen "Investing_101_Ide_Visual_2D_Flat_Detail.md" Scene 05) di GAYA LAMA ini. Simon: "seperti scene 5 lama, tapi dengan ide
 * baru" + "style flat dengan char hanya digunakan untuk scene yang analogi … menggunakan gambar orang asli, dan icon illustrasi":
 *  · tombol BELI & JUAL DITEKAN BERSAMAAN (tombol tertekan + riak; ikon ketuk DIHAPUS 28 Okt), lalu SAHAM pindah dari penjual ke pembeli dan UANG ke arah sebaliknya (lencana milik
 *    di sisi lingkaran ikut bertukar) — langkah 1–2 dokumen;
 *  · TEKS LAYAR "Saham sama. Harga sama. Kesimpulan berbeda." per frasa di katanya; chip "Kesimpulan berbeda" diganti "✓ Transaksi terjadi" (langkah 4);
 *  · meja penjual = dokumen POP-UP satu per satu (ikon + label di bawah) di bawah chip "Catatan penjual" (langkah 3);
 *  · ▲ pembeli berganti "?" di "belum pernah kamu pikirkan" (langkah 5); cincin setengah: separuh kiri "Alasan beli" terisi, separuh kanan
 *    "Alasan jual" (menghadap penjual) masih kosong putus-putus.
 */
const W = urut(['kebiasaan', 'coba', 'tanyakan', 'satu', 'hal', 'membeli', 'kenapa', 'menjual', 'di', 'sekarang',
  'setiap', 'transaksi', 'beli', 'berpasangan', 'transaksi', 'jual', 'sahamnya', 'harganya', 'sama', 'kedua', 'kesimpulan', 'berlawanan',
  'penjualnya', 'salah', 'kamu', 'benar', 'pertanyaan', 'kenapa', 'menjual', 'belum', 'pikirkan', 'analisismu', 'selesai', 'setengah'], BATAS.s5 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  kebiasaan: n(), coba: n(), tanyakan: n(), satu: n(), hal: n(), membeli: n(), kenapa: n(), menjual: n(), di: n(), sekarang: n(),
  setiap: n(), transaksi: n(), beli: n(), berpasangan: n(), transaksi2: n(), jual: n(), sahamnya: n(), harganya: n(), sama: n(), kedua: n(), kesimpulan: n(),
  berlawanan: n(), penjualnya: n(), salah: n(), kamu: n(), benar: n(), pertanyaan: n(), kenapa2: n(), menjual2: n(), belum: n(), pikirkan: n(),
  analisismu: n(), selesai: n(), setengah: n(),
};
export const S05_T = T;
export const S05_AWAL = BATAS.s5;
export const S05_AKHIR = BATAS.s6;

/** investor berkemeja biru, tangan di dagu — orang yang sama dengan Scene 01 (aturan 22 Okt: investor ≠ orang berjas) */
const INVESTOR: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const ORANG_Y = 480; // papan B (pembeli · kartu · penjual · chip) berpusat
/** TATA LETAK PAPAN C/D (Simon 28 Okt: "alignment, spacing, layout sepanjang durasi scene 5 … sangat buruk"): judul (52 px) → 24 → gelembung (tinggi 66)
 *  → ekor 20 → 16 → puncak kepala pembeli (79 px di atas lingkaran) → lingkaran 220 → 43 → baris chip. Susunan judul…chip = y 210–784, pusat 497.
 *  Baris orang turun 480 → 585 MEMBERI RUANG bersamaan judul C muncul; papan D memakai baris yang sama (dulu turun 55 px lagi). */
const ORANG_Y_C = 585, JUDUL_TOP = 195, GELEMBUNG_DY = 268; // 258 → 268: ekor gelembung menyentuh rambut (pemindai tabrakan 30 Okt); judul 210 → 195: celah judul–gelembung 15 → 30 px (cek still f12400)
/** lebar gelembung (terukur audit DOM): ▲/▼ 17 px di kanan gelembung yang berpusat di atas kepala */
const LEBAR_GELEMBUNG = { beli: 334, jual: 300 };
const PEMBELI = { x0: 460, x1: 440, d: 220 };
const PENJUAL = { x0: 1460, x1: 920, d: 220 };
const KARTU = { x: 960, y: ORANG_Y, w: 340, h: 270 };
const MEJA = { x: 1390, y: ORANG_Y, w: 470, h: 420 };
/** dokumen penjual pop-up (2 × 2 di tempat meja lama): selisih dari pusat meja */
const DOK_POS: [number, number][] = [[-100, -88], [100, -88], [-100, 98], [100, 98]];
/** lencana MILIK di LUAR lingkaran (menghadap kartu saham): pembeli kanan-atas, penjual kiri-atas — Simon 30 Okt (tabrakan): dulu di tepi lingkaran,
 *  menimpa bahu pembeli → kini berjarak 8 px dari lingkaran pada sudut −40° */
const MILIK = { dx: (PEMBELI.d / 2 + 8 + 39) * Math.cos((40 * Math.PI) / 180), dy: -(PEMBELI.d / 2 + 8 + 39) * Math.sin((40 * Math.PI) / 180), d: 78 };
const UANG = { ikon: 'tumpukanKoin' as KunciIkon, warna: B.turq }, SAHAM = { ikon: 'saham' as KunciIkon, warna: B.blue };
const MEJA_ISI: { ikon: KunciIkon; teks: string }[] = [
  { ikon: 'laporanKeuangan', teks: 'Laporan keuangan' },
  { ikon: 'modelValuasi', teks: 'Model valuasi' },
  { ikon: 'kepemilikan', teks: 'Catatan kepemilikan' },
  { ikon: 'daftarRisiko', teks: 'Daftar risiko' },
];

/* ═════ A — SETENGAH BADAN + AWAN PIKIRAN (Simon 28 Okt: "Gambar real orang utuh itu setengah badan, dan pertanyaannya ada didalam thinking bubble (di
 * episode sebelumnya dari video investing 101 ada contohnya)") = pola Video 05 Scene 01: orang DI TENGAH dulu, bergeser ke kiri BERSAMAAN pop dua titik
 * pikiran (kecil dekat kepala → besar dekat awan) lalu awan (bentuk Video 02/03/05: 7 elips, tepi abu 6, isi putih, bayangan biru 7 %); susunan orang +
 * awan dipusatkan. Dulu: foto badan penuh + kartu pertanyaan oranye. ═════ */
const FOTO = POSE.muridPikirBiru;
/** foto setengah badan: skala 1,15, puncak kepala (tinta y0) di y 160 → pinggul memudar di pita subtitle (TepiSubtitle 840–970). Pusat tinta setengah badan
 *  = lengan x 384–765 (terukur dari alfa foto) → lebar 438 px */
// Simon 30 Okt (tabrakan): awan dulu menutupi lengan orang (tepi awan 764 < lengan 840) → orang 515 → 401, awan 1194 → 1180: celah 24, pasangan tetap berpusat 960
const SETENGAH = { k: 1.15, puncak: 160, cx: 574.5, tengah: 960, kiri: 401 };
/** awan: tepi kiri 764 = 30 px di kanan lengan; kelompok orang + awan 296–1624 → pusat 960 */
const AWAN = { x: 1180, y: 400, w: 860, h: 540 };
const AWAN_BENTUK: [number, number, number, number][] = [ // cx, cy, rx, ry (kotak acuan 400 × 284, salinan Video 05 Scene 01)
  [60, 140, 58, 58], [135, 82, 72, 72], [250, 72, 78, 78], [338, 145, 62, 62], [262, 210, 70, 70], [140, 205, 75, 75], [200, 145, 140, 95]];
/** dua titik pikiran (dx dari pusat tinta orang): kecil dekat kepala, besar dekat awan — kepala (dicerminkan) di dx −115…+57, wajah menengadah ke kanan */
const TITIK_PIKIR = [{ dx: 150, y: 296, r: 10 }, { dx: 240, y: 336, r: 17 }]; // jembatan kepala → awan (awan kini 100 px lebih jauh)
/** waktu A: titik kecil → titik besar → awan (selang 10 f, seperti V05); keluar terbalik: awan → titik besar → titik kecil, lalu orang MENGECIL & DIMASKER
 *  LINGKARAN jadi lingkaran pembeli (morf 60 f, selesai f12023 — sebelum chip BELI) */
const tA = { titik: [T.kenapa - 20, T.kenapa - 10], awan: T.kenapa, awanKeluar: T.setiap, titikKeluar: [T.setiap + 20, T.setiap + 10], morf: T.setiap + 40 };
const AKHIR_MORF = tA.morf + 30;
const AwanPikiran: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0.001) return null;
  const bentuk = (props: React.SVGProps<SVGEllipseElement>) => AWAN_BENTUK.map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} vectorEffect="non-scaling-stroke" {...props} />);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: AWAN.w, height: AWAN.h, transformOrigin: 'center', transform: `${geser(AWAN.x - AWAN.w / 2, AWAN.y - AWAN.h / 2)} scale(${skalaPop(p)})` }}>
      <svg width={AWAN.w} height={AWAN.h} viewBox="0 0 400 284" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform="translate(0 14)">{bentuk({ fill: B.blue, opacity: 0.07 })}</g>
        <g>{bentuk({ fill: B.white, stroke: B.grayLite, strokeWidth: 6 })}</g>
        <g>{bentuk({ fill: B.white })}</g>
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: AWAN.h * 0.51 - 73, textAlign: 'center', fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night,
        lineHeight: 1.22, whiteSpace: 'nowrap' }}>
        <div><WordText f={f} at={T.kenapa + 20}>Kenapa ada orang yang mau</WordText></div>
        <div><WordText f={f} at={T.menjual + 20}>menjual saham ini kepada saya</WordText></div>
        <div><WordText f={f} at={T.di + 20}>di harga sekarang?</WordText></div>
      </div>
    </div>);
};
/** ORANG MENGECIL & DIMASKER LINGKARAN (Simon 28 Okt: "Orang mengecil dan dimasking lingkaran seperti yang sudah kamu buat diadegan sebelumnya") — SATU
 *  bentuk: foto setengah badan mengecil (skala 1,15 → 0,393) sambil berpindah ke lingkaran pembeli; masker = atas terbuka + setengah lingkaran bawah
 *  (persis KarakterLingkar) berjari-jari 300 → 280 satuan foto (345 → 110 px layar). CAKRAM TURKIS = lingkaran masker itu sendiri (Simon 28 Okt: "timing
 *  animasi masking dan lingkaran yang jadi background orang itu seharusnya bersamaan … scale lingkaran seharusnya dari besar ke kecil (seperti
 *  maskingnya), tambahkan fade in"): jari-jari sama dengan masker di tiap frame, opacity 0 → 1 dengan kemajuan morf yang sama (dulu tumbuh dari 0
 *  di belakang dada). u = 1 → identik dengan KarakterLingkar
 *  pembeli (serah-terima tanpa loncatan); u = 0 → masker tak terlihat (bawahnya jatuh di pita subtitle yang memudar).
 *  MENGHADAP KANAN (Simon 28 Okt: "buat orangnya menghadap kekanan"): foto DICERMINKAN terhadap pusat lingkaran (= KarakterLingkar `cermin`, sama dengan
 *  V05 Scene 01 yang memakai foto ini); pusat tinta tetap di x0. */
/** transformasi morf: jangkar foto (pusat lingkaran pembeli) & skala pada kemajuan u — dipakai foto DAN titik pikiran (titik ikut terbawa kepala) */
const petaMorf = (x0: number, geserY: number, x1: number, y1: number, u: number) => {
  const ax0 = x0 - (INVESTOR.cx - SETENGAH.cx) * SETENGAH.k; // cermin: pusat tinta (kiri jangkar di foto asli) jatuh di kanan jangkar
  const ay0 = SETENGAH.puncak + (INVESTOR.cy - FOTO.y0) * SETENGAH.k + geserY;
  const k = lerp(SETENGAH.k, PEMBELI.d / 2 / INVESTOR.r, u);
  const ax = lerp(ax0, x1, u), ay = lerp(ay0, y1, u);
  /** titik layar (px, py) pada u = 0 → posisinya pada u */
  const titik = (px: number, py: number): [number, number] => [ax + ((px - ax0) * k) / SETENGAH.k, ay + ((py - ay0) * k) / SETENGAH.k];
  return { ax, ay, k, titik };
};
const OrangMorf: React.FC<{ x0: number; geserY: number; x1: number; y1: number; u: number }> = ({ x0, geserY, x1, y1, u }) => {
  const { ax, ay, k } = petaMorf(x0, geserY, x1, y1, u);
  const w = INVESTOR.w * k, h = INVESTOR.h * k, lx = INVESTOR.cx * k, ly = INVESTOR.cy * k, r = lerp(300, INVESTOR.r, u) * k;
  const klip = `path('M -4 -4 H ${w + 4} V ${ly} H ${lx + r} A ${r} ${r} 0 0 1 ${lx - r} ${ly} H -4 Z')`;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `${geser(ax, ay)} scale(1)` }}>
      {u > 0.001 && !MODE_TANPA_ORANG ? <div style={{ position: 'absolute', left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: B.turq,
        opacity: u < 0.9999 ? u : undefined }} /> : null}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: 'scaleX(-1)', transformOrigin: '0 0' }}>
        {MODE_TANPA_FOTO ? null : <Img src={staticFile(INVESTOR.src)} style={{ position: 'absolute', left: -lx, top: -ly, width: w, height: h, maxWidth: 'none', clipPath: klip }} />}
      </div>
    </div>);
};

const RC = PEMBELI.d / 2 + 22; // jari-jari cincin analisis
const SIN_CELAH = Math.sin((48 * Math.PI) / 180), COS_CELAH = Math.cos((48 * Math.PI) / 180); // ±48°: kepala + lengan yang terangkat
/** baris chip di bawah lingkaran (BELI/JUAL → "Mungkin benar/salah") — audit spacing 28 Okt: label "Pembeli (kamu)"/"Penjual" dihapus → chip dulu
 *  menggantung 73 px di bawah lingkaran; kini 43 px (= 16 px di bawah cincin analisis yang muncul di akhir). Chip kedua 15 px di bawahnya. */
const CHIP_DY = 66, CHIP2_DY = 128;
/** ▲ / "?" di kanan gelembung "Harga ini menarik." (lebar 334 di x pembeli + 30): audit DOM 28 Okt — dulu x + 210 menumpuk 10 px di ujung gelembung;
 *  kini celah 17 px, sama dengan ▼ penjual */
const PANAH_DX = LEBAR_GELEMBUNG.beli / 2 + 17 + 23 - 4; // kepala pembeli (foto dicerminkan) di x pembeli − 4
const lin = (f: number, a: number) => R(f, a - 30, a + 30, 0, 1, (t) => t);
/** WAKTU IDE BARU — tombol DIKLIK BERSAMAAN, lalu saham ⇄ uang berpindah. Simon 28 Okt: "jangan tambahkan icon tangan klik, klik saja buttonnya
 *  secara harfiah" → ikon ketuk di samping tombol DIHAPUS; klik = sama dengan klik BELI Scene 04: tombol tertekan (skala 0,94: 8 f turun + 12 f naik,
 *  inOut cubic) + riak cincin warna tombol 60 f inOut cubic (dulu ±12 % sinus 24 f + riak linear 24 f) */
const tB = { milikBeli: T.beli + 50, milikJual: T.jual + 10, tekan: T.jual + 50, pindah: T.jual + 86,
  milikKeluar: T.pertanyaan };
const tE = { catatan: T.menjual2 + 20, tanya: T.pikirkan, label: [T.selesai + 20, T.selesai + 40] };

/** pembungkus tombol yang DITEKAN: mengecil sesaat (berporos di tombol) + riak cincin */
const Tekan: React.FC<{ x: number; y: number; dip: number; riak: number; warna: string; children: React.ReactNode }> = ({ x, y, dip, riak, warna, children }) => (
  <>
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: dip < 0.9999 ? `scale(${dip})` : undefined }}>{children}</div>
    {riak > 0 && riak < 1 ? <div style={{ position: 'absolute', left: x - 70, top: y - 34, width: 140, height: 68, borderRadius: 999, border: `3px solid ${warna}`,
      boxSizing: 'border-box', opacity: 1 - riak, transform: `scale(${1 + 0.6 * riak})` }} /> : null}
  </>);

export const Scene05: React.FC<{ f: number }> = ({ f }) => {
  if (f < S05_AWAL || f >= S05_AKHIR + 70) return null;
  const keluar = popOut(f, S05_AKHIR + 30); // ekor: semua keluar mulai frame pertama Scene 06

  /* ═════ A — investor setengah badan bertanya (awan pikiran) → mengecil & dimasker lingkaran jadi pembeli ═════ */
  const masukA = naikY(lin(f, T.kebiasaan + 30)); // swipe naik dari bawah 60 f inOut cubic (sama dengan dulu)
  // 30 Okt (cek still f11690): dulu "?" keluar, orang menepi & awan pop di jendela yang sama → awan (outBack) menutupi lengan & lencana "?". Kini
  // berurutan: "?" selesai keluar (−40) → orang menepi (−70 … −10) → awan pop (−30 … +30) saat orang sudah ≥ 85 % menepi
  const sosokX = lerp(SETENGAH.tengah, SETENGAH.kiri, cin(f, T.kenapa - 40));
  const tandaTanya = popIn(f, T.satu + 10) * popOut(f, T.kenapa - 70);
  const titikP = TITIK_PIKIR.map((_, k) => popIn(f, tA.titik[k]) * popOut(f, tA.titikKeluar[k]));
  const awanP = popIn(f, tA.awan) * popOut(f, tA.awanKeluar);
  const morf = cin(f, tA.morf);

  /* ═════ B — satu transaksi ═════ */
  // D: fokus pindah ke penjual — pembeli & penjual bergeser memberi ruang BERSAMAAN pop "Catatan penjual" (audit 28 Okt; dulu di "kenapa" + 10, ±50 f
  // sebelum catatan muncul → isi berat ke kiri, pusat x 720 di f12700)
  const fokus = cin(f, tE.catatan);
  const pembeliP = (f >= AKHIR_MORF ? 1 : 0) * keluar; // 28 Okt: lingkaran pembeli = HASIL morf orang setengah badan (dulu pop di "beli")
  const penjualP = popIn(f, T.transaksi2 + 10) * keluar;
  const beliP = popIn(f, T.beli + 40) * keluar, jualP = popIn(f, T.jual + 10) * keluar;
  const kartuP = popIn(f, T.berpasangan + 30) * popOut(f, T.kenapa2 - 30); // keluar sebelum penjual bergeser melewatinya
  const garisP = cin(f, T.berpasangan + 50) * (1 - cin(f, T.kenapa2 - 40));
  const sorotSaham = cin(f, T.sahamnya) * (1 - cin(f, T.harganya));
  const hargaP = popIn(f, T.harganya + 10);
  // gelembung pembeli TETAP (catatan alasan membelinya; ▲ berganti "?" di E) · gelembung penjual keluar di "pertanyaan"
  const pendapat = [popIn(f, T.kedua + 10) * keluar, popIn(f, T.kedua + 30) * popOut(f, T.pertanyaan)];
  // aturan 17 (audit 28 Okt): ▲ selesai keluar (tE.tanya + 10) baru "?" mulai masuk — dulu popIn(+20) tumpang 20 f di tempat yang sama
  const naikP = pendapat[0] * popOut(f, tE.tanya - 20), tanyaBeli = popIn(f, tE.tanya + 40) * keluar;
  // ide baru: "Kesimpulan berbeda" kini di TEKS LAYAR atas → chip di bawah kartu = "✓ Transaksi terjadi" (transaksi tetap terjadi walau pandangan berbeda)
  const terjadiP = popIn(f, T.berlawanan + 20) * popOut(f, T.kenapa2 - 30);
  const judulC = f >= T.sahamnya - 40 && f < T.pertanyaan + 40;
  /* ide baru: tombol ditekan bersamaan → saham & uang bertukar */
  const tekan = R(f, tB.tekan - 4, tB.tekan + 4, 0, 1) * (1 - R(f, tB.tekan + 4, tB.tekan + 16, 0, 1)); // R = inOut cubic bawaan
  const dip = 1 - 0.06 * tekan;
  const riak = R(f, tB.tekan, tB.tekan + 60, 0, 1);
  const pindah = cin(f, tB.pindah);
  const milikP = [popIn(f, tB.milikBeli), popIn(f, tB.milikJual)].map((p) => p * popOut(f, tB.milikKeluar) * keluar);
  // aturan 17: tag lama keluar dulu, baru tag baru masuk di tempat yang sama
  // audit 28 Okt: chip baru mulai masuk TEPAT saat chip lama selesai keluar (dulu +20: tumpang 20 f)
  const salahP = popIn(f, T.salah + 40) * keluar, benarP = popIn(f, T.benar + 40) * keluar;
  const jualTetap = popOut(f, T.salah - 20), beliTetap = popOut(f, T.benar - 20);
  /* PUSAT TIAP MOMEN: pembeli sendirian di tengah → pasangan pembeli + kartu berpusat → bertiga (geser bersamaan pop kartu, lalu pop penjual) */
  const offB = 250 * (1 - cin(f, T.berpasangan + 30)) + 250 * (1 - cin(f, T.transaksi2 + 10));
  /* TENGAH DULU, LALU MEMBERI RUANG (audit 28 Okt): papan D (pembeli · penjual · catatan penjual) berpusat 960; chip "Alasan beli" (kiri cincin) membuat
   * isi merentang 93–1567 (pusat 830, tepi kiri 3 px keluar area aman) → seluruh papan bergeser +130 BERSAMAAN pop kedua chip (60 f inOut cubic) */
  const geserD = 130 * cin(f, (tE.label[0] + tE.label[1]) / 2);
  const xPembeli = lerp(PEMBELI.x0, PEMBELI.x1, fokus) + offB + geserD, xPenjual = lerp(PENJUAL.x0, PENJUAL.x1, fokus) + offB + geserD, xKartu = KARTU.x + offB;
  const xMeja = MEJA.x + geserD;
  const oy = lerp(ORANG_Y, ORANG_Y_C, cin(f, T.sahamnya - 20));
  const redupPembeli = 1 - 0.55 * fokus * (1 - cin(f, T.analisismu));

  /* ═════ D — kenapa dia menjual? ═════ */
  const judulD = f >= T.kenapa2 - 40;
  const catatanP = popIn(f, tE.catatan) * keluar;
  const isiMeja = MEJA_ISI.map((_, k) => popIn(f, T.belum + 14 * k) * keluar);
  const labelSetengah = tE.label.map((t) => popIn(f, t) * keluar);
  const cincin = cin(f, T.selesai + 10) * (1 - cin(f, S05_AKHIR + 20)); // analisis baru terisi SETENGAH: separuh kiri (alasan beli) terisi penuh
  const setengahP = popIn(f, T.setengah + 10) * keluar;

  return (
    <>
      {/* ═════ A ═════ */}
      {/* setengah badan: pinggul memudar di pita subtitle; morf ke lingkaran pembeli mengikuti posisi pembeli per frame */}
      {f < AKHIR_MORF ? <TepiSubtitle><OrangMorf x0={sosokX} geserY={masukA} x1={xPembeli} y1={oy} u={morf} /></TepiSubtitle> : null}
      {/* titik pikiran menempel kepala (ikut geser orang, dan ikut terbawa morf saat sedang keluar — dulu tertinggal & menimpa wajah, f11988) */}
      {TITIK_PIKIR.map((t, k) => { if (titikP[k] <= 0.001) return null;
        const [px, py] = petaMorf(sosokX, masukA, xPembeli, oy, morf).titik(sosokX + t.dx, t.y);
        return <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 2 * t.r, height: 2 * t.r, borderRadius: '50%', background: B.white,
          border: `3px solid ${B.grayLite}`, boxSizing: 'border-box', transform: `${geser(px - t.r, py - t.r)} scale(${skalaPop(titikP[k])})` }} />; })}
      <AwanPikiran f={f} p={awanP} />
      {/* "?" di kanan-atas kepala (wajah menengadah ke kanan) — dulu di atas kepala foto badan penuh */}
      <Lencana x={sosokX + 150} y={180} d={0} p={tandaTanya} warna={B.orange} teks="?" besar={96} />

      {/* ═════ B / C / D — transaksi ═════ */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d={`M ${xPembeli + PEMBELI.d / 2 + 16} ${oy} L ${xKartu - KARTU.w / 2 - 16} ${oy}`} g={garisP} warna={B.blue} titik={false}
          panah={{ x: xKartu - KARTU.w / 2 - 16, y: oy, sudut: 0 }} />
        <Penghubung d={`M ${xPenjual - PENJUAL.d / 2 - 16} ${oy} L ${xKartu + KARTU.w / 2 + 16} ${oy}`} g={garisP * cin(f, T.transaksi2 + 20)} warna={B.orange} titik={false}
          panah={{ x: xKartu + KARTU.w / 2 + 16, y: oy, sudut: Math.PI }} />
        {/* cincin analisis pembeli: baru setengah — separuh KIRI (alasan beli) terisi dari atas, separuh KANAN (alasan jual, menghadap penjual) kosong
          putus-putus */}
        {cincin > 0.001 ? (
          <>
            {/* aturan 9–10 (audit 28 Okt): separuh kanan putus-putus & jalur samar kiri kini TRIM PATH bersama isian (dulu memudar) */}
            {/* Simon 30 Okt (tabrakan): cincin dulu melintasi wajah (kepala menyembul di atas lingkaran) → celah ±30° di puncak, tempat kepala keluar */}
            <Penghubung d={`M ${xPembeli + RC * SIN_CELAH} ${oy - RC * COS_CELAH} A ${RC} ${RC} 0 0 1 ${xPembeli} ${oy + RC}`} g={cincin} warna={B.grayLite} tebal={5} titik={false} />
            <path d={`M ${xPembeli - RC * SIN_CELAH} ${oy - RC * COS_CELAH} A ${RC} ${RC} 0 0 0 ${xPembeli} ${oy + RC}`} fill="none" stroke={rgba(B.turq, 0.2)} strokeWidth={10}
              strokeLinecap="round" pathLength={1000} strokeDasharray={`${1000 * cincin} 1000`} />
            <path d={`M ${xPembeli - RC * SIN_CELAH} ${oy - RC * COS_CELAH} A ${RC} ${RC} 0 0 0 ${xPembeli} ${oy + RC}`} fill="none" stroke={B.turq} strokeWidth={10} strokeLinecap="round"
              pathLength={1000} strokeDasharray={`${1000 * cincin} 1000`} />
          </>) : null}
      </svg>
      <div style={{ position: 'absolute', inset: 0, opacity: redupPembeli < 0.999 ? redupPembeli : undefined }}>
        <KarakterLingkar pose={INVESTOR} x={xPembeli} y={oy} D={PEMBELI.d} s={pembeliP} warna={B.turq} cermin />
        {/* label "Pembeli (kamu)" DIHAPUS (Simon 28 Okt: "hapus text 'Pembeli (kamu)'") — chip BELI tetap sebaris dengan chip JUAL penjual */}
        {/* BELI hijau · JUAL merah (Simon 28 Okt: "jual dan beli ganti ke warna merah dan hijau"; dulu biru · oranye) — riak tekan ikut warna tombol */}
        <Tekan x={xPembeli} y={oy + PEMBELI.d / 2 + CHIP_DY} dip={dip} riak={riak} warna={ARAH.naik}>
          <Chip x={xPembeli} y={oy + PEMBELI.d / 2 + CHIP_DY} teks="BELI" warna={ARAH.naik} p={beliP * beliTetap} size={26} />
        </Tekan>
        <Chip x={xPembeli} y={oy + PEMBELI.d / 2 + CHIP_DY} teks="Mungkin benar" ikon="tersedia" warna={CEK} p={benarP} size={24} />
        {/* gelembung BERPUSAT di atas kepala, ekor menunjuk kepala (dulu x + 30, ekor 55 px di kiri kepala) */}
        <Kutipan x={xPembeli - 4} y={oy - GELEMBUNG_DY} teks="Harga ini menarik." p={pendapat[0]} warna={B.blue} size={28} ekor="tengah" />
        <PanahArah x={xPembeli + PANAH_DX} y={oy - GELEMBUNG_DY} naik p={naikP} d={46} />
      </div>
      {/* ▲ pembeli berganti "?" di "belum pernah kamu pikirkan" — di luar lapisan redup supaya tetap terang */}
      {tanyaBeli > 0 ? (
        <div style={{ position: 'absolute', left: xPembeli + PANAH_DX - 23, top: oy - GELEMBUNG_DY - 23, width: 46, height: 46, borderRadius: '50%', background: B.white,
          border: `3px solid ${B.orange}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(tanyaBeli)})`,
          fontFamily: F, fontWeight: 800, fontSize: 24, lineHeight: 1, color: B.orange, boxShadow: bayanganKecil(B.orange) }}>?</div>) : null}
      <Avatar x={xPenjual} y={oy} d={PENJUAL.d} p={penjualP} warna={B.orange} />
      {/* label "Penjual" DIHAPUS (Simon 28 Okt: "hapus text penjualnya juga") */}
      <Tekan x={xPenjual} y={oy + PENJUAL.d / 2 + CHIP_DY} dip={dip} riak={riak} warna={ARAH.turun}>
        <Chip x={xPenjual} y={oy + PENJUAL.d / 2 + CHIP_DY} teks="JUAL" warna={ARAH.turun} p={jualP * jualTetap} size={26} />
      </Tekan>
      <Chip x={xPenjual} y={oy + PENJUAL.d / 2 + CHIP_DY} teks="Mungkin salah" warna={B.orange} p={salahP} size={24} />
      {/* sebaris dengan gelembung pembeli, berpusat di atas penjual, ekor ke tengah (dulu x − 30, ekor 100 px di kiri lingkaran) */}
      <Kutipan x={xPenjual} y={oy - GELEMBUNG_DY} teks="Saatnya keluar." p={pendapat[1]} warna={B.orange} size={28} ekor="tengah" />
      <PanahArah x={xPenjual + LEBAR_GELEMBUNG.jual / 2 + 17 + 23} y={oy - GELEMBUNG_DY} naik={false} p={pendapat[1]} d={46} />
      <Kaca x={xKartu} y={oy} w={KARTU.w} h={KARTU.h} p={kartuP} warna={B.blue} tab="atas" tepi={sorotSaham}>
        <Bulat x={KARTU.w / 2} y={78} d={96} warna={B.blue} ikon="saham" p={1} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 136, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night }}>Saham yang sama</div>
        {hargaP > 0 ? <div style={{ position: 'absolute', left: 0, right: 0, top: 176, textAlign: 'center', transform: `scale(${skalaPop(hargaP)})` }}>
          <span style={{ fontFamily: F, fontSize: 48, fontWeight: 800, color: B.blue }}>Rp1.000</span></div> : null}
      </Kaca>
      <Chip x={xKartu} y={oy + PEMBELI.d / 2 + CHIP_DY} teks="Transaksi terjadi" ikon="tersedia" warna={CEK} p={terjadiP} size={26} />
      {/* lencana MILIK: pembeli memegang uang, penjual memegang saham → sesudah tombol ditekan keduanya terbang bertukar (saham lewat atas) */}
      {(() => {
        const aBeli: [number, number] = [xPembeli + MILIK.dx, oy + MILIK.dy], aJual: [number, number] = [xPenjual - MILIK.dx, oy + MILIK.dy];
        const terbang = pindah > 0 && pindah < 1;
        const token = (dari: [number, number], ke: [number, number], lengkung: number, m: typeof UANG, k: string) => (
          <Bulat key={k} x={lerp(dari[0], ke[0], pindah)} y={lerp(dari[1], ke[1], pindah) + lengkung * Math.sin(Math.PI * pindah)} d={MILIK.d} warna={m.warna} ikon={m.ikon} p={1} />);
        return (
          <>
            {terbang ? null : <Bulat x={aBeli[0]} y={aBeli[1]} d={MILIK.d} warna={pindah >= 1 ? SAHAM.warna : UANG.warna} ikon={pindah >= 1 ? SAHAM.ikon : UANG.ikon} p={milikP[0]} />}
            {terbang ? null : <Bulat x={aJual[0]} y={aJual[1]} d={MILIK.d} warna={pindah >= 1 ? UANG.warna : SAHAM.warna} ikon={pindah >= 1 ? UANG.ikon : SAHAM.ikon} p={milikP[1]} />}
            {terbang ? <>{token(aJual, aBeli, -150, SAHAM, 's')}{token(aBeli, aJual, -60, UANG, 'u')}</> : null}
          </>);
      })()}

      {/* ═════ C — TEKS LAYAR per frasa (gaya judul lama) ═════ */}
      {judulC ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: JUDUL_TOP, textAlign: 'center', whiteSpace: 'nowrap' }}>
          {[{ teks: 'Saham sama.', at: T.sahamnya }, { teks: 'Harga sama.', at: T.harganya }, { teks: 'Kesimpulan berbeda.', at: T.kesimpulan }].map((b, k) => (
            <React.Fragment key={k}>{k > 0 ? ' ' : null}
              {/* judul 52 px (sama dengan judul D) di y 210 — di bawah zona logo (≤ 204), jadi tidak lagi menabrak logo saat naik keluar */}
              <WordText f={f} at={b.at} until={T.pertanyaan - 30} style={{ fontFamily: F, fontSize: 52, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>
                {b.teks}</WordText>
            </React.Fragment>))}
        </div>) : null}

      {/* ═════ D ═════ */}
      {judulD ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: JUDUL_TOP, textAlign: 'center' }}>
          <WordText f={f} at={T.kenapa2 + 20} until={S05_AKHIR + 40} style={{ fontFamily: F, fontSize: 52, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>
            Kenapa dia menjual?</WordText>
        </div>) : null}
      {/* catatan penjual = dokumen POP-UP satu per satu (ikon + label di bawah), di tempat meja lama */}
      <Chip x={xMeja} y={oy - 200} teks="Catatan penjual" warna={B.orange} p={catatanP} size={26} />
      {MEJA_ISI.map((m, k) => isiMeja[k] <= 0 ? null : (
        <React.Fragment key={m.teks}>
          <Bulat x={xMeja + DOK_POS[k][0]} y={oy + DOK_POS[k][1]} d={96} warna={B.orange} ikon={m.ikon} p={isiMeja[k]} />
          <Label x={xMeja + DOK_POS[k][0]} y={oy + DOK_POS[k][1] + 74} teks={m.teks} f={f} at={T.belum + 14 * k + 10} size={24} lebar={200} keluar={S05_AKHIR + 30} />
        </React.Fragment>))}
      {/* label dua separuh cincin analisis */}
      <Chip x={xPembeli - RC - 112} y={oy} teks="Alasan beli" ikon="tersedia" warna={CEK} p={labelSetengah[0]} size={24} />
      {/* "Alasan jual" = separuh yang BELUM dipikirkan: tepi putus-putus oranye (warna penjual) — dulu Chip `kosong` (teks abu muda) hampir tak terlihat */}
      {labelSetengah[1] > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${xPembeli + RC + 112}px, ${oy}px, 0) translate(-50%, -50%) scale(${skalaPop(labelSetengah[1])})`,
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, background: B.white, border: `2.5px dashed ${B.orange}`, fontFamily: F,
          fontSize: 24, fontWeight: 700, lineHeight: 1, color: B.night, whiteSpace: 'nowrap' }}>
          Alasan jual<span style={{ color: B.orange, fontWeight: 800 }}>?</span></div>) : null}
      <Chip x={xPembeli} y={oy + PEMBELI.d / 2 + CHIP2_DY} teks="Analisis baru setengah" warna={B.turq} p={setengahP} size={24} />
    </>);
};
