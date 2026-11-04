import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { gayaIsi, kamera, keLayar, type Kam } from '../kamera';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { B, CORET, F, R, io, mixHex, rgba } from '../theme';
import { Icon, MODE_UKUR, Sorot, geserSorot, WordText, cin, glass, lerp } from '../parts/kit';
import { popIn } from '../parts/pop';
import { SimpulBab } from '../parts/rantai';
import { PETA } from '../parts/peta';
import { BAB } from '../s01/data';
import { INSTRUMEN13 } from '../s13/Scene13';

/**
 * RANGKUMAN — naskah REVISI 16 Okt, Scene 09 (kunci batas s12). Kolom VISUAL kosong; NOTE Simon: "tabel rangkuman utama … setiap aset
 * dibandingkan berdasarkan historical return, sumber return, tingkat kesulitan, volatilitas, dan potensi risiko". TEXT "Beda aset / beda
 * sumber return / beda karakter". 16 Okt (malam): naskah menghapus "seberapa sulit investasinya" (kolom Kesulitan + suaranya, VO v6) dan Simon
 * mengirim acuan "Ringkasan Aset Investasi" (9 aset × Return/thn · Sumber Return · Volatilitas · Risiko) → data & susunan = acuan itu; sorot
 * hijau acuan → oranye brand. Versi sebelumnya (10 instrumen + Kesulitan + lencana sumber): _arsip/sebelum-hapus-kesulitan-16okt/Scene12.tsx.
 * Alur: isi Saham menyusut ke simpul bab 06 di PETA BAB (enam bab berdampingan) → simpul meluncur jadi ikon baris → kolom terisi satu per
 * satu tepat di kalimatnya → "Unggul di semua hal" dicoret. Keluar = masker ke simpul instrumen pembuka Penutup.
 */
export const S12 = BATAS.s12;
export const IDE_S12_AWAL = S12;

// Simon 16 Okt (malam): kalimat "seberapa sulit investasinya," DIHAPUS dari naskah & VO (v6) → tinggal dua "seberapa": volatilitas · risiko
// VO v7 (Simon 16 Okt): "Ada yang menghasilkan cash flow," → rekaman baru "Ada yang menghasilkan dividen, kupon, atau bunga" — chip arus kas
// muncul DI KATANYA masing-masing (Dividen · Kupon · Bunga; Sewa tak disebut → sesudah "bunga")
const [semua, taruh, perbedaannya, dividen, kupon, bunga, perubahan, keduanya, ret, sbVol, sbRisiko, tidak, unggul, semuanya] =
  urut(['semua', 'taruh', 'perbedaannya', 'dividen', 'kupon', 'bunga', 'perubahan', 'keduanya', 'return', 'seberapa', 'seberapa', 'tidak',
    'unggul', 'semuanya'], S12);
const T_ARUS: Record<NonNullable<Baris['arus']>, number> = { Dividen: dividen, Kupon: kupon, Bunga: bunga, Sewa: bunga + 20 };

const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── data tabel Simon 16 Okt (malam) "kurang lebihnya nanti tampilannya seperti ini" (acuan "Ringkasan Aset Investasi"): kolom Aset ·
 *  Return/thn (angka) · Sumber Return (chip teks) · Volatilitas · Risiko (3 segmen, .5 = setengah). Kolom Kesulitan & baris Tabungan DIHAPUS,
 *  angka & segmen persis acuan. Warna: sorot hijau acuan → oranye brand (baris Saham & RD Saham; RD Indeks oranye muda), segmen lain hitam. ── */
type Sumber = 'cash' | 'harga' | 'dua';
type Baris = { nama: string; ikon: KunciIkon; bab: number; ret: string; arus?: 'Dividen' | 'Kupon' | 'Bunga' | 'Sewa'; harga?: boolean;
  v: [number, number]; sorot?: 'kuat' | 'muda' };
/** Simon 21 Okt — acuan baru "Ringkasan semua aset (总结)@1x.png" (04_Asset/brief-21okt/): urutan (Emas ke baris 2) & angka return baru
 *  (RD Saham 11,5 % · RD Indeks 9,9 % · kisaran 6–8 / 5–7 / 3–5 / 3–5 %) PERSIS acuan; sumber, volatilitas, risiko & sorot sama; warna tetap
 *  ("tapi warna pertahankan seperti yang sudah kamu buat sebelumnya"). Versi 16 Okt: _arsip/sebelum-revisi-21okt/src/s12/Scene12.tsx. */
