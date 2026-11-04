import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, CORET, F, R, io, lerp, mixHex, rgba } from '../theme';
import { cin, Icon } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { S10_PANEL } from '../s10/Scene10';

/**
 * SCENE 11 — IDE VISUAL (13 Okt). Bab "Contoh yang Salah" (lanjutan Scene 10: tanda tanya terjawab — skenario terburuk).
 *   VISUAL  Tanggal pembayaran semakin dekat ↓ MARKET CRASH ↓ SELL ↓ Dana yang tersedia berkurang
 *   TEXT    "Jangan sampai kebutuhan dana" / "memaksa kita [menjual]"
 * Empat ketukan (25,2 dtk):
 *   A  "Kalau tepat saat uangnya harus dipakai pasar sedang turun tajam,"
 *        panel pasar Scene 10 membesar jadi grafik · harga berjalan menuju garis "Tanggal pembayaran", hitung mundur 30 hari → 7 hari → Hari ini ·
 *        "turun tajam": anjlok merah TEPAT di tanggal, nilai DP Rp100 jt → Rp70 jt ▼
 *   B  "kita mungkin terpaksa menjual di harga yang nggak ideal."      chip "Jual" di titik terendah · nilai berdenyut di "harga … ideal"
 *   C  "Pasar mungkin butuh waktu untuk pulih, tapi tanggal pembayaran kita nggak ikut mundur."
 *        garis pemulihan putus-putus SESUDAH tanggal (sudah terlambat) · gembok tanggal · "mundur": tanggal tersentak tapi tetap
 *   D  "Makanya, uang yang akan dipakai dalam waktu dekat jangan dipaksa menanggung volatilitas investasi jangka panjang."
 *        grafik mengecil ke kiri · batang "Dibutuhkan Rp100 jt" vs "Tersedia Rp70 jt" + selisih merah −Rp30 jt (dana yang tersedia berkurang) ·
 *        judul + sub-judul TEXT (sorot "menjual")
 */

const [tepat, uangnya, dipakai, pasar, turun, mungkin, terpaksa, menjual, harga, ideal, pasar2, , tapi, tanggal, nggak, mundur, makanya, uang, dekat,
  jangan, dipaksa, volatilitas, jangka, panjangW] = urut([
  'tepat', 'uangnya', 'dipakai', 'pasar', 'turun', 'mungkin', 'terpaksa', 'menjual', 'harga', 'ideal', 'pasar', 'pulih', 'tapi', 'tanggal', 'nggak', 'mundur',
  'makanya', 'uang', 'dekat', 'jangan', 'dipaksa', 'volatilitas', 'jangka', 'panjang'], BATAS.s11);

const T = {
  panel: BATAS.s11 + 30, // bingkai panel Scene 10 membesar (isi Scene 10 keluar bersamaan, S10_KELUAR)
  // harga berjalan sampai "PASAR sedang turun" lalu anjlok · riak di titik terendah · "Terpaksa jual" di "terpaksa", berdenyut di "menjual"
  harga: [BATAS.s11 + 40, pasar], hitung: [tepat, uangnya, dipakai], garisTanggal: tepat - 10,
  anjlok: [pasar, turun + 30], riak: turun + 40, jual: terpaksa, denyutJual: menjual, denyutNilai: [mungkin, harga, ideal],
  // "PASAR mungkin butuh waktu untuk pulih" digambar pelan sepanjang kalimat · tanggal berdenyut di "tapi" & "nggak" · gembok · sentak di "mundur"
  pulih: [pasar2, tapi], denyutTanggal: [tapi, nggak], kunci: tanggal, goyang: mundur,
  kecil: makanya, judul: makanya + 10, batang1: uang, batang2: dekat - 20, selisih: jangan, sub: jangan, subSorot: dipaksa, denyutSelisih: [volatilitas, panjangW],
  // "jangan dipaksa menanggung VOLATILITAS investasi JANGKA PANJANG": grafik kecil berbingkai merah + tanda ✕
  bingkaiMerah: volatilitas, silang: jangka,
};

