import React from 'react';
import { RS14_MASUK } from './RS14';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, WARNA, io, lerp, rgba, mixHex } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpMiliar } from '../parts/nominal';
import { Bulat, Label, denyut } from '../parts/umum';
import { Kaca, Nomor, Penghubung, geser, MaskerKeluar, durMasker, type Masuk, daratDari } from '../parts/kaca';
import { Foto, Uang } from '../parts/nyata';
import type { KunciIkon } from '../ikon';

/**
 * REVISI SCENE 13 (14 Okt, evaluasi 5 pertanyaan — versi lama: chip teks "Tujuan"/"Profil risiko", ikon produk monitor yang abstrak).
 * Pesan: pilihan jangka panjang disesuaikan tujuan & kemampuan menanggung naik-turun; aset ini terhubung ke perusahaan yang menghasilkan laba & berkembang.
 *   A  "disesuaikan dengan tujuan dan kemampuan kita menghadapi risiko"  KARTU PENGATURAN (ref-08): tujuan (Rumah · Pendidikan · Pensiun, satu dipilih)
 *      + penggeser "siap naik-turun" Rendah · Sedang · Tinggi yang disetel
 *   B  "reksa dana indeks, reksa dana saham, atau saham"  tiga kartu bernomor (ref-21): BANYAK gedung (seluruh pasar) · BEBERAPA gedung pilihan · SATU gedung
 *   C  "terhubung dengan perusahaan"  gedung perusahaan ke depan
 *   D  "menghasilkan pendapatan dan laba"  alur kartu (ref-14): Pendapatan Rp10 M → Laba Rp2 M
 *   E  "menginvestasikan kembali laba itu untuk berkembang"  laba kembali ke perusahaan → pendapatan naik Rp10 M → Rp13 M (Simon 9 Okt: berkembang = nominal)
 */

const [untuk0, pilihannya, disesuaikan, tujuan, kemampuan, menghadapi, risiko, misalnya, reksa, reksa2, investasi, kenapa, karena, asetAset, , terhubung, perusahaan,
  yang, menghasilkan, pendapatan, dan, laba, lalu, menginvestasikan, kembali, itu, untuk, berkembang] = urut([
  'untuk', 'pilihannya', 'disesuaikan', 'tujuan', 'kemampuan', 'menghadapi', 'risiko', 'misalnya', 'reksa', 'reksa', 'investasi', 'kenapa', 'karena', 'aset-aset',
  'biasanya', 'terhubung', 'perusahaan', 'yang', 'menghasilkan', 'pendapatan', 'dan', 'laba', 'lalu', 'menginvestasikan', 'kembali', 'itu', 'untuk', 'berkembang'], BATAS.s13);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS13_MASUK: Masuk = { x: 960, y: 560, r: 150, warna: B.white, mulai: BATAS.s13 - 20 };
const DARAT = daratDari(RS13_MASUK);

