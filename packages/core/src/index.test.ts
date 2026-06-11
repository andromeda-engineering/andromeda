import { describe, it, expect } from "vitest";
import * as mod from "./index.js";

describe("@andromeda-eng/core", () => {
  it("exports a version", () => {
    expect(mod.CORE_VERSION).toBe("0.0.0");
  });
});
