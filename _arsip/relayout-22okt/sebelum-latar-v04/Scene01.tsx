import React from 'react';
import { AbsoluteFill, Easing, Img, OffthreadVideo, staticFile } from 'remotion';
import { B, CEK, F, io, R, rgba } from '../theme';
import { alfaP, cin, Icon, naikY, opa, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Label, Lencana, geser } from '../parts/umum';
import { KarakterLingkar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { Pijakan, RumahIso } from '../parts/v04';
import { JALUR_IKON, JALUR_WARNA, Kendaraan, S02_PUSAT } from '../parts/jalur';
import { S02_T } from '../s02/Scene02';
import { JEMBATAN_W, pusatSungai, Sungai } from '../parts/sungai';
import { BIDANG_ISI, GuruMenunjuk, LayarPelajaran } from './LayarPelajaran';
import { POSE, TepiSubtitle } from '../parts/nyata';
import { Judul } from '../parts/judul';
import { KunciIkon } from '../ikon';
import { kata, urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 01 — Banyak Pilihan, tapi Kebanyakan Orang Cocok di Dua Jalur (f0 – BATAS.s2). Ide: 04_Asset/Ide-Visual-Scene-01.md.
 * SATU peta sungai bertahan sepanjang scene: investor di tepi kiri, rumah di seberang, empat jalur menyeberang. Ketukan sesudahnya
 * hanya MENGUBAH peta itu (sorot, redup, coret, centang, nomor) lalu tiga kendaraan bernomor berjajar menjadi peta bab.
 * Semua masuk dipusatkan di kata pemicunya (±30f), pop = easeOutBack 60f, gerak/pudar = inOut cubic 60f.
 */
const W = urut(['pelajaran', 'mengenali', 'sekarang', 'pertanyaannya', 'investor', 'mulai', 'masih', 'sungai', 'banyak', 'seberang',
  'jalan', 'investasi', 'feri', 'reksa', 'speedboat', 'kapten', 'reksa', 'menerbangkan', 'memilih', 'kebanyakan', 'dua', 'jalan', 'feri',
  'kenapa', 'karena', 'lisensi', 'cukup', 'waktu', 'sementara', 'mudah', 'konsisten', 'nanti', 'kemampuan', 'berkembang', 'terbang',
  'urutannya', 'jadi', 'bahas', 'tiga', 'apa', 'investasi', 'kenapa', 'indeks', 'kapan', 'memilih']);
const T = {
  guru: W[0], diri: W[1], sekarang: W[2], tanya: W[3], investor: W[4], mulai: W[5], masih: W[6], sungai: W[7], banyak: W[8], seberang: W[9],
  jalan: W[10], stabil: W[11], feri: W[12], indeks: W[13], speedboat: W[14], kapten: W[15], rdSaham: W[16], pesawat: W[17], sahamSendiri: W[18],
  kebanyakan: W[19], dua: W[20], sorotJalan: W[21], sorotFeri: W[22], kenapa: W[23], karena: W[24], lisensi: W[25], cukup: W[26], waktu: W[27],
  sementara: W[28], mudah: W[29], konsisten: W[30], nanti: W[31], kemampuan: W[32], berkembang: W[33], terbang: W[34], urutan: W[35],
  jadi: W[36], bahas: W[37], tiga: W[38], sorot1: W[39], bab1: W[40], sorot2: W[41], bab2: W[42], sorot3: W[43], bab3: W[44],
};
export const S01_T = T;
export const S01_AKHIR = BATAS.s2;

/** investor berkemeja biru, tangan di dagu (pose V03 RS02 MURID_BIRU) — orang yang sama di seluruh seri */
const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };

/* ── tata letak peta sungai (isi x 130–1820 → pusat 975; y 92–885, di atas pita subtitle). 19 Okt pratinjau 1: semua diperbesar;
 *    pratinjau 2: jalur pesawat 150 / speedboat 365 supaya lencana kapten berjarak ≥ 25 px dari chip pesawat ── */
/* pengukuran pusat (mode ukur tiap 30f) 19 Okt: isi dulu ±35–90 px terlalu tinggi & berat sebelah → semua posisi di bawah dihitung dari kotak tinta */
// brief Video 04 (22 Okt): investor berdiri di PIJAKAN isometrik V04 (pinggir sungai) — kanan belah ketupat = P0; rumah = rumah isometrik V04
// REVISI SIMON 22 Okt (S01): baris jalur diberi spasi lebih lega (220 px) dan isi peta dipusatkan pada tengah area DI ATAS subtitle
// (tinta subtitle mulai y 994 → pusat 497): tinta peta 81 (puncak pesawat) … 913 (chip jalan kaki). Jalur feri = garis lurus P0 → P1 (y 579).
const ORANG = { akhir: { x: 258, y: 509, D: 200 } };
/** bagian 2 (revisi 22 Okt): investor BADAN PENUH tanpa masker lingkaran, diperbesar, menghadap kanan; swipe naik bersamaan pembuka keluar */
const SOSOK = { x: 640, kaki: 1270, h: 1000 };
/** awan pikiran (bentuk Video 02/03) berisi empat kendaraan V04 + "Mulai dari mana?" */
const AWAN = { x: 1270, y: 330, w: 620, h: 404 };
const AWAN_BENTUK: [number, number, number, number][] = [ // cx, cy, rx, ry (kotak acuan 400 × 284, salinan Video 03 Scene 01)
  [60, 140, 58, 58], [135, 82, 72, 72], [250, 72, 78, 78], [338, 145, 62, 62], [262, 210, 70, 70], [140, 205, 75, 75], [200, 145, 140, 95]];
/** dua titik pikiran dari kepala ke awan — besar dekat awan, kecil dekat kepala (Video 03) */
const TITIK_PIKIR = [{ x: 925, y: 392, r: 17 }, { x: 878, y: 418, r: 10 }];
/** pembuka: klip Video 04 detik 16–22 ("Riset sebelum beli saham" → "Diri kita sendiri") di dalam dashboard — public/media/v04/v04-diri-kita.mp4 */
const KLIP = { mulai: 16, detikV04: 16, durasiV04: 453.6 };
/** tipografi "Masih ingat / sungai yang kemarin?" (gaya kata disorot), blok berpusat di 497 */
const TIPO = { size: 96, top1: 352, top2: 474 };
const PIJAKAN = { x: 258, y: 579, a: 140 }; // pusat permukaan atas
const LABEL_PETA = 718; // label investor di bawah pijakan
const P0 = { x: 398, y: 579 }; // tepi kanan lingkaran investor
const P1 = { x: 1478, y: 579 }; // tepi kiri rumah
const SUNGAI = { x0: 770, x1: 1150, top: 30, bottom: 1040 };
const JALAN_Y = 799;
const RUMAH = { w: 340 }; // pojok kiri pijakan rumah = P1
const KD = 116; // diameter lingkaran kendaraan
type Jalur = { k: string; y: number; warna: string; ikon: KunciIkon; cermin: boolean; chip: string; masuk: number; chipAt: number; garisAt: number };
const JALUR: Jalur[] = [
  { k: 'pesawat', y: 139, warna: B.orange, ikon: 'pesawat', cermin: false, chip: 'Memilih saham sendiri', masuk: T.pesawat, chipAt: T.sahamSendiri, garisAt: T.banyak + 60 },
  { k: 'speedboat', y: 359, warna: B.blueLite, ikon: 'speedboat', cermin: true, chip: 'Reksa dana saham', masuk: T.speedboat, chipAt: T.rdSaham, garisAt: T.banyak + 40 },
  { k: 'feri', y: 579, warna: B.blue, ikon: 'feri', cermin: true, chip: 'Reksa dana indeks', masuk: T.feri, chipAt: T.indeks, garisAt: T.banyak + 20 },
  { k: 'jalan', y: JALAN_Y, warna: B.turq, ikon: 'jalanKaki', cermin: false, chip: 'Investasi relatif stabil', masuk: T.jalan, chipAt: T.stabil, garisAt: T.banyak },
];
const jalurD = (y: number) => y === P0.y
  ? `M ${P0.x} ${P0.y} L ${P1.x} ${P1.y}`
  : `M ${P0.x} ${P0.y} C ${P0.x + 190} ${P0.y} ${SUNGAI.x0 - 170} ${y} ${SUNGAI.x0} ${y} L ${SUNGAI.x1} ${y} C ${SUNGAI.x1 + 170} ${y} ${P1.x - 190} ${P1.y} ${P1.x} ${P1.y}`;

/** titik pada jalur (t 0…1, kira-kira menurut panjang) — untuk "langkah" yang berjalan dari investor ke rumah */
const bez = (a: number, b: number, c: number, d: number, t: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
const SAMPEL: Record<number, [number, number][]> = {};
const sampel = (y: number) => {
  if (SAMPEL[y]) return SAMPEL[y];
  const pts: [number, number][] = [];
  const N = 80;
  for (let i = 0; i <= N; i++) { const t = i / N; pts.push([bez(P0.x, P0.x + 190, SUNGAI.x0 - 170, SUNGAI.x0, t), bez(P0.y, P0.y, y, y, t)]); }
  for (let i = 1; i <= N; i++) pts.push([SUNGAI.x0 + (SUNGAI.x1 - SUNGAI.x0) * i / N, y]);
  for (let i = 1; i <= N; i++) { const t = i / N; pts.push([bez(SUNGAI.x1, SUNGAI.x1 + 170, P1.x - 190, P1.x, t), bez(y, y, P1.y, P1.y, t)]); }
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  SAMPEL[y] = pts.map((p, i) => [p[0], p[1], L[i] / L[L.length - 1]] as unknown as [number, number]);
  return SAMPEL[y];
};
const titikDi = (y: number, t: number): [number, number] => {
  const s = sampel(y) as unknown as [number, number, number][];
  const j = s.findIndex((p) => p[2] >= t);
  if (j <= 0) return [s[0][0], s[0][1]];
  const a = s[j - 1], b = s[j], u = (t - a[2]) / Math.max(1e-6, b[2] - a[2]);
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
};

/** peta bab (ketukan 16): tiga kendaraan bernomor berjajar */
const BAB = { y: 520, d: 220, x: [592, 972, 1352], labelDy: 168 }; // revisi 22 Okt: ikon +10 %; yang disebut membesar 15 % + glow (tanpa cincin)
const SEBUT = 0.15;

/** investor badan penuh (POSE muridPikirBiru), dicerminkan menghadap kanan; geser vertikal tanpa opacity */
const SosokPenuh: React.FC<{ geserY: number }> = ({ geserY }) => {
  const pose = POSE.muridPikirBiru;
  const k = SOSOK.h / (pose.y1 - pose.y0), W = pose.w * k, H = pose.h * k;
  const cxL = W - ((pose.x0 + pose.x1) / 2) * k, by = pose.y1 * k;
  return <Img src={staticFile(pose.src)} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
    transform: `${geser(SOSOK.x - cxL, SOSOK.kaki - by + geserY)} scaleX(-1)` }} />;
};

