import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { SOROT_GAYA } from './sorotKata';
import { JUDUL_KATA } from './judulKata.gen';

loadFont('normal', { weights: ['800'], subsets: ['latin'] });

/** ALAT UKUR (bukan isi video): tiap kata judul dirender PERSIS seperti di judul, kotak span-nya hijau murni, supaya scripts/gen-sorot.py
 *  bisa mengukur tinta tiap kata terhadap kotak span-nya. 44 kata per frame (4 kolom × 11 baris); frame ke-n = halaman ke-n. */
export const UKUR = { x: 60, y: 30, baris: 92, kolom: 465, per: 44, kol: 4 };
export const UKUR_HALAMAN = Math.ceil(JUDUL_KATA.length / UKUR.per);
export const UkurSorot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#FFFFFF' }}>
      {JUDUL_KATA.slice(f * UKUR.per, (f + 1) * UKUR.per).map((w, j) => (
        <div key={w} style={{ position: 'absolute', left: UKUR.x + (j % UKUR.kol) * UKUR.kolom, top: UKUR.y + Math.floor(j / UKUR.kol) * UKUR.baris }}>
          <span style={{ ...SOROT_GAYA, display: 'inline-block', whiteSpace: 'pre', background: '#00FF00', color: '#000000' }}>{w}</span>
        </div>))}
    </AbsoluteFill>);
};
