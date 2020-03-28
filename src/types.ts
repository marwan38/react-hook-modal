import React from 'react';
export interface IModalProps {
    /** Closes the modal. Passed down by the provider */
    close?: () => void;
    /** Unique key generated by the context. Used to fetch state from within the modal */
    stateKey: string;
}
export interface IModalState {
    close: () => void;
    [key: string]: any;
}

export interface IModalActions {
    open: () => void;
    close: () => void;
    setState: <K extends keyof IModalState, V extends IModalState[K]>(
        key: K,
        value: V
    ) => void;
}

export interface IModalContext {
    /** Adds a modal component into the Modal Context */
    add: (
        stateKey: string,
        modal: React.FC<any>,
        props: Omit<IModalProps, 'stateKey' | 'close'>,
        state?: Omit<IModalState, 'close'>
    ) => IModalActions;
    modalsState: { [key: string]: IModalState };
}

export interface IModalProviderProps {
    children: React.ReactNode;
    /** The portals root element */
    rootElement?: Element;
}
export interface IModalPortalProps
    extends Required<Pick<IModalProviderProps, 'rootElement'>> {
    modal: React.ReactElement;
}
