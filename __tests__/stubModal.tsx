import * as React from "react";

import ModalRoot from "../src/components/ModalRoot";
import { useModal, useModalState, IModalProps, ModalProvider } from "../src";

export const StubModal: React.FC<IModalProps & any> = ({
  stateKey,
  text = "I am child",
  ...rest
}) => {
  const { close } = useModalState(stateKey);
  return (
    <ModalRoot stateKey={stateKey} {...rest}>
      <div style={{ width: 500, padding: 25 }} onClick={close}>
        {text}
      </div>
    </ModalRoot>
  );
};

export const StubModalLauncher: React.FC<{ modalTemplate?: React.FC }> = ({
  modalTemplate = StubModal
}) => {
  const modal = useModal(modalTemplate);
  return (
    <div>
      <button onClick={modal.open}>Open</button>
    </div>
  );
};

export const withProvider = element => <ModalProvider>{element}</ModalProvider>;

export const tree = withProvider(<StubModalLauncher />);
