import React from 'react';
import { gayaKamera } from '../kamera';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, CORET, F, GAP, LINE, R, io, mixHex, rgba } from '../theme';
import { cin, glass, grow, Icon, lerp, LW, Pill, popOut, Sorot, geserSorot, WordText, MODE_UKUR } from '../parts/kit';
import { popIn } from '../parts/pop';
import { HARGA, KUNCI } from './harga';
import { PembukaBab } from '../parts/peta';

/**
 * SCENE 03 — EMAS · IDE VISUAL (6 Okt). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "1g GOLD · Hari ini → 1g · 10 tahun lagi → 1g · ↓ MARKET PRICE ↑↓↑↓"
 *   TEXT   "Emas tidak menghasilkan laba / return utamanya dari perubahan harga"
 * Benang merah: simpul bab 02 (struktur sama dengan peta bab Scene 01) = SATU benda emas yang dibawa sepanjang scene —
 * menempuh garis waktu 10 tahun (tetap 1 gram), berdiri di tengah saat dua sumber return dicoret, lalu mengecil jadi
 * lencana chart "Harga pasar" tempat untung/rugi dari perubahan harga digambar.
 * Animasi keluar Scene 02 milik scene ini (aturan Simon Scene 1→2): mulai BATAS.s3, Scene 02 sendiri berakhir tanpa keluar.
 */
export const S3 = BATAS.s3;
/** frame 0 komposisi Ide-S03 */
export const IDE_S03_AWAL = S3;

const [karakternya, emas, hari, ini, gram, sepuluh, lagi, fisik, tetap, gram2, emas2, bunga, rutin, bisnis,
  menghasilkan, laba, sumber, utamanya, datang, hal, perubahan, beli, rendah, menjualnya, tinggi, untung,
  sebaliknya, kalau2, turun, rugi] = urut(['karakternya', 'emas', 'hari', 'ini', 'gram', 'sepuluh', 'lagi', 'fisik',
  'tetap', 'gram', 'emas', 'bunga', 'rutin', 'bisnis', 'menghasilkan', 'laba', 'sumber', 'utamanya', 'datang', 'hal',
  'perubahan', 'beli', 'rendah', 'menjualnya', 'tinggi', 'untung', 'sebaliknya', 'kalau', 'turun', 'rugi'], S3);

/* ── geometri (tengah bingkai 960; isi di antara judul y≈130 dan pita subtitle y≈940) ── */
const N0 = { x: 960, y: 535, d: 210 }; // simpul bab 02 di tengah — y: slot sendiri & simpul+nomor+label sama-sama berpusat ±540 (Simon 7 Okt)
// Simon 8 Okt: "perbesar visual di scene emas, terutama yang hanya menggunakan icon" → garis waktu ×1,3 (dulu xa 600, xb 1320, d 170)
// pusat DUNIA tiap susunan S03/S04 disamakan (tinta ±956,544) → kamera tetap diam sepanjang dua scene, tiap momen ≤ 4 px dari tengah
// (Simon 8 Okt "alignment tidak center"; geser kamera kecil yang lambat = rayapan sub-piksel, terukur di S02)
const TL = { y: 557, xa: 516, xb: 1396, d: 220 }; // garis waktu: hari ini → 10 tahun lagi
/** pembuka bab selesai = simpul Emas tiba di "Hari ini" — sama dengan akhir rL (cin(hari)) → serah-terima ke simpul scene tanpa loncatan */
const PETA_SELESAI = hari + 30;
const PIL_Y = TL.y - 168; // baris "1 gram = 1 gram" (di atas simpul Ø220)
const TICK = Array.from({ length: 9 }, (_, k) => TL.xa + TL.d / 2 + (k + 1) * ((TL.xb - TL.xa - TL.d) / 10));
const C = { x: 960, y: 511, d: 260 }; // emas di tengah (dua sumber return dicoret) — Simon 8 Okt ×1,3 (dulu d 200)
const CHIP_W = 420, CHIP_H = 84; // ×1,3 (dulu 330 × 64)
const CHIP = [
  { x: 420, teks: 'Bunga rutin', ikon: 'bunga' as KunciIkon, col: B.orange },
  { x: 1500, teks: 'Laba bisnis', ikon: 'bisnisLaba' as KunciIkon, col: B.blue },
];
/* chart harga pasar — panel kaca; tidak ada garis yang keluar panel */
export const PANEL = { x: 300, y: 212, w: 1320, h: 672 };
export const BADGE = { x: 380, y: 262, d: 64 }; // lencana tepat di atas sumbu-y
/** isi chart SIMETRIS di panel (Simon 7 Okt: "terlalu ke kanan"): panel→sumbu-y = ujung sumbu-x→panel = 80 px; garis harga
 *  400–1520 (20 px dari sumbu-y & dari ujung panah) → pusat isi = 960 */
