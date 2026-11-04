import React from 'react';
import { ARAH, B, lerp } from '../theme';
import { cin } from './kit';
import type { LilinRiil } from '../data/lilinRiil.gen';

/**
 * CANDLE HARIAN RIIL (Simon 27 Okt: "pastikan candlestick yang kamu gunakan realistis seperti candlestick asli"). Data dari src/data/lilinRiil.gen.ts;
 * tiap candle punya waktu terbentuk sendiri — candle yang sedang terbentuk: buka → terendah → tutup, tertinggi muncul di seperempat akhir (sama dengan
 * Scene 08), jadi sumbu & badan selalu bentuk asli.
 */
export const bentuk = (b: LilinRiil, u: number): LilinRiil => {
  if (u >= 1) return b;
  const c = u < 0.5 ? lerp(b.o, b.l, u / 0.5) : lerp(b.l, b.c, (u - 0.5) / 0.5);
  return { t: b.t, o: b.o, c, h: Math.max(b.o, c, u > 0.75 ? b.h : Math.max(b.o, c)), l: Math.min(b.o, c, u >= 0.5 ? b.l : c) };
};
/** kemajuan candle ke-k: 1 untuk candle dasar (k < dasar), lalu cin 30 f yang MULAI di waktu[k − dasar] */
export const kemajuanLilin = (f: number, k: number, dasar: number, waktu: number[], d = 30) =>
  k < dasar ? 1 : cin(f, waktu[k - dasar] + d / 2, d);
/** candle terlihat pada f (candle terakhir mungkin sedang terbentuk) */
export const lilinPada = (f: number, data: LilinRiil[], dasar: number, waktu: number[], d = 30) =>
  data.map((b, k) => ({ b, u: kemajuanLilin(f, k, dasar, waktu, d), k })).filter((x) => x.u > 0).map((x) => ({ ...bentuk(x.b, x.u), k: x.k }));
/** harga terakhir (tutup candle terakhir yang sedang terbentuk) dibulatkan ke fraksi harga BEI */
export const fraksi = (v: number) => (v < 200 ? 1 : v < 500 ? 2 : v < 2000 ? 5 : v < 5000 ? 10 : 25);
export const hargaBulat = (v: number) => Math.round(v / fraksi(v)) * fraksi(v);
/** tanggal awal tiap bulan dalam data → label sumbu */
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const awalBulan = (data: LilinRiil[]) =>
  data.map((b, k) => ({ k, t: b.t })).filter((x, i, a) => i === 0 || a[i - 1].t.slice(0, 7) !== x.t.slice(0, 7))
    .map((x) => ({ k: x.k, teks: `${BULAN[Number(x.t.slice(5, 7)) - 1]} ${x.t.slice(0, 4)}` }));
/** domain atas yang melebar halus mengikuti harga tertinggi yang sudah tampak (chart yang sama — tidak dibangun ulang) */
export const domainHalus = (f0: number, f1: number, target: (f: number) => number) => {
  const a: number[] = [];
  let v = target(f0);
  for (let f = f0; f <= f1; f++) { v += (target(f) - v) * 0.03; a.push(v); }
  return (f: number) => a[Math.max(0, Math.min(a.length - 1, Math.round(f - f0)))];
};

/* ═══ CHART BERGULIR — RESEP VIDEO TA (Simon 28 Okt: "contoh animasi candlestick" + "lebih gampangnya untuk animasi candlestick kamu bisa pelajari dari
 * video TA") = Video 08 `v4/stage.tsx` + Video 10 `v10/chart1.tsx`:
 *  · candle baru TUMBUH dari harga buka — tutup, tertinggi, terendah bergerak LINEAR bersama (min 0,05), warna mengikuti tutup sementara, opacity naik di
 *    sepertiga awal umurnya (tidak pernah pop utuh, tidak muncul begitu saja);
 *  · chart BERGULIR ke kiri selama candle tumbuh (candle yang terbentuk lahir setengah slot di kanan `xKanan`, bergeser satu slot sampai jadi); riwayat
 *    sudah memenuhi jendela saat chart tampil; candle di tepi kiri memudar selebar satu slot;
 *  · skala harga DIKUNCI (tanpa kamera mengikuti) — tidak ada rescale yang bisa menyentak.
 * Dipakai Scene 02 & 04; Scene 07/08/10/12 belum diubah. ═══ */
/** candle yang sedang tumbuh (u 0…1) — resep TA: semua harga dari BUKA secara linear */
export const tumbuh = (b: LilinRiil, u: number): LilinRiil => {
  if (u >= 1) return b;
  const q = Math.max(0.05, u);
  return { t: b.t, o: b.o, c: lerp(b.o, b.c, q), h: lerp(b.o, b.h, q), l: lerp(b.o, b.l, q) };
};
export type JadwalLilin = { mulai: number; d: number }[];
/** posisi gulir = jumlah candle terbentuk (pecahan). Candle ke-(dasar + j) tumbuh linear `mulai` → `mulai + d`; posisi mentah dihaluskan kernel
 *  segitiga ±K f supaya laju gulir tidak menyentak saat rentetan candle mulai/berhenti (di tengah rentetan tetap linear). Ditabelkan sekali. */
