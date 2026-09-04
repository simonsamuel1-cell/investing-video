/**
 * CG-C · VERSION 2 — SC07 · SC08 · SC09 · SC10. `from 4954 · dur 3260`
 *
 * The same chapter as `CombosGroup`, told with a different instrument. Pick one
 * with `COMBOS_VERSION` in data/timing.ts; nothing else selects between them.
 *
 * ═══ WHAT IS DIFFERENT ═══
 *
 *   • the four combinations are a ROLLING LIST down the left, not a tab row
 *     across the top. Three items are visible at most, so the list says "one
 *     before, one after" without saying how many there are in total;
 *   • the reading is a QUOTE IN A DASHED BOX under the window, not a sentence
 *     typed beside it. It re-opens per combination rather than swapping its
 *     text inside a frame that never moves — the snap is the beat that says a
 *     new reading has arrived.
 *
 * ⚠ IT SHARES THE STAGE FRAMES WITH VERSION 1, `COMBO_TABS.select`. The two
 * builds must land on the same words; a version that drifts from the voice is
 * not a version of the same chapter.
 *
 * ⚠ THE CUT AT f6858 IS HARD, in both builds. SC08 → SC09 falls between
 * "posisi." and "Ketiga," — the chart changes on the word, and a transition on
 * a mid-word cut reads as a mistake.
 */
import { AbsoluteFill, useCurrentFrame, interpolate, interpolateColors } from "remotion";
import {
  Stage, Chart, VolumeBars, SourceTag, RollList, DashedBox, Words,
  cardPushed, dashOpenAt,
  gridOf, useMotion, usePalette, progressInOut, theme,
} from "../../../core";
import { BLOCK, COMBO_TABS, COMBOS, COMBOS_V2, TRANS, local } from "../data/timing";
import { TAG_Y } from "../data/layout";
import { COMBO, COMBO_DOMAIN } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC07;
/** ⚠ ONE ANCHOR PER STAGE, AND IT IS THE LIST'S OWN FRAME — the same table
 *  version 1 keys off, so the two builds cannot disagree about which
 *  combination owns a frame. */
const AT = COMBO_TABS.select.map((q) => local(q, FROM));
// ═══════════════════════════════════════════════════════════════════════════

const WIN = COMBOS_V2.win;
const BOX = COMBOS_V2.box;

const PRICE = { x: WIN.x + 40, y: WIN.y + 36, w: WIN.w - 80, h: WIN.h * 0.56 };
const VOLBOX = { x: PRICE.x, y: WIN.y + 36 + WIN.h * 0.62, w: PRICE.w, h: WIN.h * 0.24 };

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

export const CombosGroupV2 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  let k = -1;
  STAGES.forEach((s, i) => {
    if (f >= s.at) k = i;
  });

  /**
   * ⚠ THE WINDOW IS THE ROADMAP CARD GROWING, exactly as in version 1 — it
   * starts from the card's PUSHED rect, because CG-B leaves off with the camera
   * closed on that card. Starting from the raw slot makes the card shrink on
   * the hand-over frame before it grows.
   */
  const o = progressInOut(g, COMBOS.open.at, COMBOS.open.over);
  const from = cardPushed(TRANS.next, TRANS.push.amount);
  const box = {
    x: interpolate(o, [0, 1], [from.x, WIN.x]),
    y: interpolate(o, [0, 1], [from.y, WIN.y]),
    w: interpolate(o, [0, 1], [from.w, WIN.w]),
    h: interpolate(o, [0, 1], [from.h, WIN.h]),
  };
  const cur = k < 0 ? null : STAGES[k];
  const lines = k < 0 ? null : COMBOS_V2.rows[k];

  /** The dashed box re-opens per combination, on the beat version 1 gives its
   *  sentence — the reading follows the picture rather than arriving with it. */
  const quoteAt = cur ? cur.at + COMBOS.beats[1] : 0;

  return (
    <Stage transparent>
      {/* ⚠ THE PAGE ARRIVES WHITE AND COOLS TO THE EPISODE'S PAPER while the
          card grows — the chapter before this one is white to its edges. */}
      <AbsoluteFill
        style={{ backgroundColor: interpolateColors(o, [0, 1], [c.cardBg, theme.color.bg]) }}
      />

      {/* ── the four, rolling ──────────────────────────────────────────── */}
      <RollList
        items={COMBOS_V2.items.map(([harga, volume]) => [
          { text: harga, color: theme.color.ink },
          { text: volume, color: theme.color.warn },
        ])}
        select={AT}
        at={local(COMBO_TABS.at, FROM)}
        x={COMBOS_V2.list.x}
        y={COMBOS_V2.list.y}
        lead={COMBOS_V2.list.lead}
        size={COMBOS_V2.list.size}
        grow={COMBOS_V2.list.grow}
        dim={COMBOS_V2.list.dim}
        roll={COMBOS_V2.list.roll}
      />

      {/* ── the window, and the tape inside it ─────────────────────────── */}
      <div style={{ position: "absolute", inset: 0 }}>
        <div
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            borderRadius: theme.shape.panelRadius,
            background: c.cardBg,
            border: `${theme.shape.hairline}px solid ${c.border}`,
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
            <VolumeBars
              key={`vol-${k}`}
              bars={cur.combo.series.bars}
              volume={cur.combo.vol}
              grid={cur.grid}
              box={VOLBOX}
            />
          </>
        )}
      </div>

      {/* ── the reading ────────────────────────────────────────────────── */}
      {lines && (
        <DashedBox key={`box-${k}`} x={BOX.x} y={BOX.y} w={BOX.w} h={BOX.h} at={quoteAt}>
          {lines.map((line, n) => (
            <Words
              key={n}
              text={line}
              x={BOX.w / 2}
              y={BOX.h / 2 + (n - (lines.length - 1) / 2) * COMBOS_V2.quote.lead}
              at={dashOpenAt(quoteAt) + n * 6}
              stagger={4}
              anchor="center"
              size={COMBOS_V2.quote.size}
              weight={COMBOS_V2.quote.weight}
            />
          ))}
        </DashedBox>
      )}

      {cur && <SourceTag kind={cur.combo.series.kind} y={TAG_Y} />}
    </Stage>
  );
};
