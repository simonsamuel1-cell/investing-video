/**
 * S3 (A) — the grey tiles resolve into 3 labelled cards: Sector / Concept / Group
 * (purple, cyan, purple-dark). The thesis visual — let it breathe. (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { Card } from "../components/Card";
import { COLORS } from "../theme";

const CARDS = [
  { title: "Sector", body: "Industries & sub-sectors", accent: COLORS.purple },
  { title: "Concept", body: "The themes that move them", accent: COLORS.cyan },
  { title: "Group", body: "Conglomerate families", accent: COLORS.purpleDark },
];

export const Scene03 = () => {
  const W = 472;
  const H = 364;
  const GAP = 80;
  const total = CARDS.length * W + (CARDS.length - 1) * GAP;
  const startX = (1920 - total) / 2;
  const y = 432;
  return (
    <SceneWrap>
      <Heading x={96} y={150} width={1728} align="center" size={60}>
        The market moves in themes.
      </Heading>
      {CARDS.map((c, i) => (
        <Card
          key={c.title}
          x={startX + i * (W + GAP)}
          y={y}
          w={W}
          h={H}
          accent={c.accent}
          delay={18 + i * 10}
          title={c.title}
          titleSize={48}
          body={c.body}
          bodySize={28}
        />
      ))}
    </SceneWrap>
  );
};
