import React from 'react';
import { RS12_MASUK } from './RS12';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, io, lerp, mixHex, rgba } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import { denyut } from '../parts/umum';
import { Chevron, bayanganKaca, geser, MaskerKeluar, durMasker, type Masuk, daratDari } from '../parts/kaca';
import { Kalender, Tagihan, Uang } from '../parts/nyata';
import { KartuLilin, gCandle, laju, posisiQ, relatif, rentang } from '../parts/lilin';
import { IHSG_2012_2021, S11_KRISIS } from '../data/pasar';
import type { KunciIkon } from '../ikon';

/**
 * REVISI SCENE 11 v2 (14 Okt, evaluasi 5 pertanyaan — v1: terlalu banyak elemen kecil sekaligus, teks kalender bertumpuk saat berganti).
 * Pesan: pasar turun tepat saat uang harus dipakai → terpaksa jual rugi; tanggal bayar tidak mundur → uang waktu dekat jangan di investasi jangka panjang.
 * Tata letak = LANGKAH BERNOMOR (ref-20): kepala 01 · 02 · 03 (ikon kalender · label jual · jam) yang menyala bergiliran, isi = SATU susunan besar.
 *   01 "tepat saat uangnya harus dipakai, pasar sedang turun tajam"  tagihan DP 1 Okt 2029 + kalender menghitung mundur sampai "Hari ini" ·
 *      nilai Saham / RD saham = candle IHSG mingguan asli 2020: jatuh Rp100 jt → Rp66,7 jt
 *   02 "terpaksa menjual di harga yang nggak ideal"  tombol JUAL ditekan → Rp66,7 jt ke tagihan → batang bayar 66,7 % + "Kurang Rp33.300.000"
 *   03 "pasar butuh waktu pulih, tapi tanggal pembayaran nggak ikut mundur"  candle berlanjut, kalender ikut maju Jan → Apr → Agu 2030, harga pasar pulih ±Rp101 jt — sudah terjual;
 *      tanggal tagihan tetap 1 Okt 2029 (disorot)
 *   04 "uang waktu dekat jangan dipaksa menanggung volatilitas investasi jangka panjang"  dua jalur: uang DP menuju saham lalu BERBELOK ke
 *      Deposito/obligasi (garis tenang s/d Okt 2029) · saham untuk uang 10+ tahun (candle IHSG 2012–2021)
 */

const [tepat, uangnya, harus, dipakai, pasar, turun, tajam, mungkin, menjual, harga, ideal, pasar2, butuh, pulih, tanggal, pembayaran, mundur, makanya, uang, dekat,
  jangan, menanggung, volatilitas, jangka] = urut([
  'tepat', 'uangnya', 'harus', 'dipakai', 'pasar', 'turun', 'tajam', 'mungkin', 'menjual', 'harga', 'ideal', 'pasar', 'butuh', 'pulih', 'tanggal', 'pembayaran',
  'mundur', 'makanya', 'uang', 'dekat', 'jangan', 'menanggung', 'volatilitas', 'jangka'], BATAS.s11);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS11_MASUK: Masuk = { x: 960, y: 664, r: 150, warna: B.white, mulai: BATAS.s11 - 20 };
/** Simon 14 Okt: "jika ada 2 panel lalu di scene selanjutnya cuman ada 1 gunakan transisi seperti scene 2 ke 3" → tiga kartu kemungkinan Scene 10
 *  MENYATU menjadi badan tagihan DP rumah (tanpa masker). Badan tagihan di awal Scene 11 (layar): Tagihan 330 × 236 diskalakan 1,35, y 610 + 54. */
export const S11_TAGIHAN_AWAL = { x: 960, y: 664, w: 330 * 1.35, h: 236 * 1.35, kepala: 58 * 1.35, radius: 20 * 1.35 };
const DARAT = daratDari(RS11_MASUK);

const T = {
  langkah: [DARAT + 24, mungkin - 20, pasar2 - 10], tagihan: DARAT + 30, kalender: Math.max(tepat + 20, DARAT + 46), hitung: [uangnya, dipakai + 30], lingkar: dipakai + 40, denyutHarus: harus,
  kartu: pasar - 20, jatuh: [turun - 10, tajam + 30], jual: mungkin, tekan: menjual, bayar: [harga - 20, ideal - 10], batang: [ideal - 30, ideal + 20], kurang: ideal + 20,
  lanjut: [pasar2 + 20, pulih + 30], pulih: [pasar2 + 40, pulih + 40], denyutButuh: butuh, sorotTanggal: [tanggal, pembayaran], denyutMundur: mundur,
  keluar: makanya - 20, jalur: makanya + 20, uangC: uang, belok: [jangan - 20, menanggung + 10], denyutC: [dekat, volatilitas, jangka],
  judul: mungkin + 30, sub: makanya, subSorot: jangan,
};

