/**
 * PhoneScreens — the phone frame VI04 shows app screens in (SC06's four investor types; the same frame as SC09's).
 * The screen takes the screenshots' own shape (1125×2436), so a capture fills it without cropping; each screen
 * fades up over the one before it on its `at`.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { theme, useMotion, usePalette, useShadow } from "../../../core";
import { ease } from "./kit";

export const SHOT_RATIO = 1125 / 2436;
const BEZEL = 12;

export const phoneWidth = (h: number) => Math.round((h - 2 * BEZEL) * SHOT_RATIO) + 2 * BEZEL;

export const PhoneScreens = ({ cx, y, h, screens }: { cx: number; y: number; h: number; screens: { src: string; at: number }[] }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const sh = h - 2 * BEZEL;
  const sw = Math.round(sh * SHOT_RATIO);
  const w = sw + 2 * BEZEL;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: y, width: w, height: h, borderRadius: 52, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrand}` }}>
      <div style={{ position: "absolute", left: BEZEL, top: BEZEL, width: sw, height: sh, borderRadius: 40, overflow: "hidden", background: theme.color.neutralDisc }}>
        {screens.map((s, i) => {
          const p = i === 0 ? 1 : ease(f, s.at, m.reveal);
          if (p <= 0.001) return null;
          return <Img key={s.src} src={staticFile(s.src)} style={{ position: "absolute", left: 0, top: 0, width: sw, height: sh, maxWidth: "none", objectFit: "cover", opacity: p, transform: `translateY(${((1 - p) * 14).toFixed(2)}px)` }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: w / 2 - 40, top: BEZEL + 8, width: 80, height: 20, borderRadius: 999, background: theme.color.neutralDisc }} />
    </div>
  );
};
