import { validatePackageJson } from "./packageJson.js";
import { validateTsConfigJson } from "./validateTsConfigJson.js";

export const validate = async (dir: string) => {
  const errors = [
    ...(await validatePackageJson(dir)),
    ...(await validateTsConfigJson(dir)),
  ];
  return errors.length === 0;
};

export const check = async (dir: string) => {
  const valid = await validate(dir);
  if (!valid) {
    process.exit(1);
  }
};
