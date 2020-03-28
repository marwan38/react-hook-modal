import React, { useState, createContext } from "react";
import produce from "immer";
import {
  IModalContext,
  IModalContainerProviderProps,
  IModalProps,
  IModalState
} from "./types";
import { ModalContainer } from "./ModalContainer";

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
export const ModalProvider: React.FC<IModalContainerProviderProps> = ({
  children
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
    const stateKey = Math.random() + Date.now();
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
          const Component = <Modal key={stateKey} />;
          draft[stateKey] = React.cloneElement(Component, {
            stateKey,
            ...props
            // onClose: function() {
            //   close();
            //   // Arguments is a javascript reserved keywords
            //   // whatever the arguments the parent passes into onClose
            //   // will be passed to the caller
            //   // eslint-disable-next-line react/prop-types
            //   return props.onClose.apply(null, arguments);
            // }
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
        <ModalContainer
          modal={modals[key]}
          key={`modal-container-modal-${i}`}
        />
      ))}
    </ModalContext.Provider>
  );
};
