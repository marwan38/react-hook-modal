import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  act,
  getByRole,
  queryByRole,
  RenderResult
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { tree, StubModal, withProvider } from "./stubModal";
import { useModal, IModalProps, useModalState, ModalProvider } from "../src";
import ModalRoot from "../src/components/ModalRoot";

describe("ModalProvider", () => {
  test("Renders children", async () => {
    const { getByText } = render(tree);

    expect(getByText("Open")).toBeTruthy();
  });

  test("Renders modal", async () => {
    const { getByText, findByText } = render(tree);

    expect(findByText("I am child")).toMatchObject({});

    fireEvent.click(getByText("Open"));
    await waitFor(() => expect(getByText("I am child")).toBeTruthy());
  });

  test("Has access to static props from within the modal", async () => {
    const StubModal: React.FC<IModalProps & { text: string }> = ({
      stateKey,
      text = "I am child"
    }) => {
      const { close } = useModalState(stateKey);
      return (
        <ModalRoot stateKey={stateKey}>
          <div onClick={close}>{text}</div>
        </ModalRoot>
      );
    };

    const text = "Passed as a static prop";

    const ModalLauncher = () => {
      const modal = useModal(StubModal, {
        text
      });
      return (
        <div>
          <button onClick={modal.open}>Open</button>
        </div>
      );
    };
    const { getByText } = render(withProvider(<ModalLauncher />));

    fireEvent.click(getByText("Open"));
    expect(getByText(text)).toBeTruthy();
    act(() => void fireEvent.click(getByText(text)));
  });

  test("Has access to state from within the modal", async () => {
    const StubModal: React.FC<IModalProps> = ({ stateKey }) => {
      const { loading } = useModalState(stateKey);
      return (
        <ModalRoot stateKey={stateKey}>
          <div onClick={close} role="close" />
          {loading && <div role="loader"></div>};
        </ModalRoot>
      );
    };

    const ModalLauncher = () => {
      const { open, setState } = useModal(
        StubModal,
        {},
        {
          loading: false
        }
      );

      setTimeout(() => void setState("loading", true), 100);

      return <button onClick={open} role="open" />;
    };

    let provider: RenderResult;
    act(() => {
      provider = render(
        <ModalProvider>
          <ModalLauncher />
        </ModalProvider>
      );
    });
    const { queryByRole } = provider;

    fireEvent.click(queryByRole("open"));
    expect(queryByRole("loader")).not.toBeTruthy();
    waitFor(() => expect(queryByRole("loader")).toBeTruthy());
  });
});
