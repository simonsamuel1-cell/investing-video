import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { VO_OFFSET } from './offset';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { BATAS } from './batas';

/**
 * IDE VISUAL Scene 01 — komposisi terpisah (Simon 13 Okt: "divideo 2 kamu membuatnya perscene, jadi di episode ini kamu generate perscene
 * dulu juga"). Komposisi utama TigaJenisUang belum disentuh. Memakai Babak (waktu global) seperti Video 02.
 */
export const S01_LEN = BATAS.s1Akhir;
export const IdeS01: React.FC = () => (
  <>
    <Babak vo={false} />
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_IDE('S01'))} /></Sequence>
  </>);
