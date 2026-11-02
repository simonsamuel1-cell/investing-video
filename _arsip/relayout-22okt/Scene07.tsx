import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, CEK, F, io, mixHex, R, rgba } from '../theme';
import { alfaP, ArahKeluar, cin, gayaPapan, Icon, naikY, opa, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, geser } from '../parts/umum';
import { Kaca, KarakterLingkar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 07 — Jalur Kebanyakan Investor: Tiga Langkah (BATAS.s7 – BATAS.s8). Ide: 04_Asset/Ide-Visual-Scene-07.md.
 * A tiga kendaraan "digabung" → kebanyakan investor → TANGGA tiga anak tangga (fondasi · naik feri · latihan terbang). Tiap langkah dirinci:
 * tangga MENYUSUT jadi kepala tiga langkah di atas (yang sedang dibahas menyala) → B fondasi: uang jangka pendek → relatif stabil · rutin ke indeks
 * sedikit demi sedikit → C naik feri: dua syarat, porsi indeks di dana jangka panjang membesar jadi bagian utama → D latihan terbang: tiga syarat,
 * sebagian kecil untuk memilih saham sendiri, fokus kualitas + harga → E urutan terbalik (banyak saham → rugi → baru cari tahu indeks) dicoret →
 * F "cepat naik level" dicoret, yang penting siap → G kepala kembali jadi tangga, investor naik fondasi → feri → terbang.
 */
const A0 = BATAS.s7;
// naskah revisi 21 Okt (NOTE: motion tiga tahap existing dipakai persis): isi tiap panel ikut kalimat baru; urutan terbalik (E) & "cepat naik
// level" (F) dihapus dari naskah → papannya lepas; investor naik tangga di "Fondasi dulu. Naik feri. Baru belajar terbang."
const KATA = ['digabung', 'jalur', 'kebanyakan', 'investor', 'tiga', 'langkah', 'pertama', 'uang', 'instrumen', 'relatif',
  'kedua', 'naik', 'dana', 'bangun', 'indeks', 'sambil', 'ketiga', 'latihan', 'setelah', 'kemampuan', 'pengalaman', 'berkembang',
  'sebagian', 'memilih', 'fokusnya', 'berkualitas', 'harga', 'tiga', 'dibalik', 'fondasi', 'feri', 'terbang'];
// VO v2: "jangan dibalik" → "Fondasi dulu" hanya ±45f → kepala kembali jadi tangga di "Tiga langkah ini" (langkahG = tigaE), "dibalik" = panah urutan
// naik di atas tangga (dulu: kepala ditukar 3·2·1 + ✕ — tidak sempat terbaca lagi)
const K = ['digabung', 'jalur', 'kebanyakan', 'investor', 'tiga', 'langkahA', 'pertama', 'uang', 'instrumen', 'relatif',
  'langkah2', 'naikFeri', 'dana', 'bangun', 'indeksC', 'sambil', 'langkah3', 'latihan', 'setelah', 'kemampuan', 'pengalaman', 'berkembang',
  'sebagian', 'memilih', 'fokus', 'berkualitas', 'harga', 'tigaE', 'dibalik', 'fondasi', 'feri', 'terbang'] as const;
const W = urut(KATA, A0);
const T0 = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
/** kepala kembali jadi tangga di "Tiga langkah ini (jangan dibalik)" */
const T = { ...T0, langkahG: T0.tigaE };
export const S07_T = T;
export const S07_AKHIR = BATAS.s8;

const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const LANGKAH: { judul: string; ikon: KunciIkon; warna: string; kendaraan: boolean }[] = [
  { judul: 'Bangun fondasi', ikon: 'fondasi', warna: JALUR_WARNA.jalan, kendaraan: false },
  { judul: 'Naik feri', ikon: 'feri', warna: JALUR_WARNA.feri, kendaraan: true },
  { judul: 'Latihan terbang', ikon: 'pesawat', warna: JALUR_WARNA.pesawat, kendaraan: true },
];
/** tangga: tiga balok naik ke kanan; kepala: tiga pil di atas */
const TANGGA = { x: [600, 960, 1320], top: [540, 440, 340], bawah: 730, w: 330 };
const KEPALA = { x: [560, 960, 1360], y: 230, w: 360, h: 84 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** batang dana: segmen [warna, porsi, label?] */
const Batang: React.FC<{ x: number; y: number; w: number; h: number; p: number; seg: { warna: string; porsi: number; isi?: React.ReactNode }[] }> = ({ x, y, w, h, p, seg }) =>
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: h / 2, overflow: 'hidden', background: rgba(B.grayLite, 0.6),
      transform: `scaleX(${p})`, transformOrigin: 'left center', boxShadow: `0 12px 26px -16px ${rgba(B.night, 0.35)}` }}>
      {(() => {
        let acc = 0;
        return seg.map((s, i) => {
          const el = <div key={i} style={{ position: 'absolute', left: acc * w, top: 0, width: s.porsi * w, height: h, background: s.warna, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10, overflow: 'hidden', whiteSpace: 'nowrap' }}>{s.isi}</div>;
          acc += s.porsi;
          return el;
        });
      })()}
    </div>);

