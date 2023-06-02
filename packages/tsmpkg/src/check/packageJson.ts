import {
  cjsRequired,
  getPackageJsonContent,
  handleCheckErrors,
} from "../shared/index.js";
import { PackageContent } from "../shared/types.js";
import path from "node:path";

export const check = async (dir: string) => {
  const pkg = await getPackageJsonContent(dir);
  const errors = checkPackageJson(pkg);
  handleCheckErrors("package.json", errors);
  return errors;
};

export const checkPackageJson = (pkg: PackageContent) => {
  const errors: string[] = [];

  const cjsSupported = cjsRequired(pkg);
  if (!pkg.main) {
    // https://nodejs.org/api/packages.html#package-entry-points
    errors.push("`main` field must be provided.");
  }
  if (pkg.main && cjsSupported && path.extname(pkg.main) !== ".cjs") {
    errors.push("`main` field should point to .cjs when cjs supported.");
  }
  if (pkg.type !== "module") {
    errors.push("`type` field must be `module`.");
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
