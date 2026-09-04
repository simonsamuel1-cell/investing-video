/**
 * CG-C · VERSION 3 — SC07 · SC08 · SC09 · SC10. `from 4954 · dur 3260`
 *
 * The board. Pick it with `COMBOS_VERSION` in data/timing.ts.
 *
 * ═══ WHAT IT IS ═══
 *
 * One panel holding the whole chapter: a rail of four buttons down the left
 * with a single highlight that TRAVELS between them, and on the right the
 * picture with its reading underneath.
 *
 * ⚠ IT SHOWS ALL FOUR AT ONCE, WHICH IS THE OPPOSITE OF VERSION 2. The roll
 * hides how many there are and reveals them one at a time; the board says up
 * front "there are four of these, we are on the second". Neither is better in
 * the abstract — they answer different questions, which is why both exist.
 *
 * ⚠ IT SHARES THE STAGE FRAMES WITH VERSIONS 1 AND 2, `COMBO_TABS.select`, and
 * reads the same labels and readings out of `COMBOS_V2`. The words belong to
 * the chapter, not to a version of it.
 */
import { AbsoluteFill, useCurrentFrame, interpolate, interpolateColors } from "remotion";
import {
  Stage, Chart, VolumeBars, SourceTag, PickRail, DashedBox, Words,
  cardPushed, dashOpenAt,
  gridOf, useMotion, usePalette, progress, progressInOut, theme,
} from "../../../core";
import { BLOCK, COMBO_TABS, COMBOS, COMBOS_V2, COMBOS_V3, TRANS, local } from "../data/timing";
import { TAG_Y } from "../data/layout";
import { COMBO, COMBO_DOMAIN } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC07;
const AT = COMBO_TABS.select.map((q) => local(q, FROM));
// ═══════════════════════════════════════════════════════════════════════════

const RAIL = COMBOS_V3.rail;
const WIN = COMBOS_V3.win;
const BOX = COMBOS_V3.box;

/**
 * ⚠ THE BOARD IS COMPUTED FROM WHAT IS ON IT. Simon asked for 15px between the
 * contents and the board's edge; typing a rect that happens to be 15 away today
 * means the gap silently becomes something else the next time a row grows.
 */
const RAIL_BOTTOM = RAIL.y + 4 * RAIL.h + 3 * RAIL.gap;
/**
 * ⚠ THE READING BOX IS NOT IN THESE BOUNDS, ON PURPOSE — Simon's call. It
 * stands BELOW the board, centred on the canvas rather than on the board, which
 * is itself off-centre because the rail is only on one side. Put the box back
 * in and the board grows to swallow it, and the height comes straight out of
 * the tape.
 */
const EDGE = {
  left: RAIL.x,
  top: Math.min(RAIL.y, WIN.y),
  right: WIN.x + WIN.w,
  /* ⚠ THE TAIL IS THE RAIL'S, NOT THE WINDOW'S. It exists so the board does not
     stop dead under the last button; the chart is allowed to run into it, and
     adding it on top of the window would push the board down by 50 for nothing. */
  bottom: Math.max(RAIL_BOTTOM + COMBOS_V3.tail, WIN.y + WIN.h),
};
/** ⚠ THE BOX MUST CLEAR THE SUBTITLE BAND, shadow included. The band is left
 *  empty in every episode; a reading that dips into it collides with burned-in
 *  type that is not in this render. */
if (COMBOS_V3.box.y + COMBOS_V3.box.h + COMBOS_V3.shadow.y > theme.captionBand.top) {
  throw new Error("CG-C v3: the reading box enters the subtitle band");
}
const BOARD = {
  x: EDGE.left - COMBOS_V3.pad,
  y: EDGE.top - COMBOS_V3.pad,
  w: EDGE.right - EDGE.left + COMBOS_V3.pad * 2,
  h: EDGE.bottom - EDGE.top + COMBOS_V3.pad * 2,
};

const PRICE = { x: WIN.x + 40, y: WIN.y + 32, w: WIN.w - 80, h: WIN.h * 0.52 };
const VOLBOX = { x: PRICE.x, y: WIN.y + 32 + WIN.h * 0.58, w: PRICE.w, h: WIN.h * 0.30 };

/** ⚠ ONE GRID PER COMBINATION. The four no longer share two tapes, so they
 *  cannot share two scales — a shared domain would draw one of them against
 *  another's high and low. */
