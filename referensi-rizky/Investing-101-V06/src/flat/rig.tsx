import React from 'react';
import { B, lerp, mixHex } from '../theme';
import { BAGIAN, KEPALA, type NamaKepala } from './priaBiru.gen';
import { KEPALA_LAIN, type NamaSetKepala } from './kepalaLain.gen';

/**
 * RIG TOKOH FLAT (26 Okt, uji dokumen "Investing_101_Ide_Visual_2D_Flat_Detail.md" Scene 01).
 * Bagian tubuh = lembar "structure" paket Freepik 5505147 (04_Asset/karakter-flat/), diekstrak scripts/ekstrak-rig.py.
 * Sendi: pinggul → badan → leher/kepala · bahu → siku → pergelangan · pinggul → lutut → pergelangan kaki. Satuan = satuan file Freepik
 * (tinggi tokoh ±235); `s` = piksel per satuan. Sudut = derajat rotate() SVG (+ = searah jarum jam). Tokoh menghadap KANAN (3/4):
 * paha/bahu NEGATIF = ke depan; lutut POSITIF = menekuk (kaki ke belakang); siku NEGATIF = menekuk (tangan ke depan).
 * Indeks [0] = sisi dekat (kiri layar di lembar), [1] = sisi jauh (di belakang badan).
 * Revisi Simon 26 Okt: baju gua = tunik satu bahu bertotol (screenshot), panggul menutup pangkal paha ("layering … terlihat rusak"),
 * jalan/lari dari pose kunci ("sangat kaku (patah patah)"), kepala lain untuk kelompok ("karakternya berbeda beda"), hp menghadap tokoh.
 */
type P2 = [number, number];
const AKAR: P2 = [644.75, 284]; // titik tengah dua pinggul (koordinat file)
const BAHU: [P2, P2] = [[-15.75, -42], [14.25, -42]];
const PINGGUL: [P2, P2] = [[-10.25, 0], [10.25, 0]];
const LEHER: P2 = [-0.25, -48.9];
/** ujung-ujung tiap ruas (pusat ujung membulat, diukur PCA garis luar di Studio 26 Okt) */
const RUAS = {
  lenganAtasDekat: [[612.17, 249.44], [605.61, 274.18]], lenganBawahDekat: [[604.21, 293.47], [599.0, 320.12]], tanganDekat: [[597.66, 335.4], [597.18, 344.95]],
  lenganAtasJauh: [[675.22, 248.74], [682.36, 273.22]], lenganBawahJauh: [[688.49, 290.61], [691.92, 317.54]], tanganJauh: [[694.96, 332.27], [695.89, 341.81]],
  pahaDekat: [[629.93, 301.0], [616.97, 358.56]], betisDekat: [[618.58, 384.38], [608.27, 431.96]],
  pahaJauh: [[655.66, 300.17], [661.31, 359.22]], betisJauh: [[661.28, 384.38], [663.47, 433.01]],
} as const;
const panjang = (k: keyof typeof RUAS) => Math.hypot(RUAS[k][1][0] - RUAS[k][0][0], RUAS[k][1][1] - RUAS[k][0][1]);
const sudutAsal = (k: keyof typeof RUAS) => (Math.atan2(-(RUAS[k][1][0] - RUAS[k][0][0]), RUAS[k][1][1] - RUAS[k][0][1]) * 180) / Math.PI;
export const L = { lenganAtas: panjang('lenganAtasDekat'), lenganBawah: panjang('lenganBawahDekat'), paha: (panjang('pahaDekat') + panjang('pahaJauh')) / 2,
  betis: panjang('betisDekat') };
/** telapak (sepatu kanan potongan 1, dipakai kedua kaki): poros pergelangan, tumit & ujung relatif poros (alas = +22) */
const TELAPAK = { poros: [668, 446] as P2, tumit: [-11, 22] as P2, ujung: [17, 22] as P2 };

