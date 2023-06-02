import {
  entryPointsToExports,
  getPackageJson,
  makeExportPath,
} from "../shared/index.js";

type FixOptions = {
  supportCjs?: boolean;
};

export const fixPackageJson = async (dir: string, options: FixOptions = {}) => {
  const pkgJson = await getPackageJson(dir);
  const pkg = pkgJson.content;

  const entryPoints = pkg.tsup?.entry ?? {
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
