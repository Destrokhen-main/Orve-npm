import {describe, expect, test} from '@jest/globals';
import { builder } from "../src/core/builder";

const comp = function() {
  return {
    tag: "div",
    child: "hello"
  }
} as any

const comp1 : any = () => {
  return {
    tag: "div",
    child: "hello"
  }
}

describe('Hello Component', () => {
  test('build component test-1', () => {
    const s = builder(comp);
    expect(s).toStrictEqual({ tag: 'div', child: [ { type: 0, value: 'hello' } ], type: 2 });
  });
  test('build component test-2', () => {
    const s = builder(comp1);
    expect(s).toStrictEqual({ tag: 'div', child: [ { type: 0, value: 'hello' } ], type: 2 });
  })
});