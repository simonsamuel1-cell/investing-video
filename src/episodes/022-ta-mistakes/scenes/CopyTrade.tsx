/**
 * SC15 · ASAL COPY TRADE.  `from 12514 · to 13206`
 *
 * Satu saham bisa jadi empat keputusan yang berbeda. What gets copied is the
 * ticker; what decides the outcome is everything the ticker does not show.
 *
 * ⚠ THE LAYOUT IS THE ARGUMENT. One header at the top, two columns beneath —
 * and by 12988 a single chip up there is outnumbered by eight values down
 * here. No sentence has to say the ticker is the small part.
 *
 * ⚠ ITS FRAMES ARE THE VOICE'S, NOT `BLOCK`'S. 12514 · 12676 · 13096 are the
 * three subtitle cues this is built on, so it is mounted on its own window
 * rather than on a tile — the block table is still 150–180 frames behind the
 * recording from SC11 on, because the six VO pads were never rippled into it.
 * It therefore straddles the SC14/SC15 boundary at 13070; both tiles are
 * Blank, so nothing is covered. See PLANS in data/timing.ts.
 *
 * ⚠ THE TITLE CARD LEAVES ON THE FRAME THE HEADER ARRIVES. 12656 → 12676 is
 * not a chosen overlap: "…copy trade orang lain." hands straight over to
 * "Sahamnya mungkin sama," with no air between the cues, so the second beat
 * cannot be given a run-up.
 *
 * ⚠ NO CHART AND NO TICKER — see components/PlanCompare.tsx, which holds the
 * reasons. Entry and exit markers on a price are directional markers and
 * scripts/audit.mjs is right to refuse them; the row comparison says the same
 * thing without putting a mark on a price.
 *
 * ⚠ THE ON-SCREEN COPY IS THE BUILD PROMPT'S, WORD FOR WORD, including its
 * English row labels and its eight plan values. It is the one thing here that
 * is not derived and not VO-locked, and three of Simon's own open items are
 * about it — the numbering on the chip, the rupiah figures, and whether the
 * closing line should be in Bahasa. Every one of them is a single edit in
 * PLANS or in this file; none of them is a rebuild.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Chip, DashedBox, Layer, Line, Stage, Words,
  progress, theme, usePalette,
} from "../../../core";
import { PLANS, local } from "../data/timing";
import { PLAN } from "../data/layout";
import { PlanCompare } from "../components/PlanCompare";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = PLANS;
const P = PLAN;
// ═══════════════════════════════════════════════════════════════════════════

/** ⚠ A NUMBER THE COUNTER NEVER SHOWED. CG-E is off for every scene from SC06
 *  on, so this chip is the only tally on screen in the whole episode — it is
 *  Simon's open item, and it is this one string to drop. */
const NUMBER = "Mistake #8";
const HEADLINE = "Copy Trading";
const SUB = "Ikut posisi orang tanpa rencana sendiri";

/** B1 — the card that names the mistake, and then gets out of the way. */
const Naming = ({ g }: { g: number }) => {
  const c = usePalette();
  const out = progress(g, V.b1.out.at, V.b1.out.over);
  const rule = progress(g, V.b1.rule.at, V.b1.rule.over);
  if (out >= 0.999) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 1 - out,
        transform: `translateY(${-out * P.b1.lift}px)`,
      }}
    >
      <Chip
        label={NUMBER}
        x={P.b1.x}
        y={P.b1.chipY}
        at={local(V.b1.chip, V.at)}
        anchor="left"
        size={P.b1.chipSize}
        pill
        solid
      />
      <Words
        text={HEADLINE}
        x={P.b1.x}
        y={P.b1.headY}
        at={local(V.b1.head.at, V.at)}
        anchor="left"
        vAlign="top"
        stagger={V.b1.head.stagger}
        size={theme.text.display.size}
        weight={theme.text.display.weight}
      />
      <Line
        text={SUB}
        x={P.b1.x}
        y={P.b1.subY}
        at={local(V.b1.sub, V.at)}
        anchor="left"
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />
      {/* ⚠ IT DRAWS, IT DOES NOT FADE. A rule that appears is a rule that was
          always there; a rule that is drawn is the card underlining itself. */}
      {g >= V.b1.rule.at && (
        <Layer>
          <line
            x1={P.b1.x}
            y1={P.b1.rule.y}
            x2={P.b1.x + P.b1.rule.w * rule}
            y2={P.b1.rule.y}
            stroke={c.cyan}
            strokeWidth={theme.shape.rule * 2}
            strokeLinecap="round"
          />
        </Layer>
      )}
    </div>
  );
};

