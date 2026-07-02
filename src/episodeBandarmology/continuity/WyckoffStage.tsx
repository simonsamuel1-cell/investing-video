/**
 * WyckoffStage — Scenes 5→10 (comp 1055–2482), mounted once. Uses the real chart
 * capture (scene5-10.png) instead of a drawn chart, processed so it doesn't read
 * as a screenshot:
 *   • the white background is blended out (mix-blend-mode: multiply on the F5F5F5
 *     canvas) so only the candles + volume float on the page,
 *   • it reveals left→right in sync with the phases (progress wipe),
 *   • our header, phase chips, avg-cost label, a moving phase spotlight, and the
 *     Scene-10 zone bands are layered on top.
 * Local frame = comp − 1055.
 *
 * Chart phase x-fractions (measured on the capture): Accumulation 0–0.42,
 * Markup 0.42–0.80, Distribution ~0.78–0.87, Markdown 0.87–1.0. Candle green/red
 * comes from the capture; everything we draw is indigo/cyan/neutral. No buy/sell
 * arrows (compliance).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { SafeArea, Chip } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

// chart box — spans the phase-chip row (left edge of chip 1 → right edge of chip 4).
// Width-stretched (objectFit: fill); height unchanged so the vertical mapping holds.
const CW = 1500;
const CH = 600;
const CTOP = 285;
const CLEFT = 210;
const fx = (frac: number) => CLEFT + frac * CW;
const DOT_Y = CTOP + 0.52 * CH; // the capture's dotted support line

const PHASES = [
  { n: 1, label: "Accumulation", x0: 0.0, x1: 0.42, onAt: 228, offAt: 560 },
  { n: 2, label: "Markup", x0: 0.42, x1: 0.8, onAt: 550, offAt: 714 },
  { n: 3, label: "Distribution", x0: 0.78, x1: 0.87, onAt: 704, offAt: 924 },
  { n: 4, label: "Markdown", x0: 0.87, x1: 1.0, onAt: 914, offAt: 1122 },
];

// reveal fraction mapped to the phase windows (matches the capture's geometry)
const progressAt = (f: number) => {
  if (f < 228) return 0;
  if (f < 538) return ((f - 228) / 310) * 0.42;
  if (f < 550) return 0.42;
  if (f < 689) return 0.42 + ((f - 550) / 139) * (0.8 - 0.42);
  if (f < 704) return 0.8;
  if (f < 905) return 0.8 + ((f - 704) / 201) * (0.87 - 0.8);
  if (f < 914) return 0.87;
  if (f < 1107) return 0.87 + ((f - 914) / 193) * (1 - 0.87);
  return 1;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export const WyckoffStage = () => {
  const frame = useCurrentFrame();
  const progress = progressAt(frame);
  const baselineOp = fadeIn(frame, 10, 26);
  const bands10 = fadeIn(frame, 1122, 24);

  return (
    <SafeArea>
      {/* header */}
      <div style={{ position: "absolute", left: 96, top: 96, width: 1272, textAlign: "center", fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(frame, 20, 18) }}>
        Wyckoff — Four Phases
      </div>

      {/* phase chips */}
      <div style={{ position: "absolute", left: 210, top: 210, width: 1500, display: "flex", gap: 16 }}>
        {PHASES.map((p) => {
          const on = frame >= p.onAt && frame < p.offAt;
          return (
            <div key={p.n} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, height: 52, borderRadius: radius.pill, background: on ? colors.indigo : colors.cardWhite, border: `2px solid ${on ? colors.indigo : colors.divider}`, color: on ? colors.white : colors.slateMute, fontSize: type.chip, fontWeight: font.weights.bold, opacity: fadeIn(frame, 60, 20) }}>
              <span style={{ fontWeight: font.weights.extrabold }}>{p.n}</span>
              {p.label}
            </div>
          );
        })}
      </div>

      {/* chart capture in a rounded card (spans the chip row), revealed left→right */}
      <div style={{ position: "absolute", left: CLEFT, top: CTOP, width: CW, height: CH, background: colors.cardWhite, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, overflow: "hidden", boxSizing: "border-box", opacity: baselineOp }}>
        <Img
          src={staticFile("bandarmology/scene5-10.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            mixBlendMode: "multiply",
            clipPath: `inset(0 ${((1 - progress) * 100).toFixed(2)}% 0 0)`,
          }}
        />
      </div>

      {/* moving phase spotlight — clipped to the revealed portion of the chart */}
      {PHASES.map((p) => {
        const op = clamp01(Math.min(fadeIn(frame, p.onAt, 14), fadeOut(frame, p.offAt - 14, 14)));
        const right = Math.min(p.x1, progress);
        if (op <= 0 || right <= p.x0) return null;
        return (
          <div
            key={`band-${p.n}`}
            style={{ position: "absolute", left: fx(p.x0), top: CTOP, width: (right - p.x0) * CW, height: CH, background: colors.indigo, opacity: 0.12 * op }}
          />
        );
      })}

      {/* avg-cost label on the capture's dotted support line */}
      <div style={{ position: "absolute", left: CLEFT + 10, top: DOT_Y - 44, fontSize: type.chip, fontWeight: font.weights.bold, color: colors.indigoDeep, opacity: fadeIn(frame, 300, 16) }}>
        Avg Cost
      </div>

      {/* Scene-10 zone bands */}
      {frame >= 1122 && (
        <>
          <div style={{ position: "absolute", left: fx(0.36), top: CTOP, width: (0.48 - 0.36) * CW, height: CH, background: colors.indigoTint, opacity: 0.55 * bands10 }} />
          <div style={{ position: "absolute", left: fx(0.76), top: CTOP, width: (0.87 - 0.76) * CW, height: CH, background: colors.indigoTint, opacity: 0.55 * bands10 }} />
          <div style={{ position: "absolute", left: fx(0.3), top: CTOP + 4, width: 360, fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate, opacity: bands10 }}>
            Late accumulation, as price begins to move
          </div>
          <div style={{ position: "absolute", left: fx(0.72), top: CTOP + 4, width: 360, fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate, opacity: bands10, textAlign: "right" }}>
            Before distribution turns to markdown
          </div>
        </>
      )}

      {/* phase annotations */}
      {frame >= 300 && frame < 560 && <Chip label="Shakeout" variant="cyan" left={fx(0.34)} top={DOT_Y + 60} delay={300} />}
      {frame >= 1122 && <Chip label="A zone of interest, not a signal." variant="outline" left={CLEFT} top={CTOP + CH + 6} delay={1122} />}
    </SafeArea>
  );
};
