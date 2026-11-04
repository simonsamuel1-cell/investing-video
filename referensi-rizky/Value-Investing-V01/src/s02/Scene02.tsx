import React from 'react';
import { ARAH, B, CEK, F, R, lerp, mixHex, rgba } from '../theme';
import { cin, popOut, skalaPop, swipeOff, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label } from '../parts/umum';
import { Kaca, KacaMorf, KarakterLingkar, Nomor, ORANG_MUDA, Penghubung, type GeoKartu, type PoseKarakter } from '../parts/kaca';
import { PilNominal } from '../parts/nominal';
import { PenggarisTahun } from '../parts/penggaris';
import { AngkaBulat, FotoLingkar, POSE_BENDA } from '../parts/lingkar';
import { BatangLilin, KisiLilin, tumbuh } from '../parts/lilinRiil';
import { DOW_1929, IHSG_S02 } from '../data/lilinS02.gen';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { IsiSorot, KARTU as KARTU_S03, PUSAT_Y as PUSAT_S03, S03_T } from '../s03/Scene03';

/**
 * SCENE 02 — "Empat Pilar Value Investing" (VI V01, 29 Okt). Gaya rumah (bukan analogi): foto orang asli + ikon ilustrasi + kartu kaca.
 *  A f4684–5100  "bukan sesuatu yang baru … pada 1929" — penggaris tahun bergulir 2026 → 1929 (komponen V06) · kartu krisis 1929: Dow Jones
 *                381 → 41 (Sep 1929 – Jul 1932, ▼ 89 %, angka sejarah).
 *  B f5102–5536  Benjamin Graham (foto berkas Simon, proyek 006) · chip Bisnis · Nilai.
 *  C f5563–5774  "empat prinsip" — BANGUNAN EMPAT PILAR (atap Value Investing, pilar 01–04, alas).
 *  P1–P4         bangunan MENGECIL jadi peta di atas (pilar aktif menyala) + papan prinsip:
 *                01 Beli bisnisnya (kamu ← sepotong perusahaan; Bisnisnya ✓ · Harga harian dicoret)
 *                02 Harga di bawah nilai (penggaris murah–mahal, nilai wajar Rp1.000, harga Rp800 → Rp1.500 "Terlalu mahal")
 *                03 Manfaatkan market (Manfaatkan · Ikuti emosi dicoret; harga berayun jauh dari kondisi bisnis: Takut · Optimistis)
 *                04 Pahami bisnisnya (10 perusahaan, kotak "Yang kita pahami", sisanya meredup)
 *  E f8287–8596  papan keluar, bangunan kembali utuh, semua pilar menyala, alas "Fondasi".
 */

/* ── WAKTU (urut dari batas scene → kata scene sebelumnya tidak tertangkap) ── */
const PASANG: [string, string][] = [
  ['bukan', 'bukan'], ['krisis', 'krisis'], ['th1929', '1929'], ['benjamin', 'benjamin'], ['graham', 'graham'], ['bisnis', 'bisnis'], ['nilai', 'nilai'],
  ['intinya', 'intinya'], ['empat', 'empat'], ['pertama', 'pertama'], ['membeli', 'membeli'], ['saham', 'saham'], ['sebagian', 'sebagian'],
  ['perusahaan', 'perusahaan'], ['bisnisnya', 'bisnisnya'], ['pergerakan', 'pergerakan'], ['hariannya', 'hariannya'],
  ['kedua', 'kedua'], ['bayar', 'bayar'], ['bawah', 'bawah'], ['wajarnya', 'wajarnya'], ['bagus', 'bagus'], ['buruk', 'buruk'], ['dibeli', 'dibeli'],
  ['terlalu', 'terlalu'], ['mahal', 'mahal'],
  ['ketiga', 'ketiga'], ['manfaatkan', 'manfaatkan'], ['ikuti', 'ikuti'], ['emosinya', 'emosinya'], ['saat', 'saat'], ['takut', 'takut'],
  ['optimistis', 'optimistis'], ['jauh', 'jauh'], ['kondisi', 'kondisi'], ['keempat', 'keempat'], ['berinvestasi', 'berinvestasi'], ['pahami', 'pahami'],
  ['nggak', 'nggak'], ['semua', 'semua'], ['empat2', 'empat'], ['fondasi', 'fondasi'],
];
const T = (() => {
  const v = urut(PASANG.map(([, w]) => w), BATAS.s2);
  return Object.fromEntries(PASANG.map(([n], i) => [n, v[i]])) as Record<string, number>;
})();
const AWAL = BATAS.s2, AKHIR = BATAS.s3;

/* ══════════════ A · 1929 ══════════════ */
/** Dow Jones 1929–1932 = CANDLE BULANAN RIIL (Simon 30 Okt: "Ganti linechart dengan candlestick (buat candlenya realistis)"): 35 candle Sep 1929 –
 *  Jul 1932 dari penutupan harian DJIA (scripts/gen-lilin-s02.py; OHLC harian 1929 tidak tersedia terbuka) — puncak 381,17 (3 Sep 1929), dasar 41,22
 *  (8 Jul 1932, −89,2 %). Candle tumbuh LINEAR dari harga buka, berurutan kiri → kanan (resep video TA), skala harga TERKUNCI 30–390. */
