/**
 * VI02 · SC01 — "Di Balik Empat Huruf" in VI01's look (Simon, 12 Nov 2026: "redesign dan revamp scene 1-3 dulu. Pelajari style
 * design dari VI01"), from the ChatGPT storyboard docs/vi-style/storyboards/VI02-SC01-v3.png. The old scene is
 * scenes/BehindTheCode.tsx, back with VI01_LOOK = false (data/switches.ts).
 *
 *  A  "Di video sebelumnya …": VI01's closing line comes back under a "Video sebelumnya" pill. "sebelum melihat saham sebagai
 *     harga": VI01's price card, "Harga"; "lihat dulu bisnis": a card with the factory, "Bisnis", lit, the price going grey.
 *  B  "Sekarang kita lihat": the Bisnis card opens into VI01's story frame (white, a 3 px black border) and its factory with it.
 *     "Jam empat pagi": 04:00 in the frame's corner (the factory drawing has its own smoke).
 *  C  "Produk keluar … toko-toko": the factory steps left and the chain lays itself out on its words — conveyor, box, truck,
 *     shops — a dashed path between them, one word under each.
 *  D  "Semua aktivitas itu terus berjalan": 04:00 gives way to the night (23:00, a moon) while packs keep running down the path.
 *  E  "Tapi ketika masuk ke aplikasi saham" (a camera cut): VI01's app card, "Saham", its rows grey until ICBP's lights up on
 *     "empat huruf".
 *  F  "ICBP." (a cut): the four letters, alone and large. "Padahal … nggak membeli empat huruf" (Simon 12 Nov: "jangan kasih
 *     silang … muncul text ringkasan aja di bawah ICBP"): one short line under them, no cross.
 *  G  "Kita membeli sebagian kecil kepemilikan": the letters rise into a title and the business comes under them — the frame
 *     with the chain as it stood at 04:00, the factory faint behind it, 85 % of its size so it fits under the title (Simon 12 Nov,
 *     after a pie, a donut and a circle: "remove lingkarannya. Ganti dengan ini" — that frame — "icbp nya tetep ada kayak tadi"),
 *     both 50 px higher; it comes straight in 30 % smaller at the right, a person icon at its left ("gambar 1 skip aja"); "kepemilikan":
 *     a 100 × 100 px piece is cut from the frame's top-left corner and flies to the person; both keep a border along the cut
 *     ("setelah terpotong, bisa ga kedua objek masih ada bordernya?"), every corner of both rounded; the piece lands right beside
 *     the person, not on it, and "1%" comes under it once it is there (Simon 12 Nov).
 *
 * The drawings are made up (ChatGPT line art).
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, AvatarTile, BoardGrid, Card, Drawing, IconDisc, IconPill, Line, PriceCandles, Ring, Shot, WordPill, ease, lineArtW, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
type Rect = { x: number; y: number; w: number; h: number };
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t) });

/** VI01's story frame: 1600 × 700 in the middle of the screen, white, a 3 px black border. */
const FRAME: Rect = { x: (theme.canvas.width - 1600) / 2, y: (theme.canvas.height - 700) / 2, w: 1600, h: 700 };
const FRAME_LINE = 3;

// A — the two cards
const PILL_Y = 196;
const CARD = { w: 500, h: 440, y: 320, gap: 200 };
/** The words over the two cards, their baseline `gap` above the cards' top. */
const CARD_WORDS = { size: 40, gap: 22 };
const HARGA: Rect = { x: CX - CARD.gap / 2 - CARD.w, y: CARD.y, w: CARD.w, h: CARD.h };
const BISNIS: Rect = { x: CX + CARD.gap / 2, y: CARD.y, w: CARD.w, h: CARD.h };
/** The factory inside the Bisnis card, and where it stands once the card has opened into the frame. */
const IN_CARD = { h: 230, floor: CARD.y + CARD.h - 50 };
/** Simon 12 Nov: the factory 40 % bigger in the frame (360 → 504), then 10 % smaller (→ 454) and to the left as the chain comes. */
const IN_FRAME = { h: 504, floor: 780 };
const FAC_STEP = { cx: 520, h: 454, floor: 720 };
const CLOSING_Y = 540;

