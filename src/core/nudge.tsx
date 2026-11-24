/**
 * core/nudge.tsx — objects Simon can drag and scale by hand in Studio (24 Nov 2026: "terapkan termasuk TA IN VI").
 *
 * A hand edit is only CSS `translate` / `scale` / `rotate` ON TOP of the object's own animation (which uses `transform`), so a
 * beat, a path or a VO word is never touched. Studio writes it into the JSX of that object:
 *   - `Interactive.Div`  a positioned div of a scene. ⚠ Written out like that: Studio matches the tag in the source with the component,
 *     so an alias of it (there was an `Obj`) shows a bar but no controls and no keyframes.
 *   - `nudgeable` a shared component (Appear, Card …): its root takes `useNudge()`.
 * One JSX node = one handle: what a `.map` draws, or a helper used several times, moves together.
 * Unedited, the picture is the same to the pixel. EDITABLE = false takes every handle out of the timeline (edits already made stay).
 */
import React from "react";
import { Interactive, Internals, Sequence } from "remotion";

export const EDITABLE: boolean = true;

/** A scene's bar in the timeline without Studio's handles: its JSX is usually one `.map`, so a drag would shift every scene. */
export const LockedSequence = ((Internals as unknown as { SequenceWithoutSchema?: typeof Sequence }).SequenceWithoutSchema ?? Sequence) as typeof Sequence;

type Hand = { translate?: string; scale?: number | string; rotate?: string };
type Ctx = { ref: React.RefObject<HTMLDivElement | null>; style: Hand };
const NONE: Ctx = { ref: { current: null }, style: {} };
const NudgeContext = React.createContext<Ctx | null>(null);
/** For the ROOT element of a nudgeable component: `<div ref={n.ref} style={{ …, ...n.style }}>`. Put `n.style` last. */
export const useNudge = (): Ctx => React.useContext(NudgeContext) ?? NONE;
/** Around a nudgeable component's children, so a nested root never takes the outer one's edit. */
export const NudgeEnd = ({ children }: { children?: React.ReactNode }) => <NudgeContext.Provider value={null}>{children}</NudgeContext.Provider>;

const all = Interactive.transformSchema as Record<string, unknown>;
const base = Interactive.baseSchema as Record<string, unknown>;
/**
 * Position, scale, rotation and the eye. Not from / duration (a trimmed bar pulls an object off its VO word), and not opacity /
 * transformOrigin: scenes pass those as the component's own, so a hand edit could not be told apart from the animation.
 */
const schema = {
  ...Object.fromEntries(["hidden", "showInTimeline"].filter((k) => k in base).map((k) => [k, base[k]])),
  ...Object.fromEntries(["style.translate", "style.scale", "style.rotate"].filter((k) => k in all).map((k) => [k, all[k]])),
};
type Extra = { name?: string; hidden?: boolean; showInTimeline?: boolean; stack?: string; controls?: unknown; style?: React.CSSProperties; text?: unknown; label?: unknown };

export const nudgeable = <P extends object>(label: string, Component: React.ComponentType<P>): React.FC<P & { style?: React.CSSProperties; name?: string }> => {
  const Inner = React.forwardRef<unknown, P & Extra>((props, _ref) => {
    const { stack, controls, hidden, showInTimeline, ...rest } = props as Extra & Record<string, unknown>;
    const ref = React.useRef<HTMLDivElement | null>(null);
    const st = (rest.style ?? {}) as React.CSSProperties;
    const { translate, scale, rotate, ...style } = st;
    const hand: Hand = {};
    if (translate !== undefined) hand.translate = String(translate);
    if (scale !== undefined) hand.scale = scale as number | string;
    if (rotate !== undefined) hand.rotate = String(rotate);
    const named = [rest.name, rest.text, rest.label].find((v) => typeof v === "string" && v) as string | undefined;
    const Seq = Sequence as unknown as React.FC<Record<string, unknown>>;
    return (
      <Seq layout="none" name={named ? named.slice(0, 32) : label} controls={controls} _remotionInternalStack={stack} hidden={hidden} showInTimeline={showInTimeline ?? true} outlineRef={ref}>
        <NudgeContext.Provider value={{ ref, style: hand }}>
          {React.createElement(Component, { ...(rest as unknown as P), ...(rest.style ? { style } : {}) })}
        </NudgeContext.Provider>
      </Seq>
    );
  });
  Inner.displayName = label;
  if (!EDITABLE) {
    const Plain = (props: P & Extra) => {
      const { style: st, hidden, showInTimeline: _s, ...rest } = props as Extra & Record<string, unknown>;
      if (hidden) return null;
      const { translate, scale, rotate, ...style } = st ?? {};
      const hand = Object.fromEntries(Object.entries({ translate, scale, rotate }).filter(([, v]) => v !== undefined)) as Hand;
      return <NudgeContext.Provider value={{ ref: { current: null }, style: hand }}>{React.createElement(Component, { ...(rest as unknown as P), ...(st ? { style } : {}) })}</NudgeContext.Provider>;
    };
    return Plain as unknown as React.FC<P & { style?: React.CSSProperties; name?: string }>;
  }
  const W = (Interactive.withSchema as unknown as (o: object) => React.FC)({ Component: Inner, componentName: `<${label}>`, componentIdentity: null, schema, supportsEffects: false });
  W.displayName = label;
  // so Studio learns which JSX node a handle belongs to; internal in 4.0.481, and only the handles depend on it
  (Internals as unknown as { addSequenceStackTraces?: (c: unknown) => void }).addSequenceStackTraces?.(W);
  return W as unknown as React.FC<P & { style?: React.CSSProperties; name?: string }>;
};

