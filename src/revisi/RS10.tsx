import React from 'react';
import { RS11_MASUK, S11_TAGIHAN_AWAL } from './RS11';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, io, lerp, mixHex, rgba } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import { Lencana, denyut } from '../parts/umum';
import { Kaca, bayanganKaca, geser, durMasker, type Masuk, daratDari, CakramDarat } from '../parts/kaca';
import { Foto, Kalender, Uang } from '../parts/nyata';
import { KartuLilin, laju, relatif } from '../parts/lilin';
import { S10_DATAR, S10_NAIK, S10_TURUN } from '../data/pasar';

/**
 * REVISI SCENE 10 v3 (Simon 14 Okt: "adegan ini hapus orangnya dan juga ganti visualnya yang lebih menggambarkan script").
 * Evaluasi: pesan = uang untuk DP 3 tahun lagi jangan semua di saham — bukan karena produknya jelek, tapi pasar 3 tahun lagi tak bisa ditebak.
 * Cara paling sederhana tanpa sosok: GARIS WAKTU "Sekarang → Okt 2029" — kiri = uang sekarang masuk saham/RD saham, kanan = DP rumah yang harus dibayar;
 * jarak keduanya = 3 tahun. Tanpa VO pun terbaca: uang Rp100 jt sekarang → dipakai Okt 2029.
 *   A  "kita sudah tahu tiga tahun lagi harus membayar DP rumah"  kartu DP rumah (foto rumah) muncul di tengah → bergeser ke ujung kanan garis waktu
 *      yang tergambar ("tiga tahun lagi": simpul 2027 · 2028 · Okt 2029 menyala satu per satu, chip "3 tahun lagi" di garis) → Rp100.000.000 di kartu
 *   B  "kalau sekarang seluruh uang itu dimasukkan ke saham atau reksa dana saham"  simpul Sekarang menyala · tumpukan uang Rp100 jt di atasnya →
 *      kartu produk tumbuh di sekelilingnya, uang masuk; gambar Saham lalu Reksa dana saham (berkas realistis Simon) muncul di katanya
 *   B2 "masalahnya bukan karena produknya jelek"  lencana ✓ hijau di kartu produk
 *   C  "kita nggak tahu kondisi pasar tiga tahun lagi akan seperti apa"  TIGA KEMUNGKINAN Okt 2029 (IHSG 3 tahun asli): ▲ · datar · ▼
 */

const [kita, , tiga, tahun, lagi, membayar, dp, , sekarang, seluruh, , dimasukkan, saham, reksa, masalahnya, bukan, produknya, jelek, masalahnya2, nggak,
  kondisi, pasar, tiga2, apa] = urut([
  'kita', 'tahu', 'tiga', 'tahun', 'lagi', 'membayar', 'dp', 'kalau', 'sekarang', 'seluruh', 'uang', 'dimasukkan', 'saham', 'reksa', 'masalahnya', 'bukan', 'produknya',
  'jelek', 'masalahnya', 'nggak', 'kondisi', 'pasar', 'tiga', 'apa'], BATAS.s10);

/** MASUK (revisi 14 Okt v3): masker Scene 09 mendarat di kartu DP rumah (elemen pertama, tengah frame) */
export const RS10_MASUK: Masuk = { x: 960, y: 540, r: 130, warna: B.white, mulai: BATAS.s10 - 20 };
const DARAT = daratDari(RS10_MASUK);

const T = {
  tujuan: Math.max(kita - 10, DARAT + 20), garis: tiga, simpul: [tiga - 10, tahun, lagi, lagi + 16], chip: tahun + 10, dp, tiang2: membayar,
  sekarang, uang: seluruh, kartu: dimasukkan - 10, masuk: [dimasukkan, saham + 10], gbSaham: saham, gbRd: reksa, judulProduk: saham + 10, tiang1: dimasukkan + 20,
  centang: produknya, denyutCentang: [bukan, jelek], judul: masalahnya + 10,
  geserC: masalahnya2 - 10, mungkin: [masalahnya2 + 30, pasar, tiga2 + 10], denyutApa: apa, denyutKondisi: kondisi, denyutNggak: nggak, sub: masalahnya2 + 20, subSorot: tiga2,
};

