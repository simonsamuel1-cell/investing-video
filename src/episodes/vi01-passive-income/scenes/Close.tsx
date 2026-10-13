/**
 * PENUTUP — SC16 · SC17 · SC18.
 *
 * Not running from work: keep the life, and set part of today aside for later;
 * the three things that grow together, the two pillars, and the question to ask
 * every payday; then the two lines the video is about, and the closing card —
 * TA09's quote card on the grid, the Tuntun mark over it, the worker beside it.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { GridGround, Stage, TuntunMark, quoteListY, theme, useMotion, usePalette, useShadow } from "../../../core";
import { BG_FADE, BLOCK, HANDOFF_FADE, SC16 as B16, SC17 as B17, SC18 as B18, SC19 as B19, local } from "../data/timing";
import { BAL, BigBalance, PayCoin, rp, swellAt } from "./PartOne";
import { QuizStatement, quizLabelStyle } from "./ColdOpen";
import { Cutout, DashBox, GlitchSwap, dashOpenAt, ease, WordLine, QuoteFrame, OUTSIDE_RESERVES, Say, TypeBox, useLife } from "../components/kit";

// ═══ SC16 — not running from work: keep the life ════════════════════════
/**
 * Everyone stands on one floor line at one scale (so the seated worker is smaller than the standing men, as
 * he would be). `ink` is each picture's opaque extent in its own pixels; `place` puts that extent's
 * centre on `cx` and its bottom on the floor.
 */
type Pic = { src: string; w: number; h: number; ink: { x0: number; x1: number; y0: number; y1: number } };
const PICS = {
  resign: { src: "art/vi01/orang-resign.png", w: 1086, h: 1448, ink: { x0: 269, x1: 898, y0: 11, y1: 1426 } },
  kerja: { src: "art/vi01/orang-kerja.png", w: 1448, h: 1086, ink: { x0: 127, x1: 1335, y0: 18, y1: 1069 } },
  family: { src: "art/vi01/berkeluarga.png", w: 1024, h: 1536, ink: { x0: 165, x1: 854, y0: 14, y1: 1511 } },
  healing: { src: "art/vi01/healing.png", w: 1024, h: 1536, ink: { x0: 70, x1: 1007, y0: 114, y1: 1469 } },
} satisfies Record<string, Pic>;
const S16 = { floor: 850, k: 0.5, gap: 70, boxH: 120, boxW: 1500, boxFoot: 60, size: 38, resignSecs: 0.6 };
const place = (p: Pic, cx: number) => ({
  src: p.src,
  aspect: p.w / p.h,
  x: cx + (p.w / 2 - (p.ink.x0 + p.ink.x1) / 2) * S16.k,
  y: S16.floor + (p.h - p.ink.y1) * S16.k,
  h: p.h * S16.k,
  floorAt: p.ink.y1 / p.h,
  half: ((p.ink.x1 - p.ink.x0) * S16.k) / 2,
});
/**
 * "LiatHP.png, UI Account balance, UI Total invested": the person looking at his phone, centred left to right,
 * and under him the two cards side by side — also centred, with the gap Simon approved between them for the
 * coin. The coin leaves from the middle of the first card and lands on the middle of the second.
 */
const P2 = { edge: 2, foot: 0.28, coinGap: 180, bottom: 52, from: 50_000_000, to: 30_000_000, sendSecs: 1.0, landSecs: 0.8 };
const PHONE = { src: "art/vi01/liat-hp.png", w: 1086, h: 1448, ink: { x0: 57, x1: 1022, y0: 39, y1: 1448 } };
/** "height si LiatHP mentok dari atas ke bawah (masih di dalam batas margin)": the picture runs from the top margin to the bottom one, the cards laid over its lower part. */
const PHONE_K = (theme.canvas.height - theme.margin.top - theme.margin.bottom - 2 * P2.edge) / (PHONE.ink.y1 - PHONE.ink.y0);
const PHONE_FEET = theme.canvas.height - theme.margin.bottom - P2.edge;
/** The picture's visible height on screen. */
const PHONE_H = (PHONE.ink.y1 - PHONE.ink.y0) * PHONE_K;
const CARD_Y = theme.captionBand.top - P2.bottom - BAL.h;
const PAIR_LEFT = (theme.canvas.width - (BAL.w + P2.coinGap + BAL.w)) / 2;
const ACC_X = PAIR_LEFT + BAL.w / 2;
const INV_X = ACC_X + BAL.w + P2.coinGap;
const SAY16 = ["Membangun passive income bukan berarti lari dari pekerjaan", "Kita tetap bisa bangun karier, urus keluarga, dan menikmati hidup sekarang."];

