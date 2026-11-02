import React from 'react';
import { ARAH, B, F, R, bayanganDengan, lerp, mixHex, rgba } from '../theme';
import { cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Lencana, luarLingkaran } from '../parts/umum';
import { Kaca, KarakterLingkar } from '../parts/kaca';
import { Notifikasi } from '../parts/nyata';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { KAMU_S09, POS_KAMU } from '../s09/Scene09';
import { IHSG_S10, KAEF_S10, type LilinRiil } from '../data/lilinRiil.gen';
import { BatangLilin, KisiLilin, awalBulan, domainGulir, hargaBulat, lilinGulir, posisiGulir } from '../parts/lilinRiil';
import { Klik } from '../s07/Scene07';

/**
 * SCENE 10 — Leverage Nggak Memberi Waktu untuk Berpikir Ulang (BATAS.s10 – BATAS.s11). GAYA RUMAH: satu tokoh (kamu, diambil alih dari Scene 09 di
 * tempat yang sama), chart KAEF, chart pasar (IHSG), kartu posisi, notifikasi margin call (dokumen).
 * REVISI 29 Okt (Simon, S10): "Ganti line chart ihsg dengan candlestick, perbesar tinggi dashboard ihsg, lebar panel ihsg dan contoh saham juga bisa
 * diperbesar" · "Gunakan candlestick KAEF dari yang kemarin aku kirimkan" · "Tag margin call seharusnya animasinya pop up" · animasi patah-patah, layout &
 * spacing, "banyak space kosong yang membuat layout visual tidak bernyawa":
 *  · TATA LETAK: kiri = kamu Ø260 (345, 415) + kartu posisi 440 × 150 (puncak 640); kanan = panel KAEF 1160 × 400 (y 215–615) + panel bawah 1160 × 265
 *    (y 640–905: IHSG candle → BER-GANTI ISI jadi ilustrasi Sebelum/Sesudah → tempat margin call); kelompok 125–1795 berpusat x 960, celah 25 px.
 *  · KAEF & IHSG = candle HARIAN RIIL (Yahoo, = screenshot TradingView Simon; 3 Agu 2020 – 15 Jan 2021) seperti TradingView: seluruh riwayat tampak, candle
 *    baru TUMBUH dari harga buka dan chart MELEBAR ke kanan (zoom otomatis); kedua chart bergerak BERSAMAAN (tanggal sama).
 *  A tiga transaksi: BELI di candle 1 Des · 7 Des · 4 Jan → candle naik, "✓ untung" bertambah; posisi 2 → 4 → 6 (langkah 1–2).
 *  B gelembung di atas kepala: "Saya benar beberapa kali." dicoret → "Saya memang hebat."
 *  C panel IHSG ikut naik → disorot "▲ seluruh pasar naik" (langkah 3); posisi 6 → 8; PINJAMAN: baris oranye +8 (langkah 4).
 *  D tiga hari ARB KAEF 13–15 Jan 2021 (6.975 → 5.650 = −19,0 %) → panel bawah berganti isi: ilustrasi Sebelum/Sesudah, modal 50 → 31 = −38 % (langkah 5–6).
 *  E MARGIN CALL (pop masuk & pop keluar) + jam hitung mundur + "Tambah dana" diklik, waktu habis → FORCED SELL, posisi ditutup (langkah 7).
 *  F kamu ingin berpikir ulang ("?") tetapi posisi sudah ditutup (langkah 8). Ekor: kamu + "?" diambil alih Scene 11 (lingkaran kamu ber-morf jadi otak).
 * Kartu modal = ilustrasi disederhanakan dari −19,0 % riil: (50 − 19 % × 100) / 50 = −38 %.
 */