/** tata letak A–B: dua kartu sama besar di atas garis waktu, tiap kartu = tumpukan foto · judul · nominal yang berpusat di kartu */
const GY = 800;
const SIMPUL = [520, 813, 1107, 1400];
const LABEL_SIMPUL = ['Sekarang', '2027', '2028', 'Okt 2029'];
const K = { y: 460, w: 480, h: 480, foto: -82, judul: 86, pil: 166 };
/** Simon 14 Okt — tiga kemungkinan = candlestick realistis: tiga periode 3 tahun IHSG yang benar-benar terjadi (bulanan) —
 *  Apr 2020–Mar 2023 +50 % · Mei 2018–Apr 2021 ±0 % · Apr 2017–Mar 2020 −19 %. Modal sama Rp100 jt, hasil tiga tahun kemudian berbeda jauh. */
const MUNGKIN = [{ d: relatif(S10_NAIK), warna: ARAH.naik }, { d: relatif(S10_DATAR), warna: B.blue }, { d: relatif(S10_TURUN), warna: ARAH.turun }];
// y 585: kalender Okt 2029 di atas kartu dulu hanya 10 px di bawah sub-judul (ukur 14 Okt) → seluruh susunan C turun 35 px
const KM = { w: 380, h: 420, jarak: 400, pusat: 960, y: 621 }; // pindai pusat 14 Okt: kalender + kartu dulu −36 px

