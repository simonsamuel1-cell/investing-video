import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, CEK, F, io, mixHex, R, rgba } from '../theme';
import { cin, Icon, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip } from '../parts/umum';
import { Chevron, Kaca, KarakterLingkar, Nomor, PoseKarakter } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan, kipasKerumunan } from '../parts/jalur';
import { KunciIkon } from '../ikon';
import { PetaKembali } from './PetaKembali';
import { S06_PESAWAT_E } from '../s06/Scene06';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 07 — Jalur Kebanyakan Investor: Tiga Langkah (BATAS.s7 – BATAS.s8). RELAYOUT 22 Okt (Simon: "secara layout aku masih kurang puas",
 * judul TIDAK ditambahkan) — 04_Asset/Rencana-Relayout-V05.md (ref 05 / V03 6:21).
 *  A tiga kendaraan "digabung" → menyatu jadi investor ("Kebanyakan investor")
 *  B–D TIGA KARTU LANGKAH besar berjajar naik seperti tangga (01 Bangun fondasi · 02 Naik feri · 03 Latihan terbang), chevron di antaranya;
 *    kartu yang dibahas disorot (tepi + sedikit lebih besar), lainnya surut; isi tiap langkah TUMBUH DI KARTUNYA SENDIRI dan tetap tinggal
 *    (dulu: kepala kecil + satu panel lebar yang sebagian besar kosong)
 *  E "jangan dibalik": semua kartu menyala + panah urutan di atas kartu · "Fondasi dulu. Naik feri. Baru belajar terbang." → investor melompat
 *    dari kartu ke kartu.
 * Ikon/chip = pop easeOutBack; kartu/teks/orang = swipe up; garis = trim path; 60f dipusatkan di kata, stagger 20f.
 */
const A0 = BATAS.s7;
const KATA = ['digabung', 'jalur', 'kebanyakan', 'investor', 'tiga', 'langkah', 'pertama', 'uang', 'instrumen', 'relatif',
  'kedua', 'naik', 'dana', 'bangun', 'indeks', 'sambil', 'ketiga', 'latihan', 'setelah', 'kemampuan', 'pengalaman', 'berkembang',
  'sebagian', 'memilih', 'fokusnya', 'berkualitas', 'harga',
  // naskah padat 22 Okt sore: peta sungai penutup (dulu Scene 08) masuk ke scene ini
  'sekarang', 'sungai', 'rumah', 'tetap', 'berubah', 'kendaraan', 'kemampuan', 'dibalik', 'fondasi', 'naik', 'terbang'];