const W = urut(['biasanya', 'transaksi', 'untung', 'transaksi', 'untung', 'transaksi', 'berhasil', 'pelan-pelan', 'saya', 'beberapa', 'menjadi', 'saya', 'hebat',
  'padahal', 'beruntun', 'seluruh', 'pasar', 'naik', 'ukuran', 'diperbesar', 'memakai', 'pinjaman', '2021', 'populer', 'arb', 'beberapa', 'hari', 'harga', 'turun',
  'puluh', 'setengah', 'pinjaman', 'kerugian', 'modal', 'empat', 'puluh', 'broker', 'menunggu', 'berpikir', 'kamu', 'menambah', 'dana', 'broker', 'paksa',
  'posisimu', 'bahaya', 'memperbesar', 'kerugian', 'leverage', 'menghilangkan', 'berpikir', 'ulang'], BATAS.s10 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  biasanya: n(), transaksi1: n(), untung1: n(), transaksi2: n(), untung2: n(), transaksi3: n(), berhasil: n(), pelan: n(), saya: n(), beberapa: n(), menjadi: n(),
  saya2: n(), hebat: n(), padahal: n(), beruntun: n(), seluruh: n(), pasar: n(), naik: n(), ukuran: n(), diperbesar: n(), memakai: n(), pinjaman: n(), tahun: n(),
  populer: n(), arb: n(), beberapa2: n(), hari: n(), harga: n(), turun: n(), puluh: n(), setengah: n(), pinjaman2: n(), kerugian: n(), modal: n(), empat: n(),
  puluh2: n(), broker: n(), menunggu: n(), berpikir: n(), kamu: n(), menambah: n(), dana: n(), broker2: n(), paksa: n(), posisimu: n(), bahaya: n(), memperbesar: n(),
  kerugian2: n(), leverage: n(), menghilangkan: n(), berpikir2: n(), ulang: n(),
};
export const S10_T = T;
const AWAL = BATAS.s10, AKHIR = BATAS.s11;
const EKOR = AKHIR + 30;

/* ════════════════════════════ TATA LETAK ════════════════════════════ */
export const KAMU_S10 = { x: 345, y: 415, d: 260 };
const POS = { x: KAMU_S10.x, y: 715, w: 440, h: 150 };
const PANEL = { x: 1215, w: 1160 };
const CH = { x: PANEL.x, y: 415, w: PANEL.w, h: 400 };
/** lebar chip "✓ untung" di kanan-atas panel KAEF (teks huruf 22 ±96 px + 2 × 14) */
const LEBAR_UNTUNG = 124;
const BAWAH = { x: PANEL.x, y: 772, w: PANEL.w, h: 265 };
const JARAK = 16;
/** teks berwarna di latar putih/terang digelapkan (Simon 28 Okt "Yes, darken it" di S04) */
const HIJAU_TEKS = mixHex(ARAH.naik, B.night, 0.3), ORANYE_TEKS = mixHex(B.orange, B.night, 0.22), ABU_TEKS = mixHex(B.gray, B.night, 0.22);

/* ════════════════════════════ WAKTU ════════════════════════════ */
const TRANS = [T.transaksi1 + 10, T.transaksi2 + 10, T.transaksi3 + 10];
/** kamu bergeser dari tempatnya di S09 SESUDAH kartu meter S09 keluar; chart & pasar pop sesudah itu juga */
const tA = { geser: AWAL + 90, chart: T.biasanya + 90, pasar: T.biasanya + 110 };
// gelembung lama SELESAI keluar sebelum gelembung baru masuk di tempat yang sama (aturan 17)
const tB = { tanya1: T.saya - 10, coret: T.menjadi - 15, keluar1: T.menjadi + 10, tanya2: T.saya2 + 12, keluar2: T.ukuran - 20 };
const tC = { sorot: T.seluruh, besar: T.diperbesar, pinjam: T.pinjaman - 10 };
const ARB = [T.arb + 6, T.hari - 16, T.hari + 14];
/** panel bawah: isi IHSG memudar → isi ilustrasi menebal (satu kartu, ganti isi 60 f) */
const tD = { ganti: T.harga - 20, persen20: T.puluh, sesudah: T.setengah + 20, persen40: T.puluh2, catatan: T.kerugian, kartuKeluar: T.broker - 30 };
// MARGIN CALL pop SESUDAH ilustrasi Sebelum/Sesudah selesai keluar di tempat yang sama (aturan 17; audit 29 Okt: menimpa f25860)
const tE = { notif: T.broker + 30, jam: [T.menunggu - 20, T.paksa], tambah: T.menambah, forced: T.paksa + 4 };
const tF = { tanya: T.berpikir2 - 10 };

