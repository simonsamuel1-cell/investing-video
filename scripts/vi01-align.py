#!/usr/bin/env python3
"""
vi01-align.py — VI01 Passive Income: the script's WORDS on the SRT's CLOCK.

Simon: the original script is right about the text (capitals, punctuation) and
wrong about the timing; the Premiere SRT is right about the timing and wrong
about the text, and it cuts phrases across sentences. So:

  1. every script word is matched to an SRT word (difflib over normalised
     tokens); SRT words get times by spreading each cue over its characters;
     unmatched script words are interpolated between matched neighbours;
  2. a sentence starts on its first word and ends on its last — and where that
     edge falls INSIDE an SRT cue rather than on its edge, it is moved to the
     quietest 20 ms of the audio near the estimate, which is the breath the
     speaker actually took;
  3. one cue per sentence, single line; a sentence longer than MAX_CHARS is cut
     at its commas/colon (else at the middle word) into parts, each its own cue.

Writes:
  assets/VI01_PassiveIncome_Sub_CORRECTED.srt   — the corrected subtitles
  docs/VI01_sentences.json                      — sentences/cues with times, per scene

Usage: python3 scripts/vi01-align.py
"""
import difflib
import json
import re
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = Path("/Users/samuelsurja/Documents/01 Academy/INV01 - Passive Income")
SRT_IN = SRC / "INV01 - Main VO.srt"
VO = SRC / "INV01 - Main VO.MP3"
SCRIPT = ROOT / "docs" / "VI01_PassiveIncome_Script_ORIGINAL.txt"
SRT_OUT = ROOT / "assets" / "VI01_PassiveIncome_Sub_CORRECTED.srt"
JSON_OUT = ROOT / "docs" / "VI01_sentences.json"
# Silence Simon has had spliced into the VO (scripts/vi01-vo.py builds the padded
# file from the same list). Alignment runs on the ORIGINAL recording; every time
# written out is then moved past the pads before it, so the cues match the
# padded file the video plays.
PADS = json.loads((ROOT / "src/episodes/vi01-passive-income/data/pads.json").read_text())
PAD_S = [(p["at"] / 60, p["frames"] / 60) for p in PADS]
padded = lambda t: t + sum(d for at, d in PAD_S if t >= at)

# One line of the caption band (core/Captions: Plus Jakarta Sans 500 at 36px,
# 1728px between the margins), measured in the real font, with room to spare.
from PIL import ImageFont
FONT = ImageFont.truetype(str(Path.home() / "Library/Fonts/PlusJakartaSans-Medium.ttf"), 36)
MAX_PX = 1560
width = lambda t: FONT.getlength(t)
SR = 16000

# Script typo, flagged in the sync doc: "asetnya,cbeli" → "asetnya, beli".
SCRIPT_FIXES = {"asetnya,cbeli": "asetnya, beli"}

# Spoken/transcribed forms → one matching key.
NORM = {
    "passive": "pasif", "asset": "aset", "financial": "finansial",
    "karier": "karir", "sekadar": "sekedar", "kedua": "ke2", "ke-2": "ke2",
    "lokeng": "lo", "kheng": "lo2",
}


def ts(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}"


def parse_srt(p):
    out = []
    for block in re.split(r"\n\s*\n", p.read_text().strip()):
        lines = block.strip().splitlines()
        if len(lines) < 3:
            continue
        a, b = lines[1].split(" --> ")
        f = lambda x: int(x[:2]) * 3600 + int(x[3:5]) * 60 + float(x[6:].replace(",", "."))
        out.append((f(a), f(b), " ".join(lines[2:])))
    return out


def norm(w):
    w = w.lower().replace("’", "").replace("“", "").replace("”", "")
    w = re.sub(r"^rp", "", w)
    w = re.sub(r"[^\w\-]", "", w)
    w = NORM.get(w, w)
    return w.replace("-", "")


# ── SRT words with times ──────────────────────────────────────────────────────
srt = parse_srt(SRT_IN)
srt_words = []  # (key, start, end, cue_index, first_in_cue, last_in_cue)
for ci, (a, b, text) in enumerate(srt):
    ws = text.split()
    total = sum(len(w) + 1 for w in ws)
    t = a
    for wi, w in enumerate(ws):
        d = (b - a) * (len(w) + 1) / total
        keys = [norm(w)]
        if norm(w) == "lo":  # "lokeng" stands for two script words
            keys = ["lo", "lo2"]
        for k_i, k in enumerate(keys):
            sub = d / len(keys)
            srt_words.append((k, t + k_i * sub, t + (k_i + 1) * sub, ci,
                              wi == 0 and k_i == 0, wi == len(ws) - 1 and k_i == len(keys) - 1))
        t += d

# ── script: scenes → sentences → words ───────────────────────────────────────
raw = SCRIPT.read_text()
for k, v in SCRIPT_FIXES.items():
    raw = raw.replace(k, v)
scenes = []
for block in re.split(r"\n(?=\[SCENE)", raw.strip()):
    head, *body = block.strip().splitlines()
    n = int(re.search(r"SCENE (\d+)", head).group(1))
    text = " ".join(l.strip() for l in body if l.strip())
    # sentence ends: . ? ! or a closing quote after them; keep "…: “X”" whole
    sents = re.findall(r'.+?(?:[.?!]”|[.?!](?=\s|$))', text + " ")
    scenes.append({"n": n, "sentences": [s.strip() for s in sents if s.strip()]})

script_words = []  # (key, scene, sentence, word_index_in_sentence, display_word)
for sc in scenes:
    for si, s in enumerate(sc["sentences"]):
        for wi, w in enumerate(s.split()):
            script_words.append((norm(w), sc["n"], si, wi, w))

