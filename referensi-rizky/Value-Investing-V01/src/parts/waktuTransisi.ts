import { R, io } from '../theme';
import { kata } from '../beats';
import { BATAS } from '../batas';

/**
 * WAKTU TRANSISI BENTUK — modul murni (tanpa komponen) supaya plan.ts (rona latar) bisa membacanya tanpa impor melingkar
 * (parts/transisiBentuk.tsx → Backdrop → plan.ts).
 */
export const CAKRAM_R = 2100, SELANG = 3;
/** jari-jari cakram k (0, 1, 2) — cakram mulai tumbuh di `mulai + k·3`, 60 f inOut cubic */
export const rCakram = (f: number, mulai: number, k: number) => CAKRAM_R * R(f, mulai + k * SELANG, mulai + k * SELANG + 60, 0, 1, io);
/** frame cakram ketiga selesai (sesudah ini isi baru tampil tanpa masker) */
export const cakramPenuh = (mulai: number) => mulai + 2 * SELANG + 60;
/** frame layar tertutup penuh oleh cakram ketiga — rona global berganti di sini */
export const cakramTutup = (mulai: number, x = 960, y = 540) => {
  const jauh = Math.hypot(Math.max(x, 1920 - x), Math.max(y, 1080 - y));
  for (let f = mulai; f < cakramPenuh(mulai); f++) if (rCakram(f, mulai, 2) >= jauh + 2) return f;
  return cakramPenuh(mulai);
};
/** bilah naik: lapisan baru (latar + isi) menutup layar penuh di mulai + 90 */
export const bilahPenuh = (mulai: number) => mulai + 30 + 60;

/* ═════ jadwal transisi VI V01 (satu sumber untuk scene & plan.ts) ═════ */
/** S04 alasan 01 → 02 · 02 → 03 (2 Nov, Simon: "Transisi dari point 1 ke point 2 jangan gunakan shape, kamu bisa morphing panel itu ke lingkaran" ·
 *  sama untuk point 2 → 3 · "Transisi antar backgroundnya gunakan film dissolve/tint saja"): panel MORF jadi lingkaran nomor berikutnya, 60 f berpusat
 *  di sini; rona latar ber-TINT 60 f di pusat yang sama (plan.ts). Dulu tiga cakram (kedua − 32) & bilah naik (ketiga − 30). */
export const S04_KE02 = kata('kedua', BATAS.s4) - 6;
export const S04_KE03 = kata('ketiga', BATAS.s4);
/** S05 → S06 (2 Nov, Simon: "Transisi ke scene 6 kau bisa morphing icon dan lingkaranya … Icon pop out, lingkaran bergabung, dan orang di scene 6 swipe
 *  keatas, dan itu dilakukan bersamaan" + "Transisi antar backgroundnya gunakan film dissolve/tint saja"): lingkaran Kesabaran & Cek alasan MENYATU jadi
 *  lingkaran kamu S06 (S06_KAMU), ikon pop keluar, foto naik — satu gerak 60 f berpusat di sini; latar ber-tint (plan.ts). Dulu tiga cakram dari jam pasir. */
export const S06_GABUNG = BATAS.s6 + 10;
export const S06_KAMU = { x: 960, y: 560, D: 300 };
/** S06 → S07: bilah naik (turkis · turkis muda, lalu latar ungu + guru naik) — layar tertutup sebelum "Ini bagian yang sering dilupakan" */
export const S07_BILAH = BATAS.s7 - 40;
/** S07 → S08: MASKER KELUAR — isi S07 mengecil ke lingkaran RISET S08 (rona berganti seketika di BATAS.s8 − 20, plan.ts PAKAI_MASKER) */
/** G5 (Simon 30 Okt: "Jika belum ada visual lain yang muncul pastikan kamu membangunnya tepat di tengah frame"): mendarat di TENGAH — lingkaran + label
 *  "Riset" berpusat ±497 (di atas subtitle); dulu y 280 = posisi pohon → lingkaran sendirian di atas ±3,7 dtk. S08 menaikkannya sebelum cabang pertama. */
export const RISET_S08 = { x: 960, y: 470, r: 90 };
