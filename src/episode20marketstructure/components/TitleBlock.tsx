/**
 * TitleBlock.tsx — the episode's header pair, "Market structure" over
 * "Struktur pergerakan harga".
 *
 * SC02 builds it in the middle of the frame and travels it up to the title
 * strip; SC03 simply holds it where SC02 left it. Both read the SAME component
 * and the SAME rest constants, which is the only way the last frame of one and
 * the first frame of the other can be identical — matching two hand-written
 * copies by eye survives exactly until the next edit.
 *
 * The sub-line's space is RESERVED even while it is invisible, so the title
 * never jumps as the sub fades in: the block is anchored by its centre.
 */
import { theme } from "../theme";

export const TITLE = "Market structure";
export const SUBTITLE = "Struktur pergerakan harga";

/** The sub-line reads 4px smaller than the body size. */
const SUB_TRIM = 4;
/** Centre-frame state, before the pair travels up. */
export const TITLE_BIG = { title: 96, sub: 48 - SUB_TRIM };
/** Working state — matches the episode's standard header exactly. */
export const TITLE_REST = { title: theme.text.title.size, sub: theme.text.body.size - SUB_TRIM };
/** Reserved sub-line height at a given size, so the block's height is stable. */
export const subBlock = (size: number) => 8 + size * 1.2;
/** Centre placed so the TITLE line itself sits on the canvas centre. */
export const TITLE_BIG_CY = theme.canvas.height / 2 + subBlock(TITLE_BIG.sub) / 2;
export const TITLE_REST_CY = theme.stage.title.y;

export const TitleBlock = ({
  cy = TITLE_REST_CY,
  titleSize = TITLE_REST.title,
  subSize = TITLE_REST.sub,
  head = { opacity: 1, dy: 0 },
  tail = { opacity: 1, dy: 0 },
}: {
  cy?: number;
  titleSize?: number;
  subSize?: number;
  head?: { opacity: number; dy: number };
  tail?: { opacity: number; dy: number };
}) => (
  <div
    style={{
      position: "absolute",
      left: theme.canvas.width / 2,
      top: cy,
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        fontSize: titleSize,
        fontWeight: theme.text.title.weight,
        color: theme.color.indigo,
        opacity: head.opacity,
        transform: `translateY(${head.dy}px)`,
      }}
    >
      {TITLE}
    </div>
    {/* rendered from the start so the block's height never changes */}
    <div
      style={{
        marginTop: 8,
        fontSize: subSize,
        fontWeight: theme.text.body.weight,
        color: theme.color.slate,
        opacity: tail.opacity,
        transform: `translateY(${tail.dy}px)`,
      }}
    >
      {SUBTITLE}
    </div>
  </div>
);
