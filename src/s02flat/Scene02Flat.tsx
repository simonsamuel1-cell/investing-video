import React from 'react';
import { Img, staticFile } from 'remotion';
import { ARAH, B, CEK, F, R, SISI, bayanganDengan, bayanganKecil, io, lerp, mixHex, rgba } from '../theme';
import { Icon, cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip } from '../parts/umum';
import { Penghubung } from '../parts/kaca';
import { Avatar, Besar, Pendar, PanahArah } from '../parts/v06';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { S01_T } from '../s01/Scene01';
import { ACES_S02 } from '../data/lilinRiil.gen';
import { hargaBulat, jangkauan, lilinGulir, posisiGulir, type JadwalLilin } from '../parts/lilinRiil';
import { BERDIRI, JALAN_FRAME, LARI_FRAME, LENGAN_MAIN_HP, PEGANG, alasTerendah, campurPose, gaya as gayaT, ikLengan, lebarBayangan,
  panjangSiklus as panjangT, rentangAlas, titikKepala, titikTangan, type Kostum, type Pose } from '../flat/rigTegak';
import { SingaRig, POSE_DIAM_SINGA } from '../flat/rigSinga';
import { BayanganBersama, HutanLayar, KOTA, KotaLayar, TANAH_LAYAR, TokohTegakLapis, Z_KOTA, ambil, simulasi, type Jejak } from '../flat/dunia';
import { SapuanLembut } from '../flat/transisi';
import { KEL_RUPA } from '../s01flat/Scene01Flat';

/**
 * SCENE 02 — VERSI 2D FLAT (dokumen "Investing_101_Ide_Visual_2D_Flat_Detail.md"). Acuan gaya = Scene 01 flat (rig tegak, latar Hutan.svg, subtitle
 * bersorot). Simon 27 Okt: "Scene 01 oke, lanjut bangun Scene 02 satu per satu" → "ketika membangun scene baru, hapus scene lama" → "lanjutkan
 * scene 2 sampai selesai". Scene 02 lama (kartu naluri, s02/Scene02.tsx + komposisi Ide-S02) DIHAPUS 27 Okt.
 *
 * A f3183–4011 "Kenapa kita masih bereaksi seperti itu? Mengikuti kelompok, takut pada bahaya, menyimpan lebih banyak makanan, dan menjadi semakin
 *   percaya diri setelah berhasil — semua itu … bertahan hidup." Dokumen: "empat vignette sederhana" → deretan EMPAT KARTU (referensi layout 03),
 *   tiap kartu = jendela ke padang rumput yang sama. Papan akhir Scene 01 diambil alih di frame yang sama; lingkaran otak MEMBUKA jadi kartu 1;
 *   kartu berikutnya pop di katanya, kartu lama memberi ruang; 1 ikut berlari · 2 semak berbunyi → berlindung di balik batu · 3 daging ke keranjang
 *   yang sudah penuh · 4 berjalan bertombak, tiga hasil buruan, badan makin tegak; centang hijau di "meningkatkan · peluang · bertahan · hidup".
 * B f4011–4199 "Masalahnya: pasar bukan padang rumput." Dokumen: "Setiap tindakan berubah menjadi padanan modern dengan gerakan yang mirip" → tiap
 *   kartu DIBALIK (rotateY, tint oranye → turkis) ke versi kota, gerakan sama diputar ulang: ikut berlari + BELI · harga turun → "!" → berlindung di
 *   balik tombol JUAL · menaruh satu lot lagi ke keranjang saham (300 → 400 lembar) · berjalan sambil melihat hp, tiga untung ▲ → badan makin tegak.
 * C f4199–4456 "Di padang rumput, kamu berlari atau tidak, singanya tetap sama." Empat kartu MENYATU jadi satu panel padang rumput (isi lama memudar,
 *   badan kartu bergeser jadi satu): ia berlari lalu berhenti, singa tetap diam di tempatnya, tanda "=" pop di "tetap sama".
 * D f4456–5009 "Tapi di pasar, keputusan banyak orang ikut menggerakkan harga. Saat banyak orang membeli … naik. Saat banyak orang menjual … turun."
 *   Panel padang rumput memberi ruang (ke kiri), panel PASAR pop di kanan: satu grafik harga (Rp berjalan) + empat investor (ikon); tiap BELI →
 *   grafik naik tepat sesudahnya, tiap JUAL → turun (dokumen: "Tunjukkan perubahan harga tepat setelah aksi beli atau jual").
 * E f5022–5402 "Perubahan harga itu kemudian memengaruhi emosi dan keputusan orang berikutnya." Panel padang rumput keluar, panel pasar ke tengah:
 *   investor 1 BELI → naik · investor 2 melihat grafik → emosi → BELI → naik lagi · investor 3 melihat (dokumen langkah 3).
 * F f5422–5637 "Perilaku mengubah harga, lalu harga kembali mengubah perilaku." Empat investor DIGABUNG jadi lingkaran Perilaku, panel pasar MORF jadi
 *   lingkaran Harga; panah melingkar (putus-putus, trim) atas lalu bawah, titik berjalan kembali ke awal (dokumen: "panah melingkar … bukan diagram
 *   bercabang").
 * G f5658–5836 "Inilah yang disebut refleksivitas pasar." Siklus naik memberi ruang, kotak teks REFLEKSIVITAS PASAR (satu-satunya teks konsep).
 * H f5861–6127 "Cara kerja otaknya masih sama. Lingkungannya yang sudah berubah." Lingkaran Perilaku membesar jadi layar penuh padang rumput, tokoh
 *   dengan ikon OTAK di atas kepala; di "lingkungannya … berubah" SAPUAN LEMBUT (tepi ber-motion blur, tokoh diam) ke KOTA dan tokohnya ikut berganti jadi
 *   versi modern — otaknya tetap sama (dokumen langkah 5).
 */
/* ── WAKTU KATA (onset VO, frame global; dipindah dari Scene 02 lama yang dihapus 27 Okt) ── */
const W = urut(['kenapa', 'bereaksi', 'mengikuti', 'kelompok', 'takut', 'bahaya', 'menyimpan', 'makanan', 'semakin', 'percaya', 'berhasil', 'semua',
  'meningkatkan', 'peluang', 'bertahan', 'hidup',
  'masalahnya', 'pasar', 'bukan', 'padang', 'rumput',
  'padang', 'kamu', 'berlari', 'tidak', 'singanya', 'tetap', 'sama',
  'tapi', 'pasar', 'keputusan', 'banyak', 'orang', 'menggerakkan', 'harga',
  'membeli', 'harga', 'naik', 'menjual', 'harga', 'turun',
  'perubahan', 'harga', 'memengaruhi', 'emosi', 'keputusan', 'orang', 'berikutnya',
  'perilaku', 'mengubah', 'harga', 'lalu', 'harga', 'kembali', 'mengubah', 'perilaku',
  'inilah', 'disebut', 'refleksivitas', 'pasar',
  'cara', 'otaknya', 'masih', 'sama', 'lingkungannya', 'sudah', 'berubah'], BATAS.s2 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  kenapa: n(), bereaksi: n(), mengikuti: n(), kelompok: n(), takut: n(), bahaya: n(), menyimpan: n(), makanan: n(), semakin: n(), percaya: n(), berhasil: n(),
  semua: n(), meningkatkan: n(), peluang: n(), bertahan: n(), hidup: n(),
  masalahnya: n(), pasar: n(), bukan: n(), padang: n(), rumput: n(),
  padang2: n(), kamu: n(), berlari: n(), tidak: n(), singanya: n(), tetap: n(), sama: n(),
  tapi: n(), pasar2: n(), keputusan: n(), banyak: n(), orang: n(), menggerakkan: n(), harga: n(),
  membeli: n(), harga2: n(), naik: n(), menjual: n(), harga3: n(), turun: n(),
  perubahan: n(), harga4: n(), memengaruhi: n(), emosi: n(), keputusan2: n(), orang2: n(), berikutnya: n(),
  perilaku: n(), mengubah: n(), harga5: n(), lalu: n(), harga6: n(), kembali: n(), mengubah2: n(), perilaku2: n(),
  inilah: n(), disebut: n(), refleksivitas: n(), pasar3: n(),
  cara: n(), otaknya: n(), masih: n(), sama2: n(), lingkungannya: n(), sudah: n(), berubah: n(),
};
export const S02_T = T;
export const S02F_AWAL = BATAS.s2;
export const S02F_AKHIR = BATAS.s3;

/* ════════════════════════════ UMUM ════════════════════════════ */
type P2 = [number, number];
/** kartu 410 × 580 (potret: tokoh berdiri), langkah 440 (celah 30) → deretan empat x 95–1825, atas 207 (di bawah zona logo y 204), pusat y 497 (di atas
 * subtitle) */
const KARTU = { w: 410, h: 580, r: 30, langkah: 440, y: 497, sisi: 6 };
/** jendela dunia di dalam kartu/panel: zoom 0,68 dari adegan layar penuh (tanah TANAH_LAYAR 860); titik dunia (960, YC) = pusat jendela → tanah ±455 */
const Z = 0.68, YC = 617;
/** skala tokoh di kartu: semua 0,79 (= kelompok Scene 01) — kadens terkunci 72/45 → laju sama, formasi kelompok tidak bergeser */
const S_V = 0.79;

/* ── GERAK (simulasi sekali dari awal scene; fase langkah dari jarak → kaki menapak; sama dengan Scene 01) ── */
const F0 = BATAS.s2;
const NS = 1300;
const laju = (r: number, s: number) => (panjangT(r) * s) / lerp(JALAN_FRAME, LARI_FRAME, r);
const FASE = (urutan: number) => -(urutan * 9 + 1) / JALAN_FRAME;
const gerak = (a: (f: number) => number, r: (f: number) => number, x0 = 0, psi0 = 0) =>
  simulasi(NS, (k) => a(F0 + k) * laju(r(F0 + k), S_V), (k) => r(F0 + k), S_V, x0, psi0, panjangT);
const di = (j: Jejak, f: number) => ambil(j, f - F0);
const V_LARI = laju(1, S_V);

/** titik rig (relatif akar, satuan) → dunia; dan sebaliknya */
export const akarY = (p: Pose, s = S_V) => TANAH_LAYAR - (alasTerendah(p) + (p.angkat ?? 0)) * s;
export const keDunia = (x: number, p: Pose, q: P2, s = S_V): P2 => [x + q[0] * s, akarY(p, s) + q[1] * s];
export const keRig = (x: number, p: Pose, w: P2): P2 => [(w[0] - x) / S_V, (w[1] - akarY(p)) / S_V];
/** x layar-dunia (adegan selebar 1920 di dalam kartu) dari x dunia & kamera */
export const L = (x: number, kam: number) => x - kam + 960;
export const bayang = (p: Pose, xl: number, s = S_V) => ({ x: xl + titikKepala(p)[0] * s, s, rx: lebarBayangan(titikKepala(p)[0], rentangAlas(p)), angkat: p.angkat ?? 0 });
export const lin = (f: number, a: number, b: number) => R(f, a, b, 0, 1, (x) => x);

/** LENGAN MEMEGANG (daging, tombak, hp, lot saham) = sudut lengan pengetuk figur pria-biru "main hp" (grup 32) yang sudah diukur di grid 27 Okt: atas
 * −11,9° · bawah −108,9° (absolut thd badan) → lengan bawah menjulur ke depan, genggaman setinggi perut. Lengan jauh tetap berayun (jalan). */
export const PEGANG_DEKAT = (p: Pose, tangan = -6): Pose => ({ ...p, bahu: [LENGAN_MAIN_HP.atas[0], p.bahu[1]], siku: [LENGAN_MAIN_HP.bawah[0] - LENGAN_MAIN_HP.atas[0], p.siku[1]],
  tangan: [tangan, p.tangan[1]] });
/** sudut mutlak tangan dekat (rantai badan + bahu + siku + tangan) — benda di genggaman diputar balik supaya tegak */
export const sudutTangan = (p: Pose) => p.badan + p.bahu[0] + p.siku[0] + p.tangan[0];
export const Genggam: React.FC<{ p: Pose; miring?: number; children: React.ReactNode }> = ({ p, miring = 0, children }) => (
  <g transform={`rotate(${(miring - sudutTangan(p)).toFixed(3)} ${PEGANG[0]} ${PEGANG[1]}) translate(${PEGANG[0]} ${PEGANG[1]})`}>{children}</g>);

/** BAYANGAN di kartu digambar di lapisan tokohnya sendiri (prop `bayangan` rig tegak, rumus sama dengan BayanganBersama) — dulu tiap kartu punya SVG
 * bayangan 1920 × 1080 sendiri (kinerja Studio). Jarak antar-tokoh di kartu ≥ 150 → bayangan nyaris tidak bertumpuk. */
/** JENDELA KARTU: rentang x dunia yang terlihat di kartu/panel yang sedang merender (diisi Kartu) → lapisan rumput di luar jendela tidak dipasang
 * (kinerja Studio: empat kartu × seluruh rumpun selebar 1920 = ±120 lapisan; terukur 50–70 fps di f3380–4060 sebelum dipangkas) */
