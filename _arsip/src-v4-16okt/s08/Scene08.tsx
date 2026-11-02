import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { ARAH, B, F, GAP, HOUSE, LINE, R, WARNA, io } from '../theme';
import { Icon, WordText, cin, grow, lerp } from '../parts/kit';
import { INVESTOR_JAS, KarakterLingkar, MURID_S06 } from '../parts/karakter';
import { popIn } from '../parts/pop';
import { Konektor, SimpulBab } from '../parts/rantai';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { Vinyet } from '../parts/vinyet';
import { LembarUang } from '../parts/uang';
import { CINCIN_LUAR, Gedung, GedungLingkar, type KunciGedung } from '../parts/gedung';
import { Judul } from '../s03/Scene03';
import { PilNominal, rpJuta, rpMiliar } from '../parts/nominal';
import { ISI_D, SAHAM7, SAHAM_ANGKAT } from '../s07/Scene07';
import { UBIN_SAHAM9 } from '../s09/Scene09';

/**
 * SCENE 08 — SAHAM. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "STOCK ↓ OWNERSHIP IN A COMPANY ↓ Products / Services ↓ Revenue ↓ Profit"
 *   TEXT   "Saham / adalah bagian dari kepemilikan bisnis"
 * Revisi 7 Okt: perpindahan peta bab (ikon Saham dari keranjang Scene 07 mengisi slot bab 06); Emas ≠ Saham; perusahaan terbentuk di
 * sekeliling simpul Saham yang menjadi potongan oranye (bagian yang kita beli); pemilik kecil; rantai Produk & layanan → Pendapatan → Laba.
 * Revisi 8 Okt (Simon: "konteksnya diperjelas · ganti line chart ke candlestick (realistis) · tambahkan illustrasi bisnis berkembang ·
 * perbesar visual · setiap visual center · hapus animasi yang tidak diperlukan"):
 *   - "Kalau bisnisnya terus berkembang" → ILUSTRASI TOKO (stok Flowbite, ungu brand) tumbuh kecil → sedang → besar di atas sumbu waktu;
 *     "nilai bagian … ikut bertumbuh dalam jangka panjang" → GRAFIK BATANG hijau (Simon: "gunakan graphic seperti yang ada di properti
 *     tapi jangan buat identik") di bawahnya pada sumbu waktu yang SAMA; nilai = label ikon perusahaan di ujung kanan (Simon: "ganti
 *     piechartnya dengan icon perusahaan"), naik & membesar mengikuti puncak batang terbaru
 *   - sisipan berlatar penuh krim (pola Properti/Obligasi), menutup = transisi keluar tanpa area putih (`keluar`)
 *   - uang di rantai = lembar hijau (aset Simon), satu aliran di kata "pendapatan" & "laba" (dulu dua gelombang koin oranye)
 *   - dibuang: perusahaan berputar satu putaran, perusahaan membesar 10 %, gelombang koin kedua; nomor bab "06" dihapus
 *   - rantai (Simon 8 Okt: "3 icon … produk, layanan, dan laba buat warnanya berbeda dengan icon lainnya, dan juga buat muncul satu persatu
 *     sesuai dengan voicenya"): Produk & layanan + Pendapatan TURKIS, Laba OREN (ikon lain biru); tiap ikon muncul DI KATANYA; perusahaan
 *     bergeser bertahap saat Pendapatan & Laba muncul supaya susunan tetap berpusat (terukur); kamera diam
 */
export const S8 = BATAS.s8;
export const IDE_S08_AWAL = S8;

// urutan = urutan UCAPAN
// "…pemilik kecil dari PERUSAHAAN tersebut. PERUSAHAAN menjual…" → dua "perusahaan" berturut-turut; yang dipakai = yang kedua
const [saham, saat, kita, bagian, artinya, kita2, pemilik, , perusahaan3, produk, , pendapatan, laba, kalau, bisnisnya, nilai, bertumbuh, jangka] =
  urut(['saham', 'saat', 'kita', 'bagian', 'artinya', 'kita', 'pemilik', 'perusahaan', 'perusahaan', 'produk', 'lalu', 'pendapatan', 'laba', 'kalau',
    'bisnisnya', 'nilai', 'bertumbuh', 'jangka'], S8);
