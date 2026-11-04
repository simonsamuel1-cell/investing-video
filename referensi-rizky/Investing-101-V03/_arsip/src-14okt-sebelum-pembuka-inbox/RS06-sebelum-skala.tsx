import React from 'react';
import { RS07_MASUK } from './RS07';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, CORET, F, R, io, lerp, mixHex, rgba } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Lencana, denyut } from '../parts/umum';
import { Chevron, Kaca, Nomor, geser, MaskerKeluar, durMasker, type Masuk, daratDari } from '../parts/kaca';
import { Foto, KartuBaris, Uang } from '../parts/nyata';
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
  idealnya, sekitar, judul: acuan - 20, b: satu - 20, bulan: [satu, tiga - 16, tiga + 10], sorot: tiga, tuang: [biaya, jadi + 20],
  c: kehilangan - 20, kejadian: [kehilangan + 10, motor + 10, muncul + 10], alir: [kehilangan + 50, motor + 50, medis + 5],
  // kejadian keluar dulu (30f), baru kartu 02 kembali — tidak bertumpuk
  evKeluar: nggak - 4, d: nggak + 22, jual: buru, coret: menjual + 20, denyutInv: lain,
  e: siapkan - 20, sub: siapkan + 10, centang: dulu + 10, buka: baru, subSorot: baru, nyala: baru + 20, denyutAkhir: [investasi3, berikutnya + 20],
};

