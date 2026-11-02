import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, CORET, F, R, WARNA, io, lerp, mixHex, rgba } from '../theme';
import { cin, Icon, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpPenuh } from '../parts/nominal';
import type { KunciIkon } from '../ikon';
import { S05_DOMPET_AKHIR } from '../s05/Scene05';

/**
 * SCENE 06 — IDE VISUAL (13 Okt). Bab "01 — Uang Aktif". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  1–3 BULAN BIAYA HIDUP ↓ Kehilangan Pekerjaan · Perbaikan Motor · Biaya Medis ↓ DANA DARURAT ✓ ↓ INVESTASI LAIN
 *   TEXT    "Dana darurat ≈ 3–6 bulan biaya hidup" / "Siapkan dana darurat sebelum investasi lain"
 *   ⚠ TEXT menulis 3–6 bulan, padahal VO & kolom VISUAL menyebut 1–3 bulan → layar memakai 1–3 (sama dengan suara), DILAPORKAN ke Simon.
 * Empat ketukan (27,5 dtk):
 *   A  "Dana darurat juga termasuk dalam uang aktif, dan idealnya dipersiapkan sebelum investasi lainnya."
 *        dompet Uang aktif (Scene 05) membesar jadi WADAH biru muda · Dana darurat (pelampung) muncul DI DALAMNYA ("termasuk dalam")
 *        · wadah bergeser kiri, panah → Investasi lain ("sebelum")
 *   B  "Salah satu acuan yang umum adalah sekitar 1 sampai 3 bulan biaya hidup."
 *        judul TEXT · tiga slot bulan di kiri ("sekitar") → terisi di "1" dan "3" (Rp5 jt per bulan), saldo dana darurat Rp5 jt → Rp15 jt
 *   C  "Jadi kalau tiba-tiba kehilangan pekerjaan, motor rusak, atau muncul biaya medis, kita nggak perlu buru-buru menjual investasi lain."
 *        bulan masuk ke dana darurat · tiga kejadian muncul di katanya, uang mengalir dari dana darurat (saldo turun berjalan)
 *        · investasi lain tetap utuh (Rp20 jt), chip "Jual" dicoret MERAH
 *   D  "Siapkan dana darurat dulu, baru pikirkan investasi berikutnya."
 *        kejadian keluar, saldo diisi lagi, centang di dana darurat ("dulu") · panah menyala ("baru") · investasi lain disorot · sub-judul TEXT
 */

const [darurat, dalam, uang, idealnya, sebelum, investasi, lainnya, acuan, umum, sekitar, satu, tiga, jadi, tibatiba, kehilangan, motor, muncul,
  nggak, buru, menjual, lain, siapkan, dulu, baru, investasi3, berikutnya] = urut([
  'darurat', 'dalam', 'uang', 'idealnya', 'sebelum', 'investasi', 'lainnya', 'acuan', 'umum', 'sekitar', '1', '3', 'jadi', 'tiba-tiba', 'kehilangan',
  'motor', 'muncul', 'nggak', 'buru-buru', 'menjual', 'lain', 'siapkan', 'dulu', 'baru', 'investasi', 'berikutnya'], BATAS.s6);

const T = {
  wadah: BATAS.s6 + 30, // dompet → wadah (bersamaan dengan Scene 05 keluar, S05_KELUAR)
  dd: darurat + 40, ddLabel: darurat + 70, termasuk: dalam, header: uang, // "termasuk DALAM": wadah berdenyut (mengisi jeda sebelum kepala "Uang aktif")
  geserA: idealnya, panah: sebelum, inv: investasi + 6, invLabel: lainnya,
  judul: acuan - 20, geserB: umum, // judul mulai di awal "Salah satu ACUAN" (tanpa jendela diam sesudah label investasi)
  slot: sekitar, bulan: [satu + 10, tiga + 10, tiga + 30], saldo1: satu, saldo3: tiga, sorot: tiga,
  tuang: jadi, waspada: tibatiba, kejadian: [kehilangan + 10, motor + 10, muncul + 10],
  nilaiInv: nggak, jual: buru, coret: menjual + 20, denyutInv: lain,
  siapkan, geserD: siapkan + 10, isiUlang: siapkan + 20, sub: siapkan + 10, centang: dulu + 10, panahNyala: baru, subSorot: baru,
  sorotInv: investasi3, denyutAkhir: berikutnya + 20,
};

