import { beforeEach, describe, expect, it } from "vitest";
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
    it("where type not specified", () => {
      packageJson.update({
        type: undefined,
      });
      expect(check()).toMatchInlineSnapshot(`
        [
          "\`type\` field must be \`module\`.",
        ]
      `);
    });

    it("where main not specified", () => {
      packageJson.update({
        main: undefined,
      });
      expect(check()).toMatchInlineSnapshot(`
        [
          "\`main\` field must be provided.",
        ]
      `);
    });

    it("where cjs supported but main not pointing to cjs version", () => {
      packageJson.update({
        main: "dist/index.js",
        // @ts-ignore
        tsup: {
          ...packageJson.content.tsup,
          format: ["esm", "cjs"],
        },
      });
      expect(check()).toMatchInlineSnapshot(`
        [
          "\`main\` field should point to .cjs when cjs supported.",
        ]
      `);
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
