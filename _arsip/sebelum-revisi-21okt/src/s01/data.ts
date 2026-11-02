import { B } from '../theme';
import type { KunciIkon } from '../ikon';

/**
 * DATA SCENE 01 — grafik Simon 16 Okt "Average Annual Return, 2000s to 2025" (periode tiap aset berbeda, sesuai ketersediaan data;
 * sumber: BEI, LBMA, Bank Dunia, BIS, Infovesta, fund fact sheet). Menggantikan rentang indikatif naskah 6 Okt — feedback: periode
 * harus jelas, angka presisi, saham tertinggi. Label Bahasa Indonesia (ATURAN §7); angka apa adanya, desimal koma; Obligasi "~" (Simon).
 * Rentang lama tetap bisa dibaca di _arsip/src-v4-16okt/s01/data.ts.
 *
 * `grup` = tiga watak yang VO sebut di kalimat 2: pertumbuhan lebih besar · lebih stabil ·
 * kenaikan harga terbatas tapi ada penghasilan lain. Pembagiannya keputusanku (dilaporkan ke Simon).
 */
export type Grup = 'tumbuh' | 'stabil' | 'sewa';
/** `ikon` = kunci di src/ikon.ts — tiap instrumen ikonnya sendiri (6 Okt: keranjang + lencana dihapus, terbaca identik). */
export type Baris = { nama: string; ikon: KunciIkon; lo: number; hi: number; grup: Grup; catatan?: string; kira?: boolean };

/** satu nilai per instrumen (lo = hi = rata-rata per tahun) — urutan = grafik Simon (tertinggi di atas) */
export const ROWS: Baris[] = [
  { nama: 'Saham', ikon: 'saham', lo: 15.2, hi: 15.2, grup: 'tumbuh' },
  { nama: 'Reksa Dana Saham', ikon: 'rdSaham', lo: 15.0, hi: 15.0, grup: 'tumbuh' },
  { nama: 'Emas', ikon: 'emas', lo: 14.2, hi: 14.2, grup: 'tumbuh' },
  { nama: 'Reksa Dana Indeks', ikon: 'rdIndeks', lo: 10.1, hi: 10.1, grup: 'tumbuh' },
  { nama: 'Obligasi Pemerintah', ikon: 'obligasi', lo: 8.7, hi: 8.7, grup: 'stabil', kira: true },
  { nama: 'Reksa Dana Pendapatan Tetap', ikon: 'rdPendapatanTetap', lo: 7.0, hi: 7.0, grup: 'stabil' },
  { nama: 'Reksa Dana Pasar Uang', ikon: 'rdPasarUang', lo: 5.6, hi: 5.6, grup: 'stabil' },
  { nama: 'Deposito', ikon: 'deposito', lo: 5.4, hi: 5.4, grup: 'stabil' },
  { nama: 'Properti', ikon: 'properti', lo: 3.5, hi: 3.5, grup: 'sewa', catatan: 'kenaikan nilai saja' },
];

export const WARNA_GRUP: Record<Grup, string> = { tumbuh: B.blue, stabil: B.turq, sewa: B.orange };

const angka = (v: number) => v.toFixed(1).replace('.', ',');
export const nilai = (r: Baris) => (r.lo === r.hi ? `${r.kira ? '~' : ''}${angka(r.hi)}%` : `~${angka(r.lo)}–${angka(r.hi)}%`);

/** lima "lensa" — empat pertanyaan VO sesudah "bukan cuma return"; warna ungu→biru→oranye→ungu→biru (aturan V06) */
export const LENSA: { nama: string; ikon: KunciIkon | null; warna: string }[] = [
  { nama: 'Return', ikon: 'returnInvestasi', warna: B.blue }, // Simon 7 Okt: berikon seperti 4 kartu lain
  { nama: 'Sumber return', ikon: 'sumberReturn', warna: B.turq },
  { nama: 'Naik-turun harga', ikon: 'naikTurunHarga', warna: B.orange },
  { nama: 'Mudah dicairkan', ikon: 'mudahDicairkan', warna: B.blue },
  { nama: 'Modal awal', ikon: 'modalAwal', warna: B.turq },
];

/** bab naskah Simon, urutan video — ikon bab = ikon instrumennya (instrumen yang sama, ikon sama); Tabungan & Deposito = celengan, Reksa Dana umum = keranjang polos */
export const BAB: { no: string; nama: string; ikon: KunciIkon; warna: string }[] = [
  { no: '01', nama: 'Tabungan & Deposito', ikon: 'tabungan', warna: B.blue },
  { no: '02', nama: 'Emas', ikon: 'emas', warna: B.turq },
  { no: '03', nama: 'Properti', ikon: 'properti', warna: B.orange },
  { no: '04', nama: 'Obligasi', ikon: 'obligasi', warna: B.blue },
  { no: '05', nama: 'Reksa Dana', ikon: 'reksaDana', warna: B.turq },
  { no: '06', nama: 'Saham', ikon: 'saham', warna: B.orange },
];