const GRID = {
  upUp: gridOf(COMBO.upUp.series.closes, COMBO_DOMAIN.upUp, PRICE, 0.12, 0),
  upDown: gridOf(COMBO.upDown.series.closes, COMBO_DOMAIN.upDown, PRICE, 0.12, 0),
  downUp: gridOf(COMBO.downUp.series.closes, COMBO_DOMAIN.downUp, PRICE, 0.12, 0),
  downDown: gridOf(COMBO.downDown.series.closes, COMBO_DOMAIN.downDown, PRICE, 0.12, 0),
};

const STAGES = [
  { at: AT[0], combo: COMBO.upUp, grid: GRID.upUp },
  { at: AT[1], combo: COMBO.upDown, grid: GRID.upDown },
  { at: AT[2], combo: COMBO.downUp, grid: GRID.downUp },
  { at: AT[3], combo: COMBO.downDown, grid: GRID.downDown },
];

/**
 * The rows. Two lines each — price above, volume below — coloured the way Simon
 * set them: the price line in ink, the volume line in the palette's one red for
 * WORDS (`warn`, never `candleRed`, which belongs to candle bodies).
 */
const ROWS = COMBOS_V2.items.map(([harga, volume], i) => ({
  dot: COMBOS_V3.dots[i],
  lines: [
    { text: harga.trim(), color: theme.color.ink },
    { text: volume, color: theme.color.warn },
  ],
}));

/** How long the outgoing reading takes to leave, in frames. */
const SWAP = 12;

/**
 * One reading inside the box. ⚠ ONE LINE, AND NO `maxWidth` — Simon's call for
 * this version. A maxWidth would let a long reading wrap and quietly become two
 * lines in a box built for one; without it the size is the only thing holding
 * the promise, which is why COMBOS_V3.quote.size is measured off the longest
 * row rather than picked.
 */
const Reading = ({
  text, at, mark, markAt,
}: { text: string; at: number; mark: string | null; markAt?: number }) => (
  <Words
    text={text}
    x={BOX.w / 2}
    y={BOX.h / 2}
    at={at}
    stagger={4}
    anchor="center"
    size={COMBOS_V3.quote.size}
    weight={COMBOS_V3.quote.weight}
    marks={mark ? [{ text: mark, color: theme.color.hlCyan }] : undefined}
    markAt={markAt}
  />
);

