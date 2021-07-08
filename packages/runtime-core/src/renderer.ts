import { effect } from "@vue/reactivity";
import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
import { queueJob } from "./scheduler";
import { normalizeVNode, Text } from "./vnode";

export function createRenderer(rendererOptions) {
  // 告诉core怎么渲染
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
  } = rendererOptions;
  // -------------------组件----------------------
  const setupRenderEfect = (instance, container) => {
    // 创建一个effect 在effect中调用render方法，
    // 这样render方法中拿到的数据会收集这个effect，属性更新时effect会重新执行
    // 每个组件都有一个effect， 所以vue是组件级更新，数据变化会重新执行对应组件的effect,一个组件配一个effect
    instance.update = effect(
      function componentEffect() {
        if (!instance.isMounted) {
          let proxyToUse = instance.proxy;
          // vue2:$vnode --> _vnode
          // vue3:vnode组件 --> subTree组件对应的渲染内容节点
          let subTree = (instance.subTree = instance.render.call(
            proxyToUse,
            proxyToUse
          ));
          // 初次渲染,用render函数的返回值继续渲染
          patch(null, subTree, container);
          instance.isMounted = true;
        } else {
          console.log('update');
          // 更新逻辑
        }
      },
      { scheduler: queueJob }
    );
  };
  /**
   * 组件的渲染流程:调用setup拿到返回值，获取render函数返回的结果进行渲染
   * 1.先有实例
   * 2.需要的数据解析到实例上
   * 3.创建一个effect 让render函数执行
   * @param initialVNode
   * @param container
   */
  const mountComponent = (initialVNode, container) => {
    const instance = (initialVNode.component =
      createComponentInstance(initialVNode));
    setupComponent(instance); // state props attrs render ...
    setupRenderEfect(instance, container);
  };
  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      mountComponent(n2, container); // 组件初始化流程
    } else {
      // 组件更新流程
    }
  };
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      let child = normalizeVNode(children[i]);
      patch(null, child, container);
    }
  };
  const mountElement = (vnode, container) => {
    // 递归渲染
    const { props, shapeFlag, type, children } = vnode;
    let el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children); // 文本比较简单 直接扔进去即可
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }
    hostInsert(el, container);
  };
  const processElement = (n1, n2, container) => {
    if (n1 == null) {
      mountElement(n2, container);
    } else {
      // 元素更新
    }
  };
  const processText = (n1, n2, container) => {
    if (n1 == null) {
      hostInsert((n2.el = hostCreateText(n2.children)), container);
    }
  };
  /**
   * @param n1 oldVDOM
   * @param n2 newVDOM
   * @param container 容器
   */
  const patch = (n1, n2, container) => {
    console.log(n1, n2, container);
    
    // 针对不同类型做初始化操作
    const { shapeFlag, type } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container);
        }
    }
  };
  /**
   * render:core的核心,根据不同虚拟节点创建对应的真实元素
   * @param vnode 虚拟节点
   * @param container 容器
   */
  const render = (vnode, container) => {
    // 初次调用render,是初始化流程
    patch(null, vnode, container);
  };
  return {
    createApp: createAppAPI(render),
  };
}
