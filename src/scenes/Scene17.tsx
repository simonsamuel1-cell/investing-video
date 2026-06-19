/**
 * S17 (B) — start at the homepage, Hot Themes. Phone plays the Hot Themes clip.
 * Right zone: "Step 1 · Hot Themes" + a cyan chip "Momentum today." (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";

export const Scene17 = () => (
  <SceneWrap>
    <PhoneClip src={ASSETS.hotThemes} startSec={0} />
    <div style={{ position: "absolute", left: 640, top: 300, fontSize: 32, fontWeight: 700, color: COLORS.purple }}>
      Step 1
    </div>
    <Heading x={640} y={344} width={800} size={64} delay={6}>
      Hot Themes
    </Heading>
    <Chip x={640} y={480} width={620} variant="cyan" size={34} delay={22}>
      What has momentum today.
    </Chip>
  </SceneWrap>
);
