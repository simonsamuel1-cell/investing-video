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
import { Gedung, lebarGedung } from '../parts/gedung';
import { HALUS3D, Kaca, KarakterLingkar, MURID, Penghubung, geser } from '../v3/kaca';

/**
 * SCENE 05 — OBLIGASI (file s06, kunci batas s6), versi GAYA VIDEO 3 (Simon 16 Okt: layout/animasi/style Video 3, aset realistis, orang awam,
 * tidak statis, "hapus geser kanan kiri yang tidak ada artinya", tiap kemunculan beranimasi inOut cubic / outBack). Ide = 04_Asset/
 * Evaluasi-Ide-Baru-16okt.md § S05. Aturan Simon lama yang tetap: investor = murid berkemeja biru ("kita"), gedung Pemerintah & Perusahaan
 * utuh tanpa lingkaran + label di bawah, kupon = IKON kupon (bukan koin), pokok dibayar PENUH saat jatuh tempo.
 *   1. peta bab → simpul Obligasi jadi cakram SERTIFIKAT obligasi (foto realistis Video 3)
 *   2. "kita meminjamkan uang kepada pemerintah atau perusahaan" → murid · uang Rp100 jt terbang ke obligasi · cabang ke dua gedung
 *   3. "kupon secara berkala" → diagram MENYATU jadi kartu garis waktu 3 tahun (cakram jadi ikon kepala kartu); kursor berjalan,
 *      tiap 6 bulan kupon +Rp3 jt muncul lalu terbang ke kartu "Diterima" di bawah murid (angka berjalan)
 *   4. "jatuh tempo … pokok dibayarkan kembali" → uang Rp100 jt dari ujung garis waktu terbang ke kartu "Diterima"
 *   5. "harga obligasi di pasar bisa naik dan turun" → garis harga pasar tergambar di atas garis waktu, angka berjalan ▲ hijau / ▼ merah
 *   6. "volatilitas … di tengah perjalanan" → pita "Di tengah jalan" + penanda tertinggi/terendah
 *   7. "dipegang sampai jatuh tempo … kupon & pokok" → ujung garis = Rp100 jt ✓, baris Kupon ✓ & Pokok ✓
 *   8. "tidak otomatis berarti investasinya gagal" → tag "Investasi gagal" dicoret merah
 * Murid TETAP di x 420 sepanjang scene (tanpa geser); hanya perpindahan bermakna: diagram → kartu garis waktu (menyatu).
 * Keluar = masker lingkaran ke simpul bab 04 di peta pembuka Reksa Dana, 50f mulai BATAS.s7.
 */
export const S6 = BATAS.s6;
export const IDE_S06_AWAL = S6;

const [obligasi, , memahaminya, kita, meminjamkan, uang, pemerintah, perusahaan, imbalannya, , menerima, kupon, , , tempo, pokok, dibayarkan,
  kembali, tapi, , , harga, pasar, , turun, volatilitas, harga2, tengah, berubah, , dipegang, tempo3, , , kupon3, pokok3, , jadi, naikTurun, ,
  gagal] = urut(['obligasi', 'cara', 'memahaminya', 'kita', 'meminjamkan', 'uang', 'pemerintah', 'perusahaan', 'imbalannya', 'kita',
  'menerima', 'kupon', 'berkala', 'jatuh', 'tempo', 'pokok', 'dibayarkan', 'kembali', 'tapi', 'sebelum', 'tempo', 'harga', 'pasar', 'naik',
  'turun', 'volatilitas', 'harga', 'tengah', 'berubah', 'meskipun', 'dipegang', 'tempo', 'kita', 'tetap', 'kupon', 'pokok', 'ketentuannya',
  'jadi', 'naik-turun', 'tidak', 'gagal'], S6);

