/**
 * VI02 · SC03 — "Cara Ibu Sari Melihat Bisnis" in VI01's look (Simon, 12 Nov 2026), from the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC03-v3.png: VI01's own Ibu Sari, warung and Mr. Market (black line art), in VI01's story frame,
 * with her cash book as VI01 drew it. The old scene is scenes/IbuSariBusiness.tsx (VI01_LOOK = false).
 *
 *  A  "Kita pakai contoh": the frame and the warung in the middle from the first frame; "Ibu Sari": she comes in with her
 *     book at its left, her name under her.
 *  B  "kamu membeli sepuluh persen … partner": "Kamu" full body at Ibu Sari's left, "Partner / 10%" over him.
 *  C  "Bukan berapa harga warungnya setiap lima menit": a 5-minute candlestick chart of the warung's price, running, a new bar
 *     every beat, at the frame's right; crossed (Simon 12 Nov).
 *  D  "berapa pelanggan … penjualan … stok, sewa, pegawai … laba": her book opens as VI01's card; each line lights on its words,
 *     the three costs come in as chips under Sales.
 *  E  "ada orang datang dan menawarkan harga": the warung and Ibu Sari step left, Mr. Market walks in from the frame's edge,
 *     Rp50 juta above him.
 *  F  "turun dua puluh persen": his offer drops to Rp40 juta, −20%, while her book is back between them and each line gets its
 *     tick on its words; on "apakah bisnisnya" the book is lit and the price goes grey.
 *  G  "Itulah perbedaan…" (a cut): Orang Tuntun and Simon's two lines, "Pemilik melihat bisnis." / "Penonton melihat harga."
 *
 * Ibu Sari's book carries VI01's figures (made up, the same wherever her book appears); the offers are Simon's (6 Nov).
 */
import { interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Candles, SoftGround, Stage, gridOf, seeded, theme, typeStyle, useMotion, usePalette, useShadow, type Bar } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Figure, Glyph, LEDGER_ROWS, Line, Mark, ORANG_TUNTUN_RIGHT, OrangTuntun, Pic, Ring, Shot, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** VI01's story frame and its scale: drawings 30 % under their first size, standing on 722. */
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const FLOOR = 722;
const WARUNG = { h: 364, cx: CX, aside: 560 };
const IBU = { h: 336, cx: 650, aside: 280 };
const NAME_Y = 790;

// B — you, a tenth of it
/**
 * "Kamu" full body (Simon 12 Nov: "coba buat icon avatarnya full body deh"): the avatar's young man standing, turned to the
 * warung (ChatGPT, public/art/vi02/kamu-full.png, 453 × 1451), on the same floor as Ibu Sari and Mr. Market; at her LEFT
 * (Simon 12 Nov: "posisi avatarnya di sebelah kiri ibu sari"), flipped to face her and the warung; "Partner / 10%" over him.
 */
const KAMU = { x: 462, h: 350, src: "art/vi02/kamu-full.png", w0: 453, h0: 1451, tie: 560 };
const KAMU_W = (KAMU.h * KAMU.w0) / KAMU.h0;
const KAMU_TOP = FLOOR - KAMU.h;

// C — the price, every five minutes
/**
 * The warung's price as a 5-minute candlestick chart that keeps running (Simon 12 Nov: "ganti aja, jadi grafik candlestick yang
 * berjalan terus tiap 5 menit"): `n` bars in view, a new one every `every` s, the oldest leaving at the left. Made-up tape (a
 * seeded walk), so no source tag; at the right of the frame, clear of the people and the warung.
 */
const PRICE = { x: 1180, y: 290, w: 500, h: 310, n: 14, every: 0.3, pad: 26, head: 74 };
const RUN_BARS: Bar[] = (() => {
  const r = seeded(305);
  let p = 100;
  return Array.from({ length: 60 }, () => {
    const o = p;
    // a walk that keeps coming back to its level, so the bars stay big in the card instead of drifting off
    const c = o + (r() - 0.5) * 3.2 + (100 - o) * 0.25;
    const bar = { o, c, h: Math.max(o, c) + r() * 1.1, l: Math.min(o, c) - r() * 1.1 };
    p = c;
    return bar;
  });
})();
/** The price scale: the bars that can be on screen while the chart is up (about 26), so the candles fill the card's height. */
const RUN_SEEN = RUN_BARS.slice(0, 30);
const RUN_LO = Math.min(...RUN_SEEN.map((b) => b.l));
const RUN_HI = Math.max(...RUN_SEEN.map((b) => b.h));

