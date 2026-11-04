import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, F, io, R, rgba } from '../theme';
import { ArahKeluar, cin, gayaPapan, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { Kaca, Penghubung } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { garis, kumulatif, ujungGaris, yDari } from '../parts/grafik';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 04 — Profesional Selalu Lebih Hebat dari Indeks? (BATAS.s4 – BATAS.s5). Ide: 04_Asset/Ide-Visual-Scene-04.md.
 * Serah-terima: feri Scene 03 (selesai menyeberang) meluncur ke tengah → A feri "Indeks" vs speedboat "Profesional" (?) → B taruhan Warren Buffett
 * (piala di tengah, nama di atas tiap kendaraan, akhir 2007 · 10 tahun) → C kedua kendaraan MENYATU ke legenda satu panel grafik 2008–2017
 * (data tahunan surat Berkshire 2017: indeks +125,8 %, lima dana profesional rata-rata +36,3 %).
 * Naskah revisi 21 Okt (NOTE: Buffett tetap; detail Protégé, return per tahun, biaya tidak perlu; motion taruhan dipakai, dipercepat):
 * → "Artinya, profesional pun nggak selalu bisa mengalahkan indeks" = feri berpiala di samping speedboat → D satu alasan: terus mengungguli pasar
 * itu sulit, bahkan untuk yang berpengalaman → E memilih indeks: "nggak serius" dicoret → "sederhana & masuk akal"; feri diserahkan ke Scene 05.
 */
const A0 = BATAS.s4;
const KATA = ['mungkin', 'profesional', 'seharusnya', 'contoh', 'warren', 'buffett', '2007', 'bertaruh', 'sepuluh', 'indeks', 'sp', 'mengalahkan',
  'periode', 'bahkan', 'krisis', 'finansial', '2008', 'hasilnya', 'indeks', '1258', 'sementara', 'profesional', 'rata-rata', '363',
  'artinya', 'profesional', 'mengalahkan', 'karena', 'sulit', 'bahkan', 'jadi', 'banyak', 'indeks', 'serius', 'justru', 'sederhana'];
const K = ['mungkin', 'pro', 'bukannya', 'taruhan', 'warren', 'buffett', 'th2007', 'bertaruh', 'sepuluh', 'indeks', 'sp', 'kalahkan',
  'periode', 'th2008', 'krisis', 'th2017', 'krisis2008', 'hasil', 'akhirnya', 'p1258', 'sementara', 'lima', 'rata', 'p363',
  'artinya', 'proE', 'kalahkan3', 'karena', 'sulit', 'berpengalaman', 'jadi', 'banyak', 'indeksE', 'serius', 'justru', 'sederhana'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S04_T = T;
export const S04_AKHIR = BATAS.s5;

const FERI = JALUR_WARNA.feri;
const PRO = JALUR_WARNA.speedboat; // hedge fund = profesional = speedboat (warna metafora Scene 01)
/** garis hedge fund di grafik: abu (Simon 19 Okt "warna bertabrakan" — dulu oranye vs biru) */
const GARIS_PRO = B.gray;
/** serah-terima dari Scene 03: feri selesai menyeberang di (1280, 540, Ø140) */
export const S03_FERI_AKHIR = { x: 1280, y: 580, d: 140 }; // Scene 03 papan I +40 (QA pusat 19 Okt)
/** feri di akhir Scene 04 (diserahkan ke Scene 05) */
export const S04_FERI_AKHIR = { x: 960, y: 440, d: 200 };
/** papan "Artinya…": feri berpiala + speedboat */
const AKHIR = { feri: { x: 760, y: 520, d: 200 }, pro: { x: 1160, y: 520, d: 170 } };

/* ── data taruhan (surat Berkshire Hathaway 2017, imbal hasil tahunan %; dicek: kumulatif = 125,8 % · A 21,7 · B 42,3 · C 87,7 · D 2,8 · E 27,0) ── */
const TAHUN = ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
const IDX = kumulatif([-37.0, 26.6, 15.1, 2.1, 16.0, 32.3, 13.6, 1.4, 11.9, 21.8]);
const DANA = [
  kumulatif([-16.5, 11.3, 5.9, -6.3, 3.4, 10.5, 4.7, 1.6, -3.2, 12.2]),
  kumulatif([-22.3, 14.5, 6.8, -1.3, 9.6, 15.2, 4.0, 2.5, 1.9, 10.6]),
  kumulatif([-21.3, 21.4, 13.3, 5.9, 5.7, 8.8, 18.9, 5.4, -1.7, 15.6]), // C = terbaik (+87,7 %)
  kumulatif([-29.3, 16.5, 4.9, -6.3, 6.2, 14.2, 0.7, 1.4, 2.5, 0]), // D: 2017 "N/A" di tabel (dana ditutup) → nilai akhir tetap +2,8 %
  kumulatif([-30.1, 16.8, 11.9, -2.8, 9.1, 14.4, -2.1, -5.0, 4.4, 18.0]),
];
const RATA = IDX.map((_, i) => DANA.reduce((s, d) => s + d[i], 0) / DANA.length); // akhir 136,3 = +36,3 %

/* ── tata letak ── */
const KD = 200;
const POS_A = { feri: { x: 640, y: 550 }, pro: { x: 1280, y: 550 } }; // QA pusat 19 Okt: papan A–B −34 → +30
const PANEL = { x: 960, y: 520, w: 1400, h: 640 };
const PLOT = { x0: 380, y0: 300, w: 920, h: 460 };
const DOM: [number, number] = [50, 240];
const LEGENDA = { y: 246, feri: 420, pro: 830, d: 52 };
const yV = (v: number) => yDari(v, PLOT.y0, PLOT.h, DOM[0], DOM[1]);

/** pil nilai berwarna (latar warna seri, teks putih) */
const PilSeri: React.FC<{ x: number; y: number; teks: string; warna: string; p: number }> = ({ x, y, teks, warna, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(0, -50%) scale(${skalaPop(p)})`, transformOrigin: 'left center', background: warna,
    color: B.white, fontFamily: F, fontSize: 30, fontWeight: 800, padding: '9px 20px', borderRadius: 999, whiteSpace: 'nowrap', lineHeight: 1,
    boxShadow: `0 12px 26px -12px ${rgba(warna, 0.9)}`, fontVariantNumeric: 'tabular-nums' }}>{teks}</div>);

/** lingkaran "?" (bukan ikon: tanda baca) */
const Tanya: React.FC<{ x: number; y: number; d: number; p: number }> = ({ x, y, d, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.blue, color: B.white, display: 'grid', placeItems: 'center',
    fontFamily: F, fontWeight: 800, fontSize: d * 0.56, lineHeight: 1, transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`,
    boxShadow: `0 16px 34px -12px ${rgba(B.blue, 0.8)}` }}>?</div>);

/* ── D: satu alasan ── */
const KARTU_D = { x: 960, y: 540, w: 900, h: 230 };

export const Scene04: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f > S04_AKHIR + 90) return null;

  /* ═ A–B: feri (serah-terima) vs speedboat ═ */
  // QA pusat 19 Okt: papan A sendiri di 550 = +40 → kendaraan di 520, turun ke 550 memberi ruang chip nama di atasnya
  const yA = 520 + 30 * cin(f, T.warren - 24);
  const serah = cin(f, A0 + 30); // feri Scene 03 → tengah
  const ruang = cin(f, T.pro - 24); // feri bergeser kiri memberi ruang speedboat
  const keLegenda = cin(f, T.periode + 10); // C: kedua kendaraan menyatu ke legenda panel grafik
  const feriAB = {
    x: S03_FERI_AKHIR.x + (POS_A.feri.x + (960 - POS_A.feri.x) - S03_FERI_AKHIR.x) * serah + (POS_A.feri.x - 960) * ruang,
    y: S03_FERI_AKHIR.y + (yA - S03_FERI_AKHIR.y) * serah,
    d: S03_FERI_AKHIR.d + (KD - S03_FERI_AKHIR.d) * serah,
  };
  const feri = { x: feriAB.x + (LEGENDA.feri - feriAB.x) * keLegenda, y: feriAB.y + (LEGENDA.y - feriAB.y) * keLegenda, d: feriAB.d + (LEGENDA.d - feriAB.d) * keLegenda };
  const pro = { x: POS_A.pro.x + (LEGENDA.pro - POS_A.pro.x) * keLegenda, y: yA + (LEGENDA.y - yA) * keLegenda, d: KD + (LEGENDA.d - KD) * keLegenda };
  const pudarAB = 1 - cin(f, T.periode - 10, 30); // label, nama & kolom tengah
  /* ═ C: grafik ═ */
  const keluarC = popOut(f, T.artinya - 10);
  const panelC = popIn(f, T.periode + 10) * keluarC;
  const sumbu = cin(f, T.th2008 - 20);
  const gKrisis = 0.1 * cin(f, T.krisis + 20, 60);
  const gIdx = gKrisis + 0.9 * R(f, T.akhirnya, T.p1258 - 5, 0, 1, io);
  const gRata = gKrisis + 0.9 * R(f, T.rata - 20, T.p363 - 5, 0, 1, io);
  const gDana = R(f, T.sementara, T.lima + 80, 0, 1, io); // QA diam: mulai di "sementara"
  /* ═ "Artinya, profesional pun nggak selalu bisa mengalahkan indeks" ═ */
  const akhirP = popIn(f, T.artinya + 35);
  const keluarAkhir = 1 - cin(f, T.karena - 10, 40);
  /* ═ D: satu alasan ═ */
  const keluarD = popOut(f, T.jadi - 20);
  const kartuD = popIn(f, T.karena + 20) * keluarD;
  /* ═ E: memilih indeks — bukan "nggak serius", tapi sederhana & masuk akal ═ */
  const eP = popIn(f, T.jadi + 20);
  const tidakSerius = popIn(f, T.serius) * popOut(f, T.justru);
  const masukAkal = popIn(f, T.sederhana);

  // feri & speedboat: tampil di A–C
  const kendaraanC = keluarC;
  // ikon legenda pop-out DI TEMPATNYA saat panel grafik keluar ke atas (dulu meluncur ke pusat panel → terlepas dari panel)
  const feriC = feri, proC = pro;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ C: panel grafik (di bawah kendaraan yang menyatu ke legendanya) ══ */}
      <ArahKeluar aktif={f > T.artinya - 40}>
      {panelC > 0.001 ? (
        <Kaca x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={panelC} warna={FERI} tab="atas">
          <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <g transform={`translate(${PANEL.w / 2 - PANEL.x} ${PANEL.h / 2 - PANEL.y})`}>
              {/* krisis 2008 */}
              <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.w / 10} height={PLOT.h} fill={rgba(ARAH.turun, 0.1 * cin(f, T.krisis))} />
              {/* kisi & sumbu */}
              {[50, 100, 150, 200].map((v) => (
                <g key={v}>
                  {/* trim path: kisi tergambar dari kiri */}
                  <line x1={PLOT.x0} x2={PLOT.x0 + PLOT.w * sumbu} y1={yV(v)} y2={yV(v)} stroke={rgba(B.gray, v === 100 ? 0.45 : 0.2)} strokeWidth={v === 100 ? 2 : 1.5} />
                  <text x={PLOT.x0 - 18} y={yV(v) + 8} textAnchor="end" fontFamily={F} fontSize={22} fontWeight={700} fill={B.gray} opacity={sumbu}>{v === 100 ? '0%' : `${v > 100 ? '+' : '−'}${Math.abs(v - 100)}%`}</text>
                </g>))}
              {/* konteks untuk awam: apa yang diukur grafik (kanan atas panel, sejajar legenda) */}
              <text x={PANEL.x + PANEL.w / 2 - 44} y={LEGENDA.y + 9} textAnchor="end" fontFamily={F} fontSize={24} fontWeight={700} fill={B.gray} opacity={sumbu}>Hasil investasi 2008–2017</text>
              {TAHUN.map((t, i) => (
                <text key={t} x={PLOT.x0 + (i + 0.5) * (PLOT.w / 10)} y={PLOT.y0 + PLOT.h + 34} textAnchor="middle" fontFamily={F} fontSize={22} fontWeight={700} fill={B.gray}
                  opacity={cin(f, T.th2008 + (i * (T.th2017 - T.th2008)) / 9, 30)}>{t}</text>))}
              {/* lima dana profesional (tipis) */}
              {DANA.map((d, k) => gDana > 0.001 ? (
                <polyline key={k} points={garis(d, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], gDana)} fill="none" stroke={B.grayLite}
                  strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" opacity={0.45} />) : null)}
              {/* rata-rata dana profesional & indeks */}
              {[{ v: RATA, g: gRata, w: GARIS_PRO }, { v: IDX, g: gIdx, w: FERI }].map((s, k) => s.g > 0.001 ? (
                <g key={k}>
                  <polyline points={garis(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], s.g)} fill="none" stroke={s.w} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
                  {(() => { const [hx, hy] = ujungGaris(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], s.g); return <circle cx={hx} cy={hy} r={10} fill={B.white} stroke={s.w} strokeWidth={5} />; })()}
                </g>) : null)}
            </g>
          </svg>
          {/* teks legenda (ikon = kendaraan yang menyatu) */}
          <div style={{ position: 'absolute', left: LEGENDA.feri + 40 - (PANEL.x - PANEL.w / 2), top: LEGENDA.y - 22 - (PANEL.y - PANEL.h / 2), fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
            <WordText f={f} at={T.periode + 40} halus>Indeks S&P 500</WordText>
          </div>
          <div style={{ position: 'absolute', left: LEGENDA.pro + 40 - (PANEL.x - PANEL.w / 2), top: LEGENDA.y - 22 - (PANEL.y - PANEL.h / 2), fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
            <WordText f={f} at={T.periode + 60} halus>Dikelola profesional</WordText>
          </div>
        </Kaca>) : null}
      {panelC > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, keluarC * 1.5) }}>
          <Chip x={PLOT.x0 + PLOT.w / 20} y={PLOT.y0 + 30} teks="Krisis 2008" warna={ARAH.turun} p={popIn(f, T.krisis + 10)} size={24} />
          {/* nilai akhir di kanan grafik */}
          <PilSeri x={PLOT.x0 + PLOT.w + 30} y={yV(IDX[10])} teks="+125,8%" warna={FERI} p={popIn(f, T.p1258)} />
          <PilSeri x={PLOT.x0 + PLOT.w + 30} y={yV(RATA[10])} teks="Rata-rata +36,3%" warna={GARIS_PRO} p={popIn(f, T.p363)} />
        </div>) : null}
      </ArahKeluar>

      {/* ══ A–B: label, nama, kolom taruhan ══ */}
      {pudarAB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(pudarAB, f > T.periode - 40) }}>
          <Label x={feriAB.x} y={feriAB.y + feriAB.d / 2 + 40} teks="Indeks" f={f} at={T.mungkin} size={32} alfa={1 - cin(f, T.sp - 10, 30)} />
          <Label x={feriAB.x} y={feriAB.y + feriAB.d / 2 + 40} teks="Indeks S&P 500" f={f} at={T.sp + 10} size={32} />
          <Label x={POS_A.pro.x} y={yA + KD / 2 + 40} teks="Profesional" f={f} at={T.pro + 10} size={32} />
          <Chip x={POS_A.feri.x} y={395} teks="Warren Buffett" warna={FERI} p={popIn(f, T.warren + 10)} size={26} />
          {/* garis taruhan (trim path): Buffett ikut di "bertaruh", profesional di "mengalahkan" */}
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${POS_A.feri.x + 104} ${yA - 20} L ${960 - 84} 470`} g={cin(f, T.bertaruh, 60)} warna={FERI} tebal={4} titik={false} />
            <Penghubung d={`M ${POS_A.pro.x - 104} ${yA - 20} L ${960 + 84} 470`} g={cin(f, T.kalahkan - 20, 90)} warna={PRO} tebal={4} titik={false} />
          </svg>
          {/* kolom tengah: taruhan (piala muncul di "contoh terkenal", sesudah tanda tanya pergi) */}
          <Bulat x={960} y={480} d={140} warna={B.orange} ikon="trofi" p={popIn(f, T.taruhan + 15)} />
          <Label x={960} y={480 + 70 + 36} teks="Taruhan" f={f} at={T.taruhan + 25} size={32} lebar={300} />
          <Chip x={960} y={662} teks="Akhir 2007" ikon="kalender" warna={B.blue} p={popIn(f, T.th2007)} size={26} />
          <Chip x={960} y={732} teks="10 tahun" ikon="waktu" warna={B.blue} p={popIn(f, T.sepuluh)} size={26} />
        </div>) : null}

      {/* ══ kendaraan A–C (feri dari Scene 03 · speedboat profesional) ══ */}
      <ArahKeluar aktif={f > T.artinya - 40}>
      {kendaraanC > 0.001 ? (
        <>
          <Kendaraan x={feriC.x} y={feriC.y} d={feri.d} warna={FERI} ikon="feri" cermin p={keluarC} />
          <Kendaraan x={proC.x} y={proC.y} d={pro.d} warna={PRO} ikon="speedboat" cermin p={popIn(f, T.pro) * keluarC} />
          <Lencana x={pro.x} y={pro.y} d={pro.d} p={popIn(f, T.pro + 20) * (1 - keLegenda)} warna={B.night} ikon="kapten" besar={64} />
          {/* "…seharusnya bisa memberikan hasil yang lebih bagus?" — tanya di antara keduanya, habis sebelum piala taruhan muncul di tempat yang sama */}
          <Tanya x={960} y={yA} d={100} p={popIn(f, T.bukannya) * popOut(f, T.taruhan - 30)} />
        </>) : null}
      </ArahKeluar>

      {/* ══ "Artinya, profesional pun nggak selalu bisa mengalahkan indeks" → feri berpiala di samping speedboat ══ */}
      {akhirP > 0.001 && keluarAkhir > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(keluarAkhir, f > T.karena - 20) }}>
          <Kendaraan x={AKHIR.feri.x} y={AKHIR.feri.y} d={AKHIR.feri.d} warna={FERI} ikon="feri" cermin p={akhirP} />
          <Lencana x={AKHIR.feri.x} y={AKHIR.feri.y} d={AKHIR.feri.d} p={popIn(f, T.kalahkan3)} warna={B.orange} ikon="trofi" besar={74} />
          <Kendaraan x={AKHIR.pro.x} y={AKHIR.pro.y} d={AKHIR.pro.d} warna={PRO} ikon="speedboat" cermin p={popIn(f, T.proE)} />
          <Label x={AKHIR.feri.x} y={AKHIR.feri.y + 100 + 40} teks="Indeks" f={f} at={T.artinya + 50} size={32} />
          <Label x={AKHIR.pro.x} y={AKHIR.pro.y + 100 + 40} teks="Profesional" f={f} at={T.proE + 15} size={32} />
        </div>) : null}

      {/* ══ D: terus mengungguli pasar itu sulit — bahkan untuk yang berpengalaman ══ */}
      <ArahKeluar aktif={f > T.jadi - 50}>
      {kartuD > 0.001 ? (
        <Kaca x={KARTU_D.x} y={KARTU_D.y} w={KARTU_D.w} h={KARTU_D.h} p={kartuD} warna={B.blue} tab="kiri">
          <Bulat x={110} y={KARTU_D.h / 2} d={120} warna={B.blue} ikon="menebak" p={1} />
          <div style={{ position: 'absolute', left: 200, top: 50, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '46px' }}>
            <WordText f={f} at={T.sulit - 10} halus>Terus mengungguli pasar itu sulit</WordText>
          </div>
          <Chip x={200} y={160} teks="Bahkan untuk yang berpengalaman" ikon="kapten" warna={B.blue} p={popIn(f, T.berpengalaman)} size={26} jangkar="kiri" />
        </Kaca>) : null}
      </ArahKeluar>

      {/* ══ E: memilih indeks — "nggak serius" dicoret → "sederhana & masuk akal"; feri diserahkan ke Scene 05 ══ */}
      {eP > 0.001 ? (
        <>
          {f < S04_AKHIR ? <Kendaraan x={S04_FERI_AKHIR.x} y={S04_FERI_AKHIR.y} d={S04_FERI_AKHIR.d} warna={FERI} ikon="feri" cermin p={eP} /> : null}
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - cin(f, S04_AKHIR + 20, 40), true) }}>
            <Label x={S04_FERI_AKHIR.x} y={S04_FERI_AKHIR.y + 100 + 40} teks="Memilih indeks" f={f} at={T.indeksE + 10} size={32} lebar={360} />
            <Chip x={960} y={690} teks="Nggak serius" ikon="sofa" warna={B.gray} p={tidakSerius} coret={R(f, T.serius + 24, T.serius + 54, 0, 1, io)} size={30} />
            <Chip x={960} y={690} teks="Sederhana & masuk akal" ikon="rasional" warna={CEK} p={masukAkal} size={32} />
          </div>
        </>) : null}
    </AbsoluteFill>);
};