const K = ['digabung', 'jalur', 'kebanyakan', 'investor', 'tiga', 'langkahA', 'pertama', 'uang', 'instrumen', 'relatif',
  'langkah2', 'naikFeri', 'dana', 'bangun', 'indeksC', 'sambil', 'langkah3', 'latihan', 'setelah', 'kemampuan', 'pengalaman', 'berkembang',
  'sebagian', 'memilih', 'fokus', 'berkualitas', 'harga',
  'sekarang', 'sungai', 'rumah', 'tetap', 'berubah', 'kendaraan', 'kemampuanB', 'dibalik', 'fondasiB', 'naikB', 'terbangB'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S07_T = T;
export const S07_AKHIR = BATAS.akhir; // scene terakhir isi (S08 reserved) → outro

const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
/** investor pembuka + kipas kerumunan (ukuran sama dengan adegan 5 Scene 04) */
const INV7 = { x: 960, y: 520, D: 220 };
const KERUMUNAN7 = kipasKerumunan(INV7.x, INV7.y);
const LANGKAH: { judul: string; ikon: KunciIkon; warna: string; kendaraan: boolean }[] = [
  { judul: 'Bangun fondasi', ikon: 'fondasi', warna: JALUR_WARNA.jalan, kendaraan: false },
  { judul: 'Naik feri', ikon: 'feri', warna: JALUR_WARNA.feri, kendaraan: true },
  { judul: 'Latihan terbang', ikon: 'pesawat', warna: JALUR_WARNA.pesawat, kendaraan: true },
];
/** kartu langkah SEJAJAR (Simon 24 Okt: "Adegan 3 panel itu buat sejajar saja"; dulu naik seperti tangga 610/555/500) — pusat 497 (di atas subtitle) */
export const KL = { w: 420, h: 540, x: [470, 960, 1450], y: [497, 497, 497] };
/** warna kartu langkah (serah-terima ke Scene 08: kartu → baris ringkasan) */
export const KL_WARNA = [JALUR_WARNA.jalan, JALUR_WARNA.feri, JALUR_WARNA.pesawat];
const atas = (i: number) => KL.y[i] - KL.h / 2;
/** 23 Okt (pola "Pemerintah/Bank" S02, Simon: teks di tengah panel dulu, lalu bergeser ke atas bersamaan isi berikutnya muncul): ikon + judul kartu
 *  DI TENGAH tinggi kartu (kelompok 68…250 → pusat 159; kartu 270) sampai isi pertamanya datang, lalu naik ke tempatnya (60f, bersama garis pemisah) */
const TENGAH_KARTU = KL.h / 2 - 159;
const isiAt = (i: number) => [T.uang, T.dana, T.setelah][i] - 20;
/* A → B (Simon 24 Okt: "Transisi sepanjang scene 7 sangat buruk, banyak jeglek dan tumpang tindih"): investor mengecil keluar sementara lingkaran
 * feri (02) tumbuh DI TEMPATNYA (tengah dulu) → lingkaran 01 & 03 bergeser keluar DARI BALIK lingkaran 02 ke kiri & kanan (memberi ruang) → tiap
 * kartu TUMBUH DARI lingkarannya (poros pop = ikon); lingkaran diserahkan ke kartu saat kartunya utuh. Tak ada dua benda yang bertumpuk terlihat. */
const POP_TENGAH = () => T.tiga + 10;
const GESER_SISI = () => T.tiga + 40;
const popKartu = (f: number, i: number) => popIn(f, i === 1 ? T.tiga + 60 : T.tiga + 95);
const kartuUtuh = (f: number, i: number) => popKartu(f, i) >= 0.9999;

/** batang porsi dana (lokal kartu) — tumbuh kiri → kanan lewat POTONGAN (lebar wadah), bukan scaleX: isi (ikon & teks) tidak ikut gepeng
 *  (Simon 24 Okt sore: "iconnya terlihat aneh" — ikon feri di ruas indeks tergencet saat batang tumbuh) */
const Batang: React.FC<{ x: number; y: number; w: number; h: number; g: number; seg: { warna: string; porsi: number; isi?: React.ReactNode }[] }> = ({ x, y, w, h, g, seg }) =>
  g <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, width: Math.max(h, w * g), height: h, borderRadius: h / 2, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, background: rgba(B.grayLite, 0.6) }}>
      {(() => {
        let acc = 0;
        return seg.map((s, i) => {
          const el = <div key={i} style={{ position: 'absolute', left: acc * w, top: 0, width: s.porsi * w, height: h, background: s.warna, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, overflow: 'hidden', whiteSpace: 'nowrap' }}>{s.isi}</div>;
          acc += s.porsi;
          return el;
        });
      })()}
    </div>
    </div>);

/** SOROT PER BARIS (Simon 24 Okt sore: "highlight perbagian ketika disebutkan" → juga tiap baris di dalam kartu): pita warna kartu di belakang baris
 *  yang sedang disebut; pita yang SAMA berpindah ke baris berikutnya (60f di katanya) dan surut saat kartu berikutnya dibahas. Lokal kartu (y0–y1). */
const BARIS_SOROT = (i: number): { y0: number; y1: number; at: number }[] => [
  [{ y0: 282, y1: 378, at: T.uang }, { y0: 432, y1: 528, at: T.relatif }],
  [{ y0: 280, y1: 412, at: T.dana }, { y0: 434, y1: 490, at: T.sambil }],
  [{ y0: 278, y1: 322, at: T.kemampuan }, { y0: 330, y1: 420, at: T.sebagian - 20 }, { y0: 426, y1: 470, at: T.berkualitas }, { y0: 476, y1: 520, at: T.harga }],
][i];
const SorotBaris: React.FC<{ i: number; f: number; warna: string }> = ({ i, f, warna }) => {
  const b = BARIS_SOROT(i);
  const ujung = [T.langkah2, T.langkah3, T.sekarang - 60][i];
  const a = cin(f, b[0].at) * (1 - cin(f, ujung));
  if (a <= 0.001) return null;
  let y0 = b[0].y0, y1 = b[0].y1;
  for (let k = 1; k < b.length; k++) { const t = cin(f, b[k].at); y0 = lerp(y0, b[k].y0, t); y1 = lerp(y1, b[k].y1, t); }
  return <div style={{ position: 'absolute', left: 16, width: KL.w - 32, top: y0, height: y1 - y0, borderRadius: 14, background: rgba(warna, 0.14 * a),
    boxShadow: `inset 0 0 0 2px ${rgba(warna, 0.35 * a)}` }} />;
};

