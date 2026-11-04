import React from 'react';
import { B } from '../theme';
import { BAYANGAN } from './rigTegak';
import { SINGA_LENTUR, SINGA_TETAP, type JalurSinga } from './singa.gen';

/**
 * RIG SINGA (Simon 26 Okt malam: "Lanjut rig dan animasi singa dari Singa.svg yang baru"; file baru dikirim dengan "mungkin bisa kamu riging juga
 * agar gerakannya terlihat lebih natural"). Gambar = Singa.svg APA ADANYA (public/flat/singa-simon.svg → singa.gen.ts), urutan lapis file:
 * kaki belakang jauh · badan · kaki depan dekat · kaki depan jauh · ekor + jambul · surai + kepala · kaki belakang dekat.
 *
 * KERANGKA (satuan file 1920 × 1080, terukur dari profil lebar tiap kaki): tiap kaki 3 ruas — pinggul/bahu → lutut/pergelangan → hock/pangkal
 * telapak → telapak. Titik-titik jalur kaki DILENTURKAN (bobot halus di tiap sendi, seperti pin Puppet/bone), bukan dipotong per ruas.
 *  · MENAPAK: ujung jari diam di tanah (titik dunia tetap → tidak meluncur), telapak rata, tumit terangkat menjelang lepas; dua ruas atas = IK.
 *  · MELAYANG: sudut ruas bergerak halus (Hermite) dari pose lepas ke pose mendarat berikutnya + lipatan (pergelangan depan melipat ke
 *    belakang, lutut-hock belakang melipat ke depan).
 *  · Badan: turun-naik 2× per siklus, mengangguk (hidung naik saat kaki belakang menapak, turun saat kaki depan), meregang/merapat.
 *  · Surai+kepala menempel di leher, menstabilkan diri (berputar melawan anggukan badan, sedikit terlambat).
 *  · Ekor: rantai 12 ruas, gelombang merambat dari pangkal ke ujung; jambul tertinggal paling akhir.
 * LARI = gallop berputar: belakang jauh 0 · belakang dekat 0,08 · depan jauh 0,42 · depan dekat 0,50 (dua fase melayang).
 * Panjang langkah = laju × frame siklus × porsi menapak → kaki menapak tidak meluncur pada laju berapa pun (laju diambil dari adegan).
 */
