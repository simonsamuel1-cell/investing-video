import React from 'react';
import { RS04_MASUK } from './RS04';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, io, lerp, rgba } from '../theme';
import { WordText, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { Bulat, denyut } from '../parts/umum';
import { Kaca, geser, MaskerKeluar, durMasker, type Masuk, daratDari, CakramDarat } from '../parts/kaca';
import { Foto, Uang } from '../parts/nyata';

/**
 * REVISI SCENE 03 (14 Okt, evaluasi 5 pertanyaan). Pesan: uang dibagi tiga kelompok; tiap kelompok punya tugas & waktu pakai sendiri.
 * Tata letak = TIGA BARIS KARTU BERTAB (ref-10) pada SUMBU WAKTU BERSAMA (seperti jadwal) — panjang batang tiap dompet bisa dibandingkan langsung.
 *   A  "membagi uang menjadi tiga kelompok"  satu tumpukan besar di tengah terbagi tiga (bertumpuk vertikal, tetap berpusat)
 *   B  "uang aktif, uang stabil, dan uang jangka panjang"  kartu bertab warna + nama muncul di katanya
 *   C  "seperti punya tiga dompet"  tiap tumpukan masuk ke dompetnya
 *   D  "tugas sendiri … waktu penggunaan yang berbeda"  kartu melebar (isi bergeser bertahap): foto tugas · batang waktu pada sumbu
 *      Sekarang · 1 · 3 · 5 tahun (aktif = sekarang, stabil = 1–3 tahun, jangka panjang = 3 tahun ke atas)
 */

const [membagi, tiga, kelompok, aktif, stabil, jangka, bayangkan, punya, dompet, setiap, tugas, sendiri, waktu, penggunaan, berbeda] = urut([
  'membagi', 'tiga', 'kelompok', 'aktif', 'stabil', 'jangka', 'bayangkan', 'punya', 'dompet', 'setiap', 'tugas', 'sendiri', 'waktu', 'penggunaan', 'berbeda'], BATAS.s3);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS03_MASUK: Masuk = { x: 960, y: 540, r: 130, warna: B.white, mulai: BATAS.s3 - 20 };
const DARAT = daratDari(RS03_MASUK);

const T = {
  tumpuk: DARAT + 30, bagi: membagi + 40, denyutTiga: [tiga - 10, tiga + 6, kelompok],
  kartu: [aktif - 6, stabil - 6, jangka - 6], nama: [aktif, stabil, jangka],
  judul: bayangkan - 30, dompet: [dompet - 20, dompet, dompet + 20], denyutPunya: punya,
  lebar: [setiap - 20, tugas], lebar2: [waktu - 40, penggunaan], sub: setiap + 10, subSorot: tugas,
  foto: [tugas, tugas + 16, tugas + 32], denyutSendiri: sendiri, sumbu: waktu - 20, batang: [penggunaan - 10, penggunaan + 10, penggunaan + 30],
  denyutBeda: berbeda,
};

const WARNA = [B.blue, B.turq, B.orange];
const NAMA = ['Uang Aktif', 'Uang Stabil', 'Uang Jangka Panjang'];
const FOTO_TUGAS = ['belanja', 'tujuan', 'tumbuh'] as const;
/** Simon 14 Okt: "perbesar adegan ini dan tambahkan space visual sekitar 30px" → kartu 150 → 170 tinggi, jarak antarkartu 20 → 30 (baris tiap 200),
 *  uang/dompet 120 → 140, nama 40 → 46 px, jarak uang → nama 30 px (tahap RINGKAS; tahap berikut mengecil halus ke ukuran lamanya) */
const ROW_Y = [375, 575, 775];
const KARTU_H = 170;
const IKON = 140;
/** tata letak bertahap (kartu melebar, isi bergeser, selalu berpusat): RINGKAS (B–C: ikon + nama) → TUGAS (D1: + foto tugas) → LENGKAP (D2: + sumbu waktu) */
const RINGKAS = { w: 760, ikon: 712, nama: 812, foto: 1300, teks: 46 };
const TUGAS = { w: 1080, ikon: 500, nama: 600, foto: 1380, teks: 44 };
const LENGKAP = { w: 1620, ikon: 255, nama: 355, foto: 860, teks: 40 };
/** sumbu waktu (D): 0 → 1000 px, 5 tahun → 1700 px (linier) */
const X0 = 1000, PER_TAHUN = 140;
const xTahun = (t: number) => X0 + t * PER_TAHUN;
const BATANG: [number, number][] = [[0, 0.6], [1, 3], [3, 5.2]];
const SUMBU = [{ t: 0, teks: 'Sekarang' }, { t: 1, teks: '1 tahun' }, { t: 3, teks: '3 tahun' }, { t: 5, teks: '5 tahun' }];

export const RS03: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS04_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s3 || f >= RS04_MASUK.mulai + durMasker) return null;
  const bagi = cin(f, T.bagi);
  const u1 = R(f, T.lebar[0], T.lebar[1], 0, 1, io), u2 = R(f, T.lebar2[0], T.lebar2[1], 0, 1, io);
  const L = (k: 'w' | 'ikon' | 'nama' | 'foto' | 'teks') => lerp(lerp(RINGKAS[k], TUGAS[k], u1), LENGKAP[k], u2);
  const sumbu = cin(f, T.sumbu);
  return (
    <MaskerKeluar f={f} mulai={RS04_MASUK.mulai} ke={RS04_MASUK} warna={RS04_MASUK.warna}>
    <AbsoluteFill>
      <CakramDarat f={f} ke={RS03_MASUK} />
      {/* pusat frame (ukur 14 Okt: baris B–D dulu +35 px ke bawah) → naik 35; saat sumbu waktu + label tahun muncul di atas, kembali 0 */}
      <div style={{ position: 'absolute', inset: 0, transform: geser(0, -35 * (1 - sumbu)) }}>
      {/* sumbu waktu bersama (D): label tahun di atas + garis tegak tipis menembus baris */}
      {sumbu > 0.001 ? (
        <>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, sumbu) }}>
            {SUMBU.map(({ t }) => <line key={t} x1={xTahun(t)} x2={xTahun(t)} y1={ROW_Y[0] - KARTU_H / 2 - 28} y2={ROW_Y[2] + KARTU_H / 2 + 10}
              stroke={rgba(B.night, 0.16)} strokeWidth={2.5} strokeDasharray="7 11" strokeLinecap="round" />)}
          </svg>
          {SUMBU.map(({ t, teks }) => (
            <div key={t} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(xTahun(t), ROW_Y[0] - KARTU_H / 2 - 52)} translate(-50%, -50%)`, fontFamily: F, fontSize: 28,
              fontWeight: 800, color: B.night, whiteSpace: 'nowrap', opacity: Math.min(0.9999, sumbu) }}>{teks}</div>))}
        </>) : null}

      {[0, 1, 2].map((k) => {
        const kartuP = popIn(f, T.kartu[k]);
        const w = L('w'), xi = L('ikon'), xn = L('nama');
        const y = ROW_Y[k];
        // A: tumpukan — mulai satu di tengah, terbagi ke posisi ikon baris; C: masuk dompet
        // tumpukan tetap di sumbu tengah sampai kartunya muncul, lalu bergeser ke posisi ikon (geser bertahap per baris)
        // lebar tumpukan di baris = IKON (= Ø dompet), berjarak 30 px dari nama (tumpang tindih 14 Okt diperbaiki)
        const ax = lerp(960, RINGKAS.ikon, cin(f, T.kartu[k] - 30)), ay = lerp(575, y, bagi), aw = lerp(360, IKON, bagi);
        const masuk = R(f, T.dompet[k] - 30, T.dompet[k] + 30, 0, 1, io);
        const tampilTumpuk = k === 1 || bagi > 0.001;
        const [b0, b1] = BATANG[k];
        const g = R(f, T.batang[k] - 30, T.batang[k] + 30, 0, 1, io);
        return (
          <React.Fragment key={k}>
            <Kaca x={960} y={y} w={w} h={KARTU_H} p={kartuP} warna={WARNA[k]} tab="kiri" tabTebal={16} radius={28} />
            <Bulat x={xi} y={y} d={IKON} warna={WARNA[k]} ikon="dompet" p={popIn(f, T.dompet[k]) * (1 + denyut(f, T.denyutPunya + 6 * k, 0.05) + denyut(f, T.denyutBeda + 6 * k, 0.05))} />
            {tampilTumpuk && masuk < 0.999 ? (
              <Uang x={masuk > 0 ? xi : ax} y={masuk > 0 ? y : ay} w={(masuk > 0 ? IKON : aw) * lerp(1, 0.4, masuk) * (1 + denyut(f, T.denyutTiga[k], 0.07))}
                p={k === 1 ? popIn(f, T.tumpuk) : 1} alfa={R(masuk, 0.6, 1, 1, 0)} />) : null}
            {f >= T.nama[k] - 30 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(xn, y - L('teks') * 0.62), whiteSpace: 'nowrap' }}>
                <WordText halus f={f} at={T.nama[k]} style={{ fontFamily: F, fontSize: L('teks'), fontWeight: 800, color: B.night }}>{NAMA[k]}</WordText>
              </div>) : null}
            {/* D: foto tugas */}
            <Foto k={FOTO_TUGAS[k]} x={L('foto')} y={y} w={150} p={popIn(f, T.foto[k]) * (1 + denyut(f, T.denyutSendiri + 6 * k, 0.05))} />
            {/* D: batang waktu pada sumbu bersama */}
            {g > 0.001 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, height: 34, borderRadius: 17, background: WARNA[k], width: (xTahun(b1) - xTahun(b0)) * g,
                transform: geser(xTahun(b0), y - 17), boxShadow: `0 10px 22px -10px ${WARNA[k]}` }} />) : null}
            {/* panah oranye di ujung batang Uang Jangka Panjang DIHAPUS (Simon 14 Okt) */}
          </React.Fragment>);
      })}
      </div>
      <Judul f={f} kata={['Tiga', 'jenis', 'uang']} at={T.judul} />
      <Judul f={f} kata={['tiga', 'tugas', 'berbeda']} sorotIdx={1} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
