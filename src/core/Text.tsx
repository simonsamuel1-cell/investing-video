/**
 * core/Text.tsx — every word on screen enters through here.
 *
 * There is exactly ONE entrance for type: fade and rise. No pop, no bounce, no
 * rotation, no overlap. Pop is reserved for UI elements — chips, dots, markers,
 * countdown numerals — which live in their own files.
 *
 * `Title` is centred in the title strip. Centred rather than flush left because
 * a centred title of any length stays symmetric about the canvas and therefore
 * cannot drift toward the logo zone as the wording changes.
 *
 * `Words` reveals a line word by word. This was the one thing episodeMovingAverage's
 * TextBlock did that Market-Structure's Text did not, and it is the treatment the
 * brand spec asks for on longer on-screen sentences.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { textReveal } from "./helpers";
import { useMotion } from "./useMotion";

type Anchor = "center" | "left" | "right";
const shiftOf = (a: Anchor) =>
  a === "center" ? "-50%" : a === "right" ? "-100%" : "0";

export const Title = ({
  text,
  sub,
  at = 0,
  subAt,
  x = theme.stage.title.x,
  y = theme.stage.title.y,
  opacity = 1,
}: {
  text: string;
  sub?: string;
  /** Frame this enters on. Scene-local. */
  at?: number;
  subAt?: number;
  x?: number;
  y?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const head = textReveal(f, at, m.reveal);
  const tail = textReveal(f, subAt ?? at + m.fade, m.reveal);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: theme.text.title.size,
          fontWeight: theme.text.title.weight,
          color: c.ink,
          opacity: head.opacity,
          transform: `translateY(${head.dy}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 10,
            fontSize: theme.text.body.size,
            fontWeight: theme.text.body.weight,
            color: c.slate,
            opacity: tail.opacity,
            transform: `translateY(${tail.dy}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

/** A single line of copy, revealed as one block. */
export const Line = ({
  text,
  x,
  y,
  at,
  anchor = "center",
  size = theme.text.body.size,
  weight = 600,
  color,
}: {
  text: string;
  x: number;
  y: number;
  at: number;
  anchor?: Anchor;
  size?: number;
  weight?: number;
  color?: string;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const r = textReveal(f, at, m.reveal);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${shiftOf(anchor)}, calc(-50% + ${r.dy}px))`,
        opacity: r.opacity,
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color: color ?? c.ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/**
 * The same line, revealed WORD BY WORD. Each word carries the identical fade
 * and rise; only its start is staggered. Identical size and baseline for every
 * word — never a per-word scale, which reads as bouncing type.
 */
export const Words = ({
  text,
  x,
  y,
  at,
  anchor = "center",
  size = theme.text.body.size,
  weight = 600,
  color,
  /** Frames between one word starting and the next. */
  stagger,
  atEach,
  maxWidth,
  marks,
}: {
  text: string;
  x: number;
  y: number;
  at: number;
  anchor?: Anchor;
  size?: number;
  weight?: number;
  color?: string;
  stagger?: number;
  /**
   * One frame per word, ABSOLUTE, overriding `at` + i × stagger.
   *
   * For a line that has to arrive with the voice rather than on a metronome:
   * the frames come from the subtitle cues, so a word lands as it is spoken.
   * Shorter than the sentence falls back to the even spacing for the rest.
   */
  atEach?: readonly number[];
  maxWidth?: number;
  /**
   * Phrases to run under a highlighter, as they appear in `text`.
   *
   * ⚠ MATCHED ON THE WORD SEQUENCE, NOT ON THE STRING. Highlighting a substring
   * would mean wrapping part of a word, and these words are already separate
   * elements so they can arrive one at a time. A phrase that is not found is
   * simply not marked — it never silently marks the wrong words.
   */
  marks?: readonly { text: string; color: string }[];
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const step = stagger ?? Math.max(1, Math.round(m.reveal / 4));
  const words = text.split(" ");
  /** colour per word index, from the phrases in `marks` */
  const marked: (string | undefined)[] = new Array(words.length).fill(undefined);
  /* ⚠ TRAILING PUNCTUATION IS IGNORED WHEN MATCHING. A phrase that ends a
     clause carries the comma in the sentence but not in the phrase someone
     writes down, and a mark that silently does not appear because of a comma is
     the worst kind of miss — it looks like the feature is broken. */
  const bare = (w: string) => w.replace(/[.,;:!?]+$/, "");
  marks?.forEach((mk) => {
    const want = mk.text.split(" ").map(bare);
    for (let i = 0; i + want.length <= words.length; i++) {
      if (want.every((w, k) => bare(words[i + k]) === w)) {
        for (let k = 0; k < want.length; k++) marked[i + k] = mk.color;
      }
    }
  });
  /** Runs of neighbouring words that share a mark (or share having none). */
  const groups: { color?: string; from: number; to: number }[] = [];
  words.forEach((_, i) => {
    const last = groups[groups.length - 1];
    if (last && last.color === marked[i]) last.to = i;
    else groups.push({ color: marked[i], from: i, to: i });
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${shiftOf(anchor)}, -50%)`,
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color: color ?? c.ink,
        lineHeight: 1.3,
        maxWidth,
        textAlign: anchor === "center" ? "center" : anchor === "right" ? "right" : "left",
        whiteSpace: maxWidth ? "normal" : "nowrap",
      }}
    >
      {/* ⚠ CONSECUTIVE MARKED WORDS SHARE ONE WASH. Painting each word
          separately left a gap of paper between them, so a two-word phrase read
          as two marks; and padding each word while pulling it back with a
          negative margin — the first attempt — swallowed the space between
          words entirely. Grouping the run and washing the group is the only
          version that keeps both the continuous mark and the word spacing. */}
      {groups.map((g) => {
        const run = (
          <>
            {words.slice(g.from, g.to + 1).map((w, k) => {
              const i = g.from + k;
              const r = textReveal(f, atEach?.[i] ?? at + i * step, m.reveal);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: r.opacity,
                    transform: `translateY(${r.dy}px)`,
                    /* the run's own trailing space belongs OUTSIDE the wash */
                    marginRight: g.color && i === g.to ? 0 : "0.3em",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </>
        );
        if (!g.color) return <React.Fragment key={g.from}>{run}</React.Fragment>;
        /* ⚠ THE MARK LANDS AFTER THE WORDS IT MARKS, never with them — Simon's
           note. It follows the run's LAST word, so a two-word phrase is marked
           once it is whole rather than being washed while it is still arriving
           and reading as a highlight of a word that is not there yet. */
        const mark = textReveal(f, atEach?.[g.to] ?? at + g.to * step, m.reveal).opacity;
        return (
          <span
            key={g.from}
            style={{
              position: "relative",
              display: "inline-block",
              padding: "0.04em 0.18em",
              marginRight: "0.3em",
            }}
          >
            {/* ⚠ THE WASH IS ITS OWN LAYER, BEHIND the words. Fading it by
                fading the whole span would take the type with it, and the words
                have already arrived — it is only the mark that is late. */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                background: g.color,
                borderRadius: 6,
                opacity: mark,
              }}
            />
            <span style={{ position: "relative" }}>{run}</span>
          </span>
        );
      })}
    </div>
  );
};
