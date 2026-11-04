import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, WARNA, io, lerp, rgba } from '../theme';
import { cin, Icon, popOut, popScale, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { JamBerjalan } from '../parts/jam';
import type { KunciIkon } from '../ikon';
import { DanaDaruratBulat, S06_DD_DY, S06_WADAH_AKHIR, WadahUangAktif } from '../s06/Scene06';

/**
 * SCENE 07 — IDE VISUAL (13 Okt). Bab "02 — Uang Stabil". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Timeline: Sekarang → 1 Tahun: Biaya Sekolah → 2 Tahun: Ganti Kendaraan → 3 Tahun: DP Rumah
 *   TEXT    "② Uang Stabil" / "1–3 tahun · Tujuannya sudah [jelas]"
 *   Simon 13 Okt (acuan 2 gambar roadmap): "buat scene 7 seperti referensi ini (roadmap untuk menggambarkan tujuan). jadi ada titik awal dan titik akhirnya"
 *   → JALAN berkelok berwarna per ruas (pola acuan ke-2), titik di jalan bercincin, tujuan di atas jalan + penghubung putus-putus ke titiknya;
 *     TITIK AWAL = pin lokasi "Sekarang" (dompet Uang Stabil), TITIK AKHIR = bendera finis "3 Tahun".
 * Empat ketukan (21,7 dtk):
 *   A  "Yang kedua adalah uang stabil."
 *        wadah Uang aktif (Scene 06) mengecil kembali jadi dompet Uang Aktif — pelampung dana darurat IKUT mengecil di dalamnya (Simon: "kok kosongan
 *        ini?" → wadah tak pernah kosong) → deret tiga dompet (pola peta bab Scene 03/04) · Uang Stabil masuk, disorot di "uang" · judul TEXT ②
 *   B  "Uangnya memang belum dibutuhkan sekarang, tapi dalam satu sampai tiga tahun ke depan,"
 *        dompet lain turun & pudar, Uang Stabil ke titik awal · lencana jam ("belum dibutuhkan") · pin awal "Sekarang" ·
 *        jalan tergambar ruas demi ruas, titik 1 / 2 / 3 Tahun (bendera finis) muncul di katanya · "tahun ke depan": titik berdenyut bergiliran
 *   C  "kita sudah tahu akan dipakai untuk apa."
 *        sub-judul TEXT · titik 1/2/3 Tahun berdenyut bergiliran di "tahu" & "dipakai" · sorot "jelas" di "apa" (slot "?" & garis kosong DIHAPUS, Simon 13 Okt)
 *   D  "Misalnya biaya sekolah tahun depan, ganti kendaraan dua tahun lagi, atau mau DP rumah tiga tahun lagi."
 *        Biaya sekolah / Ganti kendaraan / DP rumah muncul di katanya + penghubung ke titiknya · uang BERJALAN DI JALAN dari titik awal ke titik tujuannya, tujuan berdenyut
 */

const [kedua, uang, stabil, uangnya, belum, sekarang, tapi, satu, sampai, tiga, tahun, kita, tahu, dipakai, apa, misalnya, sekolah, tahun2, ganti,
  dua, atau, mau, tiga2] = urut([
  'kedua', 'uang', 'stabil', 'uangnya', 'belum', 'sekarang', 'tapi', 'satu', 'sampai', 'tiga', 'tahun', 'kita', 'tahu', 'dipakai', 'apa', 'misalnya',
  'sekolah', 'tahun', 'ganti', 'dua', 'atau', 'mau', 'tiga'], BATAS.s7);

const T = {
  wadah: BATAS.s7 + 35, // wadah Uang aktif (berisi pelampung) → dompet (bersamaan isi Scene 06 lain keluar, S06_KELUAR)
  // deret: Uang Aktif (dari wadah) · Uang Stabil · Uang Jangka Panjang — Uang Stabil masuk SESUDAH wadah menjauh dari kolom tengah (tanpa tumpang tindih)
  masuk: [BATAS.s7 + 35, kedua + 57, kedua + 73],
  sorot: uang + 10, judul: stabil,
  pindah: uangnya + 10, jam: belum + 10, sekarang,
  // jalan tergambar ruas demi ruas: ruas k selesai tepat saat titik k+1 muncul di katanya ("satu" · "sampai" · "tiga")
  jalan: [tapi - 10, satu + 5, sampai + 15, tiga + 5], titik: [satu + 5, sampai + 15, tiga + 5], denyutTitik: tahun,
  sub: kita, subSorot: apa, slot: [tahu, tahu + 15, tahu + 30], penghubung: dipakai,
  denyutDompet: misalnya, tujuan: [sekolah, ganti + 20, mau + 10], jalanUang: [tahun2 + 4, dua + 8, tiga2 + 6], denyutSlot3: atau,
};

/* ── tata letak ── */
const AWAL = S06_WADAH_AKHIR; // wadah Uang aktif Scene 06 (760, 520, Ø360)
/** A: deret tiga dompet = tata letak Scene 03 (kolom 400 · 960 · 1520, Ø200, label 160 px di bawah) */
const DERET = { x: [400, 960, 1520], y: 410, d: 200, labelDy: 160 };
const WARNA_DOMPET = [B.blue, B.turq, B.orange];
const NAMA = ['Uang Aktif', 'Uang Stabil', 'Uang Jangka Panjang'];

/**
 * B–D: JALAN = tiga ruas Bézier kubik bergelombang S(240,800) → 1 Tahun(720,560) → 2 Tahun(1200,800) → 3 Tahun(1680,600), garis singgung datar di
 * tiap titik (lengkung halus seperti acuan). Tujuan di atas titiknya, penghubung putus-putus turun ke titik; label tahun di bawah jalan.
 * Isi 210–875 berpusat ±545 (judul 64–175, subtitle mulai 994); mendatar 150–1765 berpusat ±960.
 */
type P = [number, number];
const TITIK: P[] = [[240, 800], [720, 560], [1200, 800], [1680, 600]];
const RUAS: [P, P, P, P][] = [0, 1, 2].map((k) => {
  const a = TITIK[k], b = TITIK[k + 1], m = (a[0] + b[0]) / 2;
  return [a, [m, a[1]], [m, b[1]], b];
});
const bez = (r: [P, P, P, P], t: number): P => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * r[0][i] + 3 * u * u * t * r[1][i] + 3 * u * t * t * r[2][i] + t * t * t * r[3][i]) as P;
};
/** tabel panjang-busur tiap ruas (sampel 240) — untuk menggambar jalan (dash) dan menjalankan uang di atasnya dengan kecepatan rata */
const SAMPEL = 240;
const TABEL = RUAS.map((r) => {
  const tab: number[] = [0];
  let p = bez(r, 0);
  for (let i = 1; i <= SAMPEL; i++) { const q = bez(r, i / SAMPEL); tab.push(tab[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])); p = q; }
  return tab;
});
const PANJANG = TABEL.map((t) => t[SAMPEL]);
const diJalan = (s: number): P => {
  let k = 0;
  while (k < 2 && s > PANJANG[k]) { s -= PANJANG[k]; k++; }
  s = Math.max(0, Math.min(PANJANG[k], s));
  const tab = TABEL[k];
  let i = 1;
  while (i < SAMPEL && tab[i] < s) i++;
  const t = (i - 1 + (s - tab[i - 1]) / Math.max(1e-6, tab[i] - tab[i - 1])) / SAMPEL;
  return bez(RUAS[k], t);
};
const dRuas = (r: [P, P, P, P]) => `M ${r[0][0]} ${r[0][1]} C ${r[1][0]} ${r[1][1]} ${r[2][0]} ${r[2][1]} ${r[3][0]} ${r[3][1]}`;
const JALAN_W = 44;
/** warna ruas = warna tujuan yang dituju ruas itu (pola acuan: jalan berganti warna per tahap) */
const TUJUAN: { nama: string; tahun: string; ikon: KunciIkon; warna: string; pos: P }[] = [
  { nama: 'Biaya sekolah', tahun: '1 Tahun', ikon: 'biayaSekolah', warna: WARNA.ungu, pos: [720, 300] },
  { nama: 'Ganti kendaraan', tahun: '2 Tahun', ikon: 'gantiKendaraan', warna: WARNA.langit, pos: [1200, 520] },
  { nama: 'DP rumah', tahun: '3 Tahun', ikon: 'dpRumah', warna: B.orange, pos: [1680, 330] },
];
const AWAL_POS: P = [240, 530]; // dompet Uang Stabil di atas titik awal
const D_DOMPET = 180, D_TUJUAN = 170, LABEL_DY = 120, TAHUN_DY = 64; // label nama 120 px di bawah pusat lingkaran · label tahun 64 px di bawah jalan (≥19 px dari tepi jalan)
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));

