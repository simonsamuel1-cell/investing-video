import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { gayaKamera, kamera, keLayar } from '../kamera';
import { INVESTOR11 } from '../s11/Scene11';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, F, GAP, io, LINE, R, WARNA } from '../theme';
import { Icon, LW, WordText, cin, glass, grow, lerp, KacaPembesar } from '../parts/kit';
import { popIn } from '../parts/pop';
import { PanahBadge } from '../parts/rantai';
import { KarakterLingkar, MURID_S06 } from '../parts/karakter';
import { Judul } from '../parts/judul';
import { PilNominal, rpMiliar, rpRibu } from '../parts/nominal';

/**
 * SCENE 10 — VOLATILITAS ≠ RISIKO · IDE VISUAL (7 Okt, VO v4). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "LEFT: PRICE ↑↓↑↓ → VOLATILITY · RIGHT: Business Deterioration · Permanent Loss · Forced Selling → RISK"
 *   TEXT   "Volatilitas = perubahan harga / Risiko = potensi kehilangan nilai secara permanen" (bergantian)
 * Satu panel "perjalanan harga" (naik-turun, ilustratif) menyempit jadi panel KIRI "Volatilitas"; panel KANAN "Risiko" berisi
 * tiga risiko sebenarnya. Naik = hijau, turun = merah.
 * Revisi 7–8 Okt (Simon): MASUK = isi Scene 09 menyusut (masker) ke TITIK AWAL garis harga; ADEGAN TANPA TEKS BARU — investor
 * menaiki garis harga seperti roller coaster ("perjalanannya nggak selalu nyaman", naik hari ini → turun besok); slot tiga risiko
 * disapu kaca pembesar ("risiko yang lebih penting untuk diperhatikan"); grafik mini tiap risiko (jatuh & tak kembali · turun pelan
 * jangka panjang · jual di titik terendah lalu harga pulih tanpa kita). Kamera pusat, jarak 16 px, pop berporos di tengah.
 */
export const S10 = BATAS.s10;
export const IDE_S10_AWAL = S10;

/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
const A0 = (w: string, at: number) => frasa(w, at) - 18;
const [pertumbuhan, nyaman, naik, ini, turun, besok, volatilitas, tapi, sama, risiko, menggambarkan, seberapa, naik2, turun2, risiko2,
  kehilangan, permanen, memburuk, terpaksa, tepat] = urut(['pertumbuhan', 'nyaman', 'naik', 'ini', 'turun', 'besok', 'volatilitas', 'tapi',
  'sama', 'risiko', 'menggambarkan', 'seberapa', 'naik', 'turun', 'risiko', 'kehilangan', 'permanen', 'memburuk', 'terpaksa', 'tepat'], S10);
const [menjual, buruk] = urut(['menjual', 'buruk'], terpaksa); // "terpaksa MENJUAL di waktu yang BURUK" → tombol Sell muncul · ditekan di lembah

/* ── panel ── */
type Kotak = { x: number; y: number; w: number; h: number };
const PENUH: Kotak = { x: 300, y: 220, w: 1320, h: 620 };
/* celah 120 px: lencana ≠ (Ø80) tidak menyentuh tepi kedua panel */
const KIRI: Kotak = { x: 130, y: 220, w: 770, h: 620 };
const KANAN: Kotak = { x: 1020, y: 220, w: 770, h: 620 };
const lerpK = (a: Kotak, b: Kotak, t: number): Kotak => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
/* HARGA = CANDLESTICK HARIAN RIIL (Simon 8 Okt: "di adegan ini ganti dengan candlestick"; dulu garis ilustratif): ADMR.JK harian
 * 12 Sep – 6 Nov 2025 (40 hari bursa, OHLC riil terverifikasi TradingView · Video 10 data/admrDaily.ts), naik +41 % dalam jangka itu tapi
 * naik-turun tiap hari. "Naik hari ini, lalu turun besok" = 21 Okt (hijau 1.275 → 1.370) lalu 22 Okt (merah 1.350 → 1.305). Sumbu tetap
 * tanpa angka (judul sumbu saja). Hijau = naik, merah = turun (ARAH). */
type OHLC = [number, number, number, number];
const HARIAN: OHLC[] = [
  [990, 1010, 990, 990], [1000, 1030, 1000, 1030], [1045, 1050, 1000, 1020], [1030, 1030, 1000, 1025], [1025, 1030, 1010, 1015], [1015, 1025, 990, 990], [995, 1000, 985, 995], [1000, 1040, 995, 1040],
  [1045, 1060, 1015, 1020], [1020, 1040, 1005, 1015], [1015, 1025, 1005, 1015], [1020, 1085, 1010, 1070], [1080, 1100, 1035, 1050], [1055, 1080, 1030, 1065], [1070, 1140, 1060, 1090], [1100, 1105, 1065, 1085],
  [1095, 1105, 1065, 1105], [1105, 1135, 1090, 1105], [1115, 1380, 1080, 1380], [1460, 1530, 1245, 1300], [1330, 1440, 1310, 1370], [1335, 1435, 1315, 1370], [1380, 1480, 1290, 1350], [1375, 1390, 1260, 1275],
  [1280, 1320, 1270, 1320], [1320, 1325, 1180, 1195], [1225, 1325, 1220, 1260], [1275, 1400, 1270, 1370], [1350, 1360, 1300, 1305], [1320, 1345, 1310, 1335], [1340, 1390, 1295, 1315], [1325, 1460, 1320, 1420],
  [1450, 1470, 1385, 1435], [1430, 1520, 1390, 1495], [1510, 1540, 1455, 1465], [1465, 1470, 1370, 1395], [1395, 1430, 1340, 1380], [1380, 1395, 1340, 1390], [1365, 1395, 1320, 1370], [1380, 1430, 1375, 1400],
];
const N = HARIAN.length;
const VMIN = Math.min(...HARIAN.map((b) => b[2])) - 12, VMAX = Math.max(...HARIAN.map((b) => b[1])) + 12;
/* SUMBU (aturan chart Scene 03 — Simon 7 Okt: "tambahkan label harga agar jelas maksud x axis dan y axisnya", angka harga TIDAK
 * ditampilkan karena ilustratif, isi SIMETRIS di panel): panel→sumbu-y = ujung sumbu-x→panel = 80 px; garis 45 px dari keduanya */