export type Pose = {
  badan: number; kepala: number; /** skala-X kepala: 1 = menghadap kanan, −1 = menoleh ke belakang */ balik: number;
  paha: P2; lutut: P2; telapak: P2; bahu: P2; siku: P2; tangan: P2; /** angkat akar (satuan, fase melayang saat lari) */ angkat?: number;
};
export const BERDIRI: Pose = { badan: 0, kepala: 0, balik: 1, paha: [0, 0], lutut: [2, 2], telapak: [-2, -2], bahu: [4, -4], siku: [-6, -6], tangan: [0, 0] };

/* ── SIKLUS JALAN & LARI dari POSE KUNCI (kurva Catmull-Rom periodik) ──
 * u = fase siklus 0…1 untuk kaki DEKAT (u = 0 kontak tumit). Nilai: [u, paha (relatif badan), lutut, sudut telapak ABSOLUT]. */
type Kunci = [number, number, number, number][];
const JALAN: Kunci = [
  [0.0, -24, 4, -14], [0.1, -16, 16, 0], [0.25, -2, 6, 0], [0.4, 14, 4, 4], [0.5, 24, 12, 22],
  [0.6, 22, 40, 40], [0.7, 6, 62, 30], [0.85, -18, 36, 4],
];
const LARI: Kunci = [
  [0.0, -32, 18, -6], [0.12, -14, 40, 4], [0.28, 18, 16, 20], [0.4, 40, 30, 50], [0.52, 34, 95, 60],
  [0.65, -18, 112, 30], [0.8, -48, 76, 0], [0.92, -42, 30, -10],
];
const pecah = (x: number) => x - Math.floor(x);
const kurva = (k: Kunci, u: number, kol: 1 | 2 | 3) => {
  const n = k.length, v = pecah(u);
  let i = n - 1;
  for (let j = 0; j < n; j++) if (k[j][0] <= v) i = j;
  const a = k[i], b = k[(i + 1) % n], s0 = k[(i - 1 + n) % n], s1 = k[(i + 2) % n];
  const ua = a[0], ub = b[0] + (i + 1 >= n ? 1 : 0);
  const t = (v - ua) / (ub - ua);
  const p0 = s0[kol], p1 = a[kol], p2 = b[kol], p3 = s1[kol];
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
};
const kaki1 = (u: number, r: number, a: number, bdn: number) => {
  const paha = lerp(kurva(JALAN, u, 1), kurva(LARI, u, 1), r) * a;
  const lutut = 2 + lerp(kurva(JALAN, u, 2), kurva(LARI, u, 2), r) * a;
  const kakiAbs = lerp(kurva(JALAN, u, 3), kurva(LARI, u, 3), r) * a;
  return { paha, lutut, telapak: kakiAbs - (bdn + paha + lutut) };
};
/** GAYA JALAN/LARI: u = fase siklus (putaran), r = 0 jalan … 1 lari, a = amplitudo (0 = berdiri) */
export const gaya = (u: number, r: number, a: number): Pose => {
  const bdn = lerp(3, 12, r) * a;
  const d = kaki1(u, r, a, bdn), j = kaki1(u + 0.5, r, a, bdn);
  const cl = Math.cos(2 * Math.PI * (u - 0.06)); // lengan sedikit tertinggal (overlap)
  const Bh = lerp(20, 44, r) * a;
  const sk = (q: number) => -(lerp(10, 82, r) * a + 4 + lerp(16, 22, r) * a * Math.max(0, q));
  // fase melayang saat lari: sesudah ujung kaki lepas, sebelum kontak berikutnya (tiap setengah siklus)
  const h = pecah(2 * u), angkat = r * a * 7 * (h > 0.78 ? Math.sin((Math.PI * (h - 0.78)) / 0.22) : 0);
  return {
    badan: bdn, kepala: -bdn * 0.5 + 1.5 * a * Math.cos(4 * Math.PI * u), balik: 1,
    paha: [d.paha, j.paha], lutut: [d.lutut, j.lutut], telapak: [d.telapak, j.telapak],
    bahu: [Bh * cl, -Bh * cl], siku: [sk(-cl), sk(cl)], tangan: [lerp(-6, -18, r) * a, lerp(-6, -18, r) * a], angkat,
  };
};

