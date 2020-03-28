import React from "react";
import { createPortal } from "react-dom";
import { IModalContainerProps } from "./types";

export const ModalContainer: React.FC<IModalContainerProps> = ({ modal }) => {
  return createPortal(modal, document.body);
};
