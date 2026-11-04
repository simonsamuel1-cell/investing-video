import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { kamera, keLayar } from '../kamera';
import type { KunciIkon } from '../ikon';
import { ARAH, B, F, R, io, mixHex, rgba } from '../theme';
import { Icon, MODE_UKUR, WordText, lerp } from '../parts/kit';
import { popIn } from '../parts/pop';
import { rpPenuh } from '../parts/nominal';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { Judul } from '../parts/judul';
import { Backdrop } from '../parts/Backdrop';
import { Chevron, HALUS3D, INVESTOR_JAS, INVESTOR_NAVY, KARYAWAN, Kaca, KarakterLingkar, MURID, Nomor, ORANG_MUDA, ORANG_SAKU, Penghubung, geser, type PoseKarakter } from '../v3/kaca';
import { IHSG_2012_2021 } from '../v3/pasar';
import { GrafikLilin, laju, nilaiLilin, relatif, rentang } from '../v3/lilin';

/**
 * SCENE 07 + 08 — SAHAM (satu komponen, kunci batas s8 → s12), versi GAYA VIDEO 3 (Simon 16 Okt: layout/animasi/style Video 3, aset
 * realistis, orang berbeda, orang awam, tidak statis, tanpa geser/zoom tanpa arti, tiap kemunculan beranimasi). Ide = 04_Asset/
 * Evaluasi-Ide-Baru-16okt.md § S07–S08. TEXT naskah: "Perusahaan menghasilkan laba / pasar menentukan harga saham" ·
 * "Bisnis menciptakan nilai / pasar menentukan harganya".
 *   1. peta bab → simpul Saham jadi cakram foto saham → ikon kepala kartu PERUSAHAAN (gedung + kisi 100 kotak kepemilikan)
 *   2. "kita membeli sebagian kepemilikan" → satu kotak (1 %) terangkat & terbang ke murid ("kita")
 *   3. "dua hal yang harus dibedakan" → kartu perusahaan jadi kartu BISNIS (kiri), kartu HARGA SAHAM muncul (kanan), ≠ di antaranya
 *   4. "Pertama, bisnisnya" → alur Produk & layanan ↓ Pendapatan Rp50 M ↓ Laba Rp10 M (muncul per kata)
 *   5. "Kedua, harga sahamnya … diberikan pasar" → pembeli & penjual (orang BERBEDA) · "berubah dari waktu ke waktu" → garis harga
 *      CANDLESTICK realistis (Simon 16 Okt) dari OHLC mingguan asli, dinormalkan ke Rp1.250/lembar + angka berjalan
 *   6. "perusahaan terus berkembang" → kartu bisnis melebar: batang pendapatan & laba per tahun tumbuh (angka berjalan, miliar)
 *   7. "laba digunakan kembali" → uang dari laba terbang ke tiga tujuan (memperbesar bisnis · produk baru · pasar baru)
 *   8. "menciptakan nilai" → tahun 2028 lebih tinggi + nilai perusahaan berjalan Rp100 M → Rp180 M
 *   9. "dua hal yang berbeda" → kartu bisnis kembali kiri (laba naik mulus) ≠ kartu harga (naik-turun); laba vs harga "setiap hari"
 *  10. "bagaimana pasar menilai" → tiga orang berbeda dengan pendapatnya · 11. investor menerima dua sumber return
 * Tanpa kamera; perpindahan hanya yang bermakna (memberi ruang · membandingkan · fokus ke bisnis). Keluar = masker ke simpul bab 06 di
 * peta pembuka Rangkuman (BATAS.s12), lapis + salinan latar sejak BATAS.s12 (pola lama, anti peta tembus).
 */
export const S8 = BATAS.s8;
export const IDE_S08_AWAL = S8;

const [saham, membeli, kita, sebagian, kepemilikan, perusahaan, dan, dua, dibedakan, pertama, bisnisnya, perusahaan2, produk, pendapatan, laba,
  kedua, sahamnya, diberikan, pasar, tersebut, nilainya, berubah, kalau, berkembang, pendapatan2, labanya, tumbuh, laba2, kembali, memperbesar,
  produk2, pasar2, menciptakan, nilai, tapi, pertumbuhan, pergerakan, berbeda, persis, laba3, hari, pasar3, menilai, jadi, investor, , hasil,
  , perubahan] = urut(['saham', 'membeli', 'kita', 'sebagian', 'kepemilikan', 'perusahaan', 'dan', 'dua', 'dibedakan', 'pertama',
  'bisnisnya', 'perusahaan', 'produk', 'pendapatan', 'laba', 'kedua', 'sahamnya', 'diberikan', 'pasar', 'tersebut', 'nilainya', 'berubah',
  'kalau', 'berkembang', 'pendapatan', 'labanya', 'tumbuh', 'laba', 'kembali', 'memperbesar', 'produk', 'pasar', 'menciptakan', 'nilai',
  'tapi', 'pertumbuhan', 'pergerakan', 'berbeda', 'persis', 'laba', 'hari', 'pasar', 'menilai', 'jadi', 'investor', 'dua', 'hasil', 'bisnis',
  'perubahan'], S8);

