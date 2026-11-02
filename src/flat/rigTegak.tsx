import React from 'react';
import { B, lerp, mixHex } from '../theme';
import { GUIDE_TEGAK, SENDI_TEGAK as J, TEGAK } from './guaTegak.gen';
import { BAGIAN as PRIA_BIRU, KEPALA, type NamaKepala } from './priaBiru.gen';
import { KEPALA_LAIN, type NamaSetKepala } from './kepalaLain.gen';

/**
 * RIG TOKOH GUA — POSE DASAR BERDIRI TEGAK (26 Okt malam). Tips Simon: "1. buat charnya berdiri tegak. 2. Terapkan garis (guide) acuan/grid
 * dalam membangun charnya untuk setiap anggota tubuh. 3. Buat 1 char dulu sampai aku merasa itu benar, baru lanjut ke char lain".
 * Gambar = scripts/bangun-tegak.py: bagian `tokoh gua.svg` apa adanya, tiap ruas tegak lurus, lingkaran sendi di titik guide & sepusat.
 * Karena pose dasar tegak, SEMUA sudut gambar = 0 → sudut pose = Rotation lapis langsung (0 = tergantung lurus ke bawah, + = searah jarum jam);
 * tak perlu kompensasi kaki (rig lama: skala 0,954 + geser ±4) — panjang kiri-kanan sama di guide.
 * Urutan lapis = file Simon. Indeks [0] = dekat (kiri layar), [1] = jauh. Kaki diputar di pangkal paha masing-masing (null "pinggul").
 */
type P2 = [number, number];
const H: P2 = [(J.pinggul[0][0] + J.pinggul[1][0]) / 2, J.pinggul[0][1]]; // akar = tengah dua pinggul (satu garis guide)
const rad = (d: number) => (d * Math.PI) / 180;
const putar = ([x, y]: P2, d: number, [cx, cy]: P2): P2 => {
  const c = Math.cos(rad(d)), s = Math.sin(rad(d)), dx = x - cx, dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
};

export type Pose = {
  badan: number; kepala: number; balik?: number; // balik −1 = kepala menoleh ke belakang (dicerminkan)
  paha: P2; lutut: P2; telapak: P2; bahu: P2; siku: P2; tangan: P2; angkat?: number;
};
/** pose dasar = gambar tegak di guide */
export const TEGAK_LURUS: Pose = { badan: 0, kepala: 0, paha: [0, 0], lutut: [0, 0], telapak: [0, 0], bahu: [0, 0], siku: [0, 0], tangan: [0, 0] };
/** BERDIRI di adegan: kaki sedikit terbuka (berdiri tegak lurus = dua kaki menyatu jadi satu bentuk), lengan menggantung rileks */
export const BERDIRI: Pose = { badan: 0, kepala: 0, paha: [5, -5], lutut: [0, 0], telapak: [-5, 5], bahu: [3, -3], siku: [-8, -8], tangan: [-4, -4] };
const campur2 = (a: P2, b: P2, t: number): P2 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const campurPose = (a: Pose, b: Pose, t: number): Pose => ({
  badan: lerp(a.badan, b.badan, t), kepala: lerp(a.kepala, b.kepala, t), balik: lerp(a.balik ?? 1, b.balik ?? 1, t),
  paha: campur2(a.paha, b.paha, t), lutut: campur2(a.lutut, b.lutut, t), telapak: campur2(a.telapak, b.telapak, t),
  bahu: campur2(a.bahu, b.bahu, t), siku: campur2(a.siku, b.siku, t), tangan: campur2(a.tangan, b.tangan, t),
  angkat: lerp(a.angkat ?? 0, b.angkat ?? 0, t),
});

/* ── SIKLUS [u, paha (thd badan), lutut (tekukan), telapak (thd tanah, 0 = datar)] untuk kaki yang KONTAK di depan pada u = 0.
 * Referensi Simon — JALAN: kontak → turun → lewat → naik → (kaki satunya). LARI: kontak → redam → lepas → melayang → (kaki satunya). */
export type Kunci = [number, number, number, number][];
/** JALAN 72 frame (Simon 26 Okt malam: "buat 72 frame, dengan pembagian tiap 9 keyframe (karena ada 8 pose)") → kunci di u = k/8 = frame 9k.
 * Telapak MENGGULING (bukan datar terus — salah satu sebab "seperti robot"): tumit menghentak (ujung naik 20°) → datar → tumit terangkat →
 * menolak dengan ujung (38°) → telapak terkulai saat diangkat (56°) → rileks → menjangkau. */
