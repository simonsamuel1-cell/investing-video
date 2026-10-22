/**
 * core/typeScale.ts — the VI type scale as a style. A scene writes `style={{ ...typeStyle("title"), color: c.ink }}`
 * and never types a font size of its own: five levels (theme.type), so two videos cannot drift apart in type.
 */
import type { CSSProperties } from "react";
import { theme } from "./theme";

export type TypeLevel = keyof typeof theme.type;
export const TYPE_LEVELS = Object.keys(theme.type) as TypeLevel[];

export const typeStyle = (level: TypeLevel): CSSProperties => {
  const t = theme.type[level];
  return { fontFamily: theme.text.family, fontSize: t.size, fontWeight: t.weight, letterSpacing: t.tracking, lineHeight: t.leading };
};
