import React from 'react';
import { Img, staticFile } from 'remotion';
import { B, CEK, F, R, SISI, bayanganKecil, io, lerp, mixHex, rgba } from '../theme';
import { Icon, WordText, cin, popOut, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Label } from '../parts/umum';
import { Chevron, Kaca, KacaMorf, MaskerBadan, Penghubung, geser, type GeoKartu } from '../parts/kaca';
import { Avatar, Pendar } from '../parts/v06';
import { PilNominal } from '../parts/nominal';
import { geoBulat } from '../parts/lingkar';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { S04_T } from '../s04/Scene04';

/**
 * SCENE 03 — "Bukan Cuma Satu Investor" — DIROMBAK 30 Okt (Simon: "rombak scene 3"; kritik 29 Okt: hierarki tak jelas, elemen kecil, berat di atas).
 * Catatan visual Simon: timeline 1930-an → 2026; VO menyebut beberapa nama, nama & rekam jejak lain tampil sebagai kartu data.
 * SATU FOKUS PER ADEGAN: investor yang disebut VO = KARTU SOROT besar (foto, nama, data) yang MEMEKAR dari lingkarannya di garis waktu dan MENGERUT
 * kembali ke sana. Garis waktu MEMBERI RUANG: turun ke bawah saat kartu terbuka, kembali ke tengah (dan lingkarannya membesar) saat barisnya jadi fokus.
 *  A f8599–8866  kartu Graham di tengah ("nggak berhenti di Graham"), garis waktu memanjang ke 2026
 *  B f8816–9164  kartu mengerut ke ujung kiri garis waktu; tahun pop di "generasi"
 *  C f9183–9449  kartu Walter Schloss (1955–2002, lebih dari 4 dekade — pita periode)
 *  D f9464–9852  kartu Warren Buffett (Berkshire Hathaway — logo berkas Simon, 19,9 %/tahun ⚠ verifikasi, pita 1965–2024)
 *  E f9914–10249 Munger · Klarman · Orbis masuk barisan; tiap investor meninggalkan KARTU DATA kecil di bawah tahunnya
 *  F/G           di atas tiap investor: perusahaan BERBEDA → cara hitung BERBEDA (pop keluar dulu, baru pop masuk)
 *  H f10628–     kartu SATU POLA (Pahami bisnis › Nilai wajar › Bandingkan harga), garis putus-putus naik dari tiap investor
 *  I–J           sorot satu investor · satu periode → pita MELEBAR ke seluruh garis waktu, semua menyala, chip "Lintas generasi"
 */
const PASANG: [string, string][] = [
  ['menarik', 'menarik'], ['cara', 'cara'], ['berhenti', 'berhenti'], ['graham', 'graham'], ['pendekatan', 'pendekatan'], ['generasi', 'generasi'],
  ['walter', 'walter'], ['schloss', 'schloss'], ['lebih', 'lebih'], ['empat', 'empat'], ['dekade', 'dekade'], ['warren', 'warren'], ['buffett', 'buffett'], ['puluhan', 'puluhan'],
  ['berkshire', 'berkshire'], ['setelah', 'setelah'], ['investor', 'investor'], ['fund', 'fund'], ['prinsip', 'prinsip'], ['mereka', 'mereka'],
  ['perusahaan', 'perusahaan'], ['cara2', 'cara'], ['nilainya', 'nilainya'], ['tapi', 'tapi'], ['pola', 'pola'], ['terus', 'terus'], ['pahami', 'pahami'],
  ['perkirakan', 'perkirakan'], ['bandingkan', 'bandingkan'], ['market', 'market'], ['jadi', 'jadi'], ['satu', 'satu'], ['investor2', 'investor'],
  ['periode', 'periode'], ['prinsip2', 'prinsip'], ['lintas', 'lintas'],
];
const T = (() => {
  const v = urut(PASANG.map(([, w]) => w), BATAS.s3);
  return Object.fromEntries(PASANG.map(([n], i) => [n, v[i]])) as Record<string, number>;
})();
const AWAL = BATAS.s3, AKHIR = BATAS.s4;
const ABU_TEKS = mixHex(B.gray, B.night, 0.45);

/** foto potret di lingkaran (berkas Simon proyek 006). Lingkaran pop, foto NAIK dari bawah di dalam masker lingkaran (Simon 29 Okt). `wajah` = pusat &
 *  lebar wajah di berkas (px). 30 Okt: posisi lewat translate3d (dulu left/top → dibulatkan Chrome saat bergeser pelan) */
