import React from 'react';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { SIMPUL_PETA } from '../parts/peta';
import { AbsoluteFill, Easing } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';


import { B, F, R, io, mixHex, WARNA as WO } from '../theme';
import type { KunciIkon } from '../ikon';
import { card, cin, Icon, lerp, popOut, popScale, Sorot, geserSorot, WordText, MODE_UKUR } from '../parts/kit';
import { FotoLingkar } from '../parts/gedung';
import { popIn } from '../parts/pop';
import { POHON } from './pohon.gen';
import { UANG } from './uang.gen';

/**
 * SCENE 02 — TABUNGAN & DEPOSITO · IDE VISUAL (6 Okt). Brief = kolom VISUAL + TEXT naskah Simon:
 *   SAVINGS → Interest → High Liquidity · TIME DEPOSIT → Interest → Fixed Tenor → Relatively Higher Rate
 *   TEXT: "Tabungan / Deposito — return utamanya dari bunga"
 * Benang merah dari Scene 01: lingkaran bab 01 (celengan) diambil alih PERSIS di geometri akhir peta bab, LANGSUNG ke kartu
 * Tabungan (Simon 8 Okt: tanpa berhenti di tengah), lalu Deposito membelah keluar saat disebut.
 * Simon 8 Okt — visual pendukung (bukan teks) di zona kiri/kanan lingkaran kartu, semua aset uang Simon:
 *   bunga → pohon uang (Bunga.svg Simon) di kanan-bawah kartu; Tabungan sedikit uang, Deposito tumbuh + koin bertambah di "imbalan … lebih tinggi"
 *   tabungan fleksibel → uang kertas hijau keluar dari celengan ke belanjaan ("digunakan kapan saja") + lencana jam
 *   deposito → bundel uang masuk ke deposito ("menyimpan dana"), lencana gembok + cincin waktu ("selama periode tertentu")
 */
/**
 * AWAL SCENE 02 = arahan Simon (6 Okt): suara Scene 1 masih terdengar sampai Ide-S02 lama "00:00.48" (global 2828) →
 * "langsung mulai saja scene 2 di menit 00:00.49" = global 2829. Komposisi Ide-S02 kini DIMULAI di sini (frame 0 = 2829).
 * Cue pertama Scene 02 ("Kita…") f2840 (SCENES[1].a); transisi visual mulai 11 frame lebih dulu.
 */
export const S2 = BATAS.s2; // = 2829 + VO_OFFSET (VO mulai 00:00.31, src/offset.ts)
/** frame 0 komposisi Ide-S02 — timecode Simon untuk Scene 02 diukur dari sini */
export const IDE_S02_AWAL = S2;

const [kita, , tabungan, deposito, , yaitu, bunga, tabungan2, , digunakan, kapan, deposito2, menyimpan, periode,
  imbalan, bunga2, tinggi, karakter, mengejar, tinggi2, tapi, sederhana, stabil, dipahami] = urut(['kita', 'familiar',
  'tabungan', 'deposito', 'cara', 'yaitu', 'bunga', 'tabungan', 'fleksibel', 'digunakan', 'kapan', 'deposito',
  'menyimpan', 'periode', 'imbalan', 'bunga', 'tinggi', 'karakter', 'mengejar', 'tinggi', 'tapi', 'sederhana', 'stabil',
  'dipahami'], S2);
/* kata pemicu visual pendukung (Simon 8 Okt) — berurutan sesudah "Tabungan biasa…" */
const [fleksibel, uangnya, saja, mengharuskan, dana, selama, dengan] = urut(['fleksibel', 'uangnya', 'saja', 'mengharuskan',
  'dana', 'selama', 'dengan'], tabungan2);

/* ── geometri ── */
const CARD_W = 600, CARD_H = 600, CARD_Y = 236;
const CX = [590, 1330];
const PUSAT_X = 960; // kartu Tabungan sendirian di tengah sebelum Deposito membelah
const IC_Y = CARD_Y + 132, IC_D = 184;
const rowY = (i: number) => CARD_Y + 364 + i * 70;
/** pose akhir lingkaran bab 01 di Scene 01 (nodeX(0)=235, NODE_Y 471, NODE_D 170) — nomor bab dihapus (Simon 8 Okt) */
const BAB01 = { x: 235, y: 471, d: 170, labTop: 471 + 85 + 34 }; // pose NETRAL akhir Scene 01
/** Simon 8 Okt: "jangan berhenti ditengah layar dulu tapi langsung saja ke split screennya" — simpul bab 01 meluncur dari peta
 *  LANGSUNG ke posisi ikon kartu Tabungan (dulu berhenti di tengah: lingkaran besar + cincin + label 2 baris). Mulai sesudah bab 02–06
 *  turun (S2+20…S2+104) supaya tidak melintas di atas mereka; kartu Tabungan terbentuk bersamaan (pusat S2+100). */
