import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, WARNA, io, lerp, rgba } from '../theme';
import { cin, Icon, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { FotoBulat, MaskerKeluar, durMasker } from '../parts/kaca';
import { S10_MASUK } from '../s10/Scene10';
import { PilNominal, rpPenuh } from '../parts/nominal';
import type { KunciIkon } from '../ikon';
import { S08_DOMPET_AKHIR, S08_SALDO_AKHIR } from '../s08/Scene08';

/**
 * SCENE 09 — IDE VISUAL (13 Okt). Bab "02 — Uang Stabil". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  UANG STABIL ↓ Deposito · Reksa Dana Pendapatan Tetap · Obligasi Pemerintah ↓ MATCH THE TIME
 *   TEXT    "Uang stabil" / "sesuaikan dengan [waktu] penggunaannya"
 * Empat ketukan (24,6 dtk) — pola cabang Scene 05 (dompet di atas → tempat di bawah):
 *   A  "Karena itu, untuk uang stabil kita bisa mempertimbangkan"
 *        isi Scene 08 keluar · dompet Uang Stabil naik ke atas · judul TEXT · tiga panah + slot "?" di "mempertimbangkan"
 *   B  "deposito, reksa dana pendapatan tetap, atau obligasi pemerintah dengan tenor yang sesuai kebutuhan."
 *        slot → Deposito · Reksa dana pendapatan tetap · Obligasi pemerintah di katanya (ikon instrumen Video 02) · pil tenor 1 / 3 tahun
 *        (= tujuan Scene 07: biaya sekolah 1 tahun, DP rumah 3 tahun) di "tenor", berdenyut di "kebutuhan"
 *   C  "Kalau memilih reksa dana pendapatan tetap, ingat bahwa nilainya tetap bisa naik dan turun."
 *        RDPT disorot, dua lainnya meredup · grafik kecil: naik (hijau) di "naik", turun (merah) di "turun"; NAB berjalan Rp1.000 → Rp1.030 ▲ → Rp970 ▼
 *   D  "Intinya: waktu investasinya harus sesuai dengan kapan uang itu akan dipakai."   (MATCH THE TIME)
 *        tempat keluar · sub-judul TEXT · batang "Waktu investasi" tumbuh ke 3 tahun · batang "Waktu dipakai" tumbuh ke 3 tahun · ujung keduanya
 *        segaris → garis cocok + centang di "dipakai"
 */

const [uang, stabil, kita, mempertimbangkan, deposito, reksa, pendapatan, tetap, obligasi, tenor, kebutuhan, kalau, memilih, reksa2, tetap2, nilainya, naik,
  turun, intinya, waktu, harus, kapan, dipakai] = urut([
  'uang', 'stabil', 'kita', 'mempertimbangkan', 'deposito', 'reksa', 'pendapatan', 'tetap', 'obligasi', 'tenor', 'kebutuhan', 'kalau', 'memilih', 'reksa',
  'tetap', 'nilainya', 'naik', 'turun', 'intinya', 'waktu', 'harus', 'kapan', 'dipakai'], BATAS.s9);

const T = {
  dompet: uang + 10, saldoKeluar: BATAS.s9 + 40, judul: stabil,
  // panah mulai di "KITA bisa mempertimbangkan" (tanpa jendela diam sesudah judul), slot "?" di "mempertimbangkan"
  panah: [kita, kita + 20, kita + 40], slot: [mempertimbangkan, mempertimbangkan + 20, mempertimbangkan + 40],
  isi: [deposito, reksa, obligasi], labelIsi: [deposito + 8, pendapatan, obligasi + 8], denyutRdptB: tetap, tenor: [tenor, tenor + 18], denyutTenor: kebutuhan, tenorKeluar: kalau,
  sorotRdpt: memilih, redup: memilih, denyutRdptC: [reksa2, tetap2], grafikMuncul: tetap2 + 10, nab: nilainya, naik, turun,
  keluar: intinya, sub: intinya, subSorot: waktu, batang1: [waktu, harus], batang2: [kapan, dipakai - 10], cocok: dipakai + 10,
};

/* ── tata letak ── */
const AWAL = S08_DOMPET_AKHIR; // dompet Uang Stabil Scene 08 (300, 680, Ø180)
const DOMPET = { x: 960, y: 285, d: 170 };
const NODE = { y: 570, d: 170, x: [520, 960, 1400] };
const LABEL_TOP = NODE.y + NODE.d / 2 + 18, TENOR_Y = 800;
const TEMPAT: { nama: string; ikon: KunciIkon; warna: string; tenor?: string }[] = [
  { nama: 'Deposito', ikon: 'deposito', warna: WARNA.ungu, tenor: 'Tenor 1 tahun' },
  { nama: 'Reksa dana pendapatan tetap', ikon: 'rdPendapatanTetap', warna: WARNA.langit },
  { nama: 'Obligasi pemerintah', ikon: 'obligasi', warna: B.orange, tenor: 'Tenor 3 tahun' },
];
/** C: grafik kecil di bawah label RDPT (naik lalu turun) + NAB berjalan */
const GRAFIK = { x0: 830, x1: 1090, y: 840, naik: 45, turun: 70 };
const NAB_AWAL = 1000;
/** D: MATCH THE TIME — dua batang 3 tahun, ujung segaris (x 1430) */
const BATANG = { x0: 770, x1: 1470, y: [600, 720], tebal: 28, chipX: 740 }; // chip + batang berpusat ±960
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));

