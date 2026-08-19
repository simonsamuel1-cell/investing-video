/**
 * ThreeBoxLab — an isometric candlestick plate, for @remotion/three.
 *
 * THE SHAPE OF THE SHOT. The chart is FLAT — 2D artwork, no candle has any
 * depth. What is three-dimensional is the PLATE it is drawn on: one group,
 * turned in yaw, pitch and roll, with the camera close to it. Everything is a
 * child of that group, so nothing can be left behind at a different angle.
 *
 * AND IT NEVER STOPS MOVING. A held isometric angle reads as a still picture
 * with a funny perspective; the plate breathes through a slow drift the whole
 * time the close-up is on it, which is what makes the shot read as a camera in
 * a space rather than as a skewed image.
 *
 * ═══ THE UNIT BRIDGE ═══
 *
 *   1 world unit = 100 px,  and  world (0,0) is canvas (960, 540).
 *
 * At fov 45 a camera `FRONT.z` away frames exactly 10.8 units — 1080px — so at
 * the front view a mesh lands on the pixel its px coordinate names, and the
 * geometry comes straight out of the episode's own `gridOf`.
 *
 * Timing works as everywhere else: useCurrentFrame() -> interpolate() -> plain
 * numbers handed to three as props. No animation loop, no delta time.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { DoubleSide, Euler, Vector3 } from "three";
import { theme } from "../episodeMovingAverage/theme";
import { gridOf } from "../episodeMovingAverage/components/ChartFrame";
import { SERIES_UPTREND, BARS_UPTREND } from "../episodeMovingAverage/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const LAB_FRAMES = 360; // 12s at 30fps
const T = {
  /** The first candle lands here; the rest follow at PER_BAR. */
  reveal: 12,
  /** The close-up holds until here, then the plate flattens and the camera goes home. */
  home: 250,
  homeOver: 55,
};
/** Slow on purpose — 3 frames a candle is the pace the reference moves at. */
const PER_BAR = 3;
/** A candle fades and trims at the same time, over these many frames. */
const IN = { fade: 10, trim: 14 };

/**
 * THE ISOMETRIC ANGLE, in degrees. True isometric is 45° yaw with a 35.26°
 * pitch under an orthographic camera; this is the softer dimetric version
 * every motion-graphics chart actually uses, and it keeps a perspective camera
 * so the far end of the plate genuinely converges.
 *
 * PITCH STAYS SMALL. Past about 10 degrees the camera is looking along the
 * plate rather than at it: the card collapses towards edge-on, the gridlines
 * turn into long converging strokes, and the candles stop being readable as
 * candles. The angle has to sell depth without costing legibility, so most of
 * the turn is carried by yaw and roll.
 */
const ISO = { yaw: -28, pitch: 7, roll: 6 };
/** The drift. Amplitude in degrees, period in frames — slow, and never zero. */
const DRIFT = { yaw: 4.5, yawT: 190, pitch: 1.8, pitchT: 145 };
/**
 * The close-up. `lift` and `lead` are FRACTIONS OF THE CURRENT DISTANCE, not
 * fixed lengths: the frame is roughly 1.5 units wide per unit of distance, so
 * an offset that frames the shot nicely at z 3.4 throws the subject clean out
 * of it at z 2.1. Expressed as fractions, the framing holds all the way in.
 */
const CLOSE = { from: 3.4, to: 2.1, lift: 0.12, lead: 0.34 };
/** The card is the ACTIVE AREA — the full margin box, nothing outside it. */
const CARD = theme.stage.active;
/** The plot, inset inside the card so a body cannot touch the card's edge. */
const PLOT = { x: CARD.x + 64, y: CARD.y + 64, w: CARD.w - 128, h: CARD.h - 128 };
const TICKS = 5;
// ═══════════════════════════════════════════════════════════════════════════

const hold = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const U = 100;
const rad = (deg: number) => (deg * Math.PI) / 180;
/** Canvas px -> world units. The only place the two systems meet. */
const wx = (px: number) => (px - theme.canvas.width / 2) / U;
const wy = (py: number) => (theme.canvas.height / 2 - py) / U;
const FRONT = { z: (theme.canvas.height / 2 / U) / Math.tan(rad(45 / 2)), y: 0 };

