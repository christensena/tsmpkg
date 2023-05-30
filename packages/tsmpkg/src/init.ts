import { initDir } from "./initSrc.js";
import { fix as fixPackageJson } from "./package.js";
import { write as writeTsconfig } from "./tsconfig.js";

export const init = async (dir: string) => {
  await initDir(dir);
  await initPackageJson(dir);
  await initTsConfigJson(dir);
};

const initPackageJson = async (dir: string) => {
  await fixPackageJson(dir);
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
