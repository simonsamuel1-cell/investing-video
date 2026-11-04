import React from 'react';
import { Img, staticFile } from 'remotion';
import { ARAH, B, CEK, F, SISI, bayanganKecil, io, lerp, mixHex, rgba } from '../theme';
import { Icon, SWIPE, cin, popOut, skalaPop, swipeOff, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label } from '../parts/umum';
import { Kaca, KacaMorf, ORANG_MUDA, Penghubung } from '../parts/kaca';
import { FotoLingkar, POSE_BENDA } from '../parts/lingkar';
import { Besar, PanahArah } from '../parts/v06';
import { PilNominal } from '../parts/nominal';
import { AwanPikir, TitikPikir } from '../parts/awan';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { BERDIRI, JALAN_FRAME, LENGAN_MAIN_HP, PEGANG, alasTerendah, campurPose, gaya, ikLengan, panjangSiklus, titikKepala, type Pose } from '../flat/rigTegak';
import { TokohTegakLapis, Zoom, ambil, simulasi } from '../flat/dunia';
import { ParalaksLampu } from '../flat/transisi';
import { ICBP_JUL25 } from '../data/icbp.gen';

/**
 * SCENE 01 — "Investasi atau Cuma Menebak Harga?" (VI V01, 29 Okt). Pola V06 S01 (adegan analogi = flat + tokoh rig; konsep = gaya rumah).
 *  A f0–1067   warung pagi: rolling door naik di "membuka" → Ibu Sari di balik etalase · "cek stok" (menoleh ke rak, centang) · "catatan" = kartu
 *              catatan kemarin (Terlaris · Penjualan · Biaya · Laba) — warung bergeser memberi ruang saat kartu pop.
 *  B f1090–1482 pembeli datang dari kanan, gelembung "Rp50 juta" · Ibu Sari tidak langsung menjawab (awan pikir "…").
 *  C f1500–1915 harga tawaran memudar abu ("sebelum melihat harga") · awan berisi laba hariannya ("sudah tahu bisnisnya menghasilkan berapa").
 *  D f1937–2270 transisi paralaks lampu jalan (gerak terukur dari contoh Simon 2 Nov) → investor main hp di ruang tamu · hp besar: saham ilustrasi
 *              "ABCD" (2 Nov, Simon: "Contoh saham jangan gunakan ICBP, karena ini hanya saham contoh"; bentuk harga = data ICBP 25→28 Jul 2025, −3,08 %)
 *              · jari gemetar di atas JUAL, wajah cemas ("tangannya langsung gelisah").
 *  E f2290–2614 layar terbelah: Ibu Sari "Tenang" · investor "Panik".
 *  F f2633–3046 di atas mereka: lingkaran Bisnis (warung) · Harga (grafik).
 *  G f3065–3254 belahan keluar, dua lingkaran DIBAWA jadi kepala kartu Investasi · Spekulasi.
 *  H f3278–3668 Investasi: laba tumbuh per tahun → "Nilai bertambah" · kartu disorot di "berinvestasi".
 *  I f3684–4288 Spekulasi: Kamu Rp1.000 → Orang lain Rp1.300 (▲) · disorot di "berspekulasi".
 *  J f4305–4681 kartu keluar · pil kode ilustrasi "ABCD" ("kode") MORF jadi kartu bisnis (Penjualan · Biaya · Laba = baris catatan Ibu Sari).
 */

/* ── WAKTU (onset kata VO, urut — tetap benar bila VO direkam ulang) ── */
const PASANG: [string, string][] = [
  ['membuka', 'membuka'], ['cek', 'cek'], ['stok', 'stok'], ['lihat', 'lihat'], ['catatan', 'catatan'], ['barang', 'barang'], ['laku', 'laku'],
  ['penjualan', 'penjualan'], ['masuk', 'masuk'], ['dikurangi', 'dikurangi'], ['biaya', 'biaya'], ['laba', 'laba'], ['tersisa', 'tersisa'],
  ['tiba', 'tiba-tiba'], ['datang', 'datang'], ['bu', 'bu'], ['beli', 'beli'], ['lima', 'lima'], ['juta', 'juta'], ['ya', 'ya'], ['nggak', 'nggak'], ['menjawab', 'menjawab'],
  ['harga', 'harga'], ['ditawarkan', 'ditawarkan'], ['bisnisnya', 'bisnisnya'], ['menghasilkan', 'menghasilkan'], ['tempat', 'tempat'], ['lain', 'lain'],
  ['investor', 'investor'], ['melihat', 'melihat'], ['turun', 'turun'], ['tiga', 'tiga'], ['tangannya', 'tangannya'], ['gelisah', 'gelisah'],
  ['kenapa', 'kenapa'], ['tenang', 'tenang'], ['panik', 'panik'], ['karena', 'karena'], ['bisnisnya2', 'bisnisnya'], ['harganya', 'harganya'],
  ['perbedaan', 'perbedaan'], ['investasi', 'investasi'], ['spekulasi', 'spekulasi'], ['kalau', 'kalau'], ['menciptakan', 'menciptakan'], ['nilai', 'nilai'],
  ['berinvestasi', 'berinvestasi'], ['tapi', 'tapi'], ['harga2', 'harga'], ['naik', 'naik'], ['orang', 'orang'], ['membayar', 'membayar'], ['mahal', 'mahal'],
  ['berspekulasi', 'berspekulasi'], ['value', 'value'], ['saham', 'saham'], ['kode', 'kode'], ['melihatnya', 'melihatnya'], ['bisnis', 'bisnis'],
];
const T = (() => {
  const v = urut(PASANG.map(([, w]) => w));
  return Object.fromEntries(PASANG.map(([n], i) => [n, v[i]])) as Record<string, number>;
})();
const AKHIR = BATAS.s2;
/** abu untuk teks kecil (audit kontras 29 Okt: B.gray di atas putih 3,25:1) — Dark Gray + Midnight 45 % ≈ 6:1 */
const ABU_TEKS = mixHex(B.gray, B.night, 0.45);

/* ══════════════ A–C · TOKO IBU SARI (flat) ══════════════ */
/** 30 Okt (Simon: "Aku kirimkan toko untuk mengganti background toko" + "Jangan gunakan background kota terlalu sering"): latar = toko kiriman Simon
 *  (stores-closed-coronavirus-pandemic, public/flat/toko/toko-dunia.svg — virus, papan "MINI STORE" & tanda "CLOSE" dibuang, bukit/pohon/jalan diubin 3×
 *  supaya bisa digeser; scripts/bangun-toko.py). Tanpa kota di belakang toko. Ibu Sari berdiri di trotoar di depan pintu tokonya. */
const KT = 2.5; // skala toko: satuan SVG → px (pintu 315 px ≈ tinggi Ibu Sari)
const TOKO_Y0 = 50 - 86 * KT; // tepi atas tenda (y 86) di layar 50
const TOKO_X = 375; // pusat toko (satuan SVG) = x layar 960 + geser kelompok
const tx = (u: number) => 960 + (u - TOKO_X) * KT;
const ty = (v: number) => TOKO_Y0 + v * KT;
const S = 0.53; // skala tokoh rig tegak (±264 px) — 30 Okt malam (Simon: "orang lebih tinggi dari pintu"): tinggi orang ±84 % pintu (315 px); dulu 0,62
const TAN = ty(433); // kaki di tengah trotoar (422–444)
const X_IBU = 760; // di depan daun pintu kiri; tanda pintu di kanannya setinggi kepala
/** GESER KELOMPOK (aturan 16 "tengah dulu, lalu memberi ruang"): toko di tengah → menepi saat kartu catatan pop → sedikit kembali saat kartu keluar &
 *  pembeli datang dari kanan */