/** KELUAR Scene 07 = milik Scene 08 ("Untuk uang seperti ini …"): jalan, titik, tujuan, label & judul keluar 60f mulai di batas;
 *  dompet Uang Stabil (+ label & lencana jam) diambil alih Scene 08 (titik & rupa sama, S07_DOMPET_AKHIR) */
export const S07_KELUAR = BATAS.s8 + 30;
export const S07_DOMPET_AKHIR = { x: AWAL_POS[0], y: AWAL_POS[1], d: D_DOMPET, labelY: AWAL_POS[1] + LABEL_DY, labelPx: 34, warna: B.turq };
export const S07_JAM = T.jam; // lencana jam: menit berjalan dihitung dari waktu yang sama di Scene 08
export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s7 || f >= S07_KELUAR + 60) return null;
  const kel = cin(f, S07_KELUAR);
  const pk = (i: number) => popOut(f, S07_KELUAR - 12 + 6 * i); // pop keluar berjenjang kiri → kanan
  const milikS7 = f < BATAS.s8;
  const sorot = cin(f, T.sorot), pindah = cin(f, T.pindah);
  // kemajuan tiap ruas: linear di dalam ruas (kecepatan menyambung), ruas pertama mulai halus, ruas terakhir berhenti halus
  const ruasG = [0, 1, 2].map((k) => {
    const g = R(f, T.jalan[k], T.jalan[k + 1], 0, 1);
    return k === 0 ? 1 - Math.cos((g * Math.PI) / 2) : k === 2 ? Math.sin((g * Math.PI) / 2) : g; // sinus masuk · linear · sinus keluar
  });
  return (
    <AbsoluteFill>
      {/* ── JALAN (B–D): bayang + tiga ruas berwarna + marka tengah ── */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - kel }}>
        {RUAS.map((r, k) => ruasG[k] > 0.001 ? (
          <path key={`b${k}`} d={dRuas(r)} fill="none" stroke={rgba(B.night, 0.07)} strokeWidth={JALAN_W} strokeLinecap="round" transform="translate(0 12)"
            strokeDasharray={`${PANJANG[k]} ${PANJANG[k] + 60}`} strokeDashoffset={PANJANG[k] * (1 - ruasG[k])} />) : null)}
        {RUAS.map((r, k) => ruasG[k] > 0.001 ? (
          <path key={`r${k}`} d={dRuas(r)} fill="none" stroke={TUJUAN[k].warna} strokeWidth={JALAN_W} strokeLinecap={k === 0 || k === 2 ? 'round' : 'butt'}
            strokeDasharray={`${PANJANG[k]} ${PANJANG[k] + 60}`} strokeDashoffset={PANJANG[k] * (1 - ruasG[k])} />) : null)}
        {RUAS.map((r, k) => ruasG[k] >= 0.999 ? (
          <path key={`m${k}`} d={dRuas(r)} fill="none" stroke={rgba(B.white, 0.55)} strokeWidth={3} strokeDasharray="14 16"
            opacity={R(f, (k === 0 ? T.titik[0] : T.titik[k]), (k === 0 ? T.titik[0] : T.titik[k]) + 20, 0, 1)} />) : null)}
        {/* penghubung putus-putus: label → titik jalan (dompet: di "sekarang"; tujuan: di "dipakai") */}
        {[0, 1, 2, 3].map((i) => {
          const g = i === 0 ? R(f, T.sekarang - 30, T.sekarang + 30, 0, 1, io) : R(f, T.tujuan[i - 1] - 10, T.tujuan[i - 1] + 50, 0, 1, io);
          if (g <= 0.001) return null;
          const atas = i === 0 ? AWAL_POS : TUJUAN[i - 1].pos;
          const y0 = atas[1] + LABEL_DY + 26, y1 = lerp(y0, TITIK[i][1] - (i === 0 || i === 3 ? 40 : 24), g);
          const col = i === 0 ? B.turq : TUJUAN[i - 1].warna;
          return <line key={i} x1={TITIK[i][0]} y1={y0} x2={TITIK[i][0]} y2={y1} stroke={col} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />;
        })}
      </svg>

      {/* uang BERJALAN di jalan dari titik awal ke titik tujuannya ("… tahun depan", "dua tahun lagi", "tiga tahun lagi") */}
      {TUJUAN.map((t, i) => {
        const g = R(f, T.jalanUang[i] - 40, T.jalanUang[i] + 40, 0, 1, io);
        if (g <= 0.001 || g >= 0.999) return null;
        const total = PANJANG.slice(0, i + 1).reduce((a, b) => a + b, 0);
        const [x, y] = diJalan(total * g);
        const W = 84, H = W / (520 / 441);
        return <Img key={t.nama} src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2 - 4) }} />;
      })}

      {/* titik di jalan: AWAL (pin lokasi, "Sekarang") · 1 / 2 Tahun (cincin) · AKHIR (bendera finis, 3 Tahun) */}
      {['Sekarang', ...TUJUAN.map((t) => t.tahun)].map((nama, i) => {
        const at = i === 0 ? T.sekarang : T.titik[i - 1];
        const p = popIn(f, at) * pk(i) * (1 + (i > 0 ? denyut(f, T.denyutTitik + 14 * (i - 1), 0.18) : 0) + (i > 0 ? denyut(f, T.jalanUang[i - 1] + 40, 0.15) : 0)
          + (i > 0 ? denyut(f, T.slot[i - 1], 0.18) + denyut(f, T.penghubung + 12 * (i - 1), 0.14) + (i === 3 ? denyut(f, T.denyutSlot3, 0.14) : 0) : 0));
        if (p <= 0.001) return null;
        const ujung = i === 0 || i === 3;
        const col = i === 0 ? B.turq : TUJUAN[i - 1].warna;
        const d = ujung ? 64 : 34;
        const [x, y] = TITIK[i];
        return (
          <React.Fragment key={nama}>
            <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: B.white, boxSizing: 'border-box',
              border: `${ujung ? 6 : 7}px solid ${col}`, display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 8px 18px -6px ${rgba(B.night, 0.25)}` }}>
              {ujung ? <Icon name={i === 0 ? 'titikAwal' : 'titikAkhir'} size={30} color={col} /> : null}
            </div>
            <div style={{ position: 'absolute', left: x - 120, width: 240, top: y + TAHUN_DY - 18, textAlign: 'center', whiteSpace: 'nowrap', opacity: 1 - kel }}>
              <WordText halus f={f} at={at + 6} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: col }}>{nama}</WordText>
            </div>
          </React.Fragment>);
      })}

      {/* tujuan (D) di atas titiknya — TANPA slot "?" kosong (Simon 13 Okt: "hapus saja lingkaran dan garis putus-putus kosong ini") */}
      {TUJUAN.map((t, i) => {
        const [x, y] = t.pos;
        const isi = popIn(f, T.tujuan[i]) * pk(i + 1);
        return (
          <React.Fragment key={t.nama}>
            {isi > 0.001 ? (
              <div style={{ position: 'absolute', left: x - D_TUJUAN / 2, top: y - D_TUJUAN / 2, width: D_TUJUAN, height: D_TUJUAN, borderRadius: '50%',
                background: t.warna, display: 'grid', placeItems: 'center', transform: `scale(${isi * (1 + denyut(f, T.jalanUang[i] + 44, 0.06))})`,
                boxShadow: `0 16px 34px -12px ${t.warna}aa` }}>
                <Icon name={t.ikon} size={D_TUJUAN * 0.5} color={B.white} />
              </div>) : null}
            {f >= T.tujuan[i] - 22 ? (
              <div style={{ position: 'absolute', left: x - 170, width: 340, top: y + LABEL_DY - 20, textAlign: 'center', whiteSpace: 'nowrap', opacity: 1 - kel }}>
                <WordText halus f={f} at={T.tujuan[i] + 8} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>{t.nama}</WordText>
              </div>) : null}
          </React.Fragment>);
      })}

      {/* ── deret tiga dompet (A) → Uang Stabil ke titik awal (B) ── */}
      {[0, 1, 2].map((k) => {
        if (k === 1 && !milikS7) return null; // dompet Uang Stabil: Scene 08 mengambil alih di batas
        const masuk = popIn(f, T.masuk[k]);
        const turun = k === 1 ? 0 : cin(f, T.pindah + 6 * (k === 0 ? 0 : 1));
        const redup = k === 1 ? 0 : 0.45 * sorot;
        if (turun >= 0.999) return null;
        // Uang Stabil: disorot (membesar 1,12) lalu pindah ke atas titik awal (Ø180)
        const x = k === 1 ? lerp(DERET.x[1], AWAL_POS[0], pindah) : DERET.x[k];
        const y = k === 1 ? lerp(DERET.y, AWAL_POS[1], pindah) : DERET.y + 220 * turun;
        const dd = k === 1 ? lerp(DERET.d * (1 + 0.12 * sorot), D_DOMPET, pindah) * (1 + denyut(f, T.denyutDompet, 0.05)) : DERET.d;
        const labelY = k === 1 ? lerp(DERET.y + DERET.labelDy, AWAL_POS[1] + LABEL_DY, pindah) : DERET.y + DERET.labelDy + 220 * turun;
        const alfa = (1 - redup) * (1 - turun);
        const ring = k === 1 ? sorot * (1 - pindah) : 0;
        const jam = k === 1 ? popIn(f, T.jam) : 0;
        return (
          <div key={NAMA[k]} style={{ position: 'absolute', inset: 0, opacity: alfa }}>
            {k === 0 ? (
              // Uang Aktif = wadah Scene 06 yang mengecil kembali jadi dompet; pelampung dana darurat ikut mengecil di dalamnya lalu memudar
              (() => {
                const w = 1 - cin(f, T.wadah);
                const wx = lerp(DERET.x[0], AWAL.x, w), wy = lerp(DERET.y, AWAL.y, w) + 220 * turun, wd = lerp(DERET.d, AWAL.d, w);
                return (
                  <>
                    {/* Simon "kok kosongan ini?": wadah TIDAK PERNAH kosong — kepala (ikon + teks) pudar dulu (w 1 → 0,6), pelampung mengecil di tengah
                        (w 0,8 → 0,45) TEPAT saat ikon dompet putih muncul di tengah (w 0,55 → 0,1, pop) */}
                    <WadahUangAktif x={wx} y={wy} d={wd} w={w} kepala={1} ikonAlfa={R(w, 0.6, 0.9, 0, 1)}
                      teks={w > 0.6 ? <span style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: AWAL.warna, opacity: R(w, 0.6, 0.9, 0, 1) }}>Uang aktif</span> : null} />
                    <DanaDaruratBulat x={wx} y={wy + S06_DD_DY * w} s={(wd / AWAL.d) * io(R(w, 0.45, 0.8, 0, 1))} centang={1} />
                    {(() => {
                      const p = R(w, 0.1, 0.55, 1, 0);
                      if (p <= 0.001) return null;
                      const s = wd * 0.52 * popScale(p);
                      return <div style={{ position: 'absolute', left: wx - s / 2, top: wy - s / 2, width: s, height: s }}><Icon name="dompet" size={s} color={B.white} /></div>;
                    })()}
                  </>);
              })()
            ) : masuk > 0.001 ? (
              <div style={{ position: 'absolute', left: x - dd / 2, top: y - dd / 2, width: dd, height: dd, borderRadius: '50%', background: WARNA_DOMPET[k], display: 'grid',
                placeItems: 'center', transform: `scale(${masuk})`, boxShadow: `0 18px 40px -12px ${WARNA_DOMPET[k]}aa` }}>
                <Icon name="dompet" size={dd * 0.52} color={B.white} />
              </div>) : null}
            {ring > 0.001 ? <div style={{ position: 'absolute', left: x - dd / 2 - 16, top: y - dd / 2 - 16, width: dd + 32, height: dd + 32, borderRadius: '50%',
              border: `3px solid ${WARNA_DOMPET[1]}`, opacity: ring, boxShadow: `0 0 36px 4px ${WARNA_DOMPET[1]}55` }} /> : null}
            {/* "belum dibutuhkan sekarang": lencana jam (jarum bergerak terpisah) */}
            {jam > 0.001 ? (
              <div style={{ position: 'absolute', left: x + dd * 0.36 - 36, top: y - dd * 0.36 - 36, width: 72, height: 72, borderRadius: '50%', background: B.orange,
                border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${jam})`, boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
                <JamBerjalan size={40} color={B.white} latar={B.orange} menit={60 * R(f, T.jam, T.jam + 70, 0, 1, io)} />
              </div>) : null}
            {/* label (titik warna + nama), gaya Scene 03 */}
            {f >= T.masuk[k] - 30 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(k === 1 ? x : DERET.x[k], labelY), translate: '-50% -50%', display: 'flex', alignItems: 'center',
                gap: 14, whiteSpace: 'nowrap' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: WARNA_DOMPET[k], transform: `scale(${k === 0 ? cin(f, T.wadah) : masuk})` }} />
                <WordText halus f={f} at={T.masuk[k] + 10} style={{ fontFamily: F, fontSize: lerp(38, 34, k === 1 ? pindah : 0), fontWeight: 800, color: B.night }}>{NAMA[k]}</WordText>
              </div>) : null}
          </div>);
      })}

      <Judul f={f} kata={['Uang', 'Stabil']} nomor="2" warnaNomor={B.turq} at={T.judul} keluar={S07_KELUAR} />
      <Judul f={f} kata={['1–3', 'tahun', '·', 'Tujuannya', 'sudah', 'jelas']} sorotIdx={5} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S07_KELUAR} />
    </AbsoluteFill>);
};

export const S07_T = T;
