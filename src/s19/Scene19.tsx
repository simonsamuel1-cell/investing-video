import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { kata, urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, io, lerp } from '../theme';
import { popIn } from '../parts/pop';
import { cin } from '../parts/kit';
import { Judul } from '../parts/judul';
import { Bulat, Chip, Label, NAMA_UANG, WARNA_UANG, denyut } from '../parts/umum';
import { Kaca, MaskerKeluar, durMasker, geser } from '../parts/kaca';
import { S20_MASUK } from '../s20/Scene20';

/**
 * SCENE 19 — IDE VISUAL (13 Okt). Bab "Tiga Jenis Uang × Pilihan Produk". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  tabel Jenis Uang · Waktu · Pilihan — Uang Aktif | Bisa dipakai kapan saja | Rekening Bank / RDPU · Uang Stabil | 1–3 tahun |
 *           Deposito / RDPT / Obligasi Pemerintah · Uang Jangka Panjang | 3+ tahun | Index Fund / Reksa Dana Saham / Saham
 *   TEXT    "Setiap uang" / "punya [tugasnya] sendiri"
 * Empat ketukan (29,6 dtk): kepala tabel di "sederhana" · baris Uang aktif (waktu di "sekarang", pilihan di katanya) · baris Uang stabil ·
 *   baris Uang jangka panjang · "Setiap uang punya tugasnya masing-masing": baris berdenyut bergiliran, sub-judul TEXT (sorot "tugasnya")
 *   Ikon pilihan = ikon instrumen yang sama dengan Scene 05/09/13 (rekening bank = foto Simon Video 02; Deposito = foto brankas, brief Video 02 12 Okt).
 * Rakitan 13 Okt: baris = KARTU KACA ber-tab kiri warna jenis uangnya (acuan Simon ref-10 · ref-22); MASUK = masker Scene 18 mendarat jadi
 * dompet Uang Aktif baris pertama; KELUAR = masker ke dompet Uang Aktif Scene 20 (brief Video 02 B: bukan pudar biasa).
 */

const [sederhana, ingat, seperti, uang, aktif, kebutuhan, sekarang, rekening, reksa, stabil, untuk, satu, tiga, deposito, reksa2, pendapatan, tetap, obligasi,
  pemerintah, jangka, untuk3,
  tiga3, atas, reksa3, reksa4, saham, saham2, setiap, tugasnya, masing] = urut([
  'sederhana', 'ingat', 'seperti', 'uang', 'aktif', 'kebutuhan', 'sekarang', 'rekening', 'reksa', 'stabil', 'untuk', 'satu', 'tiga', 'deposito', 'reksa',
  'pendapatan', 'tetap', 'obligasi', 'pemerintah', 'jangka', 'untuk', 'tiga', 'atas', 'reksa', 'reksa', 'saham', 'saham', 'setiap', 'tugasnya', 'masing-masing'], BATAS.s19);

/** MASUK Scene 19 = masker Scene 18 menyusut ke dompet Uang Aktif baris pertama (mendarat 40f sesudah batas) */
export const S19_MASUK = { x: 960, y: 560, r: 49, warna: WARNA_UANG[0], mulai: BATAS.s19 - 20 };
const DARAT = S19_MASUK.mulai + durMasker;

/** "reksa dana PASAR uang" (RDPU) — isi jendela diam sesudah RDPU muncul */
const pasar = kata('pasar', reksa);
const T = {
  // tiap jeda diisi kata: kepala berdenyut di "seperti ini" · waktu muncul di "kebutuhan" / "untuk" & berdenyut di angka tahunnya · pilihan di kata pertamanya
  // baris 2 di "uang STABIL" ("uang" sebelumnya = "pasar uang")
  kepala: sederhana, denyutKepala: seperti, judul: ingat, baris: [uang - 10, stabil - 30, jangka - 20], denyutBaris: [aktif + 20, -999, -999],
  waktu: [kebutuhan, untuk, untuk3], denyutWaktu: [[sekarang], [satu, tiga], [tiga3, atas]],
  pilihan: [[rekening, reksa], [deposito, reksa2, obligasi], [reksa3, reksa4, saham2]], denyutPilihan: [[-999, pasar], [-999, pendapatan + 10, pemerintah + 10], [-999, saham, -999]], denyutRdpt: tetap, denyut: [setiap, tugasnya, masing], sub: setiap - 10, subSorot: tugasnya,
};

/* ── tata letak ── */
const BARIS = { y: [410, 615, 820], h: 190, x0: 160, w: 1600 }; // diperbesar agar ikon & nama pilihan terbaca
const KOL = { jenis: 390, waktu: 820, pilihan: [1240, 1450, 1660] };
const WAKTU = ['Bisa dipakai kapan saja', '1–3 tahun', '3+ tahun'];
/** Simon 14 Okt: ikon instrumen → gambar realistis (berkas Simon), lalu "hapus saja lingkarannya" → gambar berdiri sendiri tanpa lingkaran warna
 *  (RDPU & Obligasi pemerintah: gambar dikirim Simon 14 Okt sore). */
const PILIHAN: { nama: string; src: string }[][] = [
  [{ nama: 'Rekening bank', src: 'media/rekening-bank.webp' }, { nama: 'RDPU', src: 'media/realistis/rd-pasar-uang.webp' }],
  [{ nama: 'Deposito', src: 'media/gedung/brankas.webp' }, { nama: 'RDPT', src: 'media/realistis/rd-pendapatan-tetap.webp' },
    { nama: 'Obligasi pemerintah', src: 'media/realistis/obligasi-pemerintah.webp' }],
  [{ nama: 'Reksa dana indeks', src: 'media/realistis/rd-indeks.webp' }, { nama: 'Reksa dana saham', src: 'media/realistis/rd-saham.webp' },
    { nama: 'Saham', src: 'media/realistis/saham.webp' }],
];
/** kotak gambar pilihan (objectFit contain, berpusat) */
const GB = { w: 132, h: 108 };

