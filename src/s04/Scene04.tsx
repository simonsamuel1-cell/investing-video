import React from 'react';
import { ARAH, B, F, R, SISI, io, lerp, mixHex, rgba } from '../theme';
import { Icon, WordText, cin, popIn as linIn, popOut as linOut, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Label, Lencana } from '../parts/umum';
import { Kaca, KacaMorf, KarakterLingkar, MaskerKeluar, ORANG_BARU, ORANG_MUDA, Penghubung, geser, type GeoKartu } from '../parts/kaca';
import { PilNominal } from '../parts/nominal';
import { Foto, Sosok, TepiSubtitle, type Pose } from '../parts/nyata';
import { BatangLilin, KisiLilin, hargaBulat, jangkauan, lilinGulir, posisiGulir, tumbuh } from '../parts/lilinRiil';
import { ICBP_HARGA, ICBP_SENTIMEN, ICBP_SENTIMEN_TURUN } from '../data/lilinS04.gen';
import { AngkaBulat, FotoLingkar, KacaBulat, POSE_BENDA, geoBulat, geserKe } from '../parts/lingkar';
import { S04_KE02, S04_KE03 } from '../parts/waktuTransisi';
import { PIVOT_S05 } from '../s05/geo05';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';

/**
 * SCENE 04 — "Kenapa Relevan untuk Investor Indonesia?" — DIROMBAK 30 Okt (Simon 29 Okt malam: layout seperti PPT, banyak fade, spacing &
 * hierarki berantakan → aturan Investing 101). Tanpa papan berjudul + strip 01·02·03, tanpa pudar sebagai transisi. SATU benda dibawa sepanjang alasan:
 *  A   guru (memory anchor) di tengah → menepi; awan pertanyaan · tiga lingkaran 01 02 03 di "tiga alasan".
 *  01  lingkaran 01 MEMEKAR jadi kartu Harga (angka berdetak) → kartu MELEBAR memberi ruang ke Bisnis (foto gedung, tiap kuartal) dengan ≠
 *      → kartu MENGERUT jadi lingkaran Pasar Indonesia · investor ritel (foto orang) · dana asing masuk/keluar
 *      → lingkaran MEMEKAR jadi chart: sentimen berubah, harga jatuh tajam, kondisi perusahaan nyaris tetap → jarak harga–nilai.
 *  02  panel sentimen MORF jadi lingkaran 02, latar ber-tint biru (2 Nov; dulu tiga cakram): lingkaran 02 → foto gedung (jangka panjang) → empat sektor (gedung DIBAWA ke Perbankan) → puluhan tahun
 *      → empat lingkaran MENYATU jadi chart sejarah 20 tahun: pendapatan · laba · dividen · siklus bisnis.
 *  03  panel sejarah MORF jadi lingkaran 03, latar ber-tint krim (2 Nov; dulu bilah naik): lingkaran 03 → stopwatch "Tercepat" ✕ · ponsel "Layar sepanjang hari" ✕ → kamu (foto) · tetap bekerja · aktivitas
 *      → kalender seminggu: hari kerja tetap, akhir pekan = pahami bisnis · perbarui analisis.
 *  → S05: MASKER KELUAR, isi mengecil ke poros timbangan S05.
 * Angka chart = ILUSTRASI (dilaporkan ke Simon).
 */
const PASANG: [string, string][] = [
  ['kenapa', 'kenapa'], ['relevan', 'relevan'], ['indonesia', 'indonesia'], ['ada', 'ada'], ['tiga', 'tiga'], ['alasan', 'alasan'], ['pertama', 'pertama'],
  ['harga', 'harga'], ['pasar', 'pasar'], ['cepat', 'cepat'], ['daripada', 'daripada'], ['bisnisnya', 'bisnisnya'],
  ['pasar2', 'pasar'], ['partisipasi', 'partisipasi'], ['ritel', 'ritel'], ['besar', 'besar'], ['sementara', 'sementara'], ['dana', 'dana'], ['asing', 'asing'],
  ['masuk', 'masuk'], ['keluar', 'keluar'], ['cepat2', 'cepat'], ['saat', 'saat'], ['sentimen', 'sentimen'], ['berubah', 'berubah'], ['harga2', 'harga'],
  ['bergerak', 'bergerak'], ['tajam', 'tajam'], ['meskipun', 'meskipun'], ['kondisi', 'kondisi'], ['perusahaan', 'perusahaan'], ['itu', 'itu'], ['bagi', 'bagi'],
  ['jarak', 'jarak'], ['nilai', 'nilai'], ['diperhatikan', 'diperhatikan'],
  ['kedua', 'kedua'], ['indonesia2', 'indonesia'], ['bisnis', 'bisnis'], ['dipelajari', 'dipelajari'], ['jangka', 'jangka'], ['panjang', 'panjang'],
  ['ada2', 'ada'], ['sektor', 'sektor'], ['perbankan', 'perbankan'], ['consumer', 'consumer'], ['telekomunikasi', 'telekomunikasi'], ['lainnya', 'lainnya'],
  ['puluhan', 'puluhan'], ['artinya', 'artinya'], ['sejarah', 'sejarah'], ['pendapatan', 'pendapatan'], ['laba', 'laba'], ['dividen', 'dividen'],
  ['siklus', 'siklus'], ['dipelajari2', 'dipelajari'],
  ['ketiga', 'ketiga'], ['orang', 'orang'], ['tercepat', 'tercepat'], ['layar', 'layar'], ['hari', 'hari'], ['kita', 'kita'], ['bekerja', 'bekerja'],
  ['aktivitas', 'aktivitas'], ['kita2', 'kita'], ['menyediakan', 'menyediakan'], ['waktu', 'waktu'], ['memahami', 'memahami'], ['memperbarui', 'memperbarui'],
  ['analisis', 'analisis'],
];
const T = (() => {
  const v = urut(PASANG.map(([, w]) => w), BATAS.s4);
  return Object.fromEntries(PASANG.map(([n], i) => [n, v[i]])) as Record<string, number>;
})();
const AWAL = BATAS.s4, AKHIR = BATAS.s5;
const ABU_TEKS = mixHex(B.gray, B.night, 0.45);
const HIJAU_TEKS = mixHex(ARAH.naik, B.night, 0.45), MERAH_TEKS = mixHex(ARAH.turun, B.night, 0.25);
const ribu = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** lin = kemajuan LINEAR 60 f berpusat di `at` (untuk swipe Sosok/Kaca); keluarPop = pop keluar (dikalikan dengan pop masuk — reference_pop_helper_traps) */
const lin = (f: number, at: number) => linIn(f, at);
const PANEL = { x: 960, y: 500, w: 1200, h: 580 };
const geoPanel = (warna: string, w = PANEL.w): GeoKartu => ({ x: PANEL.x, y: PANEL.y, w, h: PANEL.h, warna, tab: 'atas' });

/* ═══════════════════════ A · GURU + PERTANYAAN + TIGA LINGKARAN ═══════════════════════ */
const GURU: Pose = { src: 'karakter/guru_menunjuk.png', w: 774, h: 1593, x0: 5, x1: 670, y0: 60, y1: 1581 };
/** 2 Nov (Simon: "Perbesar orangnya (tampilan setengah badan)"): skala 1,15 × tinggi berkas (dulu tinggi tinta 760 px, seluruh badan) — kepala y 150,
 *  ikat pinggang (berkas y ±743) ±935 → tepat di pita pudar subtitle (TepiSubtitle); kaki jauh di luar frame. Badan (kepala x berkas ±421) 96 px kanan
 *  tengah tinta (lengan menunjuk ke kiri) → posisi dihitung dari BADAN. */
