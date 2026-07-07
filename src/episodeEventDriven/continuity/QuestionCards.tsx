/**
 * QuestionCards — Questions group, Scene 6 (comp 1082–1347), mounted once as one
 * spanning sequence. Kinetic type sets the thesis, then a news capture lands:
 *   1082–1204  "The skill is"  (line 1)
 *   1082–1155  "not reading faster"  (line 2, slate) — fades at 1155
 *   1155–1204  "Judging Better"  (line 2, indigo)
 *   1204       a news capture appears, centred
 *   1347       all visuals end
 * (The remainder of the group, comp 1354–1864, is currently empty pending the
 * Scene 7 redesign.) Frame = group-local (0 at comp 1082).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, textReveal } from "../helpers";

const c = theme.colors;
const w = theme.font.weights;
const F = theme.font.family;
const MIDY = 513;

// ── onsets (group-local; comp = 1082 + local) ───────────────────────────────
const T_IN = 0; //     1082
const NRF_OUT = 73; //  1155 — "not reading faster" fades
const JB_IN = 73; //    1155 — "Judging Better" appears
const TEXT_OUT = 122; //1204 — the text block clears
const IMG_IN = 122; //  1204 — news capture appears
const END = 265; //     1347 — all visuals end

const NEWS_IMG = "eventDriven/news-01.jpg"; // 1080×502

// Scene 7 — the three questions, accumulating as a list (comp → local −1082)
const QS = [
  { n: "1.", main: "Does this actually change earnings expectations?", or: "Or does it just feel dramatic?", mainAt: 265, orAt: 378 },
  { n: "2.", main: "Is this a one-day mood swing?", or: "Or a real structural shift that lasts months?", mainAt: 443, orAt: 504 },
  { n: "3.", main: "And does it hit just one company?", or: "Or move the whole sector?", mainAt: 595, orAt: 652 },
];
const Q_BASE = 300;
const Q_STEP = 150;

export const QuestionCards = () => {
  const f = useCurrentFrame();

  const op1 = fadeIn(f, T_IN, 16) * fadeOut(f, TEXT_OUT - 14, 14); // "The skill is"
  const opNRF = fadeIn(f, T_IN, 16) * fadeOut(f, NRF_OUT - 14, 14); // "not reading faster"
  const opJB = fadeIn(f, JB_IN, 16) * fadeOut(f, TEXT_OUT - 14, 14); // "Judging Better"
  const opImg = fadeIn(f, IMG_IN, 16) * fadeOut(f, END - 14, 14); // news capture

  const line: React.CSSProperties = { position: "absolute", left: 96, width: 1728, textAlign: "center", fontFamily: F };

  return (
    <SafeArea>
      {/* line 1 */}
      <div style={{ ...line, top: MIDY - 128, fontSize: 84, fontWeight: w.bold, color: c.text, opacity: op1 }}>The skill is</div>

      {/* line 2 — "not reading faster" (slate) crossfades to "Judging Better" (indigo) */}
      <div style={{ ...line, top: MIDY + 4, fontSize: 112, fontWeight: w.extrabold, color: c.grey, letterSpacing: -1, opacity: opNRF }}>not reading faster</div>
      <div style={{ ...line, top: MIDY + 4, fontSize: 112, fontWeight: w.extrabold, color: c.indigo, letterSpacing: -1, opacity: opJB }}>Judging Better</div>

      {/* news capture, centred */}
      {opImg > 0 && (
        <div style={{ position: "absolute", left: 960 - 520, top: MIDY - 242, width: 1040, height: Math.round((1040 * 502) / 1080), opacity: opImg, borderRadius: theme.radius.card, overflow: "hidden", background: c.white, border: `1px solid ${c.cardBorder}`, boxShadow: "0 18px 45px rgba(0,0,0,0.10)" }}>
          <Img src={staticFile(NEWS_IMG)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* Scene 7 — the three questions, appearing as a list */}
      {QS.map((q, i) => {
        const yTop = Q_BASE + i * Q_STEP;
        const mainRv = textReveal(f, q.mainAt, 16);
        const orRv = textReveal(f, q.orAt, 16);
        const out = fadeOut(f, 762, 16);
        return (
          <div key={q.n}>
            {f >= q.mainAt && (
              <div style={{ position: "absolute", left: 260, top: yTop, width: 1500, fontSize: 46, fontWeight: w.extrabold, color: c.text, fontFamily: F, opacity: mainRv.opacity * out, transform: mainRv.transform }}>
                <span style={{ color: c.indigo }}>{q.n}</span> {q.main}
              </div>
            )}
            {f >= q.orAt && (
              <div style={{ position: "absolute", left: 320, top: yTop + 62, width: 1440, fontSize: 40, fontWeight: w.semibold, color: c.indigo, fontFamily: F, opacity: orRv.opacity * out, transform: orRv.transform }}>
                {q.or}
              </div>
            )}
          </div>
        );
      })}
    </SafeArea>
  );
};
