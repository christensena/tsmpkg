import { Extension, Format, PackageContent, PkgType } from "./types.js";
import { Project } from "@pnpm/find-workspace-packages";

export const cjsRequired = (pkg: PackageContent) =>
  requiredFormats(pkg).includes("cjs");

export const requiredFormats = (pkg: PackageContent): Format[] => {
  const format = (pkg.tsup?.format as Format | undefined) ?? "esm";
  return (Array.isArray(format) ? format : [format]).filter(
    (f) => f !== "iife",
  );
};

export const extensionForFormatCreate = (
  pkg: Pick<PackageContent, "type"> | PkgType | undefined = "commonjs",
) => {
  const pkgType = typeof pkg === "string" ? pkg : pkg["type"] ?? "commonjs";
  const esmMode = pkgType === "module";
  return (format: Format): Extension => {
    switch (format) {
      case "cjs":
        return esmMode ? ".cjs" : ".js";
      case "esm":
        return esmMode ? ".js" : ".mjs";
    }
  };
};

export const requiredExtensions = (pkg: PackageContent): Extension[] =>
  requiredFormats(pkg).map(extensionForFormatCreate(pkg));

export const dtsExtensionFromExtension = (ext: Extension) => {
  switch (ext) {
    case ".js":
      return ".d.ts";
    case ".mjs":
      return ".d.mts";
    case ".cjs":
      return ".d.cts";
  }
};

// TODO: need some better criteria but don't want to exclude private packages
// but some may have it as a workspace package dep rather than dev dep on each package
export const isTsmpkg = (proj: Project) =>
  !!proj.manifest.devDependencies?.tsmpkg;
