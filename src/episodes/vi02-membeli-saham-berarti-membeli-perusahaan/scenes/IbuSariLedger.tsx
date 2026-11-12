/**
 * VI02 · SC03 — "Cara Ibu Sari Melihat Bisnis" in VI01's look (Simon, 12 Nov 2026), from the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC03-v3.png: VI01's own Ibu Sari, warung and Mr. Market (black line art), in VI01's story frame,
 * with her cash book as VI01 drew it. The old scene is scenes/IbuSariBusiness.tsx (VI01_LOOK = false).
 *
 *  A  "Kita pakai contoh": the frame and the warung in the middle from the first frame; "Ibu Sari": she comes in with her
 *     book at its left, her name under her.
 *  B  "kamu membeli sepuluh persen … partner": "Kamu" at the right, 10%, tied to the warung, "Partner".
 *  C  "Bukan berapa harga warungnya setiap lima menit": a price over the warung, flicking through Simon's figures
 *     (Rp50 → 45 → 55 juta), crossed.
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
import { interpolateColors, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Figure, Glyph, KamuAvatar, LEDGER_ROWS, Line, Mark, ORANG_TUNTUN_RIGHT, OrangTuntun, Ring, Shot, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** VI01's story frame and its scale: drawings 30 % under their first size, standing on 722. */
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const FLOOR = 722;
const WARUNG = { h: 364, cx: CX, aside: 560 };
const IBU = { h: 336, cx: 650, aside: 280 };
const NAME_Y = 790;

// B — you, a tenth of it
const KAMU = { x: 1450, y: 470, d: 140 };

// C — the price, every five minutes
const PRICE = { w: 330, h: 116, y: 214 };
/** Simon's own figures (6 Nov), round and round until the price is crossed out. */
const FLICK = ["Rp50 juta", "Rp45 juta", "Rp55 juta"];

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
  const partnerAt = W("partner");
  const askAt = W("apa yang paling");

  // C
  const priceAt = W("Bukan berapa");
  const crossAt = W("lima menit");
  const priceP = ease(f, priceAt, m.reveal) * (1 - ease(f, W("lebih penting"), m.fade));
  const flick = FLICK[Math.max(0, Math.floor((Math.min(f, crossAt) - priceAt) / m.sec(0.3))) % FLICK.length];

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
          <Connector a={{ x: WARUNG.cx + 200, y: KAMU.y }} b={{ x: KAMU.x - KAMU.d / 2 - 14, y: KAMU.y }} p={ease(f, kamuAt + m.sec(0.2), m.sec(0.6))} />
          <KamuAvatar x={KAMU.x} y={KAMU.y} d={KAMU.d} label="Kamu" labelSize={32} />
          <WordPill x={KAMU.x} y={KAMU.y - KAMU.d / 2 - 46} text="10%" size={34} />
        </Appear>
        <Appear at={partnerAt} out={bookAt} style={{ left: 0, top: 0 }}>
          <WordPill x={KAMU.x} y={KAMU.y + KAMU.d / 2 + 110} text="Partner" size={30} />
        </Appear>
        <Appear at={askAt} out={priceAt} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: KAMU.x + KAMU.d / 2 - 10, top: KAMU.y - KAMU.d / 2 - 70, width: 70, height: 70, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 42, fontWeight: 600, color: c.indigo }}>?</div>
        </Appear>

        {/* C: the price every five minutes, crossed */}
        {priceP > 0.001 ? (
          <div style={{ position: "absolute", left: WARUNG.cx - PRICE.w / 2, top: PRICE.y + (1 - priceP) * 12, width: PRICE.w, height: PRICE.h, opacity: priceP }}>
            <Card x={0} y={0} w={PRICE.w} h={PRICE.h}>
              <div style={{ position: "absolute", left: 30, top: 18, ...typeStyle("label"), fontSize: 26, fontWeight: 500, color: c.slate }}>Harga warung</div>
              <div style={{ position: "absolute", left: 30, top: 50, ...typeStyle("title"), fontSize: 46, fontWeight: 600, color: c.ink, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{flick}</div>
              <Mark kind="cross" p={ease(f, crossAt, m.pop)} x={PRICE.w - 48} y={PRICE.h / 2} size={56} />
            </Card>
          </div>
        ) : null}

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
