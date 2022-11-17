import {describe, expect, test} from '@jest/globals';
import { builder } from "../src/core/builder";

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

describe('Hello Component without mounted', () => {
  test('build comp-1', () => {
    expect(builder(comp)).toStrictEqual({ tag: 'div', child: [ { type: 0, value: 'hello' } ], type: 2 });
  });
  test('build comp-2', () => {
    expect(builder(comp1)).toStrictEqual({ tag: 'div', child: [ { type: 0, value: 'hello' } ], type: 2 });
  });
});