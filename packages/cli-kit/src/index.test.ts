import { describe, it, expect } from "vitest";
import * as mod from "./index.js";

describe("@andromeda-eng/cli-kit", () => {
  it("exports a version", () => {
    expect(mod.CLI_KIT_VERSION).toBe("0.0.0");
  });
});