const GERAK = [S2 + 60, S2 + 120];
const MASUK_KARTU = [S2 + 100, deposito + 10]; // pusat tanjakan 60f kartu (Deposito = waktu lama, Simon: "timingnya sama seperti sekarang")
// judul "Tabungan" dipusatkan DI kata "tabungan" (dulu +15) — kartu baru mendarat ±f105, tanpa ini kartu kosong-judul ±40f

/* ── visual pendukung: zona kiri/kanan lingkaran kartu (lebar kartu 600: lingkaran Ø184 di tengah, zona ±196 dari pusatnya) ── */
const ZONA = 196;
const BELANJA = { x: CX[0] - ZONA, y: IC_Y, d: 150 }; // tujuan uang tabungan: kebutuhan sehari-hari
const BUNDEL = { x: CX[1] + ZONA, y: IC_Y, w: 150, h: (150 * 251.1) / 312.8 }; // dana yang disimpan di deposito
const LEMBAR = { w: 120, h: (120 * 596) / 648 }; // uang kertas Simon (bentuk = tangkapan layar Simon 8 Okt), hijau #7EC151
/**
 * POHON UANG (Simon 8 Okt: "ganti coin itu dengan pohon (Bunga.svg)", mockup = kanan-bawah kartu) — src/s02/pohon.gen.ts.
 * Tinggi tinta 225 px (= mockup Simon), dasar pot di y lokal kartu 560, tepi kanan tinta x lokal 578 (sesudah tumbuh ×1,12: 587, kartu 600).
 * Baris Deposito "Bunga relatif lebih tinggi" dibuat DUA baris (teks sama) — satu baris (ujung kanan x lokal ±475, diukur) memakan sudut
 * kanan-bawah: pot tinggal ±20 px dari "tinggi" dan daun mepet judul (diukur 8 Okt).
 */
const POHON_VB = { x: 455, y: 12, w: 1403, h: 1972 }; // viewBox tinta (Bunga.svg 0 0 2250 2000)
const POT = { x: 1120, y: 1974 }; // dasar pot = poros muncul & tumbuh
const POHON_S = 225 / 1954; // tinggi tinta 1954 unit → 225 px
const POHON_DX = 199.4; // dasar pot relatif pusat lingkaran kartu (lokal 300 → 499,4)
const POHON_DASAR = CARD_Y + 560;
const TUMBUH = 0.12; // Deposito "lebih tinggi sedikit": tanjakan 60f dipusatkan di "imbalan" (awal kalimat; di "tinggi" meninggalkan diam 1,8 dtk)
const MUNCUL_POHON = [bunga + 10, bunga + 30]; // pusat pop pohon (dari pot), lalu uangnya pop satu per satu
/** isi uang (indeks POHON): Tabungan SEDIKIT (Simon: "kurangi jumlah uangnya") — Deposito sama di awal, lalu +6 koin */
const ISI_AWAL = [10, 13, 11, 17, 23]; // 3 koin depan + 2 lembar depan
const ISI_TAMBAH = [2, 12, 5, 3, 8, 4]; // koin lain (atas, kanan-atas, kiri, kanan, kiri-bawah, kanan-bawah) — pop sepanjang "dengan imbalan tingkat bunga
// yang relatif" (mulai "dengan", jarak 28f), pohon meninggi di "imbalan"
/** tiga lembar keluar dari celengan ke belanjaan: "uangnya … digunakan … kapan saja" */
const KELUAR = [uangnya, digunakan, saja];
/** lencana di tepi kanan-atas lingkaran kartu — Simon 8 Okt: gembok turkis bertabrakan dgn lingkaran Deposito (turkis) → oranye */
// dx 108 (dulu 84): Simon 12 Okt foto brankas Deposito — sudut kanan-atas brankas (0,84 D, pusat massa di pusat) tertimpa lencana di dx 84;
// di 108 jaraknya 7 px ke brankas, 36 px ke celengan Tabungan (terukur dari alfa foto). Tinggi tetap. Kedua kartu sama.
const LENCANA = { dx: 108, dy: -80, d: 64 };
const CINCIN = { r: 108, tebal: 7 };
const GOLD = '#FFCB56', MERAH = '#D51C39'; // Simon 8 Okt: tag "mengejar return tertinggi" emas → merah saat dicoret
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

