import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { B, F, HOUSE, R, io, mixHex, rgba } from '../theme';
import { cin, glass, grow, Icon, lerp, LW, MODE_UKUR, Pill, popIn, popOut, type Rect, WordText } from '../parts/kit';
import { BAB, LENSA, ROWS, WARNA_GRUP, nilai, type Grup } from './data';
import { S2 } from '../s02/Scene02';
import { kamera } from '../kamera';
import { Backdrop } from '../parts/Backdrop';
import { denyut } from '../parts/rantai';
import { VO_OFFSET } from '../offset';

/**
 * SCENE 01 — IDE VISUAL (styleframe, 6 Okt). Brief = kolom VISUAL + TEXT naskah Simon.
 * Satu benda yang berubah wujud (anti-slide): deret instrumen → chart kinerja → kartu "Return" di antara
 * lima pertanyaan → peta enam bab. Semua waktu = onset kata VO (src/beats.ts), tanjakan 60f dipusatkan di kata.
 */

/* ── kata pemicu — dicari BERURUTAN (src/beats.ts `urut`), tanpa ambang frame tetap ── */
const [hasilnya, jangka, jelas, jauh, punya, pertumbuhan, cenderung, stabil, harganya, terlalu, penghasilan,
  perbandingan, pertanyaan, bukan, cuma, returnNya, juga, ret, sebenarnya, mana, naik, dicairkan, modal, ini, satu, tiap,
  investasi] = urut(['hasilnya', 'jangka', 'jelas', 'jauh', 'punya', 'pertumbuhan', 'cenderung', 'stabil', 'harganya',
  'terlalu', 'penghasilan', 'perbandingan', 'pertanyaan', 'bukan', 'cuma', 'return-nya', 'juga', 'return', 'sebenarnya',
  'mana', 'naik', 'dicairkan', 'modal', 'ini', 'satu', 'tiap', 'investasi']);
/** kata kunci tiap pertanyaan → "?" gelembungnya berdenyut (gelembung 1 = chart yang menyusut, tanpa denyut) */
const KUNCI_TANYA = [0, mana, naik, dicairkan, modal];
/** pop ikon peta bab (pusat tanjakan 60f): bersamaan adegan berpikir digeser ke bawah — ikon 1 di T.dorong+20, jarak 14f.
 *  +20 (bukan lebih awal): pop ikon 01 baru mulai saat sapuan sudah terlihat (±160 px), dan ikon sudah ≥0,76 ukuran
 *  hanya setelah awan kiri turun melewati baris peta → tidak menimpa awan (uji still f2420–2440, 8 Okt) */
const POP_PETA = (k: number) => T.dorong + 20 + 14 * k;
const T = {
  terbang: hasilnya, // deret ikon terbang jadi kolom chart
  judul: jangka,
  bar: jelas,
  jauh,
  tumbuhR: punya, tumbuhP: pertumbuhan,
  stabilR: cenderung, stabilP: stabil,
  sewaR: harganya, sewaP: terlalu,
  sewaChip: penghasilan,
  bersih: perbandingan,
  judulKeluar: pertanyaan,
  headline: bukan, sorot: cuma + 20,
  tinggi: returnNya, juga,
  line2: sebenarnya,
  // jangkar urutan saja — waktu morph & panel lensa kini = MULAI (arahan Simon)
  morph: ret, L: [0, mana, naik, dicairkan, modal],
  dorong: ini - 19,
  bab0: satu, tiap, aktif: investasi,
};

/**
 * WAKTU MULAI DARI SIMON (6 Okt) — timecode Studio "mm:dd.ff" (ff = frame @60fps). Animasi MULAI di sini
 * (tidak dipusatkan): panel mengecil 00:26.51 · panel 2 00:28.01 · panel 3 00:30.51 · panel 4 00:33.31 · panel 5 00:36.41.
 * Masing-masing ±12–24f sebelum kalimat pertanyaannya ("Tapi", "return", "Seberapa", "Kalau", "Dan").
 */
const tc = (s: string) => { const [m, r] = s.split(':'); const [d, fr] = r.split('.'); return (Number(m) * 60 + Number(d)) * 60 + Number(fr); };
// timecode Simon diberikan saat VO mulai di 0 → + VO_OFFSET (VO kini mulai 00:00.31)
// morph = awal ADEGAN PERTANYAAN: Simon 8 Okt "dimulai saat voice mengatakan 'Mana yang return-nya paling tinggi?' atau di detik 00:25.01"
// (timecode Studio sekarang = frame video → TANPA VO_OFFSET; dulu VO_OFFSET + 00:26.51)
const MULAI = { morph: tc('00:25.01'), panel: [0, tc('00:28.01'), tc('00:30.51'), tc('00:33.31'), tc('00:36.41')].map((v) => (v ? VO_OFFSET + v : 0)) };
const MORPH_D = 80;

/* ── geometri panggung (ruang 1920×1080) ──
 * Tata letak chart = referensi Simon (databoks): batang mendatar MULAI DARI 0, label rata kanan menempel
 * sumbu, kisi putus-putus. Data naskah berupa RENTANG → batang pekat sampai batas bawah, muda sampai batas atas. */
const PANEL: Rect = { x: 150, y: 210, w: 1620, h: 690 };
const rowY = (k: number) => 268 + k * 66;
const X0 = 720, PX = 52.5; // 0% … 16%
const xv = (v: number) => X0 + v * PX;
const AXIS_Y = 838;
const TICKS = [0, 2, 4, 6, 8, 10, 12, 14, 16];
const ICON_X = 676, LABEL_R = 632; // kotak ikon 56 px (ikon Flaticon detail → diperbesar 6 Okt)
const BAR_H = 40, VAL_GAP = 14, VAL_PX = 19.5; // VAL_PX ≈ lebar per karakter angka 28 px ExtraBold
const valEnd = (k: number) => xv(ROWS[k].hi) + VAL_GAP + nilai(ROWS[k]).length * VAL_PX;
/* ── ADEGAN PEMBUKA RADIAL (Simon 7 Okt: "aku mau kamu membuat adegan pertama di scene 1 seperti ini … tidak harus hanya
 * setengah lingkaran, kamu bisa menggunakan 1 lingkaran penuh"; contoh = SUSUNAN saja, gaya tetap gaya rumah) ──
 * pusat "instrumen investasi" + cincin penuh + 9 jari-jari → lingkaran ikon + bar nama. Searah jarum jam dari kanan-atas:
 * kanan = baris chart 0–4 (atas→bawah), kiri = baris 5–8 (bawah→atas). Saat "hasilnya" ikon tetap terbang ke kolom chart. */