const GURU_K = 1.15, GURU_H = (1581 - 60) * GURU_K, GURU_KAKI = 150 + GURU_H, GURU_BADAN = (421 - 337.5) * GURU_K;
// 30 Okt malam (Simon S04: "Perbaiki bentuk bubblenya"): rasio = bentuk acuan awan 400 × 284 (dulu 780 × 400 → semua gumpalan teregang mendatar, awan
// penyok) + dua titik pikiran (seperti awan Scene 01) dari kepala guru, lewat di ATAS lengannya yang menunjuk
/** TEKS PERTANYAAN (2 Nov, Simon: "adegan ini buat textnya seperti screenshoot tanpa ada bubble" — acuan "you have / questions?"): dulu awan pikir.
 *  Baris 1 biasa (500), baris 2 tebal di atas SOROTAN SELEKSI ungu muda dengan dua pegangan (garis tegak + titik: kiri-atas & kanan-bawah) seperti teks
 *  yang dipilih di aplikasi desain. Rata kiri di kiri guru; guru menunjuk ke arahnya. */
const TANYA = { x: 190, y1: 385, y2: 482, // y1 395 → 385: titik pegangan kiri-atas tidak menyentuh baris 1 (audit TEKS-LEWAT-TEPI f12540)
  f1: 64, f2: 76, padX: 16, padY: 8 };
/** 2 Nov (Simon: "Buat icon 1, 2, 3 itu center pada tengah layar (horizontal)"): 740 · 960 · 1180 (dulu 500 · 720 · 940 di kiri guru); y 500 + kamera
 *  +40 = 540 layar. Guru & awan keluar bersama sebelum ketiganya pop (lingkaran sendirian di tengah) */
const NOMOR = { x: [740, 960, 1180], y: 500, d: 160, warna: [B.blue, B.turq, B.orange] };
const tA = {
  guruMasuk: T.kenapa - 30, guruMenepi: T.relevan - 15, awan: T.relevan + 15, awanKeluar: T.ada - 12,
  nomor: [T.alasan + 25, T.alasan + 45, T.alasan + 65], guruKeluar: T.ada - 12, nomorKeluar: [0, T.harga + 30, T.harga + 30],
  morf: T.harga + 30,
};
/** tengah dulu, lalu memberi ruang: 01 pop di 960, bergeser ke kiri saat 02 & 03 pop → baris selalu berpusat; akhir = NOMOR.x */
// geser mulai 15 f sebelum pop (Simon S05 2 Nov: pop & swipe bersamaan)
const xNomor = (f: number, k: number) => 960 + (k - (cin(f, tA.nomor[1] - 15) + cin(f, tA.nomor[2] - 15)) / 2) * 220;
// 30 Okt malam (Simon S04: "Morphing lingkaran ke panel seharusnya bersamaan dengan animasi swipe icon/illustrasi/visual disebelahnya"): guru & lingkaran
   // 02 · 03 keluar dalam 60 f yang SAMA dengan lingkaran 01 memekar (dulu ±28 f lebih dulu)
