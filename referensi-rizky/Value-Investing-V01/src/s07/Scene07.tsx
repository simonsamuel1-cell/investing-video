import React from 'react';
import { ARAH, B, CEK, F, HOUSE, R, io, lerp, mixHex, rgba } from '../theme';
import { Icon, WordText, cin, popOut as linOut, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Label, Lencana } from '../parts/umum';
import { Kaca, KacaMorf, MaskerKeluar, Penghubung, geser, type GeoKartu } from '../parts/kaca';
import { Foto, Sosok, TepiSubtitle, type Pose } from '../parts/nyata';
import { PilNominal } from '../parts/nominal';
import { FotoLingkar, KacaBulat, POSE_BENDA, geoBulat, geserKe } from '../parts/lingkar';
import { BilahNaik } from '../parts/transisiBentuk';
import { RISET_S08, S07_BILAH } from '../parts/waktuTransisi';
import { IHSG_MINGGUAN, PERIODE_TURUN } from '../data/ihsg.gen';
import { IHSG_2020, TURUN_2020 } from '../data/lilinS07.gen';
import { BatangLilin, KisiLilin, tumbuh } from '../parts/lilinRiil';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 07 — "Benar Belum Tentu Cepat" (VI V01, dibangun 30 Okt; Simon: "lanjutkan ke scene selanjutnya").
 * Catatan visual Simon: timeline penurunan IHSG sebagai konteks · data 92 % recovery / 3,8 tahun TIDAK dipakai (belum terverifikasi) · jangan
 * memberi kesan setiap penurunan pasti kembali ke level sebelumnya → chart menampilkan 2026 "belum pulih" apa adanya.
 * DATA RIIL: IHSG (^JKSE) harian Yahoo 2 Jan 2007 – 29 Okt 2026 → mingguan (scripts/gen-ihsg.py). Periode = puncak (tutup tertinggi 15 bulan sebelum
 * dasar) → dasar (tutup terendah di tahun itu) → pulih (tutup pertama ≥ puncak).
 *  A  bilah naik dari tangga S06 · GURU naik → menepi; "benar belum tentu langsung menghasilkan uang": Analisis benar ✓ ⇢ (jam pasir) ⇢ Uang
 *  B  panel IHSG 2007–2026: garis riil tergambar; tiap tahun yang disebut → ruas puncak→dasar memerah + pil "▼ %"
 *  C  "ketakutannya sendiri": ikon panik di tiap dasar
 *  D  panel TERBELAH jadi dua kartu: Harga turun (IHSG Jan–Mar 2020 riil) ≠ Nilai bisnis turun (laba menyusut, ilustrasi)
 *  E  dua kartu MENYATU kembali jadi chart: lama pulih tiap periode (bulan, dihitung dari data) · 2026 "Belum pulih"
 *  F  chart MENGERUT jadi jam pasir: Bisnis bagus ✓ + Harga menarik ✓ + sabar: harga mendekati nilai wajar
 *  G  "bukan cara cepat kaya" ✕ → keputusan di atas fondasi + kartu: bisnis tumbuh, harga mengikuti (ilustrasi)
 */
const PASANG: [string, string][] = [
  ['ini', 'ini'], ['sering', 'sering'], ['dalam', 'dalam'], ['benar', 'benar'], ['belum', 'belum'], ['langsung', 'langsung'], ['uang', 'uang'],
  ['ihsg', 'ihsg'], ['penurunan', 'penurunan'], ['th2008', '2008'], ['th2013', '2013'], ['th2015', '2015'], ['th2020', '2020'], ['th2025', '2025'],
  ['tekanan', 'tekanan'], ['th2026', '2026'], ['setiap', 'setiap'], ['ketakutannya', 'ketakutannya'], ['tapi', 'tapi'], ['dibedakan', 'dibedakan'],
  ['harga', 'harga'], ['turun', 'turun'], ['nilai', 'nilai'], ['bisnis', 'bisnis'], ['turun2', 'turun'], ['bukan', 'bukan'], ['sama', 'sama'],
  ['bahkan', 'bahkan'], ['pulih', 'pulih'], ['prosesnya', 'prosesnya'], ['berbulan', 'berbulan-bulan'], ['bertahun', 'bertahun-tahun'],
  ['itulah', 'itulah'], ['konsekuensi', 'konsekuensi'], ['menemukan', 'menemukan'], ['bagus', 'bagus'], ['menarik', 'menarik'], ['sabar', 'sabar'],
  ['menunggu', 'menunggu'], ['mendekati', 'mendekati'], ['wajarnya', 'wajarnya'], ['karena', 'karena'], ['bukan2', 'bukan'], ['kaya', 'kaya'],
  ['ini2', 'ini'], ['keputusan', 'keputusan'], ['dasar', 'dasar'], ['kuat', 'kuat'], ['memberi', 'memberi'], ['perkembangan', 'perkembangan'],
  ['tercermin', 'tercermin'], ['harga2', 'harga'],
];
const T = (() => {
  const v = urut(PASANG.map(([, w]) => w), BATAS.s7);
  return Object.fromEntries(PASANG.map(([n], i) => [n, v[i]])) as Record<string, number>;
})();
const AKHIR = BATAS.s8;
const ABU_TEKS = mixHex(B.gray, B.night, 0.45);
const koma = (n: number) => String(Math.abs(n).toFixed(1)).replace('.', ',');

