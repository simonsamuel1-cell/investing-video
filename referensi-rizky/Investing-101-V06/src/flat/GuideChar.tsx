import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, F } from '../theme';
import { GUIDE_TEGAK as G, SENDI_TEGAK as J } from './guaTegak.gen';
import { TEGAK_LURUS, TokohTegak, TUNIK, alasTerendah, puncakKepala, type Kepala } from './rigTegak';
export { puncakKepala };

/**
 * GUIDE / GRID CHAR (26 Okt malam, Simon: "agar hasilnya lebih akurat dan bisa lebih detail lagi untuk char ini maupun char lainnya, mungkin
 * kamu bisa menambahkan garis bantu (guide)/gridnya"). Satu sumber angka: GUIDE_TEGAK (scripts/bangun-tegak.py) — sama dengan lapis
 * `grid` + `guide` di karakter-flat/tokoh-gua_tegak.svg. Grid = koordinat file (kotak 10, garis tebal tiap 50) → cocok dengan penggaris
 * artboard Illustrator. Guide: garis mendatar tiap batas tubuh, garis tegak tiap sumbu, lingkaran sendi dengan jari-jari sebenarnya,
 * penggaris proporsi dalam satuan tinggi kepala.
 */
const BIRU = '#00AEEF', BIRU_MUDA = '#9ADDF5';
const H: [number, number] = [(J.pinggul[0][0] + J.pinggul[1][0]) / 2, J.pinggul[0][1]];
/** peta satuan file → layar untuk tokoh pose dasar yang digambar TokohTegak di (x, tanah, s) */
export const petaGuide = (x: number, tanah: number, s: number) => ({
  X: (v: number) => x + (v - H[0]) * s,
  Y: (v: number) => tanah - (alasTerendah(TEGAK_LURUS) + H[1] - v) * s,
});
type Bidang = { x: number; tanah: number; s: number; x0?: number; x1?: number; y0?: number; y1?: number };

/** grid koordinat file — digambar DI BAWAH tokoh */
export const GridChar: React.FC<Bidang & { angka?: boolean }> = ({ x, tanah, s, x0 = 60, x1 = 320, y0 = 0, y1 = 540, angka = true }) => {
  const m = petaGuide(x, tanah, s), garis: React.ReactNode[] = [];
  for (let v = Math.ceil(x0 / 10) * 10; v <= x1; v += 10) {
    const besar = v % 50 === 0;
    garis.push(<line key={`x${v}`} x1={m.X(v)} x2={m.X(v)} y1={m.Y(y0)} y2={m.Y(y1)} stroke={besar ? BIRU : BIRU_MUDA} strokeWidth={besar ? 0.9 : 0.5} opacity={besar ? 0.45 : 0.4} />);
    if (besar && angka) garis.push(<text key={`tx${v}`} x={m.X(v) + 3} y={m.Y(y0) + 12} fontFamily={F} fontSize={11} fill={BIRU}>{v}</text>);
  }
  for (let v = Math.ceil(y0 / 10) * 10; v <= y1; v += 10) {
    const besar = v % 50 === 0;
    garis.push(<line key={`y${v}`} x1={m.X(x0)} x2={m.X(x1)} y1={m.Y(v)} y2={m.Y(v)} stroke={besar ? BIRU : BIRU_MUDA} strokeWidth={besar ? 0.9 : 0.5} opacity={besar ? 0.45 : 0.4} />);
    if (besar && angka) garis.push(<text key={`ty${v}`} x={m.X(x0) + 3} y={m.Y(v) - 3} fontFamily={F} fontSize={11} fill={BIRU}>{v}</text>);
  }
  return <g>{garis}</g>;
};

