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
  s1Akhir: O + 4681, // suara S2 mulai f4684
  s2: O + 4681, // suara S2 mulai f4684
  s3: O + 8596, // suara S3 mulai f8599
  s4: O + 12236, // suara S4 mulai f12239
  s5: O + 16738, // suara S5 mulai f16741
  s6: O + 22018, // suara S6 mulai f22021
  s7: O + 26463, // suara S7 mulai f26466
  s8: O + 31068, // suara S8 mulai f31071
  akhir: TOTAL,
} as const;