const T = {
  // kartu pengaturan muncul langsung berisi (baris menyusul 20f) — tidak ada kartu kosong
  // (15 Okt, pindai hilang-dom f15673) judul mulai SESUDAH judul Scene 12 habis memudar (isiK 15653–15683): dulu sapuan kata pertama sudah berjalan
  // sebelum scene ini terpasang → "Uang" muncul seketika di opasitas 0,68, menumpuk di atas judul Scene 12 yang masih 30 %
  judul: Math.max(untuk0, BATAS.s13 + 40), setel: DARAT + 30, baris1: DARAT + 10, pilih: tujuan + 10, baris2: DARAT + 16, denyutPilihan: pilihannya, denyutSesuai: disesuaikan, denyutMampu: kemampuan, denyutMenghadapi: menghadapi, knob: [kemampuan, risiko + 10],
  keluarA: misalnya - 20, kartu: [reksa, reksa2, investasi],
  // C: kartu memudar, gambar produk ke kolom kiri, gedung muncul di kanan, garis menyambung ("terhubung dengan perusahaan")
  // gambar produk pindah ke kolom DULU ("aset-aset"), gedung muncul sesudahnya di ruang yang sudah kosong (tidak menimpa gambar Saham)
  // (15 Okt, pindai lokal f16814–16822) dulu +20: pop mulai saat kolom baru 35 % → gedung menimpa gambar Saham 10 frame. +32 = jarak ≥ 180 px
  c: kenapa + 10, gedung: asetAset + 32, kolom: asetAset, garis: [terhubung - 6, terhubung + 4, terhubung + 14], labelGedung: perusahaan,
  // D–E: siklus. Simpul muncul di katanya; uang berjalan dari simpul ke simpul; busur tergambar di belakang uang
  keluarC: yang, simpul: [pendapatan - 10, laba - 10, menginvestasikan - 10, itu - 10],
  jalan: [[menghasilkan, pendapatan + 20], [dan - 10, laba + 20], [lalu, menginvestasikan + 30], [kembali - 20, kembali + 30], [itu, berkembang + 10]] as [number, number][],
  busur: [[dan - 10, laba + 20], [lalu, menginvestasikan + 30], [untuk - 10, berkembang + 20], [untuk, berkembang + 30]] as [number, number][],
  naik: [berkembang - 10, berkembang + 30], sub: karena, subSorot: berkembang,
};

// w 960 (dulu 900): baris chip tujuan selebar isinya terukur melewati tepi kanan kartu 2 px (audit 14 Okt) → kartu dilebarkan, isi rata kiri-kanan 250…916
const SET = { w: 960, h: 470, y: 560 };
/** Simon 14 Okt: Scene 12 → 13 "masih dalam konteks yang sama, tapi transisi yang kamu gunakan kurang tepat" → panel grafik Scene 12 BERUBAH BENTUK
 *  jadi kartu pengaturan ini (tanpa masker). Badan kartu di awal Scene 13 (koordinat Scene 13). */
export const S13_KARTU_AWAL = { x: 960, y: SET.y, w: SET.w, h: SET.h };
const TUJUAN: { teks: string; ikon: KunciIkon }[] = [{ teks: 'Rumah', ikon: 'dpRumah' }, { teks: 'Pendidikan', ikon: 'biayaSekolah' }, { teks: 'Pensiun', ikon: 'sofa' }];
// x0/x1: label "Rendah" mulai di kolom isi (x 250 kartu, sama dengan chip) dan "Tinggi" berakhir di padding kanan (44) — rata dengan baris chip
const SLIDER = { x0: 770, x1: 1358, y: 655 };
const KARTU = { x: [470, 960, 1450], y: 540, w: 420, h: 470 }; // pusat frame (ukur 14 Okt: dulu y 610 → +70 px)
const PRODUK = [{ nama: 'Reksa dana indeks', n: 12, kol: 4, s: 50 }, { nama: 'Reksa dana saham', n: 5, kol: 3, s: 64 }, { nama: 'Saham', n: 1, kol: 1, s: 0 }];
const WARNA_P = [WARNA.langit, B.blue, B.orange];
/** C: kolom gambar produk (kiri) ↔ gedung perusahaan (kanan) — susunan selebar 525…1370, berpusat */
const KOL = { x: 600, w: 150, y: [380, 540, 700] };
const GEDUNG_C = { x: 1240, y: 540, w: 260 };
/** D–E (Simon 15 Okt: "buat lingkaran penghubungnya bulat sempurna"): keempat simpul DI ATAS SATU LINGKARAN (pusat = gedung, jari-jari R) pada sudut
 *  −30° · 30° · 150° · 210° (searah jarum jam: Pendapatan → Laba → Investasi kembali → Berkembang); busur = potongan lingkaran yang sama, dipotong supaya
 *  tidak menembus simpul, label, atau pil (≥ 14 px). Sudut ±30° (bukan diagonal ±45°): pada diagonal, pil Pendapatan menempel gedung dan puncak lingkaran
 *  menabrak sub-judul (percobaan pertama, terukur dari render). R 285: puncak lingkaran 40 px di bawah sub-judul, dasar lingkaran 85 px di atas subtitle. */
