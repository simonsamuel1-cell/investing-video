import React from 'react';
import { RS15_MASUK } from './RS15';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, R, io } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { MaskerKeluar, durMasker, type Masuk, daratDari, CakramDarat } from '../parts/kaca';
import { Kalender } from '../parts/nyata';
import { KartuLilin, laju, posisiQ, relatif, rentang } from '../parts/lilin';
import { S14_IHSG_10TH, S14_IHSG_6TH, S14_LQ45_5TH } from '../data/pasar';

/**
 * REVISI SCENE 14 (14 Okt, evaluasi 5 pertanyaan — versi lama: panel grafik kosong ±4 dtk di awal, garis "selalu naik" dicoret = simbol).
 * Pesan: waktu panjang memberi kesempatan melewati siklus, bukan jaminan untung; return lebih tinggi datang dengan gerak lebih besar.
 *   A  "jangka panjang bukan berarti pasti untung"  kartu nilai + kalender 2026 → 2031: lima tahun kemudian nilainya BISA masih di bawah modal (Rp92 jt)
 *   B  "return lebih tinggi … pergerakan harga lebih besar"  dua kartu sejajar (ref-22): Deposito naik pelan & tenang · Saham / RD saham naik lebih tinggi
 *      tapi anjlok-pulih besar — nominal berjalan + garis kecil di dalam kartu
 *   C  "melewati berbagai siklus pasar, bukan jaminan harga selalu naik"  satu kartu lebar: perjalanan 10 tahun dengan tiga kali turun-pulih
 *      (ruas turun merah, naik hijau), penanda berjalan melewati tiap siklus; ruas terakhir pun bisa turun
 */

const [tapi, ingat, jangka, bukan, pasti, untung, potensi, ret, tinggi, juga, pergerakan, besar, keuntungan, waktu, kesempatan, melewati, siklus, bukan2, selalu,
  naik] = urut([
  'tapi', 'ingat', 'jangka', 'bukan', 'pasti', 'untung', 'potensi', 'return', 'tinggi', 'juga', 'pergerakan', 'besar', 'keuntungan', 'waktu', 'kesempatan', 'melewati',
  'siklus', 'bukan', 'selalu', 'naik'], BATAS.s14);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS14_MASUK: Masuk = { x: 960, y: 600, r: 150, warna: B.white, mulai: BATAS.s14 - 20 };
const DARAT = daratDari(RS14_MASUK);

const T = {
  kartuA: DARAT + 30, kalA: Math.max(ingat, DARAT + 44), denyutTapi: tapi, tahunA: [jangka - 10, untung + 10], pasti, judul: jangka, denyutBukan: bukan,
  // A habis dulu (30f), baru kartu B muncul — tidak bertumpuk
  keluarA: potensi - 25, b: potensi + 15, jalur: [ret, besar + 30], denyutTinggi: tinggi, denyutJuga: juga, denyutGerak: pergerakan,
  c: keuntungan - 20, kartuC: keuntungan, garis: [keuntungan + 30, naik + 10], denyutWaktu: waktu, denyutKesempatan: kesempatan, denyutMelewati: melewati, denyutSiklus: siklus,
  denyutBukan2: bukan2, denyutSelalu: selalu,
};

/* ── Simon 14 Okt: volatilitas = candlestick realistis — semua grafik scene ini = data asli (fakta sejarah, bukan ramalan) ── */
/** A: Indeks LQ45 bulanan Jan 2018 – Des 2022 — lima tahun, tetap di bawah modal (−13 %) */
const LQ45 = relatif(S14_LQ45_5TH);
/** B: IHSG bulanan Jan 2012 – Des 2017 (+66 %, dua kali turun ±25 %) vs deposito ±5 %/tahun (asumsi bunga, garis tenang) — domain SAMA */
const IHSG6 = relatif(S14_IHSG_6TH);
const DEPO = Array.from({ length: IHSG6.length + 1 }, (_, m) => Math.pow(1.05, m / 12));
const DOM_B = rentang(IHSG6, 0.1, [1, DEPO[DEPO.length - 1]]);
const JK = { w: 640, h: 500, y: 540, x: [580, 1340] }; // pusat frame (ukur 14 Okt: dulu y 600 → isi +60 px ke bawah)
/** C: IHSG bulanan Jan 2015 – Des 2024 (10 tahun, +35 %) — empat kali turun besar, ditandai dari data (puncak → lembah) */
const IHSG10 = relatif(S14_IHSG_10TH);
const DOM_C = rentang(IHSG10, 0.16);
const TURUN_C = [[3, 8], [37, 42], [60, 62], [116, 119]].map(([a, b]) => ({ i: b, teks: `−${Math.round((1 - IHSG10[b].l / IHSG10[a].h) * 100)}%` }));
const C = { w: 1420, h: 600, y: 540 }; // pusat frame (dulu 590 → +50)

