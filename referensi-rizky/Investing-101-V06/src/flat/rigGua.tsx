import React from 'react';
import { B, lerp, mixHex } from '../theme';
import { GUA2 } from './guaSimon2.gen';
import { KEPALA, type NamaKepala } from './priaBiru.gen';
import { KEPALA_LAIN, type NamaSetKepala } from './kepalaLain.gen';
import { Bayangan, lebarBayangan } from './rigTegak';

/**
 * RIG TOKOH GUA v2 (26 Okt sore) — PERSIS `tokoh gua.svg` Simon: "Aku mau kamu menerapkannya persis seperti char yang aku kirimkan (dari segi
 * layering, cara menyambung tiap anggota tubuh, dllnya)". Gambar = tokoh terakit (pose melangkah) dari scripts/ekstrak-gua2.py:
 *  · SAMBUNGAN: tiap sendi = lingkaran di ujung ruas yang saling menumpuk; titik putar = pusat lingkaran itu (diukur getBBox Studio).
 *  · LAPIS: urutan file Simon apa adanya (bawah → atas): kepala · lengan kanan-layar · badan · panggul · telapak kanan · telapak kiri ·
 *    paha kiri · paha kanan · betis kiri · betis kanan · tunik · lengan atas kiri · lengan bawah kiri · tangan kiri.
 *    Urutan ini memotong rantai (telapak di bawah paha, betis di atas paha), jadi tiap bagian digambar sebagai SAUDARA dengan transform
 *    rantai tersusun `rotate(paha, pinggul) rotate(lutut, lutut) …` (setara grup bersarang CharacterRig, urutan lapis bebas).
 * Sudut pose = ABSOLUT terhadap tegak (0 = ke bawah, + = searah jarum jam), berantai. Sudut gambar (pose melangkah Simon) dikurangkan.
 * Indeks [0] = kiri layar (sisi dekat, lengan di depan tunik), [1] = kanan layar (jauh, lengan di belakang badan).
 */
type P2 = [number, number];
const J = {
  bahu: [[139.9, 103.1], [223.5, 103.4]] as [P2, P2],
  siku: [[96.6, 145.1], [249.4, 169.6]] as [P2, P2], sikuB: [[96.9, 145.7], [249.5, 169.8]] as [P2, P2],
  perg: [[130.5, 206.5], [303.1, 213.9]] as [P2, P2], tangan: [[127.9, 200.4], [300.1, 211.5]] as [P2, P2],
  pinggul: [[163.4, 262.8], [199.9, 272.8]] as [P2, P2],
  lutut: [[129.5, 364.7], [261.4, 361.5]] as [P2, P2], lututB: [[129.4, 362.9], [260.4, 366.5]] as [P2, P2],
  pk: [[50.8, 418.7], [278.6, 461.3]] as [P2, P2], kaki: [[52.2, 418.0], [279.0, 463.4]] as [P2, P2],
  alas: [[[6.85, 427.24], [50.41, 497.05]], [[263.0, 506.82], [345.29, 506.62]]] as [P2, P2][], // tumit → ujung (sisi bawah alas)
  leher: [180.2, 96] as P2,
};
const H: P2 = [(J.pinggul[0][0] + J.pinggul[1][0]) / 2, (J.pinggul[0][1] + J.pinggul[1][1]) / 2]; // akar = tengah dua pinggul
const deg = (r: number) => (r * 180) / Math.PI, rad = (d: number) => (d * Math.PI) / 180;
const arahRuas = (a: P2, b: P2) => deg(Math.atan2(-(b[0] - a[0]), b[1] - a[1])); // 0 = tegak ke bawah
const arahAlas = ([a, b]: [P2, P2]) => deg(Math.atan2(b[1] - a[1], b[0] - a[0])); // 0 = datar, ujung ke kanan
const dua = (f: (i: 0 | 1) => number): P2 => [f(0), f(1)];
/** sudut GAMBAR Simon (absolut) */
const G = {
  paha: dua((i) => arahRuas(J.pinggul[i], J.lututB[i])), betis: dua((i) => arahRuas(J.lututB[i], J.kaki[i])), // arah ke titik putar berikutnya
  kaki: dua((i) => arahAlas(J.alas[i])),
  la: dua((i) => arahRuas(J.bahu[i], J.siku[i])), lb: dua((i) => arahRuas(J.sikuB[i], J.perg[i])),
};
export const L = { lenganAtas: Math.hypot(J.siku[0][0] - J.bahu[0][0], J.siku[0][1] - J.bahu[0][1]),
  lenganBawah: Math.hypot(J.perg[0][0] - J.sikuB[0][0], J.perg[0][1] - J.sikuB[0][1]) };