const rad = (d: number) => (d * Math.PI) / 180;
const putar = ([x, y]: P2, d: number): P2 => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return [x * c - y * s, x * s + y * c]; };
const tambah = (a: P2, b: P2): P2 => [a[0] + b[0], a[1] + b[1]];
const arah = (d: number, l: number): P2 => [-Math.sin(rad(d)) * l, Math.cos(rad(d)) * l];
const pergelanganKaki = (p: Pose, i: 0 | 1): P2 => {
  const h = putar(PINGGUL[i], p.badan), a1 = p.badan + p.paha[i];
  return tambah(tambah(h, arah(a1, L.paha)), arah(a1 + p.lutut[i], L.betis));
};
/** panjang satu siklus (dua langkah, satuan) = 2 × jarak dua pergelangan kaki saat kontak — laju dunia → fase tanpa kaki meluncur */
export const panjangSiklus = (r: number) => {
  const p = gaya(0, r, 1);
  return 2 * Math.abs(pergelanganKaki(p, 0)[0] - pergelanganKaki(p, 1)[0]);
};

/** titik terendah telapak (satuan, relatif akar) — akar diletakkan supaya kaki terendah menapak tanah */
export const alasTerendah = (p: Pose) => {
  let maks = -1e9;
  for (const i of [0, 1] as const) {
    const pk = pergelanganKaki(p, i), a3 = p.badan + p.paha[i] + p.lutut[i] + p.telapak[i];
    for (const t of [TELAPAK.tumit, TELAPAK.ujung]) maks = Math.max(maks, tambah(pk, putar(t, a3))[1]);
  }
  return maks;
};
/** posisi pergelangan kaki sisi i (relatif akar) — untuk zoom kamera ke kaki */
export const titikKaki = (p: Pose, i: 0 | 1): P2 => pergelanganKaki(p, i);
/** posisi tangan sisi i (pegangan ponsel, satuan relatif akar) */
export const titikTangan = (p: Pose, i: 0 | 1): P2 => {
  const S = putar(BAHU[i], p.badan), a1 = p.badan + p.bahu[i];
  const E = tambah(S, arah(a1, L.lenganAtas)), a2 = a1 + p.siku[i];
  const Wr = tambah(E, arah(a2, L.lenganBawah));
  return tambah(Wr, arah(a2 + p.tangan[i], 7));
};
/** pusat kepala (satuan relatif akar) */
export const titikKepala = (p: Pose): P2 => tambah(putar(LEHER, p.badan), putar([1, -17], p.badan + p.kepala));
/** IK dua ruas lengan sisi i: tangan ke titik `t` (satuan, relatif akar) — siku ke bawah-belakang */
export const ikLengan = (p: Pose, i: 0 | 1, t: P2, tangan = 0): Pose => {
  const S = putar(BAHU[i], p.badan), a = L.lenganAtas, b = L.lenganBawah;
  const dx = t[0] - S[0], dy = t[1] - S[1];
  const d = Math.max(Math.abs(a - b) + 0.5, Math.min(a + b - 0.5, Math.hypot(dx, dy)));
  const A = Math.acos((a * a + d * d - b * b) / (2 * a * d)), dasar = Math.atan2(dy, dx);
  const calon = [dasar + A, dasar - A].map((e) => [S[0] + a * Math.cos(e), S[1] + a * Math.sin(e)] as P2);
  const E = calon.sort((u, v) => (v[1] - 0.6 * v[0]) - (u[1] - 0.6 * u[0]))[0];
  const t1 = (Math.atan2(-(E[0] - S[0]), E[1] - S[1]) * 180) / Math.PI;
  const t2 = (Math.atan2(-(t[0] - E[0]), t[1] - E[1]) * 180) / Math.PI;
  const bahu = [...p.bahu] as P2, siku = [...p.siku] as P2, tg = [...p.tangan] as P2;
  bahu[i] = t1 - p.badan; siku[i] = t2 - t1; tg[i] = tangan;
  return { ...p, bahu, siku, tangan: tg };
};

