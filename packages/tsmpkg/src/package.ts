import path from "node:path";
import PackageJson from "@npmcli/package-json";
import fs from "node:fs/promises";
import type { Options as TsupOptions } from "tsup";

export const fix = async (
  dir: string,
  entryPoints: Extract<TsupOptions["entry"], Record<string, string>> = {
    index: "./src/index.js",
  },
) => {
  const pkgJson = await PackageJson.load(dir);
  pkgJson.update({
    scripts: {
      clean: "rm -rf dist && tsmpkg dev",
      build: "tsup",
      postinstall: "tsmpkg dev",
    },
    type: "module",
    module: `./dist/index.js`,
    exports: {
      ".": `./dist/${entryPoints[0]}.js`,
    },
    devDependencies: {
      tsup: "^6.7.0",
      tsmpkg: "^0.0.2",
    },
    tsup: {
      entry: Object.fromEntries(
        entryPoints.map((name) => [name, `./src/${name}.ts`]),
      ),
      clean: true,
      format: ["esm"],
      dts: true,
    },
    main: undefined,
  });

  await pkgJson.save();
};