/** awan pikiran (bentuk Video 02/03) + isi: empat kendaraan V04 dan "Mulai dari mana?" — pop berporos tengah awan */
const AwanPikiran: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  const bentuk = (props: React.SVGProps<SVGEllipseElement>) => AWAN_BENTUK.map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} vectorEffect="non-scaling-stroke" {...props} />);
  const muncul = kata('sebagai', T.tanya) + 20;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: AWAN.w, height: AWAN.h, transformOrigin: 'center', transform: `${geser(AWAN.x - AWAN.w / 2, AWAN.y - AWAN.h / 2)} scale(${skalaPop(p)})` }}>
      <svg width={AWAN.w} height={AWAN.h} viewBox="0 0 400 284" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform="translate(0 14)">{bentuk({ fill: B.blue, opacity: 0.07 })}</g>
        <g>{bentuk({ fill: B.white, stroke: B.grayLite, strokeWidth: 6 })}</g>
        <g>{bentuk({ fill: B.white })}</g>
      </svg>
      {(['jalan', 'feri', 'speedboat', 'pesawat'] as const).map((k, i) => (
        <Kendaraan key={k} x={AWAN.w / 2 + (i - 1.5) * 118} y={AWAN.h / 2 - 36} d={98} warna={JALUR_WARNA[k]} ikon={JALUR_IKON[k].ikon} cermin={JALUR_IKON[k].cermin}
          p={popIn(f, muncul + 30 + i * 12)} />))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: AWAN.h / 2 + 36, textAlign: 'center', whiteSpace: 'nowrap' }}>
        <WordText halus f={f} at={T.mulai} style={{ fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>Mulai dari mana?</WordText>
      </div>
    </div>);
};

