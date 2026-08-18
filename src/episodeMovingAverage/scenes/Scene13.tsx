/**
 * SC13 — Closing: indicators follow, they don't lead (from 8318, dur 582).
 *
 * CAUSE AND EFFECT AS A SEQUENCE. Price draws left to right and its moving
 * average traces the SAME path several sessions behind it. The follower is
 * literally the leader's own average, so it cannot get ahead at any frame —
 * that is a property of the maths, not of the animation timing, and it is why
 * the line is computed rather than hand-drawn.
 *
 * The two outcome chips are given EQUAL weight and the same indigo. Questioning
 * your analysis is not a failure state, and styling it as one would contradict
 * the sentence it illustrates.
 *
 * The last image is a SET, not a tool: the indicator chip is joined by three
 * more so the frame ends on four things, none of them deciding alone. The
 * silver background carries out — no fade to black.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { Panel } from "../components/Panels";
import { PriceLine } from "../components/PriceLine";
import { MovingAverageLine } from "../components/MovingAverageLine";
import { MeasureCaliper } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { sma, sec, progress, textReveal } from "../helpers";
import { seriesGrid } from "../components/plot";
import { LEADER } from "../data/series";
import { CUTS, cutPushIn, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 8318;
const T = {
  lead: sec(0.2),
  caption: sec(4.2),
  branch: sec(6.0),
  list: sec(10.0),
  final: sec(15.5),
};
const PERIOD = 14;
const BOX = { x: theme.stage.active.x + 40, y: 150, w: theme.stage.active.w - 80, h: 330 };
const USES = ["Mengonfirmasi trend", "Menemukan squeeze", "Menyaring chart"];
const SET = ["Indikator", "Analisis", "Level", "Trend"];
/** Where the lag bracket is measured — one bar of the leader against its average. */
const LAG_AT = 70;
// ═══════════════════════════════════════════════════════════════════════════

const G = seriesGrid(LEADER, BOX, 0.14);
const MA = sma(LEADER, PERIOD);
/**
 * How far behind the average actually is, in bars: the first index at which the
 * average reaches the price the leader printed at LAG_AT. Derived, so the
 * bracket cannot claim a lag the line does not have.
 */
const LAG_TO = (() => {
  const target = LEADER[LAG_AT];
  for (let i = LAG_AT; i < MA.length; i++) {
    const v = MA[i];
    if (v !== null && Math.abs(v - target) < target * 0.004) return i;
  }
  return Math.min(MA.length - 1, LAG_AT + 12);
})();

export const Scene13 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  /** Arrives on the pull-back CG-C left in flight. */
  const push = cutPushIn(g, CUTS.toClose, -0.14);
  const blur = cutBlur(g, CUTS.toClose);
  const cap = textReveal(f, T.caption);
  const listOut = f >= T.final ? 1 - progress(f, T.final, 14) * 0.65 : 1;

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Card rect={{ x: theme.stage.active.x, y: 110, w: theme.stage.active.w, h: 410 }}>
          <PriceLine values={LEADER} grid={G} f={f} at={T.lead} over={sec(3.6)} />
          {/* the follower starts later AND draws slower — it cannot overtake */}
          <MovingAverageLine values={MA} grid={G} f={f} at={T.lead + sec(0.8)} over={sec(4.4)} variant="slow" />
          {f >= T.caption && (
            <MeasureCaliper
              from={{ x: G.x(LAG_AT), y: BOX.y + BOX.h - 30 }}
              to={{ x: G.x(LAG_TO), y: BOX.y + BOX.h - 30 }}
              label="lag"
              f={f}
              at={T.caption}
              orientation="horizontal"
            />
          )}
        </Card>

        <Chip label="Harga" x={theme.stage.active.x + 60} y={548} tone="slate" anchor="left" at={T.lead + sec(1)} />
        <Chip label="Indikator" x={theme.stage.active.x + 260} y={548} tone="indigo" anchor="left" at={T.lead + sec(1.4)} />

        {f >= T.caption && (
          <div
            style={{
              position: "absolute",
              left: theme.canvas.width / 2,
              top: 610 + cap.dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.title.size,
              fontWeight: theme.text.title.weight,
              color: theme.color.ink,
              opacity: cap.opacity,
              whiteSpace: "nowrap",
            }}
          >
            Indikator mengikuti, tidak memimpin.
          </div>
        )}

        {/* equal weight, same colour — questioning is not a failure state */}
        <Chip label="Memperkuat analisismu" x={theme.canvas.width / 2 - 300} y={686} tone="indigo" at={T.branch} check pill />
        <Chip label="? Mempertanyakan analisismu" x={theme.canvas.width / 2 + 300} y={686} tone="indigo" at={T.branch + 10} pill />

        <div style={{ opacity: listOut }}>
          {USES.map((u, i) => {
            const r = textReveal(f, T.list + i * sec(1.6));
            if (f < T.list + i * sec(1.6)) return null;
            return (
              <div
                key={u}
                style={{
                  position: "absolute",
                  left: theme.canvas.width / 2,
                  top: 758 + i * 0 + r.dy,
                  transform: `translate(calc(-50% + ${(i - 1) * 520}px), -50%)`,
                  fontFamily: theme.text.family,
                  fontSize: theme.text.tag.size,
                  fontWeight: theme.text.tag.weight,
                  color: theme.color.slate,
                  opacity: r.opacity,
                  whiteSpace: "nowrap",
                }}
              >
                {u}
              </div>
            );
          })}
        </div>

        {/* the largest type in the episode, and then a set rather than a tool */}
        {f >= T.final && (
          <Panel rect={{ x: theme.stage.active.x, y: 560, w: theme.stage.active.w, h: 300 }} opacity={textReveal(f, T.final).opacity} radius={theme.shape.cardRadius}>
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: 660 + textReveal(f, T.final).dy,
                transform: "translate(-50%, -50%)",
                width: theme.stage.active.w - 120,
                textAlign: "center",
                fontFamily: theme.text.family,
                fontSize: theme.text.display.size,
                fontWeight: theme.text.display.weight,
                lineHeight: 1.08,
                color: theme.color.ink,
                opacity: textReveal(f, T.final).opacity,
              }}
            >
              Jangan pernah memutuskan hanya karena satu indikator.
            </div>
            {SET.map((s, i) => (
              <Chip
                key={s}
                label={s}
                x={theme.canvas.width / 2 + (i - 1.5) * 300}
                y={800}
                tone={i === 0 ? "indigo" : "slate"}
                at={T.final + (i === 0 ? 0 : sec(1) + i * 8)}
                pill
              />
            ))}
          </Panel>
        )}
      </div>
    </Stage>
  );
};
