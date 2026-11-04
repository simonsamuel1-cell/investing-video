import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { kamera, keLayar } from '../kamera';
import type { KunciIkon } from '../ikon';
import { ARAH, B, CORET, F, R, io, mixHex, rgba } from '../theme';
import { Icon, WordText, lerp } from '../parts/kit';
import { popIn } from '../parts/pop';
import { rpPenuh } from '../parts/nominal';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { Judul } from '../parts/judul';
import { HALUS3D, INVESTOR_JAS, INVESTOR_NAVY, KARYAWAN, Kaca, KarakterLingkar, ORANG_MUDA, geser, type PoseKarakter } from '../v3/kaca';
import { Kalender, type Halaman } from '../v3/nyata';

/**
 * SCENE 03 — EMAS, versi GAYA VIDEO 3 (Simon 16 Okt: "layout visual, animasi, style … seperti video 3", "asset realistis", "orang berbeda",
 * "ide visualnya kurang bisa dipahami orang awam", "sangat statis"). Ide = 04_Asset/Evaluasi-Ide-Baru-16okt.md § S03.
 * Satu pesan per adegan, benda & kejadian nyata, kartu kaca Video 3 (v3/kaca), tanpa kamera; hanya perpindahan yang bermakna:
 *   1. peta bab → simpul Emas jadi cakram foto emas di KARTU "Hari ini" (1 gram)
 *   2. "sepuluh tahun lagi" → kalender tahun bergulir 2026 → 2036, kartu "10 tahun lagi" → "tetap satu gram" = tanda sama dengan
 *   3. "tidak membayar bunga / sewa / laba" → kartu 10-tahun-lagi MENYATU jadi kartu "Pemasukan dari emas": tiga baris berfoto, tiap baris Rp0
 *   4. "perubahan harga" → kartu yang sama jadi kartu HARGA: garis harga dari Beli ke Jual, selisihnya = return
 *   5. "supply dan demand" → kartu emas jadi PASOKAN (tumpukan emas), kartu PERMINTAAN berisi pembeli (orang-orang BERBEDA)
 *   6. permintaan naik → pembeli bertambah, harga naik (hijau) · permintaan melemah → pembeli pergi, harga turun (merah)
 *   7. "selama kita memegang emas" → tiga kartu menyatu jadi kartu "Emas milikmu" di tengah; baris Cash flow Rp0 dicoret (sosok "Kita" dihapus, Simon 16 Okt)
 * Keluar = masker lingkaran ke simpul bab 02 di peta pembuka Properti (pola semua scene instrumen), 50f mulai BATAS.s5.
 * Animasi keluar Scene 02 milik Scene 02 (mendarat di simpul bab 01 peta ini pada BATAS.s3 + 50).
 */
export const S3 = BATAS.s3;
export const IDE_S03_AWAL = S3;

const [emas, , hari, , gram, sepuluh, tahun, lagi, fisik, tetap, satu, , emas2, bunga, sewa, bisnis, laba, sumber, utamanya, datang,
  perubahan, harga, supply, demand, , naik, , , harganya, naik2, melemah, harganya2, turun, jadi2, memegang, tidak3, menghasilkan3,
  cash] = urut(['emas', 'kalau', 'hari', 'membeli', 'gram', 'sepuluh', 'tahun', 'lagi', 'fisik', 'tetap', 'satu', 'gram', 'emas', 'bunga',
  'sewa', 'bisnis', 'laba', 'sumber', 'utamanya', 'datang', 'perubahan', 'harga', 'supply', 'demand', 'permintaan', 'naik', 'kuat',
  'pasokan', 'harganya', 'naik', 'melemah', 'harganya', 'turun', 'jadi', 'memegang', 'tidak', 'menghasilkan', 'cash'], S3);

/* ── tata letak: semua kartu tinggi 500 berpusat di Y (antara judul ±118 dan subtitle 960) ── */
const Y = 548, KH = 500;
const CAKRAM = { dy: -35, d: 210 }; // cakram foto emas di kartu emas (relatif pusat kartu)
const W_EMAS = 400, W_PEMASUKAN = 640, W_HARGA_KECIL = 560, W_AKHIR = 440;
const PETA_SELESAI = hari - 10; // simpul bab Emas tiba di cakram kartu "Hari ini"

