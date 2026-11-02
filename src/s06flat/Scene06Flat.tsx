import React from 'react';
import { Img, staticFile } from 'remotion';
import { ARAH, B, F, R, SISI, bayanganDengan, bayanganKecil, lerp, rgba } from '../theme';
import { cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Label, Lencana } from '../parts/umum';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { BERDIRI, JALAN_FRAME, LARI_FRAME, campurPose, gaya as gayaT, ikLengan, panjangSiklus as panjangT, titikKepala, alasTerendah, type Kepala, type Pose } from '../flat/rigTegak';
import { HutanLayar, KotaLayar, TANAH_LAYAR, TokohTegakLapis, ambil, simulasi, type Jejak } from '../flat/dunia';
import { SingaRig, POSE_DIAM_SINGA } from '../flat/rigSinga';
import { KEL_RUPA } from '../s01flat/Scene01Flat';
import { Baterai, C_KOTA, MaskerBulat } from '../s03flat/Scene03Flat';
import { LAMPU_KOTA, POHON_S03, TransisiParalaks } from '../flat/transisi';

/**
 * SCENE 06 — VERSI 2D FLAT (scene ANALOGI — Simon 27 Okt: "style flat dengan char hanya digunakan untuk scene yang analogi"). Dokumen
 * "Investing_101_Ide_Visual_2D_Flat_Detail.md" Scene 06 "Kenapa Kita Mudah Mengikuti Kelompok?". Simon 27 Okt: "lanjut build sampai selesai, nanti aku
 * cek secara pararel".
 *  A f13001–13300 lingkaran membuka padang RUMPUT TINGGI: tokoh dulu & tetangganya (keriting) berdiri (kalimat pembuka "Kesalahan kedua…").
 *  B f13309–13543 tetangga TIBA-TIBA berlari (kepala kaget), tokoh langsung ikut berlari; kamera mengikuti (langkah 1).
 *  C f13560–13860 ternyata salah alarm: tetangga berhenti & menoleh "?", tokoh berhenti terengah, baterai 100 % → 80 % (langkah 2).
 *  ↺ f13850–13910 kejadian DIPUTAR MUNDUR ke awal (dua versi kejadian yang sangat mirip).
 *  D f13882–14265 versi 2: tetangga berlari lagi, tokoh BERHENTI menoleh ke rumput yang bergoyang (ikon mata), siluet singa muncul di balik rumput
 *    + "!" merah; "kehilangan nyawa" = rona merah di tepi layar — tanpa serangan (langkah 3).
 *  E f14279–14568 ikon otak; tokoh berlari menjauh ("berlari dulu"), "?" di atasnya ("baru bertanya kenapa"); TEKS LAYAR "Berlari dulu, baru bertanya
 *    kenapa." per frasa.
 *  F f14593–15028 dorong ke ruang dapur flat: detektor asap; asap tipis → alarm (oranye) tiga kali, "Salah alarm ×3"; api kecil → alarm merah, "Kebakaran"
 *    (langkah 4).
 *  G f15049–15420 dorong ke jalan kota: lima orang menoleh ke kiri; satu menoleh ke kanan, lalu berurutan yang lain, lalu bergerak ke arah yang sama;
 *    tokoh paling akhir ikut dan "?" di atas kepalanya — belum tahu alasannya (langkah 5–6).
 *  Ekor: adegan kota terdorong keluar ke kiri (60 f berpusat di frame pertama Scene 07 + 30).
 */
const W = urut(['kesalahan', 'kedua', 'mengejar', 'naik', 'panik', 'turun', 'bayangkan', 'sebelahmu', 'tiba-tiba', 'berlari', 'rumput', 'tinggi', 'kalau', 'ikut',
  'berlari', 'ternyata', 'salah', 'alarm', 'kehilangan', 'sedikit', 'tenaga', 'tapi', 'berhenti', 'menganalisis', 'ternyata', 'bahayanya', 'nyata', 'kehilangan',
  'nyawa', 'karena', 'otak', 'memilih', 'berlari', 'dulu', 'baru', 'bertanya', 'kenapa', 'prinsipnya', 'detektor', 'asap', 'beberapa', 'kali', 'salah', 'alarm',
  'sekali', 'gagal', 'mendeteksi', 'kebakaran', 'sungguhan', 'itulah', 'banyak', 'orang', 'bergerak', 'arah', 'sama', 'kita', 'mudah', 'ikut', 'belum',
  'benar-benar', 'tahu', 'alasannya'], BATAS.s6 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  kesalahan: n(), kedua: n(), mengejar: n(), naik: n(), panik: n(), turun: n(), bayangkan: n(), sebelahmu: n(), tiba: n(), berlari: n(), rumput: n(), tinggi: n(),
  kalau: n(), ikut: n(), berlari2: n(), ternyata: n(), salah: n(), alarm: n(), kehilangan: n(), sedikit: n(), tenaga: n(), tapi: n(), berhenti: n(),
  menganalisis: n(), ternyata2: n(), bahaya: n(), nyata: n(), kehilangan2: n(), nyawa: n(), karena: n(), otak: n(), memilih: n(), berlari3: n(), dulu: n(),
  baru: n(), bertanya: n(), kenapa: n(), prinsip: n(), detektor: n(), asap: n(), beberapa: n(), kali: n(), salah2: n(), alarm2: n(), sekali: n(), gagal: n(),
  mendeteksi: n(), kebakaran: n(), sungguhan: n(), itulah: n(), banyak: n(), orang: n(), bergerak: n(), arah: n(), sama: n(), kita: n(), mudah: n(), ikut2: n(),
  belum: n(), benar: n(), tahu: n(), alasan: n(),
};
export const S06_T = T;
const AWAL = BATAS.s6, AKHIR = BATAS.s7;
const EKOR = AKHIR + 30;

