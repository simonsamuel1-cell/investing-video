/**
 * LabelChip.tsx — a label that sits on the chart, next to the thing it names.
 *
 * `anchor` decides which side of (x, y) the text hangs on, so a label can be
 * pinned to a sloping line and ride it without ever covering it.
 *
 * IT REFUSES THE LOGO ZONE. A label pinned to a data point near the top right
 * lands under the logo — and one did. Rather than fixing that per scene, the
 * component clamps: any label whose x is inside the logo zone is pushed below
 * it. A chart moves when its data changes; the guard has to live where it
 * cannot be forgotten.
 */
import { theme } from "../theme";
import { textReveal } from "../helpers";

export type Anchor = "above" | "below" | "left" | "right";

export const LabelChip = ({
  text,
  x,
  y,
  f,
  at,
  anchor = "above",
  tone = theme.colors.indigo,
  size = theme.type.labelSm.size,
  weight = theme.type.label.weight,
  gap = 22,
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
  gap?: number;
  opacity?: number;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const r = textReveal(f, at);
  const dx = anchor === "left" ? -gap : anchor === "right" ? gap : 0;
  const dy = anchor === "above" ? -gap : anchor === "below" ? gap : 0;
  const tx = anchor === "left" ? "-100%" : anchor === "right" ? "0" : "-50%";
  const ty = anchor === "above" ? "-100%" : anchor === "below" ? "0" : "-50%";
  const logoMaxX = theme.layout.width - theme.layout.logoZoneW - 192;
  const safeY =
    x + dx > logoMaxX && y + dy < theme.layout.logoZoneH + size
      ? theme.layout.logoZoneH + size
      : y + dy;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: safeY,
        transform: `translate(${tx}, ${ty}) ${r.transform}`,
        fontFamily: theme.type.family,
        fontSize: size,
        fontWeight: weight,
        color: tone,
        whiteSpace: "nowrap",
        opacity: r.opacity * opacity,
      }}
    >
      {text}
    </div>
  );
};
