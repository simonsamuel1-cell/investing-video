import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import { ICON } from '../icons.gen';
import { IKON, type KunciIkon } from '../ikon';
import { kamera } from '../kamera';
import { ARAH, B, F, GAP, R, io } from '../theme';
import { Icon, WordText, cin, grow, lerp, popIn, popOut, KacaPembesar } from '../parts/kit';
import { Konektor, SimpulBab } from '../parts/rantai';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { Bundel } from '../parts/uang';
import { Judul } from '../s03/Scene03';

/**
 * SCENE 07 — REKSA DANA. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "FUND BASKET → Money Market Instruments · Bonds · Stocks · Index Constituents ↓ UNDERLYING ASSETS ↓ Return · Volatility · Risk"
 *   TEXT   "Karakter reksa dana / tergantung isi investasinya"
 * Revisi 7 Okt: perpindahan peta bab; "keranjang investasi" = keranjang (ikon stok Flaticon #9427124); nama bab = LABEL bertali.
 * Revisi 8 Okt (Simon: "untuk reksadana … hanya butuh konteksnya diperjelas · ganti line chart ke candlestick · perbesar visual ·
 * pastikan setiap visual center · hapus animasi yang tidak diperlukan"):
 *   - "dana itu diinvestasikan ke apa" → BUNDEL UANG hijau (aset Simon) masuk ke keranjang, lalu isinya "?"
 *   - "sebagian besar isinya obligasi / saham / mengikuti indeks" → isi keranjang BERGANTI jadi mayoritas instrumen itu (3 dari 4,
 *     ikon dibalik di tempat) — dulu hanya satu ikon membesar 25 % (maksud "sebagian besar" tidak terbaca)
 *   - baris hasil: ikon → panah → KARTU GRAFIK (dulu garis mini kecil): saham & indeks = CANDLESTICK, obligasi tetap LINE CHART (Simon
 *     8 Okt: "linechart yang diganti hanya di saham dan index saja"); skala harga SAMA di ketiga kartu → tenang vs bergejolak vs
 *     mengikuti garis indeks terbaca jujur; pil "Mirip …" menumpang di tepi atas kartu
 *   - dibuang: lensa mengitari simpul, sapuan lensa, denyut keranjang/isi/label, isi terbang keluar-masuk keranjang, lompatan isi
 *   - nomor bab "05" dihapus; semua diperbesar (keranjang 0,85 → 1, isi 112 → 132, ikon baris 110, kartu 420 × 150)
 * Geometri dunia = layar (kamera diam): tiap fase berpusat di (960, 540) dari ukurannya sendiri.
 */
export const S7 = BATAS.s7;
export const IDE_S07_AWAL = S7;

// urutan = urutan UCAPAN
const [reksa, melihat, label, tapi, melihat2, sebenarnya, dana, diinvestasikan, apa, karena, , obligasi, karakternya, , saham,
  pergerakannya, , indeks, kinerjanya, jadi, ret, volatilitas, risikonya, bergantung, underlying, asset] =
  urut(['reksa', 'melihat', 'label', 'tapi', 'melihat', 'sebenarnya', 'dana', 'diinvestasikan', 'apa', 'karena', 'kalau', 'obligasi', 'karakternya',
    'kalau', 'saham', 'pergerakannya', 'kalau', 'indeks', 'kinerjanya', 'jadi', 'return', 'volatilitas', 'risikonya', 'bergantung',
    'underlying', 'asset-nya'], S7);