const putar = ([x, y]: P2, d: number, [cx, cy]: P2): P2 => {
  const c = Math.cos(rad(d)), s = Math.sin(rad(d)), dx = x - cx, dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
};

export type Pose = {
  badan: number; kepala: number; balik: number;
  paha: P2; lutut: P2; telapak: P2; bahu: P2; siku: P2; tangan: P2; angkat?: number;
};
/** pose GAMBAR Simon persis (uji: harus identik dengan tokoh gua.svg) */
export const POSE_GAMBAR: Pose = { badan: 0, kepala: 0, balik: 1, paha: [G.paha[0], G.paha[1]],
  lutut: [G.betis[0] - G.paha[0], G.betis[1] - G.paha[1]], telapak: [G.kaki[0] - G.betis[0], G.kaki[1] - G.betis[1]],
  bahu: [G.la[0], G.la[1]], siku: [G.lb[0] - G.la[0], G.lb[1] - G.la[1]], tangan: [0, 0] };
/** BERDIRI: kaki lurus sedikit terbuka, telapak datar, lengan menggantung sedikit menekuk */
export const BERDIRI: Pose = { badan: 0, kepala: 0, balik: 1, paha: [4, -4], lutut: [1, 1], telapak: [-5, 3], bahu: [10, -10], siku: [-10, -6], tangan: [0, 0] };
const campur2 = (a: P2, b: P2, t: number): P2 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const campurPose = (a: Pose, b: Pose, t: number): Pose => ({
  badan: lerp(a.badan, b.badan, t), kepala: lerp(a.kepala, b.kepala, t), balik: lerp(a.balik, b.balik, t),
  paha: campur2(a.paha, b.paha, t), lutut: campur2(a.lutut, b.lutut, t), telapak: campur2(a.telapak, b.telapak, t),
  bahu: campur2(a.bahu, b.bahu, t), siku: campur2(a.siku, b.siku, t), tangan: campur2(a.tangan, b.tangan, t),
  angkat: lerp(a.angkat ?? 0, b.angkat ?? 0, t),
});

/* ── SIKLUS dari referensi Simon (26 Okt): [u, paha, lutut, telapak ABSOLUT] untuk kaki yang di u = 0 KONTAK di depan.
 * JALAN: kontak (tumit menyentuh, ujung naik) → turun/recoil (lutut meredam, badan terendah) → lewat/passing (kaki tumpu tegak) →
 *        naik/high-point (tumit terangkat, badan tertinggi) → kaki belakang: lepas ujung → angkat → lewat (lutut paling tekuk) → menjangkau.
 * LARI:  kontak → redam dalam → dorong → lepas ujung/melayang → tumit menendang ke belakang → lewat (telapak tinggi) → lutut terdorong ke
 *        depan → menjangkau. Badan condong, siku ±90°. */
