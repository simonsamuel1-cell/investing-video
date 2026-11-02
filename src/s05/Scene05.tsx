import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, bayanganKecil, CEK, CORET, F, io, mixHex, R, rgba, SISI } from '../theme';
import { cin, Icon, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { Chevron, GeoKartu, Kaca, KacaMorf, KarakterLingkar, MaskerKeluar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
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
import { CINCIN_INDEKS, ISI_INDEKS } from '../parts/perusahaan';
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
const BilahPengalaman: React.FC<{ x: number; y: number; p: number; isi: number }> = ({ x, y, p, isi }) => p <= 0.001 ? null : (
  // pil bulat = POP 0→100 easeOutBack (aturan 22 Okt)
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x - 170, y - 34)} scale(${skalaPop(p)})`, transformOrigin: 'center', width: 340, height: 68, borderRadius: 34,
    background: B.white, border: `2.5px solid ${B.blue}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px 0 14px',
    boxShadow: bayanganKecil(B.blue) }}>
    <Icon name="kemampuan" size={42} color={B.blue} />
    <div style={{ flex: 1, height: 16, borderRadius: 8, background: rgba(B.blue, 0.14), overflow: 'hidden' }}>
      <div style={{ width: `${isi * 100}%`, height: '100%', borderRadius: 8, background: B.blue }} />
    </div>
  </div>);

/** baris kartu: ikon bulat + teks (rata kiri, koordinat lokal kartu) */
const Baris: React.FC<{ y: number; ikon: KunciIkon; warna: string; teks: string; f: number; at: number; cek?: number }> = ({ y, ikon, warna, teks, f, at, cek = 0 }) => (
  <>
    <Bulat x={92} y={y} d={100} warna={warna} ikon={ikon} p={popIn(f, at)} />
    {cek > 0 ? <Lencana x={92} y={y} d={100} p={cek} warna={CEK} ikon="tersedia" besar={44} /> : null}
    <div style={{ position: 'absolute', left: 168, top: y - 22, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
      <WordText f={f} at={at + 10} halus>{teks}</WordText>
    </div>
  </>);

/** TOMBOL JUAL yang diklik berulang = panik menjual (Simon 24 Okt) — tombol merah (penanda turun/jual), kursor menekan tiap 16f, riak per klik;
 *  klik berhenti di `henti`, lalu dicoret (`coret`) */
const TombolJual: React.FC<{ x: number; y: number; p: number; f: number; mulai: number; henti: number; coret: number }> = ({ x, y, p, f, mulai, henti, coret }) => {
  if (p <= 0.001) return null;
  const KLIK = 16, W = 220, H = 76;
  let tekan = 0, riak = -1;
  for (let t = mulai; t < henti; t += KLIK) {
    const u = (f - t) / 12;
    if (u >= 0 && u <= 1) tekan = Math.max(tekan, Math.sin(Math.PI * u));
    const r = (f - t) / 28;
    if (r >= 0 && r <= 1) riak = r;
  }
  const warna = mixHex(ARAH.turun, B.gray, coret);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: 'center', transform: `${geser(x - W / 2, y - H / 2)} scale(${skalaPop(p) * (1 - 0.06 * tekan)})` }}>
      {riak >= 0 ? <div style={{ position: 'absolute', left: W / 2 - 40 - 60 * riak, top: H / 2 - 40 - 60 * riak, width: 80 + 120 * riak, height: 80 + 120 * riak, borderRadius: '50%',
        border: `3px solid ${rgba(warna, 1 - riak)}`, boxSizing: 'border-box' }} /> : null}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: warna, display: 'grid', placeItems: 'center', boxShadow: bayanganKecil(warna),
        fontFamily: F, fontSize: 34, fontWeight: 800, color: B.white, letterSpacing: '.06em' }}>JUAL</div>
      {coret > 0.001 ? <div style={{ position: 'absolute', left: 18, top: H / 2 - 3, height: 6, width: (W - 36) * coret, background: CORET, borderRadius: 3 }} /> : null}
      {/* kursor menekan */}
      {/* kursor POP keluar begitu klik berhenti (dulu tinggal sampai dicoret dan menutupi chip "Tetap disiplin" di bawah tombol — audit v5) */}
      {popOut(f, henti + 20) > 0.001 ? <svg width={44} height={56} viewBox="0 0 22 28" style={{ position: 'absolute', left: W / 2 + 56, /* ujung kursor di kanan tulisan (dulu menutup huruf "L") */ top: H / 2 + 6 + 8 * tekan, overflow: 'visible',
        transformOrigin: '2px 1px', transform: popOut(f, henti + 20) < 0.9999 ? `scale(${skalaPop(popOut(f, henti + 20))})` : undefined }}>
        <path d="M2 1 L2 22 L7.5 17 L11 26 L14.5 24.5 L11 16 L18 16 Z" fill={B.white} stroke={B.night} strokeWidth={1.8} strokeLinejoin="round" />
      </svg> : null}
    </div>);
};