/* ── tata letak ── */
const Y = 540, KH = 500, KT = Y - KH / 2;
const TENGAH = membeli - 13; // simpul bab Saham tiba di tengah
const CAKRAM = { x: 960, y: Y, d: 220 };
const ORANG = { x: 500, y: Y, D: 240 }; // murid "kita" (adegan kepemilikan)
const PER = { x: 1180, w: 680 }; // kartu perusahaan
const KIRI = { x: 610, w: 600 }, KANAN = { x: 1310, w: 600 }, PENUH = { x: 960, w: 1300 };
const KISI = { x0: 340, y0: 112, sel: 28, celah: 4 }; // kisi 10×10 kepemilikan (lokal kartu perusahaan)
const SEL_SAYA = { r: 0, c: 9 }; // kotak "milik kita"
const xSel = (c: number) => KISI.x0 + c * (KISI.sel + KISI.celah);
const ySel = (r: number) => KISI.y0 + r * (KISI.sel + KISI.celah);

/* ── kartu bisnis: posisi & lebar per fase (tiap perpindahan bermakna, 60f inOut cubic) ── */
const tBisnis = (f: number) => ({
  keKiri: R(f, dan + 24 - 30, dan + 24 + 30, 0, 1, io), // memberi ruang untuk kartu harga
  penuh: R(f, kalau - 20, kalau + 40, 0, 1, io), // fokus ke pertumbuhan bisnis
  kembali: R(f, pertumbuhan - 40, pertumbuhan + 20, 0, 1, io), // dibandingkan lagi dengan harga
});
const bisnisRect = (f: number) => {
  const t = tBisnis(f);
  const x = lerp(lerp(lerp(PER.x, KIRI.x, t.keKiri), PENUH.x, t.penuh), KIRI.x, t.kembali);
  const w = lerp(lerp(lerp(PER.w, KIRI.w, t.keKiri), PENUH.w, t.penuh), KIRI.w, t.kembali);
  return { x, w };
};

/* ── harga saham: CANDLESTICK REALISTIS (Simon 16 Okt "diadegan saham gunakan candlestick yang realistis", lalu "buat candlesticknya lebih
 *  terlihat, saat ini masih terlihat seperti linechart" → 308 candle mingguan (±1,7 px/candle) diganti 59 candle BULANAN ±8,8 px/candle:
 *  badan ±5,8 px + sumbu 1,5 px terbaca sebagai candle) — OHLC bulanan asli Jan 2017 – Nov 2021 (candle terakhir MERAH = "harga hari ini
 *  turun"), TANPA label 'IHSG', dinormalkan ke Rp1.250 di open pertama (kelipatan Rp5). Domain harga & sumbu waktu TETAP; 60 % pertama
 *  (s.d. ±Des 2019) di "berubah dari waktu ke waktu", sisanya (jatuh 2020 lalu pulih) saat dibandingkan dengan laba. ── */
const BULAN = IHSG_2012_2021.filter((b) => b[0] >= '2017-01' && b[0] <= '2021-11');
const LILIN = relatif(BULAN);
const DOM_L = rentang(LILIN, 0.04);
const G_TENGAH = 0.6;
const gLilin = (f: number) => G_TENGAH * laju(f, berubah - 40, berubah + 150) + (1 - G_TENGAH) * laju(f, pergerakan - 10, berbeda + 50);
// tren laba (garis putus oranye) naik mulus dari harga awal — ujung di 75 % rentang atas grafik (data bulanan: 1,38 menembus atas grafik)
const TREN_LABA_AKHIR = 1 + (DOM_L[1] - 1) * 0.75;

/* ── pertumbuhan bisnis (miliar) ── */
const TAHUN = [2025, 2026, 2027, 2028];
const PEND = [50, 65, 85, 110], LABA = [10, 14, 19, 25];
const T_TAHUN = [berkembang - 4, pendapatan2, labanya, menciptakan];
const NILAI_PERUSAHAAN: [number, number] = [100, 180];

/* ── orang berbeda: pasar (pembeli/penjual) & penilai ── */
const PASAR: { pose: PoseKarakter; peran: 'Beli' | 'Jual'; at: number }[] = [
  { pose: INVESTOR_NAVY, peran: 'Beli', at: diberikan - 10 },
  { pose: ORANG_MUDA, peran: 'Jual', at: diberikan + 8 },
  { pose: INVESTOR_JAS, peran: 'Beli', at: diberikan + 26 },
];
const PENILAI: { pose: PoseKarakter; kata: string; at: number }[] = [
  { pose: ORANG_SAKU, kata: 'Terlalu mahal', at: pasar3 - 14 },
  { pose: KARYAWAN, kata: 'Masih murah', at: pasar3 + 8 },
  { pose: INVESTOR_NAVY, kata: 'Prospeknya bagus', at: menilai + 8 },
];

