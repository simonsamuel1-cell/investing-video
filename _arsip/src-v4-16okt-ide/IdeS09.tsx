import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S09_AWAL } from './s09/Scene09';

/** IDE VISUAL Scene 09 (Aset produktif) — frame 0 = global BATAS.s9. */
export const S09_AWAL = IDE_S09_AWAL;
export const S09_LEN = BATAS.s10 - S09_AWAL;
export const IdeS09: React.FC = () => (
  <>
    <Sequence from={-S09_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S09'))} />
  </>);
