/**
 * SectionTitle.tsx — a heading that OUTLIVES the scene it started in.
 *
 * "Moving Average" is not Scene 02's title; it is the title of the stretch of
 * the episode that Scenes 02, 03 and 04 all sit inside. So it cannot live in
 * any of them: a scene's title is unmounted with the scene, and the cut at
 * 1839 would sweep it out and a fresh one would rise back into the same place
 * a few frames later — the viewer would watch the same word leave and return.
 *
 * It is therefore mounted at the composition root, in a Sequence spanning the
 * whole stretch, and it takes NO camera cut except the one that ends the run.
 * The scenes move underneath it; it does not move with them.
 */
import { useCurrentFrame } from "remotion";
import { TitleChip } from "./TitleChip";
import { type Cut, cutOut, cutBlur } from "../transitions/CameraCut";

export const SectionTitle = ({
  text,
  from,
  exit,
  at = 2,
}: {
  text: string;
  /** The global frame this heading is mounted at, so it can read the cut. */
  from: number;
  /** The cut that ends the run — the ONE the heading rides. */
  exit: Cut;
  at?: number;
}) => {
  const f = useCurrentFrame();
  const g = f + from;
  const dy = cutOut(g, exit);
  const blur = cutBlur(g, exit);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateY(${dy}px)`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      <TitleChip text={text} f={f} at={at} />
    </div>
  );
};
