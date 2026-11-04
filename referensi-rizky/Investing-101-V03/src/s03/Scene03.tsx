import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, io, lerp } from '../theme';
import { cin, Icon, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { S02_GABUNG, TUMPUK_S3 } from '../s02/Scene02';

/**
 * SCENE 03 — IDE VISUAL (13 Okt). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Tiga dompet: Uang Aktif | Uang Stabil | Uang Jangka Panjang   (baris aksara Cina di naskah tidak dipakai — teks layar Bahasa Indonesia)
 *   TEXT    "Tiga jenis uang" / "tiga tugas berbeda"  (dua baris naskah → judul + sub-judul)
 * Empat ketukan:
 *   A  "Cara paling sederhana, kita bisa membagi uang menjadi tiga kelompok:"   dua tumpukan Scene 02 menyatu (keluar S02) → dibagi jadi tiga, pemisah tumbuh · judul
 *   B  "uang aktif, uang stabil, dan uang jangka panjang."                       label tiap kelompok di katanya (titik warna + nama)
 *   C  "Bayangkan seperti punya tiga dompet."                                    tiap tumpukan masuk ke dompetnya (lingkaran warna + ikon dompet)
 *   D  "Setiap dompet punya tugas sendiri, dan punya waktu penggunaan yang berbeda."  foto tugas (foto Simon V02 S13) · batang waktu pendek/sedang/panjang · sub-judul
 * Warna: aktif = Neon Blue (= "bulan depan" Scene 02) · stabil = Dark Turquoise · jangka panjang = Dark Orange (= "5 tahun lagi" Scene 02).
 */

const [membagi, uang, tiga, kelompok, aktif, stabil, jangka, tiga2, setiap, dompet2, tugas, sendiri, waktu, berbeda] = urut([
  'membagi', 'uang', 'tiga', 'kelompok', 'aktif', 'stabil', 'jangka', 'tiga', 'setiap', 'dompet', 'tugas', 'sendiri', 'waktu', 'berbeda'], BATAS.s3);

const T = {
  bagi: membagi + 20, // tumpukan kiri & kanan meluncur keluar dari tumpukan tengah (selesai di "uang")
  pemisah: tiga, judul: tiga + 24, // pemisah tumbuh di "menjadi TIGA kelompok"
  label: [aktif - 8, stabil - 8, jangka - 8], // kata kunci label setengah-mendarat di katanya (WordText +8); label 3 di "jangka" (tanpa jeda diam)
  dompet: [tiga2 - 30, tiga2 - 10, tiga2 + 10], // "punya tiga dompet": dompet pop berjenjang 20f, mulai di "punya"
  penghubung: dompet2, tugas: [tugas, tugas + 12, tugas + 24], sub: tugas + 10, subSorot: sendiri + 20,
  waktu: [waktu, waktu + 12, waktu + 24], berbeda,
  awal: setiap, // (jangkar urutan)
};
void uang; void kelompok; void T.awal;
/** KELUAR Scene 03 = milik Scene 04 ("Yang pertama adalah uang aktif."): di "pertama" dompet lain MEREDUP (dompet aktif disorot Scene 04), di "uang
 *  aktif" dompet stabil & jangka panjang TURUN 220 px + memudar berjenjang (pola peta bab V02), tugas/waktu/pemisah/judul memudar. Dompet & label
 *  Uang Aktif digambar Scene 04 mulai BATAS.s4 (titik & rupa sama). */
const [pertama4, uang4] = urut(['pertama', 'uang'], BATAS.s4);
export const S03_KELUAR = { redup: pertama4, turun: uang4 - 10 };

/* ── tata letak: tiga kolom simetris di 960 ± 560; isi 238–831 berpusat di y ±540 ── */
const KOL = [400, 960, 1520];
const WARNA = [B.blue, B.turq, B.orange];
const NAMA = ['Uang Aktif', 'Uang Stabil', 'Uang Jangka Panjang'];
/** foto tugas = foto Simon Video 02 Scene 13 (kebutuhan sehari-hari · tujuan menengah · pertumbuhan jangka panjang) — rasio lebar/tinggi */
const TUGAS: [string, number][] = [['media/tugas-sehari.webp', 520 / 457], ['media/tugas-menengah.webp', 520 / 430], ['media/tugas-pertumbuhan.webp', 520 / 507]];
/** batang "waktu penggunaan": pendek · sedang · panjang (tanpa angka — angka waktu tiap uang dibahas di scene masing-masing) */
const PANJANG_WAKTU = [0.18, 0.55, 1];
/** tata letak AKHIR (D, isi 265–837 berpusat di y ±551); sebelumnya kelompok digeser ke bawah sebesar `dy` (geser bertahap 60f — susunan setengah jadi
 *  tidak menggantung di atas): A tumpukan sendirian di y 540 (dy 175) · B–C tumpukan/dompet + label (dy 140) · D semua (dy −10) */
const Y0 = { tumpuk: 365, dompet: 365, label: 525, tugas: 665, waktu: 815 };
const DY = { A: TUMPUK_S3.y - 365, B: 140, D: -10 };
const dyPada = (f: number) => lerp(lerp(DY.A, DY.B, cin(f, T.label[0] - 30)), DY.D, cin(f, T.penghubung));
const TUMPUK = { w: TUMPUK_S3.w, h: TUMPUK_S3.w / (520 / 441) };
const D_DOMPET = 200, D_TUGAS = 150, BATANG_W = 300;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
/** denyut 6 % (40f) — "menjadi TIGA kelompok": tiga tumpukan berdenyut bergiliran (menghitung, pola denyut bergilir V02 "satu per satu") */
const denyut = (f: number, at: number) => 0.06 * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));

