import React from 'react';
import { ARAH, B, F, R, SISI, bayanganDengan, lerp, mixHex, rgba } from '../theme';
import { cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Lencana, luarLingkaran } from '../parts/umum';
import { KarakterLingkar, bayanganKaca, type PoseKarakter } from '../parts/kaca';
import { Notifikasi } from '../parts/nyata';
import { Avatar } from '../parts/v06';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { SingaRig, POSE_DIAM_SINGA } from '../flat/rigSinga';
import { CH as CH7, CX_B as CX7, IsiChartS07, Klik, PANEL, PANEL_LENCANA, PanelPadang, TURUN_E7, simPelari, tekanPada } from '../s07/Scene07';
import { IHSG_HARIAN_S08 } from '../data/lilinRiil.gen';
import { BatangLilin, domainGulir, lilinGulir, posisiGulir } from '../parts/lilinRiil';

/**
 * SCENE 08 — Saat Harga Turun, Kepanikan Memperdalam Penurunan (BATAS.s8 – BATAS.s9). GAYA RUMAH (bukan analogi; sisipan padang rumput = panel flat).
 * REVISI 28 Okt (Simon, S08): "Buat transisi scene 7 ke 8 morphing (pannel candlestiknya)" · "Ganti candle ihsg seperti ke screenshoot ihsg yang kemarin aku
 * kirimkan" (TradingView HARIAN 2020) · "Animasikan candlenya seperti contoh video" · 3 panel kejadian "gunakan pop up saja, transisi keluarnya sudah benar"
 * · orang + gelembung = brief Scene 07 (menghadap kanan, tanpa teks "Kamu", gelembung di atas kepala) · spacing, layout, animasi sesuai aturan:
 *  ⓪ kartu chart Scene 07 BER-MORF jadi kartu IHSG (isi lama memudar, isi baru menebal; satu bentuk).
 *  A–C candle HARIAN RIIL ^JKSE (Yahoo, salinan data Video 03) resep video TA: riwayat 2 Des 2019 – 28 Feb 2020 memenuhi jendela, tiap candle Maret TUMBUH
 *    dari harga buka sambil chart bergulir: 2 Mar (kasus COVID-19 pertama) · 3–6 Mar (lockdown/PSBB) · 9–11 Mar (asing menjual) · 12–24 Mar turun ke
 *    3.938 (terendah intraday 3.912 pada 24 Mar). Penanda ±6.300 / ±3.900, TRADING HALT 1/6 → 6/6, teks layar.
 *  D investor melihat → JUAL (diklik) berurutan, tiap gelombang menyorot satu kaki penurunan.
 *  E kamu masuk kiri (chart memberi ruang): gelembung di atas kepala → JUAL diklik → kaki terdalam "▼ lebih dalam" → orang berikutnya panik "!" → JUAL.
 *  F kartu BER-MORF jadi panel padang (pelari bertambah, singa tetap "=") lalu kembali; lembah menyala, siluet "singa baru" di kanan lembah.
 *  G "IHSG kemudian pulih": kamu turun memberi ruang, kartu MELEBAR selebar layar, candle pemulihan 26 Mar – 30 Des 2020 tumbuh & chart MENYUSUT
 *    (zoom out) sampai seluruh tahun tampak seperti screenshot TradingView; "Jual di sini" di lembah, kamu memegang uang, "Kerugian terkunci".
 * Data: tutup ±6.300 (6.284–6.329 akhir Des 2019 – awal Jan 2020) → 3.938; hari dengan penurunan intraday ≥ 5 % di Maret 2020: 12, 13, 17, 19, 23, 30.
 */
