// Defense-in-depth guard for the public repo.
//
// The real public/private boundary is enforced upstream in the private repo and
// structurally here (private code simply doesn't exist in this repo). This guard
// is a belt-and-suspenders check that fails CI if a NON-PUBLIC `@andromeda-eng/*`
// package or `andromeda-*` crate is ever referenced in the dependency surface.
//
// It is ALLOWLIST-derived: it computes the set of packages/crates that actually
// live in this repo and flags any in-namespace reference outside that set. So it
// hardcodes ZERO private product names — any future private package is caught
// automatically, and nothing private is named in this file.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const SKIP_DIRS = new Set(["node_modules", "dist", "target", ".turbo", ".git", "coverage"]);
// Scan the dependency/import surface (source + manifests + workflows). Markdown
// prose is excluded — it is not a dependency edge.
const SCAN_EXT = /\.(ts|tsx|mts|cts|js|mjs|cjs|json|toml|yaml|yml|rs)$/;

function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  }
  catch {
    return acc;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

// --- Derive the public allowlist from what actually lives in this repo ---
function packageNames(...globDirs) {
  const names = new Set();
  for (const globDir of globDirs) {
    let dirs;
    try {
      dirs = readdirSync(join(root, globDir));
    }
    catch {
      continue;
    }
    for (const d of dirs) {
      try {
        const pkg = JSON.parse(readFileSync(join(root, globDir, d, "package.json"), "utf8"));
        if (pkg.name) names.add(pkg.name);
      }
      catch { /* not a package */ }
    }
  }
  return names;
}

function crateNames(...globDirs) {
  const names = new Set();
  for (const globDir of globDirs) {
    let dirs;
    try {
      dirs = readdirSync(join(root, globDir));
    }
    catch {
      continue;
    }
    for (const d of dirs) {
      try {
        const toml = readFileSync(join(root, globDir, d, "Cargo.toml"), "utf8");
        const m = toml.match(/^\s*name\s*=\s*"([^"]+)"/m);
        if (m) names.add(m[1]);
      }
      catch { /* skip */ }
    }
  }
  return names;
}

const publicPackages = packageNames("packages", "apps");
const publicCrates = crateNames("crates");

// --- Flag any in-namespace reference outside the public allowlist ---
const PKG_REF = /@andromeda-eng\/[a-z0-9][a-z0-9-]*/g;
const CRATE_REF = /\bandromeda-[a-z0-9][a-z0-9-]*\b/g;

const violations = [];
for (const file of walk(root)) {
  if (!SCAN_EXT.test(file)) continue;
  const rel = file.slice(root.length + 1);
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(PKG_REF)) {
    if (!publicPackages.has(m[0])) violations.push(`${rel}: non-public package reference "${m[0]}"`);
  }
  for (const m of text.matchAll(CRATE_REF)) {
    // "andromeda-engineering" / "andromeda-eng" are the org/scope, not crates.
    if (m[0] === "andromeda-engineering" || m[0] === "andromeda-eng") continue;
    if (!publicCrates.has(m[0])) violations.push(`${rel}: non-public crate reference "${m[0]}"`);
  }
}

if (violations.length) {
  console.error("Non-public (private/internal) references leaked into the public repo:");
  for (const v of [...new Set(violations)]) console.error("  - " + v);
  process.exit(1);
}

console.log(`Public tree is clean (${publicPackages.size} packages, ${publicCrates.size} crates allowlisted).`);
