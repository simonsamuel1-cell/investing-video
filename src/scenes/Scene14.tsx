/**
 * S14 (Layout B-side) — "Concepts cover market themes that don't fit neatly into
 * a sector — stocks held by legendary investors, government-linked companies,
 * political ownership, or specific narratives like 'gentengisasi.'"
 * Phone on the Concept tab (Scene_12__13__14__15.mp4 @00:19); right zone: four
 * NUMBERED category chips. No grey panel (G2). Ref: Scene_14.png (layout only).
 * Chips are generalized category labels, not the literal VO words. (spec §14)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";

const CONCEPTS = [
  "Legendary Investors",
  "Government-Affiliated",
  "Common Ownership",
  "Special Situations",
];

export const Scene14 = () => (
  <SceneWrap>
    <PhoneFrame x={108} y={80} w={428} video={ASSETS.combo12_15} startSec={19} />

    <Heading x={648} y={242} width={1128} size={42} delay={4}>
      Concepts: the stories tying stocks together.
    </Heading>

    {CONCEPTS.map((label, i) => (
      <Chip
        key={label}
        x={648}
        y={362 + i * 80}
        width={1128}
        variant={i % 2 === 0 ? "purple" : "cyan"}
        size={32}
        delay={18 + i * 16}
        badge={i + 1}
      >
        {label}
      </Chip>
    ))}
  </SceneWrap>
);
