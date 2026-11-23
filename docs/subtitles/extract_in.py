"""extract_in.py — the Indonesian subtitles of the finished Investing 101 videos (IN01, IN04, IN07), timed to the full video.

Each video = Intro (4 s = 240 frames at 60 fps) + its episode's burned-in cues (src/episodes/<ep>/subtitles.ts) + the
next-video outro lines where the video has one (IN04: NextVideo.tsx, starting NEXT_PAUSE after the episode). Frame maths as
core/EpisodeWrap.tsx; IN01 has its own FullVideo.tsx with the same 240-frame intro. No CTA in these videos.
Writes docs/subtitles/id/<KEY>.json like extract_id.py.

  python3 docs/subtitles/extract_in.py
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "src/episodes")
CUE = re.compile(r'\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*text:\s*"((?:[^"\\]|\\.)*)"\s*\}')
SCUE = re.compile(r'\{\s*start:\s*s\(([\d.]+)\),\s*end:\s*s\(([\d.]+)\),\s*text:\s*"((?:[^"\\]|\\.)*)"\s*\}')
FPS, I = 60, 240

# FULL = the finished composition's length in frames (`npx remotion compositions`); the episode's own length is what is
# left after intro, the next-video tail (NEXT_PAUSE 30 + clip + 1 s hold) and the outro (239).
VIDEOS = [
    # name = the delivered files' name (Simon 19 Nov: "Investing 101_Video 01 - Passive Income", "…_Video 04 - Kenali Profil
    # Risiko"); mp4 = the finished file in Hasil/
    dict(key="IN01", name="Investing 101_Video 01 - Passive Income", mp4="IN01_PassiveIncome", ep="in01-passive-income", full=20574, next=None),
    dict(key="IN04", name="Investing 101_Video 04 - Kenali Profil Risiko", mp4="IN04_InvestasiYangCocok", ep="in04-investasi-yang-cocok", full=31080, next=("NextVideo.tsx", 6.358)),
    dict(key="IN07", name="Investing 101_Video 07 - Cara Tuntun Membantu Investor", mp4="IN07_CaraTuntunMembantuInvestorMengurangiKesalahan", ep="in07-cara-tuntun-membantu-investor", full=35021, next=None),
]
unesc = lambda t: t.replace('\\"', '"')


def kodok(ep):
    """IN07 only: its subtitles.ts keeps the VO's own frames, but the episode skips the VO's 3 s "frog" pause (timing.ts
    KODOK = false, onTimeline): frames after the pause play `len` earlier. Same sum as timing.ts KODOK_PAUSE."""
    path = os.path.join(SRC, ep, "data/vo-edits.json")
    if ep != "in07-cara-tuntun-membantu-investor":
        return lambda f: f
    t = 0.0
    for p in json.load(open(path))["pieces"]:
        if "silence" in p and "frog" in p.get("_", ""):
            at, ln = int(t * 60 // 1), round(p["silence"] * 60)
            return lambda f: f if f <= at else (f - ln if f >= at + ln else at)
        t += p["silence"] if "silence" in p else p.get("to", 0) - p.get("from", 0)
    raise SystemExit("IN07: frog pause not found")
os.makedirs(os.path.join(ROOT, "docs/subtitles/id"), exist_ok=True)
for v in VIDEOS:
    out = []
    on = kodok(v["ep"])
    for a, b, t in CUE.findall(open(os.path.join(SRC, v["ep"], "subtitles.ts")).read()):
        a, b = on(int(a)), on(int(b))
        if b > a:
            out.append(((I + a) / FPS, (I + b) / FPS, unesc(t), "episode"))
    if v["next"]:
        f, secs = v["next"]
        tail = 30 + round(secs * FPS) + FPS
        frames = v["full"] - I - tail - 239
        clip_at = I + frames + 30
        for a, b, t in SCUE.findall(open(os.path.join(SRC, v["ep"], f)).read()):
            out.append(((clip_at + round(float(a) * FPS)) / FPS, (clip_at + round(float(b) * FPS)) / FPS, unesc(t), "outro"))
    out.sort(key=lambda r: r[0])
    rows = [dict(i=i + 1, start=round(s, 3), end=round(e, 3), text=t, part=p) for i, (s, e, t, p) in enumerate(out)]
    assert rows[-1]["end"] <= v["full"] / FPS, (v["key"], rows[-1])
    json.dump(dict(key=v["key"], name=v["name"], mp4=v["mp4"], rows=rows), open(os.path.join(ROOT, f"docs/subtitles/id/{v['key']}.json"), "w"), ensure_ascii=False, indent=1)
    print(v["key"], len(rows), "lines", f"ends {rows[-1]['end']:.2f}s of {v['full'] / FPS:.2f}s")
