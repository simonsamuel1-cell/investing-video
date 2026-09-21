/**
 * S30 (A) — the recap montage (515f / 17s, longest scene, no internal pause).
 * See RecapMontage for the pacing. Mid-flow — animates continuously. (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { RecapMontage } from "../components/RecapMontage";

export const Scene30 = () => (
  <SceneWrap>
    <RecapMontage />
  </SceneWrap>
);
