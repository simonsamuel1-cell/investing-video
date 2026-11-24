/**
 * VI03 · SC03 — Simon's own version (17 Nov: "Buat baru untuk bagian dari 3802 hingga akhir scene, tapi buat kosong aja,
 * aku mau buat sendiri"). Up to Studio 3802 of the Full comp it is v3's opening — "Harga wajar dari mana?" in the middle,
 * "Harga wajar" in indigo, held still (v3 docks it to the heading from 3786, inside the part that is now his). From 3802
 * to the scene's end only the paper and the grid: the space Simon fills himself — except what he asks for:
 *  - "Kita kembali ke Ibu Sari" (17 Nov: "kamu copy visual dari VI01 scene 01 frame 624"): VI01 SC01 as it stands at its
 *    Studio 624 — the white frame with its black border, Ibu Sari with her book left of the warung — same places, same
 *    sizes; "Ibu Sari" under her in plain black. Its "hanya ilustrasi" label is not copied: that was VI01's own exception
 *    to the no-"Ilustrasi" rule.
 *  - The Buku kas card at Studio 4135, its lines the script's: Laba bersih 20 juta/thn, Sudah berjalan 10 tahun,
 *    Pelanggan Stabil, each on its word.
 *
 * The earlier builds stay behind SC03_LOOK: "build" (IbuSariBuild.tsx, v3) and "shots" (IbuSariValue.tsx).
 * Studio comp "VI03-Scene03" is the v3 build alone, kept for the parts worth taking from it.
 */
import {
  CardE as Card,
  FigureE as Figure,
  PicE as Pic,
} from "../../../editable";
import { staticFile, useCurrentFrame, Interactive } from "remotion";
import {
  INTRO_FRAMES,
  SoftGround,
  Stage,
  cutInStyle,
  cutOutStyle,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
  type Cut,
} from "../../../core";
import { BLOCK, CUT } from "../data/timing";
import {
  ART,
  BoardGrid,
  Glyph,
  KAMU_FULL,
  LedgerCard,
  PhotoTile,
  ease,
  useWords,
} from "../components/kit";

/** Simon's frame in the Full comp (intro included) where his part starts → this scene's own frame. */
const SIMON_FROM_STUDIO = 3802;
export const SC03_SIMON_FROM = SIMON_FROM_STUDIO - INTRO_FRAMES - BLOCK.SC03;

/** v3's opening question: centred, 1.7× the heading's size */
const ASK = { y: 500, scale: 1.7 };

// VI01 SC01 at its Studio 624 (scenes/TwoLedgers.tsx): the same numbers
const FRAME = {
  w: 1600,
  h: 700,
  x: (theme.canvas.width - 1600) / 2,
  y: (theme.canvas.height - 700) / 2,
  line: 3,
};
/**
 * Everything 21 px higher than VI01's floor (722) so the block — the line over the warung, the drawings, the names and the
 * question under them — sits in the frame with 40 px above and below it, and 40 px between the names and the question
 * (Simon 17 Nov: "jarak2nya rapihin dulu"; measured on the rendered frame).
 */
const LIFT = 21;
const FLOOR = 722 - LIFT;
/** The warung (and the line over it) in the middle of the white frame; Ibu Sari 60 px left of VI01's place (Simon 17 Nov). */
const WARUNG = { h: 364, cx: FRAME.x + FRAME.w / 2 };
const IBU = { h: 336, cx: 650 - 60 };
/** "Ibu Sari" under her feet */
const NAME = { gap: 22, size: 34 };
/**
 * The Buku kas card: in from Studio 4135 (Simon 17 Nov), its lines the script's facts, each on its word ("20 juta/thn", his
 * words). VI01's own size and place again (470 wide, 50 px in from the frame's right edge) now that the line fits.
 */
const LEDGER = {
  k: 0.7,
  w: 470,
  h: 392,
  x: FRAME.x + FRAME.w - 50 - 470,
  y: 344 - LIFT,
};
const LEDGER_FROM_STUDIO = 4135;
const BOOK_ROWS = [
  { label: "Laba bersih", value: "20 juta/thn", at: "laba bersih" },
  { label: "Sudah berjalan", value: "10 tahun", at: "Sudah berjalan" },
  { label: "Pelanggan", value: "Stabil", at: "pelanggannya" },
] as const;

/**
 * "Kalau kamu ingin membeli warung itu" (Simon 17 Nov): the card fades out but for its "Laba bersih" line, which goes up over
 * the warung; Kamu comes in on the right, facing it. ROW1 is that line where LedgerCard lays it out (its padding 40/44, title
 * 72, gap 22, row 104, all × the card's scale).
 */
const ROW1 = {
  x: LEDGER.x + 44 * LEDGER.k,
  y: LEDGER.y + (40 + 72 + 22) * LEDGER.k,
  w: LEDGER.w - 2 * 44 * LEDGER.k,
  h: 104 * LEDGER.k,
};
/** its middle over the warung: 32 px above the roof, 64 px under the frame's top */
const ROW1_UP = { cx: WARUNG.cx, cy: 290 - LIFT };
/**
 * Kamu (VI02's young man) as drawn, facing left to the warung (Simon 17 Nov), right of the warung by the same gap as Ibu Sari
 * is left of it (Simon 17 Nov: "berjarak sama seperti Ibu Sari"), edge to edge — the drawings' ink runs to within 8 px of
 * their images.
 */
