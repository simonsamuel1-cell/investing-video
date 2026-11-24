/**
 * VI02 SC01's opening: what a stock is before you look behind it, a code and a price that won't sit still (Simon, 6 Nov). The
 * walk is made up: it starts from ICBP's last level the press reported (Rp6.950, 29 Jul 2026) and moves in the exchange's Rp25 steps.
 */
import { Img, staticFile } from "remotion";
import { seeded, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { Card } from "./kit";

const TICKER = { w: 980, h: 250, pad: 60, logo: 130, code: 64, price: 92, change: 36, every: 0.2, base: 6950, step: 25 };
const STEPS = 200;

const rand = seeded(7);
const WALK = Array.from({ length: STEPS }).reduce<number[]>((path) => {
  const move = Math.round((rand() - 0.5) * 4) || 1;
  return [...path, path[path.length - 1] + move * TICKER.step];
}, [TICKER.base]);

const rupiah = (n: number) => n.toLocaleString("id-ID");

/** The card, its price moving from `from`. */
export const PriceTicker = ({ f, from, x }: { f: number; from: number; x: number }) => {
  const c = usePalette();
  const m = useMotion();
  const k = Math.min(STEPS, Math.max(0, Math.floor((f - from) / m.sec(TICKER.every))));
  const price = WALK[k];
  const gain = price - TICKER.base;
  const tone = gain < 0 ? theme.color.crossRed : theme.color.ok;
  const percent = ((Math.abs(gain) / TICKER.base) * 100).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <Card x={x - TICKER.w / 2} y={(theme.canvas.height - TICKER.h) / 2} w={TICKER.w} h={TICKER.h}>
      <div style={{ position: "absolute", inset: 0, padding: `0 ${TICKER.pad}px`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Img src={staticFile("icons/vi02/ICBP.png")} style={{ width: TICKER.logo, height: TICKER.logo, borderRadius: 999 }} />
          <div style={{ ...typeStyle("title"), fontSize: TICKER.code, fontWeight: 600, color: c.ink }}>ICBP</div>
        </div>
        <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          <div style={{ ...typeStyle("title"), fontSize: TICKER.price, fontWeight: 600, lineHeight: 1.1, color: c.ink }}>{rupiah(price)}</div>
          <div style={{ ...typeStyle("label"), fontSize: TICKER.change, fontWeight: 600, color: tone }}>{gain < 0 ? "−" : "+"}{rupiah(Math.abs(gain))} ({percent}%)</div>
        </div>
      </div>
    </Card>
  );
};
