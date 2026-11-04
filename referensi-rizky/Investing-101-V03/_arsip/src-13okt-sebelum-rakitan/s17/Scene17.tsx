import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, WARNA, io, lerp, rgba } from '../theme';
import { cin, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { Bulat, Chip, Label, Lencana, WARNA_UANG, denyut, geser } from '../parts/umum';

/**
 * SCENE 17 — IDE VISUAL (13 Okt). Bab "Urutan Lebih Penting daripada Persentase". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  INCOME ↓ UANG AKTIF + DANA DARURAT ↓ UANG STABIL ↓ UANG JANGKA PANJANG
 *   TEXT    "Pisahkan dulu" / "[baru] investasi"
 * Empat ketukan (23,9 dtk) — alur kartu kiri → kanan (pola acuan kartu berpanah Simon):
 *   A  "Tapi ada satu hal yang lebih penting daripada persentasenya: urutannya."
 *        isi Scene 16 keluar · chip "Persentase" (meredup, dicoret) → nomor urut 1 · 2 · 3 muncul di "urutannya"
 *   B  "Pastikan kebutuhan sehari-hari dan dana darurat aman dulu."
 *        kartu Pemasukan → kartu ① Uang aktif + dana darurat · uang mengalir · centang di "aman dulu" · judul TEXT
 *   C  "Setelah itu, cek apakah dalam satu sampai tiga tahun ke depan ada kebutuhan dana yang sudah jelas."
 *        panah ke kartu ② Uang stabil · chip "1–3 tahun" · uang mengalir · centang di "jelas"
 *   D  "Baru setelah itu, uang yang benar-benar nggak akan dipakai dalam waktu dekat bisa masuk ke investasi jangka panjang."
 *        sub-judul TEXT (sorot "baru") · panah ke kartu ③ Uang jangka panjang · uang mengalir di "masuk" · centang di "jangka panjang"
 */

const [lebih, daripada, persentasenya, urutannya, pastikan, sehari, dana, aman, setelah, cek, dalam, satu, tiga, depan, kebutuhan, sudah, jelas, baru, uang, benar,
  nggak, waktu, dekat, masuk, jangka] = urut([
  'lebih', 'daripada', 'persentasenya', 'urutannya', 'pastikan', 'sehari-hari', 'dana', 'aman', 'setelah', 'cek', 'dalam', 'satu', 'tiga', 'depan', 'kebutuhan',
  'sudah', 'jelas', 'baru', 'uang', 'benar-benar', 'nggak', 'waktu', 'dekat', 'masuk', 'jangka'], BATAS.s17);

const T = {
  persen: lebih, denyutPersen: daripada, coretPersen: persentasenya + 20, nomor: [urutannya - 10, urutannya + 6, urutannya + 22],
  kartu: [pastikan - 20, sehari, setelah + 10, uang], ikonDD: dana, centang: [aman + 10, jelas + 10, jangka + 10],
  // uang mengalir ke kartu 2 di "KEBUTUHAN dana", gembok kartu 3 di "NGGAK akan dipakai", denyut di "tiga" & "waktu dekat"
  alir: [sehari + 30, kebutuhan, masuk], denyutTahun: [tiga, depan], kunci3: nggak, denyutK3: [waktu, dekat + 20], denyutK2: [cek + 10, dalam, sudah], panah: [pastikan, setelah, baru], tahun: satu, judul: pastikan + 20, sub: baru, subSorot: benar,
};

/* ── tata letak: empat kartu y 560 (x 330 · 750 · 1170 · 1590), berpusat ±960 ── */
const KARTU = { x: [330, 750, 1170, 1590], y: 570, w: 300, h: 330 };
const ISI: { label: string; warna: string; ikon: KunciIkon }[] = [
  { label: 'Pemasukan', warna: WARNA.langit, ikon: 'gaji' },
  { label: 'Uang aktif + dana darurat', warna: WARNA_UANG[0], ikon: 'dompet' },
  { label: 'Uang stabil', warna: WARNA_UANG[1], ikon: 'dompet' },
  { label: 'Uang jangka panjang', warna: WARNA_UANG[2], ikon: 'dompet' },
];

/** KELUAR Scene 17 = milik Scene 18 ("Jadi nanti …", bab baru): seluruh isi naik-pudar 40f mulai di batas, judul keluar */
export const S17_KELUAR = BATAS.s18 + 20;
export const Scene17: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s17 || f >= S17_KELUAR + 60) return null;
  const kelS = R(f, S17_KELUAR - 20, S17_KELUAR + 20, 0, 1, io);
  const coretP = R(f, T.coretPersen - 30, T.coretPersen + 30, 0, 1, io);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kelS, transform: geser(0, -30 * kelS) }}>
      {/* A: "Persentase" kalah penting dari URUTAN */}
      <Chip x={960} y={420} teks="Persentase (%)" warna={B.gray} p={popIn(f, T.persen) * popOut(f, T.nomor[2] + 20) * (1 + denyut(f, T.denyutPersen, 0.06))} coret={coretP} size={34} />

      {/* panah antarkartu (bulatan chevron) */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {[0, 1, 2].map((i) => {
          const g = R(f, T.panah[i] - 20, T.panah[i] + 30, 0, 1, io);
          if (g <= 0.001) return null;
          const x0 = KARTU.x[i] + KARTU.w / 2 + 6, x1 = KARTU.x[i + 1] - KARTU.w / 2 - 6;
          return <line key={i} x1={x0} y1={KARTU.y} x2={lerp(x0, x1, g)} y2={KARTU.y} stroke={ISI[i + 1].warna} strokeWidth={6} strokeLinecap="round" />;
        })}
      </svg>
      {[0, 1, 2].map((i) => {
        const p = popIn(f, T.panah[i] + 20);
        if (p <= 0.001) return null;
        const x = (KARTU.x[i] + KARTU.x[i + 1]) / 2;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 26, top: KARTU.y - 26, width: 52, height: 52, borderRadius: '50%', background: ISI[i + 1].warna, display: 'grid',
            placeItems: 'center', transform: `scale(${p})`, color: B.white, fontFamily: F, fontSize: 30, fontWeight: 800, lineHeight: 1, boxShadow: `0 8px 18px -6px ${ISI[i + 1].warna}aa` }}>›</div>);
      })}

      {/* uang mengalir dari kartu ke kartu (sesuai urutan) */}
      {[0, 1, 2].map((i) => {
        const g = R(f, T.alir[i] - 35, T.alir[i] + 35, 0, 1, io);
        if (g <= 0.001 || g >= 0.999) return null;
        const W = 84, H = W / (520 / 441);
        const x = lerp(KARTU.x[i], KARTU.x[i + 1], g), y = KARTU.y - 30 - Math.sin(Math.PI * g) * 140;
        return <Img key={i} src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2) }} />;
      })}

      {/* kartu */}
      {ISI.map((k, i) => {
        const p = popIn(f, T.kartu[i]) * (1 + (i > 0 ? denyut(f, T.alir[i - 1] + 40, 0.04) : 0) + (i === 3 ? T.denyutK3.reduce((s, t) => s + denyut(f, t, 0.05), 0) : 0)
          + (i === 2 ? T.denyutK2.reduce((s, t) => s + denyut(f, t, 0.05), 0) : 0));
        if (p <= 0.001) return null;
        const x = KARTU.x[i];
        const c = i > 0 ? popIn(f, T.centang[i - 1]) : 0;
        return (
          <div key={k.label} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, KARTU.y)} scale(${p})` }}>
            <div style={{ position: 'absolute', left: -KARTU.w / 2, top: -KARTU.h / 2, width: KARTU.w, height: KARTU.h, borderRadius: 28, background: B.white,
              boxShadow: `0 24px 48px -22px ${rgba(B.night, 0.3)}, 0 2px 8px ${rgba(B.night, 0.05)}`, border: `3px solid ${rgba(k.warna, 0.15 + 0.85 * c)}` }} />
          </div>);
      })}
      {ISI.map((k, i) => {
        const p = popIn(f, T.kartu[i]);
        if (p <= 0.001) return null;
        const x = KARTU.x[i], y = KARTU.y - 40;
        return (
          <React.Fragment key={`i${i}`}>
            {i === 1 ? <>
              <Bulat x={x - 52} y={y} d={110} warna={k.warna} ikon="dompet" p={p} />
              <Bulat x={x + 52} y={y} d={110} warna={B.orange} ikon="danaDarurat" p={popIn(f, T.ikonDD)} />
            </> : <Bulat x={x} y={y} d={130} warna={k.warna} ikon={k.ikon} p={p} />}
            <Label x={x} y={KARTU.y + 85} teks={k.label} f={f} at={T.kartu[i] + 10} size={28} lebar={260} />
            {i === 2 ? <Chip x={x} y={KARTU.y + 148} teks="1–3 tahun" ikon="kalender" warna={WARNA_UANG[1]} p={popIn(f, T.tahun) * (1 + denyut(f, T.denyutTahun[0], 0.1) + denyut(f, T.denyutTahun[1], 0.1))} size={22} /> : null}
            {i === 3 ? <Lencana x={x} y={y} d={130} p={popIn(f, T.kunci3)} warna={B.night} ikon="kunci" besar={52} /> : null}
          </React.Fragment>);
      })}
      {/* nomor urut (lahir di "urutannya": di posisi kartu nanti) + centang */}
      {[0, 1, 2].map((i) => {
        const p = popIn(f, T.nomor[i]);
        if (p <= 0.001) return null;
        const adaKartu = cin(f, T.kartu[i + 1]);
        const x = KARTU.x[i + 1] - KARTU.w / 2 + 6, y = KARTU.y - KARTU.h / 2 + 6;
        const xx = lerp(KARTU.x[i + 1], x, adaKartu), yy = lerp(420 + 130, y, adaKartu), d = lerp(96, 64, adaKartu);
        return (
          <React.Fragment key={`n${i}`}>
            <div style={{ position: 'absolute', left: xx - d / 2, top: yy - d / 2, width: d, height: d, borderRadius: '50%', background: WARNA_UANG[i], border: `4px solid ${B.white}`,
              display: 'grid', placeItems: 'center', transform: `scale(${p})`, color: B.white, fontFamily: F, fontSize: d * 0.5, fontWeight: 800, lineHeight: 1,
              boxShadow: `0 10px 24px -8px ${WARNA_UANG[i]}cc` }}>{i + 1}</div>
            <Lencana x={KARTU.x[i + 1] + KARTU.w * 0.2} y={KARTU.y - KARTU.h * 0.2} d={KARTU.w} p={popIn(f, T.centang[i])} warna={B.turq} ikon="tersedia" />
          </React.Fragment>);
      })}

      </AbsoluteFill>
      <Judul f={f} kata={['Pisahkan', 'dulu']} at={T.judul} keluar={S17_KELUAR} />
      <Judul f={f} kata={['baru', 'investasi']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S17_KELUAR} />
    </AbsoluteFill>);
};

export const S17_T = T;
