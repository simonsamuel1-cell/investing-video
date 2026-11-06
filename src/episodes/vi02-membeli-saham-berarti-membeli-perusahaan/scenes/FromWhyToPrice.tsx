/**
 * VI02 · SC08 — "Dari “Kenapa” ke “Berapa Harganya?”", rebuilt on 5 Nov in IN07's language (Simon: "minimalis, UI, digital"):
 * white cards, video players, thin lines and thin bars, no illustration.
 *
 *  A  "Di video sebelumnya … Di video ini": the two videos as players, as IN07 SC01 shows the one before it.
 *  B  "Di balik satu kode": the chain, CODE → BUSINESS → REVENUE → PROFIT → SHAREHOLDER, small cards on the VO's own list, the
 *     newest lit.
 *  C  "Semakin kita memahami bisnisnya": the chain rises a little; one card, two thin bars: one grows as the other shrinks.
 *  D  "Di Tuntun": Simon's three screens (5 Nov; BBCA), as IN07 SC06 shows them: a pill per point beside the heading, turning
 *     green on its words, each point's screen joining the row, cropped of the status bar, the BBCA header and the Buy row.
 *  E  "Tapi setelah memahami": two UI cards: High Quality Company ✓ with its three checks, Value ? with a gauge; his line split under them.
 *  F  "Jadi di video selanjutnya": the next player, Next Video.
 */