/** lebar kotak sorot baris 2 = lebar tinta "investor Indonesia?" 76 px / 800 (terukur dari render f12660: tinta x 210–914) */
const LEBAR_BARIS2 = 712;
const TeksTanya: React.FC<{ f: number }> = ({ f }) => {
  if (f < tA.awan - 30 || f > tA.awanKeluar + 30) return null;
  const T2 = TANYA, w = LEBAR_BARIS2 + 2 * T2.padX, h = T2.f2 * 1.18 + 2 * T2.padY;
  // sorotan menyapu kiri → kanan 60 f (pegangan kanan ikut tepinya), keluar menyusut ke kanan; pegangan: garis trim + titik pop
  const sapu = cin(f, tA.awan + 60) * (1 - cin(f, tA.awanKeluar));
  const asal = f < tA.awanKeluar - 30 ? 'left' : 'right';
  const pKiri = popIn(f, tA.awan + 30) * linOut(f, tA.awanKeluar), pKanan = popIn(f, tA.awan + 90) * linOut(f, tA.awanKeluar);
  const gKiri = cin(f, tA.awan + 30) * (1 - cin(f, tA.awanKeluar));
  const xKanan = asal === 'left' ? T2.x + w * sapu : T2.x + w;
  return (
    <>
      {sapu > 0 ? <div style={{ position: 'absolute', left: T2.x, top: T2.y2, width: w, height: h, background: rgba(B.blue, 0.22), transformOrigin: `${asal} center`,
        transform: `scaleX(${sapu})` }} /> : null}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {gKiri > 0 ? <line x1={T2.x} x2={T2.x} y1={T2.y2 - 8} y2={T2.y2 - 8 + (h + 8) * gKiri} stroke={B.blue} strokeWidth={4} strokeLinecap="round" /> : null}
        {pKiri > 0.001 ? <circle cx={T2.x} cy={T2.y2 - 8} r={11 * skalaPop(pKiri)} fill={B.blue} /> : null}
        {sapu > 0.02 ? <line x1={xKanan} x2={xKanan} y1={T2.y2} y2={T2.y2 + h + 8} stroke={B.blue} strokeWidth={4} strokeLinecap="round" /> : null}
        {pKanan > 0.001 ? <circle cx={xKanan} cy={T2.y2 + h + 8} r={11 * skalaPop(pKanan)} fill={B.blue} /> : null}
      </svg>
      <div style={{ position: 'absolute', left: T2.x, top: T2.y1, whiteSpace: 'nowrap', lineHeight: 1.1 }}>
        <WordText f={f} at={tA.awan} until={tA.awanKeluar} style={{ fontFamily: F, fontSize: T2.f1, fontWeight: 500, color: B.night, letterSpacing: '-.01em' }}>Kenapa relevan untuk</WordText>
      </div>
      <div style={{ position: 'absolute', left: T2.x + T2.padX, top: T2.y2 + T2.padY, whiteSpace: 'nowrap', lineHeight: 1.18 }}>
        <WordText f={f} at={tA.awan + 20} until={tA.awanKeluar} style={{ fontFamily: F, fontSize: T2.f2, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>investor Indonesia?</WordText>
      </div>
    </>);
};
const BagianA: React.FC<{ f: number }> = ({ f }) => {
  const xGuru = geserKe(f, tA.guruMenepi, 960, 1450) - GURU_BADAN; // BADAN di tengah dulu, lalu memberi ruang untuk awan (x Sosok = tengah tinta)
  const pGuru = lin(f, tA.guruMasuk) * linOut(f, tA.guruKeluar);
  const pAwan = popIn(f, tA.awan) * linOut(f, tA.awanKeluar);
  return (
    <>
      <TepiSubtitle><Sosok pose={GURU} x={xGuru} kaki={GURU_KAKI} h={GURU_H} p={pGuru} /></TepiSubtitle>
      {pAwan > 0 || f < tA.awanKeluar + 30 ? <TeksTanya f={f} /> : null}
      {/* lingkaran 02 · 03 SWIPE KE BAWAH keluar frame bersama guru, dalam 60 f yang sama dengan lingkaran 01 memekar (dulu mengecil di tempat → panel
          yang memekar melewati keduanya) */}
      {[1, 2].map((i) => (
        <KacaBulat key={i} x={xNomor(f, i)} y={NOMOR.y} d={NOMOR.d} warna={NOMOR.warna[i]} p={popIn(f, tA.nomor[i])} keluar={linOut(f, tA.nomorKeluar[i])} arah="bawah">
          <AngkaBulat n={i + 1} d={NOMOR.d} warna={NOMOR.warna[i]} /></KacaBulat>))}
    </>);
};

/* ═══════════════════════ 01 · HARGA BERGERAK CEPAT ═══════════════════════ */
const t1 = {
  lebar: T.cepat + 10, bisnis: T.daripada + 15, beda: T.bisnisnya + 10, kuartal: T.bisnisnya + 25, detik: T.cepat,
  kerut: T.pasar2 + 28, fotoPasar: T.pasar2 + 28 + 48, labelPasar: T.pasar2 + 82, // foto pasar pop di ujung kerut (dulu di tengah kerut, menumpuk isi kartu lama)
  ritel: T.ritel - 10, labelRitel: T.ritel + 20, panahRitel: T.besar + 20, asing: T.dana + 10, labelAsing: T.asing + 20, masuk: T.masuk + 10, keluarP: T.keluar + 10,
  tarik: T.saat - 40, sisiKeluar: T.saat - 10, fotoKeluar: T.saat - 10, mekar: T.saat - 10, // lingkaran Pasar memekar BERSAMA ritel & dana asing swipe keluar (dulu +50 f)
  sentimen: T.sentimen + 40, berubah: T.berubah + 20, riwayat: T.saat + 10, tajam: T.tajam, pilHarga: T.tajam + 50, nilai: T.kondisi + 15,
  pilNilai: T.perusahaan + 50, jarak: T.jarak + 15, chipJarak: T.nilai + 20,
};
/** HARGA BERGERAK CEPAT (30 Okt malam, Simon S04: "alih alih menggunakan linechart yang bergerak dengan cepat, ganti saja dengan candlestick dengan
 *  volatilitas yang sama, animasikan candlenya dengan realistis seperti contoh yang sebelumnya aku kirim"): CANDLE HARIAN RIIL ICBP Agu–Okt 2025
 *  (scripts/gen-lilin-s04.py) BERGULIR — resep video TA: 22 candle riwayat memenuhi jendela saat kartu tampil, candle baru TUMBUH LINEAR dari buka tiap
 *  14 f sambil chart bergulir ke kiri, skala harga TERKUNCI; angka = tutup candle yang sedang terbentuk (fraksi BEI), ▲/▼ terhadap tutup sebelumnya. */
const SPARK = { w: 440, h: 150 };
const H_SLOT = 20, H_DASAR = 22, H_PER = 14;
const POS_HARGA = posisiGulir(H_DASAR, Array.from({ length: ICBP_HARGA.length - H_DASAR }, (_, j) => ({ mulai: tA.morf - 30 + j * H_PER, d: H_PER })), 4);
const [H_LO, H_HI] = jangkauan(ICBP_HARGA);
const yHarga = (v: number) => SPARK.h - 8 - ((v - H_LO) / (H_HI - H_LO)) * (SPARK.h - 16);
const IsiHarga: React.FC<{ f: number }> = ({ f }) => {
  const pos = POS_HARGA(f);
  const lil = lilinGulir(ICBP_HARGA, pos, 0, SPARK.w - H_SLOT / 2, H_SLOT);
  const akhir = lil[lil.length - 1];
  // ▲/▼ = arah candle yang sedang terbentuk (tutup vs buka, = warnanya) — dulu vs tutup kemarin: segitiga bisa berbalik 2× dalam 3 f di pergantian
  // candle (pindai f12831/12833)
  const naik = ICBP_HARGA[akhir.k].c >= ICBP_HARGA[akhir.k].o;
  const harga = hargaBulat(akhir.c.c);
  return (
    <div style={{ position: 'absolute', left: 300 - 260, top: 0, width: 520, height: PANEL.h }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>Harga</div>
      <svg width={SPARK.w} height={SPARK.h} style={{ position: 'absolute', left: 40, top: 120, overflow: 'visible' }}>
        <defs><clipPath id="s04-harga"><rect x={0} y={-20} width={SPARK.w} height={SPARK.h + 40} /></clipPath></defs>
        <KisiLilin w={SPARK.w} h={SPARK.h} />
        <line x1={0} x2={SPARK.w} y1={SPARK.h} y2={SPARK.h} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
        <g clipPath="url(#s04-harga)">{lil.map((l) => <BatangLilin key={l.k} c={l.c} x={l.x} slot={H_SLOT} Y={yHarga} sumbu={2} alfa={l.alfa} />)}</g>
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 316, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14,
        fontFamily: F, fontSize: 64, fontWeight: 800, color: B.night, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        <svg width={34} height={28} viewBox="0 0 22 18"><path d={naik ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={naik ? ARAH.naik : ARAH.turun} /></svg>
        {/* lebar angka DIKUNCI ke harga terlebar (Rp10.000) — dulu grup di-tengah-ulang tiap harga melintasi 10.000 → label loncat ±19 px (pindai f13071/13073) */}
        <span style={{ display: 'grid', justifyItems: 'start' }}>
          <span style={{ gridArea: '1 / 1', visibility: 'hidden' }}>Rp{ribu(10000)}</span>
          <span style={{ gridArea: '1 / 1' }}>Rp{ribu(harga)}</span>
        </span>
      </div>
    </div>);
};
const IsiBisnis: React.FC<{ f: number; w: number }> = ({ f, w }) => {
  const p = popIn(f, t1.bisnis);
  if (p <= 0.001) return null;
  const cx = w - 300;
  return (
    <>
      <div style={{ position: 'absolute', left: cx - 260, width: 520, top: 46, textAlign: 'center' }}>
        <WordText f={f} at={t1.bisnis} style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>Bisnis</WordText>
      </div>
      <Foto k="perusahaan" x={cx} y={205} w={140} p={p} />
      <div style={{ position: 'absolute', left: cx - 260, width: 520, top: 322, textAlign: 'center' }}>
        <WordText f={f} at={t1.bisnis + 15} style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>Laporan keuangan</WordText>
      </div>
      <Chip x={cx} y={460} teks="Tiap kuartal" ikon="kalender" warna={B.turq} p={popIn(f, t1.kuartal)} size={28} />
    </>);
};
/** tanda ≠ di lingkaran putih (dua garis + coret, geometris) */
const TidakSama: React.FC<{ x: number; y: number; d: number; p: number; warna: string }> = ({ x, y, d, p, warna }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, transformOrigin: 'center',
    borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box', boxShadow: `0 4px 10px -4px ${warna}59` }}>
    <svg width={d} height={d} viewBox="0 0 100 100" style={{ position: 'absolute', left: -SISI, top: -SISI }}>
      <line x1={30} x2={70} y1={41} y2={41} stroke={warna} strokeWidth={8} strokeLinecap="round" />
      <line x1={30} x2={70} y1={59} y2={59} stroke={warna} strokeWidth={8} strokeLinecap="round" />
      <line x1={60} x2={40} y1={26} y2={74} stroke={warna} strokeWidth={8} strokeLinecap="round" />
    </svg>
  </div>);
const IsiHargaBisnis: React.FC<{ f: number; w: number }> = ({ f, w }) => (
  <>
    <IsiHarga f={f} />
    <Chip x={300} y={460} teks="Tiap detik" ikon="waktu" warna={B.blue} p={popIn(f, t1.detik)} size={28} />
    <IsiBisnis f={f} w={w} />
    <TidakSama x={w / 2} y={240} d={96} p={popIn(f, t1.beda)} warna={B.orange} />
  </>);

/* pasar Indonesia: lingkaran di tengah, investor ritel (foto orang) kiri, dana asing kanan */
const PASAR = { x: 960, y: 450, d: 260 };
/** investor ritel = TUJUH ORANG BERBEDA (Simon 30 Okt mengirim 10 foto orang Indonesia — dulu 5 dari 7 lingkaran wajah yang sama): baris belakang 3,
 *  baris depan 4 (menumpang sedikit seperti kerumunan), pria & wanita, tanpa jas formal */
const RITEL: { x: number; y: number; pose: typeof ORANG_MUDA; cermin?: boolean; warna: string }[] = [
  { x: 360, y: 395, pose: ORANG_BARU[7], warna: B.blueWash }, { x: 470, y: 395, pose: ORANG_BARU[1], warna: B.turqWash },
  { x: 580, y: 395, pose: ORANG_BARU[9], warna: B.orangeWash }, { x: 305, y: 515, pose: ORANG_BARU[2], warna: B.turqWash },
  { x: 415, y: 515, pose: ORANG_BARU[8], warna: B.blueWash }, { x: 525, y: 515, pose: ORANG_BARU[3], warna: B.orangeWash },
  { x: 635, y: 515, pose: ORANG_BARU[5], warna: B.turqWash },
];
const ASING = { x: 1450, y: 450, d: 200 };
const Y_LABEL = 624;
const SisiPasar: React.FC<{ f: number }> = ({ f }) => {
  const kiri = R(f, t1.sisiKeluar - 30, t1.sisiKeluar + 30, 0, 1, io) * -760, kanan = R(f, t1.sisiKeluar - 24, t1.sisiKeluar + 36, 0, 1, io) * 640;
  const tarik = 1 - cin(f, t1.tarik); // panah ditarik kembali (trim) sebelum kedua sisi keluar
  if (f > t1.sisiKeluar + 40) return null;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d="M 700 450 L 812 450" g={cin(f, t1.panahRitel) * tarik} warna={B.blue} panah={{ x: 812, y: 450, sudut: 0 }} />
        <Penghubung d="M 1330 412 L 1108 412" g={cin(f, t1.masuk) * tarik} warna={ARAH.naik} panah={{ x: 1108, y: 412, sudut: Math.PI }} />
        <Penghubung d="M 1108 492 L 1330 492" g={cin(f, t1.keluarP) * tarik} warna={ARAH.turun} panah={{ x: 1330, y: 492, sudut: 0 }} />
      </svg>
      <Label x={1219} y={370} teks="Masuk" f={f} at={t1.masuk + 10} size={28} warna={HIJAU_TEKS} keluar={t1.tarik - 20} lebar={200} />
      <Label x={1219} y={536} teks="Keluar" f={f} at={t1.keluarP + 10} size={28} warna={MERAH_TEKS} keluar={t1.tarik - 20} lebar={200} />
      <div style={{ position: 'absolute', inset: 0, transform: kiri ? `translate3d(${kiri}px, 0, 0)` : undefined }}>
        {/* lingkaran latar pop, foto NAIK di dalam maskernya 20 f kemudian (Simon 29 Okt: foto orang jangan di-pop) */}
        {RITEL.map((o, j) => <KarakterLingkar key={j} pose={o.pose} x={o.x} y={o.y} D={104} s={popIn(f, t1.ritel + 6 * j)} warna={o.warna} cermin={o.cermin} naik={cin(f, t1.ritel + 6 * j + 20)} />)}
        <Label x={470} y={Y_LABEL} teks="Investor ritel" f={f} at={t1.labelRitel} size={30} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: kanan ? `translate3d(${kanan}px, 0, 0)` : undefined }}>
        <KacaBulat x={ASING.x} y={ASING.y} d={ASING.d} warna={B.orange} p={popIn(f, t1.asing)}><Icon name="danaAsing" size={ASING.d * 0.5} color={B.orange} /></KacaBulat>
        <Label x={ASING.x} y={Y_LABEL} teks="Dana asing" f={f} at={t1.labelAsing} size={30} />
      </div>
    </>);
};

/* chart sentimen (lokal panel 1200 × 580) — 30 Okt malam (Simon S04: "Ganti linechart ke candlestick"): CANDLE HARIAN RIIL ICBP 1 Des 2025 – 29 Jan 2026
 * (scripts/gen-lilin-s04.py): 36 candle tenang 7.900–8.450, lalu 27–29 Jan sentimen pasar berubah (minggu anjlok IHSG) → 8.400 → 7.225 = −14,0 %
 * (dulu garis ilustrasi "Harga 18%"). Riwayat tumbuh bersama panel (tidak pernah kosong), tiga candle jatuh tumbuh di "tajam", skala TERKUNCI.
 * Kondisi perusahaan = garis landai putus-putus (ilustrasi, tanpa angka — dulu "Perusahaan 2%" rekaan). */
const CH = { x0: 80, x1: 860, yA: 170, yB: 460, v0: 7050, v1: 8600, dasar: 490, xPil: 892, xJarak: 874 };
const SLOT_S = (CH.x1 - CH.x0) / ICBP_SENTIMEN.length; // 20 px
const yS = (v: number) => CH.yB - ((CH.yB - CH.yA) * (v - CH.v0)) / (CH.v1 - CH.v0);
const xS = (k: number) => CH.x0 + SLOT_S * (k + 0.5);
const N_TENANG = ICBP_SENTIMEN.length - 3;
const NILAI_S: [number, number] = [8250, 8200];
const RENDAH_S = ICBP_SENTIMEN[ICBP_SENTIMEN.length - 1].l;
const IsiSentimen: React.FC<{ f: number }> = ({ f }) => {
  const senti = cin(f, t1.berubah);
  const u = (k: number) => Math.max(0, Math.min(1, k < N_TENANG ? (f - (t1.riwayat - 30 + 1.6 * k)) / 12 : (f - (t1.tajam - 25 + 16 * (k - N_TENANG))) / 20));
  const gDasar = cin(f, t1.riwayat);
  const pRendah = popIn(f, t1.tajam + 30);
  return (
    <>
      <Chip x={40} y={64} jangkar="kiri" teks="Sentimen" ikon="emosi" warna={mixHex(ARAH.naik, ARAH.turun, senti)} p={popIn(f, t1.sentimen)} size={28} />
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`translate(${CH.x0} ${CH.yA - 20})`}><KisiLilin w={CH.x1 - CH.x0} h={CH.yB - CH.yA + 40} /></g>
        <line x1={CH.x0} x2={CH.x0 + (CH.x1 - CH.x0) * gDasar} y1={CH.dasar} y2={CH.dasar} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
        {ICBP_SENTIMEN.map((b, k) => {
          const uk = u(k);
          return uk <= 0 ? null : <BatangLilin key={b.t} c={tumbuh(b, uk)} x={xS(k)} slot={SLOT_S} Y={yS} sumbu={2} alfa={Math.min(1, uk * 3)} />;
        })}
        {pRendah > 0.001 ? <circle cx={xS(ICBP_SENTIMEN.length - 1)} cy={yS(RENDAH_S)} r={9 * skalaPop(pRendah)} fill={B.white} stroke={ARAH.turun} strokeWidth={4} /> : null}
        {/* kondisi perusahaan (nilai): nyaris rata — putus-putus 4 px, trim */}
        <Penghubung d={`M ${CH.x0} ${yS(NILAI_S[0]).toFixed(1)} L ${CH.x1} ${yS(NILAI_S[1]).toFixed(1)}`} g={cin(f, t1.nilai)} warna={B.turq} titik={false} tebal={4} />
        {/* jarak harga–nilai (di kanan candle terakhir, tidak menembus candle) */}
        <Penghubung d={`M ${CH.xJarak} ${(yS(NILAI_S[1]) + 14).toFixed(1)} L ${CH.xJarak} ${(yS(RENDAH_S) - 14).toFixed(1)}`} g={cin(f, t1.jarak)} warna={B.orange} titik={false} tebal={5} dash={false} />
      </svg>
      <div style={{ position: 'absolute', left: CH.x0, top: CH.dasar + 14 }}>
        {/* 2 Nov (Simon: "Contoh saham pada point 1 gunakan saham illustrasi saja (jangan diberikan disclaimer)"): kode ilustrasi, tanpa tanggal (dulu
            "ICBP · Des 2025 – Jan 2026"); bentuk candle tetap */}
        <WordText f={f} at={t1.riwayat + 20} style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: ABU_TEKS }}>ABCD</WordText></div>
      <PilNominal x={CH.xPil} y={yS(RENDAH_S)} teks={`Harga ${Math.abs(ICBP_SENTIMEN_TURUN).toFixed(0)}%`} arah={-1} p={popIn(f, t1.pilHarga)} size={26} jangkar="kiri" />
      <PilNominal x={CH.xPil} y={yS(NILAI_S[1])} teks="Kondisi perusahaan" arah={0} p={popIn(f, t1.pilNilai)} size={26} jangkar="kiri" />
      <Chip x={CH.xPil} y={(yS(NILAI_S[1]) + yS(RENDAH_S)) / 2} jangkar="kiri" teks="Jarak harga–nilai" ikon="alasan" warna={B.orange} p={popIn(f, t1.chipJarak)} size={26} />
    </>);
};