const JendelaKartu = React.createContext<[number, number]>([-400, 2320]);
/** di kartu/panel: rumput LATAR DEPAN (di atas kaki tokoh) tidak dipasang — di skala kartu nyaris tak terlihat, tetapi tiap kartu ±10 lapisan gambar
 * lagi (terukur Studio f3800: 83 → ±100 fps tanpa rumput); latar belakang tetap utuh */
const Hutan: React.FC<{ kamX: number; C: number; lapis: 'belakang' | 'depan' }> = (p) => {
  const xs = React.useContext(JendelaKartu);
  return p.lapis === 'depan' ? null : <HutanLayar {...p} xs={xs} />;
};
/** latar dunia di kartu: padang rumput (Hutan.svg) atau kota (panorama 023 V02) — `x0Kota` = x panorama di tepi kiri adegan saat kamera `kam0` */
const Latar: React.FC<{ kini: boolean; kam: number; C: number; x0Kota: number; kam0: number; lapis: 'belakang' | 'depan' }> = ({ kini, kam, C, x0Kota, kam0, lapis }) => {
  if (!kini) return <Hutan kamX={kam} C={C} lapis={lapis} />;
  return lapis === 'belakang' ? <KotaLayar kamX={kam} C={kam0 - x0Kota * KOTA.s * Z_KOTA} /> : null;
};

/* ════════════════════════════ PROPERTI (gaya & palet Hutan.svg) ════════════════════════════ */
export const WARNA_P = { daging: '#B97A3E', dagingGelap: '#814E21', dagingTerang: '#D9A066', tulang: '#F4F1E6',
  anyam: '#C98B4D', anyamGelap: '#8A5528', kayu: '#4C3B2D', batu: '#A1A398', batuGelap: '#7E8278', buah: '#EF9A03', buahTerang: '#F8B62A', daun: '#94A453' };
/** paha daging (satuan lokal: genggaman di 0,0, daging di −y) */
export const Daging: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <g transform={`scale(${k})`}>
    <rect x={-5} y={-40} width={10} height={44} rx={5} fill={WARNA_P.tulang} />
    <circle cx={-6} cy={8} r={7.5} fill={WARNA_P.tulang} /><circle cx={6} cy={8} r={7.5} fill={WARNA_P.tulang} />
    <path d="M 0 -30 C -26 -32 -34 -60 -30 -82 C -26 -104 -10 -116 0 -116 C 12 -116 28 -104 30 -82 C 34 -60 26 -32 0 -30 Z" fill={WARNA_P.daging} />
    <path d="M 4 -36 C 22 -42 26 -62 24 -80 C 22 -98 12 -108 4 -110 C 18 -96 20 -60 4 -36 Z" fill={WARNA_P.dagingGelap} opacity={0.55} />
    <ellipse cx={-12} cy={-84} rx={6} ry={13} fill={WARNA_P.dagingTerang} opacity={0.8} />
  </g>);
/** buah bulat (satuan lokal, pusat 0,0) */
export const Buah: React.FC<{ r?: number; warna?: string }> = ({ r = 24, warna = WARNA_P.buah }) => (
  <g>
    <circle r={r} fill={warna} />
    <ellipse cx={-r * 0.35} cy={-r * 0.3} rx={r * 0.22} ry={r * 0.32} fill="#FFFFFF" opacity={0.35} />
    <path d={`M 0 ${-r} q ${r * 0.5} ${-r * 0.55} ${r * 0.9} ${-r * 0.25} q ${-r * 0.5} ${r * 0.35} ${-r * 0.9} ${r * 0.25} Z`} fill={WARNA_P.daun} />
  </g>);
/** tombak: genggaman di 0,0 = TENGAH batang (Simon 27 Okt sore: "pastikan kamu membuat orangnya membawa tombaknya pas ditengah, bukan memegang
 *  ujung tombak seperti sekarang" — dulu genggaman 108 dari pangkal / 462 dari mata), mata batu di atas (satuan rig) */
const TENGAH_TOMBAK = (462 - 108) / 2;
export const Tombak: React.FC = () => (
  <g transform={`translate(0 ${TENGAH_TOMBAK})`}>
    <rect x={-5.5} y={-392} width={11} height={500} rx={5.5} fill={WARNA_P.kayu} />
    <rect x={-2} y={-380} width={3} height={470} rx={1.5} fill="#FFFFFF" opacity={0.14} />
    <path d="M -14 -390 L 0 -462 L 14 -390 L 0 -380 Z" fill={WARNA_P.batu} />
    <path d="M 0 -462 L 14 -390 L 0 -380 Z" fill={WARNA_P.batuGelap} />
    <rect x={-8.5} y={-396} width={17} height={18} rx={4} fill={WARNA_P.daging} />
    <line x1={-8.5} x2={8.5} y1={-389} y2={-385} stroke={WARNA_P.dagingGelap} strokeWidth={2} />
  </g>);
/** LOT SAHAM (padanan daging di versi kota): ubin turkis bersudut bulat + glif grafik batang putih (satuan lokal, genggaman di bawahnya) */
const Lot: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <g transform={`scale(${k})`}>
    <rect x={-40} y={-92} width={80} height={80} rx={18} fill={B.turq} />
    <rect x={-40} y={-92} width={80} height={80} rx={18} fill="none" stroke={mixHex(B.turq, B.night, 0.25)} strokeWidth={4} />
    <rect x={-22} y={-44} width={11} height={18} rx={3} fill={B.white} /><rect x={-6} y={-58} width={11} height={32} rx={3} fill={B.white} />
    <rect x={10} y={-72} width={11} height={46} rx={3} fill={B.white} />
  </g>);
/** HP KECIL (versi kota kartu 4): tampak muka condong ke wajah, layar putih + garis naik hijau (satuan lokal, genggaman di bawah) */
export const HpKecil: React.FC = () => (
  <g>
    <rect x={-26} y={-96} width={52} height={100} rx={10} fill={B.night} />
    <rect x={-21} y={-90} width={42} height={88} rx={6} fill={B.white} />
    <path d="M -15 -22 L -6 -34 L 2 -30 L 14 -58" stroke={ARAH.naik} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>);

/** keranjang anyaman (dunia; x pusat, y alas); versi kota = keranjang putih bergaris turkis */
const KERANJANG = { w: 176, h: 172, x: 150 };
const Keranjang: React.FC<{ x: number; y: number; kini?: boolean }> = ({ x, y, kini }) => {
  const { w, h } = KERANJANG, wb = w * 0.8;
  const isi = kini ? B.white : WARNA_P.anyam, garis = kini ? B.turq : WARNA_P.anyamGelap;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M ${-w / 2} ${-h} L ${w / 2} ${-h} L ${wb / 2} -8 Q ${wb / 2} 0 ${wb / 2 - 10} 0 L ${-wb / 2 + 10} 0 Q ${-wb / 2} 0 ${-wb / 2} -8 Z`} fill={isi}
        stroke={kini ? mixHex(B.turq, B.white, 0.3) : 'none'} strokeWidth={4} />
      {[0.22, 0.42, 0.62, 0.82].map((u) => {
        const yy = -h + u * h, half = lerp(w / 2, wb / 2, u);
        return <line key={u} x1={-half + 4} x2={half - 4} y1={yy} y2={yy} stroke={garis} strokeWidth={5} opacity={kini ? 0.8 : 0.55} strokeLinecap="round" />;
      })}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((u) => <line key={u} x1={(u * w) / 2} x2={(u * wb) / 2} y1={-h + 14} y2={-6} stroke={garis} strokeWidth={3} opacity={kini ? 0.45 : 0.3} />)}
      <rect x={-w / 2 - 8} y={-h - 12} width={w + 16} height={22} rx={11} fill={kini ? B.turq : WARNA_P.anyamGelap} />
    </g>);
};
/** tumpukan isi keranjang (di belakang bibir keranjang): penuh sampai bibir, sedikit menyembul */
const IsiKeranjang: React.FC<{ x: number; y: number; kini?: boolean }> = ({ x, y, kini }) => {
  const atas = y - KERANJANG.h;
  if (kini) return (
    <g>
      <g transform={`translate(${x - 46} ${atas + 22}) rotate(-12)`}><Lot k={0.72} /></g>
      <g transform={`translate(${x + 44} ${atas + 24}) rotate(10)`}><Lot k={0.72} /></g>
      <g transform={`translate(${x} ${atas + 16})`}><Lot k={0.76} /></g>
    </g>);
  return (
    <g>
      <g transform={`translate(${x - 52} ${atas - 8}) rotate(-24)`}><Daging k={0.82} /></g>
      <g transform={`translate(${x + 54} ${atas - 4}) rotate(28)`}><Daging k={0.78} /></g>
      <g transform={`translate(${x - 18} ${atas - 14})`}><Buah r={26} /></g>
      <g transform={`translate(${x + 22} ${atas - 10})`}><Buah r={23} warna={WARNA_P.buahTerang} /></g>
      <g transform={`translate(${x + 2} ${atas - 36})`}><Buah r={22} /></g>
    </g>);
};
/** PIL (tombol aksi) — pop di pusat; koordinat induk */
export const Pil: React.FC<{ x: number; y: number; teks: string; p: number; size?: number; warna?: string }> = ({ x, y, teks, p, size = 22, warna = B.blue }) => p <= 0 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${skalaPop(p)})`, transformOrigin: 'center',
    background: warna, color: B.white, fontFamily: F, fontWeight: 800, fontSize: size, letterSpacing: '.05em', padding: `${size * 0.3}px ${size * 0.8}px`,
    borderRadius: 999, whiteSpace: 'nowrap', boxShadow: bayanganKecil(warna) }}>{teks}</div>);
/** tanda baca dalam lingkaran putih bergaris ("!", "?", "=") — pop di pusat.
 *  "=" (Simon 27 Okt: "icon sama dengan tidak rata tengah dengan lingkarannya" — glif font duduk di garis dasar, tintanya di bawah pusat) = DUA BATANG
 *  geometris yang pusatnya tepat di pusat lingkaran. */
