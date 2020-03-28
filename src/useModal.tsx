import React from "react";
import { IModalProps, IModalState } from "./types";
import { useContext, useEffect, useRef } from "react";
import { ModalContext } from "./ModalProvider";

/**
 * @param modal - React.ReactNode
 * @param actions - onSubmit and onClose handlers
 */
export function useModal<T extends IModalProps>(
  modal: React.FC<T>,
  props?: Omit<T, "stateKey">,
  state: Omit<IModalState, "close"> & Partial<T> = {}
) {
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
    throw Error("Hook must be called from within the ModalProvider");
  }
  /**
   * Assign a unique key to this modal
   * store it in a ref so it doesn't change
   */
  const stateKey = useRef(String(Date.now() + Math.random()));
  const createdModal = modalContext.add(
    stateKey.current,
    modal,
    props ?? {},
    state
  );

  // Avoid memory leaks by killing modal when caller component is destroyed
  useEffect(() => createdModal.close, []);

  return createdModal;
}