const BARIS: Baris[] = [
  { nama: 'Saham', ikon: 'saham', bab: 5, ret: '15,2%', arus: 'Dividen', harga: true, v: [3, 3], sorot: 'kuat' },
  { nama: 'Emas', ikon: 'emas', bab: 1, ret: '14,2%', harga: true, v: [2, 2] },
  { nama: 'Reksa Dana Saham', ikon: 'rdSaham', bab: 4, ret: '11,5%', arus: 'Dividen', harga: true, v: [3, 2.5], sorot: 'kuat' },
  { nama: 'Reksa Dana Indeks', ikon: 'rdIndeks', bab: 4, ret: '9,9%', arus: 'Dividen', harga: true, v: [2, 2], sorot: 'muda' },
  { nama: 'Obligasi Pemerintah', ikon: 'obligasi', bab: 3, ret: '6–8%', arus: 'Kupon', harga: true, v: [1, 1] },
  { nama: 'Reksa Dana Pendapatan Tetap', ikon: 'rdPendapatanTetap', bab: 4, ret: '5–7%', arus: 'Kupon', harga: true, v: [2, 2] },
  { nama: 'Reksa Dana Pasar Uang', ikon: 'rdPasarUang', bab: 4, ret: '3–5%', arus: 'Bunga', v: [1, 1] },
  { nama: 'Deposito', ikon: 'deposito', bab: 0, ret: '3–5%', arus: 'Bunga', v: [0.5, 1] },
  { nama: 'Properti', ikon: 'properti', bab: 2, ret: '3,5%', arus: 'Sewa', harga: true, v: [1, 2] },
];
const jenisSumber = (b: Baris): Sumber => (b.arus && b.harga ? 'dua' : b.arus ? 'cash' : 'harga');
/** baris pertama tiap bab = tujuan simpul peta yang meluncur (bab lain di baris itu pop) */
const BARIS_BAB = BAB.map((_, k) => BARIS.findIndex((b) => b.bab === k));

/* ── geometri tabel (dunia) — lebar teks TERUKUR (Plus Jakarta Sans ExtraBold 28 / Bold 20): nama terpanjang s.d. 633 · angka return ≤ 94 ·
 *  kepala "Return/thn" 117 · sumber terlebar "Dividen + Perubahan harga" 331 · segmen 174; jarak antarkolom 56 ── */
const T = { x0: 150, x1: 1680, kepala: 204, garis: 230, y0: 266, h: 64 };
const rowY = (i: number) => T.y0 + i * T.h;
const ID = 36; // ikon baris (simpul peta mendarat di sini)
const X = { ikon: T.x0 + 36, nama: T.x0 + 70, ret: 689, sumber: 862, kol: [1249, 1479] };
const SEG = { w: 54, h: 16, gap: 6 };
/** baris polos (acuan); hanya baris SOROT (Saham, RD Saham) berkartu bernada oranye — sudut 12 */
const KARTU = { h: T.h - 10, r: 12, x0: T.x0 - 10 };
const KOLOM = ['Volatilitas', 'Risiko'];
const WARNA_SEG = { kuat: B.orange, muda: B.orangeLite, biasa: B.night } as const;
/** chip sumber return (acuan): arus kas (Dividen · Kupon · Bunga · Sewa) = biru muda · Perubahan harga = oranye muda */
const CHIP = { h: 34, px: 14, fs: 20, plus: 34 };

/* ── LEBAR BERTAHAP + PANEL — Simon 16 Okt: "jika bagian ini tidak digunakan mungkin bisa kamu hapus saja agar secara visual bisa diperbesar
 *  lagi" (ujung kanan kartu kosong menunggu kolom yang belum muncul) + "tambahkan pannel juga untuk discene 9 seperti discene 1".
 *  Kartu & panel hanya selebar kolom yang SUDAH muncul (aturan tanpa slot kosong); tiap kolom baru → kartu memanjang 60f dipusatkan di
 *  kalimatnya (isi kolom terisi bersamaan), dan kamera tabel (geser + zoom) menjaga panel di tengah & sebesar mungkin. ── */
