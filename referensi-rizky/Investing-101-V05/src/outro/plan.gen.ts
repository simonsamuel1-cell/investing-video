// DIBANGKITKAN scripts/gen-outro.py (outro 'Di video selanjutnya', naskah revisi V05 21 Okt) — jangan edit tangan.
// Frame LOKAL outro (0 = awal blok = OUTRO_AT global); VO outro dipasang di frame lokal OUTRO_VO.at. Ketukan = onset kata MMS_FA.
export const OUTRO_AT = 29112;
export const OUTRO_N = 485;
export const OUTRO_VO = {"at": 28, "frames": 424} as const;
export const OUTRO_KATA: { w: string; a: number; b: number }[] = [{"w": "Di", "a": 46.0, "b": 49.6}, {"w": "video", "a": 52.0, "b": 61.6}, {"w": "selanjutnya,", "a": 64.0, "b": 89.3}, {"w": "kita", "a": 102.5, "b": 115.7}, {"w": "akan", "a": 120.5, "b": 132.5}, {"w": "bahas", "a": 136.2, "b": 161.4}, {"w": "kesalahan-kesalahan", "a": 163.8, "b": 232.3}, {"w": "apa", "a": 238.3, "b": 249.1}, {"w": "saja", "a": 254.0, "b": 270.8}, {"w": "yang", "a": 297.2, "b": 310.4}, {"w": "sering", "a": 312.8, "b": 329.7}, {"w": "bikin", "a": 335.7, "b": 354.9}, {"w": "investor", "a": 359.7, "b": 389.8}, {"w": "salah", "a": 392.2, "b": 404.2}, {"w": "langkah.", "a": 406.6, "b": 424.6}];
/** cue subtitle = baris Simon (1 baris = 1 cue), frame LOKAL; b inklusif seperti CUES */
export const OUTRO_CUES: { a: number; b: number; t: string }[] = [{"a": 44, "b": 295, "t": "Di video selanjutnya, kita akan bahas kesalahan-kesalahan apa saja"}, {"a": 295, "b": 445, "t": "yang sering bikin investor salah langkah."}];
export const OUTRO_BEAT = {"judul": [{"teks": "Kesalahan yang Sering Bikin", "at": 209}, {"teks": "Investor Salah Langkah", "at": 383}], "putar": 164, "k": {"selanjutnya": 64, "kesalahan-kesalahan": 164, "apa": 238, "sering": 313, "bikin": 336, "investor": 360, "salah": 392, "langkah": 407}};
