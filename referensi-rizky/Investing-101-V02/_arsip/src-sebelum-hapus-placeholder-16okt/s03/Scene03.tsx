import React from 'react';
import { gayaKamera, kamera, keLayar } from '../kamera';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, CORET, F, GAP, LINE, R, io, mixHex } from '../theme';
import { cin, glass, grow, Icon, lerp, LW, Pill, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { HARGA } from './harga';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { PanahBadge } from '../parts/rantai';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';

/**
 * SCENE 03 — EMAS (naskah REVISI 16 Okt = gabungan Scene 03 + 04 lama). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "1g GOLD · Hari ini → 1g · 10 tahun lagi → 1g · ↓ NO INTEREST · NO RENT · NO BUSINESS PROFIT · ↓ SUPPLY ↔ DEMAND · ↓ PRICE ↑/↓"
 *   TEXT   "Emas tidak menghasilkan cash flow / return utamanya dari perubahan harga"
 * Feedback (Video 02 · Scene 4): alasan naik-turun (geopolitik, USD, bank sentral) DIHAPUS; tekankan emas tidak menghasilkan sewa/laba,
 * harganya hanya dari supply-demand.
 * Benang merah tetap SATU benda emas (simpul bab 02): peta bab → garis waktu 10 tahun (tetap 1 gram, bagian lama yang disetujui) →
 * tengah, TIGA sumber return dicoret satu per satu di bawahnya (Bunga · Sewa · Laba bisnis, susunan bergeser bertahap supaya tetap
 * di tengah) → lencana chart "Harga pasar" → chart menyusut jadi kartu "Harga emas" di samping TIMBANGAN supply–demand: permintaan
 * lebih berat → harga naik (hijau), permintaan melemah → harga turun (merah) → emas kembali ke tengah, "Cash flow" dicoret.
 * Keluar = masker lingkaran ke simpul bab 02 di peta pembuka Properti (pola Scene 04 lama), 50f mulai BATAS.s5.
 * Animasi keluar Scene 02 milik scene ini (aturan Simon Scene 1→2): mulai BATAS.s3.
 */
export const S3 = BATAS.s3;
/** frame 0 komposisi Ide-S03 */
export const IDE_S03_AWAL = S3;

const [, emas, hari, ini, gram, , lagi, fisik, tetap, , emas2, bunga, , sewa, bisnis, laba, sumber, utamanya, datang, dari,
  perubahan, , harga3, supply, demand, , naik, kuat, , harganya, naik2, , melemah, harganya2, turun, jadi2, memegang, tidak3,
  menghasilkan3, cash, flow] = urut(['karakternya', 'emas', 'hari', 'ini', 'gram', 'sepuluh', 'lagi', 'fisik', 'tetap', 'gram',
  'emas', 'bunga', 'menghasilkan', 'sewa', 'bisnis', 'laba', 'sumber', 'utamanya', 'datang', 'dari', 'perubahan', 'harga', 'harga',
  'supply', 'demand', 'permintaan', 'naik', 'kuat', 'pasokan', 'harganya', 'naik', 'permintaan', 'melemah', 'harganya', 'turun',
  'jadi', 'memegang', 'tidak', 'menghasilkan', 'cash', 'flow'], S3);

/* ── geometri garis waktu (bagian lama yang disetujui, tidak diubah) ── */
const N0 = { x: 960, y: 535, d: 210 };
const TL = { y: 557, xa: 516, xb: 1396, d: 220 };
const PETA_SELESAI = hari + 30;
const PIL_Y = TL.y - 168;
const TICK = Array.from({ length: 9 }, (_, k) => TL.xa + TL.d / 2 + (k + 1) * ((TL.xb - TL.xa - TL.d) / 10));

/* ── tiga sumber return yang TIDAK dimiliki emas: emas di tengah atas, chip berjajar di bawah namanya ── */
const C = { x: 960, y: 420, d: 250 };
const CHIP = { y: 772, w: 350, h: 84, celah: 44 };
const SUMBER_LAIN: { teks: string; ikon: KunciIkon; col: string; at: number; coret: number }[] = [
  { teks: 'Bunga', ikon: 'bunga', col: B.orange, at: bunga, coret: bunga + 45 },
  { teks: 'Sewa', ikon: 'kunciSewa', col: B.turq, at: sewa, coret: sewa + 40 },
  { teks: 'Laba bisnis', ikon: 'bisnisLaba', col: B.blue, at: bisnis, coret: laba + 25 },
];
/** x chip k bila c chip tampil (susunan selalu berpusat di 960) */
const xChip = (c: number, k: number) => 960 + (k - (c - 1) / 2) * (CHIP.w + CHIP.celah);
/** geser bertahap (Simon 8 Okt: muncul per kata, tengah dijaga dengan geseran 60f yang selesai saat chip baru muncul) */
const geserChip = (f: number, k: number) => {
  const t1 = R(f, SUMBER_LAIN[1].at - 50, SUMBER_LAIN[1].at + 10, 0, 1, io), t2 = R(f, SUMBER_LAIN[2].at - 50, SUMBER_LAIN[2].at + 10, 0, 1, io);
  if (k === 0) return lerp(lerp(xChip(1, 0), xChip(2, 0), t1), xChip(3, 0), t2);
  if (k === 1) return lerp(xChip(2, 1), xChip(3, 1), t2);
  return xChip(3, 2);
};

/* ── chart harga pasar (bagian lama) — panel kaca; tidak ada garis yang keluar panel ── */
export const PANEL = { x: 300, y: 212, w: 1320, h: 672 };
export const BADGE = { x: 380, y: 262, d: 64 };
export const AX = { x: 380, top: 318, y: 780, right: 1540 };
const VMIN = 82, VMAX = 138, PT = 330;
const px = (i: number) => 400 + (i * 1120) / (HARGA.length - 1);
const TICK_TAHUN = [0, 2, 4, 6, 8, 10];
const tx = (th: number) => px((th * (HARGA.length - 1)) / 10);
const py = (v: number) => AX.y - ((v - VMIN) * (AX.y - PT)) / (VMAX - VMIN);

/* ── kartu "Harga emas" + TIMBANGAN supply–demand (berdampingan, pusat tinta susunan = 960) ── */
const C4 = { x: 1060, y: 330, w: 540, h: 390 };
const LENCANA_KARTU = { x: C4.x + 62, y: C4.y + 60, d: 62 };
/** garis harga di kartu: data lama (64 titik) di 56 % kiri, lalu ruas NAIK (permintaan menguat) dan ruas TURUN (permintaan melemah) */
const KX0 = C4.x + 44, KW = C4.w - 88;
const KV0 = 82, KV1 = 152;
const ky = (v: number) => C4.y + C4.h - 46 - ((v - KV0) * (C4.h - 46 - 128)) / (KV1 - KV0);
const kxBase = (i: number) => KX0 + (i * 0.56 * KW) / (HARGA.length - 1);
const V_AKHIR = HARGA[HARGA.length - 1];
/** ruas tambahan (titik), riak kecil deterministik supaya terbaca sebagai harga, bukan garis lurus */
const RUAS_NAIK = Array.from({ length: 14 }, (_, k) => {
  const t = k / 13;
  return { x: KX0 + 0.56 * KW + t * 0.22 * KW, v: V_AKHIR + (147 - V_AKHIR) * (t * t * (3 - 2 * t)) + 2.2 * Math.sin(k * 2.1) * Math.sin(Math.PI * t) };
});
const RUAS_TURUN = Array.from({ length: 14 }, (_, k) => {
  const t = k / 13;
  return { x: KX0 + 0.78 * KW + t * 0.22 * KW, v: 147 + (100 - 147) * (t * t * (3 - 2 * t)) + 2.4 * Math.sin(k * 1.7 + 1) * Math.sin(Math.PI * t) };
});
const polyRuas = (pts: { x: number; v: number }[], p: number) => {
  const u = (pts.length - 1) * Math.max(0, Math.min(1, p)), k = Math.floor(u);
  const out = pts.slice(0, k + 1).map((q) => `${q.x.toFixed(1)},${ky(q.v).toFixed(1)}`);
  if (u > k && k + 1 < pts.length) out.push(`${lerp(pts[k].x, pts[k + 1].x, u - k).toFixed(1)},${lerp(ky(pts[k].v), ky(pts[k + 1].v), u - k).toFixed(1)}`);
  return out.join(' ');
};
/** timbangan: tiang di x 642, poros y 468, lengan ±232, piring tergantung 150 di bawah ujung lengan */
const BAL = { x: 642, py: 468, L: 232, gant: 150, alas: 830, tile: 120 };
/** emas kembali ke tengah di akhir ("selama kita memegang emas"): sendirian = berpusat (y 500), lalu naik bertahap ke 430 saat chip
 *  "Cash flow" muncul di bawahnya (susunan tetap di tengah tanpa kamera maju-mundur) */
const CE = { x: 960, y: 500, yChip: 430, d: 250 };

/** potongan garis harga dari indeks a ke b, tergambar sejauh p (0..1) — titik = (x, y) yang sudah dipetakan */
const garisDari = (pts: (readonly [number, number])[], a: number, b: number, p: number) => {
  const u = a + (b - a) * Math.max(0, Math.min(1, p));
  const k = Math.floor(u);
  const out = pts.slice(a, k + 1).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`);
  if (u > k && k + 1 <= b) out.push(`${lerp(pts[k][0], pts[k + 1][0], u - k).toFixed(1)},${lerp(pts[k][1], pts[k + 1][1], u - k).toFixed(1)}`);
  return out.join(' ');
};

export const Scene03: React.FC<{ f: number }> = ({ f }) => {
  if (f < S3) return null;
  // KELUAR = milik Properti (pola Scene 04 lama): MASKER LINGKARAN — isi menyusut ke simpul bab 02 (Emas) di peta pembuka Properti,
  // berubah toska (warna bab 02) + ikonnya, lalu peta mengambil alih. 50f mulai BATAS.s5.
  if (f >= BATAS.s5 + 52) return null;
  const ex = R(f, BATAS.s5, BATAS.s5 + 50, 0, 1, io);
  const kam5 = kamera('S05', BATAS.s5 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam5, SIMPUL_PETA(1)), r: SIMPUL_PETA(1).r * kam5.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);

  /* ── emas: SATU benda — tengah → garis waktu → tengah (sumber dicoret) → lencana chart → lencana kartu → tengah ── */
  const rL = cin(f, hari);
  const tr = cin(f, lagi);
  const rC = cin(f, emas2 + 40);
  const rB = cin(f, datang); // emas terbang jadi lencana DULU, panel tumbuh 20f sesudahnya
  const mK = cin(f, harga3 + 20); // chart → kartu
  const rE = cin(f, memegang); // lencana kartu → tengah
  const ceY = lerp(CE.y, CE.yChip, R(f, menghasilkan3 - 50, menghasilkan3 + 10, 0, 1, io));
  let gx = lerp(N0.x, TL.xa, rL), gy = lerp(N0.y, TL.y, rL), gd = lerp(N0.d, TL.d, rL);
  gx = lerp(gx, TL.xb, tr);
  gx = lerp(gx, C.x, rC); gy = lerp(gy, C.y, rC); gd = lerp(gd, C.d, rC);
  const badge = { x: lerp(BADGE.x, LENCANA_KARTU.x, mK), y: lerp(BADGE.y, LENCANA_KARTU.y, mK), d: lerp(BADGE.d, LENCANA_KARTU.d, mK) };
  gx = lerp(gx, badge.x, rB); gy = lerp(gy, badge.y, rB); gd = lerp(gd, badge.d, rB);
  gx = lerp(gx, CE.x, rE); gy = lerp(gy, ceY, rE); gd = lerp(gd, CE.d, rE);
  const travX = lerp(TL.xa, TL.xb, tr);
  const keluarTL = R(f, emas2 - 5, emas2 + 55, 0, 1, io);
  const tlOp = 1 - keluarTL;

  /* ── chart ⇄ kartu ── */
  const pp = cin(f, datang + 20);
  const ax = grow(f, dari);
  const dr = cin(f, perubahan + 20);
  const isiChart = 1 - R(f, harga3 - 12, harga3 + 6, 0, 1, io); // sumbu, tahun, judul sumbu — pudar sebelum panel menyusut
  const isiKartu = R(f, harga3 + 32, harga3 + 52, 0, 1, io);
  const keluarD = R(f, jadi2 - 10, jadi2 + 40, 0, 1, io); // timbangan & kartu pergi; emas kembali ke tengah
  const panel = { x: lerp(PANEL.x, C4.x, mK), y: lerp(PANEL.y, C4.y, mK), w: lerp(PANEL.w, C4.w, mK), h: lerp(PANEL.h, C4.h, mK) };
  const PTS = HARGA.map((v, i) => [lerp(px(i), kxBase(i), mK), lerp(py(v), ky(v), mK)] as const);
  const gNaik = R(f, harganya - 24, naik2 + 24, 0, 1, io), gTurun = R(f, harganya2 - 20, turun + 30, 0, 1, io);

  /* ── timbangan: lengan miring ke sisi yang lebih berat (permintaan menguat → kanan turun; melemah → kiri turun) ── */
  const balP = popIn(f, supply - 22);
  const tilt = 10 * R(f, kuat - 20, kuat + 40, 0, 1, io) - 20 * R(f, melemah - 15, melemah + 45, 0, 1, io);
  const th = (tilt * Math.PI) / 180;
  const ujungKiri = { x: BAL.x - BAL.L * Math.cos(th), y: BAL.py - BAL.L * Math.sin(th) };
  const ujungKanan = { x: BAL.x + BAL.L * Math.cos(th), y: BAL.py + BAL.L * Math.sin(th) };
  const flipDemand = R(f, melemah - 20, melemah + 20, 0, 1, io);

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s5, BATAS.s5 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* ═════ judul (kolom TEXT naskah) ═════ */}
      <Judul f={f} kata={['Emas', 'tidak', 'menghasilkan', 'cash flow']} at={emas2 + 10} sorotAt={laba + 10} keluar={sumber} />
      <Judul f={f} kata={['Return', 'utamanya', 'dari', 'perubahan harga']} at={utamanya + 10} sorotAt={perubahan + 40} keluar={jadi2 + 10} />
      <Judul f={f} kata={['Emas', 'tidak', 'menghasilkan', 'cash flow']} at={tidak3} sorotAt={cash + 10} />

      {/* ISI — kamera pusat; judul tidak ikut */}
      <AbsoluteFill style={gayaKamera('S03', f, f >= BATAS.s5 - 30)}>
      {/* ═════ garis waktu 10 tahun (bagian lama) ═════ */}
      {tlOp > 0.001 && f >= hari - 40 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: tlOp }}>
          {(() => {
            const a = TL.xa + TL.d / 2 + GAP, b = TL.xb - TL.d / 2 - GAP;
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
          {(() => {
            const o = cin(f, hari + 20) * (1 - R(f, lagi + 10, lagi + 30, 0, 1, io));
            return o > 0.001 ? <div style={{ position: 'absolute', left: TL.xb - TL.d / 2, top: TL.y - TL.d / 2, width: TL.d, height: TL.d, borderRadius: '50%', border: `3px dashed ${B.grayLite}`, background: B.white, opacity: o }} /> : null;
          })()}
          {tr > 0.001 ? <Simpul x={TL.xa} y={TL.y} d={TL.d} hantu={Math.min(1, tr * 4)} foto={1} /> : null}
          <Label x={TL.xa} top={TL.y + TL.d / 2 + 30} f={f} at={ini + 5} teks="Hari ini" />
          <Label x={TL.xb} top={TL.y + TL.d / 2 + 30} f={f} at={lagi + 15} teks="10 tahun lagi" />
          <Pill x={TL.xa} y={PIL_Y} anchor="center" size={40} col={B.turq} text="1 gram" p={popIn(f, gram)} />
          <Pill x={TL.xb} y={PIL_Y} anchor="center" size={40} col={B.turq} text="1 gram" p={popIn(f, fisik)} />
          <SamaDengan x={960} y={PIL_Y} p={popIn(f, tetap)} />
        </AbsoluteFill>) : null}

      {/* ═════ tiga sumber return yang TIDAK dimiliki emas — muncul di katanya, dicoret merah ═════ */}
      {SUMBER_LAIN.map((c, k) => <ChipCoret key={c.teks} f={f} x={geserChip(f, k)} y={CHIP.y} w={CHIP.w} c={c} at={c.at} coretAt={c.coret} keluar={datang} />)}
      {f >= emas2 && rB < 1 ? <Label x={gx} top={gy + gd / 2 + 30} f={f} at={emas2 + 50} teks="Emas" op={1 - cin(f, datang)} /> : null}

      {/* ═════ chart harga pasar → kartu "Harga emas" ═════ */}
      {pp > 0.001 && keluarD < 1 ? <PanelKaca pp={pp} r={panel} op={1 - keluarD} /> : null}
      {pp > 0.001 && keluarD < 1 ? (
        <AbsoluteFill style={{ opacity: pp * (1 - keluarD) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {ax > 0.001 && isiChart > 0.001 ? (
              <SumbuChart ax={ax} op={isiChart}>
                {TICK_TAHUN.map((t) => <line key={t} x1={tx(t)} x2={tx(t)} y1={AX.y} y2={AX.y + 9} opacity={munculX(ax, t)} />)}
              </SumbuChart>) : null}
            {/* garis harga pasar (di chart lalu di kartu — titik yang sama, dipetakan ulang) */}
            {dr > 0.001 ? <polyline points={garisDari(PTS, 0, HARGA.length - 1, dr)} fill="none" stroke={B.blue} strokeWidth={lerp(4.5, 3.5, mK)} strokeLinejoin="round" strokeLinecap="round" /> : null}
            {/* permintaan menguat → ruas NAIK (hijau) · melemah → ruas TURUN (merah) */}
            {gNaik > 0.001 ? <polyline points={polyRuas(RUAS_NAIK, gNaik)} fill="none" stroke={ARAH.naik} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" /> : null}
            {gTurun > 0.001 ? <polyline points={polyRuas(RUAS_TURUN, gTurun)} fill="none" stroke={ARAH.turun} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" /> : null}
          </svg>
          {TICK_TAHUN.map((t) => (
            <div key={t} style={{ position: 'absolute', left: tx(t) - 40, width: 80, top: AX.y + GAP, textAlign: 'center', opacity: munculX(ax, t) * isiChart, fontFamily: F, fontSize: 22, fontWeight: 700, color: B.gray }}>{t}</div>))}
          {isiChart > 0.001 ? <JudulSumbu ax={ax} op={isiChart} /> : null}
          <TeksLencana f={f} at={dari + 10} teks="Harga pasar" op={isiChart} />
          {isiKartu > 0.001 ? <TeksLencana f={f} at={harga3 + 50} teks="Harga emas" op={isiKartu} x={LENCANA_KARTU.x + LENCANA_KARTU.d / 2 + GAP} y={LENCANA_KARTU.y} size={34} /> : null}
          {/* rata-rata return historis (grafik Simon: Emas 14,2%/tahun) — feedback: tiap aset sebutkan return historisnya */}
          <PilNominal x={LENCANA_KARTU.x + LENCANA_KARTU.d / 2 + GAP} y={LENCANA_KARTU.y + 44} jangkar="kiri" teks="±14,2%/tahun" arah={0} p={popIn(f, harga3 + 70) * isiKartu} size={20} />
          {/* penanda arah di ujung tiap ruas */}
          <PanahBadge x={RUAS_NAIK[13].x} y={ky(RUAS_NAIK[13].v) - 46} d={52} naik p={popIn(f, naik2 + 10)} flip={0} />
          <PanahBadge x={RUAS_TURUN[13].x} y={ky(RUAS_TURUN[13].v) + 46} d={52} p={popIn(f, turun + 20)} flip={0} />
        </AbsoluteFill>) : null}

      {/* ═════ TIMBANGAN supply–demand ═════ */}
      {balP > 0.001 && keluarD < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - keluarD }}>
          <Timbangan p={balP} kiri={ujungKiri} kanan={ujungKanan} />
          {/* piring kiri = Supply (pasokan emas), kanan = Demand (permintaan); label di bawah piring */}
          <TilePiring x={ujungKiri.x} y={ujungKiri.y + BAL.gant - 72} ikon="emas" col={B.turq} p={popIn(f, supply)} />
          <TilePiring x={ujungKanan.x} y={ujungKanan.y + BAL.gant - 72} ikon="permintaanEmas" col={B.orange} p={popIn(f, demand)} />
          <LabelKecil x={ujungKiri.x} top={ujungKiri.y + BAL.gant + 30} f={f} at={supply + 12} teks="Supply" />
          <LabelKecil x={ujungKanan.x} top={ujungKanan.y + BAL.gant + 30} f={f} at={demand + 12} teks="Demand" />
          {/* permintaan menguat ▲ (hijau) → melemah ▼ (merah) */}
          <PanahBadge x={ujungKanan.x + BAL.tile * 0.4} y={ujungKanan.y + BAL.gant - 72 - BAL.tile * 0.4} d={50} naik p={popIn(f, naik)} flip={flipDemand} />
        </AbsoluteFill>) : null}

      {/* ═════ akhir: "Cash flow" dicoret di bawah emas ═════ */}
      <ChipCoret f={f} x={960} y={CHIP.y} w={CHIP.w + 20} c={{ teks: 'Cash flow', ikon: 'pendapatan', col: B.blue }} at={menghasilkan3} coretAt={flow + 5} keluar={BATAS.s5 + 200} />
      {rE > 0.001 ? <Label x={CE.x} top={ceY + CE.d / 2 + 30} f={f} at={memegang + 40} teks="Emas" /> : null}

      {/* ═════ emas (paling atas): simpul bab 02 ═════ */}
      <PembukaBab f={f} s0={S3} k={1} isiAt={emas} tengah={{ x: TL.xa, y: TL.y, d: TL.d }} selesai={PETA_SELESAI} pergi={emas + 10} />
      {/* foto emas: tampil saat emas besar (garis waktu, tengah, akhir); lencana chart/kartu = ikon */}
      {f >= PETA_SELESAI ? <Simpul x={gx} y={gy} d={gd} dasar={1} isi={1} foto={R(f, PETA_SELESAI, PETA_SELESAI + 30, 0, 1, io) * (1 - R(rB, 0.55, 0.95, 0, 1, io)) + R(rE, 0.05, 0.45, 0, 1, io)} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.turq, opacity: R(f, BATAS.s5 + 22, BATAS.s5 + 48, 0, 1, io) }} /> : null}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s5 + 34, BATAS.s5 + 48, 0, 1, io) }}><Icon name="emas" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/* ══ KERANGKA CHART ══ */
type Kotak = { x: number; y: number; w: number; h: number };
export const PanelKaca: React.FC<{ pp?: number; r?: Kotak; op?: number }> = ({ pp = 1, r = PANEL, op = 1 }) => (
  <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, opacity: pp * op, transform: `translateY(${(1 - pp) * 40}px) scale(${lerp(0.96, 1, pp)})`, ...glass(B.turq) }} />);
export const SumbuChart: React.FC<{ ax: number; x?: number; right?: number; op?: number; children?: React.ReactNode }> = ({ ax, x = AX.x, right = AX.right, op = 1, children }) => (
  <g stroke={B.grayLite} strokeWidth={LW.main} strokeLinecap="round" fill="none" opacity={op === 1 ? undefined : op}>
    <line x1={x} x2={x} y1={AX.y} y2={lerp(AX.y, AX.top, ax)} />
    <line x1={x} x2={lerp(x, right, ax)} y1={AX.y} y2={AX.y} />
    <path d={`M${x - 9} ${lerp(AX.y, AX.top, ax) + 12} L${x} ${lerp(AX.y, AX.top, ax)} L${x + 9} ${lerp(AX.y, AX.top, ax) + 12}`} />
    <path d={`M${lerp(x, right, ax) - 12} ${AX.y - 9} L${lerp(x, right, ax)} ${AX.y} L${lerp(x, right, ax) - 12} ${AX.y + 9}`} />
    {children}
  </g>);
export const JudulSumbu: React.FC<{ ax: number; x?: number; right?: number; op?: number }> = ({ ax, x = AX.x, right = AX.right, op = 1 }) => (
  <>
    <div style={{ position: 'absolute', left: x + GAP, top: AX.top, transform: 'translateY(-50%)', opacity: R(ax, 0.8, 1, 0, 1, io) * op, fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>Harga (Rp/gram)</div>
    <div style={{ position: 'absolute', left: right - 300, width: 300, top: AX.y + GAP + 34, textAlign: 'right', opacity: R(ax, 0.8, 1, 0, 1, io) * op, fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night }}>Waktu (tahun)</div>
  </>);
export const TeksLencana: React.FC<{ f: number; at: number; teks: string; op?: number; x?: number; y?: number; size?: number }> = ({ f, at, teks, op = 1, x = BADGE.x + BADGE.d / 2 + GAP, y = BADGE.y, size = 30 }) => (
  op <= 0.001 ? null : <div style={{ position: 'absolute', left: x, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', opacity: op === 1 ? undefined : op }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: size, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);
const munculX = (ax: number, t: number) => { const k = (tx(t) - AX.x) / (AX.right - AX.x); return R(ax, k - 0.08, k + 0.08, 0, 1, io); };

/**
 * simpul emas — STRUKTUR SAMA dengan simpul peta bab Scene 01 (kotak 170 + scale). `hantu` = jejak "hari ini".
 */
export const Simpul: React.FC<{ x: number; y: number; d: number; dasar?: number; tanya?: number; isi?: number; hantu?: number; foto?: number }> =
  ({ x, y, d, dasar = 0, tanya = 0, isi = 0, hantu = 0, foto = 0 }) => {
    if (dasar <= 0.001 && hantu <= 0.001 && isi <= 0.001) return null;
    const k = d / 170;
    const fo = Math.min(1, foto);
    return (
      <>
      <div style={{ position: 'absolute', left: x - 85, top: y - 85, width: 170, height: 170, transform: `scale(${k})` }}>
        {hantu > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.white, border: `3px dashed ${B.turq}`, opacity: hantu, display: 'grid', placeItems: 'center' }}>
            {fo < 0.999 ? <div style={{ opacity: 0.45 * (1 - fo) }}><Icon name="emas" size={96} color={B.turq} /></div> : null}
          </div>) : null}
        {dasar > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.white, border: `3px dashed ${B.grayLite}`, transform: `scale(${dasar})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 72, fontWeight: 800, color: B.grayLite }}>
            <span style={{ opacity: tanya }}>?</span>
          </div>) : null}
        {isi > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.turq, display: 'grid', placeItems: 'center', transform: `scale(${isi})`, boxShadow: `0 18px 40px -12px ${B.turq}aa` }}>
            {fo < 0.999 ? <div style={{ opacity: 1 - fo }}><Icon name="emas" size={96} color={B.white} /></div> : null}
          </div>) : null}
      </div>
      {hantu > 0.001 && fo > 0.001 ? <FotoEmas x={x} y={y} K={k} op={hantu * fo} pudar /> : null}
      {isi > 0.001 && fo > 0.001 ? <FotoEmas x={x} y={y} K={k * isi} op={fo} /> : null}
      </>);
  };