/* ═══════════════════════ A · GURU + "BENAR BELUM TENTU LANGSUNG MENGHASILKAN UANG" ═══════════════════════ */
const GURU: Pose = { src: 'karakter/guru_menunjuk.png', w: 774, h: 1593, x0: 5, x1: 670, y0: 60, y1: 1581 };
const tA = { menepi: T.benar - 30, benar: T.benar + 10, panah: T.belum + 10, jam: T.langsung + 10, uang: T.uang - 50, keluar: T.ihsg + 8, guruKeluar: T.ihsg + 16 };
const RUMUS = { y: 440, x: [400, 690, 980], d: 180 };
/** 2 Nov (Simon: "Dari adegan awal ke adegan ihsg, orang sudah benar swipe kebawah, tapi icon iconnya gabungkan jadi 1 kemudian morphing ke panel ihsg"):
 *  tiga lingkaran BERGABUNG ke lingkaran tengah (ikon & centang pop keluar, label naik keluar, panah ditarik) 60 f di T_GABUNG, lalu lingkaran itu MORF jadi
 *  panel IHSG 60 f di tB.panel (Grafik). Dulu ketiganya pop keluar dan panel pop masuk. */
const T_GABUNG = () => T.ihsg - 20;
const geoGabung = (warna: string) => geoBulat(RUMUS.x[1], RUMUS.y, RUMUS.d, warna);
const BagianA: React.FC<{ f: number }> = ({ f }) => {
  if (f > Math.max(tA.guruKeluar + 40, tB.panel - 30)) return null;
  const xGuru = geserKe(f, tA.menepi, 960, 1390);
  const uG = cin(f, T_GABUNG()), ikonK = linOut(f, T_GABUNG());
  const k = (_j: number) => ikonK;
  const xs = [lerp(RUMUS.x[0], RUMUS.x[1], uG), RUMUS.x[1], lerp(RUMUS.x[2], RUMUS.x[1], uG)];
  const ds = [RUMUS.d, lerp(96, RUMUS.d, uG), RUMUS.d];
  const ws = [mixHex(B.blue, B.blue, uG), mixHex(B.orange, B.blue, uG), mixHex(CEK, B.blue, uG)];
  const pSiap = (p: number) => (f >= T_GABUNG() + 30 ? 1 : p); // sesudah bergabung: skala TEPAT 1 = sama dengan KacaMorf (Grafik) yang mengambil alih
  const lingkar = f < tB.panel - 30; // sesudahnya lingkaran tengah digambar KacaMorf (Grafik); guru tetap sampai selesai turun
  return (
    <>
      <TepiSubtitle><Sosok pose={GURU} x={xGuru} kaki={1010} h={760} p={linOut(f, tA.guruKeluar)} /></TepiSubtitle>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d={`M ${RUMUS.x[0] + 100} ${RUMUS.y} L ${RUMUS.x[2] - 100} ${RUMUS.y}`} g={cin(f, tA.panah) * (1 - cin(f, T_GABUNG() - 30))} warna={B.gray} tebal={4}
          panah={{ x: RUMUS.x[2] - 100, y: RUMUS.y, sudut: 0 }} />
      </svg>
      {/* bergabung: yang luar menumpuk ke lingkaran tengah (digambar dulu = di bawah); hilang saat sudah berimpit */}
      {uG < 1 ? <KacaBulat x={xs[0]} y={RUMUS.y} d={ds[0]} warna={ws[0]} p={popIn(f, tA.benar)} padat>
        <div style={{ transform: `scale(${skalaPop(k(0))})` }}><Icon name="alasan" size={96} color={B.blue} /></div></KacaBulat> : null}
      {uG < 1 ? <KacaBulat x={xs[2]} y={RUMUS.y} d={ds[2]} warna={ws[2]} p={popIn(f, tA.uang)} padat>
        <div style={{ position: 'relative', width: RUMUS.d, height: RUMUS.d, transform: `scale(${skalaPop(k(2))})` }}><Foto k="uang" x={RUMUS.d / 2} y={RUMUS.d / 2} w={RUMUS.d * 0.66} p={1} /></div>
      </KacaBulat> : null}
      <Lencana x={xs[0]} y={RUMUS.y} d={RUMUS.d} p={popIn(f, tA.benar + 20) * k(0)} warna={CEK} ikon="tersedia" besar={60} />
      <Label x={RUMUS.x[0]} y={RUMUS.y + 136} teks="Analisis benar" f={f} at={tA.benar + 10} size={30} keluar={T_GABUNG() - 30} />
      <KacaBulat x={xs[1]} y={RUMUS.y} d={ds[1]} warna={ws[1]} p={lingkar ? pSiap(popIn(f, tA.jam)) : 0} padat>
        <div style={{ transform: `scale(${skalaPop(k(1))})` }}><Icon name="kurangWaktu" size={52} color={B.orange} /></div></KacaBulat>
      <Label x={RUMUS.x[1]} y={RUMUS.y + 92} teks="Belum tentu langsung" f={f} at={tA.jam + 10} size={26} warna={ABU_TEKS} lebar={260} keluar={T_GABUNG() - 30} />
      <Label x={RUMUS.x[2]} y={RUMUS.y + 136} teks="Menghasilkan uang" f={f} at={tA.uang + 10} size={30} keluar={T_GABUNG() - 30} />
    </>);
};

