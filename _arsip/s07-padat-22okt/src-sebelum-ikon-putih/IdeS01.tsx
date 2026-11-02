import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 01 — frame 0 = awal video. Komposisi utama memakai sumber yang sama (Babak, waktu global). */
export const S01_AWAL = 0;
export const S01_LEN = BATAS.s2 - S01_AWAL; // berakhir sebelum suara Scene 02
export const IdeS01: React.FC = () => (
  <>
    <Sequence from={-S01_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S01'))} />
  </>);
