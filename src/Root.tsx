import { Composition } from "remotion";
import { MarketStructureComposition, TOTAL_FRAMES } from "./episode19marketstructure/Composition";
import { MarketStructureComposition as SecondBuild, TOTAL_FRAMES as SECOND_FRAMES } from "./episode20marketstructure/Composition";

/**
 * Two INDEPENDENT builds of the same VO-locked spec, side by side.
 *
 * `MarketStructure` is the first build (src/episode19marketstructure).
 * `MarketStructure2` is a second, written from scratch against the same brief
 * (src/episode20marketstructure) — its own theme, its own components, its own
 * shape engine. Nothing is shared between the two folders, so editing one can
 * never move the other.
 *
 * Composition ids cannot contain underscores.
 */
export const Root = () => (
  <>
    <Composition id="MarketStructure" component={MarketStructureComposition} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="MarketStructure2" component={SecondBuild} durationInFrames={SECOND_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
