const { build } = require("esbuild");
const path = require("path");
const aliasPlugin = require('esbuild-plugin-alias');

//@ts-check
/** @typedef {import('esbuild').BuildOptions} BuildOptions **/

/** @type BuildOptions */
const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production",
};

// Config for extension source code (to be run in a Node-based context)
/** @type BuildOptions */
const extensionConfig = {
  ...baseConfig,
  platform: "node",
  mainFields: ["module", "main"],
  format: "cjs",
  entryPoints: [path.join(__dirname, "src", "extension.ts")],
  outfile: path.join(__dirname, "build", "extension.js"),
  external: ["vscode", "node-fetch", "web-worker", "@yowasp/yosys"],
  bundle: true,
  sourcemap: true,
  plugins: [
    aliasPlugin({
      'colibri': path.resolve(__dirname, '../colibri/src')
    })
  ],
};

// This watch config adheres to the conventions of the esbuild-problem-matchers
// extension (https://github.com/connor4312/esbuild-problem-matchers#esbuild-via-js)
/** @type BuildOptions */
const watchConfig = {
  watch: {
    onRebuild(error, result) {
      console.log("[watch] build started");
      if (error) {
        error.errors.forEach((error) =>
          console.error(
            `> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`
          )
        );
      } else {
        console.log("[watch] build finished");
      }
    },
  },
};

// Build script
(async () => {
  const args = process.argv.slice(2);
  try {
    if (args.includes("--watch")) {
      // Build and watch extension and webview code
      console.log("[watch] build started");
      await build({
        ...extensionConfig,
      });
      console.log("[watch] build finished");
    } else {
      // Build extension and webview code
      await build(extensionConfig);
      console.log("build complete");
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
