import * as React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ModalRoot } from "../src";

test("Renders", async () => {
  const { getByRole } = render(<ModalRoot />);
  expect(getByRole("heading")).toHaveTextContent("My First Component");
});