export const Tanda: React.FC<{ x: number; y: number; d: number; teks: string; warna: string; p: number }> = ({ x, y, d, teks, warna, p }) => p <= 0 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${Math.max(SISI, d * 0.065)}px solid ${warna}`,
    boxSizing: 'border-box', display: 'grid', placeItems: 'center', transformOrigin: 'center', fontFamily: F, fontSize: d * 0.6, fontWeight: 800, color: warna,
    lineHeight: 1, transform: `translate3d(${x - d / 2}px, ${y - d / 2}px, 0) scale(${skalaPop(p)})`, boxShadow: bayanganDengan(warna, 1) }}>
    {teks === '=' ? (
      <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} style={{ position: 'absolute', left: -Math.max(SISI, d * 0.065), top: -Math.max(SISI, d * 0.065) }}>
        {[-1, 1].map((k) => <rect key={k} x={d * 0.29} y={d / 2 + k * d * 0.1 - d * 0.045} width={d * 0.42} height={d * 0.09} rx={d * 0.045} fill={warna} />)}
      </svg>) : teks}
  </div>);

/* ════════════════════════════ VIGNETTE (kartu) ════════════════════════════
 * Tiap vignette dirender pada WAKTU SIMULASI `f`; versi kota (`kini`) = vignette yang sama diputar ulang (f − Δ) dengan latar kota, kostum kini dan
 * properti padanannya. `fn` = waktu nyata (untuk pil yang pop di kata). */
type PropV = { f: number; kini?: boolean };

/* ── 1 · MENGIKUTI KELOMPOK → IKUT MEMBELI ──
 * Tokoh berdiri; dua anggota kelompok berlari dari belakang (wajah kaget), ia menoleh (cut to cut, sama dengan Scene 01), lalu ikut berlari. Versi kota:
 * pil BELI pop di atas kepala tiap orang saat ia mulai/ikut berlari. */
const t1 = { toleh: T.mengikuti - 8, tolehBalik: T.kelompok - 4, lari: T.kelompok + 16, beli: [T.kelompok - 14, T.kelompok + 2, T.kelompok + 22] };
const U1 = gerak((f) => cin(f, t1.lari), () => 1, 0, FASE(0));
const XW1 = 200 - V_LARI * (t1.lari - F0); // wanita 200 di depan tokoh sesudah ia berlari penuh; keriting 150 di depannya lagi
const K1 = [gerak(() => 1, () => 1, XW1 + 150, FASE(1)), gerak(() => 1, () => 1, XW1, FASE(2))];
const kam1 = (f: number) => lerp(110, (di(U1, f).x + di(K1[0], f).x + di(K1[1], f).x) / 3 + 30, cin(f, t1.lari + 6)); // kamera 60 f (audit 28 Okt: dulu 70 f — aturan transisi kamera maks 60 f)
const Vignette1: React.FC<PropV> = ({ f, kini = false }) => {
  const kam = kam1(f), a = di(U1, f);
  const p: Pose = { ...gayaT(a.psi, a.r, a.a), balik: f >= t1.toleh && f < t1.tolehBalik ? -1 : 1 };
  const kel = K1.map((j) => di(j, f));
  const kostum: Kostum = kini ? 'kini' : 'dulu';
  const orang = [...kel.map((q) => ({ x: L(q.x, kam), p: gayaT(q.psi, q.r, q.a) })), { x: L(a.x, kam), p }];
  return (
    <>
      <Latar kini={kini} kam={kam} C={-1450} x0Kota={900} kam0={kam1(t1.lari)} lapis="belakang" />
      {kel.map((q, k) => (
        <TokohTegakLapis key={k} x={orang[k].x} tanah={TANAH_LAYAR} s={S_V} pose={orang[k].p} kostum={kostum} warna={KEL_RUPA[k].warna}
          kepala={KEL_RUPA[k].kaget} bayangan />))}
      <TokohTegakLapis x={orang[2].x} tanah={TANAH_LAYAR} s={S_V} pose={p} kostum={kostum} bayangan />
      <Latar kini={kini} kam={kam} C={-1450} x0Kota={900} kam0={kam1(t1.lari)} lapis="depan" />
      {kini ? orang.map((o, k) => {
        const kp = keDunia(o.x, o.p, titikKepala(o.p));
        return <Pil key={k} x={kp[0]} y={kp[1] - 120} teks="BELI" p={popIn(f, t1.beli[k])} size={32} />; // lebar ±135 < jarak 150 (dulu 40: bertumpuk)
      }) : null}
    </>);
};

/* ── 2 · TAKUT PADA BAHAYA → MENJUAL SAAT HARGA TURUN ──
 * Semak di belakangnya bergoyang & berbunyi → ia menoleh, "!" → di "bahaya" ia berlari ke balik batu (batu Hutan.svg × 2,15, latar depan) dan
 * berjongkok; kepala & kedua tangan menyembul. Versi kota: papan harga bergoyang, garisnya jatuh merah ▼ → "!" → TOMBOL JUAL besar pop (padanan batu)
 * → ia berlindung di baliknya. */
const t2 = { semak: T.takut - 6, toleh: T.takut + 10, seru: T.takut + 18, jual: T.takut + 28, tolehBalik: T.bahaya - 2, lari: T.bahaya + 10, jongkok: T.bahaya + 44 };
const U2 = gerak((f) => cin(f, t2.lari, 24) - cin(f, t2.lari + 30, 24), () => 1, -244, FASE(0));
const KAM2 = -70;
const BATU = { k: 2.15, w: 498, h: 136, kiri: -129, alas: TANAH_LAYAR + 12 };
/** tombol JUAL (padanan batu): kiri sama dengan batu, puncak 702 = puncak batu di tempat persembunyian (tokoh bersembunyi di x 0) */
const BLOK_JUAL = { kiri: -129, w: 350, h: 170, r: 40 }; // jendela kartu sampai x dunia 231 → tombol 350 utuh (dulu 600: "JUA")
const tinggiBatu = (xd: number) => { // y puncak batu (dunia) di x dunia — profil terukur batu.svg (lebar 498)
  const PROF: [number, number][] = [[0, 132.5], [14, 51], [40, 54.5], [60, 58], [68, 59.5], [86, 41], [116, 41], [152, 0], [212, 17], [226, 48], [300, 81.5], [368, 26], [438, 45], [496, 134]];
  const u = (xd - BATU.kiri) / BATU.k;
  let k = 0;
  while (k < PROF.length - 2 && PROF[k + 1][0] < u) k++;
  const [u0, y0] = PROF[k], [u1, y1] = PROF[k + 1];
  return BATU.alas - BATU.h * BATU.k + lerp(y0, y1, Math.max(0, Math.min(1, (u - u0) / (u1 - u0)))) * BATU.k;
};
/** JONGKOK (bagian bawah tertutup batu): badan condong 28°, paha −75° (mutlak), betis +35°, telapak rata; kepala tegak memandang ke depan.
 * ⚠ BUKAN dari figur referensi (paket tidak punya pose jongkok) — kaki tersembunyi di balik batu; yang terlihat = badan, kepala, tangan di batu. */
const JONGKOK: Pose = { badan: 28, kepala: -30, paha: [-103, -98], lutut: [110, 106], telapak: [-35, -36], bahu: [-40, -30], siku: [-60, -60], tangan: [-30, -30] };
const SEMAK = { k: 1.7, w: 196, h: 128, x: -335 };
const PAPAN = { w: 300, h: 210, tiang: 150 }; // papan harga di tiang (padanan semak)
const Vignette2: React.FC<PropV> = ({ f, kini = false }) => {
  const a = di(U2, f);
  const j = cin(f, t2.jongkok, 30);
  let p: Pose = { ...gayaT(a.psi, a.r, a.a), balik: f >= t2.toleh && f < t2.tolehBalik ? -1 : 1 };
  const atasPelindung = (xd: number) => (kini ? BATU.alas - BLOK_JUAL.h : tinggiBatu(xd));
  if (j > 0) {
    p = campurPose(p, JONGKOK, j);
    // mengintip: napas + kepala sedikit naik-turun
    const g = Math.sin((2 * Math.PI * (f - t2.jongkok)) / 130);
    p = { ...p, badan: p.badan + 1.4 * g * j, kepala: p.kepala - 1.4 * g * j };
    // kedua tangan bertumpu di puncak pelindung (IK, siku ke bawah)
    const tgt = (dx: number): P2 => { const xd = a.x + dx; return keRig(a.x, p, [xd, atasPelindung(xd) + 4]); };
    const q = ikLengan(ikLengan(p, 0, tgt(58), -50), 1, tgt(30), -50);
    p = campurPose(p, q, j);
  }
  const xl = L(a.x, KAM2);
  const goyang = R(f, t2.semak - 4, t2.semak + 6, 0, 1) * (1 - R(f, t2.lari - 10, t2.lari + 20, 0, 1));
  const sudut = 3.2 * goyang * Math.sin((2 * Math.PI * (f - t2.semak)) / 9) + 1.2 * goyang * Math.sin((2 * Math.PI * (f - t2.semak)) / 5.3);
  const bunyiP = popIn(f, t2.semak + 8) * popOut(f, t2.lari + 10);
  const seruP = popIn(f, t2.seru) * popOut(f, t2.jongkok + 30);
  const kp = keDunia(xl, gayaT(0, 0, 0), titikKepala(gayaT(0, 0, 0)));
  const sx = L(SEMAK.x, KAM2);
  const jatuh = cin(f, t2.semak + 14); // garis harga di papan jatuh — 60 f (audit 28 Okt; dulu 40 f)
  const jualP = popIn(f, t2.jual);
  const kostum: Kostum = kini ? 'kini' : 'dulu';
  const latarProps = { kini, kam: KAM2, C: -2600, x0Kota: 2100, kam0: KAM2 };
  return (
    <>
      <Latar {...latarProps} lapis="belakang" />
      {/* semak / papan harga (latar, di belakang tokoh): bergoyang berporos di pangkalnya */}
      <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: `${sx}px ${TANAH_LAYAR + 6}px`, transform: `rotate(${sudut.toFixed(3)}deg)` }}>
        {kini ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <rect x={sx - 7} y={TANAH_LAYAR + 6 - PAPAN.tiang} width={14} height={PAPAN.tiang} rx={7} fill={B.gray} />
            <g transform={`translate(${sx - PAPAN.w / 2} ${TANAH_LAYAR + 6 - PAPAN.tiang - PAPAN.h})`}>
              <rect width={PAPAN.w} height={PAPAN.h} rx={26} fill={B.white} stroke={B.night} strokeWidth={8} />
              <path d={`M 30 ${70} L 80 ${58} L 120 ${76} L 160 ${66} L ${lerp(160, 268, jatuh)} ${lerp(66, 176, jatuh)}`} stroke={ARAH.turun} strokeWidth={9} fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>) : (
          <Img src={staticFile('flat/s02/semak-a.svg')} style={{ position: 'absolute', left: sx - (SEMAK.w * SEMAK.k) / 2, top: TANAH_LAYAR + 6 - SEMAK.h * SEMAK.k,
            width: SEMAK.w * SEMAK.k, height: SEMAK.h * SEMAK.k, maxWidth: 'none' }} />)}
      </div>
      {/* bunyi semak: tiga lengkung kecil · versi kota: ▼ merah di pojok papan */}
      {!kini && bunyiP > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <g transform={`translate(${sx + 40} ${TANAH_LAYAR - SEMAK.h * SEMAK.k + 10}) scale(${skalaPop(bunyiP)})`} stroke={B.night} strokeWidth={7} fill="none" strokeLinecap="round">
            <path d="M 18 -26 Q 32 -44 26 -64" /><path d="M 44 -12 Q 66 -30 64 -58" /><path d="M -22 -34 Q -30 -54 -20 -72" />
          </g>
        </svg>) : null}
      {kini ? <PanahArah x={sx - PAPAN.w / 2 + 6} y={TANAH_LAYAR + 6 - PAPAN.tiang - PAPAN.h + 6} naik={false} p={bunyiP} d={74} /> : null}
      <TokohTegakLapis x={xl} tanah={TANAH_LAYAR} s={S_V} pose={p} kostum={kostum} bayangan />
      {/* pelindung di latar depan (menutup kaki saat berjongkok): batu · tombol JUAL */}
      {kini ? (jualP > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: BLOK_JUAL.w, height: BLOK_JUAL.h, borderRadius: BLOK_JUAL.r, background: B.blue, display: 'grid',
          placeItems: 'center', fontFamily: F, fontSize: 84, fontWeight: 800, color: B.white, letterSpacing: '.06em', transformOrigin: 'center',
          transform: `translate3d(${L(BLOK_JUAL.kiri, KAM2)}px, ${BATU.alas - BLOK_JUAL.h}px, 0) scale(${skalaPop(jualP)})`, boxShadow: bayanganDengan(B.blue, 1) }}>JUAL</div>
      ) : null) : (
        <Img src={staticFile('flat/s02/batu.svg')} style={{ position: 'absolute', left: L(BATU.kiri, KAM2), top: BATU.alas - BATU.h * BATU.k, width: BATU.w * BATU.k,
          height: BATU.h * BATU.k, maxWidth: 'none' }} />)}
      <Latar {...latarProps} lapis="depan" />
      {/* "!" di atas kepala (lingkaran putih + garis oranye) */}
      <Tanda x={kp[0]} y={kp[1] - 164} d={92} teks="!" warna={B.orange} p={seruP} />
    </>);
};

/* ── 3 · MENYIMPAN LEBIH BANYAK MAKANAN → MEMPERBESAR JUMLAH SAHAM ──
 * Ia berjalan membawa paha daging ke keranjang yang SUDAH PENUH, menaruhnya di puncak tumpukan, daging jatuh & mendarat → tumpukan meluap. Lalu berdiri,
 * napas + mengangguk puas. Versi kota: membawa satu LOT saham ke keranjang saham, label lembar berjalan 300 → 400. */
const t3 = { henti: T.menyimpan + 40, taruh: T.makanan - 6, lepas: T.makanan + 4, kembali: T.makanan + 26, angguk: T.makanan + 56 };
const U3_0 = gerak((f) => 1 - cin(f, t3.henti, 30), () => 0, 0, FASE(0));
const U3 = gerak((f) => 1 - cin(f, t3.henti, 30), () => 0, -20 - U3_0.X[NS - 1], FASE(0));
const KAM3 = 40;
const ALAS_K = TANAH_LAYAR + 10;
const LEPAS3: P2 = [KERANJANG.x - 34, ALAS_K - KERANJANG.h - 56];
const DARAT3: P2 = [KERANJANG.x - 2, ALAS_K - KERANJANG.h - 52];
const DARAT3_KINI: P2 = [KERANJANG.x - 4, ALAS_K - KERANJANG.h - 8];
const pose3 = (f: number) => {
  const a = di(U3, f);
  const bawa = PEGANG_DEKAT(gayaT(a.psi, a.r, a.a));
  const raih = cin(f, t3.taruh, 24) * (1 - cin(f, t3.kembali, 36));
  const pulang = cin(f, t3.kembali, 36);
  let p = bawa;
  if (raih > 0) p = campurPose(bawa, ikLengan(bawa, 0, keRig(a.x, bawa, LEPAS3), -20), raih);
  if (pulang > 0) p = campurPose(p, { ...p, bahu: [BERDIRI.bahu[0], p.bahu[1]], siku: [BERDIRI.siku[0], p.siku[1]], tangan: [BERDIRI.tangan[0], p.tangan[1]] }, pulang);
  const g = Math.sin((2 * Math.PI * f) / 220), ang = Math.sin(Math.PI * lin(f, t3.angguk, t3.angguk + 40)) ** 2;
  const diam = 1 - a.a;
  return { a, p: { ...p, badan: p.badan + 0.6 * g * diam, kepala: p.kepala + 5 * ang } as Pose };
};
const Vignette3: React.FC<PropV> = ({ f, kini = false }) => {
  const { a, p } = pose3(f);
  const xl = L(a.x, KAM3), kx = L(KERANJANG.x, KAM3);
  const dipegang = f < t3.lepas;
  const p0 = pose3(t3.lepas).p;
  const g0 = keDunia(L(di(U3, t3.lepas).x, KAM3), p0, titikTangan(p0, 0));
  const u = lin(f, t3.lepas, t3.lepas + 12);
  const pantul = Math.sin(Math.PI * lin(f, t3.lepas + 12, t3.lepas + 24)) * 9;
  const darat = kini ? DARAT3_KINI : DARAT3;
  const jatuh: P2 = [lerp(g0[0], L(darat[0], KAM3), u), lerp(g0[1], darat[1], u * u) - pantul];
  const putar = lerp(-6, kini ? 4 : -16, u);
  const lembar = 300 + 100 * Math.round(10 * cin(f, t3.lepas + 24)) / 10; // hitungan 60 f (audit 28 Okt; dulu 30 f)
  return (
    <>
      <Latar kini={kini} kam={KAM3} C={-3500} x0Kota={3200} kam0={KAM3} lapis="belakang" />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <ellipse cx={kx} cy={ALAS_K} rx={KERANJANG.w * 0.55} ry={KERANJANG.w * 0.09} fill={B.night} opacity={0.2} />
        <IsiKeranjang x={kx} y={ALAS_K} kini={kini} />
        {!dipegang ? <g transform={`translate(${jatuh[0]} ${jatuh[1]}) rotate(${putar}) scale(${S_V})`}>{kini ? <Lot /> : <Daging />}</g> : null}
        <Keranjang x={kx} y={ALAS_K} kini={kini} />
      </svg>
      <TokohTegakLapis x={xl} tanah={TANAH_LAYAR} s={S_V} pose={p} kostum={kini ? 'kini' : 'dulu'} bayangan
        pegang={dipegang ? <Genggam p={p} miring={-6}>{kini ? <Lot /> : <Daging />}</Genggam> : null} />
      <Latar kini={kini} kam={KAM3} C={-3500} x0Kota={3200} kam0={KAM3} lapis="depan" />
      {/* versi kota: jumlah lembar di atas keranjang (berjalan saat lot mendarat) */}
      {kini ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${kx + 30}px, ${ALAS_K - KERANJANG.h - 300}px, 0) translate(-50%, -50%)`, // di atas kepala (dulu −190: menimpa kepala)
          background: B.white, border: `5px solid ${B.turq}`, borderRadius: 999, padding: '10px 30px', fontFamily: F, fontSize: 44, fontWeight: 800, color: B.night,
          whiteSpace: 'nowrap', boxShadow: bayanganKecil(B.turq) }}>{Math.round(lembar)} lembar</div>) : null}
    </>);
};

