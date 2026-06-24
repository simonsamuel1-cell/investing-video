/**
 * TechnicalTabEp — the program. Scenes 1, 2, 7, 8, 9, 10 are INDEPENDENT
 * Sequences. Scenes 3–6 are merged into ONE continuous phone shot
 * (PhoneContinuity, abs 1532→4844) so the recording's scroll never cuts. A
 * persistent #F5F5F5 AbsoluteFill sits behind every Sequence. The VO is external
 * (Premiere) so it is NOT mounted unless MOUNT_VO is flipped for timing preview.
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TIMELINE, ASSETS } from "./timeline";
import { INDEPENDENT, PhoneWalkthrough } from "./scenes";
import { COLORS, MOUNT_VO } from "./theme";

// Scenes 3–9 are ONE shared phone mount (Overall Summary → … → TradingView).
const WALK_FROM = 1532; // S3 from
const WALK_TO = 6824; // S10 from

export const TechnicalTabEp = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Voiceover mounted ONCE at the root — plays from frame 0 across the whole
          episode. Every trigger frame was derived from this file, so the visuals
          are already in sync. MOUNT_VO can be flipped off to render silent. */}
      {MOUNT_VO && <Audio src={staticFile(ASSETS.audio)} />}

      {/* native scenes 1, 2, 10 */}
      {TIMELINE.filter((s) => s.n <= 2 || s.n === 10).map((s) => {
        const Scene = INDEPENDENT[s.n];
        return (
          <Sequence key={s.n} from={s.from} durationInFrames={s.dur} name={`S${s.n} · ${s.gist}`}>
            <Scene />
          </Sequence>
        );
      })}

      {/* S3–S9 — ONE phone, mounted once; screen content cross-dissolves inside */}
      <Sequence from={WALK_FROM} durationInFrames={WALK_TO - WALK_FROM} name="S3–9 · Technical Tab walkthrough (one phone)">
        <PhoneWalkthrough />
      </Sequence>
    </AbsoluteFill>
  );
};
