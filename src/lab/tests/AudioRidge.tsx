/**
 * lab/tests/AudioRidge.tsx — TEST 04 · audio-reactive.
 *
 * ⚠ THE PICTURE IS THE RECORDING. Nothing here is keyframed and nothing here
 * is noise: every point on the ridge is a measured amplitude from
 * public/vo/ta-mistakes.mp3, read at this frame. The shape cannot drift off
 * the voice because it IS the voice.
 *
 * ⚠ A MOVING WINDOW, NOT A BAR CHART. `visualizeAudioWaveform` returns the
 * samples around the CURRENT frame, so the ridge scrolls through the recording
 * like a tape passing a head — the present is always the centre line. A static
 * spectrum would say nothing about where in a sentence we are; this says it
 * without a word.
 *
 * ⚠ AND THE SILENCES ARE VISIBLE. The flat stretches are the pauses the sync
 * document already marks as holds. Driven from here, "hold while the voice is
 * quiet" stops being a frame number somebody has to maintain and becomes a
 * measurement.
 *
 * ⚠ `useWindowedAudioData`, NOT `useAudioData`. The whole file is four and a
 * half minutes; the windowed reader fetches only the span being drawn, so the
 * Studio does not decode the entire VO on every scrub.
 */
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { createSmoothSvgPath, useWindowedAudioData, visualizeAudioWaveform } from "@remotion/media-utils";
import { Line, Stage, theme, usePalette } from "../../core";

/**
 * ⚠ THE BENCH DOES NOT IMPORT AN EPISODE. The first version pulled CUES in to
 * print the sentence being spoken, and the audit was right to reject it: a lab
 * that depends on 022 cannot be used to judge anything for 021. The ridge
 * demonstrates the technique on its own; the words belong to the scene that
 * ends up using it.
 */
const SRC = "vo/ta-mistakes.mp3";

const BOX = theme.stage.card;
/** Seconds of recording on screen at once. */
const WINDOW = 2.4;
const SAMPLES = 160;
/**
 * ⚠ SPEECH IS QUIET IN THE RAW. visualizeAudioWaveform returns SIGNED samples
 * and this recording peaks around 0.1 — drawn at face value the ridge was a
 * hairline, and because the values alternate sign the "mirror" was really two
 * copies of the same oscillation. Taking the magnitude turns it into an
 * envelope; the gain brings that envelope up to a readable height.
 *
 * ⚠ FIXED, NOT AUTO-SCALED. Normalising each window to its own maximum would
 * make a pause look as loud as a sentence, which destroys the one thing this
 * picture is for.
 */
const GAIN = 7;

export const AudioRidgeTest = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = usePalette();

  const { audioData } = useWindowedAudioData({
    src: staticFile(SRC),
    frame: f,
    fps,
    windowInSeconds: 10,
  });

  if (!audioData) {
    return (
      <Stage>
        <AbsoluteFill />
      </Stage>
    );
  }

  const amps = visualizeAudioWaveform({
    audioData,
    frame: f,
    fps,
    numberOfSamples: SAMPLES,
    windowInSeconds: WINDOW,
  });

  const mid = BOX.y + BOX.h * 0.46;
  const reach = BOX.h * 0.34;
  const step = BOX.w / (SAMPLES - 1);

  /* magnitude, then a short moving average — an envelope, not a trace */
  const raw = amps.map((a) => Math.abs(a));
  const env = raw.map((_, i) => {
    let sum = 0;
    let n = 0;
    for (let k = -2; k <= 2; k++) {
      const j = i + k;
      if (j >= 0 && j < raw.length) {
        sum += raw[j];
        n++;
      }
    }
    return Math.min(1, (sum / n) * GAIN);
  });

  const top = env.map((a, i) => ({ x: BOX.x + i * step, y: mid - a * reach }));
  const bot = [...env].reverse().map((a, i) => ({
    x: BOX.x + (SAMPLES - 1 - i) * step,
    y: mid + a * reach,
  }));

  /* ⚠ ONE CLOSED SHAPE, NOT TWO LINES. Stroked separately the ridge reads as
     an oscilloscope; filled as a single body it reads as a thing with mass —
     and mass is what makes a pause look like a pause. */
  const d = `${createSmoothSvgPath({ points: top })}L${createSmoothSvgPath({
    points: bot,
  }).slice(1)}Z`;

  /** The instantaneous level, straight off the centre of the window. */
  const now = env[Math.floor(SAMPLES / 2)];

  return (
    <Stage>
      <AbsoluteFill>
        <svg width={theme.canvas.width} height={theme.canvas.height}>
          <defs>
            <linearGradient id="lab-ridge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={c.cyan} stopOpacity={0.25} />
              <stop offset="50%" stopColor={c.indigo} stopOpacity={0.85} />
              <stop offset="100%" stopColor={c.cyan} stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <path d={d} fill="url(#lab-ridge)" />
          {/* the present moment, always dead centre */}
          <line
            x1={BOX.x + BOX.w / 2}
            y1={BOX.y + 20}
            x2={BOX.x + BOX.w / 2}
            y2={BOX.y + BOX.h - 20}
            stroke={c.ink}
            strokeWidth={theme.shape.rule}
          />
          {/* ⚠ SCALE DRIVEN BY THE LEVEL, NOT BY A CURVE. It is loudest on a
              stressed syllable because the speaker was. */}
          <circle
            cx={BOX.x + BOX.w / 2}
            cy={mid}
            r={10 + now * 54}
            fill={c.indigo}
            opacity={0.25 + now * 0.6}
          />
        </svg>
      </AbsoluteFill>

      <Line
        text={`${(f / fps).toFixed(2)}s · level ${now.toFixed(3)}`}
        x={BOX.x}
        y={BOX.y + 24}
        at={0}
        anchor="left"
        size={theme.text.axis.size}
        weight={theme.text.axis.weight}
        color={c.muted}
      />
    </Stage>
  );
};
