import { B } from '../theme';
import type { KunciIkon } from '../ikon';

/**
 * DATA SCENE 01 — kolom VISUAL naskah Simon, apa adanya:
 *   HISTORICAL INVESTMENT PERFORMANCE · Indicative Long-Term Annualized Return
 *   Gold ~10–15% · Stocks ~7–10% · Equity MF ~6–10% · Index MF ~5–9% · Bonds ~5–7% ·
 *   Fixed Income MF ~5–7% · Money Market MF ~4.5–6.5% · Time Deposit ~3.5–5.5% ·
 *   Property ~1–3% (capital appreciation only)
 * Label diterjemahkan ke Bahasa Indonesia (ATURAN §7); angka tidak diubah, desimal pakai koma.
 *
 * `grup` = tiga watak yang VO sebut di kalimat 2: pertumbuhan lebih besar · lebih stabil ·
 * kenaikan harga terbatas tapi ada penghasilan lain. Pembagiannya keputusanku (dilaporkan ke Simon).
 */
export type Grup = 'tumbuh' | 'stabil' | 'sewa';
/** `ikon` = kunci di src/ikon.ts — tiap instrumen ikonnya sendiri (6 Okt: keranjang + lencana dihapus, terbaca identik). */
export type Baris = { nama: string; ikon: KunciIkon; lo: number; hi: number; grup: Grup; catatan?: string };

export const ROWS: Baris[] = [
  { nama: 'Emas', ikon: 'emas', lo: 10, hi: 15, grup: 'tumbuh' },
  { nama: 'Saham', ikon: 'saham', lo: 7, hi: 10, grup: 'tumbuh' },
  { nama: 'Reksa Dana Saham', ikon: 'rdSaham', lo: 6, hi: 10, grup: 'tumbuh' },
  { nama: 'Reksa Dana Indeks', ikon: 'rdIndeks', lo: 5, hi: 9, grup: 'tumbuh' },
  { nama: 'Obligasi', ikon: 'obligasi', lo: 5, hi: 7, grup: 'stabil' },
  { nama: 'Reksa Dana Pendapatan Tetap', ikon: 'rdPendapatanTetap', lo: 5, hi: 7, grup: 'stabil' },
  { nama: 'Reksa Dana Pasar Uang', ikon: 'rdPasarUang', lo: 4.5, hi: 6.5, grup: 'stabil' },
  { nama: 'Deposito', ikon: 'deposito', lo: 3.5, hi: 5.5, grup: 'stabil' },
  { nama: 'Properti', ikon: 'properti', lo: 1, hi: 3, grup: 'sewa', catatan: 'kenaikan nilai saja' },
];

export const WARNA_GRUP: Record<Grup, string> = { tumbuh: B.blue, stabil: B.turq, sewa: B.orange };

const angka = (v: number) => String(v).replace('.', ',');
export const nilai = (r: Baris) => `~${angka(r.lo)}–${angka(r.hi)}%`;

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
