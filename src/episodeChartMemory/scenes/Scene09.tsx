/**
 * SC09 — Probability, Not Prediction (from 6413, dur 754) — INDEPENDENT.
 * The chart drops to texture; the statement resolves in two lines, then the
 * three things a chart can actually show, then the honest limit.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart } from "../components/CandlestickChart";
import { DashedFrame, dashOpenAt } from "../components/DashedFrame";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeOut, textReveal, type Box } from "../helpers";
import { bmriDaily, WIN } from "../data/bmri";
import { usePalette } from "../palette";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const CHART: Box = { x: 200, y: 240, w: 1520, h: 560 };
/*
 * ⚠ NO HANDOFF FROM SC08 ANY MORE. This scene used to open on SC08's framing
 * and ease the chart out into its own — built for a direct SC08 → SC09 cut. A
 * roadmap stop now stands between them, so all that was left was the chart
 * growing for no reason. Simon, at 6415: "chartnya jangan membesar, langsung
 * SUDAH besar aja." The chart is in its own box and window from frame 0; only
 * its settling down to texture still eases.
 */
const TEXTURE = 0.15;
// the chips are read off the chart, so it brightens a step behind them
const TEXTURE_LIFT = 1.9;
// The statement lines and the three chips are one block, lifted to just under
// the safe-top margin and then dropped 30px. GROUP_TOP is that block's topmost
// pixel as laid out below: "Probabilitas." centre-y 392 minus half its 96px line.
const GROUP_TOP = 344;
const BLOCK_DROP = 30;
// "Informasi" / "Harapan · Tebakan" sit BELOW the chart, so they are not part
// of that block — chart bottom is CHART.y + CHART.h = 800.
const INFO_TOP = 826;
/**
 * The Technical Analysis box: top centre, and BELOW the 150px logo zone — at
 * y 84 its right corner sat against the Tuntun mark. Sized to its longer
 * second line with ~44px either side, and short enough to leave a clear gap
 * above the chip row. Stated in screen coordinates; it sits inside the lifted
 * block, so GROUP_DY is taken back off where it is drawn.
 */
const TA_BOX = { y: 160, w: 1060, h: 152, titleSize: 52 };
const HOPE_TOP = 890;
const T = {
  /**
   * ⚠ GLOBAL 6450 — ONE TEXT BOX REPLACES "Probabilitas" / "Bukan prediksi".
   * Simon: "muncul text box di atas tengah, isinya 'Technical Analysis' lalu
   * di text-line kedua 'alat bantu baca probabilitas, bukan ramalan masa
   * depan'." The film's marquee, top centre; the words rise in once it opens.
   */
  prob: 37,
  future: 419, // "tidak menjamin apa yang terjadi berikutnya"
  dim: 503, // "tidak ada alat yang bisa"
  info: 623, // "keputusan dengan informasi"
  hope: 673, // "bukan sekadar harapan atau tebakan"
  // Everything but the chart clears before the boundary, so that at global
  // 5945 only the texture series is left — that is what SC10 picks up.
  clear: 700,
  clearDur: 40, // done by local 740 (global 5932)
};
// One frame per phrase: "apa yang sudah terjadi" / "pola yang sering
// berulang" / "posisi pembeli serta penjual saat ini".
const CHIP_AT = [225, 286, 330];
const CHIPS = ["yang sudah terjadi", "pola berulang", "posisi saat ini"];
/** 50px lower than it was — Simon: "3 label itu geser ke bawah 50 px". */
const CHIP_Y = 686;
// The three labels are different lengths, so fixed centres give uneven gaps.
// These are their MEASURED rendered widths at 36px/600; the row is laid out
// from them so the gap between chips is exactly CHIP_GAP. Re-measure if a label
// or the chip type changes.
const CHIP_W = [358, 281, 270];
const CHIP_GAP = 20;
// ═══════════════════════════════════════════════════════════════════════════

/** Centre-x per chip, packed CHIP_GAP apart and centred on the canvas. */
const chipXs = (() => {
  const total = CHIP_W.reduce((a, b) => a + b, 0) + CHIP_GAP * (CHIP_W.length - 1);
  // rounded so every chip edge lands on a whole pixel — a fractional origin
  // makes the rendered gaps read 19/21 instead of 20/20
  let left = Math.round((theme.canvas.width - total) / 2);
  return CHIP_W.map((w) => {
    const cx = left + w / 2;
    left += w + CHIP_GAP;
    return cx;
  });
})();

