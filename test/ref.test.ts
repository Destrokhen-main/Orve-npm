import {describe, expect, test} from '@jest/globals';
import { createApp, ref } from "../src/index";

const body = document.body;
document.body.innerHTML = `<div id="app"></div>`

describe("Ref string child", () => {
  test("Created app and mounted", () => {
    const component : any = function() {
      const string = ref("123");
      return {
        tag: "div",
        props: {
          "@click" : () => {
            string.value = "1234";
          }
        },
        child: [
          string
        ]
      }
    }
    const app = createApp({App: component});
    app.mount("#app");
  })
  test("Check first draw", () => {
    expect(body.querySelector("#app")?.querySelector("div")?.innerHTML).toBe("123");
  })
  test("Click and check text", () => {
    body.querySelector("#app")?.querySelector("div")?.click();
    expect(body.querySelector("#app")?.querySelector("div")?.innerHTML).toBe("1234");
  })
})

describe("Ref number child", () => {
  test("Created app and mounted", () => {
    document.body.innerHTML = `<div id="app"></div>`;

    const component : any = function() {
      const string = ref(1);
      return {
        tag: "div",
        props: {
          "@click" : () => {
            (string.value as number) += 1;
          }
        },
        child: [
          string
        ]
      }
    }
    const app = createApp({App: component});
    app.mount("#app");
  })
  test("Check first draw", () => {
    expect(body.querySelector("#app")?.querySelector("div")?.innerHTML).toBe("1");
  })
  test("Click and check text", () => {
    body.querySelector("#app")?.querySelector("div")?.click();
    expect(body.querySelector("#app")?.querySelector("div")?.innerHTML).toBe("2");
  })
})

describe("Ref string, number props", () => {
  test("Created app and mounted", () => {
    document.body.innerHTML = `<div id="app"></div>`;

    const component : any = function() {
      const string = ref("1");
      const number = ref(1);
      return {
        tag: "div",
        props: {
          class: string,
          atr: number,
          "@click" : () => {
            string.value = "2";
            (number.value as number) += 1;
          }
        },
        child: "text"
      }
    }
    const app = createApp({App: component});
    app.mount("#app");
  })
  test("Check first draw", () => {
    expect(body.querySelector("#app")?.querySelector("div")?.innerHTML).toBe("text");
    expect(body.querySelector("#app")?.querySelector("div")?.getAttribute("class")).toBe("1");
    expect(body.querySelector("#app")?.querySelector("div")?.getAttribute("atr")).toBe("1");
  })
  test("Click and check text", () => {
    body.querySelector("#app")?.querySelector("div")?.click();
    expect(body.querySelector("#app")?.querySelector("div")?.getAttribute("class")).toBe("2");
    expect(body.querySelector("#app")?.querySelector("div")?.getAttribute("atr")).toBe("2");
  })
});