import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, CEK, CORET, F, io, R, rgba } from '../theme';
import { alfaP, ArahKeluar, cin, gayaPapan, Icon, opa, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Lencana } from '../parts/umum';
import { Kaca, KarakterLingkar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { Foto } from '../parts/nyata';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { JEMBATAN_W, pusatSungai, Sungai } from '../parts/sungai';
import { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 08 — Penutup: Kembali ke Sungai (BATAS.s8 – akhir). Ide: 04_Asset/Ide-Visual-Scene-08.md.
 * A "ingat tiga hal": tiga kendaraan → tiga baris ringkasan bertumpuk (relatif stabil · indeks jalur utama · sebagian kecil saham), dipusatkan
 * bertahap tiap baris baru → B PETA SUNGAI Scene 01 (geometri sama): rumah di seberang tetap ada, jalur tercepat (pesawat) belum tentu terbaik,
 * terus bergerak → C jalur dinomori: ① jalan kaki ② naik feri ③ terbang (saat siap) → penjelajah sampai di rumah.
 */
const A0 = BATAS.s8;
const KATA = ['tiga', 'pertama', 'dekat', 'fondasi', 'relatif', 'kedua', 'jangka', 'indeks', 'utama', 'keranjang', 'bukan', 'saham', 'ketiga', 'kemampuan',
  'pengalaman', 'sebagian', 'memilih', 'perusahaan', 'harga', 'sekarang', 'sungai', 'rumah', 'tetap', 'tercepat', 'belum', 'terbaik', 'penting', 'bergerak',
  'jalan', 'naik', 'siap', 'terbang', 'sampai', 'berikutnya'];
const K = ['tiga', 'pertama', 'dekat', 'fondasi', 'relatif', 'kedua', 'jangka', 'indeks', 'utama', 'keranjang', 'bukan', 'saham', 'ketiga', 'kemampuan',
  'pengalaman', 'sebagian', 'memilih', 'perusahaan', 'harga', 'sekarang', 'sungai', 'rumah', 'tetap', 'tercepat', 'belum', 'terbaik', 'penting', 'bergerak',
  'jalan', 'naik', 'siap', 'terbang', 'sampai', 'berikutnya'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S08_T = T;

const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };

/* ── A: tiga baris ringkasan ── */
type Butir = { teks: string; ikon: KunciIkon; at: number; coret?: number };
const BARIS = { w: 1240, h: 170, gap: 26 };
const pusatBaris = (i: number) => 540 + (i - 1) * (BARIS.h + BARIS.gap);

/* ── B–C: peta sungai — geometri Scene 01 (src/s01/Scene01.tsx) ── */
const ORANG = { x: 260, y: 610, D: 260 };
const P0 = { x: 398, y: 610 }, P1 = { x: 1478, y: 610 };
const SUNGAI = { x0: 770, x1: 1150, top: 110, bottom: 1010 };
const RUMAH = { x: 1655, y: 610, w: 330 };
const KD = 116;
type Jalur = { k: string; y: number; warna: string; ikon: KunciIkon; cermin: boolean };
const JALUR: Jalur[] = [
  { k: 'pesawat', y: 220, warna: JALUR_WARNA.pesawat, ikon: 'pesawat', cermin: false },
  { k: 'speedboat', y: 415, warna: JALUR_WARNA.speedboat, ikon: 'speedboat', cermin: true },
  { k: 'feri', y: 610, warna: JALUR_WARNA.feri, ikon: 'feri', cermin: true },
  { k: 'jalan', y: 805, warna: JALUR_WARNA.jalan, ikon: 'jalanKaki', cermin: false },
];
const jalurD = (y: number) => y === P0.y
  ? `M ${P0.x} ${P0.y} L ${P1.x} ${P1.y}`
  : `M ${P0.x} ${P0.y} C ${P0.x + 190} ${P0.y} ${SUNGAI.x0 - 170} ${y} ${SUNGAI.x0} ${y} L ${SUNGAI.x1} ${y} C ${SUNGAI.x1 + 170} ${y} ${P1.x - 190} ${P1.y} ${P1.x} ${P1.y}`;
const bez = (a: number, b: number, c: number, d: number, t: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
const SAMPEL: Record<number, [number, number, number][]> = {};
const sampel = (y: number) => {
  if (SAMPEL[y]) return SAMPEL[y];
  const pts: [number, number][] = [];
  const N = 80;
  for (let i = 0; i <= N; i++) { const t = i / N; pts.push([bez(P0.x, P0.x + 190, SUNGAI.x0 - 170, SUNGAI.x0, t), bez(P0.y, P0.y, y, y, t)]); }
  for (let i = 1; i <= N; i++) pts.push([SUNGAI.x0 + (SUNGAI.x1 - SUNGAI.x0) * i / N, y]);
  for (let i = 1; i <= N; i++) { const t = i / N; pts.push([bez(SUNGAI.x1, SUNGAI.x1 + 170, P1.x - 190, P1.x, t), bez(y, y, P1.y, P1.y, t)]); }
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  SAMPEL[y] = pts.map((p, i) => [p[0], p[1], L[i] / L[L.length - 1]]);
  return SAMPEL[y];
};
const titikDi = (y: number, t: number): [number, number] => {
  const s = sampel(y);
  const j = s.findIndex((p) => p[2] >= t);
  if (j <= 0) return [s[0][0], s[0][1]];
  const a = s[j - 1], b = s[j], u = (t - a[2]) / Math.max(1e-6, b[2] - a[2]);
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
};

export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0) return null;

  /* ═ A ═ */
  const keluarA = popOut(f, T.sekarang - 20);
  const s1 = 540 - pusatBaris(0), s2 = 540 - (pusatBaris(0) + pusatBaris(1)) / 2;
  const geserA = s1 + (s2 - s1) * cin(f, T.kedua - 24) - s2 * cin(f, T.ketiga - 24);
  const tigaP = (i: number) => popIn(f, T.tiga + i * 20) * (1 - cin(f, T.pertama - 10, 30)); // "tiga hal" → baris pertama menggantikan ketiganya
  /* ═ B–C ═ */
  const peta = cin(f, T.sungai - 10);
  const sungaiP = cin(f, T.sungai + 10);
  const sorot: Record<string, number> = { jalan: cin(f, T.jalan + 10), feri: cin(f, T.naik + 20), pesawat: Math.max(cin(f, T.tercepat + 10) * (1 - cin(f, T.penting)), cin(f, T.terbang + 10)) };
  const redupSpeed = 1 - 0.7 * cin(f, T.tercepat);
  const nomor: Record<string, number> = { jalan: T.jalan + 20, feri: T.naik + 30, pesawat: T.terbang + 20 };
  // penjelajah: jalan kaki (P0 → jembatan) → pindah ke feri menyeberang → sampai rumah di "pelajaran berikutnya"
  const jalanT = R(f, T.jalan, T.naik - 10, 0, 0.32, io);
  const feriT = R(f, T.naik + 10, T.sampai + 40, 0.32, 1, io);

  const rows: { warna: string; ikon: KunciIkon; cermin: boolean; judul: string; judulAt: number; at: number; butir: Butir[] }[] = [
    { warna: JALUR_WARNA.jalan, ikon: 'jalanKaki', cermin: false, judul: 'Relatif stabil', judulAt: T.relatif, at: T.pertama,
      butir: [{ teks: 'Uang waktu dekat', ikon: 'waktu', at: T.dekat }, { teks: 'Fondasi portofolio', ikon: 'fondasi', at: T.fondasi }] },
    { warna: JALUR_WARNA.feri, ikon: 'feri', cermin: true, judul: 'Indeks: jalur utama', judulAt: T.indeks, at: T.kedua,
      butir: [{ teks: 'Dana jangka panjang', ikon: 'dompet', at: T.jangka }, { teks: 'Satu keranjang perusahaan', ikon: 'perusahaan', at: T.keranjang },
        { teks: 'Satu saham', ikon: 'saham', at: T.bukan, coret: T.saham }] },
    { warna: JALUR_WARNA.pesawat, ikon: 'pesawat', cermin: false, judul: 'Sebagian kecil: belajar memilih saham', judulAt: T.sebagian, at: T.ketiga,
      butir: [{ teks: 'Kemampuan & pengalaman', ikon: 'kemampuan', at: T.kemampuan }, { teks: 'Perusahaan bagus', ikon: 'kualitas', at: T.perusahaan },
        { teks: 'Harga bagus', ikon: 'valuasi', at: T.harga }] },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A: "ingat tiga hal" → tiga baris ══ */}
      {[0, 1, 2].map((i) => {
        const p = tigaP(i);
        return p > 0.001 ? <Kendaraan key={i} x={[640, 960, 1280][i]} y={540} d={140} warna={rows[i].warna} ikon={rows[i].ikon} cermin={rows[i].cermin} p={p} /> : null;
      })}
      <ArahKeluar aktif={f > T.sekarang - 50}>
      {keluarA > 0.001 ? rows.map((r, i) => {
        const p = popIn(f, r.at) * keluarA;
        if (p <= 0.001) return null;
        return (
          <Kaca key={i} x={960} y={pusatBaris(i) + geserA} w={BARIS.w} h={BARIS.h} p={p} warna={r.warna} tab="kiri">
            <Nomor x={62} y={BARIS.h / 2} n={i + 1} warna={r.warna} p={1} d={52} />
            <Kendaraan x={160} y={BARIS.h / 2} d={104} warna={r.warna} ikon={r.ikon} cermin={r.cermin} p={1} />
            {/* QA diam 19 Okt: tanda di kata kuncinya — indeks = "jalur utama" (✓), saham sendiri = "memilih saham" (✓) + porsi kecil dana */}
            {i === 1 ? <Lencana x={160} y={BARIS.h / 2} d={104} p={popIn(f, T.utama)} warna={CEK} ikon="tersedia" besar={40} /> : null}
            {i === 2 ? <Lencana x={160} y={BARIS.h / 2} d={104} p={popIn(f, T.memilih)} warna={CEK} ikon="tersedia" besar={40} /> : null}
            {i === 2 ? (
              <div style={{ position: 'absolute', right: 40, top: 40, width: 190, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end',
                opacity: cin(f, T.sebagian - 10, 40), fontFamily: F, fontSize: 20, fontWeight: 700, color: B.gray }}>
                <div style={{ width: 190, height: 16, borderRadius: 8, background: rgba(B.grayLite, 0.7), overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: 16, width: 190 * 0.9 * cin(f, T.sebagian, 50), background: JALUR_WARNA.feri }} />
                  <div style={{ position: 'absolute', right: 0, top: 0, height: 16, width: 190 * 0.1, background: JALUR_WARNA.pesawat, opacity: cin(f, T.sebagian + 30, 30) }} />
                </div>
                Sebagian kecil dana
              </div>) : null}
            <div style={{ position: 'absolute', left: 236, top: 30, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
              {/* judul muncul BERSAMA barisnya (pratinjau 1: kartu tanpa judul ±2 dtk menunggu kata kuncinya) */}
              <WordText f={f} at={r.at + 20} halus>{r.judul}</WordText>
            </div>
            <div style={{ position: 'absolute', left: 236, top: 96, display: 'flex', gap: 14 }}>
              {r.butir.map((b, k) => {
                const q = popIn(f, b.at);
                const c = b.coret ? R(f, b.coret, b.coret + 30, 0, 1, io) : 0;
                return q > 0.001 ? (
                  <div key={k} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, background: rgba(r.warna, 0.1),
                    fontFamily: F, fontSize: 24, fontWeight: 700, color: c > 0.5 ? CORET : B.night, whiteSpace: 'nowrap', transform: `scale(${skalaPop(q)})`, transformOrigin: 'left center' }}>
                    <Icon name={b.ikon} size={26} color={c > 0.5 ? CORET : r.warna} />{b.teks}
                    {c > 0.001 ? <div style={{ position: 'absolute', left: 12, top: '50%', height: 3, width: `calc(${c} * (100% - 24px))`, background: CORET, borderRadius: 2 }} /> : null}
                  </div>) : null;
              })}
            </div>
          </Kaca>);
      }) : null}
      </ArahKeluar>

      {/* ══ B–C: peta sungai ══ */}
      {peta > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(peta, false) }}>
          <Sungai id="s08" top={SUNGAI.top} bottom={SUNGAI.bottom} p={sungaiP} />
          {/* jembatan jalan kaki */}
          <div style={{ position: 'absolute', left: pusatSungai(805) - JEMBATAN_W / 2, top: 805 - 17, width: JEMBATAN_W, height: 34, borderRadius: 17, background: B.white,
            border: `3px solid ${B.turq}`, boxSizing: 'border-box', transformOrigin: '50% 50%', transform: `scaleX(${cin(f, T.sungai + 30)})`, boxShadow: `0 10px 22px -12px ${rgba(B.turq, 0.9)}` }} />
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {JALUR.map((j, i) => (
              <g key={j.k} opacity={j.k === 'speedboat' ? redupSpeed : 1}>
                <Penghubung d={jalurD(j.y)} g={cin(f, T.sungai + 30 + (3 - i) * 15)} warna={j.warna} tebal={4} titik={false} />
                {sorot[j.k] ? <Penghubung d={jalurD(j.y)} g={sorot[j.k]} warna={j.warna} tebal={6} dash={false} titik={false} /> : null}
              </g>))}
            {/* "terus bergerak": langkah kecil di jalan kaki */}
            {[0, 1, 2].map((n) => {
              const a = T.bergerak - 30 + n * 30, t = R(f, a, a + 120, 0, 0.3, io);
              if (t <= 0 || f > a + 120) return null;
              const [x, y] = titikDi(805, t);
              return <circle key={n} cx={x} cy={y} r={10} fill={JALUR_WARNA.jalan} stroke={B.white} strokeWidth={3} opacity={Math.min(R(t, 0, 0.03, 0, 1), R(t, 0.24, 0.3, 1, 0))} />;
            })}
          </svg>
          <Foto k="rumahModern" x={RUMAH.x} y={RUMAH.y} w={RUMAH.w} p={popIn(f, T.sungai + 40)} />
          <Lencana x={RUMAH.x} y={RUMAH.y - 20} d={RUMAH.w * 0.8} p={popIn(f, T.tetap)} warna={CEK} ikon="tersedia" besar={60} />
          {JALUR.map((j, i) => {
            const p = popIn(f, T.sungai + 40 + (3 - i) * 15);
            return (
              <React.Fragment key={j.k}>
                <Kendaraan x={960} y={j.y} d={KD} warna={j.warna} ikon={j.ikon} cermin={j.cermin} p={p} alfa={j.k === 'speedboat' ? redupSpeed : 1} cincin />
                {nomor[j.k] ? <Nomor x={960 - KD * 0.36} y={j.y - KD * 0.36} n={j.k === 'jalan' ? 1 : j.k === 'feri' ? 2 : 3} warna={j.warna} p={popIn(f, nomor[j.k])} d={50} /> : null}
              </React.Fragment>);
          })}
          {/* jalur tercepat (pesawat) belum tentu terbaik */}
          <Chip x={960} y={312} teks="Tercepat" ikon="cepat" warna={JALUR_WARNA.pesawat} p={popIn(f, T.tercepat) * popOut(f, T.penting)} size={26} />
          <Lencana x={960} y={220} d={KD} p={popIn(f, T.belum + 10) * popOut(f, T.penting)} warna={B.orange} teks="?" besar={52} />
          <Lencana x={960} y={220} d={KD} p={popIn(f, T.siap)} warna={CEK} ikon="tersedia" besar={52} />
          <KarakterLingkar pose={MURID_BIRU} x={ORANG.x} y={ORANG.y} D={ORANG.D} s={popIn(f, T.sungai + 20)} warna={B.orange} />
          {/* penjelajah: titik jalan kaki lalu feri, sampai di rumah */}
          {f > T.jalan ? (() => {
            // pindah dari jalan kaki ke feri = lompatan lengkung 40f (bukan teleport)
            const pindah = cin(f, T.naik + 10, 40);
            const [ax, ay] = titikDi(805, jalanT), [bx, by] = titikDi(610, feriT);
            const x = ax + (bx - ax) * pindah, y = ay + (by - ay) * pindah - 50 * Math.sin(Math.PI * pindah);
            return (
              <div style={{ position: 'absolute', left: x - 24, top: y - 24, width: 48, height: 48, borderRadius: '50%', background: B.orange, border: `4px solid ${B.white}`,
                boxSizing: 'border-box', boxShadow: `0 8px 18px -6px ${rgba(B.orange, 0.9)}`, opacity: opa(alfaP(popIn(f, T.jalan + 10))) }} />);
          })() : null}
        </div>) : null}
    </AbsoluteFill>);
};
