/**
 * IN07 · SC04 — "Tim riset Tuntun membaca laporan keuangan, membuat model, menilai kualitas perusahaan, menghitung
 * referensi harga wajar, dan mengkaji peristiwa yang bisa memengaruhi bisnis." Simon, 9 Nov: the five jobs as real
 * screens, his picks, then "kelima gambar itu akan mengumpul bertumpuk, lalu masuk ke suatu icon folder" — and they
 * replace the isometric exploded stack that stood here ("Bagian ini diremove aja, ganti dengan urutan 5 gambar tadi").
 *
 * One row, left to right, each on its words, its point's title under it ("Di bawah tiap gambar, kasih title poin nya"):
 *  1  Laporan keuangan — the stock page's Financial tab (VI02's Perkembangan Laba.jpg);
 *  2  Model — the report's Tuntun Valuation table (VI02's Deep Research.jpg);
 *  3  Kualitas — the Company Quality part of the BBCA card (VIDEO 09's Deep Research.jpg) …
 *  4  Harga wajar — … and its Reference Fair Value part: the one card Simon picked for 3–4, cut in two so each job has
 *     its own picture;
 *  5  Peristiwa — that page's Event Research card.
 * They gather into one pile where the stack stood, a folder comes up under it, and the pile drops in at Studio 11775,
 * just before "Setiap perusahaan" ("masuk foldernya di 11775 aja, pas mau ngomong script berikutnya").
 *
 * On "dipantau" the folder shrinks to half and moves up under the heading, with Orang Tuntun the same size left of it
 * and an arrow between ("[ Orang Tuntun --> Folder ]"); the three ways come in under them (scenes/Coverage.tsx). On
 * "Riset Tuntun mencakup" Orang Tuntun goes and the folder comes back to its place, beside Saham and Reksa dana. On
 * "melalui penghargaan" the three folders slide off to the left for the awards (scenes/Awards.tsx), and this one does
 * not come back: on "Bukan berarti" the camera cuts from the awards to the closing lines alone (Simon 9 Nov: "remove 2
 * visual ini" — this folder and the block after it).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { ease, useWords } from "../components/kit";
import { FOLDER_SHAPE, MID_Y, SLIDE, folderBackPath, folderOf } from "../components/Folder";
import { ORANG_TUNTUN, Person } from "../components/Person";

/**
 * One screen: its file and size (px), the words it comes in on, its title, its width in the row, and its place in
 * the pile (offset, tilt). `pad` keeps a table off the card's edge.
 */
export const SHOTS = [
  { src: "sc04-riset-1-financial", iw: 1080, ih: 1615, at: "laporan keuangan", title: "Laporan keuangan", w: 300, dx: -14, dy: -8, pr: -5, pad: 0 },
  { src: "sc04-riset-2-valuation", iw: 360, ih: 474, at: "membuat model", title: "Model", w: 300, dx: 12, dy: -4, pr: 4, pad: 14 },
  { src: "sc04-riset-3-quality", iw: 248, ih: 196, at: "kualitas perusahaan", title: "Kualitas", w: 300, dx: -8, dy: 6, pr: -2, pad: 0 },
  { src: "sc04-riset-4-fair-value", iw: 372, ih: 196, at: "harga wajar", title: "Harga wajar", w: 330, dx: 10, dy: 2, pr: 3, pad: 0 },
  { src: "sc04-riset-5-event", iw: 980, ih: 668, at: "peristiwa", title: "Peristiwa", w: 380, dx: 0, dy: 0, pr: -1, pad: 0 },
] as const;

/** The row: centred on the canvas, the screens standing on one line, their titles under it. */
const ROW = { bottom: 720, gap: 28, titleGap: 22 };
const ROW_X0 = (theme.canvas.width - SHOTS.reduce((a, s) => a + s.w, 0) - (SHOTS.length - 1) * ROW.gap) / 2;
const rowCx = (i: number) => ROW_X0 + SHOTS.slice(0, i).reduce((a, s) => a + s.w + ROW.gap, 0) + SHOTS[i].w / 2;
/**
 * The folder: its back (with the tab), the front it closes with, the papers' tops peeking between — centred on the
 * middle line (MID_Y) where the stack's axis stood, so Saham and Reksa dana sit level with it (Simon 9 Nov: "di
 * rapihin lagi alignment nya").
 */
