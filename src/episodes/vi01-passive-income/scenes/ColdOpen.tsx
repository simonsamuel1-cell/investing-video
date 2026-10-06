/**
 * COLD OPEN — SC01 · SC02 · SC03.
 *
 * A worker, a payday, and a flow that stops when he does; then the five ways
 * people add income, all drawing on the same two things; then the 24 hours
 * those two things live in, and the two questions the video is about.
 */
import { useCurrentFrame } from "remotion";
import { GridGround, Stage, price, theme, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK, SC01 as B1, SC02 as B2, SC03 as B3, local } from "../data/timing";
import { Cutout, ease, Icon, Say, TypeBox, useLife, type IconName } from "../components/kit";

// ═══ SC01 — payday, and the flow behind it ═════════════════════════════════
/**
 * A CALENDAR PAGE, MINIMAL — Simon: "Kalender ini harusnya cukup tanggalnya
 * (mulai dari 1 dulu aja), dan bulan Januari", then "buat designnya lebih
 * minimalis". A white page on a soft shadow, the month small in indigo over a
 * hairline, the date large in slate. No band, no rings, no border.
 */
const CAL = { cx: 960, y: 290, w: 440, h: 480, band: 120, rule: 56 };
/** "kasih juga pelan-pelan keseluruhan kalender membesar 15%" — until GAJIAN. */
const CAL_GROW = 0.15;
/**
 * THEN GAJIAN TAKES THE TOP — Simon: "Posisi 'gajian' mulai dari tengah layar
 * (horizontal-vertikal), lalu membesar dan geser ke bagian atas layar.
 * Kalendernya pun dari posisi sekarang, mengecil 30% anchor bawah dan geser ke
 * bawah." The page shrinks about its own bottom edge and that edge drops to
 * `bottom`; the word rises from the frame's centre to sit `gap` above it.
 */
const CAL_SHRINK = 0.3;
const CAL_BOTTOM = CAL.y + CAL.h / 2 + (CAL.h / 2) * (1 + CAL_GROW);
const SPLIT = { gap: 60, word: 160, from: 0.5 };
/**
 * Where they settle: GAJIAN over the page, the PAIR centred on the frame —
 * Simon: "posisi akhir Gajian dan kalender geser naik lagi, buat mereka (as a
 * grup) align-center."
 */
const CAL_H_AFTER = CAL.h * (1 + CAL_GROW) * (1 - CAL_SHRINK);
const GROUP_H = SPLIT.word + SPLIT.gap + CAL_H_AFTER;
const GROUP_BOTTOM = theme.canvas.height / 2 + GROUP_H / 2;
const CAL_DOWN = GROUP_BOTTOM - CAL_BOTTOM;
const WORD_Y = GROUP_BOTTOM - CAL_H_AFTER - SPLIT.gap - SPLIT.word / 2;
/** Motion blur on the rolling dates: px of vertical blur per px/frame of travel, and its ceiling. */
const ROLL_BLUR = { perSpeed: 0.35, max: 22 };
/** "Orang Kerja.png" (INV01 - Passive Income/Gambar), 1312 × 1199. */
const ORANG_KERJA = 1312 / 1199;
/** …whose solid pixels stop at row 1138: the feet, where its contact shadow goes. */
const ORANG_KERJA_FLOOR = 1138 / 1199;
/** The photo's height: it rises from below the frame, centred left to right ("maksudku tengah horizontal"). */
const PHOTO_H = 560;
/** Far enough up that the pair is gone — GAJIAN's top is the highest point. */
const EXIT_RISE = 1000;
/**
 * "Kerja" over the photo, the two as one group moved 200 px left — Simon:
 * "Kelompokkan Kerja dan OrangKerja png, lalu geser 200 px ke kiri (ini bukan
 * animasi, tapi re-positioning)". The label sits `gap` above the photo's top.
 */
/** "Kerja nya font size sama dengan Gajian aja. Bold, Indigo." */
const WORK = { shift: -200, feet: 940, label: SPLIT.word, weight: 700, gap: 110 };
/**
 * …and on their right, the pay landing: a phone holding Simon's balance card,
 * the balance counting Rp 0 → Rp 50.000.000 as it fades in.
 */
/** "Border template hp nya tipisin, jadi 2 px aja"; the UI centred top to bottom on the screen. */
const PHONE = { cx: 1380, top: 180, w: 380, h: 760, bezel: 5, radius: 64, ui: { top: 70, bottom: 468 } };
const BALANCE = 50_000_000;
/** "transparan 40%" — the top row and the history pill, so the balance card leads. */
const PHONE_QUIET = 0.4;
/**
 * "Kelompokkan Kerja, Orang Kerja png, template hp dan isinya, lalu buat tengah
 * horizontal": the photo's left edge to the phone's right edge, centred on the frame.
 */