/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── geometri (dunia = layar, kamera diam) ── */
const JARAK = 16;
const NODE = { x: 960, y: 512, d: 200 }; // simpul + nama di bawahnya berpusat di y 540
const BANDING = { emas: { x: 720, y: 512 }, saham: { x: 1200, y: 512 } };
const PIE_R = 190;
/** tiga posisi perusahaan: sendirian (tengah) · bersama pemilik kecil · bersama rantai (terukur: tiap susunan berpusat di 960, 540) */
const PIE0 = { x: 960, y: 526 }, PIE1 = { x: 755, y: 574 }, PIE15 = { x: 679, y: 574 }, PIE2 = { x: 551, y: 574 }; // 15 = sesudah Pendapatan muncul
const SLICE = { a0: -90, a1: -45 }; // potongan "bagian" di kanan-atas
const rad = (d: number) => (d * Math.PI) / 180;
const MID = rad((SLICE.a0 + SLICE.a1) / 2);
const potongDi = (p: { x: number; y: number }) => ({ x: p.x + Math.cos(MID) * PIE_R * 0.66, y: p.y + Math.sin(MID) * PIE_R * 0.66 });
const PEMILIK = { dx: 330, dy: -210, d: 110 }; // relatif ke pusat perusahaan. dy −210 (dulu −250): kepala orang menyembul 40 px di atas lingkaran (Simon 12 Okt, ikon → gambar investor) → puncak susunan tetap di tempat lama, kamera tak perlu bergeser (kepala sempat masuk area judul saat kamera mengejar, terukur)
const RD = 120;
const RANTAI = [
  { teks: 'Produk & layanan', ikon: 'produkLayanan' as KunciIkon, dx: 388, col: B.turq },
  { teks: 'Pendapatan', ikon: 'pendapatan' as KunciIkon, dx: 668, col: WARNA.langit }, // tiga warna berbeda (Simon: konteks mirip → warna beda)
  { teks: 'Laba', ikon: 'bisnisLaba' as KunciIkon, dx: 948, col: B.orange },
];

/* ── waktu (frame global) ── */
const TIBA = saham; // ikon Saham (terbang dari keranjang) tiba di slot bab 06
const TENGAH = TIBA + 90; // PembukaBab: simpul tiba di posisi banding pada isiAt+90
const BANDING_AT = TENGAH - 50; // emas di kiri muncul SAAT simpul Saham meluncur ke kanan (terukur: dulu simpul sendirian di kanan, +349 px)
const KE_BALIK = A0('saat', saat); // "saat membeli saham": emas pergi, simpul Saham kembali ke tengah
const PIE_AT = A0('kita', kita); // "kita membeli bagian dari sebuah perusahaan…": perusahaan terbentuk di sekeliling simpul
const PEMILIK_AT = A0('kita', kita2);
const GESER1 = PEMILIK_AT - 10; // perusahaan bergeser BERSAMA pemilik kecil muncul (terukur: dulu 1 dtk lebih dulu → −270 px)
const RANTAI_ON = [produk, pendapatan, laba]; // tiap simpul rantai MUNCUL di katanya (pop berpusat di kata)
void perusahaan3;
const V = { buka: A0('kalau', kalau) };

