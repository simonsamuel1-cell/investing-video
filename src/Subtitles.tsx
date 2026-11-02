import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CUES as CUES_ISI } from './cues';
import { OUTRO_AT, OUTRO_CUES } from './outro/plan.gen';
import { B, F, R } from './theme';

/**
 * Subtitle di-burn — waktu dari src/cues.ts (forced alignment MMS, scripts/gen-cues.py),
 * file yang sama dengan 04_Asset/Video 03 - Tiga Jenis Uang_ID.srt.
 *
 * Gaya (ATURAN-PRODUKSI §2): Plus Jakarta Sans Bold 35, SATU baris, ungu brand, tanpa kotak.
 * Logika tampil = Video 10 / CTA: SATU cue saja; pudar 5f DIPUSATKAN di tepi yang sunyi,
 * bertukar seketika bila cue berikutnya menyambung (tidak pernah dua kalimat bertindih).
 */
const FADE = 5;
/** + outro "Di video selanjutnya" (Simon 20 Okt) — baris Simon, waktu dari scripts/gen-outro.py */
const CUES = [...CUES_ISI, ...OUTRO_CUES.map((c, j) => ({ i: CUES_ISI.length + j + 1, k: 0, sc: 21, a: OUTRO_AT + c.a, b: OUTRO_AT + c.b, t: c.t }))];
export const SUB_Y = 978;

export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  let idx = -1;
  for (let i = 0; i < CUES.length; i += 1) if (f >= CUES[i].a && f <= CUES[i].b) idx = i;
  if (idx < 0) for (let i = 0; i < CUES.length; i += 1) if (f >= CUES[i].a - FADE && f <= CUES[i].b + FADE) idx = i;
  if (idx < 0) return null;
  const cur = CUES[idx];
  const prev = idx > 0 ? CUES[idx - 1] : null;
  const next = idx + 1 < CUES.length ? CUES[idx + 1] : null;
  const inOp = prev && prev.b + FADE >= cur.a - FADE ? 1 : R(f, cur.a - FADE, cur.a + FADE, 0, 1);
  const outOp = next && next.a - FADE <= cur.b + FADE ? 1 : R(f, cur.b - FADE, cur.b + FADE, 1, 0);
  const op = Math.min(inOp, outOp);
  if (op <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: SUB_Y, height: 120, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div data-sub={cur.i} style={{
        padding: '8px 20px', opacity: op, whiteSpace: 'nowrap',
        fontFamily: F, fontSize: 35, fontWeight: 700, color: B.blue,
        letterSpacing: '-.01em', lineHeight: 1.25, textAlign: 'center',
      }}>{cur.t}</div>
    </div>);
};
