import React from 'react';
import { Img, staticFile } from 'remotion';
import { B, F, R, bayanganKecil, io, lerp, mixHex, rgba, ARAH } from '../theme';
import { Icon, SWIPE, cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat } from '../parts/umum';
import { Penghubung } from '../parts/kaca';
import { Avatar, Besar, Pendar, PanahArah } from '../parts/v06';
import { S01_T as T, Scene01 } from '../s01/Scene01';
import { IHSG_2012_2021_MINGGU } from '../data/pasar';
import { JALAN_FRAME, LARI_FRAME, TUNIK, gaya as gayaT, alasTerendah, lebarBayangan, rentangAlas, titikKepala, panjangSiklus as panjangT,
  type Kepala, type Pose } from '../flat/rigTegak';
import { TokohKotaLapis, UJUNG_TUNJUK_KOTA, alasTerendahKota, hpDiTanganKota, ikLenganKota, titikKepalaKota } from '../flat/rigKota';
import { SingaRig, poseSinga, simulasiSinga } from '../flat/rigSinga';
import { BayanganBersama, HutanLayar, KOTA, KotaLayar, P_HUTAN, TANAH_LAYAR, TokohTegakLapis, Z_HUTAN, Z_KOTA, ambil, keLayar, simulasi } from '../flat/dunia';

/**
 * SCENE 01 — VERSI DOKUMEN 2D FLAT (uji: "Investing_101_Ide_Visual_2D_Flat_Detail.md"), revisi Simon 26 Okt:
 *  1 baju gua = tunik satu bahu bertotol (screenshot) · 2 latar hutan = Hutan.svg Simon · 3 & 7 hutan & kota LAYAR PENUH (tanpa panel) ·
 *  4 kelompok berbeda-beda (kepala rig lain) · 5 jalan/lari dari pose kunci · 6 panggul menutup pangkal paha · 8 hp menghadap tokoh.
 * Alur: hutan — tokoh berjalan, kelompok tiba-tiba berlari, ia menoleh lalu ikut berlari, singa muncul sebentar di belakang, kelompok berhenti di
 * depan batu · kamera mendekat ke kaki → sapuan kanan→kiri → kota: tokoh yang sama berdiri main hp · hp membesar: harga turun,
 * investor lain JUAL, ia JUAL, kepemilikan hilang, harga pulih, wajah menyesal · layar terbelah dua dunia + otak yang sama + "Otak yang sama.
 * Dua dunia." · f1632–3183 (tidak ada di dokumen) = papan E & F (s01/Scene01.tsx; papan lama A–D dihapus 27 Okt).
 */
const S = 0.82; // piksel per satuan rig gua (edit Simon, tinggi tokoh ±420 px)
const N = 1800;
/** HP BESAR (Simon 27 Okt: "perbaiki bentuk hpnya (buat terlihat realistis)"): proporsi ponsel sungguhan 380 × 780 (1 : 2,05; dulu 440 × 660 = 1 : 1,5
 * seperti tablet) — di layar 357 × 733, tepi kanan 1428 < zona logo 1464, atas 74 / bawah 807 (di atas subtitle) */
const PONSEL = { x: 1250, y: 440, w: 380, h: 780, k: 0.94 };
/** LAMPU KOTA untuk transisi (public/flat/lampu-kota.svg = satu lampu dari panorama kota 023 V02, viewBox 51 × 383, tutup lampu mulai y 370
 * = 4 satuan di bawah tepi viewBox): PUNCAK LAMPU RATA TEPI ATAS FRAME (Simon: "buat tinggi lampu sejajar dengan frame bagian atas, untuk
 * mengisi ruang kosong yang ada persis diatas lampu"), tiang melewati tepi bawah; `tiang` = x pusat tiang */
const LAMPU = { w: 51, h: 383, s: 3.3, tiang: 25.35, atas: -4 * 3.3 };
/** Tangan.svg dipotong (public/flat/tangan-potong.svg, kotak 420 × 920 dari x 700, y 80): ujung telunjuk di (115, 18) */
const TANGAN = { ujung: [115, 18] as [number, number], s: 0.85 };

/* ── WAKTU (onset kata VO, frame global) ── */
const t = {
  kelLari: [T.kelompok + 9, T.kelompok + 23, T.kelompok + 37], // "kelompoknya berlari"
  berhenti: T.kelompok + 5, toleh: T.kelompok + 12, tolehBalik: T.manusia2 + 9, // berhenti tepat di "kelompok" (dulu +17) — kadens 72/45: kelompok perlu jarak
  lari: T.langsung + 30, // "langsung ikut berlari"
  singaNaik: T.reaksi + 3, singaTurun: T.selamat - 14,
  kelBerhenti: [T.selamat + 8, T.selamat + 18, T.selamat + 28], // "menyelamatkan nyawa": berhenti di depan batu
  pelan: T.selamat + 18, diam: T.selamat + 46, sapu: T.hari2 + 28, // diam: tokoh utama berhenti ±160 px di belakang kelompok (transisi paralaks)
  stop: T.melihat2 + 55, ponsel: T.orang + 61,
  dua: T.dunia + 31,
  kelD: [T.dunia + 53, T.dunia + 68], tolehD: T.dunia + 61, tolehBalikD: T.tapi + 27, lariD: T.otak + 20, // lariD dulu +8: kadens 72/45 → kelompok perlu jarak (f1580 wanita tetap di depan)
  jualLainD: [T.dunia + 56, T.dunia + 76], tekanD: T.tapi + 17, jualD: T.tapi + 27,
  otak: T.otak + 26,
};

/* ── GERAK (simulasi sekali; fase langkah dari jarak → kaki menapak) ──
 * SEMUA tokoh rig TEGAK, kadens DIKUNCI (Simon 26 Okt malam: "kunci semua char ke 72 frame jalan dan 45 frame lari, atur ulang posisi supaya
 * susunan adegan tetap sama"): laju = panjang siklus × skala / frame siklus (jalan 72 · lari 45 · campuran di antaranya) → kaki tetap menapak,
 * laju ikut ukuran badan (utama 0,82: 4,97 / 8,43 px/f · keriting 0,79: 4,79 / 8,12 · wanita 0,74: 4,49 / 7,61 · ikal 0,80: 4,85 / 8,22).
 * Tiap simulasi = jumlah gerak `a` (0 diam … 1 bergerak) × laju terkunci pada campuran jalan→lari `r`. */
