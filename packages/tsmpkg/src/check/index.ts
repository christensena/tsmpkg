// export const validate = async (dir: string, options: Options) => {
//   console.log(
//     chalk.dim`🔎 Validating %s`,
//     chalk.bgBlackBright(path.relative(options.workspaceDir, dir)),
//   );
//   const errors = [
//     ...(await validatePackageJson(dir)),
//     ...(await validateTsConfigJson(dir)),
//     ...(await validateTsupConfig(dir)),
//   ];
//   return errors.length === 0;
// };

export * from "./check.js";
export * from "./validate.js";