/* ═══════════════════════ B–E · CHART IHSG RIIL ═══════════════════════ */
const PANEL = { x: 960, y: 505, w: 1500, h: 600 };
const geoPanel = (warna: string): GeoKartu => ({ ...PANEL, warna, tab: 'atas' });
const CH = { x0: 90, x1: 1360, y0: 120, y1: 440, t0: 2007, t1: 2026.85, v0: 800, v1: 9500 };
const xT = (t: number) => CH.x0 + ((t - CH.t0) / (CH.t1 - CH.t0)) * (CH.x1 - CH.x0);
const yV = (v: number) => CH.y1 - ((v - CH.v0) / (CH.v1 - CH.v0)) * (CH.y1 - CH.y0);
const D_GARIS = IHSG_MINGGUAN.map(([t, c], i) => `${i ? 'L' : 'M'} ${xT(t).toFixed(1)} ${yV(c).toFixed(1)}`).join(' ');
/** y garis IHSG pada x layar (interpolasi linear antar-titik mingguan — sama dengan ruas yang digambar path) */
const yKepala = (x: number) => {
  let i = IHSG_MINGGUAN.findIndex(([t]) => xT(t) >= x);
  if (i <= 0) return yV(IHSG_MINGGUAN[Math.max(0, i)][1]);
  const [ta, ca] = IHSG_MINGGUAN[i - 1], [tb, cb] = IHSG_MINGGUAN[i];
  return yV(lerp(ca, cb, (x - xT(ta)) / Math.max(1e-6, xT(tb) - xT(ta))));
};
/** ruas puncak → dasar periode p (titik mingguan di antaranya) */
const ruas = (tP: number, tD: number) => {
  const pts = IHSG_MINGGUAN.filter(([t]) => t >= tP - 0.01 && t <= tD + 0.02);
  return pts.map(([t, c], i) => `${i ? 'L' : 'M'} ${xT(t).toFixed(1)} ${yV(c).toFixed(1)}`).join(' ');
};
const RUAS = PERIODE_TURUN.map((p) => ruas(p.tPuncak, p.tDasar));
const tB = { panel: T.ihsg + 50, garis0: T.ihsg + 30, garis1: T.penurunan + 40,
  tahun: [T.th2008, T.th2013, T.th2015, T.th2020, T.th2025, T.th2026] as number[], panik: T.ketakutannya - 20 };