const laju = (r: number, s: number) => (panjangT(r) * s) / lerp(JALAN_FRAME, LARI_FRAME, r);
/** FASE LANGKAH BERBEDA (Simon 26 Okt malam: "buat mereka jalan berbeda beda (char 1 mulai keyframe jalannya di frame 1, char 2 diframe 10,
 * dst), tapi secara waktu berjalan harus sama"): semua mulai berjalan bersamaan, tetapi pose kunci 1 jatuh di frame 0 · 9 · 18 · 27
 * (tokoh utama · keriting · wanita · ikal) — selang satu pose kunci, jadi tidak ada dua orang melangkah serempak. Dulu kelompok 0 / 0,31 / 0,62
 * siklus → tokoh utama & keriting persis sama dan 0,62 ≈ cermin 0,12 (satu siklus = dua langkah kembar). */
const FASE = (urutan: number) => -(urutan * 9 + 1) / JALAN_FRAME;
const gerak = (a: (f: number) => number, r: (f: number) => number, s: number, x0 = 0, psi0 = 0) =>
  simulasi(N, (f) => a(f) * laju(r(f), s), r, s, x0, psi0, panjangT);
/** HUTAN: berjalan → berhenti & menoleh → berlari → melambat → BERHENTI di belakang kelompok di depan batu (tanpa zoom ke kaki, transisi
 * paralaks memperlihatkan adegan utuh — dulu ia berjalan terus menembus kelompok yang sudah berhenti) */
/** PERTAHANKAN ADEGAN LARI (Simon 27 Okt: "pertahankan adegan lari pada scene purba"): sesudah ikut berlari, tokoh utama TETAP BERLARI sampai
 * transisi ke kota — dulu melambat (t.pelan) & berhenti di belakang kelompok di depan batu (t.diam). */
const UTAMA = gerak((f) => 1 - cin(f, t.berhenti) + cin(f, t.lari), (f) => cin(f, t.lari), S, 0, FASE(0));
/** KOTA: tokoh hari ini BERDIRI sambil main hp (Simon 27 Okt: "buat orang di adegan kota berdiri sedang bermain hp (iddle)" — dulu berjalan 72 frame
 * sampai berhenti; Simon: "gerakan pada char diadegan kota patah patah. dan ada jeglek"). Posisi layar sama (x 1050 → 600 saat hp membesar). */
const UTAMA_K = gerak(() => 0, () => 0, S, 0, FASE(0));
/** kelompok: tiga orang BERBEDA (kepala rig Freepik lain, kulit & tunik berbeda), badan = rig tegak. SKALA BADAN SAMA 0,79 (dulu wanita 0,74,
 * ikal 0,80): dengan kadens terkunci laju ikut ukuran → wanita 0,74 berlari 7,61 px/f, tersusul tokoh utama (8,43) menjelang batu & disusul ikal
 * di tengah lari (terukur, scratchpad susunan.tsx). Skala sama → formasi kelompok utuh seperti susunan lama; beda tinggi tetap dari kepala. */
export const KEL_RUPA: { kepala: Kepala; kaget: Kepala; s: number; warna: { tunik: string; totol: string } }[] = [
  { kepala: { set: 'keriting', eks: 'netral' }, kaget: { set: 'keriting', eks: 'kaget' }, s: 0.79, warna: TUNIK.oranye },
  { kepala: { set: 'wanita', eks: 'netral' }, kaget: { set: 'wanita', eks: 'kaget' }, s: 0.79, warna: TUNIK.krem },
  { kepala: { set: 'ikal', eks: 'netral' }, kaget: { set: 'ikal', eks: 'kaget' }, s: 0.79, warna: TUNIK.cokelat },
];
/** posisi awal kelompok (di belakang tokoh utama), jarak antar-anggota 140 seperti dulu. Terukur thd tokoh utama (lama → baru):
 * f200 −260/−400/−540 → −207/−347/−487 · f445 109/−93/−294 → 135/−51/−237 · f620 876/674/472 → 691/505/318 · f720 735/626/513 → 432/327/218 */
const KEL_X0 = [-170, -310, -450];
/** kelompok juga TETAP BERLARI sampai transisi (dulu berhenti di depan batu, t.kelBerhenti) */
const KEL = [0, 1, 2].map((k) => gerak(() => 1, (f) => cin(f, t.kelLari[k]),
  KEL_RUPA[k].s, KEL_X0[k], FASE(k + 1)));
/** belahan kiri (purba) papan dua dunia: SEMUA BERLARI sejak papan muncul ("pertahankan adegan lari pada scene purba") — dulu tokoh berdiri, menoleh
 * (cut to cut) ke kelompok yang lewat, baru berlari di t.lariD. Formasi = adegan lari purba: kelompok di DEPAN (keriting +330, wanita +200 px),
 * tokoh utama mengikuti. Laju terkunci kadens (tokoh 0,82 sedikit lebih cepat dari kelompok 0,79) → posisi awal dihitung supaya formasi itu
 * tepat saat papan muncul (t.dua − 30); sesudahnya tokoh mendekat ±0,3 px/f. */
const UTAMA_D = gerak(() => 1, () => 1, S, 0, FASE(0));
const FORMASI_D = [330, 200];
/** belahan kiri: dulu −380/−520; kini −260/−400 → thd tokoh utama f1580: lama 397/116 → baru 374/112 */
const KEL_D = [0, 1].map((k) => gerak(() => 1, () => 1, KEL_RUPA[k].s, FORMASI_D[k] + (laju(1, S) - laju(1, KEL_RUPA[k].s)) * (t.dua - 30), FASE(k + 1)));
const AnggotaKel: React.FC<{ k: number; x: number; j: { psi: number; r: number; a: number }; kepala: Kepala; kepala2?: { nama: Kepala; t: number } }> =
  ({ k, x, j, kepala, kepala2 }) => <TokohTegakLapis x={x} tanah={TANAH_LAYAR} s={KEL_RUPA[k].s} pose={gayaT(j.psi, j.r, j.a)} kostum="dulu"
    warna={KEL_RUPA[k].warna} kepala={kepala} kepala2={kepala2} bayangan={false} />;
/** bayangan (pusat = kepala) untuk lapisan bayangan bersama */
const bayanganKel = (k: number, j: { psi: number; r: number; a: number }, x: number) => {
  const p = gayaT(j.psi, j.r, j.a), cx = titikKepala(p)[0];
  return { x: x + cx * KEL_RUPA[k].s, s: KEL_RUPA[k].s, rx: lebarBayangan(cx, rentangAlas(p)), angkat: p.angkat ?? 0 };
};
const bayanganUtama = (p: Pose, x: number) => ({ x: x + titikKepala(p)[0] * S, s: S, rx: lebarBayangan(titikKepala(p)[0], rentangAlas(p)), angkat: p.angkat ?? 0 });

