import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, bayanganKecil, CEK, F, io, R, rgba, SISI } from '../theme';
import { cin, gayaPapan, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { Chevron, GeoKartu, INVESTOR_NAVY, Kaca, KacaMorf, KarakterLingkar, ORANG_SAKU, Penghubung, PoseKarakter } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { Kalender, Uang } from '../parts/nyata';
import { garis, kumulatif, ujungGaris, yDari } from '../parts/grafik';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { S03_ORANG_AKHIR } from '../s03/Scene03';

/**
 * SCENE 04 — Indeks vs Investasi Profesional (BATAS.s4 – BATAS.s5). IDE BARU SIMON 23 Okt (7 adegan), naskah & VO tetap:
 *  1 Pertanyaan: dua orang memilih jalur berbeda — orang 1 → indeks (feri dari Scene 03), orang 2 → menyerahkan uang ke PROFESIONAL yang aktif
 *    memilih saham; keduanya ingin hasil terbaik ("Hasil terbaik?").
 *  2 Taruhan Warren Buffett: Buffett muncul DI ANTARA kedua pilihan, menantang profesional — akhir 2007 · 10 tahun.
 *  3 Periode 10 tahun: kalender bergerak akhir 2007 → 2017; krisis 2008 — harga jatuh, kedua investasi ikut turun.
 *  4 Hasil: modal sama $100 → indeks $225,80 · profesional $136,30 (surat Berkshire Hathaway 2017: indeks S&P 500 +125,8 % kumulatif 2008–2017,
 *    lima dana profesional +21,7 / 42,3 / 87,7 / 2,8 / 27,0 % → rata-rata +36,3 %).
 *  5 Profesional tidak selalu menang: profesional membandingkan — indeks lebih tinggi; keahlian tidak menjamin (tanpa menggambarkannya buruk).
 *  6 Sulit mengalahkan pasar: beberapa grafik saham; profesional memilih, sebagian turun / tertinggal pasar.
 *  7 Indeks pilihan serius: investor awam ragu ("Nggak serius?") → memilih indeks, tetap pada rencana, tak perlu menebak pemenang → sederhana,
 *    masuk akal. Feri diserahkan ke Scene 05.
 * Figur: investor = kemeja biru (bukan jas); profesional = jas navy TANPA nametag (jas + nametag = guru). Aturan wajib 22–23 Okt: muncul = pop
 * easeOutBack 60f, teks naik + opacity + motion blur, keluar = swipe keluar frame / skala ke 0, bentuk sama dibawa, garis trim path.
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
const GARIS_PRO = B.gray;
const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
/** Warren Buffett (foto Simon 23 Okt, latar transparan) — kepala terukur: puncak y 20, lebar 194 px → r = lebar / 0,61 ≈ 300 (konvensi KarakterLingkar) */
const BUFFETT: PoseKarakter = { src: 'karakter/warren_buffett.webp', w: 1024, h: 1536, cx: 519, cy: 536, r: 300 };
/** serah-terima dari Scene 03: feri selesai menyeberang */
export const S03_FERI_AKHIR = { x: 1290, y: 579, d: 140 };
/** feri di akhir Scene 04 (diserahkan ke Scene 05) */
export const S04_FERI_AKHIR = { x: 990, y: 490, d: 200 };

/* ── data taruhan (surat Berkshire Hathaway 2017, imbal hasil tahunan %; kumulatif = 125,8 % · A 21,7 · B 42,3 · C 87,7 · D 2,8 · E 27,0) ── */
const IDX = kumulatif([-37.0, 26.6, 15.1, 2.1, 16.0, 32.3, 13.6, 1.4, 11.9, 21.8]);
const DANA = [
  kumulatif([-16.5, 11.3, 5.9, -6.3, 3.4, 10.5, 4.7, 1.6, -3.2, 12.2]),
  kumulatif([-22.3, 14.5, 6.8, -1.3, 9.6, 15.2, 4.0, 2.5, 1.9, 10.6]),
  kumulatif([-21.3, 21.4, 13.3, 5.9, 5.7, 8.8, 18.9, 5.4, -1.7, 15.6]),
  kumulatif([-29.3, 16.5, 4.9, -6.3, 6.2, 14.2, 0.7, 1.4, 2.5, 0]), // D: 2017 "N/A" (dana ditutup) → nilai akhir tetap +2,8 %
  kumulatif([-30.1, 16.8, 11.9, -2.8, 9.1, 14.4, -2.1, -5.0, 4.4, 18.0]),
];
const RATA = IDX.map((_, i) => DANA.reduce((s, d) => s + d[i], 0) / DANA.length); // akhir 136,3 = +36,3 %
const nilaiDi = (v: number[], g: number) => {
  const n = v.length - 1, u = Math.max(0, Math.min(1, g)) * n, i = Math.min(n - 1, Math.floor(u)), t = Math.min(1, u - i);
  return v[i] + (v[i + 1] - v[i]) * t;
};
/** dolar gaya Indonesia: $225,80 */
const usd = (v: number) => `$${v.toFixed(2).replace('.', ',')}`;
/** grafik saham mini (adegan 6): pasar + empat saham pilihan profesional (ilustrasi) */
const PASAR = [100, 101, 103, 102, 104, 106, 105, 107, 109, 108, 110, 112];
const SAHAM: { nama: string; v: number[]; hasil: 'unggul' | 'turun' | 'tertinggal' }[] = [
  { nama: 'Saham A', v: [100, 102, 105, 104, 108, 111, 110, 114, 117, 116, 120, 124], hasil: 'unggul' },
  { nama: 'Saham B', v: [100, 103, 101, 99, 96, 97, 94, 92, 93, 90, 88, 86], hasil: 'turun' },
  { nama: 'Saham C', v: [100, 100, 101, 100, 101, 102, 101, 102, 103, 102, 103, 104], hasil: 'tertinggal' },
  { nama: 'Saham D', v: [100, 98, 99, 96, 97, 94, 95, 92, 90, 91, 89, 87], hasil: 'turun' },
];

/* ── tata letak ── */
// 1 · dua baris: orang → pilihan; keduanya menuju "Hasil terbaik?"
const RA = { y: [300, 640], orang: { x: 330, D: 200 }, chev: 520, kartu: { x: 880, w: 540, h: 170 }, pro: { x: 880, D: 200 }, tujuan: { x: 1500, y: 470, d: 170 } };
// 2 · dua pilihan di kiri & kanan, Buffett di tengah
const RB = { kartu: { x: 430, y: 470, w: 420, h: 340 }, buffett: { x: 960, y: 450, D: 280 }, pro: { x: 1490, y: 450, D: 250 }, chipY: 690, vs: { x: 1222, d: 92 } };
// 3 · panel kalender + grafik 2008–2017
const PANEL = { x: 960, y: 520, w: 1560, h: 660 };
const KAL = { x: 360, y: 500, s: 1.15 };
const PLOT = { x0: 640, y0: 330, w: 1000, h: 380 };
const DOM: [number, number] = [50, 240];
const LEGENDA = { y: 262, feri: 680, pro: 1180, d: 56 };
const yV = (v: number) => yDari(v, PLOT.y0, PLOT.h, DOM[0], DOM[1]);
// 4–5 · dua kartu hasil ($100 → …); di 5 bergeser kiri memberi ruang profesional
const KH = { w: 560, h: 520, x: [600, 1320], xE: [430, 1010], y: 520 };
const BATANG = { x: 140, w: 110, dasar: 470, skala: 1.35 }; // tinggi batang = nilai × 1,35 px ($100 → 135 px, $225,80 → 305 px)
const PE = { orang: { x: 1560, y: 470, D: 250 } };
// 6 · profesional di kiri + 2×2 grafik saham
const PF = { orang: { x: 420, y: 470, D: 260 }, kartu: { w: 380, h: 230, x: [920, 1330], y: [350, 620] } };
// 7 · investor awam → feri (indeks) · chip kanan
const PG = { orang: { x: 480, y: 480, D: 270 }, chev: 735, feri: S04_FERI_AKHIR, chip: { x: 1500, y: [330, 430, 530, 630], w: 560 } };

/** pil nilai berwarna (latar warna seri, teks putih) */
const PilSeri: React.FC<{ x: number; y: number; teks: string; warna: string; p: number }> = ({ x, y, teks, warna, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${skalaPop(p)})`, transformOrigin: 'center', background: warna,
    color: B.white, fontFamily: F, fontSize: 30, fontWeight: 800, padding: '9px 20px', borderRadius: 999, whiteSpace: 'nowrap', lineHeight: 1,
    boxShadow: bayanganKecil(warna), fontVariantNumeric: 'tabular-nums' }}>{teks}</div>);

/** lingkaran teks (bukan ikon: "?" / "VS") */
const BulatTeks: React.FC<{ x: number; y: number; d: number; p: number; teks: string; warna: string }> = ({ x, y, d, p, teks, warna }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
    color: warna, display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: d * (teks.length > 1 ? 0.36 : 0.56), lineHeight: 1, transformOrigin: 'center',
    transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, boxShadow: bayanganKecil(warna) }}>{teks}</div>);

const teksTengah = (top: number, size: number, warna = B.night): React.CSSProperties =>
  ({ position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: F, fontSize: size, fontWeight: 800, color: warna, whiteSpace: 'nowrap', lineHeight: 1.15 });

/* ═════════ geometri lintas papan (bentuk sama dibawa; 2 → 1 digabung; 1 → 2 dibelah) ═════════ */
const GEO_A: GeoKartu = { x: RA.kartu.x, y: RA.y[0], w: RA.kartu.w, h: RA.kartu.h, warna: FERI, tab: 'kiri' };
const GEO_B: GeoKartu = { x: RB.kartu.x, y: RB.kartu.y, w: RB.kartu.w, h: RB.kartu.h, warna: FERI, tab: 'atas' };
const GEO_PANEL: GeoKartu = { x: PANEL.x, y: PANEL.y, w: PANEL.w, h: PANEL.h, warna: FERI, tab: 'atas' };
const GEO_KH = (i: number, x = KH.x[i]): GeoKartu => ({ x, y: KH.y, w: KH.w, h: KH.h, warna: i === 0 ? FERI : PRO, tab: 'atas' });
/** ikon kendaraan di kartu (layar) */
const IKON_A = { x: RA.kartu.x - RA.kartu.w / 2 + 84, y: RA.y[0], d: 110 };
const IKON_B = { x: RB.kartu.x, y: RB.kartu.y - RB.kartu.h / 2 + 108, d: 130 };
const IKON_KH = (i: number, x = KH.x[i]) => ({ x: x - KH.w / 2 + 70, y: KH.y - KH.h / 2 + 70, d: 76 });

export const Scene04: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f > S04_AKHIR + 90) return null;

  /* ═ progres papan ═ */
  const serah = cin(f, A0 + 30); // feri Scene 03 → ikon kartu Indeks (adegan 1)
  const keB = cin(f, T.ada); // 1 → 2: orang keluar kiri, kartu & profesional ke posisi dua pilihan
  const keC = cin(f, T.periode); // 2 → 3: kartu Indeks BERUBAH jadi panel grafik; Buffett & profesional keluar
  const belah = cin(f, T.naik); // 3 → 4: panel TERBELAH jadi dua kartu hasil
  const keE = cin(f, T.proE); // 4 → 5: kartu bergeser kiri BERSAMAAN pop profesional (dulu 86f lebih dulu → papan berat kiri)
  const keF = cin(f, T.karena); // 5 → 6: kartu hasil keluar; profesional ke kiri; grafik saham
  const keG = cin(f, T.jadi); // 6 → 7
  const keluarG = cin(f, S04_AKHIR + 30); // papan 7 didorong ke atas; feri diserahkan Scene 05

  /* ═ benda dibawa: feri (indeks) & speedboat (profesional) ═ */
  const feriA = { x: lerp(S03_FERI_AKHIR.x, IKON_A.x, serah), y: lerp(S03_FERI_AKHIR.y, IKON_A.y, serah), d: lerp(S03_FERI_AKHIR.d, IKON_A.d, serah) };
  const feriLeg = { x: LEGENDA.feri, y: LEGENDA.y, d: LEGENDA.d };
  const xKH = (i: number) => lerp(KH.x[i], KH.xE[i], keE);
  const feri = (() => {
    const b = lerp, kh = IKON_KH(0, xKH(0));
    const x = b(b(b(b(feriA.x, IKON_B.x, keB), feriLeg.x, keC), kh.x, belah), kh.x, 0), y = b(b(b(feriA.y, IKON_B.y, keB), feriLeg.y, keC), kh.y, belah);
    return { x, y, d: b(b(b(feriA.d, IKON_B.d, keB), feriLeg.d, keC), kh.d, belah) };
  })();
  const speed = (() => {
    const kh = IKON_KH(1, xKH(1));
    return { x: lerp(LEGENDA.pro, kh.x, belah), y: lerp(LEGENDA.y, kh.y, belah), d: lerp(LEGENDA.d, kh.d, belah) };
  })();
  const pro = { x: lerp(RA.pro.x, RB.pro.x, keB), y: lerp(RA.y[1], RB.pro.y, keB), D: lerp(RA.pro.D, RB.pro.D, keB) };

  /* ═ 3: kalender & grafik — halaman 0 = akhir 2007, 1 = 2008 (krisis), 10 = 2017 ═ */
  const halaman = [{ atas: 'AKHIR', angka: '2007' }, ...Array.from({ length: 10 }, (_, k) => ({ atas: 'TAHUN', angka: String(2008 + k) }))];
  const iKal = cin(f, T.th2008 - 10) + 9 * cin(f, T.hasilnya + 30);
  const g = iKal / 10; // garis grafik digambar SEIRING kalender
  const nilaiIdx = 100 + (nilaiDi(IDX, g) - 100) * (125.8 / (IDX[10] - 100)), nilaiPro = 100 + (nilaiDi(RATA, g) - 100) * (36.3 / (RATA[10] - 100)); // awal TEPAT $100,00
  /* ═ 4: nilai kartu hasil ($100 → …) ═ */
  const naikIdx = cin(f, T.p1258), naikPro = cin(f, T.p363);
  const vIdx = lerp(100, 225.8, naikIdx), vPro = lerp(100, 136.3, naikPro);
  const sorotE = cin(f, T.kalahkanE); // 5: kartu indeks disorot (lebih tinggi)

  /* ── isi kartu ── */
  // 1: kartu Indeks — judul DI TENGAH tinggi kartu dulu, naik bersamaan pop chip "Sederhana" (pola Pemerintah/Bank S02)
  const isiA = (
    <>
      <div style={{ position: 'absolute', left: 168, top: lerp(RA.kartu.h / 2 - 24, 34, cin(f, T.sesederhana)), fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.indeksA} halus>Mengikuti indeks</WordText>
      </div>
      <Chip x={168} y={124} teks="Sederhana" ikon="rasional" warna={FERI} p={popIn(f, T.sesederhana)} size={26} jangkar="kiri" />
    </>);
  // 2: kartu yang SAMA dibawa (judul & chip "Sederhana" dari adegan 1 tetap ada — tanpa slot kosong); "S&P 500" muncul di katanya
  const isiB = (
    <>
      <div style={teksTengah(186, 36)}>Mengikuti indeks</div>
      <div style={teksTengah(232, 32, FERI)}><WordText f={f} at={T.sp} halus>S&P 500</WordText></div>
      <Chip x={RB.kartu.w / 2} y={300} teks="Sederhana" ikon="rasional" warna={FERI} p={0.99996} size={26} />
    </>);
  // 3: panel kalender + grafik (koordinat layar digeser ke dalam panel)
  const ox = PANEL.x - PANEL.w / 2, oy = PANEL.y - PANEL.h / 2;
  const isiPanel = (
    <>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`translate(${-ox} ${-oy})`}>
          {/* krisis 2008: pita merah di kolom 2008 */}
          <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.w / 10} height={PLOT.h} fill={rgba(ARAH.turun, 0.12 * cin(f, T.krisis))} />
          {[50, 100, 150, 200].map((v, k) => (
            <line key={v} x1={PLOT.x0} x2={PLOT.x0 + PLOT.w * cin(f, T.periode + 30 + k * 6)} y1={yV(v)} y2={yV(v)} stroke={rgba(B.gray, v === 100 ? 0.45 : 0.2)} strokeWidth={v === 100 ? 2 : 1.5} />))}
          {[{ v: RATA, w: GARIS_PRO }, { v: IDX, w: FERI }].map((s, k) => g > 0 ? (
            <g key={k}>
              <polyline points={garis(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], g)} fill="none" stroke={s.w} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
              {(() => { const [hx, hy] = ujungGaris(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], g); return <circle cx={hx} cy={hy} r={10 * skalaPop(popIn(f, T.th2008 + 20))} fill={B.white} stroke={s.w} strokeWidth={5} />; })()}
            </g>) : null)}
        </g>
      </svg>
      {[50, 100, 150, 200].map((v, k) => (
        <div key={v} style={{ position: 'absolute', right: PANEL.w - (PLOT.x0 - ox - 16), top: yV(v) - oy - 15, fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
          <WordText f={f} at={T.periode + 30 + k * 6} halus>{`$${v}`}</WordText>
        </div>))}
      {['2008', '2017'].map((t, k) => (
        <div key={t} style={{ position: 'absolute', left: PLOT.x0 - ox + (k === 0 ? 0.5 : 9.5) * (PLOT.w / 10) - 40, width: 80, top: PLOT.y0 + PLOT.h - oy + 12,
          textAlign: 'center', fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>
          <WordText f={f} at={k === 0 ? T.th2008 : T.hasilnya + 50} halus>{t}</WordText>
        </div>))}
      <div style={{ position: 'absolute', left: LEGENDA.feri + 44 - ox, top: LEGENDA.y - 22 - oy, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
        <WordText f={f} at={T.periode + 40} halus>Indeks S&P 500</WordText>
      </div>
      <div style={{ position: 'absolute', left: LEGENDA.pro + 44 - ox, top: LEGENDA.y - 22 - oy, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
        <WordText f={f} at={T.periode + 56} halus>Dikelola profesional</WordText>
      </div>
    </>);
  // 4: kartu hasil — modal sama $100, batang & angka berjalan
  const isiHasil = (i: number) => {
    const indeks = i === 0;
    const v = indeks ? vIdx : vPro, warna = indeks ? FERI : GARIS_PRO;
    const pTeks = popIn(f, T.naik + 20);
    return (<>
      <div style={{ position: 'absolute', left: 130, top: 48, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.naik + 10} halus>{indeks ? 'Indeks S&P 500' : 'Dikelola profesional'}</WordText>
      </div>
      {/* batang nilai: tumbuh dari $100 (pop) ke nilai akhir; garis putus-putus = modal $100 */}
      <svg width={KH.w} height={KH.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={60} x2={60 + (KH.w - 120) * cin(f, T.naik + 30)} y1={BATANG.dasar - 100 * BATANG.skala} y2={BATANG.dasar - 100 * BATANG.skala} stroke={rgba(B.gray, 0.55)} strokeWidth={3} strokeDasharray="10 10" strokeLinecap="round" />
        {pTeks > 0 ? (
          <rect x={BATANG.x - BATANG.w / 2} y={BATANG.dasar - v * BATANG.skala * skalaPop(pTeks)} width={BATANG.w} height={v * BATANG.skala * skalaPop(pTeks)} rx={18} fill={rgba(warna, indeks ? 0.9 : 0.75)} />) : null}
      </svg>
      <div style={{ position: 'absolute', left: 250, top: BATANG.dasar - 100 * BATANG.skala - 44, fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.naik + 30} halus>Modal $100</WordText>
      </div>
      {!indeks ? <div style={{ position: 'absolute', left: 130, top: 92, fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.rata} halus>Rata-rata 5 dana</WordText></div> : null}
      <div style={{ position: 'absolute', left: 250, top: 136, fontFamily: F, fontSize: 64, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
        opacity: pTeks < 0.9999 ? pTeks : undefined }}>{usd(v)}</div>
      {/* persen kumulatif yang diucapkan VO: muncul di angkanya */}
      <Chip x={250} y={256} teks={indeks ? '+125,8%' : '+36,3%'} warna={ARAH.naik} p={popIn(f, indeks ? T.p1258 : T.p363)} size={28} jangkar="kiri" />
    </>);
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ 1–2: kartu Indeks (baris 1) → kartu dua-pilihan kiri (2) → BERUBAH jadi panel grafik (3) ══ */}
      {keC < 1 ? (
        keB <= 0 ? <Kaca x={GEO_A.x} y={GEO_A.y} w={GEO_A.w} h={GEO_A.h} p={popIn(f, T.indeksA)} warna={FERI} tab="kiri">{isiA}</Kaca>
          : keB < 1 ? <KacaMorf a={GEO_A} b={GEO_B} t={keB} isiA={isiA} isiB={isiB} />
            : keC <= 0 ? <Kaca x={GEO_B.x} y={GEO_B.y} w={GEO_B.w} h={GEO_B.h} p={1} warna={FERI} tab="atas" tepi={cin(f, T.sp)}>{isiB}</Kaca>
              : <KacaMorf a={GEO_B} b={GEO_PANEL} t={keC} isiA={isiB} isiB={isiPanel} />) : null}
      {/* 3 → 4: panel TERBELAH jadi dua kartu hasil */}
      {keC >= 1 && belah <= 0 ? <Kaca x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={1} warna={FERI} tab="atas">{isiPanel}</Kaca> : null}
      {belah > 0 && belah < 1 ? [0, 1].map((i) => (
        <KacaMorf key={i} a={GEO_PANEL} b={GEO_KH(i)} t={belah} isiA={i === 0 ? isiPanel : undefined} isiB={isiHasil(i)} peran={i === 1 ? 'belah' : undefined} />)) : null}
      {/* 4–5: dua kartu hasil (bergeser kiri memberi ruang profesional di 5) → keluar lewat tepi terdekat di 6 */}
      {belah >= 1 && keF < 1 ? [0, 1].map((i) => (
        <Kaca key={i} x={xKH(i)} y={KH.y} w={KH.w} h={KH.h} p={1} keluar={1 - keF} warna={i === 0 ? FERI : PRO} tab="atas" tepi={i === 0 ? sorotE : 0}
          alfa={i === 0 ? 1 : 1 - 0.3 * sorotE}>{isiHasil(i)}</Kaca>)) : null}

      {/* ══ 3: kalender (akhir 2007 → 2017), krisis 2008, nilai berjalan di ujung garis ══ */}
      {keC > 0 && belah < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: belah > 0 ? 1 - belah : undefined }}>
          <Kalender x={KAL.x} y={KAL.y} halaman={halaman} i={iKal} p={skalaPop(popIn(f, T.periode + 30))} s={KAL.s} warna={B.blue} />
          <Chip x={PLOT.x0 + PLOT.w / 20 + 30} y={PLOT.y0 + 26} teks="Krisis 2008" ikon="pasarTurun" warna={ARAH.turun} p={popIn(f, T.th2008)} size={24} />
          {/* nilai berjalan $100 → … di samping legenda (dulu di ujung garis: dua pil bertabrakan saat garis berdekatan di 2008) */}
          <PilSeri x={LEGENDA.feri + 360} y={LEGENDA.y} teks={usd(nilaiIdx)} warna={FERI} p={popIn(f, T.periode + 50)} />
          <PilSeri x={LEGENDA.pro + 460} y={LEGENDA.y} teks={usd(nilaiPro)} warna={GARIS_PRO} p={popIn(f, T.periode + 66)} />
        </div>) : null}

      {/* ══ 1: dua orang — orang 1 → indeks · orang 2 → uang → profesional; keduanya menuju "Hasil terbaik?" ══ */}
      {keB < 1 ? (
        <>
          {/* orang, panah & uang keluar ke KIRI sampai keluar frame di "Ada satu contoh…"; garis tujuan ditarik balik, piala pop keluar */}
          <div style={{ position: 'absolute', inset: 0, transform: keB > 0 ? `translate3d(${-760 * keB}px, 0, 0)` : undefined }}>
            {/* orang 1 = investor peta Scene 03 yang DIBAWA (bentuk sama), bergerak bersama feri dalam 60f serah-terima — bukan pop salinan kedua */}
            <KarakterLingkar pose={MURID_BIRU} x={lerp(S03_ORANG_AKHIR.x, RA.orang.x, serah)} y={lerp(S03_ORANG_AKHIR.y, RA.y[0], serah)}
              D={lerp(S03_ORANG_AKHIR.D, RA.orang.D, serah)} s={1} warna={B.orange} cermin />
            <Chevron x={RA.chev} y={RA.y[0]} warna={FERI} p={popIn(f, T.indeksA)} />
            <KarakterLingkar pose={ORANG_SAKU} x={RA.orang.x} y={RA.y[1]} D={RA.orang.D} s={popIn(f, T.bukannya)} warna={B.orange} />
            {(() => {
              // uang orang 2 POP di dekatnya, lalu diserahkan ke profesional: bergerak & mengecil masuk lingkaran profesional (60f)
              const t = cin(f, T.proA + 20);
              return t < 1 ? <Uang x={lerp(RA.chev, RA.pro.x - 40, t)} y={RA.y[1]} w={lerp(130, 40, t)} p={popIn(f, T.investasiA)} alfa={1 - t} /> : null;
            })()}
          </div>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${RA.kartu.x + RA.kartu.w / 2 + 10} ${RA.y[0]} C ${RA.tujuan.x - 260} ${RA.y[0]} ${RA.tujuan.x - 200} ${RA.tujuan.y} ${RA.tujuan.x - RA.tujuan.d / 2 - 12} ${RA.tujuan.y}`}
              g={cin(f, T.hasilA - 40) * (1 - keB)} warna={FERI} tebal={4} titik={false} />
            <Penghubung d={`M ${RA.pro.x + RA.pro.D / 2 + 10} ${RA.y[1]} C ${RA.tujuan.x - 260} ${RA.y[1]} ${RA.tujuan.x - 200} ${RA.tujuan.y} ${RA.tujuan.x - RA.tujuan.d / 2 - 12} ${RA.tujuan.y}`}
              g={cin(f, T.hasilA - 20) * (1 - keB)} warna={GARIS_PRO} tebal={4} titik={false} />
          </svg>
          <Bulat x={RA.tujuan.x} y={RA.tujuan.y} d={RA.tujuan.d} warna={B.orange} ikon="trofi" p={popIn(f, T.hasilA) * popOut(f, T.ada)} />
          <Label x={RA.tujuan.x} y={RA.tujuan.y + RA.tujuan.d / 2 + 40} teks="Hasil terbaik?" f={f} at={T.bagus} keluar={T.ada} size={32} lebar={340} />
        </>) : null}

      {/* ══ 2: Warren Buffett di antara kedua pilihan — menantang profesional: akhir 2007 · 10 tahun ══ */}
      {f > T.warren - 30 && keC < 1 ? (
        <>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {/* Buffett → indeks (pilihannya) */}
            <Penghubung d={`M ${RB.buffett.x - RB.buffett.D / 2 - 14} ${RB.buffett.y} L ${RB.kartu.x + RB.kartu.w / 2 + 14} ${RB.kartu.y - 20}`} g={cin(f, T.indeksB) * (1 - keC)} warna={FERI} tebal={4} titik={false} />
            {/* Buffett ··· VS ··· profesional */}
            <Penghubung d={`M ${RB.buffett.x + RB.buffett.D / 2 + 14} ${RB.buffett.y} L ${RB.vs.x - RB.vs.d / 2 - 10} ${RB.buffett.y}`} g={cin(f, T.kalahkanB - 20) * (1 - keC)} warna={GARIS_PRO} tebal={4} titik={false} />
            <Penghubung d={`M ${RB.vs.x + RB.vs.d / 2 + 10} ${RB.buffett.y} L ${RB.pro.x - RB.pro.D / 2 - 14} ${RB.buffett.y}`} g={cin(f, T.kalahkanB + 10) * (1 - keC)} warna={GARIS_PRO} tebal={4} titik={false} />
          </svg>
          <KarakterLingkar pose={BUFFETT} x={RB.buffett.x} y={RB.buffett.y} D={RB.buffett.D} s={popIn(f, T.warren) * popOut(f, T.periode)} warna={B.blue} />
          <Lencana x={RB.buffett.x} y={RB.buffett.y} d={RB.buffett.D} p={popIn(f, T.bertaruh) * popOut(f, T.periode)} warna={B.orange} ikon="trofi" besar={76} />
          <Label x={RB.buffett.x} y={RB.buffett.y + RB.buffett.D / 2 + 40} teks="Warren Buffett" f={f} at={T.buffett + 10} keluar={T.periode} size={36} lebar={420} />
          <Chip x={RB.buffett.x - 125} y={RB.chipY} teks="Akhir 2007" ikon="kalender" warna={B.blue} p={popIn(f, T.th2007) * popOut(f, T.periode)} size={26} />
          <Chip x={RB.buffett.x + 125} y={RB.chipY} teks="10 tahun" ikon="waktu" warna={B.blue} p={popIn(f, T.sepuluh) * popOut(f, T.periode)} size={26} />
          <BulatTeks x={RB.vs.x} y={RB.buffett.y} d={RB.vs.d} p={popIn(f, T.kalahkanB) * popOut(f, T.periode)} teks="VS" warna={B.orange} />
        </>) : null}

      {/* profesional: baris 2 (1) → kanan (2) → pop keluar di "periode" (3); muncul lagi di 5 untuk membandingkan */}
      {keC < 1 ? (
        <>
          <KarakterLingkar pose={INVESTOR_NAVY} x={pro.x} y={pro.y} D={pro.D} s={popIn(f, T.dikelolaA) * popOut(f, T.periode)} warna={B.blue} />
          {/* label & chip DIBAWA bersama profesional dari baris 2 (1) ke kanan (2) */}
          <Label x={pro.x} y={pro.y + pro.D / 2 + 40} teks="Profesional" f={f} at={T.proA} keluar={T.periode} size={32} lebar={340} />
          <Chip x={pro.x} y={pro.y + pro.D / 2 + 102} teks="Aktif memilih saham" ikon="saham" warna={B.blue} p={popIn(f, T.proA + 30) * popOut(f, T.periode)} size={24} />
        </>) : null}

      {/* ══ 5: profesional membandingkan — indeks lebih tinggi; keahlian tidak menjamin ══ */}
      {/* ══ 6: profesional di kiri + grafik saham — sebagian turun / tertinggal pasar ══ */}
      {f > T.proE - 30 && keG < 1 ? (() => {
        const x = lerp(PE.orang.x, PF.orang.x, keF), y = lerp(PE.orang.y, PF.orang.y, keF), D = lerp(PE.orang.D, PF.orang.D, keF);
        return (
          <>
            <KarakterLingkar pose={INVESTOR_NAVY} x={x} y={y} D={D} s={popIn(f, T.proE + 20) * popOut(f, T.jadi)} warna={B.blue} />
            <Chip x={x} y={y + D / 2 + 46} teks="Berpengalaman" ikon="kapten" warna={B.blue} p={popIn(f, T.proE + 50) * popOut(f, T.jadi)} size={28} />
            <Chip x={x} y={y + D / 2 + 116} teks="Hasil tak dijamin" ikon="menebak" warna={B.gray} p={popIn(f, T.selalu) * popOut(f, T.karena)} size={26} />
          </>);
      })() : null}
      {/* piala di kartu indeks (5): "nggak selalu bisa mengalahkan indeks" */}
      {belah >= 1 && keF < 1 ? <Lencana x={xKH(0) + KH.w / 2 - 34} y={KH.y - KH.h / 2 + 34} d={0} p={popIn(f, T.indeksE) * popOut(f, T.karena)} warna={B.orange} ikon="trofi" besar={74} /> : null}
      {keF > 0 && keG < 1 ? SAHAM.map((s, i) => {
        const kx = PF.kartu.x[i % 2], ky = PF.kartu.y[Math.floor(i / 2)], kw = PF.kartu.w, kh = PF.kartu.h;
        const gs = cin(f, T.memilihF + 30 + i * 20), gp = cin(f, T.memilihF + 20);
        const pilih = popIn(f, T.terus + i * 14);
        const hasil = popIn(f, T.mengungguli + 20 + i * 12);
        const warna = s.hasil === 'unggul' ? ARAH.naik : s.hasil === 'turun' ? ARAH.turun : B.gray;
        const lo = 84, hi = 128, cx0 = 28, cy0 = 76, cw = kw - 56, ch = 110;
        return (
          <React.Fragment key={s.nama}>
            <Kaca x={kx} y={ky} w={kw} h={kh} p={popIn(f, T.memilihF + i * 20)} keluar={1 - keG} warna={B.gray} tab="atas" tabTebal={10}>
              <div style={{ position: 'absolute', left: 28, top: 24, fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night }}>
                <WordText f={f} at={T.memilihF + i * 20 + 10} halus>{s.nama}</WordText>
              </div>
              <svg width={kw} height={kh} style={{ position: 'absolute', left: 0, top: 0 }}>
                <polyline points={garis(PASAR, cx0, cy0, cw, ch, lo, hi, gp)} fill="none" stroke={rgba(B.gray, 0.6)} strokeWidth={3} strokeDasharray="8 8" strokeLinecap="round" />
                {gs > 0 ? <polyline points={garis(s.v, cx0, cy0, cw, ch, lo, hi, gs)} fill="none" stroke={hasil > 0 ? warna : B.blue} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" /> : null}
              </svg>
              <div style={{ position: 'absolute', right: 26, top: kh - 40, fontFamily: F, fontSize: 18, fontWeight: 700, color: B.gray }}>
                <WordText f={f} at={T.memilihF + 30} halus>- - pasar</WordText>
              </div>
            </Kaca>
            {/* profesional memilih (centang), lalu hasilnya: naik / turun / tertinggal pasar */}
            <Lencana x={kx + kw / 2 - 40} y={ky - kh / 2 + 40} d={0} p={pilih * popOut(f, T.jadi)} warna={B.blue} ikon="tersedia" besar={52} />
            <Chip x={kx} y={ky + kh / 2 + 4} teks={s.hasil === 'unggul' ? '▲ Mengungguli' : s.hasil === 'turun' ? '▼ Turun' : 'Tertinggal pasar'} warna={warna} p={hasil * popOut(f, T.jadi)} size={22} />
          </React.Fragment>);
      }) : null}
      {keF > 0 && keG < 1 ? <PilSeri x={PF.orang.x} y={PF.orang.y + PF.orang.D / 2 + 116} teks="Sulit" warna={B.orange} p={popIn(f, T.sulit) * popOut(f, T.jadi)} /> : null}

      {/* ══ 7: investor awam ragu → memilih indeks; tetap pada rencana, tak perlu menebak — sederhana & masuk akal ══ */}
      {f > T.jadi - 30 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - keluarG, true) }}>
            {(() => {
              const x = lerp(960, PG.orang.x, cin(f, T.memilihG - 24)); // di tengah dulu, ke kiri memberi ruang indeks
              return (
                <>
                  <KarakterLingkar pose={MURID_BIRU} x={x} y={PG.orang.y} D={PG.orang.D} s={popIn(f, T.banyak)} warna={B.orange} />
                  <BulatTeks x={x + PG.orang.D * 0.36} y={PG.orang.y - PG.orang.D * 0.36} d={64} p={popIn(f, T.investor) * popOut(f, T.memilihG + 20)} teks="?" warna={B.blue} />
                  <Label x={x} y={PG.orang.y + PG.orang.D / 2 + 40} teks="Banyak investor" f={f} at={T.investor} size={32} lebar={360} />
                  <Chip x={x} y={PG.orang.y + PG.orang.D / 2 + 110} teks="Terlalu sederhana?" warna={B.gray} p={popIn(f, T.investor + 20)} coret={R(f, T.serius - 30, T.serius + 30, 0, 1, io)} size={26} />
                </>);
            })()}
            <Chevron x={PG.chev} y={PG.orang.y} warna={FERI} p={popIn(f, T.memilihG - 10)} />
            <Label x={PG.feri.x} y={PG.feri.y + PG.feri.d / 2 + 40} teks="Memilih indeks" f={f} at={T.indeksG} size={32} lebar={360} />
            <Lencana x={PG.feri.x} y={PG.feri.y} d={PG.feri.d} p={popIn(f, T.indeksG + 20)} warna={CEK} ikon="tersedia" besar={60} />
            <Chip x={PG.chip.x} y={PG.chip.y[0]} teks="Tetap pada rencana" ikon="rencana" warna={CEK} p={popIn(f, T.berinvestasi)} size={26} lebar={PG.chip.w} />
            <Chip x={PG.chip.x} y={PG.chip.y[1]} teks="Tak perlu menebak pemenang" ikon="menebak" warna={CEK} p={popIn(f, T.justru)} size={26} lebar={PG.chip.w} />
            <Chip x={PG.chip.x} y={PG.chip.y[2]} teks="Lebih sederhana" ikon="rasional" warna={CEK} p={popIn(f, T.sederhanaG)} size={26} lebar={PG.chip.w} />
            <Chip x={PG.chip.x} y={PG.chip.y[3]} teks="Tak harus selalu mengalahkan pasar" ikon="tersedia" warna={CEK} p={popIn(f, T.masuk)} size={26} lebar={PG.chip.w} />
          </div>
          {f < S04_AKHIR ? <Kendaraan x={PG.feri.x} y={PG.feri.y} d={PG.feri.d} warna={FERI} ikon="feri" cermin p={popIn(f, T.memilihG)} /> : null}
        </>) : null}

      {/* ══ kendaraan DIBAWA: feri Scene 03 → ikon kartu Indeks (1) → kartu dua-pilihan (2) → legenda grafik (3) → kartu hasil (4–5) ══ */}
      {keF < 1 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Kendaraan x={feri.x} y={feri.y} d={feri.d} warna={FERI} ikon="feri" cermin p={popOut(f, T.karena)} />
          {keC > 0 ? <Kendaraan x={speed.x} y={speed.y} d={speed.d} warna={PRO} ikon="speedboat" cermin p={popIn(f, T.periode + 40) * popOut(f, T.karena)} /> : null}
        </div>) : null}
    </AbsoluteFill>);
};
