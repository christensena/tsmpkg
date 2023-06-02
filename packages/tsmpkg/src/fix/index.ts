import { fixPackageJson } from "./fixPackageJson.js";

export * from "./fixPackageJson.js";

export const fix = async (dir: string) => {
  await fixPackageJson(dir);
};
