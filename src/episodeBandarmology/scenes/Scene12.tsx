/**
 * Scene 12 — Nego market (2849, dur 249). Real app capture (portrait phone)
 * showing the negotiated-deals / nego record. Header caption beside the phone.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone, Chip } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene12 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 1060, top: 240, width: 700, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Big deals arranged off the normal screen still leave a record.
      </div>

      <CapturePhone cx={620} top={150} height={800} op={fadeIn(f, 10, 18)} imageLayers={[{ src: "bandarmology/scene12.jpg", op: 1 }]} />

      <div style={{ position: "absolute", left: 1060, top: 460 }}>
        <Chip label="Nego Market" variant="indigo" bounce delay={60} />
      </div>
    </SafeArea>
  );
};