export const JALAN: Kunci = [
  [0.0, -23, 12, -20], [0.125, -25, 33, 0], [0.25, 1, 13, 0], [0.375, 19, 3, 14],
  [0.5, 22, 18, 38], [0.625, 18, 52, 56], [0.75, -4, 66, 24], [0.875, -24, 30, -6],
];
export const JALAN_FRAME = 72;
/** LARI 45 frame per siklus (kadens lari yang disetujui Simon; semua char dikunci ke sini) */
export const LARI_FRAME = 45;
/** LENGAN BERANTAI (Simon 26 Okt malam: "tangannya masih berasa seperti robot, secara ayunan lengan atas, lengan bawah, dan pergelangan
 * tangannya … jika sudah memperbaiki gerakan jalan, terapkan juga pada gerakan lari"). Tiga ruas TIDAK serempak: lengan atas memimpin,
 * lengan bawah menyusul tertinggal `lF` siklus, tangan menyusul lengan bawah tertinggal `lH` → di ujung ayunan ruas bawah masih meneruskan
 * gerak sebentar lalu berbalik (overlap / follow-through), siku paling menekuk sesudah lengan di depan & hampir lurus di belakang.
 * Sudut absolut thd badan (+ = ke belakang): atas U = A·cos θ − B; bawah F = kF·A·cos(θ − lF) − B − tekuk; tangan = F tertunda lH.
 * Rig memakai selisihnya (Rotation relatif induk). Ujung ayunan ke belakang di u0, sesaat sesudah kaki sisi yang sama menapak di depan (u = 0). */
const AYUN = {
  jalan: { A: 24, B: 3, u0: 0.06, kF: 1.12, lF: 0.075, T0: 12, T1: 24, lH: 0.07, kH: 0.8, H0: -6 },
  lari: { A: 40, B: 8, u0: 0.06, kF: 1.05, lF: 0.06, T0: 76, T1: 26, lH: 0.06, kH: 0.8, H0: -12 },
};
/** [bahu, siku, tangan] lengan sisi dengan fase q (lengan dekat q = u, lengan jauh q = u + ½) */
export const lenganBerantai = (q: number, r: number): [number, number, number] => {
  const c = (k: keyof typeof AYUN.jalan) => lerp(AYUN.jalan[k], AYUN.lari[k], r);
  const A = c('A'), B = c('B'), u0 = c('u0'), kF = c('kF'), lF = c('lF'), T0 = c('T0'), T1 = c('T1'), lH = c('lH'), kH = c('kH'), H0 = c('H0');
  const th = (x: number) => 2 * Math.PI * (x - u0);
  const atas = A * Math.cos(th(q)) - B;
  const bawah = (x: number) => kF * A * Math.cos(th(x - lF)) - B - (T0 + (T1 * (1 - Math.cos(th(x - lF)))) / 2);
  return [atas, bawah(q) - atas, kH * (bawah(q - lH) - bawah(q)) + H0];
};
export const LARI: Kunci = [
  [0.0, -33, 37, -1], [0.1, -28, 55, 4], [0.25, 11, 18, 28], [0.38, 38, 40, 58],
  [0.5, 32, 92, 64], [0.62, -8, 118, 40], [0.76, -52, 82, 6], [0.9, -44, 30, -10],
];
/* kunci tumpu disetel numerik pada rangka tegak: titik kontak (tumit lalu ujung) diam di tanah, ayunan bebas ≥ 7 satuan di atas tanah,
 * naik-turun pinggul sesuai referensi — jalan: kontak +4 · turun +10 (terendah) · lewat +5 · naik 0 (tertinggi);
 * lari: kontak +11 · redam +24 · lepas +1 · melayang −9 (puncak) */
const pecah = (x: number) => x - Math.floor(x);
/** kurva Catmull-Rom berkala lewat tepat di tiap kunci (setara Auto Bezier AE) */
const kurva = (k: Kunci, u: number, kol: 1 | 2 | 3) => {
  const n = k.length, v = pecah(u);
  let i = n - 1;
  for (let j = 0; j < n; j++) if (k[j][0] <= v) i = j;
  const a = k[i], b = k[(i + 1) % n], s0 = k[(i - 1 + n) % n], s1 = k[(i + 2) % n];
  const t = (v - a[0]) / (b[0] + (i + 1 >= n ? 1 : 0) - a[0]);
  const p0 = s0[kol], p1 = a[kol], p2 = b[kol], p3 = s1[kol];
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
};
const gayaDasar = (u: number, r: number): Pose => {
  const bdn = lerp(3, 13, r) + lerp(1.2, 2, r) * Math.cos(4 * Math.PI * (u - 0.125)); // condong + mengangguk tiap langkah
  const kaki1 = (q: number) => {
    const paha = lerp(kurva(JALAN, q, 1), kurva(LARI, q, 1), r), lutut = lerp(kurva(JALAN, q, 2), kurva(LARI, q, 2), r);
    const kakiAbs = lerp(kurva(JALAN, q, 3), kurva(LARI, q, 3), r);
    return { paha, lutut, telapak: kakiAbs - (bdn + paha + lutut) };
  };
  const d = kaki1(u), j = kaki1(u + 0.5);
  const ld = lenganBerantai(u, r), lj = lenganBerantai(u + 0.5, r);
  return {
    badan: bdn, kepala: -bdn * 0.6,
    paha: [d.paha, j.paha], lutut: [d.lutut, j.lutut], telapak: [d.telapak, j.telapak],
    bahu: [ld[0], lj[0]], siku: [ld[1], lj[1]], tangan: [ld[2], lj[2]],
  };
};
/** lari: dari lepas-ujung sampai kontak berikutnya tinggi badan = lengkung balistik (bukan ditempel ke kaki terendah) */
export const LEPAS = 0.44, LOMPAT = 17;
/** u = fase siklus, r = 0 jalan … 1 lari, a = amplitudo (0 = BERDIRI) */
export const gaya = (u: number, r: number, a: number): Pose => {
  const g = gayaDasar(u, r), h = pecah(2 * u);
  if (r > 0 && h > LEPAS) {
    const awal = Math.floor(2 * u) / 2, t = (h - LEPAS) / (1 - LEPAS);
    const DA = alasTerendah(gayaDasar(awal + LEPAS / 2, r)), DB = alasTerendah(gayaDasar(awal + 0.5, r));
    g.angkat = r * Math.max(0, lerp(DA, DB, t) + LOMPAT * Math.sin(Math.PI * t) - alasTerendah(g));
  }
  return a >= 1 ? g : campurPose(BERDIRI, g, a);
};

