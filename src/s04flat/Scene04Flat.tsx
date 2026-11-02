import React from 'react';
import { EMTK_S04 } from '../data/lilinRiil.gen';
import { BatangLilin, KisiLilin, jangkauan, lilinGulir, posisiGulir } from '../parts/lilinRiil';
import { Img, staticFile } from 'remotion';
import { ARAH, B, CEK, F, R, SISI, bayanganDengan, bayanganKecil, io, lerp, mixHex, rgba } from '../theme';
import { Backdrop } from '../parts/Backdrop';
import { Icon, KataTopeng, SWIPE, cin, cinV, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Lencana } from '../parts/umum';
import { Penghubung } from '../parts/kaca';
import { Avatar, Pendar } from '../parts/v06';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { BERDIRI, LENGAN_MAIN_HP, alasTerendah, campurPose, ikLengan, titikKepala, type Pose } from '../flat/rigTegak';
import { HutanLayar, TANAH_LAYAR, TokohTegakLapis } from '../flat/dunia';
import { Buah, Genggam, PEGANG_DEKAT, Pil, Tanda } from '../s02flat/Scene02Flat';
import { Belah, HP, MaskerBulat, SEMAK, SemakBuah, TANGAN } from '../s03flat/Scene03Flat';

/**
 * SCENE 04 — VERSI 2D FLAT (dokumen "Investing_101_Ide_Visual_2D_Flat_Detail.md" Scene 04 "Kenapa Jalan Pintas Gagal di Pasar?"). Acuan gaya = Scene 01–03
 * flat. Simon 27 Okt: "Scene 03 oke, lanjut bangun Scene 04 versi flat (hapus Scene 04 lama)". Dokumen: satu ponsel, satu tokoh, satu chart, tiga contoh
 * konteks; teks layar dibatasi pada istilah/angka yang perlu; TEKS LAYAR "Satu angka bukan analisis lengkap."
 *  A f8174–8902 jalan pintas → lingkaran otak (akhir S03) MEMBUKA jadi jalan kota: tokoh memegang hp, hp besar naik (swipe + 45°), empat kartu muncul di
 *    katanya: pesan teman · PE rendah · ROE tinggi · tema ramai (langkah 1).
 *  B f8902–9185 "Otak lalu menyimpulkan: 'Informasinya cukup. Beli.'" → otak di atas kepala, centang di empat kartu, jari menuju BELI lalu BERHENTI tepat
 *    sebelum menyentuh (langkah 2).
 *  C f9185–9433 "satu informasi tanpa konteks bisa menyesatkan" → centang berganti "?", kartu PE lepas dari hp dan membesar jadi panel konteks.
 *  D–F f9458–10109 tiga panel konteks (tengah dulu, lalu memberi ruang): PE — batang laba naik ke puncak lalu turun, PE 5× → 15× + kartu data siklus
 *    (catatan produksi) · ROE — tumpukan laba & utang dihubungkan garis · tema — investor tertarik, laba belum tumbuh (langkah 3–5).
 *  G–H f10132–10457 "masalah kedua" → tiga panel MENYATU jadi lencana 02, lencana membuka jadi padang rumput: tokoh memakan buah, buah lain di semak tetap
 *    sama (langkah 7).
 *  I f10457–10841 layar terbelah: pasar — banyak investor melihat PE 5× yang sama, BELI bergantian, tiap BELI → candle naik & PE berubah (langkah 6).
 *  J f10863–11046 "Jalan pintas yang kamu lihat juga dilihat orang lain" → chart keluar, "kamu" muncul di tengah, empat investor pasar yang SAMA memberi
 *    ruang, garis pandang putus-putus semua orang ke kartu PE yang sama.
 *  K f11069–11438 "berpikir satu langkah lebih jauh dari angka pertama" → lingkaran "kamu" membuka kembali ke tokoh + hp: jari tetap menahan BELI, tiga
 *    informasi lain diperiksa, kotak "Satu angka bukan analisis lengkap." (langkah 8). Keluar = kotak naik ke Scene 05 (70 f di awal Scene 05).
 * ⚠ Angka PE 5×/15× & ROE 30% = ILUSTRASI (dokumen: angka ilustratif dipakai bila disetujui) — menunggu persetujuan Simon.
 */
/* ── WAKTU KATA (dipindah dari Scene 04 lama yang dihapus 27 Okt) ── */
const W = urut(['pasar', 'jalan', 'muncul', 'bentuk', 'teman', 'naik', 'pe-nya', 'rendah', 'roe-nya', 'tinggi', 'ramai', 'tema',
  'otak', 'menyimpulkan', 'informasinya', 'cukup', 'beli', 'masalahnya', 'konteks', 'menyesatkan',
  'pe', 'laba', 'puncak', 'siklus', 'roe', 'ditopang', 'utang', 'besar', 'tema', 'populer', 'benar-benar', 'menghasilkan', 'laba',
  'kedua', 'penting', 'buah', 'padang', 'berubah', 'memakannya', 'pasar', 'banyak', 'melihat', 'murah', 'sama', 'membeli', 'bersama-sama', 'harga', 'berubah',
  'jalan', 'lihat', 'dilihat', 'lain', 'karena', 'investasi', 'berpikir', 'satu', 'langkah', 'jauh', 'angka', 'pertama', 'terlihat'], BATAS.s4 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  pasar: n(), jalan: n(), muncul: n(), bentuk: n(), teman: n(), naik: n(), pe: n(), rendah: n(), roe: n(), tinggi: n(), ramai: n(), tema: n(),
  otak: n(), menyimpulkan: n(), informasinya: n(), cukup: n(), beli: n(), masalahnya: n(), konteks: n(), menyesatkan: n(),
  pe2: n(), laba: n(), puncak: n(), siklus: n(), roe2: n(), ditopang: n(), utang: n(), besar: n(), tema2: n(), populer: n(), benar: n(), menghasilkan: n(), laba2: n(),
  kedua: n(), penting: n(), buah: n(), padang: n(), berubah: n(), memakannya: n(), pasar2: n(), banyak: n(), melihat: n(), murah: n(), sama: n(), membeli: n(),
  bersama: n(), harga: n(), berubah2: n(),
  jalan2: n(), lihat: n(), dilihat: n(), lain: n(), karena: n(), investasi: n(), berpikir: n(), satu: n(), langkah: n(), jauh: n(), angka: n(), pertama: n(),
  terlihat: n(),
};
export const S04_T = T;
const AKHIR = BATAS.s5;

/* ════════════════════════════ UMUM ════════════════════════════ */
type P2 = [number, number];
const S = 0.82;
const lin = (f: number, a: number, b: number) => R(f, a, b, 0, 1, (x) => x);
const rp = (v: number) => `Rp${(Math.round(v / 5) * 5).toLocaleString('id-ID')}`;

