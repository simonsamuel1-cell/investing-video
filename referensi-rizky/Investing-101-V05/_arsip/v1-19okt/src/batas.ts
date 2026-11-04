/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber (pola Video 02/03).
 * Aturan Simon (V02 6 Okt): scene lama berakhir SEBELUM suara scene baru masuk; scene baru dimulai SESUDAH suara scene lama habis.
 * VO Video 05 (MiniMax 19 Okt 14:34; 19 Okt sore: daftar indeks S03 diganti sambungan take 15:53 + 15:51, −7,765 dtk → S04…S08 −465/−466 f):
 * batas = 3 frame sebelum suara scene berikutnya (awal segmen bersuara kalimat pertamanya,
 * src/cues.ts dari gen-cues.py). Angka ditulis literal supaya scripts/potong-vo.py bisa membacanya.
 */
import { VO_OFFSET as O } from './offset';
import { TOTAL } from './cues';

export const BATAS = {
  s1Akhir: O + 4505, // suara S2 mulai f4508
  s2: O + 4505, // suara S2 mulai f4508
  s3: O + 10057, // suara S3 mulai f10060
  s4: O + 16348, // suara S4 mulai f16351
  s5: O + 21423, // suara S5 mulai f21426
  s6: O + 25715, // suara S6 mulai f25718
  s7: O + 30583, // suara S7 mulai f30586
  s8: O + 35336, // suara S8 mulai f35339
  akhir: TOTAL,
} as const;
