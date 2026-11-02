/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber (pola Video 02/03/05). DIBANGKITKAN scripts/gen-batas.py — jangan diedit tangan.
 * Aturan Simon (V02 6 Okt): scene lama berakhir SEBELUM suara scene baru masuk; scene baru dimulai SESUDAH suara scene lama habis.
 * VO Video 06 v1 (23 Okt): 01_VO/MiniMax_2026-10-23_15_33_22 (public/vo/inv06_vo.wav); outro terpisah (scripts/gen-outro.py).
 * batas = 3 frame sebelum suara scene berikutnya (awal segmen bersuara kalimat pertamanya, src/cues.ts dari gen-cues.py).
 * Angka ditulis literal supaya scripts/potong-vo.py bisa membacanya.
 */
import { VO_OFFSET as O } from './offset';
import { TOTAL } from './cues';

export const BATAS = {
  s1Akhir: O + 3183, // suara S2 mulai f3186
  s2: O + 3183, // suara S2 mulai f3186
  s3: O + 6127, // suara S3 mulai f6130
  s4: O + 8174, // suara S4 mulai f8177
  s5: O + 11438, // suara S5 mulai f11441
  s6: O + 13001, // suara S6 mulai f13004
  s7: O + 15445, // suara S7 mulai f15448
  s8: O + 18012, // suara S8 mulai f18015
  s9: O + 21610, // suara S9 mulai f21613
  s10: O + 23339, // suara S10 mulai f23342
  s11: O + 26746, // suara S11 mulai f26749
  s12: O + 28151, // suara S12 mulai f28154
  akhir: TOTAL,
} as const;
