import { describe, it, expect } from "vitest";
import * as mod from "./index.js";

describe("@andromeda-eng/config", () => {
  it("exports a version", () => {
    expect(mod.CONFIG_VERSION).toBe("0.0.0");
  });
});
