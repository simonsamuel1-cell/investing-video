/**
 * lab/tests/SvgFilters.tsx — TEST 02 · SVG filters.
 *
 * ⚠ THE OPPOSITE OF A SHADER, AND THAT IS THE POINT. A shader computes a
 * picture from nothing and the result has no parts. A filter takes a picture
 * that ALREADY EXISTS and processes it — so everything underneath stays a
 * real element: it keeps its name, its frame in the table, its label, its
 * place in the layout. The look is applied over the top of things that are
 * still addressable.
 *
 * ⚠ AND IT IS MARKUP, NOT CODE. No WebGL context, no compile step, no
 * REMOTION_GL — it renders in the ordinary still pipeline.
 *
 * ⚠ EVERY feTurbulence CARRIES AN EXPLICIT `seed`. Left off, the noise is
 * free to differ between processes and a frame rendered on one worker would
 * not match the next.
 *
 * ⚠ AND ANYTHING GENERATED — turbulence, flood, lighting — FILLS THE WHOLE
 * FILTER REGION, NOT THE SHAPE. It has to be composited back against
 * SourceAlpha or the transparent area around the element is painted too. That
 * is the commonest mistake with these and it stays invisible until the thing
 * sits on a coloured ground.
 *
 * Four panels. `rough`, `grain` and `erode` were here first and were replaced
 * at Simon's request; this set reaches for primitives the first one never
 * touched.
 *   gooey    blur + alpha crush — two readings MERGING, no in-between shape
 *   light    a bump map and a LAMP — flat vector becomes a lit surface
 *   split    channel separation — the glitch/uncertainty signal
 *   duotone  any source image forced into two brand colours
 */
import { useCurrentFrame } from "remotion";
import { Line, Stage, columns, inset, theme, useMotion, usePalette } from "../../core";

const PANELS = (() => {
  const card = theme.stage.card;
  const top = { ...card, h: card.h / 2 };
  const low = { ...card, y: card.y + card.h / 2, h: card.h / 2 };
  const [a, b] = columns(top, 2, 48);
  const [c, d] = columns(low, 2, 48);
  return [a, b, c, d].map((r) => inset(r, 24));
})();

/** "#RRGGBB" → "r g b" in 0..1, the form feFuncX tableValues wants. */
const ch = (hex: string) => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

