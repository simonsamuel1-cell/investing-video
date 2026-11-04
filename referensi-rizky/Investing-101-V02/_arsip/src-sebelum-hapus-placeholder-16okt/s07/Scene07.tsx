import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import { ICON } from '../icons.gen';
import { IKON, type KunciIkon } from '../ikon';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { ARAH, B, F, R, WARNA, io } from '../theme';
import { Icon, WordText, cin, grow, lerp, popOut, KacaPembesar } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Konektor, SimpulBab } from '../parts/rantai';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { Bundel } from '../parts/uang';
import { Judul } from '../parts/judul';
import { PilNominal, rpJuta, rpPenuh } from '../parts/nominal';

/**
 * SCENE 07 — REKSA DANA. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "FUND BASKET → Money Market Instruments · Bonds · Stocks · Index Constituents ↓ UNDERLYING ASSETS ↓ Return · Volatility · Risk"
 *   TEXT   "Karakter reksa dana / tergantung isi investasinya"
 * Revisi 8 Okt sore (Simon: "adegan reksadana belum clear secara visualnya, secara visual masih sulit untuk dipahami" + "alignment visual
 * juga masih bermasalah" + "bedakan warna lingkaran saham dan index saham"; sebelumnya: candlestick hanya saham & indeks, realistis,
 * perbesar, center, hapus animasi tak perlu):
 *   1. "…bukan sekadar melihat label, tapi melihat: sebenarnya dana itu diinvestasikan ke apa" — simpul → KERANJANG berlabel "Reksa dana",
 *      kaca pembesar melihat ke dalam, bundel uang masuk, isinya "?"
 *   2. "reksa dana adalah sebuah keranjang investasi" — empat instrumen masuk dan NAMANYA tampil di samping keranjang (dulu ikon tanpa nama)
 *   3. "Kalau sebagian besar isinya obligasi / saham / mengikuti indeks…" — satu keranjang menjadi TIGA keranjang berdampingan (tiga contoh
 *      reksa dana). Tiap kolom: keranjang (isi mayoritas) → BATANG KOMPOSISI berlabel ("Obligasi" 75 % …) → panah → pil "Mirip …" →
 *      kartu grafik (obligasi = line chart; saham = candlestick ADMR.JK riil; indeks = candlestick IHSG riil + garis indeks). 9 Okt: tiap
 *      kolom POP di kalimatnya, susunan bergeser bertahap supaya tetap di tengah (dulu kolom hadir bersama lalu redup).
 *   4. "Jadi return, volatilitas, dan risikonya … bergantung pada underlying asset-nya" — susunan jadi TABEL: kepala baris kiri
 *      "Underlying asset" (baris batang komposisi) dan Return · Volatilitas · Risiko (baris grafik).
 * Warna isi: obligasi & pasar uang = neon blue, saham = dark orange, indeks saham = dark turquoise (palet resmi 6 warna Tuntun), lingkaran
 * bercincin putih supaya terpisah dari keranjang turkis. Geometri dunia = layar (kamera diam): tiap fase berpusat di (960, 540).
 */
export const S7 = BATAS.s7;
export const IDE_S07_AWAL = S7;

// urutan = urutan UCAPAN
const [reksa, label, tapi, /* melihat */, dana, diinvestasikan, apa, karena, kalau, obligasi, karakternya, kalau2, saham,
  pergerakannya, kalau3, indeks, kinerjanya, jadi, ret, volatilitas, risikonya, bergantung, underlying, asset] =
  urut(['reksa', 'label', 'tapi', 'melihat', 'dana', 'diinvestasikan', 'apa', 'karena', 'kalau', 'obligasi', 'karakternya',
    'kalau', 'saham', 'pergerakannya', 'kalau', 'indeks', 'kinerjanya', 'jadi', 'return', 'volatilitas', 'risikonya', 'bergantung',
    'underlying', 'asset-nya'], S7);
/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
type Pt = { x: number; y: number };

/* ── isi ── */
type Jenis = 'saham' | 'indeks' | 'obligasi' | 'pasarUang';
const JENIS: Record<Jenis, { ikon: KunciIkon; col: string; nama: string }> = {
  obligasi: { ikon: 'obligasi', col: B.blue, nama: 'Obligasi' },
  saham: { ikon: 'saham', col: B.orange, nama: 'Saham' },
  pasarUang: { ikon: 'rdPasarUang', col: WARNA.langit, nama: 'Pasar uang' }, // beda dari obligasi (konteks mirip → warna beda)
  indeks: { ikon: 'rdIndeks', col: B.turq, nama: 'Indeks saham' },
};
/** empat slot isi (koordinat ikon keranjang 512): dua di belakang (lebih tinggi), dua di depan (bibir menutup kakinya) */
const SLOT: Pt[] = [{ x: 205, y: 125 }, { x: 417, y: 125 }, { x: 95, y: 170 }, { x: 307, y: 170 }];
const URUT_KIRI = [2, 0, 3, 1]; // slot kiri → kanan (urutan jatuh, "?", dan daftar nama)
const ISI_D0 = 132; // diameter isi pada keranjang skala 1
const CAMPUR: Jenis[] = ['saham', 'indeks', 'obligasi', 'pasarUang'];

