import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S11_AWAL } from './s11/Scene11';

/** IDE VISUAL Scene 11 (Saat harga turun) — frame 0 = global BATAS.s11. */
export const S11_AWAL = IDE_S11_AWAL;
export const S11_LEN = BATAS.s12 - S11_AWAL;
export const IdeS11: React.FC = () => (
  <>
    <Sequence from={-S11_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S11'))} />
  </>);