import type React from "react";
import { Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { SoftGround, Stage, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Glyph, GrowArrow, Ico, Line, Mark, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the two players, and F's
const PLAYER = { w: 620, h: 420, y: 300, gap: 120, pad: 20, thumb: 300, chip: 52, bar: 10, icon: 34, play: 112, word: 480, wordH: 112, wordSize: 34 };
const playerX = (i: number) => CX - PLAYER.w - PLAYER.gap / 2 + i * (PLAYER.w + PLAYER.gap);

// B — the chain
const CHAIN = { y: 430, w: 300, h: 104, gap: 34, disc: 56, size: 26, rise: 90 };
const chainX = (i: number) => CX - (5 * CHAIN.w + 4 * CHAIN.gap) / 2 + i * (CHAIN.w + CHAIN.gap);

// C — what grows, and what stops deciding for us
const BARS = { w: 1000, h: 230, y: 500, labelX: 48, trackX: 390, pad: 48, bar: 12, rows: [78, 152], size: 32, small: 0.14 };

// D — the app's own screens: 1080 × 1700 from y 300 (no status bar, BBCA header or Buy row), the report's first page to the
// same shape; as tall as the room under the heading
const APP = { headX: theme.margin.left, mascot: 84, mascotGap: 22, bob: 3, bobFor: 1.6, y: 190, size: 56, pillX: 506, pillH: 64, pillGap: 22, pillSize: 34, tick: 34, top: 258, gap: 50, ratio: 0.6353 };
const APP_H = theme.captionBand.top - 12 - APP.top;
const APP_W = APP_H * APP.ratio;
const SCREENS = [
  { text: "Revenue Breakdown", src: "art/vi02/app/sc08-revenue-breakdown.jpg", at: "Revenue Breakdown" },
  { text: "Perkembangan Laba", src: "art/vi02/app/sc08-perkembangan-laba.jpg", at: "lihat perkembangan" },
  { text: "Deep Research", src: "art/vi02/app/sc08-deep-research.jpg", at: "Deep Research" },
];

// E — the two UI cards
const TWO = { w: 640, h: 400, y: 200, gap: 60, disc: 64, head: 100, size: 38, row: 72, rowY: 128, line: 690, lineSize: 44 };
const twoX = (i: number) => CX - TWO.w - TWO.gap / 2 + i * (TWO.w + TWO.gap);
const CHECKS = ["Business", "Quality", "Risk"];
const GAUGE = { x: 56, y: 262, h: 14, knob: 64, askSize: 110, askY: 118, labelY: 300 };

// F
const NEXT = { w: 460, h: 290, y: 190, thumb: 220, label: 530, line: 640, size: 60 };

/** A player: a grey thumbnail holding `children`, the previous-track icon, a progress bar. */
const Player = ({ x, y, w, h, thumb, progress, children }: { x: number; y: number; w: number; h: number; thumb: number; progress: number; children: React.ReactNode }) => {
  const c = usePalette();
  const barY = PLAYER.pad + thumb + (h - PLAYER.pad - thumb) / 2;
  const trackX = PLAYER.pad + PLAYER.icon + 26;
  const trackW = w - trackX - PLAYER.pad - 8;
  return (
    <Card x={x} y={y} w={w} h={h}>
      <div style={{ position: "absolute", left: PLAYER.pad, top: PLAYER.pad, width: w - 2 * PLAYER.pad, height: thumb, borderRadius: 20, background: theme.color.neutralDisc, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
      <div style={{ position: "absolute", left: PLAYER.pad + 6, top: barY - PLAYER.icon / 2 }}>
        <Ico name="previous" size={PLAYER.icon} tone={c.ink} />
      </div>
      <div style={{ position: "absolute", left: trackX, top: barY - PLAYER.bar / 2, width: trackW, height: PLAYER.bar, borderRadius: PLAYER.bar / 2, background: theme.color.skeleton }} />
      <div style={{ position: "absolute", left: trackX, top: barY - PLAYER.bar / 2, width: trackW * progress, height: PLAYER.bar, borderRadius: PLAYER.bar / 2, background: c.indigo }} />
    </Card>
  );
};

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;

  const chainAt = W("Di balik");
  const appAt = W("Di Tuntun");
  const twoAt = W("Tapi setelah");
  const nextAt = W("Jadi di");
  const stepUp = ease(f, W("Semakin kita") - m.sec(0.2), m.move);
  const knowAt = W("memahami bisnisnya");
  const know = ease(f, knowAt, W("semakin kecil") - knowAt);
  const shrinkAt = W("semakin kecil");
  const noise = ease(f, shrinkAt, W("pergerakan harga", 0, "f1") - shrinkAt);

  const LESSONS = [
    { tag: "Video sebelumnya", icon: "factory", word: "Mulai dari bisnis", at: -m.reveal, wordAt: W("dimulai dari"), watched: 1 },
    { tag: "Video ini", icon: "user", word: "Memiliki sebagian perusahaan", at: W("Di video", 1), wordAt: W("memiliki sebagian"), watched: ease(f, W("Di video", 1), chainAt - W("Di video", 1)) * 0.85 },
  ];
  const LINKS = [
    { label: "CODE", icon: "tag", at: W("satu kode") },
    { label: "BUSINESS", icon: "factory", at: W("produk") },
    { label: "REVENUE", icon: "coins", at: W("pendapatan") },
    { label: "PROFIT", icon: "chart-line-up", at: W("laba") },
    { label: "SHAREHOLDER", icon: "user", at: W("pemegang saham") },
  ];
  const expensive = ease(f, W("terlalu mahal"), m.move);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the two videos */}
      {LESSONS.map((l, i) => (
        <Appear key={l.tag} at={l.at} out={chainAt - m.sec(0.3)} rise={i ? undefined : 0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <WordPill x={playerX(i) + PLAYER.w / 2} y={PLAYER.y - PLAYER.chip} text={l.tag} />
          <Player x={playerX(i)} y={PLAYER.y} w={PLAYER.w} h={PLAYER.h} thumb={PLAYER.thumb} progress={l.watched}>
            {f < l.wordAt ? <Disc icon="play" size={PLAYER.play} tone={theme.color.neutralIcon} tint={c.cardBg} /> : null}
            <div style={{ position: "absolute", left: (PLAYER.w - 2 * PLAYER.pad - PLAYER.word) / 2, top: (PLAYER.thumb - PLAYER.wordH) / 2 + (1 - ease(f, l.wordAt, m.reveal)) * 14, width: PLAYER.word, height: PLAYER.wordH, borderRadius: 18, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 20px", boxSizing: "border-box", opacity: ease(f, l.wordAt, m.reveal) }}>
              <Glyph icon={l.icon} size={40} tone={c.indigo} />
              <div style={{ ...typeStyle("title"), fontSize: PLAYER.wordSize - (i ? 6 : 0), fontWeight: 500, lineHeight: 1.2, color: c.ink, whiteSpace: "nowrap" }}>{l.word}</div>
            </div>
          </Player>
        </Appear>
      ))}
      <Appear at={W("Di video", 1)} out={chainAt - m.sec(0.3)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <GrowArrow x0={playerX(0) + PLAYER.w + 14} y0={PLAYER.y + PLAYER.h / 2} x1={playerX(1) - 14} y1={PLAYER.y + PLAYER.h / 2} p={ease(f, W("Di video", 1), m.sec(0.4))} />
      </Appear>

      {/* B — the chain */}
      <Appear at={chainAt} out={appAt - m.sec(0.3)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(-CHAIN.rise * stepUp).toFixed(1)}px)` }}>
          {LINKS.map((l, i) => {
            const inP = ease(f, l.at, m.reveal);
            if (inP <= 0.001) return null;
            // the newest link is lit until the next one comes; the last stays lit until the bars take over
            const on = inP * (i < LINKS.length - 1 ? 1 - ease(f, LINKS[i + 1].at, m.reveal) : 1 - stepUp);
            const tone = interpolateColors(on, [0, 1], [theme.color.neutralIcon, c.indigo]);
            return (
              <Card key={l.label} x={chainX(i)} y={CHAIN.y - CHAIN.h / 2 + (1 - inP) * 12} w={CHAIN.w} h={CHAIN.h} line={on > 0.5 ? theme.color.connector : undefined} style={{ opacity: inP, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxShadow: `${shadow.soft}, 0 0 ${(40 * on).toFixed(1)}px ${(8 * on).toFixed(1)}px ${theme.color.indigoGlow}` }}>
                <div style={{ width: CHAIN.disc, height: CHAIN.disc, flex: "none", borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={l.icon} size={CHAIN.disc * 0.56} tone={tone} />
                </div>
                <div style={{ ...typeStyle("title"), fontSize: CHAIN.size, fontWeight: 500, color: interpolateColors(on, [0, 1], [c.ink, c.indigo]), whiteSpace: "nowrap" }}>{l.label}</div>
              </Card>
            );
          })}
          {LINKS.slice(1).map((l, i) => {
            // the last arrow takes all of "uang yang akhirnya menjadi bagian" to reach the shareholder
            const last = i === LINKS.length - 2;
            const reach = last ? ease(f, W("uang"), l.at - W("uang")) : ease(f, l.at - m.sec(0.25), m.sec(0.25));
            return <GrowArrow key={l.label} x0={chainX(i) + CHAIN.w + 6} y0={CHAIN.y} x1={chainX(i + 1) - 6} y1={CHAIN.y} p={reach} />;
          })}
        </div>
      </Appear>

      {/* C — the bars */}
      <Appear at={W("Semakin kita")} out={appAt - m.sec(0.3)} style={{ left: 0, top: 0 }}>
        <Card x={CX - BARS.w / 2} y={BARS.y} w={BARS.w} h={BARS.h}>
          {[
            { label: "Pemahaman bisnis", share: BARS.small + (1 - BARS.small) * know, tone: c.indigo },
            { label: "Rumor & harga", share: 1 - (1 - BARS.small) * noise, tone: theme.color.mute },
          ].map((b, i) => (
            <div key={b.label}>
              <div style={{ position: "absolute", left: BARS.labelX, top: BARS.rows[i], transform: "translateY(-50%)", ...typeStyle("label"), fontSize: BARS.size, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>{b.label}</div>
              <div style={{ position: "absolute", left: BARS.trackX, top: BARS.rows[i] - BARS.bar / 2, width: BARS.w - BARS.trackX - BARS.pad, height: BARS.bar, borderRadius: BARS.bar / 2, background: theme.color.skeleton }} />
              <div style={{ position: "absolute", left: BARS.trackX, top: BARS.rows[i] - BARS.bar / 2, width: (BARS.w - BARS.trackX - BARS.pad) * b.share, height: BARS.bar, borderRadius: BARS.bar / 2, background: b.tone }} />
            </div>
          ))}
        </Card>
      </Appear>

      {/* D — the heading, a pill per point, and the screens */}
      <Appear at={appAt} out={twoAt - m.sec(0.3)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <TuntunMark x={APP.headX + APP.mascot / 2} y={APP.y - APP.mascot / 2 + APP.bob * Math.sin(((f - appAt) / m.sec(APP.bobFor)) * Math.PI * 2)} height={APP.mascot} />
        <Line x={APP.headX + APP.mascot + APP.mascotGap} y={APP.y} w={300} size={APP.size} weight={500} text="Di Tuntun" />
        <div style={{ position: "absolute", left: APP.pillX, top: APP.y - APP.pillH / 2, height: APP.pillH, display: "flex", alignItems: "center", gap: APP.pillGap }}>
          {SCREENS.map((k) => {
            const ok = ease(f, W(k.at), m.pop);
            return (
              <div key={k.text} style={{ height: APP.pillH, display: "flex", alignItems: "center", gap: 10 * ok, padding: "0 26px", borderRadius: 999, background: interpolateColors(ok, [0, 1], [c.cardBg, theme.color.ok]), boxShadow: `${shadow.soft}, inset 0 0 0 2px ${interpolateColors(ok, [0, 1], [theme.color.connector, theme.color.ok])}`, ...typeStyle("label"), fontSize: APP.pillSize, fontWeight: 600, color: interpolateColors(ok, [0, 1], [c.indigo, c.cardBg]), whiteSpace: "nowrap" }}>
                <div style={{ width: APP.tick * ok, height: APP.tick, borderRadius: 999, background: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: 22, fontWeight: 700, color: theme.color.ok, opacity: ok }}>✓</div>
                {k.text}
              </div>
            );
          })}
        </div>
        {SCREENS.map((k, i) => {
          const p = ease(f, W(k.at), m.reveal);
          if (p <= 0.001) return null;
          const rowW = SCREENS.length * APP_W + (SCREENS.length - 1) * APP.gap;
          return (
            <div key={k.src} style={{ position: "absolute", left: CX - rowW / 2 + i * (APP_W + APP.gap), top: APP.top + (1 - p) * 24, width: APP_W, height: APP_H, borderRadius: theme.shape.cardRadius, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, opacity: p }}>
              <Img src={staticFile(k.src)} style={{ width: APP_W, height: APP_H, display: "block" }} />
            </div>
          );
        })}
      </Appear>

      {/* E — a good company, and its price */}
      <Appear at={twoAt} out={nextAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Card x={twoX(0)} y={TWO.y} w={TWO.w} h={TWO.h}>
          <div style={{ position: "absolute", left: 40, top: 0, height: TWO.head, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: TWO.disc, height: TWO.disc, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="factory" size={TWO.disc * 0.56} tone={c.indigo} />
            </div>
            <div style={{ ...typeStyle("title"), fontSize: TWO.size, fontWeight: 700, color: theme.color.checkGreen, whiteSpace: "nowrap" }}>High Quality Company</div>
          </div>
          <Mark kind="check" p={1} x={TWO.w - 64} y={TWO.head / 2} size={52} />
          <div style={{ position: "absolute", left: 40, right: 40, top: TWO.head, height: 2, background: theme.color.hairlineBrandSolid }} />
          {CHECKS.map((k, i) => (
            <div key={k}>
              <div style={{ position: "absolute", left: 44, top: TWO.rowY + i * TWO.row + 18, ...typeStyle("label"), fontSize: 32, fontWeight: 500, color: c.ink }}>{k}</div>
              <Mark kind="check" p={ease(f, twoAt + m.sec(0.25) * (i + 1), m.reveal)} x={TWO.w - 64} y={TWO.rowY + i * TWO.row + 38} size={40} />
            </div>
          ))}
        </Card>
      </Appear>
      <Appear at={W("memahami perusahaannya")} out={nextAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={twoX(0)} y={TWO.line} w={TWO.w} text="Pahami bisnisnya dulu." size={TWO.lineSize} weight={500} align="center" />
      </Appear>
      <Appear at={W("satu pertanyaan")} out={nextAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Card x={twoX(1)} y={TWO.y} w={TWO.w} h={TWO.h}>
          <div style={{ position: "absolute", left: 40, top: 0, height: TWO.head, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: TWO.disc, height: TWO.disc, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="tag" size={TWO.disc * 0.56} tone={c.indigo} />
            </div>
            <div style={{ ...typeStyle("title"), fontSize: TWO.size, fontWeight: 500, color: c.ink }}>Value</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 40, top: TWO.head, height: 2, background: theme.color.hairlineBrandSolid }} />
          <div style={{ position: "absolute", left: 0, top: TWO.head + GAUGE.askY - 30, width: TWO.w, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("hero"), fontSize: GAUGE.askSize, fontWeight: 500, lineHeight: 1, color: c.indigo }}>?</div>
          <div style={{ position: "absolute", left: GAUGE.x, top: GAUGE.y, width: TWO.w - 2 * GAUGE.x, height: GAUGE.h, borderRadius: GAUGE.h / 2, background: `linear-gradient(to right, ${theme.color.checkGreen}, ${theme.color.worldLight}, ${theme.color.calendarRed})` }} />
          <div style={{ position: "absolute", left: GAUGE.x + (TWO.w - 2 * GAUGE.x) * (0.5 + 0.42 * expensive) - 13, top: GAUGE.y - 6, width: 26, height: 26, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.indigo}` }} />
          <div style={{ position: "absolute", left: GAUGE.x, top: GAUGE.y + 36, ...typeStyle("label"), fontSize: 26, color: c.slate }}>Murah</div>
          <div style={{ position: "absolute", right: GAUGE.x, top: GAUGE.y + 36, ...typeStyle("label"), fontSize: 26, color: c.slate }}>Mahal</div>
        </Card>
      </Appear>
      <Appear at={W("membayar")} out={nextAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={twoX(1)} y={TWO.line} w={TWO.w} text="Baru bicara harganya." size={TWO.lineSize} weight={500} align="center" mark="harganya" />
      </Appear>

      {/* F — the next video */}
      <Appear at={nextAt + m.fade} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Player x={CX - NEXT.w / 2} y={NEXT.y} w={NEXT.w} h={NEXT.h} thumb={NEXT.thumb} progress={0}>
          <Disc icon="play" size={96} tone={theme.color.neutralIcon} tint={c.cardBg} />
        </Player>
        <WordPill x={CX} y={NEXT.label} text="Next Video" />
      </Appear>
      <Appear at={W("berapa harga")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={NEXT.line} w={theme.canvas.width} text="Berapa Harga yang Layak Dibayar?" size={NEXT.size} weight={500} align="center" mark="Layak Dibayar" />
      </Appear>
    </Stage>
  );
};
