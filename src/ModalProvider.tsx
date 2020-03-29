import React, { useState, createContext, useCallback } from "react";
import produce from "immer";
import { IModalContext, IModalProviderProps } from "./types";
import { ModalPortal } from "./ModalContainer";

export const ModalContext = createContext<IModalContext<any, any>>({
  add: () => ({
    open: () => void 0,
    close: () => void 0,
    setState: () => void 0,
    cleanUp: () => void 0
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
    [key: string]: any;
  }>({});

  const add = useCallback(
    <P, S>(stateKey: string, Modal: React.FC<P>, props?: P, state?: S) => {
      /**F
       * Called by the modal initializer
       * Closes the modal
       */
      const close = () => {
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
      const open = () => {
        void setModals(modals => {
          // Create the element
          return produce(modals, draft => {
            draft[stateKey] = React.cloneElement(
              // @ts-ignore 2322
              <Modal key={stateKey} />,
              {
                stateKey,
                close,
                ...props
              }
            );
          });
        });
      };

      /**
       * Called by the modal initializer
       * Sets the state for the modal
       */
      const setState = (callback: (draftState: S) => void) => {
        void setModalsState(_modalsState =>
          produce(_modalsState, draft => {
            callback(draft[stateKey]);
          })
        );
      };

      const cleanUp = () => {
        void setModalsState(modalsState =>
          produce(modalsState, draftState => void delete draftState[stateKey])
        );
      };

      // Initalize state
      if (!modalsState.hasOwnProperty(stateKey)) {
        setModalsState(states =>
          produce(states, draft => {
            draft[stateKey] = state ?? {};
          })
        );
      }

      return {
        open,
        close,
        cleanUp,
        setState
      };
    },
    [modalsState]
  );

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
