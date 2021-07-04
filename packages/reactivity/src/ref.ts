import { hasChanged, isArray, isObject } from "@vue/shared/src";
import { track, trigger } from "./effect";
import { TrackOrTypes, TriggerOrTypes } from "./operators";
import { reactive } from "./reactive";

const convert = (val) => (isObject(val) ? reactive(val) : val);

class RefImpl {
  public _value; // 声明一个_value属性(往实例上添加_value属性)
  public __v_isRef = true; // 表示是一个ref属性
  constructor(public rawValue, public shallow) {
    // (参数中前面增加修饰符,标识此属性放到了实例上)
    this._value = shallow ? rawValue : convert(rawValue);
  }
  get value() {
    // 代理:取值取value,会帮我们代理到_value上
    track(this, TrackOrTypes.GET, "value");
    return this._value;
  }
  set value(newValue) {
    if (hasChanged(newValue, this.rawValue)) {
      this.rawValue = newValue;
      this._value = this.shallow ? newValue : convert(newValue);
      trigger(this, TriggerOrTypes.SET, "value", newValue);
    }
  }
}

class ObjectRefImpl {
  public __v_isRef = true;
  constructor(public target, public key) {}
  get value() {
    // 代理
    return this.target[this.key]; // 如果原对象是响应式的就会依赖收集
  }
  set value(newValue) {
    this.target[this.key] = newValue; // 如果原来对象是响应式的,就会触发更新
  }
}

export function toRef(target, key) {
  return new ObjectRefImpl(target, key);
}

export function toRefs(object) {
  // object 可能是数组 或对象
  const ret = isArray(object) ? new Array(object.length) : {};
  for (let key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
function createRef(rawValue, shallow = false) {
  return new RefImpl(rawValue, shallow);
}
export function ref(value) {
  return createRef(value);
}

export function shallowRef(value) {
  return createRef(value, true);
}
