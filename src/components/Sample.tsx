import * as React from "react";
import "./ModalRoot.scss";
import { useModal, useModalState, ModalProvider } from "../";
import ModalRoot from "./ModalRoot";
import { IModalProps } from "../types";
import { SLIDE_IN_TOP } from "../animations";

interface Props {}

const SampleModal: React.FC<IModalProps> = ({ stateKey }) => {
  return (
    <ModalRoot stateKey={stateKey} modalContainerAnim={SLIDE_IN_TOP}>
      {({ close }) => <div onClick={close}>I am child</div>}
    </ModalRoot>
  );
};

const Sample: React.FunctionComponent<Props> = () => {
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
