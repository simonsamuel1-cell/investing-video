import React from 'react';
import { Img, staticFile } from 'remotion';
import { ARAH, B, CEK, F, R, SISI, bayanganDengan, bayanganKecil, lerp, mixHex, rgba } from '../theme';
import { Icon, SWIPE, cin, popOut, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Lencana } from '../parts/umum';
import { Kaca, Chevron } from '../parts/kaca';
import { Pendar } from '../parts/v06';
import { TepiSubtitle } from '../parts/nyata';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { BERDIRI, JALAN_FRAME, LARI_FRAME, LENGAN_MAIN_HP, alasTerendah, campurPose, gaya as gayaT, ikLengan, panjangSiklus as panjangT, titikKepala,
  type Kepala, type Pose } from '../flat/rigTegak';
import { HutanLayar, KOTA, KotaLayar, TANAH_LAYAR, TokohTegakLapis, Z_KOTA, ambil, simulasi, type Jejak } from '../flat/dunia';
import { KEL_RUPA } from '../s01flat/Scene01Flat';
import { AkhirS02, Buah, Genggam, PEGANG_DEKAT, Tanda } from '../s02flat/Scene02Flat';
import { Backdrop } from '../parts/Backdrop';
import { Penghubung } from '../parts/kaca';
import { POHON_S03, TransisiParalaks } from '../flat/transisi';

/**
 * SCENE 03 — VERSI 2D FLAT (dokumen "Investing_101_Ide_Visual_2D_Flat_Detail.md" Scene 03 "Otak Selalu Mencari Cara yang Lebih Mudah"). Acuan gaya =
 * Scene 01/02 flat. Simon 27 Okt: "restart studio dan lanjutkan prosesnya" → Scene 03 dibangun; Scene 03 lama (papan kartu) DIHAPUS (aturan "ketika
 * membangun scene baru, hapus scene lama").
 * Urutan visual dokumen (1 buah dikenal · 2 buah asing · 3 siluet 2 % / 20 % · 4 restoran · 5 rating · 6 tiga contoh) disinkronkan ke VO:
 *  A f6127–6340 "Kesalahan pertama adalah mengambil keputusan terlalu cepat." → (1) tokoh dulu melihat buah yang dikenalnya, sekilas memeriksa,
 *    langsung mengambil, lalu melanjutkan langkah. Masuk dengan transisi DORONG (adegan akhir Scene 02 terdorong ke kiri).
 *  B f6340–6805 "Otak kita … dua persen dari berat tubuh, tetapi … seperlima energi tubuh saat beristirahat." → (3) tokoh yang sama berubah jadi SILUET
 *    (tint), bagian otak disorot, kartu 2 % berat tubuh lalu ≈20 % energi saat beristirahat muncul satu per satu (angka & batang berjalan).
 *  C f6805–7128 "Di masa ketika makanan bisa habis kapan saja, berpikir terlalu lama juga punya biaya." → (2) lingkaran otak MEMBUKA jadi padang rumput:
 *    tokoh kedua memeriksa buah asing berulang (mencium, melihat dekat), buah di semak habis satu per satu, matahari turun, baterai terkuras.
 *  D f7151–7464 "Karena itu, otak belajar menghemat energi dengan mencari cara yang lebih cepat dan lebih mudah." → layar terbelah: kiri si cepat (siang,
 *    baterai penuh, centang), kanan si lambat (senja, baterai rendah), otak + hemat energi di garis tengah.
 *  E f7479–7607 "Kebiasaan itu masih ada sampai hari ini." → belahan kiri melebar penuh, sapuan lampu kota (transisi Scene 01) → tokoh yang sama versi kini.
 *  F f7618–7852 "Kita memilih restoran dari panjang antreannya atau membeli barang dari rating-nya." → (4) dua restoran: ia menoleh ke yang sepi (papan menu
 *    diabaikan) lalu ikut antrean panjang · (5) hp besar: barang ★4,9 langsung + Keranjang.
 *  G f7873–8174 "Ini bukan sekadar soal malas. Ini adalah mode hemat energi dari otak." → (6) adegan kota MENGECIL jadi kartu restoran, kartu buah & rating
 *    pop di kiri-kanan, tiap kartu punya baris yang sama: lihat satu petunjuk → putuskan cepat → lanjut; ketiganya MENYATU jadi otak + hemat energi
 *    (= keadaan yang diambil alih Scene 04).
 */
/* ── WAKTU KATA (onset VO, frame global; dipindah dari Scene 03 lama yang dihapus 27 Okt) ── */
const W = urut(['kesalahan', 'pertama', 'mengambil', 'terlalu', 'cepat',
  'otak', 'kita', 'dua', 'persen', 'berat', 'menggunakan', 'seperlima', 'energi', 'beristirahat',
  'masa', 'makanan', 'habis', 'saja', 'berpikir', 'terlalu', 'lama', 'punya', 'biaya',
  'karena', 'otak', 'menghemat', 'energi', 'mencari', 'cara', 'cepat', 'mudah',
  'kebiasaan', 'hari', 'ini', 'memilih', 'restoran', 'panjang', 'antreannya', 'membeli', 'barang', 'rating-nya',
  'bukan', 'malas', 'ini', 'mode', 'hemat', 'energi', 'otak'], BATAS.s3 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  kesalahan: n(), pertama: n(), mengambil: n(), terlalu: n(), cepat: n(),
  otak: n(), kita: n(), dua: n(), persen: n(), berat: n(), menggunakan: n(), seperlima: n(), energi: n(), istirahat: n(),
  masa: n(), makanan: n(), habis: n(), saja: n(), berpikir: n(), terlalu2: n(), lama: n(), punya: n(), biaya: n(),
  karena: n(), otak2: n(), menghemat: n(), energi2: n(), mencari: n(), cara: n(), cepat2: n(), mudah: n(),
  kebiasaan: n(), hari: n(), ini: n(), memilih: n(), restoran: n(), panjang: n(), antre: n(), membeli: n(), barang: n(), rating: n(),
  bukan: n(), malas: n(), ini2: n(), mode: n(), hemat: n(), energi3: n(), otak3: n(),
};
export const S03_T = T;

/* ════════════════════════════ UMUM ════════════════════════════ */
type P2 = [number, number];
const S = 0.82; // layar penuh = ukuran tokoh Scene 01
const F0 = BATAS.s3;
const NS = 2100;
const laju = (r: number, s: number) => (panjangT(r) * s) / lerp(JALAN_FRAME, LARI_FRAME, r);
const FASE = (urutan: number) => -(urutan * 9 + 1) / JALAN_FRAME;
const gerak = (a: (f: number) => number, x0 = 0, psi0 = FASE(0), s = S) =>
  simulasi(NS, (k) => a(F0 + k) * laju(0, s), () => 0, s, x0, psi0, panjangT);
const di = (j: Jejak, f: number) => ambil(j, f - F0);
const akarY = (p: Pose, s = S, tanah = TANAH_LAYAR) => tanah - (alasTerendah(p) + (p.angkat ?? 0)) * s;
const keLayar = (x: number, p: Pose, q: P2, s = S, tanah = TANAH_LAYAR): P2 => [x + q[0] * s, akarY(p, s, tanah) + q[1] * s];
const keRig = (x: number, p: Pose, w: P2, s = S): P2 => [(w[0] - x) / s, (w[1] - akarY(p, s)) / s];
const lin = (f: number, a: number, b: number) => R(f, a, b, 0, 1, (x) => x);
/** benda `jalan` (sim) dengan x0 digeser supaya berhenti TEPAT di `xHenti` saat frame `fHenti` */
const geserX0 = (a: (f: number) => number, xHenti: number, fHenti: number, psi0 = FASE(0), s = S) => {
  const coba = gerak(a, 0, psi0, s);
  return gerak(a, xHenti - di(coba, fHenti).x, psi0, s);
};
const kepalaLayar = (x: number, p: Pose, s = S, tanah = TANAH_LAYAR) => keLayar(x, p, titikKepala(p), s, tanah);

