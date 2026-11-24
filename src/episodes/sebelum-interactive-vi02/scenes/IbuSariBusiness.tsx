/**
 * VI02 · SC03 — "Cara Ibu Sari Melihat Bisnis", from Simon's direction and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC03.jpg. Ibu Sari and her shop are Value Investing V01's (components/IbuSari.jsx).
 * The price board's figures are Simon's, from his direction; they are an example, not market data.
 *
 *  A  "Ibu Sari adalah pemilik sebuah warung": the shop in the middle, her name on its board.
 *  B  "kamu membeli sepuluh persen": the shop makes room; a ring with its tenth lit, 10% OWNERSHIP, "Kamu".
 *  C  "apa yang paling ingin kamu tahu?": the question on a card; on "Bukan berapa" its words turn to what it is not.
 *  D  "harga warungnya setiap lima menit": the price card flickering through prices, crossed.
 *  E  "berapa pelanggan …": her notes, row by row: Customers, Sales, Costs, Profit.
 *  F  "menawarkan harga": the board again, Rp50 → 45 → 55 → 40 juta, while the rows get their ticks.
 *  G  "Pemilik melihat bisnis. Penonton melihat harga.", Orang Tuntun beside the two cards.
 */
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, IconDisc, ORANG_TUNTUN_RIGHT, OrangTuntun, WordPill, ease, useWords } from "../components/kit";
import { SHOP, ShopWindow } from "../components/Shop";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Close on the door while we meet her. */
const ZOOM = { k: 1.45 };

const SIDE = { x: 1180, w: 644, cx: 1502 };
const RING = { y: 330, r: 110, stroke: 44 };
const YOU = { y: 640, d: 150 };
const QUESTION = { y: 290, h: 420 };
const QUESTION_WORDS = [
  { lead: "Sebagai pemilik,", line: "apa yang paling ingin kamu tahu?" },
  { lead: "Bukan harganya", line: "yang berubah\ntiap lima menit." },
];
const NOTES = { y: 200, h: 680, rowY: 150, rowH: 124, disc: 84 };
const ROWS = [
  { icon: "users-three", label: "Customers", at: "berapa pelanggan", tick: "pelanggan nggak" },
  { icon: "shopping-cart", label: "Sales", at: "berapa penjualan", tick: "penjualan tetap" },
  { icon: "receipt", label: "Costs", at: "setelah membayar", tick: null },
  { icon: "chart-line-up", label: "Profit", at: "berapa laba", tick: "laba juga" },
] as const;

/** The price, at the top of the shop's window and centred on it; the soft card of Simon's reference (5 Nov). */
const BOARD = { w: 400, h: 168, y: 36, r: 44, pad: 44, size: 64 };
const BOARD_X = (SHOP.w - BOARD.w) / 2;
/** Simon's prices, in juta; each one's change is against the first, so Rp40 juta is the VO's "turun dua puluh persen". */
const PRICES = [50, 45, 55, 40];
const changeOf = (price: number) => Math.round(((price - PRICES[0]) / PRICES[0]) * 100);

const FINAL = { w: 500, h: 300, y: 350, left: 70, gap: 36, disc: 120, size: 40 };
const finalX = (i: number) => ORANG_TUNTUN_RIGHT + FINAL.left + i * (FINAL.w + FINAL.gap);

