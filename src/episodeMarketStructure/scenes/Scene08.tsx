/**
 * SC08 — Principle card (from 3508, dur 406) — INDEPENDENT.
 *
 * The only scene with no chart to read. A muted line keeps drifting up behind
 * the card — the market does not stop while you hold a principle — and the
 * sentence arrives word by word, fading and rising. No bounce: this is the one
 * line in the episode a viewer might write down.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { PriceLine } from "../components/PriceLine";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { textReveal, progress, fadeIn, fadeOut } from "../helpers";
import { DRIFT, geom } from "../data/structures";
import { PLOT } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  drift: 0, // "tren masih berlanjut"
  card: 115, // "sampai chart benar-benar menunjukkan"
  contrast: 236, // "bukan menebak"
};
const WORD_STEP = 7; // frames between one word landing and the next
const LINE = "Tren berlanjut sampai chart membuktikan sebaliknya.";
const CARD_BOX = { x: 300, y: 336, w: 1320, h: 268 };
const CHIP_Y = 720;
const BOX = { x: PLOT.x, y: PLOT.y + 20, w: PLOT.w, h: PLOT.h - 40 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(DRIFT, BOX, { pad: 0.14 });
const WORDS = LINE.split(" ");

export const Scene08 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const drift = progress(f, T.drift, 300);
  const card = textReveal(f, T.card, 18, 12);
  const guessIn = fadeIn(f, T.contrast - 46, 16);
  const strike = f >= T.contrast ? progress(f, T.contrast, 16) : 0;
  const guessOut = f >= T.contrast + 26 ? fadeOut(f, T.contrast + 26, 20) : 1;
  const know = f >= T.contrast + 22 ? progress(f, T.contrast + 22, 16) : 0;

  return (
    <SafeArea>
      {/* the market, still moving, deliberately quiet */}
      <PriceLine g={G} draw={drift} color={pal.slate} width={2} opacity={0.35} />

      <div
        style={{
          position: "absolute",
          left: CARD_BOX.x,
          top: CARD_BOX.y,
          width: CARD_BOX.w,
          height: CARD_BOX.h,
          borderRadius: theme.radius.cardLg,
          background: pal.cardBg,
          border: `${theme.stroke.hair}px solid ${pal.border}`,
          boxShadow: theme.shadow.rest,
          opacity: card.opacity,
          transform: `translateY(${card.y}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 72px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px" }}>
          {WORDS.map((w, i) => {
            const r = textReveal(f, T.card + 14 + i * WORD_STEP, 14, 14);
            return (
              <span
                key={i}
                style={{
                  fontSize: theme.type.header.size,
                  fontWeight: theme.type.header.weight,
                  color: pal.ink,
                  opacity: r.opacity,
                  transform: `translateY(${r.y}px)`,
                  display: "inline-block",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>

      {/* the job, stated as a contrast: not guessing — recognising */}
      <div
        style={{
          position: "absolute",
          left: theme.canvas.width / 2 - 200,
          top: CHIP_Y,
          transform: "translate(-100%, -50%)",
          padding: "8px 20px",
          borderRadius: theme.radius.chip,
          border: `${theme.stroke.hair}px solid ${pal.slate}`,
          color: pal.slate,
          fontFamily: theme.type.family,
          fontSize: theme.type.chip.size,
          fontWeight: theme.type.chip.weight,
          opacity: guessIn * guessOut,
          whiteSpace: "nowrap",
        }}
      >
        Menebak
        <div style={{ position: "absolute", left: 16, top: "50%", width: `calc((100% - 32px) * ${strike})`, height: 2, background: pal.slate }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: theme.canvas.width / 2 + 200,
          top: CHIP_Y,
          transform: "translate(0, -50%)",
          padding: "8px 20px",
          borderRadius: theme.radius.chip,
          background: pal.indigoSoft,
          border: `${theme.stroke.hair}px solid ${pal.indigo}`,
          color: pal.indigo,
          fontFamily: theme.type.family,
          fontSize: theme.type.chip.size,
          fontWeight: theme.type.chip.weight,
          opacity: know,
          whiteSpace: "nowrap",
        }}
      >
        ✓ Mengenali
      </div>
    </SafeArea>
  );
};
