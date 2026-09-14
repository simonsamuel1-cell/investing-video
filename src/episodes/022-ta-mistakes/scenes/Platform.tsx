/**
 * SC06 · THE PLATFORM.  `from 4047 · to 5031`
 *
 * ⚠ IT IS VIDEO 19'S PANEL, NOT A COPY OF IT — Simon: "replace dengan visual di
 * composition Moving Average 170. Copy paste persis aja". `BrokerPanel` is
 * already exported from 019's Scene01, so the way to have that picture exactly
 * is to draw it, not to reproduce it. A second copy would be two drawings of
 * one thing that could only ever drift apart.
 *
 * ⚠ FROZEN ON 170, and frozen is what "the visual at 170" means: the frame is
 * handed in rather than read off the clock, so nothing here can wander into the
 * beats 019 has after it — the structure, the average, the bands.
 *
 * ⚠ WITHOUT THE ZIGZAG OR ITS HL/HH/LH/LL LABELS — Simon. They begin on exactly
 * frame 170 in 019, so at rest they would be invisible anyway; `structure` is
 * passed off regardless, because a thing that is hidden by luck is a thing that
 * comes back the day the number moves.
 *
 * ⚠ THE WINDOW IS ON BBCA, AND IT HAS TO BE NAMED — Simon. Which chart 019
 * shows is decided by the frame, and the frame where the list is open and
 * settled is 15 frames past the one where BBCA hands over to BBRI. Holding a
 * single frame, the two could not both be had, so the name is passed instead of
 * hunted for.
 *
 * ⚠ THE RIGHT-HAND EXTENSION IS A PORTFOLIO HERE, NOT A WATCHLIST — Simon. The
 * panel is showing what somebody owns, so the prices come off and the two
 * columns that are left get named. That is `portfolio` on BrokerPanel, opt-in
 * and off by default, so 019 is untouched.
 *
 * ⚠ THE "Ilustrasi" TAG STAYS, and has to. The prices on that panel are
 * invented on a real ticker, and the tag is the only thing on screen saying so.
 * Simon's standing rule against the word is about labels this project adds to
 * its own drawings; this one is a disclosure.
 */
import { useCurrentFrame } from "remotion";
import {
  DashedBox, cutInStyle, dashOpenAt, progress, progressInOut, ramp, theme,
  useMotion, usePalette,
} from "../../../core";
import { BrokerPanel } from "../../019-moving-average/scenes/Scene01";
import { BLOCK, BUYS, PLAT, PLATFORM, PLATFORM_CUT } from "../data/timing";

/** ⚠ 019'S OWN FRAME NUMBER. That episode runs at 30fps and this one at 60, so
 *  this is not a frame of THIS timeline and must never be derived from one. */
const AT = 170;

/**
 * ═══ THE PORTFOLIO'S P&L ═══  (Simon)
 *
 * ⚠ THESE ARE POSITIONS, NOT THE MARKET. The panel's header still shows BBCA's
 * day (+0,40%), and it should: what a stock did today and what a holder is down
 * on it are different numbers, and the difference is the scene's whole point —
 * five of six holdings under water while every name on the board is green.
 *
 * ⚠ ILLUSTRATIVE, AND COVERED. Real tickers with invented positions, on a panel
 * that carries the "Ilustrasi" tag for exactly this reason.
 *
 * ⚠ TYPOGRAPHIC MINUS, not a hyphen. Simon typed "-14,97%"; the panel's own
 * TLKM row has always read "−0,38%", and one column with both glyphs in it is a
 * column that looks broken.
 */
/**
 * ⚠ THE BOX SITS IN THE ROOM THE SHRINK OPENS, and is solved from it. 019's
 * panel ends at y 900; scaled about the frame's centre it ends at 540 +
 * (900 − 540) × by, and the subtitle band starts at 972. The box is centred in
 * what is left, so it cannot land on either.
 */
const BOX = (() => {
  const floor = 540 + (900 - 540) * PLAT.shrink.by;
  const w = 760;
  const h = 108;
  return { x: (theme.canvas.width - w) / 2, y: (floor + theme.captionBand.top) / 2 - h / 2, w, h };
})();

const PNL = {
  BBCA: "−14,97%",
  BBRI: "−9,81%",
  BMRI: "−3,14%",
  TLKM: "−4,25%",
  ASII: "−18,11%",
  ANTM: "+3,29%",
};

