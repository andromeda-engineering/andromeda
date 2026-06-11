import { describe, it, expect } from "vitest";
import * as mod from "./index.js";

describe("@andromeda-eng/avml", () => {
  it("exports a version", () => {
    expect(mod.AVML_VERSION).toBe("0.0.0");
  });
});