/** KOTAK TEKS (gaya kotak judul Scene 01/02): kotak putih skala X easeOutBack, teks dimasker kotak, kata naik */
const KotakTeks: React.FC<{ f: number; at: number; keluar: number; x: number; y: number; teks: string; size?: number }> = ({ f, at, keluar, x, y, teks, size = 52 }) => {
  const sx = skalaPop(popIn(f, at - 10)) * skalaPop(popOut(f, keluar));
  if (sx <= 0.01) return null;
  const k = size / 52; // padding, sudut & jarak ke pusat ikut ukuran huruf
  return (
    <div style={{ position: 'absolute', left: x - 700, width: 1400, top: y - 44 * k, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: B.white, borderRadius: 28 * k, boxShadow: bayanganKecil(B.night), overflow: 'hidden', transform: `scaleX(${sx})`, transformOrigin: 'center' }}>
        <div style={{ padding: `${12 * k}px ${34 * k}px`, transform: `scaleX(${1 / sx})`, transformOrigin: 'center' }}>
          <WordText f={f} at={at} until={keluar} style={{ fontFamily: F, fontSize: size, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>{teks}</WordText>
        </div>
      </div>
    </div>);
};

/* ════════════════════════════ A–C · KOTA: TOKOH + HP INFO ════════════════════════════ */
const X_TOKOH = 700; // pinggul di dudukan kiri sofa merah (berkas Simon)
/** tokoh berdiri memegang hp (pose MAIN HP terukur — sama dengan antrean Scene 03), napas + mengangguk kecil tiap kartu muncul (membaca) */
const KARTU_T = [T.teman, T.pe, T.roe, T.ramai];
const POSE_HP = (f: number): Pose => {
  const base: Pose = { ...BERDIRI, bahu: [LENGAN_MAIN_HP.atas[0], LENGAN_MAIN_HP.atas[1]],
    siku: [LENGAN_MAIN_HP.bawah[0] - LENGAN_MAIN_HP.atas[0], LENGAN_MAIN_HP.bawah[1] - LENGAN_MAIN_HP.atas[1]], tangan: [-10, 0] };
  const napas = Math.sin((2 * Math.PI * f) / 220);
  const angguk = KARTU_T.reduce((s, t) => s + (Math.sin(Math.PI * lin(f, t + 4, t + 40)) ** 2), 0);
  return { ...base, badan: base.badan + 0.6 * napas, kepala: -0.6 * napas + 4 * angguk };
};
/** RUANG TAMU (Simon 27 Okt sore: "Ganti adegannya dengan orang yang sedang duduk bermain ponsel disofa ruang tamu (cek screenshoot), ponsel tetap ada"
 * → pilih screenshot 2: tokoh di tengah sofa, nakas di kiri, lampu lantai di kanan, jendela & jam dinding di belakang). Flat, 6 warna brand + tint terang.
 * POSE DUDUK DIUKUR dari figur duduk paket pria-biru (5505133.jpg, grid 20 px; sudut 3/4 sama dengan rig): paha mutlak −87,7° (mendatar ke depan),
 * betis dekat −2,6° / jauh +6,8° (tegak), telapak rata; badan condong +4° (figur di meja +8,7°, di sofa lebih bersandar). Lengan = pose MAIN HP terukur.
 * ⚠ kaki screenshot 2 menyilang tampak DEPAN — tidak bisa dipindah ke rig 3/4; kaki dibiarkan sejajar seperti figur duduk paket. */
const POSE_DUDUK = (f: number): Pose => {
  const h = POSE_HP(f), badan = 4 + (h.badan - BERDIRI.badan);
  return { ...h, badan, paha: [-87.7 - badan, -87.7 - badan], lutut: [85.1, 94.5], telapak: [2.6, -6.8] };
};
/** RUANG TAMU = berkas Simon `Ruang tamu.svg` (28 Okt: "ganti ruang tamunya dengan ini" → "jangan discale, terapkan apa adanya"), viewBox 1920 × 1080
 * dipasang 1 : 1 dengan layar; dipecah `scripts/ekstrak-ruang-tamu.py` jadi lapis BELAKANG (dinding … sofa merah, stool, karpet) dan DEPAN (meja kopi +
 * benda di atasnya) — tokoh duduk di antaranya. Dulu: ruang tamu gambaranku + sofa Freepik B.
 * TOKOH DIPERBESAR (Simon 28 Okt: "Perbesar tokoh"; skala 0,82 → kaki menggantung di atas lantai): bokong di puncak dudukan sofa merah (y 618 terukur)
 * dan telapak MENAPAK lantai di depan sofa (y 790) → skala = (790 − 618) ÷ jarak bokong–telapak pose duduk (satuan rig) ≈ 1,23. */
/** seluruh ruang (dua lapis + tokoh) TURUN — Simon 28 Okt: "turunkan sampai mejanya menyentuh pita subtitle y 925" (33 px: tepi meja 892 → 925) lalu
 * "turunkan sedikit lagi" (+20 → 53 px; berkas diperbarui Simon: tali lampu gantung diperpanjang ke y −101 supaya tetap menyambung ke tepi atas frame) */
const GESER_RUANG = 53;
const KURSI_Y = 618 + GESER_RUANG, LANTAI_DUDUK = 790 + GESER_RUANG;
const S_DUDUK = (() => { const p = POSE_DUDUK(0); return (LANTAI_DUDUK - KURSI_Y) / (alasTerendah(p) + (p.angkat ?? 0) - 26); })();
const TANAH_DUDUK = () => LANTAI_DUDUK;
const LAPIS_RUANG = (nama: string) => (
  <Img src={staticFile(`flat/s04/ruang-${nama}.svg`)} style={{ position: 'absolute', left: 0, top: GESER_RUANG - 100, width: 1920, height: 1180, maxWidth: 'none' }} />);
const AdeganTokohHp: React.FC<{ f: number }> = ({ f }) => (
  <>
    {LAPIS_RUANG('belakang')}
    <TokohTegakLapis x={X_TOKOH} tanah={TANAH_DUDUK()} s={S_DUDUK} pose={POSE_DUDUK(f)} kostum="kini" ponsel ketuk bayangan={false} />
    {LAPIS_RUANG('depan')}
  </>);
const kepalaTokoh = (f: number): P2 => {
  const p = POSE_DUDUK(f), q = titikKepala(p), ay = TANAH_DUDUK() - (alasTerendah(p) + (p.angkat ?? 0)) * S_DUDUK;
  return [X_TOKOH + q[0] * S_DUDUK, ay + q[1] * S_DUDUK];
};
/** pusat-x kepala saat kotak "Satu angka…" tampil (tetap — anggukan kecil tidak ikut menggeser kotak) */
const X_KEPALA_K = Math.round(kepalaTokoh(T.angka)[0]);

/** HP BESAR info saham: harga + satu chart candle kecil, empat kartu alasan, tombol BELI. Koordinat layar hp (SW × SH).
 * Simon 28 Okt: "geser dan turunkan sedikit ke kanan ponselnya (kira kira sampai tombol belinya sejajar dengan meja)" → pusat 1300, 470 → 1360, 584:
 * pusat tombol BELI y 746 → 860 = setinggi permukaan meja kopi (y 846–923 sesudah ruang turun 53 px). Lebih rendah lagi (pusat BELI = tengah permukaan
 * meja, y 885) membuat dasar hp y 975 menempel kotak subtitle (y 978); kini dasar hp y 950. */
const HPX = 1360, HPY = 584;
const KARTU_HP = { x: 22, w: HP.w - 24 - 44, h: 74, y: [292, 374, 456, 538] };
const TOMBOL = { y: 640, h: 64, w: 280 };
const tB = { otak: T.otak, cek: T.informasinya - 10, tombol: T.cukup, jari: T.beli - 34, henti: T.beli + 4, tanya: T.konteks - 10, keluarHp: T.menyesatkan + 50 };
const KartuAlasan: React.FC<{ k: number; p: number; cek: number; tanya: number }> = ({ k, p, cek, tanya }) => {
  if (p <= 0) return null;
  const w = KARTU_HP.w, h = KARTU_HP.h;
  const isi = [
    <><Bulat x={36} y={h / 2} d={52} warna={B.turq} ikon="orangLain" p={1} />
      <div style={{ position: 'absolute', left: 70, top: 16, padding: '7px 10px', borderRadius: '16px 16px 16px 4px', background: B.turqWash, fontFamily: F, fontSize: 17,
        fontWeight: 700, color: B.night, whiteSpace: 'nowrap' }}>Saham ini akan naik.</div></>,
    <><div style={{ position: 'absolute', left: 18, top: 18, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>PE <span style={{ color: B.blue }}>5×</span></div>
      <Chip2 x={112} y={h / 2} teks="rendah" warna={ARAH.naik} /></>,
    <><div style={{ position: 'absolute', left: 18, top: 18, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>ROE <span style={{ color: B.blue }}>30%</span></div>
      <Chip2 x={170} y={h / 2} teks="tinggi" warna={ARAH.naik} /></>,
    <><Bulat x={36} y={h / 2} d={52} warna={B.orange} ikon="ramai" p={1} />
      <div style={{ position: 'absolute', left: 72, top: 25, fontFamily: F, fontSize: 19, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>Tema sedang ramai</div></>,
  ][k];
  return (
    <div style={{ position: 'absolute', left: KARTU_HP.x, top: KARTU_HP.y[k], width: w, height: h, borderRadius: 18, background: B.white, border: `2.5px solid ${B.grayLite}`,
      boxSizing: 'border-box', transformOrigin: 'center', transform: `scale(${skalaPop(p)})`, boxShadow: bayanganKecil(B.night, 0.6) }}>
      {isi}
      {cek > 0 ? <div style={{ position: 'absolute', left: w - 44, top: h / 2 - 17, width: 34, height: 34, borderRadius: '50%', background: B.white, border: `3px solid ${CEK}`,
        boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(cek)})` }}><Icon name="tersedia" size={18} color={CEK} /></div> : null}
      {tanya > 0 ? <div style={{ position: 'absolute', left: w - 44, top: h / 2 - 17, width: 34, height: 34, borderRadius: '50%', background: B.white, border: `3px solid ${B.orange}`,
        boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(tanya)})`, fontFamily: F, fontWeight: 800, fontSize: 20, color: B.orange }}>?</div> : null}
    </div>);
};
const Chip2: React.FC<{ x: number; y: number; teks: string; warna: string }> = ({ x, y, teks, warna }) => (
  <div style={{ position: 'absolute', left: x, top: y - 14, padding: '4px 11px', borderRadius: 999, background: rgba(warna, 0.14), color: warna, fontFamily: F, fontSize: 17,
    fontWeight: 800, whiteSpace: 'nowrap' }}>{teks}</div>);
/** chart kecil di hp: candle HARIAN RIIL (Simon 27 Okt: realistis seperti asli) — EMTK 11 Jan – 16 Feb 2022 tanpa nama, diskalakan (tutup terakhir = Rp1.000) */
const CANDLE_HP = EMTK_S04.slice(0, 26);
const ChartHp: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const lo = Math.min(...CANDLE_HP.map((c) => c.l)), hi = Math.max(...CANDLE_HP.map((c) => c.h));
  const Y = (v: number) => h - 8 - ((h - 16) * (v - lo)) / (hi - lo), slot = w / CANDLE_HP.length;
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
      <KisiLilin w={w} h={h} tebal={1} />
      {CANDLE_HP.map((c, k) => <BatangLilin key={k} c={c} x={slot * (k + 0.5)} slot={slot} Y={Y} sumbu={1.4} rx={1} />)}
    </svg>);
};
const PonselInfo: React.FC<{ f: number; x: number; y: number; rot: number; tahan?: boolean; cekLain?: number[] }> = ({ f, x, y, rot, tahan, cekLain }) => {
  const SW = HP.w - 24, SH = HP.h - 24;
  const kartuP = KARTU_T.map((t) => popIn(f, t));
  const cek = [0, 1, 2, 3].map((k) => popIn(f, tB.cek + 12 * k) * popOut(f, tB.tanya + 8 * k - 50));
  // aturan 17 (audit 28 Okt): centang keluar 30 f LEBIH AWAL → "?" (tetap di kata "konteks") mulai masuk tepat saat centang di tempat yang sama selesai
  // keluar (dulu tumpang 30 f)
  const tanya = [0, 1, 2, 3].map((k) => (k === 0 ? 0 : popIn(f, tB.tanya + 8 * k + 10)));
  const glow = cin(f, tB.tombol) * (1 - cin(f, tB.tanya));
  // KLIK BELI (Simon 27 Okt sore: "Ketika voice mengatakan 'beli' seharusnya buttonnya kamu klik, kamu hanya munculkan tangan tapi tidak ada yang
  // terjadi setelahnya"): jari naik sampai ujungnya di tengah tombol tepat di "beli" → tombol tertekan (skala 0,94, 8 f turun + 12 f naik) + riak putih
  // dari titik sentuh → tombol berganti "✓ Dibeli" (tint biru → hijau 60 f) → jari turun keluar layar. Dulu jari berhenti 34 px di bawah tombol.
  const klik = !tahan;
  const jariNaik = cin(f, tB.jari), jariTurun = klik ? cin(f, T.beli + 50) : 0; // jari naik 60 f (dulu 50 f), sampai tombol 4 f sebelum "beli"
  const tekan = klik ? R(f, T.beli - 4, T.beli + 4, 0, 1) * (1 - R(f, T.beli + 4, T.beli + 16, 0, 1)) : 0;
  const riak = klik ? R(f, T.beli, T.beli + 60, 0, 1) : 0; // riak 60 f inOut cubic (dulu 36 f ease-out cubic)
  const dibeli = klik ? cin(f, T.beli + 34) : 0;
  const jariY = lerp(lerp(760, -TOMBOL.h / 2 + 4 * tekan, jariNaik), 760, jariTurun);
  const tombol = (sisi: 'kiri' | 'kanan', ty: number, h: number) => (
    <div style={{ position: 'absolute', left: sisi === 'kiri' ? -4 : HP.w - 1, top: ty, width: 5, height: h, borderRadius: 3, background: B.night }} />);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: HP.w, height: HP.h, transformOrigin: 'center',
      transform: `translate3d(${x - HP.w / 2}px, ${y - HP.h / 2}px, 0) rotate(${rot}deg) scale(${HP.k})`, borderRadius: 58, background: B.night,
      boxShadow: `0 18px 40px -16px rgba(18,16,48,.45), inset 0 0 0 2px ${mixHex(B.night, B.gray, 0.45)}` }}>
      {tombol('kiri', 140, 30)}{tombol('kiri', 196, 58)}{tombol('kiri', 266, 58)}{tombol('kanan', 220, 92)}
      <div style={{ position: 'absolute', inset: 12, borderRadius: 46, background: '#F6F7FB', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 30, top: 15, fontFamily: F, fontSize: 18, fontWeight: 700, color: B.night }}>09:41</div>
        <div style={{ position: 'absolute', left: SW / 2 - 46, top: 11, width: 92, height: 27, borderRadius: 14, background: B.night }} />
        <div style={{ position: 'absolute', left: 22, top: 56, fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>{rp(1000)}</div>
        <div style={{ position: 'absolute', left: 22, top: 112, width: SW - 44, height: 160 }}><ChartHp w={SW - 44} h={160} /></div>
        {[0, 1, 2, 3].map((k) => (cekLain ? null : <KartuAlasan key={k} k={k} p={kartuP[k]} cek={cek[k]} tanya={tanya[k]} />))}
        {cekLain ? <CekLain f={f} p={cekLain} /> : null}
        <div style={{ position: 'absolute', left: SW / 2 - TOMBOL.w / 2, top: TOMBOL.y, width: TOMBOL.w, height: TOMBOL.h, borderRadius: 999,
          background: mixHex(B.blue, CEK, dibeli), overflow: 'hidden', transformOrigin: 'center', transform: tekan > 0 ? `scale(${1 - 0.06 * tekan})` : undefined,
          fontFamily: F, fontSize: 28, fontWeight: 800, color: B.white, letterSpacing: '.05em',
          boxShadow: `${bayanganKecil(mixHex(B.blue, CEK, dibeli))}${glow > 0 ? `, 0 0 ${28 * glow}px ${8 * glow}px ${rgba(B.blue, 0.35)}` : ''}` }}>
          {riak > 0 && riak < 1 ? <div style={{ position: 'absolute', left: TOMBOL.w / 2 + 40 - 150 * riak, top: TOMBOL.h / 2 - 150 * riak, width: 300 * riak, height: 300 * riak,
            borderRadius: '50%', background: B.white, opacity: 0.45 * (1 - riak) }} /> : null}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 1 - dibeli }}>BELI</div>
          {dibeli > 0 ? <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: dibeli }}>
            <Icon name="tersedia" size={26} color={B.white} />Dibeli</div> : null}
        </div>
        <div style={{ position: 'absolute', left: SW / 2 - 62, top: SH - 14, width: 124, height: 5, borderRadius: 3, background: B.night, opacity: 0.85 }} />
      </div>
      {/* jari: A–C menekan BELI lalu turun keluar · K (tahan) berhenti 34 px di bawah tombol (tidak menyentuh) */}
      {(tahan || (jariNaik > 0 && jariTurun < 1)) ? (
        <Img src={staticFile('flat/tangan-potong.svg')} style={{ position: 'absolute', left: HP.w / 2 - TANGAN.ujung[0] * TANGAN.s + 40,
          top: 12 + TOMBOL.y + TOMBOL.h + (tahan ? 34 : jariY) - TANGAN.ujung[1] * TANGAN.s, width: 420 * TANGAN.s, height: 920 * TANGAN.s, maxWidth: 'none' }} />) : null}
    </div>);
};
/** K: kartu PE (angka pertama) + tiga informasi lain diperiksa satu per satu (kaca pembesar → centang) */
const CEK_LAIN: { ikon: 'laporanKeuangan' | 'utang' | 'pertumbuhan'; teks: string }[] = [
  { ikon: 'laporanKeuangan', teks: 'Laba beberapa tahun' }, { ikon: 'utang', teks: 'Besar utang' }, { ikon: 'pertumbuhan', teks: 'Laba benar-benar tumbuh' }];
