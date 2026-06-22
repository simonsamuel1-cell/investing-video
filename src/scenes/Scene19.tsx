/**
 * S19 (Layout B-side) — "Open a theme that's moving. The detail page tells you
 * whether the move is broad or isolated, who is leading it, which sub-theme is
 * driving it, and whether foreign money is involved."
 * Phone plays Scene_17__19__20__21.mp4 00:00–00:11 (~1:1). Four chips appear as
 * the VO names each factor. No grey panel (G2). (spec §19)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";

const FACTORS = [
  { label: "Broad or isolated", variant: "purple" as const },
  { label: "Who is leading", variant: "cyan" as const },
  { label: "Sub-theme driving it", variant: "purple" as const },
  { label: "Foreign money", variant: "cyan" as const },
];

export const Scene19 = () => (
  <SceneWrap>
    <PhoneFrame x={108} y={80} w={428} video={ASSETS.combo17_21} startSec={0} playbackRate={0.988} />

    <Heading x={648} y={132} width={800} size={46} delay={4}>
      Open a theme — read it four ways.
    </Heading>

    {FACTORS.map((f, i) => (
      <Chip key={f.label} x={648} y={264 + i * 114} width={1010} variant={f.variant} size={32} delay={24 + i * 60} badge={i + 1}>
        {f.label}
      </Chip>
    ))}
  </SceneWrap>
);
