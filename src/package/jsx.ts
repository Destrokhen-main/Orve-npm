type typeTag = {
  tag: string | (() => typeTag),
  hooks?: Record<string, () => void>,
  props?: Record<string, unknown> | null,
  child?: Array<typeTag>
}

const Node = function(tag:string | (() => typeTag), props: Record<string, unknown> | null, ...child : any) {
  const TAG: typeTag = {tag};

  if (props !== null) {
    if (props["o-hooks"] !== undefined) {
      (TAG as any)["hooks"] = props["o-hooks"];
      const object = Object.keys(props).filter(e => e !== "o-hooks").reduce((a, v) => { a[v] = props[v]; return a;}, {});
      console.log(object);
      (TAG as any).props = object;
    } else {
      TAG.props = props
    }
  }

  if (child.length > 0) {
    TAG.child = child;
  }

  return TAG
}

const Fragment = function() {
  return "fragment"
}

export { Node, Fragment }