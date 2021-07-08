import {
  hasChanged,
  hasOwn,
  isArray,
  isIntegerKey,
  isObject,
} from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOrTypes, TriggerOrTypes } from "./operators";
import { reactive, readonly } from "./reactive";

const createGetter =
  (isReadonly = false, shallow = false) =>
  (target, key, receiver) => {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // 收集依赖，数据变化后更新视图
      track(target, TrackOrTypes.GET, key);
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
    const oldValue = target[key]; // 获取老的值
    let hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (!hadKey) {
      trigger(target, TriggerOrTypes.ADD, key, value); // 新增
    } else if (hasChanged(oldValue, value)) {
      trigger(target, TriggerOrTypes.SET, key, value, oldValue); // 修改
    }
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
