/**
 * PART 01 — UANG YANG IKUT BEKERJA · SC04–SC08.
 *
 * The flow from the cold open gets its third node (Aset); compounding is shown
 * as bars that grow on the spoken numbers; the habit beats the lump sum; the
 * two kinds of asset get their colours (indigo human, cyan financial), and
 * those colours carry into the life-long picture and the relay.
 */
import { useCurrentFrame } from "remotion";
import { GridGround, Stage, theme, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK, CUT, LIST_TRANS, SC04_TITLE, SC04 as B4, SC05 as B5, SC06 as B6, SC07 as B7, SC08 as B8, local } from "../data/timing";
import { Cutout, ease, Icon, OUTSIDE_RESERVES, Say, TypeBox, useLife, type IconName } from "../components/kit";

/** An icon and a word on one line — a row of a list. */
const Item = ({ x, y, icon, label, tone, at, size = 44 }: { x: number; y: number; icon: IconName; label: string; tone: "indigo" | "cyan"; at: number; size?: number }) => {
  const c = usePalette();
  const ink = tone === "indigo" ? c.indigo : theme.color.cyanInk;
  return (
    <Say x={x} y={y} at={at} anchor="left" size={size} weight={600}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 22 }}>
        <Icon name={icon} size={size * 1.3} color={ink} />
        {label}
      </span>
    </Say>
  );
};

// ═══ SC04 — passive income: keep working, and part of it becomes an asset ══
/**
 * THE TOTAL ASSET CARD — a remake of Simon's screenshot of the app's balance
 * card: "Total Asset" with an eye, the total large; Deposit and Withdraw as two
 * tinted square buttons on the right; Available Cash and Total Invested along
 * the bottom. Simon's numbers: Rp 50,000,000 in all, first as cash, then — at
 * `moveAt` — all of it invested; the two figures count across together.
 */
const TOTAL_ASSET = 50_000_000;
const fmtAsset = (n: number) => Math.round(n).toLocaleString("en-US");
const ASSET = { top: 330, w: 1320, h: 500, pad: 64, btn: 132, label: 40, total: 92, value: 56 };

/**
 * "Orang Resign.png", 1086 × 1448: solid from row 11, feet on row 1417,
 * columns 256–870. "Perbesar gambarnya di kepala hingga pinggul" — the head
 * starts under the title and the hips (row 720) meet the caption band, where
 * the picture is cut off.
 */
const RESIGN = { aspect: 1086 / 1448, rows: 1448, top: 11, hips: 720, feet: 1417, solidCx: 563 / 1086, from: 330 };
const RESIGN_H = ((theme.captionBand.top - RESIGN.from) * RESIGN.rows) / (RESIGN.hips - RESIGN.top);
/**
 * The three "Tetap …", centred left to right: a to-do box, the words typed in
 * indigo, then a green tick; an icon bubble on the right of each — Monitor, Tas
 * kerja, Toga. Text widths measured in the real face at 52 px bold.
 */
const TODO = { y: [420, 540, 660], size: 52, box: 50, gap: 26, cps: 1, textW: 499, bubble: 96, bubbleGap: 44 };
const TODO_W = TODO.box + TODO.gap + TODO.textW + TODO.bubbleGap + TODO.bubble;
const TODO_X = (theme.canvas.width - TODO_W) / 2;
const TODO_BUBBLE_X = TODO_X + TODO_W - TODO.bubble / 2;
const TODO_ICONS: IconName[] = ["monitor", "briefcase", "cap"];
/**
 * THE MAP — at 3856 the rows slide left and only their bubbles stay; lines run
 * from them into "Penghasilan" (a cash bubble over it); one line on to "Asset"
 * (a building bubble over it). x of the bubbles, the bend, the hub and Asset.
 */
const MAP = { bubbleX: 507, cy: 540, col: 677, r: 50, join: 774, hubX: 947, hubW: 306, assetX: 1390, assetW: 150, iconUp: 110, stroke: 4, pad: 22 };

/** A line drawn on from its start: `p` 0 → 1. */
const Drawn = ({ d, p, color }: { d: string; p: number; color: string }) =>
  p > 0.001 ? <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={color} strokeWidth={MAP.stroke} strokeLinecap="round" strokeLinejoin="round" /> : null;

