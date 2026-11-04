import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, io, lerp, mixHex, rgba } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Judul } from '../parts/judul';
import { Chip, denyut } from '../parts/umum';
import { Kaca, bayanganKaca, geser } from '../parts/kaca';

/**
 * SCENE 02 — IDE VISUAL VERSI 3 (Simon 13 Okt: benda & kejadian nyata, "hindari grafik kecil, simbol abstrak, dan penjelasan yang hanya
 * mengandalkan teks · akhiri dengan kedua uang terpisah jelas"):
 *   Adegan 1 — Uang untuk bulan depan: SESEORANG (murid berkemeja biru, aset Video 02) menyiapkan uang untuk membayar TAGIHAN LISTRIK bulan
 *              depan; uangnya diletakkan di samping tagihan dan tetap di sana (harus tetap tersedia).
 *   Adegan 2 — Uang untuk lima tahun lagi: ORANG YANG SAMA menabung untuk RUMAH lima tahun lagi; tabungan rumah naik-turun nilainya (angka Rp
 *              di atas tumpukan, tumpukan membesar/mengecil) sementara uang tagihan tetap — tanpa grafik.
 *   Adegan 3 — Pisahkan uang: dua WADAH — uang tagihan ke TABUNGAN (stabil, mudah diambil; foto celengan & buku tabungan), uang rumah ke
 *              INVESTASI (sesuai kebutuhan & risiko; foto investasi jangka panjang) — berakhir dengan kedua uang terpisah jelas.
 * TEXT naskah tetap: "Waktu berbeda · Tujuan berbeda" · "[Penempatan] juga berbeda". Tanpa placeholder kosong (Simon 13 Okt).
 * Waktu (kata VO, 21 dtk): A "Karena uang yang akan dipakai bulan depan, tentu nggak seharusnya diperlakukan sama" · B "dengan uang yang baru akan
 * dipakai lima tahun lagi. Waktu penggunaannya berbeda, kemampuan untuk menghadapi naik-turunnya investasi juga berbeda." · C "Jadi sebelum memilih
 * produk, pisahkan dulu uangnya berdasarkan kebutuhan."
 */

const [uang1, dipakai1, bulan, depan, tentu, seharusnya, diperlakukan, sama, dengan, uang2, baru, dipakai2, lima, tahun, waktu, penggunaannya, berbeda1, kemampuan, , , juga, berbeda2, jadi, produk, pisahkan, uangnya, berdasarkan, kebutuhan] = urut([
  'uang', 'dipakai', 'bulan', 'depan', 'tentu', 'seharusnya', 'diperlakukan', 'sama', 'dengan', 'uang', 'baru', 'dipakai', 'lima', 'tahun', 'waktu', 'penggunaannya', 'berbeda',
  'kemampuan', 'menghadapi', 'investasi', 'juga', 'berbeda', 'jadi', 'produk', 'pisahkan', 'uangnya', 'berdasarkan', 'kebutuhan'], BATAS.s2);

const T = {
  // orang masuk sesudah isi Scene 01 turun melewati tengah (S01_KELUAR s2+4…s2+64)
  orang: uang1 + 14, tagihan: bulan, uangTagihan: depan + 14, denyutTempo: [dipakai1 + 6, tentu], denyutTagihan: [seharusnya, diperlakukan, sama],
  // "DENGAN uang yang BARU AKAN DIPAKAI": orang berdenyut (dia lagi yang menyiapkan uang kedua) — isi jendela diam
  denyutOrang: [dengan, baru, dipakai2],
  uangRumah: uang2 + 10, rumah: lima, chipRumah: tahun, denyutWaktu: [waktu, penggunaannya + 10, berbeda1],
  // naik-turun cukup pelan untuk terbaca: dari "kemampuan" sampai "Jadi" (±4 dtk, tiga kali turun-naik)
  pil: kemampuan - 50, naikTurun: [kemampuan - 40, jadi], denyutBeda: [juga, berbeda2],
  judul1: waktu + 24,
  susun: jadi, denyutSusun: produk, wadah: pisahkan + 6, masuk: pisahkan + 20, labelWadah: [berdasarkan, berdasarkan + 20], denyutAkhir: kebutuhan + 10,
  judul2: pisahkan + 30, sorot2: uangnya + 30,
};

