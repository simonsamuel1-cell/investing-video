import React from 'react';
import { UANG } from '../s02/uang.gen';
import { BUNDEL_ISO } from './uang-iso.gen';
import { POHON } from '../s02/pohon.gen';
import { TUMPUKAN_SIMON } from './tumpukan-simon.gen';

/**
 * UANG ASET SIMON (8 Okt: "untuk coin dan uang kertas … ganti dari yang ada di asset, tumpukan coinnya ganti dengan tumpukan
 * kertas, seperti yang kamu gunakan di scene saham (sesuaikan warnanya)"): uang kertas & bundel hijau #7EC151 (public/uang-hijau,
 * tanpa $), koin = koin depan dari Bunga.svg Simon (tanpa $). SVG LANGSUNG (bukan <Img>): tidak ada muat/dekode di tengah
 * pemutaran (penyebab tersendat di Studio, terukur di Scene 02). Posisi lewat translate3d + rotasi mikro (tanpa judder 1 px).
 */
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/** BUNDEL ISOMETRIK (Simon 8 Okt: "tumpukan uang seharusnya menggunakan style yang isometric dari asset yang aku kirimkan, dan juga
 *  bayangan juga harus menggunakan style isometric"): stok Freepik stacked-money, hijau #7EC151 (scripts/uang_iso.py). Ukuran = lebar w. */
const BI = BUNDEL_ISO;
export const BUNDEL_RASIO = BI.h / BI.w;
/** satu lapis tumpukan naik sebesar langkah stok (dua bundel bertumpuk di stok berjarak 52,2 dari 295,8 lebar) */
export const naikBundel = (w: number) => (BI.langkah * w) / BI.w;

/** satu lembar uang kertas hijau (bentuk = tangkapan layar Simon), pusat (x, y), lebar w */
export const LembarUang: React.FC<{ x: number; y: number; w: number; putar?: number; s?: number; op?: number }> = ({ x, y, w, putar = 0, s = 1, op = 1 }) => {
  if (s <= 0.001 || op <= 0.001) return null;
  const h = (w * 596) / 648;
  return <svg viewBox={UANG.lembar.vb} width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: op, transform: `${geser(x - w / 2, y - h / 2)} rotate(${putar}deg) scale(${s})` }} dangerouslySetInnerHTML={{ __html: UANG.lembar.svg }} />;
};

/** satu bundel uang hijau isometrik, pusat (x, y), lebar w */
export const Bundel: React.FC<{ x: number; y: number; w: number; s?: number; op?: number; putar?: number }> = ({ x, y, w, s = 1, op = 1, putar = 0 }) => {
  if (s <= 0.001 || op <= 0.001) return null;
  const h = w * BUNDEL_RASIO;
  return <svg viewBox={BI.vb} width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: op, transform: `${geser(x - w / 2, y - h / 2)} rotate(${putar}deg) scale(${s})` }} dangerouslySetInnerHTML={{ __html: BI.svg }} />;
};

/** BUNDEL KOSONG — siluet bundel putus-putus (uang yang BELUM ada / tidak keluar), pusat (x, y), lebar w; diam sesudah pop */
export const BundelKosong: React.FC<{ x: number; y: number; w: number; s?: number }> = ({ x, y, w, s = 1 }) => {
  if (s <= 0.001) return null;
  const h = w * BUNDEL_RASIO;
  return <svg viewBox={BI.vb} width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: `${geser(x - w / 2, y - h / 2)} scale(${s})` }}><path d={BI.siluet} fill="#FFFFFF" fillOpacity={0.55} stroke="#C7C7CE" strokeWidth={(3 * BI.w) / w} strokeDasharray={`${(10 * BI.w) / w} ${(8 * BI.w) / w}`} strokeLinejoin="round" /></svg>;
};

/** pusat bundel lapis ke-j (0 = paling bawah) pada tumpukan berdasar `dasar` (tepi bawah) */
export const pusatLapis = (dasar: number, w: number, j: number) => dasar - (w * BUNDEL_RASIO) / 2 - j * naikBundel(w);

