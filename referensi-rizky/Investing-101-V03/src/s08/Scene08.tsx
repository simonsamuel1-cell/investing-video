import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, CORET, F, R, WARNA, io, lerp, mixHex, rgba } from '../theme';
import { cin, Icon, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { JamBerjalan } from '../parts/jam';
import { PilNominal, rpPenuh } from '../parts/nominal';
import type { KunciIkon } from '../ikon';
import { S07_DOMPET_AKHIR, S07_JAM } from '../s07/Scene07';

/**
 * SCENE 08 — IDE VISUAL (13 Okt). Bab "02 — Uang Stabil". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Tanggal pembayaran tetap (PAYMENT DATE) · di bawahnya harga investasi bergerak ↑ ↓ ↓ ↑ ↓
 *   TEXT    "Tanggal kebutuhan kita" / "nggak menunggu [pasar]"
 * Empat ketukan (22,7 dtk):
 *   A  "Untuk uang seperti ini, target utamanya bukan mengejar return setinggi mungkin."
 *        dompet Uang Stabil (Scene 07) ke tengah · chip "Return setinggi mungkin" (trofi) muncul di "mengejar", dicoret MERAH di "mungkin" (pola Scene 05)
 *   B  "Yang lebih penting adalah: saat waktunya dipakai, uangnya masih ada."
 *        chip keluar · dompet ke kiri, kartu kalender "Tanggal pembayaran" di kanan · jalur ideal dompet → tanggal · saldo Rp25 jt ·
 *        uang berjalan ke tanggal, centang "masih ada"
 *   C  "Karena biaya sekolah, DP rumah, atau pengeluaran lain yang sudah terjadwal, nggak akan otomatis mundur"
 *        judul TEXT · tiga jadwal muncul di katanya (terhubung ke kartu) · "terjadwal": gembok di kartu + garis tanggal turun ke grafik
 *   D  "hanya karena pasar sedang turun."  (grafik mulai di "nggak akan …")
 *        jalur ideal memudar, harga investasi tergambar ↑ ↓ ↓ ↑ ↓ (segitiga hijau/merah) dan TIBA di garis tanggal saat TURUN; saldo dompet berjalan
 *        Rp25 jt → Rp22,7 jt ▼ · "mundur": kartu tanggal tersentak tapi TETAP (gembok) · sub-judul TEXT, sorot "pasar"
 */

const [uang, target, mengejar, ret, setinggi, mungkin, penting, saat, waktunya, dipakai, uangnya, masih, ada, karena, sekolah, rumah, pengeluaran,
  sudah, terjadwal, nggak, mundur, pasar, turun] = urut([
  'uang', 'target', 'mengejar', 'return', 'setinggi', 'mungkin', 'penting', 'saat', 'waktunya', 'dipakai', 'uangnya', 'masih', 'ada', 'karena', 'sekolah',
  'rumah', 'pengeluaran', 'sudah', 'terjadwal', 'nggak', 'mundur', 'pasar', 'turun'], BATAS.s8);

const T = {
  dompetA: uang + 15, // "UANG seperti ini": dompet Uang Stabil ke tengah (bersamaan isi Scene 07 keluar, S07_KELUAR)
  jamKeluar: BATAS.s8 + 30,
  target, // "TARGET utamanya": slot target kosong (putus-putus) di tempat chip
  chip: mengejar, denyutChip: [ret + 10, setinggi + 10], coret: mungkin + 20, chipKeluar: penting, denyutPenting: penting + 30, // "Yang lebih PENTING adalah": dompet berdenyut
  susunB: saat, kartu: waktunya + 10, jalur: dipakai, saldo: uangnya, uangJalan: masih + 10, centang: ada + 15,
  // tiap jadwal tersambung → tanggal di kartu berdenyut (+40)
  judul: karena + 20, jadwal: [sekolah, rumah, pengeluaran], kunci: terjadwal + 10, garisTanggal: sudah, // garis tanggal turun di "yang SUDAH terjadwal"
  grafik: [nggak - 10, turun + 10], idealPudar: nggak, goyang: mundur, sub: pasar - 20, subSorot: turun,
};

/* ── tata letak ── */
const AWAL = S07_DOMPET_AKHIR; // dompet Uang Stabil Scene 07 (240, 530, Ø180)
/** A: dompet + chip berpasangan di tengah */
const A = { dompet: [640, 560] as const, d: 200, chip: [1210, 560] as const };
/** B–D: dompet kiri di garis nilai (y 680) · kartu tanggal kanan atas (1560, 400) · garis tanggal x 1560 turun ke 880 · isi 220–890, mendatar 210–1730 */
const D = { dompet: [300, 680] as const, d: 180 };
const KARTU = { x: 1560, y: 400, w: 340, h: 360 };
const NILAI_Y = 680, TANGGAL_X = KARTU.x, TANGGAL_BAWAH = 880;
const LABEL_DY = 120, SALDO_DY = 180;
const SALDO_AWAL = 25_000_000;
/** harga investasi: ↑ ↓ ↓ ↑ ↓ (kolom VISUAL) — simpul garis, berakhir RENDAH tepat di garis tanggal */
const SIMPUL: [number, number][] = [[390, 680], [620, 545], [850, 625], [1080, 760], [1310, 670], [1560, 835]];
const PX_PER_PERSEN = 16.9; // 1 % perubahan nilai = 16,9 px
const JADWAL: { nama: string; ikon: KunciIkon; warna: string }[] = [
  { nama: 'Biaya sekolah', ikon: 'biayaSekolah', warna: WARNA.ungu },
  { nama: 'DP rumah', ikon: 'dpRumah', warna: B.orange },
  { nama: 'Pengeluaran lain', ikon: 'tagihan', warna: WARNA.langit },
];
const JADWAL_X = 960, JADWAL_Y = [270, 350, 430], JADWAL_W = 330; // kolom jadwal di tengah, di bawah judul (keseimbangan C–D)
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));

