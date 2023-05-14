import {describe, expect, test} from '@jest/globals';
import { parser } from "../src/package/dom/builder/index";

const comp = function() {
  return {
    tag: "div",
    child: ["hello"]
  }
} as any

const comp1 : any = () => {
  return {
    tag: "div",
    child: "hello"
  }
}

function t(object: any) {
  expect(object["tag"]).not.toBeUndefined();
  expect(object["type"]).toBe("Component");
  expect(Array.isArray(object["child"])).toBe(true);

  if (Array.isArray(object["child"])) {
    expect(object["child"][0]["type"]).toBe("Static");
    expect(object["child"][0]["value"]).not.toBeUndefined();
    expect(object["child"][0]["value"]).toBe("hello");
  }
}

describe('Hello Component without mounted', () => {
  test('build comp-1', () => {
    const object = parser(comp);
    t(object);
  });
  test('build comp-2', () => {
    const object = parser(comp1);
    t(object);
  });
});