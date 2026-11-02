import React from 'react';
import { PilNominal, rpJuta } from '../parts/nominal';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { kamera, gayaIsi } from '../kamera';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { B, F, GAP, R, URUT_WARNA, io } from '../theme';
import { Icon, WordText, card, cin, grow, lerp } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Konektor } from '../parts/rantai';
import { LembarUang } from '../parts/uang';
import { Judul } from '../parts/judul';
import { AiTuntun } from '../parts/aiTuntun';

/**
 * SCENE 13 — PENUTUP · IDE VISUAL (7 Okt, VO v4). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "YOUR MONEY ↓ Daily Needs · Emergency Fund · Mid-Term Goals · Long-Term Growth ↓ NEXT LESSON"
 *   TEXT   "Pahami fungsi uangnya / baru tentukan investasinya" (bergantian)
 * Revisi 8 Okt (Simon, brief B–I; "S13 ada blank frame"): MASUK = isi Scene 12 menyusut (masker) ke simpul INSTRUMEN — langkah yang
 * sudah dipahami (lencana centang, "Setelah memahami perbedaannya"); jalur putus-putus ke slot langkah berikutnya ("langkah berikutnya
 * adalah memahami:") yang terisi KANTONG UANG (aset Simon) = "uang kita"; empat slot kantong ("dibagi seperti apa") terisi satu per satu
 * tepat di frasanya, uang (aset Simon) mengalir dari kantong uang ke tiap kantong; kantong jangka panjang membesar ("pertumbuhan").
 * Lalu kartu VIDEO BERIKUTNYA naik, disampaikan AI TUNTUN. Kamera pusat, jarak 16 px, pop berporos di tengah. Akhir video.
 * Revisi 8 Okt malam (Simon, aturan seluruh video): kantong & lembar uang HIJAU · tanpa denyut (slot, kantong uang, tiap lembar tiba) ·
 * lencana centang pop TEPAT di "perbedaannya" · empat kantong = KIPAS berpusat di kantong uang, panah sama panjang, warna berbeda ·
 * "Uang kita" tepat di bawah kantong uang · di akhir kelompok atas mengecil ke 0,85 tanpa diredupkan.
 */
export const S13 = BATAS.s13;
export const IDE_S13_AWAL = S13;

/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
const A0 = (w: string, at: number) => frasa(w, at) - 18;
const [perbedaannya, langkah, memahami2, uang, sebaiknya, dibagi, mana1, mana2, dan3, untuk4, jangka, video, gimana] = urut(['perbedaannya',
  'langkah', 'memahami', 'uang', 'sebaiknya', 'dibagi', 'mana', 'mana', 'dan', 'untuk', 'jangka', 'video', 'gimana'], S13);

/** posisi lewat transform ber-rotasi-mikro (bukan left/top): gerak lambat tidak dibulatkan Chrome ke piksel bulat */
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const JARAK = 16;

/* ── langkah: instrumen (sudah dipahami) → uang kita ── */
const LANGKAH_Y = 290;
/** simpul instrumen — isi Scene 12 menyusut (masker) ke sini */
export const INSTRUMEN13 = { x: 760, y: LANGKAH_Y, r: 75 };
/** Simon 12 Okt "ganti kantong uang diatas text 'uang kita' dengan gambar ini": FOTO tumpukan uang Rupiah (asli 04_Asset/stok-gedung/
 *  s13_uang_rupiah.png, kotak tinta → public/media/gedung/s13_uang_rupiah.webp, rasio 1,179) menggantikan kantong uang (130 × 200).
 *  Tinggi 160 (lebar 189): jangkau tinta terjauh di arah keempat panah 101 px → pangkal panah r1 112 → 116 (+ GAP 14). Label "Uang kita"
 *  tetap 16 px di bawah tepi bawah foto (naik 20 px). */
const UANG = { x: 960, y: LANGKAH_Y, xAwal: 1160, h: 160, w: 160 * 1.179 };
/* kata kunci DI DALAM klausa "uang kita sendiri sebaiknya dibagi seperti apa" (muncul() = awal klausa, dipakai kantong uang) */
const KELUAR_A = { at: sebaiknya }; // instrumen pergi, kantong uang ke tengah
const SLOT_AT = dibagi; // empat slot kantong

