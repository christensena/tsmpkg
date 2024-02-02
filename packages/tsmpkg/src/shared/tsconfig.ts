import { createRequire } from "node:module";
import path from "node:path";
import fsp from "node:fs/promises";

import type * as ts from "typescript";

// Find the typescript package for the given directory, and import it.
const importTypescriptFor = async (dir: string): Promise<typeof ts> => {
  // From node 20 we can use import.meta.resolve("typescript", dir), but that's
  // not the minimum version we support yet.
  // Note the trailing slash, otherwise it assumes dir is an importing file,
  // and finds from the parent directory.
  try {
    return createRequire(dir + "/")("typescript");
  } catch (cause) {
    throw new InvalidTsConfigError(cause);
  }
};

export const readTsConfig = async (dir: string) => {
  const ts = await importTypescriptFor(dir);

  const configPath = ts.findConfigFile(dir, ts.sys.fileExists);
  if (!configPath) {
    return undefined;
  }

  const throwInvalidTsConfigFromDiagnostics = (
    diagnostics: ts.Diagnostic[],
  ): never => {
    const message = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => dir,
      getNewLine: () => "\n",
    });
    throw new InvalidTsConfigError(message);
  };

  const result = ts.getParsedCommandLineOfConfigFile(
    configPath,
    {},
    {
      ...ts.sys,
      // trace?(s: string): void
      getCurrentDirectory: () => dir,
      onUnRecoverableConfigFileDiagnostic(diagnostic) {
        throwInvalidTsConfigFromDiagnostics([diagnostic]);
      },
    },
  );

  // I believe the result is only undefined if you don't throw from
  // onUnRecoverableConfigFileDiagnostic().
  if (!result) {
    throw new InvalidTsConfigError(
      "Unexpectedly undefined result from ts.getParsedCommandLineFromConfigFile().",
    );
  }

  if (result.errors.length) {
    throwInvalidTsConfigFromDiagnostics(result!.errors);
  }

  return result.raw;
};

export const writeTsConfig = async (dir: string, pkg: unknown) => {
  const filePath = path.join(dir, "tsconfig.json");
  return fsp.writeFile(filePath, JSON.stringify(pkg, undefined, "  "), "utf-8");
};

export class InvalidTsConfigError extends Error {
  name = "InvalidTsConfigError";

  constructor(cause: unknown) {
    super("Invalid tsconfig.json.", { cause });
  }
}
