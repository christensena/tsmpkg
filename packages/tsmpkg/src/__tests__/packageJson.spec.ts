import { beforeEach, describe, expect, it } from "vitest";
import PackageJson from "@npmcli/package-json";
import { check } from "../packageJson.js";
import path from "node:path";

describe("packageJson", () => {
  let packageJson: PackageJson;

  beforeEach(async (ctx) => {
    if (!ctx.meta.file?.filepath) {
      throw new Error(`Expected filepath in context`);
    }
    const validPackageDir = path.join(
      path.dirname(ctx.meta.file?.filepath),
      "fixtures/",
    );
    packageJson = await PackageJson.load(validPackageDir);
  });

  describe("check should return error", () => {
    it("where main field specified", () => {
      packageJson.update({
        main: "index.js",
      });
      expect(check(packageJson)).toMatchInlineSnapshot(`
        [
          "\`main\` field is not required on a es module package.",
        ]
      `);
    });

    it("where type not specified", () => {
      packageJson.update({
        type: undefined,
      });
      expect(check(packageJson)).toMatchInlineSnapshot(`
        [
          "\`type\` field must be \`module\`.",
        ]
      `);
    });

    it("where module not specified", () => {
      packageJson.update({
        module: undefined,
      });
      expect(check(packageJson)).toMatchInlineSnapshot(`
        [
          "\`module\` field must be provided.",
        ]
      `);
    });

    it("where files does not have dist/", () => {
      packageJson.update({
        files: ["src", "hi"],
      });
      expect(check(packageJson)).toMatchInlineSnapshot(`
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
        expect(check(packageJson)).toEqual([]);
      }
    });
  });
});