/** alasan 01 seluruhnya: lingkaran 01 → kartu Harga → kartu lebar Harga ≠ Bisnis → lingkaran Pasar → panel sentimen */
const Alasan01: React.FC<{ f: number }> = ({ f }) => {
  const c01 = geoBulat(xNomor(f, 0), NOMOR.y, NOMOR.d, B.blue);
  const sempit = geoPanel(B.blue, 600);
  const uMekar = cin(f, tA.morf);
  const uLebar = cin(f, t1.lebar);
  const lebar: GeoKartu = { ...sempit, w: lerp(600, PANEL.w, uLebar) };
  const uKerut = cin(f, t1.kerut);
  const cPasar = geoBulat(PASAR.x, PASAR.y, PASAR.d, B.blue);
  const uPanel = cin(f, t1.mekar);
  const uKe02 = cin(f, S04_KE02);
  const kartu = <IsiHargaBisnis f={f} w={lebar.w} />;
  const pFotoPasar = popIn(f, t1.fotoPasar) * linOut(f, t1.fotoKeluar);
  const isiPasar = pFotoPasar > 0.001 ? <Foto k="saham" x={PASAR.d / 2} y={PASAR.d / 2} w={PASAR.d * 0.78} p={pFotoPasar} /> : null;
  if (f < tA.nomor[0] - 30) return null;
  return (
    <>
      {/* lingkaran 01 (pop di "tiga alasan") */}
      {uMekar <= 0 ? <KacaBulat x={c01.x} y={c01.y} d={NOMOR.d} warna={B.blue} p={popIn(f, tA.nomor[0])}><AngkaBulat n={1} d={NOMOR.d} warna={B.blue} /></KacaBulat> : null}
      {/* lingkaran 01 MEMEKAR jadi kartu Harga (tengah), lalu kartu MELEBAR memberi ruang untuk Bisnis */}
      {uMekar > 0 && uKerut <= 0 ? (
        <KacaMorf a={c01} b={lebar} t={uMekar} tepi={1} isiA={<div style={{ width: NOMOR.d, height: NOMOR.d, display: 'grid', placeItems: 'center' }}><AngkaBulat n={1} d={NOMOR.d} warna={B.blue} /></div>}
          isiB={<div style={{ position: 'absolute', inset: 0 }}>{kartu}</div>} />) : null}
      {/* kartu MENGERUT jadi lingkaran Pasar Indonesia */}
      {uKerut > 0 && uPanel <= 0 ? (
        <KacaMorf a={lebar} b={cPasar} t={uKerut} tepiB={1} isiA={<div style={{ position: 'absolute', inset: 0 }}>{kartu}</div>}
          isiB={<div style={{ position: 'absolute', inset: 0 }}>{isiPasar}</div>} />) : null}
      {uKerut > 0 ? <Label x={PASAR.x} y={Y_LABEL} teks="Pasar Indonesia" f={f} at={t1.labelPasar} size={30} keluar={t1.tarik} /> : null}
      {uKerut > 0 ? <SisiPasar f={f} /> : null}
      {/* lingkaran Pasar MEMEKAR jadi panel sentimen */}
      {uPanel > 0 && uKe02 <= 0 ? (
        <KacaMorf a={cPasar} b={geoPanel(B.blue)} t={uPanel} tepi={1} isiA={<div style={{ position: 'absolute', inset: 0 }}>{isiPasar}</div>}
          isiB={<div style={{ position: 'absolute', inset: 0 }}><IsiSentimen f={f} /></div>} />) : null}
      {/* panel sentimen MENGERUT jadi lingkaran 02 di tengah (2 Nov — dulu tiga cakram menutup layar) */}
      {uKe02 > 0 ? (
        <KacaMorf a={geoPanel(B.blue)} b={geoBulat(GEDUNG.x, GEDUNG.y, NOMOR.d, B.turq)} t={uKe02} tepiB={1}
          isiA={<div style={{ position: 'absolute', inset: 0 }}><IsiSentimen f={f} /></div>}
          isiB={<div style={{ width: NOMOR.d, height: NOMOR.d, display: 'grid', placeItems: 'center' }}><AngkaBulat n={2} d={NOMOR.d} warna={B.turq} /></div>} />) : null}
    </>);
};

