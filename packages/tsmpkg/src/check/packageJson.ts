import { getPackageJsonContent, handleCheckErrors } from "../shared/index.js";
import { PackageContent } from "../shared/types.js";

export const check = async (dir: string) => {
  const pkg = await getPackageJsonContent(dir);
  const errors = checkPackageJson(pkg);
  handleCheckErrors("package.json", errors);
  return errors;
};

export const checkPackageJson = (pkg: PackageContent) => {
  const errors: string[] = [];

  if (pkg.main) {
    errors.push("`main` field is not required on a es module package.");
  }
  if (pkg.type !== "module") {
    errors.push("`type` field must be `module`.");
  }

  if (!pkg.module) {
    errors.push("`module` field must be provided.");
  }

  // TODO: better to attempt a path resolve
  if (
    pkg.files &&
    !pkg?.files.find((f) => ["dist", "./dist", "dist/"].includes(f))
  ) {
    errors.push("`files` must include `dist`");
  }

  return errors;
};