/* ── tata letak (tanpa kamera) ── */
const ORANG = { x: 420, y: 510, D: 240 }; // murid "kita" — TETAP di sini sepanjang scene
const CAKRAM = { x: 900, y: 510, d: 220 }; // sertifikat obligasi (diagram)
const TENGAH = memahaminya - 20; // simpul bab Obligasi tiba di cakram
const H_PEM = 150, H_PER = 190;
const GED = { x: 1380, pemDasar: 500, perDasar: 780 };
/** kartu garis waktu: tepi BAWAH tetap; PENDEK (330) selama kupon & pokok, MEMANJANG ke atas (560) saat garis harga datang — dulu 560
 *  sejak awal = separuh atas kosong ±600f. Isi berjangkar ke bawah (sumbu = h − 110) → garis waktu tidak bergeser saat kartu tumbuh. */
const KARTU = { x: 1150, w: 1020, bawah: 850, h0: 330, h1: 560 };
const KL = KARTU.x - KARTU.w / 2; // kiri kartu (dunia)
const hKartu = (f: number) => lerp(KARTU.h0, KARTU.h1, R(f, harga - 40, harga + 20, 0, 1, io));
const ktAt = (f: number) => KARTU.bawah - hKartu(f); // atas kartu (dunia)
const SUMBU = { x0: 90, x1: 930, dariBawah: 110 }; // lokal kartu
const CH = { y0: 176, dariBawah: 164 }; // area garis harga (lokal, dipakai saat kartu panjang)
const TERIMA = { x: ORANG.x, top: 712, w: 380, h0: 132, h1: 196 }; // kartu "Diterima" di bawah murid

/* ── kupon: 6 × Rp3 jt (tiap 6 bulan, 3 tahun); kursor garis waktu berjalan dari "menerima" sampai "tempo" ── */
const N_KUPON = 6, KUPON_RP = 3_000_000, POKOK_RP = 100_000_000;
const kursor = (f: number) => R(f, menerima, tempo, 0, 1, io);
/** frame saat kursor melewati tick k (1..6) — kebalikan kursor (inOut cubic) dicari numerik sekali */
const T_KUPON = Array.from({ length: N_KUPON }, (_, i) => {
  const target = (i + 1) / N_KUPON;
  let t = menerima;
  while (t < tempo && kursor(t) < target - 1e-4) t += 1;
  return t;
});
const TERBANG_KUPON = 40; // lama terbang kupon ke kartu "Diterima"
const xTick = (k: number) => SUMBU.x0 + (k / N_KUPON) * (SUMBU.x1 - SUMBU.x0);

/* ── harga pasar obligasi (contoh; Rp jt): naik-turun di tengah jalan, kembali Rp100 jt di jatuh tempo ── */
const KUNCI_HARGA: [number, number][] = [[0, 100], [0.2, 101.8], [0.45, 97.9], [0.66, 102.4], [0.84, 98.8], [1, 100]];
const ss = (t: number) => t * t * (3 - 2 * t);
const hargaPada = (u: number) => {
  for (let i = 1; i < KUNCI_HARGA.length; i += 1) {
    const [a, va] = KUNCI_HARGA[i - 1], [b, vb] = KUNCI_HARGA[i];
    if (u <= b) return va + (vb - va) * ss((u - a) / (b - a));
  }
  return 100;
};
const DOM: [number, number] = [96.6, 103.4];
const gGaris = (f: number) => R(f, harga - 20, turun + 50, 0, 1, io);