/* ═══════════════════════ 02 · BISNIS BISA DIPELAJARI ═══════════════════════ */
const t2 = {
  nomor: T.kedua - 6, besar: T.bisnis - 5, foto: T.bisnis + 25, garis: T.jangka + 10, chipPanjang: T.panjang + 15,
  fotoTurun: T.perbankan - 60, pindah: T.sektor, lebarGaris: T.sektor, // foto gedung selesai turun tepat saat ikon Perbankan mulai pop (dulu lingkaran kosong ±1 dtk)
  sektor: [T.perbankan, T.consumer + 6, T.telekomunikasi + 6, T.lainnya + 6], pita: T.puluhan + 10,
  // label & garis waktu keluar BERSAMA empat lingkaran menyatu jadi panel (Simon: morf bersamaan dengan visual di sebelahnya — dulu ±60–90 f lebih dulu)
  labelKeluar: T.artinya + 40, tarikGaris: T.artinya + 60, satu: T.artinya + 60,
  batang: T.artinya + 70, pendapatan: T.pendapatan + 10, laba: T.laba + 10, dividen: T.dividen + 10, siklus: T.siklus + 15,
};
const SEKTOR: { ikon: KunciIkon; teks: string; warna: string }[] = [
  { ikon: 'sektorBank', teks: 'Perbankan', warna: B.blue }, { ikon: 'konsumsi', teks: 'Consumer', warna: B.turq },
  { ikon: 'telekomunikasi', teks: 'Telekomunikasi', warna: B.orange }, { ikon: 'industri', teks: 'Sektor lainnya', warna: B.blueLite },
];
const BARIS = { y: 400, d: 180, x: [465, 795, 1125, 1455] };
/** 2 Nov (Simon: "4 icon di point 2 itu seharusnya muncul satu persatu, dari tengah frame, tiap kali ikon muncul bergeser ke kiri sampai ke posisi
 *  sekarang"): n ikon tampak (pecahan, 60 f inOut cubic di tiap pop) → baris selalu berpusat di 960; posisi akhir n = 4 = BARIS.x */
