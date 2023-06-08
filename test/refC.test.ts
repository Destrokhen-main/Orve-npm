
import {describe, expect, test} from '@jest/globals';
import { createApp, refC } from "../src/index";

document.body.innerHTML = `<div id="app"></div>`;

describe("refC test", () => {
  test("created and mounted app", () => {
    function comp1() {
      return {
        tag: "div",
        props: {
          id: "comp"
        },
        child: "comp-1"
      }
    }
    function comp2() {
      return {
        tag: "div",
        props: {
          id: "comp"
        },
        child: "comp-2"
      }
    }
    
    const component = function() {
      let i = 0;
      const r = refC(comp1);
      return {
        tag: "div",
        child: [
          r,
          {
            tag: "button",
            child: "add",
            props: {
              id: "btn",
              "@click": () => {
                r.value = i === 0 ? comp2 : comp1;
                i = i === 0 ? 1 : 0;
              }
            }
          }
        ]
      }
    }
    const app = createApp(component);
    if (app !== undefined) {
      app.mount("#app");
    }
    const div = document.querySelector("div");
    expect(div?.querySelector("#comp")?.innerHTML).toMatch(/comp-1/);
  })
  test("click and check rewrite", () => {
    const div = document.querySelector("div");
    const el : any = div?.querySelector("#btn");
    expect(el).not.toBe(null);
    if (el) {
      el.click();
      expect(div?.querySelector("#comp")?.innerHTML).toMatch(/comp-2/);
    }
  })
})