// D — her book
const BOOK = { x: 1220, y: 236, w: 500, s: 1 };
const BOOK_F = { x: 815, y: 244, w: 520, s: 0.9 };
const COSTS = [
  { text: "Stok", at: "stok" },
  { text: "Sewa", at: "sewa" },
  { text: "Pegawai", at: "pegawai" },
] as const;

// E–F — the man at the door
const MARKET = { h: 350, cx: 1530, from: 1980 };
const OFFER = { y: FLOOR - 350 - 70 };

// G — the two lines
const TWO = { x: ORANG_TUNTUN_RIGHT + 70, gap: 40, y: 330, h: 330 };
const TWO_W = (1760 - TWO.x - TWO.gap) / 2;

/** Ibu Sari's cash book, VI01's card with her three lines, and the three costs as chips under Sales. */
const Ledger = ({ s, lit, ticks, chips }: { s: number; lit: number[]; ticks: number[]; chips: number[] }) => {
  const c = usePalette();
  const rowH = 92 * s;
  return (
    <div style={{ position: "absolute", inset: 0, padding: `${34 * s}px ${36 * s}px`, display: "flex", flexDirection: "column", gap: 16 * s }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 * s, height: 64 * s }}>
        <Glyph icon="book-open" size={56 * s} tone={c.ink} />
        <div style={{ ...typeStyle("title"), fontSize: 46 * s, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Buku kas</div>
      </div>
      {LEDGER_ROWS.map((r, i) => (
        <div key={r.label}>
          <div style={{ position: "relative", height: rowH, borderRadius: 20 * s, background: lit[i] > 0.5 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: `inset 0 0 0 ${2 * s}px ${theme.color.skeleton}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${30 * s}px` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 20 * s, boxShadow: `inset 0 0 0 ${3 * s}px ${c.indigo}`, opacity: lit[i] }} />
            <div style={{ ...typeStyle("label"), fontSize: 36 * s, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{r.label}</div>
            <div style={{ ...typeStyle("label"), fontSize: 34 * s, fontWeight: 500, color: lit[i] > 0.5 ? c.indigo : c.slate, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", marginRight: ticks[i] > 0.001 ? 58 * s : 0 }}>{r.value}</div>
            {ticks[i] > 0.001 ? (
              <div style={{ position: "absolute", right: 18 * s, top: rowH / 2 - 22 * s, width: 44 * s, height: 44 * s, borderRadius: 999, background: theme.color.ok, display: "flex", alignItems: "center", justifyContent: "center", opacity: ticks[i], transform: `scale(${(0.7 + 0.3 * ticks[i]).toFixed(3)})`, fontFamily: theme.text.family, fontWeight: 700, fontSize: 24 * s, color: c.cardBg }}>✓</div>
            ) : null}
          </div>
          {i === 1 ? (
            <div style={{ display: "flex", gap: 12 * s, marginTop: 12 * s, paddingLeft: 10 * s, height: 46 * s }}>
              {COSTS.map((k, j) => (
                <div key={k.text} style={{ padding: `${6 * s}px ${20 * s}px`, borderRadius: 999, background: theme.color.neutralDisc, ...typeStyle("label"), fontSize: 26 * s, fontWeight: 500, color: c.slate, opacity: chips[j], whiteSpace: "nowrap" }}>{k.text}</div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
const LEDGER_H = (s: number) => 34 * s * 2 + 64 * s + 3 * (92 * s) + 4 * (16 * s) + 58 * s;

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;

  const twoAt = W("Itulah");

  // A–B
  const ibuAt = W("Ibu Sari");
  const kamuAt = W("sepuluh persen");
  const askAt = W("apa yang paling");

  // C
  const priceAt = W("Bukan berapa");
  const crossAt = W("lima menit");
  const priceP = ease(f, priceAt, m.reveal) * (1 - ease(f, W("lebih penting"), m.fade));
  /** a new bar every 5 "minutes" from the moment the chart is there; it never stops while it is on screen */
  const runEnd = Math.min(RUN_BARS.length, PRICE.n + Math.max(0, Math.floor((f - priceAt) / m.sec(PRICE.every))));

  // D
  const bookAt = W("lebih penting");
  const ask = ["berapa pelanggan", "berapa penjualan", "berapa laba"] as const;
  const lit = ask.map((a, i) => ease(f, W(a), m.pop) * (i < 2 ? 1 - ease(f, W(ask[i + 1]), m.pop) : 1 - ease(f, W("Lalu suatu"), m.fade)));
  const chips = COSTS.map((k) => ease(f, W(k.at), m.reveal));

  // E–F
  const offerAt = W("Lalu suatu");
  const aside = ease(f, offerAt, m.move);
  const walk = ease(f, W("ada orang"), m.sec(1.1));
  const saysAt = W("menawarkan harga");
  const backAt = W("Tapi kalau");
  const back = ease(f, backAt, m.move);
  const dropAt = W("turun dua");
  const drop = ease(f, dropAt, m.pop);
  const ticks = [W("pelanggan nggak"), W("penjualan tetap"), W("laba juga")].map((a) => ease(f, a, m.pop));
  const judge = ease(f, W("apakah bisnisnya"), m.reveal);

  const bookIn = ease(f, bookAt, m.reveal) * (1 - ease(f, offerAt, m.fade));
  const bookRect = BOOK_F;

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A–F: the warung's world, in VI01's frame */}
      <Shot from={-1} to={twoAt} block={BLOCK.SC03} cutIn={false}>
        <div style={{ position: "absolute", left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}`, opacity: ease(f, -m.reveal, m.reveal) }} />
        <Figure name="warung" cx={mix(WARUNG.cx, WARUNG.aside, aside)} floor={FLOOR} h={WARUNG.h} style={{ opacity: ease(f, -m.reveal, m.reveal) }} />
        {f >= ibuAt - m.reveal ? <Figure name="ibu-sari" cx={mix(IBU.cx, IBU.aside, aside)} floor={FLOOR} h={IBU.h} style={{ opacity: ease(f, ibuAt - m.reveal / 2, m.reveal) }} /> : null}
        <Appear at={ibuAt + m.sec(0.3)} style={{ left: 0, top: 0 }}>
          <WordPill x={mix(IBU.cx, IBU.aside, aside)} y={NAME_Y} text="Ibu Sari" size={32} />
        </Appear>

        {/* B: you, a tenth of the warung */}
        <Appear at={kamuAt} out={bookAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Pic src={staticFile(KAMU.src)} style={{ position: "absolute", left: KAMU.x - KAMU_W / 2, top: KAMU_TOP, width: KAMU_W, height: KAMU.h, transform: "scaleX(-1)" }} />
          {/* one label over him, two lines (Simon 12 Nov: "10% di ganti jadi 'Partner / 10%'"), whole from the start: no empty line */}
          <div style={{ position: "absolute", left: KAMU.x, top: KAMU_TOP - 18, transform: "translate(-50%, -100%)", padding: "10px 30px", borderRadius: 20, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, textAlign: "center", ...typeStyle("label"), fontWeight: 600, color: c.indigo, whiteSpace: "nowrap", lineHeight: 1.2 }}>
            <div style={{ fontSize: 30 }}>Partner</div>
            <div style={{ fontSize: 36 }}>10%</div>
          </div>
          <WordPill x={KAMU.x} y={NAME_Y} text="Kamu" size={32} />
        </Appear>
        <Appear at={askAt} out={priceAt} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: KAMU.x - KAMU_W / 2 - 80, top: KAMU_TOP + 6, width: 70, height: 70, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 42, fontWeight: 600, color: c.indigo }}>?</div>
        </Appear>

        {/* C: the price every five minutes — a running 5-minute chart — crossed */}
        {priceP > 0.001 ? (() => {
          const shownBars = RUN_BARS.slice(runEnd - PRICE.n, runEnd);
          const grid = gridOf(shownBars.map((b) => b.c), [RUN_LO, RUN_HI], { x: PRICE.pad, y: PRICE.head, w: PRICE.w - 2 * PRICE.pad, h: PRICE.h - PRICE.head - PRICE.pad }, 0.06);
          return (
            <div style={{ position: "absolute", left: PRICE.x, top: PRICE.y + (1 - priceP) * 12, width: PRICE.w, height: PRICE.h, opacity: priceP }}>
              <Card x={0} y={0} w={PRICE.w} h={PRICE.h}>
                <div style={{ position: "absolute", left: PRICE.pad + 4, top: 22, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Harga warung</div>
                  <div style={{ padding: "4px 14px", borderRadius: 999, background: theme.color.neutralDisc, ...typeStyle("label"), fontSize: 24, fontWeight: 600, color: c.slate }}>5m</div>
                </div>
                <Candles bars={shownBars} grid={grid} />
                <Mark kind="cross" p={ease(f, crossAt, m.pop)} x={PRICE.w - 44} y={44} size={56} />
              </Card>
            </div>
          );
        })() : null}

        {/* D: her book, open */}
        {bookIn > 0.001 ? (
          <div style={{ position: "absolute", left: BOOK.x, top: BOOK.y + (1 - bookIn) * 14, width: BOOK.w, height: LEDGER_H(BOOK.s), opacity: bookIn }}>
            <Card x={0} y={0} w={BOOK.w} h={LEDGER_H(BOOK.s)}>
              <Ledger s={BOOK.s} lit={lit} ticks={[0, 0, 0]} chips={chips} />
            </Card>
          </div>
        ) : null}

        {/* E: Mr. Market, walking in from the frame's edge, his offer above him */}
        {walk > 0.001 ? (
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(${FRAME.y}px ${theme.canvas.width - FRAME.x - FRAME.w}px ${theme.canvas.height - FRAME.y - FRAME.h}px ${FRAME.x}px round ${theme.shape.cardRadius}px)` }}>
            <Figure name="mr-market" cx={mix(MARKET.from, MARKET.cx, walk)} floor={FLOOR} h={MARKET.h} flip style={{ filter: judge > 0.001 ? `contrast(${(1 - 0.5 * judge).toFixed(3)}) brightness(${(1 + 0.3 * judge).toFixed(3)})` : undefined }} />
          </div>
        ) : null}
        <Appear at={saysAt} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: MARKET.cx, top: OFFER.y, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 14, padding: "10px 28px", borderRadius: 999, background: interpolateColors(judge, [0, 1], [c.cardBg, theme.color.neutralDisc]), boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: interpolateColors(judge, [0, 1], [c.ink, theme.color.mute]), whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
            {drop > 0.5 ? "Rp40 juta" : "Rp50 juta"}
            {drop > 0.001 ? <span style={{ color: interpolateColors(judge, [0, 1], [theme.color.crossRed, theme.color.mute]), opacity: drop }}>−20%</span> : null}
          </div>
        </Appear>

        {/* F: the book again, between them, a tick on each line that didn't change */}
        {back > 0.001 ? (
          <div style={{ position: "absolute", left: bookRect.x, top: bookRect.y + (1 - back) * 14, width: bookRect.w, height: LEDGER_H(bookRect.s), opacity: back }}>
            <Card x={0} y={0} w={bookRect.w} h={LEDGER_H(bookRect.s)} style={{ boxShadow: judge > 0.5 ? shadow.glow : shadow.soft }}>
              <Ring p={judge} tone={c.indigo} />
              <Ledger s={bookRect.s} lit={[0, 0, 0]} ticks={ticks} chips={[1, 1, 1]} />
            </Card>
          </div>
        ) : null}
      </Shot>

      {/* G: the difference */}
      <Shot from={twoAt} to={1e6} block={BLOCK.SC03} cutOut={false}>
        <OrangTuntun at={twoAt} />
        {[
          { icon: "book-open", text: "Pemilik melihat bisnis.", mark: "bisnis", at: W("Pemilik melihat") },
          { icon: "tag", text: "Penonton melihat harga.", mark: "harga", at: W("Penonton") },
        ].map((k, i) => {
          const p = ease(f, k.at, m.reveal);
          return p > 0.001 ? (
            <div key={k.text} style={{ position: "absolute", left: TWO.x + i * (TWO_W + TWO.gap), top: TWO.y + (1 - p) * 14, width: TWO_W, height: TWO.h, opacity: p }}>
              <Card x={0} y={0} w={TWO_W} h={TWO.h}>
                <div style={{ position: "absolute", left: (TWO_W - 110) / 2, top: 50, width: 110, height: 110, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={k.icon} size={60} tone={i === 0 ? c.indigo : theme.color.neutralIcon} />
                </div>
                <Line x={30} y={225} w={TWO_W - 60} text={k.text} mark={k.mark} size={42} align="center" weight={500} />
              </Card>
            </div>
          ) : null;
        })}
      </Shot>
    </Stage>
  );
};