const Tick = ({ x, y, p }: { x: number; y: number; p: number }) =>
  p <= 0.001 ? null : (
    <svg width={56} height={56} style={{ position: "absolute", left: x - 28, top: y - 28, opacity: p, transform: `scale(${(0.8 + 0.2 * p).toFixed(3)})` }}>
      <path d="M 12 30 L 24 42 L 46 16" fill="none" stroke={theme.color.checkGreen} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;

  const room = ease(f, W("Sekarang anggap") - m.sec(0.25), m.move);
  const shopX = mix(CX - SHOP.w / 2, SHOP.left, room);
  const ownAt = W("sepuluh persen");
  const askAt = W("Sebagai salah");
  const notesAt = W("Yang lebih penting");
  const endAt = W("Itulah perbedaan");
  const shopOut = ease(f, endAt - m.sec(0.2), m.fade);
  /** Close on her first, her shop filling the window; back to the whole shop as it makes room. */
  const close = mix(ZOOM.k, 1, room);

  // the board: flickering for "setiap lima menit", then the offer, step by step
  const flickAt = W("Bukan berapa");
  const flickEnd = W("Yang lebih penting");
  const offerAt = W("ada orang");
  const steps = [offerAt, W("Harga itu"), W("tentu penting"), W("tiba-tiba turun")];
  const offering = f >= offerAt;
  const shown = offering ? steps.reduce((k, at, i) => (f >= at ? i : k), 0) : Math.floor((f - flickAt) / m.sec(0.22)) % PRICES.length;
  const boardOn = Math.max(ease(f, flickAt, m.reveal) * (1 - ease(f, flickEnd, m.fade)), ease(f, offerAt, m.reveal));
  const crossed = ease(f, W("lima menit"), m.reveal) * (1 - ease(f, flickEnd, m.fade));
  const fell = offering && shown === 3;
  const price = PRICES[Math.max(0, shown)];
  const change = changeOf(price);

  const ringArc = interpolate(ease(f, ownAt, m.sec(0.6)), [0, 1], [0, 0.1]);
  const circ = 2 * Math.PI * RING.r;

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* the shop */}
      <Appear at={-m.reveal} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height, opacity: 1 - shopOut }}>
        <ShopWindow x={shopX} f={f} close={close} shadow={shadow.soft}>
          {/* the price board */}
          {boardOn > 0.001 ? (
            <div style={{ position: "absolute", left: 0, top: 0, opacity: boardOn }}>
              <div style={{ position: "absolute", left: BOARD_X, top: BOARD.y, width: BOARD.w, height: BOARD.h, boxSizing: "border-box", padding: `0 ${BOARD.pad}px`, borderRadius: BOARD.r, background: `linear-gradient(to bottom, ${c.cardBg}, ${theme.color.neutralDisc})`, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.cardBg}`, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", ...typeStyle("label"), fontSize: 26, color: c.slate }}>
                  <div>Harga</div>
                  {change ? <div style={{ fontWeight: 600, color: change > 0 ? theme.color.checkGreen : theme.color.calendarRed, fontVariantNumeric: "tabular-nums" }}>{`(${change > 0 ? "+" : ""}${change}%)`}</div> : null}
                </div>
                <div style={{ ...typeStyle("title"), fontSize: BOARD.size, fontWeight: 500, letterSpacing: -1, lineHeight: 1.1, color: fell ? theme.color.calendarRed : c.ink, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{`Rp${price} juta`}</div>
              </div>
              {crossed > 0.001 ? (
                <svg width={BOARD.w} height={BOARD.h} style={{ position: "absolute", left: BOARD_X, top: BOARD.y, opacity: crossed }}>
                  <g stroke={theme.color.calendarRed} strokeWidth={8} strokeLinecap="round">
                    <line x1={30} y1={24} x2={BOARD.w - 30} y2={BOARD.h - 24} />
                    <line x1={BOARD.w - 30} y1={24} x2={30} y2={BOARD.h - 24} />
                  </g>
                </svg>
              ) : null}
            </div>
          ) : null}
        </ShopWindow>
      </Appear>

      {/* B — your tenth */}
      <Appear at={ownAt - m.sec(0.2)} out={askAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={SIDE.cx} cy={RING.y} r={RING.r} fill="none" stroke={theme.color.connectorMute} strokeWidth={RING.stroke} />
          <circle cx={SIDE.cx} cy={RING.y} r={RING.r} fill="none" stroke={theme.color.connector} strokeWidth={RING.stroke} strokeDasharray={`${(ringArc * circ).toFixed(1)} ${circ.toFixed(1)}`} transform={`rotate(-90 ${SIDE.cx} ${RING.y})`} />
        </svg>
        <Appear at={ownAt + m.sec(0.3)} style={{ left: 0, top: 0 }}>
          <WordPill x={SIDE.cx} y={RING.y + RING.r + 66} text="10% OWNERSHIP" />
        </Appear>
        <Connector a={{ x: SIDE.cx, y: RING.y + RING.r + 94 }} b={{ x: SIDE.cx, y: YOU.y - YOU.d / 2 }} p={ease(f, W("partner"), m.sec(0.4))} shape="curve" axis="y" dot={false} />
        <IconDisc x={SIDE.cx} y={YOU.y} d={YOU.d} icon="user" ring={theme.color.selfAmber} opacity={ease(f, W("partner"), m.reveal)} />
      </Appear>

      {/* C — the question */}
      <Appear at={askAt} out={notesAt} style={{ left: 0, top: 0 }}>
        <Card x={SIDE.x} y={QUESTION.y} w={SIDE.w} h={QUESTION.h}>
          {QUESTION_WORDS.map((q, i) => (
            <div key={q.lead} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px", gap: 18, opacity: i ? ease(f, flickAt, m.reveal) : 1 - ease(f, flickAt - m.fade, m.fade) }}>
              <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>{q.lead}</div>
              <div style={{ ...typeStyle("title"), fontWeight: 600, color: c.indigo, whiteSpace: "pre-line" }}>{q.line}</div>
            </div>
          ))}
        </Card>
      </Appear>

      {/* E–F — her notes */}
      <Appear at={notesAt} out={endAt - m.sec(0.2)} style={{ left: 0, top: 0 }}>
        <Card x={SIDE.x} y={NOTES.y} w={SIDE.w} h={NOTES.h}>
          <div style={{ position: "absolute", left: 44, top: 44, display: "flex", alignItems: "center", gap: 20 }}>
            <Img src={staticFile("icons/vi02/ph-notebook.svg")} style={{ width: 56, height: 56 }} />
            <div style={{ ...typeStyle("title"), color: c.ink }}>Yang lebih penting</div>
          </div>
          {ROWS.map((r, i) => {
            const p = ease(f, W(r.at), m.reveal);
            const y = NOTES.rowY + i * NOTES.rowH;
            return (
              <div key={r.label} style={{ position: "absolute", left: 0, top: y, width: SIDE.w, height: NOTES.rowH, opacity: p, transform: `translateY(${((1 - p) * 12).toFixed(1)}px)` }}>
                <IconDisc x={44 + NOTES.disc / 2} y={NOTES.rowH / 2} d={NOTES.disc} icon={r.icon} />
                <div style={{ position: "absolute", left: 44 + NOTES.disc + 30, top: 0, height: NOTES.rowH, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 40, fontWeight: 500, color: c.ink }}>{r.label}</div>
                {r.tick ? <Tick x={SIDE.w - 80} y={NOTES.rowH / 2} p={ease(f, W(r.tick), m.reveal)} /> : null}
              </div>
            );
          })}
        </Card>
      </Appear>

      {/* G — owner and spectator, Orang Tuntun beside them */}
      {f >= endAt - 1 ? <OrangTuntun at={endAt} /> : null}
      {[
        { icon: "notebook", text: "Pemilik melihat bisnis.", mark: "bisnis", at: W("pemilik bisnis") },
        { icon: "tag", text: "Penonton melihat harga.", mark: "harga", at: W("orang yang hanya") },
      ].map((a, i) => (
        <Appear key={a.text} at={i === 0 ? endAt : endAt + m.sec(0.15)} style={{ left: 0, top: 0 }}>
          <Card x={finalX(i)} y={FINAL.y} w={FINAL.w} h={FINAL.h}>
            <IconDisc x={FINAL.w / 2} y={100} d={FINAL.disc} icon={a.icon} />
            <div style={{ position: "absolute", left: 0, top: 192, width: FINAL.w, textAlign: "center", ...typeStyle("title"), fontSize: FINAL.size, fontWeight: 500, color: c.ink, opacity: ease(f, a.at, m.reveal) }}>
              {a.text.slice(0, a.text.indexOf(a.mark))}
              <span style={{ color: c.indigo }}>{a.mark}</span>.
            </div>
          </Card>
        </Appear>
      ))}
    </Stage>
  );
};