type P2 = [number, number];
const RAD = Math.PI / 180;
const klem = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const halus = (e0: number, e1: number, x: number) => { const t = klem((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
const kurang = (a: P2, b: P2): P2 => [a[0] - b[0], a[1] - b[1]];
const pjg = (v: P2) => Math.hypot(v[0], v[1]);
const arah = (v: P2) => Math.atan2(v[1], v[0]) / RAD;
const putar = (p: P2, c: P2, deg: number): P2 => {
  const r = deg * RAD, co = Math.cos(r), si = Math.sin(r), x = p[0] - c[0], y = p[1] - c[1];
  return [c[0] + x * co - y * si, c[1] + x * si + y * co];
};

/* ── KERANGKA (satuan file) ── */
export type NamaKaki = 'kakiBelakangJauh' | 'kakiBelakangDekat' | 'kakiDepanJauh' | 'kakiDepanDekat';
type Kaki = {
  sendi: [P2, P2, P2]; // pinggul/bahu · lutut/pergelangan · hock/pangkal telapak
  jari: P2; // ujung depan telapak di tanah (titik tumpu dunia + poros tumit terangkat)
  tumit: P2; // ujung belakang telapak (untuk cek jarak tanah)
  alas: P2; // tengah alas telapak
  fase: number; jenis: 'depan' | 'belakang';
  pita: [number, number]; // lebar peralihan bobot di sendi 1 & 2 (± satuan)
};
export const KAKI_SINGA: Record<NamaKaki, Kaki> = {
  kakiBelakangJauh: { sendi: [[930, 600], [905, 745], [790, 862]], jari: [878, 925], tumit: [760, 870], alas: [832, 925], fase: 0, jenis: 'belakang', pita: [34, 22] },
  kakiBelakangDekat: { sendi: [[711, 645], [720, 782], [624, 866]], jari: [711, 928], tumit: [594, 870], alas: [666, 928], fase: 0.05, jenis: 'belakang', pita: [34, 22] },
  kakiDepanJauh: { sendi: [[1230, 590], [1148, 830], [1163, 885]], jari: [1246, 926.8], tumit: [1123, 890], alas: [1192, 926.8], fase: 0.58, jenis: 'depan', pita: [26, 16] },
  kakiDepanDekat: { sendi: [[1065, 628], [1023, 837], [1042, 893]], jari: [1122, 929], tumit: [1000, 900], alas: [1069, 929], fase: 0.5, jenis: 'depan', pita: [26, 16] },
};
const URUT_KAKI: NamaKaki[] = ['kakiBelakangJauh', 'kakiBelakangDekat', 'kakiDepanJauh', 'kakiDepanDekat'];
/** titik acuan: x = tepi kiri ekor (file 514) · y = tanah (alas telapak terendah, file 929) */
export const ACUAN_SINGA: P2 = [514, 929];
const PUSAT_BADAN: P2 = [975, 560];
const LEHER: P2 = [1130, 470];
const PANGKAL_EKOR: P2 = [696.5, 591.5];
const PUSAT_BAYANGAN: P2 = [984, 600]; // tengah antara pinggul & bahu

/* ── GAYA LARI — DIUKUR dari referensi 12 frame Simon (siluet singa berlari, grid 10 px; scratchpad singaRef): ──
 *  · kaki belakang mendarat f6 (ψ 0), lepas f8 → menapak ±0,2 siklus; depan dekat mendarat f12 (ψ 0,5), depan jauh f1 (ψ 0,58), lepas f3 → ±0,25;
 *  · MELAYANG TERENTANG f9–f11 (ψ 0,25–0,5): kaki belakang lurus ke belakang ±50°, depan lurus ke depan ±60°, badan memanjang & rata;
 *  · MELAYANG TERLIPAT f4–f5 (ψ 0,83–1,0): keempat kaki terlipat di bawah perut (belakang ke depan, depan ke belakang), punggung melengkung;
 *  · hidung naik saat kaki belakang menapak (f6–f8), turun saat depan menapak (f12–f2); ekor lurus terseret ke belakang. */
export const GALLOP = {
  fase: { naik: 0.37 }, // puncak melayang terentang (0,37) & terlipat (0,87)
  turun: 14, // badan merendah saat berlari (satuan)
  bob: 20, // turun-naik ± — referensi: badan NAIK saat melayang (terentang & terlipat), turun saat menapak
  angguk: 5, // derajat ±
  regang: 0.07, // badan meregang (terentang) / merapat (terlipat) ± skala x
  tumit: 26, // derajat tumit terangkat menjelang lepas
  /** bentuk saat melayang: [ruas 0 bahu/pinggul · 1 tengah · 2 telapak, derajat, mulai, puncak, selesai] (p 0 lepas … 1 mendarat) */
  lipat: {
    // depan: terlipat ke belakang dulu (melayang terlipat), lalu meraih lurus jauh ke depan (melayang terentang) sebelum mendarat
    depan: [[0, 15, 0, 0.15, 0.4], [0, -55, 0.35, 0.75, 1], [1, 90, 0, 0.22, 0.6], [2, 100, 0, 0.25, 0.62]],
    // belakang: menendang lurus ke belakang (melayang terentang), lalu terlipat maju ke bawah perut (melayang terlipat)
    belakang: [[0, 60, 0, 0.25, 0.55], [2, 25, 0, 0.25, 0.5], [0, -30, 0.5, 0.8, 1], [1, 40, 0.5, 0.75, 1], [2, -30, 0.5, 0.75, 1]],
  } as Record<'depan' | 'belakang', [number, number, number, number, number][]>,
  /** bahu/pinggul terangkat saat melayang (skapula/panggul): minimal (satuan) — ditambah otomatis bila telapak masih menyentuh tanah */
  angkat: { depan: 40, belakang: 15 } as Record<'depan' | 'belakang', number>,
  tangen: 30, // derajat — batas tangen Hermite di ujung ayunan
  bebas: 30, // jarak bebas telapak dari tanah di tengah ayunan (satuan)
  maju: { depan: 18, belakang: -6 } as Record<'depan' | 'belakang', number>, // pusat sapuan telapak relatif pose dasar (+ = depan)
  /** porsi menapak pada gallop penuh (referensi: belakang ±0,2, depan ±0,25) */
  menapak: { depan: 0.25, belakang: 0.2 } as Record<'depan' | 'belakang', number>,
  ekorLurus: 150, // derajat — lengkung ekor dibuka sepanjang rantai → ekor ramping terseret lurus ke belakang setinggi pinggul (banding referensi)
  ekorPangkal: 0, // derajat — pangkal ekor tidak diputar (dicoba −50…+60: ekor terseret di tanah / tegak ke atas)
};
export const gayaSinga = (V: number, jenis: 'depan' | 'belakang' = 'depan') => {
  const a = halus(0, 14, V);
  const N = V < 18 ? lerp(44, 32, V / 18) : lerp(32, 30, klem((V - 18) / 22)); // referensi: sapuan menapak ±27° → kadens ±30 f pada gallop penuh
  const beta = lerp(0.5, GALLOP.menapak[jenis], klem(V / 34));
  return { a, N, beta, D: beta * V * N };
};

/* ── SIMULASI (sekali per adegan): X = px dunia titik acuan, psi = fase siklus, V = laju satuan file/frame ── */
export type JejakSinga = { X: Float64Array; psi: Float64Array; V: Float64Array; s: number };
export const simulasiSinga = (n: number, v: (f: number) => number, s: number, x0: number, psi0 = 0): JejakSinga => {
  const X = new Float64Array(n), psi = new Float64Array(n), V = new Float64Array(n);
  let x = x0, q = psi0;
  for (let f = 0; f < n; f++) {
    const vv = v(f);
    x += vv; q += 1 / gayaSinga(vv / s).N;
    X[f] = x; psi[f] = q; V[f] = vv / s;
  }
  return { X, psi, V, s };
};
const sisip = (arr: Float64Array, t: number) => {
  const tt = klem(t, 0, arr.length - 1), i = Math.min(arr.length - 2, Math.floor(tt));
  return lerp(arr[i], arr[i + 1], tt - i);
};
/** frame (pecahan) saat fase = q — psi naik monoton */
const waktuFase = (j: JejakSinga, q: number) => {
  const P = j.psi;
  if (q <= P[0]) return (q - P[0]) / (P[1] - P[0]);
  if (q >= P[P.length - 1]) return P.length - 1 + (q - P[P.length - 1]) / (P[P.length - 1] - P[P.length - 2]);
  let lo = 0, hi = P.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m] <= q) lo = m; else hi = m; }
  return lo + (q - P[lo]) / (P[hi] - P[lo]);
};