/** Simon 8 Okt: tiap kantong pop TEPAT di kata pertama klausanya ("mana" · "mana" · "dan" · "untuk") — keempatnya dengan aturan yang sama
 *  (dulu tiga = muncul() frasa +12f, kantong 4 = untuk +12 tulisan tangan); warna empat kantong berbeda (dulu 1 & 4 sama-sama biru) */
/** Simon 12 Okt "ganti 4 icon pada scene yang aku screenshoot dengan 4 gambar ini": tiap kantong = FOTO Simon (04_Asset/stok-gedung/s13_*.png,
 *  tampil public/media/gedung/s13_*.webp) utuh di atas lingkarannya (gaya Tabungan/Deposito S02). `foto` = [berkas, pusat massa x, y (pecahan
 *  lebar/tinggi foto), rasio lebar/tinggi]. Warna lingkaran: Kebutuhan sehari-hari ↔ Dana darurat DITUKAR (dulu biru · oranye) — terukur
 *  (CIELAB) 12,5 % piksel foto dana darurat (koin emas, kotak merah) ΔE < 20 dari oranye (menyatu), 0 % dari Neon Blue; belanjaan di oranye
 *  7,1 %. Tujuan menengah (turkis 1,1 %) & pertumbuhan (langit 0 %) tetap; empat warna tetap berbeda. */
const KANTONG: { teks: string; ikon: KunciIkon; col: string; at: number; habis: number; foto: [string, number, number, number] }[] = [
  { teks: 'Kebutuhan sehari-hari', ikon: 'sehariHari', col: URUT_WARNA[1], at: mana1, habis: A0('mana', mana2), foto: ['s13_sehari', 0.489, 0.537, 520 / 457] },
  { teks: 'Dana darurat', ikon: 'danaDarurat', col: URUT_WARNA[0], at: mana2, habis: A0('dan', dan3), foto: ['s13_darurat', 0.497, 0.55, 520 / 400] },
  { teks: 'Tujuan menengah', ikon: 'tujuanMenengah', col: URUT_WARNA[2], at: dan3, habis: untuk4 - 20, foto: ['s13_menengah', 0.506, 0.554, 520 / 430] },
  { teks: 'Pertumbuhan jangka panjang', ikon: 'pertumbuhan', col: URUT_WARNA[4], at: untuk4, habis: A0('di', video - 30), foto: ['s13_pertumbuhan', 0.568, 0.616, 520 / 507] }, // langit: biruTua terlalu mirip kantong 1 (Simon 9 Okt: konteks mirip → warna beda)
];
/** lebar foto kantong ÷ diameter lingkaran (= Tabungan S02) */
const FOTO_LEBAR = 1.1;
/** jarak puncak tinta foto di atas pusat lingkaran (px) — pil nominal pertumbuhan diletakkan di atasnya */
const puncakFoto = (k: (typeof KANTONG)[number], d: number) => { const w = FOTO_LEBAR * d, h = w / k.foto[3]; return h / 2; };
/** KIPAS — Simon 8 Okt: empat panah dari kantong uang SAMA PANJANG, berpusat di pusat visual kantong uang, simetris kiri/kanan.
 *  Kantong di lingkaran jari-jari R (sudut dari arah bawah): ±50° (dalam) & ±80° (luar). Panah dalam ±50° melewati sudut label "Uang kita"
 *  (tepat di bawah kantong) dengan jarak ±34 px; label luar (2 baris) berakhir 48 px di atas lingkaran kantong dalam; label dalam (1 baris)
 *  berakhir ±748 ≈ dasar susunan lama (765) → pusat isi hampir sama dengan yang diukur kamera. r1 = awal panah (tepi kantong uang + jarak). */
const KIPAS = { R: 540, sudut: [-80, -50, 50, 80], r1: 116 };
const arah = (k: number) => { const a = (KIPAS.sudut[k] * Math.PI) / 180; return { sx: Math.sin(a), cy: Math.cos(a) }; };
// Simon 12 Okt (foto kantong) "perhatikan lagi alignmentnya dan perbesar sedikit": 120 → 138 (+15 %, foto ikut: lebar 1,1 KD)
const KD = 138;
const KX = (k: number) => UANG.x + KIPAS.R * arah(k).sx, KY = (k: number) => LANGKAH_Y + KIPAS.R * arah(k).cy;
/* AI TUNTUN (maskot resmi, Simon 7 Okt) menyampaikan kartu video berikutnya — gema chat Scene 11.
 * Kelompok maskot (209) + jarak 40 + kartu (900) berpusat di 960 → maskot x 490, kartu x 1085.
 * Simon 8 Okt: kelompok atas kini 0,85 (dulu 0,72 + redup 45 %) → kartu & maskot turun 34 (640 → 674) dan kelompok atas naik 166 (dulu 150):
 * jarak label kantong ↔ kartu ≥ 20 px, dan pusat susunan akhir tetap di titik yang diukur kamera (dy 120). */
