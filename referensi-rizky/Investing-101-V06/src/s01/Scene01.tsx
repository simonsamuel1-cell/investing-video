import React from 'react';
import { getInputProps } from 'remotion';
import { ARAH, B, CEK, F, R, bayanganKecil, lerp, mixHex, rgba } from '../theme';
import { Icon, SWIPE, blurArah, cin, cinV, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip } from '../parts/umum';
import { Kaca, Nomor, Penghubung } from '../parts/kaca';
import { Sosok, TepiSubtitle, type Pose } from '../parts/nyata';
import type { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 01 — Otak yang Sama, Dua Dunia (f0 – BATAS.s2). Ide: 04_Asset/Ide-Visual-Scene-01.md.
 * Simon 23 Okt: "jika kamu rasa kesulitan untuk mengeksekusinya buat ulang ide visualnya, goalsnya user/penonton yang tidak paham tentang investasi
 * dan video bisa paham ketika menonton baik dengan voicenya maupun tanpa voice". Tokoh dua versi yang bergerak (berjongkok, berlari, menekan tombol)
 * (27 Okt: papan A–D lama dihapus — Scene 01 = versi flat s01flat/; berkas ini tinggal papan E & F + waktu kata S01_T.)
 * TIDAK dibangun sebagai karakter ber-rig — diganti: OTAK (memory anchor) + dua JENDELA DUNIA. Lingkaran "Dulu" membesar jadi jendela padang
 * rumput (piktogram oranye ala lukisan gua), jendela yang SAMA berganti rona jadi "Hari ini" (grafik harga, komentar, tombol JUAL), lalu kembali
 * menjadi dua lingkaran + otak (= papan pembuka). Semua masuk dipusatkan di kata (±30f), pop easeOutBack 60f, gerak/pudar/tint inOut cubic 60f.
 */
const W = urut(['hal', 'dulu', 'membantu', 'manusia', 'bertahan', 'hidup', 'hari', 'ini', 'justru', 'rugi',
  'dulu', 'ketika', 'melihat', 'kelompoknya', 'berlari', 'manusia', 'langsung', 'ikut', 'berlari', 'reaksi', 'cepat', 'seperti', 'menyelamatkan', 'nyawa',
  'hari', 'ini', 'investor', 'melihat', 'orang', 'lain', 'menjual', 'saham', 'lalu', 'langsung', 'ikut', 'menjual', 'tetapi', 'reaksi', 'sama', 'justru',
  'membuatnya', 'rugi',
  'dua', 'dunia', 'berbeda', 'tapi', 'otak', 'bekerja', 'masih', 'sama',
  'video', 'membahas', 'tiga', 'kesalahan', 'paling', 'investor', 'mengambil', 'cepat', 'mengejar', 'naik', 'turun', 'menggunakan', 'leverage', 'berlebihan',
  'kita', 'nggak', 'mulai', 'saham', 'tapi', 'puluhan', 'tahun', 'lalu', 'karena', 'otak', 'paling', 'membantu', 'bertahan', 'hidup']);
let i = 0;
const n = () => W[i++];
const T = {
  hal: n(), dulu: n(), membantu: n(), manusia: n(), bertahan: n(), hidup: n(), hari: n(), ini: n(), justru: n(), rugi: n(),
  dulu2: n(), ketika: n(), melihat: n(), kelompok: n(), berlari: n(), manusia2: n(), langsung: n(), ikut: n(), berlari2: n(), reaksi: n(), cepat: n(),
  seperti: n(), selamat: n(), nyawa: n(),
  hari2: n(), ini2: n(), investor: n(), melihat2: n(), orang: n(), lain: n(), menjual: n(), saham: n(), lalu: n(), langsung2: n(), ikut2: n(), menjual2: n(),
  tetapi: n(), reaksi2: n(), sama: n(), justru2: n(), membuatnya: n(), rugi2: n(),
  dua: n(), dunia: n(), berbeda: n(), tapi: n(), otak: n(), bekerja: n(), masih: n(), sama2: n(),
  video: n(), membahas: n(), tiga: n(), kesalahan: n(), paling: n(), investor3: n(), mengambil: n(), cepat3: n(), mengejar: n(), naik: n(), turun: n(), menggunakan: n(),
  leverage: n(), berlebihan: n(),
  kita: n(), nggak: n(), mulai: n(), saham4: n(), tapi4: n(), puluhan: n(), tahun: n(), lalu4: n(), karena: n(), otak4: n(), paling4: n(), membantu4: n(),
  bertahan4: n(), hidup4: n(),
};
export const S01_T = T;
export const S01_AKHIR = BATAS.s2;

/* ── tata letak: pusat isi = 497 (tengah area di atas pita subtitle, ATURAN V05 22 Okt) ── */
/* PUSAT TIAP MOMEN (pindai mode ukur 23 Okt, target 960 × 497): baris lingkaran berpindah HANYA bersamaan pop benda berikutnya (aturan 23 Okt
 *  "tengah dulu, lalu memberi ruang"): A 480 → 448 saat chip muncul · D 480 → 560 saat judul muncul · F 497. */
const OTAK = { d: 210 };
const CY_F = 497;
const LABEL_DY = 88 + 16 + 20; // label di bawah lingkaran (jarak 16)
/* ── papan tiga kesalahan ── */
const GURU: Pose = { src: 'karakter/guru_menunjuk.png', w: 774, h: 1593, x0: 5, x1: 670, y0: 60, y1: 1581 };
const BARIS = { x: 750, w: 900, h: 132, y: [392, 552, 712] };
const KESALAHAN: { teks: string; ikon: KunciIkon; warna: string }[] = [
  { teks: 'Keputusan terlalu cepat', ikon: 'cepat', warna: B.blue },
  { teks: 'Kejar saat naik, panik saat turun', ikon: 'naikTurun', warna: B.turq },
  { teks: 'Leverage berlebihan', ikon: 'leverage', warna: B.orange },
];

/** kemajuan LINEAR 0…1 60f dipusatkan di `at` (untuk Sosok / pop yang easing-nya diberi komponen) */
const lin = (f: number, at: number) => R(f, at - 30, at + 30, 0, 1, (t) => t);

/** IKON DISEBUT (resep V05 22 Okt): diperbesar 12 % berporos di pusatnya + pendar (cincin glow terpisah) */
const Besar: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <div style={{ position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: s > 0.001 ? `scale(${1 + 0.12 * s})` : undefined }}>{children}</div>);