/** sumbu isometrik ke kanan-bawah (sisi atas → kanan muka bundel stok): arah bayangan jatuh di tanah */
const ISO = { x: 0.861, y: 0.509 };
/** selubung cembung (monotone chain) */
const selubung = (pts: [number, number][]) => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const silang = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const bawah: [number, number][] = [], atas: [number, number][] = [];
  for (const q of p) { while (bawah.length >= 2 && silang(bawah[bawah.length - 2], bawah[bawah.length - 1], q) <= 0) bawah.pop(); bawah.push(q); }
  for (const q of [...p].reverse()) { while (atas.length >= 2 && silang(atas[atas.length - 2], atas[atas.length - 1], q) <= 0) atas.pop(); atas.push(q); }
  return [...bawah.slice(0, -1), ...atas.slice(0, -1)];
};
/** BAYANGAN ISOMETRIK satu tumpukan (n lapis) pusat x, dasar: tapak jajaran genjang bundel stok, diseret sepanjang sumbu iso sejauh
 *  tinggi tumpukannya (cahaya kiri-atas) → poligon datar di bidang tanah, satu rona gelap transparan (gaya flat stok) */
export const titikBayangIso = (x: number, dasar: number, w: number, n: number) => {
  const k = w / BI.w, h = w * BUNDEL_RASIO;
  const kiri = x - w / 2, atas0 = dasar - h; // kotak bundel lapis 0
  const alas = BI.alas.map(([ax, ay]) => [kiri + ax * k, atas0 + ay * k] as [number, number]);
  const L = 0.08 * w + 0.55 * (BI.tebal * k + (n - 1) * naikBundel(w));
  const geserL = alas.map(([ax, ay]) => [ax + ISO.x * L, ay + ISO.y * L] as [number, number]);
  return selubung([...alas, ...geserL]).map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');
};
const BAYANG = { warna: '#16181B', op: 0.16 };

/** garis bayang tipis di atas bundel bawahnya (lapisan gelap stok, bergeser 2 satuan) — bundel lapis j ≥ 1 */
const SelaBundel: React.FC<{ x: number; y: number; w: number; op: number }> = ({ x, y, w, op }) => {
  const h = w * BUNDEL_RASIO;
  return <svg viewBox={BI.vb} width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 0.3 * op, transform: geser(x - w / 2, y - h / 2 + (2 * w) / BI.w) }}><path d={BI.siluet} fill="#191C18" /></svg>;
};

/** tumpukan bundel: `lapis(j)` → {s, op, dx, dy} per lapis (0 = tidak tampil). Bayangan isometrik di bawahnya mengikuti lapis yang tampil. */
export const TumpukBundel: React.FC<{ x: number; dasar: number; w: number; n: number; lapis: (j: number) => { s: number; op?: number; dx?: number; dy?: number } }> = ({ x, dasar, w, n, lapis }) => {
  const tampil = Array.from({ length: n }, (_, j) => lapis(j)).map((l, j) => ({ l, j })).filter(({ l }) => l.s > 0.001 && (l.op ?? 1) > 0.001);
  if (tampil.length === 0) return null;
  const nTampil = tampil[tampil.length - 1].j + 1, opB = Math.min(1, tampil[0].l.op ?? 1) * Math.min(1, tampil[0].l.s);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <polygon points={titikBayangIso(x, dasar, w, nTampil)} fill={BAYANG.warna} opacity={BAYANG.op * opB} />
      </svg>
      {tampil.map(({ l, j }) => (
        <React.Fragment key={j}>
          {j > 0 ? <SelaBundel x={x + (l.dx ?? 0)} y={pusatLapis(dasar, w, j) + (l.dy ?? 0)} w={w} op={(l.op ?? 1) * Math.min(1, l.s)} /> : null}
          <Bundel x={x + (l.dx ?? 0)} y={pusatLapis(dasar, w, j) + (l.dy ?? 0)} w={w} s={l.s} op={l.op ?? 1} />
        </React.Fragment>))}
    </>);
};

/** koin emas tampak depan (koin Bunga.svg Simon, tanpa $), pusat (x, y), diameter d */
const KOIN_SVG = POHON[10];
const KR = 152;
export const KoinUang: React.FC<{ x: number; y: number; d: number; s?: number; op?: number }> = ({ x, y, d, s = 1, op = 1 }) => {
  if (s <= 0.001 || op <= 0.001) return null;
  return <svg viewBox={`${KOIN_SVG.cx - KR} ${KOIN_SVG.cy - KR} ${2 * KR} ${2 * KR}`} width={d} height={d} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: op, transform: `${geser(x - d / 2, y - d / 2)} scale(${s})` }} dangerouslySetInnerHTML={{ __html: KOIN_SVG.svg }} />;
};

/** titik pada busur kuadrat a → b dengan puncak setinggi `h` (h > 0 = melengkung ke atas) */
export const busur = (a: { x: number; y: number }, b: { x: number; y: number }, h: number, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t - Math.sin(Math.PI * t) * h });

