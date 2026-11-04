import React from 'react';
import { ARAH, B, CEK, F, lerp, mixHex } from '../theme';
import { Icon, WordText, cin, popOut as linOut, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Label, Lencana } from '../parts/umum';
import { Kaca, KacaMorf, ORANG_MUDA, geser, type GeoKartu } from '../parts/kaca';
import { AwanPikir, TitikPikir } from '../parts/awan';
import { FotoLingkar, KacaBulat, geoBulat, geserKe } from '../parts/lingkar';
import { Pendar } from '../parts/v06';
import { dorongLama } from '../parts/transisiBentuk';
import { S06_GABUNG, S06_KAMU, S07_BILAH } from '../parts/waktuTransisi';
import { geoGabungS06 } from '../s05/Scene05';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';

/**
 * SCENE 06 — "Value Investing Cocok untuk Siapa?" (VI V01, dibangun 30 Okt; Simon: "lanjutkan build scene 6"). Standar rombak: satu fokus per adegan,
 * benda dibawa (lingkaran ↔ panel), tanpa pudar sebagai transisi, foto "kamu" = jangkar.
 *  A  lingkaran Kesabaran + Cek alasan S05 MENYATU jadi lingkaran KAMU, foto naik (2 Nov; dulu tiga cakram) → kamu di tengah, lalu menepi; awan pikir "Cocok untuk semua orang?" → "Belum tentu".
 *  B  empat METODE (lingkaran): Trading jangka pendek · Kuantitatif · Berita & momentum · Value investing.
 *  C  tiap metode MEMEKAR jadi panel kemampuannya, lalu MENGERUT kembali:
 *       trading = kecepatan · disiplin · banyak keputusan (dalam waktu singkat)
 *       kuantitatif = data · sistem · membangun model
 *       berita/momentum = membaca informasi · perubahan · dengan cepat
 *  D  "permainan yang berbeda": tiga metode lain pop keluar, Value investing ke tengah lalu memekar:
 *       Tercepat ✕ · Memahami bisnis ✓ · Data sebagai dasar ✓ · Memberi waktu ✓
 *  E  panel MENGERUT jadi lingkaran KAMU (foto naik) + kartu "paling masuk akal kalau kamu…" — tiga syarat ✓, "Untung cepat" dicoret.
 *  F  "nggak harus ahli dari hari pertama": tangga — kamu di anak tangga "Hari pertama", puncak "Ahli"; anak tangga di antaranya DIBANGUN
 *     satu per satu ("sedikit demi sedikit") dan kamu naik.
 */
const PASANG: [string, string][] = [
  ['jadi', 'jadi'], ['cocok', 'cocok'], ['semua', 'semua'], ['belum', 'belum'], ['tentu', 'tentu'], ['setiap', 'setiap'], ['metode', 'metode'],
  ['berbeda', 'berbeda'], ['trading', 'trading'], ['kecepatan', 'kecepatan'], ['disiplin', 'disiplin'], ['keputusan', 'keputusan'], ['singkat', 'singkat'],
  ['pendekatan', 'pendekatan'], ['kuantitatif', 'kuantitatif'], ['data', 'data'], ['sistem', 'sistem'], ['model', 'model'], ['mengikuti', 'mengikuti'],
  ['berita', 'berita'], ['momentum', 'momentum'], ['membaca', 'membaca'], ['perubahan', 'perubahan'], ['cepat', 'cepat'], ['value', 'value'],
  ['permainan', 'permainan'], ['berbeda2', 'berbeda'], ['tercepat', 'tercepat'], ['tapi', 'tapi'], ['memahami', 'memahami'], ['data2', 'data'], ['dasar', 'dasar'],
  ['memberi', 'memberi'], ['hasil', 'hasil'], ['jadi2', 'jadi'], ['masuk', 'masuk'], ['kamu', 'kamu'], ['memahami2', 'memahami'], ['dibeli', 'dibeli'],
  ['mengambil', 'mengambil'], ['data3', 'data'], ['konsisten', 'konsisten'], ['panjang', 'panjang'], ['daripada', 'daripada'], ['keuntungan', 'keuntungan'],
  ['nggak', 'nggak'], ['ahli', 'ahli'], ['hari', 'hari'], ['karena', 'karena'], ['dibangun', 'dibangun'], ['sedikit', 'sedikit'], ['sedikit2', 'sedikit'],
];
const T = (() => {
  const v = urut(PASANG.map(([, w]) => w), BATAS.s6);
  return Object.fromEntries(PASANG.map(([n], i) => [n, v[i]])) as Record<string, number>;
})();
const PANEL = { x: 960, y: 500, w: 1200, h: 580 };
const geoPanel = (warna: string): GeoKartu => ({ ...PANEL, warna, tab: 'atas' });