/** pil penurunan: posisi lokal (x, y, jangkar) — 2015 & 2026 diturunkan satu baris supaya tidak menabrak tetangganya */
const PIL = PERIODE_TURUN.map((p, i) => {
  const x = xT(p.tDasar), y = yV(p.cDasar);
  // 2 Nov (Simon: "Tag 2026 tidak sesuai dengan timeline"): tepat di bawah titik dasar 2026 rata tengah seperti tahun lain (dulu rata kanan 16 px di kirinya,
  // ±85 px di bawah → tag terbaca di 2024–2025); titik dasar 2026 55 px di bawah 2025 → kedua tag tidak bertumpuk
  if (p.tahun === '2026') return { x, y: y + 36, j: 'tengah' as const };
  return { x, y: y + 36 + (p.tahun === '2015' ? 54 : 0), j: 'tengah' as const, i };
});
/** durasi ≤ 12 bulan muncul di "berbulan-bulan", sisanya di "bertahun-tahun" (berurutan 10 f) */
const tE = { pulih: T.pulih + 20, bulan: (p: number) => ((PERIODE_TURUN[p].bulan ?? 99) <= 12 ? T.berbulan + 10 * (p % 2) : T.bertahun + 10 * p), belum: T.pulih + 30 };
const DURASI_Y = 478;
const IsiChart: React.FC<{ f: number; tahap: 'B' | 'E' }> = ({ f, tahap }) => {
  const g = tahap === 'B' ? R(f, tB.garis0, tB.garis1, 0, 1, (x) => x) : 1;
  const xKepala = lerp(CH.x0, CH.x1, g);
  return (
    <>
      <div style={{ position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <WordText f={f} at={tB.panel + 10} style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>IHSG</WordText>
        <WordText f={f} at={tB.panel + 20} style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: ABU_TEKS }}>penutupan mingguan · Jan 2007 – Okt 2026</WordText>
      </div>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id="s07-kepala"><rect x={0} y={0} width={xKepala + 2} height={PANEL.h} /></clipPath>
        </defs>
        <line x1={CH.x0} x2={CH.x1} y1={CH.y1 + 4} y2={CH.y1 + 4} stroke={B.grayLite} strokeWidth={2} />
        <g clipPath="url(#s07-kepala)">
          <path d={D_GARIS} fill="none" stroke={B.blue} strokeWidth={3.5} strokeLinejoin="round" />
          {/* ruas penurunan memerah di kata tahunnya (trim) */}
          {RUAS.map((d, i) => {
            const gr = tahap === 'B' ? cin(f, tB.tahun[i] + 10) : 1;
            return gr <= 0 ? null : <path key={i} d={d} fill="none" stroke={ARAH.turun} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"
              pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset={1000 * (1 - gr)} />;
          })}
        </g>
        {/* titik kepala: y DIINTERPOLASI di sepanjang garis pada x kepala (30 Okt malam, Simon S07: "Ada jeglek visual dan animasi" — dulu y = titik mingguan
            terdekat (Math.round): ±4 titik terlewati per frame → titik meloncat naik-turun sementara x bergerak mulus) */}
        {g > 0 && g < 1 ? <circle cx={xKepala} cy={yKepala(xKepala)} r={8} fill={B.white} stroke={B.blue} strokeWidth={4} /> : null}
        {PERIODE_TURUN.map((p, i) => {
          const pr = tahap === 'B' ? popIn(f, tB.tahun[i] + 30) : 1;
          return pr <= 0.001 ? null : <circle key={i} cx={xT(p.tDasar)} cy={yV(p.cDasar)} r={9 * skalaPop(pr)} fill={B.white} stroke={ARAH.turun} strokeWidth={4} />;
        })}
        {/* E · lama pulih: batang dari dasar sampai kembali ke puncak sebelumnya */}
        {tahap === 'E' ? PERIODE_TURUN.map((p, i) => {
          if (p.tPulih === null) return null;
          const gp = cin(f, tE.bulan(i));
          const xa = xT(p.tDasar), xb = lerp(xa, xT(p.tPulih), gp);
          return gp <= 0 ? null : <rect key={i} x={xa} y={DURASI_Y - 7} width={Math.max(0, xb - xa)} height={14} rx={7} fill={B.turq} />;
        }) : null}
      </svg>
      {/* sumbu tahun */}
      {/* label tahun: naik + opacity + motion blur saat kepala garis melewatinya (tahap B); tahap E sudah lengkap */}
      {[2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026].map((th) => (
        <div key={th} style={{ position: 'absolute', left: 0, top: 0, width: 80, textAlign: 'center', transform: geser(xT(th) - 40, 540) }}>
          <WordText f={f} at={tahap === 'B' ? tB.garis0 + (tB.garis1 - tB.garis0) * ((th - CH.t0) / (CH.t1 - CH.t0)) + 20 : tB.panel}
            style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: ABU_TEKS }}>{String(th)}</WordText>
        </div>))}
      {/* B · pil penurunan per periode (hanya tahap B; tahap E diganti batang lama pulih) */}
      {tahap === 'B' ? PERIODE_TURUN.map((p, i) => (
        <PilNominal key={i} x={PIL[i].x} y={PIL[i].y} teks={`${p.tahun} · ${koma(p.turun)}%`} arah={-1} p={popIn(f, tB.tahun[i] + 30)} size={22} jangkar={PIL[i].j} />)) : null}
      {/* C · ketakutan tiap periode */}
      {tahap === 'B' ? PERIODE_TURUN.map((p, i) => (
        <Lencana key={i} x={xT(p.tDasar)} y={yV(p.cDasar) - 46} d={0} p={popIn(f, tB.panik + 10 * i)} warna={B.orange} ikon="panik" besar={46} />)) : null}
      {tahap === 'E' ? PERIODE_TURUN.map((p, i) => p.bulan === null ? (
        // 2026: belum kembali ke puncak per data terakhir (catatan Simon: jangan memberi kesan setiap penurunan pasti pulih)
        <Chip key={i} x={xT(p.tDasar) - 70} y={yV(p.cDasar) + 50} teks="Belum pulih" warna={ARAH.turun} p={popIn(f, tE.belum)} size={20} />
      ) : (
        <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 140, textAlign: 'center', transform: geser((xT(p.tDasar) + xT(p.tPulih!)) / 2 - 70, DURASI_Y + 12) }}>
          <WordText f={f} at={tE.bulan(i) + 20} style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: B.night }}>{`${p.bulan} bln`}</WordText>
        </div>)) : null}
      {tahap === 'E' ? <Chip x={PANEL.w - 330} y={56} jangkar="kiri" teks="Lama pulih ke puncak" ikon="kurangWaktu" warna={B.turq} p={popIn(f, tE.pulih)} size={22} /> : null}
    </>);
};

/* D · dua kartu: harga turun ≠ nilai bisnis turun */
const KARTU_D = [{ x: 600, y: 505, w: 640, h: 460 }, { x: 1320, y: 505, w: 640, h: 460 }];
const tD = { belah: T.harga - 20, harga: T.harga + 10, menepi: T.nilai - 25, nilai: T.nilai + 10, laba: T.bisnis + 10, beda: T.bukan + 10, satu: T.bahkan + 10 };
/** HARGA TURUN — 30 Okt malam (Simon S07: "Ganti line chart ke candlestick (cek screenshootku, yang ingin aku ganti hanya bagian itu)"): garis → 63 CANDLE
 *  HARIAN RIIL IHSG 2 Jan – 31 Mar 2020 (scripts/gen-lilin-s07.py), tumbuh linear dari buka berurutan kiri → kanan, skala TERKUNCI. Pil = tutup tertinggi
 *  (14 Jan 6.325) → tutup terendah (24 Mar 3.938) dari candle yang sama = −37,7 % (dulu 33,7 % dari penutupan mingguan garis lama). */