const sumbu = (k: Kotak) => ({ x: k.x + 80, right: k.x + k.w - 80, y: k.y + k.h - 100, top: k.y + 130 });
const xLilin = (k: Kotak, i: number) => { const a = sumbu(k); return a.x + 45 + (i * (a.right - a.x - 90)) / (N - 1); };
const yHarga = (k: Kotak, v: number) => { const a = sumbu(k); return a.y - 20 - ((v - VMIN) * (a.y - 20 - (a.top + 40))) / (VMAX - VMIN); };
/** titik PENUTUPAN candle i */
const titik = (k: Kotak, i: number) => ({ x: xLilin(k, i), y: yHarga(k, HARIAN[i][3]) });
/** PUNCAK candle i — jalur penunggang (duduk di atas candle) */
const puncakLilin = (k: Kotak, i: number) => ({ x: xLilin(k, i), y: yHarga(k, HARIAN[i][1]) });
/** titik awal grafik harga: isi Scene 09 menyusut ke sini (masker) */
export const AWAL_GARIS10 = { ...titik(PENUH, 0), r: 10 };
/* "naik hari ini (hijau), lalu turun besok (merah)": dua candle berurutan di sepertiga akhir */
const iP = 27, iL = 28;

/** tiga risiko — WARNA BERBEDA (Simon 8 Okt: konteks mirip → warna beda; turunan brand) */
const RISIKO: { teks: string; ikon: KunciIkon; at: number; jenis: 'permanen' | 'memburuk' | 'terpaksa'; col: string }[] = [
  { teks: 'Kehilangan nilai permanen', ikon: 'rugiPermanen', at: M('kehilangan', kehilangan), jenis: 'permanen', col: WARNA.oranyeMuda },
  { teks: 'Bisnis memburuk', ikon: 'bisnisMemburuk', at: M('memburuk', memburuk), jenis: 'memburuk', col: WARNA.ungu },
  { teks: 'Terpaksa menjual', ikon: 'terpaksaJual', at: M('terpaksa', terpaksa), jenis: 'terpaksa', col: WARNA.turkisMuda },
];
const JARAK = 16;
/* "Risiko yang lebih penting untuk diperhatikan justru:" → panel Volatilitas mundur, panel Risiko MELUAS ke tengah (fokus pindah ke risiko);
   tiap baris risiko: ikon · label · grafik besar di kolom kanan (rata) */
const FOKUS: Kotak = PENUH;
const BARIS_RISIKO = (k: number, b: Kotak = FOKUS) => ({ x: b.x + 110, y: b.y + 200 + k * 140 });
/* Simon 9 Okt: "adegan ini buat lebih menggambarkan scriptnya, transaksi menjual, bisnis yang mengalami penurunan, kehilangan secara permanen"
 * → kartu dilebarkan 380 → 560 (ruang kosong di antara label & kartu ±320 px) supaya muat zona NOMINAL di kanan tiap kartu. */
const GRAFIK = { w: 560, h: 124, x: FOKUS.x + FOKUS.w - 50 - 560 }; // 124: candle terbaca; celah antarkartu 16 px
const ZONA_NOMINAL = 164; // pil nominal rata kanan di dalam kartu (pil "▼ Rp200 rb" ±150 px; 132 terukur menimpa garis nilai awal)
/** penunggang baris "terpaksa menjual" di lembah pada akhir scene = pusat cakramnya (Ø40 border-box: left x−20, top y−44 → pusat y−24;
 *  terukur di render: (1380, 711,9) termasuk kamera dy 10). Scene 11 mendorong kamera ke sini — investor ini tokoh Scene 11. */
type JenisRisiko = 'permanen' | 'memburuk' | 'terpaksa';
/** jalur harga tiap risiko (pecahan tinggi grafik: 0 = atas = mahal, 1 = bawah = murah) */
const FY: Record<JenisRisiko, (t: number) => number> = {
  permanen: (t) => (t < 0.4 ? 0.2 + 0.05 * Math.sin(t * 20) : t < 0.55 ? 0.2 + (t - 0.4) / 0.15 * 0.65 : 0.85 + 0.02 * Math.sin(t * 30)),
  memburuk: (t) => 0.15 + 0.7 * t + 0.06 * Math.sin(t * 14),
  // turun BERTANGGA yang jelas sampai lembah (tombol Sell ditekan di sini), lalu pulih tanpa kita (dulu 3 candle pertama hampir datar)
  terpaksa: (t) => (t < 0.5 ? 0.15 + 0.7 * (t / 0.5) ** 1.3 : 0.85 - 0.75 * Math.sin(Math.PI * (t - 0.5))),
};
const N_MINI = 10; // 10 candle: badan ±19 px terbaca di kartu 380 px (16 candle = titik-titik, terukur di still)
/** candle mini ke-i (deterministik, tanpa acak): BUKA = tutup candle sebelumnya (seperti candle riil), TUTUP = jalur + riak; badan minimal
 *  0,12 tinggi (dulu banyak candle datar "+" karena jalurnya landai, terukur di still); rentang harga dirapatkan ke 40–100 % tinggi supaya
 *  penunggang (44 px di atas puncak) tetap di dalam kartu */
