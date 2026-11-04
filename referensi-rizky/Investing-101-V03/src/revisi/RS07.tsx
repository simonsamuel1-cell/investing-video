import React from 'react';
import { RS08_MASUK } from './RS08';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, WARNA, io, lerp, rgba } from '../theme';
import { cin, Icon, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { JamBerjalan } from '../parts/jam';
import type { KunciIkon } from '../ikon';
import { Kaca, MaskerKeluar, durMasker, type Masuk, daratDari } from '../parts/kaca';
import { FOTO } from '../parts/nyata';

/**
 * REVISI SCENE 07 (14 Okt, evaluasi 5 pertanyaan): jalan/roadmap TETAP (arahan Simon 13 Okt: titik awal & akhir) — yang diganti TUJUAN:
 * lingkaran ikon Ø170 → KARTU KACA bertab (ref-09/10) berisi ilustrasi besar (gedung sekolah · mobil · foto rumah) + nama, tepat di atas titik tahunnya.
 * (Salinan Scene07 — komposisi utama belum disentuh sampai Simon setuju.)
 *
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

/** MASUK (revisi 14 Okt): masker Scene 06 mendarat di dompet Uang Stabil (deret tengah) */
export const RS07_MASUK: Masuk = { x: 960, y: 512, r: 100, warna: B.turq, mulai: BATAS.s7 - 20 };
const DARAT = daratDari(RS07_MASUK);

const T = {
  wadah: BATAS.s7 + 35, // wadah Uang aktif (berisi pelampung) → dompet (bersamaan isi Scene 06 lain keluar, S06_KELUAR)
  // deret: Uang Aktif (dari wadah) · Uang Stabil · Uang Jangka Panjang — Uang Stabil masuk SESUDAH wadah menjauh dari kolom tengah (tanpa tumpang tindih)
  masuk: [DARAT + 16, DARAT, DARAT + 32], denyutKedua: kedua,
  sorot: uang + 10, judul: stabil,
  // revisi 14 Okt: dompet bertahan di tengah selama "belum dibutuhkan sekarang" (tanpa kanvas kosong), pindah ke titik awal saat jalan mulai
  pindah: tapi - 40, jam: belum + 10, sekarang: tapi - 10, denyutUangnya: uangnya, denyutSekarang: sekarang,
  // jalan tergambar ruas demi ruas: ruas k selesai tepat saat titik k+1 muncul di katanya ("satu" · "sampai" · "tiga")
  jalan: [tapi - 10, satu + 5, sampai + 15, tiga + 5], titik: [satu + 5, sampai + 15, tiga + 5], denyutTitik: tahun,
  sub: kita, subSorot: apa, slot: [tahu, tahu + 15, tahu + 30], penghubung: dipakai,
  denyutDompet: misalnya, tujuan: [sekolah, ganti + 20, mau + 10], jalanUang: [tahun2 + 4, dua + 8, tiga2 + 6], denyutSlot3: atau,
};

/* ── tata letak ── */
/** A: deret tiga dompet = tata letak Scene 03 (kolom 400 · 960 · 1520, Ø200, label 160 px di bawah) */
const DERET = { x: [400, 960, 1520], y: 512, d: 200, labelDy: 160 }; // ukur 14 Okt: deret + label berpusat di 540 (dulu y 410 → −102 px)
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
  { nama: 'Biaya sekolah', tahun: '1 Tahun', ikon: 'biayaSekolah', warna: WARNA.ungu, pos: [720, 322] },
  { nama: 'Ganti kendaraan', tahun: '2 Tahun', ikon: 'gantiKendaraan', warna: WARNA.langit, pos: [1200, 520] },
  { nama: 'DP rumah', tahun: '3 Tahun', ikon: 'dpRumah', warna: B.orange, pos: [1680, 330] },
];
const AWAL_POS: P = [240, 530]; // dompet Uang Stabil di atas titik awal
const KARTU_T = { w: 300, h: 250 };
/** foto tujuan (urut TUJUAN): sekolah · mobil · rumah */
const FOTO_TUJUAN = ['sekolahV1', 'mobilSuv', 'rumahModern'] as const;
const D_DOMPET = 180, LABEL_DY = 120, TAHUN_DY = 64; // label nama 120 px di bawah pusat lingkaran · label tahun 64 px di bawah jalan (≥19 px dari tepi jalan)
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
/** Simon 14 Okt: "hapus animasi yang tidak diperlukan (animasi yang seperti berdenyut)" → denyut DIMATIKAN di seluruh video (selalu 0). */
const denyut = (_f: number, _at: number, _a = 0.07) => 0;

