import * as React from "react";
import { withKnobs, number, select } from "@storybook/addon-knobs";
import { config } from "react-spring";
import { ModalProvider, useModal, useModalState } from "../src";
import ModalRoot from "../src/components/ModalRoot";
import { Props as ModalRootProps } from "../src/components/ModalRoot";
import { Animations } from "../src/animations";
import { SelectTypeKnobValue } from "@storybook/addon-knobs/dist/components/types";

export default {
  title: "ModalRoot",
  component: ModalRoot,
  decorators: [withKnobs]
};

interface Props extends Omit<ModalRootProps, "children" | "stateKey"> {}

const SampleModal: React.FC<Props & { stateKey: string }> = ({
  stateKey,
  ...rest
}) => {
  const state = useModalState(stateKey);
  return (
    <ModalRoot stateKey={stateKey} {...rest}>
      {({ close }) => (
        <div style={{ width: 500, padding: 25 }} onClick={close}>
          I am child
        </div>
      )}
    </ModalRoot>
  );
};

const Modal: React.FC<Props> = ({
  modalContainerAnim,
  overlaySpringConfig
}) => {
  const modal = useModal(SampleModal, {
    modalContainerAnim,
    overlaySpringConfig
  });

  return (
    <div>
      <button onClick={modal.open}>Open</button>
    </div>
  );
};

export const Main = () => {
  const animation = select(
    "Animation",
    Animations as any,
    Animations[Object.keys(Animations)[0]] as SelectTypeKnobValue
  ) as any;
  const animConfig = select(
    "Config",
    config as any,
    config.default as SelectTypeKnobValue
  );
  const overlayDuration = number("Overlay anim duration", 400, {
    range: true,
    min: 200,
    max: 1000,
    step: 50
  });

  const [x, setX] = React.useState(true);

  return (
    <ModalProvider>
      <button onClick={() => setX(x => !x)}>remove</button>
      {x && (
        <Modal
          key="modal-stories-1"
          modalContainerAnim={Object.assign(animation, { config: animConfig })}
          overlaySpringConfig={{ duration: overlayDuration }}
        />
      )}
    </ModalProvider>
  );
};