# ── match ─────────────────────────────────────────────────────────────────────
A = [w[0] for w in script_words]
B = [w[0] for w in srt_words]
sm = difflib.SequenceMatcher(a=A, b=B, autojunk=False)
match = [None] * len(A)
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        match[blk.a + k] = blk.b + k
starts = [None] * len(A); ends = [None] * len(A); exact_s = [False] * len(A); exact_e = [False] * len(A)
for i, j in enumerate(match):
    if j is not None:
        starts[i], ends[i] = srt_words[j][1], srt_words[j][2]
        exact_s[i], exact_e[i] = srt_words[j][4], srt_words[j][5]
# interpolate the unmatched between matched neighbours
i = 0
while i < len(A):
    if starts[i] is None:
        j = i
        while j < len(A) and starts[j] is None:
            j += 1
        t0 = ends[i - 1] if i > 0 else 0.0
        t1 = starts[j] if j < len(A) else srt[-1][1]
        n = j - i
        for k in range(n):
            starts[i + k] = t0 + (t1 - t0) * k / n
            ends[i + k] = t0 + (t1 - t0) * (k + 1) / n
        i = j
    else:
        i += 1
unmatched = [script_words[i][4] for i in range(len(A)) if match[i] is None]

# ── audio, for edges that fall inside a cue ──────────────────────────────────
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(VO), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                     capture_output=True).stdout
audio = np.frombuffer(pcm, dtype=np.float32)
WIN = int(0.02 * SR)


def quietest(t, radius=0.3):
    """Centre of the quietest 20 ms within ±radius of t."""
    a = max(0, int((t - radius) * SR)); b = min(len(audio) - WIN, int((t + radius) * SR))
    best, bt = 1e9, t
    for x in range(a, b, WIN // 4):
        e = float(np.sqrt(np.mean(audio[x:x + WIN] ** 2)))
        if e < best:
            best, bt = e, (x + WIN / 2) / SR
    return bt


def edge_start(i):
    return starts[i] if exact_s[i] else quietest(starts[i])


def edge_end(i):
    return ends[i] if exact_e[i] else quietest(ends[i])


# ── sentences → cues ─────────────────────────────────────────────────────────
def split_sentence(words, at):
    """
    As few parts as fit one line each (≤ MAX_PX), and only ever cut at a
    colon, a comma, or where the speaker paused (a gap in the recording
    between the two words) — never mid-phrase. Among those: colon first,
    then comma, then pause, then balance.
    `at` is the index of words[0] in script_words.
    """
    if width(" ".join(words)) <= MAX_PX:
        return [words]
    pause = lambda k: starts[at + k] - ends[at + k - 1] > 0.15
    natural = lambda k: words[k - 1][-1] in ",:;" or pause(k)
    def score(k):
        left, right = " ".join(words[:k]), " ".join(words[k:])
        tail = words[k - 1][-1]
        return (abs(width(left) - width(right)) / 10
                - (900 if tail == ":" else 400 if tail in ",;" else 0)
                - (300 if pause(k) else 0))
    cuts = [k for k in range(1, len(words)) if natural(k)] or list(range(1, len(words)))
    two = [k for k in cuts
           if width(" ".join(words[:k])) <= MAX_PX and width(" ".join(words[k:])) <= MAX_PX]
    if two:
        k = min(two, key=score)
        return [words[:k], words[k:]]
    k = min(cuts, key=score)
    return split_sentence(words[:k], at) + split_sentence(words[k:], at + k)


idx = 0
out_scenes = []
cues = []
for sc in scenes:
    sc_out = {"n": sc["n"], "sentences": []}
    for si, s in enumerate(sc["sentences"]):
        words = s.split()
        first = idx
        parts = []
        for part in split_sentence(words, idx):
            a = idx; b = idx + len(part) - 1
            t0, t1 = edge_start(a), edge_end(b)
            parts.append({"text": " ".join(part), "start": round(t0, 3), "end": round(t1, 3)})
            cues.append(parts[-1])
            idx += len(part)
        sc_out["sentences"].append({"text": s, "start": parts[0]["start"], "end": parts[-1]["end"], "parts": parts})
    out_scenes.append(sc_out)
assert idx == len(script_words)

# a cue never runs into the next one
for a, b in zip(cues, cues[1:]):
    if a["end"] > b["start"]:
        a["end"] = b["start"]

for c in cues:
    c["start"], c["end"] = round(padded(c["start"]), 3), round(padded(c["end"]), 3)
for sc in out_scenes:
    for sen in sc["sentences"]:
        sen["start"], sen["end"] = round(padded(sen["start"]), 3), round(padded(sen["end"]), 3)
SRT_OUT.parent.mkdir(exist_ok=True)
SRT_OUT.write_text("\n".join(f"{i + 1}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}\n" for i, c in enumerate(cues)))
words_out = [{"w": w[4], "scene": w[1], "start": round(padded(starts[i]), 3), "end": round(padded(ends[i]), 3),
              "matched": match[i] is not None} for i, w in enumerate(script_words)]
JSON_OUT.write_text(json.dumps({"scenes": out_scenes, "unmatched": unmatched,
                                "vo_end": padded(srt[-1][1]), "words": words_out}, ensure_ascii=False, indent=1))
print(f"{len(cues)} cues, {sum(len(s['sentences']) for s in out_scenes)} sentences")
print("unmatched script words:", unmatched)
print("widest cue: %.0f px" % max(width(c["text"]) for c in cues))
