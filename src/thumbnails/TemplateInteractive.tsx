/**
 * Template-Interactive — a trial (24 Nov): four objects Simon can edit by hand in Studio. Every style is a literal on its own
 * element, because that is the only form Studio can write back to; so this file does not read the theme, on purpose.
 */
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const TemplateInteractive: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill showInTimeline={false}
      style={{
        backgroundImage: `url(${staticFile("thumbnail/bg/latar.jpg")})`,
        backgroundSize: "cover",
      }}
    >
      <Img
        name="Orang"
        src={staticFile("art/in01/orang-senang.png")}
        style={{
          position: "absolute",
          left: 1059,
          top: 176,
          width: 782,
          translate: "0px 0px",
          scale: 1,
        }}
      />
      <Interactive.Div
        name="Judul"
        style={{
          position: "absolute",
          left: 96,
          top: 480,
          width: 900,
          fontFamily: "Plus Jakarta Sans",
          fontSize: 100,
          fontWeight: 700,
          lineHeight: 1.14,
          color: "white",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 45], ["0px 60px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: [
              Easing.spring({
                damping: 10,
                mass: 1,
                stiffness: 100,
                overshootClamping: false,
              }),
            ],
          }),
        }}
      >
        Passive Income
      </Interactive.Div>
      <Interactive.Div
        name="Kartu"
        style={{
          position: "absolute",
          left: 96,
          top: 640,
          padding: "20px 40px",
          borderRadius: 24,
          backgroundColor: "white",
          fontFamily: "Plus Jakarta Sans",
          fontSize: 44,
          fontWeight: 600,
          color: "black",
          translate: "440.7px 45.1px",
          scale: 1.53,
        }}
      >
        Contoh kartu
      </Interactive.Div>
    </AbsoluteFill>
  );
};
