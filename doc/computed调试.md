#### 1.定义计算属性时

![Pasted Graphic 1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35a924900daa4ebd818df67ce2ab4726~tplv-k3u1fbpfcp-watermark.image)

##### 此时不会执行回调,只是创建了一个 ComputedRefImpl 实例

![Pasted Graphic 2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae6fe11d28af458d8111c730f27978f0~tplv-k3u1fbpfcp-watermark.image)

#### 2.第一次取值时,dirty 为 true,执行回调,同时把 dirty 改为 false

![Pasted Graphic 3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df7d5f45653f477ba6e5e9f148d4b980~tplv-k3u1fbpfcp-watermark.image)

##### 第二次取值 dirty 为 false,直接返回值

![Pasted Graphic 4.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d02c57e4a7f64622a4a37df8878583d5~tplv-k3u1fbpfcp-watermark.image)

#### 3.更改 age—>age 的 trigger-->scheduler

![Pasted Graphic 5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/871a16f4102f40618ac0a4b98bbd970c~tplv-k3u1fbpfcp-watermark.image)

![Pasted Graphic 6.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7edafe30c39c455fbb0fea284fde876a~tplv-k3u1fbpfcp-watermark.image)

![Pasted Graphic 7.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9610b257bc164978a1ea9380d79d585f~tplv-k3u1fbpfcp-watermark.image)

![Pasted Graphic 8.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e9b7493cf7d4ea7a94e732f327c185d~tplv-k3u1fbpfcp-watermark.image)

> 代码附上:[github](https://github.com/Cherish0207/vue3-core-code)
