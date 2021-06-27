const fs = require("fs");
const execa = require("execa"); // 开启子进程打包，最终还是使用rollup来进行打包

// 过滤packages目录下的文件，保留文件夹
const targets = fs.readdirSync("packages").filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  return true;
});

// 对目标依次、并行打包
async function build(target) {
  // rollup  -c --environment TARGET:shated
  await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {
    stdio: "inherit",
  }); // 当子进程打包的信息共享给父进程
}

function runParallel(targets, iteratorFn) {
  const res = [];
  for (const item of targets) {
    const p = iteratorFn(item);
    res.push(p);
  }
  return Promise.all(res);
}

runParallel(targets, build);
