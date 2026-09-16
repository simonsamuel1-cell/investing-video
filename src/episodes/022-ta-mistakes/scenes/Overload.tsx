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
import { progress, progressInOut } from "../../../core";
import { BrokerPanel } from "../../019-moving-average/scenes/Scene01";
import { PANEL10 } from "../data/timing";

/** ⚠ 019'S OWN FRAME NUMBER. That episode runs at 30fps and this one at 60, so
 *  this is not a frame of THIS timeline and must never be derived from one. */
const AT = 510;

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = PANEL10;
// ═══════════════════════════════════════════════════════════════════════════

export const Overload = () => {
  const f = useCurrentFrame();
  /** ⚠ GLOBAL FRAMES. The table is written in the timeline's numbers and a
   *  scene inside a Sequence sees its own, so `from` goes back on first. */
  const g = f + V.at;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: progress(g, V.panel.at, V.panel.over) }}>
      <BrokerPanel
        f={AT}
        chart="BMRI"
        extension={false}
        /** ⚠ NO CARD AND NO CHROME — Simon, opening the picture up while he
         *  works out what goes where: "kita buka background putihnya supaya
         *  tidak ada batasan untuk sementara", and then the timeframe pills,
         *  the two indicator buttons, the dashed last-price line, the chip on
         *  the axis and the big 4.210 with its +0,70%, each by name. What is
         *  left is the ticker, the tape and the seven readings of it. */
        bare
        /** ⚠ THE SHAPE WITHOUT THE NAMING. Simon asked for the zigzag he has
         *  seen before, which is the line and its rings — the HL/HH/LH/LL
         *  chips would be a second scene's argument sitting on this one. */
        zig={{ drawn: progressInOut(g, V.zig.at, V.zig.over) }}
        /** ⚠ ONE AFTER ANOTHER, not together. Three panes that appear at once
         *  are a layout; three that arrive in turn are somebody adding them. */
        studies={{ shown: (i) => progressInOut(g, V.studies.at + i * V.studies.step, V.studies.over) }}
      />
    </div>
  );
};
