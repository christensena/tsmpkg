import {
  cjsRequired,
  entryPointsToExports,
  getPackageJson,
  makeExportPath,
  requiredFormats,
} from "../shared/index.js";
import chalk from "chalk";

type FixOptions = {
  supportCjs?: boolean;
};

export const fixPackageJson = async (dir: string, options: FixOptions = {}) => {
  const pkgJson = await getPackageJson(dir);
  const pkg = pkgJson.content;

  const entryPoints = pkg.tsup?.entry ?? {
    index: "./src/index.ts",
  };

  const formats = requiredFormats(pkg);
  const supportCjs = cjsRequired(pkg);

  if (!(typeof entryPoints === "object" && !Array.isArray(entryPoints))) {
    throw new Error("Entry points in tsup config must be an object.");
  }

  console.info(chalk.dim`🛠️Fixing package.json`);

  pkgJson.update({
    scripts: {
      ...pkg.scripts,
      clean: "rm -rf dist",
      prepack: "tsup",
    },
    // type: "module",
    main: entryPoints["index"]
      ? supportCjs
        ? makeExportPath("index", ".js")
        : makeExportPath("index", ".mjs")
      : undefined,
    exports: {
      ...(typeof pkg.exports === "object" ? pkg.exports : {}),
      ...entryPointsToExports(entryPoints, { formats }),
    },
    // devDependencies: {
    //   ...pkg.devDependencies,
    //   tsup: "^6.7.0",
    //   tsmpkg: `^${tsmpkgVersion}`,
    //   typescript: "^5.0.4",
    // },
    // @ts-ignore
    tsup: {
      ...pkg.tsup,
      entry: entryPoints,
      clean: true,
      format: formats,
      dts: true,
    },
  });

  await pkgJson.save();

  console.info(chalk.dim`✅ Done.`);
};
