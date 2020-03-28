import * as React from "react";
import {
  useSpring,
  animated,
  useTransition,
  useChain,
  config,
  SpringConfig
} from "react-spring";
import "./ModalRoot.scss";
import { useModalState } from "../useModalState";
import { IModalProps } from "../types";
import { Animations, Animation } from "../animations";

import "./ModalRoot";

interface ModalRootChildProps {
  close: () => void;
}

export interface Props extends IModalProps {
  modalContainerAnim?: Animation;
  overlaySpringConfig?: SpringConfig;
  children: ((args: ModalRootChildProps) => React.ReactNode) | React.ReactNode;
}

const ModalRoot: React.FunctionComponent<Props> = ({
  children,
  stateKey,
  overlaySpringConfig = config.default,
  modalContainerAnim = Animations.MODAL_FADE
}) => {
  const { close } = useModalState(stateKey as string);

  /** Used for animation initialization */
  const justInitialized = React.useRef(true);
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    justInitialized.current = false;
  }, []);

  function toggleClose() {
    setVisible(false);
  }

  /** The root container/overlay animation */
  const containerRef = React.useRef<any>();
  const fadeAnimation = useSpring({
    from: {
      opacity: 0
    },
    opacity: visible ? 0.75 : 0,
    ref: containerRef,
    onRest: () => {
      if (justInitialized.current === false && visible === false) {
        close();
      }
    },
    config: overlaySpringConfig
  });

  /** Modal container animation */
  const modalRef = React.useRef();
  const _modalContainerAnim = useTransition(
    visible,
    null,
    Object.assign(modalContainerAnim, { ref: modalRef })
  );

  useChain(visible ? [containerRef, modalRef] : [modalRef, containerRef]);

  return (
    <div id="modal__root">
      <animated.div
        style={fadeAnimation}
        className="overlay"
        onClick={toggleClose}
      />
      {_modalContainerAnim.map(
        ({ key, item, props }) =>
          item && (
            <animated.div key={key} style={props} className="--container">
              {typeof children === "function"
                // @ts-ignore
                ? children({ close: toggleClose }) 
                : children}
            </animated.div>
          )
      )}
      ))
    </div>
  );
};

export default ModalRoot;
