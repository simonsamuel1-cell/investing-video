import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S04_AWAL } from './s04/Scene04';

/** IDE VISUAL Scene 04 (Kenapa harga emas naik) — frame 0 = global 6800 (suara S3 habis f6784, "Lalu" mulai f6803). */
export const S04_AWAL = IDE_S04_AWAL;
export const S04_LEN = BATAS.s5 - S04_AWAL; // berakhir sebelum suara Scene 05 ("Selanjutnya" ≈f9089)
export const IdeS04: React.FC = () => (
  <>
    <Sequence from={-S04_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S04'))} />
  </>);
