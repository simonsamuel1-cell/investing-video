import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { SOROT_GAYA, SOROT_KATA } from './sorotKata';

loadFont('normal', { weights: ['800'], subsets: ['latin'] });

/** ALAT UKUR (bukan isi video): tiap kata sorot dirender PERSIS seperti di judul, kotak isinya hijau murni,
 *  supaya scripts/gen-sorot.py bisa mengukur tinta tiap kata terhadap kotak barisnya. */
export const UKUR = { x: 100, y: 30, baris: 84, kolom: 900 }; // dua kolom × 12 baris (84: baris ke-12 masih di dalam 1080)
export const UkurSorot: React.FC = () => (
  <AbsoluteFill style={{ background: '#FFFFFF' }}>
    {SOROT_KATA.map((w, k) => (
      <div key={w} style={{ position: 'absolute', left: UKUR.x + (k % 2) * UKUR.kolom, top: UKUR.y + Math.floor(k / 2) * UKUR.baris }}>
        <span style={{ ...SOROT_GAYA, display: 'inline-block', whiteSpace: 'pre', background: '#00FF00', color: '#000000' }}>{w}</span>
      </div>))}
  </AbsoluteFill>);