/** waktu kolom (urutan kiri → kanan = urutan narasi): return di "perbedaannya jadi lebih jelas" · sumber di "dividen, kupon, atau bunga" (chip arus kas di katanya),
 *  chip "Perubahan harga" di "perubahan harga" · volatilitas & risiko di kalimat "seberapa …"-nya. Isi menyapu baris berjenjang 5f. */
const T_RET = perbedaannya + 10;
const T_KOL = [sbVol + 20, sbRisiko + 20];
/** kanan kartu per tahap: nama (633) · + return (kepala s.d. 806) · + sumber (1193) · + volatilitas (1423) · + risiko (1653) — ruang dalam 27 px */
const KANAN = [660, 833, 1220, 1450, 1680];
const T_TAHAP = [T_RET, dividen - 20, ...T_KOL];
const PAD = 24;
const PANEL = { x0: KARTU.x0 - PAD, y0: T.kepala - 28, y1: rowY(BARIS.length - 1) + KARTU.h / 2 + PAD };
// catatan kaki (acuan: 1 baris "Data hingga 2025 …") DI BAWAH panel (pola baris sumber Scene 01)
const BAWAH = { y: PANEL.y1 + 12, h: 24 };
const TAG = { y: BAWAH.y + BAWAH.h + 44, h: 64 }; // pusat tag "Unggul di semua hal"

/** kartu memanjang 60f MENDAHULUI isi kolomnya 20f ([t−50, t+10]; isi menyapu [t−30, t+30]) — kalau serentak, kepala & lintasan batang
 *  terpotong di tepi kartu (terukur f18900: "Sumber" terbaca "Sur") */
const MAJU = 20;
const tahapKe = (f: number) => T_TAHAP.reduce((s, t) => s + R(f, t - 30 - MAJU, t + 30 - MAJU, 0, 1, io), 0);
const kananKartu = (f: number) => { const u = tahapKe(f), i = Math.min(KANAN.length - 2, Math.floor(u)); return lerp(KANAN[i], KANAN[i + 1], u - i); };
/** kamera tabel: kotak tinta tiap keadaan → pusatnya di (960, 548) (tengah antara bawah judul + 25 dan batas subtitle 960);
 *  zoom = min(1,2 · 1712/lebar · 823/tinggi). Keadaan berganti 60f dipusatkan di waktunya. */
const LAYAR = { cy: 548, w: 1712, h: 823, zMaks: 1.2 };
const KEADAAN = [
  { t: semua, x1: KANAN[0] + PAD, y1: PANEL.y1 },
  { t: T_TAHAP[0] - MAJU, x1: KANAN[1] + PAD, y1: PANEL.y1 },
  { t: T_TAHAP[1] - MAJU, x1: KANAN[2] + PAD, y1: PANEL.y1 },
  { t: T_TAHAP[2] - MAJU, x1: KANAN[3] + PAD, y1: PANEL.y1 },
  { t: T_TAHAP[3] - MAJU, x1: KANAN[4] + PAD, y1: BAWAH.y + BAWAH.h }, // catatan kaki 1 baris muncul di kalimat Risiko
  { t: tidak + 10, x1: KANAN[4] + PAD, y1: TAG.y + TAG.h / 2 },
];
const KAM_T: Kam[] = KEADAAN.map((k) => {
  const z = Math.min(LAYAR.zMaks, LAYAR.w / (k.x1 - PANEL.x0), LAYAR.h / (k.y1 - PANEL.y0));
  return { x: 960 - (PANEL.x0 + k.x1) / 2, y: (LAYAR.cy - 540) / z + 540 - (PANEL.y0 + k.y1) / 2, z };
});
const kamTabel = (f: number): Kam => {
  let k = KAM_T[0];
  for (let i = 1; i < KEADAAN.length; i += 1) {
    const u = R(f, KEADAAN[i].t - 30, KEADAAN[i].t + 30, 0, 1, io);
    if (u <= 0) break;
    k = { x: lerp(k.x, KAM_T[i].x, u), y: lerp(k.y, KAM_T[i].y, u), z: lerp(k.z, KAM_T[i].z, u) };
  }
  return k;
};

