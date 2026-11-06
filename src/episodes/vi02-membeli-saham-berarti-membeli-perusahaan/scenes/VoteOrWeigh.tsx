/**
 * VI02 · SC06 — "Sepuluh Menit atau Sepuluh Tahun?", rebuilt on 5 Nov (Simon: "ganti visualnya semua") from the ChatGPT
 * storyboard docs/vi-style/storyboards/VI02-SC06-v2.jpg. Graham, the voting machine and the scale's parts are ChatGPT's flat art
 * (public/art/vi02); the scale is assembled here so its beam can tilt. The candles are a shape, no figures; its blocks are
 * "Profit Year 1, 2, 3…" with no amounts.
 *
 *  A  "Benjamin Graham": his portrait on a tall card, his name large beside it.
 *  B  "jangka pendek … voting machine": SHORT TERM across the whole width: candles that never settle, a machine, thumbs flying.
 *  C  "jangka panjang … weighing machine": the card makes room for LONG TERM and a scale; a year's profit lands on its pan,
 *     year after year.
 *  D  "Besok harganya naik nggak?": the short question, huge, crossed; it shrinks into the clock that starts the timeline.
 *  E  "sepuluh tahun lagi": 10 MINUTES → 10 YEARS across the screen, then the camera moves to its end: the business in the
 *     middle and the four questions growing out of it, one per sentence.
 *  F  "Kita nggak harus…": the map steps back for Simon's first line; on "Intinya" the picture changes to Orang Tuntun and his
 *     two lines, and on "Kalau kita bahkan" they give way to the last thought.
 */
import { Img, interpolateColors, random, staticFile, useCurrentFrame } from "remotion";
import { Candles, Connector, SoftGround, SourceTag, Stage, gridOf, theme, typeStyle, useMotion, usePalette, useShadow, type Bar } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, IconDisc, Line, MONO, ORANG_TUNTUN_RIGHT, OrangTuntun, WordPill, ease, useWords } from "../components/kit";
import { CompanyArt } from "../components/World";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — the man
const GRAHAM = { x: 240, y: 160, w: 610, h: 680, nameX: 950, nameY: [430, 560], size: 116 };

// B, C — the two cards
const PANEL = { y: 160, h: 680, gap: 36, x: theme.margin.left, w: theme.canvas.width - theme.margin.left - theme.margin.right, pill: 58, line: 626 };
const HALF = (PANEL.w - PANEL.gap) / 2;

// B — the voting machine, and a price that only answers the crowd
const TAPE = { y: 106, h: 210, pad: 64, shown: 34, step: 5, length: 320 };
const TAPE_BARS = Array.from({ length: TAPE.length }).reduce<Bar[]>((bars, _, i) => {
  const o = bars.length ? bars[bars.length - 1].c : 0.5;
  const c = Math.min(0.92, Math.max(0.08, 0.5 + 0.24 * Math.sin(i * 0.71) + 0.14 * Math.sin(i * 1.93) + (random(`vote-close-${i}`) - 0.5) * 0.34));
  return [...bars, { o, c, h: Math.max(o, c) + random(`vote-high-${i}`) * 0.06, l: Math.min(o, c) - random(`vote-low-${i}`) * 0.06 }];
}, []);
const VOTE = { y: 338, w: 450, aspect: 1590 / 888, gap: 150 };
const THUMBS = 12;

// C — the scale
const ART = { stand: { w: 477, h: 815, pivot: 90 }, beam: { w: 945, h: 112, ring: 56 }, pan: { w: 497, h: 541, ring: 40, rim: 366 } };
const SCALE = { top: 150, beam: 250, standH: 440, panW: 280, tilt: 6, block: 46, blockW: 216 };
const BEAM_K = (2 * SCALE.beam) / (ART.beam.w - 2 * ART.beam.ring);
const STAND_K = SCALE.standH / ART.stand.h;
const PAN_K = SCALE.panW / ART.pan.w;
const YEARS = ["Profit Year 1", "Profit Year 2", "Profit Year 3"];

// D — the short question
const ASK = { w: 1240, h: 300, y: 320, size: 76, badge: 92 };
const askRadius = `${theme.shape.cardRadius * 2}px ${theme.shape.cardRadius * 2}px ${theme.shape.cardRadius * 2}px 10px`;

