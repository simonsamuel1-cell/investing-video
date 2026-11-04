import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { ARAH, B, F, R, io, lerp, mixHex, rgba } from '../theme';
import { alfaP, Arah, Icon, opa, skalaPop, useSwipe } from './kit';
import type { KunciIkon } from '../ikon';
import { Kaca, bayanganKaca, geser, HALUS3D } from './kaca';

/**
 * BENDA NYATA (revisi 13 Okt malam, brief Simon "untuk orang awam · benda & kejadian nyata · bukan menambah teks"): kalender meja, kartu tagihan,
 * ponsel portofolio, notifikasi, stempel LUNAS, sosok berfoto, uang Rupiah. Gaya = kartu kaca rumah + referensi Simon (ref-05 kartu hari ini,
 * ref-06 invoice, ref-07 notifikasi, ref-16/17 ponsel + kartu melayang, ref-04 catatan tersemat). Posisi lewat translate3d + rotasi mikro.
 */

/* ═════════ SOSOK (foto badan penuh) ═════════ */
export type Pose = { src: string; w: number; h: number; /** bbox tinta (px gambar) */ x0: number; x1: number; y0: number; y1: number };
export const POSE = {
  /** murid berkemeja biru mengulurkan uang (V02 murid_M1) */
  muridUang: { src: 'karakter/murid_M1.webp', w: 696, h: 1044, x0: 54, x1: 677, y0: 23, y1: 1000 },
  /** murid berkemeja biru muda berpikir, tangan di dagu (foto Simon 14 Okt — Scene 02) */
  muridPikirBiru: { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, x0: 381, x1: 865, y0: 22, y1: 1326 },
  /** murid berpikir, tangan di dagu (V02 investor_tanya) */
  muridPikir: { src: 'karakter/investor_tanya.png', w: 419, h: 1433, x0: 0, x1: 417, y0: 1, y1: 1431 },
  /** murid santai, tangan di saku, menoleh (V02 murid_santai) */
  muridSantai: { src: 'karakter/murid_santai.webp', w: 696, h: 1044, x0: 195, x1: 551, y0: 23, y1: 990 },
  /** karyawan bersantai di sofa memegang HP (Scene 01) */
  sofa: { src: 'karakter/karyawan-sofa.png', w: 1672, h: 941, x0: 0, x1: 1672, y0: 30, y1: 941 },
  /** investor berjas menghadap depan */
  jas: { src: 'karakter/investor_jas_asli.webp', w: 677, h: 1200, x0: 181, x1: 505, y0: 85, y1: 1154 },
  /** investor berjas berpikir */
  jasPikir: { src: 'karakter/guru_berpikir.png', w: 414, h: 1498, x0: 0, x1: 412, y0: 3, y1: 1496 },
} satisfies Record<string, Pose>;
/** sosok berdiri: tengah tinta di x, kaki (tepi bawah tinta) di `kaki`, tinggi tinta `h` px; `p` 0…1 = swipe naik dari LUAR frame (tanpa pudar, 22 Okt) */
export const Sosok: React.FC<{ pose: Pose; x: number; kaki: number; h: number; p: number; flip?: boolean; alfa?: number }> = ({ pose, x, kaki, h, p, flip = false, alfa = 1 }) => {
  const sw = useSwipe();
  if (p <= 0.001 || alfa <= 0.001) return null;
  const k = h / (pose.y1 - pose.y0);
  const W = pose.w * k, H = pose.h * k;
  // cermin = scaleX(−1) di tempat (transform-origin tengah kotak): tinta berpindah ke W − cx → kotak digeser supaya tengah tinta TETAP di x
  const cx = ((pose.x0 + pose.x1) / 2) * k, by = pose.y1 * k, cxL = flip ? W - cx : cx;
  return (
    <Img src={staticFile(pose.src)} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none', opacity: Math.min(0.9999, alfa),
      transform: `${geser(x - cxL, kaki - by + sw(p, { x, y: kaki - h / 2, w: W, h }, 'bawah').y)}${flip ? ' scaleX(-1)' : ''}` }} />);
};
/** foto memudar di atas pita subtitle (pola Scene 01/02). 23 Okt (Simon: "dikaki orang ada potongan kasar"): dulu linear 925→975 px — ujung gradasi
 *  linear berhenti TAJAM (lereng → 0 seketika) dan terbaca sebagai garis potong di celana gelap. Kini kurva halus (smoothstep, 16 titik) 840→970 px. */
