import React from 'react';
import { ARAH, B, CEK, F, R, SISI, io, lerp, mixHex } from '../theme';
import { Icon, WordText, cin, popOut as linOut, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Label, Lencana } from '../parts/umum';
import { Chevron, KacaMorf, ORANG_MUDA, Penghubung, geser, type GeoKartu } from '../parts/kaca';
import { Foto } from '../parts/nyata';
import { AngkaBulat, FotoLingkar, KacaBulat, POSE_BENDA, geoBulat, geserKe } from '../parts/lingkar';
import { FOTO as POTRET, FotoLingkar as FotoPotret } from '../s03/Scene03';
import { TIMBANGAN as TB } from './geo05';
import { S06_GABUNG, S06_KAMU } from '../parts/waktuTransisi';
import { BatangLilin, KisiLilin, tumbuh } from '../parts/lilinRiil';
import { IHSG_S05, RESISTANCE_S05, SUPPORT_S05 } from '../data/lilinS05.gen';
import { urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';

/**
 * SCENE 05 — "Kelebihannya Jelas, Kekurangannya Juga Nyata" (VI V01, dibangun 30 Okt dengan standar rombak: satu benda utama, tanpa papan berjudul
 * ala slide, tanpa pudar sebagai transisi).
 * SATU benda dibawa sepanjang scene: TIMBANGAN. Masker S04 mendarat di porosnya → tiang, lengan, dua piring tumbuh.
 *  · "tiga kelebihan" → tiga keping ✓ jatuh di piring kiri, lengan miring ke kiri.
 *  · tiap kelebihan: kepingnya MEMEKAR jadi panel di tengah, lalu MENGERUT kembali ke piring:
 *      1 bisnis nyata: apa yang dijual (foto belanja) › berapa yang dihasilkan (foto uang) › bisa terus berkembang (foto tumbuh)
 *      2 lintas generasi: foto Graham · Buffett · Munger · Klarman di garis waktu (kilas balik S03) · "Puluhan tahun"
 *      3 dipelajari & diakumulasi: kamu (foto) · perusahaan dipelajari bertambah satu per satu · pola bisnis tersambung · dasar keputusan menebal
 *  · "kelemahannya juga nyata" → dua keping ✕ di piring kanan, lengan kembali DATAR.
 *      1 riset sulit & makan waktu: satu perusahaan (foto gedung) dikelilingi laporan keuangan · model bisnis · kompetisi · risiko · valuasi
 *      2 hasil lambat: perusahaan bagus, harga murah, harga tetap rendah berbulan-bulan (garis tumbuh bulan demi bulan), nilai wajar di atasnya
 *  · "Jadi tantangan terbesar…": timbangan swipe keluar → "Menemukan undervalued" (tengah) → bukan itu: KESABARAN (jam pasir, cincin menunggu
 *    terisi sampai "terbukti") → memberi ruang: "Cek alasan membeli" ✓.
 * Angka chart = ILUSTRASI (dilaporkan ke Simon).
 */
const PASANG: [string, string][] = [
  ['kalau', 'kalau'], ['dirangkum', 'dirangkum'], ['tiga', 'tiga'], ['kelebihan', 'kelebihan'], ['utama', 'utama'], ['pertama', 'pertama'], ['keputusan', 'keputusan'],
  ['bisnis', 'bisnis'], ['nyata', 'nyata'], ['apa', 'apa'], ['dijual', 'dijual'], ['berapa', 'berapa'], ['dihasilkan', 'dihasilkan'], ['apakah', 'apakah'],
  ['berkembang', 'berkembang'], ['kedua', 'kedua'], ['pendekatannya', 'pendekatannya'], ['digunakan', 'digunakan'], ['berbagai', 'berbagai'],
  ['generasi', 'generasi'], ['investor', 'investor'], ['puluhan', 'puluhan'], ['tahun', 'tahun'], ['ketiga', 'ketiga'], ['kemampuannya', 'kemampuannya'],
  ['dipelajari', 'dipelajari'], ['diakumulasi', 'diakumulasi'], ['semakin', 'semakin'], ['perusahaan', 'perusahaan'], ['pelajari', 'pelajari'],
  ['semakin2', 'semakin'], ['pola', 'pola'], ['kenal', 'kenal'], ['semakin3', 'semakin'], ['dasar', 'dasar'], ['keputusan2', 'keputusan'], ['berikutnya', 'berikutnya'],
  ['tapi', 'tapi'], ['kelemahannya', 'kelemahannya'], ['nyata2', 'nyata'], ['pertama2', 'pertama'], ['risetnya', 'risetnya'], ['sulit', 'sulit'], ['waktu', 'waktu'],
  ['memahami', 'memahami'], ['perusahaan2', 'perusahaan'], ['membaca', 'membaca'], ['laporan', 'laporan'], ['model', 'model'], ['kompetisi', 'kompetisi'],
  ['risiko', 'risiko'], ['valuasinya', 'valuasinya'], ['kedua2', 'kedua'], ['hasilnya', 'hasilnya'], ['lambat', 'lambat'], ['menemukan', 'menemukan'],
  ['bagus', 'bagus'], ['murah', 'murah'], ['market', 'market'], ['setuju', 'setuju'], ['harga', 'harga'], ['rendah', 'rendah'], ['berbulan', 'berbulan-bulan'],
  ['lebih', 'lebih'], ['lama', 'lama'], ['jadi', 'jadi'], ['tantangan', 'tantangan'], ['bukan', 'bukan'], ['menemukan2', 'menemukan'], ['undervalued', 'undervalued'],
  ['tapi2', 'tapi'], ['kesabaran', 'kesabaran'], ['menunggu', 'menunggu'], ['terbukti', 'terbukti'], ['sambil', 'sambil'], ['mengecek', 'mengecek'],
  ['alasan', 'alasan'], ['membeli', 'membeli'], ['masuk', 'masuk'], ['akal', 'akal'],
];
const T = (() => {
  const v = urut(PASANG.map(([, w]) => w), BATAS.s5);
  return Object.fromEntries(PASANG.map(([n], i) => [n, v[i]])) as Record<string, number>;
})();
const AWAL = BATAS.s5;
const DARAT = AWAL + 40; // masker S04 mendarat di poros (MaskerKeluar mulai AKHIR S04 − 20, 60 f)
const ABU_TEKS = mixHex(B.gray, B.night, 0.45);
const MERAH_TEKS = mixHex(ARAH.turun, B.night, 0.25), HIJAU_TEKS = mixHex(ARAH.naik, B.night, 0.45);
/** 2 Nov (Simon: "Sisa timbangan pada saat menampilkan isi dari masing masing point … masih terlihat"): panel 600 tinggi, y 495 (195–795) — dulu 210–790:
 *  ujung lengan kanan yang terangkat (miring 12°, y ±209) mengintip di atas tepi panel. Isi panel digeser +10 (tetap berpusat di badan). */
const PANEL = { x: 960, y: 495, w: 1200, h: 600 };
const geoPanel = (warna: string): GeoKartu => ({ x: PANEL.x, y: PANEL.y, w: PANEL.w, h: PANEL.h, warna, tab: 'atas' });
const rad = (deg: number) => (deg * Math.PI) / 180;
/** geser memberi ruang mulai 15 f sebelum pop (pop easeOutBack & geser inOut cubic tampak satu gerak — Simon 2 Nov S05 butir 1) */
const BERI_RUANG = 15;

/* ═══════════════════════ TIMBANGAN ═══════════════════════ */
const tT = {
  tiang: T.dirangkum + 30, alas: T.dirangkum + 60, lengan: T.dirangkum + 80, piring: [T.dirangkum + 115, T.dirangkum + 125],
  labelLebih: T.kelebihan + 10, labelKurang: T.kelemahannya + 10,
  plus: [T.tiga + 10, T.tiga + 30, T.tiga + 50], minus: [T.nyata2 - 10, T.nyata2 + 10],
  keluar: T.bukan - 20,
};
/** kemiringan lengan (derajat, + = kiri turun): tiap keping ✓ +4°, tiap keping ✕ −6° → tiga ✓ = 12°, sesudah dua ✕ = 0 (datar) */
const miring = (f: number) => 4 * tT.plus.reduce((a, t) => a + cin(f, t), 0) - 6 * tT.minus.reduce((a, t) => a + cin(f, t), 0);
const ujung = (f: number, sisi: -1 | 1) => {
  const th = rad(miring(f));
  return { x: TB.x + sisi * TB.lengan * Math.cos(th), y: TB.y - sisi * TB.lengan * Math.sin(th) };
};
/** pusat piring (atas cekungan) */
const piring = (f: number, sisi: -1 | 1) => { const u = ujung(f, sisi); return { x: u.x, y: u.y + TB.tali }; };
const KEPING = 76;
/** posisi keping di piring: ✓ 2 di bawah + 1 di atas · ✕ 2 berdampingan */
const posKeping = (f: number, sisi: -1 | 1, k: number) => {
  const p = piring(f, sisi);
  const off: [number, number][] = sisi < 0 ? [[-44, -46], [44, -46], [0, -118]] : [[-44, -46], [44, -46]];
  return { x: p.x + off[k][0], y: p.y + off[k][1] };
};
/** keping kelebihan k sedang dibuka sebagai panel? → kepingnya disembunyikan (yang tampil = KacaMorf) */
const Piring: React.FC<{ f: number; sisi: -1 | 1; p: number }> = ({ f, sisi, p }) => {
  if (p <= 0.001) return null;
  const u = ujung(f, sisi), c = piring(f, sisi), s = skalaPop(p);
  const lebar = TB.piring / 2;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <g transform={`translate(${c.x} ${c.y}) scale(${s}) translate(${-c.x} ${-c.y})`}>
        <path d={`M ${u.x} ${u.y} L ${c.x - lebar + 18} ${c.y} M ${u.x} ${u.y} L ${c.x + lebar - 18} ${c.y}`} stroke={B.blueLite} strokeWidth={4} strokeLinecap="round" />
        <path d={`M ${c.x - lebar} ${c.y} Q ${c.x} ${c.y + 74} ${c.x + lebar} ${c.y} Z`} fill={B.white} stroke={B.blue} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </svg>);
};
const Timbangan: React.FC<{ f: number; buka: number[] }> = ({ f, buka }) => {
  const gT = cin(f, tT.tiang), gL = cin(f, tT.lengan);
  const kiri = ujung(f, -1), kanan = ujung(f, 1);
  const mid = (a: number, b: number, g: number) => lerp((a + b) / 2, a, g);
  // keluar: tiga bagian swipe ke bawah sampai lewat frame, titik akhir berbeda (selang 6 f)
  const turun = (k: number) => R(f, tT.keluar - 30 + 6 * k, tT.keluar + 30 + 6 * k, 0, 1, io) * (1180 + 60 * k);
  if (f < DARAT || f > tT.keluar + 60) return null;
  const kepingP = (k: number) => popIn(f, tT.plus[k]);
  const kepingM = (k: number) => popIn(f, tT.minus[k]);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, transform: turun(2) ? `translate3d(0, ${turun(2)}px, 0)` : undefined }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {/* tiang (trim dari poros ke bawah) + alas */}
          <line x1={TB.x} x2={TB.x} y1={TB.y} y2={lerp(TB.y, TB.dasar, gT)} stroke={B.blue} strokeWidth={12} strokeLinecap="round" />
          {popIn(f, tT.alas) > 0.001 ? <rect x={TB.x - 150} y={TB.dasar - 4} width={300} height={24} rx={12} fill={B.blue}
            transform={`translate(${TB.x} ${TB.dasar + 8}) scale(${skalaPop(popIn(f, tT.alas))}) translate(${-TB.x} ${-TB.dasar - 8})`} /> : null}
          {/* lengan (trim dari poros ke dua ujung) */}
          {gL > 0 ? <line x1={mid(kiri.x, kanan.x, gL)} y1={mid(kiri.y, kanan.y, gL)} x2={mid(kanan.x, kiri.x, gL)} y2={mid(kanan.y, kiri.y, gL)}
            stroke={B.blue} strokeWidth={14} strokeLinecap="round" /> : null}
        </svg>
        {/* poros = CAKRAM PENDARATAN masker S04 apa adanya (putih, cincin SISI px biru — 30 Okt malam, Simon S05: "Ada jeglek ketika transisi dari scene 4 ke
            scene 5": dulu di frame mendarat cakram berganti jadi kaca bercincin tipis + bayangan + titik yang langsung penuh), titik poros POP sesudah mendarat */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: TB.rPoros * 2, height: TB.rPoros * 2, borderRadius: '50%', background: B.white,
          border: `${SISI}px solid ${B.blue}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: geser(TB.x - TB.rPoros, TB.y - TB.rPoros) }}>
          {popIn(f, DARAT + 30) > 0.001 ? <div style={{ width: 18, height: 18, borderRadius: '50%', background: B.blue, transform: `scale(${skalaPop(popIn(f, DARAT + 30))})` }} /> : null}
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: turun(0) ? `translate3d(0, ${turun(0)}px, 0)` : undefined }}>
        <Piring f={f} sisi={-1} p={popIn(f, tT.piring[0])} />
        {[0, 1, 2].map((k) => buka[k] ? null : (
          <KacaBulat key={k} x={posKeping(f, -1, k).x} y={posKeping(f, -1, k).y} d={KEPING} warna={CEK} p={kepingP(k)} padat><Icon name="tersedia" size={KEPING * 0.52} color={CEK} /></KacaBulat>))}
        <Label x={piring(f, -1).x} y={piring(f, -1).y + 88} teks="Kelebihan" f={f} at={tT.labelLebih} size={32} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: turun(1) ? `translate3d(0, ${turun(1)}px, 0)` : undefined }}>
        <Piring f={f} sisi={1} p={popIn(f, tT.piring[1])} />
        {[0, 1].map((k) => buka[3 + k] ? null : (
          <KacaBulat key={k} x={posKeping(f, 1, k).x} y={posKeping(f, 1, k).y} d={KEPING} warna={ARAH.turun} p={kepingM(k)} padat>
            <div style={{ fontFamily: F, fontSize: KEPING * 0.46, fontWeight: 800, color: ARAH.turun, lineHeight: 1 }}>✕</div></KacaBulat>))}
        <Label x={piring(f, 1).x} y={piring(f, 1).y + 88} teks="Kekurangan" f={f} at={tT.labelKurang} size={32} />
      </div>
    </>);
};

/* ═══════════════════════ PANEL DETAIL (keping memekar → panel → mengerut kembali) ═══════════════════════ */
type Buka = { mekar: number; kerut: number; sisi: -1 | 1; k: number; warna: string; isi: (f: number) => React.ReactNode };
const kepingIsi = (sisi: -1 | 1) => sisi < 0 ? <Icon name="tersedia" size={KEPING * 0.52} color={CEK} />
  : <div style={{ fontFamily: F, fontSize: KEPING * 0.46, fontWeight: 800, color: ARAH.turun, lineHeight: 1 }}>✕</div>;
const PanelBuka: React.FC<{ f: number; b: Buka }> = ({ f, b }) => {
  const u = cin(f, b.mekar) * (1 - cin(f, b.kerut));
  if (u <= 0) return null;
  const pos = posKeping(f, b.sisi, b.k);
  const a = geoBulat(pos.x, pos.y, KEPING, b.sisi < 0 ? CEK : ARAH.turun);
  // t ≤ 0,9998: isi panel SELALU di jalur raster ber-opacity — dulu opacity isi berganti undefined → 0,998 di frame pertama mengerut dan Chrome berpindah
  // jalur raster (seluruh isi "bergeser" 1 frame, pindai f17720; resep yang sama dengan pop 0,99996)
  return <KacaMorf a={a} b={geoPanel(b.warna)} t={Math.min(u, 0.9998)} tepi={1} z={5} padat
    isiA={<div style={{ width: KEPING, height: KEPING, display: 'grid', placeItems: 'center' }}>{kepingIsi(b.sisi)}</div>}
    isiB={<div style={{ position: 'absolute', inset: 0, transform: 'translate3d(0, 10px, 0)' }}>{b.isi(f)}</div>} />;
};
/** judul kecil panel (kiri-atas): nomor + teks — satu-satunya teks besar di panel adalah isi utamanya */
const KepalaPanel: React.FC<{ f: number; n: number; warna: string; teks: string; at: number }> = ({ f, n, warna, teks, at }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', border: `4px solid ${warna}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', background: B.white,
      transform: `scale(${skalaPop(popIn(f, at - 10))})` }}><AngkaBulat n={n} d={56} warna={warna} /></div>
    <WordText f={f} at={at} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);