/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── geometri (dunia = layar) ── */
const NODE = { x: 960, y: 512, d: 200 }; // simpul + nama di bawahnya berpusat di y 540
/** keranjang = ikon stok 512 × 512 (pegangan y 17–195 · bibir 213–229 · badan 247–494), skala SK */
const SK = 1;
/** posisi AKHIR keranjang (bersama baris hasil); sebelum baris pertama rombongan keranjang berada +GESER (keranjang + label berpusat) */
const KB = { x: 448, y: 285 }; // kiri-atas kotak ikon; tinta pegangan…dasar (17…494) berpusat di y 540 (x terukur: label…kartu berpusat di 960)
const GESER = 382; // terukur: label + keranjang berpusat di 960
const kb = (bx: number, by: number) => ({ x: KB.x + bx * SK, y: KB.y + by * SK });
const PUSAT_KERANJANG = kb(256, 360);
export const ISI_D = 132;
type Jenis = 'saham' | 'indeks' | 'obligasi' | 'pasarUang';
const JENIS: Record<Jenis, { ikon: KunciIkon; col: string }> = {
  saham: { ikon: 'saham', col: B.orange },
  indeks: { ikon: 'rdIndeks', col: B.orange },
  obligasi: { ikon: 'obligasi', col: B.blue },
  pasarUang: { ikon: 'rdPasarUang', col: B.blue },
};
/** empat slot isi: dua di belakang (lebih tinggi), dua di depan (bibir menutup kakinya) */
const SLOT = [kb(205, 125), kb(417, 125), kb(95, 170), kb(307, 170)];
const URUT_KIRI = [2, 0, 3, 1]; // slot kiri → kanan (urutan jatuh & "?")
/** ikon Saham di slot 0: diangkat di akhir lalu diambil alih Scene 08 (koordinat dunia = layar, kamera S07 = 0) */
export const SAHAM7 = SLOT[0];
export const SAHAM_ANGKAT = 150;

/* ── waktu (frame global) ── */
const ISI_BAB = reksa; // slot bab 05 terisi saat "reksa dana"
const TENGAH = ISI_BAB + 90;
const PINDAH_TAG = A0('tapi', tapi) + 20; // nama → label pindah ke keranjang BERSAMA keranjang muncul (dulu 30f lebih dulu → isi berat ke kiri)
const KE_KERANJANG = PINDAH_TAG + 50; // simpul mengecil masuk keranjang
const JATUH = A0('karena', karena); // instrumen jatuh ke keranjang
const SLIDE = obligasi + 18; // rombongan keranjang ke kiri SESUDAH isinya berganti mayoritas obligasi — langsung disusul tabel baris hasil
const TABEL = SLIDE + 25; // ikon · panah · kartu ketiga baris muncul BERSAMA (susunan utuh → tetap berpusat) dan IKUT BERGESER masuk
// bersama keranjang (satu gerak geser, kanan layar tak pernah kosong — terukur: dulu −264 px selama 0,8 dtk); isinya menyusul per kalimat

/** komposisi isi per fase: campuran → mayoritas obligasi → mayoritas saham → mengikuti indeks → campuran lagi */
const KOMPOSISI: { at: number; isi: Jenis[] }[] = [
  { at: -1e9, isi: ['saham', 'indeks', 'obligasi', 'pasarUang'] },
  { at: obligasi - 30, isi: ['obligasi', 'indeks', 'obligasi', 'obligasi'] },
  { at: saham - 30, isi: ['saham', 'saham', 'obligasi', 'saham'] },
  { at: indeks - 30, isi: ['indeks', 'indeks', 'indeks', 'saham'] },
  { at: jadi - 10, isi: ['saham', 'indeks', 'obligasi', 'pasarUang'] },
];
const BALIK_D = 30, BALIK_JEDA = 8;
/** isi slot k di frame f: jenis yang tampil + lebar balik (1 = utuh, 0 = tepat di tengah balikan) */
const isiSlot = (f: number, k: number): { jenis: Jenis; lebar: number } => {
  let jenis = KOMPOSISI[0].isi[k], lebar = 1;
  for (let i = 1; i < KOMPOSISI.length; i++) {
    const lama = KOMPOSISI[i - 1].isi[k], baru = KOMPOSISI[i].isi[k];
    if (lama === baru) continue;
    // jeda bertingkat hanya di antara slot yang BERUBAH (kiri → kanan)
    const urutan = URUT_KIRI.filter((s) => KOMPOSISI[i - 1].isi[s] !== KOMPOSISI[i].isi[s]).indexOf(k);
    const t0 = KOMPOSISI[i].at + BALIK_JEDA * urutan;
    if (f < t0) break;
    const p = R(f, t0, t0 + BALIK_D, 0, 1, io);
    jenis = p < 0.5 ? lama : baru;
    lebar = Math.abs(Math.cos(Math.PI * p));
  }
  return { jenis, lebar };
};

