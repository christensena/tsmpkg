import { Package, PackageContent } from "./types.js";
import PackageJson from "@npmcli/package-json";

export const getPackageJson = async (dir: string) => {
  const pkg = await PackageJson.load(dir);
  return pkg as Package;
};

export const getPackageJsonContent = async (
  dir: string,
): Promise<PackageContent> => {
  const { content } = await getPackageJson(dir);
  return content;
};