export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 || f > S07_AKHIR + 90) return null;

  /* mode tangga (0) ↔ kepala (1) */
  const m = cin(f, T.pertama + 10) * (1 - cin(f, T.langkahG)); // tangga tampil di "tiga langkah", menyusut jadi kepala di "langkah pertama"
  const tanggaP = [0, 1, 2].map((i) => popIn(f, T.langkahA + i * 20) * popOut(f, S07_AKHIR + 10 + i * 10));
  // QA jeglek 19 Okt: nyala dulu berganti SEKETIKA di tiap "langkah" (lonjakan f1082/2322/3448) → silang-pudar 40f
  const bobot = [1 - cin(f, T.langkah2, 40), cin(f, T.langkah2, 40) * (1 - cin(f, T.langkah3, 40)), cin(f, T.langkah3, 40)];
  const semua = cin(f, T.tigaE, 40);
  const nyala = (i: number) => 0.42 + 0.58 * Math.max(bobot[i], semua);
  /* papan rinci */
  const papanB = Math.min(cin(f, T.pertama + 30), 1 - cin(f, T.langkah2 - 20, 30));
  const papanC = Math.min(cin(f, T.langkah2 + 20), 1 - cin(f, T.langkah3 - 20, 30));
  const papanD = Math.min(cin(f, T.langkah3 + 20), 1 - cin(f, T.tigaE - 20, 30));
  /* investor */
  const muridA = popIn(f, T.investor) * popOut(f, T.pertama);
  const keAnak1 = cin(f, T.tiga - 10); // A: investor turun ke atas anak tangga 1 saat tangga muncul
  const muridG = popIn(f, T.langkahG);
  const hop = (at: number) => cin(f, at, 50);
  const naik = [hop(T.fondasi), hop(T.feri), hop(T.terbang)];
  // QA pusat 19 Okt: tangga TURUN mengikuti investor yang naik (isi tangga + investor tetap di tengah: anak tangga 1 → +5, 2 → +37, 3 → +87)
  const turun = 5 + 32 * naik[1] + 50 * naik[2];
  const topT = (i: number) => TANGGA.top[i] + turun, bawahT = TANGGA.bawah + turun;
  const pos = (i: number) => ({ x: TANGGA.x[i], y: topT(i) - 90 });
  // investor muncul di atas anak tangga 1 saat kepala kembali jadi tangga ("Fondasi dulu"), lalu naik per langkah
  let mx = pos(0).x, my = pos(0).y;
  const mD = 150;
  for (let i = 1; i < 3; i++) {
    const t = naik[i];
    if (t > 0) { mx = lerp(mx, pos(i).x, t); my = lerp(my, pos(i).y, t) - 70 * Math.sin(Math.PI * t); }
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A: tiga kendaraan digabung → kebanyakan investor ══ */}
      {(() => {
        const gabung = cin(f, T.jalur);
        return [0, 1, 2].map((i) => {
          const p = popIn(f, T.digabung + i * 12) * (1 - gabung);
          if (p <= 0.001) return null;
          const x = lerp([760, 960, 1160][i], 960, gabung);
          return <Kendaraan key={i} x={x} y={540} d={120} warna={LANGKAH[i].warna} ikon={i === 0 ? 'jalanKaki' : LANGKAH[i].ikon} cermin={i === 1} p={p} />;
        });
      })()}
      {muridA > 0.001 ? (
        <>
          <ArahKeluar aktif={f > T.pertama - 30}><KarakterLingkar pose={MURID_BIRU} x={lerp(960, pos(0).x, keAnak1)} y={lerp(545, pos(0).y, keAnak1)} D={lerp(220, 150, keAnak1)} s={muridA} warna={B.orange} /></ArahKeluar>
          <Label x={960} y={545 + 110 + 40} teks="Kebanyakan investor" f={f} at={T.kebanyakan + 20} size={32} lebar={440} alfa={1 - keAnak1} />
        </>) : null}

      {/* ══ TANGGA ↔ KEPALA ══ */}
      {[0, 1, 2].map((i) => {
        const p = tanggaP[i];
        if (p <= 0.001) return null;
        const L = LANGKAH[i];
        const hB = bawahT - topT(i);
        const x = lerp(TANGGA.x[i], KEPALA.x[i], m), y = lerp(topT(i) + hB / 2, KEPALA.y, m);
        const w = lerp(TANGGA.w, KEPALA.w, m), h = lerp(hB, KEPALA.h, m);
        const sampai = naik[i]; // anak tangga yang sudah dinaiki menyala di akhir
        return (
          <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: 'center', transform: geser(x - w / 2, y - h / 2 + naikY(p, 60) * (f > S07_AKHIR - 40 ? -1 : 1)),
            opacity: alfaP(p, lerp(1, nyala(i), m)) }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: lerp(26, h / 2, m), background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`,
              boxShadow: `0 24px 50px -26px ${rgba(L.warna, 0.9)}, inset 0 0 0 ${lerp(0, 3, m)}px ${rgba(L.warna, 0.9)}`, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14 * (1 - m), background: L.warna }} />
              {sampai > 0.001 && m < 0.5 ? <div style={{ position: 'absolute', inset: 0, background: rgba(L.warna, 0.14 * sampai) }} /> : null}
            </div>
            {/* isi balok (tangga) */}
            {m < 0.999 ? (
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - m * 2 }}>
                {L.kendaraan ? <Kendaraan x={w / 2} y={74} d={100} warna={L.warna} ikon={L.ikon} cermin={i === 1} p={1} /> : <Bulat x={w / 2} y={74} d={100} warna={L.warna} ikon={L.ikon} p={1} />}
                <Nomor x={w / 2 - 50} y={74 - 44} n={i + 1} warna={L.warna} p={1} d={44} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: 136, textAlign: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, lineHeight: '40px' }}>{L.judul}</div>
              </div>) : null}
            {/* isi pil (kepala) */}
            {m > 0.001 ? (
              <div style={{ position: 'absolute', inset: 0, opacity: Math.max(0, m * 2 - 1), display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 18 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: L.warna, color: B.white, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 24, fontWeight: 800 }}>{`0${i + 1}`}</div>
                <Icon name={L.ikon} size={40} color={L.warna} style={i === 1 ? { transform: 'scaleX(-1)' } : undefined} />
                <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>{L.judul}</span>
              </div>) : null}
          </div>);
      })}

      {/* PANEL RINCIAN (QA pusat 19 Okt): kepala di atas + isi di bawah dulu −90…−310 → isi tiap langkah dibingkai satu panel 320–860 (kepala + panel = tengah) */}
      {(() => {
        const p = popIn(f, T.pertama + 30) * popOut(f, T.langkahG - 10);
        if (p <= 0.001) return null;
        // QA jeglek 20 Okt: warna pita panel dulu berganti SEKETIKA di tiap "langkah" (lonjakan f1082/f2322) → silang-warna 40f mengikuti kepala
        const warna = mixHex(mixHex(mixHex(LANGKAH[0].warna, LANGKAH[1].warna, cin(f, T.langkah2, 40)), LANGKAH[2].warna, cin(f, T.langkah3, 40)), B.blueLite, semua);
        return <ArahKeluar aktif={f > T.langkahG - 40}><Kaca x={960} y={590} w={1240} h={540} p={p} warna={warna} tab="atas" /></ArahKeluar>;
      })()}
      {/* "jangan dibalik": panah urutan naik di atas tangga (trim path) — anak tangga 1 → 3 */}
      {(() => {
        const g = cin(f, T.dibalik - 10, 50) * (1 - cin(f, T.feri - 40, 30)); // pudar sebelum investor melompat (tidak menabrak lintasannya)
        if (g <= 0.001) return null;
        const y0 = topT(0) - 210, y1 = topT(2) - 210;
        return (
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d={`M ${TANGGA.x[0] + 90} ${y0} L ${TANGGA.x[2] - 60} ${y1}`} g={g} warna={B.blue} tebal={5} titik={false}
              panah={{ x: TANGGA.x[2] - 60, y: y1, sudut: Math.atan2(y1 - y0, TANGGA.x[2] - 60 - TANGGA.x[0] - 90) }} />
          </svg>);
      })()}
      {/* ikon besar tiap langkah di tengah selama judul langkah diucapkan (badan papan tidak kosong sebelum rincian pertama) */}
      {[{ k: 0, masuk: T.pertama + 40, keluar: T.uang - 25 }, { k: 1, masuk: T.naikFeri, keluar: T.dana - 25 }, { k: 2, masuk: T.latihan, keluar: T.setelah - 25 }].map(({ k, masuk, keluar }) => {
        const p = popIn(f, masuk) * popOut(f, keluar);
        if (p <= 0.001) return null;
        const L = LANGKAH[k];
        return (
          <React.Fragment key={k}>
            {L.kendaraan ? <Kendaraan x={960} y={540} d={180} warna={L.warna} ikon={L.ikon} cermin={k === 1} p={p} /> : <Bulat x={960} y={540} d={180} warna={L.warna} ikon={L.ikon} p={p} />}
            <Label x={960} y={540 + 90 + 40} teks={L.judul} f={f} at={masuk + 10} size={32} alfa={Math.min(1, p)} />
          </React.Fragment>);
      })}

      {/* ══ B: langkah 1 — bangun fondasi ══ */}
      {papanB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanB, f > T.langkah2 - 40) }}>
          {/* naskah revisi: satu baris — uang yang nggak boleh banyak bergejolak → relatif stabil (baris "rutin ke indeks" dihapus) */}
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d="M 790 560 L 1120 560" g={cin(f, T.instrumen)} warna={B.gray} tebal={4} titik={false} panah={{ x: 1120, y: 560, sudut: 0 }} />
          </svg>
          <Bulat x={700} y={560} d={130} warna={B.blue} ikon="dompet" p={popIn(f, T.uang)} />
          <Label x={700} y={560 + 65 + 38} teks="Uang yang nggak boleh bergejolak" f={f} at={T.uang + 10} size={30} lebar={480} />
          <Kendaraan x={1220} y={560} d={130} warna={JALUR_WARNA.jalan} ikon="jalanKaki" cermin={false} p={popIn(f, T.relatif)} />
          <Label x={1220} y={560 + 65 + 38} teks="Relatif stabil" f={f} at={T.relatif + 10} size={30} />
        </div>) : null}

      {/* ══ C: langkah 2 — naik feri ══ */}
      {papanC > 0.001 ? (() => {
        // naskah revisi: dana jangka panjang → mulai bangun investasi di indeks, sambil belajar menghadapi naik-turun market (dua syarat lama lepas)
        const porsi = 0.3 + 0.45 * R(f, T.bangun, T.indeksC + 40, 0, 1, io);
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanC, f > T.langkah3 - 40) }}>
            <div style={{ position: 'absolute', left: 460, top: 470, fontFamily: F, fontSize: 28, fontWeight: 700, color: B.gray }}>
              <WordText f={f} at={T.dana} halus>Dana jangka panjang</WordText>
            </div>
            <Batang x={460} y={520} w={1000} h={76} p={cin(f, T.dana + 10)} seg={[
              { warna: JALUR_WARNA.feri, porsi, isi: (
                <><Icon name="feri" size={36} color={B.white} style={{ transform: 'scaleX(-1)' }} />
                  <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.white, opacity: cin(f, T.indeksC) }}>Indeks</span></>) },
              { warna: 'transparent', porsi: 1 - porsi, isi: <span style={{ fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>Lainnya</span> },
            ]} />
            <Chip x={960} y={680} teks="Sambil belajar menghadapi naik-turun" ikon="kelas" warna={JALUR_WARNA.feri} p={popIn(f, T.sambil)} size={28} />
          </div>);
      })() : null}

      {/* ══ D: langkah 3 — latihan terbang ══ */}
      {papanD > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanD, f > T.tigaE - 40) }}>
          {/* naskah revisi: tiga syarat → satu ("setelah kemampuan dan pengalaman berkembang") */}
          <Chip x={960} y={430 + 130 * (1 - cin(f, T.sebagian - 44))} teks="Kemampuan & pengalaman berkembang" ikon="kemampuan" warna={CEK} p={popIn(f, T.kemampuan)} size={26} />
          <Batang x={460} y={560} w={1000} h={76} p={cin(f, T.sebagian - 20)} seg={[
            { warna: JALUR_WARNA.jalan, porsi: 0.3 }, { warna: JALUR_WARNA.feri, porsi: 0.6 },
            { warna: JALUR_WARNA.pesawat, porsi: 0.1 * cin(f, T.sebagian + 20), isi: <Icon name="pesawat" size={34} color={B.white} /> },
          ]} />
          <div style={{ position: 'absolute', left: 460 + 1000, top: 652, transform: `translate(-100%, ${naikY(popIn(f, T.memilih), 24)}px)`, opacity: opa(alfaP(popIn(f, T.memilih))),
            fontFamily: F, fontSize: 26, fontWeight: 700, color: B.night, whiteSpace: 'nowrap' }}>Sebagian kecil · belajar memilih saham</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 728, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 700, color: B.gray }}>
            <WordText f={f} at={T.fokus} halus>Fokus</WordText>
          </div>
          <Chip x={760} y={800} teks="Perusahaan berkualitas" ikon="kualitas" warna={B.blue} p={popIn(f, T.berkualitas)} size={28} />
          <Chip x={1180} y={800} teks="Harga masuk akal" ikon="valuasi" warna={B.turq} p={popIn(f, T.harga)} size={28} />
        </div>) : null}

      {muridG > 0.001 ? (
        <>
          <ArahKeluar aktif={f > S07_AKHIR - 20}><KarakterLingkar pose={MURID_BIRU} x={mx} y={my} D={mD} s={muridG * popOut(f, S07_AKHIR + 20)} warna={B.orange} /></ArahKeluar>
        </>) : null}
    </AbsoluteFill>);
};
