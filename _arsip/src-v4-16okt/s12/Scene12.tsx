import React from 'react';
import { PilNominal, rpMiliar } from '../parts/nominal';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { B, CORET, F, GAP, URUT_WARNA, io, mixHex, R } from '../theme';
import { Icon, MODE_UKUR, Sorot, geserSorot, WordText, card, grow, lerp, popOut, KacaPembesar } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Konektor, SimpulBab } from '../parts/rantai';
import { LembarUang } from '../parts/uang';
import { BAB } from '../s01/data';
import { INSTRUMEN13 } from '../s13/Scene13';

/**
 * SCENE 12 — RANGKUMAN · IDE VISUAL (7 Okt, VO v4). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "Interest · Price Change · Rental Income · Business Growth ↓ VOLATILITY · LIQUIDITY · TIME HORIZON"
 *   TEXT   "Beda aset / beda sumber return / beda kebutuhan" (tiga bagian muncul bertahap di satu baris judul)
 * Gema Scene 01: PETA BAB (enam simpul) kembali; di bawahnya sumber return dihubungkan ke babnya; lalu KARTU LENSA Scene 01.
 * Revisi 8 Okt (Simon, brief B–I): MASUK = isi Scene 11 menyusut (masker) ke simpul bab 06 Saham di peta bab (bab lain tersingkap di
 * balik lingkaran). ADEGAN TANPA TEKS BARU: piala "paling unggul" singgah di tiap bab lalu menggeleng ("tidak ada satu instrumen…");
 * tiap "ada yang…" menyorot babnya (bab lain meredup) dan uang mengalir dari sumber return ke babnya; Saham berbalik jadi perusahaan
 * ("bisnis di belakangnya") lalu membesar ("terus berkembang"); "saat memilih instrumen" = peta menyusut jadi baris instrumen yang
 * disapu kaca pembesar (gema Scene 10), kaca pindah ke kartu Return ("cuma melihat return") lalu menyapu tiga slot "?"
 * ("perlu mempertimbangkan"). Kamera pusat, jarak 16 px, pop berporos di tengah.
 * Revisi 8 Okt malam (Simon, aturan seluruh video): chip coret MERAH (= S09) · uang HIJAU · tanpa geleng/denyut · semua yang muncul = pop
 * easeOutBack berporos di tengahnya, TEPAT di katanya (label sumber di kata sumbernya, slot di "memilih", kartu di katanya) · warna sumber
 * & kartu lensa berbeda (URUT_WARNA) · teks ≥ 30 px, ikon sumber/mini ≥ 80, piala 72.
 */
export const S12 = BATAS.s12;
export const IDE_S12_AWAL = S12;

/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
const A0 = (w: string, at: number) => frasa(w, at) - 18;
// Simon 8 Okt: tiap elemen muncul TEPAT di katanya — + perubahan, pendapatan, tumbuh (label sumber), memilih (slot), return (kartu Return)
const [bandingkan, kelihatan, tidak, hal, ada1, bunga, ada2, perubahan, ada3, pendapatan, dan4, tumbuh, bisnis, berkembang, jadi, memilih,
  kita5, melihat, ret, kita6, volatilitas, likuiditas, dan7, kapan, digunakan] = urut(['bandingkan', 'kelihatan', 'tidak', 'hal', 'ada', 'bunga',
  'ada', 'perubahan', 'ada', 'pendapatan', 'dan', 'tumbuh', 'bisnis', 'berkembang', 'jadi', 'memilih', 'kita', 'melihat', 'return', 'kita',
  'volatilitas', 'likuiditas', 'dan', 'kapan', 'digunakan'], S12);

/** posisi lewat transform ber-rotasi-mikro (bukan left/top): gerak lambat tidak dibulatkan Chrome ke piksel bulat */
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const JARAK = 16;

