import path from "node:path";
import fs from "node:fs/promises";
import { ensureDir, remove } from "fs-extra/esm";
import { findWorkspacePackagesNoCheck } from "@pnpm/find-workspace-packages";
import type { Options as TsupOptions } from "tsup";
import {
  cjsRequired,
  getPackageJsonContent,
  getWorkspaceDir,
  isTsmpkg,
} from "../shared/index.js";
import { validate } from "../check/index.js";
import chalk from "chalk";

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
  const valid = await validate(dir, options);
  if (!valid) {
    process.exit(1);
  }
  const pkg = await getPackageJsonContent(dir);
  const supportCjs = cjsRequired(pkg);

  const distPath = path.join(dir, "dist");
  await remove(distPath);
  await ensureDir(distPath);

  console.info(
    chalk.dim`🛠️Generating dev mode symlinks for %s in %s`,
    chalk.bgBlackBright(pkg.name),
    chalk.bgGray(path.relative(options.workspaceDir, distPath)),
  );

  const entryPoints = getEntryPoints(pkg.tsup);

  const makeLinks = async (name: string, target: string, ext: "js" | "cjs") => {
    await fs.symlink(
      path.join(dir, target),
      path.join(distPath, `${name}.${ext}`),
    );

    const baseName = ext == "js" ? name : `${name}.${ext}`;
    await fs.writeFile(
      path.join(distPath, `${baseName}.d.ts`),
      `export * from ".${target.replace(
        ".ts",
        ".js",
      )}";\n//# sourceMappingURL=${baseName}.d.ts.map`,
      "utf-8",
    );
    await fs.writeFile(
      path.join(distPath, `${baseName}.d.ts.map`),
      `{"version":3,"file":"${baseName}.d.ts","sourceRoot":"","sources":[".${target}"],"names":[],"mappings":"AAAA"}\n`,
    );
  };

  for (const [name, target] of Object.entries(entryPoints)) {
    if (!target.startsWith("./")) {
      throw new Error(`Entry points must start with ./`);
    }
    await makeLinks(name, target, "js");
    if (supportCjs) {
      await makeLinks(name, target, "cjs");
    }
  }
};
