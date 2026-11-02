import React from 'react';
import { ARAH, B, CEK, F, R, bayanganDengan, lerp, mixHex, rgba } from '../theme';
import { cin, popOut, skalaPop } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Kutipan, Lencana } from '../parts/umum';
import { Kaca, KarakterLingkar, type PoseKarakter } from '../parts/kaca';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { BERDIRI, JALAN_FRAME, LARI_FRAME, alasTerendah, gaya as gayaT, panjangSiklus as panjangT, titikKepala, type Pose } from '../flat/rigTegak';
import { HutanLayar, TANAH_LAYAR, TokohTegakLapis, ambil, simulasi } from '../flat/dunia';
import { KEL_RUPA } from '../s01flat/Scene01Flat';
import { Buah, Genggam, PEGANG_DEKAT, Tombak } from '../s02flat/Scene02Flat';
import { MaskerBulat } from '../s03flat/Scene03Flat';

/**
 * SCENE 09 — Dorongan Mengambil Lebih Banyak dan Rasa "Saya Bisa" (BATAS.s9 – BATAS.s10). Bagian ANALOGI (dunia masa lalu) = 2D flat + karakter;
 * bagian investor modern = GAYA RUMAH (Simon 27 Okt: "style flat dengan char hanya digunakan untuk scene yang analogi").
 * REVISI 29 Okt (Simon, S09): "Transisi dari scene 8 ke scene 9 gunakan shape 2 persegi" · "Tambahkan illustrasi berburu, dan berpindah, berlayar (3 panel
 * seperti di scene sebelumnya)" · "Gambar orangnya jangan di pop up, swipe keatas saja; lingkaran masking dan lingkaran background harus memiliki timing
 * yang sama" · "Redesign dan buat ide visual baru untuk 'Masalahnya bukan pada dorongan itu sendiri. Masalahnya muncul ketika dorongan tersebut berjalan
 * terlalu jauh di pasar.'"
 *  ⓪ dua bilah layar penuh (turkis · turkis muda) naik, lalu adegan padang naik menutupnya (resep kotak S04/S07; adegan S08 naik ease-in).
 *  A padang: tokoh dulu di samping KERANJANG; "mengambil lebih banyak" → buah bertambah; "percaya diri" → trofi; "keduanya pernah berguna" → ✓; "musim
 *    sulit" → padang mengering, keranjang tetap penuh ✓ (langkah 1 & 3).
 *  B "Sementara keyakinan 'saya bisa'" → gelembung di atas kepala tokoh; padang MENGECIL jadi KARTU 1 = pola kartu Scene 02 (jendela ke padang yang sama):
 *    1 berburu (berlari membawa tombak) · 2 berpindah (tiga orang berjalan beriringan) · 3 berlayar (perahu) — pop di katanya, kartu lama memberi ruang;
 *    "menuju tempat yang belum terlihat" → kartu 3 MELEBAR jadi pantai layar penuh, pulau berkabut menjadi jelas saat perahu tiba (langkah 2–3).
 *  C IDE BARU — METER "DORONGAN": pantai MENGECIL jadi lingkaran turkis = lingkaran foto kamu (foto NAIK di dalam masker lingkaran yang sama); di kanan
 *    kartu meter setengah lingkaran hijau "Wajar" → oranye → merah "Berlebihan". "bukan pada dorongan itu sendiri" → jarum di hijau + ✓; "dorongan
 *    tersebut berjalan" → jarum naik ke oranye; "terlalu jauh" → jarum masuk merah, zona merah menyala + "!" (langkah 4–6).
 *  Serah-terima: foto kamu tetap di tempatnya — Scene 10 melanjutkannya; kartu meter pop keluar 60 f berpusat di frame pertama Scene 10 + 30.
 */