export const SC16 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC16);
  const centre = theme.canvas.width / 2;
  const resign = place(PICS.resign, centre);
  const kerja = place(PICS.kerja, centre);
  /* the two scenes either side stand clear of the widest picture in the middle */
  const reach = Math.max(resign.half, kerja.half) + S16.gap;
  const family = place(PICS.family, centre - reach - (((PICS.family.ink.x1 - PICS.family.ink.x0) * S16.k) / 2));
  const healing = place(PICS.healing, centre + reach + (((PICS.healing.ink.x1 - PICS.healing.ink.x0) * S16.k) / 2));
  const grid = ease(f, 0, BG_FADE);
  /* the dashed box over the feet: its words typed, then swapped for the next line */
  const at = L(B16.box);
  const typeAt = dashOpenAt(at, m);
  const swap = L(B16.swap);
  const t1 = Math.max(0, Math.min(Math.floor(f - typeAt), SAY16[0].length));
  const t2 = Math.max(0, Math.min(Math.floor(f - (swap + m.sec(0.25))), SAY16[1].length));
  const gone1 = ease(f, swap, m.fade);
  const boxY = S16.floor - S16.boxFoot;
  /* 16733: the three pictures and the box fade out; the grid stays, and the phone scene fades in */
  const out = ease(f, L(B16.out), m.fade);
  const inn = ease(f, L(B16.phone), m.fade);
  const send = L(B16.send);
  const fly = m.sec(P2.sendSecs);
  const sent = ease(f, send, fly);
  const landed = ease(f, send + fly, m.sec(P2.landSecs));
  const account = P2.from + (P2.to - P2.from) * sent;
  const invested = (P2.from - P2.to) * landed;
  const swellA = swellAt(f, send, m);
  const swellI = swellAt(f, send + fly, m);
  const word = (text: string, shown: number, opacity: number, key: string) => (
    <div key={key} style={{ position: "absolute", left: 0, top: 0, width: S16.boxW, height: S16.boxH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: S16.size, fontWeight: 600, color: c.ink, whiteSpace: "pre", opacity }}>
      {text.slice(0, shown)}
    </div>
  );
  return (
    <Stage>
      {/* "fade in background kotak kotak" */}
      <div style={{ position: "absolute", inset: 0, opacity: grid, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f + BLOCK.SC16} paper={c.bg} />
      </div>
      {/* 17288: the grid stays; everything else gives way over the first frames of SC17, which this scene is held under */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - ease(f, L(BLOCK.SC17), HANDOFF_FADE) }}>
      {out < 0.999 ? (
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {/* Berkeluarga on the left, Healing on the right */}
      <Cutout src={family.src} aspect={family.aspect} x={family.x} y={family.y} h={family.h} at={L(B16.family)} shadow floor={family.floorAt} />
      <Cutout src={healing.src} aspect={healing.aspect} x={healing.x} y={healing.y} h={healing.h} at={L(B16.healing)} shadow floor={healing.floorAt} />
      {/* Orang Resign, then — at the swap — a fade over to Orang Kerja */}
      <Cutout src={resign.src} aspect={resign.aspect} x={resign.x} y={resign.y} h={resign.h} at={L(B16.resign)} out={swap} shadow floor={resign.floorAt} />
      <Cutout src={kerja.src} aspect={kerja.aspect} x={kerja.x} y={kerja.y} h={kerja.h} at={swap} rise={0} shadow floor={kerja.floorAt} />
      {/* the dashed box, over their feet */}
      <DashBox cx={centre} y={boxY - S16.boxH / 2} w={S16.boxW} h={S16.boxH} at={at}>
        {word(SAY16[0], t1, 1 - gone1, "a")}
        {word(SAY16[1], t2, ease(f, swap + m.sec(0.25), m.fade), "b")}
      </DashBox>
      </div>
      ) : null}
      {/* LiatHP.png, then the two cards: Account balance counts down as the coin goes to Total invested */}
      {inn > 0.001 ? (
        <>
          {/* "LiatHP kasih gradient blur di bagian bawahnya": the foot of the picture fades out, as Lo Kheng Hong's does */}
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(to bottom, black ${PHONE_FEET - P2.foot * PHONE_H}px, transparent ${PHONE_FEET}px)`, maskImage: `linear-gradient(to bottom, black ${PHONE_FEET - P2.foot * PHONE_H}px, transparent ${PHONE_FEET}px)` }}>
            <Cutout src={PHONE.src} aspect={PHONE.w / PHONE.h} x={theme.canvas.width / 2 + (PHONE.w / 2 - (PHONE.ink.x0 + PHONE.ink.x1) / 2) * PHONE_K} y={PHONE_FEET + (PHONE.h - PHONE.ink.y1) * PHONE_K} h={PHONE.h * PHONE_K} at={L(B16.phone)} rise={0} />
          </div>
          {/* the coin: over the person, but out from behind the first card and in behind the second */}
          <PayCoin from={{ x: ACC_X, y: CARD_Y + BAL.h / 2 }} to={{ x: INV_X, y: CARD_Y + BAL.h / 2 }} at={send} out={send + fly + m.sec(P2.landSecs)} />
          <BigBalance x={ACC_X} y={CARD_Y} label="ACCOUNT BALANCE:" amount={rp(account)} life={inn} swell={swellA} tri={0} />
          <BigBalance x={INV_X} y={CARD_Y} label="TOTAL INVESTED:" amount={rp(invested)} life={inn} swell={swellI} tri={ease(f, send + fly, m.reveal)} />
        </>
      ) : null}
      </div>
    </Stage>
  );
};

// ═══ SC17 — growing together; the question to ask every payday ═══════════
/** `label` is each row's words at the start, `grown` its words once its bar has grown. */
const GROW_BARS: { label: string; grown: string; tone: "indigo" | "cyan"; from: number; to: number }[] = [
  { label: "Kemampuan: staff entry level", grown: "Kemampuan: manager", tone: "indigo", from: 130, to: 330 },
  { label: "Income: Rp 5,000,000", grown: "Income: Rp 15,000,000", tone: "indigo", from: 150, to: 380 },
  { label: "Aset: Rp 2,000,000", grown: "Aset: Rp 10,000,000", tone: "cyan", from: 50, to: 300 },
];
/**
 * The three bars as progress-bar UI, after Simon's second picture: one white card, each row a label over a
 * track of fine ticks, a gradient fill running to the right with a handle at its end. The lengths are the
 * old bars' heights (130/150/50 growing to 330/380/300 of 400) — sizes, not figures; none is labelled.
 */
/** The box under the progress card: it starts 30 px below the card's foot and runs one line, margin to margin at most. */
const BOX17: { text: string; mark: string; w: number; h: number; size: number; below: number; y: number } = {
  y: 0,
  text: "Perlahan jadi punya lebih dari satu sumber kekuatan finansial dan punya banyak pilihan",
  /** Simon wrote "ebih dari satu sumber kekuatan finansial"; the whole word is meant. */
  mark: "lebih dari satu sumber kekuatan finansial",
  w: 1640,
  h: 130,
  size: 34,
  below: 30,
};
const PROG_W = 900;
const PROG_SCALE = 0.8;
const PROG_ROWS = { pad: 48, row: 176, label: 38, bar: 56, gap: 34 };
/** The card's own height, before the 80%. */
const PROG_H = 2 * PROG_ROWS.pad + 2 * PROG_ROWS.row + PROG_ROWS.label + PROG_ROWS.gap + PROG_ROWS.bar;
/** "UI nya buat tengah vertikal juga": the scaled card sits at the middle of the canvas, top to bottom; the title is 50 px above it. */
const PROG = { ...PROG_ROWS, x: (theme.canvas.width - PROG_W) / 2, y: theme.canvas.height / 2 - (PROG_H * PROG_SCALE) / 2, w: PROG_W, scale: PROG_SCALE, titleSize: 36, tick: 8, ticks: 48, knob: 20, full: 400, growSecs: 0.7, titleGap: 50 };
BOX17.y = PROG.y + PROG_H * PROG.scale + BOX17.below;
export const SC17 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC17);
  const clear = L(B17.tanya) - 10;
  const shadow = useShadow();
  const first = useLife(L(B17.title), clear);
  const card = ease(f, L(B17.card), m.reveal);
  const ink = (t: "indigo" | "cyan") => (t === "indigo" ? c.indigo : theme.color.cyanInk);
  return (
    <Stage transparent={f < HANDOFF_FADE}>
      {/* the grid carries on from SC16 (same global frame, so the same drift); for the first frames SC16's own is still under us */}
      {f >= HANDOFF_FADE ? (
        <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
          <GridGround f={f + BLOCK.SC17} paper={c.bg} />
        </div>
      ) : null}
      {/* 18501: the grid stays; everything here gives way over the first frames of SC18, which this scene is held under */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - ease(f, L(BLOCK.SC18), HANDOFF_FADE) }}>
      {first > 0.001 ? (
        <div style={{ opacity: first }}>
          <Say text="Di awal, aset kita mungkin masih kecil" x={theme.canvas.width / 2} y={PROG.y - PROG.titleGap} at={L(B17.title)} size={PROG.titleSize} weight={800} color={c.indigo} />
          {/* "UI progress barnya kecilin sizenya 20%. UI nya taro tengah": 80%, hung from its top edge, centred */}
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${theme.canvas.width / 2}px ${PROG.y}px`, transform: `scale(${PROG.scale})` }}>
          <div style={{ position: "absolute", left: PROG.x, top: PROG.y, width: PROG.w, height: 2 * PROG.pad + 2 * PROG.row + PROG.label + PROG.gap + PROG.bar, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, opacity: card }} />
          {GROW_BARS.map((b, i) => {
            const grown = b.from + (b.to - b.from) * ease(f, L(B17.grow[i]), m.sec(PROG.growSecs));
            const swapped = ease(f, L(B17.grow[i]), m.fade);
            const p = grown / PROG.full;
            const inner = PROG.w - 2 * PROG.pad;
            const rowTop = PROG.y + PROG.pad + i * PROG.row;
            const barTop = rowTop + PROG.label + PROG.gap;
            const fillW = Math.max(PROG.bar, inner * p);
            const tone = ink(b.tone);
            const from = b.tone === "indigo" ? c.indigoSoft : theme.color.hlCyan;
            return (
              <div key={b.label}>
                {/* the row's words: as they are, then — as its bar grows — as they become */}
                {[b.label, b.grown].map((text, k) => (
                  <div key={text} style={{ position: "absolute", left: PROG.x + PROG.pad, top: rowTop, fontFamily: theme.text.family, fontSize: PROG.label, fontWeight: 700, color: tone, lineHeight: 1, whiteSpace: "nowrap", opacity: card * (k === 0 ? 1 - swapped : swapped) }}>{text}</div>
                ))}
                {/* the ticks beyond the fill, the fill, and the handle at its end */}
                <div style={{ position: "absolute", left: PROG.x + PROG.pad, top: barTop, width: inner, height: PROG.bar, opacity: card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {Array.from({ length: PROG.ticks }, (_, k) => (
                    <div key={k} style={{ width: PROG.tick, height: PROG.bar, borderRadius: PROG.tick, background: c.border }} />
                  ))}
                </div>
                <div style={{ position: "absolute", left: PROG.x + PROG.pad, top: barTop, width: fillW, height: PROG.bar, borderRadius: 14, background: `linear-gradient(to right, ${from}, ${tone})`, opacity: card }} />
                <div style={{ position: "absolute", left: PROG.x + PROG.pad + fillW + PROG.gap, top: barTop - 14, width: 5, height: PROG.bar + 28, borderRadius: 3, background: tone, opacity: card }}>
                  <div style={{ position: "absolute", left: -(PROG.knob - 5) / 2, top: -PROG.knob / 2, width: PROG.knob, height: PROG.knob, borderRadius: 99, background: tone }} />
                </div>
              </div>
            );
          })}
          </div>
          {/* "Di bawahnya muncul text box" — "lebih dari satu sumber kekuatan finansial" highlighted */}
          <TypeBox cx={theme.canvas.width / 2} y={BOX17.y} w={BOX17.w} h={BOX17.h} at={L(B17.box)} text={BOX17.text} mark={BOX17.mark} size={BOX17.size} />
        </div>
      ) : null}

      {/* "Pakai design text seperti di 3374" — the "Tanya juga" design */}
      <QuizStatement f={f} label="Setiap kali income masuk, tanyakan:" labelAt={L(B17.tanya)} lines={[["Berapa", "yang", "bisa", "aku"], ["sisihkan", "untuk"]]} wordAt={B17.words.map(L)} bar="mulai punya aset?" barAt={L(B17.mark)} />
      </div>
    </Stage>
  );
};