/* ── KAMERA (x dunia di tengah layar) ── */
const offA = (f: number) => lerp(-90, 260, cin(f, t.lari - 16)); // berjalan: tokoh sedikit kanan · berlari: tokoh di kiri, kelompok di depan
const offB = (f: number) => lerp(-90, 360, cin(f, t.ponsel)); // kota: tengah dulu → menepi kiri bersamaan hp membesar
const kamA = (f: number) => ambil(UTAMA, f).x + offA(f); // hutan
const kamK = (f: number) => ambil(UTAMA_K, f).x + offB(f); // kota
/** SINGA BER-RIG (Simon 26 Okt malam: "Lanjut rig dan animasi singa dari Singa.svg yang baru" · contoh lari 12 frame: "buat gerakannya realistis dan
 * terlihat natural"). Ukuran = singa lama (Singa.svg × 0,465 = lebar 415 px), alas di tanah + 20 seperti dulu. LAJU DUNIA (kaki menapak tidak meluncur):
 *  · masuk dari kiri layar mengejar: laju kamera + gelombang kosinus 548–628 yang menempuh 390 px (tepi kiri −430 → −40), puncak ±18 px/f;
 *  · menyamai kelompok (laju kamera) lalu MELAMBAT sampai berhenti 640–700 (menyerah) → tertinggal keluar layar kiri.
 * Dulu: gambar diam digeser (kaki tidak bergerak), keluar dengan bergerak mundur. */
const S_SINGA = 0.465;
const vKam = (f: number) => kamA(f + 1) - kamA(f);
const vSinga = (f: number) => {
  const u = R(f, 548, 628, 0, 1, (x) => x), masuk = u > 0 && u < 1 ? (390 / 80) * (1 - Math.cos(2 * Math.PI * u)) : 0;
  return f < 500 ? 0 : vKam(f) * (1 - R(f, 640, 700, 0, 1, io)) + masuk;
};
const SINGA_J = simulasiSinga(N, vSinga, S_SINGA, kamA(500) - 1390 - (514 - 514) * S_SINGA);

/** geser cakrawala: batu (pusat panorama x ≈ 2010) tepat di belakang kelompok saat berhenti (f ≈ 720) — dihitung dari posisi kelompok
 * (laju kelompok ikut kadens terkunci → titik berhenti berubah; batu ikut, bukan lagi x layar tetap 1320) */
const C_HUTAN = KEL.reduce((a, j) => a + keLayar(ambil(j, 720).x, kamA(720)), 0) / KEL.length - 2010 * Z_HUTAN + P_HUTAN * kamA(720);
/** belahan kiri: kamera memusatkan KELOMPOK (rata-rata x tiga orang) di tengah belahan x 480 (Simon 27 Okt: "pada adegan split screen, adegan purba
 * kurang ketengah" — dulu tokoh utama dikunci di x 480 → kelompok menumpuk di kiri lalu melewati garis tengah, f1545 rentang ±420–960 terpotong).
 * Kini rentang orang ±230–770 sepanjang papan; tokoh utama bergeser 700 → 308 saat kelompok berlari melewatinya (f1380–1480, sebelum otak muncul) */
const kamD = (f: number) => (ambil(UTAMA_D, f).x + ambil(KEL_D[0], f).x + ambil(KEL_D[1], f).x) / 3 + 480;
/** belahan kiri: titik panorama 3580 (dulu di x layar 480 = tengah belahan) tetap di tengah belahan setelah zoom */
const C_HUTAN_D = 480 - 3580 * Z_HUTAN + P_HUTAN * kamD(t.dua);
/** geser panorama kota: tepi kiri layar = x 300 panorama saat sapuan dimulai */
const C_KOTA = kamK(t.sapu) - 300 * KOTA.s * Z_KOTA;

/* ── HARGA (IHSG mingguan 13 Jan 2020 – 11 Jan 2021, tanpa nama/tanggal; dinyatakan sebagai harga saham Rp1.000 di awal) ── */
const HARGA = IHSG_2012_2021_MINGGU.filter((r) => r[0] >= '2020-01-13' && r[0] <= '2021-01-11').map((r) => r[4]);
const I_JUAL = HARGA.indexOf(Math.min(...HARGA));
const PLOT = { x0: 34, x1: PONSEL.w - 34, y0: 162, y1: 392 }; // koordinat bingkai hp besar
const HMIN = Math.min(...HARGA) - 200, HMAX = Math.max(...HARGA) + 150;
const BAGI = 0.4; // fase turun (9 minggu) = 40 % lebar grafik, pemulihan (43 minggu) = 60 % — tanpa sumbu waktu, bentuk tetap data asli
const px = (k: number) => PLOT.x0 + (PLOT.x1 - PLOT.x0) * (k <= I_JUAL ? (BAGI * k) / I_JUAL : BAGI + ((1 - BAGI) * (k - I_JUAL)) / (HARGA.length - 1 - I_JUAL));
const py = (v: number) => PLOT.y1 - ((PLOT.y1 - PLOT.y0) * (v - HMIN)) / (HMAX - HMIN);
const nilai = (k: number) => { const a = Math.floor(k), b = Math.min(HARGA.length - 1, a + 1); return lerp(HARGA[a], HARGA[b], k - a); };
const garis = (k0: number, k1: number) => {
  const pts: string[] = [];
  for (let j = Math.ceil(k0); j <= Math.floor(k1); j++) pts.push(`${px(j).toFixed(1)} ${py(HARGA[j]).toFixed(1)}`);
  if (k1 > Math.floor(k1)) pts.push(`${px(k1).toFixed(1)} ${py(nilai(k1)).toFixed(1)}`);
  return pts.length > 1 ? `M ${pts.join(' L ')}` : '';
};

/** pose tokoh utama: dulu (jalan/lari, menoleh) · kini (pegang hp, menunduk, menekan, menyesal) */
const poseUtama = (f: number, kini: boolean): Pose => {
  const j = ambil(kini ? UTAMA_K : UTAMA, f);
  const p = gayaT(j.psi, j.r, j.a);
  // menoleh ke belakang = CUT TO CUT (Simon 26 Okt malam: "Untuk adegan menoleh kebelakang, gunakan cut to cut saja untuk kepalanya")
  if (!kini) return { ...p, balik: f >= t.toleh && f < t.tolehBalik ? -1 : 1 };
  return posePonsel(p, f);
};
/** menyesal sesudah harga pulih; di papan dua dunia (ulangan singkat) kembali ke wajah melihat hp */
const sesalDi = (f: number) => cin(f, T.rugi2 + 5) * (1 - cin(f, t.dua));
/** IDLE MAIN HP — realistis, tidak kaku (Simon 27 Okt: "buat gerakan iddle bermain hpnya realistis dan tidak kaku"). Bukan lagi sinus seragam
 * "2 ketuk lalu jeda", tetapi NASKAH GESTUR deterministik (acak berbenih, sama tiap render) seperti orang sungguhan memakai hp:
 *  · ketuk (12 f: mendekat 5 · menempel 2 · lepas 5) · ketuk-ganda (22 f) · GULIR (28 f: menempel di bawah layar, menyeret ke atas 14 f, lepas) ·
 *    jeda membaca 18–58 f; titik ketuk berpindah di sepanjang layar selama jeda (tidak melompat);
 *  · TUBUH BEREAKSI: hp sedikit terdorong saat telunjuk menempel (lengan bawah kanan +1,4°), kepala mengangguk kecil sesudah menggulir (membaca
 *    isi baru, +1,4° lalu kembali dalam 36 f), napas (badan ±0,35°, 3,8 dtk) + berat badan bergeser (±0,7°, 7 dtk), hp miring pelan ±1,5°;
 *  · semua antar-kunci memakai ease in-out cubic → kecepatan nol di tiap kunci, tanpa patahan;
 *  · ketukan PAKSA tepat saat JUAL ditekan (T.menjual2 · belahan kanan t.tekanD); berhenti saat menyesal. */
