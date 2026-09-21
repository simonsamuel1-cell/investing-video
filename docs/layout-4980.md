# Layout format — "Case-study collapsed" (frame 4980)

The static arrangement seen at frame **4980** (the collapsed state of a case-study
scene: SC09 Hammer). This documents **layout only** — positions, sizes, and style
tokens — not the animation/timings that build it. Reuse it for any "one pattern +
its context" frame (this is exactly what the frame-9000 end-card freezes).

All coordinates are in canvas pixels. **Canvas: 1920 × 1080**, background
`theme.colors.bg` (#F5F5F5). Origin top-left.

```
 ┌────────────────────────────────────────────────────────────────[logo]──┐
 │  Hammer | Bullish Engulfing | Shooting Star | Bearish Engulfing        │  header
 │  ───────────────────────────────────────────────────  (rule)          │
 │                                                                        │
 │  ┌────────────┐        ┌───────────────────────────────────┐  Rp …    │
 │  │ left chart │        │                                   │  Rp …    │
 │  │ (1 candle) │        │        right chart (context)      │  Rp …    │
 │  └────────────┘        │                                   │          │
 │                        │                                   │          │
 │                        └───────────────────────────────────┘          │
 │  only illustration                                                     │
 └────────────────────────────────────────────────────────────────────────┘
```

## Elements (back → front)

### 1. Brand watermark
Full-frame 1920×1080 PNG (`public/watermark.png`), centered — its logo sits in the
top-right zone (≈ x 1540–1824, y 54–150). Whole-episode overlay.

### 2. Header — the 4 pattern tabs + rule
`CaseStudyTabs`. Four tabs in one row, split by thin vertical dividers, with a
horizontal rule beneath. The whole header is drawn at native size then transformed:
`transform: translate(22px, 17px) scale(0.8855)` (origin 0 0), which **left-aligns
the rule to the left chart** and grows rightward.

| Item | Value |
|---|---|
| Rule | y ≈ **176**, spans x ≈ **194 → 1483**, 2px, `neutralMuted` |
| Tabs baseline (bottom) | y ≈ **150** |
| Active tab | ~35px, bold; **green** (`candleGreen`) for Hammer/Bullish Engulfing, **red** (`candleRed`) for Shooting Star/Bearish Engulfing |
| Inactive tab | ~32px, regular, `slate` at 40% opacity |
| Dividers | 2px × ~40px, `neutralMuted`, evenly distributed |

### 3. Left chart — single-candle panel (small)
The candle panel, collapsed to **70%** and moved left so its left edge meets the
chart's left edge.

| | Value |
|---|---|
| x (left) | **194** |
| y (top) | **220** |
| width | ≈ **389** |
| height | ≈ **315** (bottom ≈ 535) |
| style | white (`neutralFill`) rounded rect, 1px `neutralLine` border, radius `panel` |
| content | one candle, centered; faint gridlines |

### 4. Right chart — context panel (large)
The wide "context" chart.

| | Value |
|---|---|
| x (left) | **603** |
| y (top) | **220** |
| width | ≈ **1047** |
| height | **680** (bottom **900**) |
| style | white (`neutralFill`) rounded rect, 1px `neutralLine` border, radius `panel` |
| price axis | "Rp X,XXX" labels just outside the right edge (~x 1670), 24px |

### 5. Illustration tag
`only illustration`, 24px, muted — flush to the bottom-left safe corner.

## Section title (frame-9000 variant only)
When this layout is reused as the end-card, a title sits between the rule and the
charts: **"Use cases of candlestick patterns"**, indigo, 36px, weight 600,
**left-aligned to x 194**. In that variant the title + both charts are nudged
**+20px** down (charts top → 240) and the header is raised so nothing overlaps.

## Derivation (so the numbers stay consistent)
From `sessionGeom({ x: 96, width: 1536, panelGap: 20, centered: true, centerNudge: 30 })`:
`centerOffset = 118`, `rightW = 515.28`. Then (see `CaseStudyScene.tsx`):
- `MOVED_LEFT = 96 − 20 + 118 = 194`
- `MOVED_W = (515.28 + 40) × 0.7 ≈ 389`
- `MOVED_TOP = 240 − 20 = 220`
- `CTX_X = MOVED_LEFT + MOVED_W + 20 ≈ 603`
- `CTX_W = 1650 − CTX_X ≈ 1047`, `CTX_H = 900 − 220 = 680`

## Type / color tokens (from `theme.ts`)
- Background `bg` #F5F5F5 · panels `neutralFill` (white) · borders `neutralLine`
- Dividers/rule `neutralMuted` · grey text `slate`
- Green `candleGreen` · red `candleRed` · accent/indigo `indigo`
- Font: **Plus Jakarta Sans** everywhere.