/* ── PERPINDAHAN HANYA YANG BERMAKNA (Simon 16 Okt: "hapus animasi yang tidak diperlukan, geser kanan kiri yang tidak ada artinya") —
 *  dulu kartu emas bergeser 5× (960→815→585→610→430→…) demi pusat; kini 3 perpindahan yang bercerita, masing-masing 60f inOut cubic:
 *  (1) kartu emas memberi ruang untuk "10 tahun lagi" · (2) pasokan & permintaan mengapit harga · (3) semua menyatu jadi satu kartu ── */
type Rampa = { tS: number; tE: number; tD: number; tJ: number };
const rampa = (f: number): Rampa => ({
  tS: R(f, sepuluh - 60, sepuluh, 0, 1, io), // (1) kartu emas ke kiri DULU; kalender & kartu "10 tahun lagi" muncul sesudahnya di tempatnya
  tE: R(f, emas2 - 10, emas2 + 50, 0, 1, io), // kartu "10 tahun lagi" melebar jadi kartu pemasukan (kartu emas tetap)
  tD: R(f, demand - 50, demand + 10, 0, 1, io), // (2) pasokan · harga · permintaan
  tJ: R(f, jadi2, jadi2 + 60, 0, 1, io), // (3) tiga kartu menyatu jadi kartu "Emas milikmu" di tengah
});
const X_AKHIR = 960;
const xEmas = (r: Rampa) => lerp(lerp(lerp(960, 585, r.tS), 430, r.tD), X_AKHIR, r.tJ);
const xKanan = (r: Rampa) => lerp(lerp(lerp(1335, 1165, r.tE), 960, r.tD), X_AKHIR, r.tJ);
const wKanan = (r: Rampa) => lerp(lerp(lerp(W_EMAS, W_PEMASUKAN, r.tE), W_HARGA_KECIL, r.tD), W_AKHIR, r.tJ);

/* ── harga emas per gram: CONTOH (bukan data pasar; tanpa tanggal historis) — Beli → Jual (+40 %), lalu naik (permintaan kuat) dan turun ── */
const HARGA_BELI = 1_000_000, HARGA_JUAL = 1_400_000, HARGA_NAIK = 1_550_000, HARGA_TURUN = 1_300_000;
const N_TITIK = 61;
const ss = (t: number) => t * t * (3 - 2 * t);
/** titik ke-i (0..60): 0–36 Beli→Jual, 36–48 naik, 48–60 turun; riak kecil diredam di ujung tiap ruas (ujung = nilai persis) */
const HARGA = Array.from({ length: N_TITIK }, (_, i) => {
  const ruas = (a: number, b: number, va: number, vb: number, amp: number, fase: number) => {
    const t = (i - a) / (b - a);
    return va + (vb - va) * ss(t) + amp * Math.sin(t * Math.PI * 3.2 + fase) * Math.sin(Math.PI * t);
  };
  if (i <= 36) return ruas(0, 36, HARGA_BELI, HARGA_JUAL, 45_000, 0.4);
  if (i <= 48) return ruas(36, 48, HARGA_JUAL, HARGA_NAIK, 14_000, 1.1);
  return ruas(48, 60, HARGA_NAIK, HARGA_TURUN, 16_000, 2.3);
});
const I_JUAL = 36, I_NAIK = 48;
const DOM: [number, number] = [880_000, 1_640_000];
/** indeks ujung garis yang sudah tergambar (pecahan) */
// garis mulai tergambar begitu kartu harga terbuka (sumber + 10) — kisi kosong menunggu garis = slot kosong (f5860 sebelum ini)
const ujungHarga = (f: number) =>
  I_JUAL * R(f, sumber + 10, perubahan + 40, 0, 1, io) + (I_NAIK - I_JUAL) * R(f, harganya - 20, naik2 + 30, 0, 1, io)
  + (N_TITIK - 1 - I_NAIK) * R(f, harganya2 - 20, turun + 30, 0, 1, io);
const hargaDi = (u: number) => {
  const k = Math.min(N_TITIK - 2, Math.floor(u));
  return lerp(HARGA[k], HARGA[k + 1], u - k);
};

