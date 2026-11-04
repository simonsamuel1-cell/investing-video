import React from 'react';
import { Img, staticFile } from 'remotion';
import { B, SISI, bayanganDengan, lerp, mixHex, rgba } from '../theme';
import { skalaPop } from '../parts/kit';
import { geser } from '../parts/umum';
import { Tokoh, panjangSiklus } from './rigGua';
import { BAYANGAN, TokohTegak } from './rigTegak';
import { PERIODE, RUMPUT as RUMPUT_HUTAN, SINGA } from './hutan.gen';

/**
 * DUNIA FLAT (26 Okt): jendela + kamera + latar padang rumput (dulu) & kota (hari ini). Koordinat DUNIA: garis tanah y = 0, x bebas;
 * kamera (x, y, z) memetakan titik dunia (x, y) ke pusat jendela. Latar jauh memakai paralaks (faktor `par`).
 */
export type Kamera = { x: number; y: number; z: number };
export const transformKamera = (k: Kamera, W: number, H: number, par = 1) => `translate(${W / 2} ${H / 2}) scale(${k.z}) translate(${-k.x * par} ${-k.y})`;
export const keLokal = (k: Kamera, W: number, H: number, [x, y]: [number, number]): [number, number] => [W / 2 + (x - k.x) * k.z, H / 2 + (y - k.y) * k.z];
/** kamera "biasa": garis tanah di 80 % tinggi jendela */
export const kameraTanah = (x: number, z: number, H: number): Kamera => ({ x, y: (-0.3 * H) / z, z });
const acak = (k: number) => { const v = Math.sin(k * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

/** JENDELA dunia: panel bundar pop dari tengah (aturan 14), isi = svg lokal (W × H dalam bingkai) */
export const Jendela: React.FC<{ x: number; y: number; w: number; h: number; p: number; rona: string; latar: string; r?: number; children: React.ReactNode }> =
  ({ x, y, w, h, p, rona, latar, r = 44, children }) => p <= 0 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: r, overflow: 'hidden', transformOrigin: 'center',
      transform: `${geser(x - w / 2, y - h / 2)} scale(${skalaPop(p)})`, background: latar, border: `${SISI}px solid ${rona}`, boxSizing: 'border-box',
      boxShadow: bayanganDengan(rona, 0) }}>{children}</div>);

/* ── PADANG RUMPUT ── */
const RUMPUT = 110;
const Rumpun: React.FC<{ x: number; h: number; warna: string; tebal: number }> = ({ x, h, warna, tebal }) => (
  <path d={`M ${x} 2 q 4 ${-h * 0.55} -12 ${-h * 0.8} M ${x + 9} 2 q 2 ${-h * 0.7} 9 ${-h} M ${x + 18} 2 q 6 ${-h * 0.45} 22 ${-h * 0.66}`} stroke={warna}
    strokeWidth={tebal} strokeLinecap="round" fill="none" />);

export const LatarPadang: React.FC<{ k: Kamera; W: number; H: number; matahari?: boolean }> = ({ k, W, H, matahari = true }) => {
  const lebar = W / 2 / k.z + 300;
  const bukit = Array.from({ length: 9 }, (_, j) => Math.floor((k.x * 0.25 - lebar) / 520) + j);
  const rumpun: number[] = [];
  for (let j = Math.floor((k.x - lebar) / RUMPUT); j <= Math.ceil((k.x + lebar) / RUMPUT); j++) rumpun.push(j);
  return (
    <>
      {matahari ? <circle cx={W * 0.84} cy={H * 0.2} r={46} fill={B.orangeLite} opacity={0.85} /> : null}
      <g transform={transformKamera(k, W, H, 0.25)}>
        {bukit.map((j) => {
          const x = j * 520 + acak(j) * 120, h = 150 + acak(j + 5) * 110;
          return <ellipse key={j} cx={x} cy={10} rx={420} ry={h} fill={mixHex(B.orangeWash, B.orangeLite, 0.32)} />;
        })}
      </g>
      <g transform={transformKamera(k, W, H)}>
        <rect x={k.x - lebar} y={0} width={lebar * 2} height={1400} fill={mixHex(B.orangeWash, B.orangeLite, 0.42)} />
        <line x1={k.x - lebar} x2={k.x + lebar} y1={0} y2={0} stroke={rgba(B.orange, 0.5)} strokeWidth={5} />
        {rumpun.map((j) => {
          const tinggi = acak(j + 3) > 0.78;
          return <Rumpun key={j} x={j * RUMPUT + acak(j) * 60} h={(tinggi ? 120 : 36) + acak(j + 7) * (tinggi ? 60 : 36)}
            warna={tinggi ? mixHex(B.orangeLite, B.orange, 0.45) : rgba(B.orange, 0.5)} tebal={tinggi ? 7 : 5} />;
        })}
      </g>
    </>);
};

