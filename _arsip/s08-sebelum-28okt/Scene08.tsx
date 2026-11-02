import React from 'react';
import { ARAH, B, F, R, SISI, bayanganDengan, lerp, rgba } from '../theme';
import { cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Label, Lencana } from '../parts/umum';
import { Kaca, KarakterLingkar, type PoseKarakter } from '../parts/kaca';
import { Notifikasi } from '../parts/nyata';
import { Avatar } from '../parts/v06';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { SingaRig, POSE_DIAM_SINGA } from '../flat/rigSinga';
import { PANEL, PanelPadang, simPelari } from '../s07/Scene07';
import { IHSG_MINGGUAN } from '../data/ihsgMingguan2020.gen';

/**
 * SCENE 08 — Saat Harga Turun, Kepanikan Memperdalam Penurunan (BATAS.s8 – BATAS.s9). GAYA RUMAH (bukan analogi; sisipan padang rumput = panel flat).
 * SATU chart IHSG berkelanjutan = data RIIL mingguan Des 2019 – Des 2020 (Yahoo ^JKSE harian, agregasi Senin-awal; src/data/ihsgMingguan2020.gen.ts).
 * Terverifikasi dari data harian: tutup ±6.300 (6.284–6.329 akhir Des 2019 – awal Jan 2020) → tutup terendah 3.938 (24 Mar 2020; intraday 3.912);
 * hari dengan penurunan intraday ≥ 5 % (ambang trading halt) di Maret 2020: 12, 13, 17, 19, 23, 30 → 6 kali.
 *  A f18015–18218 chart IHSG di ±6.300 (Des 2019) muncul di tengah.
 *  B f18233–18856 penanda "Maret 2020"; notifikasi SATU per SATU (kasus pertama COVID-19 · lockdown/PSBB berubah · asing jual bersih); chart berjalan ke
 *    awal Maret (langkah 1).
 *  C f18880–19425 chart turun BERTAHAP ke ±3.900 (candle 23 Mar berhenti di titik terendahnya), penanda ±6.300 / ±3.900; indikator TRADING HALT berdenyut
 *    1/6 → 6/6; TEKS LAYAR "IHSG: ±6.300 → ±3.900 · 6 kali trading halt" (langkah 2 & 4).
 *  D f19444–19895 investor melihat (ikon mata), lalu JUAL berurutan — tiap gelombang jual menyorot satu kaki penurunan (langkah 3).
 *  E f19910–20671 kamu: "Apakah ada bahaya yang belum saya tahu?" → ikut JUAL → kaki terdalam menyala "▼ lebih dalam" → orang berikutnya panik "!" & JUAL
 *    (langkah 5).
 *  F f20696–21202 panel padang (pelari bertambah, singa tetap "=") → kembali ke chart: lembah penurunan menyala & siluet "singa" baru muncul di lembah
 *    (langkah 6).
 *  G f21220–21587 chart PULIH bertahap sampai Des 2020; kamu di luar pasar memegang uang, penanda "Jual" di lembah, chip "Kerugian terkunci" (langkah 7–8).
 * ⚠ Dokumen: angka, tanggal, jumlah trading halt diverifikasi sebelum render final — tanggal halt di atas dari data harga, belum dari pengumuman BEI.
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
const EKOR = AKHIR + 30;
/** waktu swipe LINEAR 60 f berpusat di `t` — swipeOff sudah meng-ease inOut (dulu cin 40 f → easing ganda & 40 f) */
const lin60 = (f: number, t: number) => R(f, t - 30, t + 30, 0, 1, (x) => x);
const KAMU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };

/* ════════════════════════════ CHART IHSG (RIIL) ════════════════════════════ */
const D = IHSG_MINGGUAN;
const NB = D.length;
const I_LEMBAH = D.findIndex((b) => b.t === '2020-03-23'); // minggu titik terendah (24 Mar)
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const tanggal = (t: string) => { const [y, m] = t.split('-').map(Number); return `${BULAN[m - 1]} ${y}`; };
const angka = (v: number) => Math.round(v).toLocaleString('id-ID');
/** jumlah batang terungkap (pecahan = candle terakhir sedang terbentuk). Simon 27 Okt (screenshot): chart dulu muncul dengan 6 candle di pojok kiri,
 * candle setipis garis, label "Jan 2020" bentrok dengan chip "Maret 2020". Kini: 13 minggu (Des 2019 – Feb 2020) sudah tampak saat chart muncul,
 * lalu tiap minggu Maret terbentuk di katanya — 2 Mar (kasus COVID-19 pertama), 9 Mar (lockdown/PSBB), 16 Mar (asing menjual), 23 Mar sampai titik
 * terendah (3.900) — dan pemulihan Apr–Des di "IHSG kemudian pulih". */
