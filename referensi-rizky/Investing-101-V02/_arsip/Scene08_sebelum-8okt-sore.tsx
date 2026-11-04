import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { gayaKamera, kamera } from '../kamera';
import { ARAH, B, F, GAP, LINE, R, io } from '../theme';
import { Icon, WordText, cin, grow, lerp, popIn } from '../parts/kit';
import { Konektor, PanahBadge, SimpulBab, denyut } from '../parts/rantai';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { Vinyet, redupVinyet } from '../parts/vinyet';
import { Judul } from '../s03/Scene03';
import { ISI7, ISI_D, SAHAM_ANGKAT } from '../s07/Scene07';
import { UBIN_SAHAM9 } from '../s09/Scene09';

/**
 * SCENE 08 — SAHAM. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "STOCK ↓ OWNERSHIP IN A COMPANY ↓ Products / Services ↓ Revenue ↓ Profit"
 *   TEXT   "Saham / adalah bagian dari kepemilikan bisnis"
 * Revisi 7 Okt (Simon): (1) PERPINDAHAN = peta bab: isi Scene 07 menyusut ke simpul bab 05, ikon Saham yang terangkat dari keranjang
 * TERBANG mengisi slot bab 06 (benang merah Scene 07 → 08), simpulnya ke tengah; (2) Emas ≠ Saham; perusahaan TERBENTUK di
 * sekeliling simpul Saham yang menjadi potongan oranye (bagian yang kita beli); pemilik kecil; rantai Produk & layanan →
 * Pendapatan → Laba MENDATAR di samping perusahaan (dulu satu penghubung diagonal panjang); (3) ADEGAN TAMBAHAN tanpa teks:
 * "bisnis berkembang" = koin mengalir di rantai & perusahaan membesar; "nilai bagian … bertumbuh dalam jangka panjang" =
 * potongan kita menaiki garis nilai yang naik (hijau) sepanjang waktu (kalender → jam pasir). Waktu muncul 18f sebelum frasanya,
 * jarak teks 16 px, kamera pusat, pop berporos di tengah.
 */
export const S8 = BATAS.s8;
export const IDE_S08_AWAL = S8;

// urutan = urutan UCAPAN ("…pemilik kecil dari perusahaan tersebut. Perusahaan menjual…" → dua "perusahaan" berturut-turut)
const [saham, saat, kita, bagian, perusahaan, yang, artinya, kita2, pemilik, , perusahaan3, menjual, produk, lalu, pendapatan, laba, kalau,
  berkembang, nilai, bertumbuh, jangka] = urut(['saham', 'saat', 'kita', 'bagian', 'perusahaan', 'yang', 'artinya', 'kita', 'pemilik', 'perusahaan',
  'perusahaan', 'menjual', 'produk', 'lalu', 'pendapatan', 'laba', 'kalau', 'berkembang', 'nilai', 'bertumbuh', 'jangka'], S8);
/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;

/* ── geometri (dunia, sebelum kamera) ── */
const NODE = { x: 960, y: 540, d: 200 };
const BANDING = { emas: { x: 720, y: 540 }, saham: { x: 1200, y: 540 } };
const JARAK = 16;
const PIE = { x: 560, y: 580, r: 170 }; // posisi AKHIR; terbentuk di x 960, bergeser kiri saat "Artinya" (pemilik & rantai masuk)
const PIE_X0 = 960, PIE_Y0 = 524; // saat sendirian: perusahaan + label di bawahnya berpusat di y 540 (terukur); turun ke y AKHIR saat bergeser
const SLICE = { a0: -90, a1: -45 }; // potongan "bagian" di kanan-atas
const rad = (d: number) => (d * Math.PI) / 180;
const MID = rad((SLICE.a0 + SLICE.a1) / 2);
const potongDi = (px: number, py = PIE.y) => ({ x: px + Math.cos(MID) * PIE.r * 0.66, y: py + Math.sin(MID) * PIE.r * 0.66 });
const POTONG = potongDi(PIE.x);
const PEMILIK = { x: 900, y: 330, d: 96 };
const RD = 104;
const RANTAI = [
  { teks: 'Produk & layanan', ikon: 'produkLayanan' as KunciIkon, x: 974, col: B.blue }, // −36: susunan perusahaan + rantai berpusat di x 960 (terukur)
  { teks: 'Pendapatan', ikon: 'pendapatan' as KunciIkon, x: 1224, col: B.blue },
  { teks: 'Laba', ikon: 'bisnisLaba' as KunciIkon, x: 1474, col: B.orange },
];
/** penghubung rantai: perusahaan → produk → pendapatan → laba (mendatar di y PIE) */
const RUAS = [
  { x1: PIE.x + PIE.r + GAP, x2: RANTAI[0].x - RD / 2 - GAP },
  { x1: RANTAI[0].x + RD / 2 + GAP, x2: RANTAI[1].x - RD / 2 - GAP },
  { x1: RANTAI[1].x + RD / 2 + GAP, x2: RANTAI[2].x - RD / 2 - GAP },
];

