import React, { useContext, useEffect, useRef } from "react";
import { IModalContext } from "./types";
import { ModalContext } from "./ModalProvider";
import useDeepCompareEffect from "use-deep-compare-effect";

/**
 * @param modal - React.ReactNode
 * @param actions - onSubmit and onClose handlers
 */
export function useModal<P, S>(
    modal: React.FC<P>,
    props?: Omit<P, "close" | "stateKey">,
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
    const {
        current: { open, close, setState, cleanUp, updateProps, init },
    } = useRef(modalContext.add(stateKey.current, modal, props, state));

    useDeepCompareEffect(() => {
        if (props) {
            updateProps(props);
        }
    }, [props]);

    // Avoid memory leaks by killing modal when caller component is destroyed
    useEffect(() => {
        init();
        return () => {
            close();
            cleanUp();
        };
    }, []);

    return { open, close, setState };
}
