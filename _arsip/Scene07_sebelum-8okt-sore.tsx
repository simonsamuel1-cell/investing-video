import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import { ICON } from '../icons.gen';
import { IKON, type KunciIkon } from '../ikon';
import { gayaKamera, kamera } from '../kamera';
import { B, F, GAP, R, io } from '../theme';
import { Icon, WordText, cin, grow, lerp, popIn, popOut, KacaPembesar } from '../parts/kit';
import { Konektor, SimpulBab, denyut } from '../parts/rantai';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { Judul } from '../s03/Scene03';

/**
 * SCENE 07 — REKSA DANA. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "FUND BASKET → Money Market Instruments · Bonds · Stocks · Index Constituents ↓ UNDERLYING ASSETS ↓ Return · Volatility · Risk"
 *   TEXT   "Karakter reksa dana / tergantung isi investasinya" (dua baris bergantian, pola Scene 03/04)
 * Revisi 7 Okt (Simon): (1) PERPINDAHAN = peta bab (isi Scene 06 menyusut ke simpul bab 04, slot bab 05 terisi, simpulnya ke
 * tengah); (2) "keranjang investasi" divisualkan sebagai KERANJANG (ikon stok Flaticon #9427124; acuan keranjang kawat Simon =
 * susunan saja, gaya tetap datar brand) berisi ikon instrumen yang menumpuk menyembul dari bibirnya (acuan troli Simon); saat VO
 * menyebut tiap instrumen, ikonnya KELUAR dari keranjang lalu jadi baris ikon → panah → pil "Mirip …" (satu sumbu, rata);
 * (3) "Jadi …" = ketiganya kembali ke keranjang, lalu Return · Volatilitas · Risiko; (4) nama bab jadi LABEL yang tergantung
 * di keranjang ("bukan sekadar melihat label"); kaca pembesar melihat label lalu isi keranjang. Kamera pusat, jarak 16 px.
 */
export const S7 = BATAS.s7;
export const IDE_S07_AWAL = S7;

// urutan = urutan UCAPAN ("…isinya obligasi, karakternya akan lebih mirip obligasi" → obligasi SEBELUM karakternya)
const [reksa, melihat, label, tapi, sebenarnya, apa, karena, keranjang, kalau, isinya, obligasi, karakternya, obligasi2, kalau2, isinya2,
  saham, pergerakannya, saham2, kalau3, indeks, kinerjanya, dipengaruhi, jadi, ret, volatilitas, risikonya, bergantung, underlying,
  asset] = urut(['reksa', 'melihat', 'label', 'tapi', 'sebenarnya', 'apa', 'karena', 'keranjang', 'kalau', 'isinya', 'obligasi',
  'karakternya', 'obligasi', 'kalau', 'isinya', 'saham', 'pergerakannya', 'saham', 'kalau', 'indeks', 'kinerjanya', 'dipengaruhi', 'jadi',
  'return', 'volatilitas', 'risikonya', 'bergantung', 'underlying', 'asset-nya'], S7);
/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;

