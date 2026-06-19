/**
 * S20 (B) — Research tab. Phone shows the research view (combined clip 9–19s).
 * Right zone: 3 chips — Catalyst / Narrative / Risk. (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";

const ITEMS = [
  { label: "Catalyst — what's driving it now", variant: "purple" as const },
  { label: "Narrative — the story in plain words", variant: "cyan" as const },
  { label: "Risk — what could break it", variant: "purple" as const },
];

export const Scene20 = () => (
  <SceneWrap>
    <PhoneClip src={ASSETS.combo17_21} startSec={9} />
    <Heading x={640} y={120} width={800} size={48} delay={4}>
      Research tab — the why behind the move.
    </Heading>
    {ITEMS.map((it, i) => (
      <Chip key={i} x={640} y={300 + i * 138} width={1010} variant={it.variant} size={34} delay={20 + i * 16} badge={i + 1}>
        {it.label}
      </Chip>
    ))}
  </SceneWrap>
);