/** tempat aman: bukit batu + mulut gua (dunia, tanah y = 0) */
export const BatuAman: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <path d="M -300 2 C -310 -120 -230 -250 -90 -282 C 60 -316 250 -236 300 -86 C 316 -40 316 -10 312 2 Z" fill={B.grayLite} />
    <path d="M -160 -228 C -90 -270 30 -286 120 -258" stroke={B.white} strokeOpacity={0.55} strokeWidth={10} strokeLinecap="round" fill="none" />
    <path d="M -86 2 C -92 -120 64 -130 70 2 Z" fill={mixHex(B.gray, B.night, 0.2)} />
  </g>);

/** rumput tinggi di depan singa (lokal jendela; bergoyang) */
export const RumputTinggi: React.FC<{ x: number; y: number; f: number; n?: number }> = ({ x, y, f, n = 9 }) => (
  <g>
    {Array.from({ length: n }, (_, j) => {
      const xx = x - 150 + j * 36, h = 150 + acak(j + 40) * 70, g = 8 * Math.sin(f * 0.09 + j);
      return <path key={j} d={`M ${xx} ${y + 4} q ${g} ${-h * 0.6} ${-8 + g * 1.6} ${-h}`} stroke={j % 2 ? mixHex(B.orangeLite, B.orange, 0.5) : B.orange}
        strokeWidth={10} strokeLinecap="round" fill="none" />;
    })}
  </g>);

/* ── KOTA ── */
export const LatarKota: React.FC<{ k: Kamera; W: number; H: number }> = ({ k, W, H }) => {
  const lebar = W / 2 / k.z + 400;
  const gedung: number[] = [], tiang: number[] = [];
  for (let j = Math.floor((k.x * 0.45 - lebar) / 300); j <= Math.ceil((k.x * 0.45 + lebar) / 300); j++) gedung.push(j);
  for (let j = Math.floor((k.x - lebar) / 680); j <= Math.ceil((k.x + lebar) / 680); j++) tiang.push(j);
  return (
    <>
      <g transform={transformKamera(k, W, H, 0.45)}>
        {gedung.map((j) => {
          const x = j * 300 + acak(j) * 40, w = 200 + acak(j + 1) * 80, h = 250 + acak(j + 2) * 240;
          const warna = j % 2 ? mixHex(B.turqLite, B.white, 0.5) : mixHex(B.blueLite, B.white, 0.72);
          const kol = 3, bar = Math.floor((h - 60) / 64);
          return (
            <g key={j}>
              <rect x={x} y={-h} width={w} height={h + 4} rx={14} fill={warna} />
              {Array.from({ length: kol * bar }, (_, q) => (
                <rect key={q} x={x + 26 + (q % kol) * ((w - 52) / kol)} y={-h + 34 + Math.floor(q / kol) * 64} width={(w - 52) / kol - 18} height={34} rx={6}
                  fill={B.white} opacity={0.6} />))}
            </g>);
        })}
      </g>
      <g transform={transformKamera(k, W, H)}>
        <rect x={k.x - lebar} y={0} width={lebar * 2} height={1400} fill={mixHex(B.turqWash, B.grayLite, 0.22)} />
        <line x1={k.x - lebar} x2={k.x + lebar} y1={0} y2={0} stroke={B.turqLite} strokeWidth={6} />
        <line x1={k.x - lebar} x2={k.x + lebar} y1={74} y2={74} stroke={rgba(B.turqLite, 0.6)} strokeWidth={4} />
        {tiang.map((j) => (
          <g key={j} transform={`translate(${j * 680 + 120} 0)`}>
            <rect x={-5} y={-360} width={10} height={362} rx={5} fill={B.grayLite} />
            <path d="M 0 -356 q 0 -18 34 -18" stroke={B.grayLite} strokeWidth={8} fill="none" strokeLinecap="round" />
            <circle cx={40} cy={-366} r={15} fill={B.turqLite} />
          </g>))}
      </g>
    </>);
};

