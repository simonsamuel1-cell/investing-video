/**
 * core/Captions.tsx — the burned-in subtitles, inside the reserved bottom band.
 *
 * That band is the one region every scene keeps visually empty, which is what
 * makes burning them in safe.
 *
 * Mount at the composition ROOT, OUTSIDE every Sequence, so the frame it reads
 * is the global one.
 *
 * Pass `show={false}` for a clean plate.
 *
 * `mute` silences a stretch of cues WITHOUT touching the generated file — for a
 * scene that puts the same words on the frame itself, where the band underneath
 * would only say them twice. Matched on a cue's START, so a cue is either shown
 * whole or not at all; matching on overlap would clip a line mid-phrase at the
 * window's edge.
 *
 * `second` adds a second language under the first, cue for cue (VI02, Simon 26 Nov: Indonesian and Mandarin in one
 * video), in its own face (`secondFamily`, e.g. Noto Sans SC — Plus Jakarta has no CJK); `secondOnTop` puts it above
 * and `sizes` = [first, second] in px (VI02: Mandarin on top at 40, Indonesian under it at 30 — Simon 26 Nov); both
 * lines still fit the 108px band. Without `second` nothing changes. `lift` raises the block by that many px (VI02's two
 * lines, Simon 26 Nov: "geser naik sedikit" — measured against the lowest scene content first).
 *
 * CUES ARE GENERATED, NEVER HAND-TYPED — from the corrected SRT, at the
 * Composition's fps. See scripts/srt-to-cues.ts.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";

export type Cue = { start: number; end: number; text: string };

/** `<i>…</i>` in a cue is italic, as an SRT writes it. */
const cueText = (text: string) => text.split(/<i>(.*?)<\/i>/).map((t, i) => (i % 2 ? <i key={i}>{t}</i> : t));

export const Captions = ({
  cues,
  show = true,
  mute,
  second,
  secondFamily,
  secondOnTop = false,
  sizes,
  lift = 0,
}: {
  cues: Cue[];
  show?: boolean;
  /** A second language, cue for cue with `cues` (same start/end), drawn under it (above with `secondOnTop`). */
  second?: Cue[];
  secondFamily?: string;
  secondOnTop?: boolean;
  /** [the first language's size, the second's], px; defaults: body size and a step under it */
  sizes?: [number, number];
  /** px the block sits higher than the band's centre */
  lift?: number;
  /** Frame ranges whose cues are not drawn. Half-open: `to` is excluded. */
  mute?: readonly { from: number; to: number }[];
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (!show) return null;
  const cue = cues.find((q) => f >= q.start && f < q.end);
  if (!cue) return null;
  if (mute?.some((r) => cue.start >= r.from && cue.start < r.to)) return null;
  const two = second?.find((q) => q.start === cue.start && q.end === cue.end);
  const [size1, size2] = sizes ?? [theme.text.body.size, Math.round(theme.text.body.size * 0.83)];
  const line = (text: string, family: string, size: number) => (
    <span style={{ fontFamily: family, fontSize: size, fontWeight: 500, lineHeight: 1.2, color: c.indigo, textAlign: "center" }}>
      {cueText(text)}
    </span>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: theme.captionBand.top - lift,
        width: theme.canvas.width,
        height: theme.captionBand.height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: two ? 2 : 0,
        padding: `0 ${theme.margin.left}px`,
        boxSizing: "border-box",
      }}
    >
      {secondOnTop && two && line(two.text, secondFamily ?? theme.text.family, size2)}
      {line(cue.text, theme.text.family, size1)}
      {!secondOnTop && two && line(two.text, secondFamily ?? theme.text.family, size2)}
    </div>
  );
};
