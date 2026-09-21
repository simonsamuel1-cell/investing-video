/**
 * S21 (Layout B-side) — "Finally, the Stock tab. Filter by technical condition,
 * accumulation signals, and valuation and shortlist only the strongest candidates
 * inside the theme."
 * Phone plays Scene_17__19__20__21.mp4 00:19–00:30 at 1:1; the clip is 0.17s
 * LONGER than the VO so it is simply TRIMMED by the 325-frame scene length (no
 * slow-down). The live Research→Stock switch near the start is kept. Three filter
 * chips on silver, no grey panel (G2). (spec §21)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";

const FILTERS = [
  { label: "Technical", variant: "purple" as const },
  { label: "Accumulation", variant: "cyan" as const },
  { label: "Valuation", variant: "purple" as const },
];

export const Scene21 = () => (
  <SceneWrap>
    <PhoneFrame x={108} y={80} w={428} video={ASSETS.combo17_21} startSec={19} />

    <Heading x={648} y={140} width={800} size={48} delay={4}>
      Filter to the strongest candidates.
    </Heading>

    {FILTERS.map((f, i) => (
      <Chip key={f.label} x={648} y={300 + i * 124} width={620} variant={f.variant} size={34} delay={20 + i * 36} badge={i + 1}>
        {f.label}
      </Chip>
    ))}
  </SceneWrap>
);
