import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { B, F, R, io, lerp, mixHex, rgba } from '../theme';
import { cin, Icon, popOut, WordText } from '../parts/kit';
import { Judul } from '../parts/judul';
import { popIn } from '../parts/pop';
import type { KunciIkon } from '../ikon';
import { BATAS } from '../batas';
import { rpPenuh } from '../parts/nominal';

/**
 * SCENE 01 — IDE VISUAL (13 Okt). Brief = kolom VISUAL + TEXT naskah Simon (04_Asset/Naskah-Lengkap-Simon.md) + arahan Simon 13 Okt:
 *   · tata letak & aset = mockup Simon (HP di tangan, karyawan di sofa, awan pikiran kanan-atas)
 *   · "ponselnya hanya muncul pada script 'Gaji, bonus, atau THR baru saja masuk.', dan untuk script 'Biasanya, … kapan akan saya pakai?'
 *      gunakan adegan orang disofa saja"
 *   TEXT    "Jangan buru-buru investasi" · "Tanya dulu: uang ini kapan akan dipakai?"
 * Empat ketukan (tiap bagian naskah > 5 dtk dipecah):
 *   A  "Gaji, bonus, atau THR baru saja masuk."           HP DI TANGAN (POV) di tengah: LAYAR KUNCI, notifikasi transfer bank bertumpuk Gaji → Bonus → THR (pop di katanya, nominal tetap)
 *   B  "Biasanya, pertanyaan pertama … ke mana?"         ZOOM-OUT dari HP ke karyawan di sofa (resep zoom-out V10); titik pikiran → awan:
 *                                                         THR ("uang ini") → 4 instrumen "Ke mana?"
 *   C  "Tapi sebelum memilih produk investasi, …"         tangan stop di instrumen (redup) · judul TEXT 1 · instrumen keluar → satu "?" → oranye di "penting"
 *   D  "“Uang ini, kapan akan saya pakai?”"              "?" → kalender + "Kapan dipakai?" · judul TEXT 2
 * Semua waktu = onset kata VO (src/beats.ts `urut`), tanjakan 60f DIPUSATKAN di kata, pop easeOutBack, selain pop = inOut cubic.
 */

/* ── kata pemicu — dicari BERURUTAN, tanpa ambang frame tetap ── */
const [gaji, bonus, thr, , biasanya, muncul, uang1, diinvestasikan, mana,
  sebelum, memilih, investasi, satu, penting, uang2, kapan, pakai] = urut([
  'gaji', 'bonus', 'thr', 'masuk', 'biasanya', 'muncul', 'uang', 'diinvestasikan', 'mana',
  'sebelum', 'memilih', 'investasi', 'satu', 'penting', 'uang', 'kapan', 'pakai']);

/* ═════════ HP DI TANGAN (fase A saja) — aset Simon "Hand Holding Blank Smartphone Mockup.png": bidang layar putihnya DILUBANGI
 * (scripts/lubangi-layar.py → public/hp/tangan-hp-bingkai.png; Simon: "masking hpnya kurang pas dan juga ada space putih disekitar nya") dan isi
 * layar diletakkan DI BELAKANG bingkai — bezel & dynamic island asli yang membingkai. Lubang: x 403–802 di baris tengah, y 158–1007, miring −0,57°.
 * Isi layar = rect lubang + 3 px tiap sisi, koordinat 377 px diskalakan. ═════════ */
const TANGAN = { w: 1024, h: 1536, pusat: { x: 602, y: 582 }, layar: { cx: 602.5, cy: 582.5, w: 406, h: 855, r: 53, miring: -0.57 } };
const HP = { SW: 377, SH: Math.round((TANGAN.layar.h * 377) / TANGAN.layar.w) }; // 794
const SKL = TANGAN.layar.w / HP.SW;
const LAYAR_X0 = TANGAN.layar.cx - TANGAN.layar.w / 2, LAYAR_Y0 = TANGAN.layar.cy - TANGAN.layar.h / 2;
/** HP di tengah layar, besar (pusat layar HP di (960, 540), skala aset 0,9) */
const HP_A = { cx: 960, cy: 540, s: 0.9 };

