import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as mod from "./index.js";

let tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "and-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe("@andromeda-eng/config", () => {
  it("exports a version", () => {
    expect(mod.CONFIG_VERSION).toBe("0.0.0");
  });

  describe("discoverWorkspace", () => {
    it("finds .andromeda.json by walking up", () => {
      const rootDir = makeTempDir();
      const configPath = join(rootDir, ".andromeda.json");
      writeFileSync(configPath, JSON.stringify({ version: "1", workspace: {} }), "utf8");
      const childDir = mkdtempSync(join(rootDir, "child-"));
      tempDirs.push(childDir);

      const result = mod.discoverWorkspace(childDir);

      expect(result).not.toBeNull();
      expect(result!.path).toBe(rootDir);
      expect(result!.configPath).toBe(configPath);
    });

    it("returns null when no .andromeda.json exists", () => {
      const dir = makeTempDir();
      const result = mod.discoverWorkspace(dir);
      expect(result).toBeNull();
    });

    it("finds .andromeda.json in the start dir itself", () => {
      const dir = makeTempDir();
      const configPath = join(dir, ".andromeda.json");
      writeFileSync(configPath, JSON.stringify({ version: "1", workspace: {} }), "utf8");

      const result = mod.discoverWorkspace(dir);

      expect(result).not.toBeNull();
      expect(result!.path).toBe(dir);
      expect(result!.configPath).toBe(configPath);
    });
  });

  describe("loadConfig", () => {
    it("returns default config when file does not exist", () => {
      const dir = makeTempDir();
      const workspaceRoot: mod.WorkspaceRoot = {
        path: dir,
        configPath: join(dir, ".andromeda.json"),
      };

      const config = mod.loadConfig(workspaceRoot);

      expect(config.version).toBe("0");
      expect(config.workspace).toEqual({});
    });

    it("loads and parses existing config", () => {
      const dir = makeTempDir();
      const configPath = join(dir, ".andromeda.json");
      const data = { version: "1", workspace: { name: "my-workspace" } };
      writeFileSync(configPath, JSON.stringify(data), "utf8");

      const workspaceRoot: mod.WorkspaceRoot = { path: dir, configPath };
      const config = mod.loadConfig(workspaceRoot);

      expect(config.version).toBe("1");
      expect(config.workspace.name).toBe("my-workspace");
    });
  });

  describe("getConfig / setConfig round-trip", () => {
    it("sets and gets a top-level key", () => {
      const dir = makeTempDir();
      const workspaceRoot: mod.WorkspaceRoot = {
        path: dir,
        configPath: join(dir, ".andromeda.json"),
      };
      writeFileSync(workspaceRoot.configPath, JSON.stringify({ version: "1", workspace: {} }), "utf8");

      mod.setConfig("version", "2", workspaceRoot);
      const result = mod.getConfig("version", workspaceRoot);

      expect(result).toBe("2");
    });

    it("sets and gets a nested dot-notation key", () => {
      const dir = makeTempDir();
      const workspaceRoot: mod.WorkspaceRoot = {
        path: dir,
        configPath: join(dir, ".andromeda.json"),
      };
      writeFileSync(workspaceRoot.configPath, JSON.stringify({ version: "1", workspace: {} }), "utf8");

      mod.setConfig("workspace.name", "my-project", workspaceRoot);
      const result = mod.getConfig("workspace.name", workspaceRoot);

      expect(result).toBe("my-project");
    });

    it("sets a deeply nested key creating intermediate objects", () => {
      const dir = makeTempDir();
      const workspaceRoot: mod.WorkspaceRoot = {
        path: dir,
        configPath: join(dir, ".andromeda.json"),
      };
      writeFileSync(workspaceRoot.configPath, JSON.stringify({ version: "1", workspace: {} }), "utf8");

      mod.setConfig("workspace.meta.author", "alice", workspaceRoot);
      const result = mod.getConfig("workspace.meta.author", workspaceRoot);

      expect(result).toBe("alice");
    });

    it("returns undefined for a missing key", () => {
      const dir = makeTempDir();
      const workspaceRoot: mod.WorkspaceRoot = {
        path: dir,
        configPath: join(dir, ".andromeda.json"),
      };
      writeFileSync(workspaceRoot.configPath, JSON.stringify({ version: "1", workspace: {} }), "utf8");

      const result = mod.getConfig("workspace.missing", workspaceRoot);

      expect(result).toBeUndefined();
    });
  });
});
