import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, F, io, R, rgba } from '../theme';
import { ArahKeluar, cin, gayaPapan, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { Chevron, INVESTOR_JAS, Kaca, KarakterLingkar, Penghubung, PoseKarakter } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { garis, kumulatif, ujungGaris, yDari } from '../parts/grafik';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 04 — Profesional Selalu Lebih Hebat dari Indeks? (BATAS.s4 – BATAS.s5). RELAYOUT 22 Okt (Simon: "secara layout aku masih kurang puas",
 * judul TIDAK ditambahkan) — 04_Asset/Rencana-Relayout-V05.md. Naskah revisi 21 Okt (NOTE: Buffett tetap; detail Protégé, return per tahun, biaya
 * tidak perlu; motion taruhan dipakai, dipercepat).
 *  A feri (dari Scene 03) mendarat di KARTU Indeks (tengah, chip "Sederhana") → bergeser kiri memberi ruang kartu "Dikelola profesional"
 *    (speedboat + kapten, chip "Hasil lebih bagus?") · B kartu yang SAMA jadi taruhan Buffett: piala + akhir 2007 · 10 tahun di tengah, garis taruhan
 *  C dua kartu MENYATU jadi panel grafik 2008–2017 (surat Berkshire 2017: indeks +125,8 %, lima dana profesional rata-rata +36,3 %) + Rupiah
 *    berjalan di ujung garis (modal Rp1.000.000) · "Artinya" panel pecah jadi dua kartu hasil (feri berpiala)
 *  D profesional berpengalaman (orang berjas) + kartu "Terus mengungguli pasar" dengan meter kesulitan "Sulit"
 *  E banyak investor › memilih indeks (feri) · "Nggak serius" dicoret → "Sederhana" · "Masuk akal"; feri diserahkan ke Scene 05.
 * Ikon/chip/lencana = pop easeOutBack; kartu/teks/orang = swipe up; garis = trim path; 60f dipusatkan di kata, stagger 20f.
 */
const A0 = BATAS.s4;
const KATA = ['mungkin', 'sesederhana', 'profesional', 'seharusnya', 'hasil', 'bagus', 'contoh', 'warren', 'buffett', '2007', 'bertaruh', 'sepuluh',
  'sederhana', 'indeks', 'sp', 'mengalahkan', 'beberapa', 'profesional', 'periode', 'bahkan', 'krisis', 'finansial', '2008', 'hasilnya', 'indeks', '1258',
  'sementara', 'profesional', 'rata-rata', '363', 'artinya', 'profesional', 'mengalahkan', 'karena', 'terus', 'mengungguli', 'pasar', 'sulit', 'bahkan',
  'berpengalaman', 'jadi', 'banyak', 'investor', 'memilih', 'indeks', 'serius', 'justru', 'sederhana', 'masuk', 'akal'];
const K = ['mungkin', 'sesederhana', 'pro', 'bukannya', 'hasilA', 'bagus', 'taruhan', 'warren', 'buffett', 'th2007', 'bertaruh', 'sepuluh',
  'sederhanaB', 'indeks', 'sp', 'kalahkan', 'beberapa', 'proB', 'periode', 'th2008', 'krisis', 'th2017', 'krisis2008', 'hasil', 'akhirnya', 'p1258',
  'sementara', 'lima', 'rata', 'p363', 'artinya', 'proE', 'kalahkan3', 'karena', 'terus', 'mengungguli', 'pasar', 'sulit', 'bahkanD',
  'berpengalaman', 'jadi', 'banyak', 'investor', 'memilih', 'indeksE', 'serius', 'justru', 'sederhana', 'masuk', 'akal'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S04_T = T;
export const S04_AKHIR = BATAS.s5;

const FERI = JALUR_WARNA.feri;
const PRO = JALUR_WARNA.speedboat; // dikelola profesional = speedboat (metafora Scene 01)
/** garis dana profesional di grafik: abu (Simon 19 Okt "warna bertabrakan") */
const GARIS_PRO = B.gray;
const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
/** serah-terima dari Scene 03: feri selesai menyeberang */
export const S03_FERI_AKHIR = { x: 1290, y: 610, d: 140 }; // relayout 22 Okt: Scene 03 papan I = peta sungai V04 (geometri Scene 01, jalur feri y 610)
/** feri di akhir Scene 04 (diserahkan ke Scene 05) */
export const S04_FERI_AKHIR = { x: 990, y: 490, d: 200 };

/* ── data taruhan (surat Berkshire Hathaway 2017, imbal hasil tahunan %; dicek: kumulatif = 125,8 % · A 21,7 · B 42,3 · C 87,7 · D 2,8 · E 27,0) ── */
const TAHUN = ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
const IDX = kumulatif([-37.0, 26.6, 15.1, 2.1, 16.0, 32.3, 13.6, 1.4, 11.9, 21.8]);
const DANA = [
  kumulatif([-16.5, 11.3, 5.9, -6.3, 3.4, 10.5, 4.7, 1.6, -3.2, 12.2]),
  kumulatif([-22.3, 14.5, 6.8, -1.3, 9.6, 15.2, 4.0, 2.5, 1.9, 10.6]),
  kumulatif([-21.3, 21.4, 13.3, 5.9, 5.7, 8.8, 18.9, 5.4, -1.7, 15.6]),
  kumulatif([-29.3, 16.5, 4.9, -6.3, 6.2, 14.2, 0.7, 1.4, 2.5, 0]), // D: 2017 "N/A" (dana ditutup) → nilai akhir tetap +2,8 %
  kumulatif([-30.1, 16.8, 11.9, -2.8, 9.1, 14.4, -2.1, -5.0, 4.4, 18.0]),
];
const RATA = IDX.map((_, i) => DANA.reduce((s, d) => s + d[i], 0) / DANA.length); // akhir 136,3 = +36,3 %
const MODAL = 1_000_000;
const nilaiDi = (v: number[], g: number) => {
  const n = v.length - 1, u = Math.max(0, Math.min(1, g)) * n, i = Math.min(n - 1, Math.floor(u)), t = Math.min(1, u - i);
  return v[i] + (v[i + 1] - v[i]) * t;
};
const rp = (v: number) => rpPenuh(Math.round(v / 1000) * 1000);

/* ── tata letak ── */
const KA = { w: 480, h: 440, x: [560, 1360], y: 540, disc: 170, discY: 130 }; // kartu Indeks · kartu Profesional
const TENGAH = { x: 960, trofi: 455, d: 150 };
const PANEL = { x: 960, y: 530, w: 1560, h: 680 };
const PLOT = { x0: 400, y0: 330, w: 1000, h: 440 };
const DOM: [number, number] = [50, 240];
const LEGENDA = { y: 262, feri: 262, pro: 660, d: 56 };
const yV = (v: number) => yDari(v, PLOT.y0, PLOT.h, DOM[0], DOM[1]);
const KH = { w: 560, h: 480, x: [600, 1320], y: 530 }; // kartu hasil ("Artinya")
const PD = { orang: { x: 520, y: 480, D: 300 }, kartu: { x: 1250, y: 500, w: 760, h: 360 } };
const PE = { orang: { x: 480, y: 480, D: 280 }, chev: 735, feri: S04_FERI_AKHIR, chip: { x: 1450, y: [400, 500, 600] } };

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

const teksTengah = (top: number, size: number, warna = B.night): React.CSSProperties =>
  ({ position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: F, fontSize: size, fontWeight: 800, color: warna, whiteSpace: 'nowrap', lineHeight: 1.15 });

export const Scene04: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f > S04_AKHIR + 90) return null;

  /* ═ A–B: dua kartu (Indeks · Dikelola profesional) ═ */
  const serah = cin(f, A0 + 30); // feri Scene 03 → kartu Indeks
  const ruang = cin(f, T.pro - 24); // kartu Indeks di tengah dulu, ke kiri memberi ruang kartu profesional
  const menyatu = cin(f, T.periode + 10); // C: dua kartu menyatu jadi panel grafik
  const xKiri = lerp(960, KA.x[0], ruang);
  const kartu = [0, 1].map((i) => {
    const x0 = i === 0 ? xKiri : KA.x[1];
    return { x: lerp(x0, PANEL.x, menyatu), y: lerp(KA.y, PANEL.y, menyatu), w: lerp(KA.w, PANEL.w, menyatu), h: lerp(KA.h, PANEL.h, menyatu) };
  });
  const discA = (i: number) => ({ x: i === 0 ? xKiri : KA.x[1], y: KA.y - KA.h / 2 + KA.discY });
  const feriAB = {
    x: lerp(S03_FERI_AKHIR.x, discA(0).x, serah), y: lerp(S03_FERI_AKHIR.y, discA(0).y, serah), d: lerp(S03_FERI_AKHIR.d, KA.disc, serah),
  };
  const feri = { x: lerp(feriAB.x, LEGENDA.feri, menyatu), y: lerp(feriAB.y, LEGENDA.y, menyatu), d: lerp(feriAB.d, LEGENDA.d, menyatu) };
  const pro = { x: lerp(discA(1).x, LEGENDA.pro, menyatu), y: lerp(discA(1).y, LEGENDA.y, menyatu), d: lerp(KA.disc, LEGENDA.d, menyatu) };
  const isiAB = 1 - cin(f, T.periode - 10, 30); // isi kartu & kolom taruhan pudar saat menyatu
  /* ═ C: grafik ═ */
  const keluarC = popOut(f, T.artinya - 10);
  const panelP = cin(f, T.periode + 10) * keluarC;
  const sumbu = cin(f, T.th2008 - 20);
  const gKrisis = 0.1 * cin(f, T.krisis + 20, 60);
  const gIdx = gKrisis + 0.9 * R(f, T.akhirnya, T.p1258 - 5, 0, 1, io);
  const gRata = gKrisis + 0.9 * R(f, T.rata - 20, T.p363 - 5, 0, 1, io);
  const gDana = R(f, T.sementara, T.lima + 80, 0, 1, io);
  /* ═ "Artinya": dua kartu hasil ═ */
  const hasilKeluar = 1 - cin(f, T.karena - 10, 30);
  /* ═ D ═ */
  const papanD = cin(f, T.karena, 30) * (1 - cin(f, T.jadi - 10, 30));
  const orangD = lerp(960, PD.orang.x, cin(f, T.terus - 34)); // orang berjas di tengah dulu, ke kiri memberi ruang kartu
  /* ═ E ═ */
  const papanE = cin(f, T.jadi, 30) * (1 - cin(f, S04_AKHIR + 20, 40));
  const orangE = lerp(960, PE.orang.x, cin(f, T.memilih - 24)); // investor di tengah dulu, ke kiri memberi ruang feri

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A–B → C: dua kartu → MENYATU jadi panel grafik ══ */}
      <ArahKeluar aktif={f > T.artinya - 40}>
      {keluarC > 0.001 ? [0, 1].map((i) => {
        const k = kartu[i];
        const p = i === 0 ? popIn(f, T.mungkin) : popIn(f, T.pro);
        const indeks = i === 0;
        return (
          <Kaca key={i} x={k.x} y={k.y} w={k.w} h={k.h} p={p * keluarC} warna={indeks ? FERI : PRO} tab="atas" alfa={i === 1 ? 1 - menyatu : 1}>
            {isiAB > 0.001 ? (
              <div style={{ position: 'absolute', inset: 0, opacity: isiAB < 0.9999 ? isiAB : undefined }}>
                {indeks ? (
                  <>
                    <div style={{ ...teksTengah(232, 36), opacity: 1 - cin(f, T.sp - 10, 30) }}><WordText f={f} at={T.mungkin + 20} halus>Indeks</WordText></div>
                    <div style={teksTengah(232, 36)}><WordText f={f} at={T.sp + 10} halus>Indeks S&P 500</WordText></div>
                    <Chip x={KA.w / 2} y={322} teks="Sederhana" ikon="rasional" warna={FERI} p={popIn(f, T.sesederhana)} size={28} />
                    <Chip x={KA.w / 2} y={390} teks="Pilihan Warren Buffett" ikon="trofi" warna={B.orange} p={popIn(f, T.buffett + 10)} size={26} />
                  </>) : (
                  <>
                    <div style={teksTengah(232, 36)}><WordText f={f} at={T.pro + 10} halus>Dikelola profesional</WordText></div>
                    <Chip x={KA.w / 2} y={322} teks="Hasil lebih bagus?" ikon="pertumbuhan" warna={PRO} p={popIn(f, T.bagus)} size={28} />
                    <Chip x={KA.w / 2} y={390} teks="Beberapa dana" ikon="portofolio" warna={PRO} p={popIn(f, T.beberapa + 10)} size={28} />
                  </>)}
              </div>) : null}
            {/* C: isi panel grafik */}
            {menyatu > 0.001 && indeks ? (
              <div style={{ position: 'absolute', inset: 0, opacity: menyatu < 0.9999 ? menyatu : undefined }}>
                <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                  <g transform={`translate(${PANEL.w / 2 - PANEL.x} ${PANEL.h / 2 - PANEL.y})`}>
                    <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.w / 10} height={PLOT.h} fill={rgba(ARAH.turun, 0.1 * cin(f, T.krisis))} />
                    {[50, 100, 150, 200].map((v) => (
                      <g key={v}>
                        <line x1={PLOT.x0} x2={PLOT.x0 + PLOT.w * sumbu} y1={yV(v)} y2={yV(v)} stroke={rgba(B.gray, v === 100 ? 0.45 : 0.2)} strokeWidth={v === 100 ? 2 : 1.5} />
                        <text x={PLOT.x0 - 18} y={yV(v) + 8} textAnchor="end" fontFamily={F} fontSize={24} fontWeight={700} fill={B.gray} opacity={sumbu}>{v === 100 ? '0%' : `${v > 100 ? '+' : '−'}${Math.abs(v - 100)}%`}</text>
                      </g>))}
                    <text x={PANEL.x + PANEL.w / 2 - 48} y={LEGENDA.y + 9} textAnchor="end" fontFamily={F} fontSize={24} fontWeight={700} fill={B.gray} opacity={sumbu}>Modal Rp1.000.000 · 2008–2017</text>
                    {TAHUN.map((t, i) => (
                      <text key={t} x={PLOT.x0 + (i + 0.5) * (PLOT.w / 10)} y={PLOT.y0 + PLOT.h + 36} textAnchor="middle" fontFamily={F} fontSize={24} fontWeight={700} fill={B.gray}
                        opacity={cin(f, T.th2008 + (i * (T.th2017 - T.th2008)) / 9, 30)}>{t}</text>))}
                    {DANA.map((d, k) => gDana > 0.001 ? (
                      <polyline key={k} points={garis(d, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], gDana)} fill="none" stroke={B.grayLite}
                        strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" opacity={0.45} />) : null)}
                    {[{ v: RATA, g: gRata, w: GARIS_PRO }, { v: IDX, g: gIdx, w: FERI }].map((s, k) => s.g > 0.001 ? (
                      <g key={k}>
                        <polyline points={garis(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], s.g)} fill="none" stroke={s.w} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
                        {(() => { const [hx, hy] = ujungGaris(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], s.g); return <circle cx={hx} cy={hy} r={10} fill={B.white} stroke={s.w} strokeWidth={5} />; })()}
                      </g>) : null)}
                  </g>
                </svg>
                <div style={{ position: 'absolute', left: LEGENDA.feri + 44 - (PANEL.x - PANEL.w / 2), top: LEGENDA.y - 22 - (PANEL.y - PANEL.h / 2), fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
                  <WordText f={f} at={T.periode + 40} halus>Indeks S&P 500</WordText>
                </div>
                <div style={{ position: 'absolute', left: LEGENDA.pro + 44 - (PANEL.x - PANEL.w / 2), top: LEGENDA.y - 22 - (PANEL.y - PANEL.h / 2), fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
                  <WordText f={f} at={T.periode + 60} halus>Dikelola profesional</WordText>
                </div>
              </div>) : null}
          </Kaca>);
      }) : null}
      {panelP > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Chip x={PLOT.x0 + PLOT.w / 20} y={PLOT.y0 + 30} teks="Krisis 2008" warna={ARAH.turun} p={popIn(f, T.krisis + 10)} size={24} />
          {/* Rupiah berjalan di ujung garis (modal Rp1.000.000) */}
          {[{ v: IDX, g: gIdx, dy: -48 }, { v: RATA, g: gRata, dy: 48 }].map((s, k) => {
            if (s.g <= 0.001) return null;
            const [hx, hy] = ujungGaris(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], s.g);
            const v = (MODAL * nilaiDi(s.v, s.g)) / 100;
            return <PilNominal key={k} x={hx - 14} y={hy + s.dy} teks={rp(v)} arah={Math.max(-1, Math.min(1, ((v - MODAL) / MODAL) * 6))} p={popIn(f, k === 0 ? T.akhirnya : T.rata - 20)}
              size={24} jangkar="kanan" lebarMin={200} />;
          })}
          <PilSeri x={PLOT.x0 + PLOT.w + 30} y={yV(IDX[10])} teks="+125,8%" warna={FERI} p={popIn(f, T.p1258)} />
          <PilSeri x={PLOT.x0 + PLOT.w + 30} y={yV(RATA[10])} teks="Rata-rata +36,3%" warna={GARIS_PRO} p={popIn(f, T.p363)} />
        </div>) : null}

      {/* ══ kolom tengah taruhan (A–B) ══ */}
      {isiAB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(isiAB, true) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${KA.x[0] + KA.w / 2 + 8} ${TENGAH.trofi} L ${TENGAH.x - TENGAH.d / 2 - 12} ${TENGAH.trofi}`} g={cin(f, T.bertaruh, 60)} warna={FERI} tebal={4} titik={false} />
            <Penghubung d={`M ${KA.x[1] - KA.w / 2 - 8} ${TENGAH.trofi} L ${TENGAH.x + TENGAH.d / 2 + 12} ${TENGAH.trofi}`} g={cin(f, T.kalahkan - 20, 90)} warna={PRO} tebal={4} titik={false} />
          </svg>
          <Tanya x={TENGAH.x} y={TENGAH.trofi} d={110} p={popIn(f, T.bukannya) * popOut(f, T.taruhan - 30)} />
          <Bulat x={TENGAH.x} y={TENGAH.trofi} d={TENGAH.d} warna={B.orange} ikon="trofi" p={popIn(f, T.taruhan + 15)} />
          <Label x={TENGAH.x} y={TENGAH.trofi + TENGAH.d / 2 + 40} teks="Taruhan" f={f} at={T.taruhan + 25} size={34} lebar={300} />
          <Chip x={TENGAH.x} y={TENGAH.trofi + 200} teks="Akhir 2007" ikon="kalender" warna={B.blue} p={popIn(f, T.th2007)} size={26} />
          <Chip x={TENGAH.x} y={TENGAH.trofi + 270} teks="10 tahun" ikon="waktu" warna={B.blue} p={popIn(f, T.sepuluh)} size={26} />
        </div>) : null}

      {/* ══ kendaraan (A–C): feri dari Scene 03 · speedboat profesional → legenda grafik ══ */}
      {keluarC > 0.001 ? (
        <>
          <Kendaraan x={feri.x} y={feri.y} d={feri.d} warna={FERI} ikon="feri" cermin p={keluarC} />
          <Kendaraan x={pro.x} y={pro.y} d={pro.d} warna={PRO} ikon="speedboat" cermin p={popIn(f, T.pro + 10) * keluarC} />
          <Lencana x={pro.x} y={pro.y} d={pro.d} p={popIn(f, T.pro + 30) * (1 - menyatu)} warna={B.night} ikon="kapten" besar={64} />
        </>) : null}
      </ArahKeluar>

      {/* ══ "Artinya, profesional pun nggak selalu bisa mengalahkan indeks": dua kartu hasil ══ */}
      {f > T.artinya - 30 && hasilKeluar > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(hasilKeluar, true) }}>
          {[0, 1].map((i) => {
            const indeks = i === 0;
            const at = indeks ? T.artinya + 10 : T.proE;
            return (
              <Kaca key={i} x={KH.x[i]} y={KH.y} w={KH.w} h={KH.h} p={popIn(f, at)} warna={indeks ? FERI : PRO} tab="atas" tepi={indeks ? cin(f, T.kalahkan3) : 0}
                alfa={indeks ? 1 : 1 - 0.35 * cin(f, T.kalahkan3)}>
                <Kendaraan x={KH.w / 2} y={150} d={170} warna={indeks ? FERI : PRO} ikon={indeks ? 'feri' : 'speedboat'} cermin p={popIn(f, at + 10)} />
                {indeks ? <Lencana x={KH.w / 2} y={150} d={170} p={popIn(f, T.kalahkan3)} warna={B.orange} ikon="trofi" besar={74} /> : null}
                <div style={teksTengah(262, 34)}><WordText f={f} at={at + 20} halus>{indeks ? 'Indeks S&P 500' : 'Dikelola profesional'}</WordText></div>
                <div style={{ ...teksTengah(326, 72, ARAH.naik), fontVariantNumeric: 'tabular-nums', opacity: cin(f, at + 30) }}>{indeks ? '+125,8%' : '+36,3%'}</div>
                <div style={{ ...teksTengah(414, 26, B.gray), fontWeight: 700, opacity: cin(f, at + 40) }}>{indeks ? 'Rp1.000.000 → Rp2.258.000' : 'Rp1.000.000 → Rp1.363.000'}</div>
              </Kaca>);
          })}
        </div>) : null}

      {/* ══ D: terus mengungguli pasar itu sulit — bahkan untuk yang berpengalaman ══ */}
      {papanD > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanD, f > T.jadi - 30) }}>
          <KarakterLingkar pose={INVESTOR_JAS} x={orangD} y={PD.orang.y} D={PD.orang.D} s={popIn(f, T.karena)} warna={B.blue} />
          <Chip x={orangD} y={PD.orang.y + PD.orang.D / 2 + 46} teks="Berpengalaman" ikon="kapten" warna={B.blue} p={popIn(f, T.bahkanD + 10)} size={28} />
          <Kaca x={PD.kartu.x} y={PD.kartu.y} w={PD.kartu.w} h={PD.kartu.h} p={popIn(f, T.terus - 10)} warna={B.orange} tab="atas">
            <Bulat x={96} y={110} d={110} warna={B.orange} ikon="menebak" p={popIn(f, T.terus)} />
            <div style={{ position: 'absolute', left: 176, top: 66, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
              <WordText f={f} at={T.terus} halus>Terus mengungguli</WordText>
              <br />
              <WordText f={f} at={T.pasar} halus>pasar</WordText>
            </div>
            <div style={{ position: 'absolute', left: 64, top: 236, fontFamily: F, fontSize: 26, fontWeight: 700, color: B.gray, opacity: cin(f, T.mengungguli + 10) }}>Tingkat kesulitan</div>
            {/* meter 5 ruas, terisi di "sulit" (trim kiri → kanan) */}
            {[0, 1, 2, 3, 4].map((k) => {
              const isi = cin(f, T.sulit - 20 + k * 8, 30);
              return (
                <div key={k} style={{ position: 'absolute', left: 64 + k * 98, top: 286, width: 88, height: 34, borderRadius: 17, background: rgba(B.gray, 0.16), overflow: 'hidden',
                  opacity: cin(f, T.mengungguli + 10 + k * 4) }}>
                  <div style={{ width: `${isi * 100}%`, height: '100%', borderRadius: 17, background: B.orange }} />
                </div>);
            })}
            <Chip x={PD.kartu.w - 150} y={303} teks="Sulit" warna={B.orange} p={popIn(f, T.sulit + 20)} size={30} />
          </Kaca>
        </div>) : null}

      {/* ══ E: banyak investor › memilih indeks — "Nggak serius" dicoret → "Sederhana" · "Masuk akal"; feri diserahkan ke Scene 05 ══ */}
      {papanE > 0.001 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanE, f > S04_AKHIR) }}>
            <KarakterLingkar pose={MURID_BIRU} x={orangE} y={PE.orang.y} D={PE.orang.D} s={popIn(f, T.banyak)} warna={B.orange} />
            <Label x={orangE} y={PE.orang.y + PE.orang.D / 2 + 40} teks="Banyak investor" f={f} at={T.investor} size={32} lebar={360} />
            <Chevron x={PE.chev} y={PE.orang.y} warna={FERI} p={popIn(f, T.memilih - 10)} />
            <Label x={PE.feri.x} y={PE.feri.y + PE.feri.d / 2 + 40} teks="Memilih indeks" f={f} at={T.memilih + 10} size={32} lebar={360} />
            <Chip x={PE.chip.x} y={PE.chip.y[0]} teks="Nggak serius" ikon="sofa" warna={B.gray} p={popIn(f, T.serius)} coret={R(f, T.serius + 24, T.serius + 54, 0, 1, io)} size={30} />
            <Chip x={PE.chip.x} y={PE.chip.y[1]} teks="Sederhana" ikon="rasional" warna={CEK} p={popIn(f, T.sederhana)} size={32} />
            <Chip x={PE.chip.x} y={PE.chip.y[2]} teks="Masuk akal" ikon="tersedia" warna={CEK} p={popIn(f, T.masuk + 10)} size={32} />
          </div>
          {f < S04_AKHIR ? <Kendaraan x={PE.feri.x} y={PE.feri.y} d={PE.feri.d} warna={FERI} ikon="feri" cermin p={popIn(f, T.memilih)} /> : null}
        </>) : null}
    </AbsoluteFill>);
};