/* ═════════ KARYAWAN DI SOFA (fase B–D) — aset Simon "Thoughtful man with smartphone and thought bubble.png" (1672 × 941) → public/karakter/karyawan-sofa.png.
 * Adegan sendirian → kelompok [sofa | awan] berpusat di x 960 (sofa terpotong tepi bawah seperti mockup): skala 0,78, kiri 308, atas 430 →
 * sofa x 357–1562, kepala (aset 760, 150) di (901, 547), puncak kepala y 461, tepi kanan kepala x 983. HP di tangan karyawan (aset ±975, 395) =
 * titik tuju zoom-out dari HP fase A (POV → orangnya). ═════════ */
const SOFA = { w: 1672, h: 941, s: 0.78, x: 308, y: 430 };
/** pusat kelompok sofa (poros skala saat adegan sofa masuk) */
const PUSAT_SOFA = { x: 960, y: 640 };
/** awan pikiran (bentuk awan Video 02) di kanan-atas kepala: 600 × 392 (adegan sendirian → diperbesar), tepi kiri 997 (14 px di kanan kepala),
 *  puncak y ±168 (39 px di bawah judul); di tinggi zona logo (y ≤ 204) tinta awan berhenti di x ±1460 < 1464. Pusat tinta tepi awan = (x+1, y−4) (V02) */
const AWAN = { x: 1297, y: 372, w: 600, h: 392 };
const PUSAT_AWAN = { x: AWAN.x + 1, y: AWAN.y - 4 };
/** dua titik pikiran dari kepala (kanan) ke awan (kiri-bawah) — besar dekat awan, kecil dekat kepala (mockup Simon) */
const TITIK = [{ x: 1061, y: 521, r: 18 }, { x: 1017, y: 549, r: 11 }];

/* ── waktu ── */
const NOTIF: { judul: string; nilai: number; ikon: KunciIkon; warna: string; at: number }[] = [
  { judul: 'Gaji masuk', nilai: 6_500_000, ikon: 'gaji', warna: B.blue, at: gaji },
  { judul: 'Bonus masuk', nilai: 1_500_000, ikon: 'bonus', warna: B.orange, at: bonus },
  { judul: 'THR masuk', nilai: 6_500_000, ikon: 'thr', warna: B.turq, at: thr },
];
const T = {
  tarik: biasanya + 30, // HP DITARIK keluar ke kanan sambil berputar, adegan sofa muncul (60f, dipusatkan 30f sesudah "Biasanya")
  titik: muncul + 4, // titik kecil (dekat kepala) lalu besar — sesudah zoom-out mendarat, sebelum awan
  awan: muncul + 34, // "pertanyaan … yang MUNCUL": awan tumbuh sesudah titik; THR menyusul di "Uang ini" tanpa jeda awan kosong (Simon V02 8 Okt: "hapus saja awan kosong ini")
  thrAwan: uang1 + 8, // "Uang ini" = THR (yang sama dengan notifikasi di HP)
  panahB: diinvestasikan,
  instrumen: diinvestasikan + 14, // 4 instrumen pop berjenjang 12f
  label1: mana,
  stop: sebelum + 14, // "sebelum memilih produk": tangan stop di instrumen, instrumen meredup
  judul1: memilih + 24, judul1Sorot: investasi + 20,
  tanya: satu, // isi awan → satu "?"
  penting, // "?" terisi oranye
  judul2: uang2 + 24, judul2Sorot: kapan + 12,
  kalender: kapan,
  dipakai: pakai, // kalender berdenyut
};

