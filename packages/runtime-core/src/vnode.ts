import { isArray, isObject, isString, ShapeFlags } from "@vue/shared";

export function isVnode(vnode) {
  return vnode.__v_isVnode;
}
/**
 * createVNode:创建虚拟节点(h方法)
 * h('div',{style:{color:red}},'children');
 * @param type 组件 or 普通元素
 * @param props 属性
 * @param children 插槽
 * @returns vnode
 */
export const createVNode = (type, props, children = null) => {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;

  // 虚拟节点,就是一个对象来描述对应的内容(具有跨平台能力)
  const vnode = {
    __v_isVnode: true, // 虚拟节点标识
    type,
    props,
    children,
    component: null, // 存放组件对应的实例
    el: null, // 稍后会将虚拟节点和真实节点对应起来
    key: props && props.key, // diff算法会用到key
    shapeFlag, // 判断出当前自己的类型 和 儿子的类型
  };
  normalizeChildren(vnode, children);
  return vnode;
};

function normalizeChildren(vnode, children) {
  let type = 0;
  if (children == null) {
    // 不对儿子进行处理
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else {
    type = ShapeFlags.TEXT_CHILDREN;
  }
  vnode.shapeFlag |= type;
}
export const Text = Symbol("Text");
export function normalizeVNode(child) {
  if (isObject(child)) return child;
  return createVNode(Text, null, String(child));
}
