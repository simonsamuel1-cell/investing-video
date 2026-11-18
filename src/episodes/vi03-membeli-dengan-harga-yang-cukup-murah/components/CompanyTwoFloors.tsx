import type React from "react";
import { usePalette } from "../../../core";
import ART from "../data/companyTwoFloorsClean.json";

/**
 * The two-floor company cutaway, as clean vectors instead of the ChatGPT PNG (Simon 18 Nov: "Bisa ga kamu buat ulang gambar
 * ini? Trace gambarnya dengan code?", then "audit lagi gambar ini, dan smoothen garis2 nya … garisnya buat jadi lurus … samain
 * ketebalannya … samain semua kotak normal … Baca tiap pixel nya").
 *
 * Everything but the people is redrawn as geometry by scripts/vi/office-clean.py, every number read off the PNG's pixels
 * (scripts/vi/office_measure.py): straight lines, one stroke weight per kind of line, repeated things made the same. The people
 * stay traced (scripts/vi/trace-groups.py, smoothed; regions in data/company-two-floors.regions.json). To rebuild:
 *
 *   python3 scripts/vi/trace-groups.py public/art/vi03/line/company-two-floors.png \
 *     src/episodes/vi03-membeli-dengan-harga-yang-cukup-murah/data/company-two-floors.regions.json \
 *     src/episodes/vi03-membeli-dengan-harga-yang-cukup-murah/data/companyTwoFloors.json
 *   python3 scripts/vi/office-clean.py src/episodes/vi03-membeli-dengan-harga-yang-cukup-murah/data/companyTwoFloors.json \
 *     src/episodes/vi03-membeli-dengan-harga-yang-cukup-murah/data/companyTwoFloorsClean.json
 *
 * Parts (ids), back to front: latar (the building's white inside), gedung, ventilasi, mesin, konveyor, lampu-atas-1…3,
 * meja-laptop, lampu-bawah-1…3, jam, papan, pintu, ilmuwan, pekerja-meja, wanita-tablet, presenter, tamu. The robot, the
 * receptionist and the two boxes left of the building are gone (Simon 18 Nov: "remove aja").
 */
type Shape =
  | { t: "rect"; x: number; y: number; w: number; h: number; rx: number; sw: number; fill: string }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; sw: number; cap: string; color: string }
  | { t: "circle"; cx: number; cy: number; r: number; sw: number; fill: string }
  | { t: "ellipse"; cx: number; cy: number; rx: number; ry: number; sw: number; fill: string }
  | { t: "path"; d: string; sw: number; fill: string; color: string; cap: string };

export type CompanyPartId = (typeof ART.groups)[number]["id"];
/** Per part: opacity, an ink colour instead of black, a shift in the drawing's own pixels (1752 × 897), a scale about its middle. */
export type CompanyPart = { opacity?: number; fill?: string; dx?: number; dy?: number; scale?: number };
/** `ink`: the lines' bounding box [x0, y0, x1, y1] in the drawing's pixels — what to fit to a space. */
export const COMPANY_TWO_FLOORS = { w: ART.w, h: ART.h, ink: ART.ink, parts: ART.groups.map((g) => ({ id: g.id, label: g.label })) };

/**
 * The build-up (Simon 18 Nov: "animate muncul satu per satu, mulai dari framenya (background kantor), lalu peralatannya, lalu
 * orang-orangnya", "tambah scale dari kecil ke normal", then "Animasinya terlalu lama ya, jadi … gedung kantornya dulu, semua
 * peralatan, lalu semua orang"): three steps — the building, all the equipment together, all the people together; each part
 * fades in, rises and grows from 80 % to its size. `at` in seconds from its start.
 */