const W = urut(['bagian', 'berikutnya', 'panik', 'menjual', 'turun', 'maret', '2020', 'kasus', 'covid-19', 'pertama', 'diumumkan', 'indonesia', 'informasi',
  'lockdown', 'psbb', 'berubah', 'investor', 'asing', 'menjual', 'ihsg', 'turun', '6300', '3900', 'dalam', 'bulan', 'perdagangan', 'dihentikan', 'sementara',
  'sebanyak', 'enam', 'kali', 'ketakutan', 'menyebar', 'berita', 'buruknya', 'orang-orang', 'melihat', 'semua', 'orang', 'sedang', 'menjual', 'harga', 'turun',
  'otak', 'bertanya', 'apakah', 'bahaya', 'tahu', 'kita', 'ikut', 'menjual', 'penjualan', 'membuat', 'harga', 'turun', 'lebih', 'dalam', 'penurunan', 'semakin',
  'dalam', 'orang', 'berikutnya', 'semakin', 'takut', 'padang', 'rumput', 'berlari', 'singa', 'lebih', 'besar', 'tapi', 'pasar', 'penjualan', 'memperdalam',
  'penurunan', 'penurunan', 'singa', 'baru', 'ihsg', 'kemudian', 'pulih', 'tapi', 'orang', 'menjual', 'puncak', 'kepanikan', 'mengubah', 'ketakutan', 'bersama',
  'menjadi', 'kerugian', 'pribadi'], BATAS.s8 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  bagian: n(), berikutnya: n(), panik: n(), menjual: n(), turun: n(), maret: n(), tahun: n(), kasus: n(), covid: n(), pertama: n(), diumumkan: n(), indonesia: n(),
  informasi: n(), lockdown: n(), psbb: n(), berubah: n(), investor: n(), asing: n(), menjual2: n(), ihsg: n(), turun2: n(), v6300: n(), v3900: n(), dalam: n(),
  bulan: n(), perdagangan: n(), dihentikan: n(), sementara: n(), sebanyak: n(), enam: n(), kali: n(), ketakutan: n(), menyebar: n(), berita: n(), buruknya: n(),
  orangOrang: n(), melihat: n(), semua: n(), orang: n(), sedang: n(), menjual3: n(), harga: n(), turun3: n(), otak: n(), bertanya: n(), apakah: n(), bahaya: n(),
  tahu: n(), kita: n(), ikut: n(), menjual4: n(), penjualan: n(), membuat: n(), harga2: n(), turun4: n(), lebih: n(), dalam2: n(), penurunan: n(), semakin: n(),
  dalam3: n(), orang2: n(), berikutnya2: n(), semakin2: n(), takut: n(), padang: n(), rumput: n(), berlari: n(), singa: n(), lebih2: n(), besar: n(), tapi: n(),
  pasar: n(), penjualan2: n(), memperdalam: n(), penurunan2: n(), penurunan3: n(), singa2: n(), baru: n(), ihsg2: n(), kemudian: n(), pulih: n(), tapi2: n(),
  orang3: n(), menjual5: n(), puncak: n(), kepanikan: n(), mengubah: n(), ketakutan2: n(), bersama: n(), menjadi: n(), kerugian: n(), pribadi: n(),
};
export const S08_T = T;
const AWAL = BATAS.s8, AKHIR = BATAS.s9;
/** waktu swipe keluar LINEAR 60 f berpusat di `t` — swipeOff sudah meng-ease inOut */
const lin60 = (f: number, t: number) => R(f, t - 30, t + 30, 0, 1, (x) => x);

/* ════════════════════════════ WAKTU ════════════════════════════ */
const tA = { morf: AWAL + 60 }; // kartu S07 → kartu IHSG: mulai saat benda S07 setengah keluar (tepi kartu tak pernah menyentuh benda yang masih tampak)
const tB = { maret: T.maret, notif: [T.kasus - 10, T.lockdown - 10, T.asing - 10], notifKeluar: T.ihsg - 20, geser: T.kasus - 30, kembali: T.ihsg };
const HALT = [0, 1, 2, 3, 4, 5].map((k) => lerp(T.perdagangan, T.kali - 4, k / 5));
const tC = { pin6300: T.v6300, pin3900: T.v3900 + 10, teks: [T.v3900 + 14, T.enam], teksKeluar: T.harga - 20 };
/** C–D: TEKS LAYAR masuk → papan TURUN 60 px memberi ruang LEBIH DULU (Simon 30 Okt "Ya, geser papan": dulu judul di pita logo y 56, ujung kanan 52 px
 *  dari logo, isi berpusat y ±453). Satu geser tak bisa memusatkan C (judul + kartu, ±9 dtk) DAN D (+ investor di bawah): judul y 170 + turun 60 → terukur
 *  C dy ±−45 · D dy ±+45 (dengan turun 24: C −86 · D +4). Selesai tepat saat kata pertama mulai naik; papan naik kembali BERSAMAAN kartu menepi ke kanan
 *  untuk kamu (E, satu gerak). Teks layar keluar 40 f lebih awal dari penanda (sudah hilang sebelum tepi atas kartu yang naik mencapai barisnya). */
const TURUN_C8 = 60, JUDUL_C8 = 170;
const tD = { orang: [0, 1, 2, 3].map((k) => T.orangOrang - 20 + 12 * k), mata: T.melihat, jual: [0, 1, 2, 3].map((k) => T.semua + 22 * k) };
const tE = { geser: T.harga - 20, kamu: T.harga, tanya: T.apakah - 10, jualMuncul: T.ikut - 20, jual: T.menjual4 + 6, dalam: T.lebih, berikut: T.berikutnya2,
  panik: T.semakin2, jualBerikut: T.takut + 6 };
