/**
 * HarbourMap — Simon's reference map (docs/vi-style/refs/starry-harbour-map.webp, 2 Nov 2026: "Bikin still object
 * dulu deh, taro dulu di stickman walk … Retrace semuanya, nanti aku arahkan mana aja yang perlu di buang"), traced to
 * vectors at 2x with vtracer (public/art/vi04/harbour-map.svg). Every path carries `data-g`, the one thing on the map
 * it belongs to — the title's four lines, each place name, each pin, each building and ship, the trees, the route, the
 * waves, the compass, and each pin's number apart from its pin (num-<n>) — so dropping one is one name in `hide`, and
 * a whole family is its prefix with a star ("label-*").
 *
 * ONE file in the trace's own order, not a file per object: the trace is stacked (later shapes over earlier ones), and
 * re-stacking it by object put patches of ground over the roads.
 *
 * `simple` (Simon, 2 Nov: "simplify aja mapnya, buat lebih smooth") is the ground alone, redrawn rather than traced —
 * one smooth water shape, the roads as smoothed centre lines at one width, joined where they broke, and the waves
 * (scripts/vi/simplify-harbour-map.py → harbour-map-simple.svg; tags land, water, road, waves).
 */
import { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { theme } from "../../../core";
import { NEUTRAL } from "./Islands";

/** Each drawing's own size: the trace is the reference at 2x; the simple one is that turned 90° clockwise (Simon,
 *  2 Nov: "rotate 90 derajat ke kanan"). */
export const HARBOUR_SIZE = { traced: { w: 2398, h: 3598 }, simple: { w: 3598, h: 2398 } } as const;

/** The simple drawing's road width, in its own units (scripts/vi/simplify-harbour-map.py ROAD_W). */
export const HARBOUR_ROAD_W = 28;

/** The two drawings: the full trace, and the ground alone redrawn simple. */
export const HARBOUR_SRC = { traced: "art/vi04/harbour-map.svg", simple: "art/vi04/harbour-map-simple.svg" } as const;

/** Every object the map is split into. */
export const HARBOUR_LAYERS = [
  "base",
  "waves",
  "route",
  "trees",
  "bld-m-plus",
  "bld-k11-musea",
  "bld-palace-museum",
  "bld-kai-tak",
  "bld-bauhinia",
  "bld-ferris-wheel",
  "ship-cruise",
  "ship-yacht",
  "pin-s",
  "pin-1",
  "pin-2",
  "pin-3",
  "pin-4",
  "pin-5",
  "pin-6",
  "pin-7",
  "pin-8",
  "pin-9",
  "pin-10",
  "pin-11",
  "pin-19",
  "pin-20",
  "num-1",
  "num-2",
  "num-3",
  "num-4",
  "num-5",
  "num-6",
  "num-7",
  "num-8",
  "num-9",
  "num-10",
  "num-11",
  "num-19",
  "num-20",
  "label-sham-shui-po",
  "label-kowloon-city",
  "label-mong-kok",
  "label-kowloon-bay",
  "label-route-2",
  "label-north-point",
  "label-central",
  "label-causeway-bay",
  "title-starry",
  "title-harbour-cruise",
  "title-chinese",
  "title-tagline",
  "compass",
] as const;
export type HarbourLayer = (typeof HARBOUR_LAYERS)[number];
/** One object by name, or a family by its prefix. */
export type HarbourHide = HarbourLayer | "title-*" | "label-*" | "bld-*" | "ship-*" | "pin-*" | "num-*" | SimpleLayer;
/** The simple drawing's tags. */
type SimpleLayer = "land" | "water" | "road" | "bridge";

/** A colour per tag (`land`, `water`, `waves`, `road`, `bridge` …): every fill and stroke of that tag's paths. */
export type HarbourPaint = Readonly<Record<string, string>>;
const NO_PAINT: HarbourPaint = {};
/** The simple drawing in VI04's route-map colours, not the reference's own (Simon, 2 Nov: "peta yang di stickman walk
 *  yang dibenerin ke warna peta yang di VI04"): `land` (the card's white), grey water with white ripples, pale grey
 *  roads, the bridge in the old route map's bridge grey. */
export const harbourPaint = (land: string): HarbourPaint => ({ land, water: NEUTRAL.right, waves: NEUTRAL.top, road: NEUTRAL.left, bridge: theme.color.houseNFrame });

/** The map `h` tall at its own aspect, its top-left at (x, y); `hide` drops objects by name; `paint` recolours by tag. */
export const HarbourMap = ({ x, y, h, hide = [], paint = NO_PAINT, version = "traced" }: { x: number; y: number; h: number; hide?: readonly HarbourHide[]; paint?: HarbourPaint; version?: keyof typeof HARBOUR_SRC }) => {
  const w = (HARBOUR_SIZE[version].w * h) / HARBOUR_SIZE[version].h;
  const [svg, setSvg] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("harbour map"));
  useEffect(() => {
    fetch(staticFile(HARBOUR_SRC[version]))
      .then((r) => r.text())
      .then((t) => {
        setSvg(t);
        continueRender(handle);
      });
  }, [handle, version]);
  const shown = useMemo(() => {
    if (!svg || (hide.length === 0 && Object.keys(paint).length === 0)) return svg;
    const drop = (g: string) => hide.some((k) => (k.endsWith("*") ? g.startsWith(k.slice(0, -1)) : g === k));
    return svg.replace(/<path data-g="([^"]+)"[^>]*\/>/g, (whole, g: string) => {
      if (drop(g)) return "";
      const to = paint[g];
      return to ? whole.replace(/ (fill|stroke)="(?!none")[^"]*"/g, ` $1="${to}"`) : whole;
    });
  }, [svg, hide, paint]);
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h }} dangerouslySetInnerHTML={shown ? { __html: shown } : undefined} />;
};