/* ── FK: sudut gambar semua 0 → putaran = sudut pose; putaran relatif = anak − induk ── */
type Rantai = [number, P2][]; // putaran (luar → dalam): [sudut, pusat]
const rantai = (p: Pose, i: 0 | 1) => {
  const th = p.badan + p.paha[i], sh = th + p.lutut[i], ft = sh + p.telapak[i];
  const bdn: Rantai = [[p.badan, H]];
  const paha: Rantai = [[th, J.pinggul[i]]]; // kaki tak ikut putaran badan di H (pinggul 36 px mendatar → pincang saat condong)
  const betis: Rantai = [...paha, [sh - th, J.lutut[i]]];
  const kaki: Rantai = [...betis, [ft - sh, J.pkaki[i]]];
  const la: Rantai = [...bdn, [p.bahu[i], J.bahu[i]]];
  const lb: Rantai = [...la, [p.siku[i], J.siku[i]]];
  const tg: Rantai = [...lb, [p.tangan[i], J.perg[i]]];
  return { paha, betis, kaki, la, lb, tg, bdn };
};
const tf = (r: Rantai) => r.map(([d, c]) => `rotate(${d.toFixed(3)} ${c[0]} ${c[1]})`).join(' ');
const titik = (r: Rantai, q: P2): P2 => {
  let x = q;
  for (let k = r.length - 1; k >= 0; k--) x = putar(x, r[k][0], r[k][1]);
  return [x[0] - H[0], x[1] - H[1]];
};
export const alasTerendah = (p: Pose) => Math.max(...([0, 1] as const).flatMap((i) => J.alas[i].map((q) => titik(rantai(p, i).kaki, q as P2)[1])));
/** rentang alas dua kaki: x terkecil & terbesar semua titik tumit/ujung (relatif akar) — dasar lebar bayangan */
export const rentangAlas = (p: Pose): P2 => {
  const xs = ([0, 1] as const).flatMap((i) => J.alas[i].map((q) => titik(rantai(p, i).kaki, q as P2)[0]));
  return [Math.min(...xs), Math.max(...xs)];
};
export const titikKaki = (p: Pose, i: 0 | 1): P2 => titik(rantai(p, i).kaki, J.pkaki[i]);
export const titikSendi = (p: Pose) => ({
  pinggul: [0, 1].map((i) => titik(rantai(p, i as 0 | 1).paha, J.pinggul[i])),
  lutut: [0, 1].map((i) => titik(rantai(p, i as 0 | 1).betis, J.lutut[i])),
  pkaki: [0, 1].map((i) => titikKaki(p, i as 0 | 1)),
  bahu: [0, 1].map((i) => titik(rantai(p, i as 0 | 1).la, J.bahu[i])),
  siku: [0, 1].map((i) => titik(rantai(p, i as 0 | 1).lb, J.siku[i])),
  perg: [0, 1].map((i) => titik(rantai(p, i as 0 | 1).tg, J.perg[i])),
});
/** naik-turun akar terhadap tegak lurus (satuan gambar, + = turun) */
export const geserY = (p: Pose) => alasTerendah(TEGAK_LURUS) - (alasTerendah(p) + (p.angkat ?? 0));
/** titik alas dekat yang menapak (tumit / ujung, yang terendah) — x relatif akar & indeks titik */
export const kontak = (p: Pose, i: 0 | 1 = 0) => {
  const q = J.alas[i].map((a) => titik(rantai(p, i).kaki, a as P2));
  const k = q[0][1] >= q[1][1] ? 0 : 1;
  return { x: q[k][0], y: q[k][1], k };
};
/** panjang siklus = laju mundur kaki tumpu per siklus → badan maju sejauh kaki tumpu mundur = kaki diam di tanah. JALAN: diukur di TITIK
 * KONTAK (tumit lalu ujung — telapak menggeling; langkah saat kontak pindah tumit → ujung dilewati). LARI: tetap cara lama (pergelangan kaki)
 * karena kadens lari 45 frame sudah disetujui Simon ("untuk gerakan larinya sudah cukup bagus"). Di antaranya dicampur menurut r. Disimpan per r. */
