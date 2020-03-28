import { useContext } from "react";
import { ModalContext } from "./ModalProvider";

/**
 * Used by the modals to access their state
 * @param key - The modal components key
 */
export function useModalState(key: string) {
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
    throw Error("Hook must be called from within the ModalProvider");
  }
  return modalContext.modalsState[key];
}