const W = urut(['kesalahan', 'ketiga', 'leverage', 'berlebihan', 'dorongan', 'mengambil', 'lebih', 'banyak', 'percaya', 'diri', 'tinggi', 'keduanya', 'berguna',
  'mengambil', 'makanan', 'cadangan', 'musim', 'sulit', 'sementara', 'keyakinan', 'saya', 'bisa', 'berani', 'berburu', 'berpindah', 'berlayar', 'menuju',
  'belum', 'terlihat', 'masalahnya', 'bukan', 'dorongan', 'sendiri', 'masalahnya', 'muncul', 'dorongan', 'berjalan', 'terlalu', 'jauh', 'pasar'], BATAS.s9 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  kesalahan: n(), ketiga: n(), leverage: n(), berlebihan: n(), dorongan: n(), mengambil: n(), lebih: n(), banyak: n(), percaya: n(), diri: n(), tinggi: n(),
  keduanya: n(), berguna: n(), mengambil2: n(), makanan: n(), cadangan: n(), musim: n(), sulit: n(), sementara: n(), keyakinan: n(), saya: n(), bisa: n(),
  berani: n(), berburu: n(), berpindah: n(), berlayar: n(), menuju: n(), belum: n(), terlihat: n(), masalahnya: n(), bukan: n(), dorongan2: n(), sendiri: n(),
  masalahnya2: n(), muncul: n(), dorongan3: n(), berjalan: n(), terlalu: n(), jauh: n(), pasar: n(),
};
export const S09_T = T;
const AWAL = BATAS.s9, AKHIR = BATAS.s10;
const EKOR = AKHIR + 30;
const S = 0.82;
/** kamu = pria kemeja biru (sama dengan Scene 05/07/08); POSISI kamu dipakai Scene 10 untuk serah-terima */
/** `pita`: masker = lingkaran latar di KIRI, KANAN & BAWAH (hanya kepala yang keluar di atas) — Simon 29 Okt: "besar kanan, kiri, dan bawah harus sama antara
 *  lingkaran masking dan lingkaran background" (dulu bagian atas masker selebar foto → siku/bahu bisa keluar dari lingkaran) */
export const KAMU_S09: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280, pita: true };
/** kamu (Ø260) + kartu meter (700 px, celah 120) berpusat di x 960, pusat isi y 497 */
export const POS_KAMU = { x: 550, y: 497, d: 260 };

/* ════════════════════════════ A · KERANJANG PERSEDIAAN ════════════════════════════ */
/** Simon 30 Okt (audit pusat): tokoh (x 860) + keranjang (1030–1330) dulu berpusat x 1070 → keduanya bergeser −110 (pusat 960); lencana matahari
 *  "musim kering" pindah dari (1600, 214) — sebagian di zona logo — ke langit tengah (960, 214) */
const X_TOKOH_A = 750;
const KERANJANG = { x: 1070, alas: TANAH_LAYAR + 4, w: 300, h: 150 };
const BUAH_K: [number, number][] = [[-90, -10], [-30, -14], [30, -12], [90, -8], [-60, -52], [0, -56], [60, -50], [-30, -94], [30, -92]];
const tA = { buah: BUAH_K.map((_, k) => (k < 3 ? T.kesalahan - 100 : T.mengambil - 10 + (k - 3) * 12)), trofi: T.percaya, cek: T.berguna,
  kering: T.sulit - 10, cadangan: T.cadangan + 10 };
const Keranjang: React.FC<{ f: number }> = ({ f }) => {
  const { x, alas, w, h } = KERANJANG;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {BUAH_K.map(([dx, dy], k) => {
        const p = popIn(f, tA.buah[k]); if (p <= 0) return null;
        return <g key={k} transform={`translate(${x + dx} ${alas - h + dy + 6}) scale(${skalaPop(p)})`}><Buah r={30} /></g>;
      })}
      <ellipse cx={x} cy={alas} rx={w * 0.52} ry={18} fill={B.night} opacity={0.18} />
      <path d={`M ${x - w / 2} ${alas - h} L ${x + w / 2} ${alas - h} L ${x + w * 0.38} ${alas} L ${x - w * 0.38} ${alas} Z`} fill="#A0763F" />
      {[0.25, 0.5, 0.75].map((u) => <line key={u} x1={x - w / 2 + (w * 0.12) * u} x2={x + w / 2 - (w * 0.12) * u} y1={alas - h + h * u} y2={alas - h + h * u}
        stroke="#7E5A2E" strokeWidth={6} strokeLinecap="round" />)}
      {[-0.3, -0.1, 0.1, 0.3].map((u) => <line key={u} x1={x + w * u} x2={x + w * u * 0.78} y1={alas - h} y2={alas} stroke="#8A6233" strokeWidth={5} opacity={0.7} />)}
      <rect x={x - w / 2 - 8} y={alas - h - 12} width={w + 16} height={22} rx={11} fill="#B8894E" />
    </svg>);
};
const poseA = (f: number): Pose => {
  const napas = Math.sin((2 * Math.PI * f) / 210);
  const angguk = Math.sin(Math.PI * R(f, tA.trofi, tA.trofi + 40, 0, 1, (x) => x)) ** 2;
  return { ...BERDIRI, badan: BERDIRI.badan + 0.6 * napas, kepala: -0.6 * napas + 5 * angguk };
};
const Padang: React.FC<{ f: number }> = ({ f }) => (
  <>
    <HutanLayar kamX={960} C={-1800} lapis="belakang" />
    <Keranjang f={f} />
    <TokohTegakLapis x={X_TOKOH_A} tanah={TANAH_LAYAR} s={S} pose={poseA(f)} kostum="dulu" />
    <HutanLayar kamX={960} C={-1800} lapis="depan" />
    {/* musim sulit: padang mengering (rona hangat), keranjang tetap penuh */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(214,170,96,0.30) 0%, rgba(190,140,70,0.42) 100%)', mixBlendMode: 'multiply',
      opacity: cin(f, tA.kering, 60) }} />
  </>);

