/** BERKAS VO — satu sumber. Nama BARU tiap VO berubah (Studio menyimpan audio lama di cache bila namanya sama).
 *  v4 (7 Okt) = Scene 1 baru (splice-vo.py) + Scene 2–5 baru (splice-vo2.py) + VO lama Scene 6 dst. */
export const VO_UTUH = 'vo/inv02_vo_v5.wav'; // v5 (16 Okt) = naskah REVISI 10 scene (scripts/splice-vo3.py); v4 lama: vo/inv02_vo_v4.wav
/** potongan per komposisi Ide (scripts/potong-vo.py) — tepat di BATAS, supaya loop Studio tidak membocorkan scene lain */
export const VO_IDE = (scene: string) => `vo/ide-v5/${scene}.wav`; // nomor scene naskah REVISI (src/Ide.tsx)
