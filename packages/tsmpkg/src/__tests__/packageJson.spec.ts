import { beforeEach, describe, expect, it, test } from "vitest";
import { validatePackage } from "../check/packageJson.js";
import path from "node:path";
import { Package, PackageContent } from "../shared/types.js";
import { getPackageJson } from "../shared/index.js";

describe("packageJson", () => {
  let packageJson: Package;

  const check = () => [
    ...validatePackage(packageJson.content as PackageContent),
  ];

  beforeEach(async (ctx) => {
    if (!ctx.task.file?.filepath) {
      throw new Error(`Expected filepath in context`);
    }
    const validPackageDir = path.join(
      path.dirname(ctx.task.file?.filepath),
      "fixtures/",
    );
    packageJson = await getPackageJson(validPackageDir);
  });

  describe("check should return error", () => {
    it("where main not specified and index entry point", () => {
      packageJson.update({
        main: undefined,
      });
      expect(check()).toMatchInlineSnapshot(`
        [
          "\`main\` field must be provided when index entry point.",
        ]
      `);
    });

    describe("where multiple formats and commonjs supported", () => {
      test.each([
        ["dist/index.js", "module", ".cjs"],
        ["dist/index.cjs", "commonjs", ".js"],
        ["dist/index.cjs", undefined, ".js"],
        ["dist/index.mjs", "module", ".cjs"],
        ["dist/", "module", ".cjs"],
        ["dist", "module", ".cjs"],
      ])(
        "package.json main pointing to %s %s -> %s",
        (main, type, expected) => {
          packageJson.update({
            main,
            type: type as "commonjs" | "module" | undefined,
            // @ts-ignore
            tsup: {
              ...packageJson.content.tsup,
              format: ["esm", "cjs"],
            },
          });
          expect(check()).toContain(
            `"main" field should have "${expected}" extension when commonjs supported on package of type ${
              type ?? "commonjs"
            }.`,
          );
        },
      );
    });

    it("where files does not have dist/", () => {
      packageJson.update({
        files: ["src", "hi"],
      });
      expect(check()).toMatchInlineSnapshot(`
        [
          "\`files\` must include \`dist\`",
        ]
      `);
    });
  });

  describe("check should return no error", () => {
    it("where files have dist in various forms", () => {
      for (const entry of ["dist", "./dist", "dist/"]) {
        packageJson.update({
          files: [entry],
        });
        expect(check()).toEqual([]);
      }
    });
  });
});
