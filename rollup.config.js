import path from "path";
import json from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-typescript2";

// 1.根据环境变量中的target属性 获取对应模块中的 pakcage.json
const packagesDir = path.resolve(__dirname, "packages");
const packageDir = path.resolve(packagesDir, process.env.TARGET); // packageDir 找到要打包的某个包/打包的基准目录
const resolve = (p) => path.resolve(packageDir, p);
const pkg = require(resolve("package.json"));
const name = path.basename(packageDir); // 取文件名 或者process.env.TARGET

// 对打包类型的映射表，根据提供的formats格式化需要打包的内容
const outputConfig = {
  // 自定义的
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: "es",
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: "iife", // 立即执行函数
  },
};
const options = pkg.buildOptions;

// 生成rollup配置
function createConfig(format, output) {
  output.name = options.name;
  output.sourcemap = true; // 生成sourcemap

  return {
    input: resolve(`src/index.ts`),
    output,
    plugins: [
      json(),
      ts({
        // ts 插件
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      resolvePlugin(), // 解析第三方模块插件
    ],
  };
}
// rollup 最终需要到出配置
export default options.formats.map((format) =>
  createConfig(format, outputConfig[format])
);