/* ═════════ geometri lintas papan (Simon 22 Okt: bentuk sama dibawa; 2 → 1 digabung) ═════════ */
const GEO_BADAI: GeoKartu = { x: PB.kartu.x, y: PB.kartu.y, w: PB.kartu.w, h: PB.kartu.h, warna: B.blue, tab: 'atas' };
const GEO_C = (i: number, x: number): GeoKartu => ({ x, y: PC.y, w: PC.w, h: PC.h, warna: i === 0 ? FERI : PESAWAT, tab: 'atas' });
const GEO_PANEL = (x: number): GeoKartu => ({ x, y: PANEL.y, w: PANEL.w, h: PANEL.h, warna: FERI, tab: 'atas' });
const GEO_F = (i: number, x: number): GeoKartu => ({ x, y: PF.y, w: PF.w, h: PF.h, warna: i === 0 ? FERI : B.orange, tab: 'atas' });
const GEO_G = (i: number): GeoKartu => ({ x: PG.kartu.x[i], y: PG.kartu.y, w: PG.kartu.w, h: PG.kartu.h, warna: i === 0 ? FERI : B.turq, tab: 'atas' });

export const Scene05: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f >= S06_MASUK.mulai + 60) return null;

  /* ═ A ═ */
  const serah = cin(f, A0 + 30);
  const ruangA = cin(f, T.tempat - 24);
  const keB = cin(f, T.pelajaran); // papan "Tempat belajar" DIBAWA jadi layar pelajaran sebelumnya
  const feriA = { x: lerp(lerp(S04_FERI_AKHIR.x, 960, serah), PA.feri.x, ruangA), y: lerp(S04_FERI_AKHIR.y, PA.feri.y, serah), d: S04_FERI_AKHIR.d };
  /* ═ B ═ */
  const layarX = lerp(960, PB.layar.x, cin(f, T.melewati - 24)); // layar di tengah dulu, ke kiri memberi ruang kartu "Melewati badai"
  const keC = cin(f, T.sebelum); // kartu "Melewati badai" DIBAWA jadi kartu ② (satu saham); layar pop keluar
  /* ═ C ═ */
  const sorotC = cin(f, T.indeksC);
  const xC2 = lerp(960, PC.x[1], cin(f, T.dulu - 24)); // kartu ② (muncul lebih dulu sesuai VO) di tengah, ke kanan memberi ruang kartu ①
  const keD = cin(f, T.lihat); // dua kartu C DIGABUNG jadi panel grafik
  /* ═ D–E ═ */
  const keF = cin(f, T.tapi); // panel DIBAWA jadi kartu Indeks (F); feri penanda grafik DIBAWA ke kartu itu
  const px = lerp(PANEL.x0, PANEL.x1, cin(f, T.reaksi - 24));
  const gTurun = (DASAR / n) * cin(f, T.turun);
  const gLine = gTurun + (1 - DASAR / n) * R(f, T.berapa - 10, T.berapa + 50, 0, 1, io);
  const jalan = R(f, T.melewatiE - 20, T.melewatiE + 40, 0, 1, io); // feri menyusuri pemulihan
  const gFeri = gLine < DASAR / n - 1e-6 ? gLine : DASAR / n + (1 - DASAR / n) * jalan;
  /* ═ F ═ */
  const xF = lerp(960, PF.x[0], cin(f, T.satu - 24)); // kartu indeks di tengah dulu, ke kiri memberi ruang kartu satu perusahaan
  const keG = cin(f, T.jadi); // dua kartu F DIBAWA jadi dua kartu G; feri kartu Indeks DIBAWA ke tengah
  const keluarSaham = popOut(f, T.lihat);

  const P = (x: number, y: number) => ({ x: px - PANEL.w / 2 + x, y: PANEL.y - PANEL.h / 2 + y }); // lokal panel → layar
  /** feri DIBAWA: kartu ① (C) → kepala panel (D) → penanda grafik (feri menyusuri garis) → kartu Indeks (F) → tengah (G) */
  const [hx0, hy0] = ujungGaris(TUTUP, PLOT.x, PLOT.y, PLOT.w, PLOT.h, DOM[0], DOM[1], gFeri);
  const penanda = P(hx0, hy0);
  const kepala = P(40 + 28, 34 + 28);
  const feriC = { x: PC.x[0], y: PC.y - PC.h / 2 + 150, d: 170 };
  const keGaris = cin(f, T.turun - 20);
  const feriF = { x: xF, y: PF.y - PF.h / 2 + 190, d: 150 };
  const feriBawa = {
    x: lerp(lerp(lerp(lerp(feriC.x, kepala.x, keD), penanda.x, keGaris), feriF.x, keF), PG.feri.x, keG),
    y: lerp(lerp(lerp(lerp(feriC.y, kepala.y, keD), penanda.y, keGaris), feriF.y, keF), PG.feri.y, keG),
    d: lerp(lerp(lerp(lerp(feriC.d, 56, keD), 72, keGaris), feriF.d, keF), PG.feri.d, keG),
  };

  /* ── isi kartu lintas papan ── */
  const isiPapan = (<>
    <Bulat x={82} y={84} d={96} warna={B.turq} ikon="kelas" p={popIn(f, T.tempat + 10)} />
    <div style={{ position: 'absolute', left: 150, top: 62, fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
      <WordText f={f} at={T.tempat + 10} halus>Tempat belajar</WordText>
    </div>
    <svg width={PA.papan.w} height={PA.papan.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {[0, 1, 2].map((k) => <line key={k} x1={48} x2={48 + (PA.papan.w - 96) * cin(f, T.tempat + 20 + k * 6)} y1={186 + k * 70} y2={186 + k * 70} stroke={rgba(B.gray, 0.18)} strokeWidth={1.5} />)}
      {cin(f, T.naikTurun) > 0 ? <polyline points={garis(TUTUP, 48, 180, PA.papan.w - 96, 150, Math.min(...TUTUP), Math.max(...TUTUP), cin(f, T.naikTurun))}
        fill="none" stroke={FERI} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" /> : null}
    </svg>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 352, textAlign: 'center', fontFamily: F, fontSize: 28, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
      <WordText f={f} at={T.naikTurun + 20} halus>Naik-turunnya market</WordText>
    </div>
  </>);
  const isiBadai = (<>
    <Ombak x={PB.kartu.w / 2} y={96} w={330} p={1} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 168, textAlign: 'center', fontFamily: F, fontSize: 44, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
      <WordText f={f} at={T.melewati + 10} halus>“Melewati badai”</WordText>
    </div>
    {/* garis pemisah: trim path (dulu pudar) */}
    <div style={{ position: 'absolute', left: 48, top: 250, height: 2, width: (PB.kartu.w - 96) * cin(f, T.market - 20), background: rgba(B.night, 0.07) }} />
    <Baris y={330} ikon="pasarTurun" warna={ARAH.turun} teks="Market turun" f={f} at={T.market} />
    <Baris y={450} ikon="rencana" warna={B.turq} teks="Tetap menjalankan rencana" f={f} at={T.menjalankan} cek={popIn(f, T.rencana + 10)} />
  </>);
  const isiC = (i: number) => {
    const indeks = i === 0;
    const warna = indeks ? FERI : PESAWAT;
    const at = indeks ? T.dulu : T.sebelum;
    return (<>
      <Nomor cincin x={48} y={48} n={i + 1} warna={warna} p={popIn(f, at + 10)} d={60} />
      {!indeks ? <Kendaraan x={PC.w / 2} y={150} d={170} warna={warna} ikon="pesawat" cermin={false} p={popIn(f, at + 10) * keluarSaham} /> : null}
      {!indeks ? <Lencana x={PC.w / 2} y={150} d={170} p={popIn(f, T.saham) * keluarSaham} warna={B.orange} ikon="risiko" besar={64} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={indeks ? T.indeksC : T.saham} halus>{indeks ? 'Indeks' : 'Satu saham'}</WordText>
      </div>
      <Chip x={PC.w / 2} y={364} teks={indeks ? 'Belajar dulu' : 'Risiko lebih besar'} ikon={indeks ? 'kelas' : 'risiko'} warna={indeks ? B.turq : B.orange}
        p={popIn(f, indeks ? T.dulu + 20 : T.saham + 20)} size={28} />
    </>);
  };
  const isiPanel = (
    <>
      <div style={{ position: 'absolute', left: 40 + 56 + 14, top: 34, height: 56, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>
        <WordText f={f} at={T.lihat + 30} halus>Indeks saham Indonesia · 2020</WordText>
      </div>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <rect x={xP(DASAR)} y={PLOT.y} width={xP(PULIH) - xP(DASAR)} height={PLOT.h} fill={rgba(B.turq, 0.14 * cin(f, T.pulih))} />
        {[4000, 5000, 6000].map((v) => <line key={v} x1={PLOT.x} x2={PLOT.x + PLOT.w * cin(f, T.lihat + 30)} y1={yP(v)} y2={yP(v)} stroke={rgba(B.gray, 0.2)} strokeWidth={1.5} />)}
        {gLine > 0 ? <polyline points={garis(TUTUP, PLOT.x, PLOT.y, PLOT.w, PLOT.h, DOM[0], DOM[1], gLine)} fill="none" stroke={FERI} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" /> : null}
        {(() => {
          const g = cin(f, T.dalam - 10);
          if (g <= 0.001) return null;
          const x = xP(DASAR) + 34, y0 = yP(TUTUP[0]), y1 = yP(TUTUP[DASAR]);
          return (
            <g>
              <line x1={PLOT.x} x2={PLOT.x + (x - PLOT.x) * g} y1={y0} y2={y0} stroke={ARAH.turun} strokeWidth={3} strokeDasharray="10 10" strokeLinecap="round" />
              <line x1={x} x2={x} y1={y0} y2={y0 + (y1 - y0) * g} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" />
              <line x1={x - 10 * g} x2={x + 10 * g} y1={y0} y2={y0} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" />
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
              <line x1={x0} x2={x0} y1={y - 10 * g} y2={y + 10 * g} stroke={B.turq} strokeWidth={4} strokeLinecap="round" />
              {g > 0.95 ? <line x1={x1} x2={x1} y1={y - 10} y2={y + 10} stroke={B.turq} strokeWidth={4} strokeLinecap="round" /> : null}
            </g>);
        })()}
      </svg>
      {/* label sumbu & bulan: teks bertopeng (dulu pudar) */}
      {[4000, 5000, 6000].map((v, k) => (
        // +46: penanda feri (d 72) di ujung garis = tepi kanan plot → label sumbu digeser keluar jangkauannya (dulu "6.000" tertutup penanda)
        <div key={v} style={{ position: 'absolute', left: PLOT.x + PLOT.w + 46, top: yP(v) - 14, fontFamily: F, fontSize: 22, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
          <WordText f={f} at={T.lihat + 30 + k * 6} halus>{v.toLocaleString('id-ID')}</WordText>
        </div>))}
      {BULAN.map((b, k) => (
        <div key={b.t} style={{ position: 'absolute', left: xP(b.i) - (b.i === 0 ? 0 : b.i === n ? 160 : 80), width: 160, top: PLOT.y + PLOT.h + 16, fontFamily: F, fontSize: 22, fontWeight: 700,
          color: B.gray, whiteSpace: 'nowrap', textAlign: b.i === 0 ? 'left' : b.i === n ? 'right' : 'center' }}>
          <WordText f={f} at={T.lihat + 40 + k * 6} halus>{b.t}</WordText>
        </div>))}
    </>);
  const isiF = (i: number, w: number) => i === 0 ? (<>
    {Array.from({ length: 10 }, (_, k) => {
      const a = (-90 + k * 36) * Math.PI / 180, rr = lerp(60, 140, cin(f, T.tersebar));
      const p = popIn(f, T.tapi + 20 + k * 6) * popOut(f, T.jadi); // kumpulan: stagger 6 f
      // sepuluh perusahaan isi indeks yang SAMA dengan Scene 03 — ikon sektor & warna masing-masing (Simon 24 Okt siang: "icon perusahaan masih banyak yang sama")
      const rp = ISI_INDEKS[CINCIN_INDEKS[k]];
      return p > 0 ? <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 54, height: 54, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${rp.warna}`,
        boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `${geser(w / 2 + rr * Math.cos(a) - 27, 190 + rr * Math.sin(a) - 27)} scale(${skalaPop(p)})`,
        boxShadow: bayanganKecil(rp.warna) }}><Icon name={rp.ikon} size={28} color={rp.warna} /></div> : null;
    })}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
      <WordText f={f} at={T.indeksF} halus>Indeks</WordText>
    </div>
    <Chip x={w / 2} y={444} teks="Risiko tersebar" ikon="portofolio" warna={FERI} p={popIn(f, T.tersebar + 10)} size={28} />
  </>) : (<>
    <Bulat x={w / 2} y={190} d={170} warna={B.orange} ikon="perusahaan" p={popIn(f, T.satu + 10)} />
    <Lencana x={w / 2} y={190} d={170} p={popIn(f, T.perusahaan)} warna={B.orange} ikon="risiko" besar={64} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
      <WordText f={f} at={T.satu + 10} halus>Satu perusahaan</WordText>
    </div>
    <Chip x={w / 2} y={444} teks="Risiko terpusat" ikon="risiko" warna={B.orange} p={popIn(f, T.perusahaan + 10)} size={28} />
  </>);
  const isiG = (i: number) => i === 0 ? (<>
    <Foto k="rdIndeks" x={PG.kartu.w / 2} y={128} w={196} p={1} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
      <WordText f={f} at={T.alat + 10} halus>Alat investasi</WordText>
    </div>
  </>) : (<>
    <Bulat x={PG.kartu.w / 2} y={128} d={150} warna={B.turq} ikon="kelas" p={popIn(f, T.jadi + 30)} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
      <WordText f={f} at={T.kelas + 10} halus>Tempat belajar</WordText>
    </div>
  </>);

  return (
    <MaskerKeluar f={f} mulai={S06_MASUK.mulai} ke={S06_MASUK} warna={S06_MASUK.warna}>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {/* ══ A: feri › papan "Tempat belajar" (→ DIBAWA jadi layar pelajaran sebelumnya) ══ */}
        {keB < 1 ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d={`M ${feriA.x + feriA.d / 2 + 14} ${PA.feri.y} L ${PA.papan.x - PA.papan.w / 2 - 10} ${PA.feri.y}`} g={cin(f, T.tempat + 10) * (1 - cin(f, T.pelajaran - 20))} warna={FERI} tebal={4} titik={false} />
            </svg>
            <Kendaraan x={feriA.x} y={feriA.y} d={feriA.d} warna={FERI} ikon="feri" cermin p={popOut(f, T.pelajaran - 10)} />
            <Label x={feriA.x} y={feriA.y + feriA.d / 2 + 40} teks="Indeks" f={f} at={T.indeks + 20} keluar={T.pelajaran - 30} size={34} />
            <Kaca x={PA.papan.x} y={PA.papan.y} w={PA.papan.w} h={PA.papan.h} p={popIn(f, T.tempat) * popOut(f, T.pelajaran - 10)} warna={B.turq} tab="atas">{isiPapan}</Kaca>
          </>) : null}

        {/* ══ B: layar pelajaran sebelumnya (papan A yang dibawa) + kartu "Melewati badai" ══ */}
        {f > T.pelajaran - 10 && keC < 1 ? (
          <>
            {/* layar POP di tengah (easeOutBack, poros tengah) sesudah papan A mengecil; keluar POP sebelum kartu "Melewati badai" bergeser ke tengah */}
            <Pindah x={layarX} y={PB.layar.y} k={PB.layar.k}>
              <LayarPelajaran s={1} skala={skalaPop(popIn(f, T.pelajaran + 40) * popOut(f, T.sebelum - 30))} progres={1} sorot={1} />
            </Pindah>
            <Label x={layarX} y={PB.layar.y + 185 + 44} teks="Pelajaran sebelumnya" f={f} at={T.pelajaran + 50} keluar={T.sebelum - 30} size={32} lebar={420} />
            {keC < 0.001
              ? <Kaca x={PB.kartu.x} y={PB.kartu.y} w={PB.kartu.w} h={PB.kartu.h} p={popIn(f, T.melewati)} warna={B.blue} tab="atas">{isiBadai}</Kaca>
              : <KacaMorf a={GEO_BADAI} b={GEO_C(1, xC2)} t={keC} isiA={isiBadai} isiB={isiC(1)} />}
          </>) : null}

        {/* ══ C: ② satu saham (kartu B yang dibawa) ← ① belajar dulu lewat indeks → DIGABUNG jadi panel grafik ══ */}
        {keC > 0 && keD < 1 ? (
          <>
            <Chevron x={960} y={PC.y} warna={B.gray} p={popIn(f, T.indeksC + 20) * popOut(f, T.lihat)} />
            {[0, 1].map((i) => {
              const indeks = i === 0;
              const x = indeks ? PC.x[0] : xC2;
              if (!indeks && keC < 1) return null; // kartu ② = kartu B yang sedang berubah
              return keD > 0
                ? <KacaMorf key={i} a={GEO_C(i, x)} b={GEO_PANEL(px)} t={keD} isiA={isiC(i)} isiB={indeks ? isiPanel : undefined}
                    tepi={indeks ? sorotC : 0} alfa={indeks ? 1 : 1 - 0.4 * sorotC} peran={indeks ? undefined : 'gabung'} />
                : <Kaca key={i} x={x} y={PC.y} w={PC.w} h={PC.h} p={indeks ? popIn(f, T.dulu) : 1} warna={indeks ? FERI : PESAWAT} tab="atas" tepi={indeks ? sorotC : 0}
                    alfa={indeks ? 1 : 1 - 0.4 * sorotC}>{isiC(i)}</Kaca>;
            })}
          </>) : null}

        {/* ══ D–E: grafik indeks asli — seberapa dalam · berapa lama · feri menyusuri pemulihan + Rupiah berjalan → panel DIBAWA jadi kartu Indeks (F) ══ */}
        {keD >= 1 && keF < 1 ? (
          <>
            {keF < 0.001
              ? <Kaca x={px} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={1} warna={FERI} tab="atas">{isiPanel}</Kaca>
              : <KacaMorf a={GEO_PANEL(px)} b={GEO_F(0, xF)} t={keF} isiA={isiPanel} isiB={isiF(0, PF.w)} />}
            {(() => { const a = P(xP(DASAR) + 50, (yP(TUTUP[0]) + yP(TUTUP[DASAR])) / 2); return <Chip x={a.x} y={a.y} teks={`−${Math.abs(DALAM)}%`} warna={ARAH.turun} p={popIn(f, T.dalam) * popOut(f, T.tapi)} size={28} jangkar="kiri" />; })()}
            {(() => { const a = P((xP(0) + xP(PULIH)) / 2, PLOT.y - 26); return <Chip x={a.x} y={a.y} teks="±1 tahun" ikon="kurangWaktu" warna={B.turq} p={popIn(f, T.lama + 30) * popOut(f, T.tapi)} size={26} />; })()}
            {gLine > 0 ? (() => {
              const v = (MODAL * nilaiDi(gFeri)) / TUTUP[0];
              return <PilNominal x={P(PANEL.w - 40, 62).x} y={P(0, 62).y} teks={rp(v)} arah={Math.max(-1, Math.min(1, ((v - MODAL) / MODAL) * 6))}
                p={popIn(f, T.turun) * popOut(f, T.tapi)} size={28} jangkar="kanan" lebarMin={236} />;
            })() : null}
            <KarakterLingkar pose={MURID_BIRU} x={ORANG.x} y={ORANG.y} D={ORANG.D} s={popIn(f, T.reaksi) * popOut(f, T.tapi)} warna={B.orange} />
            <TombolJual x={ORANG.x} y={ORANG.y + ORANG.D / 2 + 64} p={popIn(f, T.panik) * popOut(f, T.mulai - 10)} f={f} mulai={T.panik + 20} henti={T.disiplin - 10}
              coret={R(f, T.takut - 10, T.takut + 50, 0, 1, io)} />
            <Chip x={ORANG.x} y={ORANG.y + ORANG.D / 2 + 130} teks="Tetap disiplin" ikon="disiplin" warna={CEK} p={popIn(f, T.disiplin) * popOut(f, T.mulai - 10)} size={28} />
            <BilahPengalaman x={ORANG.x} y={ORANG.y + ORANG.D / 2 + 90} p={popIn(f, T.pengalaman) * popOut(f, T.tapi)} isi={0.15 + 0.85 * cin(f, T.volatilitas)} />
            <Lencana x={ORANG.x} y={ORANG.y} d={ORANG.D} p={popIn(f, T.berhasil) * popOut(f, T.tapi)} warna={CEK} ikon="tersedia" besar={64} />
          </>) : null}

        {/* ══ F: kartu Indeks (panel D yang dibawa) › kartu Satu perusahaan → keduanya DIBAWA jadi dua kartu G ══ */}
        {keF >= 1 && keG < 1 ? (
          <>
            <Chevron x={(xF + PF.w / 2 + PF.x[1] - PF.w / 2) / 2} y={PF.y} warna={B.gray} p={popIn(f, T.satu + 10) * popOut(f, T.jadi)} />
            {[0, 1].map((i) => {
              const x = i === 0 ? xF : PF.x[1];
              if (i === 1 && popIn(f, T.satu) <= 0.001) return null;
              return keG > 0
                ? <KacaMorf key={i} a={GEO_F(i, x)} b={GEO_G(i)} t={keG} isiA={isiF(i, PF.w)} isiB={isiG(i)} />
                : <Kaca key={i} x={x} y={PF.y} w={PF.w} h={PF.h} p={i === 0 ? 1 : popIn(f, T.satu)} warna={i === 0 ? FERI : B.orange} tab="atas">{isiF(i, PF.w)}</Kaca>;
            })}
          </>) : null}

        {/* ══ G: indeks = alat investasi + tempat belajar (kartu F yang dibawa) ══ */}
        {keG >= 1 ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d={`M ${PG.feri.x - PG.feri.d / 2 - 12} ${PG.feri.y} L ${PG.kartu.x[0] + PG.kartu.w / 2 + 10} ${PG.feri.y}`} g={cin(f, T.alat - 20)} warna={FERI} tebal={4} titik={false} />
              <Penghubung d={`M ${PG.feri.x + PG.feri.d / 2 + 12} ${PG.feri.y} L ${PG.kartu.x[1] - PG.kartu.w / 2 - 10} ${PG.feri.y}`} g={cin(f, T.kelas - 20)} warna={B.turq} tebal={4} titik={false} />
            </svg>
            <Label x={PG.feri.x} y={PG.feri.y + PG.feri.d / 2 + 40} teks="Indeks" f={f} at={T.indeksG + 30} size={34} />
            {[0, 1].map((i) => <Kaca key={i} x={PG.kartu.x[i]} y={PG.kartu.y} w={PG.kartu.w} h={PG.kartu.h} p={1} warna={i === 0 ? FERI : B.turq} tab="atas">{isiG(i)}</Kaca>)}
          </>) : null}

        {/* FERI DIBAWA: kartu ① → kepala panel → penanda grafik → kartu Indeks F → tengah G (lalu masker ke pesawat Scene 06) */}
        {keC > 0 ? (
          <>
            <Kendaraan x={feriBawa.x} y={feriBawa.y} d={feriBawa.d} warna={FERI} ikon="feri" cermin p={popIn(f, T.dulu + 10)} />
            {keF > 0.5 ? <Lencana x={feriBawa.x} y={feriBawa.y} d={feriBawa.d} p={popIn(f, T.belajarF) * popOut(f, T.jadi)} warna={B.turq} ikon="kelas" besar={60} /> : null}
          </>) : null}
      </AbsoluteFill>
    </MaskerKeluar>);
};
