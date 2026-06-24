/**
 * Scene 2 (v2) — One Theme. 657f. NATIVE.
 * The indicator noise clears; the three siloed tickers slide together and
 * connect (indigo connectors) into one node — the Poultry Sector — revealing the
 * shared catalysts and the one verified proof-point (JPFA Q1 2026 +167% YoY, with
 * on-screen source). Resolves to "Condition First. → Details After — Only If Needed."
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components";
import { COLORS, TYPE, WEIGHT, RADII, BORDER, STROKES } from "../theme";
import { ease, lin, popIn, popOut } from "../helpers";
import { S2_TICKERS, S2_THEME, S2_CATALYSTS, S2_PROOF } from "./scene02.data";

const START_X = [380, 960, 1540]; // spread (Scene 1 positions)
const END_X = [680, 960, 1240]; // converged cluster above the node (no overlap)
const TICK_Y = 322;
const NODE = { cx: 960, cy: 458 };

const Pill = ({ children, x, y, w, op, scale, accent = false }: { children: React.ReactNode; x: number; y: number; w: number; op: number; scale: number; accent?: boolean }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y,
      width: w,
      opacity: op,
      transform: `scale(${scale})`,
      transformOrigin: "center center",
      padding: "14px 22px",
      borderRadius: RADII.chip,
      border: `${BORDER.regular}px solid ${accent ? COLORS.primary : STROKES.chip}`,
      background: accent ? COLORS.primaryWash : COLORS.surface,
      color: COLORS.text,
      fontSize: TYPE.label,
      fontWeight: WEIGHT.semibold,
      textAlign: "center",
      whiteSpace: "nowrap",
      boxShadow: "0 10px 24px rgba(27,29,34,0.06)",
    }}
  >
    {children}
  </div>
);

export const Scene02 = () => {
  const frame = useCurrentFrame();

  // residual chips clear (0–90)
  const noiseOut = popOut(frame, 30);

  // tickers slide inward 90→260
  const slide = lin(frame, [90, 260], [0, 1]);
  const tx = (i: number) => START_X[i] + (END_X[i] - START_X[i]) * slide;

  // node + connectors
  const nodeP = popIn(frame, 200);
  const connDraw = lin(frame, [210, 300], [0, 1]);
  const mainP = popIn(frame, 120);

  // catalysts + proof
  const cat1 = popIn(frame, 300);
  const cat2 = popIn(frame, 340);
  const proof = popIn(frame, 410);

  // resolve — clear the theme cluster fully, then the principle stands alone
  const dim = ease(frame, [490, 560], [1, 0]);
  const res1 = popIn(frame, 555);
  const res2 = popIn(frame, 605);

  return (
    <SceneWrap>
      {/* main turn line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 158,
          textAlign: "center",
          opacity: mainP.opacity,
          transform: `scale(${mainP.scale})`,
          transformOrigin: "center center",
          fontSize: TYPE.principle,
          fontWeight: WEIGHT.bold,
          color: COLORS.text,
        }}
      >
        They Weren&rsquo;t Three Ideas. They Were One Theme.
      </div>

      <AbsoluteFill style={{ opacity: dim }}>
        {/* connectors (ticker → node) */}
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", pointerEvents: "none" }}>
          {S2_TICKERS.map((_, i) => (
            <line
              key={i}
              x1={tx(i)}
              y1={TICK_Y + 64}
              x2={NODE.cx}
              y2={NODE.cy}
              stroke={COLORS.primary}
              strokeWidth={BORDER.regular}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - connDraw}
            />
          ))}
        </svg>

        {/* residual noise chips clearing */}
        {["RSI", "MACD", "Stochastic"].map((n, i) => (
          <div
            key={n}
            style={{
              position: "absolute",
              left: START_X[i] - 90,
              top: 540,
              width: 180,
              textAlign: "center",
              opacity: noiseOut.opacity,
              transform: `scale(${noiseOut.scale})`,
              transformOrigin: "center center",
              padding: "10px 14px",
              borderRadius: RADII.chip,
              border: `${BORDER.thin}px solid ${STROKES.chip}`,
              background: COLORS.surface,
              fontSize: TYPE.label,
              fontWeight: WEIGHT.semibold,
              color: COLORS.slate,
            }}
          >
            {n}
          </div>
        ))}

        {/* three tickers converging */}
        {S2_TICKERS.map((sym, i) => (
          <div
            key={sym}
            style={{
              position: "absolute",
              left: tx(i) - 115,
              top: TICK_Y,
              width: 230,
              padding: "14px 0",
              borderRadius: RADII.lg,
              border: `${BORDER.regular}px solid ${STROKES.chip}`,
              background: COLORS.surface,
              textAlign: "center",
              fontSize: TYPE.headline,
              fontWeight: WEIGHT.heavy,
              color: COLORS.text,
              letterSpacing: 1,
              boxShadow: "0 12px 28px rgba(27,29,34,0.07)",
            }}
          >
            {sym}
          </div>
        ))}

        {/* theme node */}
        <div
          style={{
            position: "absolute",
            left: NODE.cx - 350,
            top: NODE.cy,
            width: 700,
            opacity: nodeP.opacity,
            transform: `scale(${nodeP.scale})`,
            transformOrigin: "center center",
            padding: "22px 0",
            borderRadius: RADII.panel,
            background: COLORS.primary,
            color: COLORS.white,
            textAlign: "center",
            whiteSpace: "nowrap",
            fontSize: TYPE.display,
            fontWeight: WEIGHT.heavy,
            boxShadow: "0 22px 50px rgba(95,77,238,0.28)",
          }}
        >
          {S2_THEME}
        </div>

        {/* catalyst chips */}
        <Pill x={660} y={602} w={540} op={cat1.opacity} scale={cat1.scale}>{S2_CATALYSTS[0]}</Pill>
        <Pill x={1260} y={602} w={600} op={cat2.opacity} scale={cat2.scale}>{S2_CATALYSTS[1]}</Pill>

        {/* proof-point card with on-screen source */}
        <div
          style={{
            position: "absolute",
            left: NODE.cx - 380,
            top: 700,
            width: 760,
            opacity: proof.opacity,
            transform: `scale(${proof.scale})`,
            transformOrigin: "center center",
            padding: "20px 28px",
            borderRadius: RADII.card,
            border: `${BORDER.regular}px solid ${COLORS.primary}`,
            background: COLORS.surface,
            textAlign: "center",
            boxShadow: "0 16px 36px rgba(95,77,238,0.14)",
          }}
        >
          <div style={{ fontSize: TYPE.headline, fontWeight: WEIGHT.bold, color: COLORS.text }}>
            {S2_PROOF.label} <span style={{ color: COLORS.primary }}>{S2_PROOF.value}</span>
          </div>
          <div style={{ fontSize: TYPE.micro, fontWeight: WEIGHT.regular, color: COLORS.slate, marginTop: 8 }}>
            {S2_PROOF.source}
          </div>
        </div>
      </AbsoluteFill>

      {/* resolve */}
      <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ opacity: res1.opacity, transform: `scale(${res1.scale})`, fontSize: TYPE.display, fontWeight: WEIGHT.heavy, color: COLORS.primary }}>
          Condition First.
        </div>
        <div style={{ opacity: res2.opacity, transform: `scale(${res2.scale})`, fontSize: TYPE.headline, fontWeight: WEIGHT.semibold, color: COLORS.text }}>
          Details After — Only If Needed.
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