type Foto = { src: string; w: number; h: number; wajah: [number, number, number]; latar: string };
/** 30 Okt (Simon mengirim foto seluruh badan kelima tokoh, latar transparan 1024 × 1536 — folder episode): wajah = [pusat x, pusat y wajah, lebar kepala]
 *  diukur dari kanal alfa (puncak kepala, baris mata). Dulu: potret lama proyek 006 & Schloss tanpa foto (avatar). */
export const FOTO: Record<string, Foto> = {
  graham: { src: 'karakter/graham-badan.png', w: 1024, h: 1536, wajah: [512, 150, 165], latar: B.blueWash },
  schloss: { src: 'karakter/schloss-badan.png', w: 1024, h: 1536, wajah: [490, 150, 160], latar: B.blueWash },
  buffett: { src: 'karakter/buffett-badan.png', w: 1024, h: 1536, wajah: [514, 152, 172], latar: B.blueWash },
  munger: { src: 'karakter/munger-badan.png', w: 1024, h: 1536, wajah: [513, 136, 165], latar: B.blueWash },
  klarman: { src: 'karakter/klarman-badan.png', w: 1024, h: 1536, wajah: [524, 148, 165], latar: B.blueWash },
};
export const FotoLingkar: React.FC<{ foto: Foto; x: number; y: number; d: number; p: number; naik: number; warna: string }> = ({ foto, x, y, d, p, naik, warna }) => {
  if (p <= 0.001) return null;
  const k = (0.46 * d) / foto.wajah[2], w = foto.w * k, h = foto.h * k;
  const left = d / 2 - foto.wajah[0] * k, top = d * 0.44 - foto.wajah[1] * k, turun = (1 - naik) * d * 1.1; // naik = transform sub-piksel (dulu `top`: loncat 1 px)
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: foto.latar, overflow: 'hidden',
      border: `${SISI + 2}px solid ${warna}`, boxSizing: 'border-box', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, transformOrigin: 'center',
      boxShadow: bayanganKecil(warna) }}>
      {naik > 0.001 ? <Img src={staticFile(foto.src)} style={{ position: 'absolute', left: left - SISI - 2, top: top - SISI - 2, width: w, height: h, maxWidth: 'none',
        transform: `translate3d(0, ${turun}px, 0) rotate(0.001deg)` }} /> : null}
    </div>);
};
const LogoLingkar: React.FC<{ src: string; x: number; y: number; d: number; p: number; warna: string }> = ({ src, x, y, d, p, warna }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI + 2}px solid ${warna}`,
    boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, boxShadow: bayanganKecil(warna) }}>
    <Img src={staticFile(src)} style={{ width: d * 0.78, height: 'auto' }} /></div>);

/* ══════════════ TATA LETAK: garis waktu DIAM ══════════════
 * 30 Okt malam (Simon S03: "Ketika masing masing tokoh disebut mulai dari tengah (garis tidak perlu naik turun seperti sekarang)" · "tambahkan tahun
 * sebelum 1930, agar bisa center ke tengah frame" · "Perbaiki spacingnya"): barisan & garis waktu TIDAK lagi naik-turun (dulu turun 210 px tiap kartu
 * sorot terbuka); ujung kiri = 1920 (titik gelap, cermin 2026 di kanan) → enam investor SIMETRIS terhadap x 960 (dulu 260–1460, ujung 1690: berat kiri).
 * Kartu sorot di atas barisan (130–410), lingkaran 500–620, garis 690, tahun 714, kartu data 790.
 * 2 Nov (Simon: "Turun kan sedikit timeline agar ketika panelnya muncul untuk setiap figur bisa tepat berada ditengah layar"): seluruh tata letak +33 px
 * (kartu 163–443, lingkaran 533–653, garis 723, tahun 747, kartu data 823) + kamera +40 (src/kamera.gen.ts) → panel + garis waktu berpusat di 540 layar
 * (dulu ±467). */
const SLOT = [335, 585, 835, 1085, 1335, 1585]; // jarak 250 (dulu 230: nama & kartu data hampir bersentuhan)
const AWAL_X = 120, UJUNG = 1800; // 1920 · 2026
/** tahun → x di garis waktu (antar-titik tahun investor linear) */
const TITIK: [number, number][] = [[1920, AWAL_X], [1930, 335], [1955, 585], [1965, 835], [1978, 1085], [1982, 1335], [1989, 1585], [2026, UJUNG]];
const xTahun = (th: number) => {
  for (let i = 1; i < TITIK.length; i++) if (th <= TITIK[i][0]) return lerp(TITIK[i - 1][1], TITIK[i][1], (th - TITIK[i - 1][0]) / (TITIK[i][0] - TITIK[i - 1][0]));
  return UJUNG;
};
// 2 Nov sore: barisan +20 lagi (ruang untuk garis pola yang berkumpul ke satu titik)
const CY = 613, D_ORANG = 120, Y_GARIS = 743;
/** 2 Nov sore (Simon: "Ya, naikkan" — fase BARISAN SAJA, tanpa kartu sorot / panel pola di atasnya, dulu ±200 px di bawah tengah layar): barisan + garis
 *  waktu NAIK ke tengah saat kartu mengerut ke barisan, TURUN lagi memberi ruang saat kartu/panel berikutnya muncul (60 f, satu gerak bersama kartu itu):
 *  · sesudah kartu Graham mengerut → naik 200 · turun saat kartu Schloss pop (jeda Schloss → Buffett 58 f: tetap di bawah)
 *  · sesudah kartu Buffett mengerut → naik 200 · ikon perusahaan pop di atas lingkaran → turun 80 (memberi ruang, mulai 15 f sebelum pop)
 *  · panel "Satu pola" pop → turun ke posisi semula (panel + barisan berpusat) */
const naikBaris = (f: number) =>
  -200 * cin(f, T.pendekatan + 20) * (1 - cin(f, T.walter + 10))
  - 200 * cin(f, T.setelah) + 80 * cin(f, T.perusahaan - 15) + 120 * cin(f, T.pola + 20);
const cyAt = (f: number) => CY + naikBaris(f);
const dAt = (_f: number) => D_ORANG;
const yGaris = (f: number) => Y_GARIS + naikBaris(f);
/** kartu sorot (foto besar · nama · data) — di atas barisan; kartu PERTAMA (Graham) muncul di TENGAH FRAME (y 497, belum ada visual lain) lalu naik ke
 *  sini memberi ruang saat garis waktu tergambar */
export const KARTU = { x: 960, y: 303, w: 860, h: 280 };
export const PUSAT_Y = 497;

type Orang = { nama: string; tahun: string; foto?: keyof typeof FOTO; logo?: string; warna: string; masuk: () => number;
  data: string; dataAt: () => number; perusahaan: KunciIkon; metode: KunciIkon };
const ORANG: Orang[] = [
  { nama: 'Benjamin Graham', tahun: '1930-an', foto: 'graham', warna: B.blue, masuk: () => T.pendekatan + 20, data: 'Bapak value investing', dataAt: () => T.pendekatan + 60,
    perusahaan: 'industri', metode: 'laporanKeuangan' },
  { nama: 'Walter Schloss', tahun: '1955', foto: 'schloss', warna: B.turq, masuk: () => T.walter + 10, data: '1955–2002', dataAt: () => T.warren + 20, perusahaan: 'otomotif', metode: 'saring' },
  { nama: 'Warren Buffett', tahun: '1965', foto: 'buffett', warna: B.orange, masuk: () => T.warren + 40, data: '19,9% / tahun', dataAt: () => T.setelah + 40,
    perusahaan: 'konsumsi', metode: 'modelValuasi' },
  { nama: 'Charlie Munger', tahun: '1978', foto: 'munger', warna: B.blue, masuk: () => T.investor + 10, data: '1978–2023', dataAt: () => T.investor + 40,
    perusahaan: 'ritel', metode: 'kualitas' },
  { nama: 'Seth Klarman', tahun: '1982', foto: 'klarman', warna: B.turq, masuk: () => T.investor + 30, data: 'Sejak 1982', dataAt: () => T.investor + 60,
    perusahaan: 'properti', metode: 'rasional' },
  { nama: 'Orbis', tahun: '1989', logo: 'logo/orbis.png', warna: B.orange, masuk: () => T.fund + 10, data: 'Sejak 1989', dataAt: () => T.fund + 40,
    perusahaan: 'kesehatan', metode: 'kriteria' },
];
/** kartu sorot tokoh yang DISEBUT: POP DI TENGAH saat namanya disebut, lalu MENGERUT ke lingkarannya di garis waktu (Simon: "mulai dari tengah" — dulu
 *  Schloss & Buffett memekar dari lingkaran di garis waktu). Schloss mengerut tuntas sebelum kartu Buffett pop (tidak bertumpuk). */
const SOROT: { i: number; masuk: number; kerut: number }[] = [
  { i: 0, masuk: T.cara, kerut: T.pendekatan + 20 },
  { i: 1, masuk: T.walter + 10, kerut: T.warren - 18 },
  { i: 2, masuk: T.warren + 40, kerut: T.setelah },
];
const uSorot = (f: number, s: { masuk: number; kerut: number }) => (popIn(f, s.masuk) > 0 ? 1 - cin(f, s.kerut) : 0);
/** y kartu sorot: Graham dari tengah frame naik ke KARTU.y bersama garis waktu tergambar */
const yKartu = (f: number, i: number) => (i === 0 ? lerp(PUSAT_Y, KARTU.y, cin(f, T.berhenti + 10)) : KARTU.y);
const sedangSorot = (f: number, i: number) => SOROT.some((s) => s.i === i && uSorot(f, s) > 0);

const PotretOrang: React.FC<{ o: Orang; x: number; y: number; d: number; p: number; naik: number }> = ({ o, x, y, d, p, naik }) =>
  o.foto ? <FotoLingkar foto={FOTO[o.foto]} x={x} y={y} d={d} p={p} naik={naik} warna={o.warna} />
    : o.logo ? <LogoLingkar src={o.logo} x={x} y={y} d={d} p={p} warna={o.warna} />
      : <Avatar x={x} y={y} d={d} p={p} warna={o.warna} />;

/** isi kartu sorot (lokal 860 × 280) */
export const IsiSorot: React.FC<{ f: number; i: number }> = ({ f, i }) => {
  const o = ORANG[i];
  const a = SOROT[i].masuk;
  return (
    <>
      <PotretOrang o={o} x={150} y={140} d={200} p={1} naik={cin(f, a + 20)} />
      <div style={{ position: 'absolute', left: 290, top: 44 }}>
        <WordText f={f} at={a + 20} style={{ fontFamily: F, fontSize: 46, fontWeight: 800, color: B.night }}>{o.nama}</WordText>
      </div>
      {i === 0 ? (
        <>
          <Chip x={290} y={150} jangkar="kiri" teks="1930-an" ikon="kalender" warna={B.blue} p={popIn(f, T.berhenti)} size={28} />
          <Chip x={290} y={222} jangkar="kiri" teks="Bapak value investing" ikon="kelas" warna={B.blue} p={popIn(f, T.graham + 10)} size={28} />
        </>) : null}
      {i === 1 ? (
        <>
          <Chip x={290} y={150} jangkar="kiri" teks="1955–2002" ikon="kalender" warna={B.turq} p={popIn(f, a + 40)} size={28} />
          <PilNominal x={290} y={222} teks="Lebih dari 4 dekade" arah={0} p={popIn(f, T.lebih)} size={28} jangkar="kiri" />
        </>) : null}
      {i === 2 ? (
        <>
          <Chip x={290} y={150} jangkar="kiri" teks="1965–2024" ikon="kalender" warna={B.orange} p={popIn(f, a + 40)} size={28} />
          <PilNominal x={290} y={222} teks="19,9% / tahun" arah={1} p={popIn(f, T.puluhan + 10)} size={28} jangkar="kiri" />
          <Img src={staticFile('logo/berkshire.png')} style={{ position: 'absolute', left: 0, top: 0, width: 250, height: 250 / 3.103, maxWidth: 'none',
            transformOrigin: 'center', transform: `${geser(580, 182)} scale(${skalaPop(popIn(f, T.berkshire + 10))})`, opacity: popIn(f, T.berkshire + 10) > 0.001 ? undefined : 0 }} />
        </>) : null}
    </>);
};
const KartuSorot: React.FC<{ f: number }> = ({ f }) => (
  <>
    {SOROT.map((s) => {
      const u = uSorot(f, s);
      if (u <= 0) return null;
      const o = ORANG[s.i];
      const b: GeoKartu = { ...KARTU, warna: o.warna, tab: 'atas' };
      // kartu POP di tengah (lingkarannya di garis waktu belum ada), lalu mengerut ke lingkarannya.
      // 2 Nov (Simon: "Transisi ke scene 3, jangan gunakan pop out, morphing aja"): kartu GRAHAM tidak pop — terbentuk dari kuil S02 yang MORF (empat
      // pilar bergabung jadi kartu ini, s02 KUIL_KE_KARTU); S03 baru menggambarnya sesudah morf selesai (T.cara + 30), utuh
      if (s.i === 0 && f < T.cara + 30) return null;
      if (f < s.kerut - 30) {
        return <Kaca key={s.i} x={KARTU.x} y={yKartu(f, s.i)} w={KARTU.w} h={KARTU.h} p={s.i === 0 ? 0.99996 : popIn(f, s.masuk)} warna={o.warna} tab="atas" padat>
          <MaskerBadan w={KARTU.w} h={KARTU.h} tab="atas"><IsiSorot f={f} i={s.i} /></MaskerBadan></Kaca>;
      }
      const d = dAt(f);
      return <KacaMorf key={s.i} a={geoBulat(SLOT[s.i], cyAt(f), d, o.warna)} b={b} t={Math.min(u, 0.9998)} padat
        isiA={<div style={{ position: 'absolute', inset: 0 }}><PotretOrang o={o} x={d / 2} y={d / 2} d={d} p={1} naik={s.i === 0 ? 1 : cin(f, o.masuk() + 20)} /></div>}
        isiB={<div style={{ position: 'absolute', inset: 0 }}><IsiSorot f={f} i={s.i} /></div>} />;
    })}
  </>);

/* ══════════════ BARISAN INVESTOR + GARIS WAKTU ══════════════ */
const Barisan: React.FC<{ f: number }> = ({ f }) => {
  const cy = cyAt(f), d = dAt(f), yG = yGaris(f);
  const g = cin(f, T.berhenti);
  const lintas = cin(f, T.lintas - 20), nyalaSemua = cin(f, T.lintas), satu = cin(f, T.satu) * (1 - nyalaSemua);
  // pita periode: Schloss 1955–2002 → Buffett 1965–2024 → "satu periode" (Buffett) → MELEBAR ke seluruh garis (bentuk yang sama dibawa)
  const pS = cin(f, T.dekade) * (1 - cin(f, T.warren)), pB = cin(f, T.puluhan) * (1 - cin(f, T.setelah)), pP = cin(f, T.periode);
  const pita = Math.max(pS, pB, pP);
  const [a0, a1] = pS > 0.001 && pB < 0.001 ? [xTahun(1955), xTahun(2002)] : [xTahun(1965), xTahun(2024)];
  const x0 = lerp(a0, AWAL_X - 30, lintas), x1 = lerp(a1, UJUNG + 30, lintas);
  const tahunAt = (i: number) => (i === 0 ? T.berhenti + 10 : i < 3 ? ORANG[i].masuk() + 20 : T.generasi + 10 * i);
  // kartu data kecil di bawah tahun: muncul saat investor ditinggal kartu sorotnya; keluar di "Mereka nggak membeli…" (lapis F menggantikan)
  const dataK = popOut(f, T.mereka - 20);
  const ikonP = (i: number) => popIn(f, T.perusahaan + 6 * i) * popOut(f, T.cara2 - 10);
  const metodeP = (i: number) => popIn(f, T.nilainya + 20 + 6 * i) * popOut(f, T.tapi + 10);
  const garisPola = cin(f, T.terus + 10);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {pita > 0.001 ? <rect x={x0} y={yG - 22} width={x1 - x0} height={44} rx={22} fill={rgba(B.turq, 0.24 * pita)} /> : null}
        <Penghubung d={`M ${AWAL_X} ${yG} L ${UJUNG} ${yG}`} g={g} warna={B.night} dash={false} titik={false} tebal={5} />
        {g > 0.001 ? <circle cx={AWAL_X} cy={yG} r={11 * skalaPop(popIn(f, T.berhenti - 20))} fill={B.night} /> : null}
        {ORANG.map((o, i) => {
          const p = popIn(f, i === 0 ? T.berhenti : o.masuk());
          return p <= 0.001 ? null : <circle key={i} cx={SLOT[i]} cy={yG} r={11 * skalaPop(p)} fill={B.white} stroke={o.warna} strokeWidth={5} />;
        })}
        {g > 0.9 ? <circle cx={UJUNG} cy={yG} r={11 * skalaPop(popIn(f, T.berhenti + 30))} fill={B.night} /> : null}
        {/* satu pola: garis putus-putus dari tiap investor ke kartu pola. 2 Nov (Simon: "Ketika semua figur sudah muncul, garis putus putus itu
            seharusnya terhubung menuju pannel" · sore: "garis ini masih belum berpusat ke 1 titik"): pangkal di cincin lingkaran, naik tegak lalu
            MELENGKUNG ke SATU titik = tengah tepi bawah kartu pola (dulu enam garis tegak sejajar) */}
        {garisPola > 0 ? SLOT.map((x, i) => {
          const y0 = cy - d / 2 - 2, y1 = POLA.y + POLA.h / 2, ym = (y0 + y1) / 2;
          return <Penghubung key={i} d={`M ${x} ${y0} C ${x} ${ym}, 960 ${ym}, 960 ${y1}`} g={garisPola} warna={ORANG[i].warna} titik={false} tebal={4} />;
        }) : null}
      </svg>
      {[{ x: AWAL_X, t: '1920', at: T.berhenti - 10 }, ...ORANG.map((o, i) => ({ x: SLOT[i], t: o.tahun, at: tahunAt(i) })), { x: UJUNG, t: '2026', at: T.berhenti + 30 }].map((l, k) => (
        <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 160, textAlign: 'center', transform: geser(l.x - 80, yG + 24) }}>
          <WordText f={f} at={l.at} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: ABU_TEKS }}>{l.t}</WordText>
        </div>))}
      {ORANG.map((o, i) => {
        // pindai f9492: dulu `f < mekar − 30` → di frame pertama morf potret di garis waktu kosong satu frame (bukan potret, belum KacaMorf).
        // Kini: tampil kapan pun kartunya tidak sedang terbuka/bermorf (Graham: baru ada sesudah kartunya mengerut).
        const tampil = i === 0 ? !sedangSorot(f, 0) && f >= SOROT[0].kerut : !sedangSorot(f, i);
        const p = popIn(f, o.masuk());
        return (
          <React.Fragment key={i}>
            <Pendar x={SLOT[i]} y={cy} d={d} s={Math.max(nyalaSemua, i === 2 ? satu : 0)} warna={o.warna} />
            {tampil ? <PotretOrang o={o} x={SLOT[i]} y={cy} d={d} p={i === 0 ? 1 : p} naik={i === 0 ? 1 : cin(f, o.masuk() + 20)} /> : null}
            {/* nama di bawah lingkaran — hanya saat barisan jadi fokus (nama sudah besar di kartu sorot) */}
            <Label x={SLOT[i]} y={cy + d / 2 + 28} teks={o.nama} f={f} at={i < 3 ? T.setelah + 20 + 8 * i : o.masuk() + 20} size={24} lebar={240} keluar={T.pola - 30} />
            <Chip x={SLOT[i]} y={yG + 100} teks={o.data} warna={o.warna} p={popIn(f, o.dataAt()) * dataK} size={20} />
            <KacaBulatIkon x={SLOT[i]} y={cy - d / 2 - 62} ikon={o.perusahaan} warna={o.warna} p={ikonP(i)} />
            <KacaBulatIkon x={SLOT[i]} y={cy - d / 2 - 62} ikon={o.metode} warna={o.warna} p={metodeP(i)} />
          </React.Fragment>);
      })}
    </>);
};
const KacaBulatIkon: React.FC<{ x: number; y: number; ikon: KunciIkon; warna: string; p: number }> = ({ x, y, ikon, warna, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 84, height: 84, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
    display: 'grid', placeItems: 'center', transform: `${geser(x - 42, y - 42)} scale(${skalaPop(p)})`, transformOrigin: 'center', boxShadow: bayanganKecil(warna) }}>
    <Icon name={ikon} size={46} color={warna} /></div>);

/* ══════════════ KARTU SATU POLA ══════════════ */
// 160–450 (dulu y 280 h 300 = 130–430): sudut kanan-atas kartu menyentuh ujung bawah wajik logo watermark (audit KENA-LOGO f11310–12300) → turun 30 px,
// isi dirapatkan 4 px; garis ke barisan tetap 34 px (lingkaran mulai y 500)
const POLA = { x: 960, y: 318, w: 1240, h: 290 }; // 2 Nov: tata letak S03 turun; sore: −20 → celah 88 px ke barisan untuk garis yang berkumpul
const LANGKAH: { ikon: KunciIkon; teks: string; at: () => number; warna: string }[] = [
  { ikon: 'alasan', teks: 'Pahami bisnis', at: () => T.pahami, warna: B.blue },
  { ikon: 'modelValuasi', teks: 'Nilai wajar', at: () => T.perkirakan, warna: B.turq },
  { ikon: 'rasional', teks: 'Bandingkan harga', at: () => T.bandingkan, warna: B.orange },
];
/** tiga langkah = ikon besar di atas, label di bawah (aturan label di bawah ikon), chevron di antaranya; simetris terhadap pusat kartu */
const KartuPola: React.FC<{ f: number }> = ({ f }) => {
  const p = popIn(f, T.pola + 20);
  // tengah dulu lalu memberi ruang (seluruh video, Simon: "Jika belum ada visual lain … bangun tepat di tengah") — dulu slot tetap, langkah 1 sendirian di kiri
  // 2 Nov: geser memberi ruang mulai 15 f sebelum pop (Simon S05: pop & swipe harus bersamaan, bukan pop dulu baru swipe)
  const n = 1 + cin(f, LANGKAH[1].at() - 15) + cin(f, LANGKAH[2].at() - 15);
  const xs = [0, 1, 2].map((j) => POLA.w / 2 + (j - (n - 1) / 2) * 390), yI = 154;
  return (
    <Kaca x={POLA.x} y={POLA.y} w={POLA.w} h={POLA.h} p={p} warna={CEK} tab="atas" tepi={cin(f, T.lintas)} padat>
      {/* 2 Nov (Simon: "Object didalam panel masking sesuai dengan area putih, agar ketika muncul tidak melewati pannel") — label yang naik dulu terlihat
          di bawah tepi kartu */}
      <MaskerBadan w={POLA.w} h={POLA.h} tab="atas">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 28, textAlign: 'center' }}>
        <WordText f={f} at={T.pola + 30} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Satu pola yang terus muncul</WordText>
      </div>
      {LANGKAH.map((l, k) => (
        <React.Fragment key={k}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 120, height: 120, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${l.warna}`,
            boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `${geser(xs[k] - 60, yI - 60)} scale(${skalaPop(popIn(f, l.at()))})`, transformOrigin: 'center',
            boxShadow: bayanganKecil(l.warna) }}><Icon name={l.ikon} size={64} color={l.warna} /></div>
          <div style={{ position: 'absolute', left: xs[k] - 200, width: 400, top: yI + 80, textAlign: 'center' }}>
            <WordText f={f} at={l.at() + 10} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{l.teks}</WordText>
          </div>
        </React.Fragment>))}
      {[0, 1].map((k) => <Chevron key={k} x={(xs[k] + xs[k + 1]) / 2} y={yI} warna={B.gray} p={popIn(f, LANGKAH[k + 1].at() - 20)} d={52} />)}
      </MaskerBadan>
    </Kaca>);
};

