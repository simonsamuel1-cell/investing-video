/**
 * SC10 · INDICATOR OVERLOAD.  `from 8270 · to 9110`
 *
 * ⚠ IT IS VIDEO 19'S PANEL, NOT A COPY OF IT — Simon: "gunakan chart yang ada
 * indikator2 di MovingAverage019 frame 510". The same `BrokerPanel` SC06 holds
 * on frame 170 is held here on 510: the frame where BMRI is in the window with
 * its average and its bands already on. Drawing it is the only way to have that
 * picture exactly; a second copy would be two drawings of one thing that could
 * only ever drift apart.
 *
 * ⚠ WITHOUT THE WATCHLIST — Simon: "jangan include watchlist ya di sebelah
 * kanan ya". The column is long since open by 510, so this could never have
 * been had by choosing an earlier frame; `extension` turns it off and gives its
 * 400px back to the chart.
 *
 * ⚠ AND THEN EVERYTHING ELSE PILES ON, which is the scene. A zigzag over the
 * structure, a support and a resistance, and three studies under the price —
 * seven readings of one tape, arriving one after another on the sentence that
 * says adding more of them does not add analysis.
 *
 * ⚠ NOTHING COLLIDES, AND THAT IS GEOMETRY RATHER THAN LUCK — Simon: "secara
 * design, jangan ada yang bertabrakan". The three panes are paid for by the
 * price plot, which shrinks; the panel is as tall as the sum of its stack; the
 * month row moves to the foot; and each study's name sits in the price axis's
 * own gutter, left of where the first candle starts. See STUDY in 019's
 * Scene01, where all four of those numbers live together.
 *
 * ⚠ SUPPORT AND RESISTANCE ARE HIDDEN FOR NOW — Simon: "coba hide dulu garis
 * support dan resistance nya", while he settles the chart. The `levels` prop is
 * simply not passed; PANEL10.levels still holds their timing, so this is one
 * line to put back rather than a thing to rebuild.
 *
 * ⚠ AND THE PANEL'S WALLS ARE DOWN, for now. The white card, its border and
 * its wash are off, so the chart stands on the episode's own ground with
 * nothing boxing it in, and the ticker has moved up to the logo's line. This is
 * scaffolding Simon asked for while he rearranges — `bare` is one word to undo.
 *
 * ⚠ THE "Ilustrasi" TAG STAYS, and has to — the same disclosure SC06 carries.
 * The prices on that panel are invented on a real ticker, and the tag is the
 * only thing on screen saying so. Simon's standing rule against the word is
 * about labels this project adds to its own drawings; this one is a disclosure.
 */
import { useCurrentFrame } from "remotion";
import {
  DashedBox, dashOpenAt, progressInOut, ramp, theme, useMotion, usePalette,
} from "../../../core";
import { BrokerPanel, PANEL, STUDY } from "../../019-moving-average/scenes/Scene01";
import { PANEL10 } from "../data/timing";
import { Scribble } from "./Scribble";

/** ⚠ 019'S OWN FRAME NUMBER. That episode runs at 30fps and this one at 60, so
 *  this is not a frame of THIS timeline and must never be derived from one. */
const AT = 510;

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = PANEL10;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE BOX IS CENTRED IN THE SAFE AREA, not on the canvas. The bottom 108px is
 * the subtitle band, so the frame's own middle is 54px below the middle of what
 * this episode is allowed to draw in — and a box centred on the canvas would
 * sit visibly low above a caption.
 */
const NOTE_BOX = (() => {
  const w = 900;
  const h = 132;
  const A = theme.stage.active;
  return { x: (theme.canvas.width - w) / 2, y: A.y + (A.h - h) / 2, w, h };
})();

/** The scene's closing line, typed into the box once it has snapped open. */
const Note = ({ g }: { g: number }) => {
  const m = useMotion();
  const c = usePalette();
  /** ⚠ THE TYPING WAITS FOR THE FRAME. `dashOpenAt` is the one answer to "when
   *  may my content start" — text that begins while the box is still a sliver
   *  is text hanging in the air. */
  const open = dashOpenAt(V.note.at, m);
  const shown = V.note.text.slice(
    0,
    Math.floor(ramp(g, open, V.note.text.length * V.note.perChar) * V.note.text.length),
  );
  return (
    <DashedBox {...NOTE_BOX} at={V.note.at - V.at}>
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

export const Overload = () => {
  const f = useCurrentFrame();
  /** ⚠ GLOBAL FRAMES. The table is written in the timeline's numbers and a
   *  scene inside a Sequence sees its own, so `from` goes back on first. */
  const g = f + V.at;
  const p = (q: { at: number; over: number }) => progressInOut(g, q.at, q.over);

  /** ⚠ ONE FADE OVER EVERYTHING, scrawl included — Simon: "setelah itu semua
   *  visualnya fade out". What is being cleared is the whole attempt, not the
   *  chart with its verdict left standing on top of it. */
  const gone = 1 - progressInOut(g, V.clear.at, V.clear.over);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, opacity: gone }}>
      <BrokerPanel
        f={AT}
        chart="BMRI"
        extension={false}
        bare
        build={{
          /** ⚠ WIDTH FIRST, THEN HEIGHT — Simon: "dari titik di tengah, terus
           *  width nya memanjang, terus heightnya memanjang". Two moves on one
           *  window, so the second starts where the first ends. */
          win: {
            w: progressInOut(g, V.win.at, V.win.over),
            h: progressInOut(g, V.win.at + V.win.over, V.win.over),
          },
          tape: p(V.tape),
          ma: p(V.ma),
          bb: p(V.bb),
          /** 1 while the chart fills the window, 0 once it has made room. */
          fit: 1 - p(V.shrink),
        }}
        zig={{ drawn: p(V.zig) }}
        studies={{
          shown: (i) => progressInOut(g, V.studies.at + i * V.studies.step, V.studies.over),
        }}
      />
      {/* ⚠ THE WINDOW IT COVERS IS 019'S OWN BOX, read from there rather than
          typed here: the panel decides where it is, and a second copy of that
          rectangle would be a scrawl that misses the day it moves. */}
      {/* ⚠ THE SCRAWL IS THE WINDOW'S SIZE, AND NOTHING CUTS IT — Simon, over
          two turns: "jangan di masking", then "seukuran windownya aja… aku
          gamau bentrok sama logo dan subtitle". Those are one instruction, not
          two: fitted to the window it needs no mask, its edges stay ragged
          loops, and it cannot reach the logo or the captions because the window
          does not. The rectangle is read from 019 rather than typed here, so
          the scrawl follows the window if it ever moves. */}
      <Scribble
        box={{ x: PANEL.x, y: PANEL.y, w: PANEL.w, h: STUDY.height }}
        drawn={progressInOut(g, V.scribble.at, V.scribble.over)}
      />
      </div>
      {/* ⚠ OUTSIDE THE FADE, because it arrives after it. Inside, the note
          would open at an opacity that is already on its way to nothing. */}
      <Note g={g} />
    </div>
  );
};
