/**
 * S19 (B) — open a theme: read it four ways. Phone shows the Overview (combined
 * clip 3–9s). Right zone: 4 chips, each with a purple box on the matching phone
 * region. Mid-flow — animate continuously. (spec §7)
 *
 * TODO(studio): tune BOXES to the real Overview regions in Scene_17__19__20__21.mp4.
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import type { Box } from "../components/Callout";
import { ASSETS } from "../timeline";

const ITEMS: { label: string; box: Box; y: number }[] = [
  { label: "Broad move, or isolated?", box: { x: 120, y: 250, w: 404, h: 168 }, y: 234 },
  { label: "Which stocks are leading", box: { x: 120, y: 470, w: 404, h: 74 }, y: 384 },
  { label: "Sub-themes inside it", box: { x: 120, y: 566, w: 404, h: 74 }, y: 534 },
  { label: "Foreign flow", box: { x: 120, y: 662, w: 404, h: 74 }, y: 684 },
];

export const Scene19 = () => (
  <SceneWrap>
    <PhoneClip src={ASSETS.combo17_21} startSec={3} />
    <Heading x={640} y={108} width={800} size={42} delay={4}>
      Open a theme — read it four ways.
    </Heading>
    {ITEMS.map((it, i) => (
      <Callout
        key={i}
        box={it.box}
        chip={{ x: 720, y: it.y, w: 1010 }}
        label={it.label}
        badge={i + 1}
        delay={18 + i * 22}
      />
    ))}
  </SceneWrap>
);