/* ═════════ util ═════════ */
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
/** denyut 7 % (40f) di kata pemicu — bahasa "denyut" peta bab V02 */
const denyut = (f: number, at: number) => 0.07 * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));

/** foto (tangan-HP, sofa) memudar di atas pita subtitle (subtitle y ±986–1030) */
const MASKER_SUBTITLE = 'linear-gradient(to bottom, #000 925px, transparent 975px)';
/** KELUAR Scene 01 = milik Scene 02 (aturan V02): isi turun keluar layar (pola V02 S01 "swipe ke bawah"), judul memudar ke atas — 60f dipusatkan
 *  34f sesudah batas (mulai tepat di "Karena", f1125). Latar tidak ikut bergeser. */
export const S01_KELUAR = BATAS.s2 + 34;
export const Scene01: React.FC<{ f: number }> = ({ f }) => {
  const turun = cin(f, S01_KELUAR);
  if (turun >= 0.999) return null;
  // Simon 13 Okt: "transisinya hp swipe ke kanan, seperti tangannya ditarik, jadi bukan hanya swipe tambahkan sedikit efect rotasi"
  // → HP di tangan meluncur keluar ke KANAN sambil berputar searah jarum jam (poros di pergelangan), adegan sofa muncul di belakangnya
  const z = cin(f, T.tarik);
  return (
    <AbsoluteFill>
     <AbsoluteFill style={{ transform: geser(0, 1080 * turun) }}>
      {/* Simon 13 Okt "subtittlenya tidak terbaca" (subtitle di atas tangan / celana gelap): foto memudar 925 → 975 di atas pita subtitle —
          solusi yang sama dengan badan guru Video 02 (Scene 01 adegan pertanyaan) */}
      <AbsoluteFill style={{ WebkitMaskImage: MASKER_SUBTITLE, maskImage: MASKER_SUBTITLE }}>
      {/* ═════════ KARYAWAN di sofa — MEMBESAR 0,9 → 1 saat masuk dari adegan ponsel (Simon 13 Okt: "orang duduk di sofa itu kamu perkecil ketika
          transisi dengan scene ponsel, seharusnya dia membesar"; dulu 1,06 → 1) ═════════ */}
      {z > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: R(z, 0, 0.7, 0, 1), transformOrigin: `${PUSAT_SOFA.x}px ${PUSAT_SOFA.y}px`, transform: `scale(${lerp(0.9, 1, z)})` }}>
          <Img src={staticFile('karakter/karyawan-sofa.png')} style={{ position: 'absolute', left: 0, top: 0, width: SOFA.w * SOFA.s, height: SOFA.h * SOFA.s, maxWidth: 'none',
            transform: geser(SOFA.x, SOFA.y) }} />
        </div>) : null}
      {/* ═════════ HP DI TANGAN (fase A) — mengecil ke arah HP karyawan & memudar ═════════ */}
      {z < 0.999 ? <HPTangan f={f} z={z} /> : null}
      </AbsoluteFill>

      {/* ═════════ AWAN PIKIRAN ═════════ */}
      {TITIK.map((d, i) => {
        const q = popIn(f, T.titik + 10 * (TITIK.length - 1 - i)); // dari kepala ke awan
        return q > 0.001 ? <div key={i} style={{ position: 'absolute', left: d.x - d.r, top: d.y - d.r, width: 2 * d.r, height: 2 * d.r, borderRadius: '50%',
          background: B.white, border: `3px solid ${B.grayLite}`, transform: `scale(${q})` }} /> : null;
      })}
      <IsiAwan f={f} />
     </AbsoluteFill>

      {/* ═════════ JUDUL (kolom TEXT naskah) — tidak dirender saat mode ukur ═════════ */}
      <Judul f={f} kata={['Jangan', 'buru-buru', 'investasi']} sorotIdx={1} at={T.judul1} sorotAt={T.judul1Sorot} keluar={T.judul2 - 20} />
      <Judul f={f} kata={['Tanya', 'dulu:', 'uang', 'ini', 'kapan', 'akan', 'dipakai?']} sorotIdx={4} at={T.judul2} sorotAt={T.judul2Sorot} keluar={S01_KELUAR} />
    </AbsoluteFill>);
};

