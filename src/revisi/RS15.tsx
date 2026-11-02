import React from 'react';
import { S16_MASUK } from '../s16/Scene16';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, CORET, F, R, io, lerp, mixHex, rgba } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import { Bulat, Lencana, denyut } from '../parts/umum';
import { Kaca, KARYAWAN, KarakterLingkar, ORANG_MUDA, geser, MaskerKeluar, durMasker, type Masuk, daratDari, CakramDarat } from '../parts/kaca';
import { Foto, Kalender, KartuNilai, POSE, Sosok, Tagihan, TepiSubtitle, Uang } from '../parts/nyata';
import { GrafikLilin, laju, relatif, rentang } from '../parts/lilin';
import { S15_TURUN } from '../data/pasar';

/**
 * REVISI SCENE 15 (14 Okt, evaluasi 5 pertanyaan — versi lama: gelembung kutipan kecil di kanvas kosong, isi panel chip teks).
 * Pesan: masalahnya sering bukan produknya, tapi UANG yang dipakai; investasi sama + waktu pakai beda → nasib beda saat pasar turun.
 *   A  "bukan 'saya salah pilih investasi' tapi 'saya menggunakan uang yang salah'"  murid berpikir · kartu saham merah (yang disalahkan) →
 *      sorot pindah ke ASAL uangnya: uang yang dijepit tagihan KOS bulan depan (uang yang salah), bingkai merah
 *   B  "orang pertama … tiga bulan lagi · orang kedua … lima tahun"  dua panel (ref-22) + kartu SAHAM YANG SAMA di kolom tengah:
 *      kiri murid + tagihan kos 1 Jan 2027 (3 bulan lagi) · kanan karyawan + rumah, kalender 2031 (5 tahun lagi)
 *   C  "ketika pasar turun, situasinya sangat berbeda"  saham −30 % · kiri: tagihan jatuh tempo → JUAL → kurang Rp900.000 · kanan: masih 5 tahun ✓
 */

const [makanya, masalahnya, salah, investasi, tapi, menggunakan, salah2, orang, pertama, uang, tiga, lagi, kedua, disentuh, lima, ketika, pasar, turun,
  situasi, sangat, berbeda] = urut([
  'makanya', 'masalahnya', 'salah', 'investasi', 'tapi', 'menggunakan', 'salah', 'orang', 'pertama', 'uang', 'tiga', 'lagi', 'kedua', 'disentuh', 'lima', 'ketika',
  'pasar', 'turun', 'situasi', 'sangat', 'berbeda'], BATAS.s15);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS15_MASUK: Masuk = { x: 757, y: 545, r: 130, warna: B.white, mulai: BATAS.s15 - 20 };
const DARAT = daratDari(RS15_MASUK);

const T = {
  orangA: Math.max(makanya, DARAT + 20), saham: masalahnya, denyutSalah: [salah, investasi], uangKos: tapi - 10, alir: [tapi + 10, menggunakan + 10], sorotUang: salah2 - 10,
  keluarA: orang - 20, panel: [orang + 10, kedua - 10], tengah: orang + 30, isi1: [pertama + 10, uang, tiga + 10], isi2: [kedua + 10, disentuh - 97, lima + 10], denyutDisentuh: disentuh,
  denyut1: lagi, judul: orang + 20, sub: disentuh, subSorot: lima,
  turun: [pasar, turun + 30], hasil1: [situasi - 20, situasi + 20, sangat + 10], hasil2: [sangat - 10, berbeda], denyutKetika: ketika,
};

const PL = 520, PR = 1400, PW = 600, PY = 544; // pusat frame (ukur 14 Okt: dulu PY 600 → +56 px)
/** Simon 14 Okt — "ketika pasar turun" = candlestick realistis: IHSG harian asli 3 Feb – 19 Mar 2020 (tenang 14 hari, lalu −31 %) */
const TURUN = relatif(S15_TURUN);
const DOM_T = rentang(TURUN, 0.08);
const TENANG = 14; // candle tenang (3–20 Feb) tampil saat kolom muncul; sisanya jatuh saat "pasar turun"
const KOL = { w: 220, h: 380, gw: 176, gh: 92 };
const PERSEN = `−${Math.round((1 - TURUN[TURUN.length - 1].c) * 100)}%`;

