import { Options as TsupOptions } from "tsup";
import { Extension, Format, PkgType } from "./types.js";
import { extensionForFormatCreate } from "./introspections.js";

export const makeExportPath = (name: string, ext: Extension) =>
  `./dist/${name}${ext}`;

export const entryPointsToExports = (
  entryPoints: NonNullable<TsupOptions["entry"]>,
  { formats, pkgType }: { formats: Format[]; pkgType: PkgType },
) => {
  const extensionForFormat = extensionForFormatCreate(pkgType);
  return Object.fromEntries(
    Object.entries(entryPoints).map(([name]) => {
      const entryName = name === "index" ? "." : `./${name}`;
      return [
        entryName,
        formats.length === 1
          ? makeExportPath(name, extensionForFormat(formats[0]))
          : {
              import: makeExportPath(name, extensionForFormat("esm")),
              require: makeExportPath(name, extensionForFormat("cjs")),
            },
      ];
    }),
  );
};
