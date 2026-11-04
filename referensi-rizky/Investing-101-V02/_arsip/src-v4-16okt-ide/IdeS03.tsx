import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BATAS } from './batas';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { IDE_S03_AWAL } from './s03/Scene03';

/** IDE VISUAL Scene 03 (Emas) — frame 0 = global 4690 (suara Scene 02 habis f4684, "Sekarang" mulai f4692). */
export const S03_AWAL = IDE_S03_AWAL;
export const S03_LEN = BATAS.s4 - S03_AWAL; // berakhir sebelum suara Scene 04 ("Lalu" mulai f6803)
export const IdeS03: React.FC = () => (
  <>
    <Sequence from={-S03_AWAL} layout="none"><Babak vo={false} /></Sequence>
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) — loop Studio tidak membocorkan suara scene lain */}
    <Audio src={staticFile(VO_IDE('S03'))} />
  </>);
