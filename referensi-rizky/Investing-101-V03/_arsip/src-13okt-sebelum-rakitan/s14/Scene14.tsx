import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, CORET, R, io, lerp, mixHex, rgba } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Chip, denyut } from '../parts/umum';

/**
 * SCENE 14 — IDE VISUAL (13 Okt). Bab "03 — Uang Jangka Panjang". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Grafik investasi jangka panjang dengan beberapa penurunan besar di tengah perjalanan.
 *   TEXT    "Jangka panjang ≠ pasti untung"
 * Empat ketukan (18,75 dtk):
 *   A  "Tapi tetap ingat: jangka panjang bukan berarti pasti untung."     isi Scene 13 keluar · panel grafik · judul TEXT · garis mulai di "bukan"
 *   B  "Potensi return yang lebih tinggi biasanya juga datang dengan pergerakan harga yang lebih besar."
 *        grafik 10+ tahun tergambar terus (naik jangka panjang, tiga penurunan besar −32 % · −30 % · −23 %, pil merah tiap penurunan) · nilai berjalan
 *   C  "Keuntungan dari punya waktu panjang adalah kita punya kesempatan melewati berbagai siklus pasar,"   pita merah di tiap penurunan = siklus
 *   D  "bukan jaminan bahwa harga akan selalu naik."   garis lurus putus-putus "Selalu naik" (ideal) → dicoret MERAH di "selalu naik"
 */

const [ingat, jangka, bukan, potensi, pergerakan, besar, siklus, pasar, jaminan, selalu, naik] = urut([
  'ingat', 'jangka', 'bukan', 'potensi', 'pergerakan', 'besar', 'siklus', 'pasar', 'jaminan', 'selalu', 'naik'], BATAS.s14);

const T = {
  panel: ingat, judul: jangka, garis: [bukan, pasar + 10], denyutNilai: [potensi + 20, besar], kurung: pergerakan, pita: siklus, denyutPita: pasar,
  ideal: jaminan - 10, chipIdeal: jaminan + 10, coret: selalu + 10, denyutAkhir: naik + 10,
};

