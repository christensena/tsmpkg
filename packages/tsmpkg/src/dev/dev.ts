import path from "node:path";
import fs from "node:fs/promises";
import { ensureDir, remove } from "fs-extra/esm";
import { findWorkspacePackagesNoCheck } from "@pnpm/find-workspace-packages";
import type { Options as TsupOptions } from "tsup";
import {
  dtsExtensionFromExtension,
  getPackageJsonContent,
  getWorkspaceDir,
  isTsmpkg,
  requiredExtensions,
} from "../shared/index.js";
import chalk from "chalk";
import { Extension } from "../shared/types.js";
import { validate } from "../check/validate.js";

const defaultTsupEntry = { index: "./src/index.ts" };

const getEntryPoints = (tsup?: TsupOptions) => {
  if (!tsup?.entry) {
    return defaultTsupEntry;
  }
  if (Array.isArray(tsup.entry)) {
    throw new Error(`Array entrypoints not yet supported. use object syntax`);
  }
  return tsup.entry;
};

export const dev = async (dir: string) => {
  const workspaceDir = await getWorkspaceDir(dir);
  const projects = (await findWorkspacePackagesNoCheck(workspaceDir)).filter(
    (p) => p.dir !== workspaceDir && isTsmpkg(p),
  );
  for (const proj of projects) {
    await devPkg(proj.dir, { workspaceDir });
  }
  console.info(chalk.dim`✅ Done.`);
};

type DevOptions = {
  workspaceDir: string;
};

export const devPkg = async (dir: string, options: DevOptions) => {
  await validate(dir, {
    contextLabel: path.relative(dir, options.workspaceDir),
  });
  const pkg = await getPackageJsonContent(dir);
  const extensions = requiredExtensions(pkg);

  const distPath = path.join(dir, "dist");
  await remove(distPath);
  await ensureDir(distPath);

  console.info(
    chalk.dim`🛠️Generating dev mode symlinks for %s in %s`,
    chalk.bgBlackBright(pkg.name),
    chalk.bgGray(path.relative(options.workspaceDir, distPath)),
  );

  const entryPoints = getEntryPoints(pkg.tsup);

  const makeLinks = async (name: string, target: string, ext: Extension) => {
    await fs.symlink(
      path.join(dir, target),
      path.join(distPath, `${name}${ext}`),
    );

    const dtsExt = dtsExtensionFromExtension(ext);
    await fs.writeFile(
      path.join(distPath, `${name}${dtsExt}`),
      `export * from ".${target.replace(
        ".ts",
        ".js",
      )}";\n//# sourceMappingURL=${name}${dtsExt}.map`,
      "utf-8",
    );
    await fs.writeFile(
      path.join(distPath, `${name}${dtsExt}.map`),
      `{"version":3,"file":"${name}${dtsExt}","sourceRoot":"","sources":[".${target}"],"names":[],"mappings":"AAAA"}\n`,
    );
  };

  for (const [name, target] of Object.entries(entryPoints)) {
    if (!target.startsWith("./")) {
      throw new Error(`Entry points must start with ./`);
    }
    for (const ext of extensions) {
      await makeLinks(name, target, ext);
    }
  }
};
