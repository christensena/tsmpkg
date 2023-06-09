import { validatePackageJson } from "./packageJson.js";
import { validateTsConfigJson } from "./validateTsConfigJson.js";
import { validateTsupConfig } from "./tsupConfig.js";
import chalk from "chalk";
import path from "node:path";
import { getWorkspaceDir } from "../shared/index.js";

type Options = {
  workspaceDir: string;
};

export const validate = async (dir: string, options: Options) => {
  console.log(
    chalk.dim`🔎 Validating %s`,
    chalk.bgBlackBright(path.relative(options.workspaceDir, dir)),
  );
  const errors = [
    ...(await validatePackageJson(dir)),
    ...(await validateTsConfigJson(dir)),
    ...(await validateTsupConfig(dir)),
  ];
  return errors.length === 0;
};

export const check = async (dir: string) => {
  const valid = await validate(dir, {
    workspaceDir: await getWorkspaceDir(dir),
  });
  if (!valid) {
    process.exit(1);
  }
};