const KAMU_H = 350;
const KAMU_W = (KAMU_H * KAMU_FULL.w) / KAMU_FULL.h;
const WARUNG_W = (WARUNG.h * ART.warung.w) / ART.warung.h;
const IBU_W = (IBU.h * ART["ibu-sari"].w) / ART["ibu-sari"].h;
const GAP = WARUNG.cx - WARUNG_W / 2 - (IBU.cx + IBU_W / 2);
const KAMU = { h: KAMU_H, cx: WARUNG.cx + WARUNG_W / 2 + GAP + KAMU_W / 2 };
/**
 * On "membayar" (Simon 17 Nov): one line under the two names, in the middle of the white frame, large, bold, indigo, no pill —
 * his words, with "siap" for the "siapa" he typed.
 */
const ASK_LINE = {
  text: "Kalau beli warung, siap bayar berapa kali laba tahunan?",
  cy: 815,
  size: 52,
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * After "…berapa kali laba tahunannya?" (+30 f of pause, Simon 17 Nov): the warung fades out; Ibu Sari and Kamu cross-fade
 * from whole figures to their heads — each drawing cropped from the top of the head to the neck (`crop`, in the image's own
 * pixels) — and the heads rise, level with the Laba bersih line, made one icon size (ICON_H tall). Their names go with them.
 */
const ICON_H = 84;
const PEOPLE = [
  {
    name: "Ibu Sari",
    src: "art/vi01/ibu-sari.png",
    img: ART["ibu-sari"],
    cx: IBU.cx,
    h: IBU.h,
    crop: { x0: 55, y0: 10, x1: 370, y1: 300 },
  },
  {
    name: "Kamu",
    src: KAMU_FULL.src,
    img: KAMU_FULL,
    cx: KAMU.cx,
    h: KAMU.h,
    crop: { x0: 80, y0: 20, x1: 410, y1: 362 },
  },
] as const;
/**
 * Then, from the v3 build (IbuSariBuild.tsx — comp VI03-Scene03), the part Simon picked on a screenshot (17 Nov): "Harga beli
 * = laba × kelipatan", the price it makes, the 1x … 30x scale with its knob, and one block per year of profit the price is
 * worth, in a card of its own in the white space under the two heads, centred in the frame. v3's
 * beats: in on "Satu kali" (1x), the price on "dua puluh juta", the knob to 30x by "enam ratus", back to the 8–12x band on
 * "warung sejenis" / "8–12". v3's Kamu, his bubble and its status pills are not taken. The question line fades out first.
 */
/** its top 50 px under the "Ibu Sari" label (Simon 17 Nov), whose letters end at y 354 on the rendered frame */
const PRICE = { w: 1150, h: 300, x: FRAME.x + FRAME.w / 2 - 575, y: 354 + 50 };
const SUM = { x: 76, y: 58, size: 34 };
const READOUT = { right: 1076, y: 58, size: 60 };
const SCALE = { x0: 116, x1: 1016, y: 192, knob: 15 };
const MULT = { lo: 1, hi: 30 };
const xOf = (m: number) =>
  SCALE.x0 + ((m - MULT.lo) / (MULT.hi - MULT.lo)) * (SCALE.x1 - SCALE.x0);
const BAND = { lo: 8, hi: 12, h: 30, labelY: 150 };
const YEARS = Array.from({ length: MULT.hi }, (_, i) => i + 1);
const YEAR_BLOCK = { w: 22, h: 30, base: 258 };
/**
 * "Terlalu murah" under the price card while the VO says "Terlalu murah. Ibu Sari tentu nggak mau menjualnya." (Simon 17 Nov):
 * the question line's style — plain text, 52 px, bold, indigo — centred in the frame, its letters midway between the card's
 * foot and the frame's.
 */
const TOO_CHEAP = { text: "Terlalu murah", cy: 795, size: ASK_LINE.size };
/** The same place and style while the VO says "Artinya kamu membutuhkan sekitar tiga puluh tahun untuk mendapatkan kembali
 * uangmu." (Simon 17 Nov: "kasih text ringkasan"): the line in four words. */
const PAYBACK = { text: "30 tahun balik modal", from: "Artinya", to: "uangmu" };
/** …and while it says "Sementara warung sejenis biasanya diperjualbelikan sekitar 8–12 kali laba tahunan." (Simon 17 Nov) */
const PEERS = {
  text: "Warung sejenis: 8–12x laba",
  from: "Sementara",
  to: "tahunan",
};

/**
 * "Inti valuasi sebenarnya sederhana: bisnis menghasilkan berapa banyak, bisa menghasilkan selama berapa lama, dan seberapa
 * yakin kita terhadap hasil tersebut." (Simon 17 Nov): the price card fades out; three unseen columns in the white space under
 * the heads, each a box in the Laba bersih line's own style (white, skeleton border): a label, a picture, a value.
 *  1  the Laba bersih line itself, moved and grown into it, its one line turning into two: "Laba bersih" / "20 juta/thn";
 *     coins between them on "berapa banyak".
 *  2  on "selama": time — ten blocks filling, one per year (Simon: "anggap saja rangenya 10 tahun"), "X tahun" (his words).
 *  3  on "seberapa yakin": confidence — a meter filling to 90 %, "Hasil maksimal" (his words).
 * The boxes sit where the price card sat (its top 50 px under the names), 440 × 300, 60 px apart, centred in the frame.
 */
const COL = {
  w: 440,
  h: 300,
  gap: 60,
  y: 354 + 50,
  labelY: 62,
  midY: 150,
  valueY: 240,
  labelSize: 34,
  valueSize: 44,
};
const COL_X = [0, 1, 2].map(
  (i) =>
    FRAME.x +
    FRAME.w / 2 -
    (3 * COL.w + 2 * COL.gap) / 2 +
    i * (COL.w + COL.gap),
);
/** the Laba bersih line's two words as LedgerCard sets them at the card's scale (measured: 148 and 140 px wide) */
const ROW_TEXT = {
  label: 148,
  value: 140,
  pad: 34 * LEDGER.k,
  size: 38 * LEDGER.k,
};
const COLS = [
  { label: "Waktu", value: "X tahun", at: "selama" },
  { label: "Keyakinan", value: "Hasil maksimal", at: "seberapa yakin" },
] as const;
const YEARS10 = { n: 10, w: 30, gap: 8, h: 34 };
/** the coins between "Laba bersih" and its figure: a grey disc and the glyph */
const COINS = { d: 96, glyph: 58 };
/** the meter: a half ring, filled to 90 % (Simon 17 Nov) */
const METER = { r: 66, stroke: 18, level: 0.9 };

/** A column box: white, its border the Laba bersih line's, a label on top and a value at the foot. */
const ColBox = ({
  x,
  y,
  label,
  value,
  children,
  style,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const c = usePalette();
  return (
    <Interactive.Div
      name="Objek"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: COL.w,
        height: COL.h,
        borderRadius: 24,
        background: c.cardBg,
        boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`,
        ...style,
      }}
    >
      <Interactive.Div
        name="Objek"
        style={{
          position: "absolute",
          left: COL.w / 2,
          top: COL.labelY,
          transform: "translate(-50%, -50%)",
          ...typeStyle("label"),
          fontSize: COL.labelSize,
          fontWeight: 600,
          color: c.ink,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Interactive.Div>
      {children}
      <Interactive.Div
        name="Objek"
        style={{
          position: "absolute",
          left: COL.w / 2,
          top: COL.valueY,
          transform: "translate(-50%, -50%)",
          ...typeStyle("title"),
          fontSize: COL.valueSize,
          fontWeight: 700,
          color: c.indigo,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Interactive.Div>
    </Interactive.Div>
  );
};

/**
 * Studio 6798 (Simon 17 Nov): a camera cut out of the frame and its columns, to "Discounting" — indigo, very large — and under
 * it, each on its name in the VO, Warren Buffett's face (VI01's photo tile) and Ibu Sari's (her head-to-neck crop in the same
 * white tile), the pair centred; on "Tuntun Research" both cross-fade into Tuntun's mark (the T of the Tuntun Academy logo Simon
 * sent, public/art/vi03/tuntun-academy-mark.png) in the middle; each named. On "Reference Fair Value" the word "Discounting"
 * cross-fades into "Reference Fair Value", the same size (no app card: Simon 17 Nov).
 */
const CUT_FROM_STUDIO = 6798;
const DISC = {
  text: "Discounting",
  after: "Reference Fair Value",
  cy: 330,
  size: 160,
};
const MID_X = FRAME.x + FRAME.w / 2;
const FACE = {
  d: 220,
  top: 470,
  cxs: [MID_X - 200, MID_X + 200, MID_X],
  nameGap: 22,
  nameSize: 30,
};
const FACE_H = (FACE.d * ART.graham.h) / ART.graham.w;
const FACES = [
  { name: "Warren Buffett", at: "Buffett menghitung" },
  { name: "Ibu Sari", at: "Ibu Sari secara" },
  { name: "Tuntun Research Institute", at: "Tuntun Research" },
] as const;
/** Ibu Sari's head in the tile: the crop 78 % of the tile wide, its neck on the tile's foot */
const SARI_CROP = { x0: 55, y0: 10, x1: 370, y1: 300, fill: 0.78 };
const MARK = { src: "art/vi03/tuntun-academy-mark.png", fill: 0.62 };

/** a half-ring arc from the left end, `p` of the way round (0 → 1), centred on (cx, cy) */
const arc = (cx: number, cy: number, r: number, p: number) => {
  const a = Math.PI * (1 - p);
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${(cx + r * Math.cos(a)).toFixed(2)} ${(cy - r * Math.sin(a)).toFixed(2)}`;
};

/** where a person's head sits in their standing drawing, and where it goes */
const headOf = (p: (typeof PEOPLE)[number]) => {
  const k = p.h / p.img.h;
  const w = (p.crop.x1 - p.crop.x0) * k;
  const h = (p.crop.y1 - p.crop.y0) * k;
  const x = p.cx - (p.img.w * k) / 2 + p.crop.x0 * k;
  const y = FLOOR - p.h + p.crop.y0 * k;
  return {
    k,
    x,
    y,
    w,
    h,
    cx: x + w / 2,
    scale: ICON_H / h,
    dy: ROW1_UP.cy - (y + h / 2),
  };
};

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;

  // the question leaves from 3802; VI01's frame comes in on "kembali", Ibu Sari and the warung on "Ibu Sari"; the book at 4135
  const askOut = ease(f, SC03_SIMON_FROM, m.fade);
  const frameIn = ease(f, W("kembali"), m.reveal);
  const drawIn = ease(f, W("Ibu Sari"), m.reveal);
  const ledgerIn = ease(
    f,
    LEDGER_FROM_STUDIO - INTRO_FRAMES - BLOCK.SC03,
    m.reveal,
  );
  const rowIn = BOOK_ROWS.map((r) => ease(f, W(r.at), m.reveal));
  const buyAt = W("Kalau kamu");
  const cardOut = ease(f, buyAt, m.fade);
  /** up first, then across: on a straight line it would sweep over the warung's roof */
  const upY = ease(f, buyAt + m.fade * 0.5, m.sec(0.45));
  const upX = ease(f, buyAt + m.fade * 0.5 + m.sec(0.3), m.sec(0.6));
  const kamuIn = ease(f, W("kamu bersedia"), m.reveal);
  const askIn = ease(f, W("membayar"), m.reveal);
  const asked = W("tahunannya", 0, "f1");
  const warungOut = ease(f, asked, m.fade);
  const toHead = ease(f, asked, m.fade);
  const headUp = ease(f, asked + m.fade, m.move);
  const bodyOn = [drawIn, kamuIn];
  // the price card (v3's beats)
  const lineOut = ease(f, asked + m.fade, m.fade);
  const oneAt = W("Satu kali");
  const priceIn = ease(f, oneAt, m.reveal);
  const scaleDraw = ease(f, oneAt, m.sec(0.7));
  const thirtyAt = W("Tiga puluh kali");
  const run = ease(f, thirtyAt, W("enam ratus") - thirtyAt);
  const back = ease(f, W("warung sejenis"), m.sec(1.0));
  const band = ease(f, W("8–12"), m.reveal);
  /** the knob's multiple: 1 → 30 → 10, where the band takes over */
  const times = f < oneAt ? MULT.lo : mix(mix(MULT.lo, MULT.hi, run), 10, back);
  const knobOn = ease(f, oneAt, m.pop) * (1 - band);
  const readoutIn = ease(f, W("dua puluh juta"), m.reveal);
  /** a summary line under the card: in on its first word, out after its last */
  // the three columns
  const priceOut = ease(f, W("Inti valuasi"), m.fade);
  const grow = ease(f, W("bisnis menghasilkan"), m.move);
  const coinsIn = ease(f, W("berapa banyak"), m.pop);
  const colIn = COLS.map((q) => ease(f, W(q.at), m.reveal));
  const colFill = COLS.map((q) => ease(f, W(q.at) + m.sec(0.2), m.sec(1.0)));
  // the cut, and after it
  const cut: Cut = {
    at: CUT_FROM_STUDIO - INTRO_FRAMES - BLOCK.SC03,
    axis: "x",
    ...CUT,
  };
  /** Buffett and Ibu Sari fade out just before "Tuntun Research", Tuntun's mark fades in on it — one after the other, so their
   * names never overlap */
  const pairOut = ease(f, W("Tuntun Research") - m.fade, m.fade);
  const toMark = ease(f, W("Tuntun Research"), m.fade);
  const rfvIn = ease(f, W("Reference Fair Value"), m.fade);
  const under = [
    {
      text: TOO_CHEAP.text,
      at: W("Terlalu murah"),
      out: W("menjualnya", 0, "f1"),
    },
    { text: PAYBACK.text, at: W(PAYBACK.from), out: W(PAYBACK.to, 0, "f1") },
    { text: PEERS.text, at: W(PEERS.from), out: W(PEERS.to, 0, "f1") },
  ];
  /** a block is lit while the price still covers its year; on the band, 1–8 lit and 9–12 lighter */
  const blockTone = (yr: number) => {
    if (band > 0.5)
      return yr <= BAND.lo
        ? c.indigo
        : yr <= BAND.hi
          ? theme.color.indigoWashDeepSolid
          : theme.color.skeleton;
    return knobOn > 0.001 && yr <= Math.round(times)
      ? c.indigo
      : theme.color.skeleton;
  };
  const k = LEDGER.k;

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* everything up to the cut at 6798, cut away */}
      {f < cut.at ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...(f >= cut.at - cut.over / 2 ? cutOutStyle(f, cut) : {}),
          }}
        >
          {/* up to 3802 — the question */}
          {askOut < 0.999 ? (
            <Interactive.Div
              name="Harga wajar"
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: ASK.y - 40,
                height: 80,
                display: "flex",
                alignItems: "center",
                opacity: ease(f, -m.reveal, m.reveal) * (1 - askOut),
                transformOrigin: "50% 50%",
                transform: `translateX(-50%) scale(${ASK.scale})`,
              }}
            >
              <div
                style={{
                  fontFamily: theme.text.family,
                  fontSize: theme.type.title.size,
                  fontWeight: 500,
                  letterSpacing: theme.type.title.tracking,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: c.indigo }}>Harga wajar</span> dari mana?
              </div>
            </Interactive.Div>
          ) : null}

          {/* "Kita kembali ke Ibu Sari" — VI01 SC01 at its Studio 624 */}
          {frameIn > 0.001 ? (
            <Interactive.Div
              name="Objek"
              style={{
                position: "absolute",
                left: FRAME.x,
                top: FRAME.y,
                width: FRAME.w,
                height: FRAME.h,
                borderRadius: theme.shape.cardRadius,
                background: c.cardBg,
                boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}`,
                opacity: frameIn,
              }}
            />
          ) : null}
          {drawIn > 0.001 && warungOut < 0.999 ? (
            <Figure
              name="warung"
              cx={WARUNG.cx}
              floor={FLOOR}
              h={WARUNG.h}
              style={{
                opacity: drawIn * (1 - warungOut),
                transform: `translateY(${((1 - drawIn) * 18).toFixed(1)}px)`,
              }}
            />
          ) : null}
          {drawIn > 0.001 && toHead < 0.999 ? (
            <Figure
              name="ibu-sari"
              cx={IBU.cx}
              floor={FLOOR}
              h={IBU.h}
              style={{
                opacity: drawIn * (1 - toHead),
                transform: `translateY(${((1 - drawIn) * 18).toFixed(1)}px)`,
              }}
            />
          ) : null}
          {ledgerIn > 0.001 && cardOut < 0.999 ? (
            <Interactive.Div
              name="Buku kas"
              style={{
                position: "absolute",
                left: LEDGER.x,
                top: LEDGER.y,
                width: LEDGER.w,
                height: LEDGER.h,
                opacity: ledgerIn * (1 - cardOut),
                transform: `scale(${(1 - 0.04 * (1 - ledgerIn)).toFixed(4)})`,
              }}
            >
              <Card x={0} y={0} w={LEDGER.w} h={LEDGER.h}>
                {/* its first line is drawn on its own below, so it can stay when the card goes */}
                <LedgerCard
                  title="Buku kas"
                  s={k}
                  rows={BOOK_ROWS}
                  show={[0, rowIn[1], rowIn[2]]}
                />
              </Card>
            </Interactive.Div>
          ) : null}
          {/* "Laba bersih 20 juta/thn": in the card, then over the warung, then grown into the first column on two lines */}
          {rowIn[0] > 0.001
            ? (() => {
                const bw = mix(ROW1.w, COL.w, grow);
                const bh = mix(ROW1.h, COL.h, grow);
                const lab = {
                  x: mix(ROW_TEXT.pad + ROW_TEXT.label / 2, bw / 2, grow),
                  y: mix(bh / 2, COL.labelY, grow),
                  s: mix(ROW_TEXT.size / COL.labelSize, 1, grow),
                };
                const val = {
                  x: mix(bw - ROW_TEXT.pad - ROW_TEXT.value / 2, bw / 2, grow),
                  y: mix(bh / 2, COL.valueY, grow),
                  s: mix(ROW_TEXT.size / COL.valueSize, 1, grow),
                };
                const text = (
                  x: number,
                  y: number,
                  s: number,
                ): React.CSSProperties => ({
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: `translate(-50%, -50%) scale(${s.toFixed(4)})`,
                  whiteSpace: "nowrap",
                });
                return (
                  <Interactive.Div
                    name="Objek"
                    style={{
                      position: "absolute",
                      left: mix(
                        mix(ROW1.x, ROW1_UP.cx - ROW1.w / 2, upX),
                        COL_X[0],
                        grow,
                      ),
                      top: mix(
                        mix(ROW1.y, ROW1_UP.cy - ROW1.h / 2, upY),
                        COL.y,
                        grow,
                      ),
                      width: bw,
                      height: bh,
                      opacity: rowIn[0] * ledgerIn,
                      transform: `translateY(${((1 - rowIn[0]) * 10 * k).toFixed(1)}px)`,
                      borderRadius: mix(22 * k, 24, grow),
                      background: c.cardBg,
                      boxShadow: `inset 0 0 0 ${mix(2 * k, 2, grow).toFixed(2)}px ${theme.color.skeleton}`,
                    }}
                  >
                    <div
                      style={{
                        ...text(lab.x, lab.y, lab.s),
                        ...typeStyle("label"),
                        fontSize: COL.labelSize,
                        fontWeight: 600,
                        color: c.ink,
                      }}
                    >
                      {BOOK_ROWS[0].label}
                    </div>
                    {/* the value: the line's grey medium figure, cross-faded into the column's indigo bold one as it grows */}
                    {grow < 0.999 ? (
                      <div
                        style={{
                          ...text(val.x, val.y, val.s),
                          ...typeStyle("label"),
                          fontSize: COL.valueSize,
                          fontWeight: 500,
                          color: c.slate,
                          fontVariantNumeric: "tabular-nums",
                          opacity: 1 - grow,
                        }}
                      >
                        {BOOK_ROWS[0].value}
                      </div>
                    ) : null}
                    {grow > 0.001 ? (
                      <div
                        style={{
                          ...text(val.x, val.y, val.s),
                          ...typeStyle("title"),
                          fontSize: COL.valueSize,
                          fontWeight: 700,
                          color: c.indigo,
                          opacity: grow,
                        }}
                      >
                        {BOOK_ROWS[0].value}
                      </div>
                    ) : null}
                    {coinsIn > 0.001 ? (
                      <Interactive.Div
                        name="Objek"
                        style={{
                          position: "absolute",
                          left: COL.w / 2 - COINS.d / 2,
                          top: COL.midY - COINS.d / 2,
                          width: COINS.d,
                          height: COINS.d,
                          borderRadius: 999,
                          background: theme.color.neutralDisc,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: coinsIn,
                          transform: `scale(${(0.8 + 0.2 * coinsIn).toFixed(3)})`,
                        }}
                      >
                        <Glyph
                          icon="coins"
                          size={COINS.glyph}
                          tone={c.indigo}
                        />
                      </Interactive.Div>
                    ) : null}
                  </Interactive.Div>
                );
              })()
            : null}
          {/* column 2 — time; column 3 — confidence */}
          {COLS.map((q, i) => {
            const p = colIn[i];
            if (p <= 0.001) return null;
            const fill = colFill[i];
            return (
              <ColBox
                key={q.label}
                x={COL_X[i + 1]}
                y={COL.y + (1 - p) * 16}
                label={q.label}
                value={q.value}
                style={{ opacity: p }}
              >
                <svg
                  width={COL.w}
                  height={COL.h}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    overflow: "visible",
                  }}
                >
                  {i === 0 ? (
                    Array.from({ length: YEARS10.n }, (_, yr) => {
                      const x =
                        COL.w / 2 -
                        (YEARS10.n * YEARS10.w +
                          (YEARS10.n - 1) * YEARS10.gap) /
                          2 +
                        yr * (YEARS10.w + YEARS10.gap);
                      return (
                        <rect
                          key={yr}
                          x={x}
                          y={COL.midY - YEARS10.h / 2}
                          width={YEARS10.w}
                          height={YEARS10.h}
                          rx={7}
                          fill={
                            fill * YEARS10.n > yr + 0.5
                              ? c.indigo
                              : theme.color.skeleton
                          }
                        />
                      );
                    })
                  ) : (
                    <g>
                      <path
                        d={arc(COL.w / 2, COL.midY + METER.r / 2, METER.r, 1)}
                        fill="none"
                        stroke={theme.color.skeleton}
                        strokeWidth={METER.stroke}
                        strokeLinecap="round"
                      />
                      {fill > 0.001 ? (
                        <path
                          d={arc(
                            COL.w / 2,
                            COL.midY + METER.r / 2,
                            METER.r,
                            METER.level * fill,
                          )}
                          fill="none"
                          stroke={c.indigo}
                          strokeWidth={METER.stroke}
                          strokeLinecap="round"
                        />
                      ) : null}
                    </g>
                  )}
                </svg>
              </ColBox>
            );
          })}
          {/* the names, plain black text under each (Simon 17 Nov), going up with the heads */}
          {PEOPLE.map((p, i) => {
            const on = bodyOn[i];
            if (on <= 0.001) return null;
            const hd = headOf(p);
            return (
              <div
                key={p.name}
                style={{
                  position: "absolute",
                  left: mix(p.cx, hd.cx, headUp),
                  top: mix(
                    FLOOR + NAME.gap,
                    ROW1_UP.cy + ICON_H / 2 + 10,
                    headUp,
                  ),
                  transform: `translate(-50%, ${((1 - on) * 18).toFixed(1)}px)`,
                  opacity: on,
                  ...typeStyle("label"),
                  fontSize: NAME.size,
                  fontWeight: 500,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {p.name}
              </div>
            );
          })}
          {askIn > 0.001 && lineOut < 0.999 ? (
            <Interactive.Div
              name="Objek"
              style={{
                position: "absolute",
                left: FRAME.x + FRAME.w / 2,
                top: ASK_LINE.cy,
                transform: `translate(-50%, calc(-50% + ${((1 - askIn) * 12).toFixed(1)}px))`,
                opacity: askIn * (1 - lineOut),
                ...typeStyle("title"),
                fontSize: ASK_LINE.size,
                fontWeight: 700,
                lineHeight: 1.2,
                color: c.indigo,
                whiteSpace: "nowrap",
              }}
            >
              {ASK_LINE.text}
            </Interactive.Div>
          ) : null}
          {kamuIn > 0.001 && toHead < 0.999 ? (
            <Pic
              src={staticFile(KAMU_FULL.src)}
              style={{
                position: "absolute",
                left: KAMU.cx - KAMU_W / 2,
                top: FLOOR - KAMU.h,
                width: KAMU_W,
                height: KAMU.h,
                opacity: kamuIn * (1 - toHead),
                transform: `translateY(${((1 - kamuIn) * 18).toFixed(1)}px)`,
              }}
            />
          ) : null}
          {/* their heads: cross-faded in where they stand, then up beside the Laba bersih line */}
          {toHead > 0.001
            ? PEOPLE.map((p) => {
                const hd = headOf(p);
                return (
                  <div
                    key={p.name}
                    style={{
                      position: "absolute",
                      left: hd.x,
                      top: hd.y,
                      width: hd.w,
                      height: hd.h,
                      overflow: "hidden",
                      opacity: toHead,
                      transformOrigin: "50% 50%",
                      transform: `translateY(${(hd.dy * headUp).toFixed(1)}px) scale(${mix(1, hd.scale, headUp).toFixed(4)})`,
                    }}
                  >
                    <Pic
                      src={staticFile(p.src)}
                      style={{
                        position: "absolute",
                        left: -p.crop.x0 * hd.k,
                        top: -p.crop.y0 * hd.k,
                        width: p.img.w * hd.k,
                        height: p.img.h * hd.k,
                      }}
                    />
                  </div>
                );
              })
            : null}

          {/* the price as a multiple of profit — v3's card, the part Simon picked */}
          {priceIn > 0.001 && priceOut < 0.999 ? (
            <Card
              x={PRICE.x}
              y={PRICE.y + (1 - priceIn) * 16}
              w={PRICE.w}
              h={PRICE.h}
              style={{ opacity: priceIn * (1 - priceOut) }}
            >
              <Interactive.Div
                name="Harga beli = laba × kelipata"
                style={{
                  position: "absolute",
                  left: SUM.x,
                  top: SUM.y,
                  transform: "translateY(-50%)",
                  ...typeStyle("title"),
                  fontSize: SUM.size,
                  fontWeight: 600,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                Harga beli = laba × kelipatan
              </Interactive.Div>
              {readoutIn > 0.001 ? (
                <Interactive.Div
                  name="Rp"
                  style={{
                    position: "absolute",
                    right: PRICE.w - READOUT.right,
                    top: READOUT.y,
                    transform: "translateY(-50%)",
                    opacity: readoutIn,
                    ...typeStyle("title"),
                    fontSize: READOUT.size,
                    fontWeight: 600,
                    color: c.indigo,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <span style={{ opacity: 1 - band }}>
                    Rp{Math.round(times) * 20} juta
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      opacity: band,
                    }}
                  >
                    Rp160–240 juta
                  </span>
                </Interactive.Div>
              ) : null}
              <svg
                width={PRICE.w}
                height={PRICE.h}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  overflow: "visible",
                }}
              >
                {band > 0.001 ? (
                  <rect
                    x={mix(xOf(10), xOf(BAND.lo), band) - BAND.h / 2}
                    y={SCALE.y - BAND.h / 2}
                    width={mix(0, xOf(BAND.hi) - xOf(BAND.lo), band) + BAND.h}
                    height={BAND.h}
                    rx={BAND.h / 2}
                    fill={theme.color.indigoWashSolid}
                    stroke={c.indigo}
                    strokeWidth={2.5}
                  />
                ) : null}
                <line
                  x1={SCALE.x0}
                  y1={SCALE.y}
                  x2={mix(SCALE.x0, SCALE.x1, scaleDraw)}
                  y2={SCALE.y}
                  stroke={c.ink}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                {knobOn > 0.001 ? (
                  <circle
                    cx={xOf(times)}
                    cy={SCALE.y}
                    r={SCALE.knob * (0.6 + 0.4 * knobOn)}
                    fill={c.cardBg}
                    stroke={c.indigo}
                    strokeWidth={5}
                    opacity={knobOn}
                  />
                ) : null}
                {YEARS.map((yr) => {
                  const appear = ease(
                    f,
                    oneAt + m.sec(0.6 * ((yr - 1) / (MULT.hi - 1))),
                    m.pop,
                  );
                  return appear > 0.001 ? (
                    <rect
                      key={yr}
                      x={xOf(yr) - YEAR_BLOCK.w / 2}
                      y={YEAR_BLOCK.base - YEAR_BLOCK.h}
                      width={YEAR_BLOCK.w}
                      height={YEAR_BLOCK.h}
                      rx={6}
                      fill={blockTone(yr)}
                      opacity={appear}
                    />
                  ) : null;
                })}
              </svg>
              {(
                [
                  { t: "1x", x: SCALE.x0 - 32, align: "right" },
                  { t: "30x", x: SCALE.x1 + 32, align: "left" },
                ] as const
              ).map((l) => (
                <div
                  key={l.t}
                  style={{
                    position: "absolute",
                    top: SCALE.y,
                    left: l.align === "left" ? l.x : undefined,
                    right: l.align === "right" ? PRICE.w - l.x : undefined,
                    transform: "translateY(-50%)",
                    opacity: ease(
                      f,
                      oneAt + m.sec(l.t === "1x" ? 0 : 0.5),
                      m.reveal,
                    ),
                    ...typeStyle("label"),
                    fontSize: 30,
                    fontWeight: 600,
                    color: c.ink,
                  }}
                >
                  {l.t}
                </div>
              ))}
              <Interactive.Div
                name="8–12x"
                style={{
                  position: "absolute",
                  left: xOf(10),
                  top: BAND.labelY,
                  transform: "translate(-50%, -50%)",
                  opacity: band,
                  ...typeStyle("label"),
                  fontSize: 30,
                  fontWeight: 600,
                  color: c.indigo,
                }}
              >
                8–12x
              </Interactive.Div>
            </Card>
          ) : null}

          {under.map((u) => {
            const inP = ease(f, u.at, m.reveal);
            const p = inP * (1 - ease(f, u.out, m.fade));
            return p > 0.001 ? (
              <div
                key={u.text}
                style={{
                  position: "absolute",
                  left: FRAME.x + FRAME.w / 2,
                  top: TOO_CHEAP.cy,
                  transform: `translate(-50%, calc(-50% + ${((1 - inP) * 12).toFixed(1)}px))`,
                  opacity: p,
                  ...typeStyle("title"),
                  fontSize: TOO_CHEAP.size,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: c.indigo,
                  whiteSpace: "nowrap",
                }}
              >
                {u.text}
              </div>
            ) : null;
          })}
        </div>
      ) : null}

      {/* after the cut: Discounting; the three who count this way; Tuntun's card */}
      {f >= cut.at ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...(f < cut.at + cut.over / 2 ? cutInStyle(f, cut) : {}),
          }}
        >
          {[DISC.text, DISC.after].map((t, k) => (
            <div
              key={t}
              style={{
                position: "absolute",
                left: MID_X,
                top: DISC.cy,
                transform: "translate(-50%, -50%)",
                opacity: k === 0 ? 1 - rfvIn : rfvIn,
                ...typeStyle("title"),
                fontSize: DISC.size,
                fontWeight: 700,
                lineHeight: 1.1,
                color: c.indigo,
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </div>
          ))}
          {FACES.map((fc, i) => {
            /** the rise is the entrance only; the cross-fade to Tuntun's mark is a fade */
            const rise = i < 2 ? ease(f, W(fc.at), m.reveal) : toMark;
            const p = i < 2 ? rise * (1 - pairOut) : toMark;
            if (p <= 0.001) return null;
            const left = FACE.cxs[i] - FACE.d / 2;
            const tile: React.CSSProperties = {
              position: "absolute",
              left,
              top: FACE.top,
              width: FACE.d,
              height: FACE_H,
              borderRadius: FACE.d * 0.13,
              background: c.cardBg,
              boxShadow: shadow.soft,
              overflow: "hidden",
            };
            const sk =
              (SARI_CROP.fill * FACE.d) / (SARI_CROP.x1 - SARI_CROP.x0);
            const ibu = ART["ibu-sari"];
            return (
              <div
                key={fc.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: p,
                  transform: `translateY(${((1 - rise) * 14).toFixed(1)}px)`,
                }}
              >
                {i === 0 ? (
                  <PhotoTile
                    name="buffett"
                    d={FACE.d}
                    style={{ left, top: FACE.top }}
                  />
                ) : null}
                {i === 1 ? (
                  <div style={tile}>
                    <Pic
                      src={staticFile("art/vi01/ibu-sari.png")}
                      style={{
                        position: "absolute",
                        left:
                          FACE.d / 2 - ((SARI_CROP.x0 + SARI_CROP.x1) / 2) * sk,
                        top: FACE_H - SARI_CROP.y1 * sk,
                        width: ibu.w * sk,
                        height: ibu.h * sk,
                      }}
                    />
                  </div>
                ) : null}
                {i === 2 ? (
                  <div style={tile}>
                    <Pic
                      src={staticFile(MARK.src)}
                      style={{
                        position: "absolute",
                        left: (FACE.d * (1 - MARK.fill)) / 2,
                        top: (FACE_H - FACE.d * MARK.fill) / 2,
                        width: FACE.d * MARK.fill,
                        height: FACE.d * MARK.fill,
                      }}
                    />
                  </div>
                ) : null}
                <div
                  style={{
                    position: "absolute",
                    left: FACE.cxs[i],
                    top: FACE.top + FACE_H + FACE.nameGap,
                    transform: "translateX(-50%)",
                    ...typeStyle("label"),
                    fontSize: FACE.nameSize,
                    fontWeight: 600,
                    color: c.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  {fc.name}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* the rest of the scene — Simon's */}
    </Stage>
  );
};
