import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S13_AWAL } from './s13/Scene13';

/** IDE VISUAL Scene 13 (Penutup) — frame 0 = global BATAS.s13. */
export const S13_AWAL = IDE_S13_AWAL;
export const S13_LEN = BATAS.akhir - S13_AWAL;
export const IdeS13: React.FC = () => (
  <>
    <Sequence from={-S13_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S13'))} />
  </>);