type Kunci = [number, number, number, number][];
export const JALAN: Kunci = [
  [0.0, -20, 9, -12], [0.125, -23, 36, 0], [0.25, 1, 8, 0], [0.375, 15, 5, 8],
  [0.5, 25, 6, 28], [0.625, 18, 48, 38], [0.75, -4, 62, 22], [0.875, -22, 30, 0],
];
export const LARI: Kunci = [
  [0.0, -32, 38, -1], [0.1, -27, 55, 4], [0.25, 13, 16, 29], [0.38, 38, 40, 58],
  [0.5, 32, 92, 64], [0.62, -8, 118, 40], [0.76, -52, 82, 6], [0.9, -44, 30, -10],
];
/* Kunci tumpu (jalan 0–0,5 · lari 0–0,25) disetel numerik 26 Okt sore (setelah kompensasi kaki): kaki tumpu mundur RATA (tak tergelincir) dan
 * naik-turun pinggul mengikuti referensi Simon — jalan: kontak ≈3 · turun 9 (terendah) · lewat 2 · naik −1 (tertinggi); lari: kontak 10 ·
 * redam 24 (terendah) · dorong 6 · melayang −9 (puncak). (+ = turun, satuan gambar.) */
const pecah = (x: number) => x - Math.floor(x);
const kurva = (k: Kunci, u: number, kol: 1 | 2 | 3) => {
  const n = k.length, v = pecah(u);
  let i = n - 1;
  for (let j = 0; j < n; j++) if (k[j][0] <= v) i = j;
  const a = k[i], b = k[(i + 1) % n], s0 = k[(i - 1 + n) % n], s1 = k[(i + 2) % n];
  const t = (v - a[0]) / (b[0] + (i + 1 >= n ? 1 : 0) - a[0]);
  const p0 = s0[kol], p1 = a[kol], p2 = b[kol], p3 = s1[kol];
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
};
/** GAYA: u = fase siklus (putaran), r = 0 jalan … 1 lari, a = amplitudo (0 = BERDIRI) */
const gayaDasar = (u: number, r: number): Pose => {
  const bdn = lerp(3, 13, r) + lerp(1.2, 2, r) * Math.cos(4 * Math.PI * (u - 0.125)); // condong + sedikit mengangguk tiap langkah
  const kaki1 = (q: number) => {
    const paha = lerp(kurva(JALAN, q, 1), kurva(LARI, q, 1), r), lutut = lerp(kurva(JALAN, q, 2), kurva(LARI, q, 2), r);
    const kakiAbs = lerp(kurva(JALAN, q, 3), kurva(LARI, q, 3), r);
    return { paha, lutut, telapak: kakiAbs - (bdn + paha + lutut) };
  };
  const d = kaki1(u), j = kaki1(u + 0.5);
  // lengan berlawanan dengan kaki sisi yang sama, sedikit tertinggal (overlap); siku lebih menekuk saat lengan di depan
  const c = Math.cos(2 * Math.PI * (u - 0.06)), Bh = lerp(24, 42, r);
  const sk = (maju: number) => -(lerp(10, 86, r) + lerp(18, 14, r) * Math.max(0, maju));
  return {
    badan: bdn, kepala: -bdn * 0.6, balik: 1,
    paha: [d.paha, j.paha], lutut: [d.lutut, j.lutut], telapak: [d.telapak, j.telapak],
    bahu: [Bh * c, -Bh * c], siku: [sk(-c), sk(c)], tangan: [lerp(-4, -16, r), lerp(-4, -16, r)],
  };
};
/** MELAYANG (lari): dari lepas-ujung (setengah langkah h = LEPAS) sampai kontak berikutnya, tinggi badan = lengkung balistik di antara dua
 * pose tumpu (bukan ditempel ke kaki terendah — itu membuat badan TURUN saat kedua kaki di udara). */
export const LEPAS = 0.44, LOMPAT = 17;
export const gaya = (u: number, r: number, a: number): Pose => {
  const g = gayaDasar(u, r), h = pecah(2 * u);
  if (r > 0 && h > LEPAS) {
    const awal = Math.floor(2 * u) / 2, t = (h - LEPAS) / (1 - LEPAS);
    const DA = alasTerendah(gayaDasar(awal + LEPAS / 2, r)), DB = alasTerendah(gayaDasar(awal + 0.5, r));
    const D = lerp(DA, DB, t) + LOMPAT * Math.sin(Math.PI * t);
    g.angkat = r * Math.max(0, D - alasTerendah(g));
  }
  return a >= 1 ? g : campurPose(BERDIRI, g, a);
};