/* ── SIMULASI GERAK (deterministik, dihitung sekali) ──
 * laju v(f) px/frame di dunia, r(f) jalan → lari; fase langkah = Σ v / (langkah per radian × skala) → kaki tidak tergelincir. */
export type Jejak = { X: Float64Array; psi: Float64Array; r: Float64Array; a: Float64Array };
export const simulasi = (n: number, v: (f: number) => number, r: (f: number) => number, s: number, x0 = 0, psi0 = 0,
  panjang: (r: number) => number = panjangSiklus): Jejak => {
  const X = new Float64Array(n), psi = new Float64Array(n), R = new Float64Array(n), A = new Float64Array(n);
  let x = x0, q = psi0;
  for (let f = 0; f < n; f++) {
    const vv = v(f), rr = r(f);
    x += vv; q += vv / (panjang(rr) * s); // q = fase siklus (putaran)
    const t = Math.min(1, Math.max(0, vv / 1.4));
    X[f] = x; psi[f] = q; R[f] = rr; A[f] = t * t * (3 - 2 * t);
  }
  return { X, psi, r: R, a: A };
};
export const ambil = (j: Jejak, f: number) => {
  const i = Math.max(0, Math.min(j.X.length - 1, Math.round(f)));
  return { x: j.X[i], psi: j.psi[i], r: j.r[i], a: j.a[i] };
};

/* ════════ LAYAR PENUH (revisi Simon 26 Okt: "Buat adegannya jadi fullscreen saja (jangan dimasukan panel)") ════════
 * Koordinat dasar = layar 1920 × 1080 pada zoom 1; kaki tokoh di y = TANAH_LAYAR. Kamera: x dunia di tengah layar (960).
 * KINERJA STUDIO (terukur 26 Okt, scripts/studio_putar.mjs): satu SVG selayar yang isinya bergeser = seluruh latar diraster ulang tiap frame
 * (14–38 frame telat / 4 dtk, "patah-patah"). Kini tiap lapisan = elemen sendiri yang digeser translate3d (raster di-cache GPU);
 * yang digambar ulang tiap frame hanya tokoh. Zoom = CSS `zoom` (raster ulang tajam, bukan scale buram) di dalam pembungkus translate. */
export const TANAH_LAYAR = 860;
export const P_JAUH = 0.17; // paralaks cakrawala Hutan.svg (pohon, batu, awan, tanah) pada zoom 1 — dipakai juga batas paralaks rumput
/** SKALA REALISTIS (Simon 26 Okt malam: "ukuran orang dengan background kota dan hutan terlihat tidak realistis … mungkin bisa kamu zoom
 * backgroundnya (buat jadi terlihat realistis, ukuran pohon, manusia, gedung)"). Terukur (manusia ±408 px): akasia besar 374 px (0,9×),
 * lampu kota 414 (1,0×), pohon trotoar 471 (1,15×), gedung ±560 (1,4×). Kini: HUTAN ×1,6 di garis CAKRAWALA (akasia ±600 = 1,5× manusia,
 * puncak tetap di layar) — lebih dekat → paralaks ikut ×1,6; KOTA ×2 di garis kaki (lampu ±830 = 2× manusia, pohon 2,3×, gedung keluar
 * atas layar seperti pandangan setinggi mata di trotoar). */