/* garis harga halus (Catmull-Rom → Bézier) + tabel panjang-busur: menggambar (dash) & posisi kepala garis */
type P = [number, number];
const RUAS: [P, P, P, P][] = SIMPUL.slice(0, -1).map((p1, i) => {
  const p0 = SIMPUL[Math.max(0, i - 1)], p2 = SIMPUL[i + 1], p3 = SIMPUL[Math.min(SIMPUL.length - 1, i + 2)];
  const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
  const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  return [p1, c1, c2, p2];
});
const bez = (r: [P, P, P, P], t: number): P => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * r[0][i] + 3 * u * u * t * r[1][i] + 3 * u * t * t * r[2][i] + t * t * t * r[3][i]) as P;
};
const N = 120;
const TITIK_GARIS: P[] = RUAS.flatMap((r, k) => Array.from({ length: N + (k === RUAS.length - 1 ? 1 : 0) }, (_, i) => bez(r, i / N)));
const KUMULATIF = TITIK_GARIS.reduce<number[]>((a, p, i) => [...a, i === 0 ? 0 : a[i - 1] + Math.hypot(p[0] - TITIK_GARIS[i - 1][0], p[1] - TITIK_GARIS[i - 1][1])], []);
const PANJANG = KUMULATIF[KUMULATIF.length - 1];
const D_GARIS = 'M ' + TITIK_GARIS.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ');
const kepalaGaris = (g: number): P => {
  const s = PANJANG * g;
  let i = 1;
  while (i < KUMULATIF.length - 1 && KUMULATIF[i] < s) i++;
  const t = (s - KUMULATIF[i - 1]) / Math.max(1e-6, KUMULATIF[i] - KUMULATIF[i - 1]);
  return [lerp(TITIK_GARIS[i - 1][0], TITIK_GARIS[i][0], t), lerp(TITIK_GARIS[i - 1][1], TITIK_GARIS[i][1], t)];
};
/** fraksi panjang di tiap simpul (untuk memunculkan segitiga ↑↓ saat kepala garis melewatinya) */
const FRAKSI_SIMPUL = SIMPUL.map((_, k) => KUMULATIF[Math.min(KUMULATIF.length - 1, k * N)] / PANJANG);

/** KELUAR Scene 08 = milik Scene 09 ("Karena itu, …"): kartu, jadwal, grafik & judul keluar 60f mulai di batas; dompet Uang Stabil
 *  (+ label & saldo) diambil alih Scene 09 (S08_DOMPET_AKHIR) */
export const S08_KELUAR = BATAS.s9 + 30;
export const S08_DOMPET_AKHIR = { x: D.dompet[0], y: D.dompet[1], d: D.d, labelY: D.dompet[1] + LABEL_DY, labelPx: S07_DOMPET_AKHIR.labelPx, saldoY: D.dompet[1] + SALDO_DY,
  warna: S07_DOMPET_AKHIR.warna };
