/**
 * VI04 · SC01 — "Riset Pertama: Tentang Dirimu", rebuilt to Benchmark v1 (docs/vi-style/STYLE.md §0; Simon, 22 Oct
 * 2026: "untuk hal-hal yang obvious, pakai warna netral aja, pakai warna brand untuk elemen-elemen yang minim terlihat
 * aja seperti border, sebagian text"). The big shapes are white and grey; indigo is only ever a hairline (the
 * connectors, a border) or a word. Amber stays "you" — and also only as a hairline, a small icon, a word.
 * Every beat is a WORD of the VO (useWords → data/words.json).
 *
 *  A  "kita biasanya rajin riset": a mindmap — the research card at the left, and a connector GROWS to each thing
 *     we check, on its word (Kualitas perusahaan / Harga saham / Trend pasar — Simon's labels, 22 Oct); each node
 *     lengthens out of its connector's end, and lands ticked.
 *  B  "Tapi ada satu hal yang … nggak kita riset": a fourth connector, amber and dashed, under the others, runs to
 *     an EMPTY node; on "investor" it is named, on "diri kita sendiri" that name rolls up into "Diri kita sendiri"
 *     and the node glows, while the three we did check step back.
 *  C  "26,7 juta … lebih dari setengahnya di bawah 30 tahun": the number counting up from 0 on top, and under it a
 *     field of profile icons — more than half of them go dark. (The script's own figures; the field is a picture of
 *     "more than half", not a count.)
 *  D  "rekomendasi teman, portofolio di video, return yang dipamerkan": three sources, a connector from each down to
 *     YOU; on "Masalahnya" those links fade, and on "kondisi orang lain" each source shows whose it really is.
 *  E  "sebelum tanya … tanya dulu …": the two questions swap — the one about yourself comes FIRST.
 *  F  the insight: Orang Tuntun, and "Riset pertama … dimulai dari diri kita sendiri".
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, ease, Ico, IconDot, Line, ORANG_TUNTUN_RIGHT, OrangTuntun, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A + B — the mindmap
const HUB = { x: 200, y: 430, w: 540, h: 180 };
const NODE = { x: 1000, w: 720, h: 100, ys: [280, 445, 610, 775] };
const ROWS = [
  { icon: "company", text: "Kualitas perusahaan", word: "perusahaannya" },
  { icon: "price", text: "Harga saham", word: "harganya" },
  { icon: "crowd", text: "Trend pasar", word: "dan orang lain" },
];
const hubOut = { x: HUB.x + HUB.w, y: HUB.y + HUB.h / 2 };
const nodeIn = (i: number) => ({ x: NODE.x, y: NODE.ys[i] });

// C — the numbers (each investor a profile icon in a circle, icons/vi04/user-circle.svg = ph:user-circle-duotone — Simon, 22 Oct: not a stickman)
// Stacked top to bottom (Simon, 22 Oct: "layoutnya … atas bawah aja"): the number and its label on top, the field of
// investors and ">50% …" under it, all centred.
/** ONE GROUP (Simon, 22 Oct: "group them" — like Cmd+G): its spacing is fixed; move it by `y` alone. */
const STAT_GROUP = { y: 155, gridDy: 300 };
const STAT = { numberY: STAT_GROUP.y, gridY: STAT_GROUP.y + STAT_GROUP.gridDy };
const DOTS = { cols: 10, rows: 4, size: 44, gap: 30, x: CX - (10 * 44 + 9 * 30) / 2, y: STAT.gridY };
const DOT_N = DOTS.cols * DOTS.rows;
const HALF_PAST = 0.58; // "lebih dari setengahnya" — past half, no finer figure implied

// D — the sources and you
const SRC = { w: 480, h: 180, y: 240, gap: 80 };
const srcX = (i: number) => CX + (i - 1) * (SRC.w + SRC.gap) - SRC.w / 2;
const INPUTS = [
  { icon: "chat", text: "Rekomendasi teman", word: "rekomendasi" },
  { icon: "video", text: "Portofolio di video", word: "portofolio" },
  { icon: "trend", text: "Return yang dipamerkan", word: "return" },
];
const YOU = { x: CX, y: 690, r: 62 };

// E — two questions
const Q = { w: 1200, h: 140, top: [300, 540] };

/**
 * A mindmap node that GROWS out of the end of its connector, left to right (Simon, 22 Oct: "per label animasinya
 * muncul memanjang dari paling kiri — dari ujung garis — ke kanan"): it starts as a disc as tall as itself and
 * lengthens to full width; what is inside is uncovered as it goes.
 */
