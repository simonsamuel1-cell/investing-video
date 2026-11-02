/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber (pola Video 02/03).
 * Aturan Simon (V02 6 Okt): scene lama berakhir SEBELUM suara scene baru masuk; scene baru dimulai SESUDAH suara scene lama habis.
 * VO Video 05 v2 (22 Okt, naskah revisi 21 Okt — MiniMax 2026-10-22 09:38, isi s/d 484,84 dtk; outro terpisah src/outro). v1 19 Okt di _arsip/v1-19okt.
 * batas = 3 frame sebelum suara scene berikutnya (awal segmen bersuara kalimat pertamanya,
 * src/cues.ts dari gen-cues.py). Angka ditulis literal supaya scripts/potong-vo.py bisa membacanya.
 */
import { VO_OFFSET as O } from './offset';
import { TOTAL } from './cues';

export const BATAS = {
  s1Akhir: O + 3773, // suara S2 mulai f3776
  s2: O + 3773, // suara S2 mulai f3776
  s3: O + 8796, // suara S3 mulai f8799
  s4: O + 13699, // suara S4 mulai f13702
  s5: O + 17710, // suara S5 mulai f17713
  s6: O + 20772, // suara S6 mulai f20775
  s7: O + 24723, // suara S7 mulai f24726
  s8: O + 27331, // suara S8 mulai f27334
  akhir: TOTAL,
} as const;