export const RS15: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (S16_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s15 || f >= S16_MASUK.mulai + durMasker) return null;
  const kelA = cin(f, T.keluarA);
  const alir = R(f, T.alir[0], T.alir[1], 0, 1, io);
  const sorot = cin(f, T.sorotUang);
  // B: panel pertama sendirian di tengah → bergeser kiri saat panel kedua muncul (geser bertahap)
  const p2 = cin(f, T.panel[1] - 24); // memimpin pop panel kedua (verifikasi 14 Okt: +192 px sesaat)
  const xL = lerp(960, PL, p2);
  // panel tumbuh saat baris hasil (C) muncul — tidak ada sepertiga panel kosong selama B (geser bertahap, tetap berpusat)
  const PH = lerp(450, 630, cin(f, T.hasil1[0] - 30));
  const atas = PY - PH / 2;
  return (
    <MaskerKeluar f={f} mulai={S16_MASUK.mulai} ke={S16_MASUK} warna={S16_MASUK.warna}>
    <AbsoluteFill>
      <CakramDarat f={f} ke={RS15_MASUK} />
      {/* ═════════ A: bukan salah pilih investasi — uangnya yang salah ═════════ */}
      {kelA < 0.999 ? (
        // A ke pusat frame (ukur 14 Okt: dulu +86 px ke bawah, −57 / +44 px mendatar): naik 80, geser mendatar mengikuti susunan (geser bertahap)
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - kelA) }}>
          <TepiSubtitle>
            {/* Simon 14 Okt "gunakan gambar orang yang sama": sosok kemeja biru muda (Scene 01/02), dicermin supaya menghadap kartu di kanan */}
            <Sosok pose={POSE.muridPikirBiru} flip x={lerp(700, 420, cin(f, T.saham)) + lerp(57, -44, cin(f, T.uangKos))} kaki={870} h={650} p={cin(f, T.orangA)} />
          </TepiSubtitle>
          <div style={{ position: 'absolute', inset: 0, transform: geser(lerp(57, -44, cin(f, T.uangKos)), -80) }}>
          <KartuNilai x={lerp(1250, 980, cin(f, T.uangKos))} y={560} s={1.05} p={popIn(f, T.saham) * (1 + [...T.denyutSalah, T.saham + 73, T.saham + 115].reduce((a, t) => a + denyut(f, t, 0.05), 0))} nilai={2_100_000}
            awal={3_000_000} ikon="saham" nama="Saham" warna={ARAH.turun} label="Nilai investasi" />
          {/* asal uangnya: uang sewa kos bulan depan (dijepit tagihannya) */}
          {(() => {
            const p = popIn(f, T.uangKos);
            if (p <= 0.001) return null;
            const x = 1530, y = 560;
            return (
              <>
                <Tagihan x={x} y={y - 60} judul="Bayar kos" ikon="kos" warna={B.blue} tempo="1 Jan 2027" total="Rp3.000.000" w={320} p={p * 0.95 * (1 + denyut(f, T.sorotUang + 20, 0.05) + denyut(f, T.alir[1] - 10, 0.04) + denyut(f, T.alir[1] + 36, 0.04))} />
                {/* bingkai merah: INILAH uang yang salah */}
                {sorot > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: 360, height: 270, borderRadius: 30, border: `5px solid ${CORET}`,
                  transform: geser(x - 180, y - 195), opacity: Math.min(0.9999, sorot), boxShadow: `0 0 0 ${10 * sorot}px ${rgba(CORET, 0.1)}` }} /> : null}
                {/* uang: dari tagihan kos → masuk ke saham */}
                {alir < 0.999 ? <Uang x={lerp(x, 1100, alir)} y={lerp(y + 110, 620, alir) - Math.sin(Math.PI * alir) * 90} w={lerp(170, 110, alir)} p={p} alfa={R(alir, 0.85, 1, 1, 0)} /> : null}
              </>);
          })()}
          </div>
        </div>) : null}

      {/* ═════════ B–C: dua orang, saham yang sama, waktu pakai beda ═════════ */}
      {kelA > 0.001 ? (
        <>
          {/* panel orang pertama */}
          <Kaca x={xL} y={PY} w={PW} h={PH} p={popIn(f, T.panel[0])} warna={B.blue} tab="atas" rona={0.6} />
          <KarakterLingkar pose={ORANG_MUDA} x={xL - PW / 2 + 120} y={atas + 120} D={150} s={popIn(f, T.isi1[0]) * (1 + denyut(f, T.isi1[0] + 40, 0.06) + denyut(f, T.isi1[0] + 80, 0.06))} warna={B.blue} />
          <Teks x={xL - PW / 2 + 220} y={atas + 120} teks="Orang pertama" p={cin(f, T.isi1[0] + 10, 30)} />
          {/* audit 14 Okt: chip "3 bulan" dulu 7 px dari tepi kanan kartu → tagihan + chip ditata ulang: tepi kiri & kanan 44 px, jarak 26 px */}
          <Tagihan x={xL - 112} y={atas + 330} judul="Bayar kos" ikon="kos" warna={B.blue} tempo="1 Jan 2027" total="Rp3.000.000" w={320} p={popIn(f, T.isi1[1]) * 0.9 * (1 + denyut(f, T.isi1[1] + 50, 0.04))}
            sorotTempo={Math.sin(Math.PI * R(f, T.hasil1[0] - 20, T.hasil1[0] + 20, 0, 1, io))} />
          <Chip x={xL + 157} y={atas + 330} teks="3 bulan" warna={B.blue} p={popIn(f, T.isi1[2]) * (1 + denyut(f, T.denyut1, 0.06))} />
          {/* C: tagihan jatuh tempo → JUAL di harga turun → kurang */}
          {(() => {
            const p = popIn(f, T.hasil1[1]);
            if (p <= 0.001) return null;
            return (
              <div style={{ position: 'absolute', left: 0, top: 0, width: 200, height: 70, transformOrigin: 'center', transform: `${geser(xL - 265, atas + 530)} scale(${p})`, borderRadius: 20,
                background: ARAH.turun, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.white, letterSpacing: '.08em',
                boxShadow: `0 14px 26px -12px ${ARAH.turun}` }}>JUAL</div>);
          })()}
          <PilNominal x={xL + 125} y={atas + 565} teks="Kurang Rp900.000" arah={-1} p={popIn(f, T.hasil1[2])} size={30} />

          {/* panel orang kedua */}
          {p2 > 0.001 ? (
            <>
              <Kaca x={PR} y={PY} w={PW} h={PH} p={popIn(f, T.panel[1])} warna={B.orange} tab="atas" rona={0.6} />
              <KarakterLingkar pose={KARYAWAN} x={PR - PW / 2 + 120} y={atas + 120} D={150} s={popIn(f, T.isi2[0]) * (1 + denyut(f, T.isi2[0] + 35, 0.06))} warna={B.orange} />
              <Teks x={PR - PW / 2 + 220} y={atas + 120} teks="Orang kedua" p={cin(f, T.isi2[0] + 10, 30)} />
              <Foto k="rumah" x={PR - 113} y={atas + 330} w={300} p={popIn(f, T.isi2[1]) * (1 + denyut(f, T.isi2[1] + 57, 0.04) + denyut(f, T.isi2[1] + 130, 0.04) + denyut(f, T.denyutDisentuh, 0.04))} />
              <Chip x={PR + 163} y={atas + 330} teks="5 tahun" warna={B.orange} p={popIn(f, T.isi2[2])} />
              {/* C: masih lama — tidak perlu menjual, bisa menunggu pulih */}
              <Kalender x={PR - 120} y={atas + 540} s={0.62} p={popIn(f, T.hasil2[0])} warna={B.orange} halaman={[{ atas: 'Okt', angka: '2031' }]} i={0} />
              <Lencana x={PR - 120} y={atas + 540} d={150} p={popIn(f, T.hasil2[1])} warna={ARAH.naik} ikon="tersedia" besar={62} />
              <Foto k="tumbuh" x={PR + 140} y={atas + 545} w={150} p={popIn(f, T.hasil2[1] + 10)} />
            </>) : null}

          {/* kolom tengah: SAHAM YANG SAMA — mini candlestick: tenang, lalu jatuh saat pasar turun */}
          {(() => {
            const p = popIn(f, T.tengah) * p2;
            if (p <= 0.001) return null;
            const merah = cin(f, T.turun[0] + 30, 40);
            const warna = mixHex(B.blue, ARAH.turun, merah);
            const n = TURUN.length, gT = (TENANG - 1 + 2.5) / (n - 1 + 2.5);
            const g = gT * laju(f, T.tengah, T.tengah + 90) + (1 - gT) * laju(f, T.turun[0], T.turun[1]);
            const atas = PY - KOL.h / 2;
            return (
              <>
                <Kaca x={960} y={PY} w={KOL.w} h={KOL.h} p={p} warna={warna} tab="atas" />
                <Bulat x={960} y={atas + 80} d={90} warna={warna} ikon="saham" p={p} />
                <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(960, atas + 168)} translate(-50%, -50%) scale(${p})`, fontFamily: F, fontSize: 26, fontWeight: 800,
                  color: B.night, textAlign: 'center', lineHeight: 1.1, whiteSpace: 'nowrap' }}>Saham<br />yang sama</div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: KOL.gw, height: KOL.gh, transformOrigin: `${KOL.gw / 2}px ${KOL.gh / 2}px`,
                  transform: `${geser(960 - KOL.gw / 2, atas + 220)} scale(${p})` }}>
                  <GrafikLilin d={TURUN} w={KOL.gw} h={KOL.gh} g={g} dom={DOM_T} grid={false} />
                </div>
                <PilNominal x={960} y={atas + 342} teks={PERSEN} arah={-1} p={popIn(f, T.turun[1] - 10)} size={28} />
              </>);
          })()}
        </>) : null}

      <Judul f={f} kata={['Investasinya', 'sama']} at={T.judul} />
      <Judul f={f} kata={['waktu', 'penggunaan', 'uangnya', 'berbeda']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};

const Teks: React.FC<{ x: number; y: number; teks: string; p: number }> = ({ x, y, teks, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(0, -50%)`, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap',
    opacity: Math.min(0.9999, p) }}>{teks}</div>);

/** chip kalender + lama waktu (ikon kalender, bukan kalimat) */
const Chip: React.FC<{ x: number; y: number; teks: string; warna: string; p: number }> = ({ x, y, teks, warna, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
    borderRadius: 999, background: rgba(warna, 0.14), fontFamily: F, fontSize: 30, fontWeight: 800, color: warna, whiteSpace: 'nowrap' }}>
    <Icon name="kalender" size={32} color={warna} />{teks}
  </div>);
