/**
 * ReadingCard.tsx — SC05's closing picture, as one object.
 *
 * The reading chart at its final pitch: every bar across the card, the orange
 * twenty and the indigo two hundred, both crossing boxes with their pills, and
 * the line the scene leaves you with. Drawn from `READING_FINAL` — SC05's own
 * data — so it is the picture, not a likeness of it.
 *
 * ═══ WHY IT IS A COMPONENT AND NOT INLINE ═══
 *
 * Two places need it and they used to disagree.
 *
 * The closing roadmap at 4160 shrinks this picture into the Moving Average
 * card, and drew it inline. The roadmap's OWN thumbnail for that same card —
 * used whenever the card is not the one catching a shrink — drew two bare
 * average lines and no candles, stretched to their own range. So the card
 * showed one thing at 4205 and something else entirely at 610 and 6070, and
 * the something else did not look like a chart.
 *
 * A card that names a chapter should show the chapter. Both call sites now
 * render this, so they cannot drift apart again.
 *
 * It draws in CANVAS coordinates, at `READING_FINAL.box`. Callers that want it
 * small scale it and clip it — see `RoadmapCards`.
 */
import { Layer } from "./ChartFrame";
import { HighlightBox } from "./HighlightBox";
import { QuoteBox } from "./QuoteBox";
import { READING_FINAL as R } from "../scenes/Scene05";
import { theme } from "../theme";

/** A series as a path in the chart's final grid. */
const pathOf = (v: (number | null)[]) => {
  let d = "";
  v.forEach((n, i) => {
    if (n === null) return;
    d += `${d === "" ? "M" : "L"}${R.x(i).toFixed(1)},${R.y(n).toFixed(1)} `;
  });
  return d.trim();
};

export const ReadingCard = ({ f }: { f: number }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: R.box.x,
        top: R.box.y,
        width: R.box.w,
        height: R.box.h,
        borderRadius: theme.layout.radius.lg,
        background: theme.colors.surface,
        border: `${theme.layout.border.thin}px solid ${theme.colors.border}`,
      }}
    />

    <Layer>
      <defs>
        <clipPath id="readingCard">
          <rect
            x={R.box.x}
            y={R.box.y}
            width={R.box.w}
            height={R.box.h}
            rx={theme.layout.radius.lg}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#readingCard)">
        {R.bars.map((b, i) => {
          const x = R.x(i);
          const top = Math.min(R.y(b.o), R.y(b.c));
          const h = Math.max(1.5, Math.abs(R.y(b.c) - R.y(b.o)));
          /* one bar, one colour — see ChartFrame */
          const fill =
            b.c >= b.o ? theme.colors.candleGreen : theme.colors.candleRed;
          return (
            <g key={i}>
              <line
                x1={x}
                y1={R.y(b.h)}
                x2={x}
                y2={R.y(b.l)}
                stroke={fill}
                strokeWidth={theme.layout.stroke.wick}
              />
              <rect
                x={x - R.bodyW / 2}
                y={top}
                width={R.bodyW}
                height={h}
                fill={fill}
              />
            </g>
          );
        })}

        {[
          { v: R.slow, c: theme.colors.indigo },
          { v: R.ma, c: theme.colors.maOrange },
        ].map((l) => (
          <path
            key={l.c}
            d={pathOf(l.v)}
            fill="none"
            stroke={l.c}
            strokeWidth={theme.layout.stroke.ma}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
    </Layer>

    {/* the two crossing boxes, found the same way SC05 finds them */}
    {R.marks.map((m) => {
      const up = !m.above;
      const lo = Math.max(0, m.i - R.markBox.bars);
      const hi = Math.min(R.bars.length - 1, m.i + R.markBox.bars);
      const yCross = R.y(R.fast[m.i] as number);
      let far = yCross;
      for (let i = lo; i <= hi; i++) {
        const v = up ? R.y(R.bars[i].h) : R.y(R.bars[i].l);
        far = up ? Math.min(far, v) : Math.max(far, v);
      }
      return (
        <HighlightBox
          key={m.text}
          x1={R.x(lo) - R.markBox.pad + R.markBox.trimX}
          x2={R.x(hi) + R.markBox.pad - R.markBox.trimX}
          y1={
            up ? far - R.markBox.pad : yCross - R.markBox.pad - R.markBox.overCross
          }
          y2={
            up ? yCross + R.markBox.pad + R.markBox.overCross : far + R.markBox.pad
          }
          f={f}
          /* already open — a caller inherits this picture, it does not play it */
          at={-999}
          over={1}
          fill={R.markBox.fill}
        />
      );
    })}

    {R.marks.map((m) => (
      <div
        key={m.text}
        style={{
          position: "absolute",
          left: R.x(m.i) + R.mark.r + R.mark.gap,
          top:
            R.y(R.fast[m.i] as number) +
            (m.above ? -R.mark.r - R.mark.gap : R.mark.r + R.mark.gap),
          transform: m.above ? "translateY(-100%)" : undefined,
          background: m.fill,
          color: theme.colors.surface,
          borderRadius: theme.layout.radius.sm,
          padding: `${R.mark.padY}px ${R.mark.padX}px`,
          fontFamily: theme.type.family,
          fontSize: R.mark.size,
          fontWeight: theme.type.label.weight,
          whiteSpace: "nowrap",
        }}
      >
        {m.text}
      </div>
    ))}

    <QuoteBox
      f={f}
      at={-999}
      w={R.quote.w}
      h={R.quote.h}
      y={R.box.y + R.box.h - 30}
      lines={[
        {
          segments: [
            { text: "Indikator untuk konfirmasi,", tone: "indigo", ink: true },
          ],
        },
        { segments: [{ text: "bukan meramal" }] },
      ]}
    />
  </>
);

/** The picture's own box, for callers that need to place or scale it. */
export const READING_BOX = R.box;