/* ════════════════════════════ B · PERAHU KE PULAU ════════════════════════════ */
/** B: "Saya bisa!" di atas kepala tokoh padang → padang MENGECIL jadi kartu 1 (berburu) → kartu 2 (berpindah) & 3 (berlayar) pop di katanya, kartu lama
 *  memberi ruang → kartu 3 MELEBAR jadi pantai layar penuh; perahu tiba saat pulau tak lagi berkabut ("belum terlihat") */
const tB = { sayaBisa: T.saya - 6, sayaKeluar: T.berani - 40, kartu1: T.berani - 5, layar: T.berlayar - 10, tiba: T.masalahnya - 36, kabut: T.terlihat,
  keluar12: T.menuju + 12, lebar3: T.menuju + 42 };
/** x perahu (layar-dunia pantai) */
const xPerahu = (f: number) => lerp(470, 1250, cin(f, (tB.layar + tB.tiba) / 2, tB.tiba - tB.layar));
const LAUT_Y = 640;
const Pantai: React.FC<{ f: number }> = ({ f }) => {
  const bx = xPerahu(f), ayun = Math.sin((2 * Math.PI * f) / 90), by = 772 + 5 * ayun;
  const kabut = 1 - cin(f, tB.kabut); // 28 Okt: 90 → 60 f (semua animasi 60 f)
  const napas = Math.sin((2 * Math.PI * f) / 200);
  const p: Pose = { ...BERDIRI, badan: BERDIRI.badan + 0.6 * napas, kepala: -0.6 * napas };
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #B9E3CB 0%, #F2FAEF 60%)' }} />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* pulau di cakrawala (berkabut sampai "terlihat") */}
        {/* berkabut = pulau sendiri memudar ke warna langit (dulu kotak kabut bertepi keras) */}
        <g opacity={0.28 + 0.72 * (1 - kabut)}>
          <path d={`M 1440 ${LAUT_Y + 6} C 1500 ${LAUT_Y - 110}, 1720 ${LAUT_Y - 130}, 1830 ${LAUT_Y + 6} Z`} fill="#869C4E" />
          <path d={`M 1590 ${LAUT_Y - 60} C 1600 ${LAUT_Y - 140}, 1610 ${LAUT_Y - 190}, 1630 ${LAUT_Y - 230}`} stroke="#6B4E2E" strokeWidth={12} fill="none" strokeLinecap="round" />
          {[-60, -20, 20, 60].map((a) => <path key={a} d={`M 1630 ${LAUT_Y - 230} q ${a} -40 ${a * 1.8} 10`} stroke="#5E7030" strokeWidth={14} fill="none" strokeLinecap="round" />)}
        </g>
        {/* laut + ombak */}
        <rect x={0} y={LAUT_Y} width={1920} height={1080 - LAUT_Y} fill="#7FC9DA" />
        <rect x={0} y={LAUT_Y + 160} width={1920} height={1080 - LAUT_Y - 160} fill="#69BBD0" />
        {[0, 1, 2, 3, 4].map((r) => {
          const y = LAUT_Y + 40 + r * 70, geser = ((f * (0.6 + r * 0.15)) % 160);
          return <path key={r} d={Array.from({ length: 14 }, (_, k) => `M ${k * 160 - geser + (r % 2) * 80} ${y} q 30 -14 60 0`).join(' ')} stroke="#B3E2EC" strokeWidth={6}
            strokeLinecap="round" fill="none" opacity={0.8} />;
        })}
        {/* pasir pantai kiri */}
        <path d={`M 0 ${LAUT_Y + 40} C 200 ${LAUT_Y + 50}, 420 ${LAUT_Y + 120}, 560 1080 L 0 1080 Z`} fill="#E8C98A" />
      </svg>
      {/* dua orang berdiri di perahu (kaki tertutup lambung) */}
      <TokohTegakLapis x={bx - 90} tanah={by + 30} s={S} pose={p} kostum="dulu" />
      <TokohTegakLapis x={bx + 70} tanah={by + 30} s={S} pose={{ ...p, badan: p.badan - 1 }} kostum="dulu" kepala={KEL_RUPA[0].kepala} warna={KEL_RUPA[0].warna} />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform={`rotate(${1.6 * ayun} ${bx} ${by})`}>
          <path d={`M ${bx - 250} ${by - 30} L ${bx + 250} ${by - 30} C ${bx + 230} ${by + 30}, ${bx + 170} ${by + 52}, ${bx + 110} ${by + 52} L ${bx - 110} ${by + 52}
            C ${bx - 170} ${by + 52}, ${bx - 230} ${by + 30}, ${bx - 250} ${by - 30} Z`} fill="#8A5A2B" />
          <rect x={bx - 252} y={by - 40} width={504} height={18} rx={9} fill="#A8723A" />
          <path d={`M ${bx - 200} ${by + 8} L ${bx + 200} ${by + 8}`} stroke="#734A22" strokeWidth={5} />
        </g>
        <ellipse cx={bx} cy={by + 62} rx={270} ry={14} fill="#5BA9BE" opacity={0.6} />
      </svg>
    </>);
};

