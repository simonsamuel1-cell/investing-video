import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, CORET, F, io, mixHex, R, rgba } from '../theme';
import { ArahKeluar, cin, gayaPapan, Icon, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Label, Lencana, geser } from '../parts/umum';
import { Chevron, Kaca, KarakterLingkar, Masuk, Penghubung, PoseKarakter } from '../parts/kaca';
import { Foto } from '../parts/nyata';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { Sungai } from '../parts/sungai';
import { Pijakan, RumahIso } from '../parts/v04';
import { rpPenuh } from '../parts/nominal';
import { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 03 — Naik Feri: Kenapa Indeks Cocok untuk Banyak Orang? (BATAS.s3 – BATAS.s4). RELAYOUT 22 Okt (Simon: "secara layout aku masih kurang
 * puas", judul TIDAK ditambahkan) — 04_Asset/Rencana-Relayout-V05.md. Masker Scene 02 mendarat jadi cakram FERI, lalu:
 *  A feri › kartu produk "Reksa dana indeks" (gambar realistis) · B 12 perusahaan → saringan "Aturan" → keranjang Indeks (feri = kepala keranjang)
 *  C hub "Indeks Indonesia" + 6 kartu indeks muncul di "banyak indeks", disorot bergiliran di kata kategorinya · D kartu MENYATU jadi panel
 *  "Isi indeks" (keluar/masuk, dievaluasi berkala) · E satu saham vs indeks, langsung berisi (perusahaan indeks MENYEBAR di "tersebar"),
 *  Rupiah berjalan · F feri + cincin 10 perusahaan = bagian kita; cincin berwarna sektor di katanya · G investor + "Saham mana pemenang
 *  berikutnya?" + 4 perusahaan "?" (dicoret) · H cincin perusahaan di sekeliling feri + chip "Bisa turun" / "Punya risiko", satu perusahaan
 *  jatuh · I peta sungai V04 (pijakan + rumah isometrik, geometri Scene 01) — feri menyeberang, diserahkan ke Scene 04.
 * Ikon/chip/lencana = pop easeOutBack; kartu/foto/teks/orang = swipe up; garis = trim path; 60f dipusatkan di kata, stagger 20f.
 */
const A0 = BATAS.s3;
// naskah revisi 21 Okt: nama indeks TIDAK dibaca lagi — kartu tetap tampil (MOTION NOTE), disorot di kata kategorinya.
const KATA = ['feri', 'reksa', 'indeks', 'indeks', 'sekumpulan', 'perusahaan', 'dipilih', 'aturan', 'indonesia', 'banyak', 'ada', 'besar', 'ada',
  'valuasi', 'kualitas', 'pertumbuhan', 'dividen', 'sampai', 'bumn', 'aturannya', 'prinsipnya', 'dievaluasi', 'berkala',
  'nggak', 'keluar', 'memenuhi', 'masuk', 'berubah', 'kenapa', 'pertama', 'risikonya', 'tersebar', 'satu', 'bermasalah', 'dampaknya', 'seluruh', 'kedua', 'bagian',
  'sektor', 'sekaligus', 'bank', 'telekomunikasi', 'konsumsi', 'energi', 'lainnya', 'artinya', 'menebak', 'saham', 'berikutnya', 'indeks', 'turun', 'risiko', 'tapi',
  'menggantungkan', 'satu', 'perusahaan', 'itulah', 'banyak', 'feri', 'kendaraan', 'perjalanan', 'panjang'];
const K = ['feri', 'reksa', 'indeks0', 'indeks', 'sekumpulan', 'perusahaan', 'dipilih', 'aturan', 'indonesia', 'banyak', 'lq45', 'fokus', 'value30',
  'valuasi', 'kualitas', 'pertumbuhan', 'dividen', 'bumn20', 'bumn', 'aturannya', 'prinsipnya', 'dievaluasi', 'berkala',
  'nggak', 'keluar', 'memenuhi', 'masuk', 'berubah', 'kenapa', 'pertama', 'risikonya', 'tersebar', 'satu', 'bermasalah', 'dampaknya', 'seluruh', 'kedua', 'bagian',
  'sektor', 'sekaligus', 'bank', 'telko', 'konsumsi', 'energi', 'lainnya', 'artinya', 'menebak', 'saham', 'berikutnya', 'indeksH', 'turun', 'risiko', 'tapi',
  'menggantungkan', 'satuH', 'perusahaanH', 'itulah', 'banyakOrang', 'feriI', 'kendaraan', 'perjalanan', 'panjang'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S03_T = T;
export const S03_AKHIR = BATAS.s4;
/** masker Scene 02 mendarat di cakram feri (tengah frame) */
export const S03_MASUK: Masuk = { x: 960, y: 520, r: 100, warna: JALUR_WARNA.feri, mulai: A0 - 20 };
const DARAT = S03_MASUK.mulai + 60;

const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const FERI = JALUR_WARNA.feri;
const MODAL = 10_000_000;
const antara = (f: number, masuk: number, keluar: number, d = 30) => Math.min(cin(f, masuk, d), 1 - cin(f, keluar, d));

/** ubin perusahaan (lingkaran putih bertepi warna / terisi warna, ikon gedung) — pop */
const Ubin: React.FC<{ x: number; y: number; d: number; p: number; warna?: string; alfa?: number; isi?: string }> = ({ x, y, d, p, warna = FERI, alfa = 1, isi }) => (
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: isi ?? B.white, border: `4px solid ${warna}`,
      boxSizing: 'border-box', display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`,
      opacity: alfa < 1 ? alfa : undefined, boxShadow: `0 10px 22px -12px ${rgba(warna, 0.8)}` }}>
      <Icon name="perusahaan" size={d * 0.5} color={isi ? B.white : warna} />
    </div>));

/* ── A: feri › kartu produk ── */
const PA = { feri: { x: 660, y: 520, d: 200 }, chev: 885, kartu: { x: 1160, y: 520, w: 440, h: 360 } };
/* ── B: kumpulan → saring → keranjang ── */
const KOLAM = { x0: 290, y0: 400, dx: 120, dy: 120, kol: 4, n: 12, d: 96 };
const PILIH = [0, 2, 5, 7, 8, 11]; // enam perusahaan yang lolos aturan
const SARING = { x: 960, y: 520, d: 170 };
const KERANJANG = { x: 1450, y: 520, w: 460, h: 460 };
const KEPALA_H = 128;
const posKolam = (i: number) => ({ x: KOLAM.x0 + (i % KOLAM.kol) * KOLAM.dx, y: KOLAM.y0 + Math.floor(i / KOLAM.kol) * KOLAM.dy });
const posKeranjang = (k: number) => ({ x: KERANJANG.x - 130 + (k % 3) * 130, y: KERANJANG.y + 14 + Math.floor(k / 3) * 128 });
const FERI_KEPALA = { x: KERANJANG.x - KERANJANG.w / 2 + 66, y: KERANJANG.y - KERANJANG.h / 2 + 64, d: 76 };

/* ── C: hub + 6 kartu indeks ── */
type KartuIdx = { nama: string; fokus: string; ikon: KunciIkon; fokusAt: number; x: number; y: number };
const KC = { w: 560, h: 150, x: [440, 1480], y: [340, 530, 720] };
const HUB = { x: 960, y: 530, d: 180 };
const kartuIdx = (): KartuIdx[] => [
  { nama: 'LQ45 · IDX30', fokus: 'Saham besar & aktif', ikon: 'gedungBesar', fokusAt: T.fokus, x: KC.x[0], y: KC.y[0] },
  { nama: 'IDX Value30', fokus: 'Valuasi', ikon: 'valuasi', fokusAt: T.valuasi, x: KC.x[1], y: KC.y[0] },
  { nama: 'IDX Quality30', fokus: 'Kualitas perusahaan', ikon: 'kualitas', fokusAt: T.kualitas, x: KC.x[0], y: KC.y[1] },
  { nama: 'IDX Growth30', fokus: 'Pertumbuhan', ikon: 'pertumbuhan', fokusAt: T.pertumbuhan, x: KC.x[1], y: KC.y[1] },
  { nama: 'IDX High Dividend 20', fokus: 'Pembagi dividen', ikon: 'dividen', fokusAt: T.dividen, x: KC.x[0], y: KC.y[2] },
  { nama: 'IDX BUMN20', fokus: 'Perusahaan BUMN', ikon: 'pemerintah', fokusAt: T.bumn, x: KC.x[1], y: KC.y[2] },
];

/* ── D: panel isi indeks ── */
const PANEL = { x: 960, y: 540, w: 1500, h: 640 };
const ISI = { kol: 5, dx: 200, dy: 180, d: 124, y0: 490 };
const posIsi = (i: number) => ({ x: PANEL.x - 2 * ISI.dx + (i % ISI.kol) * ISI.dx, y: ISI.y0 + Math.floor(i / ISI.kol) * ISI.dy });

/* ── E: satu saham vs indeks ── */
const KE = { y: 530, w: 700, h: 560, x: [560, 1360] };

/* ── F: feri + cincin 10 perusahaan, berwarna sektor ── */
const CINCIN = { x: 690, y: 530, r: 215, tebal: 58, d: 80 };
const BARIS_F = { x: 1160, d: 84, dy: 104 };
const SEKTOR: { nama: string; ikon: KunciIkon; warna: string; kata: keyof typeof T }[] = [
  { nama: 'Bank', ikon: 'sektorBank', warna: B.blue, kata: 'bank' },
  { nama: 'Telekomunikasi', ikon: 'telekomunikasi', warna: B.blueLite, kata: 'telko' },
  { nama: 'Konsumsi', ikon: 'konsumsi', warna: B.turq, kata: 'konsumsi' },
  { nama: 'Energi', ikon: 'energi', warna: B.orange, kata: 'energi' },
  { nama: 'Lainnya', ikon: 'perusahaan', warna: B.gray, kata: 'lainnya' },
];
/** sudut ubin k (dua ubin per sektor, di tengah busurnya) */
const sudutUbin = (k: number) => ((-90 + 18 + k * 36) * Math.PI) / 180;

/* ── H: cincin perusahaan di sekeliling feri ── */
const RH = { x: 960, y: 480, r: 240, d: 80 };

/* ── I: peta sungai V04 (geometri Scene 01: pijakan investor P0 · rumah P1 · sungai 770–1150) ── */
const PETA = { orang: { x: 258, y: 540, D: 200 }, pijakan: { x: 258, y: 610, a: 140 }, label: 749, p0: 398, p1: 1478, y: 610, rumah: 340 };
/** feri selesai menyeberang (diserahkan ke Scene 04 = S03_FERI_AKHIR) */
const FERI_I = { x0: 560, x1: 1290, d: 140 };

export const Scene03: React.FC<{ f: number }> = ({ f }) => {
  if (f < DARAT || f > S03_AKHIR + 90) return null;

  /* ── A → B: feri tengah → kiri (memberi ruang kartu produk) → kepala keranjang ── */
  const kiriA = cin(f, T.reksa - 24);
  const keKepala = cin(f, T.sekumpulan - 10);
  const feriA = {
    x: lerp(lerp(960, PA.feri.x, kiriA), FERI_KEPALA.x, keKepala), y: lerp(520, FERI_KEPALA.y, keKepala), d: lerp(PA.feri.d, FERI_KEPALA.d, keKepala),
  };
  const produk = popIn(f, T.reksa) * (1 - cin(f, T.sekumpulan - 20, 30));
  const papanAB = 1 - cin(f, T.indonesia - 10, 30);

  /* ── C / D ── */
  const papanC = antara(f, T.indonesia - 20, T.aturannya + 40);
  const menyatuD = cin(f, T.aturannya + 30);
  const papanD = cin(f, T.aturannya + 30, 30) * (1 - cin(f, T.kenapa, 30));
  const kartu = kartuIdx();
  const sorotC = (i: number) => {
    const a = kartu[i].fokusAt, b = i < 5 ? kartu[i + 1].fokusAt : T.aturannya;
    return cin(f, a - 10, 24) * (1 - cin(f, b - 10, 24));
  };

  /* ── E ── */
  const papanE = f > T.kenapa - 40 && f < T.kedua ? 1 : 0;
  /* ── F ── */
  const papanF = antara(f, T.kedua - 10, T.artinya + 15);
  const cx = lerp(960, CINCIN.x, cin(f, T.bank - 24)); // cincin di tengah dulu, ke kiri memberi ruang daftar sektor
  /* ── G ── */
  const papanG = f > T.artinya - 40 && f < T.indeksH + 50 ? 1 : 0;
  /* ── H ── */
  const papanH = f > T.indeksH - 20 ? 1 - cin(f, T.itulah + 20, 30) : 0;
  /* ── I ── */
  const papanI = cin(f, T.itulah, 60) * (1 - cin(f, S03_AKHIR + 20, 40));

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A–B: feri › reksa dana indeks → perusahaan disaring aturan masuk keranjang Indeks ══ */}
      {papanAB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanAB, true) }}>
          {/* A: kartu produk (gambar realistis) */}
          <Chevron x={PA.chev} y={PA.feri.y} warna={FERI} p={popIn(f, T.reksa + 10) * popOut(f, T.sekumpulan - 20)} />
          <Kaca x={PA.kartu.x} y={PA.kartu.y} w={PA.kartu.w} h={PA.kartu.h} p={produk} warna={FERI} tab="atas">
            <Foto k="rdIndeks" x={PA.kartu.w / 2} y={152} w={232} p={1} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 286, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
              <WordText f={f} at={T.reksa + 10} halus>Reksa dana indeks</WordText>
            </div>
          </Kaca>
          {/* B: keranjang Indeks — kepala dulu, badan memanjang saat ubin pertama tiba (tanpa badan kosong) */}
          {(() => { const hK = KEPALA_H + (KERANJANG.h - KEPALA_H) * cin(f, T.dipilih + 50, 60); return (
            <Kaca x={KERANJANG.x} y={KERANJANG.y - KERANJANG.h / 2 + hK / 2} w={KERANJANG.w} h={hK} p={cin(f, T.sekumpulan - 10)} warna={FERI} tab="atas">
              <div style={{ position: 'absolute', left: 124, top: 44, fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>
                <WordText f={f} at={T.sekumpulan + 10} halus>Indeks</WordText>
              </div>
            </Kaca>); })()}
          {Array.from({ length: KOLAM.n }, (_, i) => {
            const k = PILIH.indexOf(i);
            const p = popIn(f, T.sekumpulan + Math.floor(i / KOLAM.kol) * 20 + (i % KOLAM.kol) * 4);
            const u = k >= 0 ? R(f, T.dipilih + 20 + k * 20, T.dipilih + 80 + k * 20, 0, 1, io) : 0;
            const a = posKolam(i), b = posKeranjang(Math.max(0, k)), m = SARING;
            const x = u < 0.5 ? a.x + (m.x - a.x) * (u * 2) : m.x + (b.x - m.x) * ((u - 0.5) * 2);
            const y = u < 0.5 ? a.y + (m.y - a.y) * (u * 2) : m.y + (b.y - m.y) * ((u - 0.5) * 2);
            const redup = k < 0 ? 1 - 0.6 * cin(f, T.dipilih + 60) : 1;
            const lewat = u > 0.35 && u < 0.65 ? 0.4 : 1; // tertelan saringan sesaat
            return <Ubin key={i} x={x} y={y} d={KOLAM.d} p={p} warna={k >= 0 && u > 0.5 ? FERI : B.gray} alfa={redup * lewat} isi={k >= 0 && u > 0.5 ? FERI : undefined} />;
          })}
          <Bulat x={SARING.x} y={SARING.y} d={SARING.d} warna={B.orange} ikon="saring" p={popIn(f, T.dipilih - 10)} />
          <Label x={SARING.x} y={SARING.y + SARING.d / 2 + 40} teks="Aturan" f={f} at={T.aturan} size={34} />
          <Kendaraan x={feriA.x} y={feriA.y} d={feriA.d} warna={FERI} ikon="feri" cermin p={1} />
        </div>) : null}

      {/* ══ C: hub "Indeks Indonesia" + 6 kartu (muncul di "banyak indeks", disorot di kata kategorinya) → D: menyatu jadi panel ══ */}
      {papanC > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: papanC < 0.9999 ? papanC : undefined }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - menyatuD }}>
            {kartu.map((k, i) => {
              const kiri = k.x < 960, x1 = kiri ? k.x + KC.w / 2 + 6 : k.x - KC.w / 2 - 6, x0 = kiri ? HUB.x - HUB.d / 2 - 10 : HUB.x + HUB.d / 2 + 10;
              return <Penghubung key={i} d={`M ${x0} ${HUB.y} C ${(x0 + x1) / 2} ${HUB.y} ${(x0 + x1) / 2} ${k.y} ${x1} ${k.y}`} g={cin(f, T.banyak + i * 20 - 10)}
                warna={FERI} tebal={4} titik={false} />;
            })}
          </svg>
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - menyatuD }}>
            <Kendaraan x={HUB.x} y={HUB.y} d={HUB.d} warna={FERI} ikon="feri" cermin p={popIn(f, T.indonesia)} />
            <Label x={HUB.x} y={HUB.y + HUB.d / 2 + 40} teks="Indeks Indonesia" f={f} at={T.indonesia + 20} size={30} lebar={360} />
          </div>
          {kartu.map((k, i) => {
            const tujuan = posIsi(i + 2);
            const x = lerp(k.x, tujuan.x, menyatuD), y = lerp(k.y, tujuan.y, menyatuD);
            const w = lerp(KC.w, ISI.d, menyatuD), h = lerp(KC.h, ISI.d, menyatuD);
            const at = T.banyak + i * 20;
            return (
              <Kaca key={i} x={x} y={y} w={w} h={h} p={popIn(f, at)} warna={FERI} tab="kiri" radius={28 + 34 * menyatuD} alfa={1 - menyatuD} tepi={sorotC(i)}>
                <div style={{ position: 'absolute', inset: 0, opacity: 1 - cin(f, T.aturannya + 10, 30) }}>
                  <Bulat x={82} y={KC.h / 2} d={92} warna={FERI} ikon={k.ikon} p={popIn(f, at + 10)} />
                  <div style={{ position: 'absolute', left: 148, top: 30, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                    <WordText f={f} at={at + 10} halus>{k.nama}</WordText>
                  </div>
                  <div style={{ position: 'absolute', left: 148, top: 82, fontFamily: F, fontSize: 26, fontWeight: 700, color: mixHex(B.gray, FERI, sorotC(i)), whiteSpace: 'nowrap' }}>
                    <WordText f={f} at={k.fokusAt} halus>{k.fokus}</WordText>
                  </div>
                </div>
              </Kaca>);
          })}
        </div>) : null}

      {/* ══ D: isi indeks dievaluasi berkala — keluar / masuk ══ */}
      {papanD > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanD, f > T.kenapa - 40, 0) }}>
          <Kaca x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={1} warna={FERI} tab="atas">
            <div style={{ position: 'absolute', left: 52, top: 46, display: 'flex', alignItems: 'center', gap: 16, fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>
              <div style={{ position: 'relative', width: 68, height: 68 }}>
                <Kendaraan x={34} y={34} d={68} warna={FERI} ikon="feri" cermin p={1} />
              </div>
              Isi indeks
            </div>
          </Kaca>
          {/* kalender + panah berputar: dievaluasi secara berkala */}
          {(() => {
            const p = popIn(f, T.dievaluasi);
            if (p <= 0.001) return null;
            const cx = PANEL.x + PANEL.w / 2 - 120, cy = PANEL.y - PANEL.h / 2 + 100, g = cin(f, T.berkala, 90);
            return (
              <>
                <Bulat x={cx} y={cy} d={120} warna={FERI} ikon="kalender" p={p} />
                <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                  <circle cx={cx} cy={cy} r={80} fill="none" stroke={B.orange} strokeWidth={5} strokeLinecap="round" pathLength={1000}
                    strokeDasharray={`${880 * g} 1000`} transform={`rotate(-80 ${cx} ${cy})`} />
                  {g > 0.05 ? (() => {
                    const th = (-80 + 0.88 * 360 * g) * Math.PI / 180, ex = cx + 80 * Math.cos(th), ey = cy + 80 * Math.sin(th);
                    const tx = -Math.sin(th), ty = Math.cos(th), nx = Math.cos(th), ny = Math.sin(th);
                    return <path d={`M ${ex + tx * 16} ${ey + ty * 16} L ${ex - tx * 8 + nx * 12} ${ey - ty * 8 + ny * 12} L ${ex - tx * 8 - nx * 12} ${ey - ty * 8 - ny * 12} Z`}
                      fill={B.orange} opacity={R(g, 0.05, 0.2, 0, 1)} />;
                  })() : null}
                </svg>
                <div style={{ position: 'absolute', left: cx - 110 - 440, top: cy - 22, width: 440, textAlign: 'right', fontFamily: F, fontSize: 32, fontWeight: 800,
                  color: B.night, lineHeight: '44px', whiteSpace: 'nowrap' }}>
                  <WordText f={f} at={T.dievaluasi + 10} halus>Dievaluasi berkala</WordText>
                </div>
              </>);
          })()}
          {/* sepuluh perusahaan; ubin 3 keluar (tak memenuhi kriteria) → ubin baru masuk; lalu ubin 8 bertukar ("terus berubah") */}
          {Array.from({ length: 10 }, (_, i) => {
            const pos = posIsi(i);
            const pIsi = cin(f, T.aturannya + 60 + (i % 5) * 4, 40);
            const tukar = i === 3 ? { merah: T.nggak, keluar: T.keluar, masuk: T.masuk } : i === 8 ? { merah: T.berubah - 50, keluar: T.berubah, masuk: T.berubah + 60 } : null;
            if (!tukar) return <Ubin key={i} x={pos.x} y={pos.y} d={ISI.d} p={pIsi} isi={FERI} />;
            const merah = cin(f, tukar.merah, 30), out = cin(f, tukar.keluar, 60), inn = popIn(f, tukar.masuk);
            return (
              <React.Fragment key={i}>
                {out < 0.999 ? <Ubin x={pos.x} y={pos.y + 180 * out} d={ISI.d} p={pIsi} warna={mixHex(FERI, CORET, merah)} isi={mixHex(FERI, CORET, merah)} alfa={1 - out} /> : null}
                {out < 0.999 ? <Lencana x={pos.x} y={pos.y + 180 * out} d={ISI.d} p={popIn(f, tukar.merah + 10) * (1 - out)} warna={CORET} teks="✕" besar={50} /> : null}
                <Ubin x={pos.x} y={pos.y - 140 * (1 - Math.min(1, inn))} d={ISI.d} p={inn} isi={FERI} warna={FERI} alfa={Math.min(1, inn)} />
                <Lencana x={pos.x} y={pos.y} d={ISI.d} p={popIn(f, tukar.masuk + 20) * (1 - cin(f, tukar.masuk + 120))} warna={CEK} ikon="tersedia" besar={50} />
              </React.Fragment>);
          })}
          <Chip x={PANEL.x} y={PANEL.y + PANEL.h / 2 - 50} teks="Kriteria" ikon="kriteria" warna={FERI} p={popIn(f, T.prinsipnya)} size={28} />
        </div>) : null}

      {/* ══ E: satu saham vs indeks — langsung berisi; perusahaan indeks menyebar di "tersebar"; Rupiah berjalan ══ */}
      {papanE > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}><ArahKeluar aktif={f > T.kedua - 70}>
          {[0, 1].map((i) => {
            const indeks = i === 1;
            const p = popIn(f, T.kenapa + i * 20) * popOut(f, T.kedua - 35);
            const warna = indeks ? FERI : B.orange;
            const merah = cin(f, T.bermasalah, 40);
            const nilai = MODAL * (1 - (indeks ? 0.05 : 0.5) * cin(f, T.dampaknya + 20, 90)); // satu perusahaan −50 %: saham tunggal −50 %, indeks (10 perusahaan) −5 %
            const sebar = cin(f, T.tersebar);
            return (
              <Kaca key={i} x={KE.x[i]} y={KE.y} w={KE.w} h={KE.h} p={p} warna={warna} tab="atas" tepi={indeks ? sebar : 0}>
                <div style={{ position: 'absolute', left: 40, top: 40, display: 'flex', alignItems: 'center', gap: 16, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center' }}>
                    {indeks ? <Icon name="feri" size={40} color={B.white} style={{ transform: 'scaleX(-1)' }} /> : <Icon name="saham" size={38} color={B.white} />}
                  </div>
                  {indeks ? 'Indeks' : 'Satu saham'}
                </div>
                {indeks ? Array.from({ length: 10 }, (_, k) => {
                  // rapat → MENYEBAR di "tersebar" (jarak 64 → 104 px)
                  const x = KE.w / 2 + ((k % 5) - 2) * lerp(66, 108, sebar), y = 258 + (Math.floor(k / 5) - 0.5) * lerp(72, 108, sebar), bad = k === 6;
                  return <Ubin key={k} x={x} y={y} d={86} p={popIn(f, T.kenapa + 40 + k * 4)} isi={bad ? mixHex(FERI, ARAH.turun, merah) : FERI} warna={bad ? mixHex(FERI, ARAH.turun, merah) : FERI} />;
                }) : <Ubin x={KE.w / 2} y={252} d={180} p={popIn(f, T.kenapa + 30)} isi={mixHex(B.orange, ARAH.turun, merah)} warna={mixHex(B.orange, ARAH.turun, merah)} />}
                <Chip x={indeks ? KE.w / 2 - 108 + 112 : KE.w / 2 + 130} y={indeks ? 258 + 54 + 62 : 252 - 92} teks="▼ 50%" warna={ARAH.turun} p={popIn(f, T.bermasalah + 20)} size={24} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: 412, textAlign: 'center', fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray,
                  opacity: cin(f, T.kenapa + 50 + i * 20) }}>Nilai investasi</div>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 448, textAlign: 'center', fontFamily: F, fontSize: 58, fontWeight: 800, lineHeight: 1,
                  color: nilai < MODAL - 1 ? mixHex(B.night, ARAH.turun, Math.min(1, (MODAL - nilai) / (MODAL * 0.05))) : B.night, fontVariantNumeric: 'tabular-nums',
                  opacity: cin(f, T.kenapa + 50 + i * 20) }}>
                  {rpPenuh(Math.round(nilai / 1000) * 1000)}
                </div>
              </Kaca>);
          })}
        </ArahKeluar></div>) : null}

      {/* ══ F: feri + cincin 10 perusahaan (bagian kita) — cincin sektor tumbuh di "sekaligus", ubin berwarna sektor di katanya ══ */}
      {papanF > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanF, f > T.artinya - 20) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {SEKTOR.map((s, i) => {
              const g = cin(f, T.sekaligus + i * 6, 60);
              return g > 0.001 ? <circle key={s.nama} cx={cx} cy={CINCIN.y} r={CINCIN.r} fill="none" stroke={rgba(s.warna, 0.35)} strokeWidth={CINCIN.tebal} pathLength={360}
                strokeDasharray={`${Math.max(0, 69 * g)} 360`} transform={`rotate(${-90 + i * 72 + 1.5} ${cx} ${CINCIN.y})`} /> : null;
            })}
          </svg>
          <Kendaraan x={cx} y={CINCIN.y} d={190} warna={FERI} ikon="feri" cermin p={popIn(f, T.kedua + 5)} />
          {Array.from({ length: 10 }, (_, k) => {
            const s = SEKTOR[Math.floor(k / 2)], a = sudutUbin(k);
            const warna = mixHex(FERI, s.warna, cin(f, T[s.kata], 30));
            return <Ubin key={k} x={cx + CINCIN.r * Math.cos(a)} y={CINCIN.y + CINCIN.r * Math.sin(a)} d={CINCIN.d} p={popIn(f, T.kedua + 20 + k * 6)} isi={warna} warna={warna} />;
          })}
          {SEKTOR.map((s, i) => {
            const y = CINCIN.y + (i - 2) * BARIS_F.dy;
            return (
              <React.Fragment key={s.nama}>
                <Bulat x={BARIS_F.x} y={y} d={BARIS_F.d} warna={s.warna} ikon={s.ikon} p={popIn(f, T[s.kata])} />
                <div style={{ position: 'absolute', left: BARIS_F.x + BARIS_F.d / 2 + 26, top: y - 22, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
                  <WordText f={f} at={T[s.kata] + 10} halus>{s.nama}</WordText>
                </div>
              </React.Fragment>);
          })}
        </div>) : null}

      {/* ══ G: tak perlu terus menebak pemenang ══ */}
      {papanG > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}><ArahKeluar aktif={f > T.indeksH - 40}>
          <KarakterLingkar pose={MURID_BIRU} x={lerp(960, 500, cin(f, T.menebak + 6))} y={560} D={300} s={popIn(f, T.artinya + 45) * popOut(f, T.indeksH)} warna={B.orange} />
          <Kutipan x={1190} y={390} teks="Saham mana yang akan jadi pemenang berikutnya?" p={popIn(f, T.menebak + 30) * popOut(f, T.indeksH - 5)} warna={B.blue} ikon="menebak" size={32}
            coret={R(f, T.berikutnya + 10, T.berikutnya + 40, 0, 1, io)} />
          {[0, 1, 2, 3].map((k) => {
            const x = 1000 + k * 130, y = 630;
            const p = popIn(f, T.saham + k * 8) * popOut(f, T.indeksH - 15 + k * 4);
            const redup = 1 - 0.5 * cin(f, T.berikutnya + 30);
            return (
              <React.Fragment key={k}>
                <Ubin x={x} y={y} d={104} p={p} warna={B.orange} alfa={redup} />
                <Lencana x={x} y={y} d={104} p={popIn(f, T.saham + 20 + k * 8) * popOut(f, T.indeksH - 15 + k * 4)} warna={B.orange} teks="?" besar={46} />
              </React.Fragment>);
          })}
        </ArahKeluar></div>) : null}

      {/* ══ H: indeks tetap bisa turun & berisiko — tapi tidak bergantung pada satu perusahaan ══ */}
      {papanH > 0.001 ? (() => {
        const satu = cin(f, T.satuH + 20, 60);
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanH, f > T.itulah) }}>
            {Array.from({ length: 10 }, (_, k) => {
              const a = (-90 + (k * 360) / 10) * Math.PI / 180;
              const jatuh = k === 3 ? satu : 0;
              const merah = k === 3 ? cin(f, T.satuH) : 0;
              return <Ubin key={k} x={RH.x + RH.r * Math.cos(a)} y={RH.y + RH.r * Math.sin(a) + 160 * jatuh} d={RH.d} p={popIn(f, T.indeksH + 20 + k * 5)}
                isi={mixHex(FERI, ARAH.turun, merah)} warna={mixHex(FERI, ARAH.turun, merah)} alfa={1 - jatuh} />;
            })}
            <Kendaraan x={RH.x} y={RH.y} d={210} warna={FERI} ikon="feri" cermin p={popIn(f, T.indeksH)} />
            <Label x={RH.x} y={RH.y + 105 + 40} teks="Indeks" f={f} at={T.indeksH + 20} size={32} />
            <Chip x={RH.x - 170} y={830} teks="Bisa turun" ikon="pasarTurun" warna={ARAH.turun} p={popIn(f, T.turun)} size={28} />
            <Chip x={RH.x + 170} y={830} teks="Punya risiko" ikon="risiko" warna={B.orange} p={popIn(f, T.risiko)} size={28} />
          </div>);
      })() : null}

      {/* ══ I: peta sungai V04 — feri menyeberang: kendaraan masuk akal untuk perjalanan jangka panjang ══ */}
      {papanI > 0.001 ? (() => {
        const sebrang = R(f, T.perjalanan - 40, T.panjang + 40, 0, 1, io);
        const fx = lerp(FERI_I.x0, FERI_I.x1, sebrang);
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanI, f > S03_AKHIR) }}>
            <Sungai id="s03" top={110} bottom={1010} p={cin(f, T.itulah + 20)} />
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d={`M ${PETA.p0} ${PETA.y} L ${PETA.p1} ${PETA.y}`} g={cin(f, T.itulah + 40)} warna={FERI} tebal={5} titik={false} />
              <Penghubung d={`M ${PETA.p0} ${PETA.y} L ${PETA.p1} ${PETA.y}`} g={R(f, T.perjalanan - 40, T.panjang + 40, 0, 1, io) * ((FERI_I.x1 - PETA.p0) / (PETA.p1 - PETA.p0))}
                warna={FERI} tebal={7} dash={false} titik={false} />
            </svg>
            <Pijakan x={PETA.pijakan.x} y={PETA.pijakan.y} a={PETA.pijakan.a} p={cin(f, T.itulah + 10)} />
            <RumahIso x={PETA.p1} y={PETA.y} w={PETA.rumah} p={cin(f, T.itulah + 30)} />
            <KarakterLingkar pose={MURID_BIRU} x={PETA.orang.x} y={PETA.orang.y} D={PETA.orang.D} s={popIn(f, T.itulah + 10)} warna={B.orange} />
            <Label x={PETA.orang.x} y={PETA.label} teks="Banyak orang" f={f} at={T.banyakOrang} size={30} />
            {f < S03_AKHIR ? <Kendaraan x={fx} y={PETA.y} d={FERI_I.d} warna={FERI} ikon="feri" cermin p={popIn(f, T.feriI)} cincin /> : null}
            <Lencana x={fx} y={PETA.y} d={FERI_I.d} p={popIn(f, T.panjang + 50)} warna={CEK} ikon="tersedia" besar={56} />
          </div>);
      })() : null}
    </AbsoluteFill>);
};
