import { PackageContent } from "./types.js";
import { Project } from "@pnpm/find-workspace-packages";

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

// TODO: need some better criteria but don't want to exclude private packages
// but some may have it as a workspace package dep rather than dev dep on each package
export const isTsmpkg = (proj: Project) =>
  !!proj.manifest.devDependencies?.tsmpkg;