const Y = 610;
const TAG = { x: 572 }; // pusat frame (ukur 14 Okt: susunan 01–03 dulu +38 px ke kanan)
const KN = { x: 1292 };
const LANGKAH: { ikon: KunciIkon; warna: string }[] = [{ ikon: 'kalender', warna: B.orange }, { ikon: 'jual', warna: ARAH.turun }, { ikon: 'waktu', warna: B.blue }];
const HAL = [
  { atas: 'Agu 2029', angka: '1', bawah: '2 bulan lagi' }, { atas: 'Sep 2029', angka: '1', bawah: '1 bulan lagi' }, { atas: 'Okt 2029', angka: '1', bawah: 'Hari ini' },
  { atas: 'Jan 2030', angka: '1', bawah: '3 bulan lewat' }, { atas: 'Apr 2030', angka: '1', bawah: '6 bulan lewat' }, { atas: 'Agu 2030', angka: '1', bawah: '10 bulan lewat' },
];
/** Simon 14 Okt — volatilitas = candlestick realistis: pola IHSG mingguan asli 13 Jan 2020 – 11 Jan 2021 (jatuh −33 % dalam 9 minggu, pulih ±10 bulan).
 *  Candle ke-9 (minggu 16 Mar 2020) = "hari ini" (tanggal bayar) → terjual di 66,7 % modal. Kalender sesudahnya mengikuti candle: +3 bln = candle 22,
 *  +6 bln = candle 35, +10 bln = candle 52 (nilai kembali ±101 %). */
const KRISIS = relatif(S11_KRISIS);
const JUAL_I = 9;
const LAKU = KRISIS[JUAL_I].c; // 0,667
const HASIL = Math.round((100_000_000 * LAKU) / 100_000) * 100_000; // Rp66.700.000
const ribu = (v: number) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** jalur uang jangka panjang (bagian 04): IHSG bulanan asli Jan 2012 – Des 2021 (10 tahun) */
const PANJANG = relatif(IHSG_2012_2021);
const DOM_PANJANG = rentang(PANJANG);
const KARTU = { w: 560, h: 420 };