const GROUP_LEFT = theme.canvas.width / 2 + WORK.shift - (PHOTO_H * ORANG_KERJA) / 2;
const GROUP_RIGHT = PHONE.cx + PHONE.w / 2;
const GROUP_DX = theme.canvas.width / 2 - (GROUP_LEFT + GROUP_RIGHT) / 2;
/**
 * 395 — Simon: "Text Kerja dan orang kerja png nya geser kiri dan fade out.
 * Lalu template hp dan isinya ke tengah horizontal. Lalu muncul 3 icon di kiri
 * 3 icon di kanan". Where the pay goes: each icon on a white disc, left column
 * then right, top to bottom.
 */
const LEAVE_X = 300;
const SPEND = { x: [560, 1360], y: [330, 560, 790], disc: 150, icon: 84 };
/** "kasih garis yang ditarik dari hp ke tiap icon" — from the phone's centre, behind it ("dari belakang hp nya"), drawn out to each disc. */
const SPEND_LINE = { width: 3, drawSec: 0.35 };
const SPEND_ICONS: IconName[][] = [
  ["shirt", "pants", "car"],
  ["basket", "burger", "glass"],
];
/** "Tapi coba bayangin: suatu hari harus berhenti kerja sementara" — two lines at the top of the frame. */
const BAYANGIN = { y: 150, size: 64, weight: 700, gap: 14 };
/** "Layoff.png" (INV01 - Passive Income/Gambar), 1086 × 1448 — the figure stands in columns 378–840, feet on row 1390. */
const LAYOFF = 1086 / 1448;
const LAYOFF_SOLID_CX = (378 + 840) / 2 / 1086;
const LAYOFF_FLOOR = 1390 / 1448;
/**
 * THE CLOSE-UP: "perbesar orangnya hingga yang muncul di preview dari kepala
 * hingga dada" — rows 40 (above the hair) to 580 (the chest) of the 1448-row
 * file fill the frame down to the caption band, the face centred left to right.
 * Both files share one canvas and one scale; each is centred on its own head.
 */
const CLOSE = { top: 40, chest: 580, rows: 1448 };
/**
 * …and it moves down as it grows — "skalian geser ke bawah, biar ga overlap
 * sama text di atas": the head starts 20 px under the two-line text.
 */
const CLOSE_FROM = BAYANGIN.y + BAYANGIN.size * 1.1 * 2 + BAYANGIN.gap + 20;
const CLOSE_H = ((theme.captionBand.top - CLOSE_FROM) * CLOSE.rows) / (CLOSE.chest - CLOSE.top);
const CLOSE_TOP = CLOSE_FROM - (CLOSE.top / CLOSE.rows) * CLOSE_H;
/** Head columns (the middle of the head's solid span) in each file. */
const HEAD_U = { layoff: 515 / 1086, bingung: 595 / 1086 };
/** "OrangBingung.png" — same 1086 × 1448 canvas; feet on row 1416. */
const BINGUNG_FLOOR = 1416 / 1448;
/** TA11's ground (TAMistakes f15104): the grid fades out toward the logo row and the caption band. */
const GROUND_RAMP =
  `linear-gradient(to bottom, transparent ${theme.logoZone.height}px, black ${theme.logoZone.height * 2}px, ` +
  `black ${theme.captionBand.top - 122}px, transparent ${theme.captionBand.top - 7}px)`;

/**
 * The calendar page: month on the band, the date below. `date` may be
 * fractional — the dates are one strip that rolls up through the window, so
 * 1 → 25 is a scroll, not a swap.
 */
