/** BERKAS VO — satu sumber. Nama BARU tiap VO berubah (Studio menyimpan audio lama di cache bila namanya sama).
 *  v1 (13 Okt) = 01_VO/MiniMax_2026-10-13_10_08_12_Compelling_Storyteller.mp3 → WAV 48 kHz (afconvert), utuh 466,33 dtk. */
export const VO_UTUH = 'vo/inv03_vo_15okt.wav'; // 15 Okt: S20 direkam ulang (naskah baru "Di Tuntun, kamu bisa memilih instrumen …"), +5,22 dB disamakan; lama: _arsip/vo-13okt/
/** potongan per komposisi Ide (scripts/potong-vo.py) — tepat di BATAS, supaya loop Studio tidak membocorkan scene lain (V02 7 Okt) */
export const VO_IDE = (scene: string) => `vo/ide-v1/${scene}.wav`;
