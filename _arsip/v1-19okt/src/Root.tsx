import React from 'react';
import { Composition } from 'remotion';
import { Episode } from './Episode';
import { TOTAL } from './cues';
import { UjiLatar, UJI_LATAR } from './UjiLatar';
import { IdeS01, S01_LEN } from './IdeS01';
import { IdeS02, S02_LEN } from './IdeS02';
import { IdeS03, S03_LEN } from './IdeS03';
import { IdeS04, S04_LEN } from './IdeS04';
import { IdeS05, S05_LEN } from './IdeS05';
import { IdeS06, S06_LEN } from './IdeS06';
import { IdeS07, S07_LEN } from './IdeS07';
import { IdeS08, S08_LEN } from './IdeS08';
import { UKUR_HALAMAN, UkurSorot } from './UkurSorot';

/** Investing 101 · Video 05 Jalur Bertumbuh Seorang Investor — 1920×1080, 60 fps, panjang = VO (scripts/gen-cues.py) */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="JalurInvestor" component={Episode} durationInFrames={TOTAL} fps={60} width={1920} height={1080} />
    {/* ide visual per scene — komposisi terpisah memotong Babak yang sama (pola Video 02/03) */}
    <Composition id="Ide-S01" component={IdeS01} durationInFrames={S01_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S02" component={IdeS02} durationInFrames={S02_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S03" component={IdeS03} durationInFrames={S03_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S04" component={IdeS04} durationInFrames={S04_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S05" component={IdeS05} durationInFrames={S05_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S06" component={IdeS06} durationInFrames={S06_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S07" component={IdeS07} durationInFrames={S07_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S08" component={IdeS08} durationInFrames={S08_LEN} fps={60} width={1920} height={1080} />
    {/* UJI LATAR (19 Okt): tiga rona latar + kisi dengan judul, kartu kaca, subtitle contoh — cek keterbacaan, bukan isi video */}
    <Composition id="Uji-Latar" component={UjiLatar} durationInFrames={UJI_LATAR} fps={60} width={1920} height={1080} />
    {/* alat ukur kotak sorot judul (scripts/gen-sorot.py) — bukan isi video */}
    <Composition id="Ukur-Sorot" component={UkurSorot} durationInFrames={Math.max(1, UKUR_HALAMAN)} fps={60} width={1920} height={1080} />
  </>
);