/* ── BADAN ── */
type Badan = { dy: number; angguk: number; regang: number; peta: (p: P2) => P2; tf: string };
const badanPada = (psi: number, a: number): Badan => {
  const G = GALLOP;
  const dy = a * (G.turun - G.bob * Math.cos(4 * Math.PI * (psi - G.fase.naik)));
  const angguk = -a * G.angguk * Math.cos(2 * Math.PI * (psi - 0.1)); // − = hidung naik (kaki belakang menapak), + = turun (depan menapak)
  const regang = 1 + a * G.regang * Math.cos(2 * Math.PI * (psi - G.fase.naik));
  const C = PUSAT_BADAN;
  const peta = (p: P2): P2 => {
    const q = putar([C[0] + (p[0] - C[0]) * regang, p[1]], C, angguk);
    return [q[0], q[1] + dy];
  };
  return { dy, angguk, regang, peta, tf: `translate(${C[0]} ${C[1] + dy}) rotate(${angguk}) scale(${regang} 1) translate(${-C[0]} ${-C[1]})` };
};

/* ── KAKI ── */
type SudutKaki = { A: [number, number, number]; H: P2; jangkau: boolean };
const kerangka = (k: Kaki) => {
  const [h, j1, j2] = k.sendi;
  const l1 = pjg(kurang(j1, h)), l2 = pjg(kurang(j2, j1));
  const a1 = kurang(j1, h), a2 = kurang(j2, j1);
  return { l1, l2, d1: arah(a1), d2: arah(a2), d3: arah(kurang(k.jari, j2)), tanda: Math.sign(a1[0] * a2[1] - a1[1] * a2[0]) };
};
const KER = Object.fromEntries(URUT_KAKI.map((n) => [n, kerangka(KAKI_SINGA[n])])) as Record<NamaKaki, ReturnType<typeof kerangka>>;
/** IK dua ruas: pinggul H → sendi 1 → sendi 2 di T; sisi tekuk sama dengan pose dasar */
const ik = (n: NamaKaki, H: P2, T: P2): { A0: number; A1: number; jangkau: boolean } => {
  const K = KER[n], d = kurang(T, H), L0 = pjg(d);
  const L = klem(L0, Math.abs(K.l1 - K.l2) + 0.5, K.l1 + K.l2 - 0.5);
  const g = arah(d), al = Math.acos(klem((K.l1 * K.l1 + L * L - K.l2 * K.l2) / (2 * K.l1 * L), -1, 1)) / RAD;
  const tu = g - K.tanda * al;
  const J1: P2 = [H[0] + K.l1 * Math.cos(tu * RAD), H[1] + K.l1 * Math.sin(tu * RAD)];
  return { A0: tu - K.d1, A1: arah(kurang(T, J1)) - K.d2, jangkau: L0 <= K.l1 + K.l2 - 0.5 };
};
/** kaki MENAPAK pada frame t, mendarat pada tL (ujung jari diam di titik dunia saat mendarat) */
const tumpu = (j: JejakSinga, n: NamaKaki, t: number, tL: number, beta: number): SudutKaki => {
  const k = KAKI_SINGA[n], psi = sisip(j.psi, t), g = gayaSinga(sisip(j.V, t), k.jenis);
  const gL = gayaSinga(sisip(j.V, tL), k.jenis);
  const u = klem((t - tL) / Math.max(1e-6, waktuFase(j, sisip(j.psi, tL) + beta) - tL));
  const jariX = k.jari[0] + gL.a * GALLOP.maju[k.jenis] + gL.D / 2 - (sisip(j.X, t) - sisip(j.X, tL)) / j.s;
  const A2 = g.a * GALLOP.tumit * halus(0.55, 1, u); // tumit naik menjelang lepas (searah jarum jam di ujung jari)
  const jari: P2 = [jariX, k.jari[1]];
  const T = putar([jari[0] + k.sendi[2][0] - k.jari[0], jari[1] + k.sendi[2][1] - k.jari[1]], jari, A2);
  const H = badanPada(psi, g.a).peta(k.sendi[0]);
  const r = ik(n, H, T);
  return { A: [r.A0, r.A1, A2], H, jangkau: r.jangkau };
};
const hermite = (p0: number, m0: number, p1: number, m1: number, s: number) => {
  const s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * m0 + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * m1;
};
export const kakiSinga = (j: JejakSinga, n: NamaKaki, t: number): SudutKaki & { menapak: boolean } => {
  const k = KAKI_SINGA[n];
  const q = sisip(j.psi, t) - k.fase, c = Math.floor(q);
  const tL = waktuFase(j, c + k.fase);
  const beta = gayaSinga(sisip(j.V, tL), k.jenis).beta;
  const tT = waktuFase(j, c + k.fase + beta);
  if (t <= tT) return { ...tumpu(j, n, t, tL, beta), menapak: true };
  const tL2 = waktuFase(j, c + 1 + k.fase), beta2 = gayaSinga(sisip(j.V, tL2), k.jenis).beta;
  const e = 0.25;
  const s0 = tumpu(j, n, tT, tL, beta), s0b = tumpu(j, n, tT - e, tL, beta);
  const s1 = tumpu(j, n, tL2, tL2, beta2), s1b = tumpu(j, n, tL2 + e, tL2, beta2);
  const durasi = tL2 - tT;
  // bump 0 → 1 (di pk) → 0, landai (sin²) di antara mulai (a0) dan selesai (a1)
  const bump = (p: number, a0: number, pk: number, a1: number) => p <= a0 || p >= a1 ? 0
    : Math.sin(Math.PI * (p < pk ? (0.5 * (p - a0)) / (pk - a0) : 0.5 + (0.5 * (p - pk)) / (a1 - pk))) ** 2;
  const L = GALLOP.lipat[k.jenis];
  // tangen di ujung = kecepatan sudut saat menapak, DIBATASI ±TANGEN° (ayunan tetap menyambung tanpa melambung liar di laju tinggi)
  const m = (v: number) => klem(v * durasi, -GALLOP.tangen, GALLOP.tangen);
  const m0 = [0, 1, 2].map((i) => m((s0.A[i] - s0b.A[i]) / e)), m1 = [0, 1, 2].map((i) => m((s1b.A[i] - s1.A[i]) / e));
  const ayun = (p: number) => {
    const a = gayaSinga(sisip(j.V, tT + p * durasi)).a;
    const A = [0, 1, 2].map((i) => hermite(s0.A[i], m0[i], s1.A[i], m1[i], p) +
      L.reduce((acc, [r, deg, a0, pk, a1]) => acc + (r === i ? a * deg * bump(p, a0, pk, a1) : 0), 0)) as [number, number, number];
    return { A, a, H0: badanPada(sisip(j.psi, tT + p * durasi), a).peta(k.sendi[0]) };
  };
  // ANGKAT bahu/pinggul selama melayang = λ · sin(πp): λ SATU nilai per ayunan (bukan per frame → tanpa getar), cukup besar supaya titik
  // telapak terendah ≥ jarak bebas di seluruh ayunan (diperiksa di 13 titik), minimal angkat dasar
  let lam = 0;
  for (let i = 1; i < 14; i++) {
    const ps = i / 14, y = ayun(ps), S = sendiKaki(n, { A: y.A, H: y.H0, jangkau: true });
    const rendah = Math.max(S.jari[1], S.tumit[1], S.J2[1], S.alas[1]);
    const perlu = rendah - (k.jari[1] - y.a * GALLOP.bebas * Math.sin(Math.PI * ps));
    lam = Math.max(lam, y.a * GALLOP.angkat[k.jenis], perlu / Math.sin(Math.PI * ps));
  }
  const p = (t - tT) / durasi, y = ayun(p);
  return { A: y.A, H: [y.H0[0], y.H0[1] - lam * Math.sin(Math.PI * p)], jangkau: true, menapak: false };
};

