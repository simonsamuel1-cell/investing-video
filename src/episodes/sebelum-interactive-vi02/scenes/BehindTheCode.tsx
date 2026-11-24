/**
 * VI02 · SC01 — "Di Balik Empat Huruf", from Simon's direction and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI02-SC01.jpg. No figures: the opening's price is a shape, and ICBP is only its four letters.
 *
 *  A  "sebelum melihat saham sebagai harga": ICBP and a moving price (PRICE_TICKER), or a price card, its candles traced from Simon's screenshot
 *     (docs/vi-style/storyboards/VI02-SC01-price-chart.png); on "di belakangnya" it slides away from the business behind it.
 *  B  "Jam empat pagi": the factory before sunrise, standing still until "sebuah pabrik", when its windows come on and the
 *     smoke starts; the sky runs to morning through to "Semua".
 *  C  ONE world. "Produk keluar": the camera holds, the belt starts and the packs come up on it. "masuk ke kardus … truk": one
 *     slide, to the packer and the truck at the bay (Simon's frame, CAM.load). "lalu sampai": it rides with the truck to the
 *     shops, a pack sold.
 *  D  "Semua aktivitas itu terus berjalan": the camera pulls back over the whole chain, all of it still running.
 *  E  "aplikasi saham … empat huruf: ICBP": the whole chain shrinks into a phone's screen and becomes one row, ICBP.
 *  F  "Kita membeli sebagian kecil kepemilikan": behind the code, the factory and the many who own it; one of them lights up as
 *     "Kamu" and is tied to the business (Simon, 5 Nov: the row of nodes didn't show ownership, and the jigsaw belongs to SC02).
 */
import { Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Candles, GRID_PAD_X, SoftGround, SourceTag, Stage, gridOf, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { FACTORY_STILLS, PRICE_TICKER } from "../data/switches";
import { FactoryStills } from "../components/FactoryStills";
import { PriceTicker } from "../components/PriceTicker";
import { Appear, BoardGrid, Card, Line, WordPill, ease, useWords } from "../components/kit";
import { AT, Bay, CompanyArt, Conveyor, Factory, GROUND, GroundLine, Packer, Shops, Truck, workClock } from "../components/World";
import TAPE from "../data/price-chart.json";

const CX = theme.canvas.width / 2;
type Box = { x: number; y: number; w: number; h: number };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixBox = (a: Box, b: Box, t: number): Box => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t) });

/** The window onto the world: everything between the logo zone and the subtitle band. */
const WIN: Box = { x: theme.margin.left, y: theme.logoZone.height, w: theme.canvas.width - theme.margin.left - theme.margin.right, h: theme.captionBand.top - 22 - theme.logoZone.height };
/** The ground line in the window, as a share of its height. */
const HORIZON = 0.775;
/** Where the camera looks along the chain, and how far it pulls back to see all of it. */
const CAM = { factory: 640, load: 2484, shops: 4380, whole: 2640 };
const WORLD_W = 5300;
/** The trucks that keep coming once the camera has pulled back: past the one that stands there, out to the first shop. */
const LOOP = { from: AT.bay + 60, to: AT.shops[0] - 100, speed: 7, ends: 160 };

const PHONE = { w: 390, h: 780, y: 94, r: 56, bezel: 12 };
const SCREEN: Box = { x: CX - PHONE.w / 2 + PHONE.bezel, y: PHONE.y + PHONE.bezel, w: PHONE.w - 2 * PHONE.bezel, h: PHONE.h - 2 * PHONE.bezel };
const ROWS = 6;
const ROW = { top: 120, h: 92, code: 2 };

// A — the price: a shape only, no figures. Its bars are in the screenshot's pixels, one scale on both axes, so it isn't stretched.
const PRICE = { w: 1200, y: 215, pad: 26, top: 100, bottom: 36 };
const TAPE_PITCH = 7.97;
const TAPE_LO = Math.min(...TAPE.map((b) => b.l));
const TAPE_HI = Math.max(...TAPE.map((b) => b.h));
const TAPE_W = PRICE.w - 2 * PRICE.pad;
const TAPE_H = ((TAPE_HI - TAPE_LO) * (TAPE_W - 2 * GRID_PAD_X)) / (TAPE.length - 1) / TAPE_PITCH;
const TAPE_GRID = gridOf(TAPE.map((b) => b.c), [TAPE_LO, TAPE_HI], { x: PRICE.pad, y: PRICE.top, w: TAPE_W, h: TAPE_H }, 0);
const PRICE_H = PRICE.top + TAPE_H + PRICE.bottom;

