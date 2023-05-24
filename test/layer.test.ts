import {describe, expect, test} from '@jest/globals';
import { createApp } from "../src/index";

const layer = function({children, ...props}: {children: any}) {
  return {
    tag: "div",
    props: props,
    child: children as any[]
  }
}

const mainComponent = function() {
  return {
    tag: layer,
    props: {
      id: "id",
      class: "class"
    },
    child: "children"
  }
}

let App: any = null;
let body = document.body;

describe("Layer test - 1", () => {
  test("createApp", () => {
    App = createApp(mainComponent);
  })
  test("mounted component", () => {
    body.innerHTML = "<div id='app'></div>"
    App.mount("#app");
    expect(body.querySelector("div")?.childNodes.length).not.toBe(0);
  })
  test("find mounted component", () => {
    const comp = body.querySelector("div");
    expect(comp?.getAttribute("id")).toBe("id");
    expect(comp?.getAttribute("class")).toBe("class");
    expect(comp?.innerHTML).toContain("children");
  })
});


const layer2 = function({children, ...props}: {children: any}) {
  return {
    tag: "div",
    props: props,
    child: children
  }
}

const layer1 = function({children, ...props}: { children: any }) {
  return {
    tag: layer2,
    props: props,
    child: children
  }
}

const mainComponent1: any = function() {
  return {
    tag: layer1,
    props: {
      id: "id",
      class: "class"
    },
    child: "children"
  }
}


describe("Layer in layer", () => {
  test("created and mounted", () => {
    body.innerHTML = "<div id='app'></div>";
    const app = createApp(mainComponent1)
    app?.mount("#app");
    expect(body.childNodes.length).not.toBe(0);
  })
  test("check component", () => {
    const comp = body.querySelector("div");
    expect(comp?.getAttribute("id")).toBe("id");
    expect(comp?.getAttribute("class")).toBe("class");
    expect(comp?.innerHTML).toContain("children");
  })
})