/* ── geometri (dunia, sebelum kamera) ── */
const NODE = { x: 960, y: 540, d: 200 };
/** keranjang = ikon stok 512 × 512 (pegangan y 17–195 · bibir 213–229 · badan 247–494), skala SK */
const SK = 0.85;
// Koordinat di bawah = posisi AKHIR keranjang (kiri, −338): susunan terlebar (label · keranjang · baris · grafik mini) berpusat di
// x 960 dan MUAT di frame 1920 (pengukuran kamera tanpa kamera tidak terpotong tepi). Sebelum baris pertama, rombongan keranjang
// (keranjang, isi, label, tali) berada +GESER_KIRI (tengah) dan bergeser ke kiri BERSAMA ikon Obligasi yang keluar (`geser`).
const GESER_KIRI = 338;
const KB = { x: 960 - 256 * SK - GESER_KIRI, y: 540 - 281 * SK }; // kiri-atas kotak ikon
const PUSAT_KERANJANG = { x: KB.x + 256 * SK, y: KB.y + 360 * SK };
const kb = (bx: number, by: number) => ({ x: KB.x + bx * SK, y: KB.y + by * SK });
export const ISI_D = 112;
type Isi = { teks: string; ikon: KunciIkon; col: string; x: number; y: number; depan: boolean };
/** isi keranjang — urutan indeks TETAP (Scene 08 mengambil ISI7[2] = Saham); posisi = tumpukan kiri→kanan, depan lebih rendah */
export const ISI7: Isi[] = [
  { teks: 'Pasar uang', ikon: 'rdPasarUang', col: B.blue, ...kb(307, 170), depan: true },
  { teks: 'Obligasi', ikon: 'obligasi', col: B.blue, ...kb(95, 170), depan: true },
  { teks: 'Saham', ikon: 'saham', col: B.orange, ...kb(205, 125), depan: false },
  { teks: 'Indeks saham', ikon: 'rdIndeks', col: B.orange, ...kb(417, 125), depan: false },
];
const URUT_JATUH = [1, 2, 0, 3]; // jatuh ke keranjang kiri → kanan
const JARAK = 16;
/** baris hasil (kanan): ikon → panah → pil, satu sumbu y per baris */
const RX = KB.x + 512 * SK + 190; // pusat ikon baris — lorong 120 px antara keranjang dan kolom baris untuk jalur keluar
const LORONG_X = RX - 120, ANGKAT_Y = 290; // jalur keluar: naik di atas tumpukan → kanan → turun di lorong → masuk baris dari kiri
const PANAH = { x1: RX + 50 + JARAK, x2: RX + 50 + JARAK + 90 };
const PIL_X = PANAH.x2 + JARAK; // tepi kiri pil
const BARIS_Y = [400, 540, 680];
const BARIS = [ // isi yang keluar (indeks ISI7), kata pemicu, awal kalimat "kalau …" (dominan), kalimat "mirip …", garis karakter
  { i: 1, kata: obligasi, dom: A0('kalau', kalau), kal: A0('karakternya', karakternya), teks: 'Mirip obligasi', garis: 'stabil' as const, gAt: obligasi2 },
  { i: 2, kata: saham, dom: A0('kalau', kalau2), kal: A0('pergerakannya', pergerakannya), teks: 'Mirip saham', garis: 'gejolak' as const, gAt: saham2 },
  { i: 3, kata: indeks, dom: A0('kalau', kalau3), kal: A0('kinerjanya', kinerjanya), teks: 'Ikut indeks', garis: 'indeks' as const, gAt: dipengaruhi },
];
const GARIS_X = PIL_X + 300 + 24; // garis karakter: satu tepi kiri untuk ketiga baris (pil terlebar "Mirip obligasi" ≈ 300)
const GARIS = { w: 200, h: 80, pad: 16 }; // kartu grafik mini
const AKIBAT = [ // Return · Volatilitas · Risiko — di tempat baris hasil sesudah isi kembali ke keranjang
  { teks: 'Return', ikon: 'returnInvestasi' as KunciIkon, y: BARIS_Y[0], at: ret },
  { teks: 'Volatilitas', ikon: 'naikTurunHarga' as KunciIkon, y: BARIS_Y[1], at: M('volatilitas', volatilitas) },
  { teks: 'Risiko', ikon: 'risiko' as KunciIkon, y: BARIS_Y[2], at: M('risikonya', risikonya) },
];
/** label "Reksa dana": di tengah = di bawah simpul; di keranjang = tergantung di kiri bibir */
const TAG_TENGAH = { x: NODE.x, y: NODE.y + NODE.d / 2 + JARAK + 28 };
const TAG_KERANJANG = { kanan: KB.x + 44 * SK - JARAK, y: KB.y + 330 * SK };
const KAIT = kb(26, 221); // ujung kiri bibir — tali label

/* ── waktu (frame global) ── */
const ISI_BAB = reksa; // slot bab 05 terisi saat "reksa dana" (peta perlu tampil dulu; frasa mulai di "Sekarang")
const TENGAH = ISI_BAB + 90;
const KE_KERANJANG = A0('tapi', tapi) + 50; // simpul → keranjang (label pindah DULU: A0 … A0+50, tidak melintasi keranjang)
const JATUH = A0('karena', karena); // isi jatuh ke keranjang
const KEMBALI = A0('jadi', jadi); // baris hasil kembali ke keranjang

