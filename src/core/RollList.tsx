/**
 * core/RollList.tsx — a list that rolls, with one item current.
 *
 * The alternative to a tab row when the choices are a SEQUENCE rather than a
 * set: the list scrolls upward so the current item stays put and the ones
 * around it move past, the way a picker drum does.
 *
 * ═══ ONLY THREE ARE EVER VISIBLE ═══
 *
 * The current item, the one before it and the one after — nothing else, at any
 * point in the roll. That is the whole reason to use this instead of a static
 * list: a list that shows all of its items has already told the viewer how it
 * ends, and the roll is then only decoration. Showing three says "there is one
 * before and one after" without saying how many more.
 *
 * ⚠ THE CURRENT ITEM DOES NOT MOVE. Everything is positioned by its distance
 * from the current one, so the eye has a fixed place to read and the motion
 * happens around it. A roll that also moves the item you are reading is a
 * scroll, and a scroll has to be re-found every time it stops.
 *
 * ⚠ SIZE IS A SCALE, NOT A FONT SIZE. Every item is set at the largest size it
 * will ever have and scaled down; interpolating `fontSize` re-lays out the text
 * on every frame, and at these sizes the letters visibly crawl.
 */
import { useCurrentFrame, interpolate, interpolateColors } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress } from "./helpers";

/** A piece of one item, with the colour it takes ONCE CURRENT. Unselected, the
 *  whole item is the same grey whatever its segments say — a dimmed item that
 *  keeps its colours is not dimmed, it is just smaller. */
export type RollSeg = { text: string; color?: string };

export const RollList = ({
  items,
  select,
  at,
  x,
  y,
  lead,
  size,
  grow = 4,
  weight = 700,
  dim = 0.55,
  roll,
  anchor = "left",
}: {
  items: (string | RollSeg[])[];
  /** The frame each item becomes the current one. `select[0]` may be in the
   *  past — the list opens already showing its first item as current. */
  select: number[];
  /** The frame the list itself arrives on. */
  at: number;
  x: number;
  /** The CURRENT item's centre. Everything else is placed relative to it. */
  y: number;
  lead: number;
  /** The size of an item that is NOT current. */
  size: number;
  /** How much bigger the current one is. */
  grow?: number;
  weight?: number;
  /** A neighbour's opacity. The current item is always fully opaque. */
  dim?: number;
  /** How long one roll takes, in frames. */
  roll: number;
  anchor?: "left" | "center";
}) => {
  const f = useCurrentFrame();
  const c = usePalette();

  /**
   * ⚠ THE POSITION IS CONTINUOUS, NOT AN INDEX. `pos` eases from 0 to 1 to 2 as
   * each item's frame passes, so size, colour, opacity and offset are all read
   * off the SAME number and cannot disagree mid-roll — which is what makes an
   * item fade out at exactly the moment it leaves.
   */
  const pos = select.reduce((a, s, i) => (i === 0 ? a : a + progress(f, s, roll)), 0);
  const arrive = progress(f, at, roll);
  if (arrive <= 0.001) return null;

  const full = size + grow;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: arrive }}>
      {items.map((item, i) => {
        const segs: RollSeg[] = typeof item === "string" ? [{ text: item }] : item;
        const d = i - pos;
        const away = Math.abs(d);
        /** 1 on the current item, 0 by the time it is a neighbour. */
        const near = Math.max(0, 1 - away);
        /** 1 out to the neighbours, gone by the time it is two away. */
        const vis = Math.max(0, Math.min(1, 2 - away));
        if (vis <= 0.001) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + d * lead + (1 - arrive) * lead * 0.4,
              transform: `translate(${anchor === "center" ? "-50%" : "0"}, -50%) scale(${(
                (size + grow * near) /
                full
              ).toFixed(4)})`,
              transformOrigin: anchor === "center" ? "50% 50%" : "0% 50%",
              whiteSpace: "nowrap",
              fontFamily: theme.text.family,
              fontSize: full,
              fontWeight: weight,
              opacity: vis * interpolate(near, [0, 1], [dim, 1]),
            }}
          >
            {segs.map((seg, j) => (
              <span
                key={j}
                style={{
                  whiteSpace: "pre",
                  color: interpolateColors(
                    near,
                    [0, 1],
                    [c.muted, seg.color ?? theme.color.indigo],
                  ),
                }}
              >
                {seg.text}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
