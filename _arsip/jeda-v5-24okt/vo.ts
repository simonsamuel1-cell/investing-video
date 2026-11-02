/** BERKAS VO — satu sumber. Nama BARU tiap VO berubah (Studio menyimpan audio lama di cache bila namanya sama).
 *  v2 (22 Okt) = 01_VO/MiniMax_2026-10-22_09_38_26 (naskah revisi), isi dipotong 484,84 dtk + outro terpisah.
 *  v1 (19 Okt) = 01_VO/MiniMax_2026-10-19_14_34_40_Compelling_Storyteller.mp3 → WAV 48 kHz (afconvert), utuh 649,118 dtk. */
export const VO_UTUH = 'vo/inv05_vo_v4_outro28945.wav'; // v4 (24 Okt): + jeda 15 f sesudah tiap kalimat bertitik (scripts/sisip-jeda.py)
// v2: 'vo/inv05_vo_v2_outro29149.wav'
/** potongan per komposisi Ide (scripts/potong-vo.py) — tepat di BATAS, supaya loop Studio tidak membocorkan scene lain */
export const VO_IDE = (scene: string) => `vo/ide-v4/${scene}.wav`;
