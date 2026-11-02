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
import { IdeS14, S14_LEN } from './IdeS14';
import { IdeS15, S15_LEN } from './IdeS15';
import { IdeS16, S16_LEN } from './IdeS16';
import { IdeS17, S17_LEN } from './IdeS17';
import { IdeS18, S18_LEN } from './IdeS18';
import { IdeS19, S19_LEN } from './IdeS19';
import { IdeS20, S20_LEN } from './IdeS20';
import { UkurSorot } from './UkurSorot';

/** Investing 101 · Video 03 Tiga Jenis Uang — 1920×1080, 60 fps, panjang = VO (scripts/gen-cues.py) */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TigaJenisUang" component={Episode} durationInFrames={TOTAL} fps={60} width={1920} height={1080} />
    {/* ide visual per scene — komposisi terpisah, komposisi utama belum disentuh (pola Video 02) */}
    <Composition id="Ide-S01" component={IdeS01} durationInFrames={S01_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s2 (f1121) */}
    <Composition id="Ide-S02" component={IdeS02} durationInFrames={S02_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s3 (f2386) */}
    <Composition id="Ide-S03" component={IdeS03} durationInFrames={S03_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s4 (f3356) */}
    <Composition id="Ide-S04" component={IdeS04} durationInFrames={S04_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s5 (f4523) */}
    <Composition id="Ide-S05" component={IdeS05} durationInFrames={S05_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s6 (f5881) */}
    <Composition id="Ide-S06" component={IdeS06} durationInFrames={S06_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s7 (f7528) */}
    <Composition id="Ide-S07" component={IdeS07} durationInFrames={S07_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s8 (f8828) */}
    <Composition id="Ide-S08" component={IdeS08} durationInFrames={S08_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s9 (f10189) */}
    <Composition id="Ide-S09" component={IdeS09} durationInFrames={S09_LEN} fps={60} width={1920} height={1080} />
    {/* frame 0 = global BATAS.s10 (f11663) */}
    <Composition id="Ide-S10" component={IdeS10} durationInFrames={S10_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S11" component={IdeS11} durationInFrames={S11_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S12" component={IdeS12} durationInFrames={S12_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S13" component={IdeS13} durationInFrames={S13_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S14" component={IdeS14} durationInFrames={S14_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S15" component={IdeS15} durationInFrames={S15_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S16" component={IdeS16} durationInFrames={S16_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S17" component={IdeS17} durationInFrames={S17_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S18" component={IdeS18} durationInFrames={S18_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S19" component={IdeS19} durationInFrames={S19_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S20" component={IdeS20} durationInFrames={S20_LEN} fps={60} width={1920} height={1080} />
    {/* alat ukur kotak sorot judul (scripts/gen-sorot.py) — bukan isi video */}
    <Composition id="Ukur-Sorot" component={UkurSorot} durationInFrames={1} fps={60} width={1920} height={1080} />
  </>
);
