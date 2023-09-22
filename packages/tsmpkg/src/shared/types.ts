import NPMCliPackageJson from "@npmcli/package-json";
import { Format as TsupFormat, Options as TsupOptions } from "tsup";

export type PackageContent = NPMCliPackageJson["content"] & {
  tsup?: TsupOptions;
};

export type Package = Omit<NPMCliPackageJson, "content"> & {
  content: PackageContent;
};

export type Extension = ".js" | ".mjs" | ".cjs";

export type Format = Exclude<TsupFormat, "iife">;

export type PkgType = "module" | "commonjs";

export type TsupConfig = TsupOptions;