/* ── peta bab (geometri = Scene 01: nodeX, diperkecil) ── */
const NODE_Y = 330, ND = 120, nodeX = (k: number) => 960 + (k - 2.5) * 290;
/** simpul bab di peta Scene 12 — isi Scene 11 menyusut (masker) ke simpul bab 06 */
export const SIMPUL12 = (k: number) => ({ x: nodeX(k), y: NODE_Y, r: ND / 2 });
/* chip "Paling unggul di semua hal" di atas peta; piala singgah di atas tiap simpul (jarak 16 antar-baris) */
const PIALA = { d: 72, y: NODE_Y - ND / 2 - JARAK - 36 }; // Simon 8 Okt: piala ≥ 72 px (dulu 52)
const CHIP_H = 48 + 16 + 5; // chip gaya S09: lingkaran ikon 48 + padding 8×2 + bingkai 2,5×2
const CHIP_Y = PIALA.y - PIALA.d / 2 - JARAK - CHIP_H / 2;
/* sumber return per bab — label di bawah simpulnya; tiap "ada yang…" menyorot babnya */
const SUMBER_Y = 710; // panah sumber → bab ±170 px: lintasan uang cukup panjang untuk terbaca (dulu 600 → 88 px, gerak di bawah ambang); Simon 8 Okt: +10 untuk lingkaran 80 & teks 30
const LD = 80; // lingkaran ikon sumber (Simon 8 Okt: ≥ 80 px, dulu 64)
/* panah sumber → bab ("return-nya datang dari …"): ujungnya 16 px di bawah nama bab (nama 2 baris 30 px × 1,15 = 69 → berakhir ±473) */
const UJUNG_PANAH = NODE_Y + ND / 2 + 14 + 69 + JARAK;
/** `col` — Simon 8 Okt: sumber bersaudara berwarna BEDA (turunan brand, di luar warna bab supaya tidak terbaca sebagai babnya) */
type Sumber = { teks: string; ikon: KunciIkon; bab: number[]; col: string };
/** `at` = kata sumbernya (Simon 8 Okt: label muncul TEPAT di katanya — dulu 18f sebelum klausa, sampai 3 dtk terlalu awal) */
const KLAUSA: { mulai: number; at: number; sumber: Sumber }[] = [
  { mulai: A0('ada', ada1), at: bunga, sumber: { teks: 'Bunga', ikon: 'bunga', bab: [0, 3], col: URUT_WARNA[3] } },
  { mulai: A0('ada', ada2), at: perubahan, sumber: { teks: 'Perubahan harga', ikon: 'naikTurunHarga', bab: [1], col: URUT_WARNA[4] } },
  { mulai: A0('ada', ada3), at: pendapatan, sumber: { teks: 'Pendapatan sewa', ikon: 'kunciSewa', bab: [2], col: URUT_WARNA[5] } },
  { mulai: A0('dan', dan4), at: tumbuh, sumber: { teks: 'Pertumbuhan bisnis', ikon: 'pertumbuhan', bab: [5], col: URUT_WARNA[6] } }, // reksa dana (bab 05): tergantung isinya — VO tidak menyebut
];
const KLAUSA_AKHIR = A0('jadi', jadi);
/** label sumber per bab: pop di kata sumbernya (dua label Bunga berselang 20f = stagger standar) */
const LABEL = KLAUSA.flatMap((c) => c.sumber.bab.map((b, i) => ({ bab: b, sumber: c.sumber, at: c.at + 20 * i, klausa: c })));