/* ── 4 · SEMAKIN PERCAYA DIRI SETELAH BERHASIL → MAKIN BERANI SETELAH UNTUNG ──
 * Ia berjalan (72 f) membawa tombak tegak; tiga hasil buruan pop satu per satu ("setelah berhasil"); tiap keberhasilan badannya makin tegak & dagunya
 * naik. Versi kota: hp di tangan, tiga untung ▲ hijau. Kamera mengikuti — ia terus melangkah jauh. */
/* OPSI A (Simon 27 Okt sore: "Opsi A, tapi pastikan kamu membuat orangnya membawa tombaknya pas ditengah"): ia datang membawa tombak (genggam di
 * tengah) → melompat naik ke batu → mengangkat tombak tinggi (membidik) → melempar → KENA (lencana buruan pop di "berhasil") → berdiri bertolak
 * pinggang, dada membusung, dagu naik; dua anggota kelompok di belakang bersorak (satu lengan terangkat).
 * POSE DIUKUR dari lembar paket pria-biru (5505133.jpg, grid 20 px): MELAMBAI (figur 2) lengan terangkat atas −73° · bawah −185° (siku −112°),
 * lengan di pinggang atas +33° · bawah −55° (siku −88°) · BERTOLAK PINGGANG (figur 3) dekat atas +30° / siku −81°, jauh atas −42,6° / siku +78,5°.
 * Lemparan = peralihan cepat 14 f antara dua pose terukur (bidik → ayun lanjut); paket tidak punya pose melempar. */
// kartu 4 pop f3636–3696 · berhenti 3643–3667 · lompat 3662–3692 · bidik 3680–3740 · lempar 3739–3753 (lepas 3746) · tombak keluar kartu ±3753 ·
// lencana 3755–3815 ("berhasil" 3752) · sorak 3770–3830 · bertolak pinggang 3780–3840
const t4 = { henti: T.semakin + 4, lompat: T.semakin + 26, bidik: T.semakin + 59, lepas: T.semakin + 95, kena: T.semakin + 134,
  sorak: T.semakin + 149, yakin: T.semakin + 159 };
const BURU = [t4.kena];
const ROCK4 = { k: 0.8, kiri: 905 }; // batu.svg 498 × 136 diskalakan 0,8; tepi kiri di x layar-dunia 905 (jendela kartu 668–1252)
const BERDIRI_X4 = 860, ATAS_X4 = 1020; // tokoh: kaki batu → puncak batu
const tanahBatu4 = (x: number) => { // y puncak batu (layar-dunia) — profil terukur batu.svg (sama dengan tinggiBatu)
  const PROF: [number, number][] = [[0, 132.5], [14, 51], [40, 54.5], [60, 58], [68, 59.5], [86, 41], [116, 41], [152, 0], [212, 17], [226, 48], [300, 81.5], [368, 26], [438, 45], [496, 134]];
  const u = (x - ROCK4.kiri) / ROCK4.k;
  let k = 0;
  while (k < PROF.length - 2 && PROF[k + 1][0] < u) k++;
  const [u0, y0] = PROF[k], [u1, y1] = PROF[k + 1];
  return BATU.alas - BATU.h * ROCK4.k + lerp(y0, y1, Math.max(0, Math.min(1, (u - u0) / (u1 - u0)))) * ROCK4.k;
};
const POSE_BIDIK: Pose = { ...BERDIRI, badan: -6, kepala: -4, paha: [16, -14], telapak: [-16, 14], bahu: [-73, -30], siku: [-112, -20], tangan: [-10, -4] };
const POSE_AYUN: Pose = { ...POSE_BIDIK, badan: 12, kepala: -8, bahu: [-40, 25], siku: [-25, -15], tangan: [0, -4] }; // kaki tetap kuda-kuda bidik (berdiri di batu)
const POSE_PINGGANG: Pose = { ...BERDIRI, badan: -4, kepala: -8, bahu: [30, -42.6], siku: [-81, 78.5], tangan: [17, 0] };
const POSE_SORAK: Pose = { ...BERDIRI, kepala: -6, bahu: [33, -73], siku: [-88, -112], tangan: [17, -6] };
const U4D = gerak((f) => 1 - cin(f, t4.henti, 24), () => 0, 0, FASE(0));
const X4D = BERDIRI_X4 - ambil(U4D, t4.henti + 40 - F0).x; // geser simulasi supaya ia berhenti tepat di kaki batu
const KAM4D = 960; // kamera diam (layar-dunia = x dunia)
/** pose + posisi tokoh purba kartu 4 */
const tokoh4 = (f: number) => {
  const a = di(U4D, f);
  let p: Pose = PEGANG_DEKAT(gayaT(a.psi, a.r, a.a), -4);
  let x = a.x + X4D, tanah = TANAH_LAYAR, angkat = 0;
  // lompat naik ke batu (30 f): jongkok sedikit → melayang (kaki terlipat) → mendarat
  const u = lin(f, t4.lompat - 15, t4.lompat + 15);
  if (u > 0) {
    x = lerp(x, ATAS_X4, io(u));
    tanah = lerp(TANAH_LAYAR, tanahBatu4(ATAS_X4), io(u));
    angkat = 34 * Math.sin(Math.PI * u);
    const lipat: Pose = { ...p, paha: [-38, -18], lutut: [62, 48], telapak: [-24, -30] };
    p = campurPose(p, lipat, Math.sin(Math.PI * u));
  }
  // membidik (60 f) → ayun lanjut (14 f, lepas di tengahnya) → bertolak pinggang (60 f)
  const bidik = cin(f, t4.bidik), ayun = R(f, t4.lepas - 7, t4.lepas + 7, 0, 1, (q) => q * q), yakin = cin(f, t4.yakin);
  if (bidik > 0) p = campurPose(p, POSE_BIDIK, bidik);
  if (ayun > 0) p = campurPose(p, POSE_AYUN, ayun);
  if (yakin > 0) p = campurPose(p, POSE_PINGGANG, yakin);
  // napas sesudah mendarat (diam, tidak kaku)
  const napas = Math.sin((2 * Math.PI * (f - t4.lompat)) / 150) * cin(f, t4.lompat + 30);
  p = { ...p, badan: p.badan + 0.8 * napas, kepala: p.kepala - 0.8 * napas, angkat };
  return { x, tanah, p, pegang: f < t4.lepas };
};
/** sudut genggam tombak: dibawa condong ke depan (75°), membidik mendatar sedikit naik (78°) */
const MIRING4 = 75;
/** tombak terbang (layar-dunia): dari genggaman saat lepas, laju 30 px/f ke kanan, 9 ke atas, gravitasi 0,55; arah batang = arah laju */
const tombakTerbang = (f: number) => {
  const q = tokoh4(t4.lepas - 1);
  const ra = q.tanah - (alasTerendah(q.p) + (q.p.angkat ?? 0)) * S_V;
  const tg = titikTangan(q.p, 0);
  const t = f - t4.lepas, vx = 30, vy = -9 + 0.55 * t;
  return { x: q.x + tg[0] * S_V + vx * t, y: ra + tg[1] * S_V + (-9 * t + 0.275 * t * t), sudut: (Math.atan2(vy, vx) * 180) / Math.PI + 90 };
};
const U4 = gerak(() => 1, () => 0, 0, FASE(0));
const kam4 = (f: number) => di(U4, f).x + 20;
const pose4 = (f: number, buru: number[]) => {
  const a = di(U4, f);
  const yakin = buru.reduce((s, b) => s + cin(f, b, 40), 0) / buru.length;
  const q = PEGANG_DEKAT(gayaT(a.psi, a.r, a.a), -4);
  const badan = q.badan + lerp(6, -3, yakin);
  return { a, p: { ...q, badan, kepala: lerp(7, -7, yakin) - badan } as Pose };
};
const Vignette4: React.FC<PropV & { buru: number[] }> = ({ f, kini = false, buru }) => kini ? <Vignette4Kota f={f} buru={buru} /> : <Vignette4Purba f={f} />;
const Vignette4Purba: React.FC<{ f: number }> = ({ f }) => {
  const h = tokoh4(f);
  const sorak = cin(f, t4.sorak);
  const lambai = sorak * Math.sin((2 * Math.PI * Math.max(0, f - t4.sorak - 30)) / 36) * (1 - cin(f, t4.sorak + 140)); // dua lambaian lalu diam
  // kelompok di BELAKANG (lebih jauh: skala 0,62, kaki di y 832) → tokoh lewat di depannya tanpa berimpit
  const kel = [{ x: 712, k: 0 }, { x: 800, k: 1 }].map((o) => {
    const napas = Math.sin((2 * Math.PI * (f + 40 * o.k)) / 160);
    let q = campurPose(BERDIRI, POSE_SORAK, sorak);
    q = { ...q, badan: q.badan + 0.8 * napas, siku: [q.siku[0], q.siku[1] + 12 * lambai] };
    return { ...o, p: q };
  });
  const terbang = f >= t4.lepas && f < t4.lepas + 40 ? tombakTerbang(f) : null;
  return (
    <>
      <Latar kini={false} kam={KAM4D} C={-700} x0Kota={1800} kam0={KAM4D} lapis="belakang" />
      {kel.map((o) => (
        <TokohTegakLapis key={o.k} x={o.x} tanah={TANAH_LAYAR - 28} s={0.62} pose={o.p} kostum="dulu" warna={KEL_RUPA[o.k].warna} kepala={KEL_RUPA[o.k].kepala} bayangan />))}
      <Img src={staticFile('flat/s02/batu.svg')} style={{ position: 'absolute', left: ROCK4.kiri, top: BATU.alas - BATU.h * ROCK4.k, width: BATU.w * ROCK4.k,
        height: BATU.h * ROCK4.k, maxWidth: 'none' }} />
      <TokohTegakLapis x={h.x} tanah={h.tanah} s={S_V} pose={h.p} kostum="dulu" bayangan
        pegang={h.pegang ? <Genggam p={h.p} miring={MIRING4}><Tombak /></Genggam> : undefined} />
      {terbang ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <g transform={`translate(${terbang.x} ${terbang.y}) rotate(${terbang.sudut.toFixed(2)}) scale(${S_V})`}><Tombak /></g>
        </svg>) : null}
      <Latar kini={false} kam={KAM4D} C={-700} x0Kota={1800} kam0={KAM4D} lapis="depan" />
    </>);
};
const Vignette4Kota: React.FC<{ f: number; buru: number[] }> = ({ f, buru }) => {
  const kini = true;
  const { a, p } = pose4(f, buru);
  const kam = kam4(f), xl = L(a.x, kam);
  return (
    <>
      <Latar kini={kini} kam={kam} C={-700} x0Kota={1800} kam0={kam4(T.pasar)} lapis="belakang" />
      <TokohTegakLapis x={xl} tanah={TANAH_LAYAR} s={S_V} pose={p} kostum={kini ? 'kini' : 'dulu'} bayangan
        pegang={<Genggam p={p} miring={kini ? -12 : 4}>{kini ? <HpKecil /> : <Tombak />}</Genggam>} />
      <Latar kini={kini} kam={kam} C={-700} x0Kota={1800} kam0={kam4(T.pasar)} lapis="depan" />
    </>);
};
/** baris lencana buruan di bawah zona centang pojok kanan-atas (centang y 12–76 · lencana 87–153) */
const LENCANA_Y = 120;
/** lencana hasil buruan (koordinat kartu): lingkaran putih + garis oranye + paha daging */
const LencanaBuru: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 66, height: 66, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.orange}`,
    boxSizing: 'border-box', transformOrigin: 'center', transform: `translate3d(${x - 33}px, ${y - 33}px, 0) scale(${skalaPop(p)})`, boxShadow: bayanganDengan(B.orange, 1) }}>
    <svg width={58} height={58} viewBox="-29 -29 58 58" style={{ position: 'absolute', left: 0, top: 0 }}>
      <g transform="translate(-4 20) rotate(28) scale(0.36)"><Daging /></g>
    </svg>
  </div>);
/** untung (versi kota): pil hijau ▲ persen */
const UNTUNG = ['▲ 8%', '▲ 12%', '▲ 15%'];

/* ════════════════════════════ KARTU / PANEL ════════════════════════════ */
/** jendela dunia: `jangkar` = titik layar tempat pusat jendela dunia (960, YC) berada (bawaan: pusat kartu) — saat kartu MENYATU, keempat kartu menjangkar
 * dunia yang sama ke pusat panel tujuan → di akhir penyatuan keempatnya memperlihatkan potongan yang sama = satu panel. `lapis2` digambar DI BAWAH isi
 * utama: isi lama memudar di atas isi baru yang sudah utuh (dulu keduanya setengah transparan → kusam, still f4225) */
const Kartu: React.FC<{ x: number; y: number; w: number; h: number; r: number; warna: string; sisi?: number; s?: number; putarY?: number; bayang?: number;
  jangkar?: P2; children?: React.ReactNode; atas?: React.ReactNode; isiAlfa?: number; lapis2?: { jangkar?: P2; alfa: number; isi: React.ReactNode } }> =
  ({ x, y, w, h, r, warna, sisi = KARTU.sisi, s = 1, putarY = 0, bayang = 1, jangkar, children, atas, isiAlfa = 1, lapis2 }) => {
    if (s <= 0) return null;
    const dunia = (j: P2 | undefined, alfa: number, isi: React.ReactNode) => {
      const [jx, jy] = j ?? [x, y];
      const tx = jx - (x - w / 2) - sisi - 960 * Z;
      return alfa <= 0 ? null : (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', opacity: alfa < 1 ? alfa : undefined,
          transform: `translate(${tx}px, ${jy - (y - h / 2) - sisi - YC * Z}px) scale(${Z})` }}>
          <JendelaKartu.Provider value={[-tx / Z - 160, (w - 2 * sisi - tx) / Z + 160]}>{isi}</JendelaKartu.Provider>
        </div>);
    };
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: r, overflow: 'hidden', border: `${sisi}px solid ${warna}`,
        boxSizing: 'border-box', background: '#DDF1E4', transformOrigin: 'center',
        transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)${putarY ? ` perspective(1600px) rotateY(${putarY}deg)` : ''} scale(${s})`,
        boxShadow: bayanganDengan(warna, bayang) }}>
        {lapis2 ? dunia(lapis2.jangkar, lapis2.alfa, lapis2.isi) : null}
        {dunia(jangkar, isiAlfa, children)}
        {atas}
      </div>);
  };

