import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S02_AWAL } from './s02/Scene02';

/** IDE VISUAL Scene 02 — frame 0 = awal Scene 02 (global 2829, sesudah suara Scene 1 habis — arahan Simon). Komposisi utama tidak disentuh. */
export const S02_AWAL = IDE_S02_AWAL;
export const S02_LEN = BATAS.s3 - S02_AWAL; // berakhir sebelum suara Scene 03 (src/batas.ts)
export const IdeS02: React.FC = () => (
  <>
    <Sequence from={-S02_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S02'))} />
  </>);