const gxWarung = (f: number) => -300 * cin(f, T.lihat) + 300 * cin(f, T.tiba + 24); // kembali ke tengah saat pembeli datang: Ibu Sari (760) & pembeli (1160) berpusat
const KARTU = { x: 1480, y: 540, w: 560, h: 480 };
/** tanda pintu (pengganti "CLOSE" kiriman: x 313–349, y 307–330) */
const TANDA = { x: tx(331), y: ty(318.5), w: 132, h: 60 }; // 30 Okt malam (Simon: "tag tutup dan buka terlalu mepet dengan box-nya"): kotak 90×58 → 132×60
/** kaca etalase (dua jendela kanan pintu) + barang di dua rak tiap jendela (kemasan datar warna brand) */
const JENDELA_KACA = [[401, 448], [471, 518]].map(([a, b]) => ({ x0: tx(a), x1: tx(b), y0: ty(285), y1: ty(371) }));
type Barang = [number, number, number, string, 'kotak' | 'toples' | 'botol'];
const RAK_Y = [ty(318), ty(352)];
const BARANG: Barang[][] = JENDELA_KACA.map((j, k) => {
  const x = j.x0 + 14, c = [[B.blue, B.turq, B.orange], [B.orangeLite, B.blueLite, B.turq]][k];
  return [[x, 30, 46, c[0], 'kotak'], [x + 38, 26, 54, c[1], 'botol'], [x + 72, 30, 40, c[2], 'toples']];
});
const KemasanSvg: React.FC<{ b: Barang; dasar: number }> = ({ b: [x, w, h, c, j], dasar }) => {
  const y = dasar - h;
  if (j === 'botol') return (
    <g>
      <rect x={x + w * 0.32} y={y - 9} width={w * 0.36} height={12} rx={3} fill={mixHex(c, B.night, 0.2)} />
      <rect x={x} y={y} width={w} height={h} rx={w * 0.3} fill={c} />
      <rect x={x + 4} y={y + h * 0.38} width={w - 8} height={h * 0.26} rx={3} fill={B.white} opacity={0.85} />
    </g>);
  if (j === 'toples') return (
    <g>
      <rect x={x + 3} y={y - 7} width={w - 6} height={10} rx={3} fill={mixHex(c, B.night, 0.2)} />
      <rect x={x} y={y} width={w} height={h} rx={8} fill={rgba(B.white, 0.75)} stroke={c} strokeWidth={3} />
      <circle cx={x + w / 2} cy={y + h * 0.55} r={w * 0.26} fill={c} />
    </g>);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={c} />
      <rect x={x} y={y + h * 0.18} width={w} height={h * 0.2} fill={B.white} opacity={0.8} />
    </g>);
};
const IsiEtalase: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    {JENDELA_KACA.map((j, k) => (
      <g key={k}>
        {RAK_Y.map((y, r) => (
          <g key={r}>
            {BARANG[k].map((b, i) => <KemasanSvg key={i} b={r ? [b[0] + (i === 2 ? -4 : 2), b[1], b[2] * 0.86, [b[3], B.orange, B.blueLite][(i + r) % 3], b[4]] : b} dasar={y} />)}
            <rect x={j.x0 + 6} y={y} width={j.x1 - j.x0 - 12} height={7} rx={3} fill={mixHex('#D3D1A7', B.night, 0.25)} />
          </g>))}
        {/* KACA di DEPAN barang (Simon 30 Okt: "layering produk seharusnya di bawah kaca agar terlihat di dalam toko"): tint kaca + dua pantulan diagonal */}
        <rect x={j.x0} y={j.y0} width={j.x1 - j.x0} height={j.y1 - j.y0} fill="#74CCCE" opacity={0.32} />
        <clipPath id={`vi01-kaca-${k}`}><rect x={j.x0} y={j.y0} width={j.x1 - j.x0} height={j.y1 - j.y0} /></clipPath>
        <g clipPath={`url(#vi01-kaca-${k})`} opacity={0.4}>
          <path d={`M ${j.x0 + 20} ${j.y1} L ${j.x0 + 70} ${j.y1} L ${j.x1} ${j.y0 + 70} L ${j.x1} ${j.y0 + 20} Z`} fill={B.white} />
          <path d={`M ${j.x0} ${j.y0 + 70} L ${j.x0} ${j.y0 + 100} L ${j.x0 + 100} ${j.y0} L ${j.x0 + 70} ${j.y0} Z`} fill={B.white} />
        </g>
      </g>))}
  </svg>);