export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < S8) return null;
  // KELUAR = masker lingkaran ke simpul bab 06 (Saham) di peta pembuka Rangkuman (kunci batas s12), berubah oranye + ikon. 50f.
  if (f >= BATAS.s12 + 52) return null;
  const ex = R(f, BATAS.s12, BATAS.s12 + 50, 0, 1, io);
  const kam12 = kamera('S12', BATAS.s12 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam12, SIMPUL_PETA(5)), r: SIMPUL_PETA(5).r * kam12.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);

  const bR = bisnisRect(f), tb = tBisnis(f);
  const pPer = popIn(f, membeli);
  /* cakram saham → ikon kepala kartu perusahaan */
  const keKepala = R(f, membeli - 30, membeli + 30, 0, 1, io);
  const ikonKepala = { x: bR.x - bR.w / 2 + 59, y: KT + 59 };
  const cak = { x: lerp(CAKRAM.x, ikonKepala.x, keKepala), y: lerp(CAKRAM.y, ikonKepala.y, keKepala), d: lerp(CAKRAM.d, 58, keKepala) };
  const cakOp = 1 - R(f, dan + 10, dan + 40, 0, 1, io);
  /* kartu harga: muncul di "dua", pergi saat fokus bisnis, kembali di "pergerakan" */
  const pHarga = popIn(f, dua) * (1 - R(f, kalau - 20, kalau + 20, 0, 1, io)) + popIn(f, pergerakan - 20) * (f >= kalau + 20 ? 1 : 0);
  /* sorot bergantian: bisnis (pertama) · harga (kedua) */
  const redupHarga = R(f, pertama - 20, pertama + 20, 0, 1, io) * (1 - R(f, kedua - 20, kedua + 20, 0, 1, io));
  const redupBisnis = R(f, kedua - 20, kedua + 20, 0, 1, io) * (1 - R(f, kalau - 30, kalau, 0, 1, io));
  const pSama = popIn(f, dibedakan) * (1 - R(f, kalau - 20, kalau + 10, 0, 1, io)) + popIn(f, berbeda) * (f >= kalau + 10 ? 1 : 0);
  const pNomor = (at: number) => popIn(f, at) * (1 - R(f, kalau - 20, kalau + 10, 0, 1, io));

  return (
    <AbsoluteFill style={f >= BATAS.s12 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>
    {/* sejak BATAS.s12: lapis ini di atas + salinan latar pekat di dalam lingkaran → peta Rangkuman hanya tersingkap DI LUAR lingkaran */}
    {f >= BATAS.s12 ? (MODE_UKUR ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />) : null}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s12, BATAS.s12 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* ═════ judul (kolom TEXT naskah) ═════ */}
      <Judul f={f} kata={['Perusahaan', 'menghasilkan', 'laba']} at={bisnisnya} sorotAt={laba + 10} keluar={kedua - 10} />
      <Judul f={f} kata={['Pasar', 'menentukan', 'harga saham']} at={sahamnya} sorotAt={pasar + 20} keluar={kalau - 20} />
      <Judul f={f} kata={['Bisnis', 'menciptakan nilai']} at={berkembang} sorotAt={nilai + 10} keluar={tapi - 10} />
      <Judul f={f} kata={['Pasar', 'menentukan', 'harganya']} at={pertumbuhan + 20} sorotAt={menilai + 30} />

      {/* ═════ peta bab → simpul Saham ke tengah ═════ */}
      <PembukaBab f={f} s0={S8} k={5} isiAt={saham} tengah={CAKRAM} selesai={TENGAH} />

      {/* ═════ kartu HARGA SAHAM (kanan) ═════ */}
      {pHarga > 0.001 ? (
        <Kaca x={KANAN.x} y={Y} w={KANAN.w} h={KH} p={pHarga} warna={B.orange} tab="atas" alfa={1 - 0.55 * redupHarga}>
          <IsiHarga f={f} w={KANAN.w} />
        </Kaca>) : null}
      <Nomor x={KANAN.x - KANAN.w / 2 + 6} y={KT + 6} n={2} warna={B.orange} p={pNomor(kedua)} d={56} cincin />

      {/* ═════ kartu PERUSAHAAN → BISNIS ═════ */}
      {pPer > 0.001 ? (
        <Kaca x={bR.x} y={Y} w={bR.w} h={KH} p={pPer} warna={B.orange} tab="atas" alfa={1 - 0.55 * redupBisnis}>
          <IsiPerusahaan f={f} w={bR.w} t={tb.keKiri} />
          <IsiAlur f={f} w={bR.w} />
          <IsiGrafik f={f} w={bR.w} />
        </Kaca>) : null}
      <Nomor x={KIRI.x - KIRI.w / 2 + 6} y={KT + 6} n={1} warna={B.orange} p={pNomor(pertama)} d={56} cincin />

      {/* ≠ di antara dua kartu */}
      <TidakSama x={960} y={Y} p={pSama} />

      {/* cakram saham (simpul bab) → ikon kepala kartu perusahaan */}
      {f >= TENGAH && cakOp > 0.001 ? <CakramSaham x={cak.x} y={cak.y} d={cak.d} foto={R(f, TENGAH, TENGAH + 30, 0, 1, io) * (1 - keKepala)} op={cakOp} /> : null}

      {/* ═════ kita (murid) + kotak kepemilikan 1 % ═════ */}
      <Kepemilikan f={f} />

      {/* ═════ uang laba → tiga tujuan investasi kembali ═════ */}
      <UangInvestasiKembali f={f} />

      {/* ═════ pasar menilai (orang berbeda) · investor & dua sumber return ═════ */}
      <Penilai f={f} />
      <Investor f={f} />
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.orange, opacity: R(f, BATAS.s12 + 22, BATAS.s12 + 48, 0, 1, io) }} /> : null}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s12 + 34, BATAS.s12 + 48, 0, 1, io) }}><Icon name="saham" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/* ════════════════ isi kartu perusahaan (kepemilikan) ════════════════ */
const RASIO_GEDUNG = 389 / 480;
const IsiPerusahaan: React.FC<{ f: number; w: number; t: number }> = ({ f, w, t }) => {
  const op = 1 - R(f, perusahaan2 - 30, perusahaan2, 0, 1, io); // gedung pergi saat alur bisnis mulai
  if (op <= 0.001) return null;
  const kisi = 1 - R(f, dan, dan + 30, 0, 1, io);
  const hG = 300, wG = hG * RASIO_GEDUNG;
  const xG = lerp(170, w / 2, t);
  const judulBisnis = R(f, dan + 10, dan + 40, 0, 1, io);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
      {/* kepala: ikon = cakram saham yang terbang (lalu ikon perusahaan) + "Perusahaan" → "Bisnis" */}
      <div style={{ position: 'absolute', left: 30, top: 30, width: 58, height: 58, borderRadius: 16, background: B.orange, display: 'grid', placeItems: 'center', opacity: Math.max(0.0001, judulBisnis) }}>
        <Icon name="perusahaan" size={36} color={B.white} />
      </div>
      <div style={{ position: 'absolute', left: 104, top: 30, height: 58, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <span style={{ opacity: Math.max(0.0001, 1 - judulBisnis), position: 'absolute' }}>Perusahaan</span>
        <span style={{ opacity: Math.max(0.0001, judulBisnis) }}>Bisnis</span>
      </div>
      <Img src={staticFile('media/perusahaan.webp')} style={{ position: 'absolute', left: 0, top: 0, width: wG, height: hG, maxWidth: 'none', transform: geser(xG - wG / 2, 120) }} />
      {kisi > 0.001 ? (
        <>
          {Array.from({ length: 100 }, (_, i) => {
            const r = Math.floor(i / 10), c = i % 10;
            const saya = r === SEL_SAYA.r && c === SEL_SAYA.c;
            const muncul = R(f, membeli + 10 + (r + c) * 2.2, membeli + 30 + (r + c) * 2.2, 0, 1, io);
            const lepas = saya ? R(f, kepemilikan - 10, kepemilikan + 10, 0, 1, io) : 0;
            if (muncul <= 0.001 || lepas >= 0.999) return null;
            const sorot = saya ? R(f, sebagian - 20, sebagian + 10, 0, 1, io) : 0;
            return <div key={i} style={{ position: 'absolute', left: xSel(c), top: ySel(r), width: KISI.sel, height: KISI.sel, borderRadius: 7,
              background: mixHex(mixHex(B.white, B.orange, 0.22), B.orange, sorot), opacity: Math.max(0.0001, Math.min(0.9999, muncul * kisi * (1 - lepas))),
              transform: `scale(${lerp(0.6, 1, muncul)})` }} />;
          })}
          <div style={{ position: 'absolute', left: KISI.x0, width: 10 * KISI.sel + 9 * KISI.celah, top: ySel(10) + 8, textAlign: 'center', fontFamily: F, fontSize: 24, fontWeight: 700,
            color: B.gray, opacity: Math.max(0.0001, R(f, membeli + 40, membeli + 70, 0, 1, io) * kisi) }}>100% kepemilikan</div>
        </>) : null}
    </div>);
};

/** kotak "milik kita": terangkat dari kisi lalu terbang ke murid → lencana 1 % */
const Kepemilikan: React.FC<{ f: number }> = ({ f }) => {
  const pOrang = popIn(f, kita) * (1 - R(f, dan - 10, dan + 20, 0, 1, io));
  const kiri = PER.x - PER.w / 2;
  const dari = { x: kiri + xSel(SEL_SAYA.c) + KISI.sel / 2, y: KT + ySel(SEL_SAYA.r) + KISI.sel / 2 };
  const ke = { x: ORANG.x + 92, y: ORANG.y + 80 };
  const t = R(f, kepemilikan - 10, perusahaan + 10, 0, 1, io);
  const ada = f >= kepemilikan - 10;
  const sel = 28 + 20 * t;
  const x = lerp(dari.x, ke.x, t), y = lerp(dari.y, ke.y, t) - Math.sin(Math.PI * t) * 120;
  const pPil = popIn(f, perusahaan + 20) * (1 - R(f, dan - 10, dan + 20, 0, 1, io));
  const pergi = 1 - R(f, dan - 10, dan + 20, 0, 1, io);
  return (
    <>
      <KarakterLingkar pose={MURID} x={ORANG.x} y={ORANG.y} D={ORANG.D} s={pOrang} warna={B.blue} />
      {ada && pergi > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: sel, height: sel, borderRadius: 7 + 5 * t, background: B.orange,
        transform: `${geser(x - sel / 2, y - sel / 2)} scale(${pergi})`, boxShadow: `0 10px 20px -8px ${B.orange}` }} /> : null}
      {pPil > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(ke.x + 36, ke.y)} translate(0, -50%) scale(${pPil})`, transformOrigin: 'left center',
        padding: '6px 16px', borderRadius: 999, background: B.white, border: `2.5px solid ${B.orange}`, fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>1%</div> : null}
    </>);
};

/* ════════════════ alur bisnis: produk → pendapatan → laba ════════════════ */
const RASIO_BELANJA = 924 / 1190, RASIO_UANG = 520 / 441;
const IsiAlur: React.FC<{ f: number; w: number }> = ({ f, w }) => {
  const op = R(f, perusahaan2 - 10, perusahaan2 + 20, 0, 1, io) * (1 - R(f, kalau - 30, kalau, 0, 1, io));
  if (op <= 0.001) return null;
  const baris: { at: number; foto: 'belanja' | 'uang'; fw: number; judul: string; nilai?: number }[] = [
    { at: produk, foto: 'belanja', fw: 60, judul: 'Produk & layanan' },
    { at: pendapatan, foto: 'uang', fw: 92, judul: 'Pendapatan', nilai: 50 },
    { at: laba, foto: 'uang', fw: 66, judul: 'Laba', nilai: 10 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
      <div style={{ position: 'absolute', left: 30, top: 30, width: 58, height: 58, borderRadius: 16, background: B.orange, display: 'grid', placeItems: 'center' }}><Icon name="perusahaan" size={36} color={B.white} /></div>
      <div style={{ position: 'absolute', left: 104, top: 30, height: 58, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Bisnis</div>
      {baris.map((b, k) => {
        const p = popIn(f, b.at);
        if (p <= 0.001) return null;
        const top = 112 + k * 126, h = 96;
        const jalan = b.nilai ? b.nilai * R(f, b.at, b.at + 40, 0, 1, io) : 0;
        const fh = b.foto === 'belanja' ? b.fw / RASIO_BELANJA : b.fw / RASIO_UANG;
        return (
          <React.Fragment key={b.judul}>
            {k > 0 ? <Chevron x={w / 2} y={top - 15} warna={B.orange} p={p} d={28} arah="bawah" /> : null}
            <div style={{ position: 'absolute', left: 30, top, width: w - 60, height: h, borderRadius: 22, background: mixHex(B.white, B.orange, 0.08), transformOrigin: 'center',
              transform: `${geser(0, 0)} scale(${p})`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px 0 16px', boxSizing: 'border-box', fontFamily: F }}>
              <div style={{ width: 96, height: 80, display: 'grid', placeItems: 'center', flex: 'none' }}>
                <Img src={staticFile(b.foto === 'belanja' ? 'media/realistis/belanja.webp' : 'media/uang-rupiah.webp')} style={{ width: b.fw, height: fh, maxWidth: 'none' }} />
              </div>
              <span style={{ fontSize: 30, fontWeight: 800, color: B.night, flex: 1, whiteSpace: 'nowrap' }}>{b.judul}</span>
              {b.nilai ? <span style={{ fontSize: 34, fontWeight: 800, color: B.night, fontVariantNumeric: 'tabular-nums', display: 'inline-block', transform: HALUS3D }}>Rp{Math.round(jalan)} M</span> : null}
            </div>
          </React.Fragment>);
      })}
    </div>);
};

/* ════════════════ grafik pertumbuhan bisnis (batang per tahun) + tiga tujuan investasi kembali ════════════════ */
const GR = { x0: 80, dariKanan: 80, dasar: 330, tinggi: 200, maks: 120 };
const xTahun = (w: number, i: number) => GR.x0 + ((w - GR.x0 - GR.dariKanan) * (i + 0.5)) / TAHUN.length;
const TUJUAN: { teks: string; ikon: KunciIkon; at: number }[] = [
  { teks: 'Memperbesar bisnis', ikon: 'skalaUsaha', at: memperbesar },
  { teks: 'Produk baru', ikon: 'produkLayanan', at: produk2 },
  { teks: 'Pasar baru', ikon: 'pasarBaru', at: pasar2 },
];
const xTujuan = (w: number, k: number) => (w * (2 * k + 1)) / 6;
const IsiGrafik: React.FC<{ f: number; w: number }> = ({ f, w }) => {
  const op = R(f, kalau + 10, kalau + 40, 0, 1, io);
  if (op <= 0.001) return null;
  const pendOp = 1 - R(f, tapi - 10, tapi + 20, 0, 1, io); // saat dibandingkan dengan harga: hanya laba
  const tujuanOp = 1 - R(f, tapi - 10, tapi + 20, 0, 1, io);
  const bw = Math.min(70, (w - 160) / TAHUN.length / 3.2);
  const pNilai = popIn(f, nilai) * (1 - R(f, tapi - 10, tapi + 20, 0, 1, io));
  const vNilai = lerp(NILAI_PERUSAHAAN[0], NILAI_PERUSAHAAN[1], R(f, nilai, nilai + 70, 0, 1, io));
  const sorotLaba = R(f, laba2 - 20, laba2 + 20, 0, 1, io) * (1 - R(f, memperbesar, memperbesar + 30, 0, 1, io));
  const hanyaLaba = 1 - pendOp;
  // hanya laba (dibandingkan dengan harga): domain 120 → 30 M supaya kenaikan laba terlihat jelas (dulu batang ≤ 42 px)
  const maks = lerp(GR.maks, 30, hanyaLaba);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
      <div style={{ position: 'absolute', left: 30, top: 30, width: 58, height: 58, borderRadius: 16, background: B.orange, display: 'grid', placeItems: 'center' }}><Icon name="perusahaan" size={36} color={B.white} /></div>
      <div style={{ position: 'absolute', left: 104, top: 30, height: 58, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Bisnis</div>
      {/* legenda */}
      <div style={{ position: 'absolute', right: 30, top: 44, display: 'flex', gap: 22, fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>
        {pendOp > 0.001 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, opacity: Math.max(0.0001, pendOp) }}><i style={{ width: 18, height: 18, borderRadius: 5, background: B.blue, display: 'inline-block' }} />Pendapatan</span> : null}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><i style={{ width: 18, height: 18, borderRadius: 5, background: B.orange, display: 'inline-block' }} />Laba</span>
      </div>
      {/* nilai perusahaan berjalan */}
      {pNilai > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(w / 2, 59)} translate(-50%, -50%) scale(${pNilai})`, display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 20px', borderRadius: 999, background: rgba(ARAH.naik, 0.12), fontFamily: F, fontSize: 26, fontWeight: 800, color: ARAH.naik, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ color: B.night }}>Nilai perusahaan</span> Rp{Math.round(vNilai)} M ▲
        </div>) : null}
      <svg width={w} height={KH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={GR.x0 - 20} x2={w - GR.dariKanan + 20} y1={GR.dasar} y2={GR.dasar} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
        {TAHUN.map((_, i) => {
          const g = R(f, T_TAHUN[i] - 20, T_TAHUN[i] + 40, 0, 1, io);
          if (g <= 0.001) return null;
          const xc = xTahun(w, i);
          const hP = (PEND[i] / GR.maks) * GR.tinggi * g, hL = (LABA[i] / maks) * GR.tinggi * g;
          const xP = lerp(xc - bw - 6, xc - bw / 2, hanyaLaba), xL = lerp(xc + 6, xc - bw / 2, hanyaLaba);
          return (
            <g key={i}>
              {pendOp > 0.001 ? <rect x={xP} y={GR.dasar - hP} width={bw} height={hP} rx={8} fill={B.blue} opacity={pendOp} /> : null}
              <rect x={xL} y={GR.dasar - hL} width={bw} height={hL} rx={8} fill={B.orange} />
              {i === 2 && sorotLaba > 0.001 ? <rect x={xL - 6} y={GR.dasar - hL - 6} width={bw + 12} height={hL + 12} rx={12} fill="none" stroke={B.orange} strokeWidth={3} opacity={sorotLaba} /> : null}
            </g>);
        })}
      </svg>
      {TAHUN.map((th, i) => {
        const g = R(f, T_TAHUN[i] - 20, T_TAHUN[i] + 40, 0, 1, io);
        if (g <= 0.001) return null;
        const xc = xTahun(w, i);
        const hP = (PEND[i] / GR.maks) * GR.tinggi * g, hL = (LABA[i] / maks) * GR.tinggi * g;
        const xP = xc - bw / 2 - 6, xL = lerp(xc + 6 + bw / 2, xc, hanyaLaba);
        const lbl = (x: number, y: number, teks: string, col: string, o = 1) => (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -100%)`, opacity: Math.max(0.0001, Math.min(0.9999, g * o)), fontFamily: F, fontSize: 22,
            fontWeight: 800, color: col, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{teks}</div>);
        return (
          <React.Fragment key={th}>
            {pendOp > 0.001 ? lbl(xP, GR.dasar - hP - 6, `${Math.round(PEND[i] * g)} M`, B.blue, pendOp) : null}
            {lbl(xL, GR.dasar - hL - 6, `${Math.round(LABA[i] * g)} M`, mixHex(B.orange, B.night, 0.3))}
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(xc, GR.dasar + 14)} translate(-50%, 0)`, opacity: Math.max(0.0001, Math.min(0.9999, g)), fontFamily: F,
              fontSize: 26, fontWeight: 800, color: B.night }}>{th}</div>
          </React.Fragment>);
      })}
      {/* tiga tujuan investasi kembali */}
      {TUJUAN.map((t, k) => {
        const p = popIn(f, t.at) * tujuanOp;
        if (p <= 0.001) return null;
        return (
          <div key={t.teks} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(xTujuan(w, k), 432)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 22px 8px 8px', borderRadius: 999, background: B.white, border: `2.5px solid ${rgba(B.orange, 0.6)}`, boxShadow: `0 10px 22px -12px ${rgba(B.orange, 0.8)}`,
            fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: B.orange, display: 'grid', placeItems: 'center' }}><Icon name={t.ikon} size={30} color={B.white} /></div>
            {t.teks}
          </div>);
      })}
    </div>);
};

