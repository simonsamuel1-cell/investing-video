import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, WARNA, io, rgba } from '../theme';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { Bulat, Chip, Label, NAMA_UANG, WARNA_UANG, denyut, geser } from '../parts/umum';

/**
 * SCENE 19 — IDE VISUAL (13 Okt). Bab "Tiga Jenis Uang × Pilihan Produk". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  tabel Jenis Uang · Waktu · Pilihan — Uang Aktif | Bisa dipakai kapan saja | Rekening Bank / RDPU · Uang Stabil | 1–3 tahun |
 *           Deposito / RDPT / Obligasi Pemerintah · Uang Jangka Panjang | 3+ tahun | Index Fund / Reksa Dana Saham / Saham
 *   TEXT    "Setiap uang" / "punya [tugasnya] sendiri"
 * Empat ketukan (29,6 dtk): kepala tabel di "sederhana" · baris Uang aktif (waktu di "sekarang", pilihan di katanya) · baris Uang stabil ·
 *   baris Uang jangka panjang · "Setiap uang punya tugasnya masing-masing": baris berdenyut bergiliran, sub-judul TEXT (sorot "tugasnya")
 *   Ikon pilihan = ikon instrumen yang sama dengan Scene 05/09/13 (rekening bank = foto Simon Video 02).
 */

const [sederhana, ingat, seperti, uang, aktif, kebutuhan, sekarang, rekening, reksa, stabil, untuk, satu, tiga, deposito, reksa2, pendapatan, tetap, obligasi,
  pemerintah, jangka, untuk3,
  tiga3, atas, reksa3, reksa4, saham, saham2, setiap, tugasnya, masing] = urut([
  'sederhana', 'ingat', 'seperti', 'uang', 'aktif', 'kebutuhan', 'sekarang', 'rekening', 'reksa', 'stabil', 'untuk', 'satu', 'tiga', 'deposito', 'reksa',
  'pendapatan', 'tetap', 'obligasi', 'pemerintah', 'jangka', 'untuk', 'tiga', 'atas', 'reksa', 'reksa', 'saham', 'saham', 'setiap', 'tugasnya', 'masing-masing'], BATAS.s19);

const T = {
  // tiap jeda diisi kata: kepala berdenyut di "seperti ini" · waktu muncul di "kebutuhan" / "untuk" & berdenyut di angka tahunnya · pilihan di kata pertamanya
  // baris 2 di "uang STABIL" ("uang" sebelumnya = "pasar uang")
  kepala: sederhana, denyutKepala: seperti, judul: ingat, baris: [uang - 10, stabil - 30, jangka - 20], denyutBaris: [aktif + 20, -999, -999],
  waktu: [kebutuhan, untuk, untuk3], denyutWaktu: [[sekarang], [satu, tiga], [tiga3, atas]],
  pilihan: [[rekening, reksa], [deposito, reksa2, obligasi], [reksa3, reksa4, saham2]], denyutPilihan: [[-999, -999], [-999, pendapatan + 10, pemerintah + 10], [-999, saham, -999]], denyutRdpt: tetap, denyut: [setiap, tugasnya, masing], sub: setiap - 10, subSorot: tugasnya,
};

/* ── tata letak ── */
const BARIS = { y: [410, 615, 820], h: 190, x0: 160, w: 1600 }; // diperbesar agar ikon & nama pilihan terbaca
const KOL = { jenis: 390, waktu: 820, pilihan: [1240, 1450, 1660] };
const WAKTU = ['Bisa dipakai kapan saja', '1–3 tahun', '3+ tahun'];
const PILIHAN: { nama: string; ikon: KunciIkon | 'bank'; warna: string }[][] = [
  [{ nama: 'Rekening bank', ikon: 'bank', warna: B.turq }, { nama: 'RDPU', ikon: 'rdPasarUang', warna: WARNA.langit }],
  [{ nama: 'Deposito', ikon: 'deposito', warna: WARNA.ungu }, { nama: 'RDPT', ikon: 'rdPendapatanTetap', warna: WARNA.langit },
    { nama: 'Obligasi pemerintah', ikon: 'obligasi', warna: B.orange }],
  [{ nama: 'Reksa dana indeks', ikon: 'rdIndeks', warna: WARNA.ungu }, { nama: 'Reksa dana saham', ikon: 'rdSaham', warna: WARNA.langit },
    { nama: 'Saham', ikon: 'saham', warna: B.blue }],
];

