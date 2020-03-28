import * as React from "react";

import ModalRoot from "../src/components/ModalRoot";
import { useModal, useModalState, IModalProps, ModalProvider } from "../src";

export const SampleModal: React.FC<IModalProps> = ({ stateKey, ...rest }) => {
  const { close } = useModalState(stateKey);
  return (
    <ModalRoot stateKey={stateKey} {...rest}>
      <div style={{ width: 500, padding: 25 }} onClick={close}>
        I am child
      </div>
    </ModalRoot>
  );
};

export const StubModal: React.FC<{ modalTemplate?: React.FC }> = ({
  modalTemplate = SampleModal
}) => {
  const modal = useModal(modalTemplate);
  return (
    <div>
      <button onClick={modal.open}>Open</button>
    </div>
  );
};

export const tree = (
  <ModalProvider>
    <StubModal />
  </ModalProvider>
);