export const RS11: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS12_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s11 || f >= RS12_MASUK.mulai + durMasker) return null;
  const kel = cin(f, T.keluar);
  // kemajuan candle: 01 sampai minggu jual (candle 9) · 03 sisanya sampai pulih — laju masuk/keluar halus
  const gJual = gCandle(KRISIS.length, JUAL_I);
  const gK = gJual * laju(f, T.jatuh[0], T.jatuh[1]) + (1 - gJual) * laju(f, T.pulih[0], T.pulih[1]);
  const qK = posisiQ(KRISIS.length, gK);
  const bayar = R(f, T.bayar[0], T.bayar[1], 0, 1, io), batang = R(f, T.batang[0], T.batang[1], 0, 1, io);
  // kalender: 01 hitung mundur ke "Hari ini" · 03 berganti mengikuti candle (+3 bln = candle 22 · +6 bln = 35 · +10 bln = 52)
  const iKal = 2 * R(f, T.hitung[0], T.hitung[1], 0, 1) + R(qK, 10, 23, 0, 1, (t) => t) + R(qK, 23, 36, 0, 1, (t) => t) + R(qK, 36, 53, 0, 1, (t) => t);
  // langkah aktif (0…2): kepala menyala bergiliran
  const aktif = cin(f, T.langkah[1], 30) + cin(f, T.langkah[2], 30);
  // 01 sebelum kartu nilai muncul: tagihan sendirian di tengah → geser kiri saat kartu muncul (geser bertahap)
  const xTag = lerp(960, TAG.x, cin(f, T.kartu - 24));
  return (
    <MaskerKeluar f={f} mulai={RS12_MASUK.mulai} ke={RS12_MASUK} warna={RS12_MASUK.warna}>
    <AbsoluteFill>
      {/* masuk lewat penyatuan kartu Scene 10 (bukan masker) → tanpa cakram pendaratan */}
      {/* ═════════ kepala langkah 01 · 02 · 03 (ref-20) ═════════ */}
      {kel < 0.999 ? (
        // susunan 01 (tanpa tombol JUAL & batang bayar) lebih pendek → turun 54 px; begitu JUAL muncul naik ke −18 (ukur 14 Okt: dulu −54 lalu +18)
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - kel, transform: geser(0, lerp(54, -18, cin(f, T.jual))) }}>
          {LANGKAH.map((l, k) => {
            const p = popIn(f, T.langkah[k]);
            if (p <= 0.001) return null;
            const nyala = Math.max(0, 1 - Math.abs(aktif - k));
            const x = 960 + (k - 1) * 230;
            return (
              <div key={k} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, 236)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center',
                gap: 12, padding: '10px 20px 10px 12px', borderRadius: 999, background: mixHex(B.white, l.warna, nyala), boxShadow: `0 12px 26px -14px ${rgba(B.night, 0.4)}`,
                fontFamily: F, fontSize: 30, fontWeight: 800, color: mixHex(B.gray, B.white, nyala), opacity: lerp(0.6, 1, nyala) }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: nyala > 0.5 ? rgba(B.white, 0.25 * (2 * nyala - 1)) : rgba(l.warna, 0.14 * (1 - 2 * nyala)), display: 'grid', placeItems: 'center' }}>
                  <Icon name={l.ikon} size={28} color={mixHex(l.warna, B.white, nyala)} />
                </div>
                {`0${k + 1}`}
              </div>);
          })}
          {[0, 1].map((k) => <Chevron key={k} x={960 + (k - 0.5) * 230} y={236} warna={B.grayLite} p={popIn(f, T.langkah[k + 1]) * 0.7} d={34} />)}

          {/* tagihan DP + kalender menumpang di sudutnya */}
          {/* badan tagihan sudah ada begitu kartu Scene 10 selesai menyatu (DARAT − 6, tanpa pop); isinya memudar masuk di atas badan polos */}
          {f >= DARAT - 6 && f < DARAT + 40 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: S11_TAGIHAN_AWAL.w, height: S11_TAGIHAN_AWAL.h, borderRadius: S11_TAGIHAN_AWAL.radius, overflow: 'hidden',
              background: B.white, boxShadow: bayanganKaca(B.orange, 0.9), transform: geser(xTag - S11_TAGIHAN_AWAL.w / 2, Y - S11_TAGIHAN_AWAL.h / 2) }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: S11_TAGIHAN_AWAL.kepala, background: B.orange }} />
            </div>) : null}
          <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, cin(f, DARAT + 10, 30)) }}>
          <Tagihan x={xTag} y={Y} judul="DP rumah" ikon="dpRumah" warna={B.orange} tempo="1 Okt 2029" total="Rp100.000.000" w={330}
            p={(f >= DARAT - 6 ? 1 : 0) * 1.35 * (1 + denyut(f, T.denyutHarus, 0.03) + denyut(f, T.denyutMundur, 0.03))}
            sorotTempo={[T.sorotTanggal[0] - 40, ...T.sorotTanggal].reduce((a, t) => a + Math.sin(Math.PI * R(f, t - 20, t + 20, 0, 1, io)), 0)} />
          </div>
          <Kalender x={xTag + 230} y={Y - 200} s={0.9} p={popIn(f, T.kalender) * (1 + denyut(f, T.denyutMundur - 30, 0.05))} warna={B.orange} halaman={HAL} i={iKal}
            lingkar={R(f, T.lingkar - 20, T.lingkar + 20, 0, 1, io) * (iKal < 2.4 ? 1 : 0)} />
          {/* 02: batang bayar 70 % + kurang Rp30 jt */}
          {batang > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 446, transform: geser(xTag - 223, Y + 196), opacity: Math.min(0.9999, batang * 3) }}>
              <div style={{ height: 34, borderRadius: 17, background: rgba(ARAH.turun, 0.14), overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${100 * LAKU * batang}%`, background: B.orange, borderRadius: 17 }} />
              </div>
            </div>) : null}
          <PilNominal x={xTag} y={Y + 275} teks={`Kurang Rp${ribu(100_000_000 - HASIL)}`} arah={-1} p={popIn(f, T.kurang)} size={32} />

          {/* nilai Saham / RD saham: jatuh 100 → 70 jt · JUAL · pulih sesudah terjual */}
          <KartuLilin x={KN.x} y={Y - 50} w={KARTU.w} h={KARTU.h} p={popIn(f, T.kartu)} d={KRISIS} g={gK} modal={100_000_000} ikon="saham"
            nama="Saham / RD saham" warna={B.blue} label="Nilai investasi" labelB="Harga pasar · sudah terjual" labelMix={cin(f, T.tekan + 20, 30)}
            jual={cin(f, T.jual, 30) * (1 - cin(f, T.lanjut[0], 30))} tekan={R(f, T.tekan - 12, T.tekan + 12, 0, 1)} />
          {/* uang hasil jual (Rp66,7 jt) → tagihan */}
          {bayar > 0.001 && bayar < 0.999 ? <Uang x={lerp(KN.x, xTag + 40, bayar)} y={lerp(Y + 120, Y + 20, bayar) - Math.sin(Math.PI * bayar) * 160} w={lerp(220, 140, bayar)}
            alfa={R(bayar, 0, 0.12, 0, 1) * R(bayar, 0.85, 1, 1, 0)} /> : null}
          {bayar > 0.001 && bayar < 0.999 ? <PilNominal x={lerp(KN.x, xTag + 40, bayar)} y={lerp(Y + 210, Y + 110, bayar) - Math.sin(Math.PI * bayar) * 160} teks={`Rp${ribu(HASIL)}`}
            arah={-1} p={Math.min(1, R(bayar, 0, 0.15, 0, 1, io))} size={28} /> : null}
        </div>) : null}

      {/* ═════════ 04: dua jalur — uang waktu dekat ke Deposito/obligasi, bukan ke saham ═════════ */}
      {f >= T.jalur - 30 ? (() => {
        const pj = popIn(f, T.jalur);
        const belok = R(f, T.belok[0], T.belok[1], 0, 1, io);
        const maju = R(f, T.uangC - 10, T.belok[0], 0, 1, io);
        // uang DP: dari tengah bawah menuju saham (kanan) lalu berbelok ke Deposito/obligasi (kiri)
        // uang DP menunggu tepat di tengah celah antar-kartu (852–1068), lalu berbelok ke Deposito/obligasi
        // busur MELENGKUNG KE BAWAH (dulu ke atas: uang melintas menimpa tepi bawah kartu Deposito — survei 14 Okt)
        const ux = lerp(960, 610, belok) + 0 * maju, uy = 745 + Math.sin(Math.PI * belok) * 60;
        return (
          <>
            {/* deposito: garis tenang (nilai tetap) · saham: candle IHSG 10 tahun asli — domain harga SAMA supaya bedanya terlihat jujur */}
            <KartuLilin x={610} y={Y - 163} w={KARTU.w} h={KARTU.h} p={pj} d={PANJANG} garis={[1, 1]} dom={DOM_PANJANG} g={laju(f, T.jalur, T.jalur + 120)} modal={100_000_000}
              ikon="deposito" nama="Deposito / obligasi" warna={B.turq} label="Untuk DP · Okt 2029" />
            <KartuLilin x={1310} y={Y - 163} w={KARTU.w} h={KARTU.h} p={popIn(f, T.jalur + 12)} d={PANJANG} dom={DOM_PANJANG} g={laju(f, T.jalur + 30, RS12_MASUK.mulai - 10)}
              modal={100_000_000} ikon="saham" nama="Saham / RD saham" warna={B.orange} label="Untuk 10+ tahun" />
            {/* uang jangka panjang sudah di bawah kartu saham; uang DP menuju saham lalu BERBELOK dan mendarat di bawah Deposito/obligasi */}
            <Uang x={1310} y={745} w={150} p={popIn(f, T.jalur + 24)} />
            <PilNominal x={1310} y={827} teks="Uang 10+ tahun" arah={0} p={popIn(f, T.jalur + 34)} size={28} />
            {popIn(f, T.uangC) > 0.001 ? <Uang x={ux} y={uy} w={150} p={popIn(f, T.uangC)} /> : null}
            {popIn(f, T.uangC) > 0.001 ? <PilNominal x={ux} y={uy + 82} teks="Uang DP rumah" arah={0} p={popIn(f, T.uangC + 10)} size={28} /> : null}
          </>);
      })() : null}

      <Judul f={f} kata={['Jangan', 'sampai', 'kebutuhan', 'dana']} at={T.judul} />
      <Judul f={f} kata={['memaksa', 'kita', 'menjual']} sorotIdx={2} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