const HUB = { x: 995, y: 560, d: 150, cincin: 186 }; // +35: nama sisi kiri lebih panjang → tinta seluruh adegan berpusat di 960
const RAD = 300, IKON_D = 88, PIL_H = 64;
/* Simon 8 Okt: Emas di ATAS tepat di sumbu tengah ("center point"); 4 ikon kanan naik → sejajar dengan 4 ikon kiri (Saham↔Properti,
 * RD Saham↔Deposito, RD Indeks↔RDPU, Obligasi↔RDPT). Dulu kanan −60…60 (5 ikon, Emas di kanan-atas). */
const SUDUT = [-90, -45, -15, 15, 45, 135, 165, 195, 225];
const rad1 = (d: number) => (d * Math.PI) / 180;
/* Simon 8 Okt: "buat lebih besar … space kosongnya terlalu banyak, masih jauh di dalam safe area" → seluruh adegan radial (pusat,
 * cincin, jari-jari, karakter, ikon, pil nama) diperbesar ZR kali terhadap PUSAT TINTANYA (kotak tinta 305–1645 × 247–847 → ±142–1777
 * × 169–911, di dalam wilayah aman 100–1820 × 165–950). Posisi & ukuran kolom chart tujuan terbang TIDAK ikut diperbesar. */
const ZR = 1.22, PR = { x: 960, y: 555 };
const posRadial = (k: number) => {
  const x = HUB.x + RAD * Math.cos(rad1(SUDUT[k])), y = HUB.y + RAD * Math.sin(rad1(SUDUT[k]));
  return { x: PR.x + (x - PR.x) * ZR, y: PR.y + (y - PR.y) * ZR, kanan: Math.cos(rad1(SUDUT[k])) > -0.01 }; // Emas (atas): nama ke kanan
};
/** waktu tiap butir: frasa "berbagai instrumen investasi berdampingan" (f46–164); butir pertama MULAI 26f sebelum "berbagai"
 *  (pola waktu Simon di Scene 01: elemen mulai ±12–24f sebelum frasanya), jeda 12f → semua utuh sebelum ikon terbang */
const T_BUTIR = (k: number) => 50 + 12 * k; // VO kini mulai f31 → "hasilnya" f243: butir terakhir utuh f186, diam ±0,6 dtk sebelum peralihan
/** urutan peralihan pada "hasilnya" (T.terbang): (1) semua bar menutup BERSAMAAN, pusat + cincin + jari-jari pudar,
 *  (2) baru ikon terbang ke kolom chart — dulu bar sisi kiri masih terbuka saat label chart masuk di tempat yang sama */
const TUTUP = (f: number) => R(f, T.terbang - 20, T.terbang + 10, 0, 1, io);
const TERBANG = (k: number) => T.terbang + 20 + 6 * k; // pusat tanjakan 60f terbang ikon k

const grupRect = (a: number, b: number): Rect => {
  const right = Math.max(...ROWS.slice(a, b + 1).map((_, i) => valEnd(a + i))) + 16;
  return { x: 184, y: rowY(a) - 33, w: right - 184, h: rowY(b) - rowY(a) + 66 };
};
const GRUP_RECT: Record<Grup, Rect> = { tumbuh: grupRect(0, 3), stabil: grupRect(4, 7), sewa: grupRect(8, 8) };
const right = (r: Rect) => r.x + r.w;
const PILL = { g: { x: 1460, y: 640 }, s: { x: right(GRUP_RECT.stabil) + 44, y: rowY(5) + 33 }, p: { x: right(GRUP_RECT.sewa) + 40, y: rowY(8) } };

/* lensa & peta */
// NODE_Y 471 (dulu 500): Simon 8 Okt nomor bab dihapus → tinta grup = lingkaran … nama; naik 29 px supaya pusat tintanya SAMA dengan
// dulu (kamera S01 tetap, terukur pusat y 539 di f2800)
const NODE_Y = 471, NODE_D = 170, nodeX = (k: number) => 960 + (k - 2.5) * 290;

/* ── ADEGAN PERTANYAAN (Simon 8 Okt) — menggantikan lima kartu lensa. "adegannya jadi orang berdiri … muncul beberapa thinking bubble
 * sesuai pertanyaannya, gunakan icon seperti sekarang + tanda tanya"; tata letak = gambar acuan Simon (orang besar di tengah terpotong
 * bingkai bawah, 5 awan: atas · kiri-atas · kanan-atas · kiri-bawah · kanan-bawah, tiap awan 2 titik pikiran ke kepala), diskalakan 0,9
 * supaya awan atas tetap di wilayah aman; teks label kartu lama dipertahankan + "?" (Simon). Judul "Jangan cuma lihat return" /
 * "pahami juga…" DIHAPUS (Simon). Adegan ini di RUANG LAYAR (tanpa kamera; tak dirender saat ukur) — tata letaknya simetris sendiri.
 * Orang = guru berpikir, tangan di dagu (Simon 12 Okt: "ganti char berpikir discene 1 dengan ini"; asli 04_Asset/karakter/guru_berpikir_dagu.webp,
 * dipotong ke kotak tintanya → public/karakter/guru_berpikir.png 414×1498). Dulu investor_tanya.png 419×1433 — lebar kepala & bahu nyaris
 * sama (175 / 404 px di gambar), jadi skala tetap; kepalaCx 175→170 = pusat kepala gambar baru 4,9 px lebih ke kiri → kepala di titik yang sama. ── */
/* acuan ke-2 Simon (9.webp, 1860×1250 → skala 0,864 di sumbu x 1000→960): orang LEBIH BESAR (kepala ±175 px, pusat kepala (948, 588)) */
const ORANG = { s: 0.97, kepalaX: 948, atas: 495, w: 414, h: 1498, kepalaCx: 170 };
const ORANG_X0 = ORANG.kepalaX - ORANG.kepalaCx * ORANG.s;
/** awan 470 × 307 (ukuran tetap — Simon 8 Okt: "layoutnya seperti contohku ini, tapi ukurannya seperti yang kamu buat sekarang");
 *  posisi = acuan ke-2 × 0,864: atas (960, 215) · kiri/kanan-atas ±425 di y 400 · kiri/kanan-bawah 480/1440 di y 800 (bawah awan 954, di atas
 *  subtitle 978; kanan-bawah digeser +26 supaya berjarak ≥ 29 px dari bahu kanan). Urutan = pertanyaan 1–5. */
const AWAN = { w: 470, h: 307, ikonD: 112 };
const GEL = [{ x: 960, y: 215 }, { x: 535, y: 400 }, { x: 1385, y: 400 }, { x: 480, y: 800 }, { x: 1440, y: 800 }];
/** dua titik pikiran tiap awan = posisi acuan ke-2 × 0,864 (besar r 24 dekat awan, kecil r 14 dekat kepala); tiap titik dicek tak
 *  menyentuh elips awan maupun siluet orang */
