/**
 * VI07 · SC05 — "Kalau Belum Paham, Tanyakan Lagi". Still situation 2 (the heading stays).
 *
 *  A–C  Simon's screen recording of Tuntun AI (TanyaTuntunAI.mp4) in the phone, up to "Tujuannya bukan" (Simon 29 Oct:
 *       "Dari frame pertama hingga 13956"). It slides up from below the frame big, only its top half in frame, through
 *       "Kalau laporan riset … gunakan Tuntun AI"; on "Kamu bisa mulai" it shrinks to the whole phone, standing from the
 *       top of the "Terburu-buru" title to the caption band (Simon 29 Oct); it leaves the way it came. It is masked at
 *       the caption band, so the subtitles stay clear while it is big. The recording is 33 s against 26 s of VO, so it
 *       is re-timed piecewise onto the words (data/tanya-ai.clip.json → scripts/vi/retime-clip.mjs): frozen from Studio
 *       12725 to 12867 while its Tuntun AI icon (top right) is highlighted, then the press, each question typed on the
 *       spoken one (the input bar enlarged over the phone while it is typed), the answer on "Tuntun AI membantu", and
 *       the three kinds of context it adds named left and right of the phone, each on its words.
 *  D    AI (indigo disc, white robot) → "memutuskan" → the Beli button, centred; on "untukmu." a ✕ over the word and
 *       the word turns red (it doesn't decide for you). Under it, on "Tujuannya supaya", one summary line in a text box
 *       (Simon 29 Oct: the "you press it" row went).
 */
