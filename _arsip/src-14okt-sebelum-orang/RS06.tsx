import React from 'react';
import { RS07_MASUK } from './RS07';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, CORET, F, R, WARNA, io, lerp, mixHex, rgba } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Lencana, denyut } from '../parts/umum';
import { Chevron, Kaca, Nomor, geser, MaskerKeluar, durMasker, type Masuk, daratDari } from '../parts/kaca';
import { FOTO, Foto, KartuBaris, Uang } from '../parts/nyata';
import type { KunciIkon } from '../ikon';

/**
 * REVISI SCENE 06 (14 Okt, evaluasi 5 pertanyaan). Pesan: dana darurat (bagian uang aktif, ±1–3 bulan biaya hidup) disiapkan DULU, supaya
 * kejadian mendadak tidak memaksa menjual investasi. Tata letak = LANGKAH BERNOMOR 01 → 02 (ref-20/21), tanpa pelampung (metafora).
 *   A  "termasuk dalam uang aktif … sebelum investasi lainnya"  kartu 01 Dana darurat (foto kotak darurat, pita & chip Uang aktif) → chevron →
 *      kartu 02 Investasi lain (redup, tergembok)
 *   B  "1 sampai 3 bulan biaya hidup"  tiga kartu amplop Bulan 1/2/3 (Rp5 jt) masuk ke dana darurat: Rp5 → 10 → 15 jt
 *   C  "kehilangan pekerjaan, motor rusak, biaya medis"  tiga kartu kejadian berikon muncul di katanya; uang mengalir dari dana darurat ke tiap kejadian
 *   D  "nggak perlu buru-buru menjual investasi lain"  kartu 02 kembali, nilainya utuh, tombol JUAL tidak dipakai (dicoret)
 *   E  "siapkan dana darurat dulu, baru pikirkan investasi berikutnya"  centang di 01, gembok 02 terbuka, chevron menyala
 */

const [darurat, termasuk, uang, idealnya, sebelum, investasi, acuan, sekitar, satu, tiga, biaya, jadi, kehilangan, motor, muncul, medis, nggak, buru, menjual,
  lain, siapkan, dulu, baru, investasi3, berikutnya] = urut([
  'darurat', 'termasuk', 'uang', 'idealnya', 'sebelum', 'investasi', 'acuan', 'sekitar', '1', '3', 'biaya', 'jadi', 'kehilangan', 'motor', 'muncul', 'medis',
  'nggak', 'buru-buru', 'menjual', 'lain', 'siapkan', 'dulu', 'baru', 'investasi', 'berikutnya'], BATAS.s6);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS06_MASUK: Masuk = { x: 960, y: 480, r: 130, warna: B.white, mulai: BATAS.s6 - 20 };
const DARAT = daratDari(RS06_MASUK);

/** ukur 14 Okt (pusat tiap momen): kartu 01 bergeser BERSAMA pasangannya muncul — geserA = kartu 02, b = kartu Bulan 1, c = kejadian pertama
 *  (dulu 1,4–1,7 dtk lebih awal: kartu 01 sendirian di kiri / kanan) */
const T = {
  k1: Math.max(darurat - 10, DARAT + 30), foto1: Math.max(darurat - 4, DARAT + 36), chipAktif: uang, denyutTermasuk: termasuk, geserA: investasi - 10, chevron: sebelum, k2: investasi - 10,
  idealnya, sekitar, judul: acuan - 20,
  // b 30f lebih awal: kartu 01 sudah selesai bergeser sebelum kartu Bulan 1 muncul di tempatnya (survei 14 Okt: Bulan 1 sempat tertutup kartu 01)
  b: satu - 50, bulan: [satu, tiga - 16, tiga + 10], sorot: tiga, tuang: [biaya, jadi + 20],
  c: kehilangan - 20, kejadian: [kehilangan + 10, motor + 10, muncul + 10], alir: [kehilangan + 50, motor + 50, medis + 5],
  // kejadian keluar dulu (30f), baru kartu 02 kembali — tidak bertumpuk
  evKeluar: nggak - 4, d: nggak + 22, jual: buru, coret: menjual + 20, denyutInv: lain,
  e: siapkan - 20, sub: siapkan + 10, centang: dulu + 10, buka: baru, subSorot: baru, nyala: baru + 20, denyutAkhir: [investasi3, berikutnya + 20],
};

