/**
 * PatternTabRow — the four pattern-family tabs used across SC13A–D. Geometry from
 * docs/layout-4980.md: row x 194→1483, y-band 104→168, 4 tabs (gap 24), header
 * rule at y≈176. Tab states:
 *   done    — label 40%, small indigo check top-right, no rule segment
 *   active  — label full ink, 4px rule segment beneath (bullish/bearish token)
 *   pending — label 70%, no rule segment
 * Static renderer: scenes drive reveal via per-tab `labelReveal`/`checkPop` and
 * the `ruleDraw` progress (0–1). tabRuleBullish/tabRuleBearish only — never the
 * candle tokens directly.
 */
import { theme } from "../theme";

export type TabState = "done" | "active" | "pending";
export type PatternTab = {
  label: string; // "\n" for a two-line label
  state: TabState;
  ruleColor?: "green" | "red"; // active only
  labelReveal?: { opacity: number; y: number }; // default fully revealed
  checkPop?: number; // 0–1, done only
  wash?: number; // 0–1 indigoTint wash behind a pending tab (SC13A)
};

export const TAB_X1 = 194;
export const TAB_X2 = 1483;
export const TAB_GAP = 24;
export const RULE_Y = 176;
const TAB_BAND_TOP = 104;
const TAB_BAND_BOTTOM = 168;
const N = 4;
export const TAB_W = (TAB_X2 - TAB_X1 - (N - 1) * TAB_GAP) / N; // ≈304.25
const tabX = (i: number) => TAB_X1 + i * (TAB_W + TAB_GAP);

const Check = ({ pop }: { pop: number }) => (
  <svg width={28} height={28} viewBox="0 0 28 28" style={{ transform: `scale(${0.82 + 0.18 * pop})`, opacity: pop }}>
    <circle cx={14} cy={14} r={13} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} />
    <path d="M8 14.5 L12.5 19 L20 9.5" fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PatternTabRow = ({ tabs, ruleDraw = 1 }: { tabs: PatternTab[]; ruleDraw?: number }) => {
  return (
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      {tabs.map((t, i) => {
        const x = tabX(i);
        const cx = x + TAB_W / 2;
        const bandCy = (TAB_BAND_TOP + TAB_BAND_BOTTOM) / 2;
        const reveal = t.labelReveal ?? { opacity: 1, y: 0 };
        const inkOpacity = t.state === "done" ? 0.4 : t.state === "pending" ? 0.7 : 1;
        return (
          <div key={i}>
            {/* pending wash */}
            {t.wash ? (
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: TAB_BAND_TOP - 8,
                  width: TAB_W,
                  height: TAB_BAND_BOTTOM - TAB_BAND_TOP + 16,
                  background: theme.colors.indigoTint,
                  borderRadius: theme.radius.chip,
                  opacity: t.wash,
                }}
              />
            ) : null}
            {/* label */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: bandCy,
                width: TAB_W,
                transform: `translateY(-50%) translateY(${reveal.y}px)`,
                textAlign: "center",
                whiteSpace: "pre-line",
                lineHeight: 1.15,
                fontFamily: theme.type.family,
                fontSize: theme.type.label.size,
                fontWeight: theme.type.label.weight,
                color: theme.colors.ink,
                opacity: reveal.opacity * inkOpacity,
              }}
            >
              {t.label}
            </div>
            {/* done check, top-right of the tab */}
            {t.state === "done" && (t.checkPop ?? 1) > 0.001 && (
              <div style={{ position: "absolute", left: x + TAB_W - 30, top: TAB_BAND_TOP - 6 }}>
                <Check pop={t.checkPop ?? 1} />
              </div>
            )}
            {/* active rule segment beneath */}
            {t.state === "active" && (
              <div
                style={{
                  position: "absolute",
                  left: cx - (TAB_W * 0.5) / 2,
                  top: RULE_Y - 1,
                  width: TAB_W * 0.5,
                  height: 4,
                  background: t.ruleColor === "red" ? theme.colors.tabRuleBearish : theme.colors.tabRuleBullish,
                  borderRadius: 2,
                }}
              />
            )}
          </div>
        );
      })}
      {/* header rule (hairline), draws left→right */}
      {ruleDraw > 0.001 && (
        <div style={{ position: "absolute", left: TAB_X1, top: RULE_Y, width: (TAB_X2 - TAB_X1) * ruleDraw, height: theme.stroke.hairline, background: theme.colors.neutralMuted }} />
      )}
    </div>
  );
};
