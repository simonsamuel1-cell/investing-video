/**
 * SC20 — the close. `from 18704 · dur 888`
 *
 * The roadmap comes back with every part ticked and collapses into the one
 * sentence the episode is for. It is the SAME rail the opening card used —
 * StepRail is one object carried across the episode, not rebuilt here, which is
 * what makes the ticks read as a journey finishing rather than a new list.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, StepRail, Words, Line, TuntunMark, useMotion, progress, theme,
} from "../../../core";
import { BLOCK, BEAT, local } from "../data/timing";
import { STEPS } from "./Cards";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC20;
const T = {
  rail: 0,
  direction: local(BEAT.direction, FROM),
  behind: local(BEAT.behindIt, FROM),
  notAGuess: local(BEAT.notAGuess, FROM),
  close: local(BEAT.convincing3, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════
const CARD = theme.stage.card;

export const SC20 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  /* the rail hands over to the closing statement rather than cutting */
  const out = 1 - progress(f, T.notAGuess, m.sec(0.8));

  return (
    <Stage>
      {out > 0.001 && (
        <StepRail steps={STEPS} at={T.rail} done={[0, 1, 2, 3, 4]} opacity={out} />
      )}
      {f >= T.notAGuess && (
        <>
          <TuntunMark x={theme.canvas.width / 2} y={CARD.y + CARD.h * 0.06} height={CARD.h * 0.16} opacity={progress(f, T.notAGuess, m.reveal)} />
          <Words
            text="Harga menunjukkan arahnya"
            x={theme.canvas.width / 2}
            y={CARD.y + CARD.h * 0.46}
            at={T.notAGuess}
            size={theme.text.display.size}
            weight={theme.text.display.weight}
          />
          <Words
            text="Volume menunjukkan seberapa ramai di baliknya"
            x={theme.canvas.width / 2}
            y={CARD.y + CARD.h * 0.64}
            at={T.notAGuess + m.sec(0.6)}
            size={theme.text.title.size}
            weight={theme.text.title.weight}
          />
          <Line
            text="Bukan alat menebak — alat menilai"
            x={theme.canvas.width / 2}
            y={CARD.y + CARD.h * 0.84}
            at={T.close}
            color={theme.color.slate}
          />
        </>
      )}
    </Stage>
  );
};