/* ── KULIT (bobot titik per ruas, sekali) ── */
type Kulit = { x: Float32Array; y: Float32Array; b1: Float32Array; b2: Float32Array }[]; // per subjalur; b0 = 1 − b1 − b2
const bisektor = (a: P2, j: P2, b: P2): P2 => {
  const u = kurang(j, a), w = kurang(b, j), lu = pjg(u), lw = pjg(w);
  const n: P2 = [u[0] / lu + w[0] / lw, u[1] / lu + w[1] / lw], ln = pjg(n);
  return [n[0] / ln, n[1] / ln];
};
const kulitKaki = (n: NamaKaki): Kulit[] => {
  const k = KAKI_SINGA[n], [h, j1, j2] = k.sendi;
  const n1 = bisektor(h, j1, j2), n2 = bisektor(j1, j2, k.jari);
  return SINGA_LENTUR[n].map((jl) => jl.d.map((q) => {
    const m = q.length / 2, x = new Float32Array(m), y = new Float32Array(m), b1 = new Float32Array(m), b2 = new Float32Array(m);
    for (let i = 0; i < m; i++) {
      const p: P2 = [q[2 * i], q[2 * i + 1]];
      const w1 = halus(-k.pita[0], k.pita[0], (p[0] - j1[0]) * n1[0] + (p[1] - j1[1]) * n1[1]);
      const w2 = halus(-k.pita[1], k.pita[1], (p[0] - j2[0]) * n2[0] + (p[1] - j2[1]) * n2[1]);
      x[i] = p[0]; y[i] = p[1]; b1[i] = w1 * (1 - w2); b2[i] = w1 * w2;
    }
    return { x, y, b1, b2 };
  }));
};
const KULIT = Object.fromEntries(URUT_KAKI.map((n) => [n, kulitKaki(n)])) as Record<NamaKaki, Kulit[]>;
/** titik-titik sendi kaki saat ini (satuan file, koordinat grup) */
export const sendiKaki = (n: NamaKaki, s: SudutKaki) => {
  const k = KAKI_SINGA[n], [h, j1, j2] = k.sendi;
  const J1 = ((): P2 => { const v = putar(kurang(j1, h), [0, 0], s.A[0]); return [s.H[0] + v[0], s.H[1] + v[1]]; })();
  const J2 = ((): P2 => { const v = putar(kurang(j2, j1), [0, 0], s.A[1]); return [J1[0] + v[0], J1[1] + v[1]]; })();
  const ujung = (p: P2): P2 => { const v = putar(kurang(p, j2), [0, 0], s.A[2]); return [J2[0] + v[0], J2[1] + v[1]]; };
  return { H: s.H, J1, J2, jari: ujung(k.jari), tumit: ujung(k.tumit), alas: ujung(k.alas) };
};
const jalurKaki = (n: NamaKaki, s: SudutKaki) => {
  const k = KAKI_SINGA[n], [h, j1, j2] = k.sendi, S = sendiKaki(n, s);
  const c0 = Math.cos(s.A[0] * RAD), s0 = Math.sin(s.A[0] * RAD), c1 = Math.cos(s.A[1] * RAD), s1 = Math.sin(s.A[1] * RAD);
  const c2 = Math.cos(s.A[2] * RAD), s2 = Math.sin(s.A[2] * RAD);
  return KULIT[n].map((subs) => subs.map((K) => {
    let d = '';
    for (let i = 0; i < K.x.length; i++) {
      const x = K.x[i], y = K.y[i], b1 = K.b1[i], b2 = K.b2[i], b0 = 1 - b1 - b2;
      const m0x = S.H[0] + (x - h[0]) * c0 - (y - h[1]) * s0, m0y = S.H[1] + (x - h[0]) * s0 + (y - h[1]) * c0;
      const m1x = S.J1[0] + (x - j1[0]) * c1 - (y - j1[1]) * s1, m1y = S.J1[1] + (x - j1[0]) * s1 + (y - j1[1]) * c1;
      const m2x = S.J2[0] + (x - j2[0]) * c2 - (y - j2[1]) * s2, m2y = S.J2[1] + (x - j2[0]) * s2 + (y - j2[1]) * c2;
      const px = b0 * m0x + b1 * m1x + b2 * m2x, py = b0 * m0y + b1 * m1y + b2 * m2y;
      d += (i === 0 ? 'M' : i % 3 === 1 ? 'C' : ' ') + px.toFixed(1) + ',' + py.toFixed(1);
    }
    return d;
  }));
};

