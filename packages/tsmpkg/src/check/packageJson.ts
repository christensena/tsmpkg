import {
  cjsRequired,
  displayValidationErrors,
  getPackageJsonContent,
} from "../shared/index.js";
import { PackageContent } from "../shared/types.js";
import path from "node:path";

export const validatePackageJson = async (dir: string) => {
  const pkg = await getPackageJsonContent(dir);
  const errors = [...validatePackage(pkg)];
  return displayValidationErrors("package.json", errors);
};

export function* validatePackage(pkg: PackageContent) {
  const cjsSupported = cjsRequired(pkg);
  if (!pkg.main) {
    // only if an index entry point
    if (pkg.tsup?.entry && "index" in pkg.tsup.entry) {
      // https://nodejs.org/api/packages.html#package-entry-points
      yield "`main` field must be provided when index entry point.";
    }
  } else if (
    pkg.main &&
    cjsSupported &&
    ![".cjs", ""].includes(path.extname(pkg.main))
  ) {
    yield "`main` field should point to .cjs when cjs supported.";
  }

  // if (pkg.type !== "module") {
  //   yield "`type` field must be `module`.";
  // }

  // TODO: better to attempt a path resolve
  if (
    pkg.files &&
    !pkg.files.find((f) => ["dist", "./dist", "dist/"].includes(f))
  ) {
    yield "`files` must include `dist`";
  }
}