// F — the business the code stands for, the many who own it, and "Kamu" among them
const OWN = { w: 520, h: 280, y: 240, s: 0.44, enter: 0.94, label: 566, line: 850 };
const OWNERS = { cols: 18, step: 76, rowY: [632, 702], d: 60, grow: 1.35, kamu: { row: 1, col: 11 }, labelGap: 10 };
const OWNER_LIST = OWNERS.rowY.flatMap((y, row) =>
  Array.from({ length: OWNERS.cols }, (_, col) => ({ row, col, y, x: CX + (col - (OWNERS.cols - 1) / 2 + (row ? 0.25 : -0.25)) * OWNERS.step })),
);
const KAMU = OWNER_LIST.find((o) => o.row === OWNERS.kamu.row && o.col === OWNERS.kamu.col)!;
const OWNER_REACH = Math.max(...OWNER_LIST.map((o) => Math.abs(o.x - CX)));
const CODE = { rowSize: 34, bigSize: 92, dockSize: 44, dockY: 190 };

/** One owner: a grey disc, or with `lit` the cyan self icon. */
const Owner = ({ x, y, on, lit }: { x: number; y: number; on: number; lit: number }) => {
  const c = usePalette();
  const d = OWNERS.d * (1 + (OWNERS.grow - 1) * lit);
  return (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: interpolateColors(lit, [0, 1], [theme.color.neutralDisc, c.cardBg]), boxShadow: `inset 0 0 0 ${(2 + 2 * lit).toFixed(1)}px ${interpolateColors(lit, [0, 1], [theme.color.hairlineBrandSolid, theme.color.selfAmber])}`, opacity: on, transform: `scale(${(0.6 + 0.4 * on).toFixed(3)})` }}>
      <Img src={staticFile("icons/vi02/ph-user.svg")} style={{ width: d * 0.5, height: d * 0.5, filter: `grayscale(${(1 - lit).toFixed(3)})` }} />
    </div>
  );
};