/* ── pembeli emas = orang-orang BERBEDA (Simon: "jika script menuntut perubahan orang, gunakan orang yang berbeda"); murid = "kita" ── */
const PEMBELI: { pose: PoseKarakter; datang: number; pergi?: number }[] = [
  { pose: INVESTOR_NAVY, datang: demand },
  { pose: INVESTOR_JAS, datang: demand + 14, pergi: melemah + 2 },
  { pose: ORANG_MUDA, datang: naik - 8, pergi: melemah - 12 },
  { pose: KARYAWAN, datang: naik + 12, pergi: melemah - 26 },
];
/** 2 × 2 di kartu permintaan: lingkaran Ø112, puncak kepala 1,72 r di atas pusat → baris atas (pusat y 200) kepalanya 104 > kepala kartu 92,
 *  baris bawah (356) kepalanya di bawah lingkaran atas (+4), lingkarannya berakhir 412 < label jumlah 430 (dulu Ø128 di 188: kepala menabrak judul) */
const SLOT_PEMBELI = [{ dx: -84, dy: -50 }, { dx: 84, dy: -50 }, { dx: -84, dy: 106 }, { dx: 84, dy: 106 }];

export const Scene03: React.FC<{ f: number }> = ({ f }) => {
  if (f < S3) return null;
  // KELUAR = masker lingkaran ke simpul bab 02 (Emas) di peta pembuka Properti, berubah toska + ikonnya. 50f mulai BATAS.s5.
  if (f >= BATAS.s5 + 52) return null;
  const ex = R(f, BATAS.s5, BATAS.s5 + 50, 0, 1, io);
  const kam5 = kamera('S05', BATAS.s5 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam5, SIMPUL_PETA(1)), r: SIMPUL_PETA(1).r * kam5.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);

  const r = rampa(f);
  const xA = xEmas(r), wA = lerp(W_EMAS, W_AKHIR, r.tJ);
  const xK = xKanan(r), wK = wKanan(r);

  /* kartu emas (kiri): Hari ini → Pasokan → Emas milikmu */
  // kartu mulai pop TEPAT saat simpul peta mendarat (pindai jeglek 16 Okt: popIn(hari) yang ditahan sampai PETA_SELESAI = kartu muncul setengah besar dalam 1 frame)
  const pA = popIn(f, PETA_SELESAI + 30);
  const isiHariIni = 1 - R(f, supply - 30, supply, 0, 1, io);
  const isiPasokan = R(f, supply, supply + 30, 0, 1, io) * (1 - R(f, jadi2 - 5, jadi2 + 25, 0, 1, io));
  const isiMilikmu = R(f, jadi2 + 25, jadi2 + 55, 0, 1, io);
  /* kalender tahun */
  // kalender pop SESUDAH kartu emas memberi ruang (f5100 dulu: kalender muncul di 960 saat kartu emas masih di sana → tumpang tindih)
  const pKal = popIn(f, sepuluh + 20) * (1 - R(f, tetap - 45, tetap - 5, 0, 1, io)); // pergi DULU (audit 16 Okt f5280: "=" menimpa kalender)
  const xKal = 960;
  const iKal = 10 * R(f, tahun - 15, lagi + 45, 0, 1, io);
  /* kartu kanan: 10 tahun lagi → Pemasukan → Harga; menyatu ke kartu akhir */
  const pK = popIn(f, lagi + 10);
  const isi10 = 1 - R(f, emas2 - 20, emas2 + 10, 0, 1, io);
  const isiPemasukan = R(f, emas2 + 10, emas2 + 40, 0, 1, io) * (1 - R(f, sumber - 20, sumber + 10, 0, 1, io));
  const isiHarga = R(f, sumber + 10, sumber + 40, 0, 1, io) * (1 - R(f, jadi2 - 10, jadi2 + 20, 0, 1, io));
  const kacaKanan = 1 - R(f, jadi2 + 40, jadi2 + 60, 0, 1, io); // kaca melebur ke kartu akhir di 20f terakhir penyatuan
  /* kartu permintaan (kanan, tahap supply–demand) */
  const xP = lerp(1490, X_AKHIR, r.tJ), wP = lerp(400, W_AKHIR, r.tJ);
  const pP = popIn(f, demand);
  const isiPermintaan = 1 - R(f, jadi2 - 10, jadi2 + 20, 0, 1, io);
  const kacaPermintaan = 1 - R(f, jadi2 + 40, jadi2 + 60, 0, 1, io);
  /* tanda sama dengan */
  const pSama = popIn(f, tetap + 22) * (1 - R(f, emas2 - 25, emas2 + 5, 0, 1, io)); // pop sesudah kalender habis
  const sorot1Gram = R(f, satu - 30, satu + 30, 0, 1, io) * (1 - R(f, emas2 - 20, emas2 + 10, 0, 1, io));

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s5, BATAS.s5 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* ═════ judul (kolom TEXT naskah) ═════ */}
      <Judul f={f} kata={['Emas', 'tidak', 'menghasilkan', 'cash flow']} at={emas2 + 10} sorotAt={laba + 10} keluar={sumber} />
      <Judul f={f} kata={['Return', 'utamanya', 'dari', 'perubahan harga']} at={utamanya + 10} sorotAt={perubahan + 40} keluar={supply - 20} />
      <Judul f={f} kata={['Harga', 'terbentuk', 'dari', 'supply & demand']} at={supply + 10} sorotAt={demand + 30} keluar={jadi2 + 10} />
      <Judul f={f} kata={['Emas', 'tidak', 'menghasilkan', 'cash flow']} at={tidak3} sorotAt={cash + 10} />

      {/* ═════ peta bab → simpul Emas meluncur ke cakram kartu "Hari ini" ═════ */}
      <PembukaBab f={f} s0={S3} k={1} isiAt={emas} tengah={{ x: 960, y: Y + CAKRAM.dy, d: CAKRAM.d }} selesai={PETA_SELESAI} pergi={emas + 10} />

      {/* ═════ kartu permintaan (di bawah kartu lain saat menyatu) ═════ */}
      {pP > 0.001 && kacaPermintaan > 0.001 ? (
        <Kaca x={xP} y={Y} w={wP} h={KH} p={pP} warna={B.orange} tab="atas" alfa={kacaPermintaan}>
          {isiPermintaan > 0.001 ? <IsiPermintaan f={f} w={wP} op={isiPermintaan} /> : null}
        </Kaca>) : null}

      {/* ═════ kartu kanan: 10 tahun lagi → pemasukan → harga ═════ */}
      {pK > 0.001 && kacaKanan > 0.001 ? (
        <Kaca x={xK} y={Y} w={wK} h={KH} p={pK} warna={B.blue} tab="atas" alfa={kacaKanan}>
          {isi10 > 0.001 ? <IsiTahunan w={wK} op={isi10} chip="10 tahun lagi" f={f} beratAt={fisik} sorot={sorot1Gram} warna={B.blue} /> : null}
          {isiPemasukan > 0.001 ? <IsiPemasukan f={f} w={wK} op={isiPemasukan} /> : null}
          {isiHarga > 0.001 ? <IsiHarga f={f} w={wK} op={isiHarga} /> : null}
        </Kaca>) : null}

      {/* ═════ kalender tahun & tanda sama dengan (di antara dua kartu) ═════ */}
      <Kalender x={xKal} y={Y} halaman={HALAMAN_TAHUN} i={iKal} p={pKal} warna={B.turq} />
      <SamaDengan x={960} y={Y + CAKRAM.dy} p={pSama} />

      {/* ═════ kartu emas (kiri; di atas saat menyatu) ═════ */}
      {pA > 0.001 ? (
        <Kaca x={xA} y={Y} w={wA} h={KH} p={pA} warna={B.turq} tab="atas">
          {isiHariIni > 0.001 ? <IsiTahunan w={wA} op={isiHariIni} chip="Hari ini" f={f} beratAt={gram} sorot={sorot1Gram} warna={B.turq} tanpaCakram /> : null}
          {isiPasokan > 0.001 ? <IsiPasokan w={wA} op={isiPasokan} /> : null}
          {isiMilikmu > 0.001 ? <IsiMilikmu f={f} w={wA} op={isiMilikmu} /> : null}
        </Kaca>) : null}
      {/* cakram foto emas kartu "Hari ini" — benda yang SAMA dengan simpul bab (di luar kotak kaca supaya tak ikut pop kartu) */}
      {f >= PETA_SELESAI && isiHariIni > 0.001 ? (
        <CakramEmas x={xA} y={Y + CAKRAM.dy} d={CAKRAM.d} foto={R(f, PETA_SELESAI, PETA_SELESAI + 30, 0, 1, io)} op={isiHariIni} />) : null}

      {/* murid "Kita" DIHAPUS (Simon 16 Okt: "hapus orang dengan label kita di adegan emas") — kartu "Emas milikmu" sendirian di tengah */}
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.turq, opacity: R(f, BATAS.s5 + 22, BATAS.s5 + 48, 0, 1, io) }} /> : null}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s5 + 34, BATAS.s5 + 48, 0, 1, io) }}><Icon name="emas" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/* ════════════════ isi kartu (koordinat dari kiri-atas kartu; lebar w) ════════════════ */
const HALAMAN_TAHUN: Halaman[] = Array.from({ length: 11 }, (_, k) => ({ atas: 'Tahun', angka: String(2026 + k), bawah: k === 0 ? 'hari ini' : k === 10 ? '10 tahun lagi' : `+${k} tahun` }));