/* ════════════════════════════ CHART KAEF & IHSG (resep video TA, bergulir bersama) ════════════════════════════ */
const D = KAEF_S10;
const iTgl = (t: string) => D.findIndex((b) => b.t === t);
const DASAR = iTgl('2020-12-01');
/** chart SELEBAR RIWAYAT seperti screenshot TradingView Simon (29 Okt: "candlestick KAEF belum sama seperti yang aku kirimkan" — dulu jendela 45 candle
 *  bergulir): semua candle sejak 3 Agu 2020 tampak, chart MELEBAR ke kanan (zoom otomatis) saat candle baru tumbuh — 80 → 109 slot (13,9 → 10,2 px) */
const nSlot = (f: number) => posK(f) + 1;
const I_BELI = [iTgl('2020-12-01'), iTgl('2020-12-07'), iTgl('2021-01-04')];
const I_ARB = [iTgl('2021-01-13'), iTgl('2021-01-14'), iTgl('2021-01-15')];
/** jadwal tumbuh tiap candle sesudah DASAR: candle BELI tumbuh 20 f sesudah tombol (sebab → akibat), candle di antaranya MENGALIR berturutan */
const JADWAL = (() => {
  const mulai: number[] = [];
  const jangkar: [number, number][] = [[I_BELI[0], TRANS[0] + 20], [I_BELI[1], TRANS[1] + 20], [I_BELI[2], TRANS[2] + 20]];
  for (let j = 0; j < 2; j++) {
    const [k0, t0] = jangkar[j], [k1, t1] = jangkar[j + 1];
    for (let k = k0; k < k1; k++) mulai[k - DASAR] = lerp(t0, t1, (k - k0) / (k1 - k0));
  }
  const sisa = [TRANS[2] + 20, TRANS[2] + 46, TRANS[2] + 70, TRANS[2] + 94, T.beruntun, T.pasar, T.diperbesar + 10, ARB[0] + 6, ARB[1] + 6, ARB[2] + 6];
  sisa.forEach((t, j) => { mulai[I_BELI[2] - DASAR + j] = t; });
  // 30 Okt (screenshot KAEF Simon Agu 2020 → Agu 2021): sesudah ARB, penurunan panjang Feb–Agu 2021 tumbuh merata SESUDAH chip "▼ hampir 20%" keluar
  // (margin call → jual paksa) sampai sebelum pertanyaan penutup
  const iAkhir = I_ARB[2] + 1, n = D.length - iAkhir, t0 = tD.kartuKeluar + 30, t1 = tF.tanya - 40;
  for (let j = 0; j < n; j++) mulai[iAkhir - DASAR + j] = lerp(t0, t1, j / Math.max(1, n - 1));
  return mulai.map((m, j) => ({ mulai: m, d: Math.max(2, Math.min(20, (mulai[j + 1] ?? m + 20) - m)) }));
})();
const posK = posisiGulir(DASAR, JADWAL);
const domK = domainGulir(D, posK, nSlot, AWAL - 20, AKHIR + 120, 0.08);
/** IHSG hanya sampai 15 Jan 2021 (panel IHSG sudah berganti isi sebelum candle KAEF sesudahnya tumbuh) → posisi IHSG dibatasi */
const posI = (f: number) => Math.min(posK(f), IHSG_S10.length);
const domI = domainGulir(IHSG_S10, posI, (f) => posI(f) + 1, AWAL - 20, AKHIR + 120, 0.12);
const BULAN_X = awalBulan(D);
/** skala chart bergulir di kotak plot w × h (koordinat lokal) */
const skala = (f: number, data: LilinRiil[], dom: (f: number) => [number, number], w: number, h: number, posF: (f: number) => number = posK) => {
  const slot = w / (posF(f) + 1), xKanan = w - slot, pos = posF(f), [lo, hi] = dom(f);
  return { slot, xKanan, pos, X: (k: number) => xKanan - slot * (pos - k - 0.5), Y: (v: number) => h - 8 - ((h - 16) * (v - lo)) / (hi - lo), data };
};
const PLOT_K = { x: 26, y: 84, w: CH.w - 52, h: CH.h - 84 - 50 };
const PLOT_I = { x: 26, y: 70, w: BAWAH.w - 52, h: BAWAH.h - 70 - 20 };
const hargaPada = (f: number, data: LilinRiil[], posF: (f: number) => number = posK) => { const t = lilinGulir(data, posF(f), 0, 1, 1); return t[t.length - 1].c.c; };
/** pil kecil di dalam SVG chart (BELI / ARB) */
const Pil: React.FC<{ x: number; y: number; teks: string; warna: string; p: number; lebar?: number }> = ({ x, y, teks, warna, p, lebar = 60 }) => p <= 0.001 ? null : (
  <g transform={`translate(${x} ${y}) scale(${skalaPop(p)})`}>
    <rect x={-lebar / 2} y={-14} width={lebar} height={28} rx={14} fill={warna} />
    <text x={0} y={7} textAnchor="middle" fontFamily={F} fontSize={17} fontWeight={800} fill={B.white}>{teks}</text>
  </g>);
