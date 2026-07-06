/**
 * Scene 2 — "speed isn't the edge" (comp 175–263, dur 88). Cursor pings the
 * feed's Click button, then a cyan strike crosses "Speed" while "the edge"
 * holds ink-black. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { CursorPing } from "../components";
import { clamp01, textReveal } from "../helpers";

const PINGS = 0; // @0.0s
const STRIKE = Math.round(1.6 * 30); // @1.6s
const EDGE = Math.round(2.2 * 30); // @2.2s

const c = theme.colors;

export const Scene02 = () => {
  const f = useCurrentFrame();
  const ring = clamp01((f - PINGS) / 12) * (1 - clamp01((f - 40) / 16));
  const strike = clamp01((f - STRIKE) / 16);
  const edge = textReveal(f, EDGE, 14);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* highlight ring on the Click button (UI pop) */}
      <div style={{ position: "absolute", left: 588, top: 566, width: 216, height: 74, borderRadius: theme.radius.chip, boxShadow: `0 0 0 ${6 * ring}px ${c.indigoWash}`, opacity: ring }} />
      <CursorPing x={700} y={548} frame={f} start={PINGS} mode="ping" count={3} />

      {/* the phrase: Speed (struck cyan) · the edge (holds black) */}
      <div style={{ position: "absolute", left: 880, top: 360, width: 900, fontSize: 60, fontWeight: theme.font.weights.extrabold, color: c.text }}>
        <span style={{ position: "relative", color: c.grey }}>
          Speed
          <span style={{ position: "absolute", left: 0, top: "52%", width: `${100 * strike}%`, height: 5, background: c.cyan, borderRadius: 3 }} />
        </span>{" "}
        <span style={{ ...edge }}>isn&rsquo;t the edge.</span>
      </div>
    </AbsoluteFill>
  );
};