export const Scene01: React.FC<{ f: number }> = ({ f }) => {
  // RELAYOUT 22 Okt: peta bab BERTAHAN di awal Scene 02 ("Kita mulai dari jalan kaki" → cincin sorot kembali ke 01, bab 02/03 surut) — dulu
  // lingkaran jalan kaki langsung ke tengah sendirian ±4 dtk. Serah-terima di "dana": 02/03 pudar, jalan kaki + labelnya meluncur ke kiri
  // (S02_PUSAT = posisi papan A Scene 02) dan sejak itu digambar Scene 02 (rupa sama: cincin putih, label 32 px).
  if (f >= S02_T.dana + 10) return null;
  const serah = cin(f, S02_T.dana - 20);
  const sisa = 1 - serah;
  const surut = 1 - 0.6 * cin(f, S02_T.jalan); // bab 02 & 03 surut saat "Kita mulai dari jalan kaki"

  /* ── 1: dashboard (klip Video 04) pop in/out berporos tengah · guru swipe naik/turun TANPA opacity (revisi Simon 22 Okt) ── */
  const layarMasuk = skalaPop(popIn(f, T.guru)); // 0 → 100 % easeOutBack
  const uKeluar = R(f, T.sekarang - 30, T.sekarang + 30, 0, 1);
  const layarSkala = layarMasuk * (1 - Easing.inOut(Easing.back(1.7))(uKeluar)); // 100 → 0 % easeInOutBack
  const guruY = (1 - io(R(f, T.guru + 20 - 30, T.guru + 20 + 30, 0, 1))) * 980 + io(uKeluar) * 980; // naik dari bawah · turun ke bawah
  const progres = (KLIP.detikV04 + (f + KLIP.mulai) / 60) / KLIP.durasiV04;
  /* ── 2: investor badan penuh swipe naik BERSAMAAN pembuka keluar; awan pikiran di "sebagai investor biasa"; turun di "Masih ingat" ── */
  const sebagai = kata('sebagai', T.tanya);
  const sosokY = (1 - io(uKeluar)) * 1000 + io(R(f, T.masih - 30, T.masih + 30, 0, 1)) * 1000; // transisi seragam 22 Okt: 60f di kata
  const awanP = popIn(f, sebagai + 20) * popOut(f, T.masih);
  /* ── 3: tipografi "Masih ingat sungai yang kemarin?" → peta sungai di "Ada banyak cara…" ── */
  const petaP = cin(f, T.banyak); // investor & pijakan — masuk bersamaan tipografi keluar

  /* ── 16: peta sungai pudar, tiga kendaraan berjajar ── */
  const pudarPeta = 1 - cin(f, T.jadi + 40);
  const jajar = cin(f, T.jadi + 40); // berjajar DALAM 60f yang sama dengan pudarnya peta

  const sungaiP = cin(f, T.banyak); // air mengalir masuk di "Ada banyak cara…"
  const rumahP = popIn(f, T.banyak + 20); // rumah di seberang (stagger 20f)

  // 9: redup speedboat & pesawat; pesawat menyala lagi di "terbang" (14)
  const redup = cin(f, T.dua + 20);
  const nyalaPesawat = cin(f, T.terbang);
  const alfaJalur = (k: string) => k === 'speedboat' ? 1 - 0.7 * redup : k === 'pesawat' ? 1 - 0.7 * redup * (1 - nyalaPesawat) : 1;
  const sorotAt: Record<string, number> = { jalan: T.sorotJalan, feri: T.sorotFeri, pesawat: T.terbang };

  // 11–12 & 14: alasan dicoret, lalu pudar sesudah kemampuan berkembang
  const alasanPudar = 1 - cin(f, T.nanti + 10);
  const lisensiP = popIn(f, T.lisensi);
  const waktuP = popIn(f, T.waktu);

  // 14: kartu kemampuan
  const kemampuanP = popIn(f, T.kemampuan);
  const isi = 0.18 + 0.82 * cin(f, T.berkembang + 20);
  const lepasLandas = cin(f, T.terbang + 20);

  const lapisPeta = pudarPeta;
  // bab yang disebut: membesar 15 % + glow (revisi 22 Okt, pengganti cincin sorot); kembali ke 01 di "Kita mulai dari jalan kaki" (Scene 02)
  const a1 = cin(f, T.sorot1), m2 = cin(f, T.sorot2), m3 = cin(f, T.sorot3), kembali = cin(f, S02_T.jalan);
  const sebut = [a1 * (1 - m2) + kembali * (1 - serah), m2 * (1 - m3), m3 * (1 - kembali)];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* SUNGAI — tampak atas (parts/sungai.tsx, Simon 20 Okt "sungai tidak terlalu terlihat"); air mengalir masuk di "sungai" */}
      <Sungai id="s01" top={SUNGAI.top} bottom={SUNGAI.bottom} p={sungaiP} alfa={lapisPeta} alir={f / 60} />

      {/* JEMBATAN di jalur jalan kaki (5) */}
      {lapisPeta > 0.001 ? (() => {
        const g = cin(f, T.jalan - 20);
        return g > 0.001 ? <div style={{ position: 'absolute', left: pusatSungai(JALAN_Y, 960, SUNGAI.top) - JEMBATAN_W / 2, top: JALAN_Y - 17, width: JEMBATAN_W, height: 34, borderRadius: 17,
          background: B.white, border: `3px solid ${B.turq}`, boxSizing: 'border-box', transformOrigin: '50% 50%', transform: `scaleX(${g})`, opacity: lapisPeta,
          boxShadow: `0 10px 22px -12px ${rgba(B.turq, 0.9)}` }} /> : null;
      })() : null}

      {/* JALUR — garis putus-putus memekar (4), garis utuh = jalur yang disorot (9, 14), langkah berjalan (13) */}
      {lapisPeta > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity: lapisPeta, overflow: 'visible' }}>
          {JALUR.map((j) => (
            <g key={j.k} opacity={alfaJalur(j.k)}>
              <Penghubung d={jalurD(j.y)} g={cin(f, j.garisAt)} warna={j.warna} tebal={4} titik={false} pola="putus" />
              {sorotAt[j.k] ? <Penghubung d={jalurD(j.y)} g={cin(f, sorotAt[j.k] + 10)} warna={j.warna} tebal={6} dash={false} titik={false} /> : null}
            </g>))}
          {/* 13: langkah berjalan di jalan kaki & feri ("Sementara … dijalani secara konsisten") — tiga titik tiap jalur, berselang 40f, 150f per perjalanan */}
          {['jalan', 'feri'].map((k, ji) => {
            const y = JALUR.find((j) => j.k === k)!.y;
            return [0, 1, 2].map((n) => {
              const a = T.sementara + 30 + ji * 10 + n * 40;
              const t = R(f, a, a + 60, 0, 1, io);
              if (t <= 0 || t >= 1) return null;
              const [x, yy] = titikDi(y, t);
              const al = Math.min(R(t, 0, 0.08, 0, 1), R(t, 0.9, 1, 1, 0));
              return <circle key={`${k}${n}`} cx={x} cy={yy} r={10} fill={JALUR.find((j) => j.k === k)!.warna} stroke={B.white} strokeWidth={3} opacity={al} />;
            });
          })}
        </svg>) : null}

      {/* RUMAH di seberang (4) */}
      {lapisPeta > 0.001 ? <RumahIso x={P1.x} y={P1.y} w={RUMAH.w} p={rumahP} alfa={lapisPeta} /> : null}

      {/* KENDARAAN + chip instrumen di bawahnya (5–8); nomor (15); centang (13) */}
      {JALUR.map((j) => {
        const p = popIn(f, j.masuk);
        if (p <= 0.001) return null;
        const bi = j.k === 'jalan' ? 0 : j.k === 'feri' ? 1 : j.k === 'pesawat' ? 2 : -1;
        // 16: tiga kendaraan pindah ke baris peta bab (speedboat pudar bersama peta)
        let x = bi >= 0 ? 960 + (BAB.x[bi] - 960) * jajar : 960;
        let y = bi >= 0 ? j.y + (BAB.y - j.y) * jajar - (j.k === 'pesawat' ? 12 * lepasLandas * (1 - jajar) : 0) : j.y;
        const w = bi >= 0 ? sebut[bi] * jajar : 0;
        let d = bi >= 0 ? (KD + (BAB.d - KD) * jajar) * (1 + SEBUT * w) : KD;
        let alfa = bi >= 0 ? alfaJalur(j.k) : alfaJalur(j.k) * lapisPeta;
        if (bi === 0) { x += (S02_PUSAT.x - x) * serah; y += (S02_PUSAT.y - y) * serah; d += (S02_PUSAT.d - d) * serah; }
        else alfa *= sisa * surut;
        const chipY = j.y + KD / 2 + 34;
        const cek = j.k === 'jalan' || j.k === 'feri' ? popIn(f, T.konsisten + (j.k === 'feri' ? 20 : 0)) * pudarPeta : 0;
        const nomor = bi >= 0 ? popIn(f, T.urutan + bi * 20) * (bi === 0 ? 1 - cin(f, S02_T.dana - 20) : sisa) : 0;
        return (
          <React.Fragment key={j.k}>
            {/* pesawat lepas landas (14): naik 12 px & miring −8° */}
            <div style={{ position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: j.k === 'pesawat' ? `rotate(${-8 * lepasLandas * (1 - jajar)}deg)` : undefined }}>
              {w * alfa > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: d * 1.3, height: d * 1.3, borderRadius: '50%', background: j.warna, filter: 'blur(34px)',
                opacity: 0.6 * w * alfa * (p < 0.9999 ? p : 1), transform: geser(x - d * 0.65, y - d * 0.65) }} /> : null}
              <Kendaraan x={x} y={y} d={d} warna={j.warna} ikon={j.ikon} cermin={j.cermin} p={p} alfa={alfa} cincin />
            </div>
            {j.k === 'speedboat' ? <Lencana x={x} y={y} d={d} p={popIn(f, T.kapten) * lapisPeta} warna={B.blue} ikon="kapten" besar={62} /> : null}
            <Chip x={960} y={chipY} teks={j.chip} warna={j.warna} p={popIn(f, j.chipAt) * lapisPeta * (j.k === 'speedboat' || j.k === 'pesawat' ? 1 - 0.55 * redup * (j.k === 'pesawat' ? 1 - nyalaPesawat : 1) : 1)} size={28} />
            {cek > 0.001 ? <Lencana x={x} y={y} d={d} p={cek} warna={CEK} ikon="tersedia" besar={56} /> : null}
            {nomor > 0.001 ? <div style={{ position: 'absolute', inset: 0, opacity: bi > 0 ? opa(surut) : undefined }}>
              <Nomor x={x - d * 0.36} y={y - d * 0.36} n={bi + 1} warna={j.warna} p={nomor} d={56 + 10 * jajar} /></div> : null}
          </React.Fragment>);
      })}

      {/* ALASAN belum terbang (11–12): lisensi pilot & waktu, dicoret; pudar sesudah kemampuan berkembang (14) */}
      {alasanPudar > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: alasanPudar * lapisPeta }}>
          {/* yang belum dimiliki ORANGNYA → di bawah investor (pratinjau 1: dulu kiri-atas, lepas dari konteks) */}
          <Chip x={ORANG.akhir.x} y={LABEL_PETA + 60} teks="Lisensi" ikon="lisensi" warna={B.orange} p={lisensiP} coret={R(f, T.lisensi + 24, T.lisensi + 84, 0, 1, io)} size={28} />
          <Chip x={ORANG.akhir.x} y={LABEL_PETA + 126} teks="Waktu" ikon="kurangWaktu" warna={B.orange} p={waktuP} coret={R(f, T.waktu + 24, T.waktu + 84, 0, 1, io)} size={28} />
        </div>) : null}

      {/* PEMBUKA (1) — dashboard berisi klip Video 04 (pop berporos tengah) + guru menunjuk (swipe naik, keluar swipe turun) */}
      {layarSkala > 0.001 ? <LayarPelajaran s={1} skala={layarSkala} progres={progres} sorot={0} isi={
        // dipotong setinggi bidang isi (di atas bilah pemutar): 86 % atas bingkai Video 04 — subtitle tertanamnya (±92 %) tidak ikut / tembus bilah
        <div style={{ position: 'absolute', left: 0, top: 0, width: BIDANG_ISI.w, height: BIDANG_ISI.h, overflow: 'hidden' }}>
          <OffthreadVideo src={staticFile('media/v04/v04-diri-kita.mp4')} trimBefore={KLIP.mulai} muted
            style={{ position: 'absolute', left: 0, top: 0, width: BIDANG_ISI.w, height: (BIDANG_ISI.w * 1080) / 1920 }} />
        </div>} /> : null}
      <GuruMenunjuk s={1} geserY={guruY} />

      {/* (2) investor badan penuh + awan pikiran "Mulai dari mana?" */}
      {sosokY < 1000 ? <TepiSubtitle><SosokPenuh geserY={sosokY} /></TepiSubtitle> : null}
      {TITIK_PIKIR.map((t, k) => {
        const s = skalaPop(popIn(f, sebagai + 10 * (1 - k)) * popOut(f, T.masih));
        return s > 0.001 ? <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 2 * t.r, height: 2 * t.r, borderRadius: '50%', background: B.white,
          border: `3px solid ${B.grayLite}`, boxSizing: 'border-box', transform: `${geser(t.x - t.r, t.y - t.r)} scale(${s})` }} /> : null;
      })}
      {awanP > 0.001 ? <AwanPikiran f={f} p={awanP} /> : null}

      {/* (3) "Masih ingat sungai yang kemarin?" — tipografi kata disorot, rata tengah */}
      <Judul f={f} kata={['Masih', 'ingat']} at={T.masih + 4} keluar={T.banyak} top={TIPO.top1} size={TIPO.size} />
      <Judul f={f} kata={['sungai', 'yang', 'kemarin?']} sorotIdx={0} at={T.sungai + 8} sorotAt={T.sungai + 10} keluar={T.banyak} top={TIPO.top2} size={TIPO.size} />

      {/* PIJAKAN V04 di pinggir sungai */}
      <Pijakan x={PIJAKAN.x} y={PIJAKAN.y} a={PIJAKAN.a} p={petaP} alfa={lapisPeta} />

      {/* INVESTOR di peta (menghadap kanan; label "Investor biasa" dihapus — revisi 22 Okt) */}
      <div style={{ position: 'absolute', inset: 0, opacity: opa(lapisPeta) }}>
        <KarakterLingkar pose={MURID_BIRU} x={ORANG.akhir.x} y={ORANG.akhir.y} D={ORANG.akhir.D} s={petaP} warna={B.orange} cermin />
        {petaP > 0.001 ? <Lencana x={ORANG.akhir.x} y={ORANG.akhir.y} d={ORANG.akhir.D} p={popIn(f, T.kenapa) * popOut(f, T.karena + 20)} warna={B.blue} teks="?" besar={58} /> : null}
        <Label x={ORANG.akhir.x} y={LABEL_PETA} teks="Kebanyakan orang" f={f} at={T.kebanyakan + 20} size={30} />
        {/* KEMAMPUAN (14): ikon + bar terisi */}
        {kemampuanP > 0.001 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(ORANG.akhir.x - 150, LABEL_PETA + 50 + naikY(kemampuanP)), opacity: opa(alfaP(kemampuanP)),
            width: 300, height: 64, borderRadius: 32, background: B.white, border: `2.5px solid ${B.blue}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center',
            gap: 12, padding: '0 18px 0 12px', boxShadow: `0 10px 24px -14px ${rgba(B.blue, 0.8)}` }}>
            <Icon name="kemampuan" size={40} color={B.blue} />
            <div style={{ flex: 1, height: 14, borderRadius: 7, background: rgba(B.blue, 0.14), overflow: 'hidden' }}>
              <div style={{ width: `${isi * 100}%`, height: '100%', borderRadius: 7, background: B.blue }} />
            </div>
          </div>) : null}
      </div>

      {/* PETA BAB (16): garis titik antar kendaraan + label tiap bab di frasanya */}
      {jajar > 0.001 && sisa > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: sisa }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <g opacity={surut}>
              <Penghubung d={`M ${BAB.x[0] + BAB.d / 2 + 18} ${BAB.y} L ${BAB.x[1] - BAB.d / 2 - 18} ${BAB.y}`} g={cin(f, T.tiga)} warna={B.blueLite} tebal={6} titik={false} />
              <Penghubung d={`M ${BAB.x[1] + BAB.d / 2 + 18} ${BAB.y} L ${BAB.x[2] - BAB.d / 2 - 18} ${BAB.y}`} g={cin(f, T.tiga + 20)} warna={B.blueLite} tebal={6} titik={false} />
            </g>
          </svg>
          <Label x={BAB.x[1]} y={BAB.y + BAB.labelDy} teks="Reksa dana indeks" f={f} at={T.bab2} size={32} lebar={370} alfa={surut} />
          <Label x={BAB.x[2]} y={BAB.y + BAB.labelDy} teks="Memilih saham sendiri" f={f} at={T.bab3} size={32} lebar={370} alfa={surut} />
        </div>) : null}
      {/* label bab 01 ikut lingkaran jalan kaki ke papan A Scene 02 (tidak pudar) */}
      {jajar > 0.001 ? <Label x={BAB.x[0] + (S02_PUSAT.x - BAB.x[0]) * serah} y={BAB.y + BAB.labelDy + (S02_PUSAT.y + S02_PUSAT.d / 2 + 40 - BAB.y - BAB.labelDy) * serah} teks="Investasi relatif stabil"
        f={f} at={T.bab1} size={32} lebar={370} /> : null}
    </AbsoluteFill>);
};
