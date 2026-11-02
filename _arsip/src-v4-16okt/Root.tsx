import React from 'react';
import { Composition } from 'remotion';
import { Episode } from './Episode';
import { TOTAL } from './cues';
import { IdeS01, S01_LEN } from './IdeS01';
import { IdeS02, S02_LEN } from './IdeS02';
import { IdeS03, S03_LEN } from './IdeS03';
import { IdeS04, S04_LEN } from './IdeS04';
import { IdeS05, S05_LEN } from './IdeS05';
import { IdeS06, S06_LEN } from './IdeS06';
import { IdeS07, S07_LEN } from './IdeS07';
import { IdeS08, S08_LEN } from './IdeS08';
import { IdeS09, S09_LEN } from './IdeS09';
import { IdeS10, S10_LEN } from './IdeS10';
import { IdeS11, S11_LEN } from './IdeS11';
import { IdeS12, S12_LEN } from './IdeS12';
import { IdeS13, S13_LEN } from './IdeS13';
import { UkurSorot } from './UkurSorot';
import { Revisi16Okt, REVISI_LEN } from './Revisi16Okt';

/** Investing 101 · Video 02 Investment Instruments — 1920×1080, 60 fps, panjang = VO (scripts/gen-cues.py) */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="InvestmentInstruments" component={Episode} durationInFrames={TOTAL} fps={60} width={1920} height={1080} />
    {/* naskah REVISI 16 Okt (10 scene) — VO v5 gabungan + subtitle v5; visual lama dipetakan (src/Revisi16Okt.tsx) */}
    <Composition id="Revisi-16Okt" component={Revisi16Okt} durationInFrames={REVISI_LEN} fps={60} width={1920} height={1080} />
    {/* ide visual Scene 01 — styleframe, terpisah dari komposisi utama */}
    <Composition id="Ide-S01" component={IdeS01} durationInFrames={S01_LEN} fps={60} width={1920} height={1080} />
    {/* ide visual Scene 02 — frame 0 = video 00:47.09 (global 2829) */}
    <Composition id="Ide-S02" component={IdeS02} durationInFrames={S02_LEN} fps={60} width={1920} height={1080} />
    {/* ide visual Scene 03 (Emas) — frame 0 = global 4690 */}
    <Composition id="Ide-S03" component={IdeS03} durationInFrames={S03_LEN} fps={60} width={1920} height={1080} />
    {/* ide visual Scene 04 (Kenapa harga emas naik) — frame 0 = global 6800 */}
    <Composition id="Ide-S04" component={IdeS04} durationInFrames={S04_LEN} fps={60} width={1920} height={1080} />
    {/* ide visual Scene 05 (Properti) */}
    <Composition id="Ide-S05" component={IdeS05} durationInFrames={S05_LEN} fps={60} width={1920} height={1080} />
    {/* ide visual Scene 06 (Obligasi) */}
    <Composition id="Ide-S06" component={IdeS06} durationInFrames={S06_LEN} fps={60} width={1920} height={1080} />
    {/* ide visual Scene 07 (Reksa Dana) & 08 (Saham) */}
    <Composition id="Ide-S07" component={IdeS07} durationInFrames={S07_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S08" component={IdeS08} durationInFrames={S08_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S09" component={IdeS09} durationInFrames={S09_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S10" component={IdeS10} durationInFrames={S10_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S11" component={IdeS11} durationInFrames={S11_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S12" component={IdeS12} durationInFrames={S12_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S13" component={IdeS13} durationInFrames={S13_LEN} fps={60} width={1920} height={1080} />
    {/* alat ukur kotak sorot judul (scripts/gen-sorot.py) — bukan isi video */}
    <Composition id="Ukur-Sorot" component={UkurSorot} durationInFrames={1} fps={60} width={1920} height={1080} />
  </>
);
