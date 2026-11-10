/**
 * VI01 · SC01 — "Dua Buku Kas", from Simon's VISUAL / TEKS LAYAR notes and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI01-SC01.png. The people and the warung are the black line art of 10 Nov (components/kit).
 *
 *  A  "Jam lima pagi": 05:00 centred, the warung in the middle, Ibu Sari left of it in three poses — checking stock (her
 *     back to us), sweeping, the cash book — with Cek stok · Menyapu · Buku kas (Simon 10 Nov).
 *  B  "Berapa pelanggan…": her book opens as a card over the warung, which stays; its three lines light on their
 *     questions: Customers · Sales · Profit.
 *  C  "Di depan warung": the card closes back into her book; the batik man walks in, "Rp50 juta", Mr. Market. She doesn't
 *     look: he goes pale, she doesn't.
 *  D  "Di tempat lain" (a camera cut): the investor and his phone, the price falling, −3%; his hands can't keep still.
 *  E  "Kenapa…": the two side by side — Ibu Sari with her Business ledger, the investor with nothing but the Market price —
 *     and Simon's two lines under them.
 *  F  "Value investing dimulai…": the price card comes to the middle and turns over into a cash book; Simon's closing line.
 *
 * Ibu Sari and her warung are made up, and so are her book's figures; −3% is the script's own number.
 */
import { useCurrentFrame } from "remotion";
import { GridGround, cutInStyle, cutOutStyle, theme, typeStyle, useMotion, usePalette, useShadow, type Cut } from "../../../core";
import { BLOCK, CUT } from "../data/timing";
import { ART, Card, Figure, IconPill, LedgerCard, Line, OUTSIDE_RESERVES, ease, useWords } from "../components/kit";
import { PriceCandles } from "../components/PriceCandles";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — the morning
/** The drawings 30 % smaller (Simon 10 Nov), the warung centred in the frame. */
const FLOOR = 722;
/** The warung in the middle and staying there (Simon 10 Nov); Ibu Sari on its left. */
const WARUNG = { h: 364, cx: CX };
/**
 * Where she stands for each pose (Simon 10 Nov): checking stock right in front of the warung, over it; sweeping right of it;
 * with her book left of it. Each pose fades out where it stands as the next fades in (no walking, Simon 10 Nov).
 */
const IBU = { h: 336, cx: 650, stock: CX, sweep: 1270, sit: 640 };
/** 05:00 in the frame's top-left corner (Simon 10 Nov). */
const CLOCK = { x: (theme.canvas.width - 1600) / 2 + 34, y: (theme.canvas.height - 700) / 2 + 30 };
/** Sitting (Simon 10 Nov: facing left, ignoring him): drawn at the same scale as the standing book pose, which it came after. */
const SIT_K = 944 / 1414;
/**
 * Her poses, each from its word (the first from the start). `k` scales each drawing so her BODY is the same height in all
 * three: the raised arm and the broom make the first two drawings taller than she is.
 */
const POSES = [
  { name: "ibu-sari-stok", at: "cek", k: 834 / 771 },
  { name: "ibu-sari-sapu", at: "menyapu", k: 782 / 740 },
  { name: "ibu-sari", at: "buku kas", k: 1 },
  { name: "ibu-sari-duduk", at: "bahkan", k: SIT_K },
] as const;
/**
 * One rounded rectangle while the story is told (Simon 10 Nov: "overlap dengan ilustrasi aja dulu"), 1600 × 700 in the middle
 * of the frame (x 160 → 1760, y 190 → 890): clear of the logo zone and the subtitle band. Everything of the story sits inside it.
 */
/** White, with a 3 px black border (Simon 10 Nov). */
const FRAME = { w: 1600, h: 700, x: (theme.canvas.width - 1600) / 2, y: (theme.canvas.height - 700) / 2, line: 3 };
/**
 * A small label over the frame's top-left corner: an indigo dot and "hanya ilustrasi" (Simon 10 Nov, his words and case —
 * an exception he asked for to the no-"Ilustrasi" rule, like IN04 SC03's).
 */
