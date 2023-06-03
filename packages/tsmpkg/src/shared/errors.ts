export const displayValidationErrors = (context: string, errors: string[]) => {
  if (errors.length === 0) return;

  console.warn(
    `Errors were found in ${context}.\nTry running fix to resolve them.\n`,
  );

  for (const error of errors) {
    console.warn(error);
  }
  return errors;
};
