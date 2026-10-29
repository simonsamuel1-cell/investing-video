/**
 * PhoneScreens — the phone frame VI04 shows app screens in (SC06's four investor types; the same frame as SC09's).
 * The screen takes the screenshots' own shape (1125×2436), so a capture fills it without cropping; each screen
 * fades up over the one before it on its `at`. `ratio` (screen width / height) defaults to those captures; VI07 passes
 * its own for a stitched shot, and puts a screen recording in as `children` (drawn over the screens, under the notch).
 * `island` sizes the notch pill (× its 80×20) and tints it; VI07 SC05 grows it with a phone that changes size.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { theme, useMotion, usePalette, useShadow } from "../../../core";
import { ease } from "./kit";

export const SHOT_RATIO = 1125 / 2436;
export const PHONE_BEZEL = 12;
const BEZEL = PHONE_BEZEL;

export const phoneWidth = (h: number) => Math.round((h - 2 * BEZEL) * SHOT_RATIO) + 2 * BEZEL;

export const PhoneScreens = ({ cx, y, h, screens = [], ratio = SHOT_RATIO, island, children }: { cx: number; y: number; h: number; screens?: { src: string; at: number }[]; ratio?: number; island?: { k: number; tone: string }; children?: React.ReactNode }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const sh = h - 2 * BEZEL;
  const sw = Math.round(sh * ratio);
  const w = sw + 2 * BEZEL;
  const ik = island?.k ?? 1;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: y, width: w, height: h, borderRadius: 52, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrand}` }}>
      <div style={{ position: "absolute", left: BEZEL, top: BEZEL, width: sw, height: sh, borderRadius: 40, overflow: "hidden", background: theme.color.neutralDisc }}>
        {screens.map((s, i) => {
          const p = i === 0 ? 1 : ease(f, s.at, m.reveal);
          if (p <= 0.001) return null;
          return <Img key={s.src} src={staticFile(s.src)} style={{ position: "absolute", left: 0, top: 0, width: sw, height: sh, maxWidth: "none", objectFit: "cover", opacity: p, transform: `translateY(${((1 - p) * 14).toFixed(2)}px)` }} />;
        })}
        {children}
      </div>
      <div style={{ position: "absolute", left: w / 2 - 40 * ik, top: BEZEL + 8 * ik, width: 80 * ik, height: 20 * ik, borderRadius: 999, background: island?.tone ?? theme.color.neutralDisc }} />
    </div>
  );
};
