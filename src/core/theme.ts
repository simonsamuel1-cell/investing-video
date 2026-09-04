/**
 * core/theme.ts — the ONLY place a Tuntun video names a colour, a size, a
 * curve or a coordinate. Episodes and components read from here and nowhere
 * else.
 *
 * Built from the two things the episodes already got right:
 *   · LAYOUT DERIVED FROM MARGIN — from episode20marketstructure. Every box is
 *     computed from MARGIN, so changing a margin moves every episode rather
 *     than leaving one behind.
 *   · PALETTE AS SLOTS, NOT VALUES — from episodeChartMemory. A palette is 14
 *     named slots; `PALETTES` holds the sets that fill them. This is what makes
 *     a theme swap possible at all.
 *
 * ── THREE RULES THIS FILE ENFORCES ─────────────────────────────────────────
 *
 * 1. NO fps HERE, AND NO FRAME COUNTS ANYWHERE IN A COMPONENT.
 *    fps is a property of the Composition, read with useVideoConfig(). Every
 *    duration below is in SECONDS. Convert at the call site with `frames()`.
 *    A bare frame number inside a component is a bug — it silently runs at
 *    half speed the day the project moves from 30fps to 60fps.
 *
 * 2. THESE KEY NAMES ARE FROZEN.
 *    `color` `text` `canvas` `margin` `captionBand` `logoZone` `stage` `shape`
 *    `motion`. Every previous episode renamed them — theme.colors vs
 *    theme.color, theme.type vs theme.text, theme.layout.width vs
 *    theme.canvas.width — and that renaming, not any design difference, is why
 *    no component could ever be shared. Adding a key is fine. Renaming one
 *    breaks every episode at once.
 *
 * 3. candleGreen / candleRed ARE FOR CANDLE BODIES AND WICKS ONLY.
 *    Axes, gridlines, bands, reference lines, annotations and chrome are never
 *    red or green. `warn` is the one exception and it is for WORDS only —
 *    naming a mistake — never for drawn chart content.
 */
import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"] });
/**
 * ⚠ THE MONO IS A LABEL FACE, NOT A SECOND BODY FACE. It is for short lines
 * that name a thing — a combination, a state, a key — where the fixed pitch and
 * the terminal look do the separating that a size step would otherwise have to.
 * A sentence set in it reads as code, and nothing in these videos is code.
 */
loadMono("normal", { weights: ["400", "500"] });

const W = 1920;
const H = 1080;

/** Fixed for every Tuntun video. Not overridable per episode. */
const MARGIN = { left: 96, right: 96, top: 54, bottom: 108 } as const;

/** The band the burned-in subtitles own. Nothing else may enter it. */
const CAPTION_BAND = { top: H - MARGIN.bottom, height: MARGIN.bottom } as const;

/** Top-right zone kept clear for the logo. Content in the first `height` px
 *  of the canvas must end before `maxX`. */
const LOGO_ZONE = { width: 360, height: 150, maxX: W - 360 - 192 } as const;

/** Everything below is derived. Move a margin and the whole stage follows. */
const active = {
  x: MARGIN.left,
  y: MARGIN.top,
  w: W - MARGIN.left - MARGIN.right,
  h: H - MARGIN.top - MARGIN.bottom,
} as const;

const TITLE_H = 136;
const CAPTION_H = 96;

const card = {
  x: active.x,
  y: active.y + TITLE_H,
  w: active.w,
  h: active.h - TITLE_H - CAPTION_H,
} as const;

/* ═══ PALETTE ══════════════════════════════════════════════════════════════
 * A palette is these 14 slots. Components read slots, never literal hex, so a
 * palette swap needs no component change. `terang` is the default and is the
 * canonical Tuntun light palette. The other three exist and are wired, but are
 * NOT in use — see core/palette.tsx.
 */
export type PaletteName = "terang" | "gelap" | "kertas" | "ungu";

export type Palette = {
  bg: string;
  ink: string;
  slate: string;
  indigo: string;
  cyan: string;
  candleGreen: string;
  candleRed: string;
  /** Two steps of indigo for stacked indicator lines. */
  indigoTint1: string;
  indigoTint2: string;
  indigoSoft: string;
  cyanSoft: string;
  /** The white card charts are drawn on. */
  cardBg: string;
  border: string;
  muted: string;
};

