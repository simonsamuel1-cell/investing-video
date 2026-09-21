/**
 * Scene01Focus — NV 351 onward (new content, 15 Jul revision). Freezes the S1
 * ticker wall at frame 351, isolates the EXCL tile (2,676 · +6.2%), lifts it to
 * centre while the rest fades out, stamps a "Bought · Rp 10.000.000" badge, then a
 * floating loss creeps in. Frame = scene-local (0 at NV 351).
 *
 *   local 0    (NV 351) freeze + EXCL highlighted
 *   0→59  (351→410) grid/heading fade out · EXCL glides to centre
 *   59→95 (410→446) "Bought · Rp 10.000.000" badge
 *   165→232 (516→583) floating loss grows
 *   232→244 (583→595) whole composition dims to 20% and holds — a faint frozen
 *            "floating loss of EXCL" background for the content that follows.
 */
import { AbsoluteFill, Freeze, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../theme";
import { Scene01 } from "./Scene01";

const LOSS_RED = "#E5475D";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rp = (n: number) => "Rp " + Math.round(n).toLocaleString("de-DE");

// EXCL tile in the frozen frame-351 grid: left 968 · top 447 · 275×138.
// Card base is 440 wide → start scale 275/440 = 0.625 reproduces the tile exactly.
const START = { left: 968, top: 447, scale: 275 / 440 };
const END = { left: 740, top: 300, scale: 1 }; // centred (card centre ≈ 960,410)

const BUY = 10_000_000;
const LOSS = 1_240_000; // −12.4% floating loss

export const Scene01Focus = () => {
  const f = useCurrentFrame();

  const p = interpolate(f, [0, 59], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const gridOp = interpolate(f, [0, 44], [1, 0], CLAMP);
  const left = interpolate(p, [0, 1], [START.left, END.left]);
  const top = interpolate(p, [0, 1], [START.top, END.top]);
  const scale = interpolate(p, [0, 1], [START.scale, END.scale]);
  const hl = f < 28 ? 0.35 + 0.65 * Math.abs(Math.sin(f * 0.5)) : 1; // blink → hold
  const buyOp = interpolate(f, [59, 95], [0, 1], CLAMP);
  const lossP = interpolate(f, [165, 232], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  // 583→595: the whole floating-loss frame dims to 20% and holds as a faint background.
  const dim = interpolate(f, [232, 244], [1, 0.2], CLAMP);

  // As the floating loss grows, EXCL's own price + daily % fall precisely with it.
  // Entry/buy price 2,676 (the +6.2% snapshot); prev close 2,520 → +6.2%. When the
  // position is −12.4% (−Rp 1.240.000) the price is 2,344 and the daily change is −7.0%.
  const price = Math.round(interpolate(lossP, [0, 1], [2676, 2344]));
  const pctNum = interpolate(lossP, [0, 1], [6.2, -7.0]);
  const pctStr = `${pctNum >= 0 ? "+" : "−"}${Math.abs(pctNum).toFixed(1)}%`;
  const pctColor = pctNum >= 0 ? COLORS.purple : LOSS_RED;

  // 595: the big "NOISE" text returns over the faint background.
  const noiseOp = interpolate(f, [244, 258], [0, 1], CLAMP);
  // Scene 1 ends at NV 693 (local 342) — fade the whole thing out.
  const outOp = interpolate(f, [328, 342], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: outOp }}>
      {/* frozen S1 wall + heading, fading out */}
      <AbsoluteFill style={{ opacity: gridOp }}>
        <Freeze frame={351}>
          <Scene01 />
        </Freeze>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: dim }}>
      {/* the isolated EXCL card — glides from its tile to centre */}
      <div style={{ position: "absolute", left, top, width: 440, height: 220, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <div
          style={{
            width: 440,
            height: 220,
            boxSizing: "border-box",
            borderRadius: 22,
            border: `3px solid ${COLORS.purple}`,
            background: "#FFFFFF",
            boxShadow: `0 20px 55px rgba(95,77,238,${0.28 * hl})`,
            padding: "26px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: 0.66 + 0.34 * hl,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 800, color: COLORS.black, letterSpacing: 0.5 }}>EXCL</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: 42, fontWeight: 700, color: COLORS.black }}>{price.toLocaleString("en-US")}</span>
            <span style={{ fontSize: 38, fontWeight: 800, color: pctColor }}>{pctStr}</span>
          </div>
        </div>
      </div>

      {/* Bought · Rp 10.000.000 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 556, display: "flex", justifyContent: "center", opacity: buyOp }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 30px", borderRadius: 18, background: COLORS.purple, boxShadow: "0 16px 40px rgba(95,77,238,0.30)" }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.82)" }}>BOUGHT</span>
          <span style={{ width: 2, height: 34, background: "rgba(255,255,255,0.35)" }} />
          <span style={{ fontSize: 40, fontWeight: 800, color: "#FFFFFF" }}>{rp(BUY)}</span>
        </div>
      </div>

      {/* floating loss creeps in */}
      {lossP > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 672, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: interpolate(lossP, [0, 0.15], [0, 1], CLAMP) }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1, color: COLORS.ink }}>Floating loss</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: LOSS_RED }}>
            −{rp(lossP * LOSS)} <span style={{ fontSize: 40 }}>(−{(lossP * 12.4).toFixed(1)}%)</span>
          </div>
        </div>
      )}
      </AbsoluteFill>

      {/* "NOISE" returns at 595, full opacity over the faint floating-loss background */}
      {noiseOp > 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: noiseOp }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 168, fontWeight: 800, letterSpacing: -2, color: COLORS.black }}>NOISE</div>
            <div style={{ width: 160, height: 6, borderRadius: 3, background: COLORS.cyan }} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
