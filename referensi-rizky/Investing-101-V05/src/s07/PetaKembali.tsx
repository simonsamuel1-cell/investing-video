import React from 'react';
import { B, bayanganKecil, CEK } from '../theme';
import { cin, popOut, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Lencana } from '../parts/umum';
import { KarakterLingkar, Nomor, Penghubung, PoseKarakter } from '../parts/kaca';
import { Pijakan, pusatRumah, RumahIso } from '../parts/v04';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { JEMBATAN_W, pusatSungai, Sungai } from '../parts/sungai';
import { KunciIkon } from '../ikon';
import { KonteksBayanganGelap } from '../skala';

/**
 * PETA SUNGAI PENUTUP (bagian akhir Scene 07 — naskah padat 22 Okt sore: "Sekarang kita kembali ke sungai tadi. Rumah di seberang tetap sama.
 * Yang berubah hanyalah kendaraan yang paling sesuai dengan kemampuan kita sekarang. Dan ingat, urutannya jangan dibalik: fondasi dulu, naik feri,
 * baru belajar terbang."). Dulu Scene 08 (src/s08, diarsip _arsip/s07-padat-22okt); baris rekap "Jadi ingat urutannya" dilepas (kalimatnya dihapus).
 * Geometri = peta Scene 01. Kendaraan jalan kaki · feri · pesawat DIBAWA dari ikon tiga kartu langkah (`asal`).
 */
const MURID_BIRU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ── B–C: peta sungai — geometri Scene 01 (src/s01/Scene01.tsx) ── */
// brief Video 04 (22 Okt): sama dengan Scene 01 — investor di PIJAKAN isometrik V04, rumah isometrik V04 (pojok kiri pijakannya = P1)
// samakan dengan revisi Scene 01 (Simon 22 Okt): baris jalur 220 px (139/359/579/799), isi berpusat 497 (di atas subtitle), sungai mengalir,
// garis putus-putus trim path, investor menghadap kanan
const ORANG = { x: 258, y: 509, D: 200 };
const PIJAKAN = { x: 258, y: 579, a: 140 };
const P0 = { x: 398, y: 579 }, P1 = { x: 1478, y: 579 };
const SUNGAI = { x0: 770, x1: 1150, top: 30, bottom: 1040 };
// 23 Okt (pola S01, Simon: urutan atas → bawah = 1 → 2 → 3): jalan kaki di ATAS, feri, speedboat (garis lurus), pesawat di BAWAH
const FERI_Y = 359, JALAN_Y = 139, PESAWAT_Y = 799;
const RUMAH_W = 340;
const RUMAH_PUSAT = pusatRumah(P1.x, P1.y, RUMAH_W);
const KD = 116;
type Jalur = { k: string; y: number; warna: string; ikon: KunciIkon; cermin: boolean };
const JALUR: Jalur[] = [
  { k: 'jalan', y: JALAN_Y, warna: JALUR_WARNA.jalan, ikon: 'jalanKaki', cermin: false },
  { k: 'feri', y: FERI_Y, warna: JALUR_WARNA.feri, ikon: 'feri', cermin: true },
  { k: 'speedboat', y: 579, warna: JALUR_WARNA.speedboat, ikon: 'speedboat', cermin: true },
  { k: 'pesawat', y: PESAWAT_Y, warna: JALUR_WARNA.pesawat, ikon: 'pesawat', cermin: false },
];
const jalurD = (y: number) => y === P0.y
  ? `M ${P0.x} ${P0.y} L ${P1.x} ${P1.y}`
  : `M ${P0.x} ${P0.y} C ${P0.x + 190} ${P0.y} ${SUNGAI.x0 - 170} ${y} ${SUNGAI.x0} ${y} L ${SUNGAI.x1} ${y} C ${SUNGAI.x1 + 170} ${y} ${P1.x - 190} ${P1.y} ${P1.x} ${P1.y}`;
export type WaktuPeta = { sekarang: number; sungai: number; rumah: number; tetap: number; berubah: number; kendaraan: number; kemampuanB: number;
  jalan: number; naik: number; terbang: number };
