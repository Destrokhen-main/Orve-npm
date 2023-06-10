import er, { message as m } from "./error";
import { typeOf } from "../../usedFunction/typeOf";

const checkTypeObject = (type: string, value: unknown, e: string, typechecker = true) => {
  const v = type;

  if (typeof v === "object") {
    if (Array.isArray(v)) {
      if (!Array.isArray(value)) {
        if (typechecker)
          console.warn(`Error type key "${e}" expected "array" but got "${typeof value}"`);
        else
          return false;
      }
    } else {
      if (typeof value !== "object" || Array.isArray(value)) {
        if (typechecker) {
          const isArray = Array.isArray(value);
          console.warn(`Error type key "${e}" expected "${typeof v}" but got "${
            typeof value !== 'object'
              ? typeof value 
              : isArray ? "array" : ""
          }"`)
        } else
          return false;
      }
    }
  } else {
    if (typeof value !== typeof v) {
      if (typechecker)
        console.warn(`Error type key "${e}" expected "${typeof v}" but got "${typeof value}"`);
      else
        return false;
    }
  }

  if (!typechecker) return true;
}

const KEYS = ["tag", "props", "child", "hooks", "key", "ref", "html", "$refoparams", "ptype"];
function isONode(node: Record<string, any>) {
  if (!node["tag"]) {
    er(m.MISSING_TAG);
  }

  Object.keys(node).forEach((key) => {
    if (!KEYS.includes(key.toLowerCase())) {
      er(`${String(JSON.stringify(node)).substring(0, 50)}... "${key}" - ${m.UNSUPPORTED_KEY_IN_OBJECT}`);
    }
  });

  if (node["props"] && typeOf(node["props"]) !== "object") {
    er(`${String(node).substring(0, 50)}... ${node["props"]} - ${m.PROPS_NOT_A_NEED_TYPE}`);
  }

  if (node["ptype"] !== undefined && Object.keys(node["ptype"]).length > 0 && node["props"] !== undefined) {
    const props = node["ptype"];
    const obj = node["props"];
    console.log(node);
    Object.keys(props).forEach((e) => {
      const prop = props[e] ?? null;
      const value = obj[e];
    
      if (prop !== null) {
        if (prop["required"] === true && value === undefined) {
          er(`MISS "${e}" key in props`)
          return;
        } else if (value === undefined) {
          if (prop["default"] !== undefined) {
            obj[e] = typeof prop["default"] === "function" ? prop["default"]() : prop["default"];
          }
          return;
        }
    
        if (typeof prop["type"] !== "function" && Array.isArray(prop["type"]) && prop["type"].length >= 1) {
          let ch = 0;
          prop["type"].forEach((f) => {
            const v = f();
            if (checkTypeObject(v, value, e, false)) {
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
          }
        } else {
          const v = prop["type"]();
          checkTypeObject(v, value, e);
        }
      }
    })
  }

  return true;
}

function isNodeBoolean(node: Record<string, any>) {
  if (!node["tag"]) {
    return false;
  }

  if (node["props"] && typeOf(node["props"]) !== "object") {
    return false;
  }

  let checker = true;
  Object.keys(node).forEach((key) => {
    if (!KEYS.includes(key.toLowerCase())) {
      checker = false;
    }
  });

  return checker;
}

export { isONode, isNodeBoolean };
