/**
 * VI04 · SC03 — "Tiga Kurva, Tiga Cara Menyeberang", rebuilt to Benchmark v1 + minimal (docs/vi-style/STYLE.md §0;
 * Simon, 22 Oct 2026) from the ChatGPT storyboard docs/vi-style/storyboards/VI04-SC03-v2.jpg. Neutral greys for the
 * obvious things (islands, vehicles, cards), the brand only on hairlines — connectors, the path curve, a word.
 *
 *  A  "Ada tiga cara buat sampai ke seberang": ONE shot with SC02 (no cut) — it opens on SC02's last frame and the
 *     camera pulls back to the islands, while three dashed routes grow across, each with its vehicle on a disc.
 *  B–D one MINDMAP, the same three times: the vehicle in a card at the left, and connectors growing on their words
 *     to what the VO says about it — the numbers (with the path drawn as a curve that grows rougher route by route),
 *     the examples, and the closing line. The frame stays; only its content swaps (the benchmark's card whose
 *     content changes). B jembatan · C kapal (feri → reksa dana indeks, speedboat → reksa dana saham, "yang pegang
 *     kemudi bukan kita") · D pesawat (+30% / −30%, "kita juga yang harus tahu cara mengendalikannya" — YOU, amber).
 *  E  the three side by side, and three arrows on their words: jalur pelan → cepat, naik-turun kecil → besar,
 *     kemampuan rendah → tinggi.
 *  F  "ada dua pertanyaan": Ombak and Kemudi — the same two icons SC04, SC05 and SC06 open with. SC04 opens on this
 *     picture (one shot, no cut) and the Ombak card becomes its question.
 * Every figure on screen is the script's own.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, Card, Heading, Ico, IconDot, IsoIcon, Line, NumRing, OUTSIDE_RESERVES, ROUGH, Typed, ROUTE_CARD, ROUTE_CARDS, RouteCard, Vehicle, ease, useWords, wavePts, type SketchName } from "../components/kit";
import { ISLE_FRAME, Islands, RiverLines, WAY_DISC_R, frameStyle, mixFrame, wayDisc } from "../components/Islands";
import { KenaliLine } from "./River";

const CX = theme.canvas.width / 2;
const LEFT = 140;

// B–D — the mindmap: the vehicle at the left, three end nodes at the right
const HUB = { x: LEFT, y: 300, w: 520, h: 460 };
const HUB_OUT = { x: HUB.x + HUB.w, y: HUB.y + HUB.h / 2 };
const NODE_X = 820;
const STATS = { y: 250, w: 960, h: 350, col: 470 };
const EX = { y: 660, h: 110, w: 466, gap: 28 };
const END_Y = 862;
const IN = { stats: { x: NODE_X, y: STATS.y + STATS.h / 2 }, ex: { x: NODE_X, y: EX.y + EX.h / 2 }, end: { x: NODE_X, y: END_Y } };

/** The path under the numbers: one hairline curve whose swell grows from route to route. */
const CURVE = { x: 48, y: 290, w: STATS.w - 96 };

