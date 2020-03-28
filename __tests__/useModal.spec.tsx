import { renderHook } from "@testing-library/react-hooks";
import "@testing-library/jest-dom/extend-expect";

import { StubModal } from "./stubModal";
import { useModal } from "../src";

describe("useModal", () => {
  test("Returns modal methods", async () => {
    const {
      // @ts-ignore
      result
    } = renderHook(() => useModal(StubModal));

    const {
      current: { open, close, setState }
    } = result;

    expect(typeof open).toBe("function");
    expect(typeof close).toBe("function");
    expect(typeof setState).toBe("function");
  });
});
