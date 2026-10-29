/**
 * VI07 · SC08 — "Lihat Kondisi Market Sebelum Menambah Risiko". Still situation 4 (the heading stays). From the ChatGPT
 * storyboard docs/vi-style/storyboards/VI07-SC08.jpg.
 *
 *  A  one stock → the whole market (a mosaic of cards round it); the loan coin glows; everyone's cards tick up.
 *  B  the two real Tuntun screens, side by side (Simon 29 Oct: "ganti dengan gambar Sentiment.jpg dan Valuation.jpg"):
 *     IHSG Valuation, then Sentiment, each boxed in indigo round its whole picture while the VO names it.
 *  C  the pictures are one reading (Cheap; 42, Neutral) and the VO talks about both extremes, so nothing moves on them
 *     — the part it means is boxed instead (Simon: "kamu berikan highlight indigo aja, gausa gerakin jarum"): Expensive
 *     + the greed end with "Valuation & sentiment tinggi = waspada", then Cheap + the fear end with "Valuation &
 *     sentiment rendah = peluang" (Simon 29 Oct: summary lines instead of the two badges).
 *  D  "Market Valuation" named over them; it doesn't pick a stock (✕); then one summary line instead of the field of
 *     arrows (Simon 29 Oct: "jadi text ringkasan aja"): "Tenang, atau ikut arus?"
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { HighlightBox, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK, heldAt } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Heading, Line, Mark, SITUATION, Skel, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the mosaic
const TILE = { w: 150, h: 100, gap: 24 };
const COLS = 7;
const ROWS_N = 5;
const tileX = (col: number) => CX - (COLS * TILE.w + (COLS - 1) * TILE.gap) / 2 + col * (TILE.w + TILE.gap);
const tileY = (row: number) => 540 - (ROWS_N * TILE.h + (ROWS_N - 1) * TILE.gap) / 2 + row * (TILE.h + TILE.gap);
const CENTER = { col: 3, row: 2 };

// B–D — the two Tuntun screens (INV07/Revisi VO → public/art/vi07/app), `h` tall side by side, centred; the zones the VO
// names, in each picture's own pixels (measured on a grid)
const SHOT = { top: 290, h: 460, gap: 48, nameAbove: 94 };
const VAL = { src: "art/vi07/app/IHSG-valuation.jpg", w: 1080, h: 853, cheap: { x1: 130, y1: 270, x2: 340, y2: 540 }, dear: { x1: 730, y1: 250, x2: 940, y2: 480 } };
const SEN = { src: "art/vi07/app/IHSG-sentiment.jpg", w: 1080, h: 1073, fear: { x1: 270, y1: 330, x2: 430, y2: 570 }, greed: { x1: 650, y1: 330, x2: 810, y2: 570 } };
const VAL_W = (VAL.w * SHOT.h) / VAL.h;
const SEN_W = (SEN.w * SHOT.h) / SEN.h;
const VAL_X = CX - (VAL_W + SHOT.gap + SEN_W) / 2;
const SEN_X = VAL_X + VAL_W + SHOT.gap;
/** A zone of a picture (its pixels) as a box on the canvas, padded. */
const onShot = (x: number, w: number, srcW: number, r: { x1: number; y1: number; x2: number; y2: number }, pad = 6) => {
  const k = w / srcW;
  return { x1: x + r.x1 * k - pad, y1: SHOT.top + r.y1 * k - pad, x2: x + r.x2 * k + pad, y2: SHOT.top + r.y2 * k + pad };
};
/** A whole picture as a box, `pad` outside its edge (Simon 29 Oct: the first two boxes go round the screenshots, "ga usa spesifik di parameternya"). */
const aroundShot = (x: number, w: number, pad = 12) => ({ x1: x - pad, y1: SHOT.top - pad, x2: x + w + pad, y2: SHOT.top + SHOT.h + pad });
/** Where C and D put their things: under the pictures. */
const BELOW = SHOT.top + SHOT.h + 50;

