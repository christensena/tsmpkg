import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    bin: "src/bin.ts",
  },
  minify: true,
  sourcemap: true,
  target: "node18",
  format: "esm",
  clean: true,
  dts: true,
});
