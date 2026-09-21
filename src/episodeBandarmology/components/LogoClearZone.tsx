/**
 * LogoClearZone — dev-only outline of the top-right 360×150 logo reserve. NOT a
 * visual in the final render; pass __debug to verify the zone stays empty. The
 * invariant it documents: content in the top 150px must end at x ≤ 1368 (§0.5).
 */
import { theme } from "../theme";

const { logoZone } = theme.layout;

export const LogoClearZone = ({ __debug = false }: { __debug?: boolean }) =>
  __debug ? (
    <div
      style={{
        position: "absolute",
        left: logoZone.x,
        top: logoZone.y,
        width: logoZone.w,
        height: logoZone.h,
        outline: "1px dashed rgba(0,0,0,0.45)",
        pointerEvents: "none",
      }}
    />
  ) : null;
