import path from "node:path";
import { validate } from "./validate.js";
import { getWorkspaceDir } from "../shared/index.js";

export const check = async (dir: string) => {
  const workspaceDir = await getWorkspaceDir(dir);
  const contextLabel = path.relative(workspaceDir, dir);
  const isValid = await validate(dir, { contextLabel });
  if (!isValid) {
    process.exit(1);
  }
};