/* ── EKOR berantai ── */
const EKOR_RUAS = 12;
const ekorRangka = (() => {
  const q = SINGA_LENTUR.ekor[0].d[0];
  const seg = (i: number) => q.slice(2 + 6 * i - 2, 2 + 6 * i + 6); // [x0, y0, c1x, c1y, c2x, c2y, x, y]
  const bez = (s: number[], t: number): P2 => {
    const u = 1 - t;
    return [u * u * u * s[0] + 3 * u * u * t * s[2] + 3 * u * t * t * s[4] + t * t * t * s[6], u * u * u * s[1] + 3 * u * u * t * s[3] + 3 * u * t * t * s[5] + t * t * t * s[7]];
  };
  const sampel = (segs: number[][], balik: boolean) => {
    const pts: P2[] = [];
    segs.forEach((s) => { for (let i = 0; i < 40; i++) pts.push(bez(s, i / 40)); });
    pts.push(bez(segs[segs.length - 1], 1));
    if (balik) pts.reverse();
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + pjg(kurang(pts[i], pts[i - 1])));
    return (t: number): P2 => {
      const x = t * L[L.length - 1];
      let i = 1;
      while (i < L.length - 1 && L[i] < x) i++;
      const f = (x - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
      return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
    };
  };
  const dalam = sampel([seg(0), seg(1)], false); // pangkal atas → ujung
  const luar = sampel([seg(2), seg(3)], true); // pangkal bawah → ujung
  const M = 120, garis: P2[] = [];
  for (let i = 0; i <= M; i++) { const a = dalam(i / M), b = luar(i / M); garis.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); }
  const simpul = Array.from({ length: EKOR_RUAS + 1 }, (_, k) => garis[Math.round((k / EKOR_RUAS) * M)]);
  const param = (p: P2) => {
    let best = 0, bd = 1e9;
    garis.forEach((g, i) => { const d = pjg(kurang(p, g)); if (d < bd) { bd = d; best = i; } });
    return best / M;
  };
  return { garis, simpul, param };
})();
const kulitEkor = (nama: 'ekor' | 'jambul') => SINGA_LENTUR[nama].map((jl) => jl.d.map((q) => {
  const m = q.length / 2, x = new Float32Array(m), y = new Float32Array(m), t = new Float32Array(m);
  for (let i = 0; i < m; i++) { x[i] = q[2 * i]; y[i] = q[2 * i + 1]; t[i] = nama === 'jambul' ? 1 : ekorRangka.param([x[i], y[i]]); }
  return { x, y, t };
}));
const KULIT_EKOR = { ekor: kulitEkor('ekor'), jambul: kulitEkor('jambul') };
const ekorSudut = (psi: number, a: number) => {
  // gelombang merambat pangkal → ujung (tertinggal 0,55 siklus di ujung); jambul tertinggal lagi
  // ekor DILURUSKAN ke belakang saat berlari (referensi: ekor lurus terseret) — lengkung gambar dibuka −ekorLurus° merata sepanjang rantai,
  // pangkal diangkat sedikit, + gelombang merambat pangkal → ujung
  const del = Array.from({ length: EKOR_RUAS }, (_, k) => {
    const t = k / EKOR_RUAS;
    const gel = a * 34 * Math.sin(2 * Math.PI * (psi - 0.15 - 0.55 * t)) / EKOR_RUAS;
    return gel + (k === 0 ? a * (GALLOP.ekorPangkal + 5 * Math.sin(2 * Math.PI * (psi - 0.1))) : (-a * GALLOP.ekorLurus) / (EKOR_RUAS - 1));
  });
  return { del, jambul: a * 16 * Math.sin(2 * Math.PI * (psi - 0.15 - 0.75)) };
};
const jalurEkor = (nama: 'ekor' | 'jambul', psi: number, a: number) => {
  const { del, jambul } = ekorSudut(psi, a), S = ekorRangka.simpul;
  return KULIT_EKOR[nama].map((subs) => subs.map((K) => {
    let d = '';
    for (let i = 0; i < K.x.length; i++) {
      let p: P2 = [K.x[i], K.y[i]];
      if (nama === 'jambul') p = putar(p, S[EKOR_RUAS], jambul);
      for (let k = EKOR_RUAS - 1; k >= 0; k--) {
        const w = klem((K.t[i] - k / EKOR_RUAS) * EKOR_RUAS);
        if (w > 0) p = putar(p, S[k], del[k] * w);
      }
      d += (i === 0 ? 'M' : i % 3 === 1 ? 'C' : ' ') + p[0].toFixed(1) + ',' + p[1].toFixed(1);
    }
    return d;
  }));
};