export const COMPANY_BUILD = [
  { at: 0, gap: 0, parts: ["latar", "gedung", "ventilasi"] },
  {
    at: 0.45,
    gap: 0,
    parts: ["mesin", "konveyor", "lampu-atas-1", "lampu-atas-2", "lampu-atas-3", "meja-laptop", "lampu-bawah-1", "lampu-bawah-2", "lampu-bawah-3", "jam", "papan", "pintu"],
  },
  { at: 0.9, gap: 0, parts: ["ilmuwan", "pekerja-meja", "wanita-tablet", "presenter", "tamu"] },
] as const;
/** when the last part starts, in seconds — the build-up lasts this plus one part's reveal */
export const COMPANY_BUILD_LAST = Math.max(...COMPANY_BUILD.map((s) => s.at + (s.parts.length - 1) * s.gap));
const BUILD_MOVE = { rise: 14, from: 0.8 };
/** The parts at a moment of the build-up: `p(s)` = how far in (0–1) a part that starts `s` seconds in is; `k` = screen px per
 * drawing px (the rise is 14 screen px). */
export const companyBuildParts = (p: (s: number) => number, k: number): Record<string, CompanyPart> =>
  Object.fromEntries(
    COMPANY_BUILD.flatMap((step) =>
      step.parts.map((id, i) => {
        const v = p(step.at + i * step.gap);
        return [id, { opacity: v, dy: ((1 - v) * BUILD_MOVE.rise) / k, scale: BUILD_MOVE.from + (1 - BUILD_MOVE.from) * v }];
      }),
    ),
  );

type Cap = "round" | "butt" | "square";

const Draw = ({ s, ink, paper }: { s: Shape; ink: string; paper: string }) => {
  const tone = (v: string) => (v === "ink" ? ink : v === "white" ? paper : v);
  const stroke = s.sw ? { stroke: ink, strokeWidth: s.sw } : {};
  switch (s.t) {
    case "rect":
      return <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} fill={tone(s.fill)} {...stroke} />;
    case "line":
      return <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={tone(s.color)} strokeWidth={s.sw} strokeLinecap={s.cap as Cap} />;
    case "circle":
      return <circle cx={s.cx} cy={s.cy} r={s.r} fill={tone(s.fill)} {...stroke} />;
    case "ellipse":
      return <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={tone(s.fill)} {...stroke} />;
    case "path":
      return s.sw ? (
        <path d={s.d} fill={tone(s.fill)} stroke={tone(s.color)} strokeWidth={s.sw} strokeLinecap={s.cap as Cap} strokeLinejoin="round" />
      ) : (
        <path d={s.d} fill={tone(s.fill)} />
      );
  }
};

export const CompanyTwoFloors = ({ width, parts = {}, style }: { width: number; parts?: Partial<Record<string, CompanyPart>>; style?: React.CSSProperties }) => {
  const c = usePalette();
  const height = (width * ART.h) / ART.w;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${ART.w} ${ART.h}`} style={{ display: "block", overflow: "visible", ...style }}>
      {ART.groups.map((g) => {
        const p = parts[g.id] ?? {};
        if ((p.opacity ?? 1) <= 0.001) return null;
        const ink = p.fill ?? c.ink;
        return (
          <g
            key={g.id}
            data-part={g.id}
            opacity={p.opacity ?? 1}
            style={{ transformBox: "fill-box", transformOrigin: "center", transform: `translate(${p.dx ?? 0}px, ${p.dy ?? 0}px) scale(${p.scale ?? 1})` }}
          >
            {(g.shapes as Shape[]).map((s, i) => (
              <Draw key={`s${i}`} s={s} ink={ink} paper={c.cardBg} />
            ))}
            {/* a traced person: their own white inside first (it covers what stands behind them), then their lines */}
            {g.fill.length ? (
              <g transform={ART.transform} fill={c.cardBg}>
                {g.fill.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            ) : null}
            {g.d.length ? (
              <g transform={ART.transform} fill={ink}>
                {g.d.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            ) : null}
            {(g.over as Shape[]).map((s, i) => (
              <Draw key={`o${i}`} s={s} ink={ink} paper={c.cardBg} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};