/* ═══════════════════════ A · KAMU + AWAN PERTANYAAN ═══════════════════════ */
const KAMU = { y: S06_KAMU.y, D: S06_KAMU.D, xTepi: 680 };
const AWAN = { x: 1200, y: 380, w: 640, h: 340 };
const tA = { kamu: S06_GABUNG, naik: S06_GABUNG, menepi: T.cocok - 10, awan: T.cocok + 20, tanya: T.cocok + 30, belum: T.belum + 15,
  keluar: T.setiap - 20 };
/** 2 Nov (Simon: "Dari adegan pertanyaan ke 4 icon, seharusnya orang itu bisa kamu jadikan icon 1"): lingkaran kamu MORF jadi lingkaran metode 1 (Trading,
 *  oranye, di tengah deret) — foto TURUN di dalam maskernya, ikon pop, 60 f di pop metode 1; dulu kamu pop keluar lalu empat lingkaran baru pop */
const BagianA: React.FC<{ f: number }> = ({ f }) => {
  if (f > tB.pop(0) + 30) return null;
  const u1 = cin(f, tB.pop(0));
  const x = lerp(geserKe(f, tA.menepi, 960, KAMU.xTepi), xMetode(f, 0), u1), yK = lerp(KAMU.y, BARIS.y, u1), dK = lerp(KAMU.D, BARIS.d, u1);
  const pAwan = popIn(f, tA.awan) * linOut(f, tA.keluar);
  return (
    <>
      {/* lingkaran kamu = lingkaran Kesabaran S05 yang menyatu (S05 menggambarnya sampai S06_GABUNG + 30); foto NAIK di dalamnya selama menyatu */}
      {f >= S06_GABUNG + 30 ? (
        <KacaBulat x={x} y={yK} d={dK} warna={mixHex(B.turq, METODE[0].warna, u1)} p={0.99996} padat>
          {u1 > 0 ? <div style={{ transform: `scale(${skalaPop(popIn(f, tB.pop(0) + 10))})` }}><Icon name={METODE[0].ikon} size={BARIS.d * 0.5} color={METODE[0].warna} /></div> : null}
        </KacaBulat>) : null}
      {(() => {
        const g = f < S06_GABUNG + 30 ? geoGabungS06(f) : { x, y: yK, d: dK };
        return <FotoLingkar pose={ORANG_MUDA} x={g.x} y={g.y} D={g.d} s={1} warna={B.turq} naik={cin(f, tA.naik) * (1 - u1)} tanpaLatar />;
      })()}
      {pAwan > 0.001 ? <TitikPikir f={f} titik={[[KAMU.xTepi + 140, 340, 10], [KAMU.xTepi + 182, 300, 16]]} masuk={tA.awan - 20} keluar={tA.keluar} /> : null}
      <AwanPikir x={AWAN.x} y={AWAN.y} w={AWAN.w} h={AWAN.h} p={pAwan}>
        <div style={{ width: 440, textAlign: 'center', lineHeight: 1.2, marginTop: -30 }}>
          <WordText f={f} at={tA.tanya} style={{ fontFamily: F, fontSize: 42, fontWeight: 800, color: B.night }}>Cocok untuk semua orang?</WordText>
        </div>
      </AwanPikir>
      <Chip x={AWAN.x} y={AWAN.y + 92} teks="Belum tentu" ikon="keputusan" warna={B.orange} p={popIn(f, tA.belum) * linOut(f, tA.keluar - 6)} size={30} />
    </>);
};