/* ── POSE LENGKAP ── */
export type PoseSinga = { psi: number; a: number; badan: Badan; kaki: Record<NamaKaki, SudutKaki & { menapak: boolean }>; kepala: number };
export const poseSinga = (j: JejakSinga, t: number): PoseSinga => {
  const psi = sisip(j.psi, t), a = gayaSinga(sisip(j.V, t)).a, badan = badanPada(psi, a);
  const kaki = Object.fromEntries(URUT_KAKI.map((n) => [n, kakiSinga(j, n, t)])) as PoseSinga['kaki'];
  // kepala menstabilkan diri: melawan anggukan badan, sedikit terlambat, + angguk kecil 2× per siklus
  const kepala = -0.6 * badanPada(psi - 0.05, a).angguk + a * 1.5 * Math.sin(4 * Math.PI * (psi - 0.55));
  return { psi, a, badan, kaki, kepala };
};
/** pose diam (gambar Simon apa adanya) */
export const POSE_DIAM_SINGA = (): PoseSinga => {
  const badan = badanPada(0, 0);
  const kaki = Object.fromEntries(URUT_KAKI.map((n) => [n, { A: [0, 0, 0], H: KAKI_SINGA[n].sendi[0], jangkau: true, menapak: true }])) as PoseSinga['kaki'];
  return { psi: 0, a: 0, badan, kaki, kepala: 0 };
};

