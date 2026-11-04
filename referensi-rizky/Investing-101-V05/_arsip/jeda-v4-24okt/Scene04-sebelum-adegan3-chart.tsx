import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, bayanganKecil, CEK, F, io, R, rgba, SISI } from '../theme';
import { cin, gayaPapan, Icon, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { GeoKartu, INVESTOR_NAVY, Kaca, KacaMorf, KarakterLingkar, Penghubung, PoseKarakter } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan, kipasKerumunan } from '../parts/jalur';
import { Kalender, RASIO_UANG, Uang } from '../parts/nyata';
import { garis, ujungGaris, yDari } from '../parts/grafik';
import { GrafikLilin, laju, Lilin, relatif, rentang } from '../parts/lilin';
import { S02_INVESTASI, S05_SAHAM, S08_PASAR, S10_NAIK, S10_TURUN, S11_KRISIS, S14_IHSG_6TH, S15_TURUN } from '../data/pasar';
import { RATA_DANA, SP500_TR } from '../data/sp500';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';

/**
 * SCENE 04 — Indeks vs Investasi Profesional (BATAS.s4 – BATAS.s5). IDE SIMON 24 Okt (revisi seluruh video, 5 adegan), naskah & VO tetap:
 *  1 Pertanyaan: profesional memeriksa grafik saham (candlestick) & memilih beberapa untuk dibeli; di sampingnya indeks = kumpulan banyak saham.
 *  2 Taruhan Buffett: membandingkan kedua cara — modal sama, 10 tahun, akhir 2007 – akhir 2017.
 *  3 Perjalanan & hasil: modal sama; kalender 2007 → 2017, nilai keduanya naik-turun (S&P 500 bulanan asli), jatuh tajam di krisis 2008 lalu pulih;
 *    di akhir pergerakan berhenti → hasil berdampingan: tumpukan uang, +125,8 % vs rata-rata +36,3 % di atas tumpukannya.
 *  4 Mengapa profesional tidak selalu menang: profesional memilih beberapa dari kumpulan saham (candlestick asli) — sebagian bagus, sebagian
 *    tertinggal pasar; indeks mengikuti seluruh kumpulan; sulit bahkan bagi yang berpengalaman.
 *  5 Indeks masuk akal: investor (dengan kerumunan ikon orang = "banyak investor") menimbang pilih saham satu per satu vs ikuti indeks → indeks;
 *    pesan akhir: sederhana ≠ tidak serius.
 * Angka: surat pemegang saham Berkshire Hathaway 2017 (S&P 500 +125,8 %, rata-rata lima dana +36,3 %); grafik S&P = src/data/sp500.ts.
 * Aturan wajib 22–23 Okt: muncul = pop easeOutBack 60f, teks naik + opacity + motion blur, keluar = skala ke 0 / swipe, bentuk sama dibawa,
 * tengah dulu lalu memberi ruang, garis putus-putus trim path; warna perusahaan beragam (Simon 24 Okt, sama dengan Scene 3).
 */
const A0 = BATAS.s4;
const KATA = ['mungkin', 'kalau', 'indeks', 'sesederhana', 'bukannya', 'investasi', 'dikelola', 'profesional', 'seharusnya', 'hasil', 'bagus',
  'ada', 'warren', 'buffett', '2007', 'bertaruh', 'sepuluh', 'sederhana', 'indeks', 'sp', 'mengalahkan', 'beberapa', 'profesional',
  'periode', 'krisis', '2008', 'hasilnya', 'naik', '1258', 'sementara', 'rata-rata', '363',
  'artinya', 'profesional', 'selalu', 'mengalahkan', 'indeks',
  'karena', 'memilih', 'terus', 'mengungguli', 'pasar', 'sulit', 'bahkan', 'berpengalaman',
  'jadi', 'banyak', 'investor', 'memilih', 'indeks', 'nggak', 'serius', 'berinvestasi', 'justru', 'sederhana', 'masuk'];
