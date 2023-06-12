export type ArgProps = Record<string, any>;

export interface HooksContext {
  context: Record<string, any>;
  oNode: any;
}
export interface Hooks {
  created: (arg: HooksContext) => void;
  mounted: (arg: HooksContext) => void;
  updated: (arg: HooksContext) => void;
  unmounted: (arg: HooksContext) => void;
}

export type TagType = string | ((arg?: ArgProps) => any);

export interface Node {
  tag: TagType;
  child?: any | any[];
  props?: Record<string, any>;
  ref?: any;
  hooks?: Hooks;
  html?: string;
}

const O_KEY = ["o-hooks", "o-ref", "o-key", "o-html"];

const Node = function (
  tag: TagType,
  props: Record<string, any> | null = null,
  ...child: any
): Node {
  const TAG: Node = { tag };

  // parse props
  if (props !== null && typeof props === "object") {
    const PropsToTag: Record<string, any> = {};

    const propsKeys = Object.keys(props);

    propsKeys.forEach((prop) => {
      if (O_KEY.includes(prop)) {
        const parseKey: keyof Node = prop
          .toLowerCase()
          .replace("o-", "") as keyof Node;

        TAG[parseKey] = props[prop];
      } else {
        PropsToTag[prop] = props[prop];
      }
    });

    if (Object.keys(propsKeys).length > 0) {
      TAG.props = PropsToTag;
    }
  }

  // work with children
  if (child.length > 0) {
    TAG.child = child;
  }
  return TAG;
};

const Fragment = function (tag: { children?: any | any[] }): Node {
  return {
    tag: "fragment",
    child: tag !== undefined && tag.children !== undefined ? tag.children : [],
  };
};

export { Node, Fragment };