const stars = Array.from({ length: 34 }, (_, i) => ({ x: ((i * 277) % 1000) / 1000, y: ((i * 149) % 560) / 1000, r: 1.5 + (i % 3) }));

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(1, BLOCK.SC01);
  const g = f + BLOCK.SC01;

  // A
  const behindAt = W("lihat dulu");
  const away = ease(f, W("di belakangnya"), m.move);
  const drawAt = W("saham sebagai");
  const barOver = m.sec(0.12);
  const barStep = (behindAt - drawAt - barOver) / (TAPE.length - 1);
  // B
  const jamAt = W("Jam");
  const workAt = W("sebuah pabrik") - m.sec(0.05);
  const run = workClock(f, workAt, m.sec(0.8));
  const lit = ease(f, workAt, W("bekerja", 0, "f1") - workAt);
  const dawn = ease(f, jamAt, W("Semua") - jamAt);
  // C — the belts start on their own words, and the camera moves twice
  const beltAt = W("Produk");
  const belt = workClock(f, beltAt, m.sec(0.8));
  const packAt = W("masuk ke kardus");
  const packing = workClock(f, packAt, m.sec(0.8));
  const itemOver = m.sec(0.3);
  const driveAt = W("lalu sampai");
  const driveOver = W("di berbagai") - driveAt;
  const legs: [number, number, number][] = [
    [CAM.load - CAM.factory, packAt, W("truk", 0, "f1") - packAt],
    [CAM.shops - CAM.load, driveAt, driveOver],
  ];
  const ride = legs.reduce((x, [d, at, over]) => x + d * ease(f, at, over), CAM.factory);
  const driving = ease(f, driveAt, driveOver);
  const truckX = mix(AT.bay + 60, AT.shops[0] - 520, driving);
  const sold = AT.shops.map((_, i) => ease(f, W("toko-toko") + m.sec(0.25) * i, m.reveal));
  // D
  const zoom = ease(f, W("Semua"), m.sec(1.8));
  const cx = mix(ride, CAM.whole, zoom);
  const more = LOOP.from + ((f * LOOP.speed) % (LOOP.to - LOOP.from));
  const moreSize = ease(more, LOOP.from, LOOP.ends) * (1 - ease(more, LOOP.to - LOOP.ends, LOOP.ends));
  // E
  const inAt = W("masuk ke aplikasi");
  const shrink = ease(f, inAt, m.sec(1.2));
  const app = ease(f, W("seluruh bisnis"), m.reveal);
  const big = ease(f, W("ICBP"), m.sec(0.5));
  // F
  const splitAt = W("Kita membeli sebagian");
  const split = ease(f, splitAt, m.move);
  const crowdAt = W("sebagian kecil") - m.sec(0.2);
  const crowdOver = W("kepemilikan") - crowdAt - m.reveal;
  const kamu = ease(f, W("kepemilikan"), m.reveal);
  const tie = ease(f, W("bisnis yang", 1), m.sec(0.4));

  const rect = mixBox(WIN, SCREEN, shrink);
  const s = mix(1, WIN.w / WORLD_W, zoom) * (rect.w / WIN.w);
  const ground = rect.h * HORIZON;
  const skyTop = interpolateColors(dawn, [0, 0.55, 1], [theme.color.worldNight, theme.color.worldDawn, theme.color.worldMorning]);
  const skyLow = interpolateColors(dawn, [0, 0.55, 1], [theme.color.worldDawn, theme.color.worldGlow, theme.color.worldWall]);
  const sunY = mix(ground + 90, ground - rect.h * 0.46, dawn);

  const rowY = SCREEN.y + ROW.top + ROW.code * ROW.h + ROW.h / 2;
  const midY = PHONE.y + PHONE.h / 2;
  const codeY = mix(mix(rowY, midY, big), CODE.dockY, split);
  const codeX = mix(SCREEN.x + 44, CX, big);
  const codeSize = mix(mix(CODE.rowSize, CODE.bigSize, big), CODE.dockSize, split);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* the phone, under the window that lands in it */}
      <div style={{ position: "absolute", left: CX - PHONE.w / 2, top: PHONE.y, width: PHONE.w, height: PHONE.h, borderRadius: PHONE.r, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, opacity: ease(f, inAt + m.sec(0.3), m.reveal) * (1 - split), transform: `scale(${(1 - 0.06 * split).toFixed(4)})` }} />

      {/* the world */}
      {f >= behindAt && app < 0.999 ? (
        <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: mix(theme.shape.cardRadius, PHONE.r - PHONE.bezel, shrink), overflow: "hidden", opacity: ease(f, behindAt, m.reveal), background: FACTORY_STILLS ? c.cardBg : `linear-gradient(to bottom, ${skyTop}, ${skyLow})`, boxShadow: shrink < 0.5 ? shadow.soft : undefined }}>
          {FACTORY_STILLS ? <FactoryStills f={f} W={W} w={WIN.w} h={WIN.h} scale={rect.w / WIN.w} /> : null}
          {FACTORY_STILLS ? null : <svg width={rect.w} height={rect.h} style={{ position: "absolute", left: 0, top: 0 }}>
            {stars.map((st, i) => (
              <circle key={i} cx={st.x * rect.w} cy={st.y * rect.h} r={st.r} fill={theme.color.worldWall} opacity={Math.max(0, 1 - dawn * 2.2)} />
            ))}
            <circle cx={rect.w * 0.74} cy={sunY} r={rect.h * 0.11} fill={theme.color.artPale} />
            <g transform={`translate(${(rect.w / 2 - cx * s).toFixed(2)} ${(ground - GROUND * s).toFixed(2)}) scale(${s.toFixed(4)})`}>
              <GroundLine />
              <rect x={-4000} y={GROUND + 34} width={14000} height={92} fill={theme.color.worldRoad} />
              {Array.from({ length: 70 }, (_, i) => (
                <rect key={i} x={-400 + i * 110} y={GROUND + 77} width={60} height={6} rx={3} fill={theme.color.artMid} />
              ))}
              <Bay />
              <Shops sold={sold} />
              <Factory lit={lit} f={run} />
              <Conveyor f={belt} shown={(i) => ease(f, beltAt + i * m.sec(0.2), itemOver)} />
              <Packer f={packing} shown={(i) => ease(f, packAt + i * m.sec(0.25), itemOver)} />
              {zoom > 0.01 ? <Truck x={more} s={moreSize} /> : null}
              <Truck x={truckX} />
            </g>
          </svg>}
          {/* "Jam empat pagi" */}
          {FACTORY_STILLS ? null : <Appear at={jamAt} out={W("Produk")} style={{ left: 40, top: 36 }}>
            <div style={{ padding: "12px 30px", borderRadius: 999, background: c.cardBg, ...typeStyle("title"), fontVariantNumeric: "tabular-nums", color: c.ink, whiteSpace: "nowrap" }}>04.00</div>
          </Appear>}
        </div>
      ) : null}

      {/* A — the price, in front of what stands behind it */}
      {away < 0.999 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height, transform: `translateX(${(-(CX + PRICE.w / 2 + 40) * away).toFixed(1)}px)` }}>
          <Appear at={W("sebelum melihat")} style={{ left: 0, top: 0 }}>
            {PRICE_TICKER ? <PriceTicker f={f} from={W("sebelum melihat")} x={CX} /> : (
              <Card x={CX - PRICE.w / 2} y={PRICE.y} w={PRICE.w} h={PRICE_H}>
                <div style={{ position: "absolute", left: 44, top: 32, ...typeStyle("title"), color: c.ink }}>Harga</div>
                <Candles bars={TAPE} grid={TAPE_GRID} wipe={(i) => ease(f, drawAt + i * barStep, barOver)} />
                <SourceTag kind="traced" />
              </Card>
            )}
          </Appear>
        </div>
      ) : null}
      <Appear at={W("Di video")} out={W("sebelum melihat")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={470} w={theme.canvas.width} align="center" size={56} weight={500} text="Prinsip dasar value investing" mark="value investing" />
      </Appear>

      {/* E — the app on the phone's screen */}
      {app > 0.001 && split < 0.999 ? (
        <div style={{ position: "absolute", left: SCREEN.x, top: SCREEN.y, width: SCREEN.w, height: SCREEN.h, borderRadius: PHONE.r - PHONE.bezel, overflow: "hidden", background: c.bg, opacity: app * (1 - split) }}>
          <div style={{ position: "absolute", left: 28, top: 56, width: 170, height: 22, borderRadius: 11, background: theme.color.neutralDisc }} />
          {Array.from({ length: ROWS }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 20, right: 20, top: ROW.top + i * ROW.h + 8, height: ROW.h - 16, borderRadius: 16, background: c.cardBg, opacity: 1 - big }}>
              {i === ROW.code ? null : <div style={{ position: "absolute", left: 24, top: 28, width: 94, height: 20, borderRadius: 10, background: theme.color.neutralDisc }} />}
              <div style={{ position: "absolute", right: 24, top: 28, width: 70, height: 20, borderRadius: 10, background: theme.color.neutralDisc }} />
            </div>
          ))}
        </div>
      ) : null}

      {/* the code itself: a row in the app, the whole screen, then the head of what it breaks into */}
      {app > 0.001 ? (
        <div style={{ position: "absolute", left: codeX, top: codeY, transform: `translate(${(-50 * big).toFixed(1)}%, -50%)`, padding: `${(10 * split).toFixed(1)}px ${(34 * split).toFixed(1)}px`, borderRadius: 999, background: split > 0.01 ? c.cardBg : undefined, boxShadow: split > 0.5 ? `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` : undefined, fontFamily: theme.text.family, fontSize: codeSize, fontWeight: 700, letterSpacing: 1, color: c.indigo, whiteSpace: "nowrap", opacity: app }}>ICBP</div>
      ) : null}

      {/* F — the business behind the code, those who own it, and "Kamu" */}
      {split > 0.001 ? (
        <div style={{ position: "absolute", left: CX - OWN.w / 2, top: OWN.y, width: OWN.w, height: OWN.h, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft, opacity: split, transform: `scale(${mix(OWN.enter, 1, split).toFixed(4)})` }}>
          <CompanyArt w={OWN.w} h={OWN.h} s={OWN.s} f={f} />
        </div>
      ) : null}
      <Appear at={W("sebagian kecil")} style={{ left: 0, top: 0 }}>
        <WordPill x={CX} y={OWN.label} text="Pemilik" />
      </Appear>
      {tie > 0.001 ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={KAMU.x} y1={KAMU.y} x2={KAMU.x} y2={mix(KAMU.y, OWN.y + OWN.h, tie)} stroke={theme.color.selfAmber} strokeWidth={4} strokeLinecap="round" />
        </svg>
      ) : null}
      {/* mounted only once they start to show: 36 filtered icons at opacity 0 halved Studio's playback of everything before them */}
      {f >= crowdAt ? OWNER_LIST.map((o) => (
        <Owner key={`${o.row}-${o.col}`} x={o.x} y={o.y} on={ease(f, crowdAt + (crowdOver * Math.abs(o.x - CX)) / OWNER_REACH, m.reveal)} lit={o === KAMU ? kamu : 0} />
      )) : null}
      <Appear at={W("kepemilikan")} style={{ left: 0, top: 0 }}>
        <div style={{ position: "absolute", left: KAMU.x - 100, top: KAMU.y + (OWNERS.d * OWNERS.grow) / 2 + OWNERS.labelGap, width: 200, textAlign: "center", ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: c.ink }}>Kamu</div>
      </Appear>
      <Appear at={W("ada di", 1)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={OWN.line} w={theme.canvas.width} align="center" size={48} weight={500} text="Di balik sebuah kode, ada bisnis yang nyata." mark="bisnis yang nyata" />
      </Appear>
    </Stage>
  );
};
