/**
 * CapturePhone — device frame holding a REAL app capture (portrait 980×1920).
 * Either a muted looping-free <OffthreadVideo> (`video`) or one/more cross-
 * dissolving stills (`imageLayers`). Captures are shown verbatim (no redraw); the
 * app's own data + date are already burned into the image, so no Illustration tag.
 */
import { Img, OffthreadVideo, staticFile } from "remotion";
import { theme } from "../theme";

const { colors, radius } = theme;
const ASPECT = 980 / 1920;

export const CapturePhone = ({
  cx = 960,
  top = 150,
  height = 800,
  video,
  imageLayers,
  op = 1,
}: {
  cx?: number;
  top?: number;
  height?: number;
  video?: string;
  imageLayers?: { src: string; op: number }[];
  op?: number;
}) => {
  const bezel = 6;
  const screenW = Math.round(height * ASPECT);
  const bodyW = screenW + bezel * 2;
  const bodyH = height + bezel * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - bodyW / 2,
        top: top - bezel,
        width: bodyW,
        height: bodyH,
        background: colors.text,
        borderRadius: radius.lg + 10,
        padding: bezel,
        boxSizing: "border-box",
        opacity: op,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: radius.md, overflow: "hidden", background: colors.cardWhite }}>
        {video && <OffthreadVideo src={staticFile(video)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        {imageLayers?.map((l, i) => (
          <Img key={i} src={staticFile(l.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: l.op }} />
        ))}
      </div>
    </div>
  );
};
