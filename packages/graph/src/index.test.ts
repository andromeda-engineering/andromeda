import { describe, it, expect } from "vitest";
import * as mod from "./index.js";

describe("@andromeda-eng/graph", () => {
  it("exports a version", () => {
    expect(mod.GRAPH_VERSION).toBe("0.0.0");
  });
});
