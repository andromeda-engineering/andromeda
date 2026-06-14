import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

export const CONFIG_VERSION = "0.0.0";

export interface AndromedaConfig {
  version: string;
  workspace: {
    name?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface WorkspaceRoot {
  path: string;
  configPath: string;
}

const CONFIG_FILENAME = ".andromeda.json";

export function discoverWorkspace(fromDir?: string): WorkspaceRoot | null {
  let current = fromDir ?? process.cwd();
  while (true) {
    const configPath = join(current, CONFIG_FILENAME);
    if (existsSync(configPath)) {
      return { path: current, configPath };
    }
    const parent = dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

export function loadConfig(workspaceRoot: WorkspaceRoot): AndromedaConfig {
  if (!existsSync(workspaceRoot.configPath)) {
    return { version: "0", workspace: {} };
  }
  const raw = readFileSync(workspaceRoot.configPath, "utf8");
  return JSON.parse(raw) as AndromedaConfig;
}

export function getConfig(key: string, workspaceRoot: WorkspaceRoot): unknown {
  const config = loadConfig(workspaceRoot);
  const parts = key.split(".");
  let current: unknown = config;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function setConfig(key: string, value: unknown, workspaceRoot: WorkspaceRoot): void {
  const config = loadConfig(workspaceRoot);
  const parts = key.split(".");
  const last = parts.pop();
  if (last === undefined) {
    return;
  }
  let current = config as Record<string, unknown>;
  for (const part of parts) {
    const next = current[part];
    if (typeof next !== "object" || next === null) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }
  current[last] = value;
  mkdirSync(dirname(workspaceRoot.configPath), { recursive: true });
  writeFileSync(workspaceRoot.configPath, JSON.stringify(config, null, 2), "utf8");
}