/* ── geometri (dunia = layar) ── */
const NODE = { x: 960, y: 512, d: 200 }; // simpul + nama di bawahnya berpusat di y 540
/** keranjang besar (fase 1–2): kotak ikon 512 × 512, tinta pegangan…dasar (17…494) berpusat di y 540 */
const BESAR_Y = 285;
const BESAR_X1 = 830; // fase 1: label (kiri) + keranjang berpusat di 960 (terukur)
const BESAR_X2 = 600; // fase 2: label + keranjang + daftar reksa dana (kanan, lebih panjang sejak revisi 16 Okt) — kamera memusatkan
const DAFTAR_X = (kx: number) => kx + 486 + 40; // tepi kiri daftar nama
const DAFTAR_Y = [426, 502, 578, 654];
/** naskah REVISI 16 Okt (kolom VISUAL "FUND BASKET · Reksadana Pasar Uang ±5,6% · Pendapatan Tetap ±7,0% · Indeks ±10,1% · Saham ±15,0%"):
 *  daftar di samping keranjang = jenis reksa dana menurut isi mayoritasnya + rata-rata return per tahun (data grafik Simon, sama dengan
 *  Scene 01). Dulu: nama instrumen + porsi Rp (ilustratif). */
const JENIS_RD: Record<string, { nama: string; ret: string }> = {
  Obligasi: { nama: 'Reksa Dana Pendapatan Tetap', ret: '±7,0%/tahun' },
  Saham: { nama: 'Reksa Dana Saham', ret: '±15,0%/tahun' },
  'Pasar uang': { nama: 'Reksa Dana Pasar Uang', ret: '±5,6%/tahun' },
  'Indeks saham': { nama: 'Reksa Dana Indeks', ret: '±10,1%/tahun' },
};
/** tiga kolom (fase 3–4) */
const SK = 0.5;
const KOL = [490, 960, 1430];
const GESER_TABEL = 153; // fase 4: kolom bergeser kanan memberi tempat kepala baris (kiri)
const Y = { kTop: 262, bar: 536, panah: [568, 602], pil: 632, kartu: 743 }; // keranjang (tinta atas) · batang · panah · pil · kartu (pusat)
const kotakKecil = (cx: number) => ({ x: cx - 256 * SK, y: Y.kTop - 17 * SK, s: SK });
const BAR = { w: 236, h: 40 };
const KARTU = { w: 420, h: 150 };

/* ── waktu (frame global) ── */
const ISI_BAB = reksa; // slot bab 05 terisi saat "reksa dana"
const TENGAH = ISI_BAB + 90;
const PINDAH_TAG = A0('tapi', tapi) + 20; // nama → label pindah ke keranjang BERSAMA keranjang muncul
const KE_KERANJANG = PINDAH_TAG + 50; // simpul mengecil masuk keranjang
const JATUH = A0('karena', karena); // instrumen jatuh ke keranjang + namanya
const BELAH = A0('kalau', kalau); // satu keranjang → tiga
const TABEL = A0('jadi', jadi); // susunan → tabel (geser kanan, kepala baris)
type Lilin = 'stabil' | 'gejolak' | 'indeks';
/** tiap kolom: kapan menyala (awal kalimat "Kalau…"), kapan isinya berubah jadi mayoritas (di kata instrumennya), kapan karakternya tampil */
const KASUS: { aktif: number; ganti: number; karakter: number; isi: Jenis[]; komposisi: { j: Jenis; p: number }[]; pil: string; lilin: Lilin }[] = [
  { aktif: BELAH, ganti: obligasi - 30, karakter: A0('karakternya', karakternya), isi: ['obligasi', 'saham', 'obligasi', 'obligasi'],
    komposisi: [{ j: 'obligasi', p: 0.75 }, { j: 'saham', p: 0.25 }], pil: 'Mirip obligasi', lilin: 'stabil' },
  { aktif: A0('kalau', kalau2), ganti: saham - 30, karakter: A0('pergerakannya', pergerakannya), isi: ['saham', 'saham', 'obligasi', 'saham'],
    komposisi: [{ j: 'saham', p: 0.75 }, { j: 'obligasi', p: 0.25 }], pil: 'Mirip saham', lilin: 'gejolak' },
  { aktif: A0('kalau', kalau3), ganti: indeks - 30, karakter: A0('kinerjanya', kinerjanya), isi: ['indeks', 'indeks', 'indeks', 'indeks'],
    komposisi: [{ j: 'indeks', p: 1 }], pil: 'Ikut indeks', lilin: 'indeks' },
];
const BALIK_D = 30, BALIK_JEDA = 8;
/** isi slot k pada keranjang j di frame f: jenis yang tampil + lebar balik (1 = utuh, 0 = tepat di tengah balikan) */
const isiSlot = (f: number, j: number, k: number): { jenis: Jenis; lebar: number } => {
  const lama = CAMPUR[k], baru = KASUS[j].isi[k];
  if (lama === baru) return { jenis: lama, lebar: 1 };
  const urutan = URUT_KIRI.filter((s) => CAMPUR[s] !== KASUS[j].isi[s]).indexOf(k);
  const t0 = KASUS[j].ganti + BALIK_JEDA * urutan;
  const p = R(f, t0, t0 + BALIK_D, 0, 1, io);
  return { jenis: p < 0.5 ? lama : baru, lebar: Math.abs(Math.cos(Math.PI * p)) };
};
/** ikon Saham di keranjang tengah (kolom 2), slot 0: diangkat di akhir lalu diambil alih Scene 08 (koordinat layar, kamera S07 = 0) */
const kotakAkhir = kotakKecil(KOL[1] + GESER_TABEL);
export const SAHAM7: Pt = { x: kotakAkhir.x + SLOT[0].x * SK, y: kotakAkhir.y + SLOT[0].y * SK };
export const ISI_D = ISI_D0 * SK;
export const SAHAM_ANGKAT = 102; // 110 → 102 (cek 12 Okt): di awal Scene 08 ikon Saham yang terangkat menembus tepi atas wilayah aman 4–6 px
/** label "Reksa dana": di tengah = di bawah simpul; di keranjang = tergantung di kiri bibir */
const JARAK = 16;
const TAG_TENGAH = { x: NODE.x, y: NODE.y + NODE.d / 2 + JARAK + 28 };
/** kepala baris tabel (fase 4): kolom kanan-rata di x */
const KEPALA_KANAN = KOL[0] + GESER_TABEL - KARTU.w / 2 - 30;
const KEPALA_W = 272;
const AKIBAT = [
  { teks: 'Return', ikon: 'returnInvestasi' as KunciIkon, y: Y.kartu - 56, at: ret, col: WARNA.biru },
  { teks: 'Volatilitas', ikon: 'naikTurunHarga' as KunciIkon, y: Y.kartu, at: volatilitas, col: WARNA.langit },
  { teks: 'Risiko', ikon: 'risiko' as KunciIkon, y: Y.kartu + 56, at: risikonya, col: WARNA.oranyeMuda },
];

