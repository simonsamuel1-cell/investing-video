/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber.
 * Aturan Simon (6 Okt, Scene 1→2): scene lama berakhir SEBELUM suara scene baru masuk dan tidak keluar/pudar di
 * ujungnya; scene baru dimulai SESUDAH suara scene lama habis (animasi keluar scene lama = milik scene baru).
 * Diukur dari amplop energi VO v4 (public/vo/inv02_vo_v4.wav = Scene 1–5 rekaman baru, 7 Okt): batas = 3 frame sebelum
 * suara scene berikutnya, di dalam jeda hening.
 */
import { VO_OFFSET as O } from './offset';

/** angka di bawah = frame VO (VO mulai 0); `O +` = geser ke frame VIDEO (VO mulai 00:00.31, Simon 7 Okt — src/offset.ts) */
export const BATAS = {
  s1Akhir: O + 47 * 60, // 00:47.00 — arahan Simon
  s2: O + 2829, // arahan Simon ("mulai scene 2 di 00:00.49") — suara S1 habis f2818 · "Kita" f2840
  s3: O + 4676, // suara S2 ("dipahami.") habis f4660 · "Sekarang" f4679
  s4: O + 6522, // suara S3 ("rugi.") habis f6506 · "Lalu" f6525
  s5: O + 8297, // suara S4 ("harga.") habis f8282 · "Selanjutnya" f8300
  s6: O + 10732, // suara S5 ("rendah.") habis f10715 · "Berikutnya" f10735
  s7: O + 12500, // suara S6 ("pasar.") habis f12484 · "Sekarang" f12503
  s8: O + 14888, // suara S7 ("asset-nya.") habis f14866 · "Terakhir" f14891
  s9: O + 16783, // suara S8 ("panjang.") habis f16770 · "Inilah" f16786
  s10: O + 19967, // suara S9 ("baru.") habis f19955 · "Tentu" f19970
  s11: O + 22159, // suara S10 ("tepat.") habis f22146 · "Makanya" f22162
  s12: O + 23794, // suara S11 ("berlaku?") habis f23774 · "Kalau" f23797
  s13: O + 25546, // suara S12 ("digunakan.") habis f25531 · "Setelah" f25549
  akhir: O + 27113, // = TOTAL (suara S13 "berbeda." habis f27103)
} as const;
