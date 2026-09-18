/**
 * SC16 — "Sebelum entry," and the five things to check. `from 13895 · to 14975`
 *
 * ⚠ IT ARRIVES ON A CAMERA CUT, WHICH IS WHY NOTHING HERE HAS AN ENTRANCE OF
 * ITS OWN BEYOND ITS OWN REVEAL. SC15 leaves through the outgoing half of CUT15
 * at 13895; this takes the half that cut brings in. `cutInStyle` reads GLOBAL
 * frames — the Sequence rebases them, so `at` has to be added back. That is the
 * number one bug in this pipeline and it is silent when you get it wrong.
 *
 * ⚠ THE FIVE PICTURES ARE SIMON'S OWN APP SCREENS, from
 * "Documents/01 Academy/VIDEO 22 - TA Mistakes". They are copied into
 * public/art/prep/ with the transparent margin the export left on three of them
 * trimmed off, and each one's box in data/layout.ts is its own aspect — so
 * nothing is stretched and nothing is letterboxed.
 *
 * ⚠ AND THEY ALL ARRIVE TOGETHER — "sementara munculin dulu aja, nanti diatur
 * timingnya". One frame in data/timing.ts feeds all five; splitting it into five
 * is an edit to that table and nothing here.
 */
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import {
  Line, Stage, cutInStyle, progress, theme, useMotion, usePalette, useShadow,
} from "../../../core";
import { CUT15, PREP, local } from "../data/timing";
import { PREP_SHOT } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = PREP;
const S = PREP_SHOT;
const LEAD = "Sebelum entry,";
const APPLY = "apply semua yang sudah dipelajari";
// ═══════════════════════════════════════════════════════════════════════════

type Tile = (typeof PREP_SHOT)["tiles"][number];

/**
 * One screen, on a card of its own shape.
 *
 * ⚠ THE CARD IS UNDER THE PICTURE, NOT AROUND IT. Three of the five have their
 * own rounded white panel with transparent corners; a border here would draw a
 * second edge outside the one the artwork already has. A white card at exactly
 * the picture's size fills those corners instead, and the shadow is what sets
 * it off the ground.
 *
 * ⚠ `contain`, NEVER `cover`. The box IS the picture's ratio, so contain is a
 * no-op today — it is here for the day a file is re-exported slightly
 * differently, where cover would silently crop it and Simon's standing rule is
 * "jangan di stretch".
 */
const Slot = ({ tile, at }: { tile: Tile; at: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const sh = useShadow();
  const p = progress(f, at, m.reveal);
  if (p <= 0.001) return null;
  const r = tile.rect;

  return (
    <div
      style={{
        position: "absolute",
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        opacity: p,
        transform: `translateY(${((1 - p) * theme.text.body.size) / 2}px)`,
        borderRadius: theme.shape.cardRadius,
        background: c.cardBg,
        boxShadow: sh.rest,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(tile.src)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export const BeforeEntry = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  /** ⚠ GLOBAL FRAMES for the cut. See the header. */
  const g = f + V.at;

  return (
    <Stage>
      {/* ⚠ THE CAMERA MOVES THE PICTURE, NOT THE GROUND — the same shape SC11
          and SC15 use. Stage's background stays put underneath: it is a flat
          colour, so translating it could only expose an edge. */}
      <AbsoluteFill style={cutInStyle(g, CUT15)}>
        <Line
          text={LEAD}
          x={S.lead.x}
          y={S.lead.y}
          at={local(V.lead, V.at)}
          size={S.size}
          weight={theme.text.title.weight}
        />
        {/* ⚠ INDIGO, AND IT IS THE SECOND HALF OF ONE SENTENCE. Simon gave it
            its own frame at 13971, 76 after the first — the line is held open
            for it from the start rather than appearing and pushing the tiles
            down, which is what "sediakan space 1 text line di bawahnya" asks
            for. */}
        <Line
          text={APPLY}
          x={S.apply.x}
          y={S.apply.y}
          at={local(V.apply, V.at)}
          size={S.size}
          weight={theme.text.title.weight}
          color={c.indigo}
        />
        {S.tiles.map((t) => (
          <Slot key={t.key} tile={t} at={local(V.tiles, V.at)} />
        ))}
      </AbsoluteFill>
    </Stage>
  );
};
