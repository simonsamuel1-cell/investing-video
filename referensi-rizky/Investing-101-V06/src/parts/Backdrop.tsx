import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ramp } from '../core/motion';
import { HUES } from '../plan';
import { H, HOUSE, W, mixHex } from '../theme';

/**
 * LATAR RUMAH — salinan `Backdrop` Video 08 v4 / Investing 101 V02–V03 (gaya rumah yang Simon setujui 28 Sep):
 * delapan lingkaran blur warna brand (susunan ST-02), hanyut sangat pelan, lapisan dasar
 * bernuansa. Rona berganti per scene (plan.ts) — 60f dipusatkan di batas.
 * Gradien radial berprofil erfc, BUKAN filter blur: filter memaksa raster ulang tiap frame.
 *
 * VIDEO 06 (Simon 23 Okt: "untuk warna backgroundnya kamu bisa gunakan warna yang ada divideo 2 dan 3" + "dengan gaya video 5 yang lama (sebelum
 * revisi terakhir)") = latar Video 05 19 Okt ini apa adanya (diambil dari jalur-investor-episode/_arsip/relayout-22okt/sebelum-latar-v04).
 *
 * VIDEO 05 (Simon 19 Okt: "gaya backgroundnya seperti di video 2 dan 3" + "dengan tambahan grid seperti di video 9" +
 * 4 contoh "kurang lebih nanti jadinya seperti ini" — `_referensi/layout-episode-berikutnya-2026-10-19/latar-hasil-01..04`):
 *   · SUDUT: gradien diagonal 135° — sudut kiri-atas lebih pekat (tint TERANG warna brand), tengah = rona rumah penuh, kanan-bawah putih.
 *   · KISI: garis PUTIH 2 px, petak 84 px (= Video 09, terukur dari render), garis lewat pusat layar (960, 540);
 *     hanya di blok tengah, memudar radial ke luar (contoh 01–03). Diam (tanpa kamera). Tetap di belakang isi & subtitle.
 */
const BOLA = [
  { x: -2, y: 14, r: 58, k: 1.0 }, { x: 16, y: 40, r: 30, k: 0.55 }, { x: 8, y: 90, r: 46, k: 0.92 },
  { x: 101, y: 26, r: 53, k: 1.0 }, { x: 86, y: 66, r: 26, k: 0.48 }, { x: 96, y: 97, r: 54, k: 0.85 },
  { x: 38, y: -8, r: 36, k: 0.3 }, { x: 62, y: 106, r: 42, k: 0.32 },
];
const DORONG = 1.12;
const SUSUT = 0.9;
const dorong = (v: number) => 50 + (v - 50) * DORONG;
const HANYUT = [
  { ax: 5.5, ay: 6.0, px: 3100, py: 2600, ph: 0.0 }, { ax: 4.0, ay: 5.0, px: 2300, py: 3500, ph: 1.3 },
  { ax: 5.0, ay: 4.5, px: 3600, py: 2900, ph: 2.1 }, { ax: 5.5, ay: 5.5, px: 2700, py: 3300, ph: 3.4 },
  { ax: 4.0, ay: 5.0, px: 3400, py: 2400, ph: 4.2 }, { ax: 5.0, ay: 4.0, px: 2900, py: 3700, ph: 5.0 },
  { ax: 6.0, ay: 3.0, px: 3300, py: 2800, ph: 0.7 }, { ax: 6.0, ay: 3.0, px: 2500, py: 3100, ph: 2.8 },
];
const SIGMA = 130;
const erfc = (x: number) => {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * z);
  const y = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-z * z);
  return x >= 0 ? y : 2 - y;
};
const STOPS = [-2.2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2.2];
const profil = (Rr: number) => {
  const pusat = 1 - Math.exp(-(Rr * Rr) / (2 * SIGMA * SIGMA));
  const Rt = Rr + 2.2 * SIGMA;
  const titik = [{ p: 0, a: pusat }];
  for (const s of STOPS) {
    const rho = Rr + s * SIGMA;
    if (rho <= 0) continue;
    titik.push({ p: rho / Rt, a: Math.min(pusat, 0.5 * erfc((rho - Rr) / (SIGMA * Math.SQRT2))) });
  }
  titik.push({ p: 1, a: 0 });
  return { Rt, titik };
};
const PROFIL = BOLA.map((b) => {
  const rx = ((b.r * SUSUT) / 100) * W / 2;
  const ry = ((b.r * SUSUT) / 100) * H / 2;
  return { rx, ry, ...profil((rx + ry) / 2) };
});
const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** sudut pekat per rona rumah = tint TERANG warna brand (blueLite / turqLite / orangeLite) dicampur putih */
const SUDUT: Record<string, string> = {
  [HOUSE.ungu]: mixHex('#FFFFFF', '#8F83F4', 0.62),
  [HOUSE.biru]: mixHex('#FFFFFF', '#9BDDEE', 0.85),
  [HOUSE.krim]: mixHex('#FFFFFF', '#EFBE73', 0.8),
};
/** TENGAH (titik 48 % gradien) = rona rumah digeser ke tint brand-nya — contoh Simon bertengah lebih pekat dari rona pastel V02/V03 */
const TENGAH: Record<string, string> = {
  [HOUSE.ungu]: mixHex(HOUSE.ungu, '#8F83F4', 0.28),
  [HOUSE.biru]: mixHex(HOUSE.biru, '#9BDDEE', 0.45),
  [HOUSE.krim]: mixHex(HOUSE.krim, '#EFBE73', 0.4),
};
/** KISI (Video 09): petak 84 px, garis 2 px putih; blok tengah memudar radial */
export const KISI = { petak: 84, garis: 2, alfa: 0.95, rx: 820, ry: 470, cy: 520, padat: 0.38 };