/* ══════════════ SCENE ══════════════ */
export const Scene03: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL - 60 || f > AKHIR + 70) return null;
  // akhir scene (30 Okt malam, Simon S04: "Transisi dari scene 3 ke scene 4, swipe keatas adegan scene 3 bersamaan dengan itu swipe keatas gurunya"):
  // SELURUH isi S03 swipe KE ATAS sampai keluar frame dalam 60 f yang SAMA dengan guru S04 naik dari bawah (pusat = S04 tA.guruMasuk, jarak ±guru
  // 870 px → keduanya bergerak bersama seperti didorong) — dulu swipe ke kiri berurutan
  const pusatNaik = S04_T.kenapa - 30;
  const naik = -R(f, pusatNaik - 30, pusatNaik + 30, 0, 1, io) * 900;
  const geserK = (_k: number) => (naik < -0.01 ? `translate3d(0, ${naik}px, 0)` : undefined);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, transform: geserK(0) }}>
        <Chip x={960} y={117} teks="Lintas generasi" ikon="kalender" warna={CEK} p={popIn(f, T.lintas)} size={32} />
        {f >= T.pola - 20 ? <KartuPola f={f} /> : null}
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: geserK(1) }}><Barisan f={f} /></div>
      <div style={{ position: 'absolute', inset: 0, transform: geserK(0) }}><KartuSorot f={f} /></div>
    </>);
};
export const S03_T = T;
