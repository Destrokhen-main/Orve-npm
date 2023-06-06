import { Node, ref } from "../../src/index";
import { jest } from '@jest/globals';

const Child = function() {
  const r = ref(1);

  return {
    ref: r,
    template: Node(() => Node("div", {id: "app"}, r.formate((e: any) => { return e + 1})))
  }
}

const Props = function() {
  const r = ref(1);

  return {
    ref: r,
    template: Node(() => Node("div", { id: "app", test: r.formate((e: any) => e + 1) }))
  }
}


const Event = function() {
  const r = ref(1);

  const funcOne = jest.fn(() => {
    console.log("funcOne");
  })

  const funcTwo = () => {
    console.log("funcTwo")
  }

  return {
    ref: r,
    funcOne,
    funcTwo,
    template: Node(() => Node("div", { id: "app", onclick: r.formate((e: number) => {
      if (e === 1 || e > 3) {
        return funcOne;
      }
      return funcTwo;
    }) }))
  }
}

export { Child, Props, Event }