// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "lib",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/bit.js"),
      name: "BinaryIndexedTree",
      // the proper extensions will be added
      fileName: "bit",
    },
  },
});