/** TANDA PINTU: TUTUP → dibalik (rotasi Y 60 f inOut cubic, berganti sisi di tengah putaran) → BUKA saat "membuka"; digantung dua tali dari kusen */
const TandaPintu: React.FC<{ f: number }> = ({ f }) => {
  const u = cin(f, T.membuka + 30);
  const buka = u >= 0.5, sx = Math.abs(Math.cos(Math.PI * u));
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={`M ${TANDA.x - TANDA.w * 0.32} ${TANDA.y - TANDA.h / 2} L ${TANDA.x} ${TANDA.y - TANDA.h / 2 - 26} L ${TANDA.x + TANDA.w * 0.32} ${TANDA.y - TANDA.h / 2}`}
          stroke={B.night} strokeWidth={3} fill="none" strokeLinejoin="round" />
        <circle cx={TANDA.x} cy={TANDA.y - TANDA.h / 2 - 26} r={5} fill={B.night} />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0, width: TANDA.w, height: TANDA.h, borderRadius: 10, background: B.white,
        border: `4px solid ${buka ? CEK : ARAH.turun}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', transformOrigin: 'center',
        transform: `translate3d(${TANDA.x - TANDA.w / 2}px, ${TANDA.y - TANDA.h / 2}px, 0) scaleX(${Math.max(0.02, sx)})`, boxShadow: '0 4px 10px -4px rgba(18,16,48,.35)' }}>
        <span style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: buka ? CEK : ARAH.turun, letterSpacing: '.04em' }}>{buka ? 'BUKA' : 'TUTUP'}</span>
      </div>
    </>);
};

/** buku catatan di genggaman (koordinat file tangan, berpusat di titik genggam), ditegakkan balik sudut tangan */
/** 30 Okt malam (Simon: "ketika dia melihat catatan, seharusnya secara harfiah posenya melihat catatan" · "buat dokumen yang dibawa bu Sari itu menghadap
 *  dia, bukan menghadap kamera" · "bentuknya seperti sebelumnya, hanya saja yang terlihat itu cover bukunya, bukan kertas dengan garis-garis"): buku
 *  TERBUKA (dua belah, sedikit menekuk di punggung) yang halamannya menghadap Ibu Sari — dari kamera terlihat SAMPUL luarnya; digenggam di tepi bawah */
const Buku: React.FC<{ sudut: number; p: number }> = ({ sudut, p }) => p <= 0.001 ? null : (
  <g transform={`rotate(${-sudut} ${PEGANG[0]} ${PEGANG[1]}) translate(${PEGANG[0]} ${PEGANG[1]}) scale(${skalaPop(p)})`}>
    {/* tepi halaman yang mengintip di atas sampul */}
    <path d="M -66 -98 L 0 -89 L 66 -98 L 66 -92 L 0 -83 L -66 -92 Z" fill={B.white} />
    {/* dua belah sampul (luar) */}
    <path d="M -72 -94 L -3 -84 L -3 16 L -72 8 Z" fill={B.orange} />
    <path d="M 72 -94 L 3 -84 L 3 16 L 72 8 Z" fill={mixHex(B.orange, B.night, 0.12)} />
    {/* punggung buku */}
    <path d="M -4 -85 L 4 -85 L 4 17 L -4 17 Z" fill={mixHex(B.orange, B.night, 0.35)} />
    {/* label sampul */}
    <path d="M -54 -66 L -18 -61 L -18 -41 L -54 -46 Z" fill={mixHex(B.orange, B.white, 0.55)} />
  </g>);

/** titik LAYAR → koordinat rig (relatif akar) untuk tokoh di x, tanah, skala s */
const keRig = (p: Pose, x: number, tanah: number, s: number, [sx, sy]: [number, number]): [number, number] =>
  [(sx - x) / s, (sy - (tanah - alasTerendah(p) * s)) / s];

/** POSE IBU SARI (rig tegak V06 + kepala wanita berkonde): napas pelan · "membuka" = tangan meraih tanda pintu & membaliknya · "cek stok" = menunjuk
 *  etalase · "lihat catatan" = buku diangkat ke depan dada, kepala menunduk membaca · "nggak langsung menjawab" = kepala sedikit menunduk (berpikir) */
const poseIbu = (f: number) => {
  const napas = Math.sin((2 * Math.PI * f) / 210), geser = Math.sin((2 * Math.PI * f) / 420 + 1.3);
  let p: Pose = { ...BERDIRI, badan: 0.6 * napas + 0.8 * geser, kepala: -0.6 * napas };
  const raih = cin(f, T.membuka - 6) * (1 - cin(f, T.membuka + 84));
  if (raih > 0) p = campurPose(p, ikLengan(p, 0, keRig(p, X_IBU, TAN, S, [TANDA.x - TANDA.w * 0.3, TANDA.y + 6]), -30), raih);
  const tunjuk = cin(f, T.stok) * (1 - cin(f, T.lihat + 10));
  if (tunjuk > 0) p = campurPose(p, ikLengan(p, 0, keRig(p, X_IBU, TAN, S, [JENDELA_KACA[0].x1, RAK_Y[0] - 20]), -10), tunjuk);
  // buku: dipegang di depan dada; saat MEMBACA ("lihat catatan" … sampai pembeli datang) diangkat ke depan wajah & kepala menunduk ke arahnya
  const buku = cin(f, T.lihat + 10);
  const baca = cin(f, T.catatan) * (1 - cin(f, T.tiba + 20));
  const tgtBuku: [number, number] = [lerp(-6, 74, baca), lerp(-78, -104, baca)]; // setinggi dada, di depan badan — wajah tidak tertutup // setinggi dada, di depan badan — wajah tidak tertutup
  if (buku > 0) p = campurPose(p, ikLengan(p, 0, tgtBuku, lerp(20, 0, baca)), buku);
  const pikir = cin(f, T.nggak) * (1 - cin(f, T.menghasilkan + 60));
  const dengar = cin(f, T.bu) * (1 - cin(f, T.nggak));
  return { p: { ...p, kepala: p.kepala + 14 * baca + 5 * pikir - 3 * dengar - 3 * raih }, buku: popIn(f, T.lihat + 10) };
};
const sudutTangan = (p: Pose) => p.badan + p.bahu[0] + p.siku[0] + p.tangan[0];
const IbuSari: React.FC<{ f: number; x: number }> = ({ f, x }) => {
  const { p, buku } = poseIbu(f);
  return <TokohTegakLapis x={x} tanah={TAN} s={S} pose={p} kostum="kini" kepala={{ set: 'wanita', eks: 'netral' }} baju={B.blue} sepatu={B.night} bayangan={false} /* 30 Okt malam: baju & sepatu oranye bertabrakan dengan trotoar oranye */
    pegang={<Buku sudut={sudutTangan(p)} p={buku} />} />;
};

/** PEMBELI (rig tegak, kepala ikal, kemeja ungu muda): berjalan dari kanan layar, berhenti menghadap Ibu Sari (dicerminkan). Saat BICARA ("Bu, warung
 *  ini saya beli lima puluh juta ya") tangan dekat terangkat ke depan dada & ikut tekanan kalimat, kepala mengangguk kecil — tidak berdiri kaku. */
const S_PB = S;
const LAJU_JALAN = (panjangSiklus(0) * S_PB) / JALAN_FRAME;
const X_PB_HENTI = 1160; // 30 Okt malam (Simon: "lebih dekat ke pemilik toko agar terlihat sedang berbicara"): 400 px dari Ibu Sari (dulu ±660)
const T_PB_HENTI = T.datang + 50;
/** 30 Okt malam (Simon: "orang itu berjalan dari luar frame, bukan tiba-tiba muncul"): mulai melangkah cukup awal supaya titik awalnya ±260 px di luar tepi
 *  kanan; masuk frame bersamaan kartu catatan keluar ("Tiba-tiba ada orang datang") */
const T_PB_MULAI = T_PB_HENTI - Math.ceil((1920 + 260 - X_PB_HENTI) / LAJU_JALAN) - 18;
const aPembeli = (f: number) => (f < T_PB_MULAI ? 0 : 1 - cin(f, T_PB_HENTI, 36));
/** simulasi di ruang CERMIN (x' = 1920 − x): berjalan ke kanan = tampak berjalan ke kiri; titik awal dihitung supaya berhenti tepat di X_PB_HENTI */
const PB = (() => {
  const coba = simulasi(2400, (f) => aPembeli(f) * LAJU_JALAN, () => 0, S_PB, 0, 0, panjangSiklus);
  return simulasi(2400, (f) => aPembeli(f) * LAJU_JALAN, () => 0, S_PB, 1920 - X_PB_HENTI - ambil(coba, T_PB_HENTI + 60).x, 0, panjangSiklus);
})();
const bicara = (f: number) => cin(f, T.bu - 10) * (1 - cin(f, T.ya + 40));
const posePembeli = (f: number): Pose => {
  const j = ambil(PB, f), p0 = gaya(j.psi, 0, j.a), w = bicara(f);
  let p: Pose = { ...p0, badan: p0.badan + 0.5 * Math.sin((2 * Math.PI * f) / 230) * (1 - j.a) };
  if (w > 0) {
    const ketuk = Math.sin((2 * Math.PI * (f - T.bu)) / 28); // tekanan kalimat ±14 f
    p = campurPose(p, ikLengan(p, 0, [92, -112 - 10 * ketuk], -25 + 8 * ketuk), w);
    p = { ...p, kepala: p.kepala + w * (2.5 * Math.sin((2 * Math.PI * (f - T.bu)) / 34) - 2) };
  }
  return p;
};
const Pembeli: React.FC<{ f: number }> = ({ f }) => {
  if (f < T_PB_MULAI) return null;
  const j = ambil(PB, f);
  return (
    <div style={{ position: 'absolute', inset: 0, transform: 'scaleX(-1)' }}>
      <TokohTegakLapis x={j.x} tanah={TAN} s={S_PB} pose={posePembeli(f)} kostum="kini" kepala={{ set: 'ikal', eks: 'netral' }} baju={B.blueLite} />
    </div>);
};
/** pusat kepala pembeli di layar (gelembung ucapan) */
const kepalaPembeli = (f: number): [number, number] => {
  const j = ambil(PB, f), p = gaya(j.psi, 0, j.a), kp = titikKepala(p);
  return [1920 - (j.x + kp[0] * S_PB), TAN - alasTerendah(p) * S_PB + kp[1] * S_PB];
};

/** baris kartu catatan: ikon lingkaran + label + nilai (pil) */
const Baris: React.FC<{ f: number; y: number; w: number; ikon: Parameters<typeof Bulat>[0]['ikon']; warna: string; label: string; at: number;
  nilai?: { teks: string; arah: number; p: number; besar?: number } }> = ({ f, y, w, ikon, warna, label, at, nilai }) => (
  <>
    <Bulat x={52} y={y} d={60} warna={warna} ikon={ikon} p={popIn(f, at)} />
    <div style={{ position: 'absolute', left: 96, top: y - 21 }}>
      <WordText f={f} at={at + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 700, color: B.night }}>{label}</WordText>
    </div>
    {nilai ? <Besar x={w - 30} y={y} s={nilai.besar ?? 0}><PilNominal x={w - 30} y={y} teks={nilai.teks} arah={nilai.arah} p={nilai.p} size={26} jangkar="kanan" /></Besar> : null}
  </>);

const ribu = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** KARTU CATATAN KEMARIN (gaya rumah): pop di "catatan", baris muncul di katanya, keluar pop saat pembeli datang */
const KartuCatatan: React.FC<{ f: number }> = ({ f }) => {
  const K = KARTU;
  const jual = cin(f, T.masuk), biaya = cin(f, T.biaya), laba = cin(f, T.laba + 20);
  const garis = cin(f, T.dikurangi + 40);
  return (
    <Kaca x={K.x} y={K.y} w={K.w} h={K.h} p={popIn(f, T.catatan + 10)} keluar={popOut(f, T.tiba)} warna={B.orange} tab="atas" padat>
      <Bulat x={60} y={70} d={72} warna={B.orange} ikon="laporanKeuangan" p={1} />
      <div style={{ position: 'absolute', left: 112, top: 48 }}>
        <WordText f={f} at={T.catatan + 10} style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>Catatan kemarin</WordText>
      </div>
      <Baris f={f} y={160} w={K.w} ikon="rating" warna={B.blue} label="Terlaris" at={T.barang}
        nilai={{ teks: 'Mi instan', arah: 0, p: popIn(f, T.laku) }} />
      <Baris f={f} y={245} w={K.w} ikon="dompet" warna={B.turq} label="Penjualan" at={T.penjualan}
        nilai={{ teks: `Rp${ribu(1200000 * jual)}`, arah: 0, p: popIn(f, T.masuk - 20) }} />
      <Baris f={f} y={330} w={K.w} ikon="tagihan" warna={B.blueLite} label="Biaya" at={T.dikurangi}
        nilai={{ teks: `−Rp${ribu(900000 * biaya)}`, arah: 0, p: popIn(f, T.biaya - 20) }} />
      <svg width={K.w} height={K.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d={`M 32 380 L ${K.w - 32} 380`} g={garis} warna={B.grayLite} dash={false} titik={false} tebal={3} />
      </svg>
      <Baris f={f} y={428} w={K.w} ikon="tumpukanKoin" warna={CEK} label="Laba" at={T.laba - 20}
        nilai={{ teks: `Rp${ribu(300000 * laba)}`, arah: laba, p: popIn(f, T.laba + 10), besar: cin(f, T.tersisa) }} />
    </Kaca>);
};

/** TIGA TITIK MENGETIK/BERPIKIR (Simon 30 Okt: "Animasikan 3 titik dalam thinking bubble"): tiap titik naik-turun 18 px (inOut cubic, 30 f naik + 30 f
 *  turun) berurutan 12 f — gelombang yang berulang selama gelembung menunggu; muncul pop berurutan, keluar pop. */
const TigaTitik: React.FC<{ f: number; x: number; y: number; warna: string; d: number; jarak: number; masuk: number; keluar: number }> =
  ({ f, x, y, warna, d, jarak, masuk, keluar }) => (
    <>
      {[0, 1, 2].map((i) => {
        const q = popIn(f, masuk + 12 * i) * popOut(f, keluar + 8 * i);
        if (q <= 0.001) return null;
        const siklus = (((f - masuk - 12 * i) % 72) + 72) % 72; // 0–29 naik · 30–59 turun · 60–71 diam
        const loncat = siklus < 30 ? io(siklus / 30) : siklus < 60 ? 1 - io((siklus - 30) / 30) : 0;
        return <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: warna, transformOrigin: 'center',
          transform: `translate3d(${x + (i - 1) * jarak - d / 2}px, ${y - d / 2 - 18 * loncat}px, 0) scale(${skalaPop(q)})` }} />;
      })}
    </>);

/** GELEMBUNG UCAPAN pembeli (Simon 30 Okt: "Gerakan chatnya kurang natural"): pop dari ujung ekornya tepat saat pembeli MULAI bicara ("Bu,"), berisi
 *  tiga titik mengetik yang memantul selama kalimatnya berjalan; di "lima" isinya BERGULIR naik di dalam badan gelembung (satu gerak 60 f inOut cubic,
 *  dimasker badan putih): titik keluar ke atas, "Rp50 juta" naik masuk — tidak bertumpuk. Memudar ke abu (tint 60 f) di "harga yang ditawarkan". */
const Gelembung: React.FC<{ f: number }> = ({ f }) => {
  const p = popIn(f, T.bu) * popOut(f, T.lain + 400);
  if (p <= 0.001) return null;
  const [hx, hy] = kepalaPembeli(T_PB_HENTI + 60);
  // 30 Okt malam (Simon: "kecilkan" → "perkecil sedikit lagi dan buat lebih dekat ke orangnya, bubble text berada di pojok kiri orangnya"): dulu 330 × 116
  // di atas kepala; kini 200 × 72 di POJOK KIRI-ATAS pembeli, ekor dari pojok kanan-bawah gelembung menunjuk kepala
  const w = 200, h = 72, r = 20;
  const tip: [number, number] = [hx - 20, hy - 24];
  const x = tip[0] - (w - 30) + w / 2, y = tip[1] - (h + 16) + h / 2;
  const abu = cin(f, T.harga + 20);
  const warna = mixHex(B.blue, B.gray, abu);
  const gulir = cin(f, T.lima);
  // 30 Okt malam (Simon: "potongan bubble text tidak bersih, cek di area segitiga"): badan + ekor = SATU jalur bergaris (dulu kotak bergaris + segitiga
  // bergaris + penutup putih → sambungan ekor kotor)
  const e0 = w - 66, e1 = w - 38, ujung: [number, number] = [w - 30, h + 16];
  const jalur = `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${e1} L ${ujung[0]} ${ujung[1]} L ${e0} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  const di = SISI; // isi dimasker di dalam garis
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h + 30, transformOrigin: `${ujung[0]}px ${ujung[1]}px`,
      transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) scale(${skalaPop(p)})` }}>
      <svg width={w} height={h + 30} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: `drop-shadow(0 4px 6px ${rgba(warna, 0.28)})` }}>
        <path d={jalur} fill={B.white} stroke={warna} strokeWidth={SISI} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: di, top: di, width: w - 2 * di, height: h - 2 * di, borderRadius: r - di, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: w - 2 * di, height: 2 * (h - 2 * di),
          transform: `translate3d(0, ${-(h - 2 * di) * gulir}px, 0) rotate(0.001deg)` /* sub-piksel tetap (judder f1440 di ujung gulir) */ }}>
          {gulir < 1 ? <TigaTitik f={f} x={(w - 2 * di) / 2} y={(h - 2 * di) / 2 + 4} warna={B.blue} d={13} jarak={26} masuk={T.bu - 30} keluar={1e9} /> : null}
          <div style={{ position: 'absolute', left: 0, top: h - 2 * di, width: w - 2 * di, height: h - 2 * di, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <Icon name="valuasi" size={31} color={warna} />
            <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: mixHex(B.night, B.gray, abu), letterSpacing: '-.01em' }}>Rp50 juta</span>
          </div>
        </div>
      </div>
    </div>);
};

/** AWAN PIKIR Ibu Sari: tiga titik berpikir yang beranimasi (tidak langsung menjawab) → laba hariannya (sudah tahu bisnisnya menghasilkan berapa).
 *  Di kiri-atas kepalanya (gelembung pembeli di kanan — tidak bertemu). */
const AWAN = { w: 190, h: 134 }; // 30 Okt malam: diperkecil (Simon: "kecilkan") & didekatkan ke kepala — muat di bingkai zoom adegan jual-beli
const PikirIbu: React.FC<{ f: number; gx: number }> = ({ f, gx }) => {
  const masuk = T.nggak, keluar = T.lain + 400;
  const p = popIn(f, masuk + 10) * popOut(f, keluar);
  const laba = popIn(f, T.bisnisnya + 30);
  const kx = X_IBU + gx - 8, ky = TAN - 300 * S / 0.62 + 6; // puncak kepala
  const ax = kx - 76, ay = ky - 84; // di atas-kiri kepala, di dalam bingkai zoom jual-beli (x 411–1509)
  return (
    <>
      <TitikPikir f={f} titik={[[kx - 12, ky - 8, 7], [kx - 30, ky - 22, 10]]} masuk={masuk - 20} keluar={keluar} />
      <AwanPikir x={ax} y={ay} w={AWAN.w} h={AWAN.h} p={p}>
        <div style={{ position: 'relative', width: AWAN.w, height: AWAN.h }}>
          <TigaTitik f={f} x={AWAN.w / 2} y={AWAN.h / 2 + 4} warna={B.orange} d={17} jarak={36} masuk={masuk + 30} keluar={T.bisnisnya - 20} />
          <PilNominal x={AWAN.w / 2} y={AWAN.h / 2 - 11} teks="Laba Rp300.000" arah={1} p={laba} size={14} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: AWAN.h / 2 + 11, textAlign: 'center' }}>
            <WordText f={f} at={T.menghasilkan} style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: B.night }}>tiap hari</WordText>
          </div>
        </div>
      </AwanPikir>
    </>);
};

/** CENTANG di barang etalase saat "cek stok" (pop berurutan 20 f) */
const CentangRak: React.FC<{ f: number }> = ({ f }) => (
  <>
    {[[BARANG[0][0], 0], [BARANG[0][2], 1], [BARANG[1][1], 0]].map(([b, r], i) => {
      const bb = b as Barang, x = bb[0] + bb[1] / 2, y = RAK_Y[r as number] - bb[2] - 24;
      const p = popIn(f, T.stok + 20 * i) * popOut(f, T.catatan + 20);
      return p <= 0.001 ? null : (
        <div key={i} style={{ position: 'absolute', left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${CEK}`,
          boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(p)})`, boxShadow: bayanganKecil(CEK) }}>
          <Icon name="tersedia" size={22} color={CEK} /></div>);
    })}
  </>);

/** LATAR TOKO: langit (gradasi kiriman) diam · toko + bukit + pohon + jalan bergeser bersama kelompok */
const LatarToko: React.FC<{ gx: number }> = ({ gx }) => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: `linear-gradient(to bottom, #B2DAD2 ${TOKO_Y0}px, #D6E7C2 ${ty(390)}px)` }} />
    <Img src={staticFile('flat/toko/toko-dunia.svg')} style={{ position: 'absolute', left: 0, top: 0, width: 2250 * KT, height: 500 * KT, maxWidth: 'none',
      transform: `translate3d(${tx(-750) + gx}px, ${TOKO_Y0}px, 0)` }} />
  </>);
