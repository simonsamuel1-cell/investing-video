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
const WALK_TO = 6844; // S10 from (+20: 20f VO pad inserted at 1594)

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
          <Audio src={staticFile(ASSETS.audio)} trimAfter={VO_CUT} />
          <Sequence from={VO_CUT + VO_PAD}>
            <Audio src={staticFile(ASSETS.audio)} trimBefore={VO_CUT} />
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
