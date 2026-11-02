import React from 'react';
import { Img, staticFile } from 'remotion';
import { ARAH, B, CEK, F, SISI, lerp, mixHex, rgba } from '../theme';
import { Icon, SWIPE, WordText, cin, popOut as linOut, popIn as linIn, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Label, Lencana } from '../parts/umum';
import { Kaca, KacaMorf, ORANG_MUDA, Penghubung, geser, type GeoKartu } from '../parts/kaca';
import { FotoLingkar, KacaBulat, POSE_BENDA, geoBulat, geserKe } from '../parts/lingkar';
import { AiTuntun } from '../parts/aiTuntun';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { RISET_S08 } from '../parts/waktuTransisi';
import type { KunciIkon } from '../ikon';

/**
 * SCENE 08 — "Apa Peran Tuntun?" (VI V01, dibangun 30 Okt; Simon: "Ya, bangun S08"). Penutup video, termasuk "Di video selanjutnya" (bagian naskah).
 * ASET ASLI: tangkapan layar aplikasi Tuntun (proyek `investing-video/public`): laporan Deep Research BBCA (In Depth Research, 24 Nov 2025) &
 * tab Research BBCA (harga 6.150 · Reference Fair Value 6.943–8.168 · 11% ~ 24% Undervalued — 30 Okt malam: dulu tertulis 11%–34%, salah hitung, kini sama persis dengan layar aplikasi); maskot Tuntun AI (sprite V02/V06); logo Tuntun.
 *  A  masker S07 mendarat jadi lingkaran RISET → lima pekerjaan riset bercabang (pop di katanya), bilah WAKTU terisi → "Banyak waktu"
 *  B  lingkaran riset BERUBAH jadi logo Tuntun · "Value investing · pendekatan utama" → membantu kamu: Perusahaan · Valuasi
 *  C  ponsel naik: laporan Deep Research BBCA (digulir) + kartu: Bisnis · Kualitas · Keunggulan · Risiko · Dasar valuasi
 *  D  Tuntun AI: tanya "?" → menjawab (titik mengetik)
 *  E  layar berganti tab Research BBCA → kartu: harga market 6.150 vs referensi nilai 6.943–8.168 (angka dari layar aplikasi)
 *  F  "bukan berarti selalu benar" (?) · metode lain = referensi tambahan (TA · momentum · data transaksi) di sekitar value investing
 *  G  fondasi: ① pahami yang dibeli → ② baru harga ke mana
 *  H  "Di video selanjutnya": kuil empat pilar (S02) → pilar 01 memekar: sebagian perusahaan + "apa yang perlu kita pahami?"
 */
const PASANG: [string, string][] = [
  ['masalahnya', 'masalahnya'], ['tersulit', 'tersulit'], ['riset', 'riset'], ['laporan', 'laporan'], ['bisnis', 'bisnis'], ['kualitas', 'kualitas'],
  ['perubahan', 'perubahan'], ['fair', 'fair'], ['memakan', 'memakan'], ['waktu', 'waktu'], ['karena', 'karena'], ['tuntun', 'tuntun'], ['utama', 'utama'],
  ['membantu', 'membantu'], ['investor', 'investor'], ['perusahaan', 'perusahaan'], ['valuasinya', 'valuasinya'], ['saham', 'saham'], ['kamu', 'kamu'],
  ['deep', 'deep'], ['report', 'report'], ['tim', 'tim'], ['bisnis2', 'bisnis'], ['kualitas2', 'kualitas'], ['keunggulan', 'keunggulan'], ['risiko', 'risiko'],
  ['dasar', 'dasar'], ['lalu', 'lalu'], ['ai', 'ai'], ['menanyakan', 'menanyakan'], ['pahami', 'pahami'], ['lewat', 'lewat'], ['informasi', 'informasi'],
  ['membandingkan', 'membandingkan'], ['harga', 'harga'], ['referensi', 'referensi'], ['nilai', 'nilai'], ['ini', 'ini'], ['riset2', 'riset'],
  ['selalu', 'selalu'], ['benar', 'benar'], ['bukan2', 'bukan'], ['metode', 'metode'], ['technical', 'technical'], ['momentum', 'momentum'],
  ['data', 'data'], ['referensi2', 'referensi'], ['tapi', 'tapi'], ['fondasinya', 'fondasinya'], ['sebelum', 'sebelum'], ['mana', 'mana'],
  ['pahami2', 'pahami'], ['beli', 'beli'], ['video', 'video'], ['pilar', 'pilar'], ['membeli', 'membeli'], ['sebagian', 'sebagian'], ['apa', 'apa'],
  ['pahami3', 'pahami'],
];
const T = (() => {
  const v = urut(PASANG.map(([, w]) => w), BATAS.s8);
  return Object.fromEntries(PASANG.map(([n], i) => [n, v[i]])) as Record<string, number>;
})();
const AWAL = BATAS.s8;
const DARAT = AWAL + 40; // masker S07 mendarat (MaskerKeluar mulai BATAS.s8 − 20, 60 f)
const ABU_TEKS = mixHex(B.gray, B.night, 0.45);

/* ═══════════════════════ A · RISET (pohon pekerjaan + bilah waktu) → B · TUNTUN ═══════════════════════ */
const RISET = { x: 960, y: 280, d: 180 };
/** lingkaran Riset mendarat di tengah (RISET_S08.y) → NAIK ke y 280 memberi ruang pohon, selesai 10 f sebelum cabang pertama ("laporan") pop */
const yRiset = (f: number) => lerp(RISET_S08.y, RISET.y, cin(f, T.laporan - 40));
const TUGAS: { ikon: KunciIkon; teks: string; at: () => number; warna: string }[] = [
  { ikon: 'laporanKeuangan', teks: 'Laporan keuangan', at: () => T.laporan, warna: B.blue },
  { ikon: 'perusahaan', teks: 'Memahami bisnis', at: () => T.bisnis, warna: B.turq },
  { ikon: 'kualitas', teks: 'Menilai kualitas', at: () => T.kualitas, warna: B.orange },
  { ikon: 'naikTurun', teks: 'Perubahan perusahaan', at: () => T.perubahan, warna: B.blueLite },
  { ikon: 'modelValuasi', teks: 'Fair value', at: () => T.fair, warna: B.blue },
];
const YT = 540, BAR = { x0: 320, x1: 1600, y: 740 };
/** 30 Okt malam (aturan 16 "tengah dulu, lalu memberi ruang"): cabang yang sudah ada bergeser memberi ruang tiap cabang baru pop, deretan selalu
 *  berpusat di bawah RISET (dulu posisi tetap 360…1560 → pohon berat ke kiri ±3 dtk, survei f34920–35280). Jarak 300 px. */
