import React from 'react';
import { RS09_MASUK } from './RS09';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, io, lerp, rgba } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import { denyut } from '../parts/umum';
import { Kaca, geser, MaskerKeluar, durMasker, type Masuk, daratDari, CakramDarat, bayanganKaca } from '../parts/kaca';
import { Kalender, Tagihan, Uang, Foto, FOTO } from '../parts/nyata';
import { KartuLilin, laju, relatif } from '../parts/lilin';
import { S08_PASAR } from '../data/pasar';

/**
 * REVISI SCENE 08 v2 (14 Okt, evaluasi 5 pertanyaan — v1 13 Okt: daftar "Produk A/B/C" abstrak, gembok di pin = simbol, elemen kecil).
 * Pesan: untuk uang stabil yang penting uangnya ADA saat dipakai; tanggal bayar tidak mundur karena pasar turun.
 *   A  "target utamanya bukan mengejar return setinggi mungkin"  TAGIHAN uang sekolah (15 Jul 2027, Rp15 jt) jadi pusat sejak awal — itulah targetnya;
 *      tiga kartu tawaran (+6 % · +12 % · +20 % per tahun) melayang masuk di sampingnya lalu SEMUANYA disingkirkan (bukan hanya yang tertinggi)
 *   B  "saat waktunya dipakai, uangnya masih ada"  uang Rp15 jt + kalender berganti Okt 2026 → Jul 2027, tanggal 15 dilingkari → uang masuk tagihan → LUNAS
 *   C  "biaya sekolah, DP rumah, pengeluaran terjadwal nggak mundur hanya karena pasar turun"  kartu JADWAL PEMBAYARAN (ref-05): tiga tagihan bertanggal
 *      dengan hitung mundur hari yang TERUS BERJALAN; kartu nilai pasar saham jatuh merah di sampingnya — hitung mundur tidak berhenti/mundur
 */

const [uang, ini, target, bukan, mengejar, setinggi, mungkin, yang, penting, saat, waktunya, dipakai, uangnya, masih, ada, karena, sekolah, dp, pengeluaran,
  terjadwal, nggak, mundur, hanya, pasar, turun] = urut([
  'uang', 'ini', 'target', 'bukan', 'mengejar', 'setinggi', 'mungkin', 'yang', 'penting', 'saat', 'waktunya', 'dipakai', 'uangnya', 'masih', 'ada', 'karena',
  'sekolah', 'dp', 'pengeluaran', 'terjadwal', 'nggak', 'mundur', 'hanya', 'pasar', 'turun'], BATAS.s8);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS08_MASUK: Masuk = { x: 960, y: 619, r: 150, warna: B.white, mulai: BATAS.s8 - 20 };
const DARAT = daratDari(RS08_MASUK);

const T = {
  tagihan: Math.max(uang + 10, DARAT + 30), chipStabil: Math.max(ini, DARAT + 46), target, tawaran: [bukan, mengejar, setinggi - 10], geserA: bukan - 10, singkir: mungkin + 20,
  uangB: yang, geserB: yang - 10, denyutPenting: penting, kalender: yang + 10, denyutKal: saat, halaman: [waktunya - 10, dipakai + 40], lingkar: dipakai + 50,
  bayar: [uangnya - 10, masih + 20], lunas: ada, keluarB: karena,
  agenda: karena + 10, baris: [Math.max(sekolah - 10, karena + 54) /* baris 1 pop SESUDAH kartu jadwal tersatukan */, dp - 10, pengeluaran], hitung: pengeluaran + 36, denyutTerjadwal: terjadwal, denyutNggak: [nggak, mundur], geserC: hanya - 20, pasar: hanya,
  jatuh: [hanya + 10, turun + 20], judul: karena + 20, sub: nggak, subSorot: pasar,
};

