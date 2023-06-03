import path from "node:path";
import fsp from "node:fs/promises";

import { load } from "tsconfig";
import { parseTSConfigJSON } from "types-tsconfig";

const attemptReadTsConfig = async (dir: string) => {
  try {
    const tsconfig = await load(dir);
    if (!tsconfig) {
      return undefined;
    }
    return tsconfig;
  } catch (err) {
    throw new InvalidTsConfigError(err instanceof Error ? err : undefined);
  }
};

export const readTsConfig = async (dir: string) => {
  const tsconfig = await attemptReadTsConfig(dir);
  if (!tsconfig) {
    return;
  }

  const validatedTsconfig = parseTSConfigJSON(tsconfig.config);
  if (!validatedTsconfig) {
    throw new InvalidTsConfigError();
  }
  return validatedTsconfig;
};

export const writeTsConfig = async (dir: string, pkg: unknown) => {
  const filePath = path.join(dir, "tsconfig.json");
  return fsp.writeFile(filePath, JSON.stringify(pkg, undefined, "  "), "utf-8");
};

export class InvalidTsConfigError extends Error {
  constructor(err?: Error) {
    super(`Invalid tsconfig.json. ${err?.message ?? ""}`.trimEnd());
    InvalidTsConfigError.prototype.name = "InvalidTsConfigError";
  }
}
