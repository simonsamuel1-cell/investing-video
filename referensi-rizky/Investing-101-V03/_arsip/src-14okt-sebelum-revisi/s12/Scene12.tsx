import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, io, lerp, rgba } from '../theme';
import { cin, Icon, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { JamBerjalan } from '../parts/jam';
import { PilNominal, rpPenuh } from '../parts/nominal';

/**
 * SCENE 12 — IDE VISUAL (13 Okt). Bab "03 — Uang Jangka Panjang". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Timeline: 3 Tahun → 5 Tahun → 10+ Tahun · di tengah: ↑ ↓ ↑ ↓ ↑
 *   TEXT    "③ Uang Jangka Panjang" / "3+ tahun · Tidak ada kebutuhan [dekat]"
 * Empat ketukan (22,6 dtk):
 *   A  "Yang terakhir adalah uang jangka panjang."
 *        isi Scene 11 keluar · deret tiga dompet (tata letak Scene 03) · Uang Jangka Panjang disorot di "jangka", dua lainnya meredup · judul TEXT ③
 *   B  "Ini adalah uang yang setidaknya dalam tiga tahun ke depan kita sudah yakin nggak akan dipakai."
 *        dompet lain turun & pudar, Uang Jangka Panjang ke kiri · garis waktu Sekarang → 3 → 5 → 10+ Tahun · pita "3+ tahun" ·
 *        sub-judul TEXT · gembok "nggak akan dipakai"
 *   C  "Kenapa uang seperti ini bisa ditempatkan pada investasi dengan potensi pertumbuhan lebih tinggi?"
 *        panah tren putus-putus (potensi) · harga ↑ ↓ ↑ ↓ ↑ tergambar naik mengikuti tren · nilai berjalan Rp100 jt → Rp180 jt ▲
 *   D  "Karena kita punya lebih banyak waktu untuk menghadapi naik-turunnya pasar."
 *        pita waktu menebal + jam berjalan · segitiga ▲▼ di tiap naik-turun berurutan (naik-turunnya pasar)
 */

const [terakhir, jangka, panjang, ini, uang, , tiga, depan, kita, nggak, dipakai, kenapa, ditempatkan, investasi, potensi, tinggi, karena, waktu,
  menghadapi, pasar] = urut([
  'terakhir', 'jangka', 'panjang', 'ini', 'uang', 'setidaknya', 'tiga', 'depan', 'kita', 'nggak', 'dipakai', 'kenapa', 'ditempatkan', 'investasi', 'potensi',
  'tinggi', 'karena', 'waktu', 'menghadapi', 'pasar'], BATAS.s12);

const T = {
  // deret masuk sesudah isi Scene 11 pudar (S11_KELUAR)
  masuk: [terakhir + 30, terakhir + 46, terakhir + 62], sorot: jangka, judul: panjang,
  pindah: ini + 10, sumbu: [uang, depan + 20], denyutDompet: kenapa, titik: [tiga, depan, depan + 20], pita: depan + 10, sub: kita, subSorot: dipakai, kunci: nggak,
  tren: [kenapa, ditempatkan + 30], denyutTren: potensi, grafik: [investasi - 20, tinggi + 20], nilai: investasi, denyutNilai: tinggi + 30,
  pitaTebal: karena, jam: waktu - 10, segitiga: [menghadapi - 30, pasar + 20],
};

/* ── tata letak ── */
const DERET = { x: [400, 960, 1520], y: 410, d: 200, labelDy: 160 };
const WARNA_DOMPET = [B.blue, B.turq, B.orange];
const NAMA = ['Uang Aktif', 'Uang Stabil', 'Uang Jangka Panjang'];
/** B–D: dompet kiri-atas · garis waktu y 780 · grafik di atasnya (Rp100 jt di y 640 → Rp180 jt di y 300) */
const DOMPET = { x: 300, y: 420, d: 170 };
const SUMBU = { y: 780, x0: 330, x1: 1660 };
const TICK = [{ x: 330, nama: 'Sekarang' }, { x: 720, nama: '3 Tahun' }, { x: 1080, nama: '5 Tahun' }, { x: 1540, nama: '10+ Tahun' }];
const GARIS: [number, number][] = [[460, 640], [570, 585], [650, 640], [760, 540], [840, 600], [940, 500], [1020, 560], [1120, 450], [1200, 512], [1310, 400], [1390, 452], [1490, 345], [1580, 300]]; // mulai x 460: jauh dari pil nilai
const Y_100 = 640, PX_PER_PERSEN = 4.25;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));
const panjangPoly = (pts: [number, number][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const sebagian = (pts: [number, number][], g: number) => {
  const L = panjangPoly(pts) * g;
  const out: [number, number][] = [pts[0]];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + d >= L) { const t = (L - acc) / Math.max(1e-6, d); out.push([lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)]); return out; }
    out.push(pts[i]); acc += d;
  }
  return out;
};
const poly = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

