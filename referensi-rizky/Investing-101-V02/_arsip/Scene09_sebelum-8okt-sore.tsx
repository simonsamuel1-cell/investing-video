import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { gayaKamera, kamera } from '../kamera';
import { AWAL_GARIS10 } from '../s10/Scene10';
import { B, F, GAP, io, LINE, R } from '../theme';
import { Icon, WordText, cin, grow, lerp, popIn, popOut } from '../parts/kit';
import { Konektor, PanahBadge, PilKepala, denyut } from '../parts/rantai';
import { Judul } from '../s03/Scene03';

/**
 * SCENE 09 — ASET PRODUKTIF. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "STRONG BUSINESS (Brand · Scale · Market Position) ↓ PROFIT ↓ REINVESTMENT / CAPITAL ↓ EXPANSION ↓ MORE REVENUE ↓
 *           MORE PROFIT ↓ GROWTH"
 *   TEXT   "Aset produktif / bisa terus menciptakan nilai"
 * Empat susunan bersambung: (1) saham · RD saham · RD indeks → perusahaan produktif; (2) perusahaan menyatu jadi BISNIS → laba →
 * dipakai lagi (skala · produk · pasar baru); (3) bisnis yang kuat (brand · skala · posisi pasar · pendanaan); (4) ubin Laba naik jadi
 * awal SIKLUS laba → investasi kembali → ekspansi → laba lebih besar → tumbuh lagi, lalu "menunggu harga naik" dicoret.
 * Revisi 7 Okt (Simon: "beberapa visual … tidak terlalu menggambarkan scriptnya (contohnya scene 9)"): ADEGAN TANPA TEKS BARU yang
 * memperagakan kalimatnya — perusahaan membesar ("ruang pertumbuhan … jangka panjang"); koin laba mengalir dari Bisnis yang terus
 * beroperasi dan menumpuk; SEBAGIAN koin kembali lewat busur ("memakai sebagian laba"); koin ditanam ke skala · produk · pasar baru;
 * cincin perisai ("posisi yang kuat"); modal masuk dari pasar modal; modal + laba masuk ke Bisnis ("digunakan dengan baik") lalu
 * siklus terbentuk; titik siklus berputar PER PUTARAN (inOut cubic) dan simpul berdenyut saat dilewati. Masuk: isi Scene 08
 * menyusut ke ubin Saham. Waktu muncul 18f sebelum frasanya, jarak teks 16 px, kamera pusat.
 */
export const S9 = BATAS.s9;
export const IDE_S09_AWAL = S9;

const [saham, rdSaham, rdIndeks, perusahaan, produktif, pertumbuhan, jangka, belakangnya, bisnis, beroperasi, laba, memakai, sebagian,
  berkembang, skala, produk, pasar, banyak, besar, brand, skala2, posisi, kuat, akses, pendanaan, modal, kalau, modal2, laba2, digunakan, siklus,
  labaS, investasi, ekspansi, lebih, tumbuh, productive, menunggu, naik, menciptakan] =
  urut(['saham', 'reksa', 'indeks', 'perusahaan-perusahaan', 'produktif', 'pertumbuhan', 'jangka', 'belakangnya', 'bisnis', 'beroperasi',
    'laba', 'memakai', 'sebagian', 'berkembang', 'skala', 'produk', 'pasar', 'banyak', 'besar', 'brand', 'skala', 'posisi', 'kuat', 'akses',
    'pendanaan', 'modal', 'kalau', 'modal', 'laba', 'digunakan', 'siklus', 'laba', 'investasi', 'ekspansi', 'lebih', 'tumbuh', 'productive',
    'menunggu', 'naik', 'menciptakan'], S9);
/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;

/* ── geometri ── */
const XS = [620, 960, 1300];
const Y_INSTR = 380, Y_PER = 650;
/** ubin Saham pembuka: isi Scene 08 menyusut ke sini (masker) */
export const UBIN_SAHAM9 = { x: XS[0], y: Y_INSTR, d: 100 };
const INSTR: { teks: string; ikon: KunciIkon; col: string; at: number }[] = [
  { teks: 'Saham', ikon: 'saham', col: B.orange, at: saham },
  { teks: 'Reksa dana saham', ikon: 'rdSaham', col: B.turq, at: A0('reksa', rdSaham) + 50 },
  { teks: 'Reksa dana indeks', ikon: 'rdIndeks', col: B.turq, at: rdIndeks - 20 },
];
const JARAK = 16;
const BIS = { x: 701, y: 470, d: 190 };
const LABA = { x: 1171, y: 470, d: 130 };
/** tumpukan laba = BUNDEL uang (aset Simon, satu bundel dipisah: `public/uang/bundel.svg`, 312,8 × 251,1) yang BERTAMBAH satu per satu
 *  (Simon 8 Okt: "bukan tumpukannya membesar, tapi tumpukannya bertambah"); langkah antartingkat diukur dari aset aslinya (−4, −45) */
