import { IModalProps } from "./types";
import { useContext, useEffect } from "react";
import { ModalContext } from "./ModalProvider";

/**
 * @param modal - React.ReactNode
 * @param actions - onSubmit and onClose handlers
 */
export function useModal<T extends IModalProps>(
  modal: React.FC<T>,
  props?: Omit<T, "stateKey">
) {
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
      throw Error('Hook must be called from within the ModalProvider');
  }
  const createdModal = modalContext.add(modal, props ?? {});

  // Avoid memory leaks by killing modal when caller component is destroyed
  useEffect(() => createdModal.close, []);

  return createdModal;
}
