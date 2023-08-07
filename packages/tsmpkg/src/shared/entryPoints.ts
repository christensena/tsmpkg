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
      if (formats.length === 1 && formats[0] === "cjs") {
        return [
          entryName,
          makeExportPath(name, extensionForFormat(formats[0])),
        ];
      }
      return [
        entryName,
        {
          import: makeExportPath(name, extensionForFormat("esm")),
          require: makeExportPath(name, extensionForFormat("cjs")),
        },
      ];
    }),
  );
};