/** KELUAR Scene 19 = milik Scene 20 ("Jadi ingat satu hal …", penutup): seluruh isi naik-pudar 40f mulai di batas, judul keluar */
export const S19_KELUAR = BATAS.s20 + 20;
export const Scene19: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s19 || f >= S19_KELUAR + 60) return null;
  const kelS = R(f, S19_KELUAR - 20, S19_KELUAR + 20, 0, 1, io);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kelS, transform: geser(0, -30 * kelS) }}>
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
        if (p <= 0.001) return null;
        const y = BARIS.y[r];
        const dn = 1 + T.denyut.reduce((s, t) => s + denyut(f, t + 14 * r, 0.02), 0);
        return (
          <React.Fragment key={r}>
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(BARIS.x0 + BARIS.w / 2, y)} translate(-50%, -50%) scale(${Math.min(1, p) * dn})`,
              width: BARIS.w, height: BARIS.h, borderRadius: 26, background: B.white, borderLeft: `10px solid ${WARNA_UANG[r]}`, boxSizing: 'border-box',
              boxShadow: `0 20px 40px -22px ${rgba(B.night, 0.28)}` }} />
            <Bulat x={KOL.jenis} y={y - 28} d={98} warna={WARNA_UANG[r]} ikon="dompet" p={p * (1 + denyut(f, T.denyutBaris[r], 0.06))} />
            <Label x={KOL.jenis} y={y + 56} teks={NAMA_UANG[r]} f={f} at={T.baris[r] + 10} size={30} lebar={360} />
            <Chip x={KOL.waktu} y={y} teks={WAKTU[r]} ikon="kalender" warna={WARNA_UANG[r]} p={popIn(f, T.waktu[r]) * (1 + T.denyutWaktu[r].reduce((s, t) => s + denyut(f, t, 0.07), 0))} size={28} />
            {PILIHAN[r].map((o, j) => {
              const x = PILIHAN[r].length === 2 ? [1345, 1555][j] : KOL.pilihan[j];
              const q = popIn(f, T.pilihan[r][j]) * (1 + denyut(f, T.denyutPilihan[r][j], 0.07) + (r === 1 && j === 1 ? denyut(f, T.denyutRdpt, 0.07) : 0));
              if (q <= 0.001) return null;
              return (
                <React.Fragment key={o.nama}>
                  {o.ikon === 'bank' ? (
                    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(x, y - 32)} scale(${q})` }}>
                      <div style={{ position: 'absolute', left: -45, top: -45, width: 90, height: 90, borderRadius: '50%', background: o.warna, boxShadow: `0 12px 26px -10px ${o.warna}aa` }} />
                      <Img src={staticFile('media/rekening-bank.webp')} style={{ position: 'absolute', left: -52, top: 0.76 * 45 - 88, width: 104, height: 88, maxWidth: 'none' }} />
                    </div>) : <Bulat x={x} y={y - 32} d={90} warna={o.warna} ikon={o.ikon} p={q} />}
                  <Label x={x} y={y + 46} teks={o.nama} f={f} at={T.pilihan[r][j] + 8} size={24} lebar={200} />
                </React.Fragment>);
            })}
          </React.Fragment>);
      })}

      </AbsoluteFill>
      <Judul f={f} kata={['Setiap', 'uang']} at={T.judul} keluar={S19_KELUAR} />
      <Judul f={f} kata={['punya', 'tugasnya', 'sendiri']} sorotIdx={1} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S19_KELUAR} />
    </AbsoluteFill>);
};

export const S19_T = T;
export const S19_BARIS = BARIS;
