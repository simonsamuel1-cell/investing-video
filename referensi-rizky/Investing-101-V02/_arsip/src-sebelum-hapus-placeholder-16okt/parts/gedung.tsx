import React from 'react';
import { Img, staticFile } from 'remotion';

/**
 * GEDUNG — gambar gedung Simon 9 Okt (latar transparan; aslinya di 04_Asset/stok-gedung/simon-9okt/):
 *   Saham  "untuk gedung di saham ganti dengan ini saja" → kecil (3 lantai) · menengah (7 lantai) · besar (menara)
 *   Obligasi "ini buat adegan obligasi untuk pemerintahan dan perusahaan. stylenya sama seperti yang disaham" → pemerintah · perusahaan
 * Berkas tampil = gambar Simon dipotong ke batas gedungnya, ±2× tinggi tampil (public/media/gedung/*.webp), tanpa diwarnai ulang.
 * Dulu stok gedung vektor Building.ai (scripts/gedung.py, kini tak dipakai). Posisi lewat translate3d + rotasi mikro (tanpa judder 1 px).
 */
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
export type KunciGedung = 'kecil' | 'menengah' | 'besar' | 'pemerintah' | 'perusahaan' | 'rumah' | 'bank' | 'tabungan' | 'brankas';
/** rasio lebar : tinggi berkas yang sudah dipotong */
const FOTO: Record<KunciGedung, { src: string; rasio: number }> = {
  kecil: { src: 'media/gedung/kecil.webp', rasio: 378 / 360 },
  menengah: { src: 'media/gedung/menengah.webp', rasio: 421 / 480 },
  besar: { src: 'media/gedung/besar.webp', rasio: 370 / 600 },
  pemerintah: { src: 'media/gedung/pemerintah.webp', rasio: 747 / 480 },
  perusahaan: { src: 'media/gedung/perusahaan.webp', rasio: 389 / 480 },
  rumah: { src: 'media/gedung/rumah.webp', rasio: 696 / 380 }, // Simon 12 Okt "gunakan gambar rumah ini untuk adegan properti"
  bank: { src: 'media/gedung/bank.webp', rasio: 1262 / 1166 },
  tabungan: { src: 'media/gedung/tabungan.webp', rasio: 1178 / 992 },
  brankas: { src: 'media/gedung/brankas.webp', rasio: 1039 / 1080 }, // Simon 12 Okt "ini gambar brankasnya" (Brankas Abu-abu dan Tumpukan Uang.png, kotak tinta) — kartu Deposito S02 // Simon 12 Okt (Celengan Pink dan Buku Tabungan.png, kotak tinta) — kartu Tabungan S02 // Simon 12 Okt "ganti icon bank dengan gambar ini" (Gedung Bank Modern Neoklasik.png, kotak tinta)
};
export const lebarGedung = (k: KunciGedung, h: number) => h * FOTO[k].rasio;
/** gedung utuh tanpa lingkaran (Simon 9 Okt, Obligasi S06: "kalau tidak bisa, hapus saja lingkaran masking untuk kedua gedung
 *  diobligasi"): pusat x, tepi BAWAH `dasar`, TINGGI h; `s` = skala berporos di tengah-bawah (gedung "tumbuh" dari tanah) */
export const Gedung: React.FC<{ k: KunciGedung; x: number; dasar: number; h: number; s: number }> = ({ k, x, dasar, h, s }) => {
  if (s <= 0.001) return null;
  const w = h * FOTO[k].rasio;
  return <Img src={staticFile(FOTO[k].src)} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none', transformOrigin: `${w / 2}px ${h}px`, transform: `${geser(x - w / 2, dasar - h)} scale(${s})` }} />;
};
/** diameter cincin wash terluar ÷ D (tepi bawah susunan = pusat + CINCIN_LUAR · D / 2) */
export const CINCIN_LUAR = 1.14;

/**
 * GEDUNG DI LINGKARAN — gaya karakter adegan pembuka Scene 01 (Simon 9 Okt: "gedungnya masking saja seperti orang yang ada discene 1";
 * lalu "ganti warnanya lingkarannya ke warna biru brand … hapus bayangannya"): lingkaran pekat `warna` TANPA bayangan di depan dua
 * cincin wash (1,14 · 1,06 D — lebih tipis dari Scene 01 supaya gedung yang diperbesar muat), gedung DIMASKER: di bawah garis tengah lingkaran
 * terpotong lengkung lingkaran, di atasnya utuh (puncak menyembul keluar). Satu gambar, clip-path = persegi atas ∪ setengah lingkaran
 * bawah (dua salinan seperti Scene 01 menebalkan tepi anti-alias di irisannya). Pusat lingkaran (x, cy), diameter D; dasar gedung
 * `turun` di bawah tepi bawah lingkaran (terpotong). Pop: seluruh susunan berskala dari pusat lingkaran.
 */
