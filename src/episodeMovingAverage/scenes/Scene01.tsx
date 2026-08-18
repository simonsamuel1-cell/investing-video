/**
 * SC01 — Indicators as a filter, not a replacement (from 0, dur 659).
 *
 * THE ARGUMENT IS THE COUNTER, not the words. A cursor opens four stocks one at
 * a time and the counter crawls to 4 / 847; then two indicator columns arrive
 * and it flips to 847 / 847 in ONE CUT, with no count-up. The gap between those
 * two readings is the whole scene, and it is made of time rather than claims.
 *
 * The counter chip sits top-LEFT. The top-right 360 x 150 belongs to the logo
 * and nothing may enter it.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { ScreenerTable, SCREENER_ROWS, HEAD_H, ROW_H } from "../components/ScreenerTable";
import { Panel } from "../components/Panels";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeOut, textReveal, sec } from "../helpers";
import { CUTS, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 0;
/** Beats, in seconds from this scene's own start — see the ideation. */
const T = {
  step: sec(0.4), // the cursor starts working
  freeze: sec(9.6), // four rows checked, and the table steps back
  indicators: sec(10.5), // "indikator membantu kita bekerja lebih cepat"
  columns: sec(12.0),
  flip: sec(14.2), // the counter flips in one cut — no count-up
  filter: sec(16.5), // rows that fail the filter leave
  caption: sec(18.2),
};
/** One row inspected per this many frames, four in all. */
const STEP = sec(1.6);
const ROWS_CHECKED = 4;
const TOTAL_STOCKS = 847;
/** Table top clears the logo zone; bottom leaves room for the caption card. */
const TABLE = { x: theme.stage.active.x, y: 120, w: theme.stage.active.w, h: HEAD_H + ROW_H * SCREENER_ROWS.length };
const POPOVER = { w: 320, h: 180 };
/** Rows the indicator filter keeps, and the ones it drops. */
const KEEP = [0, 3, 6];
const DROP = [1, 2, 4, 5, 7];
const CAPTION = { y: 828, h: 128 };
// ═══════════════════════════════════════════════════════════════════════════

export const Scene01 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;

  /** Which row the cursor is on, and whether its popover is open. */
  const stepIndex = Math.floor((f - T.step) / STEP);
  const onRow = f >= T.step && stepIndex >= 0 && stepIndex < ROWS_CHECKED ? stepIndex : null;
  const inStep = f >= T.step ? (f - T.step) % STEP : 0;
  const popOpen = onRow !== null && inStep > sec(0.2) && inStep < sec(1.2);
  const checked = Math.min(ROWS_CHECKED, Math.max(0, Math.floor((f - T.step) / STEP) + (inStep > sec(1.2) ? 1 : 0)));

  const dim = f >= T.freeze ? 1 - progress(f, T.freeze, 10) * 0.65 : 1;
  const flipped = f >= T.flip;
  const cap = textReveal(f, T.caption);

  const dy = cutOut(g, CUTS.toAverage);
  const blur = cutBlur(g, CUTS.toAverage);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {/* the count, top-LEFT — the logo owns the other corner */}
        <Chip
          label={flipped ? `${TOTAL_STOCKS} / ${TOTAL_STOCKS}` : `Dicek: ${checked} / ${TOTAL_STOCKS}`}
          x={TABLE.x}
          y={72}
          tone={flipped ? "indigo" : "slate"}
          anchor="left"
          at={0}
          pill
        />

        <div style={{ opacity: dim }}>
          <ScreenerTable
            rect={TABLE}
            f={f}
            cursorRow={onRow}
            extraColumns={f >= T.columns}
            extraAt={T.columns}
            dimRows={f >= T.filter ? DROP : []}
            keepRows={f >= T.filter ? KEEP : []}
          />
        </div>

        {/* the popover — a UI element, so it may pop */}
        {popOpen && onRow !== null && (
          <Panel
            rect={{
              x: TABLE.x + TABLE.w - POPOVER.w - 40,
              y: TABLE.y + HEAD_H + onRow * ROW_H - POPOVER.h / 2 + ROW_H / 2,
              w: POPOVER.w,
              h: POPOVER.h,
            }}
            opacity={progress(f, T.step + onRow * STEP + sec(0.2), theme.motion.pop)}
          />
        )}

        {/* what the columns are: the word, before the columns themselves */}
        {f >= T.indicators && (
          <div
            style={{
              position: "absolute",
              left: TABLE.x,
              top: 72 + textReveal(f, T.indicators).dy,
              fontFamily: theme.text.family,
              fontSize: theme.text.h1.size,
              fontWeight: theme.text.h1.weight,
              color: theme.color.indigo,
              opacity: textReveal(f, T.indicators).opacity * (f >= T.columns ? fadeOut(f, T.columns, 10) : 1),
              transform: "translateY(-50%)",
            }}
          >
            Indikator
          </div>
        )}

        {/* the conclusion, under the table it is about */}
        {f >= T.caption && (
          <Panel
            rect={{ x: TABLE.x, y: CAPTION.y + cap.dy, w: TABLE.w, h: CAPTION.h }}
            opacity={cap.opacity}
            radius={theme.shape.cardRadius}
          >
            <div
              style={{
                position: "absolute",
                left: TABLE.x + 32,
                top: CAPTION.y + 30 + cap.dy,
                fontFamily: theme.text.family,
                fontSize: theme.text.title.size,
                fontWeight: theme.text.title.weight,
                color: theme.color.ink,
                opacity: cap.opacity,
              }}
            >
              Menyaring, bukan menggantikan.
            </div>
            <div
              style={{
                position: "absolute",
                left: TABLE.x + 32,
                top: CAPTION.y + 30 + theme.text.title.size + 14 + cap.dy,
                fontFamily: theme.text.family,
                fontSize: theme.text.tag.size,
                fontWeight: theme.text.body.weight,
                color: theme.color.slate,
                opacity: cap.opacity,
              }}
            >
              Indikator hanya mengolah data harga yang sudah ada.
            </div>
          </Panel>
        )}
      </div>
    </Stage>
  );
};
