import { gatherConfigs, getIssuesCreate, plugins } from "../core/index.js";
import chalk from "chalk";
import { ValidateError } from "../core/types.js";

type Options = {
  contextLabel: string;
};

export const validate = async (dir: string, { contextLabel }: Options) => {
  console.log(chalk.dim`🔎 Validating %s`, chalk.bgBlackBright(contextLabel));

  const configs = await gatherConfigs(dir);
  const getIssues = getIssuesCreate({ plugins });
  const issues = getIssues(configs);
  if (issues.length > 0) {
    displayValidationErrors(contextLabel, issues);
  }
  return issues.length === 0;
};

export const displayValidationErrors = (
  contextLabel: string,
  errors: ValidateError[],
) => {
  console.warn(chalk.red(`Errors were found in ${contextLabel}.`));
  console.info(chalk.dim("Try running fix to resolve them."));

  for (const error of errors) {
    console.error(chalk.red(`${error.message} in ${error.location}.`));
    if (error.explanation) {
      console.warn(chalk.dim(error.explanation));
    }
  }
};
