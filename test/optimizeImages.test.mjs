import test from "node:test";
import assert from "node:assert";

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { promisify } from "util";
import { exec } from "child_process";
const execPromise = promisify(exec);

test("testImageOptim", { concurrency: true }, async () => {
  await execPromise("npm run imageOptim");

  // dist以下のすべてのファイル
  const files = await readdir("./dist", { recursive: true });

  // 画像ファイルとjsonファイルが出力されていることを確認
  const jpgFiles = files.filter((file) => file.endsWith(".jpg"));
  const webpFiles = files.filter((file) => file.endsWith(".webp"));
  const existsJson = existsSync("./dist/report.json");

  assert(jpgFiles.length > 0, "No jpeg files found in dist directory");
  assert(webpFiles.length > 0, "No WebP files found in dist directory");
  assert(existsJson, "report.json file not found in dist directory");

  const reportJson = JSON.parse(await readFile("./dist/report.json", "utf-8"));
  assert(
    reportJson["img/jpg/128x64.jpg"],
    '"img/jpg/128x64.jpg" field not found in report.json'
  );
});

test("sass", { concurrency: true }, async () => {
  await execPromise("npm run sass:release");
  assert(
    existsSync("./dist/css/main.css"),
    "main.css file not found in dist/css directory"
  );
});

test("bundle javascript files", { concurrency: true }, async () => {
  await execPromise("npm run javascript:production");
  assert(
    existsSync("./dist/js/main.js"),
    "main.js file not found in dist directory"
  );
  assert(
    existsSync("./dist/index.html"),
    "index.html file not found in dist directory"
  );
});