/** `asal(r)` = pusat & diameter ikon kartu langkah r (0 jalan kaki/fondasi · 1 feri · 2 pesawat) di layar — kendaraan peta datang dari sana */
export const PetaKembali: React.FC<{ f: number; T: WaktuPeta; asal: (r: number) => { x: number; y: number; d: number } }> = ({ f, T, asal }) => {
  if (f < T.sekarang - 30) return null;
  // 24 Okt: ikon kartu dilepas di T.sekarang − 30 (kartunya keluar di bawahnya), baru DIBAWA ke jalurnya sesudah kartu pergi; sungai menyusul
  const keMap = cin(f, T.sekarang + 50); // kendaraan kartu langkah DIBAWA ke jalurnya di peta sungai
  const sungaiP = cin(f, T.sekarang + 60);
  const sorot: Record<string, number> = { jalan: cin(f, T.jalan + 10), feri: cin(f, T.naik + 20), pesawat: cin(f, T.terbang + 10) };
  const redupSpeed = 1 - 0.7 * cin(f, T.jalan); // urutan akhir = fondasi → feri → terbang (speedboat di luar urutan)
  const nomor: Record<string, number> = { jalan: T.jalan + 20, feri: T.naik + 30, pesawat: T.terbang + 20 };
  return (
    <>
      {/* ══ B–C: peta sungai — tiap elemen masuk sendiri (sungai trim, pijakan dari kiri, rumah dari kanan, investor pop); kendaraan DIBAWA dari baris ══ */}
      {f >= T.sekarang - 30 ? (
        <KonteksBayanganGelap.Provider value={sungaiP}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Sungai id="s07peta" top={SUNGAI.top} bottom={SUNGAI.bottom} p={sungaiP} alir={f / 60} />
          {/* jembatan jalan kaki */}
          <div style={{ position: 'absolute', left: pusatSungai(JALAN_Y, 960, SUNGAI.top) - JEMBATAN_W / 2, top: JALAN_Y - 17, width: JEMBATAN_W, height: 34, borderRadius: 17, background: B.white,
            border: `3px solid ${B.turq}`, boxSizing: 'border-box', transformOrigin: '50% 50%', transform: `scaleX(${cin(f, T.sungai + 30)})`, boxShadow: bayanganKecil(B.turq) }} />
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {JALUR.map((j, i) => (
              <g key={j.k} opacity={j.k === 'speedboat' ? redupSpeed : 1}>
                <Penghubung d={jalurD(j.y)} g={cin(f, T.sungai + 60 + i * 15)} warna={j.warna} tebal={4} titik={false} pola="putus" />
                {sorot[j.k] ? <Penghubung d={jalurD(j.y)} g={sorot[j.k]} warna={j.warna} tebal={6} dash={false} titik={false} /> : null}
              </g>))}
            {/* "yang berubah hanyalah kendaraan": cincin sorot tergambar (trim path) di tiap kendaraan berurutan, atas → bawah — HITAM (Simon 24 Okt:
                "gunakan warna hitam atau hijau (warna yang tidak bertabrakan dengan warna sungai)"; dulu warna jalur, biru/toska di atas sungai biru) */}
            {JALUR.map((j, i) => {
              const g = cin(f, T.kendaraan + i * 15) * (1 - cin(f, T.jalan));
              return g > 0 ? <circle key={j.k} cx={960} cy={j.y} r={KD / 2 + 14} fill="none" stroke={B.night} strokeWidth={5} pathLength={1}
                strokeDasharray={`${g} 1`} transform={`rotate(-90 960 ${j.y})`} strokeLinecap="round" opacity={j.k === 'speedboat' ? redupSpeed : 1} /> : null;
            })}
          </svg>
          <RumahIso x={P1.x} y={P1.y} w={RUMAH_W} p={popIn(f, T.sungai + 40)} />
          <Lencana x={RUMAH_PUSAT.x} y={RUMAH_PUSAT.y - 20} d={RUMAH_W * 0.8} p={popIn(f, T.tetap)} warna={CEK} ikon="tersedia" besar={60} />
          {JALUR.map((j, i) => {
            // jalan · feri · pesawat = kendaraan baris ringkasan yang DIBAWA (dari kotak baris → jalurnya); speedboat pop sendiri
            const r = j.k === 'jalan' ? 0 : j.k === 'feri' ? 1 : j.k === 'pesawat' ? 2 : -1;
            const p = r < 0 ? popIn(f, T.sungai + 60 + i * 15) : 1;
            const asal0 = r < 0 ? null : asal(r);
            const x = asal0 ? lerp(asal0.x, 960, keMap) : 960, y = asal0 ? lerp(asal0.y, j.y, keMap) : j.y, d = asal0 ? lerp(asal0.d, KD, keMap) : KD;
            return (
              <React.Fragment key={j.k}>
                {/* 01: ikon kartu "fondasi" mengecil di lingkarannya selama dibawa, lalu ikon jalan kaki (jalur 1 peta) tumbuh — lingkaran sama */}
                {r === 0 && f < T.sekarang + 70
                  ? <Bulat x={x} y={y} d={d} warna={j.warna} ikon="fondasi" p={1} ikonP={popOut(f, T.sekarang + 40)} />
                  : <Kendaraan x={x} y={y} d={d} warna={j.warna} ikon={j.ikon} cermin={j.cermin} p={p} alfa={j.k === 'speedboat' ? redupSpeed : 1} cincin={keMap > 0.5}
                    ikonP={r === 0 ? popIn(f, T.sekarang + 100) : 1} />}
                {nomor[j.k] ? <Nomor cincin x={960 - KD * 0.36} y={j.y - KD * 0.36} n={j.k === 'jalan' ? 1 : j.k === 'feri' ? 2 : 3} warna={j.warna} p={popIn(f, nomor[j.k])} d={50} /> : null}
              </React.Fragment>);
          })}
          {/* pesawat dicentang saat "baru belajar terbang" (urutan selesai) */}
          <Lencana x={960} y={PESAWAT_Y} d={KD} p={popIn(f, T.terbang + 20)} warna={CEK} ikon="tersedia" besar={52} />
          {/* investor + pijakan POP sebagai satu kelompok SESUDAH sungai muncul (pola S01 23 Okt) */}
          {popIn(f, T.sungai + 10) > 0 ? (
            <div style={{ position: 'absolute', inset: 0, transformOrigin: `${ORANG.x}px 546px`, transform: popIn(f, T.sungai + 10) < 0.9999 ? `scale(${skalaPop(popIn(f, T.sungai + 10))})` : undefined }}>
              <Pijakan x={PIJAKAN.x} y={PIJAKAN.y} a={PIJAKAN.a} p={1} />
              <KarakterLingkar pose={MURID_BIRU} x={ORANG.x} y={ORANG.y} D={ORANG.D} s={1} warna={B.orange} cermin />
            </div>) : null}
          {/* "…sesuai dengan kemampuan kita sekarang" */}
          <Chip x={ORANG.x + 28} y={729} teks="Sesuai kemampuanmu" ikon="kemampuan" warna={B.blue} p={popIn(f, T.kemampuanB)} size={26} />
          {/* (penjelajah titik oranye DILEPAS 24 Okt — Simon: "Lingkaran orange yang bergerak itu seharusnya tidak ada") */}
        </div>
        </KonteksBayanganGelap.Provider>) : null}
    </>);
};
