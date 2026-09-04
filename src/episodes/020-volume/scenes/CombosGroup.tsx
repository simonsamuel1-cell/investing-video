/**
 * CG-C — SC07 · SC08 · SC09 · SC10. `from 4894 · dur 3260`
 *
 * ═══ THE TABLE IS THE REASON THIS IS ONE GROUP ═══
 *
 * The script asks for a KEY POINT card summarising the four combinations, to
 * sit between SC10 and SC11. There is NO SILENCE THERE — not 0.3s, none: the
 * cut at f8154 falls mid-sentence, between "sudah datang." and "Nah,". The card
 * cannot exist.
 *
 * So the recap is not a card. One row lands per scene, while that scene is
 * being narrated, and by f8154 the table is already complete and simply holds
 * under the CHAPTER 03 overlay. Same information, no extra runtime — and the
 * viewer watches it being built instead of being handed a finished list.
 *
 * ⚠ THAT ONLY WORKS IF THE TABLE IS MOUNTED ONCE, ACROSS ALL FOUR. Rebuilding
 * it per scene restarts every row's entrance and the argument is gone while the
 * picture still looks right. Hence the group.
 *
 * ⚠ THE CUT AT f6798 IS INSIDE THIS GROUP AND IS A HARD CUT. SC08 → SC09 falls
 * between "posisi." and "Ketiga," — the chart simply changes on the word. No
 * wipe, no fade: a transition on a mid-word cut reads as a mistake.
 */
import { AbsoluteFill, useCurrentFrame, interpolate, interpolateColors } from "remotion";
import {
  Stage, Chart, VolumeBars, SourceTag, TabRow, Words,
  cardPushed,
  gridOf, useMotion, usePalette, progressInOut, theme,
} from "../../../core";
import { BLOCK, COMBO_TABS, COMBOS, TRANS, local } from "../data/timing";
import { TAG_Y } from "../data/layout";
import { COMBO, COMBO_DOMAIN } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC07;
/**
 * ⚠ A STAGE TURNS OVER WHEN ITS TAB LIGHTS, NOT WHEN ITS WORD IS SPOKEN.
 * These used to read BEAT.first/second/third/fourth, which sit 20, 13, -7 and
 * 10 frames away from `COMBO_TABS.select` — so the tab lit and the chart behind
 * it changed a third of a second later, and Simon's own frames for the first
 * combination (5438 / 5621 / 5781, given as 4 / 187 / 347 after the tab) all
 * landed 20 frames late. One anchor per stage, and it is the tab.
 */
const T = {
  first: local(COMBO_TABS.select[0], FROM),
  second: local(COMBO_TABS.select[1], FROM),
  third: local(COMBO_TABS.select[2], FROM),
  fourth: local(COMBO_TABS.select[3], FROM),
};
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE WINDOW STAYS ON THE LEFT FOR ALL FOUR — Simon's call. It used to trade
 * sides for the falling pair; four combinations read as one list, and a list
 * whose two halves change places halfway through makes the viewer re-find the
 * chart instead of comparing it with the one before.
 */
const WIN = COMBOS.win;
/** The title is centre-anchored on one line; the sentence hangs `gap` below its
 *  bottom edge, so the spacing survives a row that wraps to three lines. */
const TITLE_Y = COMBOS.win.y + 150;
const BODY_Y = TITLE_Y + (COMBOS.text.title * 1.3) / 2 + COMBOS.text.gap;

const PRICE = { x: WIN.x + 40, y: WIN.y + 40, w: WIN.w - 80, h: WIN.h * 0.58 };
const VOLBOX = { x: PRICE.x, y: WIN.y + 40 + WIN.h * 0.64, w: PRICE.w, h: WIN.h * 0.22 };

/** ⚠ ONE GRID PER COMBINATION. The four no longer share two tapes, so they
 *  cannot share two scales — a shared domain would draw one of them against
 *  another's high and low. */
const GRID = {
  upUp: gridOf(COMBO.upUp.series.closes, COMBO_DOMAIN.upUp, PRICE, 0.12, 0),
  upDown: gridOf(COMBO.upDown.series.closes, COMBO_DOMAIN.upDown, PRICE, 0.12, 0),
  downUp: gridOf(COMBO.downUp.series.closes, COMBO_DOMAIN.downUp, PRICE, 0.12, 0),
  downDown: gridOf(COMBO.downDown.series.closes, COMBO_DOMAIN.downDown, PRICE, 0.12, 0),
};

/** Which combination owns the frame, by the word that introduces it. */
const STAGES = [
  { at: T.first, combo: COMBO.upUp, grid: GRID.upUp },
  { at: T.second, combo: COMBO.upDown, grid: GRID.upDown },
  { at: T.third, combo: COMBO.downUp, grid: GRID.downUp },
  { at: T.fourth, combo: COMBO.downDown, grid: GRID.downDown },
];