/** A small stock card: a skeleton name and a sparkline. */
const StockTile = ({ up }: { up: number }) => (
    <>
      <Skel w={70} h={10} style={{ left: 16, top: 16 }} />
      <svg width={TILE.w - 32} height={40} style={{ position: "absolute", left: 16, top: 44 }}>
        <polyline points="0,30 20,26 38,30 58,20 78,24 98,12 118,8" fill="none" stroke={theme.color.neutralDot} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {up > 0.001 ? <div style={{ position: "absolute", right: 12, top: 10, fontFamily: theme.text.family, fontSize: 18, color: theme.color.gainGreen, opacity: up, transform: `translateY(${((1 - up) * 6).toFixed(2)}px)` }}>▲</div> : null}
    </>
);

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;
  /** Through the cut from SC07 (same situation) the ground and the heading are the Composition's, held still. */
  const held = heldAt(g) !== null;

  // A
  const oneAt = W("satu saham");
  const wholeAt = W("kondisi market");
  const loanAt = W("Karena leverage");
  const upAt = W("semua orang sedang");
  const aOut = ease(f, W("Sebelum memperbesar"), m.fade);

  // B/C — the screens, then the boxes on the zones the VO names
  const rangeAt = W("valuasi IHSG");
  const gaugeAt = W("sentimen pasar");
  const highAt = W("Saat valuasi dan");
  const lowAt = W("Saat valuasi rendah");
  const box = (at: number, out: number) => ease(f, at, m.reveal) * (1 - ease(f, out, m.fade));
  const valBox = box(W("berada dibandingkan"), W("dan apakah"));
  const senBox = box(W("didominasi"), W("Prinsipnya"));
  const highBox = box(highAt, lowAt);
  const lowBox = box(lowAt, W("Market Valuation"));

  // D
  const pickP = ease(f, W("memilihkan saham"), m.reveal) * (1 - ease(f, W("Fitur ini"), m.fade));
  const fieldAt = W("suasana pasar");

  return (
    <Stage transparent={held}>
      {held ? null : <SoftGround f={g} />}
      {held ? null : <BoardGrid g={g} on={1} />}
      {held ? null : <Heading n={4} text={SITUATION[3].label} />}

      {/* A — one stock, then the whole market round it */}
      {aOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut }}>
          {Array.from({ length: COLS * ROWS_N }, (_, k) => {
            const col = k % COLS;
            const row = Math.floor(k / COLS);
            const centre = col === CENTER.col && row === CENTER.row;
            const dist = Math.hypot(col - CENTER.col, row - CENTER.row);
            const p = centre ? ease(f, oneAt - m.sec(0.1), m.reveal) : ease(f, wholeAt + dist * m.sec(0.07), m.reveal);
            if (p <= 0.001) return null;
            const up = ease(f, upAt + dist * m.sec(0.06), m.pop);
            return (
              <Card key={k} x={tileX(col)} y={tileY(row) + (1 - p) * 14} w={TILE.w} h={TILE.h} line={centre ? theme.color.connector : undefined} style={{ opacity: p, borderRadius: 18 }}>
                <StockTile up={up} />
              </Card>
            );
          })}
          {/* the loan, tempting in the middle of it */}
          <Appear at={loanAt} style={{ left: CX - 60, top: 540 - 60 }}>
            <div style={{ borderRadius: 999, boxShadow: `${shadow.soft}, 0 0 ${(30 + 14 * Math.sin((f / m.sec(0.8)) * Math.PI)).toFixed(1)}px 8px ${theme.color.alarmWashSolid}` }}>
              <Disc icon="loan" size={120} tone={theme.color.alarmRed} tint={c.cardBg} />
            </div>
          </Appear>
        </div>
      ) : null}

      {/* B–D — the two real screens, named when the VO names them */}
      <Appear at={W("Market Valuation")} style={{ left: 0, top: SHOT.top - SHOT.nameAbove, width: theme.canvas.width, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Disc icon="gauge" size={60} tone={c.indigo} tint={theme.color.indigoWashSolid} />
          <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Market Valuation</div>
        </div>
      </Appear>
      {[
        { at: rangeAt - m.sec(0.15), x: VAL_X, w: VAL_W, s: VAL },
        { at: gaugeAt - m.sec(0.1), x: SEN_X, w: SEN_W, s: SEN },
      ].map((p) => (
        <Appear key={p.s.src} at={p.at} style={{ left: p.x, top: SHOT.top, width: p.w, height: SHOT.h, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft, background: c.cardBg }}>
          <Img src={staticFile(p.s.src)} style={{ width: p.w, height: SHOT.h, display: "block" }} />
        </Appear>
      ))}
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
        {[
          { p: valBox, r: aroundShot(VAL_X, VAL_W), radius: theme.shape.cardRadius + 12 },
          { p: senBox, r: aroundShot(SEN_X, SEN_W), radius: theme.shape.cardRadius + 12 },
          { p: highBox, r: onShot(VAL_X, VAL_W, VAL.w, VAL.dear) },
          { p: highBox, r: onShot(SEN_X, SEN_W, SEN.w, SEN.greed) },
          { p: lowBox, r: onShot(VAL_X, VAL_W, VAL.w, VAL.cheap) },
          { p: lowBox, r: onShot(SEN_X, SEN_W, SEN.w, SEN.fear) },
        ].map((b, k) => (b.p > 0.001 ? <HighlightBox key={k} rect={b.r} grow={b.p} opacity={b.p} fill="none" width={4} radius={"radius" in b ? b.radius : 18} /> : null))}
      </svg>

      {/* C — what each reading asks of you, as one line under the pictures (Simon's words) */}
      {/* in with their sentences (Simon 29 Oct: "mulai di 21310", "mulai di 21594") */}
      <Appear at={highAt + m.sec(0.1)} out={lowAt} style={{ left: 0, top: 0 }}>
        <Line x={0} y={BELOW + 49} w={theme.canvas.width} align="center" size={48} weight={500} text="Valuation & sentiment tinggi = waspada" mark="waspada" markInk={theme.color.alarmRed} />
      </Appear>
      <Appear at={W("valuasi rendah") + m.sec(0.17)} out={W("Market Valuation")} style={{ left: 0, top: 0 }}>
        <Line x={0} y={BELOW + 49} w={theme.canvas.width} align="center" size={48} weight={500} text="Valuation & sentiment rendah = peluang" mark="peluang" />
      </Appear>

      {/* D — it doesn't pick a stock for you */}
      {pickP > 0.001 ? (
        <>
          <Card x={CX - TILE.w / 2} y={BELOW} w={TILE.w} h={TILE.h} style={{ opacity: pickP, borderRadius: 18 }}>
            <StockTile up={0} />
          </Card>
          <Mark kind="cross" p={pickP} x={CX + TILE.w / 2} y={BELOW} />
        </>
      ) : null}

      {/* … calm, or everyone moving the same way: one line (my wording of the VO's question) */}
      <Appear at={fieldAt} style={{ left: 0, top: 0 }}>
        <Line x={0} y={BELOW + 49} w={theme.canvas.width} align="center" size={48} weight={500} text="Tenang, atau ikut arus?" mark="ikut arus" />
      </Appear>
    </Stage>
  );
};