/** HP di tangan: isi layar DI BELAKANG bingkai berlubang. `z` = ditarik keluar: geser ke kanan 1.560 px (seluruh tangan lewat tepi kanan) +
 *  rotasi 0 → 16° searah jarum jam berporos di PERGELANGAN (aset ±(300, 1536)) — tangan yang ditarik, bukan sekadar geser */
const POROS_TARIK = { x: 300, y: 1536 };
const HPTangan: React.FC<{ f: number; z: number }> = ({ f, z }) => {
  const L = TANGAN.layar;
  const cx = HP_A.cx + 1560 * z, cy = HP_A.cy, s = HP_A.s;
  const P0 = POROS_TARIK;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: TANGAN.w, height: TANGAN.h, transformOrigin: '0 0', willChange: 'transform',
      transform: `${geser(cx - TANGAN.pusat.x * s, cy - TANGAN.pusat.y * s)} scale(${s}) translate(${P0.x}px, ${P0.y}px) rotate(${16 * z}deg) translate(${-P0.x}px, ${-P0.y}px)` }}>
      <div style={{ position: 'absolute', left: LAYAR_X0, top: LAYAR_Y0, width: L.w, height: L.h, borderRadius: L.r, overflow: 'hidden', background: '#000',
        transform: `rotate(${L.miring}deg)` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: HP.SW, height: HP.SH, transformOrigin: '0 0', transform: `scale(${SKL})` }}>
          <LayarKunci f={f} />
          <NotifBank f={f} />
        </div>
      </div>
      <Img src={staticFile('hp/tangan-hp-bingkai.png')} style={{ position: 'absolute', left: 0, top: 0, width: TANGAN.w, height: TANGAN.h, maxWidth: 'none' }} />
    </div>);
};

/** NOTIFIKASI TRANSFER BANK BERTUMPUK — Simon 13 Okt: "gunakan 1 notif yang bertumpuk seperti contohku tadi, dan jangan dianimasikan
 *  nominalnya, buat seperti notifikasi transfer dari bank" lalu "notifnya muncul bertumpuk: pertama gaji, lalu di atas notif gaji muncul bonus,
 *  kemudian muncul THR". Tumpukan ala layar kunci iPhone di posisi acuan (atas tombol senter/kamera): kartu TERBARU di depan, kartu lama mundur
 *  ke belakang (turun 10 px & mengecil 6 % per lapis, isinya memudar → hanya tepi bawahnya yang menyembul). Kartu baru turun-memudar 60f
 *  dipusatkan 15f sesudah katanya. Nominal TETAP. Aplikasi bank GENERIK (ikon gedung bank, tanpa merek); kalimat ala notifikasi pencatatan
 *  bank: "Pemasukan sebesar Rp… di kategori Gaji/Bonus/THR". */
