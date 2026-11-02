import { WORDS } from './words.gen';

/**
 * ONSET KATA VO → frame (60 fps), dari forced alignment MMS (scripts/gen-words.py).
 * `kata('jauh')` = onset kemunculan PERTAMA kata itu; `kata('ada', 700)` = yang pertama sesudah frame 700.
 * Melempar galat bila tidak ketemu — salah ketik tidak boleh diam-diam jadi frame 0.
 */
export const kata = (w: string, sesudah = 0): number => {
  const hit = WORDS.find(([t, a]) => t === w && a >= sesudah);
  if (!hit) throw new Error(`kata "${w}" sesudah f${sesudah} tidak ada di VO`);
  return hit[1];
};

/**
 * KATA BERURUTAN — tiap kata = kemunculan pertama SESUDAH kata sebelumnya dalam daftar.
 * Tidak ada ambang frame tetap, jadi tetap benar kalau VO direkam ulang lebih cepat/lambat
 * (6 Okt: Scene 1 baru 12 dtk lebih pendek; ambang lama `kata('harganya', 900)` akan menangkap kata yang salah).
 */
export const urut = (words: string[], dari = 0): number[] => {
  let t = dari;
  return words.map((w, i) => (t = kata(w, i === 0 ? dari : t + 1)));
};

/**
 * WAKTU MUNCUL ELEMEN (Simon 7 Okt, pola arahan waktunya di Scene 01: panel lensa MULAI ±12–24f sebelum kalimat
 * pertanyaannya). `frasa(kata)` = onset FRASA (klausa naskah, dipisah , . ? ! : ;) yang memuat kemunculan pertama `kata`
 * sesudah `sesudah`. `muncul(kata)` = PUSAT tanjakan 60f yang MULAI 18f sebelum frasa itu (= frasa + 12).
 */
export const MULAI_SEBELUM = 18;
export const frasa = (w: string, sesudah = 0): number => {
  const hit = WORDS.find(([t, a]) => t === w && a >= sesudah);
  if (!hit) throw new Error(`kata "${w}" sesudah f${sesudah} tidak ada di VO`);
  return hit[2];
};
export const muncul = (w: string, sesudah = 0, d = 60): number => frasa(w, sesudah) - MULAI_SEBELUM + d / 2;
