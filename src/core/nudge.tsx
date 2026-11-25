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
import { Interactive, Internals, Sequence, getRemotionEnvironment } from "remotion";

export const EDITABLE: boolean = true;

/** A scene's bar in the timeline without Studio's handles: its JSX is usually one `.map`, so a drag would shift every scene. */
export const LockedSequence = ((Internals as unknown as { SequenceWithoutSchema?: typeof Sequence }).SequenceWithoutSchema ?? Sequence) as typeof Sequence;

/**
 * Where a click on the Studio canvas lands. Studio (4.0.547) outlines an object's outermost elements, and a wrapper of ours often has no
 * size of its own (its picture is placed inside it) or covers the whole canvas. So: a wrapper without size lends its first drawn child's
 * outline, and one over the whole canvas only its single child's, or none (it would catch every click). Studio only; if a later Remotion
 * moves this internal, outlines go back to Studio's own and nothing else changes.
 */
(() => {
  type Outlines = { getNodes: (ref: unknown) => readonly Node[] | null; tuntun?: true };
  const o = (Internals as unknown as { SequenceOutlineInternals?: Outlines }).SequenceOutlineInternals;
  if (typeof document === "undefined" || !getRemotionEnvironment().isStudio || !o || o.tuntun) return;
  const pick = (n: Node): Node | null => {
    if (n instanceof Text) return n.data.trim() ? n : null;
    if (!(n instanceof HTMLElement || n instanceof SVGSVGElement)) return n instanceof Element ? n : null;
    const w = n instanceof HTMLElement ? n.offsetWidth : n.clientWidth;
    const h = n instanceof HTMLElement ? n.offsetHeight : n.clientHeight;
    const whole = w >= 1800 && h >= 1000;
    if (w > 1 && h > 1 && !whole) return n;
    if (n instanceof SVGSVGElement) return null;
    const inner = Array.from(n.childNodes).map(pick).filter((x): x is Node => x !== null);
    return whole && inner.length !== 1 ? null : (inner[0] ?? null);
  };
  const shown = new WeakMap<object, readonly Node[]>();
  const own = o.getNodes;
  o.getNodes = (ref) => {
    const nodes = own(ref);
    if (nodes === null) return null;
    const next = nodes.map(pick).filter((x): x is Node => x !== null);
    const last = shown.get(ref as object);
    if (last && last.length === next.length && last.every((x, i) => x === next[i])) return last;
    shown.set(ref as object, next);
    return next;
  };
  o.tuntun = true;
})();

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
type Extra = { name?: string; hidden?: boolean; showInTimeline?: boolean; controls?: unknown; style?: React.CSSProperties; text?: unknown; label?: unknown };

export const nudgeable = <P extends object>(label: string, Component: React.ComponentType<P>): React.FC<P & { style?: React.CSSProperties; name?: string }> => {
  const Inner = React.forwardRef<unknown, P & Extra>((props, _ref) => {
    const { controls, hidden, showInTimeline, ...rest } = props as Extra & Record<string, unknown>;
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
      <Seq layout="none" name={named ? named.slice(0, 32) : label} controls={controls} hidden={hidden} showInTimeline={showInTimeline ?? true}>
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
 * and edits them (Simon, 24 Nov: VI02 like Template-Interactive).
 */
export const Keyed: React.FC<KeyedProps> = (() => {
  const Inner = React.forwardRef<unknown, KeyedProps & Extra>((props, _ref) => {
    const { name, style, children, hidden, showInTimeline, controls } = props;
    const Seq = Sequence as unknown as React.FC<Record<string, unknown>>;
    return (
      <Seq layout="none" name={name} controls={controls} hidden={hidden} showInTimeline={showInTimeline ?? true}>
        <div style={style}>
          <NudgeEnd>{children}</NudgeEnd>
        </div>
      </Seq>
    );
  });
  Inner.displayName = "Keyed";
  const W = (Interactive.withSchema as unknown as (o: object) => React.FC<KeyedProps>)({ Component: Inner, componentName: "<Keyed>", componentIdentity: null, schema: fullSchema, supportsEffects: false });
  W.displayName = "Keyed";
  return W;
})();
