import { Node } from "../../src/package/jsx"
import { defineProps } from "../../src";

function comp() {
  return Node("div");
}

export const Component = defineProps(comp, {
  st: {
    type: String,
    required: false,
    default: "asd"
  }
})