/** KELUAR Scene 19 = milik Scene 20: masker lingkaran menyusut ke dompet Uang Aktif Scene 20 (S20_MASUK) */
export const S19_KELUAR = S20_MASUK.mulai;
export const Scene19: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s19 - 30 || f >= S19_KELUAR + durMasker) return null;
  const oy = lerp(lerp(lerp(0, 153, cin(f, T.kepala - 24)), 50, cin(f, T.baris[1] - 24)), -52, cin(f, T.baris[2] - 24));
  // mendatar: selama hanya kepala tabel + dompet (kolom Jenis/Waktu/Pilihan tidak simetris) susunan terukur −56 px → +56 sampai baris pertama muncul
  const ox = 56 * cin(f, T.kepala - 24) * (1 - cin(f, T.baris[0] - 24));
  return (
    <MaskerKeluar f={f} mulai={S19_KELUAR} ke={S20_MASUK} warna={S20_MASUK.warna}>
      {/* GESER BERTAHAP vertikal (pindai pusat 14 Okt: kepala + baris 1 saja dulu −160 px di atas tengah, 2 baris −52, 3 baris +54):
          tabel turun ke tengah selama baris masih sedikit, lalu naik bertahap tiap baris baru muncul (60f, bersama barisnya) */}
      <AbsoluteFill style={{ transform: geser(ox, oy) }}>
      {/* kepala tabel */}
      {(['Jenis uang', 'Waktu', 'Pilihan'] as const).map((h, i) => {
        const p = popIn(f, T.kepala + 10 * i);
        if (p <= 0.001) return null;
        const x = i === 0 ? KOL.jenis : i === 1 ? KOL.waktu : (KOL.pilihan[0] + KOL.pilihan[2]) / 2;
        return <div key={h} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, 278)} translate(-50%, -50%) scale(${p * (1 + denyut(f, T.denyutKepala + 10 * i, 0.08))})`, fontFamily: F, fontSize: 28,
          fontWeight: 800, color: B.gray, letterSpacing: '.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</div>;
      })}

      {/* baris */}
      {[0, 1, 2].map((r) => {
        const p = popIn(f, T.baris[r]);
        // dompet Uang Aktif sudah ada sejak masker Scene 18 mendarat (sebelum barisnya muncul)
        if (p <= 0.001 && !(r === 0 && f >= DARAT)) return null;
        const y = BARIS.y[r];
        const dn = 1 + T.denyut.reduce((s, t) => s + denyut(f, t + 14 * r, 0.02), 0);
        return (
          <React.Fragment key={r}>
            <Kaca x={BARIS.x0 + BARIS.w / 2} y={y} w={BARIS.w} h={BARIS.h} p={Math.min(1, p) * dn} warna={WARNA_UANG[r]} tab="kiri" tabTebal={12} rona={0.45} radius={28} />
            {/* Uang Aktif: mendarat di tengah (masker Scene 18), pindah ke barisnya saat baris muncul — tetap di tengah sebelum tabel tersusun */}
            <Bulat x={r === 0 ? lerp(S19_MASUK.x - ox, KOL.jenis, cin(f, T.baris[0] - 16)) : KOL.jenis} y={r === 0 ? lerp(S19_MASUK.y - oy, y - 28, cin(f, T.baris[0] - 16)) : y - 28} d={98}
              warna={WARNA_UANG[r]} ikon="dompet" ikonAlfa={r === 0 ? R(f, DARAT, DARAT + 20, 0, 1, io) : 1}
              p={(r === 0 ? (f >= DARAT ? 0.99996 : 0) : p) * (1 + denyut(f, T.denyutBaris[r], 0.06))} />
            <Label x={KOL.jenis} y={y + 56} teks={NAMA_UANG[r]} f={f} at={T.baris[r] + 10} size={30} lebar={360} />
            <Chip x={KOL.waktu} y={y} teks={WAKTU[r]} ikon="kalender" warna={WARNA_UANG[r]} p={popIn(f, T.waktu[r]) * (1 + T.denyutWaktu[r].reduce((s, t) => s + denyut(f, t, 0.07), 0))} size={28} />
            {PILIHAN[r].map((o, j) => {
              const x = PILIHAN[r].length === 2 ? [1345, 1555][j] : KOL.pilihan[j];
              const q = popIn(f, T.pilihan[r][j]) * (1 + denyut(f, T.denyutPilihan[r][j], 0.07) + (r === 1 && j === 1 ? denyut(f, T.denyutRdpt, 0.07) : 0));
              if (q <= 0.001) return null;
              return (
                <React.Fragment key={o.nama}>
                  <Img src={staticFile(o.src)} style={{ position: 'absolute', left: 0, top: 0, width: GB.w, height: GB.h, objectFit: 'contain', transformOrigin: 'center',
                    transform: `${geser(x - GB.w / 2, y - 32 - GB.h / 2)} scale(${q})` }} />
                  <Label x={x} y={y + 46} teks={o.nama} f={f} at={T.pilihan[r][j] + 8} size={24} lebar={200} />
                </React.Fragment>);
            })}
          </React.Fragment>);
      })}

      </AbsoluteFill>
      <AbsoluteFill>
        <Judul f={f} kata={['Setiap', 'uang']} at={T.judul} />
        <Judul f={f} kata={['punya', 'tugasnya', 'sendiri']} sorotIdx={1} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
      </AbsoluteFill>
    </MaskerKeluar>);
};

export const S19_T = T;
export const S19_BARIS = BARIS;
