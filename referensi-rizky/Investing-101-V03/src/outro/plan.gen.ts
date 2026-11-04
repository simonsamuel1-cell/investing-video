// DIBANGKITKAN scripts/gen-outro.py (outro 'Di video selanjutnya', Simon 20 Okt) — jangan edit tangan.
// Frame LOKAL outro (0 = awal blok = OUTRO_AT global); VO outro dipasang di frame lokal OUTRO_VO.at. Ketukan = onset kata MMS_FA.
export const OUTRO_AT = 28382;
export const OUTRO_N = 529;
export const OUTRO_VO = {"at": 28, "frames": 468} as const;
export const OUTRO_KATA: { w: string; a: number; b: number }[] = [{"w": "Di", "a": 46.0, "b": 49.6}, {"w": "video", "a": 52.0, "b": 64.0}, {"w": "selanjutnya,", "a": 66.5, "b": 92.9}, {"w": "kita", "a": 120.6, "b": 132.6}, {"w": "akan", "a": 136.2, "b": 147.1}, {"w": "bahas", "a": 150.7, "b": 175.9}, {"w": "cara", "a": 192.8, "b": 213.2}, {"w": "mengenali", "a": 219.2, "b": 244.5}, {"w": "diri", "a": 248.1, "b": 260.1}, {"w": "sendiri", "a": 262.5, "b": 284.2}, {"w": "sebelum", "a": 311.9, "b": 332.3}, {"w": "menentukan", "a": 334.7, "b": 368.4}, {"w": "investasi", "a": 373.2, "b": 411.7}, {"w": "yang", "a": 415.3, "b": 425.0}, {"w": "paling", "a": 427.4, "b": 444.2}, {"w": "cocok.", "a": 446.6, "b": 468.3}];
/** cue subtitle = baris Simon (1 baris = 1 cue), frame LOKAL; b inklusif seperti CUES */
export const OUTRO_CUES: { a: number; b: number; t: string }[] = [{"a": 44, "b": 118, "t": "Di video selanjutnya,"}, {"a": 118, "b": 489, "t": "kita akan bahas cara mengenali diri sendiri sebelum menentukan investasi yang paling cocok."}];
export const OUTRO_BEAT = {"judul": [{"teks": "Cara Mengenali Diri Sendiri", "at": 228}], "putar": 312, "k": {"sebelum": 312, "menentukan": 335, "investasi": 373, "paling": 427, "cocok": 447}};
