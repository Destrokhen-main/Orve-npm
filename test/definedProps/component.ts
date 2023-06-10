import { Node } from "../../src/package/jsx"
import { defineProps } from "../../src";

function comp() {
  return Node("div", {});
}

/**
 * R - required true
 * D - set default
 */
export const cOneStringD = defineProps(comp, {
  st: {
    type: String,
    required: false,
    default: "asd"
  }
})

export const cOneStringRD = defineProps(comp, {
  st: {
    type: String,
    required: true,
    default: "asd"
  }
})

export const cOneString = defineProps(comp, {
  st: {
    type: String
  }
})

export const cOneNumber = defineProps(comp, {
  st: {
    type: Number,
  }
})

export const cOneNumberR = defineProps(comp, {
  st: {
    type: Number,
    required: true
  }
})

export const cOneNumberD = defineProps(comp, {
  st: {
    type: Number,
    required: false,
    default: 123
  }
})