// ═══ SC18 — the two lines, then the closing card ═════════════════════════
/**
 * The opening of SC18: the mascot at the top, OrangTuntun4 on the left — head to belly, his foot fading out —
 * and on his right, in turn, "Kerja" (indigo) over a white rounded box "Tenaga + waktu = Income", then
 * "Investasi" over "Uang + waktu = Passive income".
 */
const MAN18 = { src: "art/vi01/orang-tuntun-4.png", w: 941, h: 1672, ink: { x0: 160, x1: 927, y0: 89 }, belly: 820, top: 250, floor: 850, foot: 0.28, gap: 70, mascotY: 120, mascotH: 130 };
const MAN18_K = (MAN18.floor - MAN18.top) / (MAN18.belly - MAN18.ink.y0);
const MAN18_W = (MAN18.ink.x1 - MAN18.ink.x0) * MAN18_K;
const TEXT18 = { x: theme.margin.left + MAN18_W + MAN18.gap, box: 48, pad: 30, padX: 46, rows: [{ y: 350, label: "Kerja", words: ["Tenaga", "+ waktu", "= Income"] }, { y: 590, label: "Investasi", words: ["Uang", "+ waktu", "= Passive income"] }], boxDy: 56, rise: 22 };
const CARD_RADIUS_18 = theme.shape.cardRadius;
const CARD = { x: (theme.canvas.width - 1180) / 2, y: theme.canvas.height / 2 - 165, w: 1180, h: 330, size: 54, lead: 76 };
const LINES = ["Pelan-pelan berubah", "dari sekedar pekerja"];
const SWAPPED = "jadi pekerja dengan aset";
const CARD_LIST_Y = quoteListY(CARD.y, CARD.h, CARD.lead, LINES.length);