/* F: benda keluar SESUDAH klik orang berikutnya selesai; kartu ber-morf jadi panel padang di tengah pop keluar, lalu kembali */
const tF = { keluar: T.padang + 4, morf: T.padang + 34, pelari: [T.padang + 50, T.berlari + 30, T.berlari + 50, T.berlari + 70], bingkai: T.singa, sama: T.lebih2,
  panelKeluar: T.tapi - 20, kembali: T.pasar + 20, lembah: T.memperdalam, singa: T.singa2 - 10, singaKeluar: T.ihsg2 - 30 };
/* G: chip JUAL kamu & investor keluar → kamu TURUN dulu ke baris bawah kartu, lalu bergeser ke kanan bersamaan kartu melebar (dulu jalur lurus diagonal
 *  melintasi chip JUAL & sudut kiri-bawah kartu) → candle pemulihan tumbuh (chart menyusut) */
const tG = { investorKeluar: T.ihsg2 - 30, jualKamuKeluar: T.ihsg2 - 70, turun: T.ihsg2 - 30, geser: T.ihsg2 + 15, lebar: T.ihsg2 + 20, pulih: [T.ihsg2 + 18, T.ihsg2 + 178] as const, pin: T.menjual5, uang: T.puncak,
  rugi: T.kerugian - 10 };
const PELARI = simPelari(tF.pelari, AWAL, AKHIR + 80 - AWAL);
/** KELUAR (Simon 29 Okt: "Transisi dari scene 8 ke scene 9 gunakan shape 2 persegi"; dulu kartu ber-morf jadi lingkaran pembuka S09): seluruh adegan
 *  NAIK −320 px × lin³ selama 60 f mulai AKHIR (ease-in) sementara dua bilah Scene 09 (turkis · turkis muda) naik menutupnya = resep kotak S04 / S07 */
const naikLama = (f: number) => (f > AKHIR ? -320 * R(f, AKHIR, AKHIR + 60, 0, 1, (x) => x) ** 3 : 0);

/* ════════════════════════════ CHART IHSG HARIAN (resep video TA) ════════════════════════════ */
const D = IHSG_HARIAN_S08;
const iTgl = (t: string) => D.findIndex((b) => b.t === t);
const I_LEMBAH = iTgl('2020-03-24');
const DASAR = iTgl('2020-03-02'); // 2 Des 2019 – 28 Feb 2020 sudah tampak saat kartu jadi
const N_JENDELA = 62;
const KIRI = I_LEMBAH + 1 - N_JENDELA; // candle paling kiri saat lembah terbentuk (23 Des 2019) = tepi kiri tampilan setahun di G
/** jadwal tumbuh tiap candle Maret (di kata yang menyebutnya) + pemulihan 26 Mar – 30 Des (G) */
const ruas = (i0: number, i1: number, mulai: number, akhir: number) =>
  Array.from({ length: i1 - i0 + 1 }, (_, k) => ({ mulai: mulai + ((akhir - mulai) * k) / (i1 - i0 + 1), d: (akhir - mulai) / (i1 - i0 + 1) }));
const JADWAL = [
  ...ruas(DASAR, DASAR, T.kasus, T.kasus + 24), // 2 Mar
  ...ruas(DASAR + 1, DASAR + 4, T.lockdown - 10, T.lockdown + 94), // 3–6 Mar
  ...ruas(iTgl('2020-03-09'), iTgl('2020-03-11'), T.asing - 10, T.asing + 62), // 9–11 Mar
  ...ruas(iTgl('2020-03-12'), I_LEMBAH, T.ihsg, T.v3900 + 10), // 12–24 Mar
  ...ruas(I_LEMBAH + 1, D.length - 1, tG.pulih[0], tG.pulih[1]), // pemulihan
];
const posP = posisiGulir(DASAR, JADWAL);
/** jumlah candle di jendela: 62 (bergulir) → saat pemulihan jendela ikut memanjang dari 23 Des 2019 (zoom out, tanpa gulir) */
const nSlot = (f: number) => Math.max(N_JENDELA, posP(f) - KIRI);
/** ruang kosong kanan (slot): 1 → 18 sesudah lembah terbentuk (±200 px untuk penanda ±3.900, "▼ lebih dalam" 188 px, singa baru — tanpa menutup kolom
 *  label harga) → 1 saat kartu melebar */
