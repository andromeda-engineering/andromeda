// `andromeda doctor` (repo-level): sanity-checks the toolchain + workspace layout.
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const checks = [];
const tool = (label, cmd) => {
  try {
    const out = execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    checks.push([true, `${label}: ${out.split("\n")[0]}`]);
  }
  catch {
    checks.push([false, `${label}: NOT FOUND (${cmd})`]);
  }
};

tool("node", "node --version");
tool("pnpm", "pnpm --version");
tool("cargo", "cargo --version");

for (const f of ["pnpm-workspace.yaml", "turbo.json", "tsconfig.base.json", "Cargo.toml"]) {
  checks.push([existsSync(f), `workspace file: ${f}`]);
}

let ok = true;
for (const [pass, msg] of checks) {
  console.log(`${pass ? "✓" : "✗"} ${msg}`);
  if (!pass) ok = false;
}

console.log(ok ? "\nAll checks passed." : "\nSome checks failed.");
process.exit(ok ? 0 : 1);