const XT_JARAK = 300;
const xTugas = (f: number, j: number) => {
  const m = TUGAS.reduce((a, t) => a + cin(f, t.at()), 0);
  return 960 + (j - (Math.max(1, m) - 1) / 2) * XT_JARAK;
};
const Y_B = 470;
const tA = { seru: T.tersulit + 20, waktu: T.waktu + 10, keluar: T.karena - 20 };
const tB = { pindah: T.karena + 10, logo: T.tuntun - 10, utama: T.utama - 20, menepi: T.membantu - 20, kamu: T.investor, perusahaan: T.perusahaan + 10,
  valuasi: T.valuasinya + 10, keluar: T.saham - 30 };
const BagianAB: React.FC<{ f: number }> = ({ f }) => {
  if (f < DARAT || f > tB.keluar + 40) return null;
  const k = (j: number) => linOut(f, tA.keluar + 5 * j);
  const isi = TUGAS.reduce((a, t) => a + cin(f, t.at()), 0) / TUGAS.length;
  const uP = cin(f, tB.pindah);
  const yA = yRiset(f);
  // 2 Nov: baris Tuntun ⇢ Investor y 420 → 470 (ukur-pindai f34140–34260: kelompok −52 px dari tengah)
  const xR = lerp(RISET.x, geserKe(f, tB.menepi, 960, 620), uP), yR = lerp(yA, Y_B, uP), dR = lerp(RISET.d, 220, uP);
  const pLogo = popIn(f, tB.logo), lupa = 1 - popIn(f, tB.logo - 30);
  const pKeluar = linOut(f, tB.keluar);
  return (
    <>
      {/* garis cabang & bilah waktu */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {TUGAS.map((t, j) => <Penghubung key={j} d={`M ${RISET.x} ${(yA + 152).toFixed(1)} L ${xTugas(f, j)} ${YT - 64}`} g={cin(f, t.at() - 10) * (1 - cin(f, tA.keluar - 20))} warna={t.warna} titik={false} tebal={4} />)}
        {k(6) > 0.001 && f >= T.laporan - 30 ? (
          <g transform={`translate(${(BAR.x0 + BAR.x1) / 2} ${BAR.y}) scale(${skalaPop(popIn(f, T.laporan - 10) * k(6))}) translate(${-(BAR.x0 + BAR.x1) / 2} ${-BAR.y})`}>
            <rect x={BAR.x0} y={BAR.y - 10} width={BAR.x1 - BAR.x0} height={20} rx={10} fill="#E8E8EE" />
            <rect x={BAR.x0} y={BAR.y - 10} width={(BAR.x1 - BAR.x0) * isi} height={20} rx={10} fill={B.orange} />
          </g>) : null}
      </svg>
      <KacaBulat x={BAR.x0 - 56} y={BAR.y} d={72} warna={B.orange} p={popIn(f, T.laporan - 10) * k(6)} padat><Icon name="kurangWaktu" size={40} color={B.orange} /></KacaBulat>
      <Chip x={960} y={BAR.y + 58} teks="Banyak waktu" ikon="waktu" warna={B.orange} p={popIn(f, tA.waktu) * k(7)} size={28} />
      {TUGAS.map((t, j) => (
        <React.Fragment key={j}>
          <KacaBulat x={xTugas(f, j)} y={YT} d={120} warna={t.warna} p={popIn(f, t.at()) * k(j)} padat><Icon name={t.ikon} size={64} color={t.warna} /></KacaBulat>
          <Label x={xTugas(f, j)} y={YT + 104} teks={t.teks} f={f} at={t.at() + 10} size={26} lebar={270} keluar={tA.keluar - 10} />
        </React.Fragment>))}
      {/* lingkaran RISET (pendaratan masker S07) → logo Tuntun di tengah → menepi untuk "kamu" */}
      {/* lingkaran RISET = CAKRAM PENDARATAN masker S07 apa adanya (putih, cincin SISI px biru — 30 Okt malam, Simon S08: "Ada jeglek saat transisi": dulu di
          frame mendarat cakram berganti jadi kaca bercincin tipis + bayangan dan ikon langsung penuh); ikon riset POP sesudah mendarat */}
      {pKeluar > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: dR, height: dR, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.blue}`, boxSizing: 'border-box',
          transformOrigin: 'center', transform: `${geser(xR - dR / 2, yR - dR / 2)}${pKeluar < 0.9999 ? ` scale(${skalaPop(pKeluar)})` : ''}` }}>
          {lupa * popIn(f, DARAT + 30) > 0.001 ? <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(lupa * popIn(f, DARAT + 30))})` }}>
            <Icon name="alasan" size={dR * 0.5} color={B.blue} /></div> : null}
          {pLogo > 0.001 ? <Img src={staticFile('brand/logo-ikon.png')} style={{ position: 'absolute', left: dR / 2 - dR * 0.29 - SISI, top: dR / 2 - dR * 0.29 - SISI, width: dR * 0.58, height: dR * 0.58,
            transform: `scale(${skalaPop(pLogo)})` }} /> : null}
        </div>) : null}
      <Lencana x={xR} y={yR} d={dR} p={popIn(f, tA.seru) * linOut(f, tA.keluar)} warna={B.orange} teks="!" besar={56} />
      <Label x={RISET.x} y={yA + 120} teks="Riset" f={f} at={T.riset + 10} size={32} keluar={tA.keluar - 10} />
      <Label x={xR} y={yR + dR / 2 + 44} teks="Tuntun" f={f} at={tB.logo + 20} size={34} keluar={tB.keluar - 20} />
      <Chip x={xR} y={yR + dR / 2 + 104} teks="Value investing · pendekatan utama" ikon="fondasi" warna={B.blue} p={popIn(f, tB.utama) * pKeluar} size={26} />
      {/* membantu investor (kamu) memahami perusahaan & valuasinya */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Penghubung d={`M 760 ${Y_B} L 1150 ${Y_B}`} g={cin(f, tB.kamu - 10) * (1 - cin(f, tB.keluar - 20))} warna={B.blue} panah={{ x: 1150, y: Y_B, sudut: 0 }} tebal={4} />
      </svg>
      {/* 30 Okt malam (Simon S08: "Perbaiki layout visual" bagian "Tuntun menggunakan … membantu investor memahami perusahaan dan valuasinya"): sisi kanan
          CERMIN sisi kiri — lingkaran sama besar & setinggi, label "Investor" sebaris label "Tuntun", chip sebaris chip "pendekatan utama" (dulu chip
          y 600 vs 634, tanpa label) */}
      <FotoLingkar pose={ORANG_MUDA} x={1300} y={Y_B} D={220} s={popIn(f, tB.kamu) * pKeluar} warna={B.turq} naik={cin(f, tB.kamu + 20)} latar={B.turqWash} />
      <Label x={1300} y={Y_B + 220 / 2 + 44} teks="Investor" f={f} at={tB.kamu + 10} size={34} keluar={tB.keluar - 20} />
      <Chip x={1300 - 104} y={Y_B + 220 / 2 + 104} teks="Perusahaan" ikon="perusahaan" warna={B.turq} p={popIn(f, tB.perusahaan) * pKeluar} size={26} />
      <Chip x={1300 + 104} y={Y_B + 220 / 2 + 104} teks="Valuasi" ikon="valuasi" warna={B.orange} p={popIn(f, tB.valuasi) * pKeluar} size={26} />
    </>);
};

