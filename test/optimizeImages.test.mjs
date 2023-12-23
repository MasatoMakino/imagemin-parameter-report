import test from "node:test";
import assert from "node:assert";

import { readdir } from "node:fs/promises";
import { promisify } from "util";
import { exec } from "child_process";
const execPromise = promisify(exec);

test("testImageOptim", async () => {
  await execPromise("npm run imageOptim");

  // dist以下のすべてのファイル
  const files = await readdir("./dist", { recursive: true });

  // 画像ファイルとjsonファイルが出力されていることを確認
  const imageFiles = files.filter(
    (file) => file.endsWith(".png") || file.endsWith(".jpg")
  );
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  assert(imageFiles.length > 0, "No image files found in dist directory");
  assert(jsonFiles.length > 0, "No json files found in dist directory");
});