const SIKLUS = new Map<number, number>();
export const panjangSiklus = (r: number) => {
  const kunci = Math.round(r * 100) / 100;
  const ada = SIKLUS.get(kunci);
  if (ada !== undefined) return ada;
  const uT = lerp(0.5, 0.22, kunci), n = 32;
  let jalan = 0, du = 0;
  for (let k = 0; k < n; k++) {
    const a = kontak(gayaDasar((uT * k) / n, kunci)), b = kontak(gayaDasar((uT * (k + 1)) / n, kunci));
    if (a.k === b.k) { jalan += a.x - b.x; du += uT / n; }
  }
  const lama = Math.abs(titikKaki(gayaDasar(uT, kunci), 0)[0] - titikKaki(gayaDasar(0, kunci), 0)[0]) / uT;
  const L = lerp(jalan / du, lama, kunci);
  SIKLUS.set(kunci, L);
  return L;
};

/* ── HP & IK lengan (versi kota) ── */
/** titik genggam hp = PUSAT TELAPAK tangan dekat, diukur pakai guide (Simon: "gunakan metode pengukuran yang sama seperti di char adegan
 * purba"): kotak tangan dekat tegak x 129,3–155,5 · y 232,8 (lingkaran pergelangan) – 279,8 (ujung jari) → pusat x = tengah kotak,
 * y = pergelangan + 45 % panjang tangan. */
export const PEGANG: P2 = [142.4, 259.7];
const PANJANG_LA = J.siku[0][1] - J.bahu[0][1], PANJANG_LB = J.perg[0][1] - J.siku[0][1];
const arah = (a: P2, b: P2) => (Math.atan2(-(b[0] - a[0]), b[1] - a[1]) * 180) / Math.PI; // 0 = tegak ke bawah, + = searah jarum jam
/** titik genggam tangan sisi i (relatif akar); `genggam` = offset dari pergelangan di pose dasar (bawaan: telapak tangan rig) */
export const titikTangan = (p: Pose, i: 0 | 1 = 0, genggam?: P2): P2 => {
  const g = genggam ?? [PEGANG[0] - J.perg[0][0], PEGANG[1] - J.perg[0][1]];
  return titik(rantai(p, i).tg, [J.perg[i][0] + g[0], J.perg[i][1] + g[1]]);
};
export const titikKepala = (p: Pose): P2 => titik(rantai(p, 0).bdn, [J.leher[0] + 2, J.leher[1] - 52]);
/** IK dua ruas: titik genggam tangan sisi i ke `t` (satuan, relatif akar), tangan diputar `tangan`° thd lengan bawah; siku ke bawah-belakang */
export const ikLengan = (p: Pose, i: 0 | 1, t: P2, tangan = 0, genggam?: P2): Pose => {
  const S = titik(rantai(p, i).bdn, J.bahu[i]);
  const g = putar(genggam ?? [PEGANG[0] - J.perg[0][0], PEGANG[1] - J.perg[0][1]], tangan, [0, 0]);
  const v: P2 = [g[0], PANJANG_LB + g[1]], a = PANJANG_LA, b = Math.hypot(v[0], v[1]), dl = arah([0, 0], v);
  const dx = t[0] - S[0], dy = t[1] - S[1];
  const d = Math.max(Math.abs(a - b) + 0.5, Math.min(a + b - 0.5, Math.hypot(dx, dy)));
  const A = Math.acos((a * a + d * d - b * b) / (2 * a * d)), dasar = Math.atan2(dy, dx);
  const E = [dasar + A, dasar - A].map((e) => [S[0] + a * Math.cos(e), S[1] + a * Math.sin(e)] as P2)
    .sort((u, w) => (w[1] - 0.6 * w[0]) - (u[1] - 0.6 * u[0]))[0];
  const t1 = arah(S, E), t2 = arah(E, t) - dl;
  const bahu = [...p.bahu] as P2, siku = [...p.siku] as P2, tg = [...p.tangan] as P2;
  bahu[i] = t1 - p.badan; siku[i] = t2 - t1; tg[i] = tangan;
  return { ...p, bahu, siku, tangan: tg };
};
/* ── TANGAN PRIA-BIRU (adegan kota) — Simon 27 Okt: "dichar lengkap ada tangan yang lebih pas untuk adegan kota" (screenshot: tangan menggenggam hp
 * tampak samping = grup 35 figur "main hp"; tangan menunjuk = grup 67 lembar tangan). Skala 2,37 = skala kepala pria-biru: lengan bawah figur
 * 28,9 × 2,37 = 68,6 ≈ lengan bawah rig 69,4 · lingkaran pergelangan 4,87 × 2,37 = 11,5 = R_PERG 11,47 → pas tanpa diubah.
 * Pergelangan art = pusat lingkaran telapak; sumbu lengan bawah art diputar ke arah lengan bawah rig (pose dasar: tegak ke bawah).
 * Menggantikan punggung hp gambaranku (kotak + kamera) — hp kini = hp tampak samping dari paket. */
const PB = 2.37;
const pasangTangan = (pusat: P2, lenganDeg: number, perg: P2) => {
  const rot = 90 - lenganDeg;
  const peta = (q: P2): P2 => { const v = putar([(q[0] - pusat[0]) * PB, (q[1] - pusat[1]) * PB], rot, [0, 0]); return [perg[0] + v[0], perg[1] + v[1]]; };
  return { tf: `translate(${perg[0]} ${perg[1]}) rotate(${rot.toFixed(3)}) scale(${PB}) translate(${-pusat[0]} ${-pusat[1]})`, peta };
};
/** grup 35: lingkaran telapak (126,16, 304,48) · sumbu lengan bawah figur −37,66° (siku (103,26, 322,15) → pergelangan) · hp: ujung bawah
 * (119,81, 301,42), ujung atas (136,55, 288,92), layar menghadap kiri-atas (ke wajah) */