export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < S7) return null;
  // KELUAR = milik Scene 08 (perpindahan seperti Scene 01–03): ikon Saham TERANGKAT dari keranjang 40f sebelumnya (diambil alih
  // Scene 08 mulai BATAS.s8 → terbang mengisi slot bab 06); sisa isi MASKER LINGKARAN menyusut ke simpul bab 05 di peta bab, berubah
  // turkis (warna bab 05) + ikonnya, lalu peta mengambil alih. 50f mulai BATAS.s8.
  if (f >= BATAS.s8 + 52) return null;
  const ex = R(f, BATAS.s8, BATAS.s8 + 50, 0, 1, io);
  const kam8 = kamera('S08', BATAS.s8 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...SIMPUL_PETA(4), x: SIMPUL_PETA(4).x + kam8.x, y: SIMPUL_PETA(4).y + kam8.y };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  const angkatSaham = R(f, BATAS.s8 - 40, BATAS.s8, 0, 1, io);

  const morf = cin(f, KE_KERANJANG); // simpul mengecil masuk keranjang
  const pKeranjang = popIn(f, KE_KERANJANG + 10);
  const dnKeranjang = denyut(f, keranjang + 10);
  const tag = popIn(f, label); // nama → label bertali-cincin
  const off = GESER_KIRI * (1 - R(f, BARIS[0].kata - 18, BARIS[0].kata + 62, 0, 1, io)); // rombongan keranjang: tengah → kiri
  const pindahTag = R(f, A0('tapi', tapi), A0('tapi', tapi) + 50, 0, 1, io);
  const tagX = lerp(TAG_TENGAH.x, TAG_KERANJANG.kanan + off, pindahTag), tagY = lerp(TAG_TENGAH.y, TAG_KERANJANG.y, pindahTag);
  const tali = grow(f, KE_KERANJANG + 50);
  // keluar/kembali tiap isi: 0 = di keranjang, 1 = di baris hasil
  const keluar = (k: number) => R(f, BARIS[k].kata - 18, BARIS[k].kata + 62, 0, 1, io) * (1 - R(f, KEMBALI + 15 * k, KEMBALI + 60 + 15 * k, 0, 1, io)) /* kembali cepat: lorong kosong sebelum penghubung Return tumbuh */;
  const dnIsi = Math.max(denyut(f, isinya + 10), denyut(f, isinya2 + 10));
  // "kalau sebagian besar isinya X" → X membesar (dominan), isi lain meredup; reda saat X keluar
  const dom = (k: number) => R(f, BARIS[k].dom, BARIS[k].dom + 60, 0, 1, io) * (1 - R(f, BARIS[k].kata - 18, BARIS[k].kata + 42, 0, 1, io));
  const domIsi = (i: number) => { const b = BARIS.findIndex((r) => r.i === i); return b >= 0 ? dom(b) : 0; };
  const redupIsi = (i: number) => Math.max(0, ...BARIS.map((r, b) => (r.i === i ? 0 : dom(b))));
  // "…sangat bergantung pada underlying asset-nya" → isi melompat bergantian (dua gelombang), lalu akibat berdenyut
  const LOMPAT = [M('bergantung', bergantung) + 50, underlying - 10];
  const lompat = (i: number) => Math.max(...LOMPAT.map((t) => Math.sin(Math.PI * R(f, t + 12 * URUT_JATUH.indexOf(i), t + 12 * URUT_JATUH.indexOf(i) + 30, 0, 1, io)))) * 26;
  const dnAkibat = (k: number) => Math.max(...LOMPAT.map((t) => denyut(f, t + 60 + 10 * k)));

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS peta bab yang baru */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s8, BATAS.s8 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <AbsoluteFill>
        <Judul f={f} kata={['Karakter', 'reksa dana']} at={M('karakternya', karakternya)} sorotAt={karakternya + 40} keluar={jadi + 10} />
        <Judul f={f} kata={['Tergantung', 'isi investasinya']} at={M('bergantung', bergantung) + 40} sorotAt={asset} />
      </AbsoluteFill>

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaKamera('S07', f)}>
        {/* ═════ pembuka bab: peta bab → simpul bab 05 ke tengah ═════ */}
        <PembukaBab f={f} s0={S7} k={4} isiAt={ISI_BAB} tengah={NODE} selesai={TENGAH} />

        <AbsoluteFill>
          {/* nomor bab (pudar saat simpul jadi keranjang) */}
          <div style={{ position: 'absolute', left: NODE.x - 140, width: 280, bottom: 1080 - (NODE.y - NODE.d / 2 - JARAK), textAlign: 'center', opacity: cin(f, TENGAH + 20) * (1 - morf), fontFamily: F, fontSize: 30, fontWeight: 800, color: B.turq, letterSpacing: '.04em', lineHeight: 1 }}>05</div>
          {/* simpul bab 05 → mengecil masuk ke keranjang */}
          {f >= TENGAH && morf < 1 ? <SimpulBab x={lerp(NODE.x, PUSAT_KERANJANG.x + off, morf)} y={lerp(NODE.y, PUSAT_KERANJANG.y, morf)} d={NODE.d * (1 - morf)} col={B.turq} ikon="reksaDana" isi={1} /> : null}

          {/* ═════ KERANJANG: pegangan (belakang) · isi · bibir + badan (depan) ═════ */}
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${off}px) scale(${1 + dnKeranjang * 0.5})`, transformOrigin: `${KB.x + 256 * SK}px ${KB.y + 360 * SK}px` }}>
            <Keranjang bagian="belakang" p={pKeranjang} />
            {/* slot "?" — isi belum diketahui */}
            {ISI7.map((it, k) => {
              const slot = cin(f, M('sebenarnya', sebenarnya) + 12 * k) * (1 - R(f, JATUH + 20 * URUT_JATUH.indexOf(k) + 10, JATUH + 20 * URUT_JATUH.indexOf(k) + 30, 0, 1, io));
              return slot > 0.001 ? <div key={it.teks} style={{ position: 'absolute', left: it.x - ISI_D / 2, top: it.y - ISI_D / 2, width: ISI_D, height: ISI_D, borderRadius: 99, border: `3px dashed ${B.grayLite}`, background: B.white, opacity: slot, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 44, fontWeight: 800, color: B.grayLite }}>?</div> : null;
            })}
            {/* isi di dalam keranjang (belakang dulu, lalu depan) */}
            {[false, true].map((depan) => ISI7.map((it, k) => {
              if (it.depan !== depan) return null;
              if (it.teks === 'Saham' && (f >= BATAS.s8 || angkatSaham > 0.25)) return null; // terangkat: lapisan atas; ≥ BATAS.s8: Scene 08
              const b = BARIS.findIndex((r) => r.i === k);
              if (b >= 0 && keluar(b) > 0.25) return null; // sedang di luar: digambar di lapisan atas
              const t0 = JATUH + 20 * URUT_JATUH.indexOf(k);
              return <IsiBergerak key={it.teks} f={f} it={it} t0={t0} b={b} t={b >= 0 ? keluar(b) : 0} dn={dnIsi} dom={domIsi(k)} redup={redupIsi(k)} lompat={lompat(k) + (it.teks === 'Saham' ? SAHAM_ANGKAT * angkatSaham : 0)} />;
            }))}
            <Keranjang bagian="depan" p={pKeranjang} />
          </div>

          {/* label "Reksa dana" — tergantung di kiri bibir keranjang */}
          {tali > 0.001 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <line x1={TAG_KERANJANG.kanan - 22 + off} y1={TAG_KERANJANG.y - 10} x2={lerp(TAG_KERANJANG.kanan - 22, KAIT.x, tali) + off} y2={lerp(TAG_KERANJANG.y - 10, KAIT.y, tali)} stroke={B.turq} strokeWidth={3} strokeLinecap="round" />
            </svg>) : null}
          <LabelTag f={f} x={tagX} y={tagY} kanan={pindahTag} tag={tag} denyutTag={denyut(f, label + 20)} />

          {/* ═════ baris hasil: ikon → panah → pil (satu sumbu) ═════ */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {BARIS.map((r, k) => {
              const g = grow(f, r.kal + 30) * (1 - R(f, KEMBALI, KEMBALI + 30, 0, 1, io));
              return <Konektor key={k} x1={PANAH.x1} y1={BARIS_Y[k]} x2={PANAH.x2} y2={BARIS_Y[k]} g={g} col={ISI7[r.i].col} />;
            })}
            {/* Return · Volatilitas · Risiko: dari keranjang */}
            {AKIBAT.map((a, k) => (
              <Konektor key={a.teks} x1={KB.x + 470 * SK + GAP} y1={KB.y + 330 * SK} x2={RX - 50 - JARAK} y2={a.y} g={grow(f, a.at)} col={B.turq} />))}
          </svg>
          {BARIS.map((r, k) => {
            const p = popIn(f, r.kal + 50) * popOut(f, KEMBALI + 15);
            return <PilHasil key={k} x={PIL_X} y={BARIS_Y[k]} p={p} teks={r.teks} ikon={ISI7[r.i].ikon} col={ISI7[r.i].col} />;
          })}
          {/* isi yang sedang di luar keranjang (lapisan atas) */}
          {/* menempel pada rombongan keranjang yang bergeser: posisi = jalur akhir + off·(1 − t) → relatif ke keranjang tetap jalur
              bersihnya, dan tiba tepat di baris (off·0) */}
          {BARIS.map((r, k) => (keluar(k) > 0.25 ? (
            <div key={k} style={{ position: 'absolute', inset: 0, transform: `translateX(${off * (1 - keluar(k))}px)` }}>
              <IsiBergerak f={f} it={ISI7[r.i]} t0={JATUH} b={k} t={keluar(k)} dn={0} dom={dom(k)} redup={0} lompat={0} />
            </div>) : null))}
          {/* garis karakter tiap baris (tanpa teks): obligasi tenang, saham bergejolak, indeks mengikuti garis indeks */}
          {BARIS.map((r, k) => <GarisKarakter key={k} f={f} y={BARIS_Y[k]} jenis={r.garis} at={r.gAt} col={ISI7[r.i].col} op={1 - R(f, KEMBALI, KEMBALI + 30, 0, 1, io)} />)}

          {AKIBAT.map((a, k) => <ChipAkibat key={a.teks} p={popIn(f, a.at) + dnAkibat(k)} a={a} />)}
          {/* "underlying asset" — pil di bawah keranjang */}
          <PilUnderlying p={popIn(f, M('bergantung', bergantung) + 20)} />

          {/* kaca pembesar: melihat simpul → label → isi keranjang */}
          <Kaca f={f} off={off} />
          {/* Saham terangkat keluar dari tumpukan (lapisan atas) — Scene 08 mengambil alih di posisi ini */}
          {f < BATAS.s8 && angkatSaham > 0.25 ? <IsiBergerak f={f} it={ISI7[2]} t0={JATUH} b={-1} t={0} dn={0} dom={0} redup={0} lompat={SAHAM_ANGKAT * angkatSaham} /> : null}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.turq, opacity: R(f, BATAS.s8 + 22, BATAS.s8 + 48, 0, 1, io) }} /> : null}
    {/* ikon bab memudar masuk di atas isian → saat ditukar ke simpul peta (BATAS.s8+52) gambarnya sudah identik */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s8 + 34, BATAS.s8 + 48, 0, 1, io) }}><Icon name="reksaDana" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/** Saham terangkat setinggi ini (px) di akhir Scene 07; Scene 08 mulai dari ISI7[2] − SAHAM_ANGKAT (koordinat dunia Scene 07) */
export const SAHAM_ANGKAT = 150;

/** keranjang stok (Flaticon #9427124) dalam koordinat ikon 512 × SK; `belakang` = pegangan saja, `depan` = bibir + badan */
const Keranjang: React.FC<{ bagian: 'belakang' | 'depan'; p: number }> = ({ bagian, p }) => {
  if (p <= 0.001) return null;
  const ic = ICON[IKON.keranjang];
  const POTONG = 205 * SK; // antara pegangan (≤195) dan bibir (≥213)
  return (
    <div style={{ position: 'absolute', left: KB.x, top: KB.y, width: 512 * SK, height: 512 * SK, transform: `scale(${p})`, transformOrigin: `${256 * SK}px ${360 * SK}px`,
      clipPath: bagian === 'belakang' ? `inset(0 0 ${512 * SK - POTONG}px 0)` : `inset(${POTONG}px 0 0 0)` }}>
      <svg viewBox={ic.vb} width={512 * SK} height={512 * SK} style={{ display: 'block', color: B.turq }} dangerouslySetInnerHTML={{ __html: ic.body }} />
    </div>);
};

/** isi keranjang: jatuh masuk (t0), lalu bisa KELUAR ke baris hasil `b` (t: 0 di keranjang → 1 di baris) */
const IsiBergerak: React.FC<{ f: number; it: Isi; t0: number; b: number; t: number; dn: number; dom: number; redup: number; lompat: number }> = ({ f, it, t0, b, t, dn, dom, redup, lompat }) => {
  const jatuh = R(f, t0, t0 + 40, 0, 1, io);
  const s = popIn(f, t0 + 30);
  if (s <= 0.001) return null;
  let x = it.x, y = lerp(it.y - 170, it.y, jatuh) - lompat, d = ISI_D * (1 + 0.25 * dom);
  if (b >= 0 && t > 0) {
    const p = titikJalur(JALUR[`${it.teks}>${b}`], t);
    x = p.x; y = p.y; d = lerp(ISI_D, 100, t) * (1 + 0.25 * dom);
  }
  return (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: 99, background: it.col, display: 'grid', placeItems: 'center', transform: `scale(${s + dn})`, opacity: 1 - 0.55 * redup, boxShadow: `0 14px 30px -12px ${it.col}aa` }}>
      <Icon name={it.ikon} size={d * 0.58} color={B.white} />
    </div>);
};

/**
 * JALUR KELUAR isi → baris hasil: naik di atas tumpukan → ke kanan → turun di lorong (bebas dari keranjang & ikon baris lain)
 * → masuk barisnya dari kiri. Kurva Catmull-Rom (sentripetal) melewati titik-titik itu, disampel per PANJANG LINTASAN
 * sehingga t (inOut cubic) = jarak tempuh — tidak ada bagian yang tiba-tiba melesat.
 */
type Pt = { x: number; y: number };
const catmull = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number): Pt => {
  const a = 0.5, td = (p: Pt, q: Pt) => Math.pow(Math.hypot(q.x - p.x, q.y - p.y), a) || 1e-6;
  const t0 = 0, t1 = t0 + td(p0, p1), t2 = t1 + td(p1, p2), t3 = t2 + td(p2, p3), t = lerp(t1, t2, u);
  const L = (P: Pt, Q: Pt, ta: number, tb: number) => ({ x: ((tb - t) * P.x + (t - ta) * Q.x) / (tb - ta), y: ((tb - t) * P.y + (t - ta) * Q.y) / (tb - ta) });
  const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3);
  const B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3);
  return L(B1, B2, t1, t2);
};
const buatJalur = (P0: Pt, b: number) => {
  const Y = BARIS_Y[b];
  const W: Pt[] = [P0, { x: P0.x, y: ANGKAT_Y }, { x: LORONG_X, y: ANGKAT_Y + 40 }, { x: LORONG_X, y: Y - 30 }, { x: RX, y: Y }];
  const E = [{ x: 2 * W[0].x - W[1].x, y: 2 * W[0].y - W[1].y }, ...W, { x: 2 * W[4].x - W[3].x, y: 2 * W[4].y - W[3].y }];
  const pts: Pt[] = [];
  for (let s = 0; s < W.length - 1; s++) for (let i = 0; i < 40; i++) pts.push(catmull(E[s], E[s + 1], E[s + 2], E[s + 3], i / 40));
  pts.push(W[W.length - 1]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, cum };
};
const titikJalur = (j: { pts: Pt[]; cum: number[] }, t: number): Pt => {
  const L = j.cum[j.cum.length - 1] * Math.max(0, Math.min(1, t));
  let i = 1;
  while (i < j.cum.length - 1 && j.cum[i] < L) i++;
  const r = (L - j.cum[i - 1]) / (j.cum[i] - j.cum[i - 1] || 1);
  return { x: lerp(j.pts[i - 1].x, j.pts[i].x, r), y: lerp(j.pts[i - 1].y, j.pts[i].y, r) };
};
const JALUR: Record<string, { pts: Pt[]; cum: number[] }> = Object.fromEntries(BARIS.map((r, b) => [`${ISI7[r.i].teks}>${b}`, buatJalur(ISI7[r.i], b)]));

/** nama bab → LABEL: pil bercincin (lubang tali di ujung kanan); `kanan` 0 = berpusat di x, 1 = tepi kanan di x */
const LabelTag: React.FC<{ f: number; x: number; y: number; kanan: number; tag: number; denyutTag: number }> = ({ f, x, y, kanan, tag, denyutTag }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${-50 - 50 * kanan}%, -50%) scale(${1 + denyutTag})`, transformOrigin: 'center', display: 'flex', alignItems: 'center', gap: 12,
    background: tag > 0.001 ? `rgba(255,255,255,${tag})` : 'transparent', border: `2.5px solid rgba(92,200,227,${Math.min(1, tag)})`, borderRadius: 999, padding: `${10 * tag}px ${16 * tag}px ${10 * tag}px ${26 * tag}px`, whiteSpace: 'nowrap', lineHeight: 1 }}>
    <WordText f={f} at={TENGAH + 20} style={{ fontFamily: F, fontSize: lerp(40, 30, Math.max(tag, kanan)), fontWeight: 800, color: B.night }}>Reksa dana</WordText>
    {tag > 0.001 ? <span style={{ width: 14 * tag, height: 14 * tag, borderRadius: 99, border: `3px solid ${B.turq}`, display: 'inline-block' }} /> : null}
  </div>);