const GrowNode = ({ y, p, line, dashed, style, children }: { y: number; p: number; line?: string; dashed?: boolean; style?: React.CSSProperties; children: React.ReactNode }) => {
  if (p <= 0.001) return null;
  return (
    <Card x={NODE.x} y={y - NODE.h / 2} w={NODE.h + (NODE.w - NODE.h) * p} h={NODE.h} line={line} dashed={dashed} style={{ overflow: "hidden", opacity: Math.min(1, p * 5), ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: NODE.w - (line ? 4 : 0), height: NODE.h - (line ? 4 : 0), display: "flex", alignItems: "center", gap: 22, padding: "0 26px", boxSizing: "border-box" }}>{children}</div>
    </Card>
  );
};

/** A small tick on a white disc with a brand hairline. */
const Tick = ({ p }: { p: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ width: 46, height: 46, borderRadius: 999, boxShadow: `inset 0 0 0 2px ${theme.color.connector}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${(0.75 + 0.25 * p).toFixed(3)})`, flex: "none" }}>
      <span style={{ fontFamily: theme.text.family, fontWeight: 600, fontSize: 24, color: c.indigo, lineHeight: 1 }}>✓</span>
    </div>
  );
};

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(1, BLOCK.SC01);
  const g = f + BLOCK.SC01;
  const shadow = useShadow();

  const listAt = W("Sebelum");
  const gapAt = W("Tapi ada satu hal");
  const nameAt = W("investor yang akan");
  const selfAt = W("kita sendiri") - m.sec(0.3);
  const statsAt = W("Sekarang");
  const inputsAt = W("Banyak");
  const backAt = W("Masalahnya");
  const ownerAt = W("kondisi orang lain");
  const askAt = W("Jadi");
  const firstAt = W("tanya dulu");
  const insightAt = W("Karena");

  // A + B
  const mapOut = ease(f, statsAt, m.fade);
  const self = ease(f, selfAt, m.reveal);
  const named = ease(f, nameAt, m.reveal);
  const stepBack = ease(f, selfAt, m.move);
  const grow = (at: number) => ease(f, at, m.sec(0.55));
  /** A node starts lengthening as its connector arrives. */
  const lengthen = (at: number) => ease(f, at + m.sec(0.45), m.sec(0.5));
  /** "Investor yang akan membelinya" rolls up and away; "Diri kita sendiri" rolls up into its place. */
  const roll = ease(f, selfAt, m.move);
  const glow = ease(f, selfAt + m.sec(0.25), m.reveal);

  // C
  const dark = ease(f, W("setengahnya"), m.sec(1.2)) * HALF_PAST;
  const count = ease(f, W("26,7") - m.sec(0.2), m.sec(1.4));

  // D
  const back = ease(f, backAt, m.move);

  // E
  const swap = ease(f, firstAt, m.move);
  const qGlow = ease(f, W("“Aku sebenarnya") + m.sec(0.3), m.reveal);

  // F
  const youAt = ease(f, W("dari diri kita sendiri"), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      {/* the grid, the whole scene (Simon, 22 Oct) */}
      <BoardGrid g={g} on={1} />

      {/* A + B — what we research, and the one thing we don't */}
      {mapOut < 0.999 && f >= listAt ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - mapOut }}>
          <Appear at={listAt} style={{ left: 0, top: 0 }}>
            <Card x={HUB.x} y={HUB.y} w={HUB.w} h={HUB.h} line={theme.color.hairlineBrand} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 34px" }}>
              <IconDot name="magnifier" size={44} neutral />
              <div style={{ ...typeStyle("title"), color: c.ink }}>Riset sebelum beli saham</div>
            </Card>
          </Appear>
          {/* the fourth link — amber, long dashes, UNDER the purple ones (Simon, 22 Oct), to a node nobody filled in */}
          <Connector a={hubOut} b={nodeIn(3)} p={grow(gapAt + m.sec(0.2))} shape="elbow" mid={0.45} dashed dash="16 12" tone={theme.color.selfAmber} />
          {ROWS.map((r, i) => {
            const at = W(r.word);
            const dim = 1 - 0.55 * stepBack;
            return (
              <div key={r.text}>
                {/* the purple lines stay solid (Simon, 22 Oct: "garis ungu nya 100%"); only the nodes step back */}
                <Connector a={hubOut} b={nodeIn(i)} p={grow(at)} shape="elbow" mid={0.45} tone={c.indigo} />
                <div style={{ position: "absolute", inset: 0, opacity: dim }}>
                  <GrowNode y={NODE.ys[i]} p={lengthen(at)}>
                    <IconDot name={r.icon} size={36} neutral />
                    <div style={{ flex: 1, ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>{r.text}</div>
                    <Tick p={ease(f, at + m.sec(1.0), m.pop)} />
                  </GrowNode>
                </div>
              </div>
            );
          })}
          <GrowNode y={NODE.ys[3]} p={lengthen(gapAt + m.sec(0.2))} line={theme.color.selfAmber} dashed={self < 0.5} style={{ boxShadow: self > 0.5 ? `${shadow.soft}, 0 0 ${(44 * glow).toFixed(1)}px ${(10 * glow).toFixed(1)}px ${theme.color.selfAmberGlow}` : "none" }}>
            <div style={{ position: "relative", width: 36 * 1.55, height: 36 * 1.55, flex: "none" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 1 - self }}>
                <IconDot name="self" size={36} neutral />
              </div>
              <div style={{ position: "absolute", inset: 0, opacity: self }}>
                <IconDot name="self-amber" size={36} tint={theme.color.neutralDisc} tone={theme.color.selfAmber} />
              </div>
            </div>
            <div style={{ position: "relative", flex: 1, height: NODE.h - 4, overflow: "hidden" }}>
              {/* nothing written yet: a blank line where the research should be */}
              <div style={{ position: "absolute", left: 0, top: NODE.h / 2 - 14, width: 300, height: 24, borderRadius: 999, background: theme.color.neutralDisc, opacity: 1 - named }} />
              <div style={{ position: "absolute", left: 0, top: 0, height: NODE.h - 4, display: "flex", alignItems: "center", whiteSpace: "nowrap", ...typeStyle("body"), color: c.slate, opacity: named * (1 - roll), transform: `translateY(${(-roll * NODE.h * 0.8).toFixed(2)}px)` }}>Investor yang akan membelinya</div>
              <div style={{ position: "absolute", left: 0, top: 0, height: NODE.h - 4, display: "flex", alignItems: "center", whiteSpace: "nowrap", ...typeStyle("body"), fontWeight: 600, color: theme.color.selfAmberInk, opacity: roll, transform: `translateY(${((1 - roll) * NODE.h * 0.8).toFixed(2)}px)` }}>Diri kita sendiri</div>
            </div>
          </GrowNode>
        </div>
      ) : null}

      {/* C — the numbers */}
      <Appear at={statsAt + m.sec(0.2)} out={inputsAt} style={{ left: 0, top: STAT.numberY, width: theme.canvas.width, textAlign: "center" }}>
        {/* on screen from the start at 0 (Simon, 22 Oct), counting up to the script's 26,7 juta as it is said */}
        <div style={{ ...typeStyle("hero"), fontSize: 128, fontWeight: 600, color: c.indigo, fontVariantNumeric: "tabular-nums" }}>{(26.7 * count).toFixed(1).replace(".", ",")} juta</div>
        <div style={{ marginTop: 14, ...typeStyle("body"), color: c.slate, opacity: ease(f, W("investor di Indonesia"), m.reveal) }}>
          investor di <span style={{ color: c.indigo }}>Indonesia</span>
        </div>
      </Appear>
      <Appear at={statsAt + m.sec(0.5)} out={inputsAt} style={{ left: 0, top: 0 }}>
        {Array.from({ length: DOT_N }, (_, i) => {
          const col = i % DOTS.cols;
          const row = Math.floor(i / DOTS.cols);
          const order = col / DOTS.cols; // fills left to right
          const on = dark > 0 && order < dark ? ease(f, W("setengahnya") + m.sec(1.2) * (order / HALF_PAST), m.fade) : 0;
          const born = ease(f, statsAt + m.sec(0.5) + i * 0.6, m.reveal);
          return (
            <div key={i} style={{ position: "absolute", left: DOTS.x + col * (DOTS.size + DOTS.gap), top: DOTS.y + row * (DOTS.size + DOTS.gap), opacity: born, transform: `scale(${(0.6 + 0.4 * born).toFixed(3)})` }}>
              <Ico name="user-circle" size={DOTS.size} tone={on > 0.5 ? theme.color.neutralDotOn : theme.color.neutralDot} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, top: DOTS.y + DOTS.rows * (DOTS.size + DOTS.gap) + 20, width: theme.canvas.width, whiteSpace: "nowrap", opacity: ease(f, W("setengahnya"), m.reveal), display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18 }}>
          <span style={{ ...typeStyle("statement"), color: c.ink }}>&gt; 50%</span>
          <span style={{ ...typeStyle("body"), color: c.slate, opacity: ease(f, W("berusia"), m.reveal) }}>
            berusia di bawah <span style={{ color: c.indigo }}>30 tahun</span>
          </span>
        </div>
      </Appear>

      {/* D — other people's answers, and you */}
      {f >= inputsAt && f < askAt + m.fade ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - ease(f, askAt, m.fade) }}>
          <Appear at={inputsAt} style={{ left: 0, top: 0 }}>
            <div style={{ position: "absolute", left: YOU.x - YOU.r, top: YOU.y - YOU.r, width: YOU.r * 2, height: YOU.r * 2, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.selfAmber}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico name="self-amber" size={58} tone={theme.color.selfAmber} />
            </div>
            <div style={{ position: "absolute", left: YOU.x - 100, top: YOU.y + YOU.r + 12, width: 200, textAlign: "center", ...typeStyle("label"), color: theme.color.selfAmberInk }}>Kamu</div>
          </Appear>
          {INPUTS.map((p, i) => {
            const at = W(p.word);
            const x = srcX(i);
            const owner = ease(f, ownerAt + m.sec(0.12) * i, m.pop);
            return (
              <div key={p.text}>
                <Connector a={{ x: x + SRC.w / 2, y: SRC.y + SRC.h }} b={{ x: YOU.x + (i - 1) * 44, y: YOU.y - YOU.r }} p={ease(f, at + m.sec(0.3), m.sec(0.55))} shape="curve" axis="y" tone={back > 0.5 ? theme.color.connectorMute : c.indigo} dashed={back > 0.5} />
                <Appear at={at} style={{ left: 0, top: 0 }}>
                  <Card x={x} y={SRC.y} w={SRC.w} h={SRC.h} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
                    <IconDot name={p.icon} size={46} neutral />
                    <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>{p.text}</div>
                  </Card>
                  {/* "dibuat untuk kondisi orang lain": each answer belongs to somebody else */}
                  {owner > 0.001 ? (
                    <div style={{ position: "absolute", left: x + SRC.w - 34, top: SRC.y - 30, width: 68, height: 68, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrand}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: owner, transform: `scale(${(0.6 + 0.4 * owner).toFixed(3)})` }}>
                      <Ico name="owner" size={42} tone={theme.color.neutralIcon} />
                    </div>
                  ) : null}
                </Appear>
              </div>
            );
          })}
          <Appear at={W("jawaban orang lain")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
            <Line x={theme.margin.left} y={880} w={theme.canvas.width - theme.margin.left - theme.margin.right} align="center" text="Jawaban orang dibuat untuk orang lain." mark="orang lain" size={48} weight={500} />
          </Appear>
        </div>
      ) : null}

      {/* E — which question comes first */}
      <Appear at={W("sebelum tanya")} out={insightAt} style={{ left: CX - Q.w / 2, top: Q.top[0], width: Q.w, height: Q.h }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(swap * (Q.top[1] - Q.top[0])).toFixed(2)}px) scale(${(1 - 0.05 * swap).toFixed(3)})` }}>
          <Card x={0} y={0} w={Q.w} h={Q.h} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 40px", opacity: 1 - 0.4 * swap }}>
            <IconDot name="where" size={42} neutral />
            <div style={{ flex: 1, ...typeStyle("title"), color: c.ink }}>“Aku harus investasi di mana?”</div>
            <div style={{ ...typeStyle("title"), color: c.slate, opacity: swap }}>2</div>
          </Card>
        </div>
      </Appear>
      <Appear at={W("“Aku sebenarnya") - m.sec(0.1)} out={insightAt} style={{ left: CX - Q.w / 2, top: Q.top[0], width: Q.w, height: Q.h }}>
        {/* the question about YOU glows, like "Diri kita sendiri" above (Simon, 22 Oct: "kasih glow") */}
        <Card x={0} y={0} w={Q.w} h={Q.h} line={theme.color.selfAmber} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 40px", boxShadow: `${shadow.soft}, 0 0 ${(44 * qGlow).toFixed(1)}px ${(10 * qGlow).toFixed(1)}px ${theme.color.selfAmberGlow}` }}>
          <IconDot name="self-amber" size={42} tint={theme.color.neutralDisc} tone={theme.color.selfAmber} />
          <div style={{ flex: 1, ...typeStyle("title"), color: c.ink }}>“Aku sebenarnya investor seperti apa?”</div>
          <div style={{ ...typeStyle("title"), color: theme.color.selfAmberInk }}>1</div>
        </Card>
      </Appear>

      {/* F — the insight */}
      <OrangTuntun at={insightAt} />
      <Appear at={W("riset pertama")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - youAt }}>
          <Line x={ORANG_TUNTUN_RIGHT + 90} y={520} w={theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 160} size={60} text="Riset pertama dalam investasi seharusnya dimulai dari diri kita sendiri." />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: youAt }}>
          <Line x={ORANG_TUNTUN_RIGHT + 90} y={520} w={theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 160} size={60} text="Riset pertama dalam investasi seharusnya dimulai dari diri kita sendiri." mark="diri kita sendiri" />
        </div>
      </Appear>
    </Stage>
  );
};
