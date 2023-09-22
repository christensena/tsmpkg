import { fixIssues } from "../fixIssues.js";
import { beforeEach, describe, expect, it } from "vitest";
import { ErrorLocation, PluginContext, ValidateError } from "../types.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const omit = <T extends Record<string, unknown>>(
  key: keyof T,
  { [key]: _, ...obj }: T,
) => obj;

describe("fixIssues", () => {
  const initialContext: PluginContext = {
    pkg: {},
    tsup: {},
    tsconfig: {},
    formats: ["esm"],
    pkgType: "module",
  };

  describe("where issue has fix", () => {
    let fixResult: ReturnType<typeof fixIssues>;

    beforeEach(() => {
      const context = structuredClone(initialContext);
      const issues: ValidateError[] = [
        {
          type: "test",
          location: ErrorLocation.Package,
          message: "test",
          fix: (_, { setPkg, setTs }) => {
            setPkg("exports", "./index.js");
            setTs("include", ["./src"]);
          },
        },
      ];
      fixResult = fixIssues({ issues, context });
    });

    it("should have retained existing package options", () => {
      expect(omit("exports", initialContext.pkg)).toEqual(
        omit("exports", fixResult.pkg),
      );
    });

    it("should have retained existing tsconfig options", () => {
      expect(omit("include", initialContext.tsconfig)).toEqual(
        omit("include", fixResult.ts),
      );
    });

    it("should have applied package fix", () => {
      expect(fixResult.pkg.exports).toEqual("./index.js");
    });

    it("should have applied tsconfig fix", () => {
      expect(fixResult.ts.include).toEqual(["./src"]);
    });
  });
});
