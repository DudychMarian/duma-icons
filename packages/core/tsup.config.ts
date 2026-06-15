import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    metadata: "src/metadata.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  treeshake: true,
  splitting: true,
  outDir: "dist",
});
