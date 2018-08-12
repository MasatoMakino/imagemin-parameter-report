const path = require("path");
const compress = require("compression");
const bs = require("browser-sync").create();

const distDir = path.resolve(process.cwd(), "dist");

bs.init({
  server: distDir,
  watch: true,
  middleware: [compress()]
  // httpModule: 'http2',
  // https: true
});
