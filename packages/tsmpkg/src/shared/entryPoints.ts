import { Options as TsupOptions } from "tsup";

export const makeExportPath = (name: string, ext = ".js") =>
  `./dist/${name}${ext}`;

export const entryPointsToExports = (
  entryPoints: NonNullable<TsupOptions["entry"]>,
  { supportCjs }: { supportCjs?: boolean },
) =>
  Object.fromEntries(
    Object.entries(entryPoints).map(([name]) => {
      const esmPath = makeExportPath(name, ".js");
      const entryName = name === "index" ? "." : `./${name}`;
      if (supportCjs) {
        const cjsPath = makeExportPath(name, ".cjs");
        return [
          entryName,
          {
            import: esmPath,
            require: cjsPath,
          },
        ];
      } else {
        return [entryName, esmPath];
      }
    }),
  );
