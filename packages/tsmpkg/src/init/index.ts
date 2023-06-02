import { initSrc } from "./initSrc.js";
import { initTsConfigJson } from "./initTsConfigJson.js";
import { fixPackageJson } from "../fix/index.js";

export const init = async (dir: string) => {
  await initSrc(dir);
  await fixPackageJson(dir);
  await initTsConfigJson(dir);
};