/* 1 · bisnis nyata */
const t1 = { mekar: T.pertama + 30, kepala: T.keputusan + 20, dijual: T.apa + 30, panah1: T.berapa - 10, hasil: T.berapa + 20, panah2: T.apakah, tumbuh: T.apakah + 30, kerut: T.kedua + 5 };
const LANGKAH: { foto: 'belanjaTas' | 'uang' | 'tumbuh'; w: number; teks: string; at: number }[] = [
  // 30 Okt malam (Simon S05: "Tambahkan '?' Pada setiap pertanyaan dari point 1")
  { foto: 'belanjaTas', w: 170, teks: 'Apa yang dijual?', at: t1.dijual },
  { foto: 'uang', w: 230, teks: 'Berapa yang dihasilkan?', at: t1.hasil },
  { foto: 'tumbuh', w: 230, teks: 'Bisa terus berkembang?', at: t1.tumbuh },
];
/** 30 Okt malam (Simon S05: "Perbaiki alignmentnya"): TENGAH DULU LALU MEMBERI RUANG — butir pertama di tengah panel (x 600), tiap butir baru pop di
 *  tempatnya sementara butir lama bergeser memberi ruang (60 f inOut di kata butir itu) → selalu berpusat di panel (dulu X 220 · 600 · 980 tetap: dua butir
 *  pertama berat ke kiri, kanan panel kosong) */
