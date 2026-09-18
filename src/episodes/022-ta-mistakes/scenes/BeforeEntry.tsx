/**
 * SC16 — "Sebelum entry," and the five things to check. `from 13895 · to 14975`
 *
 * ⚠ IT ARRIVES ON A CAMERA CUT, WHICH IS WHY NOTHING HERE HAS AN ENTRANCE OF
 * ITS OWN BEYOND ITS OWN REVEAL. SC15 leaves through the outgoing half of CUT15
 * at 13895; this takes the half that cut brings in. `cutInStyle` reads GLOBAL
 * frames — the Sequence rebases them, so `at` has to be added back. That is the
 * number one bug in this pipeline and it is silent when you get it wrong.
 *
 * ⚠ THE FIVE TILES ARE EMPTY ON PURPOSE. Simon named five image files — 01 Day,
 * 02 Week, 03 Trend, 04 Setup, 05 Level — and none of them is in the repo yet.
 * Rather than invent artwork, each tile draws its own name in a card, so the
 * layout is judged now and the pictures drop in later: `src` in data/layout.ts
 * is the only thing that changes, and it changes per tile.
 *
 * ⚠ AND THEY ALL ARRIVE TOGETHER — "sementara munculin dulu aja, nanti diatur
 * timingnya". One frame in data/timing.ts feeds all five; splitting it into five
 * is an edit to that table and nothing here.
 */
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Line, Stage, cutInStyle, progress, theme, useMotion, usePalette } from "../../../core";
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
 * One slot in the grid. A card that either holds a picture or says which
 * picture it is waiting for.
 *
 * ⚠ `contain`, NEVER `cover`. The box is solved from the space rather than
 * measured off the artwork, so the artwork's own aspect is the one thing this
 * component does not know — and Simon's standing rule is "jangan di stretch".
 * `contain` letterboxes inside the card; `cover` would crop the picture to fit
 * a shape nobody chose.
 */
const Slot = ({ tile, at }: { tile: Tile; at: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
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
        border: `${theme.shape.rule}px solid ${c.border}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {tile.src ? (
        <Img
          src={staticFile(tile.src)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <span
          style={{
            fontFamily: theme.text.family,
            fontSize: theme.text.tag.size,
            fontWeight: theme.text.tag.weight,
            color: c.muted,
          }}
        >
          {tile.name}
        </span>
      )}
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
