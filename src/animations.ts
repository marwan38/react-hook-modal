import { CSSProperties } from "react";
import { UseTransitionProps } from "react-spring";

export type SpringAnimType = UseTransitionProps<boolean, CSSProperties>;

const MODAL_SLIDE_IN_TOP: SpringAnimType = {
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

const MODAL_FADE: SpringAnimType = {
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
  MODAL_SLIDE_IN_TOP,
  MODAL_FADE
};

type AnimationKeys = keyof typeof Animations;
export type Animation = typeof Animations[AnimationKeys];