const nSektor = (f: number) => 1 + cin(f, t2.sektor[1] - 15) + cin(f, t2.sektor[2] - 15) + cin(f, t2.sektor[3] - 15); // geser 15 f sebelum pop
const xSektor = (f: number, k: number) => 960 + (k - (nSektor(f) - 1) / 2) * 330;
const GEDUNG = { x: 960, y: 480, d: 320 };
const Y_GARIS = 690;
/* sejarah 20 tahun (ILUSTRASI): pendapatan tumbuh + siklus; laba ±30 % pendapatan dengan siklus lebih tajam; dividen ±40 % laba */
const TAHUN = 20;
const PENDAPATAN = Array.from({ length: TAHUN }, (_, j) => 120 + j * 9.5 + 22 * Math.sin(j * 0.62));
const LABA = PENDAPATAN.map((v, j) => v * (0.3 + 0.1 * Math.sin(j * 0.62 - 0.4)));
const DIVIDEN = LABA.map((v) => v * 0.42);
const SJ = { x0: 80, x1: 860, dasar: 480, skala: 1.4, xLabel: 900 };
const xBar = (j: number) => SJ.x0 + ((SJ.x1 - SJ.x0) * (j + 0.5)) / TAHUN;
const IsiSejarah: React.FC<{ f: number }> = ({ f }) => {
  const kurva = LABA.map((v, j) => [xBar(j), SJ.dasar - v * SJ.skala] as const);
  const dKurva = kurva.map(([x, y], i) => {
    if (!i) return `M ${x} ${y}`;
    const [px, py] = kurva[i - 1], mx = (px + x) / 2;
    return `C ${mx} ${py}, ${mx} ${y}, ${x} ${y}`;
  }).join(' ');
  // 30 Okt malam (Simon S04: "Perbaiki spacing legend graphic cardnya"): legenda = SATU KOLOM berjarak seragam 56 px, berpusat tegak pada tinggi batang
  // (dulu tiap label di ketinggian ujung datanya → Pendapatan jauh di atas, Laba–Dividen–Siklus berimpit)
  const Y_LEG = [216, 272, 328, 384];
  const lbl = (at: number, y: number, teks: string, warna: string) => (
    <div style={{ position: 'absolute', left: SJ.xLabel, top: y - 20, display: 'flex', alignItems: 'center', gap: 12 }}>
      <i style={{ width: 20, height: 20, borderRadius: 6, background: warna, display: 'inline-block', transform: `scale(${skalaPop(popIn(f, at))})` }} />
      <WordText f={f} at={at + 10} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>{teks}</WordText>
    </div>);
  const gSiklus = cin(f, t2.siklus);
  return (
    <>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={SJ.x0} x2={SJ.x1} y1={SJ.dasar} y2={SJ.dasar} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
        {PENDAPATAN.map((v, j) => {
          const g = cin(f, t2.batang + 2 * j); // batang pendapatan tumbuh BERSAMA panel menyatu — panel tidak pernah kosong (bug 27 Okt "chart hampir kosong")
          return g <= 0 ? null : <rect key={`p${j}`} x={xBar(j) - 13} y={SJ.dasar - v * SJ.skala * g} width={26} height={v * SJ.skala * g} rx={5} fill={B.blueLite} />;
        })}
        {LABA.map((v, j) => {
          const g = cin(f, t2.laba + 2 * j);
          return g <= 0 ? null : <rect key={`l${j}`} x={xBar(j) - 13} y={SJ.dasar - v * SJ.skala * g} width={26} height={v * SJ.skala * g} rx={5} fill={B.turq} />;
        })}
        {DIVIDEN.map((v, j) => {
          const g = cin(f, t2.dividen + 2 * j);
          return g <= 0 ? null : <rect key={`d${j}`} x={xBar(j) - 6} y={SJ.dasar - v * SJ.skala * g} width={12} height={v * SJ.skala * g} rx={4} fill={B.orange} />;
        })}
        {gSiklus > 0 ? <path d={dKurva} fill="none" stroke={B.night} strokeWidth={4} strokeDasharray="4 9" strokeLinecap="round" pathLength={1000}
          style={{ strokeDashoffset: 0 }} mask="url(#s04-trim)" /> : null}
        <defs>
          <mask id="s04-trim" maskUnits="userSpaceOnUse" x={0} y={0} width={PANEL.w} height={PANEL.h}>
            <rect x={0} y={0} width={SJ.x0 + (SJ.x1 - SJ.x0) * gSiklus + 10} height={PANEL.h} fill="#fff" />
          </mask>
        </defs>
      </svg>
      <div style={{ position: 'absolute', left: SJ.x0, width: SJ.x1 - SJ.x0, top: SJ.dasar + 16, textAlign: 'center' }}>
        <WordText f={f} at={t2.batang + 30} style={{ fontFamily: F, fontSize: 24, fontWeight: 700, color: ABU_TEKS }}>20 tahun</WordText>
      </div>
      {lbl(t2.pendapatan, Y_LEG[0], 'Pendapatan', B.blueLite)}
      {lbl(t2.laba, Y_LEG[1], 'Laba', B.turq)}
      {lbl(t2.dividen, Y_LEG[2], 'Dividen', B.orange)}
      {/* siklus bisnis: legenda garis putus-putus, baris keempat */}
      <div style={{ position: 'absolute', left: SJ.xLabel, top: Y_LEG[3] - 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg width={20} height={20} style={{ transform: `scale(${skalaPop(popIn(f, t2.siklus))})` }}><line x1={1} x2={19} y1={10} y2={10} stroke={B.night} strokeWidth={4} strokeDasharray="4 4" /></svg>
        <WordText f={f} at={t2.siklus + 10} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>Siklus bisnis</WordText>
      </div>
    </>);
};
const Alasan02: React.FC<{ f: number }> = ({ f }) => {
  const uBesar = cin(f, t2.besar), uPindah = cin(f, t2.pindah);
  const d0 = lerp(NOMOR.d, GEDUNG.d, uBesar);
  const xL = lerp(GEDUNG.x, xSektor(f, 0), uPindah), yL = lerp(GEDUNG.y, BARIS.y, uPindah), dL = lerp(d0, BARIS.d, uPindah);
  const uKe03 = cin(f, S04_KE03);
  const naikFoto = cin(f, t2.foto) * (1 - cin(f, t2.fotoTurun));
  const uSatu = cin(f, t2.satu);
  const g0 = cin(f, t2.garis) * (1 - cin(f, t2.tarikGaris));
  const lebarG = cin(f, t2.lebarGaris);
  const xa = lerp(560, 375, lebarG), xb = lerp(1360, 1545, lebarG);
  const kiriG = lerp(960, xa, g0), kananG = lerp(960, xb, g0);
  const ikonSektor = (k: number, d: number) => <Icon name={SEKTOR[k].ikon} size={d * 0.5} color={SEKTOR[k].warna} />;
  // GARIS WAKTU (30 Okt malam, Simon S04: "Untuk menggambarkan puluhan tahun dan jangka panjang gunakan timeline saja" — dulu chip "Jangka panjang" /
  // "Puluhan tahun" di atas garis putus-putus berpanah): garis tumbuh dari tengah di "jangka panjang", empat tahun 1996 · 2006 · 2016 · 2026 pop
  // berurutan; di "puluhan tahun" pita turkis menyapu seluruh garis (tiga dasawarsa). Garis ikut melebar saat barisan sektor terbentuk.
  const xTik = (k: number) => lerp(xa, xb, k / 3);
  const pita = cin(f, t2.pita) * (1 - cin(f, t2.tarikGaris));
  const pTahun = (k: number) => popIn(f, t2.garis + 20 + 10 * k) * linOut(f, t2.tarikGaris - 10);
  return (
    <>
      {g0 > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {pita > 0.001 ? <rect x={xa - 24} y={Y_GARIS - 22} width={(xb - xa + 48) * pita} height={44} rx={22} fill={rgba(B.turq, 0.24)} /> : null}
          <line x1={kiriG} x2={kananG} y1={Y_GARIS} y2={Y_GARIS} stroke={B.night} strokeWidth={5} strokeLinecap="round" />
          {[0, 1, 2, 3].map((k) => {
            const q = pTahun(k);
            return q <= 0.001 ? null : <circle key={k} cx={xTik(k)} cy={Y_GARIS} r={11 * skalaPop(q)} fill={k === 3 ? B.night : B.white} stroke={B.night} strokeWidth={5} />;
          })}
        </svg>) : null}
      {['1996', '2006', '2016', '2026'].map((th, k) => g0 <= 0.001 ? null : (
        <div key={th} style={{ position: 'absolute', left: 0, top: 0, width: 160, textAlign: 'center', transform: geser(xTik(k) - 80, Y_GARIS + 24) }}>
          <WordText f={f} at={t2.garis + 30 + 10 * k} until={t2.tarikGaris - 10} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: ABU_TEKS }}>{th}</WordText>
        </div>))}
      {/* lingkaran 02 → gedung → Perbankan (bentuk DIBAWA); sektor lain pop di katanya */}
      {uSatu <= 0 ? (
        <>
          <KacaBulat x={xL} y={yL} d={dL} warna={mixHex(B.turq, B.blue, uPindah)} p={0.99996} /* lingkaran 02 = hasil morf panel sentimen (Alasan01) */>
            {uBesar < 1 ? <AngkaBulat n={2} d={d0} warna={B.turq} alfa={1 - uBesar} /> : null}
            {f >= t2.sektor[0] - 30 ? <div style={{ transform: `scale(${skalaPop(popIn(f, t2.sektor[0]))})` }}>{ikonSektor(0, BARIS.d)}</div> : null}
          </KacaBulat>
          {naikFoto > 0.001 ? <FotoLingkar pose={POSE_BENDA.gedung} x={xL} y={yL} D={dL} s={1} warna={B.turq} naik={naikFoto} latar="transparent" tanpaLatar /> : null}
          {[1, 2, 3].map((k) => <KacaBulat key={k} x={xSektor(f, k)} y={BARIS.y} d={BARIS.d} warna={SEKTOR[k].warna} p={popIn(f, t2.sektor[k])}>{ikonSektor(k, BARIS.d)}</KacaBulat>)}
        </>) : null}
      {SEKTOR.map((s, k) => <Label key={k} x={k ? xSektor(f, k) : xL} y={BARIS.y + BARIS.d / 2 + 44} teks={s.teks} f={f} at={t2.sektor[k] + 10} size={30} lebar={300} keluar={t2.labelKeluar} />)}
      {/* empat lingkaran MENYATU jadi panel sejarah */}
      {uSatu > 0 && uKe03 <= 0 ? [1, 2, 3, 0].map((k) => (
        <KacaMorf key={k} a={geoBulat(BARIS.x[k], BARIS.y, BARIS.d, SEKTOR[k].warna)} b={geoPanel(B.turq)} t={uSatu} tepi={1} peran={k ? 'gabung' : undefined}
          isiA={<div style={{ width: BARIS.d, height: BARIS.d, display: 'grid', placeItems: 'center' }}>{ikonSektor(k, BARIS.d)}</div>}
          isiB={k === 0 ? <div style={{ position: 'absolute', inset: 0 }}><IsiSejarah f={f} /></div> : undefined} />)) : null}
      {/* panel sejarah MENGERUT jadi lingkaran 03 di tengah (2 Nov — dulu bilah naik menutup layar) */}
      {uKe03 > 0 ? (
        <KacaMorf a={geoPanel(B.turq)} b={geoBulat(960, POS3.y, NOMOR.d, B.orange)} t={uKe03} tepiB={1}
          isiA={<div style={{ position: 'absolute', inset: 0 }}><IsiSejarah f={f} /></div>}
          isiB={<div style={{ width: NOMOR.d, height: NOMOR.d, display: 'grid', placeItems: 'center' }}><AngkaBulat n={3} d={NOMOR.d} warna={B.orange} /></div>} />) : null}
    </>);
};

