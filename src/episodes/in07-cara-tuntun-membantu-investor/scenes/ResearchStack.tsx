/**
 * IN07 · SC04, from "Riset Tuntun mencakup" to the end. (The isometric exploded stack this file is named after — Simon's
 * Pinterest reference of 26 Oct, docs/vi-style/storyboards/IN07-SC04-iso.jpg — is gone: its five slabs became real
 * screens in a folder on 9 Nov, scenes/ResearchFiles.tsx, and its pressed block went too.)
 *
 *  · Saham and Reksa dana: two small copies of the research folder beside the big one (Simon 9 Nov: "icon saham dan
 *    reksa dananya perlu diganti, karna ilustrasi sebelumnya uda diganti"), off to the left with it for the awards.
 *  · "Bukan berarti tim riset selalu benar." — the camera cuts from the awards to its line, alone and centred (Simon
 *    9 Nov: "remove 2 visual ini" — the folder and the block — "lalu textnya pindahin ke tengah, jangan terlalu
 *    kanan"); "tapi lebih teruji." under it on "Tapi mereka", and Waktu, Proses, Data under that, each on its word
 *    ("juga pindahin ke tengah aja, di bawah text 'Bukan berarti selalu benar, tapi lebih teruji'").
 *  · "Jadi keputusanmu punya dasar yang lebih lengkap daripada hanya satu voice note dari temanmu." — a new picture now
 *    the block is gone ("ganti visual deh, karna gambar pendukungnya kan uda ngga dipake"): the five research screens
 *    again, fanned out and named Riset, glowing on "lebih lengkap"; beside them one voice note, crossed on
 *    "temanmu.". (A balance was tried in this spot on 26 Oct and removed — "hapus timbangannya, malah jadi sampah".)
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { cutInStyle, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Card, Disc, Mark, VoiceBubble, ease, useWords } from "../components/kit";
import { MID_Y, MiniFolder, SLIDE, awardsCut } from "../components/Folder";
import { SHOTS } from "./ResearchFiles";

/**
 * The same research for Saham and Reksa dana: two small copies of the research folder, each with its icon, right of
 * the big one (centred on x 860). `y` is a folder's middle; the pair, from Saham's tab (`h`/2 above) to the foot of the
 * "Reksa dana" label, is centred on MID_Y, level with the big folder.
 */
const KINDS = [
  { text: "Saham", at: "saham", icon: "saham", y: MID_Y - 140 },
  { text: "Reksa dana", at: "reksa dana", icon: "reksa-dana", y: MID_Y + 90 },
] as const;
/** `h` is a mini folder's height, tab included. */
const MINI = { x: 1298, w: 170, h: 135, labelGap: 14 };

/** The two lines, centred, and Waktu, Proses, Data in a row under them — the group centred on MID_Y. */
const LINES = { size: 56, lead: 1.3, gap: 56 };
const LINES_H = 2 * LINES.size * LINES.lead;
const BASIS = [
  { text: "Waktu", at: "waktu,", icon: "time" },
  { text: "Proses", at: "proses,", icon: "flow" },
  { text: "Data", at: "data", icon: "database" },
] as const;
const POINT = { w: 270, h: 96, gap: 28 };
const LINES_TOP = MID_Y - (LINES_H + LINES.gap + POINT.h) / 2;
const POINT_Y = LINES_TOP + LINES_H + LINES.gap;

/**
 * "Jadi keputusanmu …": the five screens fanned out about their foot (each fitted inside `box`; 20 % bigger since
 * Simon's "agak diperbesar lagi 20%"), and one voice note beside them, the pair centred on the canvas, each named
 * under it.
 */
const FAN = { cx: 704, foot: MID_Y + 140, box: 288, step: 132, turn: 7, drop: 17 };
const VOICE = { cx: 1454, cy: MID_Y, scale: 1.4 };
const NAME_Y = MID_Y + 220;

