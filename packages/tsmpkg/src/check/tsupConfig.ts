import {
  displayValidationErrors,
  getPackageJsonContent,
} from "../shared/index.js";
import { Options as TsupOptions } from "tsup";

export const validateTsupConfig = async (dir: string) => {
  const pkg = await getPackageJsonContent(dir);
  const errors = [...validate(pkg.tsup)];
  return displayValidationErrors("tsup config", errors);
};

export function* validate(config: TsupOptions | undefined) {
  if (!config) {
    yield "Not found. Currently only `tsup` section within `package.json` supported.";
  }
  if (!config?.entry) {
    yield "No `entry` defined.";
  } else {
    if (Array.isArray(config?.entry)) {
      yield "Array `entry` not yet supported.";
    }
  }
}
