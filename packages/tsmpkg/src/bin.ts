#!/usr/bin/env node --enable-source-maps
import { parseArgs } from "node:util";
import { init } from "./init/index.js";
import { dev } from "./dev/index.js";
import { fix } from "./fix/index.js";
import { check } from "./check/index.js";
import chalk from "chalk";

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
  case "fix": {
    await fix(process.cwd());
    break;
  }
  case "check": {
    await check(process.cwd());
    break;
  }
  default: {
    console.info("Usage: " + chalk.bgGray`tsmpkg init|dev|fix|check`);
    break;
  }
}
