const { build } = require("esbuild");

// See: https://github.com/evanw/esbuild/issues/1051
const nativeNodeModulesPlugin = {
  name: "native-node-modules",
  setup(build) {
    build.onResolve({ filter: /\.node$/, namespace: "file" }, (args) => ({
      path: require.resolve(args.path, { paths: [args.resolveDir] }),
      namespace: "node-file",
    }));
    build.onLoad({ filter: /.*/, namespace: "node-file" }, (args) => ({
      contents: `
        import path from ${JSON.stringify(args.path)}
        try { module.exports = require(path) }
        catch {}
      `,
    }));
    build.onResolve({ filter: /\.node$/, namespace: "node-file" }, (args) => ({
      path: args.path,
      namespace: "file",
    }));
    let opts = build.initialOptions;
    opts.loader = opts.loader || {};
    opts.loader[".node"] = "file";
  },
};

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
    plugins: [nativeNodeModulesPlugin],
    incremental: true,
    minify: true,
    outdir: "./build/",
  }).catch(() => process.exit(1));

  process.exit(0);
})();
