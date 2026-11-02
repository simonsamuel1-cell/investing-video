/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber (pola Video 02/03).
 * Aturan Simon (V02 6 Okt): scene lama berakhir SEBELUM suara scene baru masuk; scene baru dimulai SESUDAH suara scene lama habis.
 * VO Video 05 v3 (22 Okt sore): VO 09:38 s/d "membelinya." + VO S07 14:50 (public/vo/inv05_vo_v3_isi.wav); outro terpisah src/outro.
 * v2 22 Okt pagi (s7 24723 · s8 27331) di jalur-investor-episode/sync/_v2/; v1 19 Okt di _arsip/v1-19okt.
 * batas = 3 frame sebelum suara scene berikutnya (awal segmen bersuara kalimat pertamanya,
 * src/cues.ts dari gen-cues.py). v4 24 Okt: + jeda 15 f sesudah tiap kalimat bertitik (scripts/sisip-jeda.py). Angka ditulis literal supaya scripts/potong-vo.py bisa membacanya.
 */
import { VO_OFFSET as O } from './offset';
import { TOTAL } from './cues';

export const BATAS = {
  s1Akhir: O + 3953, // suara S2 mulai f3956
  s2: O + 3953, // suara S2 mulai f3956
  s3: O + 9201, // suara S3 mulai f9219
  s4: O + 14329, // suara S4 mulai f14332
  s5: O + 18445, // suara S5 mulai f18463
  s6: O + 21627, // suara S6 mulai f21630
  s7: O + 25376, // suara S7 mulai f25379 (v3 22 Okt sore: kalimat "Cara menilai…" S06 dihapus, S07 = naskah padat baru)
  // S08 (ex S09) = RESERVED ±30 dtk "Mutual Fund Feature" — belum dibuat (NOTE Simon 22 Okt: "Jangan generate sekarang kalau fitur belum siap")
  akhir: TOTAL,
} as const;