type Ex = { icon?: string; art?: SketchName; lead?: string; text: string; at: string };
type Route = {
  start: string;
  title: string;
  titleAt: string;
  art: SketchName;
  artH: number;
  name: string;
  /**
   * Each number counts up from 0 on its own word (Simon, 22 Oct: "3% muncul duluan … lalu 5% baru muncul"). The first
   * stat (return, naik) is green, the second (penurunan, turun) red (Simon, 22 Oct).
   */
  stats: { label: string; at: string; sign?: string; parts: { v: number; dec?: number; at: string; nth?: number }[] }[];
  note?: { text: string; at: string };
  ex: Ex[];
  end: { icon: string; text: string; mark: string; amber?: boolean; at: string };
};
const ROUTES: Route[] = [
  {
    start: "Yang pertama",
    title: "Jalan memutar lalu lewat jembatan.",
    titleAt: "jalan memutar",
    art: "bridge",
    artH: 220,
    name: "Jembatan",
    stats: [
      { label: "Return per tahun", at: "return sekitar", parts: [{ v: 3, at: "3%" }, { v: 5, at: "5%" }] },
      { label: "Potensi penurunan", at: "dengan potensi", parts: [{ v: 0.5, dec: 1, at: "0,5%" }, { v: 1, at: "1%" }] },
    ],
    ex: [
      { icon: "money-market", text: "Reksa dana pasar uang", at: "reksa dana pasar uang" },
      { icon: "deposito", text: "Deposito", at: "deposito" },
    ],
    end: { icon: "calm", text: "Nggak cepat, tapi relatif mudah dijalani.", mark: "relatif mudah dijalani", at: "Nggak cepat" },
  },
  {
    start: "Yang kedua",
    title: "Naik kapal.",
    titleAt: "naik kapal",
    art: "ferry",
    artH: 190,
    name: "Kapal",
    stats: [
      { label: "Return per tahun", at: "Return-nya", parts: [{ v: 8, at: "8%" }, { v: 12, at: "12%" }] },
      { label: "Potensi penurunan", at: "dengan potensi penurunan sekitar 5%", parts: [{ v: 5, at: "5%", nth: 1 }, { v: 15, at: "15%" }] },
    ],
    ex: [
      { art: "ferry", lead: "Feri", text: "Reksa dana indeks", at: "Feri" },
      { art: "speedboat", lead: "Speedboat", text: "Reksa dana saham", at: "Speedboat" },
    ],
    end: { icon: "wheel", text: "Dan yang pegang kemudi bukan kita.", mark: "bukan kita", at: "Dan yang pegang kemudi" },
  },
  {
    start: "Yang ketiga",
    title: "Bawa pesawat sendiri.",
    titleAt: "bawa pesawat",
    art: "plane",
    artH: 200,
    name: "Pesawat",
    stats: [
      { label: "Dalam setahun bisa naik", at: "naik 30%", sign: "+", parts: [{ v: 30, at: "30%" }] },
      { label: "tapi juga bisa turun", at: "turun 30%", sign: "−", parts: [{ v: 30, at: "30%", nth: 1 }] },
    ],
    note: { text: "dan penurunannya bisa jauh lebih dalam", at: "penurunannya" },
    ex: [{ icon: "stock", text: "Seperti memilih saham sendiri", at: "Ini seperti" }],
    end: { icon: "wheel", text: "Kita juga yang harus tahu cara mengendalikannya.", mark: "tahu cara mengendalikannya", amber: true, at: "kita juga yang harus" },
  },
];

// E — the three side by side, and the three arrows
const TRI = { y: 220, gap: 60 };
const TRI_W = ROUTE_CARD.w;
const triX = (i: number) => CX + (i - 1) * (TRI_W + TRI.gap) - TRI_W / 2;
const ARROWS = [
  { label: "Jalur", from: "pelan", to: "cepat", at: "semakin cepat" },
  { label: "Naik-turun", from: "kecil", to: "besar", at: "besar naik-turunnya" },
  { label: "Kemampuan", from: "rendah", to: "tinggi", at: "tinggi kemampuan" },
];
const ARROW = { x: triX(0), ys: [650, 750, 850], line0: triX(0) + 420, line1: triX(2) + TRI_W - 150, tag: { w: 250, h: 70 } };

// F — the two questions
export const ASK = { y: 560, w: 440, h: 190, gap: 80 };
export const QUESTIONS = [
  { icon: "waves", n: 1, title: "Ombak" },
  { icon: "wheel", n: 2, title: "Kemudi" },
];
export const askX = (i: number) => CX + (i === 0 ? -ASK.w - ASK.gap / 2 : ASK.gap / 2);

/** SC03's last picture, shared with SC04, which opens on it (one shot, no cut — Simon, 22 Oct). */
export const AskLead = () => <Line x={0} y={330} w={theme.canvas.width} align="center" size={40} weight={500} text="Untuk tahu jalur mana yang cocok," />;
export const AskMain = () => <Line x={0} y={420} w={theme.canvas.width} align="center" size={64} weight={600} text="ada dua pertanyaan." mark="dua pertanyaan" />;
export const AskCard = ({ i }: { i: number }) => {
  const c = usePalette();
  const q = QUESTIONS[i];
  return (
    <Card x={askX(i)} y={ASK.y} w={ASK.w} h={ASK.h} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 40px" }}>
      <IsoIcon name={q.icon} h={100} />
      <div>
        <div style={{ ...typeStyle("label"), color: c.slate }}>Pertanyaan {q.n}</div>
        <div style={{ marginTop: 4, ...typeStyle("title"), color: c.ink }}>{q.title}</div>
      </div>
    </Card>
  );
};