export const CombosGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  /* the last stage whose word has been spoken */
  let k = -1;
  STAGES.forEach((s, i) => {
    if (f >= s.at) k = i;
  });

  /**
   * ⚠ THE WINDOW IS THE ROADMAP CARD GROWING. It starts at "cara baca volume"'s
   * own slot and opens into its place — the card is not replaced by a window,
   * it becomes one.
   */
  const o = progressInOut(g, COMBOS.open.at, COMBOS.open.over);
  /**
   * ⚠ IT STARTS FROM THE CARD'S PUSHED RECT, NOT ITS SLOT. CG-B leaves off with
   * the camera closed on this card — 1.55x and carried to the middle of the
   * frame — so starting the growth from the slot made the card SHRINK on the
   * hand-over frame before growing again. `cardPushed` is the same maths the
   * push itself uses, so the two frames cannot disagree.
   */
  const from = cardPushed(TRANS.next, TRANS.push.amount);
  const box = {
    x: interpolate(o, [0, 1], [from.x, WIN.x]),
    y: interpolate(o, [0, 1], [from.y, WIN.y]),
    w: interpolate(o, [0, 1], [from.w, WIN.w]),
    h: interpolate(o, [0, 1], [from.h, WIN.h]),
  };
  const row = k < 0 ? null : COMBOS.rows[k];
  const cur = k < 0 ? null : STAGES[k];

  return (
    <Stage transparent>
      {/* ⚠ THE PAGE ARRIVES WHITE AND COOLS TO THE EPISODE'S PAPER while the
          card grows. The chapter before this one is white to its edges, so
          cutting straight to #F5F5F5 on the hand-over frame flipped the whole
          background a shade — the card matched and the page did not. */}
      <AbsoluteFill
        style={{ backgroundColor: interpolateColors(o, [0, 1], [c.cardBg, theme.color.bg]) }}
      />
      {/* ⚠ ONE ROW, ALWAYS ON, ONE OF THEM CURRENT — it replaces the chapter
          card that used to name the four combinations. A card says it once and
          leaves; the row keeps saying which of the four you are looking at. */}
      <TabRow
        tabs={[...COMBO_TABS.labels]}
        select={COMBO_TABS.select.map((q) => local(q, FROM))}
        x={theme.margin.left}
        y={COMBO_TABS.y}
        at={local(COMBO_TABS.at, FROM)}
        size={COMBO_TABS.size}
        lift={COMBO_TABS.lift}
        gap={COMBO_TABS.gap}
        stepIn={COMBO_TABS.stepIn}
        anchor="left"
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
            {/* ⚠ KEYED ON THE STAGE. At f6858 the chart changes on the word,
                with nothing between the two pictures — that cut is hard by
                instruction and because the sentence runs straight through it. */}
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

      {/* ── the reading, typed out beside it ───────────────────────────── */}
      {row && cur && (
        <div style={{ position: "absolute", inset: 0 }}>
          <Words
            key={`t-${k}`}
            text={row.title}
            x={COMBOS.text.x}
            y={TITLE_Y}
            at={cur.at + COMBOS.beats[0]}
            stagger={5}
            anchor="left"
            size={COMBOS.text.title}
            weight={400}
            family={theme.text.mono}
            color={theme.color.indigo}
            maxWidth={COMBOS.text.w}
          />
          {/* ⚠ THE SENTENCE ARRIVES WHOLE, AND IS SELECTED LATER. It lands on
              the second beat; on the third a cursor drags across the reason —
              the point is made about words the viewer has already read, which
              is why the mark carries its own frame rather than arriving with
              the words it covers.

              ⚠ THE SENTENCE SITS AT 500 AND THE MARKED RUN THICKENS TO 800.
              The weight change is the point being made — before the drag the
              whole sentence is one even tone, and afterwards the reason is the
              only heavy thing in it. */}
          <Words
            key={`l-${k}`}
            text={row.text}
            x={COMBOS.text.x}
            y={BODY_Y}
            vAlign="top"
            at={cur.at + COMBOS.beats[1]}
            stagger={5}
            anchor="left"
            size={COMBOS.text.body}
            weight={500}
            lineHeight={COMBOS.text.lead / COMBOS.text.body}
            maxWidth={COMBOS.text.w}
            marks={[{ text: row.mark, color: theme.color.selectWash }]}
            markAt={cur.at + COMBOS.beats[2]}
            markStyle="selection"
            markWeight={800}
          />
        </div>
      )}

      {cur && <SourceTag kind={cur.combo.series.kind} y={TAG_Y} />}
    </Stage>
  );
};
