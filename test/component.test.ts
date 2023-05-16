import {describe, expect, test} from '@jest/globals';
import { parser } from "../src/package/dom/builder/index";
import orve from "../src/index";

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


// Check parse app with Layer 
const Component1 = function() {
  return {
    tag: Layer,
    child: ["Hello"]
  }
}

const Layer = function({ children }: { children: any }) {
  return {
    tag: "div",
    child: [
      children,
      "World"
    ]
  }
}
// ------


// check parse app with Layer and Props

function Layer1({ children, classes } : { children: any, classes: any }) {
  return {
    tag: "div",
    props: {
      class: classes
    },
    child: [
      children[0] + " 1"
    ]
  }
}

function Component2() {
  return {
    tag: Layer1,
    props: {
      id: 123,
      classes: "test"
    },
    child: "test"
  }
}

// -----


describe('Component with layer', () => {
  test("Check parse app with Layer", () => {
    const app = parser(Component1);

    expect(Array.isArray(app?.child)).toBe(true);

    expect(app?.child.length).toBe(2);

    app?.child.forEach((e: any) => {
      expect(e.type).toBe("Static");
    });

    expect(app?.child[0].value).toBe("Hello");
    expect(app?.child[1].value).toBe("World");
  })

  test("check parse app with Layer and Props", () => {
    const app = parser(Component2);

    expect(app?.props).toBeDefined();
    expect(app?.props?.class).toBeDefined();
    expect(app?.props?.class).toBe("test");

    expect(app?.child).toBeDefined();

    expect(app?.child.length).toBe(1);

    expect(app?.child[0].value).toBe("test 1");
  })
});