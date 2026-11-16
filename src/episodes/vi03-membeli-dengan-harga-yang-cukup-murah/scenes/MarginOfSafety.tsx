/**
 * VI03 · SC04 — "Margin of Safety", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC04.png, in VI02's look.
 *
 *  A  "Kalau kita sudah punya estimasi harga wajar": SC02's measure again, the price dot ON the fair-value line, "Beli tepat
 *     di sini?"; on "hasil perhitungan" the line becomes a band, on "bisa salah" the band widens.
 *  B  "Benjamin Graham menyebut jawabannya" (a cut): his photo tile, "Margin of Safety", "The Intelligent Investor".
 *  C  "Bayangkan jembatan" (a cut): a line-art bridge "Kuat 10 ton", VI02's truck rolls on "3 ton"; a 0–10 ton bar under it,
 *     filled to 3, the rest bracketed "Margin of Safety".
 *  D  "Kalau perusahaan kita perkirakan bernilai 100" (a cut): Nilai 100 | Beli 95 "Ruang kecil", Nilai 100 | Beli 70
 *     "Ruang besar".
 *  E  "Margin of Safety bukan jaminan" (a cut): Orang Tuntun, two cards — the one it is not (grey), the one it is (lit).
 *  F  "Kalau harga sekarang belum memberi" (a cut): "Tunggu.", Mr. Market walking in, a row of days, each with its own move.
 *
 * 100 / 95 / 70 and 10 / 3 ton are the script's own example numbers.
 */
import { interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Drawing, Figure, Glyph, Line, ORANG_TUNTUN_RIGHT, OrangTuntun, PhotoTile, Pic, Ring, Shot, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — the fair value as a line, then a band
const FAIR = { x0: 620, x1: 1220, y: 470, dot: 22, label: 46 };
const BAND = { h1: 70, h2: 190 };

// B — Graham
const TILE = { d: 320, x: 300, y: 290 };
const TILE_H = (TILE.d * 423) / 406;

// C — the bridge
const BRIDGE = { cx: 980, floor: 640, h: 330 };
/** VI02's line-art truck (public/art/vi02/line/truck.png, 371 × 254). */
const TRUCK = { src: "art/vi02/line/truck.png", w0: 371, h0: 254, h: 130, from: 770, to: 1000 };
/** Where the deck's top sits in the bridge drawing, as a share of its height from the floor (measured on the PNG: row 163 of 293). */
const DECK = 130 / 293;
const TRUCK_W = (TRUCK.h * TRUCK.w0) / TRUCK.h0;
const TON = { x0: 560, x1: 1400, y: 760, h: 40, cap: 10, load: 3 };
const tonX = (t: number) => TON.x0 + (t / TON.cap) * (TON.x1 - TON.x0);

// D — value against price
const PAIRS = [
  { cx: 640, buy: 95, room: "Ruang kecil", valueAt: "bernilai 100", buyAt: "dibeli di 95", roomAt: "ruang kesalahannya" },
  { cx: 1290, buy: 70, room: "Ruang besar", valueAt: "dibeli di 70", buyAt: "dibeli di 70", roomAt: "ada ruang" },
] as const;
const BAR = { w: 150, gap: 36, base: 800, full: 420, label: 36 };
const barH = (v: number) => (v / 100) * BAR.full;

// E — what it is, what it isn't
const TWO = { x: ORANG_TUNTUN_RIGHT + 70, gap: 40, y: 330, h: 330 };
const TWO_W = (1760 - TWO.x - TWO.gap) / 2;

// F — wait; Mr. Market comes every day
const WAIT = { cx: 640, y: 330, size: 92 };
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum"] as const;
const DAY = { x: 210, y: 560, w: 168, h: 190, gap: 22 };
const MOVES = ["trend-up", "trend-down", "trend-down", "trend-up", "trend-down"] as const;
const MARKET = { cx: 1530, floor: 860, h: 520, from: 2080 };

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);
  const g = f + BLOCK.SC04;

  const grahamAt = W("Benjamin");
  const bridgeAt = W("Bayangkan jembatan");
  const numbersAt = W("Kalau perusahaan");
  const caveatAt = W("Margin of Safety bukan");
  const waitAt = W("Kalau harga sekarang");

  // A
  const band1 = ease(f, W("hasil perhitungan"), m.move);
  const band2 = ease(f, W("bisa salah"), m.move);
  const bandH = mix(4, BAND.h1, band1) + (BAND.h2 - BAND.h1) * band2;

  // C
  const roll = ease(f, W("melewatkan kendaraan"), m.sec(1.4));
  const load = ease(f, W("tiga ton") , m.move);
  const marginP = ease(f, W("Logikanya"), m.reveal);

  // F
  const walk = ease(f, W("Mr. Market"), m.sec(1.1));
  const today = ease(f, W("hari ini", 0), m.pop);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — buy right on the fair value? It is only a calculation, and it can be wrong */}
      <Shot from={-1} to={grahamAt} block={BLOCK.SC04} cutIn={false}>
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: ease(f, -m.reveal, m.reveal) }}>
          {band1 > 0.001 ? <rect x={FAIR.x0} y={FAIR.y - bandH / 2} width={FAIR.x1 - FAIR.x0} height={bandH} rx={Math.min(bandH / 2, 30)} fill={theme.color.indigoWashSolid} stroke={c.indigo} strokeWidth={2} /> : null}
          <line x1={FAIR.x0} y1={FAIR.y} x2={FAIR.x1} y2={FAIR.y} stroke={c.ink} strokeWidth={4} strokeLinecap="round" />
          <circle cx={CX - 40} cy={FAIR.y} r={FAIR.dot} fill={c.cardBg} stroke={c.indigo} strokeWidth={4} />
          <circle cx={CX - 40} cy={FAIR.y} r={FAIR.dot * 0.5} fill={c.indigo} />
        </svg>
        <div style={{ position: "absolute", left: FAIR.x1 + 40, top: FAIR.y - 40, lineHeight: "80px", opacity: ease(f, -m.reveal, m.reveal), ...typeStyle("label"), fontSize: FAIR.label, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Harga wajar</div>
        <Appear at={W("langsung membeli")} style={{ left: 0, top: 0 }}>
          <WordPill x={CX - 40} y={FAIR.y - 150} text="Beli tepat di sini?" size={44} />
        </Appear>
        {band1 > 0.001 ? (
          <div style={{ position: "absolute", left: CX - 40, top: FAIR.y + BAND.h2 / 2 + 70, transform: "translate(-50%, -50%)", opacity: band1, padding: "12px 32px", borderRadius: 999, background: band2 > 0.5 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: `inset 0 0 0 2px ${band2 > 0.5 ? c.indigo : theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: 40, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>{band2 > 0.5 ? "Bisa salah" : "Hasil perhitungan"}</div>
        ) : null}
      </Shot>

      {/* B — Graham's answer */}
      <Shot from={grahamAt} to={bridgeAt} block={BLOCK.SC04}>
        <PhotoTile name="graham" d={TILE.d} style={{ left: TILE.x, top: TILE.y }} />
        <div style={{ position: "absolute", left: TILE.x - 40, width: TILE.d + 80, top: TILE.y + TILE_H + 26, textAlign: "center", ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: c.ink }}>Benjamin Graham</div>
        <Appear at={W("Margin of Safety")} style={{ left: 780, top: 360, width: 900 }}>
          <div style={{ ...typeStyle("title"), fontSize: 104, fontWeight: 700, lineHeight: 1.05, color: c.indigo, whiteSpace: "nowrap" }}>Margin of Safety</div>
        </Appear>
        <Appear at={W("Margin of Safety") + m.sec(0.4)} style={{ left: 780, top: 520 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 30px 10px 12px", borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft }}>
            <div style={{ width: 58, height: 58, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="book-open" size={32} tone={theme.color.neutralIcon} />
            </div>
            <div style={{ ...typeStyle("label"), fontSize: 32, fontWeight: 500, fontStyle: "italic", color: c.ink, whiteSpace: "nowrap" }}>The Intelligent Investor</div>
          </div>
        </Appear>
      </Shot>

      {/* C — a bridge for ten tonnes, a truck of three */}
      <Shot from={bridgeAt} to={numbersAt} block={BLOCK.SC04}>
        <Drawing name="bridge" cx={BRIDGE.cx} floor={BRIDGE.floor} h={BRIDGE.h} style={{ opacity: ease(f, -m.reveal, m.reveal) }} />
        <Appear at={W("sepuluh ton")} style={{ left: 0, top: 0 }}>
          <WordPill x={BRIDGE.cx + 330} y={BRIDGE.floor - BRIDGE.h - 10} text="Kuat 10 ton" size={38} />
        </Appear>
        {roll > 0.001 || f >= W("melewatkan kendaraan") ? (
          <div style={{ position: "absolute", left: mix(TRUCK.from, TRUCK.to, roll) - TRUCK_W / 2, top: BRIDGE.floor - BRIDGE.h * DECK - TRUCK.h, width: TRUCK_W, height: TRUCK.h, opacity: ease(f, W("melewatkan kendaraan") - m.sec(0.2), m.reveal) }}>
            <Pic src={staticFile(TRUCK.src)} style={{ position: "absolute", inset: 0, width: TRUCK_W, height: TRUCK.h }} />
            <Appear at={W("tiga ton")} style={{ left: TRUCK_W / 2, top: -46 }}>
              <WordPill x={0} y={0} text="3 ton" size={34} />
            </Appear>
          </div>
        ) : null}
        {/* the load against the bridge's strength */}
        <Appear at={W("sepuluh ton")} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <div style={{ position: "absolute", left: TON.x0, top: TON.y, width: TON.x1 - TON.x0, height: TON.h, borderRadius: TON.h / 2, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${c.ink}` }} />
          <div style={{ position: "absolute", left: TON.x0, top: TON.y, width: (tonX(TON.load) - TON.x0) * load, height: TON.h, borderRadius: TON.h / 2, background: c.indigo }} />
          <div style={{ position: "absolute", left: TON.x0 - 80, width: 60, top: TON.y, lineHeight: `${TON.h}px`, textAlign: "right", ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.slate }}>0</div>
          <div style={{ position: "absolute", left: TON.x1 + 20, top: TON.y, lineHeight: `${TON.h}px`, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.slate, whiteSpace: "nowrap" }}>10 ton</div>
        </Appear>
        {marginP > 0.001 ? (
          <div style={{ position: "absolute", inset: 0, opacity: marginP }}>
            <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
              <path d={`M ${tonX(TON.load) + 8} ${TON.y + TON.h + 14} Q ${tonX(TON.load) + 8} ${TON.y + TON.h + 34} ${tonX(TON.load) + 30} ${TON.y + TON.h + 34} L ${(tonX(TON.load) + TON.x1) / 2 - 20} ${TON.y + TON.h + 34} Q ${(tonX(TON.load) + TON.x1) / 2} ${TON.y + TON.h + 34} ${(tonX(TON.load) + TON.x1) / 2} ${TON.y + TON.h + 54} Q ${(tonX(TON.load) + TON.x1) / 2} ${TON.y + TON.h + 34} ${(tonX(TON.load) + TON.x1) / 2 + 20} ${TON.y + TON.h + 34} L ${TON.x1 - 30} ${TON.y + TON.h + 34} Q ${TON.x1 - 8} ${TON.y + TON.h + 34} ${TON.x1 - 8} ${TON.y + TON.h + 14}`} fill="none" stroke={c.indigo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <WordPill x={(tonX(TON.load) + TON.x1) / 2} y={TON.y + TON.h + 96} text="Margin of Safety" size={36} />
          </div>
        ) : null}
      </Shot>

      {/* D — 100 bought at 95, 100 bought at 70 */}
      <Shot from={numbersAt} to={caveatAt} block={BLOCK.SC04}>
        {PAIRS.map((pr, i) => {
          const pv = ease(f, W(pr.valueAt), m.reveal);
          const pb = ease(f, W(pr.buyAt) + (i === 1 ? m.sec(0.3) : 0), m.reveal);
          const room = ease(f, W(pr.roomAt), m.reveal);
          const xv = pr.cx - BAR.gap / 2 - BAR.w;
          const xb = pr.cx + BAR.gap / 2;
          const topV = BAR.base - barH(100);
          const topB = BAR.base - barH(pr.buy) * pb;
          return (
            <div key={pr.buy} style={{ position: "absolute", inset: 0 }}>
              {pv > 0.001 ? (
                <div style={{ position: "absolute", inset: 0, opacity: pv }}>
                  <div style={{ position: "absolute", left: xv, top: topV, width: BAR.w, height: barH(100), borderRadius: 22, background: theme.color.neutralDisc, boxShadow: `inset 0 0 0 2px ${c.ink}` }} />
                  <div style={{ position: "absolute", left: xv - 30, width: BAR.w + 60, top: BAR.base + 20, textAlign: "center", ...typeStyle("label"), fontSize: BAR.label, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Nilai 100</div>
                </div>
              ) : null}
              {pb > 0.001 ? (
                <div style={{ position: "absolute", inset: 0 }}>
                  <div style={{ position: "absolute", left: xb, top: topB, width: BAR.w, height: BAR.base - topB, borderRadius: 22, background: c.indigo }} />
                  <div style={{ position: "absolute", left: xb - 30, width: BAR.w + 60, top: BAR.base + 20, textAlign: "center", opacity: pb, ...typeStyle("label"), fontSize: BAR.label, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>Beli {pr.buy}</div>
                </div>
              ) : null}
              {room > 0.001 ? (
                <div style={{ position: "absolute", inset: 0, opacity: room }}>
                  <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d={`M ${xb + BAR.w + 14} ${topV} L ${xb + BAR.w + 34} ${topV} L ${xb + BAR.w + 34} ${topB} L ${xb + BAR.w + 14} ${topB}`} fill="none" stroke={c.indigo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                    <line x1={xv} y1={topV} x2={xb + BAR.w} y2={topV} stroke={c.indigo} strokeWidth={2} strokeDasharray="8 10" />
                  </svg>
                  <div style={{ position: "absolute", left: xb + BAR.w + 50, top: (topV + topB) / 2 - 28, padding: "8px 24px", borderRadius: 999, background: theme.color.indigoWashSolid, boxShadow: `inset 0 0 0 2px ${c.indigo}`, ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>{pr.room}</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </Shot>

      {/* E — not a guarantee; an admission */}
      <Shot from={caveatAt} to={waitAt} block={BLOCK.SC04}>
        <OrangTuntun at={caveatAt} />
        {[
          { icon: "seal-check", text: "Bukan jaminan nggak rugi", mark: "jaminan", at: W("bukan jaminan") },
          { icon: "scales", text: "Mengakui kita mungkin salah", mark: "mungkin salah", at: W("kita mengakui") },
        ].map((k, i) => {
          const p = ease(f, k.at, m.reveal);
          const dim = i === 0 ? ease(f, W("berarti"), m.reveal) : 0;
          return p > 0.001 ? (
            <div key={k.text} style={{ position: "absolute", left: TWO.x + i * (TWO_W + TWO.gap), top: TWO.y + (1 - p) * 14, width: TWO_W, height: TWO.h, opacity: p }}>
              <Card x={0} y={0} w={TWO_W} h={TWO.h} style={{ background: interpolateColors(dim, [0, 1], [c.cardBg, theme.color.neutralDisc]), boxShadow: i === 1 ? shadow.glow : shadow.soft }}>
                {i === 1 ? <Ring p={1} tone={c.indigo} /> : null}
                <div style={{ position: "absolute", left: (TWO_W - 110) / 2, top: 50, width: 110, height: 110, borderRadius: 999, background: i === 1 ? theme.color.indigoWashSolid : theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={k.icon} size={60} tone={i === 1 ? c.indigo : theme.color.neutralIcon} />
                </div>
                <Line x={30} y={235} w={TWO_W - 60} text={k.text} mark={i === 1 ? k.mark : undefined} size={42} align="center" weight={500} />
              </Card>
            </div>
          ) : null;
        })}
      </Shot>

      {/* F — wait: Mr. Market comes every day */}
      <Shot from={waitAt} to={1e6} block={BLOCK.SC04} cutOut={false}>
        <Appear at={W("Tunggu")} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: WAIT.cx, top: WAIT.y, transform: "translate(-50%, -50%)", padding: "20px 70px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.glow}, inset 0 0 0 3px ${c.indigo}`, ...typeStyle("title"), fontSize: WAIT.size, fontWeight: 700, color: c.indigo, whiteSpace: "nowrap" }}>Tunggu.</div>
        </Appear>
        {walk > 0.001 ? <Figure name="mr-market" cx={mix(MARKET.from, MARKET.cx, walk)} floor={MARKET.floor} h={MARKET.h} flip /> : null}
        <Appear at={W("Mr. Market") + m.sec(0.4)} style={{ left: 0, top: 0 }}>
          <WordPill x={MARKET.cx} y={MARKET.floor + 50} text="Mr. Market" size={32} />
        </Appear>
        {DAYS.map((d, i) => {
          const p = ease(f, W("setiap hari") + i * m.sec(0.18), m.reveal);
          const lit = i === DAYS.length - 1 ? today : 0;
          const x = DAY.x + i * (DAY.w + DAY.gap);
          return p > 0.001 ? (
            <div key={d} style={{ position: "absolute", left: x, top: DAY.y + (1 - p) * 14, width: DAY.w, height: DAY.h, opacity: p }}>
              <Card x={0} y={0} w={DAY.w} h={DAY.h} style={{ boxShadow: lit > 0.5 ? shadow.glow : shadow.soft }}>
                <Ring p={lit} tone={c.indigo} />
                <div style={{ position: "absolute", left: 0, width: DAY.w, top: 26, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>{d}</div>
                <div style={{ position: "absolute", left: (DAY.w - 84) / 2, top: 88, width: 84, height: 84, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={MOVES[i]} size={48} tone={c.indigo} />
                </div>
              </Card>
            </div>
          ) : null;
        })}
        <Appear at={W("nggak harus")} style={{ left: 0, top: 0 }}>
          <WordPill x={DAY.x + 4.5 * DAY.w + 4 * DAY.gap - DAY.w / 2 - 150} y={DAY.y + DAY.h + 70} text="Nggak harus beli hari ini" size={36} />
        </Appear>
      </Shot>
    </Stage>
  );
};