const TITIK = [
  [{ x: 949, y: 402, r: 24 }, { x: 949, y: 467, r: 14 }],
  [{ x: 726, y: 536, r: 24 }, { x: 775, y: 560, r: 14 }],
  [{ x: 1192, y: 535, r: 24 }, { x: 1142, y: 559, r: 14 }],
  [{ x: 699, y: 678, r: 24 }, { x: 749, y: 653, r: 14 }],
  [{ x: 1223, y: 679, r: 24 }, { x: 1173, y: 655, r: 14 }],
];
/** pusat kotak tinta tepi awan (terukur di render) = (x+1, y−4). Simon 8 Okt ("icon-iconnya masih belum berada ditengah awan"): ikon +
 *  label = SATU BLOK (ikon 112 + 10 + baris 35 = 157) yang dipusatkan di sana — ikon sendirian di pusat membuat isinya menggantung ke bawah */
const BLOK = AWAN.ikonD + 10 + 35;
const ikonGel = (k: number) => ({ x: GEL[k].x + 1, y: GEL[k].y - 4 - BLOK / 2 + AWAN.ikonD / 2 });

/** awal Scene 02 — sesudahnya peta bab keluar (bab 02–06 turun, bab 01 diambil alih Scene02) */
// S2 = awal Scene 02 (arahan Simon: global 2829) — SATU sumber di s02/Scene02.tsx