const NEXT = { x: 1085, y: 674, w: 900, h: 250 };
const MASKOT = { x: 490, y: 674, tinggi: 200 }; // sejajar pusat kartu (tanpa teks nama)
const NAIK_AT = A0('di', video - 30) + 30;
const AKHIR = { s: 0.85, naik: 166 };

export const Scene13: React.FC<{ f: number }> = ({ f }) => {
  if (f < S13) return null;
  const naikAtas = cin(f, NAIK_AT); // uang & kantong menyusut ke atas, kartu video berikutnya naik
  const sk = lerp(1, AKHIR.s, naikAtas);
  const keluarA = R(f, KELUAR_A.at - 30, KELUAR_A.at + 30, 0, 1, io);
  const ux = lerp(UANG.xAwal, UANG.x, keluarA);
  const kam = kamera('S13', f);

  return (
    <AbsoluteFill>
      <Judul f={f} kata={['Pahami', 'fungsi uangnya']} at={M('uang', uang) + 10} sorotAt={dibagi + 30} keluar={A0('dan', dan3) + 30} />
      <Judul f={f} kata={['Baru', 'tentukan', 'investasinya']} at={A0('dan', dan3) + 60} sorotAt={jangka + 10} keluar={NAIK_AT} />

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaIsi(kam)}>
        {/* Simon 8 Okt: tanpa peredupan (dulu opasitas 1 → 0,45) */}
        <AbsoluteFill style={{ transform: `translateY(${-AKHIR.naik * naikAtas}px) scale(${sk})`, transformOrigin: '960px 300px' }}>
          {/* ═════ langkah 1 → langkah 2 ═════ */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <Konektor x1={INSTRUMEN13.x + INSTRUMEN13.r + JARAK} y1={LANGKAH_Y} x2={UANG.xAwal - Math.max(75, UANG.w / 2) - JARAK} y2={LANGKAH_Y} g={grow(f, M('langkah', langkah) - 10)} col={B.grayLite} putus op={1 - keluarA} />
            {/* uang kita → empat kantong: putus-putus saat slot, berwarna saat kantongnya terisi */}
            {KANTONG.map((k, i) => {
              const a = ujung(i);
              return (
                <React.Fragment key={k.teks}>
                  <Konektor {...a} g={grow(f, SLOT_AT + 12 * i)} col={B.grayLite} putus op={1 - R(f, k.at - 30, k.at, 0, 1, io)} />
                  <Konektor {...a} g={grow(f, k.at - 15)} col={k.col} />
                </React.Fragment>);
            })}
          </svg>
          <Instrumen f={f} op={1 - keluarA} dx={-60 * keluarA} />
          {/* slot langkah berikutnya ("?") → kantong uang (aset Simon) — Simon 8 Okt: tanpa denyut di "memahami" */}
          <Slot x={UANG.xAwal} y={LANGKAH_Y} d={150} p={popIn(f, M('langkah', langkah) + 20)} op={1 - R(f, M('uang', uang) - 30, M('uang', uang), 0, 1, io)} />
          <KantongUang f={f} x={ux} />
          {/* Simon 8 Okt: "Uang kita" TEPAT DI BAWAH kantong uang, rata tengah (dulu menggantung di kanannya) */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: 400, textAlign: 'center', whiteSpace: 'nowrap', transform: geser(ux - 200, LANGKAH_Y + UANG.h / 2 + JARAK) }}>
            <WordText halus f={f} at={M('uang', uang) + 10} style={{ fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night, lineHeight: 1 }}>Uang kita</WordText>
          </div>

          {/* ═════ empat kantong ═════ */}
          {KANTONG.map((k, i) => (
            <Slot key={`s${k.teks}`} x={KX(i)} y={KY(i)} d={KD} p={popIn(f, SLOT_AT + 12 * i)} op={1 - R(f, k.at - 30, k.at, 0, 1, io)} />))}
          {KANTONG.map((k, i) => <AliranUang key={`u${k.teks}`} f={f} i={i} mulai={k.at} selesai={k.habis} />)}
          {KANTONG.map((k, i) => {
            const p = popIn(f, k.at);
            if (p <= 0.001) return null;
            // Simon 9 Okt: "pertumbuhan jangka panjang" TIDAK lagi lewat kantong membesar (dulu +15 %) — nilainya naik (pil di atas kantong)
            const tumbuh = 0;
            // Simon 8 Okt: denyut tiap lembar tiba DIHAPUS
            return (
              <React.Fragment key={k.teks}>
                <BulatFoto x={KX(i)} y={KY(i)} d={KD} col={k.col} foto={k.foto} s={p + tumbuh} />
                {/* pil di atas PUNCAK foto (tanaman menyembul 19 px di atas lingkaran) — dulu di atas lingkaran → menimpa daun */}
                {i === 3 ? <PilNominal x={KX(i)} y={KY(i) - Math.max(KD / 2, puncakFoto(k, KD)) - 28} teks={rpJuta(10 + 5 * R(f, jangka - 30, jangka + 30, 0, 1, io))} arah={R(f, jangka - 30, jangka, 0, 1, io)} p={popIn(f, k.at + 20)} size={24} lebarMin={124} /> : null}
                <div style={{ position: 'absolute', left: KX(i) - 150, width: 300, top: KY(i) + KD / 2 + JARAK + KD * tumbuh / 2, textAlign: 'center', lineHeight: 1.15, textWrap: 'balance' } as React.CSSProperties}>
                  <WordText halus f={f} at={k.at + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>{k.teks}</WordText>
                </div>
              </React.Fragment>);
          })}
        </AbsoluteFill>

        {/* video berikutnya — disampaikan AI Tuntun (sprite maskot apa adanya; tanpa transform pantul tambahan) */}
        <AiTuntun f={f} x={MASKOT.x} y={MASKOT.y} tinggi={MASKOT.tinggi} p={popIn(f, NAIK_AT + 10)} t0={NAIK_AT - 20} />
        <KartuBerikutnya f={f} p={cin(f, NAIK_AT + 30)} />
      </AbsoluteFill>

      {/* LENCANA CENTANG — lapisan sendiri DI ATAS masker keluar Scene 12 (zIndex 1 & sesudahnya di DOM; watermark/subtitle tetap di atas, z 2):
          Simon 8 Okt: pop TEPAT di "perbedaannya" (dulu S13+80 = 29f sesudahnya), saat isi Scene 12 masih menyusut ke simpul ini —
          di lapisan isi biasa separuhnya akan tertutup lingkaran masker lalu muncul mendadak saat masker dilepas. Kamera sama dengan isi. */}
      <AbsoluteFill style={{ zIndex: 1 }}>
        <AbsoluteFill style={gayaIsi(kam)}>
          <Lencana f={f} op={1 - keluarA} dx={-60 * keluarA} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>);
};

