import path from "node:path";
import fs from "node:fs/promises";
// import type { TsConfigSourceFile } from "typescript";

export const read = async (dir: string) => {
  const filePath = path.join(dir, "tsconfig.json");

  if (!(await fs.lstat(filePath))) {
    return undefined;
  }
  const contents = await fs.readFile(filePath, "utf-8");

  return JSON.parse(contents);
};

export const write = async (dir: string, pkg: unknown) => {
  const filePath = path.join(dir, "tsconfig.json");
  return fs.writeFile(filePath, JSON.stringify(pkg, undefined, "  "), "utf-8");
};