/** kaca pembesar (ikon stok #12133381 dalam lencana): simpul → label → menyapu slot isi keranjang */
const Kaca: React.FC<{ f: number; off: number }> = ({ f, off }) => {
  const s = popIn(f, TENGAH + 40) * (1 - R(f, apa + 20, apa + 50, 0, 1, io));
  if (s <= 0.001) return null;
  const P = [
    { x: NODE.x + 125, y: NODE.y - 115 }, // melihat simpul reksa dana
    { x: TAG_TENGAH.x + 150, y: TAG_TENGAH.y }, // melihat label
  ];
  // "saat melihat reksa dana": lensa mengitari simpul (kanan-atas → kanan), lalu turun ke label
  const putar = R(f, melihat + 30, melihat + 130, 0, 1, io), sudut = lerp(-43, 8, putar) * Math.PI / 180;
  P[0] = { x: NODE.x + 170 * Math.cos(sudut), y: NODE.y + 170 * Math.sin(sudut) };
  const keLabel = R(f, label - 20, label + 40, 0, 1, io);
  const keIsi = R(f, KE_KERANJANG, KE_KERANJANG + 60, 0, 1, io);
  // sapuan slot: kiri → kanan, posisi kanan-bawah slot
  const jalur = URUT_JATUH.map((k) => ({ x: ISI7[k].x + 50 + off, y: ISI7[k].y + 50 }));
  const u = R(f, sebenarnya - 10, apa + 10, 0, 3, io), k = Math.min(2, Math.floor(u)), r = u - k;
  const sapu = { x: lerp(jalur[k].x, jalur[k + 1].x, r), y: lerp(jalur[k].y, jalur[k + 1].y, r) };
  const x = lerp(lerp(P[0].x, P[1].x, keLabel), sapu.x, keIsi), y = lerp(lerp(P[0].y, P[1].y, keLabel), sapu.y, keIsi);
  const D = 96;
  return (
    <KacaPembesar x={x} y={y} d={D} s={s} />);
};