// E — ten minutes, ten years, and what ten years asks
const TIME = { x0: 300, x1: 1620, y: 470, d: 200, line: 8, label: 38 };
const MAP = { y: 500, w: 420, h: 280, s: 0.46, dx: 620, dy: 232, d: 130, label: 34, lead: 40 };
const QUESTIONS = [
  { text: "Product?", icon: "package", at: "Produknya masih", side: -1, row: -1 },
  { text: "Customers?", icon: "users-three", at: "Pasarnya semakin", side: 1, row: -1 },
  { text: "Competition?", icon: "trophy", at: "Kompetitornya semakin", side: -1, row: 1 },
  { text: "Profit?", icon: "chart-line-up", at: "Perusahaan masih", side: 1, row: 1 },
];

// F — the two lines
const CLOSE = { scale: 0.62, rise: 130, y: [700, 782], size: 52 };
// beside Orang Tuntun: a line, and under it the one that matters
const SAID = { x: ORANG_TUNTUN_RIGHT + 90, y: 500, small: 40, big: 64, gap: 18 };

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(6, BLOCK.SC06);
  const g = f + BLOCK.SC06;

  const voteAt = W("Dalam jangka");
  const weighAt = W("Tapi dalam");
  const askAt = W("Besok harganya") - m.sec(0.4); // the two machines hold through "Karena itu, sebelum membeli saham"
  const timeAt = W("Coba pikirkan");
  const linesAt = W("Kita nggak harus");
  const lastAt = W("Kalau kita bahkan");
  const manAt = W("Intinya");

  // B, C
  const room = ease(f, weighAt - m.sec(0.25), m.move);
  const leftW = mix(PANEL.w, HALF, room);
  const crowd = ease(f, W("voting machine"), m.reveal);
  const first = Math.floor(Math.max(0, f) / TAPE.step) % (TAPE.length - TAPE.shown);
  const bars = TAPE_BARS.slice(first, first + TAPE.shown);
  const tapeGrid = gridOf(bars.map((b) => b.c), [0, 1], { x: TAPE.pad, y: TAPE.y, w: leftW - 2 * TAPE.pad, h: TAPE.h }, 0);
  const yearAt = [W("Bisnis yang terus"), W("menghasilkan laba"), W("akhirnya punya")];
  const tilt = yearAt.reduce((a, at) => a + SCALE.tilt * ease(f, at + m.sec(0.25), m.move), 0);
  const drop = SCALE.beam * Math.sin((tilt * Math.PI) / 180);
  const reachX = SCALE.beam * Math.cos((tilt * Math.PI) / 180);

  // D
  const leave = ease(f, timeAt - m.sec(0.1), m.move);
  const askX = mix(CX, TIME.x0, leave);
  const askY = mix(ASK.y + ASK.h / 2, TIME.y, leave);

  // E
  const reach = ease(f, W("sepuluh tahun lagi"), m.sec(0.9));
  const mapAt = W("Produknya masih") - m.sec(0.5);
  const toMap = ease(f, mapAt, m.move);
  const shift = (CX - TIME.x1) * toMap;
  const endX = TIME.x1 + shift;

  // F
  const back = ease(f, linesAt - m.sec(0.2), m.move);
  const mapStyle = { position: "absolute", inset: 0, transformOrigin: `${CX}px ${MAP.y}px`, transform: `translateY(${(-CLOSE.rise * back).toFixed(1)}px) scale(${mix(1, CLOSE.scale, back).toFixed(4)})` } as const;

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the man */}
      <Appear at={-m.reveal} out={voteAt} rise={0} style={{ left: 0, top: 0 }}>
        <Card x={GRAHAM.x} y={GRAHAM.y} w={GRAHAM.w} h={GRAHAM.h} style={{ overflow: "hidden" }}>
          <Img src={staticFile("art/vi02/benjamin-graham.png")} style={{ filter: MONO, position: "absolute", left: 0, top: 0, width: GRAHAM.w, height: GRAHAM.h, objectFit: "cover", objectPosition: "50% 0%" }} />
        </Card>
      </Appear>
      <Appear at={W("Benjamin")} out={voteAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={GRAHAM.nameX} y={GRAHAM.nameY[0]} w={800} size={GRAHAM.size} weight={500} text="Benjamin" />
      </Appear>
      <Appear at={W("Benjamin") + m.sec(0.15)} out={voteAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={GRAHAM.nameX} y={GRAHAM.nameY[1]} w={800} size={GRAHAM.size} weight={500} text="Graham" mark="Graham" />
      </Appear>

      {/* B — it votes */}
      <Appear at={voteAt} out={askAt - m.sec(0.15)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Card x={PANEL.x} y={PANEL.y} w={leftW} h={PANEL.h}>
          <WordPill x={leftW / 2} y={PANEL.pill} text="SHORT TERM" />
          <Candles bars={bars} grid={tapeGrid} />
          <SourceTag kind="synthetic" />
          {/* the machine */}
          <Img src={staticFile("art/vi02/voting-machine.png")} style={{ filter: MONO, position: "absolute", left: leftW / 2 - VOTE.w / 2, top: VOTE.y, width: VOTE.w, height: VOTE.w / VOTE.aspect }} />
          {/* thumbs flying up out of it */}
          {crowd > 0.01
            ? Array.from({ length: THUMBS }, (_, i) => {
                const t = ((f / 46 + i / THUMBS) % 1 + 1) % 1;
                const up = i % 2 === 0;
                return <IconDisc key={i} x={leftW / 2 + (up ? -1 : 1) * (VOTE.gap / 2) + 80 * Math.sin(i * 2.3)} y={VOTE.y + 10 - 190 * t} d={60} icon={up ? "thumbs-up" : "thumbs-down"} opacity={crowd * Math.sin(Math.PI * t)} />;
              })
            : null}
          <Appear at={W("voting machine")} style={{ left: 0, top: 0, width: leftW }}>
            <Line x={0} y={PANEL.line} w={leftW} align="center" size={40} weight={500} text="Short term = Voting Machine" mark="Voting Machine" />
          </Appear>
        </Card>
      </Appear>

      {/* C — it weighs */}
      <Appear at={weighAt} out={askAt - m.sec(0.15)} style={{ left: 0, top: 0 }}>
        <Card x={PANEL.x + HALF + PANEL.gap} y={PANEL.y} w={HALF} h={PANEL.h}>
          <WordPill x={HALF / 2} y={PANEL.pill} text="LONG TERM" />
          {/* the pans hang level from the beam's ends */}
          {[-1, 1].map((side) => (
            <Img key={side} src={staticFile("art/vi02/scale-pan.png")} style={{ filter: MONO, position: "absolute", left: HALF / 2 + side * reachX - SCALE.panW / 2, top: SCALE.top - side * drop - ART.pan.ring * PAN_K, width: SCALE.panW, height: ART.pan.h * PAN_K }} />
          ))}
          <Img src={staticFile("art/vi02/scale-beam.png")} style={{ filter: MONO, position: "absolute", left: HALF / 2 - (ART.beam.w * BEAM_K) / 2, top: SCALE.top - (ART.beam.h * BEAM_K) / 2, width: ART.beam.w * BEAM_K, height: ART.beam.h * BEAM_K, transform: `rotate(${(-tilt).toFixed(3)}deg)` }} />
          <Img src={staticFile("art/vi02/scale-stand.png")} style={{ filter: MONO, position: "absolute", left: HALF / 2 - (ART.stand.w * STAND_K) / 2, top: SCALE.top - ART.stand.pivot * STAND_K, width: ART.stand.w * STAND_K, height: SCALE.standH }} />
          {YEARS.map((y, i) => {
            const p = ease(f, yearAt[i], m.move);
            const rest = SCALE.top + drop + (ART.pan.rim - ART.pan.ring) * PAN_K - (i + 1) * (SCALE.block + 6);
            return (
              <div key={y} style={{ position: "absolute", left: HALF / 2 - reachX - SCALE.blockW / 2, top: mix(rest - 80, rest, p), width: SCALE.blockW, height: SCALE.block, borderRadius: 14, background: theme.color.worldLight, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: c.ink, whiteSpace: "nowrap", opacity: Math.min(1, p * 3) }}>{y}</div>
            );
          })}
          <Appear at={W("weighing machine")} style={{ left: 0, top: 0, width: HALF }}>
            <Line x={0} y={PANEL.line} w={HALF} align="center" size={40} weight={500} text="Long term = Weighing Machine" mark="Weighing Machine" />
          </Appear>
        </Card>
      </Appear>

      {/* D — the short question, shrinking into the clock */}
      {leave < 0.999 ? (
        <Appear at={askAt} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: askX - ASK.w / 2, top: askY - ASK.h / 2, width: ASK.w, height: ASK.h, borderRadius: askRadius, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: ASK.size, fontWeight: 500, color: c.ink, whiteSpace: "nowrap", opacity: 1 - leave, transform: `scale(${mix(1, 0.16, leave).toFixed(4)})` }}>
            “Besok harganya naik nggak?”
            <div style={{ position: "absolute", right: -ASK.badge / 3, top: -ASK.badge / 3, width: ASK.badge, height: ASK.badge, borderRadius: 999, background: theme.color.calendarRed, display: "flex", alignItems: "center", justifyContent: "center", opacity: ease(f, W("Besok harganya") + m.sec(0.9), m.reveal) }}>
              <svg width={48} height={48} viewBox="0 0 40 40">
                <path d="M 10 10 L 30 30 M 30 10 L 10 30" fill="none" stroke={theme.color.worldWall} strokeWidth={6} strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </Appear>
      ) : null}

      {/* E — ten years out */}
      <Appear at={timeAt} out={manAt - m.sec(0.15)} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={mapStyle}>
          {toMap < 0.999 ? (
            <>
              <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
                <line x1={TIME.x0 + shift} y1={TIME.y} x2={mix(TIME.x0, TIME.x1, reach) + shift} y2={TIME.y} stroke={theme.color.connector} strokeWidth={TIME.line} strokeLinecap="round" />
              </svg>
              <IconDisc x={TIME.x0 + shift} y={TIME.y} d={TIME.d} icon="clock" label="10 MINUTES" labelSize={TIME.label} opacity={ease(f, timeAt + m.sec(0.1), m.reveal)} />
              <IconDisc x={endX} y={TIME.y} d={TIME.d} icon="calendar-blank" label="10 YEARS" labelSize={TIME.label} opacity={ease(f, W("sepuluh tahun lagi") + m.sec(0.7), m.reveal) * (1 - toMap)} />
            </>
          ) : null}
          {/* the business, at the end of the line */}
          {toMap > 0.001 ? (
            <div style={{ position: "absolute", left: endX - MAP.w / 2, top: MAP.y - MAP.h / 2, width: MAP.w, height: MAP.h, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft, opacity: toMap, transform: `scale(${mix(0.5, 1, toMap).toFixed(4)})` }}>
              <CompanyArt w={MAP.w} h={MAP.h} s={MAP.s} f={f} />
            </div>
          ) : null}
          {QUESTIONS.map((q) => {
            const at = W(q.at);
            const x = CX + q.side * MAP.dx;
            const y = MAP.y + q.row * MAP.dy;
            return (
              <div key={q.text}>
                <Connector a={{ x: CX + q.side * (MAP.w / 2 + 8), y: MAP.y + q.row * MAP.lead }} b={{ x: x - q.side * (MAP.d / 2 + 12), y }} p={ease(f, at, m.sec(0.5))} shape="elbow" width={3} dot={false} />
                <IconDisc x={x} y={y} d={MAP.d} icon={q.icon} label={q.text} labelSize={MAP.label} ring={interpolateColors(ease(f, at + m.sec(0.3), m.reveal), [0, 1], [theme.color.hairlineBrandSolid, theme.color.connector])} opacity={ease(f, at + m.sec(0.3), m.reveal)} />
              </div>
            );
          })}
        </div>
      </Appear>

      {/* F — Simon's two lines, then Orang Tuntun says them */}
      <Appear at={linesAt} out={manAt - m.sec(0.15)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={CLOSE.y[0]} w={theme.canvas.width} align="center" size={CLOSE.size} weight={500} text="Bukan harus pegang 10 tahun." mark="Bukan harus" />
      </Appear>
      {f >= manAt - 1 ? <OrangTuntun at={manAt} /> : null}
      {[
        { small: ["Bukan harus pegang 10 tahun.", "Bukan harus"], big: ["Tapi pikirkan bisnisnya 10 tahun sebelum membeli.", "pikirkan bisnisnya"], at: [manAt + m.sec(0.2), manAt + m.sec(0.4)], out: lastAt - m.sec(0.2) },
        { small: ["Belum terbayang cara perusahaan menghasilkan uang?", "menghasilkan uang"], big: ["Mungkin kita belum cukup paham apa yang dibeli.", "belum cukup paham"], at: [lastAt, W("mungkin kita")], out: undefined },
      ].map((said) => {
        const gone = said.out === undefined ? 0 : ease(f, said.out, m.sec(0.2));
        const marked = ([text, mark]: string[]) => <>{text.slice(0, text.indexOf(mark))}<span style={{ color: c.indigo }}>{mark}</span>{text.slice(text.indexOf(mark) + mark.length)}</>;
        return (
          <div key={said.small[0]} style={{ position: "absolute", left: SAID.x, top: SAID.y, width: theme.canvas.width - theme.margin.right - SAID.x, transform: "translateY(-50%)", fontFamily: theme.text.family, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.2, opacity: 1 - gone }}>
            <div style={{ fontSize: SAID.small, color: c.slate, marginBottom: SAID.gap, opacity: ease(f, said.at[0], m.reveal) }}>{marked(said.small)}</div>
            <div style={{ fontSize: SAID.big, color: c.ink, opacity: ease(f, said.at[1], m.reveal) }}>{marked(said.big)}</div>
          </div>
        );
      })}
    </Stage>
  );
};