type KunciJari = { f: number; t: number; kontak: number };
const GESTUR: KunciJari[] = (() => {
  let benih = 270317;
  const acak = () => { benih = (benih * 1103515245 + 12345) & 0x7fffffff; return benih / 0x7fffffff; };
  const kunci: KunciJari[] = [];
  const paksa = [T.menjual2 - 7, t.tekanD - 7]; // ketukan JUAL (puncak menempel tepat di frame tekan)
  const blok: [number, number][] = [[690, T.rugi2 - 40], [t.dua + 20, T.video + 80]]; // menyesal: tidak mengetuk
  for (const [a0, a1] of blok) {
    let f = a0, tH = 0.35;
    kunci.push({ f, t: tH, kontak: 0 });
    while (f < a1) {
      const jeda = 18 + Math.round(acak() * 40);
      const pk = paksa.find((x) => x > f && x < f + jeda + 30);
      let mulai = pk ?? f + jeda, jenis = pk !== undefined ? 'ketuk' : (() => { const r = acak(); return r < 0.42 ? 'ketuk' : r < 0.62 ? 'ganda' : 'gulir'; })();
      if (mulai >= a1) break;
      const tT = jenis === 'gulir' ? 0.18 : pk !== undefined ? 0.4 : 0.25 + acak() * 0.3;
      kunci.push({ f: mulai, t: tT, kontak: 0 }); // melayang di atas titik berikutnya (pindah selama jeda)
      if (jenis === 'ketuk' || jenis === 'ganda') {
        kunci.push({ f: mulai + 5, t: tT, kontak: 1 }, { f: mulai + 7, t: tT, kontak: 1 }, { f: mulai + 12, t: tT, kontak: 0 });
        f = mulai + 12;
        if (jenis === 'ganda') { kunci.push({ f: f + 4, t: tT, kontak: 1 }, { f: f + 6, t: tT, kontak: 1 }, { f: f + 10, t: tT, kontak: 0 }); f += 10; }
      } else {
        kunci.push({ f: mulai + 6, t: 0.18, kontak: 1 }, { f: mulai + 20, t: 0.62, kontak: 1 }, { f: mulai + 26, t: 0.64, kontak: 0 });
        f = mulai + 26;
      }
      tH = kunci[kunci.length - 1].t;
      if (pk !== undefined) paksa.splice(paksa.indexOf(pk), 1);
    }
    kunci.push({ f: Math.max(f + 20, a1), t: 0.35, kontak: 0 });
  }
  return kunci.sort((u, w) => u.f - w.f);
})();
/** akhir tiap gulir (untuk anggukan membaca) */
const AKHIR_GULIR = GESTUR.filter((k, i) => k.kontak === 0 && i > 0 && GESTUR[i - 1].kontak === 1 && GESTUR[i - 1].t > 0.6).map((k) => k.f);
const io3 = (u: number) => (u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2);
const jariPada = (f: number) => {
  let i = 0;
  while (i < GESTUR.length - 1 && GESTUR[i + 1].f <= f) i++;
  const a = GESTUR[i], b = GESTUR[Math.min(GESTUR.length - 1, i + 1)];
  if (b.f <= a.f || f <= a.f) return { t: a.t, kontak: a.kontak };
  const u = io3(Math.min(1, (f - a.f) / (b.f - a.f)));
  return { t: lerp(a.t, b.t, u), kontak: lerp(a.kontak, b.kontak, u) };
};
const idleHp = (f: number) => {
  const g = (per: number, fase: number) => Math.sin((2 * Math.PI * f) / per + fase);
  const angguk = AKHIR_GULIR.reduce((a, fe) => a + (f > fe && f < fe + 36 ? Math.sin((Math.PI * (f - fe)) / 36) ** 2 : 0), 0);
  const j = jariPada(f);
  return { badan: 0.35 * g(228, 0) + 0.7 * g(420, 1.3), kepala: 0.5 * g(170, 1.1) + 1.4 * angguk, hpMiring: 1.5 * g(260, 0.4), jari: j };
};
/** TOKOH KOTA = karakter pria-biru Untitled-1.svg RAKITAN SIMON (27 Okt 16.09; "gunakan ini untuk char yang memegang hp"), rig tegak
 * src/flat/rigKota.tsx. Skala 0,567 → tinggi 710 satuan = 403 px, sama dengan tokoh kota sebelumnya. */
const S_KOTA = 0.567;
/** BERDIRI MAIN HP — DIUKUR di grid (Simon 27 Okt: "tangan yang posenya aneh, bayangan tidak center, gunakan garis bantu/grid untuk mengukur posenya"):
 *  · kaki & lengan kanan + hp = sudut figur pria-biru "berdiri main hp" (grup 32 — karakter yang sama): paha kiri +8,7° kanan −12,7°, betis kiri +7,7°
 *    kanan 0°, telapak rata · lengan kanan atas −8,0°, bawah −127,7°;
 *  · rakitan Simon: sepatu lebih panjang ke depan (tumit −24,9 · ujung +95,3) → tengah tumpuan 31,3 vs kepala 4,7. Dipusatkan dengan badan condong 3°
 *    ke hp (kepala dikembalikan tegak, "kepalanya jangan menunduk") + kedua kaki digeser 3,15° ke belakang (telapak tetap rata) → TENGAH TUMPUAN
 *    KAKI = x KEPALA (terukur, selisih 0,13) → bayangan rata tengah ke kepala & kaki;
 *  · telunjuk kiri = IK ke titik layar hp terukur (35 % dari ujung bawah, menyentuh = tebal hp 5,6), tangan ditekuk 63° → telunjuk ±45° ke layar
 *    (lengan atas −36°, bawah −138°; sudut lengan kiri figur tidak menjangkau layar). Hitungan: scratchpad untitled/kota1. */
