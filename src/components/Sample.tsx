import * as React from "react";
import "./ModalRoot.scss";
import { useModal, ModalProvider } from "../";
import ModalRoot from "./ModalRoot";
import { IModalProps } from "../types";
import { Animations } from "../animations";

interface Props extends IModalProps {}

const SampleModal: React.FC<Props> = ({ stateKey }) => {
  return (
    <ModalRoot stateKey={stateKey} modalContainerAnim={Animations.SLIDE_IN_TOP}>
      {({ close }) => (
        <div style={{ width: 500, padding: 25 }} onClick={close}>
          I am child
        </div>
      )}
    </ModalRoot>
  );
};

const Sample: React.FC = () => {
  const modal = useModal(SampleModal);

  return (
    <div id="modal__root">
      <button onClick={modal.open}>Open</button>
    </div>
  );
};

export default () => (
  <ModalProvider>
    <Sample />
  </ModalProvider>
);
