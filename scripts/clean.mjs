// Removes per-package build/test output. Run from a package directory via turbo.
import { rmSync } from "node:fs";

for (const dir of ["dist", "coverage", ".turbo"]) {
  rmSync(dir, { recursive: true, force: true });
}