const BUNDEL = { w: 130, h: 130 * 251.1 / 312.8, naik: 45 * 130 / 312.8, geser: [0, -2, -6, -3] };
const TUMPUK = { x: LABA.x, bawah: LABA.y + LABA.d / 2 + JARAK + BUNDEL.h + 3 * 45 * 130 / 312.8 }; // 4 tingkat: puncak 16 px di bawah ubin
const tengahBundel = (j: number) => TUMPUK.bawah - BUNDEL.h / 2 - j * BUNDEL.naik;
/** lembar uang terbang (aset Simon, dipecah per lembar: `public/uang/lembar-N.svg`) */
const LEMBAR = [1, 3, 6, 8, 5, 7, 4];
const BAWAH = 790; // baris chip (ekspansi → kekuatan)
const EKS: { teks: string; ikon: KunciIkon; x: number; at: number }[] = [
  { teks: 'Skala usaha', ikon: 'skalaUsaha', x: 604, at: skala },
  { teks: 'Produk baru', ikon: 'produkLayanan', x: 964, at: produk },
  { teks: 'Pasar baru', ikon: 'pasarBaru', x: 1324, at: pasar + 20 },
];
const KUAT: { teks: string; ikon: KunciIkon; x: number; at: number }[] = [
  /* x dari lebar chip terukur (180 · 173 · 260 · 340) + jarak 80 → baris berpusat di 960 */
  // waktu = klausa masing-masing (muncul): Brand bersamaan dengan chip ekspansi pergi — tak ada momen tanpa chip (terukur: dulu 0,4 dtk kosong → kamera meleset 114 px)
  { teks: 'Brand', ikon: 'brand', x: 454, at: M('brand', brand) + 32 }, // +32: chip ekspansi (pergi di kata Banyak) sudah hilang — tak bertumpuk; tetap ±1 dtk sebelum kata brand
  { teks: 'Skala', ikon: 'skalaUsaha', x: 710, at: M('skala', skala2) },
  { teks: 'Posisi pasar', ikon: 'posisiPasar', x: 1006, at: M('posisi', posisi) },
  { teks: 'Akses pendanaan', ikon: 'pendanaan', x: 1386, at: M('pendanaan', pendanaan) },
];
/* siklus */
const CY = { x: 925, y: 560, r: 225 }; // −35: label kiri (Tumbuh lagi) lebih pendek dari kanan (Investasi kembali) → tinta berpusat di 960
const SUDUT = [-90, -18, 54, 126, 198];
const NODES: { teks: string; ikon: KunciIkon; at: number; label: 'atas' | 'kanan' | 'bawah' | 'kiri' }[] = [
  { teks: 'Laba', ikon: 'bisnisLaba', at: labaS, label: 'atas' },
  { teks: 'Investasi kembali', ikon: 'investasiKembali', at: investasi + 10, label: 'kanan' },
  { teks: 'Ekspansi', ikon: 'ekspansi', at: ekspansi, label: 'bawah' },
  { teks: 'Laba lebih besar', ikon: 'labaLebihBesar', at: lebih + 10, label: 'bawah' },
  { teks: 'Tumbuh lagi', ikon: 'pertumbuhan', at: tumbuh + 10, label: 'kiri' },
];
const rad = (d: number) => (d * Math.PI) / 180;
const posNode = (k: number) => ({ x: CY.x + Math.cos(rad(SUDUT[k])) * CY.r, y: CY.y + Math.sin(rad(SUDUT[k])) * CY.r });
const ND = 100;

/* ── waktu adegan (frame global) ── */
const LABA_AT = belakangnya + 58; // Laba muncul begitu tiga perusahaan selesai menyatu (klausa "di belakangnya ada bisnis … laba") — Bisnis tak pernah sendirian (terukur: dulu −290 px)
const KOIN_LABA = [beroperasi + 4, beroperasi + 40, laba - 30, laba + 6]; // empat koin laba: Bisnis → Laba (tumpuk)
const BALIK = [sebagian - 10, sebagian + 14]; // dua dari tiga koin kembali lewat busur ("sebagian")
const MASUK_MODAL = [pendanaan - 20, pendanaan + 30]; // modal dari pasar modal → Bisnis
const PAKAI = { modal: modal2 - 30, laba: laba2 - 30 }; // "modal dan laba itu digunakan dengan baik" → masuk ke Bisnis
const PUTAR = { mulai: tumbuh + 40, lap: 96 };
const PERGI = [BATAS.s10 + 1000, PAKAI.laba, BALIK[1], BALIK[0]]; // tumpukan j = 0 (bawah) … 3 (atas): dua teratas kembali lewat busur, satu dipakai, satu tetap // titik siklus: satu putaran = 96f inOut cubic