/** foto emas batangan Simon di cakram turkis (gaya lingkaran bermasker) — di LUAR kotak berskala (tanpa kedip raster) */
const EMAS_RASIO = 914 / 1141;
const FotoEmas: React.FC<{ x: number; y: number; K: number; op: number; pudar?: boolean }> = ({ x, y, K, op, pudar = false }) => {
  const r = 85 * K, w = 1.05 * 2 * r, h = w * EMAS_RASIO, top = 0.62 * r - h, left = -w / 2, cyImg = -top, cxImg = -left;
  const klip = `path('M -4 -4 H ${w + 4} V ${cyImg} H ${cxImg + r} A ${r} ${r} 0 0 1 ${cxImg - r} ${cyImg} H -4 Z')`;
  return <Img src={staticFile(pudar ? 'media/emas/emas_batangan_pudar.webp' : 'media/emas/emas_batangan.webp')} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none', opacity: op, clipPath: klip, transform: `translate3d(${x + left}px, ${y + top + 0.03}px, 0) rotate(0.001deg)` }} />;
};

/** label di bawah benda (42 px) */
const Label: React.FC<{ x: number; top: number; f: number; at: number; teks: string; op?: number }> = ({ x, top, f, at, teks, op = 1 }) => (
  <div style={{ position: 'absolute', left: x - 200, width: 400, top, textAlign: 'center', opacity: op }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 42, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);
/** label piring timbangan (34 px) — posisi lewat transform (ikut lengan yang miring) */
const LabelKecil: React.FC<{ x: number; top: number; f: number; at: number; teks: string }> = ({ x, top, f, at, teks }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 300, textAlign: 'center', transform: `translate3d(${x - 150}px, ${top}px, 0) rotate(0.001deg)` }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);