/** The episode's own grid, over the plot — same maths, same seeded series. */
const DOMAIN: [number, number] = [
  Math.min(...BARS_UPTREND.map((b) => b.l)),
  Math.max(...BARS_UPTREND.map((b) => b.h)),
];
const G = gridOf(SERIES_UPTREND, DOMAIN, PLOT);
const BODY_W = Math.max(2, Math.min(20, G.slot * 0.62)) / U;
const LAST = T.reveal + (BARS_UPTREND.length - 1) * PER_BAR;
/** How far past the last candle the camera keeps travelling. */
const TAIL = 26;
/** The moving-average window the camera path is smoothed over, in bars. */
const SMOOTH = 13;

/** Every candle, pre-solved in world units at module scope. */
const CANDLES = BARS_UPTREND.map((b, i) => {
  const top = Math.min(G.y(b.o), G.y(b.c));
  const h = Math.max(1.5, Math.abs(G.y(b.c) - G.y(b.o)));
  return {
    x: wx(G.x(i)),
    bodyY: wy(top + h / 2),
    bodyH: h / U,
    wickY: wy((G.y(b.h) + G.y(b.l)) / 2),
    wickH: (G.y(b.l) - G.y(b.h)) / U,
    up: b.c >= b.o,
    at: T.reveal + i * PER_BAR,
  };
});

/**
 * ═══ THE CAMERA PATH ═══
 *
 * ONE move, not seventy. Riding the newest candle meant re-reading a floor()ed
 * index every frame, so the camera restarted on each bar and the whole shot
 * stepped. Instead the path is a single eased travel from the first bar to the
 * last, over a SMOOTHED centreline — the raw closes are noisy, and a camera
 * that tracked them exactly would shake with every pullback.
 *
 * The camera is therefore NOT locked to the reveal. Easing makes it lag at the
 * start and overtake through the middle, so candles land ahead of it and are
 * left behind it, which is the whole of the dynamic.
 */
const PATH = CANDLES.map((_, i) => {
  let sum = 0;
  for (let k = i - SMOOTH; k <= i + SMOOTH; k++) {
    sum += CANDLES[Math.max(0, Math.min(CANDLES.length - 1, k))].bodyY;
  }
  return sum / (SMOOTH * 2 + 1);
});

/** The point the camera rides at 0 -> 1 along the chart. */
const along = (p: number) => {
  const idx = Math.max(0, Math.min(CANDLES.length - 1, p * (CANDLES.length - 1)));
  const i0 = Math.floor(idx);
  const i1 = Math.min(CANDLES.length - 1, i0 + 1);
  const t = idx - i0;
  return {
    x: CANDLES[i0].x + (CANDLES[i1].x - CANDLES[i0].x) * t,
    y: PATH[i0] + (PATH[i1] - PATH[i0]) * t,
  };
};

/** The plate's angle at a frame — the isometric pose, drifting, then unwinding. */
const leanAt = (f: number) => {
  const go = interpolate(f, [T.home, T.home + T.homeOver], [0, 1], { ...hold, easing: Easing.inOut(Easing.ease) });
  const on = interpolate(f, [0, 26], [0, 1], { ...hold, easing: theme.motion.settle }) * (1 - go);
  const yaw = ISO.yaw + Math.sin((f / DRIFT.yawT) * Math.PI * 2) * DRIFT.yaw;
  const pitch = ISO.pitch + Math.cos((f / DRIFT.pitchT) * Math.PI * 2) * DRIFT.pitch;
  /* YXZ so the numbers read the way they are named: yaw, then pitch, then roll */
  return new Euler(rad(pitch) * on, rad(yaw) * on, rad(ISO.roll) * on, "YXZ");
};

/**
 * The camera rig.
 *
 * R3F does not re-read the `camera` prop after mount, so a moving camera is
 * driven from inside the canvas: this re-renders with every frame and writes
 * the new position onto the camera itself.
 */