export const CopyTrade = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  /** ⚠ GLOBAL FRAMES. The table is written in the timeline's numbers and a
   *  scene inside a Sequence sees its own, so `at` goes back on first. */
  const g = f + V.at;

  /** ⚠ THE WHOLE SCENE GOES TO HALF UNDER THE VERDICT — see B5 below. */
  const dim = 1 - progress(g, V.verdict.at, V.verdict.over) * (1 - V.verdict.dim);

  return (
    <Stage>
      <AbsoluteFill style={{ opacity: dim }}>
      <Naming g={g} />

      {/* ⚠ MOUNTED ONCE, AT 12676, AND NEVER AGAIN. Every beat after this is a
          prop change inside one instance — see the header of PlanCompare. */}
      {g >= V.card.at && <PlanCompare g={g} />}

      {/* ⚠ THE ONLY THING B3 ADDS. The columns do not move and the ticker does
          not move; its stillness against two brightening columns is the beat.

          ⚠ AND IT IS THE EPISODE'S MARQUEE NOW, NOT A PILL — "text box putus
          putus". The same dashed frame SC06 and SC11 close on, so the three
          closings are one shape. Its content is drawn whole rather than typed:
          this is a conclusion arriving, not a sentence being written. */}
      <div style={{ opacity: 1 - progress(g, V.ask.away.at, V.ask.away.over) }}>
      <DashedBox
        x={P.close.x}
        y={P.close.y}
        w={P.close.w}
        h={P.close.h}
        at={local(V.close.at, V.at)}
        block={P.close.block}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.text.family,
            fontSize: P.close.size,
            fontWeight: theme.text.title.weight,
            color: c.ink,
            /** ⚠ IT MAY NOT WRAP. The box is measured to the sentence, so a
             *  second line here means the measurement has gone stale. */
            whiteSpace: "nowrap",
          }}
        >
          {V.close.text}
        </div>
      </DashedBox>
      </div>
      {/* ── B4 · the three questions ────────────────────────────────────
          In the room the right column leaves behind, level with the person who
          is left. Filled indigo with white type and lifted off the ground —
          "pill design dengan fill indigo, warna textnya putih, kasih shadow". */}
      {V.ask.rows.map((q, i) => (
        <Chip
          key={q.text}
          label={q.text}
          x={P.ask.x}
          y={P.ask.y0 + i * P.ask.pitch}
          at={local(q.at, V.at)}
          size={P.ask.size}
          weight={P.ask.weight}
          padY={P.ask.padY}
          anchor="left"
          pill
          solid
          shadow
        />
      ))}
      </AbsoluteFill>

      {g >= V.verdict.at && (
        <DashedBox
          x={P.verdict.x}
          y={P.verdict.y}
          w={P.verdict.w}
          h={P.verdict.h}
          at={local(V.verdict.at, V.at)}
          block={P.verdict.block}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.text.family,
              fontSize: P.verdict.size,
              fontWeight: theme.text.title.weight,
              color: c.ink,
              whiteSpace: "nowrap",
            }}
          >
            {V.verdict.text}
          </div>
        </DashedBox>
      )}

      {/* ── B5 · the verdict ────────────────────────────────────────────
          ⚠ IT DIMS WHAT IT COVERS RATHER THAN REPLACING IT. Simon: "semua
          visual berkurang transparansinya jadi 50%". The table and the
          questions stay legible underneath, which is the difference between a
          conclusion drawn FROM them and one that arrives instead of them.

          ⚠ AND THE DIM IS ON A WRAPPER, NOT ON EACH THING. Every element in
          this scene already animates its own opacity; multiplying each of them
          by 0.5 would mean fourteen places to keep in step. */}
    </Stage>
  );
};
