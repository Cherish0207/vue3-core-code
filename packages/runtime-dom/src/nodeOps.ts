export const nodeOps = {
  // 不同的平台(如浏览器、小程序)创建元素方式不同
  // 元素操作
  createElement: (tagName) => document.createElement(tagName), // 创建tagName元素
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  insert: (child, parent, anchor = null) => {
    parent.insertBefore(child, anchor); // 如果参照物anchor为空,insertBefore相当于appendChild
  },
  querySelector: (selector) => document.querySelector(selector), // 查找
  setElementText: (el, text) => (el.textContent = text), // 设置元素内容(innerHTML不安全)
  // 文本操作
  createText: (text) => document.createTextNode(text), // 创建文本
  setText: (node, text) => (node.nodeValue = text),
};