const Y = 565;
/** pusat frame (ukur 14 Okt): susunan A–B dulu −54 px (terlalu atas) → wadahnya turun 54; C (jadwal + pasar) dulu +25 → y 540 */
const DY_AB = 54, YC = 540;
const TAWARAN = [6, 12, 20];
const HAL = [
  { atas: 'Okt 2026', angka: '15' }, { atas: 'Jan 2027', angka: '15' }, { atas: 'Apr 2027', angka: '15' }, { atas: 'Jul 2027', angka: '15', bawah: 'jatuh tempo' },
];
/** Simon 14 Okt: "icon disini ganti dengan gambar realistis" → lingkaran ikon baris jadwal diganti foto benda (sekolah · rumah · skuter berkas Simon) */
const JADWAL: { nama: string; foto: keyof typeof FOTO; tanggal: string; total: string; hari: number }[] = [
  { nama: 'Uang sekolah', foto: 'sekolah', tanggal: '15 Jul 2027', total: 'Rp15 jt', hari: 270 },
  { nama: 'DP rumah', foto: 'rumahModern', tanggal: '1 Mar 2029', total: 'Rp100 jt', hari: 870 },
  { nama: 'Cicilan motor', foto: 'motorSkuter', tanggal: 'Tiap tgl 25', total: 'Rp1,2 jt', hari: 20 },
];
const AG = { w: 860, h: 560 };
/** pasar saham turun = IHSG harian asli 13 Jan – 24 Mar 2020 (−37 %) — Simon 14 Okt: volatilitas = candlestick realistis */
const PASAR = relatif(S08_PASAR);