/* ── FK: δ = sudut pose absolut − sudut gambar; putaran relatif = δ anak − δ induk ── */
type Rantai = [number, P2, number?, number?][]; // daftar putaran (luar → dalam): [sudut, pusat, geser tegak, skala di pusat]
const rantaiG = (p: Pose, i: 0 | 1, geser: P2, skala: P2) => {
  const thAbs = p.badan + p.paha[i], shAbs = thAbs + p.lutut[i], ftAbs = shAbs + p.telapak[i];
  const laAbs = p.badan + p.bahu[i], lbAbs = laAbs + p.siku[i];
  const dTh = thAbs - G.paha[i], dSh = shAbs - G.betis[i], dFt = ftAbs - G.kaki[i];
  const dLa = laAbs - G.la[i], dLb = lbAbs - G.lb[i];
  const bdn: Rantai = [[p.badan, H]];
  // condong badan untuk KAKI diputar di pangkal paha masing-masing (bukan di tengah pinggul): dua pangkal paha di gambar berjarak 36 satuan
  // mendatar, jadi putaran di tengah menurunkan satu pinggul & menaikkan yang lain → pincang saat lari (badan condong 13°)
  const paha: Rantai = [[p.badan, J.pinggul[i]], [dTh - p.badan, J.pinggul[i], geser[i], skala[i]]];
  const betis: Rantai = [...paha, [dSh - dTh, J.lututB[i]]];
  const kaki: Rantai = [...betis, [dFt - dSh, J.kaki[i]]];
  const la: Rantai = [...bdn, [dLa - p.badan, J.bahu[i]]];
  const lb: Rantai = [...la, [dLb - dLa, J.sikuB[i]]];
  const tg: Rantai = [...lb, [p.tangan[i], J.tangan[i]]];
  return { paha, betis, kaki, la, lb, tg, bdn };
};
const tf = (r: Rantai) => r.map(([d, c, g, k]) => `${g ? `translate(0 ${g.toFixed(3)}) ` : ''}${k && k !== 1 ? `translate(${c[0]} ${c[1]}) scale(${k.toFixed(5)}) translate(${-c[0]} ${-c[1]}) ` : ''}rotate(${d.toFixed(3)} ${c[0]} ${c[1]})`).join(' ');
const titik = (r: Rantai, q: P2): P2 => {
  let x = q;
  for (let k = r.length - 1; k >= 0; k--) {
    const [d, c, g, s] = r[k];
    x = putar(x, d, c);
    if (s && s !== 1) x = [c[0] + s * (x[0] - c[0]), c[1] + s * (x[1] - c[1])];
    if (g) x = [x[0], x[1] + g];
  }
  return [x[0] - H[0], x[1] - H[1]];
};
/** KOMPENSASI KAKI (26 Okt, terukur di lembar keyframe): di file, kaki JAUH 20 satuan lebih panjang dari kaki dekat — paha+betis efektif
 * 4,8 % lebih panjang (pinggul→lutut→pergelangan 210 vs 200) dan pinggulnya 10 lebih rendah → tokoh pincang saat jalan (pinggul +25 vs +2 di
 * pose cermin) dan kaki dekat melayang saat berdiri. Perbaikan: kaki jauh diskalakan di pangkal paha ke panjang kaki dekat (±0,95 — jauh =
 * sedikit lebih kecil, wajar untuk sisi jauh), lalu pangkal paha digeser ± setengah sisa selisih tegak (tersembunyi di balik tunik/celana). */
