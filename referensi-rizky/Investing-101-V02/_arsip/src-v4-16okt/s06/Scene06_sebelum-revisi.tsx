import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { ARAH, B, F, GAP, HOUSE, LINE, R, io, mixHex, WARNA } from '../theme';
import { Icon, WordText, grow, lerp } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Konektor, SimpulBab, denyut } from '../parts/rantai';
import { Gedung, lebarGedung, type KunciGedung } from '../parts/gedung';
import { INVESTOR_JAS, KarakterLingkar, MURID_S06 } from '../parts/karakter';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { Vinyet } from '../parts/vinyet';
import { LembarUang, TumpukanUang, busur } from '../parts/uang';
import { Judul } from '../parts/judul';
import { PilNominal, rpJuta, rpJutaKoma, tanda } from '../parts/nominal';

/**
 * SCENE 06 — OBLIGASI. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "INVESTOR → LENDS MONEY TO GOVERNMENT / COMPANY → COUPON → MATURITY → PRINCIPAL REPAYMENT"
 *   TEXT   "Obligasi / return utamanya dari kupon"
 * Revisi 7 Okt (Simon): (1) PERPINDAHAN = peta bab (isi Scene 05 menyusut ke simpul bab 03, slot bab 04 terisi, simpulnya ke
 * tengah); (2) PERCABANGAN seperti Properti — Investor → Obligasi → Pemerintah / Perusahaan (dulu satu garis lurus);
 * (3) ADEGAN PENDUKUNG TANPA TEKS BARU (ikon kupon, waktu): V1 garis waktu berkala — kalender melompat per periode, tiap
 * periode kupon jatuh ke investor, jatuh tempo → pokok kembali; REKAP di diagram — kupon mengalir dari penerbit ke investor
 * ("sumber return utamanya … bunga"); V2 dijual sebelum jatuh tempo — kalender berhenti di tengah, sisa periode hangus,
 * harga bergerak naik (hijau) / turun (merah), digerakkan suku bunga & kondisi pasar. Teks lama (Hari ini, Jatuh tempo,
 * Kupon berkala, Pokok kembali, Jual, Harga naik/turun, Suku bunga, Kondisi pasar) PINDAH ke adegan yang menggambarkannya.
 * (4) waktu muncul = 18f sebelum frasanya (`muncul`), jarak teks 16 px, kamera pusat, pop berporos di tengah.
 * Revisi 8 Okt (Simon): "investor menerima pembayaran bunga atau kupon secara berkala — visualnya belum cukup jelas" → V1 baru: tiap
 * periode KUPON terbang dari obligasi ke investor dan MENUMPUK; jatuh tempo → tumpukan POKOK (bundel hijau) kembali.
 * Uang dipinjamkan = lembar hijau (aset Simon); kupon TETAP ikon kupon (Simon: "jangan ganti ke coin untuk obligasi"). Sisipan memakai latar penuh berona lain (V1 krim, V2 ungu),
 * menutup → latar biru adegan tersingkap. Nomor bab dihapus.
 */
export const S6 = BATAS.s6;
export const IDE_S06_AWAL = S6;

const [obligasi, kita, uang, pemerintah, perusahaan, imbalannya, investor, /* tempo */, pokok, jadi, utamanya, bunga2, tapi, dijual,
  sebelum, tempo2, harganya, naik, turun, tergantung] = urut(['obligasi', 'kita', 'uang', 'pemerintah', 'perusahaan', 'imbalannya',
  'investor', 'tempo', 'pokok', 'jadi', 'utamanya', 'bunga', 'tapi', 'dijual', 'sebelum', 'tempo', 'harganya', 'naik', 'turun',
  'tergantung'], S6);
/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;

/* ── geometri diagram (cermin Properti): Investor ← kiri · Obligasi di tengah · Pemerintah / Perusahaan bercabang ke kanan ── */
export const OBL = { x: 960, y: 540, d: 200 };
const TD = 110;
/** INVESTOR = karakter murid (Simon 12 Okt; daftar guru & murid 9 Okt): lingkaran oranye Ø170 bergaya Scene 01 (dulu ikon Ø110), kepala
 *  menyembul keluar, menoleh ke Obligasi. Pose = berdiri santai tangan di saku ("ganti dengan ini saja", dulu M1 menyodorkan uang) */
const INV = { x: 580, y: 540, d: 170 };
/* Simon 9 Okt: "ini buat adegan obligasi untuk pemerintahan dan perusahaan. stylenya sama seperti yang disaham" → cabang = GEDUNG Simon
 * (dulu ikon Ø110). Gaya lingkaran-masker Saham dicoba, tapi gedung pemerintah lebar (rasio 1,56): "lebih besar dari lingkaran" + atas
 * tidak terpotong + bawah tetap dimasker tidak bisa sekaligus (sayap di luar lingkaran terpotong mendatar di garis tengah) → pilihan
 * Simon "kalau tidak bisa, hapus saja lingkaran masking untuk kedua gedung diobligasi": kedua gedung UTUH tanpa lingkaran, "labelnya
 * taro bawah saja". (x, y) = pusat kotak gedung, w × h = ukuran tampil; penghubung berhenti di tepi kotak gedung (+GAP). */
/* Cek 12 Okt (wilayah aman): pada zoom 1,35 kolom kanan setinggi 553 px dunia (747 layar) → bila susunan di tengah, atap & bendera gedung
 * Pemerintah masuk zona logo (y 166 < 204) ±5,7 dtk. Kolom dirapatkan: Pemerintah y 370 → 392, h 164 → 156; Perusahaan y 680 → 658,
 * h 230 → 215 → tinggi kolom 498 px dunia (672 layar) = pas di antara zona logo dan tengah; label Pemerintah ↔ gedung Perusahaan 35 px. */