/* ═══════════════════════ B–D · EMPAT METODE ═══════════════════════ */
type Kemampuan = { ikon: KunciIkon; teks: string; at: () => number; warna: string };
type Metode = { nama: string; ikon: KunciIkon; warna: string; mekar: () => number; kerut: () => number; kemampuan: Kemampuan[]; catatan?: { teks: string; ikon: KunciIkon; at: () => number } };
const METODE: Metode[] = [
  { nama: 'Trading jangka pendek', ikon: 'ponselGrafik', warna: B.orange, mekar: () => T.kecepatan - 20, kerut: () => T.pendekatan - 5,
    kemampuan: [{ ikon: 'cepat', teks: 'Kecepatan', at: () => T.kecepatan, warna: B.orange }, { ikon: 'disiplin', teks: 'Disiplin', at: () => T.disiplin, warna: B.blue },
      { ikon: 'keputusan', teks: 'Banyak keputusan', at: () => T.keputusan, warna: B.turq }],
    catatan: { teks: 'Dalam waktu singkat', ikon: 'waktu', at: () => T.singkat + 10 } },
  { nama: 'Pendekatan kuantitatif', ikon: 'dataAngka', warna: B.turq, mekar: () => T.data - 40, kerut: () => T.mengikuti - 5,
    kemampuan: [{ ikon: 'dataAngka', teks: 'Data', at: () => T.data, warna: B.turq }, { ikon: 'sistem', teks: 'Sistem', at: () => T.sistem, warna: B.blue },
      { ikon: 'modelValuasi', teks: 'Membangun model', at: () => T.model - 10, warna: B.orange }] },
  { nama: 'Berita & momentum', ikon: 'berita', warna: B.blueLite, mekar: () => T.membaca - 40, kerut: () => T.value - 5,
    kemampuan: [{ ikon: 'berita', teks: 'Membaca informasi', at: () => T.membaca, warna: B.blue }, { ikon: 'naikTurun', teks: 'Perubahan', at: () => T.perubahan, warna: B.turq },
      { ikon: 'cepat', teks: 'Dengan cepat', at: () => T.cepat, warna: B.orange }] },
  { nama: 'Value investing', ikon: 'perusahaan', warna: B.blue, mekar: () => T.berbeda2 + 30, kerut: () => T.jadi2 + 15, kemampuan: [] },
];
const BARIS = { y: 430, d: 190, x: [465, 795, 1125, 1455] };
const SEBUT = [T.trading, T.kuantitatif, T.berita];
const tB = { pop: (k: number) => T.metode + 15 + 20 * k, keluarLain: T.permainan - 10, keTengah: T.permainan + 10 };
const uMetode = (f: number, k: number) => cin(f, METODE[k].mekar()) * (1 - cin(f, METODE[k].kerut()));
/** posisi lingkaran metode k — 30 Okt malam (Simon S06: "Ketika adegan masuk ke value investing, gabungkan saja ke 4 icon itu"): keempat lingkaran DIAM di
 *  barisnya dan MENYATU jadi panel Value investing (dulu tiga metode lain pop keluar dan Value investing bergeser ke tengah dulu) */
// 2 Nov: TENGAH DULU LALU MEMBERI RUANG (seperti sektor S04) — lingkaran 1 (= kamu) di tengah, deret bergeser saat 2–4 pop (geser 15 f sebelum pop);
// akhir = BARIS.x (sesudah keempatnya ada, sebelum panel pertama memekar)
const xMetode = (f: number, k: number) => 960 + (k - [1, 2, 3].reduce((a, j) => a + cin(f, tB.pop(j) - 15), 0) / 2) * 330;
/** mulai menyatu (sama dengan panel Value investing memekar) */
const uGabung = (f: number) => cin(f, METODE[3].mekar());

