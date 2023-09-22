import { Configs } from "./types.js";
import { getPackageJsonContent, readTsConfig } from "../shared/index.js";

export const gatherConfigs = async (dir: string): Promise<Configs> => {
  const pkg = await getPackageJsonContent(dir);
  const tsup = pkg.tsup;
  const tsconfig = await readTsConfig(dir);
  if (!tsconfig) {
    throw new Error(`No tsconfig found in ${dir}.`);
  }
  if (!tsup) {
    throw new Error(`No tsup found in package.json of ${dir}.`);
  }
  return {
    pkg,
    tsup,
    tsconfig,
  };
};
