/**
 * GaugeBubble — a magnified "Overall Summary" gauge card (pre-bordered crop)
 * floated over the phone to call out a reading (90% Bullish / 58% Neutral /
 * 30% Bearish). The card art is real app capture; the gauge's own colours live
 * inside the capture, so no directional colour is drawn natively.
 */
import { Img, staticFile } from "remotion";

const CARD_ASPECT = 2192 / 1112; // ≈1.97 (w:h), shared by all three crops

export const GaugeBubble = ({
  src,
  cx,
  y,
  w,
  opacity = 1,
  scale = 1,
}: {
  src: string;
  cx: number;
  y: number;
  w: number;
  opacity?: number;
  scale?: number;
}) => {
  const h = Math.round(w / CARD_ASPECT);
  return (
    <div
      style={{
        position: "absolute",
        left: Math.round(cx - w / 2),
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        filter: "drop-shadow(0 22px 48px rgba(95,77,238,0.22))",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};
