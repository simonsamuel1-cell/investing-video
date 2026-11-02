import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, io, lerp, rgba } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { Bulat, Chip, Kutipan, Label, Lencana, WARNA_UANG, denyut, geser } from '../parts/umum';

/**
 * SCENE 18 — IDE VISUAL (13 Okt). Bab "Produk adalah Langkah Terakhir". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  GAJI / BONUS / THR ↓ Untuk apa? ↓ Kapan dipakai? ↓ Pilih tempat uangnya
 *   TEXT    "Tentukan tugasnya dulu" / "[baru] pilih produknya"
 * Tiga ketukan (20,5 dtk) — gema Scene 01 (gaji · bonus · THR masuk), alur kartu kiri → kanan:
 *   A  "Jadi nanti kalau gaji, bonus, atau THR masuk, jangan langsung bertanya: 'Saya harus beli apa?'"
 *        isi Scene 17 keluar · chip Gaji · Bonus · THR di katanya (ikon Scene 01) · kutipan "Saya harus beli apa?" → dicoret MERAH
 *   B  "Coba mulai dari dua pertanyaan: 'Uang ini untuk apa?' dan 'Kapan uang ini akan dipakai?'"
 *        kutipan keluar · judul TEXT · kartu "Untuk apa?" · kartu "Kapan dipakai?" (kalender acuan Simon) · panah berurutan
 *   C  "Dua jawaban itu akan membantu kita menentukan tempat yang lebih sesuai untuk uang tersebut."
 *        kartu "Tempat uangnya" (tiga dompet) · uang mengalir melewati dua pertanyaan · centang di "sesuai" · sub-judul TEXT (sorot "baru")
 */

const [gaji, bonus, thr, masuk, jangan, bertanya, saya, apa, coba, pertanyaan, untuk, apa2, kapan, dipakai, dua, jawaban, itu, membantu, menentukan, tempat, sesuai,
  untuk2, uang2, tersebut] = urut([
  'gaji', 'bonus', 'thr', 'masuk', 'jangan', 'bertanya', 'saya', 'apa', 'coba', 'pertanyaan', 'untuk', 'apa', 'kapan', 'dipakai', 'dua', 'jawaban', 'itu',
  'membantu', 'menentukan', 'tempat', 'sesuai', 'untuk', 'uang', 'tersebut'], BATAS.s18);

const T = {
  chip: [gaji, bonus, thr], denyutMasuk: masuk, kutipan: jangan + 20, denyutKutipan: [bertanya, saya], coret: apa + 20, kutipanKeluar: coba, denyutChip2: pertanyaan,
  judul: coba + 10, kartu: [untuk - 20, kapan - 10, tempat - 10], panah: [untuk - 40, apa2 + 30, dipakai], denyutJawab: [dua, jawaban], denyutKapan: dipakai - 10,
  alir: [itu + 10, membantu, menentukan + 30], centang: sesuai + 10, denyutAkhir: tersebut, denyutDompet: [untuk2, uang2], sub: menentukan, subSorot: tempat,
};

/* ── tata letak: empat kolom (330 · 750 · 1170 · 1590) ── */
const X = [330, 750, 1170, 1590];
const Y = 560;
const KARTU = { w: 300, h: 320 };
const CHIP_Y = [470, 560, 650];
const PEMASUKAN: { teks: string; ikon: KunciIkon }[] = [{ teks: 'Gaji', ikon: 'gaji' }, { teks: 'Bonus', ikon: 'bonus' }, { teks: 'THR', ikon: 'thr' }];