/* ════════════════════════════ UMUM ════════════════════════════ */
type P2 = [number, number];
const S = 0.82;
const NS = AKHIR + 80 - AWAL;
const laju = (r: number) => (panjangT(r) * S) / lerp(JALAN_FRAME, LARI_FRAME, r);
const FASE = (urutan: number) => -(urutan * 9 + 1) / JALAN_FRAME;
/** simulasi gerak; `a(f)` = 0…1 (diam…bergerak), `r` = 0 jalan / 1 lari */
const gerak = (a: (f: number) => number, r: number, x0: number, psi0 = FASE(0)) =>
  simulasi(NS, (k) => a(AWAL + k) * laju(r), () => r, S, x0, psi0, panjangT);
const di = (j: Jejak, f: number) => ambil(j, f - AWAL);
const lin = (f: number, a: number, b: number) => R(f, a, b, 0, 1, (x) => x);
const akarY = (p: Pose) => TANAH_LAYAR - (alasTerendah(p) + (p.angkat ?? 0)) * S;
const kepalaLayar = (x: number, p: Pose): P2 => { const q = titikKepala(p); return [x + q[0] * S, akarY(p) + q[1] * S]; };
/** IDLE ALAMI (Simon 28 Okt: "Perbaiki gerakan iddle kedua char itu" + "buat iddlenya lebih natural lagi"; dulu hanya napas ±0,6° yang SAMA untuk
 *  semua tokoh): napas (dada & bahu), pindah tumpuan berat badan pelan (paha & badan condong bergantian), lengan ikut napas, kepala menoleh/mengangguk
 *  pelan. Periode tak sebanding (150 · 410 · 290 f) & fase berbeda tiap tokoh → tidak pernah bergerak serempak. `u` = kekuatan (0 saat berlari). */
const idleAlami = (p: Pose, f: number, fase: number, u = 1): Pose => {
  if (u <= 0) return p;
  const napas = Math.sin((2 * Math.PI * f) / 150 + fase), berat = Math.sin((2 * Math.PI * f) / 410 + fase * 1.7), lihat = Math.sin((2 * Math.PI * f) / 290 + fase * 2.3);
  return { ...p, badan: p.badan + u * (0.9 * napas + 1.3 * berat), kepala: p.kepala + u * (-0.7 * napas + 2 * lihat - 1.2 * berat),
    bahu: [p.bahu[0] + u * (1.4 * napas - 1.1 * berat), p.bahu[1] + u * (-1.1 * napas + 0.9 * berat)],
    siku: [p.siku[0] - u * 1.6 * napas, p.siku[1] - u * 1.2 * napas],
    paha: [p.paha[0] + u * 1.1 * berat, p.paha[1] + u * 1.1 * berat], telapak: [p.telapak[0] - u * 1.1 * berat, p.telapak[1] - u * 1.1 * berat] };
};
/** pose langkah + idle alami saat diam (napas cepat bila `engah`) */
const poseGerak = (j: Jejak, f: number, engah = 0, balik = 1, fase = 0): Pose => {
  const a = di(j, f);
  const p = idleAlami(gayaT(a.psi, j.r[0], a.a), f, fase, 1 - a.a);
  const napas = Math.sin((2 * Math.PI * f) / 34);
  return engah > 0 ? { ...p, badan: p.badan + 2.4 * engah * napas + 5 * engah, kepala: p.kepala - 3 * engah * napas, balik } : { ...p, balik };
};
/** kamera mengikuti target dengan peredam (dua kali pelicinan eksponensial = tanpa sentakan) */
const ikuti = (target: (f: number) => number, a = 0.05) => {
  const out = new Float64Array(NS);
  let p = target(AWAL), q = p;
  for (let k = 0; k < NS; k++) { p += (target(AWAL + k) - p) * a; q += (p - q) * a; out[k] = q; }
  return (f: number) => out[Math.max(0, Math.min(NS - 1, Math.round(f - AWAL)))];
};
/** kotak teks per frasa (gaya kotak teks Scene 04): kotak putih skala X easeOutBack BERSAMAAN frasa pertama naik (dulu 10 f lebih awal → kotak kosong),
 *  lalu kotak MELEBAR 60 f inOut cubic saat frasa berikutnya datang (dulu kotak sudah selebar seluruh kalimat → ruang kosong; Simon: tanpa slot kosong).
 *  Lebar frasa ditaksir 0,6 × ukuran huruf per karakter (≥ lebar asli: maxWidth hanya membatasi selama melebar, tanpa loncatan di akhir). */
