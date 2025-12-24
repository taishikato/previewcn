import * as fs from "fs/promises";
import * as path from "path";

type ComponentsJson = {
  aliases?: {
    ui?: string;
    components?: string;
  };
};

type TsConfig = {
  extends?: string;
  compilerOptions?: {
    baseUrl?: string;
    paths?: Record<string, string[]>;
  };
};

type PreviewcnPaths = {
  uiAlias: string;
  importPath: string;
  targetDir: string;
};

const JSON_FILE_SUFFIX = ".json";

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function ensureJsonExtension(filePath: string): string {
  if (filePath.endsWith(JSON_FILE_SUFFIX)) return filePath;
  return `${filePath}${JSON_FILE_SUFFIX}`;
}

function resolveExtendsPath(
  configPath: string,
  extendsPath: string
): string | null {
  if (extendsPath.startsWith(".")) {
    return path.resolve(
      path.dirname(configPath),
      ensureJsonExtension(extendsPath)
    );
  }

  if (path.isAbsolute(extendsPath)) {
    return ensureJsonExtension(extendsPath);
  }

  return null;
}

function resolvePaths(
  paths: Record<string, string[]> | undefined,
  configDir: string,
  baseUrl?: string
): Record<string, string[]> {
  if (!paths) return {};

  const basePath = baseUrl ? path.resolve(configDir, baseUrl) : configDir;
  const resolved: Record<string, string[]> = {};

  for (const [key, values] of Object.entries(paths)) {
    resolved[key] = values.map((value) => path.resolve(basePath, value));
  }

  return resolved;
}

async function loadPathMappings(
  configPath: string,
  visited = new Set<string>()
): Promise<Record<string, string[]>> {
  if (visited.has(configPath)) return {};
  visited.add(configPath);

  const config = await readJsonFile<TsConfig>(configPath);
  if (!config) return {};

  const configDir = path.dirname(configPath);
  const localPaths = resolvePaths(
    config.compilerOptions?.paths,
    configDir,
    config.compilerOptions?.baseUrl
  );

  if (!config.extends) {
    return localPaths;
  }

  const extendsPath = resolveExtendsPath(configPath, config.extends);
  if (!extendsPath) {
    return localPaths;
  }

  const basePaths = await loadPathMappings(extendsPath, visited);
  return { ...basePaths, ...localPaths };
}

async function loadCompilerPaths(
  cwd: string
): Promise<Record<string, string[]>> {
  const tsconfigPath = path.join(cwd, "tsconfig.json");
  const jsconfigPath = path.join(cwd, "jsconfig.json");

  const tsPaths = await loadPathMappings(tsconfigPath);
  if (Object.keys(tsPaths).length > 0) {
    return tsPaths;
  }

  return loadPathMappings(jsconfigPath);
}

function matchAliasPattern(alias: string, pattern: string): string | null {
  const wildcardIndex = pattern.indexOf("*");
  if (wildcardIndex === -1) {
    return alias === pattern ? "" : null;
  }

  const prefix = pattern.slice(0, wildcardIndex);
  const suffix = pattern.slice(wildcardIndex + 1);

  if (!alias.startsWith(prefix) || !alias.endsWith(suffix)) return null;
  return alias.slice(prefix.length, alias.length - suffix.length);
}

function resolveAliasWithPaths(
  alias: string,
  paths: Record<string, string[]>
): string | null {
  for (const [pattern, targets] of Object.entries(paths)) {
    const wildcardValue = matchAliasPattern(alias, pattern);
    if (wildcardValue === null) continue;

    const target = targets[0];
    if (!target) continue;

    if (pattern.includes("*")) {
      return target.replace("*", wildcardValue);
    }

    return target;
  }

  return null;
}

async function resolveUiDir(cwd: string, uiAlias: string): Promise<string> {
  if (path.isAbsolute(uiAlias)) return uiAlias;

  if (uiAlias.startsWith("./") || uiAlias.startsWith("../")) {
    return path.resolve(cwd, uiAlias);
  }

  const paths = await loadCompilerPaths(cwd);
  const resolvedFromPaths = resolveAliasWithPaths(uiAlias, paths);
  if (resolvedFromPaths) return resolvedFromPaths;

  if (uiAlias.startsWith("@/")) {
    const relativePath = uiAlias.replace(/^@\//, "");
    try {
      await fs.access(path.join(cwd, "src"));
      return path.join(cwd, "src", relativePath);
    } catch {
      return path.join(cwd, relativePath);
    }
  }

  return path.join(cwd, uiAlias);
}

/**
 * Resolve the UI alias from components.json
 * Priority:
 * 1. aliases.ui if present (e.g., @/components/ui)
 * 2. aliases.components + /ui if present
 * 3. Fallback to @/components/ui
 */
export async function resolveUiAlias(cwd: string): Promise<string> {
  const componentsJsonPath = path.join(cwd, "components.json");

  try {
    const content = await fs.readFile(componentsJsonPath, "utf-8");
    const config: ComponentsJson = JSON.parse(content);

    if (config.aliases?.ui) {
      return config.aliases.ui;
    }

    if (config.aliases?.components) {
      return `${config.aliases.components}/ui`;
    }
  } catch {
    // File doesn't exist or parse error - use fallback
  }

  return "@/components/ui";
}

export async function resolvePreviewcnPaths(
  cwd: string
): Promise<PreviewcnPaths> {
  const uiAlias = await resolveUiAlias(cwd);
  const uiDir = await resolveUiDir(cwd, uiAlias);

  return {
    uiAlias,
    importPath: `${uiAlias}/previewcn`,
    targetDir: path.join(uiDir, "previewcn"),
  };
}

/**
 * Get the target directory for previewcn components
 */
export async function getPreviewcnTargetDir(cwd: string): Promise<string> {
  const paths = await resolvePreviewcnPaths(cwd);
  return paths.targetDir;
}

/**
 * Get the import path for previewcn components
 */
export async function getPreviewcnImportPath(cwd: string): Promise<string> {
  const paths = await resolvePreviewcnPaths(cwd);
  return paths.importPath;
}