/** uang dari batang laba 2027 terbang ke tiap tujuan (koordinat dunia, kartu bisnis selebar penuh) */
const UangInvestasiKembali: React.FC<{ f: number }> = ({ f }) => {
  const kl = PENUH.x - PENUH.w / 2;
  const bw = Math.min(70, (PENUH.w - 160) / TAHUN.length / 3.2);
  // di kanan-atas batang laba 2027 (dulu tepat di atasnya → menimpa label "19 M", f16420)
  const dari = { x: kl + xTahun(PENUH.w, 2) + 6 + bw + 52, y: KT + GR.dasar - (LABA[2] / GR.maks) * GR.tinggi - 30 };
  const angkat = popIn(f, kembali) * (1 - R(f, memperbesar - 50, memperbesar - 40, 0, 1, io));
  return (
    <>
      {angkat > 0.001 ? <UangFoto x={dari.x} y={dari.y} w={70} p={angkat} /> : null}
      {TUJUAN.map((t, k) => {
        const a = t.at - 50, b = t.at;
        if (f < a || f >= b + 4) return null;
        const s = R(f, a, b, 0, 1, io);
        const ke = { x: kl + xTujuan(PENUH.w, k) - 90, y: KT + 432 };
        return <UangFoto key={k} x={lerp(dari.x, ke.x, s)} y={lerp(dari.y, ke.y, s) - Math.sin(Math.PI * s) * 80} w={lerp(70, 44, s)} p={0.99996 * (1 - R(f, b - 6, b + 4, 0, 1, io))} />;
      })}
    </>);
};

