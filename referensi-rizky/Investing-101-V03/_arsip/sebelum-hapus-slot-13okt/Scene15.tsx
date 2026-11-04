import React from 'react';
import { Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, CORET, F, R, io, rgba } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import { Bulat, Chip, Kutipan, Label, denyut } from '../parts/umum';
import { INVESTOR_JAS, Kaca, KarakterLingkar, MURID, MaskerKeluar, bayanganKaca, geser } from '../parts/kaca';
import { S16_MASUK } from '../s16/Scene16';

/**
 * SCENE 15 — Bab "Cocokkan Uang dengan Waktunya". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  INVESTASI YANG SAMA ↓ A: Dipakai 3 bulan lagi vs. B: Tidak dipakai 5 tahun ↓ SITUASI BERBEDA
 *   TEXT    "Investasinya sama" / "[waktu] penggunaan uangnya berbeda"
 * Rakitan 13 Okt — tata letak acuan Simon ref-22 (panel perbandingan kiri/kanan + kolom ikon di tengah) dalam gaya rumah (kartu kaca);
 * orang = gambar orang (brief Video 02 12 Okt "ganti icon investor, dengan gambar orang berkemeja biru"): orang pertama = murid berkemeja
 * biru (lingkaran oranye, seperti Video 02), orang kedua = investor berjas (lingkaran Neon Blue).
 *   A  "Makanya, kadang masalahnya bukan: 'Saya salah pilih investasi.' Tapi justru: 'Saya menggunakan uang yang salah.'"
 *        gelembung mengetik → kutipan 1 (garis bawah di "salah pilih investasi") → dicoret merah di "tapi" · kutipan 2 menyala
 *   B  "Orang pertama berinvestasi dengan uang yang akan dipakai tiga bulan lagi. Orang kedua memakai uang yang nggak akan disentuh selama lima tahun."
 *        INVESTASI YANG SAMA di atas · panel orang pertama (kiri) · uang terbang ke investasi · kolom ikon (kalender) · "Dipakai 3 bulan lagi" ·
 *        panel orang kedua (kanan) · "Tidak dipakai 5 tahun"
 *   C  "Ketika pasar turun, situasi keduanya jelas sangat berbeda."   pil −30 % di investasi · ikon pasar turun di kolom · "Terpaksa jual" vs "Bisa menunggu pulih"
 * KELUAR = masker lingkaran ke dompet Uang Aktif Scene 16 (brief Video 02 B: bukan pudar biasa).
 */

const [masalahnya, bukan, saya1, salah, investasi, tapi, saya2, menggunakan, salah2, orang, pertama, berinvestasi, uang, dipakai, tiga, lagi, , kedua, memakai,
  , disentuh, selama, lima, ketika, pasar, turun, situasi, sangat, berbeda] = urut([
  'masalahnya', 'bukan', 'saya', 'salah', 'investasi', 'tapi', 'saya', 'menggunakan', 'salah', 'orang', 'pertama', 'berinvestasi', 'uang', 'dipakai', 'tiga', 'lagi',
  'orang', 'kedua', 'memakai', 'uang', 'disentuh', 'selama', 'lima', 'ketika', 'pasar', 'turun', 'situasi', 'sangat', 'berbeda'], BATAS.s15);

/** MASUK Scene 15 = masker Scene 14 menyusut ke cakram putih gelembung mengetik (mendarat 40f sesudah batas, lalu gelembung tumbuh darinya) */
export const S15_MASUK = { x: 960, y: 410, r: 40, warna: B.white, mulai: BATAS.s15 - 20 };
const DARAT = S15_MASUK.mulai + 60;

const T = {
  // "kadang MASALAHNYA bukan:" gelembung mengetik (titik berjalan) → kutipan 1 · garis bawah di "SALAH pilih INVESTASI" · coret di "tapi"
  ketik: masalahnya - 20, kutipan1: bukan + 20, garis1: salah + 20, denyutK1: investasi + 30, denyutSaya: saya1 + 10, coret: tapi + 20,
  kutipan2: saya2, garis2: menggunakan + 20, sorot2: salah2, kutipanKeluar: orang - 6,
  // kutipan 2 selesai diucapkan ±14f sebelum "Orang" → panel menunggu kutipan pudar (panel A mulai 36f sesudah "orang")
  investasi: berinvestasi - 10, panel: [orang + 36, orang + 52], orang: [pertama + 40, kedua + 10], label: [pertama + 62, kedua + 32],
  kolom: dipakai - 20, ikonKolom: [dipakai, pasar - 10], uang: [uang + 10, memakai + 40], baris1: [dipakai + 10, disentuh], denyutBaris1: [[tiga, lagi], [selama, lima]],
  judul: orang + 20, sub: selama, subSorot: lima, denyutInv: ketika, turun: turun + 20, hasil: [situasi, situasi + 30], denyutHasil: [sangat, berbeda],
};