/** garis karakter (ilustrasi tanpa teks) di ujung baris: tergambar kiri → kanan (inOut cubic) mulai 18f sebelum kata `at` */
const GarisKarakter: React.FC<{ f: number; y: number; jenis: 'stabil' | 'gejolak' | 'indeks'; at: number; col: string; op: number }> = ({ f, y, jenis, at, col, op }) => {
  const p = popIn(f, at - 48); // kartu muncul dulu, garisnya tergambar sesudahnya
  const g = R(f, at - 18, at + 72, 0, 1, io);
  if (p <= 0.001 || op <= 0.001) return null;
  const N = 48, x0 = GARIS_X + GARIS.pad, w = GARIS.w - 2 * GARIS.pad, h = GARIS.h - 2 * GARIS.pad;
  const fy: Record<typeof jenis, (t: number) => number> = {
    stabil: (t) => h * (0.62 - 0.3 * t) + 3 * Math.sin(t * 9),
    gejolak: (t) => h * (0.6 - 0.25 * t) - h * 0.42 * Math.sin(t * 13) * (0.5 + 0.5 * t),
    indeks: (t) => h * (0.58 - 0.22 * t) - h * 0.22 * Math.sin(t * 8) + 4,
  };
  const yIdx = (t: number) => h * (0.58 - 0.22 * t) - h * 0.22 * Math.sin(t * 8);
  const titik = (fn: (t: number) => number, p: number) => Array.from({ length: Math.max(2, Math.ceil(p * N)) }, (_, i) => {
    const t = Math.min(p, i / (N - 1));
    return `${(x0 + t * w).toFixed(1)},${(y - h / 2 + fn(t)).toFixed(1)}`;
  }).join(' ');
  const gIdx = R(f, at - 48, at + 12, 0, 1, io); // garis indeks (putus-putus) tergambar dulu
  const gGaris = jenis === 'indeks' ? R(f, at + 12, at + 92, 0, 1, io) : g;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <div style={{ position: 'absolute', left: GARIS_X, top: y - GARIS.h / 2, width: GARIS.w, height: GARIS.h, borderRadius: 18, background: B.white, border: `2.5px solid ${col}`, boxShadow: `0 10px 24px -12px ${col}aa`, transform: `scale(${p})`, transformOrigin: 'center' }} />
      {p > 0.9 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {jenis === 'indeks' && gIdx > 0.001 ? <polyline points={titik(yIdx, gIdx)} fill="none" stroke={B.grayLite} strokeWidth={4} strokeDasharray="7 9" strokeLinecap="round" /> : null}
          {gGaris > 0.001 ? <polyline points={titik(fy[jenis], gGaris)} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </svg>) : null}
    </div>);
};