export const AX = { x: 380, top: 318, y: 780, right: 1540 };
const VMIN = 82, VMAX = 138, PT = 330;
const px = (i: number) => 400 + (i * 1120) / (HARGA.length - 1);
/** LABEL SUMBU (Simon 7 Okt: "tambahkan label harga agar jelas maksud x axis dan y axisnya"): judul sumbu + tahun 0–10
 *  (sama dengan garis waktu B2). ANGKA HARGA TIDAK DITAMPILKAN — Simon: "harganya tidak perlu … bukan data real". */
const TICK_TAHUN = [0, 2, 4, 6, 8, 10];
const tx = (th: number) => px((th * (HARGA.length - 1)) / 10);
const py = (v: number) => AX.y - ((v - VMIN) * (AX.y - PT)) / (VMAX - VMIN);
const PT_ = HARGA.map((v, i) => [px(i), py(v)] as const);
const P = (i: number) => ({ x: PT_[i][0], y: PT_[i][1] });

/** potongan garis harga dari indeks a ke b, tergambar sejauh p (0..1) */
const garis = (a: number, b: number, p: number) => {
  const u = a + (b - a) * Math.max(0, Math.min(1, p));
  const k = Math.floor(u);
  const pts = PT_.slice(a, k + 1).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`);
  if (u > k && k + 1 <= b) {
    const t = u - k;
    pts.push(`${lerp(PT_[k][0], PT_[k + 1][0], t).toFixed(1)},${lerp(PT_[k][1], PT_[k + 1][1], t).toFixed(1)}`);
  }
  return pts.join(' ');
};

/** dua skenario: untung (beli lembah → jual puncak, HIJAU) · rugi (beli puncak → jual lembah, MERAH) — warna arah harga */
const SKEN = [
  { a: KUNCI.beliU, b: KUNCI.jualU, col: ARAH.naik, hasil: 'Untung', naik: true }, // harga naik = hijau (Simon 7 Okt)
  { a: KUNCI.beliR, b: KUNCI.jualR, col: ARAH.turun, hasil: 'Rugi', naik: false }, // harga turun = merah
];

export const Scene03: React.FC<{ f: number }> = ({ f }) => {
  if (f < S3) return null;
  // KELUAR = 60f pertama Scene 04 (aturan: animasi keluar milik scene baru): anotasi untung/rugi, garis ilustratif, angka tahun
  // 0–10 dan judul memudar; panel, sumbu, judul sumbu & lencana emas DIAMBIL ALIH Scene 04 di BATAS.s4 + 60 (struktur sama).
  if (f >= BATAS.s4 + 60) return null;
  const ex = R(f, BATAS.s4, BATAS.s4 + 60, 0, 1, io);

  /* ── emas: SATU benda sepanjang scene — tengah → kiri garis waktu → menempuh 10 tahun → tengah → lencana chart ── */
  const rL = cin(f, hari);
  const tr = cin(f, lagi);
  const rC = cin(f, emas2 + 40);
  const rB = cin(f, datang); // emas terbang jadi lencana DULU, panel tumbuh 20f sesudahnya (tidak ada panel di bawah emas yang diam)
  let gx = lerp(N0.x, TL.xa, rL), gy = lerp(N0.y, TL.y, rL), gd = lerp(N0.d, TL.d, rL);
  gx = lerp(gx, TL.xb, tr);
  gx = lerp(gx, C.x, rC); gy = lerp(gy, C.y, rC); gd = lerp(gd, C.d, rC);
  gx = lerp(gx, BADGE.x, rB); gy = lerp(gy, BADGE.y, rB); gd = lerp(gd, BADGE.d, rB);
  const travX = lerp(TL.xa, TL.xb, tr);

  const keluarTL = R(f, emas2 - 5, emas2 + 55, 0, 1, io); // garis waktu pudar sebelum emas bergerak ke tengah
  const tlOp = 1 - keluarTL;

  const pp = cin(f, datang + 20); // panel chart
  const ax = grow(f, hal);
  const dr = cin(f, perubahan + 20); // garis harga tergambar
  // Simon (berulang): tanpa peredupan — skenario untung TIDAK lagi meredup saat skenario rugi dimulai (dulu 1 − 0,6 × cin(sebaliknya + 20))
  const dimU = 0;

  /* ketukan per skenario */
  const T = [
    { beli: beli, lvlA: rendah, seg: menjualnya, jual: menjualnya + 30, lvlB: tinggi, hasil: untung },
    { beli: kalau2, lvlA: kalau2 + 30, seg: turun, jual: turun + 30, lvlB: turun + 30, hasil: rugi },
  ];

  return (
    <AbsoluteFill>
      {/* ═════ judul (kolom TEXT naskah): baris 1 lalu diganti baris 2 ═════ */}
      <Judul f={f} kata={['Emas', 'tidak', 'menghasilkan', 'laba']} at={menghasilkan} sorotAt={laba + 10} keluar={sumber} />
      <Judul f={f} kata={['Return', 'utamanya', 'dari', 'perubahan harga']} at={utamanya + 10} sorotAt={perubahan + 40} keluar={BATAS.s4 + 30} />

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaKamera('S03', f, f >= BATAS.s4 - 30)}>
      {/* ═════ B2 garis waktu 10 tahun ═════ */}
      {tlOp > 0.001 && f >= hari - 40 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: tlOp }}>
          {(() => {
            const a = TL.xa + TL.d / 2 + GAP, b = TL.xb - TL.d / 2 - GAP;
            // garis waktu tumbuh BERSAMA emas pindah ke kiri ("hari") — susunan utuh & berpusat sejak awal (Simon 7 Okt: titik tengah
            // di setiap momen; dulu tumbuh di "sepuluh" → emas sendirian di kiri ±1 dtk)
            const g = grow(f, hari);
            const ujung = Math.min(b, travX - TL.d / 2 - GAP);
            return (
              <>
                {g > 0.001 ? <line x1={a} x2={lerp(a, b, g)} y1={TL.y} y2={TL.y} stroke={B.grayLite} strokeWidth={LINE.w} strokeDasharray={LINE.dash} strokeLinecap="round" /> : null}
                {ujung > a ? <line x1={a} x2={ujung} y1={TL.y} y2={TL.y} stroke={B.turq} strokeWidth={LINE.w + 1} strokeLinecap="round" /> : null}
                {TICK.map((x, k) => {
                  const on = R(travX, x - 12, x + 12, 0, 1, io);
                  const muncul = R(g, (x - a) / (b - a) - 0.05, (x - a) / (b - a) + 0.05, 0, 1, io);
                  return <circle key={k} cx={x} cy={TL.y} r={10} fill={mixHex(B.white, B.turq, on)} stroke={mixHex(B.grayLite, B.turq, on)} strokeWidth={3} opacity={muncul} />;
                })}
              </>);
          })()}
        </svg>) : null}
      {tlOp > 0.001 ? (
        <AbsoluteFill style={{ opacity: tlOp }}>
          {/* slot tujuan "10 tahun lagi" (putus-putus) — ada sejak garis waktu tumbuh, ditempati emas saat tiba */}
          {(() => {
            const o = cin(f, hari + 20) * (1 - R(f, lagi + 10, lagi + 30, 0, 1, io));
            return o > 0.001 ? <div style={{ position: 'absolute', left: TL.xb - TL.d / 2, top: TL.y - TL.d / 2, width: TL.d, height: TL.d, borderRadius: '50%', border: `3px dashed ${B.grayLite}`, background: B.white, opacity: o }} /> : null;
          })()}
          {/* jejak "hari ini": emas yang sama, 10 tahun lalu */}
          {tr > 0.001 ? <Simpul x={TL.xa} y={TL.y} d={TL.d} hantu={Math.min(1, tr * 4)} foto={1} /> : null}
          <Label x={TL.xa} top={TL.y + TL.d / 2 + 30} f={f} at={ini + 5} teks="Hari ini" />
          <Label x={TL.xb} top={TL.y + TL.d / 2 + 30} f={f} at={lagi + 15} teks="10 tahun lagi" />
          <Pill x={TL.xa} y={PIL_Y} anchor="center" size={40} col={B.turq} text="1 gram" p={popIn(f, gram) + denyut(f, gram2)} />
          <Pill x={TL.xb} y={PIL_Y} anchor="center" size={40} col={B.turq} text="1 gram" p={popIn(f, fisik) + denyut(f, gram2)} />
          <SamaDengan x={960} y={PIL_Y} p={popIn(f, tetap)} />
        </AbsoluteFill>) : null}

      {/* ═════ B3 dua sumber return yang TIDAK dimiliki emas — dicoret ═════ */}
      {/* chip & label Emas pergi di "datang" BERSAMA emas terbang ke panel grafik (dulu di "sumber" → emas sendirian 0,5 dtk, 39 px di atas tengah, terukur) */}
      {/* slot kanan (kosong) tampil BERSAMA chip kiri, terisi "Laba bisnis" di frasanya — pasangan seimbang sejak awal */}
      <SlotChip f={f} x={CHIP[1].x} at={bunga + 10} isi={bisnis} />
      {CHIP.map((c, k) => (
        <Chip key={c.teks} f={f} c={c} at={k === 0 ? bunga + 10 : bisnis} coretAt={k === 0 ? rutin + 15 : laba} keluar={datang} />))}

      {/* ═════ B4–B6 chart harga pasar ═════ */}
      {pp > 0.001 ? (
        <PanelKaca pp={pp} />) : null}
      {pp > 0.001 ? (
        <AbsoluteFill style={{ opacity: pp }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {/* sumbu: harga ↑ (kiri, tanpa angka) · waktu → (bawah, tahun) — garis tik pendek, tanpa kisi */}
            {ax > 0.001 ? (
              <SumbuChart ax={ax}>
                {TICK_TAHUN.map((t) => <line key={t} x1={tx(t)} x2={tx(t)} y1={AX.y} y2={AX.y + 9} opacity={munculX(ax, t) * (1 - ex)} />)}
              </SumbuChart>) : null}
            {/* kotak & level tiap skenario (di bawah garis harga) */}
            {SKEN.map((s, k) => {
              const t = T[k];
              const A = P(s.a), Bp = P(s.b);
              const op = (k === 0 ? 1 - 0.6 * dimU : 1) * (1 - ex);
              const isi = cin(f, t.hasil);
              const yTop = Math.min(A.y, Bp.y), yBot = Math.max(A.y, Bp.y);
              const lA = grow(f, t.lvlA), lB = grow(f, t.lvlB);
              return (
                <g key={k} opacity={op}>
                  {isi > 0.001 ? <rect x={A.x} y={yTop} width={Bp.x - A.x} height={yBot - yTop} fill={rgba(s.col, 0.14 * isi)} /> : null}
                  {lA > 0.001 ? <line x1={A.x} x2={lerp(A.x, Bp.x, lA)} y1={A.y} y2={A.y} stroke={s.col} strokeOpacity={LINE.op} strokeWidth={LINE.w} strokeDasharray={LINE.dash} strokeLinecap="round" /> : null}
                  {lB > 0.001 ? <line x1={A.x} x2={lerp(A.x, Bp.x, lB)} y1={Bp.y} y2={Bp.y} stroke={s.col} strokeOpacity={LINE.op} strokeWidth={LINE.w} strokeDasharray={LINE.dash} strokeLinecap="round" /> : null}
                </g>);
            })}
            {/* garis harga pasar */}
            {dr > 0.001 ? <polyline points={garis(0, HARGA.length - 1, dr)} fill="none" stroke={B.blue} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" opacity={1 - ex} /> : null}
            {/* jalur beli → jual ditebalkan warna skenario, panah selisih, titik (penanda DI ATAS garis) */}
            {SKEN.map((s, k) => {
              const t = T[k];
              const A = P(s.a), Bp = P(s.b);
              const op = (k === 0 ? 1 - 0.6 * dimU : 1) * (1 - ex);
              const seg = cin(f, t.seg);
              const pa = grow(f, t.hasil);
              const yEnd = lerp(A.y, Bp.y + (s.naik ? 1 : -1) * 24, pa); // ujung panah 24 px dari pusat titik (≥ 10 px dari cincinnya)
              return (
                <g key={k} opacity={op}>
                  {seg > 0.001 ? <polyline points={garis(s.a, s.b, seg)} fill="none" stroke={s.col} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" /> : null}
                  {pa > 0.001 ? (
                    <g>
                      <line x1={Bp.x} x2={Bp.x} y1={A.y} y2={yEnd + (s.naik ? 10 : -10)} stroke={s.col} strokeWidth={LINE.w + 1} strokeLinecap="round" />
                      <path d={s.naik ? `M${Bp.x - 11} ${yEnd + 16} L${Bp.x} ${yEnd} L${Bp.x + 11} ${yEnd + 16} Z` : `M${Bp.x - 11} ${yEnd - 16} L${Bp.x} ${yEnd} L${Bp.x + 11} ${yEnd - 16} Z`} fill={s.col} />
                    </g>) : null}
                  <Titik x={A.x} y={A.y} p={popIn(f, t.beli)} col={s.col} />
                  <Titik x={Bp.x} y={Bp.y} p={popIn(f, t.jual)} col={s.col} />
                </g>);
            })}
          </svg>
          {/* label sumbu: tahun di bawah sumbu-x; judul sumbu di ujung panahnya (harga tanpa angka — bukan data real) */}
          {TICK_TAHUN.map((t) => (
            <div key={t} style={{ position: 'absolute', left: tx(t) - 40, width: 80, top: AX.y + GAP, textAlign: 'center', opacity: munculX(ax, t) * (1 - ex), fontFamily: F, fontSize: 22, fontWeight: 700, color: B.gray }}>{t}</div>))}
          <JudulSumbu ax={ax} />
          {/* label lencana */}
          <TeksLencana f={f} at={hal + 10} teks="Harga pasar" />
          {/* tag Beli/Jual (lapisan teratas) + hasil di dalam kotaknya */}
          {SKEN.map((s, k) => {
            const t = T[k];
            const A = P(s.a), Bp = P(s.b);
            const op = (k === 0 ? 1 - 0.6 * dimU : 1) * (1 - ex);
            const yTop = Math.min(A.y, Bp.y);
            // tag di sisi luar titik: lembah → bawah, puncak → atas (jarak 52 = tepi pil ke tepi titik ≥ 14)
            const tagY = (pt: { y: number }, lembah: boolean) => pt.y + (lembah ? 52 : -52);
            return (
              <div key={k} style={{ position: 'absolute', inset: 0, opacity: op }}>
                <Pill x={A.x} y={tagY(A, s.naik)} anchor="center" size={26} col={s.col} text="Beli" p={popIn(f, t.beli + 5)} />
                <Pill x={Bp.x} y={tagY(Bp, !s.naik)} anchor="center" size={26} col={s.col} text="Jual" p={popIn(f, t.jual + 5)} />
                <Hasil x={s.naik ? A.x + 16 : Bp.x - 16} y={yTop + 16 + 27} kanan={!s.naik} teks={s.hasil} naik={s.naik} col={s.col} p={popIn(f, t.hasil + 10)} />
              </div>);
          })}
        </AbsoluteFill>) : null}

      {/* ═════ emas (paling atas): simpul bab 02 ═════ */}
      {/* B3: nama benda di bawah emas di tengah (dua sumber return dicoret di kiri-kanannya) */}
      {f >= emas2 && rB < 1 ? (
        <Label x={gx} top={gy + gd / 2 + 30} f={f} at={emas2 + 50} teks="Emas" op={1 - cin(f, datang)} />) : null}
      {/* PEMBUKA BAB (Simon 8 Okt): peta bab lengkap seperti akhir Scene 01 — isi Scene 02 menyusut ke bab 01, bab Emas disorot (pola
          Tabungan & Deposito) lalu meluncur LANGSUNG ke titik "Hari ini" garis waktu (baris peta = baris garis waktu, bab lain turun lebih
          awal supaya tidak bertumpuk dengan garis yang tumbuh). Dulu: hanya satu slot "?" di tengah → frame terasa kosong. */}
      <PembukaBab f={f} s0={S3} k={1} isiAt={emas} tengah={{ x: TL.xa, y: TL.y, d: TL.d }} selesai={PETA_SELESAI} pergi={emas + 10} />
      {/* Simon 12 Okt "gunakan ini untuk scene emas": benda emas = foto emas batangan — ikon peta bab memudar ke foto sesudah tiba di "Hari
          ini" (30f), dan kembali ke ikon di akhir terbang jadi lencana chart (55–95 % lintasan; rupa lencana = lencana Scene 04 saat serah-terima) */}
      {f >= PETA_SELESAI ? <Simpul x={gx} y={gy} d={gd} dasar={1} isi={1} foto={R(f, PETA_SELESAI, PETA_SELESAI + 30, 0, 1, io) * (1 - R(rB, 0.55, 0.95, 0, 1, io))} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>);
};

/* ══ KERANGKA CHART BERSAMA (Scene 03 & 04): struktur identik → serah-terima di BATAS.s4 + 60 tanpa lompatan ══ */
type Kotak = { x: number; y: number; w: number; h: number };
/** panel kaca chart; `pp` = masuk (Scene 03), `r` = kotak (Scene 04 menyusutkannya jadi kartu) */
export const PanelKaca: React.FC<{ pp?: number; r?: Kotak; op?: number }> = ({ pp = 1, r = PANEL, op = 1 }) => (
  <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, opacity: pp * op, transform: `translateY(${(1 - pp) * 40}px) scale(${lerp(0.96, 1, pp)})`, ...glass(B.turq) }} />);
/** sumbu harga ↑ & waktu → (tumbuh `ax`), `x`/`right` = posisi sumbu-y & ujung sumbu-x; anak = garis tik */
export const SumbuChart: React.FC<{ ax: number; x?: number; right?: number; op?: number; children?: React.ReactNode }> = ({ ax, x = AX.x, right = AX.right, op = 1, children }) => (
  <g stroke={B.grayLite} strokeWidth={LW.main} strokeLinecap="round" fill="none" opacity={op === 1 ? undefined : op}>
    <line x1={x} x2={x} y1={AX.y} y2={lerp(AX.y, AX.top, ax)} />
    <line x1={x} x2={lerp(x, right, ax)} y1={AX.y} y2={AX.y} />
    <path d={`M${x - 9} ${lerp(AX.y, AX.top, ax) + 12} L${x} ${lerp(AX.y, AX.top, ax)} L${x + 9} ${lerp(AX.y, AX.top, ax) + 12}`} />
    <path d={`M${lerp(x, right, ax) - 12} ${AX.y - 9} L${lerp(x, right, ax)} ${AX.y} L${lerp(x, right, ax) - 12} ${AX.y + 9}`} />
    {children}
  </g>);
/** judul sumbu: "Harga (Rp/gram)" di ujung panah sumbu-y, "Waktu (tahun)" di bawah ujung sumbu-x */
export const JudulSumbu: React.FC<{ ax: number; x?: number; right?: number; op?: number }> = ({ ax, x = AX.x, right = AX.right, op = 1 }) => (
  <>
    <div style={{ position: 'absolute', left: x + GAP, top: AX.top, transform: 'translateY(-50%)', opacity: R(ax, 0.8, 1, 0, 1, io) * op, fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>Harga (Rp/gram)</div>
    <div style={{ position: 'absolute', left: right - 300, width: 300, top: AX.y + GAP + 34, textAlign: 'right', opacity: R(ax, 0.8, 1, 0, 1, io) * op, fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night }}>Waktu (tahun)</div>
  </>);
/** teks di samping lencana emas (sapuan WordText) */
export const TeksLencana: React.FC<{ f: number; at: number; teks: string; op?: number; x?: number; y?: number; size?: number }> = ({ f, at, teks, op = 1, x = BADGE.x + BADGE.d / 2 + GAP, y = BADGE.y, size = 30 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', opacity: op === 1 ? undefined : op }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: size, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);

/** label tahun muncul mengikuti ujung sumbu-x yang sedang tumbuh (kiri→kanan) */
const munculX = (ax: number, t: number) => { const k = (tx(t) - AX.x) / (AX.right - AX.x); return R(ax, k - 0.08, k + 0.08, 0, 1, io); };

/** denyut kecil 40f di kata pemicu (dua pil "1 gram" saat "tetap satu gram.") */
const denyut = (_f: number, _at: number) => 0; // dimatikan (Simon 8 Okt: hapus animasi yang tidak diperlukan)

/**
 * simpul emas — STRUKTUR SAMA dengan simpul peta bab Scene 01 (kotak 170 + scale): dasar putih putus-putus, "?" slot,
 * cakram turkis berikon emas (warna bab 02). `hantu` = jejak "hari ini" (garis putus turkis, ikon pudar).
 */
export const Simpul: React.FC<{ x: number; y: number; d: number; dasar?: number; tanya?: number; isi?: number; hantu?: number; foto?: number }> =
  ({ x, y, d, dasar = 0, tanya = 0, isi = 0, hantu = 0, foto = 0 }) => {
    if (dasar <= 0.001 && hantu <= 0.001 && isi <= 0.001) return null;
    const k = d / 170;
    return (
      <>
      <div style={{ position: 'absolute', left: x - 85, top: y - 85, width: 170, height: 170, transform: `scale(${k})` }}>
        {hantu > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.white, border: `3px dashed ${B.turq}`, opacity: hantu, display: 'grid', placeItems: 'center' }}>
            {foto < 0.999 ? <div style={{ opacity: 0.45 * (1 - foto) }}><Icon name="emas" size={96} color={B.turq} /></div> : null}
          </div>) : null}
        {dasar > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.white, border: `3px dashed ${B.grayLite}`, transform: `scale(${dasar})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 72, fontWeight: 800, color: B.grayLite }}>
            <span style={{ opacity: tanya }}>?</span>
          </div>) : null}
        {isi > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.turq, display: 'grid', placeItems: 'center', transform: `scale(${isi})`, boxShadow: `0 18px 40px -12px ${B.turq}aa` }}>
            {foto < 0.999 ? <div style={{ opacity: 1 - foto }}><Icon name="emas" size={96} color={B.white} /></div> : null}
          </div>) : null}
      </div>
      {/* foto emas DI LUAR kotak berskala, digambar di ukuran pikselnya sendiri (cek 12 Okt: di dalam scale(d/170) Chrome meraster ulang foto
          dengan jalur berbeda saat simpul mulai bergerak / zoom kamera berganti → tekstur emas berkedip 1 frame, lonjakan f390 · f445 · f669) */}
      {/* Simon 12 Okt "line putus-putusnya posisikan dibawah emasnya": jejak = foto PUDAR yang PEKAT (dibaurkan putih 55 % di berkasnya), di atas
          cincin putus-putus (dulu foto 45 % transparan → garis tembus di atas emas) */}
      {hantu > 0.001 && foto > 0.001 ? <FotoEmas x={x} y={y} K={k} op={hantu * foto} pudar /> : null}
      {isi > 0.001 && foto > 0.001 ? <FotoEmas x={x} y={y} K={k * isi} op={foto} /> : null}
      </>);
  };