const KotakTeks: React.FC<{ f: number; keluar: number; y: number; bagian: { teks: string; at: number }[]; size?: number }> = ({ f, keluar, y, bagian, size = 52 }) => {
  const sx = skalaPop(popIn(f, bagian[0].at)) * skalaPop(popOut(f, keluar));
  if (sx <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 160, width: 1600, top: y - 44, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: B.white, borderRadius: 28, boxShadow: bayanganKecil(B.night), overflow: 'hidden', transform: `scaleX(${sx})`, transformOrigin: 'center' }}>
        <div style={{ padding: '12px 34px', transform: `scaleX(${1 / sx})`, transformOrigin: 'center', whiteSpace: 'nowrap' }}>
          {bagian.map((b, k) => {
            const lebar = k === 0 ? 1 : cin(f, b.at - 25); // selesai melebar sebelum kata terakhir frasa mulai naik (kata tidak terpotong tepi kotak)
            return lebar <= 0.001 ? null : (
              <span key={k} style={{ display: 'inline-block', verticalAlign: 'bottom', overflowX: 'clip', overflowY: 'visible',
                maxWidth: lebar < 1 ? (b.teks.length + 1) * size * 0.6 * lebar : undefined }}>{k > 0 ? '\u00a0' : null}
                <WordText f={f} at={b.at} until={keluar} style={{ fontFamily: F, fontSize: size, fontWeight: 800, color: B.night, letterSpacing: '-.01em' }}>{b.teks}</WordText>
              </span>);
          })}
        </div>
      </div>
    </div>);
};
/** lencana bulat bertanda (?, !) — putih, tepi & teks warna */
const Tanda: React.FC<{ x: number; y: number; p: number; teks: string; warna: string; d?: number }> = ({ x, y, p, teks, warna, d = 84 }) => p <= 0 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
    display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `translate3d(${x - d / 2}px, ${y - d / 2}px, 0) scale(${skalaPop(p)})`, fontFamily: F,
    fontWeight: 800, fontSize: d * 0.56, lineHeight: 1, color: warna, boxShadow: bayanganDengan(warna, 1) }}>{teks}</div>);

/* ════════════════════════════ RUMPUT TINGGI ════════════════════════════
 * Pita helai rumput (palet Hutan.svg) sepanjang dunia; digeser translate3d (paralaks kamera) & bergoyang lewat skewX pembungkus — tanpa raster ulang. */
const HIJAU = ['#B8B95D', '#ACB25A', '#94A453', '#869C4E', '#81994D', '#9D9E4A', '#919548', '#808845'];
const acak = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const DUNIA = { x0: -600, x1: 5200 };
const pitaRumput = (benih: number, langkah: number, tinggi: [number, number]) => {
  const helai: string[] = [];
  for (let x = DUNIA.x0, k = 0; x < DUNIA.x1; x += langkah * (0.6 + 0.8 * acak(benih + k)), k++) {
    const h = lerp(tinggi[0], tinggi[1], acak(benih + k * 3.1)), cond = (acak(benih + k * 5.7) - 0.5) * 70, w = 9 + 7 * acak(benih + k * 2.3);
    helai.push(`<path d="M ${x - w} 0 Q ${x + cond * 0.3} ${-h * 0.55} ${x + cond} ${-h} Q ${x + cond * 0.3 + w * 0.4} ${-h * 0.5} ${x + w} 0 Z" fill="${HIJAU[Math.floor(acak(benih + k * 7.3) * HIJAU.length)]}"/>`);
  }
  return helai.join('');
};
const PITA = { belakang: pitaRumput(11, 26, [150, 250]), depan: pitaRumput(57, 22, [120, 210]) };
const Rumput: React.FC<{ kamX: number; lapis: 'belakang' | 'depan'; f: number; dasar: number }> = ({ kamX, lapis, f, dasar }) => {
  const goyang = 2.2 * Math.sin((2 * Math.PI * f) / (lapis === 'depan' ? 170 : 230) + (lapis === 'depan' ? 1 : 0));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: DUNIA.x1 - DUNIA.x0, height: 300, transformOrigin: '50% 100%',
      transform: `translate3d(${DUNIA.x0 - kamX + 960}px, ${dasar - 300}px, 0) skewX(${goyang}deg)` }}>
      <svg width={DUNIA.x1 - DUNIA.x0} height={300} viewBox={`${DUNIA.x0} -300 ${DUNIA.x1 - DUNIA.x0} 300`} style={{ display: 'block', overflow: 'visible' }}
        dangerouslySetInnerHTML={{ __html: PITA[lapis] }} />
    </div>);
};
/** rumpun rumput yang BERGESEK (ada sesuatu di baliknya) — goyang kuat sebentar */
const RumpunGesek: React.FC<{ x: number; f: number; kuat: number }> = ({ x, f, kuat }) => (
  <div style={{ position: 'absolute', left: x - 170, top: TANAH_LAYAR + 26 - 260, width: 340, height: 260, transformOrigin: '50% 100%',
    transform: `skewX(${(2 + 9 * kuat) * Math.sin((2 * Math.PI * f) / 14)}deg)` }}>
    <svg width={340} height={260} viewBox="-170 -260 340 260" style={{ display: 'block', overflow: 'visible' }}
      dangerouslySetInnerHTML={{ __html: Array.from({ length: 14 }, (_, k) => {
        const x0 = -150 + k * 23, h = 170 + 80 * acak(k + 91), c = (acak(k + 17) - 0.5) * 50;
        return `<path d="M ${x0 - 12} 0 Q ${x0 + c * 0.3} ${-h * 0.55} ${x0 + c} ${-h} Q ${x0 + c * 0.3 + 5} ${-h * 0.5} ${x0 + 12} 0 Z" fill="${HIJAU[k % HIJAU.length]}"/>`;
      }).join('') }} />
  </div>);