/* ═══════════════════════ C–E · PONSEL APLIKASI TUNTUN ═══════════════════════ */
const HP = { y: 520, h: 780, rasio: 980 / 1920, bezel: 14 };
const tC = { masuk: T.saham + 10, menepi: T.deep - 10, kartu: T.tim - 10, tim: T.tim + 20, gulir0: T.bisnis2 - 20, gulir1: T.dasar + 40,
  aspek: [T.bisnis2, T.kualitas2, T.keunggulan, T.risiko, T.dasar], kartuKeluar: T.lalu - 10 };
const tD = { ai: T.ai + 10, tanya: T.menanyakan + 10, jawab: T.pahami + 20, keluar: T.lewat - 10 };
// kartu fair value muncul SAAT layar ponsel berganti ke tab Research ("informasi valuasi") — dulu baru di "membandingkan": ponsel sendirian di kiri ±2 dtk
const tE = { layar: T.informasi + 10, kartu: T.informasi + 20, harga: T.harga + 10, band: T.referensi + 10, celah: T.nilai + 30, ragu: T.benar + 10,
  keluar: T.bukan2 - 10, hpKeluar: T.bukan2 };
/** bingkai ponsel: layar = tangkapan layar asli (980 × 1920) diskalakan, `gulir` px layar; layar kedua NAIK menutupi yang pertama */
const Ponsel: React.FC<{ x: number; y: number; masuk: number; keluar: number; gulir: number; ganti: number }> = ({ x, y, masuk, keluar, gulir, ganti }) => {
  if (masuk <= 0 || keluar >= 1) return null;
  const w = HP.h * HP.rasio + 2 * HP.bezel, h = HP.h + 2 * HP.bezel;
  const dy = SWIPE * (1 - masuk) + SWIPE * keluar, rot = -45 * (1 - masuk) + 45 * keluar; // resep ponsel V06: naik dari bawah berotasi, keluar ke bawah
  const sw = HP.h * HP.rasio, sh = sw * (1920 / 980);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: 'center', transform: `${geser(x - w / 2, y - h / 2 + dy)} rotate(${rot}deg)`,
      borderRadius: 54, background: B.night, boxShadow: `0 24px 48px -24px ${rgba(B.night, 0.55)}` }}>
      <div style={{ position: 'absolute', left: HP.bezel, top: HP.bezel, width: sw, height: HP.h, borderRadius: 42, overflow: 'hidden', background: B.white }}>
        <Img src={staticFile('media/tuntun/deep-research.jpg')} style={{ position: 'absolute', left: 0, top: 0, width: sw, height: sh, maxWidth: 'none', transform: `translate3d(0, ${-gulir}px, 0)` }} />
        {ganti > 0.001 ? <Img src={staticFile('media/tuntun/research-tab.jpg')} style={{ position: 'absolute', left: 0, top: 0, width: sw, height: sh, maxWidth: 'none',
          transform: `translate3d(0, ${(1 - ganti) * HP.h}px, 0)` }} /> : null}
      </div>
    </div>);
};
const ASPEK: { ikon: KunciIkon; teks: string; warna: string }[] = [
  { ikon: 'perusahaan', teks: 'Bisnis', warna: B.blue }, { ikon: 'kualitas', teks: 'Kualitas', warna: B.turq }, { ikon: 'trofi', teks: 'Keunggulan', warna: B.orange },
  { ikon: 'daftarRisiko', teks: 'Risiko', warna: ARAH.turun }, { ikon: 'modelValuasi', teks: 'Dasar valuasi', warna: B.blue },
];
const KARTU = { x: 1250, y: 500, w: 620, h: 560 };
const AplikasiTuntun: React.FC<{ f: number }> = ({ f }) => {
  if (f < tC.masuk - 40 || f > tE.hpKeluar + 40) return null;
  const xHp = lerp(geserKe(f, tC.menepi, 960, 640), X_HP_E, cin(f, tE.layar)); // tab Research: memberi ruang untuk kartu fair value
  const gulir = 0; // tangkapan layar = tepat satu layar (980 × 1920) → tidak digulir (30 Okt: gulir dulu memperlihatkan area kosong)
  const pKartuC = popIn(f, tC.kartu) * linOut(f, tC.kartuKeluar);
  // 2 Nov (Simon S08: "Transisi antar visual seharusnya kamu bisa gunakan morphing"): kartu TIDAK mengecil keluar — MORF jadi lingkaran "Pahami bisnis"
  // (BagianFG, 60 f di tF.pusat); judul & keterangan tetap naik keluar di tE.keluar
  const pKartuE = popIn(f, tE.kartu);
  return (
    <>
      <Ponsel x={xHp} y={HP.y} masuk={linIn(f, tC.masuk)} keluar={1 - linOut(f, tE.hpKeluar)} gulir={gulir} ganti={cin(f, tE.layar)} />
      {/* C · kartu laporan Deep Research */}
      <Kaca x={KARTU.x} y={KARTU.y} w={KARTU.w} h={KARTU.h} p={pKartuC} warna={B.blue} tab="atas" padat>
        <div style={{ position: 'absolute', left: 40, top: 34 }}>
          <WordText f={f} at={tC.kartu + 10} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Deep Research Report</WordText></div>
        <Chip x={40} y={112} jangkar="kiri" teks="Disiapkan tim research Tuntun" ikon="kelas" warna={B.turq} p={popIn(f, tC.tim)} size={22} />
        {ASPEK.map((a, j) => {
          const y = 190 + 74 * j;
          return (
            <React.Fragment key={j}>
              <KacaBulat x={72} y={y} d={60} warna={a.warna} p={popIn(f, tC.aspek[j])} padat><Icon name={a.ikon} size={32} color={a.warna} /></KacaBulat>
              <div style={{ position: 'absolute', left: 122, top: y - 20 }}>
                <WordText f={f} at={tC.aspek[j] + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>{a.teks}</WordText></div>
            </React.Fragment>);
        })}
      </Kaca>
      {/* D · Tuntun AI: tanya → menjawab */}
      {f >= tD.ai - 30 && f < tD.keluar + 40 ? (
        <>
          <AiTuntun f={f} x={1260} y={520} tinggi={260} p={skalaPop(popIn(f, tD.ai) * linOut(f, tD.keluar))} t0={tD.ai} />
          <Gelembung x={1020} y={300} p={popIn(f, tD.tanya) * linOut(f, tD.keluar - 6)} warna={B.blue} isi="?" />
          <Gelembung x={1470} y={300} p={popIn(f, tD.jawab) * linOut(f, tD.keluar)} warna={B.white} isi="titik" f={f} />
          <Label x={1260} y={710} teks="Tuntun AI" f={f} at={tD.ai + 10} size={32} keluar={tD.keluar - 20} />
        </>) : null}
      {/* E · KARTU FAIR VALUE = REPLIKA kartu aplikasi Tuntun (30 Okt malam, Simon S08: "Sesuaikan visual fairvalue dengan fairvalue yang ada di apps" — acuan:
          tab Research BBCA di ponsel scene ini + video "How To Use – Fair Value"): judul "BBCA = 6,150" · kartu putih tiga kolom dipisah garis tipis —
          Company Quality (Best, batang 3 ruas) · Reference Fair Value (6,943 - 8,168, batang gradasi hijau→kuning→merah 3 ruas, penanda ▲ = harga) ·
          Bullish Signals (4 Positive). Teks & format angka = aplikasi (Inggris, koma ribuan). Keterangan 11% - 24% Undervalued = hitungan (6.943 − 6.150) ÷ 6.943
          dan (8.168 − 6.150) ÷ 8.168, sama dengan bagian Fair Value aplikasi (kartu atas aplikasi menulis 11% - 34%: tidak cocok dengan angkanya) */}
      <KartuFairValue f={f} p={pKartuE} />
    </>);
};
// 30 Okt malam (Simon: "keknya ini kurang ketengah"): ponsel + kartu kini BERPUSAT di x 960 (ponsel memberi ruang ke kiri 640 → 470 saat layar berganti ke
// tab Research; kartu x 1215, lebar 900) dan judul + kartu berpusat tegak setinggi pusat ponsel (±512); isi kartu di tengah tinggi kartu (dulu kosong ±70 px
// di bawah). Dulu kartu 910–1870 (mepet tepi kanan), judul + kartu ±100 px lebih tinggi dari pusat ponsel.
// + "atau mungkin bisa kamu kecilkan saja": kartu digambar 0,88× (±790 px tampil), judul 56 px; ponsel 520 + kartu 1210 → kelompok 307–1605, pusat x 956
const FV = { x: 1210, y: 560, w: 900, h: 204, judulY: 410, k: 0.88 };
const X_HP_E = 520;
const GRAD_FV = 'linear-gradient(90deg, #11A386 0%, #7DBE45 22%, #F2CB2E 45%, #F6B73C 62%, #F48A3C 80%, #F2584A 100%)';
const HIJAU_APP = '#14A389';
const KolomFV: React.FC<{ judul: string; children: React.ReactNode; kiri?: string; kanan?: string; tengah?: React.ReactNode; batang: React.ReactNode; lebar?: number }> =
  ({ judul, children, kiri, kanan, tengah, batang, lebar = 1 }) => (
    // baris bawah marginTop 12 → 20 (audit TEKS-LEWAT-TEPI f36090–36450: ujung ▲ penanda harga menyentuh "-" di "11% - 24%"); sama di ketiga kolom
    <div style={{ position: 'relative', flex: lebar, padding: '0 26px', textAlign: 'center', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: F, fontSize: 24, fontWeight: 500, color: '#8E8E96' }}>{judul}</div>
      <div style={{ height: 56, display: 'grid', placeItems: 'center' }}>{children}</div>
      <div style={{ position: 'relative', height: 16 }}>{batang}</div>
      <div style={{ display: 'flex', justifyContent: tengah ? 'center' : 'space-between', marginTop: 20, fontFamily: F, fontSize: 22, fontWeight: 500, color: '#8E8E96' }}>
        {tengah ?? <><span>{kiri}</span><span>{kanan}</span></>}</div>
    </div>);
const Ruas3: React.FC<{ warna: string; g?: number }> = ({ warna, g = 1 }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 4, clipPath: g < 0.9999 ? `inset(0 ${100 - 100 * g}% 0 0)` : undefined }}>
    {[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, borderRadius: k === 0 ? '8px 0 0 8px' : k === 2 ? '0 8px 8px 0' : 0, background: warna }} />)}
  </div>);