export const Scene06: React.FC<{ f: number }> = ({ f }) => {
  if (f < S6) return null;
  // KELUAR = masker lingkaran ke simpul bab 04 (Obligasi) di peta pembuka Reksa Dana, berubah biru + ikonnya. 50f mulai BATAS.s7.
  if (f >= BATAS.s7 + 52) return null;
  const ex = R(f, BATAS.s7, BATAS.s7 + 50, 0, 1, io);
  const kam7 = kamera('S07', BATAS.s7 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam7, SIMPUL_PETA(3)), r: SIMPUL_PETA(3).r * kam7.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);

  /* diagram → kartu garis waktu: cakram terbang jadi ikon kepala kartu, gedung & penghubung pergi */
  const tM = R(f, imbalannya - 40, imbalannya + 20, 0, 1, io);
  const pergiDiagram = 1 - R(f, imbalannya - 40, imbalannya - 10, 0, 1, io);
  const ikonKepala = { x: KL + 30 + 29, y: ktAt(f) + 30 + 29, d: 58 };
  const cak = { x: lerp(CAKRAM.x, ikonKepala.x, tM), y: lerp(CAKRAM.y, ikonKepala.y, tM), d: lerp(CAKRAM.d, ikonKepala.d, tM) };
  const pKartu = popIn(f, imbalannya);

  /* uang Rp100 jt: muncul di samping murid ("meminjamkan"), terbang ke cakram ("uang") */
  const pUang = popIn(f, meminjamkan) * (1 - R(f, uang + 20, uang + 40, 0, 1, io));
  const tUang = R(f, uang - 25, uang + 35, 0, 1, io);
  const uangPos = { x: lerp(ORANG.x + ORANG.D / 2 + 90, CAKRAM.x, tUang), y: lerp(ORANG.y, CAKRAM.y, tUang) - Math.sin(Math.PI * tUang) * 70 };

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s7, BATAS.s7 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* ═════ judul (kolom TEXT naskah) ═════ */}
      <Judul f={f} kata={['Volatilitas', '=', 'harga', 'bisa', 'berubah', 'di tengah jalan']} at={volatilitas + 10} sorotAt={tengah + 20} keluar={jadi - 10} size={42} />
      <Judul f={f} kata={['Bukan', 'berarti', 'hasil', 'akhirnya', 'otomatis rugi']} at={jadi + 30} sorotAt={naikTurun + 40} />

      {/* ═════ peta bab → simpul Obligasi jadi cakram sertifikat ═════ */}
      <PembukaBab f={f} s0={S6} k={3} isiAt={obligasi} tengah={{ x: CAKRAM.x, y: CAKRAM.y, d: CAKRAM.d }} selesai={TENGAH} />

      {/* ═════ DIAGRAM: kita → obligasi → pemerintah / perusahaan ═════ */}
      {pergiDiagram > 0.001 ? (
        <AbsoluteFill style={{ opacity: pergiDiagram < 1 ? Math.max(0.0001, pergiDiagram) : undefined }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${ORANG.x + ORANG.D / 2 + 18} ${ORANG.y} L ${CAKRAM.x - CAKRAM.d / 2 - 18} ${CAKRAM.y}`} g={R(f, kita + 10, kita + 50, 0, 1, io)} warna={B.blue} />
            <Penghubung d={jalurCabang(GED.pemDasar - H_PEM / 2, lebarGedung('pemerintah', H_PEM))} g={R(f, pemerintah - 30, pemerintah + 20, 0, 1, io)} warna={B.blueLite} />
            <Penghubung d={jalurCabang(GED.perDasar - H_PER / 2, lebarGedung('perusahaan', H_PER))} g={R(f, perusahaan - 30, perusahaan + 20, 0, 1, io)} warna={B.blueLite} />
          </svg>
          <Gedung k="pemerintah" x={GED.x} dasar={GED.pemDasar} h={H_PEM} s={popIn(f, pemerintah)} />
          <LabelBawah x={GED.x} top={GED.pemDasar + 12} f={f} at={pemerintah + 10} teks="Pemerintah" />
          <Gedung k="perusahaan" x={GED.x} dasar={GED.perDasar} h={H_PER} s={popIn(f, perusahaan)} />
          <LabelBawah x={GED.x} top={GED.perDasar + 12} f={f} at={perusahaan + 10} teks="Perusahaan" />
          {/* nama & nominal obligasi di bawah cakram */}
          {f >= TENGAH ? <LabelBawah x={CAKRAM.x} top={CAKRAM.y + CAKRAM.d / 2 + 20} f={f} at={TENGAH + 20} teks="Obligasi" /> : null}
          <NominalPil x={CAKRAM.x} y={CAKRAM.y + CAKRAM.d / 2 + 98} p={popIn(f, uang + 30)} teks={rpPenuh(POKOK_RP)} />
        </AbsoluteFill>) : null}

      {/* ═════ KARTU GARIS WAKTU (obligasi 3 tahun) ═════ */}
      {pKartu > 0.001 ? (
        <Kaca x={KARTU.x} y={KARTU.bawah - hKartu(f) / 2} w={KARTU.w} h={hKartu(f)} p={pKartu} warna={B.blue} tab="atas">
          <IsiGarisWaktu f={f} h={hKartu(f)} />
        </Kaca>) : null}

      {/* cakram sertifikat (diagram) → ikon kepala kartu — benda yang SAMA dengan simpul bab */}
      {f >= TENGAH ? <CakramSertifikat x={cak.x} y={cak.y} d={cak.d} foto={R(f, TENGAH, TENGAH + 30, 0, 1, io) * (1 - tM)} /> : null}

      {/* uang yang dipinjamkan (foto Rupiah Video 3) */}
      {pUang > 0.001 ? <Uang x={uangPos.x} y={uangPos.y} w={lerp(140, 70, tUang)} p={pUang} /> : null}

      {/* ═════ kita (murid) + kartu "Diterima" ═════ */}
      <KarakterLingkar pose={MURID} x={ORANG.x} y={ORANG.y} D={ORANG.D} s={popIn(f, kita)} warna={B.blue} />
      {/* teks "Kita" di bawah murid DIHAPUS (Simon 16 Okt: "hapus text kita") */}
      <KartuDiterima f={f} />

      {/* kupon & pokok yang terbang ke kartu "Diterima" (di atas semua) */}
      <Terbang f={f} />
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.blue, opacity: R(f, BATAS.s7 + 22, BATAS.s7 + 48, 0, 1, io) }} /> : null}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s7 + 34, BATAS.s7 + 48, 0, 1, io) }}><Icon name="obligasi" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/** jalur penghubung cakram → gedung (kurva S mendatar), berhenti di tepi kiri gambar gedung */
const jalurCabang = (yTuju: number, wGedung: number) => {
  const x1 = CAKRAM.x + CAKRAM.d / 2 + 18, y1 = CAKRAM.y, x2 = GED.x - wGedung / 2 - 18, xm = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${xm} ${y1}, ${xm} ${yTuju}, ${x2} ${yTuju}`;
};

/* ════════════════ kartu garis waktu ════════════════ */
const IsiGarisWaktu: React.FC<{ f: number; h: number }> = ({ f, h }) => {
  const SY = h - SUMBU.dariBawah, CY1 = h - CH.dariBawah;
  const u = kursor(f);
  const xk = lerp(SUMBU.x0, SUMBU.x1, u);
  const g = gGaris(f);
  const px = (t: number) => lerp(SUMBU.x0, SUMBU.x1, t);
  const py = (v: number) => CY1 - ((v - DOM[0]) / (DOM[1] - DOM[0])) * (CY1 - CH.y0);
  // garis harga per ruas antar-titik kunci (hijau naik / merah turun)
  const ruas = KUNCI_HARGA.slice(1).map(([b, vb], i) => {
    const [a, va] = KUNCI_HARGA[i];
    if (g <= a) return null;
    const e = Math.min(b, g), n = Math.max(2, Math.ceil(((e - a) / (b - a)) * 24));
    const pts = Array.from({ length: n + 1 }, (_, j) => { const t = a + ((e - a) * j) / n; return `${px(t).toFixed(1)},${py(hargaPada(t)).toFixed(1)}`; });
    return <polyline key={i} points={pts.join(' ')} fill="none" stroke={vb >= va ? ARAH.naik : ARAH.turun} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />;
  });
  const vNow = hargaPada(g);
  const naikSekarang = (() => { const d = hargaPada(Math.min(1, g + 0.01)) - hargaPada(Math.max(0, g - 0.01)); return d >= 0; })();
  const colNow = Math.abs(vNow - 100) < 0.15 ? B.night : vNow > 100 ? ARAH.naik : ARAH.turun;
  const pGaris = R(f, harga - 20, harga + 10, 0, 1, io);
  const pita = R(f, volatilitas - 20, volatilitas + 20, 0, 1, io) * (1 - R(f, dipegang - 30, dipegang, 0, 1, io));
  const pEkstrem = R(f, berubah - 30, berubah + 10, 0, 1, io) * (1 - R(f, dipegang - 30, dipegang, 0, 1, io));
  const pAkhir = R(f, tempo3 - 20, tempo3 + 20, 0, 1, io);
  const pTag = popIn(f, naikTurun);
  const coret = R(f, gagal - 30, gagal + 20, 0, 1, io);
  return (
    <>
      {/* kepala: (ikon = cakram yang terbang) judul + tenor */}
      {/* teks kepala muncul SESUDAH cakram sertifikat mendarat jadi ikon (audit 16 Okt f9960–9990: cakram yang terbang menutup teks) */}
      <div style={{ position: 'absolute', left: 30 + 58 + 16, top: 30, height: 58, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap',
        opacity: Math.max(0.0001, Math.min(0.9999, R(f, imbalannya + 12, imbalannya + 36, 0, 1, io))), transform: geser(18 * (1 - R(f, imbalannya + 12, imbalannya + 36, 0, 1, io)), 0) }}>
        Obligasi {rpPenuh(POKOK_RP)}
      </div>
      <div style={{ position: 'absolute', right: 30, top: 38, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, background: rgba(B.blue, 0.1),
        fontFamily: F, fontSize: 26, fontWeight: 800, color: mixHex(B.blue, B.night, 0.3) }}>
        <Icon name="tenor" size={26} color={B.blue} />Tenor 3 tahun
      </div>

      <svg width={KARTU.w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* pita "di tengah jalan" */}
        {pita > 0.001 ? <rect x={px(0.08)} y={CH.y0 - 14} width={px(0.92) - px(0.08)} height={CY1 - CH.y0 + 28} rx={18} fill={rgba(B.blue, 0.07 * pita)} stroke={rgba(B.blue, 0.5 * pita)} strokeWidth={2.5} strokeDasharray="8 10" /> : null}
        {/* acuan Rp100 jt */}
        {pGaris > 0.001 ? <line x1={SUMBU.x0} x2={SUMBU.x1} y1={py(100)} y2={py(100)} stroke={B.grayLite} strokeWidth={2.5} strokeDasharray="6 9" opacity={pGaris} /> : null}
        {ruas}
        {g > 0.004 && g < 0.999 ? <circle cx={px(g)} cy={py(vNow)} r={8} fill={B.white} stroke={naikSekarang ? ARAH.naik : ARAH.turun} strokeWidth={4} /> : null}
        {/* garis waktu */}
        <line x1={SUMBU.x0} x2={SUMBU.x1} y1={SY} y2={SY} stroke={B.grayLite} strokeWidth={5} strokeLinecap="round" />
        <line x1={SUMBU.x0} x2={xk} y1={SY} y2={SY} stroke={B.blue} strokeWidth={5} strokeLinecap="round" />
        {Array.from({ length: N_KUPON - 1 }, (_, i) => {
          const x = xTick(i + 1), lewat = R(u, (i + 1) / N_KUPON - 0.02, (i + 1) / N_KUPON + 0.02, 0, 1, io);
          return <circle key={i} cx={x} cy={SY} r={9} fill={mixHex(B.white, B.blue, lewat)} stroke={mixHex(B.grayLite, B.blue, lewat)} strokeWidth={3} />;
        })}
        <circle cx={SUMBU.x0} cy={SY} r={12} fill={B.blue} />
        <circle cx={SUMBU.x1} cy={SY} r={12} fill={mixHex(B.white, B.blue, R(u, 0.97, 1, 0, 1, io))} stroke={B.blue} strokeWidth={4} />
        {u > 0.001 && u < 0.999 ? <circle cx={xk} cy={SY} r={14} fill={B.white} stroke={B.blue} strokeWidth={5} /> : null}
      </svg>
      <UjungLabel x={SUMBU.x0} sy={SY} judul="Hari ini" ket="Nov 2026" />
      <UjungLabel x={SUMBU.x1} sy={SY} judul="Jatuh tempo" ket="Nov 2029" />

      {/* kupon yang baru muncul di tick (sebelum terbang) */}
      {T_KUPON.map((t, k) => {
        const p = popIn(f, t + 10, 30) * (1 - R(f, t + 24, t + 30, 0, 1, io));
        return p > 0.001 ? <ChipKupon key={k} x={xTick(k + 1)} y={SY - 52} p={p} /> : null;
      })}
      {/* pokok di ujung garis waktu (sebelum terbang) */}
      {(() => {
        const p = popIn(f, pokok + 25) * (1 - R(f, dibayarkan - 6, dibayarkan, 0, 1, io));
        return p > 0.001 ? <Uang x={SUMBU.x1} y={SY - 70} w={130} p={p} /> : null;
      })()}

      {/* angka harga pasar berjalan (mengikuti ujung garis) */}
      {pGaris > 0.001 && pTag < 0.5 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(SUMBU.x1, CH.y0 - 44)} translate(-100%, -50%)${HALUS3D}`,
          opacity: Math.min(0.9999, pGaris) * (1 - R(f, dipegang - 30, dipegang, 0, 1, io)), padding: '7px 16px', borderRadius: 999, background: B.white,
          boxShadow: `0 8px 18px -10px ${rgba(B.night, 0.35)}`, fontFamily: F, fontSize: 24, fontWeight: 800, color: colNow, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          Harga pasar {rpJt(vNow)}
        </div>) : null}
      {/* penanda tertinggi / terendah (volatilitas) */}
      {pEkstrem > 0.001 ? (
        <>
          {/* di SAMPING puncak/lembah (dulu di atas/bawahnya → menempel garis putus pita, f11180) */}
          <PenandaHarga x={px(0.66) + 100} y={py(102.4)} teks={`▲ ${rpJt(102.4)}`} warna={ARAH.naik} p={pEkstrem} />
          <PenandaHarga x={px(0.45) + 100} y={py(97.9)} teks={`▼ ${rpJt(97.9)}`} warna={ARAH.turun} p={pEkstrem} />
        </>) : null}
      {/* "Di tengah jalan" → tag "Investasi gagal" (dicoret) di tempat yang sama */}
      {pita > 0.001 && pTag < 0.5 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(KARTU.w / 2, CH.y0 - 44)} translate(-50%, -50%) scale(${lerp(0.85, 1, pita)})`, opacity: Math.min(0.9999, pita),
          padding: '7px 20px', borderRadius: 999, background: B.blue, color: B.white, fontFamily: F, fontSize: 24, fontWeight: 800, whiteSpace: 'nowrap' }}>Di tengah jalan</div>) : null}
      {/* ujung garis harga = Rp100 jt saat jatuh tempo */}
      {pAkhir > 0.001 ? <PenandaHarga x={SUMBU.x1 - 6} y={py(100) - 40} teks={`${rpJt(100)} ✓`} warna={B.blue} p={pAkhir} /> : null}
      {pTag > 0.001 ? <TagGagal x={KARTU.w / 2} y={CH.y0 - 44} p={pTag} coret={coret} /> : null}
    </>);
};
const rpJt = (v: number) => `Rp${v.toFixed(1).replace('.', ',')} jt`;