const KARTU_NOTIF = { x: 12, y: 596, w: HP.SW - 24, h: 96, r: 24 };
const ISI_NOTIF = ['Gaji', 'Bonus', 'THR'];
const NotifBank: React.FC<{ f: number }> = ({ f }) => {
  const K = KARTU_NOTIF;
  return (
    <>
      {NOTIF.map((n, i) => {
        // MUNCUL = pop easeOutBack 60f (Simon 13 Okt: "animasi pop up dengan ease out back hanya ada ketika notifnya muncul"), dipusatkan 15f
        // sesudah katanya; tanpa denyut/pop lain sesudahnya ("jangan tambahkan animasi pop up di akhir")
        const p = popIn(f, n.at + 15);
        if (p <= 0.001) return null;
        // kedalaman = jumlah notifikasi sesudahnya yang sudah masuk (bergeser bersamaan dengan kartu baru)
        const dalam = NOTIF.slice(i + 1).reduce((s2, m) => s2 + cin(f, m.at + 15), 0);
        if (dalam >= 2.999) return null;
        return (
          <div key={n.judul} style={{ position: 'absolute', left: K.x, top: K.y, width: K.w, height: K.h, borderRadius: K.r, transformOrigin: '50% 50%', zIndex: 10 + i,
            // kartu PEKAT (bukan tembus) & muncul cepat (35 % awal tanjakan), isi kartu lama memudar di 40 % awal → teks dua kartu tak pernah bertumpuk
            transform: `${geser(0, 10 * dalam)} scale(${p * (1 - 0.06 * dalam)})`, opacity: Math.min(0.9999, R(f, n.at + 15 - 30, n.at + 15 - 12, 0, 1)),
            background: mixHex(B.white, B.blue, 0.06 + 0.12 * Math.min(1, dalam)), boxShadow: `0 10px 24px -12px ${rgba(B.night, 0.45)}, inset 0 0 0 1px ${rgba(B.white, 0.5)}`,
            display: 'flex', alignItems: 'flex-start', gap: 11, padding: '13px 14px 0', boxSizing: 'border-box', fontFamily: F }}>
            <div style={{ display: 'contents' }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: B.blue, display: 'grid', placeItems: 'center', flex: 'none', marginTop: 4,
                opacity: 1 - R(dalam, 0, 0.4, 0, 1) }}>
                <Icon name="aplikasiBank" size={26} color={B.white} />
              </div>
              <div style={{ flex: 1, lineHeight: 1.22, color: B.night, opacity: 1 - R(dalam, 0, 0.4, 0, 1) }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Dana Masuk</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 1 }}>Pemasukan sebesar {rpPenuh(n.nilai)},00 di kategori {ISI_NOTIF[i]}.</div>
              </div>
              <div style={{ position: 'absolute', right: 14, top: 13, fontSize: 11, fontWeight: 600, color: rgba(B.night, 0.5), opacity: 1 - R(dalam, 0, 0.4, 0, 1) }}>baru saja</div>
            </div>
          </div>);
      })}
    </>);
};

/* ═════════ LAYAR KUNCI (Simon 13 Okt, acuan screenshot lockscreen iPhone) — tata letak acuan, teks Indonesia, warna brand:
 *  "Gesek ke atas untuk membuka" · jam besar · sapaan + cuaca · notifikasi (komponen Notif) · senter | "n Notifikasi" | kamera.
 *  Wallpaper buram = gradien radial warna brand di atas Midnight (tanpa filter blur: raster ulang tiap frame). Koordinat layar 377 × 794. ═════════ */