/* ── baris hasil (kanan): ikon → panah → kartu candlestick ── */
const BARIS_Y = [367, 552, 737]; // terukur: pil baris 1 … kartu baris 3 berpusat bersama keranjang di y 541
const RD = 110;
const RX = KB.x + 486 * SK + 110 + RD / 2; // pusat ikon baris
const KARTU = { x: RX + RD / 2 + GAP + 84 + GAP, w: 440, h: 156 };
type Lilin = 'stabil' | 'gejolak' | 'indeks';
const BARIS: { jenis: Jenis; mulai: number; teks: string; lilin: Lilin }[] = [
  { jenis: 'obligasi', mulai: TABEL + 40, teks: 'Mirip obligasi', lilin: 'stabil' }, // "karakternya akan lebih mirip obligasi"
  { jenis: 'saham', mulai: A0('pergerakannya', pergerakannya), teks: 'Mirip saham', lilin: 'gejolak' },
  { jenis: 'indeks', mulai: A0('kinerjanya', kinerjanya), teks: 'Ikut indeks', lilin: 'indeks' },
];
/** Return · Volatilitas · Risiko: chip SAMA LEBAR (kolom rapi, tepi kanan tetap → susunan berpusat sejak chip pertama) */
const AKIBAT_X = 1397, AKIBAT_W = 310;
const AKIBAT = [
  { teks: 'Return', ikon: 'returnInvestasi' as KunciIkon, y: BARIS_Y[0], at: ret - 30 },
  { teks: 'Volatilitas', ikon: 'naikTurunHarga' as KunciIkon, y: BARIS_Y[1], at: volatilitas - 30 },
  { teks: 'Risiko', ikon: 'risiko' as KunciIkon, y: BARIS_Y[2], at: risikonya - 30 },
];
/** label "Reksa dana": di tengah = di bawah simpul; di keranjang = tergantung di kiri bibir */
const JARAK = 16;
const TAG_TENGAH = { x: NODE.x, y: NODE.y + NODE.d / 2 + JARAK + 28 };
const TAG_KERANJANG = { kanan: KB.x + 44 * SK - JARAK, y: KB.y + 330 * SK };
const KAIT = kb(26, 221); // ujung kiri bibir — tali label

