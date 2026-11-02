import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, CORET, F, io, mixHex, R, rgba } from '../theme';
import { ArahKeluar, cin, gayaPapan, Icon, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Label, Lencana, geser } from '../parts/umum';
import { Kaca, KarakterLingkar, Masuk, Penghubung, PoseKarakter } from '../parts/kaca';
import { Foto } from '../parts/nyata';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { Sungai } from '../parts/sungai';
import { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { rpJutaKoma } from '../parts/nominal';

/**
 * SCENE 03 — Naik Feri: Kenapa Indeks Cocok untuk Banyak Orang? (BATAS.s3 – BATAS.s4). Ide: 04_Asset/Ide-Visual-Scene-03.md.
 * Masker Scene 02 mendarat jadi cakram FERI → 9 papan: A feri = reksa dana indeks · B perusahaan disaring aturan masuk keranjang indeks ·
 * C hub "Indeks Indonesia" + 6 kartu indeks (kiri/kanan bergantian) · D panel menyatu: isi dievaluasi berkala, keluar/masuk · E satu saham vs
 * indeks saat satu perusahaan bermasalah (Rp berjalan) · F donat sektor · G "Saham mana pemenang berikutnya?" dicoret · H feri tetap berlayar
 * walau satu perusahaan turun · I feri menyeberang sungai (memory anchor Scene 01).
 */
const A0 = BATAS.s3;
// naskah revisi 21 Okt: nama indeks TIDAK dibaca lagi ("Ada yang fokus pada saham besar dan aktif, ada yang melihat valuasi, kualitas perusahaan,
// pertumbuhan, dividen, sampai perusahaan BUMN") — kartu tetap tampil (MOTION NOTE), muncul di kata kategorinya.
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
const T0 = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
/** kartu yang frasanya satu kata: kartu & teks fokusnya muncul di kata itu */
const T = { ...T0, quality: T0.kualitas, growth30: T0.pertumbuhan, high: T0.dividen };
export const S03_T = T;
export const S03_AKHIR = BATAS.s4;
/** masker Scene 02 mendarat di cakram feri (tengah frame) */
export const S03_MASUK: Masuk = { x: 960, y: 520, r: 100, warna: JALUR_WARNA.feri, mulai: A0 - 20 };
const DARAT = S03_MASUK.mulai + 60;

const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const FERI = JALUR_WARNA.feri;
/** Rp juta tanpa ",0" untuk angka bulat (ATURAN §6: angka bulat tanpa .0) */
const rpJt = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? `Rp${Math.round(v)} jt` : rpJutaKoma(v));
const antara = (f: number, masuk: number, keluar: number, d = 30) => Math.min(cin(f, masuk, d), 1 - cin(f, keluar, d));

