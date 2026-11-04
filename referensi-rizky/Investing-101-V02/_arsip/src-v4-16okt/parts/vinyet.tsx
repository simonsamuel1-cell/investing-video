import React from 'react';
import { STUDIO, kebalikanIsi } from '../kamera';
import { AbsoluteFill } from 'remotion';
import { B, R, io } from '../theme';
import { MODE_UKUR, glass, lerp } from './kit';
import { Backdrop } from './Backdrop';

/**
 * ADEGAN TAMBAHAN (Simon 7 Okt: "yang aku maksud adalah adegan tambahan … tidak menambahkan text"): sebuah simpul diagram
 * MEMBUKA jadi panel ilustrasi lewat MASKER LINGKARAN (gema transisi chart → kartu Return Scene 01), lalu MENUTUP lagi ke
 * sebuah simpul (boleh simpul lain). Diagram di belakang diredupkan oleh pemanggil memakai `redupVinyet`.
 * Panel = wilayah aman di bawah judul TEXT (judul tetap terbaca).
 */
export const PANEL_V = { x: 240, y: 190, w: 1440, h: 720 };
const PUSAT_V = { x: PANEL_V.x + PANEL_V.w / 2, y: PANEL_V.y + PANEL_V.h / 2 };
const R_PENUH = Math.hypot(PANEL_V.w / 2, PANEL_V.h / 2) + 24;
export const BUKA_D = 50;
/** ukuran latar sisipan dalam px DUNIA (mutlak). Kamera kini CSS `zoom`: `inset: 0` / 100 % di dalam wadah ber-zoom = ukuran LAYAR
 *  (1920/z px dunia), lalu `scale(1/z)` menyusutkannya lagi → latar hanya menutup 1/z layar (terukur S05 V4 f2190: kotak 1422 × 800 di
 *  pojok kiri-atas, diagram tembus di kanan & bawah). Ukuran mutlak ikut di-zoom → 1920·z, dibalik `scale(1/z)` → tepat selayar. */
const LAYAR: React.CSSProperties = { width: 1920, height: 1080, right: 'auto', bottom: 'auto' };

export type Titik = { x: number; y: number; r: number };
/** 0 → 1 → 0: seberapa terbuka vinyet (untuk meredupkan diagram di belakangnya) */
export const redupVinyet = (f: number, buka: number, tutup?: number) =>
  R(f, buka, buka + BUKA_D, 0, 1, io) * (tutup === undefined ? 1 : 1 - R(f, tutup, tutup + BUKA_D, 0, 1, io));

/**
 * `latar` (Simon 8 Okt: "karena kamu menggunakan transisi masking aku mau kamu mengganti warna backgroundnya … ketika kembali, warna
 * backgroundnya jadi ungu lagi (karena background birunya dimasking), seperti scene 1 adegan berpikir"): masker membuka ke SELURUH
 * LAYAR berisi latar rona lain (tanpa panel putih); saat menutup, latar adegan tersingkap kembali. `kam` = geser kamera wadah (latar
 * digambar di ruang LAYAR). Tanpa `latar` = panel putih lama (scene yang belum diberi brief).
 */
