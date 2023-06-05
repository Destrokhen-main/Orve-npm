import {describe, expect, test} from '@jest/globals';

import { createAppRoot, Node, ref } from "../src/index";

describe("ref - format", () => {
  test("test - 1 => string", () => {
    document.body.innerHTML = "<div id='app'></div>";

    const Component = () => {
      const r = ref(1);
      return (
        Node("div", { id: "item", onClick: () => { 
          r.value = 2;
         } }, r.format((e: number) => `Hello ${e}`))
      )
    }

    createAppRoot(Node(Component, {}))?.mount("#app");
    expect(document.getElementById("item")).toBeDefined();
    expect(document.getElementById("item")?.innerHTML).toBe("Hello 1");
  })
})