export const SvgFiltersTest = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();

  /** One slow wave; every panel breathes on it, so a single still catches all
   *  four mid-move. */
  const sway = Math.sin((f / m.sec(2.6)) * Math.PI);
  const open = Math.abs(sway);

  const gap = 20 + (1 - open) * 150;
  /** ⚠ THE LIGHT SWEEPS, THE SURFACE DOES NOT MOVE. Rotating the lamp is what
   *  proves the relief is real shading and not a painted gradient. */
  const azimuth = 120 + sway * 120;
  const split = 2 + open * 14;

  const lo = ch(c.bg);
  const hi = ch(c.indigo);

  const label = (i: number, text: string) => (
    <Line
      text={text}
      x={PANELS[i].x}
      y={PANELS[i].y + theme.text.axis.size}
      at={0}
      anchor="left"
      size={theme.text.axis.size}
      weight={theme.text.axis.weight}
      color={c.slate}
    />
  );

  return (
    <Stage>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          {/* ── GOOEY ── blur, then crush the alpha ramp back into an edge.
              Two blurred masses that overlap re-emerge as ONE shape, and no
              intermediate form was ever defined. */}
          <filter id="lab-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12"
            />
          </filter>

          {/* ── LIGHT ── the surprising one. feTurbulence is read as a HEIGHT
              MAP and feDiffuseLighting puts a lamp on it, so a flat fill comes
              back as a shaded relief. There is no gradient anywhere in the
              source; the shading is computed from a surface that does not
              exist. */}
          <filter id="lab-light">
            {/* ⚠ BIG, SLOW BUMPS — 0.004, not 0.013. At the finer frequency
                the relief was below the size of a highlight and the panel read
                as a noisy fill. A lit surface needs lobes you can see a light
                side and a shade side of. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.004 0.008"
              numOctaves={2}
              seed={5}
              result="bump"
            />
            <feDiffuseLighting
              in="bump"
              lightingColor={c.cardBg}
              surfaceScale={48}
              diffuseConstant={0.92}
              result="lit"
            >
              <feDistantLight azimuth={azimuth} elevation={56} />
            </feDiffuseLighting>
            <feComposite in="lit" in2="SourceAlpha" operator="in" result="clipped" />
            <feBlend in="SourceGraphic" in2="clipped" mode="multiply" />
          </filter>

          {/* ── SPLIT ── the same picture three times, one per channel, two of
              them nudged apart. The fringes appear only at edges, which is why
              it reads as a signal fault rather than as a colour change. */}
          <filter id="lab-split">
            <feOffset in="SourceGraphic" dx={-split} dy={0} result="o1" />
            <feColorMatrix
              in="o1"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="only_r"
            />
            <feOffset in="SourceGraphic" dx={split} dy={0} result="o2" />
            <feColorMatrix
              in="o2"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="only_b"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="only_g"
            />
            <feBlend in="only_r" in2="only_b" mode="screen" result="rb" />
            <feBlend in="rb" in2="only_g" mode="screen" />
          </filter>

          {/* ── DUOTONE ── desaturate, posterise into bands, then map 0 and 1
              onto two brand colours with a transfer table. Any source — a
              screenshot, a photo, a chart in somebody else's palette — comes
              out in two colours that are ours. */}
          <filter id="lab-duo">
            <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="grey" />
            <feComponentTransfer in="grey" result="bands">
              <feFuncR type="discrete" tableValues="0 0.2 0.45 0.7 1" />
              <feFuncG type="discrete" tableValues="0 0.2 0.45 0.7 1" />
              <feFuncB type="discrete" tableValues="0 0.2 0.45 0.7 1" />
            </feComponentTransfer>
            <feComponentTransfer in="bands">
              <feFuncR type="table" tableValues={`${hi[0]} ${lo[0]}`} />
              <feFuncG type="table" tableValues={`${hi[1]} ${lo[1]}`} />
              <feFuncB type="table" tableValues={`${hi[2]} ${lo[2]}`} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* ── 1 · gooey ─────────────────────────────────────────────────────── */}
      {label(0, "gooey — dua massa melebur jadi satu")}
      <div
        style={{
          position: "absolute",
          left: PANELS[0].x,
          top: PANELS[0].y + PANELS[0].h * 0.42,
          width: PANELS[0].w,
          height: 200,
          filter: "url(#lab-goo)",
        }}
      >
        {[-1, 1].map((s) => (
          <div
            key={s}
            style={{
              position: "absolute",
              left: PANELS[0].w / 2 + s * gap - 64,
              top: 36,
              width: 128,
              height: 128,
              borderRadius: 999,
              background: c.indigo,
            }}
          />
        ))}
      </div>

      {/* ── 2 · light ─────────────────────────────────────────────────────── */}
      {label(1, "light — bidang datar jadi permukaan bercahaya")}
      <div
        style={{
          position: "absolute",
          left: PANELS[1].x + 20,
          top: PANELS[1].y + PANELS[1].h * 0.3,
          width: PANELS[1].w - 40,
          height: PANELS[1].h * 0.56,
          borderRadius: theme.shape.cardRadius,
          background: c.indigo,
          filter: "url(#lab-light)",
        }}
      />

      {/* ── 3 · split ─────────────────────────────────────────────────────── */}
      {label(2, "split — pecah kanal, sinyal glitch")}
      <div style={{ filter: "url(#lab-split)" }}>
        <Line
          text="INVALID"
          x={PANELS[2].x + PANELS[2].w / 2}
          y={PANELS[2].y + PANELS[2].h * 0.42}
          at={0}
          size={theme.text.display.size}
          weight={theme.text.display.weight}
          color={c.ink}
        />
        <div
          style={{
            position: "absolute",
            left: PANELS[2].x + 60,
            top: PANELS[2].y + PANELS[2].h * 0.66,
            width: PANELS[2].w - 120,
            height: theme.shape.heavy,
            borderRadius: 999,
            background: c.indigo,
          }}
        />
      </div>

      {/* ── 4 · duotone ───────────────────────────────────────────────────── */}
      {label(3, "duotone — sumber apa pun dipaksa ke warna brand")}
      <div style={{ filter: "url(#lab-duo)" }}>
        {[theme.color.orange, theme.color.marun, theme.color.bulb, c.cyan, c.indigo, c.slate].map(
          (col, i) => (
            <div
              key={col}
              style={{
                position: "absolute",
                left: PANELS[3].x + 20 + i * ((PANELS[3].w - 40) / 6),
                top: PANELS[3].y + PANELS[3].h * 0.3,
                width: (PANELS[3].w - 40) / 6 - 12,
                /* a stepped row, so the posterise bands are visible as bands */
                height: PANELS[3].h * (0.26 + (i % 3) * 0.1),
                borderRadius: theme.shape.panelRadius,
                background: col,
              }}
            />
          ),
        )}
      </div>
    </Stage>
  );
};
