import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, CEK, F, io, R, rgba } from '../theme';
import { cin, gayaPapan, Icon, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Lencana } from '../parts/umum';
import { Kaca, KarakterLingkar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { Pijakan, pusatRumah, RumahIso } from '../parts/v04';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { JEMBATAN_W, pusatSungai, Sungai } from '../parts/sungai';
import { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { IsiLangkah, KL } from '../s07/Scene07';

/**
 * SCENE 08 — Penutup: Kembali ke Sungai (BATAS.s8 – akhir). Ide: 04_Asset/Ide-Visual-Scene-08.md.
 * Naskah revisi 21 Okt (dipendekkan): A "ingat urutannya": RELAYOUT 22 Okt — tiga KARTU LANGKAH Scene 07 MENYATU jadi tiga baris ringkasan
 * (bangun fondasi · gunakan indeks · sebagian kecil untuk belajar memilih saham), tiap baris dicentang di kata kuncinya (pola V03 7:15) → B PETA SUNGAI Scene 01 (geometri sama): rumah di seberang tetap sama; yang
 * berubah hanya kendaraan (cincin sorot berurutan) yang sesuai kemampuan kita sekarang (chip di investor) → C jalur dinomori: ① fondasi (jalan kaki)
 * ② naik feri ③ terbang → penjelajah sampai di rumah. Sesudahnya: outro "Di video selanjutnya" (src/outro).
 */
const A0 = BATAS.s8;
const KATA = ['urutannya', 'bangun', 'fondasi', 'relatif', 'gunakan', 'indeks', 'perjalanan', 'jangka', 'setelah', 'kemampuanmu', 'sebagian', 'memilih',
  'sekarang', 'sungai', 'rumah', 'tetap', 'berubah', 'kendaraan', 'kemampuan', 'fondasi', 'naik', 'terbang'];
const K = ['tiga', 'pertama', 'fondasi', 'relatif', 'kedua', 'indeks', 'perjalanan', 'jangka', 'ketiga', 'kemampuan', 'sebagian', 'memilih',
  'sekarang', 'sungai', 'rumah', 'tetap', 'berubah', 'kendaraan', 'kemampuanB', 'jalan', 'naik', 'terbang'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S08_T = T;

const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };

/* ── A: tiga baris ringkasan ── */
type Butir = { teks: string; ikon: KunciIkon; at: number; coret?: number };
const BARIS = { w: 1240, h: 170, gap: 26 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pusatBaris = (i: number) => 540 + (i - 1) * (BARIS.h + BARIS.gap);

/* ── B–C: peta sungai — geometri Scene 01 (src/s01/Scene01.tsx) ── */
// brief Video 04 (22 Okt): sama dengan Scene 01 — investor di PIJAKAN isometrik V04, rumah isometrik V04 (pojok kiri pijakannya = P1)
// samakan dengan revisi Scene 01 (Simon 22 Okt): baris jalur 220 px (139/359/579/799), isi berpusat 497 (di atas subtitle), sungai mengalir,
// garis putus-putus trim path, investor menghadap kanan
const ORANG = { x: 258, y: 509, D: 200 };
const PIJAKAN = { x: 258, y: 579, a: 140 };
const P0 = { x: 398, y: 579 }, P1 = { x: 1478, y: 579 };
const SUNGAI = { x0: 770, x1: 1150, top: 30, bottom: 1040 };
const FERI_Y = 579, JALAN_Y = 799, PESAWAT_Y = 139;
const RUMAH_W = 340;
const RUMAH_PUSAT = pusatRumah(P1.x, P1.y, RUMAH_W);
const KD = 116;
type Jalur = { k: string; y: number; warna: string; ikon: KunciIkon; cermin: boolean };
const JALUR: Jalur[] = [
  { k: 'pesawat', y: PESAWAT_Y, warna: JALUR_WARNA.pesawat, ikon: 'pesawat', cermin: false },
  { k: 'speedboat', y: 359, warna: JALUR_WARNA.speedboat, ikon: 'speedboat', cermin: true },
  { k: 'feri', y: FERI_Y, warna: JALUR_WARNA.feri, ikon: 'feri', cermin: true },
  { k: 'jalan', y: JALAN_Y, warna: JALUR_WARNA.jalan, ikon: 'jalanKaki', cermin: false },
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
  // kartu Scene 07 (cangkang, isi sudah pudar) → baris ringkasan (60f); papan keluar ke atas di "Sekarang" bersamaan peta masuk (tanpa frame kosong)
  const keluarA = 1 - cin(f, T.sekarang); // transisi seragam 22 Okt: papan keluar = peta masuk, 60f di kata
  const jadiBaris = cin(f, A0 + 30);
  const isiBaris = cin(f, A0 + 30); // isi baris masuk & isi kartu S07 keluar DALAM 60f penyatuan yang sama
  const cek = [T.relatif, T.jangka, T.memilih];
  /* ═ B–C ═ */
  const keMap = cin(f, T.sekarang); // kendaraan tiga baris DIBAWA ke jalurnya di peta sungai
  const sungaiP = cin(f, T.sekarang + 20);
  const sorot: Record<string, number> = { jalan: cin(f, T.jalan + 10), feri: cin(f, T.naik + 20), pesawat: cin(f, T.terbang + 10) };
  const redupSpeed = 1 - 0.7 * cin(f, T.jalan); // urutan akhir = fondasi → feri → terbang (speedboat di luar urutan)
  const nomor: Record<string, number> = { jalan: T.jalan + 20, feri: T.naik + 30, pesawat: T.terbang + 20 };
  // penjelajah: jalan kaki (P0 → jembatan) di "Fondasi dulu" → pindah ke feri menyeberang → sampai rumah sebelum outro
  const jalanT = R(f, T.jalan, T.jalan + 60, 0, 0.32, io);
  const feriT = R(f, T.naik + 10, T.naik + 70, 0.32, 1, io);

  const rows: { warna: string; ikon: KunciIkon; cermin: boolean; judul: string; judulAt: number; at: number; butir: Butir[] }[] = [
    { warna: JALUR_WARNA.jalan, ikon: 'jalanKaki', cermin: false, judul: 'Bangun fondasi', judulAt: T.fondasi, at: T.pertama,
      butir: [{ teks: 'Investasi relatif stabil', ikon: 'fondasi', at: T.relatif }] },
    { warna: JALUR_WARNA.feri, ikon: 'feri', cermin: true, judul: 'Gunakan indeks', judulAt: T.indeks, at: T.kedua,
      butir: [{ teks: 'Perjalanan jangka panjang', ikon: 'waktu', at: T.perjalanan }] },
    { warna: JALUR_WARNA.pesawat, ikon: 'pesawat', cermin: false, judul: 'Sebagian kecil: belajar memilih saham', judulAt: T.sebagian, at: T.ketiga,
      butir: [{ teks: 'Setelah kemampuan berkembang', ikon: 'kemampuan', at: T.kemampuan }] },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A: "ingat urutannya" — kartu langkah Scene 07 menyatu jadi tiga baris ringkasan ══ */}
      {keluarA > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(keluarA, true) }}>
          {rows.map((r, i) => {
            const x = lerp(KL.x[i], 960, jadiBaris), y = lerp(KL.y[i], pusatBaris(i), jadiBaris);
            const w = lerp(KL.w, BARIS.w, jadiBaris), h = lerp(KL.h, BARIS.h, jadiBaris);
            return (
              <Kaca key={i} x={x} y={y} w={w} h={h} p={1} warna={r.warna} tab="atas" tepi={Math.max(0.6 * (1 - jadiBaris), cin(f, cek[i] + 20))}>
                {/* isi kartu langkah S07 mengecil & memudar di dalam cangkang yang menyatu */}
                {jadiBaris < 0.999 ? (() => {
                  const k = Math.min(w / KL.w, h / KL.h);
                  return <div style={{ position: 'absolute', left: (w - KL.w * k) / 2, top: (h - KL.h * k) / 2, width: KL.w, height: KL.h, transformOrigin: '0 0',
                    transform: `scale(${k})`, opacity: 1 - jadiBaris }}><IsiLangkah i={i} f={f} /></div>;
                })() : null}
                {isiBaris > 0.001 ? (
                  <div style={{ position: 'absolute', inset: 0, opacity: isiBaris < 0.9999 ? isiBaris : undefined }}>
                    <Nomor x={62} y={BARIS.h / 2 + 6} n={i + 1} warna={r.warna} p={1} d={52} />
                    {keMap < 0.001 ? <Kendaraan x={160} y={BARIS.h / 2 + 6} d={104} warna={r.warna} ikon={r.ikon} cermin={r.cermin} p={1} /> : null}
                    <div style={{ position: 'absolute', left: 236, top: 34, fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '46px' }}>
                      <WordText f={f} at={r.at + 20} halus>{r.judul}</WordText>
                    </div>
                    <div style={{ position: 'absolute', left: 236, top: 100, display: 'flex', gap: 14 }}>
                      {r.butir.map((b, k) => {
                        const q = popIn(f, b.at);
                        return q > 0.001 ? (
                          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, background: rgba(r.warna, 0.12),
                            fontFamily: F, fontSize: 26, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', transform: `scale(${skalaPop(q)})`, transformOrigin: 'left center' }}>
                            <Icon name={b.ikon} size={28} color={r.warna} />{b.teks}
                          </div>) : null;
                      })}
                    </div>
                    {i === 2 ? (
                      <div style={{ position: 'absolute', right: 150, top: 100, width: 220, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end',
                        fontFamily: F, fontSize: 22, fontWeight: 700, color: B.gray }}>
                        {/* batang = pil bulat → trim kiri → kanan (dulu pudar) */}
                        <div style={{ width: 220, height: 18, borderRadius: 9, background: rgba(B.grayLite, 0.7), overflow: 'hidden', position: 'relative',
                          transform: `scaleX(${cin(f, T.sebagian - 10)})`, transformOrigin: 'left center' }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, height: 18, width: 220 * 0.9 * cin(f, T.sebagian), background: JALUR_WARNA.feri }} />
                          <div style={{ position: 'absolute', left: 220 * 0.9, top: 0, height: 18, width: 220 * 0.1 * cin(f, T.sebagian + 30), background: JALUR_WARNA.pesawat }} />
                        </div>
                        <WordText f={f} at={T.sebagian} halus>Sebagian kecil dana</WordText>
                      </div>) : null}
                    {/* centang di kata kunci tiap langkah (pola V03 7:15) */}
                    <Lencana x={BARIS.w - 70} y={BARIS.h / 2 + 6} d={0} p={popIn(f, cek[i] + 20)} warna={CEK} ikon="tersedia" besar={72} />
                  </div>) : null}
              </Kaca>);
          })}
        </div>) : null}

      {/* ══ B–C: peta sungai — tiap elemen masuk sendiri (sungai trim, pijakan dari kiri, rumah dari kanan, investor pop); kendaraan DIBAWA dari baris ══ */}
      {keMap > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Sungai id="s08" top={SUNGAI.top} bottom={SUNGAI.bottom} p={sungaiP} alir={f / 60} />
          {/* jembatan jalan kaki */}
          <div style={{ position: 'absolute', left: pusatSungai(JALAN_Y, 960, SUNGAI.top) - JEMBATAN_W / 2, top: JALAN_Y - 17, width: JEMBATAN_W, height: 34, borderRadius: 17, background: B.white,
            border: `3px solid ${B.turq}`, boxSizing: 'border-box', transformOrigin: '50% 50%', transform: `scaleX(${cin(f, T.sungai + 30)})`, boxShadow: `0 10px 22px -12px ${rgba(B.turq, 0.9)}` }} />
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {JALUR.map((j, i) => (
              <g key={j.k} opacity={j.k === 'speedboat' ? redupSpeed : 1}>
                <Penghubung d={jalurD(j.y)} g={cin(f, T.sungai + 30 + (3 - i) * 15)} warna={j.warna} tebal={4} titik={false} pola="putus" />
                {sorot[j.k] ? <Penghubung d={jalurD(j.y)} g={sorot[j.k]} warna={j.warna} tebal={6} dash={false} titik={false} /> : null}
              </g>))}
            {/* "yang berubah hanyalah kendaraan": cincin sorot tergambar (trim path) di tiap kendaraan berurutan, bawah → atas */}
            {JALUR.map((j, i) => {
              const g = cin(f, T.kendaraan + (3 - i) * 15) * (1 - cin(f, T.jalan));
              return g > 0.001 ? <circle key={j.k} cx={960} cy={j.y} r={KD / 2 + 14} fill="none" stroke={j.warna} strokeWidth={5} pathLength={1}
                strokeDasharray={`${g} 1`} transform={`rotate(-90 960 ${j.y})`} strokeLinecap="round" opacity={j.k === 'speedboat' ? redupSpeed : 1} /> : null;
            })}
          </svg>
          <RumahIso x={P1.x} y={P1.y} w={RUMAH_W} p={popIn(f, T.sungai + 40)} />
          <Lencana x={RUMAH_PUSAT.x} y={RUMAH_PUSAT.y - 20} d={RUMAH_W * 0.8} p={popIn(f, T.tetap)} warna={CEK} ikon="tersedia" besar={60} />
          {JALUR.map((j, i) => {
            // jalan · feri · pesawat = kendaraan baris ringkasan yang DIBAWA (dari kotak baris → jalurnya); speedboat pop sendiri
            const r = j.k === 'jalan' ? 0 : j.k === 'feri' ? 1 : j.k === 'pesawat' ? 2 : -1;
            const p = r < 0 ? popIn(f, T.sungai + 40 + (3 - i) * 15) : 1;
            const asal = r < 0 ? null : { x: 960 - BARIS.w / 2 + 160, y: pusatBaris(r) + 6 - 1080 * (1 - keluarA), d: 104 };
            const x = asal ? lerp(asal.x, 960, keMap) : 960, y = asal ? lerp(asal.y, j.y, keMap) : j.y, d = asal ? lerp(asal.d, KD, keMap) : KD;
            return (
              <React.Fragment key={j.k}>
                <Kendaraan x={x} y={y} d={d} warna={j.warna} ikon={j.ikon} cermin={j.cermin} p={p} alfa={j.k === 'speedboat' ? redupSpeed : 1} cincin={keMap > 0.5} />
                {nomor[j.k] ? <Nomor x={960 - KD * 0.36} y={j.y - KD * 0.36} n={j.k === 'jalan' ? 1 : j.k === 'feri' ? 2 : 3} warna={j.warna} p={popIn(f, nomor[j.k])} d={50} /> : null}
              </React.Fragment>);
          })}
          {/* pesawat dicentang saat "baru belajar terbang" (urutan selesai) */}
          <Lencana x={960} y={PESAWAT_Y} d={KD} p={popIn(f, T.terbang + 20)} warna={CEK} ikon="tersedia" besar={52} />
          <Pijakan x={PIJAKAN.x} y={PIJAKAN.y} a={PIJAKAN.a} p={popIn(f, T.sungai + 10)} />
          <KarakterLingkar pose={MURID_BIRU} x={ORANG.x} y={ORANG.y} D={ORANG.D} s={popIn(f, T.sungai + 20)} warna={B.orange} cermin />
          {/* "…sesuai dengan kemampuan kita sekarang" */}
          <Chip x={ORANG.x} y={729} teks="Sesuai kemampuanmu" ikon="kemampuan" warna={B.blue} p={popIn(f, T.kemampuanB)} size={26} />
          {/* penjelajah: titik jalan kaki lalu feri, sampai di rumah */}
          {f > T.jalan ? (() => {
            // pindah dari jalan kaki ke feri = lompatan lengkung 40f (bukan teleport)
            const pindah = cin(f, T.naik + 10);
            const [ax, ay] = titikDi(JALAN_Y, jalanT), [bx, by] = titikDi(FERI_Y, feriT);
            const x = ax + (bx - ax) * pindah, y = ay + (by - ay) * pindah - 50 * Math.sin(Math.PI * pindah);
            return (
              <div style={{ position: 'absolute', left: x - 24, top: y - 24, width: 48, height: 48, borderRadius: '50%', background: B.orange, border: `4px solid ${B.white}`,
                boxSizing: 'border-box', boxShadow: `0 8px 18px -6px ${rgba(B.orange, 0.9)}`, transform: `scale(${skalaPop(popIn(f, T.jalan + 10))})` }} />);
          })() : null}
        </div>) : null}
    </AbsoluteFill>);
};
