/**
 * VI02 · SC06 — "Sepuluh Menit atau Sepuluh Tahun?" in VI01's look (Simon 13 Nov: "revamp visual untuk scene 5-8"), from the
 * ChatGPT storyboard docs/vi-style/storyboards/VI02-SC06-v3.png. The old scene is scenes/VoteOrWeigh.tsx (VI01_LOOK = false).
 *
 *  A  "Benjamin Graham menggambarkan market": his photo tile (as in SC02) and two empty cards, Jangka pendek / Jangka panjang.
 *  B  "Dalam jangka pendek … voting machine": a line-art ballot box, thumbs dropping into its slot, a price that never settles.
 *  C  "Tapi dalam jangka panjang … weighing machine": a line-art balance scale (ChatGPT 13 Nov, public/art/vi02/scale-line,
 *     assembled here so its beam can tip); a block of Laba lands on its pan on each phrase and the beam tips its way.
 *  D  "Warren Buffett kemudian mengatakan" (a cut): his photo tile and his own sentence (Berkshire Hathaway's 1996 letter) in
 *     the dashed text box, "ten years" and "ten minutes" lit on their Indonesian words.
 *  E  "Karena itu … “Besok harganya naik nggak?”" (a cut): the question in a big bubble, crossed, gone grey; it holds
 *     through "Coba pikirkan:".
 *  F  "sepuluh tahun lagi" (a cut): 10 menit → 10 tahun; SC01's factory at the far end; on "Produknya" it
 *     comes to the middle and the five questions come round it, one per sentence.
 *  G  "Kita nggak harus…" (a cut): Orang Tuntun and the lines as speech bubbles; on "Kalau kita bahkan" the last pair.
 * The candles are a shape (no figures, no source tag text).
 */
import { interpolateColors, random, staticFile, useCurrentFrame } from "remotion";
import { Candles, SoftGround, SourceTag, Stage, gridOf, theme, typeStyle, useMotion, usePalette, useShadow, type Bar } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, DashBox, Drawing, Glyph, GrowArrow, IconDisc, ORANG_TUNTUN_RIGHT, OrangTuntun, PhotoTile, Pic, Shot, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const R = theme.shape.cardRadius;

// A — Graham and the two cards
const TILE = { d: 300 };
const TILE_H = (TILE.d * 423) / 406;
const GRAHAM = { x: 130, y: 250 };
const NAME_GAP = 26;
const PANEL = { y: 200, h: 640, w: 600, xs: [520, 1160], pill: 50, label: 588 };

// B — the ballot box, the thumbs, the price
const BALLOT = { src: "art/vi02/scale-line/ballot.png", w0: 446, h0: 358, w: 300, y: 330, slot: 51 };
const BALLOT_H = (BALLOT.w * BALLOT.h0) / BALLOT.w0;
const THUMBS = 10;
const TAPE = { x: 50, y: 96, w: 500, h: 150, shown: 30, step: 5, length: 320 };
const TAPE_BARS = Array.from({ length: TAPE.length }).reduce<Bar[]>((bars, _, i) => {
  const o = bars.length ? bars[bars.length - 1].c : 0.5;
  const c = Math.min(0.92, Math.max(0.08, 0.5 + 0.24 * Math.sin(i * 0.71) + 0.14 * Math.sin(i * 1.93) + (random(`vote-close-${i}`) - 0.5) * 0.34));
  return [...bars, { o, c, h: Math.max(o, c) + random(`vote-high-${i}`) * 0.06, l: Math.min(o, c) - random(`vote-low-${i}`) * 0.06 }];
}, []);

// C — the scale, from its parts: the stand's knob is the pivot, the pans hang by their rings from the beam's end rings
const PART = {
  stand: { src: "art/vi02/scale-line/stand.png", w: 333, h: 533, knob: { x: 166, y: 48 } },
  beam: { src: "art/vi02/scale-line/beam.png", w: 617, h: 116, mid: { x: 308.5, y: 58 }, ring: 265.5 },
  pan: { src: "art/vi02/scale-line/pan.png", w: 317, h: 413, ring: { x: 158, y: 39 }, rim: 287 },
} as const;
const SCALE = { cx: 300, pivot: 250, standH: 330, half: 190, panW: 150, tilt: 5, block: { w: 116, h: 38, gap: 5 } };
const K_STAND = SCALE.standH / PART.stand.h;
const K_BEAM = SCALE.half / PART.beam.ring;
const K_PAN = SCALE.panW / PART.pan.w;
const BLOCKS = ["Bisnis yang terus", "menghasilkan laba", "akhirnya punya"] as const;

