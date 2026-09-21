/**
 * RecapFrame — Recap & close group, Scenes 24–26 (comp 5823–6370), mounted once.
 * Owns the StepRail whose cards accumulate 1→2→3 across Scenes 24–25, each with a
 * capture (or a Buy button) beneath it, then fades as Scene 26's closing statement
 * takes over. Frame here = group-local (0 at comp 5823).
 *   S24 5823 d211 · S25 6040 d114 · S26 6154 d216
 */
import { useCurrentFrame, Sequence, Img, staticFile } from "remotion";
import { SafeArea, StepRail } from "../components";
import type { RailCard } from "../components";
import { fadeOut, fadeIn, textReveal } from "../helpers";
import { theme } from "../theme";
import { Scene24 } from "../scenes/Scene24";
import { Scene25 } from "../scenes/Scene25";
import { Scene26 } from "../scenes/Scene26";

const CARD1_AT = 61; // 5884
const CARD2_AT = 135; // 5961
const CARD3_AT = 314; // 6137
const FADE_START = 346; // 6169 — recap visuals (incl. title) begin fading

const RAIL_X = 150;
const RAIL_Y = 300; // 20px gap above the (enlarged) media below
const CARD_W = 500;
const GAP = 60;

const CARDS: RailCard[] = [
  { n: 1, title: "Understand The Event", glyph: "event", at: CARD1_AT },
  { n: 2, title: "Watch Price & Volume", glyph: "candle", at: CARD2_AT, connectAt: 105 },
  { n: 3, title: "Act, Once Confirmed", glyph: "check", at: CARD3_AT, connectAt: 284 },
];

// Media beneath each card (portrait captures / a Buy button), centred on the card.
const cardCx = (i: number) => RAIL_X + i * (CARD_W + GAP) + CARD_W / 2;
const IMG_W = CARD_W; // same width as the cards
const IMG_H = Math.round((IMG_W * 1920) / 980); // 980 — grows downward, cropped off-screen
const IMG_TOP = 470;
const BTN_TOP = 644; // green Buy button keeps its position (not tied to IMG_H)

export const RecapFrame = () => {
  const f = useCurrentFrame();
  const railOut = fadeOut(f, FADE_START, 16); // recap visuals (incl. title) fade from 6169
  const img1Op = fadeIn(f, CARD1_AT, 16);
  const img2Op = fadeIn(f, CARD2_AT, 16);
  const btnOp = fadeIn(f, CARD3_AT, 16);

  const imgStyle = (i: number, op: number) => ({
    position: "absolute" as const,
    left: cardCx(i) - IMG_W / 2,
    top: IMG_TOP,
    width: IMG_W,
    height: IMG_H,
    borderRadius: 18,
    objectFit: "cover" as const,
    boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
    opacity: op,
  });

  return (
    <SafeArea>
      <div style={{ opacity: railOut }}>
        {/* section title — persists over the cards, fades with everything at 6169 */}
        <div style={{ position: "absolute", left: 96, right: 96, top: 150, textAlign: "center", fontSize: 60, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, ...textReveal(f, 0, 18) }}>
          Event-Driven Trading Sequence
        </div>

        <StepRail x={RAIL_X} y={RAIL_Y} cardW={CARD_W} gap={GAP} cards={CARDS} frame={f} />

        {/* under card 1 — News List capture (the 5004 frame) */}
        <Img src={staticFile("eventDriven/s20-newslist.jpg")} style={imgStyle(0, img1Op)} />
        {/* under card 2 — Buy screen; image shifted up 100px within a fixed clip window */}
        <div style={{ position: "absolute", left: cardCx(1) - IMG_W / 2, top: IMG_TOP, width: IMG_W, height: IMG_H, overflow: "hidden", borderRadius: 18, boxShadow: "0 12px 30px rgba(0,0,0,0.10)", opacity: img2Op }}>
          <Img src={staticFile("eventDriven/s20-buy.jpg")} style={{ width: IMG_W, height: IMG_H, objectFit: "cover", transform: "translateY(-280px)" }} />
        </div>
        {/* under card 3 — a green Buy button */}
        <div style={{ position: "absolute", left: cardCx(2) - 160, top: BTN_TOP, width: 320, height: 92, borderRadius: 16, background: theme.colors.candleGreen, boxShadow: "0 12px 30px rgba(34,181,115,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, fontWeight: theme.font.weights.extrabold, color: theme.colors.white, opacity: btnOp }}>
          Buy
        </div>
      </div>

      <Sequence durationInFrames={211} layout="none"><Scene24 /></Sequence>
      <Sequence from={217} durationInFrames={114} layout="none"><Scene25 /></Sequence>
      <Sequence from={331} durationInFrames={216} layout="none"><Scene26 /></Sequence>
    </SafeArea>
  );
};
