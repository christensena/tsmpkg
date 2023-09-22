import {
  MutateOptions,
  PluginContext,
  ValidateError,
  WritablePackageContent,
  WritableTsconfig,
} from "./types.js";
import { setByPath } from "dot-path-value";

export type FixIssuesOptions = {
  context: PluginContext;
  issues: ValidateError[];
};

export const fixIssues = ({ context, issues }: FixIssuesOptions) => {
  const fixableIssues = issues.filter(
    (
      issue,
    ): issue is Omit<ValidateError, "fix"> &
      Required<Pick<ValidateError, "fix">> => !!issue.fix,
  );
  const pkg = structuredClone(context.pkg) as WritablePackageContent;
  const ts = structuredClone(context.tsconfig) as WritableTsconfig;
  const mutateOptions: MutateOptions = {
    setPkg: (property, newValue) => {
      setByPath(pkg, property, newValue);
    },
    setTs: (property, newValue) => {
      setByPath(ts, property, newValue);
    },
  };

  for (const issue of fixableIssues) {
    issue.fix(context, mutateOptions);
  }

  return { pkg, ts };
};