export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < S8) return null;
  // KELUAR = milik Scene 09: MASKER LINGKARAN — seluruh isi menyusut ke ubin Saham pembuka Scene 09, berubah oranye + ikon saham. 50f.
  if (f >= BATAS.s9 + 52) return null;
  const ex = R(f, BATAS.s9, BATAS.s9 + 50, 0, 1, io);
  const kam9 = kamera('S09', BATAS.s9 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam9, UBIN_SAHAM9), r: (UBIN_SAHAM9.d / 2) * kam9.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  const kam = kamera('S08', f);

  /* perusahaan: tengah → (pemilik) → (rantai) */
  const g1 = R(f, GESER1, GESER1 + 60, 0, 1, io);
  // geser bertahap bersama ikon rantai yang muncul: Pendapatan (→ PIE15) lalu Laba (→ PIE2); Produk & layanan muat tanpa geser
  const g15 = R(f, pendapatan - 70, pendapatan - 10, 0, 1, io), g2 = R(f, laba - 70, laba - 10, 0, 1, io); // bersama panahnya (tumbuh di kata−40)
  const P = { x: PIE0.x + (PIE1.x - PIE0.x) * g1 + (PIE15.x - PIE1.x) * g15 + (PIE2.x - PIE15.x) * g2, y: lerp(PIE0.y, PIE1.y, g1) };
  /* simpul Saham: kanan (banding) → tengah → masuk potongan */
  const banding = 1 - R(f, KE_BALIK, KE_BALIK + 60, 0, 1, io);
  const kePotong = R(f, PIE_AT, PIE_AT + 60, 0, 1, io);
  const potong0 = potongDi(PIE0);
  const nx = lerp(lerp(NODE.x, BANDING.saham.x, banding), potong0.x, kePotong), ny = lerp(lerp(NODE.y, BANDING.saham.y, banding), potong0.y, kePotong);
  const nd = lerp(NODE.d, 70, kePotong);
  const potong = popIn(f, bagian + 15); // potongan berubah oranye
  const opNode = 1 - R(f, bagian + 20, bagian + 45, 0, 1, io); // simpul diserap potongan
  const opEmas = popIn(f, BANDING_AT + 30) * (1 - R(f, KE_BALIK, KE_BALIK + 40, 0, 1, io));
  const pie = cin(f, PIE_AT + 30);
  const labelBab = cin(f, TENGAH + 20) * (1 - R(f, PIE_AT, PIE_AT + 30, 0, 1, io));
  const pPemilik = popIn(f, PEMILIK_AT + 30);
  const POT = potongDi(P);
  const PEM = { x: P.x + PEMILIK.dx, y: P.y + PEMILIK.dy };

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama di atas Scene 09 */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s9, BATAS.s9 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* ISI — kamera (translate3d + rotasi mikro); judul digambar SESUDAHNYA supaya tetap di atas latar sisipan */}
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s9 - 30)}>
        {/* ═════ pembuka bab: peta bab → simpul bab 06 (diisi ikon Saham dari keranjang) meluncur LANGSUNG ke posisi banding (kanan) ═════ */}
        <PembukaBab f={f} s0={S8} k={5} isiAt={TIBA} tengah={{ ...BANDING.saham, d: NODE.d }} selesai={TENGAH} isiLuar={f >= TIBA ? 1 : 0} />

        {/* nama bab (ikut simpul saat banding) */}
        {labelBab > 0.001 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 400, transform: `translate3d(${nx - 200}px, ${ny + NODE.d / 2 + JARAK}px, 0) rotate(0.001deg)`, textAlign: 'center', opacity: labelBab, lineHeight: 1 }}>
            <WordText halus f={f} at={TENGAH + 20} style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>Saham</WordText>
          </div>) : null}

        {/* emas ≠ saham */}
        {opEmas > 0.001 ? (
          <>
            <SimpulBab x={BANDING.emas.x} y={BANDING.emas.y} d={NODE.d} col={B.turq} ikon="emas" isi={popIn(f, BANDING_AT + 30)} op={opEmas} />
            <div style={{ position: 'absolute', left: BANDING.emas.x - 200, width: 400, top: BANDING.emas.y + NODE.d / 2 + JARAK, textAlign: 'center', opacity: opEmas, lineHeight: 1 }}>
              <WordText halus f={f} at={BANDING_AT + 40} style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>Emas</WordText>
            </div>
            <TidakSama x={(BANDING.emas.x + BANDING.saham.x) / 2} y={BANDING.saham.y} p={popIn(f, BANDING_AT + 50)} op={opEmas} />
          </>) : null}

        {/* perusahaan = lingkaran berpotongan, terbentuk di sekeliling simpul Saham; potongan oranye = bagian yang kita beli */}
        {pie > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: pie, transform: `${geser(P.x - PIE0.x, P.y - PIE0.y)} scale(${lerp(0.9, 1, pie)})`, transformOrigin: `${PIE0.x}px ${PIE0.y}px` }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              {Array.from({ length: 8 }, (_, k) => {
                const a0 = -90 + k * 45, a1 = a0 + 45, isBagian = k === 0;
                const keluar = isBagian ? 16 * Math.min(1, potong) : 0;
                const mid = rad((a0 + a1) / 2), ox = Math.cos(mid) * keluar, oy = Math.sin(mid) * keluar, rr = PIE_R;
                const p0 = [PIE0.x + ox + Math.cos(rad(a0)) * rr, PIE0.y + oy + Math.sin(rad(a0)) * rr];
                const p1 = [PIE0.x + ox + Math.cos(rad(a1)) * rr, PIE0.y + oy + Math.sin(rad(a1)) * rr];
                const dPath = `M${PIE0.x + ox} ${PIE0.y + oy} L${p0[0]} ${p0[1]} A${rr} ${rr} 0 0 1 ${p1[0]} ${p1[1]} Z`;
                return (
                  <g key={k}>
                    <path d={dPath} fill={k % 2 ? B.blue : B.blueLite} stroke={B.white} strokeWidth={4} />
                    {isBagian && potong > 0.001 ? <path d={dPath} fill={B.orange} fillOpacity={Math.min(1, potong)} stroke={B.white} strokeWidth={4} /> : null}
                  </g>);
              })}
              <circle cx={PIE0.x} cy={PIE0.y} r={92} fill={B.white} />{/* Simon 12 Okt "perbesar gambar gedungnya": r 72 → 92 (ikon pemilik di r 125 ± 22 → jarak 11) */}
            </svg>
            {/* Simon 9 Okt "visual lebih menggambarkan script": "kita menjadi SALAH SATU pemilik kecil" — tiap potongan punya PEMILIKNYA
                (ikon orang putih di dalam potongan, pop berjenjang di "salah satu pemilik"); potongan oranye = milik kita, bergaris putus ke
                "Pemilik kecil". Tanpa teks baru. */}
            {Array.from({ length: 8 }, (_, k) => {
              const ps = popIn(f, pemilik - 26 + (k === 0 ? 0 : 6 + 5 * k), 30);
              if (ps <= 0.001) return null;
              // Simon 12 Okt "ganti icon investor, dengan gambar orang berkemeja biru" (ikon orang putih di tiap potongan): pemilik = ORANG di
              // lingkaran putih Ø48 (gaya Scene 1, kepala menyembul). Potongan kita (oranye) = murid berkemeja biru (= "Pemilik kecil"); potongan
              // lain = investor berjas ("investor lain", sama dengan pembeli S06). r 0,66 → 0,71 R: kepala potongan bawah tetap di luar lingkaran
              // putih inti (r 92) dan gedungnya.
              const mid = rad(-90 + k * 45 + 22.5), keluar = k === 0 ? 16 * Math.min(1, potong) : 0, r = PIE_R * 0.71 + keluar;
              return <KarakterLingkar key={`o${k}`} pose={k === 0 ? MURID_S06 : INVESTOR_JAS} x={PIE0.x + Math.cos(mid) * r} y={PIE0.y + Math.sin(mid) * r} D={48} s={ps} warna={B.white} />;
            })}
            {/* Simon 12 Okt "ganti illustrasi gedung disini dengan gedung kecil" → "perbesar gambar gedungnya" → "perbesar gedung ini sampai
                sedikit menimpah piechart": inti cakram = foto gedung kecil (sama dengan gedung tahap 1 di adegan pertumbuhan), tinggi 165
                (dulu 96 → 122) — sudutnya keluar ±27 px dari lingkaran putih Ø184 menimpa potongan; ikon pemilik (r 125 ± 22) tetap 6–10 px
                di luar gedung. Dulu ikon perusahaan biru. */}
            <Gedung k="kecil" x={PIE0.x} dasar={PIE0.y + 84} h={165} s={popIn(f, PIE_AT + 50)} />
            <div style={{ position: 'absolute', left: PIE0.x - 200, width: 400, top: PIE0.y + PIE_R + JARAK, textAlign: 'center', lineHeight: 1 }}>
              <WordText halus f={f} at={PIE_AT + 60} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Perusahaan</WordText>
            </div>
            {/* nominal: value perusahaan (miliar) di kanan namanya */}
            <PilNominal x={PIE0.x + 112} y={PIE0.y + PIE_R + JARAK + 17} jangkar="kiri" teks={rpMiliar(100, 0)} arah={0} p={popIn(f, PIE_AT + 75)} size={24} />
          </div>) : null}

        {/* pemilik kecil: garis putus dari potongan kita */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {grow(f, PEMILIK_AT + 20) > 0.001 ? (
            <line x1={POT.x + 44} y1={POT.y - 38} x2={lerp(POT.x + 44, PEM.x - PEMILIK.d / 2 - GAP, grow(f, PEMILIK_AT + 20))} y2={lerp(POT.y - 38, PEM.y, grow(f, PEMILIK_AT + 20))}
              stroke={B.orange} strokeWidth={LINE.w} strokeDasharray={LINE.dash} strokeLinecap="round" />) : null}
          {/* rantai mendatar: perusahaan → produk & layanan → pendapatan → laba */}
          {RANTAI.map((r, i) => {
            const x1 = i === 0 ? P.x + PIE_R + GAP : P.x + RANTAI[i - 1].dx + RD / 2 + GAP, x2 = P.x + r.dx - RD / 2 - GAP;
            return <Konektor key={i} x1={x1} y1={P.y} x2={x2} y2={P.y} g={grow(f, RANTAI_ON[i] - 40)} col={r.col} />;
          })}
        </svg>
        {/* Simon 12 Okt ("ganti juga" — lingkaran ikon investor → gambar investor): pemilik kecil = investor kita, murid yang sama dengan S06
            (setengah badan, lingkaran oranye = warna potongan milik kita & garis putus-putusnya); dulu ikon investor di lingkaran ungu muda */}
        <KarakterLingkar pose={MURID_S06} x={PEM.x} y={PEM.y} D={PEMILIK.d} s={pPemilik} warna={B.orange} />
        <div style={{ position: 'absolute', left: PEM.x + PEMILIK.d / 2 + JARAK, top: PEM.y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', lineHeight: 1 }}>
          <WordText halus f={f} at={PEMILIK_AT + 40} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Pemilik kecil</WordText>
        </div>
        {/* nominal: bagian yang kita beli (juta — milik kita, bukan nilai perusahaan) */}
        <PilNominal x={PEM.x + PEMILIK.d / 2 + JARAK} y={PEM.y + 50} jangkar="kiri" teks={rpJuta(1)} arah={0} p={popIn(f, PEMILIK_AT + 55)} size={24} />
        {RANTAI.map((r, i) => (
          <div key={r.teks} style={{ position: 'absolute', inset: 0 }}>
            <Bulat x={P.x + r.dx} y={P.y} d={RD} col={r.col} ikon={r.ikon} s={popIn(f, RANTAI_ON[i])} />
            <div style={{ position: 'absolute', left: P.x + r.dx - 170, width: 340, top: P.y + RD / 2 + JARAK, textAlign: 'center', lineHeight: 1 }}>
              <WordText halus f={f} at={RANTAI_ON[i] + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>{r.teks}</WordText>
            </div>
            {i > 0 ? <PilNominal x={P.x + r.dx} y={P.y + RD / 2 + JARAK + 30 + 16 + 22} teks={rpMiliar(i === 1 ? 50 : 10, 0)} arah={0} p={popIn(f, RANTAI_ON[i] + 30)} size={24} /> : null}
          </div>))}
        {/* "lalu menghasilkan pendapatan dan laba": selembar uang hijau mengalir produk → pendapatan, lalu pendapatan → laba */}
        {[1, 2].map((i) => {
          const t0 = RANTAI_ON[i] - 40, t = R(f, t0, t0 + 50, 0, 1, io);
          if (t <= 0 || t >= 1) return null;
          const xa = P.x + RANTAI[i - 1].dx + RD / 2 + GAP, xb = P.x + RANTAI[i].dx - RD / 2 - GAP;
          return <LembarUang key={i} x={lerp(xa, xb, t)} y={P.y - 4} w={76} putar={lerp(-10, 8, t)} op={Math.min(1, R(f, t0, t0 + 10, 0, 1, io), R(f, t0 + 40, t0 + 50, 1, 0, io))} />;
        })}

        {/* simpul Saham (dari peta) → banding → masuk potongan */}
        {f >= TENGAH && opNode > 0.001 ? <SimpulBab x={nx} y={ny} d={nd} col={B.orange} ikon="saham" isi={1} op={opNode} /> : null}

        {/* ═════ ADEGAN TAMBAHAN · "Kalau bisnisnya terus berkembang, nilai bagian perusahaan yang kita miliki … ikut bertumbuh dalam jangka panjang" ═════ */}
        <Vinyet f={f} dari={{ x: P.x, y: P.y, r: PIE_R }} buka={V.buka} col={B.orange} latar={HOUSE.krim} kam={kam}
          keluar={ex > 0 ? { dx: mk.x - M0.x, dy: mk.y - M0.y, s: sIsi } : undefined}>
          <AdeganTumbuh f={f} />
        </Vinyet>
      </AbsoluteFill>
      <Judul f={f} kata={['Saham', 'adalah', 'bagian', 'dari', 'kepemilikan bisnis']} at={M('artinya', artinya)} sorotAt={pemilik + 30} size={44} />

      {/* ikon Saham terbang dari keranjang Scene 07 ke slot bab 06 — DI LUAR kamera, layar penuh, zIndex 1 */}
      <SahamTerbang f={f} />
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.orange, opacity: R(f, BATAS.s9 + 22, BATAS.s9 + 48, 0, 1, io) }} /> : null}
    {/* ikon memudar masuk di atas isian → saat ditukar ke ubin Saham Scene 09 (BATAS.s9+52) gambarnya sudah identik */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s9 + 34, BATAS.s9 + 48, 0, 1, io) }}><Icon name="saham" size={2 * mk.r * 0.58} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/** Saham terangkat (akhir Scene 07) → slot bab 06 di peta bab; koordinat LAYAR (kamera dua scene diperhitungkan) */
