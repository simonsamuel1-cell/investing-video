import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, bayanganKecil, CEK, CORET, F, io, mixHex, R, rgba, SISI } from '../theme';
import { cin, cinV, gayaPapan, Icon, KataTopeng, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Label, Lencana, geser } from '../parts/umum';
import { Chevron, GeoKartu, Kaca, KacaMorf, KarakterLingkar, Masuk, Penghubung, PoseKarakter } from '../parts/kaca';
import { Foto } from '../parts/nyata';
import { INVESTOR_KECIL, JALUR_WARNA, kipasKerumunan, Kendaraan } from '../parts/jalur';
import { Sungai } from '../parts/sungai';
import { Pijakan, RumahIso } from '../parts/v04';
import { rpPenuh } from '../parts/nominal';
import { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { KonteksBayanganGelap } from '../skala';
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

/** ubin perusahaan (lingkaran putih bertepi warna / terisi warna, ikon gedung) — pop */
const Ubin: React.FC<{ x: number; y: number; d: number; p: number; warna?: string; alfa?: number; isi?: string; ikon?: KunciIkon }> = ({ x, y, d, p, warna = FERI, alfa = 1, isi, ikon = 'perusahaan' }) => (
  p <= 0.001 ? null : (
    // ikon lingkaran dibalik (22 Okt sore): selalu PUTIH; `isi` = warna outline & ikon (dulu isi penuh + ikon putih)
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${isi ?? warna}`,
      boxSizing: 'border-box', display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`,
      opacity: alfa < 1 ? alfa : undefined, boxShadow: bayanganKecil(isi ?? warna) }}>
      <Icon name={ikon} size={d * 0.5} color={isi ?? warna} />
    </div>));

/** PERUSAHAAN BERAGAM (Simon 24 Okt: "Bedakan warna/icon perusahaan agar bisa lebih menggambarkan 'sekumpulan'") — ikon sektor + warna brand/tint,
 *  tetangga tak pernah sama. Kumpulan B (12), isi indeks D/E (10). */
type Rupa = { ikon: KunciIkon; warna: string };
const RUPA: Rupa[] = [
  { ikon: 'sektorBank', warna: B.blue }, { ikon: 'konsumsi', warna: B.turq }, { ikon: 'energi', warna: B.orange }, { ikon: 'telekomunikasi', warna: B.blueLite },
  { ikon: 'gedungBesar', warna: B.orangeLite }, { ikon: 'perusahaan', warna: B.turq },
];
const rupaKolam = (i: number): Rupa => RUPA[(i + Math.floor(i / KOLAM.kol)) % RUPA.length];
const rupaIsi = (i: number): Rupa => RUPA[(i + 2 * Math.floor(i / 5)) % RUPA.length];
/** perusahaan yang KELUAR (ditandai ✕) vs yang BARU MASUK (Simon 24 Okt: "Bedakan warna dan icon perusahaan yang baru masuk") */
const RUPA_LAMA: Record<number, Rupa> = { 3: { ikon: 'perusahaan', warna: B.gray }, 8: { ikon: 'gedungBesar', warna: B.gray } };
const RUPA_BARU: Record<number, Rupa> = { 3: { ikon: 'pertumbuhan', warna: B.turq }, 8: { ikon: 'kualitas', warna: B.orange } };
const rupaD = (i: number): Rupa => RUPA_BARU[i] ?? rupaIsi(i);
/** warna kartu indeks C (Simon 24 Okt: "Bedakan warna untuk icon dan panel pada adegan 6 index") */
const WARNA_KC = [B.blue, B.turq, B.orange, B.blueLite, B.orangeLite, B.turqLite];

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
// samakan dengan revisi Scene 01 (Simon 22 Okt): jalur feri y 579, sungai 30–1040 mengalir, garis putus-putus, investor menghadap kanan
// 23 Okt: sama dengan peta S01 — kelompok investor +40 px ke kanan, kipas 9 avatar, investor mengecil Ø200 → Ø140 di "banyak orang"
const PETA = { orang: { x: 298, y: 509, D: 200 }, pijakan: { x: 298, y: 579, a: 140 }, label: 718, p0: 438, p1: 1478, y: 579, rumah: 340, sungai: { top: 30, bottom: 1040 } };
const ORANG_KECIL_Y = PETA.orang.y + PETA.orang.D / 2 - INVESTOR_KECIL / 2;
const KERUMUNAN = kipasKerumunan(PETA.orang.x, ORANG_KECIL_Y);
/** feri selesai menyeberang (diserahkan ke Scene 04 = S03_FERI_AKHIR) */
const FERI_I = { x0: 560, x1: 1290, d: 140 };

