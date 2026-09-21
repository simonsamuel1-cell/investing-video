/**
 * S25 (B-top, v3) — "Both are curated by Tuntun's research team, visible the moment
 * you open the stock page." A single centered phone showing the Exclusive Research
 * & Guidance section (combined clip 00:15–00:23, TRIMMED to 5.00s — not slowed).
 * No right-zone badge/text. (spec §25 v3)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { ASSETS } from "../timeline";

export const Scene25 = () => (
  <SceneWrap fade={0}>
    <PhoneCenter video={ASSETS.combo23_27} startSec={16} top={80} height={865} />
  </SceneWrap>
);