/** A div a `Handle` can take hold of: the root of what a `.map` draws. */
export const NDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ style, children, ...p }, _ref) => {
  const n = useNudge();
  return (
    <div {...p} ref={n.ref} style={{ ...style, ...n.style }}>
      <NudgeEnd>{children}</NudgeEnd>
    </div>
  );
});
NDiv.displayName = "NDiv";

/** One handle for one item of a `.map`: `{((it) => <><Handle name="Truk">{it[0]}</Handle>…</>)(LIST.map(…))}`. Draws no element of its own. */
export const Handle = nudgeable<{ children?: React.ReactNode; name?: string }>("Objek", ({ children }) => <>{children}</>);

const fullSchema = {
  ...Object.fromEntries(["hidden", "showInTimeline"].filter((k) => k in base).map((k) => [k, base[k]])),
  ...Object.fromEntries(["style.transformOrigin", "style.translate", "style.scale", "style.rotate", "style.opacity"].filter((k) => k in all).map((k) => [k, all[k]])),
};
type KeyedProps = { name: string; style: React.CSSProperties; children?: React.ReactNode; hidden?: boolean; showInTimeline?: boolean };
/**
 * A positioned box whose entrance and exit are literal keyframes: `opacity: interpolate(frame, [239, 263], [0, 1], …)`, so Studio shows
 * and edits them (Simon, 24 Nov: VI02 like Template-Interactive). Its outline on the canvas is its own box, or its first child's when
 * the box has no size, and nothing when that covers the whole canvas (it would catch every click).
 */
export const Keyed: React.FC<KeyedProps> = (() => {
  const Inner = React.forwardRef<unknown, KeyedProps & Extra>((props, _ref) => {
    const { name, style, children, hidden, showInTimeline, stack, controls } = props;
    const box = React.useRef<HTMLDivElement | null>(null);
    const outline = React.useRef<HTMLElement | null>(null);
    React.useLayoutEffect(() => {
      const el = box.current;
      const sized = (e: HTMLElement | null) => !!e && e.offsetWidth > 1 && e.offsetHeight > 1;
      const pick = sized(el) ? el : (Array.from(el?.children ?? []).find((c) => c instanceof HTMLElement && sized(c)) as HTMLElement | undefined) ?? null;
      const whole = pick !== null && pick.offsetWidth >= 1800 && pick.offsetHeight >= 1000;
      outline.current = whole ? null : pick;
    });
    const Seq = Sequence as unknown as React.FC<Record<string, unknown>>;
    return (
      <Seq layout="none" name={name} controls={controls} _remotionInternalStack={stack} hidden={hidden} showInTimeline={showInTimeline ?? true} outlineRef={outline}>
        <div ref={box} style={style}>
          <NudgeEnd>{children}</NudgeEnd>
        </div>
      </Seq>
    );
  });
  Inner.displayName = "Keyed";
  const W = (Interactive.withSchema as unknown as (o: object) => React.FC<KeyedProps>)({ Component: Inner, componentName: "<Keyed>", componentIdentity: null, schema: fullSchema, supportsEffects: false });
  W.displayName = "Keyed";
  (Internals as unknown as { addSequenceStackTraces?: (c: unknown) => void }).addSequenceStackTraces?.(W);
  return W;
})();