/* ═════════ geometri lintas papan (Simon 22 Okt: bentuk sama DIBAWA ke adegan berikutnya, 2+ → 1 DIGABUNG) ═════════ */
const GEO_PRODUK: GeoKartu = { x: PA.kartu.x, y: PA.kartu.y, w: PA.kartu.w, h: PA.kartu.h, warna: FERI, tab: 'atas' };
const GEO_KEPALA: GeoKartu = { x: KERANJANG.x, y: KERANJANG.y - KERANJANG.h / 2 + KEPALA_H / 2, w: KERANJANG.w, h: KEPALA_H, warna: FERI, tab: 'atas' };
const GEO_KC = (i: number): GeoKartu => ({ x: KC.x[i % 2], y: KC.y[Math.floor(i / 2)], w: KC.w, h: KC.h, warna: WARNA_KC[i], tab: 'kiri' });
const GEO_PANEL: GeoKartu = { x: PANEL.x, y: PANEL.y, w: PANEL.w, h: PANEL.h, warna: FERI, tab: 'atas' };
const GEO_KE = (i: number): GeoKartu => ({ x: KE.x[i], y: KE.y, w: KE.w, h: KE.h, warna: i === 1 ? FERI : B.orange, tab: 'atas' });
/** ikon feri di kepala panel D & kartu indeks E (koordinat layar) */
const FERI_PANEL = { x: PANEL.x - PANEL.w / 2 + 86, y: PANEL.y - PANEL.h / 2 + 80, d: 68 };
const FERI_KE = { x: KE.x[1] - KE.w / 2 + 72, y: KE.y - KE.h / 2 + 72, d: 64 };
/** ubin isi indeks di kartu E (layar): rapat → menyebar di "tersebar". Rapat = celah 6–8 px (Simon: nol tumpang-tindih — dulu 66 px untuk ubin 86 → saling tumpuk 20 px) */
const UBIN_E = { d: 86, y: 228, dx: [92, 120], dy: [94, 108] }; // pusat blok = pusat lingkaran saham tunggal (y 228) → kedua kartu sejajar
const ubinKE = (k: number, sebar: number) => ({ x: KE.x[1] + ((k % 5) - 2) * lerp(UBIN_E.dx[0], UBIN_E.dx[1], sebar),
  y: KE.y - KE.h / 2 + UBIN_E.y + (Math.floor(k / 5) - 0.5) * lerp(UBIN_E.dy[0], UBIN_E.dy[1], sebar) });
/** pil "▼ 50%" tepat DI BAWAH lingkaran yang bermasalah (kedua kartu sama tinggi): saham tunggal = lingkaran besar, indeks = ubin ke-7 (k 6) */
const PIL_E = { y: 360, xIndeks: KE.w / 2 - UBIN_E.dx[1] };
/** ubin cincin F & H, empat ubin "?" G */
const ubinF = (k: number, cx: number) => ({ x: cx + CINCIN.r * Math.cos(sudutUbin(k)), y: CINCIN.y + CINCIN.r * Math.sin(sudutUbin(k)) });
const KE_G = [1, 2, 3, 4]; // ubin cincin yang DIBAWA jadi empat ubin "?" (kanan-atas cincin, terdekat ke tempatnya)
/** ubin "?" G: SEBARIS DI TENGAH di bawah investor yang juga di tengah (23 Okt, pola "tengah dulu"), lalu ke bawah gelembung bersamaan investor
 *  bergeser ke kiri & gelembung pop (`geser` = cin di "menebak" + 30) */
const ubinG = (j: number, geser: number) => ({ x: lerp(960 + (j - 1.5) * 130, 1000 + j * 130, geser), y: lerp(790, 630, geser) });
const ubinH = (k: number) => { const a = (-90 + (k * 360) / 10) * Math.PI / 180; return { x: RH.x + RH.r * Math.cos(a), y: RH.y + RH.r * Math.sin(a) }; };
const KE_H = [3, 4, 5, 6]; // ubin G → posisi cincin H

