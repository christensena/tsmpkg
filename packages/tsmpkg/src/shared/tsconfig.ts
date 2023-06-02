import path from "node:path";
import fsp from "node:fs/promises";

import { load } from "tsconfig";
import { parseTSConfigJSON } from "types-tsconfig";

export const readTsConfig = async (dir: string) => {
  const tsconfig = await load(dir);
  return parseTSConfigJSON(tsconfig.config);
};

export const writeTsConfig = async (dir: string, pkg: unknown) => {
  const filePath = path.join(dir, "tsconfig.json");
  return fsp.writeFile(filePath, JSON.stringify(pkg, undefined, "  "), "utf-8");
};