/** 2 Nov (Simon: "Isi checklist 1, disaat icon pop up seharusnya bersamaan dengan gerakan swipe, saat ini terlihat pop up dulu baru swipe"): geser memberi
 *  ruang DIMULAI 15 f lebih awal dari pop (pop easeOutBack sudah ±70 % di 12 f pertama, geser inOut cubic baru ±4 %) → keduanya tampak satu gerak */
const xLangkah = (f: number, k: number) => {
  const n = 1 + cin(f, t1.hasil - BERI_RUANG) + cin(f, t1.tumbuh - BERI_RUANG);
  return PANEL.w / 2 + (k - (n - 1) / 2) * 380;
};
const Isi1 = (f: number) => (
  <>
    <KepalaPanel f={f} n={1} warna={B.blue} teks="Keputusan dimulai dari bisnis nyata" at={t1.kepala} />
    {LANGKAH.map((l, k) => (
      <React.Fragment key={k}>
        <Foto k={l.foto} x={xLangkah(f, k)} y={290} w={l.w} p={popIn(f, l.at)} />
        <Label x={xLangkah(f, k)} y={450} teks={l.teks} f={f} at={l.at + 10} size={30} lebar={340} />
      </React.Fragment>))}
    <Chevron x={(xLangkah(f, 0) + xLangkah(f, 1)) / 2} y={290} warna={B.blue} p={popIn(f, t1.panah1)} d={56} />
    <Chevron x={(xLangkah(f, 1) + xLangkah(f, 2)) / 2} y={290} warna={B.blue} p={popIn(f, t1.panah2)} d={56} />
  </>);

