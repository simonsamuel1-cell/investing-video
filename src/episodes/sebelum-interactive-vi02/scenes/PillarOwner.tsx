/**
 * VI02 · SC02 — "Kamu Bukan Cuma Pemegang Saham, Kamu Pemilik Bisnis" in VI01's look (Simon, 12 Nov 2026), from the ChatGPT
 * storyboard docs/vi-style/storyboards/VI02-SC02-v3.png. The old scene is scenes/Owner.tsx (VI01_LOOK = false).
 *
 *  A  "Inilah pilar pertama": VI01's four columns under "Value Investing", where VI01 left them; the first one stays in its
 *     colour, the other three go grey.
 *  B  "Benjamin Graham menulis dalam The Intelligent Investor" (a cut): his photo tile, the book, and the quote in a dashed
 *     text box opening from its centre; "businesslike" lit on the Indonesian line.
 *  C  "Warren Buffett bahkan menyebutnya…": his photo tile at the right; on "kalimat paling penting", "approved" under his name,
 *     like the meme "Warren Buffett approved" (Simon 12 Nov: the arrow and "Kalimat terpenting" removed).
 *  D  "Bayangkan dirimu…" (a cut): "Kamu" (the avatar), Pemilik 1%, and the three things you don't have to do, each crossed on its sentence.
 *  E  "Tapi bisnisnya tetap bekerja." (a cut): SC01's working business again — frame, chain, packs running (Simon 12 Nov).
 *  F  "Saat perusahaan menjual…" (a cut): Penjualan → Laba → Ekspansi, and from them to "Kamu": Bagianmu.
 *  G  "Kalau sebagian laba dibagikan…" (a cut): Laba branches up to Dividen → Kamu, and down to Reinvestasi → Bisnis tumbuh →
 *     Laba lebih besar.
 *  H  "Jadi sebelum bertanya" (a cut): Orang Tuntun, the question to drop (crossed, grey) and the one to ask first (lit).
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { WorkingBusiness } from "./CodeAndBusiness";
import { Appear, AvatarTile, BoardGrid, KamuAvatar, Card, Column, DashBox, Glyph, GrowArrow, Mark, ORANG_TUNTUN_RIGHT, OrangTuntun, PhotoTile, Ring, Shot, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — VI01's columns, exactly where VI01 SC02 left them
const K = 0.81;
const PILLAR = { w: 340 * K, gap: 50 * K, col: 150, h: 340, text: 34 * K, label: 92 };
const LABEL_Y = 423;
const PILLARS = ["Beli saham =\nBeli perusahaan", "Beli murah", "Manfaatkan market", "Investasi pada bisnis yang dipahami"] as const;
const ROW = 4 * PILLAR.w + 3 * PILLAR.gap;
const pillarX = (i: number) => CX - ROW / 2 + i * (PILLAR.w + PILLAR.gap);
const BOTTOM = LABEL_Y + PILLAR.label + PILLAR.h;
const HEADING = { y: 250, size: 64 };

// B–C — the quote between the two investors
const TILE = { d: 260 };
const TILE_H = (TILE.d * 423) / 406;
const GRAHAM = { x: 170, y: 250 };
const BUFFETT = { x: 1750 - TILE.d, y: 250 };
const NAME_GAP = 26;
const QUOTE = { cx: CX, y: 270, w: 760, h: 300 };
const BOOK = { y: 640 };

// D — "Kamu", and what you don't have to do
const OWNER = { x: 520, y: 470, d: 190 };
const NOT = { x: 840, w: 640, h: 108, ys: [300, 440, 580], icons: ["door-open", "storefront", "calendar-check"], texts: ["Datang ke pabrik", "Menjual produk", "Kerja tiap hari"], at: ["datang ke pabrik", "ikut menjual", "bekerja di sana"] } as const;


// E — you, small in the corner of SC01's working business
const RUN_KAMU = { x: 1640, y: 300, d: 130 };

// F — what the business makes, and your part of it
const FLOW = { y: 300, w: 300, h: 210, xs: [390, 810, 1230], disc: 104 };
const FLOW_ITEMS = [
  { icon: "shopping-cart", label: "Penjualan", at: "menjual lebih" },
  { icon: "coins", label: "Laba", at: "laba lebih besar" },
  { icon: "storefront", label: "Ekspansi", at: "memperluas" },
] as const;
const PART = { x: 960, y: 760, d: 130 };

// G — the two ways a profit goes
const NODE = { w: 280, h: 190, disc: 92 };
const BRANCH = {
  laba: { x: 180, y: 445 },
  dividen: { x: 640, y: 250 },
  kamu: { x: 1180, y: 345, d: 130 },
  re: { x: 640, y: 640 },
  grow: { x: 1030, y: 640 },
  more: { x: 1420, y: 640 },
};

// H — the two questions
const ASK = { x: ORANG_TUNTUN_RIGHT + 80, w: 1760 - ORANG_TUNTUN_RIGHT - 80, h: 150, ys: [330, 560], size: 44 };

/** A white card with an icon on a grey disc above its label; `lit` rings it in indigo and paints the icon. */
const Node = ({ x, y, w, h, disc, icon, label, p, lit = 0 }: { x: number; y: number; w: number; h: number; disc: number; icon: string; label: string; p: number; lit?: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - p) * 14, width: w, height: h, opacity: p }}>
      <Card x={0} y={0} w={w} h={h}>
        <Ring p={lit} tone={c.indigo} />
        <div style={{ position: "absolute", left: (w - disc) / 2, top: 28, width: disc, height: disc, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Glyph icon={icon} size={disc * 0.54} tone={interpolateColors(lit, [0, 1], [theme.color.neutralIcon, c.indigo])} />
        </div>
        <div style={{ position: "absolute", left: 0, width: w, top: 28 + disc + 18, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{label}</div>
      </Card>
    </div>
  );
};

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(2, BLOCK.SC02);
  const g = f + BLOCK.SC02;

  const grahamAt = W("Benjamin");
  const ownerAt = W("Bayangkan");
  const runAt = W("Tapi bisnisnya");
  const flowAt = W("Saat perusahaan");
  const branchAt = W("Kalau sebagian");
  const askAt = W("Jadi sebelum");

  // A
  const firstAt = W("pilar pertama");
  const greyed = ease(f, firstAt, m.move);
  const ownLit = ease(f, W("membeli saham berarti"), m.pop);

  // B–C
  const quoteAt = W("Investment is");
  const businesslike = ease(f, W("seperti sebuah bisnis"), m.reveal);
  const buffettAt = W("Warren Buffett");

  // F
  const flowLit = (i: number) => ease(f, W(FLOW_ITEMS[i].at), m.pop) * (i < 2 ? 1 - ease(f, W(FLOW_ITEMS[i + 1].at), m.pop) : 1);
  const partAt = W("sebagai pemegang saham");

  // G
  const divAt = W("dibagikan sebagai");
  const reachAt = W("langsung ke");
  const reAt = W("digunakan kembali");
  const growAt = W("mengembangkan bisnis");
  const moreAt = W("laba yang lebih besar");

  // H
  const q1 = ease(f, W("Harga sahamnya"), m.reveal);
  const drop = ease(f, W("biasakan"), m.reveal);
  const q2 = ease(f, W("Bisnis yang saya"), m.reveal);


  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the columns */}
      <Shot from={-1} to={grahamAt} block={BLOCK.SC02} cutIn={false}>
        <div style={{ position: "absolute", left: 0, right: 0, top: HEADING.y, textAlign: "center", ...typeStyle("title"), fontSize: HEADING.size, fontWeight: 700, color: c.ink }}>Value Investing</div>
        {PILLARS.map((text, i) => {
          const tone = interpolateColors(i / 3, [0, 1], [c.cyan, c.indigo]);
          const ink = interpolateColors(i / 3, [0, 1], [theme.color.cyanInk, c.indigo]);
          const g0 = i === 0 ? 0 : greyed;
          const x = pillarX(i);
          const lift = i === 0 ? ownLit : 0;
          return (
            <div key={text} style={{ position: "absolute", inset: 0, transform: `translateY(${(-14 * lift).toFixed(1)}px)` }}>
              <div style={{ position: "absolute", left: x + (PILLAR.w - PILLAR.col) / 2, top: BOTTOM - PILLAR.h, width: PILLAR.col, height: PILLAR.h }}>
                <Column w={PILLAR.col} h={PILLAR.h} tone={interpolateColors(g0, [0, 1], [tone, theme.color.skeleton])} />
              </div>
              <div style={{ position: "absolute", left: x - PILLAR.gap / 2 + 5, width: PILLAR.w + PILLAR.gap - 10, top: LABEL_Y, height: PILLAR.label - 14, display: "flex", alignItems: "flex-end", justifyContent: "center", textAlign: "center", whiteSpace: "pre-line", ...typeStyle("label"), fontSize: PILLAR.text * (1 + 0.18 * lift), fontWeight: 600, lineHeight: 1.25, color: interpolateColors(g0, [0, 1], [ink, theme.color.mute]) }}>{text}</div>
            </div>
          );
        })}
      </Shot>

      {/* B–C — Graham, his quote, Buffett */}
      <Shot from={grahamAt} to={ownerAt} block={BLOCK.SC02}>
        <PhotoTile name="graham" d={TILE.d} style={{ left: GRAHAM.x, top: GRAHAM.y }} />
        <div style={{ position: "absolute", left: GRAHAM.x - 40, width: TILE.d + 80, top: GRAHAM.y + TILE_H + NAME_GAP, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>Benjamin Graham</div>
        <Appear at={W("The Intelligent")} style={{ left: 0, top: BOOK.y, width: theme.canvas.width, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 32px 12px 14px", borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft }}>
            <div style={{ width: 62, height: 62, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="book-open" size={34} tone={theme.color.neutralIcon} />
            </div>
            <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 500, fontStyle: "italic", color: c.ink, whiteSpace: "nowrap" }}>The Intelligent Investor</div>
          </div>
        </Appear>
        <DashBox cx={QUOTE.cx} y={QUOTE.y} w={QUOTE.w} h={QUOTE.h} at={quoteAt}>
          <div style={{ position: "absolute", inset: 0, padding: "0 56px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", ...typeStyle("title"), fontSize: 46, fontWeight: 500, fontStyle: "italic", lineHeight: 1.3, color: c.ink }}>
            <span>
              “Investment is most intelligent when it is most{" "}
              <span style={{ color: interpolateColors(businesslike, [0, 1], [c.ink, c.indigo]), background: businesslike > 0.001 ? theme.color.indigoWashSolid : undefined, borderRadius: 8 }}>businesslike</span>.”
            </span>
          </div>
        </DashBox>
        <Appear at={buffettAt} rise={0} style={{ left: BUFFETT.x, top: BUFFETT.y, width: TILE.d }}>
          <PhotoTile name="buffett" d={TILE.d} style={{ left: 0, top: 0 }} />
          <div style={{ position: "absolute", left: -40, width: TILE.d + 80, top: TILE_H + NAME_GAP, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>Warren Buffett</div>
        </Appear>
        {/* "Warren Buffett approved" (Simon 12 Nov: "biar kayak meme"), set exactly like his name, on the line under it, a 👍 beside it */}
        <Appear at={W("kalimat paling")} rise={0} style={{ left: BUFFETT.x - 40, width: TILE.d + 80, top: BUFFETT.y + TILE_H + NAME_GAP + 44, textAlign: "center" }}>
          <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>approved <span style={{ fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" }}>👍</span></div>
        </Appear>
      </Shot>

      {/* D — "Kamu", the owner, and what an owner doesn't have to do */}
      <Shot from={ownerAt} to={runAt} block={BLOCK.SC02}>
        {/* "Kamu" as the new avatar (Simon 12 Nov: "ganti icon ke icon avatar yang baru") */}
        <AvatarTile x={OWNER.x} y={OWNER.y} d={OWNER.d} />
        <div style={{ position: "absolute", left: OWNER.x - 150, width: 300, top: OWNER.y + OWNER.d / 2 + 14, textAlign: "center", ...typeStyle("label"), fontSize: 38, fontWeight: 600, color: c.ink }}>Kamu</div>
        <Appear at={W("pemilik bisnis")} style={{ left: 0, top: 0 }}>
          <WordPill x={OWNER.x} y={OWNER.y + OWNER.d / 2 + 120} text="Pemilik 1%" size={34} />
        </Appear>
        {NOT.texts.map((text, i) => {
          const at = W(NOT.at[i]);
          const p = ease(f, at - m.sec(0.35), m.reveal);
          const no = ease(f, at + m.sec(0.25), m.pop);
          return p > 0.001 ? (
            <div key={text} style={{ position: "absolute", left: NOT.x, top: NOT.ys[i] + (1 - p) * 12, width: NOT.w, height: NOT.h, opacity: p }}>
              <Card x={0} y={0} w={NOT.w} h={NOT.h}>
                <div style={{ position: "absolute", left: 22, top: (NOT.h - 68) / 2, width: 68, height: 68, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={NOT.icons[i]} size={38} tone={theme.color.neutralIcon} />
                </div>
                <div style={{ position: "absolute", left: 114, top: NOT.h / 2, transform: "translateY(-50%)", ...typeStyle("label"), fontSize: 38, fontWeight: 500, color: interpolateColors(no, [0, 1], [c.ink, theme.color.mute]), whiteSpace: "nowrap" }}>{text}</div>
                <Mark kind="cross" p={no} x={NOT.w - 58} y={NOT.h / 2} size={52} />
              </Card>
            </div>
          ) : null;
        })}
      </Shot>

      {/* E — the business working on its own: SC01's working factory again, the packs already running (Simon 12 Nov) */}
      <Shot from={runAt} to={flowAt} block={BLOCK.SC02}>
        <WorkingBusiness f={f} from={runAt - m.sec(4)} />
        {/* you, in the frame's top-right corner, watching it run (Simon 12 Nov: "kasih icon avatar juga") */}
        <KamuAvatar x={RUN_KAMU.x} y={RUN_KAMU.y} d={RUN_KAMU.d} label="Kamu" labelSize={30} />
      </Shot>

      {/* F — Penjualan → Laba → Ekspansi, and your part */}
      <Shot from={flowAt} to={branchAt} block={BLOCK.SC02}>
        {FLOW_ITEMS.map((it, i) => (
          <Node key={it.label} x={FLOW.xs[i] - FLOW.w / 2} y={FLOW.y} w={FLOW.w} h={FLOW.h} disc={FLOW.disc} icon={it.icon} label={it.label} p={ease(f, W(it.at) - m.sec(0.3), m.reveal)} lit={flowLit(i)} />
        ))}
        {[0, 1].map((i) => (
          <GrowArrow key={i} x0={FLOW.xs[i] + FLOW.w / 2 + 16} y0={FLOW.y + FLOW.h / 2} x1={FLOW.xs[i + 1] - FLOW.w / 2 - 16} y1={FLOW.y + FLOW.h / 2} p={ease(f, W(FLOW_ITEMS[i + 1].at) - m.sec(0.5), m.sec(0.3))} />
        ))}
        {/* the three join and run down to you */}
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          {(() => {
            const p = ease(f, partAt, m.sec(0.6));
            if (p <= 0.001) return null;
            const yb = FLOW.y + FLOW.h + 16;
            const yj = yb + 70;
            const len = 2 * (FLOW.xs[2] - FLOW.xs[0]) + 70 * 2 + (PART.y - PART.d / 2 - 14 - yj);
            return (
              <path d={`M ${FLOW.xs[0]} ${yb} L ${FLOW.xs[0]} ${yj} L ${FLOW.xs[2]} ${yj} L ${FLOW.xs[2]} ${yb} M ${PART.x} ${yj} L ${PART.x} ${PART.y - PART.d / 2 - 14}`} fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
            );
          })()}
        </svg>
        <Appear at={partAt + m.sec(0.4)} style={{ left: 0, top: 0 }}>
          <KamuAvatar x={PART.x} y={PART.y} d={PART.d} />
        </Appear>
        <Appear at={W("punya bagian")} style={{ left: 0, top: 0 }}>
          <WordPill x={PART.x + PART.d / 2 + 140} y={PART.y} text="Bagianmu" size={34} />
        </Appear>
      </Shot>

      {/* G — the profit's two ways */}
      <Shot from={branchAt} to={askAt} block={BLOCK.SC02}>
        <Node x={BRANCH.laba.x} y={BRANCH.laba.y - NODE.h / 2} w={NODE.w} h={NODE.h} disc={NODE.disc} icon="coins" label="Laba" p={1} lit={1 - ease(f, divAt, m.pop)} />
        <Connector a={{ x: BRANCH.laba.x + NODE.w + 8, y: BRANCH.laba.y - 20 }} b={{ x: BRANCH.dividen.x - 12, y: BRANCH.dividen.y }} p={ease(f, divAt - m.sec(0.4), m.sec(0.5))} shape="elbow" />
        <Node x={BRANCH.dividen.x} y={BRANCH.dividen.y - NODE.h / 2} w={NODE.w} h={NODE.h} disc={NODE.disc} icon="hand-coins" label="Dividen" p={ease(f, divAt, m.reveal)} lit={ease(f, divAt, m.pop) * (1 - ease(f, reAt, m.pop))} />
        <GrowArrow x0={BRANCH.dividen.x + NODE.w + 16} y0={BRANCH.dividen.y} x1={BRANCH.kamu.x - BRANCH.kamu.d / 2 - 16} y1={BRANCH.dividen.y} p={ease(f, reachAt - m.sec(0.2), m.sec(0.5))} />
        <Appear at={reachAt + m.sec(0.2)} style={{ left: 0, top: 0 }}>
          <KamuAvatar x={BRANCH.kamu.x} y={BRANCH.dividen.y} d={BRANCH.kamu.d} label="Kamu" labelSize={30} />
        </Appear>
        <Connector a={{ x: BRANCH.laba.x + NODE.w + 8, y: BRANCH.laba.y + 20 }} b={{ x: BRANCH.re.x - 12, y: BRANCH.re.y }} p={ease(f, reAt - m.sec(0.4), m.sec(0.5))} shape="elbow" />
        <Node x={BRANCH.re.x} y={BRANCH.re.y - NODE.h / 2} w={NODE.w} h={NODE.h} disc={NODE.disc} icon="arrows-clockwise" label="Reinvestasi" p={ease(f, reAt, m.reveal)} lit={ease(f, reAt, m.pop) * (1 - ease(f, growAt, m.pop))} />
        <GrowArrow x0={BRANCH.re.x + NODE.w + 14} y0={BRANCH.re.y} x1={BRANCH.grow.x - 14} y1={BRANCH.re.y} p={ease(f, growAt - m.sec(0.35), m.sec(0.3))} />
        <Node x={BRANCH.grow.x} y={BRANCH.grow.y - NODE.h / 2} w={NODE.w + 40} h={NODE.h} disc={NODE.disc} icon="factory" label="Bisnis tumbuh" p={ease(f, growAt, m.reveal)} lit={ease(f, growAt, m.pop) * (1 - ease(f, moreAt, m.pop))} />
        <GrowArrow x0={BRANCH.grow.x + NODE.w + 54} y0={BRANCH.re.y} x1={BRANCH.more.x + 26} y1={BRANCH.re.y} p={ease(f, moreAt - m.sec(0.35), m.sec(0.3))} />
        <Node x={BRANCH.more.x + 40} y={BRANCH.more.y - NODE.h / 2} w={NODE.w + 40} h={NODE.h} disc={NODE.disc} icon="chart-line-up" label="Laba lebih besar" p={ease(f, moreAt, m.reveal)} lit={ease(f, moreAt, m.pop)} />
      </Shot>

      {/* H — the question to drop, and the one to ask first */}
      <Shot from={askAt} to={1e6} block={BLOCK.SC02} cutOut={false}>
        <OrangTuntun at={askAt} />
        {[
          { text: "“Harga sahamnya akan naik nggak?”", p: q1 },
          { text: "“Bisnis yang saya miliki ini sebenarnya menghasilkan apa?”", p: q2 },
        ].map((q, i) =>
          q.p > 0.001 ? (
            <div key={i} style={{ position: "absolute", left: ASK.x, top: ASK.ys[i] + (1 - q.p) * 14, width: ASK.w, height: ASK.h, opacity: q.p }}>
              <Card x={0} y={0} w={ASK.w} h={ASK.h} style={{ background: i === 0 ? interpolateColors(drop, [0, 1], [c.cardBg, theme.color.neutralDisc]) : c.cardBg, boxShadow: i === 1 ? shadow.glow : shadow.soft }}>
                {i === 1 ? <Ring p={1} tone={c.indigo} /> : null}
                <div style={{ position: "absolute", left: 44, right: i === 0 ? 120 : 44, top: ASK.h / 2, transform: "translateY(-50%)", ...typeStyle("title"), fontSize: ASK.size, fontWeight: 500, lineHeight: 1.25, color: i === 0 ? interpolateColors(drop, [0, 1], [c.ink, theme.color.mute]) : c.ink }}>{q.text}</div>
                {i === 0 ? <Mark kind="cross" p={drop} x={ASK.w - 70} y={ASK.h / 2} size={60} /> : null}
              </Card>
            </div>
          ) : null,
        )}
      </Shot>
    </Stage>
  );
};