const ruangKanan = (f: number) => 1 + 17 * cin(f, T.v3900 - 40) * (1 - cin(f, tG.lebar)); // selesai membuka sebelum penanda ±3.900 pop (dulu sempat menutup label 4.000)
const domP = domainGulir(D, posP, nSlot, AWAL - 20, AKHIR + 120);
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const tanggal = (t: string) => { const [y, m] = t.split('-').map(Number); return `${BULAN[m - 1]} ${y}`; };
const angka = (v: number) => Math.round(v).toLocaleString('id-ID');
const KISI = [3500, 4000, 4500, 5000, 5500, 6000, 6500];
/** label harga 17 px: abu brand + Midnight 22 % (≈ 4,7:1; dulu abu 3,2:1 — aturan teks berwarna digelapkan, disetujui Simon 28 Okt di S04) */
const ABU_TEKS = mixHex(B.gray, B.night, 0.22);
/** geometri plot di dalam kartu w × h (kolom label harga 86 px di kanan, di dalam kartu) */
const plot = (w: number, h: number) => ({ x: 30, y: 100, w: w - 30 - 86, h: h - 130 });
/** posisi candle & skala harga pada f (koordinat lokal kartu w × h) */
const skalaChart = (f: number, w: number, h: number) => {
  const P = plot(w, h), kanan = ruangKanan(f), slot = P.w / (nSlot(f) + kanan), xKanan = P.w - kanan * slot;
  const [lo, hi] = domP(f);
  const pos = posP(f);
  const X = (k: number) => P.x + xKanan - slot * (pos - k - 0.5);
  const Y = (v: number) => P.y + P.h - 8 - ((P.h - 16) * (v - lo)) / (hi - lo);
  return { P, slot, xKanan, pos, X, Y };
};
/** kaki penurunan yang disorot tiap gelombang JUAL (investor 1–4) · kaki terdalam (kamu & orang berikutnya) */
const KAKI: [number, number][] = [[iTgl('2020-03-09'), iTgl('2020-03-09')], [iTgl('2020-03-12'), iTgl('2020-03-12')], [iTgl('2020-03-16'), iTgl('2020-03-17')],
  [iTgl('2020-03-18'), iTgl('2020-03-19')]];
const KAKI_DALAM: [number, number] = [iTgl('2020-03-23'), I_LEMBAH];

const ChartIhsg: React.FC<{ f: number; w: number; h: number; sorot: { kaki: [number, number]; s: number }[]; halt: number; lembah: number }> = ({ f, w, h, sorot, halt, lembah }) => {
  const { P, slot, xKanan, pos, X, Y } = skalaChart(f, w, h);
  const lilin = lilinGulir(D, pos, 0, xKanan, slot);
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* kisi harga: memudar di dekat tepi area (tanpa muncul tiba-tiba saat domain bergeser) */}
      {KISI.map((v) => {
        const y = Y(v), a = Math.min(1, Math.max(0, (Math.min(y - P.y, P.y + P.h - y) - 14) / 20));
        return a <= 0 ? null : (
          <g key={v} opacity={a}><line x1={P.x} x2={P.x + P.w} y1={y} y2={y} stroke={B.grayLite} strokeWidth={1.5} opacity={0.7} />
            <text x={P.x + P.w + 14} y={y + 6} fontFamily={F} fontSize={17} fontWeight={700} fill={ABU_TEKS}>{angka(v)}</text></g>);
      })}
      {/* lembah penurunan menyala (F: penurunan menjadi "singa" baru) */}
      {lembah > 0 ? <rect x={X(KAKI[0][0]) - slot} y={Y(5450)} width={X(I_LEMBAH) - X(KAKI[0][0]) + 2 * slot} height={Y(3850) - Y(5450)} rx={10}
        fill={rgba(ARAH.turun, 0.12 * lembah)} /> : null}
      {sorot.map(({ kaki: [a, b], s }, k) => s <= 0.001 ? null : (
        <rect key={k} x={X(a) - slot * 0.9} y={Y(Math.max(...D.slice(a, b + 1).map((c) => c.h))) - 10} width={X(b) - X(a) + slot * 1.8}
          height={Y(Math.min(...D.slice(a, b + 1).map((c) => c.l))) - Y(Math.max(...D.slice(a, b + 1).map((c) => c.h))) + 20} rx={6} fill={rgba(ARAH.turun, 0.22 * s)} />))}
      <g transform={`translate(${P.x} 0)`}>
        {lilin.map(({ c, x, alfa }) => <BatangLilin key={c.t} c={c} x={x} slot={slot} Y={Y} alfa={alfa} sumbu={slot < 9 ? 1.5 : 2} rx={slot < 9 ? 0.75 : 1.5} />)}
      </g>
      {/* TRADING HALT: tirai merah tipis di atas plot selama perdagangan dihentikan (60 f masuk / keluar) */}
      {halt > 0.001 ? <rect x={P.x} y={P.y - 10} width={P.w} height={P.h + 20} rx={14} fill={rgba(ARAH.turun, 0.08 * halt)} /> : null}
    </svg>);
};
/** isi kartu IHSG w × h: judul (IHSG · nilai · bulan) + chart + pil TRADING HALT */
const IsiIhsg: React.FC<{ f: number; w: number; h: number; sorot: { kaki: [number, number]; s: number }[]; halt: number; lembah: number }> = ({ f, w, h, sorot, halt, lembah }) => {
  const pos = posP(f), L = Math.min(D.length - 1, Math.floor(pos)), u = pos - L;
  const akhir = u > 0.001 && L < D.length ? L : L - 1; // candle terakhir yang tampak (yang sedang tumbuh)
  const nilai = akhir === L ? lerp(D[L].o, D[L].c, Math.max(0.05, u)) : D[akhir].c;
  const haltK = HALT.filter((t) => f >= t).length;
  const haltP = popIn(f, HALT[0]) * popOut(f, tC.teksKeluar);
  const tik = Math.max(0, ...HALT.map((t) => tekanPada(f, t + 4))); // tiap halt: angka berdetak (resep tekan 8 + 12 f)
  return (
    <>
      <div style={{ position: 'absolute', left: 30, top: 20, display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: F, fontWeight: 800 }}>
        <span style={{ fontSize: 30, color: B.gray }}>IHSG</span>
        <span style={{ fontSize: 44, color: B.night }}>{angka(nilai)}</span>
        <span style={{ fontSize: 24, color: B.blue }}>{tanggal(D[akhir].t)}</span>
      </div>
      <ChartIhsg f={f} w={w} h={h} sorot={sorot} halt={halt} lembah={lembah} />
      {haltP > 0 ? (
        <div style={{ position: 'absolute', right: 26, top: 22, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 999,
          background: ARAH.turun, color: B.white, fontFamily: F, fontWeight: 800, fontSize: 24, letterSpacing: '.04em', transformOrigin: 'center',
          transform: `scale(${skalaPop(haltP) * (1 - 0.06 * tik)})` }}>
          <span style={{ display: 'inline-flex', gap: 4 }}><span style={{ width: 6, height: 22, background: B.white, borderRadius: 2 }} /><span style={{ width: 6, height: 22, background: B.white, borderRadius: 2 }} /></span>
          TRADING HALT {Math.max(1, haltK)}/6</div>) : null}
    </>);
};

