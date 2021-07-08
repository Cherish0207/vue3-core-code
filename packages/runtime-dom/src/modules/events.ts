export const patchEvent = (el, key, value) => {
  // vue指令 删除和添加
  // 对函数的缓存
  // vue事件调用(vue events invokers)
  const invokers = el._vei || (el._vei = {}); // 元素上所有的事件调用
  const exists = invokers[key];
  const eventName = key.slice(2).toLowerCase();
  if (value && exists) {
    // 之前绑定过此事件,覆盖
    exists.value = value;
    return;
  }
  if (value && !exists) {
    // 之前没有绑定过此事件,现在有事件需要绑定
    let invoker = (invokers[key] = createInvoker(value));
    el.addEventListener(eventName, invoker);
    return;
  }
  // 之前绑定了,当时没有value
  el.removeEventListener(eventName, exists);
  invokers[key] = undefined;
};
function createInvoker(value) {
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = value; // 方便随时更改value属性
  return invoker;
}

//

/**
 * 一个元素 绑定事件
 * ❌ addEventListener(fn) addEventListener(fn1) --> 绑定了2次
 *
 * value = fn
 * div @click="fn"  ()=> value()
 * div @click="fn1"
 */
