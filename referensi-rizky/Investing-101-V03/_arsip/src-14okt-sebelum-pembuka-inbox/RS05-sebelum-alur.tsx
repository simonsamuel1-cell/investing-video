import React from 'react';
import { DompetInfo } from '../parts/infografis';
import { S04_DOMPET_AKHIR, S04_KELUAR, S04_TITIK } from '../s04/Scene04';
import { RS06_MASUK } from './RS06';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, R, io, lerp } from '../theme';
import { Icon, cin, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Lencana, denyut } from '../parts/umum';
import { Chevron, MaskerKeluar, durMasker } from '../parts/kaca';
import { Foto, KartuNilai, Uang } from '../parts/nyata';
import { KartuLilin, laju, relatif } from '../parts/lilin';
import { S05_SAHAM } from '../data/pasar';

/**
 * REVISI SCENE 05 (14 Okt, evaluasi 5 pertanyaan). Pesan: uang aktif ditaruh di tempat yang MUDAH DIAMBIL & STABIL, bukan yang return-nya tertinggi.
 *   A  "tempat yang mudah dicairkan, seperti rekening bank"  kartu saldo Rekening bank (foto celengan) → ATM → uang keluar → langsung dipakai belanja
 *      (saldo Rp5.000.000 → Rp4.500.000): "mudah dicairkan" = kejadian, bukan chip teks
 *   B  "sebagian yang belum akan dipakai … likuiditas tinggi … reksa dana pasar uang"  Rp2 jt keluar dari rekening (lencana jam = nanti) ·
 *      lencana ATM (tetap harus mudah diambil) · kartu RDPU terbentuk di sekelilingnya · panah dua arah (uang bisa kembali)
 *   C  "bukan mencari return tertinggi, tapi likuiditas dan stabilitas"  kartu Saham dengan nilai melonjak-anjlok masuk lalu tersisih;
 *      dua kartu tersisa: lencana ATM berdenyut (likuiditas) · nilainya diam (stabilitas)
 */

const [uangA, aktifA, ditempatkan, mudah, dicairkan, rekening, bank, sebagian, belum, dipakai, tapi, likuiditas, tinggi, reksa, pasar, dipertimbangkan, fokus, bukan, mencari,
  tertinggi, tapi2, likuiditas2, stabilitas] = urut([
  'uang', 'aktif', 'ditempatkan', 'mudah', 'dicairkan', 'rekening', 'bank', 'sebagian', 'belum', 'dipakai', 'tapi', 'likuiditas', 'tinggi', 'reksa', 'pasar', 'dipertimbangkan',
  'fokus', 'bukan', 'mencari', 'tertinggi', 'tapi', 'likuiditas', 'stabilitas'], BATAS.s5);

const T = {
  // masuk dari Scene 04: cakram infografis "Uang Aktif" naik ke tengah & kembali jadi dompet biru, lalu masuk ke kartu rekening
  naikHub: uangA, judul: aktifA + 20, bank: ditempatkan - 10, atm: mudah, tarik: [dicairkan, dicairkan + 60], belanja: dicairkan + 20, denyutBank: [rekening, bank],
  lepasA: sebagian - 30, angkat: [sebagian, dipakai], jam: belum + 10, atmB: likuiditas, sub: tapi + 20, subSorot: tinggi + 10,
  rdpu: reksa, panah: pasar + 20, denyutRdpu: dipertimbangkan,
  saham: fokus, denyutSaham: [bukan, mencari, tertinggi], singkir: tapi2 - 10, denyutCair: likuiditas2, denyutStabil: stabilitas,
};

const SALDO0 = 5_000_000, TARIK = 500_000, SEBAGIAN = 2_000_000;
/** A (Simon 14 Okt "perbaiki layout, size di scene ini"): kartu rekening (528 × 396) · foto ATM · kantong belanja satu BARIS berjarak sama 60 px,
 *  DASAR SEJAJAR dengan tepi bawah kartu (y 798), foto diperbesar (ATM 250 → 300, belanja 190 → 230) supaya setara kartu; pil −Rp500.000 di bawah
 *  kantong (label di bawah benda). Lebar baris 528 + 60 + 300 + 60 + 230 = 1178 → berpusat di 960. */
const A = { bank: 635, atm: 1109, atmW: 300, belanja: 1434, belanjaW: 230, dasar: 763, naik: 35 }; // baris A naik 35 px (ukur: celengan di atas kartu + pil di bawah)
const tinggiFoto = (r: number, w: number) => w / r;
/** Simon 14 Okt — nilai saham naik-turun = candlestick realistis: IHSG harian asli 2 Nov 2020 – 26 Feb 2021 (melonjak +27 % lalu terkoreksi) */
const SAHAM = relatif(S05_SAHAM);

