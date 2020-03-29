import React, { useState, useContext, useEffect, useRef } from "react";
import { IModalContext } from "./types";
import { ModalContext } from "./ModalProvider";

/**
 * @param modal - React.ReactNode
 * @param actions - onSubmit and onClose handlers
 */
export function useModal<P, S>(
  modal: React.FC<P>,
  props?: P,
  state?: S
) {
  const modalContext: IModalContext<P, S> = useContext(ModalContext);
  if (!modalContext) {
    throw Error("Hook must be called from within the ModalProvider");
  }
  /**
   * Assign a unique key to this modal
   * store it in a ref so it doesn't change
   */
  const stateKey = useRef(String(Date.now() + Math.random()));
  const [createdModal] = useState(() =>
    modalContext.add(stateKey.current, modal, props, state)
  );

  // Avoid memory leaks by killing modal when caller component is destroyed
  useEffect(
    () => () => {
      createdModal.close();
      createdModal.cleanUp();
    },
    []
  );

  return createdModal;
}
