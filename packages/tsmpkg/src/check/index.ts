import { check as checkPackageJson } from "./packageJson.js";

export const validate = async (dir: string) => {
  const errors = await checkPackageJson(dir);
  return errors.length === 0;
};
