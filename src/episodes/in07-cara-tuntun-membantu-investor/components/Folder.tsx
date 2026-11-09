/**
 * The research folder of SC04 (scenes/ResearchFiles.tsx): a back with its tab on the left, and a front that stops
 * short of the top so papers peek out between. `MiniFolder` is the same folder, small, for Saham and Reksa dana — they
 * were small copies of the isometric stack until that stack became this folder (Simon 9 Nov: "icon saham dan reksa
 * dananya perlu diganti, karna ilustrasi sebelumnya uda diganti").
 */
import { theme, usePalette, type Cut } from "../../../core";
import { CUT } from "../data/timing";
import { Ico } from "./kit";

/** In canvas px: centre x, the body's top `y` (the tab rises `tabH` above it), the front's drop from that top. */
export type FolderGeom = { cx: number; y: number; w: number; h: number; tabW: number; tabH: number; front: number; r: number };

/**
 * The folders leave for the awards (Simon 9 Nov: "folder besar, folder saham, dan folder reksa dana; mereka bertiga
 * geser ke kiri keluar layar aja, lalu muncul 2 awards"): all three slide `by` px left from "melalui penghargaan".
 * On "Bukan berarti" the awards camera-cut to the line of text ("Pas ngomong 'Bukan berarti.....', visual pialanya
 * camera cut aja ke folder dan text"; then "remove 2 visual ini" — the folder and the block — "lalu textnya pindahin ke
 * tengah") — the episode's own cut (data/timing CUT), its frames read off the scene's words on both sides (`awardsCut`).
 */
export const SLIDE = { at: "melalui penghargaan", by: 1500 };
export const awardsCut = (W: (phrase: string) => number): Cut => ({ at: W("Bukan berarti"), axis: "x", ...CUT });

/** The middle line of SC04's second half: the folder, Saham / Reksa dana, the awards and the closing lines centre on it. */
export const MID_Y = 530;

/** The big folder's proportions; a smaller one keeps them (`folderOf`). */
export const FOLDER_SHAPE = { w: 420, h: 300, tabW: 160, tabH: 34, front: 60, r: 22 };

/** A folder `w` across whose whole outline, tab included, is centred on (cx, cy). */
export const folderOf = (cx: number, cy: number, w: number): FolderGeom => {
  const k = w / FOLDER_SHAPE.w;
  const h = FOLDER_SHAPE.h * k;
  const tabH = FOLDER_SHAPE.tabH * k;
  return { cx, y: cy - (h - tabH) / 2, w, h, tabW: FOLDER_SHAPE.tabW * k, tabH, front: FOLDER_SHAPE.front * k, r: Math.max(8, FOLDER_SHAPE.r * k) };
};

/** The back's outline, its tab on the left. */
export const folderBackPath = (g: FolderGeom) => {
  const x0 = g.cx - g.w / 2;
  const x1 = g.cx + g.w / 2;
  const y1 = g.y + g.h;
  const R = g.r;
  const k = g.w / FOLDER_SHAPE.w;
  return `M ${x0} ${y1 - R} V ${g.y - g.tabH + R} Q ${x0} ${g.y - g.tabH} ${x0 + R} ${g.y - g.tabH} H ${x0 + g.tabW - 14 * k} Q ${x0 + g.tabW} ${g.y - g.tabH} ${x0 + g.tabW + 10 * k} ${g.y - 10 * k} L ${x0 + g.tabW + 18 * k} ${g.y} H ${x1 - R} Q ${x1} ${g.y} ${x1} ${g.y + R} V ${y1 - R} Q ${x1} ${y1} ${x1 - R} ${y1} H ${x0 + R} Q ${x0} ${y1} ${x0} ${y1 - R} Z`;
};

/** A small folder, two sheets peeking out of it, an icon on its front; `p` brings it up into place. */
export const MiniFolder = ({ cx, cy, w, icon, p }: { cx: number; cy: number; w: number; icon: string; p: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  const g = folderOf(cx, cy, w);
  const x0 = g.cx - g.w / 2;
  const sheetW = g.w * 0.62;
  const iconSize = (g.h - g.front) * 0.5;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${((1 - p) * 20).toFixed(2)}px)` }}>
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={folderBackPath(g)} fill={theme.color.indigoWashDeepSolid} stroke={c.indigo} strokeWidth={3} strokeLinejoin="round" />
        {[0, 1].map((i) => (
          <rect key={i} x={g.cx - sheetW / 2 + (i ? 10 : -6)} y={g.y + 8 + i * 6} width={sheetW} height={g.h * 0.5} rx={5} fill={c.cardBg} stroke={theme.color.hairlineBrandSolid} strokeWidth={2} />
        ))}
        <rect x={x0} y={g.y + g.front} width={g.w} height={g.h - g.front} rx={g.r} fill={theme.color.indigoWashStrongSolid} stroke={c.indigo} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: g.cx - iconSize / 2, top: g.y + g.front + (g.h - g.front - iconSize) / 2 }}>
        <Ico name={icon} size={iconSize} tone={c.indigo} />
      </div>
    </div>
  );
};