export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s8 || f >= S08_KELUAR + 60) return null;
  const kel = cin(f, S08_KELUAR);
  const pk = (i: number) => popOut(f, S08_KELUAR - 12 + 8 * i);
  const milikS8 = f < BATAS.s9;
  const a = cin(f, T.dompetA), b = cin(f, T.susunB);
  // dompet: titik Scene 07 → A (tengah) → B (kiri, di garis nilai)
  const dx = lerp(lerp(AWAL.x, A.dompet[0], a), D.dompet[0], b), dy = lerp(lerp(AWAL.y, A.dompet[1], a), D.dompet[1], b);
  const dd = lerp(lerp(AWAL.d, A.d, a), D.d, b) * (1 + denyut(f, T.denyutPenting, 0.06));
  const grafik = R(f, T.grafik[0], T.grafik[1], 0, 1, io);
  const [hx, hy] = kepalaGaris(grafik);
  // saldo: Rp25 jt (B) → berjalan mengikuti harga di kepala garis (D)
  const saldo = SALDO_AWAL * (1 + (grafik > 0 ? (NILAI_Y - hy) / PX_PER_PERSEN / 100 : 0));
  const arah = Math.max(-1, Math.min(1, (saldo - SALDO_AWAL) / 1_000_000));
  const ideal = 1 - cin(f, T.idealPudar);
  const goyang = Math.sin(R(f, T.goyang - 6, T.goyang + 40, 0, 1) * Math.PI * 4) * 16 * R(f, T.goyang - 6, T.goyang + 40, 1, 0);
  const kartuP = popIn(f, T.kartu) * pk(1) * (1 + denyut(f, T.goyang + 30, 0.04) + T.jadwal.reduce((s, t) => s + denyut(f, t + 40, 0.04), 0));
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - kel }}>
        {/* B: jalur ideal (dompet → tanggal) — memudar saat harga mulai bergerak */}
        {(() => {
          const g = R(f, T.jalur - 30, T.jalur + 30, 0, 1, io);
          if (g <= 0.001 || ideal <= 0.001) return null;
          const x0 = D.dompet[0] + D.d / 2 + 14, x1 = lerp(x0, TANGGAL_X - 40, g);
          return (
            <g opacity={ideal}>
              <line x1={x0} y1={NILAI_Y} x2={x1} y2={NILAI_Y} stroke={B.turq} strokeWidth={4} strokeDasharray="10 12" strokeLinecap="round" />
              {g > 0.85 ? <path d={`M ${x1 + 14} ${NILAI_Y} l -20 -13 l 0 26 z`} fill={B.turq} opacity={R(g, 0.85, 1, 0, 1)} /> : null}
            </g>);
        })()}
        {/* C: garis tanggal (kartu → bawah grafik) */}
        {(() => {
          const g = R(f, T.garisTanggal - 30, T.garisTanggal + 30, 0, 1, io);
          if (g <= 0.001) return null;
          const y0 = KARTU.y + KARTU.h / 2 + 6;
          return <line x1={TANGGAL_X + goyang} y1={y0} x2={TANGGAL_X + goyang} y2={lerp(y0, TANGGAL_BAWAH, g)} stroke={B.turq} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />;
        })()}
        {/* D: harga investasi bergerak ↑ ↓ ↓ ↑ ↓ */}
        {grafik > 0.001 ? (
          <path d={D_GARIS} fill="none" stroke={B.night} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={`${PANJANG} ${PANJANG + 20}`} strokeDashoffset={PANJANG * (1 - grafik)} />) : null}
        {/* penghubung jadwal → kartu */}
        {JADWAL.map((j, i) => {
          const g = R(f, T.jadwal[i], T.jadwal[i] + 30, 0, 1, io);
          if (g <= 0.001) return null;
          const x0 = JADWAL_X + JADWAL_W / 2 + 10, x1 = lerp(x0, KARTU.x - KARTU.w / 2 - 10 + goyang, g);
          return <line key={j.nama} x1={x0} y1={JADWAL_Y[i]} x2={x1} y2={JADWAL_Y[i]} stroke={j.warna} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />;
        })}
      </svg>

      {/* segitiga ↑/↓ di tengah tiap gerakan harga (hijau naik · merah turun) */}
      {SIMPUL.slice(1).map((p, k) => {
        const p0 = SIMPUL[k];
        const naik = p[1] < p0[1];
        const muncul = R(grafik, (FRAKSI_SIMPUL[k] + FRAKSI_SIMPUL[k + 1]) / 2, (FRAKSI_SIMPUL[k] + FRAKSI_SIMPUL[k + 1]) / 2 + 0.06, 0, 1);
        if (muncul <= 0.001) return null;
        const mx = (p0[0] + p[0]) / 2, my = (p0[1] + p[1]) / 2 + (naik ? -46 : 46);
        const col = naik ? ARAH.naik : ARAH.turun;
        return (
          <svg key={k} width={30} height={26} viewBox="0 0 22 18" style={{ position: 'absolute', left: mx - 15, top: my - 13, transform: `scale(${popInLin(muncul)})`, overflow: 'visible', opacity: 1 - kel }}>
            <path d={naik ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} />
          </svg>);
      })}
      {/* kepala garis */}
      {grafik > 0.001 && grafik < 1 ? <div style={{ position: 'absolute', left: hx - 11, top: hy - 11, width: 22, height: 22, borderRadius: '50%', background: B.white,
        border: `5px solid ${B.night}`, boxSizing: 'border-box' }} /> : null}
      {grafik >= 1 ? <div style={{ position: 'absolute', left: hx - 16, top: hy - 16, width: 32, height: 32, borderRadius: '50%', background: ARAH.turun,
        border: `5px solid ${B.white}`, boxSizing: 'border-box', transform: `scale(${popInLin(R(f, T.grafik[1], T.grafik[1] + 30, 0, 1)) * pk(2)})`, boxShadow: `0 6px 16px -4px ${ARAH.turun}aa` }} /> : null}

      {/* B: uang berjalan di jalur ideal, tiba di tanggal → centang "masih ada" */}
      {(() => {
        const g = R(f, T.uangJalan - 30, T.uangJalan + 30, 0, 1, io);
        if (g <= 0.001 || g >= 0.999) return null;
        const W = 84, H = W / (520 / 441);
        const x = lerp(D.dompet[0] + D.d / 2, TANGGAL_X - 40, g);
        return <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0) * ideal, transform: geser(x - W / 2, NILAI_Y - H / 2 - 30) }} />;
      })()}
      {(() => {
        const c = popIn(f, T.centang) * ideal;
        if (c <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: TANGGAL_X - 34, top: NILAI_Y - 34, width: 68, height: 68, borderRadius: '50%', background: B.turq, border: `4px solid ${B.white}`,
            display: 'grid', placeItems: 'center', transform: `scale(${c})`, boxShadow: `0 10px 24px -8px ${B.turq}cc` }}>
            <Icon name="tersedia" size={38} color={B.white} />
          </div>);
      })()}

      {/* A: chip "Target utama" (pekat, bukan slot putus-putus kosong — Simon 13 Okt) di "target" → berganti chip "Return setinggi mungkin" di "mengejar" */}
      {(() => {
        const p = popIn(f, T.target) * popOut(f, T.chip - 6);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(A.chip[0], A.chip[1])} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center',
            gap: 12, background: B.white, border: `2.5px solid ${B.turq}`, borderRadius: 999, padding: '14px 32px', fontFamily: F, fontSize: 36, fontWeight: 700,
            color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -14px ${B.turq}aa` }}>
            <Icon name="targetUtama" size={38} color={B.turq} />
            Target utama
          </div>);
      })()}
      {/* A: chip "Return setinggi mungkin" dicoret merah */}
      {(() => {
        const p = popIn(f, T.chip) * popOut(f, T.chipKeluar) * (1 + denyut(f, T.denyutChip[0], 0.05) + denyut(f, T.denyutChip[1], 0.05));
        if (p <= 0.001) return null;
        const c = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
        const warna = mixHex(B.orange, CORET, c);
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(A.chip[0], A.chip[1])} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center',
            gap: 12, background: B.white, border: `2.5px solid ${warna}`, borderRadius: 999, padding: '14px 32px', fontFamily: F, fontSize: 36, fontWeight: 700,
            color: c > 0.5 ? CORET : B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -14px ${warna}aa` }}>
            <Icon name="trofi" size={38} color={warna} />
            Return setinggi mungkin
            {c > 0.001 ? <div style={{ position: 'absolute', left: 16, top: '50%', height: 5, width: `calc(${c} * (100% - 32px))`, background: CORET, borderRadius: 3,
              transform: 'translateY(-50%)' }} /> : null}
          </div>);
      })()}

      {/* C: jadwal pembayaran (sama lebar, rata kiri) */}
      {JADWAL.map((j, i) => {
        const p = popIn(f, T.jadwal[i]) * pk(0);
        if (p <= 0.001) return null;
        return (
          <div key={j.nama} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(JADWAL_X, JADWAL_Y[i])} translate(-50%, -50%) scale(${p})`, width: JADWAL_W,
            boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, background: B.white, border: `2.5px solid ${j.warna}`, borderRadius: 999,
            padding: '11px 24px', fontFamily: F, fontSize: 28, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -14px ${j.warna}aa` }}>
            <Icon name={j.ikon} size={30} color={j.warna} />
            {j.nama}
          </div>);
      })}

      {/* KARTU "Tanggal pembayaran" (kalender, tanggal dilingkari) — gembok di "terjadwal", tersentak tapi tetap di "mundur" */}
      {kartuP > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(KARTU.x + goyang, KARTU.y)} scale(${kartuP})` }}>
          <div style={{ position: 'absolute', left: -KARTU.w / 2, top: -KARTU.h / 2, width: KARTU.w, height: KARTU.h, borderRadius: 22, background: B.white, overflow: 'hidden',
            boxShadow: `0 22px 44px -18px ${rgba(B.night, 0.3)}, 0 2px 8px ${rgba(B.night, 0.06)}` }}>
            <div style={{ height: 64, background: B.turq, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontSize: 26, fontWeight: 800,
              color: B.white }}>Tanggal pembayaran</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 8, padding: '18px 18px 0', fontFamily: F, fontSize: 20, fontWeight: 700,
              color: B.grayLite, textAlign: 'center' }}>
              {Array.from({ length: 35 }, (_, i) => {
                const n = i - 1; // bulan mulai hari Selasa
                const hari = n >= 1 && n <= 31 ? n : null;
                const ini = hari === 15;
                return (
                  <div key={i} style={{ height: 38, display: 'grid', placeItems: 'center' }}>
                    {hari ? <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', background: ini ? B.turq : 'transparent',
                      color: ini ? B.white : hari % 7 === 0 ? B.gray : B.grayLite, fontWeight: ini ? 800 : 700, fontSize: ini ? 22 : 20 }}>{hari}</div> : null}
                  </div>);
              })}
            </div>
          </div>
          {/* gembok: tanggalnya TETAP */}
          {(() => {
            const k = popIn(f, T.kunci) * (1 + denyut(f, T.goyang + 20, 0.12));
            if (k <= 0.001) return null;
            return (
              <div style={{ position: 'absolute', left: KARTU.w / 2 - 38, top: -KARTU.h / 2 - 30, width: 72, height: 72, borderRadius: '50%', background: B.orange,
                border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${k})`, boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
                <Icon name="kunci" size={36} color={B.white} />
              </div>);
          })()}
        </div>) : null}

      {/* dompet Uang Stabil (dari Scene 07) + label + saldo — diambil alih Scene 09 di batas */}
      {milikS8 ? <>
      <div style={{ position: 'absolute', left: dx - dd / 2, top: dy - dd / 2, width: dd, height: dd, borderRadius: '50%', background: AWAL.warna, display: 'grid', placeItems: 'center',
        boxShadow: `0 18px 40px -12px ${AWAL.warna}aa` }}>
        <Icon name="dompet" size={dd * 0.52} color={B.white} />
      </div>
      {(() => {
        const j = popOut(f, T.jamKeluar);
        if (j <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: dx + dd * 0.36 - 36, top: dy - dd * 0.36 - 36, width: 72, height: 72, borderRadius: '50%', background: B.orange,
            border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${j})`, boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
            <JamBerjalan size={40} color={B.white} latar={B.orange} menit={60 * R(f, S07_JAM, S07_JAM + 70, 0, 1, io)} />
          </div>);
      })()}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(dx, lerp(lerp(AWAL.labelY, A.dompet[1] + LABEL_DY, a), D.dompet[1] + LABEL_DY, b)), translate: '-50% -50%',
        display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: AWAL.warna }} />
        <span style={{ fontFamily: F, fontSize: AWAL.labelPx, fontWeight: 800, color: B.night }}>Uang Stabil</span>
      </div>
      <PilNominal x={dx} y={dy + SALDO_DY} teks={rpPenuh(Math.round(saldo / 50_000) * 50_000)} arah={arah} p={popIn(f, T.saldo)} size={28} lebarMin={250} />
      </> : null}

      <Judul f={f} kata={['Tanggal', 'kebutuhan', 'kita']} at={T.judul} keluar={S08_KELUAR} />
      <Judul f={f} kata={['nggak', 'menunggu', 'pasar']} sorotIdx={2} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S08_KELUAR} />
    </AbsoluteFill>);
};

/** pop berbasis kemajuan 0…1 (easeOutBack) */
const popInLin = (p: number) => {
  const c1 = 1.70158, c3 = c1 + 1, t = Math.max(0, Math.min(1, p));
  return t <= 0 ? 0 : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const S08_T = T;

/** saldo & arah di akhir Scene 08 (harga tiba RENDAH di tanggal) — Scene 09 memulai pil saldo dari nilai ini */
export const S08_SALDO_AKHIR = SALDO_AWAL * (1 + (NILAI_Y - SIMPUL[SIMPUL.length - 1][1]) / PX_PER_PERSEN / 100);
