import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_OFFSET } from './offset';
import { VO_IDE } from './vo';

/**
 * KOMPOSISI PER SCENE (Ide-S01 … Ide-S10) — nomor = NASKAH REVISI 16 Okt. Isi = Babak (semua scene, waktu global) dipotong
 * [awal, akhir) supaya sambungan antar-scene ikut terlihat dan tetap sinkron dengan VO & subtitle. VO dipotong tepat di batas
 * scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain.
 * Ide-S01 berakhir 00:47.00 (arahan Simon) · Ide-S02 mulai 00:00.49 (arahan Simon) — lihat src/batas.ts.
 */
export const IDE: { id: string; awal: number; akhir: number }[] = [
  { id: 'S01', awal: 0, akhir: BATAS.s1Akhir },
  { id: 'S02', awal: BATAS.s2, akhir: BATAS.s3 },
  { id: 'S03', awal: BATAS.s3, akhir: BATAS.s5 }, // Emas
  { id: 'S04', awal: BATAS.s5, akhir: BATAS.s6 }, // Properti
  { id: 'S05', awal: BATAS.s6, akhir: BATAS.s7 }, // Obligasi
  { id: 'S06', awal: BATAS.s7, akhir: BATAS.s8 }, // Reksa Dana
  { id: 'S07', awal: BATAS.s8, akhir: BATAS.s9 }, // Saham
  { id: 'S08', awal: BATAS.s9, akhir: BATAS.s12 }, // Bisnis vs harga saham
  { id: 'S09', awal: BATAS.s12, akhir: BATAS.s13 }, // Rangkuman
  { id: 'S10', awal: BATAS.s13, akhir: BATAS.akhir }, // Penutup
];

export const ideKomponen = (id: string, awal: number): React.FC => {
  const C: React.FC = () => (
    <>
      <Sequence from={-awal} layout="none"><Babak vo={false} /></Sequence>
      {awal === 0
        ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_IDE(id))} /></Sequence>
        : <Audio src={staticFile(VO_IDE(id))} />}
    </>);
  C.displayName = `Ide${id}`;
  return C;
};