/* ── KOSTUM: token warna (ekstrak-rig.py) → warna ── */
export type Kostum = 'kini' | 'dulu';
export type Warna = { kulit: string; rambut: string; baju: string; celanaAtas: string; celanaBawah: string; kilau: string; kerah: string;
  sepatu: [string, string, string]; tunik: string; totol: string };
const KULIT = '#FFAC9C';
/** tunik gua (screenshot Simon 26 Okt): kuning bertotol cokelat — warna diambil dari Hutan.svg (singa #F8B62A, batang pohon #4C3B2D) */
export const TUNIK = { kuning: { tunik: '#F8B62A', totol: '#4C3B2D' }, oranye: { tunik: '#EF9A03', totol: '#4C3B2D' },
  krem: { tunik: '#EDCC76', totol: '#814E21' }, cokelat: { tunik: '#B97A3E', totol: '#4C3B2D' } } as const;
export const WARNA_KOSTUM: Record<Kostum, Warna> = {
  /* investor hari ini: kemeja biru brand (aturan: investor = kemeja biru, bukan jas) */
  kini: { kulit: KULIT, rambut: B.night, baju: B.turq, celanaAtas: B.night, celanaBawah: B.night, kilau: B.blue, kerah: B.white,
    sepatu: [B.turq, B.turqLite, B.white], tunik: '', totol: '' },
  /* manusia zaman dulu: dada, lengan, kaki telanjang (bagian kemeja/celana/sepatu = kulit) + tunik satu bahu bertotol */
  dulu: { kulit: KULIT, rambut: B.night, baju: KULIT, celanaAtas: KULIT, celanaBawah: KULIT, kilau: B.blue, kerah: KULIT,
    sepatu: [KULIT, KULIT, mixHex(KULIT, '#C9705A', 0.35)], ...TUNIK.kuning },
};
const ganti = (m: string, a: string, b: string) => m.split(a).join(b);
const CACHE = new Map<string, string>();
const warnaiMentah = (m: string, w: Warna, bawah = false) => ([
  ['#000004', w.kulit], ['#000005', w.baju], ['#000006', bawah ? w.celanaBawah : w.celanaAtas], ['#000003', w.rambut], ['#000002', w.kilau],
  ['#000001', w.kerah], ['#000007', w.sepatu[0]], ['#000008', w.sepatu[1]], ['#000009', w.sepatu[2]],
  ['#00000A', B.night], ['#00000B', B.turq], ['#00000C', mixHex(B.night, B.gray, 0.5)],
] as const).reduce((acc, [a, b]) => ganti(acc, a, b), m);
/** pewarnaan ulang di-cache (kinerja Studio: dulu 12 penggantian string × 13 bagian × 4 tokoh tiap frame) */
const warnai = (m: string, w: Warna, bawah = false) => {
  const k = `${m.length}|${m.slice(0, 40)}|${w.kulit}${w.rambut}${w.baju}${w.celanaAtas}${w.celanaBawah}${w.kilau}${w.kerah}${w.sepatu.join('')}|${bawah}`;
  let v = CACHE.get(k);
  if (v === undefined) { v = warnaiMentah(m, w, bawah); CACHE.set(k, v); }
  return v;
};

const Ruas: React.FC<{ k: keyof typeof RUAS; w: Warna; bawah?: boolean }> = ({ k, w, bawah }) => (
  <g transform={`rotate(${-sudutAsal(k)}) translate(${-RUAS[k][0][0]} ${-RUAS[k][0][1]})`} dangerouslySetInnerHTML={{ __html: warnai(BAGIAN[k], w, bawah) }} />);

/* ── KEPALA LAIN (kelompok): poros leher = fx × lebar kotak, dy di atas dasar kotak; skala → seukuran kepala pria-biru ── */
const SET_KEPALA: Record<NamaSetKepala, { fx: number; dy: number; sk: number; leher?: [number, number] }> = {
  wanita: { fx: 0.42, dy: 1.5, sk: 0.98 },
  ikal: { fx: 0.5, dy: -6, sk: 0.78, leher: [9, 12] },
  keriting: { fx: 0.62, dy: 1.5, sk: 0.42 },
};
export type Kepala = NamaKepala | { set: NamaSetKepala; eks: 'netral' | 'kaget' };
const kulitKepala = (k: Kepala) => (typeof k === 'string' ? KULIT : KEPALA_LAIN[k.set][k.eks].kulit);

