import { handleCheckErrors, readTsConfig } from "../shared/index.js";

export const validateTsConfigJson = async (dir: string) => {
  const config = await readTsConfig(dir);
  const errors = validateTsConfig(config);
  handleCheckErrors("tsconfig.json", errors);
  return errors;
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
