/**
 * TickerGrid — the overwhelming wall of tickers for S1 (scrolling fast,
 * flickering, too dense to read) and S2 (`frozen`: motion stops, desaturates to
 * grey-on-silver). Data is deterministic (a sin-hash on the tile index — no
 * Math.random, so it renders identically across threads). Placeholder data only;
 * never a real ticker (§2). Tiles are purple/cyan/neutral.
 */
import { useCurrentFrame } from "remotion";
import { COLORS, USABLE } from "../theme";

const COLS = 6;
const BLOCK_ROWS = 8; // one seamless block; rendered twice → 16 rows
const ROW_PITCH = 150; // gridAutoRows 138 + rowGap 12
const PERIOD = BLOCK_ROWS * ROW_PITCH; // 1200 — scroll loop length
const SPEED = 7; // px/frame

// Real IDX (Indonesia Stock Exchange) tickers — one per tile so the wall reads as
// the Indonesian index. There are exactly BLOCK_ROWS×COLS (48) data tiles, so this
// list is sized to give every tile a distinct code. Prices/%s remain placeholder.
const TICKERS = [
  "BBCA", "BBRI", "BMRI", "BBNI", "TLKM", "ASII", "UNVR", "ICBP",
  "INDF", "KLBF", "GOTO", "ANTM", "ADRO", "PTBA", "PGAS", "SMGR",
  "INTP", "UNTR", "ACES", "AMRT", "MAPI", "EXCL", "ISAT", "TOWR",
  "MEDC", "ITMG", "INKP", "CPIN", "JPFA", "BRPT", "TPIA", "ARTO",
  "BUKA", "AKRA", "CTRA", "BSDE", "PWON", "MNCN", "SCMA", "HMSP",
  "GGRM", "MYOR", "SIDO", "TKIM", "BRIS", "MDKA", "INCO", "EMTK",
];
const hash = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const tile = (i: number) => {
  const code = TICKERS[i % TICKERS.length];
  const price = Math.floor(80 + hash(i, 5) * 4200);
  const pctRaw = (hash(i, 6) - 0.5) * 16;
  const pct = `${pctRaw >= 0 ? "+" : "−"}${Math.abs(pctRaw).toFixed(1)}%`;
  const colorIdx = Math.floor(hash(i, 7) * 3); // 0 purple, 1 cyan, 2 neutral
  return { code, price, pct, colorIdx };
};

const INK = [
  { border: COLORS.purpleLight, fg: COLORS.purple },
  { border: COLORS.cyanLight, fg: COLORS.cyanDark },
  { border: COLORS.hairline, fg: COLORS.ink },
];

export const TickerGrid = ({ frozen = false }: { frozen?: boolean }) => {
  const frame = useCurrentFrame();
  const ty = frozen ? -420 : -((frame * SPEED) % PERIOD);

  const cells = [];
  for (let r = 0; r < BLOCK_ROWS * 2; r++) {
    for (let c = 0; c < COLS; c++) {
      const dataIdx = (r % BLOCK_ROWS) * COLS + c;
      const idx = r * COLS + c;
      cells.push({ key: idx, ...tile(dataIdx) });
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: USABLE.x,
        top: USABLE.y,
        width: USABLE.w,
        height: USABLE.h,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridAutoRows: "138px",
          columnGap: 16,
          rowGap: 12,
          transform: `translateY(${ty}px)`,
        }}
      >
        {cells.map((t) => {
          const skin = frozen
            ? { border: COLORS.hairline, fg: "#9AA0AA" }
            : INK[t.colorIdx];
          const flicker = frozen
            ? 0.5
            : 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.22 + t.key * 1.3));
          return (
            <div
              key={t.key}
              style={{
                height: 138,
                borderRadius: 14,
                border: `1.5px solid ${skin.border}`,
                background: frozen ? "rgba(255,255,255,0.40)" : "rgba(255,255,255,0.66)",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: flicker,
                filter: frozen ? "grayscale(1)" : "none",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 800, color: skin.fg, letterSpacing: 0.5 }}>
                {t.code}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <span style={{ fontSize: 26, fontWeight: 600, color: COLORS.black }}>
                  {t.price.toLocaleString("en-US")}
                </span>
                <span style={{ fontSize: 24, fontWeight: 700, color: skin.fg }}>{t.pct}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
