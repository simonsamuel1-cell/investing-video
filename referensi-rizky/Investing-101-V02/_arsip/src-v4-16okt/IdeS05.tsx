import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S05_AWAL } from './s05/Scene05';

/** IDE VISUAL Scene 05 (Properti) — frame 0 = global BATAS.s5 (suara S4 habis f8282, "Selanjutnya" f8300). */
export const S05_AWAL = IDE_S05_AWAL;
export const S05_LEN = BATAS.s6 - S05_AWAL;
export const IdeS05: React.FC = () => (
  <>
    <Sequence from={-S05_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Audio src={staticFile(VO_IDE('S05'))} />
  </>);