const T_HP = pasangTangan([126.16, 304.48], -37.66, J.perg[1]); // tangan KANAN (jauh, di belakang badan) seperti figur referensi
/** grup 67: lingkaran telapak (679,16, 170,13) · ujung telunjuk (692,96, 156,91) · sumbu lengan bawah dianggap −40° (pergelangan lurus) */
const T_TUNJUK = pasangTangan([679.155, 170.125], -40, J.perg[0]); // tangan KIRI (dekat, menyilang di depan badan)
const relPerg = (q: P2, i: 0 | 1): P2 => [q[0] - J.perg[i][0], q[1] - J.perg[i][1]];
/** offset ujung telunjuk dari pergelangan, pose dasar — untuk ikLengan/titikTangan */
export const UJUNG_TUNJUK = relPerg(T_TUNJUK.peta([692.96, 156.91]), 0);
/** POSE MAIN HP — DIUKUR dari figur pria-biru "main hp" (grup 32) di grid (Simon 27 Okt: "gunakan garis bantu/grid untuk mengukur posenya"):
 * lengan kanan pemegang hp: atas −8,0° · bawah −127,7° (bahu (99,15, 292,85) → siku (103,26, 322,15) → pergelangan (126,16, 304,48));
 * lengan kiri pengetuk: atas −11,9° · bawah −108,9° (bahu (68,35, 292,85) → siku (74,45, 321,85) → pergelangan (101,8, 312,5)).
 * Panjang ruas referensi × 2,37 = rig (atas 70,1/70,2 vs 71,1 · bawah 68,6/68,5 vs 69,4) → sudut dipindah apa adanya (0 = tegak ke bawah). */
export const LENGAN_MAIN_HP = { atas: [-11.88, -7.98] as P2, bawah: [-108.87, -127.66] as P2 };
/** hp di tangan (relatif akar): pusat, ujung atas/bawah, normal layar (satuan, ke arah wajah) */
export const hpDiTangan = (p: Pose) => {
  const r = rantai(p, 1).tg, k = (q: P2) => titik(r, T_HP.peta(q));
  const pusat = k([128.18, 295.17]), atas = k([136.55, 288.92]), bawah = k([119.81, 301.42]);
  const d: P2 = [atas[0] - bawah[0], atas[1] - bawah[1]], L = Math.hypot(d[0], d[1]);
  return { pusat, atas, bawah, layar: [d[1] / L, -d[0] / L] as P2 };
};

/* ── BAYANGAN ── */
/** BAYANGAN di tanah (Simon 26 Okt malam: "tambahkan bayangan, untuk charnya" · "pastikan bayangannya rata tengah ke charnya, gunakan kepala
 * sebagai acuan" · contoh "bayangannya buat seperti ini (selalu berada ditengah)" · "tetap terapkan animasi membesar dan mengecil dari bayangan
 * tadi, tapi gunakan garis bantu agar bayangannya tetap berada ditengah charnya").
 * PUSAT = garis bantu tengah char (x kepala) — tidak pernah bergeser ke titik tengah kaki. LEBAR membesar-mengecil mengikuti langkah:
 * rx = jarak dari garis tengah ke ujung alas TERJAUH + tepi → kedua kaki selalu berpijak di bayangan. Tinggi = 16 % lebar, abu-abu = gelap
 * 20 % (contoh Simon: rentang langkah pose file → rx ±172, ry ±26). Saat melayang (lari) mengecil & memudar. Koordinat lokal tokoh. */
export const BAYANGAN = { tepi: 6, rasio: 0.16, alfa: 0.2 };
export const lebarBayangan = (cx: number, [a, b]: P2) => Math.max(cx - a, b - cx) + BAYANGAN.tepi;
export const Bayangan: React.FC<{ cx: number; rx: number; y: number; angkat: number }> = ({ cx, rx, y, angkat }) => {
  const k = Math.max(0.6, 1 - angkat / 80);
  return <ellipse cx={cx} cy={y} rx={rx * k} ry={rx * BAYANGAN.rasio * k} fill={B.night} opacity={BAYANGAN.alfa * k} />;
};

/* ── KOSTUM & KEPALA ── */
export type Kostum = 'dulu' | 'kini';
/** kepala: Simon (file) · ekspresi pria-biru · kepala kelompok (rig Freepik lain: keriting, wanita, ikal) */
export type Kepala = 'simon' | NamaKepala | { set: NamaSetKepala; eks: 'netral' | 'kaget' };
export const TUNIK = { kuning: { tunik: '#F8B62A', totol: '#4C3B2D' }, oranye: { tunik: '#EF9A03', totol: '#4C3B2D' },
  krem: { tunik: '#EDCC76', totol: '#814E21' }, cokelat: { tunik: '#B97A3E', totol: '#4C3B2D' } } as const;
