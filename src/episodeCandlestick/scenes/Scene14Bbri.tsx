/**
 * Scene14Bbri — from 9044, duration 1342 (9044–10385). Real BBRI footage with a
 * choreographed treatment + overlays. The video scale/position lives in
 * components/BbriVideo.tsx; the recovery highlight in components/HighlightBox.tsx.
 *
 * Overlays (abs frames): 9200–9300 arrow at the rightmost red candle · 9360–9546
 * highlight the reversal (engulfing) candle · 9740–9778 "What happens next?" ·
 * 9779–9865 3-2-1 countdown · 9903–10017 highlight the recovery + "+10%" ·
 * 10018–10176 slide left, bullish-engulfing pattern + caveats · 10177–10206
 * fade the caveats and return to center. Everything fades out by 10385.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { PatternCard } from "../components/PatternCard";
import { BbriVideo, videoBox, END } from "../components/BbriVideo";
import { HighlightBox } from "../components/HighlightBox";

const ramp = (f: number, a: number, b: number, c: number, d: number) =>
  interpolate(f, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Arrow = ({ x1, y1, x2, y2, opacity }: { x1: number; y1: number; x2: number; y2: number; opacity: number }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const HL = 24;
  const HW = 13;
  const bx = x2 - HL * Math.cos(a);
  const by = y2 - HL * Math.sin(a);
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} strokeLinecap="round" />
      <polygon
        points={`${x2},${y2} ${bx - HW * Math.sin(a)},${by + HW * Math.cos(a)} ${bx + HW * Math.sin(a)},${by - HW * Math.cos(a)}`}
        fill={theme.colors.indigo}
      />
    </g>
  );
};

export const Scene14Bbri = () => {
  const f = useCurrentFrame();
  const box = videoBox(f);
  const opacity = interpolate(f, [0, 12, END - 15, END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Overlay opacities (scene-local frames = abs − 9044).
  const arrowOp = ramp(f, 156, 168, 288, 300); // 9200–9300
  const hl2Op = ramp(f, 316, 330, 534, 546); // 9360–9546
  const scrimOp = ramp(f, 696, 710, 813, 821) * 0.58; // dim under the text/countdown
  const whatOp = ramp(f, 696, 710, 728, 734); // 9740–9778
  const c3 = ramp(f, 744, 750, 766, 772);
  const c2 = ramp(f, 772, 778, 795, 801);
  const c1 = ramp(f, 801, 807, 815, 821);
  const box10Op = ramp(f, 859, 871, 961, 973); // 9903–10017
  const asideOp = ramp(f, 1019, 1031, 1120, 1150); // pattern + caveats appear at 10075

  const B10 = { x: 980, y: 415, w: 220, h: 216 }; // recovery highlight (base geometry)
  const asideLeft = box.right + 50; // 50px gap between the video and the pattern/caveats

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <BbriVideo />

      {/* Scrim behind the "What happens next?" text + countdown, for readability. */}
      {scrimOp > 0.001 && <div style={{ position: "absolute", inset: 0, background: theme.colors.bg, opacity: scrimOp }} />}

      {/* Arrow at the rightmost red candle. */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        {arrowOp > 0.001 && <Arrow x1={1112} y1={835} x2={1225} y2={835} opacity={arrowOp} />}
      </svg>

      {/* Highlight the Open / Close readout (top-left of the chart). */}
      {hl2Op > 0.001 && <HighlightBox x={604} y={573} w={202} h={57} opacity={hl2Op} />}

      {/* Recovery highlight + "+10%" (the frame-9990 box). */}
      {box10Op > 0.001 && <HighlightBox x={B10.x} y={B10.y} w={B10.w} h={B10.h} opacity={box10Op} label="+10%" />}

      {/* "What happens next?" — as big as the closing-scene text. */}
      {whatOp > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 430,
            width: theme.canvas.width,
            textAlign: "center",
            fontFamily: theme.type.family,
            fontSize: theme.type.display.size,
            fontWeight: theme.type.display.weight,
            color: theme.colors.ink,
            opacity: whatOp,
          }}
        >
          What happens next?
        </div>
      )}

      {/* 3-2-1 countdown, centered. */}
      {(c3 > 0.001 || c2 > 0.001 || c1 > 0.001) &&
        (
          [
            { n: "3", o: c3 },
            { n: "2", o: c2 },
            { n: "1", o: c1 },
          ] as const
        ).map(({ n, o }) =>
          o > 0.001 ? (
            <div
              key={n}
              style={{
                position: "absolute",
                left: 0,
                top: 400,
                width: theme.canvas.width,
                textAlign: "center",
                fontFamily: theme.type.family,
                fontSize: 220,
                fontWeight: theme.type.display.weight,
                color: theme.colors.indigo,
                opacity: o,
              }}
            >
              {n}
            </div>
          ) : null,
        )}

      {/* Bullish-engulfing pattern + caveats beside the moved video, left-aligned to the chart. */}
      {asideOp > 0.001 && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: asideOp }}>
          {/* white pattern card (same as frame 3887) */}
          <PatternCard pattern="bullishEngulfing" name="Bullish Engulfing" cx={asideLeft + 150} cy={380} />
          <div
            style={{
              position: "absolute",
              left: asideLeft,
              top: 600,
              width: 680,
              textAlign: "left",
              fontFamily: theme.type.family,
              fontSize: 48,
              fontWeight: theme.type.headline.weight,
              color: theme.colors.indigo,
            }}
          >
            No guarantee
          </div>
          <div
            style={{
              position: "absolute",
              left: asideLeft,
              top: 668,
              width: 520,
              textAlign: "left",
              fontFamily: theme.type.family,
              fontSize: 36,
              fontWeight: theme.type.body.weight,
              color: theme.colors.slate,
            }}
          >
            Unconfirmed engulfing patterns often fail
          </div>
        </div>
      )}
    </div>
  );
};