const ChartKaef: React.FC<{ f: number }> = ({ f }) => {
  const s = skala(f, D, domK, PLOT_K.w, PLOT_K.h);
  // label bulan memudar di tepi; di kanan disembunyikan sampai seluruh labelnya (±80 px) muat di dalam panel (audit 29 Okt: "Des 2020" menjulur keluar)
  const tepi = (x: number) => Math.max(0, Math.min(1, (x + s.slot) / (2 * s.slot), (PLOT_K.w - 90 - x) / 40));
  return (
    <svg width={PLOT_K.w} height={PLOT_K.h + 50} style={{ position: 'absolute', left: PLOT_K.x, top: PLOT_K.y, overflow: 'visible' }}>
      <KisiLilin w={PLOT_K.w} h={PLOT_K.h} />
      {lilinGulir(D, s.pos, 0, s.xKanan, s.slot).map(({ c, x, alfa }) => <BatangLilin key={c.t} c={c} x={x} slot={s.slot} Y={s.Y} alfa={alfa} />)}
      {/* label bulan ikut bergulir (memudar di tepi) */}
      {/* label bulan SELANG TETAP (cek still 30 Okt f26587: aturan "≥ 84 px dari label sebelumnya" menghasilkan Agu·Okt·Des·Feb·Apr·Mei·Jul, Apr & Mei
          nyaris bersentuhan): lebar satu bulan ±21 slot; begitu < 136 px, label bulan berselang (indeks ganjil) memudar sampai 120 px → tiap 2 bulan (bulan pendek ±0,85 × → celah antarlabel ≥ 22 px) */}
      {(() => { const lebarBulan = 21 * s.slot, ganjilA = Math.max(0, Math.min(1, (lebarBulan - 120) / 16));
        return BULAN_X.map((m, i) => { const x = s.X(m.k), a = tepi(x) * (i % 2 === 1 ? ganjilA : 1);
          if (a <= 0.01) return null; return (
          <text key={m.k} x={x} y={PLOT_K.h + 30} fontFamily={F} fontSize={17} fontWeight={700} fill={ABU_TEKS} opacity={a}>{m.teks}</text>); }); })()}
      {/* penanda BELI kamu (1 Des · 7 Des · 4 Jan) di bawah candle-nya */}
      {/* sebelum candle-nya terbentuk, pil berdiri di slot candle baru (tidak pernah di luar plot) */}
      {TRANS.map((t, k) => <Pil key={k} x={Math.min(s.X(I_BELI[k]), s.xKanan + s.slot * 0.5)} y={s.Y(D[I_BELI[k]].l) + 26} teks="BELI" warna={B.blue}
        p={popIn(f, t) * popOut(f, T.saya - 30)} />)}
      {/* ARB bertumpuk di bawah tiga candle ARB */}
      {I_ARB.map((k, j) => <Pil key={k} x={s.X(I_ARB[1])} y={s.Y(D[I_ARB[2]].l) + 26 + j * 32} teks="ARB" warna={ARAH.turun} p={popIn(f, ARB[j] + 20)} lebar={52} />)}
    </svg>);
};
const ChartIhsg: React.FC<{ f: number; warna: string }> = ({ f }) => {
  const s = skala(f, IHSG_S10, domI, PLOT_I.w, PLOT_I.h, posI);
  return (
    <svg width={PLOT_I.w} height={PLOT_I.h} style={{ position: 'absolute', left: PLOT_I.x, top: PLOT_I.y, overflow: 'visible' }}>
      <KisiLilin w={PLOT_I.w} h={PLOT_I.h} />
      {lilinGulir(IHSG_S10, s.pos, 0, s.xKanan, s.slot).map(({ c, x, alfa }) => <BatangLilin key={c.t} c={c} x={x} slot={s.slot} Y={s.Y} alfa={alfa} />)}
    </svg>);
};

