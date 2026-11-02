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
export type Baris = { nama: string; ikon: KunciIkon; lo: number; hi: number; grup: Grup; catatan?: string; kira?: boolean; sumber?: string };

/** Simon 21 Okt — grafik baru "Long-Term Average Annual Return" (04_Asset/brief-21okt/, berkas "Bar chart return aset (16 9)@1x (1).png"):
 *  urutan · angka · KISARAN (batang dua nada: pekat s.d. batas bawah, lebih muda s.d. batas atas) · keterangan sumber per aset PERSIS acuan;
 *  warna tetap warna grup S01 ("hanya saja warnanya buat seperti sekarang"). Urutan lama (16 Okt) = RADIAL_URUT (adegan pembuka radial
 *  TIDAK berubah). */
export const ROWS: Baris[] = [
  { nama: 'Saham', ikon: 'saham', lo: 15.2, hi: 15.2, grup: 'tumbuh', sumber: 'IHSG + est. dividen 2%, 2001–2025' },
  { nama: 'Emas', ikon: 'emas', lo: 14.2, hi: 14.2, grup: 'tumbuh', sumber: 'Harga emas LBMA dalam Rupiah, 2001–2025' },
  { nama: 'Reksa Dana Saham', ikon: 'rdSaham', lo: 11.5, hi: 11.5, grup: 'tumbuh', sumber: 'Rata-rata 11 reksa dana saham, 2001–2026' },
  { nama: 'Reksa Dana Indeks', ikon: 'rdIndeks', lo: 9.9, hi: 9.9, grup: 'tumbuh', sumber: 'Indeks IDX High Dividend 20, dividen diinvestasikan ulang, 2021–2025' },
  { nama: 'Obligasi Pemerintah', ikon: 'obligasi', lo: 6, hi: 8, grup: 'stabil', sumber: 'Kisaran imbal hasil SBN 10 tahun (PHEI), sebelum pajak' },
  { nama: 'Reksa Dana Pendapatan Tetap', ikon: 'rdPendapatanTetap', lo: 5, hi: 7, grup: 'stabil', sumber: 'Rata-rata return Indeks RD Pendapatan Tetap Infovesta, 2019–2025' },
  { nama: 'Reksa Dana Pasar Uang', ikon: 'rdPasarUang', lo: 3, hi: 5, grup: 'stabil', sumber: 'Kisaran return Indeks RD Pasar Uang Infovesta, 2020–2025' },
  { nama: 'Deposito', ikon: 'deposito', lo: 3, hi: 5, grup: 'stabil', sumber: 'Kisaran bunga penjaminan LPS & bunga deposito BI, sebelum pajak' },
  { nama: 'Properti', ikon: 'properti', lo: 3.5, hi: 3.5, grup: 'sewa', sumber: 'Indeks harga rumah BIS, 2002–2025, belum termasuk sewa' },
];
/** urutan adegan pembuka RADIAL (posisi & waktu butir) = urutan 16 Okt — dikunci supaya pembuka identik; isi = indeks baris ROWS */
export const RADIAL_URUT: number[] = ['Saham', 'Reksa Dana Saham', 'Emas', 'Reksa Dana Indeks', 'Obligasi Pemerintah', 'Reksa Dana Pendapatan Tetap',
  'Reksa Dana Pasar Uang', 'Deposito', 'Properti'].map((n) => ROWS.findIndex((r) => r.nama === n));

export const WARNA_GRUP: Record<Grup, string> = { tumbuh: B.blue, stabil: B.turq, sewa: B.orange };

const angka = (v: number) => v.toFixed(1).replace('.', ',');
const bulat = (v: number) => (Number.isInteger(v) ? String(v) : angka(v));
// kisaran = tulisan acuan "6–8%" (bilangan bulat, tanpa "~")
export const nilai = (r: Baris) => (r.lo === r.hi ? `${r.kira ? '~' : ''}${angka(r.hi)}%` : `${bulat(r.lo)}–${bulat(r.hi)}%`);

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