/** An icon on a white disc, easing in (no overshoot). */
const IconBubble = ({ icon, x, y, at }: { icon: IconName; x: number; y: number; at: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const t = ease(f, at, m.reveal);
  if (t <= 0.001) return null;
  const D = TODO.bubble;
  const fills: Partial<Record<IconName, string>> = { monitor: c.indigoTint1, briefcase: c.cyan, cap: c.indigoTint2, cash: c.cyan, building: c.indigoTint1 };
  return (
    <div style={{ position: "absolute", left: x - D / 2, top: y - D / 2, width: D, height: D, borderRadius: D / 2, background: c.cardBg, boxShadow: shadow.soft, opacity: t, transform: `scale(${(0.85 + 0.15 * t).toFixed(4)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={D * 0.56} color={c.ink} fill={fills[icon]} />
    </div>
  );
};

/** One row: the box, the typed words, then the tick; `fade` takes the box and words away (the bubble is separate). */
const Todo = ({ label, x, y, at, fade }: { label: string; x: number; y: number; at: number; fade: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const life = useLife(at, undefined, undefined, m.fade) * (1 - fade);
  if (life <= 0.001) return null;
  const shown = Math.max(0, Math.floor((f - at) * TODO.cps));
  const tickAt = at + Math.ceil(label.length / TODO.cps) + m.sec(0.1);
  const tick = ease(f, tickAt, m.sec(0.35));
  const B = TODO.box;
  return (
    <div style={{ position: "absolute", left: x, top: y - B / 2, height: B, display: "flex", alignItems: "center", gap: TODO.gap, opacity: life }}>
      <svg width={B} height={B} viewBox="0 0 50 50" style={{ flex: "none" }}>
        <rect x={3} y={3} width={44} height={44} rx={10} fill={c.cardBg} stroke={c.indigo} strokeWidth={4} />
        {tick > 0.001 ? (
          <path d="M13 26 L22 35 L38 16" pathLength={1} fill="none" stroke={theme.color.checkGreen} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - tick} />
        ) : null}
      </svg>
      <span style={{ fontFamily: theme.text.family, fontSize: TODO.size, fontWeight: 700, color: c.indigo, whiteSpace: "pre", lineHeight: 1 }}>{label.slice(0, shown)}</span>
    </div>
  );
};

/** How far the card and the photo travel: from just off one side of the frame to just off the other. */
const SLIDE = theme.canvas.width;

const AssetCard = ({ at, moveAt, moveOver, top, dx }: { at: number; moveAt: number; moveOver: number; top: number; dx: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const life = useLife(at);
  if (life <= 0.001 || dx <= -SLIDE + 1) return null;
  const invested = TOTAL_ASSET * ease(f, moveAt, moveOver);
  const type = { fontFamily: theme.text.family, lineHeight: 1, whiteSpace: "nowrap" as const };
  const button = (label: string, glyph: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ width: ASSET.btn, height: ASSET.btn, borderRadius: 32, background: theme.color.indigoWashStrong, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={64} height={64} viewBox="0 0 48 48">{glyph}</svg>
      </div>
      <div style={{ ...type, fontSize: ASSET.label, fontWeight: 500, color: c.ink }}>{label}</div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: (theme.canvas.width - ASSET.w) / 2,
        /* under the title, which stays ("Passive Incomenya harusnya stay aja") */
        top,
        transform: `translateX(${dx.toFixed(2)}px)`,
        width: ASSET.w,
        height: ASSET.h,
        borderRadius: 40,
        background: `linear-gradient(115deg, ${c.indigoSoft} 0%, ${c.cardBg} 55%, ${c.cyanSoft} 100%)`,
        boxShadow: shadow.soft,
        opacity: life,
        padding: ASSET.pad,
        boxSizing: "border-box",
      }}
    >
      {/* Total Asset and the total */}
      <div style={{ position: "absolute", left: ASSET.pad, top: ASSET.pad, display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ ...type, fontSize: ASSET.label, fontWeight: 500, color: c.slate }}>Total Asset</span>
        <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={c.slate} strokeWidth={1.8}>
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
          <circle cx={12} cy={12} r={3} />
        </svg>
      </div>
      <div style={{ ...type, position: "absolute", left: ASSET.pad, top: ASSET.pad + 66, fontSize: ASSET.total, fontWeight: 800, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{fmtAsset(TOTAL_ASSET)}</div>

      {/* Deposit · Withdraw */}
      <div style={{ position: "absolute", right: ASSET.pad - 10, top: ASSET.pad - 24, display: "flex", gap: 44 }}>
        {button(
          "Deposit",
          <>
            <rect x={8} y={9} width={32} height={6} rx={2} fill={c.indigo} />
            <rect x={12} y={15} width={24} height={24} rx={3} fill={c.indigo} />
            <path d="M24 21v12M18 27h12" stroke={c.cardBg} strokeWidth={3} strokeLinecap="round" />
          </>,
        )}
        {button(
          "Withdraw",
          <>
            <path d="M8 26v10a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V26" fill="none" stroke={c.indigo} strokeWidth={4} strokeLinejoin="round" />
            <rect x={13} y={9} width={22} height={22} rx={3} fill={c.indigo} />
            <path d="M24 26V15M19 20l5-5 5 5" fill="none" stroke={c.cardBg} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </>,
        )}
      </div>

      {/* Available Cash · Total Invested */}
      <div style={{ position: "absolute", left: ASSET.pad, bottom: ASSET.pad, display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ ...type, fontSize: ASSET.label, fontWeight: 500, color: c.slate }}>Available Cash</span>
        <span style={{ ...type, fontSize: ASSET.value, fontWeight: 700, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{fmtAsset(TOTAL_ASSET - invested)}</span>
      </div>
      <div style={{ position: "absolute", right: ASSET.pad, bottom: ASSET.pad, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
        <span style={{ ...type, fontSize: ASSET.label, fontWeight: 500, color: c.slate }}>Total Invested</span>
        <span style={{ ...type, fontSize: ASSET.value, fontWeight: 700, color: c.ink, fontVariantNumeric: "tabular-nums" }}>{fmtAsset(invested)}</span>
      </div>
    </div>
  );
};

/**
 * THE CARRIED TITLE — "Passive Income", from the moment ST1 hands it over
 * until SC05's "Compounding". Mounted at the composition root, outside every
 * scene's CameraCut, so the SC04 → SC05 cut moves everything but it. At
 * SC05.peran it shrinks a little and "Peran Waktu di" comes up over it.
 * Reads the GLOBAL frame.
 */
const CARRIED = { y: SC04_TITLE.y, size: SC04_TITLE.size, smallY: 255, smallSize: 72, overY: 168, overSize: 52 };
export const CarriedTitle = () => {
  const g = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const from = LIST_TRANS.handoff;
  const out = ease(g, B5.compounding - m.move, m.fade);
  if (g < from || out >= 0.999) return null;
  const k = ease(g, B5.peran, m.move);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <Say text="Passive Income" x={theme.canvas.width / 2} y={CARRIED.y + (CARRIED.smallY - CARRIED.y) * k} at={from - m.reveal} size={CARRIED.size + (CARRIED.smallSize - CARRIED.size) * k} weight={800} color={c.indigo} />
      <Say text="Peran Waktu di" x={theme.canvas.width / 2} y={CARRIED.overY} at={B5.peran + m.move / 2} size={CARRIED.overSize} weight={700} />
    </div>
  );
};

export const SC04 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC04);
  const c = usePalette();
  /* the map: the rows slide left, only their bubbles stay; lines into the hub,
     the hub at 3967, one line on to Asset at 4048 */
  const toMap = ease(f, L(B4.map), m.move);
  const rowsOut = ease(f, L(B4.map), m.fade);
  const lines = ease(f, L(B4.map) + m.move, m.sec(0.6));
  const branch = ease(f, L(B4.branch), m.sec(0.5));
  const slide = (MAP.bubbleX - TODO_BUBBLE_X) * toMap;
  return (
    <Stage>
      {/* the card rides under the carried title until it lands, then holds —
          masked above the caption band while it is still low */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
      <AssetCard
        at={L(B4.asset[0])}
        moveAt={L(B4.invest[0])}
        moveOver={L(B4.invest[1]) - L(B4.invest[0])}
        top={ASSET.top + (theme.canvas.height / 2 - SC04_TITLE.y) * (1 - ease(f, L(LIST_TRANS.carry), L(LIST_TRANS.handoff) - L(LIST_TRANS.carry)))}
        dx={-SLIDE * ease(f, L(B4.resign), m.move)}
      />
      </div>
      {/* the photo slides in from the right as the card goes, one carousel move; it leaves where the card used to */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
      <Cutout
        src="art/vi01/orang-resign.png"
        aspect={RESIGN.aspect}
        x={theme.canvas.width / 2 - (RESIGN.solidCx - 0.5) * RESIGN_H * RESIGN.aspect + SLIDE * (1 - ease(f, L(B4.resign), m.move)) - SLIDE * ease(f, L(B4.tuntun[0]), m.move)}
        y={RESIGN.from - (RESIGN.top / RESIGN.rows) * RESIGN_H + RESIGN_H}
        h={RESIGN_H}
        at={L(B4.resign) - m.reveal}
        out={L(B4.tuntun[0]) + m.move}
        rise={0}
        shadow
        floor={RESIGN.feet / RESIGN.rows}
      />
      </div>
      {/* the three, centred; at 3856 they slide left and only the bubbles stay */}
      {["Tetap kerja", "Tetap bangun karier", "Tetap belajar"].map((label, i) => (
        <Todo key={label} label={label} x={TODO_X + slide} y={TODO.y[i]} at={L(B4.tetap[i])} fade={rowsOut} />
      ))}
      {TODO_ICONS.map((icon, i) => (
        <IconBubble key={icon} icon={icon} x={TODO_BUBBLE_X + slide} y={TODO.y[i]} at={L(B4.tetap[i])} />
      ))}
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
        {TODO.y.map((y, i) => {
          const x0 = MAP.bubbleX + TODO.bubble / 2 + MAP.pad;
          const bend = y === MAP.cy ? "" : (() => {
            const sg = Math.sign(MAP.cy - y);
            return ` H ${MAP.col - MAP.r} Q ${MAP.col} ${y} ${MAP.col} ${y + sg * MAP.r} V ${MAP.cy - sg * MAP.r} Q ${MAP.col} ${MAP.cy} ${MAP.col + MAP.r} ${MAP.cy}`;
          })();
          return <Drawn key={i} d={`M ${x0} ${y}${bend} H ${MAP.join}`} p={lines} color={c.ink} />;
        })}
        <Drawn d={`M ${MAP.hubX + MAP.hubW / 2 + MAP.pad} ${MAP.cy} H ${MAP.assetX - MAP.assetW / 2 - MAP.pad}`} p={branch} color={c.ink} />
      </svg>
      <IconBubble icon="cash" x={MAP.hubX} y={MAP.cy - MAP.iconUp} at={L(B4.hub)} />
      <Say text="Penghasilan" x={MAP.hubX} y={MAP.cy} at={L(B4.hub)} size={TODO.size} weight={700} color={c.indigo} />
      <IconBubble icon="building" x={MAP.assetX} y={MAP.cy - MAP.iconUp} at={L(B4.branch) + m.sec(0.4)} />
      <Say text="Asset" x={MAP.assetX} y={MAP.cy} at={L(B4.branch) + m.sec(0.4)} size={TODO.size} weight={700} color={c.indigo} />
    </Stage>
  );
};


// ═══ SC05 — compounding, on the spoken numbers ════════════════════════════
const VALUES = [100, 110, 121, 133];
const BARS = { base: 860, unit: 2.6, w: 180, r: 14, x: [600, 860, 1120, 1380] };

/**
 * THE COIN TREE — a remake of Simon's picture: one large coin, arrows out to
 * coins, and from those to smaller coins, and on — money that makes money.
 * Still for now ("Taro dulu aja, jangan animasikan dulu"); it fades in at
 * SC05.tree and out before the time axis.
 */
type Coin = { x: number; y: number; r: number; parent?: number; step: 0 | 1 | 2 };
const TREE: Coin[] = (() => {
  const root: Coin = { x: 960, y: 620, r: 62, step: 0 };
  const out: Coin[] = [root];
  [36, 108, 180, 252, 324].forEach((a) => {
    const rad = (a * Math.PI) / 180;
    const p = out.length;
    const c1: Coin = { x: root.x + Math.sin(rad) * 190, y: root.y - Math.cos(rad) * 190, r: 40, parent: 0, step: 1 };
    out.push(c1);
    [-26, 26].forEach((d) => {
      const r2 = ((a + d) * Math.PI) / 180;
      out.push({ x: c1.x + Math.sin(r2) * 125, y: c1.y - Math.cos(r2) * 125, r: 28, parent: p, step: 2 });
    });
  });
  return out;
})();

/** Each step: its arrows draw out from the coins before, then its coins ease in. */
const CoinTree = ({ steps, out }: { steps: readonly number[]; out: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const gone = ease(f, out, m.fade);
  if (f < steps[0] || gone >= 0.999) return null;
  const draw = (s: number) => ease(f, steps[s], m.sec(0.4));
  const pop = (s: number) => ease(f, steps[s] + (s === 0 ? 0 : m.sec(0.25)), m.reveal);
  const arrow = (a: Coin, b: Coin, i: number) => {
    const p = draw(b.step);
    if (p <= 0.001) return null;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const x1 = a.x + ux * (a.r + 8);
    const y1 = a.y + uy * (a.r + 8);
    const h = 9;
    const x2 = x1 + (b.x - ux * (b.r + 8) - x1) * p;
    const y2 = y1 + (b.y - uy * (b.r + 8) - y1) * p;
    return (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2 - ux * h} y2={y2 - uy * h} stroke={c.ink} strokeWidth={3} strokeLinecap="round" />
        <path d={`M ${x2} ${y2} L ${x2 - ux * h * 1.6 - uy * h} ${y2 - uy * h * 1.6 + ux * h} L ${x2 - ux * h * 1.6 + uy * h} ${y2 - uy * h * 1.6 - ux * h} Z`} fill={c.ink} />
      </g>
    );
  };
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - gone }}>
      {TREE.map((n, i) => (n.parent === undefined ? null : arrow(TREE[n.parent], n, i)))}
      {TREE.map((n, i) => {
        const t = pop(n.step);
        if (t <= 0.001) return null;
        return (
          <g key={`c${i}`} opacity={t} transform={`translate(${n.x} ${n.y}) scale(${(0.6 + 0.4 * t).toFixed(4)})`}>
            <circle r={n.r} fill={theme.color.coinYellow} />
            <circle r={n.r * 0.8} fill="none" stroke={c.cardBg} strokeWidth={Math.max(2, n.r * 0.06)} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={theme.text.family} fontWeight={800} fontSize={n.r * 0.72} fill={c.ink}>
              Rp
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** How far SC05 scrolls up at SC05.scroll — the chart's base clears the top of the frame. */
const SCROLL_UP = 1100;
/**
 * THE BANK BALANCE CARD — a remake of Simon's screenshot: "Bank balance", and
 * under it the balance, the currency small and raised before it. It comes up
 * from below anchored to the chart (the same scroll), counts Rp 0,- →
 * Rp 1,000,000,000.- at SC06.balance as it grows 10%, and leaves at
 * SC06.months. Mounted at the composition
 * root: it crosses the SC05 → SC06 boundary. Reads the GLOBAL frame.
 */
const BANK = { w: 1080, h: 360, pad: 72, label: 50, amount: 100, currency: 46, balance: 1_000_000_000, grow: 0.1 };
export const BankBalance = () => {
  const g = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const up = ease(g, B5.scroll, m.move);
  /* "5700 Hapus visual di sini" — it gives way to the three months */
  const out = ease(g, B6.months, m.fade);
  if (g < B5.scroll || out >= 0.999) return null;
  const count = ease(g, B6.balance, m.sec(1.5));
  const scale = 1 + BANK.grow * count;
  const amount = `${Math.round(BANK.balance * count).toLocaleString("en-US")}.-`;
  const top = (theme.captionBand.top - BANK.h) / 2 + SCROLL_UP * (1 - up);
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)`, opacity: 1 - out }}>
      <div
        style={{
          position: "absolute",
          left: (theme.canvas.width - BANK.w) / 2,
          top,
          width: BANK.w,
          height: BANK.h,
          borderRadius: 36,
          background: c.cardBg,
          boxShadow: shadow.soft,
          transform: `scale(${scale.toFixed(4)})`,
          fontFamily: theme.text.family,
          color: c.ink,
        }}
      >
        <div style={{ position: "absolute", left: BANK.pad, top: BANK.pad, fontSize: BANK.label, fontWeight: 500, lineHeight: 1 }}>Bank balance</div>
        <div style={{ position: "absolute", left: BANK.pad, bottom: BANK.pad, display: "flex", alignItems: "flex-start", gap: 10, lineHeight: 1, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
          <span style={{ fontSize: BANK.currency, fontWeight: 500, marginTop: 10 }}>Rp</span>
          <span style={{ fontSize: BANK.amount, fontWeight: 500 }}>{amount}</span>
        </div>
      </div>
    </div>
  );
};

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC05);
  const axis = ease(f, L(B5.axis), m.move);
  /* the grid comes up once the cut has landed */
  const grid = ease(f, CUT.over / 2, m.fade);
  /* 5462: everything but the grid scrolls up and out */
  const up = ease(f, L(B5.scroll), m.move) * SCROLL_UP;
  return (
    <Stage>
      <div style={{ position: "absolute", inset: 0, opacity: grid, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f + BLOCK.SC05} paper={c.bg} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(-up).toFixed(2)}px)` }}>
      <CoinTree steps={B5.tree.map(L)} out={L(B5.axis)} />
      <Say text="Compounding" x={960} y={170} at={L(B5.compounding)} size={84} weight={800} color={theme.color.cyanInk} />
      <Say text="hasil yang terus ikut bertumbuh seiring waktu" x={960} y={262} at={L(B5.line)} size={40} weight={600} color={c.slate} />

      {/* the time axis the bars stand on, the years under it */}
      {axis > 0.001 ? (
        <div style={{ position: "absolute", left: 440, top: BARS.base, width: 1120 * axis, height: theme.shape.rule, background: c.slate }} />
      ) : null}
      {BARS.x.map((x, i) => (
        <Say key={i} text={`Tahun ${i + 1}`} x={x} y={BARS.base + 46} at={L(B5.axis) + m.fade + i * 4} size={34} weight={600} color={c.slate} />
      ))}

      {/* "kenaikan bar chartnya dijadikan satu bar saja tapi masih beda warna":
          one bar a year, its parts stacked inside it in their own colours;
          rounded at the top only — "Garis bawah tiap bar chart juga jangan
          rounded corner" */}
      {VALUES.map((v, i) => {
        const at = L(B5.bars[i]);
        const grow = ease(f, at, m.move);
        if (grow <= 0.001) return null;
        const prev = i === 0 ? v : VALUES[i - 1];
        const h = v * BARS.unit * grow;
        const base = prev * BARS.unit * grow;
        const x = BARS.x[i] - BARS.w / 2;
        return (
          <div key={v}>
            <div style={{ position: "absolute", left: x, top: BARS.base - h, width: BARS.w, height: h, borderRadius: `${BARS.r}px ${BARS.r}px 0 0`, overflow: "hidden", border: `${theme.shape.rule}px solid ${c.cyan}`, borderBottom: "none", boxSizing: "border-box", background: c.cyanSoft }}>
              {i > 0 ? (
                <>
                  {/* this year's growth on top of last year's value, one colour
                      ("itu di samain aja sama warna bawahnya") */}
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h - base, background: c.cyan }} />
                </>
              ) : null}
            </div>
            <Say text={String(v)} x={BARS.x[i]} y={BARS.base - h - 44} at={at} size={52} weight={800} color={i === 0 ? c.ink : theme.color.cyanInk} />
          </div>
        );
      })}
      </div>
    </Stage>
  );
};

// ═══ SC06 — the habit, not the lump sum ══════════════════════════════════
/** The skill bar steps up once per turn of the loop — on the loop's own beats. */

/**
 * THE THREE MONTHS — "Bulan 1 … 3", each a small Bank balance card and, after a
 * gap, a Total invested card. A coin flies from left to right; when it lands
 * the left drops Rp 5,000,000 and the right gains it. The left starts at
 * Rp 20,000,000 every month; the right carries what was invested before.
 */
/** "Size keseluruhan 3 bulan, kecil 10%, kasih jarak lagi juga" — everything at 0.9, the rows further apart. */
const MONTH_K = 0.9;
const MONTH = {
  tag: 34 * MONTH_K,
  cardW: 560 * MONTH_K,
  cardH: 176 * MONTH_K,
  gapX: 200 * MONTH_K,
  tagGap: 34 * MONTH_K,
  label: 30 * MONTH_K,
  amount: 36, // "Nominalnya jadi 36 px deh"
  labelGap: 20,
  pad: 34 * MONTH_K,
  coinR: 26 * MONTH_K,
};
/** "buat jaraknya jadi 40 px" — a card's bottom to the next row's tag, the middle row where it was. */
const ROW_GAP = 40;
const ROW_STEP = MONTH.tag / 2 + MONTH.tagGap + MONTH.cardH + ROW_GAP;
const ROW_Y = [380 - ROW_STEP, 380, 380 + ROW_STEP];
const MONTH_X = [(theme.canvas.width - 2 * MONTH.cardW - MONTH.gapX) / 2, (theme.canvas.width + MONTH.gapX) / 2];
const SALARY = 20_000_000;
const SENT = 5_000_000;
const rp = (n: number) => `Rp ${Math.round(n).toLocaleString("en-US")}`;

const MiniBalance = ({ x, y, label, amount, swell = 0, weight = 500 }: { x: number; y: number; label: string; amount: string; swell?: number; weight?: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: MONTH.cardW, height: MONTH.cardH, borderRadius: 26, background: c.cardBg, boxShadow: shadow.soft, fontFamily: theme.text.family, color: c.ink }}>
      {/* label and amount 20 px apart ("jaraknya jadi 20 px aja"), the pair centred in the card */}
      <div style={{ position: "absolute", left: MONTH.pad, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: MONTH.labelGap }}>
        <div style={{ fontSize: MONTH.label, fontWeight: 500, lineHeight: 1 }}>{label}</div>
        {/* `swell` (0 → 1 → 0): the amount grows a little and flushes green, then settles */}
        <div style={{ position: "relative", fontSize: MONTH.amount, fontWeight: weight, lineHeight: 1, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", transformOrigin: "left center", transform: `scale(${(1 + BAL.pulse * swell).toFixed(4)})` }}>
          {amount}
          {swell > 0.001 ? <span style={{ position: "absolute", left: 0, top: 0, color: theme.color.gainGreen, opacity: swell }}>{amount}</span> : null}
        </div>
      </div>
    </div>
  );
};

/** "panjang tiap garis putusnya coba buat 7 px" */
const TRAIL = { dash: 7, gap: 7 };

const MonthRow = ({ i, at, send, out }: { i: number; at: number; send: number; out: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const life = useLife(at, out);
  if (life <= 0.001) return null;
  const top = ROW_Y[i];
  const cardTop = top + MONTH.tagGap;
  const fly = ease(f, send, m.move);
  const land = ease(f, send + m.move, m.sec(0.4));
  /* the coin, from behind this month's card to behind the one Total invested
     card (level with Bulan 2), on a low arc — it starts and ends well inside
     them, so the cards hide it at both ends */
  const x0 = MONTH_X[0] + MONTH.cardW - MONTH.coinR * 3;
  const x1 = MONTH_X[1] + MONTH.coinR * 3;
  const y0 = cardTop + MONTH.cardH / 2;
  const y1 = ROW_Y[1] + MONTH.tagGap + MONTH.cardH / 2;
  const arc = (t: number) => ({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * 60 });
  const coinX = arc(fly).x;
  const coinY = arc(fly).y;
  /* the trail it leaves: a dashed indigo line along the arc it has flown, 7 px dashes */
  const trail = fly > 0.001 ? Array.from({ length: 41 }, (_, k) => arc((fly * k) / 40)).map((p, k) => `${k ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") : "";
  const flying = fly > 0.001 && fly < 0.999;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: life }}>
      <div style={{ position: "absolute", left: MONTH_X[0], top: top - MONTH.tag / 2, fontFamily: theme.text.family, fontSize: MONTH.tag, fontWeight: 700, color: c.indigo, lineHeight: 1 }}>Bulan {i + 1}</div>
      {trail ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={trail} fill="none" stroke={c.indigo} strokeWidth={3} strokeLinecap="round" strokeDasharray={`${TRAIL.dash} ${TRAIL.gap}`} />
        </svg>
      ) : null}
      {flying ? (
        <svg width={MONTH.coinR * 2} height={MONTH.coinR * 2} style={{ position: "absolute", left: coinX - MONTH.coinR, top: coinY - MONTH.coinR }}>
          <circle cx={MONTH.coinR} cy={MONTH.coinR} r={MONTH.coinR} fill={theme.color.coinYellow} />
          <circle cx={MONTH.coinR} cy={MONTH.coinR} r={MONTH.coinR * 0.8} fill="none" stroke={c.cardBg} strokeWidth={2} />
          <text x={MONTH.coinR} y={MONTH.coinR} textAnchor="middle" dominantBaseline="central" fontFamily={theme.text.family} fontWeight={800} fontSize={MONTH.coinR * 0.72} fill={c.ink}>Rp</text>
        </svg>
      ) : null}
      {/* the card drawn over the coin: it comes out from behind it */}
      <MiniBalance x={MONTH_X[0]} y={cardTop} label="Salary Balance" amount={rp(SALARY - SENT * land)} />
    </div>
  );
};

