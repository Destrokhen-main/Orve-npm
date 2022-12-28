type typeTag = {
  tag: string | (() => typeTag),
  hooks?: Record<string, () => void>,
  props?: Record<string, unknown> | null,
  child?: Array<typeTag>
}

const Node = function(tag:string | (() => typeTag), props: Record<string, unknown> | null, ...child : any) {
  const TAG: typeTag = {tag};

  if (props !== null) {
    const finalProps = {};
    Object.keys(props).forEach((key) => {
      if (["o-hooks", "o-ref", "o-key"].includes(key)) {
        const k = key.replace("o-", "").trim().toLowerCase();
        TAG[k] = props[key];
      } else {
        finalProps[key] = props[key];
      }
    })

    TAG.props = finalProps;
  }

  if (child.length > 0) {
    TAG.child = child;
  }
  console.log(TAG);
  return TAG
}

const Fragment = function() {
  return "fragment"
}

export { Node, Fragment }