const GRAD_HALUS = Array.from({ length: 17 }, (_, i) => { const t = i / 16, a = 1 - t * t * (3 - 2 * t); return `rgba(0,0,0,${a.toFixed(3)}) ${(840 + 130 * t).toFixed(1)}px`; }).join(', ');
export const MASKER_SUBTITLE = `linear-gradient(to bottom, ${GRAD_HALUS})`;
export const TepiSubtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ WebkitMaskImage: MASKER_SUBTITLE, maskImage: MASKER_SUBTITLE }}>{children}</AbsoluteFill>);

/* ═════════ UANG RUPIAH (foto Simon) ═════════ */
export const RASIO_UANG = 520 / 441;
/** uang: `p` = MASUK = POP berporos tengah (Simon 23 Okt: "jangan animasikan uangnya dengan swipe up, pop up saja … uang dulu baru nominal");
 *  `keluar` 1→0 = swipe lewat tepi terdekat; `kecil` 1→0 = skala turun ke 0 (benda yang tak diperlukan lagi) */
export const Uang: React.FC<{ x: number; y: number; w: number; p?: number; alfa?: number; arah?: Arah; keluar?: number; kecil?: number }> =
  ({ x, y, w, p = 1, alfa = 1, arah, keluar = 1, kecil = 1 }) => {
  const sw = useSwipe();
  if (p <= 0.001 || alfa <= 0.001 || keluar <= 0.001 || kecil <= 0.001) return null;
  const h = w / RASIO_UANG;
  const o = sw(keluar, { x, y, w, h }, arah);
  const s = skalaPop(p) * skalaPop(kecil);
  return <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none', transformOrigin: 'center',
    opacity: Math.min(0.9999, alfa), transform: `${geser(x - w / 2 + o.x, y - h / 2 + o.y)} scale(${s})` }} />;
};