const CABANG: { x: number; y: number; w: number; h: number; gedung: KunciGedung; teks: string; kata: number }[] = [
  { x: 1290, y: 392, w: lebarGedung('pemerintah', 156), h: 156, gedung: 'pemerintah', teks: 'Pemerintah', kata: pemerintah },
  { x: 1290, y: 658, w: lebarGedung('perusahaan', 215), h: 215, gedung: 'perusahaan', teks: 'Perusahaan', kata: perusahaan },
];
/** ujung penghubung di tepi kotak gedung (diperlebar GAP), di sepanjang garis dari pangkal ke pusat kotak */
const keKotak = (x1: number, y1: number, c: { x: number; y: number; w: number; h: number }) => {
  const ux = x1 - c.x, uy = y1 - c.y, k = Math.min((c.w / 2 + GAP) / Math.abs(ux || 1e-6), (c.h / 2 + GAP) / Math.abs(uy || 1e-6));
  return { x1, y1, x2: c.x + ux * k, y2: c.y + uy * k };
};
const JARAK = 16; // teks ke tepi elemennya (standar komponen)
const KE_CABANG = CABANG.map((c) => keKotak(OBL.x + OBL.d / 2 + GAP, OBL.y, c));
const INV_OBL = { x1: INV.x + INV.d / 2 + GAP, y1: INV.y, x2: OBL.x - OBL.d / 2 - GAP, y2: OBL.y };

/* ── waktu (frame global) ── */
const ISI = M('obligasi', obligasi); // slot bab 04 terisi
const TENGAH = ISI + 90; // PembukaBab: simpul tiba di tengah pada isiAt+90
const P_INV = M('kita', kita); // klausa "kita meminjamkan uang kepada pemerintah atau perusahaan": susunan berjenjang 20f
const P_CAB = [P_INV + 20, P_INV + 40]; // jenjang standar 20f: tak ada momen 'investor sendirian' yang menggeser pusat isi
const IMBAL = A0('imbalannya', imbalannya); // kupon pertama mengalir balik ke investor
const V1 = { buka: A0('investor', investor), tutup: A0('jadi', jadi) - 30 };
const REKAP = A0('jadi', jadi) + 13; // gelombang kupon di diagram (sesudah V1 menutup)
const V2 = { buka: A0('tapi', tapi) };

