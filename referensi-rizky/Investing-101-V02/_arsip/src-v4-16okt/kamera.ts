import { getInputProps, getRemotionEnvironment } from 'remotion';
import { io } from './theme';
import { KAMERA } from './kamera.gen';
import { ZOOM } from './zoom.gen';

/**
 * KAMERA PUSAT (Simon 7 Okt: "semua visual tidak pada center point frame … ada yang terlalu keatas, kebawah, kiri, kanan").
 * Tiap scene: isi (tanpa judul TEXT, watermark, subtitle) digeser supaya pusat kotak tintanya = (960, 540) DI SETIAP MOMEN.
 * Jalur dibangkitkan dari ukuran nyata (scripts/ukur-pusat.mjs → scripts/kamera.py → src/kamera.gen.ts): tiap kunci
 * [mulai, selesai, dx, dy] = geser ke (dx,dy) selama [mulai, selesai] dengan inOut cubic, dari nilai kunci sebelumnya.
 * Kunci pertama scene = nilai akhir scene sebelumnya (kesinambungan benda yang diambil alih antar-scene).
 */
const prop = getInputProps() as { tanpaKamera?: boolean };
/** kamera scene: geser (x, y) dalam RUANG DUNIA + zoom z berporos di tengah layar (src/zoom.gen.ts — Simon 8 Okt "perbesar lagi visualnya") */
export type Kam = { x: number; y: number; z: number };
const nilaiKunci = <T extends number[]>(keys: T[], f: number, ambil: (k: T) => number[]) => {
  let v = ambil(keys[0]);
  for (let i = 1; i < keys.length; i += 1) {
    const [a, b] = keys[i];
    if (f <= a) break;
    const t = b <= a ? 1 : io(Math.max(0, Math.min(1, (f - a) / (b - a))));
    const w = ambil(keys[i]);
    v = v.map((x, j) => x + (w[j] - x) * t);
    if (f < b) break;
  }
  return v;
};
const EPS_ZOOM = 0.000137;
export const kamera = (sc: string, f: number): Kam => {
  if (prop.tanpaKamera) return { x: 0, y: 0, z: 1 };
  const keys = KAMERA[sc], zk = ZOOM[sc];
  const [x, y] = keys && keys.length ? nilaiKunci(keys, f, (k) => [k[2], k[3]]) : [0, 0];
  const [z] = zk && zk.length ? nilaiKunci(zk, f, (k) => [k[2]]) : [1];
  // zoom TEPAT 1 dilukis Chrome lewat jalur tajam (tanpa resampling), 1,0000x lewat jalur resampling → frame terakhir zoom-keluar ke 1,0
  // berganti rupa sekaligus (lonjakan satu-frame terukur S07 f1570: 0,39 → 0,04). Scene ber-zoom tak pernah tepat 1 (selisih 0,000137,
  // tak terlihat); scene tanpa zoom (semua kunci 1) tidak tersentuh.
  return { x, y, z: zk && zk.some((k) => k[2] !== 1) ? z + EPS_ZOOM : z };
};
/** gaya wadah ISI scene: zoom berporos di tengah layar, geser di ruang dunia (translate3d + rotasi mikro: tanpa judder 1 px).
 *  Simon 9 Okt "masih banyak jeglek, animasi patah patah": zoom lewat `transform: scale` membuat Chrome meraster ULANG seluruh isi tiap kali
 *  satu anak beranimasi (terukur: kartu S12 berubah 0,70/255 rata-rata saat kartu lain pop pada zoom 1,24; 0,005 pada zoom 1,0) → kini
 *  CSS `zoom` (penskalaan tata letak: tajam, tanpa cache raster). Posisi IDENTIK: layar = z·(p + t), t = 960/z − 960 + x (begitu pula y)
 *  = 960 + z·(p + x − 960) seperti sebelumnya. */
