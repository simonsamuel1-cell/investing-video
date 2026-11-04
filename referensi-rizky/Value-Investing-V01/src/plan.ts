import { SCENES } from './cues';
import { BATAS } from './batas';
import { HOUSE } from './theme';
import { S04_KE02, S04_KE03, S06_GABUNG, S07_BILAH, bilahPenuh } from './parts/waktuTransisi';

/**
 * RONA LATAR PER SCENE — pola Video 03 (Simon 14 Okt: dua scene bertetangga harus beda warna latar bila memakai masker).
 * Bergilir ungu → biru → krim per scene. SEMENTARA semua batas berganti halus 60f (instan = false) karena transisi antarscene
 * belum dirancang; begitu sebuah batas memakai MASKER, masukkan nomornya ke PAKAI_MASKER → rona berganti seketika di BATAS − 20.
 */
const GILIR = [HOUSE.ungu, HOUSE.biru, HOUSE.krim];
const PAKAI_MASKER = new Set<number>([8]); // VI V01 30 Okt: S07 → S08 = MaskerKeluar
/** 2 Nov (Simon S04/S05: "Transisi antar backgroundnya gunakan film dissolve/tint saja"): S04 → S05 tetap MaskerKeluar (isi mengecil ke poros
 *  timbangan) tetapi latar ber-TINT 60 f berpusat di tengah masker (BATAS − 20 + 30), bukan berganti seketika */
const TINT_MASKER = new Set<number>([5]);
/** scene yang rona awalnya diatur transisi di DALAM_SCENE (tidak memakai tanjakan per scene) */
const DIATUR_TRANSISI = new Set<number>([6, 7]);
const PER_SCENE = SCENES.filter((s) => !DIATUR_TRANSISI.has(s.n)).map((s) => ({
  at: s.n === 1 ? s.a : PAKAI_MASKER.has(s.n) ? (BATAS as Record<string, number>)[`s${s.n}`] - 20
    : TINT_MASKER.has(s.n) ? (BATAS as Record<string, number>)[`s${s.n}`] + 10 : s.a,
  hue: GILIR[(s.n - 1) % GILIR.length], bab: s.bab, instan: s.n > 1 && PAKAI_MASKER.has(s.n),
}));
/** rona DI DALAM scene (VI V01 30 Okt): S04 alasan 02 = biru (tiga cakram), alasan 03 = krim (bilah naik) — berganti seketika saat layar tertutup */
const DALAM_SCENE = [
  // 2 Nov (Simon: "Transisi antar backgroundnya gunakan film dissolve/tint saja"): S04 alasan 02 & 03 ber-TINT 60 f bersama morf panel → lingkaran
  { at: S04_KE02, hue: HOUSE.biru, bab: 'S04 alasan 02', instan: false },
  { at: S04_KE03, hue: HOUSE.krim, bab: 'S04 alasan 03', instan: false },
  { at: S06_GABUNG, hue: HOUSE.krim, bab: 'S06 (lingkaran S05 menyatu jadi kamu, tint)', instan: false },
  { at: bilahPenuh(S07_BILAH), hue: HOUSE.ungu, bab: 'S07 (bilah naik dari tangga S06)', instan: true },
];
export const HUES: { at: number; hue: string; bab: string; instan: boolean }[] = [...PER_SCENE, ...DALAM_SCENE].sort((a, b) => a.at - b.at);