/* ═════════ FOTO BENDA (gaya rumah Video 02: benda nyata berlatar transparan) ═════════ */
export const FOTO = {
  rumah: { src: 'media/gedung/rumah.webp', r: 696 / 380 },
  kecil: { src: 'media/gedung/kecil.webp', r: 378 / 360 },
  menengah: { src: 'media/gedung/menengah.webp', r: 421 / 480 },
  besar: { src: 'media/gedung/besar.webp', r: 370 / 600 },
  tujuan: { src: 'media/gedung/s13_menengah.webp', r: 520 / 430 },
  tumbuh: { src: 'media/gedung/s13_pertumbuhan.webp', r: 520 / 507 },
  belanja: { src: 'media/gedung/s13_sehari.webp', r: 520 / 457 },
  darurat: { src: 'media/gedung/s13_darurat.webp', r: 520 / 400 },
  tabungan: { src: 'media/gedung/tabungan.webp', r: 600 / 505 },
  brankas: { src: 'media/gedung/brankas.webp', r: 600 / 624 },
  perusahaan: { src: 'media/perusahaan.webp', r: 389 / 480 },
  pemerintah: { src: 'media/gedung/pemerintah.webp', r: 747 / 480 },
  bank: { src: 'media/gedung/bank.webp', r: 1262 / 1166 },
  // gambar realistis buatan Simon (14 Okt, latar transparan, dipotong ke batas objek — asli di 04_Asset/realistis-simon/)
  rumahModern: { src: 'media/realistis/rumah-modern.webp', r: 1200 / 844 },
  sekolah: { src: 'media/realistis/sekolah.webp', r: 1200 / 607 },
  mobilSuv: { src: 'media/realistis/mobil-suv.webp', r: 1023 / 491 },
  meteranPln: { src: 'media/realistis/meteran-pln.webp', r: 909 / 1316 },
  atmTarik: { src: 'media/realistis/atm-tarik.webp', r: 734 / 927 },
  belanjaTas: { src: 'media/realistis/belanja.webp', r: 924 / 1190 },
  kardusKantor: { src: 'media/realistis/kardus-kantor.webp', r: 1200 / 1091 },
  sakitRs: { src: 'media/realistis/sakit-rs.webp', r: 1200 / 839 },
  orangPhk: { src: 'media/realistis/orang-phk.webp', r: 572 / 1320 },
  mobilMogok: { src: 'media/realistis/mobil-mogok.webp', r: 1200 / 799 },
  motorRusak: { src: 'media/realistis/motor-rusak.webp', r: 1200 / 812 },
  sekolahV1: { src: 'media/realistis/sekolah-v1.webp', r: 1200 / 648 },
  /** skuter abu-grafit (berkas Simon 14 Okt "Pristine graphite-silver scooter.png") — cicilan motor */
  motorSkuter: { src: 'media/realistis/motor-skuter.webp', r: 1200 / 910 },
  /** produk investasi (gambar realistis Simon 14 Okt) */
  saham: { src: 'media/realistis/saham.webp', r: 1000 / 883 },
  rdSaham: { src: 'media/realistis/rd-saham.webp', r: 1000 / 910 },
  rdIndeks: { src: 'media/realistis/rd-indeks.webp', r: 1000 / 878 },
  rdPendapatanTetap: { src: 'media/realistis/rd-pendapatan-tetap.webp', r: 1000 / 819 },
  obligasi: { src: 'media/realistis/obligasi-pemerintah.webp', r: 1000 / 864 },
  rdPasarUang: { src: 'media/realistis/rd-pasar-uang.webp', r: 1000 / 963 },
} as const;
/** foto benda berpusat (x, y) selebar w; `p` = pop dari pusat (atau dari bawah bila `dasar`) */
export const Foto: React.FC<{ k: keyof typeof FOTO; x: number; y: number; w: number; p: number; alfa?: number; dasar?: boolean; arah?: Arah;
  /** foto DI DALAM kartu: naik dari balik topeng seukuran fotonya (tetap di dalam kartu) — bukan dari tepi frame */ topeng?: boolean }> = ({ k, x, y, w, p, alfa = 1, dasar = false, arah, topeng = false }) => {
  const sw = useSwipe();
  if (p <= 0.001 || alfa <= 0.001) return null;
  const h = w / FOTO[k].r;
  // 23 Okt: foto (di kartu atau lepas) MASUK = POP berporos tengah — dulu naik dari balik topeng / swipe dari tepi (Simon: tanpa topeng; benda = pop)
  void topeng; void sw; void arah;
  const s = skalaPop(p);
  return <Img src={staticFile(FOTO[k].src)} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none', transformOrigin: dasar ? '50% 100%' : 'center',
    opacity: opa(alfa), transform: `${geser(x - w / 2, y - h / 2)}${s < 0.9999 || s > 1.0001 ? ` scale(${s})` : ''}` }} />;
};

/* ═════════ KALENDER MEJA (ref-05) — halaman berganti ═════════ */
export type Halaman = { atas: string; angka: string; bawah?: string };
/** kalender meja berpusat (x, y); `i` = indeks halaman pecahan (3,4 = antara halaman 3 dan 4, halaman lama terangkat ke atas & pudar);
 *  `lingkar` 0…1 = lingkaran tanda di angka (tanggal penting); `warna` kepala */
