/**
 * S20 (Layout B-side) — "Then go to Research. This explains why the theme is
 * moving — the catalyst, the narrative, the risk. You understand the story, not
 * just the price."
 * Phone plays Scene_17__19__20__21.mp4 00:11–00:19, slowed ×1.13 (playbackRate
 * 0.885) to fill — the only real slow-down in this range. Three chips on silver,
 * no grey panel (G2). (spec §20)
 *
 * TODO(studio): if the slowed scrolling judders, switch to a hold-on-keyframe of
 * a Research-cards frame for the extra ~1s.
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
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
    <PhoneFrame x={108} y={80} w={428} video={ASSETS.combo17_21} startSec={11} playbackRate={0.885} />

    <Heading x={648} y={140} width={1100} size={46} delay={4}>
      Research — the why behind it.
    </Heading>

    {ITEMS.map((it, i) => (
      <Chip key={i} x={648} y={300 + i * 138} width={1010} variant={it.variant} size={34} delay={20 + i * 40} badge={i + 1}>
        {it.label}
      </Chip>
    ))}
  </SceneWrap>
);
