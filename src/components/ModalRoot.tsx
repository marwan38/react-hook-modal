import * as React from "react";
import {
  useSpring,
  animated,
  useTransition,
  UseTransitionProps
} from "react-spring";
import "./ModalRoot.scss";
import { useModalState } from "../useModalState";
import { IModalProps } from "../types";
import { Animations, Animation } from "../animations";

interface ModalRootChildProps {
  close: () => void;
}

interface Props extends Partial<IModalProps> {
  modalContainerAnim?: Animation;
  children: ((args: ModalRootChildProps) => React.ReactNode) | React.ReactNode;
}

const ModalRoot: React.FunctionComponent<Props> = ({
  children,
  stateKey,
  modalContainerAnim = Animations.FADE
}) => {
  const { close } = useModalState(stateKey as string);

  /** Used for animation */
  const justInitialized = React.useRef(true);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    setVisible(true);
    justInitialized.current = false;
  }, []);

  function toggleClose() {
    setVisible(false);
  }

  const fadeAnimation = useSpring({
    opacity: visible ? 0.75 : 0,
    onRest: () => {
      if (justInitialized.current === false && visible === false) {
        close();
      }
    }
  });

  const _modalContainerAnim = useTransition(visible, null, modalContainerAnim);

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
