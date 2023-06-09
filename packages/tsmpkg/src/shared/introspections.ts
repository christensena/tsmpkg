import { PackageContent } from "./types.js";
import { Project } from "@pnpm/find-workspace-packages";

export const cjsRequired = (pkg: PackageContent) =>
  requiredFormats(pkg).includes("cjs");

export const requiredFormats = (pkg: PackageContent): ("cjs" | "esm")[] => {
  const format = (pkg.tsup?.format as "cjs" | "esm" | undefined) ?? "esm";
  return Array.isArray(format) ? format : [format];
};

// TODO: need some better criteria but don't want to exclude private packages
// but some may have it as a workspace package dep rather than dev dep on each package
export const isTsmpkg = (proj: Project) =>
  !!proj.manifest.devDependencies?.tsmpkg;
