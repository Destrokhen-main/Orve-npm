type ONode = {
  tag: string | (() => ONode),
  props?: Record<string, any>,
  child?: Array<() => ONode | string | number | object> | string | number | object,
  hooks?: Hooks,
  keyNode: string,
  ref?: object
}

type ONodeOrve = {
  tag: string | (() => ONode),
  props?: Record<string, any>,
  child?: Array<() => ONodeOrve | string | number | object> | string | number | object
  hooks?: Hooks,
  ref?: object,
  type: TypeNode,
  keyNode: string,
  node: null | HTMLElement,
  parent: ONodeOrve | null,
}

type HookObject = {
  context: Record<string, any>,
  oNode: ONodeOrve
};

type Hooks = {
  created?: (_ : HookObject) => void,
  mounted?: (_ : HookObject) => void,
  updated?: (_ : HookObject) => void,
  unmounted?: () => void
}


enum TypeNode {
  Component = "Component"
}

type Props = {
  children?: Array<() => ONodeOrve | string | number | object> | string | number | object,
}

export {
  ONode,
  ONodeOrve,
  TypeNode,
  Props,
  HookObject
}