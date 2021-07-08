const execa = require("execa");
const target = "runtime-dom";
build(target);
async function build(target) {
  await execa("rollup", ["-cw", "--environment", `TARGET:${target}`], {
    stdio: "inherit",
  });
}