/* ── tata letak — A–B: orang di kiri, dua jalur di kanan (atas: tagihan · bawah: rumah); C: dua kolom kebutuhan → wadah ── */
const ORANG = { kiri: 330, atas: 280, h: 700 }; // foto murid_M1 696 × 1044 (tangan + uang di 0,905 · 0,254 gambar)
const ORANG_W = (ORANG.h * 696) / 1044;
const TANGAN = { x: ORANG.kiri + 0.905 * ORANG_W, y: ORANG.atas + 0.254 * ORANG.h };
const TAGIHAN = { x: 1120, y: 340, w: 300, h: 230 };
const UANG_T = { x: 1420, y: 350, w: 170 }; // uang tagihan (Rp450.000) di samping tagihan
const RUMAH = { x: 1120, y: 690, w: 360 }; // foto rumah 696 × 380
const UANG_R = { x: 1440, y: 712, w: 230 }; // tabungan rumah
const KOLOM = { L: 660, R: 1260 }; // C
const C_Y = { atas: 330, wadah: 700, label: 893 };
const WADAH = { w: 460, h: 300 };
const RASIO_UANG = 520 / 441, RASIO_RUMAH = 696 / 380;
const NILAI_T = 450_000, NILAI_R = 6_500_000;
/** nilai tabungan rumah naik-turun (tanpa nama produk): kunci 0…1 → faktor; berakhir sedikit di atas awal (bukan "pasti untung") */
const NAIK_TURUN: [number, number][] = [[0, 1], [0.18, 1.1], [0.36, 0.9], [0.55, 1.06], [0.72, 0.86], [0.88, 1.0], [1, 1.04]];
const faktor = (t: number) => {
  const j = NAIK_TURUN.findIndex(([u]) => u >= t);
  if (j <= 0) return 1;
  const [u0, v0] = NAIK_TURUN[j - 1], [u1, v1] = NAIK_TURUN[j];
  const s = (t - u0) / (u1 - u0);
  return v0 + (v1 - v0) * (0.5 - 0.5 * Math.cos(Math.PI * s));
};
const MASKER_SUBTITLE = 'linear-gradient(to bottom, #000 925px, transparent 975px)';

/** KELUAR Scene 02 = milik Scene 03 (aturan V02): wadah, kebutuhan & label keluar 60f mulai di batas ("Cara paling sederhana"); kedua uang MENYATU
 *  di tengah (posisi & ukuran tumpukan Scene 03) — Scene 03 mengambil alih tumpukan itu lalu membaginya jadi tiga. */
export const S02_KELUAR = BATAS.s3 + 30;
export const S02_GABUNG = BATAS.s3 + 50;
/** tumpukan Scene 03 (titik serah-terima): pusat & lebar */
export const TUMPUK_S3 = { x: 960, y: 540, w: 300 };

