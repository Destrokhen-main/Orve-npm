import { beforeAll, describe, expect, test} from '@jest/globals';
import { Node, createApp } from "../src/index";
import { afterEach, beforeEach } from 'node:test';

const Components = [
  () => {
    return (
      Node("div", { id: "block" }, "Hello world")
    )
  },
  () => {
    return (
      Node("div", { id: "block" }, Node("div", {}, "Hello ", "world"))
    )
  }
];

describe("create app with function jsx", () => {
  test("hello world", () => {
    document.body.innerHTML = "<div id='app'></div>";
    createApp(Components[0])?.mount("#app");

    const item = document.getElementById("block");

    expect(item).toBeDefined();
    expect(item?.innerHTML).toBe("Hello world");
  })

  test("hello world with 2 div element", () => {
    document.body.innerHTML = "<div id='app'></div>";
    createApp(Components[1])?.mount("#app");

    const item = document.getElementById("block");

    expect(item).toBeDefined();

    const divInner = item?.firstElementChild;

    expect(divInner).toBeDefined();
    expect(divInner?.innerHTML).toBe("Hello world")
  })
})