/** ADEGAN TOKO lengkap; `gx` = geser kelompok (toko, Ibu Sari, centang, awan) */
/** ZOOM ADEGAN JUAL-BELI (30 Okt malam, Simon: "zoom adegan jual beli di scene 1 seperti screenshoot ini" — pintu, etalase & kedua tokoh memenuhi
 *  bingkai): kamera masuk 1 → 1,75× BERSAMAAN toko kembali ke tengah saat pembeli datang (satu gerak 60 f), berporos (960, 700) → tengah layar; tetap
 *  diperbesar sampai transisi paralaks. CSS zoom (raster ulang, tajam). Kartu catatan (sudah keluar) di luar zoom. */
const Z_JUAL = { z: 1.75, fx: 960, fy: 700 };
const uZoomJual = (f: number) => cin(f, T.tiba + 24);
const AdeganWarung: React.FC<{ f: number; gx: number; lengkap?: boolean }> = ({ f, gx, lengkap = true }) => {
  const uz = lengkap ? uZoomJual(f) : 0;
  // layar terbelah (lengkap = false): zoom yang sama, Ibu Sari (480, 700) di tengah belahan kiri (480, 540) — seimbang dengan investor di belahan kanan
  const isi = (anak: React.ReactNode) => lengkap ? <Zoom u={uz} z={lerp(1, Z_JUAL.z, uz)} fx={Z_JUAL.fx} fy={Z_JUAL.fy}>{anak}</Zoom> : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${480 - 480 * Z_JUAL.z}px, ${540 - Z_JUAL.fy * Z_JUAL.z}px)` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zoom: Z_JUAL.z } as React.CSSProperties}>{anak}</div>
    </div>);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {isi(<>
        <LatarToko gx={gx} />
        <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${gx}px, 0, 0)` }}>
          <IsiEtalase />
          <TandaPintu f={f} />
          <IbuSari f={f} x={X_IBU} />
          {lengkap ? <CentangRak f={f} /> : null}
        </div>
        {lengkap ? <><Pembeli f={f} /><Gelembung f={f} /><PikirIbu f={f} gx={gx} /></> : null}
      </>)}
      {lengkap ? <KartuCatatan f={f} /> : null}
    </div>);
};

