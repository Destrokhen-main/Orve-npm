interface Node {
  tag: (_?: object) => Node | Node | string;
  props?: Record<string, any>;
  child?: [];
  key?: number | string;
  ref?: Record<string, any>;
  hooks?: Record<string, () => void>;
}

interface VNode extends Node {
  type?: number | string;
  value?: any;
  node?: HTMLElement | Text;
  proxy?: Record<string, any>;
}

export { Node, VNode };
