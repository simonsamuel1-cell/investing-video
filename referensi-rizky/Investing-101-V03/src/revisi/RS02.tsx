import React from 'react';
import { RS03_MASUK } from './RS03';
import { S01_KELUAR } from '../s01/Scene01';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, io, lerp, rgba } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Bulat, denyut } from '../parts/umum';
import { Kaca, KarakterLingkar, bayanganKaca, geser, durMasker, type PoseKarakter } from '../parts/kaca';
import { S03_DAFTAR_AWAL } from './RS03';
import { SKALA, keLokal } from '../skala';
import { Foto, Kalender, Uang } from '../parts/nyata';
import { DaftarUang, KartuRute, Rute, tinggiDaftar, ujungBaris } from '../parts/rute';
import { GrafikGaris, GrafikLilin, laju, nilaiLilin, relatif, rentang } from '../parts/lilin';
import { S02_INVESTASI } from '../data/pasar';

/**
 * REVISI SCENE 02 (14 Okt, evaluasi 5 pertanyaan — `04_Asset/Evaluasi-5-Pertanyaan-S02-S15.md`).
 * Pesan: uang bulan depan ≠ uang lima tahun lagi → pisahkan. Tata letak PANEL PERBANDINGAN + kolom ikon tengah (ref-22).
 *   A–B PEMBUKA BARU (Simon 14 Okt, acuan "inbox → kartu → ikon" + orang dimasking lingkaran seperti V02 Scene 1):
 *      orang (kepala menyembul dari lingkaran oranye) → kartu daftar "Uang saya" → baris "Tagihan listrik · bulan depan" dialirkan panah biru ke
 *      kartu Tagihan listrik → kalender 20 Nov 2026 · baris "Tabungan rumah · 5 tahun lagi" dialirkan panah oranye ke kartu Rumah → kalender
 *      2026 → 2031. Dua uang, dua jalur berbeda ("nggak seharusnya diperlakukan sama"). Rombongan tumbuh dari kiri ke kanan, selalu berpusat.
 *   C  "waktu penggunaannya berbeda, kemampuan … naik-turunnya investasi juga berbeda"
 *        tagihan & rumah jadi kepala dua panel; baris WAKTU = kalender nyata (1 halaman bulan depan vs 5 kalender tahun 2027–2031);
 *        baris UANG = uang tagihan diam Rp450.000 · uang rumah naik-turun berjalan (tumpukan membesar/mengecil)
 *   D  "pisahkan dulu uangnya berdasarkan kebutuhan"  uang masuk wadahnya di baris yang sama: Tabungan (kiri) · Investasi (kanan)
 * Panel tumbuh per baris dan tetap berpusat (geser bertahap), tanpa slot kosong.
 */

const [karena, uang1, yang1, dipakai1, bulan, depan, tentu, nggak, seharusnya, diperlakukan, sama, dengan, uang2, dipakai2, lima, tahun, lagi, waktu, penggunaannya,
  berbeda1, kemampuan, naikTurun, juga, berbeda2, jadi, produk, pisahkan, uangnya, kebutuhan] = urut([
  'karena', 'uang', 'yang', 'dipakai', 'bulan', 'depan', 'tentu', 'nggak', 'seharusnya', 'diperlakukan', 'sama', 'dengan', 'uang', 'dipakai', 'lima', 'tahun', 'lagi',
  'waktu', 'penggunaannya', 'berbeda', 'kemampuan', 'naik-turunnya', 'juga', 'berbeda', 'jadi', 'produk', 'pisahkan', 'uangnya', 'kebutuhan'], BATAS.s2);

