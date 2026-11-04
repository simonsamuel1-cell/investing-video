import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { B, F } from '../theme';
import { GridChar, GuideChar, puncakKepala } from './GuideChar';
import { BERDIRI, JALAN_FRAME, LARI_FRAME, TEGAK_LURUS, TUNIK, TokohTegak, gaya, panjangSiklus, type Kepala } from './rigTegak';

/** UJI CHAR KELOMPOK RIG TEGAK (26 Okt malam, Simon: "Lanjut bangun char kelompok dengan rig tegak, satu per satu"). Badan = rig tegak tokoh
 * utama (guide, sendi sama besar), kulit = kulit kepala masing-masing, tunik berbeda, kepala rig Freepik lain (netral → kaget saat berlari).
 * Kiri: pose dasar di guide · berdiri netral · berdiri kaget · tokoh utama (pembanding ukuran, skala adegan). Kanan: jalan & lari di tempat. */
export const KELOMPOK_TEGAK = [
  { nama: 'Kelompok 1 — keriting', kepala: { set: 'keriting', eks: 'netral' }, kaget: { set: 'keriting', eks: 'kaget' }, s: 0.79, warna: TUNIK.oranye },
  { nama: 'Kelompok 2 — wanita', kepala: { set: 'wanita', eks: 'netral' }, kaget: { set: 'wanita', eks: 'kaget' }, s: 0.79, warna: TUNIK.krem },
  { nama: 'Kelompok 3 — ikal', kepala: { set: 'ikal', eks: 'netral' }, kaget: { set: 'ikal', eks: 'kaget' }, s: 0.79, warna: TUNIK.cokelat },
] as { nama: string; kepala: Kepala; kaget: Kepala; s: number; warna: { tunik: string; totol: string } }[];
export const UJI_KELOMPOK = 600;
const S_UTAMA = 0.82;
const Treadmill: React.FC<{ f: number; r: 0 | 1; N: number; x: number; tanah: number; s: number; judul: string; warna: string; kepala: Kepala; tunik: { tunik: string; totol: string } }> =
  ({ f, r, N, x, tanah, s, judul, warna, kepala, tunik }) => {
    const u = f / N, jalan = u * panjangSiklus(r) * s, jarak = 60;
    return (
      <g>
        <line x1={x - 330} x2={x + 330} y1={tanah} y2={tanah} stroke={B.grayLite} strokeWidth={3} />
        {Array.from({ length: 12 }, (_, k) => {
          const gx = x - 330 + ((((k * jarak - jalan) % (12 * jarak)) + 12 * jarak) % (12 * jarak));
          return gx > x + 330 ? null : <line key={k} x1={gx} x2={gx} y1={tanah} y2={tanah + 14} stroke={B.gray} strokeWidth={3} />;
        })}
        <TokohTegak x={x} tanah={tanah} s={s} pose={gaya(u, r, 1)} kepala={kepala} warna={tunik} />
        <text x={x - 330} y={tanah - 400} fontFamily={F} fontSize={26} fontWeight={800} fill={warna}>{judul}</text>
        <text x={x - 330} y={tanah - 370} fontFamily={F} fontSize={17} fontWeight={600} fill={B.gray}>1 siklus = {N.toFixed(0)} frame</text>
      </g>);
  };
export const UjiKelompokTegak: React.FC<{ k: number }> = ({ k }) => {
  const f = useCurrentFrame(), c = KELOMPOK_TEGAK[k];
  const S = 1.2, TANAH = 980;
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        <line x1={40} x2={1100} y1={TANAH} y2={TANAH} stroke={B.grayLite} strokeWidth={3} />
        <GridChar x={210} tanah={TANAH} s={S} x0={95} x1={290} y0={-10} y1={530} angka={false} />
        <TokohTegak x={210} tanah={TANAH} s={S} pose={TEGAK_LURUS} kepala={c.kepala} warna={c.warna} />
        <GuideChar x={210} tanah={TANAH} s={S} x0={95} x1={290} label={false} puncak={puncakKepala(c.kepala)} />
        <TokohTegak x={470} tanah={TANAH} s={S} pose={BERDIRI} kepala={c.kepala} warna={c.warna} />
        <TokohTegak x={720} tanah={TANAH} s={S} pose={BERDIRI} kepala={c.kaget} warna={c.warna} />
        <TokohTegak x={970} tanah={TANAH} s={(S * S_UTAMA) / c.s} pose={BERDIRI} />
        <text x={40} y={60} fontFamily={F} fontSize={30} fontWeight={800} fill={B.night}>{c.nama} · rig tegak</text>
        <text x={40} y={92} fontFamily={F} fontSize={17} fontWeight={600} fill={B.gray}>
          pose dasar di guide · berdiri · berdiri kaget · tokoh utama (ukuran relatif sama dengan di adegan: {c.s} vs {S_UTAMA})</text>
        <line x1={1130} x2={1130} y1={30} y2={1050} stroke={B.grayLite} strokeWidth={2} />
        <Treadmill f={f} r={0} N={JALAN_FRAME} x={1520} tanah={500} s={c.s} judul="JALAN" warna={B.turq} kepala={c.kepala} tunik={c.warna} />
        <Treadmill f={f} r={1} N={LARI_FRAME} x={1520} tanah={1010} s={c.s} judul="LARI (kaget)" warna={B.blue} kepala={c.kaget} tunik={c.warna} />
      </svg>
    </AbsoluteFill>);
};