export const CombosGroupV3 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  let k = -1;
  STAGES.forEach((s, i) => {
    if (f >= s.at) k = i;
  });

  /**
   * ⚠ THE WINDOW IS STILL THE ROADMAP CARD GROWING, from the card's PUSHED
   * rect — CG-B leaves off with the camera closed on that card, and starting
   * from the raw slot makes it shrink on the hand-over frame before it grows.
   */
  const o = progressInOut(g, COMBOS.open.at, COMBOS.open.over);
  const from = cardPushed(TRANS.next, TRANS.push.amount);
  const win = {
    x: interpolate(o, [0, 1], [from.x, WIN.x]),
    y: interpolate(o, [0, 1], [from.y, WIN.y]),
    w: interpolate(o, [0, 1], [from.w, WIN.w]),
    h: interpolate(o, [0, 1], [from.h, WIN.h]),
  };
  const cur = k < 0 ? null : STAGES[k];
  const lines = k < 0 ? null : COMBOS_V2.rows[k];
  const quoteAt = cur ? cur.at + COMBOS.beats[1] : 0;
  /**
   * ⚠ THE BOX OPENS ONCE AND STAYS — Simon's call. It used to be keyed on the
   * combination, so it snapped shut and re-opened four times; now the frame is
   * continuous from the first reading to the last and only the WORDS change.
   * That is why the box's own frame is the FIRST stage's, not the current one.
   */
  const boxAt = AT[0] + COMBOS.beats[1];
  /**
   * ⚠ THE HISTOGRAM TWEENS BETWEEN COMBINATIONS, THE CANDLES DO NOT. Simon
   * asked for the bars to travel to the next combination's heights, and the
   * two arrays are the same length by construction (asserted in data/series).
   * The candles still change on the word, because that cut is hard by
   * instruction — a tape that morphs would be one stock becoming another.
   */
  const vol = (() => {
    if (k < 0) return [];
    const now = STAGES[k].combo.vol;
    if (k === 0) return now;
    const was = STAGES[k - 1].combo.vol;
    const t = progress(f, STAGES[k].at, RAIL.move);
    return now.map((v, i) => was[i] + (v - was[i]) * t);
  })();
  /** The outgoing reading, fading out as the incoming one lands. Without it the
   *  old words vanish on a single frame while the new ones ease in, and the
   *  swap reads as a glitch on one side and a fade on the other. */
  const gone = k > 0 ? 1 - progress(f, quoteAt - SWAP, SWAP) : 0;
  const before = k > 0 ? COMBOS_V2.rows[k - 1] : null;
  const beforeAt = k > 0 ? STAGES[k - 1].at + COMBOS.beats[1] : 0;

  return (
    <Stage transparent>
      <AbsoluteFill
        style={{ backgroundColor: interpolateColors(o, [0, 1], [c.cardBg, theme.color.bg]) }}
      />

      {/* ⚠ THE BOARD IS WHITE AND THE PICKED ROW IS GREY — Simon's call, and
          the reverse of what the tint did. On a white board the only thing that
          carries a fill is the selection, so the fill means "this one" and
          nothing else has to explain itself. */}
      <div
        style={{
          position: "absolute",
          left: BOARD.x,
          top: BOARD.y,
          width: BOARD.w,
          height: BOARD.h,
          borderRadius: 28,
          background: c.cardBg,
          opacity: o,
        }}
      />

      <PickRail
        rows={ROWS}
        select={AT}
        at={local(COMBO_TABS.at, FROM)}
        x={RAIL.x}
        y={RAIL.y}
        w={RAIL.w}
        h={RAIL.h}
        gap={RAIL.gap}
        radius={RAIL.radius}
        size={RAIL.size}
        lead={RAIL.lead}
        weight={700}
        weightOff={400}
        move={RAIL.move}
        stepIn={RAIL.stepIn}
        pad={RAIL.pad}
        dotSize={RAIL.dotSize}
        dotGap={RAIL.dotGap}
        fill={theme.color.greyWash}
      />

      {/* ── the window, and the tape inside it ─────────────────────────── */}
      <div style={{ position: "absolute", inset: 0 }}>
        <div
          style={{
            position: "absolute",
            left: win.x,
            top: win.y,
            width: win.w,
            height: win.h,
            borderRadius: theme.shape.panelRadius,
            background: c.cardBg,
          }}
        />
        {cur && (
          <>
            <Chart
              key={`chart-${k}`}
              series={cur.combo.series}
              grid={cur.grid}
              at={cur.at}
              over={m.sec(1.2)}
              tickLabels={false}
            />
            {/* ⚠ NOT KEYED ON THE STAGE. Remounting it per combination would
                throw away the very tween the heights are being given. */}
            <VolumeBars
              bars={cur.combo.series.bars}
              volume={vol}
              grid={cur.grid}
              box={VOLBOX}
            />
          </>
        )}
      </div>

      {/* ── the reading ────────────────────────────────────────────────── */}
      {k >= 0 && (
        /* ⚠ SOLID RULE, NO CORNER BLOCKS, AND A STAMPED SHADOW. The blocks
           exist to give a DASH rhythm somewhere to start and stop; on an
           unbroken frame they are leftovers. The shadow has no blur on
           purpose — a blurred one would say the box is floating, and this one
           is printed. */
        <DashedBox
          x={BOX.x}
          y={BOX.y}
          w={BOX.w}
          h={BOX.h}
          at={boxAt}
          solid
          blocks={false}
          shadow={{ ...COMBOS_V3.shadow, color: theme.color.indigo }}
        >
          {before && gone > 0.001 ? (
            <div style={{ position: "absolute", inset: 0, opacity: gone }}>
              <Reading key={`out-${k}`} text={before.join(" ")} at={beforeAt} mark={null} />
            </div>
          ) : null}
          {lines && (
            <Reading
              key={`in-${k}`}
              text={lines.join(" ")}
              at={dashOpenAt(Math.max(boxAt, quoteAt))}
              mark={COMBOS_V2.marks[k]}
              markAt={cur ? cur.at + COMBOS.beats[2] : 0}
            />
          )}
        </DashedBox>
      )}

      {cur && <SourceTag kind={cur.combo.series.kind} y={TAG_Y} />}
    </Stage>
  );
};
