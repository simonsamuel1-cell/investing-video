/**
 * HarbourRoutes — the three ways from Kamu to the house on the simple harbour map (Simon, 2 Nov 2026: "berikan
 * highlight ke 3 jalur ini. Gambar 1 (jembatan), gambar 2 (kapal), Gambar 3 (PEsawat). Gambar 4 adalah lokasi
 * rumahnya"), drawn as VI04's routes are (components/RouteMap.tsx): a dotted indigo line, and a disc on it with the
 * way's icon and its number. The lines come from scripts/vi/harbour-routes.py (data/harbour-routes.json): the walk
 * follows the map's own roads.
 *
 * `paths` are drawn under the house and Kamu, `discs` over them; both place the drawing's units (3598 × 2398, as
 * shown) at (left, top), `k` canvas px per unit, and draw the discs at `mark` of VI04's size.
 */
import { theme, usePalette } from "../../../core";
import ROUTES from "../data/harbour-routes.json";
import { Ico, NumRing } from "./kit";

type P = [number, number];
type Place = { left: number; top: number; k: number };

const ICON = { 1: "t-bridge-i", 2: "t-ferry-i", 3: "t-plane-i" } as Record<number, string>;
const DISC_R = 50;

const on = ({ left, top, k }: Place, [x, y]: number[]): P => [left + x * k, top + y * k];

/** The house's spot on the map: the middle of its footprint. */
export const harbourHouse = (place: Place): P => on(place, ROUTES.house);

export const HarbourRoutePaths = (place: Place) => (
  <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {ROUTES.routes.map((r) => (
      <path
        key={r.n}
        d={r.pts.map((q, i) => `${i ? "L" : "M"}${on(place, q).map((v) => v.toFixed(1)).join(" ")}`).join("")}
        fill="none"
        stroke={theme.color.connector}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 13"
      />
    ))}
  </svg>
);

export const HarbourRouteDiscs = ({ mark, ...place }: Place & { mark: number }) => {
  const c = usePalette();
  return (
    <>
      {ROUTES.routes.map((r) => {
        const [x, y] = on(place, r.disc);
        return (
          <div key={r.n} style={{ position: "absolute", left: x - DISC_R, top: y - DISC_R, width: DISC_R * 2, height: DISC_R * 2, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${mark.toFixed(3)})` }}>
            <Ico name={ICON[r.n]} size={60} tone={theme.color.neutralIcon} />
            <div style={{ position: "absolute", right: -10, top: -10 }}>
              <NumRing n={r.n} size={40} />
            </div>
          </div>
        );
      })}
    </>
  );
};
