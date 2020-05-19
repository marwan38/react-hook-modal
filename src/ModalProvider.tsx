import React, { useState, createContext, useCallback } from "react";
import produce from "immer";
import { IModalContext, IModalProviderProps, IModalActions } from "./types";
import { Portal } from "./Portal";

export const ModalContext = createContext<IModalContext<any, any>>({
    add: () => ({
        open: () => void 0,
        close: () => void 0,
        setState: () => void 0,
        cleanUp: () => void 0,
        updateProps: () => void 0,
        init: () => void 0,
    }),
    modalsState: {},
});

/**
 * Root modal provider - Should sit in the app root
 * All modal state lives here
 */
export const ModalProvider: React.FC<IModalProviderProps> = ({ children }) => {
    const [modals, setModals] = useState<{
        [key: string]: {
            element: React.ReactElement;
            props: any;
            status: "opened" | "closed";
        };
    }>({});
    const [modalsState, setModalsState] = useState<{
        [key: string]: any;
    }>({});

    const add = useCallback(
        <P, S>(stateKey: string, Modal: React.FC<P>, props?: P, state?: S) => {
            /**
             * Called by the modal initializer
             * Closes the modal
             */
            const close: IModalActions<P, S>["close"] = () => {
                void setModals((modals) =>
                    produce(modals, (draft) => {
                        if (draft[stateKey]) {
                            draft[stateKey].status = "closed";
                        }
                    })
                );
            };

            /**
             * Called by the modal initializer
             * Opens the modal
             */
            const open: IModalActions<P, S>["open"] = (props) => {
                void setModals((modals) => {
                    // Create the element
                    return produce(modals, (draft) => {
                        draft[stateKey].status = "opened";
                        if (props) {
                            draft[stateKey].props = {
                                ...draft[stateKey].props,
                                ...props,
                            };
                        }
                    });
                });
            };

            /**
             * Called by the modal initializer
             * Sets the state for the modal
             */
            const setState: IModalActions<P, S>["setState"] = (
                callback: (draftState: S) => void
            ) => {
                void setModalsState((_modalsState) =>
                    produce(_modalsState, (draft) => {
                        callback(draft[stateKey]);
                    })
                );
            };

            /**
             * PRIVATE
             * Only called by useModal
             */
            const cleanUp: IModalActions<P, S>["cleanUp"] = () => {
                void setModalsState((modalsState) =>
                    produce(
                        modalsState,
                        (draftState) => void delete draftState[stateKey]
                    )
                );
            };

            /**
             * PRIVATE
             * Only called by useModal
             */
            const updateProps: IModalActions<P, S>["updateProps"] = (
                updatedProps
            ) => {
                const modal = modals[stateKey];
                if (modal !== undefined) {
                    void setModals((modals) =>
                        produce(modals, (draft) => {
                            draft[stateKey].props = {
                                ...modal.props,
                                ...updatedProps,
                            };
                        })
                    );
                }
            };

            /**
             * PRIVATE
             * Only called by useModal on init
             */
            const init = () => {
                void setModals((modals) =>
                    // Create the element
                    produce(modals, (draft) => {
                        draft[stateKey] = {
                            element: React.cloneElement(
                                // @ts-ignore 2322
                                <Modal key={stateKey} />,
                                {
                                    ...props,
                                    stateKey,
                                    close,
                                }
                            ),
                            status: "closed",
                            props,
                        };
                    })
                );
                void setModalsState((states) =>
                    produce(states, (draft) => {
                        draft[stateKey] = state ? state : {};
                    })
                );
            };

            return {
                open,
                close,
                cleanUp,
                setState,
                updateProps,
                init,
            };
        },
        []
    );

    return (
        <ModalContext.Provider
            value={{
                add,
                modalsState,
            }}
        >
            {children}
            {Object.keys(modals).map((key, i) => {
                const { element: Element, status, props } = modals[key];
                if (status === "closed") return null;
                return (
                    <Portal key={`modal-container-modal-${i}`}>
                        {React.cloneElement(Element, { ...props })}
                    </Portal>
                );
            })}
        </ModalContext.Provider>
    );
};
