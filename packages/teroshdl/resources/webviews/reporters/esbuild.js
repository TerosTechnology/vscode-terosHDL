const { build } = require("esbuild");
const path = require("path");

//@ts-check
/** @typedef {import('esbuild').BuildOptions} BuildOptions **/

/** @type BuildOptions */
const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production",
};

// Config for webview source code (to be run in a web-based context)
/** @type BuildOptions */
const webviewConfigLogs = {
  ...baseConfig,
  target: "es2020",
  format: "esm",
  entryPoints: [path.join(__dirname, "logs", "logs.ts")],
  outfile: path.join(__dirname, "logs", "wb", "webviewLogs.js"),
};

const webviewConfigTimingReport = {
  ...baseConfig,
  target: "es2020",
  format: "esm",
  entryPoints: [path.join(__dirname, "timing", "timing.ts")],
  outfile: path.join(__dirname, "timing", "wb", "webviewTimingReport.js"),
};

const webviewConfigTimingDetails = {
  ...baseConfig,
  target: "es2020",
  format: "esm",
  entryPoints: [path.join(__dirname, "timing", "timing_details.ts")],
  outfile: path.join(__dirname, "timing", "wb", "webviewTimingDetails.js"),
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
        ...webviewConfigLogs,
        ...webviewConfigTimingReport,
        ...webviewConfigTimingDetails,
        ...watchConfig,
      });
      console.log("[watch] build finished");
    } else {
      // Build extension and webview code
      await build(webviewConfigLogs);
      await build(webviewConfigTimingReport);
      await build(webviewConfigTimingDetails);
      console.log("build complete");
    }
  } catch (err) {
    console.log(err);
    // process.stderr.write(err.stderr);
    process.exit(1);
  }
})();