const PUTIH_REDUP = rgba(B.white, 0.78);
const LayarKunci: React.FC<{ f: number }> = ({ f }) => {
  const n = NOTIF.reduce((s, m) => s + (f >= m.at ? 1 : 0), 0);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: HP.SW, height: HP.SH, overflow: 'hidden', fontFamily: F, color: B.white,
      background: [
        `radial-gradient(70% 38% at 30% 6%, ${rgba(B.turq, 0.75)} 0%, ${rgba(B.turq, 0)} 100%)`,
        `radial-gradient(60% 30% at 85% 30%, ${rgba(B.blue, 0.7)} 0%, ${rgba(B.blue, 0)} 100%)`,
        `radial-gradient(75% 30% at 25% 52%, ${rgba(B.orange, 0.42)} 0%, ${rgba(B.orange, 0)} 100%)`,
        `radial-gradient(80% 34% at 70% 76%, ${rgba(B.turq, 0.5)} 0%, ${rgba(B.turq, 0)} 100%)`,
        `radial-gradient(70% 30% at 20% 96%, ${rgba(B.blue, 0.65)} 0%, ${rgba(B.blue, 0)} 100%)`,
        `linear-gradient(180deg, ${mixHex(B.night, B.blue, 0.28)} 0%, ${mixHex(B.night, B.blue, 0.16)} 55%, ${mixHex(B.night, B.blue, 0.24)} 100%)`].join(', ') }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 58, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>Gesek ke atas untuk membuka</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 78, textAlign: 'center', fontSize: 104, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', color: rgba(B.white, 0.96) }}>06:30</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 362, textAlign: 'center', fontSize: 30, fontWeight: 600 }}>Selamat Pagi</div>
      <div style={{ position: 'absolute', left: 44, right: 44, top: 406, textAlign: 'center', fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: PUTIH_REDUP }}>
        Sebagian besar cerah hari ini. Saat ini 27°; tertinggi 32°.</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 452, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <svg width={46} height={46} viewBox="-23 -23 46 46">
          <circle r={10} fill={B.orange} />
          {Array.from({ length: 8 }, (_, k) => <line key={k} x1={0} y1={-15} x2={0} y2={-20} stroke={B.orange} strokeWidth={3.4} strokeLinecap="round" transform={`rotate(${45 * k})`} />)}
        </svg>
        <span style={{ fontSize: 44, fontWeight: 600, lineHeight: 1 }}>27°</span>
      </div>
      {/* senter · jumlah notifikasi · kamera */}
      {[44, HP.SW - 44].map((x, k) => (
        <div key={k} style={{ position: 'absolute', left: x - 25, top: 730, width: 50, height: 50, borderRadius: '50%', background: rgba(B.night, 0.45), display: 'grid', placeItems: 'center' }}>
          {k === 0
            ? <svg width={22} height={26} viewBox="0 0 22 26"><path d="M 4 2 H 18 V 7 L 14 12 V 24 H 8 V 12 L 4 7 Z" fill={B.white} /><circle cx={11} cy={16} r={1.6} fill={B.night} /></svg>
            : <svg width={26} height={22} viewBox="0 0 26 22"><path d="M 2 6 H 8 L 10 3 H 16 L 18 6 H 24 V 20 H 2 Z" fill={B.white} /><circle cx={13} cy={12.5} r={4.6} fill={B.night} /><circle cx={13} cy={12.5} r={2.8} fill={B.white} /></svg>}
        </div>))}
      {n > 0 ? <div style={{ position: 'absolute', left: 0, right: 0, top: 747, textAlign: 'center', fontSize: 13, fontWeight: 600, color: PUTIH_REDUP }}>● {n} Notifikasi</div> : null}
    </div>);
};

/* ═════════ awan pikiran (bentuk V02) + isinya ═════════ */
const AWAN_BENTUK: [number, number, number, number][] = [ // cx, cy, rx, ry (kotak acuan 400 × 284)
  [60, 140, 58, 58], [135, 82, 72, 72], [250, 72, 78, 78], [338, 145, 62, 62], [262, 210, 70, 70], [140, 205, 75, 75], [200, 145, 140, 95]];
const Awan: React.FC<{ s: number }> = ({ s }) => {
  const bentuk = (props: React.SVGProps<SVGEllipseElement>) => AWAN_BENTUK.map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} vectorEffect="non-scaling-stroke" {...props} />);
  return (
    <svg width={AWAN.w} height={AWAN.h} viewBox="0 0 400 284" preserveAspectRatio="none" style={{ position: 'absolute', left: AWAN.x - AWAN.w / 2, top: AWAN.y - AWAN.h / 2, overflow: 'visible',
      transform: `scale(${s})`, transformOrigin: 'center' }}>
      <g transform="translate(0 14)">{bentuk({ fill: B.blue, opacity: 0.07 })}</g>
      <g>{bentuk({ fill: B.white, stroke: B.grayLite, strokeWidth: 6 })}</g>
      <g>{bentuk({ fill: B.white })}</g>
    </svg>);
};