/* ════════════════════════════ A–E · PADANG RUMPUT TINGGI ════════════════════════════
 * Simon 28 Okt: "Alih alih rewind adegan, lebih baik buat char berhenti berlari dan berganti pose berpikir, biar char yang didepan tetap berlari" →
 * SATU alur tanpa putar mundur: B tetangga berlari, tokoh ikut · C sambil berlari: "?" di atas tetangga (salah alarm) & baterai tokoh 100 → 80 % ·
 * D "Tapi kalau kamu berhenti…": tokoh melambat & BERHENTI → pose BERPIKIR (tangan di dagu), tetangga TETAP berlari keluar layar; rumput di belakang
 * tokoh bergesek → siluet singa naik dari balik rumput → tokoh tersentak · E tokoh berlari menjauh ("berlari dulu"), "?" ("baru bertanya kenapa").
 * Dulu: keduanya berhenti, adegan DIPUTAR MUNDUR (↺), lalu tokoh berhenti sambil membalik badan kiri-kanan seketika (terbaca aneh). */
const X_TOKOH = 820, X_TETANGGA = 1080;
const RUPA_T = KEL_RUPA[0];
const tP = { lariT: T.berlari + 12, lariK: T.berlari + 40, tanya: T.salah + 4, tanyaKeluar: T.tenaga + 20, baterai: T.kehilangan, kuras: T.sedikit + 10,
  bateraiKeluar: T.tapi + 10, henti: T.berhenti, pikir: T.berhenti + 30, mata: T.menganalisis, gesek: T.menganalisis + 20, singa: T.bahaya, kaget: T.nyata,
  tanda: T.nyata, merah: T.nyawa - 10, otak: T.otak + 30, lariLagi: T.berlari3 + 8, tanyaLari: T.bertanya + 36 };
const JP = {
  tetangga: gerak((f) => cin(f, tP.lariT, 24), 1, X_TETANGGA, FASE(2)),
  tokoh: gerak((f) => cin(f, tP.lariK, 24) * (1 - cin(f, tP.henti, 40)) + cin(f, tP.lariLagi, 24), 1, X_TOKOH, FASE(0)),
};
/** kamera: pusat kelompok selama berlari bersama; sesudah tokoh berhenti mengikuti tokoh (x layar 820 → ruang di kirinya untuk singa) */
const kamP = ikuti((f) => (f < tP.henti ? 960 + Math.max(0, (di(JP.tokoh, f).x + di(JP.tetangga, f).x) / 2 - (X_TOKOH + X_TETANGGA) / 2) : di(JP.tokoh, f).x + 140));
const S_SINGA = 0.465;
/** singa (tepi kiri ekor, dunia) = 780 px di belakang tempat tokoh berhenti */
const X_SINGA = di(JP.tokoh, tP.henti + 60).x - 780;
/** POSE BERPIKIR: tangan dekat di dagu (arah siku dari foto investor berpikir murid_pikir_biru: lengan atas ±13° turun, lengan bawah naik ±150° ke
 *  dagu), kepala menengadah. Lengan penyangga yang MENYILANG perut di foto tidak bisa digambar — lengan jauh rig berada DI BELAKANG badan (dicoba: ia
 *  menjulur ke depan seperti menunjuk) → lengan jauh tetap menggantung santai seperti pose berdiri. */