/** penghubung kantong uang → kantong i: jari-jari KIPAS dari r1 (tepi kantong uang + jarak) sampai tepi lingkaran kantong − GAP — keempatnya
 *  sama panjang (R − KD/2 − GAP − r1) dan mengarah ke pusat kantong uang (Simon 8 Okt; dulu dari satu titik di bawah kantong, panjang beda) */
const ujung = (i: number) => {
  const { sx, cy } = arah(i), r2 = KIPAS.R - KD / 2 - GAP;
  return { x1: UANG.x + sx * KIPAS.r1, y1: LANGKAH_Y + cy * KIPAS.r1, x2: UANG.x + sx * r2, y2: LANGKAH_Y + cy * r2 };
};

/** simpul instrumen (langkah yang sudah dipahami) — diambil alih dari masker Scene 12; lencananya di lapisan atas (Lencana) */
const Instrumen: React.FC<{ f: number; op: number; dx: number }> = ({ f, op, dx }) => {
  if (op <= 0.001 || f < S13 + 50) return null;
  const D = 2 * INSTRUMEN13.r;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: op, transform: geser(INSTRUMEN13.x - D / 2 + dx, INSTRUMEN13.y - D / 2) }}>
      <div style={{ width: D, height: D, borderRadius: '50%', background: B.blue, display: 'grid', placeItems: 'center' }}>
        <Icon name="instrumenInvestasi" size={D * 0.56} color={B.white} />
      </div>
    </div>);
};