export const ResearchStack = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(4, BLOCK.SC04);

  const sideAt = W("Jadi keputusanmu");
  /** Off to the left with the big folder on "melalui penghargaan", for the awards (components/Folder.tsx SLIDE); they stay gone. */
  const kindsAway = ease(f, W(SLIDE.at), m.move);
  const kindsP = KINDS.map((k) => ease(f, W(k.at) - m.sec(0.1), m.reveal) * (kindsAway >= 0.999 ? 0 : 1));
  /** "Bukan berarti selalu benar," is there when the camera cuts in from the awards, and comes in with it. */
  const cut = awardsCut(W);
  const cutIn = f >= cut.at && f < cut.at + cut.over / 2 ? cutInStyle(f, cut) : {};
  const linesOut = ease(f, sideAt, m.fade);
  const notP = (f >= cut.at ? 1 : 0) * (1 - linesOut);
  const testedP = ease(f, W("Tapi mereka") + m.sec(0.2), m.reveal) * (1 - linesOut);
  const fuller = ease(f, W("lebih lengkap"), m.reveal);
  const voiceP = ease(f, W("satu voice note") - m.sec(0.1), m.reveal);

  if (f < W(KINDS[0].at) - m.sec(0.2)) return null;

  return (
    <>
      {/* the same work, for Saham and Reksa dana: a small folder each, named under it */}
      {kindsAway < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(-SLIDE.by * kindsAway).toFixed(2)}px)` }}>
          {KINDS.map((k, i) => (
            <MiniFolder key={k.text} cx={MINI.x} cy={k.y} w={MINI.w} icon={k.icon} p={kindsP[i]} />
          ))}
          {KINDS.map((k, i) =>
            kindsP[i] > 0.001 ? (
              <div key={k.text} style={{ position: "absolute", left: MINI.x - 150, top: k.y + MINI.h / 2 + MINI.labelGap + (1 - kindsP[i]) * 20, width: 300, textAlign: "center", ...typeStyle("label"), fontSize: 30, color: c.ink, opacity: kindsP[i] }}>{k.text}</div>
            ) : null,
          )}
        </div>
      ) : null}

      {/* "Bukan berarti selalu benar," / "tapi lebih teruji." — centred; Waktu, Proses, Data under them */}
      {notP > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, ...cutIn }}>
          <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: LINES_TOP, textAlign: "center", ...typeStyle("title"), fontSize: LINES.size, fontWeight: 500, lineHeight: LINES.lead, whiteSpace: "nowrap" }}>
            <div style={{ color: c.ink, opacity: notP }}>Bukan berarti selalu benar,</div>
            <div style={{ color: c.indigo, opacity: testedP, transform: `translateY(${((1 - testedP) * 12).toFixed(2)}px)` }}>tapi lebih teruji.</div>
          </div>
          {BASIS.map((b, i) => {
            const p = ease(f, W(b.at) - m.sec(0.1), m.reveal) * (1 - linesOut);
            const x = theme.canvas.width / 2 - (3 * POINT.w + 2 * POINT.gap) / 2 + i * (POINT.w + POINT.gap);
            return p > 0.001 ? (
              <Card key={b.text} x={x} y={POINT_Y + (1 - p) * 16} w={POINT.w} h={POINT.h} style={{ opacity: p, display: "flex", alignItems: "center", gap: 20, padding: "0 28px" }}>
                <Disc icon={b.icon} size={60} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>{b.text}</div>
              </Card>
            ) : null;
          })}
        </div>
      ) : null}

      {/* "Jadi keputusanmu punya dasar yang lebih lengkap …": the research, fanned out */}
      <div style={{ position: "absolute", inset: 0, filter: fuller > 0.01 ? `drop-shadow(0 0 ${(28 * fuller).toFixed(1)}px ${theme.color.indigoGlow})` : undefined }}>
        {SHOTS.map((s, i) => {
          const p = ease(f, sideAt + m.fade + m.sec(0.06 * i), m.reveal);
          if (p <= 0.001) return null;
          const k = Math.min(FAN.box / (s.iw + 2 * s.pad), FAN.box / (s.ih + 2 * s.pad));
          const w = (s.iw + 2 * s.pad) * k;
          const h = (s.ih + 2 * s.pad) * k;
          const o = i - (SHOTS.length - 1) / 2;
          return (
            <div key={s.src} style={{ position: "absolute", left: FAN.cx + o * FAN.step - w / 2, top: FAN.foot - h + Math.abs(o) * FAN.drop + (1 - p) * 24, width: w, height: h, borderRadius: 12, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, boxSizing: "border-box", padding: s.pad * k, opacity: p, transformOrigin: "50% 100%", transform: `rotate(${(o * FAN.turn * p).toFixed(2)}deg)` }}>
              <Img src={staticFile(`art/in07/app/${s.src}.jpg`)} style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
          );
        })}
      </div>
      {ease(f, sideAt + m.fade, m.reveal) > 0.001 ? (
        <div style={{ position: "absolute", left: FAN.cx - 150, width: 300, top: NAME_Y, textAlign: "center", ...typeStyle("body"), color: c.ink, opacity: ease(f, sideAt + m.fade, m.reveal) }}>Riset</div>
      ) : null}

      {/* "… daripada hanya satu voice note dari temanmu." */}
      {voiceP > 0.001 ? (
        <>
          <div style={{ position: "absolute", left: VOICE.cx - (280 * VOICE.scale) / 2, top: VOICE.cy - (76 * VOICE.scale) / 2 + (1 - voiceP) * 20, opacity: voiceP }}>
            <VoiceBubble scale={VOICE.scale} />
          </div>
          <div style={{ position: "absolute", left: VOICE.cx - 150, width: 300, top: NAME_Y, textAlign: "center", ...typeStyle("body"), color: theme.color.neutralIcon, opacity: voiceP }}>Voice note</div>
        </>
      ) : null}
      <Mark kind="cross" p={ease(f, W("temanmu."), m.pop)} x={VOICE.cx + (280 * VOICE.scale) / 2 - 6} y={VOICE.cy - (76 * VOICE.scale) / 2 + 4} />
    </>
  );
};
