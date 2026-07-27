/**
 * Scene14B — from 9674, duration 196 (6.53s). The SC14A chart frozen; a
 * RevealCurtain slides in to hide everything right of the 9 Jun candle, then a
 * 3-2-1 countdown in the concealed zone. Stillness is the scene.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { SourceTag } from "../components/SourceTag";
import { RevealCurtain } from "../components/RevealCurtain";
import { BbriAxis, BbriCandles, bcx, SLOT } from "../components/BbriChart";
import { BBRI, BBRI_IDX } from "../data/bbri-placeholder";
import { theme } from "../theme";
import { sec, progress } from "../helpers";

const CURTAIN_X = bcx(BBRI_IDX.jun9) + SLOT;
const T = { curtain: 0.8, three: 3.2, two: 4.1, one: 5.0, clear: 5.9 };

const Numeral = ({ n, at, f }: { n: string; at: number; f: number }) => {
  const start = sec(at);
  const op = interpolate(f, [start, start + 8, start + sec(0.9) - 4, start + sec(0.9)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pop = interpolate(f, [start, start + 8], [0.86, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.motion.ease });
  if (op <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: (CURTAIN_X + theme.canvas.width) / 2, top: 560, transform: `translate(-50%, -50%) scale(${pop})`, fontFamily: theme.type.family, fontSize: 96, fontWeight: 800, color: theme.colors.ink, opacity: op }}>
      {n}
    </div>
  );
};

export const Scene14B = () => {
  const f = useCurrentFrame();
  const jun9 = BBRI[BBRI_IDX.jun9];
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 60 }}>
        <div style={{ fontFamily: theme.type.family, fontSize: theme.type.headline.size, fontWeight: theme.type.headline.weight, color: theme.colors.ink }}>BBRI</div>
        <div style={{ display: "flex", gap: 28, marginTop: 6 }}>
          <span style={{ fontSize: theme.type.body.size, color: theme.colors.slate }}>Bank Rakyat Indonesia</span>
          <span style={{ fontSize: theme.type.label.size, color: theme.colors.slate }}>June 2026</span>
        </div>
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        <BbriAxis prices={[jun9.high, (BBRI[BBRI_IDX.jun8].close + jun9.close) / 2, BBRI[BBRI_IDX.jun8].low]} />
        <BbriCandles staticUpto={BBRI_IDX.jun9} />
      </svg>
      <RevealCurtain x={CURTAIN_X} slideProgress={f >= sec(T.curtain) ? progress(f, sec(T.curtain), sec(0.9)) : 0} />
      {f < sec(T.clear) && (
        <>
          <Numeral n="3" at={T.three} f={f} />
          <Numeral n="2" at={T.two} f={f} />
          <Numeral n="1" at={T.one} f={f} />
        </>
      )}
      <SourceTag />
    </SafeArea>
  );
};
