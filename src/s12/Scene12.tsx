import React from 'react';
import { ARAH, B, F, SISI, lerp, mixHex, rgba } from '../theme';
import { Icon, cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, luarLingkaran } from '../parts/umum';
/** busur lingkaran r di sekitar foto Ø d dengan celah di puncak selebar kepala (±0,54 r foto) + 12 px */
const busurCelah = (cx: number, cy: number, r: number, d: number) => {
  const t = Math.asin(Math.min(0.95, (0.27 * d + 12) / r)), sx = r * Math.sin(t), sy = r * Math.cos(t);
  return `M ${cx + sx} ${cy - sy} A ${r} ${r} 0 1 1 ${cx - sx} ${cy - sy}`;
};
import { Kaca, KarakterLingkar, Nomor, Penghubung, bayanganKaca } from '../parts/kaca';
import { AwanPikir, TitikPikir } from '../parts/awan';
import type { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { JALAN_FRAME, LARI_FRAME, gaya as gayaT, panjangSiklus as panjangT } from '../flat/rigTegak';
import { HutanLayar, TANAH_LAYAR, TokohTegakLapis, ambil, simulasi } from '../flat/dunia';
import { KAMU_S09 } from '../s09/Scene09';
import { SOSOK_S11 } from '../s11/Scene11';
import { ASII_S12 } from '../data/lilinRiil.gen';
import { OUTRO_AT } from '../outro/plan.gen';
import { BatangLilin, KisiLilin, domainGulir, lilinGulir, posisiGulir } from '../parts/lilinRiil';

/**
 * SCENE 12 — Tiga Tanda Otak Mulai Mengambil Alih (BATAS.s12 – akhir). GAYA RUMAH + satu sisipan analogi flat (tokoh dulu berhenti & memeriksa).
 * REVISI 29 Okt (Simon, S12): "Gambar orangnya jangan di pop up, swipe keatas saja (lingkaran masking = lingkaran background)" · "Relayout visualnya, layoutnya
 * terasa hambar, spacing tidak konsisten" · "Transisi dari candle ke adegan hutan seharusnya bisa menggunakan morphing" · "Hapus text diatas itu" · "Buat
 * ulang ide visualnya, saat ini masih sulit dipahami orang awam" · "Untuk adegan pertanyaan gunakan thinking bubble" · "Transisi ke outro: swipe 3 panel itu
 * keatas, buat seolah keluar di waktu yang tidak bersamaan (bedakan titik akhirnya, bukan keyframe mulainya)".
 * IDE BARU (orang awam): kartu APLIKASI SAHAM besar (chart + tombol BELI/JUAL seperti di ponsel) di kanan kamu; tiap tanda = DORONGAN yang dirasakan kamu
 *  (awan pikiran dengan ikon perasaan) + chart bergerak + tombol MULAI TERTEKAN lalu BERHENTI (tanda jeda); daftar tiga tanda tersusun di bawah kartu.
 *  A f28154– empat avatar Scene 11 MENYATU di tempat kamu, lingkaran berubah jadi lingkaran turkis, foto kamu NAIK di dalamnya; kartu aplikasi pop;
 *    "mengenali" → ikon mata.
 *  B tiga tanda: (1) chart naik, awan "Ingin mengejar" (ikon berlari), BELI tertekan lalu berhenti; (2) chart turun, awan "Takut menjual" (ikon panik), JUAL
 *    tertekan lalu berhenti; (3) ✓ untung ×3, awan "Kali ini saya pasti benar." (ikon trofi), BELI tertekan lalu berhenti (langkah 1–3).
 *  C "Saat itu terjadi" → kartu aplikasi BER-MORF jadi panel padang (satu bentuk): tokoh dulu berlari lalu BERHENTI dan menoleh memeriksa (tanda jeda di
 *    panel); kamu menarik napas (cincin napas), "beri diri waktu" → lencana jam (langkah 4–5). Tanpa teks layar.
 *  D "Saya sedang menganalisis atau hanya bereaksi?" = AWAN PIKIRAN kamu (pola Scene 05); di dalamnya tiga hal yang diperiksa ✓ (langkah 6).
 *  E "Ingat tiga hal": tiga kartu bernomor (langkah 7). KELUAR ke outro: ketiganya SWIPE NAIK mulai bersamaan DENGAN halaman outro naik (tanpa blank frame),
 *    durasi 36 · 48 · 60 f (titik akhir berbeda).
 */
const W = urut(['reaksi', 'otomatis', 'hilang', 'menghapusnya', 'mengenali', 'mengambil', 'alih', 'tiga', 'tanda', 'tiba-tiba', 'ingin', 'mengejar', 'membeli',
  'tiba-tiba', 'takut', 'menjual', 'tiba-tiba', 'merasa', 'kali', 'pasti', 'benar', 'saat', 'terjadi', 'berhenti', 'beberapa', 'detik', 'tarik', 'napas', 'lalu',
  'beri', 'waktu', 'berpikir', 'setelah', 'tanyakan', 'saya', 'menganalisis', 'bereaksi', 'ingat', 'tiga', 'hal', 'otak', 'pintas', 'investasi', 'langkah', 'jauh',
  'mengikuti', 'kelompok', 'nyawa', 'pasar', 'kepanikan', 'menang', 'kali', 'salah', 'justru', 'berhati-hati'], BATAS.s12 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  reaksi: n(), otomatis: n(), hilang: n(), menghapus: n(), mengenali: n(), mengambil: n(), alih: n(), tiga: n(), tanda: n(), tiba1: n(), ingin: n(), mengejar: n(),
  membeli: n(), tiba2: n(), takut: n(), menjual: n(), tiba3: n(), merasa: n(), kali: n(), pasti: n(), benar: n(), saat: n(), terjadi: n(), berhenti: n(), beberapa: n(),
  detik: n(), tarik: n(), napas: n(), lalu: n(), beri: n(), waktu: n(), berpikir: n(), setelah: n(), tanyakan: n(), saya: n(), menganalisis: n(), bereaksi: n(),
  ingat: n(), tiga2: n(), hal: n(), otak: n(), pintas: n(), investasi: n(), langkah: n(), jauh: n(), mengikuti: n(), kelompok: n(), nyawa: n(), pasar: n(),
  kepanikan: n(), menang: n(), kali2: n(), salah: n(), justru: n(), hati: n(),
};
export const S12_T = T;
const AWAL = BATAS.s12, AKHIR = BATAS.akhir;

/* ════════════════════════════ TATA LETAK ════════════════════════════ */
/** A–C: kamu Ø260 (470, 520) + celah 130 + kartu aplikasi 860 × 520 (730–1590, y 210–730) → kelompok 340–1590 berpusat x 965; daftar tanda 16 px di bawah kartu */
const KM = { x: 470, y: 520, d: 260 };
const KARTU = { x: 1160, y: 470, w: 860, h: 520 };
const TOMBOL = { beli: [KARTU.x - 130, KARTU.y + KARTU.h / 2 - 56] as [number, number], jual: [KARTU.x + 130, KARTU.y + KARTU.h / 2 - 56] as [number, number] };
const PLOT = { x: 26, y: 84, w: KARTU.w - 52, h: KARTU.h - 84 - 120 };
const DAFTAR_Y = KARTU.y + KARTU.h / 2 + 16 + 26;
/** awan perasaan (B): di atas kepala kamu, titik pikiran dari kepala ke awan */
// Simon 30 Okt: puncak awan dulu y 40 (di atas area aman 54) & titik pikiran menempel kepala kamu (puncak kepala y 297) → awan 60–236, titik berjarak ±10
const AWAN_B = { x: 450, y: 148, w: 520, h: 176 };
const TITIK_B: [number, number, number][] = [[486, 279, 7], [498, 256, 10]];
/** D (pertanyaan): kamu Ø300 kiri (535, 600) + awan 760 × 460 kanan (1155, 420) → kelompok 385–1535 berpusat x 960 */
const KM_D = { x: 535, y: 600, d: 300 };
const AWAN_D = { x: 1155, y: 420, w: 760, h: 460 };
const TITIK_D: [number, number, number][] = [[690, 360, 10], [742, 330, 17]];
const HIJAU_TEKS = mixHex(ARAH.naik, B.night, 0.3), ORANYE_TEKS = mixHex(B.orange, B.night, 0.22);

/* ════════════════════════════ WAKTU ════════════════════════════ */
/** A: avatar menyatu (60 f) → lingkaran jadi turkis (60 f) → foto NAIK (60 f); kartu pop sesudah avatar keempat lewat */
const tA = { kamu: T.reaksi + 90, chart: T.reaksi + 110, tombol: T.tanda, mata: T.mengenali };
const tSatu = tA.kamu - 30, tTurkis = tA.kamu, tNaik = tA.kamu + 40;
const TANDA: { teks: string; awan: string; ikon: KunciIkon; warna: string; t: number; ke: 'beli' | 'jual'; henti: number }[] = [
  { teks: 'Ingin mengejar', awan: 'Ingin mengejar', ikon: 'berlari', warna: B.orange, t: T.mengejar, ke: 'beli', henti: T.membeli },
  { teks: 'Takut menjual', awan: 'Takut menjual', ikon: 'panik', warna: ARAH.turun, t: T.takut, ke: 'jual', henti: T.menjual },
  { teks: '“Pasti benar”', awan: '“Kali ini saya pasti benar.”', ikon: 'trofi', warna: B.blue, t: T.merasa, ke: 'beli', henti: T.benar },
];
/** awan perasaan B: badan awan pop di tanda 1, ISI berganti di tiap tanda (60 f), keluar sebelum morf */
const tB = { awan: TANDA[0].t - 20, isi: TANDA.map((tn) => tn.t - 10) };
/** C: tombol & daftar keluar → kartu BER-MORF jadi panel padang → panel keluar sebelum pertanyaan */
const tC = { keluar: T.saat - 30, morf: T.saat + 20, jeda: T.berhenti + 10, jam: T.waktu - 10, panelKeluar: T.setelah - 20, geser: T.setelah + 10 };
const tD = { awan: T.saya - 10, cek: [T.menganalisis, T.menganalisis + 24, T.menganalisis + 48], keluar: T.ingat };
const KARTU_E: { n: number; dari: KunciIkon; ke: KunciIkon; warnaKe: string; teks: string; t: number }[] = [
  { n: 1, dari: 'otak', ke: 'langkah', warnaKe: B.turq, teks: 'Pikir satu langkah lebih jauh', t: T.otak },
  { n: 2, dari: 'ramai', ke: 'panik', warnaKe: ARAH.turun, teks: 'Ikut kelompok bisa jadi panik', t: T.mengikuti },
  { n: 3, dari: 'trofi', ke: 'waktu', warnaKe: B.orange, teks: 'Menang beruntun? Tetap hati-hati', t: T.menang },
];

/* ════════════════════════════ CHART APLIKASI (resep video TA) ════════════════════════════ */
/* candle HARIAN RIIL ASII 31 Mar – 18 Mei 2020 tanpa nama — 24 riwayat memenuhi jendela, lalu tanda 1 naik 3 · tanda 2 turun 3 · tanda 3 naik 2 (urutan asli) */
const D = ASII_S12;
const DASAR = 24, N_SLOT = DASAR + 1;
const GERAK: number[] = [T.ingin - 20, T.ingin + 6, T.mengejar + 20, T.takut - 30, T.takut, T.takut + 30, T.kali - 20, T.pasti - 10];
const posA = posisiGulir(DASAR, GERAK.map((t) => ({ mulai: t - 10, d: 20 })));
const domA = domainGulir(D, posA, () => N_SLOT, AWAL - 20, AKHIR + 60, 0.12);
const ChartTanda: React.FC<{ f: number }> = ({ f }) => {
  const slot = PLOT.w / N_SLOT, xKanan = PLOT.w - slot, [lo, hi] = domA(f);
  const Y = (v: number) => PLOT.h - 8 - ((PLOT.h - 16) * (v - lo)) / (hi - lo);
  return (
    <svg width={PLOT.w} height={PLOT.h} style={{ position: 'absolute', left: PLOT.x, top: PLOT.y }}>
      <KisiLilin w={PLOT.w} h={PLOT.h} />
      {lilinGulir(D, posA(f), 0, xKanan, slot).map(({ c, x, alfa }) => <BatangLilin key={c.t} c={c} x={x} slot={slot} Y={Y} alfa={alfa} />)}
    </svg>);
};
/** tombol tanda ke-k MULAI TERTEKAN: turun 60 f sampai tepat di kata berhenti, bertahan, lalu naik kembali 60 f bersama tanda jeda keluar (tanpa riak) */
const tekanSetengah = (f: number, k: number) => cin(f, TANDA[k].henti - 30) * (1 - cin(f, TANDA[k].henti + 80));
const DALAM_SETENGAH = 0.04;
/** pojok kanan-atas tombol (Chip size 34 ≈ 140 × 64) — tempat tanda jeda */
const POJOK: [number, number] = [76, -30]; // di ujung kanan-atas pil (dulu 62: menutup tepi huruf, audit 29 Okt)

/* ════════════════════════════ PANEL PADANG (C) ════════════════════════════ */
const S = 0.82, NS = AKHIR + 80 - AWAL;
const lajuLari = (panjangT(1) * S) / LARI_FRAME;
const LARI = simulasi(NS, (k) => (1 - cin(AWAL + k, T.berhenti, 36)) * cin(AWAL + k, T.terjadi - 40, 20) * lajuLari, () => 1, S, 300, -1 / JALAN_FRAME, panjangT);
/** isi panel = adegan 1920 × 1080 skala 0,5 (960 × 540), dipusatkan di kartu 860 × 520, tanah ±20 px di atas tepi bawah */
const ISI_K = 0.5;
const PanelPeriksa: React.FC<{ f: number }> = ({ f }) => {
  const a = ambil(LARI, f - AWAL);
  const balik = f >= T.beberapa && f < T.detik ? -1 : 1; // menoleh ke kiri lalu kembali ke kanan
  const p = gayaT(a.psi, 1, a.a);
  return (
    <div style={{ position: 'absolute', left: (KARTU.w - 1920 * ISI_K) / 2, top: KARTU.h - 1080 * ISI_K + 10, width: 1920, height: 1080, transformOrigin: '0 0',
      transform: `scale(${ISI_K})`, background: '#B9E3CB' }}>
      <HutanLayar kamX={960} C={-2900} lapis="belakang" />
      <TokohTegakLapis x={a.x} tanah={TANAH_LAYAR} s={S} pose={{ ...p, balik }} kostum="dulu" />
      <HutanLayar kamX={960} C={-2900} lapis="depan" />
    </div>);
};

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene12: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= AKHIR + 70) return null;
  /* kamu: A–C di kiri kartu → D bergeser & membesar (memberi ruang awan pertanyaan) */
  const kGeser = cin(f, tC.geser);
  const kx = lerp(KM.x, KM_D.x, kGeser), ky = lerp(KM.y, KM_D.y, kGeser), kd = lerp(KM.d, KM_D.d, kGeser);
  const kamuP = popOut(f, tD.keluar);
  const satu = cin(f, tSatu), turkis = cin(f, tTurkis), naik = cin(f, tNaik);
  /* kartu aplikasi → panel padang (satu bentuk) */
  const kartuP = popIn(f, tA.chart) * popOut(f, tC.panelKeluar);
  const morf = cin(f, tC.morf);
  const isiApp = 1 - cin(f, tC.morf - 15), isiPanel = cin(f, tC.morf + 15);
  const tombolP = (k: number) => popIn(f, tA.chart + 14 * (k + 1)) * popOut(f, tC.keluar); // tombol = bagian aplikasi: pop bersama kartu (dulu baru di "tanda" → area tombol kosong 8 dtk)
  const tekan = (ke: 'beli' | 'jual') => Math.max(0, ...TANDA.map((tn, k) => (tn.ke === ke ? tekanSetengah(f, k) : 0)));
  const untung = [0, 1, 2].map((k) => popIn(f, T.tiba3 + k * 14) * popOut(f, tC.keluar));
  const napas = f > T.napas + 50 && f < T.setelah ? 0.5 - 0.5 * Math.cos((2 * Math.PI * (f - T.napas - 50)) / 120) : 0;
  const awanB = popIn(f, tB.awan) * popOut(f, tC.keluar);
  const isiB = (k: number) => cin(f, tB.isi[k]) * (k < 2 ? 1 - cin(f, tB.isi[k + 1]) : 1);
  const awanD = popIn(f, tD.awan) * popOut(f, tD.keluar);
  /* E: keluar ke outro — swipe naik mulai bersamaan, berhenti di waktu berbeda (titik akhir berbeda, Simon 29 Okt) */
  // Simon 29 Okt: "transisi dari scene 12 ke outro gerakan swipenya harus secara bersamaan, jadi tidak ada blankframe" → kartu mulai naik TEPAT saat halaman
  // outro mulai naik dari bawah (OUTRO_AT, 60 f inOut cubic); durasi 36 · 48 · 60 f = titik akhir berbeda; kartu terakhir berhenti bersamaan outro mendarat
  const naikE = (j: number) => { const t0 = OUTRO_AT, t1 = t0 + [36, 48, 60][j]; return -1100 * cin(f, (t0 + t1) / 2, t1 - t0); };
  return (
    <>
      {/* ═════ A: empat avatar S11 menyatu → lingkaran turkis → foto kamu NAIK di dalam masker lingkaran yang sama ═════ */}
      {/* empat FOTO sosok S11 bergerak & membesar ke tempat kamu (menyatu); lingkarannya berubah jadi turkis */}
      {/* Simon 30 Okt: "ketika kamu menggabungkan semua lingkarannya, orang yang berada dilingkarkan swipe kebawah" → foto TURUN di dalam masker lingkarannya
          (60 f inOut cubic, tanpa memudar), selesai tepat saat foto kamu mulai naik (tNaik − 30) */}
      {turkis < 1 ? SOSOK_S11.x.map((x0, k) => {
        const x = lerp(x0, KM.x, satu), y = lerp(SOSOK_S11.y, KM.y, satu), d = lerp(SOSOK_S11.d, KM.d, satu);
        return (
          <React.Fragment key={k}>
            <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: mixHex(SOSOK_S11.warna[k], B.turq, turkis) }} />
            <KarakterLingkar pose={SOSOK_S11.foto[k]} x={x} y={y} D={d} s={1} warna="transparent" naik={1 - cin(f, tNaik - 60)} cermin={k % 2 === 0} />
          </React.Fragment>);
      }) : null}
      {turkis > 0.001 && kamuP > 0.001 ? (
        naik < 1 ? (
          <>
            <div style={{ position: 'absolute', left: kx - kd / 2, top: ky - kd / 2, width: kd, height: kd, borderRadius: '50%', background: B.turq, opacity: turkis < 1 ? turkis : undefined }} />
            <KarakterLingkar pose={KAMU_S09} x={kx} y={ky} D={kd} s={1} warna="transparent" cermin naik={naik} />
          </>)
          : <KarakterLingkar pose={KAMU_S09} x={kx} y={ky} D={kd} s={kamuP} warna={B.turq} cermin />
      ) : null}
      {/* cincin napas mengembang-mengempis (C) */}
      {napas > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {/* busur dengan CELAH di puncak tempat kepala menyembul (dulu lingkaran penuh melintasi wajah — Simon 30 Okt, tabrakan) */}
          <path d={busurCelah(kx, ky, kd / 2 + 26 + 40 * napas, kd)} fill="none" stroke={B.turq} strokeWidth={6} strokeLinecap="round" opacity={0.55 * (1 - 0.4 * napas)} />
          <path d={busurCelah(kx, ky, kd / 2 + 14 + 18 * napas, kd)} fill="none" stroke={B.turq} strokeWidth={4} strokeLinecap="round" opacity={0.35} />
        </svg>) : null}
      {/* lencana di LUAR lingkaran kanan-atas (dulu di tepi lingkaran menimpa bahu kamu) */}
      <Lencana x={luarLingkaran(kx, ky, kd, 60)[0]} y={luarLingkaran(kx, ky, kd, 60)[1]} d={0} p={popIn(f, tA.mata) * popOut(f, tC.keluar)} warna={B.blue} ikon="mata" besar={60} />
      <Lencana x={luarLingkaran(kx, ky, kd, 60)[0]} y={luarLingkaran(kx, ky, kd, 60)[1]} d={0} p={popIn(f, tC.jam) * popOut(f, tC.panelKeluar)} warna={B.turq} ikon="waktu" besar={60} />

      {/* ═════ kartu aplikasi saham ↔ panel padang (SATU bentuk) ═════ */}
      {kartuP > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: KARTU.w, height: KARTU.h, transformOrigin: 'center',
          transform: `translate3d(${KARTU.x - KARTU.w / 2}px, ${KARTU.y - KARTU.h / 2}px, 0)${kartuP < 0.9999 ? ` scale(${skalaPop(kartuP)})` : ''}` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 32, overflow: 'hidden', boxShadow: bayanganKaca(B.blue),
            background: `linear-gradient(165deg, ${rgba(B.white, 0.98)} 0%, ${rgba(B.white, 0.9)} 100%)` }}>
            {isiPanel > 0.001 ? <div style={{ position: 'absolute', inset: 0, opacity: isiPanel < 1 ? isiPanel : undefined }}><PanelPeriksa f={f} /></div> : null}
            {isiApp > 0.001 ? (
              <div style={{ position: 'absolute', inset: 0, opacity: isiApp < 1 ? isiApp : undefined }}>
                <div style={{ position: 'absolute', left: 28, top: 24, fontFamily: F, fontWeight: 800, fontSize: 30, color: B.night }}>Saham</div>
                {/* chip di TEMPAT TETAP (dulu baris flex: chip baru mendorong chip lama bergeser seketika — pindai DOM 30 Okt f29166) */}
                <div style={{ position: 'absolute', right: 24, top: 24, width: 3 * 97 + 2 * 8, height: 34 }}>
                  {untung.map((p, k) => p > 0 ? <div key={k} style={{ position: 'absolute', left: k * (97 + 8), top: 0, padding: '6px 12px', borderRadius: 999,
                    background: rgba(ARAH.naik, 0.14), color: HIJAU_TEKS, fontFamily: F, whiteSpace: 'nowrap',
                    fontWeight: 800, fontSize: 22, transformOrigin: 'center', transform: `scale(${skalaPop(p)})` }}>✓ untung</div> : null)}
                </div>
                <ChartTanda f={f} />
                {/* garis pemisah area tombol (seperti aplikasi) */}
                <div style={{ position: 'absolute', left: 26, right: 26, top: KARTU.h - 112, height: 2, background: B.grayLite, opacity: 0.7 }} />
              </div>) : null}
          </div>
          {morf > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: 32, boxShadow: `inset 0 0 0 ${SISI * morf}px ${B.white}` }} /> : null}
        </div>) : null}
      {/* tombol aplikasi: MULAI TERTEKAN lalu BERHENTI (tanpa ikon tangan) */}
      {(['beli', 'jual'] as const).map((ke, k) => {
        const [x, y] = TOMBOL[ke], q = tekan(ke);
        return (
          <div key={ke} style={{ position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: q > 0 ? `scale(${1 - DALAM_SETENGAH * q})` : undefined }}>
            <Chip x={x} y={y} teks={ke === 'beli' ? 'BELI' : 'JUAL'} warna={ke === 'beli' ? ARAH.naik : ARAH.turun} p={tombolP(k)} size={34} />
          </div>);
      })}
      {TANDA.map((tn, k) => {
        const [x, y] = TOMBOL[tn.ke];
        return <Lencana key={k} x={x + POJOK[0]} y={y + POJOK[1]} d={0} p={popIn(f, tn.henti + 10) * popOut(f, tn.henti + 80)} warna={B.orange} ikon="jeda" besar={50} />;
      })}
      {/* C: tanda jeda di pojok panel saat tokoh berhenti */}
      <Lencana x={KARTU.x + KARTU.w / 2 - 64} y={KARTU.y - KARTU.h / 2 + 64} d={0} p={popIn(f, tC.jeda) * popOut(f, tC.panelKeluar)} warna={B.orange} ikon="jeda" besar={72} />
      {/* daftar tiga tanda di bawah kartu (tersusun satu per satu) */}
      {TANDA.map((tn, k) => (
        <React.Fragment key={k}>
          <Nomor x={KARTU.x + (k - 1) * 280 - 108} y={DAFTAR_Y} n={k + 1} warna={tn.warna} p={popIn(f, tn.t - 10) * popOut(f, tC.keluar)} d={52} />
          <Chip x={KARTU.x + (k - 1) * 280 + 22} y={DAFTAR_Y} teks={tn.teks} warna={tn.warna} p={popIn(f, tn.t) * popOut(f, tC.keluar)} size={22} />
        </React.Fragment>))}

      {/* ═════ B: awan perasaan di atas kepala kamu — badan tetap, isi berganti tiap tanda ═════ */}
      <TitikPikir f={f} titik={TITIK_B} masuk={tB.awan - 20} keluar={tC.keluar} />
      <AwanPikir x={AWAN_B.x} y={AWAN_B.y} w={AWAN_B.w} h={AWAN_B.h} p={awanB}>
        {TANDA.map((tn, k) => { const a = isiB(k); return a <= 0.001 ? null : (
          <div key={k} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: a < 1 ? a : undefined, transform: `translateY(${(1 - a) * 14}px)` }}>
            <Icon name={tn.ikon} size={62} color={tn.warna} />
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 28, color: B.night, whiteSpace: 'nowrap' }}>{tn.awan}</div>
          </div>); })}
      </AwanPikir>

      {/* ═════ D: pertanyaan = AWAN PIKIRAN kamu (dulu teks layar di atas orang) ═════ */}
      <TitikPikir f={f} titik={TITIK_D} masuk={tD.awan - 20} keluar={tD.keluar} />
      <AwanPikir x={AWAN_D.x} y={AWAN_D.y} w={AWAN_D.w} h={AWAN_D.h} p={awanD}>
        <div style={{ textAlign: 'center', fontFamily: F, fontWeight: 800, fontSize: 46, lineHeight: 1.2, whiteSpace: 'nowrap', marginTop: -10 }}>
          <div><WordText f={f} at={T.saya} style={{ color: B.night }}>Saya sedang menganalisis</WordText></div>
          <div><WordText f={f} at={T.bereaksi - 20} style={{ color: ORANYE_TEKS }}>atau hanya bereaksi?</WordText></div>
        </div>
      </AwanPikir>
      {(['Chart', 'Laporan keuangan', 'Risiko'] as const).map((t, k) => (
        <Chip key={t} x={AWAN_D.x + (k - 1) * 270} y={AWAN_D.y + AWAN_D.h / 2 + 16 + 30} teks={t} ikon="tersedia" warna={ARAH.naik} p={popIn(f, tD.cek[k]) * popOut(f, tD.keluar)} size={24} />))}

      {/* ═════ E: ingat tiga hal — keluar ke outro: swipe naik, berhenti di waktu berbeda ═════ */}
      {KARTU_E.map((k, j) => {
        const p = popIn(f, k.t - 20); if (p <= 0) return null;
        const nK = KARTU_E.reduce((s, q) => s + cin(f, q.t - 30), 0);
        const x = 960 + (j - (Math.max(1, nK) - 1) / 2) * 480;
        const ty = naikE(j);
        if (ty <= -1099) return null;
        return (
          <div key={j} style={{ position: 'absolute', inset: 0, transform: ty < 0 ? `translate3d(0, ${ty}px, 0)` : undefined }}>
            <Kaca x={x} y={470} w={420} h={330} p={p} warna={k.warnaKe}>
              <Nomor x={56} y={56} n={k.n} warna={k.warnaKe} p={1} d={64} />
              <Bulat x={118} y={160} d={110} warna={B.blue} ikon={k.dari} p={popIn(f, k.t)} />
              <Bulat x={302} y={160} d={110} warna={k.warnaKe} ikon={k.ke} p={popIn(f, k.t + 30)} />
              {popIn(f, k.t + 16) > 0 ? <svg width={420} height={330} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <Penghubung d="M 184 160 L 236 160" g={cin(f, k.t + 16)} warna={B.gray} titik={false} panah={{ x: 236, y: 160, sudut: 0 }} />
              </svg> : null}
              <Label x={210} y={253} teks={k.teks} f={f} at={k.t + 40} size={28} lebar={372} />
            </Kaca>
          </div>);
      })}
    </>);
};
