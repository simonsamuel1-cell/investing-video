import React from 'react';
import { DompetInfo } from '../parts/infografis';
import { S04_DOMPET_AKHIR, S04_KELUAR, S04_TITIK } from '../s04/Scene04';
import { RS06_MASUK, S06_KARTU1_AWAL } from './RS06';
import { SKALA, keLokal } from '../skala';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, R, io, lerp, rgba } from '../theme';
import { Icon, cin, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Lencana, denyut } from '../parts/umum';
import { Chevron, bayanganKaca, durMasker } from '../parts/kaca';
import { KartuNilai, Uang } from '../parts/nyata';
import { KartuLilin, laju, relatif } from '../parts/lilin';
import { KartuRute, Rute, titikRute } from '../parts/rute';
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

const [uangA, aktifA, ditempatkan, mudah, dicairkan, seperti, rekening, bank, sebagian, belum, dipakai, tapi, likuiditas, tinggi, reksa, pasar, dipertimbangkan, fokus, bukan, mencari,
  tertinggi, tapi2, likuiditas2, stabilitas] = urut([
  'uang', 'aktif', 'ditempatkan', 'mudah', 'dicairkan', 'seperti', 'rekening', 'bank', 'sebagian', 'belum', 'dipakai', 'tapi', 'likuiditas', 'tinggi', 'reksa', 'pasar', 'dipertimbangkan',
  'fokus', 'bukan', 'mencari', 'tertinggi', 'tapi', 'likuiditas', 'stabilitas'], BATAS.s5);

const T = {
  // masuk dari Scene 04: cakram infografis "Uang Aktif" naik ke tengah & kembali jadi dompet biru, lalu masuk ke kartu rekening
  naikHub: uangA, judul: aktifA + 20, bank: ditempatkan - 10, masukRek: [ditempatkan + 20, ditempatkan + 70], atm: mudah, tarik: [dicairkan, dicairkan + 60],
  belanja: seperti - 10, keBelanja: [seperti + 10, seperti + 60], denyutBank: [rekening, bank], centangBelanja: rekening,
  lepasA: sebagian - 30, angkat: [sebagian, dipakai], jam: belum + 10, atmB: likuiditas, sub: tapi + 20, subSorot: tinggi + 10,
  rdpu: reksa, panah: pasar + 20, denyutRdpu: dipertimbangkan,
  saham: fokus, denyutSaham: [bukan, mencari, tertinggi], singkir: tapi2 - 10, denyutCair: likuiditas2, denyutStabil: stabilitas,
};

const SALDO0 = 5_000_000, TARIK = 500_000, SEBAGIAN = 2_000_000;
/** A — DIRANCANG ULANG (Simon 14 Okt "redesign dan ganti layoutnya … tidak terlalu berdampak"): bahasa visual ALUR seperti pembuka Scene 02/03 —
 *  dompet Uang Aktif (lanjutan cakram Scene 04) ─ garis ─ kartu Rekening bank ─ bercabang ─ kartu "Tarik tunai" (foto ATM) ─ garis ─ kartu
 *  "Belanja harian". Uang BERJALAN di garis: masuk rekening ("ditempatkan") → ditarik di ATM ("mudah dicairkan", saldo 5 → 4,5 jt) → langsung dipakai
 *  belanja ("seperti rekening bank"). Kartu cabang 500 × 180 (judul 32 px). Lebar 190–1730 (berpusat 960), tinggi 280–815 (berpusat ±548);
 *  geser bertahap selagi simpul bertambah. */