/** Simon 14 Okt (Scene 6, tata letak tetap): "bedakan warna icon, panel" · "perbaiki spacing visual" · "perbesar sekitar 20–30%" · "samakan ukuran
 *  masing-masing panelnya" → kartu 01 & 02 SAMA 600 × 640 (dulu 520 / 460 × 560), kartu baris bulan/kejadian ×1,22, isi kartu ikut membesar;
 *  jarak antarbenda 100–120 px, tiap tahap berpusat di 960; tiap kartu bulan & tiap kejadian berwarna sendiri (turunan brand, tak ada kembar). */
const Y = 555;
const K1 = { w: 600, h: 640 }, K2 = { w: 600, h: 640 };
const SB = 1.22; // skala kartu baris (bulan · kejadian)
// kartu 01 kini turkis → bulan tanpa turkis (Bulan 2 turkis dulu bersebelahan dengan kartu 01 sewarna); langit (turunan) diganti ungu muda
const WARNA_BULAN = [WARNA.biru, WARNA.oranye, WARNA.ungu];
const WARNA_KEJADIAN = [WARNA.oranye, WARNA.ungu, WARNA.oranyeMuda];
const XB = { a1: 600, a2: 1320, bulan: 610, b1: 1230, c1: 690, kej: 1310 };
/** kartu 01 di awal Scene 06 (layar) = tujuan penyatuan dua kartu Scene 05 (Simon 14 Okt: transisi seperti Scene 02 → 03, tanpa masker) */
export const S06_KARTU1_AWAL = { x: 960, y: Y, w: K1.w, h: K1.h };
const BARIS_Y = [Y - 200, Y, Y + 200];
/** Simon 14 Okt (kedua): "warna dan spacingnya masih belum diperbaiki" — pita, nomor, chip, chevron dulu SEWARNA kartunya (chip "Uang aktif" ungu
 *  menempel di pita ungu). Kini tiap benda berwarna sendiri: kartu 01 TURKIS · chip "Uang aktif" UNGU (warna Uang Aktif di seluruh video) · nomor
 *  putih bercincin · kartu 02 OREN · chevron UNGU (→ hijau di akhir). Susunan isi kartu = tumpukan berjarak tetap (foto 290 · 36 · judul · 28 ·
 *  nominal) yang berpusat di kartu; tombol JUAL di SAMPING nominal (dulu di bawahnya: berjarak 9 px dari pil & 18 px dari tepi bawah kartu). */
export const WARNA_K1 = B.turq;
const WARNA_K2 = B.orange, WARNA_CHEVRON = B.blue;
const ISI = { foto: -90, judul: 115, pil: 200, fotoH: 290, nomor: 52, nomorD: 70 };
const PIL_W = 300, JUAL = { w: 150, h: 64, jarak: 16 };
const BIAYA_HIDUP = 5_000_000, NILAI_INV = 20_000_000;
const KEJADIAN: { nama: string; ikon: KunciIkon; biaya: number; foto?: 'orangPhk' | 'motorRusak' | 'sakitRs' }[] = [
  { nama: 'Kehilangan pekerjaan', ikon: 'kehilanganKerja', biaya: 5_000_000, foto: 'orangPhk' },
  { nama: 'Motor rusak', ikon: 'perbaikanMotor', biaya: 2_000_000, foto: 'motorRusak' },
  { nama: 'Biaya medis', ikon: 'biayaMedis', biaya: 3_000_000, foto: 'sakitRs' },
];