/** The mascot's slow bob, read off the GLOBAL frame so SC18 and SC19 hand it over without a jump. */
const mascotBob = (g: number) => Math.sin(((g - B18.mascot) / MASCOT.bobLoop) * Math.PI * 2) * MASCOT.bob;
const MASCOT = { bob: 10, bobLoop: 240 };

export const SC18 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const L = (g: number) => local(g, BLOCK.SC18);
  /* "Lalu transisi fade ke gambar 2": the first group fades as the card comes up */
  const rulesOut = L(B18.close);
  const closing = ease(f, L(B18.close), m.move);
  const g = f + BLOCK.SC18;
  const gone = ease(f, rulesOut, m.fade);
  /** "Kerja" / "Investasi" come first, their boxes on the words that say what they are. */
  const labelAt = [L(B18.kerja) - 30, L(B18.investasi)];
  const sumAt = B18.sums.map((row) => row.map(L));
  const bob = mascotBob(g);
  return (
    <Stage transparent={f < HANDOFF_FADE}>
      {/* the grid stays from SC17 on: for the first frames SC17's own is still under us */}
      {f >= HANDOFF_FADE ? (
        <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
          <GridGround f={g} paper={c.bg} />
        </div>
      ) : null}
      {/* the mascot, at the top — it stays from first to last, over the closing card too; from SC19's first frame SC19 draws it */}
      <div style={{ opacity: f < L(BLOCK.SC19) ? ease(f, L(B18.mascot), m.reveal) : 0 }}>
        <TuntunMark x={theme.canvas.width / 2} y={MAN18.mascotY + bob} height={MAN18.mascotH} />
      </div>
      {gone < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - gone }}>
          {/* OrangTuntun4, head to belly, on the left */}
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(to bottom, black ${MAN18.floor - MAN18.foot * (MAN18.floor - MAN18.top)}px, transparent ${MAN18.floor}px)`, maskImage: `linear-gradient(to bottom, black ${MAN18.floor - MAN18.foot * (MAN18.floor - MAN18.top)}px, transparent ${MAN18.floor}px)` }}>
            <Cutout src={MAN18.src} aspect={MAN18.w / MAN18.h} x={theme.margin.left + (MAN18.w / 2 - MAN18.ink.x0) * MAN18_K} y={MAN18.floor + (MAN18.h - MAN18.belly) * MAN18_K} h={MAN18.h * MAN18_K} at={L(B18.man)} rise={MAN18.top} riseFrames={m.move} />
          </div>
          {/* the two rules, one after the other, on his right */}
          {TEXT18.rows.map((row, i) => {
            const pBox = ease(f, sumAt[i][0], m.reveal);
            return (
              <div key={row.label}>
                {/* "Kerja dan Investasi; sizenya samain dengan 'Setiap kali income masuk…'" — the quiz label's type, whole */}
                <div style={{ position: "absolute", left: TEXT18.x, top: row.y, opacity: ease(f, labelAt[i], m.reveal), transform: `translateY(${((1 - ease(f, labelAt[i], m.reveal)) * 14).toFixed(2)}px)`, lineHeight: 1, ...quizLabelStyle(c) }}>{row.label}</div>
                {pBox > 0.001 ? (
                  <div style={{ position: "absolute", left: TEXT18.x, top: row.y + TEXT18.boxDy, padding: `${TEXT18.pad}px ${TEXT18.padX}px`, borderRadius: CARD_RADIUS_18, background: c.cardBg, boxShadow: shadow.soft, opacity: pBox, transform: `translateY(${((1 - pBox) * TEXT18.rise).toFixed(2)}px)`, fontFamily: theme.text.family, fontSize: TEXT18.box, fontWeight: 700, color: c.ink, whiteSpace: "nowrap" }}>
                    {/* the words come one after another, the box already as wide as the whole sum */}
                    {row.words.map((word, k) => {
                      const w = ease(f, sumAt[i][k], m.reveal);
                      return (
                        <span key={word} style={{ opacity: w, transform: `translateY(${((1 - w) * 10).toFixed(2)}px)`, display: "inline-block", whiteSpace: "pre" }}>
                          {k > 0 ? " " : ""}
                          {word}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* the closing card on the grid, the mark floating over it */}
      {closing > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: closing * (1 - ease(f, L(BLOCK.SC19), HANDOFF_FADE)) }}>
          <QuoteFrame x={CARD.x} y={CARD.y} w={CARD.w} h={CARD.h} at={L(B18.close) + 12} listY={CARD_LIST_Y} lead={CARD.lead} count={LINES.length}>
            {LINES.map((line, n) => {
              const y = CARD_LIST_Y + CARD.lead * n + CARD.size * 0.62;
              const x = CARD.x + CARD.w / 2;
              /* line 2 turns into "jadi pekerja dengan aset" through a glitch, at 19358 (Studio) */
              return n === 1 && f >= L(B18.swap) ? (
                <GlitchSwap key="swap" from={line} to={SWAPPED} x={x} y={y} at={L(B18.swap)} span={m.sec(0.5)} size={CARD.size} weight={700} />
              ) : (
                <WordLine key={line} text={line} x={x} y={y} at={L(B18.close) + 40 + n * 60} stagger={6} size={CARD.size} weight={700} />
              );
            })}
          </QuoteFrame>
        </div>
      ) : null}
    </Stage>
  );
};

// ═══ SC19 — the added last scene: which asset to build? ══════════════════
/**
 * From the approved storyboard (docs/vi-style/storyboards/VI01-SC19-last-scene.jpg), every beat on a word:
 *  A "Lalu pertanyaannya, aset seperti apa yang bisa kita mulai bangun?" — a question card, its words on
 *    their words, the mascot (carried over from SC18) above it.
 *  B "Di video berikutnya, kita akan bahas berbagai instrumen investasi" — a chip; the card shrinks into the
 *    centre of a mindmap, "Instrumen investasi", and five instruments branch off it.
 *  C "dan lihat mana yang paling cocok untuk tujuanmu" — the map moves left, "Tujuanmu" comes up on the
 *    right, a dashed arrow with a "?" runs to it from each instrument, and the mascot glides over to it.
 * The five instruments are Claude's pick — the script only says "berbagai instrumen investasi".
 */
const Q19 = { w: 1200, h: 320, top: 340, label: 64, size: 60, rise: 16 };
const NODE19 = { w: 340, h: 200, cx: 665, icon: 64, size: 36, text: 260 };
const PILL19 = { x: 1085, w: 340, h: 88, gap: 26, icon: 48, size: 34 };
/** C: the map moves left far enough that the five arrows and their "?" have room; "?" sits 40% along each arrow; arrows land spread over the target's height. */
const MAP19 = { shift: -399, arrow: 4, head: 14, q: 44, qAlong: 0.4, land: 30 };
/** `perch`: the gap between the landed mascot and the card, kept clear of the mascot's bob. */
const TARGET19 = { cx: 1600, w: 300, h: 230, icon: 110, size: 40, perch: 36 };
const CHIP19 = { y: 110, padX: 26, padY: 12 };
const INSTRUMENTS: { label: string; icon: string }[] = [
  { label: "Saham", icon: "icons/vi01/ph-chart-line-up-duotone.svg" },
  { label: "Reksa dana", icon: "icons/vi01/ph-chart-pie-slice-duotone.svg" },
  { label: "Obligasi", icon: "icons/vi01/ph-scroll-duotone.svg" },
  { label: "Emas", icon: "icons/vi01/ph-coins-duotone.svg" },
  { label: "Deposito", icon: "icons/vi01/ph-bank-duotone.svg" },
];
const QUESTION = ["Aset", "seperti", "apa", "yang", "bisa", "kita", "mulai", "bangun?"];
const pillY = (i: number) => theme.canvas.height / 2 - (INSTRUMENTS.length * PILL19.h + (INSTRUMENTS.length - 1) * PILL19.gap) / 2 + i * (PILL19.h + PILL19.gap) + PILL19.h / 2;
const lerp19 = (a: number, b: number, t: number) => a + (b - a) * t;

export const SC19 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const L = (g: number) => local(g, BLOCK.SC19);
  const g = f + BLOCK.SC19;
  const cy = theme.canvas.height / 2;
  /* A → B: the question card shrinks into the mindmap's centre node, on "bahas … instrumen" */
  const card = ease(f, L(B19.lalu), m.reveal);
  const morph = ease(f, L(B19.bahas), L(B19.instrumen) - L(B19.bahas));
  /* B → C: the whole map moves left on "dan" */
  const dx = MAP19.shift * ease(f, L(B19.dan), m.move);
  const box = {
    w: lerp19(Q19.w, NODE19.w, morph),
    h: lerp19(Q19.h, NODE19.h, morph),
    cx: lerp19(theme.canvas.width / 2, NODE19.cx, morph) + dx,
    cy: lerp19(Q19.top + Q19.h / 2, cy, morph),
  };
  const target = ease(f, L(B19.lihat), m.reveal);
  /* the mascot: where SC18 left it, then gliding over to sit above "Tujuanmu" */
  const glide = ease(f, L(B19.mana), L(B19.tujuanmu) - L(B19.mana));
  const from = { x: theme.canvas.width / 2, y: MAN18.mascotY };
  const to = { x: TARGET19.cx, y: cy - TARGET19.h / 2 - MAN18.mascotH - TARGET19.perch };
  const ctrl = { x: (from.x + to.x) / 2 + 160, y: Math.min(from.y, to.y) - 60 };
  const u = 1 - glide;
  const mx = u * u * from.x + 2 * u * glide * ctrl.x + glide * glide * to.x;
  const my = u * u * from.y + 2 * u * glide * ctrl.y + glide * glide * to.y;
  const pillAt = (i: number) => L(B19.instrumen) + m.sec(0.15) * (i + 1);
  const pillLeft = PILL19.x + dx;
  const nodeRight = box.cx + box.w / 2;
  return (
    <Stage transparent={f < HANDOFF_FADE}>
      {/* the grid carries on from SC18 (same global frame, same drift) */}
      {f >= HANDOFF_FADE ? (
        <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
          <GridGround f={g} paper={c.bg} />
        </div>
      ) : null}

      {/* B: "Di video berikutnya" */}
      <div style={{ position: "absolute", left: theme.margin.left, top: CHIP19.y, padding: `${CHIP19.padY}px ${CHIP19.padX}px`, borderRadius: 999, background: theme.color.indigoWash, opacity: ease(f, L(B19.di), m.reveal), transform: `translateY(${((1 - ease(f, L(B19.di), m.reveal)) * 12).toFixed(2)}px)`, ...quizLabelStyle(c) }}>Di video berikutnya</div>

      {/* B: the branches, drawn on just before their pills */}
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {INSTRUMENTS.map((ins, i) => {
          const p = ease(f, pillAt(i) - m.sec(0.2), m.sec(0.3));
          if (p <= 0.001 || morph < 0.999) return null;
          const y = pillY(i);
          const midX = (nodeRight + pillLeft) / 2;
          return <path key={ins.label} d={`M ${nodeRight} ${box.cy} C ${midX} ${box.cy}, ${midX} ${y}, ${pillLeft} ${y}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={c.indigo} strokeWidth={MAP19.arrow} strokeLinecap="round" />;
        })}
        {/* C: a dashed arrow from every instrument to "Tujuanmu" */}
        {INSTRUMENTS.map((ins, i) => {
          const p = ease(f, L(B19.mana) + m.sec(0.12) * i, m.sec(0.4));
          if (p <= 0.001) return null;
          const x0 = pillLeft + PILL19.w + 16;
          const y0 = pillY(i);
          const x1 = TARGET19.cx - TARGET19.w / 2 - 18;
          const y1 = cy + (i - (INSTRUMENTS.length - 1) / 2) * MAP19.land;
          const ex = x0 + (x1 - x0) * p;
          const ey = y0 + (y1 - y0) * p;
          const len = Math.hypot(x1 - x0, y1 - y0);
          const ux = (x1 - x0) / len;
          const uy = (y1 - y0) / len;
          const H = MAP19.head;
          return (
            <g key={`to-${ins.label}`}>
              <line x1={x0} y1={y0} x2={ex - ux * H * 0.6 * p} y2={ey - uy * H * 0.6 * p} stroke={c.indigo} strokeWidth={MAP19.arrow - 1} strokeDasharray="12 10" strokeLinecap="round" />
              {p > 0.95 ? <path d={`M ${x1} ${y1} L ${x1 - ux * H - uy * H * 0.6} ${y1 - uy * H + ux * H * 0.6} L ${x1 - ux * H + uy * H * 0.6} ${y1 - uy * H - ux * H * 0.6} Z`} fill={c.indigo} stroke={c.indigo} strokeWidth={2} strokeLinejoin="round" /> : null}
            </g>
          );
        })}
      </svg>
      {/* C: the "?" on each arrow */}
      {INSTRUMENTS.map((ins, i) => {
        const p = ease(f, L(B19.mana) + m.sec(0.12) * i + m.sec(0.3), m.reveal);
        if (p <= 0.001) return null;
        const x0 = pillLeft + PILL19.w + 16;
        const x1 = TARGET19.cx - TARGET19.w / 2 - 18;
        const y1 = cy + (i - (INSTRUMENTS.length - 1) / 2) * MAP19.land;
        const x = x0 + (x1 - x0) * MAP19.qAlong;
        const y = pillY(i) + (y1 - pillY(i)) * MAP19.qAlong;
        return (
          <div key={`q-${ins.label}`} style={{ position: "absolute", left: x - MAP19.q / 2, top: y - MAP19.q / 2, width: MAP19.q, height: MAP19.q, borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: MAP19.q * 0.6, fontWeight: 800, color: c.indigo, opacity: p, transform: `scale(${(0.7 + 0.3 * p).toFixed(3)})` }}>?</div>
        );
      })}

      {/* B: the five instruments */}
      {INSTRUMENTS.map((ins, i) => {
        const p = ease(f, pillAt(i), m.reveal);
        if (p <= 0.001) return null;
        return (
          <div key={ins.label} style={{ position: "absolute", left: pillLeft, top: pillY(i) - PILL19.h / 2, width: PILL19.w, height: PILL19.h, borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", gap: 18, padding: "0 28px", boxSizing: "border-box", opacity: p, transform: `translateX(${((1 - p) * -20).toFixed(2)}px)`, fontFamily: theme.text.family, fontSize: PILL19.size, fontWeight: 700, color: c.ink }}>
            <Img src={staticFile(ins.icon)} style={{ width: PILL19.icon, height: PILL19.icon }} />
            {ins.label}
          </div>
        );
      })}

      {/* A → B: the question card, becoming the centre node */}
      {card > 0.001 ? (
        <div style={{ position: "absolute", left: box.cx - box.w / 2, top: box.cy - box.h / 2, width: box.w, height: box.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, opacity: card, transform: `translateY(${((1 - card) * Q19.rise).toFixed(2)}px)`, overflow: "hidden" }}>
          {/* the question, word by word on the VO */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, opacity: 1 - Math.min(1, morph * 2.5) }}>
            <div style={{ ...quizLabelStyle(c), lineHeight: 1 }}>Lalu pertanyaannya</div>
            <div style={{ fontFamily: theme.text.family, fontSize: Q19.size, fontWeight: 800, color: c.ink, textAlign: "center", lineHeight: 1.15, maxWidth: Q19.w - 160 }}>
              {QUESTION.map((w, k) => {
                const p = ease(f, L(B19.question[k]), m.reveal);
                return (
                  <span key={k} style={{ display: "inline-block", opacity: p, transform: `translateY(${((1 - p) * 14).toFixed(2)}px)`, whiteSpace: "pre" }}>
                    {w}
                    {k < QUESTION.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </div>
          </div>
          {/* the centre node's own content */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: Math.max(0, morph * 2 - 1) }}>
            <Img src={staticFile("icons/vi01/ph-chart-bar-duotone.svg")} style={{ width: NODE19.icon, height: NODE19.icon }} />
            <div style={{ fontFamily: theme.text.family, fontSize: NODE19.size, fontWeight: 800, color: c.ink, textAlign: "center", lineHeight: 1.15, maxWidth: NODE19.text }}>Instrumen investasi</div>
          </div>
        </div>
      ) : null}

      {/* C: "Tujuanmu" */}
      {target > 0.001 ? (
        <div style={{ position: "absolute", left: TARGET19.cx - TARGET19.w / 2, top: cy - TARGET19.h / 2, width: TARGET19.w, height: TARGET19.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, border: `${theme.shape.rule}px solid ${c.indigo}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: target, transform: `scale(${(0.9 + 0.1 * target).toFixed(3)})` }}>
          <Img src={staticFile("icons/vi01/ph-target-duotone.svg")} style={{ width: TARGET19.icon, height: TARGET19.icon }} />
          {/* the word itself comes on "tujuanmu", as the mascot lands */}
          <div style={{ fontFamily: theme.text.family, fontSize: TARGET19.size, fontWeight: 800, color: c.indigo, opacity: ease(f, L(B19.tujuanmu), m.reveal) }}>Tujuanmu</div>
        </div>
      ) : null}

      {/* the mascot, carried over from SC18, then gliding to "Tujuanmu" */}
      <TuntunMark x={mx} y={my + mascotBob(g)} height={MAN18.mascotH} />
    </Stage>
  );
};
