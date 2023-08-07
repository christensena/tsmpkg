import NPMCliPackageJson from "@npmcli/package-json";
import { Options as TsupOptions } from "tsup";

export type PackageContent = NPMCliPackageJson["content"] & {
  tsup?: TsupOptions;
};

export type Package = Omit<NPMCliPackageJson, "content"> & {
  content: PackageContent;
};

export type Extension = ".js" | ".mjs" | ".cjs";

export type Format = "esm" | "cjs";
