import {describe, expect, test} from '@jest/globals';
import { createApp } from "../src/index";

const layer = function({children, ...props}) {
  return {
    tag: "div",
    props: props,
    child: children
  }
}

const mainComponent: any = function() {
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
    App = createApp({App: mainComponent});
  })
  test("mounted component", () => {
    body.innerHTML = "<div id='app'></div>"
    App.mount("#app");
    expect(body.querySelector("div")?.querySelector("div")?.childNodes.length).not.toBe(0);
  })
  test("find mounted component", () => {
    const comp = body.querySelector("#app")?.querySelector("div");
    expect(comp?.getAttribute("id")).toBe("id");
    expect(comp?.getAttribute("class")).toBe("class");
    expect(comp?.innerHTML).toContain("children");
  })
});


const layer2 = function({children, ...props}) {
  return {
    tag: "div",
    props: props,
    child: children
  }
}

const layer1 = function({children, ...props}) {
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
    const app = createApp({App: mainComponent1})
    app.mount("#app");
    expect(body.querySelector("#app")?.childNodes.length).not.toBe(0);
  })
  test("check component", () => {
    const comp = body.querySelector("#app")?.querySelector("div");
    expect(comp?.getAttribute("id")).toBe("id");
    expect(comp?.getAttribute("class")).toBe("class");
    expect(comp?.innerHTML).toContain("children");
  })
})