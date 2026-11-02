/**
 * GRAFIK GARIS sederhana untuk Scene 04–08 (salinan helper Scene 02 `garis`/`titikAkhir`, dipisah supaya scene baru tidak menyentuh Scene 02).
 * Nilai digambar di kotak (x0, y0, w, h) dengan domain [lo, hi]; `g` = kemajuan gambar 0…1 (segmen terakhir dipotong).
 */
export const yDari = (v: number, y0: number, h: number, lo: number, hi: number) => y0 + h - ((v - lo) / (hi - lo)) * h;

export const garis = (v: number[], x0: number, y0: number, w: number, h: number, lo: number, hi: number, g: number) => {
  const n = v.length - 1, ujung = Math.max(0, Math.min(1, g)) * n, pts: string[] = [];
  for (let i = 0; i <= Math.floor(ujung); i++) pts.push(`${x0 + (w * i) / n},${yDari(v[i], y0, h, lo, hi)}`);
  const i = Math.floor(ujung);
  if (i < n && ujung > i) {
    const t = ujung - i, val = v[i] + (v[i + 1] - v[i]) * t;
    pts.push(`${x0 + (w * ujung) / n},${yDari(val, y0, h, lo, hi)}`);
  }
  return pts.join(' ');
};

/** titik ujung garis yang sedang digambar */
export const ujungGaris = (v: number[], x0: number, y0: number, w: number, h: number, lo: number, hi: number, g: number): [number, number] => {
  const n = v.length - 1, ujung = Math.max(0, Math.min(1, g)) * n, i = Math.min(n - 1, Math.floor(ujung)), t = Math.min(1, ujung - i);
  const val = v[i] + (v[i + 1] - v[i]) * t;
  return [x0 + (w * ujung) / n, yDari(val, y0, h, lo, hi)];
};

/** nilai kumulatif dari imbal hasil tahunan (%) mulai 100 */
export const kumulatif = (ret: number[]) => ret.reduce<number[]>((a, r) => [...a, a[a.length - 1] * (1 + r / 100)], [100]);
