import {describe, expect, test} from '@jest/globals';
import { createApp } from "../src/index";

const component = () => {
  return {
    tag: "div",
    html: "test123"
  }
}

const body = document.body;
document.body.innerHTML = `<div id="app"></div>`

describe("Check o-html prop", () => {
  test("create-app", () => {
    const app = createApp(component);
    app?.mount("#app");
    expect(document.querySelector("div")?.innerHTML).toBe("test123");
  })
})