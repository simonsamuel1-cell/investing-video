/**
 * OFFSET VO (frame 60 fps) — SATU sumber. VO utuh dipasang mulai frame VO_OFFSET; semua waktu dari VO
 * (src/cues.ts & src/words.gen.ts, SRT/JSON 04_Asset) dibangkitkan dengan offset ini (gen-cues.py, gen-words.py).
 * Video 03: 0 — VO mulai di frame 0. (Video 02 memakai 31 atas arahan Simon 7 Okt; ubah di sini bila diminta, lalu
 * jalankan ulang gen-cues.py + gen-words.py.)
 */
export const VO_OFFSET = 0;