/* ── "saat memilih instrumen investasi": peta menyusut jadi baris instrumen kecil di atas kartu lensa ── */
const PINDAH = { mulai: KLAUSA_AKHIR + 10, selesai: KLAUSA_AKHIR + 70 };
const MINI = { y: 250, d: 80, x: (k: number) => 960 + (k - 2.5) * 96 }; // Simon 8 Okt: ikon mini ≥ 80 px (dulu 64; jarak antar-ikon tetap 16)
/* kartu lensa (gema Scene 01) — Simon 8 Okt: pop TEPAT di katanya; empat warna berbeda (dulu Return & Likuiditas sama-sama biru) */
const LENSA: { teks: string; ikon: KunciIkon; col: string; at: number }[] = [
  { teks: 'Return', ikon: 'returnInvestasi', col: URUT_WARNA[0], at: ret },
  { teks: 'Volatilitas', ikon: 'naikTurunHarga', col: URUT_WARNA[1], at: volatilitas },
  { teks: 'Likuiditas', ikon: 'mudahDicairkan', col: URUT_WARNA[2], at: likuiditas },
  { teks: 'Kapan uang digunakan', ikon: 'jangkaWaktu', col: URUT_WARNA[3], at: kapan },
];
const CW = 300, CH = 380, CG = 40, CY = 330;
const cx = (k: number) => 960 - (4 * CW + 3 * CG) / 2 + k * (CW + CG);
const SLOT_AT = memilih; // Simon 8 Okt: slot "?" pop di kata "memilih" (= frame lama PINDAH.mulai + 50, bersama baris instrumen terbentuk)
/* kaca pembesar: baris instrumen → kartu Return → tiga slot "?" (gema lensa Scene 10) */
const KACA = { muncul: PINDAH.selesai, sapu: [PINDAH.selesai + 20, PINDAH.selesai + 100], keReturn: [A0('kita', kita5) + 20, A0('kita', kita5) + 60],
  slot: [A0('kita', kita6) + 10, A0('volatilitas', volatilitas) - 10] };