const POSE_PIKIR: Pose = (() => {
  const dada: Pose = { ...BERDIRI, kepala: -6 };
  const kp = titikKepala(dada);
  return ikLengan(dada, 0, [kp[0] + 24, kp[1] + 50], -60);
})();
const poseTokoh = (f: number): Pose => {
  const g = poseGerak(JP.tokoh, f, 0, 1, 0);
  const pikir = cin(f, tP.pikir) * (1 - cin(f, tP.kaget));
  const kaget = cin(f, tP.kaget) * (1 - cin(f, tP.lariLagi));
  let p = pikir > 0 ? campurPose(g, idleAlami(POSE_PIKIR, f, 0), pikir) : g;
  if (kaget > 0) p = { ...p, badan: p.badan - 6 * kaget, kepala: p.kepala - 6 * kaget };
  return p;
};
const Padang: React.FC<{ f: number }> = ({ f }) => {
  const kamX = kamP(f);
  const xs = (x: number) => x - kamX + 960;
  const tet = di(JP.tetangga, f), tok = di(JP.tokoh, f);
  const pT = poseGerak(JP.tetangga, f, 0, 1, 1.9);
  const singa = cin(f, tP.singa);
  return (
    <>
      <HutanLayar kamX={kamX} C={-1200} lapis="belakang" />
      <Rumput kamX={kamX} lapis="belakang" f={f} dasar={TANAH_LAYAR - 34} />
      {/* singa = SILUET gelap naik DARI BALIK rumput (dipotong garis tanah), tanpa serangan */}
      {singa > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: TANAH_LAYAR + 26, overflow: 'hidden' }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <defs><filter id="s06-siluet" x="-10%" y="-10%" width="120%" height="120%"><feFlood floodColor="#3A3442" /><feComposite in2="SourceAlpha" operator="in" /></filter></defs>
            <g filter="url(#s06-siluet)" opacity={0.92}><SingaRig pose={POSE_DIAM_SINGA()} x={xs(X_SINGA)} tanah={TANAH_LAYAR + 24 + 380 * (1 - singa)} s={S_SINGA} bayangan={false} /></g>
          </svg>
        </div>) : null}
      <TokohTegakLapis x={xs(tet.x)} tanah={TANAH_LAYAR} s={S} pose={pT} kostum="dulu" kepala={RUPA_T.kepala} kepala2={{ nama: RUPA_T.kaget, t: cin(f, tP.lariT - 10) }}
        warna={RUPA_T.warna} />
      <TokohTegakLapis x={xs(tok.x)} tanah={TANAH_LAYAR} s={S} pose={poseTokoh(f)} kostum="dulu" />
      {f >= tP.gesek - 40 ? <RumpunGesek x={xs(X_SINGA + 190)} f={f} kuat={Math.sin(Math.PI * lin(f, tP.gesek - 20, tP.singa + 20))} /> : null}
      <Rumput kamX={kamX} lapis="depan" f={f} dasar={TANAH_LAYAR + 40} />
      <HutanLayar kamX={kamX} C={-1200} lapis="depan" />
    </>);
};
/** tanda di atas kepala (posisi layar) pada adegan padang */
const kepalaPadang = (f: number, siapa: 'tokoh' | 'tetangga'): P2 => {
  const kamX = kamP(f), j = siapa === 'tokoh' ? JP.tokoh : JP.tetangga, a = di(j, f);
  return kepalaLayar(a.x - kamX + 960, siapa === 'tokoh' ? poseTokoh(f) : gayaT(a.psi, 1, a.a));
};

/* ════════════════════════════ F · DETEKTOR ASAP ════════════════════════════ */
const tF = { masuk: T.prinsip + 4, detektor: T.detektor, asap: T.beberapa - 50, bunyi: [T.beberapa - 6, T.kali + 10, T.alarm2 + 16], asapHabis: T.sekali - 10,
  api: T.gagal, alarmApi: T.mendeteksi, chipApi: T.kebakaran, keluar: T.itulah - 6 };