export const posisiGulir = (dasar: number, jadwal: JadwalLilin, K = 8) => {
  const mentah = (f: number) => jadwal.reduce((p, j) => p + Math.max(0, Math.min(1, (f - j.mulai) / j.d)), dasar);
  const f0 = Math.floor(Math.min(...jadwal.map((j) => j.mulai))) - K, f1 = Math.ceil(Math.max(...jadwal.map((j) => j.mulai + j.d))) + K;
  const tabel: number[] = [];
  for (let f = f0; f <= f1; f++) {
    let s = 0, w = 0;
    for (let k = -K; k <= K; k++) { const b = K + 1 - Math.abs(k); s += b * mentah(f + k); w += b; }
    tabel.push(s / w);
  }
  return (f: number) => (f <= f0 ? dasar : f >= f1 ? dasar + jadwal.length : tabel[Math.round(f) - f0]);
};
/** candle yang tampak pada posisi gulir `posisi`: x pusat (koordinat plot), bentuk tumbuh, alfa (lahir × pudar tepi kiri) */
export const lilinGulir = (data: LilinRiil[], posisi: number, x0: number, xKanan: number, slot: number) => {
  const L = Math.floor(posisi), u = posisi - L;
  const out: { c: LilinRiil; x: number; alfa: number; k: number }[] = [];
  for (let i = Math.min(L, data.length - 1); i >= 0; i--) {
    const x = xKanan - slot * (posisi - i - 0.5);
    if (x <= x0 - slot / 2) break;
    const uu = i < L ? 1 : u;
    if (uu <= 0) continue;
    const tepi = Math.min(1, (x - (x0 - slot / 2)) / slot);
    out.unshift({ c: tumbuh(data[i], uu), x, alfa: Math.min(1, uu * 3) * tepi, k: i });
  }
  return out;
};
/** DOMAIN HARGA YANG MENGIKUTI candle di jendela (tren besar: S07 +70 %, S08 −38 % lalu +52 % — skala terkunci membuat bagian tenang gepeng):
 *  target = rentang candle di jendela 20 f KE DEPAN (± pad), dihaluskan dua kali eksponensial per frame → tanpa loncatan saat candle ekstrem masuk /
 *  keluar jendela (resep V08 "domain harga yang mulus"). Ditabelkan sekali untuk f0…f1. */
export const domainGulir = (data: LilinRiil[], posisi: (f: number) => number, nSlot: (f: number) => number, f0: number, f1: number, pad = 0.1, a = 0.07) => {
  const tab: [number, number][] = [];
  let p: [number, number] | null = null, q: [number, number] | null = null;
  for (let f = f0; f <= f1; f++) {
    const pos = posisi(f + 20), n = nSlot(f + 20);
    const i1 = Math.min(data.length - 1, Math.ceil(pos)), i0 = Math.max(0, Math.floor(pos - n));
    let lo = Infinity, hi = -Infinity;
    for (let i = i0; i <= i1; i++) { lo = Math.min(lo, data[i].l); hi = Math.max(hi, data[i].h); }
    const m = (hi - lo) * pad, t: [number, number] = [lo - m, hi + m];
    p = p ? [p[0] + (t[0] - p[0]) * a, p[1] + (t[1] - p[1]) * a] : t;
    q = q ? [q[0] + (p[0] - q[0]) * a, q[1] + (p[1] - q[1]) * a] : p;
    tab.push(q);
  }
  return (f: number) => tab[Math.max(0, Math.min(tab.length - 1, Math.round(f) - f0))];
};
/** jangkauan harga terkunci (seluruh candle yang pernah tampak) */
export const jangkauan = (data: LilinRiil[]) => [Math.min(...data.map((b) => b.l)), Math.max(...data.map((b) => b.h))] as const;

/** gambar candle (koordinat lokal svg induk): slot = lebar / jumlah slot */
export const BatangLilin: React.FC<{ c: LilinRiil; x: number; slot: number; Y: (v: number) => number; sumbu?: number; rx?: number; alfa?: number }> =
  ({ c, x, slot, Y, sumbu = 2, rx = 1.5, alfa = 1 }) => {
  const warna = c.c >= c.o ? ARAH.naik : ARAH.turun;
  return (
    <g opacity={alfa < 1 ? alfa : undefined}>
      <line x1={x} x2={x} y1={Y(c.h)} y2={Y(c.l)} stroke={warna} strokeWidth={sumbu} />
      <rect x={x - slot * 0.34} y={Y(Math.max(c.o, c.c))} width={slot * 0.68} height={Math.max(2, Math.abs(Y(c.o) - Y(c.c)))} fill={warna} rx={rx} />
    </g>);
};
export const KisiLilin: React.FC<{ w: number; h: number; tebal?: number }> = ({ w, h, tebal = 1.5 }) => (
  <>{[0.25, 0.5, 0.75].map((u) => <line key={u} x1={0} x2={w} y1={h * u} y2={h * u} stroke={B.grayLite} strokeWidth={tebal} opacity={0.6} />)}</>);