export const Scene06: React.FC<{ f: number }> = ({ f }) => {
  if (f < S6) return null;
  // KELUAR = milik Scene 07 (perpindahan seperti Scene 01–03): MASKER LINGKARAN — seluruh isi menyusut ke simpul bab 04
  // (Obligasi) di peta bab pembuka Scene 07, berubah biru (warna bab 04) + ikonnya, lalu peta mengambil alih. 50f mulai BATAS.s7.
  if (f >= BATAS.s7 + 52) return null;
  const ex = R(f, BATAS.s7, BATAS.s7 + 50, 0, 1, io);
  const kam7 = kamera('S07', BATAS.s7 + 50); // simpul bab 04 digambar Scene 07 di dalam kameranya → masker mendarat tepat di sana
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam7, SIMPUL_PETA(3)), r: SIMPUL_PETA(3).r * kam7.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6); // isi menyusut lebih lambat dari lingkarannya → terpotong bertahap
  const diagram = 1; // sisipan berlatar penuh: diagram tertutup, tidak perlu diredupkan
  const kam = kamera('S06', f);
  const sudahTengah = f >= TENGAH;

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS peta bab yang baru */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s7, BATAS.s7 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* ISI — kamera (translate3d + rotasi mikro); judul digambar SESUDAHNYA supaya tetap di atas latar sisipan */}
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s7 - 30)}>
        {/* ═════ pembuka bab: peta bab → simpul bab 04 ke tengah ═════ */}
        <PembukaBab f={f} s0={S6} k={3} isiAt={ISI} tengah={OBL} selesai={TENGAH} />

        {/* ═════ DIAGRAM (diredupkan saat adegan tambahan terbuka) ═════ */}
        <AbsoluteFill style={{ opacity: diagram }}>
          {/* nomor & nama bab — sesudah simpul tiba di tengah */}
          <div style={{ position: 'absolute', left: OBL.x - 200, width: 400, top: OBL.y + OBL.d / 2 + JARAK, textAlign: 'center', lineHeight: 1 }}>
            <WordText halus f={f} at={TENGAH + 20} style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>Obligasi</WordText>
          </div>
          {sudahTengah ? <SimpulBab x={OBL.x} y={OBL.y} d={OBL.d} col={B.blue} ikon="obligasi" isi={1} /> : null}

          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <Konektor {...INV_OBL} g={grow(f, P_INV + 20)} col={B.blue} />
            {KE_CABANG.map((e, i) => <Konektor key={i} {...e} g={grow(f, P_CAB[i] - 20)} col={[WARNA.turkisMuda, WARNA.langit][i]} />)}
          </svg>
          {/* slot "?" Investor & kedua cabang muncul BERSAMA label Obligasi (bahasa slot S05/S13): tapak diagram lengkap sejak simpul tiba →
              tidak berat ke kiri saat Investor pop 20–40f sebelum cabang (terukur −150 px) dan tidak +27 px saat Obligasi sendirian */}
          {/* slot cabang = KOTAK putus-putus seukuran gedung + labelnya (gedung tanpa lingkaran), + slot PIL label "Investor" (lebar label
              terukur 119 px) → tapak susunan sama sejak slot muncul, kamera diam (dulu label Investor menambah 120 px di kiri saat pop) */}
          {[{ x: INV.x, y: INV.y, at: P_INV, w: INV.d, h: INV.d, r: '50%' }, { x: INV.x - INV.d / 2 - JARAK - 119 / 2, y: INV.y, at: P_INV + 10, w: 119, h: 40, r: '999px' },
            ...CABANG.map((c, i) => ({ x: c.x, y: c.y + (JARAK + 36) / 2, at: P_CAB[i], w: c.w, h: c.h + JARAK + 36, r: '24px' }))].map((sl, i) => {
            const sp = popIn(f, TENGAH + 20), op = Math.min(1, sp) * (1 - R(f, sl.at - 10, sl.at + 10, 0, 1, io)); // pudar saat ikonnya sudah ±95 % (dulu mulai at−20: ikon masih kecil → tapak kanan menyusut sesaat, −100 px)
            return op > 0.001 ? <div key={`slot${i}`} style={{ position: 'absolute', left: sl.x - sl.w / 2, top: sl.y - sl.h / 2, width: sl.w, height: sl.h, borderRadius: sl.r, border: `3px dashed ${B.grayLite}`, background: B.white, boxSizing: 'border-box', opacity: op, transform: `scale(${Math.min(0.99996, sp)})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: TD * 0.36, fontWeight: 800, color: B.grayLite }}>{sl.r === '999px' ? null : '?'}</div> : null;
          })}
          <KarakterLingkar pose={MURID_S06} x={INV.x} y={INV.y} D={INV.d} s={popIn(f, P_INV)} warna={B.orange} />
          {popIn(f, P_INV) > 0.001 ? (
            <div style={{ position: 'absolute', right: 1920 - (INV.x - INV.d / 2 - JARAK), top: INV.y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', textAlign: 'right' }}>
              <WordText halus f={f} at={P_INV + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>Investor</WordText>
            </div>) : null}
          {/* Simon 9 Okt: "Jadi sumber return utamanya datang dari pendapatan bunga" — tiap kupon yang tiba di investor MENUMPUK di bawahnya
              (tumpukan kupon = return-nya); dulu lencana kecil + kupon yang lenyap di tepi lingkaran */}
          {GEL.map((t0, k) => f >= t0 + 80 ? <Kupon key={`t${k}`} x={TUMPUK_KUPON.x} y={TUMPUK_KUPON.y(k)} d={TUMPUK_KUPON.d} /> : null)}
          {/* nominal: kupon terkumpul (Rp1,5 jt per kupon) di kiri tumpukannya */}
          <PilNominal x={TUMPUK_KUPON.x - TUMPUK_KUPON.d / 2 - JARAK} y={TUMPUK_KUPON.y(1)} jangkar="kanan" teks={rpJutaKoma(1.5 * GEL.reduce((a, t0) => a + R(f, t0 + 70, t0 + 90, 0, 1, io), 0))} arah={1} p={popIn(f, GEL[0] + 80)} size={24} lebarMin={130} />
          {CABANG.map((c, i) => (
            <React.Fragment key={c.teks}>
              <Gedung k={c.gedung} x={c.x} dasar={c.y + c.h / 2} h={c.h} s={popIn(f, P_CAB[i])} />
              {popIn(f, P_CAB[i]) > 0.001 ? (
                <div style={{ position: 'absolute', left: c.x - 160, width: 320, top: c.y + c.h / 2 + JARAK, textAlign: 'center', lineHeight: 1 }}>
                  <WordText halus f={f} at={P_CAB[i] + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>{c.teks}</WordText>
                </div>) : null}
            </React.Fragment>))}

          {/* Simon 9 Okt "tambahkan juga adegan jual atau beli": BELI — uang investor (Rp100 jt) berangkat ke obligasi, SERTIFIKAT obligasi
              berbalik ke investor dan menetap jadi lencana di sudutnya (investor kini memegang obligasi). Jual = sisipan V2. */}
          <PilNominal x={(INV_OBL.x1 + INV_OBL.x2) / 2} y={INV.y + 46} teks={rpJuta(100)} arah={0} p={popIn(f, uang - 5)} size={26} />
          {(() => {
            const t = R(f, uang + 20, uang + 60, 0, 1, io), L0 = { x: INV.x - INV.d * 0.38, y: INV.y + INV.d * 0.3 }; // kiri-bawah lingkaran (kanan-atas = lengan karakter)
            if (t <= 0) return null;
            return <Sertifikat x={lerp(INV_OBL.x2 - 20, L0.x, t)} y={lerp(INV_OBL.y2, L0.y, t) - Math.sin(Math.PI * t) * 50} d={lerp(56, 40, t)} />;
          })()}
          {/* uang dipinjamkan: investor → obligasi → pemerintah & perusahaan (bergerak di kata-katanya) */}
          <Alir f={f} t0={uang - 25} a={[INV_OBL.x1, INV_OBL.y1]} b={[INV_OBL.x2, INV_OBL.y2]} ikon="uangKeluar" col={B.blue} />
          {CABANG.map((c, i) => <Alir key={i} f={f} t0={c.kata - 25} a={[KE_CABANG[i].x1, KE_CABANG[i].y1]} b={[KE_CABANG[i].x2, KE_CABANG[i].y2]} ikon="uangKeluar" col={B.blue} />)}
          {/* imbalannya: kupon mengalir BALIK — penerbit → obligasi → investor; rekap: dua gelombang lagi */}
          {GEL.map((t0, w) => (
            <React.Fragment key={w}>
              {CABANG.map((_, i) => <Alir key={i} f={f} t0={t0} a={[KE_CABANG[i].x2, KE_CABANG[i].y2]} b={[KE_CABANG[i].x1, KE_CABANG[i].y1]} ikon="kupon" col={B.orange} />)}
              <KuponKeTumpukan f={f} t0={t0 + 40} k={w} />
            </React.Fragment>))}
        </AbsoluteFill>

        {/* ═════ ADEGAN TAMBAHAN ═════ */}
        {/* V1 · "investor biasanya menerima pembayaran bunga atau kupon secara berkala. Saat obligasi jatuh tempo, pokok investasinya dikembalikan …" */}
        <Vinyet f={f} dari={{ x: INV.x, y: INV.y, r: INV.d / 2 }} buka={V1.buka} tutup={V1.tutup} col={B.blue} latar={HOUSE.krim} kam={kam}>
          {/* pusat tinta adegan = tengah layar (terukur: tumpukan pokok di kanan menarik pusat +62, +24) */}
          <AbsoluteFill style={{ transform: 'translate3d(-62px, -23.97px, 0) rotate(0.001deg)' }}><AdeganKupon f={f} /></AbsoluteFill>
        </Vinyet>
        {/* V2 · "Tapi kalau obligasi dijual sebelum jatuh tempo, harganya tetap bisa naik atau turun, tergantung suku bunga dan kondisi pasar." */}
        <Vinyet f={f} dari={{ x: OBL.x, y: OBL.y, r: OBL.d / 2 }} buka={V2.buka} col={B.blue} latar={HOUSE.ungu} kam={kam} keluar={ex > 0 ? { dx: mk.x - M0.x, dy: mk.y - M0.y, s: sIsi } : undefined}>
          <AdeganJual f={f} />
        </Vinyet>
      </AbsoluteFill>
      <Judul f={f} kata={['Return', 'utamanya', 'dari', 'kupon']} at={M('utamanya', utamanya)} sorotAt={bunga2 + 10} />
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.blue, opacity: R(f, BATAS.s7 + 22, BATAS.s7 + 48, 0, 1, io) }} /> : null}
    {/* ikon bab memudar masuk di atas isian → saat ditukar ke simpul peta (BATAS.s7+52) gambarnya sudah identik */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s7 + 34, BATAS.s7 + 48, 0, 1, io) }}><Icon name="obligasi" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/* ───────────── komponen diagram ───────────── */

/** gelombang kupon di diagram: "imbalannya" + dua gelombang rekap ("Jadi sumber return utamanya … bunga") */
const GEL = [IMBAL + 10, REKAP, REKAP + 50];
/** tumpukan kupon TEPAT di bawah investor (kupon ke-k), celah 25 px dari lingkarannya */
const TUMPUK_KUPON = { x: INV.x, d: 52, y: (k: number) => INV.y + INV.d / 2 + 25 + 26 - 22 * k + 44 };
/** kupon obligasi → investor: dari tepi kiri obligasi melengkung pelan ke puncak tumpukan kupon investor (40f inOut cubic), tanpa pudar —
 *  mendarat jadi kupon tumpukan berukuran sama */
const KuponKeTumpukan: React.FC<{ f: number; t0: number; k: number }> = ({ f, t0, k }) => {
  const t = R(f, t0, t0 + 40, 0, 1, io);
  if (t <= 0 || t >= 1) return null;
  const p = busur({ x: INV_OBL.x2, y: INV_OBL.y2 }, { x: TUMPUK_KUPON.x, y: TUMPUK_KUPON.y(k) }, 60, t);
  return <Kupon x={p.x} y={p.y} d={lerp(56, TUMPUK_KUPON.d, t)} op={R(f, t0, t0 + 8, 0, 1, io)} />;
};

/** uang bergerak LURUS di sepanjang penghubung a → b (40f inOut cubic), pudar di kedua ujung — aset Simon (8 Okt): uang dipinjamkan =
 *  lembar hijau; kupon TETAP kupon (Simon 8 Okt: "tetap gunakan kupon saja jangan ganti ke coin untuk obligasi") */
const Alir: React.FC<{ f: number; t0: number; a: [number, number]; b: [number, number]; ikon: KunciIkon; col: string; d?: number }> = ({ f, t0, a, b, ikon }) => {
  const t = R(f, t0, t0 + 40, 0, 1, io);
  if (t <= 0 || t >= 1) return null;
  const x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t);
  const op = Math.min(1, R(f, t0, t0 + 8, 0, 1, io), R(f, t0 + 32, t0 + 40, 1, 0, io));
  return ikon === 'kupon' ? <Kupon x={x} y={y} d={56} op={op} /> : <LembarUang x={x} y={y} w={96} putar={-12} op={op} />;
};

/** kupon: lingkaran oranye bertepi putih berikon kupon (posisi lewat transform) */
const Kupon: React.FC<{ x: number; y: number; d: number; s?: number; op?: number }> = ({ x, y, d, s = 1, op = 1 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.orange, border: `3px solid ${B.white}`, display: 'grid', placeItems: 'center', opacity: op, boxShadow: `0 6px 14px -6px ${B.orange}aa`, transform: `translate3d(${x - d / 2}px, ${y - d / 2 + 0.03}px, 0) rotate(0.001deg) scale(${s})` }}>
      <Icon name="kupon" size={d * 0.58} color={B.white} />
    </div>);

/* ───────────── komponen adegan tambahan ───────────── */

/** lingkaran ikon (gaya rumah) */
const Bulat: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s?: number; op?: number }> = ({ x, y, d, col, ikon, s = 1, op = 1 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `scale(${s})`, opacity: op, boxShadow: `0 16px 34px -14px ${col}aa` }}>
      <Icon name={ikon} size={d * 0.58} color={B.white} />
    </div>);



/** label di ATAS titik garis waktu (alas teks di `y`): bawah garis dibiarkan kosong untuk jalur kupon & pokok */
const LabelAtas: React.FC<{ x: number; y: number; f: number; at: number; teks: string }> = ({ x, y, f, at, teks }) => (
  <div style={{ position: 'absolute', left: x - 160, width: 320, bottom: 1080 - y, textAlign: 'center', lineHeight: 1 }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);

/* garis waktu dua adegan: hari ini → jatuh tempo, empat periode kupon */
const X0 = 460, X1 = 1420; // terukur: label 'Jatuh tempo' lebih lebar dari 'Hari ini' → kotak tinta isi panel berpusat di 960
const PERIODE = [0, 1, 2, 3, 4, 5].map((k) => lerp(X0, X1, k / 5)); // X0, empat tik kupon, X1
const KAL = 64; // diameter penanda kalender (waktu berjalan)

/** kalender penanda waktu di garis */
const Kalender: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <Bulat x={x} y={y} d={KAL} col={WARNA.langit} ikon="tenor" s={s} />;

/**
 * V1 — KUPON BERKALA (Simon 8 Okt: visual lama "belum cukup jelas"): investor (kiri) ⇄ obligasi (kanan), garis waktu di atas. Tiap
 * kalender tiba di satu periode, SATU KUPON keluar dari obligasi, terbang ke investor dan MENUMPUK (kupon bertambah = bunga diterima
 * berkala; tetap ikon kupon, bukan koin — Simon). Jatuh tempo → tumpukan POKOK (bundel hijau) yang sejak awal ada di sisi obligasi kembali ke investor.
 */
const AdeganKupon: React.FC<{ f: number }> = ({ f }) => {
  const Y = 330; // garis waktu
  const INVP = { x: 560, y: 590, d: 200 }, OBLP = { x: 1360, y: 590, d: 200 };
  const KOIN = { x: INVP.x, dasar: 880, d: 84 }; // tumpukan kupon TEPAT di bawah investor (lintasan tidak melintasi lingkarannya)
  const POKOK = { W: 110, dari: { x: OBLP.x + 214, dasar: 820 }, ke: { x: INVP.x + 200, dasar: 820 } }; // susunan acuan Simon (dasar naik 40: tumpukan acuan lebih dalam ke depan)
  const T1 = V1.buka + 85; // lompatan kalender pertama
  const H = (k: number) => T1 + 38 * k; // lompatan ke-k: H … H+30
  const tiba = (k: number) => H(k) + 30; // kalender tiba di PERIODE[k+1]
  let x = X0;
  for (let k = 0; k < 5; k++) x += (PERIODE[k + 1] - PERIODE[k]) * R(f, H(k), H(k) + 30, 0, 1, io);
  const tl = grow(f, V1.buka + 55);
  /** frame saat ujung garis (grow inOut cubic, 60f) melewati pecahan q → titik di sana pop TEPAT saat dilalui (dulu muncul mendadak) */
  const lewat = (q: number) => V1.buka + 25 + 60 * (q < 0.5 ? Math.cbrt(q / 4) : 1 - Math.cbrt(2 * (1 - q)) / 2);
  const titikPop = (q: number) => popIn(f, lewat(q) + 12, 24);
  const terbang = (k: number) => [tiba(k) + 6, tiba(k) + 52] as const;
  const P0 = M('pokok', pokok); // pokok kembali
  const pk = R(f, P0 - 10, P0 + 50, 0, 1, io);
  /* Simon 9 Okt "visual lebih menggambarkan script": POKOK = uang investor sendiri — muncul di sisi investor, lalu DIPINJAMKAN
   * (bergeser ke sisi obligasi) sebelum kupon pertama; di "pokok … dikembalikan" kembali ke investor. Dulu tumpukan sudah ada di sisi
   * obligasi sejak awal (asal-usulnya tak terbaca). Lintasan DATAR di dasar 860 (di bawah lingkaran; dulu busur melintasi obligasi). */
  const pinjam = R(f, V1.buka + 70, V1.buka + 120, 0, 1, io);
  const xPokok = pk > 0 ? lerp(POKOK.dari.x, POKOK.ke.x, pk) : lerp(POKOK.ke.x, POKOK.dari.x, pinjam);
  /* Simon 9 Okt ("iya" · "ya perbaiki lah"): tumpukan + pil Rp100 jt lewat DI DEPAN ikon obligasi, baik saat DIPINJAMKAN (investor →
   * obligasi) maupun saat POKOK KEMBALI. Dulu digambar di belakangnya: lintasan datar setinggi lingkaran (pil y 598 di tengah lingkaran
   * 490–690) → keduanya hilang ±1 dtk tiap lintasan. Ikon investor tetap di atas (elips bayangan tumpukan menyentuh tepi kanannya). */
  const pokokEl = (
    <>
      <TumpukanUang x={xPokok} dasar={POKOK.dari.dasar} W={POKOK.W} keadaan={(i) => { const t = R(f, V1.buka + 34 + 2 * i, V1.buka + 54 + 2 * i, 0, 1, io); return { op: t, dy: -30 * (1 - t) }; }} />
      {/* pil pokok ikut tumpukannya lewat TRANSFORM sub-piksel (translate3d + rotasi mikro, sama dengan tumpukan) — dulu lewat `left`: Chrome
          membulatkan posisi lapisannya ke piksel penuh → pil meloncat 1 px di frame pertama tumpukan bergerak (lonjakan satu-frame S06 f877) */}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${xPokok}px, 0.03px, 0) rotate(0.001deg)` }}>
        <PilNominal x={0.33 * POKOK.W} y={POKOK.dari.dasar - 1.71 * POKOK.W - 34} teks={rpJuta(100)} arah={0} p={popIn(f, V1.buka + 60)} size={26} />
      </div>
    </>);
  const dnInv = Math.max(0, ...[0, 1, 2, 3].map((k) => denyut(f, terbang(k)[1])), denyut(f, P0 + 50));
  const dnObl = Math.max(0, ...[0, 1, 2, 3].map((k) => denyut(f, tiba(k))));
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {tl > 0.001 ? <line x1={X0} x2={lerp(X0, X1, tl)} y1={Y} y2={Y} stroke={B.grayLite} strokeWidth={LINE.w + 1} strokeLinecap="round" /> : null}
        {x > X0 + 1 ? <line x1={X0} x2={x} y1={Y} y2={Y} stroke={B.blue} strokeWidth={LINE.w + 3} strokeLinecap="round" /> : null}
        {/* tik periode: abu-abu → oranye saat kalender tiba (= saat kupon dibayar) */}
        {PERIODE.slice(1, 5).map((px, k) => titikPop((k + 1) / 5) > 0.001 ? <circle key={k} cx={px} cy={Y} r={11 * titikPop((k + 1) / 5)} fill={f >= tiba(k) ? B.orange : B.white} stroke={f >= tiba(k) ? B.orange : B.grayLite} strokeWidth={3} /> : null)}
        {titikPop(0) > 0.001 ? <circle cx={X0} cy={Y} r={13 * titikPop(0)} fill={B.blue} /> : null}
        {titikPop(1) > 0.001 ? <circle cx={X1} cy={Y} r={13 * titikPop(1)} fill={f >= tiba(4) ? B.blue : B.white} stroke={B.blue} strokeWidth={4} /> : null}
      </svg>
      <LabelAtas x={X0} y={Y - KAL / 2 - JARAK} f={f} at={V1.buka + 70} teks="Hari ini" />
      <LabelAtas x={X1} y={Y - KAL / 2 - JARAK} f={f} at={V1.buka + 90} teks="Jatuh tempo" />
      <PilIkon x={960} y={Y + 112} p={popIn(f, tiba(0) + 20)} teks="Kupon berkala" ikon="kupon" col={B.orange} />

      {/* pokok: uang investor → dipinjamkan ke sisi obligasi → kembali ke investor saat jatuh tempo */}
      {/* Simon 9 Okt "kerjakan semua": tumpukan pokok = SUSUNAN ACUAN (tumpukan tinggi + samping + lembar + menara koin), unsur jatuh masuk
          berjenjang 2f (22 bundel tumpukan Simon) (pudar + turun 30 px), bergerak sebagai satu kesatuan */}
      <div style={{ position: 'absolute', left: POKOK.ke.x - 160, width: 320, top: POKOK.ke.dasar + POKOK.W * 0.66 + JARAK, textAlign: 'center', lineHeight: 1, opacity: pk }}>
        <WordText f={f} at={P0 + 60} halus style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>Pokok kembali</WordText>
      </div>

      {/* nominal: kupon diterima (Rp1,5 jt tiap periode) di kiri tumpukannya · pokok Rp100 jt ikut tumpukan pokok */}
      <PilNominal x={KOIN.x - KOIN.d / 2 - JARAK} y={KOIN.dasar - KOIN.d / 2 - 45} jangkar="kanan" teks={rpJutaKoma(1.5 * [0, 1, 2, 3].reduce((a, k) => a + R(f, terbang(k)[1] - 10, terbang(k)[1] + 10, 0, 1, io), 0))} arah={1} p={popIn(f, tiba(0) + 20)} size={26} lebarMin={140} />{/* muncul BERSAMA "Kupon berkala" (mulai Rp0,0 jt): dulu baru di kupon pertama → isi berat ke kanan 0,5 dtk (+40 px, terukur) */}
      {/* kupon yang sudah diterima: menumpuk di bawah investor */}
      {/* kupon terbang MENDARAT jadi kupon tumpukan (ukuran sama, tanpa pop ulang — dulu pop dari 0 menimpa kupon terbang yang penuh) */}
      {[0, 1, 2, 3].map((k) => f >= terbang(k)[1] ? <Kupon key={k} x={KOIN.x} y={KOIN.dasar - KOIN.d / 2 - 30 * k} d={KOIN.d} /> : null)}
      <Bulat x={OBLP.x} y={OBLP.y} d={OBLP.d} col={B.blue} ikon="obligasi" s={popIn(f, V1.buka + 50) + dnObl * 0.8} />
      {pokokEl}
      {/* Simon 12 Okt ("ganti dengan gambar investor juga", screenshot lingkaran ikon investor sisipan ini): investor = murid yang sama
          dengan diagram S06 (setengah badan, lingkaran oranye, gaya Scene 01); dulu lingkaran ikon investor ungu muda Ø200 */}
      <KarakterLingkar pose={MURID_S06} x={INVP.x} y={INVP.y} D={INVP.d} s={popIn(f, V1.buka + 40) + dnInv} warna={B.orange} />

      {/* kupon tiap periode: keluar dari obligasi → melengkung ke tumpukan investor */}
      {[0, 1, 2, 3].map((k) => {
        const [a, b] = terbang(k);
        const t = R(f, a, b, 0, 1, io);
        if (f < a || t >= 1) return null;
        const p = busur({ x: OBLP.x - 90, y: OBLP.y + 40 }, { x: KOIN.x, y: KOIN.dasar - KOIN.d / 2 - 30 * k }, 140, t);
        return <Kupon key={k} x={p.x} y={p.y} d={KOIN.d} s={popIn(f, a + 12, 24)} />; // muncul dari 0 (dulu langsung 0,5)
      })}

      <Kalender x={x} y={Y} s={popIn(f, V1.buka + 70)} />
    </>);
};