/**
 * FOTO EMAS BATANGAN Simon (12 Okt: "gunakan ini untuk scene emas"; asli 04_Asset/stok-gedung/emas_batangan_simon.webp, dipotong ke
 * kotak tinta → public/media/emas/emas_batangan.webp) di cakram turkis simpul emas, gaya lingkaran bermasker gedung/rumah: tumpukan selebar
 * 1,05 D (lebih besar dari lingkaran, puncaknya menyembul), alas 0,62 r di bawah pusat; di atas garis tengah utuh, di bawahnya terpotong
 * lengkung lingkaran (dipilih dari 4 varian; 1,1 D / 0,6 r membuat puncaknya hanya 6 px dari pil "1 gram", terukur). Koordinat = kotak
 * simpul 170 (diskalakan bersama simpulnya).
 */
const EMAS_RASIO = 914 / 1141;
const FotoEmas: React.FC<{ x: number; y: number; K: number; op: number; pudar?: boolean }> = ({ x, y, K, op, pudar = false }) => {
  // ukuran kotak simpul 170 dikali K (= d/170 × skala isi), pusat (x, y)
  const r = 85 * K, w = 1.05 * 2 * r, h = w * EMAS_RASIO, top = 0.62 * r - h, left = -w / 2, cyImg = -top, cxImg = -left;
  const klip = `path('M -4 -4 H ${w + 4} V ${cyImg} H ${cxImg + r} A ${r} ${r} 0 0 1 ${cxImg - r} ${cyImg} H -4 Z')`;
  return <Img src={staticFile(pudar ? 'media/emas/emas_batangan_pudar.webp' : 'media/emas/emas_batangan.webp')} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none', opacity: op, clipPath: klip, transform: `translate3d(${x + left}px, ${y + top + 0.03}px, 0) rotate(0.001deg)` }} />;
};