const CekLain: React.FC<{ f: number; p: number[] }> = ({ p }) => {
  const w = KARTU_HP.w, h = KARTU_HP.h;
  return (
    <>
      <div style={{ position: 'absolute', left: KARTU_HP.x, top: KARTU_HP.y[0], width: w, height: h, borderRadius: 18, background: B.white, border: `2.5px solid ${B.blue}`,
        boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', left: 18, top: 12, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>PE <span style={{ color: B.blue }}>5×</span></div>
        <div style={{ position: 'absolute', right: 14, top: 22, fontFamily: F, fontSize: 18, fontWeight: 800, color: ABU_TEKS }}>angka pertama</div>
      </div>
      {CEK_LAIN.map((c, k) => p[k] <= 0 ? null : (
        <div key={k} style={{ position: 'absolute', left: KARTU_HP.x, top: KARTU_HP.y[k + 1], width: w, height: h, borderRadius: 18, background: B.white,
          border: `2.5px solid ${B.grayLite}`, boxSizing: 'border-box', transformOrigin: 'center', transform: `scale(${skalaPop(p[k])})` }}>
          <Bulat x={36} y={h / 2} d={52} warna={B.turq} ikon={c.ikon} p={1} />
          {/* teks boleh dua baris — dulu satu baris terpotong ikon centang */}
          <div style={{ position: 'absolute', left: 74, top: 0, width: w - 74 - 54, height: h, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 20,
            fontWeight: 800, lineHeight: 1.12, color: B.night }}>{c.teks}</div>
          <div style={{ position: 'absolute', left: w - 44, top: h / 2 - 17, width: 34, height: 34, borderRadius: '50%', background: B.white, border: `3px solid ${CEK}`,
            boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(Math.min(1, p[k] * 1.2))})` }}><Icon name="tersedia" size={18} color={CEK} /></div>
        </div>))}
    </>);
};

/* ════════════════════════════ D–F · TIGA PANEL KONTEKS ════════════════════════════ */
const PANEL = { w: 540, h: 560, y: 497, langkah: 580 };
const PANEL_T = [T.pe2 - 20, T.roe2, T.tema2];
const GESER = 15;
const xPanel = (k: number, f: number) => 960 + (PANEL.langkah / 2) * k - (PANEL.langkah / 2) * [1, 2].filter((j) => j > k).reduce((a, j) => a + cin(f, PANEL_T[j] - GESER), 0);
/* PANEL KONTEKS UNTUK ORANG AWAM (Simon 27 Okt sore: "Visual PE, ROE, dan tema kurang bisa dipahami oleh orang awam yang tidak paham investasi" →
 * konsep yang kuusulkan, "Lakukan dulu"). Angka = ILUSTRASI (harga Rp1.000 tetap). Naskah tidak diubah.
 *  PE   = "berapa tahun laba untuk balik modal": laba per tahun naik ke PUNCAK siklus (Rp200 → PE 1.000 ÷ 200 = 5×, 5 koin = 5 tahun) lalu turun
 *         (Rp67 → 15×, 15 koin = 15 tahun).
 *  ROE  = "untung dibanding modal sendiri": laba Rp30 ÷ modal sendiri Rp100 = 30 %, lalu terlihat modal usahanya sebagian besar UTANG (Rp300).
 *  Tema = "ramai dibicarakan": garis popularitas melonjak, garis laba datar → "Ramai ≠ untung". */
const tD = { bar: [T.pe2 + 10, T.laba, T.puncak], turun: T.siklus + 34, koin: T.pe2 + 40 };
const LABA_PE = [95, 125, 160, 185, 200, 67];
/** MARGIN ISI tiga panel konteks (Simon 28 Okt: "cek alignmentnya"): judul, subjudul, garis dasar, baris koin & teks semuanya mulai x 40 dan berakhir
 *  x 500 (dulu campur 30 · 32 · 40 · 46 · 50) */
const M_PANEL = 40;
/** WARNA TEKS BERKONTRAS (Simon 28 Okt: "Ya, gelapkan teks oranye … dan abu … tetap pakai turunan warna brand"): oranye/abu brand dicampur Midnight 22 %.
 *  Oranye #B77F28 ±3,45:1 di putih / ±3,15:1 di krem chip (teks tebal ≥ 19 px = "teks besar", ambang 3:1 — dulu 2,1–2,3:1); abu #74747B ±4,7:1 (ambang
 *  4,5:1 teks 18 px — dulu 3,25:1). Label oranye 18 px dinaikkan ke 19 px supaya oranye tidak perlu digelapkan sampai cokelat (≥ 36 %). */
const ORANYE_TEKS = mixHex(B.orange, B.night, 0.22), ABU_TEKS = mixHex(B.gray, B.night, 0.22);
/** KOIN balik modal (Simon 28 Okt: "coinnya tidak semua memiliki animasi"): SEMUA koin pop easeOutBack 60 f satu per satu (selang 6 f) — 5 koin pertama
 *  di "PE", 10 koin tambahan saat laba turun (dulu koin ke-6…15 muncul begitu saja). Satu baris 8 koin merentang penuh x 40 → 500, rata dengan garis dasar
 *  batang; angka PE & "N tahun laba" = jumlah koin yang sudah muncul (dihitung saat pop-nya 15 % jalan = skala ±57 % — easeOutBack sudah besar
 *  di awal; dihitung di tengah pop membuat angka tertinggal 2–3 koin). Rentetan 10 koin berjalan bersama batang laba turun (9630–9690). */
const KOIN = { d: 44, n: 15, perBaris: 8, y0: 440, jarakY: 56 };
const koinX = (kol: number) => M_PANEL + KOIN.d / 2 + (kol * (PANEL.w - 2 * M_PANEL - KOIN.d)) / (KOIN.perBaris - 1);
const koinAt = (k: number) => (k < 5 ? tD.koin + 6 * k : tD.turun - 12 + 6 * (k - 5));
const jumlahKoin = (f: number) => 5 + Array.from({ length: KOIN.n - 5 }, (_, j) => j + 5).filter((k) => f >= koinAt(k) - 21).length;
const Koin: React.FC<{ x: number; y: number; d: number; p: number }> = ({ x, y, d, p }) => p <= 0 ? null : (
  <g transform={`translate(${x} ${y}) scale(${skalaPop(p)})`}>
    <circle r={d / 2} fill={B.orange} /><circle r={d / 2 - 4} fill="none" stroke={B.orangeLite} strokeWidth={2.5} />
    <text y={d * 0.17} textAnchor="middle" fontFamily={F} fontSize={d * 0.46} fontWeight={800} fill={B.white}>Rp</text>
  </g>);
/** satu baris teks yang muncul NAIK + opacity + motion blur 60 f inOut cubic (aturan teks) — untuk baris berwarna campur yang tak bisa dipecah WordText */
const BarisMuncul: React.FC<{ f: number; at: number; size: number; children: React.ReactNode }> = ({ f, at, size, children }) =>
  <KataTopeng masuk={cin(f, at)} vMasuk={cinV(f, at)} size={size}>{children}</KataTopeng>;
const PanelPE: React.FC<{ f: number }> = ({ f }) => {
  const turun = cin(f, tD.turun);
  const nKoin = jumlahKoin(f), pe = nKoin;
  const DASAR = 318, TINGGI = 170, BW = 52, GAP = 24, X0 = (PANEL.w - (6 * BW + 5 * GAP)) / 2;
  const tumbuh = (k: number) => (k < 5 ? cin(f, lerp(tD.bar[0], tD.bar[2], k / 4)) : turun);
  const puncak = popIn(f, tD.bar[2] + 20); // chip = pop LINEAR → easeOutBack (dulu skalaPop(cin): easing dobel)
  return (
    <>
      <div style={{ position: 'absolute', left: M_PANEL, top: 20, fontFamily: F, fontSize: 46, fontWeight: 800, color: B.night }}>PE <span style={{ color: B.blue }}>{pe}×</span></div>
      <div style={{ position: 'absolute', left: M_PANEL, top: 80, fontFamily: F, fontSize: 21, fontWeight: 700, color: B.gray }}>harga ÷ laba setahun</div>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={M_PANEL} x2={PANEL.w - M_PANEL} y1={DASAR} y2={DASAR} stroke={B.grayLite} strokeWidth={3} />
        {LABA_PE.map((v, k) => {
          const u = tumbuh(k), h = (TINGGI * v) / 200 * u, x = X0 + k * (BW + GAP);
          const warna = k === 4 ? B.orange : k === 5 ? mixHex(B.orange, B.white, 0.35) : B.turqLite;
          return u > 0 ? <rect key={k} x={x} y={DASAR - h} width={BW} height={h} rx={10} fill={warna} /> : null;
        })}
        {/* tahun ke-6: laba turun (panah merah dari puncak) */}
        {turun > 0 ? <Penghubung d={`M ${X0 + 5 * (BW + GAP) + BW / 2} ${DASAR - TINGGI - 6} L ${X0 + 5 * (BW + GAP) + BW / 2} ${DASAR - (TINGGI * 67) / 200 - 18}`} g={turun}
          warna={ARAH.turun} tebal={4} dash={false} titik={false} panah={{ x: 0, y: 0, sudut: Math.PI / 2 }} /> : null}
        <text x={PANEL.w / 2} y={DASAR + 30} textAnchor="middle" fontFamily={F} fontSize={20} fontWeight={700} fill={B.gray}>Laba per tahun</text>
        {/* balik modal = PE tahun laba: satu koin = satu tahun */}
        {Array.from({ length: KOIN.n }, (_, k) => (
          <Koin key={k} x={koinX(k % KOIN.perBaris)} y={KOIN.y0 + Math.floor(k / KOIN.perBaris) * KOIN.jarakY} d={KOIN.d} p={popIn(f, koinAt(k))} />))}
      </svg>
      {/* chip "puncak siklus" di atas batang puncak */}
      {puncak > 0 ? <div style={{ position: 'absolute', left: X0 + 4 * (BW + GAP) + BW / 2, top: DASAR - TINGGI - 38, transform: `translate(-50%, -50%) scale(${skalaPop(puncak)})`,
        padding: '5px 12px', borderRadius: 999, background: B.orangeWash, color: ORANYE_TEKS, fontFamily: F, fontSize: 19, fontWeight: 800, whiteSpace: 'nowrap' }}>puncak siklus</div> : null}
      {/* dulu muncul begitu saja (opacity 0 → 1 dalam satu frame) */}
      <div style={{ position: 'absolute', left: M_PANEL, top: 372, fontFamily: F, fontSize: 22, fontWeight: 800, color: B.night }}>
        <BarisMuncul f={f} at={tD.koin - 10} size={22}>Balik modal ≈ <span style={{ color: nKoin > 10 ? ARAH.turun : B.blue }}>{nKoin} tahun laba</span></BarisMuncul></div>
    </>);
};
const tE = { sendiri: T.roe2 + 10, laba: T.roe2 + 30, utang: T.utang, besar: T.besar + 20 };
const PanelROE: React.FC<{ f: number }> = ({ f }) => {
  const sendiri = cin(f, tE.sendiri), utang = cin(f, tE.utang), besar = popIn(f, tE.besar);
  const LEBAR = PANEL.w - 2 * M_PANEL, SATUAN = LEBAR / 400; // modal usaha Rp400 = Rp100 sendiri + Rp300 utang
  /* teks label: NAIK + opacity + motion blur 60 f (dulu muncul dalam satu frame / hanya memudar); pusat-x di tengah batangnya */
  const label = (cx: number, top: number, at: number, size: number, warna: string, teks: React.ReactNode, tebal = 800) => (
    <div style={{ position: 'absolute', left: cx - 150, width: 300, top, textAlign: 'center', fontFamily: F, fontSize: size, fontWeight: tebal, color: warna }}>
      <BarisMuncul f={f} at={at} size={size}>{teks}</BarisMuncul></div>);
  return (
    <>
      <div style={{ position: 'absolute', left: M_PANEL, top: 20, fontFamily: F, fontSize: 46, fontWeight: 800, color: B.night }}>ROE <span style={{ color: B.blue }}>30%</span></div>
      <div style={{ position: 'absolute', left: M_PANEL, top: 80, fontFamily: F, fontSize: 21, fontWeight: 700, color: B.gray }}>laba ÷ modal sendiri</div>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* laba Rp30 = tiga koin — ukuran & jarak SAMA dengan koin panel PE, tepi kiri x 40 */}
        {[0, 1, 2].map((k) => <Koin key={k} x={koinX(k)} y={162} d={KOIN.d} p={popIn(f, tE.laba + 6 * k)} />)}
        {/* modal usaha: modal sendiri (biru) + utang (oranye) */}
        <rect x={M_PANEL} y={252} width={Math.max(0.01, 100 * SATUAN * sendiri)} height={72} rx={14} fill={B.blue} />
        {utang > 0 ? <rect x={M_PANEL + 100 * SATUAN + 6} y={252} width={Math.max(0.01, (300 * SATUAN - 6) * utang)} height={72} rx={14} fill={B.orange} /> : null}
      </svg>
      <div style={{ position: 'absolute', left: koinX(2) + KOIN.d / 2 + 18, top: 162 - 16, fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <BarisMuncul f={f} at={tE.laba} size={24}>Laba Rp30</BarisMuncul></div>
      <div style={{ position: 'absolute', left: M_PANEL, top: 214, fontFamily: F, fontSize: 20, fontWeight: 700, color: B.gray }}>
        <BarisMuncul f={f} at={tE.sendiri} size={20}>Modal usaha</BarisMuncul></div>
      {label(M_PANEL + 50 * SATUAN, 274, tE.sendiri + 10, 20, B.white, 'Rp100')}
      {label(M_PANEL + 250 * SATUAN, 274, tE.utang + 10, 20, B.white, 'Rp300')}
      {label(M_PANEL + 50 * SATUAN, 334, tE.sendiri + 10, 19, B.blue, 'sendiri', 700)}
      {label(M_PANEL + 250 * SATUAN, 334, tE.utang + 10, 19, ORANYE_TEKS, 'utang', 700)}
      {label(PANEL.w / 2, 392, tE.laba + 20, 26, B.night, <>30 ÷ 100 = <span style={{ color: B.blue }}>30%</span></>)}
      {besar > 0 ? <div style={{ position: 'absolute', left: PANEL.w / 2, top: 476, transform: `translate(-50%, -50%) scale(${skalaPop(besar)})`, padding: '8px 18px',
        borderRadius: 999, background: B.orangeWash, color: ORANYE_TEKS, fontFamily: F, fontSize: 21, fontWeight: 800, whiteSpace: 'nowrap' }}>Sebagian besar modal dari utang</div> : null}
    </>);
};
const tF = { tema: T.tema2 + 20, investor: [T.populer - 10, T.populer + 10, T.populer + 30], ramai: T.populer + 10, laba: T.menghasilkan - 10, beda: T.laba2 + 10 };
const PanelTema: React.FC<{ f: number }> = ({ f }) => {
  const ramai = cin(f, tF.ramai), laba = cin(f, tF.laba), beda = popIn(f, tF.beda);
  const G = { x0: M_PANEL, x1: PANEL.w - M_PANEL, y0: 300, y1: 470 };
  const POP = [0.08, 0.15, 0.3, 0.55, 0.85, 1], LABA = [0.1, 0.11, 0.1, 0.12, 0.11, 0.12];
  const titik = (v: number[], k: number): P2 => [lerp(G.x0, G.x1, k / 5), G.y1 - (G.y1 - G.y0) * v[k]];
  const garis = (v: number[]) => v.map((_, k) => `${k ? 'L' : 'M'} ${titik(v, k)[0]} ${titik(v, k)[1]}`).join(' ');
  return (
    <>
      <div style={{ position: 'absolute', left: M_PANEL, top: 20, fontFamily: F, fontSize: 46, fontWeight: 800, color: B.night }}>Tema</div>
      <div style={{ position: 'absolute', left: M_PANEL, top: 80, fontFamily: F, fontSize: 21, fontWeight: 700, color: B.gray }}>sedang ramai dibicarakan</div>
      <Bulat x={PANEL.w / 2} y={190} d={110} warna={B.orange} ikon="ramai" p={popIn(f, tF.tema)} />
      {/* orang-orang yang membicarakannya di kiri-kanan lingkaran tema */}
      {[0, 2].map((k) => <Avatar key={k} x={PANEL.w / 2 + (k - 1) * 150} y={200} d={64} p={popIn(f, tF.investor[k])} />)}
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={G.x0} x2={G.x1} y1={G.y1} y2={G.y1} stroke={B.grayLite} strokeWidth={3} />
        <Penghubung d={garis(POP)} g={ramai} warna={B.orange} tebal={5} dash={false} titik={false} />
        <Penghubung d={garis(LABA)} g={laba} warna={B.blue} tebal={5} dash={false} titik={false} />
      </svg>
      {/* label garis: NAIK + opacity + motion blur 60 f (dulu hanya memudar mengikuti garis), rata kanan x 500 */}
      <div style={{ position: 'absolute', right: M_PANEL, top: G.y0 - 32, fontFamily: F, fontSize: 20, fontWeight: 800, color: ORANYE_TEKS }}>
        <BarisMuncul f={f} at={tF.ramai} size={20}>Popularitas</BarisMuncul></div>
      <div style={{ position: 'absolute', right: M_PANEL, top: G.y1 - 52, fontFamily: F, fontSize: 20, fontWeight: 800, color: B.blue }}>
        <BarisMuncul f={f} at={tF.laba} size={20}>Laba</BarisMuncul></div>
      {beda > 0 ? <div style={{ position: 'absolute', left: PANEL.w / 2, top: 512, transform: `translate(-50%, -50%) scale(${skalaPop(beda)})`, padding: '8px 20px', borderRadius: 999,
        background: B.blue, color: B.white, fontFamily: F, fontSize: 22, fontWeight: 800, whiteSpace: 'nowrap' }}>Ramai ≠ untung</div> : null}
    </>);
};

/* ════════════════════════════ G–H · MASALAH KEDUA → PADANG RUMPUT ════════════════════════════ */
/** G: tiga panel MENYATU (posisi · ukuran · sudut · warna tepi) jadi satu lencana bulat, angka 02 muncul di "kedua", lalu lingkaran itu membuka */
const tG = { gabung: T.kedua - 20, dua: T.kedua, buka: T.penting + 26,
  // pra-gambar padang dipasang di rentang DIAM terukur f9985–10014 (pindai beda < 0,05) — hitch pasang pertama ±2 frame tak terlihat saat frame identik
  pra: T.populer + 32 };
const D_DUA = 150;
/** Simon 28 Okt ("Ya, rapikan komposisi … padang S04 supaya kelompok tokoh + semak berada di tengah frame"): tokoh (tinta x 722–865) + semak
 *  (915–1325) dulu berpusat x 1023 → digeser −63 (pusat 960; saat layar terbelah pusatnya tepat x 480 = tengah belahan kiri, dulu 543) */
const GESER_H = -63;
const SEMAK_H = { x: 1120 + GESER_H, k: 2.1, alas: TANAH_LAYAR + 6 };
const BUAH_H: P2[] = [[1090, 640], [1176, 616], [1214, 690]].map(([x, y]) => [x + GESER_H, y] as P2);
const X_H = 780 + GESER_H;
const tH = { gigit: [T.memakannya - 16, T.memakannya + 34], sama: T.berubah };
/** pose memakan: buah di tangan dekat; dua kali digigit (tangan ke mulut, IK) */
const poseH = (f: number) => {
  const dada = PEGANG_DEKAT(BERDIRI, -8);
  const kp = titikKepala(dada);
  const mulut = ikLengan(dada, 0, [kp[0] + 26, kp[1] + 40], -80);
  const u = tH.gigit.reduce((s, t) => Math.max(s, Math.sin(Math.PI * lin(f, t - 22, t + 22)) ** 2), 0);
  const p = campurPose(dada, mulut, u);
  const napas = Math.sin((2 * Math.PI * f) / 200);
  return { p: { ...p, badan: p.badan + 0.6 * napas } as Pose, ukuranBuah: 1 - 0.18 * cin(f, tH.gigit[0] + 10) - 0.2 * cin(f, tH.gigit[1] + 10) }; // buah mengecil 60 f per gigitan (audit 28 Okt; dulu 10 f)
};
const AdeganPadang: React.FC<{ f: number; geserX?: number }> = ({ f, geserX = 0 }) => {
  const { p, ukuranBuah } = poseH(f);
  return (
    <>
      <HutanLayar kamX={960 - geserX} C={-2600} lapis="belakang" />
      <SemakBuah x={SEMAK_H.x + geserX} k={SEMAK_H.k} alas={SEMAK_H.alas} buah={BUAH_H.map(([x, y]) => ({ x: x + geserX, y, p: 1 }))} />
      <TokohTegakLapis x={X_H + geserX} tanah={TANAH_LAYAR} s={S} pose={p} kostum="dulu"
        pegang={<Genggam p={p} miring={0}><g transform={`scale(${ukuranBuah})`}><Buah r={24 / S} /></g></Genggam>} />
      <HutanLayar kamX={960 - geserX} C={-2600} lapis="depan" />
      {/* buah lain di semak TETAP SAMA */}
      <Tanda x={SEMAK_H.x + geserX + 10} y={SEMAK_H.alas - SEMAK.h * SEMAK_H.k - 70} d={84} teks="=" warna={B.blue} p={popIn(f, tH.sama) * popOut(f, T.pasar2 - 20)} />
    </>);
};

/** jendela padang rumput = SATU elemen sejak pra-gambar (opasitas 0,002) → lingkaran 02 membuka → belahan kiri saat layar terbelah. Struktur DOM sama di
 *  ketiga mode → AdeganPadang tidak dipasang ulang (terukur 27 Okt: tiap pasang ulang HutanLayar = 2 frame ±80 ms di Studio, f10131/10220/10284). */
const JendelaPadang: React.FC<{ f: number; mode: 'pra' | 'bulat' | 'belah'; cy: number; d: number; putih: number; x1: number; geser: number }> =
  ({ f, mode, cy, d, putih, x1, geser }) => {
    const D = 2400, s = d / D, cx = 960, bulat = mode === 'bulat';
    const luar: React.CSSProperties = bulat
      ? { width: D, height: D, borderRadius: '50%', background: B.white, transformOrigin: 'center', transform: `translate3d(${cx - D / 2}px, ${cy - D / 2}px, 0) scale(${s})` }
      : { width: x1, height: 1080, borderRadius: 0, transformOrigin: 'center', transform: 'translate3d(0px, 0px, 0) scale(1)', opacity: mode === 'pra' ? 0.002 : 1 };
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', ...luar }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
          transform: bulat ? `translate(${D / 2}px, ${D / 2}px) scale(${1 / s}) translate(${-cx}px, ${-cy}px)` : 'translate(0px, 0px) scale(1) translate(0px, 0px)' }}>
          <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${geser}px, 0, 0)` }}><AdeganPadang f={f} /></div>
        </div>
        {bulat && putih > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.white, opacity: putih }} /> : null}
        {bulat ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${SISI / s}px solid ${B.blue}`, boxSizing: 'border-box' }} /> : null}
      </div>);
  };

/* ════════════════════════════ I–J · PASAR: BANYAK INVESTOR, PE YANG SAMA ════════════════════════════ */
const tI = { belah: T.pasar2, investor: [T.banyak - 20, T.banyak, T.banyak + 20, T.banyak + 40], mata: T.melihat, sorot: T.murah,
  beli: [T.membeli - 14, T.membeli + 6, T.membeli + 26, T.membeli + 46], naik: T.harga, penuh: T.jalan2 - 20 };
const PE_I = [5, 6, 7, 8];
const peI = (f: number) => {
  const k = tI.beli.filter((t) => f >= t + 30).length;
  return k === 0 ? 5 : PE_I[Math.min(3, k)];
};
/* chart pasar = candle harian RIIL yang sama dengan hp (EMTK diskalakan): 22 candle riwayat (berakhir di candle terakhir hp), lalu 4 candle hijau asli
 * sesudah tiap BELI. GULIR resep video TA (Simon 28 Okt; parts/lilinRiil.tsx): tiap candle BELI tumbuh linear 20 f dari harga buka sambil chart bergeser
 * satu slot; riwayat memenuhi jendela; skala harga terkunci. Dulu: candle terbentuk di tempat 40 f (dua candle bertumpuk waktunya) di chart diam. */
const PASAR_D = EMTK_S04.slice(4, 30);
const PASAR_DASAR = 22, PASAR_SLOT = 22;
const posPasar = posisiGulir(PASAR_DASAR, tI.beli.map((t) => ({ mulai: t + 10, d: 20 })));
const [LO_PASAR, HI_PASAR] = jangkauan(PASAR_D);
const hargaI = (f: number) => { const t = lilinGulir(PASAR_D, posPasar(f), 0, 1, 1); return t[t.length - 1].c.c; };
/** chart pasar: candle riil lalu 4 candle naik tepat sesudah tiap BELI */
const ChartPasar: React.FC<{ f: number; w: number; h: number }> = ({ f, w, h }) => {
  const Y = (v: number) => h - 10 - ((h - 20) * (v - LO_PASAR)) / (HI_PASAR - LO_PASAR), slot = w / PASAR_SLOT;
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
      <KisiLilin w={w} h={h} />
      {lilinGulir(PASAR_D, posPasar(f), 0, w - slot, slot).map(({ c, x, alfa }) => <BatangLilin key={c.t} c={c} x={x} slot={slot} Y={Y} alfa={alfa} />)}
    </svg>);
};
/** J: "kamu" muncul di tengah, empat investor pasar yang SAMA memberi ruang (bergeser ke busur), lalu garis pandang putus-putus semua orang ke kartu PE yang sama */
const tJ = { beri: T.lihat - 20, kamu: T.lihat - 10, garisKamu: T.lihat + 10, lain: [T.dilihat - 20, T.dilihat, T.lain - 20, T.lain], buka: T.karena + 20 };
const POS_J: P2[] = [[600, 620], [770, 750], [1150, 750], [1320, 620]];
const KAMU_J: P2 = [960, 580];
/** garis pandang dari tepi lingkaran avatar ke bawah kartu PE (pusat x `cx`) */
const garisPandang = (x: number, y: number, d: number, cx: number) => {
  const tx = cx + (x - cx) * 0.35, ty = 280, dx = tx - x, dy = ty - y, L = Math.hypot(dx, dy), r = d / 2 + 14;
  return `M ${x + (dx / L) * r} ${y + (dy / L) * r} L ${tx} ${ty}`;
};
/** isi belahan pasar (pusat x `cx`): kartu PE yang sama di atas, chart di tengah, empat investor di bawah (pil BELI) → J (investor yang sama memberi ruang untuk "kamu") */
const PasarIsi: React.FC<{ f: number; cx: number; lebar: number }> = ({ f, cx, lebar }) => {
  const sorot = cin(f, tI.sorot) * (1 - cin(f, tI.penuh));
  const keluarChart = popOut(f, tI.penuh + 10);
  const ax = (k: number) => cx + (k - 1.5) * Math.min(170, lebar / 4.6);
  return (
    <>
      {/* audit 28 Okt: chip y 196 → 214 (+ chart, ▲, ujung garis pandang ikut +18) — di layar terbelah (cx 1440) tepi atas chip bersorot menempel logo (±4 px) */}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${cx}px, 214px, 0) translate(-50%, -50%) scale(${1 + 0.1 * sorot})`, transformOrigin: 'center',
        padding: '14px 34px', borderRadius: 999, background: B.white, border: `${SISI}px solid ${B.blue}`, fontFamily: F, fontSize: 48, fontWeight: 800, color: B.night,
        whiteSpace: 'nowrap', boxShadow: `${bayanganKecil(B.blue)}${sorot > 0 ? `, 0 0 ${30 * sorot}px ${8 * sorot}px ${rgba(B.blue, 0.3)}` : ''}` }}>
        PE <span style={{ color: B.blue }}>{peI(f)}×</span></div>
      {keluarChart > 0 ? (
        <div style={{ position: 'absolute', left: cx - Math.min(380, lebar / 2 - 40), top: 288, width: Math.min(760, lebar - 80), height: 330, borderRadius: 26, background: B.white,
          boxShadow: bayanganKecil(B.night, 0.6), transformOrigin: 'center', transform: `scale(${skalaPop(keluarChart)})` }}>
          <div style={{ position: 'absolute', left: 24, top: 16, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>{rp(hargaI(f))}</div>
          <div style={{ position: 'absolute', left: 20, top: 74, width: Math.min(760, lebar - 80) - 40, height: 236 }}><ChartPasar f={f} w={Math.min(760, lebar - 80) - 40} h={236} /></div>
        </div>) : null}
      {/* J: garis pandang (di bawah avatar) — kamu dulu, lalu orang lain di "dilihat orang lain" */}
      {f >= tJ.garisKamu - 30 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <Penghubung d={garisPandang(KAMU_J[0], KAMU_J[1], 130, cx)} g={cin(f, tJ.garisKamu)} warna={B.blue} titik={false} />
          {POS_J.map(([x, y], k) => <Penghubung key={k} d={garisPandang(x, y, 96, cx)} g={cin(f, tJ.lain[k] + 10)} warna={B.blue} titik={false} />)}
        </svg>) : null}
      {tI.investor.map((t, k) => {
        const beri = cin(f, tJ.beri);
        const x = lerp(ax(k), POS_J[k][0], beri), y = lerp(750, POS_J[k][1], beri), d = lerp(86, 96, beri);
        return (
          <React.Fragment key={k}>
            <Avatar x={x} y={y} d={d} p={popIn(f, t)} />
            <Lencana x={x} y={y} d={d} p={popIn(f, tI.mata + 6 * k)} warna={B.blue} ikon="mata" besar={44} />
            <Pil x={x} y={y - 78} teks="BELI" p={popIn(f, tI.beli[k]) * keluarChart} size={22} />
          </React.Fragment>);
      })}
      {/* J: kamu di tengah */}
      <Avatar x={KAMU_J[0]} y={KAMU_J[1]} d={130} p={popIn(f, tJ.kamu)} warna={B.blue} />
      <Lencana x={KAMU_J[0]} y={KAMU_J[1]} d={130} p={popIn(f, tJ.kamu + 12)} warna={B.blue} ikon="mata" besar={56} />
      {keluarChart > 0 ? <div style={{ position: 'absolute', left: cx + Math.min(380, lebar / 2 - 40) - 70, top: 308, transform: `scale(${skalaPop(popIn(f, tI.naik) * keluarChart)})` }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: B.white, border: `3px solid ${ARAH.naik}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center',
          color: ARAH.naik, fontFamily: F, fontWeight: 800, fontSize: 22 }}>▲</div></div> : null}
    </>);
};

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene04Flat: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s4 || f >= AKHIR + 70) return null;

  /* A: TIGA CAKRAM (BreakSweep ST-02; Simon 27 Okt sore: "Dari scene 3 ke scene 4 gunakan transisi shape seperti yang aku sebutkan tadi (cek video TA)")
   * dari pusat lingkaran otak akhir Scene 03 (960, 497): turkis → turkis muda → cakram berisi ruang tamu; r 0 → 2100 60 f inOut cubic, selang 3 f.
   * Dulu: lingkaran otak membuka jadi jalan kota. */
  const tCakramA = T.pasar - 10;
  const OTAK_S03_Y = 497; // = AKHIR.y Scene 03 (dulu 440)
  const rCakramA = (k: number) => 2100 * cin(f, tCakramA + 3 * k + 30);
  const cakramPenuh = f >= tCakramA + 66;
  const otakS03 = popOut(f, T.pasar);
  const hpMasuk = cin(f, T.jalan + 20);
  const otakB = popIn(f, tB.otak);
  const kp = kepalaTokoh(f);
  /* KOTAK NAIK + ADEGAN LAMA IKUT NAIK (Simon 27 Okt sore: "disini belum menggunakan transisi shape yang kotak" + "tiap ada transisi swipe (paralax dan
   * shape kotak), swipe juga adegan sebelumnya (tidak perlu sampai outframe) dan gunakan easein cubic"). Bilah turkis naik 1080 → 0 (40 f), turkis muda
   * 16 f kemudian, lapis 3 = latar + isi adegan baru naik bersama (60 f mulai +30) — inOut cubic; adegan lama naik 320 px ease-in cubic selama bilah 1
   * menutupnya (40 f; tidak sampai keluar frame). Dulu C → D: ruang tamu terdorong ke kiri + kartu PE lepas dari hp jadi panel PE. */
  /* Simon 28 Okt "pastikan keyframe … konsisten": bilah 40 f → 60 f (seperti semua transisi lain), adegan lama naik 60 f ease-in cubic */
  const naikBilah = (mulai: number, d = 60) => 1080 * (1 - io(lin(f, mulai, mulai + d)));
  const naikLama = (mulai: number) => -320 * lin(f, mulai, mulai + 60) ** 3;
  const B1 = T.menyesatkan + 12; // ruang tamu → panel PE: bilah 9400–9456, panel PE naik 9430–9490 ("PE" 9459)
  /* G: tiga panel menyatu jadi lencana 2 → padang rumput */
  const gabung = cin(f, tG.gabung);
  const isiHilang = cin(f, tG.gabung); // isi pudar 60 f bersamaan panel menyatu (dulu 30 f)
  const duaP = popIn(f, tG.dua);
  const bukaH = cin(f, tG.buka);
  /* I: terbelah */
  const belah = cin(f, tI.belah), penuh = cin(f, tI.penuh);
  const xBatas = lerp(1920, 960, belah) * (1 - penuh); // tepi kanan belahan padang rumput
  /* K: TIGA CAKRAM dari lingkaran "kamu" (Simon 27 Okt sore: "ini gunakan shape lingkaran transisinya") → ruang tamu; dulu lingkaran "kamu" membuka */
  const tCK = tJ.buka - 30;
  const rCK = (k: number) => 2100 * cin(f, tCK + 3 * k + 30);
  const hpK = cin(f, T.karena + 50);
  const cekK = [T.berpikir, T.langkah, T.jauh + 6].map((t) => popIn(f, t));
  /* KOTAK NAIK ke Scene 05 (BilahKeluar ST-02; Simon 27 Okt sore: "Transisi ke adegan selanjutnya gunakan shape kotak yang swipe keatas (cek video TA)"):
   * bilah layar penuh turkis naik 1080 → 0 (40 f), bilah turkis muda 16 f kemudian, lalu LATAR Scene 05 naik menutup keduanya (60 f mulai f+30) —
   * semua inOut cubic; selesai tepat saat Scene 04 berhenti digambar (AKHIR + 70). Dulu: adegan akhir terdorong ke kiri. */
  const B0 = AKHIR - 20;

  const fase = f < B1 + 61 ? 'kota' : f < tG.buka + 30 ? 'panel' : f < tCK + 66 ? 'pasar' : 'akhir';

  return (
    <>
      {/* ═════ A–C · kota + tokoh (masker dari lingkaran otak; terdorong ke kiri di C) ═════ */}
      {fase === 'kota' ? (
        <>
          {/* lingkaran otak akhir Scene 03 (di BAWAH cakram) */}
          {!cakramPenuh && otakS03 > 0 ? (
            <>
              <Bulat x={960} y={OTAK_S03_Y} d={220} warna={B.blue} ikon="otak" p={1} ikonP={otakS03} />
              <Lencana x={960} y={OTAK_S03_Y} d={220} p={otakS03} warna={B.turq} ikon="hematEnergi" besar={70} />
            </>) : null}
          {!cakramPenuh ? (
            <>
              {[B.turq, B.turqLite].map((w, k) => rCakramA(k) > 0.5 ? (
                <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 4200, height: 4200, borderRadius: '50%', background: w, transformOrigin: 'center',
                  transform: `translate3d(${960 - 2100}px, ${OTAK_S03_Y - 2100}px, 0) scale(${rCakramA(k) / 2100})` }} />) : null)}
              {rCakramA(2) > 0.5 ? <MaskerBulat cx={960} cy={OTAK_S03_Y} d={2 * rCakramA(2)}><AdeganTokohHp f={f} /></MaskerBulat> : null}
            </>) : (
            // adegan lama (ruang tamu + otak + ponsel) ikut naik saat bilah menutupnya
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: f > B1 ? `translate3d(0, ${naikLama(B1)}px, 0)` : undefined }}>
              <AdeganTokohHp f={f} />
              {otakB > 0 ? (
                <>
                  {/* otak di KANAN-ATAS kepala (dulu tepat di atas, 200 px — tokoh diperbesar 1,23 → lingkaran menyentuh tepi atas frame) */}
                  <Pendar x={kp[0] + 165} y={kp[1] - 75} d={110} s={cin(f, tB.cek)} warna={B.blue} skala={skalaPop(otakB)} />
                  <Bulat x={kp[0] + 165} y={kp[1] - 75} d={110} warna={B.blue} ikon="otak" p={otakB} />
                </>) : null}
              {hpMasuk > 0 ? <PonselInfo f={f} x={HPX} y={HPY + SWIPE * (1 - hpMasuk)} rot={-45 * (1 - hpMasuk)} /> : null}
            </div>)}
        </>) : null}
      {/* ruang tamu → panel PE: bilah turkis · turkis muda */}
      {f >= B1 && f < B1 + 90 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, background: B.turq, transform: `translate3d(0, ${naikBilah(B1)}px, 0)` }} />
          <div style={{ position: 'absolute', inset: 0, background: B.turqLite, transform: `translate3d(0, ${naikBilah(B1 + 16)}px, 0)` }} />
          {f >= B1 + 30 ? <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `translate3d(0, ${naikBilah(B1 + 30)}px, 0)` }}>
            <Backdrop f={f} /></div> : null}
        </>) : null}

      {/* ═════ D–G · tiga panel konteks — panel PE naik bersama lapis 3 kotak naik (isi sudah utuh), ROE & tema pop di katanya ═════ */}
      {fase === 'kota' || fase === 'panel' ? [0, 1, 2].map((k) => {
        if (k === 0 && f < B1 + 30) return null;
        const pop = k === 0 ? 1 : popIn(f, PANEL_T[k] + GESER);
        if (pop <= 0 || bukaH > 0) return null;
        const x0 = xPanel(k, f), y0 = PANEL.y + (k === 0 && f < B1 + 90 ? naikBilah(B1 + 30) : 0);
        const x = lerp(x0, 960, gabung), y = lerp(y0, PANEL.y, gabung), w = lerp(PANEL.w, D_DUA, gabung), h = lerp(PANEL.h, D_DUA, gabung);
        const sudut = gabung > 0 ? lerp(32, D_DUA / 2, gabung) : 32;
        const warna = mixHex([B.blue, B.turq, B.orange][k], B.blue, gabung);
        const isi = 1 - isiHilang;
        return (
          <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: sudut, background: B.white, overflow: 'hidden',
            border: `${SISI}px solid ${warna}`, boxSizing: 'border-box', transformOrigin: 'center',
            transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) scale(${skalaPop(pop)})`, boxShadow: bayanganDengan(warna, 1) }}>
            {isi > 0 ? <div style={{ position: 'absolute', left: (w - PANEL.w) / 2, top: (h - PANEL.h) / 2, width: PANEL.w, height: PANEL.h, opacity: isi < 1 ? isi : undefined }}>
              {k === 0 ? <PanelPE f={f} /> : k === 1 ? <PanelROE f={f} /> : <PanelTema f={f} />}</div> : null}
          </div>);
      }) : null}
      {/* lencana gabungan "02" (masalah kedua) → membuka jadi padang rumput; angka memudar saat lingkaran mulai membuka */}
      {(fase === 'panel' && f >= tG.pra) || (fase === 'pasar' && xBatas > 0) ? (
        <JendelaPadang f={f} mode={fase === 'pasar' ? 'belah' : bukaH > 0 ? 'bulat' : 'pra'} cy={lerp(PANEL.y, 540, bukaH)} d={lerp(D_DUA, 2400, bukaH)}
          putih={1 - bukaH} x1={fase === 'pasar' ? xBatas : 1920} geser={fase === 'pasar' ? -480 * belah - 960 * penuh : 0} />) : null}
      {fase === 'panel' && duaP > 0 && cin(f, tG.buka) < 1 ? (
        <div style={{ position: 'absolute', left: 960 - 100, top: PANEL.y - 50, width: 200, height: 100, display: 'grid', placeItems: 'center', fontFamily: F,
          fontSize: D_DUA * 0.4, fontWeight: 800, letterSpacing: '.02em', lineHeight: 1, color: B.blue, opacity: 1 - cin(f, tG.buka),
          transform: `scale(${skalaPop(duaP)})` }}>02</div>) : null}

      {/* ═════ H–J · padang rumput | pasar ═════ */}
      {fase === 'pasar' ? (
        <>
          {/* pra-gambar isi pasar sebelum layar terbelah (dekode pertama) */}
          {belah <= 0 ? <div style={{ position: 'absolute', inset: 0, opacity: 0.002 }}><PasarIsi f={f} cx={1440} lebar={960} /></div> : null}
          {/* pasar: latar terang + isi (pusat belahan kanan → tengah layar saat penuh) */}
          <Belah x0={xBatas} x1={1920}>
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${B.turqWash} 0%, ${B.white} 70%)` }} />
            <PasarIsi f={f} cx={lerp(1440, 960, penuh)} lebar={lerp(960, 1920, penuh)} />
          </Belah>
          {belah > 0 && xBatas > 0 && xBatas < 1920 ? <div style={{ position: 'absolute', left: xBatas - 4, top: 0, width: 8, height: 1080, background: B.white }} /> : null}
        </>) : null}

      {/* ═════ K · tiga cakram dari lingkaran "kamu" → ruang tamu ═════ */}
      {fase === 'pasar' && f >= tCK ? (
        <>
          {[B.turq, B.turqLite].map((w, k) => rCK(k) > 0.5 ? (
            <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 4200, height: 4200, borderRadius: '50%', background: w, transformOrigin: 'center',
              transform: `translate3d(${KAMU_J[0] - 2100}px, ${KAMU_J[1] - 2100}px, 0) scale(${rCK(k) / 2100})` }} />) : null)}
          {rCK(2) > 0.5 ? <MaskerBulat cx={KAMU_J[0]} cy={KAMU_J[1]} d={2 * rCK(2)}><AdeganTokohHp f={f} /></MaskerBulat> : null}
        </>) : null}
      {fase === 'akhir' ? (
        <>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: f > B0 ? `translate3d(0, ${naikLama(B0)}px, 0)` : undefined }}>
            <AdeganTokohHp f={f} />
          </div>
          {/* di atas tokoh (kiri) — dulu di tengah atas menimpa ujung hp */}
          {/* kotak teks ikut naik bersama adegan (keluarnya tertutup bilah: bilah 1 menutup layar di B0 + 40) */}
          <div style={{ position: 'absolute', inset: 0, transform: f > B0 ? `translate3d(0, ${naikLama(B0)}px, 0)` : undefined }}>
            {/* Simon 28 Okt: "kecilkan text diatas char" → huruf 52 → 40 (kotak ikut mengecil), pusat-x = kepala tokoh (dulu pinggul x 700) */}
            <KotakTeks f={f} at={T.angka - 20} keluar={B0 + 60} x={X_KEPALA_K} y={94} size={40} teks="Satu angka bukan analisis lengkap." /></div>
        </>) : null}
      {/* (di atas adegan akhir) hp K masuk SAAT lingkaran "kamu" masih membuka — dulu baru digambar di fase akhir → muncul setengah jalan (pindai f11119) */}
      {(fase === 'pasar' || fase === 'akhir') && hpK > 0 ? (
        <PonselInfo f={f} x={HPX} y={HPY + SWIPE * (1 - hpK) + (f > B0 ? naikLama(B0) : 0)} rot={-45 * (1 - hpK)} tahan cekLain={cekK} />) : null}
      {/* kotak naik → Scene 05 */}
      {f >= B0 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, background: B.turq, transform: `translate3d(0, ${naikBilah(B0)}px, 0)` }} />
          <div style={{ position: 'absolute', inset: 0, background: B.turqLite, transform: `translate3d(0, ${naikBilah(B0 + 16)}px, 0)` }} />
          {f >= B0 + 30 ? <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `translate3d(0, ${naikBilah(B0 + 30)}px, 0)` }}>
            <Backdrop f={f} /></div> : null}
        </>) : null}
    </>);
};