const C20 = { x0: 70, x1: 570, yA: 130, yB: 350, v0: 3800, v1: 6450 };
const SLOT20 = (C20.x1 - C20.x0) / IHSG_2020.length;
const y20 = (v: number) => C20.yB - ((C20.yB - C20.yA) * (v - C20.v0)) / (C20.v1 - C20.v0);
const IsiHargaTurun: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: 'absolute', left: 40, top: 34 }}>
      <WordText f={f} at={tD.harga} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Harga turun</WordText></div>
    <svg width={640} height={460} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <g transform={`translate(${C20.x0} ${C20.yA})`}><KisiLilin w={C20.x1 - C20.x0} h={C20.yB - C20.yA} /></g>
      {IHSG_2020.map((b, k) => {
        const u = Math.max(0, Math.min(1, (f - (tD.harga + 5 + 1.2 * k)) / 12));
        return u <= 0 ? null : <BatangLilin key={b.t} c={tumbuh(b, u)} x={C20.x0 + SLOT20 * (k + 0.5)} slot={SLOT20} Y={y20} sumbu={1.4} rx={1} alfa={Math.min(1, u * 3)} />;
      })}
    </svg>
    <PilNominal x={320} y={400} teks={`IHSG Jan–Mar 2020 · ${koma(TURUN_2020)}%`} arah={-1} p={popIn(f, tD.harga + 90)} size={22} />
  </>);
const LABA = [100, 82, 61, 42];
const IsiNilaiTurun: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: 'absolute', left: 40, top: 34 }}>
      <WordText f={f} at={tD.nilai} rataBaris style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Nilai bisnis turun</WordText></div>
    <FotoLingkar pose={POSE_BENDA.gedung} x={150} y={250} D={150} s={popIn(f, tD.nilai + 10)} warna={B.blue} naik={cin(f, tD.nilai + 30)} />
    <svg width={640} height={460} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <line x1={270} x2={590} y1={340} y2={340} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
      {LABA.map((v, j) => {
        const gg = cin(f, tD.laba + 12 * j);
        const h = v * 1.8 * gg;
        return gg <= 0 ? null : <rect key={j} x={290 + j * 76} y={340 - h} width={48} height={h} rx={8} fill={j ? mixHex(B.turq, ARAH.turun, j / 3) : B.turq} />;
      })}
    </svg>
    <div style={{ position: 'absolute', left: 270, width: 320, top: 352, textAlign: 'center' }}>
      <WordText f={f} at={tD.laba + 30} style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: ABU_TEKS }}>Laba per tahun</WordText></div>
  </>);
const TidakSama: React.FC<{ x: number; y: number; d: number; p: number; warna: string }> = ({ x, y, d, p, warna }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, transformOrigin: 'center', zIndex: 6,
    borderRadius: '50%', background: B.white, border: `4px solid ${warna}`, boxSizing: 'border-box', boxShadow: `0 4px 10px -4px ${warna}59` }}>
    <svg width={d} height={d} viewBox="0 0 100 100" style={{ position: 'absolute', left: -4, top: -4 }}>
      <line x1={30} x2={70} y1={41} y2={41} stroke={warna} strokeWidth={8} strokeLinecap="round" />
      <line x1={30} x2={70} y1={59} y2={59} stroke={warna} strokeWidth={8} strokeLinecap="round" />
      <line x1={60} x2={40} y1={26} y2={74} stroke={warna} strokeWidth={8} strokeLinecap="round" />
    </svg>
  </div>);

