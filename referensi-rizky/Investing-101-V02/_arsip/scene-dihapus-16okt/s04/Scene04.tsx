import React from 'react';
import { gayaKamera, kamera, keLayar } from '../kamera';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, CORET, F, GAP, R, io, mixHex, WARNA } from '../theme';
import { Icon, WordText, cin, grow, lerp, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { AX, BADGE, JudulSumbu, Judul, PANEL, PanelKaca, Simpul, SumbuChart, TeksLencana } from '../s03/Scene03';
import { SIMPUL_PETA } from '../parts/peta';
import { EMAS } from './emas.gen';
import { Konektor, PanahBadge, Perisai, PilNaik, PilTurun, Tile, Titik, denyut, keTepi } from '../parts/rantai';
import { MURID_S06 } from '../parts/karakter';

/**
 * SCENE 04 — KENAPA HARGA EMAS NAIK · IDE VISUAL (7 Okt). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "Geopolitical Risk ↑ · Uncertainty ↑ · USD ↓ · Gold Demand ↑ → GOLD PRICE ↑"
 *   TEXT   "Harga emas bisa naik tinggi / tapi sumber return-nya tetap sama"
 * Benang merah dari Scene 03: chart yang sama mengambil DATA ASLI (harga emas Rp/gram MINGGUAN sejak Mar 2016, sumbu log —
 * acuan TradingView XAU/IDR gram 1W yang Simon kirim;
 * scripts/gen-emas.py), lalu MENYUSUT jadi kartu "Harga emas" di ujung rantai sebab-akibat brief, dan MEMBESAR lagi saat
 * "harga emas bisa turun lagi" — penurunan asli disorot. Penanda NAIK = hijau, TURUN = merah (Simon 7 Okt, theme ARAH);
 * penghubung rantai tetap turkis brand (alur, bukan arah harga).
 * Scene 03 memudarkan anotasinya di 60f pertama scene ini; kerangka chart diambil alih di S4 + 60 (komponen bersama).
 */
export const S4 = BATAS.s4;
const H = S4 + 60; // serah-terima kerangka chart dari Scene 03
export const IDE_S04_AWAL = S4;

const [beberapa, terakhir, naik, kuat, alasannya, ketidakpastian, meningkat, investor, berhatiHati, permintaan, emas, naik2,
  hal, permintaan2, investor2, bank, sentral, meningkat2, sebaliknya, sentimen, berubah, harga, turun, lagi, jadi, logikanya,
  sama, menghasilkan, laba, berasal, perubahan] = urut(['beberapa', 'terakhir', 'naik', 'kuat', 'alasannya', 'ketidakpastian',
  'meningkat', 'investor', 'berhati-hati', 'permintaan', 'emas', 'naik', 'hal', 'permintaan', 'investor', 'bank', 'sentral',
  'meningkat', 'sebaliknya', 'sentimen', 'berubah', 'harga', 'turun', 'lagi', 'jadi', 'logikanya', 'sama', 'menghasilkan',
  'laba', 'berasal', 'perubahan'], S4);

/* ── chart data asli: sumbu-y bergeser ke kanan untuk label Rupiah (isi tetap di tengah panel) ── */
const AX4 = { x: 464, right: 1569 };
/* acuan Simon 7 Okt = TradingView "GOLD / INDONESIAN RUPIAH GRAM · 1W · ICE": MINGGUAN sejak Mar 2016, sumbu harga LOG */
const N = EMAS.length; // ±553 minggu
const V0 = 420_000, V1 = 3_300_000; // domain log
const LOG = (v: number) => Math.log(v / V0) / Math.log(V1 / V0);
const cx = (i: number) => AX4.x + 20 + (i * (AX4.right - AX4.x - 40)) / (N - 1);
const cy = (v: number) => AX.y - LOG(v) * (AX.y - 330);
const TICK_RP = [500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000]; // jarak log hampir rata
const rp = (v: number) => (v < 1e6 ? `Rp${v / 1000} rb` : `Rp${String(v / 1e6).replace('.', ',')} jt`);
const TAHUN = Array.from({ length: 10 }, (_, k) => 2017 + k); // tik di minggu pertama tiap tahun (data mulai Mar 2016)
const iTgl = (d: string) => { const i = EMAS.findIndex((e) => e.tgl >= d); return i < 0 ? N - 1 : i; };
/** indeks harga tertinggi/terendah dalam rentang tanggal — titik ayunan diambil dari DATA, bukan ditebak */
const ekstrem = (a: string, b: string, maks: boolean) => {
  let k = iTgl(a);
  for (let i = iTgl(a); i <= iTgl(b); i++) if (maks ? EMAS[i].rpGram > EMAS[k].rpGram : EMAS[i].rpGram < EMAS[k].rpGram) k = i;
  return k;
};
const I_PUNCAK = EMAS.reduce((m, e, i) => (e.rpGram > EMAS[m].rpGram ? i : m), 0); // akhir Feb 2026
const KALI = EMAS[I_PUNCAK].rpGram / EMAS[0].rpGram; // ≈5,3× sejak Mar 2016
const TURUN = EMAS[N - 1].rpGram / EMAS[I_PUNCAK].rpGram - 1; // ≈ −15%

/* ── kartu "Harga emas" (ujung rantai) — Simon 8 Okt: visual ikon diperbesar → kartu ×1,2 (dulu 400 × 280 di x 1390) ── */
const C4 = { x: 1318, y: 358, w: 480, h: 336 }; // + rantai digeser (+8, −14): pusat tintanya = chart (960,548) → kamera diam (lihat Scene03 TL)
const kx = (i: number) => C4.x + 36 + (i * (C4.w - 72)) / (N - 1);
const ky = (v: number) => C4.y + C4.h - 36 - LOG(v) * (C4.h - 156);
const LENCANA_KARTU = { x: C4.x + 62, y: C4.y + 60, d: 62 };

/* ── rantai sebab-akibat (brief) ── */
type Pendorong = { teks: string; ikon: KunciIkon; x: number; y: number; naik: boolean; at: number };
/* Simon 8 Okt: label 3 pendorong DI BAWAH ikonnya (konsisten dgn simpul lain; dulu di kanan) + visual ikon diperbesar (×1,3) +
 * "alignment tidak center" → rentang kiri-kanan simetris: label kiri x ±135 … kartu kanan x 1790 (pusat ±962, kamera menyempurnakan) */
/* Simon 9 Okt (tangkapan layar S04): "panjang garis penghubung harus sama dan terpusat di icon" → tiga pendorong di BUSUR berjari-jari SAMA
 * dari pusat ikon Investor (sudut 215° · 180° · 145°); ketiga panah di sepanjang sinarnya → sama panjang & mengarah ke pusat Investor */
const K2 = { x: 748, y: 526, d: 160 };
const K1D = 130, RK = 430;
const diBusur = (sudut: number) => ({ x: K2.x + Math.cos((sudut * Math.PI) / 180) * RK, y: K2.y + Math.sin((sudut * Math.PI) / 180) * RK });
const KOL1: Pendorong[] = [
  { teks: 'Risiko geopolitik', ikon: 'geopolitik', ...diBusur(215), naik: true, at: ketidakpastian - 20 },
  { teks: 'Ketidakpastian', ikon: 'ketidakpastian', ...diBusur(180), naik: true, at: ketidakpastian },
  { teks: 'Dolar AS', ikon: 'dolarMelemah', ...diBusur(145), naik: false, at: ketidakpastian + 20 },
];
/** sinar pendorong → Investor: dari tepi ikon pendorong ke tepi ikon Investor (panjang sama untuk ketiganya) */
const sinarK1 = (d: Pendorong, k2: { x: number; y: number; d: number }) => {
  const ux = k2.x - d.x, uy = k2.y - d.y, L = Math.hypot(ux, uy) || 1, r1 = K1D / 2 + GAP, r2 = k2.d / 2 + GAP;
  return { x1: d.x + (ux / L) * r1, y1: d.y + (uy / L) * r1, x2: k2.x - (ux / L) * r2, y2: k2.y - (uy / L) * r2 };
};
/* investor & bank sentral SIMETRIS terhadap Permintaan (y 526 ± 157): dua panah ke Permintaan sama panjang (dulu −140/+175) */
const K2B = { inv: { x: 748, y: 369, d: 145 }, bank: { x: 748, y: 683, d: 145 } };
const K3 = { x: 1088, y: 526, d: 180 };
const LABEL = 34; // ukuran label simpul (dulu 28)

export const Scene04: React.FC<{ f: number }> = ({ f }) => {
  if (f < H) return null;
  // KELUAR = milik Scene 05 (Simon 7 Okt: perpindahan scene disamakan dgn Scene 01–03): MASKER LINGKARAN — seluruh isi terlihat
  // di dalam lingkaran yang menyusut ke simpul bab 02 (Emas) di peta bab pembuka Scene 05, isinya berubah toska (warna bab 02),
  // lalu peta mengambil alih (gema chart → kartu Return Scene 01). 50f mulai BATAS.s5.
  if (f >= BATAS.s5 + 52) return null;
  const ex = R(f, BATAS.s5, BATAS.s5 + 50, 0, 1, io);
  const kam5 = kamera('S05', BATAS.s5 + 50); // simpul bab 02 digambar Scene 05 di dalam kameranya → masker mendarat tepat di sana
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam5, SIMPUL_PETA(1)), r: SIMPUL_PETA(1).r * kam5.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6); // isi menyusut lebih lambat dari lingkarannya → terpotong bertahap

  /* ── kartu ⇄ chart ── */
  const A1 = alasannya + 44, A2 = harga + 32;
  const mK1 = cin(f, A1); // chart → kartu (sekali)
  const mK = mK1 - cin(f, A2); // 0 = chart penuh, 1 = kartu; kembali jadi chart SESUDAH rantai pudar
  const panel = { x: lerp(PANEL.x, C4.x, mK), y: lerp(PANEL.y, C4.y, mK), w: lerp(PANEL.w, C4.w, mK), h: lerp(PANEL.h, C4.h, mK) };
  // tanjakan WAKTU sendiri (inOut cubic) pada titik yang sama dengan remap lama progres mK (Simon 7 Okt: tanpa easing bertumpuk)
  const isiChart = f < A2 ? 1 - R(f, A1 - 30, A1 - 12, 0, 1, io) : R(f, A2 + 12, A2 + 30, 0, 1, io); // sumbu, label, anotasi — hanya saat panel (hampir) penuh
  const isiKartu = Math.min(R(f, A1 + 3, A1 + 30, 0, 1, io), R(f, A2 - 30, A2 - 3, 1, 0, io)); // judul kartu & panah kartu
  const rAx = cin(f, beberapa + 9); // sumbu bergeser: ilustrasi (S3) → data asli
  const axX = lerp(AX.x, AX4.x, rAx), axR = lerp(AX.right, AX4.right, rAx);
  const labelRaw = R(f, beberapa + 19, beberapa + 59, 0, 1, io);
  const labelOp = labelRaw * isiChart;
  const dr = cin(f, terakhir + 20); // garis data asli tergambar
  const pts = EMAS.map((e, i) => [lerp(cx(i), kx(i), mK), lerp(cy(e.rpGram), ky(e.rpGram), mK)] as const);
  const poly = (a: number, b: number, p = 1) => {
    const u = a + (b - a) * Math.max(0, Math.min(1, p));
    const k = Math.floor(u);
    const out = pts.slice(a, k + 1).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`);
    if (u > k && k + 1 <= b) out.push(`${lerp(pts[k][0], pts[k + 1][0], u - k).toFixed(1)},${lerp(pts[k][1], pts[k + 1][1], u - k).toFixed(1)}`);
    return out.join(' ');
  };
  const lencana = { x: lerp(BADGE.x, LENCANA_KARTU.x, mK), y: lerp(BADGE.y, LENCANA_KARTU.y, mK), d: lerp(BADGE.d, LENCANA_KARTU.d, mK) };

  /* ── rantai ── */
  const alir = R(f, alasannya + 74, alasannya + 104, 0, 1, io) * (1 - R(f, harga - 48, harga + 12, 0, 1, io)); // pudar SEBELUM kartu membesar
  const balik = (dx: number) => cin(f, sebaliknya + dx); // arah sebaliknya, berjenjang per kolom
  // MODE UKUR (kamera): tanpa redup — label pendorong yang redup tidak terhitung tinta → kamera sempat menari 36 px (terukur 8 Okt, jebakan S12)
  // Simon 9 Okt ("kerjakan semua" — daftar belum): pendorong TIDAK lagi meredup saat fokus pindah ke investor (pola redup ditolak Simon:
  // hirarki lewat posisi & urutan muncul, bukan opasitas). Dulu: cin(hal + 20) × (1 − cin(sebaliknya)) → opasitas 0,4.
  const redup1 = 0;
  const mv = cin(f, investor2); // investor naik, bank sentral masuk
  const k2 = { x: K2.x, y: lerp(K2.y, K2B.inv.y, mv), d: lerp(K2.d, K2B.inv.d, mv) };

  /* ── B4/B5 penurunan asli & penanda ↑↓ ── */
  const segTurun = cin(f, turun + 10);
  const pilTurun = popIn(f, lagi + 16) * popOut(f, jadi + 15);
  const B1op = 1 - R(f, A1 - 30, A1 - 5, 0, 1, io); // anotasi B1 hanya sebelum chart pertama kali menyusut (tidak kembali)

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS peta bab yang baru → simpul peta tersingkap saat lingkaran menyusut, tidak menumpuk di atas isi lama */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s5, BATAS.s5 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* judul TEXT naskah: baris 1 lalu diganti baris 2 */}
      <Judul f={f} kata={['Harga', 'emas', 'bisa', 'naik tinggi']} at={naik} sorotAt={kuat + 10} keluar={jadi + 10} />
      <Judul f={f} kata={['Tapi', 'sumber', 'return-nya', 'tetap sama']} at={logikanya + 15} sorotAt={sama + 20} />

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut. Serah-terima chart dari Scene 03: kamera mulai di nilai akhir Scene 03 */}
      <AbsoluteFill style={gayaKamera('S04', f, f >= BATAS.s5 - 30)}>
      {/* ═════ chart ⇄ kartu ═════ */}
      <PanelKaca r={panel} />
      <AbsoluteFill>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {isiChart > 0.001 ? (
            <SumbuChart ax={1} x={axX} right={axR} op={isiChart}>
              {TICK_RP.map((v) => <line key={v} x1={AX4.x - 9} x2={AX4.x} y1={cy(v)} y2={cy(v)} opacity={labelRaw} />)}
              {TAHUN.map((t) => <line key={t} x1={cx(iTgl(`${t}-01-01`))} x2={cx(iTgl(`${t}-01-01`))} y1={AX.y} y2={AX.y + 9} opacity={labelRaw} />)}
            </SumbuChart>) : null}
          {/* garis harga emas dunia (data asli) — di chart & di kartu (titik yang sama, dipetakan ulang) */}
          {dr > 0.001 ? <polyline points={poly(0, N - 1, dr)} fill="none" stroke={B.blue} strokeWidth={lerp(3.5, 3, mK)} strokeLinejoin="round" strokeLinecap="round" /> : null}
          {/* B4: penurunan asli dari puncak (Feb 2026) ke bulan terakhir */}
          {segTurun > 0.001 ? <polyline points={poly(I_PUNCAK, N - 1, segTurun)} fill="none" stroke={ARAH.turun} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" opacity={isiChart} /> : null}
          {/* B1: titik awal & puncak */}
          {B1op > 0.001 ? (
            <g opacity={B1op}>
              <Titik x={pts[0][0]} y={pts[0][1]} p={popIn(f, kuat - 10)} col={ARAH.naik} />
              <Titik x={pts[I_PUNCAK][0]} y={pts[I_PUNCAK][1]} p={popIn(f, kuat + 5)} col={ARAH.naik} />
            </g>) : null}
          {segTurun > 0.001 ? (
            <g opacity={isiChart}>
              <Titik x={pts[I_PUNCAK][0]} y={pts[I_PUNCAK][1]} p={popIn(f, turun - 10)} col={ARAH.turun} />
              <Titik x={pts[N - 1][0]} y={pts[N - 1][1]} p={popIn(f, turun + 30)} col={ARAH.turun} />
            </g>) : null}
          {/* B5: penanda ↑↓ di ayunan harga asli ("return-nya terutama dari perubahan harga") */}
          {AYUN.map((a, k) => <PenandaAyun key={k} a={a} p={popIn(f, berasal - 10 + 20 * k)} op={isiChart} />)}
        </svg>
        {/* label sumbu (Rupiah & tahun) */}
        {TICK_RP.map((v) => (
          <div key={v} style={{ position: 'absolute', left: AX4.x - GAP - 160, width: 160, top: cy(v), transform: 'translateY(-50%)', textAlign: 'right', opacity: labelOp, fontFamily: F, fontSize: 22, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>{rp(v)}</div>))}
        {TAHUN.map((t) => (
          <div key={t} style={{ position: 'absolute', left: cx(iTgl(`${t}-01-01`)) - 40, width: 80, top: AX.y + GAP, textAlign: 'center', opacity: labelOp, fontFamily: F, fontSize: 22, fontWeight: 700, color: B.gray }}>{t}</div>))}
        {isiChart > 0.001 ? <JudulSumbu ax={1} x={axX} right={axR} op={isiChart} /> : null}
        {/* teks lencana: "Harga pasar" (warisan S3) → "Harga emas dunia" → di kartu: "Harga emas" */}
        <TeksLencana f={f} at={S4 - 2000} teks="Harga pasar" op={1 - R(f, beberapa - 21, beberapa + 9, 0, 1, io)} />
        <TeksLencana f={f} at={beberapa + 14} teks="Harga emas dunia" op={isiChart} />
        {isiKartu > 0.001 ? <TeksLencana f={f} at={alasannya + 64} teks="Harga emas" op={isiKartu} x={LENCANA_KARTU.x + LENCANA_KARTU.d / 2 + GAP} y={LENCANA_KARTU.y} size={LABEL} /> : null}
        {/* B1: "≈4,9× sejak 2018" (data asli) */}
        <PilNaik x={(pts[0][0] + pts[I_PUNCAK][0]) / 2 - 40} y={470} p={popIn(f, kuat + 20) * B1op} teks={`Naik ≈${KALI.toFixed(1).replace('.', ',')}× sejak 2016`} />
        {/* B4: "Turun ≈15%" di atas puncak */}
        <PilTurun x={Math.min(pts[I_PUNCAK][0], AX4.right - 175)} y={300} p={pilTurun * isiChart} teks={`Turun ≈${Math.round(-TURUN * 100)}% dari puncak`} />
        {/* B5: "emas tidak terus-menerus menghasilkan laba" — chip Laba bisnis (dicoret, gema Scene 03) */}
        <ChipLaba f={f} at={menghasilkan} coretAt={laba + 15} op={isiChart} />
        {/* panah kartu (naik → turun di arah sebaliknya) */}
        {isiKartu > 0.001 ? <PanahBadge x={C4.x + C4.w - 58} y={C4.y + 60} d={52} naik p={popIn(f, naik2 + 35)} flip={balik(40)} op={isiKartu} /> : null}
      </AbsoluteFill>

      {/* ═════ rantai sebab-akibat (selama kartu) ═════ */}
      {alir > 0.001 ? (
        <AbsoluteFill style={{ opacity: Math.min(0.9999, alir) }}>{/* maks 0,9999 (cek 12 Okt): opasitas TEPAT 1 → <1 di harga−48 mengganti jalur
            raster seluruh rantai (teks berganti anti-alias 1 frame, lonjakan f1208 lokal); tak pernah tepat 1 → satu jalur sepanjang tampil */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {KOL1.map((d, k) => (
              <Konektor key={d.teks} {...sinarK1(d, k2)} g={grow(f, investor - 10 + 10 * k)} flip={balik(0)} op={(1 - 0.6 * redup1) * (1 - mv)} />))} {/* pudar saat investor bergeser (sinar tetap sama panjang selama tampil) */}
            <Konektor {...keTepi(k2.x + k2.d / 2 + GAP, k2.y, K3)} g={grow(f, permintaan)} flip={balik(20)} />
            <Konektor {...keTepi(K2B.bank.x + K2B.bank.d / 2 + GAP, K2B.bank.y, K3)} g={grow(f, sentral + 10)} flip={balik(20)} />
            <Konektor x1={K3.x + K3.d / 2 + GAP} y1={K3.y} x2={C4.x - GAP} y2={K3.y} g={grow(f, naik2 + 15)} flip={balik(40)} />
          </svg>
          {KOL1.map((d) => (
            <Tile key={d.teks} x={d.x} y={d.y} dsz={K1D} ikon={d.ikon} col={[WARNA.oranyeMuda, WARNA.ungu, WARNA.turkisMuda][KOL1.indexOf(d)]} p={popIn(f, d.at)} op={1 - 0.6 * redup1} denyut={denyut(f, sentimen + 26)}
              label={<WordText halus f={f} at={d.at + 10} style={{ fontFamily: F, fontSize: LABEL, fontWeight: 800, color: B.night, lineHeight: 1.15 }}>{d.teks}</WordText>} labelLebar={KOL1.indexOf(d) === 0 ? 190 : 320} /* dua baris: panah sinarnya lewat bebas dari label (terukur) */
              badge={<PanahBadge x={d.x - K1D * 0.36} y={d.y - K1D * 0.36} d={52} naik={d.naik} p={popIn(f, meningkat - 20 + 20 * KOL1.indexOf(d))} flip={balik(0)} />} />))}
          {/* investor (B2: lebih berhati-hati → B3: naik, berdampingan dgn bank sentral) */}
          {/* Simon 12 Okt "ganti icon investor, dengan gambar orang berkemeja biru": murid S06 (setengah badan) di lingkaran oranye — dulu
              ikon investor di cakram Neon Blue (kemeja biru menyatu dengan cakram biru) */}
          <Tile x={k2.x} y={k2.y} dsz={k2.d} ikon="investor" col={B.blue} p={popIn(f, investor)} karakter={{ pose: MURID_S06, warna: B.orange }}
            label={<>
              <div style={{ opacity: 1 - mv }}><WordText halus f={f} at={investor + 10} style={{ fontFamily: F, fontSize: LABEL, fontWeight: 800, color: B.night, lineHeight: 1.2 }}>Investor lebih berhati-hati</WordText></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: mv }}><span style={{ fontFamily: F, fontSize: LABEL, fontWeight: 800, color: B.night }}>Investor</span></div>
            </>} labelLebar={320}
            badge={<Perisai x={k2.x + k2.d * 0.36} y={k2.y - k2.d * 0.36} p={popIn(f, berhatiHati) * (1 - mv)} />} />
          {/* Simon 12 Okt "ganti icon bank dengan gambar ini, perhatikan alignment nya": foto gedung bank di lingkaran (gaya rumah S05: sedikit
              lebih besar dari lingkaran, puncak menyembul — serasi dengan kepala investor di atasnya), pusat lingkaran tetap sekolom dengan
              investor (x 748) dan label di bawahnya; warna lingkaran tetap (langit) */}
          <Tile x={K2B.bank.x} y={K2B.bank.y} dsz={K2B.bank.d} ikon="bankSentral" col={WARNA.langit} p={popIn(f, bank + 7)} foto={{ k: 'bank', warna: WARNA.langit }}
            label={<WordText halus f={f} at={bank + 17} style={{ fontFamily: F, fontSize: LABEL, fontWeight: 800, color: B.night }}>Bank sentral</WordText>} labelLebar={320} />
          {/* permintaan emas */}
          <Tile x={K3.x} y={K3.y} dsz={K3.d} ikon="permintaanEmas" col={B.turq} p={popIn(f, permintaan + 25)} denyut={denyut(f, meningkat2) + denyut(f, permintaan2)}
            label={<WordText halus f={f} at={permintaan + 35} style={{ fontFamily: F, fontSize: LABEL, fontWeight: 800, color: B.night }}>Permintaan emas</WordText>} labelLebar={340}
            badge={<PanahBadge x={K3.x + K3.d * 0.36} y={K3.y - K3.d * 0.36} d={56} naik p={popIn(f, naik2)} flip={balik(20)} />} />
        </AbsoluteFill>) : null}

      {/* lencana emas: dari Scene 03 → kartu → kembali ke chart */}
      <Simpul x={lencana.x} y={lencana.y} d={lencana.d} dasar={1} isi={1} />
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.turq, opacity: R(f, BATAS.s5 + 22, BATAS.s5 + 48, 0, 1, io) }} /> : null}
    {/* ikon bab memudar masuk di atas isian → saat ditukar ke simpul peta (BATAS.s5+52) gambarnya sudah identik (dulu ikon muncul 1 frame) */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s5 + 34, BATAS.s5 + 48, 0, 1, io) }}><Icon name="emas" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/** chip "Laba bisnis" dicoret (gema Scene 03: emas tidak menghasilkan laba) — MERAH saat dicoret (Simon 8 Okt; dulu abu + redup) */
const ChipLaba: React.FC<{ f: number; at: number; coretAt: number; op: number }> = ({ f, at, coretAt, op }) => {
  const p = popIn(f, at);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  const col = mixHex(B.blue, CORET, coret);
  return (
    <div style={{ position: 'absolute', left: 720, top: 420, transform: `translate(-50%, -50%) scale(${p})`, opacity: op, display: 'flex', alignItems: 'center', gap: 14, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '10px 28px 10px 12px', fontFamily: F, fontSize: 30, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', boxShadow: `0 12px 28px -14px ${col}88` }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name="bisnisLaba" size={30} color={B.white} /></div>
      Laba bisnis
      <div style={{ position: 'absolute', left: 14, top: '50%', height: 4, marginTop: -2, width: `calc(${coret} * (100% - 28px))`, background: CORET, borderRadius: 2 }} />
    </div>);
};

/** ayunan harga asli yang ditandai ↑/↓ di B5 */
const A_LEMBAH19 = ekstrem('2019-04-01', '2019-06-30', false), A_PUNCAK20 = ekstrem('2020-07-01', '2020-09-30', true);
const A_LEMBAH21 = ekstrem('2021-02-01', '2021-04-30', false), A_LEMBAH23 = ekstrem('2023-09-01', '2023-10-31', false);
const AYUN = [
  { a: A_LEMBAH19, b: A_PUNCAK20, naik: true },
  { a: A_PUNCAK20, b: A_LEMBAH21, naik: false },
  { a: A_LEMBAH23, b: I_PUNCAK, naik: true },
  { a: I_PUNCAK, b: N - 1, naik: false },
];
const PenandaAyun: React.FC<{ a: (typeof AYUN)[number]; p: number; op: number }> = ({ a, p, op }) => {
  if (p <= 0.001) return null;
  // di sisi KOSONG ayunan: normal ruas a→b, ke atas-kiri untuk naik, ke bawah-kiri untuk turun; 48 px dari garis
  const m = Math.round((a.a + a.b) / 2);
  const dx = cx(a.b) - cx(a.a), dy = cy(EMAS[a.b].rpGram) - cy(EMAS[a.a].rpGram), L = Math.hypot(dx, dy);
  let nx = dy / L, ny = -dx / L;
  if ((a.naik && ny > 0) || (!a.naik && ny < 0)) { nx = -nx; ny = -ny; }
  if (!a.naik) { nx = 0; ny = 1; } // ▼ tepat di bawah titik tengah (normal ke kiri-bawah menabrak lonjakan 2020 — terukur 7 px)
  const x = cx(m) + nx * 48, y = cy(EMAS[m].rpGram) + ny * 48;
  const col = a.naik ? ARAH.naik : ARAH.turun;
  return (
    <g opacity={op} transform={`translate(${x} ${y}) scale(${p})`}>
      <circle r={20} fill={B.white} stroke={col} strokeWidth={3} />
      <path d={a.naik ? 'M0 -9 L9 6 L-9 6 Z' : 'M0 9 L9 -6 L-9 -6 Z'} fill={col} />
    </g>);
};

export const S04_BEAT = { beberapa, terakhir, naik, kuat, alasannya, ketidakpastian, meningkat, investor, berhatiHati, permintaan, emas, naik2, hal, permintaan2, investor2, bank, sentral, meningkat2, sebaliknya, sentimen, berubah, harga, turun, lagi, jadi, logikanya, sama, menghasilkan, laba, berasal, perubahan };
export const S04_DATA = { KALI, TURUN, puncak: EMAS[I_PUNCAK], akhir: EMAS[N - 1], awal: EMAS[0] };