export const PALETTES: Record<PaletteName, Palette> = {
  /** Canonical. Hue-locked: indigo 247°, cyan 192°. */
  terang: {
    bg: "#F5F5F5",
    ink: "#000000",
    slate: "#626266",
    indigo: "#5F4DEE",
    cyan: "#5CC8E3",
    candleGreen: "#22B573",
    candleRed: "#E5475D",
    indigoTint1: "#8F82F4",
    indigoTint2: "#BDB4F9",
    indigoSoft: "#EFEDFE",
    cyanSoft: "#EDFDFE",
    cardBg: "#FFFFFF",
    border: "#DEDEE0",
    muted: "#B9B9BD",
  },
  /** Ground inverted. Brand hues lifted so they hold on black. */
  gelap: {
    bg: "#171717",
    ink: "#F2F2F2",
    slate: "#9A9AA2",
    indigo: "#8B7AF7",
    cyan: "#6FD4EC",
    candleGreen: "#2ED18A",
    candleRed: "#FF5E72",
    indigoTint1: "#9E92F7",
    indigoTint2: "#7268CF",
    indigoSoft: "#262041",
    cyanSoft: "#17303A",
    cardBg: "#1F1F21",
    border: "#34343A",
    muted: "#5A5A62",
  },
  /** Warm paper ground. Cyan becomes terracotta — the one deliberate break
   *  of the hue rule. */
  kertas: {
    bg: "#F4EFE7",
    ink: "#1C1917",
    slate: "#6E6358",
    indigo: "#5F4DEE",
    cyan: "#C4622F",
    candleGreen: "#1E9A63",
    candleRed: "#CB4A3C",
    indigoTint1: "#8F82F4",
    indigoTint2: "#BDB4F9",
    indigoSoft: "#ECE9FC",
    cyanSoft: "#F8E7DA",
    cardBg: "#FBF7F0",
    border: "#E3D9CA",
    muted: "#B9AB98",
  },
  /** Marks an EXAMPLE section. The purple sits at 282° — deliberately far from
   *  brand indigo at 247° so it reads as another room, not indigo gone wrong.
   *  Its ground stays identical to the explaining sections: the accent, type
   *  and cards mark the section, not the ground. */
  ungu: {
    bg: "#F5F5F5",
    ink: "#2E1A3D",
    slate: "#6B5580",
    indigo: "#7A2FB0",
    cyan: "#1F8FA8",
    candleGreen: "#1B8F5A",
    candleRed: "#C93A50",
    indigoTint1: "#9E6CC8",
    indigoTint2: "#C3A5DE",
    indigoSoft: "#F0E4FA",
    cyanSoft: "#DFF1F5",
    cardBg: "#FBF6FE",
    border: "#C9B3DC",
    muted: "#A38CB8",
  },
};

/**
 * Elevation follows the palette — a black shadow is invisible on black.
 *
 * `glow` is the third state: not height, but ATTENTION. It is the brand indigo
 * spread wide and soft around a card to say "this one, now" — used when one of
 * several identical cards is the one being spoken about. Two layers: a tight
 * ring that draws the edge, and a wide bloom that lifts it off the ground.
 *
 * ⚠ INDIGO, NOT A NEUTRAL. A grey glow reads as a shadow bug; the hue is what
 * makes it read as deliberate. Hue-locked to 247 like every other indigo here.
 *
 * `bloom` is `glow` WITHOUT the ring — for something that already has a border
 * of its own. Using the full `glow` there draws a second edge just outside the
 * first, which reads as a double border rather than as a lit one.
 */
