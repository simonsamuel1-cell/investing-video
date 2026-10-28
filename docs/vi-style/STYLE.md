# VI style — v0 (draft, will change)

The Value Investing series (VI02 on). VI is **more abstract** than TA: fewer real charts and app screens,
more ideas. The picture explains an idea; it does not decorate the voice. Simon, 13 Oct 2026:
*"lebih banyak flat design/icon, adanya karakter dan maskot, text, dan mindmap."*

References: `refs/ref-01 … ref-12` (Simon's picks). What they share is written down here, so the
references are not re-read every scene.

---

## 0. Benchmark v1 — 22 Oct 2026 (this leads; where it disagrees with the sections below, it wins)

Simon, 22 Oct: *"perbaikan benchmark untuk style video"*, with 7 videos, 6 images and the keywords
**tech explainer, finance explainer, visual storytelling, flowy, fluid, mindmaps with connectors, subtle visuals**.
Everything is in `refs/benchmark-2026-10-22/` — `moodboard.png` is the one-page summary; `sheets/` has a frame
every few seconds of each video and dense strips of three motions; `videos/` and `images/` are the originals.

| Ref | What it teaches |
|---|---|
| v1 ancrid (AI receptionist) | Connectors grow out of a centre node, orthogonal with rounded corners, then each end node (icon tile + label) arrives — about 1 s for the whole map. Also: a greyscale storyboard first, then the build (our pipeline). |
| v2 Gemini | A soft blue gradient with faint concentric rings; ONE continuous camera that dives into the prompt bar; text typed in; the bar glows with the brand gradient. |
| v3 SCM (construction) | Light sections, a navy section for emphasis; white UI cards with avatar bubbles around them; a kinetic sentence with an object in the gap ("making payroll [coin] faster and easier"). |
| v4 Jobster | Orbit rings with avatar nodes; the rings spin away and the SAME avatars fly into two list columns — objects carry over between layouts instead of cutting. |
| v5 Philadelphia wages | Finance explainer on cream paper: a map, cut-out people, mono labels, line charts where the idea (the slope) is shaded; a dark section for the key comparison. |
| v6 Fractional ownership | One card frame, its content swapping; one big number on one picture; a colour overlay on a photo. |
| v7 Trovebase | Particles converge into a logo; blurred UI behind; a glowing card stack. |
| images | SaaS hero layouts: thin lines converging into a glowing focal icon (Lorikeet); orbit arcs with stats; a centre card with tools around it; stats with leader lines to one big radial shape; flow curves between wireframe cards. |

**What they share — the rules:**

1. **Ground: light and airy.** Paper white / very light grey, with one large soft gradient bloom in the brand's
   indigo→cyan (low saturation) or faint concentric rings. Navy/dark only for an emphasis moment (the key chart, a
   reveal), then back to light.
2. **One focal object per frame, and it glows** — a soft brand-gradient glow. Everything else is subdued: white,
   light grey, hairlines.
3. **Connectors are the signature.** Hairline (2–3 px), curved or orthogonal with rounded corners; they GROW from the
   source when the VO says the link; a gradient along them (indigo→cyan) and, where it helps, a pulse of light
   travelling along. A mindmap = a centre node, connectors, end nodes (icon tile + short label), staggered.
4. **Cards:** white, rounded (24–28), a very soft shadow, little text — skeleton lines instead of fake copy, an icon or
   avatar at the left.
5. **Motion is flow.** Nothing just appears: things arrive along a path; the same object carries over from one layout
   into the next (v4) instead of a cut; the camera keeps drifting and dives into an element to open the next idea
   (v2). Easy ease, moves of 0.4–0.8 s, staggers of 60–100 ms. Hard cuts are rare.
6. **Type:** big, few words, sentence case; one keyword in the brand colour; a kinetic line can hold an object between
   words; numbers are huge with a small label under them.
7. **Subtle:** low-contrast secondary elements, lots of empty space, the brand gradient plus at most one accent.
8. **Minimalist (Simon, 22 Oct, after the benchmark): "Minimalis, banyak white spacenya (antar elemen punya white space
   atau jarak yang cukup), dan tulisannya normal (tidak terlalu tebal)."** Fewer elements per frame; generous gaps
   between every element (cards, labels, lines — never crowded); text in regular/medium weights (400–600), with 700
   at most for a headline and 800 not used.
9. **Finance specifically (v5, v6):** one number, one picture, one chart per idea; the part of the chart the VO talks
   about is shaded; real photos may sit under a colour overlay.