const SahamTerbang: React.FC<{ f: number }> = ({ f }) => {
  if (f >= TIBA) return null;
  const t = R(f, S8, TIBA, 0, 1, io);
  const k7 = kamera('S07', S8), k8 = kamera('S08', f);
  const a = keLayar(k7, { x: SAHAM7.x, y: SAHAM7.y - SAHAM_ANGKAT });
  const b = keLayar(k8, SIMPUL_PETA(5));
  // busur ke atas — puncaknya dibatasi tepi atas wilayah aman (cek 12 Okt: dulu puncak ikon y 111, di atas batas 150 selama ±0,5 dtk):
  // titik kendali dinaikkan (bisection) sampai puncak kurva kuadrat ≥ 150 + jari-jari ikon terbesar
  const puncak = (cy: number) => { const p = a.y, q = b.y, den = p + q - 2 * cy; return den <= 0 ? Math.min(p, q) : p - ((p - cy) ** 2) / den; };
  const batas = 150 + Math.max(ISI_D * k7.z, SIMPUL_PETA(5).r * 2 * k8.z) / 2;
  let cy = Math.min(a.y, b.y) - 120;
  if (puncak(cy) < batas) { let lo = cy, hi = Math.min(a.y, b.y); for (let i = 0; i < 30; i += 1) { const m = (lo + hi) / 2; if (puncak(m) < batas) lo = m; else hi = m; } cy = hi; }
  const c = { x: (a.x + b.x) / 2, y: cy };
  const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y;
  const d = lerp(ISI_D * k7.z, SIMPUL_PETA(5).r * 2 * k8.z, t);
  return (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: B.orange, border: `${2.5 * (1 - t)}px solid ${B.white}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', zIndex: 1, boxShadow: `0 ${lerp(7, 18, t)}px ${lerp(15, 40, t)}px -${lerp(6, 12, t)}px ${B.orange}aa` }}>
      <Icon name="saham" size={d * lerp(0.56, 96 / 170, t)} color={B.white} />
    </div>);
};

/**
 * ADEGAN — atas: GEDUNG KANTOR tumbuh kecil → sedang → besar (Simon: "ganti juga 3 bangunan ini dengan gedung") di atas sumbu waktu ("bisnisnya terus berkembang"); bawah: GRAFIK BATANG nilai pada
 * sumbu waktu yang SAMA ("nilai bagian … ikut bertumbuh dalam jangka panjang"). Simon 8 Okt: "adegan ini gunakan graphic seperti yang ada
 * di properti tapi jangan buat identik" → batang satu warna hijau yang tumbuh satu per satu seperti Properti, DIBEDAKAN: 6 batang lebar
 * bersudut bulat (Properti 7 batang ramping), kisi mendatar tipis saja (Properti kisi penuh + garis dasar tebal), tak ada benda yang
 * menunggang batang. Lalu Simon: "animasi graphicnya juga dan icon perusahaan seperti di adegan properti" → IKON PERUSAHAAN (pengganti
 * pie, "ganti piechartnya dengan icon perusahaan") duduk di puncak batang terbaru dan berpindah mulus dari batang ke batang. Ada satu batang turun sedikit (peluang, bukan kepastian).
 */
const CH = { x0: 458, x1: 1458, top: 540, bawah: 860 }; // x terukur: susunan gedung + batang berpusat di 960. Simon 9 Okt "turunkan sedikit graphic yang ada dibawahnya": +20
const NB = 6, STEP = (CH.x1 - CH.x0) / NB, LEBAR_B = 96;
const bx = (k: number) => CH.x0 + STEP * (k + 0.5);
const TINGGI = [0.2, 0.33, 0.29, 0.5, 0.67, 0.9].map((t) => t * (CH.bawah - CH.top));
// Simon 8 Okt: "urutannya buat seperti ini gedung kecil -> gedung menengah -> gedung besar". Simon 9 Okt: gedung = gambar Simon ("untuk
// gedung di saham ganti dengan ini saja": 3 lantai → 7 lantai → menara), DIMASKER lingkaran seperti karakter pembuka Scene 01 ("gedungnya
// masking saja seperti orang yang ada discene 1"), lingkaran BIRU brand tanpa bayangan; "turunkan sedikit gedungnya, lalu perbesar sekitar
// 10%" lalu "perbesar sedikit" → tinggi 173 · 232 · 285 (awal 145 · 195 · 240). Lingkaran Ø205 sebaris; pusatnya serendah mungkin: cincin
// luar berhenti 6 px di atas jalur ikon perusahaan (puncak ikon di batang tertinggi = CH.bawah − 410). Kecil di dalam lingkaran, menengah
// menyembul sedikit, menara menyembul paling tinggi.
const D_GEDUNG = 205;
const CY_GEDUNG = CH.bawah - 410 - 6 - (CINCIN_LUAR * D_GEDUNG) / 2;
const GEDUNG_TAHAP: { k: KunciGedung; x: number; h: number }[] = [{ k: 'kecil', x: bx(0), h: 173 }, { k: 'menengah', x: (bx(2) + bx(3)) / 2, h: 232 }, { k: 'besar', x: bx(5), h: 285 }];
const D_IKON = 110;
const AdeganTumbuh: React.FC<{ f: number }> = ({ f }) => {
  const sumbu = R(f, V.buka + 30, V.buka + 90, 0, 1, io);
  // batang tumbuh dari dasar satu per satu (30f inOut, jenjang rata) dari "nilai bagian…" sampai "bertumbuh" — pola Properti
  const a = M('nilai', nilai) + 40, b = bertumbuh - 10, langkah = (b - a - 30) / (NB - 1);
  const gB = TINGGI.map((_, k) => R(f, a + langkah * k, a + langkah * k + 30, 0, 1, io));
  // gedung pop (pusat 60f) saat batang di bawahnya selesai tumbuh separuh = ikon perusahaan tiba di sana
  const T_GEDUNG = [a + 15, a + langkah * 2.5 + 15, a + langkah * 5 + 15];
  const puncak = (k: number) => CH.bawah - TINGGI[k] * gB[k];
  // IKON PERUSAHAAN duduk di puncak batang TERBARU, berpindah mulus dari batang ke batang (Simon: "animasi graphicnya juga dan icon
  // perusahaan seperti di adegan properti")
  const cur = Math.max(0, Math.min(NB - 1, gB.reduce((s, g) => s + g, 0) - 1));
  const i0 = Math.floor(cur), i1 = Math.min(NB - 1, i0 + 1), fr = cur - i0;
  // tinggi: dari puncak PENUH batang asal ke puncak PENUH batang tujuan (dulu min(puncak kini) → saat menuju batang yang LEBIH PENDEK ikon
  // tertahan lalu meloncat turun ±10 px begitu indeksnya berganti, terukur f1631); batang pertama tetap mengikuti tumbuhnya
  const atasPenuh = (k: number) => (k === 0 ? puncak(0) : CH.bawah - TINGGI[k]);
  const ikon = { x: lerp(bx(i0), bx(i1), fr), y: lerp(atasPenuh(i0), atasPenuh(i1), fr) - D_IKON / 2 - 12 };
  return (
    <>
      {/* gedung tumbuh — Simon 9 Okt "buat gedungnya muncul satu persatu, mengikuti perkembangan perusahaan": tiap gedung pop saat ikon
          perusahaan tiba di batang di bawahnya (kecil = batang 1 · menengah = antara batang 3 & 4 · menara = batang tertinggi); dulu ketiganya
          berjenjang 22f di "bisnisnya". Slot "?" ketiganya muncul di "bisnisnya terus berkembang" (bahasa slot S05/S06) → bagian atas tidak
          kosong dan tapak susunan lengkap sejak awal (kamera diam). */}
      {GEDUNG_TAHAP.map((g, i) => {
        const at = T_GEDUNG[i], sp = popIn(f, bisnisnya - 10), op = Math.min(1, sp) * (1 - R(f, at - 10, at + 10, 0, 1, io));
        const ds = CINCIN_LUAR * D_GEDUNG; // slot seukuran cincin luar → tapak sama dengan gedung yang menggantikannya (kamera diam)
        return op > 0.001 ? <div key={`slot${i}`} style={{ position: 'absolute', left: g.x - ds / 2, top: CY_GEDUNG - ds / 2, width: ds, height: ds, borderRadius: '50%', border: `3px dashed ${B.grayLite}`, background: B.white, boxSizing: 'border-box', opacity: op, transform: `scale(${Math.min(0.99996, sp)})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: D_GEDUNG * 0.36, fontWeight: 800, color: B.grayLite }}>?</div> : null;
      })}
      {/* lingkaran gedung = Dark Turquoise MURNI (cek 12 Okt, aturan Simon untuk lingkaran rumah: "belum biru brand, itu masih menggunakan
          warna turunannya" — dulu BIRU_GEDUNG #5E8AE8 campuran); foto gedung 0–0,2 % piksel ΔE < 20 dari turkis (tak menyatu) */}
      {/* menara (tahap 3): lonjakan pop easeOutBack dikecilkan ke 25 % — pada lonjakan penuh puncaknya naik ke y 138, menembus tepi atas wilayah
          aman (150) ±3 frame (terukur sejak 9 Okt); kini tetap easeOutBack, puncak ≥ 150 */}
      {GEDUNG_TAHAP.map((g, i) => { const p = popIn(f, T_GEDUNG[i]); return <GedungLingkar key={g.k} k={g.k} x={g.x} cy={CY_GEDUNG} D={D_GEDUNG} h={g.h} s={i === 2 && p > 1 ? 1 + (p - 1) * 0.25 : p} warna={B.turq} wash={B.turqWash} />; })}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* kisi mendatar tipis + garis dasar */}
        {[0.33, 0.66].map((t) => <line key={t} x1={CH.x0} x2={lerp(CH.x0, CH.x1, sumbu)} y1={lerp(CH.bawah, CH.top, t)} y2={lerp(CH.bawah, CH.top, t)} stroke={B.grayLite} strokeWidth={1.5} opacity={0.55} />)}
        <line x1={CH.x0} x2={lerp(CH.x0, CH.x1, sumbu)} y1={CH.bawah} y2={CH.bawah} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
      </svg>
      {/* batang nilai: satu warna (hijau = naik), tumbuh dari dasar */}
      {gB.map((g, k) => g > 0.001 ? (
        <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: LEBAR_B, height: TINGGI[k], background: ARAH.naik, borderRadius: '16px 16px 4px 4px',
          transformOrigin: '50% 100%', transform: `${geser(bx(k) - LEBAR_B / 2, CH.bawah - TINGGI[k])} scaleY(${g})` }} />) : null)}
      <Bulat x={ikon.x} y={ikon.y} d={D_IKON} col={B.blue} ikon="perusahaan" s={popIn(f, a + 15)} />
      {/* waktu: kalender di awal sumbu, jam pasir di ujungnya ("jangka panjang") */}
      <Bulat x={CH.x0} y={CH.bawah + 58} d={64} col={B.blue} ikon="tenor" s={popIn(f, V.buka + 70)} />
      <Bulat x={CH.x1} y={CH.bawah + 58} d={64} col={B.blue} ikon="jangkaWaktu" s={popIn(f, V.buka + 80)} />
      {/* Simon 9 Okt: NOMINAL — "value" perusahaan ikut tumbuh bersama batangnya (Rp100 M → Rp450 M; Simon: nilai perusahaan pakai MILIAR,
          bukan juta), menempel di kanan ikon perusahaan; dulu lencana ▲ saja. Nilai = tinggi batang di bawah ikon ÷ tinggi batang pertama. */}
      {(() => {
        const nilai = 100 * Math.max(1, (CH.bawah - (ikon.y + D_IKON / 2 + 12)) / TINGGI[0]);
        return <PilNominal x={ikon.x + D_IKON / 2 + JARAK} y={ikon.y} jangkar="kiri" teks={rpMiliar(nilai, 0)} arah={R(nilai, 100, 140, 0, 1, io)} p={popIn(f, a + 15)} size={28} lebarMin={170} />;
      })()}
    </>);
};

/** lingkaran ikon */
const Bulat: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number; op?: number }> = ({ x, y, d, col, ikon, s, op = 1 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `translate3d(${x - d / 2}px, ${y - d / 2}px, 0) scale(${s}) rotate(0.001deg)`, opacity: op, boxShadow: `0 14px 30px -12px ${col}aa` }}>
      <Icon name={ikon} size={d * 0.58} color={B.white} />
    </div>);

/** lencana "≠" */
const TidakSama: React.FC<{ x: number; y: number; p: number; op: number }> = ({ x, y, p, op }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: '50%', background: B.white, border: `3px solid ${B.night}`, transform: `scale(${p})`, opacity: op, display: 'grid', placeItems: 'center' }}>
    <svg width={80} height={80} viewBox="0 0 80 80"><g fill={B.night}><rect x={22} y={28} width={36} height={7} rx={3.5} /><rect x={22} y={45} width={36} height={7} rx={3.5} /></g><line x1={50} y1={18} x2={30} y2={62} stroke={B.night} strokeWidth={7} strokeLinecap="round" /></svg>
  </div>);

export const S08_BEAT = { saham, saat, bagian, artinya, pemilik, produk, pendapatan, laba, kalau, bisnisnya, nilai, bertumbuh, jangka };