const NOL: Pose = { badan: 0, kepala: 0, balik: 1, paha: [0, 0], lutut: [0, 0], telapak: [0, 0], bahu: [0, 0], siku: [0, 0], tangan: [0, 0] };
const panjangKaki = (i: 0 | 1) => Math.hypot(J.lututB[i][0] - J.pinggul[i][0], J.lututB[i][1] - J.pinggul[i][1]) + Math.hypot(J.kaki[i][0] - J.lututB[i][0], J.kaki[i][1] - J.lututB[i][1]);
const SKALA_KAKI: P2 = [1, panjangKaki(0) / panjangKaki(1)];
const rendahKaki = (i: 0 | 1) => Math.max(...J.alas[i].map((q) => titik(rantaiG(NOL, i, [0, 0], SKALA_KAKI).kaki, q)[1]));
const SELISIH = rendahKaki(1) - rendahKaki(0);
const GESER: P2 = [SELISIH / 2, -SELISIH / 2];
const rantai = (p: Pose, i: 0 | 1) => rantaiG(p, i, GESER, SKALA_KAKI);
/** ROTASI PER LAPIS relatif induk (0 = pose gambar tokoh gua.svg) — nilai Rotation AE bila file diimpor per lapis & di-parent:
 *  badan ← paha ← betis ← telapak · badan ← lengan atas ← lengan bawah ← tangan · badan ← kepala; jangkar = pusat lingkaran sendi (SENDI). */
export const rotasiLapis = (p: Pose, i: 0 | 1) => {
  const r = rantai(p, i);
  return { badan: p.badan, kepala: p.kepala, paha: r.paha[1][0], betis: r.betis[2][0], telapak: r.kaki[3][0],
    lenganAtas: r.la[1][0], lenganBawah: r.lb[2][0], tangan: r.tg[3][0] };
};
export const SENDI = { ...J, akar: H, geserPaha: GESER, skalaKaki: SKALA_KAKI };

export const alasTerendah = (p: Pose) => Math.max(...([0, 1] as const).flatMap((i) => J.alas[i].map((q) => titik(rantai(p, i).kaki, q)[1])));
/** rentang alas dua kaki: x terkecil & terbesar titik tumit/ujung (relatif akar) — dasar lebar bayangan */
export const rentangAlas = (p: Pose): P2 => {
  const xs = ([0, 1] as const).flatMap((i) => J.alas[i].map((q) => titik(rantai(p, i).kaki, q)[0]));
  return [Math.min(...xs), Math.max(...xs)];
};
export const titikKaki = (p: Pose, i: 0 | 1): P2 => titik(rantai(p, i).kaki, J.kaki[i]);
/** naik-turun akar terhadap BERDIRI (satuan file, + = turun) — "body bob" */
export const geserY = (p: Pose) => alasTerendah(BERDIRI) - (alasTerendah(p) + (p.angkat ?? 0));
/** panjang satu siklus (satuan) = laju mundur kaki TUMPU per siklus (fase 0 → akhir tumpu) → badan maju sejauh kaki tumpu mundur =
 * kaki diam di tanah. (Dulu 2 × jarak dua kaki saat kontak: lari maju 209 sementara kaki mundur 448 per siklus → kaki tergelincir.) */