/** garis guide, lingkaran sendi, penggaris kepala — digambar DI ATAS tokoh. `puncak` = puncak kepala char ini (kepala lain → tinggi lain) */
export const GuideChar: React.FC<Bidang & { label?: boolean; puncak?: number }> = ({ x, tanah, s, x0 = 60, x1 = 320, label = true, puncak = G.puncak }) => {
  const m = petaGuide(x, tanah, s), tinggi = G.y[G.y.length - 1][1] - puncak, nKepala = tinggi / G.kepala;
  const sendi: [[number, number][], number][] = [[J.bahu, G.r.bahu], [J.siku, G.r.siku], [J.perg, G.r.perg], [J.pinggul, G.r.pinggul], [J.lutut, G.r.lutut], [J.pkaki, G.r.pkaki]];
  // mata & dagu diukur dari kepala Simon → hanya untuk kepala Simon; char lain: puncak kepalanya sendiri
  const ys: [string, number][] = puncak === G.puncak ? G.y : [['puncak kepala', puncak], ...G.y.filter(([n]) => !['puncak kepala', 'mata', 'dagu'].includes(n))];
  return (
    <g fill="none" stroke={BIRU}>
      {ys.map(([n, v]) => (
        <g key={n}>
          <line x1={m.X(x0)} x2={m.X(x1)} y1={m.Y(v)} y2={m.Y(v)} strokeWidth={1.1} strokeDasharray="7 5" />
          {label ? <text x={m.X(x1)} y={m.Y(v) - 4} textAnchor="end" fontFamily={F} fontSize={12} fontWeight={600} fill={BIRU} stroke="none">{n} {v.toFixed(1)}</text> : null}
        </g>))}
      {G.x.map(([n, v], k) => (
        <line key={k} x1={m.X(v)} x2={m.X(v)} y1={m.Y(puncak - 10)} y2={m.Y(G.y[G.y.length - 1][1] + 12)} strokeWidth={n === 'sumbu leher' ? 1.3 : 0.8}
          stroke={n === 'sumbu leher' ? '#E5475D' : BIRU} strokeDasharray={n === 'sumbu leher' ? undefined : '3 5'} />))}
      {sendi.flatMap(([pts, r], k) => pts.map((p, i) => (
        <g key={`${k}-${i}`} opacity={i ? 0.6 : 1}>
          <circle cx={m.X(p[0])} cy={m.Y(p[1])} r={r * s} strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={m.X(p[0])} cy={m.Y(p[1])} r={2.6} fill={BIRU} stroke="none" />
        </g>)))}
      {/* penggaris proporsi (satuan tinggi kepala Simon: puncak → dagu) */}
      <line x1={m.X(x0) - 18} x2={m.X(x0) - 18} y1={m.Y(puncak)} y2={m.Y(G.y[G.y.length - 1][1])} strokeWidth={1.4} />
      {Array.from({ length: Math.floor(nKepala) + 1 }, (_, k) => (
        <g key={k}>
          <line x1={m.X(x0) - 26} x2={m.X(x0) - 10} y1={m.Y(puncak + k * G.kepala)} y2={m.Y(puncak + k * G.kepala)} strokeWidth={1.4} />
          {label ? <text x={m.X(x0) - 30} y={m.Y(puncak + k * G.kepala) + 4} textAnchor="end" fontFamily={F} fontSize={11} fontWeight={700} fill={BIRU} stroke="none">{k}</text> : null}
        </g>))}
      {label ? <text x={m.X(x0) - 18} y={m.Y(G.y[G.y.length - 1][1]) + 22} textAnchor="middle" fontFamily={F} fontSize={11} fontWeight={700} fill={BIRU} stroke="none">
        {nKepala.toFixed(2)} × kepala utama</text> : null}
    </g>);
};

/** LEMBAR GUIDE: semua char pada grid & guide yang sama (skala file sama) — dagu di garis dagu, pusat kepala di garis pusat kepala */
export const GUIDE_CHAR = { w: 1920, h: 1080 };
export const LembarGuideChar: React.FC = () => {
  const S = 1.22, TANAH = 1030;
  const char: { judul: string; x: number; kepala: Kepala; warna?: { tunik: string; totol: string }; kostum?: 'dulu' | 'kini' }[] = [
    { judul: 'Tokoh utama', x: 230, kepala: 'simon' },
    { judul: 'Keriting', x: 600, kepala: { set: 'keriting', eks: 'netral' }, warna: TUNIK.oranye },
    { judul: 'Wanita', x: 970, kepala: { set: 'wanita', eks: 'netral' }, warna: TUNIK.krem },
    { judul: 'Ikal', x: 1340, kepala: { set: 'ikal', eks: 'netral' }, warna: TUNIK.cokelat },
    { judul: 'Tokoh utama (kota)', x: 1710, kepala: 'mainHp', kostum: 'kini' },
  ];
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        {char.map((c) => <GridChar key={c.judul} x={c.x} tanah={TANAH} s={S} x0={95} x1={285} y0={-10} y1={530} angka={false} />)}
        {char.map((c) => <TokohTegak key={c.judul} x={c.x} tanah={TANAH} s={S} pose={TEGAK_LURUS} kepala={c.kepala} warna={c.warna} kostum={c.kostum} />)}
        {char.map((c, k) => <GuideChar key={c.judul} x={c.x} tanah={TANAH} s={S} x0={95} x1={285} label={k === char.length - 1} puncak={puncakKepala(c.kepala)} />)}
        {char.map((c) => <text key={c.judul} x={petaGuide(c.x, TANAH, S).X(190)} y={36} textAnchor="middle" fontFamily={F} fontSize={22} fontWeight={800} fill={B.night}>{c.judul}</text>)}
      </svg>
    </AbsoluteFill>);
};
