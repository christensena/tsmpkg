import path from "node:path";
import fs from "node:fs/promises";
import { ensureDir, remove } from "fs-extra/esm";
import PackageJson from "@npmcli/package-json";
import NPMCliPackageJson from "@npmcli/package-json";
import type { Options as TsupOptions } from "tsup";

const getEntrypointNames = (tsup: TsupOptions) => {
  if (!tsup.entry) {
    return "index";
  }
  if (Array.isArray(tsup.entry)) {
    throw new Error(`Array entrypoints not yet supported. use object syntax`);
  }
  return tsup.entry;
};

export const dev = async (dir: string) => {
  const { content: pkg } = (await PackageJson.load(
    dir,
  )) as NPMCliPackageJson & {
    content: { tsup: TsupOptions };
  };

  const distPath = path.join(dir, "dist");
  await remove(distPath);
  await ensureDir(distPath);

  const entryPoints = getEntrypointNames(pkg.tsup);

  for (const [name, value] of Object.entries(entryPoints)) {
    if (!value.startsWith("./")) {
      throw new Error(`Entry points must start with ./`);
    }
    await fs.symlink(path.join(dir, value), path.join(distPath, `${name}.js`));

    await fs.writeFile(
      path.join(distPath, `${name}.d.ts`),
      `export * from ".${value.replace(
        ".ts",
        ".js",
      )}";\n//# sourceMappingURL=${name}.d.ts.map`,
      "utf-8",
    );
    await fs.writeFile(
      path.join(distPath, `${name}.d.ts.map`),
      `{"version":3,"file":"${name}.d.ts","sourceRoot":"","sources":[".${value}"],"names":[],"mappings":"AAAA"}\n`,
    );
  }
};
