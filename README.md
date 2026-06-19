# Concept Sector — Tuntun educational explainer (Remotion)

A 3:50 (230.064s) **landscape 1920×1080 @ 30fps** infographic-led explainer for the
Tuntun investing app's *Concept Sector* feature. Infographic teaching layer +
embedded real app screen-recordings shown as phone device-mockups.

- **Composition:** `ConceptSectorTutorial` — 1920×1080, 30fps, **6902 frames**.
- **Audio is the master clock:** the VO is mounted once at frame 0; the 32 scenes
  are positioned by the frame-exact timeline in [`src/timeline.ts`](src/timeline.ts).

## Run

```bash
npm i
npx remotion studio                 # preview + tune callout coordinates
npx remotion render ConceptSectorTutorial out/video.mp4
```

Sanity-check a single frame without a full render:

```bash
npx remotion still ConceptSectorTutorial out/frame.png --frame=2200 --scale=0.5
```

## Structure

- `src/theme.ts` — all brand tokens (colors, tint ramp, radii, margins, logo
  reserve) + build flags. **No hardcoded colors live anywhere else.**
- `src/fonts.ts` — Plus Jakarta Sans (the only typeface), embedded at render.
- `src/timeline.ts` — the frame-exact §6 scene table (`from`/`dur`) + asset names.
- `src/Video.tsx` — mounts the VO once + 32 `<Sequence>` blocks.
- `src/Root.tsx` — registers the single composition.
- `src/components/` — `SafeArea`, `SceneWrap`, `DeviceFrame` (+ `PhoneClip`/
  `PhoneStill`), `Callout`, `Chip`, `Card`, `TextCard`, `Heading`, `DisclaimerChip`,
  `ThemeStocksDiagram` (S6–9), `TickerGrid` (S1–2), `RecapMontage` (S30).
- `src/scenes/Scene01..Scene32.tsx` — one file per scene.

## Build flags (`src/theme.ts`)

- `MOUNT_VO` (default **true**) — mounts the VO as the master clock. Set **false**
  to export a silent program when the voiceover is mixed in post (Premiere).
- `DEV_GUIDES` (default **false**) — overlays margin / logo-reserve / right-zone
  guides in Studio for tuning callout coordinates. Keep off for final output.

## Brand / layout guardrails (enforced in code)

- Bright silver background `#EDEEF0`; black body copy; accents purple `#5F4DEE`
  and cyan `#5CC8E3` for **visuals only**. Green/red appear only inside the real
  screen recordings, never in the infographic layer.
- `SafeArea` clips all content to the 1728×918 usable box (nothing in the side/top
  margins or the bottom 108px subtitle zone) and masks the top-right 360×150 logo
  reserve in every scene except S32.
- Phone captures (980×1920) are letterboxed inside a 449×880 frame — never
  stretched or cropped.

## Tuning callouts

Callout highlight boxes over the phone depend on the rendered clip. Each Layout-B
scene declares its boxes as labelled `TODO(studio)` constants at the top of the
file with rough guesses — open `remotion studio`, set `DEV_GUIDES = true`, and nudge
them to the real UI regions.

See [`TODO.md`](TODO.md) for open items carried from the build spec.