/* ════════════════ kartu harga saham ════════════════ */
const IsiHarga: React.FC<{ f: number; w: number }> = ({ f, w }) => {
  const g = gLilin(f);
  const rel = nilaiLilin(LILIN, g);
  const v = Math.round((1250 * rel) / 5) * 5;
  const d = rel - 1;
  const col = Math.abs(d) < 0.004 ? B.night : d > 0 ? ARAH.naik : ARAH.turun;
  const C = { x0: 40, x1: w - 40, y0: 222, y1: 436 };
  const cw = C.x1 - C.x0, ch = C.y1 - C.y0;
  const yL = (val: number) => ch * (1 - (val - DOM_L[0]) / (DOM_L[1] - DOM_L[0]));
  const pasarOp = R(f, diberikan - 30, diberikan, 0, 1, io) * (1 - R(f, nilainya - 20, nilainya + 10, 0, 1, io));
  const grafikOp = R(f, nilainya, nilainya + 30, 0, 1, io);
  /* "laba tidak bergerak sama persis dengan harga setiap hari": tren laba (putus, oranye) + dua penanda */
  const trenLaba = R(f, laba3 - 20, laba3 + 30, 0, 1, io);
  const penanda = R(f, hari - 20, hari + 20, 0, 1, io) * (1 - R(f, pasar3 - 30, pasar3, 0, 1, io));
  return (
    <>
      <div style={{ position: 'absolute', left: 30, top: 30, width: 58, height: 58, borderRadius: 16, background: B.orange, display: 'grid', placeItems: 'center' }}><Icon name="saham" size={36} color={B.white} /></div>
      <div style={{ position: 'absolute', left: 104, top: 30, height: 58, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Harga saham</div>
      <div style={{ position: 'absolute', left: 0, top: 108, width: w, textAlign: 'center', fontFamily: F, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 56, fontWeight: 800, color: col, fontVariantNumeric: 'tabular-nums', display: 'inline-block', transform: HALUS3D }}>{rpPenuh(v)}</span>
        <span style={{ fontSize: 26, fontWeight: 700, color: B.gray, marginLeft: 10 }}>/lembar</span>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 176, width: w, textAlign: 'center', opacity: Math.max(0.0001, Math.min(0.9999, Math.abs(d) / 0.02)) }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 999, background: rgba(col, 0.12), fontFamily: F, fontSize: 24, fontWeight: 800, color: col,
          fontVariantNumeric: 'tabular-nums' }}>
          <svg width={16} height={13} viewBox="0 0 22 18"><path d={d >= 0 ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} /></svg>
          {`${d >= 0 ? '+' : '−'}${Math.round(Math.abs(d) * 100)}%`}
        </span>
      </div>
      {/* pasar = pembeli & penjual (orang berbeda) yang sepakat di harga ini */}
      {pasarOp > 0.001 ? PASAR.map((o, k) => {
        const p = popIn(f, o.at) * pasarOp;
        const x = (w * (k + 1)) / 4;
        return (
          <React.Fragment key={k}>
            <KarakterLingkar pose={o.pose} x={x} y={322} D={104} s={p} warna={o.peran === 'Beli' ? B.blueLite : B.orangeLite} />
            {p > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, 404)} translate(-50%, -50%) scale(${p})`, padding: '5px 18px', borderRadius: 999,
              background: o.peran === 'Beli' ? B.blue : B.orange, color: B.white, fontFamily: F, fontSize: 24, fontWeight: 800 }}>{o.peran}</div> : null}
          </React.Fragment>);
      }) : null}
      {grafikOp > 0.001 ? (
        <div style={{ position: 'absolute', left: C.x0, top: C.y0, width: cw, height: ch, opacity: grafikOp < 1 ? Math.max(0.0001, grafikOp) : undefined }}>
          <GrafikLilin d={LILIN} w={cw} h={ch} g={g} dom={DOM_L} pasar modal titik />
          {trenLaba > 0.001 ? (
            <svg width={cw} height={ch} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <line x1={0} y1={yL(1)} x2={cw * trenLaba} y2={lerp(yL(1), yL(TREN_LABA_AKHIR), trenLaba)} stroke={B.orange} strokeWidth={3} strokeDasharray="9 8" strokeLinecap="round" opacity={0.9} />
            </svg>) : null}
        </div>) : null}
      {/* legenda DI BAWAH grafik; "setiap hari" → laba ▲ sementara harga hari ini ▼ (dulu legenda & pil di atas garis: menimpa garis & baris harga) */}
      {trenLaba > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: C.y1 + 14, width: w, display: 'flex', justifyContent: 'center', gap: 26, opacity: Math.max(0.0001, Math.min(0.9999, trenLaba)),
          fontFamily: F, fontSize: 22, fontWeight: 800, whiteSpace: 'nowrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: mixHex(B.orange, B.night, 0.3) }}><i style={{ width: 24, height: 4, background: B.orange, display: 'inline-block', borderRadius: 2 }} />Laba
            {penanda > 0.001 ? <b style={{ color: mixHex(B.orange, B.night, 0.2), opacity: Math.max(0.0001, penanda), marginLeft: 4 }}>naik ▲</b> : null}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: B.night }}><svg width={16} height={20} viewBox="0 0 16 20"><line x1={4} x2={4} y1={1} y2={19} stroke={ARAH.naik} strokeWidth={1.5} /><rect x={1.5} y={5} width={5} height={10} fill={ARAH.naik} /><line x1={12} x2={12} y1={2} y2={17} stroke={ARAH.turun} strokeWidth={1.5} /><rect x={9.5} y={4} width={5} height={8} fill={ARAH.turun} /></svg>Harga
            {penanda > 0.001 ? <b style={{ color: ARAH.turun, opacity: Math.max(0.0001, penanda), marginLeft: 4 }}>hari ini turun ▼</b> : null}</span>
        </div>) : null}
    </>);
};
/* ════════════════ pasar menilai: tiga orang berbeda di bawah kartu harga ════════════════ */
const Penilai: React.FC<{ f: number }> = ({ f }) => {
  const pergi = 1 - R(f, jadi - 20, jadi + 10, 0, 1, io);
  if (f < pasar3 - 50 || pergi <= 0.001) return null;
  return (
    <>
      {PENILAI.map((o, k) => {
        const p = popIn(f, o.at) * pergi;
        const x = 1010 + k * 270, y = 878; // jarak 270: gelembung (±165–190 px) tidak menyentuh orang berikutnya
        return (
          <React.Fragment key={k}>
            <KarakterLingkar pose={o.pose} x={x} y={y} D={84} s={p} warna={B.orangeLite} />
            {p > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x + 52, y)} translate(0, -50%) scale(${p})`, transformOrigin: 'left center',
              padding: '6px 14px', borderRadius: '16px 16px 16px 4px', background: B.white, boxShadow: `0 8px 18px -10px ${rgba(B.night, 0.4)}`, border: `2px solid ${rgba(B.orange, 0.5)}`,
              fontFamily: F, fontSize: 20, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>{o.kata}</div> : null}
          </React.Fragment>);
      })}
    </>);
};

