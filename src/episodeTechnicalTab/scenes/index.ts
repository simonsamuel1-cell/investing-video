import { Scene01 } from "./Scene01";
import { Scene02 } from "./Scene02";
import { Scene10 } from "./Scene10";

// Scenes 3–9 are ONE continuous held-phone shot (PhoneWalkthrough), mounted as a
// single Sequence in Video.tsx. Only the native scenes (1, 2, 10) are keyed by
// scene number here.
export const INDEPENDENT: Record<number, React.FC> = {
  1: Scene01,
  2: Scene02,
  10: Scene10,
};

export { PhoneWalkthrough } from "./PhoneWalkthrough";
