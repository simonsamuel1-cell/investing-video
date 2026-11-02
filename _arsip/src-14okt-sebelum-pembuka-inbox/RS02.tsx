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
import { Kaca, geser, MaskerKeluar, durMasker } from '../parts/kaca';
import { Foto, Kalender, POSE, Sosok, Tagihan, TepiSubtitle, Uang } from '../parts/nyata';
import { GrafikGaris, GrafikLilin, laju, nilaiLilin, relatif, rentang } from '../parts/lilin';
import { S02_INVESTASI } from '../data/pasar';

/**
 * REVISI SCENE 02 (14 Okt, evaluasi 5 pertanyaan — `04_Asset/Evaluasi-5-Pertanyaan-S02-S15.md`).
 * Pesan: uang bulan depan ≠ uang lima tahun lagi → pisahkan. Tata letak PANEL PERBANDINGAN + kolom ikon tengah (ref-22).
 *   A  "uang yang akan dipakai bulan depan"    murid mengulurkan uang ke TAGIHAN LISTRIK (ikon meteran) · kalender 20 Nov 2026
 *   B  "uang yang baru akan dipakai lima tahun lagi"  orang yang sama ke tengah · RUMAH di kanan, kalender berganti 2026 → 2031
 *   C  "waktu penggunaannya berbeda, kemampuan … naik-turunnya investasi juga berbeda"
 *        tagihan & rumah jadi kepala dua panel; baris WAKTU = kalender nyata (1 halaman bulan depan vs 5 kalender tahun 2027–2031);
 *        baris UANG = uang tagihan diam Rp450.000 · uang rumah naik-turun berjalan (tumpukan membesar/mengecil)
 *   D  "pisahkan dulu uangnya berdasarkan kebutuhan"  uang masuk wadahnya di baris yang sama: Tabungan (kiri) · Investasi (kanan)
 * Panel tumbuh per baris dan tetap berpusat (geser bertahap), tanpa slot kosong.
 */

const [karena, bulan, depan, tentu, nggak, seharusnya, sama, dengan, uang2, baru, lima, lagi, waktu, penggunaannya, berbeda1, kemampuan, naikTurun, juga, berbeda2,
  jadi, produk, pisahkan, uangnya, kebutuhan] = urut([
  'karena', 'bulan', 'depan', 'tentu', 'nggak', 'seharusnya', 'sama', 'dengan', 'uang', 'baru', 'lima', 'lagi', 'waktu', 'penggunaannya', 'berbeda', 'kemampuan',
  'naik-turunnya', 'juga', 'berbeda', 'jadi', 'produk', 'pisahkan', 'uangnya', 'kebutuhan'], BATAS.s2);