export const Scene09: React.FC<{ f: number }> = ({ f }) => {
  if (f < S9) return null;
  // KELUAR = milik Scene 10: MASKER LINGKARAN — siklus (pertumbuhan) menyusut ke TITIK AWAL garis harga Scene 10
  // ("Tentu saja, potensi pertumbuhan … nggak berarti perjalanannya selalu nyaman" — perjalanannya dimulai dari titik ini). 50f.
  if (f >= BATAS.s10 + 52) return null;
  const ex = R(f, BATAS.s10, BATAS.s10 + 50, 0, 1, io);
  const kam10 = kamera('S10', BATAS.s10 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { x: AWAL_GARIS10.x + kam10.x, y: AWAL_GARIS10.y + kam10.y, r: AWAL_GARIS10.r };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);

  const fase1 = 1 - cin(f, belakangnya + 10); // instrumen & perusahaan
  const satu = cin(f, belakangnya + 20); // perusahaan menyatu jadi bisnis
  const chipOut = cin(f, kalau + 10); // chip kekuatan pergi ("Kalau modal dan laba…")
  const fase23 = 1 - cin(f, siklus + 40); // bisnis pergi saat siklus terbentuk (Laba tidak sendirian di atas)
  const keSiklus = cin(f, siklus + 20); // ubin Laba naik jadi simpul Laba siklus
  // Bisnis membesar: berkembang lagi (+8%) · memperbesar skala (+8%)
  const sBis = 1 + 0.08 * R(f, berkembang - 10, berkembang + 40, 0, 1, io) + 0.08 * R(f, skala - 40, skala + 10, 0, 1, io)
    + 0.08 * R(f, besar - 30, besar + 30, 0, 1, io); // banyak perusahaan BESAR: membesar satu tingkat lagi
  const tibaBis = [...BALIK.map((t) => t + 50), ...MASUK_MODAL.map((t) => t + 50), PAKAI.modal + 50, PAKAI.laba + 50];
  const dnBis = Math.max(denyut(f, kuat), ...tibaBis.map((t) => denyut(f, t)), denyut(f, digunakan + 20));
  const perisai = popIn(f, M('kuat', kuat) + 20) * (1 - R(f, siklus - 20, siklus + 20, 0, 1, io));

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama di atas Scene 10 */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s10, BATAS.s10 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <Judul f={f} kata={['Aset', 'produktif', 'bisa', 'terus', 'menciptakan nilai']} at={M('productive', productive)} sorotAt={menciptakan + 30} size={46} />

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaKamera('S09', f)}>
        {/* ═════ 1) instrumen → perusahaan produktif ═════ */}
        {fase1 > 0.001 ? (
          <AbsoluteFill style={{ opacity: fase1, transform: `translateY(${-40 * (1 - fase1)}px)` }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              {XS.map((x, k) => <Konektor key={k} x1={x} y1={Y_INSTR + 50 + JARAK + 28 + JARAK} x2={x} y2={Y_PER - 50 - GAP} g={grow(f, perusahaan + 8 * k)} col={B.blue} />)}
            </svg>
            {INSTR.map((it, k) => (
              <Ubin key={it.teks} x={XS[k]} y={Y_INSTR} d={100} ikon={it.ikon} col={it.col} p={k === 0 ? (f >= S9 + 52 ? 1 : 0) : popIn(f, it.at)} /* Saham: diambil alih dari masker Scene 08, tanpa pop */
                label={<WordText f={f} at={it.at + 10} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>{it.teks}</WordText>} />))}
          </AbsoluteFill>) : null}
        {/* perusahaan produktif (tiga → menyatu jadi satu bisnis); "ruang pertumbuhan dalam jangka panjang" = membesar dua tahap */}
        {XS.map((x0, k) => {
          const p = popIn(f, perusahaan + 20 + 8 * k);
          if (p <= 0.001 || satu >= 0.999) return null;
          const tumbuh1 = R(f, pertumbuhan - 20 + 10 * k, pertumbuhan + 40 + 10 * k, 0, 1, io), tumbuh2 = R(f, jangka - 20 + 10 * k, jangka + 40 + 10 * k, 0, 1, io);
          const dPer = 100 * (1 + 0.16 * tumbuh1 + 0.16 * tumbuh2) * (1 - satu) + 100 * satu;
          const x = lerp(x0, BIS.x, satu), y = lerp(Y_PER, BIS.y, satu), d = lerp(dPer, BIS.d, satu);
          return (
            <React.Fragment key={k}>
              <Bulat x={x} y={y} d={d} col={B.blue} ikon="perusahaan" s={p} op={k === 1 ? 1 : 1 - satu} />
              <PanahBadge x={x0 + 0.36 * dPer} y={Y_PER - 0.36 * dPer} d={38} naik p={popIn(f, pertumbuhan + 8 * k) * fase1} flip={0} />
            </React.Fragment>);
        })}
        <PilKepala x={960} y={Y_PER + 110} p={popIn(f, produktif - 12) * popOut(f, belakangnya + 10)} teks="Perusahaan produktif" ikon="perusahaan" col={B.blue} />

        {/* ═════ 2–3) bisnis → laba → berkembang · bisnis yang kuat ═════ */}
        {fase23 > 0.001 && satu > 0.001 ? (
          <AbsoluteFill style={{ opacity: fase23 }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <Konektor x1={BIS.x + (BIS.d / 2) * sBis + GAP} y1={BIS.y} x2={LABA.x - LABA.d / 2 - GAP} y2={LABA.y} g={grow(f, LABA_AT + 10)} col={B.blue} />
              {/* sebagian laba dipakai lagi: busur dari laba kembali ke bisnis */}
              <BusurBalik g={grow(f, memakai)} />
              {EKS.map((e) => <Konektor key={e.teks} {...keTepiAtas(BIS, e.x, BAWAH)} g={grow(f, e.at - 10)} op={1 - R(f, banyak - 30, banyak + 10, 0, 1, io)} col={B.orange} />)} {/* panah MEMUDAR di tempat (menyusut = kepala panah menumpuk di label Bisnis) */}
            </svg>
            {/* cincin perisai: posisi yang kuat */}
            {perisai > 0.001 ? <div style={{ position: 'absolute', left: BIS.x - (BIS.d / 2) * sBis - 18, top: BIS.y - (BIS.d / 2) * sBis - 18, width: BIS.d * sBis + 36, height: BIS.d * sBis + 36, borderRadius: 999, border: `6px solid ${B.blueLite}`, transform: `scale(${perisai})`, boxShadow: `0 0 30px 4px ${B.blue}33` }} /> : null}
            {/* muncul PERSIS saat tiga perusahaan selesai menyatu (sebelumnya digambar oleh perusahaan tengah yang bergerak) */}
            <Bulat x={BIS.x} y={BIS.y} d={BIS.d} col={B.blue} ikon="perusahaan" s={sBis} op={satu >= 0.999 ? 1 : 0} denyut={dnBis} />
            <div style={{ position: 'absolute', left: BIS.x - 220, width: 440, top: BIS.y + (BIS.d / 2) * sBis + JARAK + (perisai > 0.001 ? 18 : 0), textAlign: 'center', lineHeight: 1 }}>
              <span style={{ opacity: 1 - cin(f, kuat) }}><WordText f={f} at={bisnis + 10} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Bisnis</WordText></span>
            </div>
            <div style={{ position: 'absolute', left: BIS.x - 220, width: 440, top: BIS.y + (BIS.d / 2) * sBis + JARAK + (perisai > 0.001 ? 18 : 0), textAlign: 'center', opacity: cin(f, kuat), lineHeight: 1 }}>
              <span style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Bisnis yang kuat</span>
            </div>
            {EKS.map((e) => <Chip key={e.teks} x={e.x} y={BAWAH} teks={e.teks} ikon={e.ikon} col={B.orange} p={popIn(f, e.at) * popOut(f, banyak) + denyut(f, e.at + 30)} />)}
            {KUAT.map((k) => <Chip key={k.teks} x={k.x} y={BAWAH} teks={k.teks} ikon={k.ikon} col={B.blue} p={popIn(f, k.at) * (1 - chipOut) + (k.teks === 'Akses pendanaan' ? Math.max(...MASUK_MODAL.map((t) => denyut(f, t))) : 0)} />)}

            {/* tumpukan uang laba di bawah ubin Laba: membesar tiap uang tiba (4), menyusut saat sebagian kembali & dipakai (3) */}
            <TumpukanLaba f={f} />
            {/* uang bergerak (aset Simon): Bisnis → Laba (beroperasi) · tumpukan → busur → Bisnis (sebagian) · Bisnis → chip ekspansi */}
            {KOIN_LABA.map((t0, j) => <UangGerak key={`l${j}`} f={f} t0={t0} durasi={40} jalur={(t) => ({ x: lerp(BIS.x + 110, LABA.x - 70, t), y: BIS.y })} lembar={LEMBAR[j]} />)}
            {BALIK.map((t0, j) => <UangGerak key={`b${j}`} f={f} t0={t0} durasi={50} jalur={(t) => busurTitik(t, tengahBundel(3 - j))} lembar={LEMBAR[4 + j]} />)}
            {EKS.map((e, j) => <UangGerak key={e.teks} f={f} t0={e.at - 10} durasi={40} jalur={(t) => { const k = keTepiAtas(BIS, e.x, BAWAH); return { x: lerp(k.x1, k.x2, t), y: lerp(k.y1, k.y2, t) }; }} lembar={LEMBAR[j + 1]} />)}
            {MASUK_MODAL.map((t0, j) => <KoinGerak key={`m${j}`} f={f} t0={t0} durasi={50} jalur={(t) => ({ x: lerp(KUAT[3].x - 60, BIS.x + 70, t), y: lerp(BAWAH - 40, BIS.y + 80, t) })} ikon="pendanaan" col={B.blue} />)}
            {/* "modal dan laba itu digunakan dengan baik": modal (biru, dari kiri-bawah) dan laba (oranye, lewat busur) masuk ke Bisnis */}
            <KoinGerak f={f} t0={PAKAI.modal} durasi={50} jalur={(t) => ({ x: lerp(BIS.x - 300, BIS.x - 60, t), y: lerp(BIS.y + 230, BIS.y + 60, t) - Math.sin(Math.PI * t) * 40 })} ikon="pendanaan" col={B.blue} />
            <UangGerak f={f} t0={PAKAI.laba} durasi={50} jalur={(t) => busurTitik(t, tengahBundel(1))} lembar={LEMBAR[6]} />
          </AbsoluteFill>) : null}

        {/* ═════ 4) siklus ═════ */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {/* slot putus-putus kelima posisi simpul: muncul saat "terbentuk siklus" (bisnis memudar) → susunan siklus utuh & berpusat sejak awal,
              tidak berat ke kanan saat simpul terisi searah jarum jam (terukur: dulu simpangan 102 px) */}
          {NODES.map((n, k) => {
            if (k === 0) return null;
            const op = cin(f, siklus + 40 + 8 * k) * (1 - R(f, n.at - 20, n.at + 10, 0, 1, io));
            const p = posNode(k);
            return op > 0.001 ? <circle key={`slot${k}`} cx={p.x} cy={p.y} r={ND / 2 - 2} fill={B.white} stroke={B.grayLite} strokeWidth={3} strokeDasharray="7 9" opacity={op} /> : null;
          })}
          {/* busur k digambar saat simpul k+1 muncul; busur penutup (Tumbuh lagi → Laba) sesudah Tumbuh lagi */}
          {NODES.map((_, k) => <Busur key={k} k={k} g={grow(f, k === 4 ? NODES[4].at + 20 : NODES[k + 1].at - 20)} />)}
          <TitikPutar f={f} />
        </svg>
        {NODES.map((n, k) => {
          if (k === 0 && f < LABA_AT - 30) return null;
          // simpul Laba = ubin Laba bagian 2 yang naik ke puncak siklus
          const pos = k === 0 ? { x: lerp(LABA.x, posNode(0).x, keSiklus), y: lerp(LABA.y, posNode(0).y, keSiklus) } : posNode(k);
          const d = k === 0 ? lerp(LABA.d, ND, keSiklus) : ND;
          const s = k === 0 ? popIn(f, LABA_AT) : popIn(f, n.at);
          const dn = k === 0 && keSiklus < 0.5 ? Math.max(...KOIN_LABA.map((t) => denyut(f, t + 40))) : denyutLewat(f, k) + (k === 4 ? denyut(f, menciptakan + 20) : 0);
          return (
            <React.Fragment key={n.teks}>
              <Bulat x={pos.x} y={pos.y} d={d} col={B.orange} ikon={n.ikon} s={s} denyut={dn} />
              <LabelNode n={n} x={pos.x} y={pos.y} d={d} f={f} at={k === 0 ? LABA_AT + 10 : n.at + 8} keAtas={keSiklus} />
            </React.Fragment>);
        })}
        <PanahBadge x={posNode(4).x - 36} y={posNode(4).y - 36} d={40} naik p={popIn(f, menciptakan)} flip={0} />

        {/* "bukan cuma menunggu harga naik" — dicoret */}
        <ChipCoret f={f} at={M('menunggu', menunggu)} coretAt={naik + 15} />
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.blue, opacity: R(f, BATAS.s10 + 22, BATAS.s10 + 48, 0, 1, io) }} /> : null}
    </AbsoluteFill>);
};