10. **Text has to earn its place (Simon, 26 Oct, after VI04's text revisions): "Ga semua poin2 bisa kamu tulis langsung
   aja begitu, harus dipikirin lagi apakah worth it untuk ditulis?"** The subtitles already carry the VO, so a card
   that repeats it adds nothing. Write a number, a keyword that names the picture, a label that tells things apart,
   or the scene's ONE key line — nothing else; everything else is a picture, an icon or a motion. What stays is
   rephrased short: labels 1–3 words, a phrase over a sentence, one sentence per scene at most. Never a script
   sentence pasted onto a card.

### 0b. Benchmark v2 — 26 Oct 2026 (Ray Dalio's explainers; adds to v1, doesn't replace it)

Simon sent four links — "How The Economic Machine Works" (PHe0bXAIuk0) and "Principles for Dealing with the Changing
World Order" (xguam0TKMw8, its 5-minute cut BB2r_eOjsPw, and R34NjxDnhi4, the same film in Spanish). Contact sheets in
`refs/benchmark-2026-10-26-dalio/`. His call: *"Coba terapkan yang ga melanggar aturan. Yang bentrok, buang aja, kecuali
grafik data dan foto arsip, itu bisa ditiru style nya."*

**Taken (first used in VI07; pieces in `src/episodes/vi07-…/components/Dalio.tsx`):**
1. **Metaphor objects that carry the argument** — a lens that dives into a line to show what it is made of (volume →
   transactions), drawn in ink line (`sketchInk` on `sketchFill`). ⚠ NOT a balance/scale: tried in VI07 SC04 and
   rejected (Simon, 26 Oct: "hapus timbangannya, malah jadi sampah") — a big drawn prop next to the scene's objects
   reads as clutter.
2. **Lines that draw on behind a pen-tip dot.**
3. **Real-data charts in an editorial style** — serif title (Libre Baskerville), hairline grid, value axis on the right,
   month ticks, one event marked with a dashed rule, the source in small type. REAL DATA ONLY (VI07: IHSG closes from
   Yahoo Finance in `data/ihsg.ts`).
4. **Archival clipping style** — newsprint, serif headline, columns, a halftone picture, tape. Its words come from the
   script; it never names or imitates a real newspaper.
5. **One recurring thread** where an episode has one (Dalio's Big Cycle arc): the same object returning across scenes.

**Dropped as clashing with our rules:** crowds and figures of people (only Orang Tuntun and the mascot), dark textured
grounds (we stay light; dark only for a moment of emphasis), and real archive photos/footage (copyright — the STYLE is
imitated, the assets are not).

### 0c. Motion techniques — 27 Oct 2026 (Barty-Bart/motion-graphics skills)

Simon picked four skills from https://github.com/Barty-Bart/motion-graphics as relevant: motion-broll, explainer-high-energy,
explainer-default, explainer-engaging (MIT). Their HTML engine is not used; their motion ideas are, rebuilt in Remotion and
filtered by these rules — one shape that morphs instead of cutting, one hero travelling through stations with a following camera
and a pull-out reveal, the camera as the editor (push into a line, ride the typing, pull back), objects as transitions. Full
notes: the `tuntun-remotion-episode` skill, `references/motion-techniques.md`. GIFs in `refs/barty-motion-graphics-2026-10-27/`. Same day, Simon also adopted the 16 effect recipes of
charlie947/motion-graphics-skills' `motion-effects` (*"Motion effects boleh tuh diadopsi"*) — in hold mode under the VO, opaque, light ground;
elastic type dropped (it stretches type). Same file, §5.

10b. **No transparent fills (Simon, 26 Oct: "Biar aku aja yang buat transparan, jangan buat transparan lagi").** Every
   fill and line is 100% opaque — use the `…Solid` theme keys, never the rgba washes; a "dimmed" state is shown by
   desaturating (grayscale), not by opacity. Opacity is only for fading in and out.

**Open with Simon (not decided):**
- **Avatars as nodes** (v3, v4, images) — real-looking people in circles. §3 below says "no other people" (19 Oct).
- **Icons:** the references use thin, light line icons in white tiles; §4b says isometric line icons with a dark
  outline (19 Oct).
- The paper-diorama prototype (`Proto-PaperShot`, 21 Oct) is a different direction from this benchmark.

**What core needs for it (build only when asked):** `Connector` (growing path, rounded corners, gradient, travelling
pulse), mindmap `Node`, `OrbitRings`, `GlowFocus`, `SoftGround` (gradient bloom + rings), a carry-over layout
helper (the same item moving between two layouts), the camera from `Proto-PaperShot`, `KineticLine`, `StatHero`.

---

## 1. The building blocks

| Block | Use it for | From the references |
|---|---|---|
| **Flat icon / object** | a thing the VO names (uang, saham, laporan, toko) | ref-01…05: one hue family, soft gradient, layered translucent shapes, a light drop shadow; ref-04 isometric line-and-fill |
| **Text frame** | the sentence that matters, said on screen | TA-era dashed box, quiz statement ("Tanya juga"), quote card — still valid |
| **Mindmap** | one idea and its parts, causes or kinds | ref-06/08/09: a centre node, curved connectors, a colour per branch, pill nodes; ref-08 has a character sitting on the map |
| **Hub / network** | a system of parts that feed each other | ref-07: line art, a centre, dashed connectors to satellites |
| **Path / journey** | steps in time, a process, "pelan-pelan" | ref-10/11: an S-curve with dots, icons and labels on it; ref-12: numbered badges, the current step big and coloured, the rest grey |
| **Character** | a person who acts the idea out | Orang Tuntun (see §3) |
| **Mascot** | the brand's presence, a guide | Tuntun mascot (see §3) |

A scene is usually ONE of these, sometimes two (a character beside a mindmap). Never a collage.

## 2. Look

- **Palette.** Indigo `#5F4DEE` (hue 247) and cyan `#5CC8E3` (hue 192) are the brand's main colours and lead
  every frame. **Other colours are allowed, a little at a time** — Simon, 13 Oct: *"indigo dan cyan memang warna
  utama brand, tapi bukan berarti kamu tidak bisa menggunakan warna lain. Coba nextnya mulai pakai warna lain,
  sedikit sedikit. Nanti aku arahkan juga scene mana yang bisa pakai warna lain."* So: an accent colour per scene
  at most (an icon, a highlighted node, one branch of a mindmap), never a rainbow; he will also say which scenes
  can take more. Flat icons stay in soft gradients and tints of their colour (ref-01, 03). Every colour is a named
  `theme` key; no hex in scenes.
- **Ground.** The light paper `#F5F5F5`; the drifting grid where a scene needs a "board" (mindmaps, paths).
- **Type.** Plus Jakarta Sans. Labels 36 px / 700 / +2 tracking / indigo (the "Tanya juga" label). Big
  statements 100 px / 800 / −2 tracking. Body 34–48 px. Sentence case; Simon's quoted text exactly as typed.
- **Shape.** Round corners on every rectangle. Cards white, soft shadow. Pills for mindmap nodes.
- **No repeated words in points.** Simon, 13 Oct: *"minimalisir kata-kata berulang di area penjelasan atau poin
  poin. Kalau masih di area judul masih gapapa."* In bullets, cards and mindmap nodes, don't repeat the same label
  on every item (e.g. "Tugas" over each wallet's job); say it once in a title, or let the icon carry it.
- **Space.** The 108 px subtitle band and the 360×150 top-right logo zone stay empty. One focal point per frame.

## 3. Characters

- **Orang Tuntun** — the man in the grey suit with the Tuntun name badge (`public/art/vi01/orang-tuntun*.png`).
  *Berwibawa.* Cast him **only where the VO delivers an insight** — a conclusion, a principle, "yang penting…".
  Not for everyday situations. Head-to-belly framing with a fading foot when he sits beside text; full body
  when he stands in a scene. New poses come from ChatGPT (transparent PNG), kept identical in face and suit.
- **Tuntun mascot** — the existing mark (`core/TuntunMark`). **Not redrawn, no new poses** for now. It may
  MOVE: bob up and down, glide along a path, travel a mindmap's connectors.
- **Retired:** the people in blue / light-blue shirts (Orang Kerja, Orang Resign, LiatHP, the polo series)
  and the yellow office worker.
- **No other people.** Simon, 19 Oct 2026 (VI04): no generated "kamu"/viewer character and no 3D renders — the
  style doesn't fit and a second person dilutes Orang Tuntun. "You" is an icon (VI04: the amber self icon).

## 4. Motion (unchanged house rules)

Easy ease only. No pops except where asked. A transition at every scene change (CameraCut or a continuous
carry-over); **no wipes**. Dashed boxes open slowly from their centre. Things that belong together arrive
together; things that are said one after another arrive on their words.

## 4b. Icon style (Simon, 19 Oct 2026 — "lain kali, buat icon design nya seperti ini")

`refs/icon-style-isometric-line.webp`: **isometric line icons** — one even dark outline (rounded joins), white
fills, ONE accent colour on the key part (the reference uses lime; the colour per video is to confirm), pale
blue-grey on the side/shadow faces, no gradients, no shading beyond those flat faces. Made with ChatGPT image
generation (the reference attached, "background transparan png"), or drawn as SVG in code for simple shapes;
Adobe Illustrator if a set needs vector editing.

## 5. Assets — where each comes from

1. **Icons:** Iconify first (`scripts/vi/iconify.mjs`, attribution-free sets only). If nothing fits and there
   is no other source, ChatGPT.
2. **Character poses, illustrations, real-style images:** ChatGPT, always a transparent PNG; every file goes
   through `scripts/vi/cutout.py` (real alpha, trimmed, ≤ 2000 px).
3. **Real data or real companies:** a real source, tagged; never invented numbers presented as real.
4. **BGM and the logo are never touched.**
