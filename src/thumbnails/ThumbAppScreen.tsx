import type React from "react";
import { Img, staticFile } from "remotion";
import { theme } from "../core";

/**
 * IN04's thumbnail visual: the app's four investment-style result screens, side by side, in the order the video ends on them
 * (Profiles.tsx): Guardian Achiever, Stable Architech, Bold Leader, Strategic Master. No Orang Tuntun (Simon 23 Nov: first
 * "kasih thumbnail screenshot Bold Leader aja", then "orang Tuntunnya remove deh, lalu kasih 4 screenshot nya aja").
 *
 * The screenshots are the video's own (art/in04/types, 1125 × 2436) with ONE thing taken out: the name in the header's greeting
 * "Hi Simon" ("nama Simon dihapus deh", then "sisain Hi nya") — the "Hi" stays. The copies in public/thumbnail/in04 have the
 * name painted over with the header's own colour, column by column between the row above and the row below; the video's
 * originals are untouched. Nothing else is redrawn.
 *
 * Each is shown from its top, rounded like a phone screen, with the thumbnail's card shadow; alternate ones stand a little
 * higher, so the four read as separate screens rather than one strip. Together they run from x 740 to the right safe margin.
 */
const SCREENS = ["guardian-achiever", "stable-architech", "bold-leader", "strategic-master"] as const;
const SHOT = { w: 1125, h: 2436 };
const ROW = { left: 740, w: 253, h: 500, gap: 24, top: 300, lift: 40, r: 30 };

export const In04ThumbAppScreens: React.FC = () => (
  <>
    {SCREENS.map((name, i) => (
      <div
        key={name}
        style={{
          position: "absolute",
          left: ROW.left + i * (ROW.w + ROW.gap),
          top: ROW.top - (i % 2) * ROW.lift,
          width: ROW.w,
          height: ROW.h,
          borderRadius: ROW.r,
          overflow: "hidden",
          boxShadow: theme.shape.thumbCardShadow,
        }}
      >
        <Img src={staticFile(`thumbnail/in04/${name}.jpg`)} style={{ position: "absolute", left: 0, top: 0, width: ROW.w, height: (SHOT.h * ROW.w) / SHOT.w, maxWidth: "none", display: "block" }} />
      </div>
    ))}
  </>
);
