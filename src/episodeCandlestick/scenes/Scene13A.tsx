/**
 * Scene13A — from 7773, duration 242 (8.07s).
 * PatternTabRow standalone (no panels, silver bg). Two families resolve as
 * `done`; the two new families resolve at full weight (`pending`) with an
 * indigoTint wash; the header rule then draws across. Parks the tab row exactly
 * where SC13B needs it.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { PatternTabRow, type PatternTab } from "../components/PatternTabRow";
import { IllustrationTag } from "../components/IllustrationTag";
import { theme } from "../theme";
import { sec, textReveal, progress } from "../helpers";

const T = { title: 0.0, tab1: 1.0, chk1: 1.3, tab2: 1.8, chk2: 2.1, tab3: 3.4, tab4: 4.2, rule: 5.6 };

export const Scene13A = () => {
  const f = useCurrentFrame();
  const title = textReveal(f, sec(T.title));

  const tabs: PatternTab[] = [
    { label: "Engulfing", state: "done", labelReveal: textReveal(f, sec(T.tab1)), checkPop: progress(f, sec(T.chk1), 9) },
    { label: "Hammer &\nShooting Star", state: "done", labelReveal: textReveal(f, sec(T.tab2)), checkPop: progress(f, sec(T.chk2), 9) },
    { label: "Morning &\nEvening Star", state: "pending", labelReveal: textReveal(f, sec(T.tab3)), wash: progress(f, sec(T.tab3), sec(0.5)) },
    { label: "Soldiers &\nCrows", state: "pending", labelReveal: textReveal(f, sec(T.tab4)), wash: progress(f, sec(T.tab4), sec(0.5)) },
  ];

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: 194,
          top: 58,
          fontFamily: theme.type.family,
          fontSize: 36,
          fontWeight: 600,
          color: theme.colors.indigo,
          opacity: title.opacity,
          transform: `translateY(${title.y}px)`,
        }}
      >
        Two More Worth Knowing
      </div>
      <PatternTabRow tabs={tabs} ruleDraw={f >= sec(T.rule) ? progress(f, sec(T.rule), sec(0.8)) : 0} />
      <IllustrationTag />
    </SafeArea>
  );
};
