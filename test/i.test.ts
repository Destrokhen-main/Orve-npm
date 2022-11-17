import {describe, expect, test} from '@jest/globals';
import { builder } from "../src/core/builder";

const comp = function() {
  return {
    tag: "div",
    child: "hello"
  }
} as any

describe('Hello Component', () => {
  test('build component', () => {
    const s = builder(comp);
    expect(s).toStrictEqual({ tag: 'div', child: [ { type: 0, value: 'hello' } ], type: 2 });
  });
});