import React from 'react';
import { Composition } from 'remotion';
import { Episode, EpisodeGuide } from './Episode';
import { TOTAL } from './cues';
import { OUTRO_N } from './introOutro';
import { UKUR_HALAMAN, UkurSorot } from './UkurSorot';

/** Value Investing · Video 01 Apa Itu Value Investing? — 1920×1080, 60 fps, panjang = intro 240 f + VO + ekor 30 f (TOTAL, scripts/gen-cues.py) + outro 240 f */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ApaItuValueInvesting" component={Episode} durationInFrames={TOTAL + OUTRO_N} fps={60} width={1920} height={1080} />
    {/* garis bantu alignment — Babak yang sama + lapisan Guide, tanpa VO */}
    <Composition id="ApaItuValueInvesting-Guide" component={EpisodeGuide} durationInFrames={TOTAL + OUTRO_N} fps={60} width={1920} height={1080} />
    {/* alat ukur kotak sorot judul (scripts/gen-sorot.py) — bukan isi video */}
    <Composition id="Ukur-Sorot" component={UkurSorot} durationInFrames={Math.max(1, UKUR_HALAMAN)} fps={60} width={1920} height={1080} />
  </>
);