/** KELUAR Scene 12 = milik Scene 13 ("Untuk uang jangka panjang, …"): garis waktu, grafik & judul keluar (naik-pudar 40f); dompet Uang Jangka
 *  Panjang (+ label) diambil alih Scene 13 (S12_DOMPET_AKHIR), nilai & gembok keluar */
export const S12_KELUAR = BATAS.s13 + 20;
/** MASUK Scene 12 = masker Scene 11 menyusut ke dompet Uang Jangka Panjang di deret (mendarat 40f sesudah batas, sebelum "terakhir";
 *  brief Video 02 B — rakitan 13 Okt). Dua dompet lain masuk sesudahnya. */
export const S12_MASUK = { x: DERET.x[2], y: DERET.y, r: DERET.d / 2, warna: B.orange, mulai: BATAS.s12 - 20 };
const DARAT = S12_MASUK.mulai + 60;
export const Scene12: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s12 - 30 || f >= S12_KELUAR + 60) return null;
  const kelS12 = R(f, S12_KELUAR - 20, S12_KELUAR + 20, 0, 1, io);
  const milikS12 = f < BATAS.s13;
  const sorot = cin(f, T.sorot), pindah = cin(f, T.pindah);
  const sumbu = R(f, T.sumbu[0], T.sumbu[1], 0, 1, io);
  const g = R(f, T.grafik[0], T.grafik[1], 0, 1);
  const pts = sebagian(GARIS, g);
  const kepala = pts[pts.length - 1];
  const nilai = 100_000_000 * (1 + (Y_100 - kepala[1]) / PX_PER_PERSEN / 100);
  const tren = R(f, T.tren[0], T.tren[1], 0, 1); // linear: tanpa jendela diam di awal/akhir
  const tebal = cin(f, T.pitaTebal);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kelS12, transform: geser(0, -30 * kelS12) }}>
      {/* ── garis waktu + pita 3+ tahun (B–D) ── */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {(() => {
          const gp = R(f, T.pita - 30, T.pita + 30, 0, 1, io);
          if (gp <= 0.001) return null;
          const x0 = TICK[1].x, x1 = lerp(x0, SUMBU.x1 - 20, gp), h = 22 + 14 * tebal;
          return <rect x={x0} y={SUMBU.y - h / 2} width={x1 - x0} height={h} rx={h / 2} fill={B.orange} opacity={0.3 + 0.15 * tebal} />;
        })()}
        {sumbu > 0.001 ? (() => {
          const xe = lerp(SUMBU.x0, SUMBU.x1, sumbu);
          return (
            <>
              <line x1={SUMBU.x0} y1={SUMBU.y} x2={xe - 8} y2={SUMBU.y} stroke={B.grayLite} strokeWidth={4} strokeLinecap="round" />
              {sumbu > 0.85 ? <path d={`M ${xe} ${SUMBU.y} l -20 -13 l 0 26 z`} fill={B.grayLite} opacity={R(sumbu, 0.85, 1, 0, 1)} /> : null}
            </>);
        })() : null}
        {/* tren potensi (putus-putus) */}
        {tren > 0.001 ? <line x1={GARIS[0][0]} y1={GARIS[0][1]} x2={lerp(GARIS[0][0], GARIS[GARIS.length - 1][0] + 40, tren)}
          y2={lerp(GARIS[0][1], GARIS[GARIS.length - 1][1] - 12, tren)} stroke={B.orange} strokeWidth={4 + 3 * Math.sin(Math.PI * R(f, T.denyutTren - 20, T.denyutTren + 20, 0, 1, io))} strokeDasharray="10 12" strokeLinecap="round" opacity={0.6} /> : null}
        {/* harga ↑ ↓ ↑ ↓ ↑ naik mengikuti tren */}
        {g > 0.001 ? <path d={poly(pts)} fill="none" stroke={B.night} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
      </svg>
      {g > 0.001 && g < 0.999 ? <div style={{ position: 'absolute', left: kepala[0] - 12, top: kepala[1] - 12, width: 24, height: 24, borderRadius: '50%', background: B.white,
        border: `5px solid ${B.night}`, boxSizing: 'border-box' }} /> : null}
      {/* D: ▲▼ di tiap naik-turun, berurutan */}
      {GARIS.slice(1).map((p, k) => {
        const p0 = GARIS[k], naik = p[1] < p0[1];
        const muncul = popIn(f, T.segitiga[0] + ((T.segitiga[1] - T.segitiga[0]) * k) / (GARIS.length - 2));
        if (muncul <= 0.001) return null;
        const mx = (p0[0] + p[0]) / 2, my = (p0[1] + p[1]) / 2 + (naik ? -40 : 40);
        return (
          <svg key={k} width={28} height={24} viewBox="0 0 22 18" style={{ position: 'absolute', left: mx - 14, top: my - 12, transform: `scale(${muncul})`, overflow: 'visible' }}>
            <path d={naik ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={naik ? ARAH.naik : ARAH.turun} />
          </svg>);
      })}
      {/* titik & label tahun */}
      {TICK.map((t, i) => {
        const at = i === 0 ? T.sumbu[0] + 20 : T.titik[i - 1];
        const p = popIn(f, at);
        if (p <= 0.001) return null;
        const col = i === 0 ? B.orange : i === 1 ? B.orange : B.night;
        return (
          <React.Fragment key={t.nama}>
            <div style={{ position: 'absolute', left: t.x - 12, top: SUMBU.y - 12, width: 24, height: 24, borderRadius: '50%', background: B.white, boxSizing: 'border-box',
              border: `5px solid ${i === 0 ? B.grayLite : B.orange}`, transform: `scale(${p})` }} />
            <div style={{ position: 'absolute', left: t.x - 110, width: 220, top: SUMBU.y + 30, textAlign: 'center', whiteSpace: 'nowrap' }}>
              <WordText halus f={f} at={at + 6} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: i === 0 ? B.gray : col }}>{t.nama}</WordText>
            </div>
          </React.Fragment>);
      })}
      {/* D: jam berjalan di pita ("lebih banyak WAKTU") */}
      {(() => {
        const j = popIn(f, T.jam);
        if (j <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: (TICK[2].x + TICK[3].x) / 2 - 36, top: SUMBU.y - 36, width: 72, height: 72, borderRadius: '50%', background: B.orange,
            border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${j})`, boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
            <JamBerjalan size={40} color={B.white} latar={B.orange} menit={600 * R(f, T.jam, T.jam + 150, 0, 1, io)} />
          </div>);
      })()}

      </AbsoluteFill>
      {/* ── deret tiga dompet (A) → Uang Jangka Panjang ke kiri (B) — dompet diambil alih Scene 13 di batas ── */}
      {[0, 1, 2].map((k) => {
        const masuk = k === 2 ? (f >= DARAT ? 0.99996 : 0) : popIn(f, T.masuk[k]);
        if (masuk <= 0.001 || (k === 2 && !milikS12)) return null;
        const turun = k === 2 ? 0 : cin(f, T.pindah + 6 * k);
        if (turun >= 0.999) return null;
        const redup = k === 2 ? 0 : 0.45 * sorot;
        const x = k === 2 ? lerp(DERET.x[2], DOMPET.x, pindah) : DERET.x[k];
        const y = k === 2 ? lerp(DERET.y, DOMPET.y, pindah) : DERET.y + 220 * turun;
        const dd = k === 2 ? lerp(DERET.d * (1 + 0.12 * sorot), DOMPET.d, pindah) * (1 + denyut(f, T.denyutDompet, 0.06)) : DERET.d;
        const labelY = k === 2 ? lerp(DERET.y + DERET.labelDy, DOMPET.y + 125, pindah) : DERET.y + DERET.labelDy + 220 * turun;
        const ring = k === 2 ? sorot * (1 - pindah) : 0;
        const kunci = k === 2 ? popIn(f, T.kunci) : 0;
        return (
          <div key={NAMA[k]} style={{ position: 'absolute', inset: 0, opacity: (1 - redup) * (1 - turun) }}>
            <div style={{ position: 'absolute', left: x - dd / 2, top: y - dd / 2, width: dd, height: dd, borderRadius: '50%', background: WARNA_DOMPET[k], display: 'grid',
              placeItems: 'center', transform: `scale(${masuk})`, boxShadow: `0 18px 40px -12px ${WARNA_DOMPET[k]}aa` }}>
              <Icon name="dompet" size={dd * 0.52} color={B.white} style={k === 2 ? { opacity: R(f, DARAT, DARAT + 20, 0, 1, io) } : undefined} />
            </div>
            {ring > 0.001 ? <div style={{ position: 'absolute', left: x - dd / 2 - 16, top: y - dd / 2 - 16, width: dd + 32, height: dd + 32, borderRadius: '50%',
              border: `3px solid ${B.orange}`, opacity: ring, boxShadow: `0 0 36px 4px ${B.orange}55` }} /> : null}
            {kunci > 0.001 ? (
              <div style={{ position: 'absolute', left: x + dd * 0.36 - 34, top: y - dd * 0.36 - 34, width: 68, height: 68, borderRadius: '50%', background: B.night,
                border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${kunci})`, boxShadow: `0 10px 24px -8px ${rgba(B.night, 0.5)}` }}>
                <Icon name="kunci" size={34} color={B.white} />
              </div>) : null}
            <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, labelY), translate: '-50% -50%', display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: WARNA_DOMPET[k], transform: `scale(${masuk})` }} />
              <WordText halus f={f} at={T.masuk[k] + 10} style={{ fontFamily: F, fontSize: lerp(38, 34, k === 2 ? pindah : 0), fontWeight: 800, color: B.night }}>{NAMA[k]}</WordText>
            </div>
          </div>);
      })}
      {/* nilai berjalan (di bawah label dompet) */}
      <PilNominal x={DOMPET.x} y={DOMPET.y + 185} teks={rpPenuh(Math.round(nilai / 500_000) * 500_000)} arah={Math.max(0, Math.min(1, (nilai - 100_000_000) / 5_000_000))}
        p={popIn(f, T.nilai) * (1 + denyut(f, T.denyutNilai, 0.08)) * (1 - kelS12)} size={28} lebarMin={250} />

      <Judul f={f} kata={['Uang', 'Jangka', 'Panjang']} nomor="3" warnaNomor={B.orange} at={T.judul} keluar={S12_KELUAR} />
      <Judul f={f} kata={['3+', 'tahun', '·', 'Tidak', 'ada', 'kebutuhan', 'dekat']} sorotIdx={6} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S12_KELUAR} />
    </AbsoluteFill>);
};

export const S12_T = T;
export const S12_DOMPET_AKHIR = { x: DOMPET.x, y: DOMPET.y, d: DOMPET.d, labelY: DOMPET.y + 125, nilaiAkhir: 100_000_000 * (1 + (Y_100 - GARIS[GARIS.length - 1][1]) / PX_PER_PERSEN / 100) };
