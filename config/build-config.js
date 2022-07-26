const { build } = require("esbuild");

(async () => {
  await build({
    bundle: true,
    sourcemap: false,
    platform: "node",
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    },
    entryPoints: ["./server/index.ts"],
    incremental: true,
    minify: true,
    outdir: "./build/",
  }).catch(() => process.exit(1));

  process.exit(0);
})();
