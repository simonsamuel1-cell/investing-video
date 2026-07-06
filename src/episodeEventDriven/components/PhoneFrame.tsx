/**
 * PhoneFrame — holder for an app screen recording/screenshot. Until the real
 * asset is supplied it renders a documented placeholder with a visible
 * [NEEDS ASSET] label (spec §7 — never fake app UI as real). When `img`/`video`
 * is provided the capture is shown verbatim inside the bezel (no recolouring).
 */
import { Img, OffthreadVideo, staticFile } from "remotion";
import { theme } from "../theme";

const c = theme.colors;
const ASPECT = 980 / 1920; // screen content w:h

export const PhoneFrame = ({
  cx,
  top,
  height,
  op = 1,
  img,
  video,
  label = "[NEEDS ASSET]",
  caption,
}: {
  cx: number;
  top: number;
  height: number; // device body height
  op?: number;
  img?: string;
  video?: string;
  label?: string;
  caption?: string;
}) => {
  const screenH = height - 12;
  const screenW = Math.round(screenH * ASPECT);
  const bodyW = screenW + 12;
  const left = cx - bodyW / 2;

  return (
    <div style={{ position: "absolute", left, top, width: bodyW, height, opacity: op }}>
      {/* device body / bezel */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: theme.colors.ink, boxShadow: "0 18px 45px rgba(0,0,0,0.16)" }} />
      {/* screen */}
      <div style={{ position: "absolute", left: 6, top: 6, width: screenW, height: screenH, borderRadius: 24, overflow: "hidden", background: img || video ? theme.colors.text : theme.colors.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        {video ? (
          <OffthreadVideo src={staticFile(video)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : img ? (
          <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <>
            <div style={{ padding: "8px 18px", borderRadius: theme.radius.chip, border: `2px dashed ${c.grey}`, color: c.grey, fontSize: 24, fontWeight: theme.font.weights.extrabold, letterSpacing: 0.5 }}>{label}</div>
            {caption && <div style={{ width: "78%", textAlign: "center", color: c.greyLight, fontSize: 20, fontWeight: theme.font.weights.semibold }}>{caption}</div>}
          </>
        )}
      </div>
    </div>
  );
};
