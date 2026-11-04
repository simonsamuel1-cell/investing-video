import React from 'react';
import { Composition } from 'remotion';
import { Episode, EpisodeGuide } from './Episode';
import { TOTAL } from './cues';
import { UjiLatar, UJI_LATAR } from './UjiLatar';
import { UKUR_HALAMAN, UkurSorot } from './UkurSorot';
import { OUTRO_N } from './outro/plan.gen';
import { IdeS01Flat, S01F_LEN } from './IdeS01Flat';
import { IdeS02Flat, S02F_LEN } from './IdeS02Flat';
import { IdeS03Flat, S03F_LEN } from './IdeS03Flat';
import { IdeS04Flat, S04F_LEN } from './IdeS04Flat';
import { IdeS05, S05_LEN } from './IdeS05';
import { IdeS06Flat, S06F_LEN } from './IdeS06Flat';
import { IdeS07, S07_LEN } from './IdeS07';
import { IdeS08, S08_LEN } from './IdeS08';
import { IdeS09, S09_LEN } from './IdeS09';
import { IdeS10, S10_LEN } from './IdeS10';
import { IdeS11, S11_LEN } from './IdeS11';
import { IdeS12, S12_LEN } from './IdeS12';
import { UjiRig, UJI_RIG } from './flat/UjiRig';
import { UjiRigGua, UJI_RIG_GUA } from './flat/UjiRigGua';
import { CONTOH_KF, ContohKeyframe } from './flat/ContohKeyframe';
import { UjiRigTegak, UJI_RIG_TEGAK } from './flat/UjiRigTegak';
import { UjiKelompokTegak, UJI_KELOMPOK } from './flat/UjiKelompokTegak';
import { UjiPanggul } from './flat/UjiPanggul';
import { UjiMainHp } from './flat/UjiMainHp';
import { BandingSinga, LembarSinga, UjiSinga, UJI_SINGA } from './flat/UjiSinga';
import { GUIDE_CHAR, LembarGuideChar } from './flat/GuideChar';
import { UjiCharacterRig, UJI_CR } from './uji/UjiCharacterRig';

/** Investing 101 · Video 06 Kesalahan yang Paling Sering Dilakukan Investor — 1920×1080, 60 fps, panjang = VO (scripts/gen-cues.py) */
export const RemotionRoot: React.FC = () => (
  <>
    {/* isi (TOTAL, termasuk ekor 30f) + outro "Di video selanjutnya" (OUTRO_N frame, VO outro terpisah 23 Okt 15:39) */}
    <Composition id="KesalahanInvestor" component={Episode} durationInFrames={TOTAL + OUTRO_N} fps={60} width={1920} height={1080} />
    {/* garis bantu alignment (Simon 27 Okt sore) — Babak yang sama + lapisan Guide, tanpa VO */}
    <Composition id="KesalahanInvestor-Guide" component={EpisodeGuide} durationInFrames={TOTAL + OUTRO_N} fps={60} width={1920} height={1080} />
    {/* ide visual per scene — komposisi terpisah memotong Babak yang sama (pola Video 02/03/05) */}
    <Composition id="Ide-S01-Flat" component={IdeS01Flat} durationInFrames={S01F_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S02-Flat" component={IdeS02Flat} durationInFrames={S02F_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S03-Flat" component={IdeS03Flat} durationInFrames={S03F_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S04-Flat" component={IdeS04Flat} durationInFrames={S04F_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S05" component={IdeS05} durationInFrames={S05_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S06-Flat" component={IdeS06Flat} durationInFrames={S06F_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S07" component={IdeS07} durationInFrames={S07_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S08" component={IdeS08} durationInFrames={S08_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S09" component={IdeS09} durationInFrames={S09_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S10" component={IdeS10} durationInFrames={S10_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S11" component={IdeS11} durationInFrames={S11_LEN} fps={60} width={1920} height={1080} />
    <Composition id="Ide-S12" component={IdeS12} durationInFrames={S12_LEN} fps={60} width={1920} height={1080} />
    {/* UJI LATAR: latar + kartu kaca + subtitle contoh — cek keterbacaan, bukan isi video */}
    <Composition id="Uji-CharacterRig" component={UjiCharacterRig} durationInFrames={UJI_CR} fps={60} width={1920} height={1080} />
    <Composition id="Uji-RigGua" component={UjiRigGua} durationInFrames={UJI_RIG_GUA} fps={60} width={1920} height={1080} />
    <Composition id="Uji-RigTegak" component={UjiRigTegak} durationInFrames={UJI_RIG_TEGAK} fps={60} width={1920} height={1080} />
    <Composition id="Guide-Char" component={LembarGuideChar} durationInFrames={1} fps={60} width={GUIDE_CHAR.w} height={GUIDE_CHAR.h} />
    <Composition id="Uji-Singa" component={UjiSinga} durationInFrames={UJI_SINGA} fps={60} width={1920} height={1080} />
    <Composition id="Lembar-Singa" component={LembarSinga} defaultProps={{ V: 18.1 }} durationInFrames={1} fps={60} width={1920} height={1080} />
    <Composition id="Uji-MainHp" component={UjiMainHp} durationInFrames={1} fps={60} width={1920} height={1080} />
    <Composition id="Banding-Singa" component={BandingSinga} defaultProps={{ halaman: 0 as 0 | 1 }} durationInFrames={1} fps={60} width={1920} height={1080} />
    <Composition id="Uji-Panggul" component={UjiPanggul} durationInFrames={1} fps={60} width={1920} height={1080} />
    <Composition id="Uji-Kelompok1" component={UjiKelompokTegak} defaultProps={{ k: 0 }} durationInFrames={UJI_KELOMPOK} fps={60} width={1920} height={1080} />
    <Composition id="Uji-Kelompok2" component={UjiKelompokTegak} defaultProps={{ k: 1 }} durationInFrames={UJI_KELOMPOK} fps={60} width={1920} height={1080} />
    <Composition id="Uji-Kelompok3" component={UjiKelompokTegak} defaultProps={{ k: 2 }} durationInFrames={UJI_KELOMPOK} fps={60} width={1920} height={1080} />
    <Composition id="Contoh-Keyframe" component={ContohKeyframe} durationInFrames={1} fps={60} width={CONTOH_KF.w} height={CONTOH_KF.h} />
    <Composition id="Uji-Rig" component={UjiRig} durationInFrames={UJI_RIG} fps={60} width={1920} height={1080} />
    <Composition id="Uji-Latar" component={UjiLatar} durationInFrames={UJI_LATAR} fps={60} width={1920} height={1080} />
    {/* alat ukur kotak sorot judul (scripts/gen-sorot.py) — bukan isi video */}
    <Composition id="Ukur-Sorot" component={UkurSorot} durationInFrames={Math.max(1, UKUR_HALAMAN)} fps={60} width={1920} height={1080} />
  </>
);
