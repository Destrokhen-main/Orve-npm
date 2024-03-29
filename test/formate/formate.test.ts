import {describe, expect, test} from '@jest/globals';

import { Child, Props, Event, Style } from "./component";
import { createAppRoot } from '../../src';

document.body.innerHTML = "<div id='app'></div>";
describe("Formate", () => {
  test("child", () => {
    const obj = Child();
    createAppRoot(obj.template)?.mount("#app");

    const node = document.body.querySelector("#app");

    expect(node).toBeDefined();

    let child = node?.innerHTML;
    expect(parseInt(child!, 10)).toBe(obj.ref.value + 1);

    obj.ref.value += 1;

    expect(node).toBeDefined();
    child = node?.innerHTML;
    expect(parseInt(child!, 10)).toBe(obj.ref.value + 1);
  })

  test("props", () => {
    document.body.innerHTML = "<div id='app'></div>";

    const obj = Props();
    createAppRoot(obj.template)?.mount("#app");

    const node = document.body.querySelector("#app");

    expect(node).toBeDefined();

    let prop = node?.getAttribute("test");
    expect(parseInt(prop!, 10)).toBe(obj.ref.value + 1);

    obj.ref.value += 1;

    expect(node).toBeDefined();
    prop = node?.getAttribute("test");
    expect(parseInt(prop!, 10)).toBe(obj.ref.value + 1);
  })

  test("Event", () => {
    document.body.innerHTML = "<div id='app'></div>";

    const obj = Event();
    createAppRoot(obj.template)?.mount("#app");
    
    const node = document.body.querySelector("#app");
    expect(node).toBeDefined();

    (node as any).click();
    expect(obj.funcOne.mock.calls).toHaveLength(1);

    obj.ref.value += 1;
    (node as any).click();
    expect(obj.funcOne.mock.calls).toHaveLength(1);
  })

  test("Style", () => {
    document.body.innerHTML = "<div id='app'></div>";

    const obj = Style();
    createAppRoot(obj.template)?.mount("#app");

    const node = document.body.querySelector("#app");
    expect(node).toBeDefined();

    let prop = node?.getAttribute("style");
    expect(prop).toBe("color: red");

    obj.ref.value = true;
    prop = node?.getAttribute("style");
    expect(prop).toBe("color: green");
  })
});