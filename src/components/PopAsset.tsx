/**
 * PopAsset — renders a supplied PNG (badge or highlight) VERBATIM at native
 * aspect, driven by the shared popLife lifecycle. The asset already carries its
 * own indigo border/styling, so nothing is drawn around it except a soft shadow.
 * Pass either `w` or `h`; the other is derived from `aspect` (w:h).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { popLife } from "../helpers";

export const PopAsset = ({
  src,
  cx,
  y,
  aspect,
  w,
  h,
  inAt,
  outAt,
}: {
  src: string;
  cx: number;
  y: number;
  aspect: number; // width / height
  w?: number;
  h?: number;
  inAt: number;
  outAt?: number;
}) => {
  const frame = useCurrentFrame();
  const width = w ?? (h as number) * aspect;
  const height = h ?? (w as number) / aspect;
  const life = popLife(frame, inAt, outAt);

  return (
    <div
      style={{
        position: "absolute",
        left: Math.round(cx - width / 2),
        top: y,
        width,
        height,
        opacity: life.opacity,
        transform: `scale(${life.scale})`,
        transformOrigin: "center center",
        // No added shadow — supplied PNGs are used verbatim (any shadow they
        // carry is baked in; we neither add nor remove it).
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};
