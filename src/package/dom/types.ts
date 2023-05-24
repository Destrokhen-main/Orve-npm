import { Node } from "../jsx";

interface ONode extends Node {
  type: TypeNode;
  keyNode: string;
  node: null | HTMLElement | Comment;
  parent: ONode | null;
}

enum HookObjectType {
  Child = "Child",
  Props = "Props",
  Component = "Component",
}

type HookObject = {
  context: Record<string, any>;
  oNode: ONode;
  type?: HookObjectType;
};

enum TypeNode {
  Component = "Component",
  Comment = "Comment",
}

type Props = {
  children?:
    | Array<() => ONode | string | number | object>
    | string
    | number
    | object;
};

export { ONode, TypeNode, Props, HookObject, HookObjectType };
