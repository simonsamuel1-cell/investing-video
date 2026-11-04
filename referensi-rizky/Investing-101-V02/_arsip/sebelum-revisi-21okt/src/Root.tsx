import React from 'react';
import { Composition } from 'remotion';
import { Episode } from './Episode';
import { TOTAL } from './cues';
import { UkurSorot } from './UkurSorot';
import { IDE, ideKomponen } from './Ide';

/** Investing 101 · Video 02 Investment Instruments — 1920×1080, 60 fps, panjang = VO (scripts/gen-cues.py) */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="InvestmentInstruments" component={Episode} durationInFrames={TOTAL} fps={60} width={1920} height={1080} />
    {/* komposisi per scene (nomor naskah REVISI 16 Okt) — src/Ide.tsx */}
    {IDE.map((d) => <Composition key={d.id} id={`Ide-${d.id}`} component={ideKomponen(d.id, d.awal)} durationInFrames={d.akhir - d.awal} fps={60} width={1920} height={1080} />)}
    {/* alat ukur kotak sorot judul (scripts/gen-sorot.py) — bukan isi video */}
    <Composition id="Ukur-Sorot" component={UkurSorot} durationInFrames={1} fps={60} width={1920} height={1600} />
  </>
);