export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < S7) return null;
  // KELUAR = milik Scene 08: ikon Saham TERANGKAT dari keranjang tengah 40f sebelumnya (diambil alih Scene 08 → slot bab 06); sisa isi
  // MASKER LINGKARAN menyusut ke simpul bab 05 di peta bab, berubah turkis + ikonnya, lalu peta mengambil alih. 50f mulai BATAS.s8.
  if (f >= BATAS.s8 + 52) return null;
  const ex = R(f, BATAS.s8, BATAS.s8 + 50, 0, 1, io);
  const kam8 = kamera('S08', BATAS.s8 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam8, SIMPUL_PETA(4)), r: SIMPUL_PETA(4).r * kam8.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  const angkatSaham = R(f, BATAS.s8 - 40, BATAS.s8, 0, 1, io);
  const kam = kamera('S07', f);

  /* keranjang besar → tiga keranjang kecil */
  const morf = cin(f, KE_KERANJANG); // simpul mengecil masuk keranjang
  const pKeranjang = popIn(f, KE_KERANJANG + 10);
  const kx = lerp(BESAR_X1, BESAR_X2, R(f, JATUH - 10, JATUH + 50, 0, 1, io)); // memberi tempat daftar nama di kanan
  const belah = R(f, BELAH, BELAH + 60, 0, 1, io);
  const tabel = R(f, TABEL, TABEL + 60, 0, 1, io);
  /* Simon 9 Okt (umum, dari "muncul satu per satu sesuai voice"): kolom 2 & 3 tidak lagi hadir bersama lalu REDUP menunggu kalimatnya —
   * tiap kolom POP di kalimatnya ("Kalau …"), dan susunan yang ada bergeser bertahap (inOut cubic) supaya tetap berpusat di 960:
   * 1 kolom di 960 → 2 kolom di 725/1195 → 3 kolom di 490/960/1430 (jarak antarkolom 470 tetap) */
  const tambah = (j: number) => R(f, KASUS[j].aktif - 30, KASUS[j].aktif + 30, 0, 1, io);
  const kolX = (j: number) => KOL[j] + (KOL[1] - KOL[0]) / 2 * (2 - tambah(1) - tambah(2)) + GESER_TABEL * tabel;
  const popKolom = (j: number) => (j === 0 ? 1 : popIn(f, KASUS[j].aktif + 20)); // +20: pop sesudah geser separuh jalan (dulu kolom 3 sempat lewat tepi kanan, terukur 1.879 px)
  const kotak = (j: number) => {
    const k = kotakKecil(kolX(j));
    if (j > 0) return k;
    return { x: lerp(kx, k.x, belah), y: lerp(BESAR_Y, k.y, belah), s: lerp(1, SK, belah) };
  };
  const pindahTag = R(f, PINDAH_TAG, PINDAH_TAG + 50, 0, 1, io);
  const tagKanan = kx + 44 - JARAK, tagY = BESAR_Y + 330;
  const opTag = 1 - R(f, BELAH, BELAH + 30, 0, 1, io);
  const tali = grow(f, KE_KERANJANG + 50);
  const kait = { x: kx + 26, y: BESAR_Y + 221 };

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS peta bab yang baru */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s8, BATAS.s8 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <AbsoluteFill>
        <Judul f={f} kata={['Karakter', 'reksa dana']} at={M('karakternya', karakternya)} sorotAt={karakternya + 40} keluar={jadi + 10} />
        <Judul f={f} kata={['Tergantung', 'isi investasinya']} at={M('bergantung', bergantung) + 40} sorotAt={asset} />
      </AbsoluteFill>

      {/* ISI — kamera (translate3d + rotasi mikro); judul tidak ikut */}
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s8 - 30)}>
        {/* ═════ pembuka bab: peta bab → simpul bab 05 ke tengah ═════ */}
        <PembukaBab f={f} s0={S7} k={4} isiAt={ISI_BAB} tengah={NODE} selesai={TENGAH} />
        {/* simpul bab 05 → mengecil masuk ke keranjang */}
        {f >= TENGAH && morf < 1 ? <SimpulBab x={lerp(NODE.x, kx + 256, morf)} y={lerp(NODE.y, BESAR_Y + 360, morf)} d={NODE.d * (1 - morf)} col={B.turq} ikon="reksaDana" isi={1} /> : null}

        {/* ═════ KERANJANG: satu (fase 1–2) → tiga (fase 3–4) ═════ */}
        {[0, 1, 2].map((j) => {
          const pk = popKolom(j);
          if (j > 0 && (belah <= 0 || pk <= 0.001)) return null;
          const kt = kotak(j), o = 256 * kt.s * (1 - pk); // pop berporos di tengah kotak keranjang
          return (
            <div key={j} style={{ position: 'absolute', left: 0, top: 0, width: 512, height: 512, transformOrigin: '0 0', transform: `${geser(kt.x + o, kt.y + o)} scale(${kt.s * pk})` }}>
              <Keranjang bagian="belakang" p={pKeranjang} />
              {j === 0 ? <UangMasuk f={f} /> : null}
              {/* slot "?" — isi belum diketahui ("diinvestasikan ke apa") */}
              {j === 0 ? URUT_KIRI.map((k, i) => {
                const slot = popIn(f, diinvestasikan - 10 + 10 * i) * (1 - R(f, JATUH + 20 * i + 10, JATUH + 20 * i + 30, 0, 1, io));
                return slot > 0.001 ? <div key={k} style={{ position: 'absolute', left: SLOT[k].x - ISI_D0 / 2, top: SLOT[k].y - ISI_D0 / 2, width: ISI_D0, height: ISI_D0, borderRadius: '50%', border: `3px dashed ${B.grayLite}`, background: B.white, transform: `scale(${slot})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 52, fontWeight: 800, color: B.gray }}>?</div> : null;
              }) : null}
              {[0, 1, 2, 3].map((k) => {
                if (j === 1 && k === 0 && angkatSaham > 0.25) return null; // terangkat: lapisan atas (posisi sama — tak ada loncatan)
                return <IsiSlot key={k} f={f} j={j} k={k} t0={JATUH + 20 * URUT_KIRI.indexOf(k)} angkat={j === 1 && k === 0 ? (SAHAM_ANGKAT / SK) * angkatSaham : 0} />;
              })}
              <Keranjang bagian="depan" p={pKeranjang} />
            </div>);
        })}

        {/* label "Reksa dana" — tergantung di kiri bibir keranjang besar; pudar saat keranjang membelah */}
        {tali > 0.001 && opTag > 0.001 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: opTag }}>
            <line x1={tagKanan - 22} y1={tagY - 10} x2={lerp(tagKanan - 22, kait.x, tali)} y2={lerp(tagY - 10, kait.y, tali)} stroke={B.turq} strokeWidth={3} strokeLinecap="round" />
          </svg>) : null}
        {opTag > 0.001 ? <LabelTag f={f} x={lerp(TAG_TENGAH.x, tagKanan, pindahTag)} y={lerp(TAG_TENGAH.y, tagY, pindahTag)} kanan={pindahTag} tag={popIn(f, label)} op={opTag} /> : null}

        {/* "keranjang investasi": nama tiap instrumen tampil saat ia masuk (dulu ikon tanpa nama) */}
        {URUT_KIRI.map((k, i) => {
          const jn = JENIS[CAMPUR[k]];
          const p = popIn(f, JATUH + 20 * i + 40) * (1 - R(f, BELAH, BELAH + 30, 0, 1, io));
          return p > 0.001 ? (
            <React.Fragment key={k}>
              <ChipNama x={DAFTAR_X(kx)} y={DAFTAR_Y[i]} ikon={jn.ikon} col={jn.col} teks={JENIS_RD[jn.nama].nama} p={p}
                ekor={<PilNominal x={0} y={0} jangkar="kiri" teks={JENIS_RD[jn.nama].ret} arah={0} p={popIn(f, JATUH + 20 * i + 50)} size={22} />} />
            </React.Fragment>) : null;
        })}

        {/* nominal: dana kita Rp1 jt masuk keranjang (label di badan keranjang besar), pergi saat keranjang membelah */}
        <PilNominal x={kx + 256} y={BESAR_Y + 410} teks={rpJuta(1)} arah={0} p={popIn(f, dana + 30) * (1 - R(f, BELAH, BELAH + 30, 0, 1, io))} size={30} />
        {/* ═════ kolom: batang komposisi → panah → pil "Mirip …" → kartu grafik ═════ */}
        {KASUS.map((c, j) => {
          const muncul = popIn(f, j === 0 ? BELAH + 40 : c.aktif + 20);
          if (muncul <= 0.001) return null;
          const x = kolX(j), col = JENIS[c.komposisi[0].j].col;
          return (
            <div key={j} style={{ position: 'absolute', inset: 0 }}>
              <BatangKomposisi f={f} x={x} p={muncul} isi={c.komposisi} at={c.ganti} />
              <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                <Konektor x1={x} y1={Y.panah[0]} x2={x} y2={Y.panah[1]} g={grow(f, c.karakter + 10)} col={col} />
              </svg>
              <PilMirip f={f} x={x} teks={c.pil} col={col} p={popIn(f, c.karakter + 30)} at={c.karakter + 40} />
              <KartuLilin f={f} x={x} jenis={c.lilin} col={col} p={muncul} mulai={c.karakter + 40} />
            </div>);
        })}

        {/* ═════ tabel: kepala baris (kiri) ═════ */}
        <KepalaUnderlying p={popIn(f, underlying - 30)} />
        {AKIBAT.map((a) => <ChipAkibat key={a.teks} p={popIn(f, a.at)} a={a} />)}

        {/* kaca pembesar: "tapi melihat: sebenarnya dana itu diinvestasikan ke apa" — melihat ke DALAM keranjang, diam */}
        <Kaca f={f} kx={kx} />
        {/* Saham terangkat keluar dari keranjang tengah (lapisan atas) — Scene 08 mengambil alih di posisi ini */}
        {f < BATAS.s8 && angkatSaham > 0.25 ? <Bulat x={SAHAM7.x} y={SAHAM7.y - SAHAM_ANGKAT * angkatSaham} d={ISI_D} col={B.orange} ikon="saham" /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.turq, opacity: R(f, BATAS.s8 + 22, BATAS.s8 + 48, 0, 1, io) }} /> : null}
    {/* ikon bab memudar masuk di atas isian → saat ditukar ke simpul peta (BATAS.s8+52) gambarnya sudah identik */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s8 + 34, BATAS.s8 + 48, 0, 1, io) }}><Icon name="reksaDana" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/** keranjang stok (Flaticon #9427124) dalam koordinat ikon 512 (wadah yang menskalakan); `belakang` = pegangan, `depan` = bibir + badan */
const Keranjang: React.FC<{ bagian: 'belakang' | 'depan'; p: number }> = ({ bagian, p }) => {
  if (p <= 0.001) return null;
  const ic = ICON[IKON.keranjang];
  const POTONG = 205; // antara pegangan (≤195) dan bibir (≥213)
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 512, height: 512, transform: `scale(${p})`, transformOrigin: '256px 360px',
      clipPath: bagian === 'belakang' ? `inset(0 0 ${512 - POTONG}px 0)` : `inset(${POTONG}px 0 0 0)` }}>
      <svg viewBox={ic.vb} width={512} height={512} style={{ display: 'block', color: B.turq }} dangerouslySetInnerHTML={{ __html: ic.body }} />
    </div>);
};

/** bundel uang hijau jatuh ke keranjang di kata "dana", tenggelam di balik badan lalu pudar (koordinat keranjang) */
const UangMasuk: React.FC<{ f: number }> = ({ f }) => {
  const t = R(f, dana - 24, dana + 26, 0, 1, io);
  if (t <= 0 || t >= 1) return null;
  return <Bundel x={256} y={lerp(-40, 330, t)} w={170} op={Math.min(1, R(f, dana - 24, dana - 14, 0, 1, io), 1 - R(f, dana + 14, dana + 26, 0, 1, io))} />;
};

/** satu isi keranjang j di slot k: jatuh masuk (t0), lalu berganti jadi isi mayoritas kasusnya (dibalik di tempat) */
const IsiSlot: React.FC<{ f: number; j: number; k: number; t0: number; angkat?: number }> = ({ f, j, k, t0, angkat = 0 }) => {
  const jatuh = R(f, t0, t0 + 40, 0, 1, io);
  const s = popIn(f, t0 + 30);
  if (s <= 0.001) return null;
  const { jenis, lebar } = isiSlot(f, j, k);
  const jn = JENIS[jenis], x = SLOT[k].x, y = lerp(SLOT[k].y - 170, SLOT[k].y, jatuh) - angkat;
  return (
    <div style={{ position: 'absolute', left: x - ISI_D0 / 2, top: y - ISI_D0 / 2, width: ISI_D0, height: ISI_D0, borderRadius: '50%', background: jn.col, border: `5px solid ${B.white}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', transform: `scale(${s * lebar}, ${s})`, boxShadow: `0 14px 30px -12px ${jn.col}aa` }}>
      <Icon name={jn.ikon} size={ISI_D0 * 0.56} color={B.white} />
    </div>);
};

/** nama bab → LABEL: pil bercincin (lubang tali di ujung kanan); `kanan` 0 = berpusat di x, 1 = tepi kanan di x */
const LabelTag: React.FC<{ f: number; x: number; y: number; kanan: number; tag: number; op: number }> = ({ f, x, y, kanan, tag, op }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: op, transform: `translate(${-50 - 50 * kanan}%, -50%)`, display: 'flex', alignItems: 'center', gap: 12,
    background: tag > 0.001 ? `rgba(255,255,255,${tag})` : 'transparent', border: `2.5px solid rgba(92,200,227,${Math.min(1, tag)})`, borderRadius: 999, padding: `${10 * tag}px ${16 * tag}px ${10 * tag}px ${26 * tag}px`, whiteSpace: 'nowrap', lineHeight: 1 }}>
    <WordText halus f={f} at={TENGAH + 20} style={{ fontFamily: F, fontSize: lerp(40, 34, Math.max(tag, kanan)), fontWeight: 800, color: B.night }}>Reksa dana</WordText>
    {tag > 0.001 ? <span style={{ width: 16 * tag, height: 16 * tag, borderRadius: '50%', border: `3px solid ${B.turq}`, display: 'inline-block' }} /> : null}
  </div>);

/** kaca pembesar (ikon stok #12133381). Simon 9 Okt "visual lebih menggambarkan script": "bukan sekadar melihat LABEL 'reksa dana'-nya"
 *  → kaca muncul DI ATAS label dulu; "tapi melihat: … diinvestasikan ke apa" → kaca pindah ke DALAM keranjang (bersama keranjang muncul) */
const Kaca: React.FC<{ f: number; kx: number }> = ({ f, kx }) => {
  const s = popIn(f, label + 20) * popOut(f, apa + 40);
  if (s <= 0.001) return null;
  const t = R(f, KE_KERANJANG - 20, KE_KERANJANG + 40, 0, 1, io);
  return <KacaPembesar x={lerp(TAG_TENGAH.x + 60, kx + 256, t)} y={lerp(TAG_TENGAH.y, BESAR_Y + 150, t)} d={120} s={s} geserCss={geser} />; // translate3d (dulu left/top: berpindah per piksel bulat)
};

/** nama instrumen (ikon + teks) di samping keranjang besar */
const ChipNama: React.FC<{ x: number; y: number; ikon: KunciIkon; col: string; teks: string; p: number; ekor?: React.ReactNode }> = ({ x, y, ikon, col, teks, p, ekor }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translateY(-50%) scale(${p})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 14, fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1 }}>
    <div style={{ width: 58, height: 58, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', boxShadow: `0 10px 20px -10px ${col}aa` }}><Icon name={ikon} size={36} color={B.white} /></div>
    {teks}
    {/* return per tahun menempel di ujung nama (pil di wadah selebar 0 → posisi = ujung teks + celah) */}
    {ekor ? <div style={{ position: 'relative', width: 140, height: 40 }}><div style={{ position: 'absolute', left: 0, top: 20 }}>{ekor}</div></div> : null}
  </div>);

/** BATANG KOMPOSISI: "sebagian besar isinya …" — segmen tumbuh kiri → kanan di kata instrumennya; label di segmen mayoritas */
const BatangKomposisi: React.FC<{ f: number; x: number; p: number; isi: { j: Jenis; p: number }[]; at: number }> = ({ f, x, p, isi, at }) => {
  const g = R(f, at, at + 45, 0, 1, io);
  const kiri = isi.map((_, i) => isi.slice(0, i).reduce((s, q) => s + q.p, 0) * BAR.w * g);
  return (
    <div style={{ position: 'absolute', left: x - BAR.w / 2, top: Y.bar - BAR.h / 2, width: BAR.w, height: BAR.h, borderRadius: 999, background: B.white, border: `2.5px solid ${B.grayLite}`, overflow: 'hidden', transform: `scale(${p})`, boxSizing: 'border-box' }}>
      {isi.map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: kiri[i], top: 0, bottom: 0, width: s.p * BAR.w * g, background: JENIS[s.j].col, borderLeft: i > 0 ? `2.5px solid ${B.white}` : undefined, display: 'flex', alignItems: 'center', paddingLeft: 14, boxSizing: 'border-box', overflow: 'hidden' }}>
          {i === 0 ? <span style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: B.white, whiteSpace: 'nowrap', opacity: R(f, at + 25, at + 50, 0, 1, io) }}>{JENIS[s.j].nama}</span> : null}
        </div>))}
    </div>);
};