export const panjangSiklus = (r: number) => {
  const uT = lerp(0.5, 0.22, r);
  return Math.abs(titikKaki(gayaDasar(uT, r), 0)[0] - titikKaki(gayaDasar(0, r), 0)[0]) / uT;
};
/** pegangan hp di telapak tangan kiri-layar */
const PEGANG: [P2, P2] = [[136, 222], [312, 228]];
export const titikTangan = (p: Pose, i: 0 | 1): P2 => titik(rantai(p, i).tg, PEGANG[i]);
export const titikKepala = (p: Pose): P2 => titik(rantai(p, 0).bdn, [J.leher[0] + 2, J.leher[1] - 52]);
/** IK dua ruas lengan sisi i: tangan ke titik `t` (satuan, relatif akar) — siku ke bawah-belakang */
export const ikLengan = (p: Pose, i: 0 | 1, t: P2, tangan = 0): Pose => {
  const S = titik(rantai(p, i).bdn, J.bahu[i]), a = L.lenganAtas, b = L.lenganBawah + 18;
  const dx = t[0] - S[0], dy = t[1] - S[1];
  const d = Math.max(Math.abs(a - b) + 0.5, Math.min(a + b - 0.5, Math.hypot(dx, dy)));
  const A = Math.acos((a * a + d * d - b * b) / (2 * a * d)), dasar = Math.atan2(dy, dx);
  const calon = [dasar + A, dasar - A].map((e) => [S[0] + a * Math.cos(e), S[1] + a * Math.sin(e)] as P2);
  const E = calon.sort((u, v) => (v[1] - 0.6 * v[0]) - (u[1] - 0.6 * u[0]))[0];
  const t1 = deg(Math.atan2(-(E[0] - S[0]), E[1] - S[1])), t2 = deg(Math.atan2(-(t[0] - E[0]), t[1] - E[1]));
  const bahu = [...p.bahu] as P2, siku = [...p.siku] as P2, tg = [...p.tangan] as P2;
  bahu[i] = t1 - p.badan; siku[i] = t2 - t1; tg[i] = tangan;
  return { ...p, bahu, siku, tangan: tg };
};

/* ── KOSTUM ── */
export type Kostum = 'kini' | 'dulu';
export type Warna = { kulit: string; kulit2: string; alas: string; tunik: string; totol: string };
/** tunik gua kuning bertotol (Simon) + variasi kelompok — warna dari Hutan.svg */
export const TUNIK = { kuning: { tunik: '#F8B62A', totol: '#4C3B2D' }, oranye: { tunik: '#EF9A03', totol: '#4C3B2D' },
  krem: { tunik: '#EDCC76', totol: '#814E21' }, cokelat: { tunik: '#B97A3E', totol: '#4C3B2D' } } as const;
const SIMON: Warna = { kulit: '#FFAC9C', kulit2: '#F8AB9C', alas: '#EC9785', ...TUNIK.kuning };
const ganti = (m: string, a: string, b: string) => m.split(a).join(b);
const warnai = (m: string, pasang: [string, string][]) => pasang.reduce((acc, [a, b]) => ganti(acc, a, b), m);

export type Kepala = 'simon' | NamaKepala | { set: NamaSetKepala; eks: 'netral' | 'kaget' };
/** kepala lain: leher masuk ke BALIK badan (kepala digambar paling bawah, seperti file Simon) → tidak melayang */
const SET_KEPALA: Record<NamaSetKepala, { fx: number; sk: number; leher?: [number, number] }> = {
  wanita: { fx: 0.42, sk: 2.75 },
  ikal: { fx: 0.5, sk: 1.85, leher: [22, 40] },
  keriting: { fx: 0.62, sk: 1.18 },
};
const kulitKepala = (k: Kepala) => (typeof k === 'object' ? KEPALA_LAIN[k.set][k.eks].kulit : '#FFAC9C');
const KepalaG: React.FC<{ k: Kepala; op?: number }> = ({ k, op }) => {
  if (k === 'simon') return <g opacity={op} dangerouslySetInnerHTML={{ __html: GUA2.kepala }} />;
  if (typeof k === 'string') {
    const v = KEPALA[k]; // kepala ekspresi paket pria-biru (wajah sama) diskalakan ke kepala Simon, poros = leher
    return <g opacity={op} transform={`translate(${J.leher[0]} ${J.leher[1] + 3}) scale(2.37) translate(${-v.leher[0]} ${-v.leher[1]})`}
      dangerouslySetInnerHTML={{ __html: warnai(v.markup, [['#000004', '#FFAC9C'], ['#000003', '#0A131D'], ['#000002', '#32499F'], ['#000001', '#FFAC9C']]) }} />;
  }
  const v = KEPALA_LAIN[k.set][k.eks], c = SET_KEPALA[k.set], [x0, , x1, y1] = v.kotak;
  const px = x0 + c.fx * (x1 - x0);
  return (
    <g opacity={op} transform={`translate(${J.leher[0]} ${J.leher[1] + 4})`}>
      {c.leher ? <rect x={-c.leher[0] / 2} y={-c.leher[1] + 6} width={c.leher[0]} height={c.leher[1]} rx={4} fill={v.kulit} /> : null}
      <g transform={`scale(${c.sk}) translate(${-px} ${-y1})`} dangerouslySetInnerHTML={{ __html: v.markup }} />
    </g>);
};

