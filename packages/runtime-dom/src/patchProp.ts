import { patchAttr } from "./modules/attr";
import { patchClass } from "./modules/class";
import { patchEvent } from "./modules/events";
import { patchStyle } from "./modules/style";

export const patchProp = (el, key, prevValue, nextValue) => {
  switch (key) {
    case "class":
      patchClass(el, nextValue); // 比对属性
      break;
    case "style": // {style:{color:'red'}}  {style:{background:'red'}}
      patchStyle(el, prevValue, nextValue);
      break;
    default:
      if (/^on[^a-z]/.test(key)) {
        patchEvent(el, key, nextValue); // 事件就是添加/删除/修改
      } else {
        // 如果不是事件,才是属性
        patchAttr(el, key, nextValue);
      }
      break;
  }
};
