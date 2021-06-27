import { isObject } from "@vue/shared/src";

import { reactive, readonly } from "./reactive";
debugger;
const createGetter =
  (isReadonly = false, shallow = false) =>
  (target, key, receiver) => {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // 收集依赖，数据变化后更新视图
      console.log("执行effect时会取值", "收集effect");
    }
    if (shallow) return res;
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
const createSetter =
  (shallow = false) =>
  (target, key, value, receiver) => {
    const result = Reflect.set(target, key, value, receiver);
    return result;
  };

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const showllowReadonlyGet = createGetter(true, true);
const set = createSetter();
const shallowSet = createSetter(true);
const readonlySet = {
  set: (_, key) => console.warn(`set on key ${key} falied`),
};
export const mutableHandlers = { get, set };
export const shallowReactiveHandlers = { get: shallowGet, set: shallowSet };
export const readonlyHandlers = { get: readonlyGet, set: readonlySet };
export const shallowReadonlyHandlers = {
  get: showllowReadonlyGet,
  set: readonlySet,
};
