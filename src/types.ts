import React from "react";
export interface IModalProps {
  // onClose: (args?: { success: boolean; data?: any }) => void;
  /** Unique key generated by the context. Used to fetch state from within the modal */
  stateKey: string;
}
export interface IModalState {
  isLoading: boolean;
  close: () => void;
}

export interface IModalContext {
  /** Adds a modal component into the Modal Context */
  add: (
    modal: React.FC<any>,
    actions: Omit<IModalProps, "stateKey" | "onClose">
  ) => {
    open: () => void;
    close: () => void;
    setState: <K extends keyof IModalState, V extends IModalState[K]>(
      key: K,
      value: V
    ) => void;
  };
  modalsState: { [key: string]: IModalState };
}

export interface IModalProviderProps {
  children: React.ReactNode;
  /** The portals root element */
  rootElement?: Element;
}
export interface IModalPortalProps
  extends Required<Pick<IModalProviderProps, "rootElement">> {
  modal: React.ReactElement;
}