export const Scene02: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s2 || f >= BATAS.s3 + 82) return null;
  const kel = cin(f, S02_KELUAR), gab = cin(f, S02_GABUNG);
  const susun = cin(f, T.susun); // C: orang keluar, kebutuhan pindah ke kolom
  const masuk = cin(f, T.masuk); // C: uang masuk wadah
  const nt = R(f, T.naikTurun[0], T.naikTurun[1], 0, 1); // laju tetap sepanjang "naik-turunnya investasi"
  const v = faktor(nt);
  // posisi kebutuhan (A–B → C): di "Jadi" kedua kebutuhan sejajar di TENGAH layar (y 520), naik ke atas wadah saat wadah tumbuh — tengah di setiap momen
  const naikC = cin(f, T.wadah);
  const yC = lerp(520, C_Y.atas, naikC);
  const tx = lerp(TAGIHAN.x, KOLOM.L, susun), ty = lerp(TAGIHAN.y, yC, susun);
  const rx = lerp(RUMAH.x, KOLOM.R, susun), ry = lerp(RUMAH.y, yC + 6, susun), rw = lerp(RUMAH.w, 300, susun);
  // uang: A–B di samping kebutuhannya · C di kanan wadahnya · keluar menyatu di tengah
  const wadahUangDx = 118;
  const uT = { x: lerp(lerp(UANG_T.x, KOLOM.L + 250, susun), KOLOM.L + wadahUangDx, masuk), y: lerp(lerp(UANG_T.y, yC, susun), C_Y.wadah, masuk) };
  const uR = { x: lerp(lerp(UANG_R.x, KOLOM.R + 260, susun), KOLOM.R + wadahUangDx, masuk), y: lerp(lerp(UANG_R.y, yC, susun), C_Y.wadah, masuk) };
  // tabungan rumah ikut membesar/mengecil dengan nilainya (luas ∝ nilai)
  const wT = lerp(lerp(UANG_T.w, 150, susun), 170, masuk), wR = lerp(lerp(UANG_R.w * Math.sqrt(v), 170, susun), 190, masuk);
  return (
    <AbsoluteFill>
      {/* ═════════ ORANG (murid berkemeja biru) — memegang uang, menyiapkannya; keluar ke kiri di "Jadi" ═════════ */}
      {(() => {
        const p = cin(f, T.orang);
        const out = susun;
        if (p <= 0.001 || out >= 0.999) return null;
        return (
          <AbsoluteFill style={{ WebkitMaskImage: MASKER_SUBTITLE, maskImage: MASKER_SUBTITLE }}>
            <Img src={staticFile('karakter/murid_M1.webp')} style={{ position: 'absolute', left: 0, top: 0, width: ORANG_W, height: ORANG.h, maxWidth: 'none',
              opacity: Math.min(0.9999, p * (1 - out)), transformOrigin: '50% 100%',
              transform: `${geser(ORANG.kiri - 90 * (1 - p) - 220 * out, ORANG.atas + 20 * (1 - p))} scale(${1 + T.denyutOrang.reduce((a, t) => a + denyut(f, t, 0.03), 0)})` }} />
          </AbsoluteFill>);
      })()}

      {/* ═════════ C: dua wadah — Tabungan (stabil, mudah diambil) · Investasi (sesuai kebutuhan & risiko) ═════════ */}
      {(['L', 'R'] as const).map((s) => {
        const kiri = s === 'L';
        const p = popIn(f, T.wadah + (kiri ? 0 : 16)) * (1 + denyut(f, T.denyutAkhir + (kiri ? 0 : 14), 0.03)) * (1 - kel);
        if (p <= 0.001) return null;
        const x = KOLOM[s];
        const warna = kiri ? B.turq : B.orange;
        const foto = kiri ? { src: 'media/gedung/tabungan.webp', r: 600 / 505 } : { src: 'media/tugas-pertumbuhan.webp', r: 520 / 507 };
        const fw = 200;
        return (
          <React.Fragment key={`w${s}`}>
            <Kaca x={x} y={C_Y.wadah} w={WADAH.w} h={WADAH.h} p={p} warna={warna} tab="atas" tabTebal={14} rona={0.6} radius={32}>
              <Img src={staticFile(foto.src)} style={{ position: 'absolute', left: 40, top: (WADAH.h - fw / foto.r) / 2 + 4, width: fw, height: fw / foto.r, maxWidth: 'none' }} />
            </Kaca>
            <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, C_Y.label), translate: '-50% -50%', whiteSpace: 'nowrap', textAlign: 'center',
              opacity: Math.min(0.9999, R(f, T.labelWadah[kiri ? 0 : 1] - 30, T.labelWadah[kiri ? 0 : 1] + 10, 0, 1, io)) * (1 - kel) }}>
              <div style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, lineHeight: 1.1 }}>{kiri ? 'Tabungan' : 'Investasi'}</div>
              <div style={{ fontFamily: F, fontSize: 24, fontWeight: 700, color: warna, lineHeight: 1.3 }}>{kiri ? 'Stabil · mudah diambil' : 'Sesuai kebutuhan & risiko'}</div>
            </div>
          </React.Fragment>);
      })}

      {/* ═════════ KEBUTUHAN: tagihan listrik (bulan depan) · rumah (5 tahun lagi) ═════════ */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kel }}>
        <TagihanListrik x={tx} y={ty} s={popIn(f, T.tagihan) * (1 + T.denyutTagihan.reduce((a, t) => a + denyut(f, t, 0.04), 0) + denyut(f, T.denyutWaktu[0], 0.05)
          + denyut(f, T.denyutSusun, 0.04))} denyutTempo={T.denyutTempo.reduce((a, t) => a + denyut(f, t, 0.12), 0) + denyut(f, T.denyutWaktu[1], 0.12)} />
        {(() => {
          const p = popIn(f, T.rumah) * (1 + denyut(f, T.denyutWaktu[2], 0.05) + denyut(f, T.denyutSusun + 14, 0.04));
          if (p <= 0.001) return null;
          const h = rw / RASIO_RUMAH;
          return (
            <>
              <Img src={staticFile('media/gedung/rumah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: rw, height: h, maxWidth: 'none', transformOrigin: 'center',
                transform: `${geser(rx - rw / 2, ry - h / 2)} scale(${p})` }} />
              <Chip x={rx} y={ry + h / 2 + 34} teks="5 tahun lagi" ikon="kalender" warna={B.orange} size={26}
                p={popIn(f, T.chipRumah) * (1 + denyut(f, T.denyutWaktu[1] + 14, 0.08))} />
            </>);
        })()}
      </div>

      {/* ═════════ UANG — tagihan (tetap) · tabungan rumah (naik-turun) ═════════ */}
      <Uang f={f} x={uT.x} y={uT.y} w={wT} dari={TANGAN} at={T.uangTagihan} gab={gab} p={1 + denyut(f, T.denyutBeda[0], 0.06)} />
      <Uang f={f} x={uR.x} y={uR.y} w={wR} dari={TANGAN} at={T.uangRumah} gab={gab} p={1 + denyut(f, T.denyutBeda[1], 0.06)} />
      {/* nominal di atas tiap uang (B): tagihan TETAP Rp450.000 · rumah BERJALAN naik-turun ▲▼ */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - susun }}>
        <PilNominal x={UANG_T.x} y={UANG_T.y - UANG_T.w / RASIO_UANG / 2 - 34} teks={rpPenuh(NILAI_T)} arah={0} p={popIn(f, T.uangTagihan + 30)} size={26} />
        <PilNominal x={UANG_R.x} y={UANG_R.y - 150} teks={rpPenuh(Math.round((NILAI_R * v) / 10000) * 10000)} arah={Math.max(-1, Math.min(1, (v - 1) * 10))}
          p={popIn(f, T.pil)} size={28} lebarMin={250} />
      </div>

      <Judul f={f} kata={['Waktu', 'berbeda', '·', 'Tujuan', 'berbeda']} at={T.judul1} keluar={T.susun} />
      <Judul f={f} kata={['Penempatan', 'juga', 'berbeda']} sorotIdx={0} at={T.judul2} sorotAt={T.sorot2} keluar={S02_KELUAR} />
    </AbsoluteFill>);
};