/** KELUAR Scene 18 = milik Scene 19 ("Kalau mau dibuat sederhana, …", bab baru): seluruh isi naik-pudar 40f mulai di batas, judul keluar */
export const S18_KELUAR = BATAS.s19 + 20;
export const Scene18: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s18 || f >= S18_KELUAR + 60) return null;
  const kelS = R(f, S18_KELUAR - 20, S18_KELUAR + 20, 0, 1, io);
  const coret = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  const kelK = cin(f, T.kutipanKeluar);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kelS, transform: geser(0, -30 * kelS) }}>
      {/* panah antarkolom */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {[0, 1, 2].map((i) => {
          const g = R(f, T.panah[i] - 20, T.panah[i] + 30, 0, 1, io);
          if (g <= 0.001) return null;
          const x0 = X[i] + (i === 0 ? 150 : KARTU.w / 2) + 8, x1 = X[i + 1] - KARTU.w / 2 - 8;
          return <line key={i} x1={x0} y1={Y} x2={lerp(x0, x1, g)} y2={Y} stroke={B.grayLite} strokeWidth={6} strokeLinecap="round" />;
        })}
      </svg>
      {[0, 1, 2].map((i) => {
        const p = popIn(f, T.panah[i] + 20);
        if (p <= 0.001) return null;
        const x = (X[i] + (i === 0 ? 150 : KARTU.w / 2) + X[i + 1] - KARTU.w / 2) / 2;
        return <div key={i} style={{ position: 'absolute', left: x - 24, top: Y - 24, width: 48, height: 48, borderRadius: '50%', background: B.night, display: 'grid', placeItems: 'center',
          transform: `scale(${p})`, color: B.white, fontFamily: F, fontSize: 30, fontWeight: 800, lineHeight: 1 }}>›</div>;
      })}

      {/* uang mengalir: pemasukan → untuk apa → kapan → tempat */}
      {[0, 1, 2].map((i) => {
        const g = R(f, T.alir[i] - 30, T.alir[i] + 30, 0, 1, io);
        if (g <= 0.001 || g >= 0.999) return null;
        const W = 80, H = W / (520 / 441);
        const x = lerp(X[i], X[i + 1], g), y = Y - KARTU.h / 2 - 30 - Math.sin(Math.PI * g) * 90;
        return <Img key={i} src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2) }} />;
      })}

      {/* kolom 0: gaji · bonus · THR masuk */}
      {PEMASUKAN.map((c, i) => (
        <Chip key={c.teks} x={X[0] - 125} y={CHIP_Y[i]} jangkar="kiri" teks={c.teks} ikon={c.ikon} warna={WARNA_UANG[i]} lebar={250} size={30}
          p={popIn(f, T.chip[i]) * (1 + denyut(f, T.denyutMasuk + 10 * i, 0.06) + denyut(f, T.alir[0] - 20, 0.04) + denyut(f, T.denyutChip2 + 10 * i, 0.06))} />))}

      {/* kartu: Untuk apa? · Kapan dipakai? · Tempat uangnya */}
      {[0, 1, 2].map((i) => {
        const p = popIn(f, T.kartu[i]) * (1 + (i < 2 ? denyut(f, T.denyutJawab[i], 0.05) : denyut(f, T.denyutAkhir, 0.04)) + (i === 1 ? denyut(f, T.denyutKapan, 0.05) : 0));
        if (p <= 0.001) return null;
        const x = X[i + 1];
        const col = i === 0 ? B.blue : i === 1 ? B.turq : B.orange;
        return (
          <div key={i} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, Y)} scale(${p})` }}>
            <div style={{ position: 'absolute', left: -KARTU.w / 2, top: -KARTU.h / 2, width: KARTU.w, height: KARTU.h, borderRadius: 28, background: B.white,
              boxShadow: `0 24px 48px -22px ${rgba(B.night, 0.3)}, 0 2px 8px ${rgba(B.night, 0.05)}`, border: `3px solid ${rgba(col, 0.25)}` }} />
          </div>);
      })}
      {[0, 1].map((i) => {
        const p = popIn(f, T.kartu[i]);
        if (p <= 0.001) return null;
        return (
          <React.Fragment key={`q${i}`}>
            <Bulat x={X[i + 1]} y={Y - 45} d={130} warna={i === 0 ? B.blue : B.turq} ikon={i === 0 ? 'pertanyaan' : 'kalender'} p={p} />
            <Label x={X[i + 1]} y={Y + 85} teks={i === 0 ? 'Untuk apa?' : 'Kapan dipakai?'} f={f} at={T.kartu[i] + 10} size={32} lebar={280} />
          </React.Fragment>);
      })}
      {(() => {
        const p = popIn(f, T.kartu[2]);
        if (p <= 0.001) return null;
        return (
          <>
            {[0, 1, 2].map((k) => <Bulat key={k} x={X[3] - 80 + 80 * k} y={Y - 45} d={72} warna={WARNA_UANG[k]} ikon="dompet"
              p={popIn(f, T.kartu[2] + 10 * k) * (1 + denyut(f, T.denyutDompet[0] + 8 * k, 0.12) + denyut(f, T.denyutDompet[1] + 8 * k, 0.12))} />)}
            <Label x={X[3]} y={Y + 85} teks="Tempat uangnya" f={f} at={T.kartu[2] + 10} size={32} lebar={280} />
            <Lencana x={X[3] + KARTU.w * 0.2} y={Y - KARTU.h * 0.2} d={KARTU.w} p={popIn(f, T.centang)} warna={B.turq} ikon="tersedia" />
          </>);
      })()}

      {/* A: "Saya harus beli apa?" — dicoret (jangan langsung bertanya) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelK, transform: geser(0, -40 * kelK) }}>
        <Kutipan x={1170} y={560} teks="Saya harus beli apa?" p={popIn(f, T.kutipan) * (1 + denyut(f, T.denyutKutipan[0], 0.05) + denyut(f, T.denyutKutipan[1], 0.05))} warna={B.gray} coret={coret} alfa={1 - 0.35 * coret} ikon="jual" />
      </div>

      </AbsoluteFill>
      <Judul f={f} kata={['Tentukan', 'tugasnya', 'dulu']} at={T.judul} keluar={S18_KELUAR} />
      <Judul f={f} kata={['baru', 'pilih', 'produknya']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S18_KELUAR} />
    </AbsoluteFill>);
};

export const S18_T = T;
