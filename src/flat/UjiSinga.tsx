import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { B, F } from '../theme';
import { ACUAN_SINGA, POSE_DIAM_SINGA, SingaRig, gayaSinga, poseSinga, simulasiSinga } from './rigSinga';

/** UJI RIG SINGA (26 Okt malam): kiri atas = pose dasar (gambar Simon apa adanya) + kerangka; tiga lintasan = gallop pada laju berbeda,
 * tanah bergerak sejauh laju (telapak menapak harus diam terhadap garis-garis tanah). Laju dalam satuan file/frame (adegan: s 0,465 →
 * 8,43 px/f = 18,1 · 18 px/f = 38,7). */
export const UJI_SINGA = 600;
const LAJU = [{ V: 18.1, judul: 'GALLOP — laju kelompok (8,4 px/f di adegan)' }, { V: 38.7, judul: 'GALLOP CEPAT — mengejar (18 px/f di adegan)' },
  { V: 7, judul: 'MELAMBAT (3,3 px/f di adegan)' }];
const N_SIM = UJI_SINGA + 10;
const JEJAK = (s: number) => LAJU.map((l) => simulasiSinga(N_SIM, () => l.V * s, s, 0));
const S_UJI = 0.4;
const SIM = JEJAK(S_UJI);
const Lintasan: React.FC<{ f: number; k: number; x: number; tanah: number; guide: boolean }> = ({ f, k, x, tanah, guide }) => {
  const j = SIM[k], X = j.X[f], jarak = 60, span = 22 * jarak, g = gayaSinga(LAJU[k].V);
  return (
    <g>
      <line x1={x - 40} x2={x - 40 + span} y1={tanah} y2={tanah} stroke={B.grayLite} strokeWidth={3} />
      {Array.from({ length: 22 }, (_, i) => {
        const gx = x - 40 + ((((i * jarak - X) % span) + span) % span);
        return <line key={i} x1={gx} x2={gx} y1={tanah} y2={tanah + 14} stroke={B.gray} strokeWidth={3} />;
      })}
      <SingaRig pose={poseSinga(j, f)} x={x} tanah={tanah} s={S_UJI} guide={guide} />
      <text x={x + span - 40} y={tanah - 300} textAnchor="end" fontFamily={F} fontSize={22} fontWeight={800} fill={B.night}>{LAJU[k].judul}</text>
      <text x={x + span - 40} y={tanah - 274} textAnchor="end" fontFamily={F} fontSize={17} fontWeight={600} fill={B.gray}>
        1 siklus = {g.N.toFixed(1)} frame · langkah menapak {g.D.toFixed(0)} satuan · menapak {(g.beta * 100).toFixed(0)} % · fase {(j.psi[f] % 1).toFixed(2)}</text>
    </g>);
};
export const UjiSinga: React.FC<{ guide?: boolean }> = ({ guide = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        <SingaRig pose={POSE_DIAM_SINGA()} x={20} tanah={330} s={0.36} guide />
        <text x={24} y={40} fontFamily={F} fontSize={24} fontWeight={800} fill={B.night}>Pose dasar (Singa.svg) + kerangka</text>
        <line x1={380} x2={380} y1={20} y2={1060} stroke={B.grayLite} strokeWidth={2} />
        {LAJU.map((_, k) => <Lintasan key={k} f={f} k={k} x={460} tanah={330 + k * 360} guide={guide} />)}
      </svg>
    </AbsoluteFill>);
};
export const UJI_SINGA_ACUAN = ACUAN_SINGA;

/** LEMBAR 8 FASE (uji): satu siklus gallop dipotong tiap 1/8 — pose & kerangka berdampingan, garis tanah putus-putus */
export const LembarSinga: React.FC<{ V: number }> = ({ V }) => {
  const s = 0.42, j = simulasiSinga(400, () => V * s, s, 0);
  const t0 = 200, g = gayaSinga(V);
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        <text x={30} y={46} fontFamily={F} fontSize={26} fontWeight={800} fill={B.night}>Satu siklus gallop · laju {V} satuan/f · {g.N.toFixed(1)} frame · menapak {(g.beta * 100).toFixed(0)} %</text>
        {Array.from({ length: 8 }, (_, k) => {
          const q = Math.ceil(j.psi[t0]) + k / 8;
          let t = t0; while (j.psi[t + 1] < q) t++;
          const tt = t + (q - j.psi[t]) / (j.psi[t + 1] - j.psi[t]);
          const x = 40 + (k % 4) * 470, tanah = 470 + Math.floor(k / 4) * 500;
          return (
            <g key={k}>
              <SingaRig pose={poseSinga(j, tt)} x={x} tanah={tanah} s={s} guide />
              <text x={x + 10} y={tanah - 360} fontFamily={F} fontSize={22} fontWeight={800} fill={B.blue}>fase {(k / 8).toFixed(3)}</text>
            </g>);
        })}
      </svg>
    </AbsoluteFill>);
};

/** BANDING REFERENSI (27 Okt): frame referensi Simon (kiri, grid) vs singa rig pada fase yang sama (kanan) — 6 pasang per halaman.
 * Fase rig ψ = (k − 6)/12 (kaki belakang mendarat di frame referensi 6 = ψ 0). Laju gallop penuh 38,7 satuan/f. */
export const BandingSinga: React.FC<{ halaman: 0 | 1 }> = ({ halaman }) => {
  const s = 0.27, V = 38.7, j = simulasiSinga(400, () => V * s, s, 0), t0 = 200;
  const SEL = [[0, 20, 200], [375, 20, 200], [750, 20, 200], [1125, 20, 200], [0, 250, 440], [375, 250, 440], [750, 250, 440], [1125, 250, 440],
    [0, 480, 670], [375, 480, 670], [750, 480, 670], [1125, 480, 670]];
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        <defs>{SEL.map(([x, y0, y1], k) => <clipPath key={k} id={`ref${k}`}><rect x={x} y={y0} width={375} height={y1 - y0} /></clipPath>)}</defs>
        {Array.from({ length: 6 }, (_, i) => {
          const k = halaman * 6 + i, [rx, ry0] = SEL[k], gx = (i % 2) * 960, gy = Math.floor(i / 2) * 355 + 20, K = 1.15;
          const q = Math.ceil(j.psi[t0]) + (((k + 1 - 6) / 12) % 1 + 1) % 1;
          let t = t0; while (j.psi[t + 1] < q) t++;
          const tt = t + (q - j.psi[t]) / (j.psi[t + 1] - j.psi[t]);
          return (
            <g key={k}>
              <g transform={`translate(${gx + 10} ${gy}) scale(${K}) translate(${-rx} ${-ry0})`}>
                <image href={staticFile('uji/ref-singa-lari.png')} x={0} y={0} width={1500} height={811} clipPath={`url(#ref${k})`} />
              </g>
              {Array.from({ length: 9 }, (_, g) => <line key={g} x1={gx + 460} x2={gx + 950} y1={gy + g * 37} y2={gy + g * 37} stroke="#F3D5D5" strokeWidth={1} />)}
              <SingaRig pose={poseSinga(j, tt)} x={gx + 470} tanah={gy + 270} s={s} guide />
              <text x={gx + 14} y={gy + 330} fontFamily={F} fontSize={18} fontWeight={800} fill={B.blue}>referensi frame {k + 1} · rig ψ {(((k + 1 - 6) / 12) % 1 + 1) % 1 === 0 ? '0' : ((((k + 1 - 6) / 12) % 1 + 1) % 1).toFixed(2)}</text>
            </g>);
        })}
      </svg>
    </AbsoluteFill>);
};
