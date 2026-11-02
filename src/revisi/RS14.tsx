import React from 'react';
import { RS15_MASUK } from './RS15';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, R, io, lerp, rgba } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { MaskerKeluar, bayanganKaca, durMasker, type Masuk, daratDari, CakramDarat } from '../parts/kaca';
import { Kalender } from '../parts/nyata';
import { KartuLilin, laju, posisiQ, relatif, rentang } from '../parts/lilin';
import { IHSG_2012_2021_MINGGU, S14_LQ45_5TH, type Baris } from '../data/pasar';

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
/* Simon 15 Okt "untuk candlestick saham buat kurang lebih seperti ini dan hapus text IHSG" (ref: grafik aplikasi — ratusan candle kecil, sumbu tipis,
   kisi tipis, harga mengisi tinggi grafik). Dulu candle BULANAN (72 / 120 candle gemuk) → kini candle 2-MINGGUAN dari IHSG mingguan asli. */
const duaMinggu = (rows: Baris[]): Baris[] => Array.from({ length: Math.ceil(rows.length / 2) }, (_, k) => {
  const g = rows.slice(2 * k, 2 * k + 2);
  return [g[0][0], g[0][1], Math.max(...g.map((r) => r[2])), Math.min(...g.map((r) => r[3])), g[g.length - 1][4]];
});
const MINGGU2 = duaMinggu(IHSG_2012_2021_MINGGU);
/** B: saham Jan 2012 – Des 2017 (+66 %, dua kali turun ±25 %) vs deposito ±5 %/tahun (asumsi bunga, garis tenang) — domain SAMA */
const BARIS_B = MINGGU2.filter((r) => r[0] < '2018-01-01');
const IHSG6 = relatif(BARIS_B);
const DEPO = Array.from({ length: IHSG6.length + 1 }, (_, m) => Math.pow(1.05, m / 26));
const DOM_B = rentang(IHSG6, 0.08, [1, DEPO[DEPO.length - 1]]);
const JK = { w: 640, h: 500, y: 540, x: [580, 1340] }; // pusat frame (ukur 14 Okt: dulu y 600 → isi +60 px ke bawah)
/** C: saham Jan 2012 – Des 2021 (10 tahun, +72 %) — empat kali turun besar, ditandai dari data (puncak → lembah) */
const IHSG10 = relatif(MINGGU2);
const lo10 = Math.min(...IHSG10.map((x) => x.l)), hi10 = Math.max(...IHSG10.map((x) => x.h));
// harga mengisi tinggi grafik (ref); ruang bawah hanya untuk pil penurunan di bawah lembahnya
const DOM_C: [number, number] = [lo10 - 0.2 * (hi10 - lo10), hi10 + 0.04 * (hi10 - lo10)];
const indeks = (a: string, b: string) => MINGGU2.map((r, i) => (r[0] >= a && r[0] < b ? i : -1)).filter((i) => i >= 0);
const TURUN_C = [['2013-04-01', '2013-07-01', '2013-07-01', '2013-10-01'], ['2015-03-01', '2015-05-15', '2015-07-01', '2015-11-01'],
  ['2018-01-01', '2018-03-15', '2018-04-01', '2018-11-01'], ['2020-01-01', '2020-02-15', '2020-03-01', '2020-04-15']].map(([p0, p1, t0, t1]) => {
  const ip = indeks(p0, p1).reduce((m, i) => (IHSG10[i].h > IHSG10[m].h ? i : m));
  const it = indeks(t0, t1).reduce((m, i) => (IHSG10[i].l < IHSG10[m].l ? i : m));
  return { i: it, teks: `−${Math.round((1 - IHSG10[it].l / IHSG10[ip].h) * 100)}%` };
});
const SUMBU_C = Array.from({ length: 10 }, (_, k) => ({ i: Math.max(0, MINGGU2.findIndex((r) => r[0] >= `${2012 + k}-01-01`)), teks: String(2012 + k) }));
const C = { w: 1420, h: 600, y: 540 }; // pusat frame (dulu 590 → +50)

