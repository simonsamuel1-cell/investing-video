/**
 * VI04 · SC02 — "Mulai dari Pertanyaan yang Tepat", rebuilt to Benchmark v1 (docs/vi-style/STYLE.md §0; Simon,
 * 22 Oct 2026: neutral colours for the obvious things, the brand only on hairlines and some words). Simon's own
 * picture stays — two isometric islands, "Kamu" (the stickman) and "Rumahmu" (the house) — now in neutrals, and it
 * never leaves: the scene keeps it on screen and moves the camera instead of cutting away.
 *
 *  A  "Bayangin kamu berdiri di pinggir sungai, dan rumahmu ada di seberang": the islands rise on their words; the
 *     river between them is a few hairline ripples.
 *  B  "Kebanyakan orang … “Mana yang paling cepat?”": the islands settle small at the bottom and the question card
 *     comes in above; "bukan itu": it greys and gets a small ✕.
 *  C  "Yang lebih penting: “Cara mana … sampai tujuan?”": the second card (an amber hairline); as it is said, a
 *     dashed route GROWS from Kamu over the river to the house, and lands ticked on "tujuan".
 *  D  "Sebelum menentukan investasinya, kita perlu kenali diri kita dulu": the cards go and the camera dives onto
 *     Kamu while the line is said.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, IconDot, Mark, OUTSIDE_RESERVES, ease, useWords } from "../components/kit";
import { ISLES, ISLE_FRAME, Islands, RiverLines, frameStyle, mixFrame } from "../components/Islands";

const CX = theme.canvas.width / 2;
const CARDS = { w: 1100, top: [150, 350], h: [140, 168] };

/** Kamu's feet to the house's door, over the river (world coordinates). */
const ROUTE = { a: { x: ISLES.you.cx + 50, y: ISLES.you.cy - 30 }, b: { x: ISLES.home.cx - 40, y: ISLES.home.cy + 20 }, bend: 170 };

/** SC02's last line — shortened on screen (Simon, 22 Oct); the VO says it in full. `main` = how far its second line is in. */
export const KenaliLine = ({ main = 1, opacity = 1 }: { main?: number; opacity?: number }) => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: 0, top: 150, width: theme.canvas.width, opacity }}>
      <div style={{ textAlign: "center", ...typeStyle("body"), color: c.slate }}>Sebelum menentukan investasinya,</div>
      <div style={{ marginTop: 10, textAlign: "center", ...typeStyle("statement"), color: c.ink, opacity: main }}>
        <span style={{ color: theme.color.selfAmberInk }}>kenali diri sendiri</span> dulu.
      </div>
    </div>
  );
};

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(2, BLOCK.SC02);
  const g = f + BLOCK.SC02;

  const picAt = W("Bayangin");
  const riverAt = W("pinggir sungai");
  const askAt = W("Kebanyakan");
  const notAt = W("bukan itu");
  const betterAt = W("Yang lebih penting");
  const wayAt = W("“Cara");
  const goalAt = W("tujuan");
  const lineAt = W("Sebelum menentukan");

  const no = ease(f, notAt, m.pop);
  const yes = ease(f, goalAt, m.pop);
  const settle = ease(f, askAt, m.move);
  const dive = ease(f, lineAt, m.sec(1.2));
  const fr = mixFrame(mixFrame(ISLE_FRAME.full, ISLE_FRAME.low, settle), ISLE_FRAME.dive, dive);
  const route = ease(f, wayAt, m.sec(1.6));

  return (
    <Stage>
      <SoftGround f={g} />

      {/* A–D — the islands, framed by a camera that never cuts away */}
      <Appear at={picAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height, clipPath: OUTSIDE_RESERVES }}>
        <div style={frameStyle(fr)}>
          {/* the river: long hairline ripples running across, under both islands */}
          <RiverLines g={g} p={(i) => ease(f, riverAt + m.sec(0.1) * i, m.reveal)} />
          <Islands youAt={W("kamu berdiri")} homeAt={W("rumahmu")} neutral homeFade={dive} />
          <div style={{ position: "absolute", inset: 0, opacity: 1 - dive }}>
            <Connector a={ROUTE.a} b={ROUTE.b} p={route} shape="arc" bend={ROUTE.bend} dashed width={6} />
          </div>
          <Mark kind="check" p={yes * (1 - dive)} x={ROUTE.b.x + 10} y={ROUTE.b.y - 60} />
        </div>
      </Appear>

      {/* B — the question most people ask */}
      <Appear at={askAt + m.sec(0.2)} out={lineAt} style={{ left: CX - CARDS.w / 2, top: CARDS.top[0], width: CARDS.w, height: CARDS.h[0] }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", gap: 28, padding: "0 44px", opacity: 1 - 0.45 * no }}>
          <IconDot name="lightning" size={42} neutral />
          <div>
            <div style={{ ...typeStyle("label"), color: c.slate }}>Kebanyakan orang mikir:</div>
            <div style={{ marginTop: 4, ...typeStyle("title"), color: c.ink, opacity: ease(f, W("“Mana") - m.sec(0.08), m.reveal) }}>“Mana yang paling cepat?”</div>
          </div>
        </div>
        <Mark kind="cross" p={no} x={CARDS.w - 30} y={30} />
      </Appear>

      {/* C — the one that matters */}
      <Appear at={betterAt} out={lineAt} style={{ left: CX - CARDS.w / 2, top: CARDS.top[1], width: CARDS.w, height: CARDS.h[1] }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.selfAmber}`, display: "flex", alignItems: "center", gap: 28, padding: "0 44px" }}>
          <IconDot name="flag" size={42} neutral />
          <div>
            <div style={{ ...typeStyle("label"), color: theme.color.selfAmberInk }}>Yang lebih penting:</div>
            <div style={{ marginTop: 4, ...typeStyle("title"), fontSize: 40, color: c.ink, opacity: ease(f, W("“Cara") - m.sec(0.08), m.reveal) }}>“Cara mana yang benar-benar bisa aku jalani sampai tujuan?”</div>
          </div>
        </div>
      </Appear>

      {/* D — the line, while the camera dives onto Kamu (SC03 opens on it and lets it go) */}
      <Appear at={lineAt + m.sec(0.3)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <KenaliLine main={ease(f, W("kita perlu"), m.reveal)} />
      </Appear>
    </Stage>
  );
};