/* ════════════════════════════ POSISI ════════════════════════════ */
/** jumlah unit MODAL (biru) & PINJAMAN (oranye) pada waktu f */
const tModal = (k: number) => [TRANS[0], TRANS[0], TRANS[1], TRANS[1], TRANS[2], TRANS[2], tC.besar, tC.besar][k] + 20 + (k % 2) * 8;
/** kartu posisi: pop BERSAMA dua unit pertamanya; KARTU IKUT MEMBESAR mengikuti jumlah unit (posisi membesar = kartunya membesar; dulu kartu selebar 8 unit
 *  sejak awal → ruang kosong) — lebar & tinggi bergerak 60 f sedikit sebelum unit baru pop; unit ditutup satu per satu saat forced sell */
const UNIT = { d: 42, langkah: 52.6, pad: 22, baris: 56 };
const KartuPosisi: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0.001) return null;
  const keluarUnit = (k: number, baris: number) => popOut(f, tE.forced + (baris * 8 + k) * 3 + 30);
  const nModal = [0, 1, 2, 3, 4, 5, 6, 7].reduce((a, k) => a + cin(f, tModal(k) - 12), 0);
  const adaPinjam = cin(f, tC.pinjam - 12);
  const w = 2 * UNIT.pad + UNIT.d + Math.max(1, nModal) * UNIT.langkah - UNIT.langkah, h = 2 * UNIT.pad + UNIT.d + UNIT.baris * adaPinjam;
  const icon = (k: number, baris: number, warna: string, t: number) => {
    const q = popIn(f, t) * keluarUnit(k, baris);
    return q <= 0 ? null : <Bulat key={`${baris}-${k}`} x={UNIT.pad + UNIT.d / 2 + k * UNIT.langkah} y={UNIT.pad + UNIT.d / 2 + baris * UNIT.baris} d={UNIT.d} warna={warna}
      ikon="saham" p={q} />;
  };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: 'center',
      transform: `translate3d(${POS.x - w / 2}px, ${POS.y - h / 2}px, 0) scale(${skalaPop(p)})` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: rgba(B.white, 0.96), boxShadow: bayanganDengan(B.blue, 1) }}>
        {/* Simon 30 Okt ("tiap object muncul harus ada animasinya"): unit dulu dipasang lewat hitungan unitModal(f) — saat dipasang pop-nya sudah 1/3–2/3 jalan
            (muncul seketika di skala 0,4–0,6). Kini tiap unit dipasang begitu pop-nya mulai (icon() mengembalikan null saat q ≤ 0) */}
        {Array.from({ length: 8 }, (_, k) => icon(k, 0, B.blue, tModal(k)))}
        {Array.from({ length: 8 }, (_, k) => icon(k, 1, B.orange, tC.pinjam + 10 + k * 6))}
      </div>
    </div>);
};