export const Kalender: React.FC<{ x: number; y: number; halaman: Halaman[]; i: number; p: number; warna?: string; lingkar?: number; s?: number }> =
  ({ x, y, halaman, i, p, warna = B.blue, lingkar = 0, s = 1 }) => {
    if (p <= 0.001) return null;
    const W = 230, H = 236, K = 66;
    const i0 = Math.max(0, Math.min(halaman.length - 1, Math.floor(i))), i1 = Math.min(halaman.length - 1, i0 + 1);
    const t = io(Math.max(0, Math.min(1, i - i0)));
    const keluar = Math.max(0, 1 - 2 * t), masuk = Math.max(0, 2 * t - 1);
    const isi = (h: Halaman, op: number, dy: number, key: string) => (
      <div key={key} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H - K, opacity: op, transform: `translateY(${dy}px)` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 14, textAlign: 'center', fontFamily: F, fontSize: 92, fontWeight: 800, color: B.night, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums' }}>{h.angka}</div>
        {h.bawah ? <div style={{ position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', fontFamily: F, fontSize: 24, fontWeight: 700, color: B.gray }}>{h.bawah}</div> : null}
      </div>);
    const a = halaman[i0], b = halaman[i1];
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: 'center', transform: `${geser(x - W / 2, y - H / 2)} scale(${p * s})`,
        borderRadius: 26, background: B.white, boxShadow: bayanganKaca(warna), overflow: 'hidden', fontFamily: F }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: K, background: warna }} />
        {/* bulan/tahun di kepala: silang-geser */}
        {[a, b].map((h, j) => (j === 1 && i1 === i0 ? null : (
          <div key={`k${j}`} style={{ position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontSize: 28, fontWeight: 800, color: B.white, whiteSpace: 'nowrap',
            opacity: j === 0 ? keluar : masuk, transform: `translateY(${j === 0 ? -18 * t : 18 * (1 - t)}px)` }}>{h.atas}</div>)))}
        {/* halaman lama habis di paruh pertama, halaman baru muncul di paruh kedua — dulu silang-pudar bersamaan: dua teks bertumpuk di tengah ganti */}
        {/* halaman dipotong di bawah kepala (audit 14 Okt: angka halaman lama yang terangkat sempat menembus kepala kalender 4 px) */}
        <div style={{ position: 'absolute', left: 0, top: K, width: W, height: H - K, overflow: 'hidden' }}>
          {keluar > 0.001 ? isi(a, keluar, -40 * t, 'a') : null}
          {i1 !== i0 && masuk > 0.001 ? isi(b, masuk, 40 * (1 - t), 'b') : null}
        </div>
        {/* cincin penjepit — audit 14 Okt: dulu ujung bawahnya (y 20) menyentuh tinta "Okt 2026" → cincin 22 px, teks kepala turun ke 24 (jarak ±13 px) */}
        {[W * 0.28, W * 0.72].map((cx) => <div key={cx} style={{ position: 'absolute', left: cx - 7, top: -6, width: 14, height: 22, borderRadius: 7, background: mixHex(warna, B.night, 0.35) }} />)}
        {lingkar > 0.001 ? (
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
            {/* lingkaran mendatar di sekeliling angka (dulu diputar −80°: tinggi ±72 → menabrak teks bawah "Hari ini"/"bulan depan") */}
            <ellipse cx={W / 2} cy={K + 58} rx={84} ry={50} fill="none" stroke={B.orange} strokeWidth={6} strokeLinecap="round" pathLength={1000}
              strokeDasharray={`${1000 * lingkar} 1000`} transform={`rotate(-8 ${W / 2} ${K + 58}) rotate(180 ${W / 2} ${K + 58})`} />
          </svg>) : null}
      </div>);
  };