/** label waktu di bawah simpul garis waktu */
const Label: React.FC<{ x: number; top: number; f: number; at: number; teks: string; op?: number }> = ({ x, top, f, at, teks, op = 1 }) => (
  <div style={{ position: 'absolute', left: x - 200, width: 400, top, textAlign: 'center', opacity: op }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 42, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);

/** lencana "=" di antara dua pil 1 gram */
const SamaDengan: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 42, top: y - 42, width: 84, height: 84, borderRadius: '50%', background: B.turq, transform: `scale(${p})`, boxShadow: `0 10px 24px -10px ${B.turq}cc` }}>
    <svg width={84} height={84} viewBox="0 0 68 68"><g fill={B.white}><rect x={20} y={24} width={28} height={6} rx={3} /><rect x={20} y={38} width={28} height={6} rx={3} /></g></svg>
  </div>);

/** slot pil kosong (garis putus) — diganti chip aslinya saat frasanya diucapkan */
const SlotChip: React.FC<{ f: number; x: number; at: number; isi: number }> = ({ f, x, at, isi }) => {
  const p = popIn(f, at) * (1 - R(f, isi - 20, isi + 10, 0, 1, io));
  if (p <= 0.001) return null;
  return <div style={{ position: 'absolute', left: x - CHIP_W / 2, top: C.y - CHIP_H / 2, width: CHIP_W, height: CHIP_H, transform: `scale(${Math.max(p, 0)})`, borderRadius: 999, border: `2.5px dashed ${B.grayLite}`, background: B.white, opacity: Math.min(1, p) }} />;
};

