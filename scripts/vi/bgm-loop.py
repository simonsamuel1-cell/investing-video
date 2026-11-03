#!/usr/bin/env python3
"""
bgm-loop.py — Simon's "Background Music.mp3" as one long, seamless, quiet bed for a full video (VI04 first; Simon,
3 Nov 2026: "pake ini Background Music.mp3 lalu buat looping, dan bikin volumenya lebih rendah daripada voice overnya
… yang penting volume lebih rendah dari voice over dan gaada dead air", and "teknik pengurangan volumenya, bisa kamu
pake ceiling aja … biar pokoknya volumenya ga melebihi batas tertentu").

  ~/.venvs/tuntun/bin/python -I scripts/vi/bgm-loop.py [--minutes 15] [--out public/bgm/vi04-bgm.mp3]

The source is read, never written (01 Academy/Background Music.mp3, 2:54). Nor is the Essentials BGM touched.

  The loop. The song's last bars repeat its first ones: from 162 s on it is its own opening again, exactly LAG
  (measured: 160.000 s) later, until its fade-out at 170 s. So the bed plays the song from the start and, at SEAM
  (168 s, still inside that repeat, before the fade), goes on from SEAM − LAG (8 s) — the same music at the same point
  of its bar. XFADE of equal-power crossfade there smooths what little differs. The fade-in at the very top (the first
  START s, near silence) is skipped and the fade-out at the end is never reached: no dead air, at the start or at any
  seam. LAG is re-measured on every run by cross-correlation, and the run stops if the repeat is not where it was.

  The level. Not one fixed cut (Simon used −30 dB, which left the soft intro bars almost inaudible) but loudnorm: the
  bed is brought to LUFS integrated, its swells evened out within LRA, and a true-peak CEILING it never goes over — so
  it sits well under the VO (VO ≈ −15.6 LUFS) everywhere and never pokes up through it.

The video fades the bed out over its own last frames (core/EpisodeWrap `bgmSrc`), so the bed just has to be longer
than the video: MINUTES.
"""
import argparse
import subprocess
from pathlib import Path

import numpy as np
from numpy.fft import irfft, rfft

ROOT = Path(__file__).resolve().parents[2]
SRC = Path("/Users/samuelsurja/Documents/01 Academy/Background Music.mp3")
SR = 44100
START = 1.0  # s — skip the near-silent fade-in at the top
START_FADE = 0.25
SEAM = 168.0  # s — where each pass leaves the song (inside the repeat of its opening, before the fade-out)
XFADE = 0.25
LAG_GUESS = (158.0, 162.0)
LUFS, LRA, CEILING = -40.0, 5.0, -30.0  # integrated loudness, loudness range, true-peak ceiling (dBTP)
# loudnorm takes a ceiling only from −9 dBTP up (alimiter from −24 dBFS): both work HEADROOM dB higher — loudnorm
# levelling, alimiter holding the ceiling hard — and a plain cut brings the bed down
HEADROOM = 21.0
# the limiter holds samples; between samples and through the MP3 encode the peak comes out ~1.3 dB higher
OVERSHOOT = 1.5


def read(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def lag_of(x):
    """How far after the song's opening its closing repeat sits: the last bars (162–169 s) against the first 11.5 s."""
    m = x.mean(1)
    seg = m[int(162 * SR) : int(169 * SR)]
    win = m[: int(11.5 * SR)]
    n = 1 << int(np.ceil(np.log2(len(win) + len(seg))))
    c = irfft(rfft(win, n) * np.conj(rfft(seg, n)), n)[: len(win) - len(seg)]
    k = int(np.argmax(c))
    lag = 162 - k / SR
    ref = win[k : k + len(seg)]
    r = float(np.dot(ref, seg) / np.sqrt(np.dot(ref, ref) * np.dot(seg, seg)))
    if not (LAG_GUESS[0] < lag < LAG_GUESS[1]) or r < 0.8:
        raise SystemExit(f"the song's closing bars no longer repeat its opening (lag {lag:.3f} s, corr {r:.2f}) — is it the same file?")
    return lag, r


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--minutes", type=float, default=15)
    ap.add_argument("--out", default="public/bgm/vi04-bgm.mp3")
    a = ap.parse_args()
    x = read(SRC)
    lag, r = lag_of(x)
    s = lambda t: int(round(t * SR))
    xf = s(XFADE)
    up = np.sin(np.linspace(0, np.pi / 2, xf))[:, None]
    down = np.cos(np.linspace(0, np.pi / 2, xf))[:, None]

    first = x[s(START) : s(SEAM) + xf].copy()
    first[: s(START_FADE)] *= np.linspace(0, 1, s(START_FADE))[:, None]
    again = x[s(SEAM - lag) : s(SEAM) + xf]  # each later pass: from the same point of the opening, to the seam
    bed = [first[:-xf]]
    tail = first[-xf:]
    total = s(a.minutes * 60)
    have = len(first) - xf
    while have < total:
        bed.append(tail * down + again[:xf] * up)
        bed.append(again[xf:-xf])
        tail = again[-xf:]
        have += len(again) - xf
    y = np.concatenate(bed)[:total].astype(np.float32)

    out = ROOT / a.out
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-af", f"loudnorm=I={LUFS + HEADROOM}:LRA={LRA}:TP={CEILING + HEADROOM},aresample={SR},alimiter=limit={10 ** ((CEILING - OVERSHOOT + HEADROOM) / 20):.4f}:level=false,volume=-{HEADROOM}dB", "-c:a", "libmp3lame", "-b:a", "192k", str(out)],
        input=y.tobytes(),
        check=True,
    )
    print(f"lag {lag:.4f} s (corr {r:.3f}); seam {SEAM:.1f} → {SEAM - lag:.1f} s, pass {SEAM - (SEAM - lag):.1f} s; {a.minutes:g} min → {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