const Teks: React.FC<{ x: number; y: number; teks: string; size: number; alfa: number; warna?: string; tebal?: number }> = ({ x, y, teks, size, alfa, warna = B.night, tebal = 800 }) =>
  alfa <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%)`, fontFamily: F, fontSize: size, fontWeight: tebal, color: warna,
      whiteSpace: 'nowrap', lineHeight: 1, opacity: Math.min(0.9999, alfa) }}>{teks}</div>);

export const RS10: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS11_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s10 || f >= RS11_MASUK.mulai + durMasker) return null;
  const c = cin(f, T.geserC);
  const mv = cin(f, T.garis - 24); // memimpin pop simpul "Sekarang" (verifikasi 14 Okt: simpul muncul sebelum kartu bergeser, −106 px)
  // geser bertahap: A2 (garis + kartu DP saja) susunan selebar 450…1620 → digeser −75 agar berpusat; begitu uang muncul di kiri (B) kembali 0
  const gx = -75 * mv * (1 - cin(f, T.uang));
  // kartu DP sendirian di TENGAH frame (y 540), naik ke 460 bersamaan garis waktu muncul di bawahnya (pindai pusat 14 Okt: dulu −80 px)
  const xDp = lerp(960, SIMPUL[3], mv), yDp = lerp(540, K.y, mv);
  const sapu = R(f, T.garis - 30, T.garis + 50, 0, 1, io);
  const masuk = R(f, T.masuk[0], T.masuk[1], 0, 1, io);
  const kartuP = popIn(f, T.kartu);
  const xK = SIMPUL[0];
  // KELUAR (Simon 14 Okt: 3 panel → 1 panel = transisi seperti Scene 02 → 03, tanpa masker): isi memudar 30f sementara tiga kartu kemungkinan
  // bergeser, menyusut & MENYATU (60f inOut cubic) menjadi badan tagihan DP rumah Scene 11 (pita oren muncul)
  const M0 = RS11_MASUK.mulai, mg = R(f, M0, M0 + durMasker, 0, 1, io), isiK = 1 - R(f, M0, M0 + 30, 0, 1, io);
  const TG = S11_TAGIHAN_AWAL;
  return (
    <>
    {mg > 0.0001 ? MUNGKIN.map((m, k) => {
      const x = lerp(KM.pusat + (k - 1) * KM.jarak, TG.x, mg), y = lerp(KM.y, TG.y, mg), w = lerp(KM.w, TG.w, mg), hh = lerp(KM.h, TG.h, mg);
      return (
        <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: w, height: hh, transform: `translate3d(${x - w / 2}px, ${y - hh / 2}px, 0) rotate(0.001deg)`,
          borderRadius: lerp(32, TG.radius, mg), overflow: 'hidden', background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`,
          // bayangan kotak tumbuh bersama mg (bayangan kartu ikut pudar bersama isi) → tidak menumpuk di awal (pindai 14 Okt: lonjakan f12785)
          boxShadow: bayanganKaca(mixHex(m.warna, B.orange, mg), k === 1 ? mg : 0) }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: TG.kepala, background: B.orange, opacity: mg }} />
        </div>);
    }) : null}
    <AbsoluteFill style={isiK < 1 ? { opacity: Math.max(0.0001, isiK) } : undefined}>
      <CakramDarat f={f} ke={RS10_MASUK} />
      {/* ═════════ A–B: garis waktu Sekarang → Okt 2029 · kartu produk (kiri) · kartu DP rumah (kanan) ═════════ */}
      {c < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - c), transform: geser(gx, 0) }}>
          {/* garis + tiang penghubung kartu → simpul */}
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {/* garis tergambar dari TENGAH ke kedua ujung (verifikasi pusat 14 Okt: sapuan kiri→kanan −102 px sesaat) */}
            {sapu > 0.001 ? <line x1={lerp((SIMPUL[0] + SIMPUL[3]) / 2, SIMPUL[0], sapu)} y1={GY} x2={lerp((SIMPUL[0] + SIMPUL[3]) / 2, SIMPUL[3], sapu)} y2={GY} stroke={rgba(B.night, 0.18)} strokeWidth={6} strokeLinecap="round" /> : null}
            {sapu > 0.001 ? <line x1={lerp((SIMPUL[0] + SIMPUL[3]) / 2, SIMPUL[0], sapu)} y1={GY} x2={lerp((SIMPUL[0] + SIMPUL[3]) / 2, SIMPUL[3], sapu)} y2={GY} stroke={B.orange} strokeWidth={6} strokeLinecap="round"
              strokeDasharray="2 16" opacity={0.0001 + 0.9 * R(f, T.chip, T.chip + 30, 0, 1, io)} /> : null}
            {[{ x: xK, g: R(f, T.tiang1 - 20, T.tiang1 + 20, 0, 1, io), w: B.blue }, { x: SIMPUL[3], g: R(f, T.tiang2 - 20, T.tiang2 + 20, 0, 1, io), w: B.orange }].map((t, k) =>
              t.g > 0.001 ? <line key={k} x1={t.x} y1={K.y + K.h / 2 + 6} x2={t.x} y2={lerp(K.y + K.h / 2 + 6, GY - 22, t.g)} stroke={t.w} strokeWidth={4} strokeDasharray="1 11"
                strokeLinecap="round" /> : null)}
          </svg>
          {SIMPUL.map((x, k) => {
            const p = popIn(f, T.simpul[k]);
            if (p <= 0.001) return null;
            const ujung = k === 0 || k === 3;
            const warna = k === 0 ? B.blue : k === 3 ? B.orange : B.grayLite;
            const isi = k === 0 ? cin(f, T.sekarang, 30) : k === 3 ? cin(f, T.dp, 30) : 0;
            const d = ujung ? 34 : 20;
            return (
              <React.Fragment key={k}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', boxSizing: 'border-box', border: `${ujung ? 6 : 5}px solid ${warna}`,
                  background: mixHex(B.white, warna, isi), transformOrigin: 'center', transform: `${geser(x - d / 2, GY - d / 2)} scale(${p})`,
                  boxShadow: ujung ? `0 8px 18px -8px ${warna}` : undefined }} />
                <Teks x={x} y={GY + 48} teks={LABEL_SIMPUL[k]} size={ujung ? 30 : 26} alfa={cin(f, T.simpul[k] + 6, 30)} warna={ujung ? B.night : B.gray} tebal={ujung ? 800 : 700} />
              </React.Fragment>);
          })}
          {/* "3 tahun lagi" di tengah garis */}
          {popIn(f, T.chip) > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser((SIMPUL[0] + SIMPUL[3]) / 2, GY)} translate(-50%, -50%) scale(${popIn(f, T.chip)})`, display: 'flex',
              alignItems: 'center', gap: 10, background: B.white, border: `3px solid ${B.orange}`, borderRadius: 999, padding: '12px 24px', fontFamily: F, fontSize: 30, fontWeight: 800,
              color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 12px 24px -14px ${B.orange}` }}>
              <Icon name="kalender" size={32} color={B.orange} />3 tahun lagi
            </div>) : null}

          {/* kartu DP rumah (A): muncul di tengah → ujung kanan garis */}
          <Kaca x={xDp} y={yDp} w={K.w} h={K.h} p={popIn(f, T.tujuan)} warna={B.orange} tab="atas" rona={0.6} />
          <Foto k="rumahModern" x={xDp} y={yDp + K.foto} w={330} p={popIn(f, T.tujuan + 8)} />
          <Teks x={xDp} y={yDp + K.judul} teks="DP rumah" size={42} alfa={cin(f, T.tujuan + 14)} />
          <PilNominal x={xDp} y={yDp + K.pil} teks="Rp100.000.000" arah={0} p={popIn(f, T.dp)} size={34} lebarMin={280} />

          {/* kartu produk (B): uang Rp100 jt muncul di atas simpul Sekarang, kartu tumbuh di sekelilingnya, uang masuk → gambar Saham · RD saham */}
          <Kaca x={xK} y={K.y} w={K.w} h={K.h} p={kartuP} warna={B.blue} tab="atas" rona={0.6} />
          <Foto k="saham" x={xK - 108} y={K.y + K.foto} w={200} p={popIn(f, T.gbSaham)} />
          <Foto k="rdSaham" x={xK + 108} y={K.y + K.foto} w={200} p={popIn(f, T.gbRd)} />
          <Teks x={xK} y={K.y + K.judul} teks="Saham / RD saham" size={38} alfa={cin(f, T.judulProduk, 30)} />
          {masuk < 0.999 ? <Uang x={xK} y={lerp(K.y - 60, K.y + K.foto, masuk)} w={lerp(300, 110, masuk)} p={popIn(f, T.uang)} alfa={R(masuk, 0.7, 1, 1, 0)} /> : null}
          <PilNominal x={xK} y={K.y + K.pil} teks="Rp100.000.000" arah={0} p={popIn(f, T.uang + 10)} size={34} lebarMin={280} />
          {/* B2: produknya tidak jelek → ✓ hijau di sudut kartu produk */}
          <Lencana x={xK + K.w / 2 - 57.6} y={K.y - K.h / 2 + 57.6} d={160} p={popIn(f, T.centang) * (1 + T.denyutCentang.reduce((a, t) => a + denyut(f, t, 0.1), 0))} warna={ARAH.naik}
            ikon="tersedia" besar={76} />
        </div>) : null}

      {/* ═════════ C: tiga kemungkinan nilai Okt 2029 ═════════ */}
      {c > 0.001 ? (
        <>
          {MUNGKIN.map((m, k) => {
            const p = popIn(f, T.mungkin[k]);
            if (p <= 0.001) return null;
            // geser bertahap: kemungkinan yang sudah muncul selalu berpusat di frame
            // geser memimpin 18f dari pop (pop ease-out-back berwaktu linear sudah ±75 % besar di −15f; geser inOut baru ±6 %) — pindai pusat 14 Okt
            const geserK = (KM.jarak / 2) * ((1 - cin(f, T.mungkin[1] - 24)) + (1 - cin(f, T.mungkin[2] - 24)));
            return <KartuLilin key={k} x={KM.pusat + (k - 1) * KM.jarak + geserK} y={KM.y} w={KM.w} h={KM.h} p={p} d={m.d} g={laju(f, T.mungkin[k] - 10, T.mungkin[k] + 80)}
              modal={100_000_000} ikon="saham" nama="Saham / RD saham" warna={m.warna} label="Okt 2029" pilKanan besar={54} grafikAtas={222} />;
          })}
          {/* kepala bersama: kalender Okt 2029 di atas ketiga kemungkinan */}
          <Kalender x={KM.pusat} y={KM.y - KM.h / 2 - 90} s={0.62} p={popIn(f, T.mungkin[0])} warna={B.orange} halaman={[{ atas: 'Okt', angka: '2029' }]} i={0} />
        </>) : null}

      <Judul f={f} kata={['Bukan', 'produknya', 'yang', 'salah']} at={T.judul} />
      <Judul f={f} kata={['waktunya', 'bisa', 'tidak', 'cocok']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </>);
};