export const INSTRUMEN: { ikon: KunciIkon; warna: string }[] = [
  { ikon: 'saham', warna: B.blue }, { ikon: 'reksaDana', warna: B.orange }, { ikon: 'emas', warna: B.turq }, { ikon: 'obligasi', warna: B.blueLite }];
/** ISI AWAN = "Uang ini → ?": THR di kiri (tetap sepanjang adegan) · sisi kanan berganti: 4 instrumen ("ke mana?") → satu "?" ("satu
 *  pertanyaan … jauh lebih penting") → kalender ("kapan?"). Baris isi + label dipusatkan di pusat tinta awan. */
const BESAR = 120, KECIL = 76, KECIL_GAP = 12; // ×1,15 bersama awan
/** label di bawah kisi 2 × 2 (setengah tinggi kisi 71 + 14); blok (kisi atas … label bawah, 199 px) berpusat di pusat tinta awan */
const LABEL_DY = KECIL + KECIL_GAP / 2 + 14;
const BARIS_Y = PUSAT_AWAN.y - 32, LABEL_Y = BARIS_Y + LABEL_DY;
const KIRI_X = PUSAT_AWAN.x - 152, KANAN_X = PUSAT_AWAN.x + 127;
const grid = (k: number) => ({ x: KANAN_X + ((k % 2) - 0.5) * (KECIL + KECIL_GAP), y: BARIS_Y + (Math.floor(k / 2) - 0.5) * (KECIL + KECIL_GAP) });
/** panah putus THR → sisi kanan: dari tepi lingkaran THR + 14 sampai tepi kotak kanan − 18 */
const PANAH = { x1: KIRI_X + BESAR / 2 + 14, x2: KANAN_X - (KECIL + KECIL_GAP / 2) - 16 };

const Bulat: React.FC<{ x: number; y: number; d: number; warna: string; ikon: KunciIkon; s: number; ikonK?: number }> = ({ x, y, d, warna, ikon, s, ikonK = 0.6 }) =>
  s <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center',
      transform: `scale(${s})`, boxShadow: `0 10px 22px -10px ${warna}cc` }}>
      <Icon name={ikon} size={d * ikonK} color={B.white} />
    </div>);

const Label: React.FC<{ f: number; at: number; teks: string; op?: number }> = ({ f, at, teks, op = 1 }) => op <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: PUSAT_AWAN.x - 260, width: 520, top: LABEL_Y, textAlign: 'center', whiteSpace: 'nowrap', opacity: op }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);