/**
 * V2 — kalender berhenti di TENGAH masa obligasi (dijual), sisa periode hangus (abu-abu putus-putus); harga bergerak naik
 * (hijau) lalu turun (merah) di sekitar harga beli; suku bunga & kondisi pasar mendorongnya (panah putus-putus).
 */
const AdeganJual: React.FC<{ f: number }> = ({ f }) => {
  const Y = 340, JX = 960; // garis waktu · titik jual (tengah masa obligasi); isi panel berpusat di y 547
  const x = lerp(X0, JX, R(f, dijual - 30, dijual + 30, 0, 1, io));
  const hangus = R(f, sebelum - 20, sebelum + 20, 0, 1, io);
  const JUAL = { y: Y + 110 };
  /* Simon 9 Okt "visual lebih menggambarkan script": "dijual" = obligasi BERPINDAH TANGAN — investor (kiri) → investor lain (kanan,
   * rona lain, tanpa label baru): sertifikat obligasi meluncur di panah lalu jadi lencana di pembeli, uangnya kembali ke investor.
   * "harganya tetap bisa naik atau turun" = ikon obligasi MENUNGGANG garis harga (dulu titik). */
  const TK = { y: Y + 195, a: 700, b: 1220, d: 110 };
  const TUKAR = dijual + 50;
  const sert = R(f, TUKAR, TUKAR + 50, 0, 1, io), uangT = R(f, TUKAR + 50, TUKAR + 100, 0, 1, io);
  // lencana di pembeli · di investor (dibeli di awal scene). Simon 12 Okt (ikon investor → gambar orang): kepala orang menyembul di atas
  // lingkaran → lencana pindah dari kanan-ATAS (menimpa kepala) ke KANAN-BAWAH lingkaran (kiri-bawah pembeli hanya 6 px dari pil harga
  // yang menunggang grafik, terukur)
  const LENCANA = { x: TK.b + TK.d * 0.36, y: TK.y + TK.d * 0.36 }, PEGANG = { x: TK.a + TK.d * 0.36, y: TK.y + TK.d * 0.36 };
  const C = { x0: 780, x1: 1140, y: Y + 345, a: 62 }; // grafik harga: garis harga beli + harga bergerak
  const G0 = A0('harganya', harganya);
  // gambar garis harga per bagian: naik ke puncak di "naik", turun ke lembah di "turun", lalu kembali — tiap bagian inOut cubic
  const u = R(f, G0 + 14, naik, 0, 0.25, io) + R(f, naik, turun, 0, 0.5, io) + R(f, turun, turun + 40, 0, 0.25, io);
  const N = 64;
  const harga = (t: number) => C.y - C.a * Math.sin(2 * Math.PI * t) - 9 * Math.sin(18 * t) * Math.sin(Math.PI * t);
  const titik = Array.from({ length: Math.max(2, Math.ceil(u * (N - 1)) + 1) }, (_, i) => {
    const t = Math.min(u, i / (N - 1));
    return { x: lerp(C.x0, C.x1, t), y: harga(t) };
  });
  const ujung = titik[titik.length - 1];
  const D0 = A0('tergantung', tergantung);
  const PENDORONG = [
    { x: 960 - 165, teks: 'Suku bunga', ikon: 'sukuBunga' as KunciIkon, p: popIn(f, D0 + 30), g: grow(f, D0 + 60), col: WARNA.oranye },
    { x: 960 + 165, teks: 'Kondisi pasar', ikon: 'kondisiPasar' as KunciIkon, p: popIn(f, D0 + 50), g: grow(f, D0 + 80), col: WARNA.oranyeMuda },
  ];
  const PY = Y + 535; // baris pendorong
  const dnGrafik = Math.max(denyut(f, D0 + 90), denyut(f, D0 + 110));
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* garis waktu: bagian yang dilalui biru, sisa sesudah titik jual → abu-abu putus-putus */}
        {/* sisa sesudah titik jual: garis utuh → putus-putus (silang-pudar, bukan tukar mendadak) */}
        <line x1={JX} x2={X1} y1={Y} y2={Y} stroke={B.grayLite} strokeWidth={LINE.w + 1} strokeLinecap="round" opacity={1 - hangus} />
        <line x1={JX} x2={X1} y1={Y} y2={Y} stroke={B.grayLite} strokeWidth={LINE.w + 1} strokeLinecap="round" strokeDasharray={LINE.dash} opacity={hangus} />
        <line x1={X0} x2={JX} y1={Y} y2={Y} stroke={B.grayLite} strokeWidth={LINE.w + 1} strokeLinecap="round" />
        {x > X0 + 1 ? <line x1={X0} x2={x} y1={Y} y2={Y} stroke={B.blue} strokeWidth={LINE.w + 3} strokeLinecap="round" /> : null}
        {PERIODE.slice(1, 5).map((px, k) => {
          const lewat = px < JX && x >= px; // berganti saat kalender menutupinya
          return <circle key={k} cx={px} cy={Y} r={9} fill={lewat ? B.orange : B.white} stroke={lewat ? B.orange : B.grayLite} strokeWidth={3} opacity={px > JX ? 1 - 0.6 * hangus : 1} />;
        })}
        <circle cx={X0} cy={Y} r={12} fill={B.blue} />
        <circle cx={X1} cy={Y} r={12 * (1 + denyut(f, tempo2) * 4)} fill={B.white} stroke={mixHex(B.blue, B.grayLite, hangus)} strokeWidth={4} />
        {/* titik jual → pil Jual */}
        {grow(f, dijual + 40) > 0.001 ? <line x1={JX} x2={JX} y1={Y + KAL / 2 + 8} y2={lerp(Y + KAL / 2 + 8, JUAL.y - 30 - 8, grow(f, dijual + 40))} stroke={B.night} strokeWidth={LINE.w} strokeDasharray={LINE.dash} strokeLinecap="round" /> : null}
        {/* investor → pembeli */}
        <Konektor x1={TK.a + TK.d / 2 + GAP} y1={TK.y} x2={TK.b - TK.d / 2 - GAP} y2={TK.y} g={grow(f, dijual + 40)} col={B.blue} />
        {/* grafik harga */}
        <g style={{ transformOrigin: `${(C.x0 + C.x1) / 2}px ${C.y}px`, transform: `scale(${1 + dnGrafik * 0.5})` }}>
          {grow(f, G0 + 30) > 0.001 ? <line x1={C.x0} x2={lerp(C.x0, C.x1, grow(f, G0 + 30))} y1={C.y} y2={C.y} stroke={B.grayLite} strokeWidth={3} strokeDasharray={LINE.dash} strokeLinecap="round" /> : null}
          {u > 0.001 ? (
            <>
              <defs>
                <clipPath id="s6-atas"><rect x={0} y={0} width={1920} height={C.y} /></clipPath>
                <clipPath id="s6-bawah"><rect x={0} y={C.y} width={1920} height={1080 - C.y} /></clipPath>
              </defs>
              <polyline clipPath="url(#s6-atas)" points={titik.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={ARAH.naik} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              <polyline clipPath="url(#s6-bawah)" points={titik.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={ARAH.turun} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </>) : null}
        </g>
        {/* pendorong → grafik (panah putus-putus) */}
        {PENDORONG.map((d, i) => <Konektor key={i} x1={d.x} y1={PY - 30 - JARAK} x2={lerp(d.x, (C.x0 + C.x1) / 2, 0.45)} y2={C.y + C.a + 26} g={d.g} col={d.col} putus />)}
      </svg>
      <LabelAtas x={X0} y={Y - KAL / 2 - JARAK} f={f} at={V2.buka + 40} teks="Hari ini" />
      <LabelAtas x={X1} y={Y - KAL / 2 - JARAK} f={f} at={V2.buka + 50} teks="Jatuh tempo" />
      <Kalender x={x} y={Y} s={popIn(f, V2.buka + 50)} />
      <PilIkon x={JX} y={JUAL.y} p={popIn(f, dijual + 60)} teks="Jual" ikon="obligasi" col={B.night} />
      {/* urutan gambar: pembeli → benda bergerak → investor (sertifikat muncul dari BAWAH investor, uang lenyap ke bawahnya) → lencana */}
      {/* Simon 12 Okt ("ganti juga" → lalu "ganti orang discene obligasi dengan ini"): pembeli = "investor lain" = investor berjas, lingkaran
          Dark Turquoise ("biru brand"); dulu ikon investor di lingkaran langit */}
      <KarakterLingkar pose={INVESTOR_JAS} x={TK.b} y={TK.y} D={TK.d} s={popIn(f, dijual + 30)} warna={B.turq} />
      {/* sertifikat berangkat dari lencana investor (obligasi yang ia beli), melengkung turun menyusuri panah, jadi lencana di pembeli */}
      {sert > 0 && sert < 1 ? <Sertifikat x={lerp(PEGANG.x, LENCANA.x, sert)} y={lerp(PEGANG.y, LENCANA.y, sert) + Math.sin(Math.PI * sert) * 45} d={lerp(44, 48, sert)} /> : null}
      {/* uang berangkat 120 px kiri pembeli: tidak muncul di bawah lencana pembeli yang sudah mendarat */}
      {uangT > 0 && uangT < 1 ? <LembarUang x={lerp(TK.b - 120, TK.a, uangT)} y={TK.y + 52} w={90} putar={-8} op={Math.min(R(uangT, 0, 0.15, 0, 1), R(uangT, 0.85, 1, 1, 0))} /> : null}
      {/* nominal: hasil jual Rp100 jt diterima investor (di KIRI investor — bawahnya dipakai pil "Harga naik") */}
      <PilNominal x={TK.a - TK.d / 2 - JARAK} y={TK.y} jangkar="kanan" teks={tanda(rpJuta(100), true)} arah={1} p={popIn(f, TUKAR + 100)} size={24} />
      {/* penjual = investor kita: murid yang sama dengan diagram S06 (lingkaran oranye); dulu ikon investor di lingkaran ungu muda */}
      <KarakterLingkar pose={MURID_S06} x={TK.a} y={TK.y} D={TK.d} s={popIn(f, dijual + 10)} warna={B.orange} />
      {sert <= 0 && popIn(f, dijual + 24) > 0.001 ? <div style={{ position: 'absolute', inset: 0, transformOrigin: `${PEGANG.x}px ${PEGANG.y}px`, transform: `scale(${popIn(f, dijual + 24)})` }}><Sertifikat x={PEGANG.x} y={PEGANG.y} d={44} /></div> : null}
      {sert >= 1 ? <Sertifikat x={LENCANA.x} y={LENCANA.y} d={48} /> : null}
      {/* penunggang harga: ikon obligasi di ujung garis, cincin hijau (di atas harga beli) / merah (di bawah) */}
      {u > 0.001 ? <Sertifikat x={ujung.x} y={ujung.y} d={46} cincin={ujung.y <= C.y ? ARAH.naik : ARAH.turun} /> : null}
      {/* Simon 9 Okt: NOMINAL — harga obligasi berjalan bersama penunggangnya (dibeli Rp100 jt: naik ke Rp105 jt, turun ke Rp95 jt) */}
      {u > 0.001 ? <PilNominal x={ujung.x} y={ujung.y - 58} teks={rpJuta(100 + (5 * (C.y - ujung.y)) / C.a)} arah={Math.max(-1, Math.min(1, ((C.y - ujung.y) / C.a) * 3))} p={popIn(f, G0 + 30)} size={24} lebarMin={150} /> : null}
      <PilArah x={C.x0 - 30} y={C.y - 40} p={popIn(f, G0 + 30)} naik />
      <PilArah x={C.x1 + 30} y={C.y + 40} p={popIn(f, G0 + 50)} naik={false} />
      {PENDORONG.map((d) => <PilIkon key={d.teks} x={d.x} y={PY} p={d.p} teks={d.teks} ikon={d.ikon} col={d.col} />)}
    </>);
};

