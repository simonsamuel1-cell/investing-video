/**
 * VI01 · SC05 — "Tiga Pintu yang Harus Dilewati", from Simon's VISUAL / TEKS LAYAR notes and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI01-SC05.png.
 *
 *  A  three closed doors, numbered.
 *  1  "Percaya": the door opens and steps left; 15% a year for 20 years climbs to ≈16× (1.15^20 = 16.4); then Ibu Sari's
 *     warung — one drawn, two more still faint: she started with one.
 *  2  "Independent thinking": a crowd of grey people, the cash book beside it — Ledger > Crowd; Ibu Sari with her book while
 *     the Rp50 juta offer goes pale.
 *  3  "Pahami perusahaan": many companies, then twenty; 2 jam / minggu → 10 perusahaan / tahun.
 *  E  the three doors open in a row, "Habit, not talent.", and the investors of the timeline under it.
 */
import { staticFile, useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { ART, Bubble, Card, Figure, Glyph, LedgerCard, Line, Pic, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const DOORS = [
  { label: "Percaya", at: "Pintu pertama" },
  { label: "Independent thinking", at: "Pintu kedua" },
  { label: "Pahami perusahaan", at: "Pintu ketiga" },
] as const;
const DOOR = { w: 250, h: 420, gap: 150, y: 300 };
const rowX = (i: number) => CX - DOOR.w / 2 + (i - 1) * (DOOR.w + DOOR.gap);
const SIDE = { x: 170, y: 250, k: 0.9 };
const END = { y: 170, k: 0.72 };
const PANE = { x: 700, y: 210, w: 1080, h: 640 };

const Door = ({ n, open, label, labelP = 1 }: { n: number; open: number; label: string; labelP?: number }) => {
  const c = usePalette();
  const inset = 22;
  return (
    <div style={{ position: "relative", width: DOOR.w, height: DOOR.h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "120px 120px 10px 10px", background: open > 0.001 ? theme.color.indigoWashSolid : c.cardBg, border: `5px solid ${c.ink}`, boxSizing: "border-box", overflow: "hidden" }}>
        {open > 0.001 ? <div style={{ position: "absolute", left: "50%", top: "45%", width: 200, height: 200, transform: "translate(-50%, -50%)", borderRadius: 999, background: c.cardBg, opacity: open }} /> : null}
        <div style={{ position: "absolute", left: inset - 5, top: inset - 5, right: inset - 5, bottom: -5, borderRadius: "100px 100px 0 0", background: c.cardBg, border: `4px solid ${c.ink}`, boxSizing: "border-box", transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${(-78 * open).toFixed(2)}deg)` }}>
          <div style={{ position: "absolute", right: 24, top: "52%", width: 22, height: 22, borderRadius: 999, background: c.ink }} />
          <div style={{ position: "absolute", left: 26, right: 56, top: 70, height: 120, borderRadius: "70px 70px 10px 10px", border: `3px solid ${theme.color.skeleton}` }} />
          <div style={{ position: "absolute", left: 26, right: 56, bottom: 40, height: 110, borderRadius: 10, border: `3px solid ${theme.color.skeleton}` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: -84, transform: "translateX(-50%)", width: 64, height: 64, borderRadius: 999, background: open > 0.5 ? c.indigo : c.cardBg, boxShadow: `inset 0 0 0 3px ${c.indigo}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: open > 0.5 ? c.cardBg : c.indigo }}>{n}</div>
      {labelP > 0.001 ? <div style={{ position: "absolute", left: "50%", top: DOOR.h + 28, transform: "translateX(-50%)", opacity: labelP, ...typeStyle("label"), fontSize: 40, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{label}</div> : null}
    </div>
  );
};

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(5, BLOCK.SC05);

  const at = DOORS.map((d) => W(d.at));
  const endAt = W("Tiga pintu ini");
  const doorIn = DOORS.map((_, i) => ease(f, W("Tapi ada tiga") + i * 10, m.reveal));
  const active = f < at[0] ? -1 : f < at[1] ? 0 : f < at[2] ? 1 : f < endAt ? 2 : 3;
  const toEnd = ease(f, endAt, m.move);

  // 1
  const climb = ease(f, W("Return"), W("lipat") - W("Return") + m.sec(0.4));
  const chartP = ease(f, W("Tapi pertumbuhan"), m.reveal) * (1 - ease(f, W("Ibu Sari") - m.fade, m.fade));
  const shops = ease(f, W("Ibu Sari"), m.reveal) * (1 - ease(f, at[1] - m.fade, m.fade));
  const one = ease(f, W("Dia mulai"), m.pop);
  // 2
  const crowd = ease(f, W("Kadang"), m.reveal);
  const ledger = ease(f, W("buku kas"), m.reveal);
  const offer = ease(f, W("Ketika orang"), m.reveal);
  const pale = ease(f, W("bukan ekspresi"), m.sec(0.6));
  // 3
  const many = ease(f, W("Bukan semua"), m.reveal);
  const few = ease(f, W("Cukup beberapa"), m.move);
  const twenty = ease(f, W("dua puluh"), m.reveal);
  const plan = ease(f, W("Kalau kamu"), m.reveal);
  const ten = ease(f, W("sepuluh"), m.sec(1));
  const habit = ease(f, W("kebiasaan"), m.reveal);
  const faces = ease(f, W("Semua investor"), m.reveal);

  const paneP = (i: number) => (active === i ? ease(f, at[i] + m.move / 2, m.reveal) : active > i ? 1 - ease(f, (i < 2 ? at[i + 1] : endAt) - m.fade, m.fade) : 0);

  return (
    <>
      {/* the doors */}
      {DOORS.map((d, i) => {
        if (doorIn[i] <= 0.001) return null;
        const open = ease(f, at[i], m.move);
        const endX = CX - (DOOR.w * END.k) / 2 + (i - 1) * 420;
        const mine = ease(f, at[i], m.move);
        const side = { x: mix(rowX(i), SIDE.x, mine), y: mix(DOOR.y, SIDE.y, mine), k: mix(1, SIDE.k, mine) };
        let op = 0;
        let pos = { x: rowX(i), y: DOOR.y, k: 1 };
        if (active === -1) op = doorIn[i];
        else if (active === 3) {
          // the last door walks back into the row; the other two come back beside it
          op = i === 2 ? 1 : toEnd;
          pos = i === 2 ? { x: mix(SIDE.x, endX, toEnd), y: mix(SIDE.y, END.y, toEnd), k: mix(SIDE.k, END.k, toEnd) } : { x: endX, y: END.y, k: END.k };
        } else if (active === i) {
          op = 1;
          pos = side;
        } else if (active === 0) op = 1 - ease(f, at[0], m.fade);
        else if (active === i + 1) {
          op = 1 - ease(f, at[i + 1], m.fade);
          pos = { x: SIDE.x, y: SIDE.y, k: SIDE.k };
        }
        const { x, y, k } = pos;
        return op > 0.001 ? (
          <div key={d.label} style={{ position: "absolute", left: x, top: y, opacity: op, transform: `scale(${k.toFixed(4)})`, transformOrigin: "0 0" }}>
            <Door n={i + 1} open={open} label={d.label} labelP={open} />
          </div>
        ) : null;
      })}

      {/* 1 — compounding, then the warung */}
      {chartP > 0.001 ? (
        <div style={{ position: "absolute", left: PANE.x, top: PANE.y, width: PANE.w, height: PANE.h, opacity: chartP * paneP(0) }}>
          <Card x={0} y={0} w={PANE.w} h={PANE.h}>
            {Array.from({ length: 20 }, (_, t) => {
              const v = Math.pow(1.15, t + 1);
              const p = Math.min(1, Math.max(0, climb * 20 - t));
              const h = (v / 16.4) * 380 * p;
              return <div key={t} style={{ position: "absolute", left: 90 + t * 46, top: 500 - h, width: 32, height: h, borderRadius: "8px 8px 0 0", background: t === 19 ? c.indigo : theme.color.hairlineBrandSolid }} />;
            })}
            <div style={{ position: "absolute", left: 90, top: 520, ...typeStyle("label"), fontSize: 30, fontWeight: 500, color: c.slate }}>Tahun 1</div>
            <div style={{ position: "absolute", left: 90 + 19 * 46 + 32, top: 520, transform: "translateX(-100%)", ...typeStyle("label"), fontSize: 30, fontWeight: 500, color: c.slate }}>Tahun 20</div>
            <div style={{ position: "absolute", left: 90, top: 60, ...typeStyle("title"), fontSize: 64, fontWeight: 600, color: c.ink, fontVariantNumeric: "tabular-nums" }}>
              15% × 20 tahun ≈ <span style={{ color: c.indigo }}>{Math.max(1, Math.round(Math.pow(1.15, 20 * climb)))}×</span>
            </div>
          </Card>
        </div>
      ) : null}
      {shops > 0.001
        ? [0, 1, 2].map((i) => (
            <Figure key={i} name="warung" cx={PANE.x + 200 + i * 340} floor={700} h={300} faint={i === 0 ? 1 - one : 1} style={{ opacity: shops * paneP(0) * (i === 0 ? 1 : 0.999) }} />
          ))
        : null}

      {/* 2 — the crowd and the book */}
      {crowd > 0.001 && paneP(1) > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: paneP(1) }}>
          {Array.from({ length: 12 }, (_, i) => {
            const p = ease(f, W("Kadang") + i * 3, m.pop) * (1 - offer);
            return p > 0.001 ? (
              <div key={i} style={{ position: "absolute", left: 760 + (i % 4) * 120, top: 300 + Math.floor(i / 4) * 130, opacity: p }}>
                <Glyph icon="user-circle" size={96} tone={theme.color.neutralDot} />
              </div>
            ) : null;
          })}
          {ledger > 0.001 ? (
            <div style={{ position: "absolute", left: mix(1330, 1260, offer), top: 300, width: 470, height: 360, opacity: ledger, transform: `translateY(${((1 - ledger) * 18).toFixed(1)}px)` }}>
              <Card x={0} y={0} w={470} h={360} style={{ boxShadow: shadow.glow }}>
                <LedgerCard title="Buku kas" s={0.66} />
              </Card>
            </div>
          ) : null}
          {ledger > 0.001 && offer < 0.5 ? <div style={{ position: "absolute", left: 1495, top: 700, transform: "translateX(-50%)", opacity: ledger * (1 - offer * 2), ...typeStyle("title"), fontSize: 48, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Ledger <span style={{ color: c.indigo }}>&gt;</span> Crowd</div> : null}
          {offer > 0.001 ? (
            <>
              <Figure name="ibu-sari" cx={1000} floor={860} h={480} style={{ opacity: offer }} />
              <div style={{ position: "absolute", left: 0, top: 0, opacity: offer, filter: pale > 0.001 ? `contrast(${(1 - 0.5 * pale).toFixed(3)}) brightness(${(1 + 0.4 * pale).toFixed(3)})` : undefined }}>
                <Bubble x={720} y={230} w={340} h={110}>
                  <div style={{ ...typeStyle("title"), fontSize: 50, fontWeight: 600, color: c.ink }}>Rp50 juta</div>
                </Bubble>
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {/* 3 — many companies, then twenty; then the plan */}
      {many > 0.001 && paneP(2) > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: paneP(2) }}>
          {Array.from({ length: 40 }, (_, i) => {
            const keep = i < 20;
            const p = ease(f, W("Bukan semua") + i, m.pop) * (keep ? 1 : 1 - few);
            const lit = keep ? twenty : 0;
            const col = i % 8;
            const row = Math.floor(i / 8);
            const k = mix(1, 0.62, plan);
            const x = mix(760 + col * 130, 760 + (i % 5) * 92, plan);
            const y = mix(250 + row * 120, 250 + Math.floor(i / 5) * 92, plan);
            const on = ten > (i / 10) && i < 10 && plan > 0.5;
            return p > 0.001 ? (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: 100, height: 100, transform: `scale(${k.toFixed(3)})`, transformOrigin: "0 0", borderRadius: 26, background: on ? c.indigo : lit > 0.5 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: shadow.soft, opacity: p, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph icon="storefront" size={52} tone={on ? c.cardBg : lit > 0.5 ? c.indigo : theme.color.neutralDot} />
              </div>
            ) : null;
          })}
          {twenty > 0.001 && plan < 0.999 ? <div style={{ position: "absolute", left: 1280, top: 800, transform: "translateX(-50%)", opacity: twenty * (1 - plan), ...typeStyle("title"), fontSize: 52, fontWeight: 600, color: c.indigo }}>≈ 20 bisnis</div> : null}
          {plan > 0.001 ? (
            <div style={{ position: "absolute", left: 1240, top: 300, opacity: plan, display: "flex", flexDirection: "column", gap: 40 }}>
              {[{ icon: "clock", text: "2 jam / minggu", p: plan }, { icon: "storefront", text: "10 perusahaan / tahun", p: ten }].map((r, i) => (
                <div key={r.text} style={{ display: "flex", alignItems: "center", gap: 26, opacity: r.p }}>
                  <div style={{ width: 110, height: 110, borderRadius: 999, background: i ? c.indigo : theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Glyph icon={r.icon} size={60} tone={i ? c.cardBg : c.indigo} />
                  </div>
                  <div style={{ ...typeStyle("title"), fontSize: 50, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{r.text}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* E — habit, and the investors who started with one */}
      {habit > 0.001 ? <div style={{ opacity: habit }}><Line x={0} y={700} w={theme.canvas.width} text="Habit, not talent." size={64} align="center" weight={500} mark="Habit" /></div> : null}
      {faces > 0.001
        ? (["graham", "buffett", "schloss", "munger"] as const).map((n, i) => {
            const p = ease(f, W("Semua investor") + i * 8, m.reveal);
            return <Pic key={n} src={staticFile(`art/vi01/${n}.png`)} style={{ position: "absolute", left: CX - 2 * 150 - 45 + i * 160, top: 780 + (1 - p) * 16, width: 130, height: (130 * ART[n].h) / ART[n].w, opacity: p }} />;
          })
        : null}
    </>
  );
};