export const Scene12: React.FC<{ f: number }> = ({ f }) => {
  if (f < S12) return null;
  // KELUAR = masker ke simpul INSTRUMEN Penutup ("Setelah memahami perbedaannya"), biru + ikon. 50f mulai BATAS.s13 (pola lama).
  if (f >= BATAS.s13 + 52) return null;
  const ex = R(f, BATAS.s13, BATAS.s13 + 50, 0, 1, io);
  const kam13 = kamera('S13', BATAS.s13 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam13, INSTRUMEN13), r: INSTRUMEN13.r * kam13.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  // peta = kamera kunci S12 (dipakai juga masker keluar Scene 08) dibekukan sebelum simpul meluncur; tabel = kamera tabel (lebar bertahap)
  const kamPeta = kamera('S12', Math.min(f, semua - 40));
  const kamT = kamTabel(f);
  const kanan = kananKartu(f), lebar = kanan - KARTU.x0;
  const panelOp = R(f, semua - 10, semua + 30, 0, 1, io);
  const T_SUMBER: Record<Sumber, number> = { cash: dividen - 10, harga: perubahan - 10, dua: keduanya - 10 };
  const bangun = (i: number) => semua + 24 + 7 * i; // baris berdampingan, berjenjang — sesudah simpul peta tiba di barisnya
  // simpul peta → ikon baris pertama babnya
  const keBaris = R(f, semua - 40, semua + 30, 0, 1, io);
  const pudarPeta = R(f, semua - 40, semua - 5, 0, 1, io); // nama peta habis sebelum panel muncul (tanpa tumpang tindih)
  // sorot kategori sumber yang sedang disebut (bingkai baris sementara, satu kategori pada satu waktu): "dividen, kupon, atau bunga" → baris berarus kas
  // (Dividen/Kupon/Bunga/Sewa) · "perubahan harga" → baris berchip Perubahan harga · "keduanya" → baris yang punya keduanya
  const fase = (a: number, b: number) => R(f, a - 10, a + 20, 0, 1, io) * (1 - R(f, b - 20, b + 10, 0, 1, io));
  const pHarga = fase(T_SUMBER.harga, T_SUMBER.dua), pDua = fase(T_SUMBER.dua, ret - 20);

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s13, BATAS.s13 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <JudulBertahap f={f} />
      {/* ═════ peta bab (tempat isi Saham menyusut): garis + nama memudar ═════ */}
      {pudarPeta < 1 ? (
        <AbsoluteFill style={gayaIsi(kamPeta)}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: 1 - pudarPeta }}>
            <line x1={PETA.x(0)} x2={PETA.x(5)} y1={PETA.y} y2={PETA.y} stroke={B.grayLite} strokeWidth={2.5} strokeDasharray="7 11" strokeLinecap="round" />
          </svg>
          {BAB.map((b, k) => (
            <div key={b.no} style={{ position: 'absolute', left: PETA.x(k) - 135, width: 270, top: PETA.y + PETA.d / 2 + 34, textAlign: 'center', lineHeight: 1.18, opacity: 1 - pudarPeta, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{b.nama}</div>))}
        </AbsoluteFill>) : null}

      <AbsoluteFill style={gayaIsi(kamT, f >= BATAS.s13 - 30)}>
        {/* ═════ PANEL (gaya panel chart Scene 01) — selebar kolom yang sudah muncul ═════ */}
        {panelOp > 0.001 ? <div style={{ position: 'absolute', left: PANEL.x0, top: PANEL.y0, width: lebar + 2 * PAD, height: PANEL.y1 - PANEL.y0, opacity: panelOp, transform: `scale(${lerp(0.97, 1, panelOp)})`, ...glass() }} /> : null}

        {/* ═════ TABEL ═════ — isi DIPOTONG di tepi kanan kartu yang sedang melebar (overflow, bukan clip-path): lintasan batang & catatan kolom
            baru tersingkap bersama kartunya, tak pernah menggantung di luar panel (terukur f19250 sebelum ini: lintasan Return + "Potensi" di luar) */}
        <div style={{ position: 'absolute', left: KARTU.x0, top: PANEL.y0, width: lebar, height: PANEL.y1 - PANEL.y0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -KARTU.x0, top: -PANEL.y0, width: 1920, height: 1080 }}>
        {/* kepala kolom (acuan "Ringkasan Aset Investasi"): rata kiri dengan isi kolomnya + garis bawah gelap selebar tabel yang sudah muncul */}
        <Kepala x={X.ikon - ID / 2} f={f} at={perbedaannya} teks="Aset" />
        <Kepala x={X.ret} f={f} at={T_RET} teks="Return/thn" />
        <Kepala x={X.sumber} f={f} at={dividen - 20} teks="Sumber Return" />
        {KOLOM.map((k, j) => <Kepala key={k} x={X.kol[j]} f={f} at={T_KOL[j]} teks={k} />)}
        <div style={{ position: 'absolute', left: 0, top: 0, width: lebar, height: 2, borderRadius: 1, background: B.night, opacity: Math.max(0.0001, Math.min(0.9999, R(f, perbedaannya - 30, perbedaannya + 10, 0, 1, io))), transform: geser(KARTU.x0, T.garis) }} />

        {BARIS.map((b, i) => {
          const pb = cin(f, bangun(i));
          const y = rowY(i);
          // ikon baris TUJUAN simpul peta: tampil begitu simpulnya tiba (keBaris = 1), walau barisnya belum mulai muncul — pindai DOM 16 Okt:
          // baris bawah (Deposito, Properti) dulu kehilangan ikonnya ±17f antara simpul mendarat dan baris terbangun
          const tujuan = BARIS_BAB[b.bab] === i;
          const ikon = <BulatKecil x={X.ikon} y={y} d={ID} col={BAB[b.bab].warna} ikon={b.ikon} s={tujuan ? (keBaris >= 1 ? 1 : 0) : popIn(f, bangun(i))} />;
          if (pb <= 0.001) return tujuan && keBaris >= 1 ? <React.Fragment key={b.nama}>{ikon}</React.Fragment> : null;
          const js = jenisSumber(b);
          // bingkai kategori sumber yang sedang disebut (warna = chip-nya; "keduanya" = turkis) — TIGA lapis, masing-masing memudar sendiri
          // (pindai jeglek 16 Okt: dulu satu bingkai dipilih → warna berganti dalam 1 frame saat kategori berpindah, f19044 / f19190)
          // bingkai arus kas menyala BERSAMA chip baris itu (dividen · kupon · bunga) — dulu semua baris berarus kas menyala di "dividen"
          // walau chip Kupon/Bunga/Sewa-nya belum ada (bingkai tanpa isi, f18940)
          const pCashBaris = b.arus ? fase(T_ARUS[b.arus] - 10, T_SUMBER.harga) : 0;
          const bingkai = [{ p: pCashBaris, c: B.blue }, { p: b.harga ? pHarga : 0, c: B.orange }, { p: js === 'dua' ? pDua : 0, c: B.turq }].filter((q) => q.p > 0.001);
          const bandSorot = b.sorot === 'kuat' ? R(f, perbedaannya - 20, perbedaannya + 40, 0, 1, io) : 0; // baris saham disorot (acuan Simon)
          const gRet = R(f, T_RET - 30 + 5 * i, T_RET + 30 + 5 * i, 0, 1, io);
          // chip arus kas pop di katanya (berjenjang 4f di antara baris sejenis); chip Perubahan harga di "perubahan harga"
          const pArus = b.arus ? popIn(f, T_ARUS[b.arus] - 10 + 4 * BARIS.slice(0, i).filter((q) => q.arus === b.arus).length) : 0;
          const pHargaChip = b.harga ? popIn(f, T_SUMBER.harga + 4 * i) : 0;
          return (
            <React.Fragment key={b.nama}>
              {/* baris POLOS (acuan); baris sorot = kartu bernada oranye, naik 14 px sambil muncul */}
              {bandSorot > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: lebar, height: KARTU.h, borderRadius: KARTU.r, opacity: Math.max(0.0001, Math.min(0.9999, pb * bandSorot)), background: mixHex(B.white, B.orange, 0.14), transform: geser(KARTU.x0, y - KARTU.h / 2 + (1 - pb) * 14) }} /> : null}
              {bingkai.map((q) => <div key={q.c} style={{ position: 'absolute', left: 0, top: 0, width: lebar, height: KARTU.h, borderRadius: KARTU.r, border: `2.5px solid ${rgba(q.c, 0.7 * q.p)}`, background: rgba(q.c, 0.07 * q.p), transform: geser(KARTU.x0, y - KARTU.h / 2) }} />)}
              {/* ikon + nama (bab yang simpulnya meluncur ke sini: ikon baru tampil saat simpul tiba) */}
              {ikon}
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(X.nama + (1 - pb) * -16, y - 17)}`, opacity: pb, whiteSpace: 'nowrap', lineHeight: 1, fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>{b.nama}</div>
              {/* return per tahun (angka acuan) */}
              {gRet > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(X.ret, y - 17 + (1 - gRet) * 12), opacity: Math.min(0.9999, gRet), whiteSpace: 'nowrap', lineHeight: 1, fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, fontVariantNumeric: 'tabular-nums' }}>{b.ret}</div> : null}
              {/* sumber return: chip arus kas di katanya + chip Perubahan harga di "perubahan harga" (chip selalu terpasang → posisi tetap) */}
              {pArus > 0.001 || pHargaChip > 0.001 ? (
                <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(X.sumber, y)} translate(0, -50%)`, display: 'flex', alignItems: 'center' }}>
                  {b.arus ? <Chip teks={b.arus} s={pArus} /> : null}
                  {b.arus && b.harga ? <span style={{ width: CHIP.plus, textAlign: 'center', fontFamily: F, fontSize: 22, fontWeight: 700, color: B.gray, opacity: Math.max(0.0001, Math.min(0.9999, pHargaChip)) }}>+</span> : null}
                  {b.harga ? <Chip teks="Perubahan harga" harga s={pHargaChip} /> : null}
                </div>) : null}
              {/* volatilitas & risiko: 3 segmen Rendah → Tinggi */}
              {b.v.map((v, j) => {
                const g = R(f, T_KOL[j] - 30 + 5 * i, T_KOL[j] + 30 + 5 * i, 0, 1, io);
                if (g <= 0.001) return null;
                return <Segmen key={j} x={X.kol[j]} y={y} nilai={v * g} col={WARNA_SEG[b.sorot ?? 'biasa']} op={Math.min(1, g * 3)} />;
              })}
            </React.Fragment>);
        })}
        </div>
        </div>

        {/* catatan kaki (acuan) — hitam (Simon 16 Okt: "disclaimer … berwarna hitam") */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(KARTU.x0, BAWAH.y + 2), opacity: cin(f, sbRisiko + 40), fontFamily: F, fontSize: 18, fontWeight: 600, color: B.night, whiteSpace: 'nowrap', lineHeight: 1.3 }}>
          Data hingga 2025. Kinerja masa lalu tidak menjamin kinerja masa depan.
        </div>

        {/* "Tidak ada satu instrumen yang unggul di semuanya" — tag piala dicoret merah */}
        <TagCoret f={f} x={(PANEL.x0 + KANAN[KANAN.length - 1] + PAD) / 2} y={TAG.y} at={tidak + 10} coretAt={semuanya} />
      </AbsoluteFill>

      {/* simpul peta MELUNCUR jadi ikon baris pertama babnya — RUANG LAYAR: dari posisi layar peta ke posisi layar ikon di kamera tabel
          (dua kamera berbeda); di keBaris = 1 ikon tabel menggantikan di titik yang sama */}
      {keBaris < 1 ? BAB.map((b, k) => {
        const a = keLayar(kamPeta, { x: PETA.x(k), y: PETA.y }), t = keLayar(kamT, { x: X.ikon, y: rowY(BARIS_BAB[k]) });
        return <SimpulBab key={b.no} x={lerp(a.x, t.x, keBaris)} y={lerp(a.y, t.y, keBaris)} d={lerp(PETA.d * kamPeta.z, ID * kamT.z, keBaris)} col={b.warna} ikon={b.ikon} isi={1} op={k === 5 ? R(f, S12 + 40, S12 + 52, 0, 1, io) : 1} />;
      }) : null}
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.blue, opacity: R(f, BATAS.s13 + 22, BATAS.s13 + 48, 0, 1, io) }} /> : null}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s13 + 34, BATAS.s13 + 48, 0, 1, io) }}><Icon name="instrumenInvestasi" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);

  /** judul TEXT tiga bagian: "Beda aset," → "beda sumber return," → "beda karakter" (disorot) */
  function JudulBertahap({ f: ff }: { f: number }) {
    if (MODE_UKUR) return null;
    const st: React.CSSProperties = { fontFamily: F, fontSize: 44, fontWeight: 800, letterSpacing: '-.02em', color: B.night };
    const h = R(ff, unggul - 30, unggul + 30, 0, 1, io);
    const bagian = [{ t: 'Beda aset,', at: perbedaannya }, { t: 'beda sumber return,', at: dividen + 10 }];
    const p3 = R(ff, ret - 30, ret + 30, 0, 1, io);
    const gs = geserSorot('beda karakter', 44);
    if (ff < perbedaannya - 40) return null;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center' }}>
        {bagian.map((b) => (
          <span key={b.t} style={{ ...st, display: 'inline-block', whiteSpace: 'pre', transform: `translateX(${gs * (1 - h)}px)` }}>
            <WordText halus f={ff} at={b.at} style={st}>{b.t}</WordText>{' '}
          </span>))}
        <span style={{ ...st, display: 'inline-block', opacity: p3, transform: `translateY(${(1 - p3) * 20}px)` }}>
          <Sorot w="beda karakter" h={h} size={44} />
        </span>
      </div>);
  }
};