/** sertifikat obligasi: lingkaran biru berikon obligasi, cincin putih (atau warna arah harga) */
const Sertifikat: React.FC<{ x: number; y: number; d: number; cincin?: string }> = ({ x, y, d, cincin = B.white }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.blue, border: `4px solid ${cincin}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', boxShadow: `0 6px 14px -6px ${B.blue}aa`, transform: `translate3d(${x - d / 2}px, ${y - d / 2 + 0.03}px, 0) rotate(0.001deg)` }}>
    <Icon name="obligasi" size={d * 0.56} color={B.white} />
  </div>);

/** pil ikon (lingkaran warna + teks) — chip standar: 8/26, celah 12 */
const PilIkon: React.FC<{ x: number; y: number; p: number; teks: string; ikon: KunciIkon; col: string }> = ({ x, y, p, teks, ikon, col }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}88` }}>
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={28} color={B.white} /></div>
    {teks}
  </div>);

/** pil arah harga: ▲ hijau "Harga naik" (rata kanan di x) / ▼ merah "Harga turun" (rata kiri di x); tinggi = PilIkon */
const PilArah: React.FC<{ x: number; y: number; p: number; naik: boolean }> = ({ x, y, p, naik: atas }) => {
  if (p <= 0.001) return null;
  const col = atas ? ARAH.naik : ARAH.turun;
  return (
    <div style={{ position: 'absolute', top: y, ...(atas ? { right: 1920 - x } : { left: x }), transform: `translateY(-50%) scale(${p})`, transformOrigin: 'center', display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '16px 26px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}aa` }}>
      <svg width={22} height={18} viewBox="0 0 22 18"><path d={atas ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} /></svg>
      {atas ? 'Harga naik' : 'Harga turun'}
    </div>);
};
