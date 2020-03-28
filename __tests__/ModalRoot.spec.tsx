import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import ModalRoot, { Props } from "../src/components/ModalRoot";
import { ModalProvider } from "../src";
import { StubModal } from "./stubModal";
const tree = (component: React.FC<Props>) => (
  <ModalProvider>
    <StubModal modalTemplate={component} />
  </ModalProvider>
);

describe("ModalRoot", () => {
  test("Renders without exploding", async () => {
    const { getByText } = render(
      tree(({ stateKey }) => (
        <ModalRoot stateKey={stateKey}>String child</ModalRoot>
      ))
    );
    fireEvent.click(getByText("Open"));
    expect(getByText("String child")).toBeTruthy();
  });

  test("Passes custom close function to children", async () => {
    const { getByText } = render(
      tree(({ stateKey }) => (
        <ModalRoot stateKey={stateKey}>
          {({ close }) => <div onClick={close}>CloseButton</div>}
        </ModalRoot>
      ))
    );
    
    fireEvent.click(getByText("Open"));
    act(() => {
        fireEvent.click(getByText("CloseButton"))
    });
  });
});
