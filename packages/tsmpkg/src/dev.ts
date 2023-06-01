import path from "node:path";
import fs from "node:fs/promises";
import { ensureDir, remove } from "fs-extra/esm";
import PackageJson from "@npmcli/package-json";
import NPMCliPackageJson from "@npmcli/package-json";
import { findWorkspaceDir } from "@pnpm/find-workspace-dir";
import {
  findWorkspacePackagesNoCheck,
  Project,
} from "@pnpm/find-workspace-packages";
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

// TODO: need some better criteria but don't want to exclude private packages
// but some may have it as a workspace package dep rather than dev dep on each package
const isTsmpkg = (proj: Project) => !!proj.manifest.devDependencies?.tsmpkg;

export const dev = async (dir: string) => {
  const workspaceDir = await findWorkspaceDir(dir);
  if (!workspaceDir) {
    throw new Error(`Workspace dir could not be found from ${dir}.`);
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
  const { content: pkg } = (await PackageJson.load(
    dir,
  )) as NPMCliPackageJson & {
    content: { tsup: TsupOptions };
  };

  const supportCjs = pkg.tsup?.format?.includes("cjs");

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