const FOLDER = folderOf(860, MID_Y, FOLDER_SHAPE.w);
/** The pile: every screen fitted inside `box` × `box`, just over the folder. */
const PILE = { cx: FOLDER.cx, cy: FOLDER.y - 140, box: 300 };
const FOLDER_CY = (FOLDER.y - FOLDER.tabH + FOLDER.y + FOLDER.h) / 2;
const IN = { k: 0.85, top: FOLDER.y + 24 };
const IN_CY = IN.top + (PILE.box * IN.k) / 2;
/**
 * "Setiap perusahaan dipantau oleh analis khusus": the folder at half size under the heading, Orang Tuntun as tall
 * left of it (his circle's bottom level with the folder's), an arrow from him to it.
 */
const DOCK = { k: 0.5, cx: 1170, cy: 290 };
const MAN = { s: 0.23, cx: 690 };
const MAN_CY = DOCK.cy + ((FOLDER.y + FOLDER.h - FOLDER_CY) * DOCK.k) - (ORANG_TUNTUN.d * MAN.s) / 2;
const ARROW = { x0: MAN.cx + 110, x1: DOCK.cx - (FOLDER.w * DOCK.k) / 2 - 24, y: MAN_CY, head: 14 };

const fit = (s: (typeof SHOTS)[number]) => Math.min(PILE.box / (s.iw + 2 * s.pad), PILE.box / (s.ih + 2 * s.pad));

