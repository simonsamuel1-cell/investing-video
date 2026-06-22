/**
 * S15 (Layout B-top) — "Groups cover conglomerate families — stocks that move
 * together because they share the same controlling shareholder." Heading "One
 * owner, many companies." centred above a centred phone on the Group tab
 * (Scene_12__13__14__15.mp4 @00:31). The clip opens on Concept and switches to
 * Group ~00:32–34 — kept intentionally. No grey band (G2). Ref: Scene_15.png.
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";

export const Scene15 = () => (
  <SceneWrap>
    <Heading x={96} y={74} width={1728} align="center" size={56} delay={4}>
      One owner, many companies.
    </Heading>
    <PhoneCenter video={ASSETS.combo12_15} startSec={31} top={180} height={765} delay={4} />
  </SceneWrap>
);