export const GedungLingkar: React.FC<{ k: KunciGedung; x: number; cy: number; D: number; h: number; s: number; warna: string; wash: string; turun?: number }> =
  ({ k, x, cy, D, h, s, warna, wash, turun = 0.06 * D }) => {
    if (s <= 0.001) return null;
    const r = D / 2, w = h * FOTO[k].rasio, alas = r + turun, atas = alas - h, cyImg = -atas;
    // pita selebar lingkaran di atas garis tengah ∪ setengah lingkaran bawah (persis karakter Scene 01: pita ±pita, di sini ±r) → gedung
    // yang lebih lebar dari lingkaran (pemerintah) terpotong tegak di tepi lingkaran, tak ada sayap yang menggantung di luar lingkaran
    const klip = `path('M ${w / 2 - r} -4 H ${w / 2 + r} V ${cyImg} A ${r} ${r} 0 0 1 ${w / 2 - r} ${cyImg} Z')`;
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `${geser(x, cy)} scale(${s})` }}>
        {[CINCIN_LUAR, 1.06].map((m, i) => (
          <div key={m} style={{ position: 'absolute', left: -m * r, top: -m * r, width: 2 * m * r, height: 2 * m * r, borderRadius: 999, background: wash, opacity: i === 0 ? 0.55 : 0.9 }} />))}
        <div style={{ position: 'absolute', left: -r, top: -r, width: D, height: D, borderRadius: 999, background: warna }} />
        <Img src={staticFile(FOTO[k].src)} style={{ position: 'absolute', left: -w / 2, top: atas, width: w, height: h, maxWidth: 'none', clipPath: klip }} />
      </div>);
  };

/**
 * RUMAH DI LINGKARAN (Simon 12 Okt, sisipan Properti S05: "tambahkan lingkaran masking seperti di adegan saham"). Gaya GedungLingkar
 * (lingkaran biru langit pekat + dua cincin wash, tanpa bayangan), tetapi foto rumah LEBAR (696 × 380): pita ±r GedungLingkar akan
 * memotong tegak kedua sisi atapnya (Simon menolak potongan sisi di gedung pemerintah S06), dan puncak atap tak bisa menyembul di atas
 * lingkaran tanpa sisi terpotong. Maka masker = gaya karakter Scene 01: di atas garis tengah UTUH selebar gambar (lis atap menjulur
 * sedikit keluar lingkaran), di bawahnya terpotong lengkung lingkaran (alas rumah masuk ke lingkaran). Rumah selebar D / 0,87, alasnya
 * 0,62 r di bawah pusat (dipilih dari 4 varian: rumah sedikit lebih besar dari lingkaran — Simon S08 "gedungnya jadi lebih besar dari
 * lingkaran" — sudut alas terpotong lengkung). Kotak tampak susunan = lingkaran berjari-jari JARI_RUMAH · D sekeliling (x, cy).
 */
export const JARI_RUMAH = 0.575;
export const RumahLingkar: React.FC<{ x: number; cy: number; D: number; s: number; warna: string; wash: string }> = (p) => <FotoLingkar k="rumah" {...p} />;
/** FOTO DI LINGKARAN (umum, ukuran & masker = RumahLingkar): foto selebar D / 0,87, alas 0,62 r di bawah pusat, utuh di atas garis tengah,
 *  terpotong lengkung di bawahnya. `wash` = dua cincin wash (tanpa `wash`: lingkaran saja — mis. ubin diagram S04 yang tak bercincin). */
/** `lebar` = lebar foto ÷ D (bawaan 1/0,87), `alas` = alas foto di bawah pusat ÷ r (bawaan 0,62), `op` = opasitas; `warna: 'none'` = tanpa
 *  cakram (foto di atas cakram milik komponen lain, mis. SimpulBab) */
export const FotoLingkar: React.FC<{ k: KunciGedung; x: number; cy: number; D: number; s: number; warna: string; wash?: string; lebar?: number; alas?: number; op?: number;
  /** false = foto UTUH tanpa masker lengkung (Simon 12 Okt, Tabungan S02: "jangan dimasking, tapi tetap ada lingkarannya") */ masker?: boolean }> =
  ({ k, x, cy, D, s, warna, wash, lebar = 1 / 0.87, alas = 0.62, op = 1, masker = true }) => {
  if (s <= 0.001 || op <= 0.001) return null;
  const r = D / 2, w = D * lebar, h = w / FOTO[k].rasio, atas = alas * r - h, cyImg = -atas;
  const klip = `path('M -4 -4 H ${w + 4} V ${cyImg} H ${w / 2 + r} A ${r} ${r} 0 0 1 ${w / 2 - r} ${cyImg} H -4 Z')`;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `${geser(x, cy)} scale(${s})`, opacity: op < 1 ? op : undefined }}>
      {wash ? [CINCIN_LUAR, 1.06].map((m, i) => (
        <div key={m} style={{ position: 'absolute', left: -m * r, top: -m * r, width: 2 * m * r, height: 2 * m * r, borderRadius: 999, background: wash, opacity: i === 0 ? 0.55 : 0.9 }} />)) : null}
      {warna !== 'none' ? <div style={{ position: 'absolute', left: -r, top: -r, width: D, height: D, borderRadius: 999, background: warna }} /> : null}
      <Img src={staticFile(FOTO[k].src)} style={{ position: 'absolute', left: -w / 2, top: atas, width: w, height: h, maxWidth: 'none', clipPath: masker ? klip : undefined }} />
    </div>);
};