/* ═════════ KARTU TAGIHAN (ref-06 invoice) ═════════ */
export const Tagihan: React.FC<{ x: number; y: number; judul: string; ikon: KunciIkon; warna: string; tempo: string; total: string; p: number; lunas?: number;
  sorotTempo?: number; w?: number; miring?: number; arah?: Arah }> = ({ x, y, judul, ikon, warna, tempo, total, p, lunas = 0, sorotTempo = 0, w = 320, miring = 0, arah }) => {
  const sw = useSwipe();
  if (p <= 0.001) return null;
  const W = w, H = 236;
  const o = sw(p, { x, y, w: W, h: H }, arah);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: 'center', transform: `${geser(x - W / 2 + o.x, y - H / 2 + o.y)} rotate(${miring}deg)`, opacity: opa(alfaP(p)),
      borderRadius: 20, background: B.white, boxShadow: bayanganKaca(warna, 0.9), fontFamily: F }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 58, background: warna, borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 18px' }}>
        <Icon name={ikon} size={30} color={B.white} />
        <span style={{ fontSize: 24, fontWeight: 800, color: B.white, whiteSpace: 'nowrap' }}>{judul}</span>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, top: 74, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: B.gray }}>Jatuh tempo</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: mixHex(B.night, B.orange, Math.min(1, sorotTempo)), display: 'inline-block', transformOrigin: 'right center',
          }}>{tempo}</span>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, top: 116, height: 2, background: rgba(B.night, 0.08) }} />
      <div style={{ position: 'absolute', left: 20, right: 20, top: 130, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: B.gray }}>Total</span>
        <span style={{ fontSize: 30, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>{total}</span>
      </div>
      <svg width={W - 40} height={34} style={{ position: 'absolute', left: 20, bottom: 18 }}>
        {Array.from({ length: Math.floor((W - 40) / 7) }, (_, i) => <rect key={i} x={i * 7} y={0} width={(i * 7) % 3 === 0 ? 3.5 : 1.6} height={34} fill={rgba(B.night, 0.7)} />)}
      </svg>
      <Stempel x={W / 2 + 30} y={H - 36} p={lunas} />
    </div>);
};
/** stempel LUNAS hijau miring (pop) — penanda kejadian "sudah dibayar" */
export const Stempel: React.FC<{ x: number; y: number; p: number; teks?: string; warna?: string }> = ({ x, y, p, teks = 'LUNAS', warna = ARAH.naik }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) rotate(-12deg) scale(${skalaPop(p)})`, border: `5px solid ${warna}`, borderRadius: 14,
    padding: '6px 18px', fontFamily: F, fontSize: 34, fontWeight: 800, color: warna, letterSpacing: '.06em', background: rgba(B.white, 0.85), whiteSpace: 'nowrap',
    opacity: Math.min(0.9999, p) }}>{teks}</div>);

/* ═════════ KARTU NILAI INVESTASI (ref-05/06 kartu melayang) — Simon 13 Okt: "jangan gunakan ponsel selain untuk scene 1" ═════════ */
export const KARTU_NILAI = { w: 440, h: 330 };
const jt = (v: number, desimal = false) => {
  const t = (Math.round(v / 1e5) / 10).toFixed(1).replace('.', ',');
  return `Rp${desimal ? t : t.replace(',0', '')} jt`;
};
/** kartu kaca berpusat (x, y): ikon + nama produk, nominal besar berwarna (▲ hijau / ▼ merah) + pil persen; `jual` 0…1 = tombol JUAL muncul,
 *  `tekan` 0…1 = ditekan; `samar` 0…1 = nominal kabur (tidak bisa diketahui); anak = isi tambahan (koordinat dalam kartu) */
export const KartuNilai: React.FC<{ x: number; y: number; p: number; nilai: number; awal: number; ikon: KunciIkon; nama: string; warna: string; s?: number;
  jual?: number; tekan?: number; samar?: number; label?: string; labelB?: string; labelMix?: number; children?: React.ReactNode;
  /** nilai yang BERJALAN: selalu satu desimal (pindai 14 Okt: "Rp5 jt" ↔ "Rp4,9 jt" = lebar angka meloncat 1 frame) */ desimal?: boolean }> =
  ({ x, y, p, nilai, awal, ikon, nama, warna, s = 1, jual = 0, tekan = 0, samar = 0, label = 'Nilai investasi', labelB, labelMix = 0, children, desimal = false }) => {
    if (p <= 0.001) return null;
    const { w } = KARTU_NILAI;
    const h = KARTU_NILAI.h + (jual > 0.001 ? 100 * Math.min(1, jual) : 0);
    const d = (nilai - awal) / awal;
    const arah = Math.max(-1, Math.min(1, d * 12));
    const col = arah >= 0 ? mixHex(B.night, ARAH.naik, arah) : mixHex(B.night, ARAH.turun, -arah);
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: 'center', transform: `${geser(x - w / 2, y - KARTU_NILAI.h / 2)} scale(${p * s})${HALUS3D}`,
        borderRadius: 32, background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`, boxShadow: bayanganKaca(warna), fontFamily: F }}>
        <div style={{ position: 'absolute', left: 26, right: 26, top: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 62, height: 62, borderRadius: 18, background: warna, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={ikon} size={38} color={B.white} /></div>
          <div style={{ fontSize: 28, fontWeight: 800, color: B.night, lineHeight: 1.12 }}>{nama}</div>
        </div>
        <div style={{ position: 'absolute', left: 26, right: 26, top: 106, height: 2, background: rgba(B.night, 0.07) }} />
        {/* label → labelB silang-pudar (paruh pertama hilang, paruh kedua muncul) */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 126, textAlign: 'center', fontSize: 22, fontWeight: 700, color: B.gray,
          opacity: labelB ? Math.max(0.0001, 1 - 2 * labelMix) : undefined }}>{label}</div>
        {labelB && labelMix > 0.5 ? <div style={{ position: 'absolute', left: 0, right: 0, top: 126, textAlign: 'center', fontSize: 22, fontWeight: 700, color: B.gray,
          opacity: Math.min(0.9999, 2 * labelMix - 1) }}>{labelB}</div> : null}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontSize: 72, fontWeight: 800, color: col, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          filter: samar > 0.001 ? `blur(${7 * samar}px)` : undefined }}>{jt(nilai, desimal)}</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 254, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, background: rgba(col, 0.12), fontSize: 26, fontWeight: 800, color: col,
            fontVariantNumeric: 'tabular-nums', opacity: Math.max(0.0001, Math.min(0.9999, (Math.abs(arah) - 0.02) / 0.12) * (1 - Math.min(1, samar * 2))) }}>
            <svg width={20} height={16} viewBox="0 0 22 18"><path d={d >= 0 ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} /></svg>
            {`${Math.round(Math.abs(d) * 100) === 0 ? '' : d >= 0 ? '+' : '−'}${Math.abs(Math.round(d * 100))}%`}
          </div>
        </div>
        {jual > 0.001 ? (
          <div style={{ position: 'absolute', left: 30, right: 30, top: KARTU_NILAI.h - 6, height: 78, borderRadius: 22, background: mixHex(ARAH.turun, B.night, 0.25 * tekan),
            display: 'grid', placeItems: 'center', fontSize: 32, fontWeight: 800, color: B.white, letterSpacing: '.08em', opacity: Math.min(0.9999, jual),
            transform: `scale(${(0.9 + 0.1 * Math.min(1, jual)) * (1 - 0.06 * Math.sin(Math.PI * Math.min(1, tekan)))})`, boxShadow: `0 14px 26px -12px ${ARAH.turun}` }}>JUAL</div>) : null}
        {children}
      </div>);
  };
