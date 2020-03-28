import { CSSProperties } from "react";
import { UseTransitionProps } from "react-spring";

type SpringAnimType = UseTransitionProps<boolean, CSSProperties>;

const SLIDE_IN_TOP: SpringAnimType = {
  from: {
    opacity: 0,
    transform: "translate3d(-50%, -200%, 0)"
  },
  enter: {
    opacity: 1,
    transform: "translate3d(-50%, -50%, 0)"
  },
  leave: {
    opacity: 0,
    transform: "translate3d(-50%, -200%, 0)"
  }
};

const FADE: SpringAnimType = {
  from: {
    opacity: 0,
    position: "absolute"
  },
  enter: {
    opacity: 1
  },
  leave: {
    opacity: 0
  }
};

export const Animations = {
  SLIDE_IN_TOP,
  FADE
};

type AnimationKeys = keyof typeof Animations;
export type Animation = typeof Animations[AnimationKeys];