/* ════════════════ investor saham & dua sumber return ════════════════ */
const Investor: React.FC<{ f: number }> = ({ f }) => {
  const p = popIn(f, investor);
  if (p <= 0.001) return null;
  const pos = { x: 960, y: 876 };
  const gKiri = R(f, hasil - 30, hasil + 20, 0, 1, io), gKanan = R(f, perubahan - 30, perubahan + 20, 0, 1, io);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <Penghubung d={`M ${KIRI.x + 120} ${KT + KH + 14} C ${KIRI.x + 120} ${pos.y}, ${pos.x - 140} ${pos.y}, ${pos.x - 82} ${pos.y}`} g={gKiri} warna={B.orange} />
        <Penghubung d={`M ${KANAN.x - 120} ${KT + KH + 14} C ${KANAN.x - 120} ${pos.y}, ${pos.x + 140} ${pos.y}, ${pos.x + 82} ${pos.y}`} g={gKanan} warna={ARAH.naik} />
      </svg>
      <KarakterLingkar pose={INVESTOR_JAS} x={pos.x} y={pos.y} D={128} s={p} warna={B.orange} />
      <PilSumber x={pos.x - 440} y={pos.y + 6} p={popIn(f, hasil + 10)} ikon="pendapatan" teks="Hasil bisnis" warna={B.orange} />
      <PilSumber x={pos.x + 460} y={pos.y + 6} p={popIn(f, perubahan + 10)} ikon="naikTurunHarga" teks="Perubahan harga" warna={ARAH.naik} />
    </>);
};
const PilSumber: React.FC<{ x: number; y: number; p: number; ikon: KunciIkon; teks: string; warna: string }> = ({ x, y, p, ikon, teks, warna }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 20px 6px 6px',
    borderRadius: 999, background: B.white, border: `2.5px solid ${warna}`, boxShadow: `0 10px 22px -12px ${warna}`, fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
    <div style={{ width: 42, height: 42, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={26} color={B.white} /></div>
    {teks}
  </div>);

/* ════════════════ benda ════════════════ */
const UangFoto: React.FC<{ x: number; y: number; w: number; p: number }> = ({ x, y, w, p }) => {
  const h = w / RASIO_UANG;
  return <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none', transformOrigin: 'center',
    transform: `${geser(x - w / 2, y - h / 2)} scale(${p})`, opacity: Math.min(0.9999, Math.max(0.0001, p)) }} />;
};