const K = ['mungkin', 'kalau', 'indeksA', 'sesederhana', 'bukannya', 'investasiA', 'dikelolaA', 'proA', 'seharusnya', 'hasilA', 'bagus',
  'ada', 'warren', 'buffett', 'th2007', 'bertaruh', 'sepuluh', 'sederhanaB', 'indeksB', 'sp', 'kalahkanB', 'beberapa', 'proB',
  'periode', 'krisis', 'th2008', 'hasilnya', 'naik', 'p1258', 'sementara', 'rata', 'p363',
  'artinya', 'proE', 'selalu', 'kalahkanE', 'indeksE',
  'karena', 'memilihF', 'terus', 'mengungguli', 'pasar', 'sulit', 'bahkan', 'berpengalaman',
  'jadi', 'banyak', 'investor', 'memilihG', 'indeksG', 'nggak', 'serius', 'berinvestasi', 'justru', 'sederhanaG', 'masuk'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S04_T = T;
export const S04_AKHIR = BATAS.s5;

const FERI = JALUR_WARNA.feri;
const PRO = JALUR_WARNA.speedboat; // investasi dikelola profesional = speedboat berkapten (metafora Scene 01)
const PESAWAT = JALUR_WARNA.pesawat; // memilih saham sendiri (metafora Scene 01)
const GARIS_PRO = B.gray;
const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
/** Warren Buffett (foto Simon 23 Okt, latar transparan) — kepala terukur: puncak y 20, lebar 194 px → r = lebar / 0,61 ≈ 300 (konvensi KarakterLingkar) */
const BUFFETT: PoseKarakter = { src: 'karakter/warren_buffett.webp', w: 1024, h: 1536, cx: 519, cy: 536, r: 300 };
/** serah-terima dari Scene 03: feri selesai menyeberang */
export const S03_FERI_AKHIR = { x: 1290, y: 579, d: 140 };
/** feri di akhir Scene 04 = pilihan "Ikuti indeks" adegan 5 (diserahkan ke Scene 05) */
export const S04_FERI_AKHIR = { x: 1280, y: 650, d: 200 };

/* ── data ── */
const nilaiDi = (v: number[], g: number) => {
  const n = v.length - 1, u = Math.max(0, Math.min(1, g)) * n, i = Math.min(n - 1, Math.floor(u)), t = Math.min(1, u - i);
  return v[i] + (v[i + 1] - v[i]) * t;
};
/** persen gaya Indonesia bertanda: +125,8% · −37,0% */
const pct = (v: number) => `${v >= -0.05 ? '+' : '−'}${Math.abs(v).toFixed(1).replace('.', ',')}%`;
/** candlestick asli (IHSG, data/pasar.ts) — jendela berbeda per "saham", dinormalkan ke open pertama */
const potong = (rows: typeof S10_NAIK, a: number, b?: number) => relatif(rows.slice(a, b));
const PANEL_SAHAM: { nama: string; d: Lilin[]; pilih: boolean }[] = [
  { nama: 'Saham A', d: potong(S10_NAIK, -24), pilih: true },
  { nama: 'Saham B', d: potong(S10_TURUN, -24), pilih: false },
  { nama: 'Saham C', d: potong(S11_KRISIS, 0, 24), pilih: false },
  { nama: 'Saham D', d: potong(S02_INVESTASI, -24), pilih: true },
];
/** garis pasar (acuan putus-putus, +12 % dalam periode kartu) */
const PASAR = [1, 1.01, 1.03, 1.02, 1.04, 1.06, 1.05, 1.07, 1.09, 1.08, 1.1, 1.12];
type Hasil = 'unggul' | 'tertinggal' | null;
const SAHAM: { nama: string; d: Lilin[]; hasil: Hasil }[] = [
  { nama: 'Saham A', d: potong(S14_IHSG_6TH, -28), hasil: null },
  { nama: 'Saham B', d: potong(S11_KRISIS, 20, 48), hasil: 'unggul' }, // +24,9 % > pasar +12 %
  { nama: 'Saham C', d: potong(S05_SAHAM, -28), hasil: null },
  { nama: 'Saham D', d: potong(S15_TURUN, 0, 28), hasil: 'tertinggal' }, // −13,0 %
  { nama: 'Saham E', d: potong(S02_INVESTASI, -28), hasil: null },
  { nama: 'Saham F', d: potong(S08_PASAR, 0, 28), hasil: 'tertinggal' }, // −5,7 %
];

/* ── tata letak (koordinat dunia; kamera pemusat per keadaan) ── */
// 1–2 · kartu indeks: TENGAH dulu (x0), ke kiri (x) saat sisi profesional muncul; geometri sama dipakai adegan 2
const KI = { x0: 960, x: 480, y: 470, w: 440, h: 440 };
const UBIN = { d: 58, dx: 72, y: [248, 318] }; // keranjang 2 × 5 saham di kartu indeks
/** perusahaan beragam (Simon 24 Okt: "Brief yang sama seperti scene 3 untuk masalah warna") — palet & ikon sama dengan Scene 03 */
const RUPA: { ikon: KunciIkon; warna: string }[] = [
  { ikon: 'sektorBank', warna: B.blue }, { ikon: 'konsumsi', warna: B.turq }, { ikon: 'energi', warna: B.orange }, { ikon: 'telekomunikasi', warna: B.blueLite },
  { ikon: 'gedungBesar', warna: B.orangeLite }, { ikon: 'perusahaan', warna: B.turq },
];
const rupa = (k: number) => RUPA[(k + 2 * Math.floor(k / 5)) % RUPA.length];
// 1 · sisi profesional: orang + panel 2 × 2 candlestick
const PRO1 = { x: 1400, y: 300, D: 200 };
const PS = { x: 1400, y: 650, w: 480, h: 320, sel: { w: 220, h: 128, x: [128, 352], y: [104, 248] } };
// 2 · Buffett di antara kedua cara; chip 2 baris di bawahnya; profesional di kanan
const BUF = { x: 960, y: 388, D: 280, chip: [628, 688] };
const PRO2 = { x: 1360, y: 388, D: 240 };
// 3 · panel kalender + grafik bulanan Des 2007 – Des 2017
const PANEL = { x: 960, y: 520, w: 1560, h: 660 };
const KAL = { x: 360, y: 500, s: 1.15 };
const PLOT = { x0: 640, y0: 330, w: 1000, h: 380 };
const DOM: [number, number] = [45, 240];
const LEGENDA = { y: 262, feri: 680, pro: 1180, d: 56 };
const yV = (v: number) => yDari(v, PLOT.y0, PLOT.h, DOM[0], DOM[1]);
// 3 (hasil) · dua kartu berdampingan; tumpukan uang di tengah kartu
const KH = { w: 560, h: 520, x: [600, 1320], y: 520 };
const TUMPUK = { w: 190, lapis: 15, n0: 4, tambah: [7, 2], dasar: 478 }; // +7 lapis indeks : +2 lapis profesional ≈ 125,8 : 36,3
const HU = TUMPUK.w / RASIO_UANG;
// 4 · profesional kiri · 2 × 3 candlestick · indeks (feri) kanan mengikuti seluruh kumpulan
const PF = { orang: { x: 380, y: 480, D: 240 }, kartu: { w: 260, h: 170, x: [700, 980, 1260], y: [365, 585] }, pagar: { x0: 545, x1: 1415, y0: 258, y1: 716 } };
const FERI_F = { x: 1590, y: 487, d: 140 };
// 5 · investor + kerumunan di atas, dua pilihan di bawah; pesan di kiri/kanan investor
const INV = { x: 960, y: 300, D: 220 };
const KERUMUNAN = kipasKerumunan(INV.x, INV.y);
const OPSI = { y: 660, d: 200, x: [640, 1280] };
const PESAN = { kiri: { x: 470, y: 300 }, kanan: { x: 1450, y: [270, 340] } };

/** pil nilai berwarna (latar warna seri, teks putih) */
const PilSeri: React.FC<{ x: number; y: number; teks: string; warna: string; p: number }> = ({ x, y, teks, warna, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${skalaPop(p)})`, transformOrigin: 'center', background: warna,
    color: B.white, fontFamily: F, fontSize: 30, fontWeight: 800, padding: '9px 20px', borderRadius: 999, whiteSpace: 'nowrap', lineHeight: 1,
    boxShadow: bayanganKecil(warna), fontVariantNumeric: 'tabular-nums' }}>{teks}</div>);

/** lingkaran teks ("?") */
const BulatTeks: React.FC<{ x: number; y: number; d: number; p: number; teks: string; warna: string }> = ({ x, y, d, p, teks, warna }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
    color: warna, display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: d * 0.56, lineHeight: 1, transformOrigin: 'center',
    transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, boxShadow: bayanganKecil(warna) }}>{teks}</div>);

/** saham di keranjang indeks (gaya ubin Scene 03) */
const Ubin: React.FC<{ x: number; y: number; d: number; p: number; warna: string; ikon: KunciIkon }> = ({ x, y, d, p, warna, ikon }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`,
    boxSizing: 'border-box', display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`,
    boxShadow: bayanganKecil(warna) }}>
    <Icon name={ikon} size={d * 0.5} color={warna} />
  </div>);

/** grafik candlestick mini + garis pasar putus-putus (kartu saham) */
const LilinMini: React.FC<{ d: Lilin[]; w: number; h: number; g: number; pasar?: number }> = ({ d, w, h, g, pasar = 0 }) => {
  const dom = rentang(d, 0.08, [1, PASAR[PASAR.length - 1]]);
  return (
    <>
      <GrafikLilin d={d} w={w} h={h} g={g} dom={dom} modal={false} titik={false} grid pasar />
      {pasar > 0 ? (
        <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <polyline points={garis(PASAR, 0, 0, w, h, dom[0], dom[1], pasar)} fill="none" stroke={rgba(B.night, 0.45)} strokeWidth={2.5} strokeDasharray="7 7" strokeLinecap="round" />
        </svg>) : null}
    </>);
};

const teksTengah = (top: number, size: number, warna = B.night): React.CSSProperties =>
  ({ position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: F, fontSize: size, fontWeight: 800, color: warna, whiteSpace: 'nowrap', lineHeight: 1.15 });

/* ═════════ geometri lintas papan (bentuk sama dibawa; 1 → 2 dibelah) ═════════ */
const GEO_I: GeoKartu = { x: KI.x, y: KI.y, w: KI.w, h: KI.h, warna: FERI, tab: 'atas' };
const GEO_PANEL: GeoKartu = { x: PANEL.x, y: PANEL.y, w: PANEL.w, h: PANEL.h, warna: FERI, tab: 'atas' };
const GEO_KH = (i: number): GeoKartu => ({ x: KH.x[i], y: KH.y, w: KH.w, h: KH.h, warna: i === 0 ? FERI : PRO, tab: 'atas' });
const IKON_KH = (i: number) => ({ x: KH.x[i] - KH.w / 2 + 70, y: KH.y - KH.h / 2 + 70, d: 76 });

export const Scene04: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f > S04_AKHIR + 90) return null;

  /* ═ progres papan ═ */
  const serah = cin(f, A0 + 30); // feri Scene 03 → tengah kartu indeks (sebelum kartunya pop)
  const ruangI = cin(f, T.dikelolaA); // kartu indeks: tengah → kiri BERSAMAAN pop profesional
  const keB = cin(f, T.ada); // 1 → 2
  const keC = cin(f, T.periode); // 2 → 3: kartu indeks BERUBAH jadi panel grafik
  const belah = cin(f, T.naik); // grafik berhenti → panel TERBELAH jadi dua kartu hasil
  const keF = cin(f, T.artinya); // 3 → 4
  const keG = cin(f, T.jadi); // 4 → 5
  const keluarG = cin(f, S04_AKHIR + 30); // papan 5 didorong ke atas; feri diserahkan Scene 05

  /* ═ feri yang dibawa ═ */
  const kiX = lerp(KI.x0, KI.x, ruangI);
  const naikFeri = cin(f, T.indeksA); // feri di tengah kartu dulu → naik ke tempat ikonnya saat kartu pop
  const feriI = { x: kiX, y: lerp(KI.y, KI.y - KI.h / 2 + 95, naikFeri), d: 120 };
  const feri = (() => {
    const a = { x: lerp(S03_FERI_AKHIR.x, feriI.x, serah), y: lerp(S03_FERI_AKHIR.y, feriI.y, serah), d: lerp(S03_FERI_AKHIR.d, feriI.d, serah) };
    const st = [{ x: LEGENDA.feri, y: LEGENDA.y, d: LEGENDA.d }, IKON_KH(0), FERI_F, { x: OPSI.x[1], y: OPSI.y, d: OPSI.d }];
    const t = [keC, belah, keF, cin(f, T.memilihG)];
    return st.reduce((p, q, k) => ({ x: lerp(p.x, q.x, t[k]), y: lerp(p.y, q.y, t[k]), d: lerp(p.d, q.d, t[k]) }), a);
  })();
  const speed = { x: lerp(LEGENDA.pro, IKON_KH(1).x, belah), y: lerp(LEGENDA.y, IKON_KH(1).y, belah), d: lerp(LEGENDA.d, IKON_KH(1).d, belah) };
  const pro = { x: lerp(PRO1.x, PRO2.x, keB), y: lerp(PRO1.y, PRO2.y, keB), D: lerp(PRO1.D, PRO2.D, keB) };

  /* ═ 3: kalender & grafik — halaman 0 = akhir 2007, 1 = 2008 (krisis), 10 = 2017; grafik bulanan digambar SEIRING kalender, lalu BERHENTI ═ */
  const halaman = [{ atas: 'AKHIR', angka: '2007' }, ...Array.from({ length: 10 }, (_, k) => ({ atas: 'TAHUN', angka: String(2008 + k) }))];
  const iKal = cin(f, T.th2008 - 10) + 9 * laju(f, T.th2008 + 20, T.naik - 5);
  const g = iKal / 10;
  const ubahIdx = nilaiDi(SP500_TR, g) - 100, ubahPro = nilaiDi(RATA_DANA, g) - 100;

  /* ── isi kartu ── */
  // 1–2: kartu indeks — "Indeks", keranjang 2 × 5 saham BERAGAM, chip; "S&P 500" di katanya (adegan 2)
  const isiI = (
    <>
      <div style={teksTengah(158, 36)}><WordText f={f} at={T.indeksA} halus>Indeks</WordText></div>
      {Array.from({ length: 10 }, (_, k) => (
        <Ubin key={k} x={KI.w / 2 + ((k % 5) - 2) * UBIN.dx} y={UBIN.y[Math.floor(k / 5)]} d={UBIN.d} warna={rupa(k).warna} ikon={rupa(k).ikon}
          p={popIn(f, T.sesederhana + Math.floor(k / 5) * 20)} />))}
      <Chip x={KI.w / 2} y={392} teks="Banyak saham sekaligus" warna={FERI} p={popIn(f, T.sesederhana + 40)} size={24} />
      <Chip x={KI.w - 78} y={48} teks="S&P 500" warna={FERI} p={popIn(f, T.sp)} size={22} />
    </>);
  // 1: panel 2 × 2 candlestick — profesional memeriksa grafik & memilih (centang "Beli")
  const isiPS = (
    <>
      {PANEL_SAHAM.map((s, i) => {
        const cx = PS.sel.x[i % 2], cy = PS.sel.y[Math.floor(i / 2)];
        const gs = laju(f, T.proA + 20 + i * 10, T.seharusnya + 20);
        return (
          <div key={s.nama} style={{ position: 'absolute', left: cx - PS.sel.w / 2, top: cy - PS.sel.h / 2, width: PS.sel.w, height: PS.sel.h }}>
            <div style={{ position: 'absolute', left: 0, top: -6, fontFamily: F, fontSize: 20, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
              <WordText f={f} at={T.proA + 20 + i * 10} halus>{s.nama}</WordText>
            </div>
            <div style={{ position: 'absolute', left: 0, top: 30, width: PS.sel.w, height: PS.sel.h - 34 }}>
              {gs > 0 ? <LilinMini d={s.d} w={PS.sel.w} h={PS.sel.h - 34} g={gs} /> : null}
            </div>
          </div>);
      })}
    </>);
  // 3: panel kalender + grafik (koordinat layar digeser ke dalam panel); sumbu & nilai berjalan dalam PERSEN perubahan dari modal awal
  const ox = PANEL.x - PANEL.w / 2, oy = PANEL.y - PANEL.h / 2;
  const isiPanel = (
    <>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`translate(${-ox} ${-oy})`}>
          {/* krisis 2008: pita merah di kolom 2008 */}
          <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.w / 10} height={PLOT.h} fill={rgba(ARAH.turun, 0.12 * cin(f, T.krisis))} />
          {[50, 100, 150, 200].map((v, k) => (
            <line key={v} x1={PLOT.x0} x2={PLOT.x0 + PLOT.w * cin(f, T.periode + 30 + k * 6)} y1={yV(v)} y2={yV(v)} stroke={rgba(B.gray, v === 100 ? 0.45 : 0.2)} strokeWidth={v === 100 ? 2 : 1.5} />))}
          {[{ v: RATA_DANA, w: GARIS_PRO }, { v: SP500_TR, w: FERI }].map((s, k) => g > 0 ? (
            <g key={k}>
              <polyline points={garis(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], g)} fill="none" stroke={s.w} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
              {(() => { const [hx, hy] = ujungGaris(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], g); return <circle cx={hx} cy={hy} r={10 * skalaPop(popIn(f, T.th2008 + 20))} fill={B.white} stroke={s.w} strokeWidth={5} />; })()}
            </g>) : null)}
        </g>
      </svg>
      {[50, 100, 150, 200].map((v, k) => (
        <div key={v} style={{ position: 'absolute', right: PANEL.w - (PLOT.x0 - ox - 16), top: yV(v) - oy - 15, fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
          <WordText f={f} at={T.periode + 30 + k * 6} halus>{v === 100 ? '0%' : pct(v - 100).replace(',0', '')}</WordText>
        </div>))}
      {['2008', '2017'].map((t, k) => (
        <div key={t} style={{ position: 'absolute', left: PLOT.x0 - ox + (k === 0 ? 0.5 : 9.5) * (PLOT.w / 10) - 40, width: 80, top: PLOT.y0 + PLOT.h - oy + 12,
          textAlign: 'center', fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>
          <WordText f={f} at={k === 0 ? T.th2008 : T.naik - 20} halus>{t}</WordText>
        </div>))}
      <div style={{ position: 'absolute', left: LEGENDA.feri + 44 - ox, top: LEGENDA.y - 22 - oy, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
        <WordText f={f} at={T.periode + 40} halus>Indeks S&P 500</WordText>
      </div>
      <div style={{ position: 'absolute', left: LEGENDA.pro + 44 - ox, top: LEGENDA.y - 22 - oy, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
        <WordText f={f} at={T.periode + 56} halus>Dikelola profesional</WordText>
      </div>
    </>);
  // 3 (hasil): tumpukan uang awal sama (n0 lapis), bertambah lapis demi lapis; angka keuntungan DI ATAS tumpukan
  const isiHasil = (i: number) => {
    const indeks = i === 0;
    const at = indeks ? T.p1258 : T.p363, tambah = TUMPUK.tambah[i];
    const cx = KH.w / 2;
    const pAwal = popIn(f, T.naik + 20);
    const lapis = Array.from({ length: TUMPUK.n0 + tambah }, (_, k) => {
      const pusat = at + (k - TUMPUK.n0 - (tambah - 1) / 2) * 8; // lapis tambahan pop bergiliran, berpusat di kata angkanya
      return k < TUMPUK.n0 ? pAwal : popIn(f, pusat);
    });
    const n = TUMPUK.n0 + lapis.slice(TUMPUK.n0).reduce((s, p) => s + io(Math.max(0, Math.min(1, p))), 0); // tinggi kontinu (tanpa loncat per lapis)
    const atas = TUMPUK.dasar - HU - (n - 1) * TUMPUK.lapis;
    const awalY = TUMPUK.dasar - HU - (TUMPUK.n0 - 1) * TUMPUK.lapis;
    return (<>
      <div style={{ position: 'absolute', left: 130, top: 44, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.naik + 10} halus>{indeks ? 'Indeks S&P 500' : 'Dikelola profesional'}</WordText>
      </div>
      {!indeks ? <div style={{ position: 'absolute', left: 130, top: 88, fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.rata} halus>Rata-rata 5 dana</WordText></div> : null}
      {/* garis putus-putus = tinggi tumpukan AWAL (modal sama di kedua kartu) */}
      <svg width={KH.w} height={KH.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={40} x2={40 + (KH.w - 80) * cin(f, T.naik + 40)} y1={awalY} y2={awalY} stroke={rgba(B.gray, 0.55)} strokeWidth={3} strokeDasharray="10 10" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', right: 40, top: awalY - 34, fontFamily: F, fontSize: 22, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.naik + 40} halus>Modal awal</WordText>
      </div>
      {lapis.map((p, k) => <Uang key={k} x={cx} y={TUMPUK.dasar - HU / 2 - k * TUMPUK.lapis} w={TUMPUK.w} p={p} />)}
      <Chip x={cx} y={atas - 30} teks={indeks ? '+125,8%' : 'Rata-rata +36,3%'} warna={ARAH.naik} p={popIn(f, at - 20)} size={30} />
    </>);
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ 1–2: kartu indeks (tengah → kiri) → 3: BERUBAH jadi panel grafik ══ */}
      {keC < 1 ? (
        keC <= 0 ? <Kaca x={kiX} y={KI.y} w={KI.w} h={KI.h} p={popIn(f, T.indeksA)} warna={FERI} tab="atas">{isiI}</Kaca>
          : <KacaMorf a={GEO_I} b={GEO_PANEL} t={keC} isiA={isiI} isiB={isiPanel} />) : null}
      {keC >= 1 && belah <= 0 ? <Kaca x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={1} warna={FERI} tab="atas">{isiPanel}</Kaca> : null}
      {/* grafik BERHENTI → panel TERBELAH jadi dua kartu hasil; di "artinya" kedua kartu MENGECIL di tempat */}
      {belah > 0 && belah < 1 ? [0, 1].map((i) => (
        <KacaMorf key={i} a={GEO_PANEL} b={GEO_KH(i)} t={belah} isiA={i === 0 ? isiPanel : undefined} isiB={isiHasil(i)} peran={i === 1 ? 'belah' : undefined} />)) : null}
      {belah >= 1 && keF < 1 ? [0, 1].map((i) => (
        <Kaca key={i} x={KH.x[i]} y={KH.y} w={KH.w} h={KH.h} p={popOut(f, T.artinya - 10)} warna={i === 0 ? FERI : PRO} tab="atas">{isiHasil(i)}</Kaca>)) : null}

      {/* ══ 3: kalender (akhir 2007 → 2017), krisis 2008, perubahan nilai berjalan di legenda ══ */}
      {keC > 0 && belah < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: belah > 0 ? 1 - belah : undefined }}>
          <Kalender x={KAL.x} y={KAL.y} halaman={halaman} i={iKal} p={skalaPop(popIn(f, T.periode + 30))} s={KAL.s} warna={B.blue} />
          <Chip x={PLOT.x0 + PLOT.w / 20 + 30} y={PLOT.y0 + 26} teks="Krisis 2008" ikon="pasarTurun" warna={ARAH.turun} p={popIn(f, T.th2008)} size={24} />
          <PilSeri x={LEGENDA.feri + 360} y={LEGENDA.y} teks={pct(ubahIdx)} warna={FERI} p={popIn(f, T.periode + 50)} />
          <PilSeri x={LEGENDA.pro + 460} y={LEGENDA.y} teks={pct(ubahPro)} warna={GARIS_PRO} p={popIn(f, T.periode + 66)} />
        </div>) : null}

      {/* ══ 1: panel candlestick — profesional memeriksa grafik saham & mencentang beberapa untuk dibeli ══ */}
      {keB < 1 ? (
        <>
          <Kaca x={PS.x} y={PS.y} w={PS.w} h={PS.h} p={popIn(f, T.proA + 10) * popOut(f, T.ada)} warna={B.blue} tab="atas" tabTebal={10}>{isiPS}</Kaca>
          {PANEL_SAHAM.map((s, i) => s.pilih ? (
            <Chip key={i} x={PS.x - PS.w / 2 + PS.sel.x[i % 2] - PS.sel.w / 2 + 150} y={PS.y - PS.h / 2 + PS.sel.y[Math.floor(i / 2)] - PS.sel.h / 2 + 8} teks="Beli" ikon="tersedia" warna={CEK}
              p={popIn(f, T.seharusnya + (i === 0 ? 0 : 30)) * popOut(f, T.ada)} size={20} />) : null)}
        </>) : null}

      {/* ══ 2: Warren Buffett membandingkan kedua cara — modal sama, 10 tahun (akhir 2007 – akhir 2017) ══ */}
      {f > T.warren - 30 && keC < 1 ? (
        <>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${BUF.x - BUF.D / 2 - 14} ${BUF.y} L ${KI.x + KI.w / 2 + 14} ${BUF.y}`} g={cin(f, T.indeksB) * (1 - keC)} warna={FERI} tebal={4} titik={false} pola="putus" />
            <Penghubung d={`M ${BUF.x + BUF.D / 2 + 14} ${BUF.y} L ${PRO2.x - PRO2.D / 2 - 14} ${BUF.y}`} g={cin(f, T.kalahkanB) * (1 - keC)} warna={GARIS_PRO} tebal={4} titik={false} pola="putus" />
          </svg>
          <KarakterLingkar pose={BUFFETT} x={BUF.x} y={BUF.y} D={BUF.D} s={popIn(f, T.warren) * popOut(f, T.periode)} warna={B.blue} />
          <Lencana x={BUF.x} y={BUF.y} d={BUF.D} p={popIn(f, T.bertaruh) * popOut(f, T.periode)} warna={B.orange} ikon="trofi" besar={76} />
          <Label x={BUF.x} y={BUF.y + BUF.D / 2 + 40} teks="Warren Buffett" f={f} at={T.buffett + 10} keluar={T.periode} size={36} lebar={420} />
          <Chip x={BUF.x} y={BUF.chip[0]} teks="Akhir 2007 – akhir 2017" ikon="kalender" warna={B.blue} p={popIn(f, T.th2007) * popOut(f, T.periode)} size={26} />
          <Chip x={BUF.x - 110} y={BUF.chip[1]} teks="Modal sama" ikon="dompet" warna={B.blue} p={popIn(f, T.bertaruh + 20) * popOut(f, T.periode)} size={26} />
          <Chip x={BUF.x + 115} y={BUF.chip[1]} teks="10 tahun" ikon="waktu" warna={B.blue} p={popIn(f, T.sepuluh) * popOut(f, T.periode)} size={26} />
        </>) : null}

      {/* profesional: kanan atas (1) → baris Buffett (2) → pop keluar di "periode" (3) */}
      {keC < 1 ? (
        <>
          <KarakterLingkar pose={INVESTOR_NAVY} x={pro.x} y={pro.y} D={pro.D} s={popIn(f, T.dikelolaA) * popOut(f, T.periode)} warna={B.blue} />
          <Label x={pro.x} y={pro.y + pro.D / 2 + 40} teks="Profesional" f={f} at={T.proA} keluar={T.periode} size={32} lebar={340} />
          {/* panel candlestick keluar di "Ada…": perannya dibawa chip "Aktif memilih saham" */}
          <Chip x={pro.x} y={pro.y + pro.D / 2 + 102} teks="Aktif memilih saham" ikon="saham" warna={B.blue} p={popIn(f, T.ada + 20) * popOut(f, T.periode)} size={24} />
        </>) : null}

      {/* ══ 4: profesional memilih beberapa dari kumpulan saham (candlestick asli) — sebagian bagus, sebagian tertinggal pasar; indeks ikut semua ══ */}
      {keF > 0 && keG < 1 ? (
        <>
          <KarakterLingkar pose={INVESTOR_NAVY} x={PF.orang.x} y={PF.orang.y} D={PF.orang.D} s={popIn(f, T.proE) * popOut(f, T.jadi)} warna={B.blue} />
          <PilSeri x={PF.orang.x} y={PF.orang.y + PF.orang.D / 2 + 36} teks="Sulit" warna={B.orange} p={popIn(f, T.sulit) * popOut(f, T.jadi)} />
          <Chip x={PF.orang.x} y={PF.orang.y + PF.orang.D / 2 + 86} teks="Berpengalaman" ikon="kapten" warna={B.blue} p={popIn(f, T.berpengalaman) * popOut(f, T.jadi)} size={26} />
          {SAHAM.map((s, i) => {
            const kol = i % 3, bar = Math.floor(i / 3);
            const kx = PF.kartu.x[kol], ky = PF.kartu.y[bar], kw = PF.kartu.w, kh = PF.kartu.h;
            const gs = laju(f, T.artinya + 70 + kol * 12 + bar * 20, T.mengungguli), gp = cin(f, T.artinya + 70 + bar * 20);
            const j = SAHAM.filter((x) => x.hasil).indexOf(s);
            const pilih = s.hasil ? popIn(f, T.memilihF + j * 20) : 0;
            const hasil = s.hasil ? popIn(f, T.mengungguli + 20 + j * 14) : 0;
            const warna = s.hasil === 'unggul' ? ARAH.naik : s.hasil === 'tertinggal' ? ARAH.turun : B.gray;
            return (
              <React.Fragment key={s.nama}>
                <Kaca x={kx} y={ky} w={kw} h={kh} p={popIn(f, T.artinya + 40 + bar * 20) * popOut(f, T.jadi)} warna={B.gray} tab="atas" tabTebal={10}>
                  <div style={{ position: 'absolute', left: 20, top: 20, fontFamily: F, fontSize: 22, fontWeight: 800, color: B.night }}>
                    <WordText f={f} at={T.artinya + 50 + bar * 20} halus>{s.nama}</WordText>
                  </div>
                  <div style={{ position: 'absolute', left: 20, top: 58, width: kw - 40, height: 92 }}>
                    {gs > 0 ? <LilinMini d={s.d} w={kw - 40} h={92} g={gs} pasar={gp} /> : null}
                  </div>
                </Kaca>
                {s.hasil ? (
                  <>
                    <Lencana x={kx + kw / 2 - 30} y={ky - kh / 2 + 30} d={0} p={pilih * popOut(f, T.jadi)} warna={B.blue} ikon="tersedia" besar={44} />
                    <Chip x={kx} y={ky + kh / 2 + 4} teks={s.hasil === 'unggul' ? '▲ Mengungguli pasar' : 'Tertinggal pasar'} warna={warna} p={hasil * popOut(f, T.jadi)} size={20} />
                  </>) : null}
              </React.Fragment>);
          })}
          {/* indeks: pagar putus-putus mengelilingi SELURUH kumpulan saham, tersambung ke feri */}
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${PF.pagar.x1} ${FERI_F.y} L ${PF.pagar.x1} ${PF.pagar.y0 + 36} Q ${PF.pagar.x1} ${PF.pagar.y0} ${PF.pagar.x1 - 36} ${PF.pagar.y0} L ${PF.pagar.x0 + 36} ${PF.pagar.y0} Q ${PF.pagar.x0} ${PF.pagar.y0} ${PF.pagar.x0} ${PF.pagar.y0 + 36} L ${PF.pagar.x0} ${PF.pagar.y1 - 36} Q ${PF.pagar.x0} ${PF.pagar.y1} ${PF.pagar.x0 + 36} ${PF.pagar.y1} L ${PF.pagar.x1 - 36} ${PF.pagar.y1} Q ${PF.pagar.x1} ${PF.pagar.y1} ${PF.pagar.x1} ${PF.pagar.y1 - 36} L ${PF.pagar.x1} ${FERI_F.y}`}
              g={cin(f, T.pasar) * (1 - keG)} warna={FERI} tebal={4} titik={false} pola="putus" />
            <Penghubung d={`M ${PF.pagar.x1} ${FERI_F.y} L ${FERI_F.x - FERI_F.d / 2 - 12} ${FERI_F.y}`} g={cin(f, T.pasar - 20) * (1 - keG)} warna={FERI} tebal={4} titik={false} pola="putus" />
          </svg>
          <Label x={FERI_F.x} y={FERI_F.y + FERI_F.d / 2 + 40} teks="Indeks" f={f} at={T.artinya + 40} keluar={T.jadi} size={32} lebar={300} />
          <Chip x={FERI_F.x} y={FERI_F.y + FERI_F.d / 2 + 100} teks="Semua saham" warna={FERI} p={popIn(f, T.pasar) * popOut(f, T.jadi)} size={24} />
        </>) : null}

      {/* ══ 5: investor (+ kerumunan ikon orang = "banyak investor") menimbang dua pilihan → memilih indeks; pesan: sederhana ≠ tidak serius ══ */}
      {f > T.jadi - 30 ? (() => {
        const pilihI = cin(f, T.berinvestasi);
        const redupKiri = 1 - 0.55 * pilihI;
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - keluarG, true) }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {OPSI.x.map((x, k) => (
                <Penghubung key={k} d={`M ${INV.x} ${INV.y + INV.D / 2 + 18} C ${INV.x} ${INV.y + INV.D / 2 + 110} ${x} ${OPSI.y - OPSI.d / 2 - 70} ${x} ${OPSI.y - OPSI.d / 2 - 12}`}
                  g={cin(f, T.memilihG - 20 + k * 20)} warna={k === 0 ? PESAWAT : FERI} tebal={4} titik={false} pola="putus" />))}
              <Penghubung d={`M ${INV.x} ${INV.y + INV.D / 2 + 18} C ${INV.x} ${INV.y + INV.D / 2 + 110} ${OPSI.x[1]} ${OPSI.y - OPSI.d / 2 - 70} ${OPSI.x[1]} ${OPSI.y - OPSI.d / 2 - 12}`}
                g={pilihI} warna={FERI} tebal={6} dash={false} titik={false} />
            </svg>
            {/* "banyak investor" = kipas ikon orang (pola Scene 01 "kebanyakan orang"), bukan teks (Simon 24 Okt) */}
            {KERUMUNAN.map((o, i) => <Bulat key={i} x={o.x} y={o.y} d={o.d} warna={B.orangeLite} ikon="orangLain" p={popIn(f, T.banyak + 10 + o.urut * 12)} />)}
            <KarakterLingkar pose={MURID_BIRU} x={INV.x} y={INV.y} D={INV.D} s={popIn(f, T.banyak)} warna={B.orange} />
            <BulatTeks x={INV.x + INV.D * 0.38} y={INV.y + INV.D * 0.3} d={56} p={popIn(f, T.investor + 20) * popOut(f, T.berinvestasi)} teks="?" warna={B.blue} />
            {/* pilihan kiri: memilih saham satu per satu (pesawat, metafora Scene 01) — meredup saat indeks dipilih */}
            <div style={{ position: 'absolute', inset: 0, opacity: redupKiri < 0.9999 ? redupKiri : undefined }}>
              <Kendaraan x={OPSI.x[0]} y={OPSI.y} d={OPSI.d} warna={PESAWAT} ikon="pesawat" cermin={false} p={popIn(f, T.memilihG - 20)} />
              <Label x={OPSI.x[0]} y={OPSI.y + OPSI.d / 2 + 40} teks="Pilih saham satu per satu" f={f} at={T.memilihG} size={30} lebar={460} />
              <Chip x={OPSI.x[0]} y={OPSI.y + OPSI.d / 2 + 100} teks="Coba kalahkan pasar" warna={PESAWAT} p={popIn(f, T.memilihG + 30)} size={24} />
            </div>
            {/* pilihan kanan: ikuti indeks (feri yang DIBAWA dari adegan 4, digambar di luar papan) */}
            <Label x={OPSI.x[1]} y={OPSI.y + OPSI.d / 2 + 40} teks="Ikuti indeks" f={f} at={T.indeksG} size={30} lebar={360} />
            <Chip x={OPSI.x[1]} y={OPSI.y + OPSI.d / 2 + 100} teks="Ikut seluruh pasar" warna={FERI} p={popIn(f, T.indeksG + 30)} size={24} />
            {/* pesan akhir: "investasi sederhana bukan berarti tidak serius" — keraguan dicoret (kiri), sederhana & masuk akal (kanan) */}
            <Chip x={PESAN.kiri.x} y={PESAN.kiri.y} teks="Tidak serius?" warna={B.gray} p={popIn(f, T.nggak)} coret={R(f, T.serius + 10, T.serius + 70, 0, 1, io)} size={26} />
            <Chip x={PESAN.kanan.x} y={PESAN.kanan.y[0]} teks="Sederhana" ikon="rasional" warna={CEK} p={popIn(f, T.sederhanaG)} size={26} />
            <Chip x={PESAN.kanan.x} y={PESAN.kanan.y[1]} teks="Masuk akal" ikon="tersedia" warna={CEK} p={popIn(f, T.masuk)} size={26} />
          </div>);
      })() : null}

      {/* ══ feri DIBAWA: Scene 03 → kartu indeks (1–2) → legenda (3) → kartu hasil → indeks adegan 4 → pilihan "Ikuti indeks" (5) → Scene 05 ══ */}
      {f < S04_AKHIR ? <Kendaraan x={feri.x} y={feri.y} d={feri.d} warna={FERI} ikon="feri" cermin p={1} /> : null}
      {keC > 0 && keF < 1 ? <Kendaraan x={speed.x} y={speed.y} d={speed.d} warna={PRO} ikon="speedboat" cermin p={popIn(f, T.periode + 40) * popOut(f, T.artinya - 10)} /> : null}
      {/* centang pilihan indeks DI ATAS feri (dulu di bawahnya — lapisan salah & tampak berpindah ke bawah feri saat papan didorong keluar); pop keluar sebelum papan pergi */}
      {f > T.berinvestasi - 30 ? <Lencana x={OPSI.x[1]} y={OPSI.y} d={OPSI.d} p={popIn(f, T.berinvestasi) * popOut(f, S04_AKHIR - 10)} warna={CEK} ikon="tersedia" besar={60} /> : null}
    </AbsoluteFill>);
};
