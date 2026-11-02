import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { AWAL_GARIS10 } from '../s10/Scene10';
import { B, CORET, F, GAP, io, LINE, R, WARNA, mixHex } from '../theme';
import { Icon, WordText, cin, grow, lerp, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Konektor, PanahBadge, PilKepala } from '../parts/rantai';
import { LembarUang, TumpukanUang, UNIT_UANG, atasTumpukan, puncakUnit } from '../parts/uang';
import { Judul } from '../s03/Scene03';
import { PilNominal, rpMiliar } from '../parts/nominal';

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
 * Revisi 8 Okt (Simon, brief Reksa Dana & Saham: "konteksnya diperjelas · perbesar visual · ganti warna (uang) · setiap visual center ·
 * hapus animasi yang tidak diperlukan"): uang = lembar & bundel HIJAU aset Simon (dulu turkis), modal dari pasar modal = lembar hijau
 * (dulu koin biru); tag coret "Menunggu harga naik" → MERAH (CORET, aturan semua tag dicoret); ubin, simpul, chip & label diperbesar;
 * Saham di TENGAH (masker Scene 08 mendarat di tengah layar, lalu naik saat RD saham & RD indeks muncul BERSAMA di kiri-kanan → susunan
 * simetris di setiap momen); dibuang: cincin perisai, titik yang terus berputar di siklus + denyut simpulnya. Kamera diam (geometri berpusat).
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
void digunakan;
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;

/* ── geometri ── */
const XS = [960, 560, 1360]; // Saham di tengah, RD saham kiri, RD indeks kanan
const Y_INSTR = 335, Y_PER = 635, D_UBIN = 130;
const Y_BARIS0 = 518; // baris ubin SENDIRIAN (sebelum perusahaan muncul): ubin + nama berpusat di y 540
/** ubin Saham pembuka: isi Scene 08 menyusut ke sini (masker) */
export const UBIN_SAHAM9 = { x: XS[0], y: 528, d: D_UBIN }; // sendirian di tengah layar: 528 = tengah antara "ubin saja" (−12) & "ubin + label" (+12); dulu 540 → +30 px sesudah label muncul. Naik ke barisnya saat RD muncul
const INSTR: { teks: string; ikon: KunciIkon; col: string; at: number }[] = [
  { teks: 'Saham', ikon: 'saham', col: B.orange, at: saham },
  { teks: 'Reksa dana saham', ikon: 'rdSaham', col: B.turq, at: A0('reksa', rdSaham) + 30 }, // RD saham & RD indeks muncul BERSAMA (satu klausa)
  { teks: 'Reksa dana indeks', ikon: 'rdIndeks', col: WARNA.turkisMuda, at: A0('reksa', rdSaham) + 50 },
];
const JARAK = 16;
// Simon 9 Okt: label Bisnis & Laba "pindah ke bawah juga" → keduanya naik 50 px (470 → 420) supaya label "Laba" muat di antara ubin dan
// tumpukan uang (celah 16 px; tumpukan tetap di tempatnya, baris chip di bawahnya tidak terganggu)
const BIS = { x: 695, y: 420, d: 210 };
const LABA = { x: 1165, y: 420, d: 150 };
/** laba = KLASTER beberapa tumpukan bundel hijau berbayang (Simon 8 Okt: "tidak cuman 1 tumpukan uang, tapi ada beberapa 4-5 tumpukan,
 *  tambahkan bayangan"): 4 tumpukan, BERTAMBAH tiap uang laba tiba, dan PERGI saat sebagian kembali / dipakai (satu tetap). Puncak klaster
 *  ±14 px di bawah ubin Laba; dasar + bayangan ±693 — panah ke chip ekspansi lewat di bawahnya tanpa bersentuhan. */
/** laba = TUMPUKAN UANG seperti acuan Simon (9 Okt: tumpukan tinggi di tengah, kiri & kanan, depan, lembar tergeletak, menara koin) —
 *  unsur BERTAMBAH tiap uang laba tiba, dan sebagian PERGI saat laba kembali / dipakai. Puncak ≥ 14 px di bawah ubin Laba. */
const TUMPUK = { x: LABA.x - 0.21 * 96, dasar: 717, W: 96 }; // tumpukan Simon: kotak bundelnya berpusat di x + 0,21 W → tepat di bawah ubin Laba
const puncak = (i: number) => puncakUnit(TUMPUK.x, TUMPUK.dasar, TUMPUK.W, i);
/** lembar uang terbang (aset Simon, dipecah per lembar: `public/uang/lembar-N.svg`) */
const LEMBAR = [1, 3, 6, 8, 5, 7, 4];
const BAWAH = 830; // baris chip (ekspansi → kekuatan); puncak chip 726 > dasar tumpukan laba 721 (tak bersentuhan)
/** ekspansi = KIPAS RADIAL dari ikon Bisnis (Simon 8 Okt: "panjang garis penghubung harus sama dan terpusat di icon bisnis"): tiga chip
 *  pada jarak SAMA dari pusat Bisnis (sudut 135° · 90° · 45°), penghubung sama panjang di sepanjang sinarnya; tiap chip muncul DI KATANYA,
 *  warna berbeda (konteks mirip → warna beda; Simon 8 Okt) */
const KIPAS = { r: 330, ujung: 64 }; // jarak pusat chip dari pusat Bisnis · jarak ujung panah dari pusat chip
const EKS: { teks: string; ikon: KunciIkon; sudut: number; at: number; col: string }[] = [
  { teks: 'Skala usaha', ikon: 'skalaUsaha', sudut: 135, at: skala, col: WARNA.ungu },
  { teks: 'Produk baru', ikon: 'produkLayanan', sudut: 90, at: produk, col: WARNA.turkis },
  { teks: 'Pasar baru', ikon: 'pasarBaru', sudut: 45, at: pasar, col: WARNA.oranyeMuda },
];
const posEks = (e: (typeof EKS)[number]) => ({ x: BIS.x + Math.cos((e.sudut * Math.PI) / 180) * KIPAS.r, y: BIS.y + Math.sin((e.sudut * Math.PI) / 180) * KIPAS.r });
const KUAT: { teks: string; ikon: KunciIkon; x: number; at: number }[] = [
  /* x dari lebar chip terukur (180 · 173 · 260 · 340) + jarak 80 → baris berpusat di 960 */
  // waktu = klausa masing-masing (muncul): Brand bersamaan dengan chip ekspansi pergi — tak ada momen tanpa chip (terukur: dulu 0,4 dtk kosong → kamera meleset 114 px)
  { teks: 'Brand', ikon: 'brand', x: 454, at: brand }, // tiap chip muncul DI KATANYA (Simon: satu per satu sesuai voice)
  { teks: 'Skala', ikon: 'skalaUsaha', x: 710, at: skala2 },
  { teks: 'Posisi pasar', ikon: 'posisiPasar', x: 1006, at: posisi },
  { teks: 'Akses pendanaan', ikon: 'pendanaan', x: 1386, at: pendanaan },
];
const WARNA_KUAT = [WARNA.langit, WARNA.ungu, WARNA.oranye, WARNA.turkisMuda]; // skala = warna "skala usaha" (konsep sama)
const LEBAR_KUAT = [180, 173, 260, 340]; // lebar chip terukur (lihat KUAT) — ukuran slot pil
/* siklus — Simon 9 Okt: (1) "text icon taro saja dibawah iconnya · alignment ke tengah frame · text yang dicoret juga tidak center tengah";
 * (2) "buat saja jadi seperti dicontohku ini (lingkar 5 simpul mengelilingi pusat, panah menyusuri lingkar), tapi tetap pertahankan text
 * dibawah iconnya — yang ingin aku ubah hanya layoutnya saja". Contoh = acuan SUSUNAN saja (ikon/warna/gaya rumah tetap; tanpa glow).
 * Lingkar = LINGKARAN r 320 (puncak simpul atas y 162 — 40 px di bawah judul, dasar label bawah 905) berpusat di (960, 540);
 * tag coret di pusatnya = pusat frame. Sudut simpul simetris kiri-kanan: simpul samping dinaikkan ke ±34° (bukan 18° pentagon) supaya label
 * di bawahnya berjarak 41 px DI ATAS tag coret (pada 18° label sejajar tag, celah 17 px → terbaca satu baris). Label samping memotong
 * lingkar → busur yang lewat di situ BERHENTI/MULAI di bawah labelnya (dihitung, bukan ditebak): tanpa tumpang tindih. */
const CY = { x: 960, y: 540 };
const ELIPS = { rx: 320, ry: 320 }; // LINGKARAN sejati (Simon: "ini bukan lingkaran tapi oval" — dulu rx 361 × ry 320)
// simpul samping ±38° (dulu ±34°): label dua baris "Investasi / kembali" tetap 15 px di atas tag coret
const SUDUT = [-90, -38, 54, 126, 218];
const NODES: { teks: string; ikon: KunciIkon; at: number; col: string }[] = [
  { teks: 'Laba', ikon: 'bisnisLaba', at: labaS, col: WARNA.oranye },
  { teks: 'Investasi kembali', ikon: 'investasiKembali', at: investasi, col: WARNA.biru },
  { teks: 'Ekspansi', ikon: 'ekspansi', at: ekspansi, col: WARNA.turkis },
  { teks: 'Laba lebih besar', ikon: 'labaLebihBesar', at: lebih, col: WARNA.oranyeMuda },
  { teks: 'Tumbuh lagi', ikon: 'pertumbuhan', at: tumbuh, col: WARNA.langit },
];
const rad = (d: number) => (d * Math.PI) / 180;
const titikElips = (deg: number) => ({ x: CY.x + Math.cos(rad(deg)) * ELIPS.rx, y: CY.y + Math.sin(rad(deg)) * ELIPS.ry });
const posNode = (k: number) => titikElips(SUDUT[k]);
const ND = 116;

/* ── waktu adegan (frame global) ── */
const LABA_AT = belakangnya + 58; // Laba muncul begitu tiga perusahaan selesai menyatu (klausa "di belakangnya ada bisnis … laba") — Bisnis tak pernah sendirian (terukur: dulu −290 px)
const KOIN_LABA = [belakangnya + 58, beroperasi + 20, laba - 30, laba + 6]; // empat lembar laba: Bisnis → Laba (tumpuk); yang pertama BERSAMA ubin Laba muncul → tinggi susunan tetap (terukur: dulu pusat 493 → 542)
const BALIK = [sebagian - 10, sebagian + 14]; // dua dari tiga koin kembali lewat busur ("sebagian")
const MASUK_MODAL = [pendanaan - 20, pendanaan + 30]; // modal dari pasar modal → Bisnis
const PAKAI = { modal: modal2 - 30, laba: laba2 - 30 }; // "modal dan laba itu digunakan dengan baik" → masuk ke Bisnis
/** tumpukan i: tiba (dua yang pertama bersama ubin Laba) · pergi (dua kembali lewat busur "sebagian", satu dipakai; dua tetap) */
/** bundel i tumpukan Simon (tumpukan t: 0 belakang-tinggi · 1 kanan-tengah · 2 kiri-tengah · 3 kanan-depan · 4 kiri-depan · 5 depan)
 *  tiba bersama uang laba ke-k (belakang-tinggi + kanan-depan bersama ubin Laba → tepi atas & kanan susunan sejak awal), jenjang 3f;
 *  pergi: puncak kanan-depan & kanan-tengah kembali lewat busur ("sebagian"), puncak depan dipakai */
const GEL_TUMPUK = [0, 1, 1, 0, 2, 3];
const TIBA_T = UNIT_UANG.map((u, i) => { const k = GEL_TUMPUK[u.t]; return KOIN_LABA[k] + 34 + 3 * UNIT_UANG.slice(0, i).filter((v) => GEL_TUMPUK[v.t] === k).length; });
const ASAL_BALIK = [atasTumpukan(3), atasTumpukan(1)], ASAL_PAKAI = atasTumpukan(5); // sisi kanan: jalur naik memutari ubin Laba di sisi kanannya
const PERGI_T = UNIT_UANG.map((_, i) => (i === ASAL_BALIK[0] ? BALIK[0] : i === ASAL_BALIK[1] ? BALIK[1] : i === ASAL_PAKAI ? PAKAI.laba : 1e9)); // 1e9 = tidak pergi (interpolate menolak Infinity)

export const Scene09: React.FC<{ f: number }> = ({ f }) => {
  if (f < S9) return null;
  // KELUAR = milik Scene 10: MASKER LINGKARAN — siklus (pertumbuhan) menyusut ke TITIK AWAL garis harga Scene 10
  // ("Tentu saja, potensi pertumbuhan … nggak berarti perjalanannya selalu nyaman" — perjalanannya dimulai dari titik ini). 50f.
  if (f >= BATAS.s10 + 52) return null;
  const ex = R(f, BATAS.s10, BATAS.s10 + 50, 0, 1, io);
  const kam10 = kamera('S10', BATAS.s10 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam10, AWAL_GARIS10), r: AWAL_GARIS10.r * kam10.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  const kam = kamera('S09', f);

  const fase1 = 1 - cin(f, belakangnya + 10); // instrumen & perusahaan
  const naikSaham = R(f, A0('reksa', rdSaham), A0('reksa', rdSaham) + 60, 0, 1, io); // Saham (tengah layar) naik ke barisnya saat RD muncul
  // baris ubin berpusat di layar selama sendirian; naik memberi tempat perusahaan saat "perusahaan-perusahaan produktif" (terukur: dulu −166 px)
  const rowY = lerp(Y_BARIS0, Y_INSTR, R(f, perusahaan - 40, perusahaan + 20, 0, 1, io));
  const satu = cin(f, belakangnya + 20); // perusahaan menyatu jadi bisnis
  const chipOut = cin(f, kalau + 10); // chip kekuatan pergi ("Kalau modal dan laba…")
  const fase23 = 1 - cin(f, siklus + 40); // bisnis pergi saat siklus terbentuk (Laba tidak sendirian di atas)
  const keSiklus = cin(f, siklus + 20); // ubin Laba naik jadi simpul Laba siklus
  /* Simon 9 Okt: "untuk visualisasi berkembang alih alih membesarkan iconnya, tambahkan nominal sebagai gambaran 'value' perusahaan" →
   * Bisnis TIDAK lagi membesar (dulu +8 % ×3); value-nya naik di "berkembang" · "skala" · "besar": Rp300 M → Rp520 M (miliar) */
  const sBis = 1;
  const valueBis = 300 + 60 * R(f, berkembang - 10, berkembang + 40, 0, 1, io) + 70 * R(f, skala - 40, skala + 10, 0, 1, io) + 90 * R(f, besar - 30, besar + 30, 0, 1, io);

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama di atas Scene 10 */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s10, BATAS.s10 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <Judul f={f} kata={['Aset', 'produktif', 'bisa', 'terus', 'menciptakan nilai']} at={M('productive', productive)} sorotAt={menciptakan + 30} size={46} />

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s10 - 30)}>
        {/* ═════ 1) instrumen → perusahaan produktif ═════ */}
        {fase1 > 0.001 ? (
          <AbsoluteFill style={{ opacity: fase1, transform: `translateY(${-40 * (1 - fase1)}px)` }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              {XS.map((x, k) => <Konektor key={k} x1={x} y1={rowY + D_UBIN / 2 + JARAK + 32 + JARAK} x2={x} y2={Y_PER - D_UBIN / 2 - GAP} g={grow(f, perusahaan + 8 * k)} col={B.blue} />)}
            </svg>
            {INSTR.map((it, k) => (
              <Ubin key={it.teks} x={XS[k]} y={k === 0 ? lerp(UBIN_SAHAM9.y, rowY, naikSaham) : rowY} d={D_UBIN} ikon={it.ikon} col={it.col} p={k === 0 ? (f >= S9 + 52 ? 1 : 0) : popIn(f, it.at)} /* Saham: diambil alih dari masker Scene 08, tanpa pop */
                label={<WordText halus f={f} at={k === 0 ? saham - 10 : it.at + 10} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{it.teks}</WordText>} />))}
          </AbsoluteFill>) : null}
        {/* perusahaan produktif (tiga → menyatu jadi satu bisnis); "ruang pertumbuhan dalam jangka panjang" = VALUE naik dua tahap
            (Rp100 M → Rp180 M → Rp300 M; dulu ikon membesar dua tahap + lencana ▲) */}
        {XS.map((x0, k) => {
          const p = popIn(f, perusahaan + 20 + 8 * k);
          if (p <= 0.001 || satu >= 0.999) return null;
          const tumbuh1 = R(f, pertumbuhan - 20 + 10 * k, pertumbuhan + 40 + 10 * k, 0, 1, io), tumbuh2 = R(f, jangka - 20 + 10 * k, jangka + 40 + 10 * k, 0, 1, io);
          const dPer = D_UBIN;
          const x = lerp(x0, BIS.x, satu), y = lerp(Y_PER, BIS.y, satu), d = lerp(dPer, BIS.d, satu);
          return (
            <React.Fragment key={k}>
              <Bulat x={x} y={y} d={d} col={B.blue} ikon="perusahaan" s={p} op={k === 1 ? 1 : 1 - satu} />
              <PilNominal x={x0 + 0.3 * dPer} y={Y_PER - 0.42 * dPer} jangkar="kiri" teks={rpMiliar(100 + 80 * tumbuh1 + 120 * tumbuh2, 0)} arah={R(tumbuh1, 0, 0.5, 0, 1)} p={popIn(f, pertumbuhan - 20 + 8 * k) * fase1 * (1 - satu)} size={24} lebarMin={124} />
            </React.Fragment>);
        })}
        <PilKepala x={960} y={Y_PER + 140} p={popIn(f, produktif - 12) * popOut(f, belakangnya + 10)} teks="Perusahaan produktif" ikon="perusahaan" col={B.blue} />

        {/* ═════ 2–3) bisnis → laba → berkembang · bisnis yang kuat ═════ */}
        {fase23 > 0.001 && satu > 0.001 ? (
          <AbsoluteFill style={{ opacity: fase23 }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              {/* panah Bisnis → Laba memudar 30f SEBELUM ubin Laba naik ke lingkaran (dulu bersama bagian 2 → label Laba melintas di atasnya) */}
              <Konektor x1={BIS.x + (BIS.d / 2) * sBis + GAP} y1={BIS.y} x2={LABA.x - LABA.d / 2 - GAP} y2={LABA.y} g={grow(f, LABA_AT + 10)} op={1 - cin(f, siklus - 5, 30)} col={B.blue} />
              {/* sebagian laba dipakai lagi: busur dari laba kembali ke bisnis */}
              <BusurBalik g={grow(f, memakai)} />
              {EKS.map((e) => <Konektor key={e.teks} {...sinarEks(e, sBis)} g={grow(f, e.at - 20)} op={1 - R(f, banyak - 30, banyak + 10, 0, 1, io)} col={e.col} />)} {/* panah MEMUDAR di tempat */}
            </svg>
            {/* muncul PERSIS saat tiga perusahaan selesai menyatu (sebelumnya digambar oleh perusahaan tengah yang bergerak) */}
            <Bulat x={BIS.x} y={BIS.y} d={BIS.d} col={B.blue} ikon="perusahaan" s={sBis} op={satu >= 0.999 ? 1 : 0} />
            {/* nominal: value bisnis (miliar) naik saat bisnis berkembang — di kiri-atas ikonnya (busur laba masuk dari kanan-atas) */}
            <PilNominal x={BIS.x - 40} y={BIS.y - BIS.d / 2 - 26} jangkar="kanan" teks={rpMiliar(valueBis, 0)} arah={R(valueBis, 300, 330, 0, 1)} p={popIn(f, bisnis + 20) * (satu >= 0.999 ? 1 : 0)} size={26} lebarMin={140} />
            {/* label di BAWAH ikon (Simon 9 Okt: "pindah ke bawah juga"; dulu di kiri). Kipas ekspansi kini mulai di bawah label (sinarEks) */}
            <div style={{ position: 'absolute', left: BIS.x - 220, width: 440, top: BIS.y + (BIS.d / 2) * sBis + JARAK, textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1 }}>
              <span style={{ opacity: 1 - cin(f, kuat) }}><WordText halus f={f} at={bisnis + 10} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Bisnis</WordText></span>
            </div>
            <div style={{ position: 'absolute', left: BIS.x - 220, width: 440, top: BIS.y + (BIS.d / 2) * sBis + JARAK, textAlign: 'center', whiteSpace: 'nowrap', opacity: cin(f, kuat), lineHeight: 1 }}>
              <span style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Bisnis yang kuat</span>
            </div>
            {/* chip muncul SATU PER SATU di katanya (pop easeOutBack) */}
            {EKS.map((e) => <Chip key={e.teks} {...posEks(e)} teks={e.teks} ikon={e.ikon} col={e.col} p={popIn(f, e.at) * popOut(f, banyak)} />)}
            {/* slot pil putus-putus keempat chip kekuatan muncul di "Banyak perusahaan…" TEPAT saat kipas ekspansi pergi (bahasa slot S05/S13): tapak baris penuh sejak awal →
                kamera tidak mengejar baris yang tumbuh ke kanan (dulu kunci otomatis bolak-balik 131 → −4 px); tiap slot pudar saat chipnya pop */}
            {KUAT.map((k, i) => {
              const op = popIn(f, banyak + 8 * i) * (1 - R(f, k.at - 20, k.at + 10, 0, 1, io)) * (1 - chipOut);
              return op > 0.001 ? <div key={`slot${i}`} style={{ position: 'absolute', left: k.x - LEBAR_KUAT[i] / 2, top: BAWAH - 37.5, width: LEBAR_KUAT[i], height: 75, borderRadius: 999, border: `3px dashed ${B.grayLite}`, background: B.white, boxSizing: 'border-box', opacity: Math.min(1, op), transform: `scale(${Math.min(0.99996, popIn(f, banyak + 8 * i))})` }} /> : null;
            })}
            {KUAT.map((k, i) => <Chip key={k.teks} x={k.x} y={BAWAH} teks={k.teks} ikon={k.ikon} col={WARNA_KUAT[i]} p={popIn(f, k.at) * (1 - chipOut)} />)}

            {/* tumpukan uang laba di bawah ubin Laba: membesar tiap uang tiba (4), menyusut saat sebagian kembali & dipakai (3) */}
            <TumpukanLaba f={f} />
            {/* uang bergerak (aset Simon): Bisnis → Laba (beroperasi) · tumpukan → busur → Bisnis (sebagian) · Bisnis → chip ekspansi */}
            {KOIN_LABA.map((t0, j) => <UangGerak key={`l${j}`} f={f} t0={t0} durasi={40} jalur={(t) => ({ x: lerp(BIS.x + 110, LABA.x - 70, t), y: BIS.y })} lembar={LEMBAR[j]} />)}
            {BALIK.map((t0, j) => <UangGerak key={`b${j}`} f={f} t0={t0} durasi={50} jalur={(t) => busurTitik(t, puncak(ASAL_BALIK[j]))} lembar={LEMBAR[4 + j]} />)}
            {EKS.map((e, j) => <UangGerak key={e.teks} f={f} t0={e.at - 10} durasi={40} jalur={(t) => { const k = sinarEks(e, sBis); return { x: lerp(k.x1, k.x2, t), y: lerp(k.y1, k.y2, t) }; }} lembar={LEMBAR[j + 1]} />)}
            {MASUK_MODAL.map((t0, j) => <KoinGerak key={`m${j}`} f={f} t0={t0} durasi={50} jalur={(t) => ({ x: lerp(KUAT[3].x - 60, BIS.x + 70, t), y: lerp(BAWAH - 40, BIS.y + 80, t) })} ikon="pendanaan" col={B.blue} />)}
            {/* "modal dan laba itu digunakan dengan baik": modal (biru, dari kiri-bawah) dan laba (oranye, lewat busur) masuk ke Bisnis */}
            <KoinGerak f={f} t0={PAKAI.modal} durasi={50} jalur={(t) => ({ x: lerp(BIS.x - 300, BIS.x - 60, t), y: lerp(BIS.y + 230, BIS.y + 60, t) - Math.sin(Math.PI * t) * 40 })} ikon="pendanaan" col={B.blue} />
            <UangGerak f={f} t0={PAKAI.laba} durasi={50} jalur={(t) => busurTitik(t, puncak(ASAL_PAKAI))} lembar={LEMBAR[6]} />
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
          {/* JALUR putus-putus kelima busur muncul bersama slotnya (bahasa slot): busur kanan terisi lebih dulu dari busur kiri — tanpa jalur
              ini susunan berat ke kanan selama pembentukan siklus (terukur 83 px); kini tapaknya simetris sejak awal, warna mengisi di atasnya */}
          {RENTANG.map(([a, b], k) => {
            const op = cin(f, siklus + 40 + 8 * k);
            return op > 0.001 ? <polyline key={`jalur${k}`} points={polyElips(a, b)} fill="none" stroke={B.grayLite} strokeWidth={LINE.w} strokeDasharray="7 9" strokeLinecap="round" opacity={op} /> : null;
          })}
          {/* busur k digambar saat simpul k+1 muncul; busur penutup (Tumbuh lagi → Laba) sesudah Tumbuh lagi */}
          {NODES.map((_, k) => <Busur key={k} k={k} g={grow(f, k === 4 ? NODES[4].at + 20 : NODES[k + 1].at - 20)} />)}
        </svg>
        {NODES.map((n, k) => {
          if (k === 0 && f < LABA_AT - 30) return null;
          // simpul Laba = ubin Laba bagian 2 yang naik ke puncak siklus
          const pos = k === 0 ? { x: lerp(LABA.x, posNode(0).x, keSiklus), y: lerp(LABA.y, posNode(0).y, keSiklus) } : posNode(k);
          const d = k === 0 ? lerp(LABA.d, ND, keSiklus) : ND;
          const s = k === 0 ? popIn(f, LABA_AT) : popIn(f, n.at);
          const dn = 0; // denyut dibuang (Simon: hapus animasi yang tidak diperlukan)
          return (
            <React.Fragment key={n.teks}>
              <Bulat x={pos.x} y={pos.y} d={d} col={n.col} ikon={n.ikon} s={s} denyut={dn} />
              {/* Simon (berulang: "bukan pop berkelompok + redup"): label simpul muncul DI KATANYA bersama simpulnya, penuh (dulu tampil redup
                  40 % sejak "siklus" lalu menyala); keseimbangan dijaga kamera 60f */}
              <LabelNode n={n} x={pos.x} y={pos.y} d={d} f={f} at={k === 0 ? LABA_AT + 10 : n.at + 10} />
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

/** sinar penghubung Bisnis → chip ekspansi: dari tepi lingkaran Bisnis (ukuran saat ini) sampai KIPAS.ujung sebelum pusat chip — panjang
 *  ketiganya SAMA dan semuanya mengarah ke pusat ikon Bisnis */
const sinarEks = (e: (typeof EKS)[number], sBis: number) => {
  // r1: sinar mulai di BAWAH label "Bisnis" (puncak label + 34 px + 14) — panah tengah turun lurus, dulu menembus label; ketiganya tetap
  // sama panjang & mengarah ke pusat ikon (Simon 8 Okt)
  const a = (e.sudut * Math.PI) / 180, r1 = (BIS.d / 2) * sBis + JARAK + 34 + 14, r2 = KIPAS.r - KIPAS.ujung;
  return { x1: BIS.x + Math.cos(a) * r1, y1: BIS.y + Math.sin(a) * r1, x2: BIS.x + Math.cos(a) * r2, y2: BIS.y + Math.sin(a) * r2 };
};

/** busur balik laba → bisnis (kuadrat), dengan awal dari tumpukan koin (ydasar) lalu ke puncak busur */
const BUSUR = { x1: LABA.x, y1: LABA.y - LABA.d / 2 - GAP, x2: BIS.x + 30, y2: BIS.y - BIS.d / 2 - GAP };
const BUSUR_C = { x: (BUSUR.x1 + BUSUR.x2) / 2, y: Math.min(BUSUR.y1, BUSUR.y2) - 100 };
const busurTitik = (t: number, asal: { x: number; y: number }) => {
  // 0–0,25: naik dari tumpukan ke ujung busur (di atas ubin Laba, lewat sisi kanannya); 0,25–1: menyusuri busur ke Bisnis
  if (t < 0.25) {
    const u = t / 0.25;
    return { x: lerp(asal.x, BUSUR.x1, u) + Math.sin(Math.PI * u) * 95, y: lerp(asal.y, BUSUR.y1, u) };
  }
  const u = (t - 0.25) / 0.75;
  return { x: (1 - u) * (1 - u) * BUSUR.x1 + 2 * (1 - u) * u * BUSUR_C.x + u * u * BUSUR.x2, y: (1 - u) * (1 - u) * BUSUR.y1 + 2 * (1 - u) * u * BUSUR_C.y + u * u * BUSUR.y2 };
};

/** tumpukan laba: tiap uang yang tiba MENJATUHKAN satu bundel ke puncak tumpukan; saat sebagian kembali / dipakai, bundel teratas
 *  terangkat lalu pudar (lembar uangnya terbang dari situ). Ukuran bundel tetap — yang bertambah jumlah tingkatnya. */
const TumpukanLaba: React.FC<{ f: number }> = ({ f }) => (
  <TumpukanUang x={TUMPUK.x} dasar={TUMPUK.dasar} W={TUMPUK.W} keadaan={(i) => {
    const jatuh = R(f, TIBA_T[i], TIBA_T[i] + 18, 0, 1, io), angkat = R(f, PERGI_T[i], PERGI_T[i] + 14, 0, 1, io);
    return { op: Math.min(1, jatuh * 3) * (1 - angkat), dy: -34 * (1 - jatuh) - 30 * angkat };
  }} />);

/** selembar uang (aset Simon) bergerak di sepanjang `jalur(t)` (inOut cubic), berputar pelan, pudar di kedua ujung */
const UangGerak: React.FC<{ f: number; t0: number; durasi: number; jalur: (t: number) => { x: number; y: number }; lembar: number }> = ({ f, t0, durasi, jalur, lembar }) => {
  const t = R(f, t0, t0 + durasi, 0, 1, io);
  if (t <= 0 || t >= 1) return null;
  const p = jalur(t), op = Math.min(1, R(f, t0, t0 + 8, 0, 1, io), R(f, t0 + durasi - 8, t0 + durasi, 1, 0, io));
  void lembar;
  return <LembarUang x={p.x} y={p.y} w={110} putar={lerp(-14, 10, t)} op={op} />; // lembar HIJAU aset Simon (dulu turkis)
};

/** MODAL dari pasar modal bergerak di sepanjang `jalur(t)` (inOut cubic), pudar di kedua ujung — lembar uang hijau (dulu koin biru) */
const KoinGerak: React.FC<{ f: number; t0: number; durasi: number; jalur: (t: number) => { x: number; y: number }; ikon: KunciIkon; col: string }> = ({ f, t0, durasi, jalur }) => {
  const t = R(f, t0, t0 + durasi, 0, 1, io);
  if (t <= 0 || t >= 1) return null;
  const p = jalur(t), op = Math.min(1, R(f, t0, t0 + 8, 0, 1, io), R(f, t0 + durasi - 8, t0 + durasi, 1, 0, io));
  return <LembarUang x={p.x} y={p.y} w={100} putar={lerp(10, -8, t)} op={op} />;
};

/** lingkaran ikon */
const Bulat: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number; op?: number; denyut?: number }> = ({ x, y, d, col, ikon, s, op = 1, denyut: dn = 0 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `scale(${s + dn})`, opacity: op, boxShadow: `0 14px 30px -12px ${col}aa` }}>
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
const Chip: React.FC<{ x: number; y: number; teks: string; ikon: KunciIkon; col: string; p: number; op?: number }> = ({ x, y, teks, ikon, col, p, op = 1 }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, opacity: op, transform: `translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 31, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}88` }}>
    <div style={{ width: 54, height: 54, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={36} color={B.white} /></div>
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

/** BUSUR siklus simpul k → k+1 menyusuri elips (searah jarum jam), kepala panah di ujung. Rentang sudutnya DIHITUNG: mulai di titik pertama
 *  sesudah simpul k yang berada di luar lingkaran simpul (r ND/2 + GAP) DAN di luar kotak label k (+14 px), berakhir di titik terakhir sebelum
 *  simpul k+1 yang memenuhi syarat yang sama. Lebar label = tinta terukur di render (font 32 / 800). */
const R_TEPI = ND / 2 + GAP;
const LEBAR_LABEL = [76, 150, 137, 253, 187];
// Simon 9 Okt "kerjakan juga" (kotak tinta siklus +20 px ke kanan karena "Investasi kembali" 269 px vs "Tumbuh lagi" 187 px): label
// Investasi kembali DUA BARIS (gaya "Tabungan & Deposito") → tinta kiri-kanan seimbang (−10 px) dengan lingkaran & tag tetap di 960
const TINGGI_LABEL = [32, 76, 32, 32, 32];
const LABEL_DUA_BARIS = 1;
const diLuar = (deg: number, k: number) => {
  const p = titikElips(deg), n = posNode(k), m = 14;
  if (Math.hypot(p.x - n.x, p.y - n.y) < R_TEPI) return false;
  const y0 = n.y + ND / 2 + JARAK - m, y1 = n.y + ND / 2 + JARAK + TINGGI_LABEL[k] + m;
  return !(Math.abs(p.x - n.x) < LEBAR_LABEL[k] / 2 + m && p.y > y0 && p.y < y1);
};
const RENTANG = SUDUT.map((a0, k) => {
  const a1 = k === 4 ? SUDUT[0] + 360 : SUDUT[k + 1], k1 = (k + 1) % 5;
  let a = a0; while (a < a1 && !diLuar(a, k)) a += 0.25;
  let b = a1; while (b > a && !diLuar(b, k1)) b -= 0.25;
  return [a, b] as const;
});
const polyElips = (a: number, b: number, n = 48) => Array.from({ length: n + 1 }, (_, i) => titikElips(lerp(a, b, i / n))).map((q) => `${q.x},${q.y}`).join(' ');
const Busur: React.FC<{ k: number; g: number }> = ({ k, g }) => {
  if (g <= 0.001) return null;
  const [a, b] = RENTANG[k], aE = lerp(a, b, g), e = titikElips(aE), col = NODES[(k + 1) % 5].col;
  const ang = Math.atan2(Math.cos(rad(aE)) * ELIPS.ry, -Math.sin(rad(aE)) * ELIPS.rx), h = 15; // garis singgung elips searah jarum jam
  return (
    <g>
      <polyline points={polyElips(a, aE)} fill="none" stroke={col} strokeWidth={LINE.w + 1} strokeLinecap="round" />
      {g > 0.9 ? <path d={`M${e.x + Math.cos(ang) * 4} ${e.y + Math.sin(ang) * 4} L${e.x - h * Math.cos(ang) + h * 0.6 * Math.sin(ang)} ${e.y - h * Math.sin(ang) - h * 0.6 * Math.cos(ang)} L${e.x - h * Math.cos(ang) - h * 0.6 * Math.sin(ang)} ${e.y - h * Math.sin(ang) + h * 0.6 * Math.cos(ang)} Z`} fill={col} /> : null}
    </g>);
};

/** label simpul siklus: SELALU di bawah ikonnya, rata tengah (Simon 9 Okt siang). Laba: di KANAN ubin selama bagian 2 (atasnya dipakai busur
 *  balik), meluncur ke BAWAH simpul saat ubin naik ke puncak siklus. */
const LabelNode: React.FC<{ n: (typeof NODES)[number]; x: number; y: number; d: number; f: number; at: number; keBawah?: number }> = ({ n, x, y, d, f, at, keBawah = 1 }) => {
  const st: React.CSSProperties = { fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night };
  const dua = NODES.indexOf(n) === LABEL_DUA_BARIS;
  const isi = <WordText halus rataBaris={dua} f={f} at={at} style={st}>{n.teks}</WordText>;
  const t = keBawah;
  return <div style={{ position: 'absolute', left: lerp(x + d / 2 + JARAK, x, t), top: lerp(y, y + d / 2 + JARAK, t), transform: `translate(${-50 * t}%, ${-50 * (1 - t)}%)`, lineHeight: dua ? 1.18 : 1, textAlign: 'center', ...(dua ? { width: 200 } : { whiteSpace: 'nowrap' as const }) }}>{isi}</div>;
};

/** chip "Menunggu harga naik" — dicoret (bukan cuma itu); di dalam lingkar siklus: siklusnya yang menggantikan "menunggu" */
const ChipCoret: React.FC<{ f: number; at: number; coretAt: number }> = ({ f, at, coretAt }) => {
  const p = popIn(f, at);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  const col = mixHex(B.gray, CORET, coret); // Simon 8 Okt: tag yang dicoret berubah MERAH (bingkai, ikon, garis) — tidak diredupkan
  return (
    <div style={{ position: 'absolute', left: CY.x, top: CY.y, transform: `translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1 }}>
      <div style={{ width: 46, height: 46, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name="naikTurunHarga" size={30} color={B.white} /></div>
      Menunggu harga naik
      <div style={{ position: 'absolute', left: 14, top: '50%', height: 5, marginTop: -2.5, width: `calc(${coret} * (100% - 28px))`, background: CORET, borderRadius: 3 }} />
    </div>);
};

export const S09_BEAT = { saham, rdSaham, rdIndeks, perusahaan, pertumbuhan, belakangnya, bisnis, laba, memakai, skala, produk, pasar, banyak, brand, skala2, posisi, kuat, akses, pendanaan, modal, kalau, siklus, labaS, investasi, ekspansi, lebih, tumbuh, productive, menunggu, naik, menciptakan };