const WARNA = { kulit: '#FFAC9C', kulit2: '#F8AB9C', alas: '#EC9785', ...TUNIK.kuning };
const ganti = (m: string, pasang: [string, string][]) => pasang.reduce((acc, [a, b]) => acc.split(a).join(b), m);
const CELANA: [string, string][] = [['#000004', B.night], ['#000010', B.night]];
/** VI V01 (29 Okt): warna kemeja/baju bisa diganti per tokoh (`baju`, bawaan turquoise = tokoh kota V06) — Ibu Sari & pembeli warung */
const kemeja = (w: string): [string, string][] => [['#000004', w], ['#000010', w]];
/** SEMUA KEPALA DI GARIS GUIDE (Simon 26 Okt malam: "Ada karakter yang kepalanya terlalu kebawah (metode pengukuran berdasarkan garis
 * bantu/grid harus dipakai disemua char)"). Acuan = kepala Simon: DAGU di garis dagu (y 78,9) & pusat kotak kepala di garis pusat kepala
 * (x 184,2). Dagu tiap kepala DIUKUR (Chrome: bentuk wajah; keriting: profil lebar wajah+leher — pipi 40 → rahang 32 → leher tetap 26):
 * kotak kepala [x0, x1] & dagu dalam koordinat gambarnya. Kepala digambar paling bawah (leher masuk ke balik badan), lehernya = leher
 * tokoh utama (LEHER_SIMON) di belakang kepala.
 * Dulu: dasar kotak kepala di leher + 4 → kepala yang punya leher panjang/pendek jatuh di ketinggian berbeda (ikal tenggelam, keriting rendah). */
const DAGU = GUIDE_TEGAK.y.find(([n]) => n === 'dagu')![1];
/** LEHER = leher tokoh utama (tokoh gua.svg, lebar 27,5, y 56 → 99,1, ujung bawah membulat masuk ke balik badan) dalam warna kulit tiap kepala
 * (Simon: "buat seperti di char utama" — dulu kotak leher buatanku: menyembul di samping dagu runcing wanita / terlalu ramping di ikal) */
const LEHER_SIMON = 'M166.41,56.05l0.89,30.2c0.21,7.18,6.09,12.89,13.27,12.89l0,0c7.79,0,13.91-6.68,13.23-14.44l-0.78-8.89L166.41,56.05z';
const PUSAT_X = GUIDE_TEGAK.x.find(([n]) => n === 'pusat kepala')![1];
const UKUR_KEPALA: Record<NamaSetKepala, { sk: number; dagu: [number, number]; potong?: boolean }> = {
  wanita: { sk: 2.75, dagu: [168.3, 221.8] }, // [netral, kaget] — sisa kerah dihapus di ekstrak-kepala.py
  ikal: { sk: 1.85, dagu: [58.5, 113.2] },
  keriting: { sk: 1.18, dagu: [192.5, 94.9], potong: true }, // wajah + leher satu bentuk → dipotong di dagu (leher lama dibuang)
};
/** kepala pria-biru: skala & dagu lembar kepala (baris 1, dagu y 57,7) · pusat kotak = x0 + 10,35. `mainHp` (Simon 27 Okt: "buat kepala di adegan kota
 * jadi seperti ini") = kepala figur "berdiri main hp" (kotak 76,4–97,1 × 256,1, ukuran sama dengan kepala lembar) → dagu y 281,7 (bawah wajah) */
const UKUR_BIRU = { sk: 2.37, dagu: 57.7, pusat: { lihat: 513.85, sedih: 557.35, netral: 470.45, mainHp: 86.75 } as Record<string, number>,
  daguKepala: { mainHp: 281.7 } as Record<string, number> };
/** puncak kepala (satuan file) — untuk garis guide tiap char */
export const puncakKepala = (k: Kepala) => {
  if (typeof k !== 'object') return GUIDE_TEGAK.puncak;
  const [, y0] = KEPALA_LAIN[k.set][k.eks].kotak, c = UKUR_KEPALA[k.set];
  return DAGU - (c.dagu[k.eks === 'kaget' ? 1 : 0] - y0) * c.sk;
};
const kulitKepala = (k: Kepala) => (typeof k === 'object' ? KEPALA_LAIN[k.set][k.eks].kulit : WARNA.kulit);
const KepalaG: React.FC<{ k: Kepala; op?: number }> = ({ k, op }) => {
  if (k === 'simon') return <g opacity={op} dangerouslySetInnerHTML={{ __html: TEGAK.kepala }} />;
  if (typeof k === 'string') {
    const pusat = UKUR_BIRU.pusat[k] ?? KEPALA[k].leher[0];
    return <g opacity={op} transform={`translate(${PUSAT_X} ${DAGU}) scale(${UKUR_BIRU.sk}) translate(${-pusat} ${-(UKUR_BIRU.daguKepala[k] ?? UKUR_BIRU.dagu)})`}
      dangerouslySetInnerHTML={{ __html: ganti(KEPALA[k].markup, [['#000004', '#FFAC9C'], ['#000003', '#0A131D'], ['#000002', '#32499F'], ['#000001', '#FFAC9C']]) }} />;
  }
  const v = KEPALA_LAIN[k.set][k.eks], c = UKUR_KEPALA[k.set], [x0, y0, x1] = v.kotak, dagu = c.dagu[k.eks === 'kaget' ? 1 : 0];
  const idPotong = `potong-leher-${k.set}-${k.eks}`; // definisi kembar di tiap tokoh identik → aman
  return (
    <g opacity={op}>
      {/* leher baru = leher tokoh utama; leher lama kepala dibuang (Simon: "jangan lupa menghapus leher yang lama ketika kamu membuat leher baru") */}
      <path d={LEHER_SIMON} fill={v.kulit} />
      <g transform={`translate(${PUSAT_X} ${DAGU}) scale(${c.sk}) translate(${-(x0 + x1) / 2} ${-dagu})`}>
        {c.potong ? <clipPath id={idPotong}><rect x={x0 - 60} y={y0 - 120} width={x1 - x0 + 120} height={dagu + 1.5 - (y0 - 120)} /></clipPath> : null}
        <g clipPath={c.potong ? `url(#${idPotong})` : undefined} dangerouslySetInnerHTML={{ __html: v.markup }} />
      </g>
    </g>);
};
/** lengan kemeja (versi kota): pangkal lengan atas tegak dibungkus kemeja sampai 55 % panjangnya */
const LenganBaju: React.FC<{ i: 0 | 1; warna: string }> = ({ i, warna }) => {
  const [x, y] = J.bahu[i], r = 16.1;
  return <g fill={warna}><circle cx={x} cy={y} r={r} /><rect x={x - r} y={y} width={2 * r} height={0.55 * PANJANG_LA} /></g>;
};

