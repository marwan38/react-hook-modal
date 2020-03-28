import { render, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { tree } from "./stubModal";

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
    const { getByText, findByText } = render(tree);

    fireEvent.click(getByText("Open"));
    act(() => void fireEvent.click(getByText("I am child")));
    expect(findByText("I am child")).toMatchObject({});
  });
});