const Rig: React.FC<{ f: number; lean: Euler }> = ({ f, lean }) => {
  const { camera } = useThree();
  /** ONE eased travel across the whole chart — see THE CAMERA PATH. */
  const p = interpolate(f, [T.reveal, LAST + TAIL], [0, 1], { ...hold, easing: Easing.inOut(Easing.ease) });
  const on = along(p);
  /**
   * The point AFTER the plate has been turned. Riding the unrotated point aims
   * the camera at where the chart would be if it were flat-on — and with any
   * yaw at all that is several units away in z, so the shot slides off it.
   */
  const at = new Vector3(on.x, on.y, 0).applyEuler(lean);

  const dolly = interpolate(f, [T.reveal, LAST], [CLOSE.from, CLOSE.to], { ...hold, easing: Easing.inOut(Easing.ease) });
  const go = interpolate(f, [T.home, T.home + T.homeOver], [0, 1], { ...hold, easing: Easing.inOut(Easing.ease) });
  const mix = (a: number, b: number) => a * (1 - go) + b * go;

  const lead = dolly * CLOSE.lead;
  const lift = dolly * CLOSE.lift;
  camera.position.set(
    mix(at.x - lead, 0),
    mix(at.y + lift, FRONT.y),
    mix(at.z + dolly, FRONT.z),
  );
  camera.lookAt(mix(at.x - lead, 0), mix(at.y, 0), mix(at.z, 0));
  camera.updateProjectionMatrix();
  return null;
};

/**
 * One candle — FLAT, and arriving by FADE AND TRIM together.
 *
 * The wick trims outward from the body's own level rather than growing from
 * the bottom of the frame, so the candle assembles the way it would be read:
 * the range opens around the price, it does not rise into it.
 */
const Candle: React.FC<{ c: (typeof CANDLES)[number]; f: number }> = ({ c, f }) => {
  const o = interpolate(f, [c.at, c.at + IN.fade], [0, 1], hold);
  if (o <= 0.001) return null;
  const trim = interpolate(f, [c.at, c.at + IN.trim], [0, 1], { ...hold, easing: theme.motion.settle });
  const tone = c.up ? theme.color.candleGreen : theme.color.candleRed;
  return (
    <group position={[c.x, 0, 0]}>
      <mesh position={[0, c.wickY, 0.001]} scale={[1, trim, 1]}>
        <planeGeometry args={[0.015, c.wickH]} />
        <meshBasicMaterial color={theme.color.priceLine} side={DoubleSide} transparent opacity={o} />
      </mesh>
      <mesh position={[0, c.bodyY, 0.002]} scale={[1, trim, 1]}>
        <planeGeometry args={[BODY_W, c.bodyH]} />
        <meshBasicMaterial color={tone} side={DoubleSide} transparent opacity={o} />
      </mesh>
    </group>
  );
};

/** The room the candles are in: the surface, its gridlines and its baseline. */
const Plate: React.FC = () => {
  const lines = Array.from({ length: TICKS }, (_, i) => PLOT.y + (PLOT.h * i) / (TICKS - 1));
  return (
    <>
      <mesh position={[wx(CARD.x + CARD.w / 2), wy(CARD.y + CARD.h / 2), 0]}>
        <planeGeometry args={[CARD.w / U, CARD.h / U]} />
        <meshBasicMaterial color={theme.color.surface} side={DoubleSide} />
      </mesh>
      {lines.map((py, i) => (
        <mesh key={i} position={[wx(CARD.x + CARD.w / 2), wy(py), 0.0005]}>
          <planeGeometry args={[(CARD.w - 128) / U, 0.01]} />
          <meshBasicMaterial
            color={i === lines.length - 1 ? theme.color.border : theme.color.gridline}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
};

export const BoxLab: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lean = leanAt(f);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.color.bg }}>
      {/*
        `flat` turns OFF the ACES tone mapping R3F applies by default. With it
        on, #FFFFFF comes out around #E0E0E0 and the white card reads grey.
        No `linear` though — that turns colour MANAGEMENT off as well, and the
        theme's sRGB hex would render far darker than the episode's.
      */}
      <ThreeCanvas
        flat
        width={width}
        height={height}
        camera={{ fov: 45, position: [0, 0, FRONT.z] }}
        style={{ backgroundColor: "transparent" }}
      >
        <Rig f={f} lean={lean} />
        {/* ONE plate, turned as a whole */}
        <group rotation={lean}>
          <Plate />
          {CANDLES.map((c, i) => (
            <Candle key={i} c={c} f={f} />
          ))}
        </group>
      </ThreeCanvas>

      {/* DOM, over the WebGL — still type, still reading from theme.ts */}
      <div
        style={{
          position: "absolute",
          left: theme.stage.titleChip.x,
          top: theme.stage.titleChip.y,
          transform: "translateY(-50%)",
          fontFamily: theme.text.family,
          fontSize: theme.text.title.size,
          fontWeight: theme.text.title.weight,
          color: theme.color.indigo,
        }}
      >
        {f < T.home ? "Isometric · follow" : "Front view"}
      </div>
    </AbsoluteFill>
  );
};
