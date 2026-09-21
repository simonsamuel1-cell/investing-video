/**
 * Scene04 — from 1074, duration 507 frames (ends at frame 1580).
 * Two session runs, cross-faded. Run 1 (long lower wick, "Demand showed up")
 * holds until frame 1320; Run 2 (doji, "No winner") holds until frame 1498;
 * then the line "Same tool, different story — read the path, not the shape."
 * + a "Wait" chip reveal and hold to 1580. (Tray removed.)
 * Compliance: theme tokens only (no raw hex/sizes/easings), safe margins
 * 96/96/54/108, bottom 108px empty, deterministic (no Math.random),
 * textReveal for type, IllustrationTag mounted.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { sec, fadeIn, fadeOut, clampProgress, textReveal } from "../helpers";
import type { SessionPoint } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { SessionView, sessionGeom } from "../components/SessionView";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══
const VIEW_X = 96; // SessionView left (benchmark = SC03)
const VIEW_Y = 240; // SessionView top
const VIEW_W = 1536;
const VIEW_H = 440; // → 480px rounded-rect
const DOCK_CHIP_Y = 600; // result chip sits under the finished daily candle
const LINE_Y = 470; // closing sentence, centered on the cleared canvas
const WAIT_CHIP_Y = 560; // "Wait" chip beneath the line
// Timings in SECONDS from scene start (frame 1074). Key beats are frame-locked:
//   run 1 holds until frame 1320 = 8.20s · run 2 until 1498 = 14.13s · end 1580 = 16.87s
const T = {
  view1In: 0.0, // first SessionView fades in
  run1From: 0.6, // run 1 plays…
  run1Dur: 3.4, // …over 3.4s
  run1PingT: 0.4, // ping at the session low
  close1: 4.0, // close + "Demand showed up"
  swap: 8.2, // run 1 fades out, run 2 fades in (frame 1320)
  run2From: 8.6, // run 2 plays…
  run2Dur: 3.6, // …over 3.6s
  close2: 12.2, // close + "No winner"
  run2End: 14.133, // run 2 fades out (frame 1498)
  line: 14.133, // sentence reveals
  wait: 15.4, // "Wait" chip pops
};
// ═══════════

// Benchmark chart design (matches SC03): centered group, 20px gap, 30px time.
const BENCH_GAP = 20;
const BENCH_NUDGE = 30;
const BENCH_TIME = 30;
// Live daily candle center in the centered group — so the result chip lands under it.
const BENCH_GEOM = sessionGeom({ x: VIEW_X, width: VIEW_W, panelGap: BENCH_GAP, centered: true, centerNudge: BENCH_NUDGE });
const CANDLE_CX = BENCH_GEOM.rightX + BENCH_GEOM.rightW / 2 + BENCH_GEOM.centerOffset;

const RUN1: SessionPoint[] = [
  { t: 0, price: 1302 },
  { t: 0.15, price: 1266 },
  { t: 0.3, price: 1224 },
  { t: 0.4, price: 1198 },
  { t: 0.52, price: 1231 },
  { t: 0.68, price: 1265 },
  { t: 0.85, price: 1292 },
  { t: 1, price: 1308 },
];

const RUN2: SessionPoint[] = [
  { t: 0, price: 1284 },
  { t: 0.12, price: 1322 },
  { t: 0.25, price: 1352 },
  { t: 0.38, price: 1298 },
  { t: 0.5, price: 1238 },
  { t: 0.62, price: 1216 },
  { t: 0.75, price: 1268 },
  { t: 0.88, price: 1305 },
  { t: 1, price: 1287 },
];

export const Scene04 = () => {
  const f = useCurrentFrame();

  const view1Op = fadeIn(f, sec(T.view1In)) * fadeOut(f, sec(T.swap));
  const view2Op = fadeIn(f, sec(T.swap)) * fadeOut(f, sec(T.run2End));
  const run1Playback = clampProgress(f, sec(T.run1From), sec(T.run1Dur));
  const run2Playback = clampProgress(f, sec(T.run2From), sec(T.run2Dur));
  const ping1StartFrame = sec(T.run1From + T.run1PingT * T.run1Dur); // ≈1.96s

  const line = textReveal(f, sec(T.line));

  return (
    <SafeArea>
      {/* run 1 — long lower wick, holds until frame 1320 */}
      {view1Op > 0.001 && (
        <>
          <SessionView
            path={RUN1}
            progress={run1Playback}
            x={VIEW_X}
            y={VIEW_Y}
            width={VIEW_W}
            height={VIEW_H}
            pingT={T.run1PingT}
            pingStartFrame={ping1StartFrame}
            closeFrame={sec(T.close1)}
            opacity={view1Op}
            centered
            centerNudge={BENCH_NUDGE}
            panelGap={BENCH_GAP}
            timeFontSize={BENCH_TIME}
          />
          <Chip
            label="Demand showed up"
            x={CANDLE_CX}
            y={DOCK_CHIP_Y}
            variant="indigo"
            startFrame={sec(T.close1)}
            opacity={view1Op}
          />
        </>
      )}

      {/* run 2 — doji, holds until frame 1498 */}
      {view2Op > 0.001 && f >= sec(T.swap) && (
        <>
          <SessionView
            path={RUN2}
            progress={run2Playback}
            x={VIEW_X}
            y={VIEW_Y}
            width={VIEW_W}
            height={VIEW_H}
            closeFrame={sec(T.close2)}
            opacity={view2Op}
            centered
            centerNudge={BENCH_NUDGE}
            panelGap={BENCH_GAP}
            timeFontSize={BENCH_TIME}
          />
          <Chip
            label="No winner"
            x={CANDLE_CX}
            y={DOCK_CHIP_Y}
            variant="muted"
            startFrame={sec(T.close2)}
            opacity={view2Op}
          />
        </>
      )}

      {/* closing line + Wait chip on the cleared canvas */}
      <div
        style={{
          position: "absolute",
          left: theme.layout.safeLeft,
          top: LINE_Y,
          width: theme.layout.activeWidth,
          textAlign: "center",
          fontSize: theme.type.body.size,
          fontWeight: theme.type.body.weight,
          color: theme.colors.ink,
          opacity: line.opacity,
          transform: `translateY(${line.y}px)`,
        }}
      >
        Same tool, different story — read the path, not the shape.
      </div>
      <Chip label="Wait" x={theme.canvas.width / 2} y={WAIT_CHIP_Y} variant="indigo" startFrame={sec(T.wait)} />

      <IllustrationTag />
    </SafeArea>
  );
};