/* ════════════════════════════ ILUSTRASI SEBELUM / SESUDAH (isi panel bawah) ════════════════════════════ */
const IsiSebelumSesudah: React.FC<{ f: number }> = ({ f }) => {
  const sesudah = cin(f, tD.sesudah);
  const s = 1.45, alas = 64;
  return (
    <>
      {(['Sebelum', 'Sesudah'] as const).map((lbl, k) => {
        const x0 = 260 + k * 260, total = k === 0 ? 100 : lerp(100, 81, sesudah), modal = total - 50;
        const p = k === 0 ? 1 : popIn(f, tD.sesudah - 20);
        return p <= 0 ? null : (
          <div key={lbl} style={{ position: 'absolute', left: x0 - 80, top: 0, width: 160, height: BAWAH.h, transformOrigin: `80px ${BAWAH.h - alas}px`, transform: `scale(${skalaPop(p)})` }}>
            <div style={{ position: 'absolute', left: 35, bottom: alas, width: 90, height: 50 * s, background: B.orange, borderRadius: '0 0 12px 12px' }} />
            <div style={{ position: 'absolute', left: 35, bottom: alas + 50 * s, width: 90, height: Math.max(0, modal * s), background: B.blue, borderRadius: '12px 12px 0 0' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: alas - 36, textAlign: 'center', fontFamily: F, fontWeight: 800, fontSize: 24, color: B.night }}>{lbl}</div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: alas + 8 + (50 + modal) * s, textAlign: 'center', fontFamily: F, fontWeight: 800, fontSize: 22, color: ABU_TEKS }}>
              {Math.round(total)}</div>
          </div>);
      })}
      <div style={{ position: 'absolute', left: 720, top: 56, display: 'flex', flexDirection: 'column', gap: 14, fontFamily: F, fontWeight: 800, fontSize: 26 }}>
        <span style={{ color: B.blue }}>■ Modal sendiri</span><span style={{ color: ORANYE_TEKS }}>■ Pinjaman</span>
      </div>
      <div style={{ position: 'absolute', left: 720, top: 150, padding: '10px 22px', borderRadius: 999, background: ARAH.turun, color: B.white, fontFamily: F, fontWeight: 800,
        fontSize: 34, transform: `scale(${skalaPop(popIn(f, tD.persen40))})`, transformOrigin: 'left center' }}>Modal −38%</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', whiteSpace: 'nowrap' }}>
        <WordText f={f} at={tD.catatan} style={{ fontFamily: F, fontWeight: 600, fontSize: 15, color: ABU_TEKS, fontStyle: 'italic' }}>Ilustrasi perhitungan disederhanakan dan belum memperhitungkan bunga serta maintenance margin.</WordText>
      </div>
    </>);
};

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene10: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= AKHIR + 70) return null;
  const keluar = popOut(f, EKOR);
  const geser = cin(f, tA.geser);
  const kx = lerp(POS_KAMU.x, KAMU_S10.x, geser), ky = lerp(POS_KAMU.y, KAMU_S10.y, geser);
  const kepalaAtas = ky - (KAMU_S09.cy - 22) * (KAMU_S10.d / 2 / KAMU_S09.r);
  const chartP = popIn(f, tA.chart) * keluar;
  const bawahP = popIn(f, tA.pasar) * popOut(f, tD.kartuKeluar);
  const sorot = cin(f, tC.sorot) * (1 - cin(f, tD.ganti - 20));
  const isiIhsg = 1 - cin(f, tD.ganti), isiD = cin(f, tD.ganti + 20);
  const hargaK = hargaPada(f, D), hargaI = hargaPada(f, IHSG_S10, posI);
  const jamP = popIn(f, tE.jam[0]) * popOut(f, tF.tanya - 30);
  const sisaWaktu = 1 - R(f, tE.jam[0] + 20, tE.jam[1], 0, 1, (x) => x);
  const forced = popIn(f, tE.forced) * keluar;
  /* E: margin call di panel bawah yang sudah kosong — notifikasi + tombol di kiri, jam di kanan, berpusat di panel (x 875–1555) */
  /* skala 1,25 (dulu kelompok kecil mengambang di panel kosong) */
  const NOTIF = { x: PANEL.x - 110, y: BAWAH.y - 46, w: 520, k: 1.25 }, JAM = { x: PANEL.x + 330, y: BAWAH.y }, TAMBAH = { x: NOTIF.x, y: BAWAH.y + 78 };
  /* MARGIN CALL: pop masuk DAN pop keluar (Simon 29 Okt: "gunakan animasi pop ini dan pop out untuk tag ini"; dulu keluar swipe ke kanan) */
  const notifP = popIn(f, tE.notif) * popOut(f, tF.tanya - 30);
  /* ARB −20 %: di kiri bawah tiga candle ARB (dalam panel) */
  /* "▼ hampir 20%" di baris judul panel, tepat sesudah harga (dulu di dalam plot menimpa candle akhir Des) */
  const xArb = CH.x - CH.w / 2 + 300 + JARAK + 98, yArb = CH.y - CH.h / 2 + 44;
  return (
    <>
      {/* kamu (diambil alih dari Scene 09, menghadap kanan, tanpa label) — sejak AKHIR digambar Scene 11 (morf ke ikon otak) */}
      {f < AKHIR ? <KarakterLingkar pose={KAMU_S09} x={kx} y={ky} D={KAMU_S10.d} s={1} warna={B.turq} cermin /> : null}
      <KartuPosisi f={f} p={popIn(f, TRANS[0] + 20) * keluar} />
      <Chip x={POS.x - 88} y={POS.y + POS.h / 2 + JARAK + 20} teks="Modal" warna={B.blue} p={popIn(f, tC.pinjam - 10) * popOut(f, tE.forced + 40)} size={22} />
      <Chip x={POS.x + 88} y={POS.y + POS.h / 2 + JARAK + 20} teks="Pinjaman" warna={B.orange} p={popIn(f, tC.pinjam + 10) * popOut(f, tE.forced + 50)} size={22} />

      {/* ═════ panel KAEF ═════ */}
      <Kaca x={CH.x} y={CH.y} w={CH.w} h={CH.h} p={chartP} warna={B.blue}>
        <div style={{ position: 'absolute', left: 28, top: 22, display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: F, fontWeight: 800 }}>
          <span style={{ fontSize: 28, color: ABU_TEKS }}>KAEF</span>
          <span style={{ fontSize: 40, color: B.night }}>{`Rp${hargaBulat(hargaK).toLocaleString('id-ID')}`}</span>
        </div>
        {/* chip di TEMPAT TETAP (dulu baris flex: chip baru yang dipasang mendorong chip lama bergeser seketika). Simon 30 Okt ("ini jadi mepet"): slot dulu 97 + 8
            sementara chip terukur ±120 px → saling menempel & chip ketiga menyentuh tepi panel. Kini lebar chip TETAP 124 (teks rata tengah), celah 14 (= pil
            "untung" S02) */}
        <div style={{ position: 'absolute', right: 24, top: 24, width: 3 * LEBAR_UNTUNG + 2 * 14, height: 34 }}>
          {/* Simon 30 Okt ("ini tidak kamu animasikan"): chip dulu dipasang saat pop-nya sudah setengah jalan (f ≥ t + 40 = pusat pop) → muncul seketika di skala
              ±0,5. Kini dipasang begitu pop mulai (tetap memakan tempat → chip lain tidak bergeser) dan pop dari 0. */}
          {[0, 1, 2].map((k) => popIn(f, TRANS[k] + 40) > 0 ? (
            <div key={k} style={{ position: 'absolute', left: k * (LEBAR_UNTUNG + 14), top: 0, width: LEBAR_UNTUNG, boxSizing: 'border-box', textAlign: 'center',
              padding: '6px 0', borderRadius: 999, background: rgba(ARAH.naik, 0.14), color: HIJAU_TEKS,
              fontFamily: F, fontWeight: 800, fontSize: 22, whiteSpace: 'nowrap', transformOrigin: 'center', transform: `scale(${skalaPop(popIn(f, TRANS[k] + 40))})` }}>✓ untung</div>) : null)}
        </div>
        <ChartKaef f={f} />
      </Kaca>
      <Chip x={xArb} y={yArb} teks="▼ hampir 20%" warna={ARAH.turun} p={popIn(f, tD.persen20) * popOut(f, tD.kartuKeluar)} size={24} />

      {/* ═════ panel bawah: IHSG (candle) → ilustrasi Sebelum/Sesudah (SATU kartu, ganti isi) ═════ */}
      <Kaca x={BAWAH.x} y={BAWAH.y} w={BAWAH.w} h={BAWAH.h} p={bawahP} warna={mixHex(B.blue, ARAH.naik, sorot)} tepi={sorot}>
        {isiIhsg > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: isiIhsg < 1 ? isiIhsg : undefined }}>
            <div style={{ position: 'absolute', left: 28, top: 18, display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: F, fontWeight: 800 }}>
              <span style={{ fontSize: 26, color: ABU_TEKS }}>Pasar (IHSG)</span>
              <span style={{ fontSize: 30, color: B.night }}>{Math.round(hargaI).toLocaleString('id-ID')}</span>
            </div>
            {sorot > 0 ? <div style={{ position: 'absolute', right: 26, top: 16, padding: '6px 14px', borderRadius: 999, background: rgba(ARAH.naik, 0.14), color: HIJAU_TEKS,
              fontFamily: F, fontWeight: 800, fontSize: 22, transform: `scale(${skalaPop(popIn(f, tC.sorot) * popOut(f, tD.ganti - 20))})` }}>▲ seluruh pasar naik</div> : null}
            <ChartIhsg f={f} warna={B.blue} />
          </div>) : null}
        {isiD > 0.001 ? <div style={{ position: 'absolute', inset: 0, opacity: isiD < 1 ? isiD : undefined }}><IsiSebelumSesudah f={f} /></div> : null}
      </Kaca>

      {/* gelembung pikiran di ATAS KEPALA, ekor tengah */}
      <Kutipan x={kx - 4} y={kepalaAtas - JARAK - 20 - 35} ekor="tengah" teks="Saya benar beberapa kali." p={popIn(f, tB.tanya1) * popOut(f, tB.keluar1)} warna={B.blue} size={28}
        coret={cin(f, tB.coret - 15)} />
      <Kutipan x={kx - 4} y={kepalaAtas - JARAK - 20 - 37} ekor="tengah" teks="Saya memang hebat." p={popIn(f, tB.tanya2) * popOut(f, tB.keluar2)} warna={B.orange} size={30} />

      {/* ═════ E: MARGIN CALL (pop masuk & keluar) + jam + tambah dana → FORCED SELL ═════ */}
      {notifP > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, transformOrigin: `${NOTIF.x}px ${NOTIF.y}px`, transform: `scale(${NOTIF.k * (notifP < 0.9999 ? skalaPop(notifP) : 1)})` }}>
          <Notifikasi x={NOTIF.x} y={NOTIF.y} p={1} ikon="waktu" warna={ARAH.turun} judul="MARGIN CALL" isi="Tambah dana atau posisi dijual" w={NOTIF.w} />
        </div>) : null}
      {jamP > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 150, height: 150, transformOrigin: 'center',
          transform: `translate3d(${JAM.x - 75}px, ${JAM.y - 75}px, 0) scale(${1.2 * skalaPop(jamP)})` }}>
          <svg width={150} height={150} style={{ position: 'absolute', left: 0, top: 0 }}>
            <circle cx={75} cy={75} r={70} fill={B.white} />
            <circle cx={75} cy={75} r={58} fill="none" stroke={rgba(ARAH.turun, 0.15)} strokeWidth={12} />
            <circle cx={75} cy={75} r={58} fill="none" stroke={ARAH.turun} strokeWidth={12} strokeLinecap="round" pathLength={1000}
              strokeDasharray={`${1000 * sisaWaktu} 1000`} transform="rotate(-90 75 75)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: 40, color: ARAH.turun }}>
            {Math.max(0, Math.ceil(sisaWaktu * 3))}</div>
        </div>) : null}
      <Klik f={f} x={TAMBAH.x} y={TAMBAH.y} t={[tE.tambah + 10]} warna={B.turq} lebar={260}>
        <Chip x={TAMBAH.x} y={TAMBAH.y} teks="Tambah dana" ikon="dompet" warna={B.turq} p={popIn(f, tE.tambah - 30) * popOut(f, tE.forced + 20)} size={28} />
      </Klik>
      {forced > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${POS.x}px, ${POS.y - 4}px, 0) translate(-50%, -50%) rotate(-8deg) scale(${skalaPop(forced) * lerp(1.6, 1, Math.min(1, forced))})`,
          padding: '10px 26px', border: `5px solid ${ARAH.turun}`, borderRadius: 14, color: ARAH.turun, fontFamily: F, fontWeight: 800, fontSize: 40, letterSpacing: '.06em',
          background: rgba(B.white, 0.85), whiteSpace: 'nowrap' }}>FORCED SELL</div>) : null}

      {/* F: ingin berpikir ulang — terlambat */}
      {f < AKHIR ? <Lencana x={luarLingkaran(kx, ky, KAMU_S10.d, 74)[0]} y={luarLingkaran(kx, ky, KAMU_S10.d, 74)[1]} d={0} p={popIn(f, tF.tanya)} warna={B.orange} teks="?" besar={74} /> : null}
    </>);
};