const KartuFairValue: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0.001) return null;
  // panel muncul BERSAMA isinya: rentang & batang tampil dengan kartu; ▲ (posisi harga) pop di "harga market", keterangan undervalued di "nilai"
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: FV.w, textAlign: 'center', transform: geser(FV.x - FV.w / 2, FV.judulY - 40) }}>
        <WordText f={f} at={tE.kartu + 10} until={tE.keluar} style={{ fontFamily: F, fontSize: 56, fontWeight: 800, color: B.night }}>BBCA =</WordText>{' '}
        <WordText f={f} at={tE.harga} until={tE.keluar} style={{ fontFamily: F, fontSize: 56, fontWeight: 800, color: B.blue }}>6,150</WordText>
      </div>
      {f < tF.pusat - 30 ? <div style={{ position: 'absolute', left: 0, top: 0, width: FV.w, height: FV.h, borderRadius: 28, background: B.white, boxShadow: '0 18px 40px -26px rgba(18,16,48,.35)',
        border: '2px solid #EEEEF2', boxSizing: 'border-box', transformOrigin: 'center', transform: `${geser(FV.x - FV.w / 2, FV.y - FV.h / 2)} scale(${skalaPop(p) * FV.k})`, display: 'flex' }}>
        <IsiKartuFV f={f} />
      </div> : null}
      {/* 2 Nov (Simon: 'Icon "?" posisinya aneh'): "?" di KIRI keterangan "Referensi, bukan kepastian" (dulu di pojok kanan-atas kartu, menimpa kolom Bullish
          Signals); pop di kata "benar", keluar bersama keterangannya */}
      <Lencana x={FV.x - 214} y={FV.y + (FV.h / 2) * FV.k + 54} d={0} p={popIn(f, tE.ragu) * linOut(f, tE.keluar)} warna={B.orange} teks="?" besar={46} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: FV.w, textAlign: 'center', transform: geser(FV.x - FV.w / 2, FV.y + (FV.h / 2) * FV.k + 36) }}>
        <WordText f={f} at={tE.ragu + 20} until={tE.keluar} style={{ fontFamily: F, fontSize: 28, fontWeight: 700, color: ABU_TEKS }}>Referensi, bukan kepastian</WordText></div>
    </>);
};
/** isi kartu fair value (900 × 204, satuan kartu) — dipakai kartu & isi awal morf ke lingkaran "Pahami bisnis" */
const IsiKartuFV: React.FC<{ f: number }> = ({ f }) => {
  const gBand = cin(f, tE.kartu + 20), pPenanda = popIn(f, tE.harga + 10);
  return (
    <>
        <KolomFV judul="Company Quality" kiri="Average" kanan="Best" batang={<Ruas3 warna={HIJAU_APP} />}>
          <span style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: HIJAU_APP }}>Best</span></KolomFV>
        <div style={{ width: 2, margin: '28px 0', background: '#EEEEF2' }} />
        <KolomFV judul="Reference Fair Value" lebar={1.36} tengah={<WordText f={f} at={tE.celah} style={{ fontFamily: F, fontSize: 22, fontWeight: 500, color: '#8E8E96' }}>11% - 24% Undervalued</WordText>}
          batang={<>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 4, clipPath: gBand < 0.9999 ? `inset(0 ${100 - 100 * gBand}% 0 0)` : undefined }}>
              {[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, borderRadius: k === 0 ? '8px 0 0 8px' : k === 2 ? '0 8px 8px 0' : 0, background: GRAD_FV,
                backgroundSize: '300% 100%', backgroundPosition: `${k * 50}% 0` }} />)}
            </div>
            {pPenanda > 0.001 ? <div style={{ position: 'absolute', left: '27%', top: 18, width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent',
              borderBottom: `13px solid ${B.night}`, transform: `translateX(-9px) scale(${skalaPop(pPenanda)})`, transformOrigin: '50% 0' }} /> : null}
          </>}>
          <WordText f={f} at={tE.kartu + 10} style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>6,943 - 8,168</WordText></KolomFV>
        <div style={{ width: 2, margin: '28px 0', background: '#EEEEF2' }} />
        <KolomFV judul="Bullish Signals" kiri="0" kanan="≥3" batang={<Ruas3 warna={HIJAU_APP} />}>
          <span style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: HIJAU_APP }}>4 Positive</span></KolomFV>
    </>);
};
/** gelembung obrolan: "?" (pertanyaan) atau titik mengetik (jawaban) */
const Gelembung: React.FC<{ x: number; y: number; p: number; warna: string; isi: '?' | 'titik'; f?: number }> = ({ x, y, p, warna, isi, f = 0 }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 150, height: 96, transform: `${geser(x - 75, y - 48)} scale(${skalaPop(p)})`, transformOrigin: 'center',
    borderRadius: 30, background: warna, border: warna === B.white ? `3px solid ${B.grayLite}` : undefined, boxSizing: 'border-box', display: 'grid', placeItems: 'center',
    boxShadow: `0 10px 22px -14px ${rgba(B.night, 0.4)}` }}>
    {isi === '?' ? <span style={{ fontFamily: F, fontSize: 52, fontWeight: 800, color: B.white, lineHeight: 1 }}>?</span> : (
      <div style={{ display: 'flex', gap: 12 }}>
        {[0, 1, 2].map((k) => <i key={k} style={{ width: 16, height: 16, borderRadius: 8, background: B.blue, display: 'inline-block',
          transform: `translate3d(0, ${-8 * Math.max(0, Math.sin(((f - k * 8) / 48) * Math.PI * 2))}px, 0)` }} />)}
      </div>)}
  </div>);