/** BATERAI (energi): pil putih bergaris + baterai yang isinya berwarna (hijau → oranye → merah, tint mengikuti isi) */
export const Baterai: React.FC<{ x: number; y: number; isi: number; p: number; k?: number }> = ({ x, y, isi, p, k = 1 }) => {
  if (p <= 0) return null;
  const w = 74 * k, h = 38 * k, warna = isi > 0.5 ? mixHex(ARAH.naik, B.orange, (1 - isi) / 0.5) : mixHex(B.orange, ARAH.turun, (0.5 - isi) / 0.5);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w + 44 * k, height: h + 30 * k, borderRadius: 999, background: B.white, border: `${SISI}px solid ${warna}`,
      boxSizing: 'border-box', transformOrigin: 'center', transform: `translate3d(${x - (w + 44 * k) / 2}px, ${y - (h + 30 * k) / 2}px, 0) scale(${skalaPop(p)})`,
      boxShadow: bayanganDengan(warna, 1), display: 'grid', placeItems: 'center' }}>
      <svg width={w + 10 * k} height={h} viewBox={`0 0 ${w + 10 * k} ${h}`}>
        <rect x={2 * k} y={2 * k} width={w - 4 * k} height={h - 4 * k} rx={8 * k} fill="none" stroke={B.night} strokeWidth={4 * k} />
        <rect x={w} y={h * 0.3} width={7 * k} height={h * 0.4} rx={2.5 * k} fill={B.night} />
        <rect x={7 * k} y={7 * k} width={Math.max(0, (w - 14 * k) * isi)} height={h - 14 * k} rx={4 * k} fill={warna} />
      </svg>
    </div>);
};
/** semak berbuah (semak-a Hutan.svg) — `buah` = posisi buah layar & kemunculannya */
export const SEMAK = { w: 196, h: 128 };
export const SemakBuah: React.FC<{ x: number; k: number; alas: number; buah: { x: number; y: number; p: number; warna?: string }[]; alfa?: number }> = ({ x, k, alas, buah, alfa = 1 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: alfa < 1 ? alfa : undefined }}>
    <Img src={staticFile('flat/s02/semak-a.svg')} style={{ position: 'absolute', left: x - (SEMAK.w * k) / 2, top: alas - SEMAK.h * k, width: SEMAK.w * k, height: SEMAK.h * k,
      maxWidth: 'none' }} />
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {buah.map((b, j) => b.p > 0 ? <g key={j} transform={`translate(${b.x} ${b.y}) scale(${skalaPop(b.p)})`}><Buah r={24} warna={b.warna} /></g> : null)}
    </svg>
  </div>);
/** BUAH ASING (belum dikenal): bulat HIJAU BERDURI seperti durian/rambutan (Simon 27 Okt: "Ganti buah asing jadi buah hijau berduri (seperti durian/rambutan),
 * bukan ungu") — palet hijau Hutan.svg, duri rapat dua lapis, tangkai cokelat (satuan lokal, pusat 0,0) */
const HIJAU_BUAH = { duri: '#5E7030', kulit: '#869C4E', terang: '#B8B95D', tangkai: '#4C3B2D' };
const BuahAsing: React.FC<{ r?: number }> = ({ r = 30 }) => (
  <g>
    {Array.from({ length: 16 }, (_, k) => {
      const a = (k / 16) * Math.PI * 2;
      return <path key={k} d={`M ${Math.cos(a - 0.17) * r * 0.92} ${Math.sin(a - 0.17) * r * 0.92} L ${Math.cos(a) * r * 1.32} ${Math.sin(a) * r * 1.32} L ${Math.cos(a + 0.17) * r * 0.92} ${Math.sin(a + 0.17) * r * 0.92} Z`}
        fill={HIJAU_BUAH.duri} />;
    })}
    <circle r={r} fill={HIJAU_BUAH.kulit} />
    {/* duri kecil di permukaan kulit */}
    {Array.from({ length: 9 }, (_, k) => {
      const a = k * 2.4, rr = r * (0.35 + 0.5 * ((k * 37) % 10) / 10), x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      return <path key={k} d={`M ${x - r * 0.09} ${y + r * 0.07} L ${x} ${y - r * 0.14} L ${x + r * 0.09} ${y + r * 0.07} Z`} fill={HIJAU_BUAH.duri} opacity={0.75} />;
    })}
    <ellipse cx={-r * 0.32} cy={-r * 0.34} rx={r * 0.22} ry={r * 0.3} fill={HIJAU_BUAH.terang} opacity={0.6} />
    <path d={`M 0 ${-r * 0.95} q ${r * 0.1} ${-r * 0.45} ${r * 0.42} ${-r * 0.55}`} stroke={HIJAU_BUAH.tangkai} strokeWidth={r * 0.16} fill="none" strokeLinecap="round" />
  </g>);
/** masker lingkaran (transform, bukan clip-path): lingkaran berpusat (cx, cy) bergaris tengah d — isi = layar penuh (koordinat layar) */
export const MaskerBulat: React.FC<{ cx: number; cy: number; d: number; tepi?: number; warnaTepi?: string; putih?: number; children: React.ReactNode;
  /** warna lapisan `putih` (bawaan putih) — S09 28 Okt: adegan pantai mengecil jadi lingkaran turkis foto kamu */ warnaPutih?: string }> =
  ({ cx, cy, d, tepi = 0, warnaTepi = B.blue, putih = 0, children, warnaPutih = B.white }) => {
    const D = 2400, s = d / D;
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: D, height: D, borderRadius: '50%', overflow: 'hidden', background: B.white, transformOrigin: 'center',
        transform: `translate3d(${cx - D / 2}px, ${cy - D / 2}px, 0) scale(${s})` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
          transform: `translate(${D / 2}px, ${D / 2}px) scale(${1 / s}) translate(${-cx}px, ${-cy}px)` }}>{children}</div>
        {putih > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: warnaPutih, opacity: putih }} /> : null}
        {tepi > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${tepi / s}px solid ${warnaTepi}`, boxSizing: 'border-box' }} /> : null}
      </div>);
  };
/** wadah geser (masker persegi tanpa clip-path per frame): hanya rentang x [x0, x1] layar yang terlihat */
export const Belah: React.FC<{ x0: number; x1: number; children: React.ReactNode }> = ({ x0, x1, children }) => x1 - x0 <= 0 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: x1 - x0, height: 1080, overflow: 'hidden', transform: `translate3d(${x0}px, 0, 0)` }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${-x0}px, 0, 0)` }}>{children}</div>
  </div>);

/* ════════════════════════════ A · BUAH YANG DIKENAL ════════════════════════════
 * Tokoh dulu berjalan (72 f) ke semak berbuah, berhenti, MELIRIK sekilas (kepala menunduk 9 f), tangan dekat meraih buah (IK ke buah), menariknya ke
 * genggaman, lalu melangkah lagi. Kamera diam. */
const tA = { henti: T.mengambil + 12, lirik: T.mengambil + 16, raih: T.terlalu - 10, ambil: T.terlalu + 2, tarik: T.cepat, lanjut: T.cepat + 6, henti2: T.otak + 4 };
const SEMAK_A = { x: 1010, k: 2.1, alas: TANAH_LAYAR + 6 };
const BUAH_A: P2[] = [[962, 652], [1050, 626], [1098, 698]];
const aA = (henti2: boolean) => (f: number) => 1 - cin(f, tA.henti, 24) + cin(f, tA.lanjut, 30) - (henti2 ? cin(f, tA.henti2, 30) : 0);
/** sesudah mengambil buah ia TERUS berjalan menembus transisi ke siluet (Simon 27 Okt: "saat transisi paralax atau apapun jangan hentikan gerakan charnya") */
const UA = geserX0(aA(false), 905, tA.henti + 20);
/** pose A pada waktu (sim) f — dipakai juga ulangan di belahan kiri D (`lanjut` = tetap berjalan) */
const poseA = (j: Jejak, f: number) => {
  const a = di(j, f);
  let p = gayaT(a.psi, 0, a.a);
  const raih = cin(f, tA.raih, 24) * (1 - cin(f, tA.tarik, 24));
  const bawa = cin(f, tA.tarik, 24);
  if (raih > 0) p = campurPose(p, ikLengan(p, 0, keRig(a.x, p, BUAH_A[0]), -30), raih);
  if (bawa > 0) p = campurPose(p, PEGANG_DEKAT(p), bawa);
  const lirik = Math.sin(Math.PI * lin(f, tA.lirik - 4, tA.lirik + 22)) ** 2;
  return { a, p: { ...p, kepala: p.kepala + 9 * lirik } as Pose, dipegang: f >= tA.ambil };
};
const AdeganA: React.FC<{ f: number; j: Jejak; geserX?: number; buahAlfa?: number }> = ({ f, j, geserX = 0, buahAlfa = 1 }) => {
  const { a, p, dipegang } = poseA(j, f);
  const buah = BUAH_A.map(([x, y], k) => ({ x: x + geserX, y, p: k === 0 && dipegang ? 0 : 1 }));
  return (
    <>
      <HutanLayar kamX={960 - geserX} C={-2300} lapis="belakang" />
      <SemakBuah x={SEMAK_A.x + geserX} k={SEMAK_A.k} alas={SEMAK_A.alas} buah={buah} />
      <TokohTegakLapis x={a.x + geserX} tanah={TANAH_LAYAR} s={S} pose={p} kostum="dulu"
        pegang={dipegang && buahAlfa > 0 ? <g opacity={buahAlfa < 1 ? buahAlfa : undefined}><Genggam p={p} miring={0}><Buah r={24 / S} /></Genggam></g> : null} />
      <HutanLayar kamX={960 - geserX} C={-2300} lapis="depan" />
    </>);
};

