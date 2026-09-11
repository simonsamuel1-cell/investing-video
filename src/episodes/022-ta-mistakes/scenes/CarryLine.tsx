/**
 * The line that crosses the cut.  `from 973 · to 1995`
 *
 * ⚠ IT EXISTS BECAUSE ONE OBJECT HAS TO OUTLIVE A SCENE — Simon's idea: SC02
 * ends by asking whether Technical Analysis failed, and SC03 opens on what
 * Technical Analysis actually gives you. Those are the same two words, so they
 * do not get drawn twice: "gagal?" leaves, "Belum tentu" leaves, and the two
 * words that both scenes are about slide to the middle and stay.
 *
 * ⚠ MOUNTED ABOVE THE TILING, for the same reason. SC03 paints its own opaque
 * stage over CG-A; a heading owned by either side would be covered by the
 * other, so it belongs to NEITHER.
 *
 * ⚠ THE RE-CENTRING IS DONE BY THE LAYOUT, NOT BY A TYPED OFFSET. The row is
 * centred and "gagal?" shrinks its own font to nothing, so the flexbox slides
 * the remaining words across exactly — no text measuring, and nothing to redo
 * when the wording changes.
 */
import { useCurrentFrame } from "remotion";
import {
  gridOf, progress, ramp, textReveal, ticksOf, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, PREMISE, REVERSE, local } from "../data/timing";
import { MA } from "../data/layout";
import { SETUP, SETUP_DOMAIN } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = REVERSE.ask;
// ═══════════════════════════════════════════════════════════════════════════

const LEAD = "Technical Analysis";
const TAIL = " gagal?";
const ANSWER = "Belum tentu";
const SIZE = theme.text.display.size;

/**
 * ⚠ THE PRICE LINE IT SITS ABOVE, SOLVED ONCE. The gridlines belong to the
 * chart and the chart is pushed in by then, so the level is read AFTER the
 * scale — and at the settled scale, because by this frame the push is over.
 * Computed here rather than in the scene that draws the chart: this layer is
 * the only thing that needs it, and it needs it to stay put after the chart
 * itself has gone.
 */
const ASK_Y = (() => {
  const grid = gridOf(SETUP.closes, SETUP_DOMAIN, MA.plot, 0.12, MA.gutter);
  const zoomed = (y: number) =>
    theme.stage.card.y + (y - theme.stage.card.y) * (1 + REVERSE.zoom.by);
  const mid = theme.canvas.height / 2;
  return (
    ticksOf([grid.lo, grid.hi])
      .map((v) => zoomed(grid.y(v)))
      .reduce((best, y) => (Math.abs(y - mid) < Math.abs(best - mid) ? y : best)) -
    SIZE * 0.75
  );
})();

export const CarryLine = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const g = f + FROM;

  /** The question's two halves arrive as words do — fade and rise, never a pop. */
  const lead = textReveal(f, 0, m.reveal);
  const tail = textReveal(f, m.sec(0.18), m.reveal);
  /**
   * ⚠ FONT-SIZE, NOT WIDTH. Shrinking the type to nothing takes the word's
   * LAYOUT with it, which is what lets the centred row carry the remaining
   * words to the middle on its own. Opacity leads the shrink, so what is read
   * is a word fading while the rest glides across.
   */
  const carry = progress(f, local(PREMISE.carry.at, FROM), PREMISE.carry.over);
  const gone = progress(f, local(PREMISE.carry.at, FROM), m.fade);
  /** ⚠ AND THE SUBJECT LEAVES WHEN ITS SUBJECT COMES BACK — Simon: "saat
   *  transisi ke chart, semua text fade out". The two words were standing in
   *  for the chart while it was away; there is nothing for them to do once it
   *  is on screen again. */
  const out = progress(f, local(PREMISE.resume.at, FROM), m.fade);

  const typed = ramp(f, local(REVERSE.notYet, FROM), ANSWER.length * REVERSE.perChar);
  const answer = ANSWER.slice(0, Math.floor(typed * ANSWER.length));

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ASK_Y,
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          fontFamily: theme.text.family,
          fontWeight: theme.text.display.weight,
          color: c.indigo,
          whiteSpace: "pre",
          opacity: 1 - out,
        }}
      >
        <span style={{ fontSize: SIZE, opacity: lead.opacity, transform: `translateY(${lead.dy}px)` }}>
          {LEAD}
        </span>
        <span
          style={{
            fontSize: SIZE * (1 - carry),
            opacity: tail.opacity * (1 - gone),
            transform: `translateY(${tail.dy}px)`,
          }}
        >
          {TAIL}
        </span>
      </div>

      {/* ⚠ THE ANSWER LEAVES WITH THE QUESTION IT ANSWERS. It belongs to SC02 —
          what carries into SC03 is the subject, not the verdict. */}
      {g >= REVERSE.notYet && gone < 0.999 && (
        <div
          style={{
            position: "absolute",
            left: theme.canvas.width / 2,
            top: ASK_Y + SIZE * 1.25,
            transform: "translate(-50%, -50%)",
            fontFamily: theme.text.family,
            fontSize: SIZE,
            fontWeight: theme.text.display.weight,
            color: c.ink,
            opacity: 1 - gone,
            whiteSpace: "pre",
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
};

/** Kept honest: the layer has to still be mounted when SC03 ends, or the
 *  heading it carries would vanish mid-scene. */
{
  if (PREMISE.carry.at < REVERSE.notYet) {
    throw new Error("022-ta-mistakes/CarryLine: the carry starts before the answer has been typed");
  }
  if (BLOCK.SC04 <= PREMISE.kepastian) {
    throw new Error("022-ta-mistakes/CarryLine: SC03's last beat falls outside the layer's window");
  }
}