/** ubin perusahaan (lingkaran putih bertepi warna, ikon gedung) */
const Ubin: React.FC<{ x: number; y: number; d: number; p: number; warna?: string; alfa?: number; isi?: string }> = ({ x, y, d, p, warna = FERI, alfa = 1, isi }) => (
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: isi ?? B.white, border: `4px solid ${warna}`,
      boxSizing: 'border-box', display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`,
      opacity: alfa < 1 ? alfa : undefined, boxShadow: `0 10px 22px -12px ${rgba(warna, 0.8)}` }}>
      <Icon name="perusahaan" size={d * 0.5} color={isi ? B.white : warna} />
    </div>));

/* ── B: kumpulan → saring → keranjang ── */
const KOLAM = { x0: 300, y0: 440, dx: 104, dy: 120, kol: 4, n: 12 }; // QA pusat 19 Okt: papan B −44 → +40
const PILIH = [0, 2, 5, 7, 8, 11]; // enam perusahaan yang lolos aturan
const KERANJANG = { x: 1500, y: 560, w: 440, h: 420 };
const KEPALA_H = 128;
const posKolam = (i: number) => ({ x: KOLAM.x0 + (i % KOLAM.kol) * KOLAM.dx, y: KOLAM.y0 + Math.floor(i / KOLAM.kol) * KOLAM.dy });
const posKeranjang = (k: number) => ({ x: KERANJANG.x - 120 + (k % 3) * 120, y: KERANJANG.y - 10 + Math.floor(k / 3) * 120 });

/* ── C: hub + 6 kartu indeks (kiri/kanan bergantian menurut urutan VO) ── */
type KartuIdx = { nama: string; fokus: string; ikon: KunciIkon; warna: string; at: number; fokusAt: number; x: number; y: number };
const KARTU_W = 520, KARTU_H = 136; // pratinjau 1: teks 28/24 px terlalu kecil → 30/26 px
const kartuIdx = (): KartuIdx[] => [
  { nama: 'LQ45 · IDX30', fokus: 'Saham besar & aktif', ikon: 'gedungBesar', warna: B.blue, at: T.lq45, fokusAt: T.fokus, x: 430, y: 370 }, // QA diam: fokus dulu di "besar" (2,75 dtk diam)
  { nama: 'IDX Value30', fokus: 'Valuasi', ikon: 'valuasi', warna: B.blue, at: T.value30, fokusAt: T.valuasi, x: 1490, y: 370 },
  { nama: 'IDX Quality30', fokus: 'Kualitas perusahaan', ikon: 'kualitas', warna: B.blue, at: T.quality, fokusAt: T.kualitas, x: 430, y: 560 },
  { nama: 'IDX Growth30', fokus: 'Pertumbuhan', ikon: 'pertumbuhan', warna: B.blue, at: T.growth30, fokusAt: T.pertumbuhan, x: 1490, y: 560 },
  { nama: 'IDX High Dividend 20', fokus: 'Pembagi dividen', ikon: 'dividen', warna: B.blue, at: T.high, fokusAt: T.dividen, x: 430, y: 750 },
  { nama: 'IDX BUMN20', fokus: 'Perusahaan BUMN', ikon: 'pemerintah', warna: B.blue, at: T.bumn20, fokusAt: T.bumn, x: 1490, y: 750 },
];

/* ── D: panel isi indeks ── */
const PANEL = { x: 960, y: 530, w: 1180, h: 520 };
const ISI = { kol: 5, dx: 170, dy: 160, d: 112 };
const posIsi = (i: number) => ({ x: PANEL.x - 2 * ISI.dx + (i % ISI.kol) * ISI.dx, y: PANEL.y - 34 + Math.floor(i / ISI.kol) * ISI.dy }); // −34: beri jarak chip Kriteria di bawah

/* ── E: satu saham vs indeks ── */
const KARTU_E = { y: 530, w: 600, h: 500, x: [640, 1280] };

/* ── F: donat sektor (bobot sama — ilustratif, tanpa angka) ── */
const DONAT = { x0: 960, x: 680, y: 560, r: 180, tebal: 50 }; // pratinjau 1: donat di tengah + simpul melingkar = berat ke bawah (label 935 px)
const BARIS_F = { x: 1130, d: 84, dy: 104 };
const SEKTOR: { nama: string; ikon: KunciIkon; warna: string; kata: keyof typeof T }[] = [
  { nama: 'Bank', ikon: 'sektorBank', warna: B.blue, kata: 'bank' },
  { nama: 'Telekomunikasi', ikon: 'telekomunikasi', warna: B.blueLite, kata: 'telko' },
  { nama: 'Konsumsi', ikon: 'konsumsi', warna: B.turq, kata: 'konsumsi' },
  { nama: 'Energi', ikon: 'energi', warna: B.turqLite, kata: 'energi' },
  { nama: 'Lainnya', ikon: 'perusahaan', warna: B.grayLite, kata: 'lainnya' },
];

export const Scene03: React.FC<{ f: number }> = ({ f }) => {
  if (f < DARAT || f > S03_AKHIR + 90) return null;

  /* ── pusat feri: A (tengah) → B (masuk ke kepala keranjang) ── */
  const keKeranjang = cin(f, T.sekumpulan - 10); // QA pusat: dulu di "indeks" → feri sendirian di kanan atas ±1 dtk (+540)
  const feriA = { x: 960 + (KERANJANG.x - KERANJANG.w / 2 + 70 - 960) * keKeranjang, y: 520 + (KERANJANG.y - KERANJANG.h / 2 + 64 - 520) * keKeranjang, d: 200 + (64 - 200) * keKeranjang };
  const papanAB = 1 - cin(f, T.indonesia - 10, 30);

  /* ── C ── */
  const papanC = antara(f, T.indonesia - 20, T.aturannya + 40);
  const menyatuD = cin(f, T.aturannya + 30); // 6 kartu + hub → satu panel (Simon 14 Okt: banyak panel → satu = menyatu)
  /* ── D ── */
  const papanD = cin(f, T.aturannya + 30, 30) * (1 - cin(f, T.kenapa, 30));
  /* ── E ── */
  const papanE = f > T.kenapa - 40 && f < T.kedua ? 1 : 0; // keluar = pop-out kartu (window kedua−65…−5), feri F tumbuh di celah tengahnya
  /* ── F ── */
  const papanF = antara(f, T.kedua, T.artinya + 15); // baris 'Lainnya' (VO rapat ke 'Artinya') sempat mendarat penuh ±1 dtk
  /* ── G ── */
  const papanG = f > T.artinya - 40 && f < T.indeksH + 50 ? 1 : 0; // keluar = pop-out (gelembung dulu, lalu murid)
  /* ── H ── */
  const papanH = f > T.indeksH ? 1 - cin(f, T.itulah + 20, 30) : 0;
  /* ── I ── */
  const papanI = cin(f, T.itulah, 60) * (1 - cin(f, S03_AKHIR + 20, 40)); // sesudah batas: semua pudar, FERI diserahkan ke Scene 04 (S03_FERI_AKHIR)

  // QA pusat 19 Okt: kartu LQ45 dulu sendirian di kiri ±6 dtk (−334) → muncul di TENGAH di atas hub, lalu bergeser ke slotnya memberi ruang kartu kedua
  const geserK1 = cin(f, T.value30 - 24);
  // QA pusat 2: dua baris pertama = isi 302–696 (−41) → seluruh papan C turun 41 px, naik memberi ruang baris ketiga di "High Dividend"
  // hub di tengah → naik memberi ruang labelnya (−48) → turun memberi ruang kartu pertama di atasnya (+41) → naik saat baris ketiga muncul (0)
  const dyC = -48 * cin(f, T.banyak - 24) * (1 - cin(f, T.lq45 - 24)) + 41 * cin(f, T.lq45 - 24) * (1 - cin(f, T.high - 24));
  const kartu = kartuIdx().map((k, i) => ({ ...k, x: i === 0 ? 960 + (k.x - 960) * geserK1 : k.x, y: k.y + dyC }));

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A–B: feri = reksa dana indeks → perusahaan disaring aturan masuk keranjang ══ */}
      {papanAB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanAB, f > T.indonesia - 40) }}>
          {/* kepala keranjang dulu (feri + "Indeks"); badannya memanjang tepat saat ubin pertama tiba (tanpa badan kosong — Simon 13 Okt) */}
          {(() => { const hK = KEPALA_H + (KERANJANG.h - KEPALA_H) * cin(f, T.dipilih + 50, 60); return (
          <Kaca x={KERANJANG.x} y={KERANJANG.y - KERANJANG.h / 2 + hK / 2} w={KERANJANG.w} h={hK} p={cin(f, T.sekumpulan - 10)} warna={FERI} tab="atas">
            <div style={{ position: 'absolute', left: 120, top: 44, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, opacity: cin(f, T.sekumpulan + 10) }}>Indeks</div>
          </Kaca>); })()}
          <Label x={feriA.x} y={feriA.y + feriA.d / 2 + 40} teks="Reksa dana indeks" f={f} at={T.reksa} size={34} lebar={500} alfa={1 - keKeranjang} />
          {/* kumpulan perusahaan */}
          {Array.from({ length: KOLAM.n }, (_, i) => {
            const k = PILIH.indexOf(i);
            const baris = Math.floor(i / KOLAM.kol);
            const p = popIn(f, T.sekumpulan + baris * 20);
            const pindah = k >= 0 ? R(f, T.dipilih + 20 + k * 20, T.dipilih + 80 + k * 20, 0, 1, io) : 0;
            const a = posKolam(i), b = posKeranjang(Math.max(0, k)), m = { x: 960, y: 560 };
            // lewat corong: kolam → corong → keranjang
            const u = pindah, x = u < 0.5 ? a.x + (m.x - a.x) * (u * 2) : m.x + (b.x - m.x) * ((u - 0.5) * 2);
            const y = u < 0.5 ? a.y + (m.y - a.y) * (u * 2) : m.y + (b.y - m.y) * ((u - 0.5) * 2);
            const redup = k < 0 ? 1 - 0.6 * cin(f, T.dipilih + 60) : 1;
            const lewat = u > 0.35 && u < 0.65 ? 0.4 : 1; // tertelan corong sesaat
            return <Ubin key={i} x={x} y={y} d={84} p={p} warna={k >= 0 && u > 0.5 ? FERI : B.gray} alfa={redup * lewat} isi={k >= 0 && u > 0.5 ? FERI : undefined} />;
          })}
          <Bulat x={960} y={560} d={150} warna={B.orange} ikon="saring" p={popIn(f, T.dipilih - 10)} />
          <Label x={960} y={560 + 75 + 40} teks="Aturan" f={f} at={T.aturan} size={32} />
        </div>) : null}
      {/* feri (A) → ikon kepala keranjang (B) */}
      {papanAB > 0.001 ? <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanAB, f > T.indonesia - 40) }}>
        <Kendaraan x={feriA.x} y={feriA.y} d={feriA.d} warna={FERI} ikon="feri" cermin p={1} />
      </div> : null}

      {/* ══ C: hub "Indeks Indonesia" + 6 kartu → D: menyatu jadi panel ══ */}
      {papanC > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: papanC }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - menyatuD }}>
            {kartu.map((k, i) => {
              const kiri = k.x < 960 - 1, x1 = kiri ? k.x + KARTU_W / 2 + 6 : k.x - KARTU_W / 2 - 6;
              const x0 = kiri ? 960 - 92 : 960 + 92;
              return <Penghubung key={i} d={`M ${x0} ${560 + dyC} C ${(x0 + x1) / 2} ${560 + dyC} ${(x0 + x1) / 2} ${k.y} ${x1} ${k.y}`} g={i === 0 ? cin(f, T.value30 + 10) : cin(f, k.at - 20)} warna={mixHex(k.warna, B.night, 0)} tebal={4} titik={false} />;
            })}
          </svg>
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - menyatuD }}>
            <Kendaraan x={960} y={560 + dyC} d={170} warna={FERI} ikon="feri" cermin p={popIn(f, T.indonesia)} />
            <Label x={960} y={560 + dyC + 85 + 40} teks="Indeks Indonesia" f={f} at={T.banyak} size={30} lebar={360} />
          </div>
          {kartu.map((k, i) => {
            // menyatu: kartu bergeser & mengecil ke ubin isi panel (D)
            const tujuan = posIsi(i + 2);
            const x = k.x + (tujuan.x - k.x) * menyatuD, y = k.y + (tujuan.y - k.y) * menyatuD;
            const w = KARTU_W + (ISI.d - KARTU_W) * menyatuD, h = KARTU_H + (ISI.d - KARTU_H) * menyatuD;
            return (
              <Kaca key={i} x={x} y={y} w={w} h={h} p={popIn(f, k.at)} warna={k.warna} tab="kiri" radius={28 + 28 * menyatuD} alfa={1 - menyatuD}>
                <div style={{ position: 'absolute', inset: 0, opacity: 1 - cin(f, T.aturannya + 10, 30) }}>
                  <Bulat x={74} y={KARTU_H / 2} d={82} warna={k.warna} ikon={k.ikon} p={popIn(f, k.at + 10)} />
                  <div style={{ position: 'absolute', left: 134, top: 22, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                    <WordText f={f} at={k.at + 10} halus>{k.nama}</WordText>
                  </div>
                  <div style={{ position: 'absolute', left: 134, top: 74, fontFamily: F, fontSize: 26, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
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
            <div style={{ position: 'absolute', left: 48, top: 40, display: 'flex', alignItems: 'center', gap: 16, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: FERI, display: 'grid', placeItems: 'center' }}>
                <Icon name="feri" size={38} color={B.white} style={{ transform: 'scaleX(-1)' }} />
              </div>
              Isi indeks
            </div>
          </Kaca>
          {/* kalender + panah berputar: dievaluasi secara berkala */}
          {(() => {
            const p = popIn(f, T.dievaluasi);
            if (p <= 0.001) return null;
            const cx = PANEL.x + PANEL.w / 2 - 110, cy = PANEL.y - PANEL.h / 2 + 96, g = cin(f, T.berkala, 90);
            return (
              <>
                <Bulat x={cx} y={cy} d={110} warna={FERI} ikon="kalender" p={p} />
                <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                  <circle cx={cx} cy={cy} r={74} fill="none" stroke={B.orange} strokeWidth={5} strokeLinecap="round" pathLength={1000}
                    strokeDasharray={`${880 * g} 1000`} transform={`rotate(-80 ${cx} ${cy})`} />
                  {/* kepala panah (segitiga) di ujung busur, searah putaran — Simon 20 Okt "apa maksudnya ini?": panah dulu terlalu kecil */}
                  {g > 0.05 ? (() => {
                    const th = (-80 + 0.88 * 360 * g) * Math.PI / 180, ex = cx + 74 * Math.cos(th), ey = cy + 74 * Math.sin(th);
                    const tx = -Math.sin(th), ty = Math.cos(th), nx = Math.cos(th), ny = Math.sin(th);
                    return <path d={`M ${ex + tx * 16} ${ey + ty * 16} L ${ex - tx * 8 + nx * 12} ${ey - ty * 8 + ny * 12} L ${ex - tx * 8 - nx * 12} ${ey - ty * 8 - ny * 12} Z`}
                      fill={B.orange} opacity={R(g, 0.05, 0.2, 0, 1)} />;
                  })() : null}
                </svg>
                {/* konteks untuk awam: arti kalender + panah berputar */}
                <div style={{ position: 'absolute', left: cx - 100 - 420, top: cy - 22, width: 420, textAlign: 'right', fontFamily: F, fontSize: 30, fontWeight: 800,
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
                {out < 0.999 ? <Lencana x={pos.x} y={pos.y + 180 * out} d={ISI.d} p={popIn(f, tukar.merah + 10) * (1 - out)} warna={CORET} teks="✕" besar={46} /> : null}
                <Ubin x={pos.x} y={pos.y - 140 * (1 - Math.min(1, inn))} d={ISI.d} p={inn} isi={FERI} warna={FERI} alfa={Math.min(1, inn)} />
                <Lencana x={pos.x} y={pos.y} d={ISI.d} p={popIn(f, tukar.masuk + 20) * (1 - cin(f, tukar.masuk + 120))} warna={CEK} ikon="tersedia" besar={46} />
              </React.Fragment>);
          })}
          {/* chip kriteria (memenuhi / tidak) */}
          <Chip x={PANEL.x} y={PANEL.y + PANEL.h / 2 - 34} teks="Kriteria" ikon="kriteria" warna={FERI} p={popIn(f, T.prinsipnya)} size={26} />
        </div>) : null}

      {/* ══ E: satu saham vs indeks ══ */}
      {papanE > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: papanE }}><ArahKeluar aktif={f > T.kedua - 70}>
          {[0, 1].map((i) => {
            const indeks = i === 1;
            const p = popIn(f, T.kenapa + i * 20) * popOut(f, T.kedua - 35);
            const warna = indeks ? FERI : B.orange;
            const merah = cin(f, T.bermasalah, 40);
            const nilai = 10 - (indeks ? 0.5 : 5) * cin(f, T.dampaknya + 20, 90); // satu perusahaan turun 50 %: saham tunggal −50 %, indeks 10 perusahaan −5 %
            return (
              <Kaca key={i} x={KARTU_E.x[i]} y={KARTU_E.y} w={KARTU_E.w} h={KARTU_E.h} p={p} warna={warna} tab="atas" tepi={indeks ? cin(f, T.tersebar) : 0}>
                <div style={{ position: 'absolute', left: 40, top: 40, display: 'flex', alignItems: 'center', gap: 14, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center' }}>
                    {indeks ? <Icon name="feri" size={38} color={B.white} style={{ transform: 'scaleX(-1)' }} /> : <Icon name="saham" size={36} color={B.white} />}
                  </div>
                  {indeks ? 'Indeks' : 'Satu saham'}
                </div>
                {indeks ? Array.from({ length: 10 }, (_, k) => {
                  const x = 120 + (k % 5) * 90, y = 190 + Math.floor(k / 5) * 96, bad = k === 6;
                  // QA diam 19 Okt: sepuluh perusahaan MENYEBAR di "tersebar" (dulu sudah ada sejak awal → 3,25 dtk diam)
                  return <Ubin key={k} x={x} y={y} d={72} p={popIn(f, T.tersebar - 20 + k * 5)} isi={bad ? mixHex(FERI, ARAH.turun, merah) : FERI} warna={bad ? mixHex(FERI, ARAH.turun, merah) : FERI} />;
                }) : <Ubin x={KARTU_E.w / 2} y={236} d={150} p={popIn(f, T.risikonya)} isi={mixHex(B.orange, ARAH.turun, merah)} warna={mixHex(B.orange, ARAH.turun, merah)} />}
                {/* pil "▼50%" di perusahaan yang bermasalah */}
                <Chip x={indeks ? 120 + 1 * 90 + 0 : KARTU_E.w / 2 + 110} y={indeks ? 190 + 96 + 62 : 236 - 70} teks="▼ 50%" warna={ARAH.turun} p={popIn(f, T.bermasalah + 20)} size={22} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: F, fontSize: 54, fontWeight: 800,
                  color: nilai < 9.99 ? ARAH.turun : B.night, fontVariantNumeric: 'tabular-nums', opacity: cin(f, T.kenapa + 40 + i * 20) }}>
                  {rpJt(Math.round(nilai * 10) / 10)}
                </div>
              </Kaca>);
          })}
        </ArahKeluar></div>) : null}

      {/* ══ F: donat sektor (kiri) + daftar sektor bertumpuk (kanan) — pola rute: pusat mulai di tengah, bergeser kiri memberi ruang
           saat sektor pertama muncul; tiap sektor = busur donat + baris ikon/nama di katanya ══ */}
      {papanF > 0.001 ? (() => {
        const ruang = cin(f, T.bank - 10); // QA pusat: dulu −24 → donat sudah di kiri sebelum baris pertama (−110)
        const dx = DONAT.x0 + (DONAT.x - DONAT.x0) * ruang;
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanF, f > T.artinya - 20) }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {SEKTOR.map((s, i) => {
                // "banyak sektor SEKALIGUS": kelima busur tumbuh bersamaan (stagger 6f), nama sektornya menyusul per kata
                const g = cin(f, T.sekaligus + i * 6, 60);
                const busur = 360 / SEKTOR.length, a0 = -90 + i * busur;
                return g > 0.001 ? <circle key={s.nama} cx={dx} cy={DONAT.y} r={DONAT.r} fill="none" stroke={s.warna} strokeWidth={DONAT.tebal} pathLength={360}
                  strokeDasharray={`${Math.max(0, (busur - 3) * g)} 360`} transform={`rotate(${a0 + 1.5} ${dx} ${DONAT.y})`} /> : null;
              })}
            </svg>
            <Kendaraan x={dx} y={DONAT.y} d={190} warna={FERI} ikon="feri" cermin p={popIn(f, T.kedua + 5)} />
            {SEKTOR.map((s, i) => {
              const y = DONAT.y + (i - 2) * BARIS_F.dy;
              return (
                <React.Fragment key={s.nama}>
                  <Bulat x={BARIS_F.x} y={y} d={BARIS_F.d} warna={s.warna} ikon={s.ikon} p={popIn(f, T[s.kata])} />
                  <div style={{ position: 'absolute', left: BARIS_F.x + BARIS_F.d / 2 + 26, top: y - 22, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
                    <WordText f={f} at={T[s.kata] + 10} halus>{s.nama}</WordText>
                  </div>
                </React.Fragment>);
            })}
          </div>);
      })() : null}

      {/* ══ G: tak perlu menebak pemenang ══ */}
      {papanG > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: papanG }}><ArahKeluar aktif={f > T.indeksH - 40}>
          {/* murid mulai di TENGAH, bergeser ke kiri memberi ruang gelembung (memimpin 24f, pola Scene 01) */}
          <KarakterLingkar pose={MURID_BIRU} x={960 + (500 - 960) * cin(f, T.menebak + 30 - 24)} y={585} D={250} s={popIn(f, T.artinya + 45) * popOut(f, T.indeksH)} warna={B.orange} />
          <Kutipan x={1100} y={375} teks="Saham mana yang akan jadi pemenang berikutnya?" p={popIn(f, T.menebak + 30) * popOut(f, T.indeksH - 5)} warna={B.blue} ikon="menebak" size={30}
            coret={R(f, T.berikutnya + 10, T.berikutnya + 40, 0, 1, io)} />
        </ArahKeluar></div>) : null}

      {/* ══ H: indeks tetap bisa turun, tetap berisiko — tapi tidak bergantung pada satu perusahaan ══ */}
      {papanH > 0.001 ? (() => {
        const cx = 960, cy = 540, n = 10, rr = 240; // QA pusat 20 Okt: 500 → 540
        const satu = cin(f, T.satuH + 20, 60);
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanH, f > T.itulah) }}>
            {Array.from({ length: n }, (_, k) => {
              const a = (-90 + (k * 360) / n) * Math.PI / 180;
              const jatuh = k === 3 ? satu : 0;
              const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a) + 160 * jatuh;
              const p = popIn(f, T.menggantungkan + (k % 5) * 6);
              return <Ubin key={k} x={x} y={y} d={78} p={p} isi={k === 3 ? mixHex(FERI, ARAH.turun, cin(f, T.satuH)) : FERI}
                warna={k === 3 ? mixHex(FERI, ARAH.turun, cin(f, T.satuH)) : FERI} alfa={1 - jatuh} />;
            })}
            <Kendaraan x={cx} y={cy} d={210} warna={FERI} ikon="feri" cermin p={popIn(f, T.indeksH + 40)} />
            <Lencana x={cx} y={cy} d={210} p={popIn(f, T.turun)} warna={ARAH.turun} ikon="pasarTurun" besar={74} />
            <Lencana x={cx - 0.72 * 210} y={cy} d={210} p={popIn(f, T.risiko)} warna={B.orange} ikon="risiko" besar={74} />
            <Label x={cx} y={cy + 105 + 40} teks="Indeks" f={f} at={T.indeksH + 50} size={32} />
          </div>);
      })() : null}

      {/* ══ I: feri menyeberang sungai — kendaraan masuk akal untuk perjalanan jangka panjang ══ */}
      {papanI > 0.001 ? (() => {
        const sebrang = R(f, T.perjalanan - 40, T.panjang + 40, 0, 1, io);
        const fx = 640 + (1280 - 640) * sebrang;
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanI, f > S03_AKHIR) }}>
            <Sungai id="s03" top={150} bottom={1050} p={cin(f, T.itulah + 20)} />
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d="M 400 580 L 1480 580" g={cin(f, T.itulah + 40)} warna={FERI} tebal={5} titik={false} />
              <Penghubung d="M 400 580 L 1480 580" g={sebrang} warna={FERI} tebal={7} dash={false} titik={false} />
            </svg>
            <KarakterLingkar pose={MURID_BIRU} x={270} y={580} D={240} s={popIn(f, T.itulah + 10)} warna={B.orange} />
            <Label x={270} y={580 + 120 + 36} teks="Banyak orang" f={f} at={T.banyakOrang} size={30} />
            <Foto k="rumahModern" x={1660} y={580} w={320} p={popIn(f, T.itulah + 10)} />
            {f < S03_AKHIR ? <Kendaraan x={fx} y={580} d={140} warna={FERI} ikon="feri" cermin p={popIn(f, T.feriI)} /> : null}
            <Lencana x={fx} y={580} d={140} p={popIn(f, T.panjang + 50)} warna={CEK} ikon="tersedia" besar={56} />
          </div>);
      })() : null}
    </AbsoluteFill>);
};