/* ══════════════ D · INVESTOR (kota, rig pria-biru V06) ══════════════ */
/* RUANG TAMU (30 Okt malam, Simon: "kalau kesulitan buat jadi adegan sofa di video sebelumnya" — dulu investor berdiri di trotoar kota, lebih tinggi
 *  dari pintu): adegan sofa Investing 101 V06 S04 flat dipakai ulang APA ADANYA — berkas Simon `Ruang tamu.svg` (empat lapis public/flat/ruang/: belakang =
 *  dinding & jendela, lampu = lampu gantung, perabot = sofa merah dkk., depan = meja kopi), pose duduk TERUKUR (paha −87,7°, badan condong 4°, lengan = pose main hp terukur), skala dari bokong di
 *  dudukan (y 618) ke telapak di lantai (y 790), ruang turun 53 px (meja menyentuh pita subtitle). Kepala pria-biru: "mainHp" → "sedih" (wajah cemas) di "gelisah". */
const GESER_RUANG = 53;
const X_TOKOH = 700;
const KURSI_Y = 618 + GESER_RUANG, LANTAI_DUDUK = 790 + GESER_RUANG;
const cemasDi = (f: number) => cin(f, T.gelisah - 10);
const POSE_DUDUK = (f: number): Pose => {
  const napas = Math.sin((2 * Math.PI * f) / 220), cemas = cemasDi(f);
  const base: Pose = { ...BERDIRI, bahu: [LENGAN_MAIN_HP.atas[0], LENGAN_MAIN_HP.atas[1]],
    siku: [LENGAN_MAIN_HP.bawah[0] - LENGAN_MAIN_HP.atas[0], LENGAN_MAIN_HP.bawah[1] - LENGAN_MAIN_HP.atas[1]], tangan: [-10, 0] };
  // napas lebih cepat & kepala sedikit menunduk ke hp saat gelisah
  const badan = 4 + 0.6 * napas + cemas * 0.7 * Math.sin((2 * Math.PI * f) / 46);
  return { ...base, badan, kepala: -0.6 * napas + 3 * cemas, paha: [-87.7 - badan, -87.7 - badan], lutut: [85.1, 94.5], telapak: [2.6, -6.8] };
};
const S_DUDUK = (() => { const p = POSE_DUDUK(0); return (LANTAI_DUDUK - KURSI_Y) / (alasTerendah(p) + (p.angkat ?? 0) - 26); })();
/** lapis berkas ruang (scripts/ekstrak-ruang-tamu.py): belakang (dinding, jendela) · lampu (lampu gantung) · perabot (sofa, bingkai, tanaman …) · depan (meja) */
const LapisRuang: React.FC<{ nama: 'belakang' | 'lampu' | 'perabot' | 'depan'; dx?: number }> = ({ nama, dx = 0 }) => (
  <Img src={staticFile(`flat/ruang/ruang-${nama}.svg`)} style={{ position: 'absolute', left: 0, top: GESER_RUANG - 100, width: 1920, height: 1180, maxWidth: 'none',
    transform: dx ? `translate3d(${dx}px, 0, 0)` : undefined }} />);
/** LAYAR TERBELAH (31 Okt, Simon: "perkecil adegan ruang tamu saat split screen" + "agar warna lampu dan watermark tidak bertabrakan juga"): ruang
 *  diperkecil 1 → 0,8× BERSAMA geser ke belahan kanan (satu gerak 60 f = gD), investor (700) tetap di tengah belahan (1440). Tepi atas berkas (tempat tali
 *  lampu gantung berawal) turun ke y 215 → PLAFON terlihat di atasnya dan lampu bergantung dari plafon DI BAWAH logo & chip "Panik" (dulu kap ungu
 *  tepat di belakang logo; tali di x ruang 960 selalu jatuh di bawah logo selama investor di tengah belahan, jadi memperkecil saja tidak cukup; di y 150
 *  tali kiri masih lewat di belakang chip "Panik" (145–207)). Investor turun → kepala & kaki sejajar Ibu Sari di belahan kiri (±440–915). CSS zoom. */
const K_BELAH = 0.8, PLAFON_Y = 215, ATAS_RUANG = GESER_RUANG - 100;
/** lampu gantung kiri (x ruang 758) selalu tepat di atas kepala investor = kolom chip "Panik"/"Harga" (x 1368–1512 di layar, chip "Harga" y 260–310 DI
 *  BAWAH plafon) → di layar terbelah ketiga lampu bergeser +62 satuan (= +50 px) bersama gerak perkecil (gD), tali kiri ke x 1536, di luar kolom chip */
