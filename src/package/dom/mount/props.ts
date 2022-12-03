import * as reactToCSS from "react-style-object-to-css";
import { ProxyType } from "../../reactive/type";
import { PropsTypeRef, PropRef } from "../../reactive/ref";

type IMG = {
  default: string
}

export const propsF = function(
  tag: HTMLElement,
  props: Record<string, string | number | (() => any) | IMG | Record<string, number | string | any>>
) {
  Object.keys(props).forEach((prop : string) => {
    if (prop === "src") {
      if (typeof props[prop] === "string") {
        tag.setAttribute(prop, (props[prop] as string));
      } else if (typeof props[prop] === "object") {
        // can be proxy
        
        // not a proxy
        tag.setAttribute(prop, ((props[prop] as IMG).default as string))
      }
      return;
    } 

    if (prop.startsWith("@")) {
      const name = prop.replace("@", "").trim();
      if (typeof props[prop] === "object" && (props[prop] as any).type === ProxyType.Proxy) {
        const type = (props[prop] as any).typeProxy;
        if (type === ProxyType.Ref) {
          tag.addEventListener(name, (props[prop] as any).value);
          (props[prop] as any).parent.push({
            key: name,
            type: PropsTypeRef.PropEvent,
            ONode: this.ONode
          } as PropRef);
        }
        // NOTE EFFECT 
      } else {
        // not a proxy
        const func = (props[prop] as (() => any)).bind(this.context);
        tag.addEventListener(name, func);
      }
      return;
    }

    if (prop === "style") {
      if (typeof props[prop] === "object" && (props[prop] as any).type === ProxyType.Proxy) {
        const type = (props[prop] as any).typeProxy;
        if (type === ProxyType.Ref) {
          tag.setAttribute("style", (props[prop] as any).value);
          (props[prop] as any).parent.push(
            {
              key: prop,
              type: PropsTypeRef.PropStatic,
              ONode: this.ONode
            } as PropRef
          )
        }
      } else {
        // not a proxy
        let style;
        if (typeof props[prop] === "string") {
          style = props[prop];
        } else {
          style = reactToCSS(props[prop]);
        }
        if (style.length > 0) {
          tag.setAttribute("style", style);
        }
      }
      return;
    }

    // check if PROXY
    if (typeof props[prop] === "object" && (props[prop] as any).type === ProxyType.Proxy) {
      const proxyType = (props[prop] as any).proxyType;
      console.log(proxyType);
      if (proxyType == ProxyType.Ref) {
        let value = (props[prop] as any).value;
        if (typeof value === "function") {
          value = value();
        }
        tag.setAttribute(prop, value);
        (props[prop] as any).parent.push(
          {
            key: prop,
            type: PropsTypeRef.PropStatic,
            ONode: this.ONode
          } as PropRef
        );
        console.log("proxy - ", props[prop]);
      }
      return;
    }

    // not all before

    tag.setAttribute(prop, props[prop] as string);
  })
}