/* ════════════════════════════ TATA LETAK ════════════════════════════ */
/** kartu IHSG A–E: 1040 × 450, puncak y 210 (sama dengan kartu S07 — di luar zona logo y ≤ 204) */
const KARTU = { y: 435, w: 1040, h: 450 };
/** G: kartu melebar sampai area aman (96–1824) */
const W_G = 1728;
/** B: kartu + celah 70 + notifikasi 420 berpusat di x 960 */
const X_B = 715, NOTIF = { x: 1515, w: 420, y: [331, 435, 539] };
/** E: gelembung (190–630) + kartu (680–1720) berpusat di x 955 (dulu isi bergeser 69 px ke kiri) */
const X_E = 1200;
const KAMU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const KM_E = { x: 410, y: 470, D: 250 };
/** G: kamu Ø170 + chip "Kerugian terkunci" (250 px) sebaris di bawah kartu, berpusat di x 960; puncak kepala foto 16 px di bawah kartu, lingkaran di atas
 *  pita subtitle (≤ 925) */
const KM_G = { x: 823, y: 822, D: 170 };
const LEBAR_CHIP = { tiga9: 116, dalam: 188, jual: 144, rugi: 250 };
const JARAK = 16;
const INV = { chip: KARTU.y + KARTU.h / 2 + JARAK + 22, y: KARTU.y + KARTU.h / 2 + JARAK + 44 + JARAK + 50, d: 100 };

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= AKHIR + 70) return null;
  // ekor: tidak ada pop keluar — semua ikut naik bersama adegan (dua bilah Scene 09 menutupnya)
  const keluar = 1;
  /* geometri kartu: morf dari kartu S07 → tengah (A) → kiri (B, memberi ruang notifikasi) → tengah (C/D) → kanan (E, memberi ruang kamu) → selebar layar (G);
   * di F ber-morf jadi panel padang dan kembali */
  const g7 = cin(f, tA.morf);
  const kiri = cin(f, tB.geser) * (1 - cin(f, tB.kembali));
  const kanan = cin(f, tE.geser) * (1 - cin(f, tG.lebar));
  const w8 = lerp(KARTU.w, W_G, cin(f, tG.lebar));
  const x8 = 960 + (X_B - 960) * kiri + (X_E - 960) * kanan;
  const morf = cin(f, tF.morf) * (1 - cin(f, tF.kembali));
  const kx = lerp(lerp(CX7, x8, g7), PANEL.x, morf), ky = lerp(lerp(CH7.y + TURUN_E7, KARTU.y, g7), PANEL.y, morf); // kartu S07 sudah turun TURUN_E7
  const kw = lerp(lerp(CH7.w, w8, g7), PANEL.w, morf), kh = lerp(lerp(CH7.h, KARTU.h, g7), PANEL.h, morf);
  const kr = 32;
  const isi07 = 1 - cin(f, tA.morf - 15);
  const isiIhsg = cin(f, tA.morf + 15) * (1 - cin(f, tF.morf - 15) + cin(f, tF.kembali + 15));
  const isiPadang = cin(f, tF.morf + 15) * (1 - cin(f, tF.kembali - 15));
  /* koordinat layar candle IHSG (isi kartu digambar seukuran kartu A–G, berpusat di kartu) */
  const sk = skalaChart(f, w8, KARTU.h);
  const xC = (k: number) => x8 - w8 / 2 + sk.X(k), yC = (v: number) => KARTU.y - KARTU.h / 2 + sk.Y(v);
  const xLembah = xC(I_LEMBAH);

  /* sorot kaki: tiap gelombang JUAL menyala 60 f, bertahan, padam 60 f */
  const nyala = (t: number) => cin(f, t + 36) * (1 - cin(f, t + 156));
  const sorot = [...tD.jual.map((t, k) => ({ kaki: KAKI[k], s: nyala(t) })), { kaki: KAKI_DALAM, s: Math.max(nyala(tE.jual), nyala(tE.jualBerikut)) }];
  const halt = cin(f, HALT[0]) * (1 - cin(f, HALT[5] + 60));
  const lembah = cin(f, tF.lembah) * (1 - cin(f, tF.singaKeluar));

  /* benda yang keluar untuk panel padang (F) lalu masuk lagi; investor juga keluar di G */
  const ada = (t: number) => t < tF.keluar ? popIn(f, t) * popOut(f, tF.keluar) + popIn(f, tF.kembali + 30) * keluar : popIn(f, t) * keluar;
  const nOrang = 5;
  const ruang5 = cin(f, tE.berikut - 10);
  const xOrang = (k: number) => x8 + (k < 4 ? lerp(-330 + 220 * k, -440 + 220 * k, ruang5) : 440);
  const invKeluar = popOut(f, tG.investorKeluar);
  /* kamu: E kiri (Ø250) → G turun ke baris bawah (Ø200) */
  const turun = cin(f, tG.turun), geserG = cin(f, tG.geser);
  const km = { x: lerp(KM_E.x, KM_G.x, geserG), y: lerp(KM_E.y, KM_G.y, turun), D: lerp(KM_E.D, KM_G.D, turun) };
  const kamuP = ada(tE.kamu);
  const kepala = { x: km.x - 4, atas: km.y - (KAMU.cy - 22) * (km.D / 2 / KAMU.r) };
  const kamuJualY = KM_E.y + KM_E.D / 2 + JARAK + 25; // celah 16 px dari lingkaran (chip size 24 tinggi ±48)
  const singaP = popIn(f, tF.singa) * popOut(f, tF.singaKeluar);
  const sama = popIn(f, tF.sama) * popOut(f, tF.panelKeluar);

  const naik = naikLama(f);
  const turunC = TURUN_C8 * cin(f, tC.teks[0] - 75) * (1 - cin(f, tE.geser));
  return (
    <div style={{ position: 'absolute', inset: 0, transform: naik < 0 ? `translate3d(0, ${naik}px, 0)` : undefined }}>
      {/* ═════ PAPAN (semua kecuali teks layar) — turun memberi ruang teks layar C ═════ */}
      <div style={{ position: 'absolute', inset: 0, transform: turunC > 0 ? `translate3d(0, ${turunC}px, 0)` : undefined }}>
      {/* ═════ kartu: S07 → IHSG ↔ panel padang (SATU bentuk) ═════ */}
      {true ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: kw, height: kh, transform: `translate3d(${kx - kw / 2}px, ${ky - kh / 2}px, 0)` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: kr, overflow: 'hidden', boxShadow: bayanganKaca(B.blue),
            background: `linear-gradient(165deg, ${rgba(B.white, 0.98)} 0%, ${rgba(B.white, 0.9)} 100%)` }}>
            {isi07 > 0.001 ? <div style={{ position: 'absolute', left: (kw - CH7.w) / 2, top: (kh - CH7.h) / 2, width: CH7.w, height: CH7.h,
              opacity: isi07 < 1 ? isi07 : undefined }}><IsiChartS07 f={f} /></div> : null}
            {isiPadang > 0.001 ? (
              <div style={{ position: 'absolute', left: (kw - 1920 * PANEL.k) / 2, top: kh - 1080 * PANEL.k + 40 * (kh / PANEL.h), opacity: isiPadang < 1 ? isiPadang : undefined,
                background: '#B9E3CB', width: 1920 * PANEL.k, height: 1080 * PANEL.k }}>
                <PanelPadang f={f} pelari={PELARI} tPelari={tF.pelari} tBingkai={tF.bingkai} awal={AWAL} />
              </div>) : null}
            {isiIhsg > 0.001 ? <div style={{ position: 'absolute', left: (kw - w8) / 2, top: (kh - KARTU.h) / 2, width: w8, height: KARTU.h,
              opacity: isiIhsg < 1 ? isiIhsg : undefined }}><IsiIhsg f={f} w={w8} h={KARTU.h} sorot={sorot} halt={halt} lembah={lembah} /></div> : null}
          </div>
          {morf > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: 32, boxShadow: `inset 0 0 0 ${SISI * morf}px ${B.white}` }} /> : null}
          {/* tepi biru lingkaran Scene 09 menebal bersama morf keluar */}
        </div>) : null}
      {sama > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 90, height: 90, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.blue}`,
          boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: 52, lineHeight: 1, color: B.blue, transformOrigin: 'center',
          transform: `translate3d(${PANEL.x - PANEL.w / 2 + PANEL_LENCANA.sama.x - 45}px, ${PANEL.y - PANEL.h / 2 + PANEL_LENCANA.sama.y - 45}px, 0) scale(${skalaPop(sama)})`, boxShadow: bayanganDengan(B.blue, 1) }}>=</div>) : null}

      {/* ═════ penanda pada chart ═════ */}
      <Chip x={xC(iTgl('2020-01-13'))} y={yC(6200) + JARAK + 20} teks="±6.300" warna={B.blue} p={popIn(f, tC.pin6300) * popOut(f, tC.teksKeluar)} size={22} />
      <Chip x={xLembah + sk.slot / 2 + 12 + LEBAR_CHIP.tiga9 / 2} y={yC(3938)} teks="±3.900" warna={ARAH.turun} p={popIn(f, tC.pin3900) * popOut(f, tC.teksKeluar)} size={22} />
      <Chip x={xLembah + sk.slot / 2 + 12 + LEBAR_CHIP.dalam / 2} y={yC(3938)} teks="▼ lebih dalam" warna={ARAH.turun} p={popIn(f, tE.dalam) * popOut(f, tF.keluar)} size={22} />
      {/* di kiri-bawah lembah: tepi atas chip setinggi titik terendah (candle 17–20 Mar di kirinya lebih tinggi — tidak tertutup) */}
      <Chip x={xLembah - sk.slot / 2 - 10 - LEBAR_CHIP.jual / 2} y={yC(3912) + 22} teks="Jual di sini" warna={ARAH.turun} p={popIn(f, tG.pin) * keluar} size={22} />
      <Chip x={x8 - w8 / 2 + 120} y={KARTU.y + KARTU.h / 2 + JARAK + 24} teks="Maret 2020" ikon="kalender" warna={B.blue} p={popIn(f, tB.maret) * popOut(f, tB.kembali)} size={24} />

      {/* ═════ B: notifikasi — MUNCUL pop satu per satu, keluar swipe ke kanan (tetap) ═════ */}
      {[
        { ikon: 'kesehatan' as const, warna: ARAH.turun, judul: 'COVID-19', isi: 'Kasus pertama di Indonesia' },
        { ikon: 'rumor' as const, warna: B.orange, judul: 'Lockdown? PSBB?', isi: 'Kebijakan terus berubah' },
        { ikon: 'jual' as const, warna: ARAH.turun, judul: 'Investor asing', isi: 'Terus menjual' },
      ].map((nf, k) => {
        const masuk = popIn(f, tB.notif[k]);
        return masuk <= 0.001 ? null : (
          <div key={k} style={{ position: 'absolute', inset: 0, transformOrigin: `${NOTIF.x}px ${NOTIF.y[k]}px`, transform: masuk < 0.9999 ? `scale(${skalaPop(masuk)})` : undefined }}>
            <Notifikasi x={NOTIF.x} y={NOTIF.y[k]} arah="kanan" p={1 - lin60(f, tB.notifKeluar + 8 * k)} ikon={nf.ikon} warna={nf.warna} judul={nf.judul} isi={nf.isi} w={NOTIF.w} />
          </div>);
      })}

      {/* ═════ D/E: investor melihat → JUAL diklik ═════ */}
      {Array.from({ length: nOrang }, (_, k) => {
        const tMuncul = k < 4 ? tD.orang[k] : tE.berikut;
        const tJual = k < 4 ? tD.jual[k] : tE.jualBerikut;
        const p = ada(tMuncul) * invKeluar;
        return (
          <React.Fragment key={k}>
            <Avatar x={xOrang(k)} y={INV.y} d={INV.d} p={p} warna={k === 4 ? B.orange : B.gray} />
            {k < 4 ? <Lencana x={xOrang(k)} y={INV.y} d={INV.d} p={ada(tD.mata + 6 * k) * invKeluar} warna={B.blue} ikon="mata" besar={46} />
              : <Lencana x={xOrang(k)} y={INV.y} d={INV.d} p={ada(tE.panik) * invKeluar} warna={ARAH.turun} teks="!" besar={46} />}
            <Klik f={f} x={xOrang(k)} y={INV.chip} t={[tJual]} warna={ARAH.turun}>
              <Chip x={xOrang(k)} y={INV.chip} teks="JUAL" warna={ARAH.turun} p={ada(tJual - 40) * invKeluar} size={22} />
            </Klik>
          </React.Fragment>);
      })}

      {/* ═════ E/G: kamu (menghadap kanan, tanpa label) ═════ */}
      <KarakterLingkar pose={KAMU} x={km.x} y={km.y} D={km.D} s={kamuP} warna={B.turq} cermin />
      <Kutipan x={kepala.x} y={kepala.atas - JARAK - 20 - 44} ekor="tengah" lebarMaks={440} teks="Apakah ada bahaya yang belum saya tahu?"
        p={popIn(f, tE.tanya) * popOut(f, tF.keluar)} warna={ARAH.turun} size={24} />
      <Klik f={f} x={KM_E.x} y={kamuJualY} t={[tE.jual]} warna={ARAH.turun}>
        <Chip x={KM_E.x} y={kamuJualY} teks="JUAL" warna={ARAH.turun} p={ada(tE.jualMuncul) * popOut(f, tG.jualKamuKeluar)} size={24} />
      </Klik>
      {/* G: kamu di luar pasar memegang uang · kerugian terkunci */}
      {/* lencana uang di LUAR lingkaran kiri-atas (dulu di tepi kanan-atas menimpa bahu; kanan dipakai chip "Kerugian terkunci") */}
      <Bulat x={luarLingkaran(km.x, km.y, km.D, 78, -140)[0]} y={luarLingkaran(km.x, km.y, km.D, 78, -140)[1]} d={78} warna={B.turq} ikon="tumpukanKoin" p={popIn(f, tG.uang) * keluar} />
      <Chip x={KM_G.x + KM_G.D / 2 + 24 + LEBAR_CHIP.rugi / 2} y={KM_G.y} teks="Kerugian terkunci" warna={ARAH.turun} p={popIn(f, tG.rugi) * keluar} size={24} />

      {/* ═════ F: singa baru di ruang kosong kanan lembah ═════ */}
      {singaP > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs><filter id="s08-siluet" x="-10%" y="-10%" width="120%" height="120%"><feFlood floodColor="#3A3442" /><feComposite in2="SourceAlpha" operator="in" /></filter></defs>
          <g transform={`translate(${xLembah + 80} ${yC(3800)}) scale(${skalaPop(singaP)}) translate(${-(xLembah + 80)} ${-yC(3800)})`}>
            <g filter="url(#s08-siluet)" opacity={0.9}><SingaRig pose={POSE_DIAM_SINGA()} x={xLembah + 24} tanah={yC(3800)} s={0.14} bayangan={false} /></g>
          </g>
        </svg>) : null}
      </div>

      {/* ═════ C: TEKS LAYAR — y 170 (dulu 56, di pita logo) ═════ */}
      {f >= tC.teks[0] - 45 && f < tC.teksKeluar + 60 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: JUDUL_C8, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <WordText f={f} at={tC.teks[0]} until={tC.teksKeluar - 40} style={{ fontFamily: F, fontSize: 50, fontWeight: 800, color: B.night }}>IHSG: ±6.300 → ±3.900</WordText>{' '}
          <WordText f={f} at={tC.teks[1]} until={tC.teksKeluar - 40} style={{ fontFamily: F, fontSize: 50, fontWeight: 800, color: ARAH.turun }}>· 6 kali trading halt</WordText>
        </div>) : null}
    </div>);
};
