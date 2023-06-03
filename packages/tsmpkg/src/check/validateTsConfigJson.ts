import {
  displayValidationErrors,
  InvalidTsConfigError,
  readTsConfig,
} from "../shared/index.js";

const displayTsconfigValidationErrors = (errors: string[]) =>
  displayValidationErrors("tsconfig.json", errors);

export const validateTsConfigJson = async (dir: string) => {
  try {
    const config = await readTsConfig(dir);
    const errors = validateTsConfig(config);
    return displayTsconfigValidationErrors(errors);
  } catch (err) {
    if (err instanceof InvalidTsConfigError) {
      return displayTsconfigValidationErrors([err.message]);
    }
    throw err;
  }
};

export const validateTsConfig = (
  config: Awaited<ReturnType<typeof readTsConfig>>,
) => {
  if (!config) {
    return ["tsconfig.json: not found."];
  }
  const errors: string[] = [];
  const { compilerOptions } = config;
  if (!compilerOptions) {
    return ["no compilerOptions set."];
  }
  // TODO: which types are valid? NodeNext and Node16 too?
  if (compilerOptions.module?.toLowerCase() !== "esnext") {
    errors.push(`tsconfig.json: compilerOptions.module must be "ESNext"`);
  }
  return errors;
};
