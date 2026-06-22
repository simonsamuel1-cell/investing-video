# Open items

Carried from the build spec + global revision. Review before publishing.

1. **S4 "leaves/tree" + S29 "currents"** — the VO references metaphors the visuals
   intentionally avoid (S4 = literal stock-vs-theme line split; S29 = straight
   geometric arrows, not flowing water). Re-voice those two lines or accept the gap.

2. **S30 (17s, no internal pause)** — verify the recap montage holds attention
   across the full 515-frame stretch (`src/components/RecapMontage.tsx`). Biggest
   sync/pacing risk; tune cadence + Ken-Burns drift in Studio.

3. **S26 MA5 + disclaimer wording** — confirm the "earliest bullish signal" framing
   (`src/scenes/Scene26.tsx`) and the disclaimer copy "Educational, not investment
   advice." (`src/components/DisclaimerChip.tsx`) against Tuntun/OJK compliance.

4. **Mid-flow scenes** (6, 8, 16, 19, 23, 25, 26, 30) — transitions land mid-speech,
   not on a pause; they animate continuously. Re-check each against the VO in Studio.

5. **Tune in `remotion studio`:**
   - Highlight-box pixel coords over the phone: `TODO(studio)` constants atop
     S12 / S19 / S21 / S24 / S26 — the `PhoneFrame` screen cutout is inset, so boxes
     need re-aligning to the real UI regions (cutout ≈ x125–504 at the B-side size).
   - `PhoneFrame` `scale`/`translate` tuning lives in `src/components/PhoneFrame.tsx`
     (currently scale 1.05) — confirm the bezel hugs the recording on every scene.

## Build-specific notes

- **Screen-only assets framed deliberately:** `Scene_16_-_Tab_1/2/3.jpg` and
  `Scene_22_-_*.jpg` are 1080×2340 *screen-only* captures (NOT pre-framed like
  `Concept_Sector_1/2.png`). They are wrapped in `<PhoneFrame>` so they read as
  black-bezel phones matching the references. If true pre-framed versions arrive,
  switch them to flat `<Img>` per GR1.
- **PhoneFrame compositing:** `Placeholder-02.png`'s screen area is opaque white
  (not a transparent cutout), so the frame PNG is rendered UNDER the recording
  (recording clipped on top); the white letterbox comes from the PNG's own screen.
- **Frame consistency:** S11 uses pre-framed PNGs (flat); S12–S28 use `<PhoneFrame>`
  (Placeholder-02). The old purple `<DeviceFrame>` is no longer used by any scene.
- **S32 logo** is a text "Tuntun" placeholder — drop the real logo into `public/`
  and swap it into `src/scenes/Scene32.tsx`.