/** rona rumah + rona sudut pada frame f (berganti bersama, ramp yang sama) */
const ronaAt = (f: number) => {
  let hue = HUES[0].hue;
  let sudut = SUDUT[HUES[0].hue];
  let tengah = TENGAH[HUES[0].hue];
  for (let i = 1; i < HUES.length; i++) {
    const t = HUES[i].instan ? (f >= HUES[i].at ? 1 : 0) : ramp(f, HUES[i].at);
    hue = mixHex(hue, HUES[i].hue, t);
    sudut = mixHex(sudut, SUDUT[HUES[i].hue], t);
    tengah = mixHex(tengah, TENGAH[HUES[i].hue], t);
  }
  return { hue, sudut, tengah };
};

export const hueAt = (f: number) => {
  let hue = HUES[0].hue;
  for (let i = 1; i < HUES.length; i++) hue = HUES[i].instan ? (f >= HUES[i].at ? HUES[i].hue : hue) : mixHex(hue, HUES[i].hue, ramp(f, HUES[i].at));
  return hue;
};

/** `hue` = rona paksa (mis. Scene 01 adegan pertanyaan berona krim — Simon 8 Okt: latar berganti saat masuk adegan lewat masker) */
export const Backdrop: React.FC<{ f: number; hue?: string }> = ({ f, hue }) => {
  const rona = ronaAt(f);
  const pakai = hue ?? rona.hue;
  const sudut = hue ? (SUDUT[hue] ?? rona.sudut) : rona.sudut;
  const tengah = hue ? (TENGAH[hue] ?? rona.tengah) : rona.tengah;
  const [hr, hg, hb] = rgb(pakai);
  const kb = HOUSE.bgBase;
  const dasar = `rgb(${[hr, hg, hb].map((v) => Math.round(255 + (v - 255) * kb)).join(',')})`;
  // garis kisi lewat pusat layar: offset = sisa 960 / 540 terhadap petak
  const ox = 960 % KISI.petak - KISI.garis / 2, oy = 540 % KISI.petak - KISI.garis / 2;
  const garis = `rgba(255,255,255,${KISI.alfa})`;
  return (
    <AbsoluteFill style={{ background: dasar }}>
      {/* SUDUT diagonal: kiri-atas pekat → tengah rona rumah penuh → kanan-bawah putih (contoh latar-hasil-01..03) */}
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${sudut} 0%, ${tengah} 48%, rgba(255,255,255,0.92) 100%)` }} />
      <AbsoluteFill style={{ opacity: HOUSE.bgOp, overflow: 'hidden' }}>
        {BOLA.map((b, i) => {
          const d = HANYUT[i];
          const P = PROFIL[i];
          const cx = ((dorong(b.x) + d.ax * Math.sin((2 * Math.PI * f) / d.px + d.ph)) / 100) * W;
          const cy = ((dorong(b.y) + d.ay * Math.cos((2 * Math.PI * f) / d.py + d.ph)) / 100) * H;
          const c = [hr, hg, hb].map((v) => Math.round(255 + (v - 255) * b.k));
          const skala = P.Rt / ((P.rx + P.ry) / 2);
          const Rx = P.rx * skala, Ry = P.ry * skala;
          const stops = P.titik.map((t) => `rgba(${c[0]},${c[1]},${c[2]},${t.a.toFixed(4)}) ${(t.p * 100).toFixed(2)}%`).join(', ');
          return (
            <div key={i} style={{
              position: 'absolute', left: cx - Rx, top: cy - Ry, width: Rx * 2, height: Ry * 2,
              background: `radial-gradient(closest-side, ${stops})`,
            }} />
          );
        })}
      </AbsoluteFill>
      {/* KISI putih, blok tengah memudar radial (Video 09 + contoh Simon) */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(to right, ${garis} ${KISI.garis}px, transparent ${KISI.garis}px), linear-gradient(to bottom, ${garis} ${KISI.garis}px, transparent ${KISI.garis}px)`,
        backgroundSize: `${KISI.petak}px ${KISI.petak}px`,
        backgroundPosition: `${ox}px ${oy}px`,
        WebkitMaskImage: `radial-gradient(${KISI.rx}px ${KISI.ry}px at 960px ${KISI.cy}px, #000 ${KISI.padat * 100}%, transparent 100%)`,
        maskImage: `radial-gradient(${KISI.rx}px ${KISI.ry}px at 960px ${KISI.cy}px, #000 ${KISI.padat * 100}%, transparent 100%)`,
      }} />
    </AbsoluteFill>
  );
};
