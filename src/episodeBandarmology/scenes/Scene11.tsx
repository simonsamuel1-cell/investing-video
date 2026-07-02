/**
 * Scene 11 — Public data tracks (comp 2618, dur 228). Preceded by the DataTitle
 * card (2514–2618). Keeps the phone (real app captures, cross-dissolving
 * flow → insider → shareholders); the header/label are removed. Four data-source
 * points appear beside-right of the phone, then all visuals fade out by 2846.
 * Frame = comp − 2618.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, textReveal } from "../helpers";

const { colors, font, type } = theme;

// four points (scene-local frames: comp − 2618)
const POINTS = [
  { label: "Broker net buying", at: 2635 - 2618 }, // 17
  { label: "Foreign flows", at: 2682 - 2618 }, // 64
  { label: "Insider trades", at: 2725 - 2618 }, // 107
  { label: "Number of shareholders", at: 2774 - 2618 }, // 156
];

export const Scene11 = () => {
  const f = useCurrentFrame();
  const phoneOp = Math.min(fadeIn(f, 0, 16), fadeOut(f, 214, 14)); // in at 2618, out by 2846
  const insiderOp = fadeIn(f, 107, 16); // capture cross-dissolves with the points
  const shareOp = fadeIn(f, 156, 16);

  return (
    <SafeArea>
      <CapturePhone
        cx={640}
        top={200}
        height={760}
        op={phoneOp}
        imageLayers={[
          { src: "bandarmology/scene11-flow.jpg", op: 1 },
          { src: "bandarmology/scene11-insider.jpg", op: insiderOp },
          { src: "bandarmology/scene11-shareholders.jpg", op: shareOp },
        ]}
      />

      {/* four data-source points, beside-right of the phone */}
      <div style={{ position: "absolute", left: 1120, top: 320, width: 660, display: "flex", flexDirection: "column", gap: 40 }}>
        {POINTS.map((p) => {
          const rev = textReveal(f, p.at, 16);
          return (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                fontSize: type.subhead,
                fontWeight: font.weights.bold,
                color: colors.text,
                transform: rev.transform,
                opacity: Math.min(rev.opacity, fadeOut(f, 214, 14)),
              }}
            >
              <span style={{ width: 16, height: 16, borderRadius: 999, background: colors.indigo, flex: "0 0 auto" }} />
              {p.label}
            </div>
          );
        })}
      </div>
    </SafeArea>
  );
};