const Jalur: React.FC<{ jl: JalurSinga[]; d: string[][] }> = ({ jl, d }) => (
  <>{jl.map((p, i) => <path key={i} {...(p.a as React.SVGProps<SVGPathElement>)} d={d[i].map((s, k) => s + (p.z[k] ? 'Z' : '')).join('')} />)}</>);

/** SINGA ber-rig: (x, tanah) = titik acuan (tepi kiri ekor, alas telapak) di layar; s = skala */
export const SingaRig: React.FC<{ pose: PoseSinga; x: number; tanah: number; s: number; guide?: boolean; bayangan?: boolean }> = ({ pose, x, tanah, s, guide, bayangan = true }) => {
  const { badan } = pose;
  const kakiD = (n: NamaKaki) => <Jalur jl={SINGA_LENTUR[n]} d={jalurKaki(n, pose.kaki[n])} />;
  const leher = badan.peta(LEHER), pangkal = badan.peta(PANGKAL_EKOR);
  const tfKepala = `translate(${leher[0]} ${leher[1]}) rotate(${badan.angguk + pose.kepala}) translate(${-LEHER[0]} ${-LEHER[1]})`;
  const tfEkor = `translate(${pangkal[0]} ${pangkal[1]}) rotate(${badan.angguk}) translate(${-PANGKAL_EKOR[0]} ${-PANGKAL_EKOR[1]})`;
  // bayangan: pusat = tengah badan, lebar = telapak terjauh + tepi (aturan bayangan tokoh)
  const cx = badan.peta(PUSAT_BAYANGAN)[0];
  const ujung = URUT_KAKI.flatMap((n) => { const S = sendiKaki(n, pose.kaki[n]); return [S.jari[0], S.tumit[0]]; });
  const rx = Math.max(...ujung.map((u) => Math.abs(u - cx))) + BAYANGAN.tepi;
  return (
    <g transform={`translate(${x} ${tanah}) scale(${s}) translate(${-ACUAN_SINGA[0]} ${-ACUAN_SINGA[1]})`}>
      {bayangan ? <ellipse cx={cx} cy={ACUAN_SINGA[1]} rx={rx} ry={rx * BAYANGAN.rasio} fill={B.night} opacity={BAYANGAN.alfa} /> : null}
      {kakiD('kakiBelakangJauh')}
      <g transform={badan.tf} dangerouslySetInnerHTML={{ __html: SINGA_TETAP.badan }} />
      {kakiD('kakiDepanDekat')}
      {kakiD('kakiDepanJauh')}
      <g transform={tfEkor}>
        <Jalur jl={SINGA_LENTUR.ekor} d={jalurEkor('ekor', pose.psi, pose.a)} />
        <Jalur jl={SINGA_LENTUR.jambul} d={jalurEkor('jambul', pose.psi, pose.a)} />
      </g>
      <g transform={tfKepala} dangerouslySetInnerHTML={{ __html: SINGA_TETAP.kepala }} />
      {kakiD('kakiBelakangDekat')}
      {guide ? <GuideSinga pose={pose} /> : null}
    </g>);
};

