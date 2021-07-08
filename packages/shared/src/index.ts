export const isObject = (value) => typeof value == "object" && value !== null;
export const isArray = Array.isArray;
export const isFunction = (value) => typeof value == "function";
export const isString = (value) => typeof value === "string";
export const isIntegerKey = (key) => parseInt(key) + "" === key;
export const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);
export const hasChanged = (oldValue, value) => oldValue !== value;
export * from "./shapeFlag";