/* ═══════════════════════ F–G · METODE LAIN = REFERENSI TAMBAHAN · FONDASI ═══════════════════════ */
const PUSAT = { x: 960, y: 420, D: 240 };
/** 30 Okt malam (Simon S08: "ini belum kamu perbaiki" — layout "Technical analysis, momentum, dan data transaksi … referensi tambahan"): tiga satelit
 *  SEBARIS (y 690; dulu TA & data 600, momentum 690), cabang putus-putus berpangkal DI BAWAH label "Pahami bisnis" (dulu dari bawah lingkaran → garis ke
 *  Momentum menembus label), "Pahami bisnis" tengah dulu lalu naik 100 px memberi ruang saat satelit pertama muncul, kembali saat menepi (bagian G) */
const SATELIT: { ikon: KunciIkon; teks: string; at: () => number; x: number; y: number }[] = [
  { ikon: 'grafikHarga', teks: 'Technical analysis', at: () => T.technical, x: 560, y: 690 },
  { ikon: 'naikTurun', teks: 'Momentum', at: () => T.momentum, x: 960, y: 690 },
  { ikon: 'dataAngka', teks: 'Data transaksi', at: () => T.data, x: 1360, y: 690 },
];
// pusat −30 (dulu tepat "metode"): pop mulai saat kartu fair value habis mengecil — dulu layar hanya latar f36495–36535 (audit FRAME-KOSONG f36510)
const tF = { pusat: T.metode - 30, tambahan: T.referensi2 + 10, keluarSatelit: T.tapi - 10, menepi: T.sebelum - 10, fondasi: T.fondasinya + 35,
  tanya: T.mana + 10, urut: T.pahami2, cek: T.beli + 10, keluar: T.video - 20 };