/* ════════════════════════════ B · PAPAN ANATOMI 2 % / 20 % ════════════════════════════
 * Simon 27 Okt sore: "Ganti pose orang ketika siluet, buat tegak menghadap depan (cek screenshoot, aku mau secara layout seperti itu)" (screenshot =
 * papan organ tubuh: badan di tengah, lingkaran organ di sekelilingnya dengan garis penunjuk) + "Cek video TA ada transisi yang menggunakan shape
 * lingkaran … untuk transisi dari adegan alam ke anatomi tubuh" (= BreakSweep ST-02: tiga cakram dari tengah layar — turkis, turkis muda, lalu cakram
 * berisi papan baru; tiap cakram r 0 → 2100 dalam 60 f inOut cubic, selang 3 f; adegan lama tetap berjalan di bawahnya).
 * Dulu: tokoh 3/4 berjalan berubah jadi siluet (tint) lalu dibekukan dan menepi. Kini: SILUET TEGAK MENGHADAP DEPAN di tengah (otak tergambar di kepala)
 * · lingkaran OTAK di kiri-atas bergaris ke kepala (lingkaran ini yang nanti membuka jadi adegan C) · kartu "2 % berat tubuh" kiri-bawah bergaris ke
 * badan · kartu "≈20 % energi saat beristirahat" kanan bergaris ke kepala. Garis = putus-putus trim (Penghubung). */
const SIL = { warna: mixHex(B.blue, B.white, 0.42) };
// papan anatomi TETAP LENGKAP (siluet, lingkaran otak, kartu, garis) sampai tertutup dua lingkaran transisi ke C — Simon 28 Okt: "ketika lingkaran transisi
// muncul visualnya masih lengkap, bukan dihilangkan lalu mulai transisi" (dulu kartu & garis keluar dulu di T.masa − 70). `keluar` = sesudah tertutup.
const tB = { cakram: T.otak - 14, otakP: T.otak + 28, kartu1: T.dua + 15, kartu2: T.seperlima + 15, keluar: T.masa + 90, buka: T.masa };
/** tiga cakram: pusat tengah layar; cakram 3 menutup layar (r ≥ 1101) ±31 f sesudah mulainya */
const CAKRAM = { x: 960, y: 540, r: 2100, selang: 3 };
const rCakram = (f: number, k: number) => CAKRAM.r * cin(f, tB.cakram + k * CAKRAM.selang + 30);
const CAKRAM_PENUH = tB.cakram + 2 * CAKRAM.selang + 60;
/** SILUET ANATOMI = berkas Simon `23219 [Converted].svg` (folder episode, 27 Okt 17.45: "ini untuk anatomi tubuhnya") — tubuh tampak depan PERTAMA
 * (path 1 dari 2, kotak ±31–184 × 14–436), satu warna, TANPA organ. Diskalakan 1,493 → puncak kepala y 240, telapak y 870 (di atas pita subtitle),
 * pusat x 960. (Trace manual 17.30 diganti berkas ini.) */
// Simon 30 Okt (audit pusat, ukur piksel): papan dulu y 235–870 (pusat 552) → seluruh papan naik 55 px = 180–815, pusat 497
const NAIK_B = -55;
const SIL_K = 1.493, SIL_X0 = 960 - 107.5 * SIL_K, SIL_Y0 = 240 + NAIK_B - 14 * SIL_K;
const silL = (x: number, y: number): P2 => [SIL_X0 + x * SIL_K, SIL_Y0 + y * SIL_K];
const SILUET_D = `M183.8,249.76c-0.25-2.98,0.02-6.39-2.49-10.27c-1.6-2.47-3.74-8.17-4.76-9.09 c-1.02-0.92-0.73-9.41-0.73-14.28c0-4.5,1.27-12.88,0-21.88c-1.27-9-1.77-20.75-2.16-24.08c-0.39-3.33-0.7-20.88-2.04-30.24 c-1.34-9.35-6.83-33.93-6.83-33.93l-0.18,0.15c-0.95-7.35-3.59-13.45-12.02-16.64c-1.68-0.59-5.57-1.46-7.2-2.28 c-9.41-4.78-18.23-8.4-25.96-9.93c-0.07-2.03,0.08-6.29,0.12-8.09c3.37-1.9,5.45-14.62,5.56-15.62c1.79,0.17,3.98-1.62,5.29-5.03 c0.61-1.59,0.96-4.24-0.21-5.71c-0.33-0.42-0.77-0.96-2.15-0.21c0.79-3.5,1.29-12.25-1.77-17.31c-3.06-5.06-7.23-11.05-18.66-11.04 c-3.18,0-9.08,1.03-12.82,3.6c-6.46,4.44-6.89,8.39-8.38,14.25c-1,3.96,0.15,9.13,0.25,9.62c-1.38,0-1.93,0.58-2.2,1.13 c-1.23,2.42,0.61,8.48,2.35,10.23c0.73,0.73,1.88,1.11,2.81,0.68c-0.09,1.96,1.03,12.58,5.25,14.37c0.26,2.56,0.28,7.38,0.31,8.68 c-3.77,1.55-11.02,4.34-14.65,6.38c-2.18,0.99-4.24,2.25-6.29,3.47c-2.82,1.68-6.21,1.91-9.45,2.99c-3.65,1.22-7.68,3.28-10.29,6.1 c-2.76,2.98-5.22,6.99-5.81,15.71c0,0-3.39,18.82-4.73,28.18s-1.65,26.91-2.04,30.24c-0.39,3.33-0.89,15.08-2.16,24.08 c-1.27,9,0,17.38,0,21.88c0,4.87,0.29,13.36-0.73,14.28c-1.02,0.92-3.16,6.62-4.76,9.09c-2.51,3.88-2.24,7.29-2.49,10.27 c-0.25,2.98,2.08,3.45,3.66,1.34c1.59-2.11,4.71-9.48,4.71-9.48s0.67,6.23,0.52,10.05c-0.14,3.82,0.52,12.92,2.33,13.82 c2.27,1.13,2.98-0.98,2.98-0.98s0.64,2.1,3.05,1.48c1.45-0.37,2.14-4.16,2.14-4.16s1.17,1.36,2.49,1.03 c1.67-0.41,1.12-3.62,1.12-3.62s1.59,0,2.77-1.53c0.9-1.16,1.22-4.19,1.47-6.62c0.25-2.43-0.29-14.16-1.51-17.21 c-1.4-3.49-3.47-4.61-3.84-6.45c-0.7-3.48,0.63-8.35,1.67-13.94c1.51-8.11,3.23-15,3.69-18c1.14-7.54,2.13-18.95,2.83-22.41 c1.17-5.75,3.23-21.51,3.98-36.03c0.19-3.68,0.4-6.51,0.6-8.63c0.51,1.35,1.32,3.55,3.41,7.98c0.72,8.15,1.91,19.58,3.54,28.59 c1.23,6.81,2.27,11.85,1.07,18.6c-1.2,6.75-4.95,16.73-6.6,27.1c-2.79,17.45-3.57,25.89,0.51,53.82 c1.88,12.87,4.57,23.48,5.02,27.48s0.17,15.62,0,18.95c-1.26,24.08-1.84,32.05,0,51.05c1.84,19,6.58,31.25,5.63,42.43 c-0.15,1.82-2.83,4.32-2.96,9.07c-0.14,4.91-3.02,9.5-1.9,14.71c-0.24,2.99,1.37,6.38,3.81,4.76c0.53,1.62,2.96,2.21,3.71,1 c0.52,1.21,2.95,3.04,4.22,1.21c0.21,1.03,2.89,1.75,4.12,0c2.13,2,5.29,1.06,6.46-2.47c0.52-1.55,2.86-2.72,2.3-5.73 c-0.97-5.23-1.4-8.86-2.03-13.06c-0.5-3.34-2.67-5.13-1.45-7.9c1.22-2.77,1.82-4.6,0.97-8.27c-0.49-2.14,2.84-39.62,3.73-45.5 c2.27-15,0.6-23.15-0.73-28.75c-1.25-5.25,0.04-8.92,0.75-17.99c0.55-7.06-0.57-15.35-0.89-17.68c-0.74-5.33,5.14-37.82,5.14-55.73 c0-2.98,1.48-1.7,3.02-1.7c3.06,0,3.02-1.62,3.02,1.27c0,16.72,6.29,50.83,5.55,56.16c-0.33,2.33-1.45,10.62-0.89,17.68 c0.71,9.06,2,12.74,0.75,17.99c-1.33,5.6-3,13.75-0.73,28.75c0.89,5.88,4.23,43.36,3.73,45.5c-0.85,3.67-0.25,5.5,0.97,8.27 c1.22,2.77-0.95,4.55-1.45,7.9c-0.63,4.19-1.06,7.83-2.03,13.06c-0.56,3.01,1.78,4.18,2.3,5.73c1.17,3.53,4.34,4.47,6.46,2.47 c1.24,1.75,3.92,1.03,4.12,0c1.27,1.82,3.7,0,4.22-1.21c0.75,1.21,3.18,0.63,3.71-1c2.43,1.62,4.05-1.78,3.81-4.76 c1.12-5.21-1.76-9.8-1.9-14.71c-0.13-4.75-2.81-7.25-2.96-9.07c-0.95-11.18,3.79-23.43,5.63-42.43c1.84-19,1.26-26.97,0-51.05 c-0.17-3.33-0.45-14.95,0-18.95c0.44-4,3.14-14.61,5.02-27.48c4.09-27.93,3.3-36.37,0.51-53.82c-1.66-10.37-5.4-20.35-6.6-27.1 c-1.2-6.75-0.16-11.79,1.07-18.6c1.83-10.14,3.11-23.37,3.79-31.51c1.07-1.89,2.15-3.73,3.29-5.53c0.42,2.57,0.82,5.74,1,9.35 c0.75,14.52,2.81,30.29,3.98,36.03c0.7,3.46,1.7,14.87,2.83,22.41c0.45,3,2.18,9.89,3.69,18c1.04,5.59,2.37,10.46,1.67,13.94 c-0.37,1.84-2.44,2.96-3.84,6.45c-1.22,3.05-1.76,14.78-1.51,17.21s0.57,5.46,1.47,6.62c1.18,1.53,2.77,1.53,2.77,1.53 s-0.55,3.21,1.12,3.62c1.32,0.33,2.49-1.03,2.49-1.03s0.69,3.79,2.14,4.16c2.42,0.62,3.05-1.48,3.05-1.48s0.71,2.12,2.98,0.98 c1.81-0.9,2.48-10,2.33-13.82c-0.14-3.82,0.52-10.05,0.52-10.05s3.12,7.37,4.71,9.48C181.73,253.21,184.05,252.74,183.8,249.76z`;
const OTAK_B = { x: 690, y: 300 + NAIK_B, d: 130 };
/** kartu menjauh dari lengan & bahu siluet baru: kartu 1 kiri-bawah (tepi kanan 740 < lengan 765), kartu 2 kanan-atas (tepi kiri 1170 > bahu 1115) */
// pusat-x SIMETRIS terhadap siluet (960 ± 495; Simon 28 Okt "cek alignment" — dulu 460 / 1450, selisih 10 px)
const KARTU_B = { w: 560, h: 178, pos: [[465, 640 + NAIK_B], [1455, 380 + NAIK_B]] as P2[] };
const DATA_B = [
  { ikon: 'beratKg' as const, warna: B.blue, nilai: 2, awalan: '', label: 'berat tubuh', at: tB.kartu1, ujung: silL(88, 200) },
  { ikon: 'energiTubuh' as const, warna: B.turq, nilai: 20, awalan: '≈', label: 'energi saat beristirahat', at: tB.kartu2, ujung: silL(133, 50) },
];
const SiluetDepan: React.FC = () => (
  <TepiSubtitle>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <path d={SILUET_D} fill={SIL.warna} transform={`translate(${SIL_X0.toFixed(2)} ${SIL_Y0.toFixed(2)}) scale(${SIL_K})`} />
    </svg>
  </TepiSubtitle>);