const Calendar = ({ month, date, last, speed }: { month: string; date: number; last: number; speed: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  /* A vertical-only blur, as fast as the strip is moving — motion blur, not a soft focus. */
  const rowH = CAL.h - CAL.band;
  const blur = Math.min(ROLL_BLUR.max, Math.abs(speed) * rowH * ROLL_BLUR.perSpeed);
  const left = CAL.cx - CAL.w / 2;
  const r = theme.shape.cardRadius;
  return (
    <>
      <div style={{ position: "absolute", left, top: CAL.y, width: CAL.w, height: CAL.h, borderRadius: r, background: c.cardBg, boxShadow: shadow.soft, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: CAL.w, height: CAL.band, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 22, boxSizing: "border-box", fontFamily: theme.text.family, fontSize: 40, fontWeight: 800, color: theme.color.calendarRed, letterSpacing: 1 }}>
          {month}
        </div>
        <div style={{ position: "absolute", left: CAL.rule, top: CAL.band, width: CAL.w - CAL.rule * 2, height: theme.shape.hairline * 2, borderRadius: 2, background: c.border }} />
        <div style={{ position: "absolute", left: 0, top: CAL.band, width: CAL.w, height: CAL.h - CAL.band, overflow: "hidden" }}>
          <svg width={0} height={0} style={{ position: "absolute" }}>
            <filter id="vi01-roll-blur" x="-10%" y="-20%" width="120%" height="140%">
              <feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} />
            </filter>
          </svg>
          <div style={{ position: "absolute", left: 0, top: 0, width: CAL.w, transform: `translateY(${(-(date - 1) * rowH).toFixed(2)}px)`, filter: blur > 0.3 ? "url(#vi01-roll-blur)" : undefined }}>
            {Array.from({ length: last }, (_, i) => (
              <div key={i} style={{ height: rowH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 240, fontWeight: 700, color: c.slate, lineHeight: 1 }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/** The phone and the card inside it — a remake of Simon's reference, in palette colours. */
const BalancePhone = ({ at, countOver, centre }: { at: number; countOver: number; centre: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const life = useLife(at);
  if (life <= 0.001) return null;
  const amount = BALANCE * ease(f, at, countOver);
  const P = PHONE;
  const sw = P.w - P.bezel * 2;
  const sh = P.h - P.bezel * 2;
  /** The UI block (top row → history) moved so its middle is the screen's middle. */
  const drop = (sh - (P.ui.bottom - P.ui.top)) / 2 - P.ui.top;
  const type = { fontFamily: theme.text.family, lineHeight: 1 } as const;
  const circle = (d: number, bg: string) =>
    ({ width: d, height: d, borderRadius: d / 2, background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: shadow.rest }) as const;
  const pill = (bg: string, color: string) =>
    ({ ...type, height: 56, borderRadius: 28, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 18, fontWeight: 700, boxShadow: shadow.rest }) as const;
  const line = { fill: "none", stroke: c.ink, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <div style={{ position: "absolute", left: P.cx + GROUP_DX + (theme.canvas.width / 2 - P.cx - GROUP_DX) * centre - P.w / 2, top: P.top, width: P.w, height: P.h, borderRadius: P.radius, background: c.slate, boxShadow: shadow.rest, opacity: life }}>
      <div style={{ position: "absolute", left: P.bezel, top: P.bezel, width: sw, height: sh, borderRadius: P.radius - P.bezel, background: c.border, overflow: "hidden" }}>
        {/* the island */}
        <div style={{ position: "absolute", left: sw / 2 - 52, top: 14, width: 104, height: 30, borderRadius: 15, background: c.ink }} />

        <div style={{ position: "absolute", left: 0, right: 0, top: drop, height: sh }}>
        {/* avatar · Overview · bell */}
        <div style={{ position: "absolute", left: 22, right: 22, top: 70, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: PHONE_QUIET }}>
          <div style={circle(52, c.indigoTint2)}>
            <svg width={26} height={26} viewBox="0 0 24 24"><circle cx={12} cy={9} r={4} {...line} stroke={c.cardBg} /><path d="M4.5 20c1.5-3.6 4.2-5 7.5-5s6 1.4 7.5 5" {...line} stroke={c.cardBg} /></svg>
          </div>
          <div style={{ ...pill(c.cardBg, c.ink), width: 150, height: 52, fontSize: 19, fontWeight: 600 }}>Overview</div>
          <div style={circle(52, c.cardBg)}>
            <svg width={24} height={24} viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" {...line} /><path d="M10 20.5a2 2 0 0 0 4 0" {...line} /></svg>
          </div>
        </div>

        {/* the balance card */}
        <div style={{ position: "absolute", left: 18, right: 18, top: 148, height: 236, borderRadius: 32, background: c.cardBg, boxShadow: shadow.soft }}>
          <div style={{ ...type, position: "absolute", left: 26, top: 34, fontSize: 15, fontWeight: 600, letterSpacing: 1, color: c.slate }}>ACCOUNT BALANCE:</div>
          <div style={{ ...type, position: "absolute", left: 26, top: 66, fontSize: 36, fontWeight: 700, color: c.ink, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
            Rp {price(amount)}
          </div>
          <div style={{ position: "absolute", right: 22, top: 26, ...circle(42, c.bg), boxShadow: "none" }}>
            <svg width={22} height={22} viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" {...line} /><circle cx={12} cy={12} r={3} {...line} /></svg>
          </div>
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 24, display: "flex", gap: 10 }}>
            <div style={{ ...pill(c.ink, c.cardBg), flex: 1.1 }}>
              <svg width={18} height={18} viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" {...line} stroke={c.cardBg} /></svg>
              Send
            </div>
            <div style={{ ...pill(c.cardBg, c.ink), flex: 1.3, border: `${theme.shape.hairline * 2}px solid ${c.border}`, boxShadow: "none" }}>Withdraw</div>
            <div style={{ ...pill(c.bg, c.ink), width: 56, boxShadow: "none", fontSize: 22, letterSpacing: 1 }}>•••</div>
          </div>
        </div>

        {/* the history, faded */}
        <div style={{ ...pill(c.cardBg, c.ink), position: "absolute", left: 18, right: 18, top: 408, height: 60, justifyContent: "space-between", padding: "0 24px", fontWeight: 600, opacity: PHONE_QUIET }}>
          Transaction History
          <svg width={18} height={18} viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" {...line} /></svg>
        </div>
        </div>
      </div>
    </div>
  );
};

/** One of the things the pay goes on: a white disc, the glyph in ink, settling up into place. */
const SpendIcon = ({ name, x, y, at }: { name: IconName; x: number; y: number; at: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const life = useLife(at);
  if (life <= 0.001) return null;
  const lift = (1 - ease(f, at, m.reveal)) * 24;
  const D = SPEND.disc;
  /** "icon iconnya kasih warna fill" — palette tints, the basket in its yellow. */
  const fills: Partial<Record<IconName, string>> = {
    shirt: c.indigoTint1,
    pants: c.cyan,
    car: c.indigoTint2,
    basket: theme.color.basketYellow,
    burger: c.indigoTint2,
    glass: c.cyan,
  };
  return (
    <div style={{ position: "absolute", left: x - D / 2, top: y - D / 2 + lift, width: D, height: D, borderRadius: D / 2, background: c.cardBg, boxShadow: shadow.soft, opacity: life, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={name} size={SPEND.icon} color={c.ink} fill={fills[name]} />
    </div>
  );
};

/** One piece of a line, easing in on its own frame; it holds its place while hidden, so the line never reflows. */
const Piece = ({ text, at, out, color }: { text: string; at: number; out?: number; color: string }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const t = ease(f, at, m.reveal) * (out === undefined ? 1 : 1 - ease(f, out, m.fade));
  return <span style={{ display: "inline-block", color, opacity: t, transform: `translateY(${((1 - t) * 14).toFixed(2)}px)` }}>{text}</span>;
};

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC01);
  /** After the second pause the pair slides straight up and out of the frame. */
  const exit = ease(f, L(B1.exit), m.move);
  /** Gone once it has cleared the top of the frame. */
  const gone = exit >= 0.999;
  const calIn = ease(f, L(B1.calendar), m.move);
  const cal = gone ? 0 : calIn;
  const grow = 1 + CAL_GROW * ease(f, L(B1.calendar), L(B1.gajian) - L(B1.calendar));
  /** GAJIAN up and bigger, the calendar down and smaller — one move, one curve. */
  const split = ease(f, L(B1.gajian), L(B1.settled) - L(B1.gajian));
  const roll = (t: number) => 1 + (B1.payday - 1) * ease(t, L(B1.scroll[0]), L(B1.scroll[1]) - L(B1.scroll[0]));
  const wordIn = ease(f, L(B1.gajian), m.reveal);
  /** The photo's rise from below — "Kerja" rides on it, as one group. */
  const lift = (1 - ease(f, L(B1.photo[0]), m.move)) * (theme.canvas.height - WORK.feet + PHOTO_H);
  const ground = ease(f, L(B1.photo[0]), m.move);
  /** 395: Kerja and the photo leave to the left; the phone takes the middle; the six icons follow. */
  const leave = ease(f, L(B1.spend), m.move);
  const centre = ease(f, L(B1.spend) + m.move / 2, m.move);
  const iconsAt = L(B1.spend) + m.move * 1.5;
  /** 555: the phone and the icons go; "Tapi" comes once they have. */
  const spent = ease(f, L(B1.bayangin[0]), m.fade);
  const tapiAt = L(B1.bayangin[0]) + m.fade;
  /** 861: the push into the face, scaled about the one point that carries the
      full-length shot onto the close-up; the swap and the new line as it lands. */
  const push = ease(f, L(B1.closeUp), m.move);
  const swapAt = L(B1.closeUp) + m.move;
  const swapped = f >= swapAt;
  const w0 = PHOTO_H * LAYOFF;
  const start = { left: theme.canvas.width / 2 - (LAYOFF_SOLID_CX - 0.5) * w0 - w0 / 2, top: WORK.feet - PHOTO_H };
  const k = CLOSE_H / PHOTO_H;
  const end = { left: theme.canvas.width / 2 - HEAD_U.layoff * CLOSE_H * LAYOFF, top: CLOSE_TOP };
  const pivot = { x: (k * start.left - end.left) / (k - 1), y: (k * start.top - end.top) / (k - 1) };
  const s = 1 + (k - 1) * push;
  const shot = { h: PHOTO_H * s, left: pivot.x + s * (start.left - pivot.x), top: pivot.y + s * (start.top - pivot.y) };

  return (
    <Stage>
      {/* TA11's grid behind everything, coming in with the photo */}
      {ground > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: ground, maskImage: GROUND_RAMP, WebkitMaskImage: GROUND_RAMP }}>
          <GridGround f={f + BLOCK.SC01} paper={c.bg} vignette={false} />
        </div>
      ) : null}

      {/* GAJIAN: from the frame's centre, growing, up to the top — drawn FIRST,
          so it rises from BEHIND the page ("secara layer harusnya dari belakang
          kalender") */}
      {!gone && wordIn > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: theme.canvas.width / 2,
            top: theme.canvas.height / 2 + (WORD_Y - theme.canvas.height / 2) * split - exit * EXIT_RISE,
            transform: `translate(-50%, -50%) scale(${(SPLIT.from + (1 - SPLIT.from) * split).toFixed(4)})`,
            opacity: wordIn,
            fontFamily: theme.text.family,
            fontSize: SPLIT.word,
            fontWeight: 800,
            color: theme.color.calendarRed,
            letterSpacing: 4,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          GAJIAN
        </div>
      ) : null}

      {/* the calendar: grows, then shrinks about its bottom edge and drops */}
      {cal > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: cal, transform: `translateY(${((1 - calIn) * 30 + split * CAL_DOWN - exit * EXIT_RISE).toFixed(2)}px)` }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${(1 - CAL_SHRINK * split).toFixed(4)})`, transformOrigin: `${CAL.cx}px ${CAL_BOTTOM}px` }}>
            <div style={{ position: "absolute", inset: 0, transform: `scale(${grow.toFixed(4)})`, transformOrigin: `${CAL.cx}px ${CAL.y + CAL.h / 2}px` }}>
              <Calendar month="Januari" date={roll(f)} last={B1.payday} speed={roll(f) - roll(f - 1)} />
            </div>
          </div>
        </div>
      ) : null}

      {/* the worker, and the flow he keeps going */}
      {/* Simon's photo of someone at work, 240-500 — mirrored so he faces the
          flow, with a plain shadow and a contact shadow under him;
          the yellow worker takes over after */}
      {/* it comes up from below, but never through the caption band — the frame
          is clipped there, so it rises out from behind the band's top edge */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, transform: `translateX(${(WORK.shift + GROUP_DX - LEAVE_X * leave).toFixed(2)}px)` }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift.toFixed(2)}px)` }}>
            <Say text="Kerja" x={theme.canvas.width / 2} y={WORK.feet - PHOTO_H - WORK.gap} at={L(B1.photo[0])} out={L(B1.photo[1])} size={WORK.label} weight={WORK.weight} color={c.indigo} />
          </div>
          <Cutout src="art/vi01/orang-kerja.png" aspect={ORANG_KERJA} x={theme.canvas.width / 2} y={WORK.feet} h={PHOTO_H} at={L(B1.photo[0])} out={L(B1.photo[1])} rise={theme.canvas.height - WORK.feet + PHOTO_H} riseFrames={m.move} mirror shadow floor={ORANG_KERJA_FLOOR} />
        </div>
      </div>
      {/* 555: the phone, its lines and the six icons fade out together */}
      {spent < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - spent }}>
      {/* the lines, under the phone and the discs */}
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
        {SPEND_ICONS.map((col, i) =>
          col.map((name, j) => {
            const at = iconsAt + m.sec(0.12) * (i * 3 + j);
            const p = ease(f, at, m.sec(SPEND_LINE.drawSec));
            if (p <= 0.001) return null;
            const x0 = theme.canvas.width / 2;
            const y0 = PHONE.top + PHONE.h / 2;
            const dx = SPEND.x[i] - x0;
            const dy = SPEND.y[j] - y0;
            const len = Math.hypot(dx, dy);
            const reach = (len - SPEND.disc / 2) * p;
            return <line key={name} x1={x0} y1={y0} x2={x0 + (dx / len) * reach} y2={y0 + (dy / len) * reach} stroke={c.slate} strokeWidth={SPEND_LINE.width} strokeLinecap="round" />;
          }),
        )}
      </svg>
      <BalancePhone at={L(B1.penghasilan)} countOver={m.sec(1.5)} centre={centre} />
      {SPEND_ICONS.map((col, i) =>
        col.map((name, j) => <SpendIcon key={name} name={name} x={SPEND.x[i]} y={SPEND.y[j]} at={iconsAt + m.sec(0.12) * (i * 3 + j) + m.sec(SPEND_LINE.drawSec * 0.7)} />),
      )}

        </div>
      ) : null}

      {/* the picture first, so the line reads over the close-up; never into the caption band */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
        {!swapped ? (
          <Cutout src="art/vi01/layoff.png" aspect={LAYOFF} x={shot.left + (shot.h * LAYOFF) / 2} y={shot.top + shot.h} h={shot.h} at={L(B1.bayangin[2])} shadow floor={LAYOFF_FLOOR} />
        ) : (
          <Cutout src="art/vi01/orang-bingung.png" aspect={LAYOFF} x={theme.canvas.width / 2 - (HEAD_U.bingung - 0.5) * CLOSE_H * LAYOFF} y={CLOSE_TOP + CLOSE_H} h={CLOSE_H} at={swapAt - m.reveal} rise={0} shadow floor={BINGUNG_FLOOR} />
        )}
      </div>

      {/* then the line, piece by piece, across the top — "Tapi" and "coba
          bayangin:" in indigo, the rest in black — and Layoff.png under it */}
      <div style={{ position: "absolute", left: 0, right: 0, top: BAYANGIN.y, display: "flex", flexDirection: "column", alignItems: "center", gap: BAYANGIN.gap, fontFamily: theme.text.family, fontSize: BAYANGIN.size, fontWeight: BAYANGIN.weight, lineHeight: 1.1, whiteSpace: "pre" }}>
        <div>
          <Piece text="Tapi" at={tapiAt} out={swapAt} color={c.indigo} />
          <Piece text=" coba bayangin:" at={L(B1.bayangin[1])} out={swapAt} color={c.indigo} />
        </div>
        <Piece text="suatu hari harus berhenti kerja sementara" at={L(B1.bayangin[2])} out={swapAt} color={c.ink} />
      </div>
      {/* …and in its place, as the picture swaps */}
      <div style={{ position: "absolute", left: 0, right: 0, top: BAYANGIN.y, display: "flex", justifyContent: "center", fontFamily: theme.text.family, fontSize: BAYANGIN.size, fontWeight: BAYANGIN.weight, lineHeight: 1.1, whiteSpace: "pre" }}>
        <Piece text="Apakah penghasilan kita juga ikut berhenti?" at={swapAt} color={c.ink} />
      </div>
    </Stage>
  );
};

