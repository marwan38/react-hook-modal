import React, { useState, createContext } from "react";
import produce from "immer";
import {
  IModalContext,
  IModalProviderProps,
  IModalProps,
  IModalState
} from "./types";
import { ModalPortal } from "./ModalContainer";

const initialModalState: IModalState = {
  isLoading: false,
  close: () => void 0
};

export const ModalContext = createContext<IModalContext>({
  add: () => ({
    open: () => void 0,
    close: () => void 0,
    setState: () => void 0
  }),
  modalsState: {}
});

/**
 * Root modal provider - Should sit in the app root
 * All modal state lives here
 */
export const ModalProvider: React.FC<IModalProviderProps> = ({
  children,
  rootElement = document.body
}) => {
  const [modals, setModals] = useState<{ [key: string]: React.ReactElement }>(
    {}
  );
  const [modalsState, setModalsState] = useState<{
    [key: string]: IModalState;
  }>({});

  const add = <T extends IModalProps>(
    Modal: React.FC<T>,
    props: Omit<T, "stateKey">
  ) => {
    const stateKey = String(Math.random() + Date.now());
    /**
     * Called by the modal initializer
     * Closes the modal
     */
    const close = () => {
      // Remove state for modal
      // Do it in the next frame to make sure the component is gone
      // before removing the state
      requestAnimationFrame(
        () =>
          void setModalsState(modalsState =>
            produce(modalsState, draftState => void delete draftState[stateKey])
          )
      );
      void setModals(modals =>
        produce(modals, draft => {
          delete draft[stateKey];
        })
      );
    };

    /**
     * Called by the modal initializer
     * Opens the modal
     */
    const open = () =>
      void setModals(modals => {
        // Initialize state for modal
        setModalsState(modalsState =>
          produce(modalsState, draftState => {
            draftState[stateKey] = {
              ...initialModalState,
              close
            };
          })
        );
        // Create the element
        return produce(modals, draft => {
          // @ts-ignore 2322
          draft[stateKey] = React.cloneElement(<Modal key={stateKey} />, {
            stateKey,
            close,
            ...props
          });

          React.Children.forEach(draft[stateKey].props.children, console.log);
        });
      });

    /**
     * Called by the modal initializer
     * Sets the state for the modal
     */
    const setState = <K extends keyof IModalState, V extends IModalState[K]>(
      key: K,
      value: V
    ) =>
      void setModalsState(modalsState =>
        produce(modalsState, draftStates => {
          draftStates[stateKey][key] = value;
        })
      );

    return {
      open,
      close,
      setState
    };
  };

  return (
    <ModalContext.Provider
      value={{
        add,
        modalsState
      }}
    >
      {children}
      {Object.keys(modals).map((key, i) => (
        <ModalPortal
          modal={modals[key]}
          key={`modal-container-modal-${i}`}
          rootElement={rootElement}
        />
      ))}
    </ModalContext.Provider>
  );
};