export const Z_HUTAN = 1.6, CAKRAWALA = 653, Z_KOTA = 2;
export const P_HUTAN = P_JAUH * Z_HUTAN;
const pRumput = (yb: number) => Math.max(P_JAUH, P_JAUH + ((1 - P_JAUH) * (yb - 680)) / (TANAH_LAYAR - 680));
export const keLayar = (xDunia: number, kamX: number) => xDunia - kamX + 960;
const lapis = (x: number, y = 0): React.CSSProperties => ({ position: 'absolute', left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0)`,
  willChange: 'transform' });

/** ZOOM ke titik fokus (fx, fy) dasar: u = 0 identitas, u = 1 titik fokus di tengah layar dengan skala z */
export const Zoom: React.FC<{ u: number; z: number; fx: number; fy: number; children: React.ReactNode }> = ({ u, z, fx, fy, children }) => {
  if (u <= 0) return <>{children}</>;
  const px = lerp(fx, 960, u), py = lerp(fy, 540, u);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${px - fx * z}px, ${py - fy * z}px)` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zoom: z } as React.CSSProperties}>{children}</div>
    </div>);
};

/** lapisan GAMBAR (berkas svg mandiri dari ekstrak-hutan.py): diraster sekali, lalu hanya digeser — kotak = koordinat asli Hutan.svg */
const Gambar: React.FC<{ src: string; x0: number; y0: number; w: number; h: number; dx: number; dy?: number }> = ({ src, x0, y0, w, h, dx, dy = 0 }) => (
  <div style={lapis(dx + x0, y0 + dy)}><Img src={staticFile(`flat/hutan/${src}.svg`)} style={{ display: 'block', width: w, height: h }} /></div>);

/** HUTAN layar penuh dari Hutan.svg: langit diam · cakrawala paralaks P_JAUH (geser C) · rumput per kedalaman, berulang tiap PERIODE.
 *  `depan` = hanya rumput yang lebih dekat dari tokoh (di atas tokoh). */
/** `xs` (opsional, S02 flat): rentang x yang terlihat (jendela kartu) — rumpun di luar rentang tidak dipasang (kinerja Studio: 4 kartu × ±30 gambar). Bawaan =
 * layar penuh seperti Scene 01. */
export const HutanLayar: React.FC<{ kamX: number; C: number; lapis: 'belakang' | 'depan'; xs?: [number, number]; sisip?: React.ReactNode }> =
  ({ kamX, C, lapis: l, xs = [-400, 2320], sisip }) => {
  const rumput = RUMPUT_HUTAN.map((r, i) => ({ ...r, i })).filter((r) => (l === 'depan' ? r.yb > TANAH_LAYAR + 10 : r.yb <= TANAH_LAYAR + 10));
  const salinan: React.ReactNode[] = [];
  rumput.forEach((r) => {
    const p = pRumput(r.yb), dasar = -p * kamX + C * p;
    const k0 = Math.floor((xs[0] - (r.x1 + dasar)) / PERIODE) + 1, k1 = Math.floor((xs[1] - (r.x0 + dasar)) / PERIODE);
    for (let k = k0; k <= k1; k++) {
      salinan.push(<Gambar key={`${r.i}-${k}`} src={`rumput-${String(r.i).padStart(2, '0')}`} x0={r.x0 - 10} y0={r.yb - 220} w={r.x1 - r.x0 + 20} h={230} dx={dasar + k * PERIODE} />);
    }
  });
  if (l === 'depan') return <>{salinan}</>;
  return (
    <>
      {/* langit diperlebar ke kiri & kanan (transisi paralaks menggeser adegan purba ke kanan → tepi kiri tak boleh kosong) */}
      <div style={{ position: 'absolute', left: -1920, top: 0, width: 5760, height: 1080, background: 'linear-gradient(to bottom, #B9E3CB 0%, #F2FAEF 96%)' }} />
      <Gambar src="langit" x0={0} y0={0} w={1920} h={1080} dx={0} />
      {/* `sisip` (opsional, S03 flat): benda di antara langit & cakrawala — matahari terbenam tertutup tanah/pohon cakrawala */}
      {sisip}
      <Gambar src="jauh" x0={0} y0={CAKRAWALA * (1 - Z_HUTAN)} w={5880 * Z_HUTAN} h={1080 * Z_HUTAN} dx={-P_HUTAN * kamX + C} />
      {salinan}
    </>);
};