export const Scene12: React.FC<{ f: number }> = ({ f }) => {
  if (f < S12) return null;
  // KELUAR = milik Scene 13: MASKER LINGKARAN — seluruh isi (instrumen + lensa) menyusut ke simpul INSTRUMEN Scene 13 = langkah yang sudah
  // dipahami ("Setelah memahami perbedaannya"), berubah biru + ikonnya. 50f mulai BATAS.s13.
  if (f >= BATAS.s13 + 52) return null;
  const ex = R(f, BATAS.s13, BATAS.s13 + 50, 0, 1, io);
  const kam13 = kamera('S13', BATAS.s13 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam13, INSTRUMEN13), r: INSTRUMEN13.r * kam13.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6); // isi menyusut lebih lambat dari lingkarannya → terpotong bertahap
  const pudarPeta = 1 - R(f, KLAUSA_AKHIR, KLAUSA_AKHIR + 30, 0, 1, io); // nama, chip, sumber pergi
  const pindah = R(f, PINDAH.mulai, PINDAH.selesai, 0, 1, io); // simpul → baris instrumen kecil
  const bobot = KLAUSA.map((c, i) => R(f, c.mulai - 15, c.mulai + 15, 0, 1, io) * (1 - R(f, (KLAUSA[i + 1]?.mulai ?? KLAUSA_AKHIR) - 15, (KLAUSA[i + 1]?.mulai ?? KLAUSA_AKHIR) + 15, 0, 1, io)));
  // sorotan = penekanan, bukan isi yang pergi → MODE UKUR (kamera) mengukur peta utuh, kamera tidak ikut bergeser tiap klausa
  // Simon (berulang: S04, S07, S09 — "bukan pop berkelompok + redup"): instrumen yang tidak sedang dibahas TIDAK lagi diredupkan;
  // klausanya ditunjukkan oleh label sumber + panah + uang yang muncul di bawah instrumen itu, tepat di katanya. Dulu 1 − 0,65 × bobot.
  const redup = (_bab: number) => 1;
  void bobot;
  const kam = kamera('S12', f);
  const posSimpul = (k: number) => ({ x: lerp(nodeX(k), MINI.x(k), pindah), y: lerp(NODE_Y, MINI.y, pindah), d: lerp(ND, MINI.d, pindah) });

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS Scene 13 */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s13, BATAS.s13 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <JudulBertahap f={f} />

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s13 - 30)}>
        {/* ═════ peta bab ═════ */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <line x1={posSimpul(0).x} x2={posSimpul(5).x} y1={posSimpul(0).y} y2={posSimpul(5).y} stroke={B.grayLite} strokeWidth={2.5} strokeDasharray="7 11" strokeLinecap="round" />
          {/* Simon 8 Okt: panah tumbuh bersama pop labelnya (di kata sumbernya), berwarna sumbernya */}
          {pudarPeta > 0.001 ? LABEL.map((l, i) => <Konektor key={i} x1={nodeX(l.bab)} y1={SUMBER_Y - LD / 2 - GAP} x2={nodeX(l.bab)} y2={UJUNG_PANAH} g={grow(f, l.at)} col={l.sumber.col} op={pudarPeta * redup(l.bab)} />) : null}
        </svg>
        {/* slot bab 06 (putus-putus) — tempat masker Scene 11 mendarat; peta utuh sejak frame pertama (tersingkap di balik lingkaran) */}
        {f < S12 + 52 ? <div style={{ position: 'absolute', left: nodeX(5) - ND / 2, top: NODE_Y - ND / 2, width: ND, height: ND, borderRadius: '50%', background: B.white, border: `3px dashed ${B.grayLite}` }} /> : null}
        {BAB.map((b, k) => {
          const p = posSimpul(k);
          const op = redup(k);
          // bab 06 diambil alih dari masker Scene 11 (tanpa pop); bab lain sudah ada di balik lingkaran
          const isi = k === 5 ? (f >= S12 + 50 ? 1 : 0) : 1;
          // Simon 9 Okt: "berkembang" TIDAK lagi lewat ikon membesar (dulu ×1,12) — value perusahaannya naik (pil di atas simpul)
          const s = 1;
          const balik = k === 5 ? balikIkon(f, [bisnis - 10, PINDAH.mulai + 20]) : { sx: 1, n: 0 };
          return (
            <React.Fragment key={b.no}>
              <div style={{ position: 'absolute', left: 0, top: 0, opacity: op, transform: `${geser(p.x - nodeX(k), p.y - NODE_Y)}` }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${nodeX(k)}px ${NODE_Y}px`, transform: `scale(${s}) scaleX(${balik.sx})` }}>
                  <SimpulBab x={nodeX(k)} y={NODE_Y} d={p.d} col={b.warna} ikon={balik.n === 1 ? 'perusahaan' : b.ikon} isi={isi} />
                </div>
              </div>
              {k === 5 && balik.n === 1 ? (
                <PilNominal x={p.x} y={p.y - p.d / 2 - 30} teks={rpMiliar(100 + 150 * R(f, berkembang - 30, berkembang + 30, 0, 1, io), 0)} arah={R(f, berkembang - 30, berkembang, 0, 1, io)}
                  p={popIn(f, bisnis + 10) * (1 - pindah) * op} size={26} lebarMin={140} />) : null}
              {pudarPeta > 0.001 ? (
                <div style={{ position: 'absolute', left: nodeX(k) - 135, width: 270, top: NODE_Y + ND / 2 + 14, textAlign: 'center', lineHeight: 1.15, opacity: pudarPeta * op }}>
                  <WordText halus f={f} at={k === 5 ? S12 + 60 : S12 - 30} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>{b.nama}</WordText>{/* Simon 8 Okt: nama bab ≥ 30 px (dulu 26) */}
                </div>) : null}
            </React.Fragment>);
        })}

        {pudarPeta > 0.001 ? (
          <AbsoluteFill style={{ opacity: pudarPeta }}>
            {/* "tidak ada satu instrumen yang paling unggul di semua hal": piala singgah di tiap bab, lalu chip dicoret (Simon 8 Okt: tanpa menggeleng) */}
            <ChipCoret f={f} at={M('kelihatan', kelihatan)} coretAt={hal + 15} />
            <Piala f={f} />
            {LABEL.map((l, i) => <Label key={i} x={nodeX(l.bab)} y={SUMBER_Y} teks={l.sumber.teks} ikon={l.sumber.ikon} col={l.sumber.col} p={popIn(f, l.at)} op={redup(l.bab)} />)}
            {/* return mengalir dari sumbernya ke bab (uang HIJAU aset Simon — Simon 8 Okt: satu keluarga warna uang) sesudah labelnya pop;
                label kini di kata sumbernya (akhir klausa); satu lembar 60f */}
            {LABEL.map((l, i) => <AliranUang key={`u${i}`} f={f} x={nodeX(l.bab)} mulai={l.at + 10} selesai={Math.max((KLAUSA[KLAUSA.indexOf(l.klausa) + 1]?.mulai ?? KLAUSA_AKHIR) - 10, l.at + 60)} rapat={l.bab === 5} op={redup(l.bab)} />)}
          </AbsoluteFill>) : null}

        {/* ═════ kartu lensa ═════ */}
        {LENSA.map((l, k) => {
          // Simon 8 Okt: kartu POP easeOutBack berporos di tengahnya, tepat di katanya (dulu pudar + geser 48 + skala 0,94; Return berdenyut)
          const c = popIn(f, l.at);
          // slot "?" pop di "memilih" (stagger 12f, sama dengan slot kantong S13); memudar selama kartunya tumbuh menutupinya
          const sSlot = popIn(f, SLOT_AT + 12 * k), opSlot = 1 - R(f, l.at - 30, l.at + 6, 0, 1, io);
          return (
            <React.Fragment key={l.teks}>
              {sSlot > 0.001 && opSlot > 0.001 ? <div style={{ position: 'absolute', left: cx(k), top: CY, width: CW, height: CH, borderRadius: 32, border: `2.5px dashed ${B.grayLite}`, opacity: opSlot, transform: `scale(${sSlot})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 64, fontWeight: 800, color: B.grayLite }}>?</div> : null}
              {c > 0.001 ? (
                <div style={{ position: 'absolute', left: cx(k), top: CY, width: CW, height: CH, transform: `scale(${c})`, ...card(l.col) }}>
                  <div style={{ position: 'absolute', left: CW / 2 - 66, top: 80, width: 132, height: 132, borderRadius: '50%', background: l.col, display: 'grid', placeItems: 'center', transform: `scale(${popIn(f, l.at + 10)})` }}>
                    <Icon name={l.ikon} size={80} color={B.white} />
                  </div>
                  <div style={{ position: 'absolute', left: 20, right: 20, top: 262, textAlign: 'center', lineHeight: 1.15 }}>
                    <WordText halus f={f} at={l.at + 15} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{l.teks}</WordText>
                  </div>
                </div>) : null}
            </React.Fragment>);
        })}
        <Kaca f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.blue, opacity: R(f, BATAS.s13 + 22, BATAS.s13 + 48, 0, 1, io) }} /> : null}
    {/* ikon memudar masuk di atas isian → saat ditukar ke simpul instrumen Scene 13 (BATAS.s13+52) gambarnya sudah identik */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s13 + 34, BATAS.s13 + 48, 0, 1, io) }}><Icon name="instrumenInvestasi" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);

  /** judul TEXT tiga bagian, muncul bertahap: "Beda aset," → "beda sumber return," → "beda kebutuhan" (disorot) */
  function JudulBertahap({ f: ff }: { f: number }) {
    if (MODE_UKUR) return null;
    const st: React.CSSProperties = { fontFamily: F, fontSize: 44, fontWeight: 800, letterSpacing: '-.02em', color: B.night };
    const h = R(ff, digunakan - 10, digunakan + 50, 0, 1, io);
    const bagian = [
      { t: 'Beda aset,', at: bandingkan + 10 },
      { t: 'beda sumber return,', at: KLAUSA[0].mulai + 30 },
    ];
    const p3 = R(ff, volatilitas - 30, volatilitas + 30, 0, 1, io);
    const gs = geserSorot('beda kebutuhan', 44);
    if (ff < bandingkan - 20) return null;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center' }}>
        {/* antar-bagian = SPASI BIASA (dulu marginRight 14 → celah 18–20 px, dua kali spasi kata); geser = spasi seragam sebelum kotak tampil */}
        {bagian.map((b) => (
          <span key={b.t} style={{ ...st, display: 'inline-block', whiteSpace: 'pre', transform: `translateX(${gs * (1 - h)}px)` }}>
            <WordText halus f={ff} at={b.at} style={st}>{b.t}</WordText>{' '}
          </span>))}
        <span style={{ ...st, display: 'inline-block', opacity: p3, transform: `translateY(${(1 - p3) * 20}px)` }}>
          <Sorot w="beda kebutuhan" h={h} size={44} />
        </span>
      </div>);
  }
};