/** penghubung dari bawah lingkaran bisnis ke chip di baris bawah */
const keTepiAtas = (c: { x: number; y: number; d: number }, x2: number, y2: number) => {
  const x1 = c.x, y1 = c.y + c.d / 2 + 60;
  return { x1, y1, x2, y2: y2 - 34 };
};

/** busur balik laba → bisnis (kuadrat), dengan awal dari tumpukan koin (ydasar) lalu ke puncak busur */
const BUSUR = { x1: LABA.x, y1: LABA.y - LABA.d / 2 - GAP, x2: BIS.x + 30, y2: BIS.y - BIS.d / 2 - GAP };
const BUSUR_C = { x: (BUSUR.x1 + BUSUR.x2) / 2, y: Math.min(BUSUR.y1, BUSUR.y2) - 120 };
const busurTitik = (t: number, yDasar: number) => {
  // 0–0,25: naik dari tumpukan ke ujung busur (di atas ubin Laba, lewat sisi kanannya); 0,25–1: menyusuri busur ke Bisnis
  if (t < 0.25) {
    const u = t / 0.25;
    return { x: TUMPUK.x + Math.sin(Math.PI * u) * 95, y: lerp(yDasar, BUSUR.y1, u) };
  }
  const u = (t - 0.25) / 0.75;
  return { x: (1 - u) * (1 - u) * BUSUR.x1 + 2 * (1 - u) * u * BUSUR_C.x + u * u * BUSUR.x2, y: (1 - u) * (1 - u) * BUSUR.y1 + 2 * (1 - u) * u * BUSUR_C.y + u * u * BUSUR.y2 };
};