/** KELUAR Scene 07 = milik Scene 08 ("Untuk uang seperti ini …"): jalan, titik, tujuan, label & judul keluar 60f mulai di batas;
 *  dompet Uang Stabil (+ label & lencana jam) diambil alih Scene 08 (titik & rupa sama, S07_DOMPET_AKHIR) */
const S07_KELUAR = BATAS.s8 + 30;
const S07_DOMPET_AKHIR_R = { x: AWAL_POS[0], y: AWAL_POS[1], d: D_DOMPET, labelY: AWAL_POS[1] + LABEL_DY, labelPx: 34, warna: B.turq };
const S07_JAM_R = T.jam; // lencana jam: menit berjalan dihitung dari waktu yang sama di Scene 08
export const RS07: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS08_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s7 || f >= RS08_MASUK.mulai + durMasker) return null;
  void S07_DOMPET_AKHIR_R; void S07_JAM_R;
  const kel = cin(f, S07_KELUAR);
  const pk = (i: number) => popOut(f, S07_KELUAR - 12 + 6 * i); // pop keluar berjenjang kiri → kanan
  const sorot = cin(f, T.sorot), pindah = cin(f, T.pindah);
  // kemajuan tiap ruas: linear di dalam ruas (kecepatan menyambung), ruas pertama mulai halus, ruas terakhir berhenti halus
  const ruasG = [0, 1, 2].map((k) => {
    const g = R(f, T.jalan[k], T.jalan[k + 1], 0, 1);
    return k === 0 ? 1 - Math.cos((g * Math.PI) / 2) : k === 2 ? Math.sin((g * Math.PI) / 2) : g; // sinus masuk · linear · sinus keluar
  });
  // B–C: belum ada kartu tujuan → jalan + dompet dinaikkan 110 px (isi berpusat); D: turun kembali saat kartu pertama muncul (geser bertahap)
  const naik = -110 * cin(f, T.pindah) * (1 - cin(f, T.tujuan[0] - 24));
  // Simon 14 Okt — pusat frame tiap momen: jalan tergambar dari kiri, jadi susunan B–D bergeser mendatar mengikuti kepala jalan & kartu tujuan
  // (dulu dompet sendirian di x 240 ±2 dtk lalu jalan tumbuh ke kanan: isi −700 px dari tengah). Tepi kiri tetap = label dompet (125).
  const sJalan = ruasG.reduce((a, g, k) => a + g * PANJANG[k], 0);
  const kepalaX = sJalan > 0.5 ? diJalan(sJalan)[0] : TITIK[0][0];
  const kanan = Math.max(409, kepalaX + 40, ...TUJUAN.map((t, i) => lerp(409, t.pos[0] + KARTU_T.w / 2, cin(f, T.tujuan[i] - 18))));
  const ox = cin(f, T.pindah) * (960 - (125 + kanan) / 2);
  return (
    <MaskerKeluar f={f} mulai={RS08_MASUK.mulai} ke={RS08_MASUK} warna={RS08_MASUK.warna}>
    <AbsoluteFill>
     <AbsoluteFill style={{ transform: geser(ox, naik) }}>
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
          const y0 = i === 0 ? atas[1] + LABEL_DY + 26 : atas[1] + 20 + KARTU_T.h / 2 + 8, y1 = lerp(y0, TITIK[i][1] - (i === 0 || i === 3 ? 40 : 24), g);
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

      {/* tujuan (D): KARTU KACA berilustrasi di atas titiknya (revisi 14 Okt) — muncul langsung berisi, tanpa slot kosong */}
      {TUJUAN.map((t, i) => {
        const [x, y] = t.pos;
        const isi = popIn(f, T.tujuan[i]) * pk(i + 1);
        if (isi <= 0.001) return null;
        const s = isi * (1 + denyut(f, T.jalanUang[i] + 44, 0.05));
        const cy = y + 20;
        return (
          <React.Fragment key={t.nama}>
            <Kaca x={x} y={cy} w={KARTU_T.w} h={KARTU_T.h} p={s} warna={t.warna} tab="atas" rona={0.5} />
            <div style={{ position: 'absolute', left: 0, top: 0, width: KARTU_T.w, height: KARTU_T.h, transformOrigin: 'center', transform: `${geser(x - KARTU_T.w / 2, cy - KARTU_T.h / 2)} scale(${s})` }}>
              {/* foto realistis Simon (14 Okt) — tinggi maks 150 px, berpusat di area atas kartu (y 22–172) */}
              {(() => {
                const fo = FOTO[FOTO_TUJUAN[i]], w = Math.min(250, 150 * fo.r), h = w / fo.r;
                return <Img src={staticFile(fo.src)} style={{ position: 'absolute', left: KARTU_T.w / 2 - w / 2, top: 97 - h / 2, width: w, height: h, maxWidth: 'none' }} />;
              })()}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 186, textAlign: 'center', whiteSpace: 'nowrap' }}>
                <WordText halus f={f} at={T.tujuan[i] + 8} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{t.nama}</WordText>
              </div>
            </div>
          </React.Fragment>);
      })}

      {/* ── deret tiga dompet (A) → Uang Stabil ke titik awal (B) ── */}
      {[0, 1, 2].map((k) => {
        // (15 Okt) dulu: `if (k === 1 && !milikS7) return null` — sisa serah-terima Scene 08 LAMA. RS08 (revisi) tidak menggambar dompet ini, jadi dompet
        // Uang Stabil + jam + label HILANG dalam 1 frame di tengah masker (f8828, ditemukan Simon). Kini tetap digambar sampai masker selesai.
        // Uang Stabil = cakram pendaratan masker Scene 06 (tanpa pop); Uang Aktif & Uang Jangka Panjang pop di sampingnya
        const masuk = k === 1 ? (f >= DARAT ? 1 : 0) : popIn(f, T.masuk[k]);
        // dompet lain turun & pudar DULU (45f sebelum Uang Stabil berpindah) — tidak tersilang Uang Stabil yang lewat
        const turun = k === 1 ? 0 : cin(f, T.pindah - 45 + 6 * (k === 0 ? 0 : 1));
        const redup = k === 1 ? 0 : 0.45 * sorot;
        if (turun >= 0.999) return null;
        // Uang Stabil: disorot (membesar 1,12) lalu pindah ke atas titik awal (Ø180)
        const x = k === 1 ? lerp(DERET.x[1], AWAL_POS[0], pindah) : DERET.x[k];
        const y = k === 1 ? lerp(DERET.y, AWAL_POS[1], pindah) : DERET.y + 220 * turun;
        const dd = k === 1 ? lerp(DERET.d * (1 + 0.12 * sorot), D_DOMPET, pindah) * (1 + denyut(f, T.denyutDompet, 0.05) + denyut(f, T.denyutUangnya, 0.05) + denyut(f, T.denyutSekarang, 0.05)) : DERET.d;
        const labelY = k === 1 ? lerp(DERET.y + DERET.labelDy, AWAL_POS[1] + LABEL_DY, pindah) : DERET.y + DERET.labelDy + 220 * turun;
        const alfa = (1 - redup) * (1 - turun);
        const ring = k === 1 ? sorot * (1 - pindah) : 0;
        const jam = k === 1 ? popIn(f, T.jam) : 0;
        return (
          <div key={NAMA[k]} style={{ position: 'absolute', inset: 0, opacity: alfa }}>
            {masuk > 0.001 ? (
              <div style={{ position: 'absolute', left: x - dd / 2, top: y - dd / 2, width: dd, height: dd, borderRadius: '50%', background: WARNA_DOMPET[k], display: 'grid',
                placeItems: 'center', transform: `scale(${masuk})`, boxShadow: `0 18px 40px -12px ${WARNA_DOMPET[k]}aa` }}>
                <Icon name="dompet" size={dd * 0.52} color={B.white} style={k === 1 ? { opacity: R(f, DARAT, DARAT + 20, 0, 1, io) } : undefined} />
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
                {/* (15 Okt) dompet Uang Stabil = cakram pendaratan masker (masuk = 1 di DARAT) → titik labelnya dulu muncul penuh seketika; kini pop bersama label */}
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: WARNA_DOMPET[k], transform: `scale(${k === 1 ? popIn(f, DARAT + 30) : masuk})` }} />
                {/* Uang Stabil: label baru tersingkap saat masker mendarat (DARAT) → titik & kata mulai DI DARAT (dulu mulai DARAT − 20: titik 90 %, kata 30 % seketika) */}
                <WordText halus f={f} at={k === 1 ? DARAT + 30 : T.masuk[k] + 10} style={{ fontFamily: F, fontSize: lerp(38, 34, k === 1 ? pindah : 0), fontWeight: 800, color: B.night }}>{NAMA[k]}</WordText>
              </div>) : null}
          </div>);
      })}

     </AbsoluteFill>
      <Judul f={f} kata={['Uang', 'Stabil']} nomor="2" warnaNomor={B.turq} at={T.judul} keluar={S07_KELUAR} />
      <Judul f={f} kata={['1–3', 'tahun', '·', 'Tujuannya', 'sudah', 'jelas']} sorotIdx={5} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S07_KELUAR} />
    </AbsoluteFill>
    </MaskerKeluar>);
};

export const S07_T = T;