export const RS14: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS15_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s14 || f >= RS15_MASUK.mulai + durMasker) return null;
  const b = cin(f, T.b), c = cin(f, T.c), kelA = cin(f, T.keluarA, 30);
  const gA = laju(f, T.tahunA[0], T.tahunA[1]);
  const gB = laju(f, T.jalur[0], T.jalur[1]);
  const gC = laju(f, T.garis[0], T.garis[1]);
  return (
    <MaskerKeluar f={f} mulai={RS15_MASUK.mulai} ke={RS15_MASUK} warna={RS15_MASUK.warna}>
    <AbsoluteFill>
      <CakramDarat f={f} ke={RS14_MASUK} />
      {/* ═════════ A: lima tahun kemudian bisa masih di bawah modal ═════════ */}
      {kelA < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - kelA) }}>
          <KartuLilin x={960} y={600} w={620} h={480} p={popIn(f, T.kartuA)} d={LQ45} g={gA} modal={100_000_000} ikon="saham" nama="Indeks LQ45" warna={B.orange}
            label="Modal awal" labelB="Lima tahun kemudian" labelMix={R(f, T.tahunA[0], T.tahunA[0] + 30, 0, 1, io)} />
          {/* kalender menumpang di sudut kanan-atas kartu: tahun mengikuti candle (Jan 2018 → Jan 2023) */}
          <Kalender x={960 + 310 - 40} y={600 - 240 - 6} s={0.66} p={popIn(f, T.kalA)} warna={B.orange} i={Math.min(5, posisiQ(LQ45.length, gA) / 12)}
            halaman={['2018', '2019', '2020', '2021', '2022', '2023'].map((t) => ({ atas: 'Jan', angka: t }))} />
        </div>) : null}

      {/* ═════════ B: dua jalur — tenang vs bergerak besar ═════════ */}
      {b > 0.001 && c < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - c) }}>
          <KartuLilin x={JK.x[0]} y={JK.y} w={JK.w} h={JK.h} p={popIn(f, T.b)} d={IHSG6} garis={DEPO} dom={DOM_B} g={gB} modal={100_000_000} ikon="deposito"
            nama="Deposito" warna={B.turq} label="Bunga ±5% per tahun" periode="2012 – 2017" />
          <KartuLilin x={JK.x[1]} y={JK.y} w={JK.w} h={JK.h} p={popIn(f, T.b + 10)} d={IHSG6} dom={DOM_B} g={gB} modal={100_000_000} ikon="saham"
            nama="Saham (IHSG)" warna={B.orange} label="Harga pasar" periode="2012 – 2017" />
        </div>) : null}

      {/* ═════════ C: perjalanan 10 tahun melewati tiga siklus ═════════ */}
      {c > 0.001 ? (
        <>
          <KartuLilin x={960} y={C.y} w={C.w} h={C.h} p={popIn(f, T.kartuC)} d={IHSG10} dom={DOM_C} g={gC} modal={100_000_000} ikon="saham" nama="IHSG · 10 tahun"
            warna={B.orange} label="Nilai investasi Rp100 jt" periode="2015 – 2024" tanda={TURUN_C}
            sumbu={Array.from({ length: 10 }, (_, k) => ({ i: 12 * k, teks: String(2015 + k) }))} />
        </>) : null}

      <Judul f={f} kata={['Jangka', 'panjang', '≠', 'pasti', 'untung']} at={T.judul} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