const KRISIS = { w: 720, h: 420, y: 520 };
const PK = { x0: 70, x1: 650, y0: 132, y1: 330 };
const SLOT_K = (PK.x1 - PK.x0) / DOW_1929.length; // 16,6 px
const yK = (v: number) => PK.y1 - ((PK.y1 - PK.y0) * (v - 30)) / 360; // 30–390 (dulu 0–400: candle 1930–1932 gepeng)
const xK = (k: number) => PK.x0 + SLOT_K * (k + 0.5);
const LILIN_K = { sela: 3, umur: 14 };
const mulaiK = (k: number) => T.th1929 + 108 + LILIN_K.sela * k;
const uK = (f: number, k: number) => Math.max(0, Math.min(1, (f - mulaiK(k)) / LILIN_K.umur));
const T_DASAR_K = () => mulaiK(DOW_1929.length - 1) + LILIN_K.umur; // candle Jul 1932 (dasar 41) selesai
const xKrisis = (f: number) => lerp(960, 750, cin(f, T.benjamin));
const KartuKrisis: React.FC<{ f: number }> = ({ f }) => {
  const p = popIn(f, T.th1929 + 94), keluar = popOut(f, T.intinya - 10);
  const pPuncak = popIn(f, mulaiK(0) + LILIN_K.umur), pDasar = popIn(f, T_DASAR_K());
  return (
    <Kaca x={xKrisis(f)} y={KRISIS.y} w={KRISIS.w} h={KRISIS.h} p={p} keluar={keluar} warna={B.orange} tab="atas" arah="kiri">
      <Chip x={150} y={66} teks="Krisis 1929" ikon="pasarTurun" warna={B.orange} p={1} size={28} />
      <div style={{ position: 'absolute', left: 300, top: 46, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>Dow Jones</div>
      <PilNominal x={KRISIS.w - 40} y={66} teks="89%" arah={-1} p={pDasar} size={28} jangkar="kanan" />
      <svg width={KRISIS.w} height={KRISIS.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`translate(${PK.x0} ${PK.y0})`}><KisiLilin w={PK.x1 - PK.x0} h={PK.y1 - PK.y0} /></g>
        <line x1={PK.x0} x2={PK.x1} y1={PK.y1 + 16} y2={PK.y1 + 16} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
        {DOW_1929.map((b, k) => {
          const u = uK(f, k);
          return u <= 0 ? null : <BatangLilin key={b.t} c={tumbuh(b, u)} x={xK(k)} slot={SLOT_K} Y={yK} sumbu={2} alfa={Math.min(1, u * 3)} />;
        })}
        {[[0, 381.17, pPuncak], [DOW_1929.length - 1, 41.22, pDasar]].map(([k, v, q]) => q <= 0.001 ? null : (
          <circle key={k} cx={xK(k)} cy={yK(v)} r={8 * skalaPop(q)} fill={B.white} stroke={ARAH.turun} strokeWidth={4} />))}
      </svg>
      <div style={{ position: 'absolute', left: xK(0) + 16, top: yK(381.17) - 30 }}><WordText f={f} at={mulaiK(0) + LILIN_K.umur} style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night }}>381</WordText></div>
      {/* angka dasar 41: naik + opacity + motion blur saat candle terakhir selesai */}
      <div style={{ position: 'absolute', left: xK(DOW_1929.length - 1) - 54, top: yK(41.22) - 54 }}><WordText f={f} at={T_DASAR_K()} style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night }}>41</WordText></div>
      <div style={{ position: 'absolute', left: PK.x0 - 10, top: PK.y1 + 30, fontFamily: F, fontSize: 22, fontWeight: 700, color: ABU_TEKS }}>Sep 1929</div>
      <div style={{ position: 'absolute', right: KRISIS.w - PK.x1 - 10, top: PK.y1 + 30, fontFamily: F, fontSize: 22, fontWeight: 700, color: ABU_TEKS }}>Jul 1932</div>
    </Kaca>);
};
const ABU_TEKS = mixHex(B.gray, B.night, 0.45);

/* ══════════════ B · BENJAMIN GRAHAM ══════════════ */
/** foto Benjamin Graham (berkas Simon `006. Core Principles of VI/…/Benjamin Graham.png`, latar transparan) — kepala menyembul di atas lingkaran */
// 30 Okt: foto seluruh badan baru dari Simon (latar transparan 1024 × 1536); puncak kepala y 22 = 1,72 r di atas pusat lingkaran
// 30 Okt (Simon: "Masking Benjamin graham aneh. Lengannya seperti terpotong"): bahu jas lebih lebar dari lingkaran → masker = lingkaran PENUH + pita
// selebar kepala (kepala 96 px gambar ±0,46 r; terukur dari render: kepala + telinga ±84 px) — bahu kini dipotong lengkung lingkaran, hanya kepala menyembul
// cx 500 (seluruh video, Simon: "Cek alignment orang dengan lingkaran … Pastikan berada tepat ditengah"): pusat BADAN di baris lingkaran terukur 490, pusat
// kepala 515 — dulu 512 (kepala) → jas ±16 px layar ke kiri; 500 = tengah keduanya (badan & kepala masing-masing ±9 px dari pusat lingkaran)
const GRAHAM: PoseKarakter = { src: 'karakter/graham-badan.png', w: 1024, h: 1536, cx: 500, cy: 383, r: 210, kepala: 96 };
const G = { x: 1380, y: 470, D: 300 };
const Graham: React.FC<{ f: number }> = ({ f }) => {
  const s = popIn(f, T.benjamin + 20), keluar = popOut(f, T.intinya - 10);
  const naik = cin(f, T.benjamin + 40);
  if (s <= 0.001 || keluar <= 0.001) return null;
  // 30 Okt (Simon: "Transisi ke adegan selanjutnya seharusnya panel swipe ke kiri, benjamin swipe ke kanan"): Graham + nama + chip KELUAR BERSAMA lewat
  // tepi kanan (60 f inOut cubic, waktu sama dengan kartu krisis keluar ke kiri) — dulu mengecil (pop keluar)
  const o = swipeOff(keluar, { x: G.x, y: G.y + 80, w: 420, h: 640 }, 'kanan');
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: o.x ? `translate3d(${o.x}px, 0, 0)` : undefined }}>
      <KarakterLingkar pose={GRAHAM} x={G.x} y={G.y} D={G.D} s={s} warna={B.blueWash} naik={naik} />
      <Label x={G.x} y={G.y + G.D / 2 + 52} teks="Benjamin Graham" f={f} at={T.graham} size={34} />
      <Chip x={G.x - 100} y={G.y + G.D / 2 + 122} teks="Bisnis" ikon="warung" warna={B.turq} p={popIn(f, T.bisnis)} size={28} />
      <Chip x={G.x + 100} y={G.y + G.D / 2 + 122} teks="Nilai" ikon="pertumbuhan" warna={B.blue} p={popIn(f, T.nilai)} size={28} />
    </div>);
};