import { OffthreadVideo, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Connector, HighlightBox, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { PHONE_BEZEL, PhoneScreens } from "../../vi04-investasi-yang-cocok/components/PhoneScreens";
import CLIP from "../data/tanya-ai.retime.json";
import { BLOCK, heldAt, w } from "../data/timing";
import { Appear, BoardGrid, Disc, HEADING, Heading, Mark, SITUATION, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A–C — the recording is timed to the words it was re-timed on; a VO revision that moves them must rerun the script
CLIP.pairs.forEach((p) => {
  if (w(5, p.say, p.nth, p.edge as "f0" | "f1") + p.plus - BLOCK.SC05 !== p.out) throw new Error(`VI07 SC05: tanya-tuntun-ai.mp4 is timed to an older VO ("${p.say}") — rerun scripts/vi/retime-clip.mjs`);
});
/** The recording's own shape (after its black edge columns are cropped off), so it fills the screen uncropped. */
const CLIP_RATIO = CLIP.width / CLIP.height;
/** The big phone: 40 under the heading, as SC03's phone, with only its top half in frame. */
const PHONE_TOP = HEADING.y + HEADING.disc / 2 + 40;
const PHONE_BIG = 2 * (theme.canvas.height - PHONE_TOP);
/** The whole phone: from the top of the title's glyphs (measured on a still) down to the caption band. */
const PHONE_FULL_TOP = HEADING.y - 17;
const PHONE_FULL = theme.captionBand.top - PHONE_FULL_TOP;
/**
 * The dynamic island grows and shrinks with the phone, in the proportion it had at Studio 13000 (Simon: "anchornya di
 * 13000"): its 80×20 on the phone as it stood then, PHONE_TOP to the caption band.
 */
const islandAt = (h: number) => ({ k: h / (theme.captionBand.top - PHONE_TOP), tone: theme.color.phoneIsland });
/** Fully under the frame, shadow included. */
const PHONE_OFF = theme.canvas.height + 40;
/** Where the recording sits on the canvas for a phone at `y`, `h`: its top-left and its scale. */
const screenAt = (y: number, h: number) => {
  const sw = Math.round((h - 2 * PHONE_BEZEL) * CLIP_RATIO);
  return { x: CX - sw / 2, y: y + PHONE_BEZEL, k: sw / CLIP.width };
};
/** The Tuntun AI icon in the recording (its pixels, measured on the frozen frame 152), and the box's clearance round it. */
const AI_ICON = { x1: 700, y1: 57, x2: 757, y2: 100 };
const AI_HL_PAD = 14;
const pairAt = (id: string) => {
  const p = CLIP.pairs.find((q) => q.id === id);
  if (!p) throw new Error(`VI07 SC05: no "${id}" pair in tanya-ai.retime.json`);
  return p.out;
};
const FREEZE = { at: pairAt("freeze"), until: pairAt("unfreeze") };
/**
 * The input bar while the questions are typed (Simon: "perbesar preview ketikannya"): this strip of the recording (its
 * pixels — the bar with one line or two, and its + and send buttons) grows out of the phone to TYPED_W wide, centred on
 * where it sits, and goes back in just before the question is sent.
 */
const TYPED_SRC = { x: 20, y: 945, w: 940, h: 150 };
const TYPED_W = 1040;
const TYPED = { at: pairAt("typing"), until: pairAt("sent") };
/**
 * The context Tuntun AI adds, as labels (SC04's: a card with an icon disc — the same icons SC06 gives Fund Flow and
 * Event Research), spread round the whole phone — left, right, left — at these fractions of its height.
 */
const PHONE_FULL_W = Math.round((PHONE_FULL - 2 * PHONE_BEZEL) * CLIP_RATIO) + 2 * PHONE_BEZEL;
const CONTEXT_GAP = 80;
const CONTEXT = [
  { text: "Pergerakan dana", icon: "flow", at: "pergerakan dana", side: -1, at_h: 0.22 },
  { text: "Kondisi teknikal", icon: "chart-line", at: "kondisi teknikal", side: 1, at_h: 0.5 },
  { text: "Peristiwa terbaru", icon: "event", at: "peristiwa terbaru", side: -1, at_h: 0.78 },
] as const;
const LABEL = { h: 96, disc: 60 };

// D — the row centred as one block: disc, the line with its word, the button
const ROW = { y: 560 };
const AI_DISC = 140;
const LINE = 320;
const BUTTON = { w: 230, h: 92 };
const AI_X = CX - (AI_DISC / 2 + 80 + LINE + BUTTON.w) / 2 + AI_DISC / 2;
const LINE_MID = AI_X + 80 + LINE / 2;
const WORD = { size: 40, gap: 18 };
const SUMMARY = { top: ROW.y + AI_DISC / 2 + 48, size: 48 };

/** The buy button, grey: not the AI's to press. */
const BuyButton = ({ x, y }: { x: number; y: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: x, top: y - BUTTON.h / 2, width: BUTTON.w, height: BUTTON.h, borderRadius: 24, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 38, color: theme.color.neutralIcon }}>Beli</div>
  );
};

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;
  const held = heldAt(g) !== null;

  const enter = ease(f, 0, m.move);
  const shrink = ease(f, W("Kamu bisa"), m.move);
  const leave = ease(f, W("terbaru.", 0, "f1"), m.move);
  const phoneY = PHONE_OFF + (PHONE_TOP - PHONE_OFF) * enter + (PHONE_FULL_TOP - PHONE_TOP) * shrink + (PHONE_OFF - PHONE_FULL_TOP) * leave;
  const phoneH = PHONE_BIG + (PHONE_FULL - PHONE_BIG) * shrink;
  const scr = screenAt(phoneY, phoneH);
  const iconHl = ease(f, FREEZE.at, m.reveal) * (1 - ease(f, FREEZE.until, m.fade));
  const typedP = ease(f, TYPED.at, m.reveal) * (1 - ease(f, TYPED.until - m.reveal, m.reveal));
  const typedFrom = { x: scr.x + TYPED_SRC.x * scr.k, y: scr.y + TYPED_SRC.y * scr.k, w: TYPED_SRC.w * scr.k };
  const typedTo = { x: CX - TYPED_W / 2, y: typedFrom.y + (TYPED_SRC.h * scr.k) / 2 - (TYPED_SRC.h * TYPED_W) / TYPED_SRC.w / 2, w: TYPED_W };
  const typed = { x: typedFrom.x + (typedTo.x - typedFrom.x) * typedP, y: typedFrom.y + (typedTo.y - typedFrom.y) * typedP, w: typedFrom.w + (typedTo.w - typedFrom.w) * typedP };
  const typedK = typed.w / TYPED_SRC.w;

  const aiRowAt = W("Tujuannya bukan");
  const lineAt = W("mengambil keputusan");
  const notYours = ease(f, W("untukmu."), m.pop);

  return (
    <Stage transparent={held}>
      {/* the paper, grid and heading stay put through the cut from SC04 (the Composition draws them then) */}
      {held ? null : <SoftGround f={g} />}
      {held ? null : <BoardGrid g={g} on={1} />}
      {held ? null : <Heading n={2} text={SITUATION[1].label} />}

      {/* A–C — Tuntun AI, the real app */}
      {leave < 0.999 ? (
        /* masked at the caption band: the big phone runs off the bottom, the subtitles stay clear */
        <div style={{ position: "absolute", left: 0, top: 0, width: theme.canvas.width, height: theme.captionBand.top, overflow: "hidden" }}>
          <PhoneScreens cx={CX} y={phoneY} h={phoneH} ratio={CLIP_RATIO} island={islandAt(phoneH)}>
            <OffthreadVideo src={staticFile(CLIP.src)} muted style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </PhoneScreens>
        </div>
      ) : null}
      {typedP > 0.001 ? (
        <div style={{ position: "absolute", left: typed.x, top: typed.y, width: typed.w, height: TYPED_SRC.h * typedK, borderRadius: 28 * typedK, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, opacity: Math.min(1, typedP * 2) }}>
          <OffthreadVideo src={staticFile(CLIP.src)} muted style={{ position: "absolute", left: -TYPED_SRC.x * typedK, top: -TYPED_SRC.y * typedK, width: CLIP.width * typedK, height: CLIP.height * typedK, maxWidth: "none" }} />
        </div>
      ) : null}
      {CONTEXT.map((k) => (
        <Appear key={k.text} at={W(k.at)} out={W("terbaru.", 0, "f1")} style={{ top: PHONE_FULL_TOP + PHONE_FULL * k.at_h - LABEL.h / 2, ...(k.side < 0 ? { right: theme.canvas.width - (CX - PHONE_FULL_W / 2 - CONTEXT_GAP) } : { left: CX + PHONE_FULL_W / 2 + CONTEXT_GAP }) }}>
          <div style={{ height: LABEL.h, display: "flex", alignItems: "center", gap: 20, padding: "0 28px", borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft }}>
            <Disc icon={k.icon} size={LABEL.disc} tone={c.indigo} tint={theme.color.indigoWashSolid} />
            <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>{k.text}</div>
          </div>
        </Appear>
      ))}
      {iconHl > 0.001 ? (
        <HighlightBox
          rect={{ x1: scr.x + AI_ICON.x1 * scr.k - AI_HL_PAD, y1: scr.y + AI_ICON.y1 * scr.k - AI_HL_PAD, x2: scr.x + AI_ICON.x2 * scr.k + AI_HL_PAD, y2: scr.y + AI_ICON.y2 * scr.k + AI_HL_PAD }}
          grow={Math.min(1, ease(f, FREEZE.at, m.reveal))}
          opacity={iconHl}
          fill="none"
          width={4}
          radius={18}
        />
      ) : null}

      {/* D — AI doesn't press it for you */}
      <Appear at={aiRowAt} style={{ left: 0, top: 0 }}>
        <div style={{ position: "absolute", left: AI_X - AI_DISC / 2, top: ROW.y - AI_DISC / 2 }}>
          <Disc icon="ai" size={AI_DISC} tone={c.cardBg} tint={c.indigo} />
        </div>
        <Connector a={{ x: AI_X + 80, y: ROW.y }} b={{ x: AI_X + 80 + LINE, y: ROW.y }} p={ease(f, lineAt - m.sec(0.3), m.sec(0.5))} shape="curve" tone={theme.color.connectorMuteSolid} />
        <div style={{ position: "absolute", left: LINE_MID, top: ROW.y - WORD.gap - WORD.size * 1.2, transform: "translateX(-50%)", fontFamily: theme.text.family, fontSize: WORD.size, fontWeight: 500, lineHeight: 1.2, whiteSpace: "nowrap", color: interpolateColors(notYours, [0, 1], [c.ink, theme.color.crossRed]), opacity: ease(f, lineAt, m.reveal) }}>memutuskan</div>
        {f >= lineAt ? <BuyButton x={AI_X + 80 + LINE} y={ROW.y} /> : null}
      </Appear>
      <Mark kind="cross" p={notYours} x={LINE_MID} y={ROW.y - WORD.gap - WORD.size * 1.2 - 16 - 28} />
      <Appear at={W("Tujuannya supaya")} style={{ left: 0, top: SUMMARY.top, width: theme.canvas.width, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "28px 48px", borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, fontFamily: theme.text.family, fontSize: SUMMARY.size, fontWeight: 500, lineHeight: 1.3, whiteSpace: "nowrap", color: c.ink }}>
          <span style={{ color: c.indigo }}>Pahami dulu,</span> baru tekan Beli.
        </div>
      </Appear>
    </Stage>
  );
};