const DET: P2 = [960, 168];
/** panci (asap) & tempat sampah (api) SIMETRIS di x 960 ± 400 (dulu 700 / 1250 — kolom asap panci melintasi label "Salah alarm" di atasnya) */
const PANCI: P2 = [560, 690], API: P2 = [1360, 690];
/** label hitungan di kiri (salah alarm) & kanan (kebakaran) SIRENE, sebaris dengan pusatnya */
const LABEL_DX = 220;
/** SIRENE Simon (sirene-badan/-sinar.svg, viewBox 220 × 270) di bawah detektor, sebaris dengan hitungan "Salah alarm" & "Kebakaran" */
const SIRENE = { x: 960, y: 370, w: 200, h: (200 * 270) / 220 };
/** satu denyut alarm (0…1) di sekitar t, ± 34 f */
const denyut = (f: number, t: number) => Math.sin(Math.PI * lin(f, t - 8, t + 26)) ** 2;
const Ruang: React.FC<{ f: number }> = ({ f }) => {
  const detP = popIn(f, tF.detektor);
  const asap = cin(f, tF.asap) * (1 - cin(f, tF.asapHabis));
  const bunyiPalsu = Math.max(...tF.bunyi.map((t) => denyut(f, t)));
  const api = cin(f, tF.api);
  const uApi = ((((f - tF.alarmApi) / 30) % 1) + 1) % 1; // denyut berulang tiap 30 f
  const bunyiApi = api > 0.3 ? Math.sin(Math.PI * uApi) ** 2 * cin(f, tF.alarmApi, 30) : 0;
  const bunyi = Math.max(bunyiPalsu, bunyiApi), merah = bunyiApi > bunyiPalsu;
  const nPalsu = tF.bunyi.filter((t) => f >= t).length;
  const warnaBunyi = merah ? ARAH.turun : B.orange;
  const sireneP = popIn(f, tF.bunyi[0] - 20) * popOut(f, tF.keluar);
  return (
    <>
      {/* dinding · plafon · lantai · meja dapur (flat) */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #E6E8FA 0%, #F3F4FD 70%)' }} />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <rect x={0} y={0} width={1920} height={96} fill="#D3D6F0" />
        <rect x={0} y={96} width={1920} height={10} fill="#C5C9E8" />
        <rect x={0} y={860} width={1920} height={220} fill="#CDD0EC" />
        <rect x={360} y={700} width={1200} height={28} rx={8} fill="#C9A97C" />
        <rect x={380} y={728} width={1160} height={132} fill="#EFE9DE" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={400 + k * 285} y={748} width={265} height={96} rx={10} fill="none" stroke="#DCD3C2" strokeWidth={4} />)}
        {/* kompor + panci */}
        <rect x={PANCI[0] - 110} y={688} width={220} height={14} rx={6} fill="#3A3D55" />
        <path d={`M ${PANCI[0] - 92} 688 L ${PANCI[0] - 80} 636 L ${PANCI[0] + 80} 636 L ${PANCI[0] + 92} 688 Z`} fill="#4A4E6A" />
        <rect x={PANCI[0] + 80} y={640} width={110} height={12} rx={6} fill="#4A4E6A" />
        {/* tempat sampah kecil (sumber api) */}
        <path d={`M ${API[0] - 56} 700 L ${API[0] - 46} 610 L ${API[0] + 46} 610 L ${API[0] + 56} 700 Z`} fill="#9AA0C4" />
        <rect x={API[0] - 60} y={600} width={120} height={14} rx={6} fill="#868CB3" />
      </svg>
      {/* asap tipis dari panci — melayang ke KIRI menjauhi hitungan "×N Salah alarm" (cek still 30 Okt f14780–14840: dulu melayang ke kanan,
        kepulan setinggi hitungan sampai x ±704 menimpa lencana ×N (tepi kiri 696) & teks "Salah alarm" (665); kini tepi kanannya ≤ 636) */}
      {asap > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          {Array.from({ length: 7 }, (_, k) => {
            const u = ((f * 0.006 + k / 7) % 1), x = PANCI[0] + Math.sin(u * 6 + k) * 40 - u * 60, y = 630 - u * 460;
            return <circle key={k} cx={x} cy={y} r={30 + u * 70} fill="#8E93AE" opacity={asap * 0.28 * Math.sin(Math.PI * u)} />;
          })}
        </svg>) : null}
      {/* API = berkas Simon (paket pemadam, api di atas gedung): pop dari dasar di tempat sampah, berkedip halus */}
      {api > 0 ? (
        <>
          <div style={{ position: 'absolute', left: API[0] - 91, top: 606 - 208, width: 182, height: 218, transformOrigin: '50% 95%',
            transform: `scale(${skalaPop(popIn(f, tF.api))}, ${skalaPop(popIn(f, tF.api)) * (1 + 0.05 * Math.sin(f * 0.45))})` }}>
            <Img src={staticFile('flat/s06/api.svg')} style={{ width: 182, height: 218, display: 'block' }} />
          </div>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
            {[0, 1, 2].map((k) => { const u = ((f * 0.01 + k / 3) % 1); return <circle key={k} cx={API[0] + 70 + u * 220 + Math.sin(u * 7 + k) * 24} cy={520 - u * 320} r={26 + u * 60} fill="#6E7290" opacity={api * 0.3 * Math.sin(Math.PI * u)} />; })}
          </svg>
        </>) : null}
      {/* SIRENE Simon (Simon 28 Okt: "Cari icon/ilustrasi alarm agar animasinya lebih jelas/gunakan yang aku kirimkan"): pop di alarm pertama; tiap
        alarm sinarnya menyala & sirene berdenyut; kebakaran = sinar berkedip terus + cahaya merah di belakangnya */}
      {sireneP > 0 ? (
        <div style={{ position: 'absolute', left: SIRENE.x - SIRENE.w / 2, top: SIRENE.y - SIRENE.h / 2, width: SIRENE.w, height: SIRENE.h, transformOrigin: '50% 90%',
          transform: `scale(${skalaPop(sireneP) * (1 + 0.06 * bunyi)})` }}>
          {merah && bunyi > 0.01 ? <div style={{ position: 'absolute', left: SIRENE.w / 2 - 130, top: SIRENE.h * 0.55 - 130, width: 260, height: 260, borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(ARAH.turun, 0.32 * bunyi)} 0%, ${rgba(ARAH.turun, 0)} 70%)` }} /> : null}
          <Img src={staticFile('flat/s06/sirene-sinar.svg')} style={{ position: 'absolute', inset: 0, width: SIRENE.w, height: SIRENE.h, opacity: bunyi > 0.01 ? bunyi : 0 }} />
          <Img src={staticFile('flat/s06/sirene-badan.svg')} style={{ position: 'absolute', inset: 0, width: SIRENE.w, height: SIRENE.h }} />
        </div>) : null}
      {/* detektor di plafon + gelombang bunyi */}
      {detP > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${DET[0]}px ${DET[1] - 40}px`, transform: `scale(${skalaPop(detP)})` }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {bunyi > 0.01 ? [1, 2, 3].map((k) => (
              <g key={k} opacity={bunyi * (1 - (k - 1) * 0.25)} fill="none" stroke={warnaBunyi} strokeWidth={8} strokeLinecap="round">
                <path d={`M ${DET[0] - 110 - k * 42} ${DET[1] - 50 + 0} A ${90 + k * 42} ${90 + k * 42} 0 0 0 ${DET[0] - 110 - k * 42} ${DET[1] + 70}`} transform={`translate(${-10 * bunyi} 0)`} />
                <path d={`M ${DET[0] + 110 + k * 42} ${DET[1] - 50} A ${90 + k * 42} ${90 + k * 42} 0 0 1 ${DET[0] + 110 + k * 42} ${DET[1] + 70}`} transform={`translate(${10 * bunyi} 0)`} />
              </g>)) : null}
            {merah && bunyi > 0.01 ? <circle cx={DET[0]} cy={DET[1]} r={110} fill={rgba(ARAH.turun, 0.16 * bunyi)} /> : null}
            <rect x={DET[0] - 40} y={100} width={80} height={22} rx={6} fill="#C5C9E8" />
            <ellipse cx={DET[0]} cy={DET[1]} rx={92} ry={56} fill={B.white} stroke="#B8BCD8" strokeWidth={5} />
            <ellipse cx={DET[0]} cy={DET[1] + 4} rx={52} ry={30} fill="#EEF0F8" />
            {[-24, -8, 8, 24].map((dx) => <rect key={dx} x={DET[0] + dx - 3} y={DET[1] - 8} width={6} height={22} rx={3} fill="#C9CDE3" />)}
            <circle cx={DET[0] + 58} cy={DET[1] - 14} r={9} fill={bunyi > 0.3 ? (merah ? ARAH.turun : B.orange) : '#B8BCD8'} />
          </svg>
        </div>) : null}
      {/* hitungan salah alarm & kebakaran */}
      <Lencana x={SIRENE.x - LABEL_DX} y={SIRENE.y - 34} d={0} p={nPalsu > 0 ? popIn(f, tF.bunyi[0]) * popOut(f, tF.keluar) : 0} warna={B.orange} teks={`×${Math.max(1, nPalsu)}`} besar={88} />
      <Label x={SIRENE.x - LABEL_DX} y={SIRENE.y + 40} teks="Salah alarm" f={f} at={T.salah2} size={30} lebar={300} keluar={tF.keluar} />
      <Tanda x={SIRENE.x + LABEL_DX} y={SIRENE.y - 34} p={popIn(f, tF.chipApi - 20) * popOut(f, tF.keluar)} teks="!" warna={ARAH.turun} d={88} />
      <Label x={SIRENE.x + LABEL_DX} y={SIRENE.y + 40} teks="Kebakaran" f={f} at={tF.chipApi} size={30} lebar={300} keluar={tF.keluar} />
    </>);
};