/* ── waktu (frame global) ── */
const TIBA = saham; // ikon Saham (terbang dari keranjang) tiba di slot bab 06
const TENGAH = TIBA + 90; // PembukaBab: simpul tiba di tengah pada isiAt+90
const BANDING_AT = TENGAH; // simpul ke kanan, emas di kiri
const KE_BALIK = A0('saat', saat); // "saat membeli saham": emas pergi, simpul Saham kembali ke tengah
const PIE_AT = A0('kita', kita); // "kita membeli bagian dari sebuah perusahaan…": perusahaan terbentuk di sekeliling simpul
const KE_POTONG = PIE_AT; // … yang mengecil jadi potongannya
const GESER = A0('artinya', artinya); // perusahaan bergeser kiri
const PEMILIK_AT = A0('kita', kita2);
const RANTAI_AT = [A0('perusahaan', perusahaan3), A0('lalu', lalu), A0('lalu', lalu) + 40];
const JALAN = A0('kalau', kalau); // bisnis berjalan: koin mengalir di rantai
const V = { buka: A0('nilai', nilai) };

export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < S8) return null;
  // KELUAR = milik Scene 09: MASKER LINGKARAN — seluruh isi (adegan pertumbuhan) menyusut ke ubin Saham pembuka Scene 09
  // ("Inilah salah satu alasan kenapa saham…"), berubah oranye + ikon saham, lalu ubin itu mengambil alih. 50f mulai BATAS.s9.
  if (f >= BATAS.s9 + 52) return null;
  const ex = R(f, BATAS.s9, BATAS.s9 + 50, 0, 1, io);
  const kam9 = kamera('S09', BATAS.s9 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { x: UBIN_SAHAM9.x + kam9.x, y: UBIN_SAHAM9.y + kam9.y, r: UBIN_SAHAM9.d / 2 };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);

  /* simpul Saham: tengah → kanan (banding) → posisi potongan (perusahaan di x 960) → diserap potongan */
  const banding = 1 - R(f, KE_BALIK, KE_BALIK + 60, 0, 1, io); // di kanan sejak tiba dari peta; kembali ke tengah saat "saat membeli saham"
  const kePotong = R(f, KE_POTONG, KE_POTONG + 60, 0, 1, io);
  const geser = R(f, GESER, GESER + 60, 0, 1, io);
  const pxPie = lerp(PIE_X0, PIE.x, geser), pyPie = lerp(PIE_Y0, PIE.y, geser);
  const potong0 = potongDi(PIE_X0, PIE_Y0);
  let nx = lerp(NODE.x, BANDING.saham.x, banding), ny = lerp(NODE.y, BANDING.saham.y, banding);
  nx = lerp(nx, potong0.x, kePotong); ny = lerp(ny, potong0.y, kePotong);
  const nd = lerp(NODE.d, 70, kePotong);
  const potong = popIn(f, bagian + 15); // potongan berubah oranye
  const opNode = 1 - R(f, bagian + 20, bagian + 45, 0, 1, io); // simpul diserap potongan
  const opEmas = Math.min(popIn(f, BANDING_AT + 30), 1 - R(f, KE_BALIK, KE_BALIK + 40, 0, 1, io));
  const pie = cin(f, PIE_AT + 30);
  const tumbuh = 1 + 0.1 * R(f, JALAN + 40, berkembang + 30, 0, 1, io); // bisnis berkembang
  const labelBab = cin(f, TENGAH + 20) * (1 - R(f, KE_POTONG, KE_POTONG + 30, 0, 1, io)); // nama bab ikut simpul, pudar saat jadi potongan
  const diagram = 1 - 0.9 * redupVinyet(f, V.buka);
  // "…yang sedang menjalankan bisnis": perusahaan berputar satu putaran seperti roda yang bekerja (potongan kembali ke tempatnya)
  const putar = R(f, yang, yang + 80, 0, 360, io);

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama di atas Scene 09 */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s9, BATAS.s9 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <Judul f={f} kata={['Saham', 'adalah', 'bagian', 'dari', 'kepemilikan bisnis']} at={M('artinya', artinya)} sorotAt={pemilik + 30} size={44} />

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaKamera('S08', f)}>
        {/* ═════ pembuka bab: peta bab → simpul bab 06 (diisi ikon Saham yang terbang dari keranjang) ke tengah ═════ */}
        {/* simpul bab 06 meluncur LANGSUNG ke posisi banding (kanan) — dulu ke tengah lalu langsung bergeser kanan (tak pernah diam) */}
        <PembukaBab f={f} s0={S8} k={5} isiAt={TIBA} tengah={{ ...BANDING.saham, d: NODE.d }} selesai={TENGAH} isiLuar={f >= TIBA ? 1 : 0} />

        <AbsoluteFill style={{ opacity: diagram }}>
          {/* nomor & nama bab (ikut simpul saat banding) */}
          {labelBab > 0.001 ? (
            <>
              <div style={{ position: 'absolute', left: nx - 140, width: 280, bottom: 1080 - (ny - NODE.d / 2 - JARAK), textAlign: 'center', opacity: labelBab, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.orange, letterSpacing: '.04em', lineHeight: 1 }}>06</div>
              <div style={{ position: 'absolute', left: nx - 200, width: 400, top: ny + NODE.d / 2 + JARAK, textAlign: 'center', opacity: labelBab, lineHeight: 1 }}>
                <WordText f={f} at={TENGAH + 20} style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>Saham</WordText>
              </div>
            </>) : null}

          {/* emas ≠ saham */}
          {opEmas > 0.001 ? (
            <>
              <SimpulBab x={BANDING.emas.x} y={BANDING.emas.y} d={NODE.d} col={B.turq} ikon="emas" isi={popIn(f, BANDING_AT + 30)} op={opEmas} />
              <div style={{ position: 'absolute', left: BANDING.emas.x - 200, width: 400, top: BANDING.emas.y + NODE.d / 2 + JARAK, textAlign: 'center', opacity: opEmas, lineHeight: 1 }}>
                <WordText f={f} at={BANDING_AT + 40} style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>Emas</WordText>
              </div>
              <TidakSama x={(BANDING.emas.x + BANDING.saham.x) / 2} y={NODE.y} p={popIn(f, BANDING_AT + 50)} op={opEmas} />
            </>) : null}

          {/* perusahaan = lingkaran berpotongan, terbentuk di sekeliling simpul Saham; potongan oranye = bagian yang kita beli */}
          {pie > 0.001 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: pie, transform: `translate(${pxPie - PIE.x}px, ${pyPie - PIE.y}px) scale(${lerp(0.9, 1, pie) * tumbuh})`, transformOrigin: `${PIE.x}px ${PIE.y}px` }}>
              <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                <g transform={`rotate(${putar} ${PIE.x} ${PIE.y})`}>
                {Array.from({ length: 8 }, (_, k) => {
                  const a0 = -90 + k * 45, a1 = a0 + 45, isBagian = k === 0;
                  const keluar = isBagian ? 14 * Math.min(1, potong) : 0;
                  const mid = rad((a0 + a1) / 2), ox = Math.cos(mid) * keluar, oy = Math.sin(mid) * keluar, rr = PIE.r;
                  const p0 = [PIE.x + ox + Math.cos(rad(a0)) * rr, PIE.y + oy + Math.sin(rad(a0)) * rr];
                  const p1 = [PIE.x + ox + Math.cos(rad(a1)) * rr, PIE.y + oy + Math.sin(rad(a1)) * rr];
                  const dPath = `M${PIE.x + ox} ${PIE.y + oy} L${p0[0]} ${p0[1]} A${rr} ${rr} 0 0 1 ${p1[0]} ${p1[1]} Z`;
                  // potongan "bagian": oranye masuk lewat OPASITAS di atas dasar (bukan campuran hex — tak ada warna antara non-brand)
                  return (
                    <g key={k}>
                      <path d={dPath} fill={k % 2 ? B.blue : B.blueLite} stroke={B.white} strokeWidth={4} />
                      {isBagian && potong > 0.001 ? <path d={dPath} fill={B.orange} fillOpacity={Math.min(1, potong)} stroke={B.white} strokeWidth={4} /> : null}
                    </g>);
                })}
                </g>
                <circle cx={PIE.x} cy={PIE.y} r={64} fill={B.white} />
              </svg>
              <div style={{ position: 'absolute', left: PIE.x - 40, top: PIE.y - 40, width: 80, height: 80, display: 'grid', placeItems: 'center', transform: `scale(${popIn(f, PIE_AT + 50)})` }}>{/* ikon & label perusahaan bersama lingkarannya (klausa "…bagian dari sebuah perusahaan"): kotak isi tetap → kamera diam */}
                <Icon name="perusahaan" size={72} color={B.blue} />
              </div>
              <div style={{ position: 'absolute', left: PIE.x - 200, width: 400, top: PIE.y + PIE.r + JARAK, textAlign: 'center', lineHeight: 1 }}>
                <WordText f={f} at={PIE_AT + 60} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>Perusahaan</WordText>
              </div>
            </div>) : null}

          {/* pemilik kecil */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {grow(f, PEMILIK_AT + 30) > 0.001 ? (
              <line x1={POTONG.x + 40} y1={POTONG.y - 34} x2={lerp(POTONG.x + 40, PEMILIK.x - PEMILIK.d / 2 - GAP, grow(f, PEMILIK_AT + 30))} y2={lerp(POTONG.y - 34, PEMILIK.y, grow(f, PEMILIK_AT + 30))}
                stroke={B.orange} strokeWidth={LINE.w} strokeDasharray={LINE.dash} strokeLinecap="round" />) : null}
            {/* rantai mendatar: perusahaan → produk & layanan → pendapatan → laba */}
            {RUAS.map((r, i) => <Konektor key={i} x1={r.x1} y1={PIE.y} x2={r.x2} y2={PIE.y} g={grow(f, RANTAI_AT[i] + 30)} col={B.blue} />)}
          </svg>
          <Bulat x={PEMILIK.x} y={PEMILIK.y} d={PEMILIK.d} col={B.blue} ikon="investor" s={popIn(f, PEMILIK_AT + 50)} />
          <div style={{ position: 'absolute', left: PEMILIK.x + PEMILIK.d / 2 + JARAK, top: PEMILIK.y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', lineHeight: 1 }}>
            <WordText f={f} at={PEMILIK_AT + 60} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Pemilik kecil</WordText>
          </div>
          {RANTAI.map((r, i) => {
            const tibaKoin = [0, 1].map((w) => JALAN + 60 * w + 40 * (i + 1));
            return (
              <React.Fragment key={r.teks}>
                <Bulat x={r.x} y={PIE.y} d={RD} col={r.col} ikon={r.ikon} s={popIn(f, RANTAI_AT[i] + 50) + Math.max(...tibaKoin.map((t) => denyut(f, t)))} />
                <div style={{ position: 'absolute', left: r.x - 160, width: 320, top: PIE.y + RD / 2 + JARAK, textAlign: 'center', lineHeight: 1 }}>
                  <WordText f={f} at={RANTAI_AT[i] + 60} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>{r.teks}</WordText>
                </div>
              </React.Fragment>);
          })}
          {/* bisnis berjalan: dua gelombang koin mengalir perusahaan → produk → pendapatan → laba */}
          {[0, 1].map((w) => RUAS.map((r, i) => {
            const t0 = JALAN + 60 * w + 40 * i, t = R(f, t0, t0 + 40, 0, 1, io);
            if (t <= 0 || t >= 1) return null;
            return <Koin key={`${w}${i}`} x={lerp(r.x1, r.x2, t)} y={PIE.y} op={Math.min(1, R(f, t0, t0 + 8, 0, 1, io), R(f, t0 + 32, t0 + 40, 1, 0, io))} />;
          }))}

          {/* simpul Saham (dari peta) → banding → masuk potongan */}
          {f >= TENGAH && opNode > 0.001 ? <SimpulBab x={nx} y={ny} d={nd} col={B.orange} ikon="saham" isi={1} op={opNode} /> : null}
        </AbsoluteFill>

        {/* ═════ ADEGAN TAMBAHAN · "nilai bagian perusahaan yang kita miliki … ikut bertumbuh dalam jangka panjang" ═════ */}
        <Vinyet f={f} dari={{ x: POTONG.x, y: POTONG.y, r: 40 }} buka={V.buka} col={B.orange}>
          <AdeganTumbuh f={f} />
        </Vinyet>
      </AbsoluteFill>

      {/* ikon Saham terbang dari keranjang Scene 07 ke slot bab 06 — DI LUAR kamera, layar penuh, zIndex 1: tetap di atas isi Scene 07
          yang sedang menyusut (zIndex 1, lebih awal di DOM) */}
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
  const a = { x: ISI7[2].x + k7.x, y: ISI7[2].y - SAHAM_ANGKAT + k7.y };
  const b = { x: SIMPUL_PETA(5).x + k8.x, y: SIMPUL_PETA(5).y + k8.y };
  const c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 120 }; // busur ke atas
  const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y;
  const d = lerp(ISI_D, SIMPUL_PETA(5).r * 2, t);
  return (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: 99, background: B.orange, display: 'grid', placeItems: 'center', zIndex: 1, boxShadow: `0 ${lerp(14, 18, t)}px ${lerp(30, 40, t)}px -12px ${B.orange}aa` }}>
      <Icon name="saham" size={d * lerp(0.58, 96 / 170, t)} color={B.white} />
    </div>);
};