/** TOKOH GUA (tegak) — akar (tengah pinggul) di (x, tanah − tinggi pose). Urutan lapis = file Simon. `guide` = kerangka sendi ikut bergerak */
export const TokohTegak: React.FC<{
  x: number; tanah: number; s: number; pose: Pose; kostum?: Kostum; kepala?: Kepala; kepala2?: { nama: Kepala; t: number };
  warna?: { tunik: string; totol: string }; ponsel?: boolean; alfa?: number; guide?: boolean; bayangan?: boolean; baju?: string; /** warna sepatu (bawaan = warna baju) */ sepatu?: string;
  /** `ponsel` = tangan jauh (kanan) menggenggam hp · `ketuk` = tangan dekat (kiri) menunjuk/mengetuk (Simon 27 Okt: "tangan satunya seperti sedang klik
   * klik hp" + "dichar lengkap ada tangan yang lebih pas") — sisi tangan sama dengan figur referensi pria-biru "main hp" */
  ketuk?: boolean;
  /** benda di genggaman tangan DEKAT (S02 flat: daging, tombak) — koordinat file tangan dekat pose dasar (titik genggam = PEGANG), digambar di bawah
   * tangan supaya jari menutup gagangnya; ikut putaran rantai tangan (pemanggil memutar balik bila benda harus tetap tegak) */
  pegang?: React.ReactNode;
}> = ({ x, tanah, s, pose: p, kostum = 'dulu', kepala = 'simon', kepala2, warna, ponsel, alfa = 1, guide, bayangan = true, ketuk, pegang, baju = B.turq, sepatu }) => {
  const kini = kostum === 'kini';
  const KEMEJA = kemeja(baju), SEPATU = kemeja(sepatu ?? baju);
  // kulit badan = kulit kepala (kelompok: kulit rig Freepik masing-masing), nada kaki & alas diturunkan seperti rig lama
  const kl = kulitKepala(kepala), w = { ...WARNA, ...warna, ...(kl === WARNA.kulit ? {} : { kulit: kl, kulit2: mixHex(kl, '#C9705A', 0.06), alas: mixHex(kl, '#C9705A', 0.3) }) };
  const KULIT: [string, string][] = [['#000004', w.kulit], ['#000010', w.kulit2], ['#00000D', w.alas], ['#00000E', w.tunik], ['#00000F', w.totol]];
  const R0 = rantai(p, 0), R1 = rantai(p, 1);
  const bag = (r: Rantai, m: string, pasang = KULIT, ekstra?: React.ReactNode) => (
    <g transform={tf(r)}><g dangerouslySetInnerHTML={{ __html: ganti(m, pasang) }} />{ekstra}</g>);
  const kaki = (r: Rantai, sisi: 'L' | 'R') => kini ? (
    <g transform={tf(r)}>
      <g dangerouslySetInnerHTML={{ __html: ganti(TEGAK[`pergelangan${sisi}`], CELANA) }} />
      <g dangerouslySetInnerHTML={{ __html: ganti(TEGAK[`telapak${sisi}`], SEPATU) }} />
      <g dangerouslySetInnerHTML={{ __html: ganti(TEGAK[`alas${sisi}`], [['#00000D', B.white]]) }} />
    </g>) : bag(r, TEGAK[`kaki${sisi}`]);
  const y = tanah - (alasTerendah(p) + (p.angkat ?? 0)) * s;
  const kepalaR: Rantai = [[p.badan, H], [p.kepala, J.leher]];
  const sendi = guide ? titikSendi(p) : null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-H[0]} ${-H[1]})`} opacity={alfa < 1 ? alfa : undefined}>
      {bayangan ? <Bayangan cx={H[0] + titikKepala(p)[0]} rx={lebarBayangan(titikKepala(p)[0], rentangAlas(p))} y={H[1] + alasTerendah(p) + (p.angkat ?? 0)} angkat={p.angkat ?? 0} /> : null}
      {/* 1 kepala (paling bawah: leher masuk ke balik badan) — balik = menoleh (dicerminkan di leher) */}
      <g transform={`${tf(kepalaR)} translate(${J.leher[0]} 0) scale(${p.balik ?? 1} 1) translate(${-J.leher[0]} 0)`}>
        {kepala2 && kepala2.t >= 1 ? null : <KepalaG k={kepala} />}
        {kepala2 && kepala2.t > 0 ? <KepalaG k={kepala2.nama} op={kepala2.t >= 1 ? undefined : kepala2.t} /> : null}
      </g>
      {/* 2 lengan jauh (di belakang badan) */}
      {bag(R1.la, TEGAK.lenganAtasR, KULIT, kini ? <LenganBaju i={1} warna={baju} /> : null)}
      {bag(R1.lb, TEGAK.lenganBawahR)}
      {/* tangan jauh: kota = tangan pria-biru menggenggam hp tampak samping (grup 35, jari menutup hp — lapis asli paket) */}
      {ponsel ? <g transform={tf(R1.tg)}><g transform={T_HP.tf} dangerouslySetInnerHTML={{ __html: ganti(PRIA_BIRU.tanganHp, [...KULIT, ['#00000A', B.night]]) }} /></g>
        : bag(R1.tg, TEGAK.tanganR)}
      {/* 3 badan, 4 panggul */}
      {bag(R0.bdn, TEGAK.badan, kini ? KEMEJA : KULIT,
        kini ? <path d="M 166 86 L 180.2 101 L 194.5 86 L 188 84.5 L 180.2 93 L 172.5 84.5 Z" fill={B.white} /> : null)}
      {/* panggul/bokong = bentuk Simon (tokoh gua.svg 13.52: diperbesar sampai garis pinggul) — versi kota diwarnai celana */}
      {bag(R0.bdn, TEGAK.panggul, kini ? CELANA : KULIT)}
      {/* 5 telapak jauh, telapak dekat · 6 paha dekat, paha jauh · 7 betis dekat, betis jauh */}
      {kaki(R1.kaki, 'R')}
      {kaki(R0.kaki, 'L')}
      {bag(R0.paha, TEGAK.pahaL, kini ? CELANA : KULIT)}
      {bag(R1.paha, TEGAK.pahaR, kini ? CELANA : KULIT)}
      {bag(R0.betis, TEGAK.betisL, kini ? CELANA : KULIT)}
      {bag(R1.betis, TEGAK.betisR, kini ? CELANA : KULIT)}
      {/* 8 tunik */}
      {kini ? null : bag(R0.bdn, TEGAK.tunik)}
      {/* 9 lengan dekat (di depan tunik) */}
      {bag(R0.la, TEGAK.lenganAtasL, KULIT, kini ? <LenganBaju i={0} warna={baju} /> : null)}
      {/* benda di genggaman DI BAWAH lengan bawah (Simon 27 Okt: "letakan lengan bawah diatas buah, agar tangannya tidak terlihat terpotong") — dulu di antara
        lengan bawah & tangan: buah besar menutup ujung lengan → tangan tampak terpotong */}
      {pegang ? <g transform={tf(R0.tg)}>{pegang}</g> : null}
      {bag(R0.lb, TEGAK.lenganBawahL)}
      {/* tangan dekat: kota = tangan pria-biru menunjuk (grup 67), telunjuk mengetuk layar hp */}
      <g transform={tf(R0.tg)}>
        {ketuk ? <g transform={T_TUNJUK.tf} dangerouslySetInnerHTML={{ __html: ganti(PRIA_BIRU.tanganTunjuk, KULIT) }} />
          : <g dangerouslySetInnerHTML={{ __html: ganti(TEGAK.tanganL, KULIT) }} />}
      </g>
      {/* garis bantu tengah char → pusat bayangan */}
      {sendi ? <line x1={H[0] + titikKepala(p)[0]} x2={H[0] + titikKepala(p)[0]} y1={H[1] + titikKepala(p)[1] - 40} y2={H[1] + alasTerendah(p) + (p.angkat ?? 0) + 30}
        stroke="#E5475D" strokeWidth={1.4 / s} strokeDasharray={`${6 / s} ${4 / s}`} /> : null}
      {sendi ? (
        <g transform={`translate(${H[0]} ${H[1]})`} fill="none" stroke="#00AEEF" strokeWidth={1.4 / s}>
          {([0, 1] as const).map((i) => (
            <g key={i} opacity={i ? 0.55 : 1}>
              <polyline points={[sendi.pinggul[i], sendi.lutut[i], sendi.pkaki[i]].map((q) => q.join(',')).join(' ')} />
              <polyline points={[sendi.bahu[i], sendi.siku[i], sendi.perg[i]].map((q) => q.join(',')).join(' ')} />
              {[sendi.pinggul[i], sendi.lutut[i], sendi.pkaki[i], sendi.bahu[i], sendi.siku[i], sendi.perg[i]].map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r={3.2} fill="#00AEEF" stroke="none" />)}
            </g>))}
        </g>) : null}
    </g>);
};
