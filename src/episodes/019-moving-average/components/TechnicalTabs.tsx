/**
 * TechnicalTabs — the app's Technical tab, five screens, where GGRM's chart was.
 *
 * Simon: "8321-8759 Ganti visual chart nya dengan 5 png images di dalam file
 * directory tadi. chartnya aja ya yang diganti, judulnya stay. text box juga
 * stay." The five are his captures from `VIDEO 20 - Moving Average/Technical
 * Tab/` (Tab-01 … Tab-05), staged in public/technical-tab/ at 1600px wide.
 *
 * ALL FIVE AT ONCE — "Jangan disusun satu baris dan buat selection style gitu
 * deh, bikin semua masuk dalam satu layar aja, gapapa overlap dengan text
 * box". Four columns, top-aligned, spanning the old panel's width exactly —
 * and then: "Tab-01 dan Tab-02 ada di tengah; Tab-03 dan Tab-04 di kiri 01 dan
 * 02; Tab-05 di kanan 01 dan 02." So the two chart screens are the middle
 * pair, the summary stands on the short support-and-resistance card to their
 * left, and the indicator table is on their right. They come up in the tabs'
 * own order, the middle pair first.
 *
 * ⚠ ONE WIDTH FOR ALL FIVE. They are captures of the same phone, so the app's
 * type is the same size in each only if they share a width.
 */
import { Img, staticFile } from "remotion";
import { theme } from "../theme";
import { progress } from "../helpers";

const C = theme.colors;

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SRC_W = 1600;
/** The old panel's span, and the top of the screens under the heading. */
const AREA = { x: 96, w: 1728, top: 160 };
const GAP = 24;
/** Left to right; a column holds one screen or, in the first, two. */
const COLUMNS = [
  [
    { src: "technical-tab/tab-03.png", h: 1848 },
    { src: "technical-tab/tab-04.png", h: 964 },
  ],
  [{ src: "technical-tab/tab-01.png", h: 2300 }],
  [{ src: "technical-tab/tab-02.png", h: 2300 }],
  [{ src: "technical-tab/tab-05.png", h: 1981 }],
];
/** Each screen's width: four columns and their gaps fill AREA.w. */
const SCREEN_W = (AREA.w - GAP * (COLUMNS.length - 1)) / COLUMNS.length;
/** Frames each screen takes to come up, and between one screen and the next. */
const ENTER = 16;
const STAGGER = 5;
const RISE = 24;
// ═══════════════════════════════════════════════════════════════════════════

/** Every screen with its place, in the tabs' own order (by file name). */
const PLACED = COLUMNS.flatMap((col, c) => {
  let y = AREA.top;
  return col.map((tab) => {
    const h = (SCREEN_W * tab.h) / SRC_W;
    const at = { ...tab, x: AREA.x + c * (SCREEN_W + GAP), y, h };
    y += h + GAP;
    return at;
  });
}).sort((a, b) => a.src.localeCompare(b.src));

export const TechnicalTabs = ({
  f,
  at,
}: {
  /** The group's own frame. */
  f: number;
  /** Frame the screens replace the chart. */
  at: number;
}) => {
  if (f < at) return null;
  return (
    <>
      {PLACED.map((tab, i) => {
        const on = progress(f, at + i * STAGGER, ENTER);
        if (on <= 0.001) return null;
        return (
          <div
            key={tab.src}
            style={{
              position: "absolute",
              left: tab.x,
              top: tab.y,
              width: SCREEN_W,
              height: tab.h,
              opacity: on,
              transform: `translateY(${((1 - on) * RISE).toFixed(2)}px)`,
              borderRadius: theme.layout.radius.sm,
              border: `${theme.layout.border.thin}px solid ${C.border}`,
              overflow: "hidden",
              background: C.surface,
            }}
          >
            <Img
              src={staticFile(tab.src)}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
        );
      })}
    </>
  );
};