const GESER_LAMPU = 62;
const PLAFON = { isi: '#E6D6C6', list: '#F8F1EA', bayang: '#D6C1AC' }; // dinding #F0E5DA sedikit digelapkan · list terang · garis bayang tipis
/** `gD` 0…1 = layar terbelah: ruang bergeser +740 px supaya investor (700) berada di tengah belahan kanan (1440), sambil diperkecil */
const AdeganKota: React.FC<{ f: number; gD: number }> = ({ f, gD }) => {
  const isi = (
    <>
      {gD > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: ATAS_RUANG - 600, width: 1920, height: 600, background: PLAFON.isi }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, height: 14, background: PLAFON.list }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: PLAFON.bayang }} />
        </div>) : null}
      <LapisRuang nama="belakang" />
      <LapisRuang nama="lampu" dx={GESER_LAMPU * gD} />
      <LapisRuang nama="perabot" />
      <TokohTegakLapis x={X_TOKOH} tanah={LANTAI_DUDUK} s={S_DUDUK} pose={POSE_DUDUK(f)} kostum="kini" ponsel ketuk bayangan={false}
        kepala="mainHp" kepala2={{ nama: 'sedih', t: cemasDi(f) }} /* varian 'cemas' (baris 2 lembar kepala) tidak terpetakan rig tegak → kepala hilang */ />
      <LapisRuang nama="depan" />
    </>);
  if (gD <= 0) return <div style={{ position: 'absolute', inset: 0 }}>{isi}</div>;
  const k = lerp(1, K_BELAH, gD);
  const tx = X_TOKOH + 740 * gD - X_TOKOH * k, ty = lerp(ATAS_RUANG, PLAFON_Y, gD) - ATAS_RUANG * k;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${tx}px, ${ty}px, 0) rotate(0.001deg)` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zoom: k } as React.CSSProperties}>{isi}</div>
    </div>);
};

/* ── HP BESAR (resep V06: 380 × 780, masuk dari bawah sambil berputar −45° → 0°, keluar ke bawah 0° → −45°) ── */
const PONSEL = { x: 1250, y: 440, w: 380, h: 780, k: 0.94 };
const TANGAN = { ujung: [115, 18] as [number, number], s: 0.85 };
const HARGA = ICBP_JUL25.map((r) => r[1]);
const N_H = HARGA.length;
const PLOT = { x0: 34, x1: PONSEL.w - 34, y0: 200, y1: 420 };
const HMIN = Math.min(...HARGA) - 120, HMAX = Math.max(...HARGA) + 120;
const pxH = (k: number) => PLOT.x0 + ((PLOT.x1 - PLOT.x0) * k) / (N_H - 1);
const pyH = (v: number) => PLOT.y1 - ((PLOT.y1 - PLOT.y0) * (v - HMIN)) / (HMAX - HMIN);
const PonselBesar: React.FC<{ f: number; y: number; rot: number }> = ({ f, y, rot }) => {
  const u = cin(f, T.turun); // hari terakhir turun 60 f di "turun"
  const harga = Math.round(lerp(HARGA[N_H - 2], HARGA[N_H - 1], u) / 25) * 25;
  const turunP = popIn(f, T.tiga);
  const SW = PONSEL.w - 24, SH = PONSEL.h - 24;
  const sebelum = HARGA.slice(0, N_H - 1).map((v, k) => `${pxH(k).toFixed(1)} ${pyH(v).toFixed(1)}`).join(' L ');
  const xa = pxH(N_H - 2), ya = pyH(HARGA[N_H - 2]), xb = lerp(xa, pxH(N_H - 1), u), yb = lerp(ya, pyH(HARGA[N_H - 1]), u);
  // jari GELISAH: naik dari bawah di "tangannya", melayang gemetar di atas JUAL (tidak menekan)
  const jari = cin(f, T.tangannya), gemetar = cin(f, T.gelisah - 20);
  const gx = gemetar * (5 * Math.sin(f * 1.9) + 3 * Math.sin(f * 3.3)), gy = gemetar * 4 * Math.sin(f * 2.6 + 1);
  const jariY = lerp(760, 26, jari);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: PONSEL.w, height: PONSEL.h, transformOrigin: 'center',
      transform: `translate3d(${PONSEL.x - PONSEL.w / 2}px, ${y - PONSEL.h / 2}px, 0) rotate(${rot}deg) scale(${PONSEL.k})`, borderRadius: 58, background: B.night,
      boxShadow: `0 18px 40px -16px rgba(18,16,48,.45), inset 0 0 0 2px ${mixHex(B.night, B.gray, 0.45)}` }}>
      {[['kiri', 140, 30], ['kiri', 196, 58], ['kiri', 266, 58], ['kanan', 220, 92]].map(([s, t, h], i) => (
        <div key={i} style={{ position: 'absolute', left: s === 'kiri' ? -4 : PONSEL.w - 1, top: t as number, width: 5, height: h as number, borderRadius: 3, background: B.night }} />))}
      <div style={{ position: 'absolute', inset: 12, borderRadius: 46, background: B.white, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 30, top: 15, fontFamily: F, fontSize: 18, fontWeight: 700, color: B.night }}>09:41</div>
        <div style={{ position: 'absolute', left: SW / 2 - 46, top: 11, width: 92, height: 27, borderRadius: 14, background: B.night }} />
        <svg width={64} height={16} style={{ position: 'absolute', left: SW - 92, top: 18 }}>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 6} y={11 - i * 3} width={4} height={4 + i * 3} rx={1} fill={B.night} />)}
          <rect x={31} y={1.5} width={25} height={12} rx={3.5} fill="none" stroke={B.night} strokeWidth={1.4} opacity={0.5} />
          <rect x={33.5} y={4} width={17} height={7} rx={1.8} fill={B.night} />
        </svg>
        {/* kode + harga berjalan + perubahan */}
        {/* 2 Nov (Simon: "Ganti kode sahamnya, karena hanya saham illustrasi"): kode ilustrasi, bukan emiten nyata (dulu ICBP) */}
        <div style={{ position: 'absolute', left: 22, top: 58, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>ABCD</div>
        <div style={{ position: 'absolute', left: 22, top: 98, fontFamily: F, fontSize: 44, fontWeight: 800, color: B.night, letterSpacing: '-.01em',
          fontVariantNumeric: 'tabular-nums' }}>Rp{ribu(harga)}</div>
        <PilNominal x={SW - 22} y={80} teks="3,08%" arah={-1} p={turunP} size={22} jangkar="kanan" />
        <svg width={PONSEL.w} height={PONSEL.h} style={{ position: 'absolute', left: -12, top: -12, overflow: 'visible' }}>
          <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.y1 + 30} y2={PLOT.y1 + 30} stroke={B.grayLite} strokeWidth={2} />
          <path d={`M ${sebelum}`} stroke={B.blue} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {u > 0 ? <path d={`M ${xa} ${ya} L ${xb} ${yb}`} stroke={ARAH.turun} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
          <circle cx={xb} cy={yb} r={8} fill={B.white} stroke={u > 0 ? ARAH.turun : B.blue} strokeWidth={4} />
        </svg>
        <div style={{ position: 'absolute', left: PLOT.x0 - 12, top: PLOT.y1 + 26, fontFamily: F, fontSize: 18, fontWeight: 700, color: ABU_TEKS }}>30 Jun 2025</div>
        <div style={{ position: 'absolute', right: 22, top: PLOT.y1 + 26, fontFamily: F, fontSize: 18, fontWeight: 700, color: ABU_TEKS }}>28 Jul 2025</div>
        {/* tombol JUAL */}
        <div style={{ position: 'absolute', left: SW / 2 - 130, top: 656, width: 260, height: 58, borderRadius: 999, background: B.blue, display: 'grid', placeItems: 'center',
          fontFamily: F, fontSize: 26, fontWeight: 800, color: B.white, letterSpacing: '.05em', boxShadow: bayanganKecil(B.blue) }}>JUAL</div>
        <div style={{ position: 'absolute', left: SW / 2 - 62, top: SH - 14, width: 124, height: 5, borderRadius: 3, background: B.night, opacity: 0.85 }} />
      </div>
      {jari > 0 ? (
        <Img src={staticFile('flat/tangan-potong.svg')} style={{ position: 'absolute', left: PONSEL.w / 2 - TANGAN.ujung[0] * TANGAN.s,
          top: 12 + 656 + 29 - TANGAN.ujung[1] * TANGAN.s, width: 420 * TANGAN.s, height: 920 * TANGAN.s, maxWidth: 'none',
          transform: `translate3d(${gx}px, ${jariY + gy}px, 0) rotate(0.001deg)` /* sub-piksel (dulu left/top → jari bergetar patah per piksel) */ }} />) : null}
    </div>);
};

/* ══════════════ E–F · LAYAR TERBELAH ══════════════ */
const GX_KIRI = 480 - X_IBU; // Ibu Sari di tengah belahan kiri (480), investor di tengah belahan kanan (1440) — simetris
const POS_BULAT: [number, number][] = [[480, 175], [1440, 175]];

/* ══════════════ G–J · PAPAN KONSEP (gaya rumah) ══════════════ */
// 2 Nov: y 520 → 500 — kamera +40 mulai f3662 (src/kamera.gen.ts) → kartu berpusat di 540 layar
const KARTU_G = [{ x: 600, y: 500, w: 620, h: 520 }, { x: 1320, y: 500, w: 620, h: 520 }];
/** titik LOKAL kartu i → layar */
const L = (i: number, x: number, y: number): [number, number] => [KARTU_G[i].x - KARTU_G[i].w / 2 + x, KARTU_G[i].y - KARTU_G[i].h / 2 + y];
/** kartu yang sedang TIDAK dibahas meredup (Investasi saat "Tapi kalau …", Spekulasi saat "Kalau keputusan …") */
const redup = (f: number, i: number) => (i ? cin(f, T.kalau) * (1 - cin(f, T.tapi)) : cin(f, T.tapi) * (1 - cin(f, T.value)));
/** rombak 30 Okt (Simon: "banyak fade"): kartu yang tidak dibahas TIDAK lagi meredup (opacity 60 f terbaca sebagai pudar) — sorotan cukup lewat tepi
 *  warna kartu yang dibahas (`sorot`) */
const alfaKartu = (_f: number, _i: number) => 1;
void redup;

/** LINGKARAN BISNIS / HARGA — satu benda dari F sampai I (aturan 5 "bentuk sama dibawa"): di atas kedua tokoh (F) → masuk ke tengah kartunya (G) →
 *  menepi memberi ruang isi berikutnya (H: ke kiri, panah ke laba · I: naik, ▲ menempel). Chip label di BAWAH lingkaran ikut berpindah.
 *  Sebelumnya chip Tenang / Panik di tempat yang sama (keluar dulu, baru lingkaran masuk). */
const LingkaranKonsep: React.FC<{ f: number }> = ({ f }) => {
  const g = cin(f, T.perbedaan), hI = cin(f, T.menciptakan - 50), hS = cin(f, T.harga2 - 40);
  const chipTP = [popIn(f, T.tenang) * popOut(f, T.karena + 20), popIn(f, T.panik) * popOut(f, T.karena + 20)];
  const p = [popIn(f, T.bisnisnya2), popIn(f, T.harganya)];
  // keluar BERSAMA kartunya (aturan 18: benda berpasangan ikut) — geser yang sama dengan swipe keluar Kaca
  const ikut = [0, 1].map((i) => swipeOff(popOut(f, T.value + 10), KARTU_G[i], i ? 'kanan' : 'kiri'));
  const warna = [B.turq, B.orange], ikon = ['warung', 'grafikHarga'] as const, label = ['Bisnis', 'Harga'], at = [T.bisnisnya2 + 10, T.harganya + 10];
  const pos = (i: number) => {
    const G = L(i, 310, 255);
    let x = lerp(POS_BULAT[i][0], G[0], g), y = lerp(POS_BULAT[i][1], G[1], g), d = lerp(120, 150, g);
    // 2 Nov (feedback seluruh video "spacing & alignment tidak center"): isi kedua kartu dipusatkan di badan kartu (±310) — dulu Investasi 35 px terlalu
    // ke bawah, Spekulasi 36 px terlalu ke atas
    const [H, h, dH] = i === 0 ? [L(0, 140, 255), hI, 120] : [L(1, 310, 211), hS, 100];
    x = lerp(x, H[0], h); y = lerp(y, H[1], h); d = lerp(d, dH, h);
    return { x, y, d };
  };
  if (f > T.value + 45) return null;
  return (
    <>
      <Chip x={POS_BULAT[0][0]} y={POS_BULAT[0][1]} teks="Tenang" ikon="stabil" warna={B.turq} p={chipTP[0]} size={32} />
      <Chip x={POS_BULAT[1][0]} y={POS_BULAT[1][1]} teks="Panik" ikon="panik" warna={B.orange} p={chipTP[1]} size={32} />
      {[0, 1].map((i) => {
        const q = pos(i), alfa = alfaKartu(f, i);
        const pChip = popIn(f, at[i]) * (i ? popOut(f, T.harga2 - 40) : 1);
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: alfa < 0.999 ? alfa : undefined,
            transform: ikut[i].x !== 0 ? `translate3d(${ikut[i].x}px, 0, 0)` : undefined }}>
            <Chip x={q.x} y={q.y + q.d / 2 + 48} teks={label[i]} warna={warna[i]} p={pChip} size={30} />
            <Bulat x={q.x} y={q.y} d={q.d} warna={warna[i]} ikon={ikon[i]} p={p[i]} />
            {i === 1 ? <PanahArah x={q.x + q.d * 0.5} y={q.y - q.d * 0.4} naik p={popIn(f, T.naik)} d={52} /> : null}
          </div>);
      })}
    </>);
};

const PapanKonsep: React.FC<{ f: number }> = ({ f }) => {
  const keluar = popOut(f, T.value + 10);
  const sorot = [cin(f, T.berinvestasi) * (1 - cin(f, T.tapi)), cin(f, T.berspekulasi) * (1 - cin(f, T.value))];
  const judul = ['Investasi', 'Spekulasi'], at = [T.investasi, T.spekulasi], warna = [B.turq, B.orange];
  return (
    <>
      {[0, 1].map((i) => {
        const K = KARTU_G[i];
        return (
          <Kaca key={i} x={K.x} y={K.y} w={K.w} h={K.h} p={popIn(f, at[i])} keluar={keluar} warna={warna[i]} tepi={sorot[i]} alfa={alfaKartu(f, i)}
            arah={i ? 'kanan' : 'kiri'}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center' }}>
              <WordText f={f} at={at[i]} style={{ fontFamily: F, fontSize: 48, fontWeight: 800, color: B.night }}>{judul[i]}</WordText>
            </div>
            {i === 0 ? <IsiInvestasi f={f} /> : <IsiSpekulasi f={f} w={K.w} />}
          </Kaca>);
      })}
    </>);
};
/** Investasi (H): lingkaran Bisnis → panah → laba tumbuh per tahun (batang naik berurutan) → chip "Nilai bertambah" */
const IsiInvestasi: React.FC<{ f: number }> = ({ f }) => {
  const dasar = 345, tinggi = [80, 130, 180], x0 = 340, jarak = 80, lb = 56; // 2 Nov: dasar 380 → 345 (isi berpusat di badan kartu)
  const tengahBatang = x0 + jarak + lb / 2;
  return (
    <>
      <svg width={620} height={520} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d="M 214 255 L 314 255" g={cin(f, T.menciptakan - 30)} warna={B.turq} panah={{ x: 314, y: 255, sudut: 0 }} />
        <Penghubung d={`M ${x0 - 20} ${dasar} L ${x0 + 2 * jarak + lb + 20} ${dasar}`} g={cin(f, T.menciptakan - 20)} warna={B.grayLite} dash={false} titik={false} tebal={3} />
        {tinggi.map((h, k) => {
          const g = cin(f, T.menciptakan + 20 * k - 20);
          return g <= 0 ? null : <rect key={k} x={x0 + k * jarak} y={dasar - h * g} width={lb} height={h * g} rx={10} fill={k === 2 ? B.turq : B.turqLite} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: tengahBatang - 120, width: 240, top: dasar + 14, textAlign: 'center' }}>
        <WordText f={f} at={T.menciptakan + 30} style={{ fontFamily: F, fontSize: 26, fontWeight: 700, color: B.gray }}>Laba per tahun</WordText>
      </div>
      <Chip x={310} y={437} teks="Nilai bertambah" ikon="pertumbuhan" warna={B.turq} p={popIn(f, T.nilai)} size={28} />
    </>);
};
/** Spekulasi (I): Kamu beli Rp1.000 → (harga naik: ▲ di lingkaran Harga) → orang lain membayar Rp1.300 */
const IsiSpekulasi: React.FC<{ f: number; w: number }> = ({ f, w }) => {
  const y = 356, xa = 130, xb = w - 130; // 2 Nov: 320 → 356 (isi berpusat di badan kartu)
  return (
    <>
      <svg width={w} height={520} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d={`M ${xa + 62} ${y} L ${xb - 62} ${y}`} g={cin(f, T.membayar)} warna={B.orange} panah={{ x: xb - 62, y, sudut: 0 }} />
      </svg>
      {/* "kamu" & orang lain = foto orang (gaya rumah), naik di masker lingkaran — dulu avatar ikon */}
      <FotoLingkar pose={ORANG_MUDA} x={xa} y={y} D={110} s={popIn(f, T.harga2)} warna={B.blue} naik={cin(f, T.harga2 + 20)} latar={B.blueWash} />
      <PilNominal x={xa} y={y + 86} teks="Rp1.000" arah={0} p={popIn(f, T.harga2 + 10)} size={26} />
      <FotoLingkar pose={POSE_BENDA.orangTua} x={xb} y={y} D={110} s={popIn(f, T.orang)} warna={B.orange} naik={cin(f, T.orang + 20)} latar={B.orangeWash} />
      <PilNominal x={xb} y={y + 86} teks="Rp1.300" arah={1} p={popIn(f, T.mahal)} size={26} />
    </>);
};

/** J: pil kode ilustrasi "ABCD" (2 Nov; dulu ICBP) di "kode" → MORF jadi kartu bisnis. Tulisan kode DIBAWA (bergeser & mengecil ke kepala kartu, bukan silang-pudar);
 *  isi kartu = tiga hal yang Ibu Sari baca di catatannya: Penjualan · Biaya · Laba (ikon sama dengan kartu catatan) */
const KodeJadiBisnis: React.FC<{ f: number }> = ({ f }) => {
  const p = popIn(f, T.saham + 10);
  if (p <= 0.001) return null;
  const t = cin(f, T.melihatnya + 20);
  const a = { x: 960, y: 510, w: 300, h: 110, warna: B.blue, radius: 55 };
  const b = { x: 960, y: 540, w: 640, h: 400, warna: B.blue, radius: 32, tab: 'atas' as const };
  const isiB = (
    <>
      {([['dompet', B.turq, 'Penjualan'], ['tagihan', B.blueLite, 'Biaya'], ['tumpukanKoin', CEK, 'Laba']] as const).map(([ikon, warna, label], k) => (
        <React.Fragment key={k}>
          <Bulat x={b.w / 2 + (k - 1) * 180} y={205} d={120} warna={warna} ikon={ikon} p={popIn(f, T.bisnis - 20 + 20 * k)} />
          <Label x={b.w / 2 + (k - 1) * 180} y={312} teks={label} f={f} at={T.bisnis - 10 + 20 * k} size={30} lebar={180} />
        </React.Fragment>))}
    </>);
  const ky = lerp(a.y, b.y - b.h / 2 + 66, t), ks = lerp(54, 44, t);
  return (
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${a.x}px ${a.y}px`, transform: p < 0.9999 ? `scale(${skalaPop(p)})` : undefined }}>
      <KacaMorf a={a} b={b} t={t} isiB={isiB} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        transform: `translate3d(0, ${ky - ks * 0.62}px, 0)` }}>
        <Icon name="saham" size={ks} color={B.blue} />
        <span style={{ fontFamily: F, fontSize: ks, fontWeight: 800, color: B.night, letterSpacing: '.02em', lineHeight: 1.24 }}>ABCD</span>
      </div>
      <Label x={960} y={620} teks="Kode saham" f={f} at={T.kode} keluar={T.melihatnya - 10} size={32} warna={ABU_TEKS} />
    </div>);
};

