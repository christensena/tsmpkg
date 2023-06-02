import { check as checkPackageJson } from "./packageJson.js";

export const validate = async (dir: string) => {
  const errors = await checkPackageJson(dir);
  return errors.length === 0;
};

export const check = async (dir: string) => {
  const valid = await validate(dir);
  if (!valid) {
    process.exit(1);
  }
};
