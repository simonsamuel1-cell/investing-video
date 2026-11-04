import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S10_AWAL } from './s10/Scene10';

/** IDE VISUAL Scene 10 (Volatilitas ≠ Risiko) — frame 0 = global BATAS.s10. */
export const S10_AWAL = IDE_S10_AWAL;
export const S10_LEN = BATAS.s11 - S10_AWAL;
export const IdeS10: React.FC = () => (
  <>
    <Sequence from={-S10_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S10'))} />
  </>);