const MAIN_HP = { badan: 3, layarT: 0.35, tebal: 5.6, jarak: 12, tangan: 63, tekukLepas: -10, kaki: { paha: [11.85, -9.55] as [number, number], lutut: [-1.0, 12.7] as [number, number],
  telapak: [-10.85, -3.15] as [number, number] }, lengan: { atas: -7.98, bawah: -127.66 } };
export const posePonsel = (_p: Pose, f: number): Pose => {
  const tekan = [T.menjual2, t.tekanD].reduce((a, at) => a + Math.sin(Math.PI * R(f, at - 12, at + 18, 0, 1, (x) => x)), 0);
  const sesal = sesalDi(f), d = idleHp(f), M = MAIN_HP;
  const b = M.badan + d.badan; // napas: badan (tubuh atas) bergoyang; kaki rig kota tidak ikut badan → telapak diam
  const q1: Pose = { badan: b, kepala: -b + d.kepala, ...M.kaki,
    // hp: lengan kanan = sudut referensi (relatif badan); menyesal → lengan bawah turun 20° (hp diturunkan)
    // hp sedikit terdorong saat telunjuk menempel (lengan bawah kanan +1,4°)
    bahu: [0, M.lengan.atas], siku: [0, M.lengan.bawah - M.lengan.atas + 20 * sesal + 1.4 * d.jari.kontak * (1 - sesal)], tangan: [0, d.hpMiring] };
  // telunjuk kiri mengetuk layar hp: menyentuh 2× lalu jeda; berhenti saat menyesal; ketukan tegas saat JUAL ditekan di hp besar
  const k = Math.max(d.jari.kontak * (1 - sesal), tekan), h = hpDiTanganKota(q1), n = M.tebal + M.jarak * (1 - k) + 18 * sesal;
  const lt = d.jari.t;
  const sentuh: [number, number] = [h.bawah[0] + lt * (h.atas[0] - h.bawah[0]) + n * h.layar[0], h.bawah[1] + lt * (h.atas[1] - h.bawah[1]) + n * h.layar[1]];
  // ketukan = sebagian besar dari pergelangan (telunjuk terangkat dengan menekuk tangan −10°), lengan hanya mengikuti sedikit
  return ikLenganKota(q1, 0, sentuh, M.tangan + M.tekukLepas * (1 - k), UJUNG_TUNJUK_KOTA);
};
/** titik layar dari titik rig kota (satuan, relatif akar) */
const titikLayarKota = (xDunia: number, kamX: number, p: Pose, q: [number, number]): [number, number] =>
  [keLayar(xDunia, kamX) + q[0] * S_KOTA, TANAH_LAYAR - alasTerendahKota(p) * S_KOTA + q[1] * S_KOTA];

