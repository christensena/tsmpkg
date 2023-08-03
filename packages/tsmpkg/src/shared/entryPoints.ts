import { Options as TsupOptions } from "tsup";

export const makeExportPath = (name: string, ext = "") =>
  `./dist/${name}${ext}`;

export const entryPointsToExports = (
  entryPoints: NonNullable<TsupOptions["entry"]>,
  { formats }: { formats: ("cjs" | "esm")[] },
) =>
  Object.fromEntries(
    Object.entries(entryPoints).map(([name]) => {
      const esmPath = makeExportPath(name, ".mjs");
      const entryName = name === "index" ? "." : `./${name}`;
      if (formats.includes("cjs")) {
        const cjsPath = makeExportPath(name, ".js");
        return [
          entryName,
          {
            // TODO: check cjs case. might be wrong, e.g "default"?
            import: formats.includes("esm") ? esmPath : cjsPath,
            require: cjsPath,
          },
        ];
      } else {
        return [entryName, esmPath];
      }
    }),
  );
