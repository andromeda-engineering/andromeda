// Defense-in-depth guard for the PUBLIC mirror repo.
//
// The real public/private boundary is enforced upstream in the private repo
// (scripts/check-public-boundaries.mjs) and structurally here — private code
// simply does not exist in this repo. This guard is a belt-and-suspenders check
// that fails CI if a private package/crate name or a known-internal marker ever
// leaks into a source/config file in the public tree.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const root = process.cwd();

// Private package/crate names + internal markers that must never appear here.
const FORBIDDEN = [
  "@andromeda-eng/chronicle",
  "@andromeda-eng/connectors",
  "@andromeda-eng/foldspace",
  "@andromeda-eng/workbench",
  "andromeda-chronicle",
  "andromeda-foldspace",
  "MyNameReallySux/andromeda",
  "andromeda-internal",
];

const SKIP_DIRS = new Set(["node_modules", "dist", "target", ".turbo", ".git", "coverage"]);
// Scan the dependency/import surface (source + manifests + workflows). Markdown
// docs are intentionally excluded: CONTRIBUTING/SECURITY legitimately *name* the
// private packages to document the boundary, and prose is not a dependency edge.
const SCAN_EXT = /\.(ts|tsx|mts|cts|js|mjs|cjs|json|toml|yaml|yml|rs)$/;

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const violations = [];
for (const file of walk(root)) {
  // Don't flag this guard's own definition list.
  if (basename(file) === "check-no-private-refs.mjs") continue;
  if (!SCAN_EXT.test(file)) continue;
  const text = readFileSync(file, "utf8");
  for (const needle of FORBIDDEN) {
    if (text.includes(needle)) {
      violations.push(`${file.slice(root.length + 1)} references private/internal "${needle}"`);
    }
  }
}

if (violations.length) {
  console.error("Private/internal references leaked into the public repo:");
  for (const v of violations) console.error("  - " + v);
  process.exit(1);
}

console.log("No private/internal references found. Public tree is clean.");
