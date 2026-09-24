/**
 * THE VIDEOS NOT YET APPROVED, one branch.
 *
 * Split off `Module01_-_Technical_Analysis` on 2026-09-24: the TA videos stay
 * there, these five live here. The two branches share no source file: a video
 * owns a folder, and nothing outside that folder is allowed to change when it
 * is edited.
 *
 * Two shapes of folder, because the videos were built in two eras:
 *
 *   1. `src/episodeXxx/`     — self-contained projects; they carry their own
 *                              theme, components and data.
 *   2. `src/Video.tsx` + `src/scenes` + `src/theme.ts` + `src/components`
 *                            — the ORIGINAL Concept Sector base, shared by
 *                              ConceptSectorTutorial, Bandarmology and
 *                              eventDriven, whose branches had it byte for
 *                              byte identical.
 *
 * ⚠ THE SHARED BASE IS SHARED. Editing `src/theme.ts`, `src/scenes/` or
 * `src/components/` changes those three videos at once. The two branches that
 * had FORKED that base — technical-tab and the Concept Sector revision — were
 * given private copies (`episodeTechnicalTab/`, `episodeConceptSectorRev/`)
 * precisely so their edits could not reach back into it.
 *
 * ⚠ COMPOSITION IDS MAY NOT CONTAIN UNDERSCORES, and they must be unique
 * across the whole file — which is why the revision's tutorial is registered
 * as "ConceptSectorTutorial-Rev" rather than under its original id.
 */
import "./index.css";
import { Composition } from "remotion";

// ── the shared Concept Sector base ──────────────────────────────────────────
import { ConceptSectorVideo } from "./Video";
import { DURATION, FPS, FRAME } from "./theme";

// ── migrated: videos that sit on the shared base ────────────────────────────
import { Bandarmology } from "./episodeBandarmology/Composition";
import {
  DURATION as BANDAR_DURATION,
  FPS as BANDAR_FPS,
  FRAME as BANDAR_FRAME,
} from "./episodeBandarmology/theme";
import { EventDrivenVideo } from "./episodeEventDriven/Composition";

// ── migrated: videos with a private copy of the base ────────────────────────
import { TechnicalTabEp } from "./episodeTechnicalTab/Video";
import {
  DURATION as TT_DURATION,
  FPS as TT_FPS,
  FRAME as TT_FRAME,
} from "./episodeTechnicalTab/theme";
import {
  ConceptSectorVideo as ConceptSectorVideoRev,
  PreviousCut,
} from "./episodeConceptSectorRev/Video";
import {
  DURATION as CSR_DURATION,
  FPS as CSR_FPS,
  FRAME as CSR_FRAME,
} from "./episodeConceptSectorRev/theme";

// ── migrated: self-contained projects ───────────────────────────────────────
import { MyComposition as FairValueComposition } from "./episodeFairValue/Composition";
import { waitUntilDone as fairValueFontsReady } from "./episodeFairValue/fonts";

/** Fair Value waited on its own font load before rendering; it still does. */
fairValueFontsReady();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ═══ Concept Sector ═══════════════════════════════════════════════ */}
      <Composition
        id="ConceptSectorTutorial"
        component={ConceptSectorVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={FRAME.width}
        height={FRAME.height}
      />
      {/* The LATER cut of the same video, from the Concept-Sector-Revision
          branch. Kept beside the original rather than replacing it: the two
          are different edits and only Simon can say which is current. */}
      <Composition
        id="ConceptSectorTutorial-Rev"
        component={ConceptSectorVideoRev}
        durationInFrames={CSR_DURATION}
        fps={CSR_FPS}
        width={CSR_FRAME.width}
        height={CSR_FRAME.height}
      />
      {/* Reference only — the full PREVIOUS cut, to scrub for timestamps. */}
      <Composition
        id="ConceptSector-PreviousCut"
        component={PreviousCut}
        durationInFrames={6928}
        fps={CSR_FPS}
        width={CSR_FRAME.width}
        height={CSR_FRAME.height}
      />
      {/* ═══ Bandarmology ═════════════════════════════════════════════════ */}
      <Composition
        id="Bandarmology"
        component={Bandarmology}
        durationInFrames={BANDAR_DURATION}
        fps={BANDAR_FPS}
        width={BANDAR_FRAME.width}
        height={BANDAR_FRAME.height}
      />
      {/* ═══ Event-Driven Trading ═════════════════════════════════════════ */}
      <Composition
        id="eventDriven"
        component={EventDrivenVideo}
        durationInFrames={6370}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ═══ Technical Tab ════════════════════════════════════════════════ */}
      <Composition
        id="TechnicalTabPreview"
        component={TechnicalTabEp}
        durationInFrames={TT_DURATION}
        fps={TT_FPS}
        width={TT_FRAME.width}
        height={TT_FRAME.height}
      />
      {/* ═══ Fair Value ═══════════════════════════════════════════════════ */}
      <Composition
        id="FairValue2"
        component={FairValueComposition}
        durationInFrames={6919}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
