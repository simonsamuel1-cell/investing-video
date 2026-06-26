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
import { COLORS, MOUNT_VO, VO_CUT, VO_PAD } from "./theme";

// Scenes 3–9 are ONE shared phone mount (Overall Summary → … → TradingView).
const WALK_FROM = 1532; // S3 from
const WALK_TO = 7387; // S10 from (+20 pad, +907 insert, −443 delete, +79 S9 freeze-extend)

// S5–6 VO revision (Simon, 26 Jun): the new VO is INSERTED at frame 3703 (907f).
// No old narration is deleted — the old VO after 3703 is pushed +907f later and
// resumes from where it left off (source 3683). Everything downstream ripples
// +907f (DURATION, S10, and the phone video — see PhoneWalkthrough).
const NEW_VO_AT = 3703;
const NEW_VO_LEN = 907; // ≈30.25s
// Deletion (Simon, 26 Jun): remove audio [4609, 5052] (443f) and ripple the rest.
const DEL_FROM = 4609; // 2.33.19
const DEL_TO = 5052; // 2.48.12
// source frame the old VO resumes from after the deletion (old clip-C source at
// timeline DEL_TO = DEL_TO − VO_PAD − NEW_VO_LEN).
const RESUME_SRC = DEL_TO - VO_PAD - NEW_VO_LEN; // 4125

export const TechnicalTabEp = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Voiceover — the file is CUT at frame VO_CUT (1594) with VO_PAD (20f) of
          silence inserted there (Simon, 25 Jun): clip A plays 0→cut, clip B plays
          cut→end starting VO_PAD frames later. Everything after the cut therefore
          sits 20f later, matched by the 20f phone-video freeze in PhoneWalkthrough.
          MOUNT_VO can be flipped off to render silent. */}
      {MOUNT_VO && (
        <>
          {/* old VO, part 1: 0 → 1594 */}
          <Audio src={staticFile(ASSETS.audio)} trimAfter={VO_CUT} />
          {/* old VO, part 2: 1614 → 3703 (source 1594 → 3683) */}
          <Sequence from={VO_CUT + VO_PAD} durationInFrames={NEW_VO_AT - (VO_CUT + VO_PAD)}>
            <Audio src={staticFile(ASSETS.audio)} trimBefore={VO_CUT} trimAfter={NEW_VO_AT - VO_PAD} />
          </Sequence>
          {/* NEW VO inserted: 3703 → 4609 (ends at the deletion point) */}
          <Sequence from={NEW_VO_AT} durationInFrames={DEL_FROM - NEW_VO_AT}>
            <Audio src={staticFile(ASSETS.newVo3703)} />
          </Sequence>
          {/* old VO resumes AFTER the deleted [4609,5052] stretch: from frame
              DEL_FROM, source RESUME_SRC → end (the [3683,4125] old VO is removed). */}
          <Sequence from={DEL_FROM}>
            <Audio src={staticFile(ASSETS.audio)} trimBefore={RESUME_SRC} />
          </Sequence>
        </>
      )}
      {/* native scenes 1, 2, 10 */}
      {TIMELINE.filter((s) => s.n <= 2 || s.n === 10).map((s) => {
        const Scene = INDEPENDENT[s.n];
        return (
          <Sequence
            key={s.n}
            from={s.from}
            durationInFrames={s.dur}
            name={`S${s.n} · ${s.gist}`}>
            <Scene />
          </Sequence>
        );
      })}
      {/* S3–S9 — ONE phone, mounted once; screen content cross-dissolves inside */}
      <Sequence
        from={WALK_FROM}
        durationInFrames={WALK_TO - WALK_FROM}
        name="S3–9 · Technical Tab walkthrough (one phone)"
        style={{
          translate: "2px 0px"
        }}>
        <PhoneWalkthrough />
      </Sequence>
    </AbsoluteFill>
  );
};
