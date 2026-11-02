import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, CEK, F, io, mixHex, R, rgba } from '../theme';
import { ArahKeluar, cin, Icon, lerp, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label } from '../parts/umum';
import { Chevron, Kaca, KarakterLingkar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { KunciIkon } from '../ikon';
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
  'sebagian', 'memilih', 'fokusnya', 'berkualitas', 'harga', 'tiga', 'dibalik', 'fondasi', 'feri', 'terbang'];
const K = ['digabung', 'jalur', 'kebanyakan', 'investor', 'tiga', 'langkahA', 'pertama', 'uang', 'instrumen', 'relatif',
  'langkah2', 'naikFeri', 'dana', 'bangun', 'indeksC', 'sambil', 'langkah3', 'latihan', 'setelah', 'kemampuan', 'pengalaman', 'berkembang',
  'sebagian', 'memilih', 'fokus', 'berkualitas', 'harga', 'tigaE', 'dibalik', 'fondasi', 'feri', 'terbang'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S07_T = T;
export const S07_AKHIR = BATAS.s8;

const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const LANGKAH: { judul: string; ikon: KunciIkon; warna: string; kendaraan: boolean }[] = [
  { judul: 'Bangun fondasi', ikon: 'fondasi', warna: JALUR_WARNA.jalan, kendaraan: false },
  { judul: 'Naik feri', ikon: 'feri', warna: JALUR_WARNA.feri, kendaraan: true },
  { judul: 'Latihan terbang', ikon: 'pesawat', warna: JALUR_WARNA.pesawat, kendaraan: true },
];
/** kartu langkah: naik ke kanan seperti tangga (pusat isi ±540) */
export const KL = { w: 420, h: 540, x: [470, 960, 1450], y: [610, 555, 500] }; // investor di kartu 03 tetap di kiri logo watermark
/** warna kartu langkah (serah-terima ke Scene 08: kartu → baris ringkasan) */
export const KL_WARNA = [JALUR_WARNA.jalan, JALUR_WARNA.feri, JALUR_WARNA.pesawat];
const atas = (i: number) => KL.y[i] - KL.h / 2;

/** batang porsi dana (lokal kartu) */
const Batang: React.FC<{ x: number; y: number; w: number; h: number; g: number; seg: { warna: string; porsi: number; isi?: React.ReactNode }[] }> = ({ x, y, w, h, g, seg }) =>
  g <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: h / 2, overflow: 'hidden', background: rgba(B.grayLite, 0.6),
      transform: `scaleX(${g})`, transformOrigin: 'left center' }}>
      {(() => {
        let acc = 0;
        return seg.map((s, i) => {
          const el = <div key={i} style={{ position: 'absolute', left: acc * w, top: 0, width: s.porsi * w, height: h, background: s.warna, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, overflow: 'hidden', whiteSpace: 'nowrap' }}>{s.isi}</div>;
          acc += s.porsi;
          return el;
        });
      })()}
    </div>);

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
export const IsiLangkah: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const L = LANGKAH[i];
  return (
    <>
      <Nomor x={52} y={56} n={i + 1} warna={L.warna} p={popIn(f, T.langkahA + i * 20 + 10)} d={56} />
      {L.kendaraan ? <Kendaraan x={KL.w / 2} y={128} d={120} warna={L.warna} ikon={L.ikon} cermin={i === 1} p={popIn(f, T.langkahA + i * 20 + 10)} />
        : <Bulat x={KL.w / 2} y={128} d={120} warna={L.warna} ikon={L.ikon} p={popIn(f, T.langkahA + i * 20 + 10)} />}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 204, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
        <WordText f={f} at={T.langkahA + i * 20 + 20} halus>{L.judul}</WordText>
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
                <><Icon name="feri" size={30} color={B.white} style={{ transform: 'scaleX(-1)' }} />
                  <span style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: B.white }}><WordText f={f} at={T.indeksC} halus>Indeks</WordText></span></>) },
            ]} />
            <Chip x={KL.w / 2} y={462} teks="Sambil belajar" ikon="kelas" warna={JALUR_WARNA.feri} p={popIn(f, T.sambil)} size={26} />
          </>);
      })() : null}

      {/* 03 terbang: kemampuan berkembang → sebagian kecil dana → fokus kualitas + harga */}
      {i === 2 ? (
        <>
          <Chip x={KL.w / 2} y={300} teks="Kemampuan berkembang" ikon="kemampuan" warna={CEK} p={popIn(f, T.kemampuan)} size={24} />
          <Batang x={40} y={346} w={KL.w - 80} h={42} g={cin(f, T.sebagian - 20)} seg={[
            { warna: JALUR_WARNA.jalan, porsi: 0.3 }, { warna: JALUR_WARNA.feri, porsi: 0.6 },
            { warna: JALUR_WARNA.pesawat, porsi: 0.1 * cin(f, T.sebagian + 20) },
          ]} />
          <div style={{ position: 'absolute', right: 40, top: 396, fontFamily: F, fontSize: 22, fontWeight: 700, color: mixHex(B.gray, B.night, cin(f, T.memilih)), whiteSpace: 'nowrap' }}>
            <WordText f={f} at={T.sebagian + 30} halus>Sebagian kecil · memilih saham</WordText>
          </div>
          <Chip x={KL.w / 2} y={462} teks="Perusahaan berkualitas" ikon="kualitas" warna={B.blue} p={popIn(f, T.berkualitas)} size={24} />
          <Chip x={KL.w / 2} y={516} teks="Harga masuk akal" ikon="valuasi" warna={B.turq} p={popIn(f, T.harga)} size={24} />
        </>) : null}
    </>);
};