export const Scene03: React.FC<{ f: number }> = ({ f }) => {
  if (f < DARAT || f > S03_AKHIR + 90) return null;

  /* ── A → B: feri tengah → kiri (memberi ruang kartu produk) → kepala keranjang; kartu produk BERUBAH jadi keranjang ── */
  const kiriA = cin(f, T.reksa - 24);
  const keKepala = cin(f, T.sekumpulan);
  const keHub = cin(f, T.indonesia); // feri kepala keranjang DIBAWA ke hub "Indeks Indonesia"

  /* ── C / D ── */
  const menyatuD = cin(f, T.aturannya + 30); // enam kartu indeks DIGABUNG jadi panel "Isi indeks"
  const kartu = kartuIdx();
  const sorotC = (i: number) => {
    const a = kartu[i].fokusAt, b = i < 5 ? kartu[i + 1].fokusAt : T.aturannya;
    return cin(f, a - 10) * (1 - cin(f, b - 10));
  };
  const feriHub = { x: lerp(lerp(lerp(lerp(960, PA.feri.x, kiriA), FERI_KEPALA.x, keKepala), HUB.x, keHub), FERI_PANEL.x, menyatuD),
    y: lerp(lerp(lerp(520, FERI_KEPALA.y, keKepala), HUB.y, keHub), FERI_PANEL.y, menyatuD),
    d: lerp(lerp(lerp(PA.feri.d, FERI_KEPALA.d, keKepala), HUB.d, keHub), FERI_PANEL.d, menyatuD) };

  /* ── E (kenapa): panel TERBELAH jadi dua kartu; sepuluh ubin isi indeks DIBAWA ke kartu Indeks ── */
  const belah = cin(f, T.kenapa);
  const sebar = cin(f, T.tersebar);
  const merahE = cin(f, T.bermasalah);
  const keF = cin(f, T.kedua); // ubin kartu Indeks DIBAWA jadi cincin F; feri kartu → feri besar; kartu keluar lewat tepi
  /* ── F ── */
  const cx = lerp(960, CINCIN.x, cin(f, T.bank - 24)); // cincin di tengah dulu, ke kiri memberi ruang daftar sektor
  const keG = cin(f, T.artinya); // empat ubin cincin DIBAWA jadi ubin "?" G; feri DIBAWA jadi lingkaran investor
  /* ── G → H ── */
  const keHH = cin(f, T.indeksH); // ubin "?" DIBAWA ke cincin H
  /* ── H → I ── */
  const keI = cin(f, T.itulah); // feri H DIBAWA ke sungai (I)
  const keluarI = cin(f, S03_AKHIR + 30);

  const isiProduk = (<>
    <Foto k="rdIndeks" x={PA.kartu.w / 2} y={152} w={232} p={1} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 286, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
      <WordText f={f} at={T.reksa + 10} halus>Reksa dana indeks</WordText>
    </div>
  </>);
  const isiKeranjang = (
    <div style={{ position: 'absolute', left: 124, top: 44, fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>
      <WordText f={f} at={T.sekumpulan + 10} halus>Indeks</WordText>
    </div>);
  const isiKartu = (i: number) => {
    const k = kartu[i], at = T.banyak + i * 20;
    return (<>
      <Bulat x={82} y={KC.h / 2} d={92} warna={WARNA_KC[i]} ikon={k.ikon} p={popIn(f, at + 10)} />
      <div style={{ position: 'absolute', left: 148, top: 30, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={at + 10} halus>{k.nama}</WordText>
      </div>
      <div style={{ position: 'absolute', left: 148, top: 82, fontFamily: F, fontSize: 26, fontWeight: 700, color: mixHex(B.gray, WARNA_KC[i], sorotC(i)), whiteSpace: 'nowrap' }}>
        <WordText f={f} at={k.fokusAt} halus>{k.fokus}</WordText>
      </div>
    </>);
  };
  const isiPanel = (
    <div style={{ position: 'absolute', left: 52 + 68 + 16, top: 46, height: 68, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>
      <WordText f={f} at={T.aturannya + 40} halus>Isi indeks</WordText>
    </div>);
  const isiE = (i: number) => {
    const indeks = i === 1;
    const warna = indeks ? FERI : B.orange;
    const nilai = MODAL * (1 - (indeks ? 0.05 : 0.5) * cin(f, T.dampaknya + 20)); // satu perusahaan −50 %: saham tunggal −50 %, indeks (10 perusahaan) −5 %
    return (<>
      <div style={{ position: 'absolute', left: 40 + 64 + 16, top: 40, height: 64, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>
        <WordText f={f} at={T.kenapa + 20 + i * 20} halus>{indeks ? 'Indeks' : 'Satu saham'}</WordText>
      </div>
      {!indeks ? <div style={{ position: 'absolute', left: 40, top: 40, width: 64, height: 64, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
        display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(popIn(f, T.kenapa + 40))})`, boxShadow: bayanganKecil(warna) }}><Icon name="saham" size={36} color={warna} /></div> : null}
      {!indeks ? <Ubin x={KE.w / 2} y={UBIN_E.y} d={180} p={popIn(f, T.kenapa + 50)} isi={mixHex(B.orange, ARAH.turun, merahE)} warna={mixHex(B.orange, ARAH.turun, merahE)} /> : null}
      <Chip x={indeks ? PIL_E.xIndeks : KE.w / 2} y={PIL_E.y} teks="▼ 50%" warna={ARAH.turun} p={popIn(f, T.bermasalah + 20)} size={24} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 412, textAlign: 'center', fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>
        <WordText f={f} at={T.kenapa + 50 + i * 20} halus>Nilai investasi</WordText>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 448, textAlign: 'center', fontFamily: F, fontSize: 58, fontWeight: 800, lineHeight: 1,
        color: nilai < MODAL - 1 ? mixHex(B.night, ARAH.turun, Math.min(1, (MODAL - nilai) / (MODAL * 0.05))) : B.night, fontVariantNumeric: 'tabular-nums' }}>
        <KataTopeng masuk={cin(f, T.kenapa + 60 + i * 20)} vMasuk={cinV(f, T.kenapa + 60 + i * 20)} size={58}>{
          /* lebar tetap: angka < 10 jt diberi DIGIT TAK TERLIHAT di belakang — "Rp" & digit depan diam di tempat (dulu figure space di depan: fon tak punya
             glif U+2007 → lebarnya beda, angka tetap meloncat setengah digit di 10.000.000 → 9.999.000, lonjakan QA18 f11664/f11666) */
          <>{rpPenuh(Math.round(nilai / 1000) * 1000)}{nilai < 9_999_500 ? <span style={{ visibility: 'hidden' }}>0</span> : null}</>}</KataTopeng>
      </div>
    </>);
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A–B: feri › reksa dana indeks → perusahaan disaring aturan masuk keranjang Indeks ══ */}
      {f < T.banyak + 30 ? (
        <>
          <Chevron x={PA.chev} y={PA.feri.y} warna={FERI} p={popIn(f, T.reksa + 10) * popOut(f, T.sekumpulan)} />
          {/* kartu produk → BERUBAH jadi keranjang Indeks (kepala) → BERUBAH jadi kartu indeks pertama di "banyak" */}
          {keKepala < 0.001
            ? <Kaca x={PA.kartu.x} y={PA.kartu.y} w={PA.kartu.w} h={PA.kartu.h} p={popIn(f, T.reksa)} warna={FERI} tab="atas">{isiProduk}</Kaca>
            : keKepala < 1 ? <KacaMorf a={GEO_PRODUK} b={GEO_KEPALA} t={keKepala} isiA={isiProduk} isiB={isiKeranjang} />
            : (() => {
              // keranjang memanjang SAAT perusahaan pertama tiba (dulu jauh sebelumnya → badan kosong ±200f); keluar = POP KELUAR di tempat di
              // "Indonesia" (24 Okt — dulu berubah jadi kartu indeks pertama melintasi hub di tengah = tumpang tindih)
              const hK = KEPALA_H + (KERANJANG.h - KEPALA_H) * cin(f, T.dipilih + 80);
              const geo: GeoKartu = { ...GEO_KEPALA, y: KERANJANG.y - KERANJANG.h / 2 + hK / 2, h: hK };
              const pk = popOut(f, T.indonesia);
              return pk > 0 ? <Kaca x={geo.x} y={geo.y} w={geo.w} h={geo.h} p={pk} warna={FERI} tab="atas">{isiKeranjang}</Kaca> : null;
            })()}
          {Array.from({ length: KOLAM.n }, (_, i) => {
            const k = PILIH.indexOf(i);
            // tak terpilih: pop keluar di "Indonesia"; terpilih (di keranjang): pop keluar sebelum keranjang berubah jadi kartu
            // pop SESUDAH feri meninggalkan sisi kiri (+40, dulu tepat bersamaan → muncul menimpa feri yang sedang bergeser)
            const p = popIn(f, T.sekumpulan + 40 + Math.floor(i / KOLAM.kol) * 20 + (i % KOLAM.kol) * 4) * popOut(f, T.indonesia);
            const u = k >= 0 ? R(f, T.dipilih + 20 + k * 20, T.dipilih + 20 + k * 20 + 60, 0, 1, io) : 0;
            const a = posKolam(i), b = posKeranjang(Math.max(0, k)), m = SARING;
            // 23 Okt (Simon: "masih banyak animasi yang jeglek"): lintasan lewat saringan = kurva MULUS (Bézier kuadrat yang melalui pusat saringan di
            // u 0,5 — dulu dua garis lurus bersudut di tengah), "tertelan" = redup halus sin² (dulu opacity meloncat 1 → 0,4 → 1), tint abu → feri sepanjang 60f
            const c = { x: 2 * m.x - (a.x + b.x) / 2, y: 2 * m.y - (a.y + b.y) / 2 };
            const x = (1 - u) ** 2 * a.x + 2 * u * (1 - u) * c.x + u * u * b.x;
            const y = (1 - u) ** 2 * a.y + 2 * u * (1 - u) * c.y + u * u * b.y;
            const redup = k < 0 ? 1 - 0.6 * cin(f, T.dipilih + 60) : 1;
            const lewat = 1 - 0.6 * Math.sin(Math.PI * u) ** 2;
            const r = rupaKolam(i);
            return <Ubin key={i} x={x} y={y} d={KOLAM.d} p={p} warna={r.warna} alfa={redup * lewat} isi={r.warna} ikon={r.ikon} />;
          })}
          <Bulat x={SARING.x} y={SARING.y} d={SARING.d} warna={B.orange} ikon="saring" p={popIn(f, T.dipilih - 10) * popOut(f, T.indonesia)} />
          <Label x={SARING.x} y={SARING.y + SARING.d / 2 + 40} teks="Aturan" f={f} at={T.aturan} keluar={T.indonesia} size={34} />
        </>) : null}


      {/* ══ C: hub "Indeks Indonesia" + 6 kartu (muncul di "banyak indeks", disorot di kata kategorinya) → DIGABUNG jadi panel D ══ */}
      {f > T.indonesia - 30 && f < T.aturannya + 60 ? (
        <>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {kartu.map((k, i) => {
              const kiri = k.x < 960, x1 = kiri ? k.x + KC.w / 2 + 6 : k.x - KC.w / 2 - 6, x0 = kiri ? HUB.x - HUB.d / 2 - 10 : HUB.x + HUB.d / 2 + 10;
              return <Penghubung key={i} d={`M ${x0} ${HUB.y} C ${(x0 + x1) / 2} ${HUB.y} ${(x0 + x1) / 2} ${k.y} ${x1} ${k.y}`} g={cin(f, T.banyak + i * 20 - 10) * (1 - menyatuD)}
                warna={WARNA_KC[i]} tebal={4} titik={false} />;
            })}
          </svg>
          <Label x={HUB.x} y={HUB.y + HUB.d / 2 + 40} teks="Indeks Indonesia" f={f} at={T.indonesia + 20} keluar={T.aturannya + 30} size={30} lebar={360} />
          {kartu.map((k, i) => {
            const at = T.banyak + i * 20;
            return menyatuD > 0
              ? <KacaMorf key={i} a={GEO_KC(i)} b={GEO_PANEL} t={menyatuD} isiA={isiKartu(i)} isiB={i === 5 ? isiPanel : undefined}
                  tepi={sorotC(i)} peran={i === 5 ? undefined : 'gabung'} />
              : <Kaca key={i} x={k.x} y={k.y} w={KC.w} h={KC.h} p={popIn(f, at)} warna={WARNA_KC[i]} tab="kiri" tepi={sorotC(i)}>{isiKartu(i)}</Kaca>;
          })}
        </>) : null}

      {/* ══ D: isi indeks dievaluasi berkala — keluar / masuk; di "kenapa" panel TERBELAH jadi dua kartu E ══ */}
      {menyatuD >= 1 && belah < 1 ? (
        <>
          {belah < 0.001 ? (
            <Kaca x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={1} warna={FERI} tab="atas">{isiPanel}</Kaca>
          ) : <KacaMorf a={GEO_PANEL} b={GEO_KE(1)} t={belah} isiA={isiPanel} isiB={isiE(1)} />}
          {/* kalender + panah berputar: dievaluasi secara berkala (pop / trim / teks keluar di "kenapa") */}
          {(() => {
            const p = popIn(f, T.dievaluasi) * popOut(f, T.kenapa - 40); // keluar sebelum panel terbelah (dulu bersamaan → bertumpuk)
            if (p <= 0.001) return null;
            // lencana + cincin panah: 28 px dari tepi atas panel (dulu 18 px — cincin menempel garis kepala panel)
            const cxk = PANEL.x + PANEL.w / 2 - 120, cy = PANEL.y - PANEL.h / 2 + 100, g = cin(f, T.berkala) * (1 - cin(f, T.kenapa - 40));
            return (
              <>
                <Bulat x={cxk} y={cy} d={104} warna={FERI} ikon="kalender" p={p} />
                <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                  <circle cx={cxk} cy={cy} r={70} fill="none" stroke={B.orange} strokeWidth={5} strokeLinecap="round" pathLength={1000}
                    strokeDasharray={`${880 * g} 1000`} transform={`rotate(-80 ${cxk} ${cy})`} />
                  {g > 0.05 ? (() => {
                    const th = (-80 + 0.88 * 360 * g) * Math.PI / 180, ex = cxk + 70 * Math.cos(th), ey = cy + 70 * Math.sin(th);
                    const tx = -Math.sin(th), ty = Math.cos(th), nx = Math.cos(th), ny = Math.sin(th);
                    return <path d={`M ${ex + tx * 16} ${ey + ty * 16} L ${ex - tx * 8 + nx * 12} ${ey - ty * 8 + ny * 12} L ${ex - tx * 8 - nx * 12} ${ey - ty * 8 - ny * 12} Z`}
                      fill={B.orange} transform={`scale(1)`} />;
                  })() : null}
                </svg>
                <div style={{ position: 'absolute', left: cxk - 100 - 440, top: cy - 22, width: 440, textAlign: 'right', fontFamily: F, fontSize: 32, fontWeight: 800,
                  color: B.night, lineHeight: '44px', whiteSpace: 'nowrap' }}>
                  <WordText f={f} at={T.dievaluasi + 10} until={T.kenapa - 40} halus>Dievaluasi berkala</WordText>
                </div>
              </>);
          })()}
          <Chip x={PANEL.x} y={PANEL.y + PANEL.h / 2 - 50} teks="Kriteria" ikon="kriteria" warna={FERI} p={popIn(f, T.prinsipnya) * popOut(f, T.kenapa - 40)} size={28} />
        </>) : null}

      {/* ══ E: satu saham vs indeks (kartu belahan panel D); di "kedua" kedua kartu keluar lewat tepi terdekat ══ */}
      {/* 24 Okt: kartu "Satu saham" POP di kanan-kirinya sesudah panel bergeser jadi kartu Indeks; keluar: "Satu saham" mengecil LEBIH DULU
          (sebelum ubin melintas ke cincin), kartu Indeks mengecil sambil ubinnya keluar ke cincin */}
      {f > T.kenapa && keF < 1 ? <Kaca x={KE.x[0]} y={KE.y} w={KE.w} h={KE.h} p={popIn(f, T.kenapa + 30) * popOut(f, T.kedua - 40)} warna={B.orange} tab="atas">{isiE(0)}</Kaca> : null}
      {belah >= 1 && keF < 1 ? <Kaca x={KE.x[1]} y={KE.y} w={KE.w} h={KE.h} p={popOut(f, T.kedua - 10)} warna={FERI} tab="atas" tepi={sebar}>{isiE(1)}</Kaca> : null}

      {/* SEPULUH UBIN isi indeks DIBAWA: panel D → kartu Indeks E → cincin F → (4 ubin) "?" G → cincin H */}
      {f > T.aturannya && keHH < 1 ? Array.from({ length: 10 }, (_, i) => {
        // D: posisi panel (ubin 3 & 8 bertukar — lihat di bawah); E: kartu Indeks; F: cincin
        const pd = posIsi(i), pe = ubinKE(i, sebar), pf = ubinF(i, cx);
        let x = lerp(lerp(pd.x, pe.x, belah), pf.x, keF), y = lerp(lerp(pd.y, pe.y, belah), pf.y, keF);
        let d = lerp(lerp(ISI.d, 86, belah), CINCIN.d, keF);
        const rp = rupaD(i);
        let warna: string = rp.warna;
        const bad = i === 6 ? merahE * (1 - keF) : 0;
        warna = mixHex(warna, ARAH.turun, bad);
        if (keF > 0) { const sk = SEKTOR[Math.floor(i / 2)]; warna = mixHex(warna, sk.warna, cin(f, T[sk.kata])); }
        const jG = KE_G.indexOf(i);
        let p = popIn(f, T.aturannya + 90 + (i % 5) * 6); // sesudah enam kartu selesai menyatu (dulu di tengah penyatuan)
        if (jG >= 0) {
          const pg = ubinG(jG, cin(f, T.menebak + 30)), ph = ubinH(KE_H[jG]);
          x = lerp(lerp(x, pg.x, keG), ph.x, keHH); y = lerp(lerp(y, pg.y, keG), ph.y, keHH); d = lerp(lerp(d, 104, keG), RH.d, keHH);
          warna = mixHex(mixHex(warna, B.orange, keG), FERI, keHH);
        } else p *= popOut(f, T.artinya - 30); // enam ubin lain pop keluar SEBELUM empat ubin & investor bergerak (24 Okt)
        // ubin 3 & 8 (D): ditandai merah → POP keluar → ubin baru POP masuk ("keluar / masuk", "terus berubah")
        const tukar = i === 3 ? { merah: T.nggak, keluar: T.keluar, masuk: T.masuk } : i === 8 ? { merah: T.berubah - 50, keluar: T.berubah, masuk: T.berubah + 60 } : null;
        if (tukar && f < tukar.masuk + 30) {
          const merah = cin(f, tukar.merah);
          return (
            <React.Fragment key={i}>
              <Ubin x={x} y={y} d={d} p={p * popOut(f, tukar.keluar)} warna={mixHex(RUPA_LAMA[i].warna, CORET, merah)} isi={mixHex(RUPA_LAMA[i].warna, CORET, merah)} ikon={RUPA_LAMA[i].ikon} />
              <Lencana x={x} y={y} d={d} p={popIn(f, tukar.merah + 10) * popOut(f, tukar.keluar)} warna={CORET} teks="✕" besar={50} />
              <Ubin x={x} y={y} d={d} p={popIn(f, tukar.masuk)} isi={RUPA_BARU[i].warna} warna={RUPA_BARU[i].warna} ikon={RUPA_BARU[i].ikon} />
            </React.Fragment>);
        }
        const isiPutih = jG >= 0 && keG > 0.5 && keHH < 0.5; // ubin "?" G: putih bertepi oranye
        return (
          <React.Fragment key={i}>
            <Ubin x={x} y={y} d={d} p={p} warna={warna} isi={isiPutih ? undefined : warna} ikon={keG > 0.5 ? 'perusahaan' : rp.ikon} alfa={jG >= 0 ? 1 - 0.5 * cin(f, T.berikutnya + 30) * (1 - keHH) : 1} />
            {i === 3 || i === 8 ? <Lencana x={x} y={y} d={d} p={popIn(f, (i === 3 ? T.masuk : T.berubah + 60) + 20) * popOut(f, (i === 3 ? T.masuk : T.berubah + 60) + 120)} warna={CEK} ikon="tersedia" besar={50} /> : null}
            {jG >= 0 ? <Lencana x={x} y={y} d={d} p={popIn(f, T.saham + 20 + jG * 8) * popOut(f, T.indeksH)} warna={B.orange} teks="?" besar={46} /> : null}
          </React.Fragment>);
      }) : null}

      {/* FERI DIBAWA sepanjang papan: tengah → kiri → kepala keranjang → hub "Indeks Indonesia" → ikon kepala panel D → ikon kartu Indeks E →
          feri besar cincin F → lingkaran investor G (lingkaran oranye + foto POP di atasnya) */}
      {keG < 1 ? (() => {
        const x = lerp(lerp(lerp(feriHub.x, FERI_KE.x, belah), cx, keF), 960, keG), y = lerp(lerp(lerp(feriHub.y, FERI_KE.y, belah), CINCIN.y, keF), 560, keG);
        const d = lerp(lerp(lerp(feriHub.d, FERI_KE.d, belah), 190, keF), 296, keG);
        return <Kendaraan x={x} y={y} d={d} warna={FERI} ikon="feri" cermin p={1} ikonP={popIn(f, DARAT + 30)} />;
      })() : null}

      {/* ══ F: feri + cincin 10 perusahaan (bagian kita) — cincin sektor tumbuh di "sekaligus", ubin berwarna sektor di katanya ══ */}
      {keF > 0 && keG < 1 ? (
        <>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {SEKTOR.map((sk, i) => {
              const g = cin(f, T.sekaligus + i * 6) * (1 - keG); // tumbuh = trim path; keluar = trim balik
              return g > 0 ? <circle key={sk.nama} cx={cx} cy={CINCIN.y} r={CINCIN.r} fill="none" stroke={rgba(sk.warna, 0.35)} strokeWidth={CINCIN.tebal} pathLength={360}
                strokeDasharray={`${Math.max(0, 69 * g)} 360`} transform={`rotate(${-90 + i * 72 + 1.5} ${cx} ${CINCIN.y})`} /> : null;
            })}
          </svg>
          {SEKTOR.map((sk, i) => {
            const y = CINCIN.y + (i - 2) * BARIS_F.dy;
            return (
              <React.Fragment key={sk.nama}>
                <Bulat x={BARIS_F.x} y={y} d={BARIS_F.d} warna={sk.warna} ikon={sk.ikon} p={popIn(f, T[sk.kata]) * popOut(f, T.artinya - 30)} />
                <div style={{ position: 'absolute', left: BARIS_F.x + BARIS_F.d / 2 + 26, top: y - 22, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
                  <WordText f={f} at={T[sk.kata] + 10} until={T.artinya - 30} halus>{sk.nama}</WordText>
                </div>
              </React.Fragment>);
          })}
        </>) : null}

      {/* ══ G: tak perlu terus menebak pemenang ══ */}
      {keG > 0 && keHH < 1 ? (
        <>
          <KarakterLingkar pose={MURID_BIRU} x={lerp(960, 500, cin(f, T.menebak + 30))} y={560} D={300} s={popIn(f, T.artinya + 30) * popOut(f, T.indeksH - 20)} warna={B.orange} />
          <Kutipan x={1190} y={390} teks="Saham mana yang akan jadi pemenang berikutnya?" p={popIn(f, T.menebak + 30) * popOut(f, T.indeksH - 40)} warna={B.blue} ikon="menebak" size={32}
            coret={R(f, T.berikutnya + 10, T.berikutnya + 70, 0, 1, io)} />
        </>) : null}

      {/* ══ H: indeks tetap bisa turun & berisiko — tapi tidak bergantung pada satu perusahaan ══ */}
      {f > T.indeksH - 30 && keI < 1 ? (() => {
        const satu = cin(f, T.satuH + 20);
        return (
          <>
            {Array.from({ length: 10 }, (_, k) => {
              if (KE_H.includes(k) && keHH < 1) return null; // empat ubin = ubin "?" G yang dibawa ke sini
              const { x, y } = ubinH(k);
              const merah = k === 3 ? cin(f, T.satuH) : 0;
              // satu perusahaan bermasalah: memerah lalu POP KELUAR di tempat (Simon 24 Okt: "ada icon yang jatuh, seharusnya di pop out saja")
              return <Ubin key={k} x={x} y={y} d={RH.d} p={(KE_H.includes(k) ? 1 : popIn(f, T.indeksH + 40 + k * 5)) * popOut(f, T.itulah - 20) * (k === 3 ? 1 - satu : 1)}
                isi={mixHex(FERI, ARAH.turun, merah)} warna={mixHex(FERI, ARAH.turun, merah)} />;
            })}
            <Kendaraan x={lerp(RH.x, FERI_I.x0, keI)} y={lerp(RH.y, PETA.y, keI)} d={lerp(210, FERI_I.d, keI)} warna={FERI} ikon="feri" cermin p={popIn(f, T.indeksH + 20)} />
            <Label x={RH.x} y={RH.y + 105 + 40} teks="Indeks" f={f} at={T.indeksH + 40} keluar={T.itulah - 20} size={32} />
            <Chip x={RH.x - 170} y={830} teks="Bisa turun" ikon="pasarTurun" warna={ARAH.turun} p={popIn(f, T.turun) * popOut(f, T.itulah - 20)} size={28} />
            <Chip x={RH.x + 170} y={830} teks="Punya risiko" ikon="risiko" warna={B.orange} p={popIn(f, T.risiko) * popOut(f, T.itulah - 20)} size={28} />
          </>);
      })() : null}

      {/* ══ I: peta sungai V04 — feri (dibawa dari H) menyeberang; keluar = dorong ke atas sampai keluar frame ══ */}
      {keI > 0 ? (() => {
        const sebrang = R(f, T.perjalanan - 40, T.perjalanan + 20, 0, 1, io);
        const fx = lerp(FERI_I.x0, FERI_I.x1, sebrang);
        return (
          <KonteksBayanganGelap.Provider value={cin(f, T.itulah)}>
          {/* keluar 1400 px (dulu 1080): kamera Scene 04 turun 232 px di 60f yang sama → ujung bawah sungai masih tersisa di tepi atas lalu lenyap
              seketika saat Scene 03 dilepas (lonjakan QA18 f13790) */}
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - keluarI, true, 1080, 1400) }}>
            {/* 23 Okt (pola S01): sungai mengalir masuk DULU, lalu kelompok investor + pijakan POP, rumah POP, baru garis jalur */}
            <Sungai id="s03" top={PETA.sungai.top} bottom={PETA.sungai.bottom} p={cin(f, T.itulah)} alir={f / 60} />
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d={`M ${PETA.p0} ${PETA.y} L ${PETA.p1} ${PETA.y}`} g={cin(f, T.itulah + 70)} warna={FERI} tebal={5} titik={false} pola="putus" />
              <Penghubung d={`M ${PETA.p0} ${PETA.y} L ${PETA.p1} ${PETA.y}`} g={R(f, T.perjalanan - 40, T.perjalanan + 20, 0, 1, io) * ((FERI_I.x1 - PETA.p0) / (PETA.p1 - PETA.p0))}
                warna={FERI} tebal={7} dash={false} titik={false} />
            </svg>
            <RumahIso x={PETA.p1} y={PETA.y} w={PETA.rumah} p={popIn(f, T.itulah + 60)} />
            {(() => {
              const pg = popIn(f, T.itulah + 30), kecil = cin(f, T.banyakOrang + 10);
              const D = lerp(PETA.orang.D, INVESTOR_KECIL, kecil), y = lerp(PETA.orang.y, ORANG_KECIL_Y, kecil);
              return pg > 0 ? (
                <div style={{ position: 'absolute', inset: 0, transformOrigin: `${PETA.orang.x}px 546px`, transform: pg < 0.9999 ? `scale(${skalaPop(pg)})` : undefined }}>
                  <Pijakan x={PETA.pijakan.x} y={PETA.pijakan.y} a={PETA.pijakan.a} p={1} />
                  {/* "banyak orang" — kipas 9 avatar pop dari tengah ke luar (pola S01 23 Okt) */}
                  {KERUMUNAN.map((o, i) => (
                    <Bulat key={i} x={o.x} y={o.y} d={o.d} warna={B.orangeLite} ikon="orangLain" p={popIn(f, T.banyakOrang + 10 + o.urut * 12)} />))}
                  <KarakterLingkar pose={MURID_BIRU} x={PETA.orang.x} y={y} D={D} s={1} warna={B.orange} cermin />
                </div>) : null;
            })()}
            {keI >= 1 && f < S03_AKHIR ? <Kendaraan x={fx} y={PETA.y} d={FERI_I.d} warna={FERI} ikon="feri" cermin p={1} cincin /> : null}
            <Lencana x={fx} y={PETA.y} d={FERI_I.d} p={popIn(f, T.panjang + 50)} warna={CEK} ikon="tersedia" besar={56} />
          </div>
          </KonteksBayanganGelap.Provider>);
      })() : null}
    </AbsoluteFill>);
};