/* ═══════════════════════ 03 · TAK HARUS TERCEPAT ═══════════════════════ */
const t3 = {
  nomor: S04_KE03, jam: T.orang + 10, labelJam: T.tercepat, silangJam: T.tercepat + 45, geser: T.layar - 20, ponsel: T.layar + 10, labelPonsel: T.layar + 20,
  silangPonsel: T.hari + 40, gabung: T.kita + 10, naikKamu: T.kita + 50, kerja: T.bekerja + 10, aktivitas: T.aktivitas + 10,
  sisiKeluar: T.kita2 - 6, kamuMenepi: T.kita2 + 30, kalender: T.menyediakan + 15, akhirPekan: T.waktu + 15, pahami: T.memahami + 20, perbarui: T.memperbarui + 20,
};
const POS3 = { y: 450, d: 220 };
/** 2 Nov (Simon: "icon bekerja, dan aktivitasnya seharusnya besarnya sama dengan orang dan center ketengah frame"): ketiga lingkaran D 300 di SATU baris
 *  y 520 (+ kamera 40 = 560 layar → kepala yang menyembul s.d. label berpusat ±540), simetris 540 · 960 · 1380 (dulu 230 px di y 550, kamu y 530) */
const KAMU = { y: 520, D: 300, xKalender: 470 };
const SAMPING = { y: 520, d: 300, x: [540, 1380] };
// G2 spacing (audit TEKS-MEPET f17100–17310): "Perbarui analisis" dulu 7 px dari tepi kolom → kartu 920 → 950, celah kolom 12 → 10, teks 24 → 21 px (±16 px tiap sisi)
const KAL = { x: 1160, y: 520, w: 950, h: 380 };
const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const Kalender: React.FC<{ f: number; p: number; keluar: number }> = ({ f, p, keluar }) => {
  const tint = cin(f, t3.akhirPekan);
  return (
    <Kaca x={KAL.x} y={KAL.y} w={KAL.w} h={KAL.h} p={p} keluar={keluar} warna={B.orange} tab="atas">
      <div style={{ position: 'absolute', left: 30, right: 30, top: 44, bottom: 30, display: 'flex', gap: 10 }}>
        {HARI.map((h, j) => {
          const libur = j >= 5;
          const w = j === 5 ? B.turq : B.orange;
          const isi = j === 5 ? popIn(f, t3.pahami) : j === 6 ? popIn(f, t3.perbarui) : 0;
          return (
            <div key={h} style={{ flex: 1, borderRadius: 18, background: libur ? mixHex('#F3F3F6', mixHex(B.white, w, 0.16), tint) : '#F3F3F6',
              boxShadow: libur && tint > 0.001 ? `inset 0 0 0 ${3 * tint}px ${w}` : undefined, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night }}>{h}</div>
              {!libur ? (
                <div style={{ position: 'absolute', left: 0, right: 0, top: 110, display: 'grid', placeItems: 'center' }}><Icon name="bekerja" size={46} color={B.grayLite} /></div>
              ) : isi > 0.001 ? (
                <div style={{ position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ transform: `scale(${skalaPop(isi)})` }}><Icon name={j === 5 ? 'laporanKeuangan' : 'rencana'} size={52} color={w} /></div>
                  <div style={{ width: 116, textAlign: 'center', lineHeight: 1.15 }}>
                    <WordText f={f} at={j === 5 ? t3.pahami + 10 : t3.perbarui + 10} rataBaris style={{ fontFamily: F, fontSize: 21, fontWeight: 800, color: B.night }}>
                      {j === 5 ? 'Pahami bisnis' : 'Perbarui analisis'}</WordText>
                  </div>
                </div>) : null}
            </div>);
        })}
      </div>
    </Kaca>);
};
const Silang: React.FC<{ x: number; y: number; d: number; p: number }> = ({ x, y, d, p }) => <Lencana x={x} y={y} d={d} p={p} warna={ARAH.turun} teks="✕" besar={70} />;
const Alasan03: React.FC<{ f: number; keluarSemua: number }> = ({ f, keluarSemua }) => {
  if (f < S04_KE03 + 30) return null; // lingkaran 03 = hasil morf panel sejarah (Alasan02)
  const uJam = cin(f, t3.jam);
  const dJam = lerp(160, POS3.d, uJam);
  const xJam = geserKe(f, t3.geser, 960, 720);
  // KEDUA LINGKARAN MENYATU jadi lingkaran "kamu" (30 Okt malam, Simon S04: "Transisi ke orang gabungkan kedua lingkaran itu, fade out icon didalamnya, dan
  // swipe keatas gambar orangnya" — dulu keduanya keluar sendiri, lalu lingkaran baru pop): stopwatch & ponsel bergerak ke (960, 530) dan membesar ke
  // D 300 dalam 60 f yang sama, warna cincin → turkis, ikon di dalamnya MEMUDAR, tanda ✕ & label keluar lebih dulu; lingkaran ponsel memudar saat
  // menumpuk (pola KacaMorf 'gabung'); lingkaran stopwatch MENJADI lingkaran kamu, lalu foto NAIK di maskernya
  const uG = cin(f, t3.gabung);
  // tengah dulu, lalu memberi ruang (2 Nov): kamu + "Tetap bekerja" berpasangan simetris (750 · 1170), lalu bertiga 540 · 960 · 1380 saat "Aktivitas" pop
  const uK = cin(f, t3.kerja - 15), uAkt = cin(f, t3.aktivitas - 15); // geser 15 f sebelum pop
  const xKamu = geserKe(f, t3.kamuMenepi, 960 + 210 * (uK - uAkt), KAMU.xKalender);
  const xKerja = lerp(750, SAMPING.x[0], uAkt);
  const xA = uG < 1 ? lerp(xJam, 960, uG) : xKamu, xB = lerp(1200, 960, uG), yG = lerp(POS3.y, KAMU.y, uG);
  const dA = lerp(dJam, KAMU.D, uG), dB = lerp(POS3.d, KAMU.D, uG);
  const keluarTanda = linOut(f, t3.gabung - 25);
  const pSamping = (k: number) => popIn(f, k ? t3.aktivitas : t3.kerja) * linOut(f, t3.sisiKeluar + 10 * k);
  const ikonAlfa = (a: number, isi: React.ReactNode) => a <= 0.001 ? null : <div style={{ opacity: a < 0.999 ? a : undefined }}>{isi}</div>;
  return (
    <>
      {/* lingkaran ponsel (menumpuk ke lingkaran kamu, memudar) */}
      {uG < 1 ? (
        <KacaBulat x={xB} y={yG} d={dB} warna={mixHex(B.blue, B.turq, uG)} p={popIn(f, t3.ponsel)} alfa={1 - uG}>
          {ikonAlfa(1 - uG, <Icon name="ponselGrafik" size={POS3.d * 0.5} color={B.blue} />)}
        </KacaBulat>) : null}
      {/* lingkaran 03 → stopwatch "Tercepat" → lingkaran kamu */}
      <KacaBulat x={xA} y={yG} d={dA} warna={mixHex(B.orange, B.turq, uG)} p={keluarSemua}>
        {uJam < 1 ? <AngkaBulat n={3} d={dJam} warna={B.orange} alfa={1 - uJam} /> : null}
        {uJam > 0 ? ikonAlfa(1 - uG, <div style={{ transform: `scale(${skalaPop(popIn(f, t3.jam + 20))})` }}><Icon name="cepat" size={POS3.d * 0.5} color={B.orange} /></div>) : null}
      </KacaBulat>
      <Label x={xJam} y={POS3.y + POS3.d / 2 + 44} teks="Tercepat" f={f} at={t3.labelJam} size={30} keluar={t3.gabung - 40} />
      <Silang x={xJam} y={POS3.y} d={POS3.d} p={popIn(f, t3.silangJam) * keluarTanda} />
      <Label x={1200} y={POS3.y + POS3.d / 2 + 44} teks="Layar sepanjang hari" f={f} at={t3.labelPonsel} size={30} keluar={t3.gabung - 40} lebar={360} />
      <Silang x={1200} y={POS3.y} d={POS3.d} p={popIn(f, t3.silangPonsel) * keluarTanda} />
      {/* kamu: foto NAIK di masker lingkaran DALAM (cincin kaca 3 px — Simon: "Masking seharusnya ada dilingkarkan warna muda, bukan dari outline warna gelap"),
          pita kepala saja yang menyembul (ORANG_MUDA.kepala) */}
      {uG >= 1 ? <FotoLingkar pose={ORANG_MUDA} x={xKamu} y={KAMU.y} D={KAMU.D - 6} s={keluarSemua} warna={B.turq} naik={cin(f, t3.naikKamu)} tanpaLatar /> : null}
      {/* tetap bekerja · aktivitas sehari-hari = ilustrasi kiriman Simon (Simon: "Ganti icon aktivitas dan bekerja dengan gambar yang aku kirimkan"),
          naik di masker lingkaran penuh */}
      <FotoLingkar pose={POSE_BENDA.bekerja} x={xKerja} y={SAMPING.y} D={SAMPING.d} s={pSamping(0)} warna={B.blue} naik={cin(f, t3.kerja + 20)} latar={B.blueWash} bulat />
      <Label x={xKerja} y={SAMPING.y + SAMPING.d / 2 + 44} teks="Tetap bekerja" f={f} at={t3.kerja + 10} size={30} keluar={t3.sisiKeluar - 20} />
      <FotoLingkar pose={POSE_BENDA.aktivitas} x={SAMPING.x[1]} y={SAMPING.y} D={SAMPING.d} s={pSamping(1)} warna={B.orange} naik={cin(f, t3.aktivitas + 20)} latar={B.orangeWash} bulat />
      <Label x={SAMPING.x[1]} y={SAMPING.y + SAMPING.d / 2 + 44} teks="Aktivitas sehari-hari" f={f} at={t3.aktivitas + 10} size={30} keluar={t3.sisiKeluar - 10} lebar={360} />
      <Kalender f={f} p={popIn(f, t3.kalender)} keluar={keluarSemua} />
    </>);
};

