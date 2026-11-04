import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S08_AWAL } from './s08/Scene08';

/** IDE VISUAL Scene 08 (Saham) — frame 0 = global BATAS.s8. */
export const S08_AWAL = IDE_S08_AWAL;
export const S08_LEN = BATAS.s9 - S08_AWAL;
export const IdeS08: React.FC = () => (
  <>
    <Sequence from={-S08_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S08'))} />
  </>);