// dulu 0,4 + 0,6v (ruang penunggang 44 px di atas puncak) — penunggang dibuang (Simon 9 Okt) → rentang penuh supaya JATUH & LEMBAH terbaca
const RAPAT = (v: number) => 0.04 + 0.92 * v;
const tutupMini = (jenis: JenisRisiko, i: number): number => {
  if (i < 0) return RAPAT(FY[jenis](0));
  const o = tutupMini(jenis, i - 1), c = RAPAT(FY[jenis]((i + 1) / N_MINI)) + 0.05 * Math.sin(i * 2.7 + 1.1);
  return Math.abs(c - o) < 0.12 ? o + (c >= o ? 0.12 : -0.12) : c;
};
const lilinMini = (jenis: JenisRisiko, i: number) => {
  const o = tutupMini(jenis, i - 1), c = tutupMini(jenis, i), sb = 0.03 + 0.03 * Math.abs(Math.sin(i * 1.7 + 0.4));
  return { o, c, hi: Math.max(0, Math.min(o, c) - sb), lo: Math.min(1, Math.max(o, c) + sb * 0.8) };
};
const petakMini = (y: number) => {
  const pad = 18, w = GRAFIK.w - 2 * pad - ZONA_NOMINAL - 14, h = GRAFIK.h - 2 * pad;
  return { x0: GRAFIK.x + pad, y0: y - GRAFIK.h / 2 + pad, w, h, slot: w / N_MINI };
};
/** puncak candle (posisi duduk penunggang) di indeks pecahan u = pusat candle; antara dua candle diinterpolasi (gerak mulus) */
const puncakMini = (jenis: JenisRisiko, y: number, u: number) => {
  const { x0, y0, h, slot } = petakMini(y), k0 = Math.floor(u - 0.5), a = u - 0.5 - k0;
  const top = (k: number) => lilinMini(jenis, Math.max(0, Math.min(N_MINI - 1, k))).hi;
  return { x: x0 + u * slot, y: y0 + lerp(top(k0), top(k0 + 1), a) * h };
};
/** penunggang baris "terpaksa menjual" di lembah pada akhir scene = pusat cakramnya (Ø40: top = puncak − 44 → pusat = puncak − 24).
 *  Diturunkan dari candle lembah (indeks N/2 − 1) — Scene 11 mendorong kamera ke sini; investor ini tokoh Scene 11. */
const PENUNGGANG_AKHIR = (() => { const q = puncakMini('terpaksa', BARIS_RISIKO(2).y, N_MINI / 2 - 0.5); return { x: q.x, y: q.y - 24 }; })();
/* roller coaster: investor menaiki garis harga — awal → puncak (perjalanan bergelombang, "naik hari ini"), puncak → lembah ("turun besok") */
const NAIK_AT = { mulai: pertumbuhan + 62, puncak: ini, lembah0: A0('lalu', ini), lembah1: besok + 14, ayun0: A0('tapi', tapi), ayun1: turun2 + 40 };
const FOKUS_AT = A0('risiko', risiko2);
const LENSA = { mulai: FOKUS_AT + 50, selesai: A0('kehilangan', kehilangan) }; // sesudah panel meluas; selesai sebelum klausa risiko pertama