/** label ujung garis waktu (di bawah sumbu) */
const UjungLabel: React.FC<{ x: number; sy: number; judul: string; ket: string }> = ({ x, sy, judul, ket }) => (
  <div style={{ position: 'absolute', left: x - 120, width: 240, top: sy + 26, textAlign: 'center', fontFamily: F, lineHeight: 1.2 }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: B.night }}>{judul}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: B.gray }}>{ket}</div>
  </div>);

/** penanda harga (pil putih bertepi warna) */
const PenandaHarga: React.FC<{ x: number; y: number; teks: string; warna: string; p: number }> = ({ x, y, teks, warna, p }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${lerp(0.85, 1, Math.min(1, p))})`, opacity: Math.min(0.9999, p),
    padding: '6px 16px', borderRadius: 999, background: B.white, border: `2.5px solid ${warna}`, fontFamily: F, fontSize: 22, fontWeight: 800, color: warna, whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums' }}>{teks}</div>);

/** chip kupon: ikon kupon (Simon: "jangan ganti ke coin untuk obligasi") + nominal */
const ChipKupon: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p * s})`, display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 14px 6px 6px', borderRadius: 999, background: B.white, boxShadow: `0 10px 20px -10px ${rgba(B.orange, 0.8)}`, border: `2px solid ${rgba(B.orange, 0.5)}`,
    fontFamily: F, fontSize: 22, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: B.orange, display: 'grid', placeItems: 'center' }}><Icon name="kupon" size={24} color={B.white} /></div>
    +Rp3 jt
  </div>);