export const Scene01Flat: React.FC<{ f: number }> = ({ f }) => {
  const lama = f >= T.video - 40 ? <Scene01 f={f} /> : null; // papan E & F Scene 01 lama
  if (f >= T.video + 70) return lama;

  const gD = cin(f, t.dua); // layar penuh → layar terbelah (kiri dulu, kanan hari ini)
  const pisah = cin(f, T.video + 30) * 960; // keluar: belahan kiri geser ke kiri, kanan ke kanan (sampai keluar frame)

  /* kamera dasar */
  const xmH = ambil(UTAMA, f).x, kamH = kamA(f); // hutan
  const xm = ambil(UTAMA_K, f).x; // kota
  const kam = f < t.dua - 30 ? kamK(f) : xm + lerp(offB(f), -480, gD);
  /* TRANSISI PARALAKS purba → kota (Simon 26 Okt malam, contoh screenshot; "seharusnya dari kiri ke kanan"): 60 frame berpusat di t.sapu.
   * Batas masker + LAMPU KOTA besar di latar depan bergerak KIRI → KANAN (ease in-out cubic); di kirinya adegan kota (dimasker) yang isinya
   * bergeser ke KIRI (ease in-out cubic, 600 → 0); di kanannya adegan purba terdorong ke KANAN (ease in cubic, 0 → 960). Zoom ke kaki dihapus. */
  const tr = R(f, t.sapu - 30, t.sapu + 30, 0, 1, (x) => x);
  const io3 = tr < 0.5 ? 4 * tr ** 3 : 1 - (-2 * tr + 2) ** 3 / 2;
  const geserPurba = 960 * tr ** 3;
  const geserKota = 600 * (1 - io3);
  const batas = lerp(-(LAMPU.w * LAMPU.s) / 2, 1920 + (LAMPU.w * LAMPU.s) / 2, io3); // x layar tiang lampu = tepi kanan masker kota
  const dulu = f < t.sapu + 30, kini = f >= t.sapu - 30;

  const pDulu = poseUtama(f, false), pKini = poseUtama(f, true);
  const sesal = sesalDi(f);
  const xSinga = keLayar(SINGA_J.X[Math.min(N - 1, Math.max(0, Math.round(f)))], kamH); // tepi kiri ekor (titik acuan) di layar

  /* hp besar (morf dari hp di tangan) */
  /* HP BESAR (Simon 27 Okt: "ketika hpnya muncul swipe dari bawah ke atas, tambahkan rotasi sekitar 15 derajat (bersamaan dengan swipe), dan ketika
   * hpnya pergi swipe dari atas kebawah" + "tambahkan rotasi pada hp yang swipe keatas dan kebawah sekitar 45 derajat"): 60 f ease in-out cubic;
   * masuk dari bawah frame (+1100 px) sambil berputar −45° → 0°, keluar ke bawah frame sambil berputar 0° → −45° (balik arah masuk).
   * Sudut 45°: tinggi bentang hp ±385 px → pusat +1100 tetap di luar frame. Dulu: morf membesar dari hp di tangan. */
  const hpMasuk = cin(f, t.ponsel), hpKeluar = cin(f, T.dua + 18);
  const hpTampak = hpMasuk > 0 && hpKeluar < 1;

  return (
    <>
      {lama}
      {/* layar penuh sampai tepi bawah — pudar latar subtitle DIHAPUS (Simon 26 Okt: "hapus saja background subtittlenya") */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* ── belahan / layar penuh HARI INI (kota) ── */}
        <div style={{ position: 'absolute', inset: 0, transform: pisah > 0 ? `translateX(${pisah}px)` : undefined }}>
          {dulu && gD === 0 ? (
            <div style={{ position: 'absolute', inset: 0, transform: geserPurba > 0 ? `translateX(${geserPurba}px)` : undefined }}>
              <HutanLayar kamX={kamH} C={C_HUTAN} lapis="belakang" />
              {/* singa ber-rig: dipasang selama masih dekat layar (di luar layar kiri = pra-gambar gratis) */}
              {f >= 500 && f < 780 && xSinga > -900 ? (
                <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                  <SingaRig pose={poseSinga(SINGA_J, f)} x={xSinga} tanah={TANAH_LAYAR + 20} s={S_SINGA} />
                </svg>) : null}
              {/* bayangan semua tokoh hutan dalam satu lapisan (tumpukan tidak menggelap) */}
              <BayanganBersama tanah={TANAH_LAYAR} items={[...KEL.map((j, k) => { const a = ambil(j, f); return bayanganKel(k, a, keLayar(a.x, kamH)); }),
                bayanganUtama(pDulu, keLayar(xmH, kamH))]} />
              {KEL.map((j, k) => {
                const a = ambil(j, f);
                return <AnggotaKel key={k} k={k} j={a} x={keLayar(a.x, kamH)} kepala={KEL_RUPA[k].kepala} kepala2={{ nama: KEL_RUPA[k].kaget, t: cin(f, t.kelLari[k]) }} />;
              })}
              <TokohTegakLapis id="utama-dulu" x={keLayar(xmH, kamH)} tanah={TANAH_LAYAR} s={S} pose={pDulu} kostum="dulu" bayangan={false} />
              <HutanLayar kamX={kamH} C={C_HUTAN} lapis="depan" />
            </div>) : null}
          {kini ? (
            // layar terbelah: masker = WADAH GESER (overflow tersembunyi digeser 960·gD, isi digeser balik) — dulu clip-path inset per frame pada lapis
            // latar besar → Studio tersendat 81–93 ms di f1346–1352 (terukur studio_putar)
            <div style={{ position: 'absolute', inset: 0, overflow: tr >= 1 && gD > 0 ? 'hidden' : undefined, willChange: 'transform',
              transform: tr < 1 ? `translateX(${geserKota}px)` : gD > 0 ? `translate3d(${960 * gD}px, 0, 0)` : undefined,
              // masker kota = semua yang di KIRI tiang lampu (poligon melebar ke kiri melewati layar: isi kota yang bergeser tetap menutup tepi kiri)
              clipPath: tr < 1 ? `polygon(-3000px 0, ${batas - geserKota}px 0, ${batas - geserKota}px 1080px, -3000px 1080px)` : undefined }}>
              <div style={{ position: 'absolute', inset: 0, willChange: 'transform', transform: tr >= 1 && gD > 0 ? `translate3d(${-960 * gD}px, 0, 0)` : undefined }}>
                <KotaLayar kamX={kam} C={C_KOTA} />
                <TokohKotaLapis x={keLayar(xm, kam)} tanah={TANAH_LAYAR} s={S_KOTA} pose={pKini} sedih={sesal} ponsel ketuk />
              </div>
            </div>) : null}
          {/* lampu kota di latar depan, tiangnya tepat di batas masker */}
          {tr > 0 && tr < 1 ? (
            <Img src={staticFile('flat/lampu-kota.svg')} style={{ position: 'absolute', left: 0, top: 0, width: LAMPU.w * LAMPU.s, height: LAMPU.h * LAMPU.s, maxWidth: 'none',
              transform: `translate3d(${batas - LAMPU.tiang * LAMPU.s}px, ${LAMPU.atas}px, 0)` }} />) : null}
          {gD > 0 ? <div style={{ position: 'absolute', left: 960 * gD - 4, top: 0, width: 8, height: 1080, background: B.white }} /> : null}
          {hpTampak ? <PonselBesar f={f} x={PONSEL.x} y={PONSEL.y + SWIPE * (1 - hpMasuk) + SWIPE * hpKeluar} k={PONSEL.k} rot={-45 * (1 - hpMasuk) - 45 * hpKeluar} /> : null}
          {gD > 0 ? <KananD f={f} kam={kam} /> : null}
        </div>
        {/* ── belahan kiri ZAMAN DULU (papan dua dunia) ── */}
        {/* belahan kiri dipra-gambar tak terlihat 1 dtk sebelum layar terbelah (kinerja Studio: macet 225 ms saat gambar hutan di-decode ulang) */}
        {/* elemen SAMA sejak pra-gambar (opasitas 0,002) sampai tampil → tidak dipasang ulang saat layar mulai terbelah */}
        {f > t.dua - 90 ? <div style={{ opacity: gD > 0 ? undefined : 0.002 }}><KiriD f={f} gD={Math.max(gD, 0.01)} geser={gD > 0 ? -pisah : 0} /></div> : null}
      </div>
      {gD > 0 ? <OtakD f={f} pisah={pisah} /> : null}
      {f >= T.masih - 60 && f < T.video + 40 ? <KotakJudul f={f} /> : null}
    </>);
};

/** KOTAK "Otak yang sama. Dua dunia." (Simon 27 Okt: "animasi box seharusnya scale kanan dan kirinya dari 0 ke 100 gunakan ease out back, tingginya tetap
 * 100. dan hapus opacity pada boxnya" + "tambahkan masking seukuran box yang digunakan untuk text"): kotak putih skala X 0 → 1 easeOutBack (60f linear
 * → popScale), tinggi tetap, TANPA opacity; keluar skala X 1 → 0 (easeInBack). Teks TIDAK ikut gepeng — dimasker selebar kotak saat ini (kotak
 * overflow tersembunyi): kata naik dari tepi bawah kotak & keluar lewat tepi atas. Dulu: pudar opacity masuk-keluar tanpa masker. */
const KotakJudul: React.FC<{ f: number }> = ({ f }) => {
  // masuk 60f berpusat T.masih − 20 (kotak terbuka dulu, kata naik mulai T.masih) · keluar 60f berpusat T.video − 15 (selesai f1647 = akhir pudar lama,
  // sebelum papan presenter masuk)
  const sx = skalaPop(popIn(f, T.masih - 20)) * skalaPop(popOut(f, T.video - 15));
  if (sx <= 0.01) return null;
  // kotak = masker: kotak putih diskalakan X (overflow tersembunyi), isinya diskalakan balik 1/sx → teks tetap 100 % tetapi terpotong selebar kotak.
  // (clip-path inset per frame membuat Studio tersendat 150–190 ms saat kata ber-motion-blur naik — terukur studio_putar f1500)
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: B.white, borderRadius: 28, boxShadow: bayanganKecil(B.night), overflow: 'hidden', transform: `scaleX(${sx})`,
        transformOrigin: 'center' }}>
        <div style={{ padding: '12px 34px', transform: `scaleX(${1 / sx})`, transformOrigin: 'center' }}>
          <WordText f={f} at={T.masih} until={T.video - 20} style={{ fontFamily: F, fontSize: 56, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>
            Otak yang sama. Dua dunia.</WordText>
        </div>
      </div>
    </div>);
};