// D — Buffett's sentence
const BUFFETT = { x: 150, y: 250 };
const QUOTE = { cx: 1180, y: 230, w: 1060, h: 400, size: 48, source: 712 };

// E — the short question
const ASK = { w: 1100, h: 300, y: 330, size: 80, cross: 300 };

// F — ten minutes, ten years, the business, five questions
const TIME = { y: 300, x0: 420, x1: 1500, d: 150, label: 34 };
const FACTORY = { far: { cx: 1500, floor: 820, h: 300 }, mid: { cx: CX, floor: 760, h: 320 } };
const QUESTIONS = [
  { icon: "package", text: "Produk?", at: "Produknya masih", x: 470, y: 380 },
  { icon: "users-three", text: "Pelanggan?", at: "Pelanggannya masih", x: CX, y: 250 },
  { icon: "chart-line-up", text: "Pasar?", at: "Pasarnya semakin", x: 1450, y: 380 },
  { icon: "trophy", text: "Kompetitor?", at: "Kompetitornya semakin", x: 520, y: 680 },
  { icon: "tag", text: "Pricing power?", at: "Perusahaan masih", x: 1400, y: 680 },
] as const;
const Q = { w: 370, h: 104, disc: 64 };

// G — what Orang Tuntun says
const SAY = { x: ORANG_TUNTUN_RIGHT + 70, w: 1760 - ORANG_TUNTUN_RIGHT - 70, ys: [300, 480], hs: [120, 210] };

