import type { Options as TsupOptions } from "tsup";
import { getPackageJson } from "./shared/index.js";

type FixOptions = {
  supportCjs?: boolean;
};

export const fix = async (dir: string, options: FixOptions = {}) => {
  const pkgJson = await getPackageJson(dir);
  const pkg = pkgJson.content;

  const entryPoints = pkg.tsup.entry ?? {
    index: "./src/index.ts",
  };

  const tsupExistingFormat = pkg.tsup?.format;
  const supportCjs =
    options.supportCjs !== undefined
      ? options.supportCjs
      : tsupExistingFormat?.includes("cjs") ?? false;

  if (!(typeof entryPoints === "object" && !Array.isArray(entryPoints))) {
    throw new Error("Entry points in tsup config must be an object.");
  }

  const indexSrcPath = entryPoints["index"];
  if (!indexSrcPath) {
    throw new Error("Must have an `index` entry point in tsup config.");
  }

  const indexDistPath = makeExportPath("index");
  const indexCjsDistPath = makeExportPath("index", ".cjs");

  const tsmpkgVersion = "0.0.4";

  pkgJson.update({
    scripts: {
      ...pkg.scripts,
      clean: "rm -rf dist",
      build: "tsup",
    },
    type: "module",
    main: supportCjs ? indexCjsDistPath : indexDistPath,
    exports: {
      ...(typeof pkg.exports === "object" ? pkg.exports : {}),
      ...entryPointsToExports(entryPoints, { supportCjs }),
    },
    devDependencies: {
      ...pkg.devDependencies,
      tsup: "^6.7.0",
      tsmpkg: `^${tsmpkgVersion}`,
      typescript: "^5.0.4",
    },
    // @ts-ignore
    tsup: {
      ...pkg.tsup,
      entry: entryPoints,
      clean: true,
      format: tsupExistingFormat ?? supportCjs ? ["esm", "cjs"] : ["esm"],
      dts: true,
    },
  });

  await pkgJson.save();
};

const makeExportPath = (name: string, ext = ".js") => `./dist/${name}${ext}`;

const entryPointsToExports = (
  entryPoints: NonNullable<TsupOptions["entry"]>,
  { supportCjs }: FixOptions,
) =>
  Object.fromEntries(
    Object.entries(entryPoints).map(([name]) => {
      const esmPath = makeExportPath(name, ".js");
      const entryName = name === "index" ? "." : `./${name}`;
      if (supportCjs) {
        const cjsPath = makeExportPath(name, ".cjs");
        return [
          entryName,
          {
            import: esmPath,
            require: cjsPath,
          },
        ];
      } else {
        return [entryName, esmPath];
      }
    }),
  );
