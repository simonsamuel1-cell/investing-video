/**
 * OFFSET VO (frame 60 fps) — SATU sumber. VO utuh dipasang mulai frame VO_OFFSET; semua waktu dari VO dibangkitkan dengan offset ini.
 * Video 05: 0 (sama dengan Video 03) — ubah di sini bila Simon meminta, lalu jalankan ulang gen-cues.py + gen-words.py.
 */
// 30 Okt malam (Simon: "masukan intro dan outronya"): VO mulai SESUDAH intro Tuntun Academy (4 dtk = 240 f, 000. BG Video/007. Intro App/Video 01 - Apa Itu
// Value Investing?.mp4) — semua waktu (kata, cue, batas, subtitle) bergeser +240 lewat gen-words / gen-cues / gen-batas
export const VO_OFFSET = 240;