export const RS08: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS09_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s8 || f >= RS09_MASUK.mulai + durMasker) return null;
  // verifikasi pusat 14 Okt (Simon "ya perbaiki"): geser dipusatkan 18f SEBELUM pop elemen yang membuatnya perlu (pop ease-out-back sudah 90 % besar
  // di sepertiga waktunya, geser inOut baru 90 % di tiga perempatnya) — dulu tawaran / uang / kartu pasar muncul sebelum susunan bergeser (+54 · −110 · −38 px)
  const a = cin(f, T.tawaran[0] - 24), sing = cin(f, T.singkir);
  const bB = cin(f, T.uangB - 24);
  // B → C (Simon 15 Okt "perbaiki itu": dulu kartu jadwal POP di atas kalender + tagihan yang sedang memudar → isi lama tembus pandang di balik panel).
  // Kini gaya Scene 02 → 03: isi kalender & tagihan memudar 30f, badan keduanya bergeser & MENYATU (60f inOut cubic) jadi badan kartu jadwal; kartu jadwal
  // tampil tanpa pop di ujung penyatuan (kepala & rona memudar 20f di atas kotak penyatu), isinya memudar masuk.
  const M0 = T.keluarB - 30, mg = R(f, M0, M0 + 60, 0, 1, io), isiB = 1 - R(f, M0, M0 + 30, 0, 1, io);
  const agAda = M0 + 54, agAlfa = R(f, agAda, agAda + 20, 0, 1, io);
  const bayar = R(f, T.bayar[0], T.bayar[1], 0, 1, io);
  // tagihan: A1 960 → 1020 saat chip Uang Stabil menempel di kirinya · A2 (tawaran) 795 · A3 1020 · B 1345 → sesudah LUNAS 1143 (kalender 905 → 703) — tiap susunan berpusat (ukur 14 Okt)
  // sesudah uang masuk (LUNAS), kalender + tagihan bergeser ke tengah (uang di kiri sudah tidak ada)
  // geser ke tengah SELAMA uang terbang masuk ke tagihan (dulu sesudahnya: kalender + tagihan sendirian di kanan +221 px)
  const pusatB = R(f, T.bayar[0] + 20, T.bayar[1] + 10, 0, 1, io);
  const xTag = lerp(lerp(lerp(lerp(lerp(960, 1020, cin(f, T.chipStabil - 24)), 795, a), 1020, sing), 1345, bB), 1143, pusatB), xKal = lerp(905, 703, pusatB);
  const sTag = lerp(1.5, 1.25, bB);
  const cC = cin(f, T.pasar - 24);
  const xAg = lerp(960, 640, cC);
  const jatuh = laju(f, T.jatuh[0], T.jatuh[1]); // kemajuan candle (sumbu waktu tetap, masuk/keluar halus)
  // hitung mundur hari berjalan sejak "terjadwal": 1 hari tiap 3 frame (berjalan rapat seperti nominal — dulu tiap 8f = lonjakan terpisah di pemindai)
  const lewat = Math.max(0, Math.floor((f - T.hitung) / 3));
  return (
    <MaskerKeluar f={f} mulai={RS09_MASUK.mulai} ke={RS09_MASUK} warna={RS09_MASUK.warna}>
    <AbsoluteFill>
      <CakramDarat f={f} ke={RS08_MASUK} />
      {/* ═════════ A–B: tagihan uang sekolah (target) ═════════ */}
      {/* kotak penyatu: badan kalender & tagihan → badan kartu jadwal (di BELAKANG isi; bayangan tumbuh bersama kemajuan) */}
      {mg > 0.0001 && f < agAda + 20 ? [{ x: xKal, w: 230 * 1.1, h: 236 * 1.1, r: 26 * 1.1 }, { x: xTag, w: 320 * sTag, h: 236 * sTag, r: 20 * sTag }].map((a, k) => {
        const x = lerp(a.x, xAg, mg), y = lerp(Y + 25, YC, mg), w = lerp(a.w, AG.w, mg), hh = lerp(a.h, AG.h, mg);
        return (
          <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: w, height: hh, transform: `translate3d(${x - w / 2}px, ${y - hh / 2}px, 0) rotate(0.001deg)`,
            borderRadius: lerp(a.r, 32, mg), background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`, boxShadow: bayanganKaca(B.blue, k ? mg : 0) }} />);
      }) : null}
      {isiB > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, isiB), transform: geser(0, lerp(DY_AB, 25, bB)) }}>
          {/* tawaran return (A) — disingkirkan semuanya */}
          {TAWARAN.map((pr, k) => {
            const p = popIn(f, T.tawaran[k]);
            if (p <= 0.001 || sing >= 0.999) return null;
            const x = 1325 + 520 * sing, y = Y - 150 + 150 * k;
            return (
              <div key={pr} style={{ position: 'absolute', inset: 0, opacity: 1 - sing }}>
                <Kaca x={x} y={y} w={320} h={118} p={p} warna={ARAH.naik} tab="kiri" tabTebal={12} radius={24} />
                <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'baseline', gap: 10,
                  fontFamily: F, whiteSpace: 'nowrap' }}>
                  <svg width={30} height={24} viewBox="0 0 22 18"><path d="M11 1 L21 17 L1 17 Z" fill={ARAH.naik} /></svg>
                  <span style={{ fontSize: 50, fontWeight: 800, color: ARAH.naik }}>{`+${pr}%`}</span>
                  <span style={{ fontSize: 26, fontWeight: 700, color: B.gray }}>/ tahun</span>
                </div>
              </div>);
          })}
          {/* B: uang Rp15 jt disiapkan → masuk ke tagihan saat tanggalnya tiba */}
          {bayar < 0.999 ? (
            <>
              <Uang x={lerp(525, xTag - 40, bayar)} y={lerp(Y - 10, Y + 20, bayar) - Math.sin(Math.PI * bayar) * 120} w={lerp(300, 150, bayar)} p={popIn(f, T.uangB)}
                alfa={R(bayar, 0.8, 1, 1, 0)} />
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - bayar }}>
                <PilNominal x={525} y={Y + 150} teks="Rp15.000.000" arah={0} p={popIn(f, T.uangB + 14) * (1 + denyut(f, T.denyutPenting, 0.05))} size={32} />
              </div>
            </>) : null}
          <Kalender x={xKal} y={Y} s={1.1} p={popIn(f, T.kalender) * (1 + denyut(f, T.denyutKal, 0.04))} warna={B.turq} halaman={HAL} i={3 * R(f, T.halaman[0], T.halaman[1], 0, 1)}
            lingkar={R(f, T.lingkar - 20, T.lingkar + 20, 0, 1, io)} />
          <Tagihan x={xTag} y={Y} judul="Uang sekolah" ikon="biayaSekolah" warna={B.blue} tempo="15 Jul 2027" total="Rp15.000.000" w={320}
            p={popIn(f, T.tagihan) * sTag * (1 + denyut(f, T.target, 0.04))} sorotTempo={Math.sin(Math.PI * R(f, T.lingkar - 30, T.lingkar + 30, 0, 1, io))}
            lunas={popIn(f, T.lunas)} />
          {/* gedung sekolah (foto realistis Simon) tepat di atas tagihan uang sekolah — ikut posisi & skala tagihan */}
          <Foto k="sekolah" x={xTag} y={Y - 182 * sTag} w={165 * sTag} p={popIn(f, T.tagihan + 14)} />
          {/* chip "Uang Stabil" menumpang di sudut tagihan (ref-06): uang inilah yang dimaksud "uang seperti ini" */}
          {(() => {
            const p = popIn(f, T.chipStabil) * (1 - bB);
            if (p <= 0.001) return null;
            return (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(xTag - 160 * sTag, Y - 118 * sTag - 22)} translate(-50%, -50%) scale(${p})`, display: 'flex',
                alignItems: 'center', gap: 10, background: B.turq, color: B.white, borderRadius: 999, padding: '10px 22px', fontFamily: F, fontSize: 28, fontWeight: 800,
                whiteSpace: 'nowrap', boxShadow: `0 12px 24px -10px ${B.turq}` }}>
                <Icon name="dompet" size={30} color={B.white} />Uang Stabil
              </div>);
          })()}
        </div>) : null}

      {/* ═════════ C: jadwal pembayaran — hitung mundur terus berjalan walau pasar turun ═════════ */}
      {f >= M0 ? (
        <>
          <Kaca x={xAg} y={YC} w={AG.w} h={AG.h} p={(f >= agAda ? 1 : 0) * (1 + denyut(f, T.baris[2] - 35, 0.02))} warna={B.blue} tab="atas" rona={0.4}
            alfa={Math.max(0.0001, Math.min(0.9999, agAlfa))} />
          {f >= agAda ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: AG.w, height: AG.h, transformOrigin: 'center', transform: geser(xAg - AG.w / 2, YC - AG.h / 2),
              fontFamily: F }}>
              <div style={{ position: 'absolute', left: 40, top: 40, display: 'flex', alignItems: 'center', gap: 14, opacity: Math.min(0.9999, R(f, agAda + 6, agAda + 36, 0, 1, io)) }}>
                <Icon name="kalender" size={40} color={B.blue} />
                <span style={{ fontSize: 34, fontWeight: 800, color: B.night }}>Jadwal pembayaran</span>
              </div>
              {JADWAL.map((j, k) => {
                const p = popIn(f, T.baris[k]);
                if (p <= 0.001) return null;
                // cicilan bulanan: hitung mundur berulang tiap 30 hari (tidak berhenti di 0)
                const sisa = j.nama === 'Cicilan motor' ? ((j.hari - lewat) % 30 + 30) % 30 || 30 : Math.max(0, j.hari - lewat);
                return (
                  <div key={j.nama} style={{ position: 'absolute', left: 30, right: 30, top: 116 + 142 * k, height: 124, borderRadius: 24, background: B.white,
                    boxShadow: `0 12px 26px -16px ${rgba(B.night, 0.35)}`, display: 'flex', alignItems: 'center', gap: 20, padding: '0 22px', boxSizing: 'border-box',
                    transform: `scale(${p * (1 + denyut(f, T.denyutNggak[0] + 8 * k, 0.03) + denyut(f, T.denyutNggak[1] + 8 * k, 0.03) + denyut(f, T.baris[k] + 40, 0.03))})` }}>
                    <Img src={staticFile(FOTO[j.foto].src)} style={{ width: 136, height: 96, objectFit: 'contain', flex: 'none' }} />
                    <div style={{ flex: 1, lineHeight: 1.18 }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: B.night }}>{j.nama}</div>
                      <div style={{ fontSize: 26, fontWeight: 700, color: B.gray }}>{`${j.tanggal} · ${j.total}`}</div>
                    </div>
                    {/* hitung mundur hari — terus berkurang */}
                    <div style={{ padding: '10px 18px', borderRadius: 999, background: rgba(B.orange, 0.14), color: B.orange, fontSize: 28, fontWeight: 800, whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums', minWidth: 210, textAlign: 'center', opacity: Math.min(0.9999, cin(f, T.baris[k] + 20, 30)) }}>{`${sisa} hari lagi`}</div>
                  </div>);
              })}
            </div>) : null}
          {/* pasar saham turun di samping jadwal */}
          <KartuLilin x={1440} y={YC} w={560} h={AG.h} p={popIn(f, T.pasar)} d={PASAR} g={jatuh} modal={100_000_000} ikon="pasarJatuh" nama="Pasar saham"
            warna={ARAH.turun} label="Nilai investasi" />
        </>) : null}

      <Judul f={f} kata={['Tanggal', 'kebutuhan', 'kita']} at={T.judul} />
      <Judul f={f} kata={['nggak', 'menunggu', 'pasar']} sorotIdx={2} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
