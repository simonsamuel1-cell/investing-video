/**
 * OFFSET VO (frame 60 fps) — SATU sumber. Simon 7 Okt: "mulai voice dari scene 1 pada 00:00.31, tapi animasinya tetap mulai
 * dari 00:00.00, agar animasi … diawal adegan ini tidak terlalu cepat, dan semua instrumennya memiliki ruang waktu untuk muncul".
 * VO utuh dipasang mulai frame VO_OFFSET. Semua waktu yang berasal dari VO ikut bergeser sejauh ini:
 * src/words.gen.ts & src/cues.ts (dibangkitkan dgn offset: gen-words.py, gen-cues.py — juga SRT/JSON 04_Asset), BATAS
 * (src/batas.ts), timecode arahan Simon di Scene 01 (MULAI), dan pemotong VO per komposisi (scripts/potong-vo.py).
 * Animasi yang ditulis relatif ke awal Scene 01 (pusat radial, butir instrumen) TIDAK bergeser.
 */
export const VO_OFFSET = 31;