const T = {
  // A–B pembuka "kotak masuk"
  karena, uang1, daftar: yang1 + 6, baris: [dipakai1, uang2], tagBaris: [bulan, lima], sorot: [depan, lima + 10],
  rute1: [depan, depan + 50], kartu1: depan + 40, panah1: [tentu - 10, tentu + 30], kal1: tentu + 20, lingkar1: [tentu + 40, tentu + 80], centang1: nggak + 10,
  rute2: [dipakai2 - 4, tahun], kartu2: lima, panah2: [tahun - 10, lagi + 10], kal2: tahun + 10, tahun: [lagi, lagi + 45], centang2: lagi,
  denyutA: [seharusnya, diperlakukan, sama, dengan],
  susun: waktu, judul1: waktu + 24, // isi panel C muncul SESUDAH kartu kepala mendarat (s2 selesai di susun + 50) — dulu bersamaan → kalender tertutup kartu yang masih meluncur
  kalLain: [waktu + 60, waktu + 75, waktu + 90, waktu + 105], penggunaannya, denyutWaktu: berbeda1 + 20,
  baris2: kemampuan, gerak: [naikTurun - 20, jadi + 10], denyutBeda: [juga, berbeda2],
  judulKeluar: jadi, denyutProduk: produk, masuk: [pisahkan - 30, pisahkan + 10], wadah: pisahkan + 40, judul2: pisahkan + 30, sorot2: uangnya + 30, denyutAkhir: kebutuhan,
};

/* ── tata letak ── */
const KIRI = B.blue, KANAN = B.orange; // = warna Uang Aktif & Uang Jangka Panjang di Scene 03 (benang merah warna)
/** Simon 14 Okt: "tambahkan space diantara 3 object itu" — panel kiri · kolom ikon tengah (66) · panel kanan berjarak 40 px (dulu ±2 px menempel):
 *  panel 740 → 700, pusat panel 555/1365 → 537/1383 (tetap simetris di 960) */
const PL = 537, PR = 1383, PW = 700, PUSAT_Y = 540; // pusat frame (ukur 14 Okt: dulu 570 → panel +30 px)
const KEPALA = 290, BARIS = 200;
const NILAI_T = 450_000, NILAI_R = 6_500_000;
/** Simon 14 Okt — naik-turun investasi = candlestick realistis: IHSG bulanan asli Jan 2019 – Des 2023 (5 tahun, jatuh 2020 lalu pulih, +17 %) */
const INV = relatif(S02_INVESTASI);
const DOM_INV = rentang(INV, 0.12);
/** baris UANG (relatif pusat panel): kolom uang → wadah (label di bawahnya) · kolom nominal + grafik */
const KOL = -230, KAN = -110, GR = { w: 400, h: 92 };
const HAL_TAGIHAN = [{ atas: 'Nov 2026', angka: '20' }];
const HAL_RUMAH = ['2026', '2027', '2028', '2029', '2030', '2031'].map((t) => ({ atas: 'Okt', angka: t }));
const KAL_S = 0.5, KAL_JARAK = 134;
/** A–B: tA = tagihan (A, skala 1,45) · kolX = kolom kiri B (tagihan y tB di atas, rumah y rB di bawah) · oA / oB = sosok (kanan); pil Rp di kiri kepala sosok.
 *  Simon 14 Okt "perbaiki layout dan spacingnya" (B): tumpukan tagihan → rumah berjarak 40 px (tepi bawah tagihan/meteran → kalender rumah), kolom 209–872
 *  berpusat di 540 & rata bawah dengan kaki sosok (880); kolom ↔ pil Rp ↔ sosok berjarak ≥ 40 px; rombongan berpusat di 960. */
const AB = { tA: [680, 520], kolX: 686, tB: 412, rB: 768, oA: 1360, oB: 1306 }; // (tata letak A–B lama, tidak dipakai lagi — disimpan sebagai catatan)
void AB;
/** PEMBUKA "KOTAK MASUK" — kolom (x pusat, susunan akhir): orang Ø280 · daftar 540 · kartu tujuan 430 × 140 · kalender ikon (s 0,55).
 *  Lebar total 151–1768 (berpusat di 960); tinggi 310–770 (berpusat di 540). Sebelum semua muncul, rombongan digeser (ox, oy) supaya yang
 *  sudah tampak selalu di tengah: orang sendiri → orang + daftar → + jalur 1 → + jalur 2 (geser bertahap, inOut cubic). */
