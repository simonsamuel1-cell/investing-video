import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';

/** IDE VISUAL Scene 08 — frame 0 = awal Scene 08 (global BATAS.s8). Komposisi utama memakai sumber yang sama. */
export const S08_AWAL = BATAS.s8;
export const S08_LEN = BATAS.akhir - S08_AWAL; // sampai akhir VO
export const IdeS08: React.FC = () => (
  <>
    <Sequence from={-S08_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S08'))} />
  </>);