/** penanda arah harga ▲ naik (hijau) / ▼ turun (merah) — pengecualian warna Simon 7 Okt; lingkaran putih + outline, pop di pusatnya */
const Panah: React.FC<{ x: number; y: number; naik: boolean; p: number }> = ({ x, y, naik, p }) => p <= 0 ? null : (
  <div style={{ position: 'absolute', left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: '50%', background: B.white,
    border: `3px solid ${naik ? ARAH.naik : ARAH.turun}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(p)})`,
    transformOrigin: 'center', color: naik ? ARAH.naik : ARAH.turun, fontSize: 18, lineHeight: 1, fontFamily: F, fontWeight: 800,
    boxShadow: bayanganKecil(naik ? ARAH.naik : ARAH.turun) }}>{naik ? '▲' : '▼'}</div>);

/* ── REVISI SIMON 27 Okt 15.30 (papan E → F) ──
 * 1 "tambahkan box highlight berwarna biru brand untuk text 'Tiga kesalahan' … berikan aku preview warna putih dan tetap berwarna hitam"
 *   → kotak sorot turkis (#5CC8E3 = "biru brand") = tinta ±12 / ±20 px; tepi kiri kotak = tepi kiri kartu (x 300). Warna teks = input `tigaTeks`
 *   ('hitam' bawaan · 'putih') sampai Simon memilih. Kotak skala X 0 → 1 easeOutBack berporos di tengah, tanpa opacity, teks dimasker selebar kotak
 *   (resep KotakJudul S01 flat).
 * 2 "text dibawah 'Tiga kesalahan' ganti warnanya ke warna ungu brand" → #5F4DEE.
 * 3 "swipe kebawah semua visual tapi buat timing keluarnya terlihat tidak bersamaan, setelah transisinya berjalan setengah layar, pop up icon
 *   dari adegan selanjutnya muncul" → guru · kartu 03 · 02 · 01 · teks kecil · kotak judul swipe ke bawah 60f inOut cubic, berselang 6 f
 *   (bawah dulu → tak saling lewat); ikon Hari ini mulai pop tepat saat yang terakhir berangkat sudah menempuh setengah jalan.
 * 4 "untuk menggambarkan 'puluhan ribu tahun yang lalu' buat hitungan mundur dari tahun sekarang ke tahun sebelum masehi (seperti screenshoot)"
 *   → PENGGARIS TAHUN di bawah lingkaran: 2026 → 50.000 SM, bergulir ke kanan (tahun lama datang dari kiri), easeInOut, motion blur mendatar
 *   sebanding laju, tepi kiri-kanan memudar. Lingkaran Hari ini yang SAMA berganti rona & ikon jadi Dulu (lukisan gua) saat melewati 1 M.
 *   Garis putus-putus Hari ini → Dulu + label "Puluhan ribu tahun lalu" diganti penggaris ini. */
