/**
 * S14 (B) — Concepts. Phone shows the Concept tab (combined clip 29–37s). Right
 * zone: 4 concept-type chips matching the real UI list. (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";

const CONCEPTS = [
  "Investor Legendaris",
  "Terafiliasi Pemerintah",
  "Kepemilikan",
  "Gentengisasi",
];

export const Scene14 = () => (
  <SceneWrap>
    <PhoneClip src={ASSETS.combo12_15} startSec={29} />
    <Heading x={640} y={110} width={800} size={46} delay={4}>
      Concepts: the stories tying stocks together.
    </Heading>
    {CONCEPTS.map((label, i) => (
      <Chip
        key={label}
        x={640}
        y={262 + i * 116}
        width={760}
        variant={i % 2 === 0 ? "purple" : "cyan"}
        size={34}
        delay={20 + i * 14}
        badge={i + 1}
      >
        {label}
      </Chip>
    ))}
  </SceneWrap>
);
