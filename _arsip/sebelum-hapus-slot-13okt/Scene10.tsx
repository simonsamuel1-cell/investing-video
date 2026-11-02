import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, WARNA, io, lerp, rgba } from '../theme';
import { Icon, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import type { KunciIkon } from '../ikon';

/**
 * SCENE 10 — IDE VISUAL (13 Okt). Bab "Contoh yang Salah". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  3 TAHUN LAGI · DP RUMAH ↓ SAHAM / REKSA DANA SAHAM ↓ ↑ ↓ ↑ ↓
 *   TEXT    "Bukan produknya yang salah" / "[waktunya] bisa tidak cocok"
 * Alur kiri → kanan (kolom VISUAL dibaca mendatar): DP rumah (3 tahun lagi) → Saham / RD saham → panel pasar 3 tahun lagi.
 * Empat ketukan (19 dtk):
 *   A  "Coba bayangkan, kita sudah tahu tiga tahun lagi harus membayar DP rumah."
 *        isi Scene 09 naik-pudar · DP rumah (oranye, rumah) di "tahu" · "3 tahun lagi" di "tiga" · Rp100.000.000 di "membayar"
 *   B  "Kalau sekarang seluruh uang itu dimasukkan ke saham atau reksa dana saham,"
 *        panah di "dimasukkan" · Saham di "saham" (uang mengalir dari DP rumah) · Reksa dana saham di "reksa"
 *   C  "masalahnya bukan karena produknya jelek."
 *        judul TEXT · centang di kedua produk ("bukan … jelek" = produknya baik)
 *   D  "Masalahnya adalah: kita nggak tahu kondisi pasar tiga tahun lagi akan seperti apa."
 *        panah kedua · panel pasar: harga ↑ ↓ ↑ ↓ (hijau/merah) lalu kipas tiga kemungkinan (naik · datar · turun) sampai garis "3 tahun lagi" ·
 *        tanda tanya di "seperti apa" · sub-judul TEXT (sorot "waktunya")
 */

const [kita0, tahu, tiga, membayar, dp, kalau, seluruh, uang, dimasukkan, saham, reksa, masalahnya, bukan, produknya, masalahnya2, adalah, kita, kondisi, tiga2, seperti,
  apa] = urut([
  'kita', 'tahu', 'tiga', 'membayar', 'dp', 'kalau', 'seluruh', 'uang', 'dimasukkan', 'saham', 'reksa', 'masalahnya', 'bukan', 'produknya', 'masalahnya', 'adalah',
  'kita', 'kondisi', 'tiga', 'seperti', 'apa'], BATAS.s10);

const T = {
  // DP rumah sudah ada sejak masker Scene 09 mendarat: berdenyut di "KITA sudah tahu" & sesudah "tahu" (isi jendela diam rakitan 13 Okt)
  denyutAwal: [kita0 + 10, tahu + 50],
  dp: tahu + 20, dpLabel: tahu + 28, tigaTahun: tiga, nominal: membayar, denyutDp: dp,
  // "KALAU sekarang SELURUH uang itu DIMASUKKAN ke SAHAM": DP berdenyut → panah tergambar → uang berangkat di "dimasukkan", tiba saat Saham muncul
  denyutDp2: kalau, panah1: seluruh + 20, denyutNominal: uang, uangJalan: [dimasukkan, saham + 14], saham, rdSaham: reksa,
  judul: masalahnya, centang: [bukan + 10, produknya + 10],
  panah2: masalahnya2, panel: adalah, grafik: [kita - 10, kondisi + 20], kipas: [tiga2 - 10, seperti], tanya: seperti + 10, labelPanel: kondisi,
  sub: masalahnya2 + 30, subSorot: apa,
};

/* ── tata letak (isi 340–705 berpusat ±522, mendatar 315–1610 berpusat ±962) ── */
const Y = 470;
const N1 = { x: 400, d: 170 };
const N2: { x: number; ikon: KunciIkon; warna: string }[] = [
  { x: 800, ikon: 'saham', warna: B.blue }, // warna instrumen = awan Scene 01
  { x: 980, ikon: 'rdSaham', warna: WARNA.langit },
];
const D_N2 = 150;
const PANEL = { x: 1190, y: 340, w: 420, h: 280 };
const LABEL_Y = Y + 115;
/** harga ↑ ↓ ↑ ↓ (kolom VISUAL) di bagian kiri panel, lalu kipas tiga kemungkinan sampai "3 tahun lagi" */
const ZIGZAG: [number, number][] = [[1215, 500], [1265, 430], [1310, 485], [1355, 415], [1400, 470]];
const GARIS_3TH = 1575;
const KIPAS: [number, number][] = [[GARIS_3TH, 380], [GARIS_3TH, 470], [GARIS_3TH, 575]];
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));
const polyLen = (pts: [number, number][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/** KELUAR Scene 10 = milik Scene 11 ("Kalau tepat saat …"): seluruh isi naik-pudar 40f mulai di batas, judul keluar; panel pasar
 *  dilanjutkan Scene 11 (bingkai panel membesar dari titik & ukuran yang sama, S10_PANEL) */
export const S10_KELUAR = BATAS.s11 + 20;
/** MASUK Scene 10 = masker Scene 09 menyusut ke lingkaran DP rumah (mendarat 40f sesudah batas, sebelum "tahu"; brief Video 02 B) */
export const S10_MASUK = { x: 400, y: 470, r: 85, warna: B.orange, mulai: BATAS.s10 - 20 };
const DARAT = S10_MASUK.mulai + 60;
export const S10_PANEL = PANEL;
export const Scene10: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s10 - 30 || f >= S10_KELUAR + 60) return null;
  const kelS10 = R(f, S10_KELUAR - 20, S10_KELUAR + 20, 0, 1, io);
  const g = R(f, T.grafik[0], T.grafik[1], 0, 1, io);
  const kipas = R(f, T.kipas[0] - 20, T.kipas[1] + 10, 0, 1, io);
  const panel = popIn(f, T.panel);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kelS10, transform: geser(0, -30 * kelS10) }}>
      {/* panah: DP rumah → produk ("dimasukkan") · produk → panel pasar ("masalahnya adalah") */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {[[N1.x + N1.d / 2 + 16, N2[0].x - D_N2 / 2 - 20, T.panah1, B.orange], [N2[1].x + D_N2 / 2 + 16, PANEL.x - 18, T.panah2, B.gray]].map(([x0, x1, at, col], i) => {
          const gg = R(f, (at as number) - 30, (at as number) + 30, 0, 1, io);
          if (gg <= 0.001) return null;
          const xe = lerp(x0 as number, x1 as number, gg);
          return (
            <g key={i}>
              <line x1={x0 as number} y1={Y} x2={xe - 6} y2={Y} stroke={col as string} strokeWidth={4} strokeDasharray="9 11" strokeLinecap="round" />
              {gg > 0.85 ? <path d={`M ${xe + 8} ${Y} l -20 -13 l 0 26 z`} fill={col as string} opacity={R(gg, 0.85, 1, 0, 1)} /> : null}
            </g>);
        })}
      </svg>

      {/* DP rumah (3 tahun lagi) + nominal */}
      {(() => {
        // sudah ada sejak masker Scene 09 mendarat (ikon memudar masuk 20f)
        const p = (f >= DARAT ? 0.99996 : 0) * (1 + denyut(f, T.denyutDp, 0.06) + denyut(f, T.denyutDp2, 0.06) + T.denyutAwal.reduce((s, t) => s + denyut(f, t, 0.06), 0));
        if (p <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: N1.x - N1.d / 2, top: Y - N1.d / 2, width: N1.d, height: N1.d, borderRadius: '50%', background: B.orange, display: 'grid',
            placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 16px 34px -12px ${B.orange}aa` }}>
            <Icon name="dpRumah" size={N1.d * 0.5} color={B.white} style={{ opacity: R(f, DARAT, DARAT + 20, 0, 1, io) }} />
          </div>);
      })()}
      {f >= T.dpLabel - 30 ? (
        <div style={{ position: 'absolute', left: N1.x - 170, width: 340, top: LABEL_Y - 22, textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
          <WordText halus f={f} at={T.dpLabel} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>DP rumah</WordText>
          <div><WordText halus f={f} at={T.tigaTahun + 6} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.orange }}>3 tahun lagi</WordText></div>
        </div>) : null}
      <PilNominal x={N1.x} y={LABEL_Y + 105} teks="Rp100.000.000" arah={0} size={26} p={popIn(f, T.nominal) * (1 + denyut(f, T.denyutNominal, 0.06))} />
      {/* uang DP mengalir ke saham ("dimasukkan ke SAHAM") */}
      {(() => {
        const gg = R(f, T.uangJalan[0], T.uangJalan[1], 0, 1, io);
        if (gg <= 0.001 || gg >= 0.999) return null;
        const W = 90, H = W / (520 / 441);
        const x = lerp(N1.x, N2[0].x, gg), y = Y - Math.sin(Math.PI * gg) * 70;
        return <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(gg, 0, 0.12, 0, 1) * R(gg, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2) }} />;
      })()}

      {/* Saham · Reksa dana saham (+ centang "bukan karena produknya jelek") */}
      {N2.map((n, i) => {
        const p = popIn(f, i === 0 ? T.saham : T.rdSaham) * (1 + (i === 0 ? denyut(f, T.uangJalan[1] + 10, 0.06) : 0));
        if (p <= 0.001) return null;
        const c = popIn(f, T.centang[i]);
        return (
          <React.Fragment key={n.ikon}>
            <div style={{ position: 'absolute', left: n.x - D_N2 / 2, top: Y - D_N2 / 2, width: D_N2, height: D_N2, borderRadius: '50%', background: n.warna, display: 'grid',
              placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 16px 34px -12px ${n.warna}aa` }}>
              <Icon name={n.ikon} size={D_N2 * 0.56} color={B.white} />
            </div>
            {c > 0.001 ? (
              <div style={{ position: 'absolute', left: n.x + D_N2 * 0.36 - 30, top: Y - D_N2 * 0.36 - 30, width: 60, height: 60, borderRadius: '50%', background: B.turq,
                border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${c})`, boxShadow: `0 10px 24px -8px ${B.turq}cc` }}>
                <Icon name="tersedia" size={32} color={B.white} />
              </div>) : null}
          </React.Fragment>);
      })}
      {f >= T.saham - 24 ? (
        <div style={{ position: 'absolute', left: (N2[0].x + N2[1].x) / 2 - 240, width: 480, top: LABEL_Y - 22, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <WordText halus f={f} at={T.rdSaham + 10} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Saham / reksa dana saham</WordText>
        </div>) : null}

      {/* panel pasar 3 tahun lagi: ↑ ↓ ↑ ↓ lalu kipas kemungkinan + tanda tanya */}
      {panel > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${panel})`, transformOrigin: `${PANEL.x + PANEL.w / 2}px ${PANEL.y + PANEL.h / 2}px` }}>
          <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 24, background: B.white,
            boxShadow: `0 22px 44px -18px ${rgba(B.night, 0.28)}, 0 2px 8px ${rgba(B.night, 0.05)}` }} />
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {/* garis "3 tahun lagi" */}
            <line x1={GARIS_3TH} y1={PANEL.y + 26} x2={GARIS_3TH} y2={PANEL.y + PANEL.h - 26} stroke={B.orange} strokeWidth={3} strokeDasharray="7 9" opacity={R(f, T.kipas[0] - 30, T.kipas[0], 0, 1)} />
            {g > 0.001 ? (() => {
              const L = polyLen(ZIGZAG);
              return ZIGZAG.slice(1).map((p, k) => {
                const p0 = ZIGZAG[k];
                const a = polyLen(ZIGZAG.slice(0, k + 1)) / L, b = polyLen(ZIGZAG.slice(0, k + 2)) / L;
                const t = R(g, a, b, 0, 1);
                if (t <= 0) return null;
                return <line key={k} x1={p0[0]} y1={p0[1]} x2={lerp(p0[0], p[0], t)} y2={lerp(p0[1], p[1], t)} stroke={p[1] < p0[1] ? ARAH.naik : ARAH.turun}
                  strokeWidth={6} strokeLinecap="round" />;
              });
            })() : null}
            {kipas > 0.001 ? KIPAS.map((k, i) => {
              const s = ZIGZAG[ZIGZAG.length - 1];
              return <line key={i} x1={s[0]} y1={s[1]} x2={lerp(s[0], k[0] - 30, kipas)} y2={lerp(s[1], k[1], kipas)} stroke={B.gray} strokeWidth={4}
                strokeDasharray="8 10" strokeLinecap="round" opacity={0.85} />;
            }) : null}
          </svg>
          {/* tanda tanya di garis 3 tahun lagi */}
          {(() => {
            const q = popIn(f, T.tanya) * (1 + denyut(f, T.tanya + 50, 0.08));
            if (q <= 0.001) return null;
            return (
              <div style={{ position: 'absolute', left: GARIS_3TH - 34, top: PANEL.y + PANEL.h / 2 - 34, width: 68, height: 68, borderRadius: '50%', background: B.orange,
                border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${q})`, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.white,
                boxShadow: `0 10px 24px -8px ${B.orange}cc`, lineHeight: 1 }}>?</div>);
          })()}
        </div>) : null}
      {f >= T.labelPanel - 30 ? (
        <div style={{ position: 'absolute', left: PANEL.x + PANEL.w / 2 - 240, width: 480, top: PANEL.y + PANEL.h + 22, textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
          <WordText halus f={f} at={T.labelPanel} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Kondisi pasar</WordText>
          <div><WordText halus f={f} at={T.kipas[0]} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.orange }}>3 tahun lagi</WordText></div>
        </div>) : null}

      </AbsoluteFill>
      <Judul f={f} kata={['Bukan', 'produknya', 'yang', 'salah']} at={T.judul} keluar={S10_KELUAR} />
      <Judul f={f} kata={['waktunya', 'bisa', 'tidak', 'cocok']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S10_KELUAR} />
    </AbsoluteFill>);
};

export const S10_T = T;
