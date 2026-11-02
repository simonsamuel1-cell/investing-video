/** BERKAS VO — satu sumber. Nama BARU tiap VO berubah (Studio menyimpan audio lama di cache bila namanya sama).
 *  v4 (7 Okt) = Scene 1 baru (splice-vo.py) + Scene 2–5 baru (splice-vo2.py) + VO lama Scene 6 dst. */
export const VO_UTUH = 'vo/inv02_vo_v7.wav'; // v7 (16 Okt malam) = v6 + rekaman Simon "Ada yang menghasilkan dividen, kupon, atau bunga" (scripts/sisip-dkb-v7.py, +117 f); v6 = v5 tanpa "seberapa sulit investasinya," (potong-kalimat-v6.py, −95 f)
/** potongan per komposisi Ide (scripts/potong-vo.py) — tepat di BATAS, supaya loop Studio tidak membocorkan scene lain */
export const VO_IDE = (scene: string) => `vo/ide-v7/${scene}.wav`; // nomor scene naskah REVISI (src/Ide.tsx)
