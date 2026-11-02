/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber.
 * Aturan Simon (6 Okt, Scene 1→2): scene lama berakhir SEBELUM suara scene baru masuk dan tidak keluar/pudar di
 * ujungnya; scene baru dimulai SESUDAH suara scene lama habis (animasi keluar scene lama = milik scene baru).
 *
 * VO v5 (16 Okt) = NASKAH REVISI 10 scene (public/vo/inv02_vo_v5.wav, scripts/splice-vo3.py). KUNCI tetap = nomor scene LAMA
 * (nama berkas src/sNN), nomor naskah revisi di komentar:
 *   s3 Emas (S03 — gabungan lama 03+04) · s5 Properti (S04) · s6 Obligasi (S05) · s7 Reksa Dana (S06) · s8 Saham (S07)
 *   · s9 Bisnis vs harga saham (S08) · s12 Rangkuman (S09) · s13 Penutup (S10).
 * Scene lama 04, 10, 11 dihapus naskah revisi (komponennya tidak dipasang; v4 lengkap di _arsip/src-v4-16okt).
 * Scene yang narasinya IDENTIK dengan v4 (S01–S02, Properti, Reksa Dana, Penutup) = batas v4 digeser sejauh median selisih onset
 * katanya (−0 / −1284 / −632 / −5549 f) → isinya identik dengan v4 per frame. Scene baru = 3 frame sebelum suaranya.
 */
import { VO_OFFSET as O } from './offset';

/** angka di bawah = frame VO (VO mulai 0); `O +` = geser ke frame VIDEO (VO mulai 00:00.31, Simon 7 Okt — src/offset.ts) */
export const BATAS = {
  s1Akhir: O + 47 * 60, // 00:47.00 — arahan Simon
  s2: O + 2829, // arahan Simon ("mulai scene 2 di 00:00.49") — suara S1 habis f2818 · "Kita" f2840
  s3: O + 4676, // S03 Emas — suara S2 ("dipahami.") habis f4660 · "Sekarang" f4679
  s5: O + 7013, // S04 Properti — v4 8297 − 1284
  s6: O + 9448, // S05 Obligasi — "Berikutnya" f9451
  s7: O + 11868, // S06 Reksa Dana — v4 12500 − 632
  s8: O + 14251, // S07 Saham — "Terakhir" f14254
  s9: O + 16036, // S08 Bisnis vs harga saham — "Kalau" f16039
  s12: O + 18445, // S09 Rangkuman — "Kalau" f18448
  s13: O + 19902, // S10 Penutup — v4 25546 − 5549 − 95 (VO v6: kalimat "seberapa sulit investasinya," dipotong, Simon 16 Okt)
  akhir: O + 21469, // = TOTAL (cues.ts) — v6: −95
} as const;
