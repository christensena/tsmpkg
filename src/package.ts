import path from "node:path";
import fs from "node:fs/promises";
import type { Options as TsupOptions } from "tsup";

type Dependencies = Record<string, string>;

type ExportType = "module" | "import" | "types" | "require" | "node";

export type Package = {
  name: string;
  module?: string;
  main?: string;
  files?: string[];
  type?: string;
  exports?: Record<string, string | Partial<Record<ExportType, string>>>;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
  scripts?: Record<string, string>;

  tsup: TsupOptions;
};

export const read = async (dir: string): Promise<Package> => {
  const filePath = path.join(dir, "package.json");

  console.log("filepath", filePath);

  const contents = await fs.readFile(filePath, "utf-8");

  return JSON.parse(contents);
};

export const write = async (dir: string, pkg: Package) => {
  const filePath = path.join(dir, "package.json");
  return fs.writeFile(filePath, JSON.stringify(pkg, undefined, "  "), "utf-8");
};