/* ── tata letak: panel 200–1720 × 240–860 ── */
const PANEL = { x: 200, y: 240, w: 1520, h: 620 };
const NILAI = [100, 112, 106, 124, 96, 84, 102, 128, 140, 112, 98, 122, 150, 168, 130, 148, 172, 190];
const X0 = 300, X1 = 1640;
const PX = 4.0; // 1 poin nilai = 4 px · nilai 80 di y 790 (pil penurunan tetap di dalam panel)
const ke = (i: number): [number, number] => [X0 + ((X1 - X0) * i) / (NILAI.length - 1), 790 - (NILAI[i] - 80) * PX];
const TITIK = NILAI.map((_, i) => ke(i));
/** penurunan besar: indeks puncak → dasar */
const TURUN: [number, number][] = [[3, 5], [8, 10], [13, 14]];
const panjangPoly = (pts: [number, number][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const L = panjangPoly(TITIK);
const sebagian = (g: number) => {
  const target = L * g;
  const out: [number, number][] = [TITIK[0]];
  let acc = 0;
  for (let i = 1; i < TITIK.length; i++) {
    const d = Math.hypot(TITIK[i][0] - TITIK[i - 1][0], TITIK[i][1] - TITIK[i - 1][1]);
    if (acc + d >= target) { const t = (target - acc) / Math.max(1e-6, d); out.push([lerp(TITIK[i - 1][0], TITIK[i][0], t), lerp(TITIK[i - 1][1], TITIK[i][1], t)]); return out; }
    out.push(TITIK[i]); acc += d;
  }
  return out;
};
const fraksi = (i: number) => panjangPoly(TITIK.slice(0, i + 1)) / L;

/** KELUAR Scene 14 = milik Scene 15 ("Makanya, …", bab baru): seluruh isi naik-pudar 40f mulai di batas, judul keluar */
export const S14_KELUAR = BATAS.s15 + 20;
export const Scene14: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s14 || f >= S14_KELUAR + 60) return null;
  const kel = R(f, S14_KELUAR - 20, S14_KELUAR + 20, 0, 1, io);
  const panel = popIn(f, T.panel);
  const g = R(f, T.garis[0], T.garis[1], 0, 1);
  const pts = sebagian(g);
  const kepala = pts[pts.length - 1];
  const nilai = 100_000_000 * (1 + (ke(0)[1] - kepala[1]) / PX / 100);
  const ideal = R(f, T.ideal - 30, T.ideal + 30, 0, 1, io);
  const coret = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kel, transform: `translate3d(0px, ${-30 * kel}px, 0)` }}>
      {panel > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${panel})`, transformOrigin: `${PANEL.x + PANEL.w / 2}px ${PANEL.y + PANEL.h / 2}px` }}>
          <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 28, background: B.white,
            boxShadow: `0 26px 52px -22px ${rgba(B.night, 0.28)}, 0 2px 8px ${rgba(B.night, 0.05)}` }} />
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {/* C: pita merah di tiap penurunan (siklus pasar) */}
            {TURUN.map(([a, b], k) => {
              const p = cin(f, T.pita + 14 * k) * (1 + denyut(f, T.denyutPita + 14 * k, 0.5));
              if (p <= 0.001) return null;
              const xa = TITIK[a][0], xb = TITIK[b][0];
              return <rect key={k} x={xa} y={PANEL.y + 30} width={xb - xa} height={PANEL.h - 60} rx={14} fill={ARAH.turun} opacity={0.08 * Math.min(1.5, p)} />;
            })}
            {/* garis acuan Rp100 jt */}
            <line x1={PANEL.x + 40} y1={ke(0)[1]} x2={PANEL.x + PANEL.w - 40} y2={ke(0)[1]} stroke={rgba(B.night, 0.1)} strokeWidth={2} strokeDasharray="6 10" />
            {/* D: "selalu naik" — garis lurus ideal, dicoret merah */}
            {ideal > 0.001 ? <line x1={TITIK[0][0]} y1={TITIK[0][1]} x2={lerp(TITIK[0][0], TITIK[TITIK.length - 1][0], ideal)}
              y2={lerp(TITIK[0][1], TITIK[TITIK.length - 1][1], ideal)} stroke={mixHex(B.turq, CORET, coret)} strokeWidth={4} strokeDasharray="12 12" strokeLinecap="round"
              opacity={1 - 0.45 * coret} /> : null}
            {/* grafik jangka panjang: naik dengan penurunan besar (segmen turun merah) */}
            {g > 0.001 ? pts.slice(1).map((p, i) => {
              const p0 = pts[i];
              const turun = TURUN.some(([a, b]) => i >= a && i < b);
              return <line key={i} x1={p0[0]} y1={p0[1]} x2={p[0]} y2={p[1]} stroke={turun ? ARAH.turun : B.night} strokeWidth={turun ? 7 : 6} strokeLinecap="round" />;
            }) : null}
          </svg>
          {g > 0.001 && g < 0.999 ? <div style={{ position: 'absolute', left: kepala[0] - 12, top: kepala[1] - 12, width: 24, height: 24, borderRadius: '50%', background: B.white,
            border: `5px solid ${B.night}`, boxSizing: 'border-box' }} /> : null}
          {/* pil merah tiap penurunan besar (nominal persen) */}
          {TURUN.map(([a, b], k) => {
            const p = popIn(f, lerp(T.garis[0], T.garis[1], fraksi(b)) + 10);
            const persen = Math.round((1 - NILAI[b] / NILAI[a]) * 100);
            return <PilNominal key={k} x={(TITIK[a][0] + TITIK[b][0]) / 2 + 10} y={TITIK[b][1] + 46} teks={`${persen}%`} arah={-1} p={p} size={24} />;
          })}
          {/* nilai berjalan */}
          <PilNominal x={PANEL.x + 50} y={PANEL.y + 58} jangkar="kiri" teks={rpPenuh(Math.round(nilai / 500_000) * 500_000)}
            arah={Math.max(-1, Math.min(1, (nilai - 100_000_000) / 5_000_000))} p={popIn(f, T.garis[0] + 10) * (1 + T.denyutNilai.reduce((s, t) => s + denyut(f, t, 0.07), 0))}
            size={30} lebarMin={270} />
          {/* chip "Selalu naik" (ideal) dicoret */}
          <Chip x={TITIK[TITIK.length - 1][0] - 40} y={TITIK[TITIK.length - 1][1] - 70} teks="Selalu naik" warna={B.turq} p={popIn(f, T.chipIdeal) * (1 + denyut(f, T.denyutAkhir, 0.06))}
            coret={coret} size={28} />
        </div>) : null}

      </AbsoluteFill>
      <Judul f={f} kata={['Jangka', 'panjang', '≠', 'pasti', 'untung']} at={T.judul} keluar={S14_KELUAR} />
    </AbsoluteFill>);
};

export const S14_T = T;
