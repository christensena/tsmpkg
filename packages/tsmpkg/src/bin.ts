#!/usr/bin/env node
import { parseArgs } from "node:util";
import { init } from "./init.js";
import { dev } from "./dev.js";
import { fix } from "./package.js";
import { check } from "./check/packageJson.js";

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
    await fix(process.cwd(), { supportCjs: true });
    break;
  }
  case "check": {
    await check(process.cwd());
    break;
  }
  default: {
    console.info("tsmpkg init|dev|fix");
    break;
  }
}