const SIKLUS = { x: 960, y: 538, R: 285, gedung: 160, d: 92 };
const SUDUT_SIMPUL = [-30, 30, 150, 210];
const simpulXY = (deg: number): [number, number] => [SIKLUS.x + SIKLUS.R * Math.cos((deg * Math.PI) / 180), SIKLUS.y + SIKLUS.R * Math.sin((deg * Math.PI) / 180)];
const SIMPUL: { nama: string; ikon: KunciIkon; warna: string; x: number; y: number; lebarLabel: number }[] = [
  { nama: 'Pendapatan', ikon: 'pendapatan' as KunciIkon, warna: B.blue, lebarLabel: 166 },
  { nama: 'Laba', ikon: 'laba' as KunciIkon, warna: B.orange, lebarLabel: 66 },
  { nama: 'Investasi kembali', ikon: 'investasiKembali' as KunciIkon, warna: B.turq, lebarLabel: 245 },
  { nama: 'Berkembang', ikon: 'bertumbuh' as KunciIkon, warna: WARNA.ungu, lebarLabel: 180 },
].map((s0, k) => { const [x, y] = simpulXY(SUDUT_SIMPUL[k]); return { ...s0, x, y }; });
// lebar label & pil = UKURAN RENDER (diukur dari still 15 Okt, satuan lokal adegan), bukan tebakan
// PIL_DY +12 (15 Okt, audit-tabrakan TEKS-TERTUTUP f17100/f17160): pil Pendapatan & Laba menyentuh label di atasnya 1 px → kini berjarak ±9 px
const LABEL_PX = 28, LABEL_DY = SIKLUS.d / 2 + 26, PIL_DY = SIKLUS.d / 2 + 78, PIL_W = [265, 200];
/** penghalang busur: lingkaran simpul (+14) · kotak label & pil (+14) */
const PENGHALANG = SIMPUL.flatMap((s0, k) => {
  const r: { x0: number; y0: number; x1: number; y1: number }[] = [
    { x0: s0.x - s0.lebarLabel / 2 - 14, y0: s0.y + LABEL_DY - LABEL_PX * 0.6 - 14, x1: s0.x + s0.lebarLabel / 2 + 14, y1: s0.y + LABEL_DY + LABEL_PX * 0.6 + 14 }];
  if (k < 2) r.push({ x0: s0.x - PIL_W[k] / 2 - 14, y0: s0.y + PIL_DY - 22 - 14, x1: s0.x + PIL_W[k] / 2 + 14, y1: s0.y + PIL_DY + 22 + 14 });
  return r;
});
const bebas = (deg: number) => {
  const [x, y] = simpulXY(deg);
  if (SIMPUL.some((s0) => Math.hypot(x - s0.x, y - s0.y) < SIKLUS.d / 2 + 14)) return false;
  return !PENGHALANG.some((r) => x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1);
};
/** busur k: dari simpul k ke simpul k+1 (searah jarum jam), potongan bebas terpanjang */
const BUSUR = SUDUT_SIMPUL.map((a0, k) => {
  const a1 = k === SUDUT_SIMPUL.length - 1 ? SUDUT_SIMPUL[0] + 360 : SUDUT_SIMPUL[k + 1]; // sampai simpul berikutnya (busur 60° / 120°)
  let best: [number, number] = [a0, a0], run: number | null = null;
  for (let a = a0; a <= a1 + 0.001; a += 0.25) {
    if (bebas(a)) { if (run === null) run = a; if (a - run > best[1] - best[0]) best = [run, a]; } else run = null;
  }
  const [p0, p1] = [simpulXY(best[0]), simpulXY(best[1])];
  return { d: `M ${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A ${SIKLUS.R} ${SIKLUS.R} 0 0 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`, a0: best[0], a1: best[1] };
});
/** jalur uang: perusahaan → Pendapatan (garis lurus) · Pendapatan → Laba & Laba → Investasi kembali (MENYUSURI lingkaran) · Investasi kembali → perusahaan ·
 *  perusahaan → Berkembang (garis lurus) */