const Grafik: React.FC<{ f: number }> = ({ f }) => {
  if (f < tB.panel - 30) return null;
  const uBelah = cin(f, tD.belah), uSatu = cin(f, tD.satu), uKerut = cin(f, tF.kerut);
  const pPanel = popIn(f, tB.panel);
  const a = geoPanel(B.blue);
  const kA: GeoKartu = { ...KARTU_D[0], warna: ARAH.turun, tab: 'atas' }, kB: GeoKartu = { ...KARTU_D[1], warna: B.blue, tab: 'atas' };
  void pPanel;
  if (f < tB.panel + 30) return <KacaMorf a={geoGabung(B.blue)} b={a} t={Math.max(0.0002, Math.min(cin(f, tB.panel), 0.9998))} padat tepi={1}
    isiB={<div style={{ position: 'absolute', inset: 0 }}><IsiChart f={f} tahap="B" /></div>} />;
  if (uBelah <= 0) return <Kaca x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={0.99996} warna={B.blue} tab="atas" padat><IsiChart f={f} tahap="B" /></Kaca>;
  if (uSatu <= 0) {
    // panel MENGERUT jadi kartu "Harga turun" di TENGAH, lalu menepi memberi ruang untuk kartu "Nilai bisnis turun" (pop) di "nilai bisnis"
    const kATengah: GeoKartu = { ...kA, x: geserKe(f, tD.menepi, 960, KARTU_D[0].x) };
    return (
      <>
        <KacaMorf a={a} b={kATengah} t={Math.min(uBelah, 0.9998)} padat isiA={<div style={{ position: 'absolute', inset: 0 }}><IsiChart f={f} tahap="B" /></div>}
          isiB={<div style={{ position: 'absolute', inset: 0 }}><IsiHargaTurun f={f} /></div>} />
        <Kaca x={KARTU_D[1].x} y={KARTU_D[1].y} w={KARTU_D[1].w} h={KARTU_D[1].h} p={popIn(f, tD.nilai - 10)} warna={B.blue} tab="atas" padat><IsiNilaiTurun f={f} /></Kaca>
        <TidakSama x={960} y={505} d={110} p={popIn(f, tD.beda) * linOut(f, tD.satu - 20)} warna={B.orange} />
      </>);
  }
  if (uKerut <= 0) {
    return (
      <>
        <KacaMorf a={kA} b={a} t={Math.min(uSatu, 0.9998)} padat isiA={<div style={{ position: 'absolute', inset: 0 }}><IsiHargaTurun f={f} /></div>}
          isiB={<div style={{ position: 'absolute', inset: 0 }}><IsiChart f={f} tahap="E" /></div>} />
        <KacaMorf a={kB} b={a} t={Math.min(uSatu, 0.9998)} padat peran="gabung" isiA={<div style={{ position: 'absolute', inset: 0 }}><IsiNilaiTurun f={f} /></div>} />
      </>);
  }
  // F · chart MENGERUT jadi jam pasir (kesabaran); sesudah selesai digambar BagianF
  if (uKerut >= 1) return null;
  return <KacaMorf a={a} b={geoBulat(JAM.x0, JAM.y, JAM.d, B.orange)} t={Math.max(0.0002, Math.min(uKerut, 0.9998))} padat tepiB={1}
    isiA={<div style={{ position: 'absolute', inset: 0 }}><IsiChart f={f} tahap="E" /></div>}
    isiB={<div style={{ width: JAM.d, height: JAM.d, display: 'grid', placeItems: 'center' }}><Icon name="kurangWaktu" size={JAM.d * 0.5} color={B.orange} /></div>} />;
};

/* ═══════════════════════ F · KONSEKUENSI: SABAR MENUNGGU ═══════════════════════ */
/** 2 Nov (Simon: "visual tidak tepat berada ditengah layar, terlalu keatas, dan spacingnya tidak konsisten"): jam pasir mendarat di tengah, lalu barisan
 *  Bisnis bagus · Harga menarik · Sabar menunggu memberi ruang dari tengah, JARAK SAMA 330 (dulu 480 · 760 · 1300); baris y 470 (+ kamera = 510), naik
 *  ke 410 saat jalur harga muncul di bawah jam pasir → kelompok tetap berpusat */
const JAM = { x0: 960, x1: 1290, y: 470, d: 220 };
const nF = (f: number) => 1 + cin(f, tF.bagus - 15) + cin(f, tF.menarik - 15);
const xF = (f: number, k: number) => 960 + (k === 2 ? (nF(f) - 1) / 2 : k - (nF(f) - 1) / 2) * 330;
const tF = { kerut: T.konsekuensi + 10, menepi: T.menemukan - 10, bagus: T.bagus - 10, menarik: T.menarik - 10, cekBagus: T.bagus + 30, cekMenarik: T.menarik + 30,
  sabar: T.sabar, jalan0: T.menunggu, jalan1: T.wajarnya + 20, keluar: T.karena + 10 };
