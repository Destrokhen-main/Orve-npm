import { expect, test, describe } from "@jest/globals";

import { cOneStringD, cOneStringRD, cOneString, cOneNumber, cOneNumberD } from "./component";
import { error } from "../../src/package/dom/error"

describe("definedProps", () => {
  test("props String D not set", () => {
    const comp = cOneStringD({});
    expect(comp?.props?.st).toBe("asd")
  })

  // test.only("props String RD", () => {
  //   expect(cOneNumber({})).toThrow(error)
  // })

  test("props String", () => {
    const comp = cOneString({});
    expect(comp?.props).not.toBeDefined()
  })

  test("props String RD have props", () => {
    const comp = cOneStringRD({ st: "test" });
    expect(comp?.props?.st).toBe("test");
  })

  // test("props Number", () => {
  //   expect(cOneNumber({})).not.toBeDefined()
  // })

  test("props Number D", () => {
    const comp = cOneNumberD({});
    expect(comp?.props?.st).toBe(123);
  })
})