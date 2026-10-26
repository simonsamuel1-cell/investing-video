/**
 * VI07 · SC05 — "Kalau Belum Paham, Tanyakan Lagi". Still situation 2 (the heading stays). From the ChatGPT storyboard
 * docs/vi-style/storyboards/VI07-SC05.jpg.
 *
 *  A  the research report with a "?" → a link to the Tuntun AI chat.
 *  B  three short questions typed in, one per quote ("Uangnya dari mana?", "Murah atau mahal?", "Risiko terbesar?").
 *  C  the answer: Kualitas, Valuasi, then three chips of context — Dana, Teknikal, Peristiwa.
 *  D  AI → the button: ✕ (it doesn't decide for you). You → understood → the button: ✓.
 *
 * The questions are cut short on purpose (STYLE.md §0.10): the VO says them in full, the subtitles carry it.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Heading, Mark, SITUATION, Skel, Typed, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A–C
const REPORT = { x: 220, y: 300, w: 380, h: 440 };
const CHAT = { x: 760, y: 160, w: 900, h: 720 };
const QUESTIONS = [
  { text: "Uangnya dari mana?", at: "Perusahaan ini" },
  { text: "Murah atau mahal?", at: "Kenapa harga" },
  { text: "Risiko terbesar?", at: "Apa risiko" },
] as const;
const ANSWER = { x: 40, y: 390, w: 640, h: 230 };
const CONTEXT = [
  { text: "Dana", at: "pergerakan dana" },
  { text: "Teknikal", at: "teknikal" },
  { text: "Peristiwa", at: "peristiwa" },
] as const;

// D
const ROW = { y: 520 };
const AI_X = 360;
const YOU_X = 1100;
const BUTTON = { w: 230, h: 92 };

/** The buy button — grey when it is not yours to press, indigo when it is. */
const BuyButton = ({ x, y, on }: { x: number; y: number; on: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: x, top: y - BUTTON.h / 2, width: BUTTON.w, height: BUTTON.h, borderRadius: 24, background: on > 0.5 ? c.indigo : c.cardBg, boxShadow: on > 0.5 ? shadow.soft : `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 38, color: on > 0.5 ? c.cardBg : theme.color.neutralIcon }}>Beli</div>
  );
};

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;

  const unclear = ease(f, W("belum jelas"), m.pop);
  const aiAt = W("gunakan Tuntun AI");
  const answerAt = W("Tuntun AI membantu");
  const chatOut = ease(f, W("Tujuannya bukan"), m.fade);

  const aiRowAt = W("Tujuannya bukan");
  const youRowAt = W("Tujuannya supaya");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />
      <Heading n={2} text={SITUATION[1].label} />

      {/* A–C — the report, and Tuntun AI */}
      {chatOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - chatOut }}>
          <Appear at={0} style={{ left: 0, top: 0 }}>
            <Card x={REPORT.x} y={REPORT.y} w={REPORT.w} h={REPORT.h}>
              <div style={{ position: "absolute", left: 40, top: 40 }}>
                <Disc icon="report" size={72} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              </div>
              {[300, 240, 320, 200, 280].map((w, i) => (
                <Skel key={i} w={w - 30} h={16} style={{ left: 40, top: 180 + i * 46 }} />
              ))}
            </Card>
            {unclear > 0.001 ? (
              <div style={{ position: "absolute", left: REPORT.x + REPORT.w - 50, top: REPORT.y - 30, opacity: unclear, transform: `scale(${(0.8 + 0.2 * unclear).toFixed(3)})` }}>
                <div style={{ borderRadius: 999, boxShadow: shadow.soft }}>
                  <Disc icon="question" size={84} tone={c.indigo} tint={c.cardBg} />
                </div>
              </div>
            ) : null}
          </Appear>
          <Connector a={{ x: REPORT.x + REPORT.w, y: REPORT.y + REPORT.h / 2 }} b={{ x: CHAT.x, y: REPORT.y + REPORT.h / 2 }} p={ease(f, aiAt - m.sec(0.3), m.sec(0.5))} shape="curve" />
          <Appear at={aiAt} style={{ left: 0, top: 0 }}>
            <Card x={CHAT.x} y={CHAT.y} w={CHAT.w} h={CHAT.h} line={theme.color.hairlineBrandSolid}>
              <div style={{ position: "absolute", left: 40, top: 26, display: "flex", alignItems: "center", gap: 20 }}>
                <Disc icon="ai" size={64} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Tuntun AI</div>
              </div>
              <div style={{ position: "absolute", left: 0, top: 110, width: CHAT.w, height: 2, background: c.border }} />
              {/* the input bar, as in the storyboard */}
              <div style={{ position: "absolute", left: 40, top: CHAT.h - 82, width: CHAT.w - 80, height: 62, borderRadius: 999, boxShadow: `inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 14, boxSizing: "border-box" }}>
                <Disc icon="send" size={48} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              </div>
              {/* B — the questions, right-aligned */}
              {QUESTIONS.map((q, i) => {
                const at = W(q.at);
                const p = ease(f, at - m.sec(0.1), m.pop);
                if (p <= 0.001) return null;
                return (
                  <div key={q.text} style={{ position: "absolute", right: 40, top: 140 + i * 82, opacity: p, padding: "14px 30px", borderRadius: "26px 8px 26px 26px", background: theme.color.indigoWashSolid, ...typeStyle("body"), color: c.ink }}>
                    <Typed text={q.text} at={at} cps={30} />
                  </div>
                );
              })}
              {/* C — the answer */}
              {f >= answerAt - m.sec(0.1) ? (
                <Card x={ANSWER.x} y={ANSWER.y + (1 - ease(f, answerAt - m.sec(0.1), m.reveal)) * 16} w={ANSWER.w} h={ANSWER.h} style={{ opacity: ease(f, answerAt - m.sec(0.1), m.reveal), borderRadius: "8px 26px 26px 26px" }}>
                  {[
                    { text: "Kualitas", at: "kualitas perusahaan", w: 300 },
                    { text: "Valuasi", at: "valuasinya", w: 240 },
                  ].map((r, i) => (
                    <div key={r.text} style={{ position: "absolute", left: 36, top: 36 + i * 64, display: "flex", alignItems: "center", gap: 24, opacity: ease(f, W(r.at) - m.sec(0.1), m.reveal) }}>
                      <div style={{ width: 170, ...typeStyle("body"), color: c.ink }}>{r.text}</div>
                      <div style={{ position: "relative", width: r.w, height: 18 }}>
                        <Skel w={r.w} h={18} style={{ left: 0, top: 0 }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ position: "absolute", left: 36, top: 160, display: "flex", gap: 16 }}>
                    {CONTEXT.map((k) => (
                      <div key={k.text} style={{ padding: "10px 24px", borderRadius: 999, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), color: c.indigo, opacity: ease(f, W(k.at) - m.sec(0.1), m.pop) }}>{k.text}</div>
                    ))}
                  </div>
                </Card>
              ) : null}
            </Card>
          </Appear>
        </div>
      ) : null}

      {/* D — AI doesn't press it for you; you press it once you understand */}
      <Appear at={aiRowAt} style={{ left: 0, top: 0 }}>
        <div style={{ position: "absolute", left: AI_X - 70, top: ROW.y - 70 }}>
          <Disc icon="ai" size={140} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
        </div>
        <Connector a={{ x: AI_X + 80, y: ROW.y }} b={{ x: AI_X + 300, y: ROW.y }} p={ease(f, W("mengambil keputusan") - m.sec(0.3), m.sec(0.5))} shape="curve" tone={theme.color.connectorMuteSolid} />
        {f >= W("mengambil keputusan") ? <BuyButton x={AI_X + 300} y={ROW.y} on={0} /> : null}
      </Appear>
      <Mark kind="cross" p={ease(f, W("untukmu."), m.pop)} x={AI_X + 300 + BUTTON.w} y={ROW.y - BUTTON.h / 2} />
      <Appear at={youRowAt} style={{ left: 0, top: 0 }}>
        <div style={{ position: "absolute", left: YOU_X - 70, top: ROW.y - 70 }}>
          <Disc icon="user" size={140} tone={theme.color.selfAmberInk} tint={theme.color.selfAmberWashSolid} />
        </div>
      </Appear>
      <Mark kind="check" p={ease(f, W("memahami", 1), m.pop)} x={YOU_X + 52} y={ROW.y - 52} />
      <Connector a={{ x: YOU_X + 80, y: ROW.y }} b={{ x: YOU_X + 300, y: ROW.y }} p={ease(f, W("memahami", 1) + m.sec(0.2), m.sec(0.5))} shape="curve" />
      {f >= W("memahami", 1) + m.sec(0.6) ? (
        <div style={{ opacity: ease(f, W("memahami", 1) + m.sec(0.6), m.pop) }}>
          <BuyButton x={YOU_X + 300} y={ROW.y} on={ease(f, W("dibeli."), m.pop)} />
        </div>
      ) : null}
      <Mark kind="check" p={ease(f, W("dibeli."), m.pop)} x={YOU_X + 300 + BUTTON.w} y={ROW.y - BUTTON.h / 2} />
      <div style={{ position: "absolute", left: CX - 1, top: ROW.y - 120, width: 2, height: 240, background: c.border, opacity: ease(f, youRowAt, m.reveal) }} />
    </Stage>
  );
};