type Baris = { teks: string; ikon: KunciIkon; at: number; dy?: number; col?: string; sumber?: string };
const ROWS: Baris[][] = [
  // naskah REVISI 16 Okt (kolom VISUAL + feedback "berikan rata-rata return saat ini"): baris kedua Tabungan & ketiga Deposito = rata-rata
  // bunga per tahun + sumbernya (dulu "Likuiditas tinggi" · "Bunga relatif lebih tinggi"); dua baris angka memberi ruang pohon uang
  [{ teks: 'Bunga', ikon: 'bunga', at: bunga + 20, col: WO.oranye },
    { teks: '0,60%–0,95%\nper tahun', ikon: 'sukuBunga', at: kapan, dy: 16, col: WO.langit, sumber: 'Sumber: Bank Indonesia' }],
  [{ teks: 'Bunga', ikon: 'bunga', at: bunga + 40, col: WO.oranye }, { teks: 'Tenor tetap', ikon: 'tenor', at: periode, col: WO.ungu },
    { teks: '4,23%–5,75%\nper tahun', ikon: 'bungaLebihTinggi', at: bunga2, dy: 16, col: WO.oranyeMuda, sumber: 'Sumber: Badan Pusat Statistik' }],
];
const WARNA = [B.blue, B.turq];
const NAMA = ['Tabungan', 'Deposito'];
const IKON_REK: KunciIkon[] = ['tabungan', 'deposito'];
const MASUK = [tabungan, deposito];