const TAG = { dot: 14, gap: 12, size: 26, above: 14 };
const CHORES = [
  { icon: "package", text: "Cek stok", at: "cek" },
  { icon: "broom", text: "Menyapu", at: "menyapu" },
  { icon: "book-open", text: "Buku kas", at: "buku kas" },
] as const;
/** The chores as plain text under the drawing, one at a time, each on its word (Simon 10 Nov: no pills). */
const CHORE = { y: 800, size: 44 };

// B — the book, open
/** 30 % smaller than first built and narrower, at the frame's right with a 50 px gap (Simon 10 Nov): 470 × 392. */
const LEDGER = { k: 0.7, w: 470, h: 392, x: 1760 - 50 - 470, y: 344 };
const ASK = ["pelanggan", "penjualannya", "benar-benar"] as const;
/** Where the card closes into: the book in her hands (fractions of her drawing). */
const BOOK_IN_HAND = { fx: 0.74, fy: 0.21 };

// C — the man at the door
/** Mr. Market flipped to face her (Simon 10 Nov), standing right of the warung. */
const MARKET = { h: 350, cx: 1300, from: 2240, exit: 700 };
/** His offer as a plain pill right above his head (Simon 10 Nov: not a bubble), its text small and the pill sized by it. */
const SAYS = { gap: 18, size: 32 };
const NAME = { y: 740 };

// D — somewhere else
const INVESTOR = { h: 406, cx: 680 };
/** 40 px shorter than first built (Simon 10 Nov). */
const PHONE = { x: 1010, y: 240, w: 500, h: 600, r: 64 };

// E — side by side
const SPLIT = { floor: 680, h: 308, divTop: 230, divBottom: 870, lineY: 832 };
/** Left half: Ibu Sari and her warung come back together on "Kenapa…" (Simon 10 Nov); her Business ledger card overlaps the warung. */
const LEFT = { ibu: 290, warung: 545, card: { x: 470, y: 300, w: 440, h: 340 } };
/** The warung at the same size against her as in the opening. */
const WARUNG_E = { h: Math.round(308 * (364 / 336)) };
const RIGHT = { inv: 1140, card: { x: 1290, y: 300, w: 440, h: 340 } };
const MINI = 0.62;

// F — turned over
const MIDDLE = { x: CX - 300, y: 200, w: 600, h: 420 };
const CLOSING = { y: 770, size: 58 };

