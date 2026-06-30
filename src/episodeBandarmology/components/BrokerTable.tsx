/**
 * BrokerTable — headed data table (configurable columns). Right-aligned numerics.
 * Supports a highlighted row (cyan tint) and an animated re-sort: pass
 * `sort={{ order, t }}` where `order` lists row indices in the target display
 * order and `t` (0→1) blends each row from its base slot to its sorted slot.
 */
import { theme } from "../theme";

const { colors, font, type, radius } = theme;

export type Col = { key: string; label: string; align?: "left" | "right"; flex?: number };
export type TableRow = { cells: Record<string, string | number>; highlight?: boolean };

export const BrokerTable = ({
  left,
  top,
  width,
  title,
  columns,
  rows,
  sort,
  rowH = 64,
  revealCount,
  op = 1,
}: {
  left: number;
  top: number;
  width: number;
  title?: string;
  columns: Col[];
  rows: TableRow[];
  sort?: { order: number[]; t: number };
  rowH?: number;
  revealCount?: number;
  op?: number;
}) => {
  const headerH = title ? 96 : 52;
  const totalFlex = columns.reduce((s, c) => s + (c.flex ?? 1), 0);
  const shown = revealCount ?? rows.length;

  const slotOf = (i: number) => {
    if (!sort) return i;
    const target = sort.order.indexOf(i);
    return i + (target - i) * sort.t;
  };

  const Cells = ({ row }: { row: TableRow }) => (
    <>
      {columns.map((c) => (
        <div
          key={c.key}
          style={{
            width: `${((c.flex ?? 1) / totalFlex) * 100}%`,
            textAlign: c.align ?? "left",
            padding: "0 18px",
            fontSize: type.descriptor,
            fontWeight: c.align === "right" ? font.weights.medium : font.weights.bold,
            color: c.align === "right" ? colors.slate : colors.text,
            fontVariantNumeric: "tabular-nums",
            boxSizing: "border-box",
          }}
        >
          {row.cells[c.key]}
        </div>
      ))}
    </>
  );

  return (
    <div style={{ position: "absolute", left, top, width, height: headerH + rows.length * rowH, opacity: op, background: colors.cardWhite, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, overflow: "hidden" }}>
      {title && (
        <div style={{ padding: "20px 18px 8px", fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.text }}>{title}</div>
      )}
      {/* column header */}
      <div style={{ position: "absolute", left: 0, top: title ? 70 : 0, width: "100%", height: 52, display: "flex", alignItems: "center", background: colors.indigoSoft, fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slate }}>
        {columns.map((c) => (
          <div key={c.key} style={{ width: `${((c.flex ?? 1) / totalFlex) * 100}%`, textAlign: c.align ?? "left", padding: "0 18px", boxSizing: "border-box" }}>{c.label}</div>
        ))}
      </div>
      {/* rows */}
      {rows.map((row, i) =>
        i < shown ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: headerH + slotOf(i) * rowH,
              width: "100%",
              height: rowH,
              display: "flex",
              alignItems: "center",
              background: row.highlight ? colors.cyanTint : "transparent",
              borderBottom: `1px solid ${colors.divider}`,
              boxSizing: "border-box",
            }}
          >
            <Cells row={row} />
          </div>
        ) : null,
      )}
    </div>
  );
};