const IP_S01 = getInputProps() as { tigaTeks?: 'putih' | 'hitam' }; // Simon 27 Okt sore: "Gunakan A (warna putih)"
const TJ = { x: 300, y: 164, w: 442, h: 79, r: 16, padX: 20, padY: 12, tintaKiri: 1, tintaAtas: 16 };
const SUBJ_Y = TJ.y + TJ.h + 12; // teks kecil: tinta atas ±7 px di bawah tepi div → celah kotak → tinta ±19 px
/** urutan keluar E (bawah → atas): guru, kartu 03, 02, 01, teks kecil, kotak judul */
const KELUAR_E = 2496; // sesudah "berlebihan" (2466–2500)
/** keluar "tidak bersamaan" (Simon 29 Okt, brief outro: "biasanya aku membedakan titik akhir object itu berhenti alih alih membedakan keyframe
 *  mulainya") → SEMUA berangkat bersamaan di KELUAR_E, titik akhir berbeda: guru 36 f · kartu 03/02/01 41/46/50 f · teks kecil 55 f · kotak judul 60 f
 *  (yang paling bawah paling cepat → tidak saling lewat). Dulu: berangkat berselang 6 f. */
const DURASI_E = [36, 41, 46, 50, 55, 60];
const keluarE = (f: number, j: number) => cin(f, KELUAR_E + DURASI_E[j] / 2, DURASI_E[j]);
const ikonF = KELUAR_E + 30 + 30; // pop mulai saat transisi berjalan setengah (KELUAR_E + 30) → pusat pop KELUAR_E + 60
/** penggaris tahun */
/** Simon 27 Okt sore: "mungkin dikisaran zaman batu/era awal manusia modern" → 50.000 SM (Paleolitikum Atas, ± 50.000 tahun lalu manusia modern
 *  mulai berkembang luas = "puluhan ribu tahun yang lalu") */