/* ── tata letak ── */
const AWAL = S10_PANEL; // panel pasar Scene 10 (1190, 340, 420 × 280)
const PANEL = { x: 290, y: 250, w: 1340, h: 580 };
const NILAI_100 = 500, PX_PER_PERSEN = 8; // Rp100 jt di y 500 · 1 % = 8 px
const TANGGAL_X = 1250;
/** harga berjalan (naik-turun kecil) lalu ANJLOK tepat di tanggal pembayaran */
const JALAN: [number, number][] = [[350, 500], [470, 462], [590, 520], [710, 470], [830, 535], [950, 488], [1070, 528], [1150, 500]];
const ANJLOK: [number, number][] = [[1150, 500], [1200, 600], [TANGGAL_X, 740]];
const PULIH: [number, number][] = [[TANGGAL_X, 740], [1340, 700], [1440, 610], [1590, 505]];
/** D: grafik mengecil ke kiri (skala 0,6, pusat panel → 560) · batang di kanan */
const KECIL = { s: 0.6, cx: 560, cy: 560 };
const BATANG = { x0: 1060, w: 640, y: [450, 650], tebal: 34 }; // jarak 200: pil nilai batang 1 tak menyentuh label selisih
const NILAI_PERLU = 100_000_000, NILAI_ADA = 70_000_000;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));
const panjang = (pts: [number, number][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
/** titik di polyline pada fraksi g + segmen sebagian (untuk menggambar) */
const sebagian = (pts: [number, number][], g: number) => {
  const L = panjang(pts) * g;
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

/** KELUAR Scene 11 = milik Scene 12 ("Yang terakhir …", bab baru): seluruh isi naik-pudar 40f mulai di batas, judul keluar */
export const S11_KELUAR = BATAS.s12 + 20;
export const Scene11: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s11 || f >= S11_KELUAR + 60) return null;
  const kelS11 = R(f, S11_KELUAR - 20, S11_KELUAR + 20, 0, 1, io);
  const pp = cin(f, T.panel);
  const px = lerp(AWAL.x, PANEL.x, pp), py = lerp(AWAL.y, PANEL.y, pp), pw = lerp(AWAL.w, PANEL.w, pp), ph = lerp(AWAL.h, PANEL.h, pp);
  const isi = R(f, T.panel + 10, T.panel + 40, 0, 1, io); // isi grafik muncul sesudah bingkai hampir penuh
  const gJalan = R(f, T.harga[0], T.harga[1], 0, 1);
  const gAnjlok = R(f, T.anjlok[0], T.anjlok[1], 0, 1, io);
  const gPulih = R(f, T.pulih[0], T.pulih[1], 0, 1); // linear: pemulihan merayap sepanjang kalimat (tanpa jendela diam di awal)
  const kepala: [number, number] = gAnjlok > 0 ? sebagian(ANJLOK, gAnjlok).slice(-1)[0] : sebagian(JALAN, gJalan).slice(-1)[0];
  const merah = cin(f, T.bingkaiMerah);
  const nilai = NILAI_PERLU * (1 + (NILAI_100 - kepala[1]) / PX_PER_PERSEN / 100);
  const k = cin(f, T.kecil);
  const skala = lerp(1, KECIL.s, k);
  const geserX = lerp(0, KECIL.cx - (PANEL.x + PANEL.w / 2) * KECIL.s - (PANEL.x + PANEL.w / 2) * (1 - KECIL.s), k);
  const geserY = lerp(0, KECIL.cy - (PANEL.y + PANEL.h / 2), k);
  const goyang = Math.sin(R(f, T.goyang - 6, T.goyang + 40, 0, 1) * Math.PI * 4) * 14 * R(f, T.goyang - 6, T.goyang + 40, 1, 0);
  const hitung = ['30 hari lagi', '7 hari lagi', 'Hari ini'];
  const iHitung = f >= T.hitung[2] ? 2 : f >= T.hitung[1] ? 1 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kelS11, transform: geser(0, -30 * kelS11) }}>
      {/* grafik (A–C), mengecil ke kiri di D */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${PANEL.x + PANEL.w / 2}px ${PANEL.y + PANEL.h / 2}px`,
        transform: `translate(${geserX}px, ${geserY}px) scale(${skala})` }}>
        <div style={{ position: 'absolute', left: px, top: py, width: pw, height: ph, borderRadius: 28, background: B.white, boxSizing: 'border-box',
          border: `${5 * merah}px solid ${rgba(ARAH.turun, merah)}`, boxShadow: `0 26px 52px -22px ${rgba(B.night, 0.28)}, 0 2px 8px ${rgba(B.night, 0.05)}` }} />
        {/* ✕ di pojok grafik: jangan paksa uang dekat menanggung volatilitas */}
        {(() => {
          const x = popIn(f, T.silang);
          if (x <= 0.001) return null;
          return <div style={{ position: 'absolute', left: PANEL.x + PANEL.w - 50, top: PANEL.y - 50, width: 100, height: 100, borderRadius: '50%', background: ARAH.turun,
            border: `6px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${x})`, color: B.white, fontFamily: F, fontSize: 64, fontWeight: 800,
            lineHeight: 1, boxShadow: `0 12px 28px -8px ${ARAH.turun}cc` }}>✕</div>;
        })()}
        {isi > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: isi }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              {/* garis acuan Rp100 jt */}
              <line x1={PANEL.x + 40} y1={NILAI_100} x2={PANEL.x + PANEL.w - 40} y2={NILAI_100} stroke={rgba(B.night, 0.1)} strokeWidth={2} strokeDasharray="6 10" />
              {/* garis tanggal pembayaran */}
              <line x1={TANGGAL_X + goyang} y1={PANEL.y + 96} x2={TANGGAL_X + goyang} y2={PANEL.y + PANEL.h - 30}
                stroke={B.orange} strokeWidth={3.5} strokeDasharray="8 10" opacity={R(f, T.garisTanggal - 30, T.garisTanggal + 30, 0, 1, io)} />
              {/* harga berjalan */}
              {gJalan > 0.001 ? <path d={poly(sebagian(JALAN, gJalan))} fill="none" stroke={B.night} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
              {/* anjlok merah */}
              {gAnjlok > 0.001 ? <path d={poly(sebagian(ANJLOK, gAnjlok))} fill="none" stroke={ARAH.turun} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
              {/* pemulihan SESUDAH tanggal (sudah terlambat): putus-putus pudar */}
              {gPulih > 0.001 ? <path d={poly(sebagian(PULIH, gPulih))} fill="none" stroke={B.gray} strokeWidth={5} strokeDasharray="10 12" strokeLinecap="round" opacity={0.75} /> : null}
            </svg>
            {/* riak anjlok di titik terendah */}
            {(() => {
              const r = R(f, T.riak - 30, T.riak + 30, 0, 1, io);
              if (r <= 0.001 || r >= 0.999) return null;
              return <div style={{ position: 'absolute', left: TANGGAL_X - 20 - 50 * r, top: 740 - 20 - 50 * r, width: 40 + 100 * r, height: 40 + 100 * r, borderRadius: '50%',
                border: `4px solid ${ARAH.turun}`, opacity: 1 - r }} />;
            })()}
            {/* kepala garis */}
            <div style={{ position: 'absolute', left: kepala[0] - 13, top: kepala[1] - 13, width: 26, height: 26, borderRadius: '50%', background: gAnjlok > 0.5 ? ARAH.turun : B.white,
              border: `5px solid ${gAnjlok > 0.5 ? B.white : B.night}`, boxSizing: 'border-box', boxShadow: gAnjlok > 0.5 ? `0 6px 16px -4px ${ARAH.turun}aa` : 'none' }} />
            {/* kartu tanggal pembayaran + hitung mundur (kalender ikon Simon) */}
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(TANGGAL_X + goyang, PANEL.y + 58)} translate(-50%, -50%)`, display: 'flex', alignItems: 'center', gap: 10,
              background: B.white, border: `2.5px solid ${B.orange}`, borderRadius: 999, padding: '10px 22px', fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night,
              whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -14px ${B.orange}aa` }}>
              <Icon name="kalender" size={30} color={B.orange} />
              Tanggal pembayaran ·&nbsp;<span style={{ color: iHitung === 2 ? ARAH.turun : B.orange, display: 'inline-block', minWidth: 150,
                transform: `scale(${1 + hitung.reduce((s, _, j) => s + denyut(f, T.hitung[j] + 6, 0.12), 0) + denyut(f, T.denyutTanggal[0], 0.1) + denyut(f, T.denyutTanggal[1], 0.1)})` }}>{hitung[iHitung]}</span>
            </div>
            {/* gembok: tanggal TETAP */}
            {(() => {
              const g = popIn(f, T.kunci) * (1 + denyut(f, T.goyang + 20, 0.12));
              if (g <= 0.001) return null;
              return (
                <div style={{ position: "absolute", left: TANGGAL_X + goyang + 305 - 30, top: PANEL.y + 58 - 30, width: 60, height: 60, borderRadius: '50%', background: B.orange,
                  border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${g})`, boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
                  <Icon name="kunci" size={30} color={B.white} />
                </div>);
            })()}
            {/* B: Jual di titik terendah */}
            {(() => {
              const p = popIn(f, T.jual) * (1 + denyut(f, T.denyutJual, 0.08));
              if (p <= 0.001) return null;
              return (
                <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(TANGGAL_X - 24, 790)} translate(-100%, -50%) scale(${p})`, transformOrigin: 'right center',
                  display: 'flex', alignItems: 'center', gap: 10, background: B.white, border: `2.5px solid ${CORET}`, borderRadius: 999, padding: '10px 24px', fontFamily: F,
                  fontSize: 28, fontWeight: 800, color: CORET, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -14px ${CORET}aa` }}>
                  <Icon name="jual" size={30} color={CORET} />
                  Terpaksa jual
                </div>);
            })()}
            {/* nilai investasi berjalan (kiri atas panel) */}
            <PilNominal x={PANEL.x + 50} y={PANEL.y + 58} jangkar="kiri" teks={rpPenuh(Math.round(nilai / 100_000) * 100_000)}
              arah={Math.max(-1, Math.min(1, (nilai - NILAI_PERLU) / 3_000_000))} p={popIn(f, T.harga[0] + 10) * (1 + T.denyutNilai.reduce((s, t) => s + denyut(f, t, 0.08), 0))}
              size={30} lebarMin={270} />
          </div>) : null}
      </div>

      {/* D: dana yang tersedia berkurang — dibutuhkan vs tersedia */}
      {[0, 1].map((i) => {
        const at = i === 0 ? T.batang1 : T.batang2;
        const p = popIn(f, at - 10);
        if (p <= 0.001) return null;
        const g = R(f, at - 20, at + 40, 0, 1, io);
        const col = i === 0 ? B.orange : B.turq;
        const nilaiB = i === 0 ? NILAI_PERLU : NILAI_ADA;
        const w = (BATANG.w * nilaiB) / NILAI_PERLU;
        const y = BATANG.y[i];
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: BATANG.x0, top: y - 58, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, opacity: Math.min(1, p) }}>
              {i === 0 ? 'Dibutuhkan (DP rumah)' : 'Tersedia setelah dijual'}</div>
            <div style={{ position: 'absolute', left: BATANG.x0, top: y - BATANG.tebal / 2, width: BATANG.w, height: BATANG.tebal, borderRadius: BATANG.tebal / 2, background: rgba(col, 0.13),
              opacity: Math.min(1, p) }} />
            <div style={{ position: 'absolute', left: BATANG.x0, top: y - BATANG.tebal / 2, width: w * g, height: BATANG.tebal, borderRadius: BATANG.tebal / 2, background: col,
              boxShadow: `0 8px 18px -8px ${col}aa` }} />
            <PilNominal x={BATANG.x0 + BATANG.w} y={y + 50} jangkar="kanan" teks={rpPenuh(nilaiB * g)} arah={i === 1 ? -g : 0} p={p} size={26} lebarMin={210} />
          </React.Fragment>);
      })}
      {/* selisih merah: −Rp30 jt */}
      {(() => {
        const g = R(f, T.selisih - 30, T.selisih + 30, 0, 1, io);
        if (g <= 0.001) return null;
        const x0 = BATANG.x0 + BATANG.w * 0.7, y = BATANG.y[1];
        const s = 1 + denyut(f, T.denyutSelisih[0], 0.06) + denyut(f, T.denyutSelisih[1], 0.06);
        return (
          <>
            <div style={{ position: 'absolute', left: x0, top: y - BATANG.tebal / 2, width: BATANG.w * 0.3 * g, height: BATANG.tebal, borderRadius: `0 ${BATANG.tebal / 2}px ${BATANG.tebal / 2}px 0`,
              background: `repeating-linear-gradient(135deg, ${ARAH.turun} 0 10px, ${mixHex(ARAH.turun, B.white, 0.35)} 10px 20px)`, transform: `scaleY(${s})` }} />
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x0 + BATANG.w * 0.15, y - 58)} translate(-50%, 0) scale(${popIn(f, T.selisih + 10)})`,
              fontFamily: F, fontSize: 30, fontWeight: 800, color: ARAH.turun, whiteSpace: 'nowrap' }}>−Rp30.000.000</div>
          </>);
      })()}

      </AbsoluteFill>
      <Judul f={f} kata={['Jangan', 'sampai', 'kebutuhan', 'dana']} at={T.judul} keluar={S11_KELUAR} />
      <Judul f={f} kata={['memaksa', 'kita', 'menjual']} sorotIdx={2} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S11_KELUAR} />
    </AbsoluteFill>);
};

export const S11_T = T;