/* ════════════════════════════ B · TIGA KARTU (pola kartu Scene 02) ════════════════════════════ */
/** kartu 410 × 580 (potret), langkah 440 → deretan tiga x 315–1605; jendela dunia zoom 0,68, titik dunia (fokus x, 617) = pusat kartu → tanah ±449 */
const KARTU = { w: 410, h: 580, r: 30, sisi: 6, y: 497, langkah: 440 };
const ZK = 0.68, YC = 617;
const S_V = 0.79;
const NS = AKHIR + 120 - AWAL;
const lajuT = (r: number) => (panjangT(r) * S_V) / lerp(JALAN_FRAME, LARI_FRAME, r);
/** 1 · berburu: berlari membawa tombak (genggam di tengah batang, pose pegang Scene 02); kamera mengikuti */
const BURU = simulasi(NS, () => lajuT(1), () => 1, S_V, 0, 0, panjangT);
const VignetteBuru: React.FC<{ f: number }> = ({ f }) => {
  const a = ambil(BURU, f - AWAL);
  const p = PEGANG_DEKAT(gayaT(a.psi, a.r, a.a), -4);
  const kam = a.x + 40;
  return (
    <>
      <HutanLayar kamX={kam} C={-900} lapis="belakang" />
      <TokohTegakLapis x={a.x - kam + 960} tanah={TANAH_LAYAR} s={S_V} pose={p} kostum="dulu" bayangan pegang={<Genggam p={p} miring={75}><Tombak /></Genggam>} />
      <HutanLayar kamX={kam} C={-900} lapis="depan" />
    </>);
};
/** 2 · berpindah: tiga orang berjalan beriringan (fase langkah berbeda); kamera mengikuti orang tengah */
const PINDAH = [0, 1, 2].map((k) => simulasi(NS, () => lajuT(0), () => 0, S_V, -k * 170, -(k * 9 + 1) / JALAN_FRAME, panjangT));
const VignettePindah: React.FC<{ f: number }> = ({ f }) => {
  const kam = ambil(PINDAH[1], f - AWAL).x;
  return (
    <>
      <HutanLayar kamX={kam} C={-2600} lapis="belakang" />
      {[2, 1, 0].map((k) => {
        const a = ambil(PINDAH[k], f - AWAL), p = gayaT(a.psi, a.r, a.a);
        return <TokohTegakLapis key={k} x={a.x - kam + 960} tanah={TANAH_LAYAR} s={S_V} pose={p} kostum="dulu" bayangan
          kepala={k === 0 ? 'simon' : KEL_RUPA[k - 1].kepala} warna={k === 0 ? undefined : KEL_RUPA[k - 1].warna} />;
      })}
      <HutanLayar kamX={kam} C={-2600} lapis="depan" />
    </>);
};
/** kartu = jendela ke dunia selebar layar: `fokus` (titik dunia) di pusat kartu, zoom `z`; layar penuh = (960, 540, 1920 × 1080, z 1, tanpa bingkai) */
const Kartu9: React.FC<{ x: number; y: number; w: number; h: number; r: number; sisi: number; z: number; fokus: [number, number]; warna: string; s?: number;
  bayang?: number; children: React.ReactNode }> = ({ x, y, w, h, r, sisi, z, fokus, warna, s = 1, bayang = 1, children }) => {
  if (s <= 0.001) return null;
  // bingkai = bayangan INSET di atas isi (dulu `border` CSS: lebar pecahan < 1 px dibulatkan Chrome jadi 1 px → garis tepi muncul & isi bergeser 1 px tepat
  // saat layar penuh ↔ kartu, loncatan f22649 / f22886 — pindai 30 Okt)
  const tx = w / 2 - fokus[0] * z, ty = h / 2 - fokus[1] * z;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: r, overflow: 'hidden',
      background: '#DDF1E4', transformOrigin: 'center', transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)${s < 0.9999 ? ` scale(${skalaPop(s)})` : ''}`,
      boxShadow: bayang > 0.01 ? bayanganDengan(warna, bayang) : undefined }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${z})` }}>{children}</div>
      {sisi > 0.01 ? <div style={{ position: 'absolute', inset: 0, borderRadius: r, boxShadow: `inset 0 0 0 ${sisi}px ${warna}`, pointerEvents: 'none' }} /> : null}
    </div>);
};
/** "tengah dulu, lalu memberi ruang": kartu lama bergeser (60 f, kata − 15) LEBIH DULU, kartu baru pop sesudahnya (kata + 15) — pola Scene 02 */
const MUNCUL = [T.berburu, T.berpindah, T.berlayar];
const xKartu = (k: number, f: number) => 960 + (KARTU.langkah / 2) * k
  - (KARTU.langkah / 2) * [1, 2].filter((j) => j > k).reduce((a, j) => a + cin(f, MUNCUL[j] - 15), 0);
