/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber (pola Video 02/03/05). DIBANGKITKAN scripts/gen-batas.py — jangan diedit tangan.
 * Aturan Simon (V02 6 Okt): scene lama berakhir SEBELUM suara scene baru masuk; scene baru dimulai SESUDAH suara scene lama habis.
 * VO Value Investing V01 v1 (29 Okt): 01_VO/MiniMax_2026-10-29_16_30_58 (public/vo/vi01_vo.wav); tanpa outro terpisah.
 * batas = 3 frame sebelum suara scene berikutnya (awal segmen bersuara kalimat pertamanya, src/cues.ts dari gen-cues.py).
 * Angka ditulis literal supaya scripts/potong-vo.py bisa membacanya.
 */
import { VO_OFFSET as O } from './offset';
import { TOTAL } from './cues';

export const BATAS = {
  s1Akhir: O + 5086, // suara S2 mulai f5089
  s2: O + 5086, // suara S2 mulai f5089
  s3: O + 9316, // suara S3 mulai f9319
  s4: O + 13301, // suara S4 mulai f13304
  s5: O + 18318, // suara S5 mulai f18321
  s6: O + 24113, // suara S6 mulai f24116
  s7: O + 29073, // suara S7 mulai f29076
  s8: O + 34193, // suara S8 mulai f34196
  akhir: TOTAL,
} as const;
