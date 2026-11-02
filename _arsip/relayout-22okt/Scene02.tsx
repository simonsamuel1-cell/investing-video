import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ARAH, B, CEK, CORET, F, io, mixHex, R, rgba } from '../theme';
import { alfaP, cin, gayaPapan, Icon, naikY, opa, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Label, Lencana, geser } from '../parts/umum';
import { Kaca, KarakterLingkar, MaskerKeluar, Nomor, ORANG_SAKU, Penghubung } from '../parts/kaca';
import { S03_MASUK } from '../s03/Scene03';
import { Foto, Kalender, Uang } from '../parts/nyata';
import { JALUR_IKON, JALUR_WARNA, Kendaraan, S02_PUSAT } from '../parts/jalur';
import { Baris, IHSG_2012_2021, S15_TURUN } from '../data/pasar';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 02 — Jalan Kaki: Kenapa Investasi Stabil Itu Penting? (BATAS.s2 – BATAS.s3). Ide: 04_Asset/Ide-Visual-Scene-02.md.
 * Lingkaran jalan kaki datang dari peta bab Scene 01 (serah-terima tanpa potongan), lalu 8 papan berurutan:
 *  A tempat dana (deposito · obligasi pemerintah · obligasi perusahaan) → B meminjamkan uang: risiko bergantung pada penerima (pemerintah · bank)
 *  → C stabil vs saham (data IHSG asli, sumbu sama) + 3–5 %/th → D dua fungsi, 01 fondasi → E 02 uang waktu dekat (panel menyatu → garis waktu)
 *  → F jangan dipaksa ke indeks/saham + IHSG Feb–Mar 2020 turun saat butuh uang → G bukan mengejar return, tapi menjaga uang → H jalan lebih lambat.
 * Masuk dipusatkan di kata (±30f), pop = easeOutBack 60f, gerak/pudar = inOut cubic.
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

/* ═════════ grafik garis sederhana (data asli) ═════════ */
const tutup = (rows: Baris[]) => rows.map((r) => Number(r[4]));
const IHSG5 = tutup(IHSG_2012_2021.filter((r) => String(r[0]) >= '2015-01' && String(r[0]) <= '2019-12'));
const SAHAM = IHSG5.map((v) => (100 * v) / IHSG5[0]); // indeks 100 di Jan 2015
const STABIL = SAHAM.map((_, i) => 100 * Math.pow(1.04, i / 12)); // asumsi 4 %/th (tengah 3–5 %), sumbu SAMA dengan saham
const DOM: [number, number] = [70, 135];
const TURUN = tutup(S15_TURUN); // IHSG harian 3 Feb – 19 Mar 2020
const TURUN_PERSEN = Math.round(((TURUN[TURUN.length - 1] - TURUN[0]) / TURUN[0]) * 100); // −30
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
const titikAkhir = (v: number[], x0: number, y0: number, w: number, h: number, lo: number, hi: number, g: number): [number, number] => {
  const n = v.length - 1, ujung = g * n, i = Math.min(n - 1, Math.floor(ujung)), t = Math.min(1, ujung - i);
  const val = v[i] + (v[i + 1] - v[i]) * t;
  return [x0 + (w * ujung) / n, y0 + h - ((val - lo) / (hi - lo)) * h];
};

/* ═════════ tata letak (dihitung dari kotak tinta tiap papan; pusat isi ±30 px) ═════════ */
const PUSAT = S02_PUSAT; // lingkaran jalan kaki (dari peta bab Scene 01) — mulai di tengah
const PUSAT_TANYA = { y: 520, d: 200 }; // "Kenapa relatif stabil?" — kembali ke tengah
const GARIS = B.blue; // garis penghubung di latar biru (turkis tak terbaca di atas rona biru)
/* A: pusat (960,520) → kiri (540,520) di "aset"; dana di kanan pusat; baris aset 395/560/725 (pusat isi −37…+20 px saat baris bertambah) */
const BARIS_A = { x: 1240, w: 560, h: 130, y: [400, 565, 730] }; // isi x 376–1520 → pusat 948; y 335–795
const UANG_A = { w: 120, dx: 190 };
const PUSAT_KIRI = 540;
const ORANG = { x: 470, y: 540, D: 240 };
const TERIMA = { x: 1450, y: 540 };
const PEM = { x: 1450, y: 340, w: 280 };
const BANK = { x: 1450, y: 670, w: 220 };
const KARTU_C = { y: 545, w: 640, h: 440, x: [600, 1320] };
const KARTU_D = { y: 545, w: 580, h: 430, x: [640, 1280] };
const PANEL = { x: 960, y: 545, w: 1480, h: 540 };

