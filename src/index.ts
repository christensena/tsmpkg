import { parseArgs } from "node:util";
import { init } from "./init.js";
import { dev } from "./dev.js";

export const run = async () => {
  const args = parseArgs({
    tokens: true,
    allowPositionals: true,
  });

  switch (args.positionals[0]) {
    case "init": {
      await init(process.cwd());
      break;
    }
    case "dev": {
      await dev(process.cwd());
      break;
    }
  }
};
