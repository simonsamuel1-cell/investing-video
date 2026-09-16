/**
 * scenes/Draft.tsx — THE OTHER SESSION'S WORKBENCH.
 *
 * ⚠ ONE FILE, OWNED BY ONE CHAT AT A TIME. Simon runs a second conversation for
 * the NEXT scene while this one finishes the current scene. Two agents on one
 * branch collide on whatever they both touch, so the split is not by scene — it
 * is by FILE, and this is the whole of the other session's half.
 *
 * ⚠ IT MUST NOT IMPORT data/timing.ts, AND THAT IS THE RULE THE WHOLE
 * ARRANGEMENT RESTS ON. The frame table is the one thing both scenes need and
 * the one thing that cannot be merged: every voice-over pad so far has shifted
 * everything after it, and two copies of that table would have to be rippled
 * identically by two sessions or go quietly out of step. So the other session
 * owns the PICTURE and writes its beats as local constants counted from 0; this
 * session owns the CLOCK and puts them into the real table when the picture
 * lands.
 *
 * ⚠ AND ITS CLOCK STARTS AT 0. `useCurrentFrame()` here is frames since the
 * draft began, not a timeline frame — so nothing in this file has to know where
 * in the episode it will end up, and nothing about where it ends up has to be
 * decided before it is drawn.
 *
 * ═══ HANDOVER ═══  When the picture is right:
 *   1. this file is renamed to what the scene actually is (Hindsight.tsx, …),
 *   2. its local beats move into data/timing.ts as one block,
 *   3. Composition.tsx gains one import and one <Sequence>.
 * That is the "copy" — a component, not a timeline.
 */
import { useCurrentFrame } from "remotion";
import { Line, Stage, theme, usePalette } from "../../../core";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/**
 * Beats, in frames from this draft's own start. They become one block in
 * data/timing.ts at handover — never written there from here.
 *
 * ⚠ POSITIONS HERE, DURATIONS FROM useMotion(). This project's first rule is
 * that a component never writes a bare frame count, and a duration is exactly
 * that: written as 30 it becomes half a second the day this renders at 120fps.
 * WHEN something happens is a position and belongs in a table; HOW LONG it
 * takes is a feel and belongs to the motion system. The audit enforces it, and
 * it caught this stub.
 */
const V = {
  hello: { at: 20 },
} as const;
// ═══════════════════════════════════════════════════════════════════════════

export const Draft = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  return (
    <Stage>
      <Line
        text="Draft — scenes/Draft.tsx"
        x={theme.canvas.width / 2}
        y={theme.stage.active.y + theme.stage.active.h / 2}
        at={V.hello.at}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />
      <div
        style={{
          position: "absolute",
          left: theme.stage.active.x,
          top: theme.stage.active.y,
          fontFamily: theme.text.mono,
          fontSize: theme.text.axis.size,
          color: c.muted,
        }}
      >
        f{f}
      </div>
    </Stage>
  );
};
