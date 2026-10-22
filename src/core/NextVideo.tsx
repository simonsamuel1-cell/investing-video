/**
 * core/NextVideo.tsx — the "next video" ending the TA episodes close on (Simon, 20 Oct 2026: TA09 first, then TA01,
 * TA03, TA05 and TA07 "sama seperti di TA09"). After the last scene, a 30-frame pause on its last frame, a camera cut
 * into this scene while the outro clip plays, then Outro.mp4 — core/EpisodeWrap's `next` does the timing.
 *
 * ⚠ THE HEAD IS THE SAME ON EVERY VIDEO — "Video selanjutnya" and the next video's title, at the same place — and only
 * the picture under it changes, so the endings read as one series.
 */
import { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { progressInOut } from "./helpers";
import { usePalette } from "./palette";
import { theme } from "./theme";
import { useMotion } from "./useMotion";

/** Where the head sits, and the band the picture under it may use (it ends above the subtitle band). */
export const NEXT_LAYOUT = { chip: { y: 170, h: 56 }, titleY: 250, body: { top: 400, bottom: 910 } } as const;

/** `lead` = frames between the scene's own frame 0 and the clip's first word (half the camera cut). */
const NextClipContext = createContext({ lead: 0 });
export const NextClipProvider = NextClipContext.Provider;

/** The scene's frame, and `at(seconds)` = the frame a word of the clip lands on (seconds from the clip's start). */
export const useNextClip = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { lead } = useContext(NextClipContext);
  return { f, at: (sec: number) => lead + Math.round(sec * fps) };
};

/**
 * "Video selanjutnya" on `chipAt`, the next video's title on `titleAt` — frames of the scene. `light` is the VI
 * look (Benchmark v1, Simon 22 Oct 2026: neutral, the brand on hairlines, normal-weight type) at the same place, so
 * the VI endings read as one series too; the TA endings keep the default.
 */
export const NextVideoHead = ({ title, chipAt, titleAt, light = false }: { title: string; chipAt: number; titleAt: number; light?: boolean }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const chip = progressInOut(f, chipAt, m.reveal);
  const head = progressInOut(f, titleAt, m.reveal);
  const chipLook = light
    ? { background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrand}`, fontSize: theme.type.label.size, fontWeight: theme.type.label.weight, color: c.indigo }
    : { background: theme.color.indigoWash, fontSize: theme.text.tag.size, fontWeight: theme.text.tag.weight, color: c.indigo };
  const titleLook = light
    ? { fontSize: theme.type.statement.size, fontWeight: theme.type.statement.weight, letterSpacing: theme.type.statement.tracking, color: c.ink }
    : { fontSize: theme.text.display.size, fontWeight: theme.text.display.weight, letterSpacing: -2, color: c.indigo };
  return (
    <>
      <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: NEXT_LAYOUT.chip.y, display: "flex", justifyContent: "center", opacity: chip, transform: `translateY(${((1 - chip) * 14).toFixed(2)}px)` }}>
        <div style={{ height: NEXT_LAYOUT.chip.h, padding: "0 28px", borderRadius: 999, display: "flex", alignItems: "center", fontFamily: theme.text.family, ...chipLook }}>
          Video selanjutnya
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: NEXT_LAYOUT.titleY, textAlign: "center", fontFamily: theme.text.family, lineHeight: 1.1, ...titleLook, opacity: head, transform: `translateY(${((1 - head) * 18).toFixed(2)}px)` }}>
        {title}
      </div>
    </>
  );
};

/** A round check mark — the same one on every ending. */
export const NextCheck = ({ x, y, size = 52, p = 1, tone }: { x: number; y: number; size?: number; p?: number; tone?: string }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <svg width={size} height={size} style={{ position: "absolute", left: x, top: y, opacity: p, transform: `scale(${(0.8 + 0.2 * p).toFixed(3)})` }}>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={tone ?? c.cyan} />
      <path d={`M ${size * 0.29} ${size * 0.52} L ${size * 0.44} ${size * 0.66} L ${size * 0.72} ${size * 0.37}`} fill="none" stroke={c.cardBg} strokeWidth={size * 0.106} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** A pill tab at a card's top-left (1W, RSI …), filled once `on`. */
export const NextTab = ({ x, y, text, p = 1, on = false }: { x: number; y: number; text: string; p?: number; on?: boolean }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, height: 46, padding: "0 20px", borderRadius: 999, display: "flex", alignItems: "center", background: on ? c.indigo : theme.color.indigoWash, color: on ? c.cardBg : c.indigo, fontFamily: theme.text.family, fontSize: theme.text.tag.size, fontWeight: 800, whiteSpace: "nowrap", opacity: p, transform: `scale(${(0.9 + 0.1 * p).toFixed(3)})`, transformOrigin: "left center" }}>
      {text}
    </div>
  );
};