/**
 * KLASTER TUMPUKAN UANG — Simon 8 Okt: "buat tumpukan uangnya … tidak cuman 1 tumpukan uang, tapi ada beberapa 4-5 tumpukan, tambahkan
 * bayangan dibawah tumpukan uang (sesuaikan dengan gaya tumpukan uangnya)". Beberapa tumpukan bundel hijau berdampingan (baris belakang
 * `dy` < 0 digambar dulu), tiap tumpukan berbayang DATAR (gaya flat aset: tanpa blur, satu rona gelap transparan, condong ke kanan-bawah).
 * Semua bayangan satu lapis opasitas → tumpang-tindihnya tidak menggelap.
 * `keadaan(i)` → op (0 = belum/sudah tidak ada) dan dy (geser vertikal: jatuh masuk / terangkat pergi).
 */
export type Tumpukan = { dx: number; dy: number; n: number };
export const KlasterUang: React.FC<{ x: number; dasar: number; w: number; tumpukan: Tumpukan[]; keadaan: (i: number) => { op: number; dy?: number } }> = ({ x, dasar, w, tumpukan, keadaan }) => {
  const urut = tumpukan.map((t, i) => ({ ...t, i })).sort((a, b) => a.dy - b.dy || a.dx - b.dx);
  const ada = tumpukan.map((t, i) => ({ t, k: keadaan(i) })).filter(({ k }) => k.op > 0.001);
  if (ada.length === 0) return null;
  return (
    <>
      {/* bayangan isometrik semua tumpukan dalam SATU lapis opasitas → tumpang-tindihnya tidak menggelap */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g opacity={BAYANG.op}>
          {ada.map(({ t, k }, j) => <polygon key={j} points={titikBayangIso(x + t.dx, dasar + t.dy, w, t.n)} fill={BAYANG.warna} opacity={Math.min(1, k.op)} />)}
        </g>
      </svg>
      {urut.map((t) => {
        const k = keadaan(t.i);
        if (k.op <= 0.001) return null;
        return Array.from({ length: t.n }, (_, j) => {
          const y = pusatLapis(dasar + t.dy + (k.dy ?? 0), w, j);
          return (
            <React.Fragment key={`${t.i}-${j}`}>
              {j > 0 ? <SelaBundel x={x + t.dx} y={y} w={w} op={k.op} /> : null}
              <Bundel x={x + t.dx} y={y} w={w} op={k.op} />
            </React.Fragment>);
        });
      })}
    </>);
};
/** pusat bundel teratas tumpukan i (titik berangkat uang yang pergi dari tumpukan itu) */
export const puncakTumpukan = (x: number, dasar: number, w: number, t: Tumpukan) => ({ x: x + t.dx, y: pusatLapis(dasar + t.dy, w, t.n - 1) });

/* ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
 * TUMPUKAN UANG SIMON (9 Okt: "gunakan ini saja [stok-uang/stacked-money/12694-NOC9KI.ai], kamu tinggal menyesuaikan untuk kebutuhan
 * animasi, tapi jangan sampai kamu ubah layoutnya" + "samakan warnanya, dengan apa yang sudah ada divideo"). Menggantikan susunan acuan
 * buatan sendiri (bundel tunggal yang diatur ulang → arah bundel tercermin dari acuan, tapaknya bersilangan: "posisinya terbalik").
 * Isi = berkas Simon apa adanya (scripts/tumpukan_simon.py): 22 bundel dalam 6 tumpukan, URUTAN GAMBAR & posisinya tidak diubah, elips
 * bayangan Simon di bawahnya. Untuk animasi tiap bundel = satu UNIT (urutan gambar = indeks): `keadaan(i)` → {op, dx, dy, s}
 *   op  muncul/pudar · dx, dy geser (px layar; jatuh masuk, terangkat, terbang pergi) · s skala di pusat unit.
 * Unit yang PERGI digerakkan DI DALAM tumpukan (tetap di urutan gambarnya) → tidak ada salinan terbang yang menimpa tumpukan di depannya
 * (dulu silang-pudar 12f, lonjakan satu-frame terukur S05 f2057).
 * Tumpukan (t): 0 belakang-tinggi (unit 0–5) · 1 kanan-tengah (6–8) · 2 kiri-tengah (9–13) · 3 kanan-depan (14–15) · 4 kiri-depan
 * (16–18) · 5 depan (19–21); lapis l 0 = bawah.
 * Penempatan (x, dasar, W) sama dengan susunan lama: kotak bundel setinggi 2,21 W berpusat di (x + 0,21 W, dasar − 0,5 W) → tapak di
 * tiap adegan tetap (ukuran bundel kini 0,85 W).
 * ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
const TS = TUMPUKAN_SIMON;
export const UNIT_UANG = TS.unit.map(({ t, l }) => ({ t, l }));
/** indeks unit tumpukan t (bawah → atas) */
export const unitTumpukan = (t: number) => UNIT_UANG.flatMap((u, i) => (u.t === t ? [i] : []));
/** indeks bundel teratas tumpukan t */
export const atasTumpukan = (t: number) => { const u = unitTumpukan(t); return u[u.length - 1]; };
export type KeadaanUnit = { op: number; dx?: number; dy?: number; s?: number };
const [KX0, KY0, KX1, KY1] = TS.kotak;
const letakTumpuk = (x: number, dasar: number, W: number) => {
  const s = (2.21 * W) / (KY1 - KY0);
  return { s, ox: x + 0.21 * W - ((KX0 + KX1) / 2) * s, oy: dasar - 0.5 * W - ((KY0 + KY1) / 2) * s };
};
/** TUMPUKAN UANG: (x, dasar, W) seperti susunan lama; `keadaan(i)` per unit (bawaan: semua tampil). Elips bayangan ikut unit yang tampil. */
export const TumpukanUang: React.FC<{ x: number; dasar: number; W: number; keadaan?: (i: number) => KeadaanUnit }> =
  ({ x, dasar, W, keadaan = (): KeadaanUnit => ({ op: 1 }) }) => {
    const k = TS.unit.map((_, i) => keadaan(i));
    const opElips = Math.max(0, ...k.map((q) => q.op));
    if (opElips <= 0.001) return null;
    const { s, ox, oy } = letakTumpuk(x, dasar, W);
    return (
      <svg viewBox={TS.vb.join(' ')} width={TS.vb[2] * s} height={TS.vb[3] * s} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: geser(ox, oy) }}>
        <g opacity={Math.min(1, opElips)} dangerouslySetInnerHTML={{ __html: TS.elips }} />
        {TS.unit.map((u, i) => {
          const q = k[i];
          if (q.op <= 0.001) return null;
          const cx = u.x + u.w / 2, cy = u.y + u.h / 2, sk = q.s ?? 1;
          const tr = `translate(${(q.dx ?? 0) / s} ${(q.dy ?? 0) / s})${sk !== 1 ? ` translate(${cx} ${cy}) scale(${sk}) translate(${-cx} ${-cy})` : ''}`;
          return (
            <g key={i} opacity={Math.min(1, q.op)} transform={tr}>
              {u.bayang ? <g opacity={0.27} transform="translate(0 2)" dangerouslySetInnerHTML={{ __html: u.bayang }} /> : null}
              <g dangerouslySetInnerHTML={{ __html: u.svg }} />
            </g>);
        })}
      </svg>);
  };
