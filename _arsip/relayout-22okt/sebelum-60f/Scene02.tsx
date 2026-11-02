import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, CORET, F, io, mixHex, R, rgba } from '../theme';
import { alfaP, cin, gayaPapan, Icon, lerp, naikY, opa, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { Kaca, KarakterLingkar, MaskerKeluar, Nomor, ORANG_SAKU, Penghubung } from '../parts/kaca';
import { S03_MASUK } from '../s03/Scene03';
import { Foto, Kalender, Tagihan, Uang } from '../parts/nyata';
import { Rute, titikRute } from '../parts/rute';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { GarisDalam } from '../parts/v04';
import { JALUR_IKON, JALUR_WARNA, Kendaraan, S02_PUSAT } from '../parts/jalur';
import { Baris, IHSG_2012_2021, S15_TURUN } from '../data/pasar';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 02 — Jalan Kaki (BATAS.s2 – BATAS.s3). RELAYOUT 22 Okt (Simon: "secara layout aku masih kurang puas"; judul TIDAK ditambahkan) —
 * rencana 04_Asset/Rencana-Relayout-V05.md. Papan lebih penuh & seimbang, isi lebih besar, gambar realistis di kartu kecil, Rupiah berjalan:
 *  A peta bab S01 bertahan ('Kita mulai dari jalan kaki': cincin kembali ke 01) → di 'dana' cakram jalan kaki ke kiri → Rp10.000.000 → rute →
 *    3 kartu bergambar (deposito · obligasi pemerintah · obligasi perusahaan)
 *  B Kita → uang → kartu penerima (isi berganti: Penerima → Pemerintah) → kartu Bank menyusul; chip faktor risiko
 *  C dua kartu grafik (stabil 4 %/th vs IHSG 2013–2017, sumbu sama) + pil Rupiah di ujung garis + 3–5 % per tahun
 *  D dua kartu fungsi, pola sorot ref 05 (yang dibahas besar & bertepi, lainnya ringkas & surut): 01 piramida fondasi · 02 uang Rp10.000.000
 *  E kartu 02 + 01 MENYATU jadi panel → jalan berliku Sekarang → 1/2/3 tahun (port V03 RS07), kartu foto di atas titiknya, uang berjalan di jalan
 *  F (panel sama) uang → indeks / saham dicoret → grafik indeks Feb–Mar 2020: pil Rupiah turun + tagihan biaya sekolah, "Kurang Rp…"
 *  G cakram jalan kaki → "Mengejar return tertinggi" (dicoret) · "Menjaga uang" (dicentang di "fungsinya"); H chip "Lebih lambat"
 * Transisi antarpapan: dorong swipe up (A→B→C→D) · panel menyatu (D→E) · isi panel berganti + serah-terima uang (E→F→F2) · keluar naik (F→G) ·
 * masker lingkaran ke cakram feri (→ S03). Ikon/chip/pil = pop easeOutBack; kartu/foto/teks/orang = swipe up; garis = trim path; 60f di kata.
 */
const A0 = BATAS.s2;
const W = urut(['jalan', 'investasi', 'dana', 'deposito', 'obligasi', 'pemerintah', 'sebagian', 'perusahaan', 'kenapa', 'stabil', 'karena', 'meminjamkan',
  'risikonya', 'siapa', 'menerima', 'kalau', 'pemerintah', 'kemampuan', 'membayar', 'kalau', 'bank', 'risikonya', 'kondisi', 'dibandingkan', 'saham',
  'pergerakan', 'kecil', 'asumsi', 'return-nya', '3', '5', 'tahun', 'memang', 'tinggi', 'dua', 'fungsi', 'pertama', 'fondasi', 'portofolio', 'baru',
  'sebagian', 'besar', 'sini', 'kedua', 'kebutuhan', 'jelas', 'satu', 'tiga', 'tahun', 'misalnya', 'biaya', 'sekolah', 'ganti', 'kendaraan', 'terencana',
  'uang', 'jangan', 'masuk',
  'indeks', 'apalagi', 'saham', 'karena', 'indeks', 'turun', 'butuh', 'jadi', 'bukan', 'mengejar', 'tertinggi', 'menjaga', 'bergejolak', 'jalannya',
  'lambat', 'fungsinya'], A0);
const K = ['jalan', 'investasi', 'dana', 'deposito', 'obligasi', 'pemerintah', 'sebagian', 'perusahaan', 'kenapa', 'stabil', 'karena', 'meminjamkan',
  'risiko1', 'siapa', 'menerima', 'kalauPem', 'pemerintah2', 'kemampuan', 'membayar', 'kalauBank', 'bank', 'risiko2', 'kondisi', 'dibandingkan', 'saham',
  'pergerakan', 'kecil', 'asumsi', 'returnnya', 'tiga', 'lima', 'tahun', 'memang', 'tinggi', 'dua', 'fungsi', 'pertama', 'fondasi', 'portofolio', 'baru',
  'sebagian2', 'besar', 'sini', 'kedua', 'kebutuhan', 'jelas', 'satu', 'tigaTh', 'tahun2', 'misalnya', 'biaya', 'sekolah', 'ganti', 'kendaraan', 'terencana',
  'uangIni', 'jangan',
  'masuk', 'indeks', 'apalagi', 'saham2', 'karena2', 'indeks2', 'turun', 'butuh', 'jadi', 'bukan', 'mengejar', 'tertinggi', 'menjaga', 'bergejolak',
  'jalannya', 'lambat', 'fungsinya'] as const;
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S02_T = T;
export const S02_AKHIR = BATAS.s3;

/* ═════════ data asli ═════════ */
const tutup = (rows: Baris[]) => rows.map((r) => Number(r[4]));
// IHSG bulanan Jan 2013 – Des 2017: akhir +43 % (di atas stabil +22 % → "memang nggak tinggi"), turun terdalam −24 % (2015) → "pergerakan lebih kecil"
const IHSG5 = tutup(IHSG_2012_2021.filter((r) => String(r[0]) >= '2013-01' && String(r[0]) <= '2017-12'));
const SAHAM = IHSG5.map((v) => (100 * v) / IHSG5[0]); // indeks 100 di Jan 2013
const STABIL = SAHAM.map((_, i) => 100 * Math.pow(1.04, i / 12)); // asumsi 4 %/th (tengah 3–5 %), sumbu SAMA dengan saham
const DOM: [number, number] = [85, 150];
const TURUN = tutup(S15_TURUN); // IHSG harian 3 Feb – 19 Mar 2020
const MODAL = 10_000_000;
const AKHIR_TURUN = Math.round((MODAL * TURUN[TURUN.length - 1]) / TURUN[0] / 1000) * 1000; // Rp6.977.000
/** titik-titik polyline di kotak (x0,y0,w,h), domain [lo,hi]; g = kemajuan gambar 0…1 (segmen terakhir dipotong) */
const garis = (v: number[], x0: number, y0: number, w: number, h: number, lo: number, hi: number, g: number) => {
  const n = v.length - 1, ujung = g * n, pts: string[] = [];
  for (let i = 0; i <= Math.floor(ujung); i++) pts.push(`${x0 + (w * i) / n},${y0 + h - ((v[i] - lo) / (hi - lo)) * h}`);
  const i = Math.floor(ujung);
  if (i < n && ujung > i) {
    const t = ujung - i, val = v[i] + (v[i + 1] - v[i]) * t;
    pts.push(`${x0 + (w * ujung) / n},${y0 + h - ((val - lo) / (hi - lo)) * h}`);
  }
  return pts.join(' ');
};
const nilaiDi = (v: number[], g: number) => {
  const n = v.length - 1, u = g * n, i = Math.min(n - 1, Math.floor(u)), t = Math.min(1, u - i);
  return v[i] + (v[i + 1] - v[i]) * t;
};
const titikAkhir = (v: number[], x0: number, y0: number, w: number, h: number, lo: number, hi: number, g: number): [number, number] =>
  [x0 + w * g, y0 + h - ((nilaiDi(v, g) - lo) / (hi - lo)) * h];
/** Rupiah berjalan dibulatkan ke ribuan (lebar tetap: tabular-nums + lebarMin) */
const rp = (v: number) => rpPenuh(Math.round(v / 1000) * 1000);
const arahDari = (v: number) => Math.max(-1, Math.min(1, ((v - MODAL) / MODAL) * 8));

/* ═════════ jalan berliku E (port V03 RS07): tiga ruas Bézier, garis singgung datar di tiap titik ═════════ */
type P = [number, number];
const TITIK: P[] = [[330, 740], [740, 580], [1150, 740], [1560, 590]];
const RUAS: [P, P, P, P][] = [0, 1, 2].map((k) => {
  const a = TITIK[k], b = TITIK[k + 1], m = (a[0] + b[0]) / 2;
  return [a, [m, a[1]], [m, b[1]], b];
});
const bez = (r: [P, P, P, P], t: number): P => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * r[0][i] + 3 * u * u * t * r[1][i] + 3 * u * t * t * r[2][i] + t * t * t * r[3][i]) as P;
};
const SAMPEL = 200;
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
  return bez(RUAS[k], (i - 1 + (s - tab[i - 1]) / Math.max(1e-6, tab[i] - tab[i - 1])) / SAMPEL);
};
const dRuas = (r: [P, P, P, P]) => `M ${r[0][0]} ${r[0][1]} C ${r[1][0]} ${r[1][1]} ${r[2][0]} ${r[2][1]} ${r[3][0]} ${r[3][1]}`;
const JALAN_W = 40;
const WARNA_RUAS = [B.turq, B.blueLite, B.blue];
const KARTU_T = { w: 300, h: 250, dy: 190 }; // kartu tujuan berpusat 190 px di atas titiknya