/** kartu daftar kaca dengan judul (pengganti layar ponsel untuk daftar produk) — isi = anak, koordinat dalam kartu */
export const KartuDaftar: React.FC<{ x: number; y: number; w: number; h: number; p: number; judul: string; warna?: string; children?: React.ReactNode }> =
  ({ x, y, w, h, p, judul, warna = B.blue, children }) => { const o = useSwipe()(p, { x, y, w, h }); return p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: 'center', transform: geser(x - w / 2 + o.x, y - h / 2 + o.y), opacity: opa(alfaP(p)), borderRadius: 34,
      background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.88)})`, boxShadow: bayanganKaca(warna), fontFamily: F }}>
      <div style={{ position: 'absolute', left: 28, top: 26, fontSize: 28, fontWeight: 800, color: B.night }}>{judul}</div>
      {children}
    </div>); }

/* ═════════ KARTU BARIS (ref-10) — dipakai Scene 06 · 09 · 15 revisi ═════════ */
export const BARIS = { w: 360, h: 132 };
/** kartu baris (ref-10): ikon bulat + judul + keterangan, rata kiri */
export const KartuBaris: React.FC<{ x: number; y: number; p: number; ikon: KunciIkon; warna: string; judul: string; ket: string; alfa?: number; ketWarna?: string; w?: number; ketAlfa?: number; foto?: keyof typeof FOTO }> =
  ({ x, y, p, ikon, warna, judul, ket, alfa = 1, ketWarna = B.gray, w = BARIS.w, ketAlfa = 1, foto }) => { const o = useSwipe()(p, { x, y, w, h: BARIS.h }); return p <= 0.001 || alfa <= 0.001 ? null : (
    <>
      <Kaca x={x} y={y} w={w} h={BARIS.h} p={p} warna={warna} tab="kiri" tabTebal={12} radius={26} alfa={alfa} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: BARIS.h, transformOrigin: 'center', transform: geser(x - w / 2 + o.x, y - BARIS.h / 2 + o.y), // isi ikut kotak Kaca-nya (tepi swipe sama)
        opacity: Math.min(0.9999, alfaP(p, alfa)), display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px 0 34px', boxSizing: 'border-box', fontFamily: F }}>
        {foto
          ? <Img src={staticFile(FOTO[foto].src)} style={{ width: 108, height: 120, objectFit: 'contain', flex: 'none' }} />
          : <div style={{ width: 82, height: 82, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={ikon} size={46} color={B.white} /></div>}
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: B.night }}>{judul}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: ketWarna, fontVariantNumeric: 'tabular-nums', opacity: ketAlfa < 1 ? Math.max(0.0001, ketAlfa) : undefined }}>{ket}</div>
        </div>
      </div>
    </>); }


/* ═════════ NOTIFIKASI (ref-07) ═════════ */
export const Notifikasi: React.FC<{ x: number; y: number; p: number; ikon: KunciIkon; warna: string; judul: string; isi: string; w?: number }> = ({ x, y, p, ikon, warna, judul, isi, w = 420 }) => { const o = useSwipe()(p, { x, y, w, h: 88 }); return (
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, transformOrigin: 'center', transform: geser(x - w / 2 + o.x, y - 44 + o.y), opacity: opa(alfaP(p)), borderRadius: 24,
      background: rgba(B.white, 0.96), boxShadow: bayanganKaca(warna), display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', boxSizing: 'border-box', fontFamily: F }}>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: warna, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={ikon} size={32} color={B.white} /></div>
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: B.night }}>{judul}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: warna }}>{isi}</div>
      </div>
    </div>)); }

/* ═════════ PIN (ref-04 catatan tersemat) ═════════ */
export const Pin: React.FC<{ x: number; y: number; warna: string; p: number }> = ({ x, y, warna, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${skalaPop(p)})` }}>
    <div style={{ width: 30, height: 30, borderRadius: '50%', background: warna, boxShadow: `0 6px 10px -3px ${rgba(B.night, 0.45)}, inset -4px -4px 0 ${rgba(B.night, 0.15)}` }} />
  </div>);

/** pengukur waktu: helper interpolasi 0…1 dengan easing rumah */
export const g01 = (f: number, a: number, b: number) => R(f, a, b, 0, 1, io);
export const campur = lerp;