export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < S7) return null;
  // KELUAR = milik Scene 08: ikon Saham TERANGKAT dari keranjang 40f sebelumnya (diambil alih Scene 08 → slot bab 06); sisa isi
  // MASKER LINGKARAN menyusut ke simpul bab 05 di peta bab, berubah turkis + ikonnya, lalu peta mengambil alih. 50f mulai BATAS.s8.
  if (f >= BATAS.s8 + 52) return null;
  const ex = R(f, BATAS.s8, BATAS.s8 + 50, 0, 1, io);
  const kam8 = kamera('S08', BATAS.s8 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...SIMPUL_PETA(4), x: SIMPUL_PETA(4).x + kam8.x, y: SIMPUL_PETA(4).y + kam8.y };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  const angkatSaham = R(f, BATAS.s8 - 40, BATAS.s8, 0, 1, io);
  const kam = kamera('S07', f);

  const morf = cin(f, KE_KERANJANG); // simpul mengecil masuk keranjang
  const pKeranjang = popIn(f, KE_KERANJANG + 10);
  const tag = popIn(f, label); // nama → label bertali-cincin
  const off = GESER * (1 - R(f, SLIDE, SLIDE + 60, 0, 1, io)); // rombongan keranjang: tengah → kiri
  const pindahTag = R(f, PINDAH_TAG, PINDAH_TAG + 50, 0, 1, io);
  const tagX = lerp(TAG_TENGAH.x, TAG_KERANJANG.kanan + off, pindahTag), tagY = lerp(TAG_TENGAH.y, TAG_KERANJANG.y, pindahTag);
  const tali = grow(f, KE_KERANJANG + 50);
  const opBaris = 1 - R(f, ret - 60, ret - 30, 0, 1, io); // pudar tepat saat chip Return mulai tumbuh (tak ada momen keranjang sendirian)

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS peta bab yang baru */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s8, BATAS.s8 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <AbsoluteFill>
        <Judul f={f} kata={['Karakter', 'reksa dana']} at={M('karakternya', karakternya)} sorotAt={karakternya + 40} keluar={jadi + 10} />
        <Judul f={f} kata={['Tergantung', 'isi investasinya']} at={M('bergantung', bergantung) + 40} sorotAt={asset} />
      </AbsoluteFill>

      {/* ISI — kamera (translate3d + rotasi mikro); judul tidak ikut */}
      <AbsoluteFill style={{ transform: geser(kam.x, kam.y) }}>
        {/* ═════ pembuka bab: peta bab → simpul bab 05 ke tengah ═════ */}
        <PembukaBab f={f} s0={S7} k={4} isiAt={ISI_BAB} tengah={NODE} selesai={TENGAH} />
        {/* simpul bab 05 → mengecil masuk ke keranjang */}
        {f >= TENGAH && morf < 1 ? <SimpulBab x={lerp(NODE.x, PUSAT_KERANJANG.x + off, morf)} y={lerp(NODE.y, PUSAT_KERANJANG.y, morf)} d={NODE.d * (1 - morf)} col={B.turq} ikon="reksaDana" isi={1} /> : null}

        {/* ═════ KERANJANG: pegangan (belakang) · uang · "?" · isi · bibir + badan (depan) ═════ */}
        <div style={{ position: 'absolute', inset: 0, transform: geser(off, 0) }}>
          <Keranjang bagian="belakang" p={pKeranjang} />
          {/* "dana itu": bundel uang hijau masuk ke keranjang lalu tenggelam di balik badannya */}
          <UangMasuk f={f} />
          {/* slot "?" — isi belum diketahui ("diinvestasikan ke apa") */}
          {URUT_KIRI.map((k, i) => {
            const slot = popIn(f, diinvestasikan - 10 + 10 * i) * (1 - R(f, JATUH + 20 * i + 10, JATUH + 20 * i + 30, 0, 1, io));
            return slot > 0.001 ? <div key={k} style={{ position: 'absolute', left: SLOT[k].x - ISI_D / 2, top: SLOT[k].y - ISI_D / 2, width: ISI_D, height: ISI_D, borderRadius: 99, border: `3px dashed ${B.grayLite}`, background: B.white, transform: `scale(${slot})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 52, fontWeight: 800, color: B.gray }}>?</div> : null;
          })}
          {/* isi (belakang dulu, lalu depan) */}
          {[0, 1, 2, 3].map((k) => {
            if (k === 0 && angkatSaham > 0.25) return null; // terangkat: lapisan atas (posisi sama — tak ada loncatan)
            const t0 = JATUH + 20 * URUT_KIRI.indexOf(k);
            return <IsiSlot key={k} f={f} k={k} t0={t0} angkat={k === 0 ? SAHAM_ANGKAT * angkatSaham : 0} />;
          })}
          <Keranjang bagian="depan" p={pKeranjang} />
        </div>

        {/* label "Reksa dana" — tergantung di kiri bibir keranjang */}
        {tali > 0.001 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <line x1={TAG_KERANJANG.kanan - 22 + off} y1={TAG_KERANJANG.y - 10} x2={lerp(TAG_KERANJANG.kanan - 22, KAIT.x, tali) + off} y2={lerp(TAG_KERANJANG.y - 10, KAIT.y, tali)} stroke={B.turq} strokeWidth={3} strokeLinecap="round" />
          </svg>) : null}
        <LabelTag f={f} x={tagX} y={tagY} kanan={pindahTag} tag={tag} />

        {/* ═════ baris hasil: ikon → panah → kartu candlestick (satu sumbu per baris) — ikut geser rombongan keranjang ═════ */}
        <div style={{ position: 'absolute', inset: 0, transform: geser(off, 0) }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {BARIS.map((r, k) => <Konektor key={k} x1={RX + RD / 2 + GAP} y1={BARIS_Y[k]} x2={KARTU.x - GAP} y2={BARIS_Y[k]} g={grow(f, TABEL + 20 * k + 20)} op={opBaris * (k === 0 ? 1 : lerp(0.4, 1, R(f, r.mulai - 10, r.mulai + 20, 0, 1, io)))} col={JENIS[r.jenis].col} />)}
        </svg>
        {BARIS.map((r, k) => {
          // baris yang belum dibahas meredup (sorot = pudar opasitas); aktif saat kalimatnya
          const op = opBaris * (k === 0 ? 1 : lerp(0.4, 1, R(f, r.mulai - 10, r.mulai + 20, 0, 1, io)));
          return (
            <React.Fragment key={k}>
              <Bulat x={RX} y={BARIS_Y[k]} d={RD} col={JENIS[r.jenis].col} ikon={JENIS[r.jenis].ikon} s={popIn(f, TABEL + 20 * k)} op={op} />
              <KartuLilin f={f} y={BARIS_Y[k]} jenis={r.lilin} col={JENIS[r.jenis].col} teks={r.teks} muncul={TABEL + 20 * k + 30} mulai={r.mulai} op={op} />
            </React.Fragment>);
        })}
        </div>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {/* Return · Volatilitas · Risiko: dari keranjang */}
          {AKIBAT.map((a) => <Konektor key={a.teks} x1={KB.x + 470 * SK + GAP} y1={KB.y + 330 * SK} x2={AKIBAT_X - GAP} y2={a.y} g={grow(f, a.at - 10)} col={B.turq} />)}
        </svg>

        {AKIBAT.map((a) => <ChipAkibat key={a.teks} p={popIn(f, a.at)} a={a} />)}
        {/* "underlying asset" — pil di tepi bawah keranjang */}
        <PilUnderlying p={popIn(f, underlying - 30)} />

        {/* kaca pembesar: simpul → label → isi keranjang (tanpa mengitari / menyapu) */}
        <Kaca f={f} off={off} />
        {/* Saham terangkat keluar dari keranjang (lapisan atas) — Scene 08 mengambil alih di posisi ini */}
        {f < BATAS.s8 && angkatSaham > 0.25 ? <Bulat x={SAHAM7.x} y={SAHAM7.y - SAHAM_ANGKAT * angkatSaham} d={ISI_D} col={B.orange} ikon="saham" s={1} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.turq, opacity: R(f, BATAS.s8 + 22, BATAS.s8 + 48, 0, 1, io) }} /> : null}
    {/* ikon bab memudar masuk di atas isian → saat ditukar ke simpul peta (BATAS.s8+52) gambarnya sudah identik */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s8 + 34, BATAS.s8 + 48, 0, 1, io) }}><Icon name="reksaDana" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

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

/** bundel uang hijau jatuh ke keranjang di kata "dana", tenggelam di balik badan lalu pudar */
const UangMasuk: React.FC<{ f: number }> = ({ f }) => {
  const t = R(f, dana - 24, dana + 26, 0, 1, io);
  if (t <= 0 || t >= 1) return null;
  const c = kb(256, 0);
  return <Bundel x={c.x} y={lerp(KB.y - 40, KB.y + 330 * SK, t)} w={170} op={Math.min(1, R(f, dana - 24, dana - 14, 0, 1, io), 1 - R(f, dana + 14, dana + 26, 0, 1, io))} />;
};

/** satu isi keranjang di slot k: jatuh masuk (t0), lalu berganti jenis sesuai KOMPOSISI (dibalik di tempat) */
const IsiSlot: React.FC<{ f: number; k: number; t0: number; angkat?: number }> = ({ f, k, t0, angkat = 0 }) => {
  const jatuh = R(f, t0, t0 + 40, 0, 1, io);
  const s = popIn(f, t0 + 30);
  if (s <= 0.001) return null;
  const { jenis, lebar } = isiSlot(f, k);
  const j = JENIS[jenis], x = SLOT[k].x, y = lerp(SLOT[k].y - 170, SLOT[k].y, jatuh) - angkat;
  return (
    <div style={{ position: 'absolute', left: x - ISI_D / 2, top: y - ISI_D / 2, width: ISI_D, height: ISI_D, borderRadius: 99, background: j.col, display: 'grid', placeItems: 'center', transform: `scale(${s * lebar}, ${s})`, boxShadow: `0 14px 30px -12px ${j.col}aa` }}>
      <Icon name={j.ikon} size={ISI_D * 0.58} color={B.white} />
    </div>);
};

/** nama bab → LABEL: pil bercincin (lubang tali di ujung kanan); `kanan` 0 = berpusat di x, 1 = tepi kanan di x */
const LabelTag: React.FC<{ f: number; x: number; y: number; kanan: number; tag: number }> = ({ f, x, y, kanan, tag }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${-50 - 50 * kanan}%, -50%)`, display: 'flex', alignItems: 'center', gap: 12,
    background: tag > 0.001 ? `rgba(255,255,255,${tag})` : 'transparent', border: `2.5px solid rgba(92,200,227,${Math.min(1, tag)})`, borderRadius: 999, padding: `${10 * tag}px ${16 * tag}px ${10 * tag}px ${26 * tag}px`, whiteSpace: 'nowrap', lineHeight: 1 }}>
    <WordText f={f} at={TENGAH + 20} style={{ fontFamily: F, fontSize: lerp(40, 34, Math.max(tag, kanan)), fontWeight: 800, color: B.night }}>Reksa dana</WordText>
    {tag > 0.001 ? <span style={{ width: 16 * tag, height: 16 * tag, borderRadius: 99, border: `3px solid ${B.turq}`, display: 'inline-block' }} /> : null}
  </div>);

/** kaca pembesar (ikon stok #12133381): "tapi melihat: sebenarnya dana itu diinvestasikan ke apa" — melihat ke DALAM keranjang, diam
 *  (dulu mengitari simpul → label → menyapu slot: tiga gerak tanpa makna baru, dan menarik pusat susunan ±86 px ke kanan) */
const Kaca: React.FC<{ f: number; off: number }> = ({ f, off }) => {
  const s = popIn(f, Math.max(melihat2 + 20, KE_KERANJANG + 10)) * popOut(f, apa + 40);
  if (s <= 0.001) return null;
  const P = kb(256, 150);
  return <KacaPembesar x={P.x + off} y={P.y} d={120} s={s} />;
};

/**
 * KARTU GRAFIK — tiap baris memperagakan "karakter"-nya. Simon 8 Okt: "linechart yang diganti hanya di saham dan index saja" +
 * "pastikan candlesticknya realistis" → candle = DATA PASAR ASLI (bukan deret karangan), dari arsip proyek sendiri (tanpa unduhan):
 *   saham  = ADMR.JK mingguan 6 Okt – 8 Des 2025 (OHLC riil; rentang mingguan rata-rata 17 %, naik-turun bergantian, terverifikasi ke TradingView di Video 10 · data/admrWeekly.ts)
 *   indeks = IHSG (^JKSE) bulanan Apr – Des 2020 (OHLC riil, Video Quant Trading · chart-data.ts); garis putus-putus = penutupan IHSG
 *   obligasi = line chart tenang (bukan candlestick)
 * Semua dinormalisasi ke % dari harga buka pertama dan digambar dengan skala % yang SAMA (−6 … +43 %) → tenang vs bergejolak vs
 * mengikuti indeks terbandingkan jujur. Hijau = naik, merah = turun (ARAH). Badan 60 % jarak candle, sumbu tipis (proporsi chart nyata).
 */
type OHLC = [number, number, number, number];
const ADMR: OHLC[] = [[1095, 1530, 1065, 1370], [1335, 1480, 1180, 1195], [1225, 1400, 1220, 1315], [1325, 1540, 1320, 1395], [1395, 1440, 1320, 1400],
  [1405, 1480, 1330, 1340], [1340, 1385, 1260, 1300], [1300, 1330, 1255, 1270], [1270, 1325, 1255, 1290], [1300, 1515, 1300, 1400]];
const IHSG: OHLC[] = [[4539, 4795, 4488, 4716], [4716, 4807, 4507, 4754], [4754, 5125, 4711, 4905], [4905, 5236, 4895, 5150],
  [5150, 5378, 5132, 5238], [5238, 5371, 4837, 4870], [4870, 5174, 4860, 5128], [5128, 5824, 5128, 5612], [5612, 6175, 5547, 5979]];
const persen = (d: OHLC[]): OHLC[] => d.map((b) => b.map((v) => (v / d[0][0] - 1) * 100) as OHLC);
const DERET: Record<Exclude<Lilin, 'stabil'>, OHLC[]> = { gejolak: persen(ADMR), indeks: persen(IHSG) };
/** obligasi: naik pelan & rata (% dari awal) */
const GARIS_OBLIGASI = [0, 0.7, 0.5, 1.4, 2.1, 1.8, 2.8, 3.5, 3.2, 4.2];
const SKALA = { lo: -6, hi: 43 };
const KartuLilin: React.FC<{ f: number; y: number; jenis: Lilin; col: string; teks: string; muncul: number; mulai: number; op: number }> = ({ f, y, jenis, col, teks, muncul, mulai, op }) => {
  const p = popIn(f, muncul);
  if (p <= 0.001 || op <= 0.001) return null;
  const pad = { x: 26, y: 22 }, w = KARTU.w - 2 * pad.x, h = KARTU.h - 2 * pad.y;
  const x0 = KARTU.x + pad.x, top = y - KARTU.h / 2 + pad.y;
  const n = jenis === 'stabil' ? GARIS_OBLIGASI.length : DERET[jenis].length;
  const px = (k: number) => x0 + (w / n) * (k + 0.5);
  const py = (v: number) => top + h * (1 - (v - SKALA.lo) / (SKALA.hi - SKALA.lo));
  const gIdx = jenis === 'indeks' ? R(f, mulai + 20, mulai + 80, 0, 1, io) : 0;
  const a = jenis === 'indeks' ? mulai + 80 : mulai + 20;
  const g = R(f, a, a + 90, 0, n, (t) => t);
  const bw = (w / n) * 0.6;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <div style={{ position: 'absolute', left: KARTU.x, top: y - KARTU.h / 2, width: KARTU.w, height: KARTU.h, borderRadius: 20, background: B.white, border: `2.5px solid ${col}`, boxShadow: `0 10px 24px -12px ${col}aa`, transform: `scale(${p})`, transformOrigin: 'center' }} />
      {p > 0.95 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {/* garis bantu tipis */}
          {[0.25, 0.75].map((t) => <line key={t} x1={KARTU.x + 18} x2={KARTU.x + KARTU.w - 18} y1={top + h * t} y2={top + h * t} stroke={B.grayLite} strokeWidth={1.5} opacity={0.6} />)}
          {/* indeks: garis penutupan IHSG (putus-putus) tergambar dulu */}
          {gIdx > 0.001 ? <polyline points={garisSampai(DERET.indeks.map((b) => b[3]), gIdx, px, py)} fill="none" stroke={B.gray} strokeWidth={3.5} strokeDasharray="8 9" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {/* obligasi: line chart (tergambar kiri → kanan) */}
          {jenis === 'stabil' && g > 0.001 ? <polyline points={garisSampai(GARIS_OBLIGASI, g / n, px, py)} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
          {jenis !== 'stabil' && DERET[jenis].map(([o, hi, lo, c], k) => {
            const t = io(Math.max(0, Math.min(1, g - k)));
            if (t <= 0.001) return null;
            const warna = c >= o ? ARAH.naik : ARAH.turun;
            const yo = py(o), yc = lerp(yo, py(c), t);
            const yA = Math.min(yo, yc), tinggi = Math.max(2.5, Math.abs(yc - yo));
            return (
              <g key={k}>
                <line x1={px(k)} x2={px(k)} y1={lerp(yo, py(hi), t)} y2={lerp(yo, py(lo), t)} stroke={warna} strokeWidth={2.5} strokeLinecap="round" />
                <rect x={px(k) - bw / 2} y={yA} width={bw} height={tinggi} rx={2} fill={warna} />
              </g>);
          })}
        </svg>) : null}
      {/* pil "Mirip …" menumpang di tepi atas kartu */}
      <div style={{ position: 'absolute', left: KARTU.x + 22, top: y - KARTU.h / 2, transform: `translateY(-50%) scale(${popIn(f, mulai)})`, transformOrigin: 'left center', background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 20px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1 }}>
        <WordText f={f} at={mulai + 10} style={{ fontSize: 28 }}>{teks}</WordText>
      </div>
    </div>);
};

/** titik-titik polyline sampai pecahan `u` (0…1) dari panjang deret, ujung diinterpolasi (garis tumbuh mulus) */
const garisSampai = (v: number[], u: number, px: (k: number) => number, py: (x: number) => number) => {
  const t = Math.max(0, Math.min(1, u)) * (v.length - 1), n = Math.floor(t), r = t - n;
  const pts = v.slice(0, n + 1).map((x, k) => `${px(k).toFixed(1)},${py(x).toFixed(1)}`);
  if (n < v.length - 1) pts.push(`${lerp(px(n), px(n + 1), r).toFixed(1)},${lerp(py(v[n]), py(v[n + 1]), r).toFixed(1)}`);
  return pts.join(' ');
};

/** lingkaran ikon */
const Bulat: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number; op?: number }> = ({ x, y, d, col, ikon, s, op = 1 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: 99, background: col, display: 'grid', placeItems: 'center', transform: `scale(${s})`, opacity: op, boxShadow: `0 14px 30px -12px ${col}aa` }}>
      <Icon name={ikon} size={d * 0.58} color={B.white} />
    </div>);