/* ── tata letak: isi 340–816 berpusat ±575 (judul 64–175, subtitle mulai 994) ── */
const AWAL = S05_DOMPET_AKHIR; // dompet Uang aktif Scene 05 (960, 285, Ø180)
const CY = 520;
const WADAH = { d: 360 };
/** posisi mendatar per susunan: awal (wadah sendirian) · A/D (wadah + investasi) · B/C (kolom kiri + wadah + investasi) — tiap susunan berpusat 960 */
const X = { awal: 960, wadahA: 760, invA: 1240, wadahB: 1013, invB: 1493, kolom: 523 };
const DD = { dy: 5, d: 150 }; // dana darurat di dalam wadah (sedikit di bawah pusat, kepala wadah di atas)
const INV = { d: 170 };
const KOLOM_Y = [380, 520, 660];
const SALDO_Y = 756, NILAI_Y = 708, JUAL_Y = 788;
const BIAYA_HIDUP = 5_000_000; // asumsi contoh: biaya hidup Rp5 jt/bulan (gaji contoh Scene 01 Rp6,5 jt)
const NILAI_INV = 20_000_000;
/** lebar seragam chip kejadian = chip terlebar "Kehilangan pekerjaan" (terukur di render) */
const LEBAR_KEJADIAN = 412; // padding kanan "Kehilangan pekerjaan" = padding kiri (27 px)
const KEJADIAN: { nama: string; ikon: KunciIkon; warna: string; biaya: number }[] = [
  { nama: 'Kehilangan pekerjaan', ikon: 'kehilanganKerja', warna: WARNA.ungu, biaya: 5_000_000 },
  { nama: 'Perbaikan motor', ikon: 'perbaikanMotor', warna: WARNA.langit, biaya: 1_500_000 },
  { nama: 'Biaya medis', ikon: 'biayaMedis', warna: WARNA.turkisMuda, biaya: 3_000_000 },
];
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));
const terbang = (f: number, at: number) => R(f, at - 30, at + 30, 0, 1, io);

/** KELUAR Scene 06 = milik Scene 07 ("Yang kedua …"): isi keluar 60f mulai di batas (pop berjenjang, judul naik-pudar);
 *  WADAH "Uang aktif" diambil alih Scene 07 (mengecil kembali jadi dompet Uang Aktif di deret tiga dompet) — S06_WADAH_AKHIR */