/** KARTU YANG MERAPAT (fase C): isi mengisi SELURUH kotak (tanpa celah bingkai), bingkai = lapisan di ATAS isi dengan warna per sisi → garis & sudut
 * dalam (`dalamKiri/Kanan` 1 → 0; −1 = sisi luar, tetap penuh) memudar tanpa menggeser isi; dunia berjangkar di pusat panel tujuan → potongan
 * keempat kartu bersambung jadi satu adegan. */
const KartuGabung: React.FC<{ x: number; y: number; w: number; h: number; warna: string; dalamKiri: number; dalamKanan: number; bayang: number;
  isi: React.ReactNode; isiAlfa: number }> = ({ x, y, w, h, warna, dalamKiri, dalamKanan, bayang, isi, isiAlfa }) => {
  const rK = dalamKiri < 0 ? KARTU.r : KARTU.r * dalamKiri, rN = dalamKanan < 0 ? KARTU.r : KARTU.r * dalamKanan;
  const radius = `${rK}px ${rN}px ${rN}px ${rK}px`;
  const tx = PANEL_BESAR.x - (x - w / 2) - 960 * Z, ty = PANEL_BESAR.y - (y - h / 2) - YC * Z;
  const sisiWarna = (a: number) => (a < 0 ? warna : rgba(warna, a));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', background: '#DDF1E4',
        // = bayanganDengan(warna, 1) kartu sebelum merapat (bayangan warna + bayangan gelap), memudar bersama `bayang`
        boxShadow: bayang > 0.001 ? `${bayanganKecil(warna, bayang)}, 0 6px 14px -5px rgba(18, 16, 48, ${(0.34 * bayang).toFixed(3)})` : undefined }}>
        {isi && isiAlfa > 0 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', opacity: isiAlfa < 1 ? isiAlfa : undefined,
            transform: `translate(${tx}px, ${ty}px) scale(${Z})` }}>
            <JendelaKartu.Provider value={[-tx / Z - 160, (w - tx) / Z + 160]}>{isi}</JendelaKartu.Provider>
          </div>) : null}
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: radius, boxSizing: 'border-box', border: `${KARTU.sisi}px solid ${warna}`,
        borderLeftColor: sisiWarna(dalamKiri), borderRightColor: sisiWarna(dalamKanan) }} />
    </div>);
};

/* ── susunan kartu (A–B) ── */
const MUNCUL = [T.mengikuti, T.takut, T.menyimpan, T.semakin];
/** "tengah dulu, lalu memberi ruang": kartu lama bergeser (easeInOut 60 f, berpusat kata − 15) LEBIH DULU, kartu baru pop sesudahnya (easeOutBack
 * 60 f, berpusat kata + 15) → kartu baru tidak pernah menimpa tetangganya (terukur: celah terkecil 9,5 px di f3423). */
const GESER_DULU = 15;
const popKartu = (k: number, f: number) => popIn(f, MUNCUL[k] + GESER_DULU);
/** x pusat keempat kartu sesudah semuanya muncul (95–1825) */
const KARTU_X = [0, 1, 2, 3].map((k) => 960 + (KARTU.langkah / 2) * (2 * k - 3));
const xKartu = (k: number, f: number) => 960 + (KARTU.langkah / 2) * k
  - (KARTU.langkah / 2) * [1, 2, 3].filter((j) => j > k).reduce((a, j) => a + cin(f, MUNCUL[j] - GESER_DULU), 0);
/** centang "bertahan hidup" satu per satu di kata "meningkatkan · peluang · bertahan · hidup"; keluar di "masalahnya" */
const CEK_T = [T.meningkatkan, T.peluang, T.bertahan, T.hidup];
const cekKeluar = (k: number) => T.masalahnya + 14 + 8 * k;
/** B: kartu DIBALIK berurutan (selang 20 f) mulai "pasar"; Δ = geser waktu simulasi versi kota (gerakan sama diputar ulang sesudah dibalik) */
const BALIK = [0, 1, 2, 3].map((k) => T.pasar + 20 * k);
const DELTA = [740, 699, 605, 0];
const UNTUNG_T = [BALIK[3] + 18, BALIK[3] + 33, BALIK[3] + 48]; // selesai pop ±f4206, sebelum isi kota memudar (4195–4225)
/** C: empat kartu MENYATU jadi satu panel padang rumput (Simon 27 Okt sore: "Pengabungan 4 panel pasar ke adegan padang rumput masih kasar" — dulu isi
 * kota memudar DI ATAS padang yang sudah tampil (dua adegan bertumpuk) sementara empat kartu berbingkai saling tindih → tepi bertumpuk di kiri).
 * Kini resep "menyatu" (aturan 14 Okt): ① isi kota memudar 60 f MEMPERLIHATKAN padang yang sudah utuh di bawahnya (30 Okt: dulu kartu kosong) → ② keempat badan merapat 60 f inOut cubic: celah 30 → 0, lebar
 * 410 → 295, garis dalam & sudut dalam memudar → satu panel 1180 × 580, bingkai turkis → oranye, kotak penyatu (bayangan) tumbuh di belakang →
 * ③ isi padang tetap utuh selama keempatnya merapat (dunia berjangkar di pusat panel → empat jendela ke
 *   adegan yang sama bergabung; sisi dalam dilebarkan 1 px supaya sambungan anti-alias tidak tampak). */
const GABUNG = T.padang2 + 48; // isi lama pudar 4165–4225 → kartu merapat 4225–4285 sambil isi baru menebal (28 Okt: kedua pudar 60 f)
const PANEL_BESAR = { x: 960, y: 497, w: 1180, h: 580 };
/** D: panel padang rumput memberi ruang ke kiri, panel pasar pop di kanan */
const DUA = { kiri: 525, kanan: 1395, w: 840, h: 580 };
const PADANG_GESER = T.tapi, PASAR_POP = T.pasar2 + 18;
/** E: panel padang rumput keluar (swipe kiri sampai keluar frame), panel pasar ke tengah */
const PADANG_KELUAR = T.turun + 28, PASAR_TENGAH = T.perubahan + 4;

/* ════════════════════════════ C · PADANG RUMPUT + SINGA ════════════════════════════ */
const S_SINGA = 0.465 * (S_V / 0.82); // ukuran singa Scene 01 relatif tokoh
const UP = gerak((f) => cin(f, T.berlari + 6, 24) - cin(f, T.tidak + 6, 24), () => 1, 170, FASE(0));
const Padang: React.FC<{ f: number }> = ({ f }) => {
  const a = di(UP, f);
  const g = Math.sin((2 * Math.PI * f) / 210) * (1 - a.a);
  const p0 = gayaT(a.psi, a.r, a.a);
  const p: Pose = { ...p0, badan: p0.badan + 0.6 * g };
  const xl = L(a.x, 0);
  const napasSinga = 1.6 * Math.sin((2 * Math.PI * f) / 170);
  const xSinga = L(-600, 0);
  return (
    <>
      <Hutan kamX={0} C={-1950} lapis="belakang" />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <SingaRig pose={POSE_DIAM_SINGA()} x={xSinga} tanah={TANAH_LAYAR + 20 + napasSinga} s={S_SINGA} />
      </svg>
      <TokohTegakLapis x={xl} tanah={TANAH_LAYAR} s={S_V} pose={p} kostum="dulu" bayangan />
      <Hutan kamX={0} C={-1950} lapis="depan" />
      {/* "tetap sama": tanda = di atas singa */}
      <Tanda x={xSinga + 250} y={TANAH_LAYAR - 360} d={110} teks="=" warna={B.blue} p={popIn(f, T.tetap)} />
    </>);
};

/* ════════════════════════════ D–E · PANEL PASAR ════════════════════════════
 * Satu grafik candle harian RIIL yang tumbuh ke kanan; candle naik/turun asli terbentuk tepat sesudah pil BELI (+) / JUAL (−) pop. Empat investor (ikon) di bawah grafik. Koordinat lokal panel 840 × 580. */
const PS = { w: 840, h: 580, x0: 44, x1: 796, y0: 110, y1: 356, avY: 478, pilY: 392, avD: 92 }; // tinggi grafik 246 px (dulu 210): candle harian riil lebih terbaca
const avX = (j: number) => 165 + 170 * j;
const BELI_T = [0, 1, 2, 3].map((j) => T.membeli - 10 + 20 * j);
const JUAL_T = [0, 1, 2, 3].map((j) => T.menjual + 8 + 20 * j); // mulai sesudah pil BELI di tempat yang sama selesai keluar
/** E: investor 1 BELI → naik · investor 2 melihat → emosi → BELI → naik · investor 3 melihat → emosi */
const E = { beli1: T.perubahan + 22, emosi2: T.emosi, beli2: T.keputusan2, emosi3: T.berikutnya + 22 };
/** CANDLE HARIAN RIIL. Simon 27 Okt: "pastikan candlestick yang kamu gunakan realistis seperti candlestick asli" → 27 Okt sore: "Buat candel di scene 2
 * ini jadi lebih realistis lagi dan mengikut dengan scriptnya". Dulu UNVR 2022 (54 candle tipis 13,9 px, satu candle hijau raksasa untuk empat BELI,
 * BELI investor 1 & 2 nyaris tak menaikkan harga). Kini ACES 20 Sep – 6 Nov 2023 tanpa nama, diskalakan (tutup 19 Okt = Rp1.000), 33 candle (slot
 * 20,6 px): URUTAN ASLINYA = naskah — tenang → HIJAU tiap BELI (20 · 23 · 24 · 25 Okt, +10,8 %) → kecil → MERAH tiap JUAL (27 · 30 · 31 Okt · 1 Nov,
 * −8,6 %) → kecil → HIJAU BELI investor 1 (3 Nov) & investor 2 (6 Nov, "naik lagi"). Sumbu harga tipis di kanan (gaya aplikasi). */