/* ── tata letak (ref-22): investasi di atas, dua panel kaca kiri/kanan, kolom ikon di tengah; baris panel sejajar ikon kolom ── */
const INV = { x: 960, y: 290, d: 130 };
const PANEL = { y: 700, w: 570, h: 460, x: [585, 1335] };
const ORANG_Y = 560;
const ORANG_D = 170;
const BARIS = [775, 875];
const KOLOM = { x: 960, w: 112, y0: 718, y1: 932 };
const POSE = [MURID, INVESTOR_JAS];
const WARNA_ORANG = [B.orange, B.blue];

/** KELUAR Scene 15 = milik Scene 16: masker lingkaran menyusut ke dompet Uang Aktif Scene 16 (S16_MASUK) */
export const S15_KELUAR = S16_MASUK.mulai;
export const Scene15: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s15 - 30 || f >= S15_KELUAR + 60) return null;
  const coret = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  const kel = cin(f, T.kutipanKeluar);
  return (
    <MaskerKeluar f={f} mulai={S15_KELUAR} ke={S16_MASUK} warna={S16_MASUK.warna}>
      {/* A: gelembung mengetik → dua kutipan (+ garis bawah kata yang diucapkan) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kel, transform: geser(0, -60 * kel) }}>
        {/* cakram putih tempat masker Scene 14 mendarat — tertutup gelembung yang tumbuh darinya */}
        {f >= DARAT && f < T.ketik + 10 ? <div style={{ position: 'absolute', left: 0, top: 0, width: 80, height: 80, borderRadius: '50%', background: B.white,
          transform: geser(960 - 40, 410 - 40), boxShadow: bayanganKaca(B.blue, R(f, DARAT, DARAT + 20, 0, 1, io)) }} /> : null}
        {(() => {
          const p = popIn(f, T.ketik) * (1 - cin(f, T.kutipan1 - 6, 30));
          if (p <= 0.001) return null;
          return (
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(960, 410)} translate(-50%, -50%) scale(${p})`, display: 'flex', gap: 14,
              background: B.white, borderRadius: 28, padding: '30px 40px', boxShadow: bayanganKaca(B.blue) }}>
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
        <Kutipan x={960} y={410} teks="Saya salah pilih investasi." p={popIn(f, T.kutipan1) * (1 + denyut(f, T.denyutK1, 0.05) + denyut(f, T.denyutSaya, 0.05))} warna={B.blue} coret={coret} alfa={1 - 0.45 * coret} ikon="saham" />
        <Kutipan x={960} y={620} teks="Saya menggunakan uang yang salah." p={popIn(f, T.kutipan2) * (1 + denyut(f, T.sorot2, 0.05))} warna={B.orange} sorot={cin(f, T.sorot2)} ikon="dompet" />
      </div>

      {/* B–C: dua panel kaca (ref-22) */}
      {[0, 1].map((i) => (
        <Kaca key={`p${i}`} x={PANEL.x[i]} y={PANEL.y} w={PANEL.w} h={PANEL.h} p={popIn(f, T.panel[i])} warna={WARNA_ORANG[i]} rona={1} radius={36} />))}
      {/* slot orang kedua (putus-putus, "?") sampai orangnya muncul — dua panel seimbang sejak awal (tengah di setiap momen) */}
      {(() => {
        // berdenyut di "Orang kedua" (kata 'orang' ±40f sebelum 'kedua')
        const p = popIn(f, T.panel[1] + 14) * (1 - R(f, T.orang[1] - 30, T.orang[1], 0, 1, io)) * (1 + denyut(f, T.orang[1] - 50, 0.1));
        if (p <= 0.001) return null;
        return <div style={{ position: 'absolute', left: 0, top: 0, width: ORANG_D, height: ORANG_D, transformOrigin: 'center', transform: `${geser(PANEL.x[1] - ORANG_D / 2, ORANG_Y - ORANG_D / 2)} scale(${p})`,
          borderRadius: '50%', border: `3px dashed ${B.grayLite}`, boxSizing: 'border-box', background: rgba(B.white, 0.6), display: 'grid', placeItems: 'center',
          fontFamily: F, fontSize: 72, fontWeight: 800, color: B.grayLite, lineHeight: 1 }}>?</div>;
      })()}
      {/* kolom ikon tengah (ref-22): kalender = kapan dipakai · pasar turun = situasinya */}
      {(() => {
        const p = popIn(f, T.kolom);
        if (p <= 0.001) return null;
        return <div style={{ position: 'absolute', left: 0, top: 0, width: KOLOM.w, height: KOLOM.y1 - KOLOM.y0, transformOrigin: 'center',
          transform: `${geser(KOLOM.x - KOLOM.w / 2, KOLOM.y0)} scale(${p})`, borderRadius: KOLOM.w / 2, background: `linear-gradient(180deg, ${rgba(B.white, 0.96)}, ${rgba(B.white, 0.86)})`,
          boxShadow: bayanganKaca(B.blue, 0.8) }} />;
      })()}
      {[0, 1].map((k) => (
        <Bulat key={`k${k}`} x={KOLOM.x} y={BARIS[k]} d={74} warna={k === 0 ? B.turq : CORET} ikon={k === 0 ? 'kalender' : 'pasarJatuh'}
          p={popIn(f, T.ikonKolom[k]) * (1 + (k === 1 ? denyut(f, T.turun, 0.08) : 0))} />))}

      {/* uang tiap orang terbang ke investasi yang sama */}
      {[0, 1].map((i) => {
        const g = R(f, T.uang[i] - 30, T.uang[i] + 30, 0, 1, io);
        if (g <= 0.001 || g >= 0.999) return null;
        const W = 84, H = W / (520 / 441);
        const x0 = PANEL.x[i], y0 = ORANG_Y - 40;
        const x = x0 + (INV.x - x0) * g, y = y0 + (INV.y - y0) * g - Math.sin(Math.PI * g) * 70;
        return <Img key={`u${i}`} src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2) }} />;
      })}
      <Bulat x={INV.x} y={INV.y} d={INV.d} warna={B.blue} ikon="saham"
        p={popIn(f, T.investasi) * (1 + denyut(f, T.turun, 0.1) + denyut(f, T.uang[0] + 30, 0.05) + denyut(f, T.uang[1] + 30, 0.05) + denyut(f, T.denyutInv, 0.07))} />
      <Label x={INV.x} y={INV.y + INV.d / 2 + 34} teks="Investasi yang sama" f={f} at={T.investasi + 10} size={30} />
      <PilNominal x={INV.x + INV.d / 2 + 22} y={INV.y} jangkar="kiri" teks="−30%" arah={-1} p={popIn(f, T.turun)} size={26} />

      {[0, 1].map((i) => {
        const x = PANEL.x[i];
        const col = WARNA_ORANG[i];
        const dHasil = denyut(f, T.denyutHasil[0] + 14 * i, 0.06) + denyut(f, T.denyutHasil[1] + 14 * i, 0.06);
        return (
          <React.Fragment key={i}>
            <KarakterLingkar pose={POSE[i]} x={x} y={ORANG_Y} D={ORANG_D} warna={col} s={popIn(f, T.orang[i]) * (1 + dHasil)} />
            <Label x={x} y={ORANG_Y + ORANG_D / 2 + 34} teks={i === 0 ? 'Orang pertama' : 'Orang kedua'} f={f} at={T.label[i]} size={32} />
            <Chip x={x} y={BARIS[0]} teks={i === 0 ? 'Dipakai 3 bulan lagi' : 'Tidak dipakai 5 tahun'} ikon={i === 0 ? 'kalender' : 'kunci'} warna={col}
              p={popIn(f, T.baris1[i]) * (1 + T.denyutBaris1[i].reduce((s, t) => s + denyut(f, t, 0.06), 0))} size={28} />
            <Chip x={x} y={BARIS[1]} teks={i === 0 ? 'Terpaksa jual' : 'Bisa menunggu pulih'} ikon={i === 0 ? 'jual' : 'waktu'}
              warna={i === 0 ? CORET : B.turq} p={popIn(f, T.hasil[i]) * (1 + dHasil)} size={28} />
          </React.Fragment>);
      })}

      <Judul f={f} kata={['Investasinya', 'sama']} at={T.judul} />
      <Judul f={f} kata={['waktu', 'penggunaan', 'uangnya', 'berbeda']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </MaskerKeluar>);
};

export const S15_T = T;