const MB = { px: 251, py: 594, D: 300, lx: 711, ly: 540, lw: 560, rb: 100, cx: 1361, cw: 520, ch: 170, cy: [360, 720], kx: 1748, ks: 0.62 };
/** murid kemeja biru berpikir (foto Simon) di lingkaran: kepala 0,61 r · puncak kepala 1,72 r di atas pusat (sama dengan MURID/KARYAWAN) */
const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };

const Teks: React.FC<{ x: number; y: number; teks: string; alfa: number; size?: number; warna?: string; jangkar?: 'kiri' | 'tengah' }> =
  ({ x, y, teks, alfa, size = 28, warna = B.night, jangkar = 'tengah' }) => alfa <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(${jangkar === 'tengah' ? '-50%' : '0'}, -50%)`, fontFamily: F, fontSize: size,
      fontWeight: 800, color: warna, whiteSpace: 'nowrap', opacity: Math.min(0.9999, alfa), lineHeight: 1 }}>{teks}</div>);

export const RS02: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS03_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s2 || f >= RS03_MASUK.mulai + durMasker) return null;
  // Simon 14 Okt: MASUK Scene 2 = zoom in (kecil → besar) + fade in, BERSAMAAN dengan swipe turun Scene 1 (jendela 60f yang sama, inOut cubic);
  // poros = pusat orang (960, 540) — saat itu orang sendirian di tengah
  const masukS2 = cin(f, S01_KELUAR);
  // (peralihan A–B → C memakai sw · t1 · t2 di bawah)
  // jumlah baris panel (pecahan saat tumbuh) — panel tumbuh, pusat tetap
  const n = cin(f, T.susun + 50) + cin(f, T.baris2); // baris panel tumbuh SESUDAH kartu kepala mendarat
  const h = KEPALA + n * BARIS + 10, top = PUSAT_Y - h / 2;
  const kepalaY = top + 152;
  const y1 = top + KEPALA + 100, y2 = top + KEPALA + 300;

  // ── A–B pembuka: rombongan tumbuh ke kanan, selalu berpusat ──
  const pDaftar = cin(f, T.daftar), pK2 = cin(f, T.kartu2);
  // tahap 3 (rombongan bergeser ke posisi akhir) BERSAMAAN panah 1 mulai tergambar — dulu bersama kartu 1: panah & kartu sempat di luar frame kanan
  // susunan bergeser ke posisi akhir BERSAMA kartu Tagihan muncul (dulu di awal sapuan garis, 40f sebelum kartunya: −292 px — verifikasi 14 Okt)
  const pRute1 = cin(f, T.kartu1 - 24);
  const ox = lerp(lerp(709, 414, pDaftar), 0, pRute1), oy = 30 * pRute1 * (1 - pK2);
  const nBaris = cin(f, T.baris[0], 40) + cin(f, T.baris[1], 40);
  const lh = tinggiDaftar(Math.max(1, nBaris), MB.rb), lx = MB.lx + ox, ly = MB.ly + oy;
  const cx = MB.cx + ox, kx = MB.kx + ox, cy = MB.cy.map((v) => v + oy);
  const [r0x, r0y] = ujungBaris(lx, ly, MB.lw, lh, 0, MB.rb), [r1x, r1y] = ujungBaris(lx, ly, MB.lw, lh, 1, MB.rb);
  // PERALIHAN ke panel C (Simon 14 Okt: "gunakan ini sebagai transisi … swipe ke kiri untuk char dan panel uang saya, kemudian scale dan swipe ke
  // scene selanjutnya"): (1) garis memudar & orang + daftar "Uang saya" SWIPE KE KIRI keluar layar; (2) kartu Tagihan listrik & Beli rumah MEMBESAR
  // dan meluncur menjadi kepala panel kiri/kanan; kalender ikon ikut ke baris WAKTU. Semua inOut cubic.
  // Simon 14 Okt: "timingnya harus bersamaan, dan panel scene selanjutnya ikut di tagihan maupun beli rumah" → SATU gerakan t (60f): orang + daftar
  // swipe ke kiri BERSAMAAN kartu membesar & meluncur; panel C tumbuh DARI kartu itu (pelat di belakang kartu → panel penuh), ikut bergerak.
  const garisA = 1 - cin(f, T.susun - 25, 30);
  // kartu Tagihan berangkat 10f lebih dulu, Beli rumah 15f sesudahnya: jalur keduanya bersilangan (Tagihan ke kiri, Beli rumah naik) → tanpa jeda
  // kecil ini keduanya sempat bertumpuk di tengah jalan (simulasi: luas tumpang tindih 3.490 px² → 0)
  const sw = cin(f, T.susun - 20), t1 = cin(f, T.susun - 10), t2 = cin(f, T.susun + 15); // swipe keluar memimpin 10f supaya kartu Tagihan tidak menyusul daftar
  const c1x = lerp(cx, PL, t1), c1y = lerp(cy[0], kepalaY, t1), c2x = lerp(cx, PR, t2), c2y = lerp(cy[1], kepalaY, t2);
  const cs1 = lerp(1, 1.2, t1), cs2 = lerp(1, 1.2, t2);
  // kalender "20": jalurnya pasti bersilangan dengan kartu Beli rumah yang naik → MENGECIL-HILANG di tempat bersama garis penghubung, lalu muncul
  // lagi di baris WAKTU panel kiri sesudah kartu kepala mendarat (bersama kalender 2027–2030)
  const kalTx = PL, kalTy = y1 - 16, kalTs = KAL_S, kal1Pergi = 1 - cin(f, T.susun - 25, 30);
  const kalRx = lerp(kx, PR + 2 * KAL_JARAK, t2), kalRy = lerp(cy[1], y1 - 16, t2), kalRs = lerp(MB.ks, KAL_S, t2);
  // ── baris UANG ──
  const g = laju(f, T.gerak[0], T.gerak[1]); // kemajuan candle 5 tahun (kiri: garis datar digambar bersamaan)
  const rel = nilaiLilin(INV, g);
  const a2 = cin(f, T.baris2 + 10);
  const masuk = R(f, T.masuk[0], T.masuk[1], 0, 1, io);
  const wadahP = popIn(f, T.wadah);
  const kolom = cin(f, T.susun + 60);
  // KELUAR (Simon 14 Okt: "transisi dari scene 2 ke scene 3 jangan gunakan masking, gabungkan 3 panel di scene 2 menjadi 1 panel di scene 3"):
  // isi panel memudar (30f) sementara panel kiri · kolom ikon · panel kanan bergeser & mengecil ke SATU kotak = kartu daftar "Uang saya" Scene 03
  // (posisi & ukuran sama persis, S03_DAFTAR_AWAL) — 60f inOut cubic, mulai 20f sebelum batas. Pita warna & rona panel memudar saat menyatu.
  const M0 = RS03_MASUK.mulai, mg = R(f, M0, M0 + durMasker, 0, 1, io), isiK = 1 - R(f, M0, M0 + 30, 0, 1, io);
  const kolH = Math.max(0, h - KEPALA - 30);
  const sumber = [
    { x: PL, y: PUSAT_Y, w: PW, h, r: 32, warna: KIRI, tab: 1 },
    { x: 960, y: top + KEPALA + 10 + kolH / 2, w: 66, h: kolH, r: 33, warna: B.night, tab: 0 },
    { x: PR, y: PUSAT_Y, w: PW, h, r: 32, warna: KANAN, tab: 1 },
  ];
  return (
    <>
    {/* tiga panel → satu kartu daftar (menggantikan panel asli selama penyatuan) — DI BELAKANG isi panel yang sedang memudar */}
    {mg > 0.0001 ? sumber.map((p, k) => {
      const D = keLokal(S03_DAFTAR_AWAL, SKALA.S02, SKALA.S03);
      const x = lerp(p.x, D.x, mg), y = lerp(p.y, D.y, mg), w = lerp(p.w, D.w, mg), hh = lerp(p.h, D.h, mg), r = lerp(p.r, 30, mg);
      return (
        <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: w, height: hh, transform: geser(x - w / 2, y - hh / 2), borderRadius: r, overflow: 'hidden',
          background: k === 1 ? `linear-gradient(165deg, ${rgba(B.white, lerp(0.85, 0.98, mg))}, ${rgba(B.white, lerp(0.85, 0.9, mg))})` : `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`,
          boxShadow: k === 1 ? `0 16px 36px -20px ${rgba(B.night, 0.35 * (1 - mg))}` : bayanganKaca(mg < 0.5 ? p.warna : B.blue, k === 0 ? 0.8 + 0.2 * (1 - mg) : 1 - mg) }}>
          {p.tab ? <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(p.warna, 0.16 * (1 - mg))} 0%, ${rgba(p.warna, 0.04 * (1 - mg))} 70%)` }} /> : null}
          {p.tab ? <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: p.warna, opacity: Math.max(0, 1 - 1.6 * mg) }} /> : null}
        </div>);
    }) : null}
    <AbsoluteFill style={masukS2 < 0.9999 ? { opacity: Math.max(0.0001, masukS2), transformOrigin: '960px 540px', transform: `scale(${lerp(0.7, 1, masukS2)})` } : undefined}>
     <div style={{ position: 'absolute', inset: 0, opacity: isiK < 1 ? Math.max(0.0001, isiK) : undefined }}>
      {/* ═════════ C–D: dua panel perbandingan (ref-22) ═════════ */}
      {t1 > 0.001 ? (
        <>
          {/* panel menempel kartu kepalanya: tepi atas panel = tepi atas kartu − bantalan (20 → 50), lebar & tinggi tumbuh ke ukuran panel */}
          {[{ x: c1x, y: c1y, w: KIRI, t: t1, cs: cs1 }, { x: c2x, y: c2y, w: KANAN, t: t2, cs: cs2 }].map((c) => {
            const pTop = c.y - (c.cs * MB.ch) / 2 - lerp(20, 50, c.t), pH = lerp(MB.ch + 40, h, c.t), pW = lerp(MB.cw + 40, PW, c.t);
            return <Kaca key={c.w} x={c.x} y={pTop + pH / 2} w={pW} h={pH} p={1} alfa={mg > 0.0001 ? 0 : Math.min(0.9999, c.t * 2.5)} warna={c.w} tab="atas" rona={1} />;
          })}
          {/* kolom ikon tengah (ref-22): satu ikon per baris */}
          {kolom > 0.001 && mg <= 0.0001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 66, height: Math.max(0, h - KEPALA - 30), transform: geser(960 - 33, top + KEPALA + 10), borderRadius: 33,
              background: rgba(B.white, 0.85), boxShadow: `0 16px 36px -20px ${rgba(B.night, 0.35)}`, opacity: Math.min(0.9999, kolom) }} />) : null}
          <Bulat x={960} y={y1} d={52} warna={B.turq} ikon="kalender" p={popIn(f, T.susun + 70)} />
          <Bulat x={960} y={y2} d={52} warna={B.turq} ikon="dompet" p={popIn(f, T.baris2 + 10)} />
          {/* garis pemisah kepala | baris 1 | baris 2 */}
          {[0, 1].map((k) => n > k + 0.3 ? [PL, PR].map((P) => (
            <div key={`${k}${P}`} style={{ position: 'absolute', left: 0, top: 0, width: PW - 80, height: 2, transform: geser(P - PW / 2 + 40, top + KEPALA + k * BARIS),
              background: rgba(B.night, 0.08), opacity: Math.min(0.9999, (n - k - 0.3) * 2) }} />)) : null)}

          {/* baris WAKTU — kiri: satu halaman bulan depan · kanan: lima kalender tahun (2027 … 2031) */}
          <Teks x={PL} y={y1 + 72} teks="1 bulan lagi" alfa={cin(f, T.susun + 80)} size={30} />
          {[2027, 2028, 2029, 2030].map((th, k) => (
            <Kalender key={th} x={PR + (k - 2) * KAL_JARAK} y={y1 - 16} s={KAL_S} p={popIn(f, T.kalLain[k]) * (1 + denyut(f, T.denyutWaktu + k * 6, 0.05))} warna={KANAN}
              halaman={[{ atas: 'Okt', angka: String(th) }]} i={0} />))}
          <Teks x={PR} y={y1 + 72} teks="5 tahun lagi" alfa={cin(f, T.kalLain[3] + 10)} size={30} />

          {/* baris UANG — kiri: nominal tetap + garis datar · kanan: nominal berjalan + candle IHSG 5 tahun; D: uang masuk wadahnya (label di bawah wadah) */}
          {a2 > 0.001 ? (
            <>
              {[PL, PR].map((P, k) => (
                <React.Fragment key={P}>
                  <Foto k={k ? 'tumbuh' : 'tabungan'} x={P + KOL} y={y2 - 14} w={k ? 132 : 150} p={wadahP} />
                  {/* Simon 14 Okt "uang dengan ilustrasi tumpang tindih": uang mengecil & hilang DULU (masuk), wadah baru pop dari titik itu sesudah uang habis */}
                  <Uang x={P + KOL} y={y2 - 14} w={170 * lerp(1, 0.25, masuk)} alfa={a2 * R(masuk, 0.5, 1, 1, 0)} />
                  <Teks x={P + KOL} y={y2 + 72} teks={k ? 'Investasi' : 'Tabungan'} alfa={cin(f, T.wadah + 20)} size={30} />
                  <div style={{ position: 'absolute', left: 0, top: 0, width: GR.w, height: GR.h, transform: geser(P + KAN, y2 - 18), opacity: Math.min(0.9999, a2) }}>
                    {k ? <GrafikLilin d={INV} w={GR.w} h={GR.h} g={g} dom={DOM_INV} grid={false} />
                      : <GrafikGaris v={[1, 1]} w={GR.w} h={GR.h} g={g} dom={DOM_INV} warna={KIRI} grid={false} />}
                  </div>
                </React.Fragment>))}
              <PilNominal x={PL + KAN} y={y2 - 56} teks={rpPenuh(NILAI_T)} arah={0} p={popIn(f, T.baris2 + 20)} size={30} jangkar="kiri" />
              <PilNominal x={PR + KAN} y={y2 - 56} teks={rpPenuh(Math.round((NILAI_R * rel) / 10_000) * 10_000)} arah={(rel - 1) * 8}
                p={popIn(f, T.baris2 + 20)} size={30} jangkar="kiri" lebarMin={250} />
            </>) : null}
        </>) : null}

      {/* ═════════ A–B: pembuka "kotak masuk" — orang · daftar uang · jalur ke kebutuhan ═════════ */}
      {/* garis penghubung (di belakang kartu) — memudar di awal peralihan */}
      {garisA > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, garisA) }}>
          <Rute x0={r0x} y0={r0y} x1={cx - MB.cw / 2 + 6} y1={cy[0]} g={R(f, T.rute1[0], T.rute1[1], 0, 1, io)} warna={KIRI} />
          <Rute x0={r1x} y0={r1y} x1={cx - MB.cw / 2 + 6} y1={cy[1]} g={R(f, T.rute2[0], T.rute2[1], 0, 1, io)} warna={KANAN} />
          <Rute x0={cx + MB.cw / 2 - 6} y0={cy[0]} x1={kx - 50} y1={cy[0]} g={R(f, T.panah1[0], T.panah1[1], 0, 1, io)} warna={KIRI} tebal={4} />
          <Rute x0={cx + MB.cw / 2 - 6} y0={cy[1]} x1={kx - 50} y1={cy[1]} g={R(f, T.panah2[0], T.panah2[1], 0, 1, io)} warna={KANAN} tebal={4} />
        </div>) : null}
      {/* orang + daftar "Uang saya" — swipe ke kiri keluar layar */}
      {sw < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, transform: geser(-1400 * sw, 0) }}>
          {/* orang dimasking lingkaran oranye, kepala menyembul (pola V02 Scene 1), dicerminkan menoleh ke kanan */}
          <KarakterLingkar pose={MURID_BIRU} x={MB.px + ox} y={MB.py + oy} D={MB.D} s={masukS2 > 0.0001 ? 0.99996 : 0} warna={B.orange} cermin />
          <DaftarUang x={lx} y={ly} w={MB.lw} h={lh} p={popIn(f, T.daftar)} judul="Uang saya" ikon="dompet" baris={MB.rb} lebarTag={166} rows={[
            { judul: 'Tagihan listrik', ket: rpPenuh(NILAI_T), tag: 'bulan depan', warna: KIRI, p: cin(f, T.baris[0], 40), slot: 0, sorot: cin(f, T.sorot[0], 30), tagP: cin(f, T.tagBaris[0], 30) },
            { judul: 'Tabungan rumah', ket: rpPenuh(NILAI_R), tag: '5 tahun lagi', warna: KANAN, p: cin(f, T.baris[1], 40), slot: 1, sorot: cin(f, T.sorot[1], 30), tagP: cin(f, T.tagBaris[1], 30) },
          ]} />
        </div>) : null}
      {/* kartu tujuan → MEMBESAR & meluncur menjadi kepala panel C (kiri: tagihan · kanan: rumah) */}
      <KartuRute x={c1x} y={c1y} w={MB.cw} h={MB.ch} p={popIn(f, T.kartu1) * cs1} warna={KIRI} judul="Tagihan listrik" ket="Bayar 20 Nov 2026" foto="meteranPln" centang={popIn(f, T.centang1)} />
      <KartuRute x={c2x} y={c2y} w={MB.cw} h={MB.ch} p={popIn(f, T.kartu2) * cs2} warna={KANAN} judul="Beli rumah" ket="DP Okt 2031" foto="rumah" centang={popIn(f, T.centang2)} />
      {/* kalender: ikon tujuan (A–B) → baris WAKTU panel C */}
      {kal1Pergi > 0.001 ? <Kalender x={kx} y={cy[0]} s={MB.ks} p={popIn(f, T.kal1) * kal1Pergi} warna={KIRI} halaman={HAL_TAGIHAN} i={0} lingkar={R(f, T.lingkar1[0], T.lingkar1[1], 0, 1, io)} /> : null}
      <Kalender x={kalTx} y={kalTy} s={kalTs} p={popIn(f, T.susun + 60)} warna={KIRI} halaman={HAL_TAGIHAN} i={0} lingkar={1} />
      <Kalender x={kalRx} y={kalRy} s={kalRs} p={popIn(f, T.kal2)} warna={KANAN} halaman={HAL_RUMAH} i={5 * R(f, T.tahun[0], T.tahun[1], 0, 1)} />

      <Judul f={f} kata={['Waktu', 'berbeda', '·', 'Tujuan', 'berbeda']} at={T.judul1} keluar={T.judulKeluar} />
      <Judul f={f} kata={['Penempatan', 'juga', 'berbeda']} sorotIdx={0} at={T.judul2} sorotAt={T.sorot2} keluar={M0 + 15} />
     </div>
    </AbsoluteFill>
    </>);
};
