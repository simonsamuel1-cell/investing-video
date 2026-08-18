/**
 * LabelChip.tsx — a label that sits on the chart, next to the thing it names.
 *
 * `anchor` decides which side of (x, y) the text hangs on, so a label can be
 * pinned to a sloping line and ride it without ever covering it.
 *
 * IT REFUSES THE LOGO ZONE. A label pinned to a data point near the top right
 * of the chart lands under the logo — and one did, printing "Death Cross"
 * straight through it. Rather than fixing that per scene, the component clamps:
 * any label whose x is inside the logo zone is pushed below it. A chart moves
 * when its data changes; the guard has to live where it cannot be forgotten. `strike`
 * cancels a label the chart has disproved — Scene 10's `Sell?` — by sweeping a
 * rule through it rather than deleting it, because the point is that the claim
 * was made and then failed.
 */
import { theme } from "../theme";
import { textReveal, clamp01 } from "../helpers";

export type Anchor = "above" | "below" | "left" | "right";

export const LabelChip = ({
  text,
  x,
  y,
  f,
  at,
  anchor = "above",
  tone = theme.color.indigo,
  size = theme.text.label.size,
  weight = theme.text.label.weight,
  strike = 0,
  opacity = 1,
}: {
  text: string;
  x: number;
  y: number;
  f: number;
  at: number;
  anchor?: Anchor;
  tone?: string;
  size?: number;
  weight?: number;
  /** 0 → 1 sweeps a rule through the text. */
  strike?: number;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const r = textReveal(f, at);
  const gap = 22;
  const dx = anchor === "left" ? -gap : anchor === "right" ? gap : 0;
  const dy = anchor === "above" ? -gap : anchor === "below" ? gap : 0;
  const tx = anchor === "left" ? "-100%" : anchor === "right" ? "0" : "-50%";
  const ty = anchor === "above" ? "-100%" : anchor === "below" ? "0" : "-50%";
  /** Clamped out of the logo zone — see the header note. */
  const safeY =
    x + dx > theme.logoZone.maxX && y + dy < theme.logoZone.height + size
      ? theme.logoZone.height + size
      : y + dy;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: safeY + r.dy,
        transform: `translate(${tx}, ${ty})`,
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color: tone,
        whiteSpace: "nowrap",
        opacity: r.opacity * opacity,
      }}
    >
      <span style={{ position: "relative" }}>
        {text}
        {strike > 0.001 && (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              width: `${clamp01(strike) * 100}%`,
              height: theme.shape.rule,
              background: tone,
            }}
          />
        )}
      </span>
    </div>
  );
};