const TAHUN = ['2026', '2025', '2024', '2000', '1500', '1000', '500', '1 M', '1.000 SM', '5.000 SM', '10.000 SM', '20.000 SM', '30.000 SM', '50.000 SM'];
const PG = { y: 610, jarak: 600, angka: 92, garis: 6, tick: 50 };
// lingkaran + chip naik DULU (2625–2685), baru penggaris masuk (2660–2720; chip sudah di atas garis) → gulir 2705–2765 → keluar 2775–2835
// (Simon 28 Okt "pastikan keyframe … konsisten": gulir 80 f → 60 f, pusat tetap 2735)
const tF = { naik: 2655, masuk: 2690, gulir: [2705, 2765] as [number, number], keluar: 2805 };
const Y_ATAS = 330; // lingkaran naik memberi ruang penggaris (blok 242–700, pusat ±471)
const tintaF = (f: number) => cin(f, (tF.gulir[0] + tF.gulir[1]) / 2); // 1 M lewat di tengah gulir → Hari ini jadi Dulu (60 f; dulu 40 f)

const Penggaris: React.FC<{ f: number }> = ({ f }) => {
  const masuk = cin(f, tF.masuk), keluar = cin(f, tF.keluar);
  // gerbang = batas FRAME (aturan 23): tick ber-pop LINEAR — ambang kemajuan ter-ease (masuk ≤ 0,001) membuatnya muncul di skala ±27 % (audit 28 Okt)
  if (f <= tF.masuk - 30 || f >= tF.keluar + 30) return null;
  const d = tF.gulir[1] - tF.gulir[0];
  const s = (TAHUN.length - 1) * cin(f, (tF.gulir[0] + tF.gulir[1]) / 2, d);
  const laju = cinV(f, (tF.gulir[0] + tF.gulir[1]) / 2, d); // 0…1 relatif puncak
  const blur = blurArah('x', 12 * laju);
  const dy = keluar * SWIPE; // `keluar` sudah inOut cubic (dulu di-ease dua kali: io(cin))
  const xs = (k: number) => 960 - (k - s) * PG.jarak;
  const tickP = skalaPop(popIn(f, tF.masuk)); // pop = kemajuan LINEAR → easeOutBack (dulu skalaPop(cin): easing dobel)
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(0, ${dy}px, 0)` }}>
      <defs>
        <linearGradient id="pgPudar" x1={0} x2={1920} y1={0} y2={0} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#fff" stopOpacity={0} /><stop offset={0.14} stopColor="#fff" stopOpacity={0} />
          <stop offset={0.32} stopColor="#fff" stopOpacity={1} /><stop offset={0.68} stopColor="#fff" stopOpacity={1} />
          <stop offset={0.86} stopColor="#fff" stopOpacity={0} /><stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="pgMasker" maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}><rect x={0} y={0} width={1920} height={1080} fill="url(#pgPudar)" /></mask>
      </defs>
      <g mask="url(#pgMasker)">
        <g filter={blur}>
          {/* garis: trim dari tengah ke luar (garis = trim path) — klip melebar, ruas tidak ikut gepeng */}
          <clipPath id="pgTrim"><rect x={960 - 980 * masuk} y={0} width={1960 * masuk} height={1080} /></clipPath>
          <g clipPath="url(#pgTrim)">
            {Array.from({ length: TAHUN.length + 3 }, (_, j) => j - 2).map((k) => (
              <rect key={k} x={xs(k + 1) + 26} y={PG.y - PG.garis / 2} width={PG.jarak - 52} height={PG.garis} rx={PG.garis / 2} fill={B.night} />))}
          </g>
          {TAHUN.map((th, k) => {
            const x = xs(k);
            if (x < -400 || x > 2320) return null;
            return (
              <g key={th}>
                <rect x={x - 5} y={PG.y - PG.tick / 2} width={10} height={PG.tick} rx={3} fill={B.night}
                  transform={`translate(${x} ${PG.y}) scale(${tickP}) translate(${-x} ${-PG.y})`} />
                <text x={x} y={PG.y + 54 + PG.angka * 0.74 + (1 - masuk) * 40} textAnchor="middle" fontFamily={F} fontSize={PG.angka} fontWeight={800}
                  letterSpacing="-0.01em" fill={B.night} opacity={masuk}>{th}</text>
              </g>);
          })}
        </g>
      </g>
    </svg>);
};

/** PAPAN E (guru + tiga kesalahan) & F (penggaris tahun → bertahan hidup) — bagian akhir Scene 01 (f ≈ 1592–3183), dipasang Scene 01 flat
 *  (s01flat/Scene01Flat.tsx). Papan lama A–D (otak + jendela dunia) DIHAPUS 27 Okt (Simon: "oh iya hapus scene 1 yang lama"). */
export const Scene01: React.FC<{ f: number }> = ({ f }) => {
  if (f >= S01_AKHIR) return null; // Scene 02 mengambil alih otak + lingkaran Dulu di frame yang sama

  /* ═════ PAPAN E — guru + tiga kesalahan ═════ */
  const guruP = lin(f, T.video + 10);
  const guruX = lerp(960, 1420, cin(f, T.tiga)); // guru masuk di tengah, menepi ke kanan bersamaan judul
  const barisP = [T.mengambil + 30, T.mengejar + 30, T.menggunakan + 30].map((a) => popIn(f, a));
  const naikP = popIn(f, T.naik), turunP = popIn(f, T.turun); // penanda ▲ / ▼ di kartu 02 (QA: diam 3,5 dtk sebelum kartu 03)
  const sx = skalaPop(popIn(f, T.tiga - 20)); // kotak sorot terbuka dulu, kata naik mulai "tiga"
  const putih = IP_S01.tigaTeks !== 'hitam';
  const turun = (j: number) => ({ position: 'absolute' as const, inset: 0, transform: `translate3d(0, ${keluarE(f, j) * SWIPE}px, 0)` }); // keluarE sudah inOut cubic (dulu io(cin) = easing dobel)

  /* ═════ PAPAN F — penggaris tahun mundur, lalu otak → bertahan hidup ═════ */
  const kiniF = popIn(f, ikonF);
  const sahamP = popIn(f, ikonF + 20) * popOut(f, (tF.gulir[0] + tF.gulir[1]) / 2);
  const coret = cin(f, T.tapi4 + 4);
  const naikF = cin(f, tF.naik); // lingkaran naik memberi ruang penggaris
  const geserF = cin(f, tF.keluar); // lalu ke kanan (penggaris keluar), memberi ruang untuk otak
  const xF = lerp(960, 1200, geserF), yF = lerp(lerp(CY_F, Y_ATAS, naikF), CY_F, geserF);
  const tint = tintaF(f);
  const otakF = popIn(f, T.otak4);
  const garisF2 = cin(f, T.otak4 + 40);
  const sorotOtakF = cin(f, T.paling4);
  const apiF = cin(f, T.bertahan4 - 10); // ikon lukisan gua → api unggun (tint ikon lewat dua lapis)
  const hidupP = popIn(f, T.hidup4 + 10);
  const warnaF = mixHex(B.turq, B.orange, tint);

  return (
    <>
      {/* ── penghubung (SVG layar penuh) ── */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d={`M ${720 + 112} ${CY_F} L ${xF - 102} ${CY_F}`} g={f >= T.otak4 - 30 ? garisF2 : 0} warna={B.orange} titik={false} />
      </svg>

      {/* ═════ E ═════ */}
      {f >= T.video - 40 && f < KELUAR_E + 70 ? (
        <TepiSubtitle>
          <div style={turun(5)}>
            {sx > 0.01 ? (
              <div style={{ position: 'absolute', left: TJ.x, top: TJ.y, width: TJ.w, height: TJ.h, borderRadius: TJ.r, background: B.turq, overflow: 'hidden',
                transform: `scaleX(${sx})`, transformOrigin: 'center', boxShadow: bayanganKecil(B.turq) }}>
                <div style={{ position: 'absolute', left: TJ.padX - TJ.tintaKiri, top: TJ.padY - TJ.tintaAtas, whiteSpace: 'nowrap',
                  transform: `scaleX(${1 / sx})`, transformOrigin: `${TJ.w / 2 - TJ.padX + TJ.tintaKiri}px 0` }}>
                  <WordText f={f} at={T.tiga} style={{ fontFamily: F, fontSize: 58, fontWeight: 800, color: putih ? B.white : B.night, letterSpacing: '-.01em' }}>
                    Tiga kesalahan</WordText>
                </div>
              </div>) : null}
          </div>
          <div style={turun(4)}>
            <div style={{ position: 'absolute', left: TJ.x, top: SUBJ_Y, whiteSpace: 'nowrap' }}>
              <WordText f={f} at={T.paling + 20} style={{ fontFamily: F, fontSize: 34, fontWeight: 700, color: B.blue }}>yang paling sering dilakukan investor</WordText>
            </div>
          </div>
          {KESALAHAN.map((k, j) => (
            <div key={k.teks} style={turun(3 - j)}>
              <Kaca x={BARIS.x} y={BARIS.y[j]} w={BARIS.w} h={BARIS.h} p={barisP[j]} warna={k.warna} tab="kiri">
                <Nomor x={78} y={BARIS.h / 2} n={j + 1} warna={k.warna} p={1} d={64} />
                <Bulat x={188} y={BARIS.h / 2} d={86} warna={k.warna} ikon={k.ikon} p={1} />
                <div style={{ position: 'absolute', left: 258, top: 0, height: BARIS.h, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 32, fontWeight: 800,
                  color: B.night, whiteSpace: 'nowrap' }}>{k.teks}</div>
                {j === 1 ? <>
                  <Panah x={BARIS.w - 46} y={BARIS.h / 2 - 24} naik p={naikP} />
                  <Panah x={BARIS.w - 46} y={BARIS.h / 2 + 24} naik={false} p={turunP} />
                </> : null}
              </Kaca>
            </div>))}
          <div style={turun(0)}><Sosok pose={GURU} x={guruX} kaki={1010} h={800} p={guruP} /></div>
        </TepiSubtitle>) : null}

      {/* ═════ F ═════ */}
      {f >= ikonF - 40 ? (
        <>
          <Penggaris f={f} />
          <Bulat x={xF} y={yF} d={176} warna={warnaF} ikon="ponselGrafik" p={kiniF} ikonAlfa={1 - tint} />
          {tint > 0.001 ? <div style={{ position: 'absolute', left: xF - 176 * 0.27, top: yF - 176 * 0.27, opacity: tint * (1 - apiF) }}>
            <Icon name="lukisanGua" size={176 * 0.54} color={B.orange} /></div> : null}
          {apiF > 0.001 ? <div style={{ position: 'absolute', left: xF - 176 * 0.27, top: yF - 176 * 0.27, opacity: apiF }}>
            <Icon name="apiUnggun" size={176 * 0.54} color={B.orange} /></div> : null}
          <Chip x={xF} y={yF + LABEL_DY} teks="Saham" ikon="saham" warna={B.turq} p={sahamP} coret={coret} />
          <Besar x={720} y={CY_F} s={sorotOtakF}><Bulat x={720} y={CY_F} d={OTAK.d} warna={B.blue} ikon="otak" p={otakF} /></Besar>
          {sorotOtakF > 0.001 ? <div style={{ position: 'absolute', left: 720 - OTAK.d / 2 - 14, top: CY_F - OTAK.d / 2 - 14, width: OTAK.d + 28, height: OTAK.d + 28,
            borderRadius: '50%', boxShadow: `0 0 ${36 * sorotOtakF}px ${10 * sorotOtakF}px ${rgba(B.blue, 0.22)}`, transform: `scale(${skalaPop(otakF)})` }} /> : null}
          <Chip x={1200} y={CY_F + LABEL_DY} teks="Bertahan hidup" ikon="tersedia" warna={CEK} p={hidupP} />
        </>) : null}
    </>);
};
