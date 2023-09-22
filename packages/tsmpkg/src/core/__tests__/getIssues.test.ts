import { getIssuesCreate, GetIssuesOptions } from "../getIssues.js";
import { beforeEach, describe, expect, it } from "vitest";
import { ErrorLocation, Plugin, ValidateError } from "../types.js";

const makeFixedPlugin = (issues: ValidateError[]): Plugin => {
  return {
    name: "fixed",
    check: function* () {
      for (const issue of issues) {
        yield issue;
      }
    },
  };
};

describe("getIssues", () => {
  const dummyOptions: GetIssuesOptions = { pkg: {}, tsup: {}, tsconfig: {} };

  const getIssuesWherePluginsReturn = (issues: ValidateError[]) => {
    return getIssuesCreate({
      plugins: [() => makeFixedPlugin(issues)],
    })(dummyOptions);
  };

  describe("one issue", () => {
    let issues: ValidateError[];

    beforeEach(() => {
      issues = getIssuesWherePluginsReturn([
        {
          type: "test",
          location: ErrorLocation.Package,
          message: "test",
        },
      ]);
    });

    it("should have an issue", () => {
      expect(issues).toHaveLength(1);
    });
  });

  describe("no issues", () => {
    it("should return empty issues", () => {
      expect(getIssuesWherePluginsReturn([])).toHaveLength(0);
    });
  });
});