// C — the chain, inside the frame
/** The chain stands a little lower than the factory: it comes in over it, in front (Simon 12 Nov: "overlap aja sama pabrik … munculnya di atas pabrik"). */
const FLOOR = 740;
const CHAIN_LAID = [
  { name: "factory", cx: 356, h: 240, word: "", at: "" },
  { name: "conveyor", cx: 678, h: 110, word: "Produksi", at: "jalur produksi" },
  { name: "box", cx: 907, h: 110, word: "Kardus", at: "kardus" },
  { name: "truck", cx: 1138, h: 140, word: "Truk", at: "truk" },
  /** 90 px further from the truck than first laid out (Simon 12 Nov: "Beri jarak lagi antara truk dan toko"): a 173 px gap. */
  { name: "shops", cx: 1602, h: 170, word: "Toko", at: "toko-toko" },
] as const;
/**
 * Produksi, Kardus, Truk and Toko as one group, centred in the frame (Simon 12 Nov: "group them lalu center them"): their
 * spacing kept, the four moved together so the group's outer edges sit evenly about the frame's middle.
 */
const GROUP = CHAIN_LAID.slice(1);
const GROUP_DX = FRAME.x + FRAME.w / 2 - (Math.min(...GROUP.map((k) => k.cx - lineArtW(k.name, k.h) / 2)) + Math.max(...GROUP.map((k) => k.cx + lineArtW(k.name, k.h) / 2))) / 2;
const CHAIN = CHAIN_LAID.map((k, i) => (i === 0 ? k : { ...k, cx: k.cx + GROUP_DX }));
const LABEL_Y = 806;
/** The dashed path the goods take, at belt height, from the conveyor's end to the shops (the drawings, white inside, hide it). */
const PATH_Y = FLOOR - 46;
const PACK = { d: 22, every: 36, speed: 6 };
const CLOCK = { x: FRAME.x + 34, y: FRAME.y + 30 };
/** G: the code as a title, the business frame under it at `k` of its size, its top at `top`. */
const TITLE = { y: 186, size: 104 };
/** The frame under the title at 85 %, then 30 % smaller (× 0.7) against the frame's right edge, its middle kept. */
const BACK = { top: 280, k: 0.85, small: 0.7, right: FRAME.x + FRAME.w };
const BACK_MID = BACK.top + (FRAME.h * BACK.k) / 2;
/** The person the piece flies to, at the left of the shrunk frame; the 20 × 20 px piece lands on it as a badge. */
const PERSON = { x: 440, y: BACK_MID, d: 200 };
/** The piece lands right beside the person, not on it, with `gap` between them; "1%" under it once it is there. */
const LAND = { gap: 28, label: 46 };
/** The corner rounding on the cut, in screen px (Simon 12 Nov: "objek potongan dan yang terpotong tetep rounded corner"). */
const CUT_R = 12;
/** Simon 12 Nov: first 20 × 20, then "terlalu kecil, jadiin 100 x 100 aja". */
const PIECE = 100;

// E — the app card
const APP: Rect = { x: CX - 300, y: 196, w: 600, h: 700 };
const ROWS = { top: 150, h: 118, gap: 14, pad: 40, lit: 1, disc: 76 };