/** kepala kolom (muncul di kalimat kolomnya) — gaya dashboard: kecil; Simon 16 Okt: "text judul buat warna hitam" */
const Kepala: React.FC<{ x: number; f: number; at: number; teks: string }> = ({ x, f, at, teks }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, T.kepala - 4), whiteSpace: 'nowrap', lineHeight: 1 }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: B.night }}>{teks}</WordText>
  </div>);

/** chip sumber return (acuan): arus kas = biru muda + teks Neon Blue · Perubahan harga = oranye muda + teks oranye tua; pop dari tepi kiri */
const Chip: React.FC<{ teks: string; harga?: boolean; s: number }> = ({ teks, harga, s }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', height: CHIP.h, padding: `0 ${CHIP.px}px`, borderRadius: 999, background: harga ? B.orangeWash : B.blueWash,
    color: harga ? mixHex(B.orange, B.night, 0.35) : B.blue, fontFamily: F, fontSize: CHIP.fs, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1,
    transform: `scale(${Math.max(0.0001, s)})`, transformOrigin: 'left center', opacity: Math.max(0.0001, Math.min(0.9999, s * 3)) }}>{teks}</span>);

/** tiga segmen Rendah → Tinggi; `nilai` 0..3 (pecahan = sebagian segmen terisi) */
const Segmen: React.FC<{ x: number; y: number; nilai: number; col: string; op: number }> = ({ x, y, nilai, col, op }) => (
  <svg width={3 * SEG.w + 2 * SEG.gap} height={SEG.h} style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, y - SEG.h / 2), opacity: op, overflow: 'visible' }}>
    <defs>{[0, 1, 2].map((k) => <clipPath key={k} id={`seg-${x}-${y}-${k}`}><rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w} height={SEG.h} rx={SEG.h / 2} /></clipPath>)}</defs>
    {[0, 1, 2].map((k) => {
      const isi = Math.max(0, Math.min(1, nilai - k));
      return (
        <g key={k}>
          <rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w} height={SEG.h} rx={SEG.h / 2} fill={rgba(B.night, 0.08)} />
          {isi > 0.001 ? <rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w * isi} height={SEG.h} fill={col} clipPath={`url(#seg-${x}-${y}-${k})`} /> : null}
        </g>);
    })}
  </svg>);

/** lingkaran ikon kecil */
const BulatKecil: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number }> = ({ x, y, d, col, ikon, s }) => s <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${s})` }}>
    <Icon name={ikon} size={d * 0.6} color={B.white} />
  </div>);

/** tag "Unggul di semua hal" (piala) — pop lalu dicoret merah */
const TagCoret: React.FC<{ f: number; x: number; y: number; at: number; coretAt: number }> = ({ f, x, y, at, coretAt }) => {
  const p = popIn(f, at);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  const col = mixHex(B.orange, CORET, coret);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}88` }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name="trofi" size={28} color={B.white} /></div>
      Unggul di semua hal
      <div style={{ position: 'absolute', left: 18, top: '50%', height: 4, marginTop: -2, width: `calc(${coret} * (100% - 36px))`, background: CORET, borderRadius: 2 }} />
    </div>);
};

export const S12_BEAT = { semua, taruh, perbedaannya, dividen, kupon, bunga, perubahan, keduanya, ret, sbVol, sbRisiko, tidak, unggul, semuanya };
