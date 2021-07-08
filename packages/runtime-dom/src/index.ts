import { nodeOps } from "./nodeOps"; // 对象
import { patchProp } from "./patchProp"; // 方法
import { createRenderer } from "@vue/runtime-core";

const rendererOptions = Object.assign({ patchProp }, nodeOps); // 渲染时用到的所有方法

/*
function createRenderer(rendererOptions){
  return {
    createApp(rootComponent, rootProps) {
      const app = {
        mount(container) {
          console.log(container, rootComponent, rootProps, rendererOptions);
        },
      };
      return app;
    },
  };
}
*/
export function createApp(rootComponent, rootProps = null) {
  const app = createRenderer(rendererOptions).createApp(
    rootComponent,
    rootProps
  );
  let { mount } = app;
  // 函数劫持,重写mount(清空容器)
  app.mount = function (container) {
    container = nodeOps.querySelector(container);
    container.innerHTML = "";
    mount(container); // 将组件渲染成dom元素,进行挂载
  };
  return app;
}

export * from "@vue/runtime-core";
