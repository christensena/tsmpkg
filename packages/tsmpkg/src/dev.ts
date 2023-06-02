import path from "node:path";
import fs from "node:fs/promises";
import { ensureDir, remove } from "fs-extra/esm";
import { findWorkspaceDir } from "@pnpm/find-workspace-dir";
import { findWorkspacePackagesNoCheck } from "@pnpm/find-workspace-packages";
import type { Options as TsupOptions } from "tsup";
import {
  cjsRequired,
  getPackageJsonContent,
  isTsmpkg,
} from "./shared/index.js";
import { validate } from "./check/index.js";

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
  const workspaceDir = await findWorkspaceDir(dir);
  if (!workspaceDir) {
    console.error(
      `Workspace dir could not be found from ${dir}.\n'dev' only needed in monorepos.\nOnly pnpm monorepos currently supported.`,
    );
    process.exit(1);
  }

  const projects = (await findWorkspacePackagesNoCheck(workspaceDir)).filter(
    (p) => p.dir !== workspaceDir && isTsmpkg(p),
  );
  for (const proj of projects) {
    // console.log("proj: %O", proj);
    await devPkg(proj.dir);
  }
};

export const devPkg = async (dir: string) => {
  const valid = await validate(dir);
  if (!valid) {
    process.exit(1);
  }
  const pkg = await getPackageJsonContent(dir);
  const supportCjs = cjsRequired(pkg);

  const distPath = path.join(dir, "dist");
  await remove(distPath);
  await ensureDir(distPath);

  const entryPoints = getEntrypointNames(pkg.tsup);

  for (const [name, value] of Object.entries(entryPoints)) {
    if (!value.startsWith("./")) {
      throw new Error(`Entry points must start with ./`);
    }
    await fs.symlink(path.join(dir, value), path.join(distPath, `${name}.js`));

    if (supportCjs) {
      await fs.symlink(
        path.join(dir, value),
        path.join(distPath, `${name}.cjs`),
      );
    }

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
