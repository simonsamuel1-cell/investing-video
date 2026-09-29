/**
 * TechnicalTabs — the app's Technical tab, five screens, where GGRM's chart was.
 *
 * Simon: "8321-8759 Ganti visual chart nya dengan 5 png images di dalam file
 * directory tadi. chartnya aja ya yang diganti, judulnya stay. text box juga
 * stay." The five are his captures from `VIDEO 20 - Moving Average/Technical
 * Tab/` (Tab-01 … Tab-05), staged in public/technical-tab/ at 1600px wide.
 *
 * ONE SCREEN AT A TIME, IN A ROW. They are consecutive screens of one tab, so
 * they sit side by side and the row steps along them: the one being shown is
 * full size, its neighbours stand back smaller and paler, and each step is a
 * single eased move — like swiping, never a swap.
 *
 * ⚠ ONE WIDTH FOR ALL FIVE. They are captures of the same phone, so the app's
 * type is the same size in each only if they share a width; the tallest fills
 * the height it is given and the rest are simply shorter.
 *
 * ⚠ CLEAR OF THE QUOTE BOX. It straddles the old panel's lower border from 8502
 * (QUOTE_LINE in GgrmGroup), so the screens end above it, not behind it.
 */
import { Img, interpolate, staticFile } from "remotion";
import { theme } from "../theme";
import { progress } from "../helpers";

const C = theme.colors;
const W = theme.layout.width;

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const TABS = [
  { src: "technical-tab/tab-01.png", h: 2300 },
  { src: "technical-tab/tab-02.png", h: 2300 },
  { src: "technical-tab/tab-03.png", h: 1848 },
  { src: "technical-tab/tab-04.png", h: 964 },
  { src: "technical-tab/tab-05.png", h: 1981 },
];
const SRC_W = 1600;
/** Where the screens may be: under the heading, above the quote box. */
const REGION = { x: 96, w: 1728, top: 160, bottom: 780 };
/** Every screen's width — the tallest exactly fills REGION's height. */
const SCREEN_W =
  ((REGION.bottom - REGION.top) * SRC_W) / Math.max(...TABS.map((t) => t.h));
/** Centre to centre, and how far a neighbour stands back. */
const SPACING = 520;
const SIDE = { scale: 0.86, opacity: 0.45 };
/** Frames the row takes to come up, and to take one step. */
const ENTER = 16;
const STEP = 24;
/** The row's edges fade rather than cut off a passing screen. */
const EDGE = 90;
// ═══════════════════════════════════════════════════════════════════════════

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const TechnicalTabs = ({
  f,
  at,
  steps,
}: {
  /** The group's own frame. */
  f: number;
  /** Frame the screens replace the chart. */
  at: number;
  /** Frames the row moves on to the next screen — one fewer than TABS. */
  steps: number[];
}) => {
  if (f < at) return null;
  const enter = progress(f, at, ENTER);
  /** Which screen is centred — fractional while the row is moving. */
  const shown = steps.reduce(
    (s, step) =>
      s +
      interpolate(f, [step, step + STEP], [0, 1], {
        ...CLAMP,
        easing: theme.motion.easeInOut,
      }),
    0,
  );
  const cy = (REGION.top + REGION.bottom) / 2;
  const fade = `linear-gradient(to right, transparent 0, black ${EDGE}px, black ${REGION.w - EDGE}px, transparent ${REGION.w}px)`;

  return (
    <div
      style={{
        position: "absolute",
        left: REGION.x,
        top: 0,
        width: REGION.w,
        height: theme.layout.height,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px)`,
        maskImage: fade,
        WebkitMaskImage: fade,
      }}
    >
      {TABS.map((tab, i) => {
        const d = Math.min(1, Math.abs(i - shown));
        if (Math.abs(i - shown) > 2.2) return null;
        const scale = 1 - (1 - SIDE.scale) * d;
        const h = (SCREEN_W * tab.h) / SRC_W;
        const x = W / 2 - REGION.x + (i - shown) * SPACING;
        return (
          <div
            key={tab.src}
            style={{
              position: "absolute",
              left: x - SCREEN_W / 2,
              top: cy - h / 2,
              width: SCREEN_W,
              height: h,
              transform: `scale(${scale.toFixed(4)})`,
              opacity: 1 - (1 - SIDE.opacity) * d,
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
    </div>
  );
};