export const Scene02: React.FC<{ f: number }> = ({ f }) => {
  if (f < S2) return null;
  // KELUAR = milik Scene 03 (Simon 8 Okt: peta bab dipertahankan di setiap instrumen): MASKER LINGKARAN — seluruh isi menyusut ke
  // simpul bab 01 (Tabungan & Deposito) di peta bab pembuka Scene 03, berubah biru + ikonnya. 50f mulai BATAS.s3. (Dulu mengecil + pudar.)
  if (f >= BATAS.s3 + 52) return null;
  const ex = R(f, BATAS.s3, BATAS.s3 + 50, 0, 1, io);
  const kam3 = kamera('S03', BATAS.s3 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam3, SIMPUL_PETA(0)), r: SIMPUL_PETA(0).r * kam3.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6); // isi menyusut lebih lambat dari lingkarannya → terpotong bertahap
  // sorot bab 01 DIMULAI di Scene 02 (Simon 6 Okt): cincin + membesar 1→1,16 di posisi peta (bab lain meredup di Scene01), lalu bab 02–06
  // turun dan bab 01 meluncur LANGSUNG ke ikon kartu Tabungan (GERAK)
  const rH = R(f, S2, S2 + 60, 0, 1, io);
  const rM = R(f, GERAK[0], GERAK[1], 0, 1, io);
  const dSorot = BAB01.d * (1 + 0.16 * rH);
  /* Deposito membelah keluar dari lingkaran Tabungan — Tabungan terbentuk DI TENGAH dan baru bergeser ke kiri saat membelah
   * (Simon 7 Okt: visual di titik tengah frame di setiap momen; dulu Tabungan sudah di kiri ±1 dtk sebelum Deposito ada) */
  const rD = cin(f, deposito);
  const cx0 = lerp(PUSAT_X, CX[0], rD), cx1 = lerp(PUSAT_X, CX[1], rD);
  const c0 = { x: lerp(BAB01.x, cx0, rM), y: lerp(BAB01.y, IC_Y, rM), d: lerp(dSorot, IC_D, rM) };
  const ring = rH * (1 - rM);
  const babOut = 1 - R(f, S2 + 50, S2 + 90, 0, 1, io); // label peta "Tabungan & Deposito" pudar saat simpul berangkat
  const c1 = { x: cx1, y: IC_Y, d: lerp(IC_D * 0.6, IC_D, rD) };
  /* fokus: B3 Tabungan, B4–B5 Deposito, B6 keduanya */
  const fokusTab = cin(f, tabungan2) * (1 - cin(f, deposito2));
  const fokusDep = cin(f, deposito2) * (1 - cin(f, karakter));
  const dim = [fokusDep, fokusTab];
  const opK = [1 - 0.55 * dim[0], 1 - 0.55 * dim[1]]; // visual pendukung ikut meredup bersama kartunya
  // kartu: opasitas maks 0,9999 (cek 12 Okt) — kembali TEPAT 1 di akhir fokus ("Karakter") mengganti jalur raster kartu → teks & ikon
  // berganti anti-alias 1 frame (lonjakan f1389 lokal, 4.866 px); tak pernah tepat 1 → satu jalur
  const kam = kamera('S02', f);
  const fotoTab = R(f, GERAK[1], GERAK[1] + 30, 0, 1, io); // ikon Tabungan → foto celengan sesudah simpul mendarat di kartu

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS peta bab yang baru */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s3, BATAS.s3 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* judul = TEXT naskah Simon; sorotan di bawah "bunga" */}
      <Headline f={f} at={yaitu} sorotAt={bunga + 20} />

      {/* ISI — kamera pusat (Simon 7 Okt: visual di titik tengah frame di setiap momen); judul tidak ikut */}
      {/* kamera: translate3d + rotasi mikro, tak pernah tepat 0 (gayaKamera = translate 2D murni → Chrome membulatkan ke piksel di ekor ease = judder) */}
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s3 - 30)}>
      {[1, 0].map((k) => { /* Deposito digambar DI BELAKANG Tabungan: muncul dari baliknya saat membelah */
        const masuk = cin(f, MASUK_KARTU[k]);
        const bk = R(f, MASUK_KARTU[k] + 20, MASUK_KARTU[k] + 60, 0, 1, io); // bingkai warna (inOut cubic)
        const dx = (k === 0 ? cx0 : cx1) - PUSAT_X;
        const d = dim[k];
        return (
          <div key={k} style={{ position: 'absolute', left: PUSAT_X - CARD_W / 2, top: CARD_Y, width: CARD_W, height: CARD_H, opacity: Math.min(0.9999, 1 - 0.55 * d), transform: `${geser(dx, 0)} scale(${1 - 0.03 * d})`, willChange: 'transform' }}>
            {/* bingkai warna di belakang kartu (gaya kartu CTA/Scene 01) */}
            {masuk > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: CARD_H, borderRadius: 32, border: `3px solid ${WARNA[k]}`, opacity: bk, transform: geser(-14 * bk, -14 * bk) }} /> : null}
            <div style={{ position: 'absolute', inset: 0, opacity: masuk, transform: `${geser(0, (1 - masuk) * 48)} scale(${lerp(0.94, 1, masuk)})`, ...card(WARNA[k]) }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 252, textAlign: 'center' }}>
                <WordText f={f} at={k === 0 ? tabungan : MASUK[k] + 15} halus style={{ fontFamily: F, fontSize: 48, fontWeight: 800, color: B.night, letterSpacing: '-.02em' }}>{NAMA[k]}</WordText>
              </div>
              {ROWS[k].map((r, i) => <Atribut key={r.teks + i} f={f} r={r} y={rowY(i) - CARD_Y} col={WARNA[k]} pulse={k === 1 && i === 2 ? tinggi : undefined} />)}
            </div>
          </div>);
      })}

      {/* ── visual pendukung DI BELAKANG lingkaran (benda masuk/keluar lewat baliknya) ── */}
      <Belanja f={f} op={opK[0]} />
      {KELUAR.map((c, i) => <LembarKeluar key={i} f={f} c={c} op={opK[0]} />)}
      <BundelMasuk f={f} x1={cx1} op={opK[1]} />
      <CincinWaktu f={f} x={cx1} op={opK[1]} />

      {/* lingkaran ikon (di atas kartu): Tabungan = bab 01 yang diambil alih, Deposito membelah darinya */}
      {/* Simon 8 Okt: "hapus saja bayangan dibelakang icon tabungan dan deposito" — Deposito tanpa bayangan; Tabungan memudarkan bayangan
          peta selama meluncur ke kartu (simpul peta S01 berbayang → tanpa letikan di serah-terima) */}
      {/* Simon 12 Okt "ini gambar brankasnya" (usulan ilustrasi realistis S02: brankas = dana dikunci selama periode tertentu): Deposito = foto
          brankas UTUH (gaya Tabungan sesudah "jangan dimasking, tapi tetap ada lingkarannya") di lingkaran NEON BLUE — terukur (CIELAB) ΔE ≥ 90
          ke badan brankas abu (L 30), uang pink & logam perak (turkis: 31–58, logam perak 31 → mirip), dan beda warna dengan lingkaran Tabungan
          yang kini turkis (konteks mirip → warna beda). Ukuran 0,84 D: jari tinta terjauh dari pusat massa 100,5 px < tepi dalam cincin waktu
          oranye (104,5). Pusat massa foto (x 0,524 · y 0,479) di pusat lingkaran: geser −0,0198 D, alas 0,909 r. Muncul bersama lingkarannya
          saat membelah dari Tabungan (ikon $ tidak dipakai lagi). Foto di ukuran pikselnya sendiri (pelajaran emas S03). */}
      <Lingkaran x={c1.x} y={c1.y} d={c1.d} col={B.blue} ikon={IKON_REK[1]} op={Math.min(1, rD * 3) * (1 - 0.55 * dim[1])} bayang={0} ikonOp={0} />
      <FotoLingkar k="brankas" x={c1.x - 0.0198 * c1.d} cy={c1.y} D={c1.d} s={1} warna="none" lebar={0.84} alas={0.909} masker={false} op={Math.min(1, rD * 3) * (1 - 0.55 * dim[1])} />
      {/* pembungkus = pembungkus 'turun' simpul peta di Scene 01 (translate3d 0,0.03 + rotasi mikro) → rantai transform identik di serah-terima */}
      <div style={{ position: 'absolute', inset: 0, transform: 'translate3d(0, 0.03px, 0) rotate(0.001deg)' }}>
      <Lingkaran x={c0.x} y={c0.y} d={c0.d} col={mixHex(WARNA[0], B.turq, fotoTab)} ikon={IKON_REK[0]} op={1 - 0.55 * dim[0]} ring={ring} bayang={1 - rM} ikonOp={1 - fotoTab} />
      {/* Simon 12 Okt (berkas "Celengan Pink dan Buku Tabungan.png", sesudah usulan ilustrasi realistis S02): kartu Tabungan = foto celengan +
          buku tabungan (1,1 D, alas 0,62 r, puncak menyembul), memudar dari ikon peta bab sesudah simpul mendarat di kartu (selesai di kata
          "tabungan"). Lalu "jangan dimasking, tapi tetap ada lingkarannya, dan ganti warna lingkaran" + "buat warna yang tidak menyatu dengan
          gambarnya": foto UTUH (tanpa masker) di atas lingkaran Dark Turquoise — terukur: Neon Blue sekerah buku tabungan (L 42 vs 46 →
          menyatu), Dark Orange menyatu dengan koin (ΔE ±11); turkis L 76 memisahkan buku (L 46), celengan pink & koin (ΔE ≥ 62). Lingkaran
          berganti biru → turkis bersama ikon → foto. Foto di ukuran pikselnya sendiri (pelajaran emas S03). */}
      {/* Simon 12 Okt "perhatikan alignment visualnya": tanpa masker, alas 0,62 r membuat foto MELAYANG di atas pusat lingkaran (bawah 35 px
          turkis kosong, koin atas menyembul 21 px) → kini PUSAT MASSA foto (alfa: x 0,499 · y 0,589 tinggi) tepat di pusat lingkaran:
          alas = 0,411 × tinggi foto (0,926 D) ÷ r = 0,76 r. Koin di celah menyembul 8 px, celengan/buku/koin di tengah lingkaran, sebaris
          dengan pusat lingkaran Deposito. */}
      <FotoLingkar k="tabungan" x={c0.x} cy={c0.y} D={c0.d} s={1} warna="none" lebar={1.1} alas={0.76} masker={false} op={fotoTab * (1 - 0.55 * dim[0])} />
      {/* nama bab peta ikut lingkaran lalu pudar saat simpul berangkat ke kartu */}
      {babOut > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 270, textAlign: 'center', lineHeight: 1.18, opacity: babOut, transform: geser(c0.x - 135, c0.y + BAB01.labTop - BAB01.y) }}>
          {/* struktur per kata = label peta bab Scene 01 (WordText yang sudah selesai) — tanpa lompatan saat serah-terima */}
          <WordText halus f={f} at={S2 - 1000} rataBaris style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>Tabungan & Deposito</WordText>
        </div>) : null}
      </div>

      {/* lencana: jam "kapan saja" di celengan, gembok di deposito ("mengharuskan … menyimpan … selama periode tertentu") */}
      <Lencana x={cx0 + LENCANA.dx} p={popIn(f, kapan)} ikon="kapanSaja" op={opK[0]} />
      <Lencana x={cx1 + LENCANA.dx} p={popIn(f, selama)} ikon="gembok" op={opK[1]} />

      {/* bunga: pohon uang di kanan-bawah tiap kartu; Deposito tumbuh + koin bertambah di "imbalan … lebih tinggi" */}
      <PohonUang f={f} k={0} cx={cx0} op={opK[0]} />
      <PohonUang f={f} k={1} cx={cx1} op={opK[1]} />

      {/* "bukan untuk mengejar return paling tinggi" → coret · lalu tiga sifat */}
      <ReturnTertinggi f={f} />
      <Sifat f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.blue, opacity: R(f, BATAS.s3 + 22, BATAS.s3 + 48, 0, 1, io) }} /> : null}
    {/* ikon bab memudar masuk di atas isian → saat ditukar ke simpul peta (BATAS.s3+52) gambarnya sudah identik */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s3 + 34, BATAS.s3 + 48, 0, 1, io) }}><Icon name="tabungan" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);

  /* ── komponen lokal (memakai f & beat di atas) ── */
  function ReturnTertinggi({ f: ff }: { f: number }) {
    const p = popIn(ff, mengejar) * popOut(ff, tapi);
    if (p <= 0.001) return null;
    const coret = R(ff, tinggi2 - 30, tinggi2 + 30, 0, 1, io);
    // Simon 8 Okt: emas (#FFCB56) sebelum dicoret → merah (#D51C39) saat dicoret (bingkai, ikon, garis coret). Tanpa redup supaya
    // merahnya tetap #D51C39 (dulu abu-abu + redup 0,6).
    const col = campur(GOLD, MERAH, coret);
    return (
      <div style={{ position: 'absolute', left: 960, top: 900, transform: `translate(-50%, -50%) scale(${p})` }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `3px solid ${col}`, borderRadius: 999, padding: '12px 28px', fontFamily: F, fontSize: 30, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', boxShadow: `0 12px 28px -14px ${col}aa` }}>
          <Icon name="trofi" size={32} color={col} />
          Mengejar return tertinggi
          <div style={{ position: 'absolute', left: 18, top: '50%', height: 4, marginTop: -2, width: `calc(${coret} * (100% - 36px))`, background: MERAH, borderRadius: 2 }} />
        </div>
      </div>);
  }
  function Sifat({ f: ff }: { f: number }) {
    const S = [{ t: 'Sederhana', i: 'sederhana' as KunciIkon, at: sederhana, c: B.blue }, { t: 'Relatif stabil', i: 'stabil' as KunciIkon, at: stabil, c: B.turq },
      { t: 'Mudah dipahami', i: 'mudahDipahami' as KunciIkon, at: dipahami, c: B.orange }];
    if (ff < sederhana - 30) return null;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 900, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', gap: 28 }}>
        {S.map((s) => {
          const p = popIn(ff, s.at);
          return (
            <div key={s.t} style={{ transform: `scale(${p})`, opacity: p > 0 ? 1 : 0, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${s.c}`, borderRadius: 999, padding: '12px 28px', fontFamily: F, fontSize: 30, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', boxShadow: `0 12px 28px -14px ${s.c}88` }}>
              <Icon name={s.i} size={34} color={s.c} />
              {s.t}
            </div>);
        })}
      </div>);
  }
};

/* hex → rgba (bayangan lingkaran yang memudar) */
const rgba = (hex: string, a: number) => `rgba(${[0, 1, 2].map((i) => parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16)).join(',')},${a.toFixed(3)})`;

/* campur dua warna hex (t 0→1) — perubahan warna tag dipusatkan di kata "tinggi" bersama garis coret */
const campur = (a: string, b: string, t: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + 2 * i, 3 + 2 * i), 16);
  return `rgb(${[0, 1, 2].map((i) => Math.round(lerp(h(a, i), h(b, i), t))).join(',')})`;
};

/* baris atribut di dalam kartu: ikon dalam lingkaran berwarna + teks; masuk geser-pudar 60f dipusatkan di katanya */
const Atribut: React.FC<{ f: number; r: Baris; y: number; col: string; pulse?: number }> = ({ f, r, y, col, pulse }) => {
  const p = cin(f, r.at);
  if (p <= 0.001) return null;
  const bump = 0; void pulse; // denyut dibuang (Simon 8 Okt)
  return (
    <div style={{ position: 'absolute', left: 56, top: y + (r.dy ?? 0), transform: `translate3d(${(1 - p) * -24}px, calc(-50% + 0.03px), 0) rotate(0.001deg)`, opacity: p, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 54, height: 54, borderRadius: '50%', background: r.col ?? col, display: 'grid', placeItems: 'center', transform: `scale(${popScale(R(f, r.at - 20, r.at + 40, 0, 1, Easing.linear)) + bump})` }}>
        <Icon name={r.ikon} size={40} color={B.white} />
      </div>
      <span style={{ fontFamily: F, fontSize: 30, fontWeight: 700, color: B.night, whiteSpace: 'pre', lineHeight: 1.15 }}>{r.teks}
        {r.sumber ? <span style={{ display: 'block', marginTop: 4, fontSize: 18, fontWeight: 600, color: B.gray }}>{r.sumber}</span> : null}
      </span>
    </div>);
};

/**
 * lingkaran ikon — STRUKTUR SAMA PERSIS dengan simpul peta bab Scene 01 (kotak dasar 170 px + transform scale),
 * supaya rasterisasi di frame serah-terima identik (versi berukuran langsung menggeser tepi ±1 px).
 */
const Lingkaran: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; op: number; ring?: number; bayang?: number; ikonOp?: number }> = ({ x, y, d, col, ikon, op, ring = 0, bayang = 1, ikonOp = 1 }) => {
  if (op <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 170, height: 170, transform: `${geser(x - 85, y - 85)} scale(${d / 170})`, opacity: op }}>
      {ring > 0.001 ? <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.white, border: `3px dashed ${B.grayLite}`, opacity: ring }} /> : null}
      {ring > 0.001 ? <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: `3px solid ${col}`, opacity: ring, boxShadow: `0 0 36px 4px ${col}55` }} /> : null}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: 'scale(1)', boxShadow: bayang > 0.001 ? `0 18px 40px -12px ${rgba(col, 0.667 * bayang)}` : 'none' }}>
        {ikonOp > 0.001 ? <div style={{ opacity: ikonOp < 1 ? ikonOp : undefined, display: 'grid' }}><Icon name={ikon} size={96} color={B.white} /></div> : null}
      </div>
    </div>);
};

/** belanjaan (kebutuhan sehari-hari) di zona kiri kartu Tabungan — tujuan uang yang keluar; berdenyut tiap lembar tiba */
const Belanja: React.FC<{ f: number; op: number }> = ({ f, op }) => {
  // Simon 8 Okt: "ketika sudah membahas deposito pop out icon disebelah tabungan itu" → ease-in-back keluar di "deposito"
  const p = popIn(f, fleksibel) * popOut(f, deposito2);
  if (p <= 0.001) return null;
  const tiba = 0; // denyut tiap lembar tiba dibuang (Simon 8 Okt)
  return (
    <div style={{ position: 'absolute', left: BELANJA.x - BELANJA.d / 2, top: BELANJA.y - BELANJA.d / 2, width: BELANJA.d, height: BELANJA.d, borderRadius: '50%', background: B.blueWash, border: `3px solid ${B.blueLite}`, display: 'grid', placeItems: 'center', transform: `scale(${p + tiba})`, opacity: op }}>
      <Icon name="sehariHari" size={92} color={B.blue} />
    </div>);
};

/** satu lembar uang hijau keluar dari celengan (lewat balik lingkaran) melengkung ke belanjaan — 60f dipusatkan di katanya */
const LembarKeluar: React.FC<{ f: number; c: number; op: number }> = ({ f, c, op }) => {
  if (f <= c - 30 || f >= c + 30) return null;
  const t = R(f, c - 30, c + 30, 0, 1, io);
  const x = lerp(CX[0], BELANJA.x, t);
  const y = IC_Y - 150 * Math.sin(Math.PI * t);
  const s = lerp(0.5, 1, R(t, 0, 0.35, 0, 1, io)) * lerp(1, 0.35, R(t, 0.7, 1, 0, 1, io));
  const a = R(t, 0.82, 1, 1, 0, io);
  return <svg viewBox={UANG.lembar.vb} width={LEMBAR.w} height={LEMBAR.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: a * op, transform: `${geser(x - LEMBAR.w / 2, y - LEMBAR.h / 2)} rotate(${lerp(20, -16, t)}deg) scale(${s})` }} dangerouslySetInnerHTML={{ __html: UANG.lembar.svg }} />;
};

/** bundel uang hijau muncul di zona kanan Deposito ("mengharuskan"), lalu masuk ke deposito lewat balik lingkarannya ("menyimpan dana") */
const BundelMasuk: React.FC<{ f: number; x1: number; op: number }> = ({ f, x1, op }) => {
  const p = popIn(f, mengharuskan);
  const m = R(f, dana - 30, dana + 30, 0, 1, io);
  const a = R(f, dana + 8, dana + 30, 1, 0, io);
  if (p <= 0.001 || a <= 0.001) return null;
  const x = lerp(x1 + ZONA, x1, m);
  return <svg viewBox={UANG.bundel.vb} width={BUNDEL.w} height={BUNDEL.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: a * op, transform: `${geser(x - BUNDEL.w / 2, BUNDEL.y - BUNDEL.h / 2)} scale(${p * lerp(1, 0.3, m)})` }} dangerouslySetInnerHTML={{ __html: UANG.bundel.svg }} />;
};

/** cincin waktu di sekeliling lingkaran Deposito: jalur tipis lalu busur oranye terisi searah jarum jam selama "periode tertentu" */
const CincinWaktu: React.FC<{ f: number; x: number; op: number }> = ({ f, x, op }) => {
  const jalur = R(f, selama + 4, selama + 34, 0, 1, io); // sesudah bundel hilang di balik lingkaran (dana+30)
  if (jalur <= 0.001) return null;
  const p = R(f, periode - 20, dengan, 0, 1, io); // "selama periode tertentu" → penuh di akhir klausa
  const K = 2 * Math.PI * CINCIN.r, S = CINCIN.r + CINCIN.tebal;
  return (
    <svg width={2 * S} height={2 * S} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x - S, IC_Y - S)} rotate(-90deg)`, opacity: op, overflow: 'visible' }}>
      <circle cx={S} cy={S} r={CINCIN.r} fill="none" stroke={B.grayLite} strokeWidth={CINCIN.tebal} opacity={0.55 * jalur} />
      {p > 0.002 ? <circle cx={S} cy={S} r={CINCIN.r} fill="none" stroke={B.orange} strokeWidth={CINCIN.tebal} strokeLinecap="round" strokeDasharray={`${p * K} ${K}`} /> : null}
    </svg>);
};

/** lencana bulat putih di tepi kanan-atas lingkaran kartu: bingkai + ikon OREN (kontras di ungu maupun turkis) */
const Lencana: React.FC<{ x: number; p: number; ikon: KunciIkon; op: number }> = ({ x, p, ikon, op }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - LENCANA.d / 2, top: IC_Y + LENCANA.dy - LENCANA.d / 2, width: LENCANA.d, height: LENCANA.d, borderRadius: '50%', background: B.white, display: 'grid', placeItems: 'center', transform: `scale(${p})`, opacity: op, boxShadow: `0 8px 20px -8px ${B.orange}cc`, border: `3px solid ${B.orange}` }}>
    <Icon name={ikon} size={38} color={B.orange} />
  </div>);

/** pohon uang: pop dari pot (ease-out-back), lalu uangnya pop satu per satu; Deposito tumbuh ×1,12 di "imbalan" + 6 koin sepanjang kalimat itu */
const PohonUang: React.FC<{ f: number; k: number; cx: number; op: number }> = ({ f, k, cx, op }) => {
  const t0 = MUNCUL_POHON[k];
  const p = popIn(f, t0);
  if (p <= 0.001) return null;
  const tumbuh = k === 1 ? 1 + TUMBUH * R(f, imbalan - 30, imbalan + 30, 0, 1, io) : 1;
  const W = POHON_VB.w * POHON_S, H = POHON_VB.h * POHON_S;
  const ax = (POT.x - POHON_VB.x) * POHON_S, ay = (POT.y - POHON_VB.y) * POHON_S;
  const x = cx + POHON_DX, y = POHON_DASAR;
  const tampil = (i: number) => {
    const a = ISI_AWAL.indexOf(i);
    if (a >= 0) return popIn(f, t0 + 24 + 14 * a);
    const b = ISI_TAMBAH.indexOf(i);
    return k === 1 && b >= 0 ? popIn(f, dengan + 28 * b) : 0;
  };
  const sk = p * tumbuh;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: op }}>
      {/* bayangan kontak di bawah pot (sebagian tertutup pot) */}
      <div style={{ position: 'absolute', left: x - 36 * sk, top: y - 7 * sk, width: 72 * sk, height: 14 * sk, borderRadius: '50%', background: 'rgba(22,24,27,0.16)', filter: 'blur(2.5px)' }} />
      <svg viewBox={`${POHON_VB.x} ${POHON_VB.y} ${POHON_VB.w} ${POHON_VB.h}`} width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', transformOrigin: `${ax}px ${ay}px`, transform: `${geser(x - ax, y - ay)} scale(${sk})` }}>
        {POHON.map((b, i) => {
          if (b.jenis === 'dasar') return <g key={i} dangerouslySetInnerHTML={{ __html: b.svg }} />;
          const s = tampil(i);
          if (s <= 0.001) return null;
          return <g key={i} style={{ transformOrigin: `${b.cx}px ${b.cy}px`, transform: `scale(${s})` }} dangerouslySetInnerHTML={{ __html: b.svg }} />;
        })}
      </svg>
    </div>);
};

