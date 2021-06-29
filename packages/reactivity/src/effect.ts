export function effect(fn, options: any = {}) {
  // effect-->响应的effect(数据变化重新执行)
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect();
  }
  return effect;
}

let uid = 0;
let activeEffect;
let effectStack = [];
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (effectStack.includes(effect)) return;
    try {
      activeEffect = effect;
      effectStack.push(effect); // 这里放的是effect函数的引用地址
      fn(); // fn执行时会取值-->执行get方法
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  effect.id = uid++;
  effect._isEffect = true;
  effect.raw = fn;
  effect.options = options;
  return effect;
}

// 让某个对象中的属性收集对应的effect函数
const targetMap = new WeakMap();
export function track(target, type, key) {
  // console.log(target, key, activeEffect.id);
  if (activeEffect === undefined) return; // 此属性不用收集依赖，因为没在effect中使用
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
  console.log(targetMap);
}