export const S06_KELUAR = BATAS.s7 + 30;
export const S06_WADAH_AKHIR = { x: X.wadahA, y: CY, d: WADAH.d, warna: AWAL.warna };
export const Scene06: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s6 || f >= S06_KELUAR + 60) return null;
  const kel = cin(f, S06_KELUAR);
  const pk = (i: number) => popOut(f, S06_KELUAR - 12 + 8 * i); // pop keluar berjenjang
  const milikS6 = f < BATAS.s7;
  // susunan mendatar: awal → A (geser kiri) → B/C (kolom kiri masuk) → D (kembali ke A)
  const gA = cin(f, T.geserA), gB = cin(f, T.geserB), gD = cin(f, T.geserD);
  const cxSus = X.awal + (X.wadahA - X.awal) * gA + (X.wadahB - X.wadahA) * gB + (X.wadahA - X.wadahB) * gD;
  const invX = X.invA + (X.invB - X.invA) * gB + (X.invA - X.invB) * gD;
  // dompet Scene 05 → wadah
  const w = cin(f, T.wadah);
  const cx = lerp(AWAL.x, cxSus, w), cy = lerp(AWAL.y, CY, w), d = lerp(AWAL.d, WADAH.d, w) * (1 + denyut(f, T.termasuk, 0.04));
  const ddX = cx, ddY = cy + DD.dy * w;
  // saldo dana darurat: +1 bulan di "1", +2 bulan di "3", berkurang saat uang mengalir ke tiap kejadian, diisi lagi di "Siapkan"
  const keluarUang = KEJADIAN.reduce((s, k, i) => s + k.biaya * terbang(f, T.kejadian[i] + 40), 0);
  const saldoPenuh = BIAYA_HIDUP * (R(f, T.saldo1 - 10, T.saldo1 + 50, 0, 1, io) + 2 * R(f, T.saldo3, T.saldo3 + 60, 0, 1, io));
  const saldo = saldoPenuh - keluarUang * (1 - R(f, T.isiUlang - 30, T.isiUlang + 30, 0, 1, io));
  const kepala = R(f, T.wadah - 10, T.wadah + 30, 0, 1, io);
  const panahG = R(f, T.panah - 30, T.panah + 30, 0, 1, io);
  const nyala = cin(f, T.panahNyala);
  const kejadianKel = (i: number) => popOut(f, T.siapkan - 20 + 8 * i);
  return (
    <AbsoluteFill>
      {/* panah urutan: dana darurat (wadah) → investasi lain ("SEBELUM investasi lainnya"); menyala di "BARU pikirkan investasi" */}
      {panahG > 0.001 ? (() => {
        const x0 = cx + d / 2 + 16, x1 = invX - INV.d / 2 - 18, xe = lerp(x0, x1, panahG);
        const col = mixHex(B.grayLite, B.turq, nyala), tebal = 4 + 2 * nyala;
        return (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - kel }}>
            <line x1={x0} y1={CY} x2={xe - 6} y2={CY} stroke={col} strokeWidth={tebal} strokeLinecap="round" />
            {panahG > 0.85 ? <path d={`M ${xe} ${CY} l -20 -13 l 0 26 z`} fill={col} opacity={R(panahG, 0.85, 1, 0, 1)} /> : null}
          </svg>);
      })() : null}

      {/* WADAH "Uang aktif" (dompet biru Scene 05 → lingkaran biru muda berbingkai) — "Dana darurat juga TERMASUK DALAM uang aktif" */}
      {milikS6 ? <WadahUangAktif x={cx} y={cy} d={d} w={w} kepala={kepala} teks={f >= T.header - 30 ? (
        <WordText halus f={f} at={T.header + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: AWAL.warna }}>Uang aktif</WordText>) : null} /> : null}

      {/* bulan biaya hidup (B): slot kosong di "sekitar" → terisi di "1" / "3" → masuk ke dana darurat di "Jadi" */}
      {[0, 1, 2].map((i) => {
        const y = KOLOM_Y[i];
        const slot = popIn(f, T.slot + 15 * i) * popOut(f, T.bulan[i] - 6);
        const isi = popIn(f, T.bulan[i]);
        const t = terbang(f, T.tuang + 12 * i);
        if (t >= 0.999) return null;
        const x = lerp(X.kolom, ddX, t), yy = lerp(y, ddY, t);
        return (
          <React.Fragment key={`b${i}`}>
            {slot > 0.001 ? <Chip x={X.kolom} y={y} teks={`Bulan ${i + 1}`} ekor="Rp5 jt" ikon="kalender" warna={B.grayLite} p={slot} kosong /> : null}
            {isi > 0.001 ? <Chip x={x} y={yy} teks={`Bulan ${i + 1}`} ekor="Rp5 jt" ikon="kalender" warna={B.orange} p={isi * lerp(1, 0.3, t)} alfa={R(t, 0.75, 1, 1, 0)} /> : null}
          </React.Fragment>);
      })}

      {/* kejadian darurat (C) di kolom kiri, muncul di katanya; uang mengalir dari dana darurat */}
      {KEJADIAN.map((k, i) => {
        const p = popIn(f, T.kejadian[i]) * kejadianKel(i);
        const t = terbang(f, T.kejadian[i] + 40);
        const W = 92, H = W / (520 / 441);
        return (
          <React.Fragment key={k.nama}>
            {/* Simon 13 Okt: tiga kotak SAMA lebar, ikon + teks rata kiri */}
            {p > 0.001 ? <Chip x={X.kolom} y={KOLOM_Y[i]} teks={k.nama} ikon={k.ikon} warna={k.warna} p={p * (1 + denyut(f, T.kejadian[i] + 70, 0.05))} lebar={LEBAR_KEJADIAN} /> : null}
            {t > 0.001 && t < 0.999 ? (
              <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
                opacity: R(t, 0, 0.15, 0, 1) * R(t, 0.8, 1, 1, 0),
                transform: geser(lerp(ddX, X.kolom + 150, t) - W / 2, lerp(ddY, KOLOM_Y[i], t) - H / 2 - Math.sin(Math.PI * t) * 30) }} />) : null}
          </React.Fragment>);
      })}

      {/* DANA DARURAT (pelampung) di dalam wadah — sesudah batas S7 ikut mengecil BERSAMA wadah di Scene 07 (tidak keluar sendiri → wadah tak pernah kosong) */}
      {milikS6 ? <DanaDaruratBulat x={ddX} y={ddY} s={popIn(f, T.dd) * (1 + denyut(f, T.waspada, 0.08) + KEJADIAN.reduce((a, _, i) => a + denyut(f, T.kejadian[i] + 20, 0.05), 0)
        + denyut(f, T.isiUlang, 0.06))} centang={popIn(f, T.centang)} /> : null}
      {f >= T.ddLabel - 30 ? (
        <div style={{ position: 'absolute', left: ddX - 150, width: 300, top: ddY + DD.d / 2 + 14, textAlign: 'center', whiteSpace: 'nowrap', opacity: 1 - R(f, BATAS.s7, BATAS.s7 + 24, 0, 1, io) }}>
          <WordText halus f={f} at={T.ddLabel} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Dana darurat</WordText>
        </div>) : null}
      <PilNominal x={cx} y={SALDO_Y} teks={rpPenuh(Math.round(saldo / 50_000) * 50_000)} arah={0} p={popIn(f, T.saldo1 - 10) * pk(1)} size={30} lebarMin={250} />

      {/* INVESTASI LAIN: muncul di "investasi lainnya"; nilai tetap utuh (C); disorot di "investasi berikutnya" (D) */}
      {(() => {
        const p = popIn(f, T.inv) * pk(2) * (1 + denyut(f, T.denyutInv) + denyut(f, T.sorotInv, 0.06) + denyut(f, T.denyutAkhir, 0.05));
        if (p <= 0.001) return null;
        const ring = cin(f, T.sorotInv) * (1 - kel);
        return (
          <>
            {ring > 0.001 ? <div style={{ position: 'absolute', left: invX - INV.d / 2 - 16, top: CY - INV.d / 2 - 16, width: INV.d + 32, height: INV.d + 32, borderRadius: '50%',
              border: `3px solid ${B.turq}`, opacity: ring, boxShadow: `0 0 34px 4px ${B.turq}55` }} /> : null}
            <div style={{ position: 'absolute', left: invX - INV.d / 2, top: CY - INV.d / 2, width: INV.d, height: INV.d, borderRadius: '50%', background: B.turq, display: 'grid',
              placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 16px 34px -12px ${B.turq}aa` }}>
              <Icon name="investasiLain" size={INV.d * 0.5} color={B.white} />
            </div>
          </>);
      })()}
      {f >= T.invLabel - 30 ? (
        <div style={{ position: 'absolute', left: invX - 160, width: 320, top: CY + INV.d / 2 + 16, textAlign: 'center', whiteSpace: 'nowrap', opacity: 1 - kel }}>
          <WordText halus f={f} at={T.invLabel} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Investasi lain</WordText>
        </div>) : null}
      <PilNominal x={invX} y={NILAI_Y} teks={rpPenuh(NILAI_INV)} arah={0} p={popIn(f, T.nilaiInv) * pk(3)} size={26} />
      {/* "nggak perlu buru-buru MENJUAL investasi lain": chip Jual dicoret merah (pola tag coret Scene 05) */}
      <Chip x={invX} y={JUAL_Y} teks="Jual" ikon="jual" warna={mixHex(B.orange, CORET, R(f, T.coret - 30, T.coret + 30, 0, 1, io))}
        p={popIn(f, T.jual) * popOut(f, T.siapkan - 4)} coret={R(f, T.coret - 30, T.coret + 30, 0, 1, io)} />

      <Judul f={f} kata={['Dana', 'darurat', '≈', '1–3 bulan', 'biaya', 'hidup']} sorotIdx={3} at={T.judul} sorotAt={T.sorot} keluar={S06_KELUAR} />
      <Judul f={f} kata={['Siapkan', 'dana', 'darurat', 'sebelum', 'investasi', 'lain']} sorotIdx={3} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S06_KELUAR} />
    </AbsoluteFill>);
};

/** pelampung Dana darurat (Ø150, oranye) + centang "dulu" — `s` = skala (pop/denyut/ikut wadah), `alfa` = kepekatan */
export const DanaDaruratBulat: React.FC<{ x: number; y: number; s: number; centang: number; alfa?: number }> = ({ x, y, s, centang, alfa = 1 }) => {
  if (s <= 0.001 || alfa <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(x, y)} scale(${s})`, opacity: alfa }}>
      <div style={{ position: 'absolute', left: -DD.d / 2, top: -DD.d / 2, width: DD.d, height: DD.d, borderRadius: '50%', background: B.orange, display: 'grid', placeItems: 'center',
        boxShadow: `0 14px 30px -10px ${B.orange}cc` }}>
        <Icon name="danaDarurat" size={DD.d * 0.56} color={B.white} />
      </div>
      {centang > 0.001 ? (
        <div style={{ position: 'absolute', left: DD.d * 0.36 - 34, top: -DD.d * 0.36 - 34, width: 68, height: 68, borderRadius: '50%', background: B.turq, border: `4px solid ${B.white}`,
          display: 'grid', placeItems: 'center', transform: `scale(${centang / Math.max(0.001, s)})`, boxShadow: `0 10px 24px -8px ${B.turq}cc` }}>
          <Icon name="tersedia" size={38} color={B.white} />
        </div>) : null}
    </div>);
};
/** posisi pelampung di dalam wadah (sedikit di bawah pusat) — dipakai Scene 07 saat wadah mengecil */
export const S06_DD_DY = DD.dy;

/**
 * WADAH "Uang aktif": `w` 0 = dompet biru penuh (rupa dompet Scene 03/05: lingkaran warna + ikon dompet putih 0,52 d) · 1 = lingkaran biru muda berbingkai.
 * `kepala` 0 = ikon di tengah · 1 = ikon kecil di kepala wadah (kiri teks "Uang aktif"). Dipakai Scene 06 (masuk) dan Scene 07 (kembali jadi dompet).
 */
export const WadahUangAktif: React.FC<{ x: number; y: number; d: number; w: number; kepala: number; teks: React.ReactNode; warna?: string; ikonAlfa?: number }> =
  ({ x, y, d, w, kepala, teks, warna = AWAL.warna, ikonAlfa = 1 }) => {
    const s = lerp(d * 0.52 / lerp(1, WADAH.d / AWAL.d, w) , 40, kepala); // ukuran ikon: 0,52 × Ø dompet → 40 px
    const hx = lerp(0, -82, kepala), hy = lerp(0, -125, kepala);
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: geser(x, y) }}>
        <div style={{ position: 'absolute', left: -d / 2, top: -d / 2, width: d, height: d, borderRadius: '50%', background: mixHex(warna, B.blueWash, w),
          border: `${3 * w}px solid ${rgba(warna, w)}`, boxSizing: 'border-box',
          boxShadow: w < 0.5 ? `0 18px 40px -12px ${warna}aa` : `0 18px 40px -18px ${rgba(warna, 0.35)}` }} />
        {ikonAlfa > 0.001 ? <div style={{ position: 'absolute', left: hx - s / 2, top: hy - s / 2, width: s, height: s, opacity: ikonAlfa }}><Icon name="dompet" size={s} color={mixHex(B.white, warna, kepala)} /></div> : null}
        {teks ? <div style={{ position: 'absolute', left: -58, top: -125, transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>{teks}</div> : null}
      </div>);
  };

/** chip (gaya rumah Scene 05: putih, tepi warna 2,5 px, ikon + teks Bold 30) dipusatkan di (x, y). `ekor` = teks abu sesudahnya,
 *  `kosong` = slot bertepi putus-putus (isi abu), `coret` = garis coret MERAH tergambar kiri → kanan */
const Chip: React.FC<{ x: number; y: number; teks: string; ikon: KunciIkon; warna: string; p: number; ekor?: string; kosong?: boolean; coret?: number; alfa?: number;
  lebar?: number }> =
  ({ x, y, teks, ikon, warna, p, ekor, kosong = false, coret = 0, alfa = 1, lebar }) =>
    p <= 0.001 ? null : (
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, transformOrigin: 'center', opacity: alfa,
        display: 'flex', alignItems: 'center', justifyContent: lebar ? 'flex-start' : 'center', width: lebar, boxSizing: lebar ? 'border-box' : undefined,
        gap: 10, background: kosong ? rgba(B.white, 0.6) : B.white, border: `2.5px ${kosong ? 'dashed' : 'solid'} ${warna}`, borderRadius: 999,
        padding: '11px 27px', fontFamily: F, fontSize: 30, fontWeight: 700, color: kosong ? B.grayLite : coret > 0.5 ? CORET : B.night, whiteSpace: 'nowrap', lineHeight: 1,
        boxShadow: kosong ? 'none' : `0 10px 24px -14px ${warna}aa` }}>
        <Icon name={ikon} size={31.5} color={kosong ? B.grayLite : warna} />
        {teks}
        {ekor ? <span style={{ color: kosong ? B.grayLite : B.gray, fontWeight: 700 }}>{ekor}</span> : null}
        {coret > 0.001 ? <div style={{ position: 'absolute', left: 14, top: '50%', height: 4, width: `calc(${coret} * (100% - 28px))`, background: CORET, borderRadius: 2, transform: 'translateY(-50%)' }} /> : null}
      </div>);

export const S06_T = T;
