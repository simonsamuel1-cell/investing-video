/**
 * SceneEntryTags — the four "entry point" tags as a persistent progress row above the
 * phones, from NV 2598 through 6000, highlighting ONE tag at a time as each phone clip
 * plays. Frame = scene-local (0 at NV 2598).
 *   #1 "You Saw a Stock Online" @2598 (local 0)
 *   #2 "You Read a Headline"    @3178 (local 580)
 *   #3 "A Stock Is Spiking"     @4139 (local 1541)
 *   #4 "You're Exploring"       @5049 (local 2451)
 * Active tag = indigo, bold, +2px border, glow. The rest are light gray. The switch is
 * immediate (no cross-fade) — at each onset the active tag flips instantly.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fontFamily } from "../fonts";
import { fadeIn, fadeOut } from "../util/anim";

const TAGS = [
  "1. You Saw a Stock Online",
  "2. You Read a Headline",
  "3. A Stock Is Spiking",
  "4. You're Exploring",
];
// scene-local onsets (global frame − 2598).
const ONSETS = [0, 580, 1541, 2451];
const GRAY = "#B6BBC4"; // light gray for the inactive tags

// Same vertical spot as before: bottom edge sits 20px above the phones' visual top
// (PH_TOP 137 + 51), then nudged up 15px → bottom 927.
const BOTTOM = 1080 - (137 + 51 - 20) + 15;

export const SceneEntryTags = ({ total }: { total: number }) => {
  const f = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < ONSETS.length; i++) if (f >= ONSETS[i]) active = i;
  const op = Math.min(fadeIn(f, 0, 14), fadeOut(f, total - 14, 14));
  return (
    <AbsoluteFill style={{ fontFamily, opacity: op }}>
      <div style={{ position: "absolute", left: 96, right: 96, bottom: BOTTOM, display: "flex", justifyContent: "center", gap: 44 }}>
        {TAGS.map((t, i) => {
          const on = i === active;
          return (
            <div
              key={t}
              style={{
                // padding compensates the border change so the pill size stays put
                padding: on ? "6px 14px" : "8px 16px",
                borderRadius: 999,
                border: `${on ? 4 : 2}px solid ${on ? COLORS.purple : GRAY}`,
                color: on ? COLORS.purple : GRAY,
                fontSize: 24,
                fontWeight: on ? 700 : 400,
                whiteSpace: "nowrap",
                boxShadow: on ? "0 0 16px rgba(95,77,238,0.55)" : "none",
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
