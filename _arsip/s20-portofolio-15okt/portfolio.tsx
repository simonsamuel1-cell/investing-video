import React from 'react';
import { Img, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { ARAH, B, rgba } from '../theme';
import type { KunciUi } from './ikonUi';
import { geser } from './kaca';

/**
 * LAYAR PORTFOLIO APLIKASI TUNTUN.
 * Simon 15 Okt (screenshot baru, aplikasi versi terang berbahasa Indonesia — 04_Asset/realistis-simon/portfolio-id/55–57): "aku mau kamu hanya regenerate
 * bagian isi portfolionya, dan menambahkan total asset" → SCREENSHOT DIPAKAI UTUH sebagai layar; yang dibuat ulang hanya:
 *   · angka Total Aset ("1" → total) dan angka Total Investasi tiap tab ("0" → nilainya) — ditambal warna latarnya lalu ditulis ulang
 *   · isi portofolio (area keadaan kosong y 800–1795) → daftar aset bergaya baris Watchlist aplikasi (54.webp): logo BULAT Ø77, ticker 34 px,
 *     nama 28 px abu, nilai & untung di kanan, garis pemisah 2 px. "logo saham, dllnya dibuat bulat bukan kotak".
 * Tiga tab = tiga screenshot (Saham · Reksa Dana · Obligasi): pindah tab = screenshot silang-pudar (label tab & garis bawahnya), isi bergeser
 * seperti geser-layar. Huruf tambahan = huruf sistem (SF, sama dengan aplikasi). Koordinat = layar asli 924 × 2000, diskalakan `s`.
 */
export const LAYAR = { w: 924, h: 2000 };
const LAYAR_ID = ['media/portfolio/saham.webp', 'media/portfolio/reksadana.webp', 'media/portfolio/obligasi.webp'];
/** x kiri angka "0" Total Investasi tiap screenshot (terukur: 487 · 569 · 510; tinggi digit y 747–768) */
const NOL_X = [487, 569, 510];
/** kotak label tab untuk sorot "tiga jenis uang … disusun terpisah" (terukur dari screenshot) */
const LABEL_TAB = [{ x0: 40, x1: 155 }, { x0: 183, x1: 378 }, { x0: 407, x1: 543 }];
const SISTEM = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif';
const TEKS = '#1D1D1F', ABU = '#8A8A8E', GARIS = '#F0F0F2', UNGU = '#6A4CF5';
/** baris isi (gaya Watchlist): mulai y 800, tinggi 136 */
export const BARIS_ISI = { y0: 800, h: 136 };

/** logo BULAT: `penuh` = logo persegi berlatar warna (BRI, Telkom) diisi penuh · `muat` = tanda di tengah lingkaran berlatar `latar` */
export type BarisPortfolio = { nama: string; jenis: string; nilai: string; untung: string; turun?: boolean; gambar?: string; lencana?: string;
  logo?: { src: string; isi: 'penuh' | 'muat'; latar?: string; skala?: number }; warna?: string; sorot?: number };
export type TabPortfolio = { judul: string; ikon: KunciUi; warnaIkon: string; diinvestasi: string; baris: BarisPortfolio[] };

const Bulat: React.FC<{ b: BarisPortfolio }> = ({ b }) => {
  const d = 77;
  const latar = b.logo?.latar ?? (b.logo?.isi === 'penuh' ? undefined : '#F1EFFE');
  return (
    <div style={{ position: 'absolute', left: 39, top: (BARIS_ISI.h - d) / 2, width: d, height: d, borderRadius: '50%', overflow: 'hidden', background: latar,
      display: 'grid', placeItems: 'center' }}>
      {b.logo ? (b.logo.isi === 'penuh'
        ? <Img src={staticFile(b.logo.src)} style={{ width: d, height: d, objectFit: 'cover' }} />
        : <Img src={staticFile(b.logo.src)} style={{ width: d * (b.logo.skala ?? 0.66), height: d * (b.logo.skala ?? 0.66), objectFit: 'contain' }} />)
        : b.gambar ? <Img src={staticFile(b.gambar)} style={{ width: d * 0.78, height: d * 0.78, objectFit: 'contain' }} /> : null}
    </div>);
};

/** layar berpusat (x, y), skala s; `p` = pop dari pusat. `atas`…`bawah` (koordinat layar asli) = bagian yang terlihat — zoom ke daftar aset
 *  memperkecil jendela ini sambil memperbesar s (jendela berpusat di (x, y)); `radius` = sudut jendela dalam px layar asli */
export const LayarPortfolio: React.FC<{ x: number; y: number; s: number; p: number; total: string; tabs: TabPortfolio[];
  /** perpindahan tab: dari → ke, e 0…1 (inOut sudah diterapkan pemanggil) */
  tab: { dari: number; ke: number; e: number };
  /** sorot label tab 0…1 per tab ("tiga jenis uang ini … disusun terpisah") */
  sorotTab?: number[];
  /** REKAMAN LAYAR aplikasi (Simon 15 Okt: RPReplay Saham/Investing Screener & Wealth/Obligasi) diputar DI ATAS layar portofolio, memenuhi layar:
   *  `dari` = frame mulai putar, `detik0` = detik awal di rekaman, `alfa` = silang-pudar dengan isi di bawahnya */
  rekaman?: { src: string; dari: number; detik0: number; alfa: number }[];
  /** GAMBAR HALAMAN PANJANG yang digulir (Simon 15 Okt: Wealth → Selection 402 × 2000 = 924 × 4597): `gulir` = px layar asli yang sudah digulir */
  halaman?: { src: string; tinggi: number; gulir: number; alfa: number };
  atas?: number; bawah?: number; radius?: number }> = ({ x, y, s, p, total, tabs, tab, sorotTab = [0, 0, 0], rekaman = [], halaman, atas = 0, bawah = LAYAR.h, radius = 96 }) => {
    if (p <= 0.001) return null;
    const tinggi = bawah - atas;
    const { dari, ke, e } = tab;
    const pindah = dari !== ke;
    const arah = Math.sign(ke - dari) || 1;
    // screenshot + tambalan angkanya (tiap tab utuh dalam satu wadah → silang-pudar konsisten)
    const dasar = (j: number, op: number) => (
      <div key={`d${j}`} style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: LAYAR.h, opacity: op < 1 ? Math.max(0.0001, op) : undefined }}>
        <Img src={staticFile(LAYAR_ID[j])} style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: LAYAR.h }} />
        {/* Total Aset: "1" (x 64–85, y 329–364) ditambal warna kartu lalu ditulis total */}
        <div style={{ position: 'absolute', left: 58, top: 320, width: 36, height: 54, background: '#F6F4FF' }} />
        <div style={{ position: 'absolute', left: 62, top: 346.5, transform: 'translateY(-52%)', fontFamily: SISTEM, fontSize: 50, fontWeight: 700, color: TEKS,
          lineHeight: 1, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{total}</div>
        {/* Total Investasi: "0" (tinggi digit y 747–768) ditambal putih lalu ditulis nilainya */}
        <div style={{ position: 'absolute', left: NOL_X[j] - 4, top: 738, width: 26, height: 40, background: '#FFFFFF' }} />
        <div style={{ position: 'absolute', left: NOL_X[j], top: 757.5, transform: 'translateY(-52%)', fontFamily: SISTEM, fontSize: 30, fontWeight: 700, color: TEKS,
          lineHeight: 1, whiteSpace: 'nowrap' }}>{tabs[j].diinvestasi}</div>
      </div>);
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: tinggi, transformOrigin: '0 0',
        transform: `${geser(x - (LAYAR.w * s * p) / 2, y - (tinggi * s * p) / 2)} scale(${s * p})`, borderRadius: radius, overflow: 'hidden', background: B.white,
        boxShadow: `0 60px 120px -50px ${rgba(B.blue, 0.55)}, 0 20px 50px -30px ${rgba(B.night, 0.35)}` }}>
        <div style={{ position: 'absolute', left: 0, top: -atas, width: LAYAR.w, height: LAYAR.h, background: B.white }}>
          {/* screenshot tab: tab lama penuh, tab baru memudar di atasnya */}
          {dasar(dari, 1)}
          {pindah && e > 0.001 ? dasar(ke, Math.min(1, e)) : null}

          {/* sorot label tab ("tiga jenis uang ini … disusun terpisah") */}
          {LABEL_TAB.map((t, j) => {
            const sr = sorotTab[j] ?? 0;
            return sr > 0.001 ? <div key={`s${j}`} style={{ position: 'absolute', left: t.x0 - 18, top: 630, width: t.x1 - t.x0 + 36, height: 64, borderRadius: 32,
              background: rgba(UNGU, 0.12 * sr), border: `3px solid ${rgba(UNGU, 0.5 * sr)}` }} /> : null;
          })}

          {/* ISI PORTOFOLIO (pengganti keadaan kosong): latar putih y 796–1795 (garis navigasi y 1796 tetap dari screenshot) */}
          <div style={{ position: 'absolute', left: 0, top: 796, width: LAYAR.w, height: 1795 - 796, overflow: 'hidden', background: B.white }}>
            {tabs.map((tb, j) => {
              const w = !pindah ? (j === ke ? 1 : 0) : j === dari || j === ke ? 1 : 0;
              if (w <= 0.001 || (pindah && ((j === dari && e >= 0.999) || (j === ke && e <= 0.001)))) return null;
              const dx = !pindah ? 0 : j === ke ? LAYAR.w * arah * (1 - e) : -LAYAR.w * arah * e;
              return (
                <div key={tb.judul} style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: 1000, transform: `translate3d(${dx}px, 0, 0) rotate(0.001deg)` }}>
                  {tb.baris.map((b, i) => {
                    const sorot = b.sorot ?? 0;
                    return (
                      <div key={b.nama} style={{ position: 'absolute', left: 0, top: BARIS_ISI.y0 - 796 + i * BARIS_ISI.h, width: LAYAR.w, height: BARIS_ISI.h,
                        background: sorot > 0.001 && b.warna ? rgba(b.warna, 0.1 * sorot) : undefined, fontFamily: SISTEM }}>
                        {b.warna ? <div style={{ position: 'absolute', left: 0, top: 18, width: 8, height: BARIS_ISI.h - 36, borderRadius: '0 6px 6px 0', background: b.warna,
                          opacity: Math.min(0.9999, Math.max(0.0001, sorot)) }} /> : null}
                        <Bulat b={b} />
                        <div style={{ position: 'absolute', left: 134, top: 32, fontSize: 34, fontWeight: 600, color: TEKS, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{b.nama}</div>
                        <div style={{ position: 'absolute', left: 133, top: 78, fontSize: 28, fontWeight: 400, color: ABU, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{b.jenis}</div>
                        <div style={{ position: 'absolute', right: 40, top: 32, fontSize: 32, fontWeight: 600, color: TEKS, lineHeight: 1.15, whiteSpace: 'nowrap',
                          fontVariantNumeric: 'tabular-nums' }}>{b.nilai}</div>
                        <div style={{ position: 'absolute', right: 40, top: 79, fontSize: 26, fontWeight: 500, color: b.turun ? ARAH.turun : ARAH.naik, lineHeight: 1.15,
                          whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{b.untung}</div>
                        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: GARIS }} />
                      </div>);
                  })}
                </div>);
            })}
          </div>

          {/* halaman panjang yang digulir (translate3d sub-piksel: gulir pelan tanpa langkah piksel bulat) */}
          {halaman && halaman.alfa > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: LAYAR.h, overflow: 'hidden', background: B.white,
              opacity: halaman.alfa < 0.999 ? halaman.alfa : undefined }}>
              <Img src={staticFile(halaman.src)} style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: halaman.tinggi,
                transform: `translate3d(0, ${-halaman.gulir}px, 0) rotate(0.001deg)` }} />
            </div>) : null}
          {/* rekaman layar (silang-pudar di atas layar portofolio; 886 × 1920 → 924 × 2000, rasio sama) */}
          {rekaman.map((r, k) => (r.alfa > 0.001 ? (
            <div key={`r${k}`} style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: LAYAR.h, background: B.white,
              opacity: r.alfa < 0.999 ? r.alfa : undefined }}>
              <Sequence from={r.dari} layout="none">
                <OffthreadVideo src={staticFile(r.src)} muted trimBefore={Math.round(r.detik0 * 60)} style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: LAYAR.h }} />
              </Sequence>
            </div>) : null))}
        </div>
      </div>);
  };