/** balik sumbu-Y 20f inOut cubic; ikon ke-n ditukar saat tegak lurus */
const balikIkon = (f: number, ganti: number[]) => {
  const n = ganti.filter((t) => f >= t).length % 2;
  const u = ganti.reduce((m, t) => Math.max(m, R(f, t - 10, t + 10, 0, 1, io) * (1 - R(f, t + 10, t + 11, 0, 1))), 0);
  return { sx: Math.max(0.02, Math.abs(Math.cos(Math.PI * u))), n };
};

/** piala "paling unggul": singgah di atas tiap bab (lompat melengkung 14f = perpindahannya), lalu pergi saat chip dicoret.
 *  Simon 8 Okt: gelengan 10f di tiap bab DIHAPUS (animasi yang tidak perlu); perjalanan antar-bab dipertahankan = "tidak ada SATU instrumen". */
const Piala: React.FC<{ f: number }> = ({ f }) => {
  const s = popIn(f, tidak - 10) * popOut(f, hal + 15);
  if (s <= 0.001) return null;
  const tiba = (k: number) => tidak + 10 + 24 * k;
  // Simon 9 Okt "animasi patah patah": lompat melengkung 14f antar-bab (5× berturut) → SATU luncuran mulus menyusuri keenam bab (inOut cubic)
  const u = R(f, tiba(1) - 14, tiba(5), 0, 5, io);
  const k0 = Math.min(4, Math.floor(u)), r = u - k0;
  const x = lerp(nodeX(k0), nodeX(k0 + 1), r);
  const lompat = 0;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: PIALA.d, height: PIALA.d, borderRadius: '50%', background: B.orange, display: 'grid', placeItems: 'center', boxShadow: `0 10px 22px -10px ${B.orange}aa`,
      transform: `${geser(x - PIALA.d / 2, PIALA.y - PIALA.d / 2 + lompat)} scale(${s})` }}>
      <Icon name="trofi" size={44} color={B.white} />
    </div>);
};

