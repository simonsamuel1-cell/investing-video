import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, F, io, R, rgba } from '../theme';
import { alfaP, ArahKeluar, cin, Icon, opa, popOut, skalaPop, useGeser, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Label, Lencana, geser } from '../parts/umum';
import { Kaca, KarakterLingkar, MaskerKeluar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { garis, ujungGaris, yDari } from '../parts/grafik';
import { LayarPelajaran, Pindah } from '../s01/LayarPelajaran';
import { S04_FERI_AKHIR } from '../s04/Scene04';
import { S06_MASUK } from '../s06/Scene06';
import { S11_KRISIS } from '../data/pasar';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 05 — Indeks Juga Tempat Belajar Menghadapi Volatilitas (BATAS.s5 – BATAS.s6). Ide: 04_Asset/Ide-Visual-Scene-05.md.
 * Serah-terima feri Scene 04 → A feri + "tempat belajar" (kelas) + garis naik-turun pasar → B layar pelajaran sebelumnya (pemutar Scene 01, diperkecil)
 * → kutipan "Melewati badai" → market turun + tetap menjalankan rencana → C urutan: ① indeks dulu ② satu saham (risiko) → D–E grafik indeks asli
 * (IHSG mingguan 13 Jan 2020 – 11 Jan 2021; tanpa label "IHSG" — Simon 16 Okt): turun −33 % · pulih ±1 tahun, feri menunggu di dasar lalu
 * menyusuri pemulihan; investor: panik & jual (dicoret) vs tetap disiplin, bilah pengalaman → F risiko tersebar (feri + 10 perusahaan) sebelum
 * satu perusahaan → G investor berkembang + indeks = alat investasi + kelas belajar → masker ke pesawat Scene 06.
 */
const A0 = BATAS.s5;
const KATA = ['indeks', 'fungsi', 'tempat', 'naik-turunnya', 'pelajaran', 'melewati', 'badai', 'artinya', 'market', 'menjalankan', 'rencana',
  'sebelum', 'risiko', 'saham', 'dulu', 'indeks', 'lihat', 'turun', 'dalam', 'berapa', 'lama', 'reaksi', 'panik', 'disiplin', 'berhasil', 'melewati',
  'tanpa', 'takut', 'mulai', 'pengalaman', 'volatilitas', 'cepat', 'pulih', 'tapi', 'tersebar', 'indeks', 'belajar', 'satu', 'perusahaan', 'jadi',
  'investor', 'berkembang', 'indeks', 'alat', 'kelas'];
const K = ['indeks', 'fungsi', 'tempat', 'naikTurun', 'pelajaran', 'melewati', 'badai', 'artinya', 'market', 'menjalankan', 'rencana',
  'sebelum', 'risiko', 'saham', 'dulu', 'indeksC', 'lihat', 'turun', 'dalam', 'berapa', 'lama', 'reaksi', 'panik', 'disiplin', 'berhasil', 'melewatiE',
  'tanpa', 'takut', 'mulai', 'pengalaman', 'volatilitas', 'cepat', 'pulih', 'tapi', 'tersebar', 'indeksF', 'belajarF', 'satu', 'perusahaan', 'jadi',
  'investor', 'berkembang', 'indeksG', 'alat', 'kelas'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S05_T = T;
export const S05_AKHIR = BATAS.s6;

const FERI = JALUR_WARNA.feri;
const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };

/* ── data: indeks (IHSG) mingguan 13 Jan 2020 – 11 Jan 2021 — puncak 6.292 → dasar 4.195 (16 Mar 2020, −33 %) → kembali ≥ 6.292 pada 11 Jan 2021 ── */
const TUTUP = S11_KRISIS.map((r) => Number(r[4]));
const DASAR = TUTUP.indexOf(Math.min(...TUTUP)); // 9
const PULIH = TUTUP.findIndex((v, i) => i > DASAR && v >= TUTUP[0]); // 52
const DALAM = Math.round((TUTUP[DASAR] / TUTUP[0] - 1) * 100); // −33
const n = TUTUP.length - 1;

/* ── tata letak ── */
const PANEL = { w: 1080, h: 560, y: 540, x0: 960, x1: 760 }; // QA pusat: −40 → +40 // panel bergeser kiri memberi ruang investor
const PLOT = { x: 60, y: 130, w: 840, h: 300 }; // lokal panel
const DOM: [number, number] = [3800, 6600];
const xP = (i: number) => PLOT.x + (PLOT.w * i) / n;
const yP = (v: number) => yDari(v, PLOT.y, PLOT.h, DOM[0], DOM[1]);
const BULAN = [{ i: 0, t: 'Jan 2020' }, { i: 13, t: 'Apr' }, { i: 26, t: 'Jul' }, { i: 39, t: 'Okt' }, { i: 52, t: 'Jan 2021' }];
const ORANG = { x: 1540, y: 470, D: 250 };

/** garis naik-turun kecil (data yang sama) */
const Sparkline: React.FC<{ x: number; y: number; w: number; h: number; g: number; warna: string }> = ({ x, y, w, h, g, warna }) => g <= 0.001 ? null : (
  <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    <polyline points={garis(TUTUP, x - w / 2, y - h / 2, w, h, Math.min(...TUTUP), Math.max(...TUTUP), g)} fill="none" stroke={warna} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
  </svg>);

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

export const Scene05: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f >= S06_MASUK.mulai + 60) return null;

  /* ═ A ═ */
  const serah = cin(f, A0 + 30);
  const ruangA = cin(f, T.tempat - 24);
  const keluarA = popOut(f, T.pelajaran - 20);
  const feriA = {
    x: S04_FERI_AKHIR.x + (960 - S04_FERI_AKHIR.x) * serah + (720 - 960) * ruangA,
    y: S04_FERI_AKHIR.y + (500 - S04_FERI_AKHIR.y) * serah, d: S04_FERI_AKHIR.d, // QA pusat 2: garis naik-turun pindah ke ATAS penghubung → papan di 500
  };
  const kelasA = popIn(f, T.tempat) * keluarA;
  /* ═ B ═ */
  const layarB = popIn(f, T.pelajaran + 10) * popOut(f, T.artinya - 10);
  const keluarB = popOut(f, T.sebelum - 20);
  // QA pusat 19 Okt: layar sendirian di tengah (dulu −100), naik memberi ruang kutipan; kutipan ke TENGAH saat layar pergi, naik lagi saat butir muncul
  const layarY = 540 - 74 * cin(f, T.melewati - 24);
  const kutipanY = (layarY + 280) + (540 - (layarY + 280)) * cin(f, T.artinya + 10) + (360 - 540) * cin(f, T.market - 24);
  /* ═ C ═ */
  const keluarC = popOut(f, T.lihat - 20);
  const ruangC = cin(f, T.indeksC - 24);
  /* ═ D–E ═ */
  const keluarD = popOut(f, T.tapi - 20);
  const panelP = popIn(f, T.lihat + 30) * keluarD; // mulai saat papan C habis (lihat+10) — tanpa tumpang
  const px = PANEL.x0 + (PANEL.x1 - PANEL.x0) * cin(f, T.reaksi - 24);
  const gTurun = (DASAR / n) * cin(f, T.turun, 60);
  const gLine = gTurun + (1 - DASAR / n) * R(f, T.berapa - 10, T.lama + 50, 0, 1, io);
  const jalan = R(f, T.melewatiE - 20, T.melewatiE + 160, 0, 1, io); // feri menyusuri pemulihan
  const gFeri = gLine < DASAR / n - 1e-6 ? gLine : DASAR / n + (1 - DASAR / n) * jalan;
  const chipOut = 1 - cin(f, T.mulai - 10, 30);
  /* ═ F ═ */
  const keluarF = popOut(f, T.jadi - 20);
  const ruangF = cin(f, T.satu - 24);
  /* ═ G ═ */
  const ruangG = cin(f, T.indeksG - 24);

  const P = (x: number, y: number) => ({ x: px - PANEL.w / 2 + x, y: PANEL.y - PANEL.h / 2 + y }); // lokal panel → layar

  return (
    <MaskerKeluar f={f} mulai={S06_MASUK.mulai} ke={S06_MASUK} warna={S06_MASUK.warna}>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {/* ══ A: feri (serah-terima Scene 04) → tempat belajar menghadapi naik-turun pasar ══ */}
        {keluarA > 0.001 ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d={`M ${feriA.x + 118} 500 L ${1200 - 118} 500`} g={cin(f, T.tempat + 20) * keluarA} warna={FERI} tebal={4} titik={false} />
            </svg>
            <Kendaraan x={feriA.x} y={feriA.y} d={feriA.d} warna={FERI} ikon="feri" cermin p={keluarA} />
            {/* piala Scene 04 ikut terserah-terimakan lalu lepas */}
            <Lencana x={feriA.x} y={feriA.y} d={feriA.d} p={popOut(f, A0 + 40)} warna={B.orange} ikon="trofi" besar={74} />
            <Label x={feriA.x} y={640} teks="Indeks" f={f} at={T.indeks + 20} size={32} alfa={keluarA} />
            <Bulat x={1200} y={500} d={200} warna={B.turq} ikon="kelas" p={kelasA} />
            <Label x={1200} y={640} teks="Tempat belajar" f={f} at={T.tempat + 15} size={32} alfa={keluarA} />
            <div style={{ position: 'absolute', inset: 0, opacity: keluarA }}>
              <Sparkline x={960} y={430} w={220} h={50} g={cin(f, T.naikTurun, 60)} warna={FERI} />
            </div>
          </>) : null}

        {/* ══ B: pelajaran sebelumnya → "melewati badai" → market turun + tetap menjalankan rencana ══ */}
        {layarB > 0.001 ? (
          <Pindah x={960} y={layarY} k={0.52}>
            <ArahKeluar aktif={f > T.artinya - 40}><LayarPelajaran s={layarB} progres={1} sorot={1} /></ArahKeluar>
          </Pindah>) : null}
        {keluarB > 0.001 ? (
          <>
            <ArahKeluar aktif={f > T.sebelum - 50}><Kutipan x={960} y={kutipanY} teks="Melewati badai" p={popIn(f, T.melewati) * keluarB} warna={B.blue} ikon="badai" size={38} /></ArahKeluar>
            <Bulat x={760} y={590} d={150} warna={ARAH.turun} ikon="pasarTurun" p={popIn(f, T.market) * keluarB} />
            <Label x={760} y={705} teks="Market turun" f={f} at={T.market + 10} size={30} alfa={keluarB} />
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(960 - 22, 590 - 30)} scale(${skalaPop(popIn(f, T.menjalankan - 20) * keluarB)})`, fontFamily: F, fontSize: 56, fontWeight: 800, color: B.gray, lineHeight: '60px' }}>+</div>
            <Bulat x={1160} y={590} d={150} warna={B.turq} ikon="rencana" p={popIn(f, T.menjalankan) * keluarB} />
            <Lencana x={1160} y={590} d={150} p={popIn(f, T.rencana + 10) * keluarB} warna={CEK} ikon="tersedia" besar={56} />
            <Label x={1160} y={705} teks="Tetap menjalankan rencana" f={f} at={T.menjalankan + 10} size={30} lebar={380} alfa={keluarB} />
          </>) : null}

        {/* ══ C: ① indeks dulu → ② satu saham ══ */}
        {keluarC > 0.001 && f > T.sebelum - 40 ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d="M 838 540 L 1082 540" g={cin(f, T.indeksC + 30) * keluarC} warna={B.gray} tebal={4} titik={false}
                panah={{ x: 1082, y: 540, sudut: 0 }} />
            </svg>
            <Kendaraan x={960 + (1200 - 960) * ruangC} y={540} d={200} warna={B.orange} ikon="pesawat" cermin={false} p={popIn(f, T.risiko) * keluarC} />
            <Lencana x={960 + (1200 - 960) * ruangC} y={540} d={200} p={popIn(f, T.saham) * keluarC} warna={B.orange} ikon="risiko" besar={68} />
            <Label x={960 + (1200 - 960) * ruangC} y={680} teks="Satu saham" f={f} at={T.saham + 10} size={32} alfa={keluarC} />
            <Kendaraan x={720} y={540} d={200} warna={FERI} ikon="feri" cermin p={popIn(f, T.indeksC) * keluarC} />
            <Label x={720} y={680} teks="Indeks" f={f} at={T.indeksC + 10} size={32} alfa={keluarC} />
            <Nomor x={720 - 72} y={540 - 72} n={1} warna={FERI} p={popIn(f, T.indeksC + 20) * keluarC} d={58} />
            <Nomor x={1200 - 72} y={540 - 72} n={2} warna={B.orange} p={popIn(f, T.indeksC + 40) * keluarC} d={58} />
          </>) : null}

        <ArahKeluar aktif={f > T.tapi - 50}>
        {/* ══ D–E: grafik indeks asli — seberapa dalam · berapa lama · feri menyusuri pemulihan ══ */}
        {panelP > 0.001 ? (
          <Kaca x={px} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={panelP} warna={FERI} tab="atas">
            <div style={{ position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'center', gap: 14, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: FERI, display: 'grid', placeItems: 'center' }}><Icon name="feri" size={36} color={B.white} style={{ transform: 'scaleX(-1)' }} /></div>
              <WordText f={f} at={T.lihat + 30} halus>Indeks saham Indonesia · 2020</WordText>
            </div>
            <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {/* rentang pemulihan disorot saat "tidak selalu cepat pulih" */}
              <rect x={xP(DASAR)} y={PLOT.y} width={xP(PULIH) - xP(DASAR)} height={PLOT.h} fill={rgba(B.turq, 0.14 * cin(f, T.pulih))} />
              {[4000, 5000, 6000].map((v) => (
                <g key={v}>
                  {/* trim path: kisi tergambar dari kiri */}
                  <line x1={PLOT.x} x2={PLOT.x + PLOT.w * cin(f, T.lihat + 30)} y1={yP(v)} y2={yP(v)} stroke={rgba(B.gray, 0.2)} strokeWidth={1.5} />
                  <text x={PLOT.x + PLOT.w + 14} y={yP(v) + 8} fontFamily={F} fontSize={22} fontWeight={700} fill={B.gray} opacity={cin(f, T.lihat + 30)}>{v.toLocaleString('id-ID')}</text>
                </g>))}
              {BULAN.map((b) => (
                <text key={b.t} x={xP(b.i)} y={PLOT.y + PLOT.h + 40} textAnchor={b.i === 0 ? 'start' : b.i === n ? 'end' : 'middle'} fontFamily={F} fontSize={22} fontWeight={700}
                  fill={B.gray} opacity={cin(f, T.lihat + 40)}>{b.t}</text>))}
              {gLine > 0.001 ? <polyline points={garis(TUTUP, PLOT.x, PLOT.y, PLOT.w, PLOT.h, DOM[0], DOM[1], gLine)} fill="none" stroke={FERI} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" /> : null}
              {/* seberapa dalam: kurung tegak puncak → dasar */}
              {(() => {
                const g = cin(f, T.dalam - 10);
                if (g <= 0.001) return null;
                const x = xP(DASAR) + 34, y0 = yP(TUTUP[0]), y1 = yP(TUTUP[DASAR]);
                return (
                  <g>
                    {/* trim path: garis puncak tergambar ke kanan, lalu kurung tegak turun */}
                    <line x1={PLOT.x} x2={PLOT.x + (x - PLOT.x) * g} y1={y0} y2={y0} stroke={ARAH.turun} strokeWidth={2.5} strokeDasharray="6 8" />
                    <line x1={x} x2={x} y1={y0} y2={y0 + (y1 - y0) * g} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" />
                    <line x1={x - 10} x2={x + 10} y1={y0} y2={y0} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" />
                    {g > 0.95 ? <line x1={x - 10} x2={x + 10} y1={y1} y2={y1} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" /> : null}
                  </g>);
              })()}
              {/* berapa lama: kurung datar puncak → pulih */}
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
            {/* feri = penanda di ujung garis; menunggu di dasar, lalu menyusuri pemulihan */}
            {gLine > 0.001 ? (() => {
              const [hx, hy] = ujungGaris(TUTUP, PLOT.x, PLOT.y, PLOT.w, PLOT.h, DOM[0], DOM[1], gFeri);
              const a = P(hx, hy);
              return <Kendaraan x={a.x} y={a.y} d={72} warna={FERI} ikon="feri" cermin p={popIn(f, T.turun - 20)} />;
            })() : null}
          </div>) : null}
        {/* investor: reaksi diri sendiri */}
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

        {/* ══ F: risiko tersebar → tempat belajar sebelum satu perusahaan ══ */}
        {keluarF > 0.001 && f > T.tapi - 40 ? (() => {
          const fx = 960 + (720 - 960) * ruangF, cy = 540, rr = 150;
          return (
            <>
              {Array.from({ length: 10 }, (_, k) => {
                const a = (-90 + k * 36) * Math.PI / 180;
                const p = popIn(f, T.tersebar + (k % 5) * 6) * keluarF;
                return p > 0.001 ? <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 54, height: 54, borderRadius: '50%', background: FERI, border: `3px solid ${B.white}`,
                  boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `${geser(fx + rr * Math.cos(a) - 27, cy + rr * Math.sin(a) - 27)} scale(${skalaPop(p)})`,
                  boxShadow: `0 8px 18px -10px ${rgba(FERI, 0.9)}` }}><Icon name="perusahaan" size={28} color={B.white} /></div> : null;
              })}
              <Kendaraan x={fx} y={cy} d={170} warna={FERI} ikon="feri" cermin p={popIn(f, T.tapi + 10) * keluarF} />
              <Lencana x={fx} y={cy} d={170} p={popIn(f, T.belajarF) * keluarF} warna={B.turq} ikon="kelas" besar={66} />
              <Label x={fx} y={cy + rr + 27 + 40} teks="Risiko tersebar" f={f} at={T.tersebar + 20} size={30} alfa={keluarF} />
              <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <Penghubung d={`M ${720 + rr + 50} ${cy} L ${1230 - 105} ${cy}`} g={cin(f, T.satu + 20) * keluarF} warna={B.gray} tebal={4} titik={false} panah={{ x: 1230 - 105, y: cy, sudut: 0 }} />
              </svg>
              <Bulat x={1230} y={cy} d={170} warna={B.orange} ikon="perusahaan" p={popIn(f, T.satu) * keluarF} />
              <Lencana x={1230} y={cy} d={170} p={popIn(f, T.perusahaan) * keluarF} warna={B.orange} ikon="risiko" besar={64} />
              <Label x={1230} y={cy + rr + 27 + 40} teks="Satu perusahaan" f={f} at={T.satu + 10} size={30} alfa={keluarF} />
            </>);
        })() : null}

        {/* ══ G: investor berkembang · indeks = alat investasi + kelas belajar ══ */}
        {f > T.jadi - 40 ? (() => {
          const mx = 960 + (760 - 960) * ruangG;
          // QA pusat 19 Okt: baris investor+feri di tengah (511) sampai chip muncul, lalu naik memberi ruang (434); chip di baris + 300
          const gy = 551 - 77 * cin(f, T.alat - 24); // QA pusat 2: +40
          return (
            <>
              <KarakterLingkar pose={MURID_BIRU} x={mx} y={gy} D={230} s={popIn(f, T.investor)} warna={B.orange} />
              <Lencana x={mx} y={gy} d={230} p={popIn(f, T.berkembang)} warna={B.blue} ikon="kemampuan" besar={62} />
              <Label x={mx} y={gy + 115 + 38} teks="Investor berkembang" f={f} at={T.berkembang + 10} size={30} lebar={380} />
              <Kendaraan x={1160} y={gy} d={200} warna={FERI} ikon="feri" cermin p={popIn(f, T.indeksG)} />
              <Label x={1160} y={gy + 100 + 38} teks="Indeks" f={f} at={T.indeksG + 10} size={30} />
              <Chip x={860} y={gy + 300} teks="Alat investasi" ikon="dompet" warna={FERI} p={popIn(f, T.alat)} size={28} />
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(1032 - 18, gy + 300 - 30)} scale(${skalaPop(popIn(f, T.kelas - 20))})`, fontFamily: F, fontSize: 50, fontWeight: 800, color: B.gray, lineHeight: '60px' }}>+</div>
              <Chip x={1200} y={gy + 300} teks="Kelas belajar" ikon="kelas" warna={B.turq} p={popIn(f, T.kelas)} size={28} />
            </>);
        })() : null}
      </AbsoluteFill>
    </MaskerKeluar>);
};