/** chip sumber return yang tidak dimiliki emas: muncul (pop) → dicoret (MERAH, Simon 8 Okt; dulu abu + redup) → keluar; garis putus ke emas */
const Chip: React.FC<{ f: number; c: (typeof CHIP)[number]; at: number; coretAt: number; keluar: number }> = ({ f, c, at, coretAt, keluar }) => {
  const p = popIn(f, at) * popOut(f, keluar);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  const col = mixHex(c.col, CORET, coret);
  const kiri = c.x < C.x;
  const g = grow(f, at) * R(f, keluar - 30, keluar + 10, 1, 0, io);
  const x1 = kiri ? c.x + CHIP_W / 2 + GAP : C.x + C.d / 2 + GAP;
  const x2 = kiri ? C.x - C.d / 2 - GAP : c.x - CHIP_W / 2 - GAP;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: g * (1 - 0.5 * coret) }}>
        {kiri
          ? <line x1={x2} x2={lerp(x2, x1, g)} y1={C.y} y2={C.y} stroke={mixHex(c.col, B.grayLite, coret)} strokeWidth={LINE.w} strokeDasharray={LINE.dash} strokeLinecap="round" />
          : <line x1={x1} x2={lerp(x1, x2, g)} y1={C.y} y2={C.y} stroke={mixHex(c.col, B.grayLite, coret)} strokeWidth={LINE.w} strokeDasharray={LINE.dash} strokeLinecap="round" />}
      </svg>
      <div style={{ position: 'absolute', left: c.x - CHIP_W / 2, top: C.y - CHIP_H / 2, width: CHIP_W, height: CHIP_H, transform: `scale(${p})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, background: B.white, border: `3px solid ${col}`, borderRadius: 999,
        boxShadow: `0 12px 28px -14px ${col}88`, fontFamily: F, fontSize: 40, fontWeight: 700, color: B.night, whiteSpace: 'nowrap' }}>
        <div style={{ width: 58, height: 58, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}>
          <Icon name={c.ikon} size={40} color={B.white} />
        </div>
        {c.teks}
        <div style={{ position: 'absolute', left: 26, top: '50%', height: 5, marginTop: -2.5, width: `calc(${coret} * (100% - 52px))`, background: CORET, borderRadius: 3 }} />
      </div>
    </>);
};

/** titik beli/jual di garis harga: isi warna skenario, cincin putih */
const Titik: React.FC<{ x: number; y: number; p: number; col: string }> = ({ x, y, p, col }) => p <= 0.001 ? null : (
  <circle cx={x} cy={y} r={10 * p} fill={col} stroke={B.white} strokeWidth={3.5 * Math.min(1, p)} />);

/** pil hasil (Untung ▲ / Rugi ▼) di sudut kotak skenario yang kosong dari garis harga */
const Hasil: React.FC<{ x: number; y: number; kanan: boolean; teks: string; naik: boolean; col: string; p: number }> = ({ x, y, kanan, teks, naik, col, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${kanan ? '-100%' : '0'}, -50%) scale(${p})`, transformOrigin: 'center', // pop dari TENGAH pil (Simon 7 Okt) — dulu dari tepinya
    display: 'flex', alignItems: 'center', gap: 10, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '11px 24px',
    fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}aa` }}>
    <svg width={22} height={18} viewBox="0 0 22 18"><path d={naik ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} /></svg>
    {teks}
  </div>);

export { Judul } from '../parts/judul';

export const S03_BEAT = { karakternya, emas, hari, ini, gram, sepuluh, lagi, fisik, tetap, gram2, emas2, bunga, rutin, bisnis, menghasilkan, laba, sumber, utamanya, datang, hal, perubahan, beli, rendah, menjualnya, tinggi, untung, sebaliknya, kalau2, turun, rugi };
