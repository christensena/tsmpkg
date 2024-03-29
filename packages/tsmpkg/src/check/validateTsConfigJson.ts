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
    const errors = [...validateTsConfig(config)];
    return displayTsconfigValidationErrors(errors);
  } catch (err) {
    if (err instanceof InvalidTsConfigError) {
      const errors = [err.message];
      let cause = err.cause;
      while (cause instanceof Error) {
        errors.push(cause.message);
        cause = cause.cause;
      }
      if (cause) {
        errors.push(String(cause));
      }
      return displayTsconfigValidationErrors(errors);
    }
    throw err;
  }
};

export function* validateTsConfig(
  config: Awaited<ReturnType<typeof readTsConfig>>,
) {
  if (!config) {
    yield "tsconfig.json: not found.";
    return;
  }

  const { compilerOptions } = config;
  if (!compilerOptions) {
    yield "no compilerOptions set.";
    return;
  }
  // TODO: which types are valid? NodeNext and Node16 too?
  // if (compilerOptions.module?.toLowerCase() !== "esnext") {
  //   yield `tsconfig.json: compilerOptions.module must be "ESNext"`;
  // }
}