const T = {
  orang: karena + 30, tagihan: bulan, kalT: depan + 10, pilT: tentu, denyutA: [nggak, seharusnya, seharusnya + 31, sama],
  geserB: dengan, pilR: uang2 + 10, rumah: baru, kalR: baru + 20, tahun: [lima - 10, lagi + 40], denyutB: lagi + 30,
  susun: waktu, judul1: waktu + 24, kalLain: [penggunaannya, penggunaannya + 15, penggunaannya + 30, penggunaannya + 45], denyutWaktu: berbeda1 + 20,
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
const AB = { tA: [680, 520], kolX: 686, tB: 412, rB: 768, oA: 1360, oB: 1306 };

const Teks: React.FC<{ x: number; y: number; teks: string; alfa: number; size?: number; warna?: string; jangkar?: 'kiri' | 'tengah' }> =
  ({ x, y, teks, alfa, size = 28, warna = B.night, jangkar = 'tengah' }) => alfa <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(${jangkar === 'tengah' ? '-50%' : '0'}, -50%)`, fontFamily: F, fontSize: size,
      fontWeight: 800, color: warna, whiteSpace: 'nowrap', opacity: Math.min(0.9999, alfa), lineHeight: 1 }}>{teks}</div>);

export const RS02: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS03_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s2 || f >= RS03_MASUK.mulai + durMasker) return null;
  // Simon 14 Okt: MASUK Scene 2 = zoom in (kecil → besar) + fade in, BERSAMAAN dengan swipe turun Scene 1 (jendela 60f yang sama, inOut cubic);
  // poros = pusat sosok (960, 560) — saat itu sosok sendirian di tengah
  const masukS2 = cin(f, S01_KELUAR);
  const b = cin(f, T.geserB); // A → B
  const s = cin(f, T.susun); // B → C (panel)
  // Simon 14 Okt: "tukarkan posisinya, orang ada disebelah kanan" + "tagihan dan rumah taruh atas bawah" → A: tagihan kiri · orang kanan;
  // B: tagihan (atas) & rumah (bawah) satu kolom di kiri · orang kanan. Sosok menoleh ke kiri = ke arah tagihan/rumah. Rombongan berpusat di 960.
  // jumlah baris panel (pecahan saat tumbuh) — panel tumbuh, pusat tetap
  const n = cin(f, T.susun + 20) + cin(f, T.baris2);
  const h = KEPALA + n * BARIS + 10, top = PUSAT_Y - h / 2;
  const kepalaY = top + 152;
  const y1 = top + KEPALA + 100, y2 = top + KEPALA + 300;

  // ── kepala: tagihan (A kanan → B kiri → C kepala panel kiri) · rumah (B kanan → C kepala panel kanan) ──
  const tx = s > 0 ? lerp(AB.kolX, PL, s) : lerp(AB.tA[0], AB.kolX, b), ty = s > 0 ? lerp(AB.tB, kepalaY, s) : lerp(AB.tA[1], AB.tB, b);
  const tSkala = lerp(lerp(1.45, 1.0, b), 1.0, s);
  const rx = lerp(AB.kolX, PR, s), ry = lerp(AB.rB, kepalaY, s), rw = lerp(380, 360, s);
  // ── kalender: A/B menempel kartu → C baris WAKTU ──
  const kalTx = s > 0 ? lerp(AB.kolX + 165, PL, s) : lerp(AB.tA[0] + 270, AB.kolX + 165, b), kalTy = s > 0 ? lerp(AB.tB - 130, y1 - 16, s) : lerp(AB.tA[1] - 242, AB.tB - 130, b);
  const kalTs = s > 0 ? lerp(0.62, KAL_S, s) : lerp(0.8, 0.62, b);
  const kalRx = lerp(AB.kolX + 180, PR + 2 * KAL_JARAK, s), kalRy = lerp(AB.rB - 125, y1 - 16, s), kalRs = lerp(0.62, KAL_S, s);
  // ── baris UANG ──
  const g = laju(f, T.gerak[0], T.gerak[1]); // kemajuan candle 5 tahun (kiri: garis datar digambar bersamaan)
  const rel = nilaiLilin(INV, g);
  const a2 = cin(f, T.baris2 + 10);
  const masuk = R(f, T.masuk[0], T.masuk[1], 0, 1, io);
  const wadahP = popIn(f, T.wadah);
  const kolom = cin(f, T.susun + 30);
  return (
    <MaskerKeluar f={f} mulai={RS03_MASUK.mulai} ke={RS03_MASUK} warna={RS03_MASUK.warna}>
    <AbsoluteFill style={masukS2 < 0.9999 ? { opacity: Math.max(0.0001, masukS2), transformOrigin: '960px 560px', transform: `scale(${lerp(0.7, 1, masukS2)})` } : undefined}>
      {/* ═════════ C–D: dua panel perbandingan (ref-22) ═════════ */}
      {s > 0.001 ? (
        <>
          <Kaca x={PL} y={PUSAT_Y} w={PW} h={h} p={1} alfa={Math.min(0.9999, s)} warna={KIRI} tab="atas" rona={1} />
          <Kaca x={PR} y={PUSAT_Y} w={PW} h={h} p={1} alfa={Math.min(0.9999, s)} warna={KANAN} tab="atas" rona={1} />
          {/* kolom ikon tengah (ref-22): satu ikon per baris */}
          {kolom > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 66, height: Math.max(0, h - KEPALA - 30), transform: geser(960 - 33, top + KEPALA + 10), borderRadius: 33,
              background: rgba(B.white, 0.85), boxShadow: `0 16px 36px -20px ${rgba(B.night, 0.35)}`, opacity: Math.min(0.9999, kolom) }} />) : null}
          <Bulat x={960} y={y1} d={52} warna={B.turq} ikon="kalender" p={popIn(f, T.susun + 40)} />
          <Bulat x={960} y={y2} d={52} warna={B.turq} ikon="dompet" p={popIn(f, T.baris2 + 10)} />
          {/* garis pemisah kepala | baris 1 | baris 2 */}
          {[0, 1].map((k) => n > k + 0.3 ? [PL, PR].map((P) => (
            <div key={`${k}${P}`} style={{ position: 'absolute', left: 0, top: 0, width: PW - 80, height: 2, transform: geser(P - PW / 2 + 40, top + KEPALA + k * BARIS),
              background: rgba(B.night, 0.08), opacity: Math.min(0.9999, (n - k - 0.3) * 2) }} />)) : null)}

          {/* baris WAKTU — kiri: satu halaman bulan depan · kanan: lima kalender tahun (2027 … 2031) */}
          <Teks x={PL} y={y1 + 72} teks="1 bulan lagi" alfa={cin(f, T.susun + 50)} size={30} />
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

      {/* ═════════ A–B: orang · tagihan listrik · rumah ═════════ */}
      {s < 0.999 ? (
        <TepiSubtitle>
          <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - s), transform: geser(0, 40 * s) }}>
            <Sosok pose={POSE.muridPikirBiru} x={lerp(lerp(960, AB.oA, cin(f, T.tagihan)), AB.oB, b)} kaki={880} h={640} p={masukS2 > 0.0001 ? 1 : 0} />
          </div>
        </TepiSubtitle>) : null}
      <Tagihan x={tx} y={ty} judul="Tagihan listrik" ikon="meteranListrik" warna={KIRI} tempo="20 Nov 2026" total={rpPenuh(NILAI_T)} w={320}
        p={popIn(f, T.tagihan) * tSkala * (1 + T.denyutA.reduce((a, t) => a + denyut(f, t, 0.03), 0))} />
      {/* meteran listrik PLN (foto realistis Simon) menumpang di sudut kanan-bawah tagihan — ikut posisi & skala tagihan */}
      <Foto k="meteranPln" x={tx + 200 * tSkala} y={ty + 42 * tSkala} w={96 * tSkala} p={popIn(f, T.tagihan + 12)} />
      <Kalender x={kalTx} y={kalTy} s={kalTs} p={popIn(f, T.kalT)} warna={KIRI} halaman={HAL_TAGIHAN} i={0} lingkar={R(f, T.kalT + 10, T.kalT + 50, 0, 1, io)} />
      {/* uang di tangan: A = uang tagihan Rp450.000 · B = tabungan rumah Rp6.500.000 (orang yang sama) */}
      {s < 0.999 ? <div style={{ position: 'absolute', inset: 0, opacity: 1 - s }}>
        <PilNominal x={AB.oA - 190} y={332} teks={rpPenuh(NILAI_T)} arah={0} p={popIn(f, T.pilT) * (1 - cin(f, T.geserB - 10, 30))} size={30} />
        <PilNominal x={AB.oB - 190} y={332} teks={rpPenuh(NILAI_R)} arah={0} p={popIn(f, T.pilR)} size={30} />
      </div> : null}
      <Foto k="rumah" x={rx} y={ry} w={rw} p={popIn(f, T.rumah) * (1 + denyut(f, T.denyutB, 0.04))} />
      <Kalender x={kalRx} y={kalRy} s={kalRs} p={popIn(f, T.kalR)} warna={KANAN} halaman={HAL_RUMAH} i={5 * R(f, T.tahun[0], T.tahun[1], 0, 1)} />

      <Judul f={f} kata={['Waktu', 'berbeda', '·', 'Tujuan', 'berbeda']} at={T.judul1} keluar={T.judulKeluar} />
      <Judul f={f} kata={['Penempatan', 'juga', 'berbeda']} sorotIdx={0} at={T.judul2} sorotAt={T.sorot2} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