/** pil "Mirip …" di antara panah dan kartu grafik */
const PilMirip: React.FC<{ f: number; x: number; teks: string; col: string; p: number; at: number }> = ({ f, x, teks, col, p, at }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: Y.pil, transform: `translate(-50%, -50%) scale(${p})`, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '9px 22px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}aa` }}>
    <WordText halus f={f} at={at} style={{ fontSize: 28 }}>{teks}</WordText>
  </div>);

/**
 * KARTU GRAFIK — tiap kolom memperagakan "karakter"-nya. Simon 8 Okt: "linechart yang diganti hanya di saham dan index saja" +
 * "pastikan candlesticknya realistis" → candle = DATA PASAR ASLI dari arsip proyek sendiri (tanpa unduhan):
 *   saham  = ADMR.JK mingguan 6 Okt – 8 Des 2025 (OHLC riil, terverifikasi ke TradingView di Video 10 · data/admrWeekly.ts)
 *   indeks = IHSG (^JKSE) bulanan Apr – Des 2020 (OHLC riil, Video Quant Trading · chart-data.ts); garis putus-putus = penutupan IHSG
 *   obligasi = line chart tenang (bukan candlestick)
 * Semua dinormalisasi ke % dari harga buka pertama, skala % SAMA (−6 … +43 %) → tenang vs bergejolak vs mengikuti indeks terbandingkan
 * jujur. Hijau = naik, merah = turun (ARAH). Badan 60 % jarak candle, sumbu tipis (proporsi chart nyata).
 */
