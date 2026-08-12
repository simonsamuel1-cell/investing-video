/**
 * SC16 — Timeframe trap (from 7666, dur 542).
 *
 * ONE series seen from two distances. The "5-minute chart" is not a second
 * dataset — it is TIMEFRAME magnified over TF_WINDOW, and the zoom-out is a
 * continuous widening of that window to the full range. Nothing is swapped, so
 * the viewer can watch a collapse turn into a higher low without the picture
 * ever cheating: the camera pulls back, the price does not change.
 *
 * IT OPENS ON THE MISTAKE, 7666 → 7760, named in words before it is shown.
 * Four lines, flush left, arriving one at a time with the narration — the two
 * that name who makes it in black, the two that name the habit in red. Then the
 * frame goes and does it, so the viewer recognises what they were just told.
 */
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { Line } from "../components/Text";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut, textReveal } from "../helpers";
import { CUTS, cutIn, cutBlur } from "../transitions/CameraCut";
import { plot, window as cut } from "../data/shape";
import { TIMEFRAME, TF_WINDOW, TF_HIGHER_LOW } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 7666;
const T = {
  /**
   * 7762. Held back from 60 so the opening statement owns the frame to 7760;
   * the line then traces faster to still be complete when "akhir tren" lands.
   */
  card: 96,
  fiveMinute: 101, // "chart lima menit"
  worry: 131, // "akhir tren"
  out: 216, // "chart harian"
  higherLow: 262, // "hanya higher low"
  principle: 355, // "timeframe besar lebih dulu"
};
/**
 * THE OPENING STATEMENT.
 *
 * `stagger` is the gap between one line and the next — short and EQUAL, so the
 * four read as one sentence being set down rather than four separate beats.
 * The whole block is therefore up well before "chart terlalu dekat" is spoken;
 * it is a statement the frame makes, not a caption tracking the voice.
 *
 * Flush left on the plot's own left edge — the same x every chart in the
 * episode starts at, so the statement and the picture that follows it share a
 * margin instead of each finding their own.
 */
const NOTE = {
  /** The right-hand column. The figure holds the left. */
  x: 950,
  /** Centre of the first line. */
  y: 330,
  size: 96,
  weight: 800,
  lead: 124,
  stagger: 5,
  out: { at: 90, over: 14 },
};
/**
 * The figure that goes with the statement, in the left column. Its height is
 * what is set; the width follows from the artwork's own 2:3 so it can never be
 * squashed by a later tweak.
 */
const FIGURE = {
  src: "stickman-x.png",
  x: 200,
  y: 150,
  h: 780,
  aspect: 1024 / 1536,
};
/**
 * `hang` is punctuation set OUTSIDE the margin — the opening quote is pushed
 * into the gutter so the four lines start on the same vertical, with the mark
 * leaning in from the left. Aligning the quote instead of the word would leave
 * "Kesalahan" visibly indented from the three lines below it.
 */
const NOTE_LINES: { text: string; warn: boolean; hang?: string }[] = [
  { text: "Kesalahan", warn: false, hang: "“" },
  { text: "Pemula:", warn: false },
  { text: "Melihat chart", warn: true },
  { text: "terlalu dekat”", warn: true },
];
const OUT_OVER = 96; // frames the pull-back takes
const BOX = {
  x: theme.stage.plot.x,
  y: theme.stage.plot.y + 30,
  w: theme.stage.plot.w,
  h: theme.stage.plot.h - 110,
};
const TAB = { x: theme.stage.card.x + 56, y: theme.stage.card.y + 54 };
const STRIP_DX = 130;
// ═══════════════════════════════════════════════════════════════════════════

const HL = TIMEFRAME.turns[TF_HIGHER_LOW];

