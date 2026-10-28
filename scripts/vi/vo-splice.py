#!/usr/bin/env python3
"""
vo-splice.py — rebuild an episode's VO from the ORIGINAL recording plus Simon's re-recorded lines, as written in a
JSON spec, so every revision is reproducible and the original file is never edited.

  ~/.venvs/tuntun/bin/python scripts/vi/vo-splice.py src/episodes/<ep>/data/vo-edits.json

Spec: {"base": dir the paths are relative to, "source": original VO, "out": public/vo/… (repo-relative),
       "pieces": [ {"src": "ORIGINAL", "from": s, "to": s}            a stretch of the original
                 | {"src": "Revisi VO/x.mp3", "from"?, "to"?, "match": "original 10.9-18.3", "level"?}   a new line
                 | {"silence": s} ]}
A new line's gain is set so its loudness (EBU R128) equals the stretch of the original it replaces ("match"),
because the re-recordings come back quieter or louder than the take around them. Cuts sit in silences; each
piece still gets a 5 ms fade at both ends so a cut can never click.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

SR = 44100
REPO = Path(__file__).resolve().parents[2]


def load(path, a=None, b=None):
    cmd = ["ffmpeg", "-v", "error"] + (["-ss", str(a)] if a is not None else []) + (["-to", str(b)] if b is not None and a is None else [])
    cmd += ["-i", str(path)] + (["-t", str(b - a)] if a is not None and b is not None else [])
    cmd += ["-f", "f32le", "-ac", "2", "-ar", str(SR), "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).reshape(-1, 2).copy()


PEAK_DB = -1.0


def limit(x):
    ceiling = 10 ** (PEAK_DB / 20)
    p = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                        "-af", f"alimiter=limit={ceiling:.4f}:level=false:latency=true:attack=5:release=50",
                        "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], input=x.astype(np.float32).tobytes(), capture_output=True, check=True)
    y = np.frombuffer(p.stdout, dtype=np.float32).reshape(-1, 2)
    return np.pad(y, ((0, max(0, len(x) - len(y))), (0, 0)))[: len(x)].copy()


def lufs(x):
    p = subprocess.run(["ffmpeg", "-nostats", "-v", "info", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-af", "ebur128", "-f", "null", "-"],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", p.stderr.decode())[-1])


def main():
    spec_path = Path(sys.argv[1])
    spec = json.load(open(spec_path))
    base = Path(spec["base"])
    source = base / spec["source"]
    out = []
    fade = int(0.005 * SR)
    for p in spec["pieces"]:
        if "silence" in p:
            out.append(np.zeros((int(p["silence"] * SR), 2), dtype=np.float32))
            continue
        path = source if p["src"] == "ORIGINAL" else base / p["src"]
        x = load(path, p.get("from", 0.0), p.get("to"))
        if "match" in p:
            a, b = map(float, p["match"].split()[1].split("-"))
            # "level": [from, to] of the clip to measure instead of this piece — a clip split in parts (to lengthen
            # its own pauses) keeps ONE gain for all of them
            gain = lufs(load(source, a, b)) - lufs(load(path, *p["level"]) if "level" in p else x)
            x *= 10 ** (gain / 20)
            peak = 20 * np.log10(np.abs(x).max())
            if peak > PEAK_DB:
                # a quiet take brought up to the original can poke over full scale: a delay-compensated limiter
                # takes the few peaks down to PEAK_DB instead of letting the mp3 clip
                x = limit(x)
            print(f"{p['src']}: {gain:+.1f} dB to match the original {a}-{b}s; peak {peak:.1f} -> {20 * np.log10(np.abs(x).max()):.1f} dBFS")
        ramp = np.linspace(0, 1, fade, dtype=np.float32)[:, None]
        x[:fade] *= ramp
        x[-fade:] *= ramp[::-1]
        out.append(x)
    y = np.concatenate(out)
    dst = REPO / spec["out"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-c:a", "libmp3lame", "-b:a", "192k", str(dst)],
                   input=y.tobytes(), check=True)
    print(f"{len(y) / SR:.3f} s -> {dst.relative_to(REPO)}")


if __name__ == "__main__":
    main()
