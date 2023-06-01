import { PackageContent } from "./types.js";

export const cjsRequired = (pkg: PackageContent) => {
  const format = pkg.tsup?.format;
  if (!format) {
    return false;
  }
  if (Array.isArray(format)) {
    return format.includes("cjs");
  } else {
    return format === "cjs";
  }
};