/**
 * ADEGAN — potongan kita (oranye) menaiki garis nilai yang naik sepanjang waktu (bergelombang, tapi naik dalam jangka panjang);
 * kalender di awal sumbu waktu, jam pasir di ujungnya (jangka panjang); lencana ▲ hijau di "bertumbuh".
 */
const AdeganTumbuh: React.FC<{ f: number }> = ({ f }) => {
  const AX = { x0: 470, x1: 1450, y0: 800, y1: 300 };
  const sumbu = R(f, V.buka + 30, V.buka + 90, 0, 1, io);
  const N = 60;
  const nilaiY = (t: number) => lerp(740, 420, t) - 34 * Math.sin(t * 11) * (1 - 0.4 * t);
  const g = R(f, V.buka + 70, bertumbuh + 40, 0, 1, io);
  const u = g * (N - 1), i = Math.floor(u), r = u - i;
  const pts = Array.from({ length: N }, (_, k) => ({ x: lerp(AX.x0 + 40, AX.x1 - 60, k / (N - 1)), y: nilaiY(k / (N - 1)) }));
  const ujung = i >= N - 1 ? pts[N - 1] : { x: lerp(pts[i].x, pts[i + 1].x, r), y: lerp(pts[i].y, pts[i + 1].y, r) };
  const W = lerp(40, 70, g); // jari-jari perusahaan mini — nilainya bertumbuh (puncak tetap ≥ 40 px dari tepi atas panel)
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <g stroke={B.grayLite} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={sumbu}>
          <line x1={AX.x0} x2={AX.x0} y1={AX.y0} y2={lerp(AX.y0, AX.y1, sumbu)} /><path d={`M${AX.x0 - 9} ${AX.y1 + 12} L${AX.x0} ${AX.y1} L${AX.x0 + 9} ${AX.y1 + 12}`} opacity={sumbu > 0.98 ? 1 : 0} />
          <line x1={AX.x0} x2={lerp(AX.x0, AX.x1, sumbu)} y1={AX.y0} y2={AX.y0} /><path d={`M${AX.x1 - 12} ${AX.y0 - 9} L${AX.x1} ${AX.y0} L${AX.x1 - 12} ${AX.y0 + 9}`} opacity={sumbu > 0.98 ? 1 : 0} />
        </g>
        {g > 0.001 ? <polyline points={[...pts.slice(0, i + 1), ujung].map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={ARAH.naik} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
        {/* perusahaan mini dengan POTONGAN KITA (oranye) di ujung garis, membesar seiring nilainya */}
        {g > 0.001 ? (
          <g transform={`translate(${ujung.x} ${ujung.y - W - 10})`}>
            {Array.from({ length: 8 }, (_, k) => {
              const a0 = rad(-90 + k * 45), a1 = rad(-45 + k * 45);
              return <path key={k} d={`M0 0 L${Math.cos(a0) * W} ${Math.sin(a0) * W} A${W} ${W} 0 0 1 ${Math.cos(a1) * W} ${Math.sin(a1) * W} Z`} fill={k === 0 ? B.orange : k % 2 ? B.blue : B.blueLite} stroke={B.white} strokeWidth={3} />;
            })}
            <circle r={W * 0.36} fill={B.white} />
          </g>) : null}
      </svg>
      {/* waktu: kalender di awal sumbu, jam pasir di ujungnya ("jangka panjang") */}
      <Bulat x={AX.x0 + 10} y={AX.y0 + 62} d={64} col={B.blue} ikon="tenor" s={popIn(f, V.buka + 60)} />
      <Bulat x={AX.x1 - 10} y={AX.y0 + 62} d={64} col={B.blue} ikon="jangkaWaktu" s={popIn(f, M('jangka', jangka))} />
      {/* lencana ▲ di kanan-atas perusahaan mini, 12 px dari tepinya (dulu menumpang 8 px) */}
      <PanahBadge x={ujung.x + (W + 38) * 0.707} y={ujung.y - 10 - W - (W + 38) * 0.707} d={52} naik p={popIn(f, bertumbuh)} flip={0} />
    </>);
};

/** lingkaran ikon */
const Bulat: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number; op?: number }> = ({ x, y, d, col, ikon, s, op = 1 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: 99, background: col, display: 'grid', placeItems: 'center', transform: `scale(${s})`, opacity: op, boxShadow: `0 14px 30px -12px ${col}aa` }}>
      <Icon name={ikon} size={d * 0.58} color={B.white} />
    </div>);