/** baris ikon + teks (lokal kartu) */
const Baris: React.FC<{ y: number; f: number; at: number; teks: string; children: React.ReactNode }> = ({ y, f, at, teks, children }) => (
  <>
    {children}
    <div style={{ position: 'absolute', left: 128, width: KL.w - 150, top: y - 30, fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night, lineHeight: '30px' }}>
      <WordText f={f} at={at} halus>{teks}</WordText>
    </div>
  </>);

/** ISI kartu langkah (koordinat lokal kartu 420×540) — dipakai Scene 07 dan Scene 08 (isi lama memudar DI DALAM penyatuan kartu → baris,
 *  60f yang sama dengan masuknya isi baris; transisi seragam 22 Okt) */
export const IsiLangkah: React.FC<{ i: number; f: number; tanpaIkon?: boolean }> = ({ i, f, tanpaIkon = false }) => {
  const L = LANGKAH[i];
  const dy = TENGAH_KARTU * (1 - cin(f, isiAt(i)));
  return (
    <>
      <SorotBaris i={i} f={f} warna={L.warna} />
      <Nomor cincin x={52} y={56} n={i + 1} warna={L.warna} p={popIn(f, T.tiga + 120 + i * 20)} d={56} />
      {/* ikon = lingkaran yang dibawa dari investor; tampil di kartu sesudah kartunya utuh (sebelumnya digambar terbang di atas kartu) */}
      {tanpaIkon || !kartuUtuh(f, i) ? null : L.kendaraan ? <Kendaraan x={KL.w / 2} y={128 + dy} d={120} warna={L.warna} ikon={L.ikon} cermin={i === 1} p={1} />
        : <Bulat x={KL.w / 2} y={128 + dy} d={120} warna={L.warna} ikon={L.ikon} p={1} />}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 204 + dy, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.tiga + 125 + i * 20} halus>{L.judul}</WordText>
      </div>
      {/* garis pemisah: trim path kiri → kanan (dulu pudar) */}
      <div style={{ position: 'absolute', left: 36, top: 266, height: 2, width: (KL.w - 72) * cin(f, [T.uang, T.dana, T.setelah][i] - 20), background: rgba(B.night, 0.07) }} />

      {/* 01 fondasi: uang yang nggak boleh bergejolak → instrumen relatif stabil */}
      {i === 0 ? (
        <>
          <Baris y={330} f={f} at={T.uang + 10} teks="Uang yang nggak boleh bergejolak">
            <Bulat x={72} y={330} d={80} warna={B.blue} ikon="dompet" p={popIn(f, T.uang)} />
          </Baris>
          <Chevron x={72} y={405} warna={B.gray} p={popIn(f, T.instrumen)} d={40} arah="bawah" />
          <Baris y={480} f={f} at={T.relatif + 10} teks="Instrumen relatif stabil">
            <Kendaraan x={72} y={480} d={80} warna={JALUR_WARNA.jalan} ikon="jalanKaki" cermin={false} p={popIn(f, T.relatif)} />
          </Baris>
        </>) : null}

      {/* 02 feri: dana jangka panjang → porsi indeks membesar · sambil belajar */}
      {i === 1 ? (() => {
        const porsi = 0.3 + 0.45 * R(f, T.bangun, T.bangun + 60, 0, 1, io);
        return (
          <>
            <div style={{ position: 'absolute', left: 40, top: 292, fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night }}>
              <WordText f={f} at={T.dana} halus>Dana jangka panjang</WordText>
            </div>
            <Batang x={40} y={342} w={KL.w - 80} h={56} g={cin(f, T.dana + 10)} seg={[
              { warna: JALUR_WARNA.feri, porsi, isi: (
                <><Icon name="feri" size={30} color={B.white} style={{ transform: `scaleX(-1) scale(${skalaPop(popIn(f, T.indeksC))})` }} />
                  <span style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: B.white }}><WordText f={f} at={T.indeksC} halus>Indeks</WordText></span></>) },
            ]} />
            <Chip x={KL.w / 2} y={462} teks="Sambil belajar" ikon="kelas" warna={JALUR_WARNA.feri} p={popIn(f, T.sambil)} size={26} />
          </>);
      })() : null}

      {/* 03 terbang: kemampuan berkembang → sebagian kecil dana → fokus kualitas + harga */}
      {i === 2 ? (
        <>
          <Chip x={KL.w / 2} y={300} teks="Kemampuan berkembang" ikon="kemampuan" warna={CEK} p={popIn(f, T.kemampuan)} size={24} />
          <Batang x={40} y={338} w={KL.w - 80} h={42} g={cin(f, T.sebagian - 20)} seg={[
            { warna: JALUR_WARNA.jalan, porsi: 0.3 }, { warna: JALUR_WARNA.feri, porsi: 0.6 },
            { warna: JALUR_WARNA.pesawat, porsi: 0.1 * cin(f, T.sebagian + 20) },
          ]} />
          <div style={{ position: 'absolute', right: 40, top: 388, fontFamily: F, fontSize: 22, fontWeight: 700, color: mixHex(B.gray, B.night, cin(f, T.memilih)), whiteSpace: 'nowrap' }}>
            <WordText f={f} at={T.sebagian + 30} halus>Sebagian kecil · memilih saham</WordText>
          </div>
          <Chip x={KL.w / 2} y={448} teks="Perusahaan berkualitas" ikon="kualitas" warna={B.blue} p={popIn(f, T.berkualitas)} size={24} />
          {/* 24 Okt: 516 → 498 (chip menempel tepi bawah kartu saat kartu disorot) */}
          <Chip x={KL.w / 2} y={498} teks="Harga masuk akal" ikon="valuasi" warna={B.turq} p={popIn(f, T.harga)} size={24} />
        </>) : null}
    </>);
};