/** teks rata tengah di kartu (pusat x = w/2), puncak `top` */
const Tengah: React.FC<{ w: number; top: number; children: React.ReactNode; op?: number }> = ({ w, top, children, op = 1 }) => (
  <div style={{ position: 'absolute', left: 0, top, width: w, textAlign: 'center', opacity: op < 1 ? Math.max(0.0001, op) : undefined, whiteSpace: 'nowrap', fontFamily: F }}>{children}</div>);

/** chip keterangan di kepala kartu (warna toska muda) */
const Chip: React.FC<{ teks: string; warna?: string; ikon?: KunciIkon }> = ({ teks, warna = B.turq, ikon }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 22px', borderRadius: 999, background: rgba(warna, 0.14), fontSize: 28, fontWeight: 800,
    color: mixHex(warna, B.night, 0.35), lineHeight: 1 }}>
    {ikon ? <Icon name={ikon} size={28} color={warna} /> : null}{teks}
  </span>);

/** kepala kartu: kotak ikon berwarna + judul (rata kiri) */
const Kepala: React.FC<{ ikon: KunciIkon; warna: string; teks: string; op?: number }> = ({ ikon, warna, teks, op = 1 }) => (
  <div style={{ position: 'absolute', left: 30, top: 34, display: 'flex', alignItems: 'center', gap: 16, opacity: op < 1 ? Math.max(0.0001, op) : undefined, fontFamily: F }}>
    <div style={{ width: 58, height: 58, borderRadius: 16, background: warna, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={36} color={B.white} /></div>
    <span style={{ fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>{teks}</span>
  </div>);

/** kartu "Hari ini" / "10 tahun lagi": chip waktu, cakram foto emas, berat "1 gram" */
/** `warna`: Hari ini = toska (warna bab Emas) · 10 tahun lagi = biru (Simon 16 Okt: "bedakan warnanya agar terlihat perbedaannya") */
const IsiTahunan: React.FC<{ w: number; op: number; chip: string; f: number; beratAt: number; sorot: number; warna: string; tanpaCakram?: boolean }> = ({ w, op, chip, f, beratAt, sorot, warna, tanpaCakram }) => (
  <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
    <Tengah w={w} top={44}><Chip teks={chip} ikon="tenor" warna={warna} /></Tengah>
    {tanpaCakram ? null : <CakramEmas x={w / 2} y={KH / 2 + CAKRAM.dy} d={CAKRAM.d} foto={1} op={1} warna={warna} />}
    <Tengah w={w} top={346}>
      <WordText halus f={f} at={beratAt} style={{ fontSize: 64, fontWeight: 800, color: mixHex(B.night, mixHex(warna, B.night, 0.25), sorot), fontFamily: F }}>1 gram</WordText>
    </Tengah>
    <Tengah w={w} top={428} op={R(f, beratAt, beratAt + 30, 0, 1, io)}><span style={{ fontSize: 26, fontWeight: 700, color: B.gray }}>Berat emas</span></Tengah>
  </div>);

/** kartu "Pemasukan dari emas": tiga sumber pemasukan yang TIDAK dimiliki emas, tiap baris Rp0 */
const BARIS_PEMASUKAN: { teks: string; foto: string; rasio: number; at: number }[] = [
  { teks: 'Bunga', foto: 'media/gedung/bank.webp', rasio: 1262 / 1166, at: bunga },
  { teks: 'Sewa', foto: 'media/gedung/rumah.webp', rasio: 696 / 380, at: sewa },
  { teks: 'Laba bisnis', foto: 'media/perusahaan.webp', rasio: 389 / 480, at: bisnis },
];
const IsiPemasukan: React.FC<{ f: number; w: number; op: number }> = ({ f, w, op }) => (
  <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
    <Kepala ikon="pendapatan" warna={B.blue} teks="Pemasukan dari emas" />
    {BARIS_PEMASUKAN.map((b, k) => {
      const p = popIn(f, b.at);
      if (p <= 0.001) return null;
      const nol = R(f, b.at + 10, b.at + 40, 0, 1, io);
      const top = 122 + k * 120, h = 104;
      // foto benda dimuat dalam kotak 118 × 88 (proporsi asli)
      const fw = Math.min(118, 88 * b.rasio), fh = fw / b.rasio;
      return (
        <div key={b.teks} style={{ position: 'absolute', left: 28, top, width: w - 56, height: h, borderRadius: 22, background: mixHex(B.white, B.blue, 0.06),
          transformOrigin: 'center', transform: `${geser(0, 0)} scale(${p})`, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px 0 18px', boxSizing: 'border-box', fontFamily: F }}>
          <div style={{ width: 118, height: 88, display: 'grid', placeItems: 'center', flex: 'none' }}>
            <Img src={staticFile(b.foto)} style={{ width: fw, height: fh, maxWidth: 'none' }} />
          </div>
          <span style={{ fontSize: 32, fontWeight: 800, color: B.night, flex: 1 }}>{b.teks}</span>
          <span style={{ fontSize: 42, fontWeight: 800, color: B.gray, opacity: Math.max(0.0001, nol), fontVariantNumeric: 'tabular-nums' }}>Rp0</span>
        </div>);
    })}
  </div>);

/** kartu HARGA emas per gram: angka berjalan + garis harga (Beli → Jual, lalu naik/turun mengikuti permintaan) */
const IsiHarga: React.FC<{ f: number; w: number; op: number }> = ({ f, w, op }) => {
  const u = ujungHarga(f);
  const v = hargaDi(u);
  // arah ruas yang sedang berjalan → warna angka & pil (hijau naik, merah turun)
  const turunAktif = u > I_NAIK + 0.01;
  const dasar = u <= I_JUAL + 0.01 ? HARGA_BELI : u <= I_NAIK + 0.01 ? HARGA_JUAL : HARGA_NAIK;
  const d = (v - dasar) / dasar;
  const col = Math.abs(d) < 0.004 ? B.night : d > 0 ? ARAH.naik : ARAH.turun;
  const C = { x0: 44, x1: w - 44, y0: 262, y1: 452 };
  const px = (i: number) => lerp(C.x0, C.x1, i / (N_TITIK - 1));
  const py = (val: number) => C.y1 - ((val - DOM[0]) / (DOM[1] - DOM[0])) * (C.y1 - C.y0);
  const ruasGaris = (a: number, b: number) => {
    const e = Math.min(b, u);
    if (e <= a) return '';
    const pts: string[] = [];
    for (let i = a; i <= Math.floor(e); i += 1) pts.push(`${px(i).toFixed(1)},${py(HARGA[i]).toFixed(1)}`);
    if (e > Math.floor(e)) pts.push(`${px(e).toFixed(1)},${py(hargaDi(e)).toFixed(1)}`);
    return pts.join(' ');
  };
  const pergiPenanda = 1 - R(f, supply - 30, supply, 0, 1, io);
  const penanda = R(f, harga - 20, harga + 20, 0, 1, io) * pergiPenanda;
  const beliP = R(f, sumber + 10, sumber + 40, 0, 1, io) * pergiPenanda;
  const jualP = R(f, perubahan + 20, perubahan + 40, 0, 1, io) * pergiPenanda;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
      <Kepala ikon="emas" warna={B.blue} teks="Harga emas per gram" />
      <Tengah w={w} top={112}>
        <span style={{ fontSize: 62, fontWeight: 800, color: col, fontVariantNumeric: 'tabular-nums', display: 'inline-block', transform: HALUS3D }}>{rpPenuh(Math.round(v / 1000) * 1000)}</span>
      </Tengah>
      <Tengah w={w} top={190} op={Math.min(1, Math.abs(d) / 0.02)}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, background: rgba(col, 0.12), fontSize: 26, fontWeight: 800, color: col,
          fontVariantNumeric: 'tabular-nums' }}>
          <svg width={18} height={14} viewBox="0 0 22 18"><path d={d >= 0 ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} /></svg>
          {`${d >= 0 ? '+' : '−'}${Math.round(Math.abs(d) * 100)}%`}
        </span>
      </Tengah>
      <svg width={w} height={KH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {[0, 1, 2, 3].map((k) => <line key={k} x1={C.x0} x2={C.x1} y1={lerp(C.y0, C.y1, k / 3)} y2={lerp(C.y0, C.y1, k / 3)} stroke={rgba(B.night, 0.07)} strokeWidth={1.5} />)}
        <polyline points={ruasGaris(0, I_NAIK)} fill="none" stroke={ARAH.naik} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={ruasGaris(I_NAIK, N_TITIK - 1)} fill="none" stroke={ARAH.turun} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" />
        {u > 0.05 ? <circle cx={px(u)} cy={py(v)} r={8} fill={B.white} stroke={turunAktif ? ARAH.turun : ARAH.naik} strokeWidth={4} /> : null}
        {/* selisih Beli → Jual = return (garis putus mendatar dari harga beli + tegak di titik Jual) */}
        {penanda > 0.001 ? (
          <g opacity={penanda}>
            <line x1={px(0)} x2={px(I_JUAL)} y1={py(HARGA_BELI)} y2={py(HARGA_BELI)} stroke={B.grayLite} strokeWidth={2.5} strokeDasharray="6 8" />
            <line x1={px(I_JUAL)} x2={px(I_JUAL)} y1={py(HARGA_BELI)} y2={py(HARGA_JUAL) + 10} stroke={ARAH.naik} strokeWidth={3} strokeDasharray="6 8" />
          </g>) : null}
      </svg>
      <Penanda x={px(0)} y={py(HARGA_BELI)} teks="Beli" p={beliP} bawah />
      <Penanda x={px(I_JUAL)} y={py(HARGA_JUAL)} teks="Jual" p={jualP} />
      {penanda > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(px(I_JUAL) + 16, lerp(py(HARGA_BELI), py(HARGA_JUAL), 0.5))} translate(0, -50%)`, opacity: Math.max(0.0001, penanda),
          padding: '6px 14px', borderRadius: 999, background: rgba(ARAH.naik, 0.12), fontFamily: F, fontSize: 24, fontWeight: 800, color: ARAH.naik, whiteSpace: 'nowrap' }}>
          +{rpPenuh(HARGA_JUAL - HARGA_BELI)}
        </div>) : null}
    </div>);
};
/** penanda titik Beli/Jual di garis harga */
const Penanda: React.FC<{ x: number; y: number; teks: string; p: number; bawah?: boolean }> = ({ x, y, teks, p, bawah }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y + (bawah ? 30 : -30))} translate(-50%, -50%) scale(${lerp(0.8, 1, p)})`, opacity: Math.min(0.9999, p),
    padding: '5px 14px', borderRadius: 999, background: B.night, color: B.white, fontFamily: F, fontSize: 22, fontWeight: 800, whiteSpace: 'nowrap' }}>{teks}</div>);

/** kartu PASOKAN: tumpukan emas nyata, jumlahnya tidak berubah */
const IsiPasokan: React.FC<{ w: number; op: number }> = ({ w, op }) => (
  <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
    <Kepala ikon="emas" warna={B.turq} teks="Pasokan" />
    <Img src={staticFile('media/emas/emas_batangan.webp')} style={{ position: 'absolute', left: w / 2 - 160, top: 130, width: 320, height: 320 * (481 / 600), maxWidth: 'none' }} />
    <Tengah w={w} top={420}><span style={{ fontSize: 30, fontWeight: 800, color: B.night }}>Emas tersedia</span></Tengah>
  </div>);

/** kartu PERMINTAAN: pembeli (orang berbeda) datang & pergi; jumlahnya berjalan */
const IsiPermintaan: React.FC<{ f: number; w: number; op: number }> = ({ f, w, op }) => {
  const ada = PEMBELI.map((b) => popIn(f, b.datang) * (b.pergi === undefined ? 1 : 1 - R(f, b.pergi - 20, b.pergi + 20, 0, 1, io)));
  const n = ada.filter((a) => a > 0.5).length;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
      <Kepala ikon="permintaanEmas" warna={B.orange} teks="Permintaan" />
      {PEMBELI.map((b, k) => (
        <KarakterLingkar key={k} pose={b.pose} x={w / 2 + SLOT_PEMBELI[k].dx} y={KH / 2 + SLOT_PEMBELI[k].dy} D={112} s={ada[k]} warna={B.orangeLite} />))}
      <Tengah w={w} top={430}><span style={{ fontSize: 30, fontWeight: 800, color: B.night, fontVariantNumeric: 'tabular-nums' }}>{n} pembeli</span></Tengah>
    </div>);
};

/** kartu akhir "Emas milikmu": cakram emas, 1 gram, baris Cash flow Rp0 (dicoret) */
const IsiMilikmu: React.FC<{ f: number; w: number; op: number }> = ({ f, w, op }) => {
  const pBaris = popIn(f, menghasilkan3);
  const coret = R(f, cash - 20, cash + 30, 0, 1, io);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
      <Tengah w={w} top={40}><Chip teks="Emas milikmu" ikon="emas" /></Tengah>
      <CakramEmas x={w / 2} y={196} d={180} foto={1} op={1} />
      <Tengah w={w} top={300}><span style={{ fontSize: 52, fontWeight: 800, color: B.night }}>1 gram</span></Tengah>
      {pBaris > 0.001 ? (
        <div style={{ position: 'absolute', left: 26, top: 384, width: w - 52, height: 90, borderRadius: 22, background: mixHex(B.white, mixHex(B.turq, CORET, coret), 0.08),
          transformOrigin: 'center', transform: `${geser(0, 0)} scale(${pBaris})`, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', boxSizing: 'border-box', fontFamily: F }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: mixHex(B.turq, CORET, coret), display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="pendapatan" size={32} color={B.white} /></div>
          <span style={{ fontSize: 30, fontWeight: 800, color: B.night, flex: 1 }}>Cash flow</span>
          <span style={{ fontSize: 40, fontWeight: 800, color: mixHex(B.gray, CORET, coret), fontVariantNumeric: 'tabular-nums' }}>Rp0</span>
          <div style={{ position: 'absolute', left: 18, top: '50%', height: 5, marginTop: -2.5, width: `calc(${coret} * (100% - 36px))`, background: CORET, borderRadius: 3 }} />
        </div>) : null}
    </div>);
};

/* ════════════════ benda ════════════════ */
/** cakram toska + foto emas batangan Simon (foto menyembul di atas cakram, terpotong lengkung bawah) — `foto` 0 = ikon bab (serah-terima dari simpul peta) */
const EMAS_RASIO = 481 / 600;
const CakramEmas: React.FC<{ x: number; y: number; d: number; foto: number; op: number; warna?: string }> = ({ x, y, d, foto, op, warna = B.turq }) => {
  if (op <= 0.001) return null;
  const r = d / 2, w = 1.05 * d, h = w * EMAS_RASIO, top = 0.62 * r - h, left = -w / 2, cyImg = -top, cxImg = -left;
  const klip = `path('M -4 -4 H ${w + 4} V ${cyImg} H ${cxImg + r} A ${r} ${r} 0 0 1 ${cxImg - r} ${cyImg} H -4 Z')`;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: geser(x, y), opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
      {/* lingkaran = struktur SimpulBab (kotak 170 + skala) → serah-terima dari simpul peta tanpa lonjakan raster */}
      <div style={{ position: 'absolute', left: -85, top: -85, width: 170, height: 170, transform: `scale(${d / 170})` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center', transform: 'scale(0.99996)', boxShadow: `0 18px 40px -12px ${warna}aa` }}>
          {foto < 0.999 ? <div style={{ opacity: Math.max(0.0001, 1 - foto), display: 'grid' }}><Icon name="emas" size={96} color={B.white} /></div> : null}
        </div>
      </div>
      {foto > 0.001 ? <Img src={staticFile('media/emas/emas_batangan.webp')} style={{ position: 'absolute', left, top, width: w, height: h, maxWidth: 'none', opacity: Math.min(0.9999, foto), clipPath: klip }} /> : null}
    </div>);
};

/** lencana "=" di antara dua kartu */
const SamaDengan: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 96, height: 96, borderRadius: '50%', background: B.turq, transformOrigin: 'center',
    transform: `${geser(x - 48, y - 48)} scale(${p})`, boxShadow: `0 12px 26px -10px ${B.turq}cc` }}>
    <svg width={96} height={96} viewBox="0 0 68 68"><g fill={B.white}><rect x={20} y={24} width={28} height={6} rx={3} /><rect x={20} y={38} width={28} height={6} rx={3} /></g></svg>
  </div>);

export const S03_BEAT = { emas, hari, gram, sepuluh, tahun, lagi, fisik, tetap, satu, emas2, bunga, sewa, bisnis, laba, sumber, utamanya, datang, perubahan, harga,
  supply, demand, naik, harganya, naik2, melemah, harganya2, turun, jadi2, memegang, tidak3, menghasilkan3, cash };
