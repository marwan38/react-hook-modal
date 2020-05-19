import React from 'react';
import { createPortal } from 'react-dom';

export const Portal: React.FC<{ rootElement?: Element }> = ({
    children,
    rootElement = document.body,
}) => {
    return createPortal(children, rootElement);
};