/** guide: tanah, kerangka kaki (sendi = lingkaran), rantai ekor, poros badan/leher */
export const GuideSinga: React.FC<{ pose: PoseSinga }> = ({ pose }) => {
  const { badan } = pose;
  const pangkal = badan.peta(PANGKAL_EKOR);
  return (
    <g fill="none" strokeWidth={3}>
      <line x1={300} x2={1700} y1={ACUAN_SINGA[1]} y2={ACUAN_SINGA[1]} stroke={B.gray} strokeDasharray="10 8" />
      {URUT_KAKI.map((n) => {
        const S = sendiKaki(n, pose.kaki[n]), w = KAKI_SINGA[n].jenis === 'depan' ? B.blue : B.turq;
        const titik = [S.H, S.J1, S.J2, S.jari];
        return (
          <g key={n} stroke={w} opacity={n.endsWith('Jauh') ? 0.55 : 1}>
            <polyline points={titik.map((p) => p.join(',')).join(' ')} />
            <line x1={S.J2[0]} y1={S.J2[1]} x2={S.tumit[0]} y2={S.tumit[1]} />
            {titik.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === 0 ? 12 : 9} fill={B.white} />)}
            {pose.kaki[n].menapak ? <circle cx={S.jari[0]} cy={S.jari[1]} r={5} fill={w} /> : null}
          </g>);
      })}
      <g stroke={B.orange}>
        {ekorRangka.simpul.map((p, i) => <circle key={i} cx={putar(p, PANGKAL_EKOR, badan.angguk)[0] + pangkal[0] - PANGKAL_EKOR[0]}
          cy={putar(p, PANGKAL_EKOR, badan.angguk)[1] + pangkal[1] - PANGKAL_EKOR[1]} r={4} fill={B.white} />)}
      </g>
      {[PUSAT_BADAN, LEHER].map((p, i) => { const q = badan.peta(p); return <circle key={i} cx={q[0]} cy={q[1]} r={10} stroke={B.night} fill={B.white} />; })}
    </g>);
};