/** A line with one part lit in indigo. */
const Marked = ({ text, mark }: { text: string; mark?: string }) => {
  const c = usePalette();
  const i = mark ? text.indexOf(mark) : -1;
  return i < 0 ? <>{text}</> : <>{text.slice(0, i)}<span style={{ color: c.indigo }}>{mark}</span>{text.slice(i + (mark as string).length)}</>;
};

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(6, BLOCK.SC06);
  const g = f + BLOCK.SC06;

  const voteAt = W("Dalam jangka");
  const weighAt = W("Tapi dalam");
  const buffettAt = W("Warren Buffett");
  const askAt = W("Karena itu");
  /** the crossed question holds through "Coba pikirkan:"; the line from 10 minutes to 10 years starts on "sepuluh tahun lagi" */
  const timeAt = W("sepuluh tahun lagi");
  const qAt = W("Produknya masih");
  const sayAt = W("Kita nggak harus");
  const lastAt = W("Kalau kita bahkan");

  // B
  const first = Math.floor(Math.max(0, f) / TAPE.step) % (TAPE.length - TAPE.shown);
  const bars = TAPE_BARS.slice(first, first + TAPE.shown);
  const tapeGrid = gridOf(bars.map((b) => b.c), [0, 1], { x: TAPE.x, y: TAPE.y, w: TAPE.w, h: TAPE.h }, 0);
  const ballotX = PANEL.w / 2 - BALLOT.w / 2;
  const slotY = BALLOT.y + (BALLOT.slot * BALLOT.w) / BALLOT.w0;

  // C
  const blockAt = BLOCKS.map((b) => W(b));
  const tilt = blockAt.reduce((a, at) => a + SCALE.tilt * ease(f, at + m.sec(0.3), m.move), 0);
  const rad = (tilt * Math.PI) / 180;
  const ends = [-1, 1].map((s) => ({ x: SCALE.cx + s * SCALE.half * Math.cos(rad), y: SCALE.pivot + s * SCALE.half * Math.sin(rad) }));

  // D
  const years = ease(f, W("sepuluh tahun"), m.reveal);
  const minutes = ease(f, W("sepuluh menit"), m.reveal);

  // F
  const reach = ease(f, timeAt + m.sec(0.15), m.sec(0.9));
  const toMid = ease(f, qAt - m.sec(0.5), m.move);
  const fac = { cx: mix(FACTORY.far.cx, FACTORY.mid.cx, toMid), floor: mix(FACTORY.far.floor, FACTORY.mid.floor, toMid), h: mix(FACTORY.far.h, FACTORY.mid.h, toMid) };
  const qShown = QUESTIONS.map((q) => ease(f, W(q.at), m.reveal));
  const lit = QUESTIONS.map((q, i) => ease(f, W(q.at), m.pop) * (i < QUESTIONS.length - 1 ? 1 - ease(f, W(QUESTIONS[i + 1].at), m.pop) : 1 - ease(f, sayAt - m.sec(0.3), m.fade)));

  const hilite = (p: number) => ({ color: interpolateColors(p, [0, 1], [c.ink, c.indigo]), background: p > 0.001 ? theme.color.indigoWashSolid : undefined, borderRadius: 8 });

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A–C: Graham's two machines */}
      <Shot from={-1} to={buffettAt} block={BLOCK.SC06} cutIn={false}>
        <Appear at={-m.reveal} rise={0} style={{ left: GRAHAM.x, top: GRAHAM.y, width: TILE.d }}>
          <PhotoTile name="graham" d={TILE.d} style={{ left: 0, top: 0 }} />
          <div style={{ position: "absolute", left: -40, width: TILE.d + 80, top: TILE_H + NAME_GAP, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>Benjamin Graham</div>
        </Appear>
        {(["Jangka pendek", "Jangka panjang"] as const).map((name, i) => (
          <Appear key={name} at={W("menggambarkan") + i * m.sec(0.15)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <Card x={PANEL.xs[i]} y={PANEL.y} w={PANEL.w} h={PANEL.h} style={{ overflow: "hidden" }}>
              <WordPill x={PANEL.w / 2} y={PANEL.pill} text={name} size={30} />
              {i === 0 ? (
                <Appear at={voteAt} rise={0} style={{ left: 0, top: 0, width: PANEL.w, height: PANEL.h }}>
                  <Candles bars={bars} grid={tapeGrid} />
                  <SourceTag kind="synthetic" />
                  {Array.from({ length: THUMBS }, (_, k) => {
                    if (f < voteAt) return null;
                    const t = (((f - voteAt) / m.sec(1.3) + k / THUMBS) % 1 + 1) % 1;
                    const up = k % 2 === 0;
                    const x = PANEL.w / 2 + Math.sin(k * 2.3) * 130 * (1 - t);
                    return <IconDisc key={k} x={x} y={mix(TAPE.y + TAPE.h + 36, slotY - 6, t)} d={66} icon={up ? "thumbs-up" : "thumbs-down"} opacity={Math.min(1, t * 5, (1 - t) * 5)} />;
                  })}
                  <Pic src={staticFile(BALLOT.src)} style={{ position: "absolute", left: ballotX, top: BALLOT.y, width: BALLOT.w, height: BALLOT_H }} />
                </Appear>
              ) : (
                <Appear at={weighAt} rise={0} style={{ left: 0, top: 0, width: PANEL.w, height: PANEL.h }}>
                  <Pic src={staticFile(PART.stand.src)} style={{ position: "absolute", left: SCALE.cx - PART.stand.knob.x * K_STAND, top: SCALE.pivot - PART.stand.knob.y * K_STAND, width: PART.stand.w * K_STAND, height: SCALE.standH }} />
                  <Pic src={staticFile(PART.beam.src)} style={{ position: "absolute", left: SCALE.cx - PART.beam.mid.x * K_BEAM, top: SCALE.pivot - PART.beam.mid.y * K_BEAM, width: PART.beam.w * K_BEAM, height: PART.beam.h * K_BEAM, transformOrigin: `${PART.beam.mid.x * K_BEAM}px ${PART.beam.mid.y * K_BEAM}px`, transform: `rotate(${tilt.toFixed(3)}deg)` }} />
                  {ends.map((e, s) => (
                    <Pic key={s} src={staticFile(PART.pan.src)} style={{ position: "absolute", left: e.x - PART.pan.ring.x * K_PAN, top: e.y - PART.pan.ring.y * K_PAN, width: SCALE.panW, height: PART.pan.h * K_PAN }} />
                  ))}
                  {BLOCKS.map((b, k) => {
                    const p = ease(f, blockAt[k], m.move);
                    if (p <= 0.001) return null;
                    const rim = ends[1].y + (PART.pan.rim - PART.pan.ring.y) * K_PAN;
                    const rest = rim - (k + 1) * (SCALE.block.h + SCALE.block.gap) + 4;
                    return (
                      <div key={b} style={{ position: "absolute", left: ends[1].x - SCALE.block.w / 2, top: mix(rest - 90, rest, p), width: SCALE.block.w, height: SCALE.block.h, borderRadius: 10, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${c.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("label"), fontSize: 24, fontWeight: 600, color: c.ink, opacity: Math.min(1, p * 3) }}>Laba</div>
                    );
                  })}
                </Appear>
              )}
              <Appear at={W(i === 0 ? "voting machine" : "weighing machine")} style={{ left: 0, top: PANEL.label, width: PANEL.w, textAlign: "center" }}>
                <div style={{ transform: "translateY(-50%)", ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: c.ink }}>{i === 0 ? "Voting machine" : "Weighing machine"}</div>
              </Appear>
            </Card>
          </Appear>
        ))}
      </Shot>

      {/* D: Buffett's sentence */}
      <Shot from={buffettAt} to={askAt} block={BLOCK.SC06}>
        <Appear at={buffettAt} rise={0} style={{ left: BUFFETT.x, top: BUFFETT.y, width: TILE.d }}>
          <PhotoTile name="buffett" d={TILE.d} style={{ left: 0, top: 0 }} />
          <div style={{ position: "absolute", left: -40, width: TILE.d + 80, top: TILE_H + NAME_GAP, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>Warren Buffett</div>
        </Appear>
        <DashBox cx={QUOTE.cx} y={QUOTE.y} w={QUOTE.w} h={QUOTE.h} at={W("kemudian mengatakan")}>
          <div style={{ position: "absolute", inset: 0, padding: "0 64px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", ...typeStyle("title"), fontSize: QUOTE.size, fontWeight: 500, fontStyle: "italic", lineHeight: 1.32, color: c.ink }}>
            <span>
              “If you aren’t willing to own a stock for <span style={hilite(years)}>ten{"\u00a0"}years</span>, don’t even think about owning it for{" "}
              <span style={hilite(minutes)}>ten{"\u00a0"}minutes</span>.”
            </span>
          </div>
        </DashBox>
        <Appear at={W("kemudian mengatakan") + m.sec(0.6)} style={{ left: 0, top: QUOTE.source, width: theme.canvas.width }}>
          <div style={{ position: "absolute", left: QUOTE.cx, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 16, padding: "10px 30px 10px 12px", borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, whiteSpace: "nowrap" }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="receipt" size={30} tone={theme.color.neutralIcon} />
            </div>
            <div style={{ ...typeStyle("label"), fontSize: 30, fontWeight: 500, color: c.ink }}>Berkshire Hathaway · 1996</div>
          </div>
        </Appear>
      </Shot>

      {/* E: the question to drop */}
      <Shot from={askAt} to={timeAt} block={BLOCK.SC06}>
        {(() => {
          const p = ease(f, askAt + m.sec(0.2), m.reveal);
          const cross = ease(f, W("naik nggak"), m.sec(0.3));
          const grey = ease(f, W("naik nggak") + m.sec(0.2), m.fade);
          return (
            <div style={{ position: "absolute", left: CX - ASK.w / 2, top: ASK.y + (1 - p) * 16, width: ASK.w, height: ASK.h, opacity: p }}>
              <Card x={0} y={0} w={ASK.w} h={ASK.h} style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: `${R * 2}px ${R * 2}px ${R * 2}px 10px`, background: interpolateColors(grey, [0, 1], [c.cardBg, theme.color.neutralDisc]) }}>
                <div style={{ ...typeStyle("title"), fontSize: ASK.size, fontWeight: 600, color: interpolateColors(grey, [0, 1], [c.ink, theme.color.mute]), whiteSpace: "nowrap" }}>Besok harganya naik nggak?</div>
              </Card>
              <svg width={ASK.w} height={ASK.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <g stroke={theme.color.crossRed} strokeWidth={14} strokeLinecap="round" fill="none">
                  <line x1={ASK.w / 2 - ASK.cross / 2} y1={-20} x2={ASK.w / 2 - ASK.cross / 2 + ASK.cross * cross} y2={-20 + (ASK.h + 40) * cross} />
                  <line x1={ASK.w / 2 + ASK.cross / 2} y1={-20} x2={ASK.w / 2 + ASK.cross / 2 - ASK.cross * cross} y2={-20 + (ASK.h + 40) * cross} />
                </g>
              </svg>
            </div>
          );
        })()}
      </Shot>

      {/* F: ten minutes, ten years — and what ten years asks of the business */}
      <Shot from={timeAt} to={sayAt} block={BLOCK.SC06}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - toMid }}>
          <IconDisc x={TIME.x0} y={TIME.y} d={TIME.d} icon="clock" label="10 menit" labelSize={TIME.label} opacity={ease(f, timeAt, m.reveal)} />
          <GrowArrow x0={TIME.x0 + TIME.d / 2 + 16} y0={TIME.y} x1={TIME.x1 - TIME.d / 2 - 16} y1={TIME.y} p={reach} />
          <IconDisc x={TIME.x1} y={TIME.y} d={TIME.d} icon="calendar-blank" label="10 tahun" labelSize={TIME.label} opacity={ease(f, timeAt + m.sec(0.8), m.reveal)} />
        </div>
        <Appear at={W("bisnis ini akan")} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Drawing name="factory" cx={fac.cx} floor={fac.floor} h={fac.h} />
        </Appear>
        {QUESTIONS.map((q, i) => {
          const p = qShown[i];
          return p > 0.001 ? (
            <div key={q.text} style={{ position: "absolute", left: q.x - Q.w / 2, top: q.y - Q.h / 2 + (1 - p) * 12, width: Q.w, height: Q.h, opacity: p }}>
              <Card x={0} y={0} w={Q.w} h={Q.h} style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 22px", boxShadow: `${shadow.soft}, inset 0 0 0 ${lit[i] > 0.5 ? 3 : 0}px ${c.indigo}` }}>
                <div style={{ width: Q.disc, height: Q.disc, borderRadius: 999, background: lit[i] > 0.5 ? theme.color.indigoWashSolid : theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <Glyph icon={q.icon} size={36} tone={lit[i] > 0.5 ? c.indigo : theme.color.neutralIcon} />
                </div>
                <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{q.text}</div>
              </Card>
            </div>
          ) : null;
        })}
      </Shot>

      {/* G: Orang Tuntun says it */}
      <Shot from={sayAt} to={1e6} block={BLOCK.SC06} cutOut={false}>
        <OrangTuntun at={sayAt} />
        {[
          { lines: [{ text: "Bukan harus pegang 10 tahun.", mark: "Bukan harus", at: sayAt + m.sec(0.3) }, { text: "Tapi pikirkan bisnisnya 10 tahun sebelum membeli.", mark: "pikirkan bisnisnya", at: W("Intinya") }], out: lastAt - m.sec(0.2) },
          { lines: [{ text: "Belum terbayang cara perusahaan menghasilkan uang?", mark: "menghasilkan uang", at: lastAt }, { text: "Mungkin kita belum cukup paham apa yang dibeli.", mark: "belum cukup paham", at: W("mungkin kita") }], out: undefined },
        ].map((pair, k) => {
          const gone = pair.out === undefined ? 0 : ease(f, pair.out, m.sec(0.2));
          return (
            <div key={k} style={{ position: "absolute", inset: 0, opacity: 1 - gone }}>
              {pair.lines.map((l, j) => {
                const p = ease(f, l.at, m.reveal);
                return p > 0.001 ? (
                  <div key={l.text} style={{ position: "absolute", left: SAY.x, top: SAY.ys[j] + (1 - p) * 12, width: SAY.w, height: SAY.hs[j], opacity: p }}>
                    <Card x={0} y={0} w={SAY.w} h={SAY.hs[j]} style={{ display: "flex", alignItems: "center", padding: "0 48px", borderRadius: `${R}px ${R}px ${R}px 6px`, background: j === 0 ? theme.color.neutralDisc : c.cardBg, boxShadow: j === 0 ? shadow.soft : `${shadow.soft}, inset 0 0 0 3px ${c.indigo}` }}>
                      <div style={{ ...typeStyle("title"), fontSize: j === 0 ? 40 : 58, fontWeight: 500, lineHeight: 1.2, color: j === 0 ? c.slate : c.ink }}>
                        <Marked text={l.text} mark={l.mark} />
                      </div>
                    </Card>
                  </div>
                ) : null;
              })}
            </div>
          );
        })}
      </Shot>
    </Stage>
  );
};