/** judul TEXT naskah: "Return utamanya dari bunga" — per kata; sorotan tumbuh kiri→kanan di bawah "bunga" (masker putih) */
const Headline: React.FC<{ f: number; at: number; sorotAt: number }> = ({ f, at, sorotAt }) => {
  if (MODE_UKUR) return null;
  const words = ['Return', 'utamanya', 'dari', 'bunga'];
  const sweep = R(f, at - 30, at + 30, 0, 1); // linear — easing di tiap kata
  const h = R(f, sorotAt - 30, sorotAt + 30, 0, 1, io);
  const st: React.CSSProperties = { fontFamily: F, fontSize: 52, fontWeight: 800, letterSpacing: '-.02em', color: B.night };
  const geser = geserSorot(words[words.length - 1]); // spasi seragam sebelum kotak tampil
  if (sweep <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center' }}>
      <span style={{ display: 'inline-block' }}>
        {words.map((w, i) => {
          const p = io(Math.max(0, Math.min(1, (sweep - (i * 0.55) / 3) / 0.45))); // tiap kata inOut cubic sendiri
          const last = i === words.length - 1;
          return (
            <span key={w} style={{ ...st, display: 'inline-block', opacity: p, transform: `translate3d(${last ? 0 : geser * (1 - h)}px, ${(1 - p) * 22 + 0.03}px, 0) rotate(0.001deg)`, whiteSpace: 'pre', position: 'relative' }}>
              {last ? (
                <Sorot w={w} h={h} />) : `${w} `}
            </span>);
        })}
      </span>
    </div>);
};

export const S02_BEAT = { kita, tabungan, deposito, yaitu, bunga, tabungan2, digunakan, kapan, deposito2, menyimpan, periode, imbalan, bunga2, tinggi, karakter, mengejar, tinggi2, tapi, sederhana, stabil, dipahami };
