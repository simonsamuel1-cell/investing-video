import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Babak } from './Babak';
import { VO_UTUH } from './vo';
import { OUTRO_AT, OUTRO_N } from './outro/plan.gen';

/** OUTRO "Di video selanjutnya" (naskah revisi 21 Okt) untuk review — frame 0 = OUTRO_AT − 120 (2 dtk akhir Scene 08 + transisi + outro).
 *  VO = berkas gabungan yang sama, dipotong di awal komposisi (satu <Audio> dari frame 0). */
const AWAL = OUTRO_AT - 120;
export const IDE_OUTRO_LEN = 120 + OUTRO_N;
export const IdeOutro: React.FC = () => (
  <>
    <Sequence from={-AWAL} layout="none"><Babak vo={false} /></Sequence>
    <Audio src={staticFile(VO_UTUH)} trimBefore={AWAL} />
  </>);
