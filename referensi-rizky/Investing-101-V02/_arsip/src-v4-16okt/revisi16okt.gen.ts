/* DIBANGKITKAN oleh scripts/peta-revisi.py — jangan diedit tangan.
 * [scene baru, n0, n1, o0, o1, sinkron]: frame baru n∈[n0,n1) → frame lama o0 + (n−n0)·(o1−o0)/(n1−n0).
 * sinkron = narasi identik dengan VO v4 (geser utuh, laju 1); tidak = visual lama sementara, diregangkan ke durasi baru. */
export const TOTAL_REVISI = 21595;
export const PETA_REVISI: [number, number, number, number, number, boolean][] = [
  [1, 0, 2868, 0, 2868, true], // laju 1.000
  [2, 2868, 4707, 2868, 4707, true], // laju 1.000
  [3, 4707, 7044, 4707, 8328, false], // laju 1.549
  [4, 7044, 9479, 8328, 10763, true], // laju 1.000
  [5, 9479, 11900, 10763, 12531, false], // laju 0.730
  [6, 11900, 14282, 12532, 14914, true], // laju 1.000
  [7, 14282, 16067, 14919, 16814, false], // laju 1.062
  [8, 16067, 18476, 16814, 19998, false], // laju 1.322
  [9, 18476, 20027, 23877, 25577, false], // laju 1.096
  [10, 20027, 21595, 25576, 27144, true], // laju 1.000
];
