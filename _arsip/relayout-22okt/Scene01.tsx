import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, CEK, io, mixHex, R, rgba } from '../theme';
import { alfaP, ArahKeluar, cin, Icon, naikY, opa, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Kutipan, Label, Lencana, geser } from '../parts/umum';
import { KarakterLingkar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { Pijakan, RumahIso } from '../parts/v04';
import { Kendaraan, S02_PUSAT } from '../parts/jalur';
import { JEMBATAN_W, pusatSungai, Sungai } from '../parts/sungai';
import { GuruMenunjuk, LayarPelajaran } from './LayarPelajaran';
import { KunciIkon } from '../ikon';
import { urut } from '../beats';
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
const ORANG = { awal: { x: 960, y: 592, D: 300 }, ruang: { x: 700 }, akhir: { x: 258, y: 540, D: 200 } };
const PIJAKAN = { x: 258, y: 610, a: 140 }; // pusat permukaan atas; bawah pijakan = 610 + 0,736·140 = 713
const LABEL_PETA = 749; // label investor di bawah pijakan
const P0 = { x: 398, y: 610 }; // tepi kanan lingkaran investor
const P1 = { x: 1478, y: 610 }; // tepi kiri rumah
const SUNGAI = { x0: 770, x1: 1150, top: 110, bottom: 1010 };
const RUMAH = { w: 340 }; // pojok kiri pijakan rumah = P1
const KD = 116; // diameter lingkaran kendaraan
type Jalur = { k: string; y: number; warna: string; ikon: KunciIkon; cermin: boolean; chip: string; masuk: number; chipAt: number; garisAt: number };
const JALUR: Jalur[] = [
  { k: 'pesawat', y: 220, warna: B.orange, ikon: 'pesawat', cermin: false, chip: 'Memilih saham sendiri', masuk: T.pesawat, chipAt: T.sahamSendiri, garisAt: T.banyak + 60 },
  { k: 'speedboat', y: 415, warna: B.blueLite, ikon: 'speedboat', cermin: true, chip: 'Reksa dana saham', masuk: T.speedboat, chipAt: T.rdSaham, garisAt: T.banyak + 40 },
  { k: 'feri', y: 610, warna: B.blue, ikon: 'feri', cermin: true, chip: 'Reksa dana indeks', masuk: T.feri, chipAt: T.indeks, garisAt: T.banyak + 20 },
  { k: 'jalan', y: 805, warna: B.turq, ikon: 'jalanKaki', cermin: false, chip: 'Investasi relatif stabil', masuk: T.jalan, chipAt: T.stabil, garisAt: T.banyak },
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
const BAB = { y: 520, d: 200, x: [592, 972, 1352] }; // +12: label bab 3 muncul terakhir (pusat dihitung atas seluruh durasi baris)

export const Scene01: React.FC<{ f: number }> = ({ f }) => {
  if (f >= S01_AKHIR + 60) return null; // serah-terima: sejak sini lingkaran jalan kaki digambar Scene 02 (S02_PUSAT)
  // SERAH-TERIMA ke Scene 02 ("Kita mulai dari jalan kaki"): lingkaran jalan kaki meluncur & mengecil ke pusat Scene 02, sisanya pudar (60f)
  const serah = cin(f, S01_AKHIR + 30);
  const sisa = 1 - serah;

  /* ── 1–2: guru → investor ── */
  // 1: layar pop di "pelajaran", guru menyusul 20f (stagger), progres video berjalan sampai penuh menjelang "diri", "Kenali Dirimu Dulu"
  //    disorot (sapuan 60f dipusatkan di "mengenali"); keduanya keluar di "sekarang"
  // keluar bertahap 20f (guru dulu): lonjakan ease-in-back ±10 % keduanya tidak bertemu → ujung jari tak pernah menyentuh bingkai;
  // layar habis tepat saat murid mulai muncul (tanpa tumpang di tengah)
  const layarP = popIn(f, T.guru) * popOut(f, T.sekarang);
  const guruP = popIn(f, T.guru + 20) * popOut(f, T.sekarang - 20);
  const progres = 0.38 + 0.62 * R(f, T.guru - 30, T.diri + 20, 0, 1, (t) => t);
  const sorotDiri = cin(f, T.diri);
  const muridP = popIn(f, T.tanya + 40); // mulai f261 = saat layar pembuka habis (f262)
  const gelembung = popIn(f, T.mulai) * popOut(f, T.sungai - 10);
  // 3: investor bergeser & mengecil ke tepi kiri (60f dipusatkan di "sungai")
  const pindah = cin(f, T.sungai + 8);
  // memberi ruang untuk gelembung "Mulai dari mana?" (60f di "mulai"), lalu ke tepi kiri sungai (60f di "sungai")
  const beriRuang = cin(f, T.mulai - 24); // memimpin 24f dari pop gelembung (pola V03: geser bertahap memimpin pemicunya)
  const oy = ORANG.awal.y + (ORANG.akhir.y - ORANG.awal.y) * pindah;
  const ox = ORANG.awal.x + (ORANG.ruang.x - ORANG.awal.x) * beriRuang + (ORANG.akhir.x - ORANG.ruang.x) * pindah;
  const oD = ORANG.awal.D + (ORANG.akhir.D - ORANG.awal.D) * pindah;

  /* ── 16: peta sungai pudar, tiga kendaraan berjajar ── */
  const pudarPeta = 1 - cin(f, T.jadi + 30, 60);
  const jajar = cin(f, T.jadi + 50); // berjajar bersama pudarnya peta (pusat: dulu tiga ikon diam di jalurnya ±1 dtk → simpang −40)

  // label investor: "Investor biasa" → "Kebanyakan orang"
  const labelY = oy + oD / 2 + 36 + (LABEL_PETA - (ORANG.akhir.y + ORANG.akhir.D / 2 + 36)) * pindah;
  const sungaiP = cin(f, T.sungai + 20);
  const rumahP = popIn(f, T.sungai + 40); // rumah di seberang muncul BERSAMA sungai (pusat: dulu peta berat ke kiri ±4 dtk)

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
  const isi = 0.18 + 0.82 * cin(f, T.berkembang + 20, 90);
  const lepasLandas = cin(f, T.terbang + 20);

  const lapisPeta = pudarPeta;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* SUNGAI — tampak atas (parts/sungai.tsx, Simon 20 Okt "sungai tidak terlalu terlihat"); air mengalir masuk di "sungai" */}
      <Sungai id="s01" top={SUNGAI.top} bottom={SUNGAI.bottom} p={sungaiP} alfa={lapisPeta} />

      {/* JEMBATAN di jalur jalan kaki (5) */}
      {lapisPeta > 0.001 ? (() => {
        const g = cin(f, T.jalan - 20);
        return g > 0.001 ? <div style={{ position: 'absolute', left: pusatSungai(805) - JEMBATAN_W / 2, top: 805 - 17, width: JEMBATAN_W, height: 34, borderRadius: 17,
          background: B.white, border: `3px solid ${B.turq}`, boxSizing: 'border-box', transformOrigin: '50% 50%', transform: `scaleX(${g})`, opacity: lapisPeta,
          boxShadow: `0 10px 22px -12px ${rgba(B.turq, 0.9)}` }} /> : null;
      })() : null}

      {/* JALUR — garis putus-putus memekar (4), garis utuh = jalur yang disorot (9, 14), langkah berjalan (13) */}
      {lapisPeta > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity: lapisPeta, overflow: 'visible' }}>
          {JALUR.map((j) => (
            <g key={j.k} opacity={alfaJalur(j.k)}>
              <Penghubung d={jalurD(j.y)} g={cin(f, j.garisAt)} warna={j.warna} tebal={4} titik={false} />
              {sorotAt[j.k] ? <Penghubung d={jalurD(j.y)} g={cin(f, sorotAt[j.k] + 10)} warna={j.warna} tebal={6} dash={false} titik={false} /> : null}
            </g>))}
          {/* 13: langkah berjalan di jalan kaki & feri ("Sementara … dijalani secara konsisten") — tiga titik tiap jalur, berselang 40f, 150f per perjalanan */}
          {['jalan', 'feri'].map((k, ji) => {
            const y = JALUR.find((j) => j.k === k)!.y;
            return [0, 1, 2].map((n) => {
              const a = T.sementara + 30 + ji * 10 + n * 40;
              const t = R(f, a, a + 150, 0, 1, io);
              if (t <= 0 || t >= 1) return null;
              const [x, yy] = titikDi(y, t);
              const al = Math.min(R(t, 0, 0.08, 0, 1), R(t, 0.9, 1, 1, 0));
              return <circle key={`${k}${n}`} cx={x} cy={yy} r={10} fill={JALUR.find((j) => j.k === k)!.warna} stroke={B.white} strokeWidth={3} opacity={al} />;
            });
          })}
        </svg>) : null}

      {/* RUMAH di seberang (4) */}
      {lapisPeta > 0.001 ? <RumahIso x={P1.x} y={P1.y} w={RUMAH.w} p={rumahP} alfa={lapisPeta} /> : null}

      {/* (digambar DI BELAKANG kendaraan & lencana nomor — dulu melintas di atas lencana) */}
      {jajar > 0.001 && sisa > 0.001 ? (<div style={{ position: 'absolute', inset: 0, opacity: sisa }}>
      {/* cincin sorot berpindah ke bab yang sedang disebut (apa itu … · kenapa indeks … · kapan …) — pindai diam 19 Okt: 3,5 dtk tanpa penanda */}
      {(() => {
        const a1 = cin(f, T.sorot1), m2 = cin(f, T.sorot2), m3 = cin(f, T.sorot3);
        if (a1 <= 0.001) return null;
        const cx = BAB.x[0] + (BAB.x[1] - BAB.x[0]) * m2 + (BAB.x[2] - BAB.x[1]) * m3;
        const warna = mixHex(mixHex(B.turq, B.blue, m2), B.orange, m3); // silang-warna halus (ambang 0,5 = loncat 1 frame)
        const r = BAB.d / 2 + 16;
        return <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <circle cx={cx} cy={BAB.y} r={r} fill="none" stroke={warna} strokeWidth={5} pathLength={1000} strokeDasharray={`${1000 * a1} 1000`}
            transform={`rotate(-90 ${cx} ${BAB.y})`} strokeLinecap="round" />
        </svg>;
      })()}
      </div>) : null}
      {/* KENDARAAN + chip instrumen di bawahnya (5–8); nomor (15); centang (13) */}
      {JALUR.map((j) => {
        const p = popIn(f, j.masuk);
        if (p <= 0.001) return null;
        const bi = j.k === 'jalan' ? 0 : j.k === 'feri' ? 1 : j.k === 'pesawat' ? 2 : -1;
        // 16: tiga kendaraan pindah ke baris peta bab (speedboat pudar bersama peta)
        let x = bi >= 0 ? 960 + (BAB.x[bi] - 960) * jajar : 960;
        let y = bi >= 0 ? j.y + (BAB.y - j.y) * jajar - (j.k === 'pesawat' ? 12 * lepasLandas * (1 - jajar) : 0) : j.y;
        let d = bi >= 0 ? KD + (BAB.d - KD) * jajar : KD;
        let alfa = bi >= 0 ? alfaJalur(j.k) : alfaJalur(j.k) * lapisPeta;
        if (bi === 0) { x += (S02_PUSAT.x - x) * serah; y += (S02_PUSAT.y - y) * serah; d += (S02_PUSAT.d - d) * serah; }
        else alfa *= sisa;
        const chipY = j.y + KD / 2 + 34;
        const cek = j.k === 'jalan' || j.k === 'feri' ? popIn(f, T.konsisten + (j.k === 'feri' ? 20 : 0)) * pudarPeta : 0;
        const nomor = bi >= 0 ? popIn(f, T.urutan + bi * 20) * (bi === 0 ? 1 - cin(f, S01_AKHIR + 15, 30) : sisa) : 0;
        return (
          <React.Fragment key={j.k}>
            {/* pesawat lepas landas (14): naik 12 px & miring −8° */}
            <div style={{ position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: j.k === 'pesawat' ? `rotate(${-8 * lepasLandas * (1 - jajar)}deg)` : undefined }}>
              <Kendaraan x={x} y={y} d={d} warna={j.warna} ikon={j.ikon} cermin={j.cermin} p={p} alfa={alfa} cincin />
            </div>
            {j.k === 'speedboat' ? <Lencana x={x} y={y} d={d} p={popIn(f, T.kapten) * lapisPeta} warna={B.blue} ikon="kapten" besar={62} /> : null}
            <Chip x={960} y={chipY} teks={j.chip} warna={j.warna} p={popIn(f, j.chipAt) * lapisPeta * (j.k === 'speedboat' || j.k === 'pesawat' ? 1 - 0.55 * redup * (j.k === 'pesawat' ? 1 - nyalaPesawat : 1) : 1)} size={28} />
            {cek > 0.001 ? <Lencana x={x} y={y} d={d} p={cek} warna={CEK} ikon="tersedia" besar={56} /> : null}
            {nomor > 0.001 ? <Nomor x={x - d * 0.36} y={y - d * 0.36} n={bi + 1} warna={j.warna} p={nomor} d={56 + 10 * jajar} /> : null}
          </React.Fragment>);
      })}

      {/* ALASAN belum terbang (11–12): lisensi pilot & waktu, dicoret; pudar sesudah kemampuan berkembang (14) */}
      {alasanPudar > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: alasanPudar * lapisPeta }}>
          {/* yang belum dimiliki ORANGNYA → di bawah investor (pratinjau 1: dulu kiri-atas, lepas dari konteks) */}
          <Chip x={ORANG.akhir.x} y={LABEL_PETA + 60} teks="Lisensi" ikon="lisensi" warna={B.orange} p={lisensiP} coret={R(f, T.lisensi + 24, T.lisensi + 54, 0, 1, io)} size={28} />
          <Chip x={ORANG.akhir.x} y={LABEL_PETA + 126} teks="Waktu" ikon="kurangWaktu" warna={B.orange} p={waktuP} coret={R(f, T.waktu + 24, T.waktu + 54, 0, 1, io)} size={28} />
        </div>) : null}

      {/* PEMBUKA (1) — susunan screenshot Simon 19 Okt: layar pelajaran sebelumnya + guru menunjuk */}
      <ArahKeluar aktif={f > T.sekarang - 60}>
        <LayarPelajaran s={layarP} progres={progres} sorot={sorotDiri} />
        <GuruMenunjuk s={guruP} />
      </ArahKeluar>

      {/* PIJAKAN V04 di pinggir sungai — naik bersama investor yang pindah ke tepi kiri ("Masih ingat sungai yang kemarin?") */}
      <Pijakan x={PIJAKAN.x} y={PIJAKAN.y} a={PIJAKAN.a} p={pindah} alfa={lapisPeta} />

      {/* INVESTOR (2 →) */}
      <div style={{ position: 'absolute', inset: 0, opacity: lapisPeta }}>
        <KarakterLingkar pose={MURID_BIRU} x={ox} y={oy} D={oD} s={muridP} warna={B.orange} />
        {muridP > 0.001 ? <Lencana x={ox} y={oy} d={oD} p={popIn(f, T.kenapa) * popOut(f, T.karena + 20)} warna={B.blue} teks="?" besar={58} /> : null}
        <Label x={ox} y={labelY} teks="Investor biasa" f={f} at={T.investor} size={30} alfa={1 - cin(f, T.kebanyakan)} />
        <Label x={ox} y={labelY} teks="Kebanyakan orang" f={f} at={T.kebanyakan + 20} size={30} />
        {/* KEMAMPUAN (14): ikon + bar terisi */}
        {kemampuanP > 0.001 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(ox - 150, labelY + 50 + naikY(kemampuanP)), opacity: opa(alfaP(kemampuanP)),
            width: 300, height: 64, borderRadius: 32, background: B.white, border: `2.5px solid ${B.blue}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center',
            gap: 12, padding: '0 18px 0 12px', boxShadow: `0 10px 24px -14px ${rgba(B.blue, 0.8)}` }}>
            <Icon name="kemampuan" size={40} color={B.blue} />
            <div style={{ flex: 1, height: 14, borderRadius: 7, background: rgba(B.blue, 0.14), overflow: 'hidden' }}>
              <div style={{ width: `${isi * 100}%`, height: '100%', borderRadius: 7, background: B.blue }} />
            </div>
          </div>) : null}
      </div>

      {/* GELEMBUNG "Mulai dari mana?" (2) */}
      <Kutipan x={1170} y={330} teks="Mulai dari mana?" p={gelembung} warna={B.blue} ikon="arah" size={36} />

      {/* PETA BAB (16): garis titik antar kendaraan + label tiap bab di frasanya */}
      {jajar > 0.001 && sisa > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: sisa }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${BAB.x[0] + BAB.d / 2 + 18} ${BAB.y} L ${BAB.x[1] - BAB.d / 2 - 18} ${BAB.y}`} g={cin(f, T.tiga)} warna={B.blueLite} tebal={6} titik={false} />
            <Penghubung d={`M ${BAB.x[1] + BAB.d / 2 + 18} ${BAB.y} L ${BAB.x[2] - BAB.d / 2 - 18} ${BAB.y}`} g={cin(f, T.tiga + 20)} warna={B.blueLite} tebal={6} titik={false} />
          </svg>
          <Label x={BAB.x[0]} y={BAB.y + BAB.d / 2 + 40} teks="Investasi relatif stabil" f={f} at={T.bab1} size={32} lebar={370} />
          <Label x={BAB.x[1]} y={BAB.y + BAB.d / 2 + 40} teks="Reksa dana indeks" f={f} at={T.bab2} size={32} lebar={370} />
          <Label x={BAB.x[2]} y={BAB.y + BAB.d / 2 + 40} teks="Memilih saham sendiri" f={f} at={T.bab3} size={32} lebar={370} />
        </div>) : null}
    </AbsoluteFill>);
};