/** pusat ikon kartu langkah i (layar) — dibawa ke peta sungai penutup */
const IKON_KARTU = (i: number) => ({ x: KL.x[i], y: atas(i) + 128, d: 120 });

export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 - 40 || f > S07_AKHIR + 90) return null;

  /* ═ A ═ */
  const gabung = cin(f, T.jalur);
  const muridA = popIn(f, T.jalur) * popOut(f, T.tiga - 10); // masuk bersamaan kendaraan menyatu; keluar SEBELUM kartu masuk (tak bertumpuk)
  const bawaPesawat = cin(f, A0 + 30); // pesawat kartu E Scene 06 DIBAWA jadi kendaraan ketiga pembuka
  /* ═ B–D: sorot langkah ═ */
  /* B → peta (Simon 24 Okt "tumpang tindih"): 1 sorot dilepas (semua kartu kembali utuh, skala 1) → 2 ikon kartu DILEPAS dari kartunya (tinggal
   * di tempat) sementara kartu & chevron keluar → 3 baru ikonnya dibawa ke jalurnya di peta sungai (PetaKembali), tanpa menembus kartu */
  const pulih = cin(f, T.sekarang - 60);
  const lepas = f >= T.sekarang - 30;
  const bobot = [cin(f, T.pertama + 40) * (1 - cin(f, T.langkah2)), cin(f, T.langkah2) * (1 - cin(f, T.langkah3)), cin(f, T.langkah3) * (1 - pulih)];
  const mulaiSorot = cin(f, T.pertama + 40) * (1 - pulih);
  const surutK = (i: number) => mulaiSorot * (1 - bobot[i]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A: tiga kendaraan digabung → kebanyakan investor (pesawat = pesawat kartu E Scene 06 yang dibawa) ══ */}
      {[0, 1, 2].map((i) => {
        const pes = i === 2;
        const p = (pes ? 1 : popIn(f, T.digabung + i * 20)) * (1 - gabung);
        if (p <= 0.001 || f < A0) return null;
        const x0 = pes ? lerp(S06_PESAWAT_E.x, 1240, bawaPesawat) : [680, 960, 1240][i];
        const d0 = pes ? lerp(S06_PESAWAT_E.d, 170, bawaPesawat) : 170;
        const x = lerp(x0, 960, gabung);
        return <Kendaraan key={i} x={x} y={520} d={lerp(d0, 120, gabung)} warna={LANGKAH[i].warna} ikon={i === 0 ? 'jalanKaki' : LANGKAH[i].ikon} cermin={i === 1} p={p} />;
      })}
      {/* "kebanyakan investor" = investor + KIPAS 9 ikon orang (pola Scene 01/03/04), BUKAN teks (Simon 24 Okt sore: "ini belum kamu ubah seperti scene
          lain yang membahas kebanyakan investor"); kipas & investor keluar bersama sebelum lingkaran langkah tumbuh */}
      {muridA > 0 ? (
        <>
          {KERUMUNAN7.map((o, i) => <Bulat key={i} x={o.x} y={o.y} d={o.d} warna={B.orangeLite} ikon="orangLain" p={popIn(f, T.kebanyakan + o.urut * 12) * popOut(f, T.tiga - 10)} />)}
          <KarakterLingkar pose={MURID_BIRU} x={INV7.x} y={INV7.y} D={INV7.D} s={muridA} warna={B.orange} />
        </>) : null}

      {/* ══ B–D: tiga kartu langkah SEJAJAR → di "Sekarang" kartu keluar lewat tepi terdekat ══ */}
      {[0, 1].map((i) => <Chevron key={i} x={(KL.x[i] + KL.x[i + 1]) / 2} y={(KL.y[i] + KL.y[i + 1]) / 2} warna={B.blueLite} p={popIn(f, T.tiga + 140 + i * 20) * popOut(f, T.sekarang - 30)} d={50} />)}
      {[0, 1, 2].map((i) => {
        const L = LANGKAH[i];
        const p = popKartu(f, i), kl = popOut(f, T.sekarang);
        if (p <= 0.001 || kl <= 0.001) return null;
        const sorot = bobot[i], surut = surutK(i);
        // sorot = tepi warna + kartu lain surut; tanpa membesar 4 % (Simon 24 Okt siang: "ada gerakan tambahan yang tidak diperlukan")
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, zIndex: sorot > 0.5 ? 1 : 0 }}>
            <Kaca x={KL.x[i]} y={KL.y[i]} w={KL.w} h={KL.h} p={p} keluar={kl} warna={L.warna} tab="atas" tepi={sorot} alfa={1 - 0.5 * surut} poros={[KL.w / 2, 128 + TENGAH_KARTU]}
              arah="bawah" /* ikon kartu tetap tinggal di atas → kartu turun keluar, isinya menjauh dari ikon (naik = seluruh isi lewat di bawah ikon) */>
              <IsiLangkah i={i} f={f} tanpaIkon={lepas} />
            </Kaca>
          </div>);
      })}
      {/* investor DIPECAH lagi jadi tiga lingkaran → ikon kartu langkah 01 · 02 · 03 (kebalikan "digabung"); kartu tumbuh dari lingkarannya,
          lingkaran tetap di atas sampai kartunya utuh lalu diserahkan (ikon sama: fondasi · feri · pesawat) */}
      {[0, 2, 1].map((i) => { // 02 digambar terakhir (di atas): 01 & 03 keluar dari baliknya
        const p = i === 1 ? popIn(f, POP_TENGAH()) : f >= GESER_SISI() - 30 ? 1 : 0;
        if (p <= 0.001 || kartuUtuh(f, i)) return null;
        const t = i === 1 ? 1 : cin(f, GESER_SISI());
        const L = LANGKAH[i];
        const k = IKON_KARTU(i);
        const sifat = { x: lerp(960, k.x, t), y: k.y + TENGAH_KARTU, d: 120, warna: L.warna, ikon: L.ikon, p, alfa: 1 - 0.5 * surutK(i) };
        return L.kendaraan ? <Kendaraan key={i} {...sifat} cermin={i === 1} /> : <Bulat key={i} {...sifat} />;
      })}

      {/* ══ E: "Sekarang kita kembali ke sungai tadi" — peta sungai penutup (ikon kartu DIBAWA ke jalurnya) ══ */}
      <PetaKembali f={f} asal={IKON_KARTU} T={{ sekarang: T.sekarang, sungai: T.sungai, rumah: T.rumah, tetap: T.tetap, berubah: T.berubah, kendaraan: T.kendaraan,
        kemampuanB: T.kemampuanB, jalan: T.fondasiB, naik: T.naikB, terbang: T.terbangB }} />
    </AbsoluteFill>);
};