/** foto uang Rupiah (aset realistis Video 3) */
const RASIO_UANG = 520 / 441;
const Uang: React.FC<{ x: number; y: number; w: number; p: number }> = ({ x, y, w, p }) => {
  const h = w / RASIO_UANG;
  return <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none', transformOrigin: 'center',
    transform: `${geser(x - w / 2, y - h / 2)} scale(${p})`, opacity: Math.min(0.9999, Math.max(0.0001, p)) }} />;
};

/** tag "Investasi gagal": pop lalu dicoret merah */
const TagGagal: React.FC<{ x: number; y: number; p: number; coret: number }> = ({ x, y, p, coret }) => {
  const col = mixHex(B.blue, CORET, coret);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white,
      border: `2.5px solid ${col}`, borderRadius: 999, padding: '6px 24px 6px 6px', fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night, whiteSpace: 'nowrap',
      boxShadow: `0 10px 24px -12px ${col}88` }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name="naikTurunHarga" size={26} color={B.white} /></div>
      Investasi gagal
      <div style={{ position: 'absolute', left: 16, top: '50%', height: 4, marginTop: -2, width: `calc(${coret} * (100% - 32px))`, background: CORET, borderRadius: 2 }} />
    </div>);
};

/* ════════════════ kartu "Diterima" di bawah murid ════════════════ */
const kuponTiba = (f: number) => T_KUPON.reduce((s, t) => s + R(f, t + 30 + TERBANG_KUPON - 12, t + 30 + TERBANG_KUPON, 0, 1, io), 0);
const T_POKOK_TIBA = kembali + 30;
const KartuDiterima: React.FC<{ f: number }> = ({ f }) => {
  const p = popIn(f, menerima);
  if (p <= 0.001) return null;
  const nK = kuponTiba(f);
  const tumbuh = R(f, pokok + 5, pokok + 45, 0, 1, io);
  const h = lerp(TERIMA.h0, TERIMA.h1, tumbuh);
  const pokokRp = POKOK_RP * R(f, T_POKOK_TIBA - 16, T_POKOK_TIBA + 14, 0, 1, io);
  const cekKupon = R(f, kupon3 - 20, kupon3 + 20, 0, 1, io), cekPokok = R(f, pokok3 - 20, pokok3 + 20, 0, 1, io);
  const baris = (label: string, nilai: string, cek: number, top: number, op = 1) => (
    <div style={{ position: 'absolute', left: 22, right: 22, top, display: 'flex', alignItems: 'center', gap: 10, opacity: op < 1 ? Math.max(0.0001, op) : undefined, fontFamily: F }}>
      <span style={{ fontSize: 24, fontWeight: 700, color: B.gray, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 800, color: B.night, fontVariantNumeric: 'tabular-nums', display: 'inline-block', transform: HALUS3D }}>{nilai}</span>
      <div style={{ width: 30 * cek, height: 30, borderRadius: '50%', background: ARAH.naik, display: 'grid', placeItems: 'center', overflow: 'hidden', opacity: Math.max(0.0001, cek),
        transform: `scale(${cek})` }}><Icon name="tersedia" size={20} color={B.white} /></div>
    </div>);
  return (
    <Kaca x={TERIMA.x} y={TERIMA.top + h / 2} w={TERIMA.w} h={h} p={p} warna={B.orange} tab="kiri" tabTebal={10} radius={24}>
      <div style={{ position: 'absolute', left: 22, top: 16, fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night }}>Diterima</div>
      {baris('Kupon', rpPenuh(Math.round(nK * KUPON_RP / 100_000) * 100_000), cekKupon, 64)}
      {tumbuh > 0.001 ? baris('Pokok', rpPenuh(Math.round(pokokRp / 1_000_000) * 1_000_000), cekPokok, 126, tumbuh) : null}
    </Kaca>);
};

