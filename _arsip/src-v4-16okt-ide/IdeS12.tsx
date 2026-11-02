import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S12_AWAL } from './s12/Scene12';

/** IDE VISUAL Scene 12 (Rangkuman) — frame 0 = global BATAS.s12. */
export const S12_AWAL = IDE_S12_AWAL;
export const S12_LEN = BATAS.s13 - S12_AWAL;
export const IdeS12: React.FC = () => (
  <>
    <Sequence from={-S12_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S12'))} />
  </>);