/** lencana "=" di antara dua pil 1 gram */
const SamaDengan: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 42, top: y - 42, width: 84, height: 84, borderRadius: '50%', background: B.turq, transform: `scale(${p})`, boxShadow: `0 10px 24px -10px ${B.turq}cc` }}>
    <svg width={84} height={84} viewBox="0 0 68 68"><g fill={B.white}><rect x={20} y={24} width={28} height={6} rx={3} /><rect x={20} y={38} width={28} height={6} rx={3} /></g></svg>
  </div>);

/** chip sumber return yang tidak dimiliki emas: pop di katanya → dicoret MERAH (Simon 8 Okt) → keluar. Posisi lewat transform (geser bertahap) */
const ChipCoret: React.FC<{ f: number; x: number; y: number; w: number; c: { teks: string; ikon: KunciIkon; col: string }; at: number; coretAt: number; keluar: number }> = ({ f, x, y, w, c, at, coretAt, keluar }) => {
  const p = popIn(f, at) * popOut(f, keluar);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  const col = mixHex(c.col, CORET, coret);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: CHIP.h, transform: `translate3d(${x - w / 2}px, ${y - CHIP.h / 2}px, 0) scale(${p}) rotate(0.001deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, background: B.white, border: `3px solid ${col}`, borderRadius: 999,
      boxShadow: `0 12px 28px -14px ${col}88`, fontFamily: F, fontSize: 38, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', boxSizing: 'border-box' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}>
        <Icon name={c.ikon} size={38} color={B.white} />
      </div>
      {c.teks}
      <div style={{ position: 'absolute', left: 26, top: '50%', height: 5, marginTop: -2.5, width: `calc(${coret} * (100% - 52px))`, background: CORET, borderRadius: 3 }} />
    </div>);
};

/** timbangan: alas + tiang + poros + lengan miring + tali & piring di kedua ujung (warna brand) */
const Timbangan: React.FC<{ p: number; kiri: { x: number; y: number }; kanan: { x: number; y: number } }> = ({ p, kiri, kanan }) => {
  const piring = (u: { x: number; y: number }) => {
    const yb = u.y + BAL.gant;
    return (
      <g>
        <line x1={u.x} y1={u.y} x2={u.x - 82} y2={yb - 6} stroke={B.gray} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={u.x} y1={u.y} x2={u.x + 82} y2={yb - 6} stroke={B.gray} strokeWidth={2.5} strokeLinecap="round" />
        <path d={`M ${u.x - 96} ${yb - 6} Q ${u.x} ${yb + 44} ${u.x + 96} ${yb - 6} Z`} fill={B.white} stroke={B.grayLite} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={u.x} cy={u.y} r={7} fill={B.blue} />
      </g>);
  };
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: Math.min(1, p), transformOrigin: `${BAL.x}px ${BAL.alas}px`, transform: `scale(${p})` }}>
      <rect x={BAL.x - 110} y={BAL.alas - 18} width={220} height={18} rx={9} fill={B.blueLite} />
      <rect x={BAL.x - 9} y={BAL.py} width={18} height={BAL.alas - BAL.py - 14} rx={9} fill={B.blueLite} />
      <line x1={kiri.x} y1={kiri.y} x2={kanan.x} y2={kanan.y} stroke={B.blue} strokeWidth={14} strokeLinecap="round" />
      <path d={`M ${BAL.x - 26} ${BAL.py + 26} L ${BAL.x} ${BAL.py - 8} L ${BAL.x + 26} ${BAL.py + 26} Z`} fill={B.blue} strokeLinejoin="round" />
      <circle cx={BAL.x} cy={BAL.py} r={10} fill={B.white} stroke={B.blue} strokeWidth={4} />
      {piring(kiri)}
      {piring(kanan)}
    </svg>);
};

/** lingkaran ikon di atas piring (gaya Tile) — posisi lewat transform (ikut lengan yang miring tanpa loncat piksel) */
const TilePiring: React.FC<{ x: number; y: number; ikon: KunciIkon; col: string; p: number }> = ({ x, y, ikon, col, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: BAL.tile, height: BAL.tile, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center',
    transform: `translate3d(${x - BAL.tile / 2}px, ${y - BAL.tile / 2}px, 0) scale(${p}) rotate(0.001deg)`, boxShadow: `0 14px 30px -12px ${col}aa` }}>
    <Icon name={ikon} size={BAL.tile * 0.58} color={B.white} />
  </div>);

export const S03_BEAT = { emas, hari, ini, gram, lagi, fisik, tetap, emas2, bunga, sewa, bisnis, laba, sumber, utamanya, datang, dari, perubahan, harga3, supply, demand, naik, kuat, harganya, naik2, melemah, harganya2, turun, jadi2, memegang, tidak3, menghasilkan3, cash, flow };
