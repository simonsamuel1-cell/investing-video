/**
 * lab/Lab.tsx — the visual-language bench.
 *
 * ⚠ A BENCH, NOT AN EPISODE. Nothing here ships. It exists so a way of MAKING
 * a picture can be judged on its own, before anyone decides whether a scene
 * should be made that way. Five are planned; each is one file under tests/ and
 * each is shown alone.
 *
 *   glsl    a fragment shader — per-pixel arithmetic, continuous fields
 *   svg     SVG filters — distortion, gooey, erosion, grain, applied to
 *           anything already drawn
 *   canvas  generative 2D — particles, flocking, flow fields, L-systems
 *   audio   the voice-over's own amplitude driving the picture
 *   type    variable-font axes animated as motion
 *
 * ⚠ ONE AT A TIME — Simon's standing rule, and it is the right one here for a
 * second reason: these are being COMPARED. Two on screen at once and neither
 * is being looked at.
 *
 * ⚠ THE RESERVES ARE DRAWN AS GUIDES. A ground that is beautiful and then has
 * to be clipped out of the subtitle band and the logo zone is a ground that
 * was never judged honestly — GridGround had exactly that problem. `GUIDES`
 * turns them off once the look is settled.
 */
import { AbsoluteFill, getInputProps } from "remotion";
import { PaletteProvider, Stage, theme, usePalette } from "../core";
import { GlslTest } from "./tests/Glsl";
import { RaymarchCandlesTest } from "./tests/RaymarchCandles";
import { BlobsTest } from "./tests/Blobs";
import { SvgFiltersTest } from "./tests/SvgFilters";
import { PathsTest } from "./tests/Paths";
import { AudioRidgeTest } from "./tests/AudioRidge";
import { VariableTypeTest } from "./tests/VariableType";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export type LabTest = "glsl" | "raymarch" | "blobs" | "svg" | "canvas" | "audio" | "type";
/* ⚠ `as LabTest`, NOT `: LabTest`. With an annotation TypeScript still
   narrows a const reference to its literal, so every other branch below reads
   as dead code and fails the build. The assertion keeps the lever a lever. */
export const TEST = "type" as LabTest;
/**
 * Draw the subtitle band and logo zone over the test.
 *
 * ⚠ AN INPUT PROP, NOT A CONSTANT, so the reserves can be PROVEN rather than
 * eyeballed: the guides are drawn in warn red, which audit-frames.mjs counts
 * as ink in the very zones it is checking. Render with '{"guides":false}' and
 * the check becomes meaningful.
 */
const { guides = true } = getInputProps() as { guides?: boolean };
const GUIDES = guides;
/**
 * Ten seconds, plus one second of overlap.
 *
 * ⚠ THE OVERLAP IS SO A LOOP CAN BE PROVEN. Test 01c closes its circle over
 * 600 frames; with the bench exactly 600 long, frame 600 is out of range and
 * the claim "it loops" can only be asserted. At 660 the two frames can be
 * rendered and diffed.
 */
export const LAB_FRAMES = 660;
// ═══════════════════════════════════════════════════════════════════════════

const LABELS: Record<LabTest, string> = {
  glsl: "01 · GLSL — domain-warped fbm, sebagai ground",
  raymarch: "01b · GLSL raymarch — candlestick 3D tanpa geometri",
  blobs: "01c · GLSL blob — ground morphing, loop mulus 600f",
  svg: "02 · SVG filter — gooey · light · split · duotone",
  canvas: "03 · Canvas generatif — 800 lintasan dari satu candle keputusan",
  audio: "04 · Audio-reactive — VO sendiri yang menggambar",
  type: "05 · Variable font — sumbu bobot kontinu 200→800",
};

/** The two reserves, outlined. Nothing may live inside them in a real scene. */
const Guides = () => {
  const box = (x: number, y: number, w: number, h: number, key: string) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        /* warn lives on theme.color, not on the palette — the reserves are
           chrome for the bench, not scene content */
        border: `${theme.shape.hairline}px dashed ${theme.color.warn}`,
        opacity: 0.55,
      }}
    />
  );
  return (
    <>
      {box(0, theme.captionBand.top, theme.canvas.width, theme.captionBand.height, "band")}
      {box(
        theme.canvas.width - theme.logoZone.width,
        0,
        theme.logoZone.width,
        theme.logoZone.height,
        "logo",
      )}
    </>
  );
};

const Tag = () => {
  const c = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: theme.stage.active.x,
        top: theme.stage.active.y,
        fontFamily: theme.text.mono,
        fontSize: theme.text.axis.size,
        color: c.slate,
        background: theme.color.greyWash,
        padding: "6px 14px",
        borderRadius: theme.shape.chipRadius,
      }}
    >
      {LABELS[TEST]}
    </div>
  );
};

const Body = () => (
  <Stage>
    {TEST === "glsl" && <GlslTest />}
    {TEST === "raymarch" && <RaymarchCandlesTest />}
    {TEST === "blobs" && <BlobsTest />}
    {TEST === "svg" && <SvgFiltersTest />}
    {TEST === "canvas" && <PathsTest />}
    {TEST === "audio" && <AudioRidgeTest />}
    {TEST === "type" && <VariableTypeTest />}
    {GUIDES && <Guides />}
    <Tag />
  </Stage>
);

export const VisualLab = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Body />
    </PaletteProvider>
  </AbsoluteFill>
);