/** belahan kanan papan dua dunia: dua investor lain JUAL → tokoh JUAL */
const KananD: React.FC<{ f: number; kam: number }> = ({ f, kam }) => {
  const xm = ambil(UTAMA_K, f).x;
  const p = posePonsel(gayaT(0, 0, 0), f);
  const [hx, hy] = titikLayarKota(xm, kam, p, hpDiTanganKota(p).pusat);
  return (
    <>
      {t.jualLainD.map((a, j) => (
        <div key={j} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Avatar x={1660 + j * 120} y={330} d={64} p={popIn(f, a)} />
          <Pil x={1660 + j * 120} y={394} teks="JUAL" p={popIn(f, a + 10)} size={20} />
        </div>))}
      <Pil x={hx + 80} y={hy - 50} teks="JUAL" p={popIn(f, t.jualD)} size={20} />
    </>);
};

/** belahan kiri: tokoh zaman dulu berlari bersama kelompok ("pertahankan adegan lari pada scene purba") */
const KiriD: React.FC<{ f: number; gD: number; geser: number }> = ({ f, gD, geser }) => {
  const a = ambil(UTAMA_D, f), kam = kamD(f);
  const pose = gayaT(a.psi, a.r, a.a); // berlari (tanpa menoleh — semua sudah berlari)
  return (
    // masker = wadah geser (lihat belahan kanan): tepi kanan wadah di 960·gD (+ geser saat keluar), isi digeser balik
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', willChange: 'transform', transform: `translate3d(${geser - (1920 - 960 * gD)}px, 0, 0)` }}>
      <div style={{ position: 'absolute', inset: 0, willChange: 'transform', transform: `translate3d(${1920 - 960 * gD}px, 0, 0)` }}>
      <HutanLayar kamX={kam} C={C_HUTAN_D} lapis="belakang" />
      <BayanganBersama tanah={TANAH_LAYAR} items={[...KEL_D.map((j, k) => { const q = ambil(j, f); return bayanganKel(k, q, keLayar(q.x, kam)); }),
        bayanganUtama(pose, keLayar(a.x, kam))]} />
      {KEL_D.map((j, k) => {
        const q = ambil(j, f);
        return <AnggotaKel key={k} k={k} j={q} x={keLayar(q.x, kam)} kepala={KEL_RUPA[k].kaget} />;
      })}
      <TokohTegakLapis id="utama-D" x={keLayar(a.x, kam)} tanah={TANAH_LAYAR} s={S} pose={pose} kostum="dulu" bayangan={false} />
      <HutanLayar kamX={kam} C={C_HUTAN_D} lapis="depan" />
      </div>
    </div>);
};

/** otak yang SAMA di atas kedua versi tokoh (posisi dari pose berdiri) + garis putus-putus + sorot di "sama"; ikut keluar bersama belahannya */
const OtakD: React.FC<{ f: number; pisah: number }> = ({ f, pisah }) => {
  const D = 116, diri = gayaT(0, 0, 0), kp = titikKepala(diri);
  const y = TANAH_LAYAR - (alasTerendah(diri) - kp[1]) * S - 150;
  // otak kiri tetap di atas kepala tokoh utama (kamera belahan kiri kini memusatkan kelompok → tokoh tidak lagi di x 480)
  const kpKota = titikKepalaKota(posePonsel(gayaT(0, 0, 0), f)); // otak kanan di atas kepala tokoh kota (rig pria-biru)
  const xs = [keLayar(ambil(UTAMA_D, f).x, kamD(f)) + kp[0] * S - pisah, 1440 + kpKota[0] * S_KOTA + pisah];
  const p = popIn(f, t.otak), sorot = cin(f, T.sama2) * (1 - cin(f, T.video - 20));
  const g = cin(f, T.bekerja + 20) * (1 - cin(f, T.video - 10));
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* Simon 27 Okt: "garis putus putusnya tidak terlihat, ganti warna garisnya" — ungu brand tenggelam di pohon/gedung kota → gelap (night) */}
        <Penghubung d={`M ${xs[0] + D / 2 + 14} ${y} L ${xs[1] - D / 2 - 14} ${y}`} g={g} warna={B.night} titik={false} />
      </svg>
      {xs.map((x, j) => (
        <React.Fragment key={j}>
          <Pendar x={x} y={y} d={D} s={sorot * (p > 0 ? 1 : 0)} warna={B.blue} skala={skalaPop(p)} />
          <Besar x={x} y={y} s={sorot}><Bulat x={x} y={y} d={D} warna={B.blue} ikon="otak" p={p} /></Besar>
        </React.Fragment>))}
    </>);
};

