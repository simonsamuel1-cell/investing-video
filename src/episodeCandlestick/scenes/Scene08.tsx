/**
 * Scene08 — from 3657, duration 501 frames (16.7s).
 * Pattern-card shelf: 12-card loop auto-scrolls left, decelerates to a stop,
 * the four studied cards shuffle to display positions (354/774/1194/1614),
 * non-studied cards dim while the four lift, names fade out, then each studied
 * glyph gains its faint intraday path line with a stagger.
 * No price chart → NO IllustrationTag, NO Ticker.
 * Compliance: theme-only colors/type/easing, frame-driven deterministic scroll
 * (no Math.random), shelf clipped to the safe area (x 96–1824), cards at
 * cy 480 clear of the logo zone and the bottom 108px subtitle zone.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { sec, fadeIn, fadeOut, progress } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { PatternCard } from "../components/PatternCard";
import type { PatternName } from "../components/PatternGlyph";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Layout (px, absolute canvas coords)
const CLIP_X = 96; // overflow-hidden shelf window = safe area width
const CLIP_W = 1728;
const SHELF_CY = 480; // card centers y
const PITCH = 336; // card pitch (300 card + 36 gap)
const LOOP_N = 12; // cards in the loop
const LOOP_W = PITCH * LOOP_N; // 4032
const HAMMER_X = 354; // landed grid: Hammer card center
const WRAP_MIN = HAMMER_X - PITCH * 2; // leftmost wrapped grid center (−318)
// Studied-card display targets after the shuffle
const TARGET_X: Partial<Record<PatternName, number>> = {
  hammer: 354,
  bullishEngulfing: 774,
  shootingStar: 1194,
  bearishEngulfing: 1614,
};
// Timings (seconds, scene-local)
const T = {
  shelfIn: 0.0, // shelf fades in mid-scroll, already moving
  scrollSecPerPitch: 0.5, // one pitch (336px) per 0.5s
  decel: 5.2, // deceleration begins
  decelDur: 0.8, // full stop at 6.0s
  shuffle: 6.0, // studied cards ease to display targets
  shuffleDur: 0.6,
  dimLift: 6.4, // non-studied dim to 15%; the four lift
  nameFade: 11.5, // studied names fade to 0
  pathLine: 13.0, // faint intraday path lines appear
  pathStagger: 0.15, // stagger in display order
};
// ═══════════════════════════════════════════════════════════════════════════

type Card = { pattern: PatternName; name: string };

const CARDS: Card[] = [
  { pattern: "hammer", name: "Hammer" },
  { pattern: "shootingStar", name: "Shooting Star" },
  { pattern: "bullishEngulfing", name: "Bullish Engulfing" },
  { pattern: "bearishEngulfing", name: "Bearish Engulfing" },
  { pattern: "doji", name: "Doji" },
  { pattern: "morningStar", name: "Morning Star" },
  { pattern: "eveningStar", name: "Evening Star" },
  { pattern: "harami", name: "Harami" },
  { pattern: "marubozu", name: "Marubozu" },
  { pattern: "hangingMan", name: "Hanging Man" },
  { pattern: "piercingLine", name: "Piercing Line" },
  { pattern: "tweezerTop", name: "Tweezer Top" },
];

// Path-line stagger order = display order.
const PATH_ORDER: PatternName[] = ["hammer", "bullishEngulfing", "shootingStar", "bearishEngulfing"];

/** Wrap a raw grid x into the loop band [WRAP_MIN, WRAP_MIN + LOOP_W). */
const wrapX = (x: number) => ((((x - WRAP_MIN) % LOOP_W) + LOOP_W) % LOOP_W) + WRAP_MIN;

export const Scene08 = () => {
  const f = useCurrentFrame();

  // Scroll offset: constant velocity, then eased deceleration landing exactly
  // one full loop (4032px) so Hammer stops at x 354. Frame-driven, deterministic.
  const speed = PITCH / sec(T.scrollSecPerPitch); // px per frame
  const offsetAtDecel = speed * sec(T.decel);
  const decelDist = LOOP_W - offsetAtDecel;
  const offset =
    f < sec(T.decel)
      ? speed * f
      : offsetAtDecel + decelDist * progress(f, sec(T.decel), sec(T.decelDur));

  const shuffleQ = f >= sec(T.shuffle) ? progress(f, sec(T.shuffle), sec(T.shuffleDur)) : 0;
  const shelfOpacity = fadeIn(f, sec(T.shelfIn));

  return (
    <SafeArea>
      {/* Clip to the safe area — no card fragments in the 96px margins. */}
      <div
        style={{
          position: "absolute",
          left: CLIP_X,
          top: 0,
          width: CLIP_W,
          height: theme.canvas.height,
          overflow: "hidden",
          opacity: shelfOpacity,
        }}
      >
        {CARDS.map((card, i) => {
          const gridX = HAMMER_X + PITCH * i; // landed grid position
          const scrollX = wrapX(gridX - offset);
          const target = TARGET_X[card.pattern];
          const studied = target !== undefined;
          // Shuffle: studied cards ease grid → display target; non-studied cards
          // right of Bearish Engulfing's grid slot (1362) slide out by the same
          // +252 so none of them ends up underneath a lifted studied card.
          const x = studied
            ? scrollX + (target - gridX) * shuffleQ
            : scrollX + (scrollX > 1362 ? 252 * shuffleQ : 0);

          const pathIdx = studied ? PATH_ORDER.indexOf(card.pattern) : -1;
          const pathStart = sec(T.pathLine + Math.max(0, pathIdx) * T.pathStagger);
          const showPath = studied && f >= pathStart;

          return (
            <PatternCard
              key={card.pattern}
              pattern={card.pattern}
              name={card.name}
              cx={x - CLIP_X}
              cy={SHELF_CY}
              dimmed={!studied && f >= sec(T.dimLift)}
              lifted={studied && f >= sec(T.dimLift)}
              nameOpacity={studied ? fadeOut(f, sec(T.nameFade)) : 1}
              showPathLine={showPath}
              pathLineOpacity={showPath ? 0.35 * fadeIn(f, pathStart) : 0.35}
            />
          );
        })}
      </div>
    </SafeArea>
  );
};