// ═══ SC02 — five ways, one source ═════════════════════════════════════════
/**
 * Simon, 1020-2110: "Muncul dulu OrangTuntun.png di tengah layar horizontal,
 * tapi perbesar hingga previewnya dari kepala hingga dada. Lalu di atasnya
 * muncul 5 bubble icon: tas kerja, palu dan obeng, toko, pulpen, monitor.
 * Berikan animasi bubble yang terus bergerak, berikan juga animasi muncul dari
 * kecil ke besar ke normal." Each bubble lands on its own way in the VO
 * (naik jabatan, skill baru, bangun bisnis, freelance, side hustle).
 */
/** "OrangTuntun.png", 941 × 1672: hair from row 70, chest at row 620, head centred on column 466. */
const TUNTUN = { aspect: 941 / 1672, rows: 1672, top: 70, chest: 620, headU: 466 / 941, floor: 1618 / 1672 };
/**
 * The head starts here, leaving the top of the frame to the bubbles; then
 * "Orangnya perbesar lagi dan geser naik sedikit" — 30% larger, 60 px higher;
 * then "Orangnya geser naik 70px".
 */
const TUNTUN_FROM = 270;
/** …and then "Orangnya kecilin 15%" — the head stays where it starts. */
const TUNTUN_ZOOM = 1.3 * 0.85;
const TUNTUN_H = (((theme.captionBand.top - 400) * TUNTUN.rows) / (TUNTUN.chest - TUNTUN.top)) * TUNTUN_ZOOM;
const TUNTUN_TOP = TUNTUN_FROM - (TUNTUN.top / TUNTUN.rows) * TUNTUN_H;
/** "Lalu di bawahnya muncul text box garis putus putus" — TA07's dashed box over the chest, clear of the caption band. */
/** "Text box dan isinya kecilin 20%" — box and type at 0.8, about the same centre. */
const MAKANYA_SCALE = 0.8;
const MAKANYA = { y: 870 - (140 * MAKANYA_SCALE) / 2, w: 1560 * MAKANYA_SCALE, h: 140 * MAKANYA_SCALE, size: 50 * MAKANYA_SCALE };
/**
 * The five bubbles on an arc over the head, each named under it — "Di bawah
 * setiap icon, berikan label namanya, sesuai subtitle". The arc sits 60 px
 * higher than first built so the middle label clears the raised head.
 */
