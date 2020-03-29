import * as React from "react";
import { withKnobs, number, select } from "@storybook/addon-knobs";
import { config, SpringConfig } from "react-spring";
import { ModalProvider, useModal, useModalState } from "../src";
import ModalRoot from "../src/components/ModalRoot";
import { Props as ModalRootProps } from "../src/components/ModalRoot";
import { Animations, Animation } from "../src/animations";
import { SelectTypeKnobValue } from "@storybook/addon-knobs/dist/components/types";

export default {
  title: "ModalRoot",
  component: ModalRoot,
  decorators: [withKnobs]
};

interface Props extends Omit<ModalRootProps, "children" | "stateKey"> {
  modalContainerAnim: Animation;
  overlaySpringConfig: SpringConfig;
}

const SampleModal: React.FC<Props & {
  stateKey: string;
}> = ({ stateKey, modalContainerAnim, overlaySpringConfig, ...rest }) => {
  const { text } = useModalState(stateKey);
  return (
    <ModalRoot
      stateKey={stateKey}
      modalContainerAnim={modalContainerAnim}
      overlaySpringConfig={overlaySpringConfig}
      {...rest}
    >
      {({ close }) => (
        <div style={{ width: 500, padding: 25 }} onClick={close}>
          {text}
        </div>
      )}
    </ModalRoot>
  );
};

const Modal: React.FC<Props> = ({
  modalContainerAnim,
  overlaySpringConfig
}) => {
  const modal = useModal(
    SampleModal,
    {
      modalContainerAnim,
      overlaySpringConfig
    },
    {
      text: "hi"
    }
  );
  const [value, setValue] = React.useState("");
  const handleChange = e => {
    const val = e.target.value;
    setValue(val);
    modal.setState(state => {
      state.text = val;
    });
  };
  return (
    <div>
      <button onClick={modal.open}>Open</button>
      <input value={value} onChange={handleChange} />
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

  const [modalAvailable, setModalAvailable] = React.useState(true);

  return (
    <ModalProvider>
      <button onClick={() => setModalAvailable(x => !x)}>remove</button>
      {modalAvailable && (
        <Modal
          key="modal-stories-1"
          modalContainerAnim={{
            ...animation,
            config: animConfig
          }}
          overlaySpringConfig={{ duration: overlayDuration }}
        />
      )}
    </ModalProvider>
  );
};
