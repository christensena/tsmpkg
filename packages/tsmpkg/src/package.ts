import PackageJson from "@npmcli/package-json";
import NPMCliPackageJson from "@npmcli/package-json";
import type { Options as TsupOptions } from "tsup";

export const fix = async (
  dir: string,
  entryPoints: TsupOptions["entry"] = {
    index: "./src/index.ts",
  },
) => {
  if (!(typeof entryPoints === "object" && !Array.isArray(entryPoints))) {
    throw new Error("Entry points must be an object.");
  }
  if (!("index" in entryPoints)) {
    throw new Error("Must have an `index` entry point.");
  }

  const pkgJson = await PackageJson.load(dir);
  const pkg = pkgJson.content as NPMCliPackageJson["content"] & {
    tsup: TsupOptions;
  };

  // TODO: use regex to make more robust
  const indexDistPath = `${entryPoints["index"]
    .replace("./src", "./dist")
    .replace(".ts", ".js")}`;

  pkgJson.update({
    scripts: {
      ...pkg.scripts,
      clean: "rm -rf dist",
      build: "tsup",
      // this postinstall needs to be on workspace root. on package it goes out in published package
      // and gets run which is not what we want!
      // postinstall: "tsmpkg dev",
      postclean: "tsmpkg dev",
    },
    type: "module",
    module: indexDistPath,
    main: undefined, // legacy
    exports: {
      ...(typeof pkg.exports === "object" ? pkg.exports : {}),
      ".": indexDistPath,
      // TODO: if tsup already there, generate exports for it
    },
    devDependencies: {
      ...pkg.devDependencies,
      tsup: "^6.7.0",
      tsmpkg: "^0.0.2",
      typescript: "^5.0.4",
    },
    // @ts-ignore
    tsup: {
      ...pkg.tsup,
      entry: entryPoints,
      clean: true,
      format: ["esm"],
      dts: true,
    },
  });

  await pkgJson.save();
};
