/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber (pola Video 02).
 * Aturan Simon (V02 6 Okt, Scene 1→2): scene lama berakhir SEBELUM suara scene baru masuk dan tidak keluar/pudar di
 * ujungnya; scene baru dimulai SESUDAH suara scene lama habis (animasi keluar scene lama = milik scene baru).
 * Diukur dari amplop energi VO (sync/vo-words.json `energi.voiced`): batas = 3 frame sebelum suara scene berikutnya.
 * Batas scene berikutnya ditambahkan saat scene itu dibangun.
 */
import { VO_OFFSET as O } from './offset';
import { TOTAL } from './cues';

export const BATAS = {
  s1Akhir: O + 1121, // suara S1 ("pakai?”") habis f1102 · "Karena" (S2) bersuara mulai f1124
  s2: O + 1121,
  s3: O + 2386, // suara S2 ("kebutuhan.") habis f2371 · "Cara" (S3) bersuara mulai f2389
  s4: O + 3356, // suara S3 ("berbeda.") habis f3339 · "Yang" (S4) bersuara mulai f3359
  s5: O + 4523, // suara S4 ("tersedia.") habis f4507 · "Karena" (S5) bersuara mulai f4526
  s6: O + 5881, // suara S5 ("stabilitas.") habis f5869 · "Dana" (S6) bersuara mulai f5884
  s7: O + 7528, // suara S6 ("berikutnya.") habis f7513 · "Yang" (S7) bersuara mulai f7531
  s8: O + 8828, // suara S7 ("lagi.") habis f8811 · "Untuk" (S8) bersuara mulai f8831
  s9: O + 10189, // suara S8 ("turun.") habis f10172 · "Karena itu" (S9) bersuara mulai f10192
  s10: O + 11663, // suara S9 ("dipakai.") habis f11645 · "Coba" (S10) bersuara mulai f11666
  s11: O + 12803, // suara S10 ("apa.") habis f12783 · "Kalau tepat" (S11) bersuara mulai f12806
  s12: O + 14315, // suara S11 ("panjang.") habis f14303 · "Yang terakhir" (S12) bersuara mulai f14318
  s13: O + 15673, // suara S12 ("pasar.") habis f15657 · "Untuk uang jangka panjang" (S13) bersuara mulai f15676
  s14: O + 17407, // suara S13 ("berkembang.") habis f17389 · "Tapi tetap ingat" (S14) bersuara mulai f17410
  s15: O + 18532, // suara S14 ("naik.") habis f18517 · "Makanya" (S15) bersuara mulai f18535
  s16: O + 20097, // suara S15 ("berbeda.") habis f20081 · "Lalu" (S16) bersuara mulai f20100
  s17: O + 21400, // suara S16 ("masing-masing.") habis f21383 · "Tapi ada" (S17) bersuara mulai f21403
  s18: O + 22832, // suara S17 ("panjang.") habis f22810 · "Jadi nanti" (S18) bersuara mulai f22835
  s19: O + 24062, // suara S18 ("tersebut.") habis f24041 · "Kalau mau" (S19) bersuara mulai f24065
  s20: O + 25838, // suara S19 ("masing-masing.") habis f25825 · "Jadi ingat" (S20) bersuara mulai f25841
  akhir: TOTAL,
} as const;
