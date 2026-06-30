/**
 * StepRail — persistent Screen / Verify / Monitor 3-step indicator (Scenes
 * 22–33). The active step is indigo-filled; the others are muted white cards.
 * Sits in the top band but ends at x ≤ 1368 to respect the logo clear-zone.
 * Stateless — WorkflowStage cross-fades two rails at each boundary.
 */
import { theme } from "../theme";

const { colors, radius, font, type } = theme;

const STEPS = ["Screen", "Verify", "Monitor"] as const;

const RAIL_LEFT = 96;
const RAIL_TOP = 70;
const RAIL_W = 1180; // ends at 1276 ≤ 1368
const GAP = 22;
const CARD_W = (RAIL_W - GAP * 2) / 3;
const CARD_H = 100;

export const StepRail = ({ active, op = 1 }: { active: 1 | 2 | 3 | null; op?: number }) => (
  <div style={{ position: "absolute", left: RAIL_LEFT, top: RAIL_TOP, width: RAIL_W, height: CARD_H, opacity: op }}>
    {STEPS.map((label, i) => {
      const n = (i + 1) as 1 | 2 | 3;
      const on = active === n;
      return (
        <div
          key={label}
          style={{
            position: "absolute",
            left: i * (CARD_W + GAP),
            top: 0,
            width: CARD_W,
            height: CARD_H,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 26px",
            boxSizing: "border-box",
            background: on ? colors.indigo : colors.white,
            border: `2px solid ${on ? colors.indigo : colors.divider}`,
            borderRadius: radius.md,
            color: on ? colors.white : colors.slateMute,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: radius.pill,
              background: on ? colors.white : colors.divider,
              color: on ? colors.indigo : colors.slateMute,
              fontSize: type.descriptor,
              fontWeight: font.weights.extrabold,
            }}
          >
            {n}
          </span>
          <span style={{ fontSize: type.subhead, fontWeight: font.weights.bold }}>{label}</span>
        </div>
      );
    })}
  </div>
);
