import {describe, expect, test} from '@jest/globals';

import { Node, Fragment } from "../../src/package/jsx";

describe("Node - test", () => {
  test("default component", () => {
    const obj = Node("div", { prop: "123" }, "test");
    expect(obj).toStrictEqual({
      tag: "div",
      props: { prop: "123" },
      child: ["test"]
    });
  })
  test("component without props", () => {
    const obj = Node("div", {}, "test");
    expect(obj).toStrictEqual({
      tag: "div",
      child: ["test"]
    });
  })
  test("component with child", () => {
    const obj = Node("div", {prop: "123"});
    expect(obj).toStrictEqual({
      tag: "div",
      props: { prop: "123" }
    });
  })
  test("Component empty", () => {
    const obj = Node("div");
    expect(obj).toStrictEqual({
      tag: "div"
    });
  })
});