/** tumpukan laba: tiap uang yang tiba MENJATUHKAN satu bundel ke puncak tumpukan; saat sebagian kembali / dipakai, bundel teratas
 *  terangkat lalu pudar (lembar uangnya terbang dari situ). Ukuran bundel tetap — yang bertambah jumlah tingkatnya. */
const TumpukanLaba: React.FC<{ f: number }> = ({ f }) => (
  <>
    {KOIN_LABA.map((t0, j) => {
      const jatuh = R(f, t0 + 34, t0 + 52, 0, 1, io), angkat = R(f, PERGI[j], PERGI[j] + 14, 0, 1, io);
      const op = Math.min(1, jatuh * 3) * (1 - angkat);
      if (op <= 0.001) return null;
      const y = tengahBundel(j) - 34 * (1 - jatuh) - 30 * angkat;
      return <Img key={j} src={staticFile('uang/bundel.svg')} style={{ position: 'absolute', left: TUMPUK.x + BUNDEL.geser[j] - BUNDEL.w / 2, top: y - BUNDEL.h / 2, width: BUNDEL.w, height: BUNDEL.h, opacity: op }} />;
    })}
  </>);

/** selembar uang (aset Simon) bergerak di sepanjang `jalur(t)` (inOut cubic), berputar pelan, pudar di kedua ujung */
const UangGerak: React.FC<{ f: number; t0: number; durasi: number; jalur: (t: number) => { x: number; y: number }; lembar: number }> = ({ f, t0, durasi, jalur, lembar }) => {
  const t = R(f, t0, t0 + durasi, 0, 1, io);
  if (t <= 0 || t >= 1) return null;
  const p = jalur(t), op = Math.min(1, R(f, t0, t0 + 8, 0, 1, io), R(f, t0 + durasi - 8, t0 + durasi, 1, 0, io));
  return <Img src={staticFile(`uang/lembar-${lembar}.svg`)} style={{ position: 'absolute', left: p.x, top: p.y, width: 110, transform: `translate(-50%, -50%) rotate(${lerp(-14, 10, t)}deg)`, opacity: op }} />;
};