export const Scene10: React.FC<{ f: number }> = ({ f }) => {
  if (f < S10) return null;
  // KELUAR = milik Scene 11: DORONGAN KAMERA ke investor di lembah "terpaksa menjual" — masker lingkaran menyusut mengikuti investor
  // yang membesar ×3 dan bergeser ke posisinya di Scene 11 ("Makanya, saat harga turun…": dia tokoh scene itu). 50f.
  if (f >= BATAS.s11 + 52) return null;
  const ex = R(f, BATAS.s11, BATAS.s11 + 50, 0, 1, io);
  const kam = kamera('S10', f), kam11 = kamera('S11', BATAS.s11 + 50);
  const P = keLayar(kam, PENUNGGANG_AKHIR);
  const T = keLayar(kam11, INVESTOR11);
  const zm = Math.pow((INVESTOR11.d * kam11.z) / (40 * kam.z), ex); // penunggang (40 px × zoom S10) → investor Scene 11 (× zoom S11)
  const mk = { x: lerp(P.x, T.x, ex), y: lerp(P.y, T.y, ex) };
  const R0 = Math.max(...[[0, 0], [1920, 0], [0, 1080], [1920, 1080]].map(([x, y]) => Math.hypot(x - P.x, y - P.y))) + 12;
  const rM = lerp(R0, (INVESTOR11.d / 2) * kam11.z, ex);
  const masuk = cin(f, S10 + 40);
  const belah = cin(f, sama - 20); // panel penuh → kiri BERSAMA panel Risiko masuk di "…sama dengan risiko" (Simon 8 Okt: muncul di katanya)
  const pk = lerpK(PENUH, KIRI, belah);
  // Cek 12 Okt (frame diam): dulu 40 candle tergambar dalam 1 dtk di "pertumbuhan" (cin 60f) → chart DIAM ±5 dtk sepanjang "…nggak berarti
  // perjalanannya selalu nyaman" (penunggang roller coaster yang dulu bergerak dihapus Simon 9 Okt). Kini PERJALANAN harga tergambar
  // candle demi candle sepanjang klausa itu: laju tetap (linear di antara candle, tiap candle tumbuh inOut cubic) dari "pertumbuhan" − 20
  // sampai "nyaman" + 30.
  const garis = R(f, pertumbuhan - 20, nyaman + 30, 0, 1);
  const ax = cin(f, S10 + 80); // sumbu tumbuh sebelum garis harga
  const a = sumbu(pk);
  const pts = HARIAN.map((_, i) => puncakLilin(pk, i)); // puncak tiap candle (penanda ▲▼ & braket)
  const bw = ((sumbu(pk).right - sumbu(pk).x - 90) / (N - 1)) * 0.6;
  const amp = grow(f, seberapa + 10); // braket besar ayunan
  const kanan = cin(f, sama + 10);
  const fokus = R(f, FOKUS_AT, FOKUS_AT + 60, 0, 1, io); // panel Risiko meluas, Volatilitas mundur
  const kR = lerpK(KANAN, FOKUS, fokus);

  return (
    <>
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${rM}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama di atas Scene 11 */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s11, BATAS.s11 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${P.x}px ${P.y}px`, transform: `translate(${mk.x - P.x}px, ${mk.y - P.y}px) scale(${zm})` } : undefined}>
      <Judul f={f} kata={['Volatilitas', '=', 'perubahan harga']} at={M('menggambarkan', menggambarkan)} sorotAt={seberapa + 20} keluar={risiko2 + 20} />
      <Judul f={f} kata={['Risiko', '=', 'potensi', 'kehilangan', 'nilai', 'secara permanen']} at={M('kehilangan', kehilangan) + 20} sorotAt={permanen + 15} size={40} />
      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaKamera('S10', f, f >= BATAS.s11 - 30)}>

      {/* KELUAR (milik Scene 11): Simon 9 Okt "hapus saja icon orang di adegan saham" — penunggang candle dibuang; tokoh Scene 11 baru
          MUNCUL di lembah grafik "terpaksa menjual" saat dorongan kamera dimulai (Ø40 × zoom = investor Scene 11, serah-terima tanpa loncat) */}
      {/* Simon 12 Okt "ganti icon investor, dengan gambar orang berkemeja biru": tokoh = murid di lingkaran oranye, Ø40 × 3 = investor S11 */}
      {/* tokoh digambar DI LUAR masker (lihat bawah) */}
      {/* panel KIRI: perjalanan harga → volatilitas */}
      <AbsoluteFill style={{ opacity: 1 - fokus, transform: `translateX(${-140 * fokus}px)` }}>
      <div style={{ position: 'absolute', left: pk.x, top: pk.y, width: pk.w, height: pk.h, opacity: masuk, transform: `translateY(${(1 - masuk) * 40}px)`, ...glass(B.blue) }} />
      <AbsoluteFill style={{ opacity: masuk }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {ax > 0.001 ? (
            <g stroke={B.grayLite} strokeWidth={LW.main} strokeLinecap="round" fill="none">
              <line x1={a.x} x2={a.x} y1={a.y} y2={lerp(a.y, a.top, ax)} />
              <line x1={a.x} x2={lerp(a.x, a.right, ax)} y1={a.y} y2={a.y} />
              <path d={`M${a.x - 9} ${lerp(a.y, a.top, ax) + 12} L${a.x} ${lerp(a.y, a.top, ax)} L${a.x + 9} ${lerp(a.y, a.top, ax) + 12}`} />
              <path d={`M${lerp(a.x, a.right, ax) - 12} ${a.y - 9} L${lerp(a.x, a.right, ax)} ${a.y} L${lerp(a.x, a.right, ax) - 12} ${a.y + 9}`} />
            </g>) : null}
          {/* naik hari ini (hijau) → turun besok (merah): sorot di belakang candle-nya */}
          {[{ i: iP, g: grow(f, naik), col: ARAH.naik }, { i: iL, g: grow(f, turun), col: ARAH.turun }].map(({ i, g, col }) => g > 0.001 ? (
            <rect key={i} x={xLilin(pk, i) - bw / 2 - 9} y={yHarga(pk, HARIAN[i][1]) - 9} width={bw + 18} height={yHarga(pk, HARIAN[i][2]) - yHarga(pk, HARIAN[i][1]) + 18} rx={8} fill={col} opacity={0.18 * g} />) : null)}
          {/* candle tergambar kiri → kanan, tiap badan tumbuh dari harga buka ke tutup */}
          {HARIAN.map(([o, hi, lo, c], i) => {
            const t = io(Math.max(0, Math.min(1, garis * N - i)));
            if (t <= 0.001) return null;
            const warna = c >= o ? ARAH.naik : ARAH.turun, x = xLilin(pk, i), yo = yHarga(pk, o), yc = lerp(yo, yHarga(pk, c), t);
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={lerp(yo, yHarga(pk, hi), t)} y2={lerp(yo, yHarga(pk, lo), t)} stroke={warna} strokeWidth={2.5} strokeLinecap="round" />
                <rect x={x - bw / 2} y={Math.min(yo, yc)} width={bw} height={Math.max(2.5, Math.abs(yc - yo))} rx={2} fill={warna} />
              </g>);
          })}
          {/* volatilitas = seberapa besar harga bergerak naik & turun: braket di kanan ayunan */}
          {amp > 0.001 ? (() => {
            // di kanan ujung garis, bukan menempel lembah
            const x = pts[N - 1].x + bw / 2 + 28, y1 = yHarga(pk, HARIAN[iP][1]), y2 = yHarga(pk, HARIAN[iL][2]), m = (y1 + y2) / 2, h = (y2 - y1) / 2 * amp;
            return (
              <g stroke={B.night} strokeWidth={LINE.w} strokeLinecap="round" fill="none">
                <line x1={x} x2={x} y1={m - h} y2={m + h} />
                <line x1={x - 10} x2={x + 10} y1={m - h} y2={m - h} />
                <line x1={x - 10} x2={x + 10} y1={m + h} y2={m + h} />
              </g>);
          })() : null}
        </svg>
        {/* judul sumbu: "Harga saham" di ujung panah sumbu-y, "Waktu" di bawah ujung sumbu-x (tanpa angka — ilustratif) */}
        <div style={{ position: 'absolute', left: a.x + GAP, top: a.top, transform: 'translateY(-50%)', opacity: R(ax, 0.8, 1, 0, 1), fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>Harga saham</div>
        <div style={{ position: 'absolute', left: a.right - 300, width: 300, top: a.y + GAP, textAlign: 'right', opacity: R(ax, 0.8, 1, 0, 1), fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night }}>Waktu</div>
        <PanahBadge x={pts[iP].x} y={pts[iP].y - 30} d={42} naik p={popIn(f, ini)} flip={0} /> {/* tanpa penunggang: ▲ tepat di atas candle naik */}
        <PanahBadge x={pts[iL].x + 4} y={yHarga(pk, HARIAN[iL][2]) + 34} d={42} p={popIn(f, besok)} flip={0} />
        <JudulPanel x={pk.x + 34} y={pk.y + 44} teks="Volatilitas" ikon="naikTurunHarga" col={B.blue} p={popIn(f, M('volatilitas', volatilitas))} pulse={0} />
      </AbsoluteFill>
      </AbsoluteFill>
      {/* titik awal garis harga — isi Scene 09 menyusut ke sini (di luar pudar panel: tanpa loncatan saat serah-terima) */}
      {/* … lalu memudar saat garis sudah tergambar dari situ & penunggang naik (dulu tertinggal di kiri sampai akhir → kamera meleset 28 px) */}
      {f >= S10 + 52 && f < NAIK_AT.mulai + 10 ? <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><circle cx={titik(pk, 0).x} cy={titik(pk, 0).y} r={AWAL_GARIS10.r} fill={B.blue} opacity={1 - R(f, NAIK_AT.mulai - 40, NAIK_AT.mulai + 10, 0, 1, io)} /></svg> : null}

      {/* panel KANAN: risiko sebenarnya */}
      {kanan > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: kR.x, top: kR.y, width: kR.w, height: kR.h, opacity: kanan, transform: `translateX(${(1 - kanan) * 60}px)`, ...glass(B.orange) }} />
          <AbsoluteFill style={{ opacity: kanan }}>
            <JudulPanel x={kR.x + 34} y={kR.y + 44} teks="Risiko" ikon="risiko" col={B.orange} p={popIn(f, risiko)} pulse={0} />
            {/* "risiko yang lebih penting untuk diperhatikan justru:" — tiga slot putus-putus, disapu kaca pembesar, lalu terisi */}
            {RISIKO.map((r, k) => {
              // slot "?" = risiko yang belum diketahui: muncul bersama panel Risiko, ikut bergeser saat panel meluas (dulu panel kosong ±6 dtk)
              const slot = popIn(f, risiko + 40 + 20 * k) * (1 - R(f, r.at - 20, r.at + 10, 0, 1, io)); // pop (easeOutBack) bersama panel Risiko
              const { x, y } = BARIS_RISIKO(k, kR);
              return slot > 0.001 ? <div key={`s${k}`} style={{ position: 'absolute', left: x - 42, top: y - 42, width: 84, height: 84, borderRadius: '50%', border: `3px dashed ${B.grayLite}`, background: B.white, transform: `scale(${slot})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 40, fontWeight: 800, color: B.grayLite }}>?</div> : null;
            })}
            {RISIKO.map((r, k) => {
              const p = popIn(f, r.at);
              if (p <= 0.001) return null;
              const { x, y } = BARIS_RISIKO(k);
              return (
                <React.Fragment key={r.teks}>
                  <div style={{ position: 'absolute', left: x - 42, top: y - 42, width: 84, height: 84, borderRadius: '50%', background: r.col, display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 12px 26px -12px ${r.col}aa` }}>
                    <Icon name={r.ikon} size={50} color={B.white} />
                  </div>
                  <div style={{ position: 'absolute', left: x + 42 + JARAK, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', lineHeight: 1 }}>
                    <WordText halus f={f} at={r.at + 10} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{r.teks}</WordText>
                  </div>
                  <GrafikRisiko f={f} y={y} jenis={r.jenis} at={r.at + 40} col={r.col} />
                </React.Fragment>);
            })}
            <Lensa f={f} />
          </AbsoluteFill>
        </>) : null}
      {/* ≠ */}
      <TidakSama x={(KIRI.x + KIRI.w + KANAN.x) / 2} y={KIRI.y + KIRI.h / 2} p={popIn(f, sama) * (1 - fokus)} />
      </AbsoluteFill>
    </AbsoluteFill>
    </AbsoluteFill>
    {/* TOKOH (Simon 12 Okt "ganti icon investor, dengan gambar orang berkemeja biru"): murid di lingkaran oranye, muncul di lembah grafik lalu
        ikut dorongan kamera jadi investor S11. Digambar di RUANG LAYAR di luar masker (posisi = pusat masker `mk`, ukuran = Ø40 × zoom S10 ×
        dorongan `zm` → Ø120 × zoom S11 di akhir): kepala orang menyembul di atas lingkaran — di dalam masker kepalanya terpotong lengkung
        masker yang menyusut lalu muncul lagi saat serah-terima (cek 12 Okt). Seukuran investor S11 → raster foto sama saat serah-terima. */}
    {ex > 0 ? (
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 2 }}>
        <KarakterLingkar pose={MURID_S06} x={mk.x} y={mk.y} D={INVESTOR11.d * kam11.z} s={popIn(f, BATAS.s11 + 12, 24) * (40 * kam.z * zm) / (INVESTOR11.d * kam11.z)} warna={B.orange} />
      </div>) : null}
    </>);
};

/** kaca pembesar menyapu tiga slot risiko */
const Lensa: React.FC<{ f: number }> = ({ f }) => {
  const s = popIn(f, LENSA.mulai + 20) * (1 - R(f, LENSA.selesai - 10, LENSA.selesai + 20, 0, 1, io));
  if (s <= 0.001) return null;
  const u = R(f, LENSA.mulai + 30, LENSA.selesai - 10, 0, 2, io), k = Math.min(1, Math.floor(u)), r = u - k;
  const a = BARIS_RISIKO(k), b = BARIS_RISIKO(k + 1);
  const x = lerp(a.x, b.x, r) + 56, y = lerp(a.y, b.y, r) + 46, D = 86;
  return <KacaPembesar x={x} y={y} d={D} s={s} geserCss={(a, b) => `translate3d(${a}px, ${b + 0.03}px, 0) rotate(0.001deg)`} />; // dulu left/top: per piksel bulat
};

/** grafik mini tiap risiko (tanpa teks baru; nominal & tombol Sell boleh — bahasa yang sudah dipakai di Properti):
 *  · PERMANEN ("aset … bisa kehilangan nilainya secara permanen"): garis putus NILAI AWAL selebar kartu; harga datar → jatuh → datar rendah
 *    sampai ujung waktu; AREA MERAH di antara nilai awal & harga = nilai yang hilang, tetap terbuka sampai ujung (tak pernah tertutup).
 *    Nominal milik kita Rp1 jt → Rp200 rb ▼.
 *  · MEMBURUK ("apakah bisnisnya memburuk dalam jangka panjang"): BUKAN grafik harga — ikon perusahaan + batang LABA per tahun yang menyusut
 *    tahun demi tahun + garis tren merah ▼; nilai perusahaan Rp100 M → Rp40 M ▼ (miliar, aturan Simon).
 *  · TERPAKSA ("terpaksa MENJUAL di waktu yang BURUK … pengaturan dana kurang tepat"): harga jatuh ke lembah; tombol Sell muncul di
 *    "menjual", DITEKAN tepat di lembah ("buruk") → nominal berhenti di Rp400 rb ▼ (kita keluar di harga terendah); harga lalu pulih
 *    (candle pucat putus-putus) tanpa kita. Candle tetap candlestick (aturan Simon: candlestick untuk saham). */
const GrafikRisiko: React.FC<{ f: number; y: number; jenis: JenisRisiko; at: number; col: string }> = ({ f, y, jenis, at, col }) => {
  const p = popIn(f, at - 30);
  if (p <= 0.001) return null;
  const { x0, y0, w, h, slot } = petakMini(y);
  const bw = slot * 0.56;
  const terpaksa = jenis === 'terpaksa';
  // terpaksa: lembah tercapai SEBELUM "buruk" (tombol ditekan di lembah) → 5 candle dalam 60f; lainnya 10 candle dalam 100f
  const g = R(f, at, at + (terpaksa ? 60 : 100), 0, 1, io);
  const nMaks = terpaksa ? N_MINI / 2 : N_MINI;
  const v = g * nMaks; // jumlah candle tampil (pecahan = candle yang sedang tumbuh)
  const pulih = terpaksa ? R(f, at + 130, at + 230, 0, 1, io) : 0;
  const vPulih = N_MINI / 2 + pulih * (N_MINI / 2);
  const tutupKini = (n: number) => { const i = Math.max(0, Math.min(N_MINI - 1, Math.ceil(n) - 1)), L = lilinMini(jenis, i); return lerp(L.o, L.c, Math.min(1, n - i)); };
  const lilin = (i: number, frac: number, pucat: boolean) => {
    const L = lilinMini(jenis, i), c = lerp(L.o, L.c, frac), naik = L.c < L.o, cx = x0 + (i + 0.5) * slot;
    const atas = Math.min(L.o, c), bawah = Math.max(L.o, c), warna = pucat ? B.grayLite : naik ? ARAH.naik : ARAH.turun;
    return (
      <g key={`${pucat ? 'p' : 'l'}${i}`}>
        <line x1={cx} x2={cx} y1={y0 + lerp(atas, L.hi, frac) * h} y2={y0 + lerp(bawah, L.lo, frac) * h} stroke={warna} strokeWidth={2.5} strokeLinecap="round" />
        <rect x={cx - bw / 2} y={y0 + atas * h} width={bw} height={Math.max(2, (bawah - atas) * h)} rx={2} fill={pucat ? B.white : warna} stroke={pucat ? warna : 'none'} strokeWidth={pucat ? 2.5 : 0} strokeDasharray={pucat ? '4 3' : undefined} />
      </g>);
  };
  // nominal (pecahan tinggi → rupiah): harga awal = Rp1 jt
  const c0 = lilinMini(jenis, 0).o;
  const teksRb = (v: number) => (v >= 995 ? 'Rp1 jt' : rpRibu(Math.round(v / 10) * 10));
  const nomX = GRAFIK.x + GRAFIK.w - 18;
  let isi: React.ReactNode = null, nominal: React.ReactNode = null;
  if (jenis === 'permanen') {
    const yRef = y0 + c0 * h;
    const n = Math.max(0.001, v), xKini = x0 + Math.min(n, N_MINI) * slot;
    // area kerugian: dari candle pertama yang turun di bawah nilai awal sampai ujung candle yang sudah tergambar (lalu sampai ujung waktu)
    const pts: string[] = [];
    for (let i = 0; i < Math.ceil(n); i++) { const cc = i < Math.floor(n) ? lilinMini('permanen', i).c : tutupKini(n); pts.push(`${x0 + (i + 0.5) * slot},${y0 + Math.max(c0, cc) * h}`); }
    const ujung = R(f, at + 100, at + 140, 0, 1, io); // sesudah candle terakhir: kerugian TETAP terbuka sampai ujung waktu (garis kanan kartu)
    const xUjung = lerp(xKini, x0 + w, ujung);
    if (pts.length) pts.push(`${xUjung},${pts[pts.length - 1].split(',')[1]}`);
    const area = pts.length > 1 ? `M${x0 + 0.5 * slot},${yRef} L${pts.join(' L')} L${xUjung},${yRef} Z` : '';
    isi = (
      <>
        <line x1={x0} x2={x0 + w} y1={yRef} y2={yRef} stroke={B.gray} strokeWidth={2.5} strokeDasharray="7 7" strokeLinecap="round" opacity={R(f, at - 10, at + 20, 0, 1, io)} />
        {area ? <path d={area} fill={ARAH.turun} opacity={0.16} /> : null}
        {Array.from({ length: Math.ceil(v) }, (_, i) => lilin(i, Math.min(1, v - i), false))}
      </>);
    // nominal mengikuti JALUR HALUS (datar → jatuh di 40–55 % waktu), bukan tutup candle: dulu candle kecil ±0,12 membuat angka naik-turun
    // ±160 rb sebelum jatuh dan pil berganti netral → merah dalam 1 frame (lonjakan satu-frame f1561, terukur)
    const rp = 1000 - 800 * R(n / N_MINI, 0.4, 0.55, 0, 1, io);
    nominal = <PilNominal x={nomX} y={y} jangkar="kanan" teks={teksRb(rp)} arah={-R(rp, 600, 1000, 1, 0)} p={popIn(f, at)} size={22} />;
  } else if (jenis === 'memburuk') {
    // LABA per tahun menyusut — batang tumbuh satu per satu (30f, jenjang rata), lalu garis tren ▼
    const TINGGI_LABA = [1, 0.8, 0.63, 0.48, 0.34, 0.22], nB = TINGGI_LABA.length, xB0 = x0 + 74, sB = (x0 + w - xB0) / nB, wB = sB * 0.5;
    const dasar = y0 + h, langkah = 70 / (nB - 1), gb = TINGGI_LABA.map((_, k) => R(f, at + langkah * k, at + langkah * k + 30, 0, 1, io));
    const tren = R(f, at + 100, at + 140, 0, 1, io);
    const puncakB = (k: number) => ({ x: xB0 + (k + 0.5) * sB, y: dasar - TINGGI_LABA[k] * h * 0.92 });
    const t0 = puncakB(0), t1 = puncakB(nB - 1), tx = lerp(t0.x, t1.x, tren), ty = lerp(t0.y, t1.y, tren) - 12, a = Math.atan2(t1.y - t0.y, t1.x - t0.x);
    isi = (
      <>
        <line x1={xB0 - 6} x2={x0 + w} y1={dasar} y2={dasar} stroke={B.grayLite} strokeWidth={2.5} strokeLinecap="round" opacity={R(f, at - 10, at + 20, 0, 1, io)} />
        {gb.map((gk, k) => gk > 0.001 ? <rect key={k} x={puncakB(k).x - wB / 2} y={dasar - TINGGI_LABA[k] * h * 0.92 * gk} width={wB} height={TINGGI_LABA[k] * h * 0.92 * gk} rx={5} fill={col} /> : null)}
        {tren > 0.001 ? (
          <g stroke={ARAH.turun} strokeWidth={3} strokeLinecap="round" fill="none">
            <line x1={t0.x} y1={t0.y - 12} x2={tx} y2={ty} strokeDasharray="7 6" />
            {tren > 0.9 ? <path d={`M${tx + Math.cos(a) * 3} ${ty + Math.sin(a) * 3} L${tx - 12 * Math.cos(a) + 7 * Math.sin(a)} ${ty - 12 * Math.sin(a) - 7 * Math.cos(a)} L${tx - 12 * Math.cos(a) - 7 * Math.sin(a)} ${ty - 12 * Math.sin(a) + 7 * Math.cos(a)} Z`} fill={ARAH.turun} stroke="none" /> : null}
          </g>) : null}
      </>);
    // nilai perusahaan mengikuti laba yang tergambar: Rp100 M → Rp40 M
    const kemajuan = gb.reduce((s2, gk) => s2 + gk, 0) / nB, nilai = 100 - 60 * Math.max(0, (kemajuan * nB - 1) / (nB - 1));
    nominal = <PilNominal x={nomX} y={y} jangkar="kanan" teks={rpMiliar(nilai, 0)} arah={-R(nilai, 90, 100, 1, 0)} p={popIn(f, at)} size={22} />;
  } else {
    // terpaksa: nominal mengikuti harga sampai TOMBOL DITEKAN (lembah) — sesudahnya berhenti (kita sudah keluar), harga pulih tanpa kita
    // jalur halus turun bertangga (FY, monoton sampai lembah) → Rp1 jt … Rp400 rb; berhenti di lembah (kita sudah menjual)
    const nBeku = Math.min(v, N_MINI / 2), rp = 1000 - 600 * Math.max(0, (FY.terpaksa(nBeku / N_MINI) - FY.terpaksa(0)) / (FY.terpaksa(0.5) - FY.terpaksa(0)));
    isi = (
      <>
        {Array.from({ length: Math.ceil(v) }, (_, i) => lilin(i, Math.min(1, v - i), false))}
        {pulih > 0.001 ? Array.from({ length: Math.ceil(vPulih - N_MINI / 2) }, (_, j) => lilin(N_MINI / 2 + j, Math.min(1, vPulih - N_MINI / 2 - j), true)) : null}
      </>);
    nominal = <PilNominal x={nomX} y={y} jangkar="kanan" teks={teksRb(rp)} arah={-R(rp, 600, 1000, 1, 0)} p={popIn(f, at)} size={22} />;
  }
  return (
    <>
      <div style={{ position: 'absolute', left: GRAFIK.x, top: y - GRAFIK.h / 2, width: GRAFIK.w, height: GRAFIK.h, borderRadius: 20, background: B.white, border: `2.5px solid ${col}`, transform: `scale(${p})`, transformOrigin: 'center', boxShadow: `0 10px 24px -12px ${col}aa` }} />
      {p > 0.9 ? <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>{isi}</svg> : null}
      {jenis === 'memburuk' && p > 0.9 ? (
        <div style={{ position: 'absolute', left: x0 + 6, top: y - 28, width: 56, height: 56, borderRadius: '50%', background: B.blue, display: 'grid', placeItems: 'center', transform: `scale(${popIn(f, at - 10)})`, boxShadow: `0 10px 22px -10px ${B.blue}aa` }}>
          <Icon name="perusahaan" size={34} color={B.white} />
        </div>) : null}
      {terpaksa ? <TombolSell f={f} x={x0 + (N_MINI / 2 - 0.5) * slot} y={y - GRAFIK.h / 2 + 30} muncul={menjual} tekan={buruk} /> : null}
      {nominal}
    </>);
};

/** tombol Sell mini (bahasa tombol Sell Scene 05): pop di "menjual", DITEKAN (skala turun-naik 24f) di "buruk" — tepat saat harga di lembah;
 *  memudar menjelang dorongan kamera ke Scene 11 (investor muncul di lembah, tepat di bawah tombol) */
const TombolSell: React.FC<{ f: number; x: number; y: number; muncul: number; tekan: number }> = ({ f, x, y, muncul: m, tekan }) => {
  const p = popIn(f, m) * (1 - R(f, BATAS.s11 - 30, BATAS.s11, 0, 1, io));
  if (p <= 0.001) return null;
  const t = Math.sin(Math.PI * R(f, tekan - 8, tekan + 16, 0, 1, io)) * 0.12;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate3d(-50%, -50%, 0) scale(${p * (1 - t)}) rotate(0.001deg)`, background: ARAH.turun, color: B.white, borderRadius: 12, padding: '8px 24px', fontFamily: F, fontSize: 22, fontWeight: 800, lineHeight: 1, boxShadow: `0 ${8 - 30 * t}px 18px -8px ${ARAH.turun}aa` }}>Sell</div>);
};

/** judul di dalam panel (lingkaran ikon + teks) */
const JudulPanel: React.FC<{ x: number; y: number; teks: string; ikon: KunciIkon; col: string; p: number; pulse: number }> = ({ x, y, teks, ikon, col, p, pulse }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translateY(-50%) scale(${p + pulse})`, transformOrigin: 'center', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={36} color={B.white} /></div>
    <span style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>{teks}</span>
  </div>);

/** lencana ≠ */
const TidakSama: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: '50%', background: B.white, border: `3px solid ${B.night}`, transform: `scale(${p})`, display: 'grid', placeItems: 'center', boxShadow: `0 10px 24px -12px ${B.night}66` }}>
    <svg width={80} height={80} viewBox="0 0 80 80"><g fill={B.night}><rect x={22} y={28} width={36} height={7} rx={3.5} /><rect x={22} y={45} width={36} height={7} rx={3.5} /></g><line x1={50} y1={18} x2={30} y2={62} stroke={B.night} strokeWidth={7} strokeLinecap="round" /></svg>
  </div>);

export const S10_BEAT = { pertumbuhan, nyaman, naik, ini, turun, besok, volatilitas, tapi, sama, risiko, menggambarkan, seberapa, naik2, turun2, risiko2, kehilangan, permanen, memburuk, terpaksa, tepat };