/* ══════════════ C · BANGUNAN EMPAT PILAR ══════════════ */
const PILAR: { ikon: KunciIkon; warna: string; label: string }[] = [
  { ikon: 'warung', warna: B.blue, label: 'Beli bisnisnya' },
  { ikon: 'valuasi', warna: B.turq, label: 'Harga di bawah nilai' },
  { ikon: 'disiplin', warna: B.orange, label: 'Manfaatkan market' },
  { ikon: 'alasan', warna: B.blue, label: 'Pahami bisnisnya' },
];
const KUIL = { cx: 960, cy: 490, pilarX: [615, 845, 1075, 1305], pilarW: 190, atasPilar: 378, bawahPilar: 690 };
const MINI = { cx: 960, cy: 160, s: 0.36 };
/** `m` 0 = utuh di tengah, 1 = peta kecil di atas · `aktif` pilar yang dibahas (−1 = semua menyala) · `fondasi` sorot alas */
/** isi satu pilar (nomor · ikon · label) — dipakai pilar di kuil DAN sebagai isi awal panel yang memekar dari pilar itu */
const IsiPilar: React.FC<{ i: number }> = ({ i }) => {
  const pl = PILAR[i];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: KUIL.pilarW, height: KUIL.bawahPilar - KUIL.atasPilar }}>
      <Nomor x={KUIL.pilarW / 2} y={56} n={i + 1} warna={pl.warna} p={1} d={56} cincin />
      <Bulat x={KUIL.pilarW / 2} y={150} d={96} warna={pl.warna} ikon={pl.ikon} p={1} />
      <div style={{ position: 'absolute', left: 16, right: 16, top: 214, textAlign: 'center', fontFamily: F, fontSize: 23, fontWeight: 800, color: B.night, lineHeight: 1.18 }}>
        {pl.label}</div>
    </div>);
};
const geoPilar = (i: number): GeoKartu => ({ x: KUIL.pilarX[i], y: (KUIL.atasPilar + KUIL.bawahPilar) / 2, w: KUIL.pilarW, h: KUIL.bawahPilar - KUIL.atasPilar,
  warna: PILAR[i].warna, tab: 'atas' });
/** KUIL → KARTU GRAHAM S03 (2 Nov, Simon: "Transisi ke scene 3, jangan gunakan pop out, morphing aja" — dulu kuil pop keluar, kartu Graham pop masuk):
 *  60 f berpusat di kata S03 "cara" (dulu kartu pop di situ). Empat pilar = empat kartu berbentuk sama → DIGABUNG jadi satu kartu (aturan 6): tiap pilar
 *  ber-MORF ke kotak kartu Graham (tengah frame), isi pilar memudar di dalam bentuknya, pilar ke-1 membawa isi kartu Graham; tiga lainnya menumpuk.
 *  Atap: segitiga menyusut ke pitanya, pita atap turun & menyempit jadi PITA BIRU kartu; alas Fondasi naik & menyempit ke tepi bawah kartu, menipis. */
