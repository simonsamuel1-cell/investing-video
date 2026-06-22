/**
 * S23 (B-top, v3) — "Once you have a candidate, two things to check before acting."
 * A single centered phone tapping into the IFSH stock page (combined clip
 * 00:00–00:03, slow ×1.19). No right-zone content. (spec §23 v3)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { ASSETS } from "../timeline";

export const Scene23 = () => (
  <SceneWrap>
    <PhoneCenter video={ASSETS.combo23_27} startSec={0} top={80} height={865} />
  </SceneWrap>
);
