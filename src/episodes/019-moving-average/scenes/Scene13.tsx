/**
 * SCENE 13 — the close. `from 8583 · dur 426`
 *
 * ⚠ EVERYTHING THIS SCENE USED TO DRAW IS GONE at Simon's direction — the
 * price line, both overlays, the mode-C text. It is now the card VIDEO 19
 * closes on: the Tuntun mark, large type, and a short rule under it.
 *
 * ═══ FOUR POINTS, NOT A SENTENCE ═══
 *
 * It was a two-line quote for a while, with the tool-to-job pairings pruned
 * out of it on the grounds that the episode had already taught them. Simon's
 * call is that they go back in, as a list — and he is right that the VO here
 * IS a list: four claims, one per sentence, and a card that collapses them
 * into one line makes the viewer's ear and eye disagree.
 *
 * ⚠ EACH ROW LANDS ON ITS OWN SENTENCE. The frames below are read off the
 * subtitle cues, not spaced by a fixed stagger — 8589, 8673, 8769 and 8841
 * against this scene's own 8583.
 *
 * ═══ WHY A CARD AND NOT A CHART ═══
 *
 * The episode has spent nine minutes on charts and its last claim is not about
 * one. "Gunakan moving average untuk membaca trend, Bollinger Bands untuk
 * melihat perubahan volatility, dan tetap mulai dari price action" — that is a
 * rule for the viewer, not a reading of a tape, and putting it over candles
 * would invite them to look for it in the candles.
 *
 * THE MARK BREATHES. A sine from its own zero, so it leaves rest and returns
 * to it rather than starting mid-drift.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../../../core";
import { TuntunMark } from "../../../core";
import { RoadmapGround } from "./Scene01";
import { theme } from "../theme";
import { textReveal } from "../helpers";
import { CUTS, cutInStyle } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/**
 * ⚠ CUED TO THE VOICE, one row per sentence. Global frames in the margin; this
 * scene is mounted at 8583.
 */
/** Where this scene is mounted — the cut is read from global frames. */
const FROM = 8583;
const T = {
  mark: 0,
  rows: [6, 90, 186, 258], // 8589 · 8673 · 8769 · 8841
};
/**
 * The block sits ABOVE the subtitle band, which owns the bottom 108px. The
 * mark, then the list, then the rule.
 */
const CARD = {
  markY: 190,
  markH: 120,
  listY: 470,
  size: 46,
  /** 20px between sentences, Simon's number, plus the type's own height. */
  lead: 66,
};
/**
 * ═══ THE QUOTE CARD ═══
 *
 * From Simon's reference: a rounded rectangle with a dark border, a solid
 * ORANGE block offset behind it, and a pair of large quote marks tucked into
 * opposite corners.
 *
 * ⚠ THE REFERENCE'S CREAM FILL IS NOT USED. This episode's palette is
 * hue-locked to indigo and cyan over white, with orange and tosca naming the
 * indicators; a warm off-white would be a new hue family introduced on the
 * last card of the video. The border and the orange offset carry the shape on
 * their own. Say the word and it becomes a named token.
 *
 * The offset is what makes it a card rather than an outline — a shape with
 * something solid behind it reads as sitting ON the page.
 */
const BOX = {
  x: 430,
  y: 380,
  w: 1060,
  /**
   * Tall enough for the four lines AND the closing mark, which now sits UNDER
   * them rather than beside the third: 470 → 714 for the type, the mark to
   * 806, and 40 of floor. Sized to its contents, not chosen.
   */
  h: 466,
  /** How far the orange block sits down and right of the card. */
  drop: 14,
  border: 4,
  /** The quote marks, and how far they are inset from their own corner. */
  mark: 76,
  pad: 46,
  /**
   * ⚠ SIMON'S 20px IS INK-TO-INK, and it has to be measured, not assumed.
   * Both glyphs float inside boxes far taller than the drawn shape: in a
   * full-res render the opening mark's ink runs from +11 to +34 inside its own
   * 76px box, the closing mark's from +12, and the 46px type's cap-top sits at
   * +13 with descenders reaching +57. Setting the boxes 20px apart would read
   * as roughly sixty. The offsets below are those measurements.
   */
  gap: 20,
  ink: { markTop: 12, markBot: 34, textTop: 13, textBot: 57 },
};
/**
 * ═══ THE FOUR POINTS ═══
 *
 * Four centred lines, and nothing else — no arrows, no two-tone terms, no
 * grid. That machinery is gone at Simon's direction and it takes a problem
 * with it: "→" is not in Plus Jakarta Sans, and the face it fell back to had
 * an advance three times the glyph, so the columns opened a 98px hole where
 * the gap said 22. A colon says the same thing in the episode's own type.
 *
 * ⚠ THE WORDING AND CASING ARE SIMON'S, verbatim — lower-case "trend" and
 * "volatility", "1 indikator" as a numeral. Tidying either would be tidying
 * his copy.
 *
 * ⚠ THE FOURTH IS RED, and it is the only one that is. The other three say
 * what each tool is FOR; this one says what none of them is. "1" is the
 * load-bearing character — the claim is not that indicators are unreliable,
 * it is that ONE of them is not a decision.
 */