export const Scene16 = () => {
  const f = useCurrentFrame();
  const card = fadeIn(f, T.card, 20);
  const out = f >= T.out ? progress(f, T.out, OUT_OVER) : 0;

  // the window the card is showing, opening from the five-minute view
  const a = interpolate(out, [0, 1], [TF_WINDOW[0], 0]);
  const b = interpolate(out, [0, 1], [TF_WINDOW[1], 1]);
  const p = plot(cut(TIMEFRAME, [a, b]), BOX, { pad: 0.14 });
  const draw = progress(f, T.card + 6, 30);
  const note = f >= NOTE.out.at ? fadeOut(f, NOTE.out.at, NOTE.out.over) : 1;

  // ── arriving on the rise CG-B left in flight ──
  const g = f + SCENE_FROM;
  const dy = cutIn(g, CUTS.toMistake);
  const blur = cutBlur(g, CUTS.toMistake);

  const hl = { x: p.x((HL.t - a) / Math.max(1e-6, b - a)), y: p.y(HL.p) };
  const highlight = {
    x1: p.x((TF_WINDOW[0] - a) / (b - a)),
    x2: p.x((TF_WINDOW[1] - a) / (b - a)),
  };

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: dy === 0 ? undefined : `translateY(${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {/* rides the camera cut in, like the first line beside it */}
        {note > 0.001 && (
          <Img
            src={staticFile(FIGURE.src)}
            style={{
              position: "absolute",
              left: FIGURE.x,
              top: FIGURE.y,
              width: FIGURE.h * FIGURE.aspect,
              height: FIGURE.h,
              opacity: note,
              translate: "118.6px -32.1px",
            }}
          />
        )}

        {note > 0.001 &&
          NOTE_LINES.map((l, i) => {
            /* The first line has no fade of its own: the camera cut IS its
             entrance, and a line that also faded in would leave the cut
             landing on an empty frame. */
            const rev =
              i === 0 ? { opacity: 1, dy: 0 } : textReveal(f, i * NOTE.stagger);
            return (
              <div
                key={l.text}
                style={{
                  position: "absolute",
                  left: NOTE.x,
                  top: NOTE.y + i * NOTE.lead,
                  transform: `translateY(calc(-50% + ${rev.dy}px))`,
                  fontFamily: theme.text.family,
                  fontSize: NOTE.size,
                  fontWeight: NOTE.weight,
                  color: l.warn ? theme.color.warn : theme.color.ink,
                  opacity: rev.opacity * note,
                  whiteSpace: "nowrap",
                }}
              >
                {/* right:100% sets the glyph's right edge on the line's left
                  edge, so the hang is exact without measuring the font */}
                {l.hang && (
                  <span style={{ position: "absolute", right: "100%" }}>
                    {l.hang}
                  </span>
                )}
                {l.text}
              </div>
            );
          })}

        <Card opacity={card}>
          {/* the highlight rectangle — only meaningful once we are outside it */}
          {out > 0.25 && (
            <Layer opacity={Math.min(1, (out - 0.25) / 0.35)}>
              <rect
                x={highlight.x1}
                y={BOX.y + 10}
                width={Math.max(0, highlight.x2 - highlight.x1)}
                height={BOX.h - 20}
                fill={theme.color.indigoWash}
                stroke={theme.color.indigo}
                strokeWidth={theme.shape.hairline}
                rx={10}
              />
            </Layer>
          )}

          <StructureLine plot={p} draw={draw} />

          {/* close up it looks like the end of something */}
          <Chip
            label="Akhir tren?"
            x={BOX.x + BOX.w * 0.5}
            y={BOX.y + 60}
            tone="slate"
            at={T.worry}
            opacity={f >= T.out ? fadeOut(f, T.out, 26) : 1}
          />

          {/* from further back it is a higher low inside a climb */}
          {out > 0.7 && (
            <PivotLabel
              x={hl.x}
              y={hl.y}
              label="Higher low"
              tone="cyan"
              side="below"
              at={T.higherLow}
            />
          )}
        </Card>

        {/* the tab the card is showing */}
        <Chip
          label="5M"
          x={TAB.x}
          y={TAB.y}
          tone="indigo"
          anchor="left"
          at={T.fiveMinute}
          opacity={f >= T.out ? fadeOut(f, T.out, 20) : 1}
        />
        <Chip
          label="1D"
          x={TAB.x}
          y={TAB.y}
          tone="indigo"
          anchor="left"
          at={T.out + 20}
          opacity={out}
        />

        {/* the habit, in sentence case, with the order it should be done in */}
        <Line
          text="Lihat timeframe besar lebih dulu."
          x={theme.canvas.width / 2 - STRIP_DX}
          y={theme.stage.caption.y}
          at={T.principle}
          anchor="right"
        />
        <Chip
          label="1D → 5M"
          x={theme.canvas.width / 2 + STRIP_DX}
          y={theme.stage.caption.y}
          tone="cyan"
          anchor="left"
          at={T.principle + 16}
        />
      </div>
    </Stage>
  );
};