/**
 * ⚠ THE SENTENCE THE SHRINK MAKES ROOM FOR — Simon, verbatim. It is the answer
 * to a board where every name is green and five of six holdings are not: the
 * act this scene keeps showing is not the only move available.
 */
const NOTE = "Tidak trading juga keputusan";

const Note = ({ g }: { g: number }) => {
  const m = useMotion();
  const c = usePalette();
  /** ⚠ THE TYPING WAITS FOR THE FRAME TO SNAP OPEN. `dashOpenAt` is the one
   *  answer to "when may my content start". */
  const open = dashOpenAt(PLAT.note.at, m);
  const shown = NOTE.slice(0, Math.floor(ramp(g, open, NOTE.length * PLAT.note.perChar) * NOTE.length));
  return (
    <DashedBox x={BOX.x} y={BOX.y} w={BOX.w} h={BOX.h} at={PLAT.note.at - BLOCK.SC06}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.text.family,
          fontSize: theme.text.body.size,
          fontWeight: 800,
          color: c.ink,
          whiteSpace: "nowrap",
        }}
      >
        {shown}
      </div>
    </DashedBox>
  );
};

export const Platform = () => {
  const f = useCurrentFrame();
  /**
   * ⚠ GLOBAL FRAMES. A scene inside a Sequence sees its own rebased frame, and
   * 4282 is written in the timeline's numbers, so the scene's `from` has to go
   * back on before anything is asked about it.
   *
   * ⚠ BOTH AT ONCE — Simon: the camera cut AND a fade. They are written to land
   * on the same frame; given different lengths they would read as a slide with
   * a fade happening near it rather than as one arrival.
   */
  const g = f + BLOCK.SC06;
  const shown = progress(g, PLATFORM.at, PLATFORM.fade);

  /** ⚠ THE WINDOW CHANGES NAME AT 4501, and the two charts CROSS-FADE rather
   *  than cut: `chart` says which one the header and the selected row are
   *  about, `alpha` says what is drawn, so a panel held on one frame can still
   *  swap the way 019's own does. */
  const swap = progress(g, PLAT.swap.at, PLAT.swap.over);
  /** ⚠ ONE FADE FOR EVERYTHING DRAWN *ON* THE CHART — Simon: at 4775 all the
   *  lines go. The chart itself is not one of them. */
  const ink = 1 - progress(g, PLAT.clear.at, PLAT.clear.over);
  /** ⚠ THE PANEL SHRINKS ABOUT THE FRAME'S CENTRE, which is what makes the room
   *  it shrinks to make appear UNDER it rather than around it. */
  const small = 1 - (1 - PLAT.shrink.by) * progressInOut(g, PLAT.shrink.at, PLAT.shrink.over);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: shown,
        ...cutInStyle(g, PLATFORM_CUT),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${small.toFixed(4)})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
        }}
      >
        <BrokerPanel
          f={AT}
          structure={false}
          portfolio
          chart={swap >= 0.5 ? "BBRI" : "BBCA"}
          alpha={(t) => (t === "BBRI" ? swap : t === "BBCA" ? 1 - swap : 0)}
          pnl={PNL}
          /** ⚠ THE TIMING IS THIS EPISODE'S, THE GEOMETRY IS 019'S. The swings
           *  are known inside that panel and nowhere else, so it draws them;
           *  when each one lands is a beat in THIS timeline, so we decide. */
          /** ⚠ BBCA ONLY — Simon: no Buy labels on BBRI. They belong to the
           *  name that was being traded at every turn, and they leave with it
           *  when the window changes at 4501. */
          marks={{
            text: "Buy",
            shown: (k, t) =>
              t === "BBCA" ? progressInOut(g, BUYS.at + k * BUYS.step, BUYS.over) * ink : 0,
          }}
          /** ⚠ THE SHAPE WITHOUT THE NAMING — the HL/HH/LH/LL labels stay off,
           *  as they have been since this panel arrived. */
          zig={{ drawn: progressInOut(g, PLAT.zig.at, PLAT.zig.over), opacity: ink }}
          levels={{ shown: progressInOut(g, PLAT.levels.at, PLAT.levels.over), opacity: ink }}
        />
      </div>
      <Note g={g} />
    </div>
  );
};