/** koin (lingkaran oranye bertepi putih, ikon pendapatan) */
const Koin: React.FC<{ x: number; y: number; op: number }> = ({ x, y, op }) => op <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 99, background: B.orange, border: `3px solid ${B.white}`, opacity: op, display: 'grid', placeItems: 'center', boxShadow: `0 6px 12px -6px ${B.orange}aa` }}>
    <Icon name="pendapatan" size={24} color={B.white} />
  </div>);

/** lencana "≠" */
const TidakSama: React.FC<{ x: number; y: number; p: number; op: number }> = ({ x, y, p, op }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: 99, background: B.white, border: `3px solid ${B.night}`, transform: `scale(${p})`, opacity: op, display: 'grid', placeItems: 'center' }}>
    <svg width={80} height={80} viewBox="0 0 80 80"><g fill={B.night}><rect x={22} y={28} width={36} height={7} rx={3.5} /><rect x={22} y={45} width={36} height={7} rx={3.5} /></g><line x1={50} y1={18} x2={30} y2={62} stroke={B.night} strokeWidth={7} strokeLinecap="round" /></svg>
  </div>);

export const S08_BEAT = { saham, saat, bagian, perusahaan, artinya, pemilik, menjual, produk, pendapatan, laba, berkembang, nilai, bertumbuh, jangka };