const DP = ACES_S02;
const iTgl = (t: string) => DP.findIndex((b) => b.t === t);
/** candle pertama yang TUMBUH = candle ke-15 sejak 20 Sep (sama dengan dulu); 19 hari riwayat sebelum 20 Sep mengisi jendela gulir (28 Okt) */
const DASAR_P = iTgl('2023-09-20') + 14;
const GRAF_T1 = T.perilaku - 10;
const WAKTU_P = (() => {
  const w: number[] = [];
  const isi = (dari: number, sampai: number, t0: number, t1: number) => { for (let k = dari; k <= sampai; k++) w[k - DASAR_P] = sampai === dari ? t0 : lerp(t0, t1, (k - dari) / (sampai - dari)); };
  const iG = iTgl('2023-10-20'), iR = iTgl('2023-10-27'), iE = iTgl('2023-11-03');
  isi(DASAR_P, iG - 1, T.tapi - 30, BELI_T[0] - 24); // pasar tenang berjalan
  BELI_T.forEach((t, j) => isi(iG + j, iG + j, t + 6, 0)); // empat BELI → empat candle hijau asli
  isi(iG + 4, iG + 4, BELI_T[3] + 44, 0); // candle kecil di puncak
  JUAL_T.forEach((t, j) => isi(iR + j, iR + j, t + 6, 0)); // empat JUAL → empat candle merah asli
  isi(iR + 4, iR + 4, JUAL_T[3] + 40, 0); // candle kecil di dasar
  isi(iE, iE, E.beli1 + 6, 0); isi(iE + 1, iE + 1, E.beli2 + 6, 0); // BELI investor 1 · investor 2 → naik · naik lagi
  return w;
})();
/** GULIR resep video TA (Simon 28 Okt; lihat parts/lilinRiil.tsx): candle tenang tumbuh BERSAMBUNG (selesai tepat saat berikutnya mulai) → gulir pelan
 *  terus-menerus; candle aksi (BELI/JUAL, kecil di puncak/dasar, BELI investor 1 & 2) tumbuh 20 f tepat sesudah pil-nya (rentetan 20 f = bersambung).
 *  Dulu: candle terbentuk di tempat (buka → terendah → tutup, 24 f inOut cubic) pada chart diam yang separuh kosong. */