/** koin berikon bergerak di sepanjang `jalur(t)` (inOut cubic), pudar di kedua ujung */
const KoinGerak: React.FC<{ f: number; t0: number; durasi: number; jalur: (t: number) => { x: number; y: number }; ikon: KunciIkon; col: string }> = ({ f, t0, durasi, jalur, ikon, col }) => {
  const t = R(f, t0, t0 + durasi, 0, 1, io);
  if (t <= 0 || t >= 1) return null;
  const p = jalur(t), op = Math.min(1, R(f, t0, t0 + 8, 0, 1, io), R(f, t0 + durasi - 8, t0 + durasi, 1, 0, io));
  return (
    <div style={{ position: 'absolute', left: p.x - 24, top: p.y - 24, width: 48, height: 48, borderRadius: 99, background: col, border: `3px solid ${B.white}`, opacity: op, display: 'grid', placeItems: 'center', boxShadow: `0 6px 12px -6px ${col}aa` }}>
      <Icon name={ikon} size={26} color={B.white} />
    </div>);
};

/** lingkaran ikon */
const Bulat: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number; op?: number; denyut?: number }> = ({ x, y, d, col, ikon, s, op = 1, denyut: dn = 0 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: 99, background: col, display: 'grid', placeItems: 'center', transform: `scale(${s + dn})`, opacity: op, boxShadow: `0 14px 30px -12px ${col}aa` }}>
      <Icon name={ikon} size={d * 0.58} color={B.white} />
    </div>);

