import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S06_AWAL } from './s06/Scene06';

/** IDE VISUAL Scene 06 (Obligasi) — frame 0 = global BATAS.s6 (suara S5 habis f10715, "Berikutnya" f10735). */
export const S06_AWAL = IDE_S06_AWAL;
export const S06_LEN = BATAS.s7 - S06_AWAL;
export const IdeS06: React.FC = () => (
  <>
    <Sequence from={-S06_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S06'))} />
  </>);
