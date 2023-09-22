import {
  Configs,
  PluginContext,
  PluginCreate,
  ValidateError,
} from "./types.js";
import { requiredFormats } from "../shared/index.js";

export type GetIssuesOptions = Configs;

export const getIssuesCreate = ({
  plugins: pluginCreators,
}: {
  plugins: PluginCreate[];
}) => {
  const plugins = pluginCreators.map((pluginCreator) => pluginCreator());
  return ({ pkg, tsconfig: ts, tsup }: GetIssuesOptions): ValidateError[] => {
    const context: PluginContext = {
      pkg,
      tsup,
      tsconfig: ts,
      formats: requiredFormats(pkg),
      pkgType: pkg.type,
    };
    return plugins
      .flatMap((plugin) => [...(plugin.check(context) ?? [])])
      .filter((e): e is ValidateError => !!e);
  };
};