const A = { hub: [618, 290], bank: [1138, 810], kol: 1480, kw: 500, kh: 180, atmY: -125, belY: 125, hubD: 200 };
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
  const xBank = lerp(lerp(lerp(A.bank[0], A.bank[1], cin(f, T.atm)), 640 + gB, lepasA), 440, tigaKartu);
  const xRdpu = lerp(1280, 960, tigaKartu);
  const xSaham = lerp(1900, 1480, saham) + 500 * singkir;
  const saldo = SALDO0 - TARIK * tarik - SEBAGIAN * angkat;
  const sk = lerp(1.2, 1.0, tigaKartu); // kartu sebesar mungkin; mengecil hanya saat tiga kartu berdampingan
  const Y = 540; // pusat frame (ukur 14 Okt: celengan di atas kartu rekening dihapus Simon → isi turun; 600 → 540)
  const yBank = Y;
  // cakram Uang Aktif (diambil alih dari Scene 04 di batas, titik & rupa sama — S04_DOMPET_AKHIR): naik ke tengah & jadi dompet biru, lalu menjadi
  // simpul KIRI alur (bergeser kiri saat kartu rekening muncul, lalu lagi saat cabang ATM muncul)
  const naikHub = cin(f, T.naikHub);
  // cakram diambil alih dari Scene 04 (skala S04) → koordinat lokal Scene 05 (skala S05), supaya serah-terima tetap di titik layar yang sama
  const D4 = keLokal({ x: 960, y: S04_DOMPET_AKHIR.y, d: S04_DOMPET_AKHIR.d }, SKALA.S05, SKALA.S04);
  const hubX = lerp(lerp(D4.x, A.hub[0], cin(f, T.bank)), A.hub[1], cin(f, T.atm)), hubY = lerp(lerp(D4.y, 540, naikHub), Y, cin(f, T.bank)); // sendirian → pusat frame (540); turun ke baris alur (Y) saat kartu rekening muncul
  const hubD = lerp(D4.d, A.hubD, naikHub);
  const hub = lepasA < 0.999 ? (
    <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - lepasA) }}>
      <DompetInfo x={hubX} y={hubY} d={hubD} warna={B.blue} putih={1 - cin(f, T.judul)}
        teks={1 - R(f, T.judul - 34, T.judul, 0, 1, io)} baris1="UANG AKTIF" baris2="100%"
        titik={S04_TITIK.map((t, i) => ({ sudut: t.sudut, warna: t.warna, p: popOut(f, S04_KELUAR - 12 + 6 * i) }))} />
      {/* centang hijau Scene 04 ("harus tersedia") menempel di cakram yang sama, DI ATASNYA, lalu pop keluar seperti sebelumnya */}
      {(() => {
        const p = popOut(f, S04_KELUAR - 10);
        return p > 0.001 ? (
          <div style={{ position: 'absolute', left: hubX + hubD * 0.39 - 40, top: hubY + hubD * 0.328 - 40, width: 80, height: 80, borderRadius: '50%', background: ARAH.naik,
            border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 10px 24px -8px ${ARAH.naik}cc` }}>
            <Icon name="tersedia" size={46} color={B.white} />
          </div>) : null;
      })()}
    </div>) : null;
  // ── alur A: titik sambung ──
  const kartuKiri = xBank - 264 * sk, kartuKanan = xBank + 264 * sk;
  const atmXY: [number, number] = [A.kol, Y + A.atmY], belXY: [number, number] = [A.kol, Y + A.belY];
  const masukRek = R(f, T.masukRek[0], T.masukRek[1], 0, 1, io), keBelanja = R(f, T.keBelanja[0], T.keBelanja[1], 0, 1, io);
  const alurA = 1 - lepasA;
  // KELUAR (Simon 14 Okt: "transisinya gunakan seperti … scene 2 ke 3"): TANPA masker — isi kedua kartu memudar (30f) sementara kartu Rekening bank
  // & Reksa dana pasar uang bergeser, membesar & MENYATU (60f inOut cubic) menjadi badan kartu 01 Dana darurat Scene 06 (pita & rona biru muncul).
  const M0 = RS06_MASUK.mulai, mg = R(f, M0, M0 + durMasker, 0, 1, io), isiK = 1 - R(f, M0, M0 + 30, 0, 1, io);
  const KT = keLokal(S06_KARTU1_AWAL, SKALA.S05, SKALA.S06);
  return (
    <>
    {mg > 0.0001 ? [xBank, xRdpu].map((sx, k) => {
      const x = lerp(sx, KT.x, mg), y = lerp(Y, KT.y, mg), w = lerp(440 * sk, KT.w, mg), hh = lerp(330 * sk, KT.h, mg);
      return (
        <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: w, height: hh, transform: `translate3d(${x - w / 2}px, ${y - hh / 2}px, 0) rotate(0.001deg)`, borderRadius: 32,
          overflow: 'hidden', background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`, boxShadow: bayanganKaca(k ? B.turq : B.blue, k ? 1 - mg : 1) }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(B.blue, 0.16 * 0.6 * mg)} 0%, ${rgba(B.blue, 0.04 * 0.6 * mg)} 70%)` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: B.blue, opacity: mg }} />
        </div>);
    }) : null}
    <AbsoluteFill style={isiK < 1 ? { opacity: Math.max(0.0001, isiK) } : undefined}>
      {/* kartu rekening muncul di belakang cakram yang masuk ke dalamnya */}
      {/* ═════════ A: alur dompet → rekening → tarik tunai (ATM) → belanja ═════════ */}
      {alurA > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, alurA) }}>
          <Rute x0={hubX + A.hubD / 2 - 6} y0={Y} x1={kartuKiri + 6} y1={Y} g={R(f, T.bank + 10, T.bank + 50, 0, 1, io)} warna={B.blue} />
          <Rute x0={kartuKanan - 6} y0={Y} x1={atmXY[0] - A.kw / 2 + 6} y1={atmXY[1]} g={R(f, T.atm - 10, T.atm + 40, 0, 1, io)} warna={B.blue} />
          <Rute x0={atmXY[0]} y0={atmXY[1] + A.kh / 2 - 6} x1={belXY[0]} y1={belXY[1] - A.kh / 2 + 6} g={R(f, T.belanja - 20, T.belanja + 20, 0, 1, io)} warna={B.blue} />
          <KartuRute x={atmXY[0]} y={atmXY[1]} w={A.kw} h={A.kh} p={popIn(f, T.atm)} warna={B.blue} judul="Tarik tunai" ket={rpPenuh(TARIK)} foto="atmTarik"
            centang={popIn(f, T.tarik[1])} />
          <KartuRute x={belXY[0]} y={belXY[1]} w={A.kw} h={A.kh} p={popIn(f, T.belanja)} warna={B.blue} judul="Belanja harian" ket="Langsung dipakai" foto="belanjaTas"
            centang={popIn(f, T.centangBelanja)} />
        </div>) : null}

      {/* ═════════ kartu Rekening bank (foto celengan menumpang di sudut kartu, ref-06) ═════════ */}
      <KartuNilai x={xBank} y={yBank} s={sk} p={popIn(f, T.bank) * (1 + T.denyutBank.reduce((a, t) => a + denyut(f, t, 0.03), 0) + denyut(f, T.denyutStabil, 0.03) + denyut(f, T.denyutRdpu + 40, 0.03) + denyut(f, T.denyutCair + 50, 0.03))}
        nilai={saldo} awal={saldo} ikon="aplikasiBank" nama="Rekening bank" warna={B.blue} label="Saldo" desimal />
      {/* lencana ATM di sudut KANAN-BAWAH kartu (ukur 14 Okt: di kiri-atas menutupi ikon kepala kartu) */}
      <Lencana x={xBank + 200 * sk - 43} y={yBank + 150 * sk + 43} d={120} p={popIn(f, T.atmB + 20) * (1 + denyut(f, T.denyutCair, 0.16))} warna={B.blue} ikon="atm" besar={84} />
      {hub}
      {/* uang berjalan di garis alur A: masuk rekening · ditarik ke ATM · dipakai belanja */}
      {masukRek > 0.001 && masukRek < 0.999 ? <Uang x={lerp(hubX + A.hubD / 2, kartuKiri, masukRek)} y={Y} w={104} alfa={R(masukRek, 0, 0.15, 0, 1) * R(masukRek, 0.8, 1, 1, 0)} /> : null}
      {tarik > 0.001 && tarik < 0.999 ? (() => {
        const [ux, uy] = titikRute(kartuKanan, Y, atmXY[0] - A.kw / 2, atmXY[1], tarik);
        return <Uang x={ux} y={uy} w={104} alfa={R(tarik, 0, 0.15, 0, 1) * R(tarik, 0.8, 1, 1, 0)} />;
      })() : null}
      {keBelanja > 0.001 && keBelanja < 0.999 ? <Uang x={atmXY[0]} y={lerp(atmXY[1] + A.kh / 2, belXY[1] - A.kh / 2, keBelanja)} w={104}
        alfa={R(keBelanja, 0, 0.15, 0, 1) * R(keBelanja, 0.8, 1, 1, 0)} /> : null}

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
    </>);
};