/* ════════════════════════════ G · KERUMUNAN KOTA ════════════════════════════ */
const ORANG: { x: number; kepala: Kepala; toleh: number; jalan: number }[] = [
  { x: 1440, kepala: KEL_RUPA[0].kepala, toleh: T.banyak - 10, jalan: T.bergerak },
  { x: 1220, kepala: KEL_RUPA[1].kepala, toleh: T.orang, jalan: T.bergerak + 22 },
  { x: 1000, kepala: 'netral', toleh: T.bergerak, jalan: T.arah + 14 },
  { x: 780, kepala: KEL_RUPA[2].kepala, toleh: T.arah + 4, jalan: T.sama + 10 },
  { x: 560, kepala: 'simon', toleh: T.kita + 6, jalan: T.ikut2 },
];
const JG = ORANG.map((o, k) => gerak((f) => cin(f, o.jalan, 30), 0, o.x, FASE(k)));
const kamG = ikuti((f) => 960 + Math.max(0, JG.reduce((s, j, k) => s + di(j, f).x - ORANG[k].x, 0) / JG.length), 0.04);
const C_G = C_KOTA - 900;
const Kota: React.FC<{ f: number }> = ({ f }) => {
  const kamX = kamG(f);
  return (
    <>
      <KotaLayar kamX={kamX - 960} C={C_G} />
      {ORANG.map((o, k) => {
        const a = di(JG[k], f);
        const p = poseGerak(JG[k], f, 0, f >= o.toleh ? 1 : -1);
        return <TokohTegakLapis key={k} x={a.x - kamX + 960} tanah={TANAH_LAYAR} s={S} pose={p} kostum="kini" kepala={o.kepala} />;
      })}
    </>);
};
const kepalaKota = (f: number, k: number): P2 => {
  const a = di(JG[k], f), kamX = kamG(f);
  return kepalaLayar(a.x - kamX + 960, gayaT(a.psi, 0, a.a));
};