/* ═════════ tata letak (pusat isi ±(960, 520); subtitle mulai 925) ═════════ */
const GARIS = B.blue; // garis di latar biru (turkis tak terbaca di atas rona biru)
const PA = { uang: { x: 740, y: 520, w: 220 }, pil: 660, kartu: { x: 1380, w: 600, h: 170, y: [320, 530, 740] } }; // cakram = S02_PUSAT (360, 520)
const KITA = { x: 420, y: 520, D: 270 };
const KB = { x: 1330, w: 620, h: 250, y: 520, yPem: 330, yBank: 710 };
const KC = { w: 780, h: 560, x: [540, 1380], y: 520 };
const GC = { x0: 60, y0: 170, w: 660, h: 290 };
const KD = { kompak: { w: 380, h: 380 }, besar: { w: 760, h: 600 }, y: 520 };
const PANEL = { x: 960, y: 530, w: 1640, h: 680 };
const AWAL = { uang: { x: 330, y: 570, w: 150 }, pil: { x: 330, y: 668 } }; // uang di atas titik "Sekarang"
const F1 = { uang: { x: 470, y: 470, w: 200 }, pil: { x: 470, y: 600 }, kartu: { x: 1330, w: 520, h: 210, y: [360, 660] } };
const GF = { x0: 230, y0: 320, w: 860, h: 380, lo: 3900, hi: 6100 };
const KG = { w: 640, h: 240, x: [600, 1320], y: 710, disc: { x: 960, y: 270, d: 180 } };

/** kartu dua-lapis: isi lama pudar ke atas, isi baru naik (kartu tetap) */
const lapis = (o: number, keluar: boolean): React.CSSProperties => ({ position: 'absolute', inset: 0, ...gayaPapan(o, keluar) });