/** lengan kemeja (hari ini): ujung atas lengan atas dibungkus kemeja */
const LenganBaju: React.FC<{ i: 0 | 1; warna: string }> = ({ i, warna }) => {
  const Ct = J.bahu[i], Cb = J.siku[i], r = 15.9, d: P2 = [Cb[0] - Ct[0], Cb[1] - Ct[1]], l = Math.hypot(d[0], d[1]);
  const u: P2 = [d[0] / l, d[1] / l], n: P2 = [-u[1], u[0]], e: P2 = [Ct[0] + u[0] * l * 0.55, Ct[1] + u[1] * l * 0.55];
  const q = [[Ct[0] + n[0] * r, Ct[1] + n[1] * r], [e[0] + n[0] * r, e[1] + n[1] * r], [e[0] - n[0] * r, e[1] - n[1] * r], [Ct[0] - n[0] * r, Ct[1] - n[1] * r]];
  return <g><circle cx={Ct[0]} cy={Ct[1]} r={r + 0.3} fill={warna} /><polygon points={q.map((p) => p.join(',')).join(' ')} fill={warna} /></g>;
};

/** TOKOH GUA — akar (tengah pinggul) di (x, y); `tanah` = y garis tanah. Urutan lapis = file Simon. */
export const Tokoh: React.FC<{
  id?: string; x: number; tanah: number; s: number; pose: Pose; kostum: Kostum; warna?: Partial<{ tunik: string; totol: string }>;
  kepala?: Kepala; kepala2?: { nama: Kepala; t: number }; ponsel?: boolean; alfa?: number; bayangan?: boolean;
}> = ({ x, tanah, s, pose: p, kostum, warna, kepala = 'simon', kepala2, ponsel, alfa = 1, bayangan = true }) => {
  const kl = kulitKepala(kepala), kini = kostum === 'kini';
  const w: Warna = kl === SIMON.kulit ? { ...SIMON, ...warna } : { ...SIMON, ...warna, kulit: kl, kulit2: mixHex(kl, '#C9705A', 0.06), alas: mixHex(kl, '#C9705A', 0.3) };
  const kulit: [string, string][] = [['#000004', w.kulit], ['#000010', w.kulit2], ['#00000D', w.alas], ['#00000E', w.tunik], ['#00000F', w.totol]];
  const celana: [string, string][] = [['#000004', B.night], ['#000010', B.night]];
  const R0 = rantai(p, 0), R1 = rantai(p, 1);
  const bag = (r: Rantai, m: string, pasang = kulit, ekstra?: React.ReactNode) => (
    <g transform={tf(r)}><g dangerouslySetInnerHTML={{ __html: warnai(m, pasang) }} />{ekstra}</g>);
  const y = tanah - (alasTerendah(p) + (p.angkat ?? 0)) * s; // angkat + = badan naik (melayang) — tanda dibetulkan 26 Okt
  const kaki = (r: Rantai, sisi: 'L' | 'R') => kini ? (
    <g transform={tf(r)}>
      <g dangerouslySetInnerHTML={{ __html: warnai(GUA2[`pergelangan${sisi}`], celana) }} />
      <g dangerouslySetInnerHTML={{ __html: warnai(GUA2[`telapak${sisi}`], [['#000004', B.turq], ['#000010', B.turq]]) }} />
      <g dangerouslySetInnerHTML={{ __html: warnai(GUA2[`alas${sisi}`], [['#00000D', B.white]]) }} />
    </g>) : bag(r, GUA2[`kaki${sisi}`]);
  const habs = p.badan + p.bahu[0] + p.siku[0] + p.tangan[0];
  const kepalaR: Rantai = [[p.badan, H], [p.kepala, J.leher]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-H[0]} ${-H[1]})`} opacity={alfa < 1 ? alfa : undefined}>
      {bayangan ? <Bayangan cx={H[0] + titikKepala(p)[0]} rx={lebarBayangan(titikKepala(p)[0], rentangAlas(p))} y={H[1] + alasTerendah(p) + (p.angkat ?? 0)} angkat={p.angkat ?? 0} /> : null}
      {/* 1 kepala (paling bawah: leher masuk ke balik badan) */}
      <g transform={`${tf(kepalaR)} translate(${J.leher[0]} 0) scale(${p.balik} 1) translate(${-J.leher[0]} 0)`}>
        {kepala2 && kepala2.t >= 1 ? null : <KepalaG k={kepala} op={kepala2 && kepala2.t > 0 ? 1 : undefined} />}
        {kepala2 && kepala2.t > 0 ? <KepalaG k={kepala2.nama} op={kepala2.t >= 1 ? undefined : kepala2.t} /> : null}
      </g>
      {/* 2 lengan kanan-layar (di belakang badan) */}
      {bag(R1.la, GUA2.lenganAtasR, kulit, kini ? <LenganBaju i={1} warna={B.turq} /> : null)}
      {bag(R1.lb, GUA2.lenganBawahR)}
      {bag(R1.tg, GUA2.tanganR)}
      {/* 3 badan, 4 panggul */}
      {bag(R0.bdn, GUA2.badan, kini ? [['#000004', B.turq], ['#000010', B.turq]] : kulit,
        kini ? <path d="M 166 86 L 180.2 101 L 194.5 86 L 188 84.5 L 180.2 93 L 172.5 84.5 Z" fill={B.white} /> : null)}
      {kini ? <g transform={tf(R0.bdn)}><path d="M 142.6 204 L 218.9 204 L 219 286 L 142.4 286 Z" fill={B.night} /></g> : bag(R0.bdn, GUA2.panggul)}
      {/* 5 telapak kanan, telapak kiri · 6 paha kiri, paha kanan · 7 betis kiri, betis kanan */}
      {kaki(R1.kaki, 'R')}
      {kaki(R0.kaki, 'L')}
      {bag(R0.paha, GUA2.pahaL, kini ? celana : kulit)}
      {bag(R1.paha, GUA2.pahaR, kini ? celana : kulit)}
      {bag(R0.betis, GUA2.betisL, kini ? celana : kulit)}
      {bag(R1.betis, GUA2.betisR, kini ? celana : kulit)}
      {/* 8 tunik */}
      {kini ? null : bag(R0.bdn, GUA2.tunik)}
      {/* 9 lengan kiri-layar (di depan tunik) */}
      {bag(R0.la, GUA2.lenganAtasL, kulit, kini ? <LenganBaju i={0} warna={B.turq} /> : null)}
      {bag(R0.lb, GUA2.lenganBawahL)}
      {bag(R0.tg, GUA2.tanganL, kulit, ponsel ? <PunggungHp at={PEGANG[0]} sudut={-habs - 18} /> : null)}
    </g>);
};

/** punggung hp di telapak (satuan gambar) — layar menghadap wajah tokoh */
const PunggungHp: React.FC<{ at: P2; sudut: number }> = ({ at, sudut }) => (
  <g transform={`translate(${at[0]} ${at[1]}) rotate(${sudut})`}>
    <rect x={-15} y={-30} width={30} height={56} rx={6} fill={B.night} />
    <rect x={-11} y={-25} width={12} height={15} rx={3.6} fill={mixHex(B.night, B.gray, 0.45)} />
    <circle cx={-5} cy={-21.4} r={2.5} fill={B.night} />
    <circle cx={-5} cy={-14.6} r={2.5} fill={B.night} />
  </g>);