export const SHADOWS: Record<PaletteName, { rest: string; lift: string; glow: string; bloom: string }> = {
  terang: {
    rest: "0 10px 24px rgba(0, 0, 0, 0.05)",
    lift: "0 24px 42px rgba(0, 0, 0, 0.10)",
    glow: "0 0 0 3px rgba(95, 77, 238, 0.55), 0 0 46px 12px rgba(95, 77, 238, 0.34)",
    bloom: "0 0 46px 12px rgba(95, 77, 238, 0.34)",
  },
  gelap: {
    rest: "0 10px 24px rgba(0, 0, 0, 0.45)",
    lift: "0 24px 42px rgba(0, 0, 0, 0.65)",
    glow: "0 0 0 3px rgba(139, 122, 247, 0.65), 0 0 46px 12px rgba(139, 122, 247, 0.40)",
    bloom: "0 0 46px 12px rgba(139, 122, 247, 0.40)",
  },
  kertas: {
    rest: "0 10px 24px rgba(60, 45, 30, 0.06)",
    lift: "0 24px 42px rgba(60, 45, 30, 0.12)",
    glow: "0 0 0 3px rgba(95, 77, 238, 0.50), 0 0 46px 12px rgba(95, 77, 238, 0.30)",
    bloom: "0 0 46px 12px rgba(95, 77, 238, 0.30)",
  },
  ungu: {
    rest: "0 10px 24px rgba(52, 24, 78, 0.10)",
    lift: "0 24px 42px rgba(52, 24, 78, 0.18)",
    glow: "0 0 0 3px rgba(122, 47, 176, 0.55), 0 0 46px 12px rgba(122, 47, 176, 0.34)",
    bloom: "0 0 46px 12px rgba(122, 47, 176, 0.34)",
  },
};