const BagianFG: React.FC<{ f: number }> = ({ f }) => {
  if (f < tF.pusat - 40 || f > tF.keluar + 40) return null;
  const xP = geserKe(f, tF.menepi, PUSAT.x, 640);
  const yP = PUSAT.y - 100 * cin(f, T.technical - 10) + 100 * cin(f, tF.menepi); // tengah dulu → memberi ruang satelit → kembali ke baris ①→②
  const k = linOut(f, tF.keluar);
  // TA DIBAWA: satelit "Technical analysis" menjadi langkah ② "Harga ke mana?" di kanan
  const uTA = cin(f, tF.menepi);
  const xTA = lerp(SATELIT[0].x, 1300, uTA), yTA = lerp(SATELIT[0].y, yP, uTA), dTA = lerp(130, 180, uTA);
  // 2 Nov: ① & ② tidak pop keluar — MORF jadi pilar 01 & 02 kuil (BagianH, 60 f di tH.kuil); foto ① turun & ikon ② pop keluar tepat sebelumnya
  const keKuil = f < tH.kuil - 30;
  const kMorf = linOut(f, tF.keluar - 15);
  // kartu fair value MORF jadi lingkaran ini (60 f di tF.pusat); sesudahnya lingkaran + foto gedung naik di maskernya
  const uKartu = cin(f, tF.pusat);
  const ISI_FV = { w: FV.w * FV.k, h: FV.h * FV.k };
  return (
    <>
      {uKartu > 0 && uKartu < 1 ? <KacaMorf a={{ x: FV.x, y: FV.y, w: ISI_FV.w, h: ISI_FV.h, warna: '#EEEEF2', radius: 28 * FV.k }} b={geoBulat(PUSAT.x, PUSAT.y, PUSAT.D, B.blue)}
        t={Math.max(0.0002, Math.min(uKartu, 0.9998))} padat tepiB={1}
        isiA={<div style={{ width: FV.w, height: FV.h, transform: `scale(${FV.k})`, transformOrigin: '0 0', display: 'flex' }}><IsiKartuFV f={f} /></div>} /> : null}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {SATELIT.map((s, j) => <Penghubung key={j} d={`M ${PUSAT.x} ${(yP + PUSAT.D / 2 + 78).toFixed(1)} L ${s.x} ${s.y - 74}`} g={cin(f, s.at() - 10) * (1 - cin(f, tF.keluarSatelit - 20))}
          warna={B.blueLite} titik={false} tebal={3} />)}
        <Penghubung d={`M ${xP + 140} ${yP} L ${1300 - 104} ${yP}`} g={cin(f, tF.urut) * k} warna={B.gray} tebal={4} panah={{ x: 1300 - 104, y: yP, sudut: 0 }} />
      </svg>
      {/* inti: value investing (pahami bisnis) = hasil morf kartu fair value; foto gedung naik di maskernya sesudah mendarat */}
      {uKartu >= 1 && keKuil ? <KacaBulat x={xP} y={yP} d={PUSAT.D} warna={B.blue} p={0.99996} padat /> : null}
      {/* foto naik mulai di 20 % akhir morf (lingkaran tidak kosong sesudah mendarat) */}
      {uKartu > 0.8 && keKuil ? <FotoLingkar pose={POSE_BENDA.gedung} x={xP} y={yP} D={PUSAT.D} s={1} warna={B.blue} naik={cin(f, tF.pusat + 40) * kMorf} tanpaLatar /> : null}
      <Label x={xP} y={yP + PUSAT.D / 2 + 44} teks="Pahami bisnis" f={f} at={tF.pusat + 10} size={32} keluar={tF.keluar - 20} />
      <Lencana x={xP} y={yP} d={PUSAT.D} p={popIn(f, tF.cek) * k} warna={CEK} ikon="tersedia" besar={60} />
      {/* fondasi di bawah inti */}
      {popIn(f, tF.fondasi) > 0.001 && keKuil ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 340, height: 64, borderRadius: 16, background: B.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          transformOrigin: 'center', transform: `${geser(xP - 170, yP + PUSAT.D / 2 + 86)} scale(${skalaPop(popIn(f, tF.fondasi))})` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${skalaPop(kMorf)})` }}>
            <Icon name="fondasi" size={36} color={B.white} /><span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.white }}>Fondasi</span></div>
        </div>) : null}
      {/* satelit: referensi tambahan (lebih kecil, rona muda) */}
      {SATELIT.map((s, j) => {
        const p = popIn(f, s.at()) * (j === 0 ? (keKuil ? 1 : 0) : linOut(f, tF.keluarSatelit + 6 * j));
        const x = j === 0 ? xTA : s.x, y = j === 0 ? yTA : s.y, d = j === 0 ? dTA : 130;
        return (
          <React.Fragment key={j}>
            <KacaBulat x={x} y={y} d={d} warna={B.blueLite} p={p} padat><div style={{ transform: j === 0 ? `scale(${skalaPop(kMorf)})` : undefined }}><Icon name={s.ikon} size={d * 0.5} color={B.blueLite} /></div></KacaBulat>
            <Label x={x} y={y + d / 2 + 36} teks={j === 0 && uTA > 0.5 ? 'Harga ke mana?' : s.teks} f={f} at={j === 0 && uTA > 0.5 ? tF.tanya : s.at() + 10} size={26} lebar={300}
              keluar={j === 0 ? (uTA > 0.5 ? tF.keluar - 20 : tF.menepi - 30) : tF.keluarSatelit - 10} />
          </React.Fragment>);
      })}
      <Lencana x={xTA} y={yTA} d={dTA} p={popIn(f, tF.tanya) * k} warna={B.orange} teks="?" besar={52} />
      <Chip x={960} y={880} teks="Referensi tambahan" ikon="alasan" warna={B.blueLite} p={popIn(f, tF.tambahan) * linOut(f, tF.keluarSatelit)} size={26} />
      {/* urutan: ① pahami dulu → ② harga */}
      <Nomor2 x={xP - PUSAT.D / 2 + 10} y={yP - PUSAT.D / 2 + 10} n={1} p={popIn(f, tF.urut) * k} warna={B.blue} />
      <Nomor2 x={xTA - dTA / 2 + 6} y={yTA - dTA / 2 + 6} n={2} p={popIn(f, tF.urut + 20) * k} warna={B.gray} />
    </>);
};
const Nomor2: React.FC<{ x: number; y: number; n: number; p: number; warna: string }> = ({ x, y, n, p, warna }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 52, height: 52, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
    display: 'grid', placeItems: 'center', transform: `${geser(x - 26, y - 26)} scale(${skalaPop(p)})`, transformOrigin: 'center', fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night }}>{n}</div>);

/* ═══════════════════════ H · DI VIDEO SELANJUTNYA: PILAR PERTAMA ═══════════════════════ */
const PILAR: { ikon: KunciIkon; warna: string; label: string }[] = [
  { ikon: 'warung', warna: B.blue, label: 'Beli bisnisnya' }, { ikon: 'valuasi', warna: B.turq, label: 'Harga di bawah nilai' },
  { ikon: 'disiplin', warna: B.orange, label: 'Manfaatkan market' }, { ikon: 'alasan', warna: B.blue, label: 'Pahami bisnisnya' },
];
const KUIL = { cx: 960, pilarX: [615, 845, 1075, 1305], pilarW: 190, atas: 378, bawah: 690 };
const tH = { chip: T.video, kuil: T.video + 20, pilar: T.pilar, mekar: T.membeli, potong: T.sebagian + 10, tanya: T.apa };
const PANEL = { x: 960, y: 500, w: 1200, h: 580 };
const IsiPilar: React.FC<{ i: number }> = ({ i }) => {
  const pl = PILAR[i];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: KUIL.pilarW, height: KUIL.bawah - KUIL.atas }}>
      <div style={{ position: 'absolute', left: KUIL.pilarW / 2 - 28, top: 28, width: 56, height: 56, borderRadius: '50%', border: `${SISI}px solid ${pl.warna}`, boxSizing: 'border-box',
        display: 'grid', placeItems: 'center', background: B.white, fontFamily: F, fontSize: 22, fontWeight: 800, color: B.night }}>{`0${i + 1}`}</div>
      <div style={{ position: 'absolute', left: KUIL.pilarW / 2 - 48, top: 102, width: 96, height: 96, borderRadius: '50%', border: `${SISI}px solid ${pl.warna}`, boxSizing: 'border-box',
        display: 'grid', placeItems: 'center', background: B.white }}><Icon name={pl.ikon} size={52} color={pl.warna} /></div>
      <div style={{ position: 'absolute', left: 16, right: 16, top: 214, textAlign: 'center', fontFamily: F, fontSize: 23, fontWeight: 800, color: B.night, lineHeight: 1.18 }}>{pl.label}</div>
    </div>);
};
const IsiPilarSatu: React.FC<{ f: number }> = ({ f }) => {
  const cx = 300, cy = 310, Rr = 150, n = 8, kel = 2 * Math.PI * Rr, seg = kel / n;
  const cincin = cin(f, tH.mekar + 20), potong = popIn(f, tH.potong);
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 34, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: `${SISI}px solid ${B.blue}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center',
          fontFamily: F, fontSize: 22, fontWeight: 800, color: B.night }}>01</div>
        <WordText f={f} at={tH.mekar + 20} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Beli bisnisnya</WordText>
      </div>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {Array.from({ length: n }, (_, j) => {
          const tampak = Math.max(0, Math.min(1, cincin * n - j));
          return tampak <= 0 ? null : <circle key={j} cx={cx} cy={cy} r={Rr} fill="none" stroke={j === 0 ? mixHex(B.turqLite, B.orange, potong) : B.turqLite} strokeWidth={24}
            strokeDasharray={`${(seg - 8) * tampak} ${kel}`} transform={`rotate(${-90 + (360 / n) * j} ${cx} ${cy})`} />;
        })}
      </svg>
      <FotoLingkar pose={POSE_BENDA.gedung} x={cx} y={cy} D={190} s={popIn(f, tH.mekar + 10)} warna={B.turq} naik={cin(f, tH.mekar + 30)} />
      <Chip x={cx} y={cy + Rr + 60} teks="Sebagian perusahaan" ikon="kepemilikan" warna={B.orange} p={popIn(f, tH.potong + 20)} size={26} />
      {/* pertanyaan sejajar tengah cincin (cy 310) — dulu menggantung di atas (pusat ±243) */}
      <div style={{ position: 'absolute', left: 560, top: cy - 53, width: 580, lineHeight: 1.2 }}>
        <WordText f={f} at={tH.tanya} rataBaris style={{ fontFamily: F, fontSize: 44, fontWeight: 800, color: B.night }}>Apa yang perlu kita pahami dari perusahaan itu?</WordText>
      </div>
      {/* 2 Nov (Simon: 'Icon "?" posisinya aneh'): "?" menempel di cincin perusahaan (kanan-atas, 45°) — pertanyaannya tentang perusahaan itu; dulu melayang
          di atas ujung kalimat yang sudah bertanda tanya */}
      <Lencana x={cx + Rr * 0.71} y={cy - Rr * 0.71} d={0} p={popIn(f, tH.tanya + 40)} warna={B.orange} teks="?" besar={64} />
    </>);
};
/** geometri pilar i (kartu) */
const geoPilarH = (i: number): GeoKartu => ({ x: KUIL.pilarX[i], y: (KUIL.atas + KUIL.bawah) / 2, w: KUIL.pilarW, h: KUIL.bawah - KUIL.atas, warna: PILAR[i].warna, tab: 'atas' });
const BagianH: React.FC<{ f: number }> = ({ f }) => {
  if (f < tH.chip - 40) return null;
  const pKuil = popIn(f, tH.kuil);
  const u = cin(f, tH.mekar);
  const lebar = KUIL.pilarX[3] - KUIL.pilarX[0] + KUIL.pilarW;
  // 2 Nov (Simon S08: morphing antar visual): ① Pahami bisnis → PILAR 01, ② Harga ke mana? → PILAR 02, bilah Fondasi → ALAS kuil (60 f di tH.kuil);
  // atap + pilar 03 · 04 pop (benda baru). Dulu ①② pop keluar lalu seluruh kuil pop.
  const uK = cin(f, tH.kuil), morfK = f >= tH.kuil - 30 && uK < 1; // mulai TEPAT saat BagianFG berhenti (f tH.kuil − 30, u = 0) — dulu u > 0: satu frame kosong f37584
  const alas = { x: KUIL.cx - lebar / 2 - 56, y: 708, w: lebar + 112, h: 52 };
  return (
    <>
      <Chip x={960} y={170} teks="Di video selanjutnya" ikon="arah" warna={B.blue} p={popIn(f, tH.chip)} size={30} />
      {/* kuil empat pilar (S02) */}
      {pKuil > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, transformOrigin: '960px 500px', transform: pKuil < 0.9999 ? `scale(${skalaPop(pKuil)})` : undefined }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <path d={`M ${KUIL.cx - lebar / 2 - 40} 336 L ${KUIL.cx} 240 L ${KUIL.cx + lebar / 2 + 40} 336 Z`} fill={B.white} stroke={B.blue} strokeWidth={5} strokeLinejoin="round" />
            <rect x={KUIL.cx - lebar / 2 - 56} y={334} width={lebar + 112} height={26} rx={8} fill={B.blue} />
            {uK >= 1 ? <rect x={alas.x} y={alas.y} width={alas.w} height={alas.h} rx={14} fill={B.blue} /> : null}
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Value investing</div>
          {PILAR.map((pl, i) => (i === 0 && u > 0) || (i < 2 && uK < 1) ? null : (
            <Kaca key={i} x={KUIL.pilarX[i]} y={(KUIL.atas + KUIL.bawah) / 2} w={KUIL.pilarW} h={KUIL.bawah - KUIL.atas} p={1} warna={pl.warna} tab="atas" padat
              tepi={i === 0 ? cin(f, tH.pilar) : 0}><IsiPilar i={i} /></Kaca>))}
        </div>) : null}
      {/* ① → pilar 01 · ② → pilar 02 · Fondasi → alas (di luar lapisan kuil yang pop, koordinat layar) */}
      {morfK ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, width: lerp(340, alas.w, uK), height: lerp(64, alas.h, uK), borderRadius: lerp(16, 14, uK), background: B.blue,
            transform: geser(lerp(470, alas.x, uK), lerp(PUSAT.y + PUSAT.D / 2 + 86, alas.y, uK)), boxShadow: `0 10px 22px -14px ${rgba(B.blue, 0.5 * (1 - uK))}` }} />
          <KacaMorf a={geoBulat(640, PUSAT.y, PUSAT.D, B.blue)} b={geoPilarH(0)} t={Math.max(0.0002, Math.min(uK, 0.9998))} padat tepi={1} isiB={<IsiPilar i={0} />} />
          <KacaMorf a={geoBulat(1300, PUSAT.y, 180, B.blueLite)} b={geoPilarH(1)} t={Math.max(0.0002, Math.min(uK, 0.9998))} padat tepi={1}
            isiA={<div style={{ width: 180, height: 180, display: 'grid', placeItems: 'center', transform: `scale(${skalaPop(linOut(f, tF.keluar - 15))})` }}><Icon name="grafikHarga" size={90} color={B.blueLite} /></div>}
            isiB={<IsiPilar i={1} />} />
        </>) : null}
      {/* pilar 01 MEMEKAR jadi panel (pola S02) */}
      {u > 0 ? (
        <KacaMorf a={{ x: KUIL.pilarX[0], y: (KUIL.atas + KUIL.bawah) / 2, w: KUIL.pilarW, h: KUIL.bawah - KUIL.atas, warna: B.blue, tab: 'atas' }}
          b={{ ...PANEL, warna: B.blue, tab: 'atas' }} t={Math.min(u, 0.9998)} tepi={1} padat z={5}
          isiA={<IsiPilar i={0} />} isiB={<div style={{ position: 'absolute', inset: 0 }}><IsiPilarSatu f={f} /></div>} />) : null}
    </>);
};

/* ═══════════════════════ SCENE ═══════════════════════ */
export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL) return null;
  return (
    <>
      <BagianAB f={f} />
      <AplikasiTuntun f={f} />
      <BagianFG f={f} />
      <BagianH f={f} />
    </>);
};
export const S08_T = T;