/* ═══════════════════════ SCENE ═══════════════════════ */
export const Scene04: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL - 60 || f > AKHIR + 60) return null;
  // 2 Nov: tiap alasan diserahkan lewat MORF panel → lingkaran nomor berikutnya (tanpa cakram/bilah); latar ber-tint (plan.ts)
  const isi = (
    <>
      {f < tA.morf + 40 ? <BagianA f={f} /> : null}
      {f < S04_KE02 + 30 ? <Alasan01 f={f} /> : null}
      {f >= S04_KE02 + 30 && f < S04_KE03 + 30 ? <Alasan02 f={f} /> : null}
      <Alasan03 f={f} keluarSemua={1} />
    </>);
  // S04 → S05: seluruh isi mengecil ke poros timbangan S05 (masker lingkaran, rona berganti seketika — plan.ts PAKAI_MASKER)
  // isi di lapisan KOMPOSIT sejak awal (pindai f16718): tanpa ini isi baru dikomposit saat masker mulai → raster ulang satu frame
  return <MaskerKeluar f={f} mulai={AKHIR - 20} ke={PIVOT_S05} warna={B.blue} tint>
    <div style={{ position: 'absolute', inset: 0, transform: 'translate3d(0, 0, 0) rotate(0.001deg)' }}>{isi}</div></MaskerKeluar>;
};
export const S04_T = T;