/** uang mengalir dari ikon sumber naik ke bab (sepanjang panah, hilang sebelum ujungnya) — satu lembar tiap 24f, tempuh 40f.
 *  Simon 8 Okt: lembar HIJAU (LembarUang, dulu turkis lembar-N.svg), tanpa putaran jungkir — kemiringan tetap bawaan aset; `op` = redup babnya.
 *  `rapat` (Saham: "bisnis di belakangnya TERUS BERKEMBANG"): dua lajur berselang (±12 px), makin rapat (16 → 8f) dan lembarnya makin
 *  besar (64 → 80 px) */
const AliranUang: React.FC<{ f: number; x: number; mulai: number; selesai: number; rapat?: boolean; op?: number }> = ({ f, x, mulai, selesai, rapat = false, op: opBab = 1 }) => {
  if (f < mulai || f > mulai + 80) return null;
  const lembar: { t0: number; w: number }[] = [];
  // Simon 9 Okt: aliran beruntun (tiap 24f / makin rapat 16→8f) = gerak berdetik terus-menerus → SATU lembar per sumber, 60f.
  // "terus berkembang" kini digambarkan value perusahaan (pil nominal di atas simpul Saham), bukan aliran yang makin rapat.
  void selesai; void rapat;
  lembar.push({ t0: mulai, w: 72 });
  return (
    <>
      {lembar.map(({ t0, w: W }, i) => {
        const t = R(f, t0, t0 + 60, 0, 1);
        if (t <= 0 || t >= 1) return null;
        const H = (W * 596) / 648; // rasio LembarUang
        // berangkat 8 px di atas lingkaran sumber (tidak menimpanya), tiba di bawah kepala panah
        const y = lerp(SUMBER_Y - LD / 2 - 8 - H / 2, UJUNG_PANAH + 22, io(t));
        const op = Math.min(R(t, 0, 0.15, 0, 1, io), 1 - R(t, 0.8, 1, 0, 1, io));
        return <LembarUang key={i} x={x} y={y} w={W} op={op * opBab} />;
      })}
    </>);
};

