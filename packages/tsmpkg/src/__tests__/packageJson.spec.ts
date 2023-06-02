import { beforeEach, describe, expect, it } from "vitest";
import { checkPackageJson as check } from "../check/packageJson.js";
import path from "node:path";
import { Package, PackageContent } from "../shared/types.js";
import { getPackageJson } from "../shared/index.js";

describe("packageJson", () => {
  let packageJson: Package;

  const doCheck = () => check(packageJson.content as PackageContent);

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
    it("where main field specified where cjs not supported", () => {
      packageJson.update({
        main: "index.js",
      });
      expect(doCheck()).toMatchInlineSnapshot(`
        [
          "\`main\` field is not required unless cjs supported.",
        ]
      `);
    });

    it("where type not specified", () => {
      packageJson.update({
        type: undefined,
      });
      expect(doCheck()).toMatchInlineSnapshot(`
        [
          "\`type\` field must be \`module\`.",
        ]
      `);
    });

    it("where module not specified", () => {
      packageJson.update({
        module: undefined,
      });
      expect(doCheck()).toMatchInlineSnapshot(`
        [
          "\`module\` field must be provided.",
        ]
      `);
    });

    it("where files does not have dist/", () => {
      packageJson.update({
        files: ["src", "hi"],
      });
      expect(doCheck()).toMatchInlineSnapshot(`
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
        expect(doCheck()).toEqual([]);
      }
    });

    it("where main field specified cjs supported", () => {
      packageJson.update({
        main: "index.js",
        // @ts-ignore
        tsup: {
          ...packageJson.content.tsup,
          format: ["esm", "cjs"],
        },
      });
      expect(doCheck()).toEqual([]);
    });
  });
});
