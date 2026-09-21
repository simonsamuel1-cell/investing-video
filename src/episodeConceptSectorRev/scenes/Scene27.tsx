/**
 * S27 (B-top, v3) — "...go to the Company Tab... Under Concept Sector, you'll see
 * every sector, group, and concept this stock belongs to — each with its own
 * momentum." A single centered phone showing the Company tab → Concept Sector
 * section (combined clip ~00:38–00:41.2, TRIMMED — not slowed). No right-zone
 * membership list. (spec §27 v3)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { ASSETS } from "../timeline";

export const Scene27 = () => (
  <SceneWrap fade={0}>
    <PhoneCenter video={ASSETS.combo23_27} startSec={34.033} top={80} height={865} />
  </SceneWrap>
);