const BagianF: React.FC<{ f: number }> = ({ f }) => {
  const uKerut = cin(f, tF.kerut);
  if (uKerut < 1 || f > tF.keluar + 40) return null;
  const x = xF(f, 2), Y = lerp(JAM.y, 410, cin(f, tF.sabar + 10));
  const k = (j: number) => linOut(f, tF.keluar + 6 * j);
  // jalur DI TENGAH di bawah barisan (dulu di bawah jam pasir kanan → kelompok berat kanan +62 px, ukur-pindai f32010–32280)
  const JALUR = { x0: 960 - 220, x1: 960 + 220, y: Y + 250 };
  const jalan = R(f, tF.jalan0, tF.jalan1, 0, 1, io); // harga merayap mendekati nilai wajar — inOut cubic (aturan 21: benda berjalan = ease, dulu linear: mulai & berhenti mendadak)
  const xHarga = lerp(JALUR.x0 + 20, JALUR.x1 - 130, jalan); // berhenti sebelum bendera — "mendekati", belum sampai
  // 30 Okt malam (Simon S07: "Animasikan line menggunakan trim path"): jalur DIGAMBAR (trim kiri → kanan) dan ditarik kembali saat keluar — dulu seluruh
  // jalur pop (skala); bendera nilai wajar = tag → pop di ujung jalur
  const gJalur = cin(f, tF.sabar + 10) * (1 - cin(f, tF.keluar + 18));
  const pBendera = popIn(f, tF.sabar + 40) * k(3);
  return (
    <>
      <KacaBulat x={x} y={Y} d={JAM.d} warna={B.orange} p={k(2)} padat><Icon name="kurangWaktu" size={JAM.d * 0.5} color={B.orange} /></KacaBulat>
      <Label x={x} y={Y + JAM.d / 2 + 44} teks="Sabar menunggu" f={f} at={tF.sabar + 10} size={30} keluar={tF.keluar - 30} />
      <FotoLingkar pose={POSE_BENDA.gedung} x={xF(f, 0)} y={Y} D={190} s={popIn(f, tF.bagus) * k(0)} warna={B.blue} naik={cin(f, tF.bagus + 20)} />
      <Lencana x={xF(f, 0)} y={Y} d={190} p={popIn(f, tF.cekBagus) * k(0)} warna={CEK} ikon="tersedia" besar={56} />
      <Label x={xF(f, 0)} y={Y + 154} teks="Bisnis bagus" f={f} at={tF.bagus + 10} size={30} keluar={tF.keluar - 30} />
      <KacaBulat x={xF(f, 1)} y={Y} d={190} warna={B.turq} p={popIn(f, tF.menarik) * k(1)} padat><Icon name="valuasi" size={96} color={B.turq} /></KacaBulat>
      <Lencana x={xF(f, 1)} y={Y} d={190} p={popIn(f, tF.cekMenarik) * k(1)} warna={CEK} ikon="tersedia" besar={56} />
      <Label x={xF(f, 1)} y={Y + 154} teks="Harga menarik" f={f} at={tF.menarik + 10} size={30} keluar={tF.keluar - 30} />
      {/* jalur: harga merayap ke nilai wajar (di bawah jam pasir) */}
      {gJalur > 0.001 ? (
        <>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <defs><clipPath id="s07-jalur"><rect x={JALUR.x0 - 20} y={JALUR.y - 30} width={(JALUR.x1 - JALUR.x0 + 40) * gJalur} height={60} /></clipPath></defs>
            <g clipPath="url(#s07-jalur)">
              <line x1={JALUR.x0} x2={JALUR.x1} y1={JALUR.y} y2={JALUR.y} stroke={B.grayLite} strokeWidth={6} strokeLinecap="round" />
              <line x1={JALUR.x0} x2={xHarga} y1={JALUR.y} y2={JALUR.y} stroke={B.blue} strokeWidth={6} strokeLinecap="round" />
            </g>
            {pBendera > 0.001 ? (
              <g transform={`translate(${JALUR.x1 - 30} ${JALUR.y}) scale(${skalaPop(pBendera)}) translate(${-(JALUR.x1 - 30)} ${-JALUR.y})`}>
                <path d={`M ${JALUR.x1 - 30} ${JALUR.y - 52} L ${JALUR.x1 - 30} ${JALUR.y + 4}`} stroke={B.turq} strokeWidth={5} strokeLinecap="round" />
                <path d={`M ${JALUR.x1 - 30} ${JALUR.y - 52} L ${JALUR.x1 + 6} ${JALUR.y - 42} L ${JALUR.x1 - 30} ${JALUR.y - 32} Z`} fill={B.turq} />
              </g>) : null}
            {popIn(f, tF.sabar + 20) * k(3) > 0.001 ? <circle cx={xHarga} cy={JALUR.y} r={14 * skalaPop(popIn(f, tF.sabar + 20) * k(3))} fill={B.white} stroke={B.blue} strokeWidth={5} /> : null}
          </svg>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 160, textAlign: 'center', transform: geser(xHarga - 80, JALUR.y - 56) }}>
            <WordText f={f} at={tF.sabar + 30} until={tF.keluar} style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: B.blue }}>Harga</WordText></div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 200, textAlign: 'center', transform: geser(JALUR.x1 - 130, JALUR.y + 22) }}>
            <WordText f={f} at={tF.sabar + 50} until={tF.keluar} style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: mixHex(B.turq, B.night, 0.35) }}>Nilai wajar</WordText></div>
        </>) : null}
    </>);
};

/* ═══════════════════════ G · BUKAN CEPAT KAYA → DASAR KUAT + WAKTU ═══════════════════════ */
const tG = { kaya: T.karena + 70, silang: T.kaya + 20, kayaKeluar: T.ini2 - 10, keputusan: T.ini2 + 55, dasar: T.dasar, kuat: T.kuat + 20,
  kartu: T.memberi, bisnis: T.perkembangan, cermin: T.tercermin };
