interface Node {
  tag: (_?: object) => Node | Node | string,
  props?: {},
  child?: []
}

interface VNode extends Node {
  type?: any,
  value?: any,
  node?: HTMLElement | Text,
  proxy?: any
}

export {
  Node,
  VNode
}