const BUBBLES: { icon: IconName; label: string; x: number; y: number }[] = [
  { icon: "briefcase", label: "Naik jabatan", x: 500, y: 270 },
  { icon: "tools", label: "Skill baru", x: 730, y: 175 },
  { icon: "store", label: "Bangun bisnis", x: 960, y: 140 },
  { icon: "pen", label: "Freelance", x: 1190, y: 175 },
  { icon: "monitor", label: "Side hustle", x: 1420, y: 270 },
];
/** Disc and glyph size; the drift (px) and its two periods (s); the overshoot on arrival. */
const BUBBLE = { label: 30, labelGap: 18, disc: 150, icon: 82, bob: 12, sway: 6, bobSec: 2.4, swaySec: 3.3, peak: 1.15 };

/** Where the five gather: the middle bubble, "Bangun bisnis". */
const GATHER = { x: 960, y: 140 };
/** "Waktu + Tenaga" — "sebesar text Gajian", over the head. */
const WAKTU = { y: 200 };

/** One bubble: small → past full size → full size, then drifting for as long as it is up. */
const Bubble = ({ icon, label, x: x0, y: y0, at, i, gatherAt }: { icon: IconName; label: string; x: number; y: number; at: number; i: number; gatherAt: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  /* 1940: the names go; the bubbles gather on "Bangun bisnis"; then they go */
  const nameOut = ease(f, gatherAt, m.fade);
  const gather = ease(f, gatherAt + m.fade, m.move);
  const gone = ease(f, gatherAt + m.fade + m.move, m.fade);
  if (f < at || gone >= 0.999) return null;
  const x = x0 + (GATHER.x - x0) * gather;
  const y = y0 + (GATHER.y - y0) * gather;
  /* "dari kecil ke besar ke normal": two eased legs, no spring */
  const grow = ease(f, at, m.reveal);
  const settle = ease(f, at + m.reveal, m.reveal);
  const scale = grow * BUBBLE.peak - (BUBBLE.peak - 1) * settle;
  const t = (f - at) / m.sec(1);
  const dy = Math.sin((t / BUBBLE.bobSec + i * 0.23) * Math.PI * 2) * BUBBLE.bob;
  const dx = Math.sin((t / BUBBLE.swaySec + i * 0.37) * Math.PI * 2) * BUBBLE.sway;
  const fills: Partial<Record<IconName, string>> = {
    briefcase: c.indigoTint1,
    tools: c.cyan,
    store: c.indigoTint2,
    pen: c.cyan,
    monitor: c.indigoTint1,
  };
  const D = BUBBLE.disc;
  return (
    <>
      <div style={{ position: "absolute", left: x - D / 2 + dx, top: y - D / 2 + dy, width: D, height: D, borderRadius: D / 2, background: c.cardBg, boxShadow: shadow.soft, opacity: grow * (1 - gone), transform: `scale(${scale.toFixed(4)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={BUBBLE.icon} color={c.ink} fill={fills[icon]} />
      </div>
      {/* the name rides with its bubble but is not scaled with it */}
      <div style={{ position: "absolute", left: x + dx, top: y + D / 2 + BUBBLE.labelGap + dy, transform: "translateX(-50%)", opacity: grow * (1 - nameOut), fontFamily: theme.text.family, fontSize: BUBBLE.label, fontWeight: 700, color: c.ink, whiteSpace: "nowrap", lineHeight: 1 }}>
        {label}
      </div>
    </>
  );
};

export const SC02 = () => {
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC02);
  return (
    <Stage>
      {/* head to chest, centred on the head; masked off at the dashed box's
          bottom edge — "Masking bawah orangnya, buat naik sampe di bawah text box nya" */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.canvas.height - (MAKANYA.y + MAKANYA.h)}px 0)` }}>
        <Cutout src="art/vi01/orang-tuntun.png" aspect={TUNTUN.aspect} x={theme.canvas.width / 2 - (TUNTUN.headU - 0.5) * TUNTUN_H * TUNTUN.aspect} y={TUNTUN_TOP + TUNTUN_H} h={TUNTUN_H} at={L(B2.title)} riseFrames={m.move} shadow floor={TUNTUN.floor} />
      </div>
      <TypeBox cx={theme.canvas.width / 2} y={MAKANYA.y} w={MAKANYA.w} h={MAKANYA.h} at={L(B2.title)} text="Makanya, banyak orang berusaha menambah penghasilan" size={MAKANYA.size} closeAt={L(B2.gather)} />
      {/* "Bangun bisnis" drawn last, so the others gather under it */}
      {BUBBLES.map((b, i) => ({ b, i }))
        .sort((p, q) => Number(p.b.icon === "store") - Number(q.b.icon === "store"))
        .map(({ b, i }) => (
        <Bubble key={b.icon} icon={b.icon} label={b.label} x={b.x} y={b.y} at={L(B2.ways[i])} i={i} gatherAt={L(B2.gather)} />
      ))}
      <Say text="Waktu + Tenaga" x={theme.canvas.width / 2} y={WAKTU.y} at={L(B2.gather) + m.fade * 2 + m.move} size={SPLIT.word} weight={800} color={c.indigo} />
    </Stage>
  );
};

// ═══ SC03 — 24 hours, and the two questions ═══════════════════════════════
/** One day, hour by hour; and what fills it as you get older. */
const HOURS = { x: 170, y: 250, cell: 62, gap: 4, h: 96 };
const DAY_BLOCKS: { from: number; to: number; label: string; tone: "indigo" | "cyan" | "slate" }[] = [
  { from: 0, to: 7, label: "Istirahat", tone: "slate" },
  { from: 7, to: 9, label: "Jalan", tone: "slate" },
  { from: 9, to: 18, label: "Kerja", tone: "indigo" },
  { from: 18, to: 20, label: "Jalan", tone: "slate" },
  { from: 20, to: 24, label: "Keluarga", tone: "cyan" },
];

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC03);
  const day = ease(f, L(B3.day), m.reveal);
  /** Blocks fill left to right between "Semakin dewasa" and "…makin banyak." */
  const fill = (h: number) => ease(f, L(B3.dewasa) + ((L(B3.full) - L(B3.dewasa)) * h) / 24, 10);
  const dimDay = ease(f, L(B3.q1) - 10, m.move);
  const ink = (t: "indigo" | "cyan" | "slate") => (t === "indigo" ? c.indigo : t === "cyan" ? theme.color.cyanInk : c.slate);
  const wash = (t: "indigo" | "cyan" | "slate") =>
    t === "indigo" ? theme.color.indigoWashStrong : t === "cyan" ? theme.color.hlCyan : theme.color.slateWash;
  const rowW = 24 * HOURS.cell + 23 * HOURS.gap;
  return (
    <Stage>
      <div style={{ opacity: day * (1 - 0.7 * dimDay) }}>
        <Say text="Sehari tetap cuma 24 jam" x={HOURS.x} y={HOURS.y - 70} at={L(B3.day)} anchor="left" size={44} />
        <Say text={`${Math.round(24 * ease(f, L(B3.day), 50))} jam`} x={HOURS.x + rowW} y={HOURS.y - 70} at={L(B3.jam)} anchor="right" size={44} color={c.indigo} />
        {Array.from({ length: 24 }, (_, h) => {
          const blk = DAY_BLOCKS.find((b) => h >= b.from && h < b.to)!;
          const on = fill(h);
          return (
            <div
              key={h}
              style={{
                position: "absolute",
                left: HOURS.x + h * (HOURS.cell + HOURS.gap),
                top: HOURS.y,
                width: HOURS.cell,
                height: HOURS.h,
                borderRadius: 10,
                border: `${theme.shape.hairline}px solid ${on > 0.5 ? ink(blk.tone) : c.border}`,
                background: on > 0.001 ? wash(blk.tone) : c.cardBg,
              }}
            />
          );
        })}
        {DAY_BLOCKS.map((b) => (
          <Say
            key={`${b.label}${b.from}`}
            text={b.label}
            x={HOURS.x + ((b.from + b.to) / 2) * (HOURS.cell + HOURS.gap)}
            y={HOURS.y + 140}
            at={L(B3.dewasa) + ((L(B3.full) - L(B3.dewasa)) * b.from) / 24}
            size={30}
            weight={600}
            color={ink(b.tone)}
          />
        ))}
      </div>
      <TypeBox
        cx={960}
        y={500}
        w={1380}
        h={130}
        at={L(B3.q1) + 30}
        typeAt={L(B3.q1Type)}
        dim={ease(f, L(B3.q2), m.fade)}
        text="“Gimana caranya aku bisa menghasilkan lebih banyak?”"
        size={42}
      />
      <TypeBox
        cx={960}
        y={690}
        w={1560}
        h={150}
        at={L(B3.q2) + 14}
        typeAt={L(B3.q2Type)}
        text="“Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”"
        mark="ikut bekerja"
        markAt={L(B3.ikutBekerja)}
        tone="cyan"
        size={46}
      />
    </Stage>
  );
};