export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f > S07_AKHIR + 90) return null;

  /* ═ A ═ */
  const gabung = cin(f, T.jalur);
  const muridA = popIn(f, T.jalur) * popOut(f, T.langkahA); // transisi seragam 22 Okt: masuk bersamaan kendaraan menyatu, keluar = kartu masuk
  /* ═ B–D: sorot langkah ═ */
  const bobot = [cin(f, T.pertama) * (1 - cin(f, T.langkah2)), cin(f, T.langkah2) * (1 - cin(f, T.langkah3)), cin(f, T.langkah3) * (1 - cin(f, T.tigaE))];
  const mulaiSorot = cin(f, T.pertama) * (1 - cin(f, T.tigaE));
  /* ═ E: investor melompat kartu ke kartu ═ */
  const muridE = popIn(f, T.fondasi - 10) * popOut(f, S07_AKHIR + 30); // keluar bersamaan kartu menyatu jadi baris (S08, cin A0+30)
  const hop = (at: number) => cin(f, at);
  const naik = [hop(T.fondasi), hop(T.feri), hop(T.terbang)];
  const pos = (i: number) => ({ x: KL.x[i] - 50, y: atas(i) - 84 }); // sedikit ke kiri: di kartu 03 berjarak dari logo watermark
  let mx = pos(0).x, my = pos(0).y;
  for (let i = 1; i < 3; i++) {
    const t = naik[i];
    if (t > 0) { mx = lerp(mx, pos(i).x, t); my = lerp(my, pos(i).y, t) - 70 * Math.sin(Math.PI * t); }
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A: tiga kendaraan digabung → kebanyakan investor ══ */}
      {[0, 1, 2].map((i) => {
        const p = popIn(f, T.digabung + i * 20) * (1 - gabung);
        if (p <= 0.001) return null;
        const x = lerp([680, 960, 1240][i], 960, gabung);
        return <Kendaraan key={i} x={x} y={520} d={lerp(170, 120, gabung)} warna={LANGKAH[i].warna} ikon={i === 0 ? 'jalanKaki' : LANGKAH[i].ikon} cermin={i === 1} p={p} />;
      })}
      {muridA > 0.001 ? (
        <ArahKeluar aktif={f > T.langkahA - 30}>
          <KarakterLingkar pose={MURID_BIRU} x={960} y={500} D={260} s={muridA} warna={B.orange} />
          <Label x={960} y={500 + 130 + 40} teks="Kebanyakan investor" f={f} at={T.kebanyakan + 20} keluar={T.langkahA} size={34} lebar={440} />
        </ArahKeluar>) : null}

      {/* ══ B–E: tiga kartu langkah naik seperti tangga ══ */}
      <ArahKeluar aktif={f > S07_AKHIR - 40}>
      {[0, 1].map((i) => <Chevron key={i} x={(KL.x[i] + KL.x[i + 1]) / 2} y={(KL.y[i] + KL.y[i + 1]) / 2} warna={B.blueLite} p={popIn(f, T.langkahA + 30 + i * 20) * popOut(f, S07_AKHIR + 30)} d={50} />)}
      {[0, 1, 2].map((i) => {
        const L = LANGKAH[i];
        const p = popIn(f, T.langkahA + i * 20);
        if (p <= 0.001 || f >= S07_AKHIR) return null; // sejak S07_AKHIR cangkang kartu digambar Scene 08
        const sorot = bobot[i], surut = mulaiSorot * (1 - sorot);
        const s = 1 + 0.04 * sorot; // yang dibahas sedikit lebih besar
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, transformOrigin: `${KL.x[i]}px ${KL.y[i]}px`, transform: s > 1.0001 ? `scale(${s})` : undefined, zIndex: sorot > 0.5 ? 1 : 0 }}>
            <Kaca x={KL.x[i]} y={KL.y[i]} w={KL.w} h={KL.h} p={p} warna={L.warna} tab="atas" tepi={Math.max(sorot, 0.6 * naik[i])} alfa={1 - 0.5 * surut}>
              <IsiLangkah i={i} f={f} />
            </Kaca>
          </div>);
      })}
      {/* investor DIPECAH lagi jadi tiga lingkaran → ikon kartu langkah 01 · 02 · 03 (kebalikan "digabung"); mendarat saat ikon kartunya pop */}
      {[0, 1, 2].map((i) => {
        const t = cin(f, T.langkahA + i * 20);
        if (t <= 0.001 || t >= 0.999) return null;
        const L = LANGKAH[i];
        const x = lerp(960, KL.x[i], t), y = lerp(500, atas(i) + 128, t), d = lerp(120, 120, t);
        return <Kendaraan key={i} x={x} y={y} d={d} warna={L.warna} ikon={i === 0 ? 'jalanKaki' : L.ikon} cermin={i === 1} p={1} />;
      })}

      {/* "jangan dibalik": panah urutan DI BAWAH kartu (trim path) — 01 → 03; di atas kartu = lintasan investor */}
      {(() => {
        const g = cin(f, T.dibalik) * popOut(f, S07_AKHIR + 30);
        if (g <= 0.001) return null;
        const x0 = KL.x[0] - 80, y0 = KL.y[0] + KL.h / 2 + 30, x1 = KL.x[2] + 80, y1 = KL.y[2] + KL.h / 2 + 30;
        return (
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${x0} ${y0} L ${x1} ${y1}`} g={g} warna={B.blue} tebal={5} titik={false} panah={{ x: x1, y: y1, sudut: Math.atan2(y1 - y0, x1 - x0) }} />
          </svg>);
      })()}
      {muridE > 0.001 ? <KarakterLingkar pose={MURID_BIRU} x={mx} y={my} D={150} s={muridE} warna={B.orange} /> : null}
      </ArahKeluar>
    </AbsoluteFill>);
};
