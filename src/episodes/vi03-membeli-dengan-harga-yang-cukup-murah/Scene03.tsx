/**
 * VI03 · Scene 3, the v3 build in a composition of its own (Simon, 17 Nov: "maksudku adalah duplikat visual tadi, lalu pisahkan
 * composition, karna ada beberapa yang bagus untuk diambil"). The Full comp plays Simon's own SC03 (IbuSariSendiri.tsx);
 * this one plays the one-layout build (IbuSariBuild.tsx) over the same VO, subtitles, logo and cuts: the episode started at
 * SC03's first frame and stopped at SC04's. No intro, no BGM. Frame 0 here = Studio 3597 of the Full comp.
 *
 * After it, 60 frames of the traced two-floor office on its own (Simon 18 Nov: "Kantornya coba pisahin dulu deh, masukin ke
 * VI03-Scene03 aja. Buat 60 frame baru di paling belakang"), as tall as the safe area lets it (Simon 18 Nov: "gedein sampe
 * height fit ke layar (awas safe margin)"): its lines from the logo zone's foot (the roof runs past the zone's maxX, so it
 * cannot rise into the top 150 px) to the subtitle band's top, centred across.
 */
import { Sequence, useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, useMotion } from "../../core";
import { MembeliCukupMurahComposition } from "./Composition";
import { BoardGrid, ease } from "./components/kit";
import { COMPANY_TWO_FLOORS, CompanyTwoFloors, companyBuildParts } from "./components/CompanyTwoFloors";
import { BLOCK } from "./data/timing";
import { SC03 as SC03_BUILD } from "./scenes/IbuSariBuild";

const SC03_LEN = BLOCK.SC04 - BLOCK.SC03;
/** the build-up (COMPANY_BUILD, three quick steps), then a hold: 3 s in all */
const OFFICE = { frames: 180, clear: 6 };
export const VI03_SC03_FRAMES = SC03_LEN + OFFICE.frames;

const OfficeAlone = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const [x0, y0, x1, y1] = COMPANY_TWO_FLOORS.ink;
  /** 6 px clear of both edges, so the lines' anti-aliasing stays out of the logo zone and the subtitle band */
  const top = theme.logoZone.height + OFFICE.clear;
  const k = (theme.captionBand.top - OFFICE.clear - top) / (y1 - y0);
  return (
    <Stage>
      <SoftGround f={0} />
      <BoardGrid g={0} on={1} />
      <div style={{ position: "absolute", left: theme.canvas.width / 2 - ((x0 + x1) / 2) * k, top: top - y0 * k }}>
        <CompanyTwoFloors
          width={COMPANY_TWO_FLOORS.w * k}
          parts={companyBuildParts((s) => ease(f, m.sec(s), m.reveal), k)}
        />
      </div>
    </Stage>
  );
};

export const MembeliCukupMurahScene03 = () => (
  <>
    <Sequence from={-BLOCK.SC03} durationInFrames={BLOCK.SC04} name="VI03 · from SC03 (v3)">
      <MembeliCukupMurahComposition scenes={{ SC03: SC03_BUILD }} />
    </Sequence>
    <Sequence from={SC03_LEN} durationInFrames={OFFICE.frames} name="Office (traced), alone">
      <OfficeAlone />
    </Sequence>
  </>
);