/** transform MASKER KELUAR scene (translate d lalu scale s, berporos di tengah layar) — lihat `keluar` */
export type Keluar = { dx: number; dy: number; s: number };
/** kebalikan transform masker keluar (poros 960, 540): T⁻¹ = translate(M0) · scale(1/s) · translate(−M0 − d) — transform-origin 0 0 */
const balik = (k?: Keluar) => (!k || k.s >= 0.9999 && k.dx === 0 && k.dy === 0 ? '' : ` translate(960px, 540px) scale(${1 / k.s}) translate(${-960 - k.dx}px, ${-540 - k.dy}px)`);
export const Vinyet: React.FC<{ f: number; dari: Titik; ke?: Titik; buka: number; tutup?: number; col?: string; latar?: string; kam?: { x: number; y: number; z?: number };
  /** Simon 8 Okt "ada area putih pada transisi": saat isi scene MENYUSUT ke simpul peta berikutnya (masker keluar), latar penuh sisipan
   *  ikut mengecil → isian putih di belakangnya terlihat di atas & bawah lingkaran. Dengan `keluar` latar dibalik-transform supaya
   *  tetap memenuhi layar dan diam; hanya isinya yang mengecil. */
  keluar?: Keluar; children: React.ReactNode }> =
  ({ f, dari, ke, buka, tutup, col = B.blue, latar, kam = { x: 0, y: 0 }, keluar, children }) => {
    const o = R(f, buka, buka + BUKA_D, 0, 1, io);
    const c = tutup === undefined ? 0 : R(f, tutup, tutup + BUKA_D, 0, 1, io);
    if (o <= 0 || c >= 1) return null;
    const tujuan = ke ?? dari;
    // mode latar: pusat = tengah LAYAR (di ruang kamera), jari-jari = sampai sudut layar terjauh
    const P = latar ? { x: 960 - kam.x, y: 540 - kam.y } : PUSAT_V;
    const RP = latar ? Math.hypot(960 + Math.abs(kam.x), 540 + Math.abs(kam.y)) + 24 : R_PENUH;
    // fase buka: simpul → panel/layar; fase tutup: panel/layar → simpul tujuan
    const m = c > 0
      ? { x: lerp(P.x, tujuan.x, c), y: lerp(P.y, tujuan.y, c), r: lerp(RP, tujuan.r, c) }
      : { x: lerp(dari.x, P.x, o), y: lerp(dari.y, P.y, o), r: lerp(dari.r, RP, o) };
    const terbuka = o * (1 - c);
    // cakram panel memudar masuk di awal buka & keluar di akhir tutup (15f): dulu menutup/menyingkap simpul dalam 1 frame
    // (pemindai jeglek: lonjakan di frame buka pertama & tutup terakhir)
    const muka = R(f, buka, buka + 15, 0, 1, io) * (tutup === undefined ? 1 : 1 - R(f, tutup + BUKA_D - 15, tutup + BUKA_D, 0, 1, io));
    const sIsi = lerp(0.9, 1, terbuka); // isi sedikit membesar saat membuka (kedalaman)
    // tepi lingkaran: tanjakan WAKTU sendiri (inOut cubic), bukan remap progres yang sudah di-ease
    const tw = (t0: number, a: number, b: number) => R(f, t0 + a * BUKA_D, t0 + b * BUKA_D, 0, 1, io);
    const cincin = Math.min(tw(buka, 0.02, 0.2), 1 - tw(buka, 0.85, 1)) + (tutup === undefined ? 0 : Math.min(tw(tutup, 0, 0.18), 1 - tw(tutup, 0.8, 0.98)));
    return (
      <>
        <div style={{ position: 'absolute', inset: 0, clipPath: `circle(${m.r}px at ${m.x}px ${m.y}px)`, opacity: muka }}>{/* pudar 15f di awal buka & akhir tutup (juga mode latar: dulu cakram berwarna menutupi simpul dalam 1 frame — jeglek terukur) */}
          {latar
            ? MODE_UKUR ? <AbsoluteFill style={{ ...LAYAR, background: '#00FF00', transform: `${kebalikanIsi(kam)}${balik(keluar)}`, transformOrigin: '0 0' }} /> /* mode ukur kamera: latar = warna kunci (menutup diagram, bukan tinta) */ : <AbsoluteFill style={{ ...LAYAR, transform: `${kebalikanIsi(kam)} rotate(0.001deg)${balik(keluar)}`, transformOrigin: '0 0' }}><Backdrop f={f} hue={latar} /></AbsoluteFill>
            : <div style={{ position: 'absolute', left: PANEL_V.x, top: PANEL_V.y, width: PANEL_V.w, height: PANEL_V.h, ...glass(col), background: B.white }} />} {/* putih PENUH: diagram di belakang tidak tembus (94% masih memperlihatkan labelnya) */}
          {/* STUDIO: selama masker membuka/menutup isi berskala → skala raster dikunci (tanpa ini Chrome meraster ulang tiap frame: Studio
              tersendat 93–117 ms saat sisipan S05 V1 membuka, terukur studio_fps.mjs). Kunci menutup dinyalakan 30f lebih awal (layar masih
              diam) — menyalakannya tepat saat bergerak memicu satu raster ulang yang terlihat. Render tidak terpengaruh. */}
          <AbsoluteFill style={{ transform: `scale(${sIsi})`, transformOrigin: `${P.x}px ${P.y}px`, ...(STUDIO && (o < 1 || (tutup !== undefined && f >= tutup - 30)) ? { willChange: 'transform' } : {}) }}>{children}</AbsoluteFill>
        </div>
        {cincin > 0.001 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: Math.min(1, cincin) * muka }}>
            <circle cx={m.x} cy={m.y} r={Math.max(0, m.r - 2)} fill="none" stroke={col} strokeWidth={5} />
          </svg>) : null}
      </>);
  };