/** J: judul "Value investing" di tengah atas (tipografi per kata) — mengisi jeda sesudah dua kartu keluar (dulu ±1,4 dtk latar kosong f4345–4431);
 *  tetap di atas kartu bisnis sampai akhir scene */
/** rombak 30 Okt: judul MULAI DI TENGAH layar (dulu sendirian di atas dengan tengah layar kosong ±2 dtk), lalu NAIK memberi ruang saat pil ICBP pop
 *  (aturan 16 tengah dulu, lalu memberi ruang) */
/** 2 Nov (Simon: "Perbesar text Value Investing, disaat text itu berdiri sendiri, baru ketika text itu swipe ke atas baru textnya sesuai dengan ukuran
 *  yang kamu buat"): sendirian di tengah = 1,75× (105 px); MENGECIL ke 60 px dalam gerak naik yang sama (satu kemajuan 60 f), berporos tengah baris */
const JudulVI: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.value - 30 || f > AKHIR + 70) return null;
  const u = cin(f, T.saham - 20);
  return (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', transformOrigin: '50% 37px',
    transform: `translate3d(0, ${lerp(470, 236, u)}px, 0) scale(${lerp(1.75, 1, u)})` }}>
    <WordText f={f} at={T.value + 30} style={{ fontFamily: F, fontSize: 60, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>Value investing</WordText>
  </div>);
};