const JADWAL_P: JadwalLilin = WAKTU_P.map((m, j) => ({ mulai: m, d: DASAR_P + j < iTgl('2023-10-20') ? WAKTU_P[j + 1] - m : 20 }));
const posP = posisiGulir(DASAR_P, JADWAL_P);
/** kolom sumbu harga di kanan (label di DALAM panel) */
const SUMBU_P = 62;
/** 33 slot di plot (lebar candle sama dengan dulu); candle yang sedang tumbuh berakhir di slot ke-32 → satu slot ruang napas sebelum sumbu harga */
const N_SLOT_P = 33;
const SLOT_P = (PS.x1 - SUMBU_P - PS.x0) / N_SLOT_P;
const X_KANAN_P = PS.x1 - SUMBU_P - SLOT_P;
/** skala harga TERKUNCI = seluruh candle yang pernah tampak (resep TA, tanpa kamera mengikuti) */
const [LO_P, HI_P] = (([a, b]) => [a - 14, b + 14])(jangkauan(DP.slice(DASAR_P - N_SLOT_P)));
const gy = (v: number) => PS.y1 - ((PS.y1 - PS.y0) * (v - LO_P)) / (HI_P - LO_P);
const SLOT = SLOT_P * 0.62;
const LABEL_P = Array.from({ length: 10 }, (_, k) => Math.ceil(LO_P / 50) * 50 + 50 * k).filter((v) => v <= HI_P);
const PanelPasar: React.FC<{ f: number }> = ({ f }) => {
  const lilin = lilinGulir(DP, posP(Math.min(f, GRAF_T1)), PS.x0, X_KANAN_P, SLOT_P).map((g) => ({ ...g.c, x: g.x, alfa: g.alfa })), akhir = lilin[lilin.length - 1];
  const rp = hargaBulat(akhir.c);
  const naikP = popIn(f, T.naik) * popOut(f, T.menjual - 20), turunP = popIn(f, T.turun) * popOut(f, E.beli1 + 10);
  const sorotUjung = popIn(f, T.harga) * popOut(f, T.membeli - 30); // pop LINEAR → easeOutBack (dulu skalaPop(cin): easing dobel)
  const warnaAkhir = akhir.c >= akhir.o ? ARAH.naik : ARAH.turun;
  return (
    <>
      <div style={{ position: 'absolute', left: PS.x0, top: 30, fontFamily: F, fontSize: 48, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>
        Rp{rp.toLocaleString('id-ID')}</div>
      <PanahArah x={PS.x0 + 270} y={60} naik p={naikP} d={52} />
      <PanahArah x={PS.x0 + 270} y={60} naik={false} p={turunP} d={52} />
      <svg width={PS.w} height={PS.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {LABEL_P.map((v) => (
          <g key={v}>
            <line x1={PS.x0} x2={PS.x1 - SUMBU_P} y1={gy(v)} y2={gy(v)} stroke={B.grayLite} strokeWidth={1.5} opacity={0.55} />
            <text x={PS.x1} y={gy(v) + 6} textAnchor="end" fontFamily={F} fontSize={17} fontWeight={700} fill={B.gray}>{v.toLocaleString('id-ID')}</text>
          </g>))}
        {lilin.map((c) => {
          const w = c.c >= c.o ? ARAH.naik : ARAH.turun, y0 = gy(Math.max(c.o, c.c)), y1 = gy(Math.min(c.o, c.c));
          return (
            <g key={c.t} opacity={c.alfa < 1 ? c.alfa : undefined}>
              <line x1={c.x} x2={c.x} y1={gy(c.h)} y2={gy(c.l)} stroke={w} strokeWidth={1.5} />
              <rect x={c.x - SLOT / 2} y={y0} width={SLOT} height={Math.max(2, y1 - y0)} rx={1} fill={w} />
            </g>);
        })}
        {/* harga terakhir: garis putus-putus tipis ke tepi kanan (gaya aplikasi) */}
        <line x1={akhir.x + SLOT} x2={PS.x1 - SUMBU_P} y1={gy(akhir.c)} y2={gy(akhir.c)} stroke={warnaAkhir} strokeWidth={3} strokeDasharray="9 9" opacity={0.8} /> {/* 3 px (aturan putus-putus 3–5 px; audit 28 Okt, dulu 2 px) */}
        {sorotUjung > 0 ? <circle cx={akhir.x} cy={gy(akhir.c)} r={16 * skalaPop(sorotUjung)} fill="none" stroke={B.blue} strokeWidth={4} /> : null}
      </svg>
    </>);
};

/* ════════════════════════════ F–G · SIKLUS ════════════════════════════ */
/** SIKLUS TEGAK: grafik (atas panel) → simpul HARGA di atas, empat investor (bawah panel) → simpul PERILAKU di bawah — tiap benda menuju simpulnya tanpa
 * melintasi benda lain (dulu mendatar: investor menyeberangi panel pasar menuju simpul kiri, still f5440). Panah melingkar berlawanan jarum jam: kanan
 * Perilaku → Harga ("perilaku mengubah harga"), kiri Harga → Perilaku ("harga kembali mengubah perilaku"). */
/** Simon 28 Okt "cek … alignmentnya": siklus (tepi kiri busur x 640 − 270) + kotak REFLEKSIVITAS PASAR (lebar terukur 698 px) dulu merentang 370–1649 →
 *  pusat 1009 (48 px kanan dari tengah). Kini siklus menepi 368 & kotak di x 1252 → 320–1601, pusat 960 (celah busur–kotak tetap 41 px). */
const SIKLUS = { x: 960, y: 497, r: 270, d: 170, kiri: 368 };
const KOTAK_X = 1252; // kotak REFLEKSIVITAS PASAR (pusat x)
const busur = (a0: number, a1: number, cx: number, cy: number, r: number) => { // derajat, BERLAWANAN jarum jam (sudut menurun, y ke bawah)
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 0 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};
/** awal garis busur atas / bawah (tanjakan 60 f) — mata panahnya pop di rentang yang sama */
const MULAI_BUSUR = [T.mengubah - 10, T.kembali - 15];
const CELAH = 26; // derajat — busur berhenti sebelum lingkaran simpul
const KotakJudul: React.FC<{ f: number; at: number; keluar: number; x: number; y: number }> = ({ f, at, keluar, x, y }) => {
  const sx = skalaPop(popIn(f, at - 10)) * skalaPop(popOut(f, keluar));
  if (sx <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x - 600, width: 1200, top: y - 46, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: B.white, borderRadius: 28, boxShadow: bayanganKecil(B.night), overflow: 'hidden', transform: `scaleX(${sx})`, transformOrigin: 'center' }}>
        <div style={{ padding: '12px 34px', transform: `scaleX(${1 / sx})`, transformOrigin: 'center' }}>
          <WordText f={f} at={at} until={keluar} style={{ fontFamily: F, fontSize: 56, fontWeight: 800, color: B.night, letterSpacing: '.02em' }}>
            REFLEKSIVITAS PASAR</WordText>
        </div>
      </div>
    </div>);
};

/* ════════════════════════════ H · OTAK SAMA, LINGKUNGAN BERUBAH ════════════════════════════ */
export const S_H = 0.82; // layar penuh = ukuran tokoh Scene 01
const MASKER = { D: 2400, mulai: T.cara + 24 }; // lingkaran Perilaku membesar jadi layar penuh
const SAPU = T.lingkungannya + 43; // pusat sapuan kiri → kanan (60 f, selesai sebelum "berubah" berakhir)
export const POSE_H = (f: number): Pose => { const g = Math.sin((2 * Math.PI * f) / 230); return { ...BERDIRI, badan: BERDIRI.badan + 0.6 * g, kepala: -0.6 * g }; };
export const xTokohH = 960 - titikKepala(BERDIRI)[0] * S_H; // kepala tepat di x 960
/** lingkungan KOTA (Simon 27 Okt sore: "Transisi untuk lingkungan berubah, ganti ke kota/sesuatu yang lebih modern") = panorama kota Scene 01
 * (kota-latar.svg 023 V02), diam; tepi kiri layar = x 1330 panorama → tokoh (x 960) berdiri di depan GEDUNG di antara dua pohon (±440 px kiri-kanan),
 * bukan di depan batang pohon (x 1500: batang tepat di belakang badan). Trotoar di garis kaki. Dulu: chart IHSG mingguan. */
const C_KOTA_H = -1330 * KOTA.s * Z_KOTA;
export const AdeganH: React.FC<{ f: number; kini: boolean }> = ({ f, kini }) => {
  const p = POSE_H(f);
  return (
    <>
      {kini ? <KotaLayar kamX={0} C={C_KOTA_H} /> : <HutanLayar kamX={0} C={-1400} lapis="belakang" />}
      <BayanganBersama tanah={TANAH_LAYAR} items={[bayang(p, xTokohH, S_H)]} />
      <TokohTegakLapis x={xTokohH} tanah={TANAH_LAYAR} s={S_H} pose={p} kostum={kini ? 'kini' : 'dulu'} bayangan={false} />
      {kini ? null : <HutanLayar kamX={0} C={-1400} lapis="depan" />}
    </>);
};

/** KEADAAN AKHIR Scene 02 (f6126): layar penuh lingkungan chart + tokoh versi kini + otak tersorot — diambil alih Scene 03 di frame pertamanya */
export const AkhirS02: React.FC<{ f: number }> = ({ f }) => {
  const kp = keDunia(xTokohH, BERDIRI, titikKepala(BERDIRI), S_H), y = kp[1] - 230;
  return (
    <>
      <AdeganH f={f} kini />
      <Pendar x={960} y={y} d={116} s={1} warna={B.blue} skala={skalaPop(0.99996)} />
      <Besar x={960} y={y} s={1}><Bulat x={960} y={y} d={116} warna={B.blue} ikon="otak" p={0.99996} /></Besar>
    </>);
};
/** posisi otak di akhir Scene 02 (layar) */
export const OTAK_AKHIR_S02 = (): [number, number] => { const kp = keDunia(xTokohH, BERDIRI, titikKepala(BERDIRI), S_H); return [960, kp[1] - 230]; };

/* ════════════════════════════ SCENE ════════════════════════════ */
const AKHIR_S01 = { otak: { x: 720, y: 497, d: 210 }, api: { x: 1200, y: 497, d: 176 }, chipY: 497 + 124 };

export const Scene02Flat: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s2 || f >= BATAS.s3) return null;

  /* ═════ A · pembuka: papan akhir Scene 01 → otak ke tengah + "?" ═════ */
  // chip "Bertahan hidup" masih dalam ayunan pop Scene 01 (popIn berpusat S01_T.hidup4 + 10, selesai f3190) → kurva yang sama dilanjutkan, lalu keluar
  const chipP = popIn(f, S01_T.hidup4 + 10) * popOut(f, T.kenapa + 27);
  const garisG = 1 - cin(f, T.kenapa + 30);
  const apiP = popOut(f, T.kenapa + 50);
  const xOtak = lerp(AKHIR_S01.otak.x, 960, cin(f, T.bereaksi));
  // "?" (pindai DOM 30 Okt f3289: dulu ikut dilepas bersama kelompok otak saat morf mulai → hilang seketika di skala ±0,5): pop masuk mulai di awal scene
  // ("kenapa"), penuh mulai "bereaksi", pop keluar 60 f penuh bersamaan lingkaran mulai membesar — digambar TERPISAH dari kelompok otak
  const tanyaP = popIn(f, T.kenapa + 30) * popOut(f, T.mengikuti - 54);
  /* LINGKARAN OTAK → PANEL 1 (Simon 27 Okt sore: "ubah lingkaran itu menjadi kotak yang kamu gunakan untuk panel discene 2. Masking adegan discene 2
   * panel 1 dengan lingkaran yang nanti akan membentuk panel (outline lingkaran … jadi outline orange, dan lingkaran putih itu berganti jadi masking
   * panel yang pertama muncul … tambahkan fadeout untuk lingkaran putih dan ikonnya" + "seharusnya lingkarannya ikut membesar (morphing)").
   * Dulu: otak MENGECIL (easeInBack) sementara kartu 1 tumbuh dari tengahnya = dua bentuk. Kini SATU bentuk: lingkaran otak itu sendiri (bingkai
   * 4 × 1,12 ungu) membesar & berubah jadi kartu 410 × 580 (r 117,6 → 30, bingkai → 6 oranye), isinya = masker adegan panel 1; isi putih + ikon otak
   * memudar di dalam bentuk yang sama (tak pernah keluar dari bingkai). */
  const buka = cin(f, T.mengikuti - 12);
  const otakP = buka <= 0 ? 1 : 0; // sampai morf mulai: Bulat otak Scene 01 apa adanya; sesudahnya kartu 1 (bentuk yang sama) mengambil alih
  const putihOtak = 1 - buka; // isi putih + ikon memudar bersamaan morf (60 f inOut cubic)
  const dO = AKHIR_S01.otak.d * 1.12; // otak berukuran "disebut" (1,12) dari akhir Scene 01

  /* ═════ A–C · kartu ═════ */
  const gab = cin(f, GABUNG); // 0 → 1: badan kartu merapat jadi satu panel
  const kartuAda = f < GABUNG - 30, gabungAda = !kartuAda && f < GABUNG + 30;
  // Simon 30 Okt "masih kasar" (kartu KOSONG sebelum menyatu, f4240): padang rumput sudah utuh DI BAWAH isi kota (lapis2, dunia berjangkar di pusat
  // panel tujuan) sejak isi kota mulai pudar → isi kota memudar 60 f memperlihatkan padang, kartu tak pernah kosong; lalu keempatnya merapat
  const isiLamaAlfa = 1 - cin(f, GABUNG - 60), padangBawah = f >= GABUNG - 90;
  const kartu = [0, 1, 2, 3].map((k) => {
    const balik = cin(f, BALIK[k]); // 0 → 1 = 0° → 180°
    const kini = balik >= 0.5;
    const s = k === 0 ? 1 : skalaPop(popKartu(k, f));
    const x0 = xKartu(k, f);
    const w0 = k === 0 ? lerp(dO, KARTU.w, buka) : KARTU.w, h0 = k === 0 ? lerp(dO, KARTU.h, buka) : KARTU.h;
    return {
      k, kini, s, putarY: balik < 0.5 ? 180 * balik : 180 * balik - 180,
      x: x0, w: w0, h: h0,
      r: k === 0 ? lerp(dO / 2, KARTU.r, buka) : KARTU.r,
      // bingkai: ungu (otak) → oranye (dulu) → turkis saat dibalik (kota) → oranye lagi saat menyatu jadi panel padang rumput (tint 60 f)
      warna: k === 0 && buka < 1 ? mixHex(B.blue, B.orange, buka) : mixHex(B.orange, B.turq, balik),
      sisi: k === 0 ? lerp(SISI * 1.12, KARTU.sisi, buka) : KARTU.sisi,
      fs: kini ? f - DELTA[k] : f,
    };
  });
  const isiVignette = (k: number, fs: number, kini: boolean) =>
    k === 0 ? <Vignette1 f={fs} kini={kini} /> : k === 1 ? <Vignette2 f={fs} kini={kini} /> : k === 2 ? <Vignette3 f={fs} kini={kini} />
      : <Vignette4 f={fs} kini={kini} buru={kini ? UNTUNG_T : BURU} />;
  const atasKartu = (k: number, kini: boolean) => {
    if (k !== 3) return null;
    const lebar = KARTU.w - 2 * KARTU.sisi;
    return kini
      // audit 28 Okt: dulu selang 112 px untuk pil selebar 110–124 px → saling menempel/bertumpuk 4–8 px (f4160–4180); kini huruf 20 (lebar terukur
      // ±100 · 111 · 113) dengan celah 14 px, rata tengah kartu
      ? UNTUNG.map((t, j) => <Pil key={j} x={lebar / 2 + [-126, -6, 120][j]} y={LENCANA_Y} teks={t} p={popIn(f, UNTUNG_T[j])} size={20} warna={ARAH.naik} />)
      // lencana buruan di sisi kanan (arah tombak dilempar), di bawah centang, sebelah kanan kepala tokoh yang berdiri di batu
      : BURU.map((b, j) => <LencanaBuru key={j} x={lebar - 62 - j * 82} y={LENCANA_Y + 34} p={popIn(f, b)} />);
  };

  /* ═════ C–E · panel padang rumput & panel pasar ═════ */
  const geserPadang = cin(f, PADANG_GESER), keluarPadang = cin(f, PADANG_KELUAR);
  const padang = {
    x: lerp(PANEL_BESAR.x, DUA.kiri, geserPadang) - (DUA.kiri + DUA.w / 2 + 60) * keluarPadang,
    w: lerp(PANEL_BESAR.w, DUA.w, geserPadang),
  };
  const pasarP = popIn(f, PASAR_POP);
  const pasarX = lerp(DUA.kanan, 960, cin(f, PASAR_TENGAH));
  /* F: panel pasar MORF jadi lingkaran Harga, empat investor digabung jadi lingkaran Perilaku */
  // panel menyusut ke ATAS (simpul Harga) bersamaan investor turun ke simpul Perilaku → keduanya berpisah, tidak saling menimpa (dulu panel menyusut
  // 46 f sesudah investor bergabung → lingkaran Perilaku menimpa tepi bawah panel, still f5440)
  const morfHarga = cin(f, T.perilaku + 5);
  const gabungAv = cin(f, T.perilaku + 10);
  const cx = SIKLUS.x - SIKLUS.kiri * cin(f, T.refleksivitas - 30), cy = SIKLUS.y; // menepi DULU, kotak pop sesudahnya
  const simpulPerilaku: P2 = [cx, cy + SIKLUS.r], simpulHarga: P2 = [cx, cy - SIKLUS.r];
  const pasarRect = {
    x: lerp(pasarX, simpulHarga[0], morfHarga), y: lerp(KARTU.y, simpulHarga[1], morfHarga),
    w: lerp(DUA.w, SIKLUS.d, morfHarga), h: lerp(DUA.h, SIKLUS.d, morfHarga), r: lerp(KARTU.r, SIKLUS.d / 2, morfHarga),
  };
  const isiPasarAlfa = 1 - cin(f, T.perilaku - 5);
  // tebal bingkai BULAT ke bawah (Chrome membulatkan border pecahan ke bawah) + isi dikompensasi dengan tebal yang sama → isi tidak meloncat 1 px saat
  // morf mulai (pindai f5398: border 6 → 5,99 dibulatkan 5 → seluruh isi panel bergeser (−1, −1))
  const sisiPasar = Math.floor(lerp(KARTU.sisi, SISI, morfHarga) + 1e-6);
  const keluarH = popOut(f, T.cara - 10); // simpul Harga, busur, titik, kotak keluar di "cara"

  /* investor (koordinat layar, mengikuti panel pasar) */
  const pX = pasarX - PS.w / 2, pY = KARTU.y - PS.h / 2;
  const avP = [0, 1, 2, 3].map((j) => popIn(f, T.banyak - 20 + 20 * j));
  const avPos = (j: number): P2 => [lerp(pX + avX(j), simpulPerilaku[0], gabungAv), lerp(pY + PS.avY, simpulPerilaku[1], gabungAv)];
  const avD = lerp(PS.avD, SIKLUS.d, gabungAv);
  const pilKeluar = (t: number) => popOut(f, t);
  const pil = [0, 1, 2, 3].map((j) => {
    const beli = popIn(f, BELI_T[j]) * pilKeluar(T.menjual - 52 + 6 * j);
    const jual = popIn(f, JUAL_T[j]) * pilKeluar(T.turun + 10 + 6 * j);
    const beliE = j === 0 ? popIn(f, E.beli1) * pilKeluar(T.perilaku - 40) : j === 1 ? popIn(f, E.beli2) * pilKeluar(T.perilaku - 34) : 0;
    return { beli: beli + beliE, jual };
  });
  const emosi = [0, popIn(f, E.emosi2) * popOut(f, T.perilaku - 40), popIn(f, E.emosi3) * popOut(f, T.perilaku - 34), 0];

  /* siklus */
  const busurAtas = cin(f, MULAI_BUSUR[0] + 30) * (1 - cin(f, T.cara - 10));
  const busurBawah = cin(f, MULAI_BUSUR[1] + 30) * (1 - cin(f, T.cara - 10));
  const titikP = popIn(f, T.perilaku2 + 12) * popOut(f, T.cara - 20);
  const sudutTitik = (() => { // berjalan dari Perilaku (bawah) naik lewat kanan ke Harga lalu turun lewat kiri — makin cepat (periode 150 → 90 f)
    const t0 = T.perilaku2 + 12; let a = 90;
    for (let t = t0; t < f; t++) a -= 360 / lerp(150, 90, lin(t, t0, T.refleksivitas + 60));
    return a;
  })();
  const sorotPerilaku = cin(f, T.perilaku2) * (1 - cin(f, MASKER.mulai - 60)); // selesai sebelum masker mulai (lingkaran kembali 100 %)
  const hargaIkonP = popIn(f, T.perilaku + 30) * keluarH; // pop saat lingkaran hampir jadi (dulu sesudahnya: lingkaran kosong ±25 f)
  const perilakuIkonP = popOut(f, MASKER.mulai - 60); // ikon orang = ikon empat investor yang digabung; keluar sebelum lingkaran membuka

  /* H */
  const mask = cin(f, MASKER.mulai);
  const otakH = popIn(f, T.otaknya), sorotH = cin(f, T.sama2);

  return (
    <>
      {/* ═════ A · papan akhir Scene 01 yang keluar ═════ */}
      {garisG > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <Penghubung d={`M ${AKHIR_S01.otak.x + 112} ${AKHIR_S01.otak.y} L ${AKHIR_S01.api.x - 102} ${AKHIR_S01.otak.y}`} g={garisG} warna={B.orange} titik={false} />
        </svg>) : null}
      <Bulat x={AKHIR_S01.api.x} y={AKHIR_S01.api.y} d={AKHIR_S01.api.d} warna={B.orange} ikon="apiUnggun" p={apiP} />
      <Chip x={AKHIR_S01.api.x} y={AKHIR_S01.chipY} teks="Bertahan hidup" ikon="tersedia" warna={CEK} p={chipP} />

      {/* ═════ A–C · empat kartu (dibalik di B, menyatu di C) ═════ */}
      {/* pendar otak ikut membesar bersama bentuknya lalu padam (tidak hilang seketika saat kartu mengambil alih) */}
      {buka > 0 && putihOtak > 0.001 ? <Pendar x={960} y={KARTU.y} d={AKHIR_S01.otak.d} s={putihOtak * putihOtak} warna={B.blue} skala={kartu[0].w / dO} /> : null}
      {kartuAda ? kartu.map((c) => (c.k === 0 && buka <= 0) ? null : (
        <Kartu key={c.k} x={c.x} y={KARTU.y} w={c.w} h={c.h} r={c.r} warna={c.warna} sisi={c.sisi} s={c.s} putarY={c.putarY}
          isiAlfa={isiLamaAlfa} lapis2={padangBawah ? { jangkar: [PANEL_BESAR.x, PANEL_BESAR.y], alfa: 1, isi: <Padang f={f} /> } : undefined} atas={<>
            {isiLamaAlfa > 0 ? <div style={{ opacity: isiLamaAlfa < 1 ? isiLamaAlfa : undefined }}>{atasKartu(c.k, c.kini)}</div> : null}
            {c.k === 0 && putihOtak > 0.001 ? (
              <div style={{ position: 'absolute', inset: 0, background: B.white, opacity: putihOtak, display: 'grid', placeItems: 'center' }}>
                <Icon name="otak" size={dO * 0.54} color={mixHex(B.blue, B.orange, buka)} /></div>) : null}
          </>}>
          {isiLamaAlfa > 0 ? isiVignette(c.k, c.fs, c.kini) : null}
        </Kartu>)) : null}

      {/* ═════ C–E · panel padang rumput ═════ */}
      {/* C · keempat kartu kosong merapat jadi satu panel (kotak penyatu di belakang, bayangannya tumbuh) */}
      {gabungAda ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, width: lerp(4 * KARTU.w + 3 * 30, PANEL_BESAR.w, gab), height: KARTU.h, borderRadius: KARTU.r,
            transform: `translate3d(${lerp(KARTU_X[0] - KARTU.w / 2, PANEL_BESAR.x - PANEL_BESAR.w / 2, gab)}px, ${KARTU.y - KARTU.h / 2}px, 0)`,
            // bayangan penyatu TUMBUH dari 0 (bayanganDengan(…, 0) masih memasang bayangan warna penuh → lonjakan terukur f4225)
            // TANPA latar: celah antar-kartu tetap memperlihatkan latar scene sampai tertutup sendiri (latar mint seketika = lonjakan f4225)
            boxShadow: gab > 0.001 ? `0 4px 10px -4px ${rgba(B.orange, 0.35 * gab)}, 0 6px 14px -5px rgba(18, 16, 48, ${(0.34 * gab).toFixed(3)})` : undefined }} />
          {[0, 1, 2, 3].map((k) => {
            const wE = PANEL_BESAR.w / 4, xE = PANEL_BESAR.x - PANEL_BESAR.w / 2 + wE * (k + 0.5);
            const lebih = (k > 0 ? 1 : 0) + (k < 3 ? 1 : 0), geser = ((k < 3 ? 1 : 0) - (k > 0 ? 1 : 0)) / 2; // tumpang 1 px di sisi dalam
            return <KartuGabung key={k} x={lerp(KARTU_X[k], xE, gab) + geser} y={KARTU.y} w={lerp(KARTU.w, wE, gab) + lebih} h={KARTU.h} warna={mixHex(B.turq, B.orange, gab)}
              dalamKiri={k > 0 ? 1 - gab : -1} dalamKanan={k < 3 ? 1 - gab : -1} bayang={1 - gab}
              isi={<Padang f={f} />} isiAlfa={1} />;
          })}
        </>) : null}
      {!kartuAda && !gabungAda && keluarPadang < 1 ? (
        <Kartu x={padang.x} y={KARTU.y} w={padang.w} h={PANEL_BESAR.h} r={KARTU.r} warna={B.orange} jangkar={[padang.x, KARTU.y]}><Padang f={f} /></Kartu>) : null}

      {/* ═════ F–G · busur siklus + titik berjalan — digambar SEBELUM simpul Harga & Perilaku: titik lewat di BAWAH kedua lingkaran (Simon 27 Okt:
        "lingkaran ini ketika di icon ungu benar, berada dibawah icon, seharusnya lingkaran yang berputar itu juga berada di icon biru") ═════ */}
      {busurAtas > 0 || busurBawah > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <Penghubung d={busur(90 - CELAH, -90 + CELAH, cx, cy, SIKLUS.r)} g={busurAtas} warna={B.blue} titik={false} />
          <Penghubung d={busur(270 - CELAH, 90 + CELAH, cx, cy, SIKLUS.r)} g={busurBawah} warna={B.turq} titik={false} />
          {/* mata panah menunggangi UJUNG garis yang sedang ditarik (dulu pop di titik akhir sebelum garis sampai, still f5480) */}
          {[[90 - CELAH, -90 + CELAH, busurAtas, B.blue], [270 - CELAH, 90 + CELAH, busurBawah, B.turq]].map(([a0, a1, g, w], k) => {
            const a = lerp(a0 as number, a1 as number, g as number);
            const sud = (a * Math.PI) / 180, px = cx + SIKLUS.r * Math.cos(sud), py = cy + SIKLUS.r * Math.sin(sud);
            // mata panah pop 60 f LINEAR → easeOutBack bersama garisnya, keluar bersama tarikannya (dulu skalaPop dari kemajuan garis yang sudah
            // di-ease: easing dobel)
            const arah = sud - Math.PI / 2, s = (g as number) > 0 ? skalaPop(popIn(f, MULAI_BUSUR[k] + 30) * popOut(f, T.cara - 10)) : 0;
            return s > 0 ? <path key={k} d="M -14 -12 L 8 0 L -14 12 Z" fill={w as string}
              transform={`translate(${px} ${py}) rotate(${(arah * 180) / Math.PI}) scale(${s})`} /> : null;
          })}
          {titikP > 0 ? <circle cx={cx + SIKLUS.r * Math.cos((sudutTitik * Math.PI) / 180)} cy={cy + SIKLUS.r * Math.sin((sudutTitik * Math.PI) / 180)}
            r={13 * skalaPop(titikP)} fill={B.blue} stroke={B.white} strokeWidth={4} /> : null}
        </svg>) : null}

      {/* ═════ D–F · panel pasar → lingkaran Harga ═════ */}
      {pasarP > 0 && keluarH > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: pasarRect.w, height: pasarRect.h, borderRadius: pasarRect.r, overflow: 'hidden', background: B.white,
          border: `${sisiPasar}px solid ${B.turq}`, boxSizing: 'border-box', transformOrigin: 'center',
          transform: `translate3d(${pasarRect.x - pasarRect.w / 2}px, ${pasarRect.y - pasarRect.h / 2}px, 0) scale(${skalaPop(pasarP) * skalaPop(keluarH)})`,
          boxShadow: bayanganDengan(B.turq, 1) }}>
          {isiPasarAlfa > 0 ? (
            <div style={{ position: 'absolute', left: (pasarRect.w - PS.w) / 2 - sisiPasar, top: (pasarRect.h - PS.h) / 2 - sisiPasar, width: PS.w, height: PS.h,
              opacity: isiPasarAlfa < 1 ? isiPasarAlfa : undefined }}><PanelPasar f={f} /></div>) : null}
          {hargaIkonP > 0 ? (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(hargaIkonP)})` }}>
              <Icon name="grafikHarga" size={SIKLUS.d * 0.5} color={B.turq} /></div>) : null}
        </div>) : null}

      {/* garis penggerak (ungu) & garis pandang (oranye) investor → candle DIHAPUS 27 Okt (Simon: "hapus saja garis penghubung ini baik yang warna ungu,
        maupun orange") */}
      {/* ═════ D–H · investor → lingkaran Perilaku → masker layar penuh ═════ */}
      {f < MASKER.mulai + 30 ? [0, 1, 2, 3].map((j) => {
        if (avP[j] <= 0 || (gabungAv >= 1 && j > 0)) return null;
        const [ax, ay] = avPos(j);
        const warna = mixHex(B.gray, B.blue, gabungAv);
        const satu = gabungAv >= 1; // tergabung: satu lingkaran Perilaku (ikon diganti pop)
        return (
          <React.Fragment key={j}>
            {satu ? <Pendar x={ax} y={ay} d={avD} s={sorotPerilaku} warna={B.blue} /> : null}
            <Besar x={ax} y={ay} s={satu ? sorotPerilaku : 0}>
              {satu ? (
                <div style={{ position: 'absolute', left: 0, top: 0, width: avD, height: avD, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.blue}`,
                  boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `translate3d(${ax - avD / 2}px, ${ay - avD / 2}px, 0)`,
                  boxShadow: bayanganDengan(B.blue, 1), opacity: mask > 0 ? 0 : undefined }}>
                  {perilakuIkonP > 0 ? <div style={{ transform: `scale(${skalaPop(perilakuIkonP)})` }}><Icon name="orangLain" size={avD * 0.52} color={B.blue} /></div> : null}
                </div>) : <Avatar x={ax} y={ay} d={avD} p={avP[j]} warna={warna} />}
            </Besar>
          </React.Fragment>);
      }) : null}
      {/* pil BELI / JUAL & emosi di atas investor */}
      {gabungAv < 1 ? [0, 1, 2, 3].map((j) => {
        const [ax, ay] = avPos(j);
        return (
          <React.Fragment key={j}>
            <Pil x={ax} y={ay - 86} teks="BELI" p={pil[j].beli} size={22} />
            <Pil x={ax} y={ay - 86} teks="JUAL" p={pil[j].jual} size={22} warna={B.orange} />
            {emosi[j] > 0 ? <Bulat x={ax + 40} y={ay - 40} d={52} warna={B.orange} ikon="emosi" p={emosi[j]} /> : null}
          </React.Fragment>);
      }) : null}

      {/* ═════ G · REFLEKSIVITAS PASAR ═════ */}
      <KotakJudul f={f} at={T.refleksivitas + 15} keluar={T.cara - 10} x={KOTAK_X} y={SIKLUS.y} />

      {/* ═════ H · lingkaran Perilaku membesar jadi layar penuh; sapuan lingkungan ═════ */}
      {mask > 0 ? (() => {
        const cxM = lerp(simpulPerilaku[0], 960, mask), cyM = lerp(simpulPerilaku[1], 540, mask), d = lerp(SIKLUS.d, MASKER.D, mask), s = d / MASKER.D;
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, width: MASKER.D, height: MASKER.D, borderRadius: '50%', overflow: 'hidden', background: B.white,
            transformOrigin: 'center', transform: `translate3d(${cxM - MASKER.D / 2}px, ${cyM - MASKER.D / 2}px, 0) scale(${s})` }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
              transform: `translate(${MASKER.D / 2}px, ${MASKER.D / 2}px) scale(${1 / s}) translate(${-cxM}px, ${-cyM}px)` }}>
              {/* "lingkungannya … berubah": SAPUAN LEMBUT (tepi ber-motion blur) padang rumput → KOTA; tokoh DIAM, hanya latar & bajunya yang berganti
                (Simon 27 Okt sore: "transisi dari dulu ke sekarang tidak perlu paralax" — paralaks hanya Scene 02 → 03; dulu tepi keras + garis putih 8 px) */}
              <SapuanLembut f={f} pusat={SAPU} lama={<AdeganH f={f} kini={false} />} baru={<AdeganH f={f} kini />} />
            </div>
            {/* isi putih lingkaran Perilaku memudar (60 f) saat lingkaran membuka; cincin ungu DI DALAM tepi (sama dengan garis simpul) — dulu cincin
              box-shadow di luar tepi + padang rumput tampil seketika → loncat 4 px & ganti isi 1 frame (pindai f5856) */}
            {mask < 1 ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.white, opacity: 1 - mask }} /> : null}
            {mask < 1 ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${SISI / s}px solid ${B.blue}`, boxSizing: 'border-box' }} /> : null}
          </div>);
      })() : null}
      {/* otak yang SAMA di atas kepala (tidak ikut tersapu) */}
      {otakH > 0 ? (() => {
        const kp = keDunia(xTokohH, BERDIRI, titikKepala(BERDIRI), S_H);
        const y = kp[1] - 230;
        return (
          <>
            <Pendar x={960} y={y} d={116} s={sorotH} warna={B.blue} skala={skalaPop(otakH)} />
            <Besar x={960} y={y} s={sorotH}><Bulat x={960} y={y} d={116} warna={B.blue} ikon="otak" p={otakH} /></Besar>
          </>);
      })() : null}

      {/* ═════ A · otak (di atas kartu 1 yang sedang tumbuh) ═════ */}
      {otakP > 0 ? (
        <>
          <Pendar x={xOtak} y={AKHIR_S01.otak.y} d={AKHIR_S01.otak.d} s={1} warna={B.blue} />
          <Besar x={xOtak} y={AKHIR_S01.otak.y} s={1}><Bulat x={xOtak} y={AKHIR_S01.otak.y} d={AKHIR_S01.otak.d} warna={B.blue} ikon="otak" p={0.99996} /></Besar>
        </>) : null}
      {tanyaP > 0 ? <Tanda x={xOtak + 0.37 * dO} y={AKHIR_S01.otak.y - 0.37 * dO} d={70} teks="?" warna={B.blue} p={tanyaP} /> : null}

      {/* ═════ A–B · centang "bertahan hidup" di tiap kartu ═════ */}
      {CEK_T.map((a, k) => {
        const p = popIn(f, a) * popOut(f, cekKeluar(k));
        return p > 0 ? <Bulat key={k} x={xKartu(k, f) + KARTU.w / 2 - 44} y={KARTU.y - KARTU.h / 2 + 44} d={64} warna={CEK} ikon="tersedia" p={p} /> : null;
      })}
    </>);
};