export const Scene01: React.FC<{ f: number }> = ({ f }) => {
  if (f >= S2 + 100) return null;
  /* fokus grup (B4–B7) dan sorot Emas (B9) */
  const rG = cin(f, T.tumbuhR), rS = cin(f, T.stabilR), rP = cin(f, T.sewaR), rC = cin(f, T.bersih);
  const rM = R(f, MULAI.morph, MULAI.morph + MORPH_D, 0, 1, io); // chart → kartu "Return" (mulai: arahan Simon)
  const fadeM = 1 - R(f, MULAI.morph, MULAI.morph + MORPH_D / 2, 0, 1, io);
  const rE = cin(f, T.tinggi) * (1 - rM);
  const w = { tumbuh: rG * (1 - rS), stabil: rS * (1 - rP), sewa: rP * (1 - rC) };
  const wsum = w.tumbuh + w.stabil + w.sewa;
  const dimOf = (k: number, g: Grup) =>
    Math.min(1, (Object.keys(w) as Grup[]).reduce((s, gg) => s + (gg === g ? 0 : w[gg]), 0) + (k === 0 ? 0 : rE));
  const warnaBar = (g: Grup) => mixHex(B.blueLite, WARNA_GRUP[g], cin(f, g === 'tumbuh' ? T.tumbuhR : g === 'stabil' ? T.stabilR : T.sewaR));
  const rD = cin(f, T.dorong); // adegan berpikir digeser KE BAWAH keluar layar (Simon 8 Okt: "jangan swipe up, swipe ke bawah aja") → peta bab
  const panelOp = cin(f, T.terbang + 50);
  const kam = kamera('S01', f); // KAMERA PUSAT (Simon 7 Okt: visual di titik tengah frame di setiap momen)

  /* kotak sorot grup = rata-rata berbobot kotak tiap grup (bergeser, tidak lompat) */
  const reg = wsum > 0.001 ? (() => {
    let x = 0, y = 0, ww = 0, h = 0, col = B.blue;
    (Object.keys(w) as Grup[]).forEach((g) => {
      const k = w[g] / wsum, r = GRUP_RECT[g];
      x += r.x * k; y += r.y * k; ww += r.w * k; h += r.h * k;
    });
    col = mixHex(mixHex(WARNA_GRUP.tumbuh, WARNA_GRUP.stabil, rS), WARNA_GRUP.sewa, rP);
    return { r: { x, y, w: ww, h }, col, op: Math.min(1, wsum) };
  })() : null;

  const pG = popIn(f, T.tumbuhP + 15) * popOut(f, T.stabilR);
  const pS = popIn(f, T.stabilP) * popOut(f, T.sewaR);
  const pP = popIn(f, T.sewaP) * popOut(f, T.bersih);
  const pSewa = popIn(f, T.sewaChip) * popOut(f, T.bersih);
  const gap = cin(f, T.jauh) * (1 - cin(f, T.tumbuhP)); // pudar di "pertumbuhan" (panah di baris Properti, tak berbagi tempat dgn kotak sorot) → utuh ±0,6 dtk
  const trophy = popIn(f, T.tinggi) * fadeM;

  /* TRANSISI chart → kartu "Return" = MASKER LINGKARAN (Simon 7 Okt: "masking saja graphic dengan lingkaran iconnya … lingkaran
   * ungu dari icon itu ikut mengecil ke ukuran sekarang"): chart terlihat DI DALAM lingkaran yang mula-mula menutupi seluruh
   * panel, lalu mengecil & bergerak ke lingkaran ikon kartu Return (Ø132); isinya terisi ungu, lalu ikon muncul di dalamnya.
   * Mulai = arahan Simon 00:26.51 (MULAI.morph), 80f. */
  // masker dari SELURUH LAYAR (pola masker scene lain, Simon 8 Okt: latar berganti saat masuk adegan pertanyaan) — koordinat LAPIS A berkamera
  const M0 = { x: 960 - kam.x, y: 540 - kam.y, r: Math.hypot(960, 540) + 12 };
  // lingkaran ikon awan pertanyaan 1 (ruang LAYAR) → dikurangi kamera karena masker digambar di LAPIS A yang berkamera
  const M1 = { x: ikonGel(0).x - kam.x, y: ikonGel(0).y - kam.y, r: AWAN.ikonD / 2 };
  const mask = { x: lerp(M0.x, M1.x, rM), y: lerp(M0.y, M1.y, rM), r: lerp(M0.r, M1.r, rM) };
  // tiap tahap = tanjakan WAKTU sendiri (inOut cubic) — bukan remap progres rM yang sudah di-ease (easing bertumpuk)
  const tM = (a: number, b: number) => R(f, MULAI.morph + a * MORPH_D, MULAI.morph + b * MORPH_D, 0, 1, io);
  const isiUngu = tM(0.45, 0.95); // chart → ungu penuh di paruh akhir
  const cincin = tM(0.05, 0.3); // tepi lingkaran ungu terlihat begitu masuk bingkai
  // chart ikut mengecil ke dalam lingkaran, tapi LEBIH LAMBAT dari lingkarannya → lingkaran memotong chart bertahap
  const sChart = Math.pow(mask.r / M0.r, 0.6);
  const orang = R(f, MULAI.morph + 40, MULAI.morph + 90, 0, 1, io); // orang muncul (naik + pudar) sesudah lingkaran chart lewat di atasnya
  const t0Awan = (k: number) => (k === 0 ? MULAI.morph + MORPH_D + 30 : MULAI.panel[k] + 30); // awan 1 tumbuh SESUDAH chart mendarat
  const glifReturn = popIn(f, MULAI.morph + MORPH_D + 10); // ikon tanaman pop di dalam lingkaran yang sudah mendarat

  return (
    <AbsoluteFill>
      {/* ═════════ ADEGAN PERTANYAAN · latar berona KRIM (Simon 8 Okt) — tersingkap di luar lingkaran masker, ikut didorong ke atas ═════════ */}
      {!MODE_UKUR && rM > 0 && rD < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - rD }}><Backdrop f={f} hue={HOUSE.krim} /></AbsoluteFill>) : null}{/* latar TIDAK ikut digeser: memudar ke latar peta (Simon) */}

      {/* ═════════ ADEGAN PERTANYAAN · orang (ruang layar, DI BELAKANG masker chart) ═════════ */}
      {!MODE_UKUR && orang > 0.001 ? (
        <AbsoluteFill style={{ transform: `translateY(${1080 * rD}px)` }}>
          {/* bagian bawah badan memudar (y 945→995) — teks subtitle (y ±986–1030) tak menimpa badan yang pekat */}
          <Img src={staticFile('karakter/guru_berpikir.png')} style={{ position: 'absolute', left: 0, top: 0, width: ORANG.w * ORANG.s, height: ORANG.h * ORANG.s, opacity: orang, maxWidth: 'none',
            transform: `translate3d(${ORANG_X0}px, ${ORANG.atas + 50 * (1 - orang) + 0.03}px, 0) rotate(0.001deg)`,
            WebkitMaskImage: `linear-gradient(to bottom, #000 ${((945 - ORANG.atas) / (ORANG.h * ORANG.s)) * 100}%, transparent ${((995 - ORANG.atas) / (ORANG.h * ORANG.s)) * 100}%)`,
            maskImage: `linear-gradient(to bottom, #000 ${((945 - ORANG.atas) / (ORANG.h * ORANG.s)) * 100}%, transparent ${((995 - ORANG.atas) / (ORANG.h * ORANG.s)) * 100}%)` }} />
        </AbsoluteFill>) : null}

      {/* ═════════ LAPIS A: chart → lensa (didorong ke atas di B14) ═════════ */}
      {/* translate3d + rotasi mikro: geser kamera pelan tidak dibulatkan Chrome ke piksel bulat (terukur: radial meloncat 1 px di f228) */}
      <AbsoluteFill style={{ transform: `translate3d(${kam.x}px, ${1080 * rD + kam.y + 0.03}px, 0) rotate(0.001deg)` }}>
        {/* chart di dalam MASKER lingkaran (lihat M0→M1); selesai mendarat → digantikan lingkaran ikon statis di bawah */}
        {/* pembungkus masker SELALU aktif (radius raksasa sebelum mulai): dulu baru dipasang di frame pertama masker → teks chart dirasterkan
            ulang & bergeser 1 frame (terukur: lonjakan f1502, beda 0,77 vs median 0,05) */}
        {rM < 1 ? (
        <div style={{ position: 'absolute', inset: 0, clipPath: `circle(${rM > 0 ? mask.r : 4000}px at ${mask.x}px ${mask.y}px)` }}>
        {/* di dalam lingkaran = latar LAMA (ungu) — di luar tersingkap latar adegan pertanyaan (krim) */}
        {rM > 0 && !MODE_UKUR ? <AbsoluteFill style={{ transform: `translate(${-kam.x}px, ${-kam.y}px)` }}><Backdrop f={f} /></AbsoluteFill> : null}
        <div style={{ position: 'absolute', inset: 0, transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mask.x - M0.x}px, ${mask.y - M0.y}px) scale(${sChart}) rotate(0.001deg)` }}>
        <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: panelOp, transform: `scale(${lerp(0.97, 1, panelOp)})`, ...glass() }} />

        {/* isi chart (diam; masker yang bergerak) */}
        <AbsoluteFill>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {/* kotak sorot grup — DI BELAKANG isi */}
            {reg ? <rect x={reg.r.x} y={reg.r.y} width={reg.r.w} height={reg.r.h} rx={18} fill={rgba(reg.col, 0.08 * reg.op)} stroke={rgba(reg.col, 0.45 * reg.op)} strokeWidth={LW.main} /> : null}
            {/* kisi putus-putus (referensi) + sumbu */}
            <g opacity={cin(f, T.terbang + 80)}>
              {TICKS.map((v) => (
                <line key={`v${v}`} x1={xv(v)} x2={xv(v)} y1={rowY(0) - 33} y2={AXIS_Y} stroke={B.gray} strokeWidth={LW.hair} strokeDasharray="5 7" opacity={0.45} />))}
              {ROWS.map((_, k) => (
                <line key={`h${k}`} x1={X0} x2={xv(16)} y1={rowY(k) - 33} y2={rowY(k) - 33} stroke={B.gray} strokeWidth={LW.hair} strokeDasharray="5 7" opacity={0.45} />))}
              <line x1={X0} x2={xv(16)} y1={AXIS_Y} y2={AXIS_Y} stroke={B.gray} strokeWidth={LW.fine} opacity={0.7} />
              <line x1={X0} x2={X0} y1={rowY(0) - 33} y2={AXIS_Y} stroke={B.gray} strokeWidth={LW.fine} opacity={0.7} />
            </g>
            {/* batang dari 0. Data Simon 16 Okt = SATU angka per instrumen → Simon "warnanya buat seperti sebelumnya" (dua tingkat): pekat
                sampai nilainya + JALUR MUDA di belakangnya sampai ujung sumbu (16%) — dulu pekat sampai batas bawah rentang, muda sampai atas */}
            {ROWS.map((r, k) => {
              const g = grow(f, T.bar + 8 * k); // jeda 8f: VO Scene 1 baru lebih cepat, batang terakhir harus selesai sebelum panah "jauh"
              if (g <= 0.001) return null;
              const L = (xv(TICKS[TICKS.length - 1]) - X0) * g, solid = Math.min(L, xv(r.lo) - X0);
              const col = warnaBar(r.grup), op = 1 - 0.66 * dimOf(k, r.grup);
              const y = rowY(k) - BAR_H / 2;
              return (
                <g key={r.nama} opacity={op}>
                  <rect x={X0} y={y} width={L} height={BAR_H} rx={6} fill={rgba(col, 0.34)} />
                  <rect x={X0} y={y} width={solid} height={BAR_H} rx={6} fill={col} />
                </g>);
            })}
            {/* "perbedaannya cukup jauh" — pemandu putus-putus dari ujung Emas + panah dua arah di baris Properti */}
            {gap > 0.001 ? (
              <g opacity={Math.min(1, gap * 2)}>
                <line x1={xv(ROWS[0].hi)} x2={xv(ROWS[0].hi)} y1={rowY(0) + BAR_H / 2 + 4} y2={rowY(0) + BAR_H / 2 + 4 + (rowY(8) - rowY(0) - BAR_H / 2 - 4) * gap} stroke={B.blue} strokeWidth={LW.main} strokeDasharray="7 11" strokeLinecap="round" opacity={0.92} />
                <Panah x1={valEnd(8) + 16} x2={xv(ROWS[0].hi) - 4} y={rowY(8)} p={cin(f, T.jauh + 12) * (1 - cin(f, T.tumbuhP))} col={B.blue} />
              </g>) : null}
            {/* garis penunjuk pil */}
            {pG > 0.01 ? <line x1={PILL.g.x} x2={PILL.g.x} y1={GRUP_RECT.tumbuh.y + GRUP_RECT.tumbuh.h} y2={PILL.g.y - 25} stroke={B.blue} strokeWidth={LW.main} opacity={Math.min(1, pG)} /> : null}
            {pS > 0.01 ? <line x1={right(GRUP_RECT.stabil)} x2={PILL.s.x} y1={PILL.s.y} y2={PILL.s.y} stroke={B.turq} strokeWidth={LW.main} opacity={Math.min(1, pS)} /> : null}
            {pP > 0.01 ? <line x1={right(GRUP_RECT.sewa)} x2={PILL.p.x} y1={PILL.p.y} y2={PILL.p.y} stroke={B.orange} strokeWidth={LW.main} opacity={Math.min(1, pP)} /> : null}
          </svg>

          {/* label (rata kanan, menempel kolom ikon), nilai di ujung batang — pudar saat morph */}
          <div style={{ position: 'absolute', inset: 0, opacity: fadeM }}>
            {ROWS.map((r, k) => {
              const dim = 1 - 0.66 * dimOf(k, r.grup);
              const land = TERBANG(k) + 32;
              return (
                <React.Fragment key={r.nama}>
                  <div style={{ position: 'absolute', right: 1920 - LABEL_R, top: rowY(k), transform: 'translateY(-50%)', opacity: dim, whiteSpace: 'nowrap', textAlign: 'right' }}>
                    <WordText f={f} at={land} style={{ fontFamily: F, fontSize: 30, fontWeight: 700, color: B.night }}>{r.nama}</WordText>
                    {r.catatan ? <span style={{ fontFamily: F, fontSize: 22, fontWeight: 600, color: B.gray, marginLeft: 10, opacity: cin(f, land + 20) }}>({r.catatan})</span> : null}
                  </div>
                  <div style={{ position: 'absolute', left: xv(r.hi) + VAL_GAP, top: rowY(k), transform: 'translateY(-50%)', opacity: dim * cin(f, T.bar + 8 * k + 30), fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {nilai(r)}
                  </div>
                </React.Fragment>);
            })}
            {TICKS.map((v) => (
              <div key={v} style={{ position: 'absolute', left: xv(v), top: AXIS_Y + 14, transform: 'translateX(-50%)', opacity: cin(f, T.terbang + 80), fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>{v}%</div>))}
            {/* sumber data grafik Simon 16 Okt (feedback: angka presisi + periode jelas) */}
            <div style={{ position: 'absolute', left: PANEL.x + 34, top: PANEL.y + PANEL.h + 12, opacity: cin(f, T.terbang + 80), fontFamily: F, fontSize: 18, fontWeight: 600, color: B.gray, whiteSpace: 'nowrap' }}>
              Sumber: BEI, LBMA, Bank Dunia, BIS, Infovesta, fund fact sheet. Kinerja masa lalu tidak menjamin kinerja masa depan.
            </div>
            <Pill x={PILL.g.x} y={PILL.g.y} anchor="center" text="Pertumbuhan lebih besar" p={pG} col={B.blue} />
            <Pill x={PILL.s.x} y={PILL.s.y} text="Lebih stabil" p={pS} col={B.turq} />
            <Pill x={PILL.p.x} y={PILL.p.y} text="Naik terbatas" p={pP} col={B.orange} />
            <Pill x={PILL.p.x + 256} y={PILL.p.y} text="+ Penghasilan sewa" icon="kunciSewa" p={pSewa} col={B.orange} />
            {trophy > 0.01 ? (
              <div style={{ position: 'absolute', left: valEnd(0) + 40, top: rowY(0), width: 52, height: 52, borderRadius: 99, background: B.blue, display: 'grid', placeItems: 'center', transform: `translate(-50%, -50%) scale(${trophy})`, boxShadow: `0 6px 18px -4px ${B.blue}88` }}>
                <Icon name="trofi" size={30} color={B.white} />
              </div>) : null}
          </div>
        </AbsoluteFill>

        {/* ═════ ADEGAN PEMBUKA RADIAL (B1) → ikon terbang jadi kolom ikon chart (B2) ═════ */}
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${ZR})`, transformOrigin: `${PR.x}px ${PR.y}px` }}><PembukaRadial f={f} /></div>
        {ROWS.map((r, k) => {
          const p = popIn(f, T_BUTIR(k));
          const t = cin(f, TERBANG(k));
          const size = lerp(IKON_D * ZR, 56, t);
          const o = posRadial(k);
          const cx = lerp(o.x, ICON_X, t), cy = lerp(o.y, rowY(k), t);
          const dim = 1 - 0.66 * dimOf(k, r.grup);
          if (p <= 0.001) return null;
          // bar nama melekat di ikon, menutup (ke arah ikon) di awal terbang
          // bar menutup BERSAMAAN sebelum ikon terbang (TUTUP) — tak pernah bertemu label chart
          const buka = R(f, T_BUTIR(k) - 10, T_BUTIR(k) + 40, 0, 1, io) * (1 - TUTUP(f));
          return (
            <React.Fragment key={r.nama}>
              {buka > 0.001 ? (
                <div style={{
                  position: 'absolute', top: cy - PIL_H * ZR / 2, height: PIL_H * ZR, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
                  ...(o.kanan ? { left: cx, paddingLeft: (IKON_D / 2 + 18) * ZR, paddingRight: 30 * ZR } : { right: 1920 - cx, paddingRight: (IKON_D / 2 + 18) * ZR, paddingLeft: 30 * ZR }),
                  borderRadius: PIL_H * ZR / 2, background: B.blueWash, boxShadow: `0 0 0 1.5px ${B.blue}1f`,
                  clipPath: o.kanan ? `inset(0 ${(1 - buka) * 100}% 0 0 round ${PIL_H * ZR / 2}px)` : `inset(0 0 0 ${(1 - buka) * 100}% round ${PIL_H * ZR / 2}px)`,
                }}>
                  <span style={{ fontFamily: F, fontSize: 28 * ZR, fontWeight: 800, color: B.night }}>{r.nama}</span>
                </div>) : null}
              <div style={{
                position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size,
                borderRadius: lerp(IKON_D * ZR / 2, 14, t), background: B.white, display: 'grid', placeItems: 'center',
                boxShadow: `0 0 0 ${lerp(3, 1.5, t)}px ${t < 0.5 ? B.blue : `${B.blue}22`}, 0 ${lerp(14, 4, t)}px ${lerp(30, 10, t)}px -10px ${B.blue}55`,
                transform: `scale(${p})`, opacity: fadeM * dim,
              }}>
                <Icon name={r.ikon} size={size * 0.64} color={mixHex(B.blue, warnaBar(r.grup), t)} />
              </div>
            </React.Fragment>);
        })}

        </div>
        {isiUngu > 0.001 ? <AbsoluteFill style={{ background: B.blue, opacity: isiUngu }} /> : null}
        </div>) : null}
        {rM > 0.001 && rM < 1 && cincin > 0.001 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: cincin }}>
            <circle cx={mask.x} cy={mask.y} r={Math.max(0, mask.r - 3)} fill="none" stroke={B.blue} strokeWidth={6} />
          </svg>) : null}

        {/* JUDUL chart → HEADLINE pesan (teks naskah Simon) — TIDAK ikut kamera pusat (geser balik), tidak dirender saat ukur */}
        {MODE_UKUR ? null : <div style={{ position: 'absolute', inset: 0, transform: `translate(${-kam.x}px, ${-kam.y}px)` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center' }}>
          <WordText f={f} at={T.judul} until={T.judulKeluar} style={{ fontFamily: F, fontSize: 52, fontWeight: 800, color: B.night, letterSpacing: '-.02em' }}>Rata-rata return per tahun, 2000-an–2025</WordText>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 138, textAlign: 'center' }}>
          <WordText f={f} at={T.judul + 20} until={T.judulKeluar} style={{ fontFamily: F, fontSize: 28, fontWeight: 600, color: B.gray }}>Periode tiap aset berbeda, sesuai ketersediaan data</WordText>
        </div>
        {/* judul "Jangan cuma lihat return" + "pahami juga dari mana return itu datang" DIHAPUS (Simon 8 Okt) */}
        </div>}
      </AbsoluteFill>

      {/* ═════════ ADEGAN PERTANYAAN · awan (ruang layar, DI ATAS LAPIS A) ═════════ */}
      {!MODE_UKUR && f >= MULAI.morph ? (
        <AbsoluteFill style={{ transform: `translateY(${1080 * rD}px)` }}>
          {GEL.map((g, k) => {
            const t0 = t0Awan(k), p = popIn(f, t0);
            // (slot awan kosong putus-putus DIHAPUS — Simon 8 Okt: "hapus saja awan kosong ini")
            const dy = 0; // gerak melayang DIHAPUS (Simon 8 Okt: "hapus gerakan idle animasi thinking bubblenya")
            return (
              <React.Fragment key={k}>
                {TITIK[k].map((d, i) => {
                  const q = popIn(f, t0 + 10 + 8 * i);
                  return q > 0.001 ? <div key={i} style={{ position: 'absolute', left: d.x - d.r, top: d.y - d.r, width: 2 * d.r, height: 2 * d.r, borderRadius: 99, background: B.white, border: `3px solid ${B.grayLite}`, transform: `translateY(${dy}px) scale(${q})` }} /> : null;
                })}
                <AwanTanya f={f} k={k} p={p} dy={dy} dn={denyut(f, KUNCI_TANYA[k])} ikonP={k === 0 ? (f >= MULAI.morph + MORPH_D ? 1 : 0) : p} glif={k === 0 ? glifReturn : 1} />
              </React.Fragment>);
          })}
        </AbsoluteFill>) : null}

      {/* ═════════ LAPIS B: peta enam bab — TIDAK bergeser (Simon 8 Okt): ikonnya pop satu per satu (easeOutBack) bersamaan adegan berpikir
          digeser ke bawah; lingkaran dasar putus-putus DIHAPUS (dulu terlihat kosong sebelum ikon pop) ═════════ */}
      {rD > 0.001 ? (
        <AbsoluteFill style={{ transform: `translate3d(${kam.x}px, ${kam.y + 0.03}px, 0) rotate(0.001deg)` }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: 1 - R(f, S2, S2 + 40, 0, 1, io) }}>
            {/* garis penghubung tergambar kiri → kanan bersama ikon yang pop */}
            <line x1={nodeX(0)} x2={lerp(nodeX(0), nodeX(5), R(f, POP_PETA(0), POP_PETA(5), 0, 1, io))} y1={NODE_Y} y2={NODE_Y} stroke={B.grayLite} strokeWidth={LW.main} strokeDasharray="7 11" strokeLinecap="round" />
          </svg>
          {BAB.map((b, k) => {
            const at = POP_PETA(k);
            const p = popIn(f, at);
            // "satu per satu" (T.bab0 = 'satu'): ikon berdenyut BERGILIRAN jarak 20f — dulu jendela ini diisi pop ikon; sejak pop pindah ke
            // sapuan (Simon 8 Okt) peta diam 2,5 dtk (pindai-diam 42,8–45,2 dtk) → denyut bergilir menggambar "satu per satu"
            const bump = (Math.sin(Math.PI * R(f, T.bab0 - 30 + 20 * k, T.bab0 + 30 + 20 * k, 0, 1, io))
              + Math.sin(Math.PI * R(f, T.tiap - 30 + 12 * k, T.tiap + 30 + 12 * k, 0, 1, io))) * 0.07;
            // Simon 6 Okt: "di ending scene 1 … tidak fade icon lainnya, highlight itu seharusnya baru dimulai di scene 2" →
            // Scene 01 berakhir NETRAL (tanpa sorot bab 01, bab lain penuh). Sorot & redup dimulai di awal Scene 02 (S2).
            const act = 0;
            const sc = 1 + bump + 0.16 * act;
            const dim = k === 0 ? 1 : 1 - 0.4 * R(f, S2, S2 + 60, 0, 1, io);
            // keluar sesudah Scene 02 mulai: bab 02–06 turun 220 px + pudar berjenjang 6f (sudah hampir hilang saat bab 01 melintas); bab 01 TIDAK digambar (Scene02 mengambil alih)
            const kel = k === 0 ? 0 : R(f, S2 + 20 + 6 * (k - 1), S2 + 80 + 6 * (k - 1), 0, 1, io);
            if (k === 0 && f >= S2) return null;
            return (
              <div key={b.no} style={{ position: 'absolute', inset: 0, transform: `translate3d(0, ${220 * kel + 0.03}px, 0) rotate(0.001deg)`, opacity: 1 - kel }}>
              {/* posisi lewat translate3d + rotasi mikro (bukan left/top/translateY murni): turun lambat tanpa judder 1 px, dan rantai transform
                  SAMA PERSIS dengan simpul bab 01 di Scene 02 → serah-terima identik piksel */}
              <React.Fragment key={b.no}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: NODE_D, height: NODE_D, transform: `translate3d(${nodeX(k) - NODE_D / 2}px, ${NODE_Y - NODE_D / 2 + 0.03}px, 0) rotate(0.001deg) scale(${sc})`, opacity: dim }}>
                  {act > 0.001 ? <div style={{ position: 'absolute', inset: -14, borderRadius: 99, border: `3px solid ${b.warna}`, opacity: act, boxShadow: `0 0 36px 4px ${b.warna}55` }} /> : null}
                  {p > 0.001 ? (
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: b.warna, display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 18px 40px -12px ${b.warna}aa` }}>
                      <Icon name={b.ikon} size={96} color={B.white} />
                    </div>) : null}
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: 270, textAlign: 'center', lineHeight: 1.18, opacity: dim, transform: `translate3d(${nodeX(k) - 135}px, ${NODE_Y + NODE_D / 2 + 34 + 0.03}px, 0) rotate(0.001deg)` }}>
                  <WordText f={f} at={at + 5} rataBaris style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{b.nama}</WordText>
                </div>
              </React.Fragment>
              </div>);
          })}
        </AbsoluteFill>) : null}
    </AbsoluteFill>
  );
};

/* bingkai warna bergeser di belakang kartu — perangkat kartu CTA (styleframe K2–K6 yang Simon setujui) */
/* panah dua arah (garis + dua kepala) — p = kemajuan gambar */
const Panah: React.FC<{ x1: number; x2: number; y: number; p: number; col: string }> = ({ x1, x2, y, p, col }) => {
  if (p <= 0.001) return null;
  const mid = (x1 + x2) / 2, half = ((x2 - x1) / 2) * p;
  const a = mid - half, b = mid + half, hs = 16;
  return (
    <g>
      <line x1={a + hs * 0.6} x2={b - hs * 0.6} y1={y} y2={y} stroke={col} strokeWidth={LW.main} strokeLinecap="round" />
      <path d={`M${a} ${y} L${a + hs} ${y - hs * 0.6} L${a + hs} ${y + hs * 0.6} Z`} fill={col} />
      <path d={`M${b} ${y} L${b - hs} ${y - hs * 0.6} L${b - hs} ${y + hs * 0.6} Z`} fill={col} />
    </g>);
};

/** pusat + cincin + jari-jari adegan pembuka; keluar (mengecil + pudar) bersamaan ikon terbang ke chart */
const PembukaRadial: React.FC<{ f: number }> = ({ f }) => {
  const keluar = R(f, T.terbang - 20, T.terbang + 30, 0, 1, io);
  if (keluar >= 0.999) return null;
  const pusat = popIn(f, 24);
  const cincin = grow(f, 40);
  if (pusat <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - keluar, transform: `scale(${lerp(1, 0.86, keluar)})`, transformOrigin: `${HUB.x}px ${HUB.y}px` }}>
      {/* lingkaran lembut berlapis (gaya rumah: wash ungu) */}
      {[340, 270].map((d, i) => (
        <div key={d} style={{ position: 'absolute', left: HUB.x - d / 2, top: HUB.y - d / 2, width: d, height: d, borderRadius: 999, background: B.blueWash, opacity: i === 0 ? 0.55 : 0.9, transform: `scale(${pusat})` }} />))}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {/* cincin penuh, tergambar searah jarum jam dari atas */}
        <circle cx={HUB.x} cy={HUB.y} r={HUB.cincin} fill="none" stroke={B.blueLite} strokeWidth={3} pathLength={1000} strokeDasharray={`${cincin * 1000} 1000`} transform={`rotate(-90 ${HUB.x} ${HUB.y})`} strokeLinecap="round" />
        {ROWS.map((_, k) => {
          const a = rad1(SUDUT[k]), g = grow(f, T_BUTIR(k) - 10);
          const lepas = 1 - TUTUP(f); // jari-jari pudar bersama bar, sebelum ikon terbang
          if (g <= 0.001 || lepas <= 0.001) return null;
          const r0 = HUB.cincin, r1 = RAD - IKON_D / 2 - 8;
          const x0 = HUB.x + r0 * Math.cos(a), y0 = HUB.y + r0 * Math.sin(a);
          const x1 = HUB.x + lerp(r0, r1, g) * Math.cos(a), y1 = HUB.y + lerp(r0, r1, g) * Math.sin(a);
          return (
            <g key={k} opacity={lepas}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={B.blue} strokeWidth={LW.main} strokeLinecap="round" opacity={0.55} />
              <circle cx={x0} cy={y0} r={7 * popIn(f, T_BUTIR(k) - 14)} fill={B.turq} stroke={B.white} strokeWidth={2.5} />
            </g>);
        })}
      </svg>
      {/* inti: KARAKTER investor (Simon 8 Okt, brief K · A0 — "kita" menimbang instrumen di sekelilingnya; dulu ikon
          "instrumen investasi" Ø150). Lingkaran oranye Ø250 berisi setengah badan; kepala menyembul di atas lingkaran. */}
      <KarakterPusat s={pusat} />
    </div>);
};

/** bentuk awan pikiran (kotak acuan 400×284, diskalakan ke AWAN.w): elips digambar dua kali — tepi abu (garis 6) lalu isi putih tanpa
 *  garis → hanya tepi LUAR yang terlihat (3 px). `putus` = slot kosong bertepi putus-putus. Bayangan = salinan ungu 7% bergeser 14 px
 *  (tanpa filter blur: filter memperlambat Studio). */
const AWAN_BENTUK: [number, number, number, number][] = [ // cx, cy, rx, ry
  [60, 140, 58, 58], [135, 82, 72, 72], [250, 72, 78, 78], [338, 145, 62, 62], [262, 210, 70, 70], [140, 205, 75, 75], [200, 145, 140, 95]];
const Awan: React.FC<{ x: number; y: number; s: number; dy?: number; putus?: boolean }> = ({ x, y, s, dy = 0, putus = false }) => {
  const bentuk = (props: React.SVGProps<SVGEllipseElement>) => AWAN_BENTUK.map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} vectorEffect="non-scaling-stroke" {...props} />);
  return (
    <svg width={AWAN.w} height={AWAN.h} viewBox="0 0 400 284" preserveAspectRatio="none" style={{ position: 'absolute', left: x - AWAN.w / 2, top: y - AWAN.h / 2, overflow: 'visible',
      transform: `translateY(${dy}px) scale(${s})`, transformOrigin: 'center' }}>
      {putus ? null : <g transform="translate(0 14)">{bentuk({ fill: B.blue, opacity: 0.07 })}</g>}
      <g>{bentuk({ fill: B.white, stroke: B.grayLite, strokeWidth: 6, strokeDasharray: putus ? '10 9' : undefined })}</g>
      <g>{bentuk({ fill: B.white })}</g>
    </svg>);
};

/** awan pertanyaan k: lingkaran ikon lensa + LABEL KARTU LAMA + "?" (Simon 8 Okt: "text pada bubble sebelum kamu ganti … tetap kamu
 *  pertahankan hanya tambah '?' diakhir textnya"). Awan 1: lingkaran ikonnya = chart yang menyusut lewat masker (ikon pop sesudah mendarat).
 *  Pop berporos di tengah awan; seisi awan ikut melayang. */
const AwanTanya: React.FC<{ f: number; k: number; p: number; dy: number; dn: number; ikonP: number; glif: number }> = ({ f, k, p, dy, dn, ikonP, glif }) => {
  const l = LENSA[k], g = GEL[k], ik = ikonGel(k);
  return (
    <>
      {p > 0.001 ? <Awan x={g.x} y={g.y} s={p} dy={dy} /> : null}
      {ikonP > 0.001 && l.ikon ? (
        <div style={{ position: 'absolute', left: ik.x - AWAN.ikonD / 2, top: ik.y - AWAN.ikonD / 2, width: AWAN.ikonD, height: AWAN.ikonD, borderRadius: 99, background: l.warna, display: 'grid', placeItems: 'center',
          transform: `translateY(${dy}px) scale(${(k === 0 ? 1 : p) + dn})`, transformOrigin: 'center' }}>
          <div style={{ transform: `scale(${glif})` }}><Icon name={l.ikon} size={68} color={B.white} /></div>
        </div>) : null}
      {p > 0.001 ? (
        <div style={{ position: 'absolute', left: ik.x - 180, width: 360, top: ik.y + AWAN.ikonD / 2 + 10, textAlign: 'center', lineHeight: 1.1, whiteSpace: 'nowrap', transform: `translateY(${dy}px)` }}>
          <WordText f={f} at={k === 0 ? MULAI.morph + MORPH_D + 50 : MULAI.panel[k] + 50} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{`${l.nama}?`}</WordText>
        </div>) : null}
    </>);
};

/** karakter A0 (04_Asset/001. Char/Char 1, dipotong ke public/karakter/investor_A0.png 600×700): lingkaran Ø250 + foto setengah badan.
 *  Simon 8 Okt: latar lingkaran ORANYE brand (ungu menyatu dengan kemeja biru karakter), karakter diperbesar sedikit (skala 0,5 → 0,56).
 *  Dua lapis gambar identik: (1) terpotong lingkaran, (2) pita atas selebar kepala → gabungannya = lingkaran + kepala yang menyembul.
 *  Titik (ax, ay) gambar = pusat lingkaran; pop berporos di pusat lingkaran. */
const SKALA_GURU = 0.44;
/*  Simon 12 Okt "scene 1 awal ganti gambar orangnya jadi ini": GURU berjas (name tag Tuntun), kedua tangan terbuka menyambut
 *  (04_Asset/karakter/guru_A0_menyambut.webp → public/karakter/guru_A0.webp, 941×1672). Tangan terbuka lebar setinggi dada → pita atas
 *  SELEBAR GAMBAR (pita null) sampai bawah lengan (pitaBawah 705, piksel gambar): kepala, bahu & kedua tangan utuh. "buat setengah
 *  badan saja orangnya" → tepi bawah lingkaran di pinggang (ay 516 + r 284 = 800): kepala sampai pinggang, tanpa celana; puncak kepala
 *  177 di atas pusat (di dalam cincin 186, tidak menutupi jari-jari Emas), tangan ±192 (skala 0,44; dicoba 0,5: kepala menempel Emas).
 *  Dulu investor_A0 (600×700, pita ±70 selebar kepala). */
const KAR: { d: number; kotak: number; cy: number; s: number; ax: number; ay: number; cw: number; ch: number; pita: number | null; pitaBawah: number; src: string } =
  { d: 250, kotak: 300, cy: 175, s: SKALA_GURU, ax: 478, ay: 516, cw: 941, ch: 1672, pita: null, pitaBawah: 705, src: 'karakter/guru_A0.webp' };
const KarakterPusat: React.FC<{ s: number }> = ({ s }) => {
  const r = KAR.d / 2, kx = KAR.kotak / 2;
  const w = KAR.cw * KAR.s, h = KAR.ch * KAR.s, left = kx - KAR.ax * KAR.s, top = KAR.cy - KAR.ay * KAR.s;
  const px = kx - left, py = KAR.cy - top; // pusat lingkaran dalam koordinat gambar
  const gambar = (clip: string) => (
    <Img src={staticFile(KAR.src)} style={{ position: 'absolute', left, top, width: w, height: h, maxWidth: 'none', clipPath: clip }} />);
  return (
    <div style={{ position: 'absolute', left: HUB.x - kx, top: HUB.y - KAR.cy, width: KAR.kotak, height: KAR.kotak, transform: `scale(${s})`, transformOrigin: `${kx}px ${KAR.cy}px` }}>
      <div style={{ position: 'absolute', left: kx - r, top: KAR.cy - r, width: KAR.d, height: KAR.d, borderRadius: 999, background: B.orange, boxShadow: `0 18px 40px -14px ${B.orange}aa` }} />
      {gambar(`circle(${r}px at ${px}px ${py}px)`)}
      {gambar(KAR.pita === null ? `inset(0px 0px ${h - KAR.pitaBawah * KAR.s}px 0px)` : `inset(0px ${w - px - KAR.pita}px ${h - py}px ${px - KAR.pita}px)`)}
    </div>);
};


export const S01_T = T; // dipakai skrip still & QA