const GROUP_DY = theme.layout.safeTop - GROUP_TOP + BLOCK_DROP;

/**
 * What this scene leaves on screen at its last frame. SC10 opens by drawing
 * exactly this, then eases into its own framing — keep the two in sync by
 * importing from here rather than copying the numbers.
 */
export const SC09_EXIT = { box: CHART, win: WIN.sc01, dim: TEXTURE * TEXTURE_LIFT };

export const Scene09 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  /* ⚠ ALREADY TEXTURE ON FRAME 0 — Simon: "Setelah transisi keempat,
     candlestick chartnya langsung transparan aja." No settling from full. */
  const box: Box = CHART;
  const win: [number, number] = WIN.sc01;
  const texture = TEXTURE;
  const dim = f >= T.dim ? progress(f, T.dim, 30) : 0;
  const future = f >= T.future ? progress(f, T.future, 34) : 0;
  const taText = textReveal(f, dashOpenAt(T.prob), 26, 26);
  const info = textReveal(f, T.info);
  const hope = textReveal(f, T.hope);
  const texturePlus = texture * (1 + (TEXTURE_LIFT - 1) * (f >= CHIP_AT[2] ? progress(f, CHIP_AT[2], 26) : 0));
  const clearOp = f >= T.clear ? fadeOut(f, T.clear, T.clearDur) : 1;


  return (
    <SafeArea>
      <CandlestickChart data={bmriDaily} window={win} box={box} showAxes={false} dimOpacity={texturePlus} />

      {/* what comes next is left blank — no projected path, ever */}
      {future > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: box.x + box.w * 0.82,
            top: box.y,
            width: box.w * 0.18 + 40,
            height: box.h,
            background: pal.bg,
            opacity: 0.92 * future * clearOp,
          }}
        />
      )}

      {/* The statement and the chips, as one block near the top.
          "Probabilitas." now leads and "Bukan Prediksi." sits under it. */}
      <div style={{ transform: `translateY(${GROUP_DY}px)`, opacity: clearOp }}>
      <DashedFrame x={(theme.canvas.width - TA_BOX.w) / 2} y={TA_BOX.y - GROUP_DY} w={TA_BOX.w} h={TA_BOX.h} at={T.prob}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontFamily: theme.type.family,
            color: pal.ink,
            whiteSpace: "nowrap",
            opacity: taText.opacity,
            transform: `translateY(${taText.y}px)`,
          }}
        >
          <div style={{ fontSize: TA_BOX.titleSize, fontWeight: 800 }}>Technical Analysis</div>
          <div style={{ fontSize: theme.type.chip.size, fontWeight: 500 }}>alat bantu baca probabilitas, bukan ramalan masa depan</div>
        </div>
      </DashedFrame>

      {CHIPS.map((c, i) => (
        /* ⚠ THEY STAY WHERE THEY LAND — Simon: "ga usa geser naik". */
        <Chip key={c} label={c} x={chipXs[i]} y={CHIP_Y} variant="indigo" anchor="center" startFrame={CHIP_AT[i]} opacity={1 - 0.45 * dim} />
      ))}

      {/* ⚠ NO GREY RULE UNDER THE CHIPS — Simon: "hapus juga garis horizontal
          abu abu nya". */}
      </div>

      {/* what the chart actually buys you, set against what it replaces —
          below the chart, not part of the block above */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: INFO_TOP,
          width: theme.canvas.width,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: pal.indigo,
          opacity: info.opacity * clearOp,
          transform: `translateY(${info.y}px)`,
        }}
      >
        Informasi
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: HOPE_TOP,
          width: theme.canvas.width,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.type.label.size,
          fontWeight: theme.type.label.weight,
          color: pal.slate,
          opacity: hope.opacity * 0.75 * clearOp,
          transform: `translateY(${hope.y}px)`,
          textDecoration: "line-through",
          textDecorationThickness: `${theme.stroke.hair}px`,
        }}
      >
        Harapan · Tebakan
      </div>
    </SafeArea>
  );
};
