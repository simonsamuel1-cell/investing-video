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
 * ⚠ THE FIVE ARRIVE ON THE QUESTIONS THEY ANSWER. 01 is there from the first
 * frame, alone on the frame's centre-line; 03 at 14170 is "Trend-nya
 * bagaimana?", 05 at 14246 is "Level pentingnya di mana?", 04 at 14337 is
 * "Setup-nya apa?", the volume mark at 14397 is "Volume mendukung?", and 02 at
 * 14475 is "Timeframe lain sejalan?" — which is why 01 has to MOVE for it
 * rather than 02 simply appearing: the answer to that question is the two of
 * them side by side, and the move is what says so.
 *
 * ⚠ 02's OWN FRAME IS NOT IN THE TABLE, AND THAT IS DELIBERATE. It arrives when
 * the slide finishes, which is `useMotion`'s duration; written down as a second
 * number the two would drift apart the day the motion is retuned.
 */
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import {
  DashedBox, HighlightBox, Line, Stage, cutInStyle, progress, progressInOut,
  ramp, theme, useMotion, usePalette, useShadow,
} from "../../../core";
import { CUT15, PREP, local } from "../data/timing";
import { PREP_SHOT } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = PREP;
const S = PREP_SHOT;
const LEAD = "Sebelum entry,";
const APPLY = "apply semua yang sudah dipelajari";
/** Which beat each screen arrives on, GLOBAL. 02 is missing on purpose: it
 *  lands when the slide finishes, which only `useMotion` knows. */
const AT: Record<string, number> = {
  "01": V.one, "03": V.three, "05": V.five, "04": V.four,
};
// ═══════════════════════════════════════════════════════════════════════════

type Tile = (typeof PREP_SHOT)["tiles"][number];

/**
 * ⚠ THE PUSH-IN HAS TO BE FENCED OFF THE SUBTITLE BAND, and only off that one.
 *
 * The move drives the whole picture DOWNWARDS — it is anchored on the frame's
 * top edge — so the screens and the question box both travel into the band that
 * has to stay empty. scripts/audit-frames.mjs failed every frame of it.
 *
 * ⚠ THE BOTTOM ONLY, NEVER THE TOP. AdmrGroup fences both reserves, but its
 * content starts below the logo zone; this scene's first line of type sits at
 * y75, inside the top 150, so a clip like that one would cut the headline off.
 * The logo zone stays empty here by geometry instead — the type is centred and
 * never reaches x1560, and everything else is below it.
 *
 * The clip is on the PARENT of the transform: the transform renders first and
 * is then cut, which is why the two cannot live on the same element.
 */
const FENCE = {
  clipPath: `inset(0px 0px ${theme.captionBand.height}px 0px)`,
} as const;

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
const Slot = ({ tile, at, x }: { tile: Tile; at: number; x?: number }) => {
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
        left: x ?? r.x,
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
  const m = useMotion();
  /** ⚠ GLOBAL FRAMES for the cut. See the header. */
  const g = f + V.at;

  /**
   * 01's journey out of the middle. `progressInOut` rather than `progress`
   * because this one is a MOVE and not an arrival: it has to settle as
   * deliberately as it sets off, or 02 lands next to something still gliding.
   */
  const ONE = S.tiles.find((t) => t.key === "01")!.rect;
  const slid = progressInOut(g, V.pair, m.move);
  const oneX = S.solo + (ONE.x - S.solo) * slid;

  /** The mark on the volume bars, opening rightwards off its own left edge. */
  const mark = S.vol(oneX);
  const marked = progress(g, V.vol, m.reveal);

  /**
   * The push-in. One curve drives three things — the scale, the two lines
   * fading "saat sedang membesar", and the frame the closing sentence may start
   * typing on — so they cannot come apart.
   */
  const push = m.sec(0.9);
  const zoom = progressInOut(g, V.zoom.at, push);
  const k = 1 + (S.zoom.k - 1) * zoom;
  const typedFrom = V.zoom.at + push;
  const typed = V.say.text.slice(
    0,
    Math.floor(
      ramp(g, typedFrom, V.say.text.length * V.say.perChar) * V.say.text.length,
    ),
  );

  return (
    <Stage>
      {/* ⚠ THE CAMERA MOVES THE PICTURE, NOT THE GROUND — the same shape SC11
          and SC15 use. Stage's background stays put underneath: it is a flat
          colour, so translating it could only expose an edge. */}
      <AbsoluteFill style={cutInStyle(g, CUT15)}>
        {/* ⚠ EVERYTHING THE PUSH-IN CARRIES IS IN HERE, AND THE SENTENCE AFTER
            IT IS NOT. The move is a camera, so it takes the whole picture —
            type, screens, mark and question box alike — and leaves only the
            ground behind for what types next. */}
        <AbsoluteFill style={FENCE}>
        <AbsoluteFill
          style={{
            transform: `translateY(${(-S.zoom.lift * zoom).toFixed(1)}px) scale(${k.toFixed(4)})`,
            transformOrigin: `${S.zoom.x}px ${S.zoom.y}px`,
          }}
        >
        {/* ⚠ THE TWO LINES GO ON THE MOVE'S OWN CURVE — "buat kedua text itu
            fade out saat sedang membesar previewnya". One curve, so the type
            cannot still be there when the move stops, whatever the move is
            retimed to. */}
        <div style={{ opacity: 1 - zoom }}>
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
            for it from the start rather than appearing and pushing the screens
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
        </div>
        {S.tiles.map((t) => (
          <Slot
            key={t.key}
            tile={t}
            at={t.key === "02" ? local(V.pair, V.at) + m.move : local(AT[t.key], V.at)}
            x={t.key === "01" ? oneX : undefined}
          />
        ))}
        {/* ⚠ OUTSIDE THE CARD, NOT INSIDE IT. A Slot clips its own contents so
            the picture's corners follow the card's; a mark drawn in there would
            be clipped with them, and this one is meant to sit ON the picture
            rather than in it. It is given 01's CURRENT left edge, so it travels
            with the screen instead of jumping when the screen does. */}
        {marked > 0.001 && (
          <HighlightBox rect={mark} grow={marked} opacity={marked} />
        )}
        {/* ⚠ THE SAME MARQUEE SC15 CLOSES ON, and it opens from its middle like
            every dashed box in this episode now does. */}
        {g >= V.ask.at && (
          <DashedBox
            x={S.ask.x}
            y={S.ask.y}
            w={S.ask.w}
            h={S.ask.h}
            at={local(V.ask.at, V.at)}
            block={S.ask.block}
            origin="center"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.text.family,
                fontSize: S.ask.size,
                fontWeight: theme.text.title.weight,
                color: c.ink,
                whiteSpace: "pre",
              }}
            >
              {V.ask.text}
            </div>
          </DashedBox>
        )}
        </AbsoluteFill>
        </AbsoluteFill>
        {/* ⚠ IT TYPES, on the white the push-in uncovers — same two frames a
            character SC10 and SC11 use. It starts on the frame the move ENDS
            on, which is that move's own duration and not a second number. */}
        {typed.length > 0 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: S.say.y,
              transform: "translateY(-50%)",
              textAlign: "center",
              fontFamily: theme.text.family,
              fontSize: S.say.size,
              fontWeight: theme.text.title.weight,
              color: c.ink,
              whiteSpace: "pre",
            }}
          >
            {typed}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