/**
 * THE WINDING ROAD — after Simon's reference: a dashed path that turns back
 * and forth, here running left to right; a bright start point and a dot at
 * every turn, no words. Still for now — "Bikin dulu aja, nnti aku arahin
 * animasinya".
 */
const ROAD = { x0: 230, x1: 1690, top: 330, bottom: 750, turns: 5, dash: 18, gap: 14, width: 6, start: 22, dot: 11, label: 62, labelSize: 40 };
const ROAD_PATH = (() => {
  /* the start on the mid line, then a turn point alternately high and low,
     joined by S-curves with level tangents at every turn — one flowing road */
  const mid = (ROAD.top + ROAD.bottom) / 2;
  const n = ROAD.turns + 1;
  const pts = Array.from({ length: n + 1 }, (_, k) => ({
    x: ROAD.x0 + ((ROAD.x1 - ROAD.x0) * k) / n,
    y: k === 0 || k === n ? mid : k % 2 ? ROAD.top : ROAD.bottom,
  }));
  /* each stretch as a cubic, so the walker can be placed on it exactly */
  const segs = pts.slice(1).map((b, k) => {
    const a = pts[k];
    const h = (b.x - a.x) * 0.55;
    return [a, { x: a.x + h, y: a.y }, { x: b.x - h, y: b.y }, b];
  });
  const d = `M ${pts[0].x} ${pts[0].y}` + segs.map(([, p1, p2, p3]) => ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`).join("");
  return { d, segs, stops: pts.slice(1), start: pts[0], mid };
})();
const onSeg = (seg: { x: number; y: number }[], t: number) => {
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return { x: seg.reduce((s, p, i) => s + p.x * w[i], 0), y: seg.reduce((s, p, i) => s + p.y * w[i], 0) };
};
/** The six words, one at each stop the walker reaches. */
const ROAD_WORDS = ["Belajar", "Belajar", "Evaluasi", "Evaluasi", "Skill acquired", "Skill owned"];

/**
 * The road, and the white point walking it: from the start to each stop in
 * turn, eased into and out of every stop; each stop's word comes up as it
 * arrives — above a high stop, below a low one and below the end.
 */
const WindingPath = ({ at, arrivals, manageAt }: { at: number; arrivals: number[]; manageAt: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const life = useLife(at);
  if (life <= 0.001) return null;
  /* which stretch the walker is on, and how far along it */
  const departs = [at + m.reveal, ...arrivals.slice(0, -1)];
  let pos = ROAD_PATH.start;
  for (let k = 0; k < ROAD_PATH.segs.length; k++) {
    if (f >= departs[k]) pos = onSeg(ROAD_PATH.segs[k], ease(f, departs[k], arrivals[k] - departs[k]));
  }
  return (
    <div style={{ position: "absolute", inset: 0, opacity: life }}>
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={ROAD_PATH.d} fill="none" stroke={c.indigo} strokeWidth={ROAD.width} strokeLinecap="round" strokeDasharray={`${ROAD.dash} ${ROAD.gap}`} />
        {ROAD_PATH.stops.slice(0, -1).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={ROAD.dot} fill={c.cyan} stroke={c.cardBg} strokeWidth={3} />
        ))}
      </svg>
      {ROAD_PATH.stops.map((p, i) => {
        /* low stops and the end take their word underneath, clear of the road */
        const below = p.y >= ROAD_PATH.mid;
        return (
          <Say key={i} text={ROAD_WORDS[i]} x={p.x} y={p.y + (below ? 1 : -1) * ROAD.label} at={arrivals[i]} size={ROAD.labelSize} weight={700} color={c.indigo} />
        );
      })}
      {/* "Di titik terakhir 'Skill owned' lalu di bawahnya 'Manage asset'" — together with it */}
      <Say text="Manage asset" x={ROAD_PATH.stops[ROAD_PATH.stops.length - 1].x} y={ROAD_PATH.mid + ROAD.label + ROAD.labelSize * 1.3} at={manageAt} size={ROAD.labelSize} weight={700} color={c.indigo} />
      {/* the walker: a bright point with a soft halo */}
      <div style={{ position: "absolute", left: pos.x - ROAD.start, top: pos.y - ROAD.start, width: ROAD.start * 2, height: ROAD.start * 2, borderRadius: ROAD.start, background: c.cardBg, border: `${theme.shape.rule}px solid ${c.indigo}`, boxShadow: shadow.glow, boxSizing: "border-box" }} />
    </div>
  );
};

/** The dashed box, just above the caption band. */
const NOT_MONEY = { w: 980, h: 110, size: 46, y: theme.captionBand.top - 110 - 24 };

/**
 * The one Total invested card, level with Bulan 2 — drawn after the rows so
 * each coin goes in behind it. It counts 0 → Rp 15,000,000 over SC06.invested;
 * each time a coin goes in, "+Rp 5,000,000" rises over it and fades.
 */
/** The stacked gains over the card: the first `gap` above it, each next one a `step` higher. */
const GAIN = { gap: 18, step: MONTH.tag + 12 };
const Invested = ({ at, out, count, arrivals }: { at: number; out: number; count: readonly [number, number]; arrivals: number[] }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const life = useLife(at, out);
  if (life <= 0.001) return null;
  const top = ROW_Y[1] + MONTH.tagGap;
  const total = SENT * arrivals.length * ease(f, count[0], count[1] - count[0]);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: life }}>
      <MiniBalance x={MONTH_X[1]} y={top} label="Total invested" amount={rp(total)} />
      {arrivals.map((a, k) => {
        /* they stay and stack — each new one above the last ("jangan langsung
           hilang"), green, the size of "Bulan 1" */
        const t = ease(f, a, m.reveal);
        if (t <= 0.001) return null;
        return (
          <div key={k} style={{ position: "absolute", left: MONTH_X[1] + MONTH.cardW / 2, top: top - GAIN.gap - k * GAIN.step + (1 - t) * 14, transform: "translate(-50%, -100%)", opacity: t, fontFamily: theme.text.family, fontSize: MONTH.tag, fontWeight: 800, color: theme.color.gainGreen, whiteSpace: "nowrap", lineHeight: 1 }}>
            +{rp(SENT)}
          </div>
        );
      })}
    </div>
  );
};

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const L = (g: number) => local(g, BLOCK.SC06);
  const firstOut = L(B6.tuntun);
  const m = useMotion();
  return (
    <Stage>
      {/* the grid carries on from SC05 — it never scrolled */}
      <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f + BLOCK.SC06} paper={c.bg} />
      </div>
      {/* 5700: the three months, each row's coin 30 frames after the last */}
      {B6.send.map((send, i) => (
        <MonthRow key={i} i={i} at={L(B6.months) + m.fade + i * 6} send={L(send)} out={firstOut} />
      ))}
      <Invested at={L(B6.months) + m.fade + 6} out={firstOut} count={[L(B6.invested[0]), L(B6.invested[1])]} arrivals={B6.send.map((s) => L(s) + m.move)} />
      <TypeBox cx={theme.canvas.width / 2} y={NOT_MONEY.y} w={NOT_MONEY.w} h={NOT_MONEY.h} at={L(B6.notMoney)} text="Investasi bukan cuma soal uang" size={NOT_MONEY.size} closeAt={L(B6.tuntun)} />
      {/* then, once the box has closed, the winding road — still for now */}
      <WindingPath at={L(B6.tuntun) + m.sec(1.1)} arrivals={B6.walk.map(L)} manageAt={L(B6.walk[B6.walk.length - 1])} />

    </Stage>
  );
};

// ═══ SC07 — human asset vs financial asset ═══════════════════════════════
/** SC03's small question label ("Pertanyaan 1", now "Jangan cuma tanya"): size, weight, letter spacing. */
const QUIZ_LABEL = { size: 36, weight: 700, track: 2 };
/** The heading: typed at the frame's centre, then up to the top. */
const KEKAYAAN = { text: "Kekayaan punya 2 bagian", size: 64, topY: 150, cps: 1 };
/**
 * The first card, smaller: a title and its three rows, no rule, the height
 * fitted to them; it opens out from its own centre, at the frame's centre.
 */
const CARD1 = { w: 560, pad: 44, inset: 74, title: QUIZ_LABEL.size, gap: 54, row: 74, item: 38, y: 330, border: 3 };
const CARD1_H = CARD1.pad + CARD1.title + CARD1.gap + 3 * CARD1.row + CARD1.pad - CARD1.row / 2 + CARD1.item / 2;
/** Side by side: the gap between the two cards, and the note under each. */
const PAIR = { gap: 80, below: 56, note: 40 };
/** How the first card steps back when the second arrives. */
const CARD_BACK = { up: 40, opacity: 0.4, scale: 0.9 };

/** A card in the pair: white, a 3 px indigo border, its title over three rows; it opens out from its own centre. */
const PairCard = ({ title, rows, at, titleAt, rowAts, dx = 0, style }: { title: string; rows: [IconName, string][]; at: number; titleAt: number; rowAts: readonly number[]; dx?: number; style?: React.CSSProperties }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const open = ease(f, at, m.sec(0.6));
  const cardIn = ease(f, at, m.fade);
  if (cardIn <= 0.001) return null;
  const cardW = 40 + (CARD1.w - 40) * open;
  return (
    <div style={{ position: "absolute", left: (theme.canvas.width - cardW) / 2 + dx, top: CARD1.y, width: cardW, height: CARD1_H, borderRadius: theme.shape.cardRadius, background: c.cardBg, border: `${CARD1.border}px solid ${c.indigo}`, boxSizing: "border-box", opacity: cardIn, overflow: "hidden", ...style }}>
      {/* the contents keep their place while the card opens around them */}
      <div style={{ position: "absolute", left: (cardW - CARD1.w) / 2 - CARD1.border, top: -CARD1.border, width: CARD1.w, height: CARD1_H }}>
        {/* the title in the "Pertanyaan 1" label's style, left-aligned on the icons */}
        <div style={{ position: "absolute", left: CARD1.inset, top: CARD1.pad, opacity: ease(f, titleAt, m.reveal), fontFamily: theme.text.family, fontSize: QUIZ_LABEL.size, fontWeight: QUIZ_LABEL.weight, letterSpacing: QUIZ_LABEL.track, color: c.indigo, lineHeight: 1, whiteSpace: "nowrap" }}>
          {title}
        </div>
        {rows.map(([icon, label], i) => (
          <Item key={label} x={CARD1.inset} y={CARD1.pad + CARD1.title + CARD1.gap + CARD1.item / 2 + i * CARD1.row} icon={icon} label={label} tone="indigo" at={rowAts[i]} size={CARD1.item} />
        ))}
      </div>
    </div>
  );
};

export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC07);
  /* the heading: typed in the middle, then up */
  const typedAt = L(B7.heading);
  const shown = Math.max(0, Math.floor((f - typedAt) * KEKAYAAN.cps));
  const upAt = typedAt + Math.ceil(KEKAYAAN.text.length / KEKAYAAN.cps) + m.sec(0.3);
  const up = ease(f, upAt, m.move);
  const headY = theme.canvas.height / 2 + (KEKAYAAN.topY - theme.canvas.height / 2) * up;
  /* 7153: the first card steps back — up 40 px, to 40%, 10% smaller — and the second takes its place;
     7534: side by side, the first back to full on the left, the second on the right */
  const side = ease(f, L(B7.side), m.move);
  const back = ease(f, L(B7.card2), m.move) * (1 - side);
  const spread = (CARD1.w + PAIR.gap) / 2;
  return (
    <Stage>
      {f >= typedAt ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: headY - KEKAYAAN.size * 0.6, textAlign: "center", fontFamily: theme.text.family, fontSize: KEKAYAAN.size, fontWeight: 800, color: c.ink, lineHeight: 1.2, whiteSpace: "pre" }}>
          {KEKAYAAN.text.slice(0, shown)}
        </div>
      ) : null}

      <div style={{ position: "absolute", inset: 0, opacity: 1 - (1 - CARD_BACK.opacity) * back, transform: `translateY(${(-CARD_BACK.up * back).toFixed(2)}px) scale(${(1 - (1 - CARD_BACK.scale) * back).toFixed(4)})`, transformOrigin: `${theme.canvas.width / 2}px ${CARD1.y + CARD1_H / 2}px` }}>
        <PairCard title="Human Asset" rows={[["clock", "Waktu"], ["spark", "Kemampuan"], ["book", "Pengalaman"]]} at={L(B7.card1)} titleAt={L(B7.human)} rowAts={B7.humanRows.map(L)} dx={-spread * side} />
      </div>
      <PairCard title="Financial Asset" rows={[["jar", "Tabungan"], ["chart", "Investasi"], ["box", "Aset"]]} at={L(B7.card2) + m.move / 2} titleAt={Math.max(L(B7.card2) + m.move / 2, L(B7.financial))} rowAts={B7.financialRows.map(L)} dx={spread * side} />
      {/* under each, once they stand side by side */}
      <Say text="punya batas" x={theme.canvas.width / 2 - spread} y={CARD1.y + CARD1_H + PAIR.below} at={L(B7.side) + m.move} size={PAIR.note} weight={700} color={c.indigo} />
      <Say text="bisa terus dimiliki" x={theme.canvas.width / 2 + spread} y={CARD1.y + CARD1_H + PAIR.below} at={L(B7.forever)} size={PAIR.note} weight={700} color={c.indigo} />
    </Stage>
  );
};

// ═══ SC08 — over a working life, then the relay ══════════════════════════

/**
 * SC08's opening — the office and the worker. "GedungKantor.png", 1086 × 1448,
 * standing on row 1444; "Orang Kerja.png", 1312 × 1199, feet on row 1139,
 * unmirrored, so he faces the office. Both stand on the same floor line.
 */
const OFFICE = { aspect: 1086 / 1448, h: 740, x: 520, feet: 940, floor: 1444 / 1448, coinY: 420 };
const WORKER8 = { aspect: 1312 / 1199, h: 500, x: 1360, feet: 940, floor: 1139 / 1199, top: 70 / 1199 };
/** The worker's solid top, and the balance card 40 px above it ("40 px di atas Orang Kerja"). */
const WORKER8_TOP = WORKER8.feet - (WORKER8.floor - WORKER8.top) * WORKER8.h;
/**
 * The chart at 8310: three columns — the office, the worker with his balance,
 * Total invested — the two pictures at 80%, joined by dashed arrows at `linkY`.
 */
const CHART8 = { x: [330, 960, 1590], scale: 0.8, linkY: 760, links: [[570, 740], [1170, 1280]] as [number, number][] };
/** "Asset.png", 1254 × 1254, the pile's base on row 1180 — on the worker's floor line, under Total invested. */
const ASSET8 = { h: 440, floor: 1180 / 1254 };
/** What reaches Total invested at SC08.invest. */
const INVEST8 = 5_000_000;
const BAL = { w: 520, h: 150, gap: 40, label: 22, amount: 48, from: 5_000_000, to: 25_000_000, pulse: 0.15, tri: 30 };
const BAL_Y = WORKER8_TOP - BAL.gap - BAL.h;

/**
 * "UI Account balance" — SC01's balance card on its own. At `payAt` the
 * coin lands: the balance counts Rp 5,000,000 → 25,000,000 while it swells a
 * little and flushes green, then settles back to ink; a green up-triangle
 * comes in beside it as the animation starts.
 */
/** The balance card: an uppercase label over the amount, which swells green and back as it changes; an up-triangle beside it. */
const BigBalance = ({ x, y, label, amount, life, swell, tri }: { x: number; y: number; label: string; amount: string; life: number; swell: number; tri: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  if (life <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x - BAL.w / 2, top: y, width: BAL.w, height: BAL.h, borderRadius: 32, background: c.cardBg, boxShadow: shadow.soft, padding: "0 34px", boxSizing: "border-box", opacity: life, fontFamily: theme.text.family, lineHeight: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
      <div style={{ fontSize: BAL.label, fontWeight: 600, letterSpacing: 1, color: c.slate }}>{label}</div>
      {/* the amount and its triangle swell together, from the left, so they never collide */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, transformOrigin: "left center", transform: `scale(${(1 + BAL.pulse * swell).toFixed(4)})` }}>
        <div style={{ position: "relative", fontSize: BAL.amount, fontWeight: 700, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", color: c.ink }}>
          {amount}
          {swell > 0.001 ? <span style={{ position: "absolute", left: 0, top: 0, color: theme.color.gainGreen, opacity: swell }}>{amount}</span> : null}
        </div>
        {tri > 0.001 ? (
          <svg width={BAL.tri} height={BAL.tri} viewBox="0 0 30 30" style={{ opacity: tri, transform: `translateY(${((1 - tri) * 8).toFixed(2)}px)` }}>
            <path d="M15 4 L27 25 H3 Z" fill={theme.color.gainGreen} stroke={theme.color.gainGreen} strokeWidth={3} strokeLinejoin="round" />
          </svg>
        ) : null}
      </div>
    </div>
  );
};

/** A quick swell, 0 → 1 → 0, starting at `at`. */
const swellAt = (f: number, at: number, m: { sec: (s: number) => number }) => ease(f, at, m.sec(0.3)) * (1 - ease(f, at + m.sec(0.35), m.sec(0.45)));

/**
 * "UI Account balance" — at `payAt` the coin lands: Rp 5,000,000 → 25,000,000
 * with the swell and the triangle; at `sendAt` the second coin leaves and it
 * drops to Rp 20,000,000.
 */
const AccountBalance = ({ x, y, at, payAt, sendAt }: { x: number; y: number; at: number; payAt: number; sendAt: number }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const life = useLife(at);
  const balance = BAL.from + (BAL.to - BAL.from) * ease(f, payAt, m.sec(1)) - INVEST8 * ease(f, sendAt, m.sec(0.6));
  return <BigBalance x={x} y={y} label="ACCOUNT BALANCE:" amount={rp(balance)} life={life} swell={swellAt(f, payAt, m)} tri={ease(f, payAt, m.reveal)} />;
};

/** The coin from the office to the balance card, on an arc, leaving a dashed indigo trail. */
const PayCoin = ({ from, to, at, out }: { from: { x: number; y: number }; to: { x: number; y: number }; at: number; out: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const fly = ease(f, at, m.sec(1));
  if (fly <= 0.001) return null;
  const gone = ease(f, out, m.fade);
  if (gone >= 0.999) return null;
  const arc = (t: number) => ({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t - Math.sin(Math.PI * t) * 140 });
  const trail = Array.from({ length: 61 }, (_, k) => arc((fly * k) / 60)).map((p, k) => `${k ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const p = arc(fly);
  const R = 28;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - gone }}>
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={trail} fill="none" stroke={c.indigo} strokeWidth={3} strokeLinecap="round" strokeDasharray={`${TRAIL.dash} ${TRAIL.gap}`} />
      </svg>
      {fly < 0.999 ? (
        <svg width={R * 2} height={R * 2} style={{ position: "absolute", left: p.x - R, top: p.y - R }}>
          <circle cx={R} cy={R} r={R} fill={theme.color.coinYellow} />
          <circle cx={R} cy={R} r={R * 0.8} fill="none" stroke={c.cardBg} strokeWidth={2} />
          <text x={R} y={R} textAnchor="middle" dominantBaseline="central" fontFamily={theme.text.family} fontWeight={800} fontSize={R * 0.72} fill={c.ink}>Rp</text>
        </svg>
      ) : null}
    </div>
  );
};

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC08);
  /* 8083: the office out to the left, the worker and his balance over to where it stood, Total invested in from the right */
  const shift = ease(f, L(B8.shift), m.move);
  /* 8310: the office back in, the three in a row — Gedung → Orang Kerja → Asset — the pictures at 80% */
  const row = ease(f, L(B8.chart), m.move);
  const lerp = (a: number, b: number) => a + (b - a) * row;
  const officeDx = lerp(-(OFFICE.x + OFFICE.h * OFFICE.aspect) * shift, CHART8.x[0] - OFFICE.x);
  const workerDx = lerp((OFFICE.x - WORKER8.x) * shift, CHART8.x[1] - WORKER8.x);
  const investDx = (theme.canvas.width - WORKER8.x + MONTH.cardW) * (1 - ease(f, L(B8.shift) + m.sec(0.15), m.move)) + (CHART8.x[2] - WORKER8.x) * row;
  const k = 1 - (1 - CHART8.scale) * row;
  const links = ease(f, L(B8.chart) + m.move, m.sec(0.5));
  /* 8138: a coin from the balance to Total invested; it lands a second later and the card counts 0 → 5,000,000 */
  const landAt = L(B8.invest) + m.sec(1);
  const invested = INVEST8 * ease(f, landAt, m.sec(0.6));
  return (
    <Stage>
      {/* 7883: the office pays — drawn first, so the coin comes out from behind the office and
          goes in behind the card; its trail goes as the office leaves */}
      <PayCoin from={{ x: OFFICE.x, y: OFFICE.coinY }} to={{ x: WORKER8.x - BAL.w / 2 + 60, y: BAL_Y + BAL.h / 2 }} at={L(B8.pay)} out={L(B8.shift)} />
      {/* 7803: the office on the left; on the right the worker, his account balance 40 px over him —
          the rest of 7803-8750 removed ("Visual dari 7803-8750 remove aja") */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${officeDx.toFixed(2)}px) scale(${k.toFixed(4)})`, transformOrigin: `${OFFICE.x}px ${OFFICE.feet}px` }}>
          <Cutout src="art/vi01/gedung-kantor.png" aspect={OFFICE.aspect} x={OFFICE.x} y={OFFICE.feet + (1 - OFFICE.floor) * OFFICE.h} h={OFFICE.h} at={L(B8.office) + m.sec(0.25)} shadow floor={OFFICE.floor} />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${workerDx.toFixed(2)}px) scale(${k.toFixed(4)})`, transformOrigin: `${WORKER8.x}px ${WORKER8.feet}px` }}>
          <Cutout src="art/vi01/orang-kerja.png" aspect={WORKER8.aspect} x={WORKER8.x} y={WORKER8.feet + (1 - WORKER8.floor) * WORKER8.h} h={WORKER8.h} at={L(B8.office)} shadow floor={WORKER8.floor} />
        </div>
      </div>
      {/* the second coin, drawn under both cards: out of the balance, into Total invested */}
      <PayCoin from={{ x: OFFICE.x + BAL.w / 2 - 60, y: BAL_Y + BAL.h / 2 }} to={{ x: WORKER8.x - BAL.w / 2 + 60, y: BAL_Y + BAL.h / 2 }} at={L(B8.invest)} out={L(B8.chart)} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${workerDx.toFixed(2)}px) scale(${k.toFixed(4)})`, transformOrigin: `${WORKER8.x}px ${WORKER8.feet}px` }}>
        <AccountBalance x={WORKER8.x} y={BAL_Y} at={L(B8.office) + m.sec(0.15)} payAt={L(B8.pay) + m.sec(1)} sendAt={L(B8.invest)} />
      </div>
      {/* …and Total invested, in from the right where the worker was */}
      {f >= L(B8.shift) ? (
        /* scaled with the row, about the worker's feet ("scalenya anchor to Orang Kerja") */
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${investDx.toFixed(2)}px) scale(${k.toFixed(4)})`, transformOrigin: `${(WORKER8.x + workerDx - investDx).toFixed(2)}px ${WORKER8.feet}px` }}>
          {/* level with Account balance, in its style, its triangle as it pulses */}
          <BigBalance x={WORKER8.x} y={BAL_Y} label="TOTAL INVESTED:" amount={rp(invested)} life={1} swell={swellAt(f, landAt, m)} tri={ease(f, landAt, m.reveal)} />
          {/* "tambahkan Asset.png di bawah UI Total invested" — with the row */}
          <Cutout src="art/vi01/asset.png" aspect={1} x={WORKER8.x} y={WORKER8.feet + (1 - ASSET8.floor) * ASSET8.h} h={ASSET8.h} at={L(B8.chart)} shadow floor={ASSET8.floor} />
        </div>
      ) : null}
      {/* the chart's links, once the three stand in a row: dashed indigo arrows, Gedung → Orang Kerja → Asset */}
      {links > 0.001 ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          {CHART8.links.map(([x0, x1], i) => {
            const x = x0 + (x1 - x0) * links;
            return (
              <g key={i}>
                <line x1={x0} y1={CHART8.linkY} x2={x - 10} y2={CHART8.linkY} stroke={c.indigo} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${TRAIL.dash} ${TRAIL.gap}`} />
                {links > 0.95 ? <path d={`M ${x1} ${CHART8.linkY} l -16 -10 v 20 z`} fill={c.indigo} /> : null}
              </g>
            );
          })}
        </svg>
      ) : null}
    </Stage>
  );
};

