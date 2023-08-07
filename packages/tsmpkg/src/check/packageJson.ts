import {
  cjsRequired,
  displayValidationErrors,
  extensionForFormatCreate,
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
  const extForCjs: string = extensionForFormatCreate(pkg)("cjs");
  if (!pkg.main) {
    // only if an index entry point
    if (pkg.tsup?.entry && "index" in pkg.tsup.entry) {
      // https://nodejs.org/api/packages.html#package-entry-points
      yield "`main` field must be provided when index entry point.";
    }
  } else if (cjsSupported && path.extname(pkg.main) !== extForCjs) {
    yield `"main" field should have "${extForCjs}" extension when commonjs supported on package of type ${
      pkg.type ?? "commonjs"
    }.`;
  }

  // TODO: better to attempt a path resolve
  if (
    pkg.files &&
    !pkg.files.find((f) => ["dist", "./dist", "dist/"].includes(f))
  ) {
    yield "`files` must include `dist`";
  }
}
