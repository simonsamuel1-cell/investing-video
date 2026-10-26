/**
 * VI07 · SC04, from "Tim riset Tuntun" to the end — the isometric "exploded view" (Simon, 26 Oct 2026, with a Pinterest
 * reference: "ada 1 scene yang ada explainer kayak gini … pake objek2 abstrak tapi ada maknanya"). Storyboard
 * docs/vi-style/storyboards/VI07-SC04-iso.jpg.
 *
 * What each abstract object means:
 *  · the dotted axis — one company, looked at from top to bottom;
 *  · the lens — the research team, moving to the layer it is working on;
 *  · five slabs, one per job: Laporan keuangan (a sheet of lines), Model (a grid), Kualitas (the solid indigo body of
 *    the business), Harga wajar (a scale with one mark), Peristiwa (dark, with scattered dots — events);
 *  · two small stacks — the same work for Saham and Reksa dana;
 *  · a circle, a hexagon, a cylinder dropping down the axis — Waktu, Proses, Data — and the slabs pressing into one
 *    block with a check: a tested conclusion;
 *  · that block beside one thin sheet with a sound wave — one voice note. (A balance was tried here and removed —
 *    Simon, 26 Oct: "hapus timbangannya, malah jadi sampah".)
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Ico, Mark, ease, useWords } from "../components/kit";
import { AxisShape, IsoSlab, isoHalfWidth, type Slab } from "../components/Iso";

const AXIS_X = 860;
/** Where the stack sits once the voice note joins it (D). */
const AXIS_X_D = 1180;
const H = 110;
const R = 24;
const L = isoHalfWidth(H, R);
const TOP_Y = 270;
const GAP = 130;
const MID_Y = TOP_Y + 2 * GAP;
const LABEL_X = 1150;

type Layer = { label: string; at: string; nth?: number; slab: Slab; face: (c: ReturnType<typeof usePalette>) => React.ReactNode };

/** Deterministic dots for Peristiwa (plan coordinates). */
const EVENTS = [[-70, -40], [-30, -80], [20, -50], [60, -10], [-80, 30], [-20, 10], [40, 50], [80, -70], [-50, 80], [10, 90], [70, 30], [-90, -90]];

const LAYERS: Layer[] = [
  {
    label: "Laporan keuangan",
    at: "laporan keuangan",
    slab: { h: H, r: R, depth: 10, top: theme.color.isoNTop, side: theme.color.isoNLeft },
    face: () =>
      [-60, -25, 10, 45].map((y, k) => <rect key={k} x={-75} y={y} width={[150, 120, 140, 90][k]} height={9} rx={4.5} fill={theme.color.skeleton} />),
  },
  {
    label: "Model",
    at: "membuat model",
    slab: { h: H, r: R, depth: 10, top: theme.color.isoNTop, side: theme.color.isoNLeft },
    face: () => (
      <g stroke={theme.color.hairlineBrandSolid} strokeWidth={1.5} vectorEffect="non-scaling-stroke">
        {[-60, -20, 20, 60].map((v) => (
          <React.Fragment key={v}>
            <line x1={v} y1={-90} x2={v} y2={90} vectorEffect="non-scaling-stroke" />
            <line x1={-90} y1={v} x2={90} y2={v} vectorEffect="non-scaling-stroke" />
          </React.Fragment>
        ))}
      </g>
    ),
  },
  {
    label: "Kualitas",
    at: "kualitas perusahaan",
    /* top "" = the palette's indigo, filled in at draw time */
    slab: { h: H, r: R, depth: 30, top: "", side: theme.color.isoIndigoSide },
    face: () => <rect x={-H + 18} y={-H + 18} width={2 * H - 36} height={2 * H - 36} rx={R - 8} fill="none" stroke={theme.color.isoNTop} strokeOpacity={0.35} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />,
  },
  {
    label: "Harga wajar",
    at: "harga wajar",
    slab: { h: H, r: R, depth: 10, top: theme.color.isoNTop, side: theme.color.isoNLeft },
    face: (c) => (
      <>
        <rect x={-85} y={-5} width={170} height={10} rx={5} fill={theme.color.neutralDot} />
        <rect x={6} y={-30} width={10} height={60} rx={5} fill={c.indigo} />
      </>
    ),
  },
  {
    label: "Peristiwa",
    at: "peristiwa",
    slab: { h: H, r: R, depth: 16, top: theme.color.isoInkTop, side: theme.color.isoInkSide },
    face: (c) => EVENTS.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={k % 3 ? 5 : 8} fill={k % 4 ? c.indigo : c.cyan} />),
  },
];