// F/G — the four letters, their one-line summary, then the fraction they stand for
const CODE = { y: 520, size: 300, topY: 250, topSize: 120 };
const SUMMARY = { y: 790, size: 56 };

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(1, BLOCK.SC01);
  const g = f + BLOCK.SC01;

  // A
  const hargaAt = W("melihat saham");
  const bisnisAt = W("lihat dulu");
  const openAt = W("Sekarang kita");
  const grey = ease(f, bisnisAt, m.reveal);
  const open = ease(f, openAt, m.sec(0.9));
  const cardRect = lerpRect(BISNIS, FRAME, open);

  // B–D
  const clockAt = W("Jam empat");
  const chainAt = W("Produk keluar");
  const step = ease(f, chainAt, m.move);
  const nightAt = W("Semua aktivitas");
  const night = ease(f, nightAt, m.reveal);
  const appAt = W("Tapi ketika");

  // E
  /** "seluruh bisnis tadi akhirnya hanya terlihat …": ICBP's row lights while it is said. */
  const litAt = W("hanya terlihat");
  const codeAt = W("ICBP.");

  // F/G
  const sumAt = W("Padahal");
  const backAt = W("Kita membeli");
  /** "Kita membeli": the letters rise into a title, the circle comes under them. */
  /** the letters rise into a title; the business comes in under them */
  const toTitle = ease(f, backAt, m.move);
  const back = ease(f, backAt + m.sec(0.25), m.reveal);
  /** Simon 12 Nov: "gambar 1 skip aja, langsung ke gambar 2" — the frame comes straight in small, at the right, the person with it. */
  const shrink = 1;
  const personIn = ease(f, backAt + m.sec(0.4), m.reveal);
  const cutAt = W("kepemilikan");
  const fly = ease(f, cutAt + m.sec(0.15), m.sec(1));

  /** The factory: in the Bisnis card, then grown into the frame, then stepped left into the chain. */
  const facH = mix(mix(IN_CARD.h, IN_FRAME.h, open), FAC_STEP.h, step);
  const facX = mix(cardRect.x + cardRect.w / 2, FAC_STEP.cx, step);
  const facFloor = mix(mix(IN_CARD.floor, IN_FRAME.floor, open), FAC_STEP.floor, step);
  /** The chain's first link: the dashed path grows to each drawing just before it arrives. */
  const linkP = (i: number) => (i === 0 ? 1 : ease(f, W(CHAIN[i].at) - m.sec(0.35), m.sec(0.35)));


  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A–D: one shot, the cards opening into the story frame */}
      <Shot from={-1} to={appAt} block={BLOCK.SC01} cutIn={false}>
        <Appear at={W("Di video")} out={hargaAt - m.sec(0.2)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={CLOSING_Y} w={theme.canvas.width} text="Value Investing = melihat saham sebagai bisnis." size={58} mark="Value Investing" align="center" weight={500} />
        </Appear>
        <Appear at={W("Di video")} out={openAt} style={{ left: 0, top: 0 }}>
          <WordPill x={CX} y={PILL_Y} text="Video sebelumnya" />
        </Appear>

        {/* Simon's words over the two cards (12 Nov: "Di atas kartu kiri tambahin 'Sebelum lihat...', di kanan tambahin 'Lihat dulu...'") */}
        <Appear at={hargaAt} out={openAt} style={{ left: HARGA.x, top: CARD.y - CARD_WORDS.gap, width: HARGA.w, transform: "translateY(-100%)" }}>
          <div style={{ textAlign: "center", ...typeStyle("label"), fontSize: CARD_WORDS.size, fontWeight: 500, color: interpolateColors(grey, [0, 1], [c.ink, theme.color.mute]), whiteSpace: "nowrap" }}>Sebelum lihat...</div>
        </Appear>
        <Appear at={bisnisAt} out={openAt} style={{ left: BISNIS.x, top: CARD.y - CARD_WORDS.gap, width: BISNIS.w, transform: "translateY(-100%)" }}>
          <div style={{ textAlign: "center", ...typeStyle("label"), fontSize: CARD_WORDS.size, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>Lihat dulu...</div>
        </Appear>
        {/* the price card, going grey once the business is named */}
        <Appear at={hargaAt} out={openAt} rise={14} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <div style={{ position: "absolute", left: HARGA.x, top: HARGA.y, width: HARGA.w, height: HARGA.h, filter: grey > 0.001 ? `grayscale(${grey.toFixed(3)}) contrast(${(1 - 0.45 * grey).toFixed(3)}) brightness(${(1 + 0.12 * grey).toFixed(3)})` : undefined }}>
            <Card x={0} y={0} w={HARGA.w} h={HARGA.h}>
              <PriceCandles title="Harga" w={HARGA.w} h={HARGA.h} s={0.8} draw={ease(f, hargaAt + m.sec(0.2), m.sec(0.9))} change={0} />
            </Card>
          </div>
        </Appear>
        <Appear at={bisnisAt} out={openAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <g fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={ease(f, bisnisAt, m.reveal)}>
              <line x1={HARGA.x + HARGA.w + 40} y1={CARD.y + CARD.h / 2} x2={BISNIS.x - 40} y2={CARD.y + CARD.h / 2} />
              <path d={`M ${BISNIS.x - 54} ${CARD.y + CARD.h / 2 - 12} L ${BISNIS.x - 40} ${CARD.y + CARD.h / 2} L ${BISNIS.x - 54} ${CARD.y + CARD.h / 2 + 12}`} />
            </g>
          </svg>
        </Appear>

        {/* the Bisnis card, opening into the frame: one box, white, its border going from the brand hairline to black */}
        {f >= bisnisAt ? (
          <div style={{ position: "absolute", left: cardRect.x, top: cardRect.y, width: cardRect.w, height: cardRect.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${mix(3, FRAME_LINE, open)}px ${interpolateColors(open, [0, 1], [c.indigo, c.ink])}`, opacity: ease(f, bisnisAt, m.reveal) }} />
        ) : null}
        <Appear at={bisnisAt} out={openAt} rise={0} style={{ left: BISNIS.x, top: BISNIS.y, width: BISNIS.w }}>
          <div style={{ position: "absolute", left: 0, top: 40, width: BISNIS.w, textAlign: "center", ...typeStyle("title"), fontSize: 46, fontWeight: 600, color: c.ink }}>Bisnis</div>
        </Appear>

        {/* the factory, from the card to the chain */}
        {f >= bisnisAt ? (
          <>
            {/* opacity 100 % → 10 % as it steps left (Simon 12 Nov: first 20 % opacity, then "masih agak bentrok, buat jadi 10%") */}
            <Drawing name="factory" cx={facX} floor={facFloor} h={facH} style={{ opacity: ease(f, bisnisAt, m.reveal) * (1 - 0.9 * step) }} />
          </>
        ) : null}

        {/* B: the hour, then the night */}
        <Appear at={clockAt} out={nightAt} style={{ left: CLOCK.x, top: CLOCK.y }}>
          <IconPill x={0} y={0} icon="clock" text="04:00" size={38} style={{ position: "relative" }} />
        </Appear>
        <Appear at={nightAt} style={{ left: CLOCK.x, top: CLOCK.y }}>
          <IconPill x={0} y={0} icon="moon" text="23:00" size={38} style={{ position: "relative" }} />
        </Appear>

        {/* C: the chain */}
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          {CHAIN.slice(1).map((k, i) => {
            if (i === 0) return null;
            const a = CHAIN[i];
            const x0 = a.cx + lineArtW(a.name, a.h) / 2 + 14;
            const x1 = k.cx - lineArtW(k.name, k.h) / 2 - 14;
            const p = linkP(i + 1);
            return p > 0.001 ? <line key={k.name} x1={x0} y1={PATH_Y} x2={mix(x0, x1, p)} y2={PATH_Y} stroke={c.ink} strokeWidth={3} strokeDasharray="10 12" strokeLinecap="round" /> : null;
          })}
        </svg>
        {/* D: the goods keep going down the path through the night, behind the drawings */}
        {night > 0.001
          ? Array.from({ length: 12 }, (_, i) => {
              const x0 = CHAIN[1].cx + lineArtW("conveyor", CHAIN[1].h) / 2 + 14;
              const x1 = CHAIN[4].cx - lineArtW("shops", CHAIN[4].h) / 2 - 14;
              const run = (f - nightAt) * PACK.speed - i * PACK.every * PACK.speed;
              if (run < 0) return null;
              const x = x0 + (run % (x1 - x0));
              const edge = Math.min(1, (x - x0) / 40, (x1 - x) / 40);
              return <div key={i} style={{ position: "absolute", left: x - PACK.d / 2, top: PATH_Y - PACK.d / 2, width: PACK.d, height: PACK.d, borderRadius: 6, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${c.ink}`, opacity: night * Math.max(0, edge) }} />;
            })
          : null}
        {CHAIN.slice(1).map((k) => {
          const p = ease(f, W(k.at), m.reveal);
          return p > 0.001 ? (
            <div key={k.name}>
              <Drawing name={k.name} cx={k.cx} floor={FLOOR} h={k.h} style={{ opacity: p, transform: `translateY(${((1 - p) * 16).toFixed(1)}px)` }} />
              <div style={{ position: "absolute", left: k.cx - 150, width: 300, top: LABEL_Y, transform: "translateY(-50%)", textAlign: "center", opacity: p, ...typeStyle("label"), fontSize: 38, fontWeight: 500, color: c.ink }}>{k.word}</div>
            </div>
          ) : null;
        })}

      </Shot>

      {/* E: the app, a camera cut */}
      <Shot from={appAt} to={codeAt} block={BLOCK.SC01}>
        <Card x={APP.x} y={APP.y} w={APP.w} h={APP.h}>
          <div style={{ position: "absolute", left: 0, top: 50, width: APP.w, textAlign: "center", ...typeStyle("title"), fontSize: 48, fontWeight: 600, color: c.ink }}>Saham</div>
          {[0, 1, 2, 3].map((i) => {
            const y = ROWS.top + i * (ROWS.h + ROWS.gap);
            const lit = i === ROWS.lit ? ease(f, litAt, m.pop) : 0;
            return (
              <div key={i} style={{ position: "absolute", left: ROWS.pad, top: y, width: APP.w - 2 * ROWS.pad, height: ROWS.h, borderRadius: 22, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`, opacity: ease(f, appAt + m.sec(0.12) * i, m.reveal) }}>
                <Ring p={lit} tone={c.indigo} />
                <div style={{ position: "absolute", left: 24, top: (ROWS.h - ROWS.disc) / 2, width: ROWS.disc, height: ROWS.disc, borderRadius: 999, background: theme.color.skeleton, opacity: 1 - lit }} />
                <div style={{ position: "absolute", left: 24 + ROWS.disc + 24, top: ROWS.h / 2 - 22, width: 260, height: 16, borderRadius: 8, background: theme.color.skeleton, opacity: 1 - lit }} />
                <div style={{ position: "absolute", left: 24 + ROWS.disc + 24, top: ROWS.h / 2 + 8, width: 170, height: 14, borderRadius: 7, background: theme.color.skeleton, opacity: 1 - lit }} />
                {lit > 0.001 ? (
                  <div style={{ position: "absolute", inset: 0, opacity: lit }}>
                    <IconDisc x={24 + ROWS.disc / 2} y={ROWS.h / 2} d={ROWS.disc} logo="icons/vi02/ICBP.png" />
                    <div style={{ position: "absolute", left: 24 + ROWS.disc + 26, top: ROWS.h / 2, transform: "translateY(-50%)", ...typeStyle("title"), fontSize: 46, fontWeight: 600, letterSpacing: 1, color: c.ink }}>ICBP</div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </Card>
      </Shot>

      {/* F–G: the four letters, their summary, then the fraction they stand for */}
      <Shot from={codeAt} to={1e6} block={BLOCK.SC01} cutOut={false}>
<div style={{ position: "absolute", left: 0, top: mix(CODE.y, TITLE.y, toTitle), width: theme.canvas.width, transform: "translateY(-50%)", textAlign: "center", opacity: ease(f, codeAt, m.reveal), ...typeStyle("title"), fontSize: mix(CODE.size, TITLE.size, toTitle), fontWeight: 600, letterSpacing: mix(8, 3, toTitle), lineHeight: 1, color: c.ink }}>ICBP</div>
        <Appear at={sumAt} out={backAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={SUMMARY.y} w={theme.canvas.width} text="Bukan sekadar empat huruf." size={SUMMARY.size} mark="Bukan sekadar" align="center" weight={500} />
        </Appear>

        {/* the person the piece goes to: a line-art bust in a white rounded tile, as Simon's avatar grid (12 Nov) */}
        {personIn > 0.001 ? <AvatarTile x={PERSON.x} y={PERSON.y + (1 - personIn) * 14} d={PERSON.d} style={{ opacity: personIn }} /> : null}
        {/* the business behind the code: the frame and its chain as they stood at 04:00 */}
        {back > 0.001 ? (() => {
          const k = mix(BACK.k, BACK.k * BACK.small, shrink);
          const fx = mix(CX - (FRAME.w * BACK.k) / 2, BACK.right - FRAME.w * BACK.k * BACK.small, shrink);
          const fy = mix(BACK.top, BACK_MID - (FRAME.h * k) / 2, shrink) + (1 - back) * 20;
          const place = { transformOrigin: `${FRAME.x}px ${FRAME.y}px`, transform: `translate(${(fx - FRAME.x).toFixed(1)}px, ${(fy - FRAME.y).toFixed(1)}px) scale(${k.toFixed(4)})` };
          // the piece: PIECE screen px square at the frame's top-left corner, in the frame's own (unscaled) px
          const s = PIECE / k;
          const cut = f >= cutAt + m.sec(0.15);
          const business = (
            <>
              <div style={{ position: "absolute", left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME_LINE}px ${c.ink}` }} />
              {/* no clock pill here: the piece would cut it in two (Simon 12 Nov: "hilangkan pill jamnya") */}
              <Drawing name="factory" cx={FAC_STEP.cx} floor={FAC_STEP.floor} h={FAC_STEP.h} style={{ opacity: 0.1 }} />
              <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
                {CHAIN.slice(2).map((q, i) => {
                  const a = CHAIN[i + 1];
                  return <line key={q.name} x1={a.cx + lineArtW(a.name, a.h) / 2 + 14} y1={PATH_Y} x2={q.cx - lineArtW(q.name, q.h) / 2 - 14} y2={PATH_Y} stroke={c.ink} strokeWidth={3} strokeDasharray="10 12" strokeLinecap="round" />;
                })}
              </svg>
              {CHAIN.slice(1).map((q) => (
                <div key={q.name}>
                  <Drawing name={q.name} cx={q.cx} floor={FLOOR} h={q.h} />
                  <div style={{ position: "absolute", left: q.cx - 150, width: 300, top: LABEL_Y, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("label"), fontSize: 38, fontWeight: 500, color: c.ink }}>{q.word}</div>
                </div>
              ))}
            </>
          );
          // the frame with its notch and the piece, each a closed outline with every corner rounded (frame px)
          const X0 = FRAME.x;
          const Y0 = FRAME.y;
          const X1 = FRAME.x + FRAME.w;
          const Y1 = FRAME.y + FRAME.h;
          const R = theme.shape.cardRadius;
          const r = CUT_R / k;
          const framePath = `M ${X0 + s + r} ${Y0} H ${X1 - R} A ${R} ${R} 0 0 1 ${X1} ${Y0 + R} V ${Y1 - R} A ${R} ${R} 0 0 1 ${X1 - R} ${Y1} H ${X0 + R} A ${R} ${R} 0 0 1 ${X0} ${Y1 - R} V ${Y0 + s + r} A ${r} ${r} 0 0 1 ${X0 + r} ${Y0 + s} H ${X0 + s - r} A ${r} ${r} 0 0 0 ${X0 + s} ${Y0 + s - r} V ${Y0 + r} A ${r} ${r} 0 0 1 ${X0 + s + r} ${Y0} Z`;
          const piecePath = `M ${X0 + R} ${Y0} H ${X0 + s - r} A ${r} ${r} 0 0 1 ${X0 + s} ${Y0 + r} V ${Y0 + s - r} A ${r} ${r} 0 0 1 ${X0 + s - r} ${Y0 + s} H ${X0 + r} A ${r} ${r} 0 0 1 ${X0} ${Y0 + s - r} V ${Y0 + R} A ${R} ${R} 0 0 1 ${X0 + R} ${Y0} Z`;
          // the border along an outline: twice the frame's line, half of it clipped away, so the line inside matches the frame's
          const outline = (d: string) => (
            <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
              <path d={d} fill="none" stroke={c.ink} strokeWidth={FRAME_LINE * 2} />
            </svg>
          );
          // where the piece flies: from the frame's corner to right beside the person, over an arc
          const from = { x: fx + PIECE / 2, y: fy + PIECE / 2 };
          const to = { x: PERSON.x + PERSON.d / 2 + LAND.gap + PIECE / 2, y: PERSON.y };
          const dx = (to.x - from.x) * fly;
          const dy = (to.y - from.y) * fly - 150 * Math.sin(Math.PI * fly);
          return (
            <>
              <div style={{ position: "absolute", inset: 0, opacity: back, filter: cut ? `drop-shadow(0 8px 18px ${theme.color.skeleton})` : undefined }}>
                <div style={{ position: "absolute", inset: 0, ...place, clipPath: cut ? `path("${framePath}")` : undefined }}>
                  {business}
                  {cut ? outline(framePath) : null}
                </div>
              </div>
              {cut ? (
                <div style={{ position: "absolute", inset: 0, transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`, filter: `drop-shadow(0 6px 12px ${theme.color.skeleton})` }}>
                  <div style={{ position: "absolute", inset: 0, ...place, clipPath: `path("${piecePath}")` }}>
                    {business}
                    {outline(piecePath)}
                  </div>
                </div>
              ) : null}
              <Appear at={cutAt + m.sec(0.15) + m.sec(1)} style={{ left: to.x, top: to.y + PIECE / 2 + LAND.label, transform: "translate(-50%, -50%)" }}>
                <div style={{ ...typeStyle("title"), fontSize: 48, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>1%</div>
              </Appear>
            </>
          );
        })() : null}

      </Shot>
    </Stage>
  );
};

/**
 * SC01's business at work, for other scenes to show again (Simon 12 Nov, SC02 "Tapi bisnisnya tetap bekerja": "pake ilustrasi
 * pabrik bekerja di scene 1"): the frame, the factory faint behind the chain, Produksi · Kardus · Truk · Toko, and the packs
 * running down the path. `f` is the scene's frame; `from` is when the packs set off (earlier than the shot, so it opens running).
 */
export const WorkingBusiness = ({ f, from }: { f: number; from: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  const x0 = CHAIN[1].cx + lineArtW("conveyor", CHAIN[1].h) / 2 + 14;
  const x1 = CHAIN[4].cx - lineArtW("shops", CHAIN[4].h) / 2 - 14;
  return (
    <>
      <div style={{ position: "absolute", left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME_LINE}px ${c.ink}` }} />
      <Drawing name="factory" cx={FAC_STEP.cx} floor={FAC_STEP.floor} h={FAC_STEP.h} style={{ opacity: 0.1 }} />
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
        {CHAIN.slice(2).map((q, i) => {
          const a = CHAIN[i + 1];
          return <line key={q.name} x1={a.cx + lineArtW(a.name, a.h) / 2 + 14} y1={PATH_Y} x2={q.cx - lineArtW(q.name, q.h) / 2 - 14} y2={PATH_Y} stroke={c.ink} strokeWidth={3} strokeDasharray="10 12" strokeLinecap="round" />;
        })}
      </svg>
      {/* the packs, behind the drawings */}
      {Array.from({ length: 12 }, (_, i) => {
        const run = (f - from) * PACK.speed - i * PACK.every * PACK.speed;
        if (run < 0) return null;
        const x = x0 + (run % (x1 - x0));
        const edge = Math.min(1, (x - x0) / 40, (x1 - x) / 40);
        return <div key={i} style={{ position: "absolute", left: x - PACK.d / 2, top: PATH_Y - PACK.d / 2, width: PACK.d, height: PACK.d, borderRadius: 6, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${c.ink}`, opacity: Math.max(0, edge) }} />;
      })}
      {CHAIN.slice(1).map((q) => (
        <div key={q.name}>
          <Drawing name={q.name} cx={q.cx} floor={FLOOR} h={q.h} />
          <div style={{ position: "absolute", left: q.cx - 150, width: 300, top: LABEL_Y, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("label"), fontSize: 38, fontWeight: 500, color: c.ink }}>{q.word}</div>
        </div>
      ))}
    </>
  );
};
