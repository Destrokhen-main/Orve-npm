import { Node } from "../jsx";
import er from "./error";

const checkTypeObject = (type: string, value: unknown, e: string, silent = false) => {
  const v = type;

  if (typeof v === "object") {
    if (Array.isArray(v)) {
      if (!Array.isArray(value)) {
        if (!silent)
          console.warn(`Error type key "${e}" expected "array" but got "${typeof value}"`);
        return false;
      }
    } else {
      if (typeof value !== "object" || Array.isArray(value)) {
        if (!silent) {
          const isArray = Array.isArray(value);
          console.warn(`Error type key "${e}" expected "${typeof v}" but got "${
            typeof value !== 'object'
              ? typeof value 
              : isArray ? "array" : ""
          }"`)
        }
        return false;
      }
    }
  } else {
    if (typeof value !== typeof v) {
      if (!silent)
        console.warn(`Error type key "${e}" expected "${typeof v}" but got "${typeof value}"`);
      
      return false;
    }
  }

  return true
}

export function defineProps(node: any, pt: Record<string, any>) {
  return (props: any) => {

    const ptype: Record<string, any> = {};

    Object.keys(pt).forEach((e) => {
      const p = pt[e];

      if (p.type !== undefined) {
        if (typeof p.type !== "function" && !Array.isArray(p.type)) {
          console.warn(`Key "${e}" - type must be "String", "Number", "Array", "Object", "Function"`);
          return
        } else if (Array.isArray(p.type)) {
          for(let i = 0; i !== p.type.length; i++) {
            if (typeof p.type[i] !== "function") {
              console.warn(`Key "${e}" - type must be "String", "Number", "Array", "Object", "Function"`);
              return
            }
          }
        }
        if (p.required !== true) {
          if (p.required !== undefined && p.required === false && p.default !== undefined) {
            ptype[e] = p;
          } else {
            console.warn(`Key "${e}" - if "required" is set to "false" you must specify the default value "default"`)
            return
          }
        } else {
          ptype[e] = p;
        }
      } else {
        console.warn(`Key "${e}" - you must specify "type"`)
        return
      }
    })

    const obj = props;
    if (ptype !== undefined && Object.keys(ptype).length > 0 && props !== undefined) {
      Object.keys(ptype).forEach((e) => {
        const prop = ptype[e] ?? null;
        const value = obj[e];
        if (prop["required"] === true && value === undefined) {
          er(`MISS "${e}" key in props`)
          return;
        } else if (value === undefined) {
          if (prop["default"] !== undefined) {
            if (!Array.isArray(prop["type"]) && typeof prop["type"]() !== "function") {
              obj[e] = typeof prop["default"] === "function" ? prop["default"]() : prop["default"];
            } else {
              obj[e] = prop["default"];
            }
          }
          return;
        }
    
        if (Array.isArray(prop["type"]) && prop["type"].length >= 1) {
          let ch = 0;
          prop["type"].forEach((f) => {
            const v = f();
            if (checkTypeObject(v, value, e, true)) {
              ch += 1;
            }
          })
    
          if (ch === 0) {
            const isArray = Array.isArray(value);
            const typper = prop["type"].map((e) => {
              const t = e();
    
              const type = typeof t;
    
              if (type !== "object") return type
              else {
                if (Array.isArray(t)) return "array"
                else "object"
              }
            })
    
            console.warn(`Miss type key "${e}" expected "[${typper.join(", ")}]" but got "${
              typeof value !== 'object'
                ? typeof value 
                : isArray ? "array" : ""
            }"`)
            obj[e] = prop["default"] ?? prop["type"][0]();
          }
        } else {
          const v = prop["type"]();
          if(!checkTypeObject(v, value, e)) {
            const def = prop["default"] ?? v;
            if (typeof v === "function") {
              obj[e] = def;
            } else {
              obj[e] = typeof def === "function" ? def() : def;
            }
          }
        }
      })
    }
    return Node(node, obj)
  };
}