const KartuData: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const d = DATA_B[k], p = popIn(f, d.at) * popOut(f, tB.keluar + 8 * k);
  const jalan = cin(f, d.at + 20, 60);
  const nilai = Math.round(d.nilai * jalan);
  const [x, y] = KARTU_B.pos[k];
  return (
    <Kaca x={x} y={y} w={KARTU_B.w} h={KARTU_B.h} p={p} warna={d.warna} tab="kiri">
      <Bulat x={92} y={KARTU_B.h / 2} d={104} warna={d.warna} ikon={d.ikon} p={1} />
      {/* angka di atas, label di bawahnya (dulu sebaris: "energi saat beristirahat" melewati tepi kartu, still f6650) */}
      <div style={{ position: 'absolute', left: 170, top: 14, fontFamily: F, fontSize: 60, fontWeight: 800, color: B.night, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>
        {d.awalan}{nilai}%</div>
      <div style={{ position: 'absolute', left: 172, top: 90, fontFamily: F, fontSize: 28, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>{d.label}</div>
      <div style={{ position: 'absolute', left: 170, top: 138, width: 340, height: 16, borderRadius: 8, background: B.grayLite, opacity: 0.6 }} />
      <div style={{ position: 'absolute', left: 170, top: 138, width: Math.max(16 * Math.min(1, jalan * 4), 340 * (d.nilai / 100) * jalan), height: 16, borderRadius: 8,
        background: d.warna }} />
    </Kaca>);
};
/** papan anatomi B (koordinat layar) — dipakai di dalam cakram ke-3 dan sesudahnya */
const PapanB: React.FC<{ f: number }> = ({ f }) => {
  const otakP = popIn(f, tB.otakP);
  const garis = (at: number, k: number) => cin(f, at + 20) * (1 - cin(f, tB.keluar + 8 * k - 10));
  return (
    <>
      <SiluetDepan />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d={`M ${OTAK_B.x + OTAK_B.d / 2 + 6} ${OTAK_B.y} L ${silL(81, 52)[0]} ${silL(81, 52)[1]}`} g={garis(tB.otakP + 10, 0)} warna={B.blue} titik={false} />
        {DATA_B.map((d, k) => {
          const [x, y] = KARTU_B.pos[k], x0 = k === 0 ? x + KARTU_B.w / 2 + 6 : x - KARTU_B.w / 2 - 6;
          return <Penghubung key={k} d={`M ${x0} ${y} L ${d.ujung[0]} ${d.ujung[1]}`} g={garis(d.at, k)} warna={d.warna} titik={false} />;
        })}
      </svg>
      {otakP > 0 ? (
        <>
          <Pendar x={OTAK_B.x} y={OTAK_B.y} d={OTAK_B.d} s={1} warna={B.blue} skala={skalaPop(otakP)} />
          <Bulat x={OTAK_B.x} y={OTAK_B.y} d={OTAK_B.d} warna={B.blue} ikon="otak" p={otakP} />
        </>) : null}
      {[0, 1].map((k) => <KartuData key={k} f={f} k={k} />)}
    </>);
};

/* ════════════════════════════ C · BUAH ASING, MATAHARI TURUN ════════════════════════════ */
const RUPA_C = KEL_RUPA[0]; // keriting (tunik oranye) — tokoh kedua
const S_C = 0.82;
/** Simon 28 Okt ("Ya, rapikan komposisi senja S03 … supaya kelompok tokoh + semak berada di tengah frame"): tokoh (tinta x 705–880) + semak (1175–1585)
 *  dulu berpusat x 1145 → kelompok digeser −185 (520–1400, pusat 960). Matahari & latar tetap. */
const GESER_C = -185;
const X_C = 760 + GESER_C;
const SEMAK_C = { x: 1380 + GESER_C, k: 2.1, alas: TANAH_LAYAR + 6 };
const BUAH_C: P2[] = [[1330, 652], [1420, 626], [1468, 698]].map(([x, y]) => [x + GESER_C, y] as P2);
const tC = { habis: [T.habis, T.habis + 20, T.saja + 2], tanya: T.berpikir, tanyaKeluar: T.lama + 6, baterai: T.punya + 22, kuras: [T.punya + 22, T.biaya + 62] as P2 };
const isiBateraiC = (f: number) => lerp(0.8, 0.15, cin(f, (tC.kuras[0] + tC.kuras[1]) / 2, tC.kuras[1] - tC.kuras[0]));
/** urutan gerak memeriksa (sasaran tangan dekat relatif kepala, satuan rig): 0 dada (genggam) · 1 mencium · 3 melihat dekat (didekatkan ke mata).
 * Simon 27 Okt sore: "Kenapa buah yang ditangan itu berputar?, apa maksud dari putaran itu?" → putaran 360° di dada (maksudnya membolak-balik buah asing)
 * DIHAPUS; diganti buah didekatkan ke mata ("Ok") — mencium → dilihat dekat → "?" → dilihat dekat lagi → mencium → kembali ke dada. */
const GESTUR_C: [number, 0 | 1 | 3][] = [[T.masa + 18, 0], [T.makanan + 14, 1], [T.habis + 22, 3], [T.berpikir + 4, 3], [T.lama + 14, 3], [T.punya - 18, 1], [T.biaya + 22, 0]];
const poseC = (f: number) => {
  const dada = PEGANG_DEKAT(BERDIRI, -8);
  const kp = titikKepala(dada);
  const sasaran = (g: 0 | 1 | 3): Pose | null => g === 0 ? null
    : ikLengan(dada, 0, g === 1 ? [kp[0] + 34, kp[1] + 30] : [kp[0] + 118, kp[1] + 34], g === 1 ? -70 : -40);
  let p = dada, kep = 0;
  for (let k = 0; k < GESTUR_C.length; k++) {
    const [t, g] = GESTUR_C[k], u = cin(f, t, 30);
    if (u <= 0) break;
    const q = sasaran(g) ?? dada;
    p = campurPose(p, q, u);
    kep = lerp(kep, g === 1 ? 10 : g === 3 ? 7 : 3, u);
  }
  const napas = Math.sin((2 * Math.PI * f) / 200);
  return { ...p, badan: p.badan + 0.6 * napas, kepala: p.kepala + kep } as Pose;
};
const senja = (f: number) => cin(f, (T.masa + T.biaya) / 2, T.biaya - T.masa + 40);
const AdeganC: React.FC<{ f: number; geserX?: number; tampilBaterai?: boolean }> = ({ f, geserX = 0 }) => {
  const p = poseC(f);
  const sj = senja(f);
  const buah = BUAH_C.map(([x, y], k) => ({ x: x + geserX, y, p: popOut(f, tC.habis[k]) }));
  const matahari: P2 = [1640 + geserX, lerp(250, 760, sj)];
  return (
    <>
      {/* matahari turun DI BELAKANG lapisan cakrawala (Simon 27 Okt: "masking matahari kurang pas, seharusnya maskingnya sampai menyatu ke tanah") —
        dulu dipotong garis datar y 652 di atas pita tanah jauh; kini tertutup tanah, pohon & batu cakrawala Hutan.svg sendiri */}
      <HutanLayar kamX={960 - geserX} C={-3000} lapis="belakang" sisip={
        <div style={{ position: 'absolute', left: matahari[0] - 70, top: matahari[1] - 70, width: 140, height: 140, borderRadius: '50%',
          background: mixHex('#F8B62A', '#EF7903', sj), boxShadow: `0 0 60px 20px ${rgba(mixHex('#F8B62A', '#EF7903', sj), 0.45)}` }} />} />
      <SemakBuah x={SEMAK_C.x + geserX} k={SEMAK_C.k} alas={SEMAK_C.alas} buah={buah} />
      <TokohTegakLapis x={X_C + geserX} tanah={TANAH_LAYAR} s={S_C} pose={p} kostum="dulu" warna={RUPA_C.warna} kepala={RUPA_C.kepala}
        pegang={<Genggam p={p} miring={0}><BuahAsing r={30} /></Genggam>} />
      <HutanLayar kamX={960 - geserX} C={-3000} lapis="depan" />
      {/* senja: lapisan warna multiply (ungu di atas, jingga di bawah) */}
      {sj > 0 ? <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.55 * sj,
        background: `linear-gradient(to bottom, ${mixHex(B.blue, B.white, 0.35)} 0%, ${mixHex('#EF9A03', B.white, 0.35)} 70%, ${mixHex('#EF9A03', B.white, 0.55)} 100%)` }} /> : null}
    </>);
};
const kepalaC = (f: number, geserX = 0) => kepalaLayar(X_C + geserX, poseC(f), S_C);

/* ════════════════════════════ D · TERBELAH: CEPAT vs LAMBAT ════════════════════════════ */
const tD = { belah: T.karena + 20, otak: T.otak2, hemat: T.energi2, baterai: T.menghemat, cek: T.cepat2, lebar: T.kebiasaan + 21, keluarAtas: T.kebiasaan + 4 };
/** ulangan A di belahan kiri: gerak sama digeser Δ, sesudah mengambil ia TERUS berjalan — juga menembus sapuan lampu ke kota (tidak berhenti) */
const DELTA_D = tD.belah + 85 - tA.ambil;
/** simulasi ulangan dalam WAKTU A (dievaluasi di f − Δ) = UA (mengambil buah, lalu terus berjalan) */
const UD = UA;
/** kamera belahan kiri: diam (aksi di x layar 480) lalu mengikuti tokoh yang terus berjalan; sesudah melebar tokoh di tengah layar */
const geserKiri = (f: number) => {
  const xMan = di(UD, f - DELTA_D).x;
  const ikut = cin(f - DELTA_D, tA.lanjut + 20); // Simon 30 Okt (audit keyframe: selain karakter semua 60 f): kamera ikut 60 f (dulu 70 f)
  return lerp(480 - 955, 480 - xMan, ikut) + 480 * cin(f, tD.lebar);
};

/* ════════════════════════════ E–F · KOTA: RESTORAN & RATING ════════════════════════════ */
const LAMPU = { w: 51, h: 383, s: 3.3, tiang: 25.35, atas: -4 * 3.3 };
const SAPU_E = T.hari - 10;
export const C_KOTA = 960 - 2500 * KOTA.s * Z_KOTA; // panorama kota (tetap) — potongan tengah
/** UKURAN TOKO REALISTIS (Simon 27 Okt: "buat ukuran tokonya realistis, sekarang toko terlihat lebih rendah dari orang"). Acuan = tinggi tokoh ±408 px (≈1,7 m):
 * pintu 480 px (≈2,0 m, 1,18× orang) · ambang jendela 160 px dari tanah (≈0,7 m), tinggi jendela 290 · kanopi bawah ±520 px (≈2,2 m) · fasad sampai tepi atas
 * layar (lantai dasar ±3,6 m). Lebar toko ±5 m → kedua toko keluar tepi layar (sepi di kiri, ramai di kanan); papan nama di sisi dalam fasad (toko kanan
 * di bawah-kiri zona logo). Dulu 460 px seluruhnya: pintu 264 px = lebih pendek dari orang. */
export const RESTO = {
  // papan menu toko sepi berdiri di trotoar kanan toko (x 780), tidak menutup pintu
  sepi: { kiri: -140, kanan: 720, pintu: 545, jendela: [40, 380] as P2, warna: B.turq, papan: 600 },
  ramai: { kiri: 1240, kanan: 2060, pintu: 1790, jendela: [1290, 1620] as P2, warna: B.orange, papan: 1360 },
  pintu: { w: 210, h: 480 }, kanopi: { atas: 236, bawah: 340 }, jendela: { bawah: TANAH_LAYAR - 160, h: 290 },
};
/** tokoh adegan kota TURUN dari dasar toko ke depan, sampai dekat garis putih jalan panorama (y 926) — Simon 28 Okt: "dari ini turunkan charnya sedikit
 * (sampai mendekati garis putih)" (toko TETAP, dulu kaki tepat di garis dasar toko y 860 → tampak berdiri di dinding). Kaki di y 910 — tokoh yang
 * BERJALAN juga, sejak muncul di adegan kota (Simon 28 Okt: "char yg berjalan ini seharusnya ikut turun seperti char yg berbaris"; dulu turun bertahap
 * sesudah sapuan lampu → masih 50 px lebih tinggi saat lewat di depan toko). */
const TURUN_KOTA = 50;
/** antrean (menghadap pintu restoran ramai di kanan): 4 orang + tokoh di ujung */
const ANTRE_X = [1560, 1442, 1324, 1206];
const RUPA_ANTRE: { kepala: Kepala; warna: { tunik: string; totol: string } }[] = [
  { kepala: KEL_RUPA[1].kepala, warna: KEL_RUPA[1].warna }, { kepala: KEL_RUPA[2].kepala, warna: KEL_RUPA[2].warna },
  { kepala: KEL_RUPA[0].kepala, warna: KEL_RUPA[0].warna }, { kepala: { set: 'wanita', eks: 'netral' }, warna: KEL_RUPA[1].warna }];
const tF = { toleh: T.memilih - 4, tolehBalik: T.panjang - 6, jalan: T.antre + 4, henti: T.antre + 30, hp: T.membeli - 26, hpBesar: T.membeli, ketuk: T.rating + 8,
  keranjang: T.rating + 26, hpKeluar: T.bukan - 6 };
/** tokoh kota MELANJUTKAN langkah tokoh dulu dari sapuan lampu (fase langkah sama), lewat di depan restoran sepi sambil menoleh, lalu berhenti di ujung
 * antrean dan mengangkat hp dengan pose MAIN HP semula (tangan jauh menggenggam hp, tangan dekat mengetuk — Simon: "kok ini orangnya berubah pose?").
 * Kamera mengikuti (tokoh di x layar 960), lalu mengendap ke susunan akhir saat ia melambat. */
const XF_HENTI = ANTRE_X[3] - 118;
const aF = (f: number) => 1 - cin(f, tF.henti, 36);
const UF = (() => {
  const coba = gerak(aF, 0, 0);
  const psi0 = di(UD, SAPU_E - DELTA_D).psi - di(coba, SAPU_E).psi;
  return geserX0(aF, XF_HENTI, tF.henti + 30, psi0);
})();
/** kamera kota: geser dunia (0 = susunan akhir) — tokoh tetap di x layar 960 sampai melambat, lalu mengendap ke x akhirnya */
// kamera mengendap 60 f (audit 28 Okt: dulu 100 f — aturan transisi kamera maks 60 f)
const kamKota = (f: number) => di(UF, f).x - lerp(960, XF_HENTI, cin(f, tF.henti - 20));
/** papan nama toko RAMAI (ikon warung) pop di tempatnya BEGITU sudah lewat kiri zona logo (x layar ≤ 1440) — dulu terlukis sejak toko masuk dari kanan
 * sehingga lewat di bawah logo Tuntun selama kamera bergeser (audit f7620–7680, KENA-LOGO) */
const T_PAPAN_RAMAI = (() => {
  for (let f = BATAS.s3; f < BATAS.s4; f++) if (RESTO.ramai.papan - kamKota(f) <= 1440) return f + 30;
  return BATAS.s3;
})();
const poseF = (f: number): Pose => {
  const a = di(UF, f);
  let p = gayaT(a.psi, 0, a.a);
  const hp = cin(f, tF.hp, 30) * (1 - cin(f, tF.hpKeluar + 10, 30));
  if (hp > 0) p = campurPose(p, { ...p, bahu: [LENGAN_MAIN_HP.atas[0], LENGAN_MAIN_HP.atas[1]],
    siku: [LENGAN_MAIN_HP.bawah[0] - LENGAN_MAIN_HP.atas[0], LENGAN_MAIN_HP.bawah[1] - LENGAN_MAIN_HP.atas[1]], tangan: [-10, 0] }, hp);
  const napas = Math.sin((2 * Math.PI * f) / 210) * (1 - a.a);
  return { ...p, badan: p.badan + 0.6 * napas, balik: f >= tF.toleh && f < tF.tolehBalik ? -1 : 1 };
};
/** fasad restoran datar (ukuran realistis): badan sampai tepi atas, list atas berwarna, papan nama (ikon warung), kanopi bergaris, jendela besar & pintu;
 * `menu` = papan menu berdiri di trotoar (toko sepi) */
export const Restoran: React.FC<{ kiri: number; kanan: number; pintu: number; jendela: P2; warna: string; papan: number; menu?: boolean; papanP?: number }> =
  ({ kiri, kanan, pintu, jendela, warna, papan, menu, papanP = 1 }) => {
    const w = kanan - kiri, R = RESTO, gelap = mixHex(warna, B.night, 0.25);
    const nGaris = Math.round(w / 64), lg = (w + 40) / nGaris;
    const jx0 = jendela[0], jw = jendela[1] - jendela[0], jy0 = R.jendela.bawah - R.jendela.h;
    return (
      <>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <rect x={kiri} y={-20} width={w} height={TANAH_LAYAR + 20} fill={mixHex(warna, B.white, 0.86)} />
          <rect x={kiri} y={-20} width={w} height={70} fill={warna} />
          {/* kanopi bergaris */}
          {Array.from({ length: nGaris }, (_, k) => (
            <path key={k} d={`M ${kiri - 20 + lg * k} ${R.kanopi.atas} h ${lg} v ${R.kanopi.bawah - R.kanopi.atas - 24} a ${lg / 2} 24 0 0 1 ${-lg} 0 Z`}
              fill={k % 2 ? B.white : warna} />))}
          <rect x={kiri - 20} y={R.kanopi.atas - 16} width={w + 40} height={18} rx={5} fill={gelap} />
          {/* jendela besar */}
          <rect x={jx0} y={jy0} width={jw} height={R.jendela.h} rx={14} fill={mixHex(B.turqWash, B.white, 0.2)} stroke={gelap} strokeWidth={8} />
          <line x1={jx0 + jw / 2} x2={jx0 + jw / 2} y1={jy0} y2={jy0 + R.jendela.h} stroke={gelap} strokeWidth={7} />
          <rect x={jx0 - 10} y={R.jendela.bawah - 4} width={jw + 20} height={14} rx={4} fill={gelap} />
          {/* pintu */}
          <rect x={pintu - R.pintu.w / 2} y={TANAH_LAYAR - R.pintu.h} width={R.pintu.w} height={R.pintu.h} rx={12} fill={mixHex(warna, B.night, 0.35)} />
          <rect x={pintu - R.pintu.w / 2 + 26} y={TANAH_LAYAR - R.pintu.h + 30} width={R.pintu.w - 52} height={150} rx={8} fill={mixHex(B.turqWash, B.white, 0.2)} opacity={0.85} />
          <circle cx={pintu + R.pintu.w / 2 - 28} cy={TANAH_LAYAR - R.pintu.h / 2 + 20} r={9} fill={B.white} />
          {menu ? (
            <g transform={`translate(${kanan + 60} ${TANAH_LAYAR})`}>
              <path d="M -52 0 L -26 -200 L 26 -200 L 52 0" fill="none" stroke={B.night} strokeWidth={10} strokeLinejoin="round" />
              <rect x={-60} y={-200} width={120} height={146} rx={12} fill={B.night} />
              {[0, 1, 2, 3, 4].map((r) => <line key={r} x1={-40} x2={r % 2 ? 18 : 38} y1={-172 + r * 24} y2={-172 + r * 24} stroke={B.white} strokeWidth={7} strokeLinecap="round" />)}
            </g>) : null}
        </svg>
        {/* papan nama: lingkaran putih + ikon warung */}
        {papanP > 0 ? <div style={{ position: 'absolute', left: papan - 70, top: 82, width: 140, height: 140, borderRadius: '50%', background: B.white, border: `${SISI + 3}px solid ${warna}`,
          boxSizing: 'border-box', display: 'grid', placeItems: 'center', boxShadow: bayanganKecil(warna), transformOrigin: 'center',
          transform: papanP < 1 ? `scale(${skalaPop(papanP)})` : undefined }}><Icon name="warung" size={78} color={warna} /></div> : null}
      </>);
  };
const AdeganKota: React.FC<{ f: number }> = ({ f }) => {
  const p = poseF(f), a = di(UF, f), kam = kamKota(f);
  const hpDiTangan = cin(f, tF.hp, 30) > 0.5 && f < tF.hpKeluar + 10;
  return (
    <>
      <KotaLayar kamX={kam} C={C_KOTA} />
      <div style={{ position: 'absolute', inset: 0, transform: kam ? `translate3d(${-kam}px, 0, 0)` : undefined }}>
        {/* 30 Okt (cek still f7820): hp besar menutupi papan nama toko sepi (cincin papan mengintip di atas hp) → papan pop keluar SELESAI tepat saat hp
          mulai naik (aturan 17: yang lama keluar dulu, baru yang baru masuk di tempat yang sama) */}
        <Restoran {...RESTO.sepi} menu papanP={popOut(f, tF.hpBesar - 60)} />
        <Restoran {...RESTO.ramai} papanP={popIn(f, T_PAPAN_RAMAI)} />
        {ANTRE_X.map((x, k) => {
          const g = Math.sin((2 * Math.PI * (f + 37 * k)) / (190 + 23 * k));
          const q: Pose = { ...BERDIRI, badan: BERDIRI.badan + 0.7 * g, kepala: -0.7 * g + (k === 1 ? 4 : 0) };
          return <TokohTegakLapis key={k} x={x} tanah={TANAH_LAYAR + TURUN_KOTA} s={S} pose={q} kostum="kini" kepala={RUPA_ANTRE[k].kepala} warna={RUPA_ANTRE[k].warna} />;
        })}
        <TokohTegakLapis x={a.x} tanah={TANAH_LAYAR + TURUN_KOTA} s={S} pose={p} kostum="kini" ponsel={hpDiTangan} ketuk={hpDiTangan} />
      </div>
    </>);
};
/** HP BESAR (aturan Scene 01: masuk swipe dari bawah + rotasi 45°, keluar swipe ke bawah + rotasi 45°): barang ★4,9 → + Keranjang diketuk */
export const HP = { x: 560, y: 470, w: 380, h: 780, k: 0.94 };
export const TANGAN = { ujung: [115, 18] as P2, s: 0.85 };
const PonselRating: React.FC<{ f: number; x: number; y: number; rot: number }> = ({ f, x, y, rot }) => {
  const SW = HP.w - 24, SH = HP.h - 24;
  // jari masuk & keluar 60 f inOut cubic (Simon 28 Okt "keyframe … konsisten"; dulu 40 f) — tetap tiba 4 f sebelum ketukan, berangkat 4 f sesudah keranjang
  const jariY = lerp(760, 0, cin(f, tF.ketuk - 34)) + lerp(0, 760, cin(f, tF.keranjang + 34));
  const tekan = Math.sin(Math.PI * lin(f, tF.ketuk - 10, tF.ketuk + 14));
  const isiP = popIn(f, tF.keranjang);
  const tombol = (sisi: 'kiri' | 'kanan', ty: number, h: number) => (
    <div style={{ position: 'absolute', left: sisi === 'kiri' ? -4 : HP.w - 1, top: ty, width: 5, height: h, borderRadius: 3, background: B.night }} />);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: HP.w, height: HP.h, transformOrigin: 'center',
      transform: `translate3d(${x - HP.w / 2}px, ${y - HP.h / 2}px, 0) rotate(${rot}deg) scale(${HP.k})`, borderRadius: 58, background: B.night,
      boxShadow: `0 18px 40px -16px rgba(18,16,48,.45), inset 0 0 0 2px ${mixHex(B.night, B.gray, 0.45)}` }}>
      {tombol('kiri', 140, 30)}{tombol('kiri', 196, 58)}{tombol('kiri', 266, 58)}{tombol('kanan', 220, 92)}
      <div style={{ position: 'absolute', inset: 12, borderRadius: 46, background: B.white, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 30, top: 15, fontFamily: F, fontSize: 18, fontWeight: 700, color: B.night }}>09:41</div>
        <div style={{ position: 'absolute', left: SW / 2 - 46, top: 11, width: 92, height: 27, borderRadius: 14, background: B.night }} />
        {/* keranjang di pojok kanan atas + jumlah */}
        <div style={{ position: 'absolute', left: SW - 74, top: 52, width: 52, height: 52, borderRadius: '50%', border: `3px solid ${B.blue}`, boxSizing: 'border-box',
          display: 'grid', placeItems: 'center' }}><Icon name="tasBelanja" size={28} color={B.blue} /></div>
        {isiP > 0 ? <div style={{ position: 'absolute', left: SW - 40, top: 44, width: 28, height: 28, borderRadius: '50%', background: B.orange, color: B.white,
          fontFamily: F, fontSize: 17, fontWeight: 800, display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(isiP)})` }}>1</div> : null}
        {/* foto barang */}
        <div style={{ position: 'absolute', left: 22, top: 120, width: SW - 44, height: 290, borderRadius: 28, background: B.turqWash, display: 'grid', placeItems: 'center' }}>
          <Icon name="tasBelanja" size={170} color={B.turq} /></div>
        {/* rating besar */}
        <div style={{ position: 'absolute', left: 22, top: 432, display: 'flex', alignItems: 'center', gap: 10, fontFamily: F, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 46, color: B.orange, lineHeight: 1 }}>★</span>
          <span style={{ fontSize: 46, fontWeight: 800, color: B.night }}>4,9</span>
        </div>
        <div style={{ position: 'absolute', left: 22, top: 500, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>Rp349.000</div>
        {/* tombol + Keranjang */}
        <div style={{ position: 'absolute', left: SW / 2 - 140, top: 600, width: 280, height: 66, borderRadius: 999, background: B.blue, display: 'grid', placeItems: 'center',
          fontFamily: F, fontSize: 28, fontWeight: 800, color: B.white, transform: `scale(${1 - 0.1 * tekan})`, transformOrigin: 'center', boxShadow: bayanganKecil(B.blue) }}>
          + Keranjang</div>
        <div style={{ position: 'absolute', left: SW / 2 - 62, top: SH - 14, width: 124, height: 5, borderRadius: 3, background: B.night, opacity: 0.85 }} />
      </div>
      {jariY < 760 ? (
        <Img src={staticFile('flat/tangan-potong.svg')} style={{ position: 'absolute', left: HP.w / 2 - TANGAN.ujung[0] * TANGAN.s,
          top: 12 + 600 + 33 - TANGAN.ujung[1] * TANGAN.s + jariY - 10 * tekan, width: 420 * TANGAN.s, height: 920 * TANGAN.s, maxWidth: 'none' }} />) : null}
    </div>);
};

/* ════════════════════════════ G · TIGA CONTOH → OTAK ════════════════════════════ */
// y = pusat isi 497 (aturan tengah; dulu kartu y 470 & otak y 440 — 27 / 57 px di atas pusat isi), Simon 28 Okt "cek alignment"
const KARTU_G = { w: 380, h: 470, y: 497, x: [510, 960, 1410], r: 30 };
// kartu kiri & kanan pop SESUDAH kota menjadi kartu tengah (dulu kartu kiri pop di atas kota yang belum mengecil, still f7900)
const tG = { kecil: T.bukan + 20, kiri: T.malas + 18, kanan: T.malas + 38, gabung: T.mode, otak: T.mode + 60, hemat: T.energi3 + 30 };
const AKHIR = { x: 960, y: 497, d: 220 }; // = AKHIR_S03 Scene 04 (otak + lencana hemat energi diambil alih)
const CONTOH: { ikon: 'buah' | 'warung' | 'rating'; warna: string }[] = [
  { ikon: 'buah', warna: B.orange }, { ikon: 'warung', warna: B.turq }, { ikon: 'rating', warna: B.blue }];
/** isi kartu: ikon contoh + baris yang SAMA di tiap kartu: lihat satu petunjuk → putuskan cepat → lanjut */
const IsiContoh: React.FC<{ k: number; p: number }> = ({ k, p }) => {
  const c = CONTOH[k], w = KARTU_G.w, baris: { ikon: 'mata' | 'cepat' | 'jalanKaki'; warna: string }[] = [
    { ikon: 'mata', warna: B.blue }, { ikon: 'cepat', warna: B.orange }, { ikon: 'jalanKaki', warna: B.turq }];
  return (
    <>
      <Bulat x={w / 2} y={150} d={150} warna={c.warna} ikon={c.ikon} p={p} />
      {baris.map((b, j) => <Bulat key={j} x={w / 2 + (j - 1) * 118} y={360} d={70} warna={b.warna} ikon={b.ikon} p={p} />)}
      {[0, 1].map((j) => <Chevron key={j} x={w / 2 + (j - 0.5) * 118} y={360} warna={B.gray} p={p} d={30} />)}
    </>);
};

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene03Flat: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s3 || f >= BATAS.s4) return null;

  /* A: TRANSISI PARALAKS dari akhir Scene 02 (kota) dengan POHON Scene 03 sebagai pembatas (Simon 27 Okt sore) — dulu dorong ke kiri */
  const PARALAKS_A = T.kesalahan + 30;
  /* B: papan anatomi di balik tiga cakram */
  /* C: lingkaran otak membuka */
  // B → C: DUA LINGKARAN ala video TA (Simon 27 Okt 17.48: "transisi dari 2 adegan itu seharusnya menggunakan 2 lingkaran seperti di video ta") — cakram
  // turkis & turkis muda, lalu cakram ke-3 berisi padang senja; r 0 → 2100 60 f inOut cubic, selang 3 f. Dulu: lingkaran otak membuka.
  const tCC = tB.buka - 30;
  const rCC = (k: number) => 2100 * cin(f, tCC + 3 * k + 30);
  /* Simon 28 Okt: "transisi ini mulai dari tengah frame" → cakram dari PUSAT FRAME (dulu dari lingkaran otak), digambar DI ATAS papan anatomi yang masih
   * lengkap ("pertahankan visual anatomi … hanya untuk transisi saja") */
  const PUSAT_CC: P2 = [960, 540];
  const bukaC = f >= tCC + 66 ? 1 : rCC(2) > 0.5 ? 0.5 : 0;
  /* D */
  const belah = cin(f, tD.belah), lebar = cin(f, tD.lebar);
  const xBatas = 960 * belah + 960 * lebar; // tepi kanan belahan kiri
  /* E: sapuan lampu */
  const tr = lin(f, SAPU_E - 30, SAPU_E + 30), io3 = tr < 0.5 ? 4 * tr ** 3 : 1 - (-2 * tr + 2) ** 3 / 2;
  const batasLampu = lerp(-(LAMPU.w * LAMPU.s) / 2, 1920 + (LAMPU.w * LAMPU.s) / 2, io3);
  const geserPurba = 960 * tr ** 3, geserKota = 600 * (1 - io3);
  /* F: hp besar */
  const hpMasuk = cin(f, tF.hpBesar), hpKeluar = cin(f, tF.hpKeluar);
  /* G */
  const kecil = cin(f, tG.kecil); // kota mengecil jadi kartu tengah
  const gabung = cin(f, tG.gabung);

  const adeganAktif = (() => {
    if (f < tCC + 66) return 'AB';
    if (f < tD.belah - 30) return 'C';
    if (f < SAPU_E + 30) return 'D';
    return 'F';
  })();

  return (
    <>
      {/* ═════ A · paralaks pohon dari akhir Scene 02 → padang rumput (tokoh mengambil buah, terus melangkah) ═════ */}
      {adeganAktif === 'AB' && f < CAKRAM_PENUH ? (
        <TransisiParalaks f={f} pusat={PARALAKS_A} pembatas={POHON_S03} lama={<AkhirS02 f={f} />}
          baru={<div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><AdeganA f={f} j={UA} /></div>} />) : null}

      {/* ═════ A → B · tiga cakram dari tengah (turkis · turkis muda · papan anatomi) ═════ */}
      {adeganAktif === 'AB' && f >= tB.cakram - 30 && f < CAKRAM_PENUH ? (
        <>
          {[B.turq, B.turqLite].map((w, k) => {
            const r = rCakram(f, k);
            return r > 0.5 ? <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 2 * CAKRAM.r, height: 2 * CAKRAM.r, borderRadius: '50%', background: w,
              transformOrigin: 'center', transform: `translate3d(${CAKRAM.x - CAKRAM.r}px, ${CAKRAM.y - CAKRAM.r}px, 0) scale(${r / CAKRAM.r})` }} /> : null;
          })}
          {rCakram(f, 2) > 0.5 ? (
            <MaskerBulat cx={CAKRAM.x} cy={CAKRAM.y} d={2 * rCakram(f, 2)}>
              <Backdrop f={f} />
              <PapanB f={f} />
            </MaskerBulat>) : null}
        </>) : null}
      {/* ═════ B · papan anatomi ═════ */}
      {adeganAktif === 'AB' && f >= CAKRAM_PENUH && bukaC < 1 ? <PapanB f={f} /> : null}

      {/* ═════ C · lingkaran otak membuka jadi padang rumput senja ═════ */}
      {adeganAktif === 'AB' && f >= tCC ? [B.turq, B.turqLite].map((w, k) => rCC(k) > 0.5 ? (
        <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 4200, height: 4200, borderRadius: '50%', background: w, transformOrigin: 'center',
          transform: `translate3d(${PUSAT_CC[0] - 2100}px, ${PUSAT_CC[1] - 2100}px, 0) scale(${rCC(k) / 2100})` }} />) : null) : null}
      {bukaC > 0 && adeganAktif !== 'D' && adeganAktif !== 'F' ? (
        adeganAktif === 'AB'
          ? <MaskerBulat cx={PUSAT_CC[0]} cy={PUSAT_CC[1]} d={2 * rCC(2)}><AdeganC f={f} /></MaskerBulat>
          : <MaskerBulat cx={960} cy={540} d={2400}><AdeganC f={f} /></MaskerBulat>) : null}
      {adeganAktif === 'C' ? (
        <>
          <Tanda x={kepalaC(f)[0] + 10} y={kepalaC(f)[1] - 150} d={84} teks="?" warna={B.blue} p={popIn(f, tC.tanya) * popOut(f, tC.tanyaKeluar)} />
          <Baterai x={kepalaC(f)[0] + 10} y={kepalaC(f)[1] - 150} isi={isiBateraiC(f)} p={popIn(f, tC.baterai)} />
        </>) : null}

      {/* ═════ D · terbelah: kiri cepat (siang) · kanan lambat (senja) ═════ */}
      {adeganAktif === 'D' ? (() => {
        const gk = geserKiri(f), gc = (1440 - X_C) * belah + 960 * lebar; // tokoh C tetap di tengah belahan kanan (x 1440)
        const fD = f - DELTA_D; // waktu ulangan A
        const kpKiri = kepalaLayar(di(UD, fD).x + gk, poseA(UD, fD).p);
        return (
          <>
            {/* kanan: lambat (adegan C terus berjalan, digeser supaya tokohnya di tengah belahan) */}
            <Belah x0={xBatas} x1={1920}><div style={{ position: 'absolute', inset: 0, transform: `translate3d(${gc}px, 0, 0)` }}><AdeganC f={f} /></div></Belah>
            {/* kiri: cepat (ulangan A, siang) */}
            <Belah x0={0} x1={xBatas}>
              <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${gk + geserPurba}px, 0, 0)` }}><AdeganA f={fD} j={UD} buahAlfa={1} /></div>
            </Belah>
            {/* sapuan lampu kota (E): kota di kiri lampu */}
            {tr > 0 ? (
              <>
                <Belah x0={0} x1={batasLampu}><div style={{ position: 'absolute', inset: 0, transform: `translate3d(${geserKota}px, 0, 0)` }}><AdeganKota f={f} /></div></Belah>
                <Img src={staticFile('flat/lampu-kota.svg')} style={{ position: 'absolute', left: 0, top: 0, width: LAMPU.w * LAMPU.s, height: LAMPU.h * LAMPU.s, maxWidth: 'none',
                  transform: `translate3d(${batasLampu - LAMPU.tiang * LAMPU.s}px, ${LAMPU.atas}px, 0)` }} />
              </>) : null}
            {belah > 0 && xBatas < 1920 ? <div style={{ position: 'absolute', left: xBatas - 4, top: 0, width: 8, height: 1080, background: B.white }} /> : null}
            {/* baterai: kiri penuh, kanan terkuras */}
            <Baterai x={kpKiri[0]} y={kpKiri[1] - 150} isi={0.95} p={popIn(f, tD.baterai) * popOut(f, tD.keluarAtas)} />
            <Baterai x={kepalaC(f, gc)[0] + 10} y={kepalaC(f, gc)[1] - 150} isi={isiBateraiC(f)} p={popIn(f, tC.baterai) * popOut(f, tD.keluarAtas)} />
            {/* otak + hemat energi di garis tengah */}
            <Pendar x={960} y={230} d={130} s={cin(f, tD.hemat)} warna={B.blue} skala={skalaPop(popIn(f, tD.otak) * popOut(f, tD.keluarAtas))} />
            <Bulat x={960} y={230} d={130} warna={B.blue} ikon="otak" p={popIn(f, tD.otak) * popOut(f, tD.keluarAtas)} />
            <Lencana x={960} y={230} d={130} p={popIn(f, tD.hemat) * popOut(f, tD.keluarAtas)} warna={B.turq} ikon="hematEnergi" besar={56} />
            {/* "lebih cepat dan lebih mudah": centang di belahan kiri */}
            <Bulat x={300} y={230} d={84} warna={CEK} ikon="tersedia" p={popIn(f, tD.cek) * popOut(f, tD.keluarAtas)} />
          </>);
      })() : null}

      {/* ═════ F–G · kota (mengecil jadi kartu restoran di G) ═════ */}
      {adeganAktif === 'F' && gabung <= 0 ? (() => {
        const kx = lerp(0, KARTU_G.x[1] - KARTU_G.w / 2, kecil), ky = lerp(0, KARTU_G.y - KARTU_G.h / 2, kecil);
        const kw = lerp(1920, KARTU_G.w, kecil), kh = lerp(1080, KARTU_G.h, kecil), sk = lerp(1, 0.4, kecil);
        const isiKota = 1 - cin(f, tG.kecil + 20), isiKartu = cin(f, tG.kecil + 25);
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, width: kw, height: kh, overflow: 'hidden', borderRadius: 30 * kecil, background: B.white,
            transform: `translate3d(${kx}px, ${ky}px, 0)`, boxShadow: kecil > 0 ? bayanganDengan(B.turq, kecil) : undefined,
            border: kecil > 0 ? `${SISI * kecil}px solid ${B.turq}` : undefined, boxSizing: 'border-box' }}>
            {isiKota > 0 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', opacity: isiKota < 1 ? isiKota : undefined,
                // titik fokus y 540 → 600 bersama mengecil (dulu langsung 600: kota loncat naik 60 px di frame pertama, pindai f7595)
                transform: `translate(${kw / 2 - 960 * sk}px, ${kh / 2 - lerp(540, 600, kecil) * sk}px) scale(${sk})` }}><AdeganKota f={f} /></div>) : null}
            {isiKartu > 0 ? <div style={{ position: 'absolute', inset: 0, opacity: isiKartu < 1 ? isiKartu : undefined }}><IsiContoh k={1} p={popIn(f, tG.kecil + 40)} /></div> : null}
          </div>);
      })() : null}
      {adeganAktif === 'F' && hpMasuk > 0 && hpKeluar < 1 ? (
        <PonselRating f={f} x={HP.x} y={HP.y + SWIPE * (1 - hpMasuk) + SWIPE * hpKeluar} rot={-45 * (1 - hpMasuk) - 45 * hpKeluar} />) : null}

      {/* ═════ G · kartu buah & rating, lalu menyatu jadi otak ═════ */}
      {adeganAktif === 'F' ? [0, 1, 2].map((k) => {
        if (k === 1 && gabung <= 0) return null; // kartu tengah = adegan kota yang mengecil (di atas) sampai mulai menyatu
        const p = k === 1 ? 1 : popIn(f, k === 0 ? tG.kiri : tG.kanan);
        if (p <= 0 || gabung >= 1) return null;
        const x = lerp(KARTU_G.x[k], AKHIR.x, gabung), y = lerp(KARTU_G.y, AKHIR.y, gabung);
        const w = lerp(KARTU_G.w, AKHIR.d, gabung), h = lerp(KARTU_G.h, AKHIR.d, gabung), r = lerp(KARTU_G.r, AKHIR.d / 2, gabung);
        const isi = 1 - cin(f, tG.gabung - 15);
        return (
          <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: r, background: B.white, overflow: 'hidden',
            border: `${SISI}px solid ${mixHex(CONTOH[k].warna, B.blue, gabung)}`, boxSizing: 'border-box', transformOrigin: 'center',
            transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) scale(${skalaPop(p)})`, boxShadow: bayanganDengan(CONTOH[k].warna, 1 - 0.6 * gabung) }}>
            {isi > 0 ? <div style={{ position: 'absolute', left: (w - KARTU_G.w) / 2, top: (h - KARTU_G.h) / 2, width: KARTU_G.w, height: KARTU_G.h,
              opacity: isi < 1 ? isi : undefined }}><IsiContoh k={k} p={k === 1 ? 1 : p} /></div> : null}
          </div>);
      }) : null}
      {gabung >= 1 ? (
        <>
          <Bulat x={AKHIR.x} y={AKHIR.y} d={AKHIR.d} warna={B.blue} ikon="otak" p={1} ikonP={popIn(f, tG.otak)} />
          <Lencana x={AKHIR.x} y={AKHIR.y} d={AKHIR.d} p={popIn(f, tG.hemat)} warna={B.turq} ikon="hematEnergi" besar={70} />
        </>) : null}
    </>);
};
