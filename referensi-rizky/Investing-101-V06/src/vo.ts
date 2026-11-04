/** BERKAS VO — satu sumber. Nama BARU tiap VO berubah (Studio menyimpan audio lama di cache bila namanya sama).
 *  v1 (23 Okt) = 01_VO/MiniMax_2026-10-23_15_33_22_Compelling_Storyteller.mp3 (isi) → WAV 48 kHz (afconvert)
 *  + outro 01_VO/MiniMax_2026-10-23_15_39_24 (scripts/gen-outro.py) = SATU berkas dari frame 0; angka di nama = frame mulai VO outro. */
export const VO_UTUH = 'vo/inv06_vo_outro31282.wav';
/** potongan per komposisi Ide (scripts/potong-vo.py) — tepat di BATAS, supaya loop Studio tidak membocorkan scene lain */
export const VO_IDE = (scene: string) => `vo/ide-v1/${scene}.wav`;