/** pusat MUKA ATAS unit i di layar (titik berangkat/tiba uang yang terbang dari/ke bundel itu) */
export const puncakUnit = (x: number, dasar: number, W: number, i: number) => {
  const { s, ox, oy } = letakTumpuk(x, dasar, W), u = TS.unit[i];
  return { x: ox + (u.x + u.w / 2) * s, y: oy + (u.y + 0.42 * u.h) * s };
};
/** elips bayangan Simon (satuan viewBox tumpukan) */
const EL = (() => { const g = (k: string) => Number(new RegExp(`${k}="([\\d.]+)"`).exec(TS.elips)![1]); return { cx: g('cx'), cy: g('cy'), rx: g('rx'), ry: g('ry') }; })();
/** kotak TAMPAK tumpukan di layar = bundel ∪ elips bayangan (Simon 12 Okt S05 V4 "rumah dan uang seharusnya center tengah": tumpukan
 *  disejajarkan dengan benda lain lewat kotak yang terlihat mata, bukan kotak bundel saja — elips menjulur 0,33 W lebih jauh ke kiri) */
export const kotakTumpukan = (x: number, dasar: number, W: number) => {
  const { s, ox, oy } = letakTumpuk(x, dasar, W);
  const x0 = ox + Math.min(KX0, EL.cx - EL.rx) * s, x1 = ox + Math.max(KX1, EL.cx + EL.rx) * s;
  const y0 = oy + Math.min(KY0, EL.cy - EL.ry) * s, y1 = oy + Math.max(KY1, EL.cy + EL.ry) * s;
  return { x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
};
/** (x, dasar) TumpukanUang supaya kotak tampaknya berpusat di (cx, cy) */
export const tumpukanDiPusat = (cx: number, cy: number, W: number) => { const k = kotakTumpukan(0, 0, W); return { x: cx - k.cx, dasar: cy - k.cy }; };
/** lebar satu bundel tumpukan di layar */
export const lebarUnit = (W: number) => TS.unit[0].w * letakTumpuk(0, 0, W).s;
