import { existsSync, statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function discoverWorkspace(fromDir?: string): WorkspaceRoot | null {
  let current = fromDir ?? process.cwd();
  while (true) {
    const configPath = join(current, CONFIG_FILENAME);
    if (existsSync(configPath) && statSync(configPath).isFile()) {
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
  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed)) {
    throw new Error(`Invalid config at ${workspaceRoot.configPath}: expected JSON object`);
  }
  const workspace = isRecord(parsed["workspace"]) ? parsed["workspace"] : {};
  const version = typeof parsed["version"] === "string" ? parsed["version"] : "0";
  return { ...parsed, version, workspace };
}

export function getConfig(key: string, workspaceRoot: WorkspaceRoot): unknown {
  const config = loadConfig(workspaceRoot);
  const parts = key.split(".");
  let current: unknown = config;
  for (const part of parts) {
    if (part.length === 0 || UNSAFE_KEYS.has(part)) {
      return undefined;
    }
    if (!isRecord(current) || !Object.prototype.hasOwnProperty.call(current, part)) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

export function setConfig(key: string, value: unknown, workspaceRoot: WorkspaceRoot): void {
  const config = loadConfig(workspaceRoot);
  const parts = key.split(".");
  const last = parts.pop();
  if (last === undefined || last.length === 0 || UNSAFE_KEYS.has(last)) {
    return;
  }
  let current = config as Record<string, unknown>;
  for (const part of parts) {
    if (part.length === 0 || UNSAFE_KEYS.has(part)) {
      return;
    }
    const next = current[part];
    if (!isRecord(next)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }
  current[last] = value;
  mkdirSync(dirname(workspaceRoot.configPath), { recursive: true });
  writeFileSync(workspaceRoot.configPath, JSON.stringify(config, null, 2), "utf8");
}