/** kupon (6×) dan pokok terbang ke kartu "Diterima" */
const Terbang: React.FC<{ f: number }> = ({ f }) => (
  <>
    {T_KUPON.map((t, k) => {
      const a = t + 30, b = a + TERBANG_KUPON;
      if (f < a || f >= b) return null;
      const s = R(f, a, b, 0, 1, io);
      // mendarat di MURID ("kita menerima kupon") lalu angka kartu "Diterima" bertambah — dulu di atas teks kartu (audit 16 Okt f10230–10290)
      const dari = { x: KL + xTick(k + 1), y: ktAt(f) + hKartu(f) - SUMBU.dariBawah - 52 }, ke = { x: ORANG.x + 20, y: ORANG.y + 40 };
      // lengkung TURUN 40 px: lewat di antara kepala kartu & label sumbu (lengkung naik 90 melintasi teks kepala, audit 16 Okt f10230)
      const x = lerp(dari.x, ke.x, s), y = lerp(dari.y, ke.y, s) + Math.sin(Math.PI * s) * 60;
      return <ChipKupon key={k} x={x} y={y} p={0.99996} s={lerp(1, 0.6, s) * (1 - R(s, 0.85, 1, 0, 0.35))} />;
    })}
    {(() => {
      const a = dibayarkan, b = T_POKOK_TIBA;
      if (f < a || f >= b) return null;
      const s = R(f, a, b, 0, 1, io);
      const dari = { x: KL + SUMBU.x1, y: ktAt(f) + hKartu(f) - SUMBU.dariBawah - 70 }, ke = { x: ORANG.x + 20, y: ORANG.y + 50 };
      return <Uang x={lerp(dari.x, ke.x, s)} y={lerp(dari.y, ke.y, s) + Math.sin(Math.PI * s) * 40} w={lerp(130, 70, s)} p={0.99996 * (1 - R(s, 0.85, 1, 0, 0.6))} />;
    })()}
  </>);

