import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, F, io, R, rgba } from '../theme';
import { alfaP, ArahKeluar, cin, gayaPapan, Icon, lerp, opa, popOut, skalaPop, useGeser, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { Chevron, Kaca, KarakterLingkar, MaskerKeluar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { garis, ujungGaris, yDari } from '../parts/grafik';
import { LayarPelajaran, Pindah } from '../s01/LayarPelajaran';
import { S04_FERI_AKHIR } from '../s04/Scene04';
import { S06_MASUK } from '../s06/Scene06';
import { S11_KRISIS } from '../data/pasar';
import { Foto } from '../parts/nyata';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Ombak } from '../parts/v04';
import type { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 05 — Indeks Juga Tempat Belajar Menghadapi Volatilitas (BATAS.s5 – BATAS.s6). RELAYOUT 22 Okt (Simon: "secara layout aku masih kurang
 * puas", judul TIDAK ditambahkan) — 04_Asset/Rencana-Relayout-V05.md.
 *  A feri (dari Scene 04) › kartu papan tulis "Tempat belajar" berisi garis naik-turun market
 *  B layar pelajaran sebelumnya (kiri) + kartu "Melewati badai" (ombak V04): market turun · tetap menjalankan rencana ✓
 *  C dua kartu langkah: ② satu saham (risiko) muncul lebih dulu sesuai VO, lalu ① belajar dulu lewat indeks (disorot)
 *  D–E grafik indeks asli (IHSG mingguan 13 Jan 2020 – 11 Jan 2021): −33 % · ±1 tahun, feri menyusuri pemulihan + Rupiah berjalan
 *    (Rp10.000.000 → Rp6.667.000 → kembali); investor: panik & jual (dicoret) · tetap disiplin · bilah pengalaman
 *  F kartu Indeks (feri + 10 perusahaan, risiko tersebar, tempat belajar) › kartu Satu perusahaan (risiko)
 *  G feri di tengah, terhubung ke kartu "Alat investasi" (gambar reksa dana indeks) dan "Tempat belajar" → masker ke pesawat Scene 06.
 * Ikon/chip/lencana = pop easeOutBack; kartu/foto/teks/orang = swipe up; garis = trim path; 60f dipusatkan di kata, stagger 20f.
 */
const A0 = BATAS.s5;
// naskah revisi 21 Okt (NOTE: motion existing tetap dipakai): "Seberapa dalam. Berapa lama." dst. dihapus → grafik D–E tetap
const KATA = ['indeks', 'fungsi', 'tempat', 'naik-turunnya', 'pelajaran', 'melewati', 'badai', 'mengalami', 'market', 'menjalankan', 'rencana',
  'sebelum', 'risiko', 'saham', 'dulu', 'indeks', 'lihat', 'turun', 'dan', 'paling', 'penting', 'reaksi', 'panik', 'disiplin', 'bisa', 'melewati',
  'tanpa', 'takut', 'mulai', 'pengalaman', 'volatilitas', 'karena', 'tersebar', 'indeks', 'belajar', 'satu', 'perusahaan',
  'indeks', 'alat', 'tempat'];
const K = ['indeks', 'fungsi', 'tempat', 'naikTurun', 'pelajaran', 'melewati', 'badai', 'artinya', 'market', 'menjalankan', 'rencana',
  'sebelum', 'risiko', 'saham', 'dulu', 'indeksC', 'lihat', 'turun', 'dalam', 'berapa', 'lama', 'reaksi', 'panik', 'disiplin', 'berhasil', 'melewatiE',
  'tanpa', 'takut', 'mulai', 'pengalaman', 'volatilitas', 'tapi', 'tersebar', 'indeksF', 'belajarF', 'satu', 'perusahaan',
  'indeksG', 'alat', 'kelas'] as const;
const W = urut(KATA, A0);
const T0 = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
const T = { ...T0, pulih: T0.lama, jadi: T0.indeksG };
export const S05_T = T;
export const S05_AKHIR = BATAS.s6;

const FERI = JALUR_WARNA.feri;
const PESAWAT = JALUR_WARNA.pesawat;
const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const MODAL = 10_000_000;
const rp = (v: number) => rpPenuh(Math.round(v / 1000) * 1000);

/* ── data: indeks (IHSG) mingguan 13 Jan 2020 – 11 Jan 2021 — puncak 6.292 → dasar 4.195 (16 Mar 2020, −33 %) → kembali ≥ 6.292 pada 11 Jan 2021 ── */
const TUTUP = S11_KRISIS.map((r) => Number(r[4]));
const DASAR = TUTUP.indexOf(Math.min(...TUTUP));
const PULIH = TUTUP.findIndex((v, i) => i > DASAR && v >= TUTUP[0]);
const DALAM = Math.round((TUTUP[DASAR] / TUTUP[0] - 1) * 100); // −33
const n = TUTUP.length - 1;
const nilaiDi = (g: number) => {
  const u = Math.max(0, Math.min(1, g)) * n, i = Math.min(n - 1, Math.floor(u)), t = Math.min(1, u - i);
  return TUTUP[i] + (TUTUP[i + 1] - TUTUP[i]) * t;
};

/* ── tata letak ── */
const PA = { feri: { x: 580, y: 500, d: 200 }, papan: { x: 1200, y: 500, w: 640, h: 420 } };
const PB = { layar: { x: 580, y: 470, k: 0.56 }, kartu: { x: 1310, y: 520, w: 680, h: 540 } };
const PC = { w: 470, h: 440, x: [680, 1240], y: 520 };
const PANEL = { w: 1120, h: 600, y: 540, x0: 960, x1: 760 };
const PLOT = { x: 64, y: 150, w: 880, h: 320 };
const DOM: [number, number] = [3800, 6600];
const xP = (i: number) => PLOT.x + (PLOT.w * i) / n;
const yP = (v: number) => yDari(v, PLOT.y, PLOT.h, DOM[0], DOM[1]);
const BULAN = [{ i: 0, t: 'Jan 2020' }, { i: 13, t: 'Apr' }, { i: 26, t: 'Jul' }, { i: 39, t: 'Okt' }, { i: 52, t: 'Jan 2021' }];
const ORANG = { x: 1590, y: 450, D: 270 };
const PF = { w: 560, h: 500, x: [640, 1300], y: 520 };
const PG = { feri: { x: 960, y: 500, d: 200 }, kartu: { w: 440, h: 320, x: [500, 1420], y: 500 } };

/** bilah pengalaman (gaya bilah kemampuan Scene 01) */
const BilahPengalaman: React.FC<{ x: number; y: number; p: number; isi: number }> = ({ x, y, p, isi }) => { const ny = useGeser(); return p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x - 170, y - 34 + ny(p)), opacity: opa(alfaP(p)), width: 340, height: 68, borderRadius: 34,
    background: B.white, border: `2.5px solid ${B.blue}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px 0 14px',
    boxShadow: `0 10px 24px -14px ${rgba(B.blue, 0.8)}` }}>
    <Icon name="kemampuan" size={42} color={B.blue} />
    <div style={{ flex: 1, height: 16, borderRadius: 8, background: rgba(B.blue, 0.14), overflow: 'hidden' }}>
      <div style={{ width: `${isi * 100}%`, height: '100%', borderRadius: 8, background: B.blue }} />
    </div>
  </div>); };

/** baris kartu: ikon bulat + teks (rata kiri, koordinat lokal kartu) */
const Baris: React.FC<{ y: number; ikon: KunciIkon; warna: string; teks: string; f: number; at: number; cek?: number }> = ({ y, ikon, warna, teks, f, at, cek = 0 }) => (
  <>
    <Bulat x={92} y={y} d={100} warna={warna} ikon={ikon} p={popIn(f, at)} />
    {cek > 0.001 ? <Lencana x={92} y={y} d={100} p={cek} warna={CEK} ikon="tersedia" besar={44} /> : null}
    <div style={{ position: 'absolute', left: 168, top: y - 22, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
      <WordText f={f} at={at + 10} halus>{teks}</WordText>
    </div>
  </>);

export const Scene05: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f >= S06_MASUK.mulai + 60) return null;

  /* ═ A ═ */
  const serah = cin(f, A0 + 30);
  const ruangA = cin(f, T.tempat - 24);
  const papanA = 1 - cin(f, T.pelajaran); // transisi seragam 22 Okt: 60f di kata, papan lama keluar = papan baru masuk
  const feriA = { x: lerp(lerp(S04_FERI_AKHIR.x, 960, serah), PA.feri.x, ruangA), y: lerp(S04_FERI_AKHIR.y, PA.feri.y, serah), d: S04_FERI_AKHIR.d };
  /* ═ B ═ */
  const papanB = cin(f, T.pelajaran) * (1 - cin(f, T.sebelum));
  const layarX = lerp(960, PB.layar.x, cin(f, T.melewati - 24)); // layar di tengah dulu, ke kiri memberi ruang kartu "Melewati badai"
  /* ═ C ═ */
  const papanC = cin(f, T.sebelum) * (1 - cin(f, T.lihat));
  const sorotC = cin(f, T.indeksC);
  const xC2 = lerp(960, PC.x[1], cin(f, T.dulu - 24)); // kartu ② (muncul lebih dulu sesuai VO) di tengah, ke kanan memberi ruang kartu ①
  /* ═ D–E ═ */
  const keluarD = popOut(f, T.tapi);
  const panelP = popIn(f, T.lihat) * keluarD;
  const px = lerp(PANEL.x0, PANEL.x1, cin(f, T.reaksi - 24));
  const gTurun = (DASAR / n) * cin(f, T.turun, 60);
  const gLine = gTurun + (1 - DASAR / n) * R(f, T.berapa - 10, T.lama + 50, 0, 1, io);
  const jalan = R(f, T.melewatiE - 20, T.melewatiE + 160, 0, 1, io); // feri menyusuri pemulihan
  const gFeri = gLine < DASAR / n - 1e-6 ? gLine : DASAR / n + (1 - DASAR / n) * jalan;
  const chipOut = 1 - cin(f, T.mulai - 10);
  /* ═ F ═ */
  const papanF = cin(f, T.tapi) * (1 - cin(f, T.jadi));
  const xF = lerp(960, PF.x[0], cin(f, T.satu - 24)); // kartu indeks di tengah dulu, ke kiri memberi ruang kartu satu perusahaan
  /* ═ G ═ */
  const papanG = cin(f, T.jadi);

  const P = (x: number, y: number) => ({ x: px - PANEL.w / 2 + x, y: PANEL.y - PANEL.h / 2 + y }); // lokal panel → layar

  return (
    <MaskerKeluar f={f} mulai={S06_MASUK.mulai} ke={S06_MASUK} warna={S06_MASUK.warna}>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {/* ══ A: feri › papan "Tempat belajar" berisi naik-turun market ══ */}
        {papanA > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanA, true) }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d={`M ${feriA.x + feriA.d / 2 + 14} ${PA.feri.y} L ${PA.papan.x - PA.papan.w / 2 - 10} ${PA.feri.y}`} g={cin(f, T.tempat + 10)} warna={FERI} tebal={4} titik={false} />
            </svg>
            <Kendaraan x={feriA.x} y={feriA.y} d={feriA.d} warna={FERI} ikon="feri" cermin p={1} />
            <Label x={feriA.x} y={feriA.y + feriA.d / 2 + 40} teks="Indeks" f={f} at={T.indeks + 20} size={34} />
            <Kaca x={PA.papan.x} y={PA.papan.y} w={PA.papan.w} h={PA.papan.h} p={popIn(f, T.tempat)} warna={B.turq} tab="atas">
              <Bulat x={82} y={84} d={96} warna={B.turq} ikon="kelas" p={popIn(f, T.tempat + 10)} />
              <div style={{ position: 'absolute', left: 150, top: 62, fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
                <WordText f={f} at={T.tempat + 10} halus>Tempat belajar</WordText>
              </div>
              <svg width={PA.papan.w} height={PA.papan.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                {[0, 1, 2].map((k) => <line key={k} x1={48} x2={48 + (PA.papan.w - 96) * cin(f, T.tempat + 20 + k * 6)} y1={186 + k * 70} y2={186 + k * 70} stroke={rgba(B.gray, 0.18)} strokeWidth={1.5} />)}
                {cin(f, T.naikTurun, 70) > 0.001 ? <polyline points={garis(TUTUP, 48, 180, PA.papan.w - 96, 150, Math.min(...TUTUP), Math.max(...TUTUP), cin(f, T.naikTurun, 70))}
                  fill="none" stroke={FERI} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" /> : null}
              </svg>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 352, textAlign: 'center', fontFamily: F, fontSize: 28, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
                <WordText f={f} at={T.naikTurun + 20} halus>Naik-turunnya market</WordText>
              </div>
            </Kaca>
          </div>) : null}

        {/* ══ B: layar pelajaran sebelumnya + kartu "Melewati badai" ══ */}
        {papanB > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanB, f > T.sebelum - 40) }}>
            <Pindah x={layarX} y={PB.layar.y} k={PB.layar.k}>
              <LayarPelajaran s={popIn(f, T.pelajaran)} progres={1} sorot={1} />
            </Pindah>
            <Label x={layarX} y={PB.layar.y + 185 + 44} teks="Pelajaran sebelumnya" f={f} at={T.pelajaran + 20} size={32} lebar={420} />
            <Kaca x={PB.kartu.x} y={PB.kartu.y} w={PB.kartu.w} h={PB.kartu.h} p={popIn(f, T.melewati)} warna={B.blue} tab="atas">
              <Ombak x={PB.kartu.w / 2} y={96} w={330} p={popIn(f, T.melewati + 10)} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 168, textAlign: 'center', fontFamily: F, fontSize: 44, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                <WordText f={f} at={T.melewati + 10} halus>“Melewati badai”</WordText>
              </div>
              <div style={{ position: 'absolute', left: 48, right: 48, top: 250, height: 2, background: rgba(B.night, 0.07), opacity: cin(f, T.market - 20) }} />
              <Baris y={330} ikon="pasarTurun" warna={ARAH.turun} teks="Market turun" f={f} at={T.market} />
              <Baris y={450} ikon="rencana" warna={B.turq} teks="Tetap menjalankan rencana" f={f} at={T.menjalankan} cek={popIn(f, T.rencana + 10)} />
            </Kaca>
          </div>) : null}

        {/* ══ C: ② satu saham (risiko) ← ① belajar dulu lewat indeks ══ */}
        {papanC > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanC, f > T.lihat - 40) }}>
            <Chevron x={960} y={PC.y} warna={B.gray} p={popIn(f, T.indeksC + 20)} />
            {[0, 1].map((i) => {
              const indeks = i === 0;
              const at = indeks ? T.dulu : T.sebelum; // kartu 02 = elemen pertama papan C, masuk bersamaan papan B keluar
              const warna = indeks ? FERI : PESAWAT;
              return (
                <Kaca key={i} x={indeks ? PC.x[0] : xC2} y={PC.y} w={PC.w} h={PC.h} p={popIn(f, at)} warna={warna} tab="atas" tepi={indeks ? sorotC : 0} alfa={indeks ? 1 : 1 - 0.4 * sorotC}>
                  <Nomor x={48} y={48} n={i + 1} warna={warna} p={popIn(f, at + 10)} d={60} />
                  <Kendaraan x={PC.w / 2} y={150} d={170} warna={warna} ikon={indeks ? 'feri' : 'pesawat'} cermin={indeks} p={popIn(f, at + 10)} />
                  {!indeks ? <Lencana x={PC.w / 2} y={150} d={170} p={popIn(f, T.saham)} warna={B.orange} ikon="risiko" besar={64} /> : null}
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                    <WordText f={f} at={indeks ? T.indeksC : T.saham} halus>{indeks ? 'Indeks' : 'Satu saham'}</WordText>
                  </div>
                  <Chip x={PC.w / 2} y={364} teks={indeks ? 'Belajar dulu' : 'Risiko lebih besar'} ikon={indeks ? 'kelas' : 'risiko'} warna={indeks ? B.turq : B.orange}
                    p={popIn(f, indeks ? T.dulu + 20 : T.saham + 20)} size={28} />
                </Kaca>);
            })}
          </div>) : null}

        <ArahKeluar aktif={f > T.tapi - 50}>
        {/* ══ D–E: grafik indeks asli — seberapa dalam · berapa lama · feri menyusuri pemulihan + Rupiah berjalan ══ */}
        {panelP > 0.001 ? (
          <Kaca x={px} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={panelP} warna={FERI} tab="atas">
            <div style={{ position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'center', gap: 14, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: FERI, display: 'grid', placeItems: 'center' }}><Icon name="feri" size={36} color={B.white} style={{ transform: 'scaleX(-1)' }} /></div>
              <WordText f={f} at={T.lihat + 30} halus>Indeks saham Indonesia · 2020</WordText>
            </div>
            <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <rect x={xP(DASAR)} y={PLOT.y} width={xP(PULIH) - xP(DASAR)} height={PLOT.h} fill={rgba(B.turq, 0.14 * cin(f, T.pulih))} />
              {[4000, 5000, 6000].map((v) => (
                <g key={v}>
                  <line x1={PLOT.x} x2={PLOT.x + PLOT.w * cin(f, T.lihat + 30)} y1={yP(v)} y2={yP(v)} stroke={rgba(B.gray, 0.2)} strokeWidth={1.5} />
                  <text x={PLOT.x + PLOT.w + 14} y={yP(v) + 8} fontFamily={F} fontSize={22} fontWeight={700} fill={B.gray} opacity={cin(f, T.lihat + 30)}>{v.toLocaleString('id-ID')}</text>
                </g>))}
              {BULAN.map((b) => (
                <text key={b.t} x={xP(b.i)} y={PLOT.y + PLOT.h + 40} textAnchor={b.i === 0 ? 'start' : b.i === n ? 'end' : 'middle'} fontFamily={F} fontSize={22} fontWeight={700}
                  fill={B.gray} opacity={cin(f, T.lihat + 40)}>{b.t}</text>))}
              {gLine > 0.001 ? <polyline points={garis(TUTUP, PLOT.x, PLOT.y, PLOT.w, PLOT.h, DOM[0], DOM[1], gLine)} fill="none" stroke={FERI} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" /> : null}
              {(() => {
                const g = cin(f, T.dalam - 10);
                if (g <= 0.001) return null;
                const x = xP(DASAR) + 34, y0 = yP(TUTUP[0]), y1 = yP(TUTUP[DASAR]);
                return (
                  <g>
                    <line x1={PLOT.x} x2={PLOT.x + (x - PLOT.x) * g} y1={y0} y2={y0} stroke={ARAH.turun} strokeWidth={2.5} strokeDasharray="6 8" />
                    <line x1={x} x2={x} y1={y0} y2={y0 + (y1 - y0) * g} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" />
                    <line x1={x - 10} x2={x + 10} y1={y0} y2={y0} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" />
                    {g > 0.95 ? <line x1={x - 10} x2={x + 10} y1={y1} y2={y1} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" /> : null}
                  </g>);
              })()}
              {(() => {
                const g = cin(f, T.lama + 20);
                if (g <= 0.001) return null;
                const y = PLOT.y - 26, x0 = xP(0), x1 = xP(PULIH);
                return (
                  <g>
                    <line x1={x0} x2={x0 + (x1 - x0) * g} y1={y} y2={y} stroke={B.turq} strokeWidth={4} strokeLinecap="round" />
                    <line x1={x0} x2={x0} y1={y - 10} y2={y + 10} stroke={B.turq} strokeWidth={4} strokeLinecap="round" />
                    {g > 0.95 ? <line x1={x1} x2={x1} y1={y - 10} y2={y + 10} stroke={B.turq} strokeWidth={4} strokeLinecap="round" /> : null}
                  </g>);
              })()}
            </svg>
          </Kaca>) : null}
        {panelP > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, keluarD * 1.5) }}>
            {(() => { const a = P(xP(DASAR) + 50, (yP(TUTUP[0]) + yP(TUTUP[DASAR])) / 2); return <Chip x={a.x} y={a.y} teks={`−${Math.abs(DALAM)}%`} warna={ARAH.turun} p={popIn(f, T.dalam)} size={28} jangkar="kiri" />; })()}
            {(() => { const a = P((xP(0) + xP(PULIH)) / 2, PLOT.y - 26); return <Chip x={a.x} y={a.y} teks="±1 tahun" ikon="kurangWaktu" warna={B.turq} p={popIn(f, T.lama + 30)} size={26} />; })()}
            {gLine > 0.001 ? (() => {
              const [hx, hy] = ujungGaris(TUTUP, PLOT.x, PLOT.y, PLOT.w, PLOT.h, DOM[0], DOM[1], gFeri);
              const a = P(hx, hy);
              const v = (MODAL * nilaiDi(gFeri)) / TUTUP[0];
              return (
                <>
                  <Kendaraan x={a.x} y={a.y} d={72} warna={FERI} ikon="feri" cermin p={popIn(f, T.turun - 20)} />
                  {/* Rupiah berjalan bersama feri (modal Rp10.000.000) — di bawah feri, menjauhi garis */}
                  <PilNominal x={P(PANEL.w - 40, 62).x} y={P(0, 62).y} teks={rp(v)} arah={Math.max(-1, Math.min(1, ((v - MODAL) / MODAL) * 6))}
                    p={popIn(f, T.turun)} size={28} jangkar="kanan" lebarMin={236} />
                </>);
            })() : null}
          </div>) : null}
        {panelP > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0 }}>
            <KarakterLingkar pose={MURID_BIRU} x={ORANG.x} y={ORANG.y} D={ORANG.D} s={popIn(f, T.reaksi) * keluarD} warna={B.orange} />
            <div style={{ position: 'absolute', inset: 0, opacity: chipOut }}>
              <Chip x={ORANG.x} y={ORANG.y + ORANG.D / 2 + 60} teks="Panik & jual" ikon="jual" warna={B.gray} p={popIn(f, T.panik) * keluarD}
                coret={R(f, T.takut - 10, T.takut + 20, 0, 1, io)} size={28} />
              <Chip x={ORANG.x} y={ORANG.y + ORANG.D / 2 + 130} teks="Tetap disiplin" ikon="disiplin" warna={CEK} p={popIn(f, T.disiplin) * keluarD} size={28} />
            </div>
            <BilahPengalaman x={ORANG.x} y={ORANG.y + ORANG.D / 2 + 90} p={popIn(f, T.pengalaman) * keluarD} isi={0.15 + 0.85 * cin(f, T.volatilitas, 90)} />
            <Lencana x={ORANG.x} y={ORANG.y} d={ORANG.D} p={popIn(f, T.berhasil) * keluarD} warna={CEK} ikon="tersedia" besar={64} />
          </div>) : null}
        </ArahKeluar>

        {/* ══ F: kartu Indeks (risiko tersebar, tempat belajar) › kartu Satu perusahaan ══ */}
        {papanF > 0.001 && f > T.tapi - 40 ? (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanF, f > T.jadi - 40) }}>
            <Chevron x={(xF + PF.w / 2 + PF.x[1] - PF.w / 2) / 2} y={PF.y} warna={B.gray} p={popIn(f, T.satu + 10)} />
            <Kaca x={xF} y={PF.y} w={PF.w} h={PF.h} p={popIn(f, T.tapi)} warna={FERI} tab="atas">
              {Array.from({ length: 10 }, (_, k) => {
                const a = (-90 + k * 36) * Math.PI / 180, rr = lerp(60, 140, cin(f, T.tersebar));
                const p = popIn(f, T.tapi + 20 + k * 4);
                return p > 0.001 ? <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 54, height: 54, borderRadius: '50%', background: FERI, border: `3px solid ${B.white}`,
                  boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `${geser(PF.w / 2 + rr * Math.cos(a) - 27, 190 + rr * Math.sin(a) - 27)} scale(${skalaPop(p)})`,
                  boxShadow: `0 8px 18px -10px ${rgba(FERI, 0.9)}` }}><Icon name="perusahaan" size={28} color={B.white} /></div> : null;
              })}
              <Kendaraan x={PF.w / 2} y={190} d={150} warna={FERI} ikon="feri" cermin p={popIn(f, T.tapi + 10)} />
              <Lencana x={PF.w / 2} y={190} d={150} p={popIn(f, T.belajarF)} warna={B.turq} ikon="kelas" besar={60} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                <WordText f={f} at={T.indeksF} halus>Indeks</WordText>
              </div>
              <Chip x={PF.w / 2} y={444} teks="Risiko tersebar" ikon="portofolio" warna={FERI} p={popIn(f, T.tersebar + 10)} size={28} />
            </Kaca>
            <Kaca x={PF.x[1]} y={PF.y} w={PF.w} h={PF.h} p={popIn(f, T.satu)} warna={B.orange} tab="atas">
              <Bulat x={PF.w / 2} y={190} d={170} warna={B.orange} ikon="perusahaan" p={popIn(f, T.satu + 10)} />
              <Lencana x={PF.w / 2} y={190} d={170} p={popIn(f, T.perusahaan)} warna={B.orange} ikon="risiko" besar={64} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                <WordText f={f} at={T.satu + 10} halus>Satu perusahaan</WordText>
              </div>
              <Chip x={PF.w / 2} y={444} teks="Risiko terpusat" ikon="risiko" warna={B.orange} p={popIn(f, T.perusahaan + 10)} size={28} />
            </Kaca>
          </div>) : null}

        {/* ══ G: indeks = alat investasi + tempat belajar ══ */}
        {papanG > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0 }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d={`M ${PG.feri.x - PG.feri.d / 2 - 12} ${PG.feri.y} L ${PG.kartu.x[0] + PG.kartu.w / 2 + 10} ${PG.feri.y}`} g={cin(f, T.alat - 20)} warna={FERI} tebal={4} titik={false} />
              <Penghubung d={`M ${PG.feri.x + PG.feri.d / 2 + 12} ${PG.feri.y} L ${PG.kartu.x[1] - PG.kartu.w / 2 - 10} ${PG.feri.y}`} g={cin(f, T.kelas - 20)} warna={B.turq} tebal={4} titik={false} />
            </svg>
            <Kendaraan x={PG.feri.x} y={PG.feri.y} d={PG.feri.d} warna={FERI} ikon="feri" cermin p={popIn(f, T.indeksG)} />
            <Label x={PG.feri.x} y={PG.feri.y + PG.feri.d / 2 + 40} teks="Indeks" f={f} at={T.indeksG + 10} size={34} />
            <Kaca x={PG.kartu.x[0]} y={PG.kartu.y} w={PG.kartu.w} h={PG.kartu.h} p={popIn(f, T.alat)} warna={FERI} tab="atas">
              <Foto k="rdIndeks" x={PG.kartu.w / 2} y={128} w={196} p={1} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                <WordText f={f} at={T.alat + 10} halus>Alat investasi</WordText>
              </div>
            </Kaca>
            <Kaca x={PG.kartu.x[1]} y={PG.kartu.y} w={PG.kartu.w} h={PG.kartu.h} p={popIn(f, T.kelas)} warna={B.turq} tab="atas">
              <Bulat x={PG.kartu.w / 2} y={128} d={150} warna={B.turq} ikon="kelas" p={popIn(f, T.kelas + 10)} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                <WordText f={f} at={T.kelas + 10} halus>Tempat belajar</WordText>
              </div>
            </Kaca>
          </div>) : null}
      </AbsoluteFill>
    </MaskerKeluar>);
};