export const theme = {
  /** No fps. It belongs to the Composition — useVideoConfig().fps. */
  canvas: { width: W, height: H },
  margin: MARGIN,
  captionBand: CAPTION_BAND,
  logoZone: LOGO_ZONE,

  stage: {
    active,
    card,
    /** Where a chart may draw inside the card — the right inset leaves room
     *  for the price scale. */
    plot: {
      x: card.x + 64,
      y: card.y + 64,
      w: card.w - 64 - 118,
      h: card.h - 128,
    },
    /** Scene titles: centred in the title strip, clear of the logo zone. */
    title: { x: W / 2, y: active.y + TITLE_H / 2 },
    /** The single row of chips between the card and the subtitle band. */
    caption: { y: card.y + card.h + CAPTION_H / 2 },
  },

  /** Default palette, flattened for components that never swap. Components
   *  that must follow a palette change read usePalette() instead. */
  color: {
    ...PALETTES.terang,
    /**
     * The ONE red allowed outside a candle body, and only in WORDS: naming a
     * mistake. Same red the candles use, so the episode still has exactly one
     * red. Never on drawn chart content.
     */
    warn: "#E5475D",
    indigoWash: "rgba(95, 77, 238, 0.09)",
    /**
     * A price ZONE's fill, and the only reason it is not `indigoWash`: a zone
     * carries no border, so the fill alone has to say "this is an area" — see
     * chart/Annotations.tsx. At 9% it disappeared; at 18% it reads as ground
     * without competing with the candles standing in it.
     */
    zoneFill: "rgba(95, 77, 238, 0.18)",
    indigoWashStrong: "rgba(95, 77, 238, 0.16)",
    cyanWash: "rgba(92, 200, 227, 0.12)",
    slateWash: "rgba(98, 98, 102, 0.08)",
    /**
     * ⚠ HIGHLIGHTER WASHES — for WORDS ONLY, never for chart content.
     *
     * Stronger than the washes above on purpose: those sit behind a whole panel
     * and only have to tint it, while these run behind a few words inside a
     * sentence and have to read as a mark someone made. At 12% they vanished
     * against the type.
     *
     * `hlOrange` is warm, which the locked indigo/cyan palette otherwise does
     * not allow. It is the same amber as the bulb rather than a second warm
     * hue, and like the bulb it is a NAMED slot so nothing else can reach for
     * it: two colours to separate two halves of one definition.
     */
    /**
     * ⚠ A HALO, NOT A DISC. Solid at the middle and gone by the rim, so a
     * drawing standing on the transition grid gets a clear ground under it
     * without a hard circle edge cutting across the lines. Given as a gradient
     * rather than a colour because the fade IS the point — a flat white circle
     * would just be a second shape.
     */
    halo: "radial-gradient(circle, rgba(255,255,255,1) 42%, rgba(255,255,255,0) 70%)",
    /**
     * ⚠ A TEXT SELECTION, NOT A HIGHLIGHTER. Stronger than `indigoWash` because
     * it stands for something a cursor has just dragged over — a selection that
     * whispers reads as a highlight someone forgot to finish.
     */
    selectWash: "rgba(95, 77, 238, 0.22)",
    /** A neutral fill one step darker than white — for a selected row on a
     *  white board, where a tint would claim a meaning the row does not have. */
    greyWash: "#ECECEE",
    hlCyan: "rgba(92, 200, 227, 0.34)",
    /** ⚠ A READING BAND'S FILL — 20%, and deliberately lighter than `hlCyan`.
     *  A band stands over CANDLES rather than behind words, and at a
     *  highlighter's strength it tints the bars it is supposed to be pointing
     *  at. Simon's number. */
    bandCyan: "rgba(92, 200, 227, 0.20)",
    hlOrange: "rgba(242, 166, 59, 0.34)",
    onIndigo: "#FFFFFF",
    /** The transition grid — see core/GridGround.tsx. */
    gridLine: "#C7CCD6",
    gridPaper: "#FFFFFF",
    /**
     * ⚠ THE BULB'S OWN COLOURS, and the one warm pair in the library. A lit
     * bulb that is indigo does not read as lit — the glyph's whole job is to
     * say "notice this", and it says it in the colour light actually is. Kept
     * as named slots so the bulb is the only thing that can reach them: they
     * are NOT a general accent and must not be used for chart content.
     */
    bulb: "#F2A63B",
    bulbGlass: "rgba(242, 166, 59, 0.16)",
    /** The halo behind a lit bulb. Warm, and only ever behind that glyph. */
    bulbGlow: "rgba(247, 188, 94, 0.55)",
  },

  text: {
    family: "Plus Jakarta Sans",
    mono: "JetBrains Mono",
    display: { size: 96, weight: 800 },
    title: { size: 48, weight: 700 },
    body: { size: 36, weight: 500 },
    chip: { size: 36, weight: 600 },
    tag: { size: 30, weight: 600 },
    axis: { size: 26, weight: 500 },
  },

  shape: {
    cardRadius: 24,
    panelRadius: 16,
    chipRadius: 16,
    hairline: 1,
    rule: 2,
    line: 3,
    heavy: 9,
    /**
     * ⚠ FOR CUT-OUT ARTWORK, not for cards. A PNG figure standing on the ground
     * has no box to cast from, so it needs `drop-shadow` (which follows the
     * alpha) rather than `box-shadow` (which would draw a rectangle around the
     * image's bounds).
     *
     * ⚠ THE GRADATION RUNS TOP TO BOTTOM, NOT INNER TO OUTER — Simon's call.
     * A tight tint plus a wide one is a HALO: the colour changes with distance
     * from the silhouette, so it rings the head as much as the feet. Stacking
     * them by VERTICAL OFFSET instead puts violet high on the figure and indigo
     * pooled beneath it, which reads as light falling from above.
     *
     * ⚠ PINK AT THE TOP, CYAN BELOW. Violet-over-indigo was two neighbours on
     * the same hue and the gradation could not be seen at all; pink-to-indigo
     * read, but only just. Pink against cyan is the widest separation the brand
     * allows — cyan is a palette anchor, so only the pink is an outsider, and it
     * lives here in the one file that may name a colour so no scene can reach
     * for it as a general accent.
     */
    artShadow:
      "drop-shadow(0 -6px 14px rgba(236, 92, 168, 0.38)) " +
      "drop-shadow(0 36px 28px rgba(92, 200, 227, 0.46))",
  },

  /**
   * ⚠ SECONDS, NOT FRAMES. Convert with `frames(seconds, fps)`.
   * At 30fps `reveal` was 12 frames; 0.4s reproduces that exactly, and gives
   * 24 frames at 60fps instead of running twice as fast.
   */
  motion: {
    /** The only two curves. `settle` never overshoots. */
    settle: Easing.bezier(0.22, 1, 0.36, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    /** A word fading and rising into place. */
    reveal: 0.4,
    fade: 0.333,
    /** UI elements may pop. Type never does. */
    pop: 0.333,
    /** A scene moves between stage positions over this, eased. It never cuts. */
    move: 0.667,
  },
} as const;

/** Seconds → frames, at the Composition's own fps. The ONLY way a duration
 *  becomes a frame count. */
export const frames = (seconds: number, fps: number) => Math.round(seconds * fps);
