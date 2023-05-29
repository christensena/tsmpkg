import { initDir } from "./initSrc.js";
import { read as readPkg, write as writePkg } from "./package.js";
import { read as readTsconfig, write as writeTsconfig } from "./tsconfig.js";

export const init = async (dir: string) => {
  await initDir(dir);
  await initPackageJson(dir);
  await initTsConfigJson(dir);
};

const initPackageJson = async (
  dir: string,
  entryPoints: string[] = ["index"]
) => {
  const pkg = await readPkg(dir);

  pkg.type = "module";
  pkg.module = `./dist/${entryPoints[0]}.js`;
  pkg.exports = {
    ".": `./dist/${entryPoints[0]}.js`,
  };
  pkg.devDependencies = {
    ...pkg.devDependencies,
    tsup: "^6.7.0",
    tsmpkg: "workspace:*",
  };
  pkg.tsup = {
    entry: Object.fromEntries(
      entryPoints.map((name) => [name, `./src/${name}.ts`])
    ),
    clean: true,
    format: ["esm"],
    dts: true,
  };
  pkg.scripts = {
    ...pkg.scripts,
    clean: "rm -rf dist && tsmpkg dev",
    build: "tsup",
    postinstall: "tsmpkg dev",
  };

  delete pkg.main;

  await writePkg(dir, pkg);
};

const defaultTsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "ESNext",
    rootDir: "./src",
    moduleResolution: "nodenext",
    noEmit: true,
    isolatedModules:
      true /* Ensure that each file can be safely transpiled without relying on other imports. */,
    // "verbatimModuleSyntax": true,                     /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    esModuleInterop:
      true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    forceConsistentCasingInFileNames:
      true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    strict: true /* Enable all strict type-checking options. */,
    skipLibCheck: true /* Skip type checking all .d.ts files. */,
    lib: ["es2020"],
  },
  include: ["./src"],
};

const initTsConfigJson = async (dir: string) => {
  // const tsConfig = await readTsconfig(dir);

  await writeTsconfig(dir, defaultTsconfig);
};
