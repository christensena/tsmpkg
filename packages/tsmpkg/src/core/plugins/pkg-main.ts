import { PkgType } from "../../shared/types.js";
import { extensionForFormatCreate } from "../../shared/index.js";
import { ErrorLocation, Mutator, PluginCreate } from "../types.js";

// TODO: too strict per path, resolve to check instead
export const plugin: PluginCreate = () => {
  const getExpectedMainFilename = (pkgType?: PkgType) =>
    extensionForFormatCreate(pkgType)("cjs");
  const getExpectedMain = (pkgType?: PkgType) =>
    `./dist/index${getExpectedMainFilename(pkgType)}`;

  const setMain: Mutator = ({ pkgType }, { setPkg }) => {
    setPkg("main", getExpectedMain(pkgType));
  };

  return {
    name: "package-main",
    init: setMain,
    check: function* ({ pkg, formats, pkgType }) {
      if (!pkg.main && formats.includes("cjs")) {
        yield {
          type: "no-main-on-cjs",
          location: ErrorLocation.Package,
          message: "No main field in package.json when commonjs supported",
          fix: setMain,
        };
      } else if (
        pkg.main &&
        ![
          "dist/",
          "dist/index",
          `dist/${getExpectedMainFilename(pkgType)}`,
          getExpectedMain(pkgType),
        ].includes(pkg.main)
      ) {
        yield {
          type: "main-not-as-expected",
          message: `'main' expected to be ${getExpectedMain(
            pkgType,
          )} with formats ${formats.join(",")}`,
          location: ErrorLocation.Package,
          fix: setMain,
        };
      }
    },
  };
};