/** An arrow growing left→right with its head riding the tip. */
const Arrow = ({ x0, x1, y, p }: { x0: number; x1: number; y: number; p: number }) => {
  if (p <= 0.001) return null;
  const x = x0 + (x1 - x0) * p;
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <line x1={x0} y1={y} x2={x} y2={y} stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M ${x - 12} ${y - 9} L ${x} ${y} L ${x - 12} ${y + 9}`} fill="none" stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;

  const starts = ROUTES.map((r) => W(r.start));
  /** The camera pulling back from where SC02 left it. */
  const back = ease(f, 0, m.sec(1.1));
  /**
   * "Yang pertama": route 1's disc grows a little and glows; then its ring opens out until it covers the screen
   * (Simon, 22 Oct: "border lingkarannya membesar hingga satu layar ter-cover, setelah itu muncullah scene
   * berikutnya"), and route 1's mindmap comes up inside it.
   */
  const focus1 = ease(f, starts[0], m.sec(0.4));
  const irisAt = starts[0] + m.sec(0.35);
  const iris = ease(f, irisAt, m.sec(0.6));
  const enter1 = irisAt + m.sec(0.6);
  const [irisX, irisY] = wayDisc(1);
  const irisR = WAY_DISC_R * 1.2 + (Math.hypot(Math.max(irisX, theme.canvas.width - irisX), Math.max(irisY, theme.canvas.height - irisY)) + 40 - WAY_DISC_R * 1.2) * iris;
  const sumAt = W("Jadi semakin cepat");
  const askAt = W("Untuk tahu jalur");
  const until = (i: number) => (i + 1 < starts.length ? starts[i + 1] : sumAt);
  const grow = (at: number) => ease(f, at, m.sec(0.55));

  // the path curve: drawn on "Jalurnya pelan dan relatif stabil", rougher on each later route's name
  const pathAt = W("Jalurnya");
  const draw = ease(f, pathAt, m.sec(1.0));
  const k1 = ease(f, W(ROUTES[1].titleAt), m.sec(0.9));
  const k2 = ease(f, W(ROUTES[2].titleAt), m.sec(0.9));
  const amp = ROUGH[0].amp + (ROUGH[1].amp - ROUGH[0].amp) * k1 + (ROUGH[2].amp - ROUGH[1].amp) * k2;
  const freq = ROUGH[0].freq + (ROUGH[1].freq - ROUGH[0].freq) * k1 + (ROUGH[2].freq - ROUGH[1].freq) * k2;

  return (
    <Stage>
      <SoftGround f={g} />

      {/* A — three ways across. ONE shot with SC02 (no cut): it opens on SC02's last frame — the camera dived onto
          Kamu, the house faded, the line on screen — and pulls back to the whole picture as the routes draw. */}
      {/* gone the frame route 1's disc has covered the screen — nothing of it may show through as the disc fades */}
      {f < enter1 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height, clipPath: OUTSIDE_RESERVES }}>
          <div style={frameStyle(mixFrame(ISLE_FRAME.dive, ISLE_FRAME.full, back))}>
            <RiverLines g={g} p={() => 1} />
            <Islands youAt={-1000} homeAt={-1000} wayAt={W("tiga cara")} neutral homeFade={1 - back} focus={{ n: 1, p: focus1, lifted: iris > 0.001 }} />
          </div>
        </div>
      ) : null}
      <KenaliLine opacity={1 - ease(f, 0, m.sec(0.5))} />

      {/* A → B — route 1's OWN disc grows until it covers the screen (Simon, 22 Oct: "yang membesar lingkaran dari si
          icon, bukan buat baru"): lifted out of the islands at the same place and look, its icon and number let go
          as it grows, its glow fading. Once it covers everything the screen STAYS white (Simon, 22 Oct: "dah biarin
          putih aja") and the next layout — its ground too — fades in over it. */}
      {iris > 0.001 && f < enter1 + m.reveal + 1 ? (
        <div style={{ position: "absolute", left: irisX - irisR, top: irisY - irisR, width: irisR * 2, height: irisR * 2, borderRadius: "50%", background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.connector}, 0 0 ${(40 * (1 - iris)).toFixed(1)}px ${(10 * (1 - iris)).toFixed(1)}px ${theme.color.indigoGlow}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ opacity: Math.max(0, 1 - iris * 4) }}>
            <Ico name="t-bridge-i" size={72} tone={theme.color.neutralIcon} />
          </div>
          {/* the number, where the islands drew it on the disc (its corner, ×1.2 with the disc) */}
          <div style={{ position: "absolute", left: irisR + irisR * 0.8 - 24, top: irisR - irisR * 0.8 - 24, opacity: Math.max(0, 1 - iris * 4) }}>
            <NumRing n={1} size={48} />
          </div>
        </div>
      ) : null}
      {f >= enter1 && f < enter1 + m.reveal + 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, enter1, m.reveal) }}>
          <SoftGround f={g} />
        </div>
      ) : null}

      {/* B–D — the frame that stays: the vehicle card, the numbers card and its curve */}
      <Appear at={enter1} out={sumAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Card x={HUB.x} y={HUB.y} w={HUB.w} h={HUB.h} />
        <Connector a={HUB_OUT} b={IN.stats} p={grow(pathAt)} shape="elbow" />
        <Appear at={pathAt + m.sec(0.3)} style={{ left: NODE_X, top: STATS.y }}>
          <Card x={0} y={0} w={STATS.w} h={STATS.h}>
            <div style={{ position: "absolute", left: STATS.col - 2, top: 44, width: 2, height: 130, background: c.border }} />
            <svg width={CURVE.w} height={100} style={{ position: "absolute", left: CURVE.x, top: CURVE.y - 50, overflow: "visible" }}>
              <clipPath id="vi04-sc03-path">
                <rect x={-10} y={-60} width={(CURVE.w + 20) * draw} height={220} />
              </clipPath>
              <polyline transform="translate(0 50)" points={wavePts(amp, freq, CURVE.w)} fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" clipPath="url(#vi04-sc03-path)" />
            </svg>
          </Card>
        </Appear>
      </Appear>

      {/* B–D — what changes from route to route */}
      {ROUTES.map((r, i) => {
        const from = i === 0 ? enter1 : starts[i];
        const to = until(i);
        return (
          <Appear key={r.name} at={from} out={to} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            {/* the heading */}
            <Appear at={W(r.titleAt) - m.sec(0.1)} style={{ left: 0, top: 0 }}>
              <Heading n={i + 1} text={r.title} />
            </Appear>

            {/* the vehicle */}
            <Appear at={from} style={{ left: HUB.x, top: HUB.y, width: HUB.w, height: HUB.h }}>
              <Vehicle name={r.art} cx={HUB.w / 2} cy={205} h={r.artH} />
              <div style={{ position: "absolute", left: 0, top: 370, width: HUB.w, textAlign: "center", ...typeStyle("label"), color: c.slate }}>{r.name}</div>
            </Appear>

            {/* the numbers */}
            {r.stats.map((s, k) => (
              <Appear key={s.label} at={W(s.at)} style={{ left: NODE_X + (k === 0 ? 48 : STATS.col + 40), top: STATS.y + 44 }}>
                <div style={{ ...typeStyle("label"), color: c.slate, whiteSpace: "nowrap" }}>{s.label}</div>
                <div style={{ marginTop: 6, ...typeStyle("statement"), color: k === 0 ? theme.color.checkGreen : theme.color.calendarRed, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                  {s.parts.map((pt, j) => {
                    const at = W(pt.at, pt.nth ?? 0);
                    if (f < at) return null;
                    const v = pt.v * ease(f, at, m.sec(0.5));
                    return (
                      <span key={j}>
                        {j > 0 ? " – " : s.sign ?? ""}
                        {pt.dec ? v.toFixed(pt.dec).replace(".", ",") : Math.round(v)}%
                      </span>
                    );
                  })}
                </div>
              </Appear>
            ))}
            {r.note ? (
              <Appear at={W(r.note.at)} style={{ left: NODE_X + 48, top: STATS.y + 196 }}>
                <div style={{ ...typeStyle("label"), color: c.indigo, whiteSpace: "nowrap" }}>{r.note.text}</div>
              </Appear>
            ) : null}

            {/* the examples */}
            <Connector a={HUB_OUT} b={IN.ex} p={grow(W(r.ex[0].at) - m.sec(0.3))} shape="elbow" />
            {r.ex.map((e, k) => {
              const w = r.ex.length === 1 ? STATS.w : EX.w;
              return (
                <Appear key={e.text} at={W(e.at)} rise={0} style={{ left: NODE_X + k * (EX.w + EX.gap), top: EX.y }}>
                  <Card x={0} y={0} w={w} h={EX.h} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 26px" }}>
                    {e.icon ? <IconDot name={e.icon} size={34} neutral /> : null}
                    {e.art ? (
                      <div style={{ position: "relative", width: 96, height: 64, flex: "none" }}>
                        <Vehicle name={e.art} cx={48} cy={32} h={e.art === "speedboat" ? 40 : 56} />
                      </div>
                    ) : null}
                    <div style={{ minWidth: 0 }}>
                      {e.lead ? <div style={{ ...typeStyle("label"), fontSize: 24, color: c.slate }}>{e.lead}</div> : null}
                      <div style={{ ...typeStyle("body"), fontSize: 32, color: c.ink, whiteSpace: "nowrap" }}>
                        <Typed text={e.text} at={W(e.at) + m.sec(0.15)} />
                      </div>
                    </div>
                  </Card>
                </Appear>
              );
            })}

            {/* the closing line */}
            <Connector a={HUB_OUT} b={IN.end} p={grow(W(r.end.at) - m.sec(0.3))} shape="elbow" tone={r.end.amber ? theme.color.selfAmber : undefined} />
            {/* in a label like the examples — same icon slot, same gap — and typed (Simon, 22 Oct) */}
            <Appear at={W(r.end.at)} rise={0} style={{ left: NODE_X, top: END_Y - EX.h / 2 }}>
              <Card x={0} y={0} w={STATS.w} h={EX.h} line={r.end.amber ? theme.color.selfAmber : undefined} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 26px" }}>
                {r.end.icon === "wheel" ? (
                  <div style={{ width: 34 * 1.55, height: 34 * 1.55, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <IsoIcon name="wheel" h={50} />
                  </div>
                ) : (
                  <IconDot name={r.end.icon} size={34} neutral />
                )}
                <div style={{ ...typeStyle("body"), fontSize: 32, color: c.ink }}>
                  <Typed text={r.end.text} at={W(r.end.at) + m.sec(0.15)} mark={r.end.mark} markInk={r.end.amber ? theme.color.selfAmberInk : undefined} />
                </div>
              </Card>
            </Appear>
          </Appear>
        );
      })}

      {/* E — the three, side by side */}
      <Appear at={sumAt} out={askAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {ROUTE_CARDS.map((r, i) => (
          <Appear key={r.name} at={sumAt + m.sec(0.12) * i} style={{ left: 0, top: 0 }}>
            <RouteCard i={i} x={triX(i)} y={TRI.y} draw={ease(f, W("besar naik-turunnya") + m.sec(0.2) * i, m.sec(0.7))} />
          </Appear>
        ))}
        {ARROWS.map((a, i) => {
          const at = W(a.at);
          const p = ease(f, at + m.sec(0.1), m.sec(0.8));
          const y = ARROW.ys[i];
          return (
            <Appear key={a.label} at={at} style={{ left: 0, top: 0 }}>
              {/* each row's name in a flat label (no shadow — these three only), all the same width so the arrows line up (Simon, 22 Oct) */}
              <Card x={ARROW.x} y={y - ARROW.tag.h / 2} w={ARROW.tag.w} h={ARROW.tag.h} style={{ display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("body"), fontSize: 32, color: c.ink, whiteSpace: "nowrap", boxShadow: "none" }}>
                {a.label}
              </Card>
              <div style={{ position: "absolute", left: ARROW.line0 - 24, top: y - 20, transform: "translateX(-100%)", ...typeStyle("label"), color: c.slate, lineHeight: "40px" }}>{a.from}</div>
              <Arrow x0={ARROW.line0} x1={ARROW.line1} y={y} p={p} />
              <div style={{ position: "absolute", left: ARROW.line1 + 24, top: y - 20, ...typeStyle("label"), color: c.indigo, lineHeight: "40px", opacity: ease(f, at + m.sec(0.6), m.reveal) }}>{a.to}</div>
            </Appear>
          );
        })}
      </Appear>

      {/* F — two questions */}
      <Appear at={askAt + m.sec(0.1)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <AskLead />
      </Appear>
      <Appear at={W("ada dua")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <AskMain />
      </Appear>
      {QUESTIONS.map((q, i) => (
        <Appear key={q.title} at={W("dua pertanyaan") + m.sec(0.15) * i} style={{ left: 0, top: 0 }}>
          <AskCard i={i} />
        </Appear>
      ))}
    </Stage>
  );
};
