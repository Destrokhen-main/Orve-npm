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
      if (["o-hooks", "o-ref", "o-key", "o-props"].includes(key)) {
        const k = key.replace("o-", "").trim().toLowerCase();
        if (key !== "o-props")
          TAG[k] = props[key];
      } else {
        finalProps[key] = props[key];
      }
    })

    if (TAG.props !== undefined) {
      TAG.props = {...finalProps, ...TAG.props};
    } else {
      TAG.props = finalProps;
    }
    
  }

  if (child.length > 0) {
    TAG.child = child;
  }
  return TAG
}

const Fragment = function(tag:Record<string, unknown>) {
  return {
    tag: "fragment",
    child: tag ? tag.children : []
  }
}

export { Node, Fragment }