/** SINGA dari Hutan.svg (Simon: "untuk singanya tadi aku asal menempatkannya, sesuaikan dengan kebutuhan"): x = tepi kiri singa di layar */
export const SingaLayar: React.FC<{ x: number; bob: number; alfa?: number }> = ({ x, bob, alfa = 1 }) => (
  <div style={{ opacity: alfa < 1 ? alfa : undefined }}><Gambar src="singa" x0={SINGA.x0} y0={SINGA.y0} w={SINGA.x1 - SINGA.x0} h={SINGA.y1 - SINGA.y0} dx={x - SINGA.x0} dy={TANAH_LAYAR + 20 - SINGA.y1 - bob} /></div>);

/** TOKOH dalam lapisannya sendiri (hanya bagian ini yang diraster ulang tiap frame) */
export const TokohLapis: React.FC<React.ComponentProps<typeof Tokoh>> = (props) => (
  <div style={lapis(props.x - 400, props.tanah - 820)}>
    <svg width={800} height={900} style={{ display: 'block', overflow: 'visible' }}>
      <Tokoh {...props} x={400} tanah={820} />
    </svg>
  </div>);
/** BAYANGAN BERSAMA: bayangan beberapa tokoh dalam SATU lapisan ber-opasitas → bayangan yang bertumpuk (kelompok berjalan berdempetan)
 * tidak jadi lebih gelap di tumpukannya. Tiap item: x layar pusat kepala, skala tokoh, angkat (satuan rig, saat melayang mengecil). */
export const BayanganBersama: React.FC<{ items: { x: number; s: number; rx: number; angkat: number }[]; tanah: number }> = ({ items, tanah }) => (
  <div style={lapis(0, 0)}>
    <svg width={1920} height={1080} style={{ display: 'block', overflow: 'visible' }}>
      <g opacity={BAYANGAN.alfa}>
        {items.map((b, k) => {
          const q = Math.max(0.6, 1 - b.angkat / 80);
          return <ellipse key={k} cx={b.x} cy={tanah} rx={b.rx * b.s * q} ry={b.rx * BAYANGAN.rasio * b.s * q} fill={B.night} />;
        })}
      </g>
    </svg>
  </div>);
/** tokoh utama rig TEGAK (Simon 26 Okt malam: "Pasang tokoh utama rig tegak (jalan 72 frame + lari) ke adegan S01 flat") */
export const TokohTegakLapis: React.FC<React.ComponentProps<typeof TokohTegak> & { id?: string }> = ({ id: _id, ...props }) => (
  <div style={lapis(props.x - 400, props.tanah - 820)}>
    <svg width={800} height={900} style={{ display: 'block', overflow: 'visible' }}>
      <TokohTegak {...props} x={400} tanah={820} />
    </svg>
  </div>);

/** KOTA layar penuh = latar perkotaan Simon dari 023 Short-Term Trading Video 02 (`art/truk/latar.svg`, panorama 5000 × 1080; salinan
 *  public/flat/kota-latar.svg). Simon 26 Okt: "background perkotaannya gunakan itu untuk background adegan perkotaan". Diskalakan 1,144
 *  (rata atas) supaya trotoar depan gedung jatuh di garis kaki TANAH_LAYAR; bergeser 1 : 1 dengan langkah. `C` = geser awal panorama. */
export const KOTA = { s: 1.144, w: 5000, h: 1080 };
export const KotaLayar: React.FC<{ kamX: number; C: number }> = ({ kamX, C }) => (
  <div style={lapis(C - kamX, TANAH_LAYAR * (1 - Z_KOTA))}>
    <Img src={staticFile('flat/kota-latar.svg')} style={{ display: 'block', width: KOTA.w * KOTA.s * Z_KOTA, height: KOTA.h * KOTA.s * Z_KOTA, maxWidth: 'none' }} />
  </div>);
