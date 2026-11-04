import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, CORET, F, io, mixHex, R, rgba } from '../theme';
import { alfaP, ArahKeluar, cin, gayaPapan, Icon, naikY, opa, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
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
const KATA = ['digabung', 'jalur', 'kebanyakan', 'investor', 'tiga', 'langkah', 'pertama', 'uang', 'instrumen', 'relatif', 'rutin', 'indeks',
  'sedikit', 'demi', 'sedikit', 'langkah', 'naik', 'paham', 'pernah', 'panik', 'dana', 'lebih', 'indeks', 'bagian', 'perjalanan', 'langkah', 'latihan',
  'perusahaan', 'valuasi', 'pengalaman', 'volatilitas', 'sebagian', 'memilih', 'fokusnya', 'berkualitas', 'harga', 'tiga', 'dibalik', 'membeli',
  'rugi', 'mencari', 'indeks', 'penting', 'cepat', 'level', 'penting', 'siap', 'langkah', 'fondasi', 'feri', 'terbang'];
const K = ['digabung', 'jalur', 'kebanyakan', 'investor', 'tiga', 'langkahA', 'pertama', 'uang', 'instrumen', 'relatif', 'rutin', 'indeksB',
  'sedikit', 'demi', 'sedikit2', 'langkah2', 'naikFeri', 'paham', 'pernah', 'panik', 'dana', 'lebih', 'indeksC', 'bagian', 'perjalanan', 'langkah3', 'latihan',
  'perusahaan', 'valuasi', 'pengalaman', 'volatilitas', 'sebagian', 'memilih', 'fokus', 'berkualitas', 'harga', 'tigaE', 'dibalik', 'membeli',
  'rugi', 'mencari', 'indeksE', 'penting', 'cepat', 'level', 'penting2', 'siap', 'langkahG', 'fondasi', 'feri', 'terbang'] as const;
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
/** tangga: tiga balok naik ke kanan; kepala: tiga pil di atas */
const TANGGA = { x: [600, 960, 1320], top: [540, 440, 340], bawah: 730, w: 330 };
const KEPALA = { x: [560, 960, 1360], y: 230, w: 360, h: 84 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** penanda "uang masuk" (koin bulat oranye ber-Rp) */
const Koin: React.FC<{ x: number; y: number; d: number; alfa: number }> = ({ x, y, d, alfa }) => alfa <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.orange, border: `3px solid ${B.white}`, boxSizing: 'border-box',
    transform: geser(x - d / 2, y - d / 2), opacity: alfa, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: d * 0.36, fontWeight: 800, color: B.white,
    boxShadow: `0 8px 16px -8px ${rgba(B.orange, 0.9)}` }}>Rp</div>);

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
  const papanE = Math.min(cin(f, T.tigaE + 10), 1 - cin(f, T.penting - 20, 30));
  const papanF = Math.min(cin(f, T.penting), 1 - cin(f, T.langkahG - 10, 30));
  /* investor */
  const muridA = popIn(f, T.investor) * popOut(f, T.pertama);
  const keAnak1 = cin(f, T.tiga - 10); // A: investor turun ke atas anak tangga 1 saat tangga muncul
  const muridG = popIn(f, T.penting);
  const hop = (at: number) => cin(f, at, 50);
  const naik = [hop(T.fondasi), hop(T.feri), hop(T.terbang)];
  // QA pusat 19 Okt: tangga TURUN mengikuti investor yang naik (isi tangga + investor tetap di tengah: anak tangga 1 → +5, 2 → +37, 3 → +87)
  const turun = 5 + 32 * naik[1] + 50 * naik[2];
  const topT = (i: number) => TANGGA.top[i] + turun, bawahT = TANGGA.bawah + turun;
  const pos = (i: number) => ({ x: TANGGA.x[i], y: topT(i) - 90 });
  // F: kiri (berdampingan dengan "cepat naik level") → tengah saat chip itu pergi → di atas anak tangga 1 saat kepala kembali jadi tangga → naik per langkah
  const keTangga = cin(f, T.langkahG + 20);
  const fx = lerp(700, 960, cin(f, T.penting2 + 10));
  let mx = lerp(fx, pos(0).x, keTangga), my = lerp(570, pos(0).y, keTangga), mD = lerp(220, 150, keTangga);
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
        // "jangan DIBALIK": urutan kepala tertukar 3·2·1 sesaat (lalu disilang), kembali saat contoh urutan terbalik dimulai
        const balik = cin(f, T.dibalik) * (1 - cin(f, T.membeli - 30));
        const xK = lerp(KEPALA.x[i], KEPALA.x[2 - i], balik);
        const x = lerp(TANGGA.x[i], xK, m), y = lerp(topT(i) + hB / 2, KEPALA.y, m);
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
      {/* silang di atas urutan terbalik */}
      <Lencana x={960} y={KEPALA.y} d={140} p={popIn(f, T.dibalik + 30) * popOut(f, T.membeli - 20)} warna={CORET} teks="✕" besar={60} />
      {/* ikon besar tiap langkah di tengah selama judul langkah diucapkan (badan papan tidak kosong sebelum rincian pertama) */}
      {[{ k: 0, masuk: T.pertama + 40, keluar: T.uang - 25 }, { k: 1, masuk: T.naikFeri, keluar: T.paham - 25 }, { k: 2, masuk: T.latihan, keluar: T.perusahaan - 25 }].map(({ k, masuk, keluar }) => {
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
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Penghubung d="M 790 490 L 1120 490" g={cin(f, T.instrumen)} warna={B.gray} tebal={4} titik={false} panah={{ x: 1120, y: 490, sudut: 0 }} />
            <Penghubung d="M 790 710 L 1120 710" g={cin(f, T.rutin + 30)} warna={B.gray} tebal={4} titik={false} panah={{ x: 1120, y: 710, sudut: 0 }} />
          </svg>
          <Bulat x={700} y={490} d={130} warna={B.blue} ikon="dompet" p={popIn(f, T.uang)} />
          <Label x={700} y={490 + 65 + 38} teks="Uang jangka pendek" f={f} at={T.uang + 10} size={30} lebar={380} />
          <Kendaraan x={1220} y={490} d={130} warna={JALUR_WARNA.jalan} ikon="jalanKaki" cermin={false} p={popIn(f, T.relatif)} />
          <Label x={1220} y={490 + 65 + 38} teks="Relatif stabil" f={f} at={T.relatif + 10} size={30} />
          <Bulat x={700} y={710} d={130} warna={B.turq} ikon="kalender" p={popIn(f, T.rutin)} />
          <Label x={700} y={710 + 65 + 38} teks="Rutin" f={f} at={T.rutin + 10} size={30} />
          <Kendaraan x={1220} y={710} d={130} warna={JALUR_WARNA.feri} ikon="feri" cermin p={popIn(f, T.indeksB)} />
          <Label x={1220} y={710 + 65 + 38} teks="Indeks, sedikit demi sedikit" f={f} at={T.indeksB + 20} size={30} lebar={460} />
          {[T.sedikit, T.demi, T.sedikit2].map((at, k) => {
            const t = R(f, at - 10, at + 40, 0, 1, io);
            if (t <= 0 || t >= 1) return null;
            return <Koin key={k} x={lerp(790, 1150, t)} y={710 - 60 * Math.sin(Math.PI * t)} d={44} alfa={Math.min(R(t, 0, 0.15, 0, 1), R(t, 0.8, 1, 1, 0))} />;
          })}
        </div>) : null}

      {/* ══ C: langkah 2 — naik feri ══ */}
      {papanC > 0.001 ? (() => {
        const porsi = 0.3 + 0.45 * R(f, T.dana + 100, T.indeksC, 0, 1, io); // QA diam: porsi indeks tumbuh pelan sepanjang "bisa mulai lebih banyak ditempatkan"
        const turunC = 130 * (1 - cin(f, T.dana - 24)); // chip syarat di tengah panel dulu, naik memberi ruang batang dana
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanC, f > T.langkah3 - 40) }}>
            <Chip x={960} y={420 + turunC} teks="Paham indeks" ikon="tersedia" warna={CEK} p={popIn(f, T.paham)} size={28} />
            <Chip x={960} y={495 + turunC} teks="Pernah melewati market turun tanpa panik" ikon="tersedia" warna={CEK} p={popIn(f, T.pernah)} size={28} />
            <div style={{ position: 'absolute', left: 460, top: 586, fontFamily: F, fontSize: 28, fontWeight: 700, color: B.gray }}>
              <WordText f={f} at={T.dana} halus>Dana jangka panjang</WordText>
            </div>
            <Batang x={460} y={636} w={1000} h={76} p={cin(f, T.dana + 10)} seg={[
              { warna: JALUR_WARNA.feri, porsi, isi: (
                <><Icon name="feri" size={36} color={B.white} style={{ transform: 'scaleX(-1)' }} />
                  <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.white, opacity: cin(f, T.bagian) }}>Bagian utama</span></>) },
              { warna: 'transparent', porsi: 1 - porsi, isi: <span style={{ fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>Lainnya</span> },
            ]} />
            <Chip x={960} y={790} teks="Perjalanan jangka panjang" ikon="waktu" warna={JALUR_WARNA.feri} p={popIn(f, T.perjalanan)} size={28} />
          </div>);
      })() : null}

      {/* ══ D: langkah 3 — latihan terbang ══ */}
      {papanD > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanD, f > T.tigaE - 40) }}>
          {[{ x: 620, teks: 'Paham perusahaan', ikon: 'kualitas' as const, at: T.perusahaan },
            { x: 948, teks: 'Paham valuasi', ikon: 'valuasi' as const, at: T.valuasi },
            { x: 1300, teks: 'Pengalaman volatilitas', ikon: 'kemampuan' as const, at: T.pengalaman }].map((c, i) => (
            <Chip key={i} x={c.x} y={430 + 130 * (1 - cin(f, T.sebagian - 44))} teks={c.teks} ikon={c.ikon} warna={CEK} p={popIn(f, c.at)} size={26} />))}
          <Batang x={460} y={560} w={1000} h={76} p={cin(f, T.sebagian - 20)} seg={[
            { warna: JALUR_WARNA.jalan, porsi: 0.3 }, { warna: JALUR_WARNA.feri, porsi: 0.6 },
            { warna: JALUR_WARNA.pesawat, porsi: 0.1 * cin(f, T.sebagian + 20), isi: <Icon name="pesawat" size={34} color={B.white} /> },
          ]} />
          <div style={{ position: 'absolute', left: 460 + 1000, top: 652, transform: `translate(-100%, ${naikY(popIn(f, T.memilih), 24)}px)`, opacity: opa(alfaP(popIn(f, T.memilih))),
            fontFamily: F, fontSize: 26, fontWeight: 700, color: B.night, whiteSpace: 'nowrap' }}>Sebagian kecil · memilih saham sendiri</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 728, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 700, color: B.gray }}>
            <WordText f={f} at={T.fokus} halus>Fokus</WordText>
          </div>
          <Chip x={760} y={800} teks="Perusahaan berkualitas" ikon="kualitas" warna={B.blue} p={popIn(f, T.berkualitas)} size={28} />
          <Chip x={1180} y={800} teks="Harga masuk akal" ikon="valuasi" warna={B.turq} p={popIn(f, T.harga)} size={28} />
        </div>) : null}

      {/* ══ E: urutan terbalik — dicoret ══ */}
      {papanE > 0.001 ? (() => {
        const coret = R(f, T.indeksE + 10, T.indeksE + 40, 0, 1, io);
        return (
          <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanE, f > T.penting - 40) }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Penghubung d="M 650 590 L 870 590" g={cin(f, T.rugi - 20)} warna={B.gray} tebal={4} titik={false} panah={{ x: 870, y: 590, sudut: 0 }} />
              <Penghubung d="M 1050 590 L 1270 590" g={cin(f, T.mencari - 20)} warna={B.gray} tebal={4} titik={false} panah={{ x: 1270, y: 590, sudut: 0 }} />
            </svg>
            {[-1, 0, 1].map((k) => <Kendaraan key={k} x={560 + k * 26} y={590 - Math.abs(k) * 6} d={120} warna={JALUR_WARNA.pesawat} ikon="pesawat" cermin={false}
              p={popIn(f, T.membeli + (k + 1) * 10)} />)}
            <Label x={560} y={590 + 60 + 40} teks="Banyak saham" f={f} at={T.membeli + 20} size={30} />
            <Bulat x={960} y={590} d={130} warna={ARAH.turun} ikon="rugi" p={popIn(f, T.rugi)} />
            <Label x={960} y={590 + 65 + 40} teks="Rugi" f={f} at={T.rugi + 10} size={30} />
            <Kendaraan x={1360} y={590} d={130} warna={JALUR_WARNA.feri} ikon="feri" cermin p={popIn(f, T.mencari)} />
            <Label x={1360} y={590 + 65 + 40} teks="Baru cari tahu indeks" f={f} at={T.mencari + 10} size={30} lebar={380} />
            {coret > 0.001 ? <div style={{ position: 'absolute', left: 440, top: 585, width: 1040 * coret, height: 10, borderRadius: 5, background: CORET }} /> : null}
            <Lencana x={960} y={590} d={300} p={popIn(f, T.indeksE + 40)} warna={CORET} teks="✕" besar={76} />
          </div>);
      })() : null}

      {/* ══ F: bukan seberapa cepat naik level — yang penting siap ══ */}
      {papanF > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanF, f > T.langkahG - 30) }}>
          <Chip x={1160} y={570} teks="Cepat naik level" ikon="cepat" warna={B.gray} p={popIn(f, T.cepat) * popOut(f, T.penting2)} coret={R(f, T.level - 5, T.level + 25, 0, 1, io)} size={34} />
        </div>) : null}
      {muridG > 0.001 ? (
        <>
          <ArahKeluar aktif={f > S07_AKHIR - 20}><KarakterLingkar pose={MURID_BIRU} x={mx} y={my} D={mD} s={muridG * popOut(f, S07_AKHIR + 20)} warna={B.orange} /></ArahKeluar>
          <Lencana x={mx} y={my} d={mD} p={popIn(f, T.siap) * popOut(f, T.langkahG + 10)} warna={CEK} ikon="tersedia" besar={60} />
        </>) : null}
    </AbsoluteFill>);
};