/** "Setelah memahami perbedaannya" — sudah dipahami: lencana centang di tepi kanan atas simpul instrumen (pusatnya di lingkaran simpul,
 *  45°), pop berporos di tengahnya. Simon 8 Okt: ≥ 60 px (dulu 52), pop di kata "perbedaannya". */
const LENCANA = 60;
const Lencana: React.FC<{ f: number; op: number; dx: number }> = ({ f, op, dx }) => {
  const c = popIn(f, perbedaannya);
  if (c <= 0.001 || op <= 0.001) return null;
  const D = 2 * INSTRUMEN13.r, x = INSTRUMEN13.x - D / 2 + dx + D * 0.85, y = INSTRUMEN13.y - D / 2 + D * 0.15;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: LENCANA, height: LENCANA, opacity: op, transform: `${geser(x - LENCANA / 2, y - LENCANA / 2)} scale(${c})`, borderRadius: '50%', background: B.turq, border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', boxShadow: `0 8px 18px -8px ${B.turq}aa` }}>
      <svg width={34} height={34} viewBox="0 0 34 34"><path d="M7 18 L14 25 L28 9" fill="none" stroke={B.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>);
};

/** slot putus-putus (langkah / kantong yang belum terisi) — pop berporos di tengahnya; Simon 8 Okt: denyut dihapus */
const Slot: React.FC<{ x: number; y: number; d: number; p: number; op: number }> = ({ x, y, d, p, op }) => p <= 0.001 || op <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: B.white, border: `3px dashed ${B.grayLite}`, opacity: op, transform: `scale(${p})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: d * 0.36, fontWeight: 800, color: B.grayLite }}>?</div>);

/** kantong uang (aset Simon) = "uang kita": muncul di slot langkah berikutnya, lalu ke tengah.
 *  Simon 8 Okt: versi HIJAU (public/uang-hijau, viewBox sama dengan versi turkis) dan TANPA denyut (dulu di "dibagi" + tiap lembar keluar) */
const KantongUang: React.FC<{ f: number; x: number }> = ({ f, x }) => {
  const p = popIn(f, M('uang', uang));
  if (p <= 0.001) return null;
  return (
    <Img src={staticFile('media/gedung/s13_uang_rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: UANG.w, height: UANG.h, maxWidth: 'none', transform: `${geser(x - UANG.w / 2, LANGKAH_Y - UANG.h / 2)} scale(${p})` }} />);
};

/** jadwal lembar uang ke satu kantong: tiap 18f dari kantongnya terisi sampai klausa berikutnya */
/* Simon 9 Okt: aliran beruntun (selembar tiap 18f selama klausa) = gerak berdetik terus-menerus (terukur: pemindai judder menandai tiap
 * kedatangan lembar, berkala 7/11 frame) → SATU lembar per kantong, terbang 60f di kata kantongnya */
const waktuUang = (mulai: number, _selesai: number) => [mulai + 10];

/** uang melayang dari kantong uang ke kantong i SEPANJANG panahnya (40f inOut cubic).
 *  Simon 8 Okt: lembar HIJAU (LembarUang; dulu turkis lembar-N.svg) tanpa putaran jungkir — kemiringan tetap bawaan aset; berangkat 40 px
 *  sesudah pangkal panah (tidak menimpa kantong uang), pudar sebelum kepala panah */
const AliranUang: React.FC<{ f: number; i: number; mulai: number; selesai: number }> = ({ f, i, mulai, selesai }) => {
  if (f < mulai || f > mulai + 80) return null;
  const a = ujung(i), L = Math.hypot(a.x2 - a.x1, a.y2 - a.y1), ux = (a.x2 - a.x1) / L, uy = (a.y2 - a.y1) / L;
  const p0 = { x: a.x1 + ux * 40, y: a.y1 + uy * 40 }, p1 = { x: a.x2 - ux * 30, y: a.y2 - uy * 30 };
  return (
    <>
      {waktuUang(mulai, selesai).map((t0, j) => {
        const t = R(f, t0, t0 + 60, 0, 1);
        if (t <= 0 || t >= 1) return null;
        const e = io(t);
        const op = Math.min(R(t, 0, 0.15, 0, 1, io), 1 - R(t, 0.8, 1, 0, 1, io));
        return <LembarUang key={j} x={lerp(p0.x, p1.x, e)} y={lerp(p0.y, p1.y, e)} w={64} op={op} />;
      })}
    </>);
};

/** lingkaran + FOTO utuh (tanpa masker), pop berporos di pusat lingkaran (popIn berakhir 0,99996 → jalur raster tetap sesudah pop).
 *  Simon 12 Okt "perhatikan lagi alignmentnya": PUSAT KOTAK foto (bukan pusat massa) di pusat lingkaran — foto kolase yang miring (pertumbuhan
 *  pusat massa x 0,568 · y 0,616) tampak bergeser kiri-atas bila pusat massanya yang dipusatkan; pusat kotak memberi sisa foto di kiri = kanan,
 *  atas = bawah. (Ujung panah tetap di tepi lingkaran + GAP: di sepanjang arah tiap panah foto tidak melewati lingkaran, terukur ≤ 61/69 px.) */
const BulatFoto: React.FC<{ x: number; y: number; d: number; col: string; foto: [string, number, number, number]; s: number }> = ({ x, y, d, col, foto, s }) => {
  if (s <= 0.001) return null;
  const w = FOTO_LEBAR * d, h = w / foto[3];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(x, y)} scale(${s})` }}>
      <div style={{ position: 'absolute', left: -d / 2, top: -d / 2, width: d, height: d, borderRadius: '50%', background: col, boxShadow: `0 14px 30px -12px ${col}aa` }} />
      <Img src={staticFile(`media/gedung/${foto[0]}.webp`)} style={{ position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, maxWidth: 'none' }} />
    </div>);
};
/** kartu "Video berikutnya" */
const KartuBerikutnya: React.FC<{ f: number; p: number }> = ({ f, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: NEXT.x - NEXT.w / 2, top: NEXT.y - NEXT.h / 2, width: NEXT.w, height: NEXT.h, opacity: p, transform: `translateY(${(1 - p) * 90}px)`, ...card(B.blue) }}>
    {/* ekor chat menunjuk ke AI Tuntun (sama dengan kartu cek Scene 11) */}
    <svg width={28} height={44} viewBox="0 0 28 44" style={{ position: 'absolute', left: -26, top: MASKOT.y - (NEXT.y - NEXT.h / 2) - 22 }}><path d="M28 0 L0 22 L28 44 Z" fill={B.white} /></svg>
    {/* isi (lingkaran 132 + 34 + teks ±546) berpusat di kartu: tepi kiri = kanan = 94 */}
    <div style={{ position: 'absolute', left: 94, top: NEXT.h / 2 - 66, width: 132, height: 132, borderRadius: '50%', background: B.blue, display: 'grid', placeItems: 'center', transform: `scale(${popIn(f, NAIK_AT + 50)})` }}>
      <svg width={64} height={64} viewBox="0 0 64 64"><path d="M22 14 L52 32 L22 50 Z" fill={B.white} /></svg>
    </div>
    <div style={{ position: 'absolute', left: 260, right: 40, top: 52 }}>
      <WordText halus f={f} at={NAIK_AT + 40} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.blue, letterSpacing: '.02em' }}>Video berikutnya</WordText>
    </div>
    {/* dua baris seimbang (tanpa kata yatim "berbeda"); baris 2 menyusul 20f */}
    <div style={{ position: 'absolute', left: 260, right: 40, top: 104, lineHeight: 1.18 }}>
      <div><WordText halus f={f} at={M('gimana', gimana)} style={{ fontFamily: F, fontSize: 42, fontWeight: 800, color: B.night }}>Cara membagi uang</WordText></div>
      <div><WordText halus f={f} at={M('gimana', gimana) + 20} style={{ fontFamily: F, fontSize: 42, fontWeight: 800, color: B.night }}>untuk tujuan yang berbeda</WordText></div>
    </div>
  </div>);

export const S13_BEAT = { perbedaannya, langkah, memahami2, uang, sebaiknya, dibagi, mana1, mana2, dan3, untuk4, jangka, video, gimana };
