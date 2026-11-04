import { SCENES } from './cues';
import { BATAS } from './batas';
import { HOUSE } from './theme';

/**
 * RONA LATAR PER SCENE (Simon 14 Okt: "jika kamu menggunakan transisi masking pastikan kamu membedakan warna background antara scene
 * sebelum dan sesudah transisi"). Dulu per BAB → S07·S08·S09 (dan pasangan lain dalam satu bab) berlatar sama di dalam & luar lingkaran masker.
 * Kini bergilir ungu → biru → krim PER SCENE, jadi dua scene bertetangga selalu berbeda.
 *   - batas bertransisi MASKER: rona berganti SEKETIKA di awal masker (BATAS − 20) — saat itu lingkaran masih menutup seluruh layar, jadi
 *     pergantian tak terlihat; isi lingkaran memakai rona scene lama (MaskerKeluar), luar lingkaran rona scene baru.
 *   - batas tanpa masker (S01→02 geser, S02→03 & S05→06 panel menyatu, S04→05 cakram bersambung): berganti halus 60f di batas scene.
 */
const GILIR = [HOUSE.ungu, HOUSE.biru, HOUSE.krim];
const TANPA_MASKER = new Set([2, 3, 5, 6, 11, 13]); // 11: kartu S10 menyatu jadi tagihan S11 · 13: panel S12 berubah bentuk jadi kartu S13 (14 Okt)
/** scene yang MELANJUTKAN konteks scene sebelumnya (Simon 14 Okt "masih dalam konteks yang sama") → rona latar sama, tidak berganti */
const LANJUT_RONA = new Set([13]);
export const HUES: { at: number; hue: string; bab: string; instan: boolean }[] = SCENES.map((s, i) => ({
  at: i === 0 ? s.a : TANPA_MASKER.has(s.n) ? s.a : (BATAS as Record<string, number>)[`s${s.n}`] - 20,
  hue: GILIR[(LANJUT_RONA.has(s.n) ? i - 1 : i) % GILIR.length], bab: s.bab, instan: i > 0 && !TANPA_MASKER.has(s.n),
}));
