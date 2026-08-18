/**
 * TitleBlock.tsx — the episode's header pair: the title over its sub-line.
 *
 * [NEEDS COPY] SUBTITLE is empty until the script names it. The block reserves
 * the sub-line's height either way, so filling it in later moves nothing.
 *
 * Two states, both here: TITLE_BIG in the middle of the frame, TITLE_REST up
 * in the title strip. A scene that travels the block between them and the scene
 * that then holds it must read the SAME component and the SAME rest constants —
 * that is the only way the last frame of one and the first frame of the other
 * can be identical. Matching two hand-written copies by eye survives exactly
 * until the next edit.
 *
 * The sub-line's space is RESERVED even while it is invisible, so the title
 * never jumps as the sub fades in: the block is anchored by its centre.
 */
import { theme } from "../theme";

export const TITLE = "Moving average";
export const SUBTITLE = "";

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
  opacity = 1,
}: {
  cy?: number;
  titleSize?: number;
  subSize?: number;
  head?: { opacity: number; dy: number };
  tail?: { opacity: number; dy: number };
  /** Fades the whole block — SC03 clears it on its way out. */
  opacity?: number;
}) => (
  <div
    style={{
      position: "absolute",
      opacity,
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