/* 2 · lintas generasi (kilas balik S03) */
const t2 = { mekar: T.pendekatannya + 15, kepala: T.digunakan, garis: T.digunakan + 30, foto: T.berbagai + 10, puluhan: T.puluhan + 20, kerut: T.ketiga - 40 };
const GENERASI: { foto: keyof typeof POTRET; nama: string; tahun: string; warna: string }[] = [
  { foto: 'graham', nama: 'Benjamin Graham', tahun: '1930-an', warna: B.blue }, { foto: 'buffett', nama: 'Warren Buffett', tahun: '1965', warna: B.orange },
  { foto: 'munger', nama: 'Charlie Munger', tahun: '1978', warna: B.blue }, { foto: 'klarman', nama: 'Seth Klarman', tahun: '1982', warna: B.turq },
];
const XG = [240, 480, 720, 960];
const Isi2 = (f: number) => (
  <>
    <KepalaPanel f={f} n={2} warna={B.turq} teks="Digunakan lintas generasi" at={t2.kepala} />
    <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <Penghubung d={`M 140 410 L 1080 410`} g={cin(f, t2.garis)} warna={B.night} dash={false} titik={false} tebal={5} />
      {XG.map((x, k) => { const p = popIn(f, t2.foto + 12 * k); return p <= 0.001 ? null : <circle key={k} cx={x} cy={410} r={10 * skalaPop(p)} fill={B.white} stroke={GENERASI[k].warna} strokeWidth={5} />; })}
    </svg>
    {GENERASI.map((g, k) => (
      <React.Fragment key={k}>
        <FotoPotret foto={POTRET[g.foto]} x={XG[k]} y={220} d={150} p={popIn(f, t2.foto + 12 * k)} naik={cin(f, t2.foto + 12 * k + 20)} warna={g.warna} />
        <Label x={XG[k]} y={330} teks={g.nama} f={f} at={t2.foto + 12 * k + 10} size={24} lebar={230} />
        <Label x={XG[k]} y={452} teks={g.tahun} f={f} at={t2.foto + 12 * k + 20} size={26} warna={ABU_TEKS} lebar={200} />
      </React.Fragment>))}
    <Chip x={600} y={520} teks="Puluhan tahun" ikon="kalender" warna={B.turq} p={popIn(f, t2.puluhan)} size={28} />
  </>);