export const RS14: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS15_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s14 || f >= RS15_MASUK.mulai + durMasker) return null;
  const b = cin(f, T.b), c = cin(f, T.c), kelA = cin(f, T.keluarA, 30);
  const mgC = R(f, T.c - 30, T.c + 30, 0, 1, io), isiB = 1 - R(f, T.c - 30, T.c, 0, 1, io);
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
            label="Modal awal" labelB="Lima tahun kemudian" labelMix={R(f, T.tahunA[0], T.tahunA[0] + 30, 0, 1, io)} pasar />
          {/* kalender menumpang di sudut kanan-atas kartu: tahun mengikuti candle (Jan 2018 → Jan 2023) */}
          <Kalender x={960 + 310 - 40} y={600 - 240 - 6} s={0.66} p={popIn(f, T.kalA)} warna={B.orange} i={Math.min(5, posisiQ(LQ45.length, gA) / 12)}
            halaman={['2018', '2019', '2020', '2021', '2022', '2023'].map((t) => ({ atas: 'Jan', angka: t }))} />
        </div>) : null}

      {/* B → C (Simon 14 Okt: "jika ada 2 panel lalu selanjutnya cuman ada 1 gunakan transisi seperti scene 2 ke 3"): isi dua kartu memudar 30f
          sementara badan kedua kartu bergeser & MENYATU (60f inOut cubic) jadi badan kartu saham 10 tahun; isi kartu C memudar masuk di atasnya */}
      {mgC > 0.0001 && f < T.c + 60 ? JK.x.map((x0, k) => {
        const x = lerp(x0, 960, mgC), y = lerp(JK.y, C.y, mgC), w = lerp(JK.w, C.w, mgC), hh = lerp(JK.h, C.h, mgC);
        return (
          <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: w, height: hh, transform: `translate3d(${x - w / 2}px, ${y - hh / 2}px, 0) rotate(0.001deg)`, borderRadius: 32,
            background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`, boxShadow: bayanganKaca(B.orange, k ? mgC : 0) }} />);
      }) : null}

      {/* ═════════ B: dua jalur — tenang vs bergerak besar ═════════ */}
      {b > 0.001 && isiB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, isiB) }}>
          <KartuLilin x={JK.x[0]} y={JK.y} w={JK.w} h={JK.h} p={popIn(f, T.b)} d={IHSG6} garis={DEPO} dom={DOM_B} g={gB} modal={100_000_000} ikon="deposito"
            nama="Deposito" warna={B.turq} label="Bunga ±5% per tahun" periode="2012 – 2017" pasar />
          <KartuLilin x={JK.x[1]} y={JK.y} w={JK.w} h={JK.h} p={popIn(f, T.b + 10)} d={IHSG6} dom={DOM_B} g={gB} modal={100_000_000} ikon="saham"
            nama="Saham" warna={B.orange} label="Harga pasar" periode="2012 – 2017" pasar />
        </div>) : null}

      {/* ═════════ C: perjalanan 10 tahun melewati tiga siklus ═════════ */}
      {c > 0.001 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, R(f, T.c + 20, T.c + 55, 0, 1, io)) }}>
          <KartuLilin x={960} y={C.y} w={C.w} h={C.h} p={f >= T.c + 20 ? 1 : 0} d={IHSG10} dom={DOM_C} g={gC} modal={100_000_000} ikon="saham" nama="Saham · 10 tahun"
            warna={B.orange} label="Nilai investasi Rp100 jt" periode="2012 – 2021" tanda={TURUN_C} sumbu={SUMBU_C} pasar />
          </div>
        </>) : null}

      <Judul f={f} kata={['Jangka', 'panjang', '≠', 'pasti', 'untung']} at={T.judul} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
