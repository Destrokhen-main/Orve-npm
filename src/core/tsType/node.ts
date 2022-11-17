interface Node {
  tag: (_?: object) => Node | Node | string;
  props?: {};
  child?: [];
  key?: number | string;
  ref?: any;
}

interface VNode extends Node {
  type?: any;
  value?: any;
  node?: HTMLElement | Text;
  proxy?: any;
}

export { Node, VNode };
