import type { Format, TsupConfig } from "../shared/types.js";
import { PkgType } from "../shared/types.js";
import type { TSConfigJSON } from "types-tsconfig";
import type { Path, PathValue } from "dot-path-value";
import type { Content as Package } from "@npmcli/package-json";

// TODO: what other properties inappropriate to set?
export type WritablePackageContent = Omit<
  Package,
  | "description"
  | "author"
  | "name"
  | "contributors"
  | "jspm"
  | "funding"
  | "homepage"
>;

// type WritableTsupConfig = Pick<
//   TsupConfig,
//   "format" | "entry" | "dts" | "target" | "tsconfig"
// >;

export type WritableTsconfig = Omit<TSConfigJSON, "extends" | "$schema">;

type Setter<T extends Record<string, unknown>> = <
  P extends Path<T>,
  V extends PathValue<T, P>,
>(
  path: P,
  value: V,
) => void;

export type MutateOptions = {
  setPkg: Setter<WritablePackageContent>;
  // setTsup: Setter<WritableTsupConfig>;
  setTs: Setter<WritableTsconfig>;
};

export type Mutator = (context: PluginContext, mutate: MutateOptions) => void;

export enum ErrorLocation {
  TS = "ts",
  TSConfig = "tsconfig",
  Package = "package",
}

export type ValidateError = {
  type: string;
  location: ErrorLocation;
  message: string;
  explanation?: string;
  fix?: Mutator;
};

export type Configs = Readonly<{
  pkg: Readonly<Package>;
  tsup: Readonly<TsupConfig>;
  tsconfig: Readonly<TSConfigJSON>;
}>;

export type PluginContext = Configs &
  Readonly<{
    formats: Format[];
    pkgType?: PkgType;
  }>;

export type Plugin = Readonly<{
  name: string;
  check: (context: PluginContext) => Iterable<ValidateError> | undefined;
  init?: Mutator;
}>;

export type PluginCreate = () => Plugin;
