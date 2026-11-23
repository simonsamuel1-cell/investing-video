import React from "react";
import { Img, staticFile } from "remotion";
import { theme } from "../core";

/**
 * A thumbnail card cut out of a clean still of the video (public/thumbnail/taNN-frame.png, rendered from the full composition,
 * so nothing is re-drawn and nothing can drift from the video). `cut` is the box in the still's pixels; the subtitle and the
 * logo sit outside every box. `patches` are small boxes inside the cut painted over with the page colour — for the one thing a
 * still cannot leave out, the mouse cursor of a hover scene.
 */
type Box = { x: number; y: number; w: number; h: number };

export const cutCard = (src: string, cut: Box, patches: readonly Box[] = []): { w: number; h: number; r: number; Draw: React.FC } => ({
  w: cut.w,
  h: cut.h,
  r: 24,
  Draw: () => (
    <div style={{ position: "relative", width: cut.w, height: cut.h, overflow: "hidden", borderRadius: 24 }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: -cut.x, top: -cut.y, width: theme.canvas.width, height: theme.canvas.height, maxWidth: "none", display: "block" }} />
      {patches.map((p) => (
        <div key={`${p.x}-${p.y}`} style={{ position: "absolute", left: p.x - cut.x, top: p.y - cut.y, width: p.w, height: p.h, background: theme.color.bg }} />
      ))}
    </div>
  ),
});

/**
 * A card made of several boxes of one still, re-laid as a grid with its own gap — for tiles that sit too far apart in the
 * video to read at thumbnail size (TA03's candlestick patterns: Simon 20 Nov, "jaraknya di deketin deh"). Every tile is one
 * box of the still, all the same size; the card behind them is the page colour, as it is in the video.
 */
export const tilesCard = (src: string, tiles: readonly Box[], cols: number, gap: number, pad: number): { w: number; h: number; r: number; Draw: React.FC } => {
  const { w: tw, h: th } = tiles[0];
  const rows = Math.ceil(tiles.length / cols);
  const w = 2 * pad + cols * tw + (cols - 1) * gap;
  const h = 2 * pad + rows * th + (rows - 1) * gap;
  return {
    w,
    h,
    r: 24,
    Draw: () => (
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 24, background: theme.color.bg }}>
        {tiles.map((t, i) => (
          <div key={`${t.x}-${t.y}`} style={{ position: "absolute", left: pad + (i % cols) * (tw + gap), top: pad + Math.floor(i / cols) * (th + gap), width: tw, height: th, overflow: "hidden", borderRadius: 12 }}>
            <Img src={staticFile(src)} style={{ position: "absolute", left: -t.x, top: -t.y, width: theme.canvas.width, height: theme.canvas.height, maxWidth: "none", display: "block" }} />
          </div>
        ))}
      </div>
    ),
  };
};

/**
 * The same cut on a GLASS card (Simon 20 Nov, lesson 05: "kartunya (background putihnya) di buat glassmorphism"): a pale
 * translucent pane with a lighter rim that blurs the background behind it, as his pill does. A still cannot be made translucent,
 * so its white is dropped instead: the cut becomes a luminance MASK — inverted, so white paper is black (hidden) and dark ink is
 * white (shown), then brightened so the coloured labels show too — over a plain white fill. What is left is white line art on
 * the glass. Only for cuts whose paper is pure white. (A `screen` blend was tried first; the renderer flattened it to a dark box.)
 */
/** darkFill 0.17 = the smoked card at Simon's "transparansi 17%" (20 Nov, lesson 07; 50, 15 and 25 % before it) — his scale: 100 % solid, 0 % gone */
const GLASS = { fill: 0.14, darkFill: 0.17, rim: 2, rimOpacity: 0.45, blur: 24 };
/**
 * How the cut's ink is carried onto the glass. The mask is `lift × (inverted luminance) − floor`.
 *  "white": everything that is not paper becomes white line art (TA05: one black curve and a few labels).
 *  "colour": the cut keeps its own colours and only its paper goes (TA07: green and red candles, the band, the orange average);
 *            `floor` is what removes a paper that is not pure white — that still's is F5F5F5 — and its faint gridlines.
 */