export const Scene03: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s3 + 40 || f >= S03_KELUAR.turun + 60) return null; // masuk: tumpukan Scene 02 menyatu sampai ±s3+80 · keluar: lihat S03_KELUAR
  const bagi = cin(f, T.bagi);
  const pemisah = cin(f, T.pemisah) * (1 - cin(f, S03_KELUAR.turun));
  return (
    <AbsoluteFill>
      {/* pemisah kelompok ("menjadi tiga kelompok") — garis putus tegak tumbuh dari tengah */}
      {pemisah > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {[680, 1240].map((x) => <line key={x} x1={x} x2={x} y1={540 - 300 * pemisah} y2={540 + 300 * pemisah} stroke={B.grayLite} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />)}
        </svg>) : null}
      {[0, 1, 2].map((k) => <Kolom key={k} f={f} k={k} bagi={bagi} dy={dyPada(f)} />)}
      <Judul f={f} kata={['Tiga', 'jenis', 'uang']} at={T.judul} keluar={S03_KELUAR.turun} />
      <Judul f={f} kata={['tiga', 'tugas', 'berbeda']} sorotIdx={1} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S03_KELUAR.turun} />
    </AbsoluteFill>);
};

const Kolom: React.FC<{ f: number; k: number; bagi: number; dy: number }> = ({ f, k, bagi, dy }) => {
  const x = KOL[k], warna = WARNA[k];
  const Y = { tumpuk: Y0.tumpuk + dy, dompet: Y0.dompet + dy, label: Y0.label + dy, tugas: Y0.tugas + dy, waktu: Y0.waktu + dy };
  // A: tumpukan (tengah = pengganti tumpukan gabungan Scene 02; kiri/kanan meluncur keluar dari baliknya)
  const tx = k === 1 ? x : lerp(KOL[1], x, bagi);
  // serah-terima: tumpukan tengah tampil TEPAT saat tumpukan Scene 02 disembunyikan (ambang yang sama, cin(S02_GABUNG) ≥ 0,999) — tanpa frame kosong
  const tampil = k === 1 ? (cin(f, S02_GABUNG) >= 0.999 ? 1 : 0) : bagi > 0.001 ? 1 : 0;
  // C: masuk ke dompet — mengecil ke pusat dompet & memudar, dompet pop di belakangnya
  const masuk = R(f, T.dompet[k] - 30, T.dompet[k] + 30, 0, 1, io);
  const dompetP = popIn(f, T.dompet[k]);
  const ikonP = popIn(f, T.dompet[k] + 14);
  const labelP = popIn(f, T.label[k] - 8);
  const tugasP = popIn(f, T.tugas[k]);
  const penghubung = R(f, T.penghubung - 30, T.penghubung + 30, 0, 1, io);
  const waktuP = R(f, T.waktu[k] - 30, T.waktu[k] + 30, 0, 1, io);
  const jamP = popIn(f, T.waktu[k] - 10);
  const [foto, rasio] = TUGAS[k];
  const fw = D_TUGAS * 1.1, fh = fw / rasio;
  // keluar (Scene 04): kolom aktif — dompet & label diambil alih Scene 04, sisanya memudar; kolom lain meredup lalu turun berjenjang
  const turun = k === 0 ? 0 : cin(f, S03_KELUAR.turun + 6 * (k - 1));
  const gayaA: React.CSSProperties = k === 0 ? { display: f >= BATAS.s4 ? 'none' : undefined }
    : { opacity: (1 - 0.45 * cin(f, S03_KELUAR.redup)) * (1 - turun), transform: geser(0, 220 * turun) };
  const gayaB: React.CSSProperties = k === 0 ? { opacity: 1 - cin(f, S03_KELUAR.turun) } : gayaA;
  return (
    <>
     <div style={{ position: 'absolute', inset: 0, ...gayaA }}>
      {/* dompet (di belakang tumpukan yang sedang masuk) */}
      {dompetP > 0.001 ? (
        <div style={{ position: 'absolute', left: x - D_DOMPET / 2, top: Y.dompet - D_DOMPET / 2, width: D_DOMPET, height: D_DOMPET, borderRadius: '50%', background: warna,
          display: 'grid', placeItems: 'center', transform: `scale(${dompetP * (1 + denyut(f, T.berbeda + 6 * k))})`, boxShadow: `0 18px 40px -12px ${warna}aa` }}>
          <div style={{ transform: `scale(${ikonP})` }}><Icon name="dompet" size={D_DOMPET * 0.52} color={B.white} /></div>
        </div>) : null}
      {tampil && masuk < 0.999 ? (
        <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: TUMPUK.w, height: TUMPUK.h, maxWidth: 'none', transformOrigin: 'center',
          opacity: R(masuk, 0.55, 1, 1, 0), transform: `${geser(tx - TUMPUK.w / 2, Y.tumpuk - TUMPUK.h / 2)} scale(${lerp(1, 0.32, masuk) * (1 + denyut(f, T.label[k] + 8) + denyut(f, tiga - 16 + 16 * k))})` }} />) : null}
      {/* B: label kelompok — titik warna + nama (teks VISUAL naskah) */}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, Y.label), translate: '-50% -50%', display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: warna, transform: `scale(${labelP})` }} />
        <WordText halus f={f} at={T.label[k]} style={{ fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>{NAMA[k]}</WordText>
      </div>
     </div>
     <div style={{ position: 'absolute', inset: 0, ...gayaB }}>
      {/* D: tugas — penghubung putus dari label ke foto tugas */}
      {penghubung > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <line x1={x} x2={x} y1={Y.label + 32} y2={Y.label + 32 + (Y.tugas - D_TUGAS / 2 - 12 - Y.label - 32) * penghubung} stroke={warna} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />
        </svg>) : null}
      {tugasP > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(x, Y.tugas)} scale(${tugasP})` }}>
          <div style={{ position: 'absolute', left: -D_TUGAS / 2, top: -D_TUGAS / 2, width: D_TUGAS, height: D_TUGAS, borderRadius: '50%', background: warna, boxShadow: `0 14px 30px -12px ${warna}aa` }} />
          <Img src={staticFile(foto)} style={{ position: 'absolute', left: -fw / 2, top: -fh / 2, width: fw, height: fh, maxWidth: 'none' }} />
        </div>) : null}
      {/* D: waktu penggunaan — ikon jam + batang (pendek · sedang · panjang) */}
      {jamP > 0.001 || waktuP > 0.001 ? (
        <div style={{ position: 'absolute', left: x - (BATANG_W + 56) / 2, top: Y.waktu - 22, width: BATANG_W + 56, height: 44 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 44, height: 44, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center', transform: `scale(${jamP})` }}>
            <Icon name="waktu" size={26} color={B.white} />
          </div>
          <div style={{ position: 'absolute', left: 56, top: 14, width: BATANG_W, height: 16, borderRadius: 8, background: B.grayLite, opacity: 0.6 * Math.min(1, waktuP * 3) }} />
          <div style={{ position: 'absolute', left: 56, top: 14, width: BATANG_W * PANJANG_WAKTU[k] * waktuP, height: 16, borderRadius: 8, background: warna }} />
        </div>) : null}
     </div>
    </>);
};

/** posisi akhir dompet & label Uang Aktif di Scene 03 — titik serah-terima ke Scene 04 */
export const S03_DOMPET_AKTIF = { x: KOL[0], y: Y0.dompet + DY.D, labelY: Y0.label + DY.D, d: D_DOMPET, warna: WARNA[0], nama: NAMA[0] };

export const S03_T = T;