/** TOKOH — akar (titik tengah pinggul) di (x, y) piksel; `tanah` = y garis tanah → akar diturunkan/dinaikkan supaya menapak */
export const Tokoh: React.FC<{
  /** penanda tokoh (kunci React) */ id?: string; x: number; tanah: number; s: number; pose: Pose; kostum: Kostum; warna?: Partial<Warna>;
  kepala?: Kepala; kepala2?: { nama: Kepala; t: number }; ponsel?: boolean; cermin?: boolean; alfa?: number;
}> = ({ x, tanah, s, pose: p, kostum, warna, kepala = 'netral', kepala2, ponsel, cermin, alfa = 1 }) => {
  const kl = warna?.kulit ?? kulitKepala(kepala);
  const dasar = WARNA_KOSTUM[kostum];
  const w: Warna = { ...dasar, ...(kostum === 'dulu' ? { baju: kl, celanaAtas: kl, celanaBawah: kl, kerah: kl, sepatu: [kl, kl, mixHex(kl, '#C9705A', 0.35)] } : {}),
    kulit: kl, ...warna } as Warna;
  const y = tanah - (alasTerendah(p) - (p.angkat ?? 0)) * s;
  const lengan = (i: 0 | 1) => {
    const [atas, bawah, tg] = i === 0 ? (['lenganAtasDekat', 'lenganBawahDekat', 'tanganDekat'] as const) : (['lenganAtasJauh', 'lenganBawahJauh', 'tanganJauh'] as const);
    const abs = p.badan + p.bahu[i] + p.siku[i] + p.tangan[i];
    return (
      <g transform={`translate(${BAHU[i][0]} ${BAHU[i][1]}) rotate(${p.bahu[i]})`}>
        <Ruas k={atas} w={w} />
        <g transform={`translate(0 ${L.lenganAtas}) rotate(${p.siku[i]})`}>
          <Ruas k={bawah} w={w} />
          <g transform={`translate(0 ${L.lenganBawah}) rotate(${p.tangan[i]})`}>
            {/* hp MENGHADAP tokoh (Simon 26 Okt): yang terlihat penonton = punggung hp + kamera */}
            {ponsel && i === 0 ? <PunggungHp sudut={-abs - 18} /> : null}
            <Ruas k={tg} w={w} />
          </g>
        </g>
      </g>);
  };
  const kaki = (i: 0 | 1) => {
    const [paha, betis] = i === 0 ? (['pahaDekat', 'betisDekat'] as const) : (['pahaJauh', 'betisJauh'] as const);
    return (
      <g transform={`translate(${PINGGUL[i][0]} ${PINGGUL[i][1]}) rotate(${p.paha[i]})`}>
        <Ruas k={paha} w={w} />
        <g transform={`translate(0 ${L.paha}) rotate(${p.lutut[i]})`}>
          <g transform={`translate(0 ${L.betis}) rotate(${p.telapak[i]}) translate(${-TELAPAK.poros[0]} ${-TELAPAK.poros[1]})`}
            dangerouslySetInnerHTML={{ __html: warnai(BAGIAN.kaki, w) }} />
          <Ruas k={betis} w={w} bawah />
        </g>
      </g>);
  };
  const kpl = (k: Kepala, op?: number) => {
    if (typeof k === 'string') return (
      <g opacity={op} transform={`translate(${-KEPALA[k].leher[0]} ${-KEPALA[k].leher[1]})`} dangerouslySetInnerHTML={{ __html: warnai(KEPALA[k].markup, w) }} />);
    const v = KEPALA_LAIN[k.set][k.eks], c = SET_KEPALA[k.set], [x0, , x1, y1] = v.kotak;
    const px = x0 + c.fx * (x1 - x0), py = y1 - c.dy;
    return (
      <g opacity={op}>
        {c.leher ? <rect x={-c.leher[0] / 2} y={-c.leher[1] + 2} width={c.leher[0]} height={c.leher[1] + 3} rx={2} fill={v.kulit} /> : null}
        <g transform={`scale(${c.sk}) translate(${-px} ${-py})`} dangerouslySetInnerHTML={{ __html: v.markup }} />
      </g>);
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${cermin ? -s : s} ${s})`} opacity={alfa < 1 ? alfa : undefined}>
      <g transform={`rotate(${p.badan})`}>
        {lengan(1)}
        {kaki(1)}
        {kaki(0)}
        {/* PANGGUL: menutup pangkal kedua paha (dulu paha berputar di belakang badan → pinggul "jam pasir" & celah V) */}
        {kostum === 'kini' ? <path d="M -21 -8 L 21 -8 L 21 4 Q 21 12 12 12 L -12 12 Q -21 12 -21 4 Z" fill={w.celanaAtas} /> : null}
        <g transform={`translate(${-AKAR[0]} ${-AKAR[1]})`} dangerouslySetInnerHTML={{ __html: warnai(BAGIAN.torso, w) }} />
        {kostum === 'dulu' ? <TunikGua w={w} /> : null}
        <g transform={`translate(${LEHER[0]} ${LEHER[1]}) rotate(${p.kepala}) scale(${p.balik} 1)`}>
          {kepala2 && kepala2.t >= 1 ? null : kpl(kepala, kepala2 && kepala2.t > 0 ? 1 : undefined)}
          {kepala2 && kepala2.t > 0 ? kpl(kepala2.nama, kepala2.t >= 1 ? undefined : kepala2.t) : null}
        </g>
        {lengan(0)}
      </g>
    </g>);
};

/** punggung hp (satuan rig) — layar menghadap wajah tokoh */
const PunggungHp: React.FC<{ sudut: number }> = ({ sudut }) => (
  <g transform={`translate(1 6) rotate(${sudut})`}>
    <rect x={-6.5} y={-13} width={13} height={24} rx={2.6} fill={B.night} />
    <rect x={-4.6} y={-11} width={5} height={6.4} rx={1.6} fill={mixHex(B.night, B.gray, 0.45)} />
    <circle cx={-2.1} cy={-9.4} r={1.1} fill={B.night} />
    <circle cx={-2.1} cy={-6.6} r={1.1} fill={B.night} />
  </g>);

/** TUNIK GUA satu bahu (screenshot Simon): tali di bahu JAUH, bahu dekat telanjang, rok bergerigi sampai pertengahan paha, totol cokelat.
 *  Koordinat relatif akar (titik tengah pinggul); rok ikut badan, paha mengayun di baliknya. */
const TunikGua: React.FC<{ w: Warna }> = ({ w }) => {
  const gigi: string[] = [];
  const xs = [25, 19, 13, 7, 1, -5, -11, -17, -24];
  xs.forEach((x, k) => gigi.push(`L ${x} ${k % 2 ? 38 : 30}`));
  const d = `M 7 -51 L 20 -50 Q 24 -45 22 -36 L 21 -10 L 23 14 L 25 30 ${gigi.join(' ')} L -22 14 L -20 -10 L -19 -33 Q -6 -38 7 -51 Z`;
  const totol: [number, number, number, number][] = [[-10, -27, 3.6, 3], [7, -21, 4.6, 3.8], [15, -38, 2.6, 2.2], [-12, -8, 4, 3.4], [11, 1, 3.2, 2.8],
    [-3, 10, 5, 4], [16, 18, 3.4, 2.8], [-15, 22, 3, 2.6], [5, 26, 3.6, 3], [4, -40, 2.2, 1.8]];
  return (
    <g>
      <path d={d} fill={w.tunik} />
      {/* totol sudah di dalam bentuk tunik (tanpa clipPath — kinerja Studio) */}
      {totol.map(([x, y, rx, ry], k) => <ellipse key={k} cx={x} cy={y} rx={rx} ry={ry} fill={w.totol} transform={`rotate(${(k * 37) % 60 - 30} ${x} ${y})`} />)}
    </g>);
};
