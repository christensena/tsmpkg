import chalk from "chalk";

export const displayValidationErrors = (context: string, errors: string[]) => {
  if (errors.length === 0) return errors;

  console.warn(chalk.red(`Errors were found in ${context}.`));
  console.info(chalk.dim("Try running fix to resolve them."));

  for (const error of errors) {
    console.warn(chalk.red(error));
  }
  return errors;
};
