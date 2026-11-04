import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S07_AWAL } from './s07/Scene07';

/** IDE VISUAL Scene 07 (Reksa Dana) — frame 0 = global BATAS.s7. */
export const S07_AWAL = IDE_S07_AWAL;
export const S07_LEN = BATAS.s8 - S07_AWAL;
export const IdeS07: React.FC = () => (
  <>
    <Sequence from={-S07_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S07'))} />
  </>);
