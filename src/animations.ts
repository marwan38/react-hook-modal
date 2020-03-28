export const SLIDE_IN_TOP = {
  from: {
    opacity: 0,
    transform: "translate3d(-50%, -999%, 0)"
  },
  enter: {
    opacity: 1,
    transform: "translate3d(-50%, -50%, 0)"
  },
  leave: {
    opacity: 0,
    transform: "translate3d(-50%, -999%, 0)"
  }
};

export const FADE = {
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