/** tampil di antara dua waktu (pudar 30f dipusatkan di masing-masing) */
const antara = (f: number, masuk: number, keluar: number, d = 30) => Math.min(cin(f, masuk, d), 1 - cin(f, keluar, d));

export const Scene02: React.FC<{ f: number }> = ({ f }) => {
  if (f < A0 + 60 || f > S02_AKHIR + 90) return null;

  /* ── papan A: pusat jalan kaki → tempat dana ── */
  const papanA = 1 - cin(f, T.kenapa - 10, 30);
  /* ── pusat jalan kaki sepanjang scene: A di atas · B pudar · G turun ke tengah · H berjalan di jembatan ── */
  const keluarPusat = popOut(f, T.karena);
  const kembali = popIn(f, T.jadi + 20);
  const jalanH = cin(f, T.jalannya, 60);
  const langkah = R(f, T.jalannya + 30, S02_AKHIR - 10, 0, 1, io);
  const JEMB = { x0: 560, x1: 1360, y: 560 };
  // berjalan pelan di jembatan 760 → 1160 ("lebih lambat"); sebelum mulai, turun dari tengah ke ujung kiri jembatan
  // A: ke kiri di "aset seperti" (60f, selesai saat baris pertama datang); "Kenapa": kembali ke tengah
  // "dana": bergeser 50 px memberi ruang untuk dana (label lebar ikut menyeimbangkan); "aset seperti": ke kiri memberi ruang untuk baris aset (selesai saat baris pertama datang)
  const ruangDana = cin(f, T.dana - 10), kiri = cin(f, T.deposito - 30), turunK = cin(f, T.kenapa - 10);
  const pusatX = f < T.jadi ? PUSAT.x - 50 * ruangDana + (PUSAT_KIRI - (PUSAT.x - 50)) * kiri + (960 - PUSAT_KIRI) * turunK : 960 + (760 - 960) * jalanH + 400 * langkah * jalanH;
  // G: lingkaran + label di tengah dulu, lalu naik 110 px memberi ruang untuk dua chip ("mengejar")
  const ruangG = cin(f, T.mengejar - 24);
  const gY = 520 - 110 * ruangG;
  const pusatY = f < T.jadi ? PUSAT.y + (PUSAT_TANYA.y - PUSAT.y) * turunK : gY + (JEMB.y - gY) * jalanH;
  const pusatD = f < T.jadi ? PUSAT.d : 200 + (150 - 200) * jalanH;
  const uangX = pusatX + UANG_A.dx;
  const pusatP = f < T.jadi ? keluarPusat : kembali;

  /* ── papan B: meminjamkan uang ── */
  const papanB = antara(f, T.karena, T.dibandingkan - 10);
  const orangP = popIn(f, T.karena);
  const keKiri = cin(f, T.meminjamkan); // "Kita" muncul di tengah, bergeser ke kiri saat uang dipinjamkan (pusat: dulu sendirian di kiri ±1,5 dtk)
  const orangX = 960 + (ORANG.x - 960) * keKiri;
  const keTerima = cin(f, T.meminjamkan, 60);
  const terimaP = popIn(f, T.meminjamkan) * (1 - cin(f, T.pemerintah2 - 10, 30));
  const pemP = popIn(f, T.pemerintah2);
  const pecahBank = cin(f, T.bank - 20);
  const pemPos = { x: PEM.x, y: TERIMA.y + (PEM.y - TERIMA.y) * pecahBank, w: 300 + (PEM.w - 300) * pecahBank };
  const bankP = popIn(f, T.bank);
  const kembaliUang = antara(f, T.membayar - 20, T.kalauBank, 30);

  /* ── papan C: stabil vs saham ── */
  const papanC = antara(f, T.dibandingkan, T.dua - 10);
  const sahamKeluar = 1 - cin(f, T.memang + 30);
  const gambarC = R(f, T.pergerakan - 20, T.pergerakan + 110, 0, 1, io);

  /* ── papan D/E/F: dua fungsi → panel waktu dekat → jangan dipaksa → indeks turun ── */
  const papanD = antara(f, T.dua - 20, T.misalnya + 10);
  const satuSorot = cin(f, T.pertama) * (1 - cin(f, T.kedua));
  const duaSorot = cin(f, T.kedua);
  const menyatu = cin(f, T.misalnya + 20); // kartu 02 → panel lebar (60f), kartu 01 pudar
  const papanEF = cin(f, T.misalnya - 10, 30) * (1 - cin(f, T.jadi, 30));
  const waktuIsi = 1 - cin(f, T.uangIni, 30); // isi garis waktu pudar di "Uang seperti ini"
  const paksaIsi = antara(f, T.uangIni, T.karena2 + 10);
  const turunIsi = cin(f, T.karena2 + 20, 30);

  /* ── papan G: bukan mengejar return, tapi menjaga uang ── */
  const papanG = antara(f, T.jadi + 20, T.jalannya);

  // posisi kartu 02 → panel
  const k2 = { x: KARTU_D.x[1] + (PANEL.x - KARTU_D.x[1]) * menyatu, y: KARTU_D.y + (PANEL.y - KARTU_D.y) * menyatu,
    w: KARTU_D.w + (PANEL.w - KARTU_D.w) * menyatu, h: KARTU_D.h + (PANEL.h - KARTU_D.h) * menyatu };

  return (
    <MaskerKeluar f={f} mulai={S03_MASUK.mulai} ke={S03_MASUK} warna={S03_MASUK.warna}>
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A: tempat dana — pusat bergeser ke kiri, dana di sampingnya, tiga baris aset (atas → bawah) di kanan (pola rute V03) ══ */}
      {papanA > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanA, f > T.kenapa - 30) }}>
          <Label x={pusatX} y={pusatY + pusatD / 2 + 38} teks="Investasi relatif stabil" f={f} at={T.investasi} size={32} lebar={460} />
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {BARIS_A.y.map((y, i) => {
              const at = [T.deposito, T.obligasi, T.perusahaan][i];
              const x0 = uangX + UANG_A.w / 2 + 10, x1 = BARIS_A.x - BARIS_A.w / 2 - 8;
              return <Penghubung key={i} d={`M ${x0} ${pusatY} C ${x0 + 90} ${pusatY} ${x1 - 90} ${y} ${x1} ${y}`} g={cin(f, at - 24)} warna={GARIS} tebal={4} titik={false} />;
            })}
          </svg>
          <Uang x={uangX} y={pusatY} w={UANG_A.w} p={popIn(f, T.dana)} />
          {BARIS_A.y.map((y, i) => {
            const at = [T.deposito, T.obligasi, T.perusahaan][i];
            const foto = (['brankas', 'pemerintah', 'perusahaan'] as const)[i];
            const nama = ['Deposito', 'Obligasi pemerintah', 'Obligasi perusahaan'][i];
            const fw = [104, 150, 84][i];
            // uang kecil mengalir ke barisnya (tiba saat baris muncul)
            const t = R(f, at - 50, at + 4, 0, 1, io);
            const x0 = uangX + UANG_A.w / 2, x1 = BARIS_A.x - BARIS_A.w / 2;
            const ux = x0 + (x1 - x0) * t, uy = pusatY + (y - pusatY) * io(t);
            return (
              <React.Fragment key={nama}>
                {t > 0.001 && t < 0.999 ? <Uang x={ux} y={uy} w={58} alfa={Math.min(R(t, 0, 0.15, 0, 1), R(t, 0.85, 1, 1, 0))} /> : null}
                <Kaca x={BARIS_A.x} y={y} w={BARIS_A.w} h={BARIS_A.h} p={popIn(f, at)} warna={JALUR_WARNA.jalan} tab="kiri">
                  <Foto k={foto} x={104} y={BARIS_A.h / 2} w={fw} p={1} />
                  <div style={{ position: 'absolute', left: 196, top: BARIS_A.h / 2 - 20, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>
                    <WordText f={f} at={at + 14} halus>{nama}</WordText>
                  </div>
                </Kaca>
              </React.Fragment>);
          })}
        </div>) : null}

      {/* ══ H: jalannya lebih lambat — jembatan (di BELAKANG lingkaran jalan kaki) ══ */}
      {jalanH > 0.001 ? <div style={{ position: 'absolute', left: JEMB.x0, top: JEMB.y + 58, width: JEMB.x1 - JEMB.x0, height: 34, borderRadius: 17, background: B.white,
        border: `3px solid ${B.turq}`, boxSizing: 'border-box', transformOrigin: '50% 50%', transform: `scaleX(${jalanH})`, boxShadow: `0 10px 22px -12px ${rgba(B.turq, 0.9)}` }} /> : null}
      {/* ══ pusat jalan kaki (A · G · H) ══ */}
      <Kendaraan x={pusatX} y={pusatY} d={pusatD} warna={JALUR_WARNA.jalan} ikon={JALUR_IKON.jalan.ikon} cermin={false} p={pusatP} />
      {jalanH > 0.001 ? <Lencana x={pusatX} y={pusatY} d={pusatD} p={popIn(f, T.fungsinya)} warna={CEK} ikon="tersedia" besar={60} /> : null}
      {f < T.jadi ? <Lencana x={pusatX} y={pusatY} d={pusatD} p={popIn(f, T.kenapa) * keluarPusat} warna={B.blue} ikon="stabil" besar={70} /> : null}

      {/* ══ B: meminjamkan uang — risiko bergantung pada penerimanya ══ */}
      {papanB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanB, f > T.dibandingkan - 30) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {/* pinjaman ke penerima (umum → pemerintah) */}
            <Penghubung d={`M ${ORANG.x + ORANG.D / 2 + 30} ${ORANG.y} C ${ORANG.x + 400} ${ORANG.y} ${PEM.x - 420} ${pemPos.y} ${PEM.x - 170} ${pemPos.y}`}
              g={keTerima} warna={GARIS} tebal={5} titik={false} panah={{ x: PEM.x - 170, y: pemPos.y, sudut: 0 }} />
            {/* ke bank */}
            <Penghubung d={`M ${ORANG.x + ORANG.D / 2 + 30} ${ORANG.y} C ${ORANG.x + 400} ${ORANG.y} ${BANK.x - 420} ${BANK.y} ${BANK.x - 150} ${BANK.y}`}
              g={cin(f, T.bank - 10)} warna={GARIS} tebal={5} titik={false} panah={{ x: BANK.x - 150, y: BANK.y, sudut: 0 }} />
            {/* pemerintah membayar kembali */}
            {kembaliUang > 0.001 ? <g opacity={kembaliUang}>
              <Penghubung d={`M ${PEM.x - 80} ${pemPos.y + 120} C ${PEM.x - 260} ${pemPos.y + 210} ${ORANG.x + 330} ${ORANG.y + 210} ${ORANG.x + 120} ${ORANG.y + 120}`}
                g={cin(f, T.membayar)} warna={CEK} tebal={5} titik={false} panah={{ x: ORANG.x + 120, y: ORANG.y + 120, sudut: Math.PI * 1.18 }} />
            </g> : null}
          </svg>
          <KarakterLingkar pose={ORANG_SAKU} x={orangX} y={ORANG.y} D={ORANG.D} s={orangP} warna={B.orange} />
          <Label x={orangX} y={ORANG.y + ORANG.D / 2 + 36} teks="Kita" f={f} at={T.karena + 30} size={30} />
          {/* uang dipinjamkan: berjalan di garis ke penerima */}
          {(() => {
            const t = R(f, T.meminjamkan - 30, T.meminjamkan + 50, 0, 1, io);
            if (t <= 0 || t >= 1) return null;
            const x = orangX + 160 + (TERIMA.x - 170 - orangX - 160) * t; // berangkat dari posisi investor SAAT INI (ia sedang bergeser ke kiri)
            return <Uang x={x} y={ORANG.y - 8} w={96} alfa={Math.min(R(t, 0, 0.12, 0, 1), R(t, 0.86, 1, 1, 0))} />;
          })()}
          {/* uang kembali dari pemerintah */}
          {(() => {
            const t = R(f, T.membayar, T.membayar + 80, 0, 1, io);
            if (t <= 0 || t >= 1 || kembaliUang <= 0.01) return null;
            return <Uang x={PEM.x - 150 + (ORANG.x + 170 - PEM.x + 150) * t} y={ORANG.y + 190 - 25 * Math.sin(Math.PI * t)} w={90} alfa={Math.min(R(t, 0, 0.12, 0, 1), R(t, 0.86, 1, 1, 0))} />;
          })()}
          {/* penerima umum → pemerintah · bank */}
          <Bulat x={TERIMA.x} y={TERIMA.y} d={190} warna={B.gray} ikon="meminjamkan" p={terimaP} />
          <Label x={TERIMA.x} y={TERIMA.y + 95 + 36} teks="Penerima" f={f} at={T.menerima} size={30} alfa={1 - cin(f, T.pemerintah2 - 10, 30)} />
          <Lencana x={TERIMA.x} y={TERIMA.y} d={190} p={popIn(f, T.risiko1) * (1 - cin(f, T.pemerintah2 - 10, 30))} warna={B.orange} ikon="risiko" besar={70} />
          <Foto k="pemerintah" x={pemPos.x} y={pemPos.y} w={pemPos.w} p={pemP} />
          <Label x={pemPos.x} y={pemPos.y + pemPos.w / 3.1 + 34} teks="Pemerintah" f={f} at={T.pemerintah2 + 10} size={30} />
          <Lencana x={pemPos.x + pemPos.w * 0.18} y={pemPos.y - 4} d={pemPos.w * 0.62} p={popIn(f, T.pemerintah2 + 24)} warna={B.orange} ikon="risiko" besar={64} />
          <Foto k="bank" x={BANK.x} y={BANK.y} w={BANK.w} p={bankP} />
          <Label x={BANK.x} y={BANK.y + BANK.w * 0.46 + 34} teks="Bank" f={f} at={T.bank + 10} size={30} />
          <Lencana x={BANK.x + BANK.w * 0.12} y={BANK.y - 6} d={BANK.w * 0.72} p={popIn(f, T.risiko2)} warna={B.orange} ikon="risiko" besar={64} />
          <Chip x={BANK.x} y={BANK.y + BANK.w * 0.46 + 92} teks="Kondisi bank" ikon="tersedia" warna={CEK} p={popIn(f, T.kondisi)} size={26} />
        </div>) : null}

      {/* ══ C: stabil vs saham (sumbu sama, data IHSG Jan 2015 – Des 2019) ══ */}
      {papanC > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanC, f > T.dua - 30) }}>
          {[0, 1].map((i) => {
            const stabil = i === 0;
            const p = popIn(f, stabil ? T.dibandingkan : T.saham) * (stabil ? 1 : sahamKeluar);
            // "Memang nggak tinggi": kartu saham pergi, kartu stabil (3–5 %) ke tengah — dulu sendirian di kiri ±1,5 dtk
            const cx = stabil ? KARTU_C.x[0] + (960 - KARTU_C.x[0]) * (1 - sahamKeluar) : KARTU_C.x[1];
            const warna = stabil ? JALUR_WARNA.jalan : B.orange;
            const v = stabil ? STABIL : SAHAM;
            const G = { x0: 48, y0: 120, w: KARTU_C.w - 96, h: 250 };
            const ujung = titikAkhir(v, G.x0, G.y0, G.w, G.h, DOM[0], DOM[1], gambarC);
            // penurunan terdalam saham (puncak → lembah) — "pergerakan nilainya … lebih kecil" (stabil tak pernah turun)
            let pk = 0, dd = 0, iL = 0, iP = 0;
            v.forEach((x, k) => { if (x > v[pk]) pk = k; const d = (x - v[pk]) / v[pk]; if (d < dd) { dd = d; iL = k; iP = pk; } });
            const [lx, ly] = titikAkhir(v, G.x0, G.y0, G.w, G.h, DOM[0], DOM[1], iL / (v.length - 1));
            return (
              <Kaca key={i} x={cx} y={KARTU_C.y} w={KARTU_C.w} h={KARTU_C.h} p={p} warna={warna} tab="atas">
                <div style={{ position: 'absolute', left: 36, top: 36, display: 'flex', alignItems: 'center', gap: 14, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center' }}>
                    <Icon name={stabil ? 'stabil' : 'saham'} size={32} color={B.white} />
                  </div>
                  {stabil ? 'Investasi stabil' : 'Saham'}
                </div>
                <svg width={KARTU_C.w} height={KARTU_C.h} style={{ position: 'absolute', left: 0, top: 0 }}>
                  {[0, 1, 2, 3].map((k) => <line key={k} x1={G.x0} x2={G.x0 + G.w} y1={G.y0 + (G.h * k) / 3} y2={G.y0 + (G.h * k) / 3} stroke={rgba(B.gray, 0.18)} strokeWidth={1.5} />)}
                  {gambarC > 0.001 ? <polyline points={garis(v, G.x0, G.y0, G.w, G.h, DOM[0], DOM[1], gambarC)} fill="none" stroke={warna} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" /> : null}
                  {gambarC > 0.001 && gambarC < 0.999 ? <circle cx={ujung[0]} cy={ujung[1]} r={8} fill={warna} stroke={B.white} strokeWidth={3} /> : null}
                  {['2015', '2017', '2019'].map((th, k) => <text key={th} x={G.x0 + (G.w * [0, 24, 48][k]) / (v.length - 1)} y={G.y0 + G.h + 34} fontFamily={F} fontSize={22} fontWeight={700} fill={B.gray}>{th}</text>)}
                  {!stabil && gambarC > iL / (v.length - 1) ? (
                    <g opacity={popIn(f, T.kecil)}>
                      <line x1={lx} x2={lx} y1={ly} y2={titikAkhir(v, G.x0, G.y0, G.w, G.h, DOM[0], DOM[1], iP / (v.length - 1))[1]} stroke={ARAH.turun} strokeWidth={3} strokeDasharray="6 7" />
                      <circle cx={lx} cy={ly} r={7} fill={ARAH.turun} />
                    </g>) : null}
                </svg>
                {/* pil penurunan di KANAN titik lembah (dulu di bawahnya menimpa label tahun) */}
                {!stabil ? <Chip x={lx + 112} y={ly + 6} teks={`▼ ${Math.round(dd * 100)}%`} warna={ARAH.turun} p={popIn(f, T.kecil + 10)} size={24} /> : null}
                {/* di dalam area grafik kanan-atas, di atas ujung garis (dulu menempel judul kartu) */}
                {stabil ? <Chip x={KARTU_C.w - 190} y={126} teks="3–5% per tahun" ikon="stabil" warna={JALUR_WARNA.jalan} p={popIn(f, T.tiga)} size={26} /> : null}
              </Kaca>);
          })}
        </div>) : null}

      {/* ══ D: dua fungsi (01 fondasi · 02 uang waktu dekat) → E/F panel ══ */}
      {papanD > 0.001 || papanEF > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* kartu 01 — fondasi portofolio */}
          {papanD > 0.001 ? (
            <Kaca x={KARTU_D.x[0]} y={KARTU_D.y} w={KARTU_D.w} h={KARTU_D.h} p={popIn(f, T.dua)} warna={JALUR_WARNA.jalan} tab="atas"
              tepi={satuSorot} alfa={(1 - 0.5 * duaSorot) * (1 - cin(f, T.misalnya + 10, 30))}>
              <Nomor x={56} y={58} n={1} warna={JALUR_WARNA.jalan} p={popIn(f, T.dua + 10)} d={64} />
              <Bulat x={KARTU_D.w / 2} y={142} d={136} warna={JALUR_WARNA.jalan} ikon="fondasi" p={popIn(f, T.dua + 20)} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 228, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>
                <WordText f={f} at={T.fondasi} halus>Fondasi portofolio</WordText>
              </div>
              {/* portofolio awal: bagian terbesar = jalan kaki (stabil); proporsi ilustratif, tanpa angka */}
              {(() => {
                const g = cin(f, T.sebagian2 + 10, 70);
                const p = popIn(f, T.baru);
                if (p <= 0.001) return null;
                const w = 460, seg = [0.66 * g, 0.22 * g, 0.12 * g];
                const war = [JALUR_WARNA.jalan, JALUR_WARNA.feri, JALUR_WARNA.pesawat];
                let x = 0;
                return (
                  <div style={{ position: 'absolute', left: (KARTU_D.w - w) / 2, top: 316, width: w, height: 56, borderRadius: 28, background: rgba(B.gray, 0.12),
                    overflow: 'hidden', transform: `translateY(${naikY(p, 24)}px)`, opacity: opa(alfaP(p)) }}>
                    {seg.map((s, k) => { const el = <div key={k} style={{ position: 'absolute', left: x * w, top: 0, width: s * w, height: 56, background: war[k],
                      borderRight: s > 0.01 ? `3px solid ${B.white}` : undefined, boxSizing: 'border-box', display: 'grid', placeItems: 'center' }}>
                      {s * w > 70 ? <Icon name={JALUR_IKON[(['jalan', 'feri', 'pesawat'] as const)[k]].ikon} size={34} color={B.white}
                        style={k === 1 ? { transform: 'scaleX(-1)' } : undefined} /> : null}</div>; x += s; return el; })}
                  </div>);
              })()}
            </Kaca>) : null}

          {/* kartu 02 → panel lebar (panel menyatu, Simon 14 Okt) */}
          <Kaca x={k2.x} y={k2.y} w={k2.w} h={k2.h} p={popIn(f, T.dua + 20)} warna={B.blue} tab="atas" tepi={duaSorot * (1 - menyatu)}
            alfa={(1 - 0.5 * satuSorot) * (1 - cin(f, T.jadi, 30))}>
            <Nomor x={56} y={58} n={2} warna={B.blue} p={popIn(f, T.dua + 30)} d={64} />
            {/* isi kartu (ikon + judul) pudar saat kartu menjadi panel */}
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - cin(f, T.misalnya, 30) }}>
              <Bulat x={k2.w / 2} y={142} d={136} warna={B.blue} ikon="kalender" p={popIn(f, T.dua + 40)} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 228, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>
                <WordText f={f} at={T.jelas} halus>Kebutuhan 1–3 tahun</WordText>
              </div>
            </div>
            {/* E (naskah revisi 21 Okt): garis waktu Sekarang → 1 → 2 → 3 tahun, pita 1–3 tahun; biaya sekolah · ganti kendaraan · kebutuhan terencana
                (dana darurat dihapus — di Video 03 masuk Uang Aktif) */}
            {menyatu > 0.001 && waktuIsi > 0.001 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL.w, height: PANEL.h, opacity: Math.min(cin(f, T.misalnya + 40, 30), waktuIsi) }}>
                <div style={{ position: 'absolute', left: 110, top: 40, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Kebutuhan 1–3 tahun</div>
                {(() => {
                  const ax0 = 150, ax1 = PANEL.w - 150, ay = 430;
                  const xb = (th: number) => ax0 + ((ax1 - ax0) * th) / 3;
                  const pita = cin(f, T.satu, 60), pitaPenuh = cin(f, T.tigaTh, 60);
                  const items = [
                    { k: 'sekolah' as const, th: 1, at: T.biaya, nama: 'Biaya sekolah', w: 220 },
                    { k: 'mobilSuv' as const, th: 2, at: T.ganti, nama: 'Ganti kendaraan', w: 230 },
                    { k: null, th: 2.85, at: T.terencana, nama: 'Kebutuhan terencana', w: 0 },
                  ];
                  return (
                    <>
                      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0 }}>
                        <rect x={xb(1)} y={ay - 18} width={(xb(1 + 2 * pitaPenuh) - xb(1)) * pita + 0.01} height={36} rx={18} fill={rgba(B.blue, 0.18)} />
                        <line x1={ax0} x2={ax0 + (ax1 - ax0) * cin(f, T.kebutuhan)} y1={ay} y2={ay} stroke={B.blue} strokeWidth={4} strokeLinecap="round" />
                        {[0, 1, 2, 3].map((b) => <circle key={b} cx={xb(b)} cy={ay} r={9 * cin(f, T.kebutuhan + b * 12)} fill={B.blue} stroke={B.white} strokeWidth={3} />)}
                      </svg>
                      {[{ b: 0, t: 'Sekarang' }, { b: 1, t: '1 tahun' }, { b: 2, t: '2 tahun' }, { b: 3, t: '3 tahun' }].map((m) => (
                        <div key={m.t} style={{ position: 'absolute', left: xb(m.b) - 100, width: 200, top: ay + 30, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 700,
                          color: m.b === 0 ? B.gray : B.blue, opacity: m.b === 0 ? cin(f, T.kebutuhan + 10) : m.b === 1 ? cin(f, T.satu) : m.b === 3 ? cin(f, T.tigaTh) : cin(f, (T.satu + T.tigaTh) / 2) }}>{m.t}</div>))}
                      {items.map((it) => {
                        const p = popIn(f, it.at);
                        if (p <= 0.001) return null;
                        return (
                          <React.Fragment key={it.nama}>
                            {it.k ? <Foto k={it.k} x={xb(it.th)} y={ay - 170} w={it.w} p={p} dasar />
                              : <Kalender x={xb(it.th)} y={ay - 172} s={0.5} p={skalaPop(p)} i={0} halaman={[{ atas: '2028', angka: '15' }]} lingkar={cin(f, it.at + 30, 50)} />}
                            <div style={{ position: 'absolute', left: xb(it.th) - 150, width: 300, top: ay - 74, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night }}>
                              <WordText f={f} at={it.at + 10} halus>{it.nama}</WordText>
                            </div>
                          </React.Fragment>);
                      })}
                    </>);
                })()}
              </div>) : null}

            {/* F1: jangan dipaksa masuk ke indeks, apalagi ke saham */}
            {paksaIsi > 0.001 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL.w, height: PANEL.h, opacity: paksaIsi }}>
                <div style={{ position: 'absolute', left: 110, top: 40, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Kebutuhan 1–3 tahun</div>
                <Uang x={360} y={300} w={230} p={popIn(f, T.uangIni + 10)} />
                {[{ k: 'feri' as const, y: 190, at: T.indeks, nama: 'Indeks', masuk: T.masuk }, { k: 'pesawat' as const, y: 410, at: T.saham2, nama: 'Saham', masuk: T.apalagi }].map((tj, i) => {
                  const x = 1060;
                  const gg = cin(f, tj.masuk);
                  const silang = popIn(f, tj.at + 30);
                  const mx = 760, my = (300 + tj.y) / 2;
                  return (
                    <React.Fragment key={tj.nama}>
                      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0 }}>
                        <Penghubung d={`M 500 300 C 650 300 800 ${tj.y} ${x - 110} ${tj.y}`} g={gg} warna={mixHex(B.gray, CORET, Math.min(1, silang))} tebal={5} titik={false}
                          panah={{ x: x - 110, y: tj.y, sudut: 0 }} />
                      </svg>
                      <Kendaraan x={x} y={tj.y} d={150} warna={JALUR_WARNA[tj.k]} ikon={JALUR_IKON[tj.k].ikon} cermin={JALUR_IKON[tj.k].cermin} p={popIn(f, tj.at)} />
                      <div style={{ position: 'absolute', left: x + 100, top: tj.y - 22, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>
                        <WordText f={f} at={tj.at + 10} halus>{tj.nama}</WordText>
                      </div>
                      {/* silang merah di tengah panah: "jangan dipaksa" */}
                      {silang > 0.001 ? (
                        <div style={{ position: 'absolute', left: 0, top: 0, width: 64, height: 64, borderRadius: '50%', background: CORET, border: `4px solid ${B.white}`,
                          transform: `${geser(mx - 32 + 40 * i, my - 32)} scale(${skalaPop(silang)})`, display: 'grid', placeItems: 'center', boxShadow: `0 10px 22px -8px ${CORET}` }}>
                          <svg width={30} height={30} viewBox="0 0 30 30"><path d="M7 7 L23 23 M23 7 L7 23" stroke={B.white} strokeWidth={5} strokeLinecap="round" /></svg>
                        </div>) : null}
                    </React.Fragment>);
                })}
              </div>) : null}

            {/* F2: indeks bisa turun tepat saat butuh uang (IHSG harian 3 Feb – 19 Mar 2020) */}
            {turunIsi > 0.001 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL.w, height: PANEL.h, opacity: turunIsi }}>
                <div style={{ position: 'absolute', left: 110, top: 40, display: 'flex', alignItems: 'center', gap: 14, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: JALUR_WARNA.feri, display: 'grid', placeItems: 'center' }}>
                    <Icon name="feri" size={34} color={B.white} style={{ transform: 'scaleX(-1)' }} />
                  </div>
                  Indeks
                  <span style={{ fontSize: 24, fontWeight: 700, color: B.gray }}>Feb – Mar 2020</span>
                </div>
                {(() => {
                  const G = { x0: 120, y0: 130, w: PANEL.w - 380, h: 330 };
                  const lo = 3900, hi = 6100;
                  const g = R(f, T.indeks2 - 20, T.butuh - 10, 0, 1, io);
                  const [ex, ey] = titikAkhir(TURUN, G.x0, G.y0, G.w, G.h, lo, hi, g);
                  const butuh = popIn(f, T.butuh);
                  return (
                    <>
                      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0 }}>
                        {[0, 1, 2, 3].map((k) => <line key={k} x1={G.x0} x2={G.x0 + G.w} y1={G.y0 + (G.h * k) / 3} y2={G.y0 + (G.h * k) / 3} stroke={rgba(B.gray, 0.18)} strokeWidth={1.5} />)}
                        {g > 0.001 ? <polyline points={garis(TURUN, G.x0, G.y0, G.w, G.h, lo, hi, g)} fill="none" stroke={JALUR_WARNA.feri} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" /> : null}
                        {g > 0.001 ? <circle cx={ex} cy={ey} r={9} fill={g > 0.999 ? ARAH.turun : JALUR_WARNA.feri} stroke={B.white} strokeWidth={3} /> : null}
                      </svg>
                      {/* "tepat saat kita sedang butuh uang": kalender + uang di titik terendah */}
                      <Bulat x={ex + 120} y={ey - 30} d={110} warna={B.blue} ikon="kalender" p={butuh} />
                      <Chip x={ex + 120} y={ey - 135} teks={`▼ ${TURUN_PERSEN}%`} warna={ARAH.turun} p={popIn(f, T.turun + 40)} size={26} />
                    </>);
                })()}
              </div>) : null}
          </Kaca>
        </div>) : null}

      {/* ══ G: bukan mengejar return tertinggi, tapi menjaga uang ══ */}
      {papanG > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanG, f > T.jalannya - 20) }}>
          <Label x={960} y={gY + 100 + 38} teks="Investasi stabil" f={f} at={T.jadi + 60} size={32} lebar={420} />
          <Chip x={960} y={690} teks="Mengejar return tertinggi" ikon="saham" warna={B.orange} p={popIn(f, T.mengejar)} coret={R(f, T.tertinggi + 20, T.tertinggi + 50, 0, 1, io)} size={32} />
          <Chip x={960} y={785} teks="Menjaga uang" ikon="lindungi" warna={JALUR_WARNA.jalan} p={popIn(f, T.menjaga)} size={32} />
        </div>) : null}

    </AbsoluteFill>
    </MaskerKeluar>);
};
