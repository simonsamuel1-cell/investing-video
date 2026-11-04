import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, bayanganKecil, CEK, F, io, R, rgba, SISI } from '../theme';
import { cin, cinV, gayaPapan, KataTopeng, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { Chevron, GeoKartu, INVESTOR_NAVY, Kaca, KacaMorf, KarakterLingkar, Penghubung, PoseKarakter } from '../parts/kaca';
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
export const S03_FERI_AKHIR = { x: 1290, y: 579, d: 140 }; // Scene 03 papan I = peta sungai (geometri revisi Scene 01, jalur feri y 579)
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
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(0, -50%) scale(${skalaPop(p)})`, transformOrigin: 'center', background: warna,
    color: B.white, fontFamily: F, fontSize: 30, fontWeight: 800, padding: '9px 20px', borderRadius: 999, whiteSpace: 'nowrap', lineHeight: 1,
    boxShadow: bayanganKecil(warna), fontVariantNumeric: 'tabular-nums' }}>{teks}</div>);

/** lingkaran "?" (bukan ikon: tanda baca) */
const Tanya: React.FC<{ x: number; y: number; d: number; p: number }> = ({ x, y, d, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.blue}`, boxSizing: 'border-box',
    color: B.blue, display: 'grid', placeItems: 'center',
    fontFamily: F, fontWeight: 800, fontSize: d * 0.56, lineHeight: 1, transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`,
    boxShadow: bayanganKecil(B.blue) }}>?</div>);

const teksTengah = (top: number, size: number, warna = B.night): React.CSSProperties =>
  ({ position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: F, fontSize: size, fontWeight: 800, color: warna, whiteSpace: 'nowrap', lineHeight: 1.15 });

/* ═════════ geometri lintas papan (Simon 22 Okt: bentuk sama dibawa; 2 → 1 digabung) ═════════ */
const GEO_PANEL: GeoKartu = { x: PANEL.x, y: PANEL.y, w: PANEL.w, h: PANEL.h, warna: FERI, tab: 'atas' };
const GEO_KH = (i: number): GeoKartu => ({ x: KH.x[i], y: KH.y, w: KH.w, h: KH.h, warna: i === 0 ? FERI : PRO, tab: 'atas' });
const GEO_D: GeoKartu = { x: PD.kartu.x, y: PD.kartu.y, w: PD.kartu.w, h: PD.kartu.h, warna: B.orange, tab: 'atas' };
/** kendaraan kartu hasil (layar) · ikon kartu D (tujuan gabungan feri + speedboat) */
const DISC_KH = (i: number) => ({ x: KH.x[i], y: KH.y - KH.h / 2 + 150, d: 170 });
const IKON_D = { x: PD.kartu.x - PD.kartu.w / 2 + 96, y: PD.kartu.y - PD.kartu.h / 2 + 110, d: 110 };

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
  const bawa = (a: { x: number; y: number; d: number }, i: number) => {
    const l = { x: i === 0 ? LEGENDA.feri : LEGENDA.pro, y: LEGENDA.y, d: LEGENDA.d }, h = DISC_KH(i);
    const t = [cin(f, T.periode + 10), cin(f, T.artinya), cin(f, T.terus - 10)];
    const x = lerp(lerp(lerp(a.x, l.x, t[0]), h.x, t[1]), IKON_D.x, t[2]), y = lerp(lerp(lerp(a.y, l.y, t[0]), h.y, t[1]), IKON_D.y, t[2]);
    return { x, y, d: lerp(lerp(lerp(a.d, l.d, t[0]), h.d, t[1]), IKON_D.d, t[2]) };
  };
  const feri = bawa(feriAB, 0);
  const pro = bawa({ ...discA(1), d: KA.disc }, 1);
  const isiAB = 1 - cin(f, T.periode + 10); // isi kartu & kolom taruhan pudar bersama penyatuan (60f yang sama)
  /* ═ C: grafik ═ */
  const keluarC = popOut(f, T.artinya); // transisi seragam 22 Okt: papan keluar = papan baru masuk, 60f di kata
  const panelP = cin(f, T.periode + 10) * keluarC;
  const sumbu = cin(f, T.th2008 - 20);
  const gKrisis = 0.1 * cin(f, T.krisis + 20);
  const gIdx = gKrisis + 0.9 * R(f, T.akhirnya, T.akhirnya + 60, 0, 1, io);
  const gRata = gKrisis + 0.9 * R(f, T.rata - 20, T.rata + 40, 0, 1, io);
  const gDana = R(f, T.sementara, T.sementara + 60, 0, 1, io);
  /* ═ "Artinya": panel grafik TERBELAH jadi dua kartu hasil (legenda feri & speedboat DIBAWA ke kartunya) ═ */
  const belah = cin(f, T.artinya);
  const gabungD = cin(f, T.terus - 10); // dua kartu hasil DIGABUNG jadi kartu "Terus mengungguli pasar" (D)
  /* ═ D ═ */
  const orangD = PD.orang.x;
  const keluarD = cin(f, T.jadi);
  /* ═ E ═ */
  const keluarE = cin(f, S04_AKHIR + 30); // dorong ke atas sampai keluar frame, bersamaan feri diserahkan ke S05 (cin A0+30)
  const orangE = lerp(960, PE.orang.x, cin(f, T.memilih - 24)); // investor di tengah dulu, ke kiri memberi ruang feri

  /* ── isi lintas papan ── */
  const isiGrafik = (
    <>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`translate(${PANEL.w / 2 - PANEL.x} ${PANEL.h / 2 - PANEL.y})`}>
          <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.w / 10} height={PLOT.h} fill={rgba(ARAH.turun, 0.1 * cin(f, T.krisis))} />
          {[50, 100, 150, 200].map((v) => (
            <line key={v} x1={PLOT.x0} x2={PLOT.x0 + PLOT.w * sumbu} y1={yV(v)} y2={yV(v)} stroke={rgba(B.gray, v === 100 ? 0.45 : 0.2)} strokeWidth={v === 100 ? 2 : 1.5} />))}
          {DANA.map((d, k) => gDana > 0 ? (
            <polyline key={k} points={garis(d, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], gDana)} fill="none" stroke={B.grayLite}
              strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" opacity={0.45} />) : null)}
          {[{ v: RATA, g: gRata, w: GARIS_PRO }, { v: IDX, g: gIdx, w: FERI }].map((s, k) => s.g > 0 ? (
            <g key={k}>
              <polyline points={garis(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], s.g)} fill="none" stroke={s.w} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
              {(() => { const [hx, hy] = ujungGaris(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], s.g); return <circle cx={hx} cy={hy} r={10 * skalaPop(popIn(f, T.krisis + 20))} fill={B.white} stroke={s.w} strokeWidth={5} />; })()} {/* titik kepala garis POP 60f bersama awal garis (dulu penuh seketika) */}
            </g>) : null)}
        </g>
      </svg>
      {/* label sumbu, keterangan modal & tahun: teks bertopeng (dulu pudar) */}
      {[50, 100, 150, 200].map((v, k) => (
        <div key={v} style={{ position: 'absolute', right: PANEL.w - (PLOT.x0 - (PANEL.x - PANEL.w / 2) - 18), top: yV(v) - (PANEL.y - PANEL.h / 2) - 16, fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
          <WordText f={f} at={T.th2008 - 20 + k * 6} halus>{v === 100 ? '0%' : `${v > 100 ? '+' : '−'}${Math.abs(v - 100)}%`}</WordText>
        </div>))}
      <div style={{ position: 'absolute', right: 48, top: LEGENDA.y - (PANEL.y - PANEL.h / 2) - 16, fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.th2008 - 10} halus>Modal Rp1.000.000 · 2008–2017</WordText>
      </div>
      {TAHUN.map((t, i) => (
        <div key={t} style={{ position: 'absolute', left: PLOT.x0 - (PANEL.x - PANEL.w / 2) + (i + 0.5) * (PLOT.w / 10) - 40, width: 80, top: PLOT.y0 + PLOT.h - (PANEL.y - PANEL.h / 2) + 12,
          textAlign: 'center', fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>
          <WordText f={f} at={T.th2008 + (i * (T.th2017 - T.th2008)) / 9} halus>{t}</WordText>
        </div>))}
      <div style={{ position: 'absolute', left: LEGENDA.feri + 44 - (PANEL.x - PANEL.w / 2), top: LEGENDA.y - 22 - (PANEL.y - PANEL.h / 2), fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
        <WordText f={f} at={T.periode + 40} halus>Indeks S&P 500</WordText>
      </div>
      <div style={{ position: 'absolute', left: LEGENDA.pro + 44 - (PANEL.x - PANEL.w / 2), top: LEGENDA.y - 22 - (PANEL.y - PANEL.h / 2), fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
        <WordText f={f} at={T.periode + 60} halus>Dikelola profesional</WordText>
      </div>
    </>);
  const isiHasil = (i: number) => {
    const indeks = i === 0;
    const at = indeks ? T.artinya : T.proE;
    return (<>
      <div style={teksTengah(262, 34)}><WordText f={f} at={at + 20} halus>{indeks ? 'Indeks S&P 500' : 'Dikelola profesional'}</WordText></div>
      <div style={{ ...teksTengah(326, 72, ARAH.naik), fontVariantNumeric: 'tabular-nums' }}><KataTopeng masuk={cin(f, at + 30)} vMasuk={cinV(f, at + 30)} size={72}>{indeks ? '+125,8%' : '+36,3%'}</KataTopeng></div>
      <div style={{ ...teksTengah(414, 26, B.gray), fontWeight: 700 }}><WordText f={f} at={at + 40} halus>{indeks ? 'Rp1.000.000 → Rp2.258.000' : 'Rp1.000.000 → Rp1.363.000'}</WordText></div>
    </>);
  };
  const isiD = (
    <>
      <Bulat x={96} y={110} d={110} warna={B.orange} ikon="menebak" p={popIn(f, T.terus + 20)} />
      <div style={{ position: 'absolute', left: 176, top: 66, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
        <WordText f={f} at={T.terus} halus>Terus mengungguli</WordText>
        <br />
        <WordText f={f} at={T.pasar} halus>pasar</WordText>
      </div>
      <div style={{ position: 'absolute', left: 64, top: 236, fontFamily: F, fontSize: 26, fontWeight: 700, color: B.gray }}>
        <WordText f={f} at={T.mengungguli + 10} halus>Tingkat kesulitan</WordText>
      </div>
      {/* meter 5 ruas (pil bulat = POP), terisi di "sulit" (trim kiri → kanan) */}
      {[0, 1, 2, 3, 4].map((k) => {
        const isi = cin(f, T.sulit - 20 + k * 8);
        const p = popIn(f, T.mengungguli + 10 + k * 4);
        return p <= 0.001 ? null : (
          <div key={k} style={{ position: 'absolute', left: 64 + k * 98, top: 286, width: 88, height: 34, borderRadius: 17, background: rgba(B.gray, 0.16), overflow: 'hidden',
            transform: `scale(${skalaPop(p)})` }}>
            <div style={{ width: `${isi * 100}%`, height: '100%', borderRadius: 17, background: B.orange }} />
          </div>);
      })}
      <Chip x={PD.kartu.w - 150} y={303} teks="Sulit" warna={B.orange} p={popIn(f, T.sulit + 20)} size={30} />
    </>);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A–B → C: dua kartu → MENYATU jadi panel grafik → di "Artinya" panel TERBELAH jadi dua kartu hasil ══ */}
      {belah < 0.001 ? [0, 1].map((i) => {
        const k = kartu[i];
        const p = i === 0 ? popIn(f, T.mungkin) : popIn(f, T.pro);
        const indeks = i === 0;
        return (
          <Kaca key={i} x={k.x} y={k.y} w={k.w} h={k.h} p={p} warna={indeks ? FERI : PRO} tab="atas" alfa={i === 1 ? 1 - menyatu : 1}>
            {isiAB > 0 ? (
              <div style={{ position: 'absolute', inset: 0, opacity: isiAB < 0.9999 ? isiAB : undefined }}>
                {indeks ? (
                  <>
                    <div style={teksTengah(232, 36)}><WordText f={f} at={T.mungkin + 20} until={T.sp} halus>Indeks</WordText></div>
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
            {menyatu > 0 && indeks ? <div style={{ position: 'absolute', inset: 0, opacity: menyatu < 0.9999 ? menyatu : undefined }}>{isiGrafik}</div> : null}
          </Kaca>);
      }) : belah < 1 ? [0, 1].map((i) => (
        <KacaMorf key={i} a={GEO_PANEL} b={GEO_KH(i)} t={belah} isiA={i === 0 ? isiGrafik : undefined} isiB={isiHasil(i)} peran={i === 1 ? 'belah' : undefined} />)) : null}
      {panelP > 0 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Chip x={PLOT.x0 + PLOT.w / 20} y={PLOT.y0 + 30} teks="Krisis 2008" warna={ARAH.turun} p={popIn(f, T.krisis + 10) * keluarC} size={24} />
          {/* Rupiah berjalan di ujung garis (modal Rp1.000.000) */}
          {[{ v: IDX, g: gIdx, dy: -48 }, { v: RATA, g: gRata, dy: 48 }].map((s, k) => {
            if (s.g <= 0.001) return null;
            const [hx, hy] = ujungGaris(s.v, PLOT.x0, PLOT.y0, PLOT.w, PLOT.h, DOM[0], DOM[1], s.g);
            const v = (MODAL * nilaiDi(s.v, s.g)) / 100;
            // pil berjangkar kanan di ujung garis; dijepit agar tepi kirinya tetap di dalam plot (dulu menutupi label sumbu "−50%" di 2008–2009)
            return <PilNominal key={k} x={Math.max(hx - 14, PLOT.x0 + 8 + 216)} y={hy + s.dy} teks={rp(v)} arah={Math.max(-1, Math.min(1, ((v - MODAL) / MODAL) * 6))} p={popIn(f, k === 0 ? T.akhirnya : T.rata - 20) * keluarC}
              size={24} jangkar="kanan" lebarMin={200} />;
          })}
          <PilSeri x={PLOT.x0 + PLOT.w + 30} y={yV(IDX[10])} teks="+125,8%" warna={FERI} p={popIn(f, T.p1258) * keluarC} />
          <PilSeri x={PLOT.x0 + PLOT.w + 30} y={yV(RATA[10])} teks="Rata-rata +36,3%" warna={GARIS_PRO} p={popIn(f, T.p363) * keluarC} />
        </div>) : null}

      {/* ══ kolom tengah taruhan (A–B) ══ */}
      {isiAB > 0 ? (
        <>
          {/* kolom taruhan keluar bersama penyatuan: garis ditarik balik (trim), ikon/chip pop keluar, teks naik keluar topeng */}
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${KA.x[0] + KA.w / 2 + 8} ${TENGAH.trofi} L ${TENGAH.x - TENGAH.d / 2 - 12} ${TENGAH.trofi}`} g={cin(f, T.bertaruh) * isiAB} warna={FERI} tebal={4} titik={false} />
            <Penghubung d={`M ${KA.x[1] - KA.w / 2 - 8} ${TENGAH.trofi} L ${TENGAH.x + TENGAH.d / 2 + 12} ${TENGAH.trofi}`} g={cin(f, T.kalahkan - 20) * isiAB} warna={PRO} tebal={4} titik={false} />
          </svg>
          <Tanya x={TENGAH.x} y={TENGAH.trofi} d={110} p={popIn(f, T.bukannya) * popOut(f, T.taruhan - 30)} />
          <Bulat x={TENGAH.x} y={TENGAH.trofi} d={TENGAH.d} warna={B.orange} ikon="trofi" p={popIn(f, T.taruhan + 15) * popOut(f, T.periode + 10)} />
          <Label x={TENGAH.x} y={TENGAH.trofi + TENGAH.d / 2 + 40} teks="Taruhan" f={f} at={T.taruhan + 25} keluar={T.periode + 10} size={34} lebar={300} />
          <Chip x={TENGAH.x} y={TENGAH.trofi + 200} teks="Akhir 2007" ikon="kalender" warna={B.blue} p={popIn(f, T.th2007) * popOut(f, T.periode + 10)} size={26} />
          <Chip x={TENGAH.x} y={TENGAH.trofi + 270} teks="10 tahun" ikon="waktu" warna={B.blue} p={popIn(f, T.sepuluh) * popOut(f, T.periode + 10)} size={26} />
        </>) : null}

      {/* ══ "Artinya, profesional pun nggak selalu bisa mengalahkan indeks": dua kartu hasil (belahan panel) → DIGABUNG jadi kartu D ══ */}
      {belah >= 1 && gabungD < 1 ? [0, 1].map((i) => (
        gabungD > 0
          ? <KacaMorf key={i} a={GEO_KH(i)} b={GEO_D} t={gabungD} isiA={isiHasil(i)} isiB={i === 0 ? isiD : undefined}
              tepi={i === 0 ? cin(f, T.kalahkan3) : 0} alfa={i === 0 ? 1 : 1 - 0.35 * cin(f, T.kalahkan3)} peran={i === 0 ? undefined : 'gabung'} />
          : <Kaca key={i} x={KH.x[i]} y={KH.y} w={KH.w} h={KH.h} p={1} warna={i === 0 ? FERI : PRO} tab="atas" tepi={i === 0 ? cin(f, T.kalahkan3) : 0}
              alfa={i === 0 ? 1 : 1 - 0.35 * cin(f, T.kalahkan3)}>{isiHasil(i)}</Kaca>)) : null}

      {/* ══ D: terus mengungguli pasar itu sulit — bahkan untuk yang berpengalaman ══ */}
      {gabungD > 0 && keluarD < 1 ? (
        <>
          {/* "orang yang sudah berpengalaman" = profesional berjas NAVY tanpa nametag — jas abu ber-nametag = figur GURU (Simon 22 Okt) */}
          <KarakterLingkar pose={INVESTOR_NAVY} x={orangD} y={PD.orang.y} D={PD.orang.D} s={popIn(f, T.bahkanD - 20) * popOut(f, T.jadi)} warna={B.blue} />
          <Chip x={orangD} y={PD.orang.y + PD.orang.D / 2 + 46} teks="Berpengalaman" ikon="kapten" warna={B.blue} p={popIn(f, T.bahkanD + 10) * popOut(f, T.jadi)} size={28} />
          {gabungD >= 1 ? <Kaca x={PD.kartu.x} y={PD.kartu.y} w={PD.kartu.w} h={PD.kartu.h} p={1} keluar={popOut(f, T.jadi)} warna={B.orange} tab="atas">{isiD}</Kaca> : null}
        </>) : null}

      {/* ══ kendaraan DIBAWA: feri Scene 03 → kartu Indeks → legenda grafik → kartu hasil → (keduanya DIGABUNG) ikon kartu D ══ */}
      {gabungD < 1 ? (
        <>
          <Kendaraan x={feri.x} y={feri.y} d={feri.d} warna={FERI} ikon="feri" cermin p={1} />
          <Kendaraan x={pro.x} y={pro.y} d={pro.d} warna={PRO} ikon="speedboat" cermin p={popIn(f, T.pro + 10)} />
          <Lencana x={pro.x} y={pro.y} d={pro.d} p={popIn(f, T.pro + 30) * popOut(f, T.periode + 10)} warna={B.night} ikon="kapten" besar={64} />
          {/* piala kartu Indeks (hasil): pop, keluar saat kartu digabung */}
          <Lencana x={feri.x} y={feri.y} d={feri.d} p={popIn(f, T.kalahkan3) * popOut(f, T.terus - 10)} warna={B.orange} ikon="trofi" besar={74} />
        </>) : null}

      {/* ══ E: banyak investor › memilih indeks — "Nggak serius" dicoret → "Sederhana" · "Masuk akal"; dorong ke atas, feri diserahkan ke Scene 05 ══ */}
      {f > T.jadi - 30 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - keluarE, true) }}>
            <KarakterLingkar pose={MURID_BIRU} x={orangE} y={PE.orang.y} D={PE.orang.D} s={popIn(f, T.banyak)} warna={B.orange} />
            <Label x={orangE} y={PE.orang.y + PE.orang.D / 2 + 40} teks="Banyak investor" f={f} at={T.investor} size={32} lebar={360} />
            <Chevron x={PE.chev} y={PE.orang.y} warna={FERI} p={popIn(f, T.memilih - 10)} />
            <Label x={PE.feri.x} y={PE.feri.y + PE.feri.d / 2 + 40} teks="Memilih indeks" f={f} at={T.memilih + 10} size={32} lebar={360} />
            <Chip x={PE.chip.x} y={PE.chip.y[0]} teks="Nggak serius" ikon="sofa" warna={B.gray} p={popIn(f, T.serius)} coret={R(f, T.serius + 24, T.serius + 84, 0, 1, io)} size={30} />
            <Chip x={PE.chip.x} y={PE.chip.y[1]} teks="Sederhana" ikon="rasional" warna={CEK} p={popIn(f, T.sederhana)} size={32} />
            <Chip x={PE.chip.x} y={PE.chip.y[2]} teks="Masuk akal" ikon="tersedia" warna={CEK} p={popIn(f, T.masuk + 10)} size={32} />
          </div>
          {f < S04_AKHIR ? <Kendaraan x={PE.feri.x} y={PE.feri.y} d={PE.feri.d} warna={FERI} ikon="feri" cermin p={popIn(f, T.memilih)} /> : null}
        </>) : null}
    </AbsoluteFill>);
};
