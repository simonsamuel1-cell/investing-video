/**
 * Scene14Bbri — from 9044, duration 1342 (9044–10385). Real BBRI footage
 * (portrait 980×1920) with a choreographed treatment + overlays.
 *
 * Video states (scene-local frames; abs − 9044):
 *   0–572   upscaled 130% (anchored top, cropped at the subtitle margin)
 *   572–636 scales back down to the saved base (safe-margin fit, centered)
 *   636–974 base
 *   974–1006 slides to the left side
 *   1006–1133 held left (bullish-engulfing pattern + caveats beside it)
 *   1133–1162 slides back to center
 * Rounded corners throughout; everything fades out by 10385 (logo excepted).
 *
 * Overlays (abs frames): 9200–9300 arrow at the rightmost red candle · 9360–9546
 * highlight the reversal (engulfing) candle · 9740–9778 "What happens next?" ·
 * 9779–9865 3-2-1 countdown · 9903–10017 highlight the recovery + "+10%" ·
 * 10018–10176 slide left, bullish-engulfing pattern + caveats · 10177–10206
 * fade the caveats and return to center.
 */
import { useCurrentFrame, interpolate, OffthreadVideo, staticFile } from "remotion";
import { theme } from "../theme";
import { PatternGlyph } from "../components/PatternGlyph";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SAFE_TOP = 54;
const SUBTITLE_Y = 972; // subtitle-margin top (1080 − 108); video never crosses it
const BASE_H = SUBTITLE_Y - SAFE_TOP; // 918 — saved base height
const BASE_W = (BASE_H * 980) / 1920; // 468.5625 — saved base width (fit to height)
const BASE_CX = 960; // saved base center-x
const UPSCALE = 1.3;
const LEFT_CX = 96 + BASE_W / 2; // video hugs the safe-left when moved aside
const EC = 3; // edge crop px — hides a black source-edge line
const RADIUS = 28; // rounded corners
const END = 10385 - 9044; // 1341

const K = {
  downFrom: 572,
  downTo: 636, // 9616–9680 scale back to base
  leftFrom: 974,
  leftTo: 1006, // 10018 → slide left
  backFrom: 1133,
  backTo: 1162, // 10177–10206 slide back to center
};
// ═══════════════════════════════════════════════════════════════════════════

export const videoScale = (f: number) =>
  interpolate(f, [0, K.downFrom, K.downTo], [UPSCALE, UPSCALE, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const videoCx = (f: number) =>
  interpolate(f, [0, K.leftFrom, K.leftTo, K.backFrom, K.backTo], [BASE_CX, BASE_CX, LEFT_CX, LEFT_CX, BASE_CX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
export const videoBox = (f: number) => {
  const s = videoScale(f);
  const w = BASE_W * s;
  return { left: videoCx(f) - w / 2, top: SAFE_TOP, width: w, height: BASE_H, right: videoCx(f) + w / 2, scale: s };
};

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

const HLBox = ({ x, y, w, h, opacity }: { x: number; y: number; w: number; h: number; opacity: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={12} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} opacity={opacity} />
);

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
  const asideOp = ramp(f, 1006, 1030, 1120, 1150); // pattern + caveats beside the moved video

  // Recovery highlight box (base geometry).
  const B10 = { x: 1020, y: 415, w: 172, h: 216 };
  // Pattern + caveats sit to the right of the left-parked video.
  const asideCx = box.right + 285;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* Rounded clip window: crops the edge line, the upscale overflow, and the bottom. */}
      <div style={{ position: "absolute", left: box.left, top: box.top, width: box.width, height: box.height, overflow: "hidden", borderRadius: RADIUS }}>
        <OffthreadVideo
          src={staticFile("bbri.mp4")}
          muted
          style={{ position: "absolute", left: -EC, top: -EC, width: box.width + 2 * EC, height: BASE_H * box.scale + 2 * EC, objectFit: "fill" }}
        />
      </div>

      {/* Scrim behind the "What happens next?" text + countdown, for readability. */}
      {scrimOp > 0.001 && <div style={{ position: "absolute", inset: 0, background: theme.colors.bg, opacity: scrimOp }} />}

      {/* Vector overlays. */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        {arrowOp > 0.001 && <Arrow x1={1320} y1={632} x2={1196} y2={732} opacity={arrowOp} />}
        {hl2Op > 0.001 && <HLBox x={1186} y={512} w={68} h={250} opacity={hl2Op} />}
        {box10Op > 0.001 && <HLBox x={B10.x} y={B10.y} w={B10.w} h={B10.h} opacity={box10Op} />}
      </svg>

      {/* "+10%" beside-left of the recovery box, bottom-aligned. */}
      {box10Op > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: B10.x - 190,
            top: B10.y + B10.h - 48,
            width: 170,
            textAlign: "right",
            fontFamily: theme.type.family,
            fontSize: 44,
            fontWeight: theme.type.headline.weight,
            color: theme.colors.indigo,
            opacity: box10Op,
          }}
        >
          +10%
        </div>
      )}

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

      {/* Bullish-engulfing pattern + caveats beside the left-parked video. */}
      {asideOp > 0.001 && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: asideOp }}>
          <PatternGlyph pattern="bullishEngulfing" cx={asideCx} top={300} size={260} />
          <div
            style={{
              position: "absolute",
              left: asideCx - 300,
              top: 600,
              width: 600,
              textAlign: "center",
              fontFamily: theme.type.family,
              fontSize: 48,
              fontWeight: theme.type.headline.weight,
              color: theme.colors.ink,
            }}
          >
            No guarantee
          </div>
          <div
            style={{
              position: "absolute",
              left: asideCx - 320,
              top: 668,
              width: 640,
              textAlign: "center",
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
