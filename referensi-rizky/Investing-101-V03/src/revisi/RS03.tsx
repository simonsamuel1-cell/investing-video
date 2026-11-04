import React from 'react';
import { RS04_MASUK } from './RS04';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, io, lerp, mixHex, rgba } from '../theme';
import { WordText, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { Bulat, denyut } from '../parts/umum';
import { Kaca, geser, MaskerKeluar, durMasker, type Masuk, daratDari } from '../parts/kaca';
import { FOTO, Foto, Uang } from '../parts/nyata';
import { DaftarUang, Rute, tinggiDaftar, ujungBaris } from '../parts/rute';
import { rpPenuh } from '../parts/nominal';

/**
 * REVISI SCENE 03 (14 Okt, evaluasi 5 pertanyaan). Pesan: uang dibagi tiga kelompok; tiap kelompok punya tugas & waktu pakai sendiri.
 * Tata letak = TIGA BARIS KARTU BERTAB (ref-10) pada SUMBU WAKTU BERSAMA (seperti jadwal) — panjang batang tiap dompet bisa dibandingkan langsung.
 *   A–B PEMBUKA BARU (Simon 14 Okt, lanjutan "kotak masuk" Scene 02): kartu daftar "Uang saya" (dua baris Scene 02 + empat kebutuhan lain, tiap baris
 *      bertanda kapan dipakai) → "menjadi tiga kelompok": baris DIURUTKAN per waktu pakai, titiknya berwarna kelompok, ada celah antar kelompok →
 *      "uang aktif / stabil / jangka panjang": kartu kelompok muncul di kanan & dua baris kelompoknya dialirkan lewat panah berwarna ke kartu itu
 *   C  "seperti punya tiga dompet"  daftar & panah memudar, ketiga kartu kelompok bergeser ke tengah & melebar (= baris Scene 03), uang → dompet
 *   D  "tugas sendiri … waktu penggunaan yang berbeda"  kartu melebar (isi bergeser bertahap): foto tugas · batang waktu pada sumbu
 *      Sekarang · 1 · 3 · 5 tahun (aktif = sekarang, stabil = 1–3 tahun, jangka panjang = 3 tahun ke atas)
 */

const [paling, kita, membagi, tiga, kelompok, aktif, stabil, jangka, bayangkan, punya, dompet, setiap, tugas, sendiri, waktu, penggunaan, berbeda] = urut([
  'paling', 'kita', 'membagi', 'tiga', 'kelompok', 'aktif', 'stabil', 'jangka', 'bayangkan', 'punya', 'dompet', 'setiap', 'tugas', 'sendiri', 'waktu', 'penggunaan', 'berbeda'], BATAS.s3);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS03_MASUK: Masuk = { x: 960, y: 540, r: 130, warna: B.white, mulai: BATAS.s3 - 20 };
const DARAT = daratDari(RS03_MASUK);

const T = {
  // badan daftar sudah ada sejak penyatuan selesai (RS03_MASUK.mulai + 60); kepala & baris memudar masuk berjenjang (Simon 14 Okt: tanpa masker)
  daftar: DARAT, isi: [DARAT, DARAT + 14, DARAT + 26, DARAT + 38, DARAT + 50, DARAT + 62, DARAT + 74], paling, barisBaru: [paling, paling + 16, kita, kita + 16], urut: tiga, membagi, kelompok, pusat: bayangkan + 10,
  kartu: [aktif - 6, stabil - 6, jangka - 6], nama: [aktif, stabil, jangka],
  judul: bayangkan - 30, dompet: [dompet - 20, dompet, dompet + 20], denyutPunya: punya,
  lebar: [setiap - 20, tugas], lebar2: [waktu - 40, penggunaan], sub: setiap + 10, subSorot: tugas,
  // ketiga foto muncul hampir bersamaan (dulu berjenjang 16f: foto ke-2 masih kecil & baris ke-3 kosong ±0,5 dtk — tangkapan Simon 14 Okt)
  foto: [tugas, tugas + 5, tugas + 10], denyutSendiri: sendiri, sumbu: waktu - 20, batang: [penggunaan - 10, penggunaan + 10, penggunaan + 30],
  denyutBeda: berbeda,
};

const WARNA = [B.blue, B.turq, B.orange];
/** daftar kebutuhan (dua baris pertama = baris Scene 02) · kelompok 0 aktif · 1 stabil · 2 jangka panjang */
const KEBUTUHAN = [
  { judul: 'Tagihan listrik', ket: rpPenuh(450_000), tag: 'bulan depan', g: 0 },
  { judul: 'Tabungan rumah', ket: rpPenuh(6_500_000), tag: '5 tahun lagi', g: 2 },
  { judul: 'Uang sekolah', ket: rpPenuh(15_000_000), tag: '1 tahun lagi', g: 1 },
  { judul: 'Belanja bulanan', ket: rpPenuh(3_000_000), tag: 'minggu depan', g: 0 },
  { judul: 'Dana pensiun', ket: rpPenuh(50_000_000), tag: '20 tahun lagi', g: 2 },
  { judul: 'Ganti kendaraan', ket: rpPenuh(20_000_000), tag: '2 tahun lagi', g: 1 },
];
/** slot sesudah diurutkan: kelompok g di slot g·JARAK_G + {0, 1}. JARAK_G = 200 / 82 → titik tengah dua baris tiap kelompok berjarak 200 px = jarak baris
 *  kartu kelompok (ROW_Y) → dua garis tiap kelompok SIMETRIS, sama bentuk & panjang (Simon 14 Okt "bentuk dan panjang garis penghubungnya harus sama") */
const JARAK_G = 200 / 82;
const SLOT_URUT = KEBUTUHAN.map((k, i) => JARAK_G * k.g + KEBUTUHAN.slice(0, i).filter((x) => x.g === k.g).length);
const EKSTRA_SLOT = 2 * JARAK_G + 2 - 6; // tambahan tinggi daftar sesudah diurutkan (celah antar kelompok)
const LD = { w: 580, baris: 82, x0: 960, x1: 640 };
/** kartu daftar di awal Scene 03 (koordinat LAYAR) = tujuan penyatuan tiga panel Scene 02 */
export const S03_DAFTAR_AWAL = { x: 960, y: 540, w: 580, h: 84 + 6 * 82 + 22 };
const DAFTAR_TINGGI_AKHIR = 84 + (6 + 2 * JARAK_G + 2 - 6) * 82 + 22;
/** tahap KANAN (pembuka): kartu kelompok di kolom kanan, lebih kecil */
// ikon = tepi kiri kartu (1060) + pita 16 + jarak 20 + jari-jari 50 (dulu 1130: hanya 4 px dari pita)
const KANAN = { cx: 1310, w: 500, ikon: 1146, nama: 1226, foto: 1500, teks: 30, d: 100 };
const NAMA = ['Uang Aktif', 'Uang Stabil', 'Uang Jangka Panjang'];
const FOTO_TUGAS = ['belanja', 'tujuan', 'tumbuh'] as const;
/** Simon 14 Okt: "perbesar adegan ini dan tambahkan space visual sekitar 30px" → kartu 150 → 170 tinggi, jarak antarkartu 20 → 30 (baris tiap 200),
 *  uang/dompet 120 → 140, nama 40 → 46 px, jarak uang → nama 30 px (tahap RINGKAS; tahap berikut mengecil halus ke ukuran lamanya) */
const ROW_Y = [375, 575, 775];
const KARTU_H = 170;
// 124 (dulu 140): audit 15 Okt — lingkaran hanya 15 px dari tepi atas/bawah kartu 170 (jarak antarkartu 30) → kini 23 px
const IKON = 124;
/** tata letak bertahap (kartu melebar, isi bergeser, selalu berpusat): RINGKAS (B–C: ikon + nama) → TUGAS (D1: + foto tugas) → LENGKAP (D2: + sumbu waktu) */
// Simon 14 Okt ("nih masih ada"): di tahap TUGAS lingkaran dompet menggantung di tepi kiri kartu (10 px, menimpa pita 16 px) → di SETIAP tahap lingkaran
// = tepi kiri kartu + pita 16 + jarak 30 (pusat = tepi + 108, Ø124), nama 92 px di kanan pusat lingkaran (celah 30), foto tugas 46 px dari tepi kanan kartu (TUGAS)
const RINGKAS = { w: 760, ikon: 960 - 380 + 108, nama: 960 - 380 + 200, foto: 1300, teks: 46 };
const TUGAS = { w: 1080, ikon: 960 - 540 + 108, nama: 960 - 540 + 200, foto: 960 + 540 - 46 - 75, teks: 44 };
const LENGKAP = { w: 1620, ikon: 960 - 810 + 108, nama: 960 - 810 + 200, foto: 870, teks: 40 }; // foto 880 (dulu 860: 16 px dari ujung "Uang Jangka Panjang")
/** sumbu waktu (D): 0 → 1000 px, 5 tahun → 1700 px (linier) */
const X0 = 1000, PER_TAHUN = 140;
const xTahun = (t: number) => X0 + t * PER_TAHUN;
const BATANG: [number, number][] = [[0, 0.6], [1, 3], [3, 5.2]];
const SUMBU = [{ t: 0, teks: 'Sekarang' }, { t: 1, teks: '1 tahun' }, { t: 3, teks: '3 tahun' }, { t: 5, teks: '5 tahun' }];

export const RS03: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS04_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s3 || f >= RS04_MASUK.mulai + durMasker) return null;
  const u0 = cin(f, T.pusat); // kartu kelompok: kolom kanan → tengah (= baris)
  // daftar & garis memudar sambil bergeser ke kiri BERSAMAAN kartu kelompok bergeser ke tengah (dulu daftar habis duluan → kartu sendirian di kanan, ukur f2920)
  const lepas = 1 - u0;
  const urutP = cin(f, T.urut, 80);
  const u1 = R(f, T.lebar[0], T.lebar[1], 0, 1, io), u2 = R(f, T.lebar2[0], T.lebar2[1], 0, 1, io);
  const L = (k: 'w' | 'ikon' | 'nama' | 'foto' | 'teks') => lerp(lerp(lerp(KANAN[k], RINGKAS[k], u0), TUGAS[k], u1), LENGKAP[k], u2);
  const kx = lerp(KANAN.cx, 960, u0), ikonD = lerp(KANAN.d, IKON, u0);
  // daftar: di tengah (pendaratan masker) → ke kiri saat kartu kelompok pertama muncul (geser bertahap); tumbuh saat baris bertambah & diurutkan
  // pusat daftar 31 px di atas ROW_Y[1] (kepala daftar 84 px di atas baris) → titik tengah kelompok 1 tepat di ROW_Y[1] (kelompok 0/2 di ROW_Y[0]/[2])
  const lx = lerp(LD.x0, LD.x1, cin(f, T.kartu[0] - 10)) - 220 * u0, ly = ROW_Y[1] + (DAFTAR_TINGGI_AKHIR / 2 - (84 + (JARAK_G + 1) * LD.baris));
  const nBaris = 6 + EKSTRA_SLOT * urutP;
  const lh = tinggiDaftar(nBaris, LD.baris);
  const slot = (i: number) => lerp(i, SLOT_URUT[i], urutP);
  const sumbu = cin(f, T.sumbu);
  return (
    <MaskerKeluar f={f} mulai={RS04_MASUK.mulai} ke={RS04_MASUK} warna={RS04_MASUK.warna}>
    <AbsoluteFill>
      {/* pusat frame (ukur 14 Okt: baris B–D dulu +35 px ke bawah) → naik 35; saat sumbu waktu + label tahun muncul di atas, kembali 0 */}
      <div style={{ position: 'absolute', inset: 0, transform: geser(0, lerp(-4, -35, u0) * (1 - sumbu)) }}>
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

      {/* ═════════ pembuka: daftar kebutuhan → tiga kelompok (panah ke kartu kelompok) ═════════ */}
      {lepas > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, lepas) }}>
          {KEBUTUHAN.map((k, i) => {
            const [x0, y0] = ujungBaris(lx, ly, LD.w, lh, slot(i), LD.baris);
            const ke = KEBUTUHAN.slice(0, i).filter((x) => x.g === k.g).length; // baris ke-0/1 dalam kelompoknya
            // (15 Okt, pindai hilang-dom f2934) saat daftar bergeser masuk ke bawah kartu kelompok, ujung rute menyilang → rute memudar sebelum menyilang
            // (dulu sisa rute 55 % hilang seketika di balik pita kartu)
            const x1 = kx - L('w') / 2 + 6;
            return <Rute key={k.judul} x0={x0} y0={y0} x1={x1} y1={ROW_Y[k.g]} warna={WARNA[k.g]} alfa={Math.min(1, Math.max(0, (x1 - x0 - 12) / 60))}
              g={R(f, T.kartu[k.g] - 20 + 10 * ke, T.kartu[k.g] + 30 + 10 * ke, 0, 1, io)} />;
          })}
          <DaftarUang x={lx} y={ly} w={LD.w} h={lh} p={f >= T.daftar - 6 ? 0.99996 : 0} isiAlfa={cin(f, T.isi[0], 30)} judul="Uang saya" ikon="dompet" baris={LD.baris} rows={KEBUTUHAN.map((k, i) => ({
            judul: k.judul, ket: k.ket, tag: k.tag, slot: slot(i), tagP: 1,
            p: cin(f, T.isi[i + 1], 30),
            warna: mixHex(B.grayLite, WARNA[k.g], cin(f, T.urut + 20, 40)),
            sorot: cin(f, T.kartu[k.g] - 10, 30) * (1 - cin(f, T.kartu[k.g] + 70, 30)),
          }))} />
        </div>) : null}

      {[0, 1, 2].map((k) => {
        const kartuP = popIn(f, T.kartu[k]);
        const w = L('w'), xi = L('ikon'), xn = L('nama');
        const y = ROW_Y[k];
        // uang di slot ikon kartu kelompok (sejak kartunya muncul) → masuk dompet di "dompet"; berjarak 30 px dari nama
        const masuk = R(f, T.dompet[k] - 30, T.dompet[k] + 30, 0, 1, io);
        const [b0, b1] = BATANG[k];
        const g = R(f, T.batang[k] - 30, T.batang[k] + 30, 0, 1, io);
        return (
          <React.Fragment key={k}>
            <Kaca x={kx} y={y} w={w} h={KARTU_H} p={kartuP} warna={WARNA[k]} tab="kiri" tabTebal={16} radius={28} />
            <Bulat x={xi} y={y} d={ikonD} warna={WARNA[k]} ikon="dompet" p={popIn(f, T.dompet[k]) * (1 + denyut(f, T.denyutPunya + 6 * k, 0.05) + denyut(f, T.denyutBeda + 6 * k, 0.05))} />
            {kartuP > 0.001 && masuk < 0.999 ? (
              <Uang x={xi} y={y} w={ikonD * lerp(1, 0.4, masuk)} p={kartuP} alfa={R(masuk, 0.6, 1, 1, 0)} />) : null}
            {f >= T.nama[k] - 30 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(xn, y - L('teks') * 0.62), whiteSpace: 'nowrap' }}>
                <WordText halus f={f} at={T.nama[k]} style={{ fontFamily: F, fontSize: L('teks'), fontWeight: 800, color: B.night }}>{NAMA[k]}</WordText>
              </div>) : null}
            {/* D: foto tugas */}
            {/* tinggi foto SAMA 124 px (dulu lebar sama 150: foto pertumbuhan 146 px tinggi, 12 px dari tepi kartu) */}
            <Foto k={FOTO_TUGAS[k]} x={L('foto')} y={y} w={124 * FOTO[FOTO_TUGAS[k]].r} p={popIn(f, T.foto[k]) * (1 + denyut(f, T.denyutSendiri + 6 * k, 0.05))} />
            {/* D: batang waktu pada sumbu bersama */}
            {g > 0.001 ? (
              // (15 Okt, pindai hilang-dom f3205) batang tumbuh dari PIL 34 px yang memudar masuk — dulu dari lebar 0: tampil sebagai garis tegak 2 px berkedip
              <div style={{ position: 'absolute', left: 0, top: 0, height: 34, borderRadius: 17, background: WARNA[k], width: Math.max(34, (xTahun(b1) - xTahun(b0)) * g),
                transform: geser(xTahun(b0), y - 17), boxShadow: `0 10px 22px -10px ${WARNA[k]}`, opacity: Math.min(0.9999, R(g, 0, 0.2, 0, 1)) }} />) : null}
            {/* panah oranye di ujung batang Uang Jangka Panjang DIHAPUS (Simon 14 Okt) */}
          </React.Fragment>);
      })}
      </div>
      <Judul f={f} kata={['Tiga', 'jenis', 'uang']} at={T.judul} />
      <Judul f={f} kata={['tiga', 'tugas', 'berbeda']} sorotIdx={1} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