const POINTS: { text: string; red?: boolean }[] = [
  { text: "Moving Average: membaca trend" },
  { text: "Bollinger Bands: membaca volatility" },
  { text: "Tetap mulai dari price action" },
  { text: "Jangan ambil keputusan dari 1 indikator", red: true },
];
/** How far the mark drifts, and how long one full cycle takes. */
const FLOAT = { amount: 7, period: 150 };
// ═══════════════════════════════════════════════════════════════════════════

export const Scene13 = () => {
  const f = useCurrentFrame();
  const cx = theme.layout.width / 2;
  const mark = textReveal(f, T.mark);
  const float =
    Math.sin(((f - T.mark) / FLOAT.period) * Math.PI * 2) * FLOAT.amount;

  /* the same cut CG-C rides out of, read from GLOBAL frames */
  const cut = cutInStyle(f + FROM, CUTS.toClose);

  return (
    <Stage>
      <div style={{ position: "absolute", inset: 0, ...cut }}>
        {/* THE SAME GROUND THE ROADMAPS SIT ON — Simon's call, and it ties the
            closing card to the three contents pages the episode is built
            around. `reveal={1}`: there is no shrink here, the ground simply is. */}
        <RoadmapGround f={f} reveal={1} />

      {/* the orange block, then the card, then its two marks */}
      {(() => {
        const box = textReveal(f, T.rows[0] - 8);
        if (box.opacity <= 0.001) return null;
        const shell = {
          position: "absolute" as const,
          left: BOX.x,
          top: BOX.y,
          width: BOX.w,
          height: BOX.h,
          borderRadius: theme.layout.radius.lg,
        };
        return (
          <div style={{ opacity: box.opacity, transform: box.transform }}>
            <div
              style={{
                ...shell,
                left: BOX.x + BOX.drop,
                top: BOX.y + BOX.drop,
                /* ⚠ INDIGO, not orange. Simon's call for the base block, and
                   it is the right one here: orange is this episode's INDICATOR
                   hue and the card is about not trusting one. */
                background: theme.colors.indigo,
              }}
            />
            <div
              style={{
                ...shell,
                background: theme.colors.surface,
                border: `${BOX.border}px solid ${theme.colors.text}`,
              }}
            />
            {[
              /* the opening mark in its own corner; the closing one BELOW the
                 last line, at the right — Simon's call. Beside the third line
                 it read as belonging to that line rather than closing all
                 four. */
              {
                ch: "\u201C",
                x: BOX.x + BOX.pad,
                /* its ink lands 20px above the first line's cap-top */
                y:
                  CARD.listY +
                  BOX.ink.textTop -
                  BOX.gap -
                  BOX.ink.markBot,
              },
              {
                ch: "\u201D",
                x: BOX.x + BOX.w - BOX.pad - BOX.mark,
                /* its ink lands 20px below the last line's descender */
                y:
                  CARD.listY +
                  (POINTS.length - 1) * CARD.lead +
                  BOX.ink.textBot +
                  BOX.gap -
                  BOX.ink.markTop,
              },
            ].map((q) => (
              <div
                key={q.ch}
                style={{
                  position: "absolute",
                  left: q.x,
                  top: q.y,
                  width: BOX.mark,
                  textAlign: "center",
                  fontFamily: theme.type.family,
                  fontSize: BOX.mark,
                  fontWeight: 800,
                  color: theme.colors.text,
                  lineHeight: 1,
                }}
              >
                {q.ch}
              </div>
            ))}
          </div>
        );
      })()}

      <TuntunMark
        x={cx}
        y={CARD.markY + float}
        height={CARD.markH}
        opacity={mark.opacity}
      />

      {POINTS.map((p, i) => {
        const r = textReveal(f, T.rows[i]);
        return (
          <div
            key={p.text}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: CARD.listY + i * CARD.lead,
              textAlign: "center",
              fontFamily: theme.type.family,
              fontSize: CARD.size,
              fontWeight: theme.type.h2.weight,
              color: p.red ? theme.colors.crossRed : theme.colors.text,
              opacity: r.opacity,
              transform: r.transform,
              whiteSpace: "nowrap",
            }}
          >
            {p.text}
          </div>
        );
      })}

      {/* NO RULE. It was the device that closed the card when the card was
          just type on white; the border does that job now, and a rule inside a
          bordered box is a second frame round the same words. */}
      </div>
    </Stage>
  );
};
