/**
 * S21 (B) — Stock tab. Phone shows the stock list with filters (combined clip
 * 20–30s). Right zone: 3 filter chips (Technical / Accumulation / Valuation) and
 * purple boxes on the IFSH / AMMN tags. (spec §7)
 *
 * TODO(studio): tune TAG_BOXES to the real IFSH/AMMN tag positions in the clip.
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { Callout } from "../components/Callout";
import type { Box } from "../components/Callout";
import { ASSETS } from "../timeline";

const FILTERS = [
  { label: "Technical", variant: "purple" as const },
  { label: "Accumulation", variant: "cyan" as const },
  { label: "Valuation", variant: "purple" as const },
];

const TAGS: { label: string; box: Box; y: number }[] = [
  { label: "IFSH", box: { x: 360, y: 520, w: 150, h: 58 }, y: 612 },
  { label: "AMMN", box: { x: 360, y: 640, w: 150, h: 58 }, y: 742 },
];

export const Scene21 = () => (
  <SceneWrap>
    <PhoneClip src={ASSETS.combo17_21} startSec={20} />
    <Heading x={640} y={108} width={800} size={46} delay={4}>
      Filter the list to the leaders.
    </Heading>
    {FILTERS.map((f, i) => (
      <Chip key={f.label} x={640} y={222 + i * 110} width={520} variant={f.variant} size={32} delay={16 + i * 12} badge={i + 1}>
        {f.label}
      </Chip>
    ))}
    {TAGS.map((t, i) => (
      <Callout key={t.label} box={t.box} chip={{ x: 720, y: t.y, w: 360 }} label={t.label} delay={60 + i * 20} />
    ))}
  </SceneWrap>
);