/* ════════════════ benda ════════════════ */
/** cakram biru (warna bab Obligasi) + foto sertifikat obligasi (realistis Video 3); foto 0 = ikon bab (serah-terima dari simpul peta) */
const RASIO_SERT = 1000 / 864;
const CakramSertifikat: React.FC<{ x: number; y: number; d: number; foto: number }> = ({ x, y, d, foto }) => {
  const w = 1.1 * d, h = w / RASIO_SERT;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: geser(x, y) }}>
      <div style={{ position: 'absolute', left: -85, top: -85, width: 170, height: 170, transform: `scale(${d / 170})` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: d < 90 ? '28%' : '50%', background: B.blue, display: 'grid', placeItems: 'center', transform: 'scale(0.99996)',
          boxShadow: `0 18px 40px -12px ${B.blue}aa` }}>
          {foto < 0.999 ? <div style={{ opacity: Math.max(0.0001, 1 - foto), display: 'grid' }}><Icon name="obligasi" size={96} color={B.white} /></div> : null}
        </div>
      </div>
      {foto > 0.001 ? <Img src={staticFile('media/realistis/obligasi-pemerintah.webp')} style={{ position: 'absolute', left: -w / 2, top: -h / 2 - 0.06 * d, width: w, height: h, maxWidth: 'none',
        opacity: Math.min(0.9999, foto) }} /> : null}
    </div>);
};

/** pil nominal di bawah label obligasi */
const NominalPil: React.FC<{ x: number; y: number; p: number; teks: string }> = ({ x, y, p, teks }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, padding: '8px 20px', borderRadius: 999, background: rgba(B.blue, 0.1),
    fontFamily: F, fontSize: 26, fontWeight: 800, color: mixHex(B.blue, B.night, 0.3), whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{teks}</div>);

/** label di bawah benda (aturan Simon: label selalu di bawah) */
const LabelBawah: React.FC<{ x: number; top: number; f: number; at: number; teks: string }> = ({ x, top, f, at, teks }) => (
  <div style={{ position: 'absolute', left: x - 160, width: 320, top, textAlign: 'center' }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);

export type _K = KunciIkon;
export const S06_BEAT = { obligasi, memahaminya, kita, meminjamkan, uang, pemerintah, perusahaan, imbalannya, menerima, kupon, tempo, pokok, dibayarkan, kembali,
  tapi, harga, pasar, turun, volatilitas, harga2, tengah, berubah, dipegang, tempo3, kupon3, pokok3, jadi, naikTurun, gagal };
