/**
 * SCENE 07 — Golden cross & death cross. `from 3547 · dur 650`
 *
 * IT HAS NO CHART. SC05's candles run underneath it and simply zoom out at
 * 3547 to show the whole tape — Simon: scene 4 to scene 5 is continuous,
 * technically no transition. This scene is the heading and the text that go
 * over that tape.
 *
 * ⚠ THE CROSSING MARKS ARE NOT HERE YET, AND THAT IS DELIBERATE.
 *
 * They used to be pinned to a series of this scene's own — a grey line chart
 * with two averages built to cross on cue. That series is gone with the chart,
 * and SC05's tape cannot replace it yet: checked across every fast/slow pair,
 * it contains a clean DEATH cross in the decline (MA20/MA50 at bar 78) and no
 * golden cross before it — the tape opens mid-climb, so the golden cross that
 * would belong at the front happened before bar 0. Its only golden crossings
 * sit inside the closing range, which are whipsaws, i.e. exactly the false
 * signals this scene warns about. Labelling one of those "Golden Cross" under
 * "ini disebut golden cross" at 3619 would teach the opposite of the line.
 *
 * So the marks wait. Simon's call: "biarkan, memang belum selesai perbaikan
 * visual." Resolving it needs a tape that carries golden-then-death in that
 * order — see the note in the conversation.
 *
 * No day count, no measured lag bracket, no generalising copy.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  lag: sec(8.6),
  lagEnd: sec(11.7),
  block: sec(18.4),
  strike: sec(19.0),
};
// ═══════════════════════════════════════════════════════════════════════════

assertBlocks("Scene07", [
  { from: T.lag, until: T.lagEnd },
  { from: T.block, until: 650 },
]);

export const Scene07 = () => {
  const f = useCurrentFrame();

  return (
    /*
     * A TRANSPARENT fill, NOT SafeArea. SafeArea paints the episode's own
     * white ground, and this scene is mounted OVER SC05 — one opaque
     * background here and the chart it is supposed to annotate disappears
     * behind it. Any overlay-only stage in this episode has the same rule.
     */
    <AbsoluteFill
      style={{
        fontFamily: theme.type.family,
        color: theme.colors.text,
      }}
    >
      {/*
        NO cut wrapper, and NO heading. Simon: the heading stays "Cara Baca
        Moving Average" right through this beat, so SC05 keeps owning it —
        mounting a second one here would swap a title the scene never left.
      */}

      <TextBlock
        mode="A"
        localFrame={f}
        from={T.lag}
        until={T.lagEnd}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 110}
        lines={[
          { text: "PRICE MOVED FIRST", size: "h2", color: "indigo" },
          { text: "↓", size: "h2", color: "muted" },
          { text: "CROSS CAME LATER", size: "h2", color: "text" },
        ]}
      />

      {/* COMPLIANCE: struck misconception, never a statement */}
      <TextBlock
        mode="C"
        localFrame={f}
        from={T.block}
        until={650}
        lines={[
          {
            text: "CROSS = ENTRY SIGNAL",
            size: "h2",
            color: "muted",
            struck: T.strike,
          },
          { text: "CROSS = TREND CONFIRMATION", size: "h1", color: "indigo" },
          {
            text: "Confirmation, Not a Trigger",
            size: "label",
            color: "muted",
          },
        ]}
      />
    </AbsoluteFill>
  );
};