type Rect = { x: number; y: number; w: number; h: number };
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t) });

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(1, BLOCK.SC01);
  /**
   * A pose or a chore word giving way to the next: the old one fades OUT, then the new one fades IN, on its word — 0.35 s
   * each way (Simon 10 Nov: the 0.75 s version "keliatan kelamaan", back to this one).
   */
  const SWAP = m.sec(0.7);
  const poseOn = (i: number) => (i === 0 ? 1 : ease(f, W(POSES[i].at), SWAP / 2)) * (i < POSES.length - 1 ? 1 - ease(f, W(POSES[i + 1].at) - SWAP / 2, SWAP / 2) : 1);

  // the cut to the investor, inside the scene
  const away: Cut = { at: W("Di tempat lain"), axis: "x", ...CUT };
  // the cut's outgoing half ends ON the cut and the incoming half starts there: never both at once
  const world = f < away.at;

  // A
  const clockP = ease(f, W("Jam"), m.reveal);
  const warungIn = ease(f, W("pagi"), m.reveal);
  const ibuIn = ease(f, W("Ibu Sari"), m.reveal);
  const toB = ease(f, W("Berapa") - m.move / 2, m.move);
  const choresOut = 1 - ease(f, W("Berapa") - m.fade, m.fade);

  // B
  const ledgerIn = ease(f, W("Berapa") - m.reveal / 2, m.reveal);
  const lit = ASK.map((word, i) => ease(f, W(word), m.pop) * (i < ASK.length - 1 ? 1 - ease(f, W(ASK[i + 1]), m.pop) : 1 - ease(f, W("Di depan"), m.fade)));
  const close = ease(f, W("Di depan"), m.move);

  // C
  const walk = ease(f, W("pria"), m.sec(1.1));
  const saysP = ease(f, W("beli"), m.pop);
  const nameP = ease(f, W("Mr. Market"), m.reveal);
  /** "Ibu Sari bahkan nggak langsung melihatnya": he slides out to the right, offer and name with him, and the frame masks him (Simon 10 Nov). */
  const ignored = ease(f, W("bahkan"), m.sec(1));

  // D
  // the camera cut IS his entrance: he is there, whole, from its first incoming frame
  const invIn = f >= away.at ? 1 : 0;
  const phoneIn = ease(f, W("investor") - m.reveal / 2, m.reveal);
  const draw = ease(f, W("melihat"), W("3%") - W("melihat"));
  const minus = ease(f, W("3%"), m.pop);
  const fidget = ease(f, W("Tangannya"), m.fade) * (1 - ease(f, W("Kenapa"), m.fade)) + ease(f, W("panik"), m.fade) * (1 - ease(f, W("ketika"), m.move));
  const shake = Math.sin(f * 0.9) * 1.6 * fidget;

  // E
  const toE = ease(f, W("Kenapa"), m.move);
  const ibuBack = ease(f, W("Kenapa"), m.move);
  const divider = ease(f, W("Kenapa") + m.move / 2, m.reveal);
  const bookP = ease(f, W("Karena"), m.reveal);
  const leftLine = ease(f, W("tahu"), m.reveal);
  const priceLit = ease(f, W("Sementara", 1), m.pop);
  const rightLine = ease(f, W("hanya"), m.reveal);

  // F
  const toF = ease(f, W("Value"), m.move);
  const turn = ease(f, W("mengembalikan"), m.move);
  const closing = ease(f, W("dimulai"), m.reveal);

  // the phone becomes the right-hand price card, then the card in the middle
  const priceRect = lerpRect(lerpRect(PHONE, RIGHT.card, toE), MIDDLE, toF);
  const priceScale = mix(mix(1, MINI, toE), 0.68, toF);
  // the turn: the price face narrows to nothing, the ledger face opens from nothing
  const faceK = Math.abs(Math.cos(turn * Math.PI));
  const ledgerFace = turn >= 0.5;

  const ibuA = ART["ibu-sari"];
  const ibuX = IBU.cx;
  const bookAt = { x: ibuX - (IBU.h * ibuA.w) / ibuA.h / 2 + BOOK_IN_HAND.fx * ((IBU.h * ibuA.w) / ibuA.h), y: FLOOR - IBU.h + BOOK_IN_HAND.fy * IBU.h };
  const ledgerK = mix(1, 0.06, close);

  const frameP = ease(f, W("Jam"), m.reveal) * (1 - toF);

  return (
    <>
      {/* the ground: a grid drifting slowly (core GridGround, one cell per 6 s), kept out of the subtitle band and the logo
          zone; no vignette, because the white frame covers its middle (Simon 10 Nov) */}
      <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f} vignette={false} paper="transparent" />
      </div>
      {/* the frame, white, at the very back of the scene's own layers */}
      {frameP > 0.001 ? <div style={{ position: "absolute", left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}`, opacity: frameP }} /> : null}
      {frameP > 0.001 ? (
        <div style={{ position: "absolute", left: FRAME.x + 6, top: FRAME.y - TAG.above, transform: "translateY(-100%)", display: "flex", alignItems: "center", gap: TAG.gap, opacity: frameP }}>
          <div style={{ width: TAG.dot, height: TAG.dot, borderRadius: 999, background: c.indigo, flex: "none" }} />
          <div style={{ ...typeStyle("label"), fontSize: TAG.size, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>hanya ilustrasi</div>
        </div>
      ) : null}
      {/* A–C: the warung's world, cut away to the investor */}
      {world ? (
        <div style={{ position: "absolute", inset: 0, ...(f >= away.at - away.over / 2 ? cutOutStyle(f, away) : {}) }}>
          {clockP > 0.001 ? (
            <div style={{ position: "absolute", left: CLOCK.x, top: CLOCK.y, opacity: clockP * (1 - toB), transform: `translateY(${((1 - clockP) * 14).toFixed(1)}px)` }}>
              <IconPill x={0} y={0} icon="clock" text="05:00" size={40} style={{ position: "relative" }} />
            </div>
          ) : null}
          {warungIn > 0.001 ? <Figure name="warung" cx={WARUNG.cx} floor={FLOOR} h={WARUNG.h} style={{ opacity: warungIn, transform: `translateY(${((1 - warungIn) * 18).toFixed(1)}px)` }} /> : null}
          {/* her three poses: checking stock (her back to us), sweeping, then the book she keeps */}
          {ibuIn > 0.001
            ? POSES.map((pose, i) => {
                const on = poseOn(i);
                const x = [IBU.stock, IBU.sweep, IBU.cx, IBU.sit][i];
                return on > 0.001 ? <Figure key={pose.name} name={pose.name} cx={x} floor={FLOOR} h={IBU.h * pose.k} style={{ opacity: ibuIn * on, transform: `translateY(${((1 - ibuIn) * 18).toFixed(1)}px)` }} /> : null;
              })
            : null}
          {CHORES.map((ch, i) => {
            const p = ease(f, W(ch.at), SWAP / 2) * (i < CHORES.length - 1 ? 1 - ease(f, W(CHORES[i + 1].at) - SWAP / 2, SWAP / 2) : choresOut);
            return p > 0.001 ? (
              <div key={ch.text} style={{ position: "absolute", left: 0, width: theme.canvas.width, top: CHORE.y, transform: "translateY(-50%)", textAlign: "center", opacity: p, ...typeStyle("label"), fontSize: CHORE.size, fontWeight: 500, color: c.ink }}>{ch.text}</div>
            ) : null;
          })}

          {/* B: the book as a card, closing back into her hands on C */}
          {ledgerIn > 0.001 && close < 0.999 ? (
            <div style={{ position: "absolute", left: mix(LEDGER.x, bookAt.x - LEDGER.w / 2, close), top: mix(LEDGER.y, bookAt.y - LEDGER.h / 2, close), width: LEDGER.w, height: LEDGER.h, opacity: ledgerIn * (1 - ease(f, W("Di depan") + m.move * 0.6, m.move * 0.4)), transform: `scale(${(ledgerK * (0.96 + 0.04 * ledgerIn)).toFixed(4)})` }}>
              <Card x={0} y={0} w={LEDGER.w} h={LEDGER.h}>
                <LedgerCard title="Buku kas" lit={lit} s={LEDGER.k} />
              </Card>
            </div>
          ) : null}

          {/* C: Mr. Market */}
          {/* he, his offer and his name, masked by the frame: he walks in from its right edge and leaves through it */}
          {walk > 0.001 && ignored < 0.999 ? (
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(${FRAME.y}px ${theme.canvas.width - FRAME.x - FRAME.w}px ${theme.canvas.height - FRAME.y - FRAME.h}px ${FRAME.x}px round ${theme.shape.cardRadius}px)` }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(ignored * MARKET.exit).toFixed(1)}px)` }}>
          <Figure name="mr-market" cx={mix(MARKET.from, MARKET.cx, walk)} floor={FLOOR} h={MARKET.h} flip />
          {saysP > 0.001 ? (
            <div style={{ position: "absolute", left: MARKET.cx, top: FLOOR - MARKET.h - SAYS.gap, transform: `translate(-50%, calc(-100% + ${((1 - saysP) * 12).toFixed(1)}px))`, opacity: saysP, padding: "10px 28px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: SAYS.size, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Rp50 juta</div>
          ) : null}
          {nameP > 0.001 ? (
            <div style={{ position: "absolute", left: MARKET.cx, top: NAME.y, transform: `translate(-50%, ${((1 - nameP) * 12).toFixed(1)}px)`, opacity: nameP, padding: "10px 32px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>Mr. Market</div>
          ) : null}
          </div>
          </div>
          ) : null}
        </div>
      ) : null}

      {/* D–F: the investor, then the two of them side by side */}
      {!world ? (
        <div style={{ position: "absolute", inset: 0, ...(f < away.at + away.over / 2 ? cutInStyle(f, away) : {}) }}>
          {/* Ibu Sari, back on the left for E */}
          {ibuBack > 0.001 ? <Figure name="warung" cx={mix(-560, LEFT.warung, ibuBack)} floor={SPLIT.floor} h={WARUNG_E.h} style={{ opacity: 1 - toF }} /> : null}
          {ibuBack > 0.001 ? <Figure name="ibu-sari" cx={mix(-300, LEFT.ibu, ibuBack)} floor={SPLIT.floor} h={SPLIT.h} style={{ opacity: 1 - toF }} /> : null}
          {divider > 0.001 && toF < 0.999 ? <div style={{ position: "absolute", left: CX - 1, top: mix((SPLIT.divTop + SPLIT.divBottom) / 2, SPLIT.divTop, divider), width: 2, height: (SPLIT.divBottom - SPLIT.divTop) * divider, borderRadius: 1, background: theme.color.skeleton, opacity: 1 - toF }} /> : null}

          {/* the investor */}
          {invIn > 0.001 && toF < 0.999 ? (
            <Figure name="investor-panik" cx={mix(INVESTOR.cx, RIGHT.inv, toE) + shake * 2} floor={mix(FLOOR, SPLIT.floor, toE)} h={mix(INVESTOR.h, SPLIT.h, toE)} style={{ opacity: invIn * (1 - toF), transform: `rotate(${shake.toFixed(2)}deg)`, transformOrigin: "50% 100%" }} />
          ) : null}

          {/* the phone → the Market price card → the card in the middle, turned over into a cash book */}
          {phoneIn > 0.001 ? (
            <div style={{ position: "absolute", left: priceRect.x, top: priceRect.y, width: priceRect.w, height: priceRect.h, opacity: phoneIn, transform: `scaleX(${faceK.toFixed(4)})` }}>
              <Card x={0} y={0} w={priceRect.w} h={priceRect.h} style={{ borderRadius: mix(PHONE.r, theme.shape.cardRadius, toE), boxShadow: priceLit * (1 - toF) > 0.001 ? shadow.glow : shadow.soft }}>
                {ledgerFace ? (
                  <LedgerCard title="Buku kas" s={priceScale} />
                ) : (
                  <PriceCandles title={toE > 0.5 ? "Market price" : "Saham"} w={priceRect.w} h={priceRect.h} s={priceScale} draw={draw} change={minus} />
                )}
              </Card>
            </div>
          ) : null}

          {/* E: her book, and the two lines */}
          {bookP > 0.001 && toF < 0.999 ? (
            <div style={{ position: "absolute", left: LEFT.card.x, top: LEFT.card.y, width: LEFT.card.w, height: LEFT.card.h, opacity: bookP * (1 - toF), transform: `translateY(${((1 - bookP) * 16).toFixed(1)}px)` }}>
              <Card x={0} y={0} w={LEFT.card.w} h={LEFT.card.h} style={{ boxShadow: shadow.glow }}>
                <LedgerCard title="Business ledger" s={MINI} />
              </Card>
            </div>
          ) : null}
          {leftLine > 0.001 && toF < 0.999 ? <div style={{ opacity: leftLine * (1 - toF) }}><Line x={FRAME.x} y={SPLIT.lineY} w={CX - FRAME.x} text="Dia tahu buku kas bisnisnya." size={44} align="center" weight={500} /></div> : null}
          {rightLine > 0.001 && toF < 0.999 ? <div style={{ opacity: rightLine * (1 - toF) }}><Line x={CX} y={SPLIT.lineY} w={FRAME.x + FRAME.w - CX} text="Dia hanya tahu harga sahamnya." size={44} align="center" weight={500} /></div> : null}

          {/* F: the closing line */}
          {closing > 0.001 ? <div style={{ opacity: closing, transform: `translateY(${((1 - closing) * 16).toFixed(1)}px)` }}><Line x={0} y={CLOSING.y} w={theme.canvas.width} text="Value Investing = melihat saham sebagai bisnis." size={CLOSING.size} mark="Value Investing" align="center" weight={500} /></div> : null}
        </div>
      ) : null}
    </>
  );
};
