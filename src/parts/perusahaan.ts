import { B } from '../theme';
import type { KunciIkon } from '../ikon';

/**
 * PERUSAHAAN BERAGAM — satu sumber untuk Scene 03 & 04. Simon 24 Okt pagi ("Bedakan warna/icon perusahaan agar bisa lebih menggambarkan
 * 'sekumpulan'") + 24 Okt siang ("icon perusahaan masih banyak yang sama" · "warna juga masih banyak yang tumpang tindih"):
 *  · SATU ikon sektor per perusahaan — tak ada dua perusahaan berikon sama di satu adegan;
 *  · warna TETAP per perusahaan (ikut dibawa lintas adegan);
 *  · di setiap susunan, tetangga kiri-kanan & atas-bawah selalu beda KELUARGA warna (biru · toska · oranye; brand + tint terangnya).
 */
export type Rupa = { ikon: KunciIkon; warna: string };
export const PR = {
  bank: { ikon: 'sektorBank', warna: B.blue },
  keuangan: { ikon: 'keuangan', warna: B.turq },
  telko: { ikon: 'telekomunikasi', warna: B.orange },
  konsumsi: { ikon: 'konsumsi', warna: B.blueLite },
  ritel: { ikon: 'ritel', warna: B.turqLite },
  energi: { ikon: 'energi', warna: B.orange },
  listrik: { ikon: 'listrik', warna: B.blueLite },
  properti: { ikon: 'properti', warna: B.turq },
  kesehatan: { ikon: 'kesehatan', warna: B.orangeLite },
  otomotif: { ikon: 'otomotif', warna: B.blue },
  industri: { ikon: 'industri', warna: B.orangeLite },
  kantor: { ikon: 'perusahaan', warna: B.turqLite },
} satisfies Record<string, Rupa>;

/** kumpulan 4 × 3 (Scene 03 B) — baris: B T O B · O B T O · T O B T */
export const KUMPULAN: Rupa[] = [PR.bank, PR.keuangan, PR.telko, PR.konsumsi, PR.energi, PR.otomotif, PR.ritel, PR.kesehatan, PR.properti, PR.industri, PR.listrik, PR.kantor];
/** isi indeks 2 × 5 (Scene 03 D sesudah pergantian · keranjang Scene 04) — baris: B T O B T · O B T O B. Urutan = sektor cincin F:
 *  Bank (bank, keuangan) · Telko (telko) · Konsumsi (konsumsi, ritel) · Energi (energi, listrik) · Lainnya (properti, kesehatan, otomotif) */
export const ISI_INDEKS: Rupa[] = [PR.bank, PR.keuangan, PR.telko, PR.konsumsi, PR.ritel, PR.energi, PR.listrik, PR.properti, PR.kesehatan, PR.otomotif];
/** urutan MELINGKAR isi indeks (indeks ke ISI_INDEKS) — tetangga beda keluarga warna termasuk ujung-pangkal: T B O T O B T B O B
 *  (cincin H Scene 03 — posisi 3–6 = empat ubin "?" yang dibawa — dan cincin kartu Indeks Scene 05) */
export const CINCIN_INDEKS = [7, 9, 8, 1, 2, 3, 4, 0, 5, 6];