/** cakram oranye (warna bab Saham) + foto saham realistis Video 3; foto 0 = ikon bab (serah-terima dari simpul peta) */
const RASIO_SAHAM = 1000 / 883;
const CakramSaham: React.FC<{ x: number; y: number; d: number; foto: number; op: number }> = ({ x, y, d, foto, op }) => {
  const w = 1.1 * d, h = w / RASIO_SAHAM;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: geser(x, y), opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
      <div style={{ position: 'absolute', left: -85, top: -85, width: 170, height: 170, transform: `scale(${d / 170})` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: d < 90 ? '28%' : '50%', background: B.orange, display: 'grid', placeItems: 'center', transform: 'scale(0.99996)',
          boxShadow: `0 18px 40px -12px ${B.orange}aa` }}>
          {foto < 0.999 ? <div style={{ opacity: Math.max(0.0001, 1 - foto), display: 'grid' }}><Icon name="saham" size={96} color={B.white} /></div> : null}
        </div>
      </div>
      {foto > 0.001 ? <Img src={staticFile('media/realistis/saham.webp')} style={{ position: 'absolute', left: -w / 2, top: -h / 2 - 0.06 * d, width: w, height: h, maxWidth: 'none',
        opacity: Math.min(0.9999, foto) }} /> : null}
    </div>);
};

/** lencana "≠" di antara dua kartu */
const TidakSama: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 76, height: 76, borderRadius: '50%', background: B.orange, transformOrigin: 'center',
    transform: `${geser(x - 38, y - 38)} scale(${p})`, boxShadow: `0 12px 26px -10px ${B.orange}cc`, display: 'grid', placeItems: 'center' }}>
    <svg width={44} height={44} viewBox="0 0 44 44"><g stroke={B.white} strokeWidth={5} strokeLinecap="round"><line x1={10} y1={17} x2={34} y2={17} /><line x1={10} y1={27} x2={34} y2={27} /><line x1={28} y1={8} x2={16} y2={36} /></g></svg>
  </div>);

export const S08_BEAT = { saham, membeli, kita, sebagian, kepemilikan, perusahaan, dan, dua, dibedakan, pertama, bisnisnya, produk, pendapatan, laba, kedua, sahamnya,
  diberikan, pasar, tersebut, nilainya, berubah, kalau, berkembang, labanya, tumbuh, laba2, kembali, memperbesar, produk2, pasar2, menciptakan, nilai, tapi, pertumbuhan,
  pergerakan, berbeda, persis, laba3, hari, pasar3, menilai, jadi, investor, hasil, perubahan };
export type _W = typeof WordText;
