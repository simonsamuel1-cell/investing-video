import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, CORET, R, io } from '../theme';
import { cin, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import { Bulat, Chip, Kutipan, Label, denyut, geser, panah } from '../parts/umum';

/**
 * SCENE 15 — IDE VISUAL (13 Okt). Bab "Cocokkan Uang dengan Waktunya". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  INVESTASI YANG SAMA ↓ A: Dipakai 3 bulan lagi vs. B: Tidak dipakai 5 tahun ↓ SITUASI BERBEDA
 *   TEXT    "Investasinya sama" / "[waktu] penggunaan uangnya berbeda"
 * Tiga ketukan (26 dtk):
 *   A  "Makanya, kadang masalahnya bukan: 'Saya salah pilih investasi.' Tapi justru: 'Saya menggunakan uang yang salah.'"
 *        isi Scene 14 keluar · kutipan 1 (ikon saham) → dicoret merah & meredup di "tapi justru" · kutipan 2 (ikon dompet) menyala
 *   B  "Orang pertama berinvestasi dengan uang yang akan dipakai tiga bulan lagi. Orang kedua memakai uang yang nggak akan disentuh selama lima tahun."
 *        kutipan keluar · INVESTASI YANG SAMA di tengah atas · orang pertama (kiri) + "Dipakai 3 bulan lagi" · orang kedua (kanan) + "Tidak dipakai 5 tahun"
 *        · judul + sub-judul TEXT
 *   C  "Ketika pasar turun, situasi keduanya jelas sangat berbeda."
 *        investasi berubah jadi pasar turun (−30 %) · orang pertama: "Terpaksa jual" (merah) · orang kedua: "Bisa menunggu pulih" (turkis)
 */

const [masalahnya, bukan, salah, investasi, tapi, saya2, menggunakan, salah2, orang, pertama, berinvestasi, uang, dipakai, tiga, lagi, orang2, kedua, memakai,
  uang2, disentuh, selama, lima, ketika, pasar, turun, situasi, sangat, berbeda] = urut([
  'masalahnya', 'bukan', 'salah', 'investasi', 'tapi', 'saya', 'menggunakan', 'salah', 'orang', 'pertama', 'berinvestasi', 'uang', 'dipakai', 'tiga', 'lagi',
  'orang', 'kedua', 'memakai', 'uang', 'disentuh', 'selama', 'lima', 'ketika', 'pasar', 'turun', 'situasi', 'sangat', 'berbeda'], BATAS.s15);

const T = {
  // "kadang MASALAHNYA bukan:" gelembung mengetik (titik berjalan) → kutipan 1 · garis bawah di "SALAH pilih INVESTASI" · coret di "tapi"
  ketik: masalahnya - 20, kutipan1: bukan + 20, garis1: salah + 20, denyutK1: investasi + 30, coret: tapi + 20,
  kutipan2: saya2, garis2: menggunakan + 20, sorot2: salah2, kutipanKeluar: orang - 10,
  investasi: berinvestasi - 20, orangA: orang + 10, labelA: pertama, panahA: berinvestasi + 20, uangA: uang + 10, chipA: dipakai, denyutChipA: [tiga, lagi],
  orangB: orang2 + 10, labelB: kedua, panahB: memakai, uangB: uang2 + 10, chipB: disentuh, denyutChipB: lima, judul: orang + 20, sub: selama, subSorot: lima,
  denyutInv: ketika, turun: [pasar - 10, turun + 20], hasil: [situasi, situasi + 30], denyutHasil: [sangat, berbeda],
};

/* ── tata letak ── */
// label SELALU di bawah ikon (aturan Simon 9 Okt): investasi di atas, labelnya di bawah, panah berangkat di bawah label
const INV = { x: 960, y: 330, d: 150 };
const ORANG = { y: 670, d: 160, x: [480, 1440] };

/** KELUAR Scene 15 = milik Scene 16 ("Lalu, …", bab baru): seluruh isi naik-pudar 40f mulai di batas, judul keluar */
export const S15_KELUAR = BATAS.s16 + 20;
export const Scene15: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s15 || f >= S15_KELUAR + 60) return null;
  const kelS = R(f, S15_KELUAR - 20, S15_KELUAR + 20, 0, 1, io);
  const coret = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  const kel = cin(f, T.kutipanKeluar);
  const jatuh = cin(f, T.turun[0] + 20);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kelS, transform: geser(0, -30 * kelS) }}>
      {/* A: gelembung mengetik → dua kutipan (+ garis bawah kata yang diucapkan) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kel, transform: geser(0, -40 * kel) }}>
        {(() => {
          const p = popIn(f, T.ketik) * popOut(f, T.kutipan1 - 6);
          if (p <= 0.001) return null;
          return (
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(960, 410)} translate(-50%, -50%) scale(${p})`, display: 'flex', gap: 14, background: B.white,
              borderRadius: 28, padding: '30px 40px', boxShadow: '0 18px 40px -18px rgba(22,24,27,0.3)' }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: B.grayLite,
                transform: `translateY(${-8 * Math.max(0, Math.sin(((f - T.ketik) / 18 - i * 0.6) * Math.PI))}px)` }} />)}
            </div>);
        })()}
        {[[T.garis1, 410, 560, B.blue], [T.garis2, 620, 640, B.orange]].map(([at, y, w, col], i) => {
          const g = R(f, (at as number) - 30, (at as number) + 30, 0, 1, io);
          if (g <= 0.001) return null;
          return <div key={i} style={{ position: 'absolute', left: 960 - (w as number) / 2, top: (y as number) + 56, width: (w as number) * g, height: 6, borderRadius: 3,
            background: col as string, opacity: i === 0 ? 1 - coret : 1 }} />;
        })}
        <Kutipan x={960} y={410} teks="Saya salah pilih investasi." p={popIn(f, T.kutipan1) * (1 + denyut(f, T.denyutK1, 0.05))} warna={B.blue} coret={coret} alfa={1 - 0.45 * coret} ikon="saham" />
        <Kutipan x={960} y={620} teks="Saya menggunakan uang yang salah." p={popIn(f, T.kutipan2) * (1 + denyut(f, T.sorot2, 0.05))} warna={B.orange} sorot={cin(f, T.sorot2)} ikon="dompet" />
      </div>

      {/* B–C: investasi yang sama → dua orang */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {panah(INV.x - 90, INV.y + 150, ORANG.x[0] + 80, ORANG.y - 60, R(f, T.panahA - 30, T.panahA + 30, 0, 1, io), B.blue, 'a')}
        {panah(INV.x + 90, INV.y + 150, ORANG.x[1] - 80, ORANG.y - 60, R(f, T.panahB - 30, T.panahB + 30, 0, 1, io), B.orange, 'b')}
      </svg>
      {[0, 1].map((i) => {
        const g = R(f, (i === 0 ? T.uangA : T.uangB) - 30, (i === 0 ? T.uangA : T.uangB) + 30, 0, 1, io);
        if (g <= 0.001 || g >= 0.999) return null;
        const W = 84, H = W / (520 / 441);
        const x = ORANG.x[i] + (INV.x - ORANG.x[i]) * g, y = ORANG.y + (INV.y - ORANG.y) * g - Math.sin(Math.PI * g) * 60;
        return <Img key={i} src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2) }} />;
      })}
      <Bulat x={INV.x} y={INV.y} d={INV.d} warna={jatuh > 0.5 ? ARAH.turun : B.blue} ikon={jatuh > 0.5 ? 'pasarJatuh' : 'saham'}
        p={popIn(f, T.investasi) * (1 + denyut(f, T.turun[0] + 20, 0.1) + denyut(f, T.uangA + 30, 0.05) + denyut(f, T.uangB + 30, 0.05) + denyut(f, T.denyutInv, 0.07))} />
      <Label x={INV.x} y={INV.y + INV.d / 2 + 36} teks="Investasi yang sama" f={f} at={T.investasi + 10} size={32} />
      <PilNominal x={INV.x + INV.d / 2 + 24} y={INV.y} jangkar="kiri" teks="−30%" arah={-1} p={popIn(f, T.turun[1])} size={26} />

      {[0, 1].map((i) => {
        const x = ORANG.x[i];
        const col = i === 0 ? B.blue : B.orange;
        const p = popIn(f, i === 0 ? T.orangA : T.orangB) * (1 + denyut(f, T.denyutHasil[0] + 14 * i, 0.06));
        return (
          <React.Fragment key={i}>
            <Bulat x={x} y={ORANG.y} d={ORANG.d} warna={col} ikon={i === 0 ? 'orangA' : 'orangB'} p={p} />
            <Label x={x} y={ORANG.y + ORANG.d / 2 + 36} teks={i === 0 ? 'Orang pertama' : 'Orang kedua'} f={f} at={i === 0 ? T.labelA : T.labelB} size={34} />
            <Chip x={x} y={ORANG.y + ORANG.d / 2 + 98} teks={i === 0 ? 'Dipakai 3 bulan lagi' : 'Tidak dipakai 5 tahun'} ikon={i === 0 ? 'kalender' : 'kunci'} warna={col}
              p={popIn(f, i === 0 ? T.chipA : T.chipB) * (1 + (i === 0 ? denyut(f, T.denyutChipA[0], 0.06) + denyut(f, T.denyutChipA[1], 0.06) : denyut(f, T.denyutChipB, 0.06)))} size={28} />
            {/* C: hasil berbeda */}
            <Chip x={x} y={ORANG.y + ORANG.d / 2 + 170} teks={i === 0 ? 'Terpaksa jual' : 'Bisa menunggu pulih'} ikon={i === 0 ? 'jual' : 'waktu'}
              warna={i === 0 ? CORET : B.turq} p={popIn(f, T.hasil[i]) * (1 + denyut(f, T.denyutHasil[0] + 14 * i, 0.06) + denyut(f, T.denyutHasil[1] + 14 * i, 0.06))} size={28} />
          </React.Fragment>);
      })}

      </AbsoluteFill>
      <Judul f={f} kata={['Investasinya', 'sama']} at={T.judul} keluar={S15_KELUAR} />
      <Judul f={f} kata={['waktu', 'penggunaan', 'uangnya', 'berbeda']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S15_KELUAR} />
    </AbsoluteFill>);
};

export const S15_T = T;
