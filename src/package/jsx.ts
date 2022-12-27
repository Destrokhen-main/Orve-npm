type typeTag = {
  tag: string | (() => typeTag),
  props?: Record<string, unknown> | null,
  child?: Array<typeTag>
}

const Node = function(tag:string | (() => typeTag), props: Record<string, unknown> | null, ...child : any) {
  const TAG: typeTag = {tag};

  if (props !== null) {
    TAG.props = props
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