const Teks: React.FC<{ x: number; y: number; teks: string; size: number; alfa?: number }> = ({ x, y, teks, size, alfa = 1 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%)`, fontFamily: F, fontSize: size, fontWeight: 800, color: B.night,
    whiteSpace: 'nowrap', lineHeight: 1, opacity: Math.min(0.9999, alfa) }}>{teks}</div>);

export const RS06: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS07_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s6 || f >= RS07_MASUK.mulai + durMasker) return null;
  const a2 = cin(f, T.geserA), b = cin(f, T.b), c = cin(f, T.c), d = cin(f, T.d);
  // posisi kartu 01 (geser bertahap, selalu berpusat): A1 960 · A2 680 · B 1230 · C 700 · D/E 680
  const x1 = lerp(lerp(lerp(lerp(960, XB.a1, a2), XB.b1, b), XB.c1, c), XB.a1, d);
  // kartu 02: A2 1290 (redup) · B–C keluar kanan · D/E kembali 1290
  const keluar2 = b * (1 - d);
  const x2 = XB.a2 + 360 * keluar2, alfa2 = (1 - keluar2) * lerp(0.6, 1, d);
  // saldo dana darurat: +5 jt per bulan (B), −biaya tiap kejadian (C)
  const tuang = [0, 1, 2].map((k) => R(f, T.tuang[0] + 18 * k, T.tuang[1] + 18 * k, 0, 1, io));
  const alir = T.alir.map((t) => R(f, t - 30, t + 30, 0, 1, io));
  const saldo = BIAYA_HIDUP * tuang.reduce((a, v) => a + v, 0) - KEJADIAN.reduce((a, k, i) => a + k.biaya * alir[i], 0);
  const buka = cin(f, T.buka, 30);
  return (
    <MaskerKeluar f={f} mulai={RS07_MASUK.mulai} ke={RS07_MASUK} warna={RS07_MASUK.warna}>
    <AbsoluteFill>
      {/* ═════════ B: tiga bulan biaya hidup (amplop) → dana darurat ═════════ */}
      {[0, 1, 2].map((k) => {
        const t = tuang[k];
        const p = popIn(f, T.bulan[k]);
        if (p <= 0.001 || t >= 0.999) return null;
        const x = lerp(XB.bulan, x1, t), y = lerp(BARIS_Y[k], Y + 40, t);
        return <KartuBaris key={k} x={x} y={y} p={p * SB * lerp(1, 0.4, t)} alfa={R(t, 0.7, 1, 1, 0)} ikon="amplopUang" warna={WARNA_BULAN[k]} judul={`Bulan ${k + 1}`}
          ket={rpPenuh(BIAYA_HIDUP)} />;
      })}

      {/* ═════════ C: kejadian mendadak — uang mengalir dari dana darurat ═════════ */}
      {KEJADIAN.map((kj, k) => {
        const p = popIn(f, T.kejadian[k]) * (1 - cin(f, T.evKeluar, 30));
        if (p <= 0.001) return null;
        const t = alir[k];
        return (
          <React.Fragment key={kj.nama}>
            <KartuBaris x={XB.kej} y={BARIS_Y[k]} p={p * SB} ikon={kj.ikon} foto={kj.foto} warna={WARNA_KEJADIAN[k]} judul={kj.nama} ket={`−${rpPenuh(kj.biaya)}`} ketAlfa={R(t, 0.45, 0.85, 0, 1, io)} ketWarna={WARNA_KEJADIAN[k]} />
            {t > 0.001 && t < 0.999 ? <Uang x={lerp(x1 + 170, XB.kej - 200, t)} y={lerp(Y + 130, BARIS_Y[k], t) - Math.sin(Math.PI * t) * 50} w={124} alfa={R(t, 0, 0.15, 0, 1) * R(t, 0.85, 1, 1, 0)} /> : null}
          </React.Fragment>);
      })}

      {/* ═════════ kartu 02: Investasi lain ═════════ */}
      {alfa2 > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, alfa2) }}>
          <Kaca x={x2} y={Y} w={K2.w} h={K2.h} p={popIn(f, T.k2) * (1 + denyut(f, T.denyutInv, 0.03) + denyut(f, T.k2 + 70, 0.03) + T.denyutAkhir.reduce((a, t) => a + denyut(f, t, 0.03), 0))} warna={WARNA_K2} tab="atas"
            rona={0.5} tepi={cin(f, T.nyala)} />
          <Nomor x={x2 - K2.w / 2 + ISI.nomor} y={Y - K2.h / 2 + ISI.nomor} n={2} warna={WARNA_K2} p={popIn(f, T.k2 + 10)} d={ISI.nomorD} cincin />
          <Foto k="tumbuh" x={x2} y={Y + ISI.foto} w={ISI.fotoH * FOTO.tumbuh.r} p={popIn(f, T.k2 + 6)} />
          {popIn(f, T.k2 + 12) > 0.001 ? <Teks x={x2} y={Y + ISI.judul} teks="Investasi lain" size={48} alfa={cin(f, T.k2 + 12)} /> : null}
          {/* D: nilai utuh + tombol JUAL (dicoret) di SAMPING nominal; saat JUAL pergi (E) nominal bergeser kembali ke tengah kartu */}
          {(() => {
            const pj = popIn(f, T.jual) * (1 - cin(f, T.e));
            const baris = 1 - cin(f, T.e); // 1 = pil + JUAL berdampingan (sejak pil muncul), 0 = pil sendiri di tengah
            const xPil = x2 - (JUAL.w + JUAL.jarak) / 2 * baris, xJual = x2 + (PIL_W + JUAL.jarak) / 2;
            const coret = R(f, T.coret - 20, T.coret + 20, 0, 1, io);
            return (
              <>
                <PilNominal x={xPil} y={Y + ISI.pil} teks={rpPenuh(NILAI_INV)} arah={0} p={popIn(f, T.d + 10)} size={36} lebarMin={PIL_W} />
                {pj > 0.001 ? (
                  <div style={{ position: 'absolute', left: 0, top: 0, width: JUAL.w, height: JUAL.h, transformOrigin: 'center', transform: `${geser(xJual - JUAL.w / 2, Y + ISI.pil - JUAL.h / 2)} scale(${pj})`,
                    borderRadius: 18, background: rgba(ARAH.turun, 0.14), display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: ARAH.turun, letterSpacing: '.08em' }}>
                    JUAL
                    <div style={{ position: 'absolute', left: 20, top: JUAL.h / 2 - 2.5, height: 5, borderRadius: 3, width: (JUAL.w - 40) * coret, background: CORET }} />
                  </div>) : null}
              </>);
          })()}
          {/* gembok (A) → terbuka (E) */}
          <Lencana x={x2 + 220} y={Y - 262} d={160} p={popIn(f, T.k2 + 20) * (1 - buka)} warna={B.night} ikon="kunci" besar={84} />
          <Lencana x={x2 + 220} y={Y - 262} d={160} p={popIn(f, T.buka + 10)} warna={ARAH.naik} ikon="tersedia" besar={84} />
        </div>) : null}
      <Chevron x={(x1 + K1.w / 2 + x2 - K2.w / 2) / 2} y={Y} warna={mixHex(WARNA_CHEVRON, ARAH.naik, cin(f, T.nyala))} p={popIn(f, T.chevron) * (1 - keluar2)} d={76} />

      {/* ═════════ kartu 01: Dana darurat (bagian uang aktif) ═════════ */}
      {/* badan kartu 01 sudah ada begitu penyatuan dua kartu Scene 05 selesai (RS06_MASUK.mulai + 60); isinya menyusul */}
      <Kaca x={x1} y={Y} w={K1.w} h={K1.h} p={(f >= RS06_MASUK.mulai + durMasker - 6 ? 0.99996 : 0) * (1 + denyut(f, T.denyutTermasuk, 0.03) + denyut(f, T.sorot, 0.03) + [T.chipAktif + 40, T.chipAktif + 80, T.k2 + 100, T.judul + 50, T.judul + 80, T.b + 40, T.b + 60].reduce((a, t) => a + denyut(f, t, 0.025), 0))} warna={WARNA_K1} tab="atas" rona={0.6}
        tepi={cin(f, T.centang)} />
      <Nomor x={x1 - K1.w / 2 + ISI.nomor} y={Y - K1.h / 2 + ISI.nomor} n={1} warna={WARNA_K1} p={popIn(f, T.k1 + 10)} d={ISI.nomorD} cincin />
      {/* chip "Uang aktif" menumpang di tepi atas kartu (ref-06): dana darurat TERMASUK uang aktif */}
      {(() => {
        const p = popIn(f, T.chipAktif);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x1, Y - K1.h / 2 + 2)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center',
            gap: 10, background: B.blue, color: B.white, borderRadius: 999, padding: '12px 26px', fontFamily: F, fontSize: 32, fontWeight: 800, whiteSpace: 'nowrap',
            boxShadow: `0 12px 24px -10px ${B.blue}` }}>
            <Icon name="dompet" size={34} color={B.white} />Uang aktif
          </div>);
      })()}
      <Foto k="darurat" x={x1} y={Y + ISI.foto} w={ISI.fotoH * FOTO.darurat.r} p={popIn(f, T.foto1)} />
      {f >= T.k1 ? <Teks x={x1} y={Y + ISI.judul} teks="Dana darurat" size={48} alfa={cin(f, T.foto1 + 10)} /> : null}
      <PilNominal x={x1} y={Y + ISI.pil} teks={rpPenuh(Math.max(0, Math.round(saldo / 100_000) * 100_000))} arah={0} p={popIn(f, T.tuang[0] + 20)} size={36} lebarMin={PIL_W} />
      <Lencana x={x1 + 220} y={Y - 262} d={160} p={popIn(f, T.centang)} warna={ARAH.naik} ikon="tersedia" besar={84} />

      <Judul f={f} kata={['Dana', 'darurat', '≈', '1–3 bulan', 'biaya', 'hidup']} sorotIdx={3} at={T.judul} sorotAt={T.sorot} />
      {/* top 146 (bukan 128): satu-satunya scene dengan kotak sorot di judul DAN sub-judul — di 128 kotak "sebelum" menempel kotak "1–3 bulan" (terukur 0 px) */}
      <Judul f={f} kata={['Siapkan', 'dana', 'darurat', 'sebelum', 'investasi', 'lain']} sorotIdx={3} at={T.sub} sorotAt={T.subSorot} top={146} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