/** The two small stacks: the same work for Saham and Reksa dana. */
const KINDS = [
  { text: "Saham", at: "saham", y: 360 },
  { text: "Reksa dana", at: "reksa dana", y: 610 },
] as const;
const MINI = { x: 1600, h: 48, r: 11 };

/** Waktu, Proses, Data: dropping down the axis into the stack. */
const BASIS = [
  { text: "Waktu", at: "waktu,", kind: "circle" as const },
  { text: "Proses", at: "proses,", kind: "hexagon" as const },
  { text: "Data", at: "data", kind: "cylinder" as const },
];

/** The voice note: one thin sheet with a sound wave on it. */
const VOICE = { x: 620, y: MID_Y + 20 };
const WAVE = [10, 22, 34, 18, 40, 28, 14, 36, 24, 12];

export const ResearchStack = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);

  const startAt = W("Tim riset");
  const doubtAt = W("Bukan berarti");
  const pressAt = W("menguji");
  const sideAt = W("Jadi keputusanmu");
  const voiceAt = W("satu voice note");

  const axis = ease(f, startAt, m.sec(0.7));
  const press = ease(f, pressAt, m.move);
  const shift = ease(f, sideAt, m.move);
  const ax = AXIS_X + (AXIS_X_D - AXIS_X) * shift;
  const fuller = ease(f, W("lebih lengkap"), m.reveal);

  /** Each slab's top-face centre: spread along the axis, then pressed together into one block round MID_Y. */
  const pressedTops = (() => {
    const sizes = LAYERS.map((l) => l.slab.depth + 3);
    const total = sizes.reduce((a, b) => a + b, 0);
    const out: number[] = [];
    let y = MID_Y - total / 2;
    for (const s of sizes) {
      out.push(y);
      y += s;
    }
    return out;
  })();
  const layerY = (i: number) => TOP_Y + i * GAP + (pressedTops[i] - (TOP_Y + i * GAP)) * press;
  /** "Bukan berarti … selalu benar": the layers are not perfectly certain — a small wobble, then still. */
  const wobble = (i: number) => {
    const p = ease(f, doubtAt, m.reveal) * (1 - ease(f, W("Tapi mereka"), m.reveal));
    return p * 9 * Math.sin((f / m.sec(0.5)) * Math.PI * 2 + i * 1.7);
  };

  const layerP = LAYERS.map((l) => ease(f, W(l.at, l.nth ?? 0) - m.sec(0.15), m.reveal));
  /** The lens sits on the layer being named; before the first one, where it will be. */
  const lensI = LAYERS.reduce((acc, l, i) => acc + ease(f, W(l.at, l.nth ?? 0) - m.sec(0.35), m.sec(0.35)) * (i === 0 ? 0 : 1), 0);
  const lensY = TOP_Y + lensI * GAP - 62;
  const lensX = AXIS_X - L / 2 - 6;
  const lensP = ease(f, startAt, m.pop) * (1 - ease(f, pressAt, m.fade));

  const labelsOut = ease(f, pressAt, m.fade);
  const kindsP = KINDS.map((k) => ease(f, W(k.at) - m.sec(0.1), m.reveal) * (1 - ease(f, doubtAt, m.fade)));
  const badge = ease(f, W("kesimpulan."), m.pop);
  const voiceP = ease(f, voiceAt - m.sec(0.1), m.reveal);

  if (f < startAt - m.sec(0.1)) return null;

  return (
    <>
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* the axis, and the two edges the slabs hang on */}
        <g opacity={1 - shift}>
          <line x1={AXIS_X} y1={TOP_Y - 150} x2={AXIS_X} y2={TOP_Y - 150 + (4 * GAP + 300) * axis} stroke={theme.color.hairlineBrandSolid} strokeWidth={2.5} strokeDasharray="2 9" strokeLinecap="round" />
          {[-L, L].map((dx) => (
            <line key={dx} x1={AXIS_X + dx} y1={TOP_Y} x2={AXIS_X + dx} y2={TOP_Y + 4 * GAP} stroke={theme.color.connectorMuteSolid} strokeWidth={1.5} strokeDasharray="2 8" opacity={layerP[4] * (1 - press)} />
          ))}
        </g>

        {/* the slabs, bottom first so the upper ones sit in front */}
        <g style={{ filter: fuller > 0.01 ? `drop-shadow(0 0 ${(28 * fuller).toFixed(1)}px ${theme.color.indigoGlow})` : undefined }}>
          {[...LAYERS.keys()].reverse().map((i) => {
            const p = layerP[i];
            if (p <= 0.001) return null;
            const slab = LAYERS[i].slab.top ? LAYERS[i].slab : { ...LAYERS[i].slab, top: c.indigo };
            return <IsoSlab key={i} cx={ax + wobble(i)} cy={layerY(i) - (1 - p) * 70} s={slab} face={LAYERS[i].face(c)} opacity={p} />;
          })}
        </g>

        {/* the same work, for Saham and Reksa dana */}
        {KINDS.map((k, i) =>
          kindsP[i] > 0.001 ? (
            <g key={k.text}>
              {[2, 1, 0].map((j) => (
                <IsoSlab key={j} cx={MINI.x} cy={k.y + j * 26 - (1 - kindsP[i]) * 30} s={{ h: MINI.h, r: MINI.r, depth: j === 1 ? 12 : 6, top: j === 1 ? c.indigo : j === 2 ? theme.color.isoInkTop : theme.color.isoNTop, side: j === 1 ? theme.color.isoIndigoSide : j === 2 ? theme.color.isoInkSide : theme.color.isoNLeft }} opacity={kindsP[i]} />
              ))}
            </g>
          ) : null,
        )}

        {/* Waktu, Proses, Data drop down the axis into the stack */}
        {BASIS.map((b) => {
          const at = W(b.at);
          const p = ease(f, at - m.sec(0.1), m.sec(0.7));
          const gone = ease(f, at + m.sec(0.45), m.fade);
          if (p <= 0.001 || gone >= 0.999) return null;
          return <AxisShape key={b.text} kind={b.kind} cx={AXIS_X} cy={TOP_Y - 140 + p * 130} size={60} fill={c.indigo} opacity={Math.min(1, p * 3) * (1 - gone)} />;
        })}

        {/* the lens: the team, at work on the layer being named */}
        {lensP > 0.001 ? (
          <g transform={`translate(${lensX.toFixed(1)} ${lensY.toFixed(1)})`} opacity={lensP}>
            <clipPath id="vi07-sc04-lens">
              <circle cx={0} cy={0} r={34} />
            </clipPath>
            <line x1={24} y1={24} x2={46} y2={46} stroke={theme.color.neutralDotOn} strokeWidth={6} strokeLinecap="round" />
            <circle cx={0} cy={0} r={36} fill={c.cardBg} stroke={theme.color.neutralDotOn} strokeWidth={3} />
            <g clipPath="url(#vi07-sc04-lens)">
              {[-30, -12, 6, 24].map((d) => (
                <line key={d} x1={d - 40} y1={40} x2={d + 40} y2={-40} stroke={c.indigo} strokeWidth={7} />
              ))}
            </g>
          </g>
        ) : null}

        {/* leader lines to the labels */}
        {LAYERS.map((l, i) => (
          <g key={l.label} opacity={layerP[i] * (1 - labelsOut)}>
            <line x1={AXIS_X + L + 10} y1={layerY(i) + l.slab.depth / 2} x2={LABEL_X - 16} y2={layerY(i) + l.slab.depth / 2} stroke={theme.color.connectorMuteSolid} strokeWidth={1.5} />
            <circle cx={AXIS_X + L + 10} cy={layerY(i) + l.slab.depth / 2} r={4} fill={theme.color.neutralDotOn} />
          </g>
        ))}

        {/* the voice note: one thin sheet */}
        {voiceP > 0.001 ? (
          <IsoSlab
            cx={VOICE.x}
            cy={VOICE.y - (1 - voiceP) * 40}
            s={{ h: H, r: R, depth: 5, top: theme.color.isoNTop, side: theme.color.isoNLeft }}
            opacity={voiceP}
            face={WAVE.map((h, k) => <rect key={k} x={-72 + k * 16} y={-h / 2} width={7} height={h} rx={3.5} fill={theme.color.neutralDot} />)}
          />
        ) : null}
      </svg>

      {/* "Tim riset" beside the lens */}
      {lensP > 0.001 ? (
        <div style={{ position: "absolute", left: lensX - 60 - 260, top: lensY - 22, width: 260, textAlign: "right", ...typeStyle("body"), fontSize: 32, color: c.ink, opacity: lensP * (1 - ease(f, W("laporan keuangan") + m.sec(0.6), m.fade)) }}>Tim riset</div>
      ) : null}

      {/* the layer names */}
      {LAYERS.map((l, i) =>
        layerP[i] * (1 - labelsOut) > 0.001 ? (
          <div key={l.label} style={{ position: "absolute", left: LABEL_X, top: layerY(i) + l.slab.depth / 2 - 21, ...typeStyle("body"), fontSize: 32, color: c.ink, whiteSpace: "nowrap", opacity: layerP[i] * (1 - labelsOut) }}>{l.label}</div>
        ) : null,
      )}

      {/* Saham, Reksa dana */}
      {KINDS.map((k, i) =>
        kindsP[i] > 0.001 ? (
          <div key={k.text} style={{ position: "absolute", left: MINI.x - 150, top: k.y + 110, width: 300, textAlign: "center", ...typeStyle("label"), fontSize: 30, color: c.ink, opacity: kindsP[i] }}>{k.text}</div>
        ) : null,
      )}

      {/* Waktu, Proses, Data — named as they drop */}
      {BASIS.map((b) => {
        const at = W(b.at);
        const p = ease(f, at - m.sec(0.1), m.reveal) * (1 - ease(f, at + m.sec(0.45), m.fade));
        return p > 0.001 ? (
          <div key={b.text} style={{ position: "absolute", left: AXIS_X + 60, top: TOP_Y - 160 + ease(f, at - m.sec(0.1), m.sec(0.7)) * 130, ...typeStyle("body"), fontSize: 32, color: c.indigo, opacity: p }}>{b.text}</div>
        ) : null;
      })}

      {/* the tested conclusion */}
      {badge > 0.001 ? (
        <div style={{ position: "absolute", left: ax + L - 30, top: MID_Y - 150, width: 92, height: 92, borderRadius: 999, background: c.cardBg, border: `2px dashed ${theme.color.connector}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", opacity: badge, transform: `scale(${(0.8 + 0.2 * badge).toFixed(3)})` }}>
          <Ico name="tick" size={40} tone={c.indigo} />
        </div>
      ) : null}

      {/* D — the two, named */}
      {shift > 0.001 ? (
        <div style={{ position: "absolute", left: ax - 150, top: MID_Y + 170, width: 300, textAlign: "center", ...typeStyle("body"), color: c.ink, opacity: shift }}>Riset</div>
      ) : null}
      {voiceP > 0.001 ? (
        <div style={{ position: "absolute", left: VOICE.x - 150, top: MID_Y + 170, width: 300, textAlign: "center", ...typeStyle("body"), color: theme.color.neutralIcon, opacity: voiceP }}>Voice note</div>
      ) : null}
      <Mark kind="cross" p={ease(f, W("temanmu."), m.pop)} x={VOICE.x + L - 10} y={VOICE.y - 90} />
    </>
  );
};
