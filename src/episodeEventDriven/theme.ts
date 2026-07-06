/**
 * Theme for the "Event-Driven Investing" episode (id "eventDriven").
 * Single source of truth: no scene may hardcode a colour, weight, easing or
 * layout number — everything is a named key here. Re-exports the shared brand
 * tokens, overrides the background to #F5F5F5 for this episode, and adds a few
 * hue-locked tints (indigo hue 247 / cyan hue 192). Candle bodies are the ONLY
 * place red/green is allowed in drawn content.
 */
import { COLORS, FPS } from "../theme";
import { fontFamily } from "../fonts";

export const theme = {
  bg: "#F5F5F5", // bright silver (this episode)
  fps: FPS,

  colors: {
    bg: "#F5F5F5",
    text: "#000000",
    white: "#FFFFFF",

    // brand (hue-locked)
    indigo: COLORS.purple, // #5F4DEE (247)
    cyan: COLORS.cyan, // #5CC8E3 (192)

    // hue-locked tints (saturation/lightness only)
    indigoLight: COLORS.purpleLight, // #8F82F3
    indigoDark: COLORS.purpleDark, // #4636B8
    indigoWash: COLORS.purpleWash, // rgba(95,77,238,0.10)
    indigoTint: "rgba(95,77,238,0.06)",
    cyanLight: COLORS.cyanLight, // #8FDAED
    cyanDark: COLORS.cyanDark, // #3A9DB8
    cyanWash: COLORS.cyanWash, // rgba(92,200,227,0.12)
    cyanTint: "rgba(92,200,227,0.07)",

    // candle bodies ONLY — the sole place red/green enters drawn content
    candleGreen: "#22B573",
    candleRed: "#E5475D",

    // neutral diagram ink + greys
    ink: COLORS.ink, // #3A3D44
    grey: "#8A8D94",
    greyLight: "#B7BAC0",
    greyWash: "rgba(58,61,68,0.06)",
    line: COLORS.hairline, // #C9CCD2
    hairline: "#DCDDE1",
    cardBg: "#FFFFFF",
    cardBorder: "#E4E5E9",
  },

  font: {
    family: fontFamily,
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // corner radii by context (spec §1)
  radius: {
    xs: 6,
    sm: 10,
    chip: 18,
    stat: 20,
    card: 28,
    panel: 36,
  },

  border: { thin: 1, regular: 2 },

  // fixed layout contract (spec §1) — same across every scene
  layout: {
    width: 1920,
    height: 1080,
    marginL: 96,
    marginR: 96,
    marginT: 54,
    marginB: 108, // subtitle zone — always empty
    logoClearW: 360, // top-right reserve — always empty
    logoClearH: 150,
  },
} as const;

// convenience: the usable content box
export const AREA = {
  x: theme.layout.marginL,
  y: theme.layout.marginT,
  w: theme.layout.width - theme.layout.marginL - theme.layout.marginR, // 1728
  h: theme.layout.height - theme.layout.marginT - theme.layout.marginB, // 918
  cx: theme.layout.width / 2, // 960
  right: theme.layout.width - theme.layout.marginR, // 1824
  bottom: theme.layout.height - theme.layout.marginB, // 972
} as const;