/** foto uang Rupiah: terbang dari tangan orang ke tempatnya di `at`, lalu mengikuti (x, y, w); keluar → menyatu ke tumpukan Scene 03 */
const Uang: React.FC<{ f: number; x: number; y: number; w: number; dari: { x: number; y: number }; at: number; gab: number; p: number }> = ({ f, x, y, w, dari, at, gab, p }) => {
  const t = R(f, at - 30, at + 30, 0, 1, io);
  if (t <= 0.001) return null;
  const xx = lerp(lerp(dari.x, x, t), TUMPUK_S3.x, gab), yy = lerp(lerp(dari.y, y, t) - Math.sin(Math.PI * t) * 70, TUMPUK_S3.y, gab);
  const ww = lerp(lerp(70, w, t), TUMPUK_S3.w, gab);
  const h = ww / RASIO_UANG;
  return <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: ww, height: h, maxWidth: 'none', transformOrigin: 'center',
    opacity: Math.min(0.9999, R(t, 0, 0.15, 0, 1)), transform: `${geser(xx - ww / 2, yy - h / 2)} scale(${p})` }} />;
};

/** TAGIHAN LISTRIK — benda nyata, 2D flat: kepala oranye (petir + "Tagihan Listrik"), jatuh tempo "Bulan depan", total, barcode */
const TagihanListrik: React.FC<{ x: number; y: number; s: number; denyutTempo: number }> = ({ x, y, s, denyutTempo }) => {
  if (s <= 0.001) return null;
  const W = TAGIHAN.w, H = TAGIHAN.h;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: 'center', transform: `${geser(x - W / 2, y - H / 2)} scale(${s})`,
      borderRadius: 18, background: B.white, boxShadow: bayanganKaca(B.orange, 0.9), overflow: 'hidden', fontFamily: F }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 54, background: B.orange, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px' }}>
        <svg width={26} height={30} viewBox="0 0 24 24"><path d="M 13.5 2 L 4 13.5 H 11 L 9.5 22 L 20 9.5 H 13 Z" fill={B.white} /></svg>
        <span style={{ fontSize: 24, fontWeight: 800, color: B.white }}>Tagihan Listrik</span>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, top: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: B.gray }}>Jatuh tempo</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: mixHex(B.night, B.orange, Math.min(1, denyutTempo * 6)), display: 'inline-block',
          transform: `scale(${1 + denyutTempo})`, transformOrigin: 'right center' }}>Bulan depan</span>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, top: 112, height: 2, background: rgba(B.night, 0.08) }} />
      <div style={{ position: 'absolute', left: 20, right: 20, top: 124, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: B.gray }}>Total</span>
        <span style={{ fontSize: 30, fontWeight: 800, color: B.night }}>{rpPenuh(NILAI_T)}</span>
      </div>
      <svg width={W - 40} height={34} style={{ position: 'absolute', left: 20, bottom: 18 }}>
        {Array.from({ length: 38 }, (_, i) => <rect key={i} x={i * 6.9} y={0} width={(i * 7) % 3 === 0 ? 3.5 : 1.6} height={34} fill={rgba(B.night, 0.75)} />)}
      </svg>
    </div>);
};

export const S02_T = T;
