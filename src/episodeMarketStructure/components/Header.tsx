/**
 * Header — the scene title, and an optional sub-line under it.
 *
 * Left-aligned at the safe margin and parked in the top band, which keeps it
 * clear of the 360×150 logo zone: the title would have to run past x 1368 to
 * reach the mark, and none of them are close.
 *
 * Type never pops. It fades and rises — textReveal, the only entrance allowed
 * for words in this episode.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { textReveal } from "../helpers";
import { HEADER } from "../layout";

export const Header = ({
  title,
  sub,
  startFrame = 0,
  subFrame,
  x = HEADER.x,
  y = HEADER.y,
  opacity = 1,
  align = "left",
}: {
  title: string;
  sub?: string;
  startFrame?: number;
  subFrame?: number;
  x?: number;
  y?: number;
  opacity?: number;
  align?: "left" | "center";
}) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  const a = textReveal(f, startFrame);
  const b = textReveal(f, subFrame ?? startFrame + 10);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: align === "center" ? "translate(-50%, -50%)" : "translate(0, -50%)",
        textAlign: align === "center" ? "center" : "left",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: pal.ink,
          opacity: a.opacity,
          transform: `translateY(${a.y}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 8,
            fontSize: theme.type.label.size,
            fontWeight: 500,
            color: pal.slate,
            opacity: b.opacity,
            transform: `translateY(${b.y}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};