export const geserIsi = (k: Kam) => ({ x: 960 / k.z - 960 + k.x, y: 540 / k.z - 540 + k.y });
/** STUDIO: zoom lewat transform-scale (hanya komposit, murah). CSS `zoom` memaksa TATA LETAK ULANG seluruh isi tiap frame zoom berubah →
 *  Studio menjatuhkan frame 100–270 ms di tiap transisi zoom (terukur scripts/studio_fps.mjs: S02 f2904–2964, S03 f5610, S07 f14047) —
 *  itulah "jeglek / patah-patah" yang Simon lihat saat memutar di Studio. RENDER tetap CSS zoom (tajam, tanpa raster ulang). Posisi identik:
 *  layar = a + z·p, a = 960 − 960z + z·x (begitu pula y) = 960 + z(p + x − 960). */
export const STUDIO = getRemotionEnvironment().isStudio;
const geserStudio = (k: Kam) => ({ x: 960 - 960 * k.z + k.z * k.x, y: 540 - 540 * k.z + k.z * (k.y + 0.03) });
export const gayaIsi = (k: Kam, menyusut = false): React.CSSProperties => {
  if (STUDIO) {
    const a = geserStudio(k);
    // `menyusut` (30f sebelum + selama isi scene mengecil ke masker keluar): skala raster dikunci → Chrome tidak meraster ulang seluruh isi
    // tiap frame (Studio tersendat 147 ms saat keluar S02, terukur); dinyalakan 30f lebih awal saat layar masih diam (menyalakan tepat saat
    // keluar memicu satu raster ulang yang terlihat: S05 → 238 ms)
    return { transform: `translate3d(${a.x}px, ${a.y}px, 0) scale(${k.z}) rotate(0.001deg)`, transformOrigin: '0 0', width: 1920, height: 1080, right: 'auto', bottom: 'auto', ...(menyusut ? { willChange: 'transform' } : {}) };
  }
  const t = geserIsi(k);
  // ukuran MUTLAK 1920 × 1080 px dunia: tanpa ini `inset: 0` wadah ber-zoom = ukuran LAYAR (1920/z px dunia), sehingga semua yang
  // diposisikan dari tepi kanan/bawah (`right: 1920 − x`, `bottom: 1080 − y`), rata tengah (left 0 · right 0) atau selayar (inset 0)
  // bergeser/menyusut saat z ≠ 1 (terukur: label "Hari ini"/"Jatuh tempo" S06 V2 terlempar ke tepi atas menabrak logo; latar sisipan S05 V4
  // hanya 1/z layar). Dengan ukuran mutlak, tata letak di dalam wadah identik dengan masa sebelum CSS zoom (transform scale).
  return { zoom: k.z, transform: `translate3d(${t.x}px, ${t.y + 0.03}px, 0) rotate(0.001deg)`, width: 1920, height: 1080, right: 'auto', bottom: 'auto' };
};
/** kebalikan wadah isi (untuk latar sisipan yang harus tetap memenuhi layar): T₋t · skala 1/z, transform-origin 0 0 */
export const kebalikanIsi = (k: { x: number; y: number; z?: number }) => {
  const z = k.z ?? 1;
  if (STUDIO) { const a = geserStudio({ x: k.x, y: k.y, z }); return `scale(${1 / z}) translate3d(${-a.x}px, ${-a.y}px, 0)`; }
  const t = geserIsi({ x: k.x, y: k.y, z });
  return `translate3d(${-t.x}px, ${-t.y - 0.03}px, 0)${z === 1 ? '' : ` scale(${1 / z})`}`;
};
/** gaya untuk wadah isi scene (nama lama) */
export const gayaKamera = (sc: string, f: number, menyusut = false): React.CSSProperties => gayaIsi(kamera(sc, f), menyusut);
/** titik DUNIA → LAYAR di bawah kamera k (untuk transisi antar-scene: masker mendarat tepat di benda scene lain) */
export const keLayar = (k: Kam, p: { x: number; y: number }) => ({ x: 960 + k.z * (p.x + k.x - 960), y: 540 + k.z * (p.y + k.y - 540) });