const DASAR = 13;
const RUAS: [number, number, number][] = [ // [mulai, selesai, jumlah batang]
  [T.maret - 10, T.covid + 20, 1], [T.informasi - 10, T.berubah + 10, 1], [T.investor - 10, T.menjual2 + 20, 1], [T.ihsg, T.v3900 + 20, 0.5],
  [T.ihsg2, 21430, NB - (I_LEMBAH + 0.5)]];
const tampil = (f: number) => RUAS.reduce((g, [a, b, n]) => g + n * cin(f, (a + b) / 2, b - a), DASAR);
/** candle yang sedang terbentuk: buka → terendah (separuh pertama) → tertinggi → tutup */
const bentuk = (b: { o: number; h: number; l: number; c: number }, u: number) => {
  const c = u < 0.5 ? lerp(b.o, b.l, u / 0.5) : lerp(b.l, b.c, (u - 0.5) / 0.5);
  return { o: b.o, c, h: Math.max(b.o, c, u > 0.75 ? b.h : Math.max(b.o, c)), l: Math.min(b.o, c, u >= 0.5 ? b.l : c) };
};
const CH = { y: 420, w: 1040, h: 470 };
const IN = { x: 30, y: 100, w: CH.w - 30 - 86, h: CH.h - 130 }; // kolom label harga 86 px DI DALAM kartu (dulu label "6.000" melewati tepi kanan)
/** TAMPILAN chart mengikuti batang yang tampak (melihat 40 f ke depan, dihaluskan): jumlah slot = batang + ruang kanan, domain = rentang batang ± 8 % */
type Tampilan = { n: number; lo: number; hi: number };
const ruangKanan = (f: number) => (f < T.v3900 ? 2 : f < T.ihsg2 ? 5 : 1.5); // ruang kanan lembah untuk "singa baru" & chip
const TAMPILAN: Tampilan[] = (() => {
  const out: Tampilan[] = [];
  let v: Tampilan | null = null;
  for (let f = AWAL; f <= AKHIR + 80; f++) {
    const g = tampil(f + 40), nb = Math.min(NB, Math.ceil(g));
    let lo = Infinity, hi = -Infinity;
    for (let k = 0; k < nb; k++) { lo = Math.min(lo, D[k].l); hi = Math.max(hi, D[k].h); }
    const pad = Math.max(60, 0.08 * (hi - lo));
    const t: Tampilan = { n: Math.max(15, g + ruangKanan(f)), lo: lo - pad, hi: hi + pad };
    v = v ? { n: v.n + (t.n - v.n) * 0.05, lo: v.lo + (t.lo - v.lo) * 0.05, hi: v.hi + (t.hi - v.hi) * 0.05 } : t;
    out.push(v);
  }
  return out;
})();
const tampilan = (f: number) => TAMPILAN[Math.max(0, Math.min(TAMPILAN.length - 1, Math.round(f) - AWAL))];
const xBar = (k: number, v: Tampilan) => IN.x + (IN.w / v.n) * (k + 0.5);
const yNilai = (x: number, v: Tampilan) => IN.y + IN.h - ((x - v.lo) / (v.hi - v.lo)) * IN.h;
const KISI = [3500, 4000, 4500, 5000, 5500, 6000, 6500];
const ChartIhsg: React.FC<{ f: number; sorot: number[]; halt: number; lembah: number }> = ({ f, sorot, halt, lembah }) => {
  const v = tampilan(f), g = tampil(f);
  const penuh = Math.floor(g), u = g - penuh;
  const bar = D.slice(0, penuh).map((b) => ({ ...b }));
  if (u > 0 && penuh < NB) bar.push({ ...D[penuh], ...bentuk(D[penuh], u) });
  const slot = IN.w / v.n, X = (k: number) => xBar(k, v), Y = (x: number) => yNilai(x, v);
  return (
    <svg width={CH.w} height={CH.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {/* kisi harga: masuk/keluar memudar di tepi area saat domain melebar (tanpa muncul tiba-tiba) */}
      {KISI.map((x) => {
        const y = Y(x), a = Math.min(1, Math.max(0, (Math.min(y - IN.y, IN.y + IN.h - y) - 14) / 20)); // dekat tepi = tersembunyi (tanpa label samar)
        return a <= 0 ? null : (
          <g key={x} opacity={a}><line x1={IN.x} x2={IN.x + IN.w} y1={y} y2={y} stroke={B.grayLite} strokeWidth={1.5} opacity={0.7} />
            <text x={IN.x + IN.w + 14} y={y + 6} fontFamily={F} fontSize={17} fontWeight={700} fill={B.gray}>{angka(x)}</text></g>);
      })}
      {/* lembah penurunan menyala (F: penurunan menjadi "singa" baru) */}
      {lembah > 0 ? <rect x={X(12) - slot / 2} y={Y(5500)} width={slot * 5} height={Y(3700) - Y(5500)} rx={10} fill={rgba(ARAH.turun, 0.12 * lembah)} /> : null}
      {bar.map((b, k) => {
        const naik = b.c >= b.o, x = X(k), warna = naik ? ARAH.naik : ARAH.turun;
        const s = sorot[k] ?? 0;
        return (
          <g key={k}>
            {s > 0.01 ? <rect x={x - slot * 0.9} y={Y(b.h) - 10} width={slot * 1.8} height={Y(b.l) - Y(b.h) + 20} rx={6} fill={rgba(ARAH.turun, 0.22 * s)} /> : null}
            <line x1={x} x2={x} y1={Y(b.h)} y2={Y(b.l)} stroke={warna} strokeWidth={2} />
            <rect x={x - slot * 0.34} y={Y(Math.max(b.o, b.c))} width={slot * 0.68} height={Math.max(2, Math.abs(Y(b.o) - Y(b.c)))} rx={1.5} fill={warna} />
          </g>);
      })}
      {/* TRADING HALT: jeda singkat = tirai merah tipis di atas chart */}
      {halt > 0.01 ? <rect x={IN.x} y={IN.y - 10} width={IN.w} height={IN.h + 20} rx={14} fill={rgba(ARAH.turun, 0.1 * halt)} /> : null}
    </svg>);
};

/* ════════════════════════════ WAKTU ════════════════════════════ */
const tB = { maret: T.maret, notif: [T.kasus - 10, T.lockdown - 10, T.asing - 10], notifKeluar: T.ihsg - 20, geser: T.kasus - 30, kembali: T.ihsg };
const tC = { pin6300: T.v6300, pin3900: T.v3900 + 10, halt: [0, 1, 2, 3, 4, 5].map((k) => lerp(T.perdagangan, T.kali - 4, k / 5)), teks: [T.v3900 + 14, T.enam],
  teksKeluar: T.harga - 20 };
const tD = { orang: [0, 1, 2, 3].map((k) => T.orangOrang - 20 + 12 * k), mata: T.melihat, jual: [0, 1, 2, 3].map((k) => T.semua + 22 * k) };
const tE = { kamu: T.harga, tanya: T.apakah - 10, tanyaKeluar: T.padang - 20, jual: T.menjual4, dalam: T.lebih, berikut: T.berikutnya2, panik: T.semakin2,
  jualBerikut: T.takut + 6 };
// panel = keluar + 60 → pop masuk mulai TEPAT saat chart selesai keluar (dulu bersamaan: panel menimpa chart yang sedang mengecil; tanpa frame kosong)
const tF = { keluar: T.padang - 16, panel: T.padang + 44, pelari: [T.padang + 50, T.berlari + 30, T.berlari + 50, T.berlari + 70], bingkai: T.singa, sama: T.lebih2,
  panelKeluar: T.tapi - 20, kembali: T.pasar + 20, lembah: T.memperdalam, singa: T.singa2 - 10, singaKeluar: T.ihsg2 + 20 };
const tG = { pin: T.menjual5, uang: T.puncak, rugi: T.kerugian - 10 };
const PELARI = simPelari(tF.pelari, AWAL, AKHIR + 80 - AWAL);

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= AKHIR + 70) return null;
  const keluar = popOut(f, EKOR);
  const grupP = popIn(f, T.bagian + 90) * popOut(f, tF.keluar) // +90: mulai SESUDAH ekor Scene 07 selesai keluar (dulu +60: tumpang di f18050)
    + popIn(f, tF.kembali) * keluar;
  /* tata letak: tengah → memberi ruang notifikasi (kiri) → tengah → memberi ruang kamu (kanan) */
  const kiri = cin(f, tB.geser) * (1 - cin(f, tB.kembali));
  const kanan = cin(f, tE.kamu - 20);
  const cx = 960 - 200 * kiri + 170 * kanan;
  const g = tampil(f);
  const iAkhir = Math.max(0, Math.min(NB - 1, Math.ceil(g) - 1)); // batang TERAKHIR yang tampak (dulu floor: "Mar 2020" sebelum minggu Maret terbentuk)
  const nilai = (() => { const k = Math.floor(g), u = g - k; return k < NB && u > 0 ? bentuk(D[k], u).c : D[Math.max(0, k - 1)].c; })();
  /* sorot kaki penurunan: tiap gelombang JUAL menyorot satu minggu turun (12…15), JUAL kamu → kaki terdalam (16) */
  const sorot: number[] = [];
  tD.jual.forEach((t, k) => { sorot[12 + k] = Math.sin(Math.PI * R(f, t + 6, t + 70, 0, 1, (x) => x)); });
  sorot[I_LEMBAH] = Math.max(Math.sin(Math.PI * R(f, tE.jual + 20, tE.jual + 110, 0, 1, (x) => x)), Math.sin(Math.PI * R(f, tE.jualBerikut + 6, tE.jualBerikut + 70, 0, 1, (x) => x)));
  const haltK = tC.halt.filter((t) => f >= t).length;
  const haltDenyut = Math.max(0, ...tC.halt.map((t) => Math.sin(Math.PI * R(f, t, t + 22, 0, 1, (x) => x))));
  const haltP = popIn(f, tC.halt[0]) * popOut(f, tC.teksKeluar);
  const lembah = cin(f, tF.lembah) * (1 - cin(f, tF.singaKeluar));

  const vw = tampilan(f);
  const xChart = (k: number) => cx - CH.w / 2 + xBar(k, vw);
  const yChart = (v: number) => CH.y - CH.h / 2 + yNilai(v, vw);
  const nOrang = 4 + (f >= tE.berikut - 30 ? 1 : 0);
  const ruang5 = cin(f, tE.berikut - 10);
  const xOrang = (k: number) => cx + (k < 4 ? lerp(-330 + 220 * k, -440 + 220 * k, ruang5) : 440);
  const kamuP = popIn(f, tE.kamu) * popOut(f, tF.keluar) + popIn(f, tF.kembali) * keluar;
  const panelP = popIn(f, tF.panel) * popOut(f, tF.panelKeluar);
  const singaP = popIn(f, tF.singa) * popOut(f, tF.singaKeluar);
  const jualDip = (t: number) => 1 - 0.12 * Math.sin(Math.PI * R(f, t, t + 24, 0, 1, (x) => x));

  return (
    <>
      {/* ═════ chart IHSG ═════ */}
      <Kaca x={cx} y={CH.y} w={CH.w} h={CH.h} p={grupP} warna={B.blue}>
        <div style={{ position: 'absolute', left: 30, top: 20, display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: F, fontWeight: 800 }}>
          <span style={{ fontSize: 30, color: B.gray }}>IHSG</span>
          <span style={{ fontSize: 44, color: B.night }}>{angka(nilai)}</span>
          <span style={{ fontSize: 24, color: B.blue }}>{tanggal(D[iAkhir].t)}</span>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0 }}><ChartIhsg f={f} sorot={sorot} halt={haltDenyut} lembah={lembah} /></div>
        {/* indikator TRADING HALT n/6 */}
        {haltP > 0 ? (
          <div style={{ position: 'absolute', right: 26, top: 22, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 999,
            background: ARAH.turun, color: B.white, fontFamily: F, fontWeight: 800, fontSize: 24, letterSpacing: '.04em', transformOrigin: 'right center',
            transform: `scale(${skalaPop(haltP) * (1 + 0.08 * haltDenyut)})` }}>
            <span style={{ display: 'inline-flex', gap: 4 }}><span style={{ width: 6, height: 22, background: B.white, borderRadius: 2 }} /><span style={{ width: 6, height: 22, background: B.white, borderRadius: 2 }} /></span>
            TRADING HALT {Math.max(1, haltK)}/6</div>) : null}
      </Kaca>
      {/* penanda ±6.300 / ±3.900 */}
      <Chip x={xChart(4)} y={yChart(5880)} teks="±6.300" warna={B.blue} p={popIn(f, tC.pin6300) * popOut(f, tC.teksKeluar) * grupP} size={22} />
      <Chip x={xChart(I_LEMBAH) + 70} y={yChart(3912) + 6} teks="±3.900" warna={ARAH.turun} p={popIn(f, tC.pin3900) * popOut(f, tC.teksKeluar) * grupP} size={22} />
      {/* penanda waktu */}
      <Chip x={cx - CH.w / 2 + 120} y={CH.y + CH.h / 2 + 40} teks="Maret 2020" ikon="kalender" warna={B.blue} p={popIn(f, tB.maret) * popOut(f, tB.kembali)} size={24} />

      {/* ═════ B: notifikasi satu per satu ═════ */}
      <Notifikasi x={1560} y={300} arah="kanan" p={lin60(f, tB.notif[0]) * (1 - lin60(f, tB.notifKeluar))} ikon="kesehatan" warna={ARAH.turun} judul="COVID-19" isi="Kasus pertama di Indonesia" w={420} />
      <Notifikasi x={1560} y={410} arah="kanan" p={lin60(f, tB.notif[1]) * (1 - lin60(f, tB.notifKeluar + 8))} ikon="rumor" warna={B.orange} judul="Lockdown? PSBB?" isi="Kebijakan terus berubah" w={420} />
      <Notifikasi x={1560} y={520} arah="kanan" p={lin60(f, tB.notif[2]) * (1 - lin60(f, tB.notifKeluar + 16))} ikon="jual" warna={ARAH.turun} judul="Investor asing" isi="Terus menjual" w={420} />

      {/* ═════ C: TEKS LAYAR ═════ */}
      {f >= tC.teks[0] - 40 && f < tC.teksKeluar + 60 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 56, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <WordText f={f} at={tC.teks[0]} until={tC.teksKeluar} style={{ fontFamily: F, fontSize: 50, fontWeight: 800, color: B.night }}>IHSG: ±6.300 → ±3.900</WordText>{' '}
          <WordText f={f} at={tC.teks[1]} until={tC.teksKeluar} style={{ fontFamily: F, fontSize: 50, fontWeight: 800, color: ARAH.turun }}>· 6 kali trading halt</WordText>
        </div>) : null}

      {/* ═════ D/E: investor melihat → JUAL ═════ */}
      {Array.from({ length: nOrang }, (_, k) => {
        const tMuncul = k < 4 ? tD.orang[k] : tE.berikut;
        const tJual = k < 4 ? tD.jual[k] : tE.jualBerikut;
        const p = popIn(f, tMuncul) * grupP;
        return (
          <React.Fragment key={k}>
            <Avatar x={xOrang(k)} y={800} d={100} p={p} warna={k === 4 ? B.orange : B.gray} />
            {k < 4 ? <Lencana x={xOrang(k)} y={800} d={100} p={popIn(f, tD.mata + 6 * k) * grupP} warna={B.blue} ikon="mata" besar={46} />
              : <Lencana x={xOrang(k)} y={800} d={100} p={popIn(f, tE.panik) * grupP} warna={ARAH.turun} teks="!" besar={46} />}
            <div style={{ position: 'absolute', inset: 0, transformOrigin: `${xOrang(k)}px 715px`, transform: `scale(${jualDip(tJual)})` }}>
              <Chip x={xOrang(k)} y={715} teks="JUAL" warna={ARAH.turun} p={popIn(f, tJual) * grupP} size={22} />
            </div>
          </React.Fragment>);
      })}
      <Chip x={xChart(I_LEMBAH) + 110} y={yChart(3880)} teks="▼ lebih dalam" warna={ARAH.turun} p={popIn(f, tE.dalam) * popOut(f, tF.keluar)} size={22} />

      {/* ═════ E/G: kamu ═════ */}
      <KarakterLingkar pose={KAMU} x={250} y={470} D={250} s={kamuP} warna={B.turq} />
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '250px 470px', transform: `scale(${skalaPop(Math.min(1, kamuP))})`, opacity: kamuP > 0.001 ? undefined : 0 }}>
        <Label x={250} y={632} teks="Kamu" f={f} at={tE.kamu + 20} keluar={EKOR - 20} size={32} />
      </div>
      <Kutipan x={700} y={134} teks="Apakah ada bahaya yang belum saya tahu?" p={popIn(f, tE.tanya) * popOut(f, tE.tanyaKeluar)} warna={ARAH.turun} size={28} />
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '250px 700px', transform: `scale(${jualDip(tE.jual)})` }}>
        <Chip x={250} y={700} teks="JUAL" warna={ARAH.turun} p={popIn(f, tE.jual) * kamuP} size={24} />
      </div>
      {/* G: kamu di luar pasar memegang uang; penanda jual di lembah; kerugian terkunci */}
      <Bulat x={250 + 90} y={470 - 90} d={78} warna={B.turq} ikon="tumpukanKoin" p={popIn(f, tG.uang) * keluar} />
      <Chip x={xChart(I_LEMBAH) - 120} y={yChart(3720)} teks="Jual di sini" warna={ARAH.turun} p={popIn(f, tG.pin) * keluar} size={22} />
      <Chip x={250} y={770} teks="Kerugian terkunci" warna={ARAH.turun} p={popIn(f, tG.rugi) * keluar} size={24} />

      {/* ═════ F: singa baru di lembah ═════ */}
      {singaP > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs><filter id="s08-siluet" x="-10%" y="-10%" width="120%" height="120%"><feFlood floodColor="#3A3442" /><feComposite in2="SourceAlpha" operator="in" /></filter></defs>
          {/* di ruang kosong KANAN lembah (pemulihan belum tergambar) — dulu menutupi candle lembah */}
          <g transform={`translate(${xChart(I_LEMBAH) + 110} ${yChart(3700)}) scale(${skalaPop(singaP)}) translate(${-(xChart(I_LEMBAH) + 110)} ${-yChart(3700)})`}>
            <g filter="url(#s08-siluet)" opacity={0.9}><SingaRig pose={POSE_DIAM_SINGA()} x={xChart(I_LEMBAH) + 40} tanah={yChart(3700)} s={0.14} bayangan={false} /></g>
          </g>
        </svg>) : null}

      {/* ═════ F: panel padang rumput (analogi) ═════ */}
      {panelP > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL.w, height: PANEL.h, transformOrigin: 'center',
          transform: `translate3d(${PANEL.x - PANEL.w / 2}px, ${PANEL.y - PANEL.h / 2}px, 0) scale(${skalaPop(panelP)})` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 32, overflow: 'hidden', border: `${SISI}px solid ${B.white}`, boxSizing: 'border-box',
            boxShadow: bayanganDengan(B.blue, 1), background: '#B9E3CB' }}>
            <div style={{ position: 'absolute', left: (PANEL.w - 1920 * PANEL.k) / 2, top: PANEL.h - 1080 * PANEL.k + 40 }}>
              <PanelPadang f={f} pelari={PELARI} tPelari={tF.pelari} tBingkai={tF.bingkai} awal={AWAL} /></div>
          </div>
        </div>) : null}
      {(() => { const p = popIn(f, tF.sama) * popOut(f, tF.panelKeluar); return p > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 90, height: 90, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.blue}`,
          boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: 52, lineHeight: 1, color: B.blue,
          transform: `translate3d(${PANEL.x - PANEL.w / 2 + 290 - 45}px, ${190 - 45}px, 0) scale(${skalaPop(p)})`, boxShadow: bayanganDengan(B.blue, 1) }}>=</div>) : null; })()}
    </>);
};