/** geometri kartu antara layar penuh (u = 0) dan kartu (u = 1) */
const geoKartu = (u: number, x: number, fx: number) => ({ x: lerp(960, x, u), y: lerp(540, KARTU.y, u), w: lerp(1920, KARTU.w, u), h: lerp(1080, KARTU.h, u),
  r: lerp(0, KARTU.r, u), sisi: lerp(0, KARTU.sisi, u), z: lerp(1, ZK, u), fokus: [lerp(960, fx, u), lerp(540, YC, u)] as [number, number], bayang: u });

/* ════════════════════════════ C · METER "DORONGAN" (GAYA RUMAH) ════════════════════════════ */
/** morf pantai → lingkaran kamu di "Masalahnya"; foto NAIK sesudah lingkaran jadi; kartu meter pop di "bukan"; jarum hijau → oranye → merah */
const tC = { morf: T.masalahnya, kamu: T.masalahnya + 60, meter: T.bukan + 10, cek: T.sendiri - 10, hijau: T.dorongan2 - 10, oranye: T.dorongan3 + 10,
  merah: T.terlalu + 10, seru: T.jauh + 6 };
export const TKAMU_S09 = tC.kamu;
const METER = { x: 1150, y: POS_KAMU.y, w: 700, h: 440, px: 350, py: 330, r: 220, tebal: 34 };
const ZONA: { v0: number; v1: number; warna: string }[] = [
  { v0: 0, v1: 0.45, warna: ARAH.naik }, { v0: 0.46, v1: 0.69, warna: B.orange }, { v0: 0.7, v1: 1, warna: ARAH.turun }];
