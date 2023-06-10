import { expect, test, describe } from "@jest/globals";

import { cOneStringD, cOneStringRD, cOneString, cOneNumber, cOneNumberD } from "./component";

describe("definedProps", () => {
  test("props String D not set", () => {
    const comp = cOneStringD({});
    expect(comp?.props?.st).toBe("asd")
  })

  test("props String RD", () => {
    const comp = cOneStringRD({});
    expect(comp?.props).not.toBeDefined()
  })

  test("props String", () => {
    const comp = cOneString({});
    expect(comp?.props).not.toBeDefined()
  })

  test("props String RD have props", () => {
    const comp = cOneStringRD({ st: "test" });
    expect(comp?.props?.st).toBe("test");
  })

  test("props Number", () => {
    const comp = cOneNumber({});
    expect(comp?.props).not.toBeDefined()
  })

  test("props Number D", () => {
    const comp = cOneNumberD({});
    expect(comp?.props?.st).toBe(123);
  })
})