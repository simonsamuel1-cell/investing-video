import { Easing, interpolate } from 'remotion';

/* Warna: HANYA warna brand Tuntun (token sama dengan Video 10). */
export const B = {
  blue: '#5F4DEE', blueLite: '#8F83F4', blueWash: '#EFEDFE',
  turq: '#5CC8E3', turqLite: '#9BDDEE', turqWash: '#EAF9FD',
  orange: '#E49C2C', orangeLite: '#EFBE73', orangeWash: '#FDF3E4',
  night: '#16181B', gray: '#8E8E96', grayLite: '#C7C7CE', white: '#FFFFFF',
};
/** ARAH HARGA — Simon 7 Okt: "untuk menandakan kenaikan dan penurunan harga gunakan warna merah dan hijau".
 *  PENGECUALIAN aturan warna brand, KHUSUS penanda naik/turun (harga, panah ▲▼, untung/rugi). Nilai = warna candle Tuntun
 *  di video sebelumnya. Alur/penghubung & elemen lain tetap warna brand. */
export const ARAH = { naik: '#22B573', turun: '#E5475D' } as const;
/** WARNA OBJEK — Simon 8 Okt: "warna yang berbeda untuk setiap object visual … gunakan warna turunan dari warna brand" + "jika icon atau
 *  visual memiliki konteks yang mirip jangan gunakan warna yang sama" + "memperjelas konteks … dari segi hirarki, warna juga".
 *  Simon 9 Okt: "warna turunan dari brand jangan gunakan yang gelap, tapi gunakan yang terang" → turunan = TINT TERANG (token Lite brand:
 *  blueLite · turqLite · orangeLite), bukan shade gelap (dulu biruTua #493DAF · turkisTua #4793A7 · oranyeTua #B07B28 · abuTua #64656B).
 *  Hijau/merah TETAP khusus naik/turun harga (ARAH). Urutan = urutan pakai untuk objek bersaudara (kontras berurutan). */
/** LINGKARAN GEDUNG (Simon 9 Okt: "ganti warnanya lingkarannya ke warna biru brand" lalu "jangan gunakan warna ungu"): biru langit
 *  #5E8AE8 = campuran 50:50 Neon Blue + Dark Turquoise (dua warna brand, sudah dipakai sebagai WARNA.langit) + wash = langit + putih 90 % */
export const BIRU_GEDUNG = { isi: '#5E8AE8', wash: '#EFF3FD' } as const;
export const WARNA = { "biru": "#5F4DEE", "ungu": B.blueLite, "langit": "#5E8AE8", "turkis": "#5CC8E3", "turkisMuda": B.turqLite, "oranye": "#E49C2C", "oranyeMuda": B.orangeLite } as const;
/** objek bersaudara ke-i (berurutan kontras: biru → oranye → turkis → ungu muda → langit → oranye muda → turkis muda) */
export const URUT_WARNA = [WARNA.biru, WARNA.oranye, WARNA.turkis, WARNA.ungu, WARNA.langit, WARNA.oranyeMuda, WARNA.turkisMuda];
/** TAG DICORET — Simon 8 Okt: "ganti warna tag setelah dicoret ke warna merah seperti yang ada di scene 2" (bingkai, ikon, garis coret) */
export const CORET = '#D51C39';
/** centang / hal positif — HIJAU (Simon 22 Okt sore: "Ganti warna lingkaran centang ke warna hijau"; dulu Neon Blue) */
export const CEK = ARAH.naik;
/** IKON LINGKARAN DIBALIK (Simon 22 Okt sore): lingkaran PUTIH, outline = warna lingkaran, ikon = warna outline. Satu tebal outline untuk semua (px). */
export const SISI = 4;
/** bayangan kecil satu aturan (Simon 22 Okt sore: "kurangi dimensi glownya … terlihat sangat lebar, membuat visualnya kotor") — dulu 0 16px 34px -12px warna aa */
export const bayanganKecil = (warna: string, k = 1) => `0 4px 10px -4px ${rgba(warna, 0.35 * k)}`;
export const F = 'Plus Jakarta Sans';

export const W = 1920;
export const H = 1080;
/** safe area ATURAN-PRODUKSI §5: L96 R96 T54 B108 (pita subtitle) + zona logo 360×150 kanan atas */
export const SAFE = { l: 96, r: 1824, t: 54, b: 972, logoX: 1464, logoY: 204 };

/** gaya rumah V08 (latar + kaca) — nilai yang Simon setujui 2026-09-28 */
export const HOUSE = {
  ungu: '#E9E6FC', biru: '#E6F7FC', krim: '#FCF1E6',
  bgOp: 0.5, bgBase: 0.42,
  ringOp: 0.32, ringW: 2,
};

/** jarak label ke garis/benda = SATU nilai (Video 10) */
export const GAP = 14;
/** garis anotasi: tebal 3 · alfa 0,92 · dash "7 11" · ujung bulat (standar 60fps Simon) */
export const LINE = { w: 3, op: 0.92, dash: '7 11' };

export const io = Easing.inOut(Easing.cubic);
const EXT = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const R = (f: number, a: number, b: number, x: number, y: number, e = io) =>
  interpolate(f, [a, b], [x, y], { easing: e, ...EXT });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mixHex = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(lerp(v, y[i], t)).toString(16).padStart(2, '0')).join('')}`;
};
export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