type GlassInk = { ink: "white" | "colour"; lift: number; floor: number };
const INK_WHITE: GlassInk = { ink: "white", lift: 2.6, floor: 0 };
export const INK_COLOUR: GlassInk = { ink: "colour", lift: 6, floor: 0.45 };

const GlassCut = ({ src, cut, ink, sx }: { src: string; cut: Box; ink: GlassInk; sx: number }) => {
  const id = React.useId().replace(/:/g, "");
  const { width: W, height: H } = theme.canvas;
  return (
    <div style={{ position: "relative", width: cut.w * sx, height: cut.h, overflow: "hidden", borderRadius: 24 }}>
      <div style={{ position: "absolute", inset: 0, backdropFilter: `blur(${GLASS.blur}px)`, WebkitBackdropFilter: `blur(${GLASS.blur}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: theme.color.cardBg, opacity: GLASS.fill }} />
      {/* the same file as an <Img>, unseen, so the render waits for it before the mask below is read */}
      <Img src={staticFile(src)} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
      <svg width={cut.w * sx} height={cut.h} viewBox={`${cut.x} ${cut.y} ${cut.w} ${cut.h}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id={`ink-${id}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope={ink.lift} intercept={-ink.floor} />
              <feFuncG type="linear" slope={ink.lift} intercept={-ink.floor} />
              <feFuncB type="linear" slope={ink.lift} intercept={-ink.floor} />
            </feComponentTransfer>
          </filter>
          <mask id={`mask-${id}`} maskUnits="userSpaceOnUse" x={cut.x} y={cut.y} width={cut.w} height={cut.h}>
            <image href={staticFile(src)} x={0} y={0} width={W} height={H} filter={`url(#ink-${id})`} />
          </mask>
        </defs>
        {ink.ink === "white" ? (
          <rect x={cut.x} y={cut.y} width={cut.w} height={cut.h} fill={theme.color.cardBg} mask={`url(#mask-${id})`} />
        ) : (
          <image href={staticFile(src)} x={0} y={0} width={W} height={H} mask={`url(#mask-${id})`} />
        )}
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, border: `${GLASS.rim}px solid ${theme.color.cardBg}`, opacity: GLASS.rimOpacity }} />
    </div>
  );
};

/** `sx` stretches the cut sideways only: a narrower slice of the still drawn at the full card width, so what is in it gets wider and no taller */
export const glassCard = (src: string, cut: Box, ink: GlassInk = INK_WHITE, sx = 1): { w: number; h: number; r: number; Draw: React.FC } => ({
  w: cut.w * sx,
  h: cut.h,
  r: 24,
  Draw: () => <GlassCut src={src} cut={cut} ink={ink} sx={sx} />,
});

/** The glass pane on its own, for a visual that is drawn rather than cut from a still (TA05's redrawn curve). */
const RING = "linear-gradient(black 0 0) content-box, linear-gradient(black 0 0)";

export const GlassPane = ({
  w,
  h,
  children,
  dark = false,
  shadow = false,
  blur = GLASS.blur,
  rim,
}: {
  w: number;
  h: number;
  children: React.ReactNode;
  /** smoked glass: dark indigo instead of the pale pane, still see-through */
  dark?: boolean;
  /** the card casts a shadow on the background */
  shadow?: boolean;
  /** how far the card blurs what is behind it, in the card's own units */
  blur?: number;
  /** a graded border instead of the plain pale rim: `from` at the top-left corner, `to` at the bottom-right, `width` in the card's own units */
  rim?: { from: string; to: string; width: number };
}) => (
  <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 24, boxShadow: shadow ? theme.shape.thumbCardShadow : undefined }}>
    <div style={{ position: "absolute", inset: 0, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)` }} />
    <div style={{ position: "absolute", inset: 0, background: dark ? theme.color.thumbCardFill : theme.color.cardBg, opacity: dark ? GLASS.darkFill : GLASS.fill }} />
    {children}
    {rim ? (
      // a ring: the gradient fills the box, and the mask keeps only the band between the border box and the content box
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          padding: rim.width,
          background: `linear-gradient(to bottom right, ${rim.from}, ${rim.to})`,
          mask: RING,
          WebkitMask: RING,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
    ) : (
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, border: `${GLASS.rim}px solid ${theme.color.cardBg}`, opacity: GLASS.rimOpacity }} />
    )}
  </div>
);