/* 3 · dipelajari & diakumulasi — 2 Nov (Simon: "Buat illustrasi tambahan untuk 'perusahaan dipelajari', 'pola bisnis dikenal', dan 'dasar keputusan' (bukan
 * dengan text, tapi dengan visual)"): dulu kisi 12 ubin + garis + bilah dengan tiga LABEL TEKS di kanan. Kini empat butir sebaris (pola butir 1): kamu ›
 * PERUSAHAAN DIPELAJARI (ubin gedung bertambah satu per satu) › POLA BISNIS DIKENAL (simpul tersambung garis, trim) › DASAR KEPUTUSAN (tiga balok fondasi
 * tumbuh dari bawah, centang di puncak). Tiap ilustrasi = lingkaran 180 px dengan isi yang BERTAMBAH; label pendek di bawahnya. Tengah dulu, lalu memberi ruang. */
const t3 = { mekar: T.kemampuannya + 10, kamu: T.kemampuannya + 40, kepala: T.dipelajari, ubin: T.perusahaan - 10, pola: T.pola + 10, dasar: T.dasar + 10,
  cek: T.berikutnya + 20, kerut: T.tapi + 5 };
const Y3 = 320, D3 = 180, JARAK3 = 270;
const AT3 = () => [t3.kamu, t3.ubin, t3.pola, t3.dasar];
const x3 = (f: number, k: number) => {
  const n = 1 + AT3().slice(1).reduce((a, t) => a + cin(f, t - BERI_RUANG), 0);
  return PANEL.w / 2 + (k - (n - 1) / 2) * JARAK3;
};
/** ilustrasi 1: enam gedung kecil (3 × 2) pop berurutan — perusahaan yang dipelajari bertambah */
const IlusPerusahaan: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: 'relative', width: D3, height: D3 }}>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const q = popIn(f, t3.ubin + 20 + 14 * i);
      return q <= 0.001 ? null : (
        <div key={i} style={{ position: 'absolute', left: D3 / 2 + ((i % 3) - 1) * 44 - 20, top: D3 / 2 + (Math.floor(i / 3) - 0.5) * 46 - 20, width: 40, height: 40,
          display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(q)})` }}><Icon name="perusahaan" size={38} color={B.blue} /></div>);
    })}
  </div>);
/** ilustrasi 2: lima simpul tersambung (garis trim berurutan) — pola bisnis yang dikenal */
const SIMPUL: [number, number][] = [[-52, -22], [-6, -50], [46, -26], [-30, 36], [34, 34]];
const SISI_POLA: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [1, 4]];
const IlusPola: React.FC<{ f: number }> = ({ f }) => (
  <svg width={D3} height={D3} viewBox={`${-D3 / 2} ${-D3 / 2} ${D3} ${D3}`} style={{ overflow: 'visible' }}>
    {SISI_POLA.map(([a, b], j) => {
      const g = cin(f, t3.pola + 20 + 10 * j);
      if (g <= 0) return null;
      const [xa, ya] = SIMPUL[a], [xb, yb] = SIMPUL[b];
      return <line key={j} x1={xa} y1={ya} x2={lerp(xa, xb, g)} y2={lerp(ya, yb, g)} stroke={B.turq} strokeWidth={4} strokeLinecap="round" />;
    })}
    {SIMPUL.map(([x, y], i) => {
      const q = popIn(f, t3.pola + 10 + 8 * i);
      return q <= 0.001 ? null : <circle key={i} cx={x} cy={y} r={11 * skalaPop(q)} fill={B.white} stroke={B.turq} strokeWidth={5} />;
    })}
  </svg>);
/** ilustrasi 3: tiga balok fondasi tumbuh tegak dari bawah (skala Y 0 → 100 inOut cubic), lebar → sempit ke atas; centang di puncak */
const IlusDasar: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: 'relative', width: D3, height: D3 }}>
    {[[104, 0], [80, 1], [56, 2]].map(([w, k]) => {
      const g = cin(f, t3.dasar + 20 + 18 * k);
      return g <= 0 ? null : (
        <div key={k} style={{ position: 'absolute', left: D3 / 2 - w / 2, top: 124 - 30 * k, width: w, height: 26, borderRadius: 8,
          background: mixHex(B.orange, B.white, 0.12 * k), transformOrigin: '50% 100%', transform: `scaleY(${g})` }} />);
    })}
  </div>);
const ILUS3: { teks: string; warna: string; at: () => number; isi: React.FC<{ f: number }> }[] = [
  { teks: 'Perusahaan dipelajari', warna: B.blue, at: () => t3.ubin, isi: IlusPerusahaan },
  { teks: 'Pola bisnis dikenal', warna: B.turq, at: () => t3.pola, isi: IlusPola },
  { teks: 'Dasar keputusan', warna: B.orange, at: () => t3.dasar, isi: IlusDasar },
];
const Isi3 = (f: number) => (
  <>
    <KepalaPanel f={f} n={3} warna={B.orange} teks="Dipelajari dan diakumulasi" at={t3.kepala} />
    <FotoLingkar pose={ORANG_MUDA} x={x3(f, 0)} y={Y3} D={200} s={popIn(f, t3.kamu)} warna={B.turq} naik={cin(f, t3.kamu + 20)} latar={B.turqWash} />
    {ILUS3.map((il, j) => (
      <React.Fragment key={j}>
        <Chevron x={(x3(f, j) + x3(f, j + 1)) / 2} y={Y3} warna={B.gray} p={popIn(f, il.at() - 10)} d={44} />
        <KacaBulat x={x3(f, j + 1)} y={Y3} d={D3} warna={il.warna} p={popIn(f, il.at())} padat><il.isi f={f} /></KacaBulat>
        <Label x={x3(f, j + 1)} y={Y3 + D3 / 2 + 40} teks={il.teks} f={f} at={il.at() + 10} size={26} lebar={250} />
      </React.Fragment>))}
    <Lencana x={x3(f, 3) + D3 * 0.36} y={Y3 - D3 * 0.36} d={0} p={popIn(f, t3.cek)} warna={CEK} ikon="tersedia" besar={52} />
  </>);

/* K1 · riset sulit & makan waktu */
// 30 Okt malam: gedung (perusahaan yang diriset) muncul BERSAMA panel (dulu baru di "perusahaan" ±4 dtk kemudian → panel kosong, survei f21240)
const tK1 = { mekar: T.risetnya + 15, kepala: T.sulit, jam: T.waktu + 10, gedung: T.risetnya + 35,
  item: [T.laporan, T.model, T.kompetisi, T.risiko, T.valuasinya], kerut: T.kedua2 };
const ITEM: { ikon: KunciIkon; teks: string; warna: string }[] = [
  { ikon: 'laporanKeuangan', teks: 'Laporan keuangan', warna: B.blue }, { ikon: 'warung', teks: 'Model bisnis', warna: B.turq },
  { ikon: 'kompetisi', teks: 'Kompetisi', warna: B.orange }, { ikon: 'daftarRisiko', teks: 'Risiko', warna: B.blueLite }, { ikon: 'modelValuasi', teks: 'Valuasi', warna: B.blue },
];
/** 2 Nov (Simon: "Pada kekurangan point 1, icon nya tidak center, ada yang terlalu keatas, ada yang terlalu kebawah, dan juga sparingnya terlihat tidak
 *  konsisten"): lima ikon SATU baris (dulu lengkung y 380–420), jarak 210 simetris terhadap tengah panel; gedung & baris turun 25 → isi berpusat di badan */
const XI = [180, 390, 600, 810, 1020], YI = [445, 445, 445, 445, 445], Y_GEDUNG = 240;
const IsiK1 = (f: number) => (
  <>
    <KepalaPanel f={f} n={1} warna={ARAH.turun} teks="Risetnya sulit dan makan waktu" at={tK1.kepala} />
    <KacaBulat x={1110} y={68} d={64} warna={B.orange} p={popIn(f, tK1.jam)}><Icon name="kurangWaktu" size={34} color={B.orange} /></KacaBulat>
    <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {XI.map((x, k) => <Penghubung key={k} d={`M 600 ${Y_GEDUNG + 93} L ${x} ${YI[k] - 50}`} g={cin(f, tK1.item[k] + 10)} warna={ITEM[k].warna} titik={false} tebal={4} />)}
    </svg>
    <FotoLingkar pose={POSE_BENDA.gedung} x={600} y={Y_GEDUNG} D={180} s={popIn(f, tK1.gedung)} warna={B.blue} naik={cin(f, tK1.gedung + 20)} />
    {ITEM.map((it, k) => (
      <React.Fragment key={k}>
        <KacaBulat x={XI[k]} y={YI[k]} d={96} warna={it.warna} p={popIn(f, tK1.item[k] + 20)}><Icon name={it.ikon} size={50} color={it.warna} /></KacaBulat>
        <Label x={XI[k]} y={YI[k] + 82} teks={it.teks} f={f} at={tK1.item[k] + 30} size={26} lebar={220} />
      </React.Fragment>))}
  </>);

/* K2 · hasil lambat — 30 Okt malam (Simon S05: "Buat line chartnya jadi candlestick realistis. Tambahkan juga garis support dan resistance."): garis ilustrasi
 * → 53 CANDLE MINGGUAN RIIL IHSG Des 2022 – Nov 2023 (scripts/gen-lilin-s05.py; chart tanpa nama): setahun MENYAMPING di antara SUPPORT 6.560 dan RESISTANCE
 * 7.080 (rata-rata 4 titik ekstrem mingguan — level riil, bukan rekaan). Candle tumbuh berurutan bulan demi bulan (label bulan muncul saat kepala chart
 * lewat), skala TERKUNCI; garis nilai wajar (ilustrasi) di atas resistance → harga tertahan di bawah nilai. */
// garis nilai wajar tergambar BERSAMA panel (dulu baru di "menemukan" → panel kosong, survei f22320)
const tK2 = { mekar: T.hasilnya + 20, kepala: T.hasilnya + 30, nilai: T.hasilnya + 50, bagus: T.bagus + 10, murah: T.murah + 10, garis0: T.murah - 10, garis1: T.lama + 40,
  setuju: T.setuju, lama: T.lebih + 20, kerut: T.jadi + 5, sr: T.rendah - 10 };
const C2 = { x0: 80, x1: 900, yNilai: 200, yA: 280, yB: 440, v0: 6450, v1: 7200, dasar: 470, ujungLama: 1010 };
const SLOT2 = (C2.x1 - C2.x0) / IHSG_S05.length;
const y2 = (v: number) => C2.yB - ((C2.yB - C2.yA) * (v - C2.v0)) / (C2.v1 - C2.v0);
const x2 = (k: number) => C2.x0 + SLOT2 * (k + 0.5);
const BULAN = [1, 3, 6, 9, 12];
const xBulan = (b: number) => C2.x0 + ((C2.x1 - C2.x0) * (b - 1)) / 11;
const IsiK2 = (f: number) => {
  const g = R(f, tK2.garis0, tK2.garis1, 0, 1, (x) => x); // gerak bercerita: chart terbentuk RATA bulan demi bulan
  const n = g * IHSG_S05.length, kKepala = Math.min(IHSG_S05.length - 1, Math.floor(n));
  const kepala = tumbuh(IHSG_S05[kKepala], Math.max(0.05, Math.min(1, n - kKepala)));
  const xKepala = x2(kKepala), yKepala = y2(kepala.c);
  const gLama = cin(f, tK2.lama);
  const yAkhir = y2(IHSG_S05[IHSG_S05.length - 1].c);
  const gS = cin(f, tK2.sr), gR = cin(f, tK2.sr + 20);
  return (
    <>
      <KepalaPanel f={f} n={2} warna={ARAH.turun} teks="Hasilnya bisa terasa lambat" at={tK2.kepala} />
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`translate(${C2.x0} ${C2.yA - 30})`}><KisiLilin w={C2.x1 - C2.x0} h={C2.yB - C2.yA + 60} /></g>
        <line x1={C2.x0} x2={C2.x1} y1={C2.dasar} y2={C2.dasar} stroke={B.grayLite} strokeWidth={3} strokeLinecap="round" />
        <Penghubung d={`M ${C2.x0} ${C2.yNilai} L ${C2.x1} ${C2.yNilai}`} g={cin(f, tK2.nilai)} warna={B.turq} titik={false} tebal={4} />
        {/* support & resistance (trim kiri → kanan) */}
        <Penghubung d={`M ${C2.x0} ${y2(SUPPORT_S05).toFixed(1)} L ${C2.x1} ${y2(SUPPORT_S05).toFixed(1)}`} g={gS} warna={ARAH.naik} titik={false} tebal={3} />
        <Penghubung d={`M ${C2.x0} ${y2(RESISTANCE_S05).toFixed(1)} L ${C2.x1} ${y2(RESISTANCE_S05).toFixed(1)}`} g={gR} warna={ARAH.turun} titik={false} tebal={3} />
        {IHSG_S05.map((b, k) => {
          const u = Math.max(0, Math.min(1, n - k));
          return u <= 0 ? null : <BatangLilin key={b.t} c={tumbuh(b, u)} x={x2(k)} slot={SLOT2} Y={y2} sumbu={1.6} alfa={Math.min(1, u * 3)} />;
        })}
        {/* jarak harga–nilai di kepala chart: TUMBUH (trim) dari garis nilai ke tutup candle yang sedang terbentuk, lalu ikut kepala */}
        {g > 0 ? <line x1={xKepala} x2={xKepala} y1={C2.yNilai + 14} y2={lerp(C2.yNilai + 14, Math.min(yKepala, y2(kepala.h)) - 14, cin(f, tK2.garis0 + 30))} stroke={B.orange} strokeWidth={5} strokeLinecap="round" /> : null}
        {/* "atau bahkan lebih lama": garis putus-putus berlanjut ke kanan dari tutup terakhir */}
        {gLama > 0 ? <Penghubung d={`M ${C2.x1 + 14} ${yAkhir.toFixed(1)} L ${C2.ujungLama} ${yAkhir.toFixed(1)}`} g={gLama} warna={B.blue} titik={false} tebal={4}
          panah={{ x: C2.ujungLama, y: yAkhir, sudut: 0 }} /> : null}
      </svg>
      {/* label garis di DALAM ujung kanan chart (26 px dari tepi — garis jarak di kepala chart lewat x 892): Resistance di atas garisnya, Support di bawah */}
      <div style={{ position: 'absolute', right: PANEL.w - C2.x1 + 26, top: y2(RESISTANCE_S05) - 34 }}>
        <WordText f={f} at={tK2.sr + 40} style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: MERAH_TEKS }}>Resistance</WordText></div>
      <div style={{ position: 'absolute', right: PANEL.w - C2.x1 + 26, top: y2(SUPPORT_S05) + 8 }}>
        <WordText f={f} at={tK2.sr + 20} style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: HIJAU_TEKS }}>Support</WordText></div>
      {BULAN.map((b, k) => <Label key={b} x={xBulan(b)} y={C2.dasar + 34} teks={`Bulan ${b}`} f={f} at={tK2.garis0 + (tK2.garis1 - tK2.garis0) * ((b - 1) / 11) + 30 + (k ? 0 : 10)} size={24} warna={ABU_TEKS} lebar={140} />)}
      <Chip x={C2.x1 - 250} y={C2.yNilai - 48} jangkar="kiri" teks="Perusahaan bagus" ikon="kualitas" warna={CEK} p={popIn(f, tK2.bagus)} size={24} />
      <Chip x={C2.x0} y={(C2.yNilai + y2(RESISTANCE_S05)) / 2 - 6} jangkar="kiri" teks="Harga murah" ikon="valuasi" warna={B.blue} p={popIn(f, tK2.murah)} size={24} />
      <div style={{ position: 'absolute', left: C2.ujungLama - 120, width: 240, top: yAkhir + 26, textAlign: 'center' }}>
        <WordText f={f} at={tK2.lama + 10} style={{ fontFamily: F, fontSize: 26, fontWeight: 800, color: MERAH_TEKS }}>Lebih lama</WordText></div>
    </>);
};

const BUKA: Buka[] = [
  { mekar: t1.mekar, kerut: t1.kerut, sisi: -1, k: 0, warna: B.blue, isi: Isi1 },
  { mekar: t2.mekar, kerut: t2.kerut, sisi: -1, k: 1, warna: B.turq, isi: Isi2 },
  { mekar: t3.mekar, kerut: t3.kerut, sisi: -1, k: 2, warna: B.orange, isi: Isi3 },
  { mekar: tK1.mekar, kerut: tK1.kerut, sisi: 1, k: 0, warna: B.orange, isi: IsiK1 },
  { mekar: tK2.mekar, kerut: tK2.kerut, sisi: 1, k: 1, warna: B.orange, isi: IsiK2 },
];

/* ═══════════════════════ PENUTUP · KESABARAN ═══════════════════════ */
// cari −10 (dulu +10): pop mulai saat timbangan baru keluar — dulu layar hanya latar f22405–22425 (audit tabrakan FRAME-KOSONG f22410)
const tP = { cari: T.menemukan2 - 10, labelCari: T.undervalued, cariKeluar: T.tapi2, sabar: T.kesabaran + 10, labelSabar: T.kesabaran + 20,
  tunggu0: T.menunggu - 10, tunggu1: T.terbukti + 10, terbukti: T.terbukti + 30, menepi: T.sambil + 10, cek: T.mengecek + 20, labelCek: T.alasan + 10, akal: T.akal + 10 };
const SABAR = { y: 450, d: 240 };
/** LINGKARAN KESABARAN → lingkaran KAMU S06 (2 Nov): posisi/ukuran/warna selama menyatu — dibaca S06 supaya foto kamu naik TEPAT di dalamnya */
export const geoGabungS06 = (f: number) => {
  const u = cin(f, S06_GABUNG);
  return { u, x: lerp(720, S06_KAMU.x, u), y: lerp(SABAR.y, S06_KAMU.y, u), d: lerp(SABAR.d, S06_KAMU.D, u), warna: mixHex(B.orange, B.turq, u) };
};
const Penutup: React.FC<{ f: number }> = ({ f }) => {
  if (f < tP.cari - 40) return null;
  const xSabar = geserKe(f, tP.menepi, 960, 720);
  const gTunggu = R(f, tP.tunggu0, tP.tunggu1, 0, 1, io);
  const rC = SABAR.d / 2 + 18;
  // 2 Nov (Simon: "Icon pop out, lingkaran bergabung, dan orang di scene 6 swipe keatas … bersamaan"): kedua lingkaran bergerak & membesar ke lingkaran
  // kamu S06 (960, 560, D 300), warna cincin → turkis; ikon, cincin tunggu & centang POP KELUAR dan label naik keluar dalam 60 f yang sama
  const g = geoGabungS06(f), u = g.u, ikonKeluar = linOut(f, S06_GABUNG);
  const xS = u > 0 ? g.x : xSabar, yS = g.y, dS = g.d;
  const xC = lerp(1200, S06_KAMU.x, u), dC = lerp(200, S06_KAMU.D, u);
  return (
    <>
      <KacaBulat x={960} y={SABAR.y} d={200} warna={B.blue} p={popIn(f, tP.cari) * linOut(f, tP.cariKeluar)}><Icon name="valuasi" size={100} color={B.blue} /></KacaBulat>
      <Label x={960} y={SABAR.y + 100 + 44} teks="Menemukan undervalued" f={f} at={tP.labelCari} size={30} lebar={420} keluar={tP.cariKeluar - 30} />
      {/* Cek alasan (di bawah, ikut menyatu; hilang saat sudah berimpit) */}
      {u < 1 ? (
        <>
          <KacaBulat x={xC} y={yS} d={dC} warna={mixHex(B.blue, B.turq, u)} p={popIn(f, tP.cek)} padat>
            <div style={{ transform: `scale(${skalaPop(ikonKeluar)})` }}><Icon name="alasan" size={100} color={B.blue} /></div></KacaBulat>
          <Lencana x={xC} y={yS} d={dC} p={popIn(f, tP.akal) * ikonKeluar} warna={CEK} ikon="tersedia" besar={64} />
        </>) : null}
      <Label x={1200} y={SABAR.y + rC + 46} teks="Cek alasan membeli" f={f} at={tP.labelCek} size={30} lebar={380} keluar={S06_GABUNG - 20} />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {gTunggu > 0 && ikonKeluar > 0.001 ? <circle cx={xS} cy={yS} r={(dS / 2 + 18) * skalaPop(ikonKeluar)} fill="none" stroke={B.orange} strokeWidth={6} strokeLinecap="round" pathLength={1000}
          strokeDasharray={`${1000 * gTunggu} 1000`} transform={`rotate(-90 ${xS} ${yS})`} /> : null}
      </svg>
      <KacaBulat x={xS} y={yS} d={dS} warna={g.warna} p={popIn(f, tP.sabar)} padat /* padat: rantai Kesabaran → kamu S06 → ikon metode 1 satu rupa */>
        <div style={{ transform: `scale(${skalaPop(ikonKeluar)})` }}><Icon name="kurangWaktu" size={SABAR.d * 0.5} color={B.orange} /></div></KacaBulat>
      <Lencana x={xS} y={yS} d={dS + 36} p={popIn(f, tP.terbukti) * ikonKeluar} warna={CEK} ikon="tersedia" besar={70} />
      <Label x={xSabar} y={SABAR.y + rC + 46} teks="Kesabaran" f={f} at={tP.labelSabar} size={34} keluar={S06_GABUNG - 20} />
    </>);
};

/* ═══════════════════════ SCENE ═══════════════════════ */
export const Scene05: React.FC<{ f: number }> = ({ f }) => {
  // akhir: lingkaran Kesabaran & Cek alasan MENYATU jadi lingkaran kamu S06 (S06 mengambil alih tepat di akhir gerak)
  if (f < AWAL || f >= S06_GABUNG + 30) return null;
  const buka = BUKA.map((b) => (cin(f, b.mekar) * (1 - cin(f, b.kerut)) > 0 ? 1 : 0));
  return (
    <>
      <Timbangan f={f} buka={buka} />
      {BUKA.map((b, i) => <PanelBuka key={i} f={f} b={b} />)}
      <Penutup f={f} />
    </>);
};
export const S05_T = T;