const JALAN: ({ lurus: [number, number, number, number] } | { busur: [number, number] })[] = [
  { lurus: [SIKLUS.x, SIKLUS.y, SIMPUL[0].x, SIMPUL[0].y] },
  { busur: [SUDUT_SIMPUL[0], SUDUT_SIMPUL[1]] },
  { busur: [SUDUT_SIMPUL[1], SUDUT_SIMPUL[2]] },
  { lurus: [SIMPUL[2].x, SIMPUL[2].y, SIKLUS.x, SIKLUS.y] },
  { lurus: [SIKLUS.x, SIKLUS.y, SIMPUL[3].x, SIMPUL[3].y] },
];
const titikJalan = (j: (typeof JALAN)[number], t: number): [number, number] =>
  'busur' in j ? simpulXY(lerp(j.busur[0], j.busur[1], t)) : [lerp(j.lurus[0], j.lurus[2], t), lerp(j.lurus[1], j.lurus[3], t)];

export const RS13: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS14_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s13 || f >= RS14_MASUK.mulai + durMasker) return null;
  const kelA = cin(f, T.keluarA), c = cin(f, T.c);
  // B: kartu yang sudah ada selalu berpusat (geser bertahap saat kartu berikutnya muncul)
  const geserB = 245 * ((1 - cin(f, T.kartu[1] - 24)) + (1 - cin(f, T.kartu[2] - 24)));
  const knob = R(f, T.knob[0], T.knob[1], 0, 1, io);
  // penggeser: Rendah → Tinggi → Sedang (disetel sesuai kemampuan)
  const posKnob = knob < 0.6 ? lerp(0, 1, io(knob / 0.6)) : lerp(1, 0.5, io((knob - 0.6) / 0.4));
  const kol = cin(f, T.kolom), kelC = cin(f, T.keluarC);
  // geser bertahap D: selama simpul hanya di kanan (Pendapatan, Laba) susunan digeser −170 agar berpusat; kembali 0 saat Investasi kembali muncul di kiri
  // mendatar: gedung sendirian di tengah → geser kiri saat Pendapatan (kanan) muncul → kembali 0 saat Investasi kembali (kiri) muncul
  // (15 Okt, ukur-pindai mode ukur di tiap tahap stabil) simpangan dulu: +Pendapatan (+20, −11) · +Laba (+30, 0) · +Investasi kembali (+10, +17) ·
  // lengkap (+9, −2) → geseran tiap tahap dikoreksi sebesar simpangannya (dulu −137/+22 · −137/−42 · 0/−42 · 0/0, perkiraan dari tata letak)
  const cS = T.simpul.map((t) => cin(f, t - 24));
  const gD = lerp(lerp(lerp(lerp(0, -157, cS[0]), -167, cS[1]), -10, cS[2]), -9, cS[3]);
  const yD = lerp(lerp(lerp(lerp(0, 33, cS[0]), -42, cS[1]), -59, cS[2]), 2, cS[3]);
  const naik = R(f, T.naik[0], T.naik[1], 0, 1, io);
  return (
    <MaskerKeluar f={f} mulai={RS14_MASUK.mulai} ke={RS14_MASUK} warna={RS14_MASUK.warna}>
    <AbsoluteFill>
      {/* masuk lewat panel Scene 12 yang berubah bentuk (bukan masker) → tanpa cakram pendaratan */}
      {/* ═════════ A: kartu pengaturan (ref-08) ═════════ */}
      {kelA < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - kelA), transform: geser(0, -50 * kelA) }}>
          <Kaca x={960} y={SET.y} w={SET.w} h={SET.h} p={(f >= DARAT - 6 ? 1 : 0) * (1 + [T.denyutPilihan, T.denyutPilihan + 36, T.denyutPilihan + 145, T.denyutSesuai, T.denyutSesuai + 40, T.denyutMampu].reduce((a, t) => a + denyut(f, t, 0.02), 0))} warna={B.orange} tab="atas" rona={0.4} />
          {/* isi kartu memudar masuk di atas badan kartu yang sudah ada (tanpa pop) */}
          {f >= DARAT ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: SET.w, height: SET.h, transform: geser(960 - SET.w / 2, SET.y - SET.h / 2),
              opacity: Math.min(0.9999, cin(f, DARAT + 15, 30)), fontFamily: F }}>
              <div style={{ position: 'absolute', left: 44, top: 44, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: B.orange, display: 'grid', placeItems: 'center' }}><Icon name="dompet" size={40} color={B.white} /></div>
                <span style={{ fontSize: 38, fontWeight: 800, color: B.night }}>Uang jangka panjang</span>
              </div>
              <div style={{ position: 'absolute', left: 44, right: 44, top: 140, height: 2, background: rgba(B.night, 0.08) }} />
              {/* baris 1: tujuan */}
              <div style={{ position: 'absolute', left: 44, top: 196, fontSize: 30, fontWeight: 800, color: B.gray, opacity: Math.min(0.9999, cin(f, T.baris1, 30)) }}>Tujuan</div>
              {/* chip selebar isinya (Simon 14 Okt: "Pendidikan" dulu terjepit di chip 180 px — ikonnya ikut menyusut), jarak antar-chip 14 px rata,
                  kolom isi mulai x 250 (sama dengan penggeser di bawahnya) dan berhenti sebelum tepi kanan kartu (padding 44) */}
              <div style={{ position: 'absolute', left: 250, right: 44, top: 176, height: 76, display: 'flex', justifyContent: 'space-between' }}>
              {TUJUAN.map((t, k) => {
                const p = popIn(f, T.baris1 + 10 + 8 * k);
                const dipilih = k === 0 ? cin(f, T.pilih, 30) : 0;
                return (
                  <div key={t.teks} style={{ flex: 'none', height: 76, padding: '0 24px 0 20px', borderRadius: 999, boxSizing: 'border-box', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 28, fontWeight: 800, transform: `scale(${p})`, opacity: p <= 0.001 ? 0 : undefined,
                    background: mixHex(B.white, B.orange, dipilih), color: mixHex(B.night, B.white, dipilih), border: `2.5px solid ${mixHex(B.grayLite, B.orange, dipilih)}`,
                    boxShadow: `0 10px 22px -14px ${rgba(B.night, 0.4)}` }}>
                    <Icon name={t.ikon} size={32} color={mixHex(B.orange, B.white, dipilih)} style={{ flex: 'none' }} />{t.teks}
                  </div>);
              })}
              </div>
              {/* baris 2: siap menghadapi naik-turun — penggeser 3 tingkat */}
              <div style={{ position: 'absolute', left: 44, top: 320, fontSize: 30, fontWeight: 800, color: B.gray, lineHeight: 1.1, opacity: Math.min(0.9999, cin(f, T.baris2, 30)) }}>
                Siap<br />naik-turun
              </div>
              {cin(f, T.baris2, 30) > 0.001 ? (
                <div style={{ position: 'absolute', left: 0, top: 0, opacity: Math.min(0.9999, cin(f, T.baris2 + 10, 30)) }}>
                  <div style={{ position: 'absolute', left: SLIDER.x0 - 960 + SET.w / 2, top: 340, width: SLIDER.x1 - SLIDER.x0, height: 12, borderRadius: 6,
                    background: `linear-gradient(90deg, ${B.turqLite}, ${B.orange})` }} />
                  {['Rendah', 'Sedang', 'Tinggi'].map((t, k) => (
                    <React.Fragment key={t}>
                      <div style={{ position: 'absolute', left: SLIDER.x0 - 960 + SET.w / 2 + k * (SLIDER.x1 - SLIDER.x0) / 2 - 8, top: 338, width: 16, height: 16, borderRadius: 8, background: B.white,
                        border: `3px solid ${B.grayLite}`, boxSizing: 'border-box' }} />
                      <div style={{ position: 'absolute', left: SLIDER.x0 - 960 + SET.w / 2 + k * (SLIDER.x1 - SLIDER.x0) / 2, top: 382, transform: 'translateX(-50%)', fontSize: 26,
                        fontWeight: 800, color: Math.abs(posKnob - k / 2) < 0.12 ? B.night : B.gray, whiteSpace: 'nowrap' }}>{t}</div>
                    </React.Fragment>))}
                  <div style={{ position: 'absolute', left: SLIDER.x0 - 960 + SET.w / 2 + posKnob * (SLIDER.x1 - SLIDER.x0) - 24, top: 322, width: 48, height: 48, borderRadius: 24, background: B.white,
                    border: `6px solid ${B.orange}`, boxSizing: 'border-box', boxShadow: `0 8px 16px -6px ${rgba(B.night, 0.4)}` }} />
                </div>) : null}
            </div>) : null}
        </div>) : null}

      {/* ═════════ B: tiga kartu bernomor (badan kartu + nama; gambarnya digambar terpisah di bawah supaya bisa pindah ke kolom C) ═════════ */}
      {c < 0.999 ? PRODUK.map((pr, k) => {
        const p = popIn(f, T.kartu[k]);
        if (p <= 0.001) return null;
        const x = KARTU.x[k] + geserB, atas = KARTU.y - KARTU.h / 2;
        return (
          <div key={pr.nama} style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - c) }}>
            <Kaca x={x} y={KARTU.y} w={KARTU.w} h={KARTU.h} p={p} warna={WARNA_P[k]} tab="atas" rona={0.5} />
            <Nomor x={x - KARTU.w / 2 + 46} y={atas + 46} n={k + 1} warna={WARNA_P[k]} p={p} />
            {f >= T.kartu[k] ? (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, atas + 365)} translate(-50%, -50%)`, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night,
                whiteSpace: 'nowrap', opacity: Math.min(0.9999, cin(f, T.kartu[k] + 10, 30)) }}>{pr.nama}</div>) : null}
          </div>);
      }) : null}

      {/* ═════════ C: "aset-aset ini terhubung dengan perusahaan" — gambar ketiga produk keluar dari kartunya ke kolom kiri, garis putus-putus
          menyambung ke gedung perusahaan di kanan (Simon 14 Okt: ide baru, acuan Video 02 Scene 08–09) ═════════ */}
      {kelC < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - kelC), transform: geser(-60 * kelC, 0) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {[0, 1, 2].map((k) => {
              const g = R(f, T.garis[k] - 20, T.garis[k] + 30, 0, 1, io);
              if (g <= 0.001) return null;
              const x0 = KOL.x + KOL.w / 2 + 14, y0 = KOL.y[k], x1 = GEDUNG_C.x - 150, y1 = GEDUNG_C.y + (k - 1) * 70;
              return <Penghubung key={k} d={`M ${x0} ${y0} C ${x0 + 160} ${y0} ${x1 - 160} ${y1} ${x1} ${y1}`} g={g} warna={WARNA_P[k]} tebal={5} />;
            })}
          </svg>
          {PRODUK.map((pr, k) => {
            const p = popIn(f, T.kartu[k] + 20);
            if (p <= 0.001) return null;
            // selama kartu B memudar (c) gambar turun ke garis tengah frame — tidak tertinggal −52 px di atas tengah sebelum pindah ke kolom (pindai 14 Okt)
            const xB = KARTU.x[k] + geserB, yB = lerp(KARTU.y - KARTU.h / 2 + 190, 540, c);
            // (15 Okt, ukur-pindai f16830 −78 px) kolom produk BERPUSAT selama gedung belum muncul, lalu bergeser ke kiri bersama pop gedung (tengah di setiap momen)
            const dxKol = (960 - KOL.x) * kol * (1 - cin(f, T.gedung - 24));
            return <Foto key={pr.nama} k={(['rdIndeks', 'rdSaham', 'saham'] as const)[k]} x={lerp(xB, KOL.x, kol) + dxKol} y={lerp(yB, KOL.y[k], kol)} w={lerp(250, KOL.w, kol)} p={p} />;
          })}
        </div>) : null}

      {/* gedung perusahaan: muncul di kanan (C) → pusat siklus (D–E) */}
      {(() => {
        const p = popIn(f, T.gedung);
        if (p <= 0.001) return null;
        const x = lerp(GEDUNG_C.x, SIKLUS.x + gD, kelC), y = lerp(GEDUNG_C.y, SIKLUS.y + yD, kelC), w = lerp(GEDUNG_C.w, SIKLUS.gedung, kelC);
        const h = w / (389 / 480);
        return (
          <>
            <Foto k="perusahaan" x={x} y={y} w={w} p={p} />
            <Label x={x} y={y + h / 2 + 34} teks="Perusahaan" f={f} at={T.labelGedung} size={lerp(36, 30, kelC)} />
          </>);
      })()}

      {/* ═════════ D–E: siklus di sekeliling perusahaan — Pendapatan → Laba → Investasi kembali → Berkembang (→ pendapatan naik) ═════════ */}
      {kelC > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, transform: geser(gD, yD) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {BUSUR.map((d, k) => {
              const g = R(f, T.busur[k][0], T.busur[k][1], 0, 1, io);
              return g > 0.001 ? <Penghubung key={k} d={d.d} g={g} warna={SIMPUL[k].warna} tebal={5} titik={false} /> : null;
            })}
          </svg>
          {SIMPUL.map((s0, k) => {
            const p = popIn(f, T.simpul[k]);
            if (p <= 0.001) return null;
            return (
              <React.Fragment key={s0.nama}>
                <Bulat x={s0.x} y={s0.y} d={SIKLUS.d} warna={s0.warna} ikon={s0.ikon} p={p} />
                <Label x={s0.x} y={s0.y + LABEL_DY} teks={s0.nama} f={f} at={T.simpul[k] + 8} size={LABEL_PX} lebar={320} />
              </React.Fragment>);
          })}
          <PilNominal x={SIMPUL[0].x} y={SIMPUL[0].y + PIL_DY} teks={`${rpMiliar(10 + 3 * naik, naik > 0.02 ? 1 : 0)} / tahun`} arah={naik} p={popIn(f, T.simpul[0] + 16)} size={24} lebarMin={PIL_W[0]} />
          <PilNominal x={SIMPUL[1].x} y={SIMPUL[1].y + PIL_DY} teks={`${rpMiliar(2, 0)} / tahun`} arah={0} p={popIn(f, T.simpul[1] + 16)} size={24} lebarMin={PIL_W[1]} />
          {/* uang berjalan di siklus: perusahaan → Pendapatan → Laba → Investasi kembali → perusahaan → Berkembang */}
          {JALAN.map((j, k) => {
            const t = R(f, T.jalan[k][0], T.jalan[k][1], 0, 1, io);
            if (t <= 0.001 || t >= 0.999) return null;
            const [x, y] = titikJalan(j, t);
            return <Uang key={k} x={x} y={y} w={96} alfa={R(t, 0, 0.12, 0, 1) * R(t, 0.88, 1, 1, 0)} />;
          })}
        </div>) : null}

      <Judul f={f} kata={['Uang', 'jangka', 'panjang']} at={T.judul} />
      <Judul f={f} kata={['beri', 'ruang', 'lebih', 'besar', 'untuk', 'pertumbuhan']} sorotIdx={5} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
