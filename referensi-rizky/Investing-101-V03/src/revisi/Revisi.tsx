import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { Subtitles } from '../Subtitles';
import { Backdrop } from '../parts/Backdrop';
import { Watermark } from '../parts/Watermark';
import { RS02 } from './RS02';
import { RS03 } from './RS03';
import { RS04 } from './RS04';
import { RS05 } from './RS05';
import { RS06 } from './RS06';
import { RS07 } from './RS07';
import { RS08 } from './RS08';
import { RS09 } from './RS09';
import { RS10 } from './RS10';
import { RS11 } from './RS11';
import { RS12 } from './RS12';
import { RS13 } from './RS13';
import { RS14 } from './RS14';
import { RS15 } from './RS15';

loadFont('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });

/**
 * PRATINJAU REVISI (13 Okt malam) — Scene 2 & 8–15 versi ide baru, waktu GLOBAL (frame = frame video), TANPA mengganti komposisi utama.
 * Simon: "kirim previewnya dulu" → komposisi ini hanya untuk still pratinjau; sesudah disetujui, scene dipindah ke Babak + serah-terima dirapikan.
 */
export const Revisi: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Backdrop f={f} />
      <RS02 f={f} />
      <RS03 f={f} />
      <RS04 f={f} />
      <RS05 f={f} />
      <RS06 f={f} />
      <RS07 f={f} />
      <RS08 f={f} />
      <RS09 f={f} />
      <RS10 f={f} />
      <RS11 f={f} />
      <RS12 f={f} />
      <RS13 f={f} />
      <RS14 f={f} />
      <RS15 f={f} />
      <AbsoluteFill style={{ zIndex: 2 }}><Watermark /><Subtitles /></AbsoluteFill>
    </AbsoluteFill>);
};