// 2 Nov: pasangan keputusan (bilah "Dasar lebih kuat" 360 px) + kartu SIMETRIS terhadap 960 dengan celah 120 (dulu 600 / 1230 → pusat 1005), kartu sepusat
// tegak dengan kelompok keputusan (300–660 → 480)
const KARTU_G = { x: 1200, y: 520, w: 560, h: 400 }; // + kelompok keputusan turun 40 (ukur-pindai f32640–32790: −72)
const BAR_G = [40, 58, 72, 94, 112];
const BagianG: React.FC<{ f: number }> = ({ f }) => {
  if (f < tG.kaya - 40) return null;
  const pKaya = popIn(f, tG.kaya) * linOut(f, tG.kayaKeluar);
  const xK = geserKe(f, tG.kartu - 20, 960, 620);
  const gHarga = cin(f, tG.cermin + 15); // 60 f inOut cubic
  // harga mengikuti laba dengan JEDA (bentuk akhir tetap: tertinggal di awal, menyusul di ujung) — 30 Okt malam (Simon S07: "Animasikan line menggunakan
  // trim path, pada adegan terakhir kamu pop up linenya"): garis digambar TRIM saja; dulu titik-titiknya ikut naik sambil digambar (terbaca pop up)
  const HARGA_G = [30, 38, 52, 80, 106];
  const hargaPts = BAR_G.map((_, j) => [70 + j * 100, 330 - HARGA_G[j] * 1.9] as const);
  return (
    <>
      <KacaBulat x={960} y={450} d={230} warna={B.orange} p={pKaya} padat>
        <div style={{ position: 'relative', width: 230, height: 230 }}><Foto k="uang" x={115} y={118} w={150} p={1} /></div>
      </KacaBulat>
      <Lencana x={960} y={450} d={230} p={popIn(f, tG.silang) * linOut(f, tG.kayaKeluar)} warna={ARAH.turun} teks="✕" besar={70} />
      <Label x={960} y={612} teks="Cepat kaya" f={f} at={tG.kaya + 10} size={34} keluar={tG.kayaKeluar - 30} />
      {/* keputusan di atas fondasi (dasar yang lebih kuat) — di TENGAH dulu, menepi saat kartu "Beri waktu" muncul */}
      <KacaBulat x={xK} y={440} d={200} warna={B.blue} p={popIn(f, tG.keputusan)} padat><Icon name="keputusan" size={104} color={B.blue} /></KacaBulat>
      <Label x={xK} y={580} teks="Keputusan investasi" f={f} at={tG.keputusan + 10} size={30} lebar={360} />
      {popIn(f, tG.dasar) > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 360, height: 70, borderRadius: 16, background: B.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          transformOrigin: 'center', transform: `${geser(xK - 180, 630)} scale(${skalaPop(popIn(f, tG.dasar))})`, boxShadow: `0 10px 22px -14px ${rgba(B.blue, 0.5)}` }}>
          <Icon name="fondasi" size={40} color={B.white} /><span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.white }}>Dasar lebih kuat</span>
        </div>) : null}
      <Lencana x={xK} y={440} d={200} p={popIn(f, tG.kuat)} warna={CEK} ikon="tersedia" besar={60} />
      {/* bisnis tumbuh → harga mengikuti (ilustrasi) */}
      <Kaca x={KARTU_G.x} y={KARTU_G.y} w={KARTU_G.w} h={KARTU_G.h} p={popIn(f, tG.kartu)} warna={B.turq} tab="atas" padat>
        <div style={{ position: 'absolute', left: 36, top: 30 }}>
          <WordText f={f} at={tG.kartu + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Beri waktu</WordText></div>
        <svg width={KARTU_G.w} height={KARTU_G.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line x1={40} x2={520} y1={332} y2={332} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
          {BAR_G.map((v, j) => {
            const gg = cin(f, tG.bisnis + 10 * j);
            const h = v * 1.9 * gg;
            return gg <= 0 ? null : <rect key={j} x={46 + j * 100} y={332 - h} width={48} height={h} rx={8} fill={B.turqLite} />;
          })}
          {gHarga > 0 ? <path d={hargaPts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ')} fill="none" stroke={B.blue} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"
            pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset={1000 * (1 - gHarga)} /> : null}
        </svg>
        <div style={{ position: 'absolute', left: 36, bottom: 22, display: 'flex', gap: 24, fontFamily: F, fontSize: 22, fontWeight: 800, color: B.night }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, transform: `scale(${skalaPop(popIn(f, tG.bisnis + 20))})` }}><i style={{ width: 18, height: 18, borderRadius: 5, background: B.turqLite, display: 'inline-block' }} />Bisnis tumbuh</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, transform: `scale(${skalaPop(popIn(f, tG.cermin))})` }}><i style={{ width: 18, height: 4, borderRadius: 2, background: B.blue, display: 'inline-block' }} />Harga mengikuti</span>
        </div>
      </Kaca>
    </>);
};

/* ═══════════════════════ SCENE ═══════════════════════ */
export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < S07_BILAH || f > AKHIR + 80) return null;
  const isi = (
    <>
      <BagianA f={f} />
      <Grafik f={f} />
      <BagianF f={f} />
      <BagianG f={f} />
    </>);
  if (f < S07_BILAH + 90) return <BilahNaik f={f} mulai={S07_BILAH} hue={HOUSE.ungu}>{isi}</BilahNaik>;
  // S07 → S08: MASKER KELUAR — isi mengecil ke lingkaran RISET S08 (rona berganti seketika, plan.ts PAKAI_MASKER 8); lapisan komposit sejak awal
  return <MaskerKeluar f={f} mulai={AKHIR - 20} ke={RISET_S08} warna={B.blue}>
    <div style={{ position: 'absolute', inset: 0, transform: 'translate3d(0, 0, 0) rotate(0.001deg)' }}>{isi}</div></MaskerKeluar>;
};
export const S07_T = T;
