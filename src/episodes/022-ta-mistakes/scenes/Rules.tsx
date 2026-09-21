/**
 * SC18 — the closing rules. `from 15949 · to 16965`
 *
 * ⚠ IT ARRIVES ON A CAMERA CUT AND THE GROUND DOES NOT. Simon: "berikan
 * transisi camera cut lagi, tapi backgroundnya stay ya, ga ikut transisi". The
 * grid is the room both scenes happen in, so it is drawn OUTSIDE the cut on
 * both sides and reads as one continuous ground while the pictures swap over
 * it. "Rules" takes the incoming half and is complete on the frame it lands.
 *
 * ⚠ AND IT IS HANDED THE GLOBAL FRAME, not the scene's own. core/GridGround
 * says a local frame is fine "because it only loops" — true of one scene, false
 * across a boundary: SC17's local 941 and this one's local 0 would have put the
 * drift at 51.6 and 0 and the ground would have jumped on the cut.
 *
 * ⚠ FOUR PAIRS READ ACROSS, NOT DOWN. The left of each is a condition and the
 * right is what to do about it, so the left column is set flush RIGHT and the
 * right flush LEFT, meeting at a gutter on the frame's middle. Eight beats,
 * all Simon's, each on its own half of the sentence the voice is saying.
 *
 * ⚠ 16672 TAKES EVERYTHING BUT THE GROUND, and 16688 puts the episode's last
 * words where the list was.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  GridGround, Line, Stage, cutInStyle, progress, theme, useMotion, usePalette,
} from "../../../core";
import { CUT17, RULES, local } from "../data/timing";
import { GROUND_FADE, RULES_SHOT } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = RULES;
const S = RULES_SHOT;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE SCENE IS FENCED OFF THE SUBTITLE BAND for the same reason SC16's and
 * SC17's are: the cut's own blur would otherwise smear its content into a
 * reserve that has to stay empty, and a filter applies to what its element has
 * already produced — so the clip only holds if nothing outside it blurs.
 */
const FENCE = {
  clipPath: `inset(0px 0px ${theme.captionBand.height}px 0px)`,
} as const;

export const Rules = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  /** ⚠ GLOBAL FRAMES — for the cut, and for the ground's own drift. */
  const g = f + V.at;

  /** ⚠ ONE CURVE CLEARS THE LIST AND ONE BRINGS THE LAST LINE. */
  const gone = progress(g, V.clear, m.fade);

  /** Anything the cut delivers is complete on the frame it lands. */
  const born = (beat: number) => (beat === V.at ? -m.reveal : local(beat, V.at));

  return (
    <Stage>
      <AbsoluteFill style={FENCE}>
        {/* ⚠ OUTSIDE THE CUT, ON PURPOSE. This is the one thing in the scene
            that does not travel — see the header. */}
        <div style={GROUND_FADE}>
          <GridGround f={g} paper={c.bg} vignette={false} />
        </div>

        <AbsoluteFill style={cutInStyle(g, CUT17)}>
          <div style={{ opacity: 1 - gone }}>
            <Line
              text={V.head.text}
              x={S.head.x}
              y={S.head.y}
              at={born(V.head.at)}
              size={S.head.size}
              weight={theme.text.display.weight}
            />
            {V.rows.map((row, i) => {
              /** ⚠ A CELL CENTRES ITS OWN ROWS ON ITS ROW'S LINE, so a two-row
               *  condition and a one-row answer still read across. */
              const cell = (rows: readonly string[], j: number) =>
                S.rows.y0 + i * S.rows.pitch + (j - (rows.length - 1) / 2) * S.rows.lead;
              return (
                <React.Fragment key={row.left.text.join(" ")}>
                  {row.left.text.map((t, j) => (
                    <Line
                      key={t}
                      text={t}
                      x={S.rows.left}
                      y={cell(row.left.text, j)}
                      at={born(row.left.at)}
                      anchor="right"
                      size={S.rows.size}
                      weight={theme.text.title.weight}
                    />
                  ))}
                  {/* ⚠ RED, AND IT IS THE ONE RED THIS EPISODE HAS. `warn` names
                      a mistake in WORDS; here it names what to do about one,
                      which is the same sentence read from the other end. */}
                  {row.right.text.map((t, j) => (
                    <Line
                      key={t}
                      text={t}
                      x={S.rows.right}
                      y={cell(row.right.text, j)}
                      at={born(row.right.at)}
                      anchor="left"
                      size={S.rows.size}
                      weight={theme.text.title.weight}
                      color={theme.color.warn}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </div>

          {g >= V.close.at &&
            V.close.lines.map((row, i) => (
              <Line
                key={row.text}
                text={row.text}
                x={S.close.x}
                y={S.close.y0 + i * S.close.lead}
                at={local(V.close.at, V.at)}
                size={S.close.size}
                weight={theme.text.display.weight}
                color={row.indigo ? c.indigo : undefined}
              />
            ))}
        </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
