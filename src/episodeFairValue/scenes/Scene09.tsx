import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SafeArea } from "../components/SafeArea";

const principles = [
  { num: "01", label: "Don't Confuse Price With Value", support: "Price Can Be Misleading" },
  { num: "02", label: "Buy Good Companies Below Fair Value", support: "Not Just Anything Cheap" },
  { num: "03", label: "Fair Value Is a Guide, Not a Promise", support: "There Is Always a Margin of Error" },
  { num: "04", label: "Understand the Reasoning Before You Buy", support: "Research First, Then Act" },
];

const ROW_STARTS = [94, 178, 333, 476];

export const Scene09: React.FC = () => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardY = interpolate(frame, [0, 20], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ruleW = interpolate(frame, [20, 35], [0, 1288], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <SafeArea>
      <div style={{
        opacity: cardOpacity,
        transform: `translateY(${cardY}px)`,
        width: 1400,
        background: "#FFFFFF",
        borderRadius: 24,
        border: "1px solid #EDEEF0",
        padding: 56,
        boxSizing: "border-box",
      }}>
        {/* Header */}
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000", textAlign: "center", marginBottom: 20 }}>
          Core Principles of Value Investing
        </div>
        <div style={{ height: 2, width: ruleW, background: "#5F4DEE", margin: "0 auto 0" }} />

        {/* Rows */}
        {principles.map((p, i) => {
          const rowOp = interpolate(frame, [ROW_STARTS[i], ROW_STARTS[i] + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const rowY = interpolate(frame, [ROW_STARTS[i], ROW_STARTS[i] + 20], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return (
            <React.Fragment key={i}>
              <div style={{ height: 1, background: "#EDEEF0", marginTop: 0 }} />
              <div style={{
                height: 140,
                display: "flex",
                alignItems: "center",
                opacity: rowOp,
                transform: `translateY(${rowY}px)`,
              }}>
                {/* Number */}
                <div style={{ width: 100, flexShrink: 0, textAlign: "center", fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 56, color: "#5F4DEE" }}>
                  {p.num}
                </div>
                {/* Separator */}
                <div style={{ width: 1, height: 72, background: "#EDEEF0", flexShrink: 0 }} />
                {/* Text */}
                <div style={{ paddingLeft: 32 }}>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 40, color: "#000000" }}>{p.label}</div>
                  <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266", marginTop: 6 }}>{p.support}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </SafeArea>
  );
};
