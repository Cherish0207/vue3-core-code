export const patchStyle = (el, prev, next) => {
  const style = el.style; //获取样式
  if (next == null) {
    el.removeAttribute("style"); // {style:{}}  {}
  } else {
    // 老的有新的没有{style:{color}} => {style:{background}}
    if (prev) {
      for (let key in prev) {
        if (next[key] == null) {
          style[key] = "";
        }
      }
    }
    // 新的需赋值到style上
    for (let key in next) {
      style[key] = next[key];
    }
  }
};
