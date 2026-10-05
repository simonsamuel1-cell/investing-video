/**
 * SCENE TRANSISI — TA09's roadmap, ridden over each chapter cut.
 *
 * The outgoing scene's last still frame shrinks into its own card on the board
 * (core `shrinkClip`), the other cards open over the drifting grid, the next
 * chapter's card lights, the camera pushes into it (core `cardPush`), and the
 * board fades off the next scene, which has been running underneath since the
 * cut. Earlier chapters show their own last frames in their cards.
 *
 * ⚠ MOUNTED BARE, NOT IN A <Sequence>: it reads the GLOBAL frame, so a
 * `<Freeze frame={n}>` around a scene's own Sequence shows that scene exactly
 * as it was on global frame n.
 */
import React from "react";
import { Freeze, Sequence, useCurrentFrame } from "remotion";
import {
  GridGround,
  ROADMAP_CARD,
  ROADMAP_SLOTS,
  RoadmapCards,
  cardPush,
  progress,
  progressInOut,
  shrinkClip,
  theme,
  usePalette,
} from "../../../core";
import {
  MAP_LABELS,
  TRANS_FADE,
  TRANS_GLOW,
  TRANS_PUSH,
  TRANS_SHRINK,
  type Trans,
} from "../data/timing";
import { OUTSIDE_RESERVES } from "../components/kit";

export type Mount = { from: number; duration: number; Component: React.FC };

/** A scene as it was on GLOBAL frame `g`, full frame. */
const SceneAt = ({ g, scenes }: { g: number; scenes: Mount[] }) => {
  const s = scenes.find((x) => g >= x.from && g < x.from + x.duration);
  if (!s) return null;
  return (
    <Freeze frame={g}>
      <Sequence from={s.from} durationInFrames={s.duration} showInTimeline={false}>
        <s.Component />
      </Sequence>
    </Freeze>
  );
};

/** A full-frame picture scaled into card `n`'s slot. */
const InCard = ({ n, children }: { n: number; children: React.ReactNode }) => {
  const slot = ROADMAP_SLOTS[n];
  const k = ROADMAP_CARD.w / theme.canvas.width;
  return (
    <div
      style={{
        position: "absolute",
        left: slot.x,
        top: slot.y + (ROADMAP_CARD.h - theme.canvas.height * k) / 2,
        width: theme.canvas.width,
        height: theme.canvas.height,
        transform: `scale(${k})`,
        transformOrigin: "0 0",
      }}
    >
      {children}
    </div>
  );
};

export const SceneTransisi = ({ t, scenes }: { t: Trans; scenes: Mount[] }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const end = t.at + TRANS_SHRINK + 70 + TRANS_FADE;
  if (f < t.at || f >= end) return null;

  const map = progressInOut(f, t.at, TRANS_SHRINK);
  const glowAt = t.at + TRANS_SHRINK - 4;
  const pushAt = glowAt + TRANS_GLOW - 4;
  const push = progressInOut(f, pushAt, TRANS_PUSH.over);
  const fade = progress(f, pushAt + TRANS_PUSH.over - TRANS_FADE / 2, TRANS_FADE);

  /* The landing card's picture: the frozen frame, scaled from full frame into
     its slot, clipped on an OUTER element (core/Roadmap's warning). */
  const slot = ROADMAP_SLOTS[t.landing];
  const k = 1 + (ROADMAP_CARD.w / theme.canvas.width - 1) * map;
  const topOff = (ROADMAP_CARD.h - theme.canvas.height * (ROADMAP_CARD.w / theme.canvas.width)) / 2;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - fade }}>
      <div style={{ position: "absolute", inset: 0, ...cardPush(push, t.next, TRANS_PUSH.amount) }}>
        {/* vignetted and stopped at the caption band, so both reserves stay clear */}
        <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
          <GridGround f={f} opacity={map} paper={c.bg} />
        </div>
        <RoadmapCards
          labels={MAP_LABELS}
          reveal={map}
          landing={t.landing}
          cardsAt={t.cards}
          cardDur={22}
          glow={{ card: t.next, at: glowAt, over: TRANS_GLOW }}
          contents={t.thumbs.map((g, n) =>
            g === null ? null : (
              <InCard key={n} n={n}>
                <SceneAt g={g} scenes={scenes} />
              </InCard>
            ),
          )}
        />
        <div style={{ position: "absolute", inset: 0, clipPath: shrinkClip(map, t.landing) }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${(slot.x * map).toFixed(2)}px, ${((slot.y + topOff) * map).toFixed(2)}px) scale(${k.toFixed(5)})`,
              transformOrigin: "0 0",
            }}
          >
            <SceneAt g={t.freeze} scenes={scenes} />
          </div>
        </div>
      </div>
    </div>
  );
};