/** kaca pembesar: menyapu baris instrumen → singgah di kartu Return ("cuma melihat return") → menyapu tiga slot "?" */
const Kaca: React.FC<{ f: number }> = ({ f }) => {
  const s = popIn(f, KACA.muncul) * popOut(f, KACA.slot[1] + 15);
  if (s <= 0.001) return null;
  const D = 86;
  const diMini = (u: number) => ({ x: lerp(MINI.x(0), MINI.x(5), u / 5) + 42, y: MINI.y + 38 }); // ikut ikon mini 80 px (dulu +34/+30 untuk 64)
  const diReturn = { x: cx(0) + CW / 2 + 52, y: CY + 146 + 52 };
  const diSlot = (u: number) => ({ x: cx(1) + CW / 2 + u * (CW + CG), y: CY + CH / 2 });
  let p = diMini(R(f, KACA.sapu[0], KACA.sapu[1], 0, 5, io));
  const keR = R(f, KACA.keReturn[0], KACA.keReturn[1], 0, 1, io);
  if (keR > 0) p = { x: lerp(p.x, diReturn.x, keR), y: lerp(p.y, diReturn.y, keR) };
  const keS = R(f, KACA.slot[0], KACA.slot[0] + 30, 0, 1, io);
  if (keS > 0) {
    const q = diSlot(R(f, KACA.slot[0] + 30, KACA.slot[1] - 10, 0, 2, io));
    p = { x: lerp(p.x, q.x, keS), y: lerp(p.y, q.y, keS) };
  }
  return <KacaPembesar x={p.x} y={p.y} d={D} s={s} geserCss={geser} />;
};

/** label sumber return di bawah simpul bab: lingkaran warna sumber + teks (2 baris, lebar 230 — dulu 260: "Pertumbuhan bisnis" satu baris
 *  menjorok ke kanan 64 px melewati bab 06 → kamera bergeser 32 px saat klausa terakhir).
 *  Simon 8 Okt: lingkaran 80 (dulu 64), teks 30 (dulu 26), warna beda per sumber, pop berporos di TENGAH label (dulu 'center top') */
const Label: React.FC<{ x: number; y: number; teks: string; ikon: KunciIkon; col: string; p: number; op: number }> = ({ x, y, teks, ikon, col, p, op }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 115, width: 230, top: y - LD / 2, transform: `scale(${p})`, transformOrigin: '50% 50%', opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <div style={{ width: LD, height: LD, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', boxShadow: `0 10px 22px -10px ${col}aa` }}><Icon name={ikon} size={50} color={B.white} /></div>
    <div style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, textAlign: 'center', lineHeight: 1.15 }}>{teks}</div>
  </div>);

/** chip "Paling unggul di semua hal" — dicoret. Simon 8 Okt: dibangun ulang = ChipCoret Scene 09 (lingkaran ikon + teks; bingkai, lingkaran
 *  ikon & garis coret berubah MERAH, garis 5 px, TANPA diredupkan — dulu abu, garis hitam 4 px, opasitas turun 35 %). Teks tetap 30 px. */
const ChipCoret: React.FC<{ f: number; at: number; coretAt: number }> = ({ f, at, coretAt }) => {
  const p = popIn(f, at);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  const col = mixHex(B.gray, CORET, coret);
  return (
    <div style={{ position: 'absolute', left: 960, top: CHIP_Y, transform: `translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 28px 8px 8px', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1 }}>
      {/* trofi = "paling unggul" */}
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name="trofi" size={32} color={B.white} /></div>
      Paling unggul di semua hal
      <div style={{ position: 'absolute', left: 14, top: '50%', height: 5, marginTop: -2.5, width: `calc(${coret} * (100% - 28px))`, background: CORET, borderRadius: 3 }} />
    </div>);
};

export const S12_BEAT = { bandingkan, kelihatan, tidak, hal, ada1, bunga, ada2, perubahan, ada3, pendapatan, dan4, tumbuh, bisnis, berkembang, jadi, memilih, kita5, melihat, ret, kita6, volatilitas, likuiditas, dan7, kapan, digunakan };