/** KELUAR Scene 09 = milik Scene 10 ("Coba bayangkan …", bab baru "Contoh yang salah"): masker lingkaran menyusut ke DP rumah Scene 10
 *  (S10_MASUK; brief Video 02 B: perpindahan scene = masker, bukan pudar biasa — rakitan 13 Okt) */
export const S09_KELUAR = S10_MASUK.mulai;
export const Scene09: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s9 || f >= S09_KELUAR + durMasker) return null;
  const m = cin(f, T.dompet);
  const dx = lerp(AWAL.x, DOMPET.x, m), dy = lerp(AWAL.y, DOMPET.y, m), dd = lerp(AWAL.d, DOMPET.d, m) * (1 + denyut(f, T.keluar + 20, 0.05));
  const keluar = (i: number) => popOut(f, T.keluar - 10 + 8 * i);
  const kel = cin(f, T.keluar);
  const redup = 0.5 * cin(f, T.redup);
  const naik = R(f, T.naik - 30, T.naik + 30, 0, 1, io), turun = R(f, T.turun - 20, T.turun + 40, 0, 1, io);
  const nab = NAB_AWAL * (1 + 0.03 * naik - 0.06 * turun);
  const b1 = R(f, T.batang1[0] - 20, T.batang1[1], 0, 1, io), b2 = R(f, T.batang2[0] - 20, T.batang2[1], 0, 1, io);
  return (
    <MaskerKeluar f={f} mulai={S09_KELUAR} ke={S10_MASUK} warna={S10_MASUK.warna}>
      {/* panah dompet → tiga tempat (pola Scene 05) */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - kel }}>
        {TEMPAT.map((t, k) => {
          const g = R(f, T.panah[k] - 30, T.panah[k] + 30, 0, 1, io);
          if (g <= 0.001) return null;
          const ex = NODE.x[k], ey = NODE.y;
          const ang = Math.atan2(ey - DOMPET.y, ex - DOMPET.x);
          const sx = DOMPET.x + Math.cos(ang) * (DOMPET.d / 2 + 14), sy = DOMPET.y + Math.sin(ang) * (DOMPET.d / 2 + 14);
          const tx = ex - Math.cos(ang) * (NODE.d / 2 + 16), ty = ey - Math.sin(ang) * (NODE.d / 2 + 16);
          const hx = lerp(sx, tx, g), hy = lerp(sy, ty, g);
          return (
            <g key={k} opacity={k === 1 ? 1 : 1 - redup}>
              <line x1={sx} y1={sy} x2={hx} y2={hy} stroke={t.warna} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />
              {g > 0.9 ? <path d={`M ${tx} ${ty} l ${-Math.cos(ang - 0.45) * 18} ${-Math.sin(ang - 0.45) * 18} l ${Math.cos(ang - 0.45) * 18 - Math.cos(ang + 0.45) * 18} ${Math.sin(ang - 0.45) * 18 - Math.sin(ang + 0.45) * 18} z`}
                fill={t.warna} opacity={R(g, 0.9, 1, 0, 1)} /> : null}
            </g>);
        })}
      </svg>

      {/* tiga tempat: slot "?" → Deposito · RDPT · Obligasi pemerintah */}
      {TEMPAT.map((t, k) => {
        const x = NODE.x[k];
        const slot = popIn(f, T.slot[k]) * popOut(f, T.isi[k] - 6);
        const isi = popIn(f, T.isi[k]) * keluar(k) * (1 + (k === 1 ? denyut(f, T.sorotRdpt, 0.06) + denyut(f, T.denyutRdptB, 0.06) + denyut(f, T.denyutRdptC[0], 0.05)
          + denyut(f, T.denyutRdptC[1], 0.05) : 0));
        const alfa = k === 1 ? 1 : 1 - redup;
        const ring = k === 1 ? cin(f, T.sorotRdpt) * (1 - kel) : 0;
        return (
          <React.Fragment key={t.nama}>
            {slot > 0.001 ? (
              <div style={{ position: 'absolute', left: x - NODE.d / 2, top: NODE.y - NODE.d / 2, width: NODE.d, height: NODE.d, borderRadius: '50%', border: `3px dashed ${B.grayLite}`,
                background: B.white, transform: `scale(${slot})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 72, fontWeight: 800, color: B.grayLite, lineHeight: 1 }}>?</div>) : null}
            {ring > 0.001 ? <div style={{ position: 'absolute', left: x - NODE.d / 2 - 16, top: NODE.y - NODE.d / 2 - 16, width: NODE.d + 32, height: NODE.d + 32, borderRadius: '50%',
              border: `3px solid ${t.warna}`, opacity: ring, boxShadow: `0 0 34px 4px ${t.warna}55` }} /> : null}
            {/* Deposito = foto brankas di lingkaran Neon Blue (brief Video 02 12 Okt "ini gambar brankasnya") */}
            {isi > 0.001 && k === 0 ? <div style={{ position: 'absolute', inset: 0, opacity: alfa < 1 ? alfa : undefined }}>
              <FotoBulat k="brankas" x={x} y={NODE.y} d={NODE.d} warna={B.blue} p={isi} /></div> : null}
            {isi > 0.001 && k > 0 ? (
              <div style={{ position: 'absolute', left: x - NODE.d / 2, top: NODE.y - NODE.d / 2, width: NODE.d, height: NODE.d, borderRadius: '50%', background: t.warna, display: 'grid',
                placeItems: 'center', transform: `scale(${isi})`, opacity: alfa, boxShadow: `0 16px 34px -12px ${t.warna}aa` }}>
                <Icon name={t.ikon} size={NODE.d * 0.54} color={B.white} />
              </div>) : null}
            {f >= T.isi[k] - 22 ? (
              <div style={{ position: 'absolute', left: x - (k === 1 ? 160 : 190), width: k === 1 ? 320 : 380, top: LABEL_TOP, textAlign: 'center', lineHeight: 1.15, opacity: alfa * (1 - kel) }}>
                <WordText halus rataBaris f={f} at={T.labelIsi[k]} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>
                  {t.nama}</WordText>
              </div>) : null}
            {/* pil tenor (deposito · obligasi) */}
            {t.tenor ? <PilNominal x={x} y={TENOR_Y} teks={t.tenor} arah={0} size={26}
              p={popIn(f, T.tenor[k === 0 ? 0 : 1]) * popOut(f, T.tenorKeluar + 8 * (k === 0 ? 0 : 1)) * (1 + denyut(f, T.denyutTenor + 12 * (k === 0 ? 0 : 1), 0.06))} /> : null}
          </React.Fragment>);
      })}

      {/* C: grafik kecil RDPT — nilai bisa naik (hijau) dan turun (merah) */}
      {(() => {
        const p = popIn(f, T.grafikMuncul) * keluar(3);
        if (p <= 0.001) return null;
        const xm = (GRAFIK.x0 + GRAFIK.x1) / 2;
        const yNaik = GRAFIK.y - GRAFIK.naik, yTurun = GRAFIK.y + GRAFIK.turun - GRAFIK.naik;
        return (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${p})`, transformOrigin: `${xm}px ${GRAFIK.y}px` }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <line x1={GRAFIK.x0 - 10} y1={GRAFIK.y} x2={GRAFIK.x1 + 10} y2={GRAFIK.y} stroke={B.grayLite} strokeWidth={2.5} strokeDasharray="6 9" />
              {naik > 0.001 ? <line x1={GRAFIK.x0} y1={GRAFIK.y} x2={lerp(GRAFIK.x0, xm, naik)} y2={lerp(GRAFIK.y, yNaik, naik)} stroke={ARAH.naik} strokeWidth={6} strokeLinecap="round" /> : null}
              {turun > 0.001 ? <line x1={xm} y1={yNaik} x2={lerp(xm, GRAFIK.x1, turun)} y2={lerp(yNaik, yTurun, turun)} stroke={ARAH.turun} strokeWidth={6} strokeLinecap="round" /> : null}
            </svg>
          </div>);
      })()}
      <PilNominal x={GRAFIK.x1 + 30} y={GRAFIK.y} jangkar="kiri" teks={rpPenuh(Math.round(nab / 5) * 5)} arah={Math.max(-1, Math.min(1, (nab - NAB_AWAL) / 10))}
        p={popIn(f, T.nab) * keluar(4)} size={26} lebarMin={150} />

      {/* D: MATCH THE TIME — waktu investasi vs waktu dipakai, ujungnya segaris */}
      {[0, 1].map((i) => {
        const g = i === 0 ? b1 : b2;
        const p = popIn(f, i === 0 ? T.batang1[0] - 10 : T.batang2[0] - 10);
        if (p <= 0.001) return null;
        const y = BATANG.y[i], col = i === 0 ? B.turq : B.orange;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: BATANG.x0, top: y - BATANG.tebal / 2, width: BATANG.x1 - BATANG.x0, height: BATANG.tebal, borderRadius: BATANG.tebal / 2,
              background: rgba(col, 0.14), opacity: Math.min(1, p) }} />
            {g > 0.001 ? <div style={{ position: 'absolute', left: BATANG.x0, top: y - BATANG.tebal / 2, width: (BATANG.x1 - BATANG.x0) * g, height: BATANG.tebal,
              borderRadius: BATANG.tebal / 2, background: col, boxShadow: `0 8px 18px -8px ${col}aa` }} /> : null}
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(BATANG.chipX, y)} translate(-100%, -50%) scale(${p})`, transformOrigin: 'right center',
              display: 'flex', alignItems: 'center', gap: 10, width: 300, boxSizing: 'border-box', background: B.white, border: `2.5px solid ${col}`, borderRadius: 999,
              padding: '11px 24px', fontFamily: F, fontSize: 28, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -14px ${col}aa` }}>
              <Icon name={i === 0 ? 'jangkaWaktu' : 'kalender'} size={30} color={col} />
              {i === 0 ? 'Waktu investasi' : 'Waktu dipakai'}
            </div>
          </React.Fragment>);
      })}
      {/* skala tahun di bawah batang kedua */}
      {[1, 2, 3].map((n) => {
        const p = popIn(f, T.batang1[0] + 10 * n);
        if (p <= 0.001) return null;
        const x = BATANG.x0 + ((BATANG.x1 - BATANG.x0) * n) / 3;
        return (
          <React.Fragment key={n}>
            <div style={{ position: 'absolute', left: x - 1.5, top: BATANG.y[0] - 34, width: 3, height: BATANG.y[1] - BATANG.y[0] + 68, background: rgba(B.night, 0.08),
              transform: `scaleY(${p})` }} />
            <div style={{ position: 'absolute', left: x - 60, width: 120, top: BATANG.y[1] + 40, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 800,
              color: B.gray, opacity: Math.min(1, p) }}>{n} tahun</div>
          </React.Fragment>);
      })}
      {/* garis cocok + centang */}
      {(() => {
        const g = R(f, T.cocok - 30, T.cocok + 30, 0, 1, io);
        if (g <= 0.001) return null;
        const y0 = BATANG.y[0] - 40, y1 = BATANG.y[1] + 30;
        const c = popIn(f, T.cocok + 10) * (1 + denyut(f, T.cocok + 50, 0.08));
        return (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <line x1={BATANG.x1} y1={y0} x2={BATANG.x1} y2={lerp(y0, y1, g)} stroke={B.night} strokeWidth={3} strokeDasharray="7 9" strokeLinecap="round" />
            </svg>
            {c > 0.001 ? (
              <div style={{ position: 'absolute', left: BATANG.x1 - 36, top: y0 - 82, width: 72, height: 72, borderRadius: '50%', background: B.turq, border: `4px solid ${B.white}`,
                display: 'grid', placeItems: 'center', transform: `scale(${c})`, boxShadow: `0 10px 24px -8px ${B.turq}cc` }}>
                <Icon name="tersedia" size={40} color={B.white} />
              </div>) : null}
          </>);
      })()}

      {/* dompet Uang Stabil (dari Scene 08) naik ke atas · label pudar saat judul TEXT muncul · saldo keluar */}
      <div style={{ position: 'absolute', left: dx - dd / 2, top: dy - dd / 2, width: dd, height: dd, borderRadius: '50%', background: AWAL.warna, display: 'grid', placeItems: 'center',
        boxShadow: `0 18px 40px -12px ${AWAL.warna}aa` }}>
        <Icon name="dompet" size={dd * 0.52} color={B.white} />
      </div>
      {(() => {
        const a = 1 - cin(f, T.judul);
        if (a <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(dx, lerp(AWAL.labelY, DOMPET.y + DOMPET.d / 2 + 40, m)), translate: '-50% -50%', display: 'flex',
            alignItems: 'center', gap: 14, whiteSpace: 'nowrap', opacity: a }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: AWAL.warna }} />
            <span style={{ fontFamily: F, fontSize: AWAL.labelPx, fontWeight: 800, color: B.night }}>Uang Stabil</span>
          </div>);
      })()}
      <PilNominal x={AWAL.x} y={AWAL.saldoY} teks={rpPenuh(Math.round(S08_SALDO_AKHIR / 50_000) * 50_000)} arah={-1} p={popOut(f, T.saldoKeluar)} size={28} lebarMin={250} />

      <AbsoluteFill>
        <Judul f={f} kata={['Uang', 'stabil']} at={T.judul} />
        <Judul f={f} kata={['sesuaikan', 'dengan', 'waktu', 'penggunaannya']} sorotIdx={2} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
      </AbsoluteFill>
    </MaskerKeluar>);
};

export const S09_T = T;