/** ponsel besar: harga turun → tanda JUAL investor lain → tombol JUAL ditekan → kepemilikan hilang → harga berhenti turun lalu pulih */
const PonselBesar: React.FC<{ f: number; x: number; y: number; k: number; rot?: number }> = ({ f, x, y, k, rot = 0 }) => {
  const kTurun = R(f, t.ponsel - 10, T.menjual2 + 4, 0, I_JUAL, io);
  const kNaik = R(f, T.tetapi + 28, T.membuatnya + 5, 0, HARGA.length - 1 - I_JUAL, io);
  const kIni = f < T.tetapi + 28 ? kTurun : I_JUAL + kNaik;
  const harga = Math.round((1000 * nilai(kIni)) / HARGA[0] / 5) * 5;
  // aturan 17 (audit 28 Okt): ▲ mulai masuk TEPAT saat ▼ di tempat yang sama selesai keluar (dulu popIn(+40): tumpang 10 f)
  const turunP = popIn(f, t.ponsel + 30) * popOut(f, T.reaksi2 - 10), naikP = popIn(f, T.reaksi2 + 50);
  const lainP = [0, 1, 2].map((j) => popIn(f, t.ponsel + 30 + 20 * j));
  // jari = bagian tubuh tokoh → GESER masuk dari bawah jendela & keluar lagi ke bawah (bukan pop)
  const jariY = lerp(760, 0, cin(f, T.langsung2 + 10)) + lerp(0, 760, cin(f, T.tetapi + 30));
  const jari = f > T.langsung2 - 20 && f < T.tetapi + 60 ? 1 : 0;
  // klik JUAL = resep klik Scene 04/05 (audit 28 Okt; dulu denyut sinus 30 f linear, skala 0,9, tanpa riak): tombol tertekan 8 f turun + 12 f naik
  // inOut cubic (skala 0,94) + riak putih 60 f inOut cubic dari titik sentuh — aturan "tombol yang disebut = diklik & bereaksi"
  const tekan = R(f, T.menjual2 - 4, T.menjual2 + 4, 0, 1) * (1 - R(f, T.menjual2 + 4, T.menjual2 + 16, 0, 1));
  const riak = R(f, T.menjual2, T.menjual2 + 60, 0, 1);
  const tandaJual = popIn(f, T.menjual2 + 20);
  const lembar = Math.round(100 * (1 - R(f, T.menjual2 + 14, T.menjual2 + 74, 0, 1)));
  const milikP = popOut(f, T.menjual2 + 104);
  const SW = PONSEL.w - 24, SH = PONSEL.h - 24; // layar (bezel 12)
  const tombol = (sisi: 'kiri' | 'kanan', y: number, h: number) => (
    <div style={{ position: 'absolute', left: sisi === 'kiri' ? -4 : PONSEL.w - 1, top: y, width: 5, height: h, borderRadius: 3, background: B.night }} />);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: PONSEL.w, height: PONSEL.h, transformOrigin: 'center',
      transform: `translate3d(${x - PONSEL.w / 2}px, ${y - PONSEL.h / 2}px, 0) rotate(${rot}deg) scale(${k})`, borderRadius: 58, background: B.night, boxSizing: 'border-box',
      boxShadow: `0 18px 40px -16px rgba(18,16,48,.45), inset 0 0 0 2px ${mixHex(B.night, B.gray, 0.45)}` }}>
      {/* tombol samping (aksi + volume kiri, daya kanan) */}
      {tombol('kiri', 140, 30)}{tombol('kiri', 196, 58)}{tombol('kiri', 266, 58)}{tombol('kanan', 220, 92)}
      <div style={{ position: 'absolute', inset: 12, borderRadius: 46, background: B.white, overflow: 'hidden' }}>
        {/* bilah status: jam · pulau dinamis · sinyal & baterai */}
        <div style={{ position: 'absolute', left: 30, top: 15, fontFamily: F, fontSize: 18, fontWeight: 700, color: B.night, letterSpacing: '-.01em' }}>09:41</div>
        <div style={{ position: 'absolute', left: SW / 2 - 46, top: 11, width: 92, height: 27, borderRadius: 14, background: B.night }} />
        <svg width={64} height={16} style={{ position: 'absolute', left: SW - 30 - 62, top: 18 }}>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 6} y={11 - i * 3} width={4} height={4 + i * 3} rx={1} fill={B.night} />)}
          <rect x={31} y={1.5} width={25} height={12} rx={3.5} fill="none" stroke={B.night} strokeWidth={1.4} opacity={0.5} />
          <rect x={33.5} y={4} width={17} height={7} rx={1.8} fill={B.night} />
          <rect x={57.5} y={5.5} width={2} height={4} rx={1} fill={B.night} opacity={0.5} />
        </svg>
        {/* harga berjalan + arah */}
        <div style={{ position: 'absolute', left: 22, top: 64, fontFamily: F, fontSize: 44, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>
          Rp{harga.toLocaleString('id-ID')}</div>
        <PanahArah x={SW - 22 - 25} y={92} naik={false} p={turunP} d={50} />
        <PanahArah x={SW - 22 - 25} y={92} naik p={naikP} d={50} />
        <svg width={PONSEL.w} height={PONSEL.h} style={{ position: 'absolute', left: -12, top: -12, overflow: 'visible' }}>
          <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.y1 + 8} y2={PLOT.y1 + 8} stroke={B.grayLite} strokeWidth={2} />
          <path d={garis(0, Math.min(kIni, I_JUAL))} stroke={ARAH.turun} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {kIni > I_JUAL ? <path d={garis(I_JUAL, kIni)} stroke={ARAH.naik} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tandaJual > 0 ? <circle cx={px(I_JUAL)} cy={py(HARGA[I_JUAL])} r={13 * skalaPop(tandaJual)} fill={B.white} stroke={B.blue} strokeWidth={5} /> : null}
        </svg>
        {/* tanda aktivitas jual dari investor lain */}
        {lainP.map((p, j) => p > 0 ? (
          <div key={j} style={{ position: 'absolute', left: 0, top: 0 }}>
            <Avatar x={SW / 2 + (j - 1) * 100} y={470} d={54} p={p} />
            <Pil x={SW / 2 + (j - 1) * 100} y={522} teks="JUAL" p={p} size={19} />
          </div>) : null)}
        {/* kepemilikan */}
        {milikP > 0 ? (
          <div style={{ position: 'absolute', left: 22, top: 566, width: SW - 44, height: 64, borderRadius: 20, background: B.turqWash,
            border: `2.5px solid ${rgba(B.turq, 0.5)}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, padding: '0 14px',
            transform: `scale(${skalaPop(milikP)})`, transformOrigin: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: B.white, border: `3px solid ${B.turq}`, boxSizing: 'border-box', display: 'grid',
              placeItems: 'center' }}><Icon name="saham" size={24} color={B.turq} /></div>
            <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>{lembar} lembar</span>
          </div>) : null}
        {/* tombol JUAL + jari */}
        <div style={{ position: 'absolute', left: SW / 2 - 130, top: 656, width: 260, height: 58, borderRadius: 999, background: B.blue,
          display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 26, fontWeight: 800, color: B.white, letterSpacing: '.05em', overflow: 'hidden',
          transform: `scale(${1 - 0.06 * tekan})`, transformOrigin: 'center', boxShadow: bayanganKecil(B.blue) }}>
          {riak > 0 && riak < 1 ? <div style={{ position: 'absolute', left: 130 - 150 * riak, top: 29 - 150 * riak, width: 300 * riak, height: 300 * riak,
            borderRadius: '50%', background: B.white, opacity: 0.45 * (1 - riak) }} /> : null}
          <span style={{ position: 'relative' }}>JUAL</span></div>
        {/* garis beranda */}
        <div style={{ position: 'absolute', left: SW / 2 - 62, top: SH - 14, width: 124, height: 5, borderRadius: 3, background: B.night, opacity: 0.85 }} />
      </div>
      {/* TANGAN (Tangan.svg Simon 26 Okt: "svg tangan gunakan untuk adegan ketika klik hp"): naik dari bawah, ujung telunjuk ke tombol JUAL */}
      {jari > 0 ? (
        <Img src={staticFile('flat/tangan-potong.svg')} style={{ position: 'absolute', left: PONSEL.w / 2 - TANGAN.ujung[0] * TANGAN.s,
          top: 12 + 656 + 29 - TANGAN.ujung[1] * TANGAN.s + jariY - 4 * tekan, width: 420 * TANGAN.s, height: 920 * TANGAN.s, maxWidth: 'none' }} />) : null}
    </div>);
};

/** pil teks kecil (pop di pusat) */
const Pil: React.FC<{ x: number; y: number; teks: string; p: number; size?: number; warna?: string }> = ({ x, y, teks, p, size = 22, warna = B.blue }) => p <= 0 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${skalaPop(p)})`, transformOrigin: 'center',
    background: warna, color: B.white, fontFamily: F, fontWeight: 800, fontSize: size, letterSpacing: '.05em', padding: `${size * 0.3}px ${size * 0.8}px`,
    borderRadius: 999, whiteSpace: 'nowrap', boxShadow: bayanganKecil(warna) }}>{teks}</div>);