/** chip akibat (return / volatilitas / risiko) — tepi kiri di AKIBAT_X */
const ChipAkibat: React.FC<{ p: number; a: (typeof AKIBAT)[number] }> = ({ p, a }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: AKIBAT_X, width: AKIBAT_W, boxSizing: 'border-box', top: a.y, transform: `translateY(-50%) scale(${p})`, transformOrigin: 'center', display: 'flex', alignItems: 'center', gap: 14, background: B.white, border: `2.5px solid ${B.blue}`, borderRadius: 999, padding: '9px 30px 9px 9px', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${B.blue}88` }}>
    <div style={{ width: 64, height: 64, borderRadius: 99, background: B.blue, display: 'grid', placeItems: 'center' }}><Icon name={a.ikon} size={42} color={B.white} /></div>
    {a.teks}
  </div>);

/** pil "Underlying asset" = lencana di TEPI BAWAH keranjang (separuh menumpang): tinggi susunan nyaris tak berubah saat muncul */
const PilUnderlying: React.FC<{ p: number }> = ({ p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: KB.x + 256 * SK, top: KB.y + 470 * SK, transform: `translate(-50%, -50%) scale(${p})`, transformOrigin: 'center', background: B.white, color: B.night, border: `2.5px solid ${B.turq}`, borderRadius: 999, padding: '14px 30px', fontFamily: F, fontSize: 32, fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${B.turq}cc` }}>Underlying asset</div>);

export const S07_BEAT = { reksa, melihat, label, tapi, sebenarnya, dana, apa, karena, obligasi, karakternya, saham, indeks, jadi, ret, volatilitas, risikonya, bergantung, asset };
