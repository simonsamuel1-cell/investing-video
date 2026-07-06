/**
 * QuestionCards — Three-questions group, Scenes 6–7 (comp 1082–1864), mounted
 * once. Owns the three numbered QuestionCards: created (empty) in Scene 6,
 * filled one at a time in Scene 7 (EPS before/after · Timeline · NodeCluster).
 * Scenes 6/7 add their text beats. Frame here = group-local (0 at comp 1082).
 *   Scene 6: from 1082 dur 259   Scene 7: from 1354 dur 510
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SafeArea, QuestionCard, Timeline, NodeCluster, Illustration } from "../components";
import { theme } from "../theme";
import { clamp01 } from "../helpers";
import { Scene06 } from "../scenes/Scene06";
import { Scene07 } from "../scenes/Scene07";

const c = theme.colors;
const CARD_W = 540;
const CARD_H = 460;
const CARD_Y = 320;
const X = [96, 690, 1284];

// creation onsets (Scene 6): @4.0 / 5.2 / 6.4s
const MADE = [Math.round(4.0 * 30), Math.round(5.2 * 30), Math.round(6.4 * 30)];
// fill onsets (Scene 7 offset 272): @0.5 / 5.5 / 10.5s
const FILL = [272 + Math.round(0.5 * 30), 272 + Math.round(5.5 * 30), 272 + Math.round(10.5 * 30)];

const EpsFill = ({ frame, start }: { frame: number; start: number }) => {
  const op = clamp01((frame - start) / 16);
  return (
    <svg width={220} height={150} viewBox="0 0 220 150">
      <text x={0} y={20} fontSize={18} fontWeight={700} fill={c.grey} fontFamily={theme.font.family}>EPS</text>
      <rect x={20} y={140 - 70 * 0.55 * op} width={54} height={70 * 0.55 * op} rx={4} fill={c.greyLight} />
      <text x={47} y={148} fontSize={15} textAnchor="middle" fill={c.grey} fontFamily={theme.font.family}>Before</text>
      <rect x={110} y={140 - 70 * 0.9 * op} width={54} height={70 * 0.9 * op} rx={4} fill={c.indigo} />
      <text x={137} y={148} fontSize={15} textAnchor="middle" fill={c.grey} fontFamily={theme.font.family}>After</text>
      <text x={190} y={70} fontSize={44} fontWeight={800} fill={c.indigo} fontFamily={theme.font.family} opacity={op}>?</text>
    </svg>
  );
};

export const QuestionCards = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <QuestionCard x={X[0]} y={CARD_Y} w={CARD_W} h={CARD_H} index={1} prompt="Did the number beat?" frame={f} cardStart={MADE[0]} fillStart={FILL[0]}>
        <EpsFill frame={f} start={FILL[0]} />
      </QuestionCard>

      <QuestionCard x={X[1]} y={CARD_Y} w={CARD_W} h={CARD_H} index={2} prompt="For how long?" frame={f} cardStart={MADE[1]} fillStart={FILL[1]}>
        <Timeline x={0} y={40} w={CARD_W - 60} frame={f} drawStart={FILL[1]} />
      </QuestionCard>

      <QuestionCard x={X[2]} y={CARD_Y} w={CARD_W} h={CARD_H} index={3} prompt="Who else is affected?" frame={f} cardStart={MADE[2]} fillStart={FILL[2]}>
        <NodeCluster x={0} y={0} w={CARD_W - 56} h={CARD_H - 130} frame={f} companyStart={FILL[2]} spreadStart={FILL[2] + 26} />
      </QuestionCard>

      <Illustration op={clamp01((f - FILL[0]) / 16)} />

      <Sequence durationInFrames={259} layout="none"><Scene06 /></Sequence>
      <Sequence from={272} durationInFrames={510} layout="none"><Scene07 /></Sequence>
    </SafeArea>
  );
};
