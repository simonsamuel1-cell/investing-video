import { SCENES } from './cues';
import { BATAS } from './batas';
import { HOUSE } from './theme';

/**
 * RONA LATAR PER SCENE — pola Video 03 (Simon 14 Okt: dua scene bertetangga harus beda warna latar bila memakai masker).
 * Bergilir ungu → biru → krim per scene. SEMENTARA semua batas berganti halus 60f (instan = false) karena transisi antarscene
 * belum dirancang; begitu sebuah batas memakai MASKER, masukkan nomornya ke PAKAI_MASKER → rona berganti seketika di BATAS − 20.
 */
const GILIR = [HOUSE.ungu, HOUSE.biru, HOUSE.krim];
const PAKAI_MASKER = new Set<number>([]); // Video 06 tahap 1: belum ada transisi masker
export const HUES: { at: number; hue: string; bab: string; instan: boolean }[] = SCENES.map((s, i) => ({
  at: i === 0 ? s.a : PAKAI_MASKER.has(s.n) ? (BATAS as Record<string, number>)[`s${s.n}`] - 20 : s.a,
  hue: GILIR[i % GILIR.length], bab: s.bab, instan: i > 0 && PAKAI_MASKER.has(s.n),
}));