/* ════════════════════════════ SCENE ════════════════════════════ */
const tA = { buka: T.kedua + 40 };
const tG = { masuk: T.itulah - 6, tanya: T.belum };
/** ekor: kota NAIK 320 px ease-in cubic selama bilah pertama kotak naik Scene 07 menutupnya (aturan swipe Simon 27 Okt); Scene 06 digambar sampai
 *  bilah ketiga (latar Scene 07) menutup penuh di AKHIR + 90 */
const S06_SAMPAI = AKHIR + 90;
export const Scene06Flat: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= S06_SAMPAI) return null;
  const buka = cin(f, tA.buka);

  /* tanda-tanda (posisi kepala) — aturan 17: yang lama selesai keluar tepat saat yang baru mulai masuk di tempat yang sama */
  const kT = kepalaPadang(f, 'tetangga'), kK = kepalaPadang(f, 'tokoh');
  const tanyaT = popIn(f, tP.tanya) * popOut(f, tP.tanyaKeluar);
  const bat = popIn(f, tP.baterai) * popOut(f, tP.bateraiKeluar);
  const isiBat = 1 - 0.2 * cin(f, tP.kuras);
  const mataP = popIn(f, tP.mata) * popOut(f, tP.otak - 60);
  const tandaSinga = popIn(f, tP.tanda) * popOut(f, tP.lariLagi + 40);
  const merah = cin(f, tP.merah) * (1 - cin(f, tP.merah + 90));
  const otakP = popIn(f, tP.otak) * popOut(f, tP.tanyaLari - 60);
  const tanyaK = popIn(f, tP.tanyaLari) * popOut(f, tF.masuk);
  const naikLama = -320 * lin(f, AKHIR, AKHIR + 60) ** 3;

  const padangLengkap = (
    <>
      <Padang f={f} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 55%, ${rgba(ARAH.turun, 0)} 45%, ${rgba(ARAH.turun, 0.32)} 100%)`,
        opacity: merah }} />
      <Tanda x={kT[0]} y={kT[1] - 170} p={tanyaT} teks="?" warna={B.orange} />
      <Baterai x={kK[0]} y={kK[1] - 175} isi={isiBat} p={bat} />
      <Bulat x={kK[0]} y={kK[1] - 175} d={96} warna={B.blue} ikon="mata" p={mataP} />
      <Tanda x={xsSinga(f)} y={420} p={tandaSinga} teks="!" warna={ARAH.turun} />
      <Bulat x={kK[0]} y={kK[1] - 175} d={96} warna={B.blue} ikon="otak" p={otakP} />
      <Tanda x={kK[0]} y={kK[1] - 175} p={tanyaK} teks="?" warna={B.orange} />
      <KotakTeks f={f} keluar={tF.masuk - 20} y={130} bagian={[{ teks: 'Berlari dulu,', at: T.berlari3 }, { teks: 'baru bertanya kenapa.', at: T.baru }]} />
    </>);
  const kotaLengkap = (
    <>
      <Kota f={f} />
      {(() => { const k = kepalaKota(f, 4); return <Tanda x={k[0]} y={k[1] - 170} p={popIn(f, tG.tanya) * popOut(f, EKOR)} teks="?" warna={B.orange} />; })()}
    </>);

  /* PARALAKS (Simon 28 Okt: "Transisi ke adegan detektor asap gunakan paralax" · "Gunakan transisi paralax ke adegan kota") — resep S01/S02→S03:
   * pembatas latar depan + motion blur per lapis, adegan lama terdorong ease-in cubic. Padang → dapur: pohon akasia padang; dapur → kota: lampu kota.
   * Dulu: dorong polos ke kiri. */
  let isi: React.ReactNode;
  if (f < tF.masuk - 30) isi = buka < 1
    ? <MaskerBulat cx={960} cy={540} d={lerp(4, 2400, buka)} tepi={buka > 0 ? SISI : 0} putih={1 - buka}><Padang f={f} /></MaskerBulat>
    : padangLengkap;
  else if (f < tF.masuk + 30) isi = <TransisiParalaks f={f} pusat={tF.masuk} lama={padangLengkap} baru={<Ruang f={f} />} pembatas={POHON_S03} />;
  else if (f < tG.masuk - 30) isi = <Ruang f={f} />;
  else if (f < tG.masuk + 30) isi = <TransisiParalaks f={f} pusat={tG.masuk} lama={<Ruang f={f} />} baru={kotaLengkap} pembatas={LAMPU_KOTA} />;
  else isi = <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: f > AKHIR ? `translate3d(0, ${naikLama}px, 0)` : undefined }}>{kotaLengkap}</div>;
  return <>{f >= tA.buka - 30 ? isi : null}</>;
};
/** posisi layar "!" di atas kepala singa (dunia → layar) */
const xsSinga = (f: number) => X_SINGA + 330 - kamP(f) + 960;