const Y = 565;
const K1 = { w: 520, h: 560 }, K2 = { w: 460, h: 560 };
/** kartu 01 di awal Scene 06 (layar) = tujuan penyatuan dua kartu Scene 05 (Simon 14 Okt: transisi seperti Scene 02 → 03, tanpa masker) */
export const S06_KARTU1_AWAL = { x: 960, y: 565, w: K1.w, h: K1.h };
const BARIS_Y = [395, 565, 735];
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
  const x1 = lerp(lerp(lerp(lerp(960, 680, a2), 1230, b), 700, c), 680, d);
  // kartu 02: A2 1290 (redup) · B–C keluar kanan · D/E kembali 1290
  const keluar2 = b * (1 - d);
  const x2 = 1290 + 320 * keluar2, alfa2 = (1 - keluar2) * lerp(0.6, 1, d);
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
        const x = lerp(600, x1, t), y = lerp(BARIS_Y[k], Y + 40, t);
        return <KartuBaris key={k} x={x} y={y} p={p * lerp(1, 0.4, t)} alfa={R(t, 0.7, 1, 1, 0)} ikon="amplopUang" warna={B.blue} judul={`Bulan ${k + 1}`}
          ket={rpPenuh(BIAYA_HIDUP)} />;
      })}

      {/* ═════════ C: kejadian mendadak — uang mengalir dari dana darurat ═════════ */}
      {KEJADIAN.map((kj, k) => {
        const p = popIn(f, T.kejadian[k]) * (1 - cin(f, T.evKeluar, 30));
        if (p <= 0.001) return null;
        const t = alir[k];
        return (
          <React.Fragment key={kj.nama}>
            <KartuBaris x={1300} y={BARIS_Y[k]} p={p} ikon={kj.ikon} foto={kj.foto} warna={B.orange} judul={kj.nama} ket={`−${rpPenuh(kj.biaya)}`} ketAlfa={R(t, 0.45, 0.85, 0, 1, io)} ketWarna={B.orange} />
            {t > 0.001 && t < 0.999 ? <Uang x={lerp(x1 + 140, 1130, t)} y={lerp(Y + 120, BARIS_Y[k], t) - Math.sin(Math.PI * t) * 50} w={110} alfa={R(t, 0, 0.15, 0, 1) * R(t, 0.85, 1, 1, 0)} /> : null}
          </React.Fragment>);
      })}

      {/* ═════════ kartu 02: Investasi lain ═════════ */}
      {alfa2 > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, alfa2) }}>
          <Kaca x={x2} y={Y} w={K2.w} h={K2.h} p={popIn(f, T.k2) * (1 + denyut(f, T.denyutInv, 0.03) + denyut(f, T.k2 + 70, 0.03) + T.denyutAkhir.reduce((a, t) => a + denyut(f, t, 0.03), 0))} warna={B.orange} tab="atas"
            rona={0.5} tepi={cin(f, T.nyala)} />
          <Nomor x={x2 - K2.w / 2 + 50} y={Y - K2.h / 2 + 50} n={2} warna={B.orange} p={popIn(f, T.k2 + 10)} />
          <Foto k="tumbuh" x={x2} y={Y - 90} w={250} p={popIn(f, T.k2 + 6)} />
          {popIn(f, T.k2 + 12) > 0.001 ? <Teks x={x2} y={Y + 100} teks="Investasi lain" size={38} alfa={cin(f, T.k2 + 12)} /> : null}
          {/* D: nilai utuh + tombol JUAL tidak dipakai (dicoret) */}
          <PilNominal x={x2} y={Y + 170} teks={rpPenuh(NILAI_INV)} arah={0} p={popIn(f, T.d + 10)} size={30} />
          {(() => {
            const p = popIn(f, T.jual) * (1 - cin(f, T.e));
            if (p <= 0.001) return null;
            const coret = R(f, T.coret - 20, T.coret + 20, 0, 1, io);
            return (
              <div style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 70, transformOrigin: 'center', transform: `${geser(x2 - 110, Y + 210)} scale(${p})`, borderRadius: 20,
                background: rgba(ARAH.turun, 0.14), display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: ARAH.turun, letterSpacing: '.08em' }}>
                JUAL
                <div style={{ position: 'absolute', left: 20, top: 33, height: 5, borderRadius: 3, width: 180 * coret, background: CORET }} />
              </div>);
          })()}
          {/* gembok (A) → terbuka (E) */}
          <Lencana x={x2 + 170} y={Y - 230} d={140} p={popIn(f, T.k2 + 20) * (1 - buka)} warna={B.night} ikon="kunci" besar={70} />
          <Lencana x={x2 + 170} y={Y - 230} d={140} p={popIn(f, T.buka + 10)} warna={ARAH.naik} ikon="tersedia" besar={70} />
        </div>) : null}
      <Chevron x={(x1 + K1.w / 2 + x2 - K2.w / 2) / 2} y={Y} warna={mixHex(B.orange, ARAH.naik, cin(f, T.nyala))} p={popIn(f, T.chevron) * (1 - keluar2)} d={64} />

      {/* ═════════ kartu 01: Dana darurat (bagian uang aktif) ═════════ */}
      {/* badan kartu 01 sudah ada begitu penyatuan dua kartu Scene 05 selesai (RS06_MASUK.mulai + 60); isinya menyusul */}
      <Kaca x={x1} y={Y} w={K1.w} h={K1.h} p={(f >= RS06_MASUK.mulai + durMasker - 6 ? 0.99996 : 0) * (1 + denyut(f, T.denyutTermasuk, 0.03) + denyut(f, T.sorot, 0.03) + [T.chipAktif + 40, T.chipAktif + 80, T.k2 + 100, T.judul + 50, T.judul + 80, T.b + 40, T.b + 60].reduce((a, t) => a + denyut(f, t, 0.025), 0))} warna={B.blue} tab="atas" rona={0.6}
        tepi={cin(f, T.centang)} />
      <Nomor x={x1 - K1.w / 2 + 50} y={Y - K1.h / 2 + 50} n={1} warna={B.blue} p={popIn(f, T.k1 + 10)} />
      {/* chip "Uang aktif" menumpang di tepi atas kartu (ref-06): dana darurat TERMASUK uang aktif */}
      {(() => {
        const p = popIn(f, T.chipAktif);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x1 + 70, Y - K1.h / 2 + 2)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center',
            gap: 10, background: B.blue, color: B.white, borderRadius: 999, padding: '10px 22px', fontFamily: F, fontSize: 28, fontWeight: 800, whiteSpace: 'nowrap',
            boxShadow: `0 12px 24px -10px ${B.blue}` }}>
            <Icon name="dompet" size={30} color={B.white} />Uang aktif
          </div>);
      })()}
      <Foto k="darurat" x={x1} y={Y - 85} w={330} p={popIn(f, T.foto1)} />
      {f >= T.k1 ? <Teks x={x1} y={Y + 110} teks="Dana darurat" size={42} alfa={cin(f, T.foto1 + 10)} /> : null}
      <PilNominal x={x1} y={Y + 185} teks={rpPenuh(Math.max(0, Math.round(saldo / 100_000) * 100_000))} arah={0} p={popIn(f, T.tuang[0] + 20)} size={34} lebarMin={260} />
      <Lencana x={x1 + 190} y={Y - 230} d={140} p={popIn(f, T.centang)} warna={ARAH.naik} ikon="tersedia" besar={70} />

      <Judul f={f} kata={['Dana', 'darurat', '≈', '1–3 bulan', 'biaya', 'hidup']} sorotIdx={3} at={T.judul} sorotAt={T.sorot} />
      <Judul f={f} kata={['Siapkan', 'dana', 'darurat', 'sebelum', 'investasi', 'lain']} sorotIdx={3} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