const IsiAwan: React.FC<{ f: number }> = ({ f }) => {
  const awan = popIn(f, T.awan);
  if (awan <= 0.001) return null;
  const thrP = popIn(f, T.thrAwan);
  const panah = R(f, T.panahB - 30, T.panahB + 30, 0, 1, io);
  // B → C: empat instrumen keluar (pop out berjenjang) di "satu pertanyaan", "?" masuk di tempatnya
  const keluarB = (k: number) => popOut(f, T.tanya - 34 + 6 * k); // habis sebelum "?" tumbuh (tanpa tumpang tindih)
  const labelB = 1 - cin(f, T.tanya - 20);
  const stop = popIn(f, T.stop) * popOut(f, T.tanya - 34);
  const tanya = popIn(f, T.tanya + 34);
  const isi = cin(f, T.penting); // "jauh lebih penting": slot abu putus-putus → oranye pekat
  // D: kalender di tempat "?" ; "?" mengecil jadi lencana di kanan-atas kalender
  const kalP = popIn(f, T.kalender);
  const keD = cin(f, T.kalender);
  const tanyaD = lerp(152, 52, keD), tanyaX = lerp(KANAN_X, KANAN_X + BESAR / 2 - 6, keD), tanyaY = lerp(BARIS_Y, BARIS_Y - BESAR / 2 + 6, keD);
  return (
    <>
      <Awan s={awan} />
      {/* "Uang ini" = UANG (Simon 13 Okt: "ganti icon ini dengan uang" — dulu ikon hadiah THR): foto tumpukan Rupiah (aset uang Scene 02–04) utuh di atas
          lingkaran turkis, gaya foto-di-lingkaran V02 */}
      {thrP > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `translate3d(${KIRI_X}px, ${BARIS_Y + 0.03}px, 0) rotate(0.001deg) scale(${thrP})` }}>
          <div style={{ position: 'absolute', left: -BESAR / 2, top: -BESAR / 2, width: BESAR, height: BESAR, borderRadius: '50%', background: B.turq, boxShadow: `0 10px 22px -10px ${B.turq}cc` }} />
          <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: -BESAR * 0.525, top: -(BESAR * 1.05) / (520 / 441) / 2, width: BESAR * 1.05, height: (BESAR * 1.05) / (520 / 441), maxWidth: 'none' }} />
        </div>) : null}
      {panah > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <line x1={PANAH.x1} x2={lerp(PANAH.x1, PANAH.x2 - 10, panah)} y1={BARIS_Y} y2={BARIS_Y} stroke={B.blue} strokeWidth={2.5} strokeDasharray="7 11" strokeLinecap="round" opacity={0.92} />
          <path d={`M ${PANAH.x2} ${BARIS_Y} l -14 -9 l 0 18 z`} fill={B.blue} opacity={R(panah, 0.85, 1, 0, 0.92)} />
        </svg>) : null}
      {/* "sebelum memilih produk": instrumen meredup + tangan stop oranye di sudut kisi (pengganti jari yang berhenti di HP) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.55 * cin(f, T.stop) }}>
        {INSTRUMEN.map((m, k) => (
          <Bulat key={m.ikon} {...grid(k)} d={KECIL} warna={m.warna} ikon={m.ikon} s={popIn(f, T.instrumen + 12 * k) * keluarB(k)} />))}
      </div>
      {stop > 0.001 ? (
        <div style={{ position: 'absolute', left: KANAN_X + KECIL + KECIL_GAP / 2 - 33, top: BARIS_Y - KECIL - KECIL_GAP / 2 - 33, width: 66, height: 66, borderRadius: '50%',
          background: B.orange, border: `3px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${stop})`, boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
          <Icon name="berhenti" size={38} color={B.white} />
        </div>) : null}
      <Label f={f} at={T.label1} teks="Ke mana?" op={labelB} />
      <Bulat x={KANAN_X} y={BARIS_Y} d={BESAR} warna={B.blue} ikon="kalender" s={kalP * (1 + denyut(f, T.dipakai))} ikonK={0.56} />
      {f >= T.kalender - 40 ? <Label f={f} at={T.kalender + 16} teks="Kapan dipakai?" /> : null}
      {/* satu "?" — slot putus-putus abu → oranye ("jauh lebih penting") → lencana kecil di kalender (D) */}
      {tanya > 0.001 ? (
        <div style={{ position: 'absolute', left: tanyaX - tanyaD / 2, top: tanyaY - tanyaD / 2, width: tanyaD, height: tanyaD, borderRadius: '50%', boxSizing: 'border-box',
          background: isi > 0.001 ? rgba(B.orange, isi) : B.white, border: `3px ${isi > 0.5 ? 'solid' : 'dashed'} ${isi > 0.5 ? B.white : B.grayLite}`,
          transform: `scale(${tanya * (1 + denyut(f, T.penting + 20))})`, display: 'grid', placeItems: 'center',
          fontFamily: F, fontWeight: 800, fontSize: tanyaD * 0.52, lineHeight: 1, color: isi > 0.5 ? B.white : B.grayLite, boxShadow: isi > 0.001 ? `0 12px 28px -10px ${rgba(B.orange, 0.8 * isi)}` : undefined }}>
          ?
        </div>) : null}
    </>);
};

export const S01_T = T;
