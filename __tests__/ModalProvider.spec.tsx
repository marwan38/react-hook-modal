import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  act,
  RenderResult
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { tree } from "./stubModal";
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

  test("Has access to state from within the modal", async () => {
    const StubModal: React.FC<IModalProps> = props => {
      const { loading } = useModalState(props.stateKey);
      return (
        <ModalRoot {...props}>
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

      setTimeout(
        () =>
          void setState(state => {
            state.loading = true;
          }),
        100
      );

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
