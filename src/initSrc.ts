import fs from "node:fs/promises";
import path from "node:path";
import { ensureDir, pathExists } from "fs-extra/esm";

export const initDir = async (dir: string) => {
  const srcPath = path.join(dir, "./src");
  await ensureDir(srcPath);
  const indexPath = path.join(srcPath, "index.ts");
  if (await pathExists(indexPath)) {
    return;
  }
  await fs.writeFile(indexPath, 'export const hi = "hi";\n');
};
