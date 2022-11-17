import {describe, expect, test} from '@jest/globals';

import { createApp } from "../src/index";

const component = function () {
  return {
    tag: "div",
    props: {
      id: "key",
      class: "class",
      style: {
        display: "flex"
      }
    },
    child: "hello"
  }
} as any

let app : any = null;
const body = document.body;

describe("CreateApp function and mounted", () => {
  test("CreateApp step", () => {
    app = createApp({App: component});
    expect(app).not.toBeUndefined();
  })
  test("Mounted step", () => {
    body.innerHTML = `<div id = "app"></div>`;
    app.mount("#app");
    expect(body.querySelector("div")?.childNodes.length).not.toBe(0);
  })
  test("Find created element", () => {
    const createdDiv = body.querySelector("#app")?.querySelector("div");

    expect(createdDiv?.getAttribute("id")).toBe("key");
    expect(createdDiv?.getAttribute("class")).toBe("class");
    expect(createdDiv?.innerHTML).toBe("hello");
  })
})