export const RS05: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS06_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s5 || f >= RS06_MASUK.mulai + durMasker) return null;
  const tarik = R(f, T.tarik[0], T.tarik[1], 0, 1, io);
  const lepasA = cin(f, T.lepasA); // rantai ATM → belanja keluar
  const angkat = R(f, T.angkat[0], T.angkat[1], 0, 1, io);
  const rdpu = cin(f, T.rdpu);
  const saham = cin(f, T.saham), singkir = cin(f, T.singkir);
  const tigaKartu = saham * (1 - singkir); // C: ruang untuk kartu ketiga, lalu kembali dua
  // posisi kartu (geser bertahap, selalu berpusat):
  //  A1 bank sendiri 960 · A2 bank 700 + ATM 1130 + belanja 1420 · B bank 640 + uang/RDPU 1280 · C (3 kartu) 440 · 960 · 1480
  // ukur 14 Okt (pusat frame tiap momen): A dulu +36 px → semua A geser −36; B dulu −72…−94 px selagi kartu RDPU belum ada → +80 sampai kartunya muncul
  const gB = 80 * (1 - rdpu);
  const xBank = lerp(lerp(lerp(960, A.bank, cin(f, T.atm)), 640 + gB, lepasA), 440, tigaKartu);
  const xRdpu = lerp(1280, 960, tigaKartu);
  const xSaham = lerp(1900, 1480, saham) + 500 * singkir;
  const saldo = SALDO0 - TARIK * tarik - SEBAGIAN * angkat;
  const atmA = popIn(f, T.atm) * (1 - lepasA);
  const sk = lerp(1.2, 1.0, tigaKartu); // kartu sebesar mungkin; mengecil hanya saat tiga kartu berdampingan
  const Y = 600; // pusat frame (ukur 14 Okt: dulu 560 → isi −40 px)
  const yBank = Y - A.naik * cin(f, T.atm) * (1 - lepasA); // kartu rekening ikut baris A (naik 35), kembali ke Y saat B
  // cakram Uang Aktif (diambil alih dari Scene 04 di batas, titik & rupa sama — S04_DOMPET_AKHIR)
  const naikHub = cin(f, T.naikHub), masukBank = cin(f, T.bank);
  const hubY = lerp(lerp(S04_DOMPET_AKHIR.y, 520, naikHub), Y, masukBank); // naik ke pusat frame, lalu turun ke pusat kartu rekening yang menelannya
  const hub = f < T.bank + 30 ? (
    <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - masukBank), transformOrigin: `960px ${hubY}px`, transform: `scale(${lerp(1, 0.6, masukBank)})` }}>
      <DompetInfo x={960} y={hubY} d={lerp(S04_DOMPET_AKHIR.d, 200, naikHub)} warna={B.blue} putih={1 - cin(f, T.judul)}
        teks={1 - R(f, T.judul - 34, T.judul, 0, 1, io)} baris1="UANG AKTIF" baris2="100%"
        titik={S04_TITIK.map((t, i) => ({ sudut: t.sudut, warna: t.warna, p: popOut(f, S04_KELUAR - 12 + 6 * i) }))} />
      {/* centang hijau Scene 04 ("harus tersedia") menempel di cakram yang sama, DI ATASNYA, lalu pop keluar seperti sebelumnya */}
      {(() => {
        const d = lerp(S04_DOMPET_AKHIR.d, 200, naikHub), p = popOut(f, S04_KELUAR - 10);
        return p > 0.001 ? (
          <div style={{ position: 'absolute', left: 960 + d * 0.39 - 40, top: hubY + d * 0.328 - 40, width: 80, height: 80, borderRadius: '50%', background: ARAH.naik,
            border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 10px 24px -8px ${ARAH.naik}cc` }}>
            <Icon name="tersedia" size={46} color={B.white} />
          </div>) : null;
      })()}
    </div>) : null;
  return (
    <MaskerKeluar f={f} mulai={RS06_MASUK.mulai} ke={RS06_MASUK} warna={RS06_MASUK.warna}>
    <AbsoluteFill>
      {/* kartu rekening muncul di belakang cakram yang masuk ke dalamnya */}
      {/* ═════════ A: ATM → uang keluar → belanja ═════════ */}
      {atmA > 0.001 ? (
        <>
          {/* foto realistis Simon: orang menarik uang di ATM · kantong belanja — uang keluar dari tangan di mulut ATM lalu ke belanjaan */}
          <Foto k="atmTarik" x={A.atm} y={A.dasar - tinggiFoto(734 / 927, A.atmW) / 2} w={A.atmW} p={atmA * (1 + denyut(f, T.tarik[0], 0.04))} />
          {tarik > 0.001 && tarik < 0.999 ? <Uang x={lerp(A.atm + 30, A.belanja, tarik)} y={lerp(Y + 20, A.dasar - 150, tarik) - Math.sin(Math.PI * tarik) * 80} w={lerp(80, 120, Math.min(1, tarik * 3))}
            alfa={R(tarik, 0, 0.15, 0, 1) * R(tarik, 0.85, 1, 1, 0)} /> : null}
          <Foto k="belanjaTas" x={A.belanja} y={A.dasar - tinggiFoto(924 / 1190, A.belanjaW) / 2} w={A.belanjaW} p={popIn(f, T.belanja) * (1 - lepasA) * (1 + denyut(f, T.tarik[1], 0.06))} />
          <PilNominal x={A.belanja} y={A.dasar + 44} teks={`−${rpPenuh(TARIK)}`} arah={0} p={popIn(f, T.tarik[0] + 20) * (1 - lepasA)} size={30} />
        </>) : null}

      {/* ═════════ kartu Rekening bank (foto celengan menumpang di sudut kartu, ref-06) ═════════ */}
      <KartuNilai x={xBank} y={yBank} s={sk} p={popIn(f, T.bank) * (1 + T.denyutBank.reduce((a, t) => a + denyut(f, t, 0.03), 0) + denyut(f, T.denyutStabil, 0.03) + denyut(f, T.denyutRdpu + 40, 0.03) + denyut(f, T.denyutCair + 50, 0.03))}
        nilai={saldo} awal={saldo} ikon="aplikasiBank" nama="Rekening bank" warna={B.blue} label="Saldo" desimal />
      <Foto k="tabungan" x={xBank + 176 * sk} y={yBank - 195 * sk} w={170 * sk} p={popIn(f, T.bank + 16)} />
      {/* lencana ATM di sudut KANAN-BAWAH kartu (ukur 14 Okt: di kiri-atas menutupi ikon kepala kartu) */}
      <Lencana x={xBank + 200 * sk - 43} y={yBank + 150 * sk + 43} d={120} p={popIn(f, T.atmB + 20) * (1 + denyut(f, T.denyutCair, 0.16))} warna={B.blue} ikon="atm" besar={84} />
      {hub}

      {/* ═════════ B: sebagian uang keluar (nanti) → kartu Reksa dana pasar uang ═════════ */}
      {angkat > 0.001 && rdpu < 0.999 ? (
        <>
          <Uang x={lerp(xBank, 1280 + gB, angkat)} y={Y - Math.sin(Math.PI * angkat) * 90} w={lerp(90, 200, angkat)} alfa={R(angkat, 0, 0.2, 0, 1) * (1 - rdpu)} />
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - rdpu }}>
            <PilNominal x={1280 + gB} y={Y + 140} teks={rpPenuh(SEBAGIAN)} arah={0} p={popIn(f, T.angkat[1] - 20)} size={30} />
            <Lencana x={1280 + gB} y={Y - 30} d={200} p={popIn(f, T.jam) * (1 + denyut(f, T.angkat[1] + 30, 0.12) + denyut(f, T.angkat[1] + 58, 0.12))} warna={B.orange} ikon="waktu" besar={64} />
            <Lencana x={1280 + gB - 140} y={Y - 30} d={200} p={popIn(f, T.atmB) * (1 + denyut(f, T.atmB - 20, 0.1))} warna={B.blue} ikon="atm" besar={64} />
          </div>
        </>) : null}
      <KartuNilai x={xRdpu} y={Y} s={sk} p={popIn(f, T.rdpu) * (1 + denyut(f, T.denyutRdpu, 0.03) + denyut(f, T.denyutStabil + 8, 0.03) + denyut(f, T.denyutRdpu + 48, 0.03) + denyut(f, T.denyutCair + 58, 0.03))} nilai={SEBAGIAN} awal={SEBAGIAN}
        ikon="rdPasarUang" nama="Reksa dana pasar uang" warna={B.turq} label="Nilai" />
      <Lencana x={xRdpu + 200 * sk - 43} y={Y + 150 * sk + 43} d={120} p={popIn(f, T.rdpu + 20) * (1 + denyut(f, T.denyutCair + 8, 0.16))} warna={B.blue} ikon="atm" besar={84} />
      {/* panah dua arah: uang bisa pindah & kembali (likuiditas tinggi) */}
      {(() => {
        const p = popIn(f, T.panah) * (1 - tigaKartu);
        const mx = (xBank + xRdpu) / 2;
        return p > 0.001 ? (
          <>
            <Chevron x={mx} y={Y - 34} warna={B.turq} p={p} d={56} />
            <Chevron x={mx} y={Y + 34} warna={B.blue} p={p} d={56} arah="kiri" />
          </>) : null;
      })()}

      {/* ═════════ C: kartu Saham (return lebih tinggi, nilai melonjak-anjlok) masuk lalu tersisih ═════════ */}
      {saham > 0.001 && singkir < 0.999 ? (
        // memudar masuk selagi meluncur dari kanan (pindai 14 Okt: dulu muncul mendadak di tepi kanan, lonjakan f5475)
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, Math.min(1, saham * 2.5) * (1 - singkir)) }}>
          {/* kartu setinggi dua kartu lain (440 × 330, isi rata tengah) — grafik candle di bagian bawah */}
          <KartuLilin x={xSaham} y={Y} w={440} h={330} p={0.99996} d={SAHAM} g={laju(f, T.saham - 30, T.singkir - 10)} modal={SEBAGIAN} ikon="saham" nama="Saham" warna={B.orange}
            label="Nilai" rata="tengah" besar={56} grafikAtas={220} />
        </div>) : null}

      <Judul f={f} kata={['Uang', 'aktif']} at={T.judul} />
      <Judul f={f} kata={['likuiditas', 'lebih', 'penting']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