type OHLC = [number, number, number, number];
const ADMR: OHLC[] = [[1095, 1530, 1065, 1370], [1335, 1480, 1180, 1195], [1225, 1400, 1220, 1315], [1325, 1540, 1320, 1395], [1395, 1440, 1320, 1400],
  [1405, 1480, 1330, 1340], [1340, 1385, 1260, 1300], [1300, 1330, 1255, 1270], [1270, 1325, 1255, 1290], [1300, 1515, 1300, 1400]];
const IHSG: OHLC[] = [[4539, 4795, 4488, 4716], [4716, 4807, 4507, 4754], [4754, 5125, 4711, 4905], [4905, 5236, 4895, 5150],
  [5150, 5378, 5132, 5238], [5238, 5371, 4837, 4870], [4870, 5174, 4860, 5128], [5128, 5824, 5128, 5612], [5612, 6175, 5547, 5979]];
const persen = (d: OHLC[]): OHLC[] => d.map((b) => b.map((v) => (v / d[0][0] - 1) * 100) as OHLC);
const DERET: Record<Exclude<Lilin, 'stabil'>, OHLC[]> = { gejolak: persen(ADMR), indeks: persen(IHSG) };
const GARIS_OBLIGASI = [0, 0.7, 0.5, 1.4, 2.1, 1.8, 2.8, 3.5, 3.2, 4.2];
const SKALA = { lo: -6, hi: 43 };
const KartuLilin: React.FC<{ f: number; x: number; jenis: Lilin; col: string; p: number; mulai: number }> = ({ f, x, jenis, col, p, mulai }) => {
  if (p <= 0.001) return null;
  const kiri = x - KARTU.w / 2, atas = Y.kartu - KARTU.h / 2;
  const pad = { x: 24, y: 20 }, w = KARTU.w - 2 * pad.x, h = KARTU.h - 2 * pad.y;
  const x0 = kiri + pad.x, top = atas + pad.y;
  const n = jenis === 'stabil' ? GARIS_OBLIGASI.length : DERET[jenis].length;
  const px = (k: number) => x0 + (w / n) * (k + 0.5);
  const py = (v: number) => top + h * (1 - (v - SKALA.lo) / (SKALA.hi - SKALA.lo));
  const gIdx = jenis === 'indeks' ? R(f, mulai, mulai + 60, 0, 1, io) : 0;
  const a = jenis === 'indeks' ? mulai + 60 : mulai;
  const g = R(f, a, a + 90, 0, n, (t) => t);
  const bw = (w / n) * 0.6;
  /* Simon 9 Okt: NOMINAL — nilai per unit reksa dana (mulai Rp1.000) BERJALAN bersama grafiknya: nilai titik/candle terakhir yang sudah
   * tergambar (persen → 1.000 × (1 + %)). Di BAWAH kartu, tengah (di pojok kiri-atas menempel candle pertama saham — terlihat di still). */
  const nilaiKini = (() => {
    if (jenis === 'stabil') {
      const pos = Math.max(0, Math.min(n - 1, (g / n) * (n - 1)));
      return GARIS_OBLIGASI[Math.floor(pos)]; // per titik data (dulu interpolasi: angka berkedip ±1 tiap frame, terukur)
    }
    const d = DERET[jenis];
    if (g <= 0) return d[0][0];
    const k = Math.min(n - 1, Math.ceil(g) - 1);
    return lerp(d[k][0], d[k][3], io(Math.max(0, Math.min(1, g - k))));
  })();
  return (
    <>
      <div style={{ position: 'absolute', left: kiri, top: atas, width: KARTU.w, height: KARTU.h, borderRadius: 20, background: B.white, border: `2.5px solid ${col}`, boxShadow: `0 10px 24px -12px ${col}aa`, transform: `scale(${p})`, transformOrigin: 'center' }} />
      {p > 0.95 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {[0.25, 0.75].map((t) => <line key={t} x1={kiri + 18} x2={kiri + KARTU.w - 18} y1={top + h * t} y2={top + h * t} stroke={B.grayLite} strokeWidth={1.5} opacity={0.6} />)}
          {gIdx > 0.001 ? <polyline points={garisSampai(DERET.indeks.map((b) => b[3]), gIdx, px, py)} fill="none" stroke={B.gray} strokeWidth={3.5} strokeDasharray="8 9" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {jenis === 'stabil' && g > 0.001 ? <polyline points={garisSampai(GARIS_OBLIGASI, g / n, px, py)} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
          {jenis !== 'stabil' && DERET[jenis].map(([o, hi, lo, c], k) => {
            const t = io(Math.max(0, Math.min(1, g - k)));
            if (t <= 0.001) return null;
            const warna = c >= o ? ARAH.naik : ARAH.turun;
            const yo = py(o), yc = lerp(yo, py(c), t);
            return (
              <g key={k}>
                <line x1={px(k)} x2={px(k)} y1={lerp(yo, py(hi), t)} y2={lerp(yo, py(lo), t)} stroke={warna} strokeWidth={2.5} strokeLinecap="round" />
                <rect x={px(k) - bw / 2} y={Math.min(yo, yc)} width={bw} height={Math.max(2.5, Math.abs(yc - yo))} rx={2} fill={warna} />
              </g>);
          })}
        </svg>) : null}
      <PilNominal x={x} y={atas + KARTU.h + 32} teks={rpPenuh(1000 * (1 + nilaiKini / 100))} arah={Math.max(-1, Math.min(1, nilaiKini / 3))} p={popIn(f, mulai)} size={24} lebarMin={136} />
    </>);
};
/** titik-titik polyline sampai pecahan `u` (0…1) dari panjang deret, ujung diinterpolasi (garis tumbuh mulus) */
const garisSampai = (v: number[], u: number, px: (k: number) => number, py: (x: number) => number) => {
  const t = Math.max(0, Math.min(1, u)) * (v.length - 1), n = Math.floor(t), r = t - n;
  const pts = v.slice(0, n + 1).map((x, k) => `${px(k).toFixed(1)},${py(x).toFixed(1)}`);
  if (n < v.length - 1) pts.push(`${lerp(px(n), px(n + 1), r).toFixed(1)},${lerp(py(v[n]), py(v[n + 1]), r).toFixed(1)}`);
  return pts.join(' ');
};

/** lingkaran ikon (isi terangkat — sama dengan IsiSlot: bercincin putih) */
const Bulat: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon }> = ({ x, y, d, col, ikon }) => (
  <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: col, border: `${5 * SK}px solid ${B.white}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', boxShadow: `0 ${14 * SK}px ${30 * SK}px -${12 * SK}px ${col}aa` }}>
    <Icon name={ikon} size={d * 0.56} color={B.white} />
  </div>);

/** kepala baris "Underlying asset" (baris batang komposisi) — rata kanan di KEPALA_KANAN */
const KepalaUnderlying: React.FC<{ p: number }> = ({ p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: KEPALA_KANAN - KEPALA_W, width: KEPALA_W, top: Y.bar, transform: `translateY(-50%) scale(${p})`, transformOrigin: 'center', boxSizing: 'border-box', textAlign: 'center', background: B.white, border: `2.5px solid ${B.turq}`, borderRadius: 999, padding: '12px 18px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${B.turq}cc` }}>Underlying asset</div>);

/** kepala baris akibat (return / volatilitas / risiko) — sama lebar, rata kanan di KEPALA_KANAN */
const ChipAkibat: React.FC<{ p: number; a: (typeof AKIBAT)[number] }> = ({ p, a }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: KEPALA_KANAN - KEPALA_W, width: KEPALA_W, boxSizing: 'border-box', top: a.y, transform: `translateY(-50%) scale(${p})`, transformOrigin: 'center', display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${a.col}`, borderRadius: 999, padding: '4px 20px 4px 4px', fontFamily: F, fontSize: 26, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${a.col}88` }}>
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: a.col, display: 'grid', placeItems: 'center' }}><Icon name={a.ikon} size={24} color={B.white} /></div>
    {a.teks}
  </div>);

export const S07_BEAT = { reksa, label, tapi, dana, apa, karena, kalau, obligasi, karakternya, saham, indeks, jadi, ret, volatilitas, risikonya, bergantung, asset };
