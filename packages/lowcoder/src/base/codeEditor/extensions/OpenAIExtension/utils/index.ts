interface TernDef {
  // @ts-ignore
  "!name"?: string;
  [key: string]: string | TernDef | FunctionType;
}

interface FunctionType {
  "!type": string;
}

export function generateTernDefs(obj: any, name?: string): TernDef {
  let defs: TernDef = {
    // "!name": name || "METADATA",
  };

  for (let key in obj) {
    let type = typeof obj[key];
    switch (type) {
      case "function":
        defs[key] = { "!type": "fn(...[?]) -> ?" };
        break;
      case "string":
        defs[key] = "string";
        break;
      case "number":
        defs[key] = "number";
        break;
      case "boolean":
        defs[key] = "bool";
        break;
      case "object":
        if (Array.isArray(obj[key])) {
          defs[key] = "[?]";
        } else if (obj[key] !== null) {
          defs[key] = generateTernDefs(obj[key], key);
        } else {
          defs[key] = "null";
        }
        break;
      default:
        defs[key] = "?";
        break;
    }
  }

  return defs;
}