export const Scene02: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 + 60 || f > S02_AKHIR + 90) return null;

  /* ── A ── */
  const papanA = 1 - cin(f, T.karena); // transisi seragam 22 Okt: 60f dipusatkan di kata, papan lama keluar = papan baru masuk
  const disc = S02_PUSAT; // digambar Scene 01 (peta bab) sampai "dana" + 10, lalu di sini — rupa & posisi sama
  const asetA = [T.deposito, T.obligasi, T.perusahaan];

  /* ── B ── */
  const papanB = cin(f, T.karena) * (1 - cin(f, T.dibandingkan));
  const yPem = lerp(KB.y, KB.yPem, cin(f, T.kalauBank));
  const ruteX0 = KITA.x + KITA.D / 2 + 18, ruteX1 = KB.x - KB.w / 2 - 8;

  /* ── C ── */
  const papanC = 1 - cin(f, T.dua);
  const gambarC = R(f, T.pergerakan - 20, T.pergerakan + 110, 0, 1, io);
  const sorotC = cin(f, T.asumsi);

  /* ── D → E → F: dua kartu sorot → panel menyatu ── */
  const s1 = cin(f, T.pertama), s2 = cin(f, T.kedua);
  const aktif1 = s1 - s2, aktif2 = s2;
  const satu = cin(f, T.tigaTh - 10); // menyatu jadi panel (60f, selesai saat jalan mulai)
  const k1 = { x: lerp(740 - 190 * s2, 700, satu), w: lerp(KD.kompak.w, KD.besar.w, aktif1), h: lerp(KD.kompak.h, KD.besar.h, aktif1) };
  const k2b = { x: 1180 + 190 * aktif1, w: lerp(KD.kompak.w, KD.besar.w, aktif2), h: lerp(KD.kompak.h, KD.besar.h, aktif2) };
  const k2 = { x: lerp(k2b.x, PANEL.x, satu), y: lerp(KD.y, PANEL.y, satu), w: lerp(k2b.w, PANEL.w, satu), h: lerp(k2b.h, PANEL.h, satu) };
  const panelKeluar = cin(f, T.jadi);
  const isi02 = 1 - cin(f, T.tigaTh - 10); // isi kartu 02 (nomor, ikon, judul) pudar bersama penyatuan (60f yang sama)
  const eKeluar = cin(f, T.jangan); // isi jalan pergi (uang tetap → F), bersamaan uang pindah
  const f1Keluar = cin(f, T.karena2);
  const jalanT = [T.tigaTh, T.tigaTh + 30, T.tigaTh + 60, T.tigaTh + 90]; // ruas k tergambar jalanT[k] → jalanT[k+1]
  const TUJUAN = [
    { nama: 'Biaya sekolah', tahun: '1 tahun', foto: 'sekolah' as const, at: T.biaya },
    { nama: 'Ganti kendaraan', tahun: '2 tahun', foto: 'mobilSuv' as const, at: T.ganti },
    { nama: 'Kebutuhan terencana', tahun: '3 tahun', foto: null, at: T.terencana },
  ];

  // UANG kebutuhan 1–3 tahun: kartu 02 (D) → titik "Sekarang" (E) → kiri panel (F1) → pil menjadi nilai berjalan di grafik indeks (F2)
  const uangMuncul = popIn(f, T.kedua + 40), pilMuncul = popIn(f, T.kedua + 60);
  const keAwal = cin(f, T.tigaTh - 10), keF1 = cin(f, T.jangan), keF2 = cin(f, T.karena2);
  const atasK2 = KD.y - k2b.h / 2;
  const uangD = { x: k2b.x, y: atasK2 + 400, w: 220 }, pilD = { x: k2b.x, y: atasK2 + 545 };
  const uangPos = {
    x: lerp(lerp(uangD.x, AWAL.uang.x, keAwal), F1.uang.x, keF1), y: lerp(lerp(uangD.y, AWAL.uang.y, keAwal), F1.uang.y, keF1),
    w: lerp(lerp(uangD.w, AWAL.uang.w, keAwal), F1.uang.w, keF1),
  };
  const gIndeks = R(f, T.indeks2 - 20, T.butuh - 10, 0, 1, io);
  const nilaiIndeks = (MODAL * nilaiDi(TURUN, gIndeks)) / TURUN[0];
  const [tipX, tipY] = titikAkhir(TURUN, GF.x0, GF.y0, GF.w, GF.h, GF.lo, GF.hi, gIndeks);
  const pilF2 = { x: Math.max(GF.x0 + 130, Math.min(GF.x0 + GF.w - 130, tipX)), y: tipY + 56 };
  const pilPos = {
    x: lerp(lerp(lerp(pilD.x, AWAL.pil.x, keAwal), F1.pil.x, keF1), pilF2.x, keF2),
    y: lerp(lerp(lerp(pilD.y, AWAL.pil.y, keAwal), F1.pil.y, keF1), pilF2.y, keF2),
  };

  /* ── G / H ── */
  const papanG = cin(f, T.jadi);
  const coretG = R(f, T.tertinggi + 20, T.tertinggi + 50, 0, 1, io);
  const fungsi = popIn(f, T.fungsinya - 15);
  const discGY = lerp(440, KG.disc.y, cin(f, T.mengejar - 24)); // tengah dulu (cakram + label), naik memberi ruang untuk dua kartu

  return (
    <MaskerKeluar f={f} mulai={S03_MASUK.mulai} ke={S03_MASUK} warna={S03_MASUK.warna}>
    <AbsoluteFill style={{ pointerEvents: 'none' }}>

      {/* ══ A: jalan kaki → Rp10.000.000 → deposito · obligasi pemerintah · obligasi perusahaan (pola V03 0:31, ref 12) ══ */}
      {papanA > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanA, true) }}>
          {asetA.map((at, i) => {
            const x0 = PA.uang.x + PA.uang.w / 2 + 8, x1 = PA.kartu.x - PA.kartu.w / 2 - 6;
            const t = R(f, at - 50, at + 4, 0, 1, io);
            const [ux, uy] = titikRute(x0, PA.uang.y, x1, PA.kartu.y[i], t);
            return (
              <React.Fragment key={i}>
                <Rute x0={x0} y0={PA.uang.y} x1={x1} y1={PA.kartu.y[i]} g={cin(f, at - 24)} warna={GARIS} />
                {t > 0.001 && t < 0.999 ? <Uang x={ux} y={uy} w={64} alfa={Math.min(R(t, 0, 0.15, 0, 1), R(t, 0.85, 1, 1, 0))} /> : null}
              </React.Fragment>);
          })}
          {f >= T.dana + 10 ? <>
            <Kendaraan x={disc.x} y={disc.y} d={disc.d} warna={JALUR_WARNA.jalan} ikon={JALUR_IKON.jalan.ikon} cermin={false} p={1} cincin />
            <Label x={disc.x} y={disc.y + disc.d / 2 + 40} teks="Investasi relatif stabil" f={f} at={T.investasi} size={32} lebar={370} />
          </> : null}
          <Lencana x={disc.x} y={disc.y} d={disc.d} p={popIn(f, T.kenapa)} warna={B.orange} teks="?" besar={72} />
          <Uang x={PA.uang.x} y={PA.uang.y} w={PA.uang.w} p={popIn(f, T.dana + 10)} />
          <PilNominal x={PA.uang.x} y={PA.pil} teks={rp(MODAL)} arah={0} p={popIn(f, T.dana + 30)} size={30} />
          {asetA.map((at, i) => {
            const foto = (['brankas', 'obligasi', 'perusahaan'] as const)[i];
            const fw = [132, 152, 112][i];
            const nama = ['Deposito', 'Obligasi pemerintah', 'Obligasi perusahaan'][i];
            return (
              <Kaca key={nama} x={PA.kartu.x} y={PA.kartu.y[i]} w={PA.kartu.w} h={PA.kartu.h} p={popIn(f, at)} warna={JALUR_WARNA.jalan} tab="kiri">
                <Foto k={foto} x={112} y={PA.kartu.h / 2} w={fw} p={1} />
                <div style={{ position: 'absolute', left: 206, top: PA.kartu.h / 2 - 23, fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                  <WordText f={f} at={at + 14} halus>{nama}</WordText>
                </div>
              </Kaca>);
          })}
        </div>) : null}

      {/* ══ B: meminjamkan uang — risiko bergantung pada penerimanya (Pemerintah · Bank) ══ */}
      {papanB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanB, f > T.dibandingkan - 30) }}>
          <Rute x0={ruteX0} y0={KITA.y} x1={ruteX1} y1={yPem} g={cin(f, T.meminjamkan - 20)} warna={GARIS} />
          <Rute x0={ruteX0} y0={KITA.y} x1={ruteX1} y1={KB.yBank} g={cin(f, T.bank - 24)} warna={GARIS} />
          {/* uang dipinjamkan → penerima; dibayar kembali ← pemerintah */}
          {(() => {
            const t = R(f, T.meminjamkan - 10, T.meminjamkan + 70, 0, 1, io);
            const b = R(f, T.membayar - 10, T.membayar + 70, 0, 1, io);
            const tt = t > 0.001 && t < 0.999 ? t : b > 0.001 && b < 0.999 ? 1 - b : -1;
            if (tt < 0) return null;
            const [x, y] = titikRute(ruteX0, KITA.y, ruteX1, yPem, tt);
            return <Uang x={x} y={y - 6} w={110} alfa={Math.min(R(tt, 0, 0.12, 0, 1), R(tt, 0.86, 1, 1, 0))} />;
          })()}
          <Chip x={(ruteX0 + ruteX1) / 2} y={KITA.y - 62} teks="Meminjamkan uang" ikon="meminjamkan" warna={GARIS} p={popIn(f, T.meminjamkan + 20) * popOut(f, T.kalauPem)} size={26} />
          <KarakterLingkar pose={ORANG_SAKU} x={KITA.x} y={KITA.y} D={KITA.D} s={popIn(f, T.karena)} warna={B.orange} />
          <Label x={KITA.x} y={KITA.y + KITA.D / 2 + 40} teks="Kita" f={f} at={T.karena + 30} size={34} />

          {/* kartu penerima: isi berganti Penerima → Pemerintah; naik memberi ruang untuk Bank di "kalau lewat bank" */}
          <Kaca x={KB.x} y={yPem} w={KB.w} h={KB.h} p={popIn(f, T.meminjamkan + 10)} warna={B.orange} tab="kiri">
            <div style={lapis(1 - cin(f, T.pemerintah2), true)}>
              <Bulat x={125} y={KB.h / 2} d={150} warna={B.gray} ikon="meminjamkan" p={popIn(f, T.meminjamkan + 20)} />
              <div style={{ position: 'absolute', left: 246, top: KB.h / 2 - 24, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                <WordText f={f} at={T.siapa} halus>Penerima</WordText>
              </div>
            </div>
            <Foto k="pemerintah" x={128} y={KB.h / 2} w={206} p={popIn(f, T.pemerintah2)} />
            <div style={{ position: 'absolute', left: 250, top: 58, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
              <WordText f={f} at={T.pemerintah2 + 10} halus>Pemerintah</WordText>
            </div>
            <Chip x={250} y={166} teks="Kemampuan membayar" ikon="kemampuan" warna={B.orange} p={popIn(f, T.kemampuan)} size={26} jangkar="kiri" />
          </Kaca>
          <Lencana x={KB.x + KB.w / 2 - 10} y={yPem - KB.h / 2 + 10} d={0} p={popIn(f, T.risiko1)} warna={B.orange} ikon="risiko" besar={68} />

          <Kaca x={KB.x} y={KB.yBank} w={KB.w} h={KB.h} p={popIn(f, T.bank)} warna={B.orange} tab="kiri">
            <Foto k="bank" x={128} y={KB.h / 2} w={168} p={popIn(f, T.bank)} />
            <div style={{ position: 'absolute', left: 250, top: 58, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
              <WordText f={f} at={T.bank + 10} halus>Bank</WordText>
            </div>
            <Chip x={250} y={166} teks="Kondisi bank" ikon="sektorBank" warna={B.orange} p={popIn(f, T.kondisi)} size={26} jangkar="kiri" />
          </Kaca>
          <Lencana x={KB.x + KB.w / 2 - 10} y={KB.yBank - KB.h / 2 + 10} d={0} p={popIn(f, T.risiko2)} warna={B.orange} ikon="risiko" besar={68} />
        </div>) : null}

      {/* ══ C: stabil vs saham — sumbu sama, pil Rupiah berjalan di ujung garis (Rp10.000.000 di Jan 2013) ══ */}
      {papanC > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanC, true) }}>
          {[0, 1].map((i) => {
            const stabil = i === 0;
            const warna = stabil ? JALUR_WARNA.jalan : B.orange;
            const v = stabil ? STABIL : SAHAM;
            const ujung = titikAkhir(v, GC.x0, GC.y0, GC.w, GC.h, DOM[0], DOM[1], gambarC);
            const nilai = (MODAL * nilaiDi(v, gambarC)) / 100;
            // penurunan terdalam saham (puncak → lembah) — "pergerakan nilainya … lebih kecil"
            let pk = 0, dd = 0, iL = 0, iP = 0;
            v.forEach((x, k) => { if (x > v[pk]) pk = k; const d = (x - v[pk]) / v[pk]; if (d < dd) { dd = d; iL = k; iP = pk; } });
            const [lx, ly] = titikAkhir(v, GC.x0, GC.y0, GC.w, GC.h, DOM[0], DOM[1], iL / (v.length - 1));
            const py = titikAkhir(v, GC.x0, GC.y0, GC.w, GC.h, DOM[0], DOM[1], iP / (v.length - 1))[1];
            return (
              <Kaca key={i} x={KC.x[i]} y={KC.y} w={KC.w} h={KC.h} p={popIn(f, stabil ? T.dibandingkan : T.saham)} warna={warna} tab="atas"
                tepi={stabil ? sorotC : 0} alfa={stabil ? 1 : 1 - 0.4 * sorotC}>
                <div style={{ position: 'absolute', left: 40, top: 40, display: 'flex', alignItems: 'center', gap: 16, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center' }}>
                    <Icon name={stabil ? 'stabil' : 'saham'} size={36} color={B.white} />
                  </div>
                  {stabil ? 'Investasi stabil' : 'Saham'}
                </div>
                <svg width={KC.w} height={KC.h} style={{ position: 'absolute', left: 0, top: 0 }}>
                  {[0, 1, 2, 3].map((k) => <line key={k} x1={GC.x0} x2={GC.x0 + GC.w * cin(f, (stabil ? T.dibandingkan : T.saham) + 20 + 6 * k)}
                    y1={GC.y0 + (GC.h * k) / 3} y2={GC.y0 + (GC.h * k) / 3} stroke={rgba(B.gray, 0.18)} strokeWidth={1.5} />)}
                  {gambarC > 0.001 ? <polyline points={garis(v, GC.x0, GC.y0, GC.w, GC.h, DOM[0], DOM[1], gambarC)} fill="none" stroke={warna} strokeWidth={6}
                    strokeLinejoin="round" strokeLinecap="round" /> : null}
                  {gambarC > 0.001 ? <circle cx={ujung[0]} cy={ujung[1]} r={9} fill={warna} stroke={B.white} strokeWidth={3} /> : null}
                  {['2013', '2015', '2017'].map((th, k) => <text key={th} x={GC.x0 + (GC.w * [0, 24, 48][k]) / (v.length - 1)} y={GC.y0 + GC.h + 40} fontFamily={F} fontSize={24}
                    fontWeight={700} fill={B.gray} opacity={cin(f, (stabil ? T.dibandingkan : T.saham) + 30)}>{th}</text>)}
                  {!stabil && gambarC > iL / (v.length - 1) ? (
                    <g opacity={popIn(f, T.kecil)}>
                      <line x1={lx} x2={lx} y1={ly} y2={py} stroke={ARAH.turun} strokeWidth={3} strokeDasharray="6 7" />
                      <circle cx={lx} cy={ly} r={7} fill={ARAH.turun} />
                    </g>) : null}
                </svg>
                {!stabil ? <Chip x={lx + 104} y={ly + 8} teks={`▼ ${Math.round(-dd * 100)}%`} warna={ARAH.turun} p={popIn(f, T.kecil + 10)} size={24} /> : null}
                {stabil ? <Chip x={KC.w - 180} y={72} teks="3–5% per tahun" ikon="stabil" warna={JALUR_WARNA.jalan} p={popIn(f, T.tiga)} size={26} /> : null}
                <PilNominal x={Math.max(GC.x0 + 125, Math.min(GC.x0 + GC.w - 125, ujung[0]))} y={ujung[1] - 56} teks={rp(nilai)} arah={arahDari(nilai)}
                  p={popIn(f, T.pergerakan - 10)} size={26} lebarMin={226} />
              </Kaca>);
          })}
        </div>) : null}

      {/* ══ D–F: dua kartu fungsi (sorot ref 05) → menyatu jadi panel (jalan berliku · indeks dipaksa · indeks turun) ══ */}
      {f > T.dua - 40 && panelKeluar < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - panelKeluar, true) }}>
          {/* kartu 01 — fondasi portofolio (besar saat "pertama", ringkas saat "kedua", masuk ke panel saat menyatu) */}
          {satu < 0.999 ? (
            <Kaca x={k1.x} y={KD.y} w={k1.w} h={k1.h} p={popIn(f, T.dua)} warna={JALUR_WARNA.jalan} tab="atas" tepi={aktif1}
              alfa={(1 - 0.45 * aktif2) * (1 - satu)}>
              <Nomor x={48} y={48} n={1} warna={JALUR_WARNA.jalan} p={popIn(f, T.dua + 10)} d={60} />
              <Bulat x={k1.w / 2} y={lerp(150, 105, aktif1)} d={lerp(150, 120, aktif1)} warna={JALUR_WARNA.jalan} ikon="fondasi" p={popIn(f, T.dua + 20)} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: lerp(268, 186, aktif1), textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>
                <WordText f={f} at={T.fondasi} halus>Fondasi portofolio</WordText>
              </div>
              {/* piramida: dasar terbesar = jalan kaki ("sebagian besar dana bisa dimulai dari sini"), dibangun dari bawah */}
              {aktif1 > 0.001 ? (
                <div style={{ position: 'absolute', inset: 0, opacity: opa(aktif1) }}>
                  {[
                    { k: 'jalan' as const, w: 600, h: 120, top: 416, at: T.baru },
                    { k: 'feri' as const, w: 400, h: 80, top: 326, at: T.baru + 20 },
                    { k: 'pesawat' as const, w: 220, h: 66, top: 250, at: T.baru + 40 },
                  ].map((b) => {
                    const p = popIn(f, b.at);
                    if (p <= 0.001) return null;
                    return (
                      <div key={b.k} style={{ position: 'absolute', left: (k1.w - b.w) / 2, top: b.top, width: b.w, height: b.h, borderRadius: 20, background: JALUR_WARNA[b.k],
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `translateY(${naikY(p)}px)`, opacity: opa(alfaP(p)),
                        boxShadow: `0 14px 26px -16px ${JALUR_WARNA[b.k]}` }}>
                        <GarisDalam ikon={JALUR_IKON[b.k].ikon} d={b.h * 1.25} />
                        {b.k === 'jalan' ? (
                          <span style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.white, whiteSpace: 'nowrap' }}>
                            <WordText f={f} at={T.sebagian2} halus>Sebagian besar dana</WordText>
                          </span>) : null}
                      </div>);
                  })}
                </div>) : null}
            </Kaca>) : null}

          {/* kartu 02 → PANEL (menyatu) */}
          <Kaca x={k2.x} y={k2.y} w={k2.w} h={k2.h} p={popIn(f, T.dua + 20)} warna={B.blue} tab="atas" tepi={aktif2 * (1 - satu)} alfa={1 - 0.45 * aktif1}>
            {isi02 > 0.001 ? (
              <div style={{ position: 'absolute', inset: 0, opacity: opa(isi02) }}>
                <Nomor x={48} y={48} n={2} warna={B.blue} p={popIn(f, T.dua + 30)} d={60} />
                <Bulat x={k2.w / 2} y={lerp(150, 105, aktif2)} d={lerp(150, 120, aktif2)} warna={B.blue} ikon="kalender" p={popIn(f, T.dua + 40)} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: lerp(268, 186, aktif2), textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>
                  <WordText f={f} at={T.kebutuhan} halus>Kebutuhan 1–3 tahun</WordText>
                </div>
              </div>) : null}
          </Kaca>

          {/* E: jalan berliku Sekarang → 1 / 2 / 3 tahun (port V03 RS07) — pergi ke atas di "jangan" */}
          {satu > 0.5 && eKeluar < 0.999 ? (
            <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - eKeluar, true) }}>
              {(() => {
                const ruasG = [0, 1, 2].map((k) => R(f, jalanT[k], jalanT[k + 1], 0, 1, k === 0 ? (t: number) => t * t : k === 2 ? (t: number) => 1 - (1 - t) * (1 - t) : undefined));
                return (
                  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                    {RUAS.map((r, k) => ruasG[k] > 0.001 ? (
                      <path key={`b${k}`} d={dRuas(r)} fill="none" stroke={rgba(B.night, 0.07)} strokeWidth={JALAN_W} strokeLinecap="round" transform="translate(0 10)"
                        strokeDasharray={`${PANJANG[k]} ${PANJANG[k] + 60}`} strokeDashoffset={PANJANG[k] * (1 - ruasG[k])} />) : null)}
                    {RUAS.map((r, k) => ruasG[k] > 0.001 ? (
                      <path key={`r${k}`} d={dRuas(r)} fill="none" stroke={WARNA_RUAS[k]} strokeWidth={JALAN_W} strokeLinecap={k === 1 ? 'butt' : 'round'}
                        strokeDasharray={`${PANJANG[k]} ${PANJANG[k] + 60}`} strokeDashoffset={PANJANG[k] * (1 - ruasG[k])} />) : null)}
                    {RUAS.map((r, k) => ruasG[k] >= 0.999 ? (
                      <path key={`m${k}`} d={dRuas(r)} fill="none" stroke={rgba(B.white, 0.6)} strokeWidth={3} strokeDasharray="14 16"
                        opacity={R(f, jalanT[k + 1], jalanT[k + 1] + 20, 0, 1)} />) : null)}
                    {TUJUAN.map((t, i) => {
                      const g = R(f, t.at - 10, t.at + 50, 0, 1, io);
                      if (g <= 0.001) return null;
                      const [x, y] = TITIK[i + 1], y0 = y - KARTU_T.dy + KARTU_T.h / 2 + 8;
                      return <line key={t.nama} x1={x} y1={y0} x2={x} y2={lerp(y0, y - 26, g)} stroke={WARNA_RUAS[i]} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />;
                    })}
                  </svg>);
              })()}
              {/* titik: Sekarang · 1 · 2 · 3 tahun */}
              {['Sekarang', ...TUJUAN.map((t) => t.tahun)].map((nama, i) => {
                const p = popIn(f, jalanT[i] + (i === 0 ? 0 : 20)); // pop dimulai 10f sebelum kepala jalan tiba
                if (p <= 0.001) return null;
                const [x, y] = TITIK[i];
                const col = i === 0 ? B.turq : WARNA_RUAS[i - 1];
                const d = i === 0 || i === 3 ? 58 : 34;
                return (
                  <React.Fragment key={nama}>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, boxSizing: 'border-box',
                      border: `7px solid ${col}`, display: 'grid', placeItems: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`,
                      boxShadow: `0 8px 18px -6px ${rgba(B.night, 0.25)}` }}>
                      {i === 0 ? <Icon name="dompet" size={26} color={col} /> : i === 3 ? <Icon name="kalender" size={26} color={col} /> : null}
                    </div>
                    <div style={{ position: 'absolute', left: x - 130, width: 260, top: y + 42, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: F, fontSize: 28, fontWeight: 800, color: i === 0 ? B.gray : col }}>
                      <WordText halus f={f} at={jalanT[i] + (i === 0 ? 6 : 26)}>{nama}</WordText>
                    </div>
                  </React.Fragment>);
              })}
              {/* uang kecil berjalan di jalan dari "Sekarang" ke titik tujuannya */}
              {TUJUAN.map((t, i) => {
                const g = R(f, t.at - 40, t.at + 40, 0, 1, io);
                if (g <= 0.001 || g >= 0.999) return null;
                const [x, y] = diJalan(PANJANG.slice(0, i + 1).reduce((a, b) => a + b, 0) * g);
                return <Uang key={t.nama} x={x} y={y - 4} w={76} alfa={R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0)} />;
              })}
              {/* kartu tujuan bergambar di atas titiknya */}
              {TUJUAN.map((t, i) => {
                const p = popIn(f, t.at);
                if (p <= 0.001) return null;
                const [x, y] = TITIK[i + 1];
                return (
                  <Kaca key={t.nama} x={x} y={y - KARTU_T.dy} w={KARTU_T.w} h={KARTU_T.h} p={p} warna={WARNA_RUAS[i]} tab="atas" rona={0.5}>
                    {t.foto ? <Foto k={t.foto} x={KARTU_T.w / 2} y={100} w={t.foto === 'sekolah' ? 250 : 240} p={1} />
                      : <Kalender x={KARTU_T.w / 2} y={98} s={0.5} p={skalaPop(popIn(f, t.at + 10))} i={0} halaman={[{ atas: '2028', angka: '15' }]} lingkar={cin(f, t.at + 40)} />}
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 188, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>
                      <WordText f={f} at={t.at + 8} halus>{t.nama}</WordText>
                    </div>
                  </Kaca>);
              })}
            </div>) : null}

          {/* F1: uang kebutuhan 1–3 tahun jangan dipaksa ke indeks, apalagi ke saham */}
          {f > T.jangan - 30 && f1Keluar < 0.999 ? (
            <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - f1Keluar, true) }}>
              <Chip x={F1.uang.x} y={680} teks="Kebutuhan 1–3 tahun" ikon="kalender" warna={B.blue} p={popIn(f, T.jangan + 30)} size={26} />
              {[{ k: 'rdIndeks' as const, nama: 'Indeks', masuk: T.masuk + 10, at: T.indeks, tiba: T.jangan + 20 }, { k: 'saham' as const, nama: 'Saham', masuk: T.apalagi, at: T.saham2, tiba: T.jangan + 40 }].map((tj, i) => {
                const x0 = F1.uang.x + F1.uang.w / 2 + 10, x1 = F1.kartu.x - F1.kartu.w / 2 - 6, y1 = F1.kartu.y[i];
                const silang = cin(f, tj.at + 30);
                const [mx, my] = titikRute(x0, F1.uang.y, x1, y1, 0.5);
                return (
                  <React.Fragment key={tj.nama}>
                    <Rute x0={x0} y0={F1.uang.y} x1={x1} y1={y1} g={cin(f, tj.masuk)} warna={mixHex(B.gray, CORET, silang)} />
                    <Kaca x={F1.kartu.x} y={y1} w={F1.kartu.w} h={F1.kartu.h} p={popIn(f, tj.tiba)} warna={i === 0 ? JALUR_WARNA.feri : JALUR_WARNA.pesawat} tab="kiri" alfa={1 - 0.4 * silang}>
                      <Foto k={tj.k} x={116} y={F1.kartu.h / 2} w={156} p={1} />
                      <div style={{ position: 'absolute', left: 226, top: F1.kartu.h / 2 - 24, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                        <WordText f={f} at={tj.at + 10} halus>{tj.nama}</WordText>
                      </div>
                    </Kaca>
                    {/* silang merah di tengah rute: "jangan dipaksa" */}
                    {popIn(f, tj.at + 30) > 0.001 ? (
                      <div style={{ position: 'absolute', left: 0, top: 0, width: 68, height: 68, borderRadius: '50%', background: CORET, border: `4px solid ${B.white}`,
                        transform: `${geser(mx - 34, my - 34)} scale(${skalaPop(popIn(f, tj.at + 30))})`, display: 'grid', placeItems: 'center', boxShadow: `0 10px 22px -8px ${CORET}` }}>
                        <svg width={30} height={30} viewBox="0 0 30 30"><path d="M7 7 L23 23 M23 7 L7 23" stroke={B.white} strokeWidth={5} strokeLinecap="round" /></svg>
                      </div>) : null}
                  </React.Fragment>);
              })}
            </div>) : null}

          {/* F2: indeks turun tepat saat butuh uang (IHSG harian 3 Feb – 19 Mar 2020) + tagihan biaya sekolah */}
          {f > T.karena2 - 30 ? (
            <div style={{ position: 'absolute', inset: 0, ...gayaPapan(cin(f, T.karena2), false) }}>
              <div style={{ position: 'absolute', left: GF.x0, top: GF.y0 - 92, display: 'flex', alignItems: 'center', gap: 16, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>
                <div style={{ position: 'relative', width: 64, height: 64, flex: 'none', transform: `scale(${skalaPop(popIn(f, T.karena2 + 10))})` }}>
                  <Kendaraan x={32} y={32} d={64} warna={JALUR_WARNA.feri} ikon={JALUR_IKON.feri.ikon} cermin={JALUR_IKON.feri.cermin} p={1} />
                </div>
                <WordText f={f} at={T.indeks2} halus>Indeks</WordText>
                <span style={{ fontSize: 26, fontWeight: 700, color: B.gray }}><WordText f={f} at={T.indeks2 + 20} halus>Feb – Mar 2020</WordText></span>
              </div>
              <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                {[0, 1, 2, 3].map((k) => <line key={k} x1={GF.x0} x2={GF.x0 + GF.w * cin(f, T.karena2 + 10 + 6 * k)} y1={GF.y0 + (GF.h * k) / 3} y2={GF.y0 + (GF.h * k) / 3}
                  stroke={rgba(B.gray, 0.2)} strokeWidth={1.5} />)}
                {gIndeks > 0.001 ? <polyline points={garis(TURUN, GF.x0, GF.y0, GF.w, GF.h, GF.lo, GF.hi, gIndeks)} fill="none" stroke={JALUR_WARNA.feri} strokeWidth={6}
                  strokeLinejoin="round" strokeLinecap="round" /> : null}
                {gIndeks > 0.001 ? <circle cx={tipX} cy={tipY} r={10} fill={gIndeks > 0.999 ? ARAH.turun : JALUR_WARNA.feri} stroke={B.white} strokeWidth={3} /> : null}
              </svg>
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(1450, 420)} scale(1.3)` }}>
                <Tagihan x={0} y={0} judul="Biaya sekolah" ikon="tagihan" warna={B.blue} tempo="Maret 2020" total={rp(MODAL)} p={popIn(f, T.karena2 + 30)} sorotTempo={cin(f, T.butuh)} />
              </div>
              <PilNominal x={1450} y={660} teks={`Kurang ${rp(MODAL - AKHIR_TURUN)}`} arah={-1} p={popIn(f, T.butuh + 20)} size={30} />
            </div>) : null}

          {/* uang kebutuhan 1–3 tahun + pil nominalnya (serah-terima D → E → F1 → F2) */}
          <Uang x={uangPos.x} y={uangPos.y} w={uangPos.w} p={uangMuncul} alfa={1 - f1Keluar} />
          <PilNominal x={pilPos.x} y={pilPos.y} teks={rp(f < T.karena2 ? MODAL : nilaiIndeks)} arah={f < T.karena2 ? 0 : arahDari(nilaiIndeks)} p={pilMuncul}
            size={lerp(28, 30, keF1)} lebarMin={236} />
        </div>) : null}

      {/* ══ G / H: bukan mengejar return tertinggi, tapi menjaga uang — jalannya lebih lambat, justru itu fungsinya ══ */}
      {papanG > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {[0, 1].map((i) => {
              const x1 = KG.x[i];
              return <Penghubung key={i} d={`M 960 505 C 960 550 ${x1} 545 ${x1} ${KG.y - KG.h / 2 - 4}`} g={cin(f, (i === 0 ? T.mengejar : T.menjaga) - 24)}
                warna={i === 0 ? mixHex(GARIS, CORET, coretG) : GARIS} tebal={4} />;
            })}
          </svg>
          <Kendaraan x={KG.disc.x} y={discGY} d={KG.disc.d} warna={JALUR_WARNA.jalan} ikon={JALUR_IKON.jalan.ikon} cermin={false} p={popIn(f, T.jadi)} />
          <Label x={KG.disc.x} y={discGY + KG.disc.d / 2 + 38} teks="Investasi stabil" f={f} at={T.jadi + 20} size={34} />
          <Chip x={KG.disc.x} y={462} teks="Lebih lambat" ikon="jalanKaki" warna={JALUR_WARNA.jalan} p={popIn(f, T.lambat - 10)} size={26} />
          {[0, 1].map((i) => {
            const kejar = i === 0;
            const warna = kejar ? B.orange : JALUR_WARNA.jalan;
            const v = kejar ? SAHAM : STABIL;
            const at = kejar ? T.mengejar : T.menjaga;
            const g = R(f, at + 10, at + 90, 0, 1, io);
            return (
              <Kaca key={i} x={KG.x[i]} y={KG.y} w={KG.w} h={KG.h} p={popIn(f, at)} warna={warna} tab="atas" alfa={kejar ? 1 - 0.45 * coretG : 1}
                tepi={kejar ? 0 : fungsi}>
                <Bulat x={74} y={82} d={88} warna={warna} ikon={kejar ? 'saham' : 'lindungi'} p={popIn(f, at + 10)} />
                <div style={{ position: 'absolute', left: 136, top: 60, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                  <WordText f={f} at={at + 14} halus>{kejar ? 'Mengejar return tertinggi' : 'Menjaga uang'}</WordText>
                  {kejar && coretG > 0.001 ? <div style={{ position: 'absolute', left: -6, top: '54%', height: 6, width: `calc(${coretG} * (100% + 12px))`, background: CORET, borderRadius: 3 }} /> : null}
                </div>
                <svg width={KG.w} height={KG.h} style={{ position: 'absolute', left: 0, top: 0 }}>
                  <line x1={40} x2={KG.w - 40} y1={212} y2={212} stroke={rgba(B.gray, 0.2)} strokeWidth={1.5} />
                  {g > 0.001 ? <polyline points={garis(v, 40, 136, KG.w - 80, 70, 92, 146, g)} fill="none" stroke={warna} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" /> : null}
                </svg>
              </Kaca>);
          })}
          <Lencana x={KG.x[1] + KG.w / 2 - 10} y={KG.y - KG.h / 2 + 10} d={0} p={fungsi} warna={CEK} ikon="tersedia" besar={68} />
        </div>) : null}

    </AbsoluteFill>
    </MaskerKeluar>);
};