/** ubin + label di bawah */
const Ubin: React.FC<{ x: number; y: number; d: number; ikon: KunciIkon; col: string; p: number; label: React.ReactNode }> = ({ x, y, d, ikon, col, p, label }) =>
  p <= 0.001 ? null : (
    <>
      <Bulat x={x} y={y} d={d} col={col} ikon={ikon} s={p} />
      <div style={{ position: 'absolute', left: x - 170, width: 340, top: y + d / 2 + JARAK, textAlign: 'center', lineHeight: 1 }}>{label}</div>
    </>);

/** chip ikon + teks (anchor tengah) */
const Chip: React.FC<{ x: number; y: number; teks: string; ikon: KunciIkon; col: string; p: number }> = ({ x, y, teks, ikon, col, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}88` }}>
    <div style={{ width: 48, height: 48, borderRadius: 99, background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={32} color={B.white} /></div>
    {teks}
  </div>);

/** busur putus-putus: laba dipakai lagi oleh bisnis */
const BusurBalik: React.FC<{ g: number }> = ({ g }) => {
  if (g <= 0.001) return null;
  const { x1, y1, x2, y2 } = BUSUR, cx = BUSUR_C.x, cy = BUSUR_C.y;
  const n = 30, pts: string[] = [];
  for (let i = 0; i <= n * g; i++) {
    const t = i / n;
    pts.push(`${(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2},${(1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2}`);
  }
  const t = Math.min(1, g), ex = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, ey = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
  const dx = 2 * (1 - t) * (cx - x1) + 2 * t * (x2 - cx), dy = 2 * (1 - t) * (cy - y1) + 2 * t * (y2 - cy), a = Math.atan2(dy, dx), h = 14;
  return (
    <g>
      <polyline points={pts.join(' ')} fill="none" stroke={B.orange} strokeWidth={LINE.w + 0.5} strokeDasharray={LINE.dash} strokeLinecap="round" />
      {g > 0.95 ? <path d={`M${ex} ${ey} L${ex - h * Math.cos(a) + h * 0.6 * Math.sin(a)} ${ey - h * Math.sin(a) - h * 0.6 * Math.cos(a)} L${ex - h * Math.cos(a) - h * 0.6 * Math.sin(a)} ${ey - h * Math.sin(a) + h * 0.6 * Math.cos(a)} Z`} fill={B.orange} /> : null}
    </g>);
};

/** busur siklus dari simpul k ke k+1 (searah jarum jam), dengan kepala panah */
const Busur: React.FC<{ k: number; g: number }> = ({ k, g }) => {
  if (g <= 0.001) return null;
  const jarak = 17; // derajat dari pusat simpul (ruang untuk lingkaran)
  const a0 = SUDUT[k] + jarak, a1 = (k === 4 ? SUDUT[0] + 360 : SUDUT[k + 1]) - jarak;
  const aE = lerp(a0, a1, g);
  const n = 24, pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = rad(lerp(a0, aE, i / n));
    pts.push(`${CY.x + Math.cos(a) * CY.r},${CY.y + Math.sin(a) * CY.r}`);
  }
  const ex = CY.x + Math.cos(rad(aE)) * CY.r, ey = CY.y + Math.sin(rad(aE)) * CY.r, ta = rad(aE + 90), h = 15;
  return (
    <g>
      <polyline points={pts.join(' ')} fill="none" stroke={B.orange} strokeWidth={LINE.w + 1} strokeLinecap="round" />
      {g > 0.9 ? <path d={`M${ex + Math.cos(ta) * 4} ${ey + Math.sin(ta) * 4} L${ex - h * Math.cos(ta) + h * 0.6 * Math.sin(ta)} ${ey - h * Math.sin(ta) - h * 0.6 * Math.cos(ta)} L${ex - h * Math.cos(ta) - h * 0.6 * Math.sin(ta)} ${ey - h * Math.sin(ta) + h * 0.6 * Math.cos(ta)} Z`} fill={B.orange} /> : null}
    </g>);
};

/** sudut titik siklus: per putaran inOut cubic (berangkat & berhenti di Laba — siklus berulang), deterministik dari frame */
const sudutTitik = (f: number) => {
  const u = (f - PUTAR.mulai) / PUTAR.lap;
  if (u <= 0) return -90;
  const n = Math.floor(u), r = u - n;
  return -90 + 360 * (n + io(r));
};
/** titik yang terus berputar di lingkar siklus */
const TitikPutar: React.FC<{ f: number }> = ({ f }) => {
  const p = R(f, PUTAR.mulai - 30, PUTAR.mulai, 0, 1, io);
  if (p <= 0.001) return null;
  const a = rad(sudutTitik(f));
  return <circle cx={CY.x + Math.cos(a) * CY.r} cy={CY.y + Math.sin(a) * CY.r} r={13 * p} fill={B.white} stroke={B.orange} strokeWidth={5} />;
};
/** simpul siklus berdenyut saat titik melewatinya */
const denyutLewat = (f: number, k: number) => {
  if (f < PUTAR.mulai) return 0;
  const sel = ((((sudutTitik(f) - SUDUT[k]) % 360) + 540) % 360) - 180; // −180…180
  return Math.max(0, 1 - Math.abs(sel) / 24) ** 2 * 0.1;
};

/** label simpul siklus, di luar lingkar */
const LabelNode: React.FC<{ n: (typeof NODES)[number]; x: number; y: number; d: number; f: number; at: number; keAtas?: number }> = ({ n, x, y, d, f, at, keAtas = 1 }) => {
  const st: React.CSSProperties = { fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night };
  const isi = <WordText f={f} at={at} style={st}>{n.teks}</WordText>;
  // Laba: di KANAN ubin selama bagian 2 (atasnya dipakai busur balik), meluncur ke ATAS simpul saat naik ke puncak siklus (busur siklus keluar dari kanannya)
  if (n.label === 'atas') {
    const t = keAtas;
    return <div style={{ position: 'absolute', left: lerp(x + d / 2 + JARAK, x, t), top: lerp(y, y - d / 2 - JARAK, t), transform: `translate(${-50 * t}%, ${-50 - 50 * t}%)`, whiteSpace: 'nowrap', lineHeight: 1 }}>{isi}</div>;
  }
  if (n.label === 'kanan') return <div style={{ position: 'absolute', left: x + d / 2 + JARAK, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', lineHeight: 1 }}>{isi}</div>;
  if (n.label === 'kiri') return <div style={{ position: 'absolute', right: 1920 - (x - d / 2 - JARAK), top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', lineHeight: 1 }}>{isi}</div>;
  return <div style={{ position: 'absolute', left: x - 170, width: 340, top: y + d / 2 + JARAK, textAlign: 'center', lineHeight: 1 }}>{isi}</div>;
};

/** chip "Menunggu harga naik" — dicoret (bukan cuma itu); di dalam lingkar siklus: siklusnya yang menggantikan "menunggu" */
const ChipCoret: React.FC<{ f: number; at: number; coretAt: number }> = ({ f, at, coretAt }) => {
  const p = popIn(f, at);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  return (
    <div style={{ position: 'absolute', left: CY.x, top: CY.y + 40, transform: `translate(-50%, -50%) scale(${p})`, opacity: 1 - 0.35 * coret, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${B.gray}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 26, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', lineHeight: 1 }}>
      <div style={{ width: 42, height: 42, borderRadius: 99, background: B.gray, display: 'grid', placeItems: 'center' }}><Icon name="naikTurunHarga" size={28} color={B.white} /></div>
      Menunggu harga naik
      <div style={{ position: 'absolute', left: 14, top: '50%', height: 4, marginTop: -2, width: `calc(${coret} * (100% - 28px))`, background: B.night, borderRadius: 2 }} />
    </div>);
};

export const S09_BEAT = { saham, rdSaham, rdIndeks, perusahaan, pertumbuhan, belakangnya, bisnis, laba, memakai, skala, produk, pasar, banyak, brand, skala2, posisi, kuat, akses, pendanaan, modal, kalau, siklus, labaS, investasi, ekspansi, lebih, tumbuh, productive, menunggu, naik, menciptakan };