/* ══════════════ SCENE ══════════════ */
export const Scene01: React.FC<{ f: number }> = ({ f }) => {
  if (f > AKHIR + 70) return null;
  const pusatD = T.tempat + 9; // "Di tempat lain" — transisi paralaks lampu jalan (60 f)
  const gD = cin(f, T.kenapa + 30); // layar terbelah
  const pisah = cin(f, T.perbedaan - 10) * 960; // belahan keluar ke kiri & kanan
  const hpMasuk = cin(f, T.melihat), hpKeluar = cin(f, T.kenapa);
  const hpTampak = hpMasuk > 0 && hpKeluar < 1;
  const terbelah = gD > 0;
  return (
    <>
      {pisah < 960 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          {!terbelah ? (
            <ParalaksLampu f={f} pusat={pusatD}
              lama={<AdeganWarung f={f} gx={gxWarung(f)} />}
              baru={<AdeganKota f={f} gD={0} />} />
          ) : (
            <>
              {/* belahan kanan: kota (masker = wadah geser, resep V06) */}
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `translate3d(${960 * gD + pisah}px, 0, 0)` }}>
                <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${-960 * gD}px, 0, 0)` }}><AdeganKota f={f} gD={gD} /></div>
              </div>
              {/* belahan kiri: warung, Ibu Sari di tengah belahan */}
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `translate3d(${-(1920 - 960 * gD) - pisah}px, 0, 0)` }}>
                <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${1920 - 960 * gD}px, 0, 0)` }}><AdeganWarung f={f} gx={GX_KIRI} lengkap={false} /></div>
              </div>
              {/* garis pemisah ikut tepi belahan kanan keluar frame (rombak 30 Okt — dulu memudar saat belahan berpisah) */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: 8, height: 1080, background: B.white, transform: `translate3d(${960 * gD + pisah - 4}px, 0, 0)` }} />
            </>)}
          {hpTampak ? <PonselBesar f={f} y={PONSEL.y + SWIPE * (1 - hpMasuk) + SWIPE * hpKeluar} rot={-45 * (1 - hpMasuk) - 45 * hpKeluar} /> : null}
        </div>) : null}
      {f >= T.investasi - 40 ? <PapanKonsep f={f} /> : null}
      {f >= T.kenapa ? <LingkaranKonsep f={f} /> : null}
      <div style={{ position: 'absolute', inset: 0, transform: f > AKHIR - 10 ? `translate3d(0, ${-820 * cin(f, AKHIR + 22)}px, 0)` : undefined /* 30 Okt: +12 f, bertumpang dengan penggaris S02 (audit FRAME-KOSONG f4720) */ }}>
        <JudulVI f={f} />
        {f >= T.saham - 40 ? <KodeJadiBisnis f={f} /> : null}
      </div>
    </>);
};
export const S01_T = T;
