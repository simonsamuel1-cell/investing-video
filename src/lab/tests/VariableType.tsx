/**
 * lab/tests/VariableType.tsx — TEST 05 · variable font.
 *
 * ⚠ THE PROJECT DOES NOT HAVE THIS FONT YET, AND THAT MATTERED.
 * @remotion/google-fonts/PlusJakartaSans serves STATIC instances — 200, 300,
 * 400, 500, 600, 700, 800 and nothing between. Animating `fontWeight` across
 * those does not interpolate; it snaps from one cut to the next. A demo built
 * on it would have been a lie about what the technique does. public/fonts/
 * now holds the real variable file (latin subset, 27KB, `font-weight: 200
 * 800`) and the weight below is a continuous number.
 *
 * ⚠ AND THE FONT IS WAITED FOR. Without delayRender the still is screenshotted
 * before the face arrives and every frame comes out in the fallback — which
 * looks like the effect simply not working.
 *
 * Three rows, and the middle one is the argument:
 *   1 · a wave of WEIGHT travelling through a phrase. Simon's reference folder
 *       calls for "a gradient sweep travelling through the letters"; done with
 *       weight instead of colour it is the same gesture made of the type
 *       itself, and it survives a palette change.
 *   2 · the same phrase continuous, against the same phrase snapped to the
 *       seven static cuts. This is what the variable file buys, and nothing
 *       else in the bench shows a difference you can measure by eye.
 *   3 · one word across the whole axis, 200 to 800.
 */
import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Line, Stage, theme, useMotion, usePalette } from "../../core";

const BOX = theme.stage.card;
const PHRASE = "SETUP LENGKAP TETAP BISA GAGAL.";
const FACE = "PJS Variable";
/** The cuts the project currently ships. Row 2 snaps to these. */
const CUTS = [200, 300, 400, 500, 600, 700, 800];
const LO = 200;
const HI = 800;

const nearestCut = (w: number) =>
  CUTS.reduce((best, cut) => (Math.abs(cut - w) < Math.abs(best - w) ? cut : best), CUTS[0]);

export const VariableTypeTest = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const [handle] = useState(() => delayRender("lab: variable font"));

  useEffect(() => {
    document.fonts
      .load(`400 64px "${FACE}"`)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  const chars = PHRASE.split("");
  /** The crest, travelling left to right and wrapping. */
  const head = ((f / m.sec(3.2)) % 1) * (chars.length + 10) - 5;
  /** ⚠ A GAUSSIAN, NOT A STEP. The point of the axis is that letters either
   *  side of the crest are PARTLY heavy; a hard window would just be bold
   *  text moving. */
  const weightAt = (i: number) => {
    const d = (i - head) / 3.2;
    return LO + (HI - LO) * Math.exp(-d * d);
  };

  const breathe = LO + (HI - LO) * (0.5 + 0.5 * Math.sin((f / m.sec(2.4)) * Math.PI));

  const row = (y: number, snap: boolean) => (
    <div
      style={{
        position: "absolute",
        left: BOX.x,
        top: y,
        width: BOX.w,
        textAlign: "center",
        fontFamily: `"${FACE}", ${theme.text.family}`,
        fontSize: theme.text.title.size,
        color: c.ink,
        whiteSpace: "pre",
      }}
    >
      {chars.map((ch, i) => {
        const w = weightAt(i);
        return (
          <span
            key={`${i}-${ch}`}
            style={{ fontVariationSettings: `"wght" ${snap ? nearestCut(w) : w.toFixed(1)}` }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );

  return (
    <Stage>
      <style>{`@font-face{font-family:"${FACE}";src:url("${staticFile(
        "fonts/PlusJakartaSans-variable.woff2",
      )}") format("woff2");font-weight:${LO} ${HI};font-style:normal;font-display:block;}`}</style>

      <Line
        text="1 · gelombang bobot berjalan menembus huruf"
        x={BOX.x}
        y={BOX.y + 20}
        at={0}
        anchor="left"
        size={theme.text.axis.size}
        weight={theme.text.axis.weight}
        color={c.slate}
      />
      {row(BOX.y + 70, false)}

      <Line
        text="2 · sama persis, tapi dipaksa ke 7 potongan statis yang kita punya sekarang"
        x={BOX.x}
        y={BOX.y + BOX.h * 0.38}
        at={0}
        anchor="left"
        size={theme.text.axis.size}
        weight={theme.text.axis.weight}
        color={c.slate}
      />
      {row(BOX.y + BOX.h * 0.38 + 50, true)}

      <Line
        text="3 · satu kata, seluruh sumbu 200 → 800"
        x={BOX.x}
        y={BOX.y + BOX.h * 0.68}
        at={0}
        anchor="left"
        size={theme.text.axis.size}
        weight={theme.text.axis.weight}
        color={c.slate}
      />
      <div
        style={{
          position: "absolute",
          left: BOX.x,
          top: BOX.y + BOX.h * 0.68 + theme.text.axis.size * 2,
          width: BOX.w,
          textAlign: "center",
          fontFamily: `"${FACE}", ${theme.text.family}`,
          fontSize: theme.text.display.size,
          color: c.indigo,
          fontVariationSettings: `"wght" ${breathe.toFixed(1)}`,
        }}
      >
        INVALIDATION
      </div>
    </Stage>
  );
};
