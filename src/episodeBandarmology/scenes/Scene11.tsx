/**
 * Scene 11 — Broker Flow + Trade Flow — worked example #2 (2502, dur 327).
 * Real app captures (portrait phone): Flow → Insider Trades → Shareholders,
 * cross-dissolving in a device frame as the VO names each public-data source.
 * Header + a source label beside the phone. Data date is burned into the capture.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type } = theme;

const insiderAt = 110;
const shareAt = 220;

export const Scene11 = () => {
  const f = useCurrentFrame();
  const insiderOp = fadeIn(f, insiderAt, 16);
  const shareOp = fadeIn(f, shareAt, 16);

  const label = f >= shareAt ? "Shareholders" : f >= insiderAt ? "Insider Trades" : "Broker & Foreign Flow";

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 96, width: 900, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Public Data Tracks
      </div>

      <CapturePhone
        cx={640}
        top={200}
        height={760}
        op={fadeIn(f, 10, 18)}
        imageLayers={[
          { src: "bandarmology/scene11-flow.jpg", op: 1 },
          { src: "bandarmology/scene11-insider.jpg", op: insiderOp },
          { src: "bandarmology/scene11-shareholders.jpg", op: shareOp },
        ]}
      />

      <div style={{ position: "absolute", left: 1080, top: 440, width: 700, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.slate }}>
        The tracks big players leave, one screen at a time:
        <div style={{ fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.indigo, marginTop: 18 }}>{label}</div>
      </div>
    </SafeArea>
  );
};
