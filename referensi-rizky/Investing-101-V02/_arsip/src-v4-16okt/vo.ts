/** BERKAS VO — satu sumber. Nama BARU tiap VO berubah (Studio menyimpan audio lama di cache bila namanya sama).
 *  v4 (7 Okt) = Scene 1 baru (splice-vo.py) + Scene 2–5 baru (splice-vo2.py) + VO lama Scene 6 dst. */
export const VO_UTUH = 'vo/inv02_vo_v4.wav';
/** potongan per komposisi Ide (scripts/potong-vo.py) — tepat di BATAS, supaya loop Studio tidak membocorkan scene lain */
export const VO_IDE = (scene: string) => `vo/ide-v4/${scene}.wav`;
/** v5 (16 Okt) = naskah REVISI 10 scene: S01–S02, S04, S06, S10 dari v4 (narasi identik) + S03, S05, S07–S09 dari
 *  01_VO/VO baru.mp3 (scripts/splice-vo3.py, sync/splice3.json) — dipakai komposisi Revisi-16Okt */
export const VO_REVISI = 'vo/inv02_vo_v5.wav';
