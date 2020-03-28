import React from "react";
import { createPortal } from "react-dom";
import { IModalPortalProps } from "./types";

export const ModalPortal: React.FC<IModalPortalProps> = ({ modal, rootElement }) => {
  return createPortal(modal, rootElement);
};