/** pil hasil (chip standar 8/26, celah 12) — tepi kiri di x */
const PilHasil: React.FC<{ x: number; y: number; p: number; teks: string; ikon: KunciIkon; col: string }> = ({ x, y, p, teks, ikon, col }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translateY(-50%) scale(${p})`, transformOrigin: 'center', display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}aa` }}>
    <div style={{ width: 48, height: 48, borderRadius: 99, background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={32} color={B.white} /></div>
    {teks}
  </div>);

/** chip akibat (return / volatilitas / risiko) — tepi kiri = tepi kiri ikon baris hasil */
const ChipAkibat: React.FC<{ p: number; a: (typeof AKIBAT)[number] }> = ({ p, a }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: RX - 50, top: a.y, transform: `translateY(-50%) scale(${p})`, transformOrigin: 'center', display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${B.blue}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${B.blue}88` }}>
    <div style={{ width: 48, height: 48, borderRadius: 99, background: B.blue, display: 'grid', placeItems: 'center' }}><Icon name={a.ikon} size={32} color={B.white} /></div>
    {a.teks}
  </div>);

/** pil "Underlying asset" = lencana di TEPI BAWAH keranjang (separuh menumpang, pola kartu versi lama): tinggi susunan nyaris
 *  tak berubah saat pil muncul → kamera tidak perlu turun 36 px di tengah kalimat (terukur) */
const PilUnderlying: React.FC<{ p: number }> = ({ p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: KB.x + 256 * SK, top: KB.y + 494 * SK, transform: `translate(-50%, -50%) scale(${p})`, transformOrigin: 'center', background: B.white, color: B.night, border: `2.5px solid ${B.turq}`, borderRadius: 999, padding: '14px 28px', fontFamily: F, fontSize: 28, fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${B.turq}cc` }}>Underlying asset</div>);

export const S07_BEAT = { reksa, melihat, label, tapi, sebenarnya, apa, keranjang, karakternya, obligasi, saham, indeks, dipengaruhi, jadi, ret, volatilitas, risikonya, bergantung, asset };