const KepalaPanel: React.FC<{ f: number; m: Metode; at: number }> = ({ f, m, at }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 60, height: 60, borderRadius: '50%', border: `4px solid ${m.warna}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', background: B.white,
      transform: `scale(${skalaPop(popIn(f, at - 10))})` }}><Icon name={m.ikon} size={34} color={m.warna} /></div>
    <WordText f={f} at={at} style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>{m.nama}</WordText>
  </div>);
/** isi panel metode 0–2: tiga kemampuan (lingkaran besar, label di bawah) + catatan */
/** 30 Okt malam (seluruh video, Simon: "Jika belum ada visual lain yang muncul pastikan kamu membangunnya tepat di tengah frame"): TENGAH DULU LALU MEMBERI
 *  RUANG — butir pertama di tengah panel, butir berikut pop di tempatnya sementara yang lama bergeser (60 f di kata butir itu); dulu slot tetap kiri → kanan */
/** 2 Nov (Simon: "Alignment dan spacing dari masing masing isi icon itu tidak konsisten"): SEMUA panel metode & Value investing memakai baris ikon y 300,
 *  label +125, jarak 300 (dulu 270/280 · 395/405 · 340/280) */
const Y_ISI = 300, JARAK_ISI = 300;
const xDeret = (f: number, at: number[], j: number, jarak: number) => {
  const n = 1 + at.slice(1).reduce((a, t) => a + cin(f, t - 15), 0); // geser 15 f sebelum pop
  return PANEL.w / 2 + (j - (n - 1) / 2) * jarak;
};
const IsiMetode: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const m = METODE[k], ats = m.kemampuan.map((c) => c.at()), xs = [0, 1, 2].map((j) => xDeret(f, ats, j, JARAK_ISI));
  return (
    <>
      <KepalaPanel f={f} m={m} at={m.mekar() + 20} />
      {m.kemampuan.map((c, j) => (
        <React.Fragment key={j}>
          <KacaBulat x={xs[j]} y={Y_ISI} d={150} warna={c.warna} p={popIn(f, c.at())} padat><Icon name={c.ikon} size={80} color={c.warna} /></KacaBulat>
          <Label x={xs[j]} y={Y_ISI + 125} teks={c.teks} f={f} at={c.at() + 10} size={30} lebar={280} />
        </React.Fragment>))}
      {m.catatan ? <Chip x={PANEL.w / 2} y={Y_ISI + 215} teks={m.catatan.teks} ikon={m.catatan.ikon} warna={B.orange} p={popIn(f, m.catatan.at())} size={28} /> : null}
    </>);
};
/** isi panel Value investing: permainan yang berbeda */
const NILAI: { ikon: KunciIkon; teks: string; at: () => number; tanda: 'x' | 'v'; tandaAt: () => number; warna: string }[] = [
  { ikon: 'cepat', teks: 'Tercepat', at: () => T.tercepat - 10, tanda: 'x', tandaAt: () => T.tercepat + 30, warna: B.orange },
  { ikon: 'alasan', teks: 'Memahami bisnis', at: () => T.memahami, tanda: 'v', tandaAt: () => T.memahami + 40, warna: B.blue },
  { ikon: 'laporanKeuangan', teks: 'Data sebagai dasar', at: () => T.data2, tanda: 'v', tandaAt: () => T.dasar + 20, warna: B.turq },
  { ikon: 'kurangWaktu', teks: 'Memberi waktu', at: () => T.memberi, tanda: 'v', tandaAt: () => T.hasil + 10, warna: B.orange },
];
const IsiValue: React.FC<{ f: number }> = ({ f }) => {
  const ats = NILAI.map((n) => n.at()), xs = [0, 1, 2, 3].map((j) => xDeret(f, ats, j, JARAK_ISI));
  return (
    <>
      <KepalaPanel f={f} m={METODE[3]} at={METODE[3].mekar() + 20} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 108, textAlign: 'center' }}>{/* di bawah judul tengah (dulu rata kanan sebaris judul) */}
        <WordText f={f} at={METODE[3].mekar() + 30} style={{ fontFamily: F, fontSize: 28, fontWeight: 700, color: mixHex(B.gray, B.night, 0.45) }}>Permainan yang berbeda</WordText>
      </div>
      {NILAI.map((n, j) => (
        <React.Fragment key={j}>
          <KacaBulat x={xs[j]} y={Y_ISI} d={150} warna={n.warna} p={popIn(f, n.at())} padat><Icon name={n.ikon} size={80} color={n.warna} /></KacaBulat>
          <Lencana x={xs[j]} y={Y_ISI} d={150} p={popIn(f, n.tandaAt())} warna={n.tanda === 'x' ? ARAH.turun : CEK} ikon={n.tanda === 'v' ? 'tersedia' : undefined} teks={n.tanda === 'x' ? '✕' : undefined} besar={60} />
          <Label x={xs[j]} y={Y_ISI + 125} teks={n.teks} f={f} at={n.at() + 10} size={30} lebar={280} />
        </React.Fragment>))}
    </>);
};
const Metode: React.FC<{ f: number }> = ({ f }) => (
  <>
    {METODE.map((m, k) => {
      const p = popIn(f, tB.pop(k));
      const u = uMetode(f, k);
      const x = xMetode(f, k);
      if (f >= m.kerut() + 30 && k === 3) return null; // panel Value investing sudah mengerut jadi lingkaran KAMU (bagian E)
      return (
        <React.Fragment key={k}>
          {u <= 0 && uGabung(f) <= 0 && (k > 0 || f >= tB.pop(0) + 30) ? <KacaBulat x={x} y={BARIS.y} d={BARIS.d} warna={m.warna} p={k ? p : 0.99996} padat tepi={1}><Icon name={m.ikon} size={BARIS.d * 0.5} color={m.warna} /></KacaBulat> : null}
          {/* metode yang sedang DISEBUT (sebelum panelnya memekar) bercahaya */}
          {u <= 0 && k < 3 ? <Pendar x={x} y={BARIS.y} d={BARIS.d} s={cin(f, SEBUT[k]) * (1 - cin(f, m.mekar()))} warna={m.warna} /> : null}
          {/* nama metode tetap ada (tertutup panel padat saat panel terbuka); keluar bersama lingkarannya di "permainan yang berbeda" */}
          <Label x={x} y={BARIS.y + BARIS.d / 2 + 46} teks={m.nama} f={f} at={tB.pop(k) + 10} size={28} lebar={300} keluar={METODE[3].mekar() - 30} />
        </React.Fragment>);
    })}
    {/* panel memekar dari lingkarannya (padat, di atas lingkaran lain) */}
    {METODE.map((m, k) => {
      const u = uMetode(f, k);
      if (u <= 0 || k === 3) return null;
      return <KacaMorf key={k} a={geoBulat(xMetode(f, k), BARIS.y, BARIS.d, m.warna)} b={geoPanel(m.warna)} t={Math.min(u, 0.9998)} tepi={1} padat z={5}
        isiA={<div style={{ width: BARIS.d, height: BARIS.d, display: 'grid', placeItems: 'center' }}><Icon name={m.ikon} size={BARIS.d * 0.5} color={m.warna} /></div>}
        isiB={<div style={{ position: 'absolute', inset: 0 }}><IsiMetode f={f} k={k} /></div>} />;
    })}
  </>);

/* ═══════════════════════ E · PALING MASUK AKAL KALAU KAMU… ═══════════════════════ */
/** 2 Nov (Simon: "Alignment dan spacing pada visual orang dengan checklist tidak konsisten"): pusat tegak orang (kepala menyembul ±100 di atas lingkaran
 *  → blok 300–700) = pusat kartu (500); celah 170, pasangan simetris terhadap 960 (dulu lingkaran y 520 vs kartu 520 → orang 50 px lebih tinggi, x 560/1220) */
const KAMU_E = { x: 555, y: 550, D: 300 };
const KARTU_E = { x: 1195, y: 500, w: 640, h: 480 };
const SYARAT: { ikon: KunciIkon; teks: string; at: () => number; cek: () => number; warna: string }[] = [
  { ikon: 'alasan', teks: 'Ingin memahami apa yang dibeli', at: () => T.memahami2 - 20, cek: () => T.dibeli + 20, warna: B.blue },
  { ikon: 'laporanKeuangan', teks: 'Keputusan dari bisnis & data', at: () => T.mengambil, cek: () => T.data3 + 20, warna: B.turq },
  { ikon: 'pertumbuhan', teks: 'Konsisten dalam jangka panjang', at: () => T.konsisten - 10, cek: () => T.panjang + 20, warna: B.orange },
];
// kartu pop BERSAMA butir pertamanya di "memahami" (dulu di "kamu": kartu kosong ±1 dtk, f26586–26617 — aturan panel muncul bersama isinya)
const tE = { kerut: METODE[3].kerut(), naik: METODE[3].kerut() + 40, kartu: T.memahami2 - 20, coret: T.keuntungan + 20, cepatCoret: T.daripada + 10, keluar: T.nggak - 10 };
/** G5 "tengah dulu, lalu memberi ruang": lingkaran KAMU mendarat di TENGAH, menepi ke x 560 tepat sebelum kartu pop (dulu langsung di kiri → sendirian
 *  ±1,8 dtk, audit PUSAT f26420–26526); pusat geser 20 f sebelum kartu supaya tepi lingkaran tak menyentuh kartu yang sedang pop */
const xKamuE = (f: number) => geserKe(f, tE.kartu - 20, 960, KAMU_E.x);
/** Value investing: lingkaran → panel (D) → MENGERUT jadi lingkaran KAMU (E) */
const ValueKeKamu: React.FC<{ f: number }> = ({ f }) => {
  const m = METODE[3];
  const uM = cin(f, m.mekar()), uK = cin(f, m.kerut());
  if (uM <= 0) return null;
  if (uK <= 0) {
    // EMPAT lingkaran menyatu jadi satu panel (pola sektor S04): tiga metode lain = kartu 'gabung' (badannya surut di paruh akhir), Value investing
    // membawa isi panel; ikon di dalam lingkaran memudar sepanjang morf
    return <>{[0, 1, 2, 3].map((k) => (
      <KacaMorf key={k} a={geoBulat(BARIS.x[k], BARIS.y, BARIS.d, METODE[k].warna)} b={geoPanel(m.warna)} t={Math.min(uM, 0.9998)} tepi={1} padat z={5}
        peran={k < 3 ? 'gabung' : undefined}
        isiA={<div style={{ width: BARIS.d, height: BARIS.d, display: 'grid', placeItems: 'center' }}><Icon name={METODE[k].ikon} size={BARIS.d * 0.5} color={METODE[k].warna} /></div>}
        isiB={k === 3 ? <div style={{ position: 'absolute', inset: 0 }}><IsiValue f={f} /></div> : undefined} />))}</>;
  }
  return null; // sesudah mulai mengerut: digambar BagianE (panel → lingkaran KAMU)
};
const BagianE: React.FC<{ f: number }> = ({ f }) => {
  const m = METODE[3];
  const uK = cin(f, m.kerut());
  if (uK <= 0 || f > T.sedikit2 + 200) return null;
  const pKartu = popIn(f, tE.kartu) * linOut(f, tE.keluar);
  return (
    <>
      {uK < 1 ? <KacaMorf a={geoPanel(m.warna)} b={geoBulat(xKamuE(f), KAMU_E.y, KAMU_E.D, B.turq)} t={Math.max(0.0002, uK)} tepiB={1} padat z={5}
        isiA={<div style={{ position: 'absolute', inset: 0 }}><IsiValue f={f} /></div>} /> : null}
      <Kaca x={KARTU_E.x} y={KARTU_E.y} w={KARTU_E.w} h={KARTU_E.h} p={pKartu} warna={B.blue} tab="atas" padat>
        {SYARAT.map((sy, j) => {
          const y = 90 + 120 * j;
          return (
            <React.Fragment key={j}>
              <KacaBulat x={70} y={y} d={84} warna={sy.warna} p={popIn(f, sy.at())} padat><Icon name={sy.ikon} size={46} color={sy.warna} /></KacaBulat>
              <div style={{ position: 'absolute', left: 134, top: y - 34, width: 400, lineHeight: 1.15 }}>
                <WordText f={f} at={sy.at() + 10} rataBaris style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>{sy.teks}</WordText>
              </div>
              <Lencana x={590} y={y} d={0} p={popIn(f, sy.cek())} warna={CEK} ikon="tersedia" besar={52} />
            </React.Fragment>);
        })}
        <Chip x={KARTU_E.w / 2} y={430} teks="Untung cepat" ikon="cepat" warna={B.gray} p={popIn(f, tE.cepatCoret)} coret={cin(f, tE.coret)} size={26} />
      </Kaca>
    </>);
};

/* ═══════════════════════ F · TANGGA: DIBANGUN SEDIKIT DEMI SEDIKIT ═══════════════════════ */
/** 30 Okt malam: tangga lebih besar (dulu 950 × 350, kamu 150) & anak tangga = BALOK berwarna tint (dulu kartu putih tinggi → kolom "Ahli" terbaca sebagai
 *  kartu kosong, survei f28800) */
const TANGGA = { x0: 960 - 2.5 * 236, w: 236, dasar: 790, naik: 86, n: 5 };
const xAnak = (k: number) => TANGGA.x0 + TANGGA.w * (k + 0.5);
const atasAnak = (k: number) => TANGGA.dasar - TANGGA.naik * (k + 1);
const D_KAMU_F = 176;
// 2 Nov (Simon: "timing orang mengecil dengan tangga muncul seharusnya bersamaan"): pindah = ujung (dulu T.ahli + 10, ±40 f sesudah tangga)
const tF = { pindah: T.nggak + 40, ujung: T.nggak + 40, labelAhli: T.ahli + 20, hari: T.hari + 10,
  bangun: [T.dibangun, T.sedikit, T.sedikit2], naik: [T.dibangun + 30, T.sedikit + 30, T.sedikit2 + 30] };
/** anak tangga tempat kamu berdiri (pecahan, ter-ease per langkah) */
const langkahKamu = (f: number) => tF.naik.reduce((a, t) => a + cin(f, t), 0);
const BagianF: React.FC<{ f: number }> = ({ f }) => {
  const m = METODE[3];
  const uK = cin(f, m.kerut());
  if (uK <= 0) return null;
  // kamu: lingkaran E (hasil mengerut) → anak tangga pertama (bergeser & mengecil) → naik anak tangga satu per satu
  const pindah = cin(f, tF.pindah);
  const L = langkahKamu(f);
  const k0 = Math.floor(Math.min(L, 2.999)), fr = L - k0;
  const yLangkah = lerp(atasAnak(k0), atasAnak(k0 + 1), fr) - D_KAMU_F / 2 - 4 - Math.sin(Math.PI * fr) * 40; // lompat kecil di tiap anak tangga
  const xLangkah = lerp(xAnak(k0), xAnak(k0 + 1), fr);
  const x = lerp(xKamuE(f), xLangkah, pindah), y = lerp(KAMU_E.y, yLangkah, pindah), D = lerp(KAMU_E.D, D_KAMU_F, pindah);
  // 2 Nov (Simon: "Pada tiap tangga jangan gunakan pop up. Scale vertikal saja dari 0 ke 100, dengan easeinout cubic"): skala Y 0 → 1 dari dasar, 60 f
  const anakP = (k: number) => (k === 0 || k === 4 ? cin(f, tF.ujung + 10 * (k ? 1 : 0)) : cin(f, tF.bangun[k - 1]));
  return (
    <>
      {[0, 1, 2, 3, 4].map((k) => {
        const p = anakP(k);
        const h = TANGGA.dasar - atasAnak(k);
        return p <= 0 ? null : (
          <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: TANGGA.w - 12, height: h, borderRadius: 18, overflow: 'hidden', transformOrigin: '50% 100%',
            transform: `${geser(xAnak(k) - (TANGGA.w - 12) / 2, atasAnak(k))} scaleY(${p})`, background: mixHex(k === 4 ? B.blue : B.turq, B.white, 0.78),
            boxShadow: '0 10px 24px -14px rgba(18,16,48,.35)' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: k === 4 ? B.blue : B.turq }} />
          </div>);
      })}
      <Chip x={xAnak(0)} y={atasAnak(0) + 48} teks="Hari pertama" warna={B.turq} p={popIn(f, tF.hari)} size={26} />
      <KacaBulat x={xAnak(4)} y={atasAnak(4) - 86} d={130} warna={B.blue} p={popIn(f, tF.labelAhli)} padat><Icon name="kemampuan" size={72} color={B.blue} /></KacaBulat>
      <Label x={xAnak(4)} y={atasAnak(4) + 52} teks="Ahli" f={f} at={tF.labelAhli + 10} size={34} />
      <FotoLingkar pose={ORANG_MUDA} x={x} y={y} D={D} s={1} warna={B.turq} naik={cin(f, tE.naik)} latar={B.white} />
    </>);
};

/* ═══════════════════════ SCENE ═══════════════════════ */
export const Scene06: React.FC<{ f: number }> = ({ f }) => {
  // akhir: bilah S07 naik menutup; isi S06 ikut terdorong naik 320 px ease-in (resep V06) lalu berhenti dirender saat bilah kedua menutup penuh
  if (f < S06_GABUNG - 30 || f >= S07_BILAH + 76) return null;
  const dorong = dorongLama(f, S07_BILAH);
  const isi = (
    <>
      <BagianA f={f} />
      {f >= tB.pop(0) - 30 ? <Metode f={f} /> : null}
      <ValueKeKamu f={f} />
      <BagianE f={f} />
      <BagianF f={f} />
    </>);
  return <div style={{ position: 'absolute', inset: 0, transform: dorong ? `translate3d(0, ${dorong}px, 0)` : undefined }}>{isi}</div>;
};
export const S06_T = T;