export const ResearchFiles = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(4, BLOCK.SC04);

  /** Into the folder at Studio 11775, 19 frames before "Setiap" (Simon 9 Nov); the pile forms just before. */
  const intoAt = W("Setiap perusahaan") - m.sec(19 / 60);
  const into = ease(f, intoAt, m.sec(0.55));
  const gatherAt = intoAt - m.move;
  const gather = ease(f, gatherAt, m.move);
  const folderP = ease(f, gatherAt + m.sec(0.2), m.reveal);
  const titles = ease(f, gatherAt, m.fade);
  /** Half size, up under the heading on "dipantau"; back on "Riset Tuntun mencakup". */
  const dockAt = W("dipantau") - m.sec(0.1);
  const backAt = W("Riset Tuntun mencakup");
  const dock = ease(f, dockAt, m.move) * (1 - ease(f, backAt, m.move));
  const manP = ease(f, dockAt, m.reveal) * (1 - ease(f, backAt, m.fade));
  const arrowP = ease(f, dockAt + m.sec(0.3), m.sec(0.5)) * (1 - ease(f, backAt, m.fade));
  /** Off to the left for the awards, and gone (components/Folder.tsx). */
  const away = ease(f, W(SLIDE.at), m.move);

  if (f < W(SHOTS[0].at) - m.sec(0.1) || away >= 0.999) return null;

  const x0 = FOLDER.cx - FOLDER.w / 2;
  const y1 = FOLDER.y + FOLDER.h;
  const back = folderBackPath(FOLDER);
  const folderStyle = { position: "absolute" as const, left: 0, top: 0, opacity: folderP, transform: `translateY(${((1 - folderP) * 24).toFixed(2)}px)` };
  const k = 1 + (DOCK.k - 1) * dock;
  const tx = (DOCK.cx - FOLDER.cx) * dock - SLIDE.by * away;
  const ty = (DOCK.cy - FOLDER_CY) * dock;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${FOLDER.cx}px ${FOLDER_CY}px`, transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k.toFixed(4)})` }}>
        {folderP > 0.001 ? (
          <svg width={theme.canvas.width} height={theme.canvas.height} style={folderStyle}>
            <path d={back} fill={theme.color.indigoWashDeepSolid} stroke={c.indigo} strokeWidth={4} strokeLinejoin="round" />
          </svg>
        ) : null}

        {/* the screens: in a row, then one pile, then into the folder (cut off at its bottom once they drop in) */}
        <div style={{ position: "absolute", inset: 0, clipPath: into > 0 ? `inset(0 0 ${theme.canvas.height - y1 + 6}px 0)` : undefined }}>
          {SHOTS.map((s, i) => {
            const p = ease(f, W(s.at) - m.sec(0.1), m.reveal);
            if (p <= 0.001) return null;
            const pw = (s.iw + 2 * s.pad) * fit(s);
            const w = s.w + (pw - s.w) * gather;
            const h = (w * (s.ih + 2 * s.pad)) / (s.iw + 2 * s.pad);
            const scale = 1 + (IN.k - 1) * into;
            const cx = rowCx(i) + (PILE.cx + s.dx - rowCx(i)) * gather;
            const rowCy = ROW.bottom - (s.w * (s.ih + 2 * s.pad)) / (s.iw + 2 * s.pad) / 2;
            const cy = rowCy + (PILE.cy + s.dy - rowCy) * gather + (IN_CY - PILE.cy) * into;
            const r = s.pr * gather;
            const pad = (w * s.pad) / (s.iw + 2 * s.pad);
            return (
              <div key={s.src} style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: 14, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, boxSizing: "border-box", padding: pad, opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${scale.toFixed(4)})` }}>
                <Img src={staticFile(`art/in07/app/${s.src}.jpg`)} style={{ width: "100%", height: "100%", display: "block" }} />
              </div>
            );
          })}
        </div>

        {folderP > 0.001 ? (
          <svg width={theme.canvas.width} height={theme.canvas.height} style={folderStyle}>
            <rect x={x0} y={FOLDER.y + FOLDER.front} width={FOLDER.w} height={FOLDER.h - FOLDER.front} rx={FOLDER.r} fill={theme.color.indigoWashStrongSolid} stroke={c.indigo} strokeWidth={4} />
          </svg>
        ) : null}
      </div>

      {/* each point's title under its screen, gone as they gather */}
      {SHOTS.map((s, i) => {
        const p = ease(f, W(s.at) - m.sec(0.1), m.reveal) * (1 - titles);
        return p > 0.001 ? (
          <div key={s.title} style={{ position: "absolute", left: rowCx(i) - s.w / 2 - 20, width: s.w + 40, top: ROW.bottom + ROW.titleGap, textAlign: "center", ...typeStyle("body"), fontSize: 30, color: c.indigo, whiteSpace: "nowrap", opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(2)}px)` }}>{s.title}</div>
        ) : null;
      })}

      {/* the analyst, and the arrow to the folder */}
      {manP > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: manP, transform: `translateY(${((1 - manP) * 18).toFixed(2)}px)` }}>
          <Person cx={MAN.cx} cy={MAN_CY} s={MAN.s} pic={ORANG_TUNTUN} tone={theme.color.indigoWashDeepSolid} />
        </div>
      ) : null}
      {arrowP > 0.001 ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={ARROW.x0} y1={ARROW.y} x2={ARROW.x0 + (ARROW.x1 - ARROW.x0) * arrowP} y2={ARROW.y} stroke={theme.color.connector} strokeWidth={4} strokeLinecap="round" />
          {arrowP > 0.95 ? <polyline points={`${ARROW.x1 - ARROW.head},${ARROW.y - ARROW.head} ${ARROW.x1},${ARROW.y} ${ARROW.x1 - ARROW.head},${ARROW.y + ARROW.head}`} fill="none" stroke={theme.color.connector} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </svg>
      ) : null}
    </div>
  );
};

/** Where the three ways stand: under the analyst and the folder (scenes/Coverage.tsx). */
export const UNDER_DOCK = DOCK.cy + ((FOLDER.y + FOLDER.h - FOLDER_CY) * DOCK.k);