const HIJAU_TEKS = mixHex(ARAH.naik, B.night, 0.3), MERAH_TEKS = mixHex(ARAH.turun, B.night, 0.12);
/** titik pada busur meter (lokal kartu) untuk nilai v (0 = kiri, 1 = kanan) di jari-jari rr */
const titikMeter = (v: number, rr = METER.r): [number, number] => [METER.px - rr * Math.cos(Math.PI * v), METER.py - rr * Math.sin(Math.PI * v)];
const KartuMeter: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  const g = cin(f, tC.meter); // busur ber-trim dari kiri ke kanan BERSAMAAN pop kartu (garis = trim path; kartu tidak pernah kosong)
  const v = 0.18 + 0.16 * cin(f, tC.hijau) + 0.26 * cin(f, tC.oranye) + 0.32 * cin(f, tC.merah);
  const nyala = cin(f, T.jauh);
  const [nx, ny] = titikMeter(v, METER.r - 46);
  const cekP = popIn(f, tC.cek) * popOut(f, tC.oranye - 30), seruP = popIn(f, tC.seru);
  const [cx, cy] = titikMeter(0.22, METER.r), [sx, sy] = titikMeter(0.86, METER.r);
  return (
    <Kaca x={METER.x} y={METER.y} w={METER.w} h={METER.h} p={p} warna={nyala > 0.5 ? ARAH.turun : B.blue} tepi={nyala}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Dorongan</div>
      <svg width={METER.w} height={METER.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {ZONA.map((z) => {
          const v1 = Math.min(z.v1, g);
          if (v1 <= z.v0) return null;
          const [x0, y0] = titikMeter(z.v0), [x1, y1] = titikMeter(v1);
          const merah = z.warna === ARAH.turun;
          return <path key={z.v0} d={`M ${x0} ${y0} A ${METER.r} ${METER.r} 0 0 1 ${x1} ${y1}`} fill="none" stroke={z.warna} strokeWidth={METER.tebal} strokeLinecap="butt"
            style={merah && nyala > 0.001 ? { filter: `drop-shadow(0 0 ${14 * nyala}px ${rgba(ARAH.turun, 0.7 * nyala)})` } : undefined} />;
        })}
        {/* jarum (muncul bersama busur) */}
        {g > 0.001 ? (
          <g opacity={Math.min(1, g * 2)}>
            <line x1={METER.px} y1={METER.py} x2={nx} y2={ny} stroke={B.night} strokeWidth={10} strokeLinecap="round" />
            <circle cx={METER.px} cy={METER.py} r={18} fill={B.night} /><circle cx={METER.px} cy={METER.py} r={7} fill={B.white} />
          </g>) : null}
      </svg>
      {/* label ujung busur — di bawah ujungnya (label di bawah ikon) */}
      {(['Wajar', 'Berlebihan'] as const).map((t, k) => (
        <div key={t} style={{ position: 'absolute', left: (k === 0 ? METER.px - METER.r : METER.px + METER.r) - 120, width: 240, top: METER.py + 30, textAlign: 'center',
          fontFamily: F, fontSize: 24, fontWeight: 800, color: k === 0 ? HIJAU_TEKS : MERAH_TEKS, opacity: cin(f, tC.meter + 10 + 20 * k) }}>{t}</div>))}
      <Lencana x={cx} y={cy} d={0} p={cekP} warna={CEK} ikon="tersedia" besar={60} />
      <Lencana x={sx} y={sy} d={0} p={seruP} warna={ARAH.turun} teks="!" besar={60} />
    </Kaca>);
};

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene09: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= AKHIR + 70) return null;
  const keluar = popOut(f, EKOR);
  /* ⓪ kotak naik: bilah turkis · turkis muda (60 f, selang 16 f), lalu adegan padang naik menutupnya */
  const naikBilah = (mulai: number) => R(f, mulai, mulai + 60, 1080, 0);
  const naikPadang = f < AWAL + 90 ? naikBilah(AWAL + 30) : 0;
  const kepala: [number, number] = [X_TOKOH_A + 6, 470];
  const badgeKeluar = popOut(f, T.sementara);
  /* titik kepala tokoh padang (ujung ekor gelembung "Saya bisa!") */
  const pa = poseA(f), qa = titikKepala(pa);
  const kepalaA: [number, number] = [X_TOKOH_A + qa[0] * S, TANAH_LAYAR - alasTerendah(pa) * S + qa[1] * S];
  const lapisA = (
    <>
      <Padang f={f} />
      <Bulat x={kepala[0]} y={kepala[1] - 190} d={96} warna={B.orange} ikon="trofi" p={popIn(f, tA.trofi) * badgeKeluar} />
      <Lencana x={kepala[0]} y={kepala[1] - 190} d={96} p={popIn(f, tA.cek) * badgeKeluar} warna={CEK} ikon="tersedia" besar={44} />
      <Lencana x={KERANJANG.x} y={KERANJANG.alas - KERANJANG.h - 120} d={0} p={popIn(f, tA.cek + 14) * badgeKeluar} warna={CEK} ikon="tersedia" besar={70} />
      <Bulat x={960} y={214} d={110} warna={B.orange} ikon="matahari" p={popIn(f, tA.kering) * badgeKeluar} />
    </>);
  const u1 = cin(f, tB.kartu1), aAlfa = 1 - cin(f, tB.kartu1 + 15);
  const keluar12 = popOut(f, tB.keluar12);
  const u3 = cin(f, tB.lebar3);
  const mC = cin(f, tC.morf);
  const naikFoto = cin(f, tC.kamu);
  return (
    <>
      {/* ⓪ bilah turkis · turkis muda (resep BilahKeluar ST-02, 60 f inOut cubic) */}
      {f < AWAL + 90 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, background: B.turq, transform: `translate3d(0, ${naikBilah(AWAL)}px, 0)` }} />
          <div style={{ position: 'absolute', inset: 0, background: B.turqLite, transform: `translate3d(0, ${naikBilah(AWAL + 16)}px, 0)` }} />
        </>) : null}

      {/* ═════ A padang layar penuh → kartu 1 (berburu) ═════ */}
      {f >= AWAL + 30 && u1 <= 0 ? (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: naikPadang > 0 ? `translate3d(0, ${naikPadang}px, 0)` : undefined }}>{lapisA}</div>) : null}
      {u1 > 0 && f < tB.keluar12 + 30 ? (() => {
        const gk = geoKartu(u1, xKartu(0, f), 960);
        return (
          <Kartu9 {...gk} warna={B.orange} s={keluar12}>
            <VignetteBuru f={f} />
            {aAlfa > 0.001 ? <div style={{ position: 'absolute', inset: 0, opacity: aAlfa < 1 ? aAlfa : undefined }}>{lapisA}</div> : null}
          </Kartu9>);
      })() : null}
      {/* kartu 2 · berpindah */}
      {f < tB.keluar12 + 30 ? (() => {
        const gk = geoKartu(1, xKartu(1, f), 960);
        return <Kartu9 {...gk} warna={B.orange} s={popIn(f, MUNCUL[1] + 15) * keluar12}><VignettePindah f={f} /></Kartu9>;
      })() : null}
      {/* kartu 3 · berlayar → MELEBAR jadi pantai layar penuh → MENGECIL jadi lingkaran kamu */}
      {mC <= 0 ? (() => {
        const gk = geoKartu(1 - u3, xKartu(2, f), xPerahu(f));
        return <Kartu9 {...gk} warna={B.orange} s={popIn(f, MUNCUL[2] + 15)}><Pantai f={f} /></Kartu9>;
      })() : mC < 1 ? (
        <MaskerBulat cx={lerp(960, POS_KAMU.x, mC)} cy={lerp(540, POS_KAMU.y, mC)} d={lerp(2400, POS_KAMU.d, mC)} putih={Math.max(0, (mC - 0.4) / 0.6)}
          warnaPutih={B.turq}><Pantai f={f} /></MaskerBulat>
      ) : null}

      {/* gelembung "Saya bisa!" DI ATAS kartu (dulu di bawahnya → hilang seketika saat kartu 1 mulai mengecil, loncatan f22645) */}
      <Kutipan x={kepalaA[0]} y={kepalaA[1] - 92 - 20 - 37} ekor="tengah" teks="Saya bisa!" p={popIn(f, tB.sayaBisa) * popOut(f, tB.sayaKeluar)} warna={B.orange} size={30} />

      {/* ═════ C kamu: lingkaran turkis tetap, foto NAIK di dalam masker lingkaran yang sama (tanpa pop) ═════ */}
      {mC >= 1 && f < AKHIR ? (
        <>
          <div style={{ position: 'absolute', left: POS_KAMU.x - POS_KAMU.d / 2, top: POS_KAMU.y - POS_KAMU.d / 2, width: POS_KAMU.d, height: POS_KAMU.d, borderRadius: '50%',
            background: B.turq }} />
          <KarakterLingkar pose={KAMU_S09} x={POS_KAMU.x} y={POS_KAMU.y} D={POS_KAMU.d} s={1} warna="transparent" cermin naik={naikFoto} />
        </>) : null}
      <KartuMeter f={f} p={popIn(f, tC.meter) * keluar} />
    </>);
};