const KUIL_KE_KARTU = () => S03_T.cara;
const geoGraham = (): GeoKartu => ({ x: KARTU_S03.x, y: PUSAT_S03, w: KARTU_S03.w, h: KARTU_S03.h, warna: B.blue, tab: 'atas' });
const Kuil: React.FC<{ f: number; m: number; semua: number; fondasi: number; buka: boolean[]; jadiKartu?: number }> = ({ f, m, semua, fondasi, buka, jadiKartu = 0 }) => {
  const atapP = popIn(f, T.intinya + 30), alasP = popIn(f, T.empat + 47);
  const u = jadiKartu, G = geoGraham();
  const lebarKuil = KUIL.pilarX[3] - KUIL.pilarX[0] + KUIL.pilarW + 112; // pita atap & alas 992
  const sx = lerp(1, G.w / lebarKuil, u);
  const tabY = G.y - G.h / 2 + 7, bawahY = G.y + G.h / 2;
  const tx = lerp(0, MINI.cx - KUIL.cx, m), ty = lerp(0, MINI.cy - KUIL.cy, m), sk = lerp(1, MINI.s, m);
  const K = KUIL, lebar = K.pilarX[3] - K.pilarX[0] + K.pilarW;
  return (
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${K.cx}px ${K.cy}px`, transform: m > 0 ? `translate3d(${tx}px, ${ty}px, 0) scale(${sk})` : undefined }}>
      {/* atap (pediment) + papan nama */}
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${K.cx}px 300px`, transform: atapP < 0.9999 ? `scale(${skalaPop(atapP)})` : undefined,
        display: atapP > 0.001 && u < 1 ? undefined : 'none' }}>
        {/* morf ke kartu: seluruh atap turun (pita y 347 → pita kartu), menyempit sx, pita menipis 26 → 14 */}
        <div style={{ position: 'absolute', inset: 0, transformOrigin: `${K.cx}px 347px`,
          transform: u > 0 ? `translate3d(0, ${(tabY - 347) * u}px, 0) scale(${sx}, ${lerp(1, 14 / 26, u)})` : undefined }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <rect x={K.cx - lebar / 2 - 56} y={334} width={lebar + 112} height={26} rx={8} fill={B.blue} />
          </svg>
        </div>
        {/* segitiga + tulisan menyusut (skala seragam, tanpa distorsi huruf) ke tengah pita yang sedang turun */}
        <div style={{ position: 'absolute', inset: 0, transformOrigin: `${K.cx}px 336px`,
          transform: u > 0 ? `translate3d(0, ${(tabY - 347) * u}px, 0) scale(${1 - u})` : undefined }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <path d={`M ${K.cx - lebar / 2 - 40} 336 L ${K.cx} 232 L ${K.cx + lebar / 2 + 40} 336 Z`} fill={B.white} stroke={B.blue} strokeWidth={5} strokeLinejoin="round" />
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 286, textAlign: 'center', fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>Value investing</div>
        </div>
      </div>
      {/* empat pilar = kartu kaca (pop di "empat", 20 f berurutan) */}
      {PILAR.map((pl, i) => {
        const x = K.pilarX[i], h = K.bawahPilar - K.atasPilar, y = K.atasPilar + h / 2;
        const p = popIn(f, T.empat - 33 + 20 * i);
        const on = nyalaPilar(f, i), nyala = Math.max(semua, on), redup = m * (1 - on) * (1 - semua);
        if (buka[i]) return null; // pilar ini sedang memekar jadi panel (digambar KacaMorf)
        if (u > 0) return (
          // keempat pilar PEKAT selama menyatu (gabungan tampak berpusat; dulu tiga pilar memudar sejak awal → bentuk berat ke kiri), yang tidak
          // membawa isi baru hilang di 20 % akhir saat sudah berimpit dengan pilar 1 (bayangan tidak menumpuk saat diserahkan ke S03)
          <KacaMorf key={i} a={geoPilar(i)} b={G} t={Math.min(u, 0.9998)} tepi={nyala} alfa={i === 0 ? 1 : R(u, 0.8, 1, 1, 0)} padat z={i === 0 ? 2 : 1}
            isiA={<IsiPilar i={i} />} isiB={i === 0 ? <IsiSorot f={f} i={0} /> : undefined} />);
        return (
          <Kaca key={i} x={x} y={y} w={K.pilarW} h={h} p={p} warna={pl.warna} tab="atas" tepi={nyala} alfa={1 - 0.5 * redup}><IsiPilar i={i} /></Kaca>);
      })}
      {/* alas = FONDASI */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${K.cx}px 734px`,
        transform: alasP < 0.9999 ? `scale(${skalaPop(alasP)})` : undefined, display: alasP > 0.001 && u < 1 ? undefined : 'none' }}>
        {/* morf ke kartu: alas naik ke tepi bawah kartu, menyempit sx & menipis 52 → 0 (badan dan tulisan dipisah: tulisan menyusut seragam) */}
        <div style={{ position: 'absolute', left: K.cx - lebar / 2 - 56, top: 708, width: lebar + 112, height: 52, borderRadius: 14,
          background: mixHex(B.blue, B.white, 0.85 - 0.85 * fondasi), border: `4px solid ${B.blue}`, boxSizing: 'border-box',
          boxShadow: fondasi > 0.01 ? `0 0 ${30 * fondasi}px ${6 * fondasi}px ${rgba(B.blue, 0.3 * (1 - u))}` : undefined,
          transformOrigin: 'center', transform: u > 0 ? `translate3d(0, ${(bawahY - 734) * u}px, 0) scale(${sx}, ${1 - u})` : undefined }} />
        <div style={{ position: 'absolute', left: K.cx - lebar / 2 - 56, top: 708, width: lebar + 112, height: 52, display: 'grid', placeItems: 'center',
          transformOrigin: 'center', transform: u > 0 ? `translate3d(0, ${(bawahY - 734) * u}px, 0) scale(${1 - u})` : undefined }}>
          {f > T.fondasi - 60 ? (
            <WordText f={f} at={T.fondasi} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: mixHex(B.night, B.white, fondasi), letterSpacing: '.04em' }}>Fondasi</WordText>) : null}
        </div>
      </div>
    </div>);
};

/* ══════════════ P1–P4 · PILAR MEMEKAR JADI PANEL (rombak 30 Okt) ══════════════
 * Simon 29 Okt malam ("layout seperti PPT, banyak fade"): dulu kuil MENGECIL jadi peta di atas + papan berjudul di bawah, isi prinsip berganti dengan PUDAR.
 * Kini kuil tetap di tengah; pilar yang dibahas MEMEKAR jadi panel (KacaMorf, satu bentuk) dan MENGERUT kembali ke kuil sebelum pilar berikutnya memekar
 * (pola sama dengan timbangan S05). Panel PADAT menutup kuil di belakangnya. */
const PAPAN = { x: 960, y: 500, w: 1440, h: 620 };
const MULAI = () => [T.pertama, T.kedua, T.ketiga, T.keempat];
/** pilar i sedang dibahas (0…1, tint 60 f di batas prinsip) */
const nyalaPilar = (f: number, i: number) => cin(f, MULAI()[i]) * (i < 3 ? 1 - cin(f, MULAI()[i + 1]) : 1 - cin(f, T.empat2));
/** pusat tanjakan 60 f: pilar i memekar / panel i mengerut (yang lama selesai mengerut dulu, baru pilar berikutnya memekar — aturan 17) */
const MEKAR = () => [T.pertama + 26, T.kedua + 50, T.ketiga + 67, T.keempat + 50];
const KERUT = () => [T.kedua - 10, T.ketiga + 7, T.keempat - 10, T.empat2 - 10];
const bukaPanel = (f: number, i: number) => cin(f, MEKAR()[i]) * (1 - cin(f, KERUT()[i]));
const PanelPrinsip: React.FC<{ f: number; i: number }> = ({ f, i }) => {
  const u = bukaPanel(f, i);
  if (u <= 0) return null;
  const pl = PILAR[i];
  return (
    <KacaMorf a={geoPilar(i)} b={{ ...PAPAN, warna: pl.warna, tab: 'atas' }} t={Math.min(u, 0.9998)} tepi={nyalaPilar(f, i)} padat z={3}
      isiA={<IsiPilar i={i} />}
      isiB={(
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* judul panel di TENGAH atas (30 Okt malam: ATURAN §5 "hindari teks judul di kiri atas" — dulu kiri atas di 15 panel).
              30 Okt (Simon: "dibagian atas panel ada noda hitam, didekat panel yang berwarna … tidak hanya diwarna biru"): komentar ini dulu TANPA kurung
              kurawal → React mencetaknya sebagai TEKS hitam di pojok kiri atas keempat panel; pita warna menutup separuh atas hurufnya, sisanya = "noda" */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', border: `4px solid ${pl.warna}`, boxSizing: 'border-box', background: B.white, display: 'grid', placeItems: 'center' }}>
              <AngkaBulat n={i + 1} d={60} warna={pl.warna} /></div>
            <WordText f={f} at={MEKAR()[i] + 20} style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>{pl.label}</WordText>
          </div>
          {i === 0 ? <Isi1 f={f} /> : i === 1 ? <Isi2 f={f} /> : i === 2 ? <Isi3 f={f} /> : <Isi4 f={f} />}
        </div>)} />);
};

/* TATA LETAK ISI PANEL (rombak 30 Okt malam, Simon: "layout berantakan, spacing tidak konsisten, aligment bermasalah"): panel lokal 1440 × 580, pita judul
 *  0–110; isi berpusat x 720 (tengah panel) dan di tengah tinggi sisa panel; label sebaris (satu baseline), chip tepat di tengah benda/zona yang
 *  dijelaskannya, jarak antar-baris satu ritme. */
const PX = PAPAN.w / 2; // pita judul 0–110, isi di 110–600 (pusat ±355)

/** 01: kamu membeli SEPOTONG perusahaan (cincin 8 potong, satu potong = saham kamu) · Bisnisnya ✓ · Harga harian dicoret.
 *  30 Okt (Simon S02): label "Kamu" & "Perusahaan" DIHAPUS · panah = SETENGAH LINGKARAN (dulu lengkung kuadratik) · ikon gedung → FOTO GEDUNG ASLI
 *  (media/perusahaan.webp, naik di masker lingkaran muda). Tanpa baris label, isi turun ke tengah ruang isi (cy 345) dan berpusat x 720. */
const Isi1: React.FC<{ f: number }> = ({ f }) => {
  const cx = 510, cy = 345, R = 128, n = 8, kel = 2 * Math.PI * R, seg = kel / n;
  const K = { x: 950, D: 210 }, Y_CHIP = 556;
  const cincin = cin(f, T.sebagian - 10), potong = popIn(f, T.sebagian + 10);
  // setengah lingkaran (diameter mendatar y 252, r 125, puncak y 127 — di bawah pita judul): pangkal di luar potongan oranye (potong ke-2, −45°…0°,
  // pangkal −39°), ujung di atas lingkaran kamu → panah menunjuk TEGAK ke bawah ke dalam lingkaran (celah ±20 px)
  const yB = 252, xA = cx + Math.sqrt((R + 11) ** 2 - (cy - yB) ** 2) + 12, xB = K.x - 75;
  return (
    <>
      <svg width={PAPAN.w} height={PAPAN.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* cincin kepemilikan: 8 potong (trim muncul searah jarum jam), potong ke-2 = oranye (saham yang dibeli, menghadap lingkaran kamu) */}
        {Array.from({ length: n }, (_, k) => {
          const tampak = Math.max(0, Math.min(1, cincin * n - k));
          return tampak <= 0 ? null : (
            <circle key={k} cx={cx} cy={cy} r={R} fill="none" stroke={k === 1 ? mixHex(B.turqLite, B.orange, potong) : B.turqLite} strokeWidth={22}
              strokeDasharray={`${(seg - 8) * tampak} ${kel}`} transform={`rotate(${-90 + (360 / n) * k} ${cx} ${cy})`} />);
        })}
        <Penghubung d={`M ${xA} ${yB} A ${(xB - xA) / 2} ${(xB - xA) / 2} 0 0 1 ${xB} ${yB}`} g={cin(f, T.perusahaan - 10)} warna={B.orange}
          panah={{ x: xB, y: yB, sudut: Math.PI / 2 }} />
      </svg>
      <FotoLingkar pose={POSE_BENDA.gedung} x={cx} y={cy} D={180} s={popIn(f, T.saham)} warna={B.turq} naik={cin(f, T.saham + 20)} latar={B.turqWash} />
      {/* "kamu" = foto orang yang sama di seluruh seri (orang_biru_muda), naik di masker lingkaran */}
      <FotoLingkar pose={ORANG_MUDA} x={K.x} y={cy} D={K.D} s={popIn(f, T.membeli)} warna={B.blue} naik={cin(f, T.membeli + 20)} latar={B.blueWash} />
      {/* saham yang dibeli = lencana di tepi lingkaran kamu (dulu melayang terpisah) */}
      <Bulat x={K.x + (K.D / 2) * 0.72} y={cy + (K.D / 2) * 0.72} d={84} warna={B.orange} ikon="saham" p={popIn(f, T.saham + 20)} />
      <Chip x={PX - 150} y={Y_CHIP} teks="Bisnisnya" ikon="mata" warna={CEK} p={popIn(f, T.bisnisnya)} size={30} />
      <Chip x={PX + 150} y={Y_CHIP} teks="Harga harian" ikon="naikTurun" warna={B.gray} p={popIn(f, T.pergerakan)} coret={cin(f, T.hariannya)} size={30} />
    </>);
};

/** 02 — GRAFIK ZONA NILAI (Simon 30 Okt: "Dibagian 'harga dibawah nilai' cek video value (cek screenshoot), buat illustarsinya mungkin bisa kamu buat seperti
 *  itu, tapi dengan aturan yang sudah aku berikan"): kotak grafik dengan TIGA PITA mendatar sama tinggi — Terlalu mahal (merah muda) · Nilai wajar (oranye
 *  muda) · Di bawah nilai wajar (hijau muda), label zona di kanan tiap pita, sumbu harga Rp400–Rp1.600 di kiri; harga perusahaan bagus (garis biru brand)
 *  bergerak di zona murah, lalu naik menembus nilai wajar sampai zona mahal (puncak Rp1.500, sedikit turun di ujung — pola referensi). Penanda:
 *  "bayar" = titik beli Rp700 di zona hijau · "dibeli terlalu mahal" = titik beli Rp1.500 di puncak. Teks Indonesia, warna brand + hijau/merah harga. */
const ZONA = { x0: 150, x1: 1290, y0: 140, y1: 570, v0: 400, v1: 1600 };
const yZ = (v: number) => ZONA.y1 - ((ZONA.y1 - ZONA.y0) * (v - ZONA.v0)) / (ZONA.v1 - ZONA.v0);
/** jalur harga ilustrasi [x, harga]: tenang di zona murah → naik → puncak Rp1.500 → turun sedikit */
const HARGA_Z: [number, number][] = [[200, 720], [240, 750], [280, 690], [320, 735], [360, 700], [400, 725], [440, 760], [480, 745], [520, 790], [560, 830],
  [600, 870], [640, 930], [680, 990], [720, 1040], [760, 1090], [800, 1150], [840, 1185], [880, 1270], [920, 1360], [960, 1440], [990, 1500], [1020, 1485], [1050, 1430]];
const BELI_Z = { murah: 4, mahal: 20 }; // indeks titik beli pada HARGA_Z
const Isi2: React.FC<{ f: number }> = ({ f }) => {
  const Z = ZONA, hPita = (Z.y1 - Z.y0) / 3;
  const jalur = (a: number, b: number) => `M ${HARGA_Z.slice(a, b + 1).map(([x, v]) => `${x} ${yZ(v).toFixed(1)}`).join(' L ')}`;
  // garis dua tahap: sampai titik beli murah di "bayar", lalu naik ke zona mahal sebelum "dibeli"
  const g1 = cin(f, T.bayar - 20), g2 = cin(f, T.buruk + 30);
  const sorot = [cin(f, T.terlalu), cin(f, T.wajarnya - 10), cin(f, T.bawah)]; // pita atas → bawah disorot saat disebut
  const PITA = [{ warna: ARAH.turun, teks: 'Terlalu mahal', at: T.terlalu }, { warna: B.orange, teks: 'Nilai wajar', at: T.wajarnya - 10 },
    { warna: CEK, teks: 'Di bawah nilai wajar', at: T.bawah }];
  const [xm, vm] = HARGA_Z[BELI_Z.murah], [xa, va] = HARGA_Z[BELI_Z.mahal];
  const titik = (x: number, v: number, p: number, warna: string) => p <= 0.001 ? null : (
    <g transform={`translate(${x} ${yZ(v)}) scale(${skalaPop(p)})`}><circle r={18} fill={B.white} stroke={warna} strokeWidth={5} /><circle r={7} fill={warna} /></g>);
  return (
    <>
      <svg width={PAPAN.w} height={PAPAN.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs><clipPath id="s02-zona"><rect x={Z.x0} y={Z.y0} width={Z.x1 - Z.x0} height={Z.y1 - Z.y0} rx={22} /></clipPath></defs>
        <g clipPath="url(#s02-zona)">
          {PITA.map((p, i) => <rect key={i} x={Z.x0} y={Z.y0 + hPita * i} width={Z.x1 - Z.x0} height={hPita} fill={rgba(p.warna, 0.1 + 0.08 * sorot[i])} />)}
        </g>
        <rect x={Z.x0} y={Z.y0} width={Z.x1 - Z.x0} height={Z.y1 - Z.y0} rx={22} fill="none" stroke={B.grayLite} strokeWidth={2} />
        {[600, 800, 1000, 1200, 1400].map((v) => <line key={v} x1={Z.x0 - 10} x2={Z.x0} y1={yZ(v)} y2={yZ(v)} stroke={B.grayLite} strokeWidth={2} />)}
        <Penghubung d={jalur(0, BELI_Z.murah)} g={g1} warna={B.blue} dash={false} titik={false} tebal={6} />
        <Penghubung d={jalur(BELI_Z.murah, HARGA_Z.length - 1)} g={g2} warna={B.blue} dash={false} titik={false} tebal={6} />
        {titik(xm, vm, popIn(f, T.bayar), CEK)}
        {titik(xa, va, popIn(f, T.dibeli), ARAH.turun)}
      </svg>
      {/* sumbu harga (di luar kotak, rata kanan) */}
      {[400, 600, 800, 1000, 1200, 1400, 1600].map((v) => (
        <div key={v} style={{ position: 'absolute', right: PAPAN.w - Z.x0 + 18, top: yZ(v) - 12, fontFamily: F, fontSize: 20, fontWeight: 700, color: ABU_TEKS, whiteSpace: 'nowrap' }}>
          Rp{String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</div>))}
      {/* label zona di kanan tiap pita (naik + opacity saat zonanya disebut) */}
      {PITA.map((p, i) => (
        <div key={i} style={{ position: 'absolute', right: PAPAN.w - Z.x1 + 26, top: Z.y0 + hPita * (i + 0.5) - 17, textAlign: 'right' }}>
          <WordText f={f} at={p.at} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: mixHex(ABU_TEKS, B.night, sorot[i]) }}>{p.teks}</WordText></div>))}
      <PilNominal x={xm} y={yZ(vm) + 52} teks="Harga Rp700" arah={0} p={popIn(f, T.bayar + 10)} size={28} />
      <PilNominal x={xa - 34} y={yZ(va)} teks="Dibeli Rp1.500" arah={0} p={popIn(f, T.dibeli + 10)} size={28} jangkar="kanan" />
      <Chip x={340} y={Z.y0 + hPita / 2} teks="Perusahaan bagus" ikon="kualitas" warna={B.blue} p={popIn(f, T.bagus)} size={28} />
    </>);
};

/** 03: Manfaatkan ✓ · Ikuti emosi dicoret (kolom kanan) · harga berayun jauh di sekitar kondisi bisnis (putus-putus turkis): Takut · Optimistis.
 *  30 Okt (Simon: "Adegan manfaatkan market, buat line chartnya jadi candlestick (realistis seperti market saham asli)"): garis sinus ilustrasi →
 *  75 CANDLE MINGGUAN RIIL IHSG 2 Sep 2024 – 13 Feb 2026 (scripts/gen-lilin-s02.py; chart tanpa nama): ±7.700 → takut Apr 2025 (5.883) → optimistis
 *  Jan 2026 (9.174). Candle tumbuh LINEAR dari buka berurutan kiri → kanan, skala harga TERKUNCI, kisi tipis (resep video TA). */
const PI3 = { x0: 150, x1: 1000, y0: 190, y1: 515, v0: 5700, v1: 9350 }; // chip Optimistis ±37 px di bawah pita judul
const SLOT3 = (PI3.x1 - PI3.x0) / IHSG_S02.length; // 11,3 px
const y3 = (v: number) => PI3.y1 - ((PI3.y1 - PI3.y0) * (v - PI3.v0)) / (PI3.v1 - PI3.v0);
const x3 = (k: number) => PI3.x0 + SLOT3 * (k + 0.5);
/** kondisi bisnis = garis landai 7.500 → 7.800 (ilustrasi nilai bisnis) */
const nilai3 = (x: number) => lerp(7500, 7800, (x - PI3.x0) / (PI3.x1 - PI3.x0));
const LILIN3 = { sela: 3.6, umur: 12 };
const mulai3 = (k: number) => T.ketiga + 92 + LILIN3.sela * k; // candle terakhir selesai ±T.saat − 15
const K_TAKUT = IHSG_S02.reduce((m, b, k) => (b.l < IHSG_S02[m].l ? k : m), 0);
const K_OPTIMIS = IHSG_S02.reduce((m, b, k) => (b.h > IHSG_S02[m].h ? k : m), 0);
const Isi3: React.FC<{ f: number }> = ({ f }) => {
  const jauh = cin(f, T.jauh + 30);
  const xT = x3(K_TAKUT), xO = x3(K_OPTIMIS), yT = y3(IHSG_S02[K_TAKUT].l), yO = y3(IHSG_S02[K_OPTIMIS].h);
  // garis "jauh" dari kondisi bisnis BERHENTI 8 px sebelum ujung sumbu candle ekstrem (tidak menembus badan candle); candle itu sendiri sisa jaraknya
  const yTujuT = y3(IHSG_S02[K_TAKUT].h) - 8, yTujuO = y3(IHSG_S02[K_OPTIMIS].l) + 8;
  return (
    <>
      <Chip x={1160} y={315} teks="Manfaatkan" ikon="disiplin" warna={CEK} p={popIn(f, T.manfaatkan)} size={30} />
      <Chip x={1160} y={395} teks="Ikuti emosi" ikon="emosi" warna={B.gray} p={popIn(f, T.ikuti)} coret={cin(f, T.emosinya)} size={30} />
      <svg width={PAPAN.w} height={PAPAN.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`translate(${PI3.x0} ${PI3.y0})`}><KisiLilin w={PI3.x1 - PI3.x0} h={PI3.y1 - PI3.y0} /></g>
        {IHSG_S02.map((b, k) => {
          const u = Math.max(0, Math.min(1, (f - mulai3(k)) / LILIN3.umur));
          return u <= 0 ? null : <BatangLilin key={b.t} c={tumbuh(b, u)} x={x3(k)} slot={SLOT3} Y={y3} sumbu={1.6} alfa={Math.min(1, u * 3)} />;
        })}
        <Penghubung d={`M ${PI3.x0} ${y3(nilai3(PI3.x0)).toFixed(1)} L ${PI3.x1} ${y3(nilai3(PI3.x1)).toFixed(1)}`} g={cin(f, T.jauh - 20)} warna={B.turq} titik={false} />
        {[[xT, yTujuT], [xO, yTujuO]].map(([x, y], k) => (
          <Penghubung key={k} d={`M ${x} ${y3(nilai3(x)).toFixed(1)} L ${x} ${y.toFixed(1)}`} g={jauh} warna={B.orange} titik={false} tebal={4} />))}
      </svg>
      <Chip x={xT} y={yT + 52} teks="Takut" ikon="panik" warna={B.orange} p={popIn(f, T.takut)} size={28} />
      <Chip x={xO} y={yO - 48} teks="Optimistis" ikon="rayakan" warna={B.orange} p={popIn(f, T.optimistis)} size={28} />
      {/* label garis di ATAS garis, tepat di atas titik terendah (di kiri bawah garis ada candle awal) */}
      <PilNominal x={xT} y={y3(nilai3(xT)) - 38} teks="Kondisi bisnis" arah={0} p={popIn(f, T.kondisi)} size={26} />
    </>);
};

/** 04: sepuluh perusahaan (5 × 2, berpusat di panel); kotak TERTUTUP "Yang kita pahami" melingkupi dua kolom pertama (dulu kurung terbuka di kiri),
 *  chip duduk di tengah tepi bawah kotak; sisanya meredup ("nggak harus punya pendapat tentang semua saham") */
const PERUSAHAAN: KunciIkon[] = ['ritel', 'sektorBank', 'konsumsi', 'telekomunikasi', 'energi', 'otomotif', 'properti', 'kesehatan', 'industri', 'listrik'];
const WARNA_P = [B.blue, B.turq, B.orange, B.blueLite, B.turqLite, B.orangeLite, B.blue, B.turq, B.orange, B.blueLite];
const Isi4: React.FC<{ f: number }> = ({ f }) => {
  const xs = [PX - 380, PX - 190, PX, PX + 190, PX + 380], ys = [250, 420], d = 120;
  const kotak = cin(f, T.pahami - 10), redup = cin(f, T.semua);
  const k0 = xs[0] - d / 2 - 36, k1 = xs[1] + d / 2 + 36, ka = ys[0] - d / 2 - 30, kb = ys[1] + d / 2 + 36, r = 24;
  return (
    <>
      <svg width={PAPAN.w} height={PAPAN.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d={`M ${(k0 + k1) / 2} ${ka} L ${k1 - r} ${ka} Q ${k1} ${ka} ${k1} ${ka + r} L ${k1} ${kb - r} Q ${k1} ${kb} ${k1 - r} ${kb} L ${k0 + r} ${kb} Q ${k0} ${kb} ${k0} ${kb - r} L ${k0} ${ka + r} Q ${k0} ${ka} ${k0 + r} ${ka} Z`}
          g={kotak} warna={CEK} titik={false} />
      </svg>
      {PERUSAHAAN.map((ik, k) => {
        const c = k % 5, rr = Math.floor(k / 5), dalam = c < 2;
        return <Bulat key={ik} x={xs[c]} y={ys[rr]} d={d} warna={WARNA_P[k]} ikon={ik} p={popIn(f, T.berinvestasi + 6 * k)} alfa={dalam ? 1 : 1 - 0.65 * redup} />;
      })}
      <Chip x={(k0 + k1) / 2} y={kb} teks="Yang kita pahami" ikon="alasan" warna={CEK} p={popIn(f, T.pahami + 20)} size={28} />
    </>);
};

/* ══════════════ SCENE ══════════════ */
export const Scene02: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL - 60 || f > Math.max(AKHIR + 70, KUIL_KE_KARTU() + 30)) return null;
  const m = 0; // kuil tidak lagi mengecil jadi peta (rombak 30 Okt)
  const buka = [0, 1, 2, 3].map((i) => bukaPanel(f, i) > 0);
  const semua = cin(f, T.empat2 + 40);
  return (
    <>
      {/* 30 Okt (Simon: "scene 2 kamu swipe ke atas juga bersamaan dengan animasi munculnya line, agar tidak terlihat tumpang tindih"): penggaris masuk
          dari bawah 820 px dalam 60 f yang SAMA dengan Scene 01 keluar ke atas (−820 px, berpusat AKHIR S01 + 22 = AWAL + 22) — jarak keduanya tetap,
          tidak bertumpuk; garis tetap trim dari tengah (dulu masuk di tempat, f T.bukan − 24, angka muncul di bawah kartu ICBP yang sedang keluar) */}
      {/* 2 Nov (Simon: "Timeline kurang kebawah (kurang center), saat ini terlihat terlalu keatas"): garis di LAYAR y 430 → 490 (450 + kamera +40) —
          kelompok tick + angka (465–622 layar) kini berpusat di tengah frame (543; dulu 483) */}
      <PenggarisTahun f={f} tahun={['2026', '2000', '1975', '1950', '1929']} y={450} masuk={AWAL + 22} naik={820} gulir={[T.th1929 - 50, T.th1929 + 10]} keluar={T.th1929 + 70}
        id="s02-tahun" jarak={520} angka={92} />
      {f >= T.th1929 ? <KartuKrisis f={f} /> : null}
      <Graham f={f} />
      {f >= T.intinya - 30 && f < KUIL_KE_KARTU() + 30 ? <Kuil f={f} m={m} semua={semua} fondasi={cin(f, T.fondasi)} buka={buka} jadiKartu={cin(f, KUIL_KE_KARTU())} /> : null}
      {[0, 1, 2, 3].map((i) => <PanelPrinsip key={i} f={f} i={i} />)}
    </>);
};
export const S02_T = T;
