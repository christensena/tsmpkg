import { findWorkspaceDir } from "@pnpm/find-workspace-dir";
import chalk from "chalk";

export const getWorkspaceDir = async (dir: string) => {
  const workspaceDir = await findWorkspaceDir(dir);
  if (!workspaceDir) {
    console.error(
      chalk.red`🚨Workspace dir could not be found from ${dir}.\n'dev' only needed in monorepos.\nOnly pnpm monorepos currently supported.`,
    );
    process.exit(1);
  }
  return workspaceDir;
};
