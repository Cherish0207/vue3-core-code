import { createVNode } from "./vnode";

/**
 * 1.根据组件rootComponent和属性rootProps创建虚拟节点
 * 2.根据虚拟节点vnode和容器container,调用render方法渲染
 */
export function createAppAPI(render) {
  return function createApp(rootComponent, rootProps) {
    const app = {
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      mount(container) {
        const vnode = createVNode(rootComponent, rootProps);
        render(vnode, container);
        app._container = container;
